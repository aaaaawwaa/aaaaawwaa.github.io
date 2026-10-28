---
title: "多维随机变量及其分布"
tags:
- 数学
- 概率论
- 多维随机变量
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
> 第 3 章只处理一个随机变量；现实中的问题几乎都是多变量同时出现（接收信号的 I/Q 两路、两个器件的寿命、一次试验的多个指标）。本章把一维的工具推广到二维：
> - **1. 二维随机变量与联合分布**：$(X,Y)$ 的联合分布函数 $F(x,y)$、联合分布律 $p_{ij}$、联合密度 $f(x,y)$。
> - **2. 边缘分布**：从联合分布里"积掉"一个变量，得到单个变量的分布。
> - **3. 条件分布**：已知 $Y=y$ 时 $X$ 的分布；它是第 2 章条件概率在随机变量上的版本。
> - **4. 独立性**：$F(x,y)=F_X(x)F_Y(y)$；离散看 $p_{ij}=p_{i\cdot}p_{\cdot j}$，连续看 $f(x,y)=f_X(x)f_Y(y)$。
> - **5. 二维常见分布**：矩形上的均匀分布、二维正态分布、多项分布。
> - **6. 两个随机变量函数的分布**：$Z=X+Y$ 的卷积公式、$Z=\max/\min$、一般变换的雅可比法。
> - **7. 例题**：联合表、三角形区域、卷积、极值、二维正态、瑞利的来源。
>
> 一句话主线：**联合分布描述"两个变量一起怎么变"；边缘分布是"只看一个"，条件分布是"已知一个看另一个"，独立性是"两者互不影响"；函数的分布则把二维问题化回一维。**

> [!note] 记号约定
> - $(X,Y)$：二维随机变量；$F(x,y)=P(X\le x,Y\le y)$：联合分布函数
> - 离散型：$p_{ij}=P(X=x_i,Y=y_j)$；连续型：$f(x,y)$：联合概率密度
> - 边缘：$p_{i\cdot}=\sum_j p_{ij}$、$p_{\cdot j}=\sum_i p_{ij}$；$f_X(x)=\int f(x,y)\,dy$
> - 条件：$p_{i\mid j}=p_{ij}/p_{\cdot j}$、$f_{X\mid Y}(x\mid y)=f(x,y)/f_Y(y)$
> - 独立：$F(x,y)=F_X(x)F_Y(y)$（等价于离散的 $p_{ij}=p_{i\cdot}p_{\cdot j}$ 或连续的 $f=f_Xf_Y$）
> - 二维正态：$N(\mu_1,\mu_2;\sigma_1^2,\sigma_2^2;\rho)$，$\rho$ 为相关系数
> - 雅可比：$J=\dfrac{\partial(x,y)}{\partial(z,w)}$；卷积：$f_Z(z)=\int f(x,z-x)\,dx$

# 1. 二维随机变量与联合分布

## 二维随机变量

> [!info] Def 1 二维随机变量
> 设随机试验的样本空间为 $\Omega$。若对每个样本点 $\omega\in\Omega$，都有**一对有序实数** $(X(\omega),Y(\omega))$ 与之对应，则称 $(X,Y)$ 为**二维随机变量**（two-dimensional random variable），也称**二维随机向量**。
> 用映射的语言：
> $$
> (X,Y):\ \Omega\longrightarrow\mathbb{R}^2,\qquad \omega\mapsto(X(\omega),Y(\omega))
> $$

- $X,Y$ 各自是一维随机变量；$(X,Y)$ 的取值是一个平面点
- 二维随机变量不是"两个一维随机变量的简单拼接"——**联合分布**包含了两者之间的关联信息

## 联合分布函数

> [!info] Def 2 联合分布函数
> 对任意实数 $x,y$，称
> $$
> F(x,y)=P(X\le x,\ Y\le y)
> $$
> 为 $(X,Y)$ 的**联合分布函数**（joint cumulative distribution function，简称联合 CDF）。

几何意义：$F(x,y)$ 是随机点 $(X,Y)$ 落在**左下无穷矩形** $(-\infty,x]\times(-\infty,y]$ 内的概率。

