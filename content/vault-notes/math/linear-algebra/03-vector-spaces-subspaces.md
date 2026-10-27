---
title: "向量空间与子空间"
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
> 第 1 章学会了"**组合**"，第 2 章学会了"**计算**"。第 3 章换上第三个动词：**描述**——$A\mathbf{x}=\mathbf{b}$ 的答案到底住在一个什么样的集合里？这个集合有多大？
>
> - **3.1** 向量空间与子空间：能"关起门来做组合"的集合；主角登场之一——**列空间**
> - **3.2** 零空间与秩：$A\mathbf{x}=\mathbf{0}$ 的全部解构成子空间；消元把它的"骨架"（特殊解）挖出来；顺便定义**秩**
> - **3.3** 全解 = 特解 + 零空间：一张图看懂所有解的形状（平行直线/平面）
> - **3.4** 无关、基、维数：描述空间的词汇——"骨架"有多长？几根？
> - **3.5** 四个子空间大定理：$r$、$n-r$、$r$、$m-r$ 一把清零，线性代数的"元素周期表"
>
> 一句话主线：**方程组的解集不是一盘散沙，而是有结构的空间；结构由三个数决定——m、n、r。**

> [!note] 记号约定
> - $\mathbf{C}(A)$：列空间（Column space），在 $\mathbb{R}^m$ 中；$\mathbf{N}(A)$：零空间（Nullspace），在 $\mathbb{R}^n$ 中
> - $\mathbf{C}(A^T)$：行空间（row space，A 的行的所有组合）；$\mathbf{N}(A^T)$：左零空间（left nullspace）
> - $r=\operatorname{rank}(A)$：秩；$n-r$：自由变量的个数
> - $R$：行最简形矩阵（Reduced Row Echelon Form，RREF）

# 3.1 向量空间

## 什么是向量空间

> [!info] Def 1 向量空间
> 一个**向量空间**（vector space）是这样的集合：只要 $\mathbf{v}$、$\mathbf{w}$ 在里面，它们的**任何线性组合** $c\mathbf{v}+d\mathbf{w}$ 也一定在里面。
> 通俗版：**"关起门来随便组合，永远不出门"** 的集合。

| 例子 | 说明 |
| --- | --- |
| $\mathbb{R}^2$、$\mathbb{R}^3$、$\mathbb{R}^n$ | 全部 $n$ 维实向量 |
| $M$（所有 $2\times2$ 矩阵） | 矩阵也是"向量"——加法和数乘照样封闭 |
| 所有上三角矩阵 / 所有对称矩阵 | 组合之后形状不变，各自成"空间" |
| $\mathbb{F}^2=\{(0,0),(0,1),(1,0),(1,1)\}$ | 模 2 的二进制向量空间——**数字通信的老家** |
| $P_2$（所有抛物线 $a+bt+ct^2$） | 函数也是"向量"（3.4 展开） |

> [!warning] 不是空间的例子
> - $\mathbb{R}^2$ 的**第一象限**（$x\ge0,y\ge0$）：$c=-1$ 时就出界了——数乘不封闭。
> - 平面上一条**不过原点的直线**：它不含零向量；而且平移不封闭。
> - 一张**单位圆**：两个圆上向量相加，结果一般不在圆上。

## 子空间

> [!info] Def 2 子空间
> 向量空间内部的子集 $S$ 是**子空间**（subspace），当且仅当：
> 1. $S$ 包含零向量 $\mathbf{0}$；
> 2. $S$ 对线性组合封闭（"关起门来"条件）。
>
> 实际操作中先查"含 0"，再过"组合"关——**过原点 = 子空间的第一道硬门槛**。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 300" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la3-ax" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <!-- 左：过原点 -->
  <text x="210" y="28" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">过原点：是子空间 ✓</text>
  <rect x="60" y="46" width="300" height="210" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
  <line x1="85" y1="200" x2="345" y2="200" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la3-ax)"/>
  <line x1="150" y1="250" x2="150" y2="62" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la3-ax)"/>
  <line x1="90" y1="250" x2="230" y2="80" stroke="#4f46e5" stroke-width="2"/>
  <circle cx="150" cy="200" r="3.5" fill="var(--text-normal,#1f2328)"/>
  <text x="158" y="215" font-size="12" fill="var(--text-muted,#57606a)">0</text>
  <text x="238" y="84" font-size="12.5" font-weight="600" fill="#4f46e5">过原点</text>
  <text x="210" y="243" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">含 0，组合不出门 → 合格的直线子空间</text>

  <!-- 右：不过原点 -->
  <text x="630" y="28" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">不过原点：不是子空间 ✗</text>
  <rect x="480" y="46" width="300" height="210" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
  <line x1="505" y1="200" x2="765" y2="200" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la3-ax)"/>
  <line x1="570" y1="250" x2="570" y2="62" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la3-ax)"/>
  <line x1="510" y1="250" x2="650" y2="80" stroke="#dc2626" stroke-width="2" stroke-dasharray="6 4"/>
  <circle cx="570" cy="200" r="3.5" fill="var(--text-normal,#1f2328)"/>
  <circle cx="570" cy="140" r="3" fill="#dc2626"/>
  <text x="578" y="136" font-size="11.5" fill="#dc2626">(0,1)</text>
  <text x="545" y="215" font-size="12" fill="var(--text-muted,#57606a)">0</text>
  <text x="658" y="84" font-size="12.5" font-weight="600" fill="#dc2626">不过原点</text>
  <text x="630" y="243" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">缺了 0 → 再"平移一格"它才是子空间</text>

  <text x="420" y="288" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">R³ 的子空间只有四级：一个点 0、过原点的直线、过原点的平面、整个 R³</text>
</svg>

