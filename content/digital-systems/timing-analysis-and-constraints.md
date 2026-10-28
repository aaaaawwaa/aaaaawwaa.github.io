---
title: 静态时序分析与约束
description: 从时序路径模型与建立/保持方程出发，推导周期约束、输入输出偏移约束与时序例外，说明综合属性如何影响时序，并给出报告判读、跨时钟域风险与自检清单。
tags:
  - digital-systems
  - fpga
  - timing-analysis
---

## 为什么需要约束

综合、布局布线、时序分析都需要一个"目标"：设计要跑多快、外部接口的时序边界是什么。这个目标就是**时序约束**，它有三个作用：控制综合/映射/布局/布线以减小延迟而提高频率；作为 STA 判断"是否满足"的基准；指定引脚位置与电气标准。

一句话记住：**约束不是检查清单，而是工具优化与判定的输入。** 没写约束的路径，工具既不会优化、也不会在报告里警告——这是"报告全绿但板子跑飞"最常见的原因。STA 不需要测试向量，把**所有路径**按最大/最小延迟算一遍；仿真只覆盖激励到的场景。两者互补，不能互相替代。

本文时序图是课程笔记用 WaveDrom 预渲染的 SVG，属于**理论示意图**，只说明发起沿/捕获沿、偏移量与半周期的几何关系，**不是 RTL 仿真波形**；具体延迟数值必须回到时序报告与器件手册。

## 时序路径模型：起点、终点与四类路径

STA 把电路拆成一条条"时序路径"，每条路径都有起点与终点：

- 起点：所有基本输入端（Primary Input），以及触发器的**时钟输入端**；
- 终点：所有基本输出端（Primary Output），以及触发器的**数据输入端 D**。

由此得到四类路径，以及各自的约束归属：

| 路径 | 起点 → 终点 | 由谁约束 | 缺失后果 |
| --- | --- | --- | --- |
| ① 寄存器 → 寄存器 | 触发器时钟端 → 触发器 D 端 | 周期约束 `create_clock` | 内部路径未约束，不优化不报告 |
| ② 输入 → 寄存器 | 输入 PAD → 第一级寄存器 D 端 | 偏移约束 `set_input_delay` | 输入侧建立时间可能违例而无提示 |
| ③ 寄存器 → 输出 | 末级寄存器时钟端 → 输出 PAD | 偏移约束 `set_output_delay` | 输出到下级采样错误 |
| ④ 输入 → 输出（纯组合） | 输入 PAD → 输出 PAD | 最大延迟约束 `set_max_delay` | 纯组合直通路径延迟失控 |

> [!tip] 记忆法
> 只有 ① 是"芯片内部自己跟自己比"，所以用周期约束；②③ 跨过 PAD 边界，必须由外部世界给出偏移量；④ 没有寄存器参与，只能单独约束。**PERIOD 只管 ①，OFFSET 只管 ②③，PAD-TO-PAD 只管 ④。**

## 建立时间、保持时间与两个检查

| 参数 | 符号 | 定义 | 设计者要保证 |
| --- | --- | --- | --- |
| 建立时间 | $t_{su}$ | 时钟有效沿**之前**数据必须稳定的最短时间 | 数据不能来太晚 |
| 保持时间 | $t_{hold}$ | 时钟有效沿**之后**数据必须继续保持的最短时间 | 数据不能走太快 |
| 时钟到输出 | $t_{c\text{-}q}$（$t_{co}$） | 时钟有效沿到 Q 端变化之间的延迟 | 数据从沿之后才开始传播 |

- **Setup check**：用"发起沿"与**下一个周期**的捕获沿比较，数据必须在一个周期内传到并稳定；
- **Hold check**：用同一周期的发起沿与捕获沿比较，新数据不能在新沿有效前"冲掉"旧数据。

![建立时间与保持时间的理论示意：数据必须在时钟沿前 tsu 稳定、沿后 thold 继续保持，D 端在这段窗口内不得变化；图中 tsu=3 ns、thold=1 ns 为示意值，真实值来自器件时序模型，不是 RTL 仿真波形](vault-notes/assets/04-timing-analysis-setup-hold/fig-01.svg)

设时钟到发起触发器、捕获触发器的延迟分别为 $T_{cd1}$、$T_{cd2}$，捕获时钟比发起时钟晚 $T_{skew}=T_{cd2}-T_{cd1}$，则：

$$
\text{Setup: }\ T+T_{skew}\ge T_{cko}+T_{logic}+T_{net}+T_{setup}
$$

$$
\text{Hold: }\ T_{cd1}+T_{cko}^{min}+T_{logic}^{min}\ge T_{cd2}+T_{hold}
$$

两个不等式的方向相反，这是理解时序收敛的关键：

