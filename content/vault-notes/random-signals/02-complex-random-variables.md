---
title: "复随机变量"
tags:
- 随机信号处理
- 02-随机变量与随机向量
- 复随机变量
- 圆对称
type: concept
subjects:
- 随机信号处理
- 概率论与数理统计
domains:
- 数学基础
- 随机信号
status: learning
aliases: []
prerequisites: []
related: []
---

# 复随机变量

> [!abstract] 这一节在讲什么
> 通信系统的基带模型几乎都用复信号：$Z=I+jQ$。本节定义复随机变量的均值、方差与协方差，说明"圆对称"与"proper"的含义，给出 proper 复高斯的密度与协方差结构，并用 IQ 不平衡说明非圆信号从哪里来。
> 核心结论：复方差是 $E[\lvert Z-\mu_Z\rvert^2]$，它等于 $I$、$Q$ 两路方差之和；proper 复高斯要求伪协方差 $E[(Z-\mu_Z)^2]=0$，此时 $I,Q$ 独立且方差相等，二阶统计只需一个 Hermitian 协方差矩阵。
> 用途：复基带噪声建模、IQ 不平衡分析、复向量白化、阵列信号处理。

## 一、复随机变量与矩

> [!info] 定义 10.1 复随机变量
> 设 $X,Y$ 为实随机变量，称 $Z=X+jY$ 为**复随机变量**，其中 $j=\sqrt{-1}$。
> 均值与方差定义为
> $$\mu_Z=E[Z]=E[X]+jE[Y],\qquad \mathrm{Var}(Z)=E\big[\lvert Z-\mu_Z\rvert^2\big]$$

| 量 | 定义 | 与 $I,Q$ 的关系 |
| --- | --- | --- |
| 均值 | $E[Z]$ | $E[I]+jE[Q]$ |
| 方差 | $E[\lvert Z-\mu_Z\rvert^2]$ | $\mathrm{Var}(I)+\mathrm{Var}(Q)$ |
| 二阶矩 | $E[\lvert Z\rvert^2]$ | $E[I^2]+E[Q^2]$ |
| 伪方差 | $E[(Z-\mu_Z)^2]$ | $\mathrm{Var}(I)-\mathrm{Var}(Q)+2j\mathrm{Cov}(I,Q)$ |
| 协方差 | $E[(Z_1-\mu_1)(Z_2-\mu_2)^{*}]$ | 含 $I,Q$ 的交叉项 |

> [!warning] 方差与伪方差是两回事
> 复随机变量的方差必须是 $E[\lvert Z-\mu_Z\rvert^2]$，它是非负实数；$E[(Z-\mu_Z)^2]$ 是复数，称为**伪方差**。
> 若误把伪方差当方差，会得到"零均值 proper 复高斯的方差为 0"这种自相矛盾的结论。记住：复数的"平方"会丢模长信息，必须取共轭。

> [!tip] 功率的两种口径
> 若 $I,Q$ 独立同分布 $N(0,\sigma^2)$，则 $E[\lvert Z\rvert^2]=2\sigma^2$。工程文档里说"复噪声功率为 $N_0$"时，通常指 $E[\lvert Z\rvert^2]=N_0$，对应每支路 $N_0/2$。
> 读写链路预算时先确认这个口径，否则信噪比会差 3 dB。

## 二、圆对称与 proper

> [!info] 定义 10.2 圆对称与 proper
> 若对任意 $\theta$，$e^{j\theta}Z$ 与 $Z$ 同分布，称 $Z$ **圆对称**（circularly symmetric）。
> 若只要求二阶统计满足 $E[(Z-\mu_Z)^2]=0$（零均值时即 $E[Z^2]=0$），称 $Z$ 为 **proper**（二阶圆对称）。
> 严格圆对称强于 proper；对零均值高斯分布，二者等价。

圆对称带来的直接后果是：$Z$ 的相位在 $[0,2\pi)$ 上均匀分布，且相位与幅度独立。因此复高斯噪声的相位不携带任何信息，接收机可以只关注幅度或投影方向。

| 概念 | 条件 | 含义 |
| --- | --- | --- |
| 圆对称 | $e^{j\theta}Z\overset{d}{=}Z$ | 分布旋转不变 |
| proper | $E[(Z-\mu_Z)^2]=0$ | 伪协方差为零 |
| 非圆 | 伪协方差不为零 | $I,Q$ 功率不等或相关 |
| 零均值高斯下 | 圆对称 $\Leftrightarrow$ proper | 二阶条件已足够 |

> [!warning] 实信号不是 proper 的特例
> 实随机变量可以看成虚部恒为 0 的复变量，其伪方差等于方差，通常不为零，因此是"非圆"的。
> 这正是复模型不能随便套用到实信号上的原因：对实信号，$E[Z^2]$ 与 $E[\lvert Z\rvert^2]$ 相等，协方差矩阵退化为实对称矩阵。

## 三、proper 复高斯的分布

