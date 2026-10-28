---
title: 线性变换与数值稳定性
description: 矩阵只是"变换 + 两组基"的快照：换基、相似、复向量与 FFT，以及条件数、迭代法与浮点误差。
tags:
  - mathematics
  - linear-algebra
  - numerical
  - fft
---

## 为什么要把矩阵和变换分开

同一台线性系统，在时域看是一个卷积矩阵，在频域看是一个对角矩阵；同一个旋转，在标准基下是 $\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$，在一组旋转后的基下几乎是对角阵。**矩阵不是变换本身，而是变换在某个坐标系里的记录**。理解"换基"就能把复杂矩阵化成简单矩阵；理解"数值稳定性"就能知道同一个公式在计算机里为什么有时不能用。

本文分三段：先讲线性变换、核与像、矩阵表示与换基（相似），再讲复向量空间、Hermitian/酉矩阵与 FFT 的分解，最后讲条件数、主元、迭代法与特征值迭代这些"让计算可信"的工具。

## 线性变换、核与像

### 定义

映射 $T:V\to W$ 是**线性变换**，若对任意向量与标量

$$
T(c\mathbf{v}+d\mathbf{w})=cT(\mathbf{v})+dT(\mathbf{w})
$$

这就是**叠加原理**；取 $c=d=0$ 得 $T(\mathbf{0})=\mathbf{0}$（所以"平移"不是线性变换）。线性变换由它在基上的取值完全决定：只要知道 $T(\mathbf{v}_1),\dots,T(\mathbf{v}_n)$，任意 $\mathbf{v}=\sum x_i\mathbf{v}_i$ 的像就是 $\sum x_iT(\mathbf{v}_i)$。

常见例子：矩阵乘法、投影、旋转、反射、求导、积分、转置、移位、卷积。它们都满足叠加原理；而"取绝对值""加常数"不是。

### 核与像

- **核**（kernel / null space）：$\ker T=\{\mathbf{v}:T(\mathbf{v})=\mathbf{0}\}$；
- **像**（image / range）：$\operatorname{im}T=\{T(\mathbf{v})\}$。

两者都是子空间，且维数满足**秩–零化度定理**：

$$
\dim\ker T+\dim\operatorname{im}T=\dim V
$$

$T$ 单射 $\iff$ $\ker T=\{\mathbf{0}\}$；$T$ 满射 $\iff$ $\operatorname{im}T=W$；$T$ 可逆 $\iff$ 同时单射与满射（双射）。若 $V=W$ 且维数相同，则单射、满射、可逆三者等价——这就是方阵"列满秩即可逆"的抽象版本。

## 矩阵是变换的"快照"

### 构造矩阵的三步

选定 $V$ 的基 $\mathcal{B}=(\mathbf{v}_1,\dots,\mathbf{v}_n)$ 与 $W$ 的基 $\mathcal{C}$：

1. 计算每个 $T(\mathbf{v}_j)$；
2. 把 $T(\mathbf{v}_j)$ 用 $\mathcal{C}$ 表示，得到坐标向量；
3. 把第 $j$ 个坐标向量抄成矩阵的第 $j$ 列。

这样得到的矩阵 $[T]_{\mathcal{C}\leftarrow\mathcal{B}}$ 满足"坐标相乘 = 像的坐标"。若两边都用标准基，就得到通常的矩阵。

**例（求导算子）**：在多项式空间 $P_2$（基 $1,x,x^2$）上，$D=\frac{d}{dx}$ 满足

$$
D(1)=0,\quad D(x)=1,\quad D(x^2)=2x
\ \Longrightarrow\
[D]=\begin{bmatrix}0&1&0\\0&0&2\\0&0&0\end{bmatrix}
$$

$D$ 的核是常数（一维），像是 $P_1$（二维），$1+2=3$ ✓。这个矩阵是幂零的（$D^3=0$），对应"三次求导为零"。

### 换基就是相似

同一变换换一组基，矩阵怎么变？设新基矩阵 $M$ 的列是新基向量在旧基下的坐标，则**坐标变换**为 $\mathbf{x}_{\text{旧}}=M\mathbf{x}_{\text{新}}$，于是

