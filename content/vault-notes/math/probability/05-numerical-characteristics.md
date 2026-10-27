---
title: "随机变量的数字特征"
tags:
- 数学
- 概率论
- 数字特征
type: course
subjects:
- 概率论与数理统计
domains:
- 数学基础
status: learning
aliases: []
prerequisites: []
related: []
---

> [!abstract] 本章在讲什么
> 分布函数和密度完整描述了随机变量，但工程上往往只关心几个"概括性指标"：平均多大、波动多大、两个变量是否同向变化。本章给出这些指标：
> - **1. 数学期望**：随机变量的"加权平均"；离散求和、连续积分；函数的期望与实际分布无关的捷径。
> - **2. 方差**：偏离均值的程度；$D(X)=E(X^2)-[E(X)]^2$ 是最常用的计算公式。
> - **3. 协方差与相关系数**：两个变量"同向/反向变化"的程度；$\rho$ 只测**线性**关联。
> - **4. 矩与协方差矩阵**：把期望、方差、协方差统一成矩的语言；随机向量的协方差矩阵。
> - **5. 常见分布的期望与方差**：一张表背完。
> - **6. 例题**：期望、方差、协方差、相关系数、投资组合。
>
> 一句话主线：**期望是一阶矩（位置），方差是二阶中心矩（离散程度），协方差/相关系数是二阶混合矩（线性关联）；它们只需要分布的低阶信息，却能概括工程上最关心的三件事。**

> [!note] 记号约定
> - $E(X)$：数学期望（mean/expectation）；$D(X)=\mathrm{Var}(X)$：方差（variance）
> - $\sigma_X=\sqrt{D(X)}$：标准差（standard deviation）
> - $\mathrm{Cov}(X,Y)$：协方差（covariance）；$\rho_{XY}$：相关系数（correlation coefficient）
> - $E(X^k)$：$k$ 阶原点矩；$E[(X-E(X))^k]$：$k$ 阶中心矩
> - $\boldsymbol{\Sigma}$：随机向量的协方差矩阵；$\boldsymbol{\mu}$：均值向量
> - 独立 ⇒ 不相关；不相关 ⇔ $\rho=0$ ⇔ $\mathrm{Cov}=0$

# 1. 数学期望

## 定义

> [!info] Def 1 数学期望
> - **离散型**：$P(X=x_k)=p_k$，若 $\sum_k|x_k|p_k<\infty$，则称
>   $$E(X)=\sum_{k}x_kp_k$$
>   为 $X$ 的**数学期望**（mathematical expectation）。
> - **连续型**：密度为 $f(x)$，若 $\int_{-\infty}^{+\infty}|x|f(x)\,\mathrm{d}x<\infty$，则称
>   $$E(X)=\int_{-\infty}^{+\infty}xf(x)\,\mathrm{d}x$$
>   为 $X$ 的数学期望。

**直观**：期望是"以概率为权的加权平均"，是随机变量取值的**重心**。它不一定等于某个可能取值（如骰子的期望是 3.5）。

> [!warning] 期望存在的条件
> 定义中的绝对收敛条件不能省。柯西分布 $f(x)=\frac{1}{\pi(1+x^2)}$ 的 $\int|x|f(x)dx$ 发散，因此**期望不存在**——虽然它的密度关于 0 对称，但不能说"期望为 0"。

## 随机变量函数的期望

> [!info] Def 2 函数的期望
> 若 $Y=g(X)$，则不必先求 $Y$ 的分布，可直接用 $X$ 的分布计算：
> - 离散型：$E[g(X)]=\sum_k g(x_k)p_k$
> - 连续型：$E[g(X)]=\int_{-\infty}^{+\infty}g(x)f(x)\,\mathrm{d}x$

这条性质极大简化了计算：**求 $E[g(X)]$ 时，只需要 $X$ 的分布，不需要 $g(X)$ 的分布**。

## 期望的性质

1. $E(C)=C$（常数）
2. $E(CX)=CE(X)$
3. $E(X+Y)=E(X)+E(Y)$（无需独立）
4. 若 $X,Y$ 独立，则 $E(XY)=E(X)E(Y)$
5. $E(aX+b)=aE(X)+b$
6. 若 $X\ge0$，则 $E(X)\ge0$；若 $X\le Y$，则 $E(X)\le E(Y)$