**四条性质**（与一维分布函数对应）：

1. **单调不减**：对每个变量分别单调不减
2. **规范性**：$F(-\infty,y)=F(x,-\infty)=0$，$F(+\infty,+\infty)=1$
3. **右连续**：对每个变量右连续
4. **矩形概率非负**：对 $x_1<x_2$、$y_1<y_2$，
   $$
   P(x_1<X\le x_2,\ y_1<Y\le y_2)=F(x_2,y_2)-F(x_2,y_1)-F(x_1,y_2)+F(x_1,y_1)\ge0
   $$

> [!warning] 联合 CDF 不能由两个边缘 CDF 唯一确定
> 知道 $F_X(x)$ 和 $F_Y(y)$ **不能**还原 $F(x,y)$——它们只描述各自的一维行为，丢失了"$X$ 与 $Y$ 如何一起变"的信息。这正是本章要引入联合分布的原因。

## 离散型：联合分布律

> [!info] Def 3 联合分布律
> 若 $(X,Y)$ 只取有限或可列个点 $(x_i,y_j)$，则称
> $$
> p_{ij}=P(X=x_i,\ Y=y_j),\qquad i,j=1,2,\dots
> $$
> 为 $(X,Y)$ 的**联合分布律**（joint probability mass function）。

**两条基本性质**：

1. **非负性**：$p_{ij}\ge0$
2. **规范性**：$\sum_i\sum_j p_{ij}=1$

联合分布律通常写成**二维表**：

| $X\backslash Y$ | $y_1$ | $y_2$ | $\cdots$ |
| --- | --- | --- | --- |
| $x_1$ | $p_{11}$ | $p_{12}$ | $\cdots$ |
| $x_2$ | $p_{21}$ | $p_{22}$ | $\cdots$ |
| $\vdots$ | $\vdots$ | $\vdots$ | $\ddots$ |

## 连续型：联合概率密度

> [!info] Def 4 联合概率密度
> 若存在非负可积函数 $f(x,y)$，使得对任意 $x,y$ 都有
> $$
> F(x,y)=\int_{-\infty}^{x}\int_{-\infty}^{y}f(u,v)\,\mathrm{d}v\,\mathrm{d}u
> $$
> 则称 $(X,Y)$ 为**连续型二维随机变量**，$f(x,y)$ 为**联合概率密度函数**（joint probability density function）。

**两条基本性质**：

1. **非负性**：$f(x,y)\ge0$
2. **规范性**：$\displaystyle\int_{-\infty}^{+\infty}\int_{-\infty}^{+\infty}f(x,y)\,\mathrm{d}x\,\mathrm{d}y=1$

**用密度求概率**：对平面区域 $D$，

$$
P\big((X,Y)\in D\big)=\iint_D f(x,y)\,\mathrm{d}x\,\mathrm{d}y
$$

即**密度曲面下、区域 $D$ 上的体积**。

