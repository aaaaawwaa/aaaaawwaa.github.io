---
title: 随机过程与随机信号
description: 从随机变量到随机过程：样本函数、平稳性、各态历经、相关函数与功率谱，以及 PSD 的数值估计。
tags:
  - signal-processing
  - random-processes
  - probability
---

确定性波形可以用一条函数描述；噪声、干扰和随机调制信号在观测前无法预知，只能给出概率规律。一次通信或一次采集只能看到**一条**样本函数，而系统设计必须面向**所有可能**的实现，于是分析对象从波形变成一族波形，描述工具也从函数变成统计量：均值、相关函数、功率谱。

本文是一条自足的学习路径：先回顾随机变量与随机向量中最必要的部分，再把它们推广到随机过程，随后依次建立时域的相关函数与频域的功率谱，最后说明如何从一条有限长记录估计这些量。下一站是 [[signal-processing/random-signals-through-systems|随机信号通过线性系统]]，再往后进入估计与检测。

## 随机过程的定义：两副面孔

设概率空间为 $(\Omega,\mathcal{F},P)$，指标集 $T\subset\mathbb{R}$。若对每个 $t\in T$，$X(t,\cdot)$ 都是同一概率空间上的随机变量，则称随机变量族

$$
\lbrace X(t,\omega):\ t\in T,\ \omega\in\Omega\rbrace
$$

为**随机过程**，简记 $X(t)$；$T=\mathbb{R}$ 为连续时间过程，$T=\mathbb{Z}$ 为离散时间序列 $X[n]$。

理解随机过程的关键，是看清“哪个变量被固定”：

| 固定对象 | 变化对象 | 得到的对象 | 典型用途 |
| --- | --- | --- | --- |
| 时刻 $t$ | 样本点 $\omega$ | 随机变量 $X(t)$ | 求均值、方差、分布 |
| 样本点 $\omega$ | 时刻 $t$ | 样本函数 $x(t)=X(t,\omega)$ | 一次观测、一次仿真 |
| 两者都固定 | 无 | 一个数 $x(t_k)$ | 采样值、判决量 |
| 两者都变化 | 无 | 整个随机过程 | 统计建模 |

> [!tip] 两副面孔
> 横着看是随机变量，竖着看是样本函数。后续“集合平均”与“时间平均”之所以需要区分，根源就在这张表里。

完整描述一个过程要用**有限维分布族**：对任意 $n$ 与任意时刻 $t_1,\dots,t_n$，随机向量 $(X(t_1),\dots,X(t_n))$ 的联合分布

$$
F_X(x_1,\dots,x_n;t_1,\dots,t_n)=P\big(X(t_1)\le x_1,\dots,X(t_n)\le x_n\big)
$$

必须满足两条相容性（交换时刻顺序时分布相应交换变量；对多余变量取边缘回到低维分布）。由 Kolmogorov 扩张定理，满足相容性的分布族可以构造出一个随机过程。但工程上几乎不可能获得全部有限维分布，实际只用到一、二阶矩；**高斯过程是唯一例外**，它的均值函数与协方差函数就确定全部有限维分布。

三个典型例子决定了后面的许多结论：

**随机相位正弦** $X(t)=A\cos(\omega_0t+\Theta)$，$\Theta\sim U[0,2\pi)$。由积化和差，含 $2\Theta$ 的项在一个整周期上平均为零，于是

$$
\mu_X(t)=0,\qquad R_X(t_1,t_2)=\frac{A^2}{2}\cos\omega_0(t_1-t_2)
$$

每条样本函数都是纯正弦，差别只在初相；相关函数只依赖时间差，这正是“平稳”的雏形。

**随机游走** $X[n]=\sum_{k=1}^{n}W[k]$，$W[k]$ 独立同分布、均值 $0$、方差 $\sigma^2$，$X[0]=0$。则

$$
\mu_X[n]=0,\qquad \mathrm{Var}\big(X[n]\big)=n\sigma^2,\qquad R_X(m,n)=\sigma^2\min(m,n)
$$

方差随 $n$ 增长、相关函数依赖两个绝对时刻，因此它**不是**平稳过程。累积相位误差、时钟抖动与某些排队队长都近似成这类模型。

**离散白噪声** $W[n]$ 独立同分布、均值 $0$、方差 $\sigma^2$，则

$$
R_W[m]=E\big[W[n+m]W[n]\big]=\sigma^2\delta[m]
$$