> [!tip] 子空间的两条操作性质
> - **交**：两个子空间的交集 $S\cap T$ 仍是子空间（0 在两者中，组合封闭性各自成立）。
> - **并**：两个子空间的并 $S\cup T$ **通常不是**子空间——一条直线加另一条直线，取各自一个向量相加就"飞"出并集。
> 这条"交可以、并不行"的规则将在第 4 章反复出现。

> [!note] F²：最小的有限域空间
> 只有 4 个向量的 $\mathbb{F}^2=\{00,01,10,11\}$，加法是模 2 加法（$1+1=0$）。
> 它的子空间：$\{00\}$、三条过原点的"二元直线"（$\{00,01\}$、$\{00,10\}$、$\{00,11\}$）、以及 $\mathbb{F}^2$ 本身——一共 5 个。
> 别小看这个四元素世界：它正是线性分组码（[[vault-notes/communication/11-error-control-coding]]）的舞台，$\mathbb{F}^n$ 上的子空间就是"码字集合"。

## A的列空间

> [!info] Def 3 列空间
> 矩阵 $A$ 的所有列的**一切线性组合**组成的集合，记作 $\mathbf{C}(A)$（column space）。
> 由于 $A\mathbf{x}=x_1\mathbf{a}_1+\cdots+x_n\mathbf{a}_n$，它也可以说是"**所有可能的 $A\mathbf{x}$ 的集合**"。
> 形状注意：$A$ 是 $m\times n$ 时，$\mathbf{C}(A)$ 住在 $\mathbb{R}^m$ 里——**行数决定列空间的"房间"**。

为什么 $\mathbf{C}(A)$ 是子空间？两个组合相加就是"合并同类项"：$A\mathbf{x}+A\mathbf{y}=A(\mathbf{x}+\mathbf{y})$——组合永远在空间内。

> [!tip] 第 1、2 章问题的最终答案
> $$A\mathbf{x}=\mathbf{b}\ \text{有解}\quad\iff\quad \mathbf{b}\in\mathbf{C}(A)$$
> "b 是不是列的组合"（第 1 章）与"方程组有没有解"（第 2 章）在空间语言里合成了同一句话。从此判断有解性不再需要动笔算，只需要问：**b 落没落在列空间里**。

**例子（Strang 经典 4×3 矩阵）**：

$$
A=\begin{bmatrix}1&1&2\\2&1&3\\3&1&4\\4&1&5\end{bmatrix},\qquad
\mathbf{a}_1=\begin{bmatrix}1\\2\\3\\4\end{bmatrix},\ 
\mathbf{a}_2=\begin{bmatrix}1\\1\\1\\1\end{bmatrix},\ 
\mathbf{a}_3=\begin{bmatrix}2\\3\\4\\5\end{bmatrix}
$$

第一眼请注意几何直觉：$\mathbf{a}_1$ 按步爬楼梯，$\mathbf{a}_2$ 平铺，$\mathbf{a}_3=\mathbf{a}_1+\mathbf{a}_2$——第三列是多余的，真正独立的只有两列：

$$
\mathbf{C}(A)=\{c_1\mathbf{a}_1+c_2\mathbf{a}_2\}=\mathbb{R}^4\ \text{中一个二维平面}
$$

这个平面的方程是什么？观察行列规律 $b_1+b_4=b_2+b_3$ 对三列都成立（$1+4=2+3$，$1+1=1+1$，$2+5=3+4$），所以

$$
\mathbf{b}=\begin{bmatrix}b_1\\b_2\\b_3\\b_4\end{bmatrix}\in\mathbf{C}(A)\quad\iff\quad b_1+b_4=b_2+b_3
$$

**验证一组有解的 b**：取 $\mathbf{b}=(1,2,3,4)$，检查 $1+4=2+3\ \checkmark$。解出系数：$x=(1-t,\,-t,\,t)$ 对任意 $t$ 都成立——

$$
(1-t)\mathbf{a}_1+(-t)\mathbf{a}_2+t\mathbf{a}_3=\mathbf{a}_1+t(\mathbf{a}_3-\mathbf{a}_1-\mathbf{a}_2)=\mathbf{a}_1=(1,2,3,4)\ \checkmark
$$

> [!warning] 列空间的三个易错点
> 1. **列空间依赖的是"列"**：转置一下，房间都换了——$\mathbf{C}(A)$ 在 $\mathbb{R}^m$，"列空间"与"行空间"是完全不同的空间（3.5 见分晓）。
> 2. **解有无穷多个，但 b 只有一个**：系数 $t$ 自由变化（零空间在背后捣鬼），这不影响 $b$ 住在列空间这件事。
> 3. **"b 在列空间"= 有解**，与"解唯一"是两回事——唯一性要看**零空间是否只有零向量**（3.3 合并讲解）。

# 3.2 A的零空间：求解Ax = 0 与 Rx = 0

## 零空间是子空间

> [!info] Def 4 零空间
> 所有满足 $A\mathbf{x}=\mathbf{0}$ 的向量 $\mathbf{x}$ 组成的集合，记作 $\mathbf{N}(A)$（nullspace）。
> $A$ 是 $m\times n$ 时，$\mathbf{N}(A)$ 住在 $\mathbb{R}^n$ 里——**列数决定零空间的"房间"**。

**为什么是子空间**：若 $A\mathbf{x}=\mathbf{0}$、$A\mathbf{y}=\mathbf{0}$，则

$$
A(c\mathbf{x}+d\mathbf{y})=cA\mathbf{x}+dA\mathbf{y}=\mathbf{0}+\mathbf{0}=\mathbf{0}
$$

组合不出门 ✓；且 $\mathbf{x}=\mathbf{0}$ 永远是一员 ✓。

> [!warning] 对比：Ax = b 的解集不是子空间（当 b ≠ 0 时）
> 因为 $\mathbf{x}=\mathbf{0}$ 不是解。解集是"**平移过的**零空间"——它不过原点，与子空间恰好差一个"平移"。3.3 会把这个模糊的直觉变成公式：$\mathbf{x}=\mathbf{x}_p+\mathbf{x}_n$。

