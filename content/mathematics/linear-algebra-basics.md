---
title: 线性代数基础
description: 从向量空间到特征分解，说明线性代数如何描述 DFT 的正交基、PCA 的方向与 MIMO 信道的分解。
tags:
  - mathematics
  - linear-algebra
  - matrices
---

## 向量与线性组合

一个 $n$ 维实向量可以理解为 $n$ 个数构成的有序组，也可以理解为空间中的一个点（或从原点出发的有向线段）。信号本身就是向量：一段长度为 $N$ 的离散信号 $x$ 就是一个 $\mathbb{R}^N$（或 $\mathbb{C}^N$）中的向量。

线性组合与张成空间（span）是后续所有结论的起点。若一组向量线性无关且能张成整个空间，它们就构成一组基。基的选择决定了坐标，但不改变向量本身——这正是傅里叶级数与 DFT 的几何含义。

## 矩阵：线性变换的表示

矩阵乘向量表示一个线性变换。把矩阵按列分块，乘法就是列的线性组合：

$$
\mathbf{y}=A\mathbf{x}=\sum_{k=1}^{n}x_k\,\mathbf{a}_k
$$

其中 $\mathbf{a}_k$ 是矩阵 $A$ 的第 $k$ 列。工程上常见的例子有：卷积矩阵、信道矩阵、旋转矩阵。矩阵乘法不可交换，这对应着变换的先后顺序不可调换。

## 特征值与特征向量

若存在非零向量 $\mathbf{v}$ 与标量 $\lambda$ 满足 $A\mathbf{v}=\lambda\mathbf{v}$，则 $\mathbf{v}$ 是特征向量，$\lambda$ 是特征值。它的物理含义是：在这个方向上，线性变换只做缩放，不改变方向。

- 实对称矩阵（或 Hermitian 矩阵）一定可以正交对角化，这是 PCA 与协方差分析的基础。
- 一般矩阵不保证有实特征值，工程上更常用奇异值分解 $H=U\Sigma V^{H}$ 代替。

## 正交基与傅里叶变换

DFT 矩阵的元素是 $(\mathbf{F})_{kn}=e^{-j2\pi kn/N}$，它的行向量彼此正交（内积为零），因此归一化后构成酉矩阵。正因如此，反变换只需取共轭转置。

> [!note] 为什么正交性重要
> 正交基意味着「能量守恒」（Parseval 定理）与「投影可分离」：一个信号在某个基上的系数不会因为改变其他基向量而改变。FFT 之所以能分解为蝶形运算，本质是这种正交结构带来的可分解性。

## 在工程中的三个落点

1. **PCA 降维**：以协方差矩阵的特征向量为主方向。
2. **MIMO 信道**：对信道矩阵做 SVD，得到并行的子信道，这正是空间复用的理论基础。
3. **DFT/FFT 与滤波器组**：用矩阵语言统一描述离散变换与多速率处理。

## 用 NumPy 验证

```python
import numpy as np

row0, row1 = (2.0, 1.0), (1.0, 3.0)
A = np.array([row0, row1])               # 实对称矩阵
vals, vecs = np.linalg.eigh(A)           # eigh 保证特征向量正交
print("特征值:", vals)
print("特征向量矩阵是否正交:", np.allclose(vecs.T @ vecs, np.eye(2)))

N = 8
n = np.arange(N)
F = np.exp(-2j * np.pi * np.outer(n, n) / N)   # DFT 矩阵
print("F^H F / N = I ?", np.allclose(F.conj().T @ F, N * np.eye(N)))

H = np.random.default_rng(0).standard_normal((4, 4))
U, S, Vh = np.linalg.svd(H)
print("奇异值:", np.round(S, 3))
```

## 常见误区

> [!warning] 注意适用条件
> 「特征值一定存在且为实数」「矩阵都可以对角化」都是错误的。只有实对称或 Hermitian 矩阵才保证正交对角化；对一般矩阵请使用 SVD。

## 相关阅读

- [[mathematics/probability-overview|概率论概览]]
- [[signal-processing/dft-and-fft|DFT 与 FFT]]
- [[communication/digital-modulation-qpsk|数字调制 QPSK]]
