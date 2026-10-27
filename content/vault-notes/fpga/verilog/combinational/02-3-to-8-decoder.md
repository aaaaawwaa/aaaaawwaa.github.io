---
title: "3-8译码器"
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
- 译码器
aliases: []
prerequisites: []
related: []
---

# RTL文件(.v文件)

```verilog
module decoder
(
	input wire in1,
	input wire in2,
	input wire in3,
	output reg [7:0] out
);

always@(*)
	if((in1,in2,in3) == 3'b000)
		out = 8'b0000_0001;
	else if((in1,in2,in3) == 3'b001)
		out = 8'b0000_0010;
	else if((in1,in2,in3) == 3'b010)
		out = 8'b0000_0100;
	else if((in1,in2,in3) == 3'b011)
		out = 8'b0000_1000;
	else if((in1,in2,in3) == 3'b100)
		out = 8'b0001_0000;
	else if((in1,in2,in3) == 3'b101)
		out = 8'b0010_0000;
	else if((in1,in2,in3) == 3'b110)
		out = 8'b0100_0000;
	else
		out = 8'b1000_0000;

endmodule
```

# Testbench/仿真测试文件(.v文件)
```verilog
'timescale 1ns/1ps
module tb_decoder();
reg in1;
reg in2;
reg in3;
wire out;

initial begin 
	in1 <= 1'b0;
	in2 <= 1'b0;
	in3 <= 1'b0;
end

always #10 in1 = ($random)%2;
always #10 in2 = ($random)%2;
always #10 in3 = ($random)%2;

decoder decoder_inst
(
	.in1(in1),
	.in2(in2),
	.in3(in3),
	.out(out)
);

initial begin 
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : in1 = %b,in2 = %b,in3 = %b,sel = %b,out = %b",$time,in1,in2,in3,sel,out);
end
```




# 时序分析

![800](vault-notes/assets/02-3-to-8-decoder/fig-01.svg)

- **译码关系**：`in1/in2/in3` 从 `000` 递增到 `111`，`out[7:0]` 对应只有一位为 1（one-hot）；图中 `out` 用十六进制简写（0x01、0x02、…、0x80）。
- **传播延迟**：输入变化后，`out` 经过 `Tpd` 才稳定；8 个输出位的路径延迟可能略有差异。
- **竞争冒险**：输入从 `011` 变到 `100` 时多位同时翻转，可能出现瞬时错误输出；对毛刺敏感时应加输出寄存器或使能信号。
- **假设**：每格 5ns；图中把输出统一延后 1 格，只作逻辑关系示意。

> 理论时序示意图，不是 RTL 仿真波形。
