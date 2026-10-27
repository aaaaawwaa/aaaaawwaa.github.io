---
title: "README"
type: map
status: learning
subjects:
- FPGA
domains:
- 工具与仿真
- 硬件实现
tags:
- FPGA
- Vivado
- BASE
- MOC
aliases: []
prerequisites: []
related: []
---

# Vivado Flow Navigator · 20 小时 BASE 库

> **适用对象**：希望使用 Vivado Project Mode，快速掌握从 RTL 到 FPGA 配置流程的初学者。  
> **目标**：20 小时完成最小闭环，不追求全功能覆盖。  
> **笔记格式**：Markdown + Obsidian 双链（解压整个目录后，用 Obsidian 打开该文件夹作为库）。

## 入口
按下列顺序学习；每一篇都包含“前置 → 解锁 → 最小理解 → 动手 → 通过标准 → 易错”。

1. [[vault-notes/fpga/vivado/base/01-design-flow-project-mode]]（1.5h）
2. [[vault-notes/fpga/vivado/base/02-target-device-source-top]]（2h）
3. [[vault-notes/fpga/vivado/base/03-rtl-hardware-thinking]]（1.5h）
4. [[vault-notes/fpga/vivado/base/04-rtl-analysis-elaboration]]（1h）
5. [[vault-notes/fpga/vivado/base/05-behavioral-simulation]]（3h）
6. [[vault-notes/fpga/vivado/base/06-xdc-pins-clocks]]（2.5h）
7. [[vault-notes/fpga/vivado/base/07-synthesis-netlist]]（2h）
8. [[vault-notes/fpga/vivado/base/08-implementation-place-route]]（2h）
9. [[vault-notes/fpga/vivado/base/09-reports-timing-verdict]]（2h）
10. [[vault-notes/fpga/vivado/base/10-bitstream-hardware-manager]]（1.5h）
11. 复盘与验收（1h）

总计 **20h**。08/09/10 之间的实际操作可能反复往返；学习顺序不等于菜单的强制执行顺序。

## 最小实验项目
- `examples/rtl/led_blink.v`：带低有效复位的 LED 计数翻转设计（默认 100 MHz）。
- `examples/sim/tb_led_blink.v`：加速参数与自检 Testbench，模拟 20 个时钟检查两个翻转。
- `examples/constraints/board_template.xdc`：时钟约束示例；引脚、电压 **必须** 根据实际开发板修改。

在仿真中使用 `CLK_HZ=20` 只为缩短仿真时间；真正部署到 FPGA 时应使用板上时钟实际频率设置 `CLK_HZ`、`create_clock`。

## 主要官方资料（AMD，2026.1）
- UG892 — [Design Flows Overview](https://docs.amd.com/r/en-US/ug892-vivado-design-flows-overview)
- UG903 — [Using Constraints](https://docs.amd.com/r/en-US/ug903-vivado-using-constraints)
- UG904 — [Implementation](https://docs.amd.com/r/en-US/ug904-vivado-implementation)
- UG906 — [Design Analysis and Closure](https://docs.amd.com/r/en-US/ug906-vivado-design-analysis)
- UG908 — [Programming and Debugging](https://docs.amd.com/r/en-US/ug908-vivado-programming-debugging)

## 不列入首轮的内容
IP Integrator / Block Design、Zynq PS/Linux、Vitis、Tcl 全自动化、多时钟 CDC、复杂 Timing Exceptions、ILA/Debug Hub 深入使用、PR/DFX。需要时再延伸。
