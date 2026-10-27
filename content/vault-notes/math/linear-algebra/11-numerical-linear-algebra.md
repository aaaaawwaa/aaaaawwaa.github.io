---
title: "数值线性代数"
tags:
- 数学
- 线性代数
type: course
subjects:
- 线性代数
domains:
- 数学基础
status: learning
aliases: []
prerequisites: []
related: []
---

> [!abstract] 本章在讲什么
> 前面十章讲"理论上能算出什么"，这一章讲"**在计算机上真的能算出什么**"。三条主线：
>
> - **1. 高斯消元法的应用**：消元总能用，但**小主元会放大误差**（列主元补救）；代价是 $\frac23n^{3}$；**带状/稀疏结构**能把代价打下来；正交化也有快慢之别
> - **2. 范数与条件数**：$\operatorname{cond}(A)=\sigma_1/\sigma_n$ 衡量"问题有多敏感"——**它直接告诉你解会丢几位有效数字**
> - **3. 迭代法与预条件子**：$n$ 很大又稀疏时不做消元，而是反复迭代；**收敛速度由谱半径 $\rho(B)$ 控制**；共轭梯度法只依赖 $\sqrt{\operatorname{cond}}$，是稀疏对称正定系统的王牌
>
> 一句话主线：**数值线性代数 = 数学算法 + 误差分析 + 结构利用；同一道题，"怎么算"比"算什么"更决定成败。**

> [!note] 记号约定
> - $u\approx2.2\times10^{-16}$：双精度浮点的**单位舍入**（machine epsilon）
> - $P$：**置换矩阵**（列主元 = 让 $PA=LU$）；$\rho(B)$：**谱半径**（最大特征值模）
> - $\lVert\mathbf{x}\rVert_1,\lVert\mathbf{x}\rVert_2,\lVert\mathbf{x}\rVert_\infty$：向量范数；$\lVert A\rVert$：由向量范数诱导的矩阵范数
> - $\operatorname{cond}(A)=\lVert A\rVert\lVert A^{-1}\rVert$：**条件数**；$w$：**带宽**（bandwidth）
> - $M$：**预条件子**（preconditioner）；$B$：**迭代矩阵**

# 1. 高斯消元法的应用

消元在数学上是"永远管用"的（第 2 章）。在计算机上，它有三个现实问题：**稳定性、代价、结构**。

## 舍入误差和列主元

浮点数不能精确表示实数：$\operatorname{fl}(x)=x(1+\varepsilon)$，$\lvert\varepsilon\rvert\le u\approx2.2\times10^{-16}$。单步误差微不足道，**但会被算法放大**。

> [!warning] 小主元的灾难
> 取 $A=\begin{bmatrix}\varepsilon&1\\1&1\end{bmatrix}$、$\mathbf{b}=\begin{pmatrix}1\\2\end{pmatrix}$，其中 $\varepsilon=10^{-16}$。**不换行**的直接消元：
> $$\text{乘数 }l=\frac{a_{21}}{a_{11}}=\frac{1}{\varepsilon}=10^{16}\qquad\text{（巨大！）}$$
> 消元后第二行变成 $[\,1-l\varepsilon,\ 1-l\,]=[\,1-1,\ 1-10^{16}\,]$——**关键信息 $1-l\varepsilon$ 在相减中被吃光了**（灾难性相消）。实测结果：
> $$\text{不选主元}:\ \mathbf{x}\approx(2.22,\ 1)\qquad\text{正确解}:\ \mathbf{x}=(1,1)\ \checkmark$$
> $x_1$ 错了 122%，**完全不可用**。

