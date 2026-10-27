---
title: "正交性"
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
> 第 3 章把"解的结构"描述清楚了，但留了一个悬案：**"正交"这件事到底怎么算、有什么用？** 第 4 章给出答案，也把线性代数从"描述"推进到"**逼近**"。
>
> - **4.1** 四个子空间的正交性：行空间 ⊥ 零空间、列空间 ⊥ 左零空间——两组"正交补"把 $\mathbb{R}^n$ 和 $\mathbb{R}^m$ 各劈成两半（线性代数基本定理的第二部分）
> - **4.2** 投影：把 $\mathbf{b}$ 垂直地"拍"到子空间上，落点就是**最近的逼近点**；投影矩阵 $P$ 是这套动作的代数封装
> - **4.3** 最小二乘估计：$A\mathbf{x}=\mathbf{b}$ 无解时，用"投影 + 解方程"两步求最佳近似；直线拟合、抛物线拟合是它的工程脸
> - **4.4** 标准正交基与格拉姆-施密特：把一组普通基"扳直"成正交基，投影公式里的 $(A^TA)^{-1}$ 随之退化成 $Q^T$
>
> 一句话主线：**"垂直"不是几何课的花边，而是"最佳近似"的判据——投影是它算出来的结果。**

> [!note] 记号约定
> - 沿用第 3 章：$\mathbf{C}(A)$ 列空间、$\mathbf{N}(A)$ 零空间、$\mathbf{C}(A^T)$ 行空间、$\mathbf{N}(A^T)$ 左零空间；$r=\operatorname{rank}(A)$，$A$ 是 $m\times n$
> - $V^{\perp}$：子空间 $V$ 的**正交补**（所有与 $V$ 垂直的向量）
> - $P$：**投影矩阵**（projection matrix）；$\mathbf{p}=P\mathbf{b}$ 是投影，$\mathbf{e}=\mathbf{b}-\mathbf{p}$ 是**误差**向量（residual，也叫残差）
> - $\hat{\mathbf{x}}$：**最小二乘解**；$\mathbf{p}=A\hat{\mathbf{x}}$ 是它给出的逼近
> - $Q$：**列标准正交**的矩阵；$R$：上三角矩阵（4.4 的 $A=QR$）

# 4.1 四个子空间的正交性

## 正交补

正交在代数上只有一句话：**点积为零**。

> [!info] Def 1 正交向量
> 若 $\mathbf{v}\cdot\mathbf{w}=0$，称 $\mathbf{v}$ 与 $\mathbf{w}$ **正交**（orthogonal），记 $\mathbf{v}\perp\mathbf{w}$。
> 两条附赠事实：
> - $\mathbf{v}\cdot\mathbf{v}=\|\mathbf{v}\|^2$，所以只有零向量与自己正交；
> - **零向量与任何向量都正交**（点积恒为 0）——记住这一条，它能一眼排除很多错误选项。

> [!tip] 勾股定理的代数版
> $$\mathbf{v}\perp\mathbf{w}\quad\Longleftrightarrow\quad\|\mathbf{v}+\mathbf{w}\|^2=\|\mathbf{v}\|^2+\|\mathbf{w}\|^2$$
> 展开 $\|\mathbf{v}+\mathbf{w}\|^2=\mathbf{v}\cdot\mathbf{v}+2\mathbf{v}\cdot\mathbf{w}+\mathbf{w}\cdot\mathbf{w}$，中间的交叉项消失即得。
> 这个"交叉项为零"的形式会在 4.3 最小二乘的误差分解里原样重现：$\|\mathbf{b}\|^2=\|\mathbf{p}\|^2+\|\mathbf{e}\|^2$。

> [!info] Def 2 正交子空间
> 子空间 $V$ 与 $W$ **正交**，当且仅当 $V$ 中**每一个**向量都与 $W$ 中**每一个**向量正交。
> 注意：这是"全体对全体"的条件，不是"有某两个向量垂直"。

> [!info] Def 3 正交补
> 子空间 $V$ 的**正交补**（orthogonal complement）$V^{\perp}$ 是 $\mathbb{R}^n$ 中所有与 $V$ 中每个向量都正交的向量组成的集合。
> - $V^{\perp}$ 本身是子空间：若 $\mathbf{x},\mathbf{y}\perp V$，则 $c\mathbf{x}+d\mathbf{y}$ 与 $V$ 中任何向量都正交；
> - $(V^{\perp})^{\perp}=V$（补两次回到原地）；
> - 两条互相正交的子空间满足 $V\cap W=\{\mathbf{0}\}$：因为 $\mathbf{x}$ 同时在两边时 $\mathbf{x}\perp\mathbf{x}$，即 $\|\mathbf{x}\|^2=0$。

> [!warning] 正交 ≠ 互补：维数才是关键
> $\mathbb{R}^3$ 里两条**互相垂直的直线**确实正交，但它们**互为正交补吗？不是**——它们的正交补都各是一个平面（2 维），而不是另一条直线。
> 判断"$W$ 是不是 $V$ 的正交补"要两条同时成立：
> 1. $V\perp W$；
> 2. $\dim V+\dim W=n$。
> 两条直线加起来只有 $1+1=2<3$ 维，它们的"并集"只张成一个平面，剩下的方向谁也不管。
> 反过来，**若 $V\perp W$ 且 $\dim V+\dim W=n$，则 $W=V^{\perp}$ 必然成立**。

> [!tip] 定理 线性代数基本定理（第二部分）
> 对任意 $m\times n$ 矩阵 $A$：
> $$\mathbf{N}(A)=\mathbf{C}(A^T)^{\perp}\qquad\text{（在 }\mathbb{R}^n\text{ 中）}\qquad \mathbf{N}(A^T)=\mathbf{C}(A)^{\perp}\qquad\text{（在 }\mathbb{R}^m\text{ 中）}$$
> 也就是：**行空间与零空间互补正交，列空间与左零空间互补正交**。

两个方向都只需两行：

**行空间 ⊥ 零空间**：$A\mathbf{x}=\mathbf{0}$ 的意思就是 $A$ 的**每一行**与 $\mathbf{x}$ 点积为 0，即 $\mathbf{x}$ 与每一行都正交。而"与每一行都正交"经线性组合传给一切行的组合——$\mathbf{x}$ 与整个行空间正交。又由第 3 章的维数定理 $r+(n-r)=n$，维数够、交集只有 $\mathbf{0}$，所以零空间**正好是**行空间的正交补。

**列空间 ⊥ 左零空间**：$A^T\mathbf{y}=\mathbf{0}$ 写成 $\mathbf{y}^TA=\mathbf{0}^T$，即 $\mathbf{y}$ 与 $A$ 的**每一列**正交，于是与列空间正交；维数 $r+(m-r)=m$ ✓。

**用第 3 章的 4×3 矩阵实测一遍**（$A=\begin{bmatrix}1&1&2\\2&1&3\\3&1&4\\4&1&5\end{bmatrix}$，$r=2$）：

| 空间 | 一组基 | 维数 |
| --- | --- | --- |
| 行空间 $\mathbf{C}(A^T)$ | $\operatorname{span}\{(1,1,2),(2,1,3)\}$ | $r=2$ |
| 零空间 $\mathbf{N}(A)$ | $\operatorname{span}\{(1,1,-1)\}$ | $n-r=1$ |
| 列空间 $\mathbf{C}(A)$ | $\operatorname{span}\{(1,2,3,4),(1,1,1,1)\}$ | $r=2$ |
| 左零空间 $\mathbf{N}(A^T)$ | $\operatorname{span}\{(1,-2,1,0),(2,-3,0,1)\}$ | $m-r=2$ |

正交性当场可验：

$$
(1,1,2)\cdot(1,1,-1)=0,\quad (2,1,3)\cdot(1,1,-1)=0\quad\checkmark
$$

左零空间那两个向量也逐一与三个列正交（如 $(1,-2,1,0)\cdot(1,2,3,4)=1-4+3+0=0$ ✓）。而第 3 章那句"$b_1+b_4=b_2+b_3$"如今有了新身份：它正是 $\mathbf{b}\perp\mathbf{N}(A^T)$ 的展开式（两个基向量各给一个方程，联立即得）——**"b 在列空间里"和"b 与左零空间正交"是同一句话**，这就是第 3 章"有解第三判据"的来源。

> [!tip] 正交补带来的唯一分解
> $\mathbb{R}^n$ 中任何向量 $\mathbf{x}$ 都能**唯一**地写成
> $$\mathbf{x}=\mathbf{x}_{\text{row}}+\mathbf{x}_{\text{null}},\qquad \mathbf{x}_{\text{row}}\in\mathbf{C}(A^T),\ \mathbf{x}_{\text{null}}\in\mathbf{N}(A)$$
> 存在性由两空间维数相加等于 $n$ 保证；唯一性由"交集只有 $\mathbf{0}$"保证。
> 这个分解不是装饰品：$A\mathbf{x}_{\text{null}}=\mathbf{0}$，所以 $A\mathbf{x}=A\mathbf{x}_{\text{row}}$——**$A$ 看不见零空间分量**。4.3 里"最小二乘解总是行空间里那一个"，用的就是这条。

## 描绘全局图

