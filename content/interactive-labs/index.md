---
title: 交互实验
description: 可运行脚本与参数化实验，把傅里叶级数、频谱分析等抽象概念变成能直接观察的现象。
tags:
  - interactive-labs
  - index
---

## 学习范围

本分类是"动手验证"的场所。每个 Lab 提供一个可以直接复制运行的脚本（Python 为主），把课本上的公式变成可以调参的实验：改变截断项数、改变窗函数、改变采样率，观察结果如何变化。

学习理论时最容易产生的错觉是"公式看懂了就等于理解了"。实验的价值在于暴露那些被文字忽略的细节：吉布斯现象为什么消不掉、补零为什么不能提高分辨率、加窗为什么让谱峰变宽。先看见现象，再回头读公式，理解会牢固得多。

## 本分类文章

- [[Interactive-Labs/Fourier-Series-Lab|傅里叶级数实验]]：方波的部分和逼近、吉布斯过冲与三次谐波的影响。

## 跨学科关联

- [[Signal-Processing/DFT-and-FFT|DFT 与 FFT]]：实验中的级数截断，与 FFT 中的加窗截断是同一类问题。
- [[Mathematics/Linear-Algebra-Basics|线性代数基础]]：傅里叶级数的系数就是信号在一组正交基上的投影。
- [[Programming/Python-NumPy-DSP|Python NumPy 与 DSP]]：实验脚本使用的都是 NumPy 的向量化写法。

> [!tip] 做实验的方法
> 每次只改一个参数，先预测结果再运行。预测错误时最有价值——那正是理解有偏差的地方。

## 相关阅读

- [[Interactive-Labs/Fourier-Series-Lab|傅里叶级数实验]]
- [[Signal-Processing/Signals-and-Systems-Intro|信号与系统导论]]
- [[Maps/Learning-Path|推荐学习路径]]
