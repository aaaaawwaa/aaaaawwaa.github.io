---
title: "寄存器"
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
- 寄存器
aliases: []
prerequisites: []
related: []
---

寄存器是最基础的时序逻辑，在时钟上升沿把输入数据锁存到输出。

# RTL文件(.v文件)

```verilog
module register
(
	input  wire       clk,
	input  wire       rst_n,      // 低电平复位
	input  wire [7:0] data_in,

	output reg  [7:0] data_out
);

always@(posedge clk or negedge rst_n)
	if(!rst_n)
		data_out <= 8'd0;
	else
		data_out <= data_in;

endmodule
```

上述RTL代码的几个要点
- `always@(posedge clk ...)` 表示只在时钟上升沿触发，这是时序逻辑的标志
- `negedge rst_n` 是异步复位，复位信号一有效就立即生效，不依赖时钟
- 时序逻辑中使用非阻塞赋值 `<=`，保证所有寄存器在同一个时钟沿同时更新
- `rst_n` 的命名中 `_n` 表示低电平有效，`if(!rst_n)` 即复位

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_register();
reg        clk;
reg        rst_n;
reg  [7:0] data_in;
wire [7:0] data_out;

initial begin
	clk     <= 1'b0;
	rst_n   <= 1'b0;
	data_in <= 8'd0;
	#25 rst_n <= 1'b1;
end

always #10 clk = ~clk;                  // 周期 20ns 的时钟

always #20 data_in = ($random) % 256;   // 每 20ns 改变一次输入数据

register register_inst
(
	.clk      (clk),
	.rst_n    (rst_n),
	.data_in  (data_in),
	.data_out (data_out)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : rst_n = %b,data_in = %d,data_out = %d",$time,rst_n,data_in,data_out);
end

endmodule
```

# 时序分析

![800](vault-notes/assets/01-registers/fig-01.svg)

- **采样时刻**：`data_out` 只在 `clk` 上升沿更新；`data_in` 变为 `0xA5` 后，`data_out` 在下一个采样沿才跟着变化，因此晚一拍。
- **复位**：`rst_n` 低电平有效，属于异步复位；复位期间 `data_out` 被强制为 `0`，不等待时钟沿。
- **时间尺度**：假设 50MHz，每格 20ns；图中忽略 `Tco`，把输出跳变画在采样沿处。
- **易错点**：异步复位释放应加复位同步器；时序逻辑必须用非阻塞赋值。
- **假设**：图中 `data_in` 在采样沿前已稳定，满足建立时间；真实设计需检查建立/保持时间。

> 理论时序示意图，不是 RTL 仿真波形。