四个子空间的关系可以画成一张图——这是 Strang 那句"**线性代数基本定理**"的完整版：

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 350" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la4-A" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la4-B" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/>
    </marker>
    <marker id="la4-T" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-muted,#57606a)"/>
    </marker>
  </defs>

  <!-- R^n -->
  <text x="175" y="80" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">R^n（未知数住的地方）</text>
  <rect x="50" y="90" width="250" height="180" rx="5" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.4"/>
  <rect x="62" y="102" width="226" height="70" rx="4" fill="#4f46e5" fill-opacity="0.16" stroke="#4f46e5" stroke-opacity="0.55"/>
  <text x="175" y="142" text-anchor="middle" font-size="12" font-weight="600" fill="#4f46e5">行空间 C(A^T)  dim r</text>
  <rect x="62" y="182" width="226" height="76" rx="4" fill="#d97706" fill-opacity="0.16" stroke="#d97706" stroke-opacity="0.55"/>
  <text x="175" y="225" text-anchor="middle" font-size="12" font-weight="600" fill="#d97706">零空间 N(A)  dim n−r</text>
  <text x="175" y="180" text-anchor="middle" font-size="10" fill="var(--text-faint,#8b949e)">⊥</text>

  <!-- R^m -->
  <text x="665" y="80" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">R^m（测量量住的地方）</text>
  <rect x="540" y="90" width="250" height="180" rx="5" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.4"/>
  <rect x="552" y="102" width="226" height="70" rx="4" fill="#4f46e5" fill-opacity="0.16" stroke="#4f46e5" stroke-opacity="0.55"/>
  <text x="665" y="142" text-anchor="middle" font-size="12" font-weight="600" fill="#4f46e5">列空间 C(A)  dim r</text>
  <rect x="552" y="182" width="226" height="76" rx="4" fill="#d97706" fill-opacity="0.16" stroke="#d97706" stroke-opacity="0.55"/>
  <text x="665" y="225" text-anchor="middle" font-size="12" font-weight="600" fill="#d97706">左零空间 N(A^T)  dim m−r</text>
  <text x="665" y="180" text-anchor="middle" font-size="10" fill="var(--text-faint,#8b949e)">⊥</text>

  <!-- A 的两条作用 -->
  <line x1="300" y1="137" x2="530" y2="137" stroke="#4f46e5" stroke-width="2" marker-end="url(#la4-A)"/>
  <text x="415" y="128" text-anchor="middle" font-size="13" font-weight="700" fill="#4f46e5">A</text>
  <text x="415" y="158" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">一一对应（可逆，方向不丢）</text>

  <line x1="300" y1="220" x2="530" y2="220" stroke="#d97706" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#la4-B)"/>
  <text x="415" y="211" text-anchor="middle" font-size="13" font-weight="700" fill="#d97706">A</text>
  <text x="415" y="241" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">压成 0（全部丢失）</text>

  <!-- A^T 反向 -->
  <line x1="530" y1="292" x2="300" y2="292" stroke="var(--text-muted,#57606a)" stroke-width="1.4" stroke-dasharray="4 4" marker-end="url(#la4-T)"/>
  <text x="415" y="308" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">A^T：把列空间/左零空间按原路送回（行空间上是逆映射）</text>

  <text x="420" y="338" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">R^n = 行空间 ⊕ 零空间，R^m = 列空间 ⊕ 左零空间——两组正交直和</text>
</svg>

这张图要读出**四条信息**：

1. **$A$ 把行空间一一对应地送到列空间**。为什么是一一对应？因为送过去的路上"没有丢东西"：行空间的向量零空间分量为零，若 $A\mathbf{x}=\mathbf{0}$ 而 $\mathbf{x}$ 在行空间里，则 $\mathbf{x}$ 同时在行空间与零空间，只能是 $\mathbf{0}$。两个空间维数都是 $r$，所以 $A$ 在其上是一一映射（可逆）。
2. **$A$ 把零空间整体压成 $\mathbf{0}$**。这就是"解不唯一"的全部来源。
3. **$A^T$ 反向做同样的事**：$\mathbf{C}(A)\to\mathbf{C}(A^T)$ 一一对应，$\mathbf{N}(A^T)\to\mathbf{0}$。
4. 每个空间的正交补就在图上紧挨着它，维数相加恰好填满整个"房间"。

> [!warning] 三种"住址"别搞混
> | 说法 | 属于谁 | 住在 |
> | --- | --- | --- |
> | 未知数 $\mathbf{x}$ | $A$ 的**列数** $n$ | $\mathbb{R}^n$ |
> | 测量值 $\mathbf{b}$ | $A$ 的**行数** $m$ | $\mathbb{R}^m$ |
> | $\mathbf{x}-\hat{\mathbf{x}}$ | $\mathbf{N}(A)$ | $\mathbb{R}^n$ |
> | $\mathbf{b}-A\hat{\mathbf{x}}$ | $\mathbf{N}(A^T)$ | $\mathbb{R}^m$ |
> 最后两行是本章的核心：**"解不唯一"的残差在零空间，"方程无解"的残差在左零空间**——前者靠"多解"化解，后者靠"投影"化解。

## 合并子空间的基

既然 $\mathbb{R}^n$ 被行空间与零空间劈成两块，那么"把两块的基拼起来"自然应该得到 $\mathbb{R}^n$ 的**一组基**：

> [!tip] 拼装定理
> 设行空间的一组基为 $\mathbf{v}_1,\dots,\mathbf{v}_r$，零空间的一组基为 $\mathbf{u}_1,\dots,\mathbf{u}_{n-r}$，则
> $$\underbrace{\mathbf{v}_1,\dots,\mathbf{v}_r}_{r\ \text{个}},\ \underbrace{\mathbf{u}_1,\dots,\mathbf{u}_{n-r}}_{n-r\ \text{个}}\quad\text{是}\ \mathbb{R}^n\ \text{的一组基}$$
> 理由两条：**个数正好是 $n$**；**彼此无关**——若 $\sum c_i\mathbf{v}_i+\sum d_j\mathbf{u}_j=\mathbf{0}$，左边两项分别在两个正交子空间里，它们的和为零且正交，由勾股定理得两项**各自为零**，再由各组内部无关性得 $c_i=d_j=0$。
> 同一个道理：**列空间的基 + 左零空间的基 = $\mathbb{R}^m$ 的一组基**。

**秩一矩阵是最小的实验台**（$A=\mathbf{u}\mathbf{v}^T$，回到 3.5）：

$$
A=\begin{bmatrix}1\\2\\3\end{bmatrix}\begin{bmatrix}1&3&10\end{bmatrix}
$$

- $\mathbf{C}(A)=\operatorname{span}\{\mathbf{u}\}$（$r=1$），$\mathbf{N}(A)=\mathbf{v}^{\perp}$（$n-1=2$ 维，即平面 $x_1+3x_2+10x_3=0$）→ 拼起来是 $\mathbb{R}^3$ 的一组基；
- $\mathbf{C}(A^T)=\operatorname{span}\{\mathbf{v}\}$（$r=1$），$\mathbf{N}(A^T)=\mathbf{u}^{\perp}$（$m-1=2$ 维）→ 拼起来也是 $\mathbb{R}^3$ 的一组基。

秩一矩阵把"四个空间 + 两组正交补"压缩到极致：**两个方向（$\mathbf{u}$、$\mathbf{v}$）撑起列空间和行空间，其余全是它们的正交补**。

> [!warning] 拼起来的基"正交"吗？——不保证
> 行空间与零空间**之间**正交（跨组 ✓），但**各组内部**只是无关，一般不两两正交（比如特殊解 $(1,1,-1)$ 与行空间基 $(1,1,2)$ 正交，但行空间内部两个基向量并不正交）。
> 想要"整组两两正交"，得把每一组各自再扳直——这正是 4.4 的 Gram-Schmidt 要干的活。
> 而"**同时给四个子空间各配一组标准正交基**"这件事，就是第 7 章的**奇异值分解**（singular value decomposition，简称 SVD）——本章的四个子空间图，在 SVD 里做到"完美版本"。

# 4.2 投影

## 到直线上的投影

第一个问题小到可以手算：**把 $\mathbf{b}$ 投影到 $\mathbf{a}$ 张成的直线上**。

投影点必须长成 $t\mathbf{a}$（在直线上），误差 $\mathbf{e}=\mathbf{b}-t\mathbf{a}$ 必须**垂直于直线**。两个条件各自负责一半：

$$
\mathbf{a}\cdot(\mathbf{b}-t\mathbf{a})=0\quad\Longrightarrow\quad t=\frac{\mathbf{a}^T\mathbf{b}}{\mathbf{a}^T\mathbf{a}}
$$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 320" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la4-ln" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la4-bb" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-normal,#1f2328)"/>
    </marker>
    <marker id="la4-ee" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#dc2626"/>
    </marker>
  </defs>

  <!-- 直线（a 方向） -->
  <line x1="98" y1="238" x2="722" y2="82" stroke="#4f46e5" stroke-width="1.6"/>
  <!-- a 向量 -->
  <line x1="170" y1="220" x2="650" y2="100" stroke="#4f46e5" stroke-width="2.4" marker-end="url(#la4-ln)"/>
  <text x="662" y="98" font-size="13" font-weight="700" fill="#4f46e5">a</text>

  <!-- b 向量 -->
  <line x1="170" y1="220" x2="546" y2="254" stroke="var(--text-normal,#1f2328)" stroke-width="2.2" marker-end="url(#la4-bb)"/>
  <text x="556" y="266" font-size="13" font-weight="700" fill="var(--text-normal,#1f2328)">b</text>

  <!-- 投影 p -->
  <line x1="170" y1="220" x2="516" y2="134" stroke="#059669" stroke-width="2.4"/>
  <circle cx="516" cy="134" r="4.5" fill="#059669"/>
  <text x="497" y="158" text-anchor="middle" font-size="12.5" font-weight="600" fill="#059669">p = x̂ a</text>

  <!-- 误差 e -->
  <line x1="516" y1="134" x2="546" y2="254" stroke="#dc2626" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#la4-ee)"/>
  <text x="556" y="200" font-size="12.5" font-weight="600" fill="#dc2626">e = b − p</text>

  <!-- 直角标记 -->
  <path d="M530,131 L533,145 L519,148" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>

  <circle cx="170" cy="220" r="3.5" fill="var(--text-normal,#1f2328)"/>
  <text x="155" y="238" font-size="12" fill="var(--text-muted,#57606a)">0</text>

  <text x="420" y="300" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">投影的定义性条件：误差与直线垂直 —— a · e = 0 一条方程定出 t</text>
