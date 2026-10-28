---
title: 线性代数基础
description: 从向量、矩阵与高斯消元到子空间、秩与行列式：线性代数如何描述信号、滤波器和 DFT。
tags:
  - mathematics
  - linear-algebra
  - matrices
---

## 为什么线性代数是信号处理的母语

一段长度为 $N$ 的离散信号就是一个向量，一个线性时不变系统就是一台矩阵乘法，而 DFT 是"换一组正交基再看同一个信号"。把这些话变成可计算的式子，后面的滤波器设计、信道估计、MIMO 预编码才有共同语言。本文按"向量 → 矩阵 → 方程组 → 向量空间 → 行列式"的顺序展开，目标不是学会手算，而是**看懂公式在做什么、条件是否满足、什么时候不能直接求逆**。

本章的后续三篇分别深入：[[mathematics/orthogonality-least-squares|正交性与最小二乘]]、[[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]]、[[mathematics/linear-transformations-numerics|线性变换与数值稳定性]]。

## 向量、点积与线性组合

$\mathbb{R}^n$ 中的向量是有序的 $n$ 元组。只有两种"原子运算"：加法 $\mathbf{v}+\mathbf{w}$ 与数乘 $c\mathbf{v}$；由它们组合出**线性组合** $c_1\mathbf{v}_1+\cdots+c_k\mathbf{v}_k$。一组向量的全部线性组合构成**张成空间**（span）。

**点积**（内积）把长度和角度打包成一个数：

$$
\mathbf{v}\cdot\mathbf{w}=\sum_{i=1}^{n}v_iw_i,\qquad
\|\mathbf{v}\|=\sqrt{\mathbf{v}\cdot\mathbf{v}},\qquad
\cos\theta=\frac{\mathbf{v}\cdot\mathbf{w}}{\|\mathbf{v}\|\,\|\mathbf{w}\|}
$$

两个非零向量**正交**（夹角 $90^\circ$）当且仅当点积为零。点积是对称、双线性的，且对任意实数 $t$ 有

$$
\|\mathbf{v}-t\mathbf{w}\|^2=\|\mathbf{v}\|^2-2t(\mathbf{v}\cdot\mathbf{w})+t^2\|\mathbf{w}\|^2\ \ge 0
$$

取 $t=(\mathbf{v}\cdot\mathbf{w})/\|\mathbf{w}\|^2$（最优缩放）代入，就得到**施瓦茨不等式**：

$$
|\mathbf{v}\cdot\mathbf{w}|\le\|\mathbf{v}\|\,\|\mathbf{w}\|
$$

等号成立当且仅当两向量共线。由此可得三角不等式 $\|\mathbf{v}+\mathbf{w}\|\le\|\mathbf{v}\|+\|\mathbf{w}\|$，以及"几何平均不超过算术平均"：取 $\mathbf{v}=(\sqrt a,\sqrt b)$、$\mathbf{w}=(\sqrt b,\sqrt a)$ 代入即得 $\sqrt{ab}\le(a+b)/2$。这些不等式不是装饰，后面证明最小二乘的"最短性"、估计量的方差下界都要用。

**例**：$`\mathbf a=(1,2,2)`$、$`\mathbf b=(1,1,1)`$，则 $`\mathbf a\cdot\mathbf b=5`$，$`\|\mathbf a\|=3`$，$`\|\mathbf b\|=\sqrt3`$，$`\cos\theta=5/(3\sqrt3)\approx0.962`$。

对信号而言，$`\|\mathbf x\|^2=\sum x_i^2`$ 是能量，互相关就是内积；"正交"就是"互不干扰"。DFT 之所以能把不同频率分开，正是因为它的基向量两两正交（见 [[signal-processing/dft-and-fft|DFT 与 FFT]]）。

## 矩阵：线性变换与列的线性组合

矩阵乘向量应读成**列的线性组合**：

$$
A\mathbf{x}=\sum_{k=1}^{n}x_k\,\mathbf{a}_k
$$

