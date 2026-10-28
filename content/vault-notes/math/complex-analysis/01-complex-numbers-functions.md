---
title: "复数与复变函数"
tags:
- 数学
- 复变函数
- 复数
type: course
subjects:
- 复变函数与场论
domains:
- 数学基础
status: learning
aliases: []
prerequisites: []
related: []
---

> [!abstract] 本章在讲什么
> 复变函数把"数"从实轴扩展到复平面。本章先建立复数的语言，再把它推广成函数：
> - **1. 复数及其几何表示**：复数的代数形式、复平面、模与辐角、三角/指数形式、欧拉公式。
> - **2. 复数的乘幂与方根**：棣莫弗公式、$n$ 次方根的几何分布、多值性。
> - **3. 复变函数**：$w=f(z)$ 作为复平面到复平面的映射；极限与连续。
> - **4. 初等函数**：指数、对数、幂、三角、双曲、反三角；重点是对数与幂函数的**多值性**与分支。
> - **5. 例题**：复数运算、方根、映射、初等函数求值。
>
> 一句话主线：**复数 = 平面上的点/向量 = 模 + 辐角；复变函数 = 复平面到复平面的映射；初等函数是实初等函数在复平面上的自然推广，但多值性（对数、方根）是复变函数独有的新现象。**

> [!note] 记号约定
> - $z=x+iy$，$x=\operatorname{Re}z$，$y=\operatorname{Im}z$，$i^2=-1$
> - $|z|=\sqrt{x^2+y^2}$：模；$\arg z$：辐角（多值）；$\operatorname{Arg}z$：主值，取 $(-\pi,\pi]$
> - $\bar z=x-iy$：共轭；$z=|z|e^{i\arg z}$：指数形式
> - 欧拉公式：$e^{i\theta}=\cos\theta+i\sin\theta$
> - $D$：定义域（开区域）；$f(z)$：复变函数；$w=f(z)$ 把 $z$ 平面映到 $w$ 平面
> - $\operatorname{Ln}z$：多值对数；$\ln z$：主值对数
> - 本章的"$\to$"默认在复平面上，$z\to z_0$ 可沿任意方向

# 1. 复数及其几何表示

## 复数的代数形式

> [!info] Def 1 复数
> 形如
> $$
> z=x+iy,\qquad x,y\in\mathbb{R},\ i^2=-1
> $$
> 的数称为**复数**（complex number）。$x=\operatorname{Re}z$ 为**实部**，$y=\operatorname{Im}z$ 为**虚部**。

**四则运算**（与实数多项式同规则，只需把 $i^2$ 换成 $-1$）：

$$
(a+ib)\pm(c+id)=(a\pm c)+i(b\pm d)
$$
$$
(a+ib)(c+id)=(ac-bd)+i(ad+bc)
$$
$$
\frac{a+ib}{c+id}=\frac{(a+ib)(c-id)}{c^2+d^2}
$$

> [!warning] 复数不能比较大小
> $\mathbb{C}$ 上不存在与加法、乘法相容的全序。写 $z_1<z_2$ 是没有意义的；只能比较模 $|z_1|$ 与 $|z_2|$。

## 复平面、模与辐角

复数 $z=x+iy$ 与平面点 $(x,y)$ 一一对应，这个平面称为**复平面**（complex plane）。$x$ 轴为实轴，$y$ 轴为虚轴。

> [!info] Def 2 模与辐角
> $$
> |z|=r=\sqrt{x^2+y^2}
> $$
> 称为 $z$ 的**模**（modulus）；从正实轴到向量 $\overrightarrow{Oz}$ 的角 $\theta$ 称为**辐角**（argument），记 $\arg z$。辐角多值：
> $$
> \arg z=\theta_0+2k\pi,\qquad k\in\mathbb{Z}
> $$
> 其中 $\theta_0\in(-\pi,\pi]$ 称为**主值**，记 $\operatorname{Arg}z$。

**三角形式与指数形式**：