</svg>

> [!info] Def 4 直线投影的投影矩阵
> **投影**（projection）就是把 $\mathbf{b}$ 垂直地"拍"到 $\mathbf{a}$ 的方向上，落点 $\mathbf{p}$ 由**投影矩阵**（projection matrix）$P$ 算出：
> $$\mathbf{p}=t\mathbf{a}=\mathbf{a}\,\frac{\mathbf{a}^T\mathbf{b}}{\mathbf{a}^T\mathbf{a}}=\frac{\mathbf{a}\mathbf{a}^T}{\mathbf{a}^T\mathbf{a}}\,\mathbf{b}=P\mathbf{b},\qquad P=\frac{\mathbf{a}\mathbf{a}^T}{\mathbf{a}^T\mathbf{a}}$$
> 注意形状：$\mathbf{a}\mathbf{a}^T$ 是 $n\times n$ **矩阵**（列乘行，秩 1），$\mathbf{a}^T\mathbf{a}$ 是**数**。所以 $P$ 是"秩一矩阵除以一个数"，**秩为 1**。

**例（$\mathbf{a}=(1,2,2)$，$\mathbf{b}=(1,1,1)$）**：

$$
\mathbf{a}^T\mathbf{b}=1+2+2=5,\qquad \mathbf{a}^T\mathbf{a}=1+4+4=9
$$

$$
\mathbf{p}=\frac{5}{9}\begin{bmatrix}1\\2\\2\end{bmatrix}=\begin{bmatrix}5/9\\10/9\\10/9\end{bmatrix},\qquad
\mathbf{e}=\mathbf{b}-\mathbf{p}=\frac{1}{9}\begin{bmatrix}4\\-1\\-1\end{bmatrix}
$$

验证 $\mathbf{e}\perp\mathbf{a}$：$4-2-2=0$ ✓。

$$
P=\frac{1}{9}\begin{bmatrix}1&2&2\\2&4&4\\2&4&4\end{bmatrix}
$$

> [!tip] 投影矩阵的两个身份证明
> $$P^2=P\qquad\text{（投两次 = 投一次）}\qquad P^T=P\qquad\text{（对称）}$$
> - $P^2=P$：$\mathbf{p}$ 已经在直线上，再投一次纹丝不动。验算：$\left(\frac{\mathbf{a}\mathbf{a}^T}{\mathbf{a}^T\mathbf{a}}\right)^2=\frac{\mathbf{a}(\mathbf{a}^T\mathbf{a})\mathbf{a}^T}{(\mathbf{a}^T\mathbf{a})^2}=\frac{\mathbf{a}\mathbf{a}^T}{\mathbf{a}^T\mathbf{a}}$ ✓（中间那个 $\mathbf{a}^T\mathbf{a}$ 是数，可以提出来约掉）。
> - $P^T=P$：因为 $(\mathbf{a}\mathbf{a}^T)^T=\mathbf{a}\mathbf{a}^T$。
> 这两条是投影矩阵的"身份证"：$P^2=P$（**幂等**，idempotent）说明"重复投影不再改变"，$P^T=P$ 说明投影是**垂直**而不是斜着拍的。只满足 $P^2=P$ 的矩阵叫斜投影矩阵，本章不讨论。
> 顺带可以验一句：$\operatorname{rank}(P)=1=\operatorname{tr}(P)$——秩告诉我们"落点空间的维数"，**迹**（trace）也是（迹的循环性质 $\operatorname{tr}(AB)=\operatorname{tr}(BA)$ 在这里好用）。

> [!tip] 为什么投影点是"最近的点"
> 令 $\mathbf{p}'$ 为直线上任何一个别的点，则 $\mathbf{b}-\mathbf{p}'=\mathbf{e}+(\mathbf{p}-\mathbf{p}')$，其中两项**互相正交**（$\mathbf{e}\perp$ 直线，$\mathbf{p}-\mathbf{p}'$ 在直线上），勾股定理给出
> $$\|\mathbf{b}-\mathbf{p}'\|^2=\|\mathbf{e}\|^2+\|\mathbf{p}-\mathbf{p}'\|^2\ \ge\ \|\mathbf{e}\|^2$$
> 等号只在 $\mathbf{p}'=\mathbf{p}$ 时取到。所以"垂直"这个条件恰好等价于"距离最短"——**投影就是最优逼近**，4.3 把这件事变成求方程组的算法。

> [!warning] 关于投影的三个小提醒
> 1. 投影**不是**"把 b 缩放一下"：只要 $\mathbf{b}$ 不在直线上，$P\mathbf{b}$ 与 $\mathbf{b}$ 方向就不同。
> 2. $\mathbf{a}=\mathbf{0}$ 时公式无意义（分母为零）——零向量张不出直线。
> 3. $P\mathbf{a}=\mathbf{a}$（直线上的向量投影是自己），$P\mathbf{b}=0$ 当且仅当 $\mathbf{b}\perp\mathbf{a}$。

## 到子空间上的投影

把"直线"换成"$A$ 的列空间"，思路一字不改，只是 $t$ 变成一个向量 $\hat{\mathbf{x}}$。

设 $A=(\mathbf{a}_1,\dots,\mathbf{a}_n)$ 的列是子空间 $S=\mathbf{C}(A)$ 的一组基，投影点写成各列的某个组合：

$$
\mathbf{p}=A\hat{\mathbf{x}}\in S,\qquad \mathbf{e}=\mathbf{b}-A\hat{\mathbf{x}}\ \perp\ S
$$

"$\mathbf{e}$ 与整个子空间正交"等价于"$\mathbf{e}$ 与**每一列**正交"（因为正交性经组合传递），后者正是

$$
A^T(\mathbf{b}-A\hat{\mathbf{x}})=\mathbf{0}\quad\Longleftrightarrow\quad \boxed{\ A^TA\hat{\mathbf{x}}=A^T\mathbf{b}\ }
$$

这组 $n$ 个方程 $n$ 个未知数的方程叫**法方程**（normal equations）。两边左乘 $(A^TA)^{-1}$ 得 $\hat{\mathbf{x}}$，代回 $\mathbf{p}=A\hat{\mathbf{x}}$：

> [!info] Def 5 子空间投影的投影矩阵
> $$\hat{\mathbf{x}}=(A^TA)^{-1}A^T\mathbf{b},\qquad \mathbf{p}=A(A^TA)^{-1}A^T\mathbf{b},\qquad P=A(A^TA)^{-1}A^T$$
> $\hat{\mathbf{x}}$ 这个记号读作 "x hat"，4.3 会证明它正是**最小二乘解**——同一个东西，两种叫法。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 330" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la4-a1" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la4-a2" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
    <marker id="la4-b2" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-normal,#1f2328)"/>
    </marker>
    <marker id="la4-e2" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#dc2626"/>
    </marker>
  </defs>

  <!-- 平面（a1、a2 张成） -->
  <polygon points="200,250 430,205 400,120 170,165" fill="#4f46e5" fill-opacity="0.12" stroke="#4f46e5" stroke-opacity="0.6" stroke-width="1.4"/>

  <!-- a1、a2 -->
  <line x1="200" y1="250" x2="430" y2="205" stroke="#4f46e5" stroke-width="2" marker-end="url(#la4-a1)"/>
  <text x="412" y="222" font-size="12.5" font-weight="600" fill="#4f46e5">a₁</text>
  <line x1="200" y1="250" x2="170" y2="165" stroke="#db2777" stroke-width="2" marker-end="url(#la4-a2)"/>
  <text x="140" y="158" font-size="12.5" font-weight="600" fill="#db2777">a₂</text>

  <!-- b -->
  <line x1="200" y1="250" x2="390" y2="60" stroke="var(--text-normal,#1f2328)" stroke-width="2.2" marker-end="url(#la4-b2)"/>
  <text x="398" y="56" font-size="13" font-weight="700" fill="var(--text-normal,#1f2328)">b</text>

  <!-- e -->
  <line x1="330" y1="205" x2="390" y2="60" stroke="#dc2626" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#la4-e2)"/>
  <text x="368" y="145" font-size="12.5" font-weight="600" fill="#dc2626">e = b − p</text>

  <!-- p -->
  <circle cx="330" cy="205" r="4.5" fill="#059669"/>
  <path d="M343,203 L338,215 L325,217" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <line x1="285" y1="222" x2="324" y2="208" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <text x="283" y="227" text-anchor="end" font-size="12.5" font-weight="600" fill="#059669">p = A x̂</text>

  <circle cx="200" cy="250" r="3.5" fill="var(--text-normal,#1f2328)"/>
  <text x="188" y="268" font-size="12" fill="var(--text-muted,#57606a)">0</text>

  <text x="420" y="300" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">e ⊥ 平面（即 e ⊥ 每一列）⇒ A^T(b − Ax̂) = 0 ⇒ 法方程 A^T A x̂ = A^T b</text>
</svg>

**例（Strang 经典）**：把 $\mathbf{b}=(6,0,0)$ 投影到 $\mathbf{a}_1=(1,1,1)$、$\mathbf{a}_2=(0,1,2)$ 张成的平面上。

$$
A=\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix},\quad
A^TA=\begin{bmatrix}3&3\\3&5\end{bmatrix},\quad
A^T\mathbf{b}=\begin{bmatrix}6\\0\end{bmatrix},\quad
(A^TA)^{-1}=\frac{1}{6}\begin{bmatrix}5&-3\\-3&3\end{bmatrix}
$$

