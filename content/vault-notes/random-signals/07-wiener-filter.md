---
title: "维纳滤波"
tags:
- 随机信号处理
- 07-统计估计与最优滤波
- 维纳滤波
- 最优滤波
type: concept
subjects:
- 随机信号处理
- 统计信号处理
domains:
- 估计与检测
- 统计信号处理
status: learning
aliases: []
prerequisites: []
related: []
---

# 维纳滤波

> [!abstract] 这一节在讲什么
> 维纳滤波回答：已知期望信号与观测的功率谱，怎样设计一个线性时不变滤波器，使估计的均方误差最小。核心结论是 Wiener-Hopf 方程，非因果情形在频域化为 $H=S_{sx}/S_{xx}$，因果情形还要做谱分解。它是最小二乘思想在随机信号上的频域版本，也是 [[vault-notes/random-signals/07-kalman-filter]] 的平稳特例。

## 一、问题与模型

设观测由期望信号与噪声相加而成，即 $x(t)=s(t)+w(t)$。设计线性时不变滤波器 $h(t)$，输出 $\hat{s}(t)=h(t)*x(t)$，使 MSE 最小：

$$
\sigma_e^2=E\left[\left(s(t)-\hat{s}(t)\right)^2\right]
$$

这里假设 $s(t)$ 与 $w(t)$ 联合宽平稳，相关函数与功率谱已知。若 $s$ 与 $w$ 独立，则 $R_{sx}(\tau)=R_{ss}(\tau)$，$R_{xx}(\tau)=R_{ss}(\tau)+R_{ww}(\tau)$，问题完全由二阶统计量决定。

> [!tip] 与匹配滤波的分工
> 维纳滤波估计的是整个波形，目标是波形 MSE 最小；[[vault-notes/random-signals/08-matched-filter-detection]] 只在某个抽样时刻最大化 SNR，目标是判决。两者都用到相关函数，但优化对象不同，不能互相替代。

## 二、正交性原理与 Wiener-Hopf 方程

> [!info] 定义 Wiener-Hopf 方程
> 使 MSE 最小的最优滤波器满足
>
> $$
> R_{sx}(\tau)=\int_{-\infty}^{\infty}h(\alpha)R_{xx}(\tau-\alpha)\,d\alpha
> $$

推导只用一步：令 $h(t)$ 产生微小扰动，MSE 的变分为零，得到误差与观测正交，即 $E[(s(t)-\hat{s}(t))x(t-\tau)]=0$ 对所有 $\tau$ 成立。展开该式就是 Wiener-Hopf 方程。它与 [[vault-notes/random-signals/07-mmse-lmmse]] 中的正交性原理是同一件事，只是把有限维向量换成了连续时间函数。

若滤波器限定为因果，$h(\alpha)=0$ 对 $\alpha<0$，方程只在 $\tau\ge0$ 成立：

$$
R_{sx}(\tau)=\int_{0}^{\infty}h(\alpha)R_{xx}(\tau-\alpha)\,d\alpha,\qquad \tau\ge0
$$

这就是因果 Wiener-Hopf 方程，求解比非因果情形困难得多。

## 三、FIR 解与 IIR 解

把滤波器截断为 $M$ 抽头 FIR，$h=[h_0,\dots,h_{M-1}]^T$，正交条件变成线性方程组

$$
\mathbf{R}_{xx}\mathbf{h}=\mathbf{r}_{sx}
$$

其中 $\mathbf{R}_{xx}$ 是 Toeplitz 自相关矩阵，$[\mathbf{R}_{xx}]_{ij}=R_{xx}[i-j]$，$\mathbf{r}_{sx}[i]=R_{sx}[i]$。解为 $\mathbf{h}=\mathbf{R}_{xx}^{-1}\mathbf{r}_{sx}$，与 LMMSE 的公式同构。$M$ 越大，逼近 IIR 最优解越好，但矩阵条件数也可能变差。

IIR 因果解的经典步骤是谱分解：把观测功率谱分解为

$$
S_{xx}(z)=L(z)L(z^{-1})
$$

其中 $L(z)$ 因果、最小相位。最优滤波器为

$$
H(z)=\frac{1}{L(z)}\left[\frac{S_{sx}(z)}{L(z^{-1})}\right]_+
$$

$[\cdot]_+$ 表示取因果部分。这一步的本质是把“未来数据不可用”的约束吸收进 $L(z)$，再把剩余部分投影到因果子空间。

## 四、频域形式：因果与非因果