> [!example] 区域上的均匀分布
> 设 $(X,Y)$ 在三角形区域 $D=\{(x,y):x\ge0,\ y\ge0,\ x+y\le1\}$ 上服从均匀分布。
> 区域面积 $S=\frac12$，故
> $$
> f(x,y)=\begin{cases}2,&(x,y)\in D\\0,&\text{其他}\end{cases}
> $$
> 求 $P(X+Y\le 1/2)$：该子区域是边长为 $1/2$ 的等腰直角三角形，面积 $\frac18$，故概率 $=2\times\frac18=\frac14$。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <line x1="60.0" y1="250.0" x2="350.0" y2="250.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="60.0" y1="250.0" x2="60.0" y2="40.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <text x="354.0" y="254.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">x</text>
  <text x="54.0" y="34.0" text-anchor="end" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">y</text>
  <line x1="60.0" y1="250.0" x2="60.0" y2="254.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="60.0" y="267.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">0</text>
  <line x1="350.0" y1="250.0" x2="350.0" y2="254.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="350.0" y="267.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">1</text>
  <line x1="56.0" y1="250.0" x2="60.0" y2="250.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="53.0" y="254.0" text-anchor="end" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">0</text>
  <line x1="56.0" y1="40.0" x2="60.0" y2="40.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="53.0" y="44.0" text-anchor="end" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">1</text>
  <polygon points="60.0,250.0 350.0,250.0 60.0,40.0" fill="#2563eb" fill-opacity="0.18" stroke="none"/>
  <polyline points="60.0,250.0 350.0,250.0 60.0,40.0 60.0,250.0" fill="none" stroke="#2563eb" stroke-width="2.0"/>
  <text x="150.0" y="170.0" text-anchor="start" font-size="11" fill="#2563eb" font-weight="normal">D: x≥0, y≥0, x+y≤1</text>
  <text x="205.0" y="300.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">(a) 三角形区域 D，面积 = 1/2</text>
  <line x1="440.0" y1="250.0" x2="730.0" y2="250.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="440.0" y1="250.0" x2="440.0" y2="40.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <text x="734.0" y="254.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">x</text>
  <text x="434.0" y="34.0" text-anchor="end" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">y</text>
  <line x1="440.0" y1="250.0" x2="440.0" y2="254.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="440.0" y="267.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">0</text>
  <line x1="730.0" y1="250.0" x2="730.0" y2="254.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="730.0" y="267.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">1</text>
  <line x1="436.0" y1="250.0" x2="440.0" y2="250.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="433.0" y="254.0" text-anchor="end" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">0</text>
  <line x1="436.0" y1="40.0" x2="440.0" y2="40.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="433.0" y="44.0" text-anchor="end" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">1</text>
  <polygon points="440.0,250.0 585.0,250.0 440.0,145.0" fill="#7c3aed" fill-opacity="0.45" stroke="none"/>
  <polyline points="440.0,250.0 730.0,250.0 440.0,40.0 440.0,250.0" fill="none" stroke="#2563eb" stroke-width="2.0"/>
  <line x1="440.0" y1="250.0" x2="585.0" y2="145.0" stroke="#dc2626" stroke-width="1.4" stroke-dasharray="5 3"/>
  <text x="520.0" y="150.0" text-anchor="start" font-size="11" fill="#dc2626" font-weight="normal">x+y≤1/2</text>
  <text x="585.0" y="300.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">(b) 子区域，面积 = 1/8 → P=1/4</text>
</svg>

# 2. 边缘分布

> [!info] Def 5 边缘分布
> 从联合分布中"只看一个变量"得到的分布，称为**边缘分布**（marginal distribution）：
> - 离散型：$p_{i\cdot}=P(X=x_i)=\sum_j p_{ij}$，$p_{\cdot j}=P(Y=y_j)=\sum_i p_{ij}$
> - 连续型：$f_X(x)=\displaystyle\int_{-\infty}^{+\infty}f(x,y)\,\mathrm{d}y$，$f_Y(y)=\displaystyle\int_{-\infty}^{+\infty}f(x,y)\,\mathrm{d}x$
> - 分布函数：$F_X(x)=F(x,+\infty)$，$F_Y(y)=F(+\infty,y)$

**操作口诀**：**求谁的边缘，就把另一个变量"求和/积分掉"**。

> [!example] 三角形区域上的边缘密度
> 承上例，$f(x,y)=2$ 在 $D$ 上。求 $f_X(x)$：
> $$
> f_X(x)=\int_{-\infty}^{+\infty}f(x,y)\,\mathrm{d}y=\int_0^{1-x}2\,\mathrm{d}y=2(1-x),\qquad 0<x<1
> $$
> 同理 $f_Y(y)=2(1-y)$，$0<y<1$。
> 注意：$f_X(x)f_Y(y)=4(1-x)(1-y)\ne2=f(x,y)$——**边缘分布不能还原联合分布**。

# 3. 条件分布

> [!info] Def 6 条件分布
> 在 $Y=y_j$（$p_{\cdot j}>0$）的条件下，$X$ 的**条件分布律**为
> $$
> P(X=x_i\mid Y=y_j)=\frac{p_{ij}}{p_{\cdot j}}
> $$
> 在 $f_Y(y)>0$ 的条件下，$X$ 的**条件概率密度**为
> $$
> f_{X\mid Y}(x\mid y)=\frac{f(x,y)}{f_Y(y)}
> $$

