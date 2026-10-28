---
title: Verilog 时序逻辑
description: 用 always 块与非阻塞赋值描述触发器，讲清采样时刻、复位策略、计数器、奇偶分频、按键消抖、流水灯与 PWM 呼吸灯的设计条件与常见陷阱。
tags:
  - digital-systems
  - verilog
  - sequential-logic
---

## 为什么需要时序逻辑

组合逻辑只能"即时算"，没法"记住"。一旦功能需要跨时间保持信息——等一个按键稳定、数 500 ms、把上一拍数据交给下一级——就必须引入存储元件。FPGA 里的存储元件几乎都是**边沿触发的 D 触发器**，于是时序逻辑的写法被固定成一套模板：

- 用 `always @(posedge clk ...)` 描述"在哪个时钟沿采样"；
- 用非阻塞赋值 `<=` 描述"同时更新"，与真实触发器由同一沿同时采样对应；
- 用复位把上电未知态拉回确定的初值。

本文按"寄存器 → 计数器 → 分频 → 消抖 → 流水灯/呼吸灯"的顺序展开。代码为可综合示例，**本站未重新执行仿真**；文中时序图是课程笔记用 WaveDrom 重绘的**理论示意图**，不是 RTL 仿真波形。所有波形的前提写在图注中：时钟频率、周期、触发沿、复位极性、忽略的输出延迟。

## 寄存器：采样时刻与输出延迟

最基础的时序逻辑是一个带异步复位的 8 位寄存器：

```verilog
module register
(
    input  wire       clk,
    input  wire       rst_n,       // 低电平复位，异步
    input  wire [7:0] data_in,

    output reg  [7:0] data_out
);

always @(posedge clk or negedge rst_n)
    if (!rst_n)
        data_out <= 8'd0;
    else
        data_out <= data_in;

endmodule
```

这段代码包含四个必须能说清的时序要素：

1. **时钟频率与周期**：假设 50 MHz，$T_{clk}=20$ ns；
2. **触发边沿**：上升沿 `posedge clk` 采样，所有寄存器在同一个上升沿更新；
3. **复位极性与类型**：`rst_n` 低有效、异步（在敏感表里），复位有效时不等时钟沿立即把输出清零；
4. **采样窗口**：`data_in` 必须在采样沿前满足建立时间 $t_{su}$、沿后满足保持时间 $t_h$；$T_{clk}$ 的下限由 [[digital-systems/timing-analysis-and-constraints|时序方程]] 决定。

![寄存器采样时刻的理论示意：data_out 只在 clk 上升沿更新，因此比 data_in 晚一拍；rst_n 低有效异步复位，复位期间 data_out 被强制为 0；假设 50 MHz、每格 20 ns，图中忽略 Tco，不是 RTL 仿真波形](vault-notes/assets/01-registers/fig-01.svg)

图中 `data_in` 变为 `0xA5` 后，`data_out` 要等下一个上升沿才跟随，这"晚一拍"正是寄存器延时的来源。真实器件里输出还会滞后 $t_{co}$（clk-to-Q，时钟到输出延迟），图中把它忽略，只表达"沿后更新"的因果关系。

## 复位策略：同步、异步与异步复位同步释放

复位不是"随便拉一下"，三种方案各有代价：

| 方案 | 写法 | 优点 | 风险 |
| --- | --- | --- | --- |
| 异步复位 | `always @(posedge clk or negedge rst_n)` | 上电立即生效，不依赖时钟 | 释放时刻若靠近时钟沿，可能亚稳态 |
| 同步复位 | `always @(posedge clk)`，`if (!rst_n)` | 释放/生效都被时钟对齐，STA 简单 | 需要时钟已在运行，复位脉冲宽度要大于一个周期 |
| 异步复位同步释放 | 复位输入异步生效，用同步器把"释放"对齐到时钟沿 | 兼顾上电可靠与释放安全 | 需要额外两级触发器 |

工程上最常用第三种：

```verilog
module reset_sync
(
    input  wire clk,
    input  wire arst_n,      // 低有效异步复位输入
    output wire srst_n       // 低有效同步复位输出
);

reg [1:0] sync;

always @(posedge clk or negedge arst_n)
    if (!arst_n) sync <= 2'b00;
    else         sync <= {sync[0], 1'b1};

assign srst_n = sync[1];

endmodule
```