> [!tip] 补救：先换行再消元
> **列主元**（partial pivoting）：每一步**先交换行，让该列绝对值最大的元素当主元**。于是所有乘数满足
> $$\lvert l_{ij}\rvert\le1$$
> ——**误差不会被放大**。上例换行后立刻得到精确解 $(1,1)$ ✓
> 这就是几乎所有线性求解器默认做的事（LAPACK 的 `dgesv`、MATLAB 的 `\`、NumPy 的 `solve`）。数学形式：**$PA=LU$**（$P$ 记录换行，第 2 章）。

> [!warning] 三条与消元有关的"工程铁律"（汇总第 2、4、5、7 章的警告）
> 1. **求解 ≠ 求逆**：解 $A\mathbf{x}=\mathbf{b}$ 要 $\frac23n^{3}$，显式求 $A^{-1}$ 约 $n^{3}$ 且误差更大；
> 2. **别用 $\det$ 判可逆/判秩**：$\det$ 的数值计算本身就不可靠（第 5 章），条件数才能说明"离奇异有多远"；
> 3. **最小二乘别用 $A^{T}A$**（$\operatorname{cond}$ 被平方，第 4 章）——用 QR 或 SVD（本章 1.5 与第 7 章）。

## 计算运算次数：稠密矩阵

> [!tip] 定理 消元的代价
> 解一个 $n\times n$ 稠密系统：
> | 步骤 | 浮点运算次数（flops） |
> | --- | --- |
> | LU 消元 | $\approx\dfrac{2n^{3}}{3}$ |
> | 前代 + 回代 | $\approx 2n^{2}$ |
> | **合计** | $\approx\dfrac{2n^{3}}{3}$（$n^{2}$ 项可忽略） |
> | 显式求逆 | $\approx n^{3}$（更贵、更不稳） |
> | Gram–Schmidt / QR（$m\times n$） | $2mn^{2}-\dfrac{2n^{3}}{3}$ |
> | Cramer 法则 | $n!$ 量级（第 5 章已嘲笑过） |

| $n$ | $\frac23n^{3}$ | 备注 |
| --- | --- | --- |
| 100 | $6.7\times10^{5}$ | 瞬间 |
| 1 000 | $6.7\times10^{8}$ | 约 0.1 秒 |
| 10 000 | $6.7\times10^{11}$ | 分钟级 |
| 100 000 | $6.7\times10^{14}$ | **不可行**——必须改用结构或迭代 |

**$n^{3}$ 是稠密消元的天花板**。突破它的两条路：**利用结构**（1.3、1.4）或**改用迭代**（第 3 节）。

## 带状矩阵

> [!info] Def 1 带状矩阵
> 若 $a_{ij}=0$（当 $\lvert i-j\rvert>w$）——即非零元素只出现在主对角线两侧各 $w$ 条内——称带宽为 $w$ 的**带状矩阵**（banded matrix）。

> [!tip] 定理 带状结构在消元中被保持，代价降到 $O(nw^{2})$
> 消元只会在带宽内产生新的非零元（**不会"跑到带外"**），于是
> $$\text{稠密 }O(n^{3})\quad\longrightarrow\quad \text{带状 }O(nw^{2})$$
> **三对角**（$w=1$）是最常出现的情形：代价 $O(n)$ ✓——用**追赶法**（Thomas algorithm，本质就是一次 LU）解，**线性代价**。

**实测**（三对角 $n\times n$，右端全 1）：

| $n$ | 追赶法（Thomas） | 稠密 `numpy.solve` | 加速 |
| --- | --- | --- | --- |
| 1 000 | 1.8 ms | 1 225 ms | **662 倍** |
| 20 000 | 81 ms | 73 064 ms | **897 倍** |

（这里 Thomas 还是纯 Python 实现，而稠密求解用了高度优化的 BLAS——**理论比值本应是 $n^{2}/12\sim 10^{5}$ 量级**，可见"利用结构"的收益有多暴力。）

**它出现在哪里**（第 10 章的库存）：一维弹簧/热传导/扩散的刚度矩阵、传输线与分布参数网络、样条插值、带状信道模型 ✓

## 稀疏矩阵的重新排列

> [!tip] 零元素不是"没用的零"——它们是要保住的位置
> 稀疏矩阵（sparse matrix）大部分元素为 0。**消元会在原来为零的位置上造出非零元**，这叫**填元**（fill-in）。填元一旦泛滥，$O(nw^{2})$ 的优势就没了。
> **对策：重排（reordering）**——用一个置换矩阵同时交换行列（$PAP^{T}$），让消元顺序更聪明：
> | 策略 | 目标 |
> | --- | --- |
> | **最小度**（minimum degree） | 每步先消"连着最少未消节点"的行 |
> | **嵌套剖分**（nested dissection） | 先消"两边"，把大问题切成小块（分治） |
> | **Cuthill–McKee** | 把带宽压到最小 |

**实测（星形图/箭头矩阵，$n=6$）**：原矩阵 16 个非零元

| 消元顺序 | LU 因子中的非零元 | 结论 |
| --- | --- | --- |
| 自然顺序（先消中心） | **35 个** | 严重填元（几乎翻倍） |
| 先消叶子、中心放最后 | **16 个** | **零填元** ✓ |

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 320" width="100%" style="max-width:840px" font-family="inherit">
  <!-- 左：自然顺序 -->
  <text x="210" y="40" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">自然顺序（中心先消）</text>
  <g transform="translate(110,60)">
    <rect x="-4" y="-4" width="208" height="208" rx="4" fill="none" stroke="var(--text-faint,#8b949e)" stroke-dasharray="5 4"/>
    <!-- 非零（原始）用深色；填元用橙色 -->
    <g fill="#4f46e5">
      <circle cx="0" cy="0" r="5"/><circle cx="25" cy="25" r="5"/><circle cx="50" cy="50" r="5"/><circle cx="75" cy="75" r="5"/><circle cx="100" cy="100" r="5"/><circle cx="125" cy="125" r="5"/>
      <circle cx="25" cy="0" r="5"/><circle cx="50" cy="0" r="5"/><circle cx="75" cy="0" r="5"/><circle cx="100" cy="0" r="5"/><circle cx="125" cy="0" r="5"/>
      <circle cx="0" cy="25" r="5"/><circle cx="0" cy="50" r="5"/><circle cx="0" cy="75" r="5"/><circle cx="0" cy="100" r="5"/><circle cx="0" cy="125" r="5"/>
    </g>
    <g fill="#d97706">
      <circle cx="25" cy="50" r="4"/><circle cx="25" cy="75" r="4"/><circle cx="25" cy="100" r="4"/><circle cx="25" cy="125" r="4"/>
      <circle cx="50" cy="25" r="4"/><circle cx="50" cy="75" r="4"/><circle cx="50" cy="100" r="4"/><circle cx="50" cy="125" r="4"/>
      <circle cx="75" cy="25" r="4"/><circle cx="75" cy="50" r="4"/><circle cx="75" cy="100" r="4"/><circle cx="75" cy="125" r="4"/>
      <circle cx="100" cy="25" r="4"/><circle cx="100" cy="50" r="4"/><circle cx="100" cy="75" r="4"/><circle cx="100" cy="125" r="4"/>
      <circle cx="125" cy="25" r="4"/><circle cx="125" cy="50" r="4"/><circle cx="125" cy="75" r="4"/><circle cx="125" cy="100" r="4"/>
    </g>
  </g>
  <g font-size="11" fill="var(--text-muted,#57606a)">
    <text x="146" y="292" fill="#4f46e5">● 原有非零（16 个）</text>
    <text x="286" y="292" fill="#d97706">● 填元（19 个）</text>
  </g>
  <text x="210" y="312" text-anchor="middle" font-size="11.5" font-weight="600" fill="#dc2626">LU 因子共 35 个非零 ⇒ 稀疏性被破坏</text>

  <!-- 右：叶子优先 -->
  <text x="620" y="40" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">叶子优先（中心放最后）</text>
  <g transform="translate(520,60)">
    <rect x="-4" y="-4" width="208" height="208" rx="4" fill="none" stroke="var(--text-faint,#8b949e)" stroke-dasharray="5 4"/>
    <g fill="#4f46e5">
      <circle cx="0" cy="0" r="5"/><circle cx="25" cy="25" r="5"/><circle cx="50" cy="50" r="5"/><circle cx="75" cy="75" r="5"/><circle cx="100" cy="100" r="5"/><circle cx="125" cy="125" r="5"/>
      <circle cx="25" cy="0" r="5"/><circle cx="50" cy="0" r="5"/><circle cx="75" cy="0" r="5"/><circle cx="100" cy="0" r="5"/><circle cx="125" cy="0" r="5"/>
      <circle cx="0" cy="25" r="5"/><circle cx="0" cy="50" r="5"/><circle cx="0" cy="75" r="5"/><circle cx="0" cy="100" r="5"/><circle cx="0" cy="125" r="5"/>
    </g>
  </g>
  <text x="620" y="312" text-anchor="middle" font-size="11.5" font-weight="600" fill="#059669">LU 因子仍是 16 个非零 ⇒ 零填元 ✓</text>
  <text x="420" y="180" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">同一个矩阵、同一道题</text>
  <text x="420" y="202" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">只是换了个消元顺序</text>
</svg>

## 快速正交化

第 4 章的 Gram–Schmidt 有三种实现，**数值表现差别很大**：

| 方法 | 做法 | 稳定性 | 代价 |
| --- | --- | --- | --- |
| 经典 Gram–Schmidt（CGS） | 先算全部系数，再一起减 | **差**（会丢正交性） | $2mn^{2}$ |
| **修正 Gram–Schmidt**（MGS） | 得到一个 $\mathbf{q}_i$ 就立刻减一次 | 好 | $2mn^{2}$ |
| **Householder 反射** | 用反射阵一次消掉一列 | **最好** | $2mn^{2}-\frac23n^{3}$ |
| **Givens 旋转** | 逐个消零 | 好 | 更贵，但**适合稀疏与并行** |

> [!tip] 为什么正交化这么重要：它决定了"条件数"
> QR 分解得到的 $Q$ 满足 $\lVert Q\rVert_2=1$、$\operatorname{cond}(Q)=1$——**正交变换不放大误差**（第 4、9 章）。所以
> $$\text{用 QR/SVD 做最小二乘}:\ \operatorname{cond}=\operatorname{cond}(A);\qquad
> \text{用 }A^{T}A:\ \operatorname{cond}=\operatorname{cond}(A)^{2}$$
> 这就是"别用 $A^{T}A$"的严格理由 ✓（也正是第 4 章那条警告的数值版）

# 2. 范数与条件数

要谈"误差有多大"和"问题有多敏感"，先要能量化"向量有多大"。

> [!info] Def 2 范数
> **向量范数**（常见三种）：
> $$\lVert\mathbf{x}\rVert_1=\sum\lvert x_i\rvert,\qquad \lVert\mathbf{x}\rVert_2=\Bigl(\sum\lvert x_i\rvert^{2}\Bigr)^{1/2},\qquad \lVert\mathbf{x}\rVert_\infty=\max_i\lvert x_i\rvert$$
> **矩阵范数**（由向量范数诱导，衡量"$A$ 能把向量放大多少"）：
> $$\lVert A\rVert=\max_{\mathbf{x}\ne\mathbf{0}}\frac{\lVert A\mathbf{x}\rVert}{\lVert\mathbf{x}\rVert}\qquad\Longrightarrow\qquad \lVert A\mathbf{x}\rVert\le\lVert A\rVert\lVert\mathbf{x}\rVert$$
> 关键一条：$\lVert A\rVert_2=\sigma_1$（最大奇异值）✓ ——**第 7 章的奇异值就是"最大放大倍数"**。

## 矩阵A的条件数

> [!info] Def 3 条件数
> $$\operatorname{cond}(A)=\lVert A\rVert\,\lVert A^{-1}\rVert
> \quad\Longrightarrow\quad
> \boxed{\ \operatorname{cond}_2(A)=\frac{\sigma_1}{\sigma_n}\ }$$
> （$\sigma_1,\sigma_n$ 是最大/最小奇异值，$A$ 可逆时；$\operatorname{cond}\ge1$，奇异/奇异矩阵 $\operatorname{cond}=\infty$）

> [!tip] 定理 条件数 = 相对误差的放大倍数
> 解 $A\mathbf{x}=\mathbf{b}$ 时，如果 $\mathbf{b}$（或 $A$）有相对误差 $\varepsilon$，则解的相对误差最多被放大 $\operatorname{cond}(A)$ 倍：
> $$\frac{\lVert\Delta\mathbf{x}\rVert}{\lVert\mathbf{x}\rVert}\ \le\ \operatorname{cond}(A)\cdot\frac{\lVert\Delta\mathbf{b}\rVert}{\lVert\mathbf{b}\rVert}$$
> **换算成"有效数字"**：若 $\operatorname{cond}(A)\approx10^{k}$，双精度（16 位）算出来的解只剩约 $16-k$ 位有效数字 ✓
> 几何解释（第 7 章）：**$\operatorname{cond}$ 就是"A 把单位球压成的椭球有多扁"**——最扁的比最长的。

**实测（希尔伯特矩阵 $H_{ij}=1/(i+j-1)$，第 8 章的老朋友）**：

| $n$ | $\operatorname{cond}(H_n)$ | 丢失的有效数字 | 实测解的误差（真解 $\mathbf{x}=\mathbf{1}$） |
| --- | --- | --- | --- |
| 5 | $4.8\times10^{5}$ | 5.7 位 | $2.8\times10^{-12}$ |
| 8 | $1.5\times10^{10}$ | 10.2 位 | $1.2\times10^{-7}$ |
| 10 | $1.6\times10^{13}$ | 13.2 位 | $1.7\times10^{-4}$ |
| 12 | $1.8\times10^{16}$ | **16.3 位** | **$7.0\times10^{-1}$ ← 解完全错了** |

$n=12$ 时条件数已经超过双精度的 16 位精度，**算出来的解毫无意义**——虽然矩阵严格来说并不奇异 ✓

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 300" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la11-ax" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>
  <line x1="130" y1="230" x2="640" y2="230" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la11-ax)"/>
  <line x1="130" y1="252" x2="130" y2="50" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la11-ax)"/>
  <text x="646" y="234" font-size="11" fill="var(--text-faint,#8b949e)">阶数 n</text>
  <text x="134" y="46" font-size="11" fill="var(--text-faint,#8b949e)">丢掉的有效数字（位）</text>

  <!-- 柱：log10(cond) -->
  <g fill="#4f46e5" fill-opacity="0.65">
    <rect x="200" y="173" width="56" height="57"/>
    <rect x="310" y="128" width="56" height="102"/>
    <rect x="420" y="98" width="56" height="132"/>
    <rect x="530" y="67" width="56" height="163"/>
  </g>
  <g font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)" text-anchor="middle">
    <text x="228" y="164">5.7</text><text x="338" y="119">10.2</text><text x="448" y="89">13.2</text><text x="558" y="58">16.3</text>
    <text x="228" y="250">n = 5</text><text x="338" y="250">n = 8</text><text x="448" y="250">n = 10</text><text x="558" y="250">n = 12</text>
  </g>
  <!-- 16 位精度线 -->
  <line x1="130" y1="72" x2="640" y2="72" stroke="#dc2626" stroke-width="1.6" stroke-dasharray="7 4"/>
  <text x="646" y="68" font-size="11.5" font-weight="600" fill="#dc2626">16 位</text>
  <text x="646" y="88" font-size="11" fill="#dc2626">（双精度极限）</text>

  <text x="560" y="140" font-size="12" font-weight="600" fill="#dc2626">n = 12 时越线 ⇒ 解完全不可信</text>
  <text x="560" y="164" font-size="11.5" fill="var(--text-muted,#57606a)">（实测误差 0.7，真解为 1）</text>
  <text x="560" y="196" font-size="11.5" fill="var(--text-muted,#57606a)">希尔伯特矩阵：cond ≈ 10^(1.5n)</text>
  <text x="560" y="216" font-size="11.5" fill="var(--text-muted,#57606a)">"幂基做高阶拟合"的病根（第 8 章）</text>

  <text x="380" y="282" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">条件数 ≈ 10^k ⇒ 双精度算出的解只剩 16 − k 位有效数字</text>
</svg>

> [!warning] 关于条件数的四个常见误解
> 1. **病态 ≠ 奇异**：病态矩阵严格可逆，只是"接近奇异"——而"接近"的程度恰好由 $\operatorname{cond}$ 量化；
> 2. **$\operatorname{cond}$ 依赖范数/基**：换一组范数（或换一组基，第 8 章）值会变，但量级通常一致；
> 3. **$\operatorname{cond}(A^{T}A)=\operatorname{cond}(A)^{2}$** ✓（第 4 章）——**这是"别组 $A^{T}A$"的定量理由**；
> 4. **正交/酉矩阵 $\operatorname{cond}=1$**（第 4、9 章）：所以"用正交变换做算法"几乎总能改善稳定性（Householder、QR、SVD 全是这个思路）✓

# 3. 迭代法与预条件子

$n$ 上百万、矩阵又稀疏时，**消元的填元会把稀疏性毁掉**（1.4）——于是换一条路：**不做分解，反复迭代逼近解**。

## 谱半径ρ(B)控制收敛速度

把 $A$ 拆成 $A=M-N$（$M$ 容易求逆），则 $A\mathbf{x}=\mathbf{b}$ 等价于不动点迭代：

$$
M\mathbf{x}_{k+1}=N\mathbf{x}_k+\mathbf{b}\qquad\Longrightarrow\qquad
\mathbf{x}_{k+1}=\underbrace{M^{-1}N}_{\text{迭代矩阵 }B}\mathbf{x}_k+M^{-1}\mathbf{b}
$$

> [!tip] 定理 收敛 ⟺ 谱半径小于 1
> $$\text{迭代收敛（对任意初值）}\quad\Longleftrightarrow\quad \rho(B)=\max_i\lvert\lambda_i(B)\rvert<1$$
> 而且误差按 $\rho(B)$ 的速率衰减：
> $$\lVert\mathbf{x}_k-\mathbf{x}\rVert\ \le\ \rho(B)^{k}\,\lVert\mathbf{x}_0-\mathbf{x}\rVert$$
> **一句话**：**$\rho(B)$ 是"每次迭代把误差缩小多少倍"**——第 6 章的谱半径在这里成了迭代法的"速度表"✓
> **实用判据**：$A$ **严格对角占优**（$\lvert a_{ii}\rvert>\sum_{j\ne i}\lvert a_{ij}\rvert$）⇒ Jacobi 与 Gauss–Seidel 都收敛 ✓（第 10 章的刚度矩阵就对角占优）

## 雅可比迭代法对比高斯-赛德尔迭代法

**Jacobi**：只用**上一轮**的值
$$x_i^{(k+1)}=\frac{1}{a_{ii}}\Bigl(b_i-\sum_{j\ne i}a_{ij}x_j^{(k)}\Bigr),\qquad B_J=D^{-1}(L+U)$$

**Gauss–Seidel**：**用上已经更新的分量**（通常收敛更快，且只要存一份解向量）
$$x_i^{(k+1)}=\frac{1}{a_{ii}}\Bigl(b_i-\sum_{j<i}a_{ij}x_j^{(k+1)}-\sum_{j>i}a_{ij}x_j^{(k)}\Bigr),\qquad B_{GS}=(D-L)^{-1}U$$

> [!tip] 三对角矩阵的漂亮结果（已实测验证）
> 对 $K=\operatorname{tridiag}(2,-1)$（第 10 章的一维拉普拉斯）：
> $$\rho(B_J)=\cos\frac{\pi}{n+1},\qquad \boxed{\ \rho(B_{GS})=\rho(B_J)^{2}\ }$$
> **$n=8$ 实测**：$\rho(B_J)=0.9397=\cos(\pi/9)$ ✓，$\rho(B_{GS})=0.8830=\rho(B_J)^{2}$ ✓
> 于是**Gauss–Seidel 的误差每步缩小得更多**（$\rho$ 更小），但要真正"快一个数量级"还得靠下一小节的共轭梯度。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 300" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la11-cx" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <line x1="118" y1="98" x2="500" y2="98" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la11-cx)"/>
  <line x1="130" y1="118" x2="130" y2="50" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la11-cx)"/>
  <text x="506" y="102" font-size="11" fill="var(--text-faint,#8b949e)">迭代步数</text>
  <text x="134" y="46" font-size="11" fill="var(--text-faint,#8b949e)">相对误差</text>

  <!-- 网格线 -->
  <g stroke="var(--text-faint,#8b949e)" stroke-width="0.7" stroke-dasharray="4 4" opacity="0.6">
    <line x1="130" y1="56" x2="490" y2="56"/><line x1="130" y1="77" x2="490" y2="77"/>
  </g>
  <g font-size="10.5" fill="var(--text-faint,#8b949e)" text-anchor="end">
    <text x="126" y="60">10⁰</text><text x="126" y="81">10⁻³</text><text x="126" y="102">10⁻⁶</text>
  </g>
  <g font-size="10.5" fill="var(--text-faint,#8b949e)" text-anchor="middle">
    <text x="130" y="114">0</text><text x="250" y="114">20</text><text x="370" y="114">40</text><text x="490" y="114">60</text>
  </g>

  <!-- 曲线 -->
  <path d="M130,56 154,57 178,58 202,58 226,59 250,60 274,61 298,61 322,62 346,63 370,64 394,65 418,65 442,66 466,67" fill="none" stroke="#4f46e5" stroke-width="2.2"/>
  <path d="M130,56 154,58 178,59 202,61 226,62 250,64 274,65 298,67 322,68 346,70 370,71 394,73 418,74 442,76 466,77" fill="none" stroke="#d97706" stroke-width="2.2"/>
  <path d="M130,58 154,98 178,98 202,98 226,98 250,98 274,98 298,98 322,98 346,98 370,98 394,98 418,98 442,98 466,98" fill="none" stroke="#059669" stroke-width="2.6"/>

  <text x="470" y="62" font-size="12" font-weight="600" fill="#4f46e5">Jacobi</text>
  <text x="470" y="82" font-size="12" font-weight="600" fill="#d97706">Gauss–Seidel</text>
  <text x="470" y="104" font-size="12" font-weight="600" fill="#059669">共轭梯度（CG）</text>

  <text x="560" y="140" font-size="12" fill="var(--text-normal,#1f2328)">n = 8 三对角系统（cond = 32.2）</text>
  <text x="560" y="166" font-size="11.5" fill="var(--text-muted,#57606a)">60 步后：Jacobi 误差 2.5×10⁻²</text>
  <text x="560" y="186" font-size="11.5" fill="var(--text-muted,#57606a)">Gauss–Seidel 6×10⁻⁴</text>
  <text x="560" y="206" font-size="11.5" font-weight="600" fill="#059669">CG 只要 4 步就到 10⁻⁷ 以下</text>
  <text x="560" y="232" font-size="11.5" fill="var(--text-muted,#57606a)">ρ(B_GS) = ρ(B_J)²（三对角的定理）</text>
  <text x="560" y="256" font-size="11.5" fill="#4f46e5">CG 的收敛速度取决于 √cond，不是 cond</text>

  <text x="420" y="288" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">同一个方程组：Jacobi/Gauss–Seidel 爬行，共轭梯度几步到机器精度</text>
</svg>

## 多重网格法和共轭梯度法

> [!tip] 共轭梯度法：对称正定系统的王牌
> **共轭梯度法**（conjugate gradient，简称 CG）：对 $A$ **对称正定**，它沿一组 **$A$-共轭方向**（互相 $A$-正交）搜索，第 $k$ 步在前 $k$ 维 Krylov 子空间里给出最优解：
> - **理论保证**：$n$ 步以内精确收敛；
> - **实际速度**：由 $\sqrt{\operatorname{cond}(A)}$ 控制 ——**注意是平方根**：
>   $$\text{迭代次数}\sim\frac{1}{2}\sqrt{\operatorname{cond}(A)}\qquad\text{（Gauss–Seidel 则是 }\sim\operatorname{cond}(A)\text{ 量级）}$$
> - 只需要"矩阵乘向量"（不修改矩阵、无填元）⇒ **天然适合稀疏大规模问题** ✓

**实测对比**（$n=8$ 三对角，$\operatorname{cond}=32.2$，$\sqrt{\operatorname{cond}}=5.7$）：CG **4 步**就把误差压到 $10^{-7}$ 以下，10 步达到机器精度 $\approx10^{-16}$；而 Gauss–Seidel 走 60 步才到 $6\times10^{-4}$ ✓ ——**差别在两个数量级以上**。

> [!tip] 多重网格：在多个尺度上"扫"
> **多重网格**（multigrid）的思路：迭代法有个规律：**能快速消掉"高频"（抖动）误差，却对"低频"（光滑）误差无能为力**。做法是**把低频误差放到粗网格上**（在粗网格上它就成了高频），于是各尺度轮流处理：
> - 复杂度 $O(n)$（**最优**），对泊松方程型问题几乎无敌；
> - 思想属于"分而治之"，和 FFT（第 9 章）是同一族智慧。

> [!tip] 预条件子：把条件数"调小"
> **预条件子**（preconditioner）：找一个**容易求逆**的 $M\approx A$，改为解
> $$M^{-1}A\mathbf{x}=M^{-1}\mathbf{b}$$
> 只要 $\operatorname{cond}(M^{-1}A)\ll\operatorname{cond}(A)$，迭代次数就大幅下降 ✓
> 常用：对角（Jacobi）预条件、不完全 Cholesky（IC）、SSOR、多重网格本身 ✓
> **一句话**：**预条件 = 换一组基让条件数变小**（第 8 章"换基就是换条件数"的算法版）✓

## 求特征值的迭代法

特征值也不是"算 $\det(A-\lambda I)=0$"求出来的（第 6 章警告过），而是**迭代**出来的：

| 方法 | 用途 | 收敛速度 |
| --- | --- | --- |
| **幂法**（power method） | 只求**最大**特征值/特征向量 | $\lvert\lambda_2/\lambda_1\rvert^{k}$ |
| **反幂法**（inverse iteration） | 求**最小**或**最靠近某值**的特征值 | 用 $(A-\sigma I)^{-1}$（需解线性系统） |
| **QR 算法**（QR algorithm） | 求**全部**特征值（现代主力） | 带位移后极快（约 $O(n)$ 步） |
| **Lanczos / Arnoldi** | 大型稀疏矩阵的**部分**特征值 | 几十步即可 |

**幂法实测**（$A=\begin{bmatrix}1.75&1.25\\1.25&1.75\end{bmatrix}$，$\lambda=3,\ 0.5$，$\lvert\lambda_2/\lambda_1\rvert=1/6$）：

| 迭代次数 | $\lambda_1$ 的估计 | 误差 |
| --- | --- | --- |
| 1 | 2.9324 | $6.8\times10^{-2}$ |
| 3 | 2.99995 | $5.4\times10^{-5}$ |
| 8 | 3.0000000000 | $8.9\times10^{-13}$ |
| 12 | 3.0000000000 | $9\times10^{-16}$ |

——每步误差缩小约 6 倍（$=\lvert\lambda_2/\lambda_1\rvert$ 的倒数）✓

> [!tip] QR 算法的思想（顺带解释第 8 章的 Schur 分解）
> 反复做 $A_k=Q_kR_k$、$A_{k+1}=R_kQ_k$（**每步都是一次 QR 分解**）。因为 $A_{k+1}=Q_k^{T}A_kQ_k$ 是**正交相似**（第 8 章），特征值始终不变；而 $A_k$ 会逐渐收敛到**上三角/准三角**——对角线就露出特征值 ✓
> **所以：数学上用若尔当形（第 8 章），计算上用 QR 算法算出的三角形式（Schur 形式）。**

> [!note] 通信方向：这些算法就在你的基带芯片里
> - **大规模 MIMO 检测**：$n$ 可达几百上千，**显式求矩阵逆 $O(n^{3})$ 不可行**——工程上用 **CG / Gauss–Seidel / Neumann 级数**做"近似逆"，把检测降到 $O(n^{2})$ 甚至 $O(n)$ ✓（[[vault-notes/5g/phy/04-physical-channels-signals]]）
> - **QR 分解做检测/均衡**：QR 化信道矩阵后回代求解，避免 $\operatorname{cond}^{2}$（1.5）✓
> - **信道条件数**：$\sigma_1/\sigma_n$ 直接刻画"空间相关有多严重"，决定是否需要预编码、能不能开复用层 ✓
> - **LDPC / 稀疏校验矩阵**：译码就是在稀疏矩阵上做迭代（置信传播 ≈ 迭代法）——**稀疏性 + 迭代**是同一个思想 ✓（[[vault-notes/communication/11-error-control-coding]]）
> - **自适应滤波（RLS）与信道跟踪**：用 QR 更新协方差矩阵的 Cholesky 因子（数值稳定的做法）✓
> - **FFT**：周期结构下的"快速求解器"（第 9、10 章）——它把 $O(n^{3})$ 的求解变成 $O(n\log n)$ ✓

> [!tip] 本章收官
> 三条线，一句话各一条：
> 1. **消元的现实**：要**列主元**（避免小主元放大误差）、代价 $\frac23n^{3}$、**带状/稀疏结构能救命**（重排减少填元）、正交化要用 Householder/MGS；
> 2. **条件数**：$\operatorname{cond}(A)=\sigma_1/\sigma_n$ = 相对误差放大倍数 = **丢掉的十进制位数**；希尔伯特矩阵 $n=12$ 时已超过双精度极限；
> 3. **迭代与预条件**：**$\rho(B)<1$ 才收敛**，$\rho$ 决定速度；共轭梯度靠 $\sqrt{\operatorname{cond}}$ 取胜，多重网格做到 $O(n)$，预条件子就是"换基降条件数"。
> 一句话：**数学给你"存在解"，数值线性代数负责让你"真的算得出来"——而它的全部技巧，都建立在"误差会怎么放大"这一个问题上。**

## 本章知识地图

```
数值线性代数：让"能算"变成"算得准、算得快"
  ├─ 1. 高斯消元法的应用
  │      ├── 舍入误差与列主元：小主元 ⇒ 乘数 1/ε 巨大 ⇒ 灾难性相消
  │      │      └── 补救：列主元 |l| ≤ 1；PA = LU（几乎所有求解器的默认）
  │      ├── 运算次数：稠密消元 ≈ 2n³/3；求逆 ≈ n³（更贵更差）；Cramer n!（不可用）
  │      │      └── n = 10^5 时稠密不可行 ⇒ 必须用结构或迭代
  │      ├── 带状矩阵：带宽 w ⇒ 代价 O(nw²)；三对角 O(n)（追赶法）
  │      │      └── 实测：n=20000 时 Thomas 比稠密快约 900 倍
  │      ├── 稀疏重排：消元产生**填元**；最小度/嵌套剖分/Cuthill–McKee
  │      │      └── 实测（星形图）：自然顺序 35 个非零 vs 重排后 16 个（零填元）
  │      └── 快速正交化：CGS（差）/ MGS（好）/ Householder（最好）/ Givens（稀疏并行）
  │             └── 正交变换 cond = 1 ⇒ 用 QR/SVD 而非 AᵀA
  │
  ├─ 2. 范数与条件数
  │      ├── 向量范数 ‖x‖₁, ‖x‖₂, ‖x‖∞；矩阵范数 ‖A‖₂ = σ₁
  │      ├── cond(A) = ‖A‖‖A⁻¹‖ = σ₁/σ_n ≥ 1；正交/酉 ⇒ 1
  │      ├── 意义：相对误差放大倍数 ⇒ 丢 16 − log10(cond) 位有效数字
  │      ├── 希尔伯特矩阵实测：n=5→4.8e5、n=8→1.5e10、n=10→1.6e13、n=12→1.8e16（解已错）
  │      └── cond(AᵀA) = cond(A)²（第 4 章警告的定量版本）
  │
  └─ 3. 迭代法与预条件子
         ├── 迭代格式 x_(k+1) = Bx_k + c；收敛 ⟺ ρ(B) < 1（第 6 章谱半径）
         ├── Jacobi（用上一轮）vs Gauss–Seidel（用最新值）
         │      └── 三对角：ρ(B_J) = cos(π/(n+1))，ρ(B_GS) = ρ(B_J)²
         ├── 共轭梯度（CG，对称正定）：收敛速度 ~ √cond；实测 4 步到 1e-7
         ├── 多重网格：多尺度消除误差，O(n)；预条件子：换基降 cond
         └── 求特征值的迭代：幂法（|λ₂/λ₁|）、反幂法、QR 算法（Schur）、Lanczos
                └── 幂法实测：|λ₂/λ₁| = 1/6 ⇒ 12 步到 1e-16
