---
title: 概率论概览
description: 从概率公理、条件概率与贝叶斯到随机变量、数字特征、大数定律与中心极限定理：噪声与误码率的概率语言。
tags:
  - mathematics
  - probability
  - random-process
---

## 为什么通信工程师必须学概率

接收机看到的是一个受噪声污染的信号，误码率是"错误判决的概率"，信噪比是"随机功率的比值"，蒙特卡洛仿真是"用大量随机样本估计一个概率"。没有概率语言，这些量只能定性描述；有了概率语言，才能写出可计算的公式、可验证的仿真。

本文按"公理 → 条件概率 → 随机变量 → 多维 → 数字特征 → 极限定理"展开，重点放在**条件的保留**：什么时候可以相加、什么时候必须考虑相关性、中心极限定理需要什么前提。后续的随机过程、估计与检测在此基础上展开（见 [[signal-processing/random-processes|随机信号、估计与检测]]）。

## 概率的公理化定义

**随机试验**满足三条：可在相同条件下重复；所有可能结果已知；单次结果不确定。试验的全部可能结果构成**样本空间** $\Omega$，其子集称为**事件**。事件之间可以做并、交、差、补，对应"至少一个发生""同时发生""不发生"等语言。

**概率**是定义在事件上的函数 $P(\cdot)$，满足三条公理：

1. 非负性：$P(A)\ge0$；
2. 规范性：$P(\Omega)=1$；
3. 可列可加性：若 $A_1,A_2,\dots$ 两两互斥，则 $P(\bigcup_iA_i)=\sum_iP(A_i)$。

由此推出：$P(\varnothing)=0$；$P(\bar A)=1-P(A)$；若 $A\subseteq B$ 则 $P(A)\le P(B)$；加法公式

$$
P(A\cup B)=P(A)+P(B)-P(AB)
$$

**古典概型**（有限等可能）用"有利结果数 / 总结果数"计算；**几何概型**用"面积/长度比"计算。这两种模型在工程问题中经常作为建模起点，但真实系统通常既不有限也不等可能。

**例**：一个 8 元等概符号源，每个符号的自信息为 $-\log_2(1/8)=3$ bit；出现错误符号的概率为 $1-P(\text{正确})=1-\frac78=\frac18$。这类"等概 + 独立"的假设是后面伯努利概型的基础。

## 条件概率、全概率与贝叶斯

### 条件概率与乘法公式

在 $P(B)>0$ 的前提下定义

$$
P(A\mid B)=\frac{P(AB)}{P(B)}
$$

它表示"已知 $B$ 发生"后对 $A$ 的概率重新归一化。移项得**乘法公式**：

$$
P(AB)=P(B)P(A\mid B)=P(A)P(B\mid A)
$$

### 全概率公式与贝叶斯公式

若 $B_1,\dots,B_n$ 构成**划分**（两两互斥、并集为 $\Omega$、每个概率为正），则对任意事件 $A$：

$$
P(A)=\sum_{i=1}^{n}P(B_i)P(A\mid B_i)
\quad(\text{全概率公式})
$$

$$
P(B_k\mid A)=\frac{P(B_k)P(A\mid B_k)}{\sum_iP(B_i)P(A\mid B_i)}
\quad(\text{贝叶斯公式})
$$

全概率公式是"按原因分类讨论"，贝叶斯公式是"由结果反推原因"。通信中的**MAP 检测**就是贝叶斯公式：先验概率乘似然，归一化后取最大。

**例（信道选择）**：发送端以概率 $0.6$ 选信道 A、$0.4$ 选信道 B；两信道的错误率分别为 $0.01$ 与 $0.05$。观测到一次错误时，它来自信道 A 的后验概率为

$$
P(A\mid\text{错})=\frac{0.6\times0.01}{0.6\times0.01+0.4\times0.05}
=\frac{0.006}{0.026}\approx0.231
$$

虽然 A 的先验更高，但它的错误率低，所以"出错"这一证据把原因更多地指向 B。**先验与证据的权重由贝叶斯公式自动平衡**。

### 独立性

若

$$
P(AB)=P(A)P(B)
$$

则称 $A,B$ **独立**；$n$ 个事件相互独立要求任意子集的乘积关系都成立（两两独立不够）。条件概率视角：$P(A\mid B)=P(A)$，即"知道 B 不改变 A 的概率"。