$$
\hat{\mathbf{x}}=(A^TA)^{-1}A^T\mathbf{b}=\frac{1}{6}\begin{bmatrix}5&-3\\-3&3\end{bmatrix}\begin{bmatrix}6\\0\end{bmatrix}=\begin{bmatrix}5\\-3\end{bmatrix}
$$

$$
\mathbf{p}=5\mathbf{a}_1-3\mathbf{a}_2=\begin{bmatrix}5\\5\\5\end{bmatrix}-\begin{bmatrix}0\\3\\6\end{bmatrix}=\begin{bmatrix}5\\2\\-1\end{bmatrix},\qquad
\mathbf{e}=\mathbf{b}-\mathbf{p}=\begin{bmatrix}1\\-2\\1\end{bmatrix}
$$

检查 $\mathbf{e}\perp$ 两列：$\mathbf{e}\cdot\mathbf{a}_1=1-2+1=0$ ✓，$\mathbf{e}\cdot\mathbf{a}_2=0-2+2=0$ ✓。误差长度 $\|\mathbf{e}\|=\sqrt{6}$。

$$
P=A(A^TA)^{-1}A^T=\frac{1}{6}\begin{bmatrix}5&2&-1\\2&2&2\\-1&2&5\end{bmatrix}
$$

（对称 ✓，$\operatorname{tr}(P)=\frac{5+2+5}{6}=2=\operatorname{rank}(P)=$ 平面维数 ✓，$P\mathbf{b}=\frac{1}{6}(30,12,-6)=(5,2,-1)=\mathbf{p}$ ✓。）

> [!tip] 投影矩阵的普遍性质
> 对任何列无关的 $A$：
> - $P^2=P$、$P^T=P$；
> - $I-P$ 也是投影矩阵，它把 $\mathbf{b}$ 投到**正交补** $S^{\perp}=\mathbf{N}(A^T)$ 上；
> - 于是 $\mathbf{b}=P\mathbf{b}+(I-P)\mathbf{b}=\mathbf{p}+\mathbf{e}$，两块分别落在 $S$ 与 $S^{\perp}$，且**互相正交**；
> - $\operatorname{rank}(P)=\operatorname{tr}(P)=\dim S$。
> 直线情形只是它的特例：$A$ 退化成单列 $\mathbf{a}$ 时，$A^TA$ 是数 $\mathbf{a}^T\mathbf{a}$，"求逆"变成"除以"，$P$ 就还原成 $\dfrac{\mathbf{a}\mathbf{a}^T}{\mathbf{a}^T\mathbf{a}}$。

> [!warning] 公式成立有个前提
> $P=A(A^TA)^{-1}A^T$ 里出现了逆，所以要求 $A^TA$ **可逆**，即 **$A$ 的各列线性无关**（4.3 会给证明）。
> 若 $A$ 的列相关（例如两列相同），$A^TA$ 奇异，这个写法失效——投影点仍在，但 $\hat{\mathbf{x}}$ 不唯一，处理办法见 4.3 最后两节（最小范数解 / 伪逆）。

# 4.3 最小二乘估计

## 误差最小化

第 3 章已经说过：$m>n$（方程比未知数多）时，$A\mathbf{x}=\mathbf{b}$ **一般无解**。但工程上"无解"不等于"没法办"——测量数据的背后有一个真实答案，噪声让我们永远对不准，此时正确的问法是：

> **找不到让 $A\mathbf{x}$ 恰好等于 $\mathbf{b}$ 的 $\mathbf{x}$，那就找让误差 $\|\mathbf{b}-A\mathbf{x}\|$ 最小的那个。**

> [!info] Def 6 最小二乘解
> $$\hat{\mathbf{x}}=\arg\min_{\mathbf{x}}\ \|A\mathbf{x}-\mathbf{b}\|^2$$
> 平方和形式的 $\|A\mathbf{x}-\mathbf{b}\|^2=(Ax_1-b_1)^2+\cdots+(Ax_m-b_m)^2$（这里 $Ax_i$ 指"第 $i$ 个方程左边"）就是**平方误差之和**——"最小二乘"（least squares）的名字由此而来。

> [!tip] 定理 最小二乘解的三个等价刻画
> $$\underbrace{A^TA\hat{\mathbf{x}}=A^T\mathbf{b}}_{\text{代数：法方程}}\qquad\Longleftrightarrow\qquad \underbrace{A^T(\mathbf{b}-A\hat{\mathbf{x}})=\mathbf{0}}_{\text{几何：残差 ⊥ 列空间}}\qquad\Longleftrightarrow\qquad \underbrace{\mathbf{e}\in\mathbf{N}(A^T)}_{\text{空间：落在左零空间}}$$
> 三条说的是同一件事，只是换了三个抽屉来讲。

**几何证明**：$\mathbf{b}$ 在 $\mathbf{R}^m$ 里，$A\mathbf{x}$ 能取遍的只有列空间 $S$。要让 $\|A\mathbf{x}-\mathbf{b}\|$ 最小，就是要在 $S$ 里找离 $\mathbf{b}$ 最近的点——4.2 已经证明那个点就是**投影** $\mathbf{p}=A\hat{\mathbf{x}}$，而投影的特征正是 $\mathbf{b}-\mathbf{p}\perp S$。

**代数证明**（顺手还能证明"最小值唯一"）：记 $E(\mathbf{x})=\|A\mathbf{x}-\mathbf{b}\|^2=\mathbf{x}^TA^TA\mathbf{x}-2\mathbf{x}^TA^T\mathbf{b}+\mathbf{b}^T\mathbf{b}$。在 $\hat{\mathbf{x}}$ 上加一个扰动 $\boldsymbol{\delta}$：

$$
E(\hat{\mathbf{x}}+\boldsymbol{\delta})=E(\hat{\mathbf{x}})+2\boldsymbol{\delta}^T(A^TA\hat{\mathbf{x}}-A^T\mathbf{b})+\boldsymbol{\delta}^TA^TA\boldsymbol{\delta}
=E(\hat{\mathbf{x}})+\|A\boldsymbol{\delta}\|^2\ \ge\ E(\hat{\mathbf{x}})
$$

只要 $\hat{\mathbf{x}}$ 满足法方程，中间那一项就消失，剩下的 $\|A\boldsymbol{\delta}\|^2\ge0$ 告诉我们"**往哪个方向走都不更低**"。而且当 $A$ 的列无关时 $A\boldsymbol{\delta}=\mathbf{0}$ 只有 $\boldsymbol{\delta}=\mathbf{0}$，等号只在原地取到——**最小值唯一**。

> [!tip] 定理 $A^TA$ 可逆 ⟺ $A$ 的列线性无关
> **证明**：$A^TA$ 是 $n\times n$。
> - 若各列无关：$A^TA\mathbf{x}=\mathbf{0}\Rightarrow \mathbf{x}^TA^TA\mathbf{x}=0\Rightarrow \|A\mathbf{x}\|^2=0\Rightarrow A\mathbf{x}=\mathbf{0}\Rightarrow \mathbf{x}=\mathbf{0}$，故 $\mathbf{N}(A^TA)=\{\mathbf{0}\}$，可逆；
> - 反之若各列相关，则存在 $\mathbf{x}\ne\mathbf{0}$ 使 $A\mathbf{x}=\mathbf{0}$，两边左乘 $A^T$ 得 $A^TA\mathbf{x}=\mathbf{0}$，奇异。
> 顺便得到一条有用的等式：$\mathbf{N}(A^TA)=\mathbf{N}(A)$。
> 实战意义：**只有"高瘦且列满秩"的 $A$（$r=n<m$）才能直接套 $\hat{\mathbf{x}}=(A^TA)^{-1}A^T\mathbf{b}$**。这也解释了为什么"数据点要比待定参数多"，而且不能有冗余参数。

> [!warning] 别真的去算 $(A^TA)^{-1}$
> $A^TA$ 的**条件数**（condition number）是 $A$ 的平方，$A$ 稍病态它就病态得厉害（浮点误差被放大一倍次方）。工程上求最小二乘有两种正确姿势：
> - `A \ b`（MATLAB / NumPy 的 `np.linalg.lstsq`）——**内部走 QR，不是求逆**；
> - 或者显式 $A=QR$ 后回代（**4.4**）。
> 法方程只用来"写公式"和"想问题"，不用来"敲代码"。

## 最小二乘法的全局图

