---
title: "RTL-硬件思维"
type: course
subjects:
- FPGA
domains:
- 工具与仿真
- 硬件实现
tags:
- FPGA
- Vivado
- FlowNavigator
- BASE
status: todo
---

# 03 · 最低限度 RTL 硬件思维

> 前置：[[vault-notes/fpga/vivado/base/02-target-device-source-top]]  
> 解锁：理解后面的示意电路与仿真波形

## 为什么是前置知识
Verilog 描述并行电路而非普通程序。若不知道寄存器和时钟的含义，无法判断综合网表与实际波形。

## 最小理解
掌握 module/port（模块接口）、wire/reg（Verilog 信号变量声明）、组合逻辑与时序逻辑、`posedge clk`、同步/异步复位、非阻塞赋值 `<=`、时钟频率与周期。`always @(posedge clk ...)` 通常描述触发器更新；组合逻辑在输入变化时响应，必须给输出完整赋值以免意外锁存器。Testbench 的延时 `#` 不属于普通可综合硬件电路。

## 在 Vivado 中动手
1. 阅读 `examples/rtl/led_blink.v`，分别标出输入时钟、复位、计数寄存器和输出。  
2. 推导 HALF_PERIOD 的含义：CLK_HZ = 100 MHz 时，对每 50,000,000 个时钟翻转一次 LED。  
3. 回答：为什么输出不是每个时钟周期都翻转？

## 通过标准（不看教程独立完成）
能说明时钟周期与计数翻转之间的关系；能把 `<=` 与寄存器在时钟边沿更新联系起来。

## 易错与定位
引脚复位有效极性可能与代码相反；不要无视 Verilog 计数器位宽限制。此示例要求 CLK_HZ ≥ 4。

## 官方来源
- [UG892](https://docs.amd.com/r/en-US/ug892-vivado-design-flows-overview)

## 学习复盘（自己填写）
- 我现在能用一句话解释它吗？
- 我操作的菜单路径：
- 本次实际错误、错误位置及修复：
- 与下一篇笔记的关系：
