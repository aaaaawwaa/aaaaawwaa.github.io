---
title: "串口-UART(RS232)"
type: concept
status: learning
subjects:
- FPGA
domains:
- 硬件实现
- 数字系统
tags:
- FPGA
- UART
- 串口
- RS232
- 异步通信
aliases:
- UART
- 通用异步收发传输器
- 串口
prerequisites: []
related: []
---

# 串口简介

通用异步收发传输器，英文全称 Universal Asynchronous Receiver/Transmitter，简称 UART。

UART 是异步串行通信的硬件模块与帧格式规范：**发送时把并行数据转换为串行数据，接收时把串行数据还原为并行数据**。它本身不规定电压和连接器，常说的“串口”通常是 **UART 帧格式 + RS-232 物理接口** 的组合。

UART 的“异步”体现在：收发双方**没有共享的时钟线**，而是靠起始位对齐、靠双方约定的波特率各自计时。

## 1.1 协议层与电气层要分开

| 层次 | 规定内容 | 例子 |
| --- | --- | --- |
| 帧格式 / 数据链路 | 起始位、数据位、校验位、停止位、位顺序、波特率 | UART |
| 电气标准 | 电压范围、单端或差分、连接器、传输距离 | RS-232、RS-422、RS-485 |
| 芯片引脚电平 | 3.3 V LVCMOS、5 V TTL | FPGA / MCU 的 I/O |

常见的串行接口标准包括 **RS-232、RS-449、RS-423、RS-422、RS-485** 等。它们规定的是电气与机械特性，UART 决定的是数据帧怎么排。FPGA 实验最常用的是 RS-232（DB9 或 USB 转串口）和 RS-485（差分总线）。

## 1.2 常见标准对比

| 项目 | RS-232 | RS-422 | RS-485 |
| --- | --- | --- | --- |
| 传输方式 | 单端 | 差分 | 差分 |
| 双工 | 全双工 | 全双工 | 半双工（四线可全双工） |
| 典型节点数 | 2 | 1 发 10 收 | 32（高阻收发器可到 128） |
| 标准距离量级 | 约 15 m | 约 1200 m | 约 1200 m |
| 电平 | ±3 ~ ±15 V | 差分 ±2 ~ ±6 V | 差分 ±1.5 ~ ±5 V |
| 典型场景 | PC 串口、调试口 | 工业点对点 | 多机总线、远距离 |

> [!note] 表中的距离和速率会随收发器、线缆和波特率变化，这里只给出标准上限的量级，不是绝对限制。

# 串口通信方式

UART 可以实现**全双工通信**：发送和接收使用各自独立的信号线，可以同时进行。

![[vault-notes/assets/uart-rs232/fig-01.png]]

## 2.1 三线连接

实际接线只需要三根线：

1. **交叉连接**：本机的 TXD 接对方的 RXD，本机的 RXD 接对方的 TXD。图中 PC 的 tx 接 FPGA 的 rx，FPGA 的 tx 接 PC 的 rx。
2. **共地**：两个设备必须连接 GND，否则电平没有共同参考点，数据会随机出错。
3. **可选流控**：RTS/CTS 用于硬件流控，DTR/DSR/DCD/RI 多用于 Modem。大多数 FPGA 串口实验只使用 TXD、RXD、GND。

## 2.2 电平转换

FPGA 的 I/O 是 3.3 V LVCMOS（部分开发板兼容 5 V TTL），而 RS-232 使用正负十几伏的电压，两者不能直接相连。

| 位置 | 电平 | 空闲状态 |
| --- | --- | --- |
| FPGA / MCU 引脚 | 3.3 V LVCMOS（部分 5 V TTL） | 高电平 |
| RS-232 电缆 | -3 ~ -15 V 或 +3 ~ +15 V | 负电压（逻辑 1） |
| 电平转换芯片 | MAX3232（3.3 V）、MAX232（5 V） | — |
| USB 转串口模块 | CH340、CP2102、FT232 等，输出 TTL | 高电平 |

> [!warning] 不要把 RS-232 直接接到 FPGA 引脚
> DB9 接口输出的是 RS-232 电平，直接接 FPGA 可能损坏 I/O。需要 MAX3232 之类的收发器；如果开发板上是 USB 转串口芯片，它输出的是 TTL 电平，可以接 FPGA，但要注意 3.3 V / 5 V 兼容性。

# RS-232 接口定义

RS-232 常用 DB9 连接器，引脚定义如下（方向以 DTE 为参考）：