把 4.1 的四子空间图和 4.2 的投影拼在一起，就是最小二乘的**全局图**——一张图讲完整个故事：

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 330" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la4-gb" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-normal,#1f2328)"/>
    </marker>
    <marker id="la4-ge" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#dc2626"/>
    </marker>
  </defs>

  <!-- R^m 外框 -->
  <rect x="80" y="40" width="680" height="250" rx="6" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.4" stroke-dasharray="6 4"/>
  <text x="96" y="62" font-size="12" fill="var(--text-muted,#57606a)">R^m（b 和 e 都住在这里）</text>

  <!-- 列空间板层 -->
  <rect x="110" y="110" width="440" height="165" rx="5" fill="#4f46e5" fill-opacity="0.12" stroke="#4f46e5" stroke-opacity="0.55"/>
  <text x="128" y="132" font-size="12" font-weight="600" fill="#4f46e5">列空间 C(A)：dim r（A 能到达的全部地方）</text>

  <!-- b -->
  <line x1="170" y1="255" x2="448" y2="50" stroke="var(--text-normal,#1f2328)" stroke-width="2.2" marker-end="url(#la4-gb)"/>
  <text x="458" y="52" font-size="13" font-weight="700" fill="var(--text-normal,#1f2328)">b</text>

  <!-- p -->
  <line x1="170" y1="255" x2="470" y2="215" stroke="#059669" stroke-width="2.4"/>
  <circle cx="470" cy="215" r="4.5" fill="#059669"/>
  <path d="M486,213 L484,197 L468,199" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <line x1="410" y1="240" x2="462" y2="220" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <text x="406" y="245" text-anchor="end" font-size="12.5" font-weight="600" fill="#059669">p = A x̂（最佳逼近）</text>

  <!-- e -->
  <line x1="470" y1="215" x2="448" y2="58" stroke="#dc2626" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#la4-ge)"/>
  <text x="492" y="140" font-size="12.5" font-weight="600" fill="#dc2626">e = b − p ∈ N(A^T)</text>

  <circle cx="170" cy="255" r="3.5" fill="var(--text-normal,#1f2328)"/>
  <text x="158" y="273" font-size="12" fill="var(--text-muted,#57606a)">0</text>

  <text x="420" y="316" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">b = p + e：直角三角形的两条腿，p ⊥ e，所以 ‖b‖² = ‖p‖² + ‖e‖²</text>
</svg>

图上读出的**三句话**：

1. **$\mathbf{b}$ 被唯一地劈成两块**：$\mathbf{b}=\mathbf{p}+\mathbf{e}$，$\mathbf{p}\in\mathbf{C}(A)$，$\mathbf{e}\in\mathbf{N}(A^T)=\mathbf{C}(A)^{\perp}$（唯一性来自 4.1 的唯一分解）。
2. **$\mathbf{e}$ 的长度就是要最小化的东西**，而 $\mathbf{p}$ 决定了它：$\|\mathbf{e}\|=\|\mathbf{b}-\mathbf{p}\|$。因为 $\mathbf{p}$ 本身就是"最近点"，$\mathbf{e}$ 自动成为所有候选误差中最短的那根。
3. **法方程 $A^TA\hat{\mathbf{x}}=A^T\mathbf{b}$ 就是"在这个图上看图说话"**：$\mathbf{e}\perp\mathbf{C}(A)$ 翻译成 $\mathbf{e}\perp$ 每一列，即 $A^T\mathbf{e}=\mathbf{0}$。

> [!tip] 三个"必然"（可用来快速验算）
> - $\mathbf{e}$ **一定落在左零空间**：换个说法，$A^T\mathbf{e}=\mathbf{0}$ 是 3.5"有解第三判据"的孪生兄弟；
> - $\hat{\mathbf{x}}$ **一定落在行空间** $\mathbf{C}(A^T)$ 里：因为 $A^T\mathbf{b}$ 是 $A$ 各行的组合（在行空间），左乘可逆矩阵 $(A^TA)^{-1}$ 不会跑出行空间；
> - **"$\mathbf{b}$ 恰好有解" ⟺ $\mathbf{e}=\mathbf{0}$** ⟺ $\mathbf{b}\in\mathbf{C}(A)$：最小二乘把"有没有解"和"解是什么"统一成了一个动作——**投影，然后解方程**。

> [!note] 通信方向：正交性原理
> 最小二乘的全部内容可以浓缩成一句工程行话——**"残差与观测正交"**（orthogonality principle）。这不是特例，而是"最优估计"的通则：
> - 匹配滤波/相关接收的最优性来自"信号与噪声正交"（[[vault-notes/communication/09-optimal-reception]]）；
> - MMSE 估计的正交性原理：估计误差 $\mathbf{e}$ 必须与观测数据 $\mathbf{y}$ 正交，$E[\mathbf{e}\mathbf{y}^T]=\mathbf{0}$——**把上面那张图的点积换成统计期望，最小二乘就升级成 MMSE**；
> - 通信里的 LS 信道估计（OFDM 导频估计）就是逐条解 $A^TA\hat{\mathbf{x}}=A^T\mathbf{b}$（[[vault-notes/5g/phy/04-physical-channels-signals]]）。

## 用直线拟合

最小二乘的第一个真实身份是**曲线拟合**（curve fitting）。设三个时刻测得的数据为 $(t,b)=(1,1),(2,2),(3,4)$，想用一条直线 $b=C+Dt$ 概括它的趋势。

三个方程、两个未知数，写成矩阵形式：

$$
\underbrace{\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix}}_{A}
\begin{bmatrix}C\\D\end{bmatrix}
=\underbrace{\begin{bmatrix}1\\2\\4\end{bmatrix}}_{\mathbf{b}}
\qquad\text{（三个方程两个未知数，一般无解）}
$$

$A$ 的第一列是"截距列的 1"，第二列是"时刻列 $t$"；这个 $A$ **列无关**（两列不成比例），所以可以放心用公式。

$$
A^TA=\begin{bmatrix}3&6\\6&14\end{bmatrix},\qquad A^T\mathbf{b}=\begin{bmatrix}7\\17\end{bmatrix}
$$

法方程（两行都有明确含义）：

$$
\begin{cases}3C+6D=7&\text{（}1\cdot e_1+1\cdot e_2+1\cdot e_3=0\text{：残差之和为零）}\\
6C+14D=17&\text{（}t_1e_1+t_2e_2+t_3e_3=0\text{：残差与时刻正交）}\end{cases}
$$

解得 $\det=42-36=6$：

$$
\hat{\mathbf{x}}=\frac{1}{6}\begin{bmatrix}14&-6\\-6&3\end{bmatrix}\begin{bmatrix}7\\17\end{bmatrix}=\frac{1}{6}\begin{bmatrix}-4\\9\end{bmatrix}=\begin{bmatrix}-2/3\\3/2\end{bmatrix}
$$

$$
\text{最佳直线：}\quad b=-\frac{2}{3}+\frac{3}{2}t
$$

逼近值与误差：

| $t$ | $b$（测量） | $p=C+Dt$（拟合） | $e=b-p$ |
| --- | --- | --- | --- |
| 1 | 1 | $5/6\approx0.833$ | $+1/6$ |
| 2 | 2 | $7/3\approx2.333$ | $-1/3$ |
| 3 | 4 | $23/6\approx3.833$ | $+1/6$ |

$$
\|\mathbf{e}\|^2=\frac{1}{36}+\frac{1}{9}+\frac{1}{36}=\frac{1}{6}
$$

两个"必然"在这张表里肉眼可见：

- **残差之和为零**（$1/6-1/3+1/6=0$）——含 $\mathbf{1}$ 列的直接后果；
- **直线穿过重心** $(\bar{t},\bar{b})=(2,7/3)$：代入 $-\frac{2}{3}+\frac{3}{2}\cdot2=\frac{7}{3}$ ✓。这也是另一条的几何意义：残差与时刻列正交，意味着拟合直线"摆动"后的加权平均仍落在重心上。

> [!tip] 为什么"直线拟合"总好算
> $A$ 的两列是 $\mathbf{1}$（全 1）与 $\mathbf{t}$（时刻），$A^TA=\begin{bmatrix}m&\sum t_i\\ \sum t_i&\sum t_i^2\end{bmatrix}$ 的结构与数据无关，只取决于 $m$ 和 $t$ 的分布——所以任何"直线拟合"都只需算四个和：$m,\sum t,\sum t^2,\sum b,\sum tb$。高中课本里的最小二乘公式（$D=\frac{m\sum tb-\sum t\sum b}{m\sum t^2-(\sum t)^2}$）就是从这条法方程解出来的。

> [!warning] "拟合"不是"内插"
> 若强行要求直线同时穿过三个点，方程组无解——最小二乘退回来的代价是**允许每个点都有一点误差**（这里最大 $1/3$）。数据点越多、模型越"瘦"，这个误差就越有"统计意义"；反之数据点太少（$m=n$）时最小二乘就退化成精确插值，误差为零但毫无"平滑"作用。

## A各列线性相关时，x̂ 是什么

前面的公式都假设 $A$ 列无关。若 $A$ 的列**相关**（有冗余参数/重复测量），$A^TA$ 奇异，法方程有无穷多解。此时有三件事要分清：