条件分布就是第 2 章条件概率的"随机变量版本"：**把联合分布限制在一条线/一个点上，再重新归一化**。

> [!example] 条件分布的计算
> 承上例，$f(x,y)=2$（$x,y\ge0,x+y\le1$），$f_Y(y)=2(1-y)$。
> $$
> f_{X\mid Y}(x\mid y)=\frac{2}{2(1-y)}=\frac{1}{1-y},\qquad 0<x<1-y
> $$
> 即给定 $Y=y$ 后，$X$ 在 $(0,1-y)$ 上均匀分布。

# 4. 独立性

> [!info] Def 7 随机变量的独立性
> 若对任意 $x,y$ 都有
> $$
> F(x,y)=F_X(x)F_Y(y)
> $$
> 则称 $X$ 与 $Y$ **相互独立**（independent）。
> 等价条件：
> - 离散型：$p_{ij}=p_{i\cdot}p_{\cdot j}$ 对所有 $i,j$ 成立
> - 连续型：$f(x,y)=f_X(x)f_Y(y)$（几乎处处成立）

> [!warning] 独立 ≠ 不相关
> "独立"是**分布层面**的概念：联合分布等于边缘分布之积。
> "不相关"是**数字特征层面**的概念：协方差为 0（第 5 章）。
> 独立 ⇒ 不相关；不相关 ⇏ 独立（除非是二维正态）。

**独立性的两条实用推论**：

1. 若 $X,Y$ 独立，则 $g(X)$ 与 $h(Y)$ 也独立（对任意函数 $g,h$）
2. 若 $X,Y$ 独立，则 $E[g(X)h(Y)]=E[g(X)]E[h(Y)]$（第 5 章会用）

> [!example] 判断独立性
> 承上例，$f(x,y)=2$（三角形区域），$f_X(x)f_Y(y)=4(1-x)(1-y)\ne2$，故 **$X$ 与 $Y$ 不独立**。
> 直观：$X+Y\le1$ 的约束让两者"此消彼长"，知道 $X$ 大就知道 $Y$ 不能大。

# 5. 二维常见分布

## 矩形上的均匀分布

若 $(X,Y)$ 在矩形 $[a,b]\times[c,d]$ 上均匀分布：

$$
f(x,y)=\begin{cases}\dfrac{1}{(b-a)(d-c)},&a<x<b,\ c<y<d\\[2mm]0,&\text{其他}\end{cases}
$$

此时 $X\sim U(a,b)$、$Y\sim U(c,d)$，且 $X,Y$ **相互独立**。

## 二维正态分布

> [!info] Def 8 二维正态分布
> 若 $(X,Y)$ 的联合密度为
> $$
> f(x,y)=\frac{1}{2\pi\sigma_1\sigma_2\sqrt{1-\rho^2}}\exp\left\{-\frac{1}{2(1-\rho^2)}\left[\frac{(x-\mu_1)^2}{\sigma_1^2}-\frac{2\rho(x-\mu_1)(y-\mu_2)}{\sigma_1\sigma_2}+\frac{(y-\mu_2)^2}{\sigma_2^2}\right]\right\}
> $$
> 则称 $(X,Y)$ 服从**二维正态分布**，记作 $N(\mu_1,\mu_2;\sigma_1^2,\sigma_2^2;\rho)$。

**五条重要性质**：

1. 边缘分布仍是正态：$X\sim N(\mu_1,\sigma_1^2)$，$Y\sim N(\mu_2,\sigma_2^2)$
2. 条件分布仍是正态：$X\mid Y=y\sim N\left(\mu_1+\rho\frac{\sigma_1}{\sigma_2}(y-\mu_2),\ \sigma_1^2(1-\rho^2)\right)$
3. **$X,Y$ 独立 ⇔ $\rho=0$**（二维正态专有：不相关 ⇔ 独立）
4. 线性组合 $aX+bY$ 仍服从正态
5. $\rho$ 描述线性相关程度：$|\rho|$ 越接近 1，椭圆越扁

## 多项分布

