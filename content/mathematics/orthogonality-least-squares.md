---
title: 正交性与最小二乘
description: 从四子空间的正交关系到投影、法方程与 QR 分解：如何用最小二乘在矛盾方程组中求最优近似。
tags:
  - mathematics
  - linear-algebra
  - least-squares
---

## 为什么需要"最优近似"

测量总比未知数多：用三个时刻的数据拟合一条直线是两个未知数配三个方程，用 $N_p$ 个导频估计 $N_t$ 个信道系数也常常 $N_p>N_t$。方程多于未知数时，$A\mathbf{x}=\mathbf{b}$ 一般**无解**。工程上正确的问法不是"哪个解对"，而是：

> 找不到让 $A\mathbf{x}$ 恰好等于 $\mathbf{b}$ 的 $\mathbf{x}$，就找让误差 $\|\mathbf{b}-A\mathbf{x}\|$ 最小的那个。

这个问题的答案就是**投影**，而"残差与观测正交"是它的判别条件。正交性原理不只属于最小二乘：匹配滤波、MMSE 估计、卡尔曼滤波的推导都落在同一句话上（见 [[signal-processing/random-processes|随机信号、估计与检测]]）。

## 内积、正交补与四子空间

在 $\mathbb{R}^n$（或 $\mathbb{C}^n$）中定义内积后，才能谈"垂直"。两个子空间 $U,V$ 正交指任意 $\mathbf{u}\in U,\mathbf{v}\in V$ 都正交；$U$ 的**正交补** $U^{\perp}$ 是与 $U$ 中所有向量正交的向量集合，且

$$
\dim U+\dim U^{\perp}=n,\qquad U\cap U^{\perp}=\{\mathbf{0}\}
$$

于是 $\mathbb{R}^n$ 中每个向量都能唯一分解为 $U$ 分量与 $U^{\perp}$ 分量之和。

矩阵的基本定理（第二部分）给出四子空间的正交配对：

$$
N(A)=C(A^{T})^{\perp},\qquad N(A^{T})=C(A)^{\perp}
$$

**证明**（第一式）：$\mathbf{x}\in N(A)$ 意味着 $A\mathbf{x}=\mathbf{0}$，即 $\mathbf{x}$ 与 $A$ 的每一行正交，也就是与行空间 $C(A^{T})$ 正交；反过来，若 $\mathbf{x}\perp C(A^{T})$，则 $\mathbf{x}$ 与每一行正交，故 $A\mathbf{x}=\mathbf{0}$。两个方向合起来即得。第二式对 $A^{T}$ 重复一遍即可。

维数一算就吻合：$r+(n-r)=n$，$r+(m-r)=m$。这也解释了"$A$ 把行空间一一送到列空间，把零空间压成零"：对行空间中的 $\mathbf{x}$，$A\mathbf{x}\ne\mathbf{0}$（除非 $\mathbf{x}=\mathbf{0}$）；对零空间中的 $\mathbf{x}$，$A\mathbf{x}=\mathbf{0}$。把行空间的一组基与零空间的一组基合并，就得到整个 $\mathbb{R}^n$ 的基（列空间同理）。

> [!note] 和 DFT 的联系
> DFT 矩阵的行空间就是整个 $\mathbb{C}^N$（满秩），零空间只有零向量；它的列两两正交，因此 $\frac{1}{\sqrt N}F$ 是酉矩阵。正交基让"投影系数"可以逐个独立计算，这正是正变换与反变换公式的来源。

## 到直线与子空间的投影

### 到直线：一条方程定出缩放

把 $\mathbf{b}$ 投影到 $\mathbf{a}$ 张成的直线上：落点必须形如 $t\mathbf{a}$，误差 $\mathbf{e}=\mathbf{b}-t\mathbf{a}$ 必须垂直直线。两个条件合成一条方程：

$$
\mathbf{a}\cdot(\mathbf{b}-t\mathbf{a})=0
\quad\Longrightarrow\quad
t=\frac{\mathbf{a}^{T}\mathbf{b}}{\mathbf{a}^{T}\mathbf{a}}
$$

