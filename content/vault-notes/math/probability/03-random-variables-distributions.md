---
title: "随机变量及其分布"
tags:
- 数学
- 概率论
- 随机变量
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
> 本章把"事件"升级为"随机变量"，让概率可以用微积分计算：
> - **1. 随机变量的概念**：$X:\Omega\to\mathbb{R}$ 的映射；离散型与连续型。
> - **2. 离散型随机变量**：分布律 $p_k=P(X=x_k)$，非负 + 归一。
> - **3. 分布函数**：$F(x)=P(X\le x)$，统一离散/连续的通用语言。
> - **4. 连续型随机变量**：概率密度 $f(x)$，面积给概率；$f$ 可以大于 1。
> - **5. 常见分布**：0-1、二项、泊松、几何、均匀、指数、正态；通信中的瑞利/莱斯/对数正态/Nakagami-m/韦布尔/伽马/卡方/拉普拉斯。
> - **6. 随机变量函数的分布**：分布函数法、单调变换公式。
> - **7. 例题**：从分布律、密度、标准化到衰落分布与能量检测。
>
> 一句话主线：**随机变量把样本点变成实数；离散型用求和、连续型用积分描述规律，分布函数统一两者；通信中的衰落分布几乎都由高斯分量派生——瑞利是两个高斯的模，莱斯再加直射，对数正态是 dB 域的高斯。**

> [!note] 记号约定
> - $X,Y$：随机变量；$x,y$：取值；$F(x)$：分布函数（CDF）；$f(x)$：概率密度（PDF）
> - 离散型：$p_k=P(X=x_k)$，$\sum p_k=1$；连续型：$f(x)\ge0$，$\int f=1$
> - $N(\mu,\sigma^2)$：正态；$\Phi(x)$：标准正态分布函数；$\varphi(x)$：标准正态密度
> - $B(n,p)$、$P(\lambda)$、$U(a,b)$、$E(\lambda)$、$G(p)$：二项、泊松、均匀、指数、几何
> - $R(\sigma)$、$K$、$m$、$\Omega$：瑞利、莱斯因子、Nakagami-m 衰落指数、平均功率
> - 单点概率：离散型 $P(X=a)=F(a)-F(a-0)$；连续型 $P(X=a)=0$

# 1. 随机变量的概念

## 1. 为什么要引入随机变量

前两章里,事件是"集合",概率是"集合上的函数"。这套语言严谨,但用起来笨重——要计算"出现 2 点"与"出现 4 点"的概率之和,得先写成 $P(\{2\})+P(\{4\})$。

如果能给每个样本点**编个号**,让事件变成"数落在某个范围里",就可以直接用数轴、函数、微积分这套成熟工具。这就是**随机变量**的用意。

## 2. 定义

> [!info] Def 1 随机变量
> 设随机试验的样本空间为 $\Omega=\{\omega\}$。若对每一个样本点 $\omega\in\Omega$，都有**唯一确定的实数** $X(\omega)$ 与之对应，则称 $X=X(\omega)$ 为**随机变量**（random variable）。

用映射的语言说:

$$X:\ \Omega \longrightarrow \mathbb{R},\qquad \omega \mapsto X(\omega)$$

**三个要点**:

- $X$ 是一个**函数**,定义域是样本空间 $\Omega$,值域落在实数集 $\mathbb{R}$ 上。
- **"随机"指的是自变量 $\omega$ 随机**,而不是函数本身随机。$X$ 这个对应规则是完全确定的;随机的是"这次试验抽到哪个 $\omega$"。
- $X$ 是**单值**的:同一个 $\omega$ 不能对应两个不同的值。

下图 (a) 就是这个映射的示意。

## 3. 随机变量把事件"数字化"

引入 $X$ 之后,原来用集合描述的事件,现在可以用**数值范围**描述:

| 原来的写法(集合) | 现在的写法(数值) |
| --- | --- |
| $\{\omega \mid X(\omega)=2\}$ | $X=2$ |
| $\{\omega \mid X(\omega)\le 3\}$ | $X\le 3$ |
| $\{\omega \mid 1<X(\omega)<5\}$ | $1<X<5$ |

这一转换是本章全部便利的来源:从此"求概率"变成了"求一个函数取值落在某区间内的概率"。

## 4. 两类随机变量

按取值特点分:

- **离散型**:$X$ 的全部取值是**有限个或可列无限个**。例如掷骰子的点数 $\{1,\dots,6\}$、某时段内的呼叫次数 $\{0,1,2,\dots\}$。
- **连续型**:$X$ 的取值**充满某个区间**。例如器件的寿命 $[0,+\infty)$、接收信号的幅度。

还有既非离散也非连续的混合型,本课程一般不涉及。

## 5. 本章四件核心工具

下图把本章的四个主角放在一起:(a) 随机变量作为映射,(b) 离散型的分布律,(c) 连续型的概率密度,(d) 统一两者的分布函数。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 460" width="100%" style="max-width:820px" font-family="inherit">
  <defs>
    <clipPath id="rv-clip-area" clipPathUnits="userSpaceOnUse">
      <rect x="165" y="258" width="80" height="148"/>
    </clipPath>
    <marker id="rv-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <path d="M0,0 L7,3.5 L0,7 z" fill="#8b5cf6"/>
    </marker>
  </defs>

  <!-- ==================== (a) 随机变量是映射 ==================== -->
  <g>
    <text x="205" y="18" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">随机变量 X: Ω → ℝ</text>
    <rect x="40" y="30" width="330" height="148" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <ellipse cx="112" cy="104" rx="44" ry="54" fill="#6366f1" fill-opacity="0.12" stroke="#4f46e5" stroke-width="1.8"/>
    <text x="112" y="152" text-anchor="middle" font-size="11" font-style="italic" fill="var(--text-faint,#8b949e)">Ω</text>
    <circle cx="96" cy="82" r="3.6" fill="#4f46e5"/>
    <circle cx="128" cy="104" r="3.6" fill="#4f46e5"/>
    <circle cx="96" cy="126" r="3.6" fill="#4f46e5"/>
    <text x="84" y="78" text-anchor="end" font-size="10.5" fill="var(--text-muted,#57606a)">ω₁</text>
    <text x="128" y="94" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">ω₂</text>
    <text x="84" y="130" text-anchor="end" font-size="10.5" fill="var(--text-muted,#57606a)">ω₃</text>
    <line x1="300" y1="52" x2="300" y2="152" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
    <text x="300" y="44" text-anchor="middle" font-size="11" font-style="italic" fill="var(--text-faint,#8b949e)">ℝ</text>
    <line x1="292" y1="80" x2="308" y2="80" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
    <line x1="292" y1="104" x2="308" y2="104" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
    <line x1="292" y1="128" x2="308" y2="128" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
    <text x="316" y="84" font-size="10.5" fill="var(--text-muted,#57606a)">x₁</text>
    <text x="316" y="108" font-size="10.5" fill="var(--text-muted,#57606a)">x₂</text>
    <text x="316" y="132" font-size="10.5" fill="var(--text-muted,#57606a)">x₃</text>
    <path d="M102 82 C 180 66, 230 74, 294 80" fill="none" stroke="#8b5cf6" stroke-width="1.5" marker-end="url(#rv-arrow)"/>
    <path d="M134 104 C 190 104, 240 104, 294 104" fill="none" stroke="#8b5cf6" stroke-width="1.5" marker-end="url(#rv-arrow)"/>
    <path d="M102 126 C 180 142, 230 134, 294 128" fill="none" stroke="#8b5cf6" stroke-width="1.5" marker-end="url(#rv-arrow)"/>
    <text x="205" y="196" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">每个样本点对应唯一实数</text>
  </g>

  <!-- ==================== (b) 分布律 ==================== -->
  <g>
    <text x="615" y="18" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">离散型:分布律 P(X = xₖ)</text>
    <rect x="450" y="30" width="330" height="148" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <line x1="470" y1="152" x2="762" y2="152" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.4"/>
    <rect x="486" y="117" width="44" height="35" fill="#6366f1" fill-opacity="0.55"/>
    <rect x="552" y="90" width="44" height="62" fill="#6366f1" fill-opacity="0.55"/>
    <rect x="618" y="104" width="44" height="48" fill="#6366f1" fill-opacity="0.55"/>
    <rect x="684" y="130" width="44" height="22" fill="#6366f1" fill-opacity="0.55"/>
    <text x="508" y="168" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">x₁</text>
    <text x="574" y="168" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">x₂</text>
    <text x="640" y="168" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">x₃</text>
    <text x="706" y="168" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">x₄</text>
    <text x="615" y="196" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">柱高之和恰为 1</text>
  </g>

  <!-- ==================== (c) 概率密度 ==================== -->
  <g>
    <text x="205" y="246" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">连续型:概率密度 f(x)</text>
    <rect x="40" y="258" width="330" height="148" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <line x1="58" y1="378" x2="352" y2="378" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.4"/>
    <path d="M70 378 C145 378 165 292 205 292 C245 292 265 378 340 378 L340 378 Z"
          fill="#a855f7" fill-opacity="0.50" clip-path="url(#rv-clip-area)"/>
    <path d="M70 378 C145 378 165 292 205 292 C245 292 265 378 340 378"
          fill="none" stroke="#7c3aed" stroke-width="2"/>
    <line x1="165" y1="330" x2="165" y2="378" stroke="#db2777" stroke-width="1.2" stroke-dasharray="4 3"/>
    <line x1="245" y1="330" x2="245" y2="378" stroke="#db2777" stroke-width="1.2" stroke-dasharray="4 3"/>
    <text x="165" y="392" text-anchor="middle" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">a</text>
    <text x="245" y="392" text-anchor="middle" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">b</text>
    <text x="76" y="302" font-size="11" font-style="italic" fill="var(--text-muted,#57606a)">f(x)</text>
    <text x="205" y="424" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">阴影面积 = P(a &lt; X &lt; b)</text>
  </g>

  <!-- ==================== (d) 分布函数 ==================== -->
  <g>
    <text x="615" y="246" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">统一工具:分布函数 F(x)</text>
    <rect x="450" y="258" width="330" height="148" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <line x1="478" y1="266" x2="478" y2="392" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.4"/>
    <line x1="478" y1="392" x2="762" y2="392" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.4"/>
    <path d="M478 392 C560 392 566 330 615 320 C664 310 672 276 752 272"
          fill="none" stroke="#059669" stroke-width="2"/>
    <line x1="560" y1="336" x2="560" y2="392" stroke="#db2777" stroke-width="1.2" stroke-dasharray="4 3"/>
    <line x1="478" y1="336" x2="560" y2="336" stroke="#db2777" stroke-width="1.2" stroke-dasharray="4 3"/>
    <circle cx="560" cy="336" r="3.6" fill="#db2777"/>
    <text x="560" y="406" text-anchor="middle" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">x</text>
    <text x="470" y="340" text-anchor="end" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">F(x)</text>
    <text x="615" y="424" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">F(x) 是曲线在 x 处的高度,即 P(X ≤ x)</text>
  </g>
