---
title: "解析函数的级数表示"
tags:
- 数学
- 复变函数
- 级数
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
> 本章把解析函数展开成级数，揭示它的局部结构：
> - **1. 复数项级数与幂级数**：收敛、绝对收敛、幂级数的收敛半径、阿贝尔定理。
> - **2. 泰勒级数**：解析 ⇔ 可展开为幂级数；收敛半径由最近奇点决定。
> - **3. 洛朗级数**：在环域内展开，含负幂项；它是研究奇点的标准工具。
> - **4. 孤立奇点的分类**：可去奇点、极点、本性奇点；由洛朗级数的负幂部分判定。
> - **5. 例题**：泰勒展开、洛朗展开、奇点分类。
>
> 一句话主线：**泰勒级数是"没有奇点时的洛朗级数"；洛朗级数的负幂部分编码了奇点的全部信息——去掉负幂是可去奇点，有限项负幂是极点，无穷项负幂是本性奇点。**

> [!note] 记号约定
> - $\sum_{n=0}^\infty a_n(z-z_0)^n$：幂级数；$R$：收敛半径；$|z-z_0|<R$ 为收敛圆盘
> - $f(z)=\sum_{n=0}^\infty c_n(z-z_0)^n$：泰勒级数；$c_n=f^{(n)}(z_0)/n!$
> - $f(z)=\sum_{n=-\infty}^\infty c_n(z-z_0)^n$：洛朗级数；$r<|z-z_0|<R$ 为收敛环域
> - 负幂部分 $\sum_{n=1}^\infty c_{-n}(z-z_0)^{-n}$ 称为**主要部分**（principal part）
> - 孤立奇点：$z_0$ 的某去心邻域内解析，但 $z_0$ 本身不解析

# 1. 复数项级数与幂级数

## 复数项级数

> [!info] Def 1 复数项级数
> 设 $\{z_n\}$ 是复数列，称
> $$\sum_{n=1}^\infty z_n=z_1+z_2+\cdots$$
> 为**复数项级数**。若部分和 $S_N=\sum_{n=1}^N z_n$ 有极限 $S$，则称级数收敛，$S$ 为和。

**收敛的等价条件**：$\sum z_n$ 收敛 ⇔ $\sum\operatorname{Re}z_n$ 与 $\sum\operatorname{Im}z_n$ 都收敛。

**绝对收敛**：若 $\sum|z_n|$ 收敛，则 $\sum z_n$ 收敛（反之不成立）。绝对收敛的级数可任意重排。

## 幂级数

> [!info] Def 2 幂级数
> 形如
> $$\sum_{n=0}^\infty a_n(z-z_0)^n=a_0+a_1(z-z_0)+a_2(z-z_0)^2+\cdots$$
> 的级数称为**幂级数**（power series），$a_n$ 为系数，$z_0$ 为中心。

> [!info] Def 3 收敛半径
> 存在 $R\in[0,+\infty]$，使得幂级数在 $|z-z_0|<R$ 内绝对收敛、在 $|z-z_0|>R$ 内发散，则称 $R$ 为**收敛半径**（radius of convergence），$|z-z_0|=R$ 为收敛圆。

**收敛半径的求法**：

$$R=\frac{1}{\limsup_{n\to\infty}|a_n|^{1/n}}\qquad\text{或}\qquad R=\lim_{n\to\infty}\left|\frac{a_n}{a_{n+1}}\right|$$

（后者当极限存在时使用。）

> [!important] 阿贝尔定理
> 幂级数在收敛圆内**绝对收敛且内闭一致收敛**；在收敛圆外发散；在圆周上需要单独判断。
> **推论**：幂级数在收敛圆内可以逐项求导、逐项积分，收敛半径不变。

> [!example] 几何级数
> $$\sum_{n=0}^\infty z^n=\frac{1}{1-z},\qquad |z|<1$$
> 收敛半径 $R=1$，奇点 $z=1$ 在收敛圆上。

# 2. 泰勒级数

> [!info] Def 4 泰勒级数
> 设 $f(z)$ 在圆盘 $|z-z_0|<R$ 内解析，则
> $$f(z)=\sum_{n=0}^\infty c_n(z-z_0)^n,\qquad c_n=\frac{f^{(n)}(z_0)}{n!}$$
> 称为 $f$ 在 $z_0$ 的**泰勒级数**（Taylor series）。展开唯一。

> [!important] 解析 ⇔ 可展开为幂级数
> $f$ 在 $z_0$ 解析 ⇔ $f$ 在 $z_0$ 的某邻域内可展开为幂级数。
> 这是解析函数的第三个等价刻画（前两个：C-R 可导、柯西积分公式）。

**收敛半径的几何意义**：

$$R=\text{从 }z_0\text{ 到 }f\text{ 的最近奇点的距离}$$

- 若 $f$ 是整函数，则 $R=\infty$
- 若 $f$ 在 $z_0$ 附近有奇点，则收敛圆恰好碰到最近奇点

> [!example] 常用泰勒展开
> $$e^z=\sum_{n=0}^\infty\frac{z^n}{n!},\qquad R=\infty$$
> $$\sin z=\sum_{n=0}^\infty\frac{(-1)^nz^{2n+1}}{(2n+1)!},\qquad R=\infty$$
> $$\cos z=\sum_{n=0}^\infty\frac{(-1)^nz^{2n}}{(2n)!},\qquad R=\infty$$
> $$\frac{1}{1-z}=\sum_{n=0}^\infty z^n,\qquad R=1$$
> $$\ln(1+z)=\sum_{n=1}^\infty\frac{(-1)^{n-1}z^n}{n},\qquad R=1$$

> [!example] 在非零点展开
> 把 $f(z)=1/z$ 在 $z_0=1$ 展开。
> $$\frac{1}{z}=\frac{1}{1+(z-1)}=\sum_{n=0}^\infty(-1)^n(z-1)^n,\qquad |z-1|<1$$
> 收敛半径 $R=1$，正好是 $z_0=1$ 到奇点 $z=0$ 的距离。

> [!warning] 泰勒展开的唯一性
> 无论用什么方法（直接求导、几何级数、逐项积分/求导、代换），只要得到同一个圆盘内的幂级数，它就是泰勒级数。**不需要每次都用 $f^{(n)}(z_0)/n!$ 硬算**。

# 3. 洛朗级数

> [!info] Def 5 洛朗级数
> 设 $f(z)$ 在环域 $r<|z-z_0|<R$ 内解析，则
> $$f(z)=\sum_{n=-\infty}^{\infty}c_n(z-z_0)^n$$
> 其中
> $$c_n=\frac{1}{2\pi i}\oint_C\frac{f(\zeta)}{(\zeta-z_0)^{n+1}}\,\mathrm{d}\zeta$$
> $C$ 是环域内绕 $z_0$ 的任意简单闭曲线。称为**洛朗级数**（Laurent series）。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 440" width="100%" style="max-width:460px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <path d="M 230.0,60.0 a 160.0,160.0 0 1,0 0.1,0 Z M 230.0,135.0 a 85.0,85.0 0 1,1 -0.1,0 Z" fill="var(--text-accent,#705dcf)" fill-opacity="0.20" fill-rule="evenodd"/>
  <circle cx="230.0" cy="220.0" r="160.0" fill="none" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="230.0" cy="220.0" r="85.0" fill="none" stroke="var(--text-accent,#705dcf)" stroke-width="1.6" stroke-dasharray="5 3"/>
  <circle cx="230.0" cy="220.0" r="4.0" fill="#dc2626" stroke="#dc2626" stroke-width="1.0"/>
  <text x="236.0" y="212.0" text-anchor="start" font-size="11" fill="#dc2626" font-weight="normal">z₀（奇点）</text>
  <text x="370.0" y="210.0" text-anchor="start" font-size="12" fill="var(--text-accent,#705dcf)" font-weight="normal">R</text>
  <text x="323.0" y="210.0" text-anchor="start" font-size="12" fill="var(--text-accent,#705dcf)" font-weight="normal">r</text>
  <text x="230.0" y="30.0" text-anchor="middle" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="600">洛朗级数的收敛环域 r&lt;|z−z₀|&lt;R</text>
  <text x="230.0" y="420.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">环域内解析：可展开为含负幂的洛朗级数</text>
</svg>

**结构**：

$$f(z)=\underbrace{\sum_{n=0}^\infty c_n(z-z_0)^n}_{\text{解析部分}}+\underbrace{\sum_{n=1}^\infty c_{-n}(z-z_0)^{-n}}_{\text{主要部分}}$$

- 解析部分在 $|z-z_0|<R$ 内收敛
- 主要部分在 $|z-z_0|>r$ 内收敛
- 两者共同定义环域 $r<|z-z_0|<R$

> [!important] 洛朗级数是"环域上的泰勒级数"
> - 当 $r=0$ 且主要部分为 0 时，洛朗级数退化为泰勒级数
> - 同一个函数在不同环域内有不同的洛朗展开（因为环域不同）
> - 洛朗系数不能写成 $f^{(n)}(z_0)/n!$（$f$ 在 $z_0$ 可能不解析）

> [!example] 洛朗展开：两个环域
> 把 $f(z)=\dfrac{1}{z(z-1)}$ 在 $z_0=0$ 展开。
> **环域 $0<|z|<1$**：
> $$\frac{1}{z(z-1)}=-\frac1z\cdot\frac{1}{1-z}=-\frac1z\sum_{n=0}^\infty z^n=-\sum_{n=-1}^\infty z^n$$
> **环域 $|z|>1$**：
> $$\frac{1}{z(z-1)}=\frac{1}{z^2}\cdot\frac{1}{1-1/z}=\frac{1}{z^2}\sum_{n=0}^\infty z^{-n}=\sum_{n=2}^\infty z^{-n}$$
> 两个展开式不同，但都在各自的环域内成立。

# 4. 孤立奇点的分类

## 三类孤立奇点

> [!info] Def 6 可去奇点
> 若 $f$ 在 $z_0$ 的洛朗展开中**没有负幂项**（主要部分为 0），则称 $z_0$ 为**可去奇点**（removable singularity）。此时 $\lim_{z\to z_0}f(z)$ 存在且有限，补充定义后 $f$ 在 $z_0$ 解析。

> [!info] Def 7 极点
> 若洛朗展开的主要部分只有**有限项**，且最低负幂为 $(z-z_0)^{-m}$（$c_{-m}\ne0$），则称 $z_0$ 为 **$m$ 阶极点**（pole of order $m$）。此时 $\lim_{z\to z_0}f(z)=\infty$。

> [!info] Def 8 本性奇点
> 若洛朗展开的主要部分有**无穷多项**负幂，则称 $z_0$ 为**本性奇点**（essential singularity）。此时 $\lim_{z\to z_0}f(z)$ 不存在（且不趋于 $\infty$）。

## 判定表

| 类型 | 洛朗负幂部分 | 极限行为 | 例 |
| --- | --- | --- | --- |
| 可去奇点 | 无 | 有限 | $\dfrac{\sin z}{z}$ 在 $z=0$ |
| $m$ 阶极点 | 有限项，到 $-m$ | $\infty$ | $\dfrac{1}{z^m}$ 在 $z=0$ |
| 本性奇点 | 无穷项 | 不存在 | $e^{1/z}$ 在 $z=0$ |

> [!example] 三个典型例子
> - $\dfrac{\sin z}{z}=1-\dfrac{z^2}{3!}+\cdots$：无负幂，$z=0$ 是可去奇点。
> - $\dfrac{1}{z^3}$：负幂到 $-3$，$z=0$ 是 3 阶极点。
> - $e^{1/z}=1+\dfrac1z+\dfrac{1}{2!z^2}+\cdots$：无穷负幂，$z=0$ 是本性奇点。

## 极点的判定技巧

若 $f(z)=\dfrac{P(z)}{Q(z)}$，$P(z_0)\ne0$，$Q(z_0)=0$，则：

- 若 $Q$ 在 $z_0$ 有 $m$ 阶零点，则 $z_0$ 是 $f$ 的 **$m$ 阶极点**
- 若 $Q$ 在 $z_0$ 有 1 阶零点，则 $z_0$ 是**简单极点**

> [!example] 判断极点阶数
> $f(z)=\dfrac{z}{(z^2+1)^2}$。
> $z^2+1=(z-i)(z+i)$，在 $z=i$ 处 $(z^2+1)^2$ 有二阶零点，分子 $z\ne0$，故 $z=i$ 是**二阶极点**。同理 $z=-i$ 也是二阶极点。

## 无穷远点

若 $f$ 在 $|z|>R$ 内解析，令 $t=1/z$，研究 $t=0$ 处 $f(1/t)$ 的奇点类型，即可定义 $z=\infty$ 的类型。整函数在 $\infty$ 处：

- 多项式：$\infty$ 是极点（阶数 = 次数）
- $e^z$：$\infty$ 是本性奇点
- 常数：$\infty$ 是可去奇点

# 5. 例题

> [!example] 例 1：泰勒展开
> 把 $f(z)=\dfrac{1}{(z-1)(z-2)}$ 在 $z=0$ 展开。
> 部分分式：$\dfrac{1}{(z-1)(z-2)}=\dfrac{1}{z-2}-\dfrac{1}{z-1}$。
> $$\frac{1}{z-2}=-\frac12\cdot\frac{1}{1-z/2}=-\frac12\sum_{n=0}^\infty\left(\frac z2\right)^n,\qquad |z|<2$$
> $$\frac{1}{z-1}=-\frac{1}{1-z}=-\sum_{n=0}^\infty z^n,\qquad |z|<1$$
> 故在 $|z|<1$（最近奇点 $z=1$）：
> $$f(z)=\sum_{n=0}^\infty\left(1-\frac{1}{2^{n+1}}\right)z^n$$

> [!example] 例 2：洛朗展开
> 把 $f(z)=e^{1/z}$ 在 $0<|z|<\infty$ 展开。
> $$e^{1/z}=\sum_{n=0}^\infty\frac{1}{n!\,z^n}=1+\frac1z+\frac{1}{2!z^2}+\cdots$$
> 无穷负幂，故 $z=0$ 是**本性奇点**。

> [!example] 例 3：奇点分类
> $f(z)=\dfrac{z^2+1}{z(z-1)^3}$。
> - $z=0$：简单极点（分母一阶零点，分子非零）
> - $z=1$：三阶极点（分母三阶零点，分子 $2\ne0$）
> - $z=\infty$：分子次数 2、分母次数 4，故 $\infty$ 是二阶零点（不是极点）

> [!example] 例 4：可去奇点
> $f(z)=\dfrac{1-\cos z}{z^2}$。
> $$\cos z=1-\frac{z^2}{2!}+\frac{z^4}{4!}-\cdots$$
> $$f(z)=\frac{1}{2!}-\frac{z^2}{4!}+\cdots$$
> 无负幂，$z=0$ 是可去奇点；补充 $f(0)=1/2$ 后解析。

> [!example] 例 5：环域展开
> 把 $f(z)=\dfrac{1}{z^2-1}$ 在 $1<|z|<\infty$ 展开。
> $$\frac{1}{z^2-1}=\frac{1}{z^2}\cdot\frac{1}{1-1/z^2}=\sum_{n=1}^\infty z^{-2n}$$
> 只有负幂，收敛于 $|z|>1$。

> [!tip] 本章收官
> 第 4 章把解析函数展开成级数，揭示了它的局部结构：
> 1. **幂级数**（1）：收敛半径、阿贝尔定理；收敛圆内可逐项求导/积分。
> 2. **泰勒级数**（2）：解析 ⇔ 可展开；收敛半径 = 到最近奇点的距离。
> 3. **洛朗级数**（3）：环域展开，含负幂；负幂部分编码奇点信息。
> 4. **奇点分类**（4）：可去奇点（无负幂）、极点（有限负幂）、本性奇点（无穷负幂）。
>
> 一句话：**泰勒级数看"圆盘内"，洛朗级数看"环域内"；洛朗级数的负幂部分就是奇点的"身份证"。下一章用留数把洛朗级数的 $c_{-1}$ 提取出来，解决一大类实积分。**

# 本章知识地图

```
解析函数的级数表示
├─ 1. 复数项级数与幂级数
│     ├─ 收敛 ⇔ 实部/虚部都收敛
│     ├─ 绝对收敛
│     ├─ 幂级数：Σa_n(z−z₀)^n
│     ├─ 收敛半径 R=1/limsup|a_n|^(1/n)
│     └─ 阿贝尔定理：内闭一致收敛，可逐项求导/积分
│
├─ 2. 泰勒级数
│     ├─ f(z)=Σf⁽ⁿ⁾(z₀)/n!·(z−z₀)^n
│     ├─ 解析 ⇔ 可展开为幂级数
│     └─ R = 到最近奇点的距离
│
├─ 3. 洛朗级数
│     ├─ f(z)=Σ_{n=−∞}^∞c_n(z−z₀)^n
│     ├─ 环域 r<|z−z₀|<R
│     ├─ 解析部分 + 主要部分
│     └─ 不同环域有不同展开
│
├─ 4. 孤立奇点分类
│     ├─ 可去奇点：无负幂，极限有限
│     ├─ m 阶极点：有限负幂到 −m，极限 ∞
│     ├─ 本性奇点：无穷负幂，极限不存在
│     └─ 极点阶数：分母零点阶数 − 分子零点阶数
│
└─ 5. 例题
      ├─ 泰勒展开
      ├─ 洛朗展开
      └─ 奇点分类
```

# 关联

- 上一章：[[vault-notes/math/complex-analysis/03-complex-integration]]
- 下一章：[[vault-notes/math/complex-analysis/05-residues-applications]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 洛朗系数 $c_{-1}$ | [[vault-notes/math/complex-analysis/05-residues-applications]] 的留数定义 |
| 极点阶数 | [[vault-notes/math/complex-analysis/05-residues-applications]] 的留数计算公式 |
| 本性奇点 | 皮卡定理；留数计算需用洛朗展开 |
| 泰勒展开 | 解析函数的局部逼近；数值计算 |
| 收敛半径 | 幂级数求和；解析延拓 |

**本章留下的三个悬念（第 5 章结清）**：

| 本章的悬念 | 第 5 章的答案 |
| --- | --- |
| 洛朗级数的 $c_{-1}$ 为什么特别重要？ | 它就是留数；留数定理把围道积分化为 $c_{-1}$ 的和 |
| 极点阶数怎么快速算留数？ | $m$ 阶极点：$\operatorname{Res}=\frac{1}{(m-1)!}\lim[(z-z_0)^mf(z)]^{(m-1)}$ |
| 怎么用留数算实积分？ | 把实积分转化为复围道积分，用留数定理求值 |

**通信方向应用**：

- [[vault-notes/dsp/02-z-transform-and-dtft]] —— z 变换的洛朗级数展开就是序列本身；收敛环域对应 ROC。
- [[vault-notes/math/complex-analysis/08-laplace-transform]] —— 逆拉氏变换用洛朗级数/留数计算。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 复包络的级数展开、频率选择性信道的泰勒近似。
- [[vault-notes/math/complex-analysis/09-field-theory-basics]] —— 解析函数的洛朗展开与多极展开（电偶极子、多极子）同源。
- [[vault-notes/matlab/matlab-notes]] —— `taylor` 符号展开；`residue` 部分分式展开。

**相关**：[[vault-notes/math/complex-analysis/03-complex-integration]]｜[[vault-notes/math/complex-analysis/05-residues-applications]]｜[[vault-notes/dsp/02-z-transform-and-dtft]]｜[[vault-notes/math/complex-analysis/08-laplace-transform]]
