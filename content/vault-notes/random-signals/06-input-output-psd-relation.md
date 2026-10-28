---
title: "输入输出功率谱关系"
tags:
- 随机信号处理
- 06-随机信号通过系统
- 功率谱
- 频率响应
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

# 输入输出功率谱关系

> [!abstract] 这一节在讲什么
> 随机信号通过 LTI 系统后，输出功率谱等于输入功率谱乘以系统频率响应模的平方：$S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega)$。
> 本节从时域卷积关系推出这个式子，给出互谱 $S_{XY}=HS_X$，并用白噪声通过滤波器、输出功率积分和几个典型系统说明它的用法。
> 这是频域分析中最常用的一条公式，也是 [[vault-notes/random-signals/06-filtering-noise-power]] 的计算基础。

## 一、从时域卷积到频域乘积

> [!info] 定义 1 输入输出功率谱关系
> 设 $X(t)$ 宽平稳，$h$ 稳定，$Y=X*h$，则
> $$
> S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega)
> $$
> 离散形式为
> $$
> S_Y(e^{j\omega})=\lvert H(e^{j\omega})\rvert^2S_X(e^{j\omega})
> $$

推导只需对 [[vault-notes/random-signals/06-output-mean-autocorrelation]] 的 $R_Y=R_X*h*h(-\cdot)$ 两边做傅里叶变换。利用

$$
h(t)\ \longleftrightarrow\ H(\omega),\qquad h(-t)\ \longleftrightarrow\ H^*(\omega)
$$

以及卷积对应乘积，得

$$
S_Y(\omega)=S_X(\omega)H(\omega)H^*(\omega)=\lvert H(\omega)\rvert^2S_X(\omega)
$$

> [!tip] 为什么是模平方
> 功率谱是"功率"的密度，不是幅度。系统对幅度乘 $\lvert H\rvert$，对功率就乘 $\lvert H\rvert^2$。相位被平方后消失，所以 PSD 只记得系统的幅频特性，不记得相频特性。

> [!warning] 这个式子只对稳定 LTI 系统成立
> 时变系统、非线性系统、或输入输出不联合宽平稳时，$S_Y=\lvert H\rvert^2S_X$ 不成立。对时变系统，频率之间会发生搬移，必须用时频或循环谱工具。

## 二、输入输出互谱

> [!info] 定义 2 输入输出互谱
> 在 $R_{XY}(\tau)=E[X(t)Y(t+\tau)]$ 的约定下（实过程、实系统），
> $$
> S_{XY}(\omega)=H(\omega)S_X(\omega),\qquad S_{YX}(\omega)=H^*(\omega)S_X(\omega)
> $$

这两个式子说明：互谱的模是 $\lvert H\rvert S_X$，相位就是 $H$ 的相位；若已知 $S_X$ 且输出无独立噪声，可以用 $\hat H=S_{XY}/S_X$ 估计频响；共轭关系 $S_{YX}=S_{XY}^*$ 与 [[vault-notes/random-signals/05-cross-power-spectral-density]] 一致。

| 量 | 时域 | 频域 | 对白噪声输入 |
| --- | --- | --- | --- |
| 输出自谱 | $R_X*h*h(-\cdot)$ | $\lvert H\rvert^2S_X$ | $\frac{N_0}{2}\lvert H\rvert^2$ |
| 输入输出互谱 | $R_X*h$ | $HS_X$ | $\frac{N_0}{2}H$ |
| Y-X 互谱 | $R_X*h(-\cdot)$ | $H^*S_X$ | $\frac{N_0}{2}H^*$ |
| 相干函数 | 由上面三个量算 | $\lvert H\rvert^2S_X/(\lvert H\rvert^2S_X+S_N)$ | 有噪声时小于 1 |

> [!warning] 互谱的方向
> $S_{XY}=HS_X$ 与 $S_{YX}=H^*S_X$ 的差别不是笔误，而是"谁在前"的定义差异。写报告时必须注明互相关是 $E[X(t)Y(t+\tau)]$ 还是 $E[Y(t)X(t+\tau)]$，否则相位符号会反。

## 三、白噪声通过滤波器与输出功率

