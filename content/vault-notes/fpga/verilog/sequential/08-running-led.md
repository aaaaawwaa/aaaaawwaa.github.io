---
title: "流水灯"
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
- 流水灯
aliases: []
prerequisites: []
related: []
---

流水灯用定时器控制移位寄存器的左移节奏，每隔固定时间点亮下一颗 LED。

# RTL文件(.v文件)

```verilog
module led_flow
#(
	parameter TIME_500MS = 25'd24_999_999   // 50MHz 时钟下 500ms 对应的计数值
)
(
	input  wire clk,
	input  wire rst_n,

	output reg  [3:0] led
);

reg [24:0] cnt;

// 500ms 定时器
always@(posedge clk or negedge rst_n)
	if(!rst_n)
		cnt <= 25'd0;
	else if(cnt == TIME_500MS)
		cnt <= 25'd0;
	else
		cnt <= cnt + 1'b1;

// 定时时间到，LED 循环左移一位
always@(posedge clk or negedge rst_n)
	if(!rst_n)
		led <= 4'b0001;
	else if(cnt == TIME_500MS)
		led <= {led[2:0], led[3]};   // 最高位移到最低位，形成循环

endmodule
```

上述RTL代码的几个要点
- `{led[2:0], led[3]}` 是位拼接，把低 3 位和高 1 位重新组合，实现循环左移
- 移位的条件是定时器计满，所以 LED 每 500ms 移动一次；改变 `TIME_500MS` 就能调整速度
- 想让灯从高到低流动，可改成 `{led[0], led[3:1]}`
- LED 位宽按板卡实际数量调整，AC820 板载用户 LED 为 4 个
- 若觉得单灯流动太单调，可以在 `case` 中为每个状态指定不同的亮灯组合

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_led_flow();
reg        clk;
reg        rst_n;
wire [3:0] led;

initial begin
	clk   <= 1'b0;
	rst_n <= 1'b0;
	#25 rst_n <= 1'b1;
end

always #10 clk = ~clk;

led_flow
#(
	.TIME_500MS (4)   // 仿真时缩短到 5 个时钟周期，便于观察移位
)
led_flow_inst
(
	.clk   (clk),
	.rst_n (rst_n),
	.led   (led)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : led = %b",$time,led);
end

endmodule
```

# 时序分析

![800](vault-notes/assets/08-running-led/fig-01.svg)

- **移位节拍**：`cnt` 每计满 `TIME_500MS` 产生一次 `timer_tick`，`led` 在此时循环左移一位。
- **循环关系**：`{led[2:0], led[3]}` 把最高位移到最低位，所以 `1000` 之后回到 `0001`，不会移出有效位。
- **时间尺度**：每格 500ms；`timer_tick` 实际只有 20ns，图中放大为一个时间格。
- **易错点**：位拼接顺序决定流动方向；LED 位宽要与板卡一致；定时器位宽要能计到 `TIME_500MS`。
- **假设**：复位后 `led = 0001`，每 500ms 移动一次。

> 理论时序示意图，不是 RTL 仿真波形。