- **捕获时钟更晚（skew 为正）→ setup 更宽裕，hold 更危险**；
- **降频只能改善 setup，完全无法修 hold**——因为 hold 不等式里没有 $T$。

![发起沿与捕获沿、时钟偏斜的理论示意：setup 检查比较发起沿与下一周期捕获沿，hold 检查比较同周期两沿；skew 为正时 setup 可用时间增加而 hold 余量减少；图中数值为示意，不是 RTL 仿真波形](vault-notes/assets/04-timing-analysis-setup-hold/fig-02.svg)

## 周期约束：最基础、覆盖 90% 场景

周期约束描述"参考网络为时钟的同步元件之间的路径"，包括 flip-flop、latch、同步 RAM 等。它写在**时钟网络**上，不覆盖 PAD 到寄存器、寄存器到 PAD 的路径。

课件的原式（符号约定见下方陷阱说明）：

$$
T_{period}=T_{cko}+T_{logic}+T_{net}+T_{setup}-T_{clk\_skew}
$$

自己推一遍更可靠。设时钟源在 $t=0$ 发出边沿：发起触发器时钟沿到达时刻为 $T_{cd1}$，Q 端数据有效于 $T_{cd1}+T_{cko}$，到达捕获触发器 D 端为 $T_{cd1}+T_{cko}+T_{logic}+T_{net}$；捕获时钟沿到达时刻为 $T_{period}+T_{cd2}$，并要求数据提前 $T_{setup}$ 稳定，于是：

$$
T_{period}\ge T_{cko}+T_{logic}+T_{net}+T_{setup}+(T_{cd1}-T_{cd2})
=T_{cko}+T_{logic}+T_{net}+T_{setup}-(T_{cd2}-T_{cd1})
$$

> [!warning] 符号约定陷阱
> 课件把 $T_{clk\_skew}$ 定义为 $T_{cd1}-T_{cd2}$，却写作 $T_{period}=\cdots-T_{clk\_skew}$。统一记忆：把 skew 理解成"捕获时钟比发起时钟晚多少"（$T_{cd2}-T_{cd1}$），则 $T_{period}\ge$ 各延迟之和 $-\text{skew}$。换教材时先看它把 skew 定义成"谁减谁"。

### 例题：自反馈分频器能跑多快

D 触发器把 $\bar Q$ 经非门反馈回 D 端（二分频）。已知非门延迟 $t_c=1\sim3$ ns、触发器 $t_p=5\sim8$ ns、$t_{su}=4$ ns、$t_h=2$ ns。建立准则取 max：

$$
t_{ck}\ge t_c^{max}+t_p^{max}+t_{su}=3+8+4=15\ \text{ns}
\ \Rightarrow\ f_{max}=\frac{1}{15\ \text{ns}}\approx66.67\ \text{MHz}
$$

保持准则取 min：$t_p^{min}+t_c^{min}=5+1=6\ \text{ns}>t_h=2\ \text{ns}$，通过，余量 4 ns。三个考点：反馈路径也是时序路径；max/min 分开算；$f_{max}$ 与最小周期互为倒数。

### 反相时钟：可用时间只剩半个周期

若 FF1 用 CLK 上升沿、FF2 用同一 CLK 经非门后的上升沿（即 CLK 下降沿），PERIOD 约束会自动把两者之间的延迟限制为**半个周期**：10 ns 周期时只有 5 ns 可用。

这解释了为什么工程上不建议用双沿/反相时钟做复杂逻辑：等于主动把时序预算砍半。若确实需要，应显式写生成时钟（`create_generated_clock -invert`）或用多周期/伪路径说明意图，不要依赖工具的隐式推断。约束过紧会让布线时间爆炸甚至适得其反；约束过松则工具不优化。**约束值应等于真实工作频率（含适当裕量）。**

在 Vivado 中对应 `create_clock -period 10.000 -waveform {0.000 5.000} [get_ports SYS_CLK]`：-period 是周期（ns），-waveform 给出上升沿与下降沿时刻，两者之差即高电平时间；50% 占空比时为 5 ns。

## 偏移约束：芯片边界上的时序合同

偏移约束描述"数据和时钟之间"的关系，规定外部时钟与数据输入/输出引脚之间的时序，**只用于与 PAD 相连的信号，不能用于内部信号**。原因很简单：偏移约束描述的是芯片外部世界（上游器件的 $t_{co}$、板级延迟、下游器件的 $t_{su}$）给出的边界；内部信号没有"外部世界"，它的时序由周期约束负责。

| 约束 | 含义 |
| --- | --- |
| `OFFSET_IN_BEFORE` | 输入数据比有效时钟沿提前多长时间准备好 |
| `OFFSET_IN_AFTER` | 输入数据在有效时钟沿之后多长时间到达引脚 |
| `OFFSET_OUT_BEFORE` | 输出数据应在下一级时钟沿前多长时间稳定 |
| `OFFSET_OUT_AFTER` | 输出数据在时钟沿之后多长时间内稳定 |

