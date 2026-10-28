---
title: "特征值与特征向量"
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
> 第 4 章把向量"**投影**"，第 5 章把矩阵压成"**一个数**"。这一章要给矩阵配**一组数 + 一组特殊向量**：A 作用在这些向量上，方向不变，只改变长度。
>
> - **6.1** 特征值简介：$A\mathbf{x}=\lambda\mathbf{x}$；特征方程 $\det(A-\lambda I)=0$；**λ 之和 = 迹、之积 = 行列式**；实矩阵也会出现**复数特征值**
> - **6.2** 矩阵对角化：$A=S\Lambda S^{-1}$——换到"特征向量这组基"上，A 变成对角矩阵，于是幂、斐波那契数、不可对角化（Jordan 型）都有了统一解释
> - **6.3** 微分方程组：$d\mathbf{u}/dt=A\mathbf{u}$ 的解是 $e^{\lambda t}$ 的组合；**特征值决定稳定性**（$\operatorname{Re}\lambda<0$）；矩阵指数 $e^{At}$
> - **6.4** 对称矩阵：特征值全实、特征向量互相正交、$A=Q\Lambda Q^{T}$（谱定理）
> - **6.5** 正定矩阵：$\mathbf{x}^TA\mathbf{x}>0$；五个等价判据；椭圆的长短轴；二次函数的最小值
>
> 一句话主线：**特征值回答"矩阵是怎么拉伸的"，特征向量回答"往哪些方向拉伸"——把矩阵换到它自己的坐标系里，幂、指数、微分方程全都退化成"逐分量运算"。**

> [!note] 记号约定
> - $\lambda$：**特征值**（eigenvalue）；$\mathbf{x}$：**特征向量**（eigenvector）；$\lambda$ 与 $\mathbf{x}$ 成对出现
> - $\Lambda=\operatorname{diag}(\lambda_1,\dots,\lambda_n)$：特征值对角矩阵；$S$：特征向量矩阵（列为 $\mathbf{x}_i$）
> - $\operatorname{tr}(A)$：**迹**（对角线元素之和）；$\rho(A)=\max|\lambda_i|$：**谱半径**
> - $Q$：正交矩阵（第 4 章）；$e^{At}$：矩阵指数
> - $\mathbf{x}^TA\mathbf{x}$：**二次型**（quadratic form），本章把它读作"能量"

# 6.1 特征值简介

第 4 章的做法是"把向量拍到子空间上"，第 5 章的做法是"把矩阵压成一个数"。这一章换个方向：**找出那些被 A 作用后方向不变的向量**——它们所在的方向，就是矩阵"自己的坐标系"。

> [!info] Def 1 特征值与特征向量
> 对方阵 $A$，若存在**非零**向量 $\mathbf{x}$ 与数 $\lambda$ 使
> $$
> A\mathbf{x}=\lambda\mathbf{x},\qquad \mathbf{x}\ne\mathbf{0}
> $$
> 则称 $\lambda$ 是 $A$ 的**特征值**（eigenvalue），$\mathbf{x}$ 是**属于** $\lambda$ 的**特征向量**（eigenvector）。
> 换个说法：**$\mathbf{x}$ 就是 $A-\lambda I$ 的零空间里的非零向量**——$\lambda$ 是让 $A-\lambda I$ 变奇异的那几个数。

三个必须记住的要点：

1. **$\mathbf{x}\ne\mathbf{0}$ 是硬性要求**。否则 $\mathbf{0}$ 对任何 $\lambda$ 都成立，这个定义就没意义了。
2. **特征向量只在意方向**：$\mathbf{x}$ 是特征向量，则 $c\mathbf{x}$（$c\ne0$）也是——所以回答特征向量时给一个代表即可。
3. **$\lambda$ 可以是 $0$、负数、复数**：$\lambda=0$ 意味着 $A$ 奇异（$\mathbf{x}$ 落进零空间）；$\lambda<0$ 意味着方向被"翻过来";$\lambda$ 是复数则意味着"旋转"（本节末节）。

几何图像：**$A$ 把 $\mathbf{x}$ 所在的那条直线映回它自己**，在特征方向上 $A$ 只做"伸缩"，伸缩倍数就是 $\lambda$。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 340" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la6-e" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la6-f" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
    <marker id="la6-g" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/>
    </marker>
  </defs>

  <!-- 单位圆 -->
  <circle cx="300" cy="200" r="120" fill="none" stroke="var(--text-faint,#8b949e)" stroke-width="1" stroke-dasharray="5 4"/>
  <line x1="170" y1="200" x2="430" y2="200" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <line x1="300" y1="70" x2="300" y2="330" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>

  <!-- g -> Ag -->
  <line x1="300" y1="200" x2="341" y2="87" stroke="#d97706" stroke-width="2" marker-end="url(#la6-g)"/>
  <text x="347" y="82" font-size="12" font-weight="600" fill="#d97706">g</text>
  <line x1="300" y1="200" x2="367" y2="113" stroke="#d97706" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#la6-g)"/>
  <text x="374" y="120" font-size="12" font-weight="600" fill="#d97706">Ag</text>

  <!-- 稳态方向 e -->
  <line x1="300" y1="200" x2="372" y2="152" stroke="#4f46e5" stroke-width="2.8" marker-end="url(#la6-e)"/>
  <text x="379" y="148" font-size="12" font-weight="700" fill="#4f46e5">e：Ae = e（λ = 1）</text>

  <!-- f -> 0.5f -->
  <line x1="300" y1="200" x2="385" y2="285" stroke="#db2777" stroke-width="2" marker-end="url(#la6-f)"/>
  <text x="392" y="292" font-size="12" font-weight="600" fill="#db2777">f</text>
  <line x1="300" y1="200" x2="342" y2="242" stroke="#059669" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="266" y="252" text-anchor="end" font-size="12" font-weight="600" fill="#059669">Af = ½f（λ = 0.5）</text>

  <circle cx="300" cy="200" r="3.5" fill="var(--text-normal,#1f2328)"/>

  <!-- 说明 -->
  <text x="500" y="96" font-size="12.5" font-weight="600" fill="#4f46e5">特征方向：Ax 与 x 平行</text>
  <text x="500" y="120" font-size="11.5" fill="var(--text-muted,#57606a)">λ 就是伸缩倍数（可为负、可为复数）</text>
  <text x="500" y="164" font-size="12.5" font-weight="600" fill="#d97706">一般方向：Ax 被"扭"向特征方向</text>
  <text x="500" y="188" font-size="11.5" fill="var(--text-muted,#57606a)">马尔可夫链就是靠这个"扭"收敛的</text>
  <text x="500" y="232" font-size="12" fill="var(--text-normal,#1f2328)">图示：A = [[0.8, 0.3], [0.2, 0.7]]</text>
  <text x="500" y="256" font-size="11.5" fill="var(--text-muted,#57606a)">λ = 1（稳态方向 e）、λ = 0.5（衰减方向 f）</text>

  <text x="420" y="326" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">单位圆上的每个向量都被 A 送到别处；只有两个特征方向停在自己的直线上</text>
</svg>

**几个一眼就能看出的例子**（都不需要算）：

| 矩阵 | 特征值 | 特征向量 | 一句话理由 |
| --- | --- | --- | --- |
| 投影矩阵 $P$ | $1$ 与 $0$ | 列空间里的向量 / 零空间里的向量 | $P^2=P$：投一次就不动了 |
| 置换 $\begin{bmatrix}0&1\\1&0\end{bmatrix}$ | $1,\,-1$ | $(1,1)$、$(1,-1)$ | 交换两个分量：和不变、差变号 |
| 奇异 $\begin{bmatrix}1&2\\2&4\end{bmatrix}$ | $0,\,5$ | $(2,-1)$、$(1,2)$ | 有零特征值 $\iff$ 奇异 |
| 三角（上三角）$\begin{bmatrix}3&1\\0&2\end{bmatrix}$ | $3,\,2$ | $(1,0)$、$(1,-1)$ | **对角线元素就是特征值** |
| 单位矩阵 $I$ | 全是 $1$ | 任何向量 | 什么都不做 |

> [!tip] 三角矩阵：特征值一眼读出
> 若 $A$ 是三角矩阵，则 $A-\lambda I$ 仍是三角，行列式 = 对角线之积：
> $$
> \det(A-\lambda I)=\prod_i(a_{ii}-\lambda)\quad\Longrightarrow\quad \lambda_i=a_{ii}
> $$
> 这一条配上"消元不改变行列式（第 5 章性质 5）"就非常有用：**消元把 A 变成 U，U 的对角线就是主元，而 U 的特征值是主元**——特征值虽然会被消元改变（$A$ 与 $U$ 一般不相似），但"三角矩阵的特征值 = 对角线"这条读法在半数场景里够快。

## 特征值的方程

怎么**算出** $\lambda$？把 $A\mathbf{x}=\lambda\mathbf{x}$ 改写成

$$
(A-\lambda I)\mathbf{x}=\mathbf{0}
$$

这是一个齐次方程，我们要的是**非零解**。第 5 章刚说过：**矩阵有非零零向量（即奇异）$\iff\det=0$**。于是：

> [!info] Def 2 特征方程与特征多项式
> $\lambda$ 是 $A$ 的特征值 $\iff$
> $$
> \det(A-\lambda I)=0\qquad\text{（特征方程，characteristic equation）}
> $$
> 左边 $p(\lambda)=\det(A-\lambda I)$ 是 $\lambda$ 的 $n$ 次多项式，称为**特征多项式**（characteristic polynomial）。它在复数域上恰有 $n$ 个根（按重数计），这 $n$ 个数就是 $A$ 的全部特征值。

$2\times2$ 的情形值得背下来：

$$
\det(A-\lambda I)=\lambda^2-(\operatorname{tr}A)\lambda+\det A=0
\quad\Longrightarrow\quad
\lambda=\frac{\operatorname{tr}A\pm\sqrt{(\operatorname{tr}A)^2-4\det A}}{2}
$$

**例 1（马尔可夫矩阵，Markov matrix）** $A=\begin{bmatrix}0.8&0.3\\0.2&0.7\end{bmatrix}$，$\operatorname{tr}A=1.5$，$\det A=0.5$：

$$
\lambda^2-1.5\lambda+0.5=0\ \Longrightarrow\ (\lambda-1)(\lambda-0.5)=0\ \Longrightarrow\ \lambda=1,\ 0.5
$$

代入求特征向量：$\lambda=1$ 时 $A\mathbf{x}=\mathbf{x}$ 给出 $x_1=\tfrac23x_2$，取 $\mathbf{x}=(0.6,0.4)$（**稳态**，steady state）；$\lambda=0.5$ 时解出 $\mathbf{x}=(1,-1)$。

**例 2（对称）** $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$：$\lambda^2-4\lambda+3=0\Rightarrow\lambda=3,1$，特征向量 $(1,1)$、$(1,-1)$（**互相垂直**，不是偶然——见 6.4）。