> [!info] Def 9 多项分布
> 在 $n$ 次独立试验中，每次有 $r$ 种可能结果，第 $i$ 种结果出现概率为 $p_i$（$\sum p_i=1$），则各结果出现次数 $(X_1,\dots,X_r)$ 的联合分布为
> $$
> P(X_1=k_1,\dots,X_r=k_r)=\frac{n!}{k_1!\cdots k_r!}p_1^{k_1}\cdots p_r^{k_r},\qquad \sum k_i=n
> $$
> 称为**多项分布**（multinomial distribution）。

- $r=2$ 时退化为二项分布
- 通信中用于"多符号信源的计数"、多类误码的联合统计

# 6. 两个随机变量函数的分布

## $Z=X+Y$：卷积公式

> [!info] Def 10 卷积公式
> 若 $(X,Y)$ 的联合密度为 $f(x,y)$，则 $Z=X+Y$ 的密度为
> $$
> f_Z(z)=\int_{-\infty}^{+\infty}f(x,z-x)\,\mathrm{d}x=\int_{-\infty}^{+\infty}f(z-y,y)\,\mathrm{d}y
> $$
> 当 $X,Y$ **独立**时，$f(x,y)=f_X(x)f_Y(y)$，上式变成**卷积**：
> $$
> f_Z(z)=\int_{-\infty}^{+\infty}f_X(x)f_Y(z-x)\,\mathrm{d}x=f_X(z)*f_Y(z)
> $$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 300" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <line x1="80.0" y1="230.0" x2="700.0" y2="230.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="80.0" y1="230.0" x2="80.0" y2="40.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <text x="704.0" y="234.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">z</text>
  <text x="74.0" y="34.0" text-anchor="end" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">f_Z(z)</text>
  <line x1="80.0" y1="230.0" x2="80.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="80.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">0</text>
  <line x1="390.0" y1="230.0" x2="390.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="390.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">1</text>
  <line x1="700.0" y1="230.0" x2="700.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="700.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">2</text>
  <line x1="76.0" y1="230.0" x2="80.0" y2="230.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="73.0" y="234.0" text-anchor="end" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">0</text>
  <line x1="76.0" y1="80.0" x2="80.0" y2="80.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="73.0" y="84.0" text-anchor="end" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">1</text>
  <polygon points="80.0,230.0 390.0,80.0 700.0,230.0" fill="var(--text-accent,#705dcf)" fill-opacity="0.22" stroke="none"/>
  <polyline points="80.0,230.0 390.0,80.0 700.0,230.0 80.0,230.0" fill="none" stroke="var(--text-accent,#705dcf)" stroke-width="2.2"/>
  <text x="330.0" y="110.0" text-anchor="start" font-size="11" fill="var(--text-accent,#705dcf)" font-weight="normal">f_Z(z)=z  (0&lt;z&lt;1)</text>
  <text x="500.0" y="110.0" text-anchor="start" font-size="11" fill="var(--text-accent,#705dcf)" font-weight="normal">f_Z(z)=2−z  (1≤z&lt;2)</text>
  <text x="390.0" y="280.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">两个 U(0,1) 之和：三角形分布（辛普森分布）</text>
</svg>

> [!example] 两个均匀分布之和
> 设 $X,Y$ 独立且都服从 $U(0,1)$。则
> $$
> f_Z(z)=\int_0^1 f_X(x)f_Y(z-x)\,\mathrm{d}x
> $$
> 被积函数非零要求 $0<x<1$ 且 $0<z-x<1$，即 $\max(0,z-1)<x<\min(1,z)$。
> - $0<z<1$：$f_Z(z)=\int_0^z1\,\mathrm{d}x=z$
> - $1\le z<2$：$f_Z(z)=\int_{z-1}^1 1\,\mathrm{d}x=2-z$
> - 其他：$0$
>
> 即**三角形分布**（辛普森分布）。两个均匀分布之和"中间高、两头低"，这正是中心极限定理的雏形（第 6 章）。

## $Z=\max(X,Y)$ 与 $Z=\min(X,Y)$

设 $X,Y$ 独立，分布函数分别为 $F_X,F_Y$：

$$
F_{\max}(z)=P(\max(X,Y)\le z)=P(X\le z,Y\le z)=F_X(z)F_Y(z)
$$