$$
[T]_{\text{新}}=M^{-1}[T]_{\text{旧}}M
$$

这正是**相似**（similar）的定义。相似矩阵有相同的特征值、迹、行列式、秩（以及相同的可对角化性），因为它们描述的是同一个变换。相似不保持对称性、元素大小和范数；只有**正交相似** $Q^{-1}AQ=Q^{T}AQ$ 才保持长度、内积与条件数。

> [!tip] 为什么工程师关心换基
> OFDM 把时域卷积信道换成频域逐点信道，靠的是 DFT 这组基；阵列信号处理把协方差矩阵换到特征向量基上，靠的是酉相似；滤波器结构的转置、格型实现，本质也是换基。选基的标准通常有四条：解耦（近似对角）、正交（条件数好）、稀疏（计算少）、有物理意义（可解释）。

### 找一组"好基"

三个层次：

1. **特征向量基**：若 $A$ 可对角化，则在特征向量基下 $A$ 变成 $\Lambda$，$A^{k}$、$e^{At}$ 都能逐分量计算。
2. **若尔当标准形**：不可对角化时的"最接近对角"的形式，对角线上是 $\lambda$，上对角线是 1；$J^{k}$、$e^{Jt}$ 里会出现 $k$ 与 $t$ 的多项式因子。数值计算一般不直接求 Jordan 形（对扰动极不稳定），而用 **Schur 分解** $A=QTQ^{H}$：$Q$ 酉、$T$ 上三角，特征值在对角线上，数值稳定。
3. **函数空间的正交基**：幂基 $1,x,x^2,\dots$ 不正交且病态（对应希尔伯特矩阵）；勒让德多项式、切比雪夫多项式、三角函数基是正交基。展开系数就是投影 $c_i=\langle f,\phi_i\rangle/\langle\phi_i,\phi_i\rangle$，一次算一个，互不影响。

## 复向量、Hermitian 矩阵与酉矩阵

### 复内积

复向量空间的内积定义为

$$
\langle\mathbf{v},\mathbf{w}\rangle=\mathbf{v}^{H}\mathbf{w}=\sum_i \bar v_i w_i
$$

**第一个向量取共轭**，这样 $\|\mathbf{v}\|^{2}=\mathbf{v}^{H}\mathbf{v}=\sum|v_i|^{2}\ge0$，长度才有意义。注意 $\langle\mathbf{v},\mathbf{w}\rangle=\overline{\langle\mathbf{w},\mathbf{v}\rangle}$。

### Hermitian 与酉

- **Hermitian 矩阵**：$A^{H}=A$。对角元必为实数，特征值全为实数，特征向量可正交，$A=U\Lambda U^{H}$。这是实对称谱定理的复数版。
- **反 Hermitian**：$A^{H}=-A$，特征值为纯虚数（如 $\pm j$）。
- **酉矩阵**：$U^{H}U=I$，即 $U^{-1}=U^{H}$。列标准正交，保长度与内积，特征值模为 1。实对称、实反对称、实正交分别是 Hermitian、反 Hermitian、酉的实数特例。

**DFT 矩阵**：$F_{kn}=e^{-2\pi jkn/N}$（$k,n=0,\dots,N-1$，工程上常写 $e^{-j2\pi kn/N}$），则

$$
F^{H}F=NI
\quad\Longrightarrow\quad
\frac{1}{\sqrt N}F\ \text{是酉矩阵}
$$

所以正变换 $Y=F\mathbf{y}$、反变换 $\mathbf{y}=\frac1N F^{H}Y$，且 Parseval 成立：$\sum|y_n|^{2}=\frac1N\sum|Y_k|^{2}$。单位根 $\omega=e^{-2\pi j/N}$ 的核心性质 $\sum_{k=0}^{N-1}\omega^{k}=0$ 正是"不同频率的列正交"的来源。

### FFT 的矩阵分解

直接算 $F\mathbf{y}$ 要 $N^{2}$ 次复数乘法。FFT 把 $N$ 点变换拆成两个 $N/2$ 点变换：