**例 3（奇异）** $A=\begin{bmatrix}1&2\\2&4\end{bmatrix}$：$\lambda^2-5\lambda+0=0\Rightarrow\lambda=5,0$ ✓（$\det=0$ 时必有一个零特征值）。

**例 4（三角）** $A=\begin{bmatrix}3&1\\0&2\end{bmatrix}$：$\lambda^2-5\lambda+6=(\lambda-3)(\lambda-2)=0\Rightarrow\lambda=3,2$ ✓ 与"对角线元素"一致。

> [!tip] 关于特征值的四条速算规律
> | 变换 | 特征值 | 特征向量 |
> | --- | --- | --- |
> | $A$ | $\lambda$ | $\mathbf{x}$ |
> | $A+cI$（平移） | $\lambda+c$ | $\mathbf{x}$（不变） |
> | $A^k$ | $\lambda^k$ | $\mathbf{x}$（不变） |
> | $A^{-1}$（若可逆） | $1/\lambda$ | $\mathbf{x}$（不变） |
> | $A^{T}$ | $\lambda$（相同！） | 一般**不同** |
> | 一般多项式 $p(A)$ | $p(\lambda)$ | $\mathbf{x}$（不变） |
> 理由都是一行：$A\mathbf{x}=\lambda\mathbf{x}$ 两边反复作用即可，例如 $A^2\mathbf{x}=\lambda A\mathbf{x}=\lambda^2\mathbf{x}$。
> $\det(A^T-\lambda I)=\det((A-\lambda I)^T)=\det(A-\lambda I)$，所以 $A$ 与 $A^T$ **特征值相同、特征向量一般不同**。

> [!warning] 不要用特征多项式去算大矩阵的特征值
> $n$ 次多项式的求根是**数值上最糟糕**的算法之一（系数稍有扰动，根就飞了）。工程上算特征值用的是**QR 算法**（迭代把矩阵做成三角），以及只求最大特征值的**幂法**（power method，6.2 会看到它为什么有效）。
> **特征多项式是"定义与证明"的工具，不是"计算"的工具**——这和第 5 章的排列公式一个道理。

> [!warning] 特征值可以重复
> $\lambda$ 是特征方程的**重根**时，同一个 $\lambda$ 可能只有一个线性无关的特征向量（也可能有多个）。这决定了矩阵**能不能对角化**（6.2 的"不可对角化矩阵"一节）。别看到"两个相同特征值"就以为有两个方向。

## 行列式与迹

特征值把第 5 章那两个数"接"了过来——这是本章最省事的两个检验工具。

> [!info] Def 3 迹
> $A$ 的**迹**（trace）是对角线元素之和：$\operatorname{tr}(A)=a_{11}+a_{22}+\cdots+a_{nn}$。
> 三条常用性质：$\operatorname{tr}(A+B)=\operatorname{tr}A+\operatorname{tr}B$、$\operatorname{tr}(A^T)=\operatorname{tr}A$、**$\operatorname{tr}(AB)=\operatorname{tr}(BA)$**。

> [!tip] 定理 特征值之和与积
> $$
> \lambda_1+\lambda_2+\cdots+\lambda_n=\operatorname{tr}(A),\qquad\qquad \lambda_1\lambda_2\cdots\lambda_n=\det A
> $$
> **证明**（一段话）：把特征多项式按根分解
> $$
> \det(A-\lambda I)=(\lambda_1-\lambda)(\lambda_2-\lambda)\cdots(\lambda_n-\lambda)
> $$
> 令 $\lambda=0$，左边是 $\det A$，右边是 $\lambda_1\lambda_2\cdots\lambda_n$；再比较 $\lambda^{n-1}$ 的系数，左边是 $-\operatorname{tr}A$，右边是 $-(\lambda_1+\cdots+\lambda_n)$，即得两式。

**马上验一遍第 5 章那个 $A$**（$A=\begin{bmatrix}2&1&1\\4&-6&0\\-2&7&2\end{bmatrix}$，我们算过 $\operatorname{tr}A=-2$、$\det A=-16$）：

$$
\lambda_1+\lambda_2+\lambda_3=-2,\qquad \lambda_1\lambda_2\lambda_3=-16
$$

实际的特征值约为 $3.252,\ 0.811,\ -6.063$：和 $=-2$ ✓，积 $=-16$ ✓。**算不出特征值时，这两个数就是最好的"验算器"。**

几条立刻能读出来的结论：

- **三角矩阵**：$\lambda_i=a_{ii}$ ⇒ $\det A=$ 对角元之积（第 5 章性质 7 的"为什么"就在这里）；
- **奇异矩阵**：$\det A=0$ ⇒ 至少一个 $\lambda=0$（$\det A=\prod\lambda_i$）；
- **投影矩阵**：$\lambda=1$（列空间方向）与 $\lambda=0$（零空间方向）⇒
  $$
  \operatorname{tr}(P)=\text{1 的个数}=\dim(\text{列空间})=\operatorname{rank}(P)
  $$
  —— 第 4 章那句"$\operatorname{rank}(P)=\operatorname{tr}(P)=$ 子空间维数"到此终于有了答案！
- **幂等矩阵**（$A^2=A$）：$\lambda^2=\lambda\Rightarrow\lambda\in\{0,1\}$——投影矩阵、幂等矩阵的特征值**只可能是 0 或 1**；
- **相似矩阵**（6.2）：$\operatorname{tr}(M^{-1}AM)=\operatorname{tr}(AMM^{-1})=\operatorname{tr}A$ ⇒ 相似变换保持迹与行列式（也就保持特征值）。

> [!warning] 迹/行列式只是"必要条件"
> 它们能**抓住错误**（算错一个特征值，和/积立刻对不上），但**不能确定**答案。第 5 章那条警告在这里同样适用：不要用它们反推特征值。

## 虚特征值

实矩阵的特征方程是实系数多项式，它的根**可能不是实数**——而且复数根必然**成对出现**（$\lambda$ 与 $\bar\lambda$）。