> [!important] 第 3 条与第 4 条的区别
> **加法无条件成立**：$E(X+Y)=E(X)+E(Y)$ 对任意 $X,Y$ 都成立。
> **乘法需要独立**：$E(XY)=E(X)E(Y)$ 一般只在独立时成立；不独立时差一个协方差项：
> $$E(XY)=E(X)E(Y)+\mathrm{Cov}(X,Y)$$

## 条件期望

> [!info] Def 3 条件期望
> 在 $Y=y$ 的条件下，$X$ 的**条件期望**为
> $$E(X\mid Y=y)=\begin{cases}\sum_i x_i\,P(X=x_i\mid Y=y),&\text{离散}\\ \int_{-\infty}^{+\infty}x\,f_{X\mid Y}(x\mid y)\,\mathrm{d}x,&\text{连续}\end{cases}$$

**全期望公式**：

$$E(X)=E\big[E(X\mid Y)\big]$$

即"先按 $Y$ 分组求平均，再对 $Y$ 求平均"。这是贝叶斯思想在期望上的体现，也是条件期望最重要的性质。

# 2. 方差

## 定义与计算公式

> [!info] Def 4 方差
> 称
> $$D(X)=E\left[(X-E(X))^2\right]$$
> 为 $X$ 的**方差**（variance），$\sigma_X=\sqrt{D(X)}$ 为**标准差**（standard deviation）。

**最常用的计算公式**：

$$D(X)=E(X^2)-[E(X)]^2$$

推导：$E[(X-\mu)^2]=E(X^2-2\mu X+\mu^2)=E(X^2)-2\mu^2+\mu^2=E(X^2)-\mu^2$。

> [!tip] 一句话记忆
> **方差 = 平方的期望 − 期望的平方**。计算时通常先算 $E(X)$ 与 $E(X^2)$，再相减。

## 方差的性质

1. $D(C)=0$
2. $D(CX)=C^2D(X)$
3. $D(X+C)=D(X)$
4. $D(aX+b)=a^2D(X)$
5. $D(X\pm Y)=D(X)+D(Y)\pm2\mathrm{Cov}(X,Y)$
6. 若 $X,Y$ 独立，则 $D(X\pm Y)=D(X)+D(Y)$

> [!warning] 方差不满足线性
> $D(X+Y)\ne D(X)+D(Y)$，除非 $X,Y$ 不相关。一般情形要加上（或减去）$2\mathrm{Cov}(X,Y)$。这是很多计算错误的来源。

## 标准化

若 $X$ 的期望为 $\mu$、方差为 $\sigma^2>0$，则

$$Z=\frac{X-\mu}{\sigma}$$

满足 $E(Z)=0$、$D(Z)=1$，称为 $X$ 的**标准化变量**。第 3 章的正态标准化就是它的特例。

# 3. 协方差与相关系数

## 协方差

> [!info] Def 5 协方差
> 称
> $$\mathrm{Cov}(X,Y)=E\big[(X-E(X))(Y-E(Y))\big]$$
> 为 $X$ 与 $Y$ 的**协方差**（covariance）。

**计算公式**：

$$\mathrm{Cov}(X,Y)=E(XY)-E(X)E(Y)$$

**性质**：

1. $\mathrm{Cov}(X,X)=D(X)$
2. $\mathrm{Cov}(X,Y)=\mathrm{Cov}(Y,X)$
3. $\mathrm{Cov}(aX+b,cY+d)=ac\,\mathrm{Cov}(X,Y)$
4. $\mathrm{Cov}(X_1+X_2,Y)=\mathrm{Cov}(X_1,Y)+\mathrm{Cov}(X_2,Y)$
5. 若 $X,Y$ 独立，则 $\mathrm{Cov}(X,Y)=0$；反之不成立

## 相关系数

