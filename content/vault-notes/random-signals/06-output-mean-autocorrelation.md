---
title: "输出均值与自相关"
tags:
- 随机信号处理
- 06-随机信号通过系统
- 输出自相关
- 互相关
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

# 输出均值与自相关

> [!abstract] 这一节在讲什么
> 已知输入的二阶统计与系统冲激响应，怎样算出输出的均值、自相关、自协方差以及与输入的互相关？
> 本节给出四个时域公式：$\mu_Y=\mu_XH(0)$、$R_Y=R_X*h*h(-\cdot)$、$C_Y=C_X*h*h(-\cdot)$、$R_{XY}=R_X*h$，并给出推导与典型例子。
> 这些结果是 [[vault-notes/random-signals/06-input-output-psd-relation]] 的时域对应，也是噪声功率与信噪比计算的直接依据。

## 一、输出均值

> [!info] 定义 1 输出均值
> 若 $Y=X*h$，且 $h$ 绝对可积、$X$ 宽平稳，则
> $$\mu_Y=E[Y(t)]=\mu_X\int_{-\infty}^{\infty}h(\tau)\,\mathrm{d}\tau=\mu_XH(0)$$
> 离散形式为 $\mu_Y=\mu_X\sum_kh[k]=\mu_XH(e^{j0})=\mu_XH(1)$。

推导只需交换期望与积分：

$$E[Y(t)]=E\left[\int h(\tau)X(t-\tau)\,\mathrm{d}\tau\right]=\int h(\tau)E[X(t-\tau)]\,\mathrm{d}\tau=\mu_X\int h(\tau)\,\mathrm{d}\tau$$

> [!tip] $H(0)$ 就是直流增益
> 均值是信号的"直流分量"，系统对直流的增益就是 $H(0)$。低通滤波器 $H(0)=1$，均值原样通过；高通滤波器 $H(0)=0$，输出均值为零；放大器 $H(0)=K$，均值放大 $K$ 倍。

> [!warning] 这里的 $H(0)$ 是连续域的 $\omega=0$
> 离散系统写作 $H(e^{j0})=H(1)$，即 z 变换在 $z=1$ 的值。不要把它与 $H(e^{j\pi})$（奈奎斯特频率）混淆。

## 二、输出自相关与自协方差

> [!info] 定义 2 输出自相关
> 对实过程与实系统，
> $$R_Y(\tau)=E[Y(t+\tau)Y(t)]=R_X(\tau)*h(\tau)*h(-\tau)$$
> 记 $g_h(\tau)=h(\tau)*h(-\tau)=\int h(\alpha)h(\alpha-\tau)\,\mathrm{d}\alpha$，则 $R_Y=R_X*g_h$。离散形式为
> $$R_Y[m]=R_X[m]*h[m]*h[-m]$$

推导：把两个卷积展开，期望穿过积分，

$$R_Y(\tau)=\int\int h(\alpha)h(\beta)R_X(\tau-\alpha+\beta)\,\mathrm{d}\alpha\,\mathrm{d}\beta$$

令 $\beta'=-\beta$，内层变成 $R_X$ 与 $h(-\cdot)$ 的卷积，整理即得。

> [!tip] $g_h$ 是什么
> $g_h(\tau)$ 是冲激响应的**确定性自相关**。它描述系统"记忆"的形状：$g_h$ 越宽，输出相关时间越长。$R_Y$ 就是输入相关函数被系统记忆再平滑一次。

> [!info] 定义 3 输出自协方差
> $$C_Y(\tau)=R_Y(\tau)-\lvert\mu_Y\rvert^2=C_X(\tau)*h(\tau)*h(-\tau)$$
> 输出方差为
> $$\sigma_Y^2=C_Y(0)=R_Y(0)-\lvert\mu_Y\rvert^2$$

去均值的部分与不去均值的部分经过同一个系统：常数均值只贡献 $H(0)$ 的直流项，不会改变协方差形状。

> [!warning] 不要把 $R_Y(0)$ 与 $\sigma_Y^2$ 混为一谈
> $R_Y(0)=E[Y^2(t)]$ 是总平均功率，包含直流；$\sigma_Y^2$ 是交流功率。只有 $\mu_Y=0$ 时两者相等。