> [!tip] 旋转矩阵：没有实特征向量的实矩阵
> 把平面旋转 $90°$：
> $$
> Q=\begin{bmatrix}0&-1\\1&0\end{bmatrix},\qquad \det(Q-\lambda I)=\lambda^2+1=0\ \Longrightarrow\ \lambda=i,\ -i
> $$
> **旋转矩阵**（rotation matrix）的几何再清楚不过：**旋转把每个向量都转出了它原来所在的那条直线**，所以没有任何实向量满足 $Q\mathbf{x}=\lambda\mathbf{x}$（除非 $\mathbf{x}=\mathbf{0}$）。
> 一般角度 $\theta$：$Q=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}\Rightarrow\lambda=e^{\pm i\theta}=\cos\theta\pm i\sin\theta$，且 $|\lambda|=1$。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 300" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la6-x" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la6-qx" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#059669"/>
    </marker>
    <marker id="la6-u" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
    <marker id="la6-qu" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/>
    </marker>
    <marker id="la6-arc" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-muted,#57606a)"/>
    </marker>
  </defs>

  <circle cx="280" cy="180" r="90" fill="none" stroke="var(--text-faint,#8b949e)" stroke-width="1" stroke-dasharray="5 4"/>
  <line x1="170" y1="180" x2="400" y2="180" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <line x1="280" y1="70" x2="280" y2="290" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>

  <!-- 旋转弧 -->
  <path d="M370,180 A90 90 0 0 0 280,90" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.3" marker-end="url(#la6-arc)"/>
  <path d="M344,116 A90 90 0 0 0 216,116" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#la6-arc)"/>

  <!-- x -> Qx -->
  <line x1="280" y1="180" x2="366" y2="180" stroke="#4f46e5" stroke-width="2.4" marker-end="url(#la6-x)"/>
  <text x="374" y="185" font-size="12.5" font-weight="700" fill="#4f46e5">x</text>
  <line x1="280" y1="180" x2="280" y2="94" stroke="#059669" stroke-width="2.4" marker-end="url(#la6-qx)"/>
  <text x="288" y="88" font-size="12.5" font-weight="700" fill="#059669">Qx</text>
  <path d="M295,180 L295,165 L280,165" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>

  <!-- u -> Qu -->
  <line x1="280" y1="180" x2="340" y2="120" stroke="#db2777" stroke-width="2" marker-end="url(#la6-u)"/>
  <text x="346" y="116" font-size="12.5" font-weight="700" fill="#db2777">u</text>
  <line x1="280" y1="180" x2="220" y2="120" stroke="#d97706" stroke-width="2" marker-end="url(#la6-qu)"/>
  <text x="186" y="116" font-size="12.5" font-weight="700" fill="#d97706">Qu</text>

  <circle cx="280" cy="180" r="3.5" fill="var(--text-normal,#1f2328)"/>

  <text x="460" y="96" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">每个向量都被转出原来的直线</text>
  <text x="460" y="132" font-size="12.5" font-weight="600" fill="#059669">⇒ 没有实特征向量</text>
  <text x="460" y="176" font-size="12.5" fill="var(--text-normal,#1f2328)">复特征值 λ = ±i（一般 θ：e^(±iθ)）</text>
  <text x="460" y="206" font-size="11.5" fill="var(--text-muted,#57606a)">|λ| = 1：长度不变（保长，正交矩阵）</text>
  <text x="460" y="236" font-size="11.5" fill="var(--text-muted,#57606a)">复数特征值成对出现（λ 与 λ̄）</text>

  <text x="420" y="284" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">实数矩阵没有实特征值，不奇怪：λ 是"伸缩倍数"，复倍数 = 旋转 + 伸缩</text>
</svg>

几条常用结论：

- **实矩阵的复特征值成对出现**：$\lambda$ 是特征值则 $\bar\lambda$ 也是。所以"复数根"不影响 $\operatorname{tr}$、$\det$ 仍为实数 ✓
- **反对称矩阵**（skew-symmetric，$A^T=-A$，对角元必为 0）：特征值**纯虚**且成对 $\pm i\mu$，因此 $\operatorname{tr}A=0$ ✓
  例：$A=\begin{bmatrix}-1&1\\-1&-1\end{bmatrix}$：$\lambda^2+2\lambda+2=0\Rightarrow\lambda=-1\pm i$ ✓（$\operatorname{tr}=-2$、$\det=2$ 都对得上）
- **正交矩阵**：$|\lambda|=1$。理由一行：$Q\mathbf{x}=\lambda\mathbf{x}$ 两边取长度，用第 4 章的**保长性** $\|Q\mathbf{x}\|=\|\mathbf{x}\|$，得 $|\lambda|\|\mathbf{x}\|=\|\mathbf{x}\|$ ✓。所以正交矩阵的特征值**全在单位圆上**（旋转/反射都不会放大或缩小）✓
- **一句话理解"复特征值"**：$\lambda=re^{i\theta}$ 读作"**伸缩 $r$ 倍 + 旋转 $\theta$**"；$|\lambda|$ 是伸缩比，$\arg\lambda$ 是旋转角 ✓

> [!note] 通信方向：复指数无处不在
> 通信里的信号几乎都写成复指数 $e^{j\omega t}$ 的叠加，$j$ 出现在指数上正是"旋转"的意思（相位旋转 = 调制）。第 9 章会系统处理复向量复矩阵；而"复指数是线性系统的特征函数"这件事（6.3 补充材料）正是频域分析的起点。

## AB与A+B的特征值

初学者最容易犯的错误，是把特征值当成"可加可乘的标签"：

> [!warning] 一般来说：$\lambda(A+B)\ne\lambda(A)+\lambda(B)$，$\lambda(AB)\ne\lambda(A)\lambda(B)$
> **反例**（两个矩阵都很简单）：$A=\begin{bmatrix}1&0\\0&-1\end{bmatrix}$（$\lambda=1,-1$）、$B=\begin{bmatrix}0&1\\1&0\end{bmatrix}$（$\lambda=1,-1$）：
> $$
> A+B=\begin{bmatrix}1&1\\1&-1\end{bmatrix}\Rightarrow\lambda=\pm\sqrt2\quad(\ne 2,0,-2)
> $$
> $$
> AB=\begin{bmatrix}0&1\\-1&0\end{bmatrix}\Rightarrow\lambda=\pm i\quad(\ne\pm1)
> $$
> 原因很直白：$B$ 的特征向量与 $A$ 的**不同**，"相加相乘"要在**同一个方向**上才谈得上。

> [!tip] 正确的版本：共享特征向量时才有简单关系
> 若 $\mathbf{x}$ 同时是 $A$ 与 $B$ 的特征向量（$\lambda_A$、$\lambda_B$），则
> $$
> (A+B)\mathbf{x}=(\lambda_A+\lambda_B)\mathbf{x},\qquad (AB)\mathbf{x}=(\lambda_A\lambda_B)\mathbf{x}
> $$
> 一行验证。**特别地：$A$ 与"自己的函数"永远共享特征向量**，于是 6.1 那张速算表成立：
> $$
> \lambda(A^k)=\lambda^k,\quad \lambda(A+cI)=\lambda+c,\quad \lambda(A^{-1})=1/\lambda,\quad \lambda(p(A))=p(\lambda)
> $$
> 还有一类常见情形：**$A$、$B$ 对称且 $AB=BA$（可交换）⇒ 它们有一组公共的标准正交特征向量**（6.4 谱定理的推论），此时"相加相乘"的规则可以直接用。

> [!note] 工程含义
> 两个系统**串联**（矩阵相乘）或**并联**（矩阵相加）时，整体的"特征值"并不能由各环节的特征值简单拼出来——除非各环节的"特征方向"一致。这就是为什么滤波器级联、串联放大器的稳定性分析不能只看各级极点，还要看各级之间的耦合。

# 6.2 矩阵对角化

把 $A$ 的 $n$ 个特征向量按列排成 $S$，则 $A\mathbf{x}_i=\lambda_i\mathbf{x}_i$ 的 $n$ 个等式可以合起来写成矩阵形式：

$$
AS=S\Lambda,\qquad \Lambda=\operatorname{diag}(\lambda_1,\dots,\lambda_n)
$$

只要 $S$ 可逆（特征向量线性无关），两边左乘 $S^{-1}$：

> [!info] Def 4 对角化
> 若 $A$ 有 $n$ 个**线性无关**的特征向量，则
> $$
> A=S\Lambda S^{-1}\qquad\text{（对角化，diagonalization）}
> $$
> 称 $A$ **可对角化**（diagonalizable）。$S$ 的列是特征向量，$\Lambda$ 的对角线是特征值。

**这个式子的意义**：在特征向量这组基下，$A$ 就是对角矩阵——$n$ 维的复杂作用被拆成 $n$ 个**互不干扰**的一维伸缩。于是"求幂、求指数、解微分方程"全部退化成"逐分量算"：

$$
A^k=S\Lambda^kS^{-1},\qquad e^{At}=Se^{\Lambda t}S^{-1}
$$

> [!tip] 什么时候一定能对角化
> - **$n$ 个相异特征值** ⇒ 一定可对角化（相异特征值的特征向量自动线性无关）；
> - **有重根** ⇒ 可能可、可能不可，看特征向量够不够（见"不可对角化矩阵"）；
> - **对称矩阵** ⇒ 一定可对角化，而且可以用**正交**矩阵来对角化（6.4）。
>
> 反过来说：**不可对角化 = 特征向量不够 $n$ 个**，这是唯一的失败原因。

**例**：$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$，特征值 $3,1$，取 $S=\begin{bmatrix}1&1\\1&-1\end{bmatrix}$：

$$
S^{-1}=\frac12\begin{bmatrix}1&1\\1&-1\end{bmatrix}=S^{-1},\qquad
S\Lambda S^{-1}=\frac12\begin{bmatrix}1&1\\1&-1\end{bmatrix}\begin{bmatrix}3&0\\0&1\end{bmatrix}\begin{bmatrix}1&1\\1&-1\end{bmatrix}=\begin{bmatrix}2&1\\1&2\end{bmatrix}=A\ \checkmark
$$

（这个 $S$ 恰好满足 $S^{-1}=\frac12 S$，因为它的两列正交——对称矩阵的福利。）

## 相似矩阵：特征值相同

对角化里的 $S\Lambda S^{-1}$ 有一个专门的名字：

> [!info] Def 5 相似矩阵
> 若存在可逆矩阵 $M$ 使
> $$
> B=M^{-1}AM
> $$
> 则称 $A$ 与 $B$ **相似**（similar）。

> [!tip] 定理 相似不变量
> 相似矩阵有：**相同的特征值、相同的特征多项式、相同的迹、相同的行列式、相同的秩、相同的可对角化性**。
> **证明一行**：$A\mathbf{x}=\lambda\mathbf{x}$ 两边左乘 $M^{-1}$：
> $$
> (M^{-1}AM)(M^{-1}\mathbf{x})=\lambda(M^{-1}\mathbf{x})\ \Longrightarrow\ B(M^{-1}\mathbf{x})=\lambda(M^{-1}\mathbf{x})\ \checkmark
> $$
> 注意：**特征值相同，特征向量不同**（$A$ 的 $\mathbf{x}$ 对应 $B$ 的 $M^{-1}\mathbf{x}$）。

**例（把矩阵变简单）**：$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$，取 $M=\begin{bmatrix}1&1\\0&1\end{bmatrix}$：

$$
M^{-1}AM=\begin{bmatrix}1&0\\1&3\end{bmatrix}
$$

后者是三角矩阵，特征值直接读对角线：$3,1$ ✓ 与 $A$ 一致。（这也是一个实用技巧：**换一组基让矩阵变"三角/对角"**，特征值就露出来了——这正是第 8 章"线性变换与基"的主题。）

> [!warning] 特征值相同 ≠ 相似
> 反例：$3I=\begin{bmatrix}3&0\\0&3\end{bmatrix}$ 与 $\begin{bmatrix}3&1\\0&3\end{bmatrix}$ 的特征值都是 $3,3$，但前者可对角化、后者**不可**——所以它们不相似。
> 结论：**"可对角化"是相似分类的一半**；两个矩阵相似 $\iff$ 它们有相同的特征值**且**相同的可对角化结构（严格版是"相同的 Jordan 型"）。

## 斐波那契数

这是 $A^k=S\Lambda^kS^{-1}$ 最漂亮的演出：**一个纯整数递推，它的通项公式里出现了无理数**。

**斐波那契数列**（Fibonacci numbers）$1,1,2,3,5,8,13,\dots$ 满足 $F_{k+2}=F_{k+1}+F_k$。把相邻两项打包成向量：

$$
\mathbf{u}_k=\begin{bmatrix}F_{k+1}\\F_k\end{bmatrix},\qquad
\mathbf{u}_{k+1}=\begin{bmatrix}1&1\\1&0\end{bmatrix}\mathbf{u}_k=A\mathbf{u}_k
\quad\Longrightarrow\quad \mathbf{u}_k=A^k\mathbf{u}_0
$$

$A=\begin{bmatrix}1&1\\1&0\end{bmatrix}$ 的特征方程：$\lambda^2-\lambda-1=0$，于是

$$
\lambda_1=\varphi=\frac{1+\sqrt5}{2}\approx1.618,\qquad \lambda_2=\frac{1-\sqrt5}{2}=-\frac{1}{\varphi}\approx-0.618
$$

$\varphi$ 就是**黄金比**（golden ratio）。把 $\mathbf{u}_0=(1,0)$ 用两个特征向量表出即可得到通项：

$$
F_k=\frac{\varphi^k-\psi^k}{\sqrt5},\qquad \psi=\frac{1-\sqrt5}{2}
$$

**验算**：$F_{20}=\dfrac{\varphi^{20}-\psi^{20}}{\sqrt5}\approx 6765$ ✓（与逐项相加一致）。

> [!tip] 这一节真正教的事
> 1. **递推 = 差分方程 = 幂运算**：一切"下一步由前一步决定"的过程都是 $\mathbf{u}_{k+1}=A\mathbf{u}_k$；
> 2. **特征值决定增长**：$|\psi|<1$ 所以 $\psi^k\to0$，大 $k$ 时 $F_k\approx\varphi^k/\sqrt5$，且 $F_{k+1}/F_k\to\varphi$（斐波那契数列相邻项之比趋于黄金比）；
> 3. **$A$ 可对角化（两个相异特征值）是关键**——否则通项里会出现 $\lambda^k$ 与 $k\lambda^{k-1}$ 的混合项（见"不可对角化矩阵"）。

## 矩阵的幂A^k

$A^k=S\Lambda^kS^{-1}$ 把"求幂"变成了"对每个特征值取幂"——这是**本章最实用的一个公式**。

> [!tip] 定理 幂的行为由特征值决定
> 设 $A$ 可对角化，特征值 $\lambda_1,\dots,\lambda_n$（按模排序 $|\lambda_1|\ge\cdots$）：
> | 情况 | $A^k$ 的行为 |
> | --- | --- |
> | 全部 $\lvert\lambda_i\rvert<1$ | $A^k\to0$（一切初值都衰减到零） |
> | 有某个 $\lambda=1$，其余 $\lvert\lambda_i\rvert<1$ | 收敛到稳态（$\lambda=1$ 的特征方向） |
> | 有 $\lvert\lambda_i\rvert>1$ | 该方向指数增长 |
> | 有 $\lvert\lambda_i\rvert=1$（且 $\ne1$） | 不衰减也不增长（等幅振荡） |
> 其中 $\rho(A)=\max|\lambda_i|$ 叫**谱半径**（spectral radius）：$\rho(A)<1\iff A^k\to0$。

**马尔可夫链（稳态就是这么来的）**：$A=\begin{bmatrix}0.8&0.3\\0.2&0.7\end{bmatrix}$，$\lambda=1$（稳态方向 $(0.6,0.4)$）与 $\lambda=0.5$（衰减方向 $(1,-1)$）。任何初值都可以拆成这两个方向之和，$\lambda=0.5$ 的成分每步减半：

$$
A^k\mathbf{u}_0\ \longrightarrow\ c_1\begin{bmatrix}0.6\\0.4\end{bmatrix}
\qquad\text{例如}\qquad
A^{20}\approx\begin{bmatrix}0.6&0.6\\0.4&0.4\end{bmatrix}
$$

**每个列向量都被拉向同一个稳态 $(0.6,0.4)$**——这解释了 PageRank、人口模型、排队网络的"极限分布"（[[vault-notes/math/linear-algebra/10-applications]]）。

**另一个例子（幂等/投影）**：$P^2=P$ 时 $\lambda\in\{0,1\}$，所以 $\Lambda^k=\Lambda$，于是 $P^k=P$——**投影矩阵不论投多少次都等于投一次**，第 4 章那条性质的"特征值版"✓

> [!tip] 幂法：只求最大特征值
> **幂法**（power method）：若 $\lvert\lambda_1\rvert>\lvert\lambda_2\rvert\ge\cdots$，则 $A^k\mathbf{u}_0$ 里 $\mathbf{x}_1$ 的成分以 $(\lambda_1/\lambda_2)^k$ 的优势碾压其他方向——**不断用 A 乘一个随机向量，方向就会收敛到 $\mathbf{x}_1$**。这就是工程上求最大特征值/主特征向量的**幂法**（第 7 章主成分分析、第 11 章数值方法都会用到）。

## 不可对角化矩阵

特征值重复时，"特征向量够不够"就成了问题。

**例**：$A=\begin{bmatrix}3&1\\0&3\end{bmatrix}$（上三角），特征值 $3,3$（重根）。

$$
A-3I=\begin{bmatrix}0&1\\0&0\end{bmatrix}\quad\Longrightarrow\quad (A-3I)\mathbf{x}=\mathbf{0}\ \text{的解只有}\ \mathbf{x}=c(1,0)
$$

**只有一个线性无关的特征向量**，凑不出两个——$A$ **不可对角化**（也叫**亏损矩阵**，defective）。

> [!tip] 判断标准：代数重数 vs 几何重数
> - **代数重数**：$\lambda$ 作为特征方程根的重数；
> - **几何重数**：特征向量的个数 = $n-\operatorname{rank}(A-\lambda I)$；
> - **可对角化 $\iff$ 对每个 $\lambda$，几何重数 = 代数重数**（特征向量总数凑够 $n$）。
>
> 例中 $\lambda=3$ 的代数重数是 2、几何重数是 1，所以不可对角化。

> [!tip] 不可对角化时会怎样：Jordan 型
> 不能对角化的矩阵最接近对角的形式叫 **Jordan 型**（Jordan form）：对角线上放特征值，紧邻的上对角线放 1：
> $$
> J=\begin{bmatrix}3&1\\0&3\end{bmatrix}\quad(\text{上例本身就是一个 Jordan 块})
> $$
> 后果是幂与指数里会多出多项式因子：
> $$
> J^k=\begin{bmatrix}3^k&k\,3^{k-1}\\0&3^k\end{bmatrix},\qquad e^{Jt}=e^{3t}\begin{bmatrix}1&t\\0&1\end{bmatrix}
> $$
> 通信/控制里这类"临界阻尼"响应 $te^{\lambda t}$ 就来自这里。

> [!warning] 重复特征值不一定是坏事
> - **单位矩阵 $I$**：特征值全是 1（$n$ 重），但每个向量都是特征向量（几何重数 = $n$）⇒ 可对角化（它本来就是对角矩阵）；
> - **投影矩阵**：特征值 $1,\dots,1,0,\dots,0$，重根很多，但列空间与零空间提供足够的特征向量 ⇒ 可对角化；
> - **对称矩阵**：重根时也总能凑齐正交特征向量 ⇒ 一定可对角化。
>
> 所以真正的判据是"**特征向量够不够**"，而不是"有没有重根"。

## AB与BA的特征值

一个"意料之外"的定理，它同时解释了第 4 章遗留的迹性质，还顺手算出了秩一矩阵的谱。

> [!tip] 定理 AB 与 BA 有相同的非零特征值
> 对任意 $m\times n$ 的 $A$ 与 $n\times m$ 的 $B$（**形状可以完全不同**），$AB$（$m\times m$）与 $BA$（$n\times n$）的非零特征值**完全相同**（重数也一样）。
> **证明**：设 $AB\mathbf{x}=\lambda\mathbf{x}$ 且 $\lambda\ne0$。两边左乘 $B$：
> $$
> BA(B\mathbf{x})=\lambda(B\mathbf{x})
> $$
> 且 $B\mathbf{x}\ne\mathbf{0}$（否则 $\lambda\mathbf{x}=AB\mathbf{x}=\mathbf{0}$，与 $\lambda\ne0$、$\mathbf{x}\ne\mathbf{0}$ 矛盾），所以 $B\mathbf{x}$ 是 $BA$ 的特征向量 ✓

**例（大小完全不同的一对）**：取 $A=\begin{bmatrix}1&2\end{bmatrix}$（$1\times2$）、$B=\begin{bmatrix}1\\2\end{bmatrix}$（$2\times1$）：

$$
AB=[5]\ (\text{1 阶，特征值 }5),\qquad BA=\begin{bmatrix}1&2\\2&4\end{bmatrix}\ (\text{2 阶，特征值 }5,0)
$$

非零特征值都是 $5$ ✓（$BA$ 多出来的那个 $0$ 正是"形状差额"）。

> [!tip] 两个立刻可用的推论
> 1. **$\operatorname{tr}(AB)=\operatorname{tr}(BA)$**：因为迹 = 特征值之和，而两者非零特征值相同（差的那部分都是 0，不影响和）✓ 第 4 章用过的那条循环性，到此有了特征值解释；
> 2. **秩一矩阵 $A=\mathbf{u}\mathbf{v}^T$ 的特征值是 $\mathbf{v}^T\mathbf{u}$ 与 $n-1$ 个 $0$**：把 $A$ 写成 $A=\mathbf{u}\,(\mathbf{v}^T)$，即"$(n\times1)\times(1\times n)$"，于是 $\mathbf{v}^T\mathbf{u}$ 是 $1\times1$ 的那个乘积 ✓ 例如 $\begin{bmatrix}1\\2\\3\end{bmatrix}\begin{bmatrix}1&3&10\end{bmatrix}$ 的特征值是 $1+6+30=37$ 与两个 $0$——而 $\operatorname{tr}=37$ ✓ 一验即中。

# 6.3 微分方程组

前面处理的是"跳跃"（$\mathbf{u}_{k+1}=A\mathbf{u}_k$），现在处理"连续流动"。**特征值在这里的作用最直观：它就是增长率，同时决定着稳定性**（stability）。

> [!tip] 定理 $d\mathbf{u}/dt=A\mathbf{u}$ 的解
> **微分方程组**（system of differential equations）：已知 $\mathbf{u}(0)$，方程 $d\mathbf{u}/dt=A\mathbf{u}$ 的解是
> $$
> \mathbf{u}(t)=c_1e^{\lambda_1t}\mathbf{x}_1+c_2e^{\lambda_2t}\mathbf{x}_2+\cdots+c_ne^{\lambda_nt}\mathbf{x}_n
> $$
> 其中 $\mathbf{x}_i$ 是特征向量，常数 $c_i$ 由 $\mathbf{u}(0)=\sum c_i\mathbf{x}_i$ 定出（**把初值展开成特征向量的组合**）。
> **为什么**：把 $e^{\lambda t}\mathbf{x}$ 求导得 $\lambda e^{\lambda t}\mathbf{x}$，而 $A(e^{\lambda t}\mathbf{x})=\lambda e^{\lambda t}\mathbf{x}$——**求导与乘 A 是同一个操作** ✓

**例**：$A=\begin{bmatrix}-2&1\\1&-2\end{bmatrix}$，$\lambda=-1$（向量 $(1,1)$）与 $\lambda=-3$（向量 $(1,-1)$）：

$$
\mathbf{u}(t)=c_1e^{-t}\begin{bmatrix}1\\1\end{bmatrix}+c_2e^{-3t}\begin{bmatrix}1\\-1\end{bmatrix}
$$

两个指数都在衰减，所以**任何初值都趋于零**——系统稳定。

> [!tip] 特征值 = 增长速度，特征向量 = 空间形状
> - $\operatorname{Re}\lambda<0$：该方向**衰减**；$\operatorname{Re}\lambda>0$：**增长**（不稳定）；$\operatorname{Re}\lambda=0$：**不衰减**（振荡/守恒）；
> - $\operatorname{Im}\lambda\ne0$：该方向**振荡**（复特征值成对，合成 $\cos/\sin$）✓
> 这套"**特征值管时间、特征向量管空间**"的分工，是本章全部应用（稳定性、振动、滤波器、MIMO 特征模式）的共同骨架。

## 二阶微分方程

微积分课上那个"特征方程"，其实就是**某个矩阵的特征多项式**——这一节把它认出来。

对 $y''+by'+ky=0$，令 $\mathbf{u}=\begin{bmatrix}y\\y'\end{bmatrix}$，则

$$
\frac{d}{dt}\begin{bmatrix}y\\y'\end{bmatrix}=\begin{bmatrix}y'\\-ky-by'\end{bmatrix}
=\underbrace{\begin{bmatrix}0&1\\-k&-b\end{bmatrix}}_{A}\begin{bmatrix}y\\y'\end{bmatrix}
$$

$A$ 的特征多项式是

$$
\det(A-\lambda I)=\begin{vmatrix}-\lambda&1\\-k&-b-\lambda\end{vmatrix}=\lambda^2+b\lambda+k
$$

——**和课本上写的一模一样** ✓ 也就是说，解 $y''+by'+ky=0$ 时"猜 $y=e^{\lambda t}$ 代入"这个动作，本质就是求 $A$ 的特征值。

**例**：$y''+4y'+3y=0$ ⇒ $A=\begin{bmatrix}0&1\\-3&-4\end{bmatrix}$，$\lambda^2+4\lambda+3=0\Rightarrow\lambda=-1,-3$：

$$
y(t)=c_1e^{-t}+c_2e^{-3t}
$$

**三种情形**（用特征值统一说）：

| $\lambda$ | 名称 | 解的形状 |
| --- | --- | --- |
| 两个负实数根 | 过阻尼 | $e^{-t}$、$e^{-3t}$ 的叠加，不振荡 |
| 复根 $\lambda=-\alpha\pm i\omega$ | 欠阻尼（振荡） | $e^{-\alpha t}(c_1\cos\omega t+c_2\sin\omega t)$ |
| 重根 | 临界阻尼 | $e^{\lambda t}$ 与 $t e^{\lambda t}$（不可对角化的典型标志） |

## 差分方程

**差分方程**（difference equation）是它的离散版本，完全平行：$\mathbf{u}_{k+1}=A\mathbf{u}_k\Rightarrow\mathbf{u}_k=A^k\mathbf{u}_0=S\Lambda^kS^{-1}\mathbf{u}_0$。

> [!tip] 连续 ↔ 离散 的对照表
> | | 连续 $d\mathbf{u}/dt=A\mathbf{u}$ | 离散 $\mathbf{u}_{k+1}=A\mathbf{u}_k$ |
> | --- | --- | --- |
> | 基本解 | $e^{\lambda t}\mathbf{x}$ | $\lambda^k\mathbf{x}$ |
> | 稳定条件 | 全部 $\operatorname{Re}\lambda<0$ | 全部 $\lvert\lambda\rvert<1$ |
> | 不衰减（振荡） | $\operatorname{Re}\lambda=0$ | $\lvert\lambda\rvert=1$ |
> | 增长 | $\operatorname{Re}\lambda>0$ | $\lvert\lambda\rvert>1$ |
> 对应关系：**$e^{\lambda t}\leftrightarrow\lambda^k$，左半平面 $\leftrightarrow$ 单位圆内部** ✓
> 工程上这解释了为什么模拟滤波器（左半平面极点）与数字滤波器（单位圆内极点）的设计判据长得不一样，但说的是一回事。

**例**：马尔可夫矩阵的 $\lambda=1,0.5$ ⇒ 稳态 + 衰减 ⇒ $\mathbf{u}_k$ 收敛（6.2）✓
**例**：斐波那契的 $\lambda=\varphi,-0.618$ ⇒ $|\varphi|>1$ ⇒ 增长（6.2）✓

## 2\*2矩阵的稳定性

对 $2\times2$ 矩阵，稳定性判据可以写成两个数的非常漂亮的几何条件。

$$
\lambda_{1,2}=\frac{\operatorname{tr}A\pm\sqrt{(\operatorname{tr}A)^2-4\det A}}{2}
$$

> [!tip] 定理 $2\times2$ 的稳定性判据
> $$
> \text{稳定}\ (\text{两个 }\operatorname{Re}\lambda<0)\quad\Longleftrightarrow\quad \operatorname{tr}A<0\ \ \text{且}\ \ \det A>0
> $$
> **推导**：$\det A=\lambda_1\lambda_2>0$ 说明两根同号；$\operatorname{tr}A=\lambda_1+\lambda_2<0$ 说明同为负。复数根时 $\operatorname{Re}\lambda=\operatorname{tr}A/2<0$ 也正好是这一条 ✓
> **分界线**：$\det A=\operatorname{tr}^2A/4$（即 $(\operatorname{tr}A)^2=4\det A$）分开了"实特征值"与"复特征值（振荡）"。

于是 $(x,y)=(\operatorname{tr}A,\det A)$ 平面上的**稳定区**是"左上象限"，而抛物线 $\det=(\operatorname{tr})^2/4$ 把稳定区切成两半：靠近两条轴的（实根、过阻尼）与靠近抛物线顶部的（复根、振荡）。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 340" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la6-ax" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <!-- 稳定区 -->
  <rect x="200" y="20" width="200" height="200" fill="#059669" fill-opacity="0.13"/>
  <text x="216" y="46" font-size="12.5" font-weight="600" fill="#059669">稳定区：tr &lt; 0 且 det &gt; 0</text>
  <text x="216" y="68" font-size="11.5" fill="var(--text-muted,#57606a)">两个 Re λ 都 &lt; 0</text>

  <!-- 抛物线 det = tr²/4 -->
  <path d="M200,20 Q400,420 600,20" fill="none" stroke="#4f46e5" stroke-width="2"/>
  <text x="248" y="96" font-size="11.5" font-weight="600" fill="#4f46e5">复特征值（振荡）</text>
  <text x="352" y="196" font-size="11.5" font-weight="600" fill="#4f46e5">实特征值（过阻尼）</text>

  <!-- 坐标轴 -->
  <line x1="180" y1="220" x2="630" y2="220" stroke="var(--text-faint,#8b949e)" stroke-width="1.2" marker-end="url(#la6-ax)"/>
  <line x1="400" y1="330" x2="400" y2="16" stroke="var(--text-faint,#8b949e)" stroke-width="1.2" marker-end="url(#la6-ax)"/>
  <text x="636" y="225" font-size="12" font-weight="700" fill="var(--text-normal,#1f2328)">tr</text>
  <text x="408" y="16" font-size="12" font-weight="700" fill="var(--text-normal,#1f2328)">det</text>

  <!-- 样点 -->
  <circle cx="200" cy="70" r="4" fill="#059669"/>
  <text x="120" y="60" font-size="11.5" fill="#059669">λ = −1, −3（稳定）</text>
  <circle cx="400" cy="170" r="4" fill="#d97706"/>
  <text x="412" y="164" font-size="11.5" fill="#d97706">λ = ±i（中心，等幅振荡）</text>
  <circle cx="350" cy="320" r="4" fill="#dc2626"/>
  <text x="200" y="318" text-anchor="end" font-size="11.5" fill="#dc2626">λ = 1, −2（鞍点，不稳定）</text>

  <text x="420" y="336" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">抛物线 det = tr²/4 分界：上方是复特征值（振荡），下方是实特征值</text>
</svg>

**三个样点**（都能手算验证）：

| 矩阵 | $\operatorname{tr}$ | $\det$ | 特征值 | 结论 |
| --- | --- | --- | --- | --- |
| $\begin{bmatrix}-2&1\\1&-2\end{bmatrix}$ | $-4$ | $3$ | $-1,-3$ | 稳定（过阻尼） |
| $\begin{bmatrix}0&1\\-1&0\end{bmatrix}$ | $0$ | $1$ | $\pm i$ | 临界（等幅振荡，临界稳定） |
| $\begin{bmatrix}0&1\\2&-1\end{bmatrix}$ | $-1$ | $-2$ | $1,-2$ | 不稳定（鞍点：一个方向发散） |

> [!note] 通信/控制方向：极点就是特征值
> 线性系统的"**极点**"（pole）就是状态矩阵的特征值。**极点全在左半平面 ⟺ 系统稳定**：
> - IIR 滤波器、锁相环、自动增益控制、反馈放大器——稳定性分析都在做"$\operatorname{Re}\lambda<0$?"这一件事；
> - 响应的"快慢"也由特征值决定：$|\operatorname{Re}\lambda|$ 越大衰减越快，但通常要求更大的带宽/更快的采样；
> - 复特征值给出**衰减振荡**（$e^{-\alpha t}\cos\omega t$）——这就是滤波器的"振铃"（ringing）。

## 矩阵指数函数

把标量指数函数 $e^{at}$ 的定义照搬到矩阵上，就得到解微分方程的最紧凑写法。

> [!info] Def 6 矩阵指数
> **矩阵指数**（matrix exponential）：
> $$
> e^{At}=I+At+\frac{(At)^2}{2!}+\frac{(At)^3}{3!}+\cdots
> $$
> 若 $A$ 可对角化，则它简化成一个非常干净的公式：
> $$
> e^{At}=Se^{\Lambda t}S^{-1}=S\begin{bmatrix}e^{\lambda_1t}&&\\&\ddots&\\&&e^{\lambda_nt}\end{bmatrix}S^{-1}
> $$
> 于是 $d\mathbf{u}/dt=A\mathbf{u}$ 的解就是
> $$
> \mathbf{u}(t)=e^{At}\mathbf{u}(0)
> $$

（把 $A=S\Lambda S^{-1}$ 代入级数：$(S\Lambda S^{-1})^k=S\Lambda^kS^{-1}$，中间项全部对消，得 $Se^{\Lambda t}S^{-1}$ ✓）

**三条常用性质**（都与标量情形一致，除最后一条）：

- $\dfrac{d}{dt}e^{At}=Ae^{At}=e^{At}A$ ✓
- $e^{A(t+s)}=e^{At}e^{As}$ ✓（同一矩阵，指数可加）
- **但 $e^{A+B}\ne e^{A}e^{B}$**，除非 $AB=BA$ ✓——又是 6.1 那条"A+B 不简单"的另一个面孔

> [!tip] $e^{At}$ 的特征值就是 $e^{\lambda t}$
> $A\mathbf{x}=\lambda\mathbf{x}$ ⇒ $e^{At}\mathbf{x}=e^{\lambda t}\mathbf{x}$：**特征向量不变，特征值被"取了指数的"**——这也解释了为什么稳定判据从 $\operatorname{Re}\lambda<0$ 变成 $\lambda^k\to0$ 或 $e^{\lambda t}\to0$ 的不同说法。
> 数值上算 $e^{At}$ 用的是**缩放平方法**（scaling and squaring）+ Padé 近似（`expm`），不是级数硬加。

## 补充材料：微分方程

把这一节放回工程语境，就得到"为什么通信/控制工程必须先学特征值"的完整答案。

**1. 状态空间与极点**。线性时不变系统 $\dot{\mathbf{x}}=A\mathbf{x}+B\mathbf{u}$、$\mathbf{y}=C\mathbf{x}$ 的行为完全由 $A$ 的特征值（**极点**）与特征向量（**模态**）决定：

$$
\mathbf{x}(t)=\underbrace{e^{At}\mathbf{x}(0)}_{\text{零输入响应}}+\int_0^t e^{A(t-\tau)}B\mathbf{u}(\tau)\,d\tau
$$

**2. 复指数是 LTI 系统的特征函数**（连续世界的"特征向量"）。输入 $u(t)=e^{st}$ 时，输出是 $H(s)e^{st}$——**形状不变，只乘一个数** $H(s)$：

$$
H(s)=\frac{1}{s-\lambda}\ \text{（一阶系统）},\qquad \text{分母的根就是极点}
$$

这正是拉普拉斯变换/傅里叶变换的立足点：**把信号分解成 $e^{st}$ 的组合，卷积就变成了乘法**。第 8、9 章会把"函数当向量"这件事说清楚（[[vault-notes/communication/09-optimal-reception]]）。

**3. 二阶系统的标准参数**。$y''+2\zeta\omega_ny'+\omega_n^2y=0$ ⇒ $\lambda=-\zeta\omega_n\pm\omega_n\sqrt{\zeta^2-1}$：

| $\zeta$ | 特征值 | 响应 |
| --- | --- | --- |
| $\zeta>1$ | 两个负实根 | 过阻尼：慢慢爬，无振荡 |
| $\zeta=1$ | 重根 | 临界阻尼：最快且不振荡（**不可对角化**，解含 $te^{\lambda t}$） |
| $0<\zeta<1$ | 复根 | 欠阻尼：衰减振荡（超调 + 振铃） |

**4. 通信里的落点**：

- **滤波器设计**：极点位置 = 带宽与稳定性的权衡（第 11 章 IIR 设计）；
- **锁相环/AGC**：环路稳定性 = 特征值实部符号；
- **自适应均衡**：收敛速度由输入相关矩阵的特征值扩散（$\lambda_{\max}/\lambda_{\min}$，即第 4 章的条件数）决定——**特征值分布决定收敛快慢**，这是 6.5"碗形最小值"的直接应用；
- **MIMO 特征模式**：信道协方差矩阵的特征分解给出相互正交的"特征波束"（[[vault-notes/5g/phy/04-physical-channels-signals]]）。

# 6.4 对称矩阵

对称矩阵（$A=A^T$）是"最乖"的一类矩阵，本章几乎所有"好性质"都汇集在它身上。

> [!tip] 对称矩阵的三个保证
> 1. **特征值全为实数**（不会出现旋转式的复数）；
> 2. **相异特征值的特征向量互相正交**（可以取成标准正交组）；
> 3. **一定可对角化，而且可以用正交矩阵来对角化**：$A=Q\Lambda Q^{T}$，即 $A=Q\Lambda Q^{-1}$ 且 $Q^{-1}=Q^{T}$。
> 第 3 条就是著名的**谱定理**（spectral theorem）。对比一般矩阵的 $A=S\Lambda S^{-1}$：这里 $S$ 升级成了正交矩阵 $Q$——第 4 章的"正交矩阵"在这里派上大用场。

## 实矩阵的复特征向量

为什么对称矩阵不可能是"旋转型"？

> [!tip] 定理 对称矩阵的特征值一定是实数
> 设 $A\mathbf{x}=\lambda\mathbf{x}$（$\mathbf{x}$ 可以是复向量）。用共轭转置 $\bar{\mathbf{x}}^T$ 左乘：
> $$
> \bar{\mathbf{x}}^TA\mathbf{x}=\lambda\,\bar{\mathbf{x}}^T\mathbf{x}
> $$
> 左边是标量，取它的共轭：由于 $A$ 实且对称（$\bar A=A=A^T$），
> $$
> \overline{\bar{\mathbf{x}}^TA\mathbf{x}}=\mathbf{x}^T A\bar{\mathbf{x}}=(A^T\mathbf{x})^T\bar{\mathbf{x}}=(A\mathbf{x})^T\bar{\mathbf{x}}=\lambda\,\mathbf{x}^T\bar{\mathbf{x}}=\lambda\,\overline{\bar{\mathbf{x}}^T\mathbf{x}}
> $$
> 对比两式（$\bar{\mathbf{x}}^T\mathbf{x}=\sum|x_i|^2>0$）得 $\lambda=\bar\lambda$，**即 $\lambda$ 是实数** ✓

反过来说：**非对称的实矩阵才可能"旋转"**（例如 $\begin{bmatrix}0&-1\\1&0\end{bmatrix}$ 的 $\pm i$）。所以"实矩阵的复特征向量"这件事，恰好是"对称性"的反面镜子：**对称 = 一切都是实的、正交的**。

> [!note] 通信方向：对称性从哪来
> 通信里最重要的几个矩阵都是对称（或 Hermite）的：**协方差矩阵** $R=E[\mathbf{x}\mathbf{x}^T]$、**相关矩阵**、**$A^TA$**、**图的拉普拉斯矩阵**、**自相关矩阵**（Toeplitz 对称）。它们"一定可以正交对角化"这条保证，是 MIMO 特征波束、PCA、KLT、谱聚类这些算法的地基。

## 所有对称矩阵均可对角化

> [!tip] 定理 谱定理（对称矩阵版）
> 实对称矩阵 $A$ 存在 $n$ 个**标准正交**的特征向量 $\mathbf{q}_1,\dots,\mathbf{q}_n$（即使特征值有重根）。把它们按列排成 $Q$（于是 $Q^TQ=I$，$Q^{-1}=Q^T$）：
> $$
> A=Q\Lambda Q^{T}\qquad\Longleftrightarrow\qquad A=\lambda_1\mathbf{q}_1\mathbf{q}_1^T+\lambda_2\mathbf{q}_2\mathbf{q}_2^T+\cdots+\lambda_n\mathbf{q}_n\mathbf{q}_n^T
> $$
> 右边这个写法叫 $A$ 的**谱分解**（spectral decomposition）。

**两个关键点**：

**① 相异特征值 ⇒ 特征向量正交**（一行证明）：

$$
\lambda_1\mathbf{x}_1^T\mathbf{x}_2=(A\mathbf{x}_1)^T\mathbf{x}_2=\mathbf{x}_1^TA^T\mathbf{x}_2=\mathbf{x}_1^TA\mathbf{x}_2=\mu\mathbf{x}_1^T\mathbf{x}_2
$$

（中间那步用了 $A^T=A$。）于是 $(\lambda_1-\mu)\mathbf{x}_1^T\mathbf{x}_2=0$，而 $\lambda_1\ne\mu$，故 $\mathbf{x}_1^T\mathbf{x}_2=0$ ✓ **"对称"这个条件就是在为这一步服务**。

**② 谱分解 = 一组正交投影的加权和**。每个 $\mathbf{q}_i\mathbf{q}_i^T$ 都是一个**秩一投影矩阵**（第 4 章！），它们两两正交（$(\mathbf{q}_1\mathbf{q}_1^T)(\mathbf{q}_2\mathbf{q}_2^T)=0$）且和为单位矩阵：

$$
\sum_{i}\mathbf{q}_i\mathbf{q}_i^T=QQ^T=I
$$

所以：**任何对称矩阵都是"若干互相垂直的投影"的加权组合，权重就是特征值。**这是本章最漂亮的一句话，也是第 7 章 SVD 的直接来源。

**例**：$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$，$\lambda_1=3$（向量 $\mathbf{q}_1=\frac{1}{\sqrt2}(1,1)$）、$\lambda_2=1$（$\mathbf{q}_2=\frac{1}{\sqrt2}(1,-1)$）：

$$
A=3\cdot\frac12\begin{bmatrix}1&1\\1&1\end{bmatrix}+1\cdot\frac12\begin{bmatrix}1&-1\\-1&1\end{bmatrix}
=\begin{bmatrix}2&1\\1&2\end{bmatrix}\ \checkmark
$$

（这两个秩一矩阵分别是"投到 $(1,1)$ 方向"与"投到 $(1,-1)$ 方向"的投影矩阵 ✓）

> [!warning] 非对称矩阵没有这些好性质
> 非对称矩阵：特征值可能复、特征向量可能不正交、可能不可对角化（$\begin{bmatrix}3&1\\0&3\end{bmatrix}$ 就是对角的"极限失败"）。
> **"对称"是本章所有"好性质"的总开关**——工程上做特征分解时，第一件事永远是问：这个矩阵对称吗？

# 6.5 正定矩阵

对称矩阵里最重要的一类：**特征值全部为正**。它在优化、最小二乘、能量、概率里无处不在。

> [!info] Def 7 正定矩阵
> 对称矩阵 $A$ 若对一切 $\mathbf{x}\ne\mathbf{0}$ 都有
> $$
> \mathbf{x}^TA\mathbf{x}>0
> $$
> 则称 $A$ 是**正定**的（positive definite），记作 $A>0$。
> 等价地（下一小节会证）：**$A$ 的所有特征值都大于零**。

## 基于能量的定义

把 $\mathbf{x}^TA\mathbf{x}$ 读作"**能量**"（它是二次型，$\mathbf{x}$ 是状态）：

$$
\mathbf{x}^TA\mathbf{x}=\sum_i\sum_j a_{ij}x_ix_j
$$

**几何意义**：它是二次函数 $f(\mathbf{x})=\mathbf{x}^TA\mathbf{x}$ 的等高线形状——正定意味着"任何方向都往上翘"（碗）。

> [!tip] 定理 正定的五个等价判据（Strang 的经典清单）
> 对称矩阵 $A$ 正定 $\iff$ 下面五条**任意一条**（也就全部）成立：
> 1. **能量**：对一切 $\mathbf{x}\ne\mathbf{0}$，$\mathbf{x}^TA\mathbf{x}>0$（定义）；
> 2. **特征值**：$A$ 的所有特征值 $\lambda_i>0$；
> 3. **顺序主子式**（leading principal minors）：左上角 $1\times1$、$2\times2$、…、$n\times n$ 的行列式**全为正**；
> 4. **主元**：消元得到的所有主元 $>0$（主元 = 相邻顺序主子式之商）；
> 5. **分解**：$A=R^TR$，$R$ 可逆（取三角的 $R$ 就是 **Cholesky 分解**）。
> 实用建议：**判据 3、4 不需要算特征值**，是手算与数值的首选；判据 2 最易懂；判据 5 是"正定"这个名字的代数内核。

**例 1**：$A=\begin{bmatrix}2&-1\\-1&2\end{bmatrix}$——五条逐一验：

- 顺序主子式：$|2|=2>0$，$\begin{vmatrix}2&-1\\-1&2\end{vmatrix}=3>0$ ✓
- 主元：$2$ 与 $2-\frac{(-1)(-1)}{2}=\frac32>0$ ✓
- 特征值：$\lambda^2-4\lambda+3=0\Rightarrow\lambda=3,1>0$ ✓
- 能量（配方法）：$\mathbf{x}^TA\mathbf{x}=2x_1^2-2x_1x_2+2x_2^2=x_1^2+(x_1-x_2)^2+x_2^2>0$ ✓
- Cholesky：$R=\begin{bmatrix}\sqrt2&-1/\sqrt2\\0&\sqrt{3/2}\end{bmatrix}$，$R^TR=A$ ✓

**例 2**：$A=\begin{bmatrix}2&6\\6&20\end{bmatrix}$：顺序主子式 $2>0$、$4>0$ ✓，主元 $2,2$ ✓，能量 $=2(x_1+3x_2)^2+2x_2^2>0$ ✓ ——**配方法给出的平方块，正好对应消元的主元**（$2$ 与 $2$）✓

> [!warning] 经典陷阱：$\det A>0$ 不充分！
> $A=\begin{bmatrix}-1&0\\0&-1\end{bmatrix}$：$\det A=1>0$，但它是**负定**的（$\lambda=-1,-1$）✓
> 判定正定必须查**全部**顺序主子式（这个例子的一阶主子式 $-1$ 就已经否掉了）。口诀：**"领头的一串都为正"**，而不是"最后那个为正"。

## 半正定矩阵

> [!info] Def 8 半正定矩阵
> 若对一切 $\mathbf{x}$ 有 $\mathbf{x}^TA\mathbf{x}\ge0$（允许取等号），称 $A$ **半正定**（positive semidefinite），记 $A\ge0$。
> 等价：所有特征值 $\lambda_i\ge0$；不是正定 $\iff$ 有零特征值 $\iff A$ 奇异 $\iff$ 存在 $\mathbf{x}\ne\mathbf{0}$ 使 $\mathbf{x}^TA\mathbf{x}=0$。

**例**：$A=\begin{bmatrix}1&1\\1&1\end{bmatrix}$：$\lambda=2,0$ ⇒ 半正定；取 $\mathbf{x}=(1,-1)$ 得 $\mathbf{x}^TA\mathbf{x}=0$ ✓（这个方向上"能量为零"——因为 $A$ 把它压成了零向量）。

> [!tip] 最重要的半正定矩阵：$A^TA$
> 对**任何**矩阵 $A$（不必方阵）：
> $$
> \mathbf{x}^TA^TA\mathbf{x}=(A\mathbf{x})^T(A\mathbf{x})=\|A\mathbf{x}\|^2\ge0
> $$
> 所以 $A^TA$ 永远半正定 ✓ 而且：
> $$
> A^TA\ \text{正定}\quad\Longleftrightarrow\quad A\ \text{的各列线性无关}\quad\Longleftrightarrow\quad \mathbf{N}(A)=\{\mathbf{0}\}
> $$
> —— **第 4 章"最小二乘的 $A^TA$ 可逆 $\iff$ 列无关"到这里终于有了名字：$A^TA$ 是正定的。** ✓
> 同理，**协方差矩阵** $R=E[\mathbf{x}\mathbf{x}^T]$ 半正定（功率不可能为负），"$R$ 正定"意味着各分量"互不冗余"（满秩）✓

> [!note] 通信方向：能量、协方差、迭代收敛
> "正定 = 能量恒正 = 碗"这一条在工程里满天飞：
> - **协方差/相关矩阵**：$R\ge0$ 是"功率非负"的数学形式；$R$ 的特征值 = 各"特征方向"上的功率（MIMO 特征波束的增益）；
> - **自适应滤波的收敛**：LMS/RLS 的代价函数是碗，碗的"陡峭程度"由 $R$ 的特征值决定，**特征值扩散越大收敛越慢**（这就是第 4 章那条"条件数"警告的物理版）；
> - **MMSE 检测/估计**：目标函数是二次型，正定 ⟹ 唯一最优解。

## 椭圆ax^2+2bxy+cy^2 = 1

正定矩阵最有画面感的一节：**二次型的等高线**。

把二次型写成矩阵形式：

$$
ax^2+2bxy+cy^2=\begin{bmatrix}x&y\end{bmatrix}\underbrace{\begin{bmatrix}a&b\\b&c\end{bmatrix}}_{A}\begin{bmatrix}x\\y\end{bmatrix}=\mathbf{x}^TA\mathbf{x}
$$

对称矩阵可以正交对角化 $A=Q\Lambda Q^T$，令 $\mathbf{y}=Q^T\mathbf{x}$（**旋转到主轴**，$\mathbf{x}$ 到 $\mathbf{y}$ 是纯旋转，不改变形状）：

$$
\mathbf{x}^TA\mathbf{x}=\mathbf{y}^T\Lambda\mathbf{y}=\lambda_1y_1^2+\lambda_2y_2^2
$$

于是 $\mathbf{x}^TA\mathbf{x}=1$ 在新坐标下就是标准椭圆 $\lambda_1y_1^2+\lambda_2y_2^2=1$：

> [!tip] 椭圆定理
> - **正定** $\iff$ 曲线是**椭圆**（ellipse）——封闭曲线；
> - **半轴长** $=1/\sqrt{\lambda_i}$，**半轴方向 = 特征向量**；
> - $\lambda$ 越**大**，该方向的半轴越**短**（同样的能量下被"顶"得更硬）；
> - 若 $\det A<0$（一个正一个负特征值）⇒ 是**双曲线**（hyperbola）；有零特征值 ⇒ 退化成两条平行线或一点。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 330" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la6-maj" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la6-min" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
  </defs>

  <!-- 参考坐标轴 -->
  <line x1="150" y1="175" x2="450" y2="175" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <line x1="300" y1="40" x2="300" y2="310" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <text x="454" y="179" font-size="11" fill="var(--text-faint,#8b949e)">x</text>
  <text x="304" y="40" font-size="11" fill="var(--text-faint,#8b949e)">y</text>

  <!-- 椭圆 5x²+8xy+5y²=1 -->
  <ellipse cx="300" cy="175" rx="125" ry="41.7" transform="rotate(45 300 175)" fill="#059669" fill-opacity="0.10" stroke="#059669" stroke-width="2"/>

  <!-- 长短轴 -->
  <line x1="211.6" y1="86.6" x2="388.4" y2="263.4" stroke="#4f46e5" stroke-width="1.8" stroke-dasharray="6 4"/>
  <line x1="270.5" y1="204.5" x2="329.5" y2="145.5" stroke="#db2777" stroke-width="1.8" stroke-dasharray="6 4"/>
  <line x1="300" y1="175" x2="388" y2="263" stroke="#4f46e5" stroke-width="2.4" marker-end="url(#la6-maj)"/>
  <line x1="300" y1="175" x2="328.5" y2="146" stroke="#db2777" stroke-width="2.4" marker-end="url(#la6-min)"/>
  <circle cx="300" cy="175" r="3.5" fill="var(--text-normal,#1f2328)"/>

  <!-- 说明 -->
  <text x="490" y="96" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">5x² + 8xy + 5y² = 1</text>
  <text x="490" y="122" font-size="12" fill="var(--text-normal,#1f2328)">A = [[5, 4], [4, 5]]，λ = 9 和 1</text>
  <text x="490" y="162" font-size="12" font-weight="600" fill="#4f46e5">长半轴 = 1/√1 = 1</text>
  <text x="490" y="184" font-size="11.5" fill="var(--text-muted,#57606a)">方向 (1, −1)：λ = 1 的特征向量</text>
  <text x="490" y="222" font-size="12" font-weight="600" fill="#db2777">短半轴 = 1/√9 = 1/3</text>
  <text x="490" y="244" font-size="11.5" fill="var(--text-muted,#57606a)">方向 (1, 1)：λ = 9 的特征向量</text>
  <text x="490" y="284" font-size="11.5" fill="var(--text-muted,#57606a)">半轴 = 1/√λ：λ 越大，方向越"硬"、轴越短</text>

  <text x="420" y="322" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">正定 ⇒ 椭圆；半轴方向 = 特征向量，半轴长 = 1/√λ（椭圆倾斜 45°，因为特征向量是 (1,1) 与 (1,−1)）</text>
</svg>

**验证**：在 $\mathbf{q}_1=\frac{1}{\sqrt2}(1,1)$ 方向上取单位向量，二次型的值为 $\lambda_1=9$，所以该方向上"最远"只能走到 $\frac{1}{\sqrt9}=\frac13$ ✓；在 $\mathbf{q}_2=\frac{1}{\sqrt2}(1,-1)$ 方向上二次型的值为 $1$，可走到 $1$ ✓——**椭圆的形状与方向完全由 $(\lambda_i,\mathbf{q}_i)$ 决定**。

> [!note] 通信方向：椭圆的三种化身
> - **噪声椭圆**：高斯噪声协方差 $\sigma^2I$ 的特征值相等 ⇒ 等高线是圆（"各向同性噪声"）；有色噪声的协方差不等 ⇒ 椭圆，长轴方向 = 噪声大的方向。**白化滤波器**（whitening）就是把椭圆"掰回"成圆（$\Sigma^{-1/2}$）；
> - **星座图**：QAM 的判决区域被噪声椭圆拉伸后不再对称，最优判决边界因此倾斜；
> - **MIMO 特征模式**：信道协方差的特征值大 = 该"特征波束"增益高；容量 $\propto\sum\log_2(1+\lambda_i\rho/n)$ 就是把这些椭圆逐方向累加。

## 重要应用：最小值判别

二次型"正能量"这个性质，在优化里的角色是"**保证有唯一最小值**"。

考虑二次函数（$A$ 对称）

$$
f(\mathbf{x})=\frac12\mathbf{x}^TA\mathbf{x}-\mathbf{b}^T\mathbf{x}+c
$$

它的**梯度**（gradient）是 $\nabla f=A\mathbf{x}-\mathbf{b}$，令其为零得驻点 $\mathbf{x}=A^{-1}\mathbf{b}$：

> [!tip] 定理 正定 ⟺ 唯一极小值
> - $A$ **正定** ⇒ $f$ 是"碗形"，有**唯一**极小点 $\mathbf{x}=A^{-1}\mathbf{b}$，最小值
>   $$
>   f_{\min}=c-\frac12\mathbf{b}^TA^{-1}\mathbf{b}
>   $$
> - $A$ **半正定但奇异** ⇒ 有"平坦谷"，极小点有无穷多个（或不存在）；
> - $A$ **不定** ⇒ 鞍点（某些方向往上、某些往下）。
> **证明思路**：把 $f$ 在驻点处配方
> $$
> f(\mathbf{x})=f_{\min}+\frac12(\mathbf{x}-\mathbf{x}^*)^TA(\mathbf{x}-\mathbf{x}^*)
> $$
> 后面那一项 $\ge0$（正定），当且仅当 $\mathbf{x}=\mathbf{x}^*$ 取等 ✓

> [!tip] 与第 4 章的接头：法方程就是"碗底"
> 最小二乘要最小化的正是二次函数
> $$
> \|A\mathbf{x}-\mathbf{b}\|^2=\mathbf{x}^TA^TA\mathbf{x}-2\mathbf{b}^TA\mathbf{x}+\mathbf{b}^T\mathbf{b}=\underbrace{\frac12\mathbf{x}^T(2A^TA)\mathbf{x}}_{\text{二次项}}-\underbrace{(2A^T\mathbf{b})^T\mathbf{x}}_{\text{一次项}}+\|\mathbf{b}\|^2
> $$
> 对照上面的标准形式："$A$" ↦ $A^TA$、"$\mathbf{b}$" ↦ $A^T\mathbf{b}$，于是
> 1. $A^TA$ **正定**（列无关）⇒ 碗有唯一底 ⇒ 唯一最小二乘解；
> 2. 驻点条件 $\nabla f=0$ 就是 $A^TA\hat{\mathbf{x}}=A^T\mathbf{b}$——**法方程** ✓
>
> 第 4 章用"投影"（几何）推出法方程，这里用"碗底"（优化）再推一遍：**两条路，同一个答案**。

## 补充材料：特征值与特征向量表

把本章所有"特殊矩阵"的性质汇成一张表（考试与工程速查可用）：

| 矩阵类型 | 特征值 | 特征向量 | 关键结论 |
| --- | --- | --- | --- |
| 对称 $A=A^T$ | **全实** | 可取**正交** | $A=Q\Lambda Q^T$（谱定理）|
| 反对称 $A^T=-A$ | **纯虚**，成对 $\pm i\mu$ | 复、关于复内积正交 | $\operatorname{tr}A=0$ |
| 正交 $Q^TQ=I$ | 全在**单位圆**上 $\lvert\lambda\rvert=1$ | 复 | 保长、可复对角化（第 9 章）|
| 置换 $P$ | $\lvert\lambda\rvert=1$，且 $\lambda=1$ 是特征值 | 结构化 | $\det P=\pm1$ |
| 投影 $P^2=P$ | 只有 $0$ 与 $1$ | 零空间 / 列空间 | $\operatorname{rank}=\operatorname{tr}=$ "1"的个数 |
| 幂等 $A^2=A$ | 只有 $0$ 与 $1$ | — | 一定是某个投影（换基后）|
| **正定** $A>0$ | 全 $>0$ | 正交 | $A=R^TR$；五个等价判据 |
| 半正定 $A\ge0$ | 全 $\ge0$ | 正交 | $A^TA$、协方差矩阵 |
| 奇异 | 含 $\lambda=0$ | 零空间方向 | $\det A=0$ |
| 三角 / 对角 | **对角线元素** | 视结构 | $\det=$ 对角元之积 |
| 秩一 $\mathbf{u}\mathbf{v}^T$ | $\mathbf{v}^T\mathbf{u}$ 与 $n-1$ 个 $0$ | — | $\operatorname{tr}=\mathbf{v}^T\mathbf{u}$ |
| 马尔可夫（列和 1、非负）| $\lambda=1$ 必是；其余 $\lvert\lambda\rvert\le1$ | 稳态向量 | 幂收敛到稳态 |
| $A+cI$ | $\lambda+c$ | 同 $A$ | 平移不变特征向量 |
| $A^k$ | $\lambda^k$ | 同 $A$ | 谱半径决定收敛 |
| $A^{-1}$ | $1/\lambda$ | 同 $A$ | 特征值非零才可逆 |
| $e^{At}$ | $e^{\lambda t}$ | 同 $A$ | 连续版"取幂" |
| 相似 $B=M^{-1}AM$ | 完全相同 | $M^{-1}\mathbf{x}$ | 特征值、迹、行列式都是不变量 |

> [!tip] 本章收官
> 第 6 章的五个小节其实是同一件事的五个侧面：
> 1. **定义**（6.1）：$A\mathbf{x}=\lambda\mathbf{x}$；$\sum\lambda=\operatorname{tr}$、$\prod\lambda=\det$；复特征值 = 旋转；
> 2. **工具**（6.2）：$A=S\Lambda S^{-1}$ —— 换坐标系，让 $A$ 变成对角；幂、递推（斐波那契）、相似不变量都由此而来；
> 3. **演化**（6.3）：$d\mathbf{u}/dt=A\mathbf{u}$ 与 $\mathbf{u}_{k+1}=A\mathbf{u}_k$ —— 特征值管时间（稳定性），特征向量管形状（模态）；
> 4. **最好的一类**（6.4）：对称 ⇒ 实特征值 + 正交特征向量 + $A=Q\Lambda Q^T$ + 谱分解；
> 5. **最有用的子类**（6.5）：正定 ⇒ 能量恒正 ⇒ 唯一最小值（法方程 = 碗底）。
>
> 一句话：**特征值分解是"把矩阵放到它自己的坐标系里看"——一切线性过程（幂、指数、微分方程、二次型）在那个坐标系里都是逐分量的。**

## 本章知识地图

```
特征值与特征向量：矩阵的"自己的坐标系"
  ├─ 6.1 特征值简介
  │      ├── 定义：A x = λ x（x ≠ 0）；特征向量 = A-λI 的零空间里的非零向量
  │      ├── 特征方程 det(A-λI)=0（特征多项式，n 次 → n 个根）
  │      ├── 一行验证的速算表：A+cI → λ+c；A^k → λ^k；A^-1 → 1/λ；A^T → 同 λ
  │      ├── 行列式与迹：Σλ = tr A，Πλ = det A（三角矩阵 λ = 对角元）
  │      │      └── 投影矩阵 λ = 1,0 ⇒ rank = tr = 维数（第 4 章的谜底）
  │      ├── 虚特征值：旋转 λ = e^(±iθ)；反对称 → 纯虚；正交 → |λ| = 1
  │      └── AB 与 A+B：一般不等于 λ 相加相乘；共享特征向量时才成立
  │
  ├─ 6.2 矩阵对角化
  │      ├── A = S Λ S⁻¹（n 个无关特征向量 ⟺ 可对角化；相异特征值 ⟹ 一定可以）
  │      ├── 相似矩阵：相同特征值/迹/行列式/秩；可对角化性
  │      ├── 斐波那契：u_{k+1} = A u_k → F_k = (φ^k − ψ^k)/√5，F_20 = 6765
  │      ├── 幂：A^k = S Λ^k S⁻¹；谱半径 ρ(A) < 1 ⟺ A^k → 0（马尔可夫链的稳态）
  │      ├── 不可对角化：特征向量不够（代数重数 > 几何重数）→ Jordan 型
  │      └── AB 与 BA：非零特征值相同（⟹ tr(AB) = tr(BA)；秩一矩阵 λ = v^T u）
  │
  ├─ 6.3 微分方程组
  │      ├── du/dt = A u 的解 = c₁ e^(λ₁t) x₁ + ⋯（特征值管时间，特征向量管形状）
  │      ├── 二阶微分方程 → 伴随矩阵 A = [[0,1],[-k,-b]]；课本"特征方程"就是它的特征多项式
  │      ├── 差分方程：连续 e^(λt) ↔ 离散 λ^k；Re λ < 0 ↔ |λ| < 1
  │      ├── 2×2 稳定性：稳定 ⟺ tr < 0 且 det > 0；抛物线 det = tr²/4 分实/复特征值
  │      ├── 矩阵指数 e^(At) = S e^(Λt) S⁻¹；u(t) = e^(At) u(0)
  │      └── 补充：极点 = 特征值；e^(st) 是 LTI 的特征函数；ζ 与 ω_n 的三种阻尼
  │
  ├─ 6.4 对称矩阵
  │      ├── 特征值全实（证明用共轭转置）；非对称才可能"旋转"
  │      ├── 相异特征值 ⇒ 特征向量正交
  │      └── 谱定理 A = Q Λ Q^T；谱分解 A = Σ λ_i q_i q_i^T（投影矩阵的加权和）
  │
  └─ 6.5 正定矩阵
         ├── 定义 x^T A x > 0（能量）；五个等价判据（能量/特征值/顺序主子式/主元/R^T R）
         ├── 半正定：λ ≥ 0；A^T A 永远半正定，正定 ⟺ 列无关（第 4 章的谜底）
         ├── 椭圆 a x² + 2bxy + c y² = 1：半轴方向 = 特征向量，半轴长 = 1/√λ
         ├── 最小值：f = ½x^T A x − b^T x + c 正定 ⇒ 唯一极小点 A^-1 b（法方程 = 碗底）
         └── 补充：特征值与特征向量总表
```

## 关联

- 上一章：[[vault-notes/math/linear-algebra/05-determinants]]
- 下一章：[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]

**本章与前面章节的接口**（前四章的伏笔在这里收网）：

| 前面的悬念 | 第 6 章的答案 |
| --- | --- |
| 第 5 章：$\det A=\prod\lambda_i$？ | 就是本章的"特征值之积 = 行列式"（6.1） |
| 第 5 章：三角矩阵 $\det$ = 对角元之积 | 因为三角矩阵的特征值就是对角元（6.1） |
| 第 5 章：$\operatorname{tr}(P)=\operatorname{rank}(P)$（第 4 章提过） | 投影矩阵的特征值只取 1 和 0，1 的个数 = 维数 = 迹 = 秩（6.1） |
| 第 5 章：奇异 $\iff\det=0$ | 奇异 $\iff$ 有零特征值（零空间里就有特征向量）（6.1） |
| 第 4 章：$A^TA$ 可逆 $\iff$ 列无关 | $A^TA$ 半正定；**可逆 $\iff$ 正定**（6.5） |
| 第 4 章：投影矩阵 $P^2=P$、$P^T=P$ | 幂等 ⇒ $\lambda\in\{0,1\}$；对称 ⇒ 可正交对角化（6.4） |
| 第 4 章：条件数决定数值误差 | 条件数 = 特征值扩散 $\lambda_{\max}/\lambda_{\min}$，也决定迭代收敛速度（6.5） |
| 第 3 章：秩 = 独立方向数 | 可对角化时**秩 = 非零特征值的个数**（6.1） |

**通信方向应用**：

- [[vault-notes/5g/phy/04-physical-channels-signals]] —— **MIMO 的一切都在做特征分解**：信道相关矩阵 $R=E[\mathbf{h}\mathbf{h}^H]$ 的特征向量给出互相正交的"**特征波束**"（eigenbeam），特征值给出各波束的**增益**；容量公式里的 $\det$ 被谱分解拆成 $\sum_i\log_2(1+\lambda_i\rho/n)$（第 7 章）；波束赋形/预编码就是"沿特征向量方向发射"；空间复用层数的上限 = 非零特征值个数；而**干扰归零**只对某些特征方向可行，这就是自由度的几何来源（第 4 章）。
- [[vault-notes/communication/09-optimal-reception]] —— 复指数 $e^{j2\pi ft}$ 是 LTI 系统的**特征函数**（特征值就是频率响应 $H(f)$），这是本章"特征值/特征向量"在函数空间上的推广；相关接收的判决统计量 = 投影（第 4 章）＋ 各信号方向的"能量" = 特征值；而匹配滤波器的输出信噪比正是信号能量在"特征方向"上的投影（6.5 的能量视角）。
- [[vault-notes/math/linear-algebra/10-applications]] —— **马尔可夫矩阵的稳态 = $\lambda=1$ 的特征向量**（人口模型、PageRank；对应 10.3 马尔可夫矩阵、人口和经济）；**图的拉普拉斯矩阵**的特征值刻画连通性与"割"的大小（谱聚类、网络分簇；对应 10.1 图和网络）；差分方程 $\mathbf{u}_{k+1}=A\mathbf{u}_k$ 就是离散时间系统（10.2 工程学中的矩阵）。
- [[vault-notes/math/linear-algebra/07-singular-value-decomposition]] —— SVD 与本章是"同一件事的两半"：$A^TA$ 的特征值 = $\sigma_i^2$、特征向量 = SVD 的 $V$；对**对称正定**矩阵，特征分解就是 SVD；第 7 章的主成分分析（PCA）逐字就是"协方差矩阵的特征分解"，而"用幂法求主特征向量"给了它迭代实现。
- [[vault-notes/math/linear-algebra/04-orthogonality]] —— 谱定理 $A=Q\Lambda Q^T$ 里那个 $Q$ 就是第 4 章的正交矩阵；谱分解 $A=\sum\lambda_i\mathbf{q}_i\mathbf{q}_i^T$ 里每一项都是第 4 章的**秩一投影矩阵**。**"对称矩阵 = 一组互相垂直的投影的加权和"** 这句话，把第 4 章和第 6 章缝在了一起。
- [[vault-notes/math/linear-algebra/03-vector-spaces-subspaces]] —— 特征向量所在的"直线"是一维子空间（**特征空间**，eigenspace）；对称矩阵把 $\mathbb{R}^n$ **正交地**分解成 $n$ 条特征直线（$\mathbb{R}^n=\bigoplus E_{\lambda_i}$），比第 3 章的一般直和更强；而"不可对角化"就是"特征子空间维数不够填满空间"。

**相关**：[[vault-notes/math/linear-algebra/05-determinants]]｜[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]｜[[vault-notes/math/linear-algebra/04-orthogonality]]