写成矩阵形式，投影矩阵是**秩一矩阵**：

$$
\mathbf{p}=t\mathbf{a}=\frac{\mathbf{a}\mathbf{a}^{T}}{\mathbf{a}^{T}\mathbf{a}}\mathbf{b}
=P\mathbf{b},
\qquad
P=\frac{\mathbf{a}\mathbf{a}^{T}}{\mathbf{a}^{T}\mathbf{a}}
$$

注意形状：$\mathbf{a}\mathbf{a}^{T}$ 是 $n\times n$ 矩阵（列乘行），$\mathbf{a}^{T}\mathbf{a}$ 是一个数。投影矩阵的两个"身份证"：

$$
P^{2}=P\quad(\text{幂等：再投一次不变}),\qquad
P^{T}=P\quad(\text{对称：垂直投影而非斜投影})
$$

且 $\operatorname{rank}(P)=1=\operatorname{tr}(P)$——秩给出落点空间的维数，迹的循环性质 $\operatorname{tr}(AB)=\operatorname{tr}(BA)$ 让这个等式一行成立。

**例**：$\mathbf{a}=(1,2,2)$、$\mathbf{b}=(1,1,1)$。$\mathbf{a}^{T}\mathbf{b}=5$，$\mathbf{a}^{T}\mathbf{a}=9$，故

$$
\mathbf{p}=\frac59\begin{bmatrix}1\\2\\2\end{bmatrix}
=\begin{bmatrix}5/9\\10/9\\10/9\end{bmatrix},
\qquad
\mathbf{e}=\mathbf{b}-\mathbf{p}=\frac19\begin{bmatrix}4\\-1\\-1\end{bmatrix}
$$

验证 $\mathbf{e}\perp\mathbf{a}$：$4-2-2=0$ ✓。对应的 $P=\frac19\begin{bmatrix}1&2&2\\2&4&4\\2&4&4\end{bmatrix}$。

