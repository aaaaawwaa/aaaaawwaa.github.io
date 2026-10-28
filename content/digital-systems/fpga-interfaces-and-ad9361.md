---
title: 外设与射频接口
description: 从 UART 帧格式与中点采样、FIFO 缓冲与跨时钟域、PLL 时钟调用，到 AD9361 零中频收发链、数字接口、IQ 信号与调制失真的完整系统视角，并给出 MATLAB 黄金模型与 RTL 逐点比对的验证方法。
tags:
  - digital-systems
  - fpga
  - interfaces
---

## 为什么需要接口这一层

RTL 写对寄存器与状态机只是第一步，真正让设计活起来的是接口：数据以什么帧格式进出、采样发生在哪个时刻、两侧时钟不一致怎么办、时钟从哪来。本文串起三类典型接口：**UART/RS232**（低速异步串行，回答"没有共享时钟如何对齐并逐位采样"）、**FIFO IP 核**（跨时钟域与位宽/带宽不匹配的缓冲）、**PLL/MMCM 与 AD9361**（高速时钟链与射频前端）。

文中时序图来自课程笔记：UART、FIFO 部分是 WaveDrom 重绘的**理论示意**，AD9361 相关为概念说明，**都不是 RTL 仿真波形**；寄存器配置与接口时序细节必须回到 UG-570 与评估板文档核对，本文不声称完成过某次实测。

## UART/RS232：协议层与电气层要分开

UART（Universal Asynchronous Receiver/Transmitter）规定的是**帧格式**：发送时把并行数据转成串行，接收时把串行还原为并行；双方没有共享时钟线，靠起始位对齐、靠约定波特率各自计时。而"串口"通常指 **UART 帧格式 + RS-232 物理接口**的组合。

| 层次 | 规定内容 | 例子 |
| --- | --- | --- |
| 帧格式/数据链路 | 起始位、数据位、校验位、停止位、位顺序、波特率 | UART |
| 电气标准 | 电压范围、单端或差分、连接器、传输距离 | RS-232、RS-422、RS-485 |
| 芯片引脚电平 | 3.3 V LVCMOS、5 V TTL | FPGA / MCU 的 I/O |

FPGA 的 I/O 是 3.3 V LVCMOS，而 RS-232 用正负十几伏表示逻辑，**不能直接相连**，需要 MAX3232/MAX232 之类电平转换；USB 转串口模块（CH340、CP2102 等）输出 TTL 电平，可直接接 FPGA，但要注意 3.3 V/5 V 兼容。实际接线只需三根：TX 与 RX 交叉、双方共地；DB9 输出的是 RS-232 电平，直接接 FPGA 可能损坏 I/O。

![串口三线连接示意：本机 TXD 接对方 RXD、本机 RXD 接对方 TXD，并且必须共地；图中为课程笔记的示意图，不是仿真波形](vault-notes/assets/uart-rs232/fig-01.png)

### 帧结构：8N1 与位时间

一帧由空闲（1，≥1 bit）、起始位（0，1 bit，下降沿标志开始）、数据位（5~9 bit，常用 8 位，**低位先发**）、可选校验位、停止位（1，常用 1 bit）组成。

**8N1** 表示 8 位数据、无校验、1 位停止位，一帧共 10 位。发送 `0xA5`（二进制 `1010_0101`）时，低位先发，线上 b0~b7 的顺序是 **1, 0, 1, 0, 0, 1, 0, 1**。

![8N1 帧格式的理论时序示意：以 115200 baud 发送 0xA5 为例，起始位为 0、数据位 LSB 先发、停止位为 1；每格 1 bit，T_bit 约 8.68 us，整帧 10 bit 约 86.8 us；这是 WaveDrom 理论示意图，不是 RTL 仿真波形](vault-notes/assets/uart-rs232/fig-03.svg)

位时间 $T_{bit}=1/f_{baud}$（$f_{baud}$ 为波特率），UART 每个码元只携带 1 bit，所以波特率与比特率数值相等：9600 baud 时 $T_{bit}\approx104.17$ us、8N1 一帧约 1.042 ms；115200 baud 时 $T_{bit}\approx8.68$ us、8N1 一帧约 86.8 us。

### 分频系数与误差预算

FPGA 内部没有现成的"波特率时钟"，要从系统时钟分频：