要点：异步复位时 `sync` 立即清零，释放后 `sync` 在连续两个上升沿被移入 1，输出 `srst_n` 因此与时钟沿对齐。若系统时钟来自 MMCM/PLL，还要把 `locked` 一起并入复位条件，等环路锁定后再释放，否则上电瞬间时钟抖动期可能采到亚稳态，详见 [[digital-systems/fpga-architecture-and-eda|FPGA 结构与 EDA 流程]] 中的时钟资源一节。

> [!warning] 同一设计里不要混用两种复位风格
> 有的模块异步、有的同步，会带来释放时刻不一致、跨模块复位不同步的问题。选定一种顶层策略（推荐"异步复位、同步释放"）后，内部模块统一使用同步后的复位信号。

## 计数器与单周期使能（tick）

计数器是时序逻辑里复用率最高的模块：本质是一个每个时钟沿自增的寄存器。工程上几乎不直接把分频时钟当全局时钟，而是用"每 $N$ 拍产生一个单周期脉冲"的**时钟使能**（tick）驱动节拍。

```verilog
module counter
#(
    parameter CNT_MAX = 4'd9          // 计数上限 9，共 10 个状态
)
(
    input  wire       clk,
    input  wire       rst_n,
    input  wire       en,             // 计数使能

    output reg  [3:0] cnt
);

always @(posedge clk or negedge rst_n)
    if (!rst_n)
        cnt <= 4'd0;
    else if (en) begin
        if (cnt == CNT_MAX)
            cnt <= 4'd0;              // 计满归零
        else
            cnt <= cnt + 1'b1;
    end
    // en 为 0 时不赋值，cnt 保持原值

endmodule
```

- `cnt` 在过程块中被赋值，所以声明为 `reg`；
- `en = 0` 时没有 `else` 分支，寄存器保持原值——这是**期望的寄存器行为**，和组合逻辑缺 `else` 推断出 Latch 完全是两回事；
- 位宽必须能表示 `CNT_MAX`；比较值写成参数，改分频比时只改一处。

![计数器的理论时序示意：en 为 1 时每个上升沿 cnt 加一，en 为 0 时保持；计到 CNT_MAX 后归零；复位优先于使能；假设 50 MHz、每格 20 ns，忽略 Tco，不是 RTL 仿真波形](vault-notes/assets/03-counters/fig-01.svg)

把"计满"翻译成单周期脉冲，就是最常用的节拍发生器：计数器计到 `N-1` 时把 `tick` 拉高一个周期并归零，其余时刻保持 0。这个"计数器 + 比较 + 单周期脉冲"的组合会在分频、流水灯与状态机里反复出现。

用 tick 而不是新时钟的好处：整个设计仍是**单时钟域**，静态时序分析只需一条时钟约束，不需要为派生时钟写 `create_generated_clock`，也不会引入门控时钟的偏斜问题。

## 偶数分频：50% 占空比是怎么来的

若需要一路 $f_{out}=f_{clk}/DIV$（$DIV$ 为偶数）的方波，只需让输出每半个输出周期翻转一次：

```verilog
module divider_even
#(
    parameter DIV = 10                // 偶数分频系数
)
(
    input  wire clk,
    input  wire rst_n,

    output reg  clk_out
);

reg [31:0] cnt;

always @(posedge clk or negedge rst_n)
    if (!rst_n) begin
        cnt     <= 32'd0;
        clk_out <= 1'b0;
    end else if (cnt == DIV/2 - 1) begin
        cnt     <= 32'd0;
        clk_out <= ~clk_out;          // 每 DIV/2 个源周期翻转
    end else
        cnt <= cnt + 1'b1;

endmodule
```

**推导**：计数器 $0\sim DIV/2-1$ 共 $DIV/2$ 个源周期，输出翻转一次，因此高、低电平各占 $DIV/2$ 个源周期：

$$
T_{out}=\frac{DIV}{2}T_{clk}+\frac{DIV}{2}T_{clk}=DIV\cdot T_{clk},\qquad \text{占空比}=\frac{DIV/2}{DIV}=50\%
$$

前提条件：`DIV` 必须是偶数，且 `cnt` 位宽足够；例：50 MHz 分频到 1 Hz，`DIV = 50\,000\,000`，输出周期 1 s，占空比 50%。

![偶数分频的理论时序示意：cnt 从 0 计到 DIV/2-1 时 clk_out 翻转一次，输出高、低电平各占 DIV/2 个源周期；图中每格 20 ns，DIV=10、输入 50 MHz 时输出 5 MHz、周期 200 ns，不是 RTL 仿真波形](vault-notes/assets/04-clock-divider-even/fig-01.svg)

