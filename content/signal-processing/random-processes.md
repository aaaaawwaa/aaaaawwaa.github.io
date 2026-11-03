---
title: 随机过程与随机信号
description: 从随机变量到随机过程：样本函数、集合平均、均值/方差/自相关与宽平稳判定；各态历经与功率谱留到下一篇。
tags:
  - signal-processing
  - random-processes
  - probability
---

确定性波形可以用一条函数描述；噪声、干扰和随机调制信号在观测前无法预知，只能给出概率规律。一次通信或一次采集只看到**一条**样本函数，而系统设计必须面向**所有可能**的实现——于是分析对象从一条曲线变成一族曲线，描述工具也从函数变成统计量。

本文只负责这条链的前半段：**随机过程是什么，样本函数与固定时刻的随机变量差在哪，均值、方差、自相关与平均功率怎么定义，以及怎样判断宽平稳**。各态历经的具体含义、有限记录的统计量估计、维纳–辛钦与周期图/Welch 由 [[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]] 接手；本文只做预告。

> [!info] 读完这一篇，你应该能
> 1. 说清「固定时刻」与「固定样本」分别得到什么，并解释为什么一条曲线不能代表整个过程；
> 2. 写出随机相位正弦的均值与自相关，并判断它是否宽平稳；
> 3. 用三步法检验 WSS，并举出一个「均值恒定但不是 WSS」的反例；
> 4. 说明 proper 复高斯与圆对称的区别，以及为什么复信号统计描述要交代伪协方差；
> 5. 指出本文与下一篇的分工，知道各态历经不是功率谱定理的前提。

## 1. 一条曲线不是整个过程

设想一次实验：在示波器上看到一段噪声。如果重做实验，会得到另一条曲线；把所有可能的结果合在一起，才是完整的对象。把「时间」和「哪一次实验」都写出来，记为 $X(t,\omega)$，其中 $t$ 是时间，$\omega$ 是样本点。固定其中一个，含义完全不同：

| 固定对象 | 变化对象 | 得到的对象 | 典型用途 |
| --- | --- | --- | --- |
| 时刻 $t$ | 样本点 $\omega$ | 随机变量 $X(t)$ | 求均值、方差、分布 |
| 样本点 $\omega$ | 时刻 $t$ | 样本函数 $x(t)=X(t,\omega)$ | 一次观测、一次仿真 |
| 两者都固定 | 无 | 一个数 $x(t_k)$ | 采样值、判决量 |
| 两者都变化 | 无 | 整个随机过程 | 统计建模 |

> [!tip] 两副面孔
> 横着看是随机变量，竖着看是样本函数。后文「集合平均」与「时间平均」的区别，以及各态历经要回答的问题，都源于这张表。

**本节解决什么问题**：先建立「固定哪一个变量」的视角，避免把一条观测曲线当成过程本身。

## 2. 定义：随机过程与有限维分布

设概率空间为 $(\Omega,\mathcal{F},P)$，指标集 $T\subset\mathbb{R}$。若对每个 $t\in T$，$X(t,\cdot)$ 都是同一概率空间上的随机变量，则称随机变量族

$$
\lbrace X(t,\omega):\ t\in T,\ \omega\in\Omega\rbrace
$$

为**随机过程**，简记 $X(t)$；$T=\mathbb{R}$ 为连续时间过程，$T=\mathbb{Z}$ 为离散时间序列 $X[n]$。

完整描述要用**有限维分布族**：对任意 $n$ 与任意时刻 $t_1,\dots,t_n$，随机向量 $(X(t_1),\dots,X(t_n))$ 的联合分布

$$
F_X(x_1,\dots,x_n;t_1,\dots,t_n)=P\big(X(t_1)\le x_1,\dots,X(t_n)\le x_n\big)
$$

必须满足相容性（交换时刻顺序时分布相应交换变量；对多余变量取边缘回到低维分布）。由 Kolmogorov 扩张定理，满足相容性的分布族可以构造出一个随机过程。

工程上几乎不可能获得全部有限维分布，实际通常只用到一、二阶矩。对**实高斯过程**（任意有限个时刻的联合分布都是多元高斯），均值函数与自协方差函数确定全部有限维分布；对**复高斯过程**，完整的二阶描述还要包含伪协方差（见 7.2 节），只给协方差一般不够，除非过程 proper。一般非高斯过程不能由一、二阶矩确定分布；「高斯是唯一例外」若作为无条件结论并不成立——它依赖比较的分布族与「确定」的含义，入门阶段只记住「联合高斯时二阶矩足够」即可。

三个典型例子决定了后面的许多结论：

**随机相位正弦** $X(t)=A\cos(\omega_0t+\Theta)$，$\Theta\sim U[0,2\pi)$，$A,\omega_0$ 为确定常数。均值与自相关的完整推导放在第 5 节，结论是

$$
\mu_X(t)=0,\qquad R_X(t_1,t_2)=\frac{A^2}{2}\cos\omega_0(t_1-t_2)
$$

每条样本函数都是纯正弦，差别只在初相；相关函数只依赖时间差，这正是「平稳」的雏形。

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

**本节解决什么问题**：给出过程的严格描述，并说明「只用到二阶矩」是工程近似（高斯过程是特例）。

