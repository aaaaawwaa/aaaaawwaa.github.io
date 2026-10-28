---
title: 数字设计与 Verilog 基础
description: 从组合逻辑与时序逻辑的区别出发，梳理模块端口、assign 与 always、阻塞和非阻塞赋值的执行语义，并用多路选择器、译码器、加法器与 Latch 示例建立可综合的 RTL 写法。
tags:
  - digital-systems
  - verilog
  - combinational-logic
---

## 为什么先分清组合逻辑与时序逻辑

Verilog 看起来像 C 语言，但它描述的是一块**同时存在**的硬件：多个 `always` 块之间并行执行，信号一变化就沿着电路传播。写 RTL 的第一件事，是判断自己正在描述哪一类电路：

| 维度 | 组合逻辑（combinational） | 时序逻辑（sequential） |
| --- | --- | --- |
| 输出取决于 | 当前输入 | 当前输入 + 已保存的状态 |
| 存储元件 | 无 | 触发器 / 寄存器 |
| 描述方式 | `assign` 或 `always @(*)` | `always @(posedge clk ...)` |
| 更新时间 | 输入变化后经传播延迟 $T_{pd}$ 稳定 | 时钟有效沿之后经 $t_{co}$ 更新 |
| 典型模块 | MUX、译码器、加法器 | 寄存器、计数器、状态机 |

判断标准只有一条：**同一组输入下，输出是否需要记住之前发生过什么**。需要记住，就必须有触发器，也就必须有时钟沿来约定"何时更新"。这条判断决定了后文所有代码模板：组合逻辑靠"分支完整"保证正确，时序逻辑靠"时钟沿 + 非阻塞赋值"保证正确。

本文的时序图均来自课程笔记的 WaveDrom 重绘，是**理论示意图**，只表达因果与时序关系，不是 RTL 仿真波形；代码为可综合示例，本站未重新执行仿真。真实延迟与毛刺请以综合报告、门级仿真或上板测量为准。

## 模块、端口与两种赋值方式

一个可综合的 Verilog 模块由 `module` … `endmodule` 包裹，端口方向用 `input`、`output`、`inout` 声明。真正需要先建立直觉的是变量类型与赋值方式的对应关系：

- `wire`：连线，由 `assign` 连续赋值或子模块输出驱动，不能出现在过程块左侧；
- `reg`（SystemVerilog 中更推荐写 `logic`）：过程块中被赋值的变量，是否综合成触发器取决于过程块是否带时钟沿；
- `assign`：连续赋值，右值任一信号变化都立即重新计算，属于组合逻辑；
- `always @(*)`：敏感表由编译器补全，块内任一读到的信号变化都会触发，属于组合逻辑的标准写法；
- `always @(posedge clk ...)`：只在时钟有效沿执行，属于时序逻辑。

一个二选一多路选择器（MUX）的经典写法：

```verilog
module mux2_1
(
    input  wire in1,   // 输入信号 1
    input  wire in2,   // 输入信号 2
    input  wire sel,   // 选择信号

    output reg  out    // 输出
);

always @(*)
    if (sel == 1'b1)
        out = in1;
    else
        out = in2;

endmodule
```

- `sel = 1` 时 `out = in1`，`sel = 0` 时 `out = in2`；输出永远等于被选中的那一路。
- MUX 没有时钟沿，`sel` 或数据变化后，`out` 要经过传播延迟 $T_{pd}$ 才稳定。图中把输出延后一格，一格按 5 ns 标注，仅用于表示"输入先变、输出后变"的因果关系，不代表器件真实延迟。
- `sel` 切换的瞬间，若两路输入电平不同，输出可能出现窄毛刺；后级若对毛刺敏感，应把输出寄存一拍再用。

![二选一多路选择器的理论时序示意：sel 取 1 时 out 跟随 in1，取 0 时跟随 in2，输出相对输入滞后一段 Tpd；图中每格 5 ns 仅为示意，不是 RTL 仿真波形](vault-notes/assets/01-multiplexer/fig-01.svg)

配套的测试平台（testbench）用 `initial` 与 `#` 延时产生激励，用 monitor 打印任务输出结果（系统任务名在 Verilog 中以美元符号开头）。**testbench 不是可综合硬件**，它的延时语句只存在于仿真世界，这一点在 [[digital-systems/vivado-design-flow|Vivado 设计流程]] 中会再展开。

## 组合逻辑常用模块：MUX、译码器与加法器

### 3-8 译码器