> [!info] Def 6 相关系数
> 若 $D(X)>0$、$D(Y)>0$，称
> $$\rho_{XY}=\frac{\mathrm{Cov}(X,Y)}{\sqrt{D(X)}\sqrt{D(Y)}}$$
> 为 $X$ 与 $Y$ 的**相关系数**（correlation coefficient）。

**核心性质**：

1. $|\rho_{XY}|\le1$
2. $|\rho_{XY}|=1$ ⇔ $X$ 与 $Y$ **以概率 1 线性相关**：存在 $a\ne0,b$ 使 $P(Y=aX+b)=1$
3. $\rho_{XY}>0$：正相关；$\rho_{XY}<0$：负相关；$\rho_{XY}=0$：**不相关**
4. $\rho$ 只衡量**线性**关联，不衡量一般依赖关系

> [!info] Def 7 不相关
> 若 $\rho_{XY}=0$（等价于 $\mathrm{Cov}(X,Y)=0$），则称 $X$ 与 $Y$ **不相关**（uncorrelated）。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 300" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <line x1="60.0" y1="150.0" x2="240.0" y2="150.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <line x1="150.0" y1="70.0" x2="150.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <ellipse cx="150.0" cy="150.0" rx="70.0" ry="22.0" transform="rotate(-45 150.0 150.0)" fill="#dc2626" fill-opacity="0.18" stroke="#dc2626" stroke-width="1.8"/>
  <text x="150.0" y="270.0" text-anchor="middle" font-size="13" fill="#dc2626" font-weight="600">ρ = −0.8</text>
  <line x1="300.0" y1="150.0" x2="480.0" y2="150.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <line x1="390.0" y1="70.0" x2="390.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <ellipse cx="390.0" cy="150.0" rx="55.0" ry="55.0" transform="rotate(0 390.0 150.0)" fill="var(--text-muted,#57606a)" fill-opacity="0.18" stroke="var(--text-muted,#57606a)" stroke-width="1.8"/>
  <text x="390.0" y="270.0" text-anchor="middle" font-size="13" fill="var(--text-muted,#57606a)" font-weight="600">ρ = 0</text>
  <line x1="540.0" y1="150.0" x2="720.0" y2="150.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <line x1="630.0" y1="70.0" x2="630.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <ellipse cx="630.0" cy="150.0" rx="70.0" ry="22.0" transform="rotate(45 630.0 150.0)" fill="#059669" fill-opacity="0.18" stroke="#059669" stroke-width="1.8"/>
  <text x="630.0" y="270.0" text-anchor="middle" font-size="13" fill="#059669" font-weight="600">ρ = 0.8</text>
  <text x="380.0" y="24.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">相关系数只衡量线性关联：椭圆越扁、越倾斜，|ρ| 越大</text>
</svg>

> [!warning] 不相关 ≠ 独立
> **独立 ⇒ 不相关**，但**不相关 ⇏ 独立**。
> 经典反例：$X\sim U(-1,1)$，$Y=X^2$。显然 $Y$ 完全由 $X$ 决定，两者不独立；但
> $$E(XY)=E(X^3)=0,\quad E(X)=0,\quad E(Y)=E(X^2)=1/3$$
> 故 $\mathrm{Cov}(X,Y)=0$，即**不相关**。
> 唯一例外：**二维正态**中，不相关 ⇔ 独立（第 4 章）。

# 4. 矩与协方差矩阵

## 矩

> [!info] Def 8 原点矩与中心矩
> - **$k$ 阶原点矩**：$E(X^k)$，$k=1,2,\dots$
> - **$k$ 阶中心矩**：$E[(X-E(X))^k]$，$k=2,3,\dots$
> - 一阶原点矩是期望，二阶中心矩是方差。

## 协方差矩阵

> [!info] Def 9 协方差矩阵
> 对随机向量 $\mathbf{X}=(X_1,\dots,X_n)^T$，称
> $$\boldsymbol{\Sigma}=\big[\mathrm{Cov}(X_i,X_j)\big]_{n\times n}$$
> 为 $\mathbf{X}$ 的**协方差矩阵**（covariance matrix）。

**性质**：