**求解零空间的总策略**（本节主线）：

| 步骤 | 动作 | 要点 |
| --- | --- | --- |
| 1 | 对 A 消元 → 行最简形 $R$ | 零空间不变：$\mathbf{N}(A)=\mathbf{N}(U)=\mathbf{N}(R)$ |
| 2 | 找出主元列 / 自由列 | 自由列的个数 = $n-r$ |
| 3 | 自由变量逐个取 1（其余取 0） | 每个自由变量造一个**特殊解** |
| 4 | 特殊解的一切组合 | 就是零空间的全部——它是一张"组合清单" |

## 主元列和自由列

Strang 经典例子（3 个方程、4 个未知数，秩不够、必有自由变量）：

$$
A=\begin{bmatrix}1&2&2&2\\2&4&6&8\\3&6&8&10\end{bmatrix}
\xrightarrow[\ \text{行}_3-3\text{行}_1\ ]{\text{行}_2-2\text{行}_1}
\begin{bmatrix}1&2&2&2\\0&0&2&4\\0&0&2&4\end{bmatrix}
\xrightarrow{\ \text{行}_3-\text{行}_2\ }
\begin{bmatrix}1&2&2&2\\0&0&2&4\\0&0&0&0\end{bmatrix}=U
$$

**读信息**：

- 主元出现在第 1、3 列 → 第 1、3 列是**主元列**（pivot columns）
- 第 2、4 列是**自由列**（free columns）——第 2 列恰好是第 1 列的 2 倍，白送一个方向
- 主元个数（这里是 2）= **秩**；自由变量个数 $n-r=4-2=2$

**造特殊解**（special solutions）：让自由变量 $x_2,x_4$ 轮流"举牌"——

- 取 $x_2=1,\ x_4=0$，回解 $x_1=-2,\ x_3=0$ ⇒ $\mathbf{s}_1=(-2,\ 1,\ 0,\ 0)$
- 取 $x_2=0,\ x_4=1$，回解 $x_1=2,\ x_3=-2$ ⇒ $\mathbf{s}_2=(2,\ 0,\ -2,\ 1)$

验证第一个：$-2\mathbf{a}_1+1\mathbf{a}_2=(-2,-4,-6)+(2,4,6)=\mathbf{0}\ \checkmark$（注意 $\mathbf{a}_2=2\mathbf{a}_1$——正好是它"举牌"的原因）。

> [!tip] 零空间的完整答案
> $$\mathbf{N}(A)=\left\{c_1\mathbf{s}_1+c_2\mathbf{s}_2\right\}=\left\{c_1\begin{bmatrix}-2\\1\\0\\0\end{bmatrix}+c_2\begin{bmatrix}2\\0\\-2\\1\end{bmatrix}\right\}$$
> 两个特殊解张成一个**二维子空间**。任何 $A\mathbf{x}=\mathbf{0}$ 的解都在其中，没有例外。

## 最简行阶梯型矩阵

> [!info] Def 5 行最简形
> 继续对 $U$ 做"向上消 + 主元归一化"，得到**行最简形**（reduced row echelon form，简称 RREF）$R$：
> 每个主元都是 1，且**主元所在列只有主元那一个非零元素**。

对上面的例子接着做：行₁ − 行₂、行₂ ÷ 2：

$$
R=\begin{bmatrix}1&2&0&-2\\0&0&1&2\\0&0&0&0\end{bmatrix}
$$

$R$ 把答案摆在了明面上——写成方程组（RREF 方程）：

$$
\begin{cases}
x_1+2x_2-2x_4=0&\Rightarrow x_1=-2x_2+2x_4\\
x_3+2x_4=0&\Rightarrow x_3=-2x_4
\end{cases}
$$

> [!tip] 从 R 直接读出零空间的"配方"
> 自由变量是"自变量"（$x_2,x_4$ 随便取），主元变量是"因变量"（被自由变量决定）。
> 让自由变量轮流取 $(1,0)$ 和 $(0,1)$，主元变量照着公式算——**特殊解不用解方程，换着看 R 就能写**。
> MATLAB 的 `rref(A)`、SymPy 的 `A.rref()` 算的就是这个 $R$。

如果把主元列排整齐（列交换），$R$ 总是这个标准样子，一眼到底：

$$
R=\left[\ \begin{array}{c|c}I&F\\\hline0&0\end{array}\ \right]
\quad\Longrightarrow\quad
\text{零空间的骨架}=
\begin{bmatrix}-F\\\hline I\end{bmatrix}
$$

（上面的例子因为主元列是 1、3 列，需要"列交换"才能摆成这个模块形式——结构不受影响。）

## 矩阵的秩

> [!info] Def 6 秩
> $r=\operatorname{rank}(A)$ = 主元的个数 = 主元列的个数 = **线性无关列的极大数目** = 列空间的维数。
> 它把三个数钉在一起：主元、独立方向、空间的"大小"。

$$
\underbrace{n}_{\text{未知数个数}}=\underbrace{r}_{\text{主元变量}}+\underbrace{n-r}_{\text{自由变量}}
$$

| 情形 | 无穷多解的程度 | 例子 |
| --- | --- | --- |
| $r=n$（没有自由列） | 零空间只有 $\mathbf{0}$ | 3×3 满秩 |
| $r<n$（有自由列） | 零空间是 $n-r$ 维 | 本例：$4-2=2$ 维 |

> [!tip] 秩的全局直觉（第 1 章的呼应）
> 第 1 章曾把"秩"说成**独立信息量**。现在它有了三个等价的化身：
> - **消元的**：主元数
> - **组合的**：独立列的个数（其余列都是"克隆"）
> - **空间的**：列空间的维数
> 三种说法随时切换，是本章最重要的"三合一"。