$$
F_N=
\begin{bmatrix}I&D\\ I&-D\end{bmatrix}
\begin{bmatrix}F_{N/2}&0\\0&F_{N/2}\end{bmatrix}
P_N,
\qquad
D=\operatorname{diag}(1,\omega,\dots,\omega^{N/2-1})
$$

其中 $P_N$ 把偶、奇下标分开。关键观察：$\omega^{2}=e^{-4\pi j/N}$ 是 $N/2$ 次单位根，所以"偶数项"与"奇数项"各自是一个 $N/2$ 点 DFT。递归下去：

$$
T(N)=2T(N/2)+O(N)\ \Longrightarrow\ T(N)=O(N\log N)
$$

$N=1024$ 时 $N^{2}\approx1.05\times10^{6}$，而 $(N/2)\log_2N=5120$——差 200 倍，这正是"FFT 让实时频谱分析成为可能"的原因（详见 [[signal-processing/dft-and-fft|DFT 与 FFT]]）。

## 数值稳定性：让"能算"变成"算得准"

### 浮点与主元

双精度浮点约 16 位十进制有效数字。消元时若主元很小，乘数会很大，导致**灾难性相消**：两个相近的大数相减，有效数字瞬间丢失。补救办法是**部分主元**（partial pivoting）：每次选当前列绝对值最大的元素作主元，保证乘数 $|l|\le1$。工程求解器几乎默认 $PA=LU$。

### 条件数

解 $A\mathbf{x}=\mathbf{b}$ 时，若 $\mathbf{b}$ 有相对误差 $\varepsilon$，解的相对误差最多被放大 $\operatorname{cond}(A)$ 倍：

$$
\frac{\|\Delta\mathbf{x}\|}{\|\mathbf{x}\|}
\le
\operatorname{cond}(A)\frac{\|\Delta\mathbf{b}\|}{\|\mathbf{b}\|},
\qquad
\operatorname{cond}_2(A)=\frac{\sigma_1}{\sigma_n}
$$

若 $\operatorname{cond}(A)\approx10^{k}$，双精度结果只剩约 $16-k$ 位有效数字。**希尔伯特矩阵** $H_{ij}=1/(i+j-1)$ 是经典病态例子（笔记中的实测数据）：

| $n$ | $\operatorname{cond}(H_n)$ | 丢失有效数字 | 解的实测误差（真解全 1） |
| --- | --- | --- | --- |
| 5 | $4.8\times10^{5}$ | 5.7 位 | $2.8\times10^{-12}$ |
| 8 | $1.5\times10^{10}$ | 10.2 位 | $1.2\times10^{-7}$ |
| 10 | $1.6\times10^{13}$ | 13.2 位 | $1.7\times10^{-4}$ |
| 12 | $1.8\times10^{16}$ | 16.3 位 | $0.7$（完全错误） |

条件数按范数定义会变，但量级稳定。正交/酉矩阵条件数为 1，所以正交变换（Householder、QR、SVD）几乎总能改善稳定性。还有一个必须记住的公式：

$$
\operatorname{cond}(A^{T}A)=\operatorname{cond}(A)^{2}
$$

这是"不要显式组 $A^{T}A$ 求最小二乘"的定量理由（见 [[mathematics/orthogonality-least-squares|正交性与最小二乘]]）。

### 迭代法：大规模稀疏问题的正路

$n$ 上百万、矩阵稀疏时，消元的**填元**会毁掉稀疏性——分解后非零元可能爆炸。于是换思路：不分解，反复迭代逼近解。把 $A$ 拆成 $A=M-N$（$M$ 容易求逆），则 $A\mathbf{x}=\mathbf{b}$ 等价于不动点迭代

$$
\mathbf{x}_{k+1}=B\mathbf{x}_k+M^{-1}\mathbf{b},
\qquad B=M^{-1}N
$$

**收敛的充要条件**是谱半径小于 1：

