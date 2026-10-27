---
title: "Implementation-布局布线"
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

# 08 · Implementation：布局和布线

> 前置：[[vault-notes/fpga/vivado/base/07-synthesis-netlist]]、[[vault-notes/fpga/vivado/base/06-xdc-pins-clocks]]  
> 解锁：获得物理布局、连线延迟以及可生成配置文件的实现结果

## 为什么是前置知识
逻辑网表只确定“连接关系”，实现过程才确定逻辑放在哪、走哪条线，延迟因此变成可评估的实际对象。

## 最小理解
Implementation 通常包含设计优化、Placement（布局）和 Routing（布线）；也可有可选物理优化。工具根据器件结构和 XDC 目标放置/连接逻辑。Open Implemented Design 后可以观察 Device 视图和时序结果。
![[vault-notes/assets/08-implementation-place-route/fig-01.png]]
## 在 Vivado 中动手
1. Flow Navigator → Implementation → Run Implementation。  
2. 成功后 Open Implemented Design，进入 Device 视图。  
3. 在 Design Runs 检查 impl_1 的完成状态。  
4. 对比综合前后信息：资源与时序报告关注点有什么不同？

## 通过标准（不看教程独立完成）
能用自己的话区分 Synthesis 与 Implementation；能说出“为什么实现比综合耗时更久”。

## 易错与定位
实现成功不等于满足所有时序要求；仍需查看 timing summary、unconstrained paths 和关键 DRC。

## 官方来源
- [Implementation](https://docs.amd.com/r/en-US/ug904-vivado-implementation/Running-Implementation-in-Steps)

## 学习复盘（自己填写）
- 我现在能用一句话解释它吗？
- 我操作的菜单路径：
- 本次实际错误、错误位置及修复：
- 与下一篇笔记的关系：