</svg>


# 2. 离散型随机变量

## 1. 分布律

> [!info] Def 2 分布律
> 设离散型随机变量 $X$ 的全部可能取值为 $x_1,x_2,\dots$，则称
> $$P(X=x_k)=p_k,\qquad k=1,2,\dots$$
> 为 $X$ 的**分布律**（probability distribution），也可写成表格：

| $X$ | $x_1$ | $x_2$ | $\cdots$ | $x_k$ | $\cdots$ |
| --- | --- | --- | --- | --- | --- |
| $P$ | $p_1$ | $p_2$ | $\cdots$ | $p_k$ | $\cdots$ |

## 2. 两条基本性质

1. **非负性**:$p_k \ge 0$
2. **规范性**:$\sum_{k=1}^{\infty} p_k = 1$

这两条是**判断一组数能否成为分布律**的标准。反过来,满足这两条的数一定能构成某个离散型随机变量的分布律。

上图 (b) 就是分布律的条形图——柱高之和恰为 1。

## 3. 求分布律的步骤

1. 确定 $X$ 的全部可能取值 $x_1,x_2,\dots$
2. 逐个求出 $P(X=x_k)$(往往要用第一、二章的公式)
3. 列表并验证 $\sum p_k=1$


# 3. 分布函数

## 1. 定义

> [!info] Def 3 分布函数
> 设 $X$ 是一个随机变量，$x$ 是任意实数，称
> $$F(x)=P(X\le x),\qquad -\infty<x<+\infty$$
> 为 $X$ 的**分布函数**（cumulative distribution function，简称 CDF）。

**关键意义**:$F(x)$ 把**离散型和连续型统一**了。无论 $X$ 是哪一类,$F$ 都有定义,都可以用来算概率。

> [!warning] $F(x)$ 是高度,不是面积
> $F(x)=P(X\le x)$ 是分布函数曲线在 $x$ 处的**纵坐标(高度)**。
> 不要和密度函数混淆——**曲线下的面积**是 $f(x)$ 的性质,不是 $F(x)$ 的。上图 (d) 中的虚线就是在标注这个高度。

## 2. 三条性质

1. **单调不减**:若 $x_1<x_2$,则 $F(x_1)\le F(x_2)$
2. **规范性**:$F(-\infty)=\lim\limits_{x\to-\infty}F(x)=0$,$F(+\infty)=\lim\limits_{x\to+\infty}F(x)=1$
3. **右连续**:$F(x+0)=F(x)$

反过来,满足这三条的函数一定是某个随机变量的分布函数。这三条和概率的三条公理是同一件事的两种说法。

## 3. 用分布函数求概率

这是 $F(x)$ 最常用的地方:

$$P(a<X\le b)=F(b)-F(a)$$

$$P(X>a)=1-F(a)$$

$$P(X<a)=F(a-0)\quad(\text{左极限})$$

> [!warning] 端点要不要取,差别很大
> $P(a<X\le b)=F(b)-F(a)$ 里,左端点**不取**、右端点**取**。
> - 对**连续型**,单点概率为 0,所以 $P(a<X<b)=P(a\le X\le b)$,端点无所谓。
> - 对**离散型**,单点概率不为 0,$P(X=a)=F(a)-F(a-0)$ 就是 $F$ 在 $a$ 处的**跳跃高度**,端点绝不能随手改。


# 4. 连续型随机变量

## 1. 概率密度

> [!info] Def 4 概率密度
> 若存在非负可积函数 $f(x)$，使得对任意实数 $x$ 都有
> $$F(x)=\int_{-\infty}^{x}f(t)\,\mathrm{d}t$$
> 则称 $X$ 为**连续型随机变量**（continuous random variable），$f(x)$ 为 $X$ 的**概率密度函数**（probability density function，简称 PDF）。

上式两边求导(在 $f$ 连续的点处)得 $F'(x)=f(x)$。所以 $f$ 是 $F$ 的导数,$F$ 是 $f$ 的积分。

## 2. 两条基本性质

1. **非负性**:$f(x)\ge 0$
2. **规范性**:$\int_{-\infty}^{+\infty} f(x)\,\mathrm{d}x = 1$

## 3. 用密度求概率

$$P(a<X<b)=\int_a^b f(x)\,\mathrm{d}x$$

即**曲线 $f(x)$ 在 $[a,b]$ 上与 $x$ 轴围成的面积**。上图 (c) 的阴影就是这个面积。

## 4. 四个必须注意的点

> [!warning] $f(x)$ 不是概率
> $f(x)$ 是**密度**,不是概率。它可以大于 1(只要积分等于 1 就行)。只有 $f(x)\mathrm{d}x$ 才近似是一个概率元。

- **$f(x)$ 可以大于 1**。例如均匀分布 $U(0,0.5)$ 的密度恒为 $2$。
- **单点概率为 0**:$P(X=a)=\int_a^a f\,\mathrm{d}x=0$。因此"概率为 0"不等于"不可能"。
- **$f(x)$ 在个别点可以任意改变**,不影响积分,也就不影响任何概率。所以密度函数不唯一(在有限个点上不同的两个函数是同一个随机变量的密度)。
- **$P(a<X<b)$ 与端点无关**,开区间闭区间都行。

## 5. 密度与分布函数的对偶关系

这是全章最该「看图记住」的一点:

- **左边是密度 $f(x)$**,它的**面积**给出概率
- **右边是分布函数 $F(x)$**,它的**高度**给出概率
- 两者由 $F(x)=\int_{-\infty}^{x} f(t)\,\mathrm{d}t$ 联系:**面积累积成高度**