| 量 | 时域公式 | 频域对应 | 备注 |
| --- | --- | --- | --- |
| 均值 $\mu_Y$ | $\mu_XH(0)$ | $\mu_XH(0)$ | 只由直流增益决定 |
| 自相关 $R_Y$ | $R_X*h*h(-\cdot)$ | $S_X\lvert H\rvert^2$ | 含均值贡献 |
| 自协方差 $C_Y$ | $C_X*h*h(-\cdot)$ | $\lvert H\rvert^2S_X$（去掉直流线） | 方差看 $C_Y(0)$ |
| 互相关 $R_{XY}$ | $R_X*h$ | $HS_X$ | 输入在前 |
| 互相关 $R_{YX}$ | $R_X*h(-\cdot)$ | $H^*S_X$ | 输出在前 |

## 三、互相关

> [!info] 定义 4 输入输出互相关
> 取 $R_{XY}(\tau)=E[X(t)Y(t+\tau)]$（$Y$ 滞后），则
> $$R_{XY}(\tau)=R_X(\tau)*h(\tau),\qquad R_{YX}(\tau)=R_{XY}(-\tau)=R_X(\tau)*h(-\tau)$$

推导：

$$R_{XY}(\tau)=E\left[X(t)\int h(\alpha)X(t+\tau-\alpha)\,\mathrm{d}\alpha\right]=\int h(\alpha)R_X(\tau-\alpha)\,\mathrm{d}\alpha$$

> [!example] 例 1 纯时延系统
> $h(t)=\delta(t-D)$，则
> $$R_{XY}(\tau)=R_X(\tau-D)$$
> 互相关峰值出现在 $\tau=D$。即使输出端有独立噪声，只要噪声与输入不相关，$R_{XY}$ 不受影响，因此可以在低信噪比下估计时延。这就是 [[vault-notes/random-signals/05-cross-power-spectral-density]] 中互谱相位法的时域版本。

> [!example] 例 2 滑动平均的互相关
> $h[n]=\frac{1}{M}\sum_{k=0}^{M-1}\delta[n-k]$，输入白噪声 $R_X[m]=\sigma^2\delta[m]$，则
> $$R_{XY}[m]=\frac{\sigma^2}{M},\quad 0\le m\le M-1$$
> 其余为零。互相关是一个长度为 $M$ 的矩形，正好是系统冲激响应的形状（乘上 $\sigma^2$）。这提示：白噪声激励下，输入输出互相关可以直接辨识系统冲激响应。

> [!warning] 复过程要加共轭
> 本节公式默认 $X,Y,h$ 为实。复过程应把 $R_{XY}$ 写成共轭相关，$h(-\tau)$ 换成 $h^*(-\tau)$，卷积变成相关；直接套实数公式会漏掉共轭，相位全错。

## 四、完整例子：RC 低通

> [!example] 例 3 RC 低通 + 白噪声
> $h(t)=\frac{1}{RC}e^{-t/(RC)}u(t)$，$R_X(\tau)=\frac{N_0}{2}\delta(\tau)$。因为 $R_X$ 是冲激，卷积直接取出 $g_h$：
> $$R_Y(\tau)=\frac{N_0}{2}g_h(\tau)=\frac{N_0}{4RC}e^{-\lvert\tau\rvert/(RC)}$$
> 输出功率 $R_Y(0)=N_0/(4RC)$，相关时间约 $RC$。互相关为
> $$R_{XY}(\tau)=\frac{N_0}{2}h(\tau)=\frac{N_0}{2RC}e^{-\tau/(RC)}u(\tau)$$
> 它是单边指数，说明因果系统的输出只与"过去"的输入相关。

> [!warning] 公式使用顺序
> 先确认 $h$ 稳定、$X$ 宽平稳，再算 $H(0)$ 与 $g_h$，最后代公式。若 $h$ 不稳定，$R_Y$ 可能根本不存在，后面的功率谱关系也无从谈起。

## 关联

- 上一节：[[vault-notes/random-signals/06-random-process-lti-systems]]
- 下一节：[[vault-notes/random-signals/06-input-output-psd-relation]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/dsp/01-discrete-time-systems]]、[[vault-notes/communication/03-random-processes]]、[[vault-notes/dsp/07-fir-filter-design]]、[[vault-notes/communication/02-deterministic-signals]]
