---
title: "相关函数的性质"
tags:
- 随机信号处理
- 04-随机信号的时域分析
- 相关函数
- 正定性
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

# 相关函数的性质

> [!abstract] 这一节在讲什么
> 相关函数不是任意一条曲线：它必须满足共轭对称、原点最大、非负定，并与一个非负的功率谱互为傅里叶变换。本节把这些性质串成一条逻辑链，并说明周期分量、连续性与物理可实现性各对应什么条件。
> 核心结论是：**非负定是相关函数的本质约束**，它等价于功率谱非负；只检查“偶函数 + 原点最大”不足以判断一条曲线能否成为自相关函数。

## 一、对称性与共轭

> [!info] 定义 1 共轭对称
> 对 WSS 过程，
> $$
> R_X(-\tau)=R_X^*(\tau),\qquad C_X(-\tau)=C_X^*(\tau)
> $$
> 实过程的相关函数为偶函数：$R_X(-\tau)=R_X(\tau)$。

对称性来自平稳性：把两个时刻同时平移后，相关值不变，于是 $R_X(-\tau)=E[X(t-\tau)X^*(t)]=E[X(t)X^*(t+\tau)]=R_X^*(\tau)$。最后一步用了共轭。对互相关，对称性变成 $R_{XY}(-\tau)=R_{YX}(\tau)$，不再有偶对称。

> [!warning] 复过程不能省略共轭
> 若把定义写成 $E[X(t)X(t+\tau)]$ 而不取共轭，$R(0)$ 可能不是实数，甚至为负，后面“原点最大”“功率非负”全部失效。复信号分析中始终按 $X(t+\tau)X^*(t)$ 书写。

## 二、峰值、正定性与谱

> [!info] 定义 2 非负定
> 若对任意 $n$、任意实数 $\tau_1,\dots,\tau_n$ 与任意复数 $a_1,\dots,a_n$，都有
> $$
> \sum_{i=1}^{n}\sum_{j=1}^{n}a_ia_j^*R_X(\tau_i-\tau_j)\ge0
> $$
> 则称 $R_X(\tau)$ 为**非负定函数**。

非负定直接来自

$$
\sum_i\sum_j a_ia_j^*R_X(\tau_i-\tau_j)=E\left[\left\lvert\sum_i a_iX(t+\tau_i)\right\rvert^2\right]\ge0
$$

取 $n=2$、$a_1=a_2=1$ 与 $a_1=1,a_2=-1$，分别得到 $\mathrm{Re}\,R_X(\tau)\ge-R_X(0)$ 与 $\mathrm{Re}\,R_X(\tau)\le R_X(0)$，合并得 $\lvert\mathrm{Re}\,R_X(\tau)\rvert\le R_X(0)$；对复过程再乘相位因子，即得 $\lvert R_X(\tau)\rvert\le R_X(0)$。所以“原点最大”只是非负定的一个推论。