| 序号  | 名称           | 符号         | 数据方向    | 说明                                                          |
| --- | ------------ | ---------- | ------- | ----------------------------------------------------------- |
| 1   | 载波检测         | DCD        | DCE→DTE | Data Carrier Detect，DCE 告知 DTE 是否检测到载波                      |
| ==🟡2==   | ==🟡接收数据==         | ==🟡<u>RXD</u>== | ==🟡DCE→DTE== | ==🟡Receive Data，数据接收信号，即输入。==                                    |
| ==🟡3==   | ==🟡发送数据==         | ==🟡<u>TXD</u>== | ==🟡DTE→DCE== | ==🟡Transmit Data，数据发送信号，即输出。两个设备的 TXD 与 RXD 应交叉相连。==                |
| 4   | 数据终端（DTE）就绪 | DTR        | DTE→DCE | Data Terminal Ready，DTE 告知 DCE 本机已准备好                      |
| 5   | 信号地          | GND        | —       | 地线，两个通讯设备之间必须共地                                         |
| 6   | 数据装置（DCE）就绪 | DSR        | DCE→DTE | Data Set Ready，DCE 告知 DTE 本机已上电待命                          |
| 7   | 请求发送         | RTS        | DTE→DCE | Request To Send，DTE 请求向 DCE 发送数据                          |
| 8   | 允许发送         | CTS        | DCE→DTE | Clear To Send，DCE 回应 RTS，告知对方可以发送                          |
| 9   | 响铃指示         | RI         | DCE→DTE | Ring Indicator，DCE 告知 DTE 线路有振铃                            |

> [!note] 实际接线
> FPGA 串口实验通常只用 **2（RXD）、3（TXD）、5（GND）**。其余引脚用于硬件流控或 Modem 控制，不用时可以悬空。

## 3.1 电平定义

| 逻辑 | RS-232 电平 | 名称 |
| --- | --- | --- |
| 1 | -3 ~ -15 V | MARK（传号） |
| 0 | +3 ~ +15 V | SPACE（空号） |

- 接收器的判决门限约为 ±3 V，介于 -3 V 和 +3 V 之间属于不确定区。
- 线路空闲时保持**逻辑 1**，对应 RS-232 的负电压。
- 用示波器测量时，DB9 上的空闲电平是负电压；经过 MAX3232 之后，FPGA 引脚上的空闲电平是高电平，两者不要混淆。
- 标准规定 15 m、20 kbps 以内；实际可达更高，但长线、高波特率仍需要合适的收发器和线缆。

# 串口帧结构

![[vault-notes/assets/uart-rs232/fig-02.png]]

UART 一帧由以下部分组成：

| 字段 | 电平 | 长度 | 说明 |
| --- | --- | --- | --- |
| 空闲 | 1 | ≥ 1 bit | 无数据时线路保持高电平 |
| 起始位 | 0 | 1 bit | 下降沿标志一帧开始 |
| 数据位 | 0 / 1 | 5 ~ 9 bit（常用 8） | **低位先发（LSB first）** |
| 校验位 | 0 / 1 | 0 或 1 bit | 可选，奇校验或偶校验 |
| 停止位 | 1 | 1、1.5 或 2 bit | 常用 1 bit |
| 空闲 / 下一帧 | 1 | ≥ 1 bit | 可以紧跟下一帧的起始位 |

- 一帧长度 = 1（起始位）+ 数据位 + 校验位 + 停止位。
- **8N1** 表示 8 位数据、无校验、1 位停止位，一帧共 10 位。
- 数据位**低位先发**：发送 0x01 时，线上最先出现的是 b0=1。
- 起始位是线路从空闲 1 跳变到 0 的那个下降沿；接收端靠它完成位对齐。
- 停止位必须为 1；如果接收端在停止位采样到 0，说明帧错位或波特率不匹配，记为帧错误（framing error）。
- 校验位只能发现奇数个比特错误，不能纠错。
- 连续发送时，上一帧的停止位后可以直接跟下一帧的起始位（back-to-back），接收端要能处理。

## 4.1 8N1 帧时序

![[vault-notes/assets/uart-rs232/fig-03.svg|800]]

以发送 0xA5、115200 baud 为例：

