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
- 按键消抖-计数器
- 计数器延时消抖
prerequisites: []
related: []
---

机械按键在按下和松开时会产生 5~20ms 的抖动，本笔记用“连续保持 20ms 才认可”的计数器方式消抖。

# RTL文件(.v文件)

```verilog
module key_debounce
#(
	parameter CNT_MAX = 20'd1_000_000   // 50MHz 时钟下 20ms 对应的计数值
)
(
	input  wire clk,
	input  wire rst_n,
	input  wire key_in,     // 按键输入，按下为低电平

	output reg  key_flag    // 确认按下时输出一个时钟周期的高脉冲
);

reg [19:0] cnt;
reg        key_reg;         // 消抖后的稳定电平

always@(posedge clk or negedge rst_n)
	if(!rst_n)
		begin
			cnt      <= 20'd0;
			key_reg  <= 1'b1;
			key_flag <= 1'b0;
		end
	else if(key_in != key_reg)      // 输入与稳定值不同，开始计时
		begin
			if(cnt == CNT_MAX - 1)  // 连续保持 20ms，认可新状态
				begin
					cnt      <= 20'd0;
					key_reg  <= key_in;
					key_flag <= (key_in == 1'b0);   // 只对按下动作给脉冲
				end
			else
				begin
					cnt      <= cnt + 1'b1;
					key_flag <= 1'b0;
				end
		end
	else                            // 输入与稳定值一致，计时清零
		begin
			cnt      <= 20'd0;
			key_flag <= 1'b0;
		end

endmodule
```

上述RTL代码的几个要点
- 按键抖动表现为 `key_in` 在稳定值附近快速跳变，直接采样会被误判为多次按键
- 思路：`key_in` 与当前稳定值 `key_reg` 不同时开始计数，途中一旦恢复一致就清零重来
- 50MHz 时钟下 20ms 对应 1_000_000 个时钟周期；换成其他时钟频率时要同步修改 `CNT_MAX`
- `key_reg` 只在计时满时更新，所以它就是消抖后的稳定电平，可以直接当按键状态使用

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_key_debounce();
reg  clk;
reg  rst_n;
reg  key_in;
wire key_flag;

initial begin
	clk    <= 1'b0;
	rst_n  <= 1'b0;
	key_in <= 1'b1;
	#25 rst_n <= 1'b1;

	// 抖动：每次只保持 2 个时钟周期，不足仿真的 5 个周期，应被滤除
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

key_debounce
#(
	.CNT_MAX (5)   // 仿真时把消抖时间缩短到 5 个时钟周期，实际综合用 1_000_000
)
key_debounce_inst
(
	.clk      (clk),
	.rst_n    (rst_n),
	.key_in   (key_in),
	.key_flag (key_flag)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : key_in = %b,key_flag = %b",$time,key_in,key_flag);
end

endmodule
```

# 时序分析

![800](vault-notes/assets/06-key-debounce/fig-01.svg)

- **抖动过滤**：`key_in` 在按下/松开时快速跳变，只要不能连续保持 20ms，`key_reg` 就不更新。
- **稳定更新**：`key_in` 连续保持 20ms（图中 4 格）后，`key_reg` 才跟随；本例先确认按下，再确认松开。
- **输出脉冲**：`key_flag` 只在确认按下时输出一个时钟周期的高脉冲，松开不输出；图中做了放大显示。
- **时间尺度**：每格 5ms；实际 `key_flag` 只有 20ns（50MHz），远小于一格。
- **易错点**：`CNT_MAX` 必须按实际时钟频率计算；抖动期间计时清零；不要用软件延时代替硬件计数。

> 理论时序示意图，不是 RTL 仿真波形。