$$
\text{对任意初值收敛}\iff \rho(B)=\max_i|\lambda_i(B)|<1,
\qquad
\|\mathbf{x}_k-\mathbf{x}\|\le\rho(B)^{k}\|\mathbf{x}_0-\mathbf{x}\|
$$

$\rho(B)$ 就是"每步把误差缩小多少倍"——第 6 章的谱半径在这里变成迭代法的速度表。

**Jacobi 迭代**只用上一轮的值；**Gauss–Seidel 迭代**立刻使用已经更新的分量：

$$
x_i^{(k+1)}=\frac{1}{a_{ii}}\Bigl(b_i-\sum_{j\ne i}a_{ij}x_j^{(k)}\Bigr)
\quad\text{(Jacobi)},
$$

$$
x_i^{(k+1)}=\frac{1}{a_{ii}}\Bigl(b_i-\sum_{j<i}a_{ij}x_j^{(k+1)}-\sum_{j>i}a_{ij}x_j^{(k)}\Bigr)
\quad\text{(Gauss–Seidel)}
$$

若 $A$ 严格对角占优，两种迭代都收敛。对一维拉普拉斯型三对角矩阵 $K=\operatorname{tridiag}(2,-1)$，笔记中给出的实测结论是

$$
\rho(B_J)=\cos\frac{\pi}{n+1},
\qquad
\rho(B_{GS})=\rho(B_J)^{2}
$$

$n=8$ 时 $\rho(B_J)=\cos(\pi/9)\approx0.9397$、$\rho(B_{GS})\approx0.8830$，Gauss–Seidel 每步缩得更多，但两者都只是"线性收敛"。

**共轭梯度法（CG）** 是**对称正定**系统的王牌：沿一组 $A$-共轭方向搜索，理论上 $n$ 步内精确收敛，实际迭代次数约为 $\frac12\sqrt{\operatorname{cond}(A)}$ 量级（注意是**平方根**，而 Gauss–Seidel 是 $\operatorname{cond}$ 量级）。它只需要"矩阵乘向量"，不修改矩阵、不产生填元，天然适合大规模稀疏问题。**预条件子**的思路是找一个容易求逆的 $M\approx A$，解 $M^{-1}A\mathbf{x}=M^{-1}\mathbf{b}$，把条件数降下来，迭代次数随之下降。笔记中的对比（$n=8$ 三对角、$\operatorname{cond}=32.2$）：CG 约 4 步把误差压到 $10^{-7}$ 以下，而 Gauss–Seidel 走 60 步才到 $6\times10^{-4}$。

**多重网格**针对"迭代法能快速消掉高频误差、却对低频误差无能为力"的规律：把低频误差放到粗网格上（在粗网格上它变成高频），各尺度轮流处理，复杂度可做到 $O(n)$。

### 特征值的迭代计算

幂法反复做

$$
\mathbf{x}_{k+1}=\frac{A\mathbf{x}_k}{\|A\mathbf{x}_k\|}
$$

收敛到主特征向量，误差按 $|\lambda_2/\lambda_1|$ 衰减；反幂法用 $(A-\mu I)^{-1}$ 求最接近 $\mu$ 的特征值；QR 迭代（对矩阵反复做 QR 分解并更新）是现代特征值算法的骨架。工程库（LAPACK）里的 `eig` 与 `eigh` 就是这些方法的稳健实现。

## 代码验证

