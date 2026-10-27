---
title: "目标器件-Source-Top"
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

# 02 · 目标器件、Sources 与 Top

> 前置：[[vault-notes/fpga/vivado/base/01-design-flow-project-mode]]  
> 解锁：创建可综合的正确工程

## 为什么是前置知识
综合前必须确定设计所针对的 FPGA、哪些源文件组成硬件以及谁是顶层。

## 最小理解
三个文件集合：Design Sources（硬件 RTL）、Simulation Sources（Testbench）、Constraints（XDC）。Top Module 是工程综合的电路入口；Testbench Top 是仿真的入口，两者不是同一件事。选择 Board 和选择 Part 是两种器件配置方式；无 Board 文件时可以按芯片精确型号选择 Part。

## 在 Vivado 中动手
1. 新建 RTL Project，先确认开发板实际 FPGA 型号。  
2. Add Sources → Add or Create Design Sources，添加 `examples/rtl/led_blink.v`。  
3. 在 Sources 里右击 `led_blink` → Set as Top（如未自动设置）。  
4. Add Sources → Add or Create Simulation Sources，添加 `examples/sim/tb_led_blink.v`；在 Simulation Sources 检查仿真顶层。  
5. 检查 Project Summary 的 Target Part 与 Top Module。

## 通过标准（不看教程独立完成）
能区分 `.v`（RTL）、`tb_*.v`（仿真）、`.xdc`（约束）；能解释 Top 设置不对会造成什么后果。

## 易错与定位
不能随便选“同一系列”的 FPGA：封装、速度级别、引脚表必须匹配实际器件；不能把 TB 作为综合顶层。

## 官方来源
- [Sources](https://docs.amd.com/r/en-US/ug892-vivado-design-flows-overview/Managing-Source-Files-in-Project-Mode)

## 学习复盘（自己填写）
- 我现在能用一句话解释它吗？
- 我操作的菜单路径：
- 本次实际错误、错误位置及修复：
- 与下一篇笔记的关系：