**为什么投影点是最近的？** 取直线上任意另一点 $\mathbf{p}'$，则 $\mathbf{b}-\mathbf{p}'=\mathbf{e}+(\mathbf{p}-\mathbf{p}')$，两项互相正交，勾股定理给出

$$
\|\mathbf{b}-\mathbf{p}'\|^{2}=\|\mathbf{e}\|^{2}+\|\mathbf{p}-\mathbf{p}'\|^{2}\ge\|\mathbf{e}\|^{2}
$$

等号仅在 $\mathbf{p}'=\mathbf{p}$ 时成立。所以"垂直"恰好等价于"距离最短"——**投影就是最优逼近**。

### 到子空间：法方程

设 $A=(\mathbf{a}_1,\dots,\mathbf{a}_n)$ 的列是子空间 $S=C(A)$ 的一组基，投影点写成 $\mathbf{p}=A\hat{\mathbf{x}}$，并要求 $\mathbf{b}-A\hat{\mathbf{x}}\perp S$。因为 $S$ 由各列张成，"与子空间正交"等价于"与每一列正交"，即 $A^{T}(\mathbf{b}-A\hat{\mathbf{x}})=\mathbf{0}$，整理得**法方程**（normal equations）：

$$
A^{T}A\hat{\mathbf{x}}=A^{T}\mathbf{b}
$$

于是

$$
\hat{\mathbf{x}}=(A^{T}A)^{-1}A^{T}\mathbf{b},
\qquad
\mathbf{p}=A(A^{T}A)^{-1}A^{T}\mathbf{b},
\qquad
P=A(A^{T}A)^{-1}A^{T}
$$

> [!warning] 条件：$A$ 的列必须线性无关
> 法方程的解唯一当且仅当 $A^{T}A$ 可逆，而 $A^{T}A$ 可逆 $\iff$ $A$ 的列线性无关。证明：$A^{T}A\mathbf{x}=\mathbf{0}\Rightarrow\mathbf{x}^{T}A^{T}A\mathbf{x}=\|A\mathbf{x}\|^{2}=0\Rightarrow A\mathbf{x}=\mathbf{0}\Rightarrow\mathbf{x}=\mathbf{0}$。换句话说，**数据点必须比参数多，且参数之间不能冗余**。秩亏时要取最小范数解，用伪逆（见 [[mathematics/eigenvalues-svd|SVD]]）。

投影矩阵的推广性质：$P^{2}=P$、$P^{T}=P$、$\operatorname{rank}(P)=\operatorname{tr}(P)=\dim S$，且 $I-P$ 是投向 $S^{\perp}$ 的投影矩阵。

## 最小二乘：同一个答案的三种说法

**定义**：

$$
\hat{\mathbf{x}}=\arg\min_{\mathbf{x}}\ \|A\mathbf{x}-\mathbf{b}\|^{2}
$$

平方和 $\|A\mathbf{x}-\mathbf{b}\|^{2}=\sum_i(\text{第 }i\text{ 个方程左边}-b_i)^2$ 就是"平方误差之和"，"最小二乘"因此得名。三种等价刻画：

$$
\underbrace{A^{T}A\hat{\mathbf{x}}=A^{T}\mathbf{b}}_{\text{代数：法方程}}
\iff
\underbrace{A^{T}(\mathbf{b}-A\hat{\mathbf{x}})=\mathbf{0}}_{\text{几何：残差}\perp\text{列空间}}
\iff
\underbrace{\mathbf{e}\in N(A^{T})}_{\text{空间：落在左零空间}}
$$

**几何证明**：$A\mathbf{x}$ 只能取遍列空间 $S$，最小化 $\|A\mathbf{x}-\mathbf{b}\|$ 就是找 $S$ 中离 $\mathbf{b}$ 最近的点，那正是投影 $\mathbf{p}=A\hat{\mathbf{x}}$，其特征是 $\mathbf{b}-\mathbf{p}\perp S$。

**代数证明**（顺带证明唯一性）：记 $E(\mathbf{x})=\|A\mathbf{x}-\mathbf{b}\|^{2}=\mathbf{x}^{T}A^{T}A\mathbf{x}-2\mathbf{x}^{T}A^{T}\mathbf{b}+\mathbf{b}^{T}\mathbf{b}$。在 $\hat{\mathbf{x}}$ 上加扰动 $\boldsymbol{\delta}$：

$$
E(\hat{\mathbf{x}}+\boldsymbol{\delta})
=E(\hat{\mathbf{x}})+2\boldsymbol{\delta}^{T}(A^{T}A\hat{\mathbf{x}}-A^{T}\mathbf{b})+\|A\boldsymbol{\delta}\|^{2}
=E(\hat{\mathbf{x}})+\|A\boldsymbol{\delta}\|^{2}\ge E(\hat{\mathbf{x}})
$$

只要 $\hat{\mathbf{x}}$ 满足法方程，中间项消失，剩下的 $\|A\boldsymbol{\delta}\|^{2}\ge0$ 说明"往哪走都不更低"；当 $A$ 列满秩时 $A\boldsymbol{\delta}=\mathbf{0}$ 只有零解，故最小值唯一。

最小二乘的全局图是一张直角三角形：$\mathbf{b}=\mathbf{p}+\mathbf{e}$，$\mathbf{p}\in C(A)$，$\mathbf{e}\in N(A^{T})=C(A)^{\perp}$，因此

$$
\|\mathbf{b}\|^{2}=\|\mathbf{p}\|^{2}+\|\mathbf{e}\|^{2}
$$

### 直线拟合例题

三个时刻测得 $(t,b)=(1,1),(2,2),(3,4)$，用 $b=C+Dt$ 概括趋势。三个方程、两个未知数：

$$
\underbrace{\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix}}_{A}
\begin{bmatrix}C\\D\end{bmatrix}
=
\underbrace{\begin{bmatrix}1\\2\\4\end{bmatrix}}_{\mathbf{b}}
$$

法方程：

$$
A^{T}A=\begin{bmatrix}3&6\\6&14\end{bmatrix},
\qquad
A^{T}\mathbf{b}=\begin{bmatrix}7\\17\end{bmatrix}
$$

