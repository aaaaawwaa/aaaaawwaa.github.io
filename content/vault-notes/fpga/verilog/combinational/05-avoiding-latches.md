---
title: "避免Latch(锁存器)的产生"
type: concept
status: learning
subjects:
- FPGA
domains:
- 硬件实现
- 数字系统
tags:
- FPGA
- Verilog
- 组合逻辑
- 锁存器
aliases: []
prerequisites: []
related: []
---

组合逻辑的 `always` 块中，如果输出没有在所有分支下都被赋值，综合工具就会推断出锁存器（Latch）。

# RTL文件(.v文件)

```verilog
// 错误示例：if 缺少 else，sel 为 0 时 out 保持原值，综合出锁存器
module latch_bad
(
	input  wire in1,
	input  wire sel,

	output reg  out
);

always@(*)
	if(sel == 1'b1)
		out = in1;

endmodule
```

```verilog
// 正确示例：补全 else，out 在所有分支下都有确定值
module mux_no_latch
(
	input  wire in1,
	input  wire in2,
	input  wire sel,

	output reg  out
);

always@(*)
	if(sel == 1'b1)
		out = in1;
	else
		out = in2;

endmodule
```

上述RTL代码的几个要点
- 锁存器是电平敏感的存储单元，组合逻辑中意外推断出锁存器会导致时序分析困难，应当避免
- 解决办法一：`if` 必须配 `else`，`case` 必须配 `default`，保证每条分支都有赋值
- 解决办法二：在 `always` 块开头先给输出赋一个默认值，后续分支再覆盖
- Vivado 综合后可在 Report 中搜索 `Latch`，确认设计中没有锁存器

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_latch();
reg  in1;
reg  in2;
reg  sel;
wire out_bad;
wire out_good;

initial begin
	in1 <= 1'b0;
	in2 <= 1'b1;
	sel <= 1'b0;
end

always #10 in1 = ($random) % 2;
always #10 in2 = ($random) % 2;
always #10 sel = ($random) % 2;

latch_bad latch_bad_inst
(
	.in1 (in1),
	.sel (sel),
	.out (out_bad)
);

mux_no_latch mux_no_latch_inst
(
	.in1 (in1),
	.in2 (in2),
	.sel (sel),
	.out (out_good)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : in1 = %b,in2 = %b,sel = %b,out_bad = %b,out_good = %b",$time,in1,in2,sel,out_bad,out_good);
end

endmodule
```

# 时序分析

![[vault-notes/assets/05-avoiding-latches/fig-01.svg|800]]

- **锁存行为**：`latch_bad` 在 `sel = 1` 时透明（`out_bad = in1`），`sel = 0` 时保持上一次的值；`out_bad` 开头的 `x` 表示上电未知或保持状态。
- **组合输出**：`mux_no_latch` 补全了 `else`，`out_good` 始终等于 `sel ? in1 : in2`，不会保持。
- **为什么危险**：锁存器是电平敏感存储，综合后会出现意外的存储单元，时序分析困难，还可能引入毛刺敏感路径。
- **修复方式**：`if` 配 `else`、`case` 配 `default`，或在 `always` 块开头先赋默认值。
- **假设**：每格 5ns；只为对比“保持”和“跟随”两种行为。

> 理论时序示意图，不是 RTL 仿真波形；是否推断出锁存器应以综合报告为准。
