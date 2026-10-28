---
title: "互功率谱密度"
tags:
- 随机信号处理
- 05-随机信号的频域分析
- 互功率谱
- 相干函数
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

# 互功率谱密度

> [!abstract] 这一节在讲什么
> 自谱只回答"一个信号自己的功率怎么分布"，互谱回答"两个信号在频率上有多相关、相差多少"。
> 本节定义互功率谱密度 $S_{XY}(\omega)$，给出共轭对称与互谱不等式，引入相干函数 $\gamma_{XY}^2(\omega)$，并说明它如何用于时延估计与 LTI 系统输入输出分析。
> 互谱是 [[vault-notes/random-signals/05-power-spectral-density]] 的二元推广，也是后面 [[vault-notes/random-signals/06-input-output-psd-relation]] 的准备。

## 一、定义与基本关系

> [!info] 定义 1 互功率谱密度
> 设 $X(t),Y(t)$ 联合宽平稳，互相关函数取 $R_{XY}(\tau)=E[X(t)Y^*(t+\tau)]$（$\tau$ 为 $Y$ 相对 $X$ 的滞后），则**互功率谱密度**定义为
> $$
> S_{XY}(\omega)=\int_{-\infty}^{\infty}R_{XY}(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau
> $$
> 反变换为
> $$
> R_{XY}(\tau)=\frac{1}{2\pi}\int_{-\infty}^{\infty}S_{XY}(\omega)e^{j\omega\tau}\,\mathrm{d}\omega
> $$

与自谱不同，$S_{XY}(\omega)$ 一般是**复函数**：模值表示两个频率分量的相关强度，辐角表示它们的平均相位差。交换次序有

$$
R_{YX}(\tau)=R_{XY}^*(-\tau),\qquad S_{YX}(\omega)=S_{XY}^*(\omega)
$$

> [!warning] 约定差异
> 有的书取 $R_{XY}(\tau)=E[X(t+\tau)Y^*(t)]$ 或 $E[X^*(t)Y(t+\tau)]$，此时 $S_{XY}$ 会取共轭或把 $\omega$ 换成 $-\omega$。本库统一用上面的"$Y$ 滞后"约定；比较不同教材时先对齐定义，再对公式。

离散形式为

$$
S_{XY}(e^{j\omega})=\sum_{m=-\infty}^{\infty}R_{XY}[m]e^{-j\omega m}
$$

## 二、性质与互谱不等式

> [!info] 定义 2 互谱的三条性质
> 对联合宽平稳的实过程 $X,Y$：
> 1. **共轭对称**：$S_{YX}(\omega)=S_{XY}^*(\omega)$；
> 2. **实部偶、虚部奇**：$S_{XY}(-\omega)=S_{XY}^*(\omega)$；
> 3. **互谱不等式**：$\lvert S_{XY}(\omega)\rvert^2\le S_X(\omega)S_Y(\omega)$。

第二条是实过程互相关为实函数的结果；对复过程，$S_{XY}(-\omega)$ 与 $S_{XY}(\omega)$ 没有这样简单的对称关系，必须回到定义。

互谱不等式可以看成频域版本的柯西-施瓦茨不等式。把三个量排成矩阵

$$
\mathbf{S}(\omega)=\begin{bmatrix}S_X(\omega) & S_{XY}(\omega)\\ S_{YX}(\omega) & S_Y(\omega)\end{bmatrix}
$$

它必须是半正定的，行列式非负就得到 $\lvert S_{XY}\rvert^2\le S_XS_Y$。

| 量 | 定义 | 是否非负 | 是否实 | 物理含义 |
| --- | --- | --- | --- | --- |
| $S_X(\omega)$ | $\mathcal{F}[R_X]$ | 是 | 是 | 自身功率分布 |
| $S_{XY}(\omega)$ | $\mathcal{F}[R_{XY}]$ | 否 | 一般否 | 两信号的频域相关与相位差 |
| $\lvert S_{XY}\rvert^2$ | 模平方 | 是 | 是 | 相关强度 |
| $\gamma_{XY}^2$ | 归一化模平方 | 是，且 $\le 1$ | 是 | 线性相关程度 |

> [!warning] 互谱不是"互功率密度"
> $S_{XY}(\omega)$ 的实部可以为负、整体可以是复数，不能像自谱那样逐点解释为"功率"。只有 $\lvert S_{XY}\rvert^2$ 和相干函数才是非负的相关性度量。

## 三、相干函数

> [!info] 定义 3 相干函数
> 定义**幅值平方相干函数**
> $$
> \gamma_{XY}^2(\omega)=\frac{\lvert S_{XY}(\omega)\rvert^2}{S_X(\omega)S_Y(\omega)},\qquad 0\le\gamma_{XY}^2(\omega)\le 1
> $$
> 它度量在频率 $\omega$ 上 $Y$ 中有多少功率可以由 $X$ 的**线性**成分解释。

几个典型值：$\gamma_{XY}^2=1$ 表示 $Y$ 是 $X$ 经过某个 LTI 系统的输出（无独立噪声）；$\gamma_{XY}^2=0$ 表示该频率上无线性相关；$0<\gamma^2<1$ 表示存在独立噪声、非线性或估计偏差。

> [!example] 例 1 输出加噪声
> 设实过程 $Y(t)=(X*h)(t)+N(t)$，$N$ 与 $X$ 独立，则 $S_{XY}=H S_X$，$S_Y=\lvert H\rvert^2S_X+S_N$，于是
> $$
> \gamma_{XY}^2(\omega)=\frac{\lvert H(\omega)\rvert^2S_X(\omega)}{\lvert H(\omega)\rvert^2S_X(\omega)+S_N(\omega)}
> $$
> 信噪比越低，相干函数越小；在 $H$ 很弱的频段，噪声会把相干函数压到接近零。

> [!warning] 相干函数不是"因果性"
> $\gamma^2$ 高只说明线性相关强，不说明 $X$ 导致 $Y$。两个信号同时受第三个源驱动，也会得到高相干。因果方向要靠实验设计或物理模型判断。

## 四、时延估计与 LTI 互谱

> [!example] 例 2 纯时延
> 设 $Y(t)=X(t-D)$，则 $R_{XY}(\tau)=R_X(\tau-D)$，取傅里叶变换得
> $$
> S_{XY}(\omega)=S_X(\omega)e^{-j\omega D}
> $$
> 互谱的相位是 $\angle S_{XY}(\omega)=-\omega D$（在 $S_X>0$ 的频段内），对 $\omega$ 求斜率就得到时延
> $$
> D=-\frac{\mathrm{d}\angle S_{XY}(\omega)}{\mathrm{d}\omega}
> $$

实际中 $S_X$ 的相位和噪声会污染估计，常用 **GCC-PHAT**：先做白化 $S_{XY}/\lvert S_{XY}\rvert$，再反变换找峰。这样只保留相位信息，对混响和有色噪声更稳健。

对 LTI 系统 $Y=X*h$（实过程、实系统），若 $X$ 与 $Y$ 联合宽平稳，则

$$
S_{XY}(\omega)=H(\omega)S_X(\omega),\qquad S_{YX}(\omega)=H^*(\omega)S_X(\omega)
$$

这是 [[vault-notes/random-signals/06-input-output-psd-relation]] 的互谱部分。它也解释了为什么"互谱除以自谱"可以估计频率响应：$\hat H(\omega)=S_{XY}(\omega)/S_X(\omega)$。

| 任务 | 用到的量 | 关键假设 |
| --- | --- | --- |
| 时延估计 | $\angle S_{XY}(\omega)$ 的斜率 | 纯时延、无多径 |
| 频响估计 | $S_{XY}/S_X$ | 输出无独立噪声 |
| 相关性筛查 | $\gamma_{XY}^2(\omega)$ | 联合宽平稳 |
| 方向判断 | $S_{XY}$ 与 $S_{YX}$ 的相位 | 需要额外因果假设 |

> [!tip] 工程顺序
> 先看相干函数判断"哪些频段可信"，再用可信频段的相位斜率或 $S_{XY}/S_X$ 做估计。相干函数很低的频段，估出来的时延和频响都不可靠。

## 关联

- 上一节：[[vault-notes/random-signals/05-wiener-khinchin]]
- 下一节：[[vault-notes/random-signals/05-white-colored-noise-spectra]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/communication/04-channel]]、[[vault-notes/communication/09-optimal-reception]]、[[vault-notes/fpga/ad9361/iq-signals]]