> [!example] 例 1 白噪声通过任意稳定滤波器
> 输入双边谱 $N_0/2$，则
> $$
> S_Y(\omega)=\frac{N_0}{2}\lvert H(\omega)\rvert^2
> $$
> 输出功率
> $$
> P_Y=\frac{1}{2\pi}\int_{-\infty}^{\infty}\frac{N_0}{2}\lvert H(\omega)\rvert^2\,\mathrm{d}\omega=N_0\int_0^\infty\lvert H(f)\rvert^2\,\mathrm{d}f
> $$
> 这里 $N_0$ 是单边谱密度；若 $H$ 是基带滤波器且最大增益在 0 Hz，则 $P_Y=N_0B_n\lvert H(0)\rvert^2$，其中 $B_n$ 是噪声等效带宽。

对一般输入，输出功率为

$$
P_Y=R_Y(0)=\frac{1}{2\pi}\int_{-\infty}^{\infty}\lvert H(\omega)\rvert^2S_X(\omega)\,\mathrm{d}\omega
$$

离散形式为

$$
P_Y=\frac{1}{2\pi}\int_{-\pi}^{\pi}\lvert H(e^{j\omega})\rvert^2S_X(e^{j\omega})\,\mathrm{d}\omega
$$

> [!example] 例 2 RC 低通
> $H(\omega)=1/(1+j\omega RC)$，白噪声输入：
> $$
> S_Y(\omega)=\frac{N_0/2}{1+(\omega RC)^2},\qquad P_Y=\frac{N_0}{4RC}
> $$
> 若输入不是白噪声，而是带宽远大于 $1/(2\pi RC)$ 的带限噪声，只要在 $1/(2\pi RC)$ 附近谱近似平坦，上述结果仍可近似使用。

> [!example] 例 3 理想低通
> $\lvert H(f)\rvert=1$（$\lvert f\rvert\le B$），其余为零。白噪声输入时
> $$
> P_Y=N_0B
> $$
> 输出谱在带内仍然平坦，带外为零；输出相关函数为 $N_0B\,\mathrm{sinc}(2B\tau)$。

| 系统 | $H(\omega)$ | 白噪声输入下的 $S_Y$ | 输出功率 |
| --- | --- | --- | --- |
| 纯时延 | $e^{-j\omega D}$ | $N_0/2$ | 发散（理想白噪声） |
| RC 低通 | $\frac{1}{1+j\omega RC}$ | $\frac{N_0/2}{1+(\omega RC)^2}$ | $\frac{N_0}{4RC}$ |
| 理想低通 | 矩形 | 带内 $N_0/2$ | $N_0B$ |
| 微分器 | $j\omega$ | $\frac{N_0}{2}\omega^2$ | 发散（需限带） |

> [!warning] 微分器与理想白噪声
> $H(\omega)=j\omega$ 时 $S_Y\propto\omega^2$，积分发散。这不是公式错了，而是"理想白噪声 + 理想微分"超出了有限功率的适用范围。实际系统一定限带，应按带限噪声积分。

## 四、几个易错点

> [!warning] 四条常见错误
> - 把 $\lvert H(\omega)\rvert^2$ 写成 $H^2(\omega)$：后者对复频响没有意义，会丢掉共轭。
> - 忘记单边/双边：$S_X=N_0/2$ 是双边，$N_0$ 是单边；用错会让功率差 2 倍。
> - 把 $S_Y=\lvert H\rvert^2S_X$ 用在输出还叠加了独立噪声的场合：此时 $S_Y=\lvert H\rvert^2S_X+S_N$。
> - 用 $S_{XY}/S_X$ 估计 $H$ 时不检查相干函数：相干函数低的频段，估计没有意义。

> [!tip] 做题顺序
> 先写 $H(\omega)$，再算 $\lvert H\rvert^2$，再乘输入谱，最后积分求功率。每一步都标明单边/双边，能避免绝大多数错误。

## 关联

- 上一节：[[vault-notes/random-signals/06-output-mean-autocorrelation]]
- 下一节：[[vault-notes/random-signals/06-filtering-noise-power]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/dsp/02-z-transform-and-dtft]]、[[vault-notes/dsp/07-fir-filter-design]]、[[vault-notes/communication/04-channel]]、[[vault-notes/fpga/ad9361/iq-signals]]
