---
title: "均值函数与相关函数"
tags:
- 随机信号处理
- 03-随机过程基础
- 数字特征
- 相关函数
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

# 均值函数与相关函数

> [!abstract] 这一节在讲什么
> 有限维分布太难用，工程上改用几个“概括性指标”来描述随机过程：均值函数说明信号的中心随时间的走向，相关函数说明两个时刻的波形有多像，方差函数说明围绕中心的起伏有多大。
> 本节给出这四个量的定义、相互关系与基本性质，并强调平均功率 $R_X(0)$ 与“去均值”的区别；它们是后续平稳性、各态历经和功率谱的共同语言。

## 一、均值函数

> [!info] 定义 1 均值函数
> 对每个固定时刻 $t$，随机变量 $X(t)$ 的数学期望
> $$
> \mu_X(t)=E[X(t)]=\int_{-\infty}^{\infty}x\,f_X(x;t)\,\mathrm{d}x
> $$
> 称为随机过程的**均值函数**。离散情形把积分换成求和。

均值函数是**集合平均**：在同一时刻对所有样本函数取值求加权平均，结果是一条确定的曲线。它满足期望的线性性：$E[aX(t)+b]=a\mu_X(t)+b$，$E[X(t)+Y(t)]=\mu_X(t)+\mu_Y(t)$，且加法不需要独立性。

> [!tip] 均值不是“典型样本”
> 随机相位正弦的均值恒为 $0$，但每条样本函数都在振荡。“均值为零”只说明正负半周在集合意义上抵消，不说明某一次观测恒等于零。

## 二、自相关与自协方差

> [!info] 定义 2 自相关与自协方差
> 同一过程在两个时刻的联合二阶矩
> $$
> R_X(t_1,t_2)=E\big[X(t_1)X^*(t_2)\big]
> $$
> 称为**自相关函数**；去均值后的版本
> $$
> C_X(t_1,t_2)=\mathrm{Cov}\big(X(t_1),X(t_2)\big)=E\big[(X(t_1)-\mu_X(t_1))(X(t_2)-\mu_X(t_2))^*\big]
> $$
> 称为**自协方差函数**。两者关系为
> $$
> C_X(t_1,t_2)=R_X(t_1,t_2)-\mu_X(t_1)\mu_X^*(t_2)
> $$

常用二阶量可以排成一张表：

| 名称 | 记号 | 定义 | 物理含义 |
| --- | --- | --- | --- |
| 均值函数 | $\mu_X(t)$ | $E[X(t)]$ | 集合平均的中心 |
| 方差函数 | $\sigma_X^2(t)$ | $\mathrm{Var}[X(t)]$ | 围绕中心的起伏功率 |
| 自相关 | $R_X(t_1,t_2)$ | $E[X(t_1)X^*(t_2)]$ | 含直流的相似程度 |
| 自协方差 | $C_X(t_1,t_2)$ | $R_X-\mu_X(t_1)\mu_X^*(t_2)$ | 去直流后的相似程度 |
| 归一化相关 | $\rho_X(t_1,t_2)$ | $C_X/(\sigma_X(t_1)\sigma_X(t_2))$ | 无量纲的线性相关度 |

特别地，令 $t_1=t_2=t$，得到 $\sigma_X^2(t)=C_X(t,t)=R_X(t,t)-\lvert\mu_X(t)\rvert^2$。

## 三、基本性质

> [!info] 定义 3 自相关函数的四条基本性质
> 1. **共轭对称**：$R_X(t_1,t_2)=R_X^*(t_2,t_1)$，$C_X$ 同理。
> 2. **对角非负**：$R_X(t,t)=E[\lvert X(t)\rvert^2]\ge0$，且为实数。
> 3. **柯西–施瓦茨界**：$\lvert R_X(t_1,t_2)\rvert^2\le R_X(t_1,t_1)R_X(t_2,t_2)$。
> 4. **非负定**：对任意 $n$、任意时刻 $t_i$ 与任意复数 $a_i$，
> $$
> \sum_{i=1}^{n}\sum_{j=1}^{n}a_i a_j^*R_X(t_i,t_j)\ge0
> $$

第四条来自 $E\big[\lvert\sum_i a_iX(t_i)\rvert^2\big]\ge0$，它比前三条更强：任意采样的相关矩阵都必须是半正定的。反过来，满足非负定的函数才能成为某个过程的自相关函数。

> [!warning] 容易混淆的两件事
> $R_X(t_1,t_2)$ 是“二阶矩”，不是“相关系数”，它的量纲是功率，取值可以远大于 $1$。只有归一化的 $\rho_X$ 才满足 $\lvert\rho_X\rvert\le1$。另外，非负定要求对**任意有限个时刻**成立，只检查 $2\times2$ 矩阵不够。