不同时刻不相关；若进一步服从高斯分布，则不相关等价于独立，这是仿真中最基本的激励源。

## 最小必要的概率与随机变量回顾

**分布与密度。** 累积分布函数 $F_X(x)=P(X\le x)$ 单调不减、右连续、两端为 $0$ 与 $1$，是离散、连续、混合型都适用的统一描述。连续型的密度满足 $P(a<X\le b)=\int_a^b f_X(x)\,\mathrm{d}x$；密度的高度不是概率，完全可以大于 $1$，而连续型变量在单点的概率为 $0$。

工程中最常用的分布如下（均值 $\mu$、方差 $\sigma^2$）：

| 分布 | 密度（关键项） | 典型场景 |
| --- | --- | --- |
| 均匀 $U(a,b)$ | $\dfrac{1}{b-a}$ | 量化误差 $(-\Delta/2,\Delta/2)$、随机相位 |
| 指数 $\mathrm{Exp}(\lambda)$ | $\lambda e^{-\lambda x}$ | 泊松到达间隔、衰落功率 |
| 高斯 $N(\mu,\sigma^2)$ | $\dfrac{1}{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}$ | 热噪声、AWGN、大量独立扰动之和 |
| 瑞利 $\mathrm{Rayleigh}(\sigma)$ | $\dfrac{x}{\sigma^2}e^{-\frac{x^2}{2\sigma^2}}$ | 无直射径的衰落包络 |
| 卡方 $\chi^2(k)$ | $\dfrac{x^{k/2-1}e^{-x/2}}{2^{k/2}\Gamma(k/2)}$ | 高斯平方和、能量检测统计量 |

瑞利包络的平方服从指数分布，因此深衰落概率可直接写成 $P(R^2<\gamma)=1-e^{-\gamma/(2\sigma^2)}$；有直射径时包络服从莱斯分布，莱斯因子 $K=\nu^2/(2\sigma^2)$ 越大越接近高斯。

**期望与方差。** 期望是线性算子：$E[X+Y]=E[X]+E[Y]$ 无条件成立；但 $E[XY]=E[X]E[Y]$ 只在独立或不相关时成立，一般应写成

$$
E[XY]=E[X]E[Y]+\mathrm{Cov}(X,Y)
$$

方差不是线性的：$\mathrm{Var}(aX)=a^2\mathrm{Var}(X)$，而

$$
\mathrm{Var}(X+Y)=\mathrm{Var}(X)+\mathrm{Var}(Y)+2\mathrm{Cov}(X,Y)
$$

所以 $\mathrm{Var}(X-Y)=2\sigma^2-2\mathrm{Cov}(X,Y)$，独立同分布时是 $2\sigma^2$；差分测量能抑制共模噪声，靠的正是这一项负协方差。把随机变量写成指示变量之和（如误码个数 $N=\sum_i I_{A_i}$），则 $E[N]=\sum_iP(A_i)$ 不需要独立性。

**条件化。** 全期望公式 $E[X]=E\big[E[X\mid Y]\big]$ 与全方差公式

$$
\mathrm{Var}(X)=E\big[\mathrm{Var}(X\mid Y)\big]+\mathrm{Var}\big(E[X\mid Y]\big)
$$

把总波动分解为“组内平均”与“组间波动”。条件期望还是所有 $Y$ 的函数中使均方误差最小的预测器，这一条把条件期望与 MMSE 估计、维纳滤波直接连起来。贝叶斯公式把“由因推果”翻转为“由果推因”：先验乘似然、除以证据。在二元等概信源下后验等于归一化的转移概率，先验不相等时 MAP 门限会被拉偏，例如双极性信号在 $N(0,1)$ 噪声下、先验 $0.7/0.3$ 时门限为

$$
\gamma=\frac{\sigma^2}{2}\ln\frac{P(H_0)}{P(H_1)}=\frac{1}{2}\ln\frac{0.7}{0.3}\approx0.424
$$

**协方差、相关与独立性。** 相关系数 $\rho_{XY}=\mathrm{Cov}(X,Y)/(\sigma_X\sigma_Y)\in[-1,1]$ 只度量线性关联：$X\sim U(-1,1)$、$Y=X^2$ 时 $\rho=0$，但 $Y$ 完全由 $X$ 决定。**独立一定不相关，不相关不一定独立**；唯一的例外是联合高斯，此时不相关等价于独立。协方差是双线性的，对线性变换 $\mathbf{Y}=\mathbf{A}\mathbf{X}+\mathbf{b}$ 有

