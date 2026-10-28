---
title: "解析函数"
tags:
- 数学
- 复变函数
- 解析函数
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
> 复变函数里最重要的类不是"连续函数"，而是"**可导函数**"。本章建立复变函数的微分学：
> - **1. 复变函数的导数**：导数定义、求导法则；复可导比实可导强得多。
> - **2. 柯西–黎曼方程**：复可导的充要条件；$u_x=v_y$、$u_y=-v_x$；导数的四种等价写法。
> - **3. 解析函数**：在邻域内处处可导；整函数、奇点；解析的强性质。
> - **4. 调和函数**：解析函数的实部/虚部都是调和函数；共轭调和函数与拉普拉斯方程。
> - **5. 例题**：判断可导/解析、求导数、构造共轭调和函数。
>
> 一句话主线：**复可导 = 实部虚部满足柯西–黎曼方程；解析 = 在邻域内复可导；解析函数的实部与虚部都是调和函数——这条链条把复分析、偏微分方程与场论连接起来。**

> [!note] 记号约定
> - $f(z)=u(x,y)+iv(x,y)$；$u_x=\partial u/\partial x$，$u_y=\partial u/\partial y$
> - $f'(z_0)$：$f$ 在 $z_0$ 的导数；$\Delta z=\Delta x+i\Delta y$
> - 解析：$f$ 在 $z_0$ 及某邻域内可导；整函数：在 $\mathbb{C}$ 上解析
> - 奇点：$f$ 不解析的点（可能是可去奇点、极点、本性奇点，第 5 章细分）
> - 调和函数：满足 $\nabla^2u=u_{xx}+u_{yy}=0$ 的实函数
> - 极坐标：$z=re^{i\theta}$，$u_r=\partial u/\partial r$，$u_\theta=\partial u/\partial\theta$

# 1. 复变函数的导数

## 导数定义

> [!info] Def 1 复变函数的导数
> 设 $f(z)$ 在 $z_0$ 的某邻域内有定义。若极限
> $$
> f'(z_0)=\lim_{\Delta z\to0}\frac{f(z_0+\Delta z)-f(z_0)}{\Delta z}
> $$
> 存在（且与 $\Delta z\to0$ 的路径无关），则称 $f$ 在 $z_0$ **可导**（differentiable），该极限为 $f$ 在 $z_0$ 的**导数**。

> [!important] 复可导比实可导强得多
> 实函数 $f(x)$ 只需左右两侧极限相同；复函数要求 $\Delta z$ 沿**任意方向、任意路径**趋于 0 时商都趋于同一个值。这个要求极强，导致：
> - 很多看起来"很正常"的函数（如 $\bar z$、$|z|^2$）处处不可导；
> - 一旦可导，就会自动具有无穷阶导数、幂级数展开等强性质（第 3–4 章）。

## 求导法则

与实函数形式上完全相同：

$$
(f\pm g)'=f'\pm g',\qquad (fg)'=f'g+fg',\qquad \left(\frac fg\right)'=\frac{f'g-fg'}{g^2}
$$
$$
(f\circ g)'(z)=f'(g(z))\,g'(z)
$$

**基本初等函数的导数**：

| $f(z)$ | $f'(z)$ | 定义域 |
| --- | --- | --- |
| $z^n$ | $nz^{n-1}$ | $\mathbb{C}$ |
| $e^z$ | $e^z$ | $\mathbb{C}$ |
| $\sin z$ | $\cos z$ | $\mathbb{C}$ |
| $\cos z$ | $-\sin z$ | $\mathbb{C}$ |
| $\ln z$（主值） | $1/z$ | $\mathbb{C}\setminus(-\infty,0]$ |
| $z^\alpha$ | $\alpha z^{\alpha-1}$ | 相应分支 |

> [!example] 用定义求导
> $f(z)=z^2$：
> $$
> \frac{(z+\Delta z)^2-z^2}{\Delta z}=\frac{2z\Delta z+(\Delta z)^2}{\Delta z}=2z+\Delta z\to2z
> $$
> 与路径无关，故 $f'(z)=2z$。

> [!example] 一个处处不可导的例子
> $f(z)=\bar z$：
> $$
> \frac{\overline{z+\Delta z}-\bar z}{\Delta z}=\frac{\overline{\Delta z}}{\Delta z}
> $$
> 若 $\Delta z=\Delta x$（沿实轴），商为 $1$；若 $\Delta z=i\Delta y$（沿虚轴），商为 $-1$。极限不存在，故 $\bar z$ 处处不可导。

