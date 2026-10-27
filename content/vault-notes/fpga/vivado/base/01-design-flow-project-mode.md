---
title: "设计主线与Project-Mode"
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

# 01 · 设计主线与 Project Mode

> 前置：无  
> 解锁：知道 Flow Navigator 全貌和各阶段输入输出

## 为什么是前置知识
先知道整条链路，才能定位按钮含义、知道应该在哪一个环节检查错误。

## 最小理解
Vivado 工程模式（Project Mode）负责管理源码、约束、仿真集及 synth_1/impl_1 运行。Flow Navigator 不是一个独立的综合算法；它是工程模式下启动不同设计任务的界面。典型流程：Project Manager → RTL Analysis / Simulation → Synthesis → Implementation → Generate Bitstream → Hardware Manager。**仿真可以多次执行，约束应在进入后续实现前核对。**

## 在 Vivado 中动手
1. 打开 Vivado，选择 Create Project → RTL Project。  
2. 在左侧找到 Project Manager、Simulation、RTL Analysis、Synthesis、Implementation、Program and Debug。  
3. 找到底部 Design Runs、Messages、Tcl Console、Reports 标签。  
4. 在纸上画出设计从 Verilog 到 `.bit` 的流程。

## 通过标准（不看教程独立完成）
能指出五个核心位置：Sources、Flow Navigator、Messages、Design Runs、Tcl Console；能说明“仿真成功不等于上板成功”。

## 易错与定位
不要把 Project Mode 与 Non-Project Tcl 流混在一起；首轮只学 Project Mode。不同器件、工程类型或版本菜单存在差别。

## 官方来源
- [Flow Navigator](https://docs.amd.com/r/en-US/ug892-vivado-design-flows-overview/Understanding-the-Flow-Navigator)

## 学习复盘（自己填写）
- 我现在能用一句话解释它吗？
- 我操作的菜单路径：
- 本次实际错误、错误位置及修复：
- 与下一篇笔记的关系：