$$
\boldsymbol{\mu}_Y=\mathbf{A}\boldsymbol{\mu}_X+\mathbf{b},\qquad \mathbf{C}_Y=\mathbf{A}\mathbf{C}_X\mathbf{A}^{H}
$$

这是误差传播、阵列处理与白化的基本公式。

**高斯向量。** 若 $\mathbf{X}\sim N(\boldsymbol{\mu},\mathbf{\Sigma})$，则任意线性变换仍为高斯；给定 $\mathbf{X}_2$ 时 $\mathbf{X}_1$ 的条件分布仍是高斯，且

$$
E[\mathbf{X}_1\mid\mathbf{X}_2=\mathbf{x}_2]=\boldsymbol{\mu}_1+\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{x}_2-\boldsymbol{\mu}_2)
$$

$$
\mathrm{Cov}(\mathbf{X}_1\mid\mathbf{X}_2)=\mathbf{\Sigma}_{11}-\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}
$$

条件均值是观测的仿射函数（斜率即线性 MMSE 系数），条件协方差与观测值无关（所以卡尔曼增益可以预先算），Schur 补半正定保证“观测不会让方差变大”。这三条是卡尔曼滤波的全部代数基础。注意“边缘都是高斯”推不出“联合高斯”，必须验证任意线性组合都是高斯。

**复随机变量。** 通信基带信号写作 $Z=I+jQ$。复方差必须取共轭：

$$
\mathrm{Var}(Z)=E\big[\lvert Z-\mu_Z\rvert^2\big]=\mathrm{Var}(I)+\mathrm{Var}(Q)
$$

而 $E[(Z-\mu_Z)^2]$ 称为**伪方差**，$I,Q$ 方差不等或相关时不为零。伪方差为零的复高斯称为 **proper**（圆对称），此时 $I,Q$ 独立同分布、相位均匀，二阶统计只需一个 Hermitian 协方差矩阵。口径务必统一：若 $I,Q\sim N(0,\sigma^2)$，则 $E[\lvert Z\rvert^2]=2\sigma^2$；工程文档说“复噪声功率为 $N_0$”时，通常指复功率，对应每支路 $N_0/2$。混用会让 SNR 差 3 dB。更细的推导见 [[vault-notes/random-signals/02-gaussian-random-vectors|高斯随机变量与高斯向量]] 与 [[vault-notes/random-signals/02-complex-random-variables|复随机变量]]。

## 均值函数、自相关与平均功率

对每个固定 $t$，三个低阶数字特征定义为

$$
\mu_X(t)=E[X(t)],\qquad \sigma_X^2(t)=\mathrm{Var}\big(X(t)\big)
$$

$$
R_X(t_1,t_2)=E\big[X(t_1)X^*(t_2)\big],\qquad C_X(t_1,t_2)=R_X(t_1,t_2)-\mu_X(t_1)\mu_X^*(t_2)
$$

它们都是时间的**确定性函数**，不是随机变量；代价是丢失高阶与分布形状信息。三个易错点：均值与方差是集合平均，不是某条样本的时间平均；$R_X(t_1,t_2)$ 在非平稳时不能写成 $R_X(t_1-t_2)$；复过程必须保留共轭，本库约定 $R_X(t_1,t_2)=E[X(t_1)X^*(t_2)]$，于是 $R_X(t,t)=E[\lvert X(t)\rvert^2]\ge0$。

平均功率可分解为直流与交流两部分：

$$
P_X(t)=E\big[\lvert X(t)\rvert^2\big]=R_X(t,t)=\lvert\mu_X(t)\rvert^2+\sigma_X^2(t)
$$

以“信号加噪声”为例：$X(t)=B+A\cos(\omega_0t+\Theta)+N(t)$，$\Theta\sim U[0,2\pi)$，$N$ 是零均值平稳噪声且与 $\Theta$ 独立，则

$$
\mu_X=B,\qquad R_X(\tau)=B^2+\frac{A^2}{2}\cos\omega_0\tau+R_N(\tau)
$$

$R_X$ 把直流、周期分量与噪声的相关结构叠加在一起；要看起伏结构，必须先减去均值，否则直流会在 $R_X(\tau)$ 中留下一个不衰减的平台，在功率谱上形成一根零频谱线。

## 平稳性：严平稳、宽平稳与循环平稳