工程提醒：分频产生的方波**不建议直接当其他逻辑的时钟**。要做节拍，用上面 `tick_gen` 的使能方式；要真正改变时钟频率，用 MMCM/PLL；只有驱动外部慢速器件（如 LED、蜂鸣器）时才把分频方波送到管脚。

## 奇数分频：为什么必须用两个时钟沿

奇数 $DIV$ 时，$DIV/2$ 不是整数，只靠上升沿无法得到 50% 占空比。解决办法是同时用上升沿和下降沿各产生一路占空比略小于 50% 的波形，再相或：

```verilog
module divider_odd
#(
    parameter DIV = 5                 // 奇数分频系数
)
(
    input  wire clk,
    input  wire rst_n,

    output wire clk_out
);

reg [31:0] cnt_p, cnt_n;
reg        clk_p, clk_n;

// 上升沿计数
always @(posedge clk or negedge rst_n)
    if (!rst_n)              cnt_p <= 32'd0;
    else if (cnt_p == DIV-1) cnt_p <= 32'd0;
    else                     cnt_p <= cnt_p + 1'b1;

// clk_p：高电平持续 (DIV-1)/2 个源周期
always @(posedge clk or negedge rst_n)
    if (!rst_n)                          clk_p <= 1'b0;
    else if (cnt_p == (DIV-1)/2)         clk_p <= 1'b1;
    else if (cnt_p == DIV-1)             clk_p <= 1'b0;

// 下降沿计数
always @(negedge clk or negedge rst_n)
    if (!rst_n)              cnt_n <= 32'd0;
    else if (cnt_n == DIV-1) cnt_n <= 32'd0;
    else                     cnt_n <= cnt_n + 1'b1;

// clk_n：结构同 clk_p，但整体滞后半个源周期
always @(negedge clk or negedge rst_n)
    if (!rst_n)                          clk_n <= 1'b0;
    else if (cnt_n == (DIV-1)/2)         clk_n <= 1'b1;
    else if (cnt_n == DIV-1)             clk_n <= 1'b0;

assign clk_out = clk_p | clk_n;

endmodule
```

**推导**（以 $DIV=5$ 为例，$T_{clk}$ 为源时钟周期）：

1. `clk_p` 在 `cnt_p = 2` 时置 1、`cnt_p = 4` 时清 0，高电平持续 2 个源周期；
2. `clk_n` 由下降沿域产生，相位比 `clk_p` 滞后 $T_{clk}/2$，高电平同样持续 2 个源周期；
3. 两者相或后，高电平共 $2+0.5=2.5$ 个源周期，低电平也是 $2.5$ 个源周期：

$$
T_{out}=5T_{clk},\qquad \text{占空比}=\frac{DIV/2}{DIV}=50\%\quad(DIV\ \text{为奇数})
$$

![奇数分频的理论时序示意：clk_p 在上升沿域产生，clk_n 在下降沿域产生并滞后半个源周期，两路相或后得到 50% 占空比；图中每格 10 ns 即半个输入周期，DIV=5、输入 50 MHz 时输出周期 100 ns，不是 RTL 仿真波形](vault-notes/assets/05-clock-divider-odd/fig-01.svg)

这个结构跨两个时钟沿，属于多沿设计，时序约束和仿真都比单沿设计麻烦；实际工程更常用"计数器 + 使能"的方式产生节拍，只有确实需要方波时才用双沿结构。

## 按键消抖：把 20 ms 的抖动挡在门外的两种写法

机械按键在按下与松开时会产生 5–20 ms 的抖动，FPGA 以 50 MHz 采样，抖动期间会看到一串 0/1 跳变。若直接把 `key_in` 当使能，按一次会被当成很多次。消抖的核心判据是：**新电平必须连续保持足够长时间，才承认它有效**。

计数器版的思路：把输入与"当前稳定值"比较，不同就开始计时；计时期间只要恢复一致就清零重来；连续保持到期才更新稳定值。

```verilog
module key_debounce
#(
    parameter CNT_MAX = 20'd1_000_000   // 50 MHz 下 20 ms
)
(
    input  wire clk,
    input  wire rst_n,
    input  wire key_in,      // 按下为低电平

    output reg  key_flag     // 确认按下时输出一个周期的高脉冲
);

reg [19:0] cnt;
reg        key_reg;          // 消抖后的稳定电平

always @(posedge clk or negedge rst_n)
    if (!rst_n) begin
        cnt      <= 20'd0;
        key_reg  <= 1'b1;
        key_flag <= 1'b0;
    end else if (key_in != key_reg) begin   // 与稳定值不同，开始计时
        if (cnt == CNT_MAX - 1) begin
            cnt      <= 20'd0;
            key_reg  <= key_in;
            key_flag <= (key_in == 1'b0);   // 只对按下动作给脉冲
        end else begin
            cnt      <= cnt + 1'b1;
            key_flag <= 1'b0;
        end
    end else begin                          // 已稳定，计时清零
        cnt      <= 20'd0;
        key_flag <= 1'b0;
    end

endmodule
```