- 0xA5 = `1010_0101`，低位先发，线上 b0 ~ b7 的顺序是 **1, 0, 1, 0, 0, 1, 0, 1**。
- 起始位为 0，停止位为 1，无校验。
- 每格 1 bit，T_bit = 1 / 115200 ≈ **8.68 µs**，整帧 10 bit ≈ **86.8 µs**。
- 假设：TTL 电平、空闲为 1、边沿理想。这是 WaveDrom 画的理论示意图，不是 RTL 仿真波形；真实波形要用仿真器或逻辑分析仪验证。

## 4.2 9 位字长与断开帧

图中 9 位字长 / 8 位字长来自某 MCU 手册：M 位选择 8 或 9 位数据，LBCL 控制最后一位的时钟脉冲。这是该芯片的特有位宽控制，不影响通用 UART 帧结构。

- **空闲帧**：线路保持逻辑 1。
- **断开帧（break）**：线路保持 0 的时间超过一整帧，常用作复位、唤醒或注意信号。
- 9 位模式常用于多机通信：第 9 位可以区分地址和数据，或者作为额外的校验位。

# 波特率与位时间

- **波特率**：码元传输速率，单位 Baud（符号 / 秒）。
- **比特率**：信息传输速率，单位 bps（bit / 秒）。
- UART 每个码元只携带 1 bit，所以 **波特率与比特率的数值相等**。
- 只有在多电平调制（如 16-QAM）中两者才不同：比特率 = 波特率 × log₂(M)。
- 位时间 **T_bit = 1 / 波特率**，发送端和接收端都按这个时间计时。

| 波特率 | 位时间 T_bit | 8N1 一帧（10 位） |
| --- | --- | --- |
| 9600 | 104.17 µs | 1.042 ms |
| 19200 | 52.08 µs | 520.8 µs |
| 38400 | 26.04 µs | 260.4 µs |
| 57600 | 17.36 µs | 173.6 µs |
| 115200 | 8.68 µs | 86.8 µs |
| 921600 | 1.085 µs | 10.85 µs |

## 5.1 分频系数怎么算

FPGA 内部没有“波特率时钟”可以直接用，需要从系统时钟分频：

```text
N = f_clk / baud          // 取整数部分
实际波特率 = f_clk / N
相对误差 = (实际波特率 - 目标波特率) / 目标波特率 × 100%
```

| 系统时钟 | 目标波特率 | N = f_clk / baud | 取整 | 实际波特率 | 误差 |
| --- | --- | --- | --- | --- | --- |
| 50 MHz | 9600 | 5208.33 | 5208 | 9600.6 | +0.0064% |
| 50 MHz | 115200 | 434.03 | 434 | 115207.4 | +0.0064% |
| 27 MHz | 115200 | 234.375 | 234 | 115384.6 | +0.16% |
| 100 MHz | 115200 | 868.06 | 868 | 115207.4 | +0.0064% |

几个要点：

- 分频系数取整会带来量化误差，时钟频率越低、波特率越高，误差越大。
- 收发双方的误差会累积。8N1 一帧的最后一个采样点在约 **9.5 T_bit** 处，理论上相对误差要小于 0.5 / 9.5 ≈ **5.3%**；工程上建议控制在 **2% 以内**，给噪声和边沿抖动留余量。
- 16× 过采样不是把 16 倍时钟输出到管脚，而是内部产生 16 倍节拍，用来对齐和多数表决。
- PC 串口助手、FPGA 分频系数、开发板晶振频率三者必须一致；换了板子先确认晶振。

# 接收时序：起始位检测与中点采样

接收端没有时钟线，只能靠 RXD 的起始位下降沿和本地计数器完成对齐：

1. **空闲**：RXD 保持 1，等待下降沿。
2. **起始位确认**：检测到下降沿后，延时约 T_bit/2 再采样；若仍为 0，确认是起始位；若已经回到 1，判为毛刺，返回空闲。
3. **数据位采样**：之后每隔 T_bit 在每位中点采样一次，共采样数据位（通常 8 位）。
4. **校验位**（可选）：采样校验位，并与计算结果比较。
5. **停止位检查**：采样停止位，若为 0 则报帧错误。
6. **回到空闲**：等待下一个起始位；连续帧时停止位后紧接下一帧起始位。

![[vault-notes/assets/uart-rs232/fig-04.svg|700]]

> [!tip] 为什么要在中点采样
> 起始位下降沿和每位边界附近最容易受到边沿抖动、上升/下降时间的影响。位中点离两侧边沿最远，采样最稳。