**严平稳**要求整个有限维分布族对时间平移不变：

$$
F_X(x_1,\dots,x_n;t_1,\dots,t_n)=F_X(x_1,\dots,x_n;t_1+\tau,\dots,t_n+\tau)
$$

于是均值、方差为常数，相关函数只依赖时间差。但严平稳不保证矩存在：边际都是柯西分布的过程可以严平稳，却没有均值和方差。

**宽平稳**（WSS）只约束一、二阶矩：二阶矩有限、均值恒为常数、自相关只与时间差有关：

$$
R_X(t_1,t_2)=R_X(t_1-t_2)=E\big[X(t+\tau)X^*(t)\big]=R_X(\tau)
$$

工程上说的“平稳随机信号”通常指宽平稳；数学文献不加限定则多指严平稳。两者关系是：严平稳 + 有限二阶矩 $\Rightarrow$ 宽平稳，反之一般不成立，**高斯过程例外**（二阶矩有限时两者等价）。

宽平稳的六条常用性质：

| 性质 | 表达式 | 说明 |
| --- | --- | --- |
| 均值恒定 | $\mu_X(t)=\mu_X$ | 不随观测时刻漂移 |
| 方差恒定 | $\sigma_X^2=C_X(0)=R_X(0)-\lvert\mu_X\rvert^2$ | 起伏功率不变 |
| 平均功率 | $R_X(0)=E[\lvert X(t)\rvert^2]$ | 非负实数 |
| 共轭对称 | $R_X(-\tau)=R_X^*(\tau)$ | 实过程为偶函数 |
| 峰值在原点 | $\lvert R_X(\tau)\rvert\le R_X(0)$ | 柯西–施瓦茨不等式的特例 |
| 归一化相关 | $\rho_X(\tau)=C_X(\tau)/C_X(0)$ | $\rho_X(0)=1$，$\lvert\rho_X(\tau)\rvert\le1$ |

检验 WSS 只需三步：二阶矩是否有限、均值是否为常数、$R_X(t_1,t_2)$ 是否只依赖 $t_1-t_2$。任一步失败，就不能使用 $R_X(\tau)$ 与 $S_X(\omega)$ 这套工具。

宽平稳但非严平稳的例子：$X(t)=A\cos\omega_0t+B\sin\omega_0t$，$A,B$ 零均值、不相关、方差均为 $1$，但 $A$ 等概率取 $\pm1$、$B$ 服从拉普拉斯分布。此时 $\mu_X=0$、$R_X(\tau)=\cos\omega_0\tau$ 满足 WSS，而 $t=0$ 与 $t=\pi/(2\omega_0)$ 的一维分布不同。反过来，随机相位正弦既严平稳又宽平稳——时间平移等价于相位平移，均匀分布在相位平移下不变。

**循环平稳**介于平稳与非平稳之间：均值是 $t$ 的周期函数，或（更常见）均值恒定而自相关对 $t$ 周期变化，

$$
\mu_X(t+T_0)=\mu_X(t),\qquad R_X(t+T_0,t+T_0+\tau)=R_X(t,t+\tau)
$$

把周期自相关展开成傅里叶级数，得到循环频率 $\alpha=k/T_0$ 与**循环自相关** $R_X^{\alpha}(\tau)$；其傅里叶变换 $S_X^{\alpha}(\omega)$ 称循环谱，$\alpha=0$ 一行退化为普通 PSD。通信信号天然循环平稳：未抑制载波在 $\alpha=2f_c$ 处有特征，符号成形在 $\alpha=k/T_s$ 处有特征，OFDM 循环前缀在 $\alpha=k/T_u$ 处有特征。但若载波相位均匀随机，$2f_c$ 分量会被平均掉，过程退化为 WSS——保留相位参考是循环平稳分析的前提。这一节对应 [[vault-notes/random-signals/03-strict-vs-wide-sense-stationary|严平稳与宽平稳]] 与 [[vault-notes/random-signals/03-cyclostationary-processes|循环平稳过程]]。

## 常见错误清单

