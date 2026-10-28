---
title: 信号处理
description: 从线性时不变系统、卷积与采样定理出发，进入 DFT 与 FFT 的离散频谱分析世界。
tags:
  - signal-processing
  - index
---

## 学习范围

信号处理研究如何用数学工具描述、变换与分析随时间变化的物理量。本分类从连续与离散信号的基本概念出发，覆盖线性时不变（LTI）系统的冲激响应与卷积、傅里叶变换的频域视角、采样定理与混叠，最后进入离散傅里叶变换（DFT）与快速傅里叶变换（FFT）的实现。

学习顺序：先建立「时域卷积等价于频域相乘」的直觉，再理解采样率与带宽的约束，最后用代码观察频谱泄漏与频率分辨率。

> [!tip] 一句话抓住重点
> 频域分析的价值在于：很多在时域看起来复杂的运算（卷积、微分、滤波），在频域里只是加法与乘法。

## 数字信号处理的学习路径

数字信号处理以序列为对象：先理解信号如何采样、系统如何用卷积描述，再把问题搬到频域，最后设计实际滤波器。这条路径融合了 Obsidian 中的课程笔记和本站的专题讲解。

### 1. 离散时间与系统

序列用整数下标描述采样结果；线性时不变系统由单位冲激响应决定，输出通过卷积求得。采样连接连续时间与离散时间，但采样率不足会造成混叠。深入阅读：[[vault-notes/dsp/01-discrete-time-systems|离散时间信号与系统]]。

### 2. 从 Z 变换到 DFT 和 FFT

Z 变换用复平面描述离散系统；DTFT 描述连续频率上的响应；DFT 在有限个频率点上计算，而 FFT 是加速 DFT 的算法。本站 [[signal-processing/dft-and-fft|DFT 与 FFT 专题]]将两篇笔记的关键关系、圆周卷积和蝶形运算串在一起。详细推导：[[vault-notes/dsp/02-z-transform-and-dtft|Z 变换与 DTFT]]、[[vault-notes/dsp/03-discrete-fourier-transform|DFT]]、[[vault-notes/dsp/04-fast-fourier-transform|FFT]]。

### 3. 数字滤波器

滤波器用差分方程与结构图实现频率选择。IIR 借助反馈以较低阶数实现选择性，但需要检查稳定性；FIR 没有输出反馈，可以设计精确线性相位，通常需要较高阶数。深入阅读：[[vault-notes/dsp/05-filter-structures|基本结构]]、[[vault-notes/dsp/06-iir-filter-design|IIR 设计]]、[[vault-notes/dsp/07-fir-filter-design|FIR 设计]]。

### 4. 多抽样率

抽取降低采样率之前要考虑抗混叠滤波；插值提高采样率后要抑制成像频谱。深入阅读：[[vault-notes/dsp/08-multirate-sampling|序列的抽取和插值]]。
## 本分类文章

- [[signal-processing/signals-and-systems-intro|信号与系统导论]]：LTI 系统、卷积、采样定理与混叠。
- [[signal-processing/dft-and-fft|DFT 与 FFT]]：离散频谱的定义、频率分辨率与 FFT 实现。

## 跨学科关联

- [[mathematics/linear-algebra-basics|线性代数基础]]：DFT 是一组正交基上的投影，用酉矩阵语言描述最清晰。
- [[communication/analog-modulation-am|模拟调制 AM]]：调制本质上是频谱搬移，理解频谱才能理解 AM 与频分复用。
- [[interactive-labs/fourier-series-lab|傅里叶级数实验]]：用可运行的脚本观察方波的部分和逼近。

## 软硬件结合

信号处理算法的落地方式有两种：在 CPU/GPU 上用 [[programming/python-numpy-dsp|Python NumPy]] 验证，或在 FPGA 上用 [[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]] 实现实时流水线。前者关注数值与精度，后者关注时钟、面积与吞吐率。

## 相关阅读

- [[signal-processing/signals-and-systems-intro|信号与系统导论]]
- [[signal-processing/dft-and-fft|DFT 与 FFT]]
- [[maps/knowledge-network|跨学科知识网络]]

<!-- topic-index:start -->
## 数字信号处理知识点索引

### 数字信号处理

- [[vault-notes/dsp/01-discrete-time-systems|离散时间信号与系统]]
- [[vault-notes/dsp/02-z-transform-and-dtft|Z变换与离散时间傅里叶变换(DTFT)]]
- [[vault-notes/dsp/03-discrete-fourier-transform|离散傅里叶变换(DFT)]]
- [[vault-notes/dsp/04-fast-fourier-transform|快速傅里叶变换(FFT)]]
- [[vault-notes/dsp/05-filter-structures|数字滤波器的基本结构]]
- [[vault-notes/dsp/06-iir-filter-design|无限长单位冲激响应数字滤波器(IIR)设计方法]]
- [[vault-notes/dsp/07-fir-filter-design|有限长单位冲激响应数字滤波器(FIR)设计方法]]
- [[vault-notes/dsp/08-multirate-sampling|序列的抽取和插值--多抽样率数字信号处理基础]]

<!-- topic-index:end -->