同一个 $P(a<X<b)$,在左边读作「两条竖线之间的**阴影面积**」,在右边读作「两条**高度之差**」。同一个量,两种读法。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 245" width="100%" style="max-width:820px" font-family="inherit">
  <text x="410" y="18" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">密度的「面积」 = 分布函数的「高度」</text>

  <rect x="25" y="35" width="370" height="185" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
  <line x1="50" y1="205" x2="390" y2="205" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.4"/>
  <path d="M195.7,205.0 L195.7,106.4 L197.8,104.4 L199.9,102.4 L202.0,100.7 L204.1,99.1 L206.2,97.7 L208.3,96.5 L210.4,95.4 L212.6,94.6 L214.7,94.0 L216.8,93.5 L218.9,93.3 L221.0,93.3 L223.1,93.5 L225.2,93.9 L227.3,94.5 L229.4,95.4 L231.5,96.4 L233.6,97.6 L235.7,99.0 L237.8,100.6 L239.9,102.3 L242.0,104.2 L244.1,106.3 L246.2,108.5 L248.3,110.8 L250.4,113.2 L252.5,115.8 L254.6,118.4 L256.8,121.1 L258.9,123.9 L258.9,205.0 Z" fill="#a855f7" fill-opacity="0.55"/>
  <polyline points="50.0,204.8 53.8,204.7 57.6,204.6 61.3,204.5 65.1,204.3 68.9,204.1 72.7,203.9 76.4,203.6 80.2,203.2 84.0,202.8 87.8,202.3 91.6,201.6 95.3,200.9 99.1,200.0 102.9,198.9 106.7,197.7 110.4,196.2 114.2,194.6 118.0,192.7 121.8,190.5 125.6,188.1 129.3,185.4 133.1,182.4 136.9,179.2 140.7,175.6 144.4,171.7 148.2,167.5 152.0,163.1 155.8,158.4 159.6,153.5 163.3,148.4 167.1,143.3 170.9,138.0 174.7,132.7 178.4,127.5 182.2,122.5 186.0,117.6 189.8,113.0 193.6,108.7 197.3,104.8 201.1,101.4 204.9,98.6 208.7,96.3 212.4,94.6 216.2,93.6 220.0,93.3 223.8,93.6 227.6,94.6 231.3,96.3 235.1,98.6 238.9,101.4 242.7,104.8 246.4,108.7 250.2,113.0 254.0,117.6 257.8,122.5 261.6,127.5 265.3,132.7 269.1,138.0 272.9,143.3 276.7,148.4 280.4,153.5 284.2,158.4 288.0,163.1 291.8,167.5 295.6,171.7 299.3,175.6 303.1,179.2 306.9,182.4 310.7,185.4 314.4,188.1 318.2,190.5 322.0,192.7 325.8,194.6 329.6,196.2 333.3,197.7 337.1,198.9 340.9,200.0 344.7,200.9 348.4,201.6 352.2,202.3 356.0,202.8 359.8,203.2 363.6,203.6 367.3,203.9 371.1,204.1 374.9,204.3 378.7,204.5 382.4,204.6 386.2,204.7 390.0,204.8" fill="none" stroke="#7c3aed" stroke-width="2"/>
  <line x1="195.7" y1="106.4" x2="195.7" y2="205" stroke="#db2777" stroke-width="1.2" stroke-dasharray="4 3"/>
  <line x1="258.9" y1="123.9" x2="258.9" y2="205" stroke="#db2777" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text x="195.7" y="220" text-anchor="middle" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">a</text>
  <text x="258.9" y="220" text-anchor="middle" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">b</text>
  <text x="60" y="70" font-size="11" font-style="italic" fill="var(--text-muted,#57606a)">f(x)</text>
  <text x="210" y="245" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">阴影面积 = P(a &lt; X &lt; b)</text>

  <rect x="450" y="35" width="360" height="185" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
  <line x1="470" y1="95" x2="470" y2="205" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.4"/>
  <line x1="470" y1="205" x2="800" y2="205" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.4"/>
  <polyline points="470.0,205.0 473.7,205.0 477.3,205.0 481.0,204.9 484.7,204.9 488.3,204.9 492.0,204.9 495.7,204.8 499.3,204.8 503.0,204.7 506.7,204.6 510.3,204.5 514.0,204.4 517.7,204.3 521.3,204.1 525.0,203.9 528.7,203.7 532.3,203.4 536.0,203.0 539.7,202.6 543.3,202.1 547.0,201.6 550.7,201.0 554.3,200.2 558.0,199.4 561.7,198.4 565.3,197.3 569.0,196.1 572.7,194.8 576.3,193.3 580.0,191.6 583.7,189.8 587.3,187.8 591.0,185.7 594.7,183.4 598.3,181.0 602.0,178.4 605.7,175.6 609.3,172.8 613.0,169.8 616.7,166.6 620.3,163.4 624.0,160.1 627.7,156.8 631.3,153.4 635.0,150.0 638.7,146.6 642.3,143.2 646.0,139.9 649.7,136.6 653.3,133.4 657.0,130.2 660.7,127.2 664.3,124.4 668.0,121.6 671.7,119.0 675.3,116.6 679.0,114.3 682.7,112.2 686.3,110.2 690.0,108.4 693.7,106.7 697.3,105.2 701.0,103.9 704.7,102.7 708.3,101.6 712.0,100.6 715.7,99.8 719.3,99.0 723.0,98.4 726.7,97.9 730.3,97.4 734.0,97.0 737.7,96.6 741.3,96.3 745.0,96.1 748.7,95.9 752.3,95.7 756.0,95.6 759.7,95.5 763.3,95.4 767.0,95.3 770.7,95.2 774.3,95.2 778.0,95.1 781.7,95.1 785.3,95.1 789.0,95.1 792.7,95.0 796.3,95.0 800.0,95.0" fill="none" stroke="#059669" stroke-width="2"/>
  <line x1="611.4" y1="171.1" x2="611.4" y2="205" stroke="#db2777" stroke-width="1.2" stroke-dasharray="4 3"/>
  <line x1="672.7" y1="118.3" x2="672.7" y2="205" stroke="#db2777" stroke-width="1.2" stroke-dasharray="4 3"/>
  <line x1="611.4" y1="171.1" x2="790" y2="171.1" stroke="#db2777" stroke-width="1.2" stroke-dasharray="4 3"/>
  <line x1="672.7" y1="118.3" x2="790" y2="118.3" stroke="#db2777" stroke-width="1.2" stroke-dasharray="4 3"/>
  <circle cx="611.4" cy="171.1" r="3.4" fill="#db2777"/>
  <circle cx="672.7" cy="118.3" r="3.4" fill="#db2777"/>
  <line x1="735" y1="118.3" x2="735" y2="171.1" stroke="#db2777" stroke-width="1.4"/>
  <polygon points="735,118.3 730,126.3 740,126.3" fill="#db2777"/>
  <polygon points="735,171.1 730,163.1 740,163.1" fill="#db2777"/>
  <text x="790" y="165.1" text-anchor="end" font-size="10.5" fill="var(--text-muted,#57606a)">F(a)</text>
  <text x="790" y="112.3" text-anchor="end" font-size="10.5" fill="var(--text-muted,#57606a)">F(b)</text>
  <text x="735" y="189.1" text-anchor="middle" font-size="10.5" font-weight="600" fill="#db2777">F(b) − F(a)</text>
  <text x="611.4" y="220" text-anchor="middle" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">a</text>
  <text x="672.7" y="220" text-anchor="middle" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">b</text>
  <text x="458" y="70" font-size="11" font-style="italic" fill="var(--text-muted,#57606a)">F(x)</text>
  <text x="630" y="245" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">两高度之差 = P(a &lt; X &lt; b)</text>
</svg>

> [!tip] 一句话记住
> **密度看面积,分布看高度。** 求导把面积变成高度,积分把高度变回面积。


# 5. 常见分布

## 1. 离散型

> [!info] Def 5 0-1 分布
> **0-1 分布**（两点分布）：$X$ 只取 0 和 1。

$$P(X=1)=p,\qquad P(X=0)=1-p,\qquad 0<p<1$$

记作 $X\sim B(1,p)$。一次试验的"成功/失败"就是它。

> [!info] Def 6 二项分布
> **二项分布**（binomial distribution）：$n$ 重伯努利试验中成功的次数。

$$P(X=k)=\binom{n}{k}p^k(1-p)^{n-k},\qquad k=0,1,\dots,n$$

记作 $X\sim B(n,p)$。这就是上一章二项概率公式的随机变量版本。

> [!info] Def 7 泊松分布
> **泊松分布**（Poisson distribution）：

$$P(X=k)=\frac{\lambda^k}{k!}e^{-\lambda},\qquad k=0,1,2,\dots,\quad \lambda>0$$

记作 $X\sim P(\lambda)$。描述"某段时间内稀有事件发生的次数"——呼叫到达、器件失效、放射性衰变。

> [!tip] 泊松是二项分布的极限
> 当 $n$ 很大、$p$ 很小、$np=\lambda$ 适中时,$B(n,p)$ 近似为 $P(\lambda)$。这就是**泊松定理**,工程上常用来简化计算(如误码计数)。

> [!info] Def 8 几何分布
> **几何分布**（geometric distribution）：首次成功所需的试验次数。

$$P(X=k)=(1-p)^{k-1}p,\qquad k=1,2,\dots$$

## 2. 连续型

> [!info] Def 9 均匀分布
> **均匀分布**（uniform distribution）$X\sim U(a,b)$：

$$f(x)=\begin{cases}\dfrac{1}{b-a}, & a<x<b\\[2mm] 0, & \text{其他}\end{cases}$$

> [!info] Def 10 指数分布
> **指数分布**（exponential distribution）$X\sim E(\lambda)$：

$$f(x)=\begin{cases}\lambda e^{-\lambda x}, & x>0\\ 0, & x\le 0\end{cases},\qquad F(x)=\begin{cases}1-e^{-\lambda x}, & x>0\\ 0, & x\le 0\end{cases}$$

描述**寿命、等待时间**。它的独特性质是**无记忆性**:

$$P(X>s+t\mid X>s)=P(X>t)$$

即"已经用了 $s$ 小时还没坏"不改变"还能再用 $t$ 小时"的概率。

> [!info] Def 11 正态分布
> **正态分布**（normal distribution）$X\sim N(\mu,\sigma^2)$：

$$f(x)=\frac{1}{\sqrt{2\pi}\,\sigma}\exp\left[-\frac{(x-\mu)^2}{2\sigma^2}\right],\qquad -\infty<x<+\infty$$

其中 $\mu$ 是**位置参数**(决定对称中心),$\sigma$ 是**尺度参数**(决定胖瘦)。$f$ 关于 $x=\mu$ 对称,在 $x=\mu$ 处取最大值。

**标准正态分布** $X\sim N(0,1)$,密度记作 $\varphi(x)$,分布函数记作 $\Phi(x)$。

**标准化**:若 $X\sim N(\mu,\sigma^2)$,则

$$Z=\frac{X-\mu}{\sigma}\sim N(0,1)$$

于是

$$P(a<X<b)=\Phi\!\left(\frac{b-\mu}{\sigma}\right)-\Phi\!\left(\frac{a-\mu}{\sigma}\right)$$

**为什么正态分布这么重要**:中心极限定理——大量独立同分布的随机变量之和近似服从正态分布。通信中的热噪声、测量误差都是它的典型来源。

## 3. 通信中常用的衰落分布

上面七个是通用分布,而通信里真正天天打交道的是**衰落信道**的包络分布。它们几乎都从正态分布"派生"出来——因为接收信号是大量散射分量的叠加,由中心极限定理,其**同相/正交分量各自近似正态**。

### (1) 瑞利分布(Rayleigh)

**物理来源**:多径信道中**没有直射路径**(NLOS),接收信号是 $N$ 条散射波的叠加:

$$r(t)=\sum_{i=1}^{N} a_i\cos(\omega_c t+\phi_i)$$

写成复基带形式 $r=X+jY$,由中心极限定理,$X\sim N(0,\sigma^2)$、$Y\sim N(0,\sigma^2)$ 且相互独立。包络 $R=\sqrt{X^2+Y^2}$ 服从**瑞利分布**:

$$f_R(r)=\frac{r}{\sigma^2}\exp\left(-\frac{r^2}{2\sigma^2}\right),\qquad r\ge 0$$

$$F_R(r)=1-\exp\left(-\frac{r^2}{2\sigma^2}\right),\qquad r\ge 0$$

**要点**:

- 参数只有一个 $\sigma$,由散射功率决定。$\sigma$ 越大,包络越分散。
- 均值 $E[R]=\sigma\sqrt{\pi/2}\approx 1.253\sigma$,均方值 $E[R^2]=2\sigma^2$。
- 在 $r=\sigma$ 处取最大值(众数)。
- **适用条件**:无直射分量、散射体足够多。城市密集区、室内环境的典型模型。

> [!tip] 记忆要点
> **瑞利 = 两个独立同方差高斯变量的模**。这是它全部性质的来源。

### (2) 莱斯分布(Rician)

**物理来源**:多径之外**还有一条直射路径**(LOS),比如视距通信、卫星链路。此时复包络变成

$$r=A+X+jY$$

其中 $A$ 是直射分量的确定幅度,$X,Y\sim N(0,\sigma^2)$ 独立。包络 $R=|r|$ 服从**莱斯分布**:

$$f_R(r)=\frac{r}{\sigma^2}\exp\left(-\frac{r^2+A^2}{2\sigma^2}\right)I_0\!\left(\frac{Ar}{\sigma^2}\right),\qquad r\ge 0$$

其中 $I_0(\cdot)$ 是**第一类零阶修正贝塞尔函数**:

$$I_0(z)=\frac{1}{2\pi}\int_0^{2\pi}e^{z\cos\theta}\,\mathrm{d}\theta=\sum_{k=0}^{\infty}\frac{1}{(k!)^2}\left(\frac{z}{2}\right)^{2k}$$

**莱斯因子 $K$**——衡量"直射有多强":

$$K=\frac{A^2}{2\sigma^2}=\frac{\text{直射功率}}{\text{散射功率}}$$

$K$ 是莱斯分布最重要的参数:

| $K$ | 含义 | 退化为 |
| --- | --- | --- |
| $K=0$ | 无直射分量 | **瑞利分布** |
| $K=\infty$ | 纯直射 | 确定性(高斯) |
| $K$ 较大 | 视距主导 | 接近高斯 |
| $K$ 较小 | 散射主导 | 接近瑞利 |

> [!note] 瑞利是莱斯的特例
> 令 $A=0$(即 $K=0$),有 $I_0(0)=1$,莱斯分布立刻退化为瑞利分布。
> 所以实际建模时常先定 $K$:$K=0$ 就是瑞利,不必另立模型。

**典型 $K$ 值**:开阔乡村约 $10\sim 20$ dB,郊区约 $5\sim 10$ dB,城市密集区接近 $0$ dB。

### (3) 三个分布的统一视角

把上述关系画成一张图:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 400" width="100%" style="max-width:820px" font-family="inherit">
  <defs>
    <marker id="fd-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <path d="M0,0 L7,3.5 L0,7 z" fill="#8b5cf6"/>
    </marker>
  </defs>

  <!-- 左:复高斯分解 -->
  <g>
    <text x="205" y="18" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">接收信号的复包络分解</text>
    <rect x="40" y="30" width="330" height="200" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <line x1="90" y1="130" x2="290" y2="130" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.2"/>
    <line x1="190" y1="60" x2="190" y2="200" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.2"/>
    <text x="296" y="134" font-size="10.5" font-style="italic" fill="var(--text-faint,#8b949e)">X</text>
    <text x="182" y="56" font-size="10.5" font-style="italic" fill="var(--text-faint,#8b949e)">Y</text>
    <path d="M190 130 L268 84" stroke="#4f46e5" stroke-width="2.2" marker-end="url(#fd-arrow)"/>
    <text x="252" y="76" font-size="11" font-weight="600" fill="#4f46e5">A</text>
    <path d="M190 130 L246 166" stroke="#db2777" stroke-width="2.2" marker-end="url(#fd-arrow)"/>
    <text x="252" y="180" font-size="11" font-weight="600" fill="#db2777">R</text>
    <circle cx="190" cy="130" r="3.4" fill="var(--text-normal,#1f2328)"/>
    <path d="M224 130 A 34 34 0 0 0 216 148" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1"/>
    <text x="236" y="146" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">θ</text>
    <text x="205" y="220" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">R = |A + X + jY|</text>
  </g>

  <!-- 右:演化关系 -->
  <g>
    <text x="615" y="18" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">衰落分布的谱系</text>
    <rect x="450" y="30" width="330" height="200" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <rect x="490" y="50" width="250" height="34" rx="6" fill="#6366f1" fill-opacity="0.20" stroke="#4f46e5" stroke-width="1.4"/>
    <text x="615" y="72" text-anchor="middle" font-size="11.5" fill="var(--text-normal,#1f2328)">莱斯分布(K ≥ 0)</text>
    <path d="M615 84 L615 106" stroke="#8b5cf6" stroke-width="1.6" marker-end="url(#fd-arrow)"/>
    <text x="628" y="100" font-size="10.5" fill="var(--text-muted,#57606a)">K = 0</text>
    <rect x="490" y="110" width="250" height="34" rx="6" fill="#a855f7" fill-opacity="0.22" stroke="#7c3aed" stroke-width="1.4"/>
    <text x="615" y="132" text-anchor="middle" font-size="11.5" fill="var(--text-normal,#1f2328)">瑞利分布(无直射)</text>
    <path d="M615 144 L615 166" stroke="#8b5cf6" stroke-width="1.6" marker-end="url(#fd-arrow)"/>
    <text x="628" y="160" font-size="10.5" fill="var(--text-muted,#57606a)">m = 1</text>
    <rect x="490" y="170" width="250" height="34" rx="6" fill="#10b981" fill-opacity="0.22" stroke="#059669" stroke-width="1.4"/>
    <text x="615" y="192" text-anchor="middle" font-size="11.5" fill="var(--text-normal,#1f2328)">Nakagami-m(m ≥ 1/2)</text>
    <text x="615" y="222" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">K → 0 时莱斯退化为瑞利</text>
  </g>

  <!-- 底部:三分布曲线对比 -->
  <g>
    <text x="410" y="264" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">三种分布的密度曲线对比(相同平均功率)</text>
    <rect x="40" y="276" width="740" height="112" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <line x1="70" y1="366" x2="750" y2="366" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.4"/>
    <!-- 瑞利(K=0):峰值 r≈0.707 -->
    <path d="M70.0 366.0 L80.8 363.2 L91.5 360.5 L102.2 357.8 L113.0 355.2 L123.8 352.8 L134.5 350.6 L145.2 348.7 L156.0 346.9 L166.8 345.4 L177.5 344.2 L188.2 343.2 L199.0 342.6 L209.8 342.1 L220.5 342.0 L231.3 342.1 L242.0 342.4 L252.8 342.9 L263.5 343.6 L274.3 344.4 L285.0 345.4 L295.8 346.5 L306.5 347.6 L317.3 348.8 L328.0 350.1 L338.8 351.3 L349.5 352.6 L360.3 353.8 L371.0 355.0 L381.8 356.1 L392.5 357.1 L403.3 358.1 L414.0 359.1 L424.8 359.9 L435.5 360.7 L446.3 361.4 L457.0 362.1 L467.8 362.6 L478.5 363.1 L489.3 363.6 L500.0 363.9 L510.8 364.3 L521.5 364.6 L532.2 364.8 L543.0 365.0 L553.8 365.2 L564.5 365.4 L575.2 365.5 L586.0 365.6 L596.7 365.7 L607.5 365.7 L618.2 365.8 L629.0 365.8 L639.7 365.9 L650.5 365.9 L661.2 365.9 L672.0 365.9 L682.7 366.0 L693.5 366.0 L704.2 366.0 L715.0 366.0"
          fill="none" stroke="#7c3aed" stroke-width="2"/>
    <!-- 莱斯 K=6dB:峰值 r≈0.945 -->
    <path d="M70.0 366.0 L80.8 365.7 L91.5 365.4 L102.2 365.0 L113.0 364.3 L123.8 363.4 L134.5 362.3 L145.2 360.7 L156.0 358.7 L166.8 356.3 L177.5 353.4 L188.2 350.2 L199.0 346.7 L209.8 343.1 L220.5 339.6 L231.3 336.3 L242.0 333.5 L252.8 331.3 L263.5 330.0 L274.3 329.6 L285.0 330.2 L295.8 331.7 L306.5 333.9 L317.3 336.8 L328.0 340.1 L338.8 343.6 L349.5 347.1 L360.3 350.5 L371.0 353.5 L381.8 356.3 L392.5 358.6 L403.3 360.5 L414.0 362.0 L424.8 363.2 L435.5 364.1 L446.3 364.7 L457.0 365.2 L467.8 365.5 L478.5 365.7 L489.3 365.8 L500.0 365.9 L510.8 365.9 L521.5 366.0 L532.2 366.0 L543.0 366.0 L553.8 366.0 L564.5 366.0 L575.2 366.0 L586.0 366.0 L596.7 366.0 L607.5 366.0 L618.2 366.0 L629.0 366.0 L639.7 366.0 L650.5 366.0 L661.2 366.0 L672.0 366.0 L682.7 366.0 L693.5 366.0 L704.2 366.0 L715.0 366.0"
          fill="none" stroke="#4f46e5" stroke-width="2"/>
    <!-- 莱斯 K=12dB:峰值 r≈0.985,更窄更高 -->
    <path d="M70.0 366.0 L80.8 366.0 L91.5 366.0 L102.2 366.0 L113.0 366.0 L123.8 366.0 L134.5 366.0 L145.2 365.9 L156.0 365.8 L166.8 365.5 L177.5 364.9 L188.2 363.5 L199.0 360.9 L209.8 356.5 L220.5 349.8 L231.3 340.6 L242.0 329.6 L252.8 318.1 L263.5 308.2 L274.3 302.0 L285.0 300.9 L295.8 305.2 L306.5 313.9 L317.3 325.0 L328.0 336.4 L338.8 346.3 L349.5 354.0 L360.3 359.3 L371.0 362.5 L381.8 364.4 L392.5 365.3 L403.3 365.7 L414.0 365.9 L424.8 366.0 L435.5 366.0 L446.3 366.0 L457.0 366.0 L467.8 366.0 L478.5 366.0 L489.3 366.0 L500.0 366.0 L510.8 366.0 L521.5 366.0 L532.2 366.0 L543.0 366.0 L553.8 366.0 L564.5 366.0 L575.2 366.0 L586.0 366.0 L596.7 366.0 L607.5 366.0 L618.2 366.0 L629.0 366.0 L639.7 366.0 L650.5 366.0 L661.2 366.0 L672.0 366.0 L682.7 366.0 L693.5 366.0 L704.2 366.0 L715.0 366.0"
          fill="none" stroke="#db2777" stroke-width="1.8" stroke-dasharray="6 4"/>
    <!-- 图例 -->
    <line x1="470" y1="292" x2="500" y2="292" stroke="#7c3aed" stroke-width="2"/>
    <text x="508" y="296" font-size="11" fill="var(--text-muted,#57606a)">瑞利(K = 0)</text>
    <line x1="470" y1="312" x2="500" y2="312" stroke="#4f46e5" stroke-width="2"/>
    <text x="508" y="316" font-size="11" fill="var(--text-muted,#57606a)">莱斯(K = 6 dB)</text>
    <line x1="470" y1="332" x2="500" y2="332" stroke="#db2777" stroke-width="1.8" stroke-dasharray="6 4"/>
    <text x="508" y="336" font-size="11" fill="var(--text-muted,#57606a)">莱斯(K = 12 dB)</text>
    <text x="80" y="288" font-size="11" font-style="italic" fill="var(--text-muted,#57606a)">f(r)</text>
    <text x="740" y="382" text-anchor="end" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">r</text>
  </g>