解得 $D=3/2$、$C=-2/3$，即拟合直线 $b=\frac32t-\frac23$。残差为 $b-A\hat{\mathbf{x}}=(\frac16,-\frac16,-\frac16)^{T}$，三个残差之和为 0（因为第一列全 1 在列空间中，$\mathbf{e}\perp\mathbf{1}$），这也解释了"最小二乘直线必过样本重心 $(\bar t,\bar b)=(2,7/3)$"。

> [!warning] 高次拟合的病态
> 用幂基 $1,t,t^2,\dots$ 做高阶多项式拟合时，$A^{T}A$ 的条件数随阶数迅速恶化（希尔伯特矩阵型），法方程和直接解都会失真。这时必须换正交基或改用 QR/SVD，而不是硬解法方程。

### 加权最小二乘（了解）

不同观测精度不同时，最小化 $(A\mathbf{x}-\mathbf{b})^{T}W(A\mathbf{x}-\mathbf{b})$，$W$ 为对称正定的权矩阵，得到

$$
A^{T}WA\hat{\mathbf{x}}=A^{T}W\mathbf{b}
$$

高信噪比的观测权重更大。它和"广义最小二乘""白化后最小二乘"是同一件事，也是卡尔曼滤波中量测更新的雏形。

## 标准正交基、Gram–Schmidt 与 QR

若列向量两两正交且长度为 1（$Q^{T}Q=I$），投影公式大大简化：不用求逆，坐标就是内积

$$
\hat{\mathbf{x}}=Q^{T}\mathbf{b},\qquad \mathbf{p}=QQ^{T}\mathbf{b}
$$

正交矩阵（方阵时 $Q^{T}Q=I$）保长度、保内积、条件数为 1，是数值计算中最安全的变换。

**Gram–Schmidt 正交化**：从线性无关的 $\mathbf{a}_1,\dots,\mathbf{a}_n$ 逐个减去在已有正交方向上的投影：

$$
\mathbf{q}_1=\frac{\mathbf{a}_1}{\|\mathbf{a}_1\|},
\qquad
\mathbf{v}_k=\mathbf{a}_k-\sum_{i<k}(\mathbf{q}_i^{T}\mathbf{a}_k)\mathbf{q}_i,
\qquad
\mathbf{q}_k=\frac{\mathbf{v}_k}{\|\mathbf{v}_k\|}
$$

**例**：$\mathbf{a}_1=(1,1,0)^{T}$、$\mathbf{a}_2=(1,0,1)^{T}$。$\mathbf{q}_1=(1,1,0)^{T}/\sqrt2$；$\mathbf{v}_2=\mathbf{a}_2-\frac12\mathbf{a}_1=(\frac12,-\frac12,1)^{T}$，$\|\mathbf{v}_2\|=\sqrt{3/2}$，故 $\mathbf{q}_2=(1,-1,2)^{T}/\sqrt6$。验证 $\mathbf{q}_1^{T}\mathbf{q}_2=(1-1+0)/\sqrt{12}=0$ ✓。

把过程写成矩阵形式就是 **$A=QR$**：$Q$ 的列是标准正交基（方向），$R$ 是上三角矩阵（每个新方向"新贡献"的大小）。此时最小二乘化为

$$
A\mathbf{x}=QR\mathbf{x}\approx\mathbf{b}
\quad\Longrightarrow\quad
R\hat{\mathbf{x}}=Q^{T}\mathbf{b}
$$

只需求解上三角方程组，不用组 $A^{T}A$。数值实现中常用**改进 Gram–Schmidt（MGS）**或 **Householder 变换**：经典 GS 在列接近相关时会丢正交性，工程库一般不用它。

> [!tip] 求最小二乘的三种方法
> | 方法 | 做法 | 稳定性 | 秩亏时 |
> | --- | --- | --- | --- |
> | 法方程 | 解 $A^{T}A\hat{\mathbf{x}}=A^{T}\mathbf{b}$ | 差（条件数平方） | 不可用 |
> | QR | 解 $R\hat{\mathbf{x}}=Q^{T}\mathbf{b}$ | 好 | 需特殊处理 |
> | SVD / 伪逆 | $\hat{\mathbf{x}}=A^{+}\mathbf{b}$ | 最好 | 自动给出最小范数解 |
>
> 工程约定：常规问题用 QR（MATLAB 的 `\`、NumPy 的 `lstsq` 内部即如此），接近奇异或秩亏用 SVD。

## 用 Python 对比三种解法

```python
import numpy as np