非因果滤波允许使用全部时间的数据，对 Wiener-Hopf 方程两边取傅里叶变换，卷积变成乘积：

$$
H(\omega)=\frac{S_{sx}(\omega)}{S_{xx}(\omega)}
$$

当信号与噪声独立时，$S_{sx}=S_{ss}$，$S_{xx}=S_{ss}+S_{ww}$，于是

$$
H(\omega)=\frac{S_{ss}(\omega)}{S_{ss}(\omega)+S_{ww}(\omega)}
$$

这就是“维纳滤波器”的频域表达式：在信号强、噪声弱的频段增益接近 1；在噪声占优的频段增益接近 0。最小 MSE 为

$$
\sigma_{e,\min}^2=\frac{1}{2\pi}\int_{-\infty}^{\infty}\frac{S_{ss}(\omega)S_{ww}(\omega)}{S_{ss}(\omega)+S_{ww}(\omega)}\,d\omega
$$

| 类型 | 可用数据 | 求解方式 | 性能与代价 |
| --- | --- | --- | --- |
| 非因果 | 全部时间 | $H=S_{sx}/S_{xx}$ | MSE 最小，但不可实时实现 |
| 因果 IIR | 过去与当前 | 谱分解 + 因果部分 | 可实时，MSE 略大 |
| FIR | 有限过去 | Toeplitz 方程 | 实现简单，长度足够时逼近 IIR |

> [!warning] 因果约束不是小事
> 把非因果解直接截断，得到的滤波器一般不再最优；若加足够延迟使其因果，则性能可以保留，但会引入固定时延。正确做法仍是解因果 Wiener-Hopf 方程或做谱分解。

## 五、例子：RC 信号加白噪声

> [!example] RC 信号加白噪声
> 设期望信号是白噪声经过 RC 低通后的输出，其功率谱为

$$
S_{ss}(\omega)=\frac{S_0}{1+(\omega RC)^2}
$$

观测噪声为独立白噪声，双边谱密度 $N_0/2$。非因果维纳滤波器的频率响应为

$$
H_W(\omega)=\frac{S_0}{S_0+(N_0/2)\left[1+(\omega RC)^2\right]}
$$

它在直流处增益为 $S_0/(S_0+N_0/2)$，频率越高增益越小，等效于一个带宽可调的低通滤波器。取 $S_0=1$、$N_0/2=S_0$，则 $H_W(0)=1/2$，半功率角带宽约为 $0.91/RC$；最小 MSE 为

$$
\sigma_{e,\min}^2=\frac{1}{2\sqrt{2}\,RC}\approx0.707\,\frac{S_0}{2RC}
$$

输出信噪比按“滤波后信号功率 / 滤波后噪声功率”定义：

$$
\mathrm{SNR}_{out}=\frac{\int S_{ss}\lvert H\rvert^2\,d\omega/2\pi}{\int S_{ww}\lvert H\rvert^2\,d\omega/2\pi}
$$

噪声为白噪声时，若信号谱在滤波器带内近似平坦，则 $\mathrm{SNR}_{out}\approx\mathrm{SNR}_{in}\cdot B_{in}/B_{eq}$，其中等效噪声带宽 $B_{eq}=\int_{-\infty}^{\infty}\lvert H(\omega)\rvert^2\,d\omega/\left[2\pi\lvert H(0)\rvert^2\right]$。上述例子在 $N_0/2=S_0$、$RC=1$ ms 时 $B_{eq}\approx354$ Hz（双边），而 RC 信号的等效噪声带宽为 $1/(2RC)=500$ Hz。按平坦近似，输出 SNR 约为输入 SNR 的 $500/354\approx1.4$ 倍（1.5 dB）；实际信号能量集中在低频，数值积分得到输出 SNR 约为输入 SNR 的 1.66 倍（2.2 dB）。改善有限，因为滤波器在压噪声的同时也衰减了信号高频分量。

> [!warning] 维纳滤波不最大化 SNR
> 它最小化的是波形 MSE。低信噪比时，滤波器宁可压窄带宽、牺牲信号高频分量来换取噪声下降，输出 SNR 未必比某个更宽的带通方案高。若目标是“判决时刻 SNR 最大”，应使用 [[vault-notes/random-signals/08-matched-filter-detection]]。

## 关联

- 上一节：[[vault-notes/random-signals/07-mmse-lmmse]]
- 下一节：[[vault-notes/random-signals/07-kalman-filter]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/communication/04-channel]]、[[vault-notes/matlab/matlab-notes]]