- 图中每位被细分为 3 格，采样脉冲击中每位中点，仅用于示意采样位置；实际实现用波特率计数器，不需要外部时钟线。
- 常用 **16× 过采样**：每位 16 个节拍，在中心附近取 3 个点（例如第 7、8、9 拍）做多数表决，降低单点噪声误判。
- **RXD 相对 clk 是异步信号**：进入 FPGA 后先打两拍同步，再做边沿检测，避免亚稳态。可参考 [[vault-notes/fpga/verilog/sequential/01-registers]] 中的寄存器写法。
- 起始位半位复检可以过滤短毛刺，但无法过滤与起始位同宽的干扰；必要时增加滤波或提高过采样率。

# FPGA 实现要点

> [!info] 实现顺序建议
> 先做波特率节拍，再做发送，最后做接收；每一步都用仿真验证，不要一次写完整个串口。

| 模块 | 主要输入 | 主要输出 | 关键点 |
| --- | --- | --- | --- |
| 波特率发生器 | clk、rst_n | baud_tick（1× 或 16×） | 计数器 0 ~ N-1 循环，N = f_clk / baud |
| 发送模块 | clk、tx_start、tx_data | txd、tx_busy | 并串转换，LSB first，状态机控制 |
| 接收模块 | clk、rxd | rx_data、rx_valid | 起始位检测、中点采样、串并转换 |
| FIFO（可选） | 写/读时钟、数据 | 缓冲数据 | 跨时钟域或前后带宽不一致时使用 |

发送状态机：

```text
IDLE → START → DATA0 → DATA1 → … → DATA7 → STOP → IDLE
```

- IDLE：txd 保持 1，等待 tx_start。
- START：txd 拉低并保持 1 bit。
- DATA：每个 baud_tick 输出 data[bit_cnt]，bit_cnt 从 0 到 7（低位先发）。
- STOP：txd 拉高并保持 1 bit，然后回到 IDLE。

接收状态机：

```text
IDLE → START → DATA0 → … → DATA7 → PARITY（可选）→ STOP → IDLE
```

- IDLE：等待同步后的 rxd 下降沿。
- START：半位后复检起始位。
- DATA：每位中点采样并移入移位寄存器。
- STOP：检查停止位是否为 1。
- 在停止位中点后产生一拍 rx_valid，通知后续逻辑读取数据。

实现时注意：

- 时序逻辑统一使用非阻塞赋值，参考 [[vault-notes/fpga/verilog/sequential/02-blocking-vs-nonblocking-assignment]]。
- 计数器写法参考 [[vault-notes/fpga/verilog/sequential/03-counters]]，偶数分频参考 [[vault-notes/fpga/verilog/sequential/04-clock-divider-even]]。
- 状态机写法参考 [[vault-notes/fpga/verilog/sequential/10-finite-state-machines]]，一个状态只做一件事。
- 发送和接收可以放在同一个顶层模块里做回环测试，接收数据量大时用 [[vault-notes/fpga/architecture/fifo-ip-core]] 缓冲。

Testbench 建议：

- **回环**：TX 直接接 RX，发送 0x55、0xA5、0x00、0xFF，检查接收值是否一致。
- **时序**：检查每位宽度是否等于 1/baud，采样点是否位于位中点。
- **边界**：连续发送两帧、波特率偏差 ±2%、起始位加毛刺、停止位错误。
- **握手**：确认 rx_valid 只拉高一拍，且数据在 valid 期间保持稳定。

# 常见问题与易错点

> [!warning] 调试串口时优先检查这些
> 1. **TX/RX 没有交叉**：本机 TX 必须接对方 RX，接错时收发都不通。
> 2. **没有共地**：只接 TX/RX 不接 GND，电平没有参考，数据会随机出错。
> 3. **电平不匹配**：RS-232 的 ±12 V 直接接 FPGA 引脚可能损坏 I/O；USB 转串口模块输出的是 TTL，不要和 DB9 的 RS-232 混淆。
> 4. **波特率不一致**：PC 串口助手、FPGA 分频系数、晶振频率三者要对上，注意分频取整后的误差。
> 5. **数据位顺序搞反**：UART 是 LSB first，不是 MSB first；0x01 会先发 1。
> 6. **校验 / 停止位配置不一致**：8N1 对 8E1 会解析出错；停止位不足会报帧错误。
> 7. **在边沿采样**：接收端应在每位中点采样，边沿附近容易受抖动影响。
> 8. **起始位毛刺误触发**：用半位复检和过采样多数表决。
> 9. **RXD 未做同步**：异步输入直接进状态机可能产生亚稳态，先打两拍。
> 10. **连续帧处理不当**：上一帧停止位后可能紧跟下一帧起始位，接收状态机要及时回到 IDLE。
> 11. **把波特率当比特率**：UART 中两者数值相等，但多电平调制中不相等。
> 12. **RS-485 忘记方向控制**：半双工总线需要 DE/RE 切换收发方向，否则总线冲突。

