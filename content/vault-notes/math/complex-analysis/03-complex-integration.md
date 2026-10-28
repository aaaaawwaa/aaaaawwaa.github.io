---
title: "复变函数的积分"
tags:
- 数学
- 复变函数
- 复积分
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
> 本章建立复变函数的积分学。核心是三个定理，它们把"解析"这个局部性质变成强大的整体工具：
> - **1. 复积分的概念与性质**：复积分是沿曲线的复数和；可化为两个实线积分；基本性质。
> - **2. 柯西积分定理**：解析函数沿单连通区域内任意闭曲线的积分为 0；多连通区域的推广。
> - **3. 柯西积分公式**：解析函数在内部一点的值，由边界上的积分完全确定。
> - **4. 高阶导数公式**：解析函数无穷次可导；刘维尔定理、莫雷拉定理、最大模原理。
> - **5. 例题**：直接积分、柯西定理、柯西公式、高阶导数。
>
> 一句话主线：**解析函数沿闭曲线的积分为 0（柯西定理）；边界值决定内部值（柯西公式）；内部值可无穷次求导（高阶导数公式）——这三条是复分析的全部力量来源。**

> [!note] 记号约定
> - $C$：有向曲线；$\oint_C$：沿闭曲线逆时针积分
> - $f(z)=u+iv$；$\mathrm{d}z=\mathrm{d}x+i\mathrm{d}y$
> - 单连通区域：区域内任意闭曲线可在区域内连续收缩为一点；多连通区域有"洞"
> - $D$：区域；$\partial D$：边界（逆时针为正）
> - $f^{(n)}(z_0)$：$f$ 在 $z_0$ 的 $n$ 阶导数
> - $|f(z)|\le M$：有界

# 1. 复积分的概念与性质

## 定义

> [!info] Def 1 复积分
> 设 $C$ 是复平面上一条有向光滑曲线，$f(z)$ 在 $C$ 上有定义。把 $C$ 分成 $n$ 小段，分点 $z_0,z_1,\dots,z_n$，在每段上任取 $\zeta_k$，作和
> $$
> \sum_{k=1}^n f(\zeta_k)(z_k-z_{k-1})
> $$
> 当最大段长 $\to0$ 时，若和趋于一个与分法、取法无关的复数，则称此极限为 $f$ 沿 $C$ 的**复积分**，记
> $$
> \int_C f(z)\,\mathrm{d}z
> $$

## 化为实线积分

$$
f(z)=u+iv,\qquad \mathrm{d}z=\mathrm{d}x+i\mathrm{d}y
$$

$$
\int_C f(z)\,\mathrm{d}z=\int_C(u\,\mathrm{d}x-v\,\mathrm{d}y)+i\int_C(v\,\mathrm{d}x+u\,\mathrm{d}y)
$$

这是计算复积分最基本的方法：**拆成两个第二类实线积分**。

## 基本性质

1. **线性**：$\int_C(af+bg)\,\mathrm{d}z=a\int_Cf\,\mathrm{d}z+b\int_Cg\,\mathrm{d}z$
2. **方向**：$\int_{-C}f\,\mathrm{d}z=-\int_Cf\,\mathrm{d}z$
3. **路径可加**：$C=C_1+C_2$ 时 $\int_C=\int_{C_1}+\int_{C_2}$
4. **估值不等式**：
   $$
   \left|\int_C f(z)\,\mathrm{d}z\right|\le\int_C|f(z)|\,|\mathrm{d}z|\le ML
   $$
   其中 $M=\max_C|f(z)|$，$L$ 为曲线长度。

> [!example] 直接计算
> 计算 $\int_C z\,\mathrm{d}z$，$C$ 为从 $0$ 到 $1+i$ 的直线段。
> 参数化：$z=(1+i)t$，$0\le t\le1$，$\mathrm{d}z=(1+i)\mathrm{d}t$。
> $$
> \int_C z\,\mathrm{d}z=\int_0^1(1+i)t\cdot(1+i)\,\mathrm{d}t=(1+i)^2\int_0^1t\,\mathrm{d}t=\frac{(1+i)^2}{2}=i
> $$

> [!warning] 复积分一般与路径有关
> 对 $f(z)=\bar z$，从 $0$ 到 $1+i$ 沿直线与沿折线的积分不同。只有当 $f$ 解析（或满足保守场条件）时，积分才与路径无关。这正是下一节柯西定理的内容。

# 2. 柯西积分定理

## 单连通区域

> [!info] Def 2 单连通区域
> 若区域 $D$ 内任意简单闭曲线都可在 $D$ 内连续收缩为一点，则称 $D$ 为**单连通区域**（simply connected domain）。直观上，$D$ 没有"洞"。

> [!info] Def 3 柯西积分定理
> 若 $f(z)$ 在单连通区域 $D$ 内解析，$C$ 是 $D$ 内任意一条闭曲线，则
> $$
> \oint_C f(z)\,\mathrm{d}z=0
> $$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 360" width="100%" style="max-width:620px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <polyline points="430.0,180.0 434.4,174.5 438.2,168.7 441.0,162.5 442.8,156.1 443.4,149.7 442.6,143.2 440.5,137.0 437.0,131.1 432.3,125.7 426.3,120.8 419.3,116.7 411.5,113.3 403.1,110.6 394.2,108.8 385.1,107.7 376.0,107.2 367.1,107.4 358.4,107.9 350.3,108.8 342.5,109.9 335.3,111.0 328.5,112.0 322.1,112.8 316.0,113.3 310.0,113.5 304.0,113.3 297.9,112.8 291.5,112.0 284.7,111.0 277.5,109.9 269.7,108.8 261.6,107.9 252.9,107.4 244.0,107.2 234.9,107.7 225.8,108.8 216.9,110.6 208.5,113.3 200.7,116.7 193.7,120.8 187.7,125.7 183.0,131.1 179.5,137.0 177.4,143.2 176.6,149.7 177.2,156.1 179.0,162.5 181.8,168.7 185.6,174.5 190.0,180.0 194.9,185.1 200.1,189.7 205.3,194.0 210.3,197.9 215.1,201.6 219.5,205.1 223.3,208.5 226.7,212.1 229.6,215.7 232.2,219.6 234.4,223.8 236.6,228.3 238.8,233.1 241.2,238.2 244.0,243.6 247.4,249.1 251.4,254.6 256.3,259.9 261.9,265.0 268.4,269.7 275.6,273.7 283.6,277.0 292.0,279.5 300.9,281.0 310.0,281.5 319.1,281.0 328.0,279.5 336.4,277.0 344.4,273.7 351.6,269.7 358.1,265.0 363.7,259.9 368.6,254.6 372.6,249.1 376.0,243.6 378.8,238.2 381.2,233.1 383.4,228.3 385.6,223.8 387.8,219.6 390.4,215.7 393.3,212.1 396.7,208.5 400.5,205.1 404.9,201.6 409.7,197.9 414.7,194.0 419.9,189.7 425.1,185.1 430.0,180.0" fill="none" stroke="#2563eb" stroke-width="2.2"/>
  <text x="440.0" y="120.0" text-anchor="start" font-size="14" fill="#2563eb" font-weight="600">C</text>
  <circle cx="270.0" cy="200.0" r="4.0" fill="#dc2626" stroke="#dc2626" stroke-width="1.0"/>
  <text x="278.0" y="196.0" text-anchor="start" font-size="11" fill="#dc2626" font-weight="normal">z₁</text>
  <circle cx="340.0" cy="170.0" r="4.0" fill="#dc2626" stroke="#dc2626" stroke-width="1.0"/>
  <text x="348.0" y="166.0" text-anchor="start" font-size="11" fill="#dc2626" font-weight="normal">z₂</text>
  <circle cx="320.0" cy="225.0" r="4.0" fill="#dc2626" stroke="#dc2626" stroke-width="1.0"/>
  <text x="328.0" y="221.0" text-anchor="start" font-size="11" fill="#dc2626" font-weight="normal">z₃</text>
  <circle cx="270.0" cy="200.0" r="28.0" fill="none" stroke="#059669" stroke-width="1.4" stroke-dasharray="4 3"/>
  <text x="310.0" y="330.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">留数定理：∮_C f dz = 2πi Σ(内部奇点的留数)</text>
</svg>

> [!important] 柯西定理的三种等价表述
> 1. **闭曲线形式**：解析函数沿任意闭曲线积分为 0。
> 2. **路径无关形式**：在单连通区域内，$\int_{z_0}^{z_1}f(z)\mathrm{d}z$ 与路径无关（只与起点、终点有关）。
> 3. **原函数形式**：解析函数在单连通区域内有原函数 $F(z)$，且 $\int_{z_0}^{z_1}f(z)\mathrm{d}z=F(z_1)-F(z_0)$。

## 多连通区域的推广

若 $D$ 是多连通区域（有洞），$f$ 在 $D$ 内解析，$C$ 是 $D$ 内的一条闭曲线，则

$$
\oint_C f(z)\,\mathrm{d}z=\sum_{k=1}^n\oint_{C_k}f(z)\,\mathrm{d}z
$$

其中 $C_k$ 是 $C$ 内部的各个"洞"的边界（逆时针）。特别地，若 $C$ 包围 $n$ 个洞，可以**把外边界变形为内边界之和**。

> [!example] 环域上的积分
> $f(z)=1/z$ 在环域 $0<|z|<R$ 内解析。取以原点为心、$r$ 为半径的圆 $C_r$：
> $$
> \oint_{C_r}\frac{\mathrm{d}z}{z}=\int_0^{2\pi}\frac{ire^{i\theta}}{re^{i\theta}}\,\mathrm{d}\theta=2\pi i
> $$
> 结果与 $r$ 无关——这正是留数定理的雏形（第 5 章）。

## 原函数与不定积分

若 $f$ 在单连通区域 $D$ 内解析，则

$$
F(z)=\int_{z_0}^{z}f(\zeta)\,\mathrm{d}\zeta
$$

是 $f$ 的原函数，$F'(z)=f(z)$，且

$$
\int_{z_0}^{z_1}f(z)\,\mathrm{d}z=F(z_1)-F(z_0)
$$

**牛顿–莱布尼茨公式在复变函数中成立**（前提：$f$ 解析、区域单连通）。

> [!example] 用原函数计算
> $$
> \int_0^i z^2\,\mathrm{d}z=\left.\frac{z^3}{3}\right|_0^i=\frac{i^3}{3}=-\frac{i}{3}
> $$
> 因为 $z^2$ 是整函数，路径无关。

# 3. 柯西积分公式

> [!info] Def 4 柯西积分公式
> 设 $f(z)$ 在简单闭曲线 $C$ 及其内部解析，$z_0$ 是 $C$ 内部一点，则
> $$
> f(z_0)=\frac{1}{2\pi i}\oint_C\frac{f(z)}{z-z_0}\,\mathrm{d}z
> $$
> 其中积分沿 $C$ 逆时针方向。

> [!important] 公式的含义
> **解析函数在内部一点的值，完全由它在边界上的值决定。**
> 这与实分析形成鲜明对比：实函数在一点的值与邻域值没有这种"积分约束"。
> 它也说明解析函数有极强的"刚性"——边界值一变，内部值必须跟着变。

**证明思路**：以 $z_0$ 为心作小圆 $C_\rho$，由柯西定理把 $C$ 变形为 $C_\rho$；在 $C_\rho$ 上 $f(z)\approx f(z_0)$，而 $\oint_{C_\rho}\frac{\mathrm{d}z}{z-z_0}=2\pi i$，令 $\rho\to0$ 即得。

> [!example] 用柯西公式计算
> 计算 $\oint_{|z|=2}\dfrac{e^z}{z-1}\,\mathrm{d}z$。
> $f(z)=e^z$ 在 $|z|\le2$ 内解析，$z_0=1$ 在内部。
> $$
> \oint_{|z|=2}\frac{e^z}{z-1}\,\mathrm{d}z=2\pi i\,f(1)=2\pi i\,e
> $$

> [!warning] 奇点必须在内部
> 若 $z_0$ 不在 $C$ 内部，则 $\dfrac{f(z)}{z-z_0}$ 在 $C$ 内解析，积分为 0。使用公式前先画图确认奇点位置。

## 平均值公式

在柯西公式中取 $C$ 为以 $z_0$ 为心、$r$ 为半径的圆：

$$
f(z_0)=\frac{1}{2\pi}\int_0^{2\pi}f(z_0+re^{i\theta})\,\mathrm{d}\theta
$$

即**解析函数在圆心的值等于圆周上值的平均**。这是解析函数"刚性"的又一表现，也是最大模原理的基础。

# 4. 高阶导数公式

> [!info] Def 5 高阶导数公式
> 设 $f$ 在简单闭曲线 $C$ 及其内部解析，$z_0$ 在 $C$ 内部，则 $f$ 在 $z_0$ 有任意阶导数：
> $$
> f^{(n)}(z_0)=\frac{n!}{2\pi i}\oint_C\frac{f(z)}{(z-z_0)^{n+1}}\,\mathrm{d}z,\qquad n=0,1,2,\dots
> $$

> [!important] 解析函数自动无穷次可导
> 这是复分析与实分析最本质的区别之一：
> - 实函数 $f(x)=x^2\sin(1/x)$ 可导，但导数不连续；
> - 复函数只要**一次**可导（在邻域内），就自动**无穷次**可导，且每阶导数都有积分表示。
>
> 由此，解析函数在每点的邻域内都能展开成幂级数（第 4 章）。

## 三个重要推论

> [!tip] 刘维尔定理
> 若 $f$ 是整函数（全平面解析）且有界（$|f(z)|\le M$），则 $f$ 为常数。
> **证明思路**：对任意 $z_0$，用高阶导数公式估计 $|f'(z_0)|\le M/R$，令 $R\to\infty$ 得 $f'(z_0)=0$。
> **推论**：非常数整函数必然无界（这解释了第 1 章"复三角函数无界"）。

> [!tip] 莫雷拉定理
> 若 $f$ 在区域 $D$ 内连续，且对 $D$ 内任意闭曲线 $C$ 都有 $\oint_C f\,\mathrm{d}z=0$，则 $f$ 在 $D$ 内解析。
> 这是柯西定理的逆定理，常用于证明"积分定义的函数"解析。

> [!tip] 最大模原理
> 若 $f$ 在区域 $D$ 内解析且不恒为常数，则 $|f(z)|$ 在 $D$ 内部**不能取到最大值**；最大值只能在边界上达到。
> **推论**：若 $f$ 在闭区域上解析且边界上 $|f|\le M$，则整个区域内 $|f|\le M$。

> [!example] 高阶导数公式的应用
> 计算 $\oint_{|z|=1}\dfrac{\cos z}{z^3}\,\mathrm{d}z$。
> $f(z)=\cos z$，$z_0=0$，$n=2$：
> $$
> \oint_{|z|=1}\frac{\cos z}{z^3}\,\mathrm{d}z=\frac{2\pi i}{2!}f''(0)=\pi i(-\cos0)=-\pi i
> $$

# 5. 例题

> [!example] 例 1：直接积分
> 计算 $\int_C\bar z\,\mathrm{d}z$，$C$ 为单位圆上半部分，从 $1$ 到 $-1$。
> 参数化 $z=e^{i\theta}$，$\theta:0\to\pi$，$\bar z=e^{-i\theta}$，$\mathrm{d}z=ie^{i\theta}\mathrm{d}\theta$。
> $$
> \int_C\bar z\,\mathrm{d}z=\int_0^\pi e^{-i\theta}ie^{i\theta}\,\mathrm{d}\theta=i\pi
> $$

> [!example] 例 2：柯西定理
> 计算 $\oint_{|z|=1}\dfrac{e^z}{z^2+1}\,\mathrm{d}z$。
> $z^2+1$ 的零点是 $\pm i$，都在单位圆内，故被积函数在圆内不解析，不能直接用柯西定理（需留数，第 5 章）。
> 若改为 $\oint_{|z|=2}\dfrac{e^z}{z^2+1}\,\mathrm{d}z$，奇点仍在内部，同样不能直接用柯西定理。

> [!example] 例 3：柯西公式
> 计算 $\oint_{|z-1|=1}\dfrac{\sin z}{z}\,\mathrm{d}z$。
> 奇点 $z=0$ 在圆 $|z-1|=1$ 的边界上（不是内部），故被积函数在闭圆盘内不解析，不能直接用公式。若改为 $|z-1|=2$，$z=0$ 在内部：
> $$
> \oint_{|z-1|=2}\frac{\sin z}{z}\,\mathrm{d}z=2\pi i\sin0=0
> $$

> [!example] 例 4：高阶导数
> 计算 $\oint_{|z|=2}\dfrac{e^z}{(z-1)^2}\,\mathrm{d}z$。
> $f(z)=e^z$，$z_0=1$，$n=1$：
> $$
> \oint_{|z|=2}\frac{e^z}{(z-1)^2}\,\mathrm{d}z=\frac{2\pi i}{1!}f'(1)=2\pi i\,e
> $$

> [!example] 例 5：多连通区域
> 计算 $\oint_{|z|=3}\dfrac{1}{z(z-2)}\,\mathrm{d}z$。
> 奇点 $z=0,2$ 都在圆内。用部分分式：
> $$
> \frac{1}{z(z-2)}=\frac{1}{2}\left(\frac{1}{z-2}-\frac{1}{z}\right)
> $$
> $$
> \oint_{|z|=3}\frac{\mathrm{d}z}{z(z-2)}=\frac12(2\pi i-2\pi i)=0
> $$
> 两个奇点的留数相互抵消（第 5 章会看到留数之和为 0）。

> [!tip] 本章收官
> 第 3 章用三个定理把"解析"的局部性质变成整体工具：
> 1. **复积分**（1）：拆成两个实线积分；方向、可加、估值不等式。
> 2. **柯西定理**（2）：解析函数沿单连通区域内闭曲线积分为 0；多连通区域可变形为内边界之和。
> 3. **柯西公式**（3）：$f(z_0)=\frac{1}{2\pi i}\oint\frac{f(z)}{z-z_0}dz$；边界值决定内部值。
> 4. **高阶导数公式**（4）：解析函数无穷次可导；刘维尔、莫雷拉、最大模原理。
>
> 一句话：**柯西定理说"闭路积分为 0"，柯西公式说"边界定内部"，高阶导数公式说"一次可导就无穷可导"——这三条是复分析的全部力量来源。下一章把解析函数展开成级数，进一步揭示它的局部结构。**

# 本章知识地图

```
复变函数的积分
├─ 1. 复积分的概念与性质
│     ├─ 定义：分割、求和、取极限
│     ├─ 化为实线积分：∫(u dx−v dy)+i∫(v dx+u dy)
│     ├─ 线性、方向、可加
│     └─ 估值不等式：|∫f dz|≤ML
│
├─ 2. 柯西积分定理
│     ├─ 单连通：解析 ⇒ ∮f dz=0
│     ├─ 路径无关 ⇔ 有原函数
│     ├─ 多连通：外边界 = 内边界之和
│     └─ 牛顿–莱布尼茨公式成立
│
├─ 3. 柯西积分公式
│     ├─ f(z₀)=1/(2πi)∮f(z)/(z−z₀)dz
│     ├─ 边界值决定内部值
│     ├─ 平均值公式
│     └─ 奇点必须在内部
│
├─ 4. 高阶导数公式
│     ├─ f⁽ⁿ⁾(z₀)=n!/(2πi)∮f(z)/(z−z₀)^{n+1}dz
│     ├─ 解析 ⇒ 无穷次可导
│     ├─ 刘维尔定理：有界整函数为常数
│     ├─ 莫雷拉定理：闭路积分为 0 ⇒ 解析
│     └─ 最大模原理：最大值在边界
│
└─ 5. 例题
      ├─ 直接积分
      ├─ 柯西定理/公式
      ├─ 高阶导数
      └─ 多连通区域
```

# 关联

- 上一章：[[vault-notes/math/complex-analysis/02-analytic-functions]]
- 下一章：[[vault-notes/math/complex-analysis/04-series-representation]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 柯西定理 | [[vault-notes/math/complex-analysis/04-series-representation]] 的泰勒/洛朗级数收敛半径 |
| 柯西公式 | [[vault-notes/math/complex-analysis/05-residues-applications]] 的留数计算；[[vault-notes/math/complex-analysis/04-series-representation]] 的系数公式 |
| 高阶导数公式 | [[vault-notes/math/complex-analysis/04-series-representation]] 的泰勒系数 $a_n=f^{(n)}(z_0)/n!$ |
| 多连通区域 | [[vault-notes/math/complex-analysis/05-residues-applications]] 的留数定理（外边界 = 内边界之和） |
| 刘维尔定理 | 代数基本定理；整函数分类 |
| 最大模原理 | 调和函数的极值原理；[[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] 的边值问题唯一性 |

**本章留下的三个悬念（第 4 章结清）**：

| 本章的悬念 | 第 4 章的答案 |
| --- | --- |
| 解析函数能否展开成幂级数？ | 能：泰勒级数，收敛半径由最近奇点决定 |
| 有奇点时怎么展开？ | 洛朗级数：在环域内展开，含负幂项 |
| 奇点有哪些类型？ | 可去奇点、极点、本性奇点——由洛朗级数的负幂部分决定 |

**通信方向应用**：

- [[vault-notes/dsp/02-z-transform-and-dtft]] —— z 变换的收敛域与柯西定理的环形区域直接对应；逆 z 变换是围道积分。
- [[vault-notes/math/complex-analysis/08-laplace-transform]] —— 逆拉氏变换用围道积分/留数计算。
- [[vault-notes/math/complex-analysis/09-field-theory-basics]] —— 保守场的路径无关性与柯西定理同源（无旋场）。
- [[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] —— 调和函数的平均值公式、最大模原理。
- [[vault-notes/matlab/matlab-notes]] —— 复积分可用符号积分或数值围道积分验证。

**相关**：[[vault-notes/math/complex-analysis/02-analytic-functions]]｜[[vault-notes/math/complex-analysis/04-series-representation]]｜[[vault-notes/math/complex-analysis/05-residues-applications]]｜[[vault-notes/math/complex-analysis/08-laplace-transform]]