> [!warning] 独立与互斥不是一回事
> 互斥指不能同时发生（$P(AB)=0$），独立指同时发生的概率等于概率之积。若 $P(A),P(B)>0$，互斥必然不独立（因为 $P(A\mid B)=0\ne P(A)$）。把"独立"当"无关"是常见误用：不相关都还不等于独立，更不用说互斥。

**伯努利概型**：$n$ 次独立重复试验，每次成功概率 $p$，成功次数 $X$ 服从二项分布

$$
P(X=k)=\binom{n}{k}p^{k}(1-p)^{n-k}
$$

这是误码计数、帧错误率、蒙特卡洛实验的共同模型。

## 随机变量及其分布

### 定义与两类

**随机变量** $X:\Omega\to\mathbb{R}$ 是把结果数字化的映射。**分布函数** $F(x)=P(X\le x)$ 对离散、连续统一适用，且满足单调不减、右连续、$F(-\infty)=0$、$F(+\infty)=1$。用分布函数求概率：

$$
P(a<X\le b)=F(b)-F(a)
$$

- **离散型**：分布律 $p_k=P(X=x_k)$，满足 $p_k\ge0$、$\sum p_k=1$；
- **连续型**：概率密度 $f(x)$，满足 $f(x)\ge0$、$\int f(x)\,dx=1$，且 $P(a<X<b)=\int_a^bf(x)\,dx$。

连续型随机变量在单点的概率为零（$P(X=a)=0$），所以"密度值"不是概率，可以大于 1（例如 $U(0,0.5)$ 的密度为 2）。

### 常见分布

| 分布 | 记号 | 概率/密度 | 均值 | 方差 |
| --- | --- | --- | --- | --- |
| 0-1 分布 | $B(1,p)$ | $P(X=1)=p$ | $p$ | $p(1-p)$ |
| 二项分布 | $B(n,p)$ | $\binom nk p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ |
| 泊松分布 | $P(\lambda)$ | $\lambda^k e^{-\lambda}/k!$ | $\lambda$ | $\lambda$ |
| 几何分布 | $G(p)$ | $(1-p)^{k-1}p$ | $1/p$ | $(1-p)/p^2$ |
| 均匀分布 | $U(a,b)$ | $1/(b-a)$ | $(a+b)/2$ | $(b-a)^2/12$ |
| 指数分布 | $E(\lambda)$ | $\lambda e^{-\lambda x}$ | $1/\lambda$ | $1/\lambda^2$ |
| 正态分布 | $N(\mu,\sigma^2)$ | 见下 | $\mu$ | $\sigma^2$ |
| 卡方分布 | $\chi^2(n)$ | 见抽样分布 | $n$ | $2n$ |

几个要点：

- **泊松是二项的极限**：$n\to\infty$、$p\to0$、$np=\lambda$ 时 $B(n,p)\to P(\lambda)$，用于"大样本、稀有事件"（误码计数、呼叫到达）。
- **指数分布无记忆**：$P(X>s+t\mid X>s)=P(X>t)$，是"寿命/等待时间"的模型。
- **正态分布**：$f(x)=\frac{1}{\sqrt{2\pi}\sigma}\exp[-(x-\mu)^2/(2\sigma^2)]$，标准化 $Z=(X-\mu)/\sigma\sim N(0,1)$ 后查表。工程中大量噪声与测量误差用它建模，依据是中心极限定理。

**通信中的衰落分布**（小尺度）：瑞利分布（无直射路径）

$$
f_R(r)=\frac{r}{\sigma^2}\exp\left(-\frac{r^2}{2\sigma^2}\right),\quad r\ge0
$$

莱斯分布在直射分量上加高斯，用莱斯因子 $K$ 描述直射功率与散射功率之比（$K=0$ 退化为瑞利）；大尺度阴影衰常用对数正态；Nakagami-$m$ 是更一般的拟合模型（$m=1$ 退化为瑞利）。能量检测统计量服从伽马/卡方分布，稀疏信号建模常用拉普拉斯分布（见 [[vault-notes/math/probability/03-random-variables-distributions|随机变量及其分布（详细笔记）]]）。

## 多维随机变量

### 联合、边缘与条件

