---
title: "计数器"
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
- 计数器
aliases: []
prerequisites: []
related: []
---

计数器是时序逻辑中最常用的模块，本质上就是一个在时钟沿自增的寄存器。

# RTL文件(.v文件)

```verilog
module counter
#(
	parameter CNT_MAX = 4'd9   // 计数上限，0~9 共 10 个状态
)
(
	input  wire       clk,
	input  wire       rst_n,
	input  wire       en,      // 计数使能

	output reg  [3:0] cnt
);

always@(posedge clk or negedge rst_n)
	if(!rst_n)
		cnt <= 4'd0;
	else if(en)
		begin
			if(cnt == CNT_MAX)
				cnt <= 4'd0;      // 计满归零
			else
				cnt <= cnt + 1'b1;
		end
	// en 为 0 时不赋值，cnt 自动保持原值

endmodule
```

上述RTL代码的几个要点
- `cnt` 在 `always` 块中被赋值，必须声明为 `reg`；若在模块外部通过连线使用，再接一根 `wire`
- 没有写 `else` 时寄存器保持原值，正好实现使能功能，注意这和组合逻辑缺少 `else` 产生锁存器不是一回事
- 用 `parameter` 定义计数上限，修改分频比或计数范围时只需要改参数
- `cnt + 1'b1` 会自动按位宽截断，计满后即使不回零也会溢出回绕，但显式归零更清晰

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_counter();
reg        clk;
reg        rst_n;
reg        en;
wire [3:0] cnt;

initial begin
	clk   <= 1'b0;
	rst_n <= 1'b0;
	en    <= 1'b1;
	#25 rst_n <= 1'b1;
end

always #10 clk = ~clk;

counter counter_inst
(
	.clk   (clk),
	.rst_n (rst_n),
	.en    (en),
	.cnt   (cnt)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : en = %b,cnt = %d",$time,en,cnt);
end

endmodule
```

# 时序分析

![800](vault-notes/assets/03-counters/fig-01.svg)

- **计数条件**：`en = 1` 时，每个 `clk` 上升沿 `cnt` 加一；`en = 0` 时保持原值。
- **归零**：`cnt` 计到 `CNT_MAX = 9` 后回到 0；图中只画到 6，剩余过程按同样规律继续。
- **复位优先**：`rst_n = 0` 时 `cnt` 清零，复位优先于计数使能。
- **易错点**：计数器位宽要能表示最大值；比较值应与参数一致；`en = 0` 时保持是寄存器行为，不是锁存器。
- **假设**：50MHz，每格 20ns；图中忽略 `Tco`。

> 理论时序示意图，不是 RTL 仿真波形。
