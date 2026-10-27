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
