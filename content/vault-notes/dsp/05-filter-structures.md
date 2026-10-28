---
title: "数字滤波器的基本结构"
tags:
- 数学
- 数字信号处理
type: course
subjects:
- 数字信号处理
domains:
- 信号与系统
status: learning
aliases: []
prerequisites: []
related: []
---

> [!abstract] 本章在讲什么
> 第 2 章给了系统函数 $H(z)$，第 3、4 章给了频谱与快速算法；本章回答一个问题：**给定 $H(z)$，怎么把它变成一张能实现的运算图（结构）？**
> - **5.1 数字滤波器结构的表示方法**：用 $z^{-1}$（延迟）、乘法器、加法器三种积木画信号流图；同一 $H(z)$ 可以对应多种结构。
> - **5.2 IIR 滤波器的基本结构**：直接型 I、直接型 II（典范型）、级联型、并联型、转置型。重点是延迟数、系数敏感度与有限字长效应的差别。
> - **5.3 FIR 滤波器的基本结构**：直接型（横向滤波器）、级联型、频率采样型、**线性相位型**（利用对称性省一半乘法）。
> - **5.4 数字滤波器的格型结构**：用反射系数描述，数值稳健，是语音编码与自适应滤波的常用结构。
>
> 一句话主线：**结构 = 把 $H(z)$ 的代数表达式翻译成"延迟 + 乘 + 加"的运算顺序；同一个 $H(z)$ 有无穷多种实现，不同结构在延迟数、乘法数、系数敏感度和有限字长噪声上差别很大。**

> [!note] 记号约定
> - $z^{-1}$：单位延迟（delay），在时域表示 $y(n)=x(n-1)$
> - $H(z)=\dfrac{\sum_{r=0}^{M}b_rz^{-r}}{1+\sum_{k=1}^{N}a_kz^{-k}}$：IIR 系统函数；$b_r$ 零点系数，$a_k$ 极点系数
> - 直接型 I 的延迟数 $M+N$；直接型 II 的延迟数 $\max(M,N)$（**典范型**，canonical form）
> - 级联型：$H(z)=\prod_i H_i(z)$；并联型：$H(z)=\sum_i H_i(z)$
> - FIR：$H(z)=\sum_{m=0}^{M}h(m)z^{-m}$；阶数 $M$，长度 $M+1$
> - 线性相位：$h(n)=\pm h(M-n)$（偶对称/奇对称）
> - 格型：$k_i$ 为反射系数（reflection coefficient）

# 1. 数字滤波器结构的表示方法

## 三种基本积木

任何数字滤波器都可以由三种基本元件构成：

| 元件 | 符号 | 时域关系 | z 域关系 |
| --- | --- | --- | --- |
| **延迟** | $z^{-1}$ | $y(n)=x(n-1)$ | $Y(z)=z^{-1}X(z)$ |
| **乘法器** | 三角形/方框 $a$ | $y(n)=a\,x(n)$ | $Y(z)=aX(z)$ |
| **加法器** | 圆圈 $+$ | $y(n)=x_1(n)+x_2(n)$ | $Y(z)=X_1(z)+X_2(z)$ |

> [!info] Def 1 数字滤波器结构
> **数字滤波器结构**（digital filter structure）是用延迟、乘法器、加法器连接成的**信号流图**（signal flow graph），它规定了输入序列到输出序列的运算顺序。同一个系统函数 $H(z)$ 可以对应多种结构。

## 信号流图的两条规则

1. **节点**（node）代表一个变量；多条支路汇入一个节点时，该节点的值等于各支路贡献之和（除非另有标注）。
2. **支路**（branch）代表乘法或延迟；支路上的增益写在箭头旁。

