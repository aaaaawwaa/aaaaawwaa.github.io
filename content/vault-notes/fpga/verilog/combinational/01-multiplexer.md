---
title: "简单时序逻辑--多路选择器"
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
- 多路选择器
aliases: []
prerequisites: []
related: []
---

以下为基础的二选一选择器(MUX)，不同代码类型的分析
# RTL文件(.v文件)

```verilog
module mux2_1
(
	input wire in1, // 输入信号
	input wire in2, // 输入信号2
	input wire sel, // 输入选通信号
	
	output reg out // 输出信号
);

always@(*)
	if(sel == 1'b1)
		out = in1;
	else
		out = in2;

endmodule
```

上述RTL代码由几个基础部分组成
- `module ... endmodule`是整个代码的骨架，整个代码从module 开始，从endmodule结束
- `wire`和`reg`是两个不同的变量类型，`wire`变量通过`assign`语句赋值，通常属于时序逻辑的连续赋值；`reg`型变量通过`always`语句块中赋值，通常属于组合逻辑的赋值
- `always@(*)`的含义 ： 当代码块内部用到的任何一种输入信号发生变化时，立即执行这个always块

# Testbench/仿真测试文件(.v文件)
```verilog
'timescale 1ns/1ps
module tb_mux2_1();
reg in1;
reg in2;
reg sel;
wire out;
initial begin 
	in1 <= 1'b0;
	in2 <= 1'b0;
	sel <= 1'b0;
end

always #10 in1 = ($random) % 2;
always #10 in2 = ($random) % 2;
always #10 sel = ($random) % 2;

mux2_1 mux2_1_inst(
	.in1(in1),
	.in2(in2), 
	.sel(sel),
	.out(out)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : in1 = %b,in2 = %b,sel = %b,out = %b",$time,in1,in2,sel,out);
	end
```

# Constraint/约束文件(.xdc文件)

## 1. 基本格式
```verilog
set_propety <属性名> <属性值> [get_ports<端口名>]
```
## 2. 基本约束
```verilog
set_propety IOSTANDARD "LVCMOS33" [get_ports led[0]]
```

*备注： 此处的端口名，要按照开发板原理图或者板卡提供的约束模板确定*

# 时序分析

![[vault-notes/assets/01-multiplexer/fig-01.svg|800]]

- **选择关系**：`sel = 1` 时 `out = in1`，`sel = 0` 时 `out = in2`；`out` 始终等于被选中的那一路输入。
- **传播延迟**：组合逻辑没有时钟沿，`sel` 或数据变化后，`out` 经过一段 `Tpd` 才稳定；图中用延迟 1 个时间格（约 5ns）示意。
- **毛刺风险**：`sel` 切换瞬间若两路输入电平不同，`out` 可能出现窄毛刺；后级若对毛刺敏感，应寄存一拍再使用。
- **假设**：图中每格 5ns，只表达“输入变化 → 输出延后更新”的因果关系，不代表具体器件的真实 `Tpd`。

> WaveDrom 图是理论时序示意，不是 RTL 仿真波形；真实延迟请以综合报告和门级仿真为准。