# 术语速查

| 术语 | 含义 |
| --- | --- |
| DTE / DCE | 数据终端设备 / 数据通信设备；PC 通常是 DTE，Modem 是 DCE |
| MARK / SPACE | RS-232 的逻辑 1 / 逻辑 0 |
| 8N1 | 8 位数据、无校验、1 位停止位 |
| LSB first | 低位先发 |
| Break | 线路持续为 0 超过一整帧 |
| Framing error | 停止位采样不到 1，通常是波特率或帧格式不匹配 |
| Overrun | 接收数据未及时读走，新数据覆盖旧数据（常见于 FIFO / 中断处理） |

# 自测

1. 8N1 一帧多少位？115200 baud 下发送 1 字节需要多长时间？
2. 发送 0x5A，线上 b0 ~ b7 的顺序是什么？
3. 为什么起始位要在半位后复检？中点采样有什么好处？
4. 50 MHz 时钟、115200 baud，分频系数是多少？误差多大？换 27 MHz 呢？
5. RS-232 和 TTL 电平有什么区别？FPGA 接 PC 时应该用什么芯片？
6. 为什么 RXD 进入 FPGA 后要先打两拍？

# 关联

- 所属 MOC：[[vault-notes/fpga/00-guide|FPGA 知识库导读]]
- 相关笔记：[[vault-notes/fpga/architecture/fifo-ip-core]]、[[vault-notes/fpga/verilog/sequential/10-finite-state-machines]]、[[vault-notes/fpga/verilog/sequential/03-counters]]、[[vault-notes/fpga/verilog/sequential/04-clock-divider-even]]、[[vault-notes/fpga/verilog/sequential/01-registers]]、[[vault-notes/fpga/verilog/sequential/02-blocking-vs-nonblocking-assignment]]


# FPGA模块实现

![[vault-notes/assets/uart-rs232/fig-05.png]]
分为**顶层模块，子功能模块1(UART_RX)，子功能模块2(UART_TX**)

## 子功能模块1(UART_RX)

下面进行串口子功能模块1，rx端的构建
对于rx端，我们要完成的是**数据的接收**和**数据的串转并**

![[vault-notes/assets/uart-rs232/fig-06.png]]

![[vault-notes/assets/uart-rs232/fig-07.png]]
上面两张图的区别是，下图有进行一个同步的操作，原因是，**尽管时序图绘制的是同步的，但由于异步通信的时钟不同，我们仍然需要做一个打一拍的操作**，让我们接收到的数据对准时钟(波特率一致但是可能无法进行相位的对齐)

但是，如果使用打一拍的操作来进行同步，很有可能出现下面的**亚稳态**现象

![[vault-notes/assets/uart-rs232/fig-08.png]]
**亚稳态** ：**亚稳态**是指数字电路中的触发器在采样输入信号时，由于输入信号在时钟有效边沿附近发生变化，违反了触发器的**建立时间(Setup Time)** 或 **保持时间(Hold Time)** 约束，导致触发器暂时无法进入稳定的逻辑 0 或逻辑 1 状态，其输出电平及恢复到稳定状态所需的时间具有不确定性的一种物理现象。

**亚稳态带来的风险**：
- 不确定性：输出无法在预期时间内确定为有效的逻辑 0 或逻辑 1。
- 暂态性：通常最终会恢复到稳定的逻辑状态，但恢复时间无法保证。
- 传播风险：若亚稳态尚未消除就被后级电路采样，可能造成逻辑错误。
- 不可完全消除：异步采样中的亚稳态风险无法彻底消除，只能通过同步电路降低其传播概率。
![[vault-notes/assets/uart-rs232/fig-09.png]]
建立时间($T_s$)： 时钟上升沿到来之前数据维持稳定的时间
保持时间($T_h$)： 时钟上升沿到来之后数据保持不变的时间
决断时间($T_c$)： 寄存器的延迟，用来判断数据是低电平还是高电平

消除方式：使用两级寄存器
![[vault-notes/assets/uart-rs232/fig-10.png]]