# 2. 柯西–黎曼方程

## 定理

> [!info] Def 2 柯西–黎曼方程
> 设 $f(z)=u(x,y)+iv(x,y)$ 在 $z_0=x_0+iy_0$ 的某邻域内有定义。则 $f$ 在 $z_0$ 可导的**充要条件**是：
> 1. $u,v$ 在 $(x_0,y_0)$ 可微；
> 2. 满足**柯西–黎曼方程**（Cauchy–Riemann equations，简称 C-R 方程）
> $$
> u_x=v_y,\qquad u_y=-v_x
> $$
>
> 此时
> $$
> f'(z_0)=u_x+iv_x=v_y-iu_y=u_x-iu_y=v_y+iv_x
> $$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 330" width="100%" style="max-width:720px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <line x1="60.0" y1="40.0" x2="330.0" y2="40.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="60.0" y1="40.0" x2="60.0" y2="250.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <rect x="180.0" y="120.0" width="70" height="70" fill="#2563eb" fill-opacity="0.22" stroke="#2563eb" stroke-width="1.6"/>
  <text x="215.0" y="112.0" text-anchor="middle" font-size="11" fill="#2563eb" font-weight="normal">z 平面小方块</text>
  <line x1="420.0" y1="40.0" x2="690.0" y2="40.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="420.0" y1="40.0" x2="420.0" y2="250.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <polygon points="533.2,85.2 614.8,123.2 576.8,204.8 495.2,166.8" fill="#7c3aed" fill-opacity="0.25" stroke="none"/>
  <polyline points="533.2,85.2 614.8,123.2 576.8,204.8 495.2,166.8 533.2,85.2" fill="none" stroke="#7c3aed" stroke-width="1.6"/>
  <text x="555.0" y="85.0" text-anchor="middle" font-size="11" fill="#7c3aed" font-weight="normal">w 平面：旋转 + 伸缩</text>
  <line x1="340.0" y1="145.0" x2="400.0" y2="145.0" stroke="var(--text-muted,#57606a)" stroke-width="1.6" marker-end="url(#ar)"/>
  <text x="370.0" y="132.0" text-anchor="middle" font-size="12" fill="var(--text-accent,#705dcf)" font-weight="normal">w=f(z)</text>
  <text x="360.0" y="300.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">解析且 f'(z₀)≠0：小方块被旋转 arg f'、放大 |f'|，角度不变</text>
</svg>

## 几何直观

沿实轴逼近（$\Delta z=\Delta x$）：

$$
f'(z)=\frac{\partial f}{\partial x}=u_x+iv_x
$$

沿虚轴逼近（$\Delta z=i\Delta y$）：

$$
f'(z)=\frac{1}{i}\frac{\partial f}{\partial y}=-i(u_y+iv_y)=v_y-iu_y
$$

两者必须相等，比较实部/虚部即得 C-R 方程。

> [!tip] 记忆口诀
> **$u_x=v_y$，$u_y=-v_x$**：实部对 $x$ 的偏导 = 虚部对 $y$ 的偏导；实部对 $y$ 的偏导 = 负的虚部对 $x$ 的偏导。
> 也可以写成"$f$ 的实部与虚部构成共轭调和函数"（见第 4 节）。

## 极坐标形式

设 $z=re^{i\theta}$，$f=u(r,\theta)+iv(r,\theta)$，则 C-R 方程为

$$
u_r=\frac1r v_\theta,\qquad v_r=-\frac1r u_\theta
$$

导数：

$$
f'(z)=e^{-i\theta}(u_r+iv_r)=\frac{1}{z}(v_\theta-iu_\theta)
$$

极坐标形式在圆域、角域问题中更方便。

> [!example] 判断可导性
> $f(z)=|z|^2=x^2+y^2$。
> $u=x^2+y^2$，$v=0$。C-R：$u_x=2x=v_y=0$，$u_y=2y=-v_x=0$，故只有在 $x=y=0$ 即 $z=0$ 处成立。
> 因此 $|z|^2$ 只在 $z=0$ 可导，处处不解析。

> [!example] 指数函数
> $e^z=e^x\cos y+ie^x\sin y$。
> $u=e^x\cos y$，$v=e^x\sin y$。
> $$
> u_x=e^x\cos y=v_y,\qquad u_y=-e^x\sin y=-v_x
> $$
> C-R 处处成立，且 $u,v$ 可微，故 $e^z$ 处处解析，$(e^z)'=u_x+iv_x=e^x\cos y+ie^x\sin y=e^z$。