## 3. 固定时刻的随机变量与集合平均

对每个固定 $t$，三个低阶数字特征定义为

$$
\mu_X(t)=E[X(t)],\qquad \sigma_X^2(t)=\mathrm{Var}\big(X(t)\big)
$$

$$
R_X(t_1,t_2)=E\big[X(t_1)X^*(t_2)\big],\qquad C_X(t_1,t_2)=R_X(t_1,t_2)-\mu_X(t_1)\mu_X^*(t_2)
$$

它们都是时间的**确定性函数**，不是随机变量；代价是丢失高阶与分布形状信息。三个易错点：均值与方差是集合平均，不是某条样本的时间平均；$R_X(t_1,t_2)$ 在非平稳时不能写成 $R_X(t_1-t_2)$；复过程必须保留共轭。本库统一约定

$$
R_X(t_1,t_2)=E\big[X(t_1)X^*(t_2)\big],\qquad R_X(t,t)=E\big[\lvert X(t)\rvert^2\big]\ge0
$$

平均功率可分解为直流与交流两部分：

$$
P_X(t)=E\big[\lvert X(t)\rvert^2\big]=R_X(t,t)=\lvert\mu_X(t)\rvert^2+\sigma_X^2(t)
$$

以「信号加噪声」为例：$X(t)=B+A\cos(\omega_0t+\Theta)+N(t)$，$B$ 为确定性常数，$\Theta\sim U[0,2\pi)$，$N$ 是零均值平稳噪声且与 $\Theta$ 独立，则

$$
\mu_X=B,\qquad R_X(\tau)=B^2+\frac{A^2}{2}\cos\omega_0\tau+R_N(\tau)
$$

$R_X$ 把直流、周期分量与噪声的相关结构叠加在一起；要看起伏结构，必须先减去均值，否则直流会在 $R_X(\tau)$ 中留下一个不衰减的平台，在功率谱上形成一根零频谱线。

### 3.1 用得到的最小概率回顾

工程中最常用的分布如下（均值 $\mu$、方差 $\sigma^2$）：

| 分布 | 密度（关键项） | 典型场景 |
| --- | --- | --- |
| 均匀 $U(a,b)$ | $\dfrac{1}{b-a}$ | 量化误差 $(-\Delta/2,\Delta/2)$、随机相位 |
| 指数 $\mathrm{Exp}(\lambda)$ | $\lambda e^{-\lambda x}$ | 泊松到达间隔、衰落功率 |
| 高斯 $N(\mu,\sigma^2)$ | $\dfrac{1}{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}$ | 热噪声、AWGN、大量独立扰动之和 |
| 瑞利 $\mathrm{Rayleigh}(\sigma)$ | $\dfrac{x}{\sigma^2}e^{-\frac{x^2}{2\sigma^2}}$ | 无直射径的衰落包络 |
| 卡方 $\chi^2(k)$ | $\dfrac{x^{k/2-1}e^{-x/2}}{2^{k/2}\Gamma(k/2)}$ | 高斯平方和、能量检测统计量 |

瑞利包络的平方服从指数分布，因此深衰落概率可直接写成 $P(R^2<\gamma)=1-e^{-\gamma/(2\sigma^2)}$。

期望是线性算子：$E[X+Y]=E[X]+E[Y]$ 无条件成立；但 $E[XY]=E[X]E[Y]$ 只在独立或不相关时成立，一般应写成

$$
E[XY]=E[X]E[Y]+\mathrm{Cov}(X,Y)
$$

方差不是线性的：$\mathrm{Var}(aX)=a^2\mathrm{Var}(X)$，而

$$
\mathrm{Var}(X+Y)=\mathrm{Var}(X)+\mathrm{Var}(Y)+2\mathrm{Cov}(X,Y)
$$

相关系数 $\rho_{XY}=\mathrm{Cov}(X,Y)/(\sigma_X\sigma_Y)\in[-1,1]$ 只度量线性关联：$X\sim U(-1,1)$、$Y=X^2$ 时 $\rho=0$，但 $Y$ 完全由 $X$ 决定。**独立一定不相关，不相关不一定独立**；在**联合高斯**的前提下不相关才等价于独立（仅「边缘都是高斯」不够）；复联合高斯还要求互伪协方差也为零。协方差是双线性的，对线性变换 $\mathbf{Y}=\mathbf{A}\mathbf{X}+\mathbf{b}$ 有

$$
\boldsymbol{\mu}_Y=\mathbf{A}\boldsymbol{\mu}_X+\mathbf{b},\qquad \mathbf{C}_Y=\mathbf{A}\mathbf{C}_X\mathbf{A}^{H}
$$