## 四、平均功率与去均值

> [!info] 定义 4 平均功率
> 过程在时刻 $t$ 的平均功率定义为
> $$
> P_X(t)=E\big[\lvert X(t)\rvert^2\big]=R_X(t,t)
> $$
> 它可分解为直流功率与交流功率：
> $$
> P_X(t)=\lvert\mu_X(t)\rvert^2+\sigma_X^2(t)
> $$

对宽平稳过程，$P_X=R_X(0)$ 与时间无关，且 $C_X(0)=\sigma_X^2=R_X(0)-\lvert\mu_X\rvert^2$。因此“自相关”与“自协方差”只差一个常数 $\lvert\mu_X\rvert^2$；若过程均值为零，两者完全相同。

> [!tip] 什么时候必须去均值
> 观察波形的**起伏结构**、做谱估计、算相关系数、判断白噪声时，应先去掉均值或趋势。否则直流分量会在 $R_X(\tau)$ 中产生一个不衰减的平台，掩盖慢变的相关结构，也会在功率谱上形成一根 $\omega=0$ 的谱线。

## 五、算例与运算规则

> [!example] 例 信号加噪声
> 设 $X(t)=B+A\cos(\omega_0t+\Theta)+N(t)$，其中 $B,A,\omega_0$ 为常数，$\Theta\sim U[0,2\pi)$，$N(t)$ 是零均值宽平稳噪声，且与 $\Theta$ 独立，$R_N(\tau)=\sigma_N^2e^{-\alpha\lvert\tau\rvert}$。则
> $$
> \mu_X(t)=B
> $$
> $$
> R_X(t_1,t_2)=B^2+\frac{A^2}{2}\cos\omega_0(t_1-t_2)+\sigma_N^2e^{-\alpha\lvert t_1-t_2\rvert}
> $$
> $$
> C_X(t_1,t_2)=\frac{A^2}{2}\cos\omega_0(t_1-t_2)+\sigma_N^2e^{-\alpha\lvert t_1-t_2\rvert}
> $$
> 平均功率为 $B^2+A^2/2+\sigma_N^2$。可见 $R_X$ 把直流、周期分量与噪声的相关结构叠加在一起。

| 运算 | 均值函数 | 自相关函数 | 说明 |
| --- | --- | --- | --- |
| 加常数 $c$ | $\mu_X+c$ | $R_X+c\mu_X^*+c^*\mu_X+\lvert c\rvert^2$ | 协方差不变 |
| 乘常数 $a$ | $a\mu_X$ | $\lvert a\rvert^2R_X$ | 功率按 $\lvert a\rvert^2$ 缩放 |
| 与独立零均值过程相加 | $\mu_X+\mu_Y$ | $R_X+R_Y$ | 互相关项为零 |
| 与确定性信号 $s(t)$ 相加 | $\mu_X+s$ | $R_X+R_s+R_{Xs}+R_{sX}$ | 一般不能直接相加 |

> [!warning] 不相关相加仍可能留下交叉项
> 若 $X,Y$ 不相关但均值非零，则 $R_{X+Y}=R_X+R_Y+2\mathrm{Re}(\mu_X\mu_Y^*)$。只有两者都零均值时，才有简单的 $R_{X+Y}=R_X+R_Y$。

## 六、作业题解析

> [!note] 题目来源
> 本节收录课程作业第 2 组（随机过程 1–5 题）中与本篇相关的题目，原始截图见 作业截图。解析按“读题 → 判据 → 推导 → 易错点”展开，记号与正文一致。

### 题 3 · 独立高斯振幅谐波叠加的均值与自相关

> [!example] 题目
> 设随机过程 $X(t)=\sum_{k=1}^{p}A_k\cos(\omega_kt)$，其中 $A_k\ (k=1,\dots,p)$ 分别服从 $N(0,\sigma_k^2)$ 且相互独立，$\omega_k\ (k=1,\dots,p)$ 是常数。试求该随机过程的均值和自相关函数，并判断该随机过程是否平稳。

**解**：

（1）均值。期望是线性运算，求均值不需要独立性：
$$
\mu_X(t)=E\left[\sum_{k=1}^{p}A_k\cos\omega_kt\right]=\sum_{k=1}^{p}E[A_k]\cos\omega_kt=0
$$
它与 $t$ 无关，满足平稳的必要条件之一。