1. **$\hat{\mathbf{x}}$ 不唯一**：解集是 $\hat{\mathbf{x}}=\hat{\mathbf{x}}_{p}+\mathbf{x}_{n}$，$\mathbf{x}_n\in\mathbf{N}(A^TA)=\mathbf{N}(A)$——正是 3.3 的"全解结构"，一字不差。
2. **但投影点 $\mathbf{p}=A\hat{\mathbf{x}}$ 仍然唯一**！因为 $\mathbf{N}(A)$ 里的分量被 $A$ 压成 $\mathbf{0}$：$A(\hat{\mathbf{x}}_p+\mathbf{x}_n)=A\hat{\mathbf{x}}_p$。"不同的参数、同样的拟合曲线"——这是"参数不可辨识"的代数本质。
3. **要挑一个的话，挑范数最小的那个**：$\|\hat{\mathbf{x}}\|$ 最小的解（**最小范数解**，minimum-norm solution）落在行空间 $\mathbf{C}(A^T)$ 里，由**伪逆**给出。

**最简单的例子**：$A$ 两列相同（秩 1），三个方程一个"独立方程"：

$$
A=\begin{bmatrix}1&1\\1&1\\1&1\end{bmatrix},\qquad \mathbf{b}=\begin{bmatrix}1\\2\\3\end{bmatrix}
$$

$$
A^TA=\begin{bmatrix}3&3\\3&3\end{bmatrix}\ \text{（奇异）},\qquad A^T\mathbf{b}=\begin{bmatrix}6\\6\end{bmatrix}
\quad\Longrightarrow\quad 3x_1+3x_2=6\ \Longrightarrow\ x_1+x_2=2
$$

解集是直线 $x_1+x_2=2$，但每个解都给出同一个投影：

$$
\mathbf{p}=A\hat{\mathbf{x}}=(x_1+x_2)\begin{bmatrix}1\\1\\1\end{bmatrix}=\begin{bmatrix}2\\2\\2\end{bmatrix}\quad\text{（唯一）},\qquad
\mathbf{e}=\begin{bmatrix}-1\\0\\1\end{bmatrix}\ \ (\mathbf{e}\cdot\mathbf{1}=0\ \checkmark)
$$

最小范数解是两列"平分秋色"那一个：$\hat{\mathbf{x}}=(1,1)$（因为 $x_1+x_2=2$ 上离原点最近的点是 $(1,1)$，它恰好在 $\mathbf{C}(A^T)=\operatorname{span}\{(1,1)\}$ 里）。

> [!tip] 伪逆：秩亏时的统一答案
> 第 7 章会给出**伪逆**（pseudoinverse）$A^{+}$（Moore-Penrose 伪逆），它一次性解决所有情形——包括**秩亏**（rank deficient，即列相关）的时候：
> $$\hat{\mathbf{x}}=A^{+}\mathbf{b},\qquad P=AA^{+}\qquad\text{（列满秩时 }A^{+}=(A^TA)^{-1}A^T\text{）}$$
> 源码里的 `pinv(A)*b`、`np.linalg.lstsq`、MATLAB 的 `A\b` 在检测到列相关时**自动切到伪逆路径**，给出的正是最小范数解。
> 这也解释了为什么"秩亏时不要随便挑一个解手工报出去"：**只有最小范数解才不依赖"你挑了哪一组自由变量"**，才具有可复现的工程意义。

## 用抛物线拟合

把模型从"直线"换成"抛物线"（parabola）$b=C_1+C_2t+C_3t^2$，方程组的"高瘦"程度立刻加剧（$m$ 个点、3 个未知数）。取四个点 $(t,b)=(0,1),(1,2),(2,5),(3,8)$：

$$
A=\begin{bmatrix}1&0&0\\1&1&1\\1&2&4\\1&3&9\end{bmatrix},\qquad \mathbf{b}=\begin{bmatrix}1\\2\\5\\8\end{bmatrix}
$$

$$
A^TA=\begin{bmatrix}4&6&14\\6&14&36\\14&36&98\end{bmatrix},\qquad A^T\mathbf{b}=\begin{bmatrix}16\\36\\94\end{bmatrix}
$$

解这组法方程（消元三步即可）：

$$
\begin{cases}4C_1+6C_2+14C_3=16\\6C_1+14C_2+36C_3=36\\14C_1+36C_2+98C_3=94\end{cases}
\quad\Longrightarrow\quad
C_1=0.9,\quad C_2=0.9,\quad C_3=0.5
$$

$$
\text{最佳抛物线：}\quad b=0.9+0.9t+0.5t^2
$$

| $t$ | $b$（测量） | $p$（拟合） | $e=b-p$ |
| --- | --- | --- | --- |
| 0 | 1 | 0.9 | $+0.1$ |
| 1 | 2 | 2.3 | $-0.3$ |
| 2 | 5 | 4.7 | $+0.3$ |
| 3 | 8 | 8.1 | $-0.1$ |

误差向量 $\mathbf{e}=(0.1,-0.3,0.3,-0.1)$ 与三列全部正交：

$$
\mathbf{e}\cdot\mathbf{1}=0,\qquad \mathbf{e}\cdot\mathbf{t}=-0.3+0.6-0.3=0,\qquad \mathbf{e}\cdot\mathbf{t}^2=-0.3+1.2-0.9=0\quad\checkmark
$$

$$
\|\mathbf{e}\|^2=0.01+0.09+0.09+0.01=0.2
$$

> [!warning] 高次拟合的三个陷阱
> 1. **外推危险**：在 $t=0\sim3$ 上贴合的抛物线，到了 $t=10$ 会给出 $59.9$ ——多项式外推几乎总是错的（通信里表现为"信道模型外推失效"）。
> 2. **病态加剧**：列是 $\mathbf{1},\mathbf{t},\mathbf{t}^2,\dots$，它们的"相似程度"随次数上升，$A^TA$ 的条件数爆炸式增长。次数越高，$\hat{\mathbf{x}}$ 越不可信——**这正是必须换 4.4 的 QR 的理由**。
> 3. **别用高阶拟合"造数据"**：$m$ 个数据点最多只能可靠确定约 $\sqrt{m}$ 个参数（工程经验），再多就是"用噪声拟合噪声"（**过拟合**，overfitting）。

# 4.4 标准正交基与格拉姆-施密特方法

## 利用标准正交基投影：Q取代A

回到 4.2 的公式 $\hat{\mathbf{x}}=(A^TA)^{-1}A^T\mathbf{b}$，全部麻烦都出在那个**逆**上。如果 $A$ 的列本来就互相垂直、长度还是 1，$A^TA$ 会退化成单位阵，逆就不见了。

> [!info] Def 7 标准正交向量组与标准正交基
> 向量组 $\mathbf{q}_1,\dots,\mathbf{q}_n$ 满足
> $$\mathbf{q}_i^T\mathbf{q}_j=\begin{cases}0,&i\ne j\\1,&i=j\end{cases}$$
> （即两两正交 + 每个长度都是 1），称**标准正交**（orthonormal）。若它们还能张成空间 $S$，就称 $S$ 的一组**标准正交基**。

> [!info] Def 8 正交矩阵
> 列向量构成标准正交组的**方阵** $Q$ 称为**正交矩阵**（orthogonal matrix），等价说法：
> $$Q^TQ=I\quad\Longleftrightarrow\quad Q^T=Q^{-1}\quad\Longleftrightarrow\quad Q^{-1}\text{ 白送}$$
> $Q^TQ=I$ 的每一行就是一个点积：第 $i$ 行乘第 $j$ 列 = $\mathbf{q}_i^T\mathbf{q}_j=\delta_{ij}$。

> [!tip] 定理 正交矩阵保长、保内积、保数值
> $$\|Q\mathbf{x}\|=\|\mathbf{x}\|,\qquad (Q\mathbf{x})^T(Q\mathbf{y})=\mathbf{x}^T\mathbf{y}\qquad\text{对一切 }\mathbf{x},\mathbf{y}$$
> 证明只用 $Q^TQ=I$：$\|Q\mathbf{x}\|^2=\mathbf{x}^TQ^TQ\mathbf{x}=\mathbf{x}^T\mathbf{x}$。
> 工程含义：正交变换**不放大误差**（相对误差不增长），条件数为 1 ——**数值上最安全的矩阵**。旋转、反射都是它的几何化身（长度当然不变！）。

**$Q$ 取代 $A$ 之后的三个简化**（对照 4.2 的公式）：

| 问题 | 一般 $A$ | 标准正交的 $Q$ |
| --- | --- | --- |
| 投影系数 | $\hat{\mathbf{x}}=(A^TA)^{-1}A^T\mathbf{b}$ | $\hat{\mathbf{x}}=Q^T\mathbf{b}$（**逐项点积，不需要解方程**） |
| 投影向量 | $\mathbf{p}=A(A^TA)^{-1}A^T\mathbf{b}$ | $\mathbf{p}=QQ^T\mathbf{b}$ |
| 投影矩阵 | $P=A(A^TA)^{-1}A^T$ | $P=QQ^T$ |

> [!tip] $\hat{\mathbf{x}}=Q^T\mathbf{b}$ 的直白含义
> 写成分量就是 $\hat x_i=\mathbf{q}_i^T\mathbf{b}$——**每个系数就是 $\mathbf{b}$ 在该方向上的投影长度**（$\mathbf{b}\cdot\mathbf{q}_i$）。正交的好处就是"各方向互不干扰"，求第 $i$ 个系数时完全不必知道别的系数，也不需要解联立方程。
> 若 $Q$ 是方阵（$n$ 个标准正交列张满整个 $\mathbb{R}^n$），则 $\mathbf{b}$ 本来就在列空间里，投影是它自己：$P=QQ^T=I$、$\mathbf{p}=\mathbf{b}$、$\mathbf{e}=\mathbf{0}$。