$$
F_{\min}(z)=P(\min(X,Y)\le z)=1-P(X>z,Y>z)=1-[1-F_X(z)][1-F_Y(z)]
$$

密度（若存在）：

$$
f_{\max}(z)=f_X(z)F_Y(z)+F_X(z)f_Y(z)
$$

$$
f_{\min}(z)=f_X(z)[1-F_Y(z)]+[1-F_X(z)]f_Y(z)
$$

> [!example] 系统可靠性
> 串联系统寿命 $=\min(X_1,\dots,X_n)$，并联系统寿命 $=\max(X_1,\dots,X_n)$。
> 若 $X_i$ 独立同分布，$F_{\max}=F^n$，$F_{\min}=1-(1-F)^n$。
> 这解释了为什么**并联冗余**能显著提高系统可靠性。

## 一般变换：雅可比法

> [!info] Def 11 雅可比变换
> 设 $(X,Y)$ 的联合密度为 $f_{XY}(x,y)$，变换
> $$
> Z=g_1(X,Y),\qquad W=g_2(X,Y)
> $$
> 存在唯一的反变换 $x=h_1(z,w)$、$y=h_2(z,w)$，且雅可比行列式
> $$
> J=\frac{\partial(x,y)}{\partial(z,w)}=\begin{vmatrix}\dfrac{\partial x}{\partial z}&\dfrac{\partial x}{\partial w}\\[2mm]\dfrac{\partial y}{\partial z}&\dfrac{\partial y}{\partial w}\end{vmatrix}\ne0
> $$
> 则
> $$
> f_{ZW}(z,w)=f_{XY}\big(h_1(z,w),h_2(z,w)\big)\,|J|
> $$

> [!example] 瑞利分布的来源
> 设 $X,Y$ 独立同分布 $N(0,\sigma^2)$。令
> $$
> R=\sqrt{X^2+Y^2},\qquad \Theta=\arctan\frac{Y}{X}
> $$
> 反变换 $x=r\cos\theta$、$y=r\sin\theta$，雅可比 $|J|=r$。于是
> $$
> f_{R\Theta}(r,\theta)=f_X(r\cos\theta)f_Y(r\sin\theta)\cdot r=\frac{r}{2\pi\sigma^2}e^{-r^2/(2\sigma^2)}
> $$
> 对 $\theta$ 积分得
> $$
> f_R(r)=\frac{r}{\sigma^2}e^{-r^2/(2\sigma^2)},\qquad r\ge0
> $$
> 正是第 3 章的**瑞利分布**。这解释了"瑞利 = 两个独立同方差高斯的模"。

## MATLAB

```matlab
% 二维正态
mu = [0 0]; Sigma = [1 0.8; 0.8 1];
XY = mvnrnd(mu, Sigma, 10000);
hist3(XY, 'Nbins', [30 30]);            % 联合分布直方图
% 边缘分布
histogram(XY(:,1), 'Normalization', 'pdf'); hold on;
histogram(XY(:,2), 'Normalization', 'pdf');
% 卷积（两个均匀分布之和）
x = 0:0.01:1;
fZ = conv(ones(size(x))/1, ones(size(x))/1) * 0.01;
plot(0:0.01:2, fZ);
% 瑞利：两个高斯的模
R = sqrt(sum(mvnrnd([0 0], eye(2), 100000).^2, 2));
histogram(R, 'Normalization', 'pdf'); hold on;
r = 0:0.01:4; plot(r, r.*exp(-r.^2/2));
```

# 7. 例题

> [!example] 例 1：联合分布表、边缘与独立性
> 设 $(X,Y)$ 的联合分布律为
>
> | $X\backslash Y$ | 0 | 1 |
> | --- | --- | --- |
> | 0 | 0.2 | 0.3 |
> | 1 | 0.3 | 0.2 |
>
> 求边缘分布并判断独立性。
> $p_{X}(0)=0.5$，$p_{X}(1)=0.5$；$p_{Y}(0)=0.5$，$p_{Y}(1)=0.5$。
> 但 $p_{00}=0.2\ne0.5\times0.5=0.25$，故 **$X,Y$ 不独立**。