- **时间常数**：`CNT_MAX = f_{clk}\times 20\,ms = 50\,MHz\times20\,ms = 1\,000\,000`；换时钟频率必须同步改这个参数，否则消抖时间不对。
- **抖动过滤**：抖动期间的跳变无法连续保持 20 ms，计时反复清零，`key_reg` 不更新。
- **输出脉冲**：`key_flag` 只在"确认按下"的那一拍为 1，松开不产生脉冲；用它做计数器使能就是"按一次加一"。

![按键消抖计数器的理论时序示意：key_in 抖动时 key_reg 不更新，连续保持 20 ms 后才跟随；key_flag 只在确认按下时输出一个周期脉冲；图中每格 5 ms，脉冲实际长度为一个 50 MHz 周期 20 ns，已放大显示，不是 RTL 仿真波形](vault-notes/assets/06-key-debounce/fig-01.svg)

另一种写法用状态机显式区分"松开、按下抖动、稳定按下、松开抖动"四个阶段（见 [[digital-systems/fsm-design|有限状态机设计]]），便于扩展长按、双击；计数器版更短，但只输出稳定电平与按下脉冲。两种实现都要回答同一个问题：$CNT\_MAX$ 是怎么按实际时钟算出来的。

## 流水灯：定时器 + 循环移位

流水灯是"节拍 + 状态移位"的最小组合：定时器每 500 ms 产生一次使能，LED 图案循环移位一位。

```verilog
module led_flow
#(
    parameter TIME_500MS = 25'd24_999_999    // 50 MHz 下 500 ms
)
(
    input  wire clk,
    input  wire rst_n,

    output reg  [3:0] led
);

reg [24:0] cnt;

always @(posedge clk or negedge rst_n)
    if (!rst_n)                     cnt <= 25'd0;
    else if (cnt == TIME_500MS)     cnt <= 25'd0;
    else                            cnt <= cnt + 1'b1;

always @(posedge clk or negedge rst_n)
    if (!rst_n)                     led <= 4'b0001;
    else if (cnt == TIME_500MS)     led <= {led[2:0], led[3]};   // 循环左移

endmodule
```

- `{led[2:0], led[3]}` 是位拼接：把高位移到最低位，形成循环，因此 `1000` 之后回到 `0001`，不会移出有效位；
- 改成 `{led[0], led[3:1]}` 就往反方向流动；
- 500 ms 的计数值 = $50\,MHz\times0.5\,s = 25\,000\,000$，计到 `24_999_999`（共 25 000 000 拍）归零。

![流水灯的理论时序示意：定时器计满产生 tick，led 在 tick 到来时循环左移一位；每格 500 ms，tick 实际只持续一个 20 ns 周期，已放大显示，不是 RTL 仿真波形](vault-notes/assets/08-running-led/fig-01.svg)

## 呼吸灯：PWM 的周期、分辨率与更新率

呼吸灯的本质是 PWM：保持 LED 的闪烁频率高于人眼可分辨范围，逐渐改变高电平占比，人眼看到的就是平均亮度变化。

```verilog
// 三级计时：50 MHz -> 1 us 节拍 -> 1 ms 计数 -> 1 s 调光节拍
// cnt_ms 计 0~999，构成 1 kHz 的 PWM 周期；duty 为占空比档位 0~999
assign led = (cnt_ms < duty) ? 1'b1 : 1'b0;

// 每 1 ms 调整一次 duty：约 1 s 从 0 加到 999，再约 1 s 减回 0
always @(posedge clk or negedge rst_n)
    if (!rst_n)                   begin duty <= 10'd0; flag <= 1'b0; end
    else if (tick_1ms) begin
        if (!flag) begin
            if (duty == 10'd999)  flag <= 1'b1;
            else                  duty <= duty + 1'b1;
        end else begin
            if (duty == 10'd0)    flag <= 1'b0;
            else                  duty <= duty - 1'b1;
        end
    end
```

完整实现另需两个计时器：`cnt_us` 在 50 MHz 下每 50 个时钟归零一次（`CNT_1US_MAX = 49`），`cnt_ms` 在 `cnt_us` 进位时加一、到 999 归零。三级计时器逐级分频，比申请多个分频模块更省资源。


