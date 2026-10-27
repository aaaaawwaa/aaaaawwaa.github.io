---
title: "Synthesis-综合网表"
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

# 07 · Synthesis：逻辑综合与映射

> 前置：[[vault-notes/fpga/vivado/base/04-rtl-analysis-elaboration]]、[[vault-notes/fpga/vivado/base/06-xdc-pins-clocks]]；最好已完成 [[vault-notes/fpga/vivado/base/05-behavioral-simulation]]  
> 解锁：把 RTL 变成器件逻辑网表并检查资源

## 为什么是前置知识
综合后的模型才体现 FPGA 逻辑资源的大致使用方式；认识这一步才能解释 LUT、FF、BRAM、DSP 统计。

## 最小理解
Run Synthesis 对 RTL 优化，并为选定器件生成逻辑网表。常见资源：LUT（组合查找表）、FF（触发器）、BRAM（片上块 RAM）、DSP（硬件算术单元）。综合不等于完成引脚布线。
![[vault-notes/assets/07-synthesis-netlist/fig-01.png]]
## 在 Vivado 中动手
1. Flow Navigator → Synthesis → Run Synthesis。  
2. 成功后 Open Synthesized Design；打开 Utilization Report 看 LUT/FF 数量。  
3. 查看 Schematic，对照 RTL 里的计数器与触发器。  
4. 在 Messages 中找 Warning / Critical Warning，识别不影响功能的提示和需要修复的设计问题。

## 通过标准（不看教程独立完成）
能解释为何一段 `always` 可能对应多个 FF；能找到资源利用率及综合报告。

## 易错与定位
综合成功不保证功能正确，也不保证实现后的 setup/hold 时序全部满足。

## 官方来源
- [Synthesis](https://docs.amd.com/r/en-US/ug892-vivado-design-flows-overview/Synthesis)

## 学习复盘（自己填写）
- 我现在能用一句话解释它吗？
- 我操作的菜单路径：
- 本次实际错误、错误位置及修复：
- 与下一篇笔记的关系：