（2）自相关。按定义展开乘积：
$$
R_X(t_1,t_2)=E\left[\sum_{k=1}^{p}A_k\cos\omega_kt_1\cdot\sum_{j=1}^{p}A_j\cos\omega_jt_2\right]=\sum_{k=1}^{p}\sum_{j=1}^{p}E[A_kA_j]\cos\omega_kt_1\cos\omega_jt_2
$$
$A_k$ 相互独立且零均值，故 $k\ne j$ 的交叉项为零，只剩对角项：
$$
E[A_kA_j]=0\ (k\ne j),\qquad E[A_k^2]=\sigma_k^2\ \Longrightarrow\ R_X(t_1,t_2)=\sum_{k=1}^{p}\sigma_k^2\cos\omega_kt_1\cos\omega_kt_2
$$
用积化和差 $2\cos\omega_kt_1\cos\omega_kt_2=\cos\omega_k(t_1-t_2)+\cos\omega_k(t_1+t_2)$，记 $\tau=t_1-t_2$：
$$
R_X(t_1,t_2)=\frac12\sum_{k=1}^{p}\sigma_k^2\cos\omega_k\tau+\frac12\sum_{k=1}^{p}\sigma_k^2\cos\omega_k(t_1+t_2)
$$

（3）平稳性判断。$R_X$ 分成两块：第一块只依赖 $\tau$，第二块依赖 $t_1+t_2$。只要某个 $\sigma_k^2>0$ 且 $\omega_k\ne0$，第二块就随 $t_1+t_2$ 变化，$R_X(t_1,t_2)$ 不能写成 $R_X(\tau)$，所以过程**一般不是宽平稳的**。最直接的证据是令 $t_1=t_2=t$，得平均功率
$$
R_X(t,t)=\sum_{k=1}^{p}\sigma_k^2\cos^2\omega_kt=\frac12\sum_{k=1}^{p}\sigma_k^2+\frac12\sum_{k=1}^{p}\sigma_k^2\cos2\omega_kt
$$
它本身随 $t$ 起伏，而平稳过程的功率必须是常数。即使只有一项（$p=1$、振幅随机而相位固定的单频正弦）也如此，说明非平稳与项数无关，根源是相位固定、时间原点有绝对意义。

（4）它属于哪一类。若所有 $\omega_k$ 都是同一个 $\omega_0$ 的整数倍（更一般地，互成有理数倍），第二块是 $t_1+t_2$ 的周期函数，代回 $t_1=t$、$t_2=t+\tau$ 后 $R_X(t,t+\tau)$ 对 $t$ 以 $\pi/\omega_0$ 为周期变化，过程是**循环平稳**的，见 [[vault-notes/random-signals/03-cyclostationary-processes]]。若把相位也随机化，即 $X(t)=\sum_k A_k\cos(\omega_kt+\Theta_k)$、$\Theta_k$ 独立均匀分布于 $[0,2\pi)$，则对相位取平均使第二块为零，只剩
$$
R_X(\tau)=\frac12\sum_{k=1}^{p}\sigma_k^2\cos\omega_k\tau
$$
此时过程退化为宽平稳过程。

**答**：$\mu_X(t)=0$；$R_X(t_1,t_2)=\frac12\sum_k\sigma_k^2\cos\omega_k(t_1-t_2)+\frac12\sum_k\sigma_k^2\cos\omega_k(t_1+t_2)$。由于后一块依赖 $t_1+t_2$，过程一般**不平稳**；频率互成有理数倍时为循环平稳，随机相位平均后退化为宽平稳。

> [!warning] 易错点
> 1. 只看到 $R_X$ 中第一块 $\cos\omega_k\tau$ 就写“只与时间差有关，故 WSS”，漏掉 $t_1+t_2$ 的第二块，这是本题最常见的失分点。判断 WSS 必须把整个 $R_X(t_1,t_2)$ 化成只含 $\tau$ 的形式。
> 2. 交叉项为零靠的是“相互独立 + 零均值”同时成立。若均值非零，交叉项贡献 $\sum_{k\ne j}\mu_k\mu_j\cos\omega_kt_1\cos\omega_jt_2$，相关函数不再是上面的形式。
> 3. 不要指望“多叠几项”把非平稳性平均掉：只要 $\omega_k$ 固定，$t_1+t_2$ 项就存在；真正能消掉它的是随机相位，而不是项数。
> 4. 非平稳不等于“毫无规律”：这里的规律是二阶统计随 $t$ 周期变化，应归入循环平稳，不能直接套 $R_X(\tau)$ 与功率谱的平稳结论。

## 关联

- 上一节：[[vault-notes/random-signals/03-definition-and-sample-functions]]
- 下一节：[[vault-notes/random-signals/03-strict-vs-wide-sense-stationary]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/05-numerical-characteristics]]、[[vault-notes/communication/03-random-processes]]、[[vault-notes/communication/02-deterministic-signals]]、[[vault-notes/fpga/ad9361/iq-signals]]