```verilog
// 例：50 MHz 系统时钟、115200 baud
localparam integer BAUD_CNT_MAX = 50_000_000 / 115200;   // 434
// 实际波特率 = 50 MHz / 434 = 115207.4 bps，相对误差约 +0.0064%
```

常见取值：50 MHz 对 9600 的理论分频比 5208.33、取整 5208，实际 9600.6（+0.0064%）；50 MHz 对 115200 为 434.03、取整 434，实际 115207.4（+0.0064%）；27 MHz 对 115200 为 234.375、取整 234，实际 115384.6（+0.16%）。

收发双方误差会累积：8N1 一帧最后一个采样点约在 9.5 个位时间处，理论上相对误差要小于 $0.5/9.5\approx5.3\%$；工程上建议控制在 **2% 以内**，给噪声与边沿抖动留余量。PC 串口助手、FPGA 分频系数、开发板晶振频率三者必须一致。

### 接收时序：半位复检与中点采样

接收端没有时钟线，只能靠起始位下降沿与本地计数器完成对齐：空闲时 RXD 保持 1；检测到下降沿后延时约 $T_{bit}/2$ 再采样，仍为 0 才确认起始位（回到 1 则判为毛刺）；之后每隔 $T_{bit}$ 在每位**中点**采样数据位；可选采样校验位并比较；采样停止位，为 0 则报帧错误；回到空闲等待下一帧。

![UART 接收中点采样的理论示意：每位被细分为 3 格示意采样位置，采样脉冲击中每位中点，起始位经半位复检后才确认；实际实现用波特率计数器，图中不是 RTL 仿真波形](vault-notes/assets/uart-rs232/fig-04.svg)

为什么在中点采样：起始位下降沿与每位边界最容易受边沿抖动、上升/下降时间影响，位中点离两侧边沿最远，采样最稳。工程实现常用 **16 倍过采样**：每位 16 个节拍，在中心附近取 3 个点做多数表决，降低单点噪声误判。

> [!warning] RXD 是异步信号，必须先同步
> RXD 相对系统时钟是异步的，直接进状态机可能因违反建立/保持时间产生**亚稳态**，标准做法是先打两拍（两级触发器）再检测边沿。单比特从高速域同步到低速域时两级打拍可能漏采，需要脉冲同步或握手；多比特总线跨时钟域不能逐 bit 打拍，要用 FIFO/格雷码（见 [[digital-systems/timing-analysis-and-constraints|时序分析]] 的 CDC 一节）。

发送与接收都可以用状态机实现：发送依次是 IDLE、START、DATA0…DATA7、STOP、IDLE，每个 baud_tick 输出一位；接收对称，在停止位中点后产生一拍 rx_valid。Echo 顶层把 RX 输出直接接到 TX 输入，就是 [[projects/uart-loopback-project|UART 回环项目]] 的结构。

## FIFO IP 核：跨时钟域与速率匹配

FIFO（先入先出）是数据缓冲器：写入顺序与读出顺序一致。它主要解决两类问题：**跨时钟域**（A、B 模块用不同时钟，不能直接通信）与**位宽/带宽不匹配**（前后级位宽不同或瞬时速率不同）。

按读写时钟是否相同分为**同步 FIFO（SCFIFO）**与**异步 FIFO（DCFIFO）**。调用 FIFO Generator 时最需要关注的配置是：

| 配置 | 要点 |
| --- | --- |
| 读模式 | Standard FIFO 读数据滞后一个时钟周期；First-Word Fall-Through（FWFT）为 0 延迟 |
| 读写位宽 | 读位宽 × 读深度 = 写位宽 × 写深度 |
| 复位与状态 | 一般用同步复位；基本标志 full/empty，可选 almost-full/almost-empty 水印与 Data Count |

![FIFO 用于跨时钟域的示意：A、B 模块采用不同时钟时不能直接通信，通过 FIFO 间接传递数据；图中为课程笔记的示意图，不是仿真波形](vault-notes/assets/fifo-ip-core/fig-01.png)

例化时端口名以 IP 生成的模板为准（`clk`、`srst`、`din`、`wr_en`、`rd_en`、`dout`、`full`、`empty`、`data_count`）。异步 FIFO 是跨时钟域传多比特数据的标准方案：写指针与读指针各自在自己的时钟域内计数，空满标志由格雷码同步得到，避免多位同时跳变。**不要用两级触发器逐 bit 同步多位总线**，那会造成数据字撕裂。