1. $\boldsymbol{\Sigma}$ 对称：$\mathrm{Cov}(X_i,X_j)=\mathrm{Cov}(X_j,X_i)$
2. $\boldsymbol{\Sigma}$ 半正定：对任意常向量 $\mathbf{a}$，$\mathbf{a}^T\boldsymbol{\Sigma}\mathbf{a}=D(\mathbf{a}^T\mathbf{X})\ge0$
3. 若各分量两两不相关，则 $\boldsymbol{\Sigma}$ 为对角矩阵
4. 对线性变换 $\mathbf{Y}=A\mathbf{X}+\mathbf{b}$，有
   $$\boldsymbol{\Sigma}_Y=A\boldsymbol{\Sigma}_XA^T$$

> [!tip] 为什么通信里天天见协方差矩阵
> MIMO 信道的空间相关性、阵列天线的接收协方差、卡尔曼滤波的误差协方差、主成分分析（PCA）的协方差矩阵——全部是这一个对象。**协方差矩阵的对角线是各分量方差，非对角线是两两协方差。**

# 5. 常见分布的期望与方差

| 分布 | 记号 | $E(X)$ | $D(X)$ |
| --- | --- | --- | --- |
| 0-1 分布 | $B(1,p)$ | $p$ | $p(1-p)$ |
| 二项分布 | $B(n,p)$ | $np$ | $np(1-p)$ |
| 泊松分布 | $P(\lambda)$ | $\lambda$ | $\lambda$ |
| 几何分布 | $G(p)$ | $\dfrac{1}{p}$ | $\dfrac{1-p}{p^2}$ |
| 均匀分布 | $U(a,b)$ | $\dfrac{a+b}{2}$ | $\dfrac{(b-a)^2}{12}$ |
| 指数分布 | $E(\lambda)$ | $\dfrac{1}{\lambda}$ | $\dfrac{1}{\lambda^2}$ |
| 正态分布 | $N(\mu,\sigma^2)$ | $\mu$ | $\sigma^2$ |
| 卡方分布 | $\chi^2(n)$ | $n$ | $2n$ |
| 伽马分布 | $\Gamma(\alpha,\beta)$ | $\dfrac{\alpha}{\beta}$ | $\dfrac{\alpha}{\beta^2}$ |
| 瑞利分布 | $R(\sigma)$ | $\sigma\sqrt{\dfrac{\pi}{2}}$ | $\left(2-\dfrac{\pi}{2}\right)\sigma^2$ |
| 拉普拉斯分布 | $\mathrm{Lap}(\mu,b)$ | $\mu$ | $2b^2$ |

> [!important] 三个最该记住的
> - **泊松**：期望 = 方差 = $\lambda$（这是泊松分布的标志性特征）
> - **指数**：期望 = 标准差 = $1/\lambda$
> - **正态**：参数 $\mu,\sigma^2$ 就是期望与方差，别无他物

> [!example] 二项分布的期望与方差
> 设 $X\sim B(n,p)$，令 $X_i$ 为第 $i$ 次试验是否成功（$B(1,p)$），则 $X=\sum_{i=1}^nX_i$，且 $X_i$ 独立。
> $$E(X)=\sum E(X_i)=np,\qquad D(X)=\sum D(X_i)=np(1-p)$$
> 这里用了"独立时方差可加"——比直接对二项分布求和简单得多。

> [!example] 瑞利分布的期望与方差
> $$E(R)=\int_0^\infty r\cdot\frac{r}{\sigma^2}e^{-r^2/(2\sigma^2)}\,\mathrm{d}r=\sigma\sqrt{\frac{\pi}{2}}$$
> $$E(R^2)=\int_0^\infty r^2\cdot\frac{r}{\sigma^2}e^{-r^2/(2\sigma^2)}\,\mathrm{d}r=2\sigma^2$$
> $$D(R)=E(R^2)-[E(R)]^2=\left(2-\frac{\pi}{2}\right)\sigma^2$$
> 这两个结果在第 3 章已经用过，现在可以用期望/方差的语言重新表述。

# 6. 例题