$$
z=r(\cos\theta+i\sin\theta)=re^{i\theta}
$$

欧拉公式 $e^{i\theta}=\cos\theta+i\sin\theta$ 把指数与三角统一起来。共轭：

$$
\bar z=x-iy=re^{-i\theta},\qquad z\bar z=|z|^2
$$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 360" width="100%" style="max-width:620px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <line x1="90.0" y1="310.0" x2="560.0" y2="310.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="90.0" y1="310.0" x2="90.0" y2="40.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <text x="564.0" y="314.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">Re</text>
  <text x="84.0" y="34.0" text-anchor="end" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">Im</text>
  <line x1="170.0" y1="40.0" x2="170.0" y2="310.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.6" stroke-dasharray="2 3"/>
  <line x1="250.0" y1="40.0" x2="250.0" y2="310.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.6" stroke-dasharray="2 3"/>
  <line x1="330.0" y1="40.0" x2="330.0" y2="310.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.6" stroke-dasharray="2 3"/>
  <line x1="410.0" y1="40.0" x2="410.0" y2="310.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.6" stroke-dasharray="2 3"/>
  <line x1="90.0" y1="115.0" x2="560.0" y2="115.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.6" stroke-dasharray="2 3"/>
  <line x1="90.0" y1="235.0" x2="560.0" y2="235.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.6" stroke-dasharray="2 3"/>
  <line x1="90.0" y1="55.0" x2="560.0" y2="55.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.6" stroke-dasharray="2 3"/>
  <line x1="90.0" y1="295.0" x2="560.0" y2="295.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.6" stroke-dasharray="2 3"/>
  <line x1="90.0" y1="175.0" x2="330.0" y2="55.0" stroke="var(--text-accent,#705dcf)" stroke-width="2.0" marker-end="url(#ar)"/>
  <circle cx="330.0" cy="55.0" r="4.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <text x="338.0" y="49.0" text-anchor="start" font-size="12" fill="var(--text-accent,#705dcf)" font-weight="normal">z = x+iy</text>
  <line x1="90.0" y1="175.0" x2="330.0" y2="295.0" stroke="#2563eb" stroke-width="2.0" marker-end="url(#ar)"/>
  <circle cx="330.0" cy="295.0" r="4.0" fill="#2563eb" stroke="#2563eb" stroke-width="1.0"/>
  <text x="338.0" y="309.0" text-anchor="start" font-size="12" fill="#2563eb" font-weight="normal">z̄ = x−iy</text>
  <path d="M 145.0,175.0 A 55 55 0 0 0 139.2,150.4" fill="none" stroke="#dc2626" stroke-width="1.1"/>
  <text x="158.0" y="153.0" text-anchor="start" font-size="11" fill="#dc2626" font-weight="normal">θ=arg z</text>
  <text x="120.0" y="169.0" text-anchor="start" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">|z|=r</text>
  <line x1="330.0" y1="55.0" x2="330.0" y2="175.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0" stroke-dasharray="4 3"/>
  <line x1="330.0" y1="175.0" x2="90.0" y2="175.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0" stroke-dasharray="4 3"/>
  <text x="330.0" y="193.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">x</text>
  <text x="76.0" y="59.0" text-anchor="end" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">y</text>
  <text x="310.0" y="345.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">复数 = 复平面上的点/向量；模是长度，辐角是方向</text>
</svg>

> [!tip] 三个最常用的几何事实
> 1. $|z_1-z_2|$ 是两点之间的距离
> 2. $|z-z_0|=r$ 是以 $z_0$ 为心、$r$ 为半径的圆
> 3. $\operatorname{Re}z=\frac{z+\bar z}{2}$，$\operatorname{Im}z=\frac{z-\bar z}{2i}$

# 2. 复数的乘幂与方根

## 乘幂：棣莫弗公式

若 $z=re^{i\theta}$，则

$$
z^n=r^ne^{in\theta}=r^n(\cos n\theta+i\sin n\theta)
$$

这就是**棣莫弗公式**（De Moivre's formula）。几何上，乘 $z$ 相当于**模相乘、辐角相加**：$z_1z_2$ 的模是 $|z_1||z_2|$，辐角是 $\arg z_1+\arg z_2$。

## 方根

> [!info] Def 3 n 次方根
> 方程 $w^n=z$（$z=re^{i\theta}\ne0$）的 $n$ 个根为
> $$
> w_k=\sqrt[n]{r}\,e^{i(\theta+2k\pi)/n},\qquad k=0,1,\dots,n-1
> $$
> 它们均匀分布在以原点为心、$\sqrt[n]{r}$ 为半径的圆上，相邻夹角 $2\pi/n$。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 440" width="100%" style="max-width:460px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <circle cx="230.0" cy="210.0" r="150.0" fill="none" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.2"/>
  <line x1="50.0" y1="210.0" x2="410.0" y2="210.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="230.0" y1="30.0" x2="230.0" y2="390.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <circle cx="380.0" cy="210.0" r="4.5" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <text x="388.0" y="206.0" text-anchor="start" font-size="11" fill="var(--text-accent,#705dcf)" font-weight="normal">w0</text>
  <line x1="230.0" y1="210.0" x2="380.0" y2="210.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <circle cx="276.4" cy="67.3" r="4.5" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <text x="278.8" y="55.7" text-anchor="start" font-size="11" fill="var(--text-accent,#705dcf)" font-weight="normal">w1</text>
  <line x1="230.0" y1="210.0" x2="276.4" y2="67.3" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <circle cx="108.6" cy="121.8" r="4.5" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <text x="102.2" y="113.1" text-anchor="start" font-size="11" fill="var(--text-accent,#705dcf)" font-weight="normal">w2</text>
  <line x1="230.0" y1="210.0" x2="108.6" y2="121.8" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <circle cx="108.6" cy="298.2" r="4.5" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <text x="102.2" y="298.9" text-anchor="start" font-size="11" fill="var(--text-accent,#705dcf)" font-weight="normal">w3</text>
  <line x1="230.0" y1="210.0" x2="108.6" y2="298.2" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <circle cx="276.4" cy="352.7" r="4.5" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <text x="278.8" y="356.3" text-anchor="start" font-size="11" fill="var(--text-accent,#705dcf)" font-weight="normal">w4</text>
  <line x1="230.0" y1="210.0" x2="276.4" y2="352.7" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <polyline points="380.0,210.0 276.4,67.3 108.6,121.8 108.6,298.2 276.4,352.7 380.0,210.0" fill="none" stroke="var(--text-accent,#705dcf)" stroke-width="1.4" stroke-dasharray="4 3"/>
  <text x="230.0" y="214.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">O</text>
  <text x="230.0" y="30.0" text-anchor="middle" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="600">1 的 5 次方根：正五边形顶点</text>
  <text x="230.0" y="420.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">w_k = e^{i2πk/5}, k=0,1,2,3,4</text>
</svg>

> [!example] 1 的 n 次方根
> $w_k=e^{i2k\pi/n}$，$k=0,\dots,n-1$。它们构成正 $n$ 边形的顶点，且
> $$
> 1+w+w^2+\cdots+w^{n-1}=0\quad(w\ne1)
> $$
> 这是单位根在多项式、离散傅里叶变换（DFT）中的核心性质。

> [!warning] 方根是"多值"的
> $\sqrt[n]{z}$ 在复数域有 $n$ 个值，不能像实数那样只取算术根。写 $\sqrt{-1}=i$ 只是取了其中一个值；完整的 $\sqrt{-1}=\pm i$。

# 3. 复变函数

## 定义与映射

> [!info] Def 4 复变函数
> 设 $D\subseteq\mathbb{C}$。若对每个 $z\in D$，按一定规则有唯一的 $w\in\mathbb{C}$ 与之对应，则称 $w=f(z)$ 为定义在 $D$ 上的**复变函数**（complex function）。$D$ 为定义域，$f(D)$ 为值域。

复变函数可以写成两个实函数：

$$
w=f(z)=u(x,y)+iv(x,y)
$$

其中 $u=\operatorname{Re}f$、$v=\operatorname{Im}f$ 是 $x,y$ 的实函数。因此复变函数本质上是**两个实变量的两个实函数**，但它作为"复平面到复平面的映射"有更强的几何结构。

**常见映射**：

| 函数 | 映射效果 |
| --- | --- |
| $w=z+a$ | 平移 |
| $w=az$ | 旋转 + 伸缩（$a=\lvert a\rverte^{i\alpha}$：旋转 $\alpha$、伸缩 $\lvert a\rvert$） |
| $w=1/z$ | 反演 + 关于实轴反射 |
| $w=z^2$ | 角域张角加倍、模平方 |
| $w=e^z$ | 水平带 → 角域；周期 $2\pi i$ |

## 极限与连续

> [!info] Def 5 复变函数的极限
> 若对任意 $\varepsilon>0$，存在 $\delta>0$，使当 $0<|z-z_0|<\delta$ 时
> $$
> |f(z)-A|<\varepsilon
> $$
> 则称 $z\to z_0$ 时 $f(z)$ 的极限为 $A$，记 $\lim_{z\to z_0}f(z)=A$。

> [!important] 复极限比实极限更强
> $z\to z_0$ 必须沿**任意方向、任意路径**都趋于 $A$。只要找到两条路径给出不同极限，极限就不存在。
> 这与实变量"左右两侧"不同：复平面有无穷多条路径。

> [!info] Def 6 连续
> 若 $\lim_{z\to z_0}f(z)=f(z_0)$，则称 $f$ 在 $z_0$ **连续**。在区域 $D$ 内每点连续，则称 $f$ 在 $D$ 上连续。

**连续与实部/虚部的关系**：$f=u+iv$ 在 $z_0$ 连续 ⇔ $u,v$ 在 $(x_0,y_0)$ 连续。

# 4. 初等函数

## 指数函数

> [!info] Def 7 指数函数
> $$
> e^z=e^{x+iy}=e^x(\cos y+i\sin y)
> $$
> 称为**复指数函数**（complex exponential function）。

**性质**：

1. $e^{z_1+z_2}=e^{z_1}e^{z_2}$
2. $e^z$ 处处解析，且 $(e^z)'=e^z$
3. **周期性**：$e^{z+2\pi i}=e^z$，周期 $2\pi i$
4. $|e^z|=e^x$，$\arg e^z=y+2k\pi$

> [!warning] $e^z$ 可以取负值
> $e^{i\pi}=-1$，$e^{i\pi/2}=i$。复指数不再像实指数那样恒正；它的值域是 $\mathbb{C}\setminus\{0\}$。

## 对数函数

> [!info] Def 8 对数函数
> 满足 $e^w=z$（$z\ne0$）的 $w$ 称为 $z$ 的**对数**，记
> $$
> \operatorname{Ln}z=\ln|z|+i\arg z=\ln|z|+i(\operatorname{Arg}z+2k\pi),\qquad k\in\mathbb{Z}
> $$
> 这是**多值函数**；主值
> $$
> \ln z=\ln|z|+i\operatorname{Arg}z
> $$
> 是单值分支。

**性质**：

1. $\operatorname{Ln}(z_1z_2)=\operatorname{Ln}z_1+\operatorname{Ln}z_2$（作为集合等式）
2. $\ln z$ 在 $\mathbb{C}\setminus(-\infty,0]$ 上解析，且 $(\ln z)'=1/z$
3. 负实轴（或从原点出发的任意射线）是**支割线**，跨过它主值会跳变 $2\pi$

> [!tip] 多值性的来源
> 辐角多值 → 对数多值。每绕原点一圈，$\arg z$ 增加 $2\pi$，$\operatorname{Ln}z$ 增加 $2\pi i$。这就是"分支"与"支割线"的几何来源。

## 幂函数

> [!info] Def 9 幂函数
> 对复数 $\alpha$，定义
> $$
> z^\alpha=e^{\alpha\operatorname{Ln}z}\qquad(z\ne0)
> $$
> 当 $\alpha$ 为整数时单值；当 $\alpha=p/q$（既约分数）时有 $q$ 个值；当 $\alpha$ 为无理数或复数时有无穷多个值。

> [!example] $i^i$ 是多少？
> $$
> i^i=e^{i\operatorname{Ln}i}=e^{i(\ln1+i(\pi/2+2k\pi))}=e^{-\pi/2-2k\pi}
> $$
> 有无穷多个**实数**值！主值为 $e^{-\pi/2}\approx0.2079$。

## 三角函数与双曲函数

$$
\sin z=\frac{e^{iz}-e^{-iz}}{2i},\qquad \cos z=\frac{e^{iz}+e^{-iz}}{2}
$$
$$
\sinh z=\frac{e^z-e^{-z}}{2},\qquad \cosh z=\frac{e^z+e^{-z}}{2}
$$

**性质**：

1. $\sin z,\cos z$ 处处解析，周期 $2\pi$；$\sinh z,\cosh z$ 周期 $2\pi i$
2. **无界性**：$|\sin z|$、$|\cos z|$ 在复平面无界（与实函数不同）
3. 三角恒等式形式上与实数相同

> [!warning] 复三角函数不再有界
> 在实轴上 $|\sin x|\le1$，但在复平面上，沿虚轴方向 $|\sin(iy)|=|\sinh y|\to\infty$。**刘维尔定理**（第 3 章）会解释：非常数的整函数必然无界。

# 5. 例题

> [!example] 例 1：复数运算
> 求 $(1+i)(2-i)$ 与 $\dfrac{1+i}{1-i}$。
> $$
> (1+i)(2-i)=2-i+2i-i^2=3+i
> $$
> $$
> \frac{1+i}{1-i}=\frac{(1+i)^2}{1+1}=\frac{2i}{2}=i
> $$

> [!example] 例 2：模与辐角
> 求 $z=-1+\sqrt3 i$ 的模与主辐角。
> $|z|=\sqrt{1+3}=2$，$\operatorname{Arg}z=2\pi/3$。
> $$
> z=2e^{i2\pi/3}
> $$

> [!example] 例 3：方根
> 求 $\sqrt[3]{-8}$。
> $-8=8e^{i\pi}$，故
> $$
> w_k=2e^{i(\pi+2k\pi)/3},\qquad k=0,1,2
> $$
> 即 $2e^{i\pi/3}=1+\sqrt3 i$、$2e^{i\pi}=-2$、$2e^{i5\pi/3}=1-\sqrt3 i$。

> [!example] 例 4：初等函数求值
> 求 $\sin(1+i)$。
> $$
> \sin(1+i)=\frac{e^{i(1+i)}-e^{-i(1+i)}}{2i}=\frac{e^{-1+i}-e^{1-i}}{2i}
> $$
> $$
> =\frac{e^{-1}(\cos1+i\sin1)-e(\cos1-i\sin1)}{2i}=\sin1\cosh1+i\cos1\sinh1
> $$

> [!example] 例 5：对数与幂
> 求 $\operatorname{Ln}(-1)$ 与 $(-1)^{1/2}$。
> $$
> \operatorname{Ln}(-1)=\ln1+i(\pi+2k\pi)=i(2k+1)\pi
> $$
> $$
> (-1)^{1/2}=e^{\frac12\operatorname{Ln}(-1)}=e^{i(2k+1)\pi/2}=\pm i
> $$

> [!tip] 本章收官
> 第 1 章把实数域的工具搬到复平面：
> 1. **复数**（1）：$z=x+iy=re^{i\theta}$，模与辐角是几何语言的核心。
> 2. **乘幂与方根**（2）：棣莫弗公式；$n$ 次方根均匀分布在圆上，天然多值。
> 3. **复变函数**（3）：$w=f(z)$ 是复平面到复平面的映射；极限要求沿任意路径。
> 4. **初等函数**（4）：指数、对数、幂、三角、双曲；**对数与幂的多值性/分支**是复变函数独有的新现象。
>
> 一句话：**复数把平面变成数；复变函数把平面映射成平面；初等函数是实函数的自然推广，但多值性提醒我们"分支"必须被认真对待。下一章研究最重要的一类复变函数——解析函数。**

# 本章知识地图

```
复数与复变函数
├─ 1. 复数及其几何表示
│     ├─ z=x+iy，i²=−1；Re/Im；共轭 z̄
│     ├─ 模 |z|=√(x²+y²)；辐角 arg z（多值）
│     ├─ 三角形式 z=r(cosθ+isinθ)
│     ├─ 指数形式 z=re^{iθ}；欧拉公式
│     └─ 几何：|z−z₀|=r 是圆
│
├─ 2. 乘幂与方根
│     ├─ 棣莫弗：zⁿ=rⁿe^{inθ}
│     ├─ 乘除：模相乘/除，辐角相加/减
│     └─ n 次方根：n 个值，均匀分布在圆上
│
├─ 3. 复变函数
│     ├─ w=f(z)=u(x,y)+iv(x,y)
│     ├─ 映射：平移/旋转/伸缩/反演/幂/指数
│     ├─ 极限：沿任意路径
│     └─ 连续：实部虚部分别连续
│
├─ 4. 初等函数
│     ├─ 指数 e^z：周期 2πi，值域 C\{0}
│     ├─ 对数 Ln z：多值；主值 ln z；支割线
│     ├─ 幂 z^α：e^{αLn z}，多值
│     ├─ 三角/双曲：由指数定义，无界
│     └─ 反三角：多值，由对数表示
│
└─ 5. 例题
      ├─ 四则运算
      ├─ 模/辐角/方根
      └─ 初等函数求值
```

# 关联

- 上一章：（本章为开篇）
- 下一章：[[vault-notes/math/complex-analysis/02-analytic-functions]]

**本章与后续章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 复数、模、辐角 | [[vault-notes/math/complex-analysis/02-analytic-functions]] 的柯西–黎曼方程；[[vault-notes/math/complex-analysis/03-complex-integration]] 的路径积分 |
| 指数形式、欧拉公式 | [[vault-notes/math/complex-analysis/07-fourier-transform]] 的复指数基；[[vault-notes/math/complex-analysis/08-laplace-transform]] 的复频率 |
| 多值对数、分支 | [[vault-notes/math/complex-analysis/04-series-representation]] 的洛朗级数；[[vault-notes/math/complex-analysis/05-residues-applications]] 的支点 |
| 复变函数与映射 | [[vault-notes/math/complex-analysis/06-conformal-mapping]] 的几何变换 |
| 方根与单位根 | 离散傅里叶变换（DFT）；[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]] |

**通信方向应用**：

- [[vault-notes/dsp/02-z-transform-and-dtft]] —— $z=re^{i\omega}$ 就是复平面上的点；DTFT 是单位圆上的取值。
- [[vault-notes/math/complex-analysis/07-fourier-transform]] —— 复指数 $e^{i\omega t}$ 是傅里叶分析的基函数；欧拉公式把正弦/余弦统一成复指数。
- [[vault-notes/math/complex-analysis/08-laplace-transform]] —— $s=\sigma+i\omega$ 是复频率；拉氏变换的 ROC 就是复平面上的区域。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 复基带信号 $I+jQ$ 就是复数；相位/幅度调制都是复平面的几何操作。
- [[vault-notes/matlab/matlab-notes]] —— `complex`/`abs`/`angle`/`exp`/`log` 是本章的直接工具。

**相关**：[[vault-notes/math/complex-analysis/02-analytic-functions]]｜[[vault-notes/math/complex-analysis/07-fourier-transform]]｜[[vault-notes/math/complex-analysis/08-laplace-transform]]｜[[vault-notes/matlab/matlab-notes]]