## PLL/MMCM：时钟从哪来

FPGA 内部时钟不应从普通 I/O 或逻辑布线取，而要走专用时钟网络。工程上通过 IP 目录的 Clocking Wizard 例化 MMCM/PLL：输入参考时钟（板上晶振经专用时钟引脚）、设置输出频率与相位（MMCM 支持分数分频与精细相位，PLL 只支持整数分频）、用 `locked` 作为"时钟已稳定"握手信号参与复位释放、输出经 BUFG 等全局缓冲送到全芯片。频率关系、8 个相位抽头与 `locked` 的处理细节见 [[digital-systems/fpga-architecture-and-eda|FPGA 结构与 EDA 流程]]。课程笔记中的 PLL 调用篇目只保留了标题、暂无正文，本节按器件结构与 Vivado 流程的通用做法补足；实际端口名以 Clocking Wizard 生成的模板为准。

## AD9361：从射频到 IQ 的完整信号链

AD9361 是宽带、可编程、**零中频（Zero-IF）**架构的 RF Agile Transceiver，面向软件无线电与 2×2 MIMO。它不是"一个高速 ADC 加一个 DAC"，而是从天线端到复基带接口的一整套可配置收发机：两路 RX、两路 TX、正交混频器、12 位 ADC/DAC、模拟基带滤波、可编程 128 抽头 FIR、半带滤波器与抽取/插值链、RF PLL、BBPLL、增益控制与片上校准。

关键规格：RX 射频约 70 MHz～6.0 GHz、TX 约 47 MHz～6.0 GHz（LO 决定信号搬移到哪个频段）；通道带宽从窄带配置到 56 MHz 级别，由模拟滤波器、数字 FIR 与采样率共同决定；转换器为 12 位 ADC/DAC；控制接口是 SPI（不承载高速 IQ）；数据接口为 CMOS 或 LVDS 并行。具体数值以所用版本数据手册与硬件配置为准。

### 收发链路与采样率



接收链的采样率关系（概念式，可用组合受 UG-570 限制）：

$$
F_{BB,RX}=\frac{F_{ADC}}{D_{HB3}D_{HB2}D_{HB1}D_{FIR}}
$$

发送方向是逆过程：FPGA 输出 IQ → 数字接口 → TX FIR → HB1/HB2/HB3 插值 → DAC → 模拟基带 → 正交上变频 → 功放/天线，满足

$$
F_{DAC}=F_{BB,TX}I_{FIR}I_{HB1}I_{HB2}I_{HB3}
$$

配置新的 IQ 采样率时，实际要同时找到一组相互匹配的参数：BBPLL 频率（约 715 MHz～1.430 GHz）、ADC/DAC 时钟、半带滤波器倍率、FIR 抽取/插值倍率、FPGA 接口时钟、模拟滤波与信道带宽。**改任意一个环节都要重新核对整条时钟链**。推荐的思考顺序：目标 RF 带宽 → 目标 IQ 采样率 → FIR 抽取/插值 → 半带组合 → 反推 ADC/DAC 时钟 → BBPLL 与分频 → 检查数字接口速率与 FPGA 时序。

### 三组容易混淆的概念

1. **射频中心频率** $f_{LO}$：由 RF PLL 决定，例如 2.4 GHz，描述信号位于哪个频段；
2. **IQ 复采样率** $F_s$：I、Q 两路每秒各多少样本；复基带占据 $[-B/2,+B/2]$ 时理想最低 $F_s\ge B$，工程上还要为过渡带留余量；
3. **信道带宽** $B$：受 RF 前端、模拟滤波器、数字 FIR 通带/阻带、ADC/DAC 奈奎斯特范围共同限制。

频率搬移的例子（约定 $x[n]=I[n]+jQ[n]$、射频表达式为 $\operatorname{Re}\{x(t)e^{j\omega_ct}\}$）：LO 为 2.4 GHz、基带复单音为 $+1$ MHz 时，理想目标频率为 2.401 GHz；若实际频谱出现在 2.399 GHz，应优先检查 Q 符号、I/Q 顺序、NCO 方向与接口数据解释。**符号约定必须全系统统一**：坐标定义、本地载波相位、NCO 相位递增方向、混频公式、FFT 频率方向、I/Q 接口顺序。