> [!info] 定义 3 Bochner 定理
> 连续函数 $R(\tau)$ 是非负定的，当且仅当它的傅里叶变换 $S(\omega)$ 存在且处处非负：
> $$
> S(\omega)=\int_{-\infty}^{\infty}R(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau\ge0
> $$

| 等价说法 | 时域表述 | 频域表述 |
| --- | --- | --- |
| 相关函数合法 | $R(\tau)$ 非负定 | $S(\omega)\ge0$ |
| 任意采样协方差矩阵 | $\mathbf{R}_{ij}=R(\tau_i-\tau_j)$ 半正定 | 对任意频率非负 |
| 原点最大 | $\lvert R(\tau)\rvert\le R(0)$ | 由非负谱积分得到 |

## 三、连续性与傅里叶对

> [!info] 定义 4 均方连续
> 若 $\lim_{h\to0}E\big[\lvert X(t+h)-X(t)\rvert^2\big]=0$，则称过程在 $t$ 处**均方连续**。对 WSS 过程，
> $$
> E\big[\lvert X(t+h)-X(t)\rvert^2\big]=2\big[R_X(0)-\mathrm{Re}\,R_X(h)\big]
> $$
> 因此均方连续 $\Longleftrightarrow$ $R_X$ 在 $0$ 处连续。

若 $R_X$ 在 $0$ 处连续，则它在任意 $\tau$ 处连续，且连续是均匀的。由柯西–施瓦茨有 $\lvert R_X(\tau+h)-R_X(\tau)\rvert^2\le2R_X(0)[R_X(0)-\mathrm{Re}\,R_X(h)]$，右端只与 $h$ 有关，与 $\tau$ 无关，故均匀连续。

> [!info] 定义 5 维纳–辛钦定理
> 若 $R_X$ 绝对可积，则
> $$
> S_X(\omega)=\int_{-\infty}^{\infty}R_X(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau,\qquad
> R_X(\tau)=\frac{1}{2\pi}\int_{-\infty}^{\infty}S_X(\omega)e^{j\omega\tau}\,\mathrm{d}\omega
> $$
> $S_X(\omega)$ 为实、非负；实过程还满足 $S_X(-\omega)=S_X(\omega)$。

对可微过程，相关函数与导数过程满足 $R_{X'}(\tau)=-R_X''(\tau)$ 且 $R_X''(0)=-E[\lvert X'(t)\rvert^2]\le0$。因此 $R_X$ 在原点附近必须是向下凹的；若某候选函数在 $0$ 处向上凹，它不可能来自均方可微过程。

## 四、周期分量与物理可实现性

> [!info] 定义 6 周期分量
> 若相关函数含周期项
> $$
> R_X(\tau)=\sum_k P_k e^{j\omega_k\tau}+R_c(\tau),\qquad P_k\ge0
> $$
> 则功率谱含冲激：
> $$
> S_X(\omega)=2\pi\sum_k P_k\delta(\omega-\omega_k)+S_c(\omega)
> $$

随机相位正弦是典型例子：$R_X(\tau)=\frac{A^2}{2}\cos\omega_0\tau$，对应

$$
S_X(\omega)=\frac{\pi A^2}{2}\big[\delta(\omega-\omega_0)+\delta(\omega+\omega_0)\big]
$$

平均功率 $R_X(0)=A^2/2$ 全部集中在两根谱线上。相关函数中的周期项越强，谱线越突出；反之，相关函数衰减越快，谱越宽。

> [!warning] 不是所有“好看”的函数都能当自相关
> 取 $R(\tau)=1$（$\lvert\tau\rvert\le1$）、其余为零。它偶对称、$R(0)=1$ 最大，但傅里叶变换 $2\sin\omega/\omega$ 在 $\omega>\pi$ 时取负值，不满足非负定，因此**不是**合法的自相关函数。矩形相关函数对应的是不可实现的负谱。

“物理可实现性”还有另一层含义：给定功率谱 $S(\omega)$，是否存在因果、稳定的白化滤波器 $H(\omega)=1/\sqrt{S(\omega)}$。这要求 Paley–Wiener 条件

$$
\int_{-\infty}^{\infty}\frac{\lvert\ln S(\omega)\rvert}{1+\omega^2}\,\mathrm{d}\omega<\infty
$$

它限制谱零点不能“太深、太宽”。这与“$R$ 是否是合法自相关”是两个不同层次的问题，考试与工程中要分开回答。

## 五、证明思路清单

| 结论 | 证明工具 | 关键一步 |
| --- | --- | --- |
| 共轭对称 | 平稳性 + 共轭 | 同时平移 $\tau$，交换共轭 |
| $\lvert R(\tau)\rvert\le R(0)$ | 柯西–施瓦茨 | 对 $X(t+\tau)$ 与 $X(t)$ 用不等式 |
| 非负定 | 二次型期望 | $E[\lvert\sum a_iX(t+\tau_i)\rvert^2]\ge0$ |
| 原点最大 | 非负定的二阶特例 | 取 $a_1=1,a_2=\pm1$ |
| 连续性 | 均方连续 | $E\lvert X(t+h)-X(t)\rvert^2=2[R(0)-\mathrm{Re}R(h)]$ |
| 维纳–辛钦 | 截断信号 + 期望 | 截断自相关的傅里叶变换取极限 |
| 周期项对应谱线 | 傅里叶级数 + 冲激变换 | $e^{j\omega_k\tau}\leftrightarrow2\pi\delta(\omega-\omega_k)$ |

> [!tip] 判断顺序
> 先看是否偶（或共轭对称）与 $R(0)\ge0$，再算傅里叶变换看是否处处非负；若谱有负值，立即判定不合法。只有谱非负之后，才继续讨论相关时间、谱宽等工程指标。

## 关联

- 上一节：[[vault-notes/random-signals/04-cross-correlation-covariance]]
- 下一节：[[vault-notes/random-signals/04-sample-correlation-estimation]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/math/complex-analysis/07-fourier-transform]]、[[vault-notes/dsp/02-z-transform-and-dtft]]