# 3. 解析函数

## 定义

> [!info] Def 3 解析函数
> 若 $f(z)$ 在 $z_0$ 的某邻域内**处处可导**，则称 $f$ 在 $z_0$ **解析**（analytic / holomorphic）。若 $f$ 在区域 $D$ 内每点解析，则称 $f$ 在 $D$ 内解析。

> [!info] Def 4 整函数与奇点
> - **整函数**（entire function）：在整個复平面 $\mathbb{C}$ 上解析的函数，如 $e^z$、$\sin z$、多项式。
> - **奇点**（singular point）：$f$ 不解析的点。如 $1/z$ 在 $z=0$ 的奇点。

**可导 vs 解析**：

| 概念 | 要求 |
| --- | --- |
| 在 $z_0$ 可导 | 仅在 $z_0$ 一点极限存在 |
| 在 $z_0$ 解析 | 在 $z_0$ 的**某邻域内每点**可导 |

所以"只在一点可导"不等于"解析"（如 $|z|^2$ 在 $z=0$ 可导但不解析）。

## 解析函数的强性质

> [!important] 解析函数的"刚性"
> 解析函数比实可微函数"刚性"得多：
> 1. 解析 ⇒ 无穷次可导（第 3 章）
> 2. 解析 ⇒ 在每点的邻域内可展开为幂级数（第 4 章）
> 3. 解析函数的零点孤立（除非恒为零）
> 4. 解析函数的实部/虚部都是调和函数（第 4 节）
> 5. 两个解析函数若在某个有聚点的集合上相等，则处处相等（唯一性定理）

## 解析的判定

**常用判定链**：

1. 写出 $u,v$
2. 检查 $u,v$ 是否可微（通常多项式/初等函数都满足）
3. 检查 C-R 方程是否在区域内处处成立
4. 若是，则解析；若只在个别点成立，则只可导不解析

> [!example] 分式函数的解析性
> $f(z)=\dfrac{1}{z}$ 在 $z\ne0$ 处解析，$f'(z)=-1/z^2$。
> $z=0$ 是奇点（极点）。
> 一般地，有理函数 $P(z)/Q(z)$ 在 $Q(z)\ne0$ 处解析，奇点是 $Q$ 的零点。

# 4. 调和函数

## 定义与基本性质

> [!info] Def 5 调和函数
> 若实函数 $u(x,y)$ 在区域 $D$ 内有二阶连续偏导，且满足**拉普拉斯方程**
> $$
> \nabla^2u=u_{xx}+u_{yy}=0
> $$
> 则称 $u$ 为 $D$ 上的**调和函数**（harmonic function）。

> [!info] Def 6 共轭调和函数
> 若 $u,v$ 满足 C-R 方程
> $$
> u_x=v_y,\qquad u_y=-v_x
> $$
> 则称 $v$ 为 $u$ 的**共轭调和函数**（conjugate harmonic function）。此时 $f=u+iv$ 解析。

## 解析函数与调和函数

> [!important] 核心定理
> 若 $f(z)=u+iv$ 在区域 $D$ 内解析，则 $u$ 与 $v$ 都是 $D$ 上的调和函数：
> $$
> \nabla^2u=0,\qquad \nabla^2v=0
> $$
> 反之，若 $u$ 是单连通区域 $D$ 上的调和函数，则存在 $v$（相差一个常数），使 $f=u+iv$ 在 $D$ 内解析。

**证明**（$u$ 的调和性）：由 C-R，$u_x=v_y$，$u_y=-v_x$。再求导：

$$
u_{xx}=v_{yx},\qquad u_{yy}=-v_{xy}
$$

若 $v$ 二阶偏导连续，$v_{yx}=v_{xy}$，故 $u_{xx}+u_{yy}=0$。

## 由 $u$ 求 $v$

**方法一（积分法）**：

1. 由 $v_y=u_x$ 对 $y$ 积分：$v=\int u_x\,\mathrm{d}y+\phi(x)$
2. 对 $x$ 求导，利用 $v_x=-u_y$ 定出 $\phi'(x)$
3. 积分得 $\phi(x)$，再加常数

**方法二（曲线积分）**：

$$
v(x,y)=\int_{(x_0,y_0)}^{(x,y)}-u_y\,\mathrm{d}x+u_x\,\mathrm{d}y+C
$$

在单连通区域内与路径无关。

