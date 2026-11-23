---
title: "傅里叶变换的基本公式汇总(包括正反)"
---

## 1. 连续时间的傅里叶级数

设 $x(t)$ 周期为 $T$，基波角频率 $\omega_0 = \dfrac{2\pi}{T}$。

综合公式（由系数恢复信号）：

$$
x(t) = \sum_{k=-\infty}^{+\infty} a_k \, e^{jk\omega_0 t}
$$

分析公式（求级数系数）：

$$
a_k = \frac{1}{T} \int_{T} x(t) \, e^{-jk\omega_0 t} \, dt
$$

## 2. 连续时间的傅里叶变换

正变换：

$$
X(j\omega) = \int_{-\infty}^{+\infty} x(t) \, e^{-j\omega t} \, dt
$$

反变换：

$$
x(t) = \frac{1}{2\pi} \int_{-\infty}^{+\infty} X(j\omega) \, e^{j\omega t} \, d\omega
$$

## 3. 离散时间傅里叶变换

正变换：

$$
X(e^{j\omega}) = \sum_{n=-\infty}^{+\infty} x[n] \, e^{-j\omega n}
$$

反变换（在任一 $2\pi$ 区间上积分）：

$$
x[n] = \frac{1}{2\pi} \int_{2\pi} X(e^{j\omega}) \, e^{j\omega n} \, d\omega
$$

## 4. 离散时间傅里叶级数

设 $\tilde{x}[n]$ 周期为 $N$，记 $W_N = e^{-j\frac{2\pi}{N}}$。

分析公式（求级数系数）：

$$
\tilde{X}[k] = \sum_{n=0}^{N-1} \tilde{x}[n] \, e^{-j\frac{2\pi}{N}kn}
= \sum_{n=0}^{N-1} \tilde{x}[n] \, W_N^{kn}
$$

综合公式（由系数恢复信号）：

$$
\tilde{x}[n] = \frac{1}{N} \sum_{k=0}^{N-1} \tilde{X}[k] \, e^{j\frac{2\pi}{N}kn}
= \frac{1}{N} \sum_{k=0}^{N-1} \tilde{X}[k] \, W_N^{-kn}
$$

## 5. 离散傅里叶变换

正变换（$k = 0, 1, \dots, N-1$）：

$$
X[k] = \sum_{n=0}^{N-1} x[n] \, e^{-j\frac{2\pi}{N}kn}
$$

反变换（$n = 0, 1, \dots, N-1$）：

$$
x[n] = \frac{1}{N} \sum_{k=0}^{N-1} X[k] \, e^{j\frac{2\pi}{N}kn}
$$

## 6. 拉普拉斯变换

正变换（双边，$s = \sigma + j\omega$）：

$$
X(s) = \int_{-\infty}^{+\infty} x(t) \, e^{-st} \, dt
$$

反变换（沿收敛域内 $\mathrm{Re}\{s\} = \sigma$ 的直线积分）：

$$
x(t) = \frac{1}{2\pi j} \int_{\sigma - j\infty}^{\sigma + j\infty} X(s) \, e^{st} \, ds
$$

## 7. z变换

正变换（双边）：

$$
X(z) = \sum_{n=-\infty}^{+\infty} x[n] \, z^{-n}
$$

反变换（$C$ 为收敛域内逆时针环绕原点的闭合围线）：

$$
x[n] = \frac{1}{2\pi j} \oint_{C} X(z) \, z^{n-1} \, dz
$$