---
title: "维纳辛钦定理"
tags:
- 随机信号处理
- 05-随机信号的频域分析
- 维纳辛钦
- 功率谱
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

# 维纳-辛钦定理

> [!abstract] 这一节在讲什么
> 功率谱密度可以从"截断傅里叶变换的平均功率"定义，也可以从自相关函数的傅里叶变换定义；这两种定义在宽平稳条件下等价，桥梁就是维纳-辛钦定理。
> 本节陈述定理、给出证明思路、说明绝对可积与广义函数两种收敛情形，并把它写成连续与离散两套形式。
> 它是时域相关分析与频域功率分析之间的通道，也是后面周期图估计的理论依据。

## 一、定理陈述

> [!info] 定义 1 维纳-辛钦定理（连续时间）
> 设 $X(t)$ 是宽平稳过程，自相关函数 $R_X(\tau)=E[X(t+\tau)X^*(t)]$。若 $R_X$ 绝对可积，即 $\int_{-\infty}^{\infty}\lvert R_X(\tau)\rvert\,\mathrm{d}\tau<\infty$，则
> $$
> S_X(\omega)=\int_{-\infty}^{\infty}R_X(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau
> $$
> 并且 $S_X(\omega)$ 就是 $X(t)$ 的功率谱密度；反变换为
> $$
> R_X(\tau)=\frac{1}{2\pi}\int_{-\infty}^{\infty}S_X(\omega)e^{j\omega\tau}\,\mathrm{d}\omega
> $$

定理的名字来自 Norbert Wiener 与 Aleksandr Khinchin。它说明 [[vault-notes/random-signals/05-power-spectral-density]] 的截断定义与相关函数定义等价：**自相关函数与功率谱密度是同一信息的两种排列**。

> [!tip] 一句话记忆
> 时域看"相隔 $\tau$ 的两点有多像"，频域看"功率落在哪些频率"；维纳-辛钦说这两件事互为傅里叶变换。

## 二、证明思路：截断、变换、取期望、取极限

证明不需要高深工具，四步即可。

1. **截断**：令 $X_T(t)=X(t)$（$\lvert t\rvert\le T$），其余为零，$X_T(\omega)=\int_{-T}^{T}X(t)e^{-j\omega t}\,\mathrm{d}t$。
2. **算模平方的期望**：

$$
E\left[\lvert X_T(\omega)\rvert^2\right]=\int_{-T}^{T}\int_{-T}^{T}R_X(t-s)e^{-j\omega(t-s)}\,\mathrm{d}t\,\mathrm{d}s
$$

3. **换元**：令 $\tau=t-s$，对固定 $\tau$，$t$ 的有效长度为 $2T-\lvert\tau\rvert$，于是

$$
E\left[\lvert X_T(\omega)\rvert^2\right]=\int_{-2T}^{2T}(2T-\lvert\tau\rvert)R_X(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau
$$

4. **归一化并取极限**：两边除以 $2T$，得

$$
\frac{1}{2T}E\left[\lvert X_T(\omega)\rvert^2\right]=\int_{-2T}^{2T}\left(1-\frac{\lvert\tau\rvert}{2T}\right)R_X(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau
$$

当 $T\to\infty$ 时，因子 $1-\lvert\tau\rvert/(2T)\to 1$。若 $R_X$ 绝对可积，由控制收敛定理，右边趋于 $\int R_X(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau$；左边正是截断定义，故两者相等。

> [!tip] 证明里藏着一个估计量
> 第 4 步的中间量 $\frac{1}{2T}\lvert X_T(\omega)\rvert^2$ 就是单次实现的"周期图"。定理同时告诉我们：周期图的期望是真实 PSD 被三角窗（Fejér 核）平滑后的结果。等价地，把 $R_X(\tau)$ 截断到 $\lvert\tau\rvert\le T$ 再变换，也会得到同样的平滑谱；这一线索在 [[vault-notes/random-signals/05-psd-numerical-estimation]] 中展开。

## 三、收敛条件与广义函数

> [!warning] 绝对可积不是永远成立
> 下面三类 $R_X(\tau)$ 都不绝对可积，但 PSD 仍然有意义，只是要按**广义函数**（允许 $\delta$）理解：
> - 含直流：$R_X(\tau)=\mu_X^2+C_X(\tau)$，其中 $C_X$ 绝对可积；
> - 含周期分量：如 $R_X(\tau)=\frac{A^2}{2}\cos\omega_0\tau$；
> - 含离散谱线的混合过程。

此时傅里叶变换要写成

$$
S_X(\omega)=2\pi\mu_X^2\delta(\omega)+S_C(\omega)
$$

以及

$$
\frac{A^2}{2}\cos\omega_0\tau\ \longleftrightarrow\ \frac{\pi A^2}{2}\big[\delta(\omega-\omega_0)+\delta(\omega+\omega_0)\big]
$$

| 情形 | 对 $R_X$ 的要求 | $S_X$ 的样子 | 例子 |
| --- | --- | --- | --- |
| 普通函数 | $\int\lvert R_X\rvert\,\mathrm{d}\tau<\infty$ | 连续、有界、$\to 0$ | RC 低通输出 |
| 含直流 | 常数项 + 可积部分 | $2\pi\mu_X^2\delta(\omega)$ + 连续谱 | 带直流偏置的噪声 |
| 含周期 | 周期项 + 可积部分 | 冲激谱线 | 随机相位正弦 |
| 非平稳 | 无单一 $R_X(\tau)$ | 无单一 PSD | 随机游走 |

绝对可积时还有两个推论：$\lvert S_X(\omega)\rvert\le\int\lvert R_X(\tau)\rvert\,\mathrm{d}\tau$，且 $S_X(\omega)\to 0$（$\lvert\omega\rvert\to\infty$）。所以"谱在高频不衰减到零"往往意味着 $R_X$ 含冲激或过程非平稳。

## 四、离散形式与用法

> [!info] 定义 2 离散时间维纳-辛钦定理
> 对宽平稳序列 $X[n]$，若 $\sum_{m=-\infty}^{\infty}\lvert R_X[m]\rvert<\infty$，则
> $$
> S_X(e^{j\omega})=\sum_{m=-\infty}^{\infty}R_X[m]e^{-j\omega m},\qquad R_X[m]=\frac{1}{2\pi}\int_{-\pi}^{\pi}S_X(e^{j\omega})e^{j\omega m}\,\mathrm{d}\omega
> $$
> $S_X(e^{j\omega})$ 以 $2\pi$ 为周期，平均功率为 $R_X[0]=\frac{1}{2\pi}\int_{-\pi}^{\pi}S_X(e^{j\omega})\,\mathrm{d}\omega$。

离散形式是 DFT/FFT 谱估计的出发点：把 $\omega$ 取在 $2\pi k/N$ 上，积分变成求和，就得到周期图的频域采样。

> [!example] 例 1 离散白噪声
> $R_X[m]=\sigma^2\delta[m]$，直接代入得 $S_X(e^{j\omega})=\sigma^2$，在 $[-\pi,\pi]$ 上平坦，功率为 $\sigma^2$。这与连续白噪声"密度有限、功率发散"不同：离散白噪声的带宽被限制在奈奎斯特区间，功率有限。

> [!example] 例 2 一阶自回归 AR(1)
> $X[n]=aX[n-1]+W[n]$，$\lvert a\rvert<1$，$W[n]$ 为方差 $\sigma_W^2$ 的白噪声，则
> $$
> R_X[m]=\frac{\sigma_W^2}{1-a^2}a^{\lvert m\rvert},\qquad S_X(e^{j\omega})=\frac{\sigma_W^2}{1-2a\cos\omega+a^2}
> $$
> $0<a<1$ 时能量集中在低频，$\lvert a\rvert\to 1$ 时谱峰变尖，相关时间变长。这正是"有色噪声"的最简模型，详见 [[vault-notes/random-signals/05-white-colored-noise-spectra]]。

| 用法 | 操作 | 注意 |
| --- | --- | --- |
| 由 $R_X$ 求 $S_X$ | 直接做傅里叶变换 | 先检查是否绝对可积 |
| 由 $S_X$ 求功率 | 积分或查 $R_X(0)$ | 分清单边/双边 |
| 识别周期性 | 看 $S_X$ 有无冲激 | 冲激权重是功率 |
| 识别记忆性 | 看 $S_X$ 是否平坦 | 平坦对应白噪声 |

> [!warning] 三个易错点
> - 反变换漏掉 $1/(2\pi)$，或把 $\omega$ 与 $f$ 的积分混用。
> - 对非平稳过程硬套定理：$R_X$ 依赖 $t$ 时没有单一 PSD，应先做短时/时频分析。
> - 把"$S_X$ 非负"当成"$S_X$ 一定是普通函数"：冲激谱同样非负，只是不是普通函数。

## 关联

- 上一节：[[vault-notes/random-signals/05-power-spectral-density]]
- 下一节：[[vault-notes/random-signals/05-cross-power-spectral-density]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/complex-analysis/07-fourier-transform]]、[[vault-notes/dsp/02-z-transform-and-dtft]]、[[vault-notes/communication/03-random-processes]]
