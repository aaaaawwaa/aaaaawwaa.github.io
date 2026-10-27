---
title: "各态历经性"
tags:
- 随机信号处理
- 03-随机过程基础
- 各态历经
- 时间平均
type: concept
subjects:
- 随机信号处理
- 随机过程
domains:
- 随机信号
- 统计信号处理
status: learning
aliases: []
prerequisites: []
related: []
---

# 各态历经性

> [!abstract] 这一节在讲什么
> 集合平均需要对无穷多条样本函数求平均，现实中往往只有一条有限长的观测记录。各态历经性回答：什么时候可以用这一条记录的时间平均代替集合平均？
> 本节给出均值各态历经与相关函数各态历经的定义、均方意义下的充分条件（$R_X(\tau)\to\lvert\mu_X\rvert^2$ 或 $\frac{1}{T}\int C_X\to0$）、反例与工程判据。核心结论是：各态历经是**逐统计量**成立的，且需要平稳性与足够长的观测。

## 一、两种平均

> [!info] 定义 1 时间平均
> 对一条样本函数 $x(t)$，定义
> $$\langle x(t)\rangle=\lim_{T\to\infty}\frac{1}{T}\int_{0}^{T}x(t)\,\mathrm{d}t$$
> $$\langle x(t+\tau)x^*(t)\rangle=\lim_{T\to\infty}\frac{1}{T}\int_{0}^{T}x(t+\tau)x^*(t)\,\mathrm{d}t$$
> 分别称为**时间均值**与**时间自相关**。离散序列把积分换成 $\frac{1}{N}\sum_{n=0}^{N-1}$。

| 平均方式 | 对谁平均 | 需要什么 | 典型代价 |
| --- | --- | --- | --- |
| 集合平均 | 同一时刻的所有样本 | 概率分布或大量独立实现 | 需要多次实验 |
| 时间平均 | 一条样本的所有时刻 | 平稳性加遍历性 | 需要长记录 |
| 样本平均 | 有限个采样点 | 采样独立同分布或弱相关 | 受样本量限制 |

> [!tip] 一句话理解
> 集合平均是“横向”跨样本求平均，时间平均是“纵向”沿一条样本求平均。各态历经性说的是：在长记录极限下，纵向平均等于横向平均。

## 二、均值各态历经

> [!info] 定义 2 均值各态历经
> 若平稳过程 $X(t)$ 满足
> $$\langle X(t)\rangle=\mu_X\quad\text{（均方意义或几乎必然）}$$
> 则称其**均值各态历经**，也称均值遍历。

有限时长估计量为 $\bar X_T=\frac{1}{T}\int_0^T X(t)\,\mathrm{d}t$。它显然是无偏的：$E[\bar X_T]=\mu_X$。关键在于方差：

$$\mathrm{Var}(\bar X_T)=\frac{1}{T^2}\int_0^T\int_0^T C_X(t_2-t_1)\,\mathrm{d}t_1\mathrm{d}t_2
=\frac{2}{T}\int_0^T\left(1-\frac{\tau}{T}\right)C_X(\tau)\,\mathrm{d}\tau$$

> [!info] 定义 3 均值遍历的充分条件
> 若 $C_X(\tau)=R_X(\tau)-\lvert\mu_X\rvert^2\to0$（$\tau\to\infty$），则 $\mathrm{Var}(\bar X_T)\to0$，从而 $\bar X_T\to\mu_X$（均方），过程均值各态历经。
> 更弱的条件是
> $$\frac{1}{T}\int_0^T C_X(\tau)\,\mathrm{d}\tau\longrightarrow0\quad(T\to\infty)$$

直观上，$C_X(\tau)\to0$ 表示相隔足够远的两段波形几乎不相关，长记录中的有效独立样本数随 $T$ 增长，平均的随机波动被抵消。

> [!warning] 充分条件不是必要条件
> 随机相位正弦的 $R_X(\tau)=\frac{A^2}{2}\cos\omega_0\tau$ 并不趋于 $0=\lvert\mu_X\rvert^2$，但它的时间平均仍为 $0$，是均值遍历的。原因是 $\cos$ 的积分在长区间上振荡抵消，而不是相关函数衰减。因此不能用“$R_X$ 不衰减”直接判定非遍历。

## 三、相关函数各态历经

> [!info] 定义 4 相关函数各态历经
> 若对每个 $\tau$，时间自相关满足
> $$\langle X(t+\tau)X^*(t)\rangle=R_X(\tau)$$
> 则称过程**相关函数各态历经**，也称相关遍历。

相关遍历需要四阶矩存在。对零均值实高斯过程，一个常用充分条件是

$$\int_{-\infty}^{\infty}\lvert R_X(u)\rvert^2\,\mathrm{d}u<\infty$$

它保证 $X(t+\tau)X(t)$ 的时间平均方差趋于零。

均值遍历只保证一阶统计可用一条记录估计；相关遍历才保证自相关、进而功率谱可用一条记录估计。工程上常说的“各态历经”通常指两者都成立。

## 四、反例与工程意义

> [!example] 反例 1 随机常数
> 设 $X(t)=A$，$A$ 是均值为 $m$、方差为 $\sigma_A^2$ 的随机变量。它严平稳且 WSS：$\mu_X=m$，$R_X(\tau)=E[A^2]$。但任一条样本的时间平均恒为 $A$，不等于 $m$，故**不是均值遍历**。每条样本“卡死”在一种状态，无法代表全体。

> [!example] 反例 2 随机幅度的正弦
> 设 $X(t)=A\cos(\omega_0t+\Theta)$，$A$ 与 $\Theta$ 独立，$A$ 非退化，$\Theta\sim U[0,2\pi)$。则 $\mu_X=0$，时间均值为 $0$，均值遍历成立；但时间自相关为 $\frac{A^2}{2}\cos\omega_0\tau$，而集合自相关为 $\frac{E[A^2]}{2}\cos\omega_0\tau$，两者一般不相等，故**相关函数不遍历**。

| 场景 | 能否用时间平均代替 | 原因 |
| --- | --- | --- |
| 白噪声功率测量 | 可以 | 相关时间极短，有效样本多 |
| 随机相位正弦的均值 | 可以 | 振荡积分抵消 |
| 随机常数或慢漂移 | 不可以 | 记录内只有一个“状态” |
| 随机幅度正弦的相关函数 | 不可以 | 幅度信息未在一条记录中遍历 |

工程判据：先确认记录内过程平稳；再估计相关时间 $\tau_c$；要求记录长度 $T\gg\tau_c$，使有效样本数 $N_{\mathrm{eff}}\approx T/(2\tau_c)$ 足够大；最后用分段估计检查结果是否随段变化。

> [!warning] 遍历性不能“整体继承”
> 一个过程可以均值遍历但相关函数不遍历，也可以某个统计量遍历而另一个不遍历。写结论时必须指明是“均值遍历”还是“相关遍历”，不能笼统说“该过程遍历”。

## 关联

- 上一节：[[vault-notes/random-signals/03-strict-vs-wide-sense-stationary]]
- 下一节：[[vault-notes/random-signals/03-gaussian-process-white-noise]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/math/probability/06-law-of-large-numbers-clt]]、[[vault-notes/matlab/matlab-notes]]