- 把 $R_X(t_1,t_2)$ 直接写成 $R_X(t_1-t_2)$ 而不先验证宽平稳；把“增量平稳”说成“过程平稳”（泊松过程就是反例）。
- 认为“均值为零”等于“某条样本恒为零”，或把集合平均当成时间平均。
- 把“严平稳”与“宽平稳”混用：前者约束全部有限维分布，后者只约束一、二阶矩；只有高斯过程在二阶矩有限时两者等价。
- 对复过程省略共轭，或把伪方差 $E[Z^2]$ 当成方差，进而得出“复高斯方差为 0”的荒谬结论。
- 把调制、采样后的循环平稳信号硬套 WSS 公式，丢掉 $2f_c$、$k/T_s$ 处的循环特征。
- 高斯向量的“边缘都是高斯”被误当成“联合高斯”；忘记“不相关即独立”只对联合高斯成立。

## 前置与下一步

- **前置**：[[mathematics/probability-overview|概率论概览]]（分布、期望方差、高斯与 Q 函数）、[[mathematics/linear-algebra-basics|线性代数基础]]（协方差矩阵、特征分解）、[[signal-processing/dft-and-fft|DFT 与 FFT]]（离散频率与分辨率）。
- **下一步**：[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]——从各态历经与样本估计出发，进入互相关、维纳–辛钦定理与谱估计；再往后是 [[signal-processing/random-signals-through-systems|随机信号通过线性系统]]、[[signal-processing/statistical-estimation-filtering|统计估计与最优滤波]]、[[signal-processing/signal-detection-theory|信号检测理论]]、[[signal-processing/random-signal-experiments|MATLAB 实验]]、[[signal-processing/random-signals-formula-sheet|公式速查]]。

## 来源与延伸阅读

- 符号与路线：[[vault-notes/random-signals/00-math-symbols|数学符号约定]]、[[vault-notes/random-signals/00-knowledge-map|知识地图]]。
- 概率与随机变量：[[vault-notes/random-signals/01-probability-basics|概率论基础]]、[[vault-notes/random-signals/01-conditional-probability-bayes|条件概率与贝叶斯公式]]、[[vault-notes/random-signals/01-random-variables-distributions|随机变量与概率分布]]、[[vault-notes/random-signals/02-expectation-variance|数学期望与方差]]、[[vault-notes/random-signals/02-covariance-correlation|协方差与相关系数]]、[[vault-notes/random-signals/02-gaussian-random-vectors|高斯随机变量与高斯向量]]、[[vault-notes/random-signals/02-complex-random-variables|复随机变量]]。
- 随机过程基础：[[vault-notes/random-signals/03-definition-and-sample-functions|随机过程的定义与样本函数]]、[[vault-notes/random-signals/03-mean-and-correlation-functions|均值函数与相关函数]]、[[vault-notes/random-signals/03-strict-vs-wide-sense-stationary|严平稳与宽平稳]]、[[vault-notes/random-signals/03-gaussian-process-white-noise|高斯过程与白噪声]]、[[vault-notes/random-signals/03-cyclostationary-processes|循环平稳过程]]、[[vault-notes/random-signals/03-poisson-markov-processes|泊松过程与马尔可夫过程]]、[[vault-notes/random-signals/02-joint-conditional-distributions|联合分布与条件分布]]。

<!-- topic-index:start -->
## 随机信号、估计与检测

### 随机信号处理

- [[vault-notes/random-signals/00-course-index|课程与教材索引]]
- [[vault-notes/random-signals/00-math-symbols|数学符号约定]]
- [[vault-notes/random-signals/00-knowledge-map|知识地图]]
- [[vault-notes/random-signals/01-fourier-and-lti|傅里叶变换与线性系统]]
- [[vault-notes/random-signals/01-probability-basics|概率论基础]]
- [[vault-notes/random-signals/01-random-variables-distributions|随机变量与概率分布]]
- [[vault-notes/random-signals/01-conditional-probability-bayes|条件概率与贝叶斯公式]]
- [[vault-notes/random-signals/01-linear-algebra-matrices|线性代数与矩阵运算]]
- [[vault-notes/random-signals/02-complex-random-variables|复随机变量]]
- [[vault-notes/random-signals/02-gaussian-random-vectors|高斯随机变量与高斯向量]]
- [[vault-notes/random-signals/02-joint-conditional-distributions|联合分布与条件分布]]
- [[vault-notes/random-signals/02-expectation-variance|数学期望与方差]]
- [[vault-notes/random-signals/02-covariance-correlation|协方差与相关系数]]
- [[vault-notes/random-signals/03-gaussian-process-white-noise|高斯过程与白噪声]]
- [[vault-notes/random-signals/03-ergodicity|各态历经性]]
- [[vault-notes/random-signals/03-mean-and-correlation-functions|均值函数与相关函数]]
- [[vault-notes/random-signals/03-poisson-markov-processes|泊松过程与马尔可夫过程]]
- [[vault-notes/random-signals/03-definition-and-sample-functions|随机过程的定义与样本函数]]
- [[vault-notes/random-signals/03-cyclostationary-processes|循环平稳过程]]
- [[vault-notes/random-signals/03-strict-vs-wide-sense-stationary|严平稳与宽平稳]]
- [[vault-notes/random-signals/04-cross-correlation-covariance|互相关与互协方差]]
- [[vault-notes/random-signals/04-correlation-properties|相关函数的性质]]
- [[vault-notes/random-signals/04-sample-correlation-estimation|样本相关函数估计]]
- [[vault-notes/random-signals/04-autocorrelation-autocovariance|自相关与自协方差]]
- [[vault-notes/random-signals/05-white-colored-noise-spectra|白噪声与有色噪声频谱]]
- [[vault-notes/random-signals/05-power-spectral-density|功率谱密度PSD]]
- [[vault-notes/random-signals/05-psd-numerical-estimation|功率谱数值估计]]
- [[vault-notes/random-signals/05-cross-power-spectral-density|互功率谱密度]]
- [[vault-notes/random-signals/05-wiener-khinchin|维纳辛钦定理]]
- [[vault-notes/random-signals/06-filtering-noise-power|滤波与噪声功率分析]]
- [[vault-notes/random-signals/06-output-mean-autocorrelation|输出均值与自相关]]
- [[vault-notes/random-signals/06-input-output-psd-relation|输入输出功率谱关系]]
- [[vault-notes/random-signals/06-random-process-lti-systems|随机过程与LTI系统]]
- [[vault-notes/random-signals/07-estimator-bias-variance|估计量的偏差和方差]]
- [[vault-notes/random-signals/07-kalman-filter|卡尔曼滤波]]
- [[vault-notes/random-signals/07-wiener-filter|维纳滤波]]
- [[vault-notes/random-signals/07-maximum-likelihood-least-squares|最大似然与最小二乘]]
- [[vault-notes/random-signals/07-mmse-lmmse|MMSE与LMMSE]]
- [[vault-notes/random-signals/08-hypothesis-testing|假设检验]]
- [[vault-notes/random-signals/08-matched-filter-detection|匹配滤波检测]]
- [[vault-notes/random-signals/08-likelihood-ratio-test|似然比检验]]
- [[vault-notes/random-signals/08-neyman-pearson|Neyman-Pearson准则]]
- [[vault-notes/random-signals/08-roc-curve|ROC曲线]]
- [[vault-notes/random-signals/09-parametric-spectral-estimation|参数化谱估计]]
- [[vault-notes/random-signals/09-adaptive-filter-lms|自适应滤波LMS]]
- [[vault-notes/random-signals/09-adaptive-filter-rls|自适应滤波RLS]]
- [[vault-notes/random-signals/09-ar-ma-arma-modeling|AR-MA-ARMA建模]]
- [[vault-notes/random-signals/10-receiver-detection|接收机检测]]
- [[vault-notes/random-signals/10-snr-noise-bandwidth|信噪比与噪声带宽]]
- [[vault-notes/random-signals/10-adc-sampling-quantization-noise|ADC采样与量化噪声]]
- [[vault-notes/random-signals/10-awgn-channel|AWGN信道]]
- [[vault-notes/random-signals/10-bpsk-qam-ber|BPSK-QAM误码率]]
- [[vault-notes/random-signals/11-white-noise-through-filter|白噪声通过滤波器]]
- [[vault-notes/random-signals/11-gaussian-noise-distribution|高斯噪声生成与分布验证]]
- [[vault-notes/random-signals/11-psd-estimation-experiment|功率谱估计实验]]
- [[vault-notes/random-signals/11-wiener-filtering-experiment|维纳滤波实验]]
- [[vault-notes/random-signals/11-autocorrelation-estimation-experiment|自相关估计实验]]
- [[vault-notes/random-signals/11-awgn-ber-experiment|AWGN信道误码率实验]]
- [[vault-notes/random-signals/99-formula-cheatsheet|常用公式速查]]
- [[vault-notes/random-signals/99-mistakes-and-questions|错题与问题记录]]
- [[vault-notes/random-signals/99-easily-confused-concepts|易混淆概念]]

<!-- topic-index:end -->