> [!example] 例 1：离散型期望与方差
> 设 $X$ 的分布律为 $P(X=-1)=0.2$、$P(X=0)=0.3$、$P(X=1)=0.5$。
> $$E(X)=(-1)(0.2)+0(0.3)+1(0.5)=0.3$$
> $$E(X^2)=1(0.2)+0(0.3)+1(0.5)=0.7$$
> $$D(X)=0.7-0.3^2=0.61$$

> [!example] 例 2：连续型函数的期望
> 设 $X\sim U(0,1)$，求 $E(X^2)$ 与 $D(X)$。
> $$E(X)=\frac12,\qquad E(X^2)=\int_0^1x^2\,\mathrm{d}x=\frac13$$
> $$D(X)=\frac13-\frac14=\frac1{12}$$
> 与均匀分布公式 $\frac{(b-a)^2}{12}=\frac1{12}$ 一致。

> [!example] 例 3：协方差与相关系数
> 设 $(X,Y)$ 的联合分布为
>
> | $X\backslash Y$ | 0 | 1 |
> | --- | --- | --- |
> | 0 | 0.2 | 0.3 |
> | 1 | 0.3 | 0.2 |
>
> 求 $\mathrm{Cov}(X,Y)$ 与 $\rho_{XY}$。
> $E(X)=0.5$，$E(Y)=0.5$，$E(XY)=1\times0.2=0.2$。
> $$\mathrm{Cov}(X,Y)=0.2-0.5\times0.5=-0.05$$
> $D(X)=0.5-0.25=0.25$，$D(Y)=0.25$，故
> $$\rho_{XY}=\frac{-0.05}{0.5\times0.5}=-0.2$$
> 负相关：$X$ 大时 $Y$ 倾向于小。

> [!example] 例 4：投资组合的方差
> 两项资产收益率 $X,Y$，$D(X)=0.04$、$D(Y)=0.09$、$\rho=0.3$。组合 $Z=0.6X+0.4Y$，求 $D(Z)$。
> $$D(Z)=0.6^2(0.04)+0.4^2(0.09)+2(0.6)(0.4)(0.3)(0.2)(0.3)$$
> 其中 $\mathrm{Cov}(X,Y)=\rho\sigma_X\sigma_Y=0.3\times0.2\times0.3=0.018$。
> $$D(Z)=0.0144+0.0144+0.00864=0.03744$$
> 组合方差小于两项方差的加权平均（$0.6^2\cdot0.04+0.4^2\cdot0.09=0.0288$ 再加协方差项）——**分散化降低风险**的数学表述。

> [!example] 例 5：二维正态的条件期望
> 设 $(X,Y)\sim N(\mu_1,\mu_2;\sigma_1^2,\sigma_2^2;\rho)$，则
> $$E(X\mid Y=y)=\mu_1+\rho\frac{\sigma_1}{\sigma_2}(y-\mu_2)$$
> 这是 $y$ 的线性函数；$\rho=0$ 时条件期望恒为 $\mu_1$，即 $Y$ 不提供关于 $X$ 的任何线性信息。

> [!tip] 本章收官
> 本章把分布的"低阶信息"提炼成四个数：
> 1. **期望**（1）：位置，一阶原点矩；加法无条件，乘法要独立。
> 2. **方差**（2）：离散程度，二阶中心矩；$D(X)=E(X^2)-[E(X)]^2$。
> 3. **协方差/相关系数**（3）：线性关联；$\rho$ 只测线性，不相关 ≠ 独立。
> 4. **矩与协方差矩阵**（4）：统一语言；随机向量的协方差矩阵是 MIMO、PCA、卡尔曼滤波的核心对象。
> 5. **常见分布表**（5）：泊松的期望=方差、指数的期望=标准差、正态的参数就是期望/方差。
>
> 一句话：**期望看位置，方差看波动，协方差看同向，矩看整体形状；它们只需要低阶信息，却能概括工程上最关心的三件事。**

# 本章知识地图

