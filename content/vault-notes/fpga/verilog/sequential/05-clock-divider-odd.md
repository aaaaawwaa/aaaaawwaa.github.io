---
title: "分频器2 - 奇分频"
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
- 分频器
aliases: []
prerequisites: []
related: []
---

奇数分频无法只用一个时钟沿得到 50% 占空比，需要同时使用上升沿和下降沿。

# RTL文件(.v文件)

```verilog
module divider_odd
#(
	parameter DIV = 5   // 奇数分频系数，输出频率 = 输入频率 / DIV
)
(
	input  wire clk,
	input  wire rst_n,

	output wire clk_out
);

reg [31:0] cnt_p;
reg [31:0] cnt_n;
reg        clk_p;
reg        clk_n;

// 上升沿计数
always@(posedge clk or negedge rst_n)
	if(!rst_n)
		cnt_p <= 32'd0;
	else if(cnt_p == DIV - 1)
		cnt_p <= 32'd0;
	else
		cnt_p <= cnt_p + 1'b1;

// clk_p：在上升沿域产生，高电平持续 (DIV-1)/2 个源周期
always@(posedge clk or negedge rst_n)
	if(!rst_n)
		clk_p <= 1'b0;
	else if(cnt_p == (DIV - 1)/2)
		clk_p <= 1'b1;
	else if(cnt_p == DIV - 1)
		clk_p <= 1'b0;

// 下降沿计数
always@(negedge clk or negedge rst_n)
	if(!rst_n)
		cnt_n <= 32'd0;
	else if(cnt_n == DIV - 1)
		cnt_n <= 32'd0;
	else
		cnt_n <= cnt_n + 1'b1;

// clk_n：在下降沿域产生，比 clk_p 滞后半个源周期
always@(negedge clk or negedge rst_n)
	if(!rst_n)
		clk_n <= 1'b0;
	else if(cnt_n == (DIV - 1)/2)
		clk_n <= 1'b1;
	else if(cnt_n == DIV - 1)
		clk_n <= 1'b0;

// 两路相位相差半个周期的信号相或
assign clk_out = clk_p | clk_n;

endmodule
```

上述RTL代码的几个要点
- 奇数分频要得到 50% 占空比，必须用上升沿和下降沿各产生一路信号
- `clk_p` 高电平持续 `(DIV-1)/2` 个源周期，`clk_n` 与它错开半个源周期
- 两路相或后输出高电平时间为 DIV/2 个源周期，占空比正好 50%，输出频率 = 输入频率 / DIV
- `DIV` 必须是奇数；该结构不是严格同步设计，实际工程中奇数分频更常用“计数器 + 使能”的方式实现

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_divider_odd();
reg  clk;
reg  rst_n;
wire clk_out;

initial begin
	clk   <= 1'b0;
	rst_n <= 1'b0;
	#25 rst_n <= 1'b1;
end

always #10 clk = ~clk;   // 输入周期 20ns，5 分频后输出周期应为 100ns

divider_odd
#(
	.DIV (5)
)
divider_odd_inst
(
	.clk     (clk),
	.rst_n   (rst_n),
	.clk_out (clk_out)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : clk_out = %b",$time,clk_out);
end

endmodule
```

# 时序分析

![[vault-notes/assets/05-clock-divider-odd/fig-01.svg|800]]

- **双沿结构**：`clk_p` 在上升沿域产生，`clk_n` 在下降沿域产生；`clk_n` 比 `clk_p` 滞后半个输入周期。
- **合成结果**：两路相或后，高电平持续 `DIV/2` 个输入周期，得到 50% 占空比；本例 DIV = 5，输出周期 100ns。
- **时间尺度**：图中每格 = 0.5 个输入周期（10ns），这样才能表示半周期相位差。
- **工程建议**：该结构跨两个时钟沿，属于多沿设计；实际工程更常用“计数器 + 时钟使能”实现奇数分频，便于时序约束。
- **易错点**：DIV 必须是奇数；`clk_p/clk_n` 的初始相位会影响输出相位，但不影响频率和占空比。

> 理论时序示意图，不是 RTL 仿真波形。