其中 $\mathbf{a}_k$ 是 $A$ 的第 $k$ 列。于是"$A\mathbf{x}=\mathbf{b}$ 有解"等价于"$\mathbf{b}$ 落在 $A$ 的列空间里"。矩阵乘法有四种等价视角：行点乘列、列的线性组合、行的线性组合、列乘行之和（外积之和，秩 1 分解，直接通向 [[mathematics/eigenvalues-svd|SVD]]）。

转置满足 $(AB)^{T}=B^{T}A^{T}$（顺序反转），因此 $A^{T}A$ 一定对称。**逆矩阵** $A^{-1}$ 是使 $AA^{-1}=I$ 的唯一矩阵；$n\times n$ 矩阵可逆的等价判据有：$n$ 个主元、$\det A\ne0$、$n$ 列线性无关、$A\mathbf{x}=\mathbf{b}$ 对任意 $\mathbf{b}$ 有唯一解、零空间只含零向量。$(AB)^{-1}=B^{-1}A^{-1}$，且逆矩阵的列就是"逐个解单位向量方程组"的结果——这也是高斯–约尔当消元 $[A\mid I]\to[I\mid A^{-1}]$ 的原理。

> [!warning] 矩阵乘法不可交换
> $AB\ne BA$ 不只是代数细节：先滤波再采样与先采样再滤波结果不同，正是矩阵不可交换的物理版本。

## 线性方程组与高斯消元

### 消元在做什么

解 $A\mathbf{x}=\mathbf{b}$ 的标准算法是**高斯消元**：用主元（pivot）把主元下方的元素消成零，化成上三角，再回代。每次消元只用"把某一行的倍数加到另一行"，这种行变换不改变方程组的解集；把所有行变换合成起来就是左乘一串初等矩阵 $E$，最终 $EA=U$。

**例**：

$$
\begin{cases}
2x+y-z=8\\
-3x-y+2z=-11\\
-2x+y+2z=-3
\end{cases}
$$

第一步用主元 $2$ 消去下方两个 $-3$ 与 $-2$，乘数分别为 $-3/2$ 与 $-1$；第二步用新主元 $1/2$ 消去剩余项，乘数为 $4$。增广矩阵化为

$$
\left[\begin{array}{ccc|c}
2&1&-1&8\\
0&\tfrac12&\tfrac12&1\\
0&0&-1&1
\end{array}\right]
$$

回代得 $z=-1$、$y=3$、$x=2$。手工验证：$2\cdot2+3-(-1)=8$ ✓。

### 消元失败与补救

- **零主元但下方有非零元**：交换行即可（对应置换矩阵 $P$），于是实际分解是 $PA=LU$。
- **出现 $0=\text{非零}$**：方程组无解。
- **出现 $0=0$**：存在自由变量，无穷多解。

### LU 分解与计算量

消元过程可以写成 $A=LU$：$L$ 是单位下三角矩阵，元素就是消元乘数；$U$ 是上三角结果。于是解方程变成两步三角形回代：

$$
A\mathbf{x}=LU\mathbf{x}=\mathbf{b}
\ \Longrightarrow\
L\mathbf{c}=\mathbf{b}\ (\text{前向替换}),\quad U\mathbf{x}=\mathbf{c}\ (\text{回代})
$$

**同一矩阵、多个右端**时，只分解一次即可反复使用。运算量方面，稠密 $n$ 阶消元约需 $n^3/3$ 次乘除（按"乘加各算一次"计约 $2n^3/3$ 次浮点运算），回代约 $n^2/2$；显式求逆约 $n^3$ 且数值性质更差。$n=10^5$ 时稠密分解已不可行，必须利用带状、稀疏或迭代方法（见 [[mathematics/linear-transformations-numerics|线性变换与数值稳定性]]）。

## 向量空间、秩与零空间

### 子空间与两个主角

向量空间是对加法与数乘封闭的集合；子空间还要求包含零向量。矩阵带来两个关键子空间：

- **列空间** $C(A)\subseteq\mathbb{R}^m$：$A$ 的各列张成的空间，$A\mathbf{x}=\mathbf{b}$ 有解 $\iff$ $\mathbf{b}\in C(A)$。
- **零空间** $N(A)\subseteq\mathbb{R}^n$：所有满足 $A\mathbf{x}=\mathbf{0}$ 的 $\mathbf{x}$ 的集合，它一定是子空间。