```
数字特征
├─ 1. 数学期望
│     ├─ 离散 E=Σx_k p_k；连续 E=∫xf(x)dx
│     ├─ 函数的期望 E[g(X)]=Σg p 或 ∫gf
│     ├─ 性质：线性无条件；E(XY)=E(X)E(Y)（独立）
│     └─ 条件期望与全期望公式
│
├─ 2. 方差
│     ├─ D=E[(X−E(X))²]=E(X²)−[E(X)]²
│     ├─ D(aX+b)=a²D(X)
│     ├─ D(X±Y)=D(X)+D(Y)±2Cov
│     └─ 标准化 Z=(X−μ)/σ
│
├─ 3. 协方差与相关系数
│     ├─ Cov=E(XY)−E(X)E(Y)
│     ├─ ρ=Cov/(σ_Xσ_Y)，|ρ|≤1
│     ├─ |ρ|=1 ⇔ 线性关系
│     └─ 独立 ⇒ 不相关；不相关 ⇏ 独立
│
├─ 4. 矩与协方差矩阵
│     ├─ k 阶原点矩 / 中心矩
│     ├─ Σ=[Cov(X_i,X_j)]
│     ├─ 对称、半正定
│     └─ 线性变换 Σ_Y=AΣ_XAᵀ
│
├─ 5. 常见分布表
│     ├─ 0-1 / 二项 / 泊松 / 几何
│     ├─ 均匀 / 指数 / 正态
│     └─ 卡方 / 伽马 / 瑞利 / 拉普拉斯
│
└─ 6. 例题
      ├─ 期望与方差计算
      ├─ 协方差/相关系数
      ├─ 投资组合方差
      └─ 二维正态条件期望
```

# 关联

- 上一章：[[vault-notes/math/probability/04-multivariate-random-variables]] —— 联合分布、边缘、条件、独立性
- 下一章：[[vault-notes/math/probability/06-law-of-large-numbers-clt]] —— 用期望/方差刻画"大量重复试验"的极限行为

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 期望、方差 | [[vault-notes/math/probability/06-law-of-large-numbers-clt]] 的切比雪夫不等式与大数定律 |
| 协方差、相关系数 | [[vault-notes/math/probability/04-multivariate-random-variables]] 的二维正态 $\rho$；[[vault-notes/math/probability/07-samples-sampling-distributions]] 的样本协方差 |
| 协方差矩阵 | MIMO、PCA、卡尔曼滤波；[[vault-notes/5g/phy/04-physical-channels-signals]] 的空间相关 |
| 全期望公式 | 贝叶斯估计、条件期望；[[vault-notes/math/probability/08-parameter-estimation]] 的最小方差估计 |
| 常见分布表 | [[vault-notes/math/probability/07-samples-sampling-distributions]] 的抽样分布；[[vault-notes/math/probability/08-parameter-estimation]] 的区间估计 |

**本章留下的三个悬念（第 6 章结清）**：

| 本章的悬念 | 第 6 章的答案 |
| --- | --- |
| 期望和方差能不能用来估计"样本均值偏离总体均值"的概率？ | 切比雪夫不等式：$P(\lvert X-\mu\rvert\ge\varepsilon)\le\sigma^2/\varepsilon^2$ |
| 大量独立重复试验的样本均值会稳定到期望吗？ | 大数定律：样本均值依概率收敛到期望 |
| 大量独立随机变量之和的分布长什么样？ | 中心极限定理：近似正态，与原始分布无关 |

**通信方向应用**：

- [[vault-notes/communication/03-random-processes]] —— 均值、方差、自相关、功率谱密度都是随机过程的"数字特征"；平稳过程的均值/方差是常数。
- [[vault-notes/communication/04-channel]] —— 信道容量、信噪比、噪声功率都用期望/方差描述。
- [[vault-notes/communication/09-optimal-reception]] —— 判决统计量的均值与方差决定误码率；匹配滤波最大化输出信噪比。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— MIMO 信道协方差矩阵、波束赋形的空间相关、信道估计的均方误差。
- [[vault-notes/matlab/matlab-notes]] —— `mean`/`var`/`cov`/`corrcoef`/`mvnrnd` 是本章的直接工具。

**相关**：[[vault-notes/math/probability/04-multivariate-random-variables]]｜[[vault-notes/math/probability/06-law-of-large-numbers-clt]]｜[[vault-notes/communication/03-random-processes]]｜[[vault-notes/matlab/matlab-notes]]