> [!note] 复信号的方差约定
> 复随机变量 $Z=I+jQ$ 的方差取 $\mathrm{Var}(Z)=E\big[\lvert Z-\mu_Z\rvert^2\big]$；若 $I,Q$ 独立同分布且各自方差为 $\sigma^2$，则 $\mathrm{Var}(Z)=2\sigma^2$。工程文档说「复噪声功率为 $N_0$」时通常指复功率；只有在**零均值且 proper** 时才能等价成每支路 $N_0/2$，非圆时 $I,Q$ 功率一般不等，不能无条件各分一半；混用口径会让 SNR 差 3 dB。
> 复情形还有几条口径：$\mathrm{Var}(aZ)=\lvert a\rvert^2\mathrm{Var}(Z)$；$\mathrm{Cov}(Z_1,Z_2)=E\big[(Z_1-\mu_1)(Z_2-\mu_2)^*\big]$；$E[Z_1Z_2^*]=E[Z_1]E[Z_2^*]+\mathrm{Cov}(Z_1,Z_2)$；$\mathrm{Var}(Z_1+Z_2)=\mathrm{Var}(Z_1)+\mathrm{Var}(Z_2)+2\mathrm{Re}\,\mathrm{Cov}(Z_1,Z_2)$；相关系数 $\lvert\rho\rvert\le1$。伪方差与 proper 的完整讨论见 7.2 节。

**本节解决什么问题**：把「一、二阶统计量」定义清楚，并统一相关函数的共轭与功率口径。

## 4. 平稳性：严平稳、宽平稳与循环平稳

**严平稳**要求整个有限维分布族对时间平移不变：

$$
F_X(x_1,\dots,x_n;t_1,\dots,t_n)=F_X(x_1,\dots,x_n;t_1+\tau,\dots,t_n+\tau)
$$

若相应的矩存在（例如 $E\lvert X(t)\rvert^2<\infty$），则均值、方差为常数，相关函数只依赖时间差。但严平稳本身不保证矩存在：边际都是柯西分布的过程可以严平稳，却没有均值和方差。

**宽平稳**（WSS）只约束一、二阶矩：二阶矩有限、均值恒为常数、自相关只与时间差有关：

$$
R_X(t_1,t_2)=R_X(t_1-t_2)=E\big[X(t+\tau)X^*(t)\big]=R_X(\tau)
$$

工程上说的「平稳随机信号」通常指宽平稳；数学文献不加限定则多指严平稳。两者关系是：严平稳 + 有限二阶矩 $\Rightarrow$ 宽平稳；反过来一般不成立。**对联合高斯过程**（所有有限维分布联合高斯）且二阶矩有限，WSS 与严平稳等价——有限维联合高斯分布由均值与协方差确定，而 WSS 让这两者平移不变。复高斯还要把伪协方差纳入二阶描述：仅均值与 Hermitian 协方差平移不变不足以保证严平稳，常见充分条件是 proper（伪协方差恒为零）且 WSS。

宽平稳的六条常用性质：

| 性质 | 表达式 | 说明 |
| --- | --- | --- |
| 均值恒定 | $\mu_X(t)=\mu_X$ | 不随观测时刻漂移 |
| 方差恒定 | $\sigma_X^2=C_X(0)=R_X(0)-\lvert\mu_X\rvert^2$ | 起伏功率不变 |
| 平均功率 | $R_X(0)=E\big[\lvert X(t)\rvert^2\big]$ | 非负实数 |
| 共轭对称 | $R_X(-\tau)=R_X^*(\tau)$ | 实过程为偶函数 |
| 峰值在原点 | $\lvert R_X(\tau)\rvert\le R_X(0)$ | 柯西–施瓦茨不等式的特例 |
| 归一化相关 | $\rho_X(\tau)=C_X(\tau)/C_X(0)$ | $\rho_X(0)=1$，$\lvert\rho_X(\tau)\rvert\le1$ |

检验 WSS 只需三步：二阶矩是否有限、均值是否为常数、$R_X(t_1,t_2)$ 是否只依赖 $t_1-t_2$。任一步失败，就不能使用 $R_X(\tau)$ 与 $S_X(\omega)$ 这套工具。

> [!warning] 均值恒定不等于宽平稳
> 令 $X(t)=\sigma(t)W(t)$，$W(t)$ 是零均值、单位方差的白噪声，$\sigma(t)>0$ 是确定性函数。则 $\mu_X(t)=0$ 恒定，但 $R_X(t_1,t_2)=\sigma(t_1)\sigma(t_2)\delta(t_1-t_2)$ 依赖绝对时刻，方差 $\sigma^2(t)$ 也随时间变化——所以它不是 WSS。判断平稳必须同时检查均值与相关函数。

宽平稳但非严平稳的例子：$X(t)=A\cos\omega_0t+B\sin\omega_0t$，$A,B$ 零均值、不相关、方差均为 $1$，但 $A$ 等概率取 $\pm1$、$B$ 服从拉普拉斯分布。此时 $\mu_X=0$、$R_X(\tau)=\cos\omega_0\tau$ 满足 WSS，而 $t=0$ 与 $t=\pi/(2\omega_0)$ 的一维分布不同。反过来，随机相位正弦既严平稳又宽平稳——时间平移等价于相位平移，均匀分布在相位平移下不变。

**循环平稳**（宽意义）介于平稳与非平稳之间：均值与自相关都以 $T_0$ 为周期，

$$
\mu_X(t+T_0)=\mu_X(t),\qquad R_X(t+T_0,t+T_0+\tau)=R_X(t,t+\tau)
$$

常见情形是均值恒定、自相关随 $t$ 周期变化；若只有均值周期而自相关不周期，那是一阶循环平稳，不满足这里的宽意义定义。把周期自相关展开成傅里叶级数，得到循环频率 $\alpha=k/T_0$ 与**循环自相关** $R_X^{\alpha}(\tau)$；其傅里叶变换 $S_X^{\alpha}(\omega)$ 称循环谱，$\alpha=0$ 一行退化为普通 PSD。