译码器把 $n$ 位二进制码映射为 $2^n$ 根"独热"（one-hot）输出线。原笔记给译码器的是三个独立输入，工程上更常见的是先拼接成向量再 `case`：

```verilog
module decoder_3to8
(
    input  wire [2:0] in,
    output reg  [7:0] out
);

always @(*)
    case (in)
        3'd0: out = 8'b0000_0001;
        3'd1: out = 8'b0000_0010;
        3'd2: out = 8'b0000_0100;
        3'd3: out = 8'b0000_1000;
        3'd4: out = 8'b0001_0000;
        3'd5: out = 8'b0010_0000;
        3'd6: out = 8'b0100_0000;
        default: out = 8'b1000_0000;   // 3'd7 及非法输入
    endcase

endmodule
```

要点：

- 每个输入组合都有确定输出，且 `default` 兜底，因此综合结果不会出现锁存器；
- 输出是 one-hot：任意时刻只有一位为 1；
- 输入从 `011` 跳到 `100` 时多位同时翻转，各输出位的路径延迟不同，可能出现瞬时错误码字（竞争冒险）。这是组合逻辑的固有现象，若下游是异步采样或计数使能，应加输出寄存器或使能门控。

![3-8 译码器的理论时序示意：输入从 000 递增到 111 时，输出依次只有一位为 1；图中 out 以十六进制简写为 0x01、0x02 等，输出统一延后一格仅为示意，不是 RTL 仿真波形](vault-notes/assets/02-3-to-8-decoder/fig-01.svg)

### 半加器与全加器：层次化设计的最小例子

半加器不考虑低位进位，只对两个 1 位输入求和：

```verilog
module half_adder
(
    input  wire in1,
    input  wire in2,

    output wire sum,    // 本位和
    output wire cout    // 向高位的进位
);

assign sum  = in1 ^ in2;   // 异或：输入不同时为 1
assign cout = in1 & in2;   // 与：两个输入同时为 1

endmodule
```

真值表（`cout sum` 依次排列）为 $00 \to 00$、$01/10 \to 10$、$11 \to 01$。半加器没有进位输入，**不能直接级联**成多位加法器；把两个半加器加一个或门拼起来，才得到全加器：

```verilog
module full_adder
(
    input  wire in1,
    input  wire in2,
    input  wire cin,    // 来自低位的进位

    output wire sum,
    output wire cout
);

wire sum0, cout0, cout1;

// 第一个半加器：in1 + in2
half_adder u_ha0 (.in1(in1), .in2(in2), .sum(sum0), .cout(cout0));
// 第二个半加器：低位和 + cin
half_adder u_ha1 (.in1(sum0), .in2(cin), .sum(sum), .cout(cout1));

// 两个半加器的进位不可能同时为 1，用或门合并即可
assign cout = cout0 | cout1;

endmodule
```

这个例子展示了三件事：

1. **例化**是层次化设计的入口，`.port(signal)` 是命名端口连接，端口顺序写错也不会接错；
2. 逻辑上 `sum = in1 ^ in2 ^ cin`，`cout` 是三输入多数表决，但用半加器拼接更直观；
3. **延迟会累加**：第二级半加器要等第一级的 `sum0`、`cout0` 稳定，整体 $T_{pd}$ 大于单个半加器。多位加法器把进位逐级传下去，位数越多关键路径越长，这就是高速设计要用超前进位或专用进位链（FPGA 中是 CARRY4、DSP48）的原因。

![全加器的理论时序示意：两个半加器级联，第二级依赖第一级的进位输出，整体传播延迟大于单个半加器；图中每格 5 ns 仅为示意，不是 RTL 仿真波形](vault-notes/assets/04-full-adder/fig-01.svg)

把 4 个全加器串起来，就是可综合的 4 位行波进位加法器（这是对原笔记的合理延伸，便于看清进位链）：

```verilog
module add4
(
    input  wire [3:0] a, b,
    input  wire       cin,
    output wire [3:0] sum,
    output wire       cout
);

wire [3:0] c;   // c[0] 是 bit0 的进位，c[3] 是 bit3 的进位

full_adder u0 (.in1(a[0]), .in2(b[0]), .cin(cin),  .sum(sum[0]), .cout(c[0]));
full_adder u1 (.in1(a[1]), .in2(b[1]), .cin(c[0]), .sum(sum[1]), .cout(c[1]));
full_adder u2 (.in1(a[2]), .in2(b[2]), .cin(c[1]), .sum(sum[2]), .cout(c[2]));
full_adder u3 (.in1(a[3]), .in2(b[3]), .cin(c[2]), .sum(sum[3]), .cout(c[3]));

assign cout = c[3];

endmodule
```