## 秩一矩阵

> [!tip] 秩一矩阵 = 两个向量的外积
> 秩 1 的矩阵总能写成**一列乘一行** $A=\mathbf{u}\mathbf{v}^T$——所有列都是 $\mathbf{u}$ 的倍数，所有行都是 $\mathbf{v}^T$ 的倍数。
> 例：
> $$\begin{bmatrix}1&3&10\\2&6&20\\3&9&30\end{bmatrix}
> =\begin{bmatrix}1\\2\\3\end{bmatrix}\begin{bmatrix}1&3&10\end{bmatrix}
> $$
> （验证：$(1,2,3)\times1,(1,2,3)\times3,(1,2,3)\times10$——每一列都是 $(1,2,3)$ 的身影。）

**秩一矩阵**（rank-one matrix）为什么重要：

- 它是"**最简积木**"：任何矩阵都是若干秩一矩阵之和（第 7 章的 SVD 就是把它拆得最漂亮）；
- 秩 = 需要的积木块数 = 信息的最小份数；
- 图像压缩的直觉：一张灰度图 ≈ 矩阵，**秩越低越"单调"，压缩率越高**。

## 补充材料： 消元法--着眼大局

消元从 2.2 一路用到 3.2，是时候问一句：**消元对四个子空间做了什么？**

| 子空间 | 消元（$A\to U\to R$）之后 | 原因 |
| --- | --- | --- |
| 零空间 $\mathbf{N}(A)$ | **不变** | $A\mathbf{x}=\mathbf{0}\iff U\mathbf{x}=\mathbf{0}$（行操作是对 0 做组合） |
| 行空间 $\mathbf{C}(A^T)$ | **不变** | 行操作 = 行组合，组合不出来新行 |
| 列空间 $\mathbf{C}(A)$ | **改变**（维数仍是 $r$） | 列被动地跟着行操作变形 |
| 左零空间 $\mathbf{N}(A^T)$ | **改变**（维数仍是 $m-r$） | 与列空间是同一侧的"孪生" |

用 3.1 的 $A=\begin{bmatrix}1&1&2\\2&1&3\\3&1&4\end{bmatrix}$（3×3 版）感受"列空间会变"：

$$
A=\begin{bmatrix}1&1&2\\2&1&3\\3&1&4\end{bmatrix}
\xrightarrow{\ \text{行}_2-2\text{行}_1,\ \text{行}_3-3\text{行}_1\ }
\begin{bmatrix}1&1&2\\0&-1&-1\\0&-2&-2\end{bmatrix}
\xrightarrow{\ \text{行}_3-2\text{行}_2\ }
U=\begin{bmatrix}1&1&2\\0&-1&-1\\0&0&0\end{bmatrix}
\xrightarrow{\ \text{归一化 + 向上消}\ }
R=\begin{bmatrix}1&0&1\\0&1&1\\0&0&0\end{bmatrix}
$$

$R$ 的前两列是 $(1,0,0)^T,(0,1,0)^T$——全在 $z=0$ 平面里；而原 $A$ 的前两列 $(1,2,3)^T,(1,1,1)^T$ 显然不在。**"哪种 b 有解"在消元前后换了答案**——所以解方程组时，$R$ 只用来求**解**（零空间、特解），判断"b 在不在列空间"必须回到**原来的 A**。

> [!tip] 消元的友好对象
> 消元把"求解"这个问题变简单——因为最难的零空间恰好**不变**；
> 但"列空间"会变——所以第 2 章里我们从不直接读 $U$ 的列下结论。
> 一句话：**消元不改变答案，只改变面孔；认面孔时要小心哪张脸没化妆。**

# 3.3 Ax=b的全解

## 有解条件

> [!info] Def 7 可解性
> **可解性**（solvability）：$A\mathbf{x}=\mathbf{b}$ 有解的充要条件：
> 1. 空间语言：$\mathbf{b}\in\mathbf{C}(A)$；
> 2. 消元语言：对 $[A\ \mathbf{b}]$ 消元，**不会出现"0 = 非零"的行**。
> 两者是同一件事的两件衣服。

分工要说清：

- **有解性**由 $\mathbf{b}$ 决定（落在列空间里吗？）；
- **唯一性**由 A 决定（零空间只有零吗？）。

## 特解 Ax_p = b

求一个解的最省力办法：**自由变量全部取 0**，只解主元变量。

Strang 例（本节全程用它）：

$$
\begin{cases}
x_1+3x_2+3x_3=1\\
2x_1+6x_2+9x_3=5\\
-x_1-3x_2+3x_3=5
\end{cases}
\qquad
[A\ \mathbf{b}]=\begin{bmatrix}1&3&3&\mid&1\\2&6&9&\mid&5\\-1&-3&3&\mid&5\end{bmatrix}
$$

**消元**（行₂ − 2·行₁；行₃ + 行₁；再行₃ − 2·行₂）：

$$
\begin{bmatrix}1&3&3&\mid&1\\0&0&3&\mid&3\\0&0&0&\mid&0\end{bmatrix}
\quad\Longrightarrow\quad
R=\begin{bmatrix}1&3&0&\mid&-2\\0&0&1&\mid&1\\0&0&0&\mid&0\end{bmatrix}
$$

**读出结论**：

- 主元列是第 1、3 列；自由列是第 2 列 → $r=2$，自由变量 1 个 → **有无穷多解**
- 零行给出 $0=0$ ✓ → 有解
- **特解**：令 $x_2=0$，从 $R$ 直接读 $x_1=-2,\ x_3=1$：

$$
\mathbf{x}_p=\begin{bmatrix}-2\\0\\1\end{bmatrix}
\quad\text{验证：}\quad
A\mathbf{x}_p=-2\begin{bmatrix}1\\2\\-1\end{bmatrix}+\begin{bmatrix}3\\9\\3\end{bmatrix}=\begin{bmatrix}1\\5\\5\end{bmatrix}\ \checkmark
$$