```python
import numpy as np

# 1) 换基：同一变换在新基下的矩阵 = M^{-1} A M
A = np.array([[2.0, 1.0], [1.0, 2.0]])
M = np.array([[1.0, 1.0], [1.0, -1.0]])     # 特征向量基（未归一化）
print("相似后的矩阵:\n", np.round(np.linalg.inv(M) @ A @ M, 12))  # 对角 3, 1

# 2) 条件数与希尔伯特矩阵
for n in (5, 8, 10, 12):
    H = 1.0 / (np.arange(n)[:, None] + np.arange(n)[None, :] + 1.0)
    print(f"n={n:2d}  cond(H)={np.linalg.cond(H):.2e}")

# 3) Jacobi 迭代（教学演示）
K = 2 * np.eye(8) - np.eye(8, k=1) - np.eye(8, k=-1)
b = np.ones(8)
x = np.zeros(8)
R = K - np.diag(np.diag(K))
for k in range(1, 200):
    x_new = (b - R @ x) / np.diag(K)
    if np.linalg.norm(x_new - x) < 1e-10:
        break
    x = x_new
print("Jacobi 步数:", k, "残差:", np.linalg.norm(K @ x - b))

# 4) 幂法求主特征值
rng = np.random.default_rng(0)
B = rng.standard_normal((5, 5)); B = B + B.T
v = rng.standard_normal(5)
for k in range(100):
    w = B @ v
    v = w / np.linalg.norm(w)
lam = v @ B @ v / (v @ v)
print("幂法主特征值:", lam, " 精确:", np.max(np.linalg.eigvalsh(B)))
```

> [!note] 三组"看起来像但不一样"的概念
> - **相似**（$M^{-1}AM$）保持特征值，但一般不保持长度；**正交相似/酉相似**（$Q^{T}AQ$、$U^{H}AU$）两者都保持。
> - **酉矩阵**是复数域的"正交矩阵"；实正交矩阵是酉矩阵的特例，但"酉"允许复元素与复特征值。
> - **Schur 分解**总存在（$A=QTQ^{H}$，$T$ 上三角），对角化不一定存在；数值上优先用 Schur。

## 易错点

> [!warning] 数值与换基的常见错误
> 1. **把"病态"当"奇异"**：病态矩阵严格可逆，只是条件数大；它不会报错，只会悄悄丢精度。
> 2. **用 $\|B\|<1$ 判断迭代收敛**：那只是充分条件；充要条件是谱半径 $\rho(B)<1$，$\|B\|$ 可能大于 1 而迭代仍收敛。
> 3. **CG 用在非对称或非正定矩阵上**：CG 的推导依赖 $A$ 对称正定；非对称系统要用 GMRES/BiCGStab 等。
> 4. **换基方向写反**：若 $M$ 的列是新基向量在旧基下的坐标，则旧坐标 $=M$ 乘新坐标，矩阵变换是 $M^{-1}AM$；不同教材约定不同，写代码前先用一个具体向量验证。
> 5. **FFT 归一化与共轭约定混用**：不同软件对正变换的 $1/N$ 与 $e^{\pm j}$ 约定不同，跨工具对比频谱前先查文档。
> 6. **特征值算法直接作用于 $A^{T}A$**：条件数平方，小奇异值会被噪声淹没；用 SVD（Golub–Kahan 类算法）直接算。

## 前置与相关

前置：[[mathematics/linear-algebra-basics|线性代数基础]]、[[mathematics/orthogonality-least-squares|正交性与最小二乘]]、[[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]]。相关应用：[[signal-processing/dft-and-fft|DFT 与 FFT]]（FFT 矩阵分解与运算量）、[[signal-processing/signals-and-systems-intro|信号与系统导论]]（卷积与系统函数）、[[mathematics/complex-transforms-and-fields|复变变换与场论]]（s 域与稳定性）、[[signal-processing/z-transform-and-dtft|z 变换与 DTFT]]（离散系统稳定性）。

## 来源与延伸阅读

- [[vault-notes/math/linear-algebra/08-linear-transformations|线性变换（详细笔记）]]：线性变换的思想、核与像、矩阵构造、换基与相似、求导/求积算子、复合与矩阵乘积、若尔当形、函数空间正交基、勒让德与切比雪夫多项式。
- [[vault-notes/math/linear-algebra/09-complex-vectors-matrices|复向量和复矩阵（详细笔记）]]：复数极形式、Hermitian 与酉矩阵、单位根、傅里叶矩阵、FFT 的一步分解与递归。
- [[vault-notes/math/linear-algebra/11-numerical-linear-algebra|数值线性代数（详细笔记）]]：舍入误差与列主元、运算次数、带状/稀疏矩阵、快速正交化、范数与条件数、Jacobi/Gauss–Seidel/共轭梯度/多重网格、幂法与反幂法。