> [!example] 例 2：三角形区域上的联合密度
> $f(x,y)=c$（$x\ge0,y\ge0,x+y\le1$），其他为 0。求 $c$、边缘密度、条件密度。
> 面积 $\frac12$，故 $c=2$。
> $f_X(x)=2(1-x)$（$0<x<1$）；$f_Y(y)=2(1-y)$（$0<y<1$）。
> $f_{X\mid Y}(x\mid y)=\dfrac{1}{1-y}$（$0<x<1-y$）。

> [!example] 例 3：卷积
> $X\sim U(0,1)$，$Y\sim U(0,1)$ 独立，求 $Z=X+Y$ 的密度。
> 见 6 节，$f_Z(z)=z$（$0<z<1$），$2-z$（$1\le z<2$）。

> [!example] 例 4：最大值与最小值
> 三个独立同分布 $U(0,1)$ 的元件，求串联/并联系统寿命的密度。
> $F_{\max}(z)=z^3$，$f_{\max}(z)=3z^2$；
> $F_{\min}(z)=1-(1-z)^3$，$f_{\min}(z)=3(1-z)^2$，$0<z<1$。

> [!example] 例 5：二维正态的条件分布
> 设 $(X,Y)\sim N(0,0;1,1;0.8)$。求 $X\mid Y=1$ 的分布。
> 由性质 2：$X\mid Y=y\sim N(\rho y,\ 1-\rho^2)=N(0.8,\ 0.36)$。
> 即给定 $Y=1$ 后，$X$ 的均值是 $0.8$、方差是 $0.36$——**观测到 $Y$ 大，$X$ 也跟着大**，这正是 $\rho>0$ 的含义。

> [!example] 例 6：雅可比法
> 设 $X,Y$ 独立同分布 $N(0,1)$，求 $Z=X+Y$ 与 $W=X-Y$ 的联合密度，并判断独立性。
> 反变换 $x=(z+w)/2$、$y=(z-w)/2$，$|J|=1/2$。
> $$
> f_{ZW}(z,w)=\frac{1}{2}\cdot\frac{1}{2\pi}e^{-[(z+w)^2+(z-w)^2]/4}=\frac{1}{4\pi}e^{-(z^2+w^2)/4}
> $$
> 可分解为 $f_Z(z)f_W(w)$，故 $Z,W$ 独立，且都服从 $N(0,2)$。
> 这个结论在通信中很重要：**和与差（即 I/Q 两路）是独立的高斯**，这正是复高斯噪声模型的基础。

> [!tip] 本章收官
> 本章把一维概率推广到二维，形成四组对应：
> 1. **联合分布**（1）：$F(x,y)$、$p_{ij}$、$f(x,y)$，描述"两个变量一起怎么变"。
> 2. **边缘分布**（2）：把另一个变量求和/积分掉，只看一个。
> 3. **条件分布**（3）：固定一个变量，另一个的分布；条件概率的随机变量版本。
> 4. **独立性**（4）：联合 = 边缘之积；二维正态中"不相关 ⇔ 独立"。
> 5. **常见分布**（5）：矩形均匀、二维正态、多项分布。
> 6. **函数的分布**（6）：卷积、极值、雅可比；瑞利/莱斯等衰落分布都由此而来。
>
> 一句话：**联合分布是主角，边缘和条件是从不同方向"切片"；独立性是最强的简化假设；函数的分布则把二维问题化回一维。**

# 本章知识地图