**参数关系**：PWM 周期 1 ms（1 kHz），分辨率 1000 级（`duty` 取 0–999），占空比为 `duty/1000`；`duty` 每 1 ms 调整一次，约 1 s 从 0 加到 999、再约 1 s 减回 0，形成呼吸效果。

设计时的折中：PWM 频率要高过人眼可辨（一般 $\ge$ 100 Hz，1 kHz 很稳），但频率越高、同样分辨率下计数时钟就要越快；分辨率越高，亮度台阶越细，但 `duty` 位宽与比较器位宽越大。若 `duty` 位宽不足 10 位，最大值只能到 1023，无法覆盖 0–999 的全范围。

![呼吸灯 PWM 的理论时序示意：cnt_1ms 在 0~999 循环，led 在计数值小于 duty 时为高；图中把 1000 级缩略为 10 级、duty=3 表示 30% 占空比；呼吸节奏为约 1 s 渐亮、约 1 s 渐暗，不是 RTL 仿真波形](vault-notes/assets/09-breathing-led/fig-01.svg)

## 易错点与上板自检

| 易错点 | 现象 | 正确做法 |
| --- | --- | --- |
| 消抖时间常数没按实际时钟算 | 按键过于灵敏或不响应 | $CNT\_MAX=f_{clk}\cdot t_{debounce}$ |
| 分频方波直接当内部时钟 | 时钟偏斜、门控时钟告警 | 用 tick 使能或 MMCM |
| 奇数分频 `DIV` 取偶数 | 占空比不是 50% | 偶分频、奇分频分开实现 |
| 异步复位释放不加同步器 | 上电偶发跑飞 | 异步复位、同步释放 + `locked` |
| 计数器位宽不足 | 计数值提前回绕 | 位宽要容得下计数上限 |
| PWM 频率太低 | LED 可见闪烁 | 提高到 1 kHz 量级 |

上板前至少自检五项：复位极性与板卡按键一致；设计里只有一条主时钟；跨时钟域信号已同步；组合逻辑没有推断出锁存器；外部输出已寄存或加好驱动约束。这五项能挡掉大多数初学者的偶发故障。

## 前置与相关

- 前置：[[digital-systems/verilog-basics|数字设计与 Verilog 基础]] 中的 always、阻塞/非阻塞赋值与 Latch 部分。
- 下一步：[[digital-systems/fsm-design|有限状态机设计]] 用状态组织更复杂的时序行为；[[digital-systems/timing-analysis-and-constraints|时序分析与约束]] 解释这些寄存器如何被建立/保持时间检查。
- 时钟与复位：[[digital-systems/fpga-architecture-and-eda|FPGA 结构与 EDA 流程]] 中的 MMCM/PLL、`locked` 与时钟网络；[[digital-systems/vivado-design-flow|Vivado 设计流程]] 中的约束写法与实现报告。
- 系统级例子：[[digital-systems/fpga-interfaces-and-ad9361|外设与射频接口]] 中的 UART 波特率发生器、FIFO 与 AD9361 接口时序。
- 跨学科：[[signal-processing/signals-and-systems-intro|信号与系统导论]] 解释离散时间与采样；[[communication/digital-modulation-qpsk|数字调制 QPSK]] 中的符号定时与采样判决是同一套"在正确时刻采样"的思想。

## 来源与延伸阅读

- [[vault-notes/fpga/verilog/sequential/01-registers|寄存器]]：异步复位寄存器与采样时刻波形。
- [[vault-notes/fpga/verilog/sequential/03-counters|计数器]]：参数化计数上限、使能与归零。
- [[vault-notes/fpga/verilog/sequential/04-clock-divider-even|分频器 1 - 偶分频]]、[[vault-notes/fpga/verilog/sequential/05-clock-divider-odd|分频器 2 - 奇分频]]：占空比条件与双沿结构。
- [[vault-notes/fpga/verilog/sequential/06-key-debounce|按键消抖（计数器版）]]：20 ms 判据与 `key_flag` 单周期脉冲。
- [[vault-notes/fpga/verilog/sequential/08-running-led|流水灯]]、[[vault-notes/fpga/verilog/sequential/09-breathing-led|呼吸灯]]：定时器、循环移位与 PWM。
- [[vault-notes/fpga/verilog/sequential/02-blocking-vs-nonblocking-assignment|阻塞赋值和非阻塞赋值]]：本文只给结论，执行语义与对照波形见该篇。