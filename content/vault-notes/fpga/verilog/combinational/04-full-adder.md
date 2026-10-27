---
title: "全加器"
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
- 加法器
aliases: []
prerequisites: []
related: []
---

全加器在半加器的基础上增加了进位输入 `cin`，可以级联实现多位加法。

# RTL文件(.v文件)

```verilog
module full_adder
(
	input  wire in1,
	input  wire in2,
	input  wire cin,   // 来自低位的进位

	output wire sum,
	output wire cout
);

wire sum0;
wire cout0;
wire cout1;

// 第一个半加器：in1 + in2
half_adder half_adder_inst0
(
	.in1  (in1),
	.in2  (in2),
	.sum  (sum0),
	.cout (cout0)
);

// 第二个半加器：低位和 + cin
half_adder half_adder_inst1
(
	.in1  (sum0),
	.in2  (cin),
	.sum  (sum),
	.cout (cout1)
);

// 两次产生的进位只要有一个为 1，就向高位进位
assign cout = cout0 | cout1;

endmodule
```

上述RTL代码的几个要点
- 两个输入半加器产生的进位 `cout0`、`cout1` 不可能同时为 1，所以用或门合并即可
- `half_adder_inst0`、`half_adder_inst1` 是例化名，端口用 `.端口名(信号名)` 的方式连接
- 例化属于层次化设计，仿真时工程中需要同时添加 `half_adder.v` 和 `full_adder.v`

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_full_adder();
reg  in1;
reg  in2;
reg  cin;
wire sum;
wire cout;

initial begin
	in1 <= 1'b0;
	in2 <= 1'b0;
	cin <= 1'b0;
end

always #10 in1 = ($random) % 2;
always #10 in2 = ($random) % 2;
always #10 cin = ($random) % 2;

full_adder full_adder_inst
(
	.in1  (in1),
	.in2  (in2),
	.cin  (cin),
	.sum  (sum),
	.cout (cout)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : in1 = %b,in2 = %b,cin = %b,sum = %b,cout = %b",$time,in1,in2,cin,sum,cout);
end

endmodule
```

# 时序分析

![800](vault-notes/assets/04-full-adder/fig-01.svg)

- **逻辑关系**：`sum = in1 ^ in2 ^ cin`；`cout` 为三输入多数（至少两个输入为 1）。
- **延迟累加**：代码用两个半加器级联，第二级要等第一级的 `sum0` 和 `cout0` 稳定，整体 `Tpd` 大于单个半加器。
- **进位链**：多位加法器级联时，进位要逐级传递，位数越多关键路径越长；高速设计需要超前进位等结构。
- **假设**：每格 5ns；图中把输出统一延后 1 格，实际内部两级延迟会体现在 `Tpd` 上。

> 理论时序示意图，不是 RTL 仿真波形。