</svg>

**读图要点**:$K$ 增大时,直射分量主导,包络集中到 $A$ 附近,曲线**变窄并右移**,趋近于确定性; $K$ 减小到 $0$,曲线退化为瑞利,峰值左移且拖尾变长。**拖尾越长,深衰落越频繁,误码率越差**。

## 4. 阴影衰落与更多分布

### (1) 对数正态分布(Log-normal)

**物理来源**:瑞利/莱斯描述的是**小尺度衰落**(几波长内)。而**大尺度阴影衰落**——建筑物、山体遮挡导致的功率起伏——服从对数正态分布。

设接收功率为 $P$,令 $X=10\lg P$(dB 值),则

$$X\sim N(\mu,\ \sigma^2)$$

即**功率的分贝值服从正态分布**,等价地说 $P$ 本身服从对数正态分布:

$$f_P(p)=\frac{1}{p\sigma\sqrt{2\pi}}\exp\left[-\frac{(\ln p-\mu')^2}{2\sigma^2}\right],\qquad p>0$$

其中 $\mu'$ 是 $\ln P$ 的均值。

**要点**:

- **乘性模型**:$P=P_0\cdot 10^{X/10}$,阴影是"乘以"一个随机因子。
- $\sigma$ 典型值:室外 $4\sim 12$ dB,室内 $3\sim 8$ dB。
- 与瑞利**级联**构成**复合衰落**模型(如 Suzuki 分布):先阴影后多径。

> [!tip] 为什么是"对数"正态
> 因为 dB 是**对数单位**。取对数后正态,说明"以 dB 计的衰落量"是大量独立小贡献之和——又回到中心极限定理。

### (2) Nakagami-m 分布

**物理来源**:实验拟合多径信道最灵活的模型,涵盖从严重衰落到接近无衰落的各种情形:

$$f_R(r)=\frac{2m^m r^{2m-1}}{\Gamma(m)\,\Omega^m}\exp\left(-\frac{m r^2}{\Omega}\right),\qquad r\ge 0$$

其中 $\Omega=E[R^2]$ 是平均功率,$m\ge 1/2$ 是**衰落指数**,$\Gamma(\cdot)$ 是伽马函数。

**$m$ 的意义**:

| $m$ | 信道状况 |
| --- | --- |
| $m=1/2$ | 最严重衰落(单边高斯) |
| $m=1$ | **退化为瑞利分布** |
| $m>1$ | 衰落减轻 |
| $m\to\infty$ | 无衰落(确定性) |

**为什么用它**:瑞利和莱斯的理论推导都有理想化假设,而 Nakagami-m 能**通过调 $m$ 拟合实测数据**,且很多性能公式有闭式解。在 5G 信道建模中被广泛采用。

### (3) 韦布尔分布(Weibull)

$$f_R(r)=\frac{k}{\lambda}\left(\frac{r}{\lambda}\right)^{k-1}\exp\left[-\left(\frac{r}{\lambda}\right)^{k}\right],\qquad r\ge 0$$

$k$ 是**形状参数**,$\lambda$ 是**尺度参数**。$k=2$ 时退化为瑞利分布。

**用途**:室内多径、雷达杂波建模,以及**可靠性工程中的寿命分布**(与指数分布并列,指数是 $k=1$ 的特例)。

### (4) 伽马分布(Gamma)

$$f(x)=\frac{\beta^{\alpha}}{\Gamma(\alpha)}x^{\alpha-1}e^{-\beta x},\qquad x>0$$

$\alpha$ 为形状参数,$\beta$ 为速率参数。它是**指数分布的推广**($\alpha=1$ 时退化为指数),也是 $n$ 个独立指数变量之和的分布。

**通信中的用途**:

- 描述**多径到达时间间隔**;
- $\alpha=n/2$、$\beta=1/2$ 时即为**卡方分布** $\chi^2(n)$;
- 莱斯衰落下**信噪比**的分布与它相关。

### (5) 卡方分布(Chi-square)

设 $X_1,\dots,X_n$ 相互独立且都服从 $N(0,1)$,则

$$\chi^2=X_1^2+X_2^2+\cdots+X_n^2\sim\chi^2(n)$$

$n$ 称为**自由度**。

$$f(x)=\frac{1}{2^{n/2}\Gamma(n/2)}x^{n/2-1}e^{-x/2},\qquad x>0$$

**通信中的用途**:

- **能量检测**:接收能量 $=\sum x_i^2$,在无信号时服从中心卡方,有信号时服从非中心卡方——这是**频谱感知**的理论基础;
- **分集合并**的性能分析;
- 高斯噪声下统计量的分布。

### (6) 拉普拉斯分布(Laplace)

$$f(x)=\frac{1}{2b}\exp\left(-\frac{|x-\mu|}{b}\right)$$

比正态分布**尖峰厚尾**。用于建模**稀疏信号**(压缩感知中的先验分布),以及某些脉冲噪声环境。

## 5. 分布一览

| 分布 | 记号 | 取值 | 典型场景 |
| --- | --- | --- | --- |
| 0-1 | $B(1,p)$ | $\{0,1\}$ | 单次试验成败 |
| 二项 | $B(n,p)$ | $\{0,\dots,n\}$ | $n$ 次试验成功数 |
| 泊松 | $P(\lambda)$ | $\{0,1,2,\dots\}$ | 稀有事件计数、呼叫到达 |
| 几何 | $G(p)$ | $\{1,2,\dots\}$ | 首次成功等待 |
| 均匀 | $U(a,b)$ | $(a,b)$ | 无偏好取值、量化误差 |
| 指数 | $E(\lambda)$ | $(0,+\infty)$ | 寿命、等待时间 |
| 正态 | $N(\mu,\sigma^2)$ | $\mathbb{R}$ | 热噪声、测量误差 |
| **瑞利** | $R(\sigma)$ | $[0,+\infty)$ | **小尺度衰落(无直射)** |
| **莱斯** | $K,\sigma$ | $[0,+\infty)$ | **小尺度衰落(有直射)** |
| **Nakagami-m** | $m,\Omega$ | $[0,+\infty)$ | **衰落信道拟合** |
| **韦布尔** | $k,\lambda$ | $[0,+\infty)$ | **室内多径、雷达杂波** |
| **对数正态** | $N(\mu,\sigma^2)$(dB) | $(0,+\infty)$ | **阴影衰落** |
| **伽马** | $\Gamma(\alpha,\beta)$ | $(0,+\infty)$ | **到达时间间隔** |
| **卡方** | $\chi^2(n)$ | $(0,+\infty)$ | **能量检测、分集** |
| **拉普拉斯** | $\text{Lap}(\mu,b)$ | $\mathbb{R}$ | **稀疏信号、脉冲噪声** |

> [!note] 加粗行为通信方向重点
> 前七行是通用分布,后八行在通信中最常用。**瑞利、莱斯、对数正态**三者尤其重要——它们分别对应**小尺度无直射衰落、小尺度有直射衰落、大尺度阴影衰落**,是信道建模的三大支柱。

## 6. 衰落分布速查表

| 项目 | 瑞利 | 莱斯 | Nakagami-m | 对数正态 |
| --- | --- | --- | --- | --- |
| 参数 | $\sigma$ | $A,\sigma$ | $m,\Omega$ | $\mu,\sigma$(dB) |
| 直射分量 | 无 | 有 | 无(统计意义) | — |
| 尺度 | 小尺度 | 小尺度 | 小尺度 | 大尺度 |
| $E[R^2]$ | $2\sigma^2$ | $A^2+2\sigma^2$ | $\Omega$ | $e^{2\mu'+\sigma^2}$ |
| 特例 | 莱斯 $K=0$ | — | $m=1$ 即瑞利 | — |
| 典型场景 | 城市、室内 | 乡村、卫星 | 通用拟合 | 遮挡、室内 |

## 7. 分布选择速查图

上面的分布不必死记。真正要练的是**看到问题能认出该用哪个**。下图按「问什么」来分流:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 420" width="100%" style="max-width:820px" font-family="inherit">
  <defs>
    <marker id="dg-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 z" fill="#94a3b8"/>
    </marker>
  </defs>
  <text x="410" y="18" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">拿到一个问题,该用哪个分布?</text>
  <rect x="40" y="32" width="350" height="370" rx="6" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
  <text x="215" y="56" text-anchor="middle" font-size="12.5" font-weight="600" fill="#4f46e5">离散型  ·  取值可以一个个数出来</text>
  <text x="54" y="105.5" font-size="10.5" fill="var(--text-normal,#1f2328)">成功 / 失败 两种结果?</text>
  <line x1="232" y1="102.0" x2="240" y2="102.0" stroke="#6366f1" stroke-width="1.2" marker-end="url(#dg-arrow)"/>
  <rect x="244" y="89.5" width="134" height="25" rx="12.5" fill="#6366f1" fill-opacity="0.20" stroke="#6366f1" stroke-width="1.2"/>
  <text x="311" y="106.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">0-1 分布</text>
  <text x="54" y="161.5" font-size="10.5" fill="var(--text-normal,#1f2328)">n 次独立试验的成功次数?</text>
  <line x1="232" y1="158.0" x2="240" y2="158.0" stroke="#6366f1" stroke-width="1.2" marker-end="url(#dg-arrow)"/>
  <rect x="244" y="145.5" width="134" height="25" rx="12.5" fill="#6366f1" fill-opacity="0.20" stroke="#6366f1" stroke-width="1.2"/>
  <text x="311" y="162.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">二项分布</text>
  <text x="54" y="217.5" font-size="10.5" fill="var(--text-normal,#1f2328)">单位时间内稀有事件次数?</text>
  <line x1="232" y1="214.0" x2="240" y2="214.0" stroke="#6366f1" stroke-width="1.2" marker-end="url(#dg-arrow)"/>
  <rect x="244" y="201.5" width="134" height="25" rx="12.5" fill="#6366f1" fill-opacity="0.20" stroke="#6366f1" stroke-width="1.2"/>
  <text x="311" y="218.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">泊松分布</text>
  <text x="54" y="273.5" font-size="10.5" fill="var(--text-normal,#1f2328)">首次成功所需的试验次数?</text>
  <line x1="232" y1="270.0" x2="240" y2="270.0" stroke="#6366f1" stroke-width="1.2" marker-end="url(#dg-arrow)"/>
  <rect x="244" y="257.5" width="134" height="25" rx="12.5" fill="#6366f1" fill-opacity="0.20" stroke="#6366f1" stroke-width="1.2"/>
  <text x="311" y="274.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">几何分布</text>
  <rect x="430" y="32" width="350" height="370" rx="6" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
  <text x="605" y="56" text-anchor="middle" font-size="12.5" font-weight="600" fill="#7c3aed">连续型  ·  取值充满一段区间</text>
  <text x="444" y="95.5" font-size="10.5" fill="var(--text-normal,#1f2328)">等可能地落在某区间内?</text>
  <line x1="622" y1="92.0" x2="630" y2="92.0" stroke="#a855f7" stroke-width="1.2" marker-end="url(#dg-arrow)"/>
  <rect x="634" y="79.5" width="134" height="25" rx="12.5" fill="#a855f7" fill-opacity="0.20" stroke="#a855f7" stroke-width="1.2"/>
  <text x="701" y="96.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">均匀分布</text>
  <text x="444" y="145.5" font-size="10.5" fill="var(--text-normal,#1f2328)">等待时间 / 器件寿命?</text>
  <line x1="622" y1="142.0" x2="630" y2="142.0" stroke="#a855f7" stroke-width="1.2" marker-end="url(#dg-arrow)"/>
  <rect x="634" y="129.5" width="134" height="25" rx="12.5" fill="#a855f7" fill-opacity="0.20" stroke="#a855f7" stroke-width="1.2"/>
  <text x="701" y="146.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">指数分布</text>
  <text x="444" y="195.5" font-size="10.5" fill="var(--text-normal,#1f2328)">大量独立因素叠加的误差?</text>
  <line x1="622" y1="192.0" x2="630" y2="192.0" stroke="#a855f7" stroke-width="1.2" marker-end="url(#dg-arrow)"/>
  <rect x="634" y="179.5" width="134" height="25" rx="12.5" fill="#a855f7" fill-opacity="0.20" stroke="#a855f7" stroke-width="1.2"/>
  <text x="701" y="196.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">正态分布</text>
  <text x="444" y="245.5" font-size="10.5" fill="var(--text-normal,#1f2328)">多径包络,无直射路径?</text>
  <line x1="622" y1="242.0" x2="630" y2="242.0" stroke="#059669" stroke-width="1.2" marker-end="url(#dg-arrow)"/>
  <rect x="634" y="229.5" width="134" height="25" rx="12.5" fill="#059669" fill-opacity="0.20" stroke="#059669" stroke-width="1.2"/>
  <text x="701" y="246.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">瑞利分布</text>
  <text x="444" y="295.5" font-size="10.5" fill="var(--text-normal,#1f2328)">多径包络,有直射路径?</text>
  <line x1="622" y1="292.0" x2="630" y2="292.0" stroke="#059669" stroke-width="1.2" marker-end="url(#dg-arrow)"/>
  <rect x="634" y="279.5" width="134" height="25" rx="12.5" fill="#059669" fill-opacity="0.20" stroke="#059669" stroke-width="1.2"/>
  <text x="701" y="296.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">莱斯分布</text>
  <text x="444" y="345.5" font-size="10.5" fill="var(--text-normal,#1f2328)">大尺度遮挡,dB 值?</text>
  <line x1="622" y1="342.0" x2="630" y2="342.0" stroke="#059669" stroke-width="1.2" marker-end="url(#dg-arrow)"/>
  <rect x="634" y="329.5" width="134" height="25" rx="12.5" fill="#059669" fill-opacity="0.20" stroke="#059669" stroke-width="1.2"/>
  <text x="701" y="346.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">对数正态</text>
  <text x="215" y="332" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">口诀:数出来的用离散,量出来的用连续</text>
  <text x="215" y="356" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">「计数」找泊松,「次数」找二项</text>
  <text x="215" y="380" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">「等第几次」找几何</text>
</svg>

> [!tip] 三条最常考的判断
> 1. **数得出来 vs 量得出来**——离散还是连续,这是第一刀。
> 2. **固定次数 vs 单位时间**——二项分布问的是「$n$ 次里成功几次」,泊松分布问的是「一段时间里来了几个」。前者 $n$ 是定数,后者 $n$ 本身就不存在。
> 3. **有没有直射路径**——多径包络建模时,$K=0$ 用瑞利,有直射用莱斯。


## 8. 两级衰落:一张图看懂尺度差异

通信里的衰落不是一种,而是**两个尺度叠加**。下图把两者画在同一时间轴上:

- **蓝线**是总接收功率,剧烈抖动——这是**快衰落**(小尺度,多径引起,瑞利/莱斯)
- **橙线**是它的慢变趋势——这是**慢衰落**(大尺度,遮挡引起,对数正态)

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 300" width="100%" style="max-width:820px" font-family="inherit">
  <text x="410" y="18" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">两级衰落:慢衰落(阴影) + 快衰落(多径)</text>

  <rect x="45" y="34" width="755" height="238" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>

  <line x1="75" y1="245" x2="780" y2="245" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.3"/>
  <line x1="75" y1="100" x2="75" y2="245" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.3"/>

  <line x1="75" y1="147.0" x2="780" y2="147.0" stroke="var(--text-faint,#8b949e)" stroke-width="0.9" stroke-dasharray="3 4"/>
  <text x="75" y="150.5" text-anchor="end" font-size="10" fill="var(--text-faint,#8b949e)">0 dB</text>
  <line x1="75" y1="186.2" x2="780" y2="186.2" stroke="var(--text-faint,#8b949e)" stroke-width="0.9" stroke-dasharray="3 4"/>
  <text x="75" y="189.7" text-anchor="end" font-size="10" fill="var(--text-faint,#8b949e)">−10 dB</text>

  <polyline points="75.0,133.5 79.7,131.8 84.4,130.6 89.1,130.0 93.8,130.1 98.5,130.9 103.2,132.3 107.9,134.3 112.6,136.5 117.3,138.8 122.0,140.9 126.7,142.7 131.4,143.9 136.1,144.3 140.8,144.0 145.5,143.0 150.2,141.3 154.9,139.2 159.6,136.8 164.3,134.3 169.0,132.1 173.7,130.3 178.4,129.1 183.1,128.6 187.8,128.7 192.5,129.5 197.2,130.8 201.9,132.5 206.6,134.4 211.3,136.3 216.0,138.1 220.7,139.8 225.4,141.2 230.1,142.5 234.8,143.7 239.5,144.8 244.2,146.1 248.9,147.6 253.6,149.5 258.3,151.8 263.0,154.5 267.7,157.6 272.4,160.8 277.1,164.1 281.8,167.2 286.5,169.9 291.2,171.9 295.9,173.2 300.6,173.6 305.3,173.0 310.0,171.5 314.7,169.3 319.4,166.5 324.1,163.4 328.8,160.2 333.5,157.1 338.2,154.5 342.9,152.4 347.6,150.9 352.3,150.1 357.0,149.9 361.7,150.2 366.4,150.8 371.1,151.5 375.8,152.2 380.5,152.7 385.2,152.8 389.9,152.6 394.6,152.1 399.3,151.2 404.0,150.1 408.7,149.0 413.4,147.9 418.1,147.1 422.8,146.5 427.5,146.3 432.2,146.3 436.9,146.5 441.6,146.9 446.3,147.1 451.0,147.0 455.7,146.6 460.4,145.5 465.1,143.8 469.8,141.5 474.5,138.6 479.2,135.3 483.9,131.7 488.6,128.2 493.3,124.9 498.0,122.2 502.7,120.2 507.4,119.1 512.1,119.0 516.8,119.8 521.5,121.4 526.2,123.7 530.9,126.6 535.6,129.7 540.3,132.8 545.0,135.8 549.7,138.5 554.4,140.8 559.1,142.6 563.8,144.1 568.5,145.2 573.2,146.2 577.9,147.1 582.6,148.1 587.3,149.3 592.0,150.7 596.7,152.4 601.4,154.2 606.1,156.0 610.8,157.8 615.5,159.2 620.2,160.3 624.9,160.8 629.6,160.7 634.3,160.0 639.0,158.8 643.7,157.1 648.4,155.2 653.1,153.2 657.8,151.5 662.5,150.2 667.2,149.5 671.9,149.5 676.6,150.3 681.3,151.8 686.0,153.9 690.7,156.5 695.4,159.2 700.1,162.0 704.8,164.4 709.5,166.4 714.2,167.7 718.9,168.2 723.6,168.1 728.3,167.2 733.0,165.7 737.7,163.8 742.4,161.6 747.1,159.4 751.8,157.3 756.5,155.3 761.2,153.5 765.9,152.0 770.6,150.6 775.3,149.3 780.0,147.9" fill="none" stroke="#f59e0b" stroke-width="2.4" stroke-opacity="0.9"/>
  <polyline points="75.0,129.1 79.7,142.0 84.4,121.1 89.1,116.2 93.8,141.9 98.5,120.5 103.2,122.4 107.9,170.2 112.6,116.2 117.3,144.8 122.0,159.9 126.7,123.8 131.4,143.9 136.1,144.3 140.8,134.6 145.5,135.0 150.2,143.0 154.9,124.4 159.6,137.5 164.3,152.0 169.0,110.3 173.7,152.5 178.4,131.9 183.1,111.8 187.8,136.0 192.5,120.2 197.2,122.3 201.9,133.5 206.6,129.6 211.3,119.4 216.0,152.9 220.7,145.1 225.4,120.6 230.1,191.7 234.8,135.0 239.5,132.5 244.2,164.9 248.9,132.2 253.6,142.6 258.3,162.5 263.0,146.4 267.7,141.0 272.4,182.2 277.1,160.3 281.8,150.4 286.5,238.4 291.2,155.9 295.9,168.3 300.6,203.1 305.3,154.5 310.0,167.2 314.7,179.5 319.4,157.0 324.1,149.6 328.8,171.9 333.5,146.7 338.2,144.5 342.9,188.3 347.6,130.6 352.3,156.1 357.0,168.8 361.7,131.3 366.4,150.8 371.1,151.5 375.8,142.8 380.5,144.7 385.2,154.5 389.9,137.9 394.6,152.8 399.3,168.8 404.0,128.3 408.7,171.2 413.4,150.7 418.1,130.2 422.8,153.8 427.5,136.9 432.2,137.8 436.9,147.6 441.6,142.1 446.3,130.2 451.0,161.8 455.7,151.8 460.4,124.8 465.1,193.0 469.8,132.8 474.5,126.3 479.2,154.1 483.9,116.3 488.6,121.3 493.3,135.6 498.0,114.0 502.7,103.6 507.4,140.5 512.1,115.2 516.8,102.9 521.5,189.9 526.2,107.7 530.9,121.7 535.6,159.2 540.3,114.3 545.0,131.5 549.7,148.7 554.4,131.3 559.1,128.8 563.8,155.8 568.5,134.8 573.2,136.3 577.9,183.1 582.6,127.8 587.3,155.3 592.0,169.7 596.7,133.5 601.4,154.2 606.1,156.0 610.8,148.3 615.5,151.2 620.2,161.9 624.9,146.1 629.6,161.5 634.3,177.7 639.0,137.0 643.7,179.3 648.4,158.0 653.1,136.4 657.8,158.8 662.5,140.8 667.2,140.9 671.9,150.5 676.6,145.5 681.3,134.9 686.0,168.7 690.7,161.7 695.4,138.6 700.1,211.2 704.8,155.7 709.5,154.1 714.2,186.5 718.9,152.8 723.6,161.1 728.3,177.8 733.0,157.5 737.7,147.2 742.4,183.0 747.1,155.6 751.8,140.4 756.5,223.8 761.2,137.5 765.9,147.1 770.6,180.1 775.3,130.8 780.0,143.5" fill="none" stroke="#4f46e5" stroke-width="1.2" stroke-opacity="0.85"/>

  <text x="600" y="62" font-size="11" font-weight="600" fill="#4f46e5">总接收功率(快 + 慢)</text>
  <text x="600" y="80" font-size="11" font-weight="600" fill="#d97706">慢衰落趋势(阴影)</text>

  <text x="780" y="292" text-anchor="end" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">距离 / 时间</text>
  <text x="58" y="52" font-size="10.5" font-style="italic" fill="var(--text-muted,#57606a)">功率 (dB)</text>

  <text x="180" y="292" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">快衰落:几波长内剧烈起伏 → 瑞利 / 莱斯</text>
  <text x="600" y="292" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">慢衰落:几十波长尺度缓慢起伏 → 对数正态</text>
</svg>

**为什么要分开看**:两者的应对手段完全不同。

| 衰落类型 | 尺度 | 分布 | 应对手段 |
| --- | --- | --- | --- |
| 快衰落 | 几波长 | 瑞利 / 莱斯 | 分集、均衡、信道编码 |
| 慢衰落 | 几十波长 | 对数正态 | 功率控制、链路余量 |

> [!tip] 一句话记住
> **快衰落靠「抗」,慢衰落靠「留余量」。** 分集对抗深衰落,余量对抗长时间遮挡。


# 6. 随机变量函数的分布

已知 $X$ 的分布,求 $Y=g(X)$ 的分布。分两种情形。

## 1. $X$ 离散型

直接**列表法**:把 $X$ 的每个取值 $x_k$ 代入 $y_k=g(x_k)$,再把得到相同 $y$ 的概率**合并**。

## 2. $X$ 连续型

**通用方法(分布函数法)**,三步走:

1. 写出 $F_Y(y)=P(Y\le y)=P(g(X)\le y)$
2. 把不等式 $g(X)\le y$ **解成关于 $X$ 的区间**
3. 用 $X$ 的分布算出这个概率,再对 $y$ 求导得 $f_Y(y)$

**特例:单调函数**。若 $g$ 严格单调、可导,则

$$f_Y(y)=f_X\big(h(y)\big)\,\big|h'(y)\big|$$

其中 $h=g^{-1}$ 是反函数。

**最重要的特例**:若 $X\sim N(\mu,\sigma^2)$,则对任意常数 $a\ne 0$,

$$aX+b\sim N(a\mu+b,\ a^2\sigma^2)$$

正态分布在**线性变换下封闭**——这正是它可以被标准化、且在线性系统中处处出现的原因。


# 7. 例题

## 例 1(求分布律)

袋中有 3 个白球、2 个黑球,从中不放回地取 2 个球,记 $X$ 为取到的白球数。求 $X$ 的分布律。

$X$ 的可能取值为 $0,1,2$。

$$P(X=0)=\frac{\binom{2}{2}}{\binom{5}{2}}=\frac{1}{10},\qquad
P(X=1)=\frac{\binom{3}{1}\binom{2}{1}}{\binom{5}{2}}=\frac{6}{10},\qquad
P(X=2)=\frac{\binom{3}{2}}{\binom{5}{2}}=\frac{3}{10}$$

验证:$\frac{1}{10}+\frac{6}{10}+\frac{3}{10}=1$ ✓

## 例 2(分布函数与单点概率)

设 $X$ 的分布律为 $P(X=0)=0.2$,$P(X=1)=0.5$,$P(X=2)=0.3$。求 $F(x)$,并求 $P(0.5<X\le 2)$。

$F(x)$ 是阶梯函数:

$$F(x)=\begin{cases}0, & x<0\\ 0.2, & 0\le x<1\\ 0.7, & 1\le x<2\\ 1, & x\ge 2\end{cases}$$

$$P(0.5<X\le 2)=F(2)-F(0.5)=1-0.2=0.8$$

注意 $F$ 在每个取值点处**向上跳跃**,跳跃高度就是该点的概率,如 $P(X=1)=0.7-0.2=0.5$。

## 例 3(由密度求常数与概率)

设 $X$ 的密度为

$$f(x)=\begin{cases}kx, & 0<x<2\\ 0, & \text{其他}\end{cases}$$

**(1) 求 $k$**——用规范性:

$$\int_0^2 kx\,\mathrm{d}x=\frac{k\cdot 2^2}{2}=2k=1\ \Longrightarrow\ k=\frac{1}{2}$$

**(2) 求 $P(1<X<2)$**:

$$P(1<X<2)=\int_1^2 \frac{x}{2}\,\mathrm{d}x=\left[\frac{x^2}{4}\right]_1^2=\frac{4-1}{4}=\frac{3}{4}$$

## 例 4(正态分布标准化:接收信号判决)

某接收机输出幅度 $X\sim N(0,4)$(单位 V)。求 $P(|X|<3)$。

标准化:$\sigma=2$,

$$P(|X|<3)=P(-3<X<3)=\Phi\!\left(\frac{3}{2}\right)-\Phi\!\left(\frac{-3}{2}\right)=2\Phi(1.5)-1$$

查表 $\Phi(1.5)=0.9332$,故

$$P(|X|<3)=2\times0.9332-1=0.8664$$

即约 $86.6\%$ 的概率幅度落在 $\pm3$ V 内。这正是通信中"$3\sigma$ 门限"的由来。

## 例 5(泊松近似)

某链路每比特误码率 $p=10^{-4}$,一帧含 $10000$ 比特。求该帧中**至少出现 1 位误码**的概率。

$X\sim B(10000,10^{-4})$,$\lambda=np=1$。用泊松近似:

$$P(X\ge 1)=1-P(X=0)\approx 1-e^{-1}=0.6321$$

直接算 $1-(1-10^{-4})^{10000}$ 得 $0.6321$——近似效果很好。

## 例 6(随机变量函数的分布)

设 $X\sim U(0,1)$,求 $Y=-2\ln X$ 的密度。

$g(x)=-2\ln x$ 在 $(0,1)$ 上严格单调递减,反函数 $h(y)=e^{-y/2}$,$h'(y)=-\frac{1}{2}e^{-y/2}$。

$$f_Y(y)=f_X(h(y))\cdot|h'(y)|=1\cdot\frac{1}{2}e^{-y/2},\qquad y>0$$

即 $Y\sim E(1/2)$。这个变换在仿真中很常用——**均匀分布是生成其他分布的原材料**。

## 例 7(瑞利分布:深衰落概率)

某城市多径信道包络服从瑞利分布,$\sigma=1$ V。求:

**(1) 包络小于 $0.5$ V 的概率**——用分布函数:

$$P(R<0.5)=F_R(0.5)=1-\exp\left(-\frac{0.5^2}{2\times1^2}\right)=1-e^{-0.125}\approx 0.1175$$

即约 $11.75\%$ 的时间包络低于 $0.5$ V。

**(2) 包络的均值和均方值**:

$$E[R]=\sigma\sqrt{\frac{\pi}{2}}=1\times1.2533=1.2533\ \text{V}$$

$$E[R^2]=2\sigma^2=2\ \text{V}^2$$

**(3) 若接收机灵敏度要求包络不低于 $0.3$ V,求中断概率**:

$$P_{\text{out}}=P(R<0.3)=1-e^{-0.045}\approx 0.0440$$

即约 $4.4\%$ 的时间处于中断。注意:包络门限从 $0.5$ 降到 $0.3$,中断概率从 $11.75\%$ 降到 $4.4\%$——**瑞利的尾部衰减很快**,这是它的典型特征。

## 例 8(莱斯因子与分布形态)

某郊区链路,$K=6$ dB(即 $K\approx 3.98$),散射功率 $2\sigma^2=1$,求直射分量幅度 $A$。

由 $K=\dfrac{A^2}{2\sigma^2}$ 得

$$A^2=K\cdot 2\sigma^2=3.98\times1=3.98\ \Longrightarrow\ A\approx 1.995$$

平均功率 $E[R^2]=A^2+2\sigma^2=3.98+1=4.98$。

**讨论**:若该链路改为城市环境,$K$ 降到 $0$ dB,则 $A^2=2\sigma^2=1$,$A=1$。对比可见——**$K$ 越大,直射分量在总功率中占比越高,包络越集中在 $A$ 附近,深衰落概率越低**。这正是视距链路比非视距链路可靠的根本原因。

## 例 9(对数正态阴影:链路余量设计)

某链路的大尺度衰落 $X=10\lg P$ 服从 $N(\mu,\sigma^2)$,$\sigma=8$ dB。若要求在 $90\%$ 的位置上接收功率不低于门限 $P_{\text{th}}$,求需要的**阴影余量**(即平均功率应高出 $P_{\text{th}}$ 多少 dB)。

设余量为 $M$(dB),即 $\mu=P_{\text{th}}+M$。要求

$$P(X>P_{\text{th}})=0.90$$

标准化:$\dfrac{P_{\text{th}}-\mu}{\sigma}=\dfrac{-M}{8}$,故

$$P\left(Z>\frac{-M}{8}\right)=0.90\ \Longrightarrow\ \Phi\!\left(\frac{M}{8}\right)=0.90$$

查表 $\Phi(1.28)=0.8997\approx0.90$,故

$$\frac{M}{8}=1.28\ \Longrightarrow\ M\approx 10.2\ \text{dB}$$

即需要约 **10.2 dB 的阴影余量**。$\sigma$ 越大(遮挡越严重),所需余量越大——这就是为什么 $\sigma=8$ dB 的城市环境比 $\sigma=4$ dB 的郊区要多留近一倍余量。

## 例 10(Nakagami-m 与瑞利的退化关系)

验证 Nakagami-m 在 $m=1$ 时退化为瑞利分布。

代入 $m=1$、$\Omega=2\sigma^2$:

$$f_R(r)=\frac{2\cdot1^1\cdot r^{2-1}}{\Gamma(1)\,(2\sigma^2)^1}\exp\left(-\frac{1\cdot r^2}{2\sigma^2}\right)=\frac{2r}{2\sigma^2}e^{-r^2/(2\sigma^2)}=\frac{r}{\sigma^2}e^{-r^2/(2\sigma^2)}$$

正是瑞利密度($r\ge0$)。用了 $\Gamma(1)=1$。这验证了 $m=1$ 时 Nakagami 与瑞利完全一致。

## 例 11(卡方分布:能量检测)

频谱感知中,接收机在无信号时采集 $n=8$ 个独立同分布的高斯样本 $x_i\sim N(0,1)$,用能量统计量 $T=\sum_{i=1}^{8}x_i^2$ 判决。求 $T$ 超过门限 $15.51$ 的概率。

由定义 $T\sim\chi^2(8)$。查卡方分布表,$\chi^2_{0.05}(8)=15.51$,即

$$P(T>15.51)=0.05$$

**意义**:若把门限设为 $15.51$,则在**无信号**时误判为"有信号"的概率(虚警率)恰为 $5\%$。这正是能量检测器设计门限的标准方法——**由目标虚警率反查卡方分位数**。


> [!tip] 本章收官
> 本章把"事件"升级成"随机变量"，形成一条完整的工具链：
> 1. **随机变量**（1）：$X:\Omega\to\mathbb{R}$，把事件数字化。
> 2. **离散型**（2）：分布律 $p_k$，求和；**连续型**（4）：密度 $f(x)$，积分。
> 3. **分布函数**（3）：$F(x)=P(X\le x)$，统一两者；离散型看跳跃，连续型看积分。
> 4. **常见分布**（5）：通用七种 + 通信衰落八种；瑞利/莱斯/对数正态是信道建模三大支柱。
> 5. **随机变量函数的分布**（6）：分布函数法、单调变换公式。
>
> 一句话：**离散求和、连续积分，分布函数统一；通信中的衰落分布几乎都由高斯分量派生。**

# 本章知识地图

```
随机变量 X: Ω → ℝ
   │
   ├─ 离散型 ──→ 分布律 P(X=xₖ)=pₖ  (求和)
   │                 └─ 0-1 / 二项 / 泊松 / 几何
   │
   ├─ 连续型 ──→ 概率密度 f(x)      (积分)
   │                 ├─ 通用:均匀 / 指数 / 正态
   │                 │
   │                 └─ 通信衰落 ──┬─ 小尺度 ─┬─ 瑞利(无直射)
   │                               │           └─ 莱斯(有直射,K=0→瑞利)
   │                               │           └─ Nakagami-m(m=1→瑞利)
   │                               │           └─ 韦布尔(k=2→瑞利)
   │                               ├─ 大尺度 ──→ 对数正态(阴影)
   │                               └─ 统计量 ─┬─ 伽马 / 卡方(能量检测)
   │                                           └─ 拉普拉斯(稀疏信号)
   │
   └─ 统一工具 ──→ 分布函数 F(x)=P(X≤x)
                      │
                      ├─ 求概率 P(a<X≤b)=F(b)−F(a)
                      └─ 求 Y=g(X) 的分布(分布函数法)
```

**一句话串起来**:随机变量把样本点变成实数,离散型用**求和**、连续型用**积分**描述其规律,而**分布函数**是统一两者的通用语言。通信中的衰落分布几乎都由**高斯分量派生**——瑞利是两个高斯变量的模,莱斯再加一个直射分量,对数正态是 dB 域的高斯。

# 关联

- 上一章:[[vault-notes/math/probability/02-conditional-probability-independence]]
- 下一章:随机变量的数字特征(期望、方差)

**通信方向应用**（本节分布理论在通信原理中的三个直接落点）：

- [[vault-notes/communication/03-random-processes]] —— 本节的 **瑞利 / 莱斯 / 高斯** 三分布正是"窄带随机过程""正弦波加窄带噪声"的数学本体：只有噪声→瑞利，信号+噪声→莱斯，大信噪比→高斯
- [[vault-notes/communication/04-channel]] —— 随参信道的**瑞利型衰落**与相关带宽；**对数正态**对应大尺度阴影衰落
- [[vault-notes/communication/09-optimal-reception]] —— 判决统计量的高斯分布直接决定误码率表达式