```
多维随机变量
├─ 1. 联合分布
│     ├─ 联合 CDF：F(x,y)=P(X≤x,Y≤y)
│     ├─ 离散：p_ij=P(X=x_i,Y=y_j)，ΣΣp_ij=1
│     ├─ 连续：f(x,y)，∫∫f=1，P((X,Y)∈D)=∬_D f
│     └─ 矩形概率：F(x₂,y₂)−F(x₂,y₁)−F(x₁,y₂)+F(x₁,y₁)
│
├─ 2. 边缘分布
│     ├─ p_i·=Σ_j p_ij，p_·j=Σ_i p_ij
│     ├─ f_X(x)=∫f(x,y)dy，f_Y(y)=∫f(x,y)dx
│     └─ 边缘不能还原联合
│
├─ 3. 条件分布
│     ├─ P(X=x_i|Y=y_j)=p_ij/p_·j
│     ├─ f_{X|Y}(x|y)=f(x,y)/f_Y(y)
│     └─ 条件分布 = 切片 + 重归一化
│
├─ 4. 独立性
│     ├─ F(x,y)=F_X(x)F_Y(y)
│     ├─ 离散 p_ij=p_i·p_·j；连续 f=f_Xf_Y
│     ├─ 独立 ⇒ 不相关；反之一般不成立
│     └─ 二维正态：不相关 ⇔ 独立
│
├─ 5. 常见分布
│     ├─ 矩形均匀（独立）
│     ├─ 二维正态 N(μ₁,μ₂;σ₁²,σ₂²;ρ)
│     └─ 多项分布（二项的推广）
│
└─ 6. 函数的分布
      ├─ Z=X+Y：卷积 f_Z=∫f(x,z−x)dx
      ├─ Z=max/min：F_max=F_XF_Y，F_min=1−(1−F_X)(1−F_Y)
      ├─ 一般变换：雅可比 f_ZW=f_XY|J|
      └─ 瑞利 = 两个独立同方差高斯的模
```

# 关联

- 上一章：[[vault-notes/math/probability/03-random-variables-distributions]]
- 下一章：[[vault-notes/math/probability/05-numerical-characteristics]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 联合分布、边缘分布 | [[vault-notes/math/probability/05-numerical-characteristics]] 的协方差、相关系数 |
| 独立性 | [[vault-notes/math/probability/05-numerical-characteristics]] 的 $E[g(X)h(Y)]=E[g(X)]E[h(Y)]$；[[vault-notes/math/probability/06-law-of-large-numbers-clt]] 的独立同分布 |
| 二维正态 | [[vault-notes/math/probability/05-numerical-characteristics]] 的相关系数；[[vault-notes/math/probability/07-samples-sampling-distributions]] 的样本均值 |
| 卷积公式 | [[vault-notes/math/probability/06-law-of-large-numbers-clt]] 的独立和；[[vault-notes/math/probability/03-random-variables-distributions]] 的随机变量函数 |
| 雅可比法 | [[vault-notes/math/probability/03-random-variables-distributions]] 的瑞利/莱斯来源；通信的 I/Q 分解 |
| 极值分布 | 系统可靠性、分集合并、顺序统计量 |

**本章留下的三个悬念（第 5 章结清）**：

| 本章的悬念 | 第 5 章的答案 |
| --- | --- |
| 联合分布包含"关联信息"，能不能用一个数概括？ | 协方差与相关系数 $\rho$ 就是概括线性关联程度的数 |
| 独立 ⇒ 不相关，为什么不相关一般不 ⇒ 独立？ | 相关系数只测**线性**关联；非线性依赖（如 $Y=X^2$）可以 $\rho=0$ 但不独立 |
| 二维正态的 $\rho$ 到底怎么算？ | $\rho=\frac{\mathrm{Cov}(X,Y)}{\sigma_1\sigma_2}$，即相关系数的定义 |

**通信方向应用**：

- [[vault-notes/communication/03-random-processes]] —— 窄带高斯噪声的 I/Q 两路 $(n_c,n_s)$ 就是二维正态，且独立同方差；包络 $R=\sqrt{n_c^2+n_s^2}$ 是瑞利分布，正是本章雅可比法的直接应用。
- [[vault-notes/communication/04-channel]] —— 多径信道的复包络、MIMO 信道的矩阵模型都是多维随机变量；协方差矩阵描述天线间相关。
- [[vault-notes/communication/09-optimal-reception]] —— 二维高斯判决区域、最小欧氏距离判决都建立在联合分布之上。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— MIMO/波束赋形中的信道矩阵、协方差矩阵、空间相关性，都是本章多维分布的工程化。

**相关**：[[vault-notes/math/probability/03-random-variables-distributions]]｜[[vault-notes/math/probability/05-numerical-characteristics]]｜[[vault-notes/communication/03-random-processes]]｜[[vault-notes/matlab/matlab-notes]]