一对 BEFORE/AFTER 描述同一时刻，参考方向相反，满足 BEFORE + AFTER = $T_{period}$。

### 输入侧

$$
T_{arrival}=T_{cko}+T_{output}+T_{logic},\qquad T_{arrival}+T_{input}+T_{setup}<T_{period}
$$

**例**：$T_{period}=20$ ns，$T_{cko}=1$ ns，$T_{output}=3$ ns，$T_{logic}=8$ ns，则 $T_{arrival}=12$ ns。等价写法：

```tcl
set_input_delay -clock CLK -max 12.000 [get_ports DATA_IN]   # 沿后 12 ns 到达
# 或 BEFORE 写法：8 ns（20 - 12）
```

![输入偏移约束的理论示意：外部数据在时钟沿后 12 ns 到达引脚，距离下一个捕获沿只剩 8 ns 留给输入路径与建立时间；图中数值来自课件例题，不是 RTL 仿真波形](vault-notes/assets/05-timing-constraints-period-offset/fig-02.svg)

### 输出侧

$$
T_{stable}=T_{logic}+T_{input}+T_{setup},\qquad T_{cko}+T_{output}+T_{stable}<T_{period}
$$

**例**：$T_{period}=20$ ns，$T_{input}=4$ ns，$T_{setup}=1$ ns，$T_{logic}=8$ ns，则 $T_{stable}=13$ ns。

## 时序例外：把"不该赶的路径"摘出来

全局约束作用于整个时钟域/所有 I/O，真实设计中总有路径不该按全局要求检查，于是需要路径专有约束。课件强调四类受益场景：多周期路径、跨时钟域路径、双向总线、个别 I/O 的时序要求；并提醒这些约束**必须服务于明确的性能目标，不可随意添加**。

### 伪路径（False Path）

伪路径指**无法被敏化**的路径。经典例子：两个 2:1 MUX 级联，选择端由同一根控制线驱动，但右边那个经过反相器——两条通路要求两个 MUX 同时选 0（或同时选 1），而选通极性相反，矛盾，因此永远不会传输数据。写 `set_false_path` 后工具不再优化、也不再报违例。但**伪路径是证据，不是愿望**：前提是能证明它物理上不可能被敏化（MUX 互锁、静态配置寄存器、复位/测试逻辑）；只是"跑不到"的路径应改 RTL 或加流水线，否则真实风险被藏起来。

### 多周期路径（Multicycle Path）

课件例子：32 位高速计数器的速度取决于最低位到最高位的进位延迟。改用预定标结构：2 位小计数器 + 30 位大计数器同一时钟驱动，大计数器使能由小计数器进位驱动；小计数器每 4 个 CLK 进位一次、使能持续 1 个 CLK。于是小计数器内部仍是每拍约束，而"小计数器 → 大计数器"的路径每 4 拍才更新一次，可放宽到 4 个 CLK：

$$
N\cdot T_{period}\ge T_{cko}+T_{logic}+T_{net}+T_{setup}-(T_{cd2}-T_{cd1})
$$

![预定标计数器多周期路径的理论示意：小计数器每拍工作，进位使能每 4 个时钟出现一次，大计数器路径因此可按 4 个周期检查；图中每格 1 个时钟周期，不是 RTL 仿真波形](vault-notes/assets/06-timing-exceptions-priority/fig-01.svg)

**setup 与 hold 必须成对设置**：

```tcl
set_multicycle_path 4 -setup -from [get_cells small_cnt_reg*] -to [get_cells big_cnt_reg*]
set_multicycle_path 3 -hold  -from [get_cells small_cnt_reg*] -to [get_cells big_cnt_reg*]
```

只写 `-setup N` 而不同时写 `-hold N-1`，保持检查仍按 1 个周期进行，会人为制造 hold 违例——这是多周期路径最常见的坑。


### 逐引脚偏移与约束优先级

课件给出两种做法：按列对该时钟域所有 I/O 统一设偏移，简便但容易过约束；逐引脚单独设偏移，精确但易漏。约束优先级由高到低：

| 优先级 | 约束 |
| --- | --- |
| 1（最高） | 伪路径 False paths（可覆盖任何约束） |
| 2 | FROM THRU TO（带中间点的路径约束） |
| 3 | FROM TO（起点→终点） |
| 4 | 逐引脚 OFFSET |
| 5 | 分组 OFFSET |
| 6（最低） | 全局 PERIOD 与 OFFSET |

越具体的约束优先级越高；反过来，**伪路径会盖掉一切**——写错一个 `set_false_path`，那条路径的时序检查就彻底消失，而且报告不会提醒你。

## 综合属性如何影响时序