## 全解

**零空间**（同一个 $R$，令 $x_2=1$ 读自由变量的"举牌解"）：

$$
\mathbf{s}=\begin{bmatrix}-3\\1\\0\end{bmatrix}
\quad\Longrightarrow\quad
\mathbf{N}(A)=\left\{t\,\mathbf{s}\right\}
$$

> [!tip] 全解定理（本章主公式之一）
> $$\boxed{\ \mathbf{x}=\mathbf{x}_p+\mathbf{x}_n\ }\qquad
> \text{即}\qquad
> \mathbf{x}=\begin{bmatrix}-2\\0\\1\end{bmatrix}+t\begin{bmatrix}-3\\1\\0\end{bmatrix}$$
> 一句话证明：$A(\mathbf{x}_p+\mathbf{x}_n)=\mathbf{b}+\mathbf{0}=\mathbf{b}$；反过来，任何解减掉 $\mathbf{x}_p$ 必在零空间里。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 280" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la3-s" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#059669"/>
    </marker>
    <marker id="la3-ax2" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>
  <line x1="60" y1="155" x2="800" y2="155" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la3-ax2)"/>
  <line x1="420" y1="250" x2="420" y2="55" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la3-ax2)"/>

  <!-- 零空间（过原点） -->
  <line x1="144" y1="247" x2="696" y2="63" stroke="#4f46e5" stroke-width="2"/>
  <circle cx="420" cy="155" r="3.5" fill="var(--text-normal,#1f2328)"/>
  <text x="432" y="172" font-size="12" fill="var(--text-muted,#57606a)">0</text>
  <text x="176" y="204" font-size="12.5" font-weight="600" fill="#4f46e5">零空间 N(A)：Ax = 0 的解</text>

  <!-- 解集（过 x_p 的平行线） -->
  <line x1="48" y1="219" x2="525" y2="60" stroke="#059669" stroke-width="2"/>
  <circle cx="420" cy="95" r="4.5" fill="#059669"/>
  <text x="432" y="88" font-size="12.5" font-weight="700" fill="#059669">x_p（特解）</text>
  <text x="252" y="132" font-size="12.5" font-weight="600" fill="#059669">解集：x = x_p + t·s（过 x_p 的平行线）</text>

  <!-- 方向 s 箭头 -->
  <line x1="420" y1="95" x2="504" y2="67" stroke="#059669" stroke-width="1.6" stroke-dasharray="5 3" marker-end="url(#la3-s)"/>
  <text x="500" y="55" font-size="12" font-weight="600" fill="#059669">s</text>

  <text x="420" y="272" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">A(x_p + t·s) = b + t·0 = b —— 解集 = 特解 + 零空间（一条"平移过的直线"）</text>
</svg>

**四种形状全景表**（$m$ 个方程、$n$ 个未知数、秩 $r$）：

| 秩的情形 | 有解性 | 解的情况 | 零空间 |
| --- | --- | --- | --- |
| $r=m=n$ | 必有解 | **唯一解** | $\{\mathbf{0}\}$ |
| $r=n<m$（高瘦列满秩） | 可能无解 | 0 或 1 个解 | $\{\mathbf{0}\}$ |
| $r=m<n$（矮胖行满秩） | 必有解 | **无穷多解**（$n-r$ 个自由参数） | $n-r$ 维 |
| $r<m$ 且 $r<n$（不满秩） | 可能无解 | 0 或无穷多解 | $n-r$ 维 |

> [!warning] 三个易混结论
> 1. **"有解"看列空间**（b 的运气），**"多少解"看零空间**（A 的脾气）。
> 2. $m<n$（方程少于未知数）时，$r=m$ 必有解且无穷多解；但只要 $r<m$，就总存在"故意构造的坏 b"让它无解。
> 3. 全解形式 $\mathbf{x}_p+t\mathbf{s}$ 里的 $t$ 是**实数**——自由变量"举牌"只是挑特殊解的手法，不是把解限制在整数上。

# 3.4 线性无关、基与维数

## 线性无关

> [!info] Def 8 线性无关（复习升级版）
> 若 $c_1\mathbf{v}_1+\cdots+c_k\mathbf{v}_k=\mathbf{0}$ 只有唯一零解 $c_1=\cdots=c_k=0$，称向量组**线性无关**（linearly independent）；否则**线性相关**（linearly dependent）。
>
> 把向量塞进矩阵列：$A=[\mathbf{v}_1\ \cdots\ \mathbf{v}_k]$，则
> $$\text{各列无关}\iff \mathbf{N}(A)=\{\mathbf{0}\}\iff \text{每一列都是主元列}\iff r=k$$

第 1 章的表格在这里升级：判别无关，从此有三条等价通道（定义、零空间、消元主元）。

> [!tip] 几个速判
> - 向量个数 $k>n$（比空间维数还多）⇒ **必相关**（塞不下）；
> - 含零向量 ⇒ 必相关；两向量成比例 ⇒ 相关；
> - 3.2 的 $A$ 里为什么第 2、4 列是自由列？因为它们"寄生"在主元列的张力里——相关性的矩阵化表达。

## 生成子空间的向量

> [!tip] 张成
> 向量组的一切线性组合构成的空间，叫作它们的**张成空间**（span）$\operatorname{span}\{\mathbf{v}_1,\dots,\mathbf{v}_k\}$。
> "$\mathbf{v}$ 组张成 $S$" 与 "$\mathbf{C}([\mathbf{v}_1\ \cdots]) = S$" 是同一句话。
>
> 生成与无关合体的两个例子：
> - 生成整个 $\mathbb{R}^n$ 需要至少 $n$ 个向量，且它们必须无关；
> - $\mathbb{R}^n$ 里的 $n$ 个无关向量**必**生成 $\mathbb{R}^n$（满秩方阵可逆）。

