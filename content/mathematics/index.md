---
title: 数学基础
description: 电子信息工程的数学工具箱，覆盖线性代数、矩阵变换、概率论与随机信号分析的基本概念。
tags:
  - mathematics
  - index
---

## 学习范围

本分类覆盖电子信息工程中最常用的数学工具，分三条主线。第一条是线性代数：向量空间、矩阵运算、特征值与奇异值分解，它解释了 DFT 的正交基结构，也是 MIMO 信道分析的语言。第二条是概率论与随机过程：随机变量、常见分布、期望方差、高斯噪声与相关函数，它们是误码率推导和噪声分析的起点。第三条是与变换相关的复变基础，为后续学习傅里叶变换与 Z 变换做准备。

学习目标是「读懂公式、用对条件、能写成代码」：先掌握矩阵乘法与特征值，再进入概率论，最后回到具体问题中检验。

## 本分类文章

- [[Mathematics/Linear-Algebra-Basics|线性代数基础]]：向量、矩阵、特征分解，以及 DFT 矩阵与信道的 SVD 分解。
- [[Mathematics/Probability-Overview|概率论概览]]：随机变量、期望方差、高斯分布与 AWGN 信道模型。

## 跨学科关联

- [[Signal-Processing/DFT-and-FFT|DFT 与 FFT]]：DFT 本质上是取一组正交基上的投影，核函数 $e^{-j2\pi kn/N}$ 构成酉矩阵。
- [[Communication/Digital-Modulation-QPSK|数字调制 QPSK]]：星座图是二维实向量空间中的点，误码率由高斯分布与 Q 函数给出。
- [[Signal-Processing/Signals-and-Systems-Intro|信号与系统导论]]：卷积与频域分析的每一步都依赖线性代数与复数的运算规则。

> [!note] 学数学的优先级
> 对电子信息工程而言，**会用**比**会证**更重要。公式的适用条件（连续还是离散、实信号还是复信号、是否满足绝对可和）必须记清楚，因为条件不满足时结论会失效。

## 相关阅读

- [[Mathematics/Linear-Algebra-Basics|线性代数基础]]
- [[Mathematics/Probability-Overview|概率论概览]]
- [[Maps/Learning-Path|推荐学习路径]]
