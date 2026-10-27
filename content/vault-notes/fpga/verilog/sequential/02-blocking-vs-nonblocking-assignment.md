---
title: "阻塞赋值和非阻塞赋值"
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
- 时序逻辑
- 赋值
aliases: []
prerequisites: []
related: []
---

阻塞赋值 `=` 和非阻塞赋值 `<=` 的区别，是时序逻辑中最容易出错的地方。下面用同一段逻辑的两种写法做对比。

# RTL文件(.v文件)

```verilog
// 非阻塞赋值：两个寄存器在同一个时钟沿同时更新
module nonblocking_demo
(
	input  wire clk,
	input  wire rst_n,
	input  wire in,

	output reg  out1,
	output reg  out2
);

always@(posedge clk or negedge rst_n)
	if(!rst_n)
		begin
			out1 <= 1'b0;
			out2 <= 1'b0;
		end
	else
		begin
			out1 <= in;
			out2 <= out1;   // 采到的是上一拍的 out1，两级寄存器
		end

endmodule
```

```verilog
// 阻塞赋值：语句顺序执行，out2 立即拿到本拍更新后的 out1
module blocking_demo
(
	input  wire clk,
	input  wire rst_n,
	input  wire in,

	output reg  out1,
	output reg  out2
);

always@(posedge clk or negedge rst_n)
	if(!rst_n)
		begin
			out1 = 1'b0;
			out2 = 1'b0;
		end
	else
		begin
			out1 = in;
			out2 = out1;   // out1 已被更新，等效于 out2 = in，两级寄存器被合并
		end

endmodule
```

上述RTL代码的几个要点
- 阻塞 `=`：按书写顺序立即执行，后面的语句能看到前面语句的结果
- 非阻塞 `<=`：等号右边先取值，所有赋值在时钟沿结束时同时生效
- 时序逻辑统一使用非阻塞赋值，组合逻辑统一使用阻塞赋值，不要在同一个 `always` 块中混用
- 用阻塞写寄存器链会丢失中间寄存器的延时，综合后可能只剩一级逻辑

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_blocking();
reg  clk;
reg  rst_n;
reg  in;
wire out1_nb;
wire out2_nb;
wire out1_b;
wire out2_b;

initial begin
	clk   <= 1'b0;
	rst_n <= 1'b0;
	in    <= 1'b0;
	#25 rst_n <= 1'b1;
end

always #10 clk = ~clk;
always #20 in  = ($random) % 2;

nonblocking_demo nonblocking_inst
(
	.clk   (clk),
	.rst_n (rst_n),
	.in    (in),
	.out1  (out1_nb),
	.out2  (out2_nb)
);

blocking_demo blocking_inst
(
	.clk   (clk),
	.rst_n (rst_n),
	.in    (in),
	.out1  (out1_b),
	.out2  (out2_b)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : in = %b,nb_out1 = %b,nb_out2 = %b,b_out1 = %b,b_out2 = %b",$time,in,out1_nb,out2_nb,out1_b,out2_b);
end

endmodule
```

# 时序分析

![800](vault-notes/assets/02-blocking-vs-nonblocking-assignment/fig-01.svg)

- **非阻塞 `<=`**：`out1_nb` 和 `out2_nb` 在同一个时钟沿同时更新，`out2_nb` 采到的是上一拍的 `out1_nb`，形成两级寄存器。
- **阻塞 `=`**：语句按顺序执行，`out2_b` 立即拿到本拍更新后的 `out1_b`，第二级寄存器被合并，`out2_b` 与 `out1_b` 同拍变化。
- **观察方法**：看 `in` 变化后 `out2_nb` 比 `out1_nb` 晚一拍，而 `out2_b` 与 `out1_b` 同时变化。
- **规范**：时序逻辑统一用非阻塞，组合逻辑统一用阻塞，不要在同一 `always` 块中混用。
- **假设**：每格 20ns；忽略 `Tco`；两个模块使用相同的输入和复位。

> 理论时序示意图，不是 RTL 仿真波形。
