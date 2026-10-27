---
title: "FPGA&CPLD元件概述"
created: '2026-08-14'
tags:
- FPGA
- 基础概念
type: concept
subjects:
- FPGA
domains:
- 硬件实现
- 数字系统
status: learning
aliases: []
prerequisites: []
related: []
---

# 🧱 FPGA 与 CPLD 元件概述

> [!abstract] 本页在讲什么
> 从 PLD 的分类出发，解释「基于乘积项」的 CPLD 与「基于查找表」的 FPGA 在结构和选型上的差别。

### PLD器件概述

**定义**：PLD（Programmable Logic Device，可编程逻辑器件），是指一种**在制造完成后，用户仍可通过编程来改变其内部电路逻辑功能**的芯片

**PLD器件分类**

|类别|全称|集成度（逻辑门数）|典型结构|
|---|---|---|---|
|**SPLD**|简单可编程逻辑器件|**< 1000门**（约几百门）|与-或阵列（乘积项结构）|
|**CPLD**|复杂可编程逻辑器件|**数千 ~ 数万门**|多个SPLD模块 + 全局互连|
|**FPGA**|现场可编程门阵列|**数十万 ~ 数十亿门**|查找表（LUT）+ 触发器 + 分布式布线|

**不同SPLD之间的分类**

|类型|全称|与阵列|或阵列|输出结构|编程工艺|关键特点|
|---|---|---|---|---|---|---|
|**PROM**|可编程只读存储器|**固定**|**可编程**|固定|熔丝/反熔丝|最早出现，结构简单，适合做查找表[](https://baike.baidu.com/item/SPLD?func=retitle#1)|
|**PLA**|可编程逻辑阵列|**可编程**|**可编程**|固定|熔丝/反熔丝|最灵活，但工艺复杂、速度慢、价格高|
|**PAL**|可编程阵列逻辑|**可编程**|**固定**|**多种固定类型**|双极型熔丝|性能和灵活性的折中，奠定了PLD发展基础[](https://www.eepw.com.cn/zhuanlan/201204/91445.html)|
|**GAL**|通用阵列逻辑|**可编程**|**固定**|**可编程 (OLMC)**|**EEPROM**|PAL的改进版，可擦写，输出极灵活，可替代大部分PAL|
按照结构特点来分类，可以分为**基于乘积项**和**基于查找表**的器件，这两者的代表分别是CPLD和FPGA

---

**关联**：[[vault-notes/fpga/00-guide]]｜[[vault-notes/fpga/basics/01-eda-technology-overview]]｜向量