注意 `cin` 到 `cout` 的最坏路径要穿过 4 个全加器。若把位宽扩到 32 位，这条路径可能成为整个设计的时序瓶颈——这正是 [[digital-systems/timing-analysis-and-constraints|时序分析]] 里"组合路径太长就切流水线"的由来。

## 阻塞赋值与非阻塞赋值：执行语义

这是 Verilog 最容易出错的地方，也是仿真与综合结果不一致的常见根源。两者的差别不在"写法"，而在**赋值的两个阶段**：

- 非阻塞 `<=`：先把右值算出来并缓存（采样旧值），所有语句的更新推迟到当前时间步末尾统一生效；
- 阻塞 `=`：立即求值并立即更新，后面的语句能读到前面刚写入的新值。

同一段两级寄存器，两种写法行为完全不同：

```verilog
// 非阻塞：out2 采到的是上一拍的 out1，形成两级寄存器
always @(posedge clk or negedge rst_n)
    if (!rst_n) begin
        out1 <= 1'b0;
        out2 <= 1'b0;
    end else begin
        out1 <= in;
        out2 <= out1;
    end

// 阻塞：语句顺序执行，out2 立即拿到本拍更新后的 out1
always @(posedge clk or negedge rst_n)
    if (!rst_n) begin
        out1 = 1'b0;
        out2 = 1'b0;
    end else begin
        out1 = in;
        out2 = out1;   // 等价于 out2 = in，两级寄存器被合并
    end
```

按 50 MHz 时钟（周期 20 ns）、低有效异步复位 `rst_n` 看几个采样沿（忽略 $t_{co}$）：

| 时刻 | `in` | 非阻塞 `out1` / `out2` | 阻塞 `out1` / `out2` |
| --- | --- | --- | --- |
| 复位释放后第 1 个上升沿 | 1 | 1 / 0 | 1 / 1 |
| 第 2 个上升沿 | 0 | 0 / 1 | 0 / 0 |
| 第 3 个上升沿 | 1 | 1 / 0 | 1 / 1 |

结论：非阻塞版 `out2` 比 `out1` 晚一拍，是真正的两级寄存器；阻塞版两个信号同拍变化，综合后通常只剩一级逻辑，**行为与设计意图不符**。因此工程规则是：

1. 时序逻辑（`always @(posedge ...)`）一律用 `<=`；
2. 组合逻辑（`always @(*)`）一律用 `=`；
3. 不在同一个 `always` 块里混用两种赋值，也不对同一信号既阻塞又非阻塞赋值。

![阻塞与非阻塞赋值的理论时序对比：非阻塞版 out2 比 out1 晚一拍，阻塞版 out2 与 out1 同拍变化；图中每格 20 ns，忽略 Tco，不是 RTL 仿真波形](vault-notes/assets/02-blocking-vs-nonblocking-assignment/fig-01.svg)

> [!warning] 为什么组合逻辑也不用非阻塞
> 在组合逻辑里写 `<=` 虽然有时能仿真出"像对"的结果，但多个非阻塞赋值在同一时间步末尾生效，容易造成不同仿真器之间的细微差异；综合工具也不保证按你想象的方式推断。组合块用 `=`、时序块用 `<=` 是最稳的约定。

## Latch 是怎么被"推断"出来的

锁存器（latch）是**电平敏感**的存储单元。组合逻辑中如果不小心让某个输出在某条分支下没有被赋值，综合器只能"保持原值"来实现，于是推断出锁存器。

```verilog
// 错误示例：sel = 0 时 out 无赋值，保持原值 → 推断出 latch
always @(*)
    if (sel == 1'b1)
        out = in1;

// 正确示例：补全 else，每条分支都有确定值
always @(*)
    if (sel == 1'b1)
        out = in1;
    else
        out = in2;
```

![Latch 推断的对比示意：缺少 else 的版本在 sel 为 0 时保持上一次的值，表现为电平敏感存储；补全 else 的版本始终跟随输入；图中每格 5 ns 仅为示意，是否推断出 latch 应以综合报告为准](vault-notes/assets/05-avoiding-latches/fig-01.svg)

避免 Latch 的三种常用手段：

1. `if` 必须配 `else`，`case` 必须配 `default`，保证每条路径都有赋值；
2. 在组合 `always` 块开头给输出赋默认值，后续分支再覆盖；
3. 敏感表要完整——用 `always @(*)` 而不是手写列表，避免漏信号导致仿真与综合不一致。