### 数字接口：控制面与数据面

典型信号：P0_D[11:0]/P1_D[11:0] 并行数据端口（关注位宽、通道映射、I/Q 顺序）；DATA_CLK 数据采样相关时钟（来源、有效边沿、占空比）；FB_CLK 反馈/发送时钟相关信号（TX 时序与相位）；RX_FRAME/TX_FRAME 帧边界或样本组织指示（与数据边沿对齐）；TXNRX 是 TDD 收发方向控制；ENABLE 控制数据接口使能。

四个互相独立的维度要分开记：**CMOS/LVDS** 是电气层；**SDR/DDR** 是时钟边沿（DDR 两个边沿都传数据，FPGA 常用 IDDR/ISERDES）；**FDD/TDD** 是收发调度；**单端口/双端口**是数据组织。不能从"12 位 ADC"直接推断接口上的固定排列，必须按当前模式的时序图与数据映射表解码。

吞吐率估算：$N_{ch}$ 个通道、每通道 I/Q 各 $N_{bit}$ 位、复采样率 $F_s$，则原始有效负载

$$
R_{payload}=N_{ch}\times2\times N_{bit}\times F_s
$$

双通道、12 位、30.72 MSPS 时约为 $2\times2\times12\times30.72\ \text{Mbit/s}=1.47456\ \text{Gbit/s}$。这还没算帧/空闲、对齐填充、DMA 与协议开销；实际搬运常按 16 位对齐，带宽还会增加。DDR 能降低物理时钟频率，但**不会减少每秒必须传的有效 IQ 比特数**。

FPGA 端建议分层：io_capture（CMOS/LVDS、SDR/DDR、I/O 延迟）→ frame_align（帧边界、复位后初始相位）→ iq_unpack（位域提取、I/Q 与通道恢复、iq_valid）→ sign_extend（有符号补码）→ channel_align（保证同一采样编号，可加 sample counter）→ cdc_fifo（异步 FIFO 切到处理时钟域）。调试时保留原始 IQ 副本，便于 ILA 观察与和 MATLAB/Python 参考结果比对。TDD 切换可看成时序状态机：IDLE → RX_ACTIVE → TURNAROUND → TX_ACTIVE → TURNAROUND，每次切换都要考虑模拟链路稳定时间、接口方向切换、FIFO 排空填充、首个有效样本帧位置与外部开关/功放使能。

## IQ 信号、镜像与调制失真

ADC/接口给出的是有符号补码样本，复基带表示为

$$
x(t)=I(t)+jQ(t)=A(t)e^{j\phi(t)},\qquad A=\sqrt{I^2+Q^2},\ \phi=\operatorname{atan2}(Q,I)
$$

实信号的频谱共轭对称，而复信号可以区分正、负频率：复基带正频率对应 LO 上方边带，负频率对应下方边带。IQ 调制正是利用两路正交载波的相消，只保留一个边带；实际系统的增益误差、相位误差与时延误差破坏这种相消，于是产生**镜像泄漏**。

常用指标：镜像抑制度 $IRR=10\log_{10}(P_{desired}/P_{image})$（dB），误差矢量幅度 $EVM_{RMS}=\sqrt{\sum|z_k-\hat z_k|^2/\sum|\hat z_k|^2}$；只有 AWGN 且同步理想时近似有 $SNR\approx1/EVM_{RMS}^2$，实际 EVM 还含频偏、相位噪声、非线性与定时误差。

一种实用的 IQ 误差模型：

$$
z_m[n]=\alpha z[n]+\beta z^*[n]+d
$$

其中 $\alpha z[n]$ 是期望信号，$\beta z^*[n]$ 是共轭镜像分量，$d$ 是 I/Q 直流偏置。对应到星座图：整体平移多为 DC/LO 泄漏；整体固定旋转多为载波相位偏差；持续旋转多为载波频偏；圆变椭圆多为 IQ 增益不匹配；坐标轴倾斜多为正交相位误差；外层 QAM 点向内收缩多为功放或 DAC 压缩。

