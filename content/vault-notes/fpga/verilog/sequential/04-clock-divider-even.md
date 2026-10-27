---
title: "分频器1- 偶分频"
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

偶数分频是把输入时钟的频率除以一个偶数，输出占空比仍为 50%。

# RTL文件(.v文件)

```verilog
module divider_even
#(
	parameter DIV = 10   // 偶数分频系数，输出频率 = 输入频率 / DIV
)
(
	input  wire clk,
	input  wire rst_n,

	output reg  clk_out
);

reg [31:0] cnt;

always@(posedge clk or negedge rst_n)
	if(!rst_n)
		begin
			cnt     <= 32'd0;
			clk_out <= 1'b0;
		end
	else if(cnt == DIV/2 - 1)
		begin
			cnt     <= 32'd0;
			clk_out <= ~clk_out;   // 每半个输出周期翻转一次
		end
	else
		cnt <= cnt + 1'b1;

endmodule
```

上述RTL代码的几个要点
- 只需在源时钟上升沿计数，计到 `DIV/2 - 1` 让输出翻转，高低电平各占 `DIV/2` 个源时钟周期
- 输出频率 = 输入频率 / DIV，占空比 = 50%；例如 50MHz 分频到 1Hz，DIV = 50_000_000
- `DIV` 必须是偶数，若改成奇数需要用下一节的奇分频方法
- 分频出来的信号建议作为使能或数据使用；如果要用作其他逻辑的时钟，更推荐用“每 DIV 个周期产生一个脉冲”的时钟使能方式，避免门控时钟

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_divider_even();
reg  clk;
reg  rst_n;
wire clk_out;

initial begin
	clk   <= 1'b0;
	rst_n <= 1'b0;
	#25 rst_n <= 1'b1;
end

always #10 clk = ~clk;   // 输入时钟周期 20ns，DIV=10 时输出周期应为 200ns

divider_even
#(
	.DIV (10)
)
divider_even_inst
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

![[vault-notes/assets/04-clock-divider-even/fig-01.svg|800]]

- **翻转时刻**：`cnt` 从 0 计到 `DIV/2 - 1 = 4` 时，`clk_out` 翻转一次；`cnt` 归零后继续。
- **频率与占空比**：输出频率 = 输入频率 / DIV；本例 DIV = 10，输入 50MHz，输出 5MHz，周期 200ns，占空比 50%。
- **时间尺度**：每格 20ns；图中只画一个输出周期。
- **设计建议**：分频输出最好作为时钟使能使用；如果要驱动其他时钟域，优先用 MMCM/PLL 或时钟使能，避免门控时钟。
- **易错点**：DIV 必须是偶数；`cnt` 位宽要足够；奇数分频不能用这个结构。

> 理论时序示意图，不是 RTL 仿真波形。