Latch 危险的根源不是"多了一个存储单元"，而是它的开启时间是电平而不是边沿，**插入后静态时序分析很难按普通路径约束它**，而且可能对毛刺敏感。综合完成后可在 Vivado 的 Report 中搜索 "Latch" 确认没有意外推断。

## 例题：四个小判断

**例 1**：`always @(*) out = a & b;` 与 `assign out = a & b;` 等价吗？

功能等价。区别在声明类型与风格：`assign` 只能驱动 `wire`；过程块赋值要求输出声明为 `reg`。工程上单条连续赋值优先用 `assign`，多条分支用 `always @(*)`。

**例 2**：用阻塞赋值写 `out1 = in; out2 = out1;`，为什么"少了中间那级寄存器"？

因为第二句执行时 `out1` 已经被更新为 `in`，`out2` 与 `out1` 同拍变化，两级串联退化成一个"影子寄存器"，综合器很可能把它优化掉。

**例 3**：位宽与拼接要注意什么？

`cnt + 1'b1` 按 `cnt` 的位宽截断，计数到最大值会回绕；需要保留进位时必须先扩展位宽。拼接用 `{a, b}`，复制用 `{{8{1'b1}}}`，符号扩展不能靠"补零"，要复制符号位。拼接顺序决定结果高低位，例如 `{led[2:0], led[3]}` 是循环左移一位。

**例 4**：组合输出有毛刺，怎么彻底消除？

在组合输出后加一级触发器（输出寄存化），用时钟沿重新对齐；代价是延后一个周期。状态机输出和译码器输出都是典型需要寄存的位置，参见 [[digital-systems/fsm-design|有限状态机设计]]。

## 易错点清单

| 错误 | 后果 | 正确做法 |
| --- | --- | --- |
| 组合 `if` 缺 `else`、`case` 缺 `default` | 推断出 latch | 补齐分支或先赋默认值 |
| 时序逻辑用阻塞赋值 | 寄存器链被合并，功能错 | 时序一律 `<=` |
| 同一信号在两个 `always` 中驱动 | 多驱动，综合报错 | 一个信号只由一个过程块驱动 |
| 忘记 `timescale` 或 testbench 延时混乱 | 仿真时间单位错 | 文件首行写 `timescale 1ns/1ps` |
| 位宽不足导致回绕 | 计数/累加结果错 | 先算最大值的位宽再声明 |
| 用 `reg` 声明却想接 `assign` | 编译报错 | 连线用 `wire`，过程赋值用 `reg` 或 `logic` |
| 组合逻辑输出直接进异步接口 | 毛刺被误采 | 输出寄存一拍或加使能 |

## 前置与相关

- 前置：[[signal-processing/signals-and-systems-intro|信号与系统导论]] 中的离散时间与采样概念，以及 [[programming/c-pointer-and-memory|C 指针与内存]] 中"变量有地址、硬件有连线"的对照理解。
- 下一步：[[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]] 把触发器、计数器、分频与消抖写完整；[[digital-systems/fsm-design|有限状态机设计]] 讨论状态组织与输出寄存。
- 工具链：[[digital-systems/vivado-design-flow|Vivado 设计流程]] 与 [[digital-systems/timing-analysis-and-constraints|静态时序分析与约束]] 解释这些代码最终如何映射成 LUT/FF 并接受时序检查。
- 器件资源：[[digital-systems/fpga-architecture-and-eda|FPGA 结构与 EDA 流程]] 说明 LUT、触发器、DSP48 与 BRAM 的来由。

## 来源与延伸阅读

- [[vault-notes/fpga/verilog/combinational/01-multiplexer|简单时序逻辑——多路选择器]]：MUX 的 RTL、testbench、XDC 与时序解读。
- [[vault-notes/fpga/verilog/combinational/02-3-to-8-decoder|3-8 译码器]]
- [[vault-notes/fpga/verilog/combinational/03-half-adder|半加器]]、[[vault-notes/fpga/verilog/combinational/04-full-adder|全加器]]：层次化设计与延迟累加。
- [[vault-notes/fpga/verilog/combinational/05-avoiding-latches|避免 Latch 的产生]]：错误与正确写法对比、综合报告检查。
- [[vault-notes/fpga/verilog/sequential/02-blocking-vs-nonblocking-assignment|阻塞赋值和非阻塞赋值]]：两种写法的对照代码与波形。
- [[vault-notes/fpga/vivado/base/03-rtl-hardware-thinking|03 · 最低限度 RTL 硬件思维]]：为什么 Verilog 不是普通程序。