把 $A$ 化为**最简行阶梯形** $R$，主元所在列对应基本变量，其余列对应自由变量。若 $R=[I\ F;\ 0\ 0]$（忽略行列重排），则零空间的一组基是

$$
\begin{bmatrix}-F\\ I\end{bmatrix}
$$

即每个自由变量取 1、其余取 0 得到的"特殊解"。

### 秩–零化度定理

**秩** $r=\operatorname{rank}(A)$ 等于主元个数、线性无关列的个数、$\dim C(A)$。于是

$$
\dim C(A)=r,\qquad \dim N(A)=n-r\quad(\text{秩–零化度定理})
$$

对转置还有 $\dim C(A^{T})=r$、$\dim N(A^{T})=m-r$。四个子空间两两配对正交：行空间 $\perp$ 零空间、列空间 $\perp$ 左零空间，这解释了"有解第三判据"：$A\mathbf{x}=\mathbf{b}$ 有解 $\iff$ $\mathbf{b}\perp N(A^{T})$。

方程组 $A\mathbf{x}=\mathbf{b}$ 的通解是"特解 + 零空间"：

$$
\mathbf{x}=\mathbf{x}_p+\mathbf{x}_n,\qquad \mathbf{x}_n\in N(A)
$$

**存在性**看 $\mathbf{b}$ 是否落在列空间，**唯一性**看零空间是否只有零向量。两个问题相互独立，这是线性代数里最值得记住的"分工"。

**例**：$A=\begin{bmatrix}1&1&2\\2&1&3\\3&1&4\\4&1&5\end{bmatrix}$。第三列等于前两列之和，故 $r=2$；零空间是一维的，基向量可取 $(1,1,-1)^{T}$（验证：列 1 + 列 2 − 列 3 = 0）。$m=4,n=3$，于是四个子空间维数分别为 $2,1,2,2$，加起来正好覆盖 $\mathbb{R}^3$ 与 $\mathbb{R}^4$。

## 行列式：体积、可逆性与消元

### 三条基本性质定义一切

行列式不是"背公式"，而是由三条性质唯一确定的"带符号体积缩放因子"：

1. $\det I=1$；
2. 交换两行，行列式变号；
3. 固定其他行，行列式对某一行是线性的。

由此推出：两行相同 $\Rightarrow\det=0$；把一行的倍数加到另一行不改变行列式（消元不改变它）；上三角矩阵的行列式等于对角元之积；$\det(AB)=\det A\det B$；$\det(A^{T})=\det A$；$\det(cA)=c^{n}\det A$；$A$ 可逆 $\iff$ $\det A\ne0$，且 $\det(A^{-1})=1/\det A$。二阶公式 $\det A=ad-bc$ 是这三条性质的推论，不是起点。

### 计算：主元公式与代数余子式

消元给出最实用的公式：若 $PA=LU$，则

$$
\det A=(-1)^{p}\prod_{i=1}^{n}u_{ii}
$$

其中 $p$ 是行交换次数。这是 $O(n^3)$ 的工程正解；而按定义展开要 $n!$ 项，$n=20$ 就已不可算。

代数余子式展开适合证明与小型矩阵：$C_{ij}=(-1)^{i+j}M_{ij}$（$M_{ij}$ 为划去第 $i$ 行第 $j$ 列的子式），沿任意一行或一列有 $\det A=\sum_j a_{ij}C_{ij}$；"错行"相加得 0，这正是伴随矩阵公式 $A^{-1}=C^{T}/\det A$ 的来源。**克拉默法则** $x_j=\det B_j/\det A$（$B_j$ 为第 $j$ 列换成 $\mathbf{b}$）形式漂亮，但计算量为阶乘级，只适合理论推导。

### 几何意义

$|\det A|$ 是线性变换对面积/体积的放大倍数：平行四边形面积、平行六面体体积都等于相应行列式的绝对值；$\det A=0$ 表示变换把空间压到更低维（降秩），因此不可逆。三重积 $(\mathbf{u}\times\mathbf{v})\cdot\mathbf{w}=\det[\mathbf{u}\ \mathbf{v}\ \mathbf{w}]$ 把叉积、体积与行列式统一起来。多维高斯密度的归一化因子 $(\det V)^{-1/2}$ 也来自这里——它保证概率密度积分为 1（见 [[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]]）。

