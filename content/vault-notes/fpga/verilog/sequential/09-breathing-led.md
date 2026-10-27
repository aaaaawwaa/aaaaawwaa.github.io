---
title: "呼吸灯"
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
- 呼吸灯
aliases: []
prerequisites: []
related: []
---

呼吸灯本质是 PWM：保持 LED 的闪烁频率不变，逐渐改变高电平占比，人眼看到的就是亮度渐变。

# RTL文件(.v文件)

```verilog
module breath_led
#(
	parameter CNT_1US_MAX = 6'd49,      // 50MHz 下 1us
	parameter CNT_1MS_MAX = 10'd999,    // 1ms 内的 1us 个数
	parameter CNT_1S_MAX  = 10'd999     // 1s 内的 1ms 个数
)
(
	input  wire clk,
	input  wire rst_n,

	output wire led
);

reg [5:0]  cnt_1us;
reg [9:0]  cnt_1ms;
reg [9:0]  cnt_1s;
reg [9:0]  duty;    // 占空比 0~999
reg        flag;    // 0: 渐亮  1: 渐暗

// 1us 计时
always@(posedge clk or negedge rst_n)
	if(!rst_n)
		cnt_1us <= 6'd0;
	else if(cnt_1us == CNT_1US_MAX)
		cnt_1us <= 6'd0;
	else
		cnt_1us <= cnt_1us + 1'b1;

// 1ms 计时
always@(posedge clk or negedge rst_n)
	if(!rst_n)
		cnt_1ms <= 10'd0;
	else if(cnt_1us == CNT_1US_MAX)
		begin
			if(cnt_1ms == CNT_1MS_MAX)
				cnt_1ms <= 10'd0;
			else
				cnt_1ms <= cnt_1ms + 1'b1;
		end

// 每 1ms 调整一次占空比：约 1s 从 0 加到 999，再约 1s 减回 0
always@(posedge clk or negedge rst_n)
	if(!rst_n)
		begin
			cnt_1s <= 10'd0;
			duty   <= 10'd0;
			flag   <= 1'b0;
		end
	else if((cnt_1us == CNT_1US_MAX) && (cnt_1ms == CNT_1MS_MAX))
		begin
			if(cnt_1s == CNT_1S_MAX)
				begin
					cnt_1s <= 10'd0;
					if(flag == 1'b0)
						begin
							if(duty == CNT_1MS_MAX)
								flag <= 1'b1;
							else
								duty <= duty + 1'b1;
						end
					else
						begin
							if(duty == 10'd0)
								flag <= 1'b0;
							else
								duty <= duty - 1'b1;
						end
				end
			else
				cnt_1s <= cnt_1s + 1'b1;
		end

// PWM 比较：计数值小于占空比时输出高电平
assign led = (cnt_1ms < duty) ? 1'b1 : 1'b0;

endmodule
```

上述RTL代码的几个要点
- PWM 周期为 1ms（1kHz），分辨率 1000 级；`duty` 越大，高电平时间越长，LED 越亮
- 三级计时器逐级分频：50MHz → 1us → 1ms → 1s，用简单的计数器代替多个分频模块
- `flag` 控制渐变方向，0 时每 1ms 加一，加到 999 后翻转为 1，再逐个减回 0
- 人眼分辨不出 1kHz 的闪烁，看到的是稳定的平均亮度，所以能实现“呼吸”效果

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_breath_led();
reg  clk;
reg  rst_n;
wire led;

initial begin
	clk   <= 1'b0;
	rst_n <= 1'b0;
	#25 rst_n <= 1'b1;
end

always #10 clk = ~clk;

breath_led
#(
	.CNT_1US_MAX (6'd1),    // 仿真时压缩时间：2 个时钟为 1us
	.CNT_1MS_MAX (10'd9),
	.CNT_1S_MAX  (10'd9)
)
breath_led_inst
(
	.clk   (clk),
	.rst_n (rst_n),
	.led   (led)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : duty = %d,led = %b",$time,breath_led_inst.duty,led);
end

initial begin
	#10000 $finish;
end

endmodule
```

# 时序分析

![[vault-notes/assets/09-breathing-led/fig-01.svg|800]]

- **PWM 原理**：`cnt_1ms` 在 0~999 循环，`led = (cnt_1ms < duty)`；`duty` 越大，高电平占比越大，LED 越亮。
- **示例占空比**：图中把 1000 级缩略为 10 级，`duty = 3` 表示 30% 的高电平时间。
- **渐变节奏**：`duty` 每 1ms 调整一次，约 1s 从 0 加到 999，再约 1s 减回 0，形成呼吸效果。
- **为什么看不见闪烁**：PWM 频率约 1kHz，高于人眼可分辨的闪烁频率，看到的是平均亮度。
- **易错点**：PWM 频率与分辨率要折中；`duty = 0` 和 `duty = 999` 要正确处理；比较关系用 `<` 时最大占空比略小于 100%。

> 理论时序示意图，不是 RTL 仿真波形。