> [!example] 由调和函数求解析函数
> 设 $u=x^2-y^2$，求解析函数 $f=u+iv$。
> $u_x=2x$，$u_y=-2y$。
> 由 $v_y=u_x=2x$，对 $y$ 积分：$v=2xy+\phi(x)$。
> 由 $v_x=-u_y=2y$，得 $2y+\phi'(x)=2y$，故 $\phi'(x)=0$，$\phi=C$。
> $$
> v=2xy+C,\qquad f(z)=x^2-y^2+i(2xy+C)=z^2+iC
> $$
> 验证：$z^2=(x+iy)^2=x^2-y^2+2ixy$。

> [!warning] "共轭"不是复共轭
> 共轭调和函数里的"共轭"指的是 C-R 方程意义下的配对，不是 $\bar z$。$v$ 与 $u$ 的关系是"$u+iv$ 解析"，而不是 $v=\bar u$。

## 极坐标下的调和函数

$$
\nabla^2u=\frac{1}{r}\frac{\partial}{\partial r}\left(r\frac{\partial u}{\partial r}\right)+\frac{1}{r^2}\frac{\partial^2u}{\partial\theta^2}=0
$$

**常用调和函数**：$r^n\cos n\theta$、$r^n\sin n\theta$、$\ln r$、$\theta$（在多连通区域）。它们正是分离变量法解拉普拉斯方程的基本解（第 10 章）。

# 5. 例题

> [!example] 例 1：判断解析性
> $f(z)=x^2+y^2+i2xy$。
> $u=x^2+y^2$，$v=2xy$。
> $u_x=2x$，$v_y=2x$ → 相等；
> $u_y=2y$，$-v_x=-2y$ → 相等。
> C-R 处处成立，且 $u,v$ 可微，故 $f$ 处处解析。
> $$
> f'(z)=u_x+iv_x=2x+i2y=2z
> $$
> 事实上 $f(z)=(x+iy)^2=z^2$。

> [!example] 例 2：判断可导点
> $f(z)=x^2-y^2+i2xy$ 与例 1 相同，处处解析。再试 $f(z)=x^2+y^2+i2xy$（注意实部符号）。
> $u=x^2+y^2$，$v=2xy$：$u_x=2x=v_y$ ✓；$u_y=2y=-v_x=-2y$ 仅在 $y=0$ 成立。
> 故只在实轴上可导；处处不解析。

> [!example] 例 3：极坐标判定
> $f(z)=z^n$ 在极坐标下 $f=r^ne^{in\theta}$，$u=r^n\cos n\theta$，$v=r^n\sin n\theta$。
> $$u_r=nr^{n-1}\cos n\theta,\qquad \frac1r v_\theta=nr^{n-1}\cos n\theta$$ ✓
> $$v_r=nr^{n-1}\sin n\theta,\qquad -\frac1r u_\theta=nr^{n-1}\sin n\theta$$ ✓
> 故 $z^n$ 解析，$f'(z)=nz^{n-1}$。

> [!example] 例 4：共轭调和函数
> 设 $u=e^x\cos y$，求 $v$ 使 $f=u+iv$ 解析。
> $u_x=e^x\cos y$，$u_y=-e^x\sin y$。
> $v_y=u_x=e^x\cos y$ → $v=e^x\sin y+\phi(x)$。
> $v_x=e^x\sin y+\phi'(x)=-u_y=e^x\sin y$ → $\phi'=0$，$\phi=C$。
> $$
> v=e^x\sin y+C,\qquad f=e^x(\cos y+i\sin y)+iC=e^z+iC
> $$

> [!example] 例 5：验证调和性
> $u=\ln r=\frac12\ln(x^2+y^2)$。验证 $\nabla^2u=0$。
> $$
> u_x=\frac{x}{x^2+y^2},\qquad u_{xx}=\frac{y^2-x^2}{(x^2+y^2)^2}
> $$
> $$
> u_y=\frac{y}{x^2+y^2},\qquad u_{yy}=\frac{x^2-y^2}{(x^2+y^2)^2}
> $$
> $$
> u_{xx}+u_{yy}=0
> $$
> 故 $\ln r$ 在 $\mathbb{C}\setminus\{0\}$ 上调和；其共轭调和函数为 $\theta=\operatorname{Arg}z$，对应 $f=\ln z$。