二维随机变量的**联合分布函数**是 $F(x,y)=P(X\le x,Y\le y)$。连续型的联合密度 $f(x,y)\ge0$、$\iint f=1$，且

$$
P((X,Y)\in D)=\iint_D f(x,y)\,dx\,dy
$$

**边缘分布**把另一个变量积掉：

$$
f_X(x)=\int_{-\infty}^{\infty}f(x,y)\,dy,
\qquad
f_Y(y)=\int_{-\infty}^{\infty}f(x,y)\,dx
$$

**条件密度** $f_{X\mid Y}(x\mid y)=f(x,y)/f_Y(y)$（要求 $f_Y(y)>0$），几何上是"沿 $y$ 切片再重归一化"。

**独立性**的判据：$F(x,y)=F_X(x)F_Y(y)$，等价于 $f(x,y)=f_X(x)f_Y(y)$（连续型，几乎处处），对离散型则是 $p_{ij}=p_{i\cdot}p_{\cdot j}$。

### 随机变量函数的分布

- **和** $Z=X+Y$（独立）：卷积

$$
f_Z(z)=\int_{-\infty}^{\infty}f_X(x)f_Y(z-x)\,dx
$$

- **最大值/最小值**（独立同分布）：

$$
F_{\max}(z)=[F(z)]^{n},
\qquad
F_{\min}(z)=1-[1-F(z)]^{n}
$$

前者对应并联系统/选择式分集（全部失效才失效），后者对应串联系统/最小可接受值。

- **一般变换**：设 $(U,V)=g(X,Y)$ 是一一映射，则

$$
f_{UV}(u,v)=f_{XY}(x(u,v),y(u,v))\,|J|,
\qquad
J=\frac{\partial(x,y)}{\partial(u,v)}
$$

雅可比行列式就是"面积缩放因子"（与第 5 章的行列式同源）。**瑞利分布就是它的经典应用**：两个独立同分布 $N(0,\sigma^2)$ 变量 $X,Y$ 的模 $R=\sqrt{X^2+Y^2}$，用极坐标变换 $x=r\cos\theta$、$y=r\sin\theta$，$|J|=r$，于是

$$
f_{R,\Theta}(r,\theta)=\frac{1}{2\pi\sigma^2}e^{-r^2/(2\sigma^2)}\,r
\ \Longrightarrow\
f_R(r)=\frac{r}{\sigma^2}e^{-r^2/(2\sigma^2)}
$$

这解释了"为什么衰落包络服从瑞利"：同相、正交两路高斯噪声的合成包络。

> [!tip] 二维正态：不相关等价于独立
> 二维正态分布的密度由 $\mu_1,\mu_2,\sigma_1^2,\sigma_2^2,\rho$ 完全确定。当 $\rho=0$ 时密度可分解为两个一维正态密度之积，因此**不相关与独立等价**——这个性质只对高斯成立，一般分布不成立。

## 数字特征

### 期望与方差

期望是"概率加权平均"：

$$
E(X)=\sum_k x_kp_k\ \text{或}\ \int x f(x)\,dx,
\qquad
E[g(X)]=\sum_k g(x_k)p_k\ \text{或}\ \int g(x)f(x)\,dx
$$

期望的**线性性无条件成立**：

$$
E(aX+bY+c)=aE(X)+bE(Y)+c
$$

不需要独立。但乘积的期望需要独立：$E(XY)=E(X)E(Y)$（独立）。

方差

$$
\operatorname{Var}(X)=E[(X-\mu)^2]=E(X^2)-\mu^2,
\qquad
\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X)
$$

和的方差必须带上协方差：

$$
\operatorname{Var}(X\pm Y)=\operatorname{Var}(X)+\operatorname{Var}(Y)\pm2\operatorname{Cov}(X,Y)
$$

独立时协方差为零，方差才可加。**标准化** $Z=(X-\mu)/\sigma$ 使 $E(Z)=0$、$\operatorname{Var}(Z)=1$。

### 协方差、相关系数与协方差矩阵

$$
\operatorname{Cov}(X,Y)=E[XY]-E(X)E(Y),
\qquad
\rho=\frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}\in[-1,1]
$$

$|\rho|=1$ 当且仅当 $X,Y$ 以概率 1 满足线性关系。**独立 $\Rightarrow$ 不相关，反之不成立**（除非联合高斯）。随机向量的协方差矩阵