通信信号的循环结构要分清来源与阶数。以 $x(t)=\mathrm{Re}\lbrace s(t)e^{j(2\pi f_ct+\varphi)}\rbrace$ 为例（$s$ 为复包络），$R_x(t+\tau,t)$ 会同时出现非共轭项与含 $e^{j2\varphi}$ 的共轭项：

- 实带通信号的 $2f_c$ 共轭循环特征，来自复包络的非圆性 $E[s(t+\tau)s(t)]\ne0$，不是「未抑制载波」的同义词；
- 若存在残余载波，它会在 $\alpha=f_c$ 处产生**一阶**循环均值（谱线），与 $2f_c$ 的二阶共轭特征不是同一回事；
- 符号率结构由成形脉冲与符号周期决定：数据独立同分布、定时确定时，非共轭循环自相关一般在 $\alpha=k/T_s$ 处非零，共轭部分在 proper 复符号下可能为零；
- 标准 CP-OFDM（$T_s=T_u+T_{\mathrm{cp}}$，CP 为有用部分末尾的复制）的二阶统计以 $T_s$ 为周期，循环频率是 $\alpha=k/T_s$；CP 在 lag $T_u$ 处产生相关，但不把循环频率改成 $k/T_u$。

循环结构能否被观测到，取决于相位与定时是否随机：**若载波相位在 $[0,2\pi)$ 上均匀随机且与 $s$、定时独立，含 $e^{j2\varphi}$ 的共轭项会在集合平均中被抹掉**；符号率等非共轭项仍可保留，除非符号定时或数据也被随机化。因此不能概括成「加随机相位后所有通信过程都变成 WSS」——被平均掉的只是与载波相位有关的那一部分。（以上说的是集合平均的二阶统计；单次实现或条件于相位估计的观测是另一回事。）

**本节解决什么问题**：给出可检验的 WSS 判据，并用反例说明「均值恒定」不足以判定平稳。

## 5. 渐进推导：随机相位正弦的均值与自相关

模型：$X(t)=A\cos(\omega_0t+\Theta)$，$A>0$、$\omega_0$ 为确定常数，$\Theta\sim U[0,2\pi)$，且在**一条样本路径内相位固定**。下面按三层展开：先看直觉，再逐步推导，最后检查 WSS。

### 第 1 层：直观解释（先读这一段）

> [!tip] 为什么平均后只剩时间差
> 对每一条样本路径，相位是一个常数，因此路径本身是纯正弦；跨路径取平均时，相当于让初相在所有可能值上均匀铺开。两个时刻的乘积展开后会出现一个含 $2\Theta$ 的项，它在整个相位圆周上对称地正负抵消；剩下的项只与两个时刻之**差**有关。

**本节解决什么问题**：先建立「相位在路径内固定、跨路径均匀」的直觉，再进入公式。

### 第 2 层：逐步推导

1. 自相关定义（实信号，共轭可省略）：

$$
R_X(t_1,t_2)=E\big[X(t_1)X(t_2)\big]=A^2E\big[\cos(\omega_0t_1+\Theta)\cos(\omega_0t_2+\Theta)\big]
$$

2. 积化和差，把两个余弦的乘积拆成和差两项：

$$
\cos\alpha\cos\beta=\tfrac12\big[\cos(\alpha-\beta)+\cos(\alpha+\beta)\big]
$$

于是

$$
R_X(t_1,t_2)=\frac{A^2}{2}E\big[\cos\omega_0(t_1-t_2)\big]+\frac{A^2}{2}E\big[\cos\big(\omega_0(t_1+t_2)+2\Theta\big)\big]
$$

3. 第一项不含随机变量，直接提出期望：

$$
\frac{A^2}{2}\cos\omega_0(t_1-t_2)
$$

4. 第二项对均匀相位求期望。设 $\varphi=\omega_0(t_1+t_2)$，则

$$
E\big[\cos(\varphi+2\Theta)\big]=\frac{1}{2\pi}\int_0^{2\pi}\cos(\varphi+2\theta)\,\mathrm{d}\theta=0
$$

因为 $\cos(\varphi+2\theta)$ 在 $\theta\in[0,2\pi)$ 上恰好走过两个完整周期，正负面积相等；这是**精确的积分为零**，不是「取一个周期平均近似为零」。

5. 合并得到

$$
R_X(t_1,t_2)=\frac{A^2}{2}\cos\omega_0(t_1-t_2)=R_X(t_1-t_2)
$$

### 第 3 层：完整结果与 WSS 检查

> [!success] 结论
> $$\mu_X(t)=E\big[A\cos(\omega_0t+\Theta)\big]=A\cdot\frac{1}{2\pi}\int_0^{2\pi}\cos(\omega_0t+\theta)\,\mathrm{d}\theta=0$$
> $$R_X(\tau)=\frac{A^2}{2}\cos\omega_0\tau,\qquad P_X=R_X(0)=\frac{A^2}{2}$$
> 三步检查：二阶矩 $A^2/2<\infty$；均值恒为 $0$；相关函数只依赖 $\tau=t_1-t_2$。三条都满足，因此它是**宽平稳**过程。又因时间平移等价于相位平移、而均匀分布在此平移下不变，它还是**严平稳**的。