> [!tip] 本章收官
> 第 2 章建立了复变函数的微分学：
> 1. **导数**（1）：复可导要求沿任意路径极限相同，比实可导强得多。
> 2. **C-R 方程**（2）：$u_x=v_y$、$u_y=-v_x$ 是可导的充要条件（加上可微性）；导数的四种写法。
> 3. **解析函数**（3）：邻域内处处可导；整函数与奇点；解析的强性质。
> 4. **调和函数**（4）：解析函数的实部/虚部都调和；共轭调和函数与拉普拉斯方程。
>
> 一句话：**复可导 = C-R；解析 = 邻域内复可导；解析函数的实部虚部都是调和函数——这条链条把复分析、拉普拉斯方程与场论连接起来。下一章研究解析函数的积分，得到柯西积分定理与柯西积分公式。**

# 本章知识地图

```
解析函数
├─ 1. 导数
│     ├─ f'(z₀)=lim [f(z₀+Δz)−f(z₀)]/Δz
│     ├─ 沿任意路径极限相同
│     ├─ 求导法则与实函数相同
│     └─ 基本初等函数导数表
│
├─ 2. 柯西–黎曼方程
│     ├─ 可导充要条件：u,v 可微 + C-R
│     ├─ u_x=v_y，u_y=−v_x
│     ├─ f'=u_x+iv_x=v_y−iu_y
│     └─ 极坐标：u_r=v_θ/r，v_r=−u_θ/r
│
├─ 3. 解析函数
│     ├─ 邻域内处处可导
│     ├─ 整函数：全平面解析
│     ├─ 奇点：不解析的点
│     └─ 解析的强性质（无穷可导、幂级数、零点孤立）
│
├─ 4. 调和函数
│     ├─ ∇²u=u_xx+u_yy=0
│     ├─ 解析 ⇒ u,v 都调和
│     ├─ 共轭调和：u_x=v_y，u_y=−v_x
│     └─ 由 u 求 v：积分法/曲线积分
│
└─ 5. 例题
      ├─ 判断可导/解析
      ├─ 极坐标判定
      └─ 由 u 求 v
```

# 关联

- 上一章：[[vault-notes/math/complex-analysis/01-complex-numbers-functions]]
- 下一章：[[vault-notes/math/complex-analysis/03-complex-integration]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 复可导、C-R 方程 | [[vault-notes/math/complex-analysis/03-complex-integration]] 的柯西积分定理 |
| 解析函数 | [[vault-notes/math/complex-analysis/04-series-representation]] 的泰勒/洛朗展开 |
| 奇点 | [[vault-notes/math/complex-analysis/05-residues-applications]] 的孤立奇点分类 |
| 调和函数 | [[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] 的拉普拉斯方程 |
| 共轭调和函数 | 解析函数的构造；[[vault-notes/math/complex-analysis/06-conformal-mapping]] 的解析映射 |
| C-R 方程 | [[vault-notes/math/complex-analysis/09-field-theory-basics]] 的保守场/势函数 |

**本章留下的三个悬念（第 3 章结清）**：

| 本章的悬念 | 第 3 章的答案 |
| --- | --- |
| 解析函数沿闭曲线的积分有什么特殊性质？ | 柯西积分定理：解析函数沿闭曲线积分为 0（单连通区域） |
| 已知边界上的值，能否求内部的函数值？ | 柯西积分公式：$f(z_0)=\frac{1}{2\pi i}\oint\frac{f(z)}{z-z_0}dz$ |
| 解析函数为什么无穷次可导？ | 高阶导数公式：$f^{(n)}(z_0)=\frac{n!}{2\pi i}\oint\frac{f(z)}{(z-z_0)^{n+1}}dz$ |

**通信方向应用**：

- [[vault-notes/dsp/02-z-transform-and-dtft]] —— 解析性决定 z 变换的收敛域；极点是奇点。
- [[vault-notes/math/complex-analysis/08-laplace-transform]] —— $s$ 平面上的解析性、极点与稳定性判据。
- [[vault-notes/math/complex-analysis/09-field-theory-basics]] —— 保守场的势函数与解析函数的实部/虚部对应；C-R 方程就是无旋/无散条件。
- [[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] —— 拉普拉斯方程的解是调和函数，正是本章第 4 节的内容。
- [[vault-notes/matlab/matlab-notes]] —— 复变函数的可导性/解析性可以用符号计算验证。

**相关**：[[vault-notes/math/complex-analysis/01-complex-numbers-functions]]｜[[vault-notes/math/complex-analysis/03-complex-integration]]｜[[vault-notes/math/complex-analysis/09-field-theory-basics]]｜[[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]]