```

## 关联

- 上一章：[[vault-notes/math/linear-algebra/10-applications]]
- 下一章：[[vault-notes/math/linear-algebra/12-linear-algebra-in-probability-statistics]]

**本章与前面章节的接口**（本章是对前九章"数值可行性"的总审计）：

| 前面的算法/概念 | 数值上的真相 |
| --- | --- |
| 第 2 章：高斯消元 | 必须**列主元**，否则小主元放大误差；代价 $\frac23n^{3}$ |
| 第 2、5 章：$A^{-1}$、Cramer、$\det$ | 数值上全都不可用（求逆更贵、Cramer 是 $n!$、$\det$ 不可靠） |
| 第 3 章：稀疏结构（矩阵的零） | **填元**会破坏稀疏性 ⇒ 重排是必需的工程步骤 |
| 第 4 章：Gram–Schmidt、$A^{T}A$ | 用 MGS/Householder；$A^{T}A$ 让 $\operatorname{cond}$ 平方 ⇒ 改走 QR/SVD |
| 第 5 章：$\det$ 判秩 | 数值秩用**奇异值 > 容差**（第 7 章） |
| 第 6 章：谱半径、特征值 | **$\rho(B)<1$ 就是迭代法的收敛条件**；幂法的速度 = $\lvert\lambda_2/\lambda_1\rvert$ |
| 第 7 章：SVD、$\sigma_1$、$\sigma_n$ | $\operatorname{cond}=\sigma_1/\sigma_n$；$\lVert A\rVert_2=\sigma_1$；伪逆是最稳的最小二乘 |
| 第 8 章：若尔当形 vs Schur；换基 | **数学用若尔当形，计算用 Schur（QR 算法）**；预条件子 = 换基降条件数 |
| 第 9 章：FFT、酉矩阵 | FFT 是 $O(n\log n)$ 的快速求解器；酉变换 $\operatorname{cond}=1$ |
| 第 10 章：带状/稀疏结构（刚度矩阵、图） | 三对角 $O(n)$、图矩阵的填元与重排——**结构就是算力** |

**通信方向应用**：

- [[vault-notes/5g/phy/04-physical-channels-signals]] —— **大规模 MIMO 是所有数值线性代数难题的集合地**：天线数几百上千 ⇒ 显式求逆 $O(n^{3})$ 不可行，工程上用 **Neumann 级数 / Gauss–Seidel / 共轭梯度**做近似矩阵求逆（把 $\mathrm{MMSE}$ 检测降到 $O(n^{2})$）；**QR 分解**做检测与均衡以规避 $\operatorname{cond}^{2}$；**信道矩阵的条件数**直接反映空间相关性，决定能否开空间复用、是否需要预编码；OFDM 的频域均衡用 **FFT**（$O(n\log n)$）替代逐子载波求解；稀疏信道估计用**稀疏矩阵 + 迭代**的套路。
- [[vault-notes/communication/11-error-control-coding]] —— **LDPC 码的译码就是在稀疏校验矩阵上做迭代**（置信传播可看作迭代法），"稀疏 + 迭代"与本章第 3 节完全同源；编码的复杂度分析（生成矩阵的带状/稀疏结构）也是本章 1.3、1.4 的应用；而 **QR/LU 分解**是编码器与序列检测里最常用的底层工具。
- [[vault-notes/communication/09-optimal-reception]] —— 最优接收机的实现是一个大型线性系统：相关器组要解 $R\mathbf{a}=\mathbf{p}$（$R$ 是相关矩阵），**$R$ 的条件数决定接收机能否用单精度/定点实现**；自适应均衡（LMS/RLS）的收敛速度由相关矩阵的特征值扩散（$\operatorname{cond}$）决定——**这正是本章 2 节与第 6.5 节的交汇点**。
- [[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]] —— 本章第 3 节的每一个结论都是第 6 章的直接应用：$\rho(B)<1$ 判收敛、幂法的收敛速度、反幂法依赖解线性系统、QR 算法把特征值迭代出来。
- [[vault-notes/math/linear-algebra/07-singular-value-decomposition]] —— SVD 是数值上最可靠的分解：条件数、数值秩、伪逆、最小二乘的正解全靠它；但代价最高，所以工程上"能 QR 就 QR，需要判秩/近奇异时再上 SVD"。
- [[vault-notes/math/linear-algebra/10-applications]] —— 第 10 章的那些矩阵（三对角刚度矩阵、图的拉普拉斯、稀疏网络矩阵）**正是本章"结构利用"的主角**：带状、对称、正定、稀疏——**每一个字都是省算力的理由**。

**相关**：[[vault-notes/math/linear-algebra/10-applications]]｜[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]｜[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]]
