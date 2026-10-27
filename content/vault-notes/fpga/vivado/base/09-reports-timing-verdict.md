---
title: "Reports-与时序判定"
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

# 09 · Reports：Warnings、DRC 与时序判定

> 前置：[[vault-notes/fpga/vivado/base/07-synthesis-netlist]]、[[vault-notes/fpga/vivado/base/08-implementation-place-route]]  
> 解锁：知道“完成”“正确”“性能满足要求”是三种不同判断

## 为什么是前置知识
不会读报告，就只能机械点击 Next，不知道设计失败究竟属于语法、资源、I/O 还是时序。

## 最小理解
重点看 Design Runs、Messages、Timing Summary、Utilization、DRC。WNS（Worst Negative Slack）表示最差 setup 时序裕量，负值通常意味着 setup 违例；TNS 是负裕量累计。WHS/THS 对应 hold 检查。WNS ≥ 0、TNS = 0 只是 setup 方向的基础判据，必须同时核查 hold、时钟定义与未约束路径。
![[vault-notes/assets/09-reports-timing-verdict/fig-01.png]]
## 在 Vivado 中动手
1. 在 Design Runs 检查 synth_1 / impl_1 Status。  
2. 查看 Timing Summary 的 WNS/TNS、WHS/THS，并注意 Unconstrained Paths。  
3. 查看 Report Utilization、Report DRC。  
4. 人为将时钟周期改得更紧（例如从 10ns 改成 1ns，仅用于练习），重新实现并观察结果；随后恢复真实时钟周期。

## 通过标准（不看教程独立完成）
能准确回答：“实施完成而 WNS<0，是否能宣布设计达标？”（不能）。能指出一条故意修改的约束对报告产生了什么影响。

## 易错与定位
不要因为 WNS 非负就断言“100% 时序正确”：漏约束、假路径误配、hold 违例等仍可能存在。

## 官方来源
- [Reports](https://docs.amd.com/r/en-US/ug906-vivado-design-analysis/Using-the-Design-Runs-Window)

## 学习复盘（自己填写）
- 我现在能用一句话解释它吗？
- 我操作的菜单路径：
- 本次实际错误、错误位置及修复：
- 与下一篇笔记的关系：