## 向量空间的基

> [!info] Def 9 基
> **基**（basis）：一组向量同时满足：
> 1. **线性无关**（谁也不多余）；
> 2. **能生成整个空间**（谁也不缺）。
>
> 则称它是该空间的**一组基**。基 = 空间的"**最小生成组 + 最大无关组**"，两个条件互相拉扯，恰好卡在"刚好够用"。

> [!tip] 唯一坐标定理
> 在给定基 $\{\mathbf{v}_1,\dots,\mathbf{v}_k\}$ 下，空间中任何向量 $\mathbf{w}$ 的表出方式**唯一**：
> $$\mathbf{w}=a_1\mathbf{v}_1+\cdots+a_k\mathbf{v}_k\ \text{的系数}\ (a_1,\dots,a_k)\ \text{唯一确定}$$
> 证明一句话：若两种表出，相减得"基的零组合"，无关性逼迫所有系数差为 0。
> 这一条使得"坐标"这个词合法——**同一空间换一组基，就像换一套坐标系**（第 8 章相似矩阵的伏笔）。

**两个最重要的基实例**（直接用 3.2 的例题）：

| 空间 | 一组基 | 检查 |
| --- | --- | --- |
| 列空间 $\mathbf{C}(A)$ | **A 的主元列**：$(1,2,3)^T$、$(2,6,8)^T$ | 自由列是它们的组合，不携带新方向 |
| 零空间 $\mathbf{N}(A)$ | **特殊解**：$\mathbf{s}_1=(-2,1,0,0)$、$\mathbf{s}_2=(2,0,-2,1)$ | 由"举牌"构造，自动无关 |

> [!warning] 列空间的基绝不能取 R 的主元列
> 消元会改变列空间（见 3.2 补充材料）！$R$ 的主元列是 $(1,0,0)^T$、$(0,1,0)^T$——它们**不在** $\mathbf{C}(A)$ 里（$\mathbf{C}(A)$ 是另一个平面）。
> 铁律：**基要回原矩阵 A 里找**，消元只负责指出"第几列"。

## 向量空间的维数

> [!info] Def 10 维数
> 空间 $S$ 的**维数**（dimension） = 任意一组基里的向量个数，记 $\dim S$。
> 良定义的原因：**同一个空间的所有基,大小必须相同**（"$n$ 维空间的任意 $n+1$ 个向量必相关"）。
> 换个说法：维数是"空间的自由度"——**装得下几个互不干扰的方向**。

| 空间 | 维数 | 备注 |
| --- | --- | --- |
| $\mathbb{R}^n$ | $n$ | 标准基 $\mathbf{e}_1,\dots,\mathbf{e}_n$ |
| $\mathbf{C}(A)$ | $r$ | = 秩 = 主元列数 |
| $\mathbf{N}(A)$ | $n-r$ | = 自由列数 |
| 零空间只有 $\{\mathbf{0}\}$ | $0$ | "点"的维数是 0 |

## 矩阵空间及函数空间的基

"向量"远不止箭头——转而用 3.4 的两个例子收尾：

**矩阵空间**（把矩阵当向量，逐个元素做加法数乘）：

| 空间 | 一个基 | 维数 |
| --- | --- | --- |
| 所有 $3\times3$ 矩阵 | 9 个"单元素矩阵" $E_{ij}$（只有 $(i,j)$ 位是 1） | 9 |
| 所有 $3\times3$ 上三角矩阵 | 对角线 + 上方的 6 个 $E_{ij}$ | 6 |
| 所有 $3\times3$ 对称矩阵 | 对角线 3 个 + 上方 3 个（下方自动镜像） | 6 |
| 所有 $3\times3$ 对角矩阵 | $E_{11},E_{22},E_{33}$ | 3 |

**函数空间**（function space；函数当向量，讨论"微分方程的解空间"）：

- $P_2=\{a+bt+ct^2\}$：基 $\{1,t,t^2\}$，维数 3
- 微分方程 $y''=y$ 的全部解：$y=c_1e^{t}+c_2e^{-t}$，基 $\{e^t,e^{-t}\}$，**维数 2**——"二阶方程给二维解空间"正是"两个初始条件决定唯一解"的线性代数说法

> [!note] 为什么顺手学"函数空间"
> 通信里所有信号都住在函数空间（能量有限信号空间 $L_2$），"信号用一组基展开"是调制、编码、压缩的共同语言。
> 例：OFDM 就是把信号展到 $\{e^{j2\pi kt/T}\}$ 这组（正交）基上——第 4 章＋[[vault-notes/5g/phy/04-physical-channels-signals]]。

# 3.5 四个子空间的维数

## 四个子空间与维数定理

