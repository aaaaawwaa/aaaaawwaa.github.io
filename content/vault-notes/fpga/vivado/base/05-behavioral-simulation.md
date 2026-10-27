---
title: "Behavioral-Simulation"
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

# 05 · Behavioral Simulation（行为仿真）

> 前置：[[vault-notes/fpga/vivado/base/03-rtl-hardware-thinking]]、[[vault-notes/fpga/vivado/base/02-target-device-source-top]]  
> 解锁：不依赖 FPGA 开发板验证功能

## 为什么是前置知识
功能错误应在低成本仿真阶段发现，而不是每次都重新综合、布局布线和下载。

## 最小理解
DUT（被测设计）是 led_blink；Testbench 是产生时钟、复位和自动检查预期结果的仿真环境。仿真关注时间轴（ns）、激励和波形；它无法证明物理布线满足时序，也无法替代板级 I/O 验证。
![[vault-notes/assets/05-behavioral-simulation/fig-01.png]]
## 在 Vivado 中动手
1. 确认 `tb_led_blink.v` 属于 Simulation Sources，`led_blink.v` 属于 Design Sources。  
2. Flow Navigator → Simulation → Run Simulation → Run Behavioral Simulation。  
3. 观察 clk、rst_n、led、cnt 的波形，使用 Zoom Fit，并检查仿真 Console 中是否有 `PASS`。  
4. 把 TB 中的检查条件改错一次，体会 `$fatal` 如何提前定位功能异常，然后恢复。

## 通过标准（不看教程独立完成）
能独立回答“为什么波形里看不到任何翻转”；能证实 LED 经 10 个时钟边沿翻转，再经过 10 个边沿翻回。

## 易错与定位
显示的波形时长太短、未选择仿真 Top、忘记添加观察信号、仿真参数与硬件参数混淆是常见问题。

## 官方来源
- [Simulation](https://docs.amd.com/r/en-US/ug892-vivado-design-flows-overview/Simulation-Flow-Overview)

## 学习复盘（自己填写）
- 我现在能用一句话解释它吗？
- 我操作的菜单路径：
- 本次实际错误、错误位置及修复：
- 与下一篇笔记的关系：