*注 ： 单比特信号从高速时钟域同步到低速时钟域时，两级寄存器打拍的方式会出现数据的漏采，这个时候要使用脉冲同步的方式或者握手信号的方式来实现数据的同步；
如果是多比特信号跨时钟域进行处理，一般要进行格雷码的编码，然后进行打拍处理，或者使用FIFO/RAM来实现数据的同步*

rx_reg1用来同步时钟信号，rx_reg2用来防止亚稳态，rx_reg3用来提取数据

![[vault-notes/assets/uart-rs232/fig-11.png]]
start_flag : 为了确定**输入信号什么时候开始**，设置一个起始信号，在rx_reg2下降沿时触发
word_en : 为了方便我们**能够读取数据**，设置一个使能信号，在start_flag上升沿时触发
baud_cnt : 为了确定我们要**读取的数据的具体时间位置**，以及确定什么时候结束，设置一个时钟信号(计数器)，在word_en上升沿触发，同时计数值由波特率决定
bit_flag : 为了确定**每个data的位置**，设置一个标志信号，在baud_cnt的中间位置触发
bit_cnt ：为了**计算data的读取数据**，设置一个计数器，读到data\[7]停止，不读停止位![[vault-notes/assets/uart-rs232/fig-12.png]]
![[vault-notes/assets/uart-rs232/fig-13.png]]
![[vault-notes/assets/uart-rs232/fig-14.png]]
rx_data : 为了**将串行数据转换为并行数据**，采用移位拼接的方式进行读取
rx_flag : 为了**确定rx_data 是否处理完毕**，设置一个标志信号
po_data\[7:0] : 为了**传输读取到的并行数据**，设置一个并行存放位，在rx_flag上升沿到来时触发
po_flag : 为了确定**po_data是否成功接收到了数据**，配置一个标志位，与po_data取到数据时同步

### RTL代码
```verilog
module uart_rx
#(
	parameter UART_BPS = 'd9600,
			CLK_FREQ = 'd50_000_000 
)
(
	input wire sys_clk,
	input wire sys_rst_n,
	input wire rx,
	
	output reg [7:0] po_data,
	output reg po_flag
);

parameter BAUD_CNT_MAX = CLK_FREQ / UART_BPS;
// 定义中间变量
reg rx_reg1;
reg rx_reg2;
reg rx_reg3;
reg start_flag;
reg word_en;
reg [15:0] baud_en;
reg bit_flag;
reg [3:0] bit_cnt;
reg [7:0] rx_data;
reg rx_flag;

//对信号进行打拍操作，包括防止亚稳态，通过两级打拍寄存器来实现
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		rx_reg1 <= 1'b1;  // 注意这里要赋值1，原因看分析的原理图，我们要检测下降沿
	else 
		rx_reg1 <= rx;

always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		rx_reg2 <= 1'b1;
	else 
		rx_reg2 <= rx_reg1;

always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		rx_reg3 <= 1'b1;
	else 
		rx_reg3 <= rx_reg2;

// 配置start_flag标志寄存器
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		start_flag <= 1'b0;
	else if((rx_reg3 == 1'b1) && (rx_reg2 == 1'b0) && (word_en == 1'b0))
		start_flag <= 1'b1;
	else 
		start_flag <= 1'b0;
		
// 配置word_en使能寄存器
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		word_en <= 1'b0;
	else if(start_flag == 1'b1)
		word_en <= 1'b1;
	else if((bit_cnt == 4'd8) && (bit_flag == 1'b1))
		word_en <= 1'b0;
	else 
		word_en <= word_en;
		
// 配置baud_cnt计数器
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		word_en <= 16'd0;
	else if((baud_cnt == BAUD_CNT_MAX -1'b1) || (word_en == 1'b1))
		baud_cnt <= 16'd0;
	else if(word_en == 1'b1)
		baud_cnt <= baud_cnt + 1'b1;

// 配置bit_flag计数器
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		bit_flag <= 1'b0;
	else if(baud_cnt == BAUD_CNT_MAX / 2 - 1'b1)
		bit_flag <= 1'b0;
	else 
		bit_flag <= 1'b0;

// 配置bit_cnt计数器
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		bit_cnt <= 4'd0;
	else if((bit_cnt == 4'd8) && (bit_flag == 1'b1))
		bit_cnt <= 4'd0;
	else if(bit_flag == 1'b1)
		bit_cnt <= bit_cnt + 1'b1;
			
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		rx_data <= 8'd0;
	else if((bit_cnt >= 4'd1) && (bit_cnt <= 4'd8) && (bit_cnt == 1'b1)) 
		rx_data <= {rx_reg3,rx_data[7:1]};

always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		rx_flag <= 1'b0;
	else if((bit_cnt == 4'd8) && (bit_flag == 1'b1))
		rx_flag <= 1'b1;
	else
		rx_flag <= 1'b0;
		
		
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		po_data <= 8'd0;
	else if(rx_flag == 1'b1)
		po_data <= rx_data;
	
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		po_flag <= 1'b0;
	else 
		po_flag <= rx_flag;
		
endmodule
```