$$
V=E[(\mathbf{x}-\boldsymbol{\mu})(\mathbf{x}-\boldsymbol{\mu})^{T}]
$$

对称半正定，对角元是各方差，非对角元是协方差。它的谱分解给出主方向与各方向方差，是 PCA、白化与 MIMO 分析的基础（见 [[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]]）。

**条件期望与全期望公式**：

$$
E(X)=E\bigl[E(X\mid Y)\bigr]
$$

这是"分层求平均"的工具，也是 MMSE 估计中 $\hat{x}_{\mathrm{MMSE}}=E(x\mid y)$ 的来源。

## 大数定律与中心极限定理

### 切比雪夫不等式

对任意 $\varepsilon>0$：

$$
P(|X-\mu|\ge\varepsilon)\le\frac{\sigma^2}{\varepsilon^2}
$$

它只用了均值与方差，因此最保守，但用途广泛：估计样本量、证明大数定律、给出"偏离均值"的上界。

### 大数定律

**依概率收敛** $Y_n\xrightarrow{P}Y$ 指对任意 $\varepsilon>0$，$P(|Y_n-Y|>\varepsilon)\to0$。

- **伯努利大数定律**：频率 $n_A/n\xrightarrow{P}p$，这是"用频率估计概率"的依据。
- **切比雪夫大数定律**：独立、方差有界，则样本均值 $\bar X\xrightarrow{P}\mu$。
- **辛钦大数定律**：独立同分布、期望存在，则 $\bar X\xrightarrow{P}\mu$（不要求方差存在）。

大数定律保证了**用样本均值估计总体均值是相合的**，也是蒙特卡洛仿真的理论基础：仿真次数趋于无穷时，错误频率趋于真实误码率。

### 中心极限定理

**林德伯格–莱维（独立同分布）**：若 $X_1,\dots,X_n$ 独立同分布、均值 $\mu$、方差 $\sigma^2>0$，则

$$
\frac{\sum_{i=1}^{n}X_i-n\mu}{\sqrt n\,\sigma}
\xrightarrow{d}N(0,1)
$$

即"大量独立小扰动之和近似高斯"。**德莫弗–拉普拉斯**是二项分布版本：$X\sim B(n,p)$ 时

$$
\frac{X-np}{\sqrt{np(1-p)}}\xrightarrow{d}N(0,1)
$$

用正态近似计算二项概率时要做**连续性修正**：$P(X\le k)\approx\Phi\left(\frac{k+0.5-np}{\sqrt{np(1-p)}}\right)$，因为离散分布用连续分布近似时，边界要向外扩半个单位。

中心极限定理是 AWGN 模型的物理依据，也是"用高斯近似分析误码率"的合法性来源；但它要求**独立、同分布、方差有限**。重尾分布（方差无穷）之和可能收敛到稳定分布而非高斯；强相关样本的有效样本数会远小于名义样本数。

## 从概率到误码率

BPSK 在 AWGN 下接收 $r=s+n$，$s=\pm\sqrt{E_b}$，$n\sim N(0,N_0/2)$，判决门限 0：

$$
P_b=P(n>\sqrt{E_b})=Q\left(\sqrt{\frac{2E_b}{N_0}}\right),
\qquad
Q(x)=\frac{1}{\sqrt{2\pi}}\int_x^{\infty}e^{-t^2/2}\,dt=\frac12\operatorname{erfc}\left(\frac{x}{\sqrt2}\right)
$$

Q 函数与 $\Phi$ 的关系：$Q(x)=1-\Phi(x)$。**注意 $E_b$ 与 $E_s$ 的区别**：QPSK 中 $E_s=2E_b$，套错公式会差 3 dB（见 [[communication/digital-modulation-qpsk|数字调制 QPSK]]）。

## 仿真验证