> [!warning] 只把模型里当成常数的量当真
> 上面的「相位在一条路径内固定」是模型的一部分。如果每条路径内相位还随时间随机变化，样本函数就不再是纯正弦，推导与结论都不成立；仿真时必须为每条路径抽样一次相位、沿时间保持不变。

## 6. 相关函数的使用约定与性质

同一套符号在不同教材里可能差一个共轭或一个时差符号，读公式前先确认约定。本文统一采用

$$
R_X(t_1,t_2)=E\big[X(t_1)X^*(t_2)\big],\qquad R_X(\tau):=E\big[X(t+\tau)X^*(t)\big]\quad(\tau=t_1-t_2)
$$

宽平稳时应表述为「存在一元函数 $R_X(\tau)$ 使 $R_X(t_1,t_2)=R_X(t_1-t_2)$」，不要把二元函数直接写成等于一元函数。据此

| 名称 | 定义 | 在 $\tau=0$ 处 |
| --- | --- | --- |
| 自相关 | $R_X(\tau)=E[X(t+\tau)X^*(t)]$ | $R_X(0)=E\lvert X(t)\rvert^2$，即平均功率 |
| 自协方差 | $C_X(\tau)=R_X(\tau)-\lvert\mu_X\rvert^2$ | $C_X(0)=\sigma_X^2$，即起伏功率 |

三个量别混：**平均功率** $R_X(0)$ 含直流；**方差** $C_X(0)$ 只含起伏；**自相关** $R_X(\tau)$ 描述不同时刻的相似性，量纲是功率。$P_X=R_X(0)=\lvert\mu_X\rvert^2+\sigma_X^2$，$C_X(\tau)=R_X(\tau)-\lvert\mu_X\rvert^2$；只有 $\mu_X=0$ 时 $R_X=C_X$。归一化相关 $\rho_X(\tau)=C_X(\tau)/C_X(0)$ 需 $C_X(0)>0$，且 $\lvert\rho_X(\tau)\rvert\le1$。实过程的三者都可以是实数；复过程保留共轭后 $R_X(-\tau)=R_X^*(\tau)$。若采用相反约定（共轭在第一个因子），$R_X$ 与本文互为共轭，谱的相位符号也随之改变——引用教材前先核对。

<a id="concept-bridge-autocorrelation"></a>

### 6.1 学习卡：自相关函数（看不明白时先停在这里）

> [!abstract] 一句话与主线位置
> 自相关函数衡量**同一个随机过程**在两个时刻取值之间的统计联系，宽平稳时只由时间差决定。
> 主线位置：随机过程（§2）→ 固定时刻统计（§3）→ 宽平稳（§4）→ 本节 → 功率谱（下一篇）。

> [!tip] 直觉（只是直觉，不是定义）
> 把一条样本波形复制一份、在时间轴上平移 $\tau$，再与原件逐点相乘：两者越「同相」，乘积在**跨实现**上的平均就越大。注意：平移的是同一条样本函数，取平均时跨的却是不同随机实现。

<details class="lt-steps lt-bridge" id="concept-bridge-steps">
<summary>② 公式看不懂？逐个认符号，再看四步推导</summary>

定义（宽平稳、复过程）

$$
R_X(\tau)=E\big[X(t+\tau)X^*(t)\big]
$$

- $X(t)$：固定时刻 $t$ 的随机变量，不是某一条样本函数；
- $t+\tau$ 与 $t$：两个观察时刻，$\tau$ 是时间差；
- $X^*(t)$：复共轭；实过程共轭无影响，复过程漏掉共轭会改变结果；
- $E[\cdot]$：**集合平均**——固定两个时刻，把所有随机实现的乘积按概率加权平均。

四步：

1. 固定 $t$ 与 $t+\tau$，写下乘积 $X(t+\tau)X^*(t)$；
2. 对乘积取集合平均，得到二元函数 $R_X(t+\tau,t)$；
3. 若过程宽平稳（均值恒定、自相关只依赖时间差），记 $R_X(\tau)=R_X(t+\tau,t)$；
4. 不满足 WSS 时不能写成 $R_X(\tau)$，只能保留两个绝对时刻。

**必要条件**：$E\lvert X(t)\rvert^2<\infty$ 且二阶矩不依赖绝对时刻；否则「自相关」可能不存在或只有二元形式。若把单条记录的时间平均当成上面的 $E[\cdot]$，必须另加各态历经条件（见下一篇）。