> [!info] Def 11 四大子空间
> 对任意 $m\times n$ 矩阵 $A$：
>
> | | 名字 | 定义 | 住在 | 维数 |
> | --- | --- | --- | --- | --- |
> | 1 | 列空间 $\mathbf{C}(A)$ | 列的一切组合 | $\mathbb{R}^m$ | $r$ |
> | 2 | 零空间 $\mathbf{N}(A)$ | $A\mathbf{x}=\mathbf{0}$ 的解 | $\mathbb{R}^n$ | $n-r$ |
> | 3 | 行空间 $\mathbf{C}(A^T)$ | 行的一切组合 | $\mathbb{R}^n$ | $r$ |
> | 4 | 左零空间 $\mathbf{N}(A^T)$ | $A^T\mathbf{y}=\mathbf{0}$ 的解 | $\mathbb{R}^m$ | $m-r$ |
>
> **维数定理**（任一行分解一眼可见）：
> $$r+(n-r)=n,\qquad r+(m-r)=m$$
> 四个维数被 $m,n,r$ 三个数完全锁定——**线性代数的"元素周期表"**。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 310" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la3-A" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-normal,#1f2328)"/>
    </marker>
  </defs>

  <!-- R^n 框 -->
  <rect x="70" y="70" width="230" height="170" rx="5" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.4"/>
  <text x="185" y="58" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">R^n（n 维空间）</text>
  <rect x="85" y="85" width="155" height="42" rx="4" fill="#4f46e5" fill-opacity="0.16" stroke="#4f46e5" stroke-opacity="0.55"/>
  <text x="162" y="110" text-anchor="middle" font-size="12" font-weight="600" fill="#4f46e5">行空间 dim r</text>
  <rect x="250" y="85" width="40" height="140" rx="4" fill="#d97706" fill-opacity="0.16" stroke="#d97706" stroke-opacity="0.55"/>
  <text x="270" y="155" text-anchor="middle" font-size="12" font-weight="600" fill="#d97706" transform="rotate(-90 270 155)">零空间 dim n−r</text>
  <text x="185" y="258" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">两者正交，维数之和 = n</text>

  <!-- R^m 框 -->
  <rect x="540" y="70" width="230" height="170" rx="5" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.4"/>
  <text x="655" y="58" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">R^m（m 维空间）</text>
  <rect x="555" y="85" width="155" height="42" rx="4" fill="#4f46e5" fill-opacity="0.16" stroke="#4f46e5" stroke-opacity="0.55"/>
  <text x="632" y="110" text-anchor="middle" font-size="12" font-weight="600" fill="#4f46e5">列空间 dim r</text>
  <rect x="720" y="85" width="40" height="140" rx="4" fill="#d97706" fill-opacity="0.16" stroke="#d97706" stroke-opacity="0.55"/>
  <text x="740" y="155" text-anchor="middle" font-size="12" font-weight="600" fill="#d97706" transform="rotate(-90 740 155)">左零空间 dim m−r</text>
  <text x="655" y="258" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">两者正交，维数之和 = m</text>

  <!-- 箭头 -->
  <line x1="310" y1="118" x2="530" y2="118" stroke="var(--text-normal,#1f2328)" stroke-width="1.8" marker-end="url(#la3-A)"/>
  <text x="420" y="108" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">A（行空间 ↔ 列空间 一一对应）</text>
  <line x1="530" y1="185" x2="310" y2="185" stroke="var(--text-normal,#1f2328)" stroke-width="1.8" marker-end="url(#la3-A)"/>
  <text x="420" y="203" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">A^T</text>

  <text x="420" y="288" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">行空间 ⊥ 零空间（R^n 内互补）；列空间 ⊥ 左零空间（R^m 内互补）——第 4 章把两张图拼起来</text>
</svg>

## 矩阵R的四个子空间

行最简形 $R$ 的四个空间可以"肉眼读取"：

- **行空间**：$R$ 的前 $r$ 行——它们本来就无关、是"标准姿势"；维数 $r$
- **零空间**：特殊解（自由列举牌）；维数 $n-r$
- **列空间**：$R$ 的列里只有 $r$ 个位置"出没"主元，$\mathbf{C}(R)$ 就是坐标轴张成的 $r$ 维子空间（如 3.2 例子中 $z=0$ 平面）
- **左零空间**：$R^T\mathbf{y}=\mathbf{0}$ 的解——$R$ 有 $m-r$ 个零行，解就是"零行对应的那些单位向量的组合"；维数 $m-r$

## 矩阵A的四个子空间

$A$ 与 $R$ 对照着看，才是本节精华：

| 子空间 | $A$ 与 $R$ 的关系 | 计算方式 |
| --- | --- | --- |
| 行空间 | **相同** | 直接读 $R$ 的前 $r$ 行（或直接取 A 里独立行） |
| 零空间 | **相同** | 对 $R$ 造特殊解 |
| 列空间 | **不同**（维数同为 $r$） | 回到 $A$：**主元列**所在的原列 |
| 左零空间 | **不同**（维数同为 $m-r$） | 解 $A^T\mathbf{y}=\mathbf{0}$（等价于解 $R^T$ 再"映射回去"，工程上用 $PA=LU$ 的 $L$ 尾行） |

**小矩阵全解剖**。取

$$
A=\begin{bmatrix}1&2\\3&6\end{bmatrix}\quad(r=1)
$$

行 2 = 3 × 行 1，列 2 = 2 × 列 1，一切尽在掌握：

| 子空间 | 答案 | 维数 |
| --- | --- | --- |
| 列空间 | $\operatorname{span}\{(1,3)^T\}$（平面里过原点的一条线） | 1 |
| 零空间 | $\operatorname{span}\{(-2,1)^T\}$（因为 $A(-2,1)^T=\mathbf{0}$） | 1 |
| 行空间 | $\operatorname{span}\{(1,2)^T\}$ | 1 |
| 左零空间 | $\operatorname{span}\{(-3,1)^T\}$（因为 $A^T(-3,1)^T=\mathbf{0}$） | 1 |

两对"正交"验证起来只需点积：

$$
(1,2)\cdot(-2,1)=0\ \checkmark\qquad (1,3)\cdot(-3,1)=0\ \checkmark
$$

> [!tip] 正交关系的代数来源（第 4 章展开）
> **行空间 ⊥ 零空间**：$A\mathbf{x}=\mathbf{0}$ 的每个分量就是"某一行 · x = 0"——每一行都跟 x 正交。
> **列空间 ⊥ 左零空间**：$\mathbf{y}^TA=\mathbf{0}$（即 $A^T\mathbf{y}=\mathbf{0}$）说 y 与 A 的每一列正交。
> 于是"有解判定"再添第三种说法：
> $$\mathbf{b}\in\mathbf{C}(A)\ \iff\ \mathbf{b}\perp\mathbf{N}(A^T)$$
> ——b 有解就当且仅当它和左零空间里的每个向量都正交。

