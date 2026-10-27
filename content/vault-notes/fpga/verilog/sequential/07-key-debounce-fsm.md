---
title: "按键消抖"
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
- 按键消抖
aliases:
- 按键消抖-状态机
- 状态机消抖
prerequisites: []
related: []
---

与上一篇计数器延时消抖不同，这里用状态机把“松开、按下抖动、稳定按下、松开抖动”四个阶段显式描述出来。

# RTL文件(.v文件)

```verilog
module key_debounce_fsm
#(
	parameter CNT_MAX = 20'd1_000_000   // 50MHz 时钟下 20ms 对应的计数值
)
(
	input  wire clk,
	input  wire rst_n,
	input  wire key_in,     // 按键输入，按下为低电平

	output reg  key_flag    // 确认按下时输出一个时钟周期的高脉冲
);

localparam IDLE    = 2'b00;   // 按键松开
localparam PRESS   = 2'b01;   // 按下抖动计时
localparam HOLD    = 2'b10;   // 已稳定按下
localparam RELEASE = 2'b11;   // 松开抖动计时

reg [1:0]  state;
reg [19:0] cnt;

always@(posedge clk or negedge rst_n)
	if(!rst_n)
		begin
			state    <= IDLE;
			cnt      <= 20'd0;
			key_flag <= 1'b0;
		end
	else
		begin
			key_flag <= 1'b0;   // 默认清零，保证 flag 只持续一个周期
			case(state)
				IDLE:
					begin
						cnt <= 20'd0;
						if(key_in == 1'b0)
							state <= PRESS;
					end
				PRESS:
					if(key_in == 1'b1)              // 抖动，回到松开
						begin
							state <= IDLE;
							cnt   <= 20'd0;
						end
					else if(cnt == CNT_MAX - 1)     // 连续 20ms 低电平，确认按下
						begin
							state    <= HOLD;
							cnt      <= 20'd0;
							key_flag <= 1'b1;
						end
					else
						cnt <= cnt + 1'b1;
				HOLD:
					begin
						cnt <= 20'd0;
						if(key_in == 1'b1)
							state <= RELEASE;
					end
				RELEASE:
					if(key_in == 1'b0)              // 抖动，回到稳定按下
						begin
							state <= HOLD;
							cnt   <= 20'd0;
						end
					else if(cnt == CNT_MAX - 1)     // 连续 20ms 高电平，确认松开
						begin
							state <= IDLE;
							cnt   <= 20'd0;
						end
					else
						cnt <= cnt + 1'b1;
				default:
					state <= IDLE;
			endcase
		end

endmodule
```

上述RTL代码的几个要点
- 四个状态对应按键的完整生命周期，任何一次抖动都会把计时清零，只有稳定保持 20ms 才进入下一状态
- 与上一篇的区别：计数器版只输出“稳定电平”，状态机版可以同时区分按下和松开两条路径，便于扩展成长按、双击等功能
- `key_flag` 在 `case` 之前默认清零，只在 `PRESS → HOLD` 时置 1，天然只持续一个时钟周期
- 实际使用时可把 `key_flag` 接到计数器的使能端，实现按一次加一

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_key_debounce_fsm();
reg  clk;
reg  rst_n;
reg  key_in;
wire key_flag;

initial begin
	clk    <= 1'b0;
	rst_n  <= 1'b0;
	key_in <= 1'b1;
	#25 rst_n <= 1'b1;

	// 抖动：每次只保持 2 个时钟周期，不足仿真的 5 个周期
	#100 key_in <= 1'b0;
	#40  key_in <= 1'b1;
	#40  key_in <= 1'b0;
	#40  key_in <= 1'b1;
	#40  key_in <= 1'b0;

	#1000 key_in <= 1'b1;   // 稳定松开
	#1000 key_in <= 1'b0;   // 再次稳定按下
	#1000 $finish;
end

always #10 clk = ~clk;

key_debounce_fsm
#(
	.CNT_MAX (5)
)
key_debounce_fsm_inst
(
	.clk      (clk),
	.rst_n    (rst_n),
	.key_in   (key_in),
	.key_flag (key_flag)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : key_in = %b,state = %b,key_flag = %b",$time,key_in,key_debounce_fsm_inst.state,key_flag);
end

endmodule
```

# 时序分析

![[vault-notes/assets/07-key-debounce-fsm/fig-01.svg|800]]

- **状态流转**：`IDLE → PRESS → HOLD → RELEASE → IDLE`；按下和松开各自需要连续稳定 20ms 才确认。
- **抖动处理**：`PRESS` 或 `RELEASE` 期间只要输入回到原状态，就退回上一稳定状态并清零计时。
- **输出**：`key_flag` 在 `PRESS → HOLD` 时置 1，只保持一个时钟周期；松开不产生脉冲。
- **与计数器版的区别**：状态机显式区分四个阶段，便于扩展长按、双击、组合键；计数器版更简洁。
- **时间尺度**：每格 = 1 个 20ms 消抖窗口；`key_flag` 实际只有 20ns。

> 理论时序示意图，不是 RTL 仿真波形。
