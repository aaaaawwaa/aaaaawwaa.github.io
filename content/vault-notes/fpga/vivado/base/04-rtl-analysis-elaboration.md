---
title: "RTL-Analysis-Elaboration"
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

# 04 · RTL Analysis / Elaboration

> 前置：[[vault-notes/fpga/vivado/base/03-rtl-hardware-thinking]]  
> 解锁：在综合前检查层级、模块关联和连线

## 为什么是前置知识
展开设计可以提前发现“模块没找到、Top 不对、端口不匹配”等结构问题。

## 最小理解
Elaboration 将 RTL 展开成设计层级和逻辑结构，帮助检查模块连接与基础问题；它**还没有**把逻辑映射成最终的 FPGA LUT/FF。可使用 Schematic 与 Hierarchy 查看模块关系。
![[vault-notes/assets/04-rtl-analysis-elaboration/fig-01.png]]
## 在 Vivado 中动手
1. 点击 Flow Navigator → RTL Analysis → Open Elaborated Design。  
2. 在 Schematic 找到计数器和 LED 对应逻辑/信号。  
3. 查看 Messages 中是否存在缺失模块、端口错误、锁存器相关警告。  
4. 试着修改一个顶层端口名，再对照 XDC 中的同名约束（不要在最终项目保留不匹配名称）。

## 通过标准（不看教程独立完成）
能解释 Elaborated Design 与 Synthesized Design 的区别；能定位 Sources、Hierarchy、Schematic。

## 易错与定位
展开成功不代表逻辑功能正确，不代表后端时序能达标。

## 官方来源
- [Elaboration](https://docs.amd.com/r/en-US/ug892-vivado-design-flows-overview/Opening-an-Elaborated-RTL-Design)

## 学习复盘（自己填写）
- 我现在能用一句话解释它吗？
- 我操作的菜单路径：
- 本次实际错误、错误位置及修复：
- 与下一篇笔记的关系：