## 用 Python 验证

```python
import numpy as np

A = np.array([[2.0, 1, -1],
              [-3, -1, 2],
              [-2, 1, 2]])
b = np.array([8.0, -11, -3])

x = np.linalg.solve(A, b)          # 内部走 LU + 部分主元，不要用 inv(A) @ b
print("解:", x)                     # [2. 3. -1.]
print("det:", np.linalg.det(A))     # -1.0

# 验证秩与零空间：列 3 = 列 1 + 列 2
B = np.array([[1, 1, 2], [2, 1, 3], [3, 1, 4], [4, 1, 5]], dtype=float)
print("rank:", np.linalg.matrix_rank(B))          # 2
u, s, vh = np.linalg.svd(B)
print("null vector:", np.round(vh[-1], 3))        # ±(1, 1, -1)/sqrt(3)

# DFT 矩阵：列两两正交，F^H F = N I
N = 8
n = np.arange(N)
F = np.exp(-2j * np.pi * np.outer(n, n) / N)
print("F^H F / N = I ?", np.allclose(F.conj().T @ F, N * np.eye(N)))
```

> [!tip] 用矩阵语言读 DFT
> DFT 矩阵 $F_{kn}=e^{-j2\pi kn/N}$ 的行（或列）构成一组正交基，$\frac{1}{\sqrt N}F$ 是酉矩阵。正变换是"求坐标"，反变换是"用共轭转置合成"，Parseval 定理就是"正交变换保能量"。卷积矩阵（Toeplitz 下三角）则把"滤波器 = 矩阵乘法"写成了显式形式。

## 易错点

> [!warning] 五个高频错误
> 1. **把消元当成"随便变形"**：只有"某行加另一行的倍数""交换两行""某行乘非零数"保持解集；对列做同样操作会改变解。
> 2. **认为 $\det A=0$ 只发生在明显的零行**：接近奇异的矩阵行列式很小但不为零，数值上依然危险，要看条件数而不是只看行列式。
> 3. **混淆行空间与列空间**：$A\mathbf{x}=\mathbf{b}$ 看列空间；$A^{T}\mathbf{y}=\mathbf{c}$ 才看行空间。
> 4. **用 $A^{-1}\mathbf{b}$ 解方程**：显式求逆更慢且误差更大，工程上用分解法（`np.linalg.solve`、MATLAB 的 `\`）。
> 5. **忘记满秩条件就对 $A^{T}A$ 求逆**：$A$ 列相关时 $A^{T}A$ 奇异，最小二乘解不唯一，要用伪逆（见下一篇）。

## 前置与下一步

前置：实数运算、复数基本运算。下一步按顺序阅读 [[mathematics/orthogonality-least-squares|正交性与最小二乘]]（投影、法方程、QR）、[[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]]（谱分解、PCA、MIMO）、[[mathematics/linear-transformations-numerics|线性变换与数值稳定性]]（换基、条件数、迭代法）。

相关应用：[[signal-processing/dft-and-fft|DFT 与 FFT]]、[[communication/digital-modulation-qpsk|数字调制 QPSK]]、[[signal-processing/random-processes|随机信号、估计与检测]]。

## 来源与延伸阅读

- [[vault-notes/math/linear-algebra/01-vector-introduction|向量引论（详细笔记）]]：点积、长度、施瓦茨不等式、矩阵与逆矩阵、循环差分矩阵。
- [[vault-notes/math/linear-algebra/02-solving-linear-systems|线性方程组的求解（详细笔记）]]：行/列图像、消元与乘数、矩阵乘法的四种视角、$A=LU$、$PA=LU$、运算量。
- [[vault-notes/math/linear-algebra/03-vector-spaces-subspaces|向量空间与子空间（详细笔记）]]：列空间、零空间、RREF、秩、全解结构、四子空间维数。
- [[vault-notes/math/linear-algebra/05-determinants|行列式（详细笔记）]]：十条性质、排列公式、主元公式、代数余子式、克拉默法则、面积与体积。