### 仿真文件

```verilog
'timescale 1ns/1ps

module tb_uart_rx();

reg sys_clk;
reg sys_rst_n;
reg rx;

wire [7:0] po_data;
wire po_flag;

initial begin 
	sys_clk = 1'b1;
	sys_rst_n = 1'b0;
	rx = 1'b1;
	#20 
	sys_rst_n = 1'b1;
end

always #10 sys_clk = ~sys_clk;

initial begin 
	#200
	rx_bit(8'd0);
	rx_bit(8'd1);	
	rx_bit(8'd2);
	rx_bit(8'd3);
	rx_bit(8'd4);
	rx_bit(8'd5);
	rx_bit(8'd6);
	rx_bit(8'd7);
end


task rx_bit
(
	input [7:0] data;
);

integer i;
for(i = 0; i < 10;i = i+1)
	begin
		case(i)
		0 : rx <= 1'b0;
		1 : rx <= data[0];
		2 : rx <= data[1];
		3 : rx <= data[2];
		4 : rx <= data[3];
		5 : rx <= data[4];
		6 : rx <= data[5];
		7 : rx <= data[6];
		8 : rx <= data[7];
		9 : rx <= 1'b1;
		endcase	 
	end
endtask

uart_rx 
#(
	.UART_BPS(9600),
	.CLK_FREQ(50_000_000)
)

uart_rx_inst
(
	.sys_clk(sys_clk),
	.sys_rst_n(sys_rst_n),
	.rx(rx),
	
	.po_data(po_data),
	.po_flag(po_flag)
)

```

## 子功能模块2(UART_TX)

![[vault-notes/assets/uart-rs232/fig-15.png]]

### RTL代码
```verilog
module uart_tx
#(
	parameter UART_BPS = 'd9600,
				CLK_FREQ = 'd50_000_000
)
(
	input wire sys_clk,
	input wire sys_rst_n,
	input wire [7:0] pi_data,
	input wire pi_flag,
	
	output reg tx;
)

parameter BAUD_CNT_MAX = CLK_FREQ / UART_BPS;

reg word_en;
reg [15:0] baud_cnt;
reg bit_flag;
reg [3:0] bit_cnt;

always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		word_en <= 1'b0;
	else if(pi_flag == 1'b1)
		word_en <= 1'b1;
	else if((bit_cnt == 4'd9) && (bit_flag == 1'b1))
		word_en <= 1'b0; 

always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		baud_cnt <= 16'd0;
	else if((word_en == 1'b0)||(baud_cnt == BAUD_CNT_MAX -1))
		baud_cnt <= 16'd0;
	else if(word_en == 1'b1)
		baud_cnt <= baud_cnt + 1'b1;
		
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		bit_flag <= 1'b0
	else if(baud_cnt == 16'd1)
		bit_flag <= 1'b1;
	else 
		bit_flag <= 1'b0;
		
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		bit_cnt <= 4'd0;
	else if((bit_cnt == 4'd9) && (bit_flag == 1'b1))
		bit_cnt <= 4'd0;
	else if((word_en == 1'b1) && (bit_flag == 1'b1))
		bit_cnt <= bit_cnt + 1'b1;
	
always@(posedge sys_clk or negedge sys_rst_n)
	if(!sys_rst_n)
		tx <= 1'b1;
	else if(bit_flag == 1'b1)
		case(bit_cnt)
			0 : tx <= 1'b0;
			1 : tx <= pi_data[0];
			2 : tx <= pi_data[1];
			3 : tx <= pi_data[2];
			4 : tx <= pi_data[3];
			5 : tx <= pi_data[4];
			6 : tx <= pi_data[5];
			7 : tx <= pi_data[6];
			8 : tx <= pi_data[7];
			9 : tx <= 1'b1;
		default: tx <= 1'b1;
		endcase 
	
endmodule
```