## 秩一矩阵（回顾）

用 $A=\mathbf{u}\mathbf{v}^T$（3.2 的秩一矩阵）验证四个子空间：

$$
A=\begin{bmatrix}1\\2\\3\end{bmatrix}\begin{bmatrix}1&3&10\end{bmatrix}
$$

- **列空间** = $\operatorname{span}\{\mathbf{u}\}$：所有列都是 $\mathbf{u}$ 的倍数，1 维；
- **行空间** = $\operatorname{span}\{\mathbf{v}^T\}$：所有行都是 $\mathbf{v}^T$ 的倍数，1 维；
- **零空间**：与 $\mathbf{v}$ 正交的一切向量（维数 $n-1$）：$x_1+3x_2+10x_3=0$ 的解面；
- **左零空间**：与 $\mathbf{u}$ 正交的一切向量（维数 $m-1$）。

秩一矩阵把"四个子空间"简化到了极致：**两个方向（u、v）撑起一切，其余全是正交补**。

> [!tip] 本章收官
> 四个子空间 + 维数定理，把 $A\mathbf{x}=\mathbf{b}$ 的全部疑问压缩成三个数的故事：
> - $r$：**有多少个独立方向**（列空间/行空间的维数）
> - $n-r$：**自由变量的数量**（零空间，解的不唯一度）
> - $m-r$：**约束里有多少"冗余"**（左零空间，第 1 章"回路⇒相关"的高维版）
>
> 下一章回答最后一个悬念：**正交到底怎么计算**——投影、最小二乘、Gram-Schmidt，从"垂直的代数"长成"工程估计的核心工具"。

## 本章知识地图

```
向量空间 / 子空间
  ├─ 判定：含 0 + 组合封闭；R³ 四级：点／线／面／体            （3.1）
  │
  ├─ 两大主角
  │      ├── 列空间 C(A) ⊂ R^m：Ax=b 有解 <=> b ∈ C(A)        （3.1）
  │      └── 零空间 N(A) ⊂ R^n：Ax=0 的解，是子空间           （3.2）
  │
  ├─ 消元三件套：主元列／自由列／特殊解                          （3.2）
  │      ├── RREF：R = [I F; 0 0]，零空间骨架 = [-F; I]
  │      ├── 秩 r = 主元数 = 独立列数 = dim C(A)
  │      └── 秩一矩阵 A = u v^T（最简积木）
  │
  ├─ 全解 = 特解 + 零空间：x = x_p + x_n                        （3.3）
  │      ├── 有解性看 C(A)（b 的运气）
  │      └── 唯一性看 N(A)（A 的脾气）；四情形表
  │
  ├─ 语言课：无关 / 张成 / 基 / 维数                             （3.4）
  │      ├── C(A) 的基 = A 的主元列（不是 R 的！）
  │      ├── N(A) 的基 = 特殊解
  │      └── 矩阵空间 9/6/6 维；函数空间 P2 3 维、y''=y 解空间 2 维
  │
  └─ 四大子空间维数大定理                                        （3.5）
         ├── C(A): r ｜ N(A): n-r ｜ C(A^T): r ｜ N(A^T): m-r
         ├── 正交：行空间 ⊥ 零空间；列空间 ⊥ 左零空间
         └── 有解第三判据：b ∈ C(A) <=> b ⊥ N(A^T)
```

## 关联

- 上一章：[[vault-notes/math/linear-algebra/02-solving-linear-systems]]
- 下一章：[[vault-notes/math/linear-algebra/04-orthogonality]]

**通信方向应用**：

- [[vault-notes/communication/11-error-control-coding]] —— **线性分组码可以说是"向量空间理论"直接长出来的应用**：$(n,k)$ 码的全部码字构成 $\mathbb{F}^n$ 中的一个 $k$ 维子空间；生成矩阵 $G$ 的 $k$ 行就是码子空间的一组**基**；校验矩阵 $H$ 的行空间恰是**对偶码**（dual code）——而"校验通过"这句行话的数学内容就是 $H\mathbf{c}^T=\mathbf{0}$，即**码空间 = N(H) 的另一种说法**。纠错能力的衡量（最小距离）就是码子空间里"最稀疏的非零码字"，与"基的选择"密切相关。
- [[vault-notes/communication/09-optimal-reception]] —— "**信号空间**"是本章的同款理论：M 个发送信号 = 信号空间里的 M 个点；信号空间维数不超过 $M$；相关接收求出的判决统计量就是信号向量在（基函数张成的）子空间里的坐标；最优判决 = 用"垂直平分超平面"把空间切成 M 块。第 4 章的 Gram-Schmidt 正是给信号空间"装配标准正交基"的工具。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— MIMO 收发的每个环节都在操作子空间：接收信号必然落在 $H$ 的**列空间**里（噪声除外）；**干扰归零**（nulling）就是把权向量压到干扰信道的**左零空间**里；空分复用的"层数"上限 = 信道矩阵的秩；预编码相当于"挑一组好基"把数据映射进发射子空间。
- [[vault-notes/communication/12-orthogonal-codes-pn-sequences]] —— 正交码族的本质是"选一组两两正交的向量"，使任意两个码字的检验统计量互不干扰——正交基的工程版；哈达玛矩阵的行天然构成 $\mathbb{F}^n$ 的一组正交基，这也解释了它为什么能用于快速变换。
- [[vault-notes/math/linear-algebra/07-singular-value-decomposition]] —— 本章的组织方式（四子空间图、秩定维数）会在 SVD 里以"正交基的最终梦想"形式回归：SVD 给四个子空间各自选出一组**标准正交基**。

**相关**：[[vault-notes/math/linear-algebra/04-orthogonality]]｜[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]