> [!info] 定义 10.3 proper 复高斯
> 若 $Z\sim\mathcal{CN}(\mu,\sigma_Z^2)$，其密度为
> $$f_Z(z)=\frac{1}{\pi\sigma_Z^2}\exp\left(-\frac{\lvert z-\mu\rvert^2}{\sigma_Z^2}\right)$$
> 其中 $\sigma_Z^2=E[\lvert Z-\mu\rvert^2]$。实部与虚部独立，各服从 $N(\mathrm{Re}\,\mu,\sigma_Z^2/2)$ 与 $N(\mathrm{Im}\,\mu,\sigma_Z^2/2)$。

> [!example] 两路独立高斯的合成
> 设 $I,Q$ 独立同分布 $N(0,1)$，$Z=I+jQ$。则 $\mu_Z=0$，$\sigma_Z^2=2$，
> $$E[Z^2]=E[I^2]-E[Q^2]+2jE[IQ]=1-1+0=0$$
> 所以 $Z$ 是 proper 的，$Z\sim\mathcal{CN}(0,2)$。
> 反过来，若 $I\sim N(0,4)$、$Q\sim N(0,1)$，则 $E[Z^2]=3\ne0$，$Z$ 非圆，相位不再均匀，星座图会被"压扁"。

## 四、复随机向量与 Hermitian 协方差

> [!info] 定义 10.4 复随机向量
> 对复向量 $\mathbf{Z}=[Z_1,\dots,Z_n]^{T}$，协方差矩阵与伪协方差矩阵分别为
> $$\mathbf{R}_Z=E\big[(\mathbf{Z}-\boldsymbol{\mu})(\mathbf{Z}-\boldsymbol{\mu})^{H}\big],\qquad \mathbf{P}_Z=E\big[(\mathbf{Z}-\boldsymbol{\mu})(\mathbf{Z}-\boldsymbol{\mu})^{T}\big]$$
> $\mathbf{R}_Z$ 为 Hermitian 半正定矩阵，$\mathbf{P}_Z$ 为复对称矩阵。

| 对象 | 维数关系 | 性质 |
| --- | --- | --- |
| $\mathbf{R}_Z$ | $n\times n$ | Hermitian、半正定、对角元为非负实数 |
| $\mathbf{P}_Z$ | $n\times n$ | 复对称，proper 时为零矩阵 |
| 线性变换 | $\mathbf{Y}=\mathbf{A}\mathbf{Z}+\mathbf{b}$ | $\mathbf{R}_Y=\mathbf{A}\mathbf{R}_Z\mathbf{A}^{H}$ |
| 白化 | $\mathbf{W}=\mathbf{R}_Z^{-1/2}$ | 输出协方差为单位阵 |

> [!warning] proper 才能只用一个协方差矩阵
> 若 $\mathbf{P}_Z\ne\mathbf{0}$，仅靠 $\mathbf{R}_Z$ 无法完整描述二阶统计，需要同时给出 $\mathbf{R}_Z$ 与 $\mathbf{P}_Z$，等价于在实数域用 $2n\times2n$ 的协方差矩阵。
> 很多教科书默认信号 proper，做仿真时若加入了 IQ 不平衡却仍用 $\mathbf{R}_Z$ 建模，结果会与实测不符。

> [!tip] 复相关函数的共轭对称
> 宽平稳复过程的自相关定义为 $R_Z(\tau)=E[Z(t+\tau)Z^{*}(t)]$，满足 $R_Z(-\tau)=R_Z^{*}(\tau)$。
> 它的傅里叶变换 $S_Z(\omega)$ 是实函数且非负；若过程非 proper，还需要一个"伪谱"才能完整描述，这也是复循环平稳分析要引入补充谱的原因。

## 五、IQ 不平衡算例

> [!example] 增益不平衡导致非圆
> 设理想基带信号 $Z_0=I_0+jQ_0$ 为 proper，$I_0,Q_0$ 独立同分布 $N(0,1)$。接收机 I 路增益为 $1+\epsilon$，Q 路为 $1-\epsilon$，无相位误差，则
> $$Z=(1+\epsilon)I_0+j(1-\epsilon)Q_0$$
> 计算伪方差：
> $$E[Z^2]=(1+\epsilon)^2-(1-\epsilon)^2=4\epsilon$$
> 只要 $\epsilon\ne0$，$Z$ 就非圆；镜像抑制比近似为 $\mathrm{IMRR}\approx1/\epsilon^2$。
> 工程上 $\epsilon=1\%$ 对应约 $40$ dB 的镜像抑制，足以限制高阶 QAM 的误差矢量幅度。

## 关联

- 上一节：[[vault-notes/random-signals/02-gaussian-random-vectors]]
- 下一节：[[vault-notes/random-signals/03-definition-and-sample-functions]]
- 导航与记号：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/fpga/ad9361/iq-signals]]（复基带与 IQ 调制解调的工程实现）、[[vault-notes/math/complex-analysis/01-complex-numbers-functions]]（复数运算与共轭）、[[vault-notes/communication/03-random-processes]]（复随机过程与复 PSD）、[[vault-notes/communication/04-channel]]（复基带信道模型）
