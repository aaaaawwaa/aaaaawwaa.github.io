---
title: "状态机"
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
- 状态机
aliases: []
prerequisites: []
related: []
---

状态机（FSM）用来描述有先后顺序、状态明确的行为。下面用三段式写法实现一个 3 状态循环切换的 LED 控制。

# RTL文件(.v文件)

```verilog
module fsm_led
#(
	parameter TIME_500MS = 25'd24_999_999   // 50MHz 时钟下 500ms
)
(
	input  wire clk,
	input  wire rst_n,

	output reg  [2:0] led
);

localparam S0 = 2'b00;
localparam S1 = 2'b01;
localparam S2 = 2'b10;

reg [1:0]  state;
reg [1:0]  next_state;
reg [24:0] cnt;

wire en;

// 500ms 定时器，计满时产生一个时钟周期的使能
always@(posedge clk or negedge rst_n)
	if(!rst_n)
		cnt <= 25'd0;
	else if(cnt == TIME_500MS)
		cnt <= 25'd0;
	else
		cnt <= cnt + 1'b1;

assign en = (cnt == TIME_500MS);

// 第一段：状态寄存器，只在时钟沿更新
always@(posedge clk or negedge rst_n)
	if(!rst_n)
		state <= S0;
	else
		state <= next_state;

// 第二段：次态逻辑，组合逻辑
always@(*)
	case(state)
		S0:      next_state = en ? S1 : S0;
		S1:      next_state = en ? S2 : S1;
		S2:      next_state = en ? S0 : S2;
		default: next_state = S0;
	endcase

// 第三段：输出逻辑
always@(posedge clk or negedge rst_n)
	if(!rst_n)
		led <= 3'b001;
	else
		case(next_state)
			S0:      led <= 3'b001;
			S1:      led <= 3'b010;
			S2:      led <= 3'b100;
			default: led <= 3'b001;
		endcase

endmodule
```

上述RTL代码的几个要点
- 三段式状态机把“状态寄存器”“次态逻辑”“输出逻辑”分开写，结构清晰、便于维护
- 第一段和第三段是时序逻辑，用非阻塞赋值；第二段是组合逻辑，用阻塞赋值并给 `default` 分支
- `localparam` 定义状态编码，比直接写数字可读性更好
- `case` 的 `default` 分支保证综合不会推断出锁存器，也能在状态跑飞时自动回到 `S0`
- 把 `en` 换成按键消抖后的脉冲，就变成“按一次换一个状态”的交互式状态机

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_fsm_led();
reg        clk;
reg        rst_n;
wire [2:0] led;

initial begin
	clk   <= 1'b0;
	rst_n <= 1'b0;
	#25 rst_n <= 1'b1;
end

always #10 clk = ~clk;

fsm_led
#(
	.TIME_500MS (4)   // 仿真时缩短到 5 个时钟周期，便于观察状态切换
)
fsm_led_inst
(
	.clk   (clk),
	.rst_n (rst_n),
	.led   (led)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : state = %b,led = %b",$time,fsm_led_inst.state,led);
end

endmodule
```

# 时序分析

![[vault-notes/assets/10-finite-state-machines/fig-01.svg|800]]

- **三段式结构**：状态寄存器（时序）、次态逻辑（组合）、输出逻辑（时序）分开编写。
- **状态转换**：每个 `en` 脉冲到来时 `S0 → S1 → S2 → S0` 循环；`en` 由 500ms 定时器产生，实际只持续一个时钟周期。
- **输出关系**：`led` 在每个状态下输出对应的 one-hot 值 `001`、`010`、`100`，与状态同步切换。
- **时间尺度**：每格 = 1 个 500ms 定时周期；图中把 `en` 画成一个时间格便于观察。
- **易错点**：次态逻辑用阻塞赋值并写 `default`；状态寄存器用非阻塞；输出既可按 `state` 也可按 `next_state` 对齐，需全篇统一。

> 理论时序示意图，不是 RTL 仿真波形。
