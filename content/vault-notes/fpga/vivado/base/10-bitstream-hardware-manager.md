---
title: "Bitstream-Hardware-Manager"
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

# 10 · Bitstream 与 Hardware Manager

> 前置：[[vault-notes/fpga/vivado/base/08-implementation-place-route]]、[[vault-notes/fpga/vivado/base/09-reports-timing-verdict]]  
> 解锁：把设计下载到真实 FPGA

## 为什么是前置知识
能生成 bitstream 是软件设计流程的最后阶段，而通过真实 FPGA 引脚和板上时钟验证才构成完整闭环。

## 最小理解
Generate Bitstream 生成用于设备配置的数据文件；常见传统 FPGA 使用 `.bit`。通过 Hardware Manager 连接硬件目标，选中 FPGA 后进行 Program Device。不同器件/流程可能使用 device image 而不是 `.bit`。需要实际开发板、供电、USB/JTAG 连接和正确驱动。
![[vault-notes/assets/10-bitstream-hardware-manager/fig-01.png]]
## 在 Vivado 中动手
1. Flow Navigator → Program and Debug → Generate Bitstream。  
2. 检查是否完成、无关键 DRC/时序问题；如有问题先返回修复。  
3. 有开发板时：Open Hardware Manager → Open Target（如 Auto Connect）→ 选择器件 → Program Device → 选择正确配置文件。  
4. 确认 LED 周期行为符合预期，并验证复位按键极性。  
5. 无开发板时：记录为“生成文件通过，硬件验证未完成”，而不是“上板成功”。

## 通过标准（不看教程独立完成）
能区分 `.v`、`.xdc`、`.bit`；能解释无法发现硬件、配置失败与“逻辑行为错误”属于不同层次。

## 易错与定位
设备型号错误、USB/JTAG 驱动、复位极性、板载时钟频率或 I/O 分配都会影响结果；不要盲目重复烧录。

## 官方来源
- [Programming](https://docs.amd.com/r/en-US/ug947-vivado-partial-reconfiguration-tutorial/Configuring-the-Device-with-a-Full-Image)

## 学习复盘（自己填写）
- 我现在能用一句话解释它吗？
- 我操作的菜单路径：
- 本次实际错误、错误位置及修复：
- 与下一篇笔记的关系：