综合旋钮不改变 RTL 功能语义，但影响速度与面积（课件用 XST 术语，Vivado 对应命令见 [[digital-systems/vivado-design-flow|Vivado 设计流程]]）：优化目标 Area/Speed（默认 Speed）决定用资源换延迟还是并行展开；优化强度 Normal/High 增加迭代但**不保证**更好；Max Fanout 限制扇出以减小负载；Register Duplication 复制寄存器缩短高扇出网络；Equivalent Register Removal 可能删掉打拍寄存器；Register Balancing 即重定时，跨寄存器重新分配组合逻辑；Slice Packing 把相关 LUT 放同一 Slice 以减小 $T_{net}$；Pack I/O Register into IOBs 把第一级寄存器挪进 IOB 缩短输入路径。

课件的提醒值得记住："并不是选择 High 就一定得到好的综合结果，真正重要的是设计者要保证设计的质量。"**RTL 结构决定时序上限**，综合选项只能微调；靠调 Effort 救一条 20 级组合逻辑的路径不现实，应改流水线或状态机结构。

## 读时序报告：先分清是哪种报告

| 确认项 | 答案 | 原因 |
| --- | --- | --- |
| 是 setup 还是 hold 报告 | 看标题/路径类型 | 两种检查判据完全不同 |
| operating conditions | setup 看 worst，hold 看 best | 慢工艺+低压+高温最不利 setup；快工艺+高压+低温最不利 hold |
| path type | setup 看 max，hold 看 min | 建立看最慢路径，保持看最快路径 |
| 时钟频率 | 由上升沿与下降沿时间确定 | 约束与实际时钟不一致时报告无意义 |

余量 slack = $T_{required}-T_{arrival}$，≥ 0 才满足；WNS 就是最差的那条负 slack。slack ≥ 0 才满足；slack < 0 违例，WNS 就是最差的那条负 slack。课件示例中 `data required time` 为 31.74、`data arrived time` 为 19.80、slack 为 11.94；若 arrival 写成 −19.80 会得到 51.54，与 11.94 矛盾，可判定为课件负号笔误——**读报告时要先做数值自洽检查**。

报告检查要点：分清 setup/hold、worst/best、max/min；确认时钟周期正确；建立与保持同时满足；**特别看 unconstrained paths**；核对 false path 是否误配；多周期路径检查 hold 侧。

## 跨时钟域（CDC）风险

两个无固定相位关系的时钟之间不能用同一周期做 setup/hold 比较。单比特控制信号用两级触发器同步（第一级可能进亚稳态，第二级给出一整拍恢复时间），并用 `set_clock_groups -asynchronous` 声明异步；**多位总线不能逐 bit 打两拍再拼接**，各 bit 在不同周期完成同步会造成数据字撕裂，应使用异步 FIFO、握手或格雷码；数据通路用异步 FIFO（见 [[digital-systems/fpga-interfaces-and-ad9361|外设与射频接口]]）或双口 RAM，读写指针各在自身时钟域内计数。亚稳态无法彻底消除，只能降低传播概率——可靠性靠结构保证，不靠时序约束。

## 前置与相关

- 前置：[[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]]（寄存器与 $t_{co}$）、[[digital-systems/verilog-basics|Verilog 基础]]（组合延迟与流水线直觉）。
- 器件与流程：[[digital-systems/fpga-architecture-and-eda|FPGA 结构与 EDA 流程]]、[[digital-systems/vivado-design-flow|Vivado 设计流程]]。
- 系统接口：[[digital-systems/fpga-interfaces-and-ad9361|外设与射频接口]]（CDC、异步 FIFO、源同步接口）。
- 跨学科：[[signal-processing/dft-and-fft|DFT 与 FFT]]（流水线与资源复用的时序代价）、[[communication/digital-modulation-qpsk|数字调制 QPSK]]（符号定时与采样）。

## 来源与延伸阅读

- [[vault-notes/fpga/sta/00-guide|分析理论导读]]：课程来源、知识地图与九张时序图清单。
- [[vault-notes/fpga/sta/04-timing-analysis-setup-hold|时序分析基础：路径模型与建立保持时间]]：路径分类、两个检查、周期方程与 $f_{max}$ 例题。
- [[vault-notes/fpga/sta/05-timing-constraints-period-offset|时序约束：周期约束与偏移约束]]：PERIOD/OFFSET 公式、例题与 UCF/XDC 对照。
- [[vault-notes/fpga/sta/06-timing-exceptions-priority|时序例外约束与约束优先级]]：伪路径、多周期、逐引脚偏移与六级优先级。
- [[vault-notes/fpga/sta/03-synthesis-basics-attributes|综合基础与综合属性]]：优化目标、强度、扇出/复制/配平/打包等结构优化。
- [[vault-notes/fpga/sta/07-timing-analysis-cheatsheet|时序分析速查卡]]：公式表、命令对照、报告清单与自检十问。