![IQ 星座与失真形态示意：BPSK、QPSK、16QAM 的理想星座，以及 AWGN、IQ 增益失衡和载波频偏造成的典型形态；该图为课程笔记中的静态示意图，不是本次实测结果](vault-notes/assets/iq-signals/fig-01.png)

## 用黄金模型验证数字调制链路

数字调制的验证目标不是"波形看起来像 QPSK"，而是：

$$
\text{RTL 输出}[n]\equiv\text{MATLAB 参考}[n],\quad\forall n
$$

逐点整数相等，不允许"接近"。实验的关键是先把**接口契约**冻结下来，再两边独立实现：

| 项目 | 本实验取值 |
| --- | --- |
| 复数符号约定 | $x=I+jQ$ |
| 数据格式与刻度 | 有符号 12 位补码，$SCALE=256$ |
| 模式编号 | 0=BPSK、1=QPSK、2=QAM4、3=QAM16、4=QAM64 |
| 比特到索引 | MSB 优先 |
| PRBS | $x^7+x^6+1$，周期 127，初值 1，输出取最低位 |
| 每符号保持 | 生产值 5000，快速检查用 5 |

要点：QAM16/QAM64 的电平必须与 MATLAB 逐一对齐（$SCALE=256$ 时 QAM16 为 $\pm256,\pm768$，QAM64 为 $\pm256,\pm768,\pm1280,\pm1792$，最大值 1792 小于 12 位有符号上限 2047）；PRBS7 的抽头、移位方向、初值、输出位有一处不同序列就完全不同，先单独验证"127 个状态互不相同、第 128 个回到初值"；BPSK 的 Q 恒为 0，最容易暴露 Q 通道错误。

用 Vivado 的 xvlog → xelab → xsim 三步跑通，testbench 按固定格式打印每个符号边界的值，比对程序解析日志后与 MATLAB 参考模型逐点比较：每个模式恰好 127 条有序记录、5 个模式全部相等才算通过。快速结构检查（每符号保持 5 拍）只证明计数器与查找表正确，不能替代生产参数下的长跑验证。

> [!warning] 不要声称"仿真通过"就等于正确
> 只看波形像正弦、星座"大致像 QPSK"，或 PASS 只检查结构而不比对数值，都不算验证。本文介绍的是笔记中的可复现方法；**本站未执行该实验，也没有实测证据**，实际结论以你自己的仿真日志与比对脚本为准。

## 前置与相关

- 前置：[[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]]、[[digital-systems/fsm-design|有限状态机设计]]。
- 时序与约束：[[digital-systems/timing-analysis-and-constraints|静态时序分析与约束]]（CDC、异步 FIFO、源同步接口）。
- 器件与工具：[[digital-systems/fpga-architecture-and-eda|FPGA 结构与 EDA 流程]]、[[digital-systems/vivado-design-flow|Vivado 设计流程]]。
- 跨学科：[[communication/digital-modulation-qpsk|数字调制 QPSK]]、[[signal-processing/dft-and-fft|DFT 与 FFT]]、[[signal-processing/signals-and-systems-intro|信号与系统导论]]。

## 来源与延伸阅读

- [[vault-notes/fpga/architecture/uart-rs232|串口 UART（RS232）]]：帧格式、波特率误差、收发状态机与 FPGA 实现。
- [[vault-notes/fpga/architecture/fifo-ip-core|FIFO 核]]：同步/异步 FIFO、读模式与状态标志配置。
- [[vault-notes/fpga/architecture/pll-ip-core|PLL IP 核的调用]]：源笔记仅有标题、暂无正文可融合；时钟内容见 sta/02 与 Vivado 流程。
- [[vault-notes/fpga/ad9361/ad9361-architecture|AD9361 学习笔记]]：零中频收发链、时钟体系、校准与调试。
- [[vault-notes/fpga/ad9361/ad9361-digital-interface|AD9361 数字接口]]：SPI 与并行接口、CMOS/LVDS、SDR/DDR、吞吐率与解包。
- [[vault-notes/fpga/ad9361/iq-signals|IQ 信号]]：正交基、星座图、EVM 与 IQ 失衡模型。
- [[vault-notes/fpga/ad9361/iq-signals-lab-matlab-rtl|IQ 信号实验实战（MATLAB+RTL）]]：黄金模型、PRBS7、逐点比对与验收。