```python
import numpy as np

rng = np.random.default_rng(0)

# 1) 蒙特卡洛 BPSK 误码率 + 95% 置信区间
N = 2_000_000
bits = rng.integers(0, 2, N)
tx = 1 - 2 * bits                      # 0 -> +1, 1 -> -1
for eb_n0_db in (0, 4, 8):
    sigma = np.sqrt(1 / (2 * 10 ** (eb_n0_db / 10)))   # Eb = 1
    rx = tx + sigma * rng.standard_normal(N)
    err = np.mean((rx < 0).astype(int) != bits)
    half = 1.96 * np.sqrt(err * (1 - err) / N)          # 95% 置信半宽
    print(f"Eb/N0={eb_n0_db:2d} dB  BER={err:.3e} ± {half:.1e}")

# 2) 中心极限定理：均匀分布之和趋于正态
M = 12
samples = rng.random((200000, M)).sum(axis=1)
z = (samples - M / 2) / np.sqrt(M / 12)
print("均值:", z.mean().round(4), "方差:", z.var().round(4))   # ≈ 0, 1

# 3) 瑞利 = 两路高斯模
x = rng.standard_normal(200000); y = rng.standard_normal(200000)
r = np.sqrt(x**2 + y**2)
print("瑞利均值:", r.mean().round(4), "理论:", np.sqrt(np.pi / 2))
```

> [!tip] 仿真样本量怎么定
> 估计概率 $p$ 时的相对标准差约为 $1/\sqrt{Np}$。要让 $10^{-4}$ 的误码率有 10% 的相对精度，需要 $N\approx1/(p\cdot0.01)=10^{6}$ 个比特；要验证 $10^{-5}$ 的曲线，通常需要上千万比特，或改用重要性采样。**置信区间随 $1/\sqrt N$ 收缩**，不是靠"多跑几次取平均"就能替代样本量。

## 易错点

> [!warning] 概率论最常见的六个坑
> 1. **"不相关 = 独立"**：只对联合高斯成立；一般分布不相关仍可能强依赖（如 $Y=X^2$）。
> 2. **连续型密度值当概率**：密度可以大于 1；概率是积分面积，$P(X=a)=0$。
> 3. **"独立"与"互斥"混用**：互斥且非零概率的事件一定不独立。
> 4. **方差直接相加**：只有独立（或至少不相关）时 $\operatorname{Var}(X+Y)=\operatorname{Var}X+\operatorname{Var}Y$；一般要加 $2\operatorname{Cov}$。
> 5. **忘记中心极限定理的条件**：独立同分布、方差有限；强相关或重尾数据不能直接套高斯。
> 6. **$E_b$ 与 $E_s$ 混用**：高阶调制中两者差 $\log_2M$ 倍，误码率公式会整体平移。

## 前置与相关

前置：微积分（积分与极限）、[[mathematics/linear-algebra-basics|线性代数基础]]（向量、矩阵、协方差）。下一步：[[mathematics/statistics-inference|数理统计与推断]]（抽样分布、参数估计、假设检验、方差分析与回归）；应用见 [[signal-processing/random-processes|随机信号、估计与检测]]、[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]、[[signal-processing/statistical-estimation-filtering|统计估计与滤波]] 与 [[signal-processing/dft-and-fft|DFT 与 FFT]]。

## 来源与延伸阅读

- [[vault-notes/math/probability/00-guide|概率论与数理统计知识库总导读]]：全书结构、学习顺序、与通信知识库的联系。
- [[vault-notes/math/probability/01-basic-concepts|概率论的基本概念]]：随机试验、样本空间、事件运算、公理化定义、古典概型与几何概型。
- [[vault-notes/math/probability/02-conditional-probability-independence|条件概率与事件的独立性]]：条件概率、乘法/全概率/贝叶斯公式、独立性、伯努利概型与信道误码例题。
- [[vault-notes/math/probability/03-random-variables-distributions|随机变量及其分布]]：分布律与密度、分布函数、常见分布、衰落分布（瑞利/莱斯/对数正态/Nakagami）、随机变量函数分布、例题。
- [[vault-notes/math/probability/04-multivariate-random-variables|多维随机变量及其分布]]：联合/边缘/条件分布、独立性、卷积公式、极值分布、雅可比法、MATLAB 验证。
- [[vault-notes/math/probability/05-numerical-characteristics|随机变量的数字特征]]：期望、方差、协方差与相关系数、矩与协方差矩阵、常见分布期望方差表、条件期望。
- [[vault-notes/math/probability/06-law-of-large-numbers-clt|大数定律与中心极限定理]]：切比雪夫不等式、三个大数定律、三种中心极限定理、二项正态近似与连续性修正。