> [!warning] 矩形 $Q$ 的陷阱
> 当 $m>n$（列数少于行数，这正是"高瘦"的最小二乘场景）时，$Q$ 是**矩形**的：
> $$Q^TQ=I_n\quad\text{但}\quad QQ^T\ne I_m$$
> $QQ^T$ 是 $\mathbb{R}^m$ 上的投影矩阵（投向 $Q$ 的 $n$ 维列空间），秩为 $n$，绝不是单位阵。**只有方阵才享有 $Q^{-1}=Q^T$**。

**正交矩阵的例子**（都能在通信里找到位置）：

| 矩阵 | 形式 | 通信中的亲戚 |
| --- | --- | --- |
| 置换矩阵（permutation matrix）$P$ | 每行每列一个 1 | 交织、打孔（第 2 章老朋友） |
| 旋转/反射 | $\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$、$I-2\mathbf{v}\mathbf{v}^T/\mathbf{v}^T\mathbf{v}$ | 星座图旋转、Householder 变换（数值 QR 的主力） |
| 哈达玛矩阵（Hadamard matrix） | $\frac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}$，递推构造 $H_{2n}=\begin{bmatrix}H_n&H_n\\H_n&-H_n\end{bmatrix}$ | 沃尔什/正交码、快速变换（[[vault-notes/communication/12-orthogonal-codes-pn-sequences]]） |
| 傅里叶矩阵（Fourier matrix） | $\frac{1}{\sqrt n}F$，$(F)_{kj}=\omega^{kj}$，$\omega=e^{-j2\pi/n}$ | **OFDM 的正交性**就在这里（第 9 章复向量、[[vault-notes/5g/phy/04-physical-channels-signals]]） |

> [!note] 通信方向：OFDM 的"正交"是内积为零
> OFDM 各子载波 $e^{j2\pi kt/T}$ 两两正交（不同频率的正弦在一个周期上的内积为零），所以子载波互不干扰、接收端能"逐项点积"分离——**这正是 $Q^T$ 在做的事**。
> 频谱正交、码字正交、天线正交（MIMO 预编码）在数学上是同一个动作：**选一组互相正交的向量当基**，让"解调/检测"退化成一次点积。

## 格拉姆-施密特方法

问题是：**给定了无关的 $\mathbf{a},\mathbf{b},\mathbf{c}$，怎么造出一组标准正交基 $\mathbf{q}_1,\mathbf{q}_2,\mathbf{q}_3$，而且张成的空间逐次不变？**

**格拉姆-施密特方法**（Gram-Schmidt process）的策略一句话就能说完：**从每个新向量里，减掉它在已有方向上的全部投影；剩下的那一截必然垂直于已有方向。** 平方即得标准正交。

$$
\begin{aligned}
A_1&=\mathbf{a},&&\mathbf{q}_1=A_1/\|A_1\|\\
A_2&=\mathbf{b}-(\mathbf{q}_1^T\mathbf{b})\mathbf{q}_1,&&\mathbf{q}_2=A_2/\|A_2\|\\
A_3&=\mathbf{c}-(\mathbf{q}_1^T\mathbf{c})\mathbf{q}_1-(\mathbf{q}_2^T\mathbf{c})\mathbf{q}_2,&&\mathbf{q}_3=A_3/\|A_3\|
\end{aligned}
$$

（用 $\mathbf{q}_i$ 算投影、或者用还没归一化的 $A_i$ 算投影（$(\mathbf{q}_i^T \mathbf{v})\mathbf{q}_i$ 与 $\frac{A_i^T\mathbf{v}}{A_i^TA_i}A_i$ 等价），结果一样。）

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" width="100%" style="max-width:700px" font-family="inherit">
  <defs>
    <marker id="la4-gsa" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la4-gsb" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
    <marker id="la4-gsB" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#059669"/>
    </marker>
  </defs>

  <!-- a 方向线 -->
  <line x1="140" y1="264" x2="620" y2="109" stroke="#4f46e5" stroke-width="1.3" stroke-opacity="0.5"/>
  <!-- a -->
  <line x1="220" y1="250" x2="580" y2="130" stroke="#4f46e5" stroke-width="2.6" marker-end="url(#la4-gsa)"/>
  <text x="592" y="126" font-size="13" font-weight="700" fill="#4f46e5">a</text>

  <!-- 投影 (q1^T b) q1 -->
  <line x1="220" y1="250" x2="418" y2="184" stroke="#059669" stroke-width="1.8" stroke-dasharray="6 4"/>
  <text x="330" y="238" text-anchor="middle" font-size="12" font-weight="600" fill="#059669">(q₁ᵀb) q₁</text>

  <!-- b -->
  <line x1="220" y1="250" x2="456" y2="298" stroke="#db2777" stroke-width="2.4" marker-end="url(#la4-gsb)"/>
  <text x="466" y="310" font-size="13" font-weight="700" fill="#db2777">b</text>

  <!-- b - 投影 -->
  <line x1="418" y1="184" x2="456" y2="298" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="6 4"/>
  <line x1="466" y1="240" x2="440" y2="237" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <text x="470" y="244" font-size="12" font-weight="600" fill="#dc2626">b − (q₁ᵀb)q₁</text>

  <!-- B -->
  <line x1="220" y1="250" x2="258" y2="364" stroke="#059669" stroke-width="2.8" marker-end="url(#la4-gsB)"/>
  <text x="268" y="376" font-size="12.5" font-weight="700" fill="#059669">B = b − (q₁ᵀb)q₁ ⊥ a</text>

  <!-- 直角标记 -->
  <path d="M432,179 L437,193 L423,198" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <circle cx="418" cy="184" r="4" fill="#059669"/>
  <circle cx="220" cy="250" r="3.5" fill="var(--text-normal,#1f2328)"/>

  <text x="350" y="392" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">减掉投影 ⇒ 剩下的 B 与 a 正交；再除以 ‖B‖ ⇒ 得到 q₂</text>
</svg>

**Strang 经典例子**：$\mathbf{a}=(1,-1,0)$、$\mathbf{b}=(1,0,-1)$、$\mathbf{c}=(1,1,1)$。

$$
A_1=(1,-1,0),\quad \|A_1\|=\sqrt2,\quad \mathbf{q}_1=\frac{1}{\sqrt2}\begin{bmatrix}1\\-1\\0\end{bmatrix}
$$

$$
A_2=\mathbf{b}-(\mathbf{q}_1^T\mathbf{b})\mathbf{q}_1=(1,0,-1)-\frac{1}{2}(1,-1,0)=\left(\frac12,\frac12,-1\right),\quad \|A_2\|=\sqrt{\frac32}
$$

$$
\mathbf{q}_2=\sqrt{\frac23}\left(\frac12,\frac12,-1\right)=\frac{1}{\sqrt6}\begin{bmatrix}1\\1\\-2\end{bmatrix}
$$

第三个向量最有意思：$\mathbf{c}=(1,1,1)$ 与 $\mathbf{a}$、$\mathbf{b}$ **本来就正交**（$\mathbf{a}^T\mathbf{c}=1-1+0=0$，$\mathbf{b}^T\mathbf{c}=1+0-1=0$），所以两次投影都减掉 0：

$$
A_3=\mathbf{c}-0-0=(1,1,1),\quad \|A_3\|=\sqrt3,\quad \mathbf{q}_3=\frac{1}{\sqrt3}\begin{bmatrix}1\\1\\1\end{bmatrix}
$$

于是

$$
Q=\begin{bmatrix}1/\sqrt2&1/\sqrt6&1/\sqrt3\\-1/\sqrt2&1/\sqrt6&1/\sqrt3\\0&-2/\sqrt6&1/\sqrt3\end{bmatrix}
$$

> [!warning] 两个常见误解
> 1. **"减掉 0"不代表出错**：投影为零恰恰说明新向量本来就与既有方向正交（$\mathbf{c}$ 就是这种情况），算法没有失效。
> 2. **经典 Gram-Schmidt 在计算机上会丢正交性**：当向量接近相关时，浮点舍入会让 $\mathbf{q}_i^T\mathbf{q}_j$ 不再是精确的 0，而且**误差会累积**。数值实践用**修正 Gram-Schmidt**（modified Gram-Schmidt，简称 MGS；每得到一个 $\mathbf{q}_i$ 就立刻从剩下的向量里再减一次它的投影），或者干脆改用 **Householder 变换**。手算用手算版，代码用修正版。

## 分解式 A=QR

把 Gram-Schmidt 的过程"记成账本"，就是**矩阵分解**——和 $A=LU$ 记录消元是同一个套路。

注意 Gram-Schmidt 出来的三个向量天然满足"逐次包含"：

$$
\mathbf{a}\in\operatorname{span}\{\mathbf{q}_1\},\qquad
\mathbf{b}\in\operatorname{span}\{\mathbf{q}_1,\mathbf{q}_2\},\qquad
\mathbf{c}\in\operatorname{span}\{\mathbf{q}_1,\mathbf{q}_2,\mathbf{q}_3\}
$$

这个"第 $i$ 列只用到前 $i$ 个 $\mathbf{q}$"的阶梯结构，正是**上三角**的形状。

> [!info] Def 9 QR 分解
> 对列无关的 $m\times n$ 矩阵 $A$，**QR 分解**（QR factorization）是：
> $$A=QR$$
> 其中 $Q$ 是 $m\times n$、列为标准正交；$R$ 是 $n\times n$ **上三角**且对角元为正。
> 取 $R=Q^TA$ 即可验证（$Q^TQ=I$ 使 $QR=Q(Q^TA)=A$ ✓）；对角元 $r_{ii}=\mathbf{q}_i^T\mathbf{a}_i=\|A_i\|$，正是 Gram-Schmidt 里"剩下那一截的长度"。

