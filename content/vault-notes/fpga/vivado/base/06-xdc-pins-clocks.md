---
title: "XDC-引脚-时钟"
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

# 06 · XDC：引脚、电平与时钟

> 前置：[[vault-notes/fpga/vivado/base/02-target-device-source-top]]、[[vault-notes/fpga/vivado/base/03-rtl-hardware-thinking]]  
> 解锁：告诉工具接口在哪、设计要跑多快

## 为什么是前置知识
缺少约束的电路即使 RTL 正确，也可能无法正确连接实际硬件或没有有效的时序验证目标。

## 最小理解
XDC 是设计约束，不是 Verilog 逻辑。首轮只掌握三种命令：`create_clock`（时钟周期）、`set_property PACKAGE_PIN`（物理封装引脚）和 `set_property IOSTANDARD`（接口电平标准）。100 MHz 的时钟周期是 10 ns；真实引脚和电平标准必须来自开发板官方原理图/主约束文件，绝不能凭示例猜测。复位按键的有效电平也要核实。

## 在 Vivado 中动手
1. 在 Constraints 加入 `examples/constraints/board_template.xdc`。  
2. 核对板上时钟实际频率，若为 100 MHz 则可保留 `create_clock -period 10.000 [get_ports clk]`。  
3. 根据板级 XDC 或引脚手册填写 clk、rst_n、led 的 PACKAGE_PIN、IOSTANDARD；不要照抄其它板子的引脚。  
4. 检查所有 top-level ports 约束是否完整、是否有冲突，并查看 DRC。

## 通过标准（不看教程独立完成）
能解释 PACKAGE_PIN 和 create_clock 不同；能指出 `get_ports` 对应顶层端口而不是某个内部信号。

## 易错与定位
时钟周期与板上振荡器不一致、顶层端口名不一致、错误 IOSTANDARD、遗漏引脚都可能造成问题；板级文件使用前必须核对。

## 官方来源
- [XDC](https://docs.amd.com/r/en-US/ug903-vivado-using-constraints/Primary-Clocks-Examples)

## 学习复盘（自己填写）
- 我现在能用一句话解释它吗？
- 我操作的菜单路径：
- 本次实际错误、错误位置及修复：
- 与下一篇笔记的关系：
