---
title: 概率论概览
description: 面向通信与信号处理的概率论速查：随机变量、期望方差、高斯噪声模型与误码率的概率来源。
tags:
  - mathematics
  - probability
  - random-process
---

## 随机变量与分布

随机变量把试验结果映射为实数或复数。工程中使用最多的是连续随机变量及其概率密度函数 $f_X(x)$，它满足 $f_X(x)\ge 0$ 且 $\int_{-\infty}^{\infty}f_X(x)\,dx=1$。

累积分布函数 $F_X(x)=P(X\le x)$ 在推导误码率时更直接：给定判决门限 $a$，错误概率就是一个积分。

## 期望、方差与矩

期望描述中心位置，方差描述离散程度：

$$ \mathrm{Var}[X]=E\left[(X-\mu)^2\right]=E\left[X^2\right]-\left(E[X]\right)^2 $$

方差公式的第二形式在实际计算中更常用。对独立随机变量，和的方差等于方差之和；这一条在分析噪声叠加时反复出现。

## 高斯分布

$$ f_X(x)=\frac{1}{\sqrt{2\pi}\,\sigma}\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right) $$

高斯分布之所以无处不在，主要有两个原因：中心极限定理说明大量独立小扰动之和趋于高斯分布；而高斯白噪声（AWGN）是通信中最常用的信道模型，它只由均值与方差两个参数决定，数学处理最方便。

对均值为零、方差为 $\sigma^2$ 的高斯变量，尾部概率用 Q 函数表示：

$$ Q(x)=\frac{1}{\sqrt{2\pi}}\int_x^{\infty}e^{-t^2/2}\,dt $$

## 从概率到误码率

以 BPSK 为例，AWGN 信道下接收信号为 $r=s+n$，$n\sim\mathcal{N}(0,\sigma^2)$，判决门限为 0。若 $E_b$ 为每比特能量、$N_0/2$ 为双边噪声功率谱密度，则误比特率为

$$ P_b=Q\left(\sqrt{\frac{2E_b}{N_0}}\right) $$

这个结果由「高斯尾部概率」直接给出，是后续学习 [[Communication/Digital-Modulation-QPSK|QPSK]] 与高阶调制的基础。

## 仿真验证

```python
import numpy as np

rng = np.random.default_rng(0)
N = 200_000
bits = rng.integers(0, 2, N)
tx = 1 - 2 * bits                      # 0 -> +1, 1 -> -1

for eb_n0_db in (0, 4, 8):
    sigma = np.sqrt(1 / (2 * 10 ** (eb_n0_db / 10)))   # 归一化到 Eb = 1
    rx = tx + sigma * rng.standard_normal(N)
    ber = np.mean((rx < 0).astype(int) != bits)
    print(f"Eb/N0 = {eb_n0_db:2d} dB -> 仿真 BER = {ber:.5f}")
```

> [!tip] 仿真的经验值
> 误码率 10⁻⁴ 量级至少需要 10⁶ 个比特才能在统计上稳定；想验证 10⁻⁵ 的曲线，通常要跑上千万比特或改用重要性采样。

> [!warning] 常见混淆
> 不要把「比特能量 $E_b$」与「符号能量 $E_s$」混用。QPSK 中 $E_s=2E_b$，套错公式会得到相差 3 dB 的错误结论。

## 相关阅读

- [[Mathematics/Linear-Algebra-Basics|线性代数基础]]
- [[Communication/Digital-Modulation-QPSK|数字调制 QPSK]]
- [[Signal-Processing/Signals-and-Systems-Intro|信号与系统导论]]