上面那个例子（$A$ 的三列就是 $\mathbf{a},\mathbf{b},\mathbf{c}$）的 $R$：

$$
R=Q^TA=\begin{bmatrix}\sqrt2&1/\sqrt2&0\\0&\sqrt{3/2}&0\\0&0&\sqrt3\end{bmatrix}
$$

> [!tip] R 的对角元在说什么
> $r_{11}=\sqrt2$、$r_{22}=\sqrt{3/2}$、$r_{33}=\sqrt3$ 分别是三步里"**新向量去掉旧方向后剩下的长度**"。
> - 若某个对角元为 0，说明这一步**没有新方向**——原来的向量组相关（这也是"列无关 ⟺ $R$ 可逆"的来源）；
> - 对角元越大，说明该列带来的"新信息"越多。$R$ 可以读成"$A$ 各列的信息结构表"。

**用 QR 做最小二乘（工程正解）**：把 $A=QR$ 代进法方程

$$
A^TA\hat{\mathbf{x}}=A^T\mathbf{b}\ \Longrightarrow\ R^TQ^TQR\hat{\mathbf{x}}=R^TQ^T\mathbf{b}\ \Longrightarrow\ \boxed{\ R\hat{\mathbf{x}}=Q^T\mathbf{b}\ }
$$

（两边约掉可逆的 $R^T$。）右边是一次矩阵乘向量，左边是上三角——**回代两步就完事，全程不碰 $A^TA$，不碰逆**。这就是"QR 分解比法方程好"的全部内容。

| 求最小二乘的三种路子 | 做法 | 代价 | 数值稳定性 |
| --- | --- | --- | --- |
| 法方程 | 组 $A^TA$ 再解 $n\times n$ 方程 | 最便宜 | 差：条件数平方 |
| **QR** | $A=QR$，回代 $R\hat{\mathbf{x}}=Q^T\mathbf{b}$ | 中等 | **好（默认选择）** |
| SVD / 伪逆 | $\hat{\mathbf{x}}=V\Sigma^{+}U^T\mathbf{b}$ | 最贵 | 最好，且列相关也不怕 |

> [!tip] 本章收官
> 第 4 章的四节其实是一条线：
> 1. **正交补**（4.1）告诉我们 $\mathbb{R}^n$、$\mathbb{R}^m$ 各自内部怎么"劈成两半"；
> 2. **投影**（4.2）给出了"最短距离"的答案——垂足；
> 3. **最小二乘**（4.3）把垂足翻译成方程 $A^TA\hat{\mathbf{x}}=A^T\mathbf{b}$，于是"最佳逼近"变成"解方程"；
> 4. **标准正交基**（4.4）把公式里的逆消掉（$Q^T$ 取代 $(A^TA)^{-1}A^T$），让它在计算机上又快又稳。
>
> 一句话：**正交性是"最佳近似"的语言，投影是它的算法，最小二乘是它的工程出口。**

## 本章知识地图

```
正交性：从"垂直"到"最佳近似"
  ├─ 4.1 四个子空间的正交性
  │      ├── 定义层：v·w = 0 → 正交子空间 → 正交补 V^⊥
  │      ├── 定理层（基本定理第二部分）
  │      │      ├── N(A)  = C(A^T)^⊥     （R^n：r + (n−r) = n）
  │      │      └── N(A^T) = C(A)^⊥      （R^m：r + (m−r) = m）
  │      ├── 全局图：A 把行空间一一送到列空间，把零空间压成 0
  │      ├── 唯一分解 x = x_row + x_null（A 看不见零空间分量）
  │      └── 合并基：行空间基 + 零空间基 = R^n 的基（列空间同理）
  │
  ├─ 4.2 投影
  │      ├── 到直线：t = a^T b / a^T a；P = a a^T / a^T a（秩 1）
  │      └── 到子空间：A^T A x̂ = A^T b；P = A(A^T A)^{-1} A^T
  │             ├── P² = P、P^T = P；I − P 投向正交补
  │             └── rank(P) = tr(P) = dim（子空间维数）
  │
  ├─ 4.3 最小二乘
  │      ├── 三等价：A^T A x̂ = A^T b ⟺ A^T(b − A x̂) = 0 ⟺ e ∈ N(A^T)
  │      ├── 全局图：b = p + e，p ∈ C(A)，e ∈ N(A^T)，‖b‖² = ‖p‖² + ‖e‖²
  │      ├── A^T A 可逆 ⟺ A 的列无关；否则取最小范数解（伪逆）
  │      ├── 直线拟合：过重心、残差和为 0
  │      └── 抛物线拟合：高次拟合病态 ⇒ 必须换 QR/SVD
  │
  └─ 4.4 标准正交基与 Gram-Schmidt
         ├── Q 取代 A：x̂ = Q^T b，p = Q Q^T b（不求逆）
         ├── 正交矩阵：Q^T Q = I，保长保内积、条件数 1
         ├── Gram-Schmidt：逐个减投影 → q₁, q₂, q₃（数值上要用修正版）
         └── A = QR：Q 存方向，R 存"新信息量"；R x̂ = Q^T b 回代
```

## 关联

- 上一章：[[vault-notes/math/linear-algebra/03-vector-spaces-subspaces]]
- 下一章：[[vault-notes/math/linear-algebra/05-determinants]]

**本章与第 3 章的接口**（读第 3 章时留下的三个悬念在这里全部结清）：

| 第 3 章的悬念 | 第 4 章的答案 |
| --- | --- |
| "行空间 ⊥ 零空间"只是观察，为什么？ | 它就是**正交补**（4.1）：维数相加正好填满，交集只有零 |
| "有解第三判据 $\mathbf{b}\in\mathbf{C}(A)\iff\mathbf{b}\perp\mathbf{N}(A^T)$"哪来的？ | 它是 4.1 基本定理的直接改写，4.3 又把它解释成 $\mathbf{e}=\mathbf{0}$ |
| 秩一矩阵的四子空间为什么那么整齐？ | 秩一矩阵是"正交补"的最小实验台（4.1 合并基） |

**通信方向应用**：

- [[vault-notes/communication/09-optimal-reception]] —— **相关接收机就是一台投影机**：把接收信号 $\mathbf{r}$ 逐个与基函数 $\mathbf{s}_m(t)$ 做内积，得到的判决统计量正是"$\mathbf{r}$ 在该方向上的投影系数 $\mathbf{q}^T\mathbf{r}$"；信号空间的**标准正交基**由 Gram-Schmidt 从 $\{s_1,\dots,s_M\}$ 造出（4.4）；最优判决的几何图像——用"垂直平分超平面"切分信号空间——本质上就是本章的垂直关系。而"最小二乘的残差与观测正交"这条**正交性原理**，正是相干解调最优性的代数骨架。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— MIMO/OFDM 里本章几乎是逐条对应：**最小二乘信道估计**解的就是 $A^TA\hat{\mathbf{x}}=A^T\mathbf{b}$（导频位置的 LS 估计），工程实现走 QR/SVD 而不是法方程；**干扰归零**（nulling）是把接收权向量压进干扰信道的**左零空间**，也就是"投影到正交补"；**预编码**等价于给发射数据挑一组好基；而"OFDM 子载波正交"就是内积为零，接收端分离子载波 = 一次 $\mathbf{q}_i^T$ 点积。
- [[vault-notes/communication/12-orthogonal-codes-pn-sequences]] —— 正交码族 = 互相正交的向量集合（$\mathbf{q}_i^T\mathbf{q}_j=0$）；哈达玛矩阵的行/列天然构成 $\mathbb{F}^n$ 的一组**标准正交基**（缩放 $1/\sqrt n$ 后就是正交矩阵），这解释了它为什么能用来做快速变换；扩频、多用户检测里的"码间正交"是本章最直接的工程投影。
- [[vault-notes/math/linear-algebra/07-singular-value-decomposition]] —— 本章收尾时说的"SVD 给四个子空间各配一组标准正交基"在第 7 章兑现：$A=U\Sigma V^T$ 中，$U$ 的列是列空间与左零空间的标准正交基，$V$ 的列是行空间与零空间的标准正交基，$\sigma$ 是各方向的"拉伸倍数"。**秩亏时的最小范数解 $\hat{\mathbf{x}}=A^{+}\mathbf{b}$ 也由 SVD 给出**（伪逆），伪逆同时统一了"列满秩"与"列相关"两种情形。
- [[vault-notes/math/linear-algebra/02-solving-linear-systems]] —— $P=A(A^TA)^{-1}A^T$ 是"求逆的代价"最好的教材：**要先解方程，不要先求逆**；而 $A=QR$ 与 $A=LU$ 是同一思想（"一次分解，多次求解"）在不同场景的落地——$LU$ 服务方阵求解，$QR$ 服务高瘦最小二乘。
- [[vault-notes/math/linear-algebra/01-vector-introduction]] —— 1.2 的"$\mathbf{v}\cdot\mathbf{w}=\|\mathbf{v}\|\|\mathbf{w}\|\cos\theta$"在这里终于派上大用场：投影长度 $=\|\mathbf{b}\|\cos\theta=\mathbf{a}^T\mathbf{b}/\|\mathbf{a}\|$，本章的一切从这条几何直觉长出来。

**相关**：[[vault-notes/math/linear-algebra/03-vector-spaces-subspaces]]｜[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]