### 仿真文件

```verilog
'timescale 1ns/1ps

module tb_uart_tx();

reg sys_clk;
reg sys_rst_n;
reg [7:0] pi_data;
reg  pi_flag;

wire tx;

initial begin 
	sys_clk = 1'b1;
	sys_rst_n <= 1'b0;
	#20
	sys_rst_n <= 1'b1;
end

always #10 sys_clk = ~sys_clk;

initial begin
	pi_data <= 8'd0;
	pi_flag <= 1'b0;
	#200
	//数据0的发送
	pi_data <= 8'd0;
	pi_flag <= 1'b1;
	#20
	pi_flag <= 1'b0;
	#(5208*10*20)  
	//数据1的发送
	pi_data <= 8'd1;
	pi_flag <= 1'b1;
	#20
	pi_flag <= 1'b0;
	#(5208*10*20)  
	//数据2的发送
	pi_data <= 8'd2;
	pi_flag <= 1'b1;
	#20
	pi_flag <= 1'b0;
	#(5208*10*20)  
	//数据3的发送
	pi_data <= 8'd3;
	pi_flag <= 1'b1;
	#20
	pi_flag <= 1'b0;
	#(5208*10*20)  
	//数据4的发送
	pi_data <= 8'd4;
	pi_flag <= 1'b1;
	#20
	pi_flag <= 1'b0;
	#(5208*10*20)  
	//数据5的发送
	pi_data <= 8'd5;
	pi_flag <= 1'b1;
	#20
	pi_flag <= 1'b0;
	#(5208*10*20)  
	//数据6的发送
	pi_data <= 8'd6;
	pi_flag <= 1'b1;
	#20
	pi_flag <= 1'b0;
	#(5208*10*20)  
	//数据7的发送
	pi_data <= 8'd7;
	pi_flag <= 1'b1;
	#20
	pi_flag <= 1'b0;
	#(5208*10*20)  
end

uart_tx_inst
#(
	.UART_BPS(9600),
	.CLK_FREQ(50_000_000)
)
uart_tx_inst
(
	.sys_clk(sys_clk),
	.sys_rst_n(sys_rst_n),
	.pi_data(pi_data),
	.pi_flag(pi_flag),
	
	.tx(tx)
);

endmodule
```

## 顶层模块

### RTL代码
```verilog
module rs232
(
	input wire sys_clk,
	input wire sys_rst_n,
	input wire rx,
	
	output wire tx
);

wire [7:0] po_data;
wire po_flag;


uart_rx 
#(
	.UART_BPS(9600),
	.CLK_FREQ(50_000_000)
)
uart_rx
(
	.sys_clk(sys_clk),
	.sys_rst_n(sys_rst_n),
	.rx(rx),
	
	.po_data(po_data),
	.po_flag(po_flag)
)

uart_tx
#(
	.UART_BPS(9600),
	.CLK_FREQ(50_000_000)
)
uart_tx_inst
(
	.sys_clk(sys_clk),
	.sys_rst_n(sys_rst_n),
	.pi_data(po_data),
	.pi_flag(po_flag),
	
	.tx(tx)
);

endmodule
```


### 仿真文件
```verilog
module tb_rs232();

reg sys_clk;
reg sys_rst_n;
reg rx;

wire tx;

initial begin 
	sys_clk = 1'b1;
	sys_rst_n = 1'b0;
	rx = 1'b1;
	#20
	sys_rst_n = 1'b1;
end

always #10 sys_clk = ~sys_clk;

initial begin 
	#200
	rx_byte();
end

task rx_byte();
integer j;
for(j = 0; j < 8; j = j+1)
	rx_bit(j);
endtask


task rx_bit
(
	input [7:0] data;
);

integer i;
for(i = 0; i < 10;i = i+1)
	begin
		case(i)
		0 : rx <= 1'b0;
		1 : rx <= data[0];
		2 : rx <= data[1];
		3 : rx <= data[2];
		4 : rx <= data[3];
		5 : rx <= data[4];
		6 : rx <= data[5];
		7 : rx <= data[6];
		8 : rx <= data[7];
		9 : rx <= 1'b1;
		endcase	 
	end
endtask


rs232 rs232_inst
(
	.sys_clk(sys_clk),
	.sys_rst_n(sys_rst_n),
	.rx(rx),
	
	.tx(tx)
);

endmodule

```