[回到自相关卡](#concept-bridge-autocorrelation)
</details>

<details class="lt-steps lt-bridge" id="concept-bridge-deep">
<summary>③ 想去更深处：完整笔记与后续专题</summary>

- 完整推导与例子：[[vault-notes/random-signals/04-autocorrelation-autocovariance|自相关与自协方差（详细笔记）]]；
- 相关函数的性质与估计：[[vault-notes/random-signals/04-correlation-properties|相关函数的性质]]、[[vault-notes/random-signals/04-sample-correlation-estimation|样本相关函数估计]]；
- 后续主线：[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]（各态历经、维纳–辛钦、周期图/Welch）；
- 先建立「样本路径 vs 集合」的直观：[[interactive-labs/random-processes-lab|随机过程与样本函数实验]]。

[回到自相关卡](#concept-bridge-autocorrelation)
</details>

<details class="lt-steps lt-bridge" id="concept-bridge-expectation">
<summary>救命入口：数学期望到底是什么？（同页补一个前置，不必跳走）</summary>

期望就是**按概率加权的平均**：离散情形 $E[X]=\sum_k x_kP(X=x_k)$，连续情形 $E[X]=\int x f_X(x)\,\mathrm{d}x$。

两个小例子：

- 抛硬币型：$P(X=1)=P(X=-1)=1/2$，则 $E[X]=0$；单次观测当然不是 $0$，期望是**跨实现**的平均。
- 随机相位：$E[\cos(\omega_0t+\Theta)]=\frac{1}{2\pi}\int_0^{2\pi}\cos(\omega_0t+\theta)\,\mathrm{d}\theta=0$（§5 已算过这个积分），与 $t$ 无关。

**必要条件**：期望要存在（一阶矩有限，连续情形绝对可积）；要谈方差与自相关，还需要 $E\lvert X\rvert^2<\infty$。若期望不存在，后续所有「减去均值」的推导都不成立。

- 完整材料：[[vault-notes/random-signals/02-expectation-variance|数学期望与方差（详细笔记）]]；
- 主线对照：上方「3. 固定时刻的随机变量与集合平均」。

[回到自相关卡](#concept-bridge-autocorrelation)
</details>

<details class="lt-steps lt-bridge" id="concept-bridge-random-process">
<summary>救命入口：样本函数与集合平均分不清？（同页补一个前置）</summary>

两副面孔：固定时刻 $t$、变化实验编号 $\omega$，得到**随机变量** $X(t)$；固定一次实验 $\omega$、变化时间 $t$，得到**样本函数** $x(t)=X(t,\omega)$。

- **集合平均**：跨所有可能实现（不同 $\omega$）取平均——本文的 $E[\cdot]$、$\mu_X$、$R_X$ 都是这个意思；
- **时间平均**：沿一条样本函数对时间积分——它能不能代表集合平均，是**各态历经**要回答的问题，本文不假设它成立。

实验里的每条曲线都是一条样本函数；统计量是对所有曲线的平均。

- 完整材料：[[vault-notes/random-signals/03-definition-and-sample-functions|随机过程的定义与样本函数]]；
- 主线对照：上方「1. 一条曲线不是整个过程」与「3. 固定时刻的随机变量与集合平均」。

[回到自相关卡](#concept-bridge-autocorrelation)
</details>

> [!note] 为什么零延迟最大
> 由柯西–施瓦茨不等式，$\lvert E[X(t+\tau)X^*(t)]\rvert\le\sqrt{E\lvert X(t+\tau)\rvert^2\,E\lvert X(t)\rvert^2}=R_X(0)$。直观上，同一时刻的信号与自身最相似；延迟越大，相关性一般越弱（周期信号除外，它会在周期整数倍处恢复峰值）。

## 7. 深入阅读（扩展层，按需阅读）

下面三组内容有明确前置条件，初读可以跳过；需要时沿链接进入专门的推导。

### 7.1 条件高斯、MMSE 与卡尔曼滤波

**前置**：协方差矩阵、分块矩阵求逆（[[mathematics/linear-algebra-basics|线性代数基础]]）。若 $\mathbf{X}\sim N(\boldsymbol{\mu},\mathbf{\Sigma})$，则任意线性变换仍为高斯；给定 $\mathbf{X}_2$ 时 $\mathbf{X}_1$ 的条件分布仍是高斯，且

$$
E[\mathbf{X}_1\mid\mathbf{X}_2=\mathbf{x}_2]=\boldsymbol{\mu}_1+\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{x}_2-\boldsymbol{\mu}_2)
$$

$$
\mathrm{Cov}(\mathbf{X}_1\mid\mathbf{X}_2)=\mathbf{\Sigma}_{11}-\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}
$$

条件均值是观测的仿射函数（斜率即线性 MMSE 系数），条件协方差与观测值无关（所以卡尔曼增益可以预先算），Schur 补半正定保证「观测不会让方差变大」。这三条是卡尔曼滤波的代数骨架；完整的 MMSE/LMMSE 与卡尔曼推导见 [[signal-processing/statistical-estimation-filtering|统计估计与最优滤波]]，源笔记为 [[vault-notes/random-signals/02-gaussian-random-vectors|高斯随机变量与高斯向量]]。

### 7.2 复随机变量、proper 与圆对称

**前置**：复数的共轭与模（[[mathematics/complex-analysis|复变函数]]）。通信基带信号写作 $Z=I+jQ$，方差必须取共轭：

$$
\mathrm{Var}(Z)=E\big[\lvert Z-\mu_Z\rvert^2\big]=\mathrm{Var}(I)+\mathrm{Var}(Q)
$$

而 $E[(Z-\mu_Z)^2]$ 称为**伪方差** $P_Z$；对向量则是对应的伪协方差矩阵 $\mathbf{P}_Z$。三个概念要分开：

- **proper**：$P_Z=0$（向量：$\mathbf{P}_Z=\mathbf{0}$）。这是二阶条件；此时二阶统计只需均值与 Hermitian 协方差矩阵；
- **圆对称**：分布对任意旋转 $Z\mapsto Ze^{j\alpha}$ 不变，是完整分布的性质；
- **两者关系**：对复高斯，$P_Z=0$ 且 $\mu_Z=0$ 才等价于圆对称。若 $\mu_Z\ne0$，即使 $P_Z=0$，分布也只是绕 $\mu_Z$ 旋转不变；$Z$ 的相位并不均匀，只有中心化变量 $Z-\mu_Z$ 的相位均匀。对一般非高斯分布，$P_Z=0$ 只是二阶条件，推不出圆对称（例如 $Z$ 以 $1/3$ 概率取 $1,e^{j2\pi/3},e^{j4\pi/3}$，则 $\mu_Z=P_Z=0$，但分布只在 $2\pi/3$ 的旋转下不变）。

因此「proper 等价于圆对称」必须带上「复高斯 + 零均值」的条件；只给协方差而不说明是否 proper，一般会漏掉伪方差这一项信息。

对复高斯向量 $\mathbf{Z}\in\mathbb{C}^n$，完整二阶描述是均值、Hermitian 协方差与伪协方差

$$
\mathbf{R}_Z=E\big[(\mathbf{Z}-\boldsymbol{\mu})(\mathbf{Z}-\boldsymbol{\mu})^H\big],\qquad \mathbf{P}_Z=E\big[(\mathbf{Z}-\boldsymbol{\mu})(\mathbf{Z}-\boldsymbol{\mu})^T\big]
$$

线性变换下 $\mathbf{R}_Y=\mathbf{A}\mathbf{R}_Z\mathbf{A}^H$、$\mathbf{P}_Y=\mathbf{A}\mathbf{P}_Z\mathbf{A}^T$；两个复高斯块独立要求互协方差与互伪协方差同时为零（例如 $\mathbf{Z}_2=\mathbf{Z}_1^*$ 时互协方差为零，但互伪协方差非零，二者不独立）。

**口径**：若 $Z$ 零均值、proper，且 $E\lvert Z\rvert^2=N_0$，则 $I,Q$ 各分得 $N_0/2$；若 $Z$ 非圆，$I,Q$ 的功率一般不等，不能无条件各分一半。更细的推导见 [[vault-notes/random-signals/02-complex-random-variables|复随机变量]]。

### 7.3 各态历经与功率谱（下一篇）

本文讨论的都是**集合**意义下的统计量：对固定时刻、跨所有样本求平均。实际只能拿到一条有限长记录，于是产生两个不同的问题：

- **能否用一条记录的时间平均代替集合平均？** 这是各态历经要回答的估计条件；
- **二阶相关与功率谱是什么关系？** 这是维纳–辛钦定理的内容：它要求过程宽平稳，且 $R_X$ 可变换（绝对可积 $\int\lvert R_X(\tau)\rvert\,\mathrm{d}\tau<\infty$，或按广义谱/谱测度理解），**不要求各态历经**，也不要求严平稳。

这两件事都在 [[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]] 中展开：各态历经的具体含义、样本估计、维纳–辛钦、周期图与 Welch。再往后是 [[signal-processing/random-signals-through-systems|随机信号通过线性系统]]。

## 8. 自检：三个问题

先自己写答案，再对照文末「判断依据」；能答出前两题，基本概念就过关了。

1. **为什么一条观测曲线不能代表整个过程？** 如果只看一条曲线，会丢掉哪些信息？
2. **均值恒定为 $0$ 为什么不足以判定宽平稳？** 请给出一个反例，并指出它违反了 WSS 的哪一条。
3. **随机相位正弦的推导中，含 $2\Theta$ 的项为什么为零？** 如果把 $\Theta$ 改成在 $[0,\pi/2]$ 上均匀，均值还是常数吗？它还是 WSS 吗？

> [!question]- 判断依据（先独立思考再展开）
> 1. 过程是所有样本函数的族；一条曲线只是一个实现，无法给出跨实现的均值、方差与分布，也无法证明严格平稳——单条记录最多提供否证线索（例如样本统计随时间漂移）。只有集合统计量才对应过程本身。
> 2. 反例：$X(t)=\sigma(t)W(t)$，$W$ 为零均值单位方差白噪声、$\sigma(t)$ 随时间变化。均值恒为 $0$，但 $R_X(t_1,t_2)=\sigma(t_1)\sigma(t_2)\delta(t_1-t_2)$ 依赖绝对时刻、方差也随时间变化，违反「自相关只依赖时间差」。
> 3. $\int_0^{2\pi}\cos(\varphi+2\theta)\,\mathrm{d}\theta=0$，因为被积函数在区间上正好走两个完整周期。若 $\Theta\sim U[0,\pi/2]$，$E[\cos(\omega_0t+\Theta)]$ 是 $t$ 的函数（不再恒为 $0$），均值不恒定，因此不是 WSS。

## 9. 常见错误清单

- 把 $R_X(t_1,t_2)$ 直接写成 $R_X(t_1-t_2)$ 而不先验证宽平稳；把「增量平稳」说成「过程平稳」（泊松过程就是反例）。
- 认为「均值为零」等于「某条样本恒为零」，或把集合平均当成时间平均；用一条有限记录的相关函数图代替集合统计量，进而宣称过程平稳或各态历经。
- 把「严平稳」与「宽平稳」混用：前者约束全部有限维分布，后者只约束一、二阶矩；只有联合高斯过程（复情形还需 proper）在二阶矩有限时才等价。
- 对复过程省略共轭，或把伪方差 $E[Z^2]$ 当成方差，进而得出「复高斯方差为 0」的荒谬结论；把 proper 当成圆对称而不检查均值是否为零。
- 把调制、采样后的循环平稳信号硬套 WSS 公式：均匀载波相位只抹掉与载波相关的循环项，符号定时等结构未必消失。
- 高斯向量的「边缘都是高斯」被误当成「联合高斯」；忘记「不相关即独立」只对联合高斯成立。

## 10. 前置、依赖与下一步

- **前置**：[[mathematics/probability-overview|概率论概览]]（分布、期望方差、高斯与 Q 函数）、[[mathematics/linear-algebra-basics|线性代数基础]]（协方差矩阵、特征分解）、[[signal-processing/dft-and-fft|DFT 与 FFT]]（离散频率与分辨率）。

依赖关系（箭头表示「先理解前者，才谈得上后者」）：

| 关系 | 类型 | 说明 |
| --- | --- | --- |
| 定义与样本函数 → 一、二阶统计 | 概念前置 | 先能区分集合平均与时间平均，才谈估计 |
| 一、二阶统计 → 宽平稳 | 概念前置 | WSS 只是对均值与自相关的约束 |
| 宽平稳 → 维纳–辛钦 → 功率谱 | 定理适用条件 | WK 需要 WSS 的自相关可变换（绝对可积或广义谱），**不要求各态历经** |
| 宽平稳 + 各态历经 → 用时间平均估计 | 估计条件 | 各态历经是「单条记录能否代表集合」的条件，不是谱定理的前提 |
| 宽平稳 → 通过线性系统 → 输出统计 | 应用去向 | 见 [[signal-processing/random-signals-through-systems|随机信号通过线性系统]] |

- **下一步**：[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]——各态历经、样本估计、维纳–辛钦与谱估计；再往后是 [[signal-processing/random-signals-through-systems|随机信号通过线性系统]]、[[signal-processing/statistical-estimation-filtering|统计估计与最优滤波]]、[[signal-processing/signal-detection-theory|信号检测理论]]、[[signal-processing/random-signal-experiments|MATLAB 实验]]、[[signal-processing/random-signals-formula-sheet|公式速查]]。
- **动手**：[[interactive-labs/random-processes-lab|随机过程与样本函数实验]]——观察多条样本路径、固定时刻的分布、集合均值与方差。

## 11. 动手实验：把两副面孔放进同一张图

下面这个实验只有一条模型：$x_m(t)=A\cos(2\pi f_0t+\theta_m)$，$\theta_m\sim U[0,2\pi)$，每条路径抽样一次相位、沿时间固定。上半区是 $M$ 条样本路径与时刻游标，下半区是游标处的经验分布（$M$ 个取值）与反正弦理论密度。

<iframe class="lt-lab-frame" src="/static/lab/random-processes/" title="随机过程与样本函数交互实验" sandbox="allow-scripts allow-same-origin" loading="lazy"></iframe>

先预测再操作，最后解释：

1. 把 $M$ 从 8 加到 40：经验直方图更接近理论曲线，还是形状变了？波动来自哪里？
2. 只移动游标：分布形状为什么不变？集合均值与方差为什么每次略有不同？
3. 点一次「重新采样」：哪些量变了，哪些没变？这与你对「一次实验 = 一条样本函数」的理解一致吗？

实验的完整说明（控件、估计量定义、边界与推导）见 [[interactive-labs/random-processes-lab|实验页]]；它只做固定时刻的集合统计，不计算时间平均，因此不能用来证明各态历经——那条链路由下一篇接手。

## 来源与延伸阅读

- 符号与路线：[[vault-notes/random-signals/00-math-symbols|数学符号约定]]、[[vault-notes/random-signals/00-knowledge-map|知识地图]]。
- 随机过程基础：[[vault-notes/random-signals/03-definition-and-sample-functions|随机过程的定义与样本函数]]、[[vault-notes/random-signals/03-mean-and-correlation-functions|均值函数与相关函数]]、[[vault-notes/random-signals/03-strict-vs-wide-sense-stationary|严平稳与宽平稳]]、[[vault-notes/random-signals/03-gaussian-process-white-noise|高斯过程与白噪声]]、[[vault-notes/random-signals/03-cyclostationary-processes|循环平稳过程]]、[[vault-notes/random-signals/03-ergodicity|各态历经性]]。
- 概率与随机变量：[[vault-notes/random-signals/01-probability-basics|概率论基础]]、[[vault-notes/random-signals/01-random-variables-distributions|随机变量与概率分布]]、[[vault-notes/random-signals/02-expectation-variance|数学期望与方差]]、[[vault-notes/random-signals/02-covariance-correlation|协方差与相关系数]]、[[vault-notes/random-signals/02-gaussian-random-vectors|高斯随机变量与高斯向量]]、[[vault-notes/random-signals/02-complex-random-variables|复随机变量]]。

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