> [!tip] 为什么要研究结构
> 同一个 $H(z)$，不同结构的**运算量、存储量、数值稳定性**不同：
> - 直接型简单，但高阶时系数对极点位置敏感，有限字长下容易不稳定；
> - 级联/并联型把高阶分解成多个二阶节，系数敏感度低，是工程首选；
> - 线性相位 FIR 利用对称性可省一半乘法；
> - 格型结构在系数量化时仍保持稳定，适合语音与自适应滤波。

# 2. IIR 滤波器的基本结构

## 直接型 I

> [!info] Def 2 直接型 I
> 直接把 $H(z)=\dfrac{\sum_{r=0}^{M}b_rz^{-r}}{1+\sum_{k=1}^{N}a_kz^{-k}}$ 的分子、分母分别实现：
> $$
> w(n)=\sum_{r=0}^{M}b_rx(n-r),\qquad y(n)=w(n)-\sum_{k=1}^{N}a_ky(n-k)
> $$
> 称为**直接型 I**（direct form I）。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 330" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <text x="40.0" y="60.0" text-anchor="start" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="normal">x(n)</text>
  <line x1="90.0" y1="55.0" x2="150.0" y2="55.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4" marker-end="url(#ar)"/>
  <rect x="150.0" y="38.0" width="60.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="180.0" y="59.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">b₀</text>
  <line x1="210.0" y1="55.0" x2="250.0" y2="55.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="250.0" y="38.0" width="55.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="277.5" y="59.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">z⁻¹</text>
  <line x1="305.0" y1="55.0" x2="345.0" y2="55.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="345.0" y="38.0" width="60.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="375.0" y="59.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">b₁</text>
  <line x1="405.0" y1="55.0" x2="445.0" y2="55.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="445.0" y="38.0" width="55.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="472.5" y="59.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">z⁻¹</text>
  <line x1="500.0" y1="55.0" x2="540.0" y2="55.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="540.0" y="38.0" width="60.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="570.0" y="59.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">b₂</text>
  <circle cx="650.0" cy="150.0" r="11.0" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="642.0" y1="150.0" x2="658.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.0"/>
  <line x1="650.0" y1="142.0" x2="650.0" y2="158.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.0"/>
  <line x1="600.0" y1="55.0" x2="630.0" y2="55.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="630.0" y1="55.0" x2="630.0" y2="139.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="630.0" y1="139.0" x2="639.0" y2="139.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <text x="40.0" y="250.0" text-anchor="start" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="normal">y(n)</text>
  <line x1="90.0" y1="245.0" x2="150.0" y2="245.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="150.0" y="228.0" width="60.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="180.0" y="249.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">−a₁</text>
  <line x1="210.0" y1="245.0" x2="250.0" y2="245.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="250.0" y="228.0" width="55.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="277.5" y="249.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">z⁻¹</text>
  <line x1="305.0" y1="245.0" x2="345.0" y2="245.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="345.0" y="228.0" width="60.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="375.0" y="249.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">−a₂</text>
  <line x1="405.0" y1="245.0" x2="445.0" y2="245.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="445.0" y="228.0" width="55.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="472.5" y="249.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">z⁻¹</text>
  <line x1="500.0" y1="245.0" x2="540.0" y2="245.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="540.0" y="228.0" width="60.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="570.0" y="249.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">−a₃</text>
  <line x1="600.0" y1="245.0" x2="630.0" y2="245.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="630.0" y1="245.0" x2="630.0" y2="161.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="630.0" y1="161.0" x2="639.0" y2="161.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="661.0" y1="150.0" x2="700.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4" marker-end="url(#ar)"/>
  <text x="380.0" y="300.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">直接型 I：先做零点（b 支路），再做极点（a 支路），需要 2N 个延迟</text>
</svg>

- **延迟数**：$M+N$（分子链 $M$ 个、分母链 $N$ 个）
- 优点：结构直观，零点和极点分开；缺点：延迟多、高阶时系数敏感

> [!example] 二阶 IIR 的直接型 I
> $$
> H(z)=\frac{b_0+b_1z^{-1}+b_2z^{-2}}{1+a_1z^{-1}+a_2z^{-2}}
> $$
> 时域差分方程：
> $$
> y(n)=b_0x(n)+b_1x(n-1)+b_2x(n-2)-a_1y(n-1)-a_2y(n-2)
> $$
> 直接型 I 需要 4 个延迟（$x$ 链 2 个、$y$ 链 2 个）。

## 直接型 II（典范型）

> [!info] Def 3 直接型 II
> 把 $H(z)$ 写成两个系统的级联：先实现极点部分 $1/(1+\sum a_kz^{-k})$，再实现零点部分 $\sum b_rz^{-r}$，中间变量共用一条延迟链，称为**直接型 II**（direct form II），也称**典范型**（canonical form）。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 300" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <text x="40.0" y="70.0" text-anchor="start" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="normal">x(n)</text>
  <line x1="90.0" y1="65.0" x2="170.0" y2="65.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4" marker-end="url(#ar)"/>
  <circle cx="185.0" cy="65.0" r="11.0" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="177.0" y1="65.0" x2="193.0" y2="65.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.0"/>
  <line x1="185.0" y1="57.0" x2="185.0" y2="73.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.0"/>
  <line x1="196.0" y1="65.0" x2="250.0" y2="65.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="250.0" y="48.0" width="60.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="280.0" y="69.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">z⁻¹</text>
  <line x1="310.0" y1="65.0" x2="370.0" y2="65.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="370.0" y="48.0" width="60.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="400.0" y="69.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">z⁻¹</text>
  <line x1="430.0" y1="65.0" x2="500.0" y2="65.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="280.0" y1="82.0" x2="280.0" y2="160.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <rect x="250.0" y="160.0" width="60.0" height="32.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="280.0" y="179.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">−a₁</text>
  <line x1="280.0" y1="192.0" x2="280.0" y2="210.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <line x1="280.0" y1="210.0" x2="185.0" y2="210.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <line x1="185.0" y1="210.0" x2="185.0" y2="76.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <line x1="400.0" y1="82.0" x2="400.0" y2="130.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <rect x="370.0" y="130.0" width="60.0" height="32.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="400.0" y="149.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">−a₂</text>
  <line x1="400.0" y1="162.0" x2="400.0" y2="210.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <line x1="400.0" y1="210.0" x2="185.0" y2="210.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <line x1="280.0" y1="48.0" x2="280.0" y2="20.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <rect x="250.0" y="8.0" width="60.0" height="32.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="280.0" y="27.9" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">b₁</text>
  <line x1="500.0" y1="65.0" x2="560.0" y2="65.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4" marker-end="url(#ar)"/>
  <text x="580.0" y="70.0" text-anchor="start" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="normal">y(n)</text>
  <text x="380.0" y="270.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">直接型 II：先极点后零点，延迟减半（N 个），但中间变量易溢出</text>
</svg>

- **延迟数**：$\max(M,N)$（比直接型 I 少一半）
- 中间变量 $w(n)$ 同时携带极点与零点信息
- 缺点：中间变量动态范围大，定点实现时容易溢出

> [!important] 直接型 I 与 II 的关系
> 两者是**转置**关系：把直接型 I 的箭头全部反向、加法器与分支点互换，就得到直接型 II 的转置型。它们的系统函数完全相同，但延迟数与数值特性不同。
> **工程口诀：延迟选 II，稳健选级联。**

## 级联型

> [!info] Def 4 级联型
> 把 $H(z)$ 的分子、分母分别因式分解，再两两配对成**二阶节**（second-order section，简称 SOS）：
> $$
> H(z)=\prod_{i=1}^{K}H_i(z),\qquad H_i(z)=\frac{b_{0i}+b_{1i}z^{-1}+b_{2i}z^{-2}}{1+a_{1i}z^{-1}+a_{2i}z^{-2}}
> $$
> 称为**级联型**（cascade form）。

- 每个二阶节用直接型 II 实现
- **系数敏感度低**：一个二阶节的系数只影响一对共轭极点
- **便于调参**：可以单独调整某一对极点/零点
- 定点实现时要做**缩放**（避免各级溢出）

> [!example] 级联分解
> $$
> H(z)=\frac{1+2z^{-1}+z^{-2}}{1-1.5z^{-1}+0.56z^{-2}}\cdot\frac{1-0.5z^{-1}}{1+0.3z^{-1}}
> $$
> 前一个二阶节实现一对共轭极点，后一个一阶节实现实极点；两个节串联。

## 并联型

> [!info] Def 5 并联型
> 把 $H(z)$ 做**部分分式展开**：
> $$
> H(z)=\sum_{i=1}^{K}H_i(z)
> $$
> 每个 $H_i(z)$ 是一阶或二阶节，各节**并联**（输出相加），称为**并联型**（parallel form）。

- 各节独立，**一个节的误差不会通过反馈传到另一个节**
- 适合**并行计算**（多核/FPGA）
- 极点必须成对分配，实极点用一阶节

> [!tip] 级联 vs 并联
> | 维度 | 级联型 | 并联型 |
> | --- | --- | --- |
> | 连接 | 串联（相乘） | 并联（相加） |
> | 零点控制 | 每节可独立控制一对零点 | 零点由各节共同决定，不易单独调 |
> | 极点控制 | 每节控制一对极点 | 每节控制一对极点 |
> | 误差传播 | 前级误差会被后级放大 | 各节独立，误差不串扰 |
> | 适用 | 通用 IIR | 并行实现、对误差敏感场合 |

## 转置型

把任意结构的信号流图**箭头反向、输入输出互换、加法器与分支点互换**，得到**转置型**（transposed form）。转置不改变系统函数，但会改变运算顺序与数值特性。

- 直接型 I 的转置 = 直接型 II 的变体（延迟数相同）
- 转置型常用于**流水线实现**（缩短关键路径）

# 3. FIR 滤波器的基本结构

## 直接型（横向滤波器）

> [!info] Def 6 FIR 直接型
> FIR 滤波器的差分方程
> $$
> y(n)=\sum_{m=0}^{M}h(m)x(n-m)
> $$
> 直接实现为一条**抽头延迟线**（tapped delay line）：输入依次经过 $M$ 个延迟，每个抽头乘 $h(m)$ 后相加，称为**横向滤波器**（transversal filter）。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 260" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <text x="40.0" y="80.0" text-anchor="start" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="normal">x(n)</text>
  <line x1="90.0" y1="75.0" x2="150.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4" marker-end="url(#ar)"/>
  <rect x="150.0" y="58.0" width="70.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="185.0" y="78.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">h(0)</text>
  <line x1="220.0" y1="75.0" x2="250.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="250.0" y="58.0" width="55.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="277.5" y="78.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">z⁻¹</text>
  <line x1="305.0" y1="75.0" x2="330.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="270.0" y="58.0" width="70.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="305.0" y="78.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">h(1)</text>
  <line x1="340.0" y1="75.0" x2="370.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="370.0" y="58.0" width="55.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="397.5" y="78.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">z⁻¹</text>
  <line x1="425.0" y1="75.0" x2="450.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="390.0" y="58.0" width="70.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="425.0" y="78.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">h(2)</text>
  <line x1="460.0" y1="75.0" x2="490.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="490.0" y="58.0" width="55.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="517.5" y="78.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">z⁻¹</text>
  <line x1="545.0" y1="75.0" x2="570.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="510.0" y="58.0" width="70.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="545.0" y="78.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">h(3)</text>
  <line x1="580.0" y1="75.0" x2="610.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="610.0" y="58.0" width="55.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="637.5" y="78.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">z⁻¹</text>
  <line x1="665.0" y1="75.0" x2="690.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="630.0" y="58.0" width="70.0" height="34.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="665.0" y="78.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">h(M)</text>
  <line x1="700.0" y1="75.0" x2="730.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <circle cx="700.0" cy="75.0" r="11.0" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="692.0" y1="75.0" x2="708.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.0"/>
  <line x1="700.0" y1="67.0" x2="700.0" y2="83.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.0"/>
  <line x1="680.0" y1="75.0" x2="689.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="711.0" y1="75.0" x2="750.0" y2="75.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4" marker-end="url(#ar)"/>
  <text x="750.0" y="60.0" text-anchor="end" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="normal">y(n)</text>
  <text x="380.0" y="180.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">FIR 直接型（横向滤波器）：只有前馈，没有反馈；M 阶需要 M 个延迟</text>
</svg>

- **延迟数**：$M$（阶数）
- **乘法数**：$M+1$
- 没有反馈，**天生稳定**；可以实现严格线性相位

## 级联型

把 $H(z)=\sum_{m=0}^{M}h(m)z^{-m}$ 因式分解为一阶/二阶节的乘积：

$$
H(z)=h(0)\prod_{i=1}^{K}\left(1-c_iz^{-1}\right)\prod_{j=1}^{L}\left(1-b_{1j}z^{-1}+b_{2j}z^{-2}\right)
$$

- 每个节用直接型实现
- 适合**零点需要单独调整**的场合
- 乘法数通常比直接型多，但数值特性更好

## 频率采样型

由第 3 章的频率采样定理，FIR 的 $H(z)$ 可以用 $N$ 个频率采样值 $H(k)$ 表示：

$$
H(z)=\left(1-z^{-N}\right)\frac{1}{N}\sum_{k=0}^{N-1}\frac{H(k)}{1-W_N^{-k}z^{-1}}
$$

- 结构由**梳状滤波器**（$1-z^{-N}$）与**并联谐振器**组成
- 优点：频率采样值 $H(k)$ 直接就是设计参数，适合**窄带/多带**滤波器
- 缺点：系数为复数、对有限字长敏感、稳定性需要额外处理

## 线性相位型

> [!info] Def 7 线性相位 FIR 结构
> 若 FIR 系数满足对称条件
> $$
> h(n)=h(M-n)\quad(\text{偶对称})\qquad\text{或}\qquad h(n)=-h(M-n)\quad(\text{奇对称})
> $$
> 则滤波器具有**严格线性相位**；实现时可以把对称的抽头**先相加再乘**，乘法次数减少近一半。

以偶对称为例：

$$
y(n)=\sum_{m=0}^{M}h(m)x(n-m)
$$

把 $h(m)=h(M-m)$ 的项合并：

$$
y(n)=h(0)\big[x(n)+x(n-M)\big]+h(1)\big[x(n-1)+x(n-M+1)\big]+\cdots
$$

- 乘法数从 $M+1$ 降到约 $(M+1)/2$
- 加法数增加，但乘法器在硬件中更贵
- 第 7 章会详细讨论四种线性相位 FIR（I/II/III/IV 型）

> [!tip] 为什么线性相位这么重要
> 线性相位意味着**群延迟为常数**：所有频率分量延迟相同，波形不失真。这对通信、音频、图像非常重要——IIR 很难做到严格线性相位，FIR 可以**精确做到**。

# 4. 数字滤波器的格型结构

## FIR 格型

> [!info] Def 8 格型结构
> **格型结构**（lattice structure）用一组**反射系数** $k_i$ 把滤波器表示成多级格型节：
> $$\begin{aligned}
> f_m(n)&=f_{m-1}(n)+k_m\,g_{m-1}(n-1)\\
> g_m(n)&=k_m\,f_{m-1}(n)+g_{m-1}(n-1)
> \end{aligned}$$
> 其中 $f_m$ 为前向误差，$g_m$ 为后向误差，$k_m$ 为反射系数。

- FIR 格型的**前向误差** $f_M(n)$ 就是滤波输出
- 反射系数 $k_m$ 与多项式系数一一对应（Levinson–Durbin 递推）
- **数值稳健**：$|k_m|<1$ 等价于系统稳定，系数量化时不易失稳

## IIR 格型

IIR 格型在 FIR 格型的基础上加反馈，实现全极点系统：

$$
H(z)=\frac{1}{A(z)},\qquad A(z)=1+\sum_{k=1}^{N}a_kz^{-k}
$$

- 反射系数 $k_m$ 由 $A(z)$ 通过 Levinson–Durbin 递推得到
- 全极点格型 + 零点支路 = 一般 IIR 格型
- 语音编码（LPC）、自适应滤波（LMS/RLS）常用格型

> [!example] 一阶格型
> 一阶 FIR 格型：
> $$
> f_1(n)=x(n)+k_1x(n-1),\qquad g_1(n)=k_1x(n)+x(n-1)
> $$
> 传递函数 $H(z)=1+k_1z^{-1}$，反射系数 $k_1$ 就是唯一的系数。
> 一阶 IIR 格型（全极点）：
> $$
> H(z)=\frac{1}{1+k_1z^{-1}}
> $$
> 稳定条件 $|k_1|<1$，比直接型的 $|a_1|<1$ 更容易检查。

## MATLAB

```matlab
% 直接型 I / II
b = [0.2 0.3 0.2]; a = [1 -1.5 0.56];
sos = tf2sos(b, a);              % 级联型（二阶节）
[b2, a2] = sos2tf(sos);          % 还原
% 格型
[k, v] = tf2latc(b, a);          % FIR/IIR 格型反射系数
[b3, a3] = latc2tf(k, v);        % 还原
% 滤波器对象（可直接看结构）
hd = dfilt.df2(b, a);            % 直接型 II
hd = dfilt.df1(b, a);            % 直接型 I
hd = dfilt.cascade(sos);         % 级联型
% 实际滤波
y = filter(b, a, x);
```

> [!warning] 有限字长下的结构选择
> 1. **高阶直接型不要用**：极点对系数非常敏感，16 位定点下高阶直接型可能直接不稳定。
> 2. **优先用级联型 SOS**：每节只负责一对极点，系数量化误差被局部化；MATLAB 的 `tf2sos` 就是为此。
> 3. **注意中间变量动态范围**：直接型 II 的 $w(n)$ 可能比输入/输出大很多，定点实现要预留裕量或改用直接型 I/级联。
> 4. **线性相位 FIR 用对称结构**：省一半乘法，且系数对称性在量化后仍保持（只要成对量化）。

> [!tip] 本章收官
> 本章把"系统函数"翻译成"运算图"：
> 1. **三种积木**（5.1）：延迟、乘法、加法，任何滤波器都由它们搭成；
> 2. **IIR 四种结构**（5.2）：直接 I（延迟多）、直接 II（典范、延迟少）、级联（稳健）、并联（并行）；
> 3. **FIR 四种结构**（5.3）：直接型（横向）、级联、频率采样、线性相位（省乘法）；
> 4. **格型**（5.4）：反射系数描述，数值稳健，适合语音与自适应。
>
> 一句话：**结构不改变 $H(z)$，但改变"怎么算"；工程上选结构，就是在延迟、乘法、数值稳健性之间做折中。下一章开始设计 IIR——给定指标，反求 $H(z)$ 的系数。**

# 本章知识地图

```
数字滤波器的基本结构
  ├─ 1. 表示方法
  │     ├── 三种积木：z⁻¹、乘法器、加法器
  │     ├── 信号流图：节点 + 支路
  │     └── 同一 H(z) ↔ 多种结构
  │
  ├─ 2. IIR 结构
  │     ├── 直接型 I：分子链 + 分母链，延迟 M+N
  │     ├── 直接型 II：典范型，延迟 max(M,N)
  │     ├── 级联型：H=ΠH_i，二阶节，系数敏感度低
  │     ├── 并联型：H=ΣH_i，部分分式，误差不串扰
  │     └── 转置型：箭头反向，流水线友好
  │
  ├─ 3. FIR 结构
  │     ├── 直接型：横向滤波器，M 个延迟、M+1 次乘
  │     ├── 级联型：因式分解为一/二阶节
  │     ├── 频率采样型：H(k) 直接作为设计参数
  │     └─ 线性相位型：h(n)=±h(M−n)，乘法减半
  │
  └─ 4. 格型结构
        ├── FIR 格型：f_m=f_{m−1}+k_m g_{m−1}(n−1)
        ├── IIR 格型：全极点 + 零点支路
        ├── 反射系数 k_m：|k_m|<1 ⇔ 稳定
        └── 应用：LPC、自适应滤波
```

# 关联

- 上一章：[[vault-notes/dsp/04-fast-fourier-transform]] —— FFT 负责"算得快"，本章负责"怎么实现"
- 下一章：[[vault-notes/dsp/06-iir-filter-design]] —— 给定指标，设计 IIR 的 $H(z)$
- 全书骨架：[[vault-notes/dsp/01-discrete-time-systems]] → [[vault-notes/dsp/02-z-transform-and-dtft]] → [[vault-notes/dsp/03-discrete-fourier-transform]] → [[vault-notes/dsp/04-fast-fourier-transform]] → **本章** → [[vault-notes/dsp/06-iir-filter-design]] → [[vault-notes/dsp/07-fir-filter-design]] → [[vault-notes/dsp/08-multirate-sampling]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 直接型/级联/并联 | [[vault-notes/dsp/06-iir-filter-design]] 的 $H(z)$ 实现 |
| 线性相位 FIR | [[vault-notes/dsp/07-fir-filter-design]] 的四种类型 |
| 频率采样型 | [[vault-notes/dsp/07-fir-filter-design]] 的频率采样设计 |
| 格型、反射系数 | 语音编码（LPC）、自适应滤波；[[vault-notes/dsp/08-multirate-sampling]] 的多相格型 |
| 有限字长/结构选择 | 定点 DSP/FPGA 实现；[[vault-notes/communication/06-digital-baseband]] 的均衡器实现 |

**本章留下的三个悬念（第 6 章结清）**：

| 本章的悬念 | 第 6 章的答案 |
| --- | --- |
| 结构有了，但 $H(z)$ 的系数从哪来？ | 从模拟原型（巴特沃斯/切比雪夫/椭圆）出发，用脉冲响应不变法或双线性变换映射到数字域 |
| 为什么 IIR 设计总要提"模拟滤波器"？ | 模拟滤波器有成熟的闭式设计公式；数字域通过 $s$ 平面到 $z$ 平面的映射继承这些公式 |
| 双线性变换为什么要"预畸变"？ | 因为 $s\to z$ 的频率映射是非线性的（$ \Omega=\frac{2}{T}\tan(\omega/2) $），不预畸变通带边沿会偏 |

**通信方向应用**：

- [[vault-notes/communication/06-digital-baseband]] —— 收发滤波器的成形/匹配滤波最终都要落成 FIR/IIR 结构；线性相位 FIR 保证波形不失真。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 5G 的基带滤波器、抽取/插值滤波器（第 8 章）都用多相 FIR 结构实现；OFDM 的频域均衡则用 FFT。
- FPGA —— 直接型 FIR 的抽头延迟线、级联型 IIR 的反馈链、格型结构都是 FPGA DSP Slice 的典型映射。
- [[vault-notes/matlab/matlab-notes]] —— `tf2sos`/`sos2tf`/`tf2latc`/`dfilt`/`filter` 是本章结构的直接工具。

**相关**：[[vault-notes/dsp/04-fast-fourier-transform]]｜[[vault-notes/dsp/06-iir-filter-design]]｜[[vault-notes/dsp/07-fir-filter-design]]｜[[vault-notes/matlab/matlab-notes]]
