---
title: Verilog 时序逻辑
description: 用 always 块与非阻塞赋值描述触发器，讨论异步复位与同步释放、建立保持时间与综合陷阱。
tags:
  - digital-systems
  - verilog
  - sequential-logic
---

## 组合逻辑与时序逻辑

组合逻辑的输出只取决于当前输入，用 `assign` 或对输入敏感的 `always @(*)` 描述；时序逻辑的输出还取决于历史状态，必须有存储元件——触发器或寄存器。在 FPGA 中，存储元件几乎都由时钟边沿控制，因此时序逻辑的模板几乎固定。

## always 块：描述"何时"而不是"如何"

下面是最基本的 D 触发器。注意敏感列表中同时包含时钟上升沿与复位下降沿，这表示异步复位：

```verilog
module dff_async_rst (
    input  wire clk,
    input  wire rst_n,
    input  wire d,
    output reg  q
);
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) q <= 1'b0;
        else        q <= d;
    end
endmodule
```

## 阻塞赋值与非阻塞赋值

这是 Verilog 最容易出错的地方，规则只有一条：**时序逻辑用非阻塞 `<=`，组合逻辑用阻塞 `=`**。

非阻塞赋值在时间步结束时统一更新，多个寄存器之间因此表现为"同时"更新，正好对应真实触发器由同一时钟沿同时采样的行为。若在时序逻辑中误用阻塞赋值，多个寄存器会形成串行的求值顺序，仿真与综合结果可能不一致（常见的移位寄存器"多移了一位"就是这种情况）。

## 同步复位与异步复位

异步复位不依赖时钟，上电时立即生效，但释放时刻若接近时钟沿会引入亚稳态风险；同步复位干净，但需要时钟已经在跑。工程上的折中方案是「异步复位、同步释放」：

```verilog
module reset_sync (
    input  wire clk,
    input  wire arst_n,      // 低有效异步复位输入
    output wire srst_n       // 低有效同步复位输出
);
    reg [1:0] sync;
    always @(posedge clk or negedge arst_n) begin
        if (!arst_n) sync <= 2'b00;
        else         sync <= {sync[0], 1'b1};
    end
    assign srst_n = sync[1];
endmodule
```

## 建立时间与保持时间

数据必须在时钟沿之前稳定一段时间（建立时间 $t_{su}$），并在时钟沿之后继续保持一段时间（保持时间 $t_h$），否则可能采到亚稳态。单周期路径的约束可写为

$$
t_{co}+t_{comb}+t_{su}\le T_{clk}-t_{skew}
$$

其中 $t_{co}$ 是触发器时钟到输出的延迟，$t_{comb}$ 是中间组合逻辑延迟。综合工具会用这条不等式检查时序是否能收敛。

> [!warning] 三个高频错误
> 1. 在同一 `always` 块里对同一信号既阻塞又非阻塞赋值；
> 2. 组合逻辑 `case` 缺少 `default` 分支，综合出意料之外的锁存器；
> 3. 同一信号在两个 `always` 块中被驱动（多驱动），综合直接报错。

## 计数器示例

```verilog
module tick_gen #(parameter integer N = 50_000) (
    input  wire clk,
    input  wire rst_n,
    output reg  tick
);
    reg [15:0] cnt;
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            cnt  <= 16'd0;
            tick <= 1'b0;
        end else if (cnt == N - 1) begin
            cnt  <= 16'd0;
            tick <= 1'b1;          // 单周期脉冲
        end else begin
            cnt  <= cnt + 16'd1;
            tick <= 1'b0;
        end
    end
endmodule
```

## 相关阅读

- [[Digital-Systems/FSM-Design|有限状态机设计]]
- [[Projects/UART-Loopback-Project|UART 回环项目]]
- [[Programming/C-Pointer-and-Memory|C 指针与内存]]
