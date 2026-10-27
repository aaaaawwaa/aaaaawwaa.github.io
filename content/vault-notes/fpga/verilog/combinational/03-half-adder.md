---
title: "半加器"
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
- 加法器
aliases: []
prerequisites: []
related: []
---

半加器不考虑低位进位，只对两个 1 位输入求和，输出本位和 `sum` 与进位 `cout`。

# RTL文件(.v文件)

```verilog
module half_adder
(
	input  wire in1,
	input  wire in2,

	output wire sum,   // 本位和
	output wire cout   // 向高位的进位
);

assign sum  = in1 ^ in2;
assign cout = in1 & in2;

endmodule
```

上述RTL代码的几个要点
- `assign` 是连续赋值语句，等号右边任何信号变化都会立即重新计算，只能用于 `wire` 型变量
- `^` 为按位异或，两个输入不同时 `sum` 为 1；`&` 为按位与，两个输入同时为 1 时 `cout` 为 1
- 半加器没有进位输入，用两个半加器加一个或门就可以组成全加器

# Testbench/仿真测试文件(.v文件)
```verilog
`timescale 1ns/1ps
module tb_half_adder();
reg  in1;
reg  in2;
wire sum;
wire cout;

initial begin
	in1 <= 1'b0;
	in2 <= 1'b0;
end

always #10 in1 = ($random) % 2;
always #10 in2 = ($random) % 2;

half_adder half_adder_inst
(
	.in1  (in1),
	.in2  (in2),
	.sum  (sum),
	.cout (cout)
);

initial begin
	$timeformat(-9,0,"ns",6);
	$monitor("time:%t : in1 = %b,in2 = %b,sum = %b,cout = %b",$time,in1,in2,sum,cout);
end

endmodule
```

# 时序分析

![800](vault-notes/assets/03-half-adder/fig-01.svg)

- **逻辑关系**：`sum = in1 ^ in2`，`cout = in1 & in2`；真值表为 `00→00`、`01/10→10`、`11→01`（依次为 `cout sum`）。
- **无时钟**：半加器是纯组合逻辑，输出在输入变化后经过 `Tpd` 更新，图中延后 1 格示意。
- **级联限制**：没有进位输入 `cin`，半加器不能直接级联成多位加法器；两个半加器加一个或门才能组成全加器。
- **假设**：每格 5ns；只示意逻辑与延迟关系，不对应具体工艺的 `Tpd`。

> 理论时序示意图，不是 RTL 仿真波形。