A = np.array([[1.0, 1.0], [1.0, 2.0], [1.0, 3.0]])
b = np.array([1.0, 2.0, 4.0])

# 1) 法方程（只用于理解公式）
x_ne = np.linalg.solve(A.T @ A, A.T @ b)
print("法方程:", x_ne)                  # [-0.66666667  1.5       ]

# 2) QR
Q, R = np.linalg.qr(A)
x_qr = np.linalg.solve(R, Q.T @ b)
print("QR:   ", x_qr)

# 3) lstsq（内部 SVD/QR，最稳）
x_ls, *_ = np.linalg.lstsq(A, b, rcond=None)
print("lstsq:", x_ls)

# 残差正交性：A^T e = 0
e = b - A @ x_ls
print("A^T e:", np.round(A.T @ e, 12))

# 条件数：cond(A^T A) = cond(A)^2
print("cond(A) =", np.linalg.cond(A), " cond(A^T A) =", np.linalg.cond(A.T @ A))
```

## 易错点

> [!warning] 最容易踩的五个坑
> 1. **以为残差与 $\mathbf{b}$ 正交**：残差与**列空间**正交（$A^{T}\mathbf{e}=\mathbf{0}$），一般不垂直于 $\mathbf{b}$。
> 2. **列相关时硬解法方程**：$A^{T}A$ 奇异，解不唯一；应使用伪逆并明确"最小范数"的取法。
> 3. **把投影矩阵当逆矩阵**：$P$ 一般不可逆（$P^{2}=P$ 且秩小于阶数），只有满秩方阵且 $P=I$ 时才可逆。
> 4. **忽略条件数**：$A^{T}A$ 的条件数是 $A$ 的平方，病态数据会让"看起来正确"的结果丢掉一半有效数字。
> 5. **把正交投影与斜投影混淆**：只满足 $P^{2}=P$ 不叫正交投影，还必须 $P^{T}=P$。

## 与通信、信号处理的连接

- **LS 信道估计**：OFDM 导频处 $Y=HX+N$，逐点或按块解最小二乘即可得到 $H$ 的估计；残差正交性是估计器最优性的一阶条件。
- **MMSE 的正交性原理**：把点积换成统计期望，要求估计误差与观测正交，$E[\mathbf{e}\mathbf{y}^{H}]=\mathbf{0}$，就得到 MMSE 解。最小二乘是它的"无先验"特例。
- **匹配滤波**：在噪声为白的假设下，相关接收机最大化输出信噪比；这也可以从"把接收信号投影到信号子空间"的角度理解。
- **DFT/正交基**：正变换求投影系数、反变换用基合成，Parseval 定理即"正交变换保能量"（见 [[signal-processing/dft-and-fft|DFT 与 FFT]]）。

## 前置与相关

前置：[[mathematics/linear-algebra-basics|线性代数基础]]（矩阵乘法、列空间、秩、可逆性）。相关：[[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]]（伪逆与最小范数解）、[[mathematics/linear-transformations-numerics|线性变换与数值稳定性]]（条件数、QR 的实现）、[[signal-processing/random-processes|随机信号、估计与检测]]（MMSE、维纳滤波）。

## 来源与延伸阅读

- [[vault-notes/math/linear-algebra/04-orthogonality|正交性（详细笔记）]]：四子空间正交定理、直线/子空间投影、最小二乘与直线/抛物线拟合、Gram–Schmidt、$A=QR$、投影矩阵性质。
- [[vault-notes/math/linear-algebra/11-numerical-linear-algebra|数值线性代数（详细笔记）]]：列主元、条件数、快速正交化（CGS/MGS/Householder/Givens）的比较。
- [[vault-notes/math/linear-algebra/07-singular-value-decomposition|奇异值分解（详细笔记）]]：伪逆与最小范数最小二乘。
