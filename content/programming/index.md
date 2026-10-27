---
title: 编程实践
description: 把数学与算法变成可运行代码：C 语言指针与内存布局，以及 Python NumPy/SciPy 的向量化信号处理。
tags:
  - programming
  - index
---

## 学习范围

本分类是"把理论和算法变成能跑的程序"的地方，分两大部分。

C 语言部分关注指针、数组退化、栈与堆、结构体内存布局，以及嵌入式开发中最常见的场景：用指针读写内存映射寄存器、用 `volatile` 处理中断共享变量。这部分决定了你能否看懂 MCU 的启动代码与外设库。

Python 部分关注 NumPy 的数组模型与向量化写法，以及 SciPy 的滤波器设计函数，用来快速验证频谱、滤波与调制解调的算法。验证通过后再考虑定点化与硬件实现。

## 本分类文章

- [[Programming/C-Pointer-and-Memory|C 指针与内存]]：指针算术、数组与指针的关系、栈堆区别、寄存器映射。
- [[Programming/Python-NumPy-DSP|Python NumPy 与 DSP]]：向量化、FFT 频谱分析、FIR 滤波器设计与定点化。

## 跨学科关联

- [[Signal-Processing/DFT-and-FFT|DFT 与 FFT]]：Python 脚本是验证频谱分析结论最快的工具。
- [[Digital-Systems/Verilog-Sequential-Logic|Verilog 时序逻辑]]：C 语言描述行为，RTL 描述时序；两者的思维方式需要来回切换。
- [[Projects/UART-Loopback-Project|UART 回环项目]]：PC 侧用 Python 收发串口数据，是调试硬件接口的第一步。

> [!note] 代码组织建议
> 仿真脚本按"生成信号 → 处理 → 画图/打印指标"三段式组织，每段独立可替换。这样换一个滤波器或调制方式时不必重写整个脚本。

## 相关阅读

- [[Programming/C-Pointer-and-Memory|C 指针与内存]]
- [[Programming/Python-NumPy-DSP|Python NumPy 与 DSP]]
- [[AI-Agents/AI-Tools-Overview|AI 工具概览]]
