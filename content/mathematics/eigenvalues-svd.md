---
title: 特征值、SVD 与低秩近似
description: 对角化的条件、对称矩阵的谱定理、奇异值分解与 PCA：从矩阵的"主方向"到 MIMO 并行子信道。
tags:
  - mathematics
  - linear-algebra
  - eigenvalues
  - svd
---

## 为什么矩阵需要"自己的坐标系"

矩阵乘法一般会把向量既拉伸又转向，但总有一些特殊方向只被缩放、不被转向。这些方向就是**特征向量**，缩放倍数就是**特征值**。找到它们，等于给矩阵换上一套"自己的坐标系"：求幂、解微分方程、分析稳定性、做降维都会瞬间变简单。

对一般矩阵，这套坐标系可能不存在（特征向量不够）或不是正交的；**奇异值分解**（SVD）则对任意矩阵都成立，并且同时给出四个基本子空间的标准正交基。可以说：特征分解是"方阵的奢侈版"，SVD 是"所有矩阵的通用版"。本文最后把这些工具落到三个工程落点上：PCA 降维、MIMO 并行子信道、卷积的频域对角化。

## 特征值与特征向量

### 定义与特征方程

若存在非零向量 $\mathbf{x}$ 与标量 $\lambda$ 满足

$$
A\mathbf{x}=\lambda\mathbf{x},\qquad \mathbf{x}\ne\mathbf{0}
$$

则称 $\lambda$ 为特征值、$\mathbf{x}$ 为对应的特征向量。移项得 $(A-\lambda I)\mathbf{x}=\mathbf{0}$，要有非零解必须

$$
\det(A-\lambda I)=0
$$

这是 $\lambda$ 的 $n$ 次**特征多项式**，在复数域内恰有 $n$ 个根（计重数）。因此"特征值一定存在"在复数域成立，但**实矩阵的特征值可能是复数**。

两条不用算特征向量就能用的恒等式：

$$
\sum_{i=1}^{n}\lambda_i=\operatorname{tr}(A),
\qquad
\prod_{i=1}^{n}\lambda_i=\det A
$$

三角矩阵的特征值就是对角元。常用变换：$A+cI$ 的特征值是 $\lambda_i+c$；$A^{k}$ 的是 $\lambda_i^{k}$；$A^{-1}$ 的是 $1/\lambda_i$；$A^{T}$ 与 $A$ 特征值相同。注意 $AB$ 与 $A+B$ 的特征值一般**不能**由 $A$、$B$ 的特征值拼出来（除非共享特征向量）。

**复特征值来自旋转**：$A=\begin{bmatrix}0&-1\\1&0\end{bmatrix}$ 表示旋转 $90^\circ$，特征多项式 $\lambda^{2}+1=0$，$\lambda=\pm j$，模都是 1。实对称矩阵不会出现这种情形（见下文谱定理）。

### 对角化的条件

把 $n$ 个线性无关的特征向量按列排成 $S$，则 $AS=S\Lambda$，于是

$$
A=S\Lambda S^{-1}
$$

称 $A$ **可对角化**。充要条件是**有 $n$ 个线性无关的特征向量**；充分条件是**$n$ 个特征值互不相同**（相异特征值的特征向量自动线性无关）。只有重根时才需要检查"几何重数"（特征空间的维数）是否等于代数重数；不相等就不可对角化，例如 $A=\begin{bmatrix}3&1\\0&3\end{bmatrix}$ 只有一维特征空间。

对角化的价值在于把复杂作用拆成 $n$ 个独立的一维伸缩：

$$
A^{k}=S\Lambda^{k}S^{-1},
\qquad
e^{At}=Se^{\Lambda t}S^{-1}
$$

由此可得**差分方程** $\mathbf{u}_{k+1}=A\mathbf{u}_k$ 的解 $\mathbf{u}_k=A^{k}\mathbf{u}_0$：稳定（$\mathbf{u}_k\to\mathbf{0}$）当且仅当所有 $|\lambda_i|<1$；连续系统 $d\mathbf{u}/dt=A\mathbf{u}$ 稳定当且仅当所有 $\operatorname{Re}\lambda_i<0$。这就是 LTI 系统"极点决定稳定性"的线性代数来源。

**斐波那契例子**：$F_{k+2}=F_{k+1}+F_k$ 写成 $\begin{bmatrix}F_{k+2}\\F_{k+1}\end{bmatrix}=\begin{bmatrix}1&1\\1&0\end{bmatrix}\begin{bmatrix}F_{k+1}\\F_k\end{bmatrix}$，特征值 $\lambda_{\pm}=(1\pm\sqrt5)/2$，于是

$$
F_k=\frac{1}{\sqrt5}\left[\left(\frac{1+\sqrt5}{2}\right)^{k}-\left(\frac{1-\sqrt5}{2}\right)^{k}\right],
\qquad F_{20}=6765
$$

增长由主特征值 $\varphi=(1+\sqrt5)/2\approx1.618$ 主宰，这正是"长期行为由谱半径最大的特征值决定"的实例。

**马尔可夫链**：若 $A$ 的元素非负且每列和为 1（列随机矩阵），则 $\lambda=1$ 一定是特征值（全 1 向量是 $A^{T}$ 的特征向量），其余特征值满足 $|\lambda|\le1$。例如

$$
A=\begin{bmatrix}0.8&0.3\\0.2&0.7\end{bmatrix}
\ \Longrightarrow\
A^{k}\to\begin{bmatrix}0.6&0.6\\0.4&0.4\end{bmatrix},
\quad\text{稳态 }\begin{bmatrix}0.6\\0.4\end{bmatrix}
$$

稳态即 $\lambda=1$ 的特征向量。佩隆–弗罗贝尼乌斯定理保证：正矩阵的主特征值唯一、单根、特征向量全正（见 [[vault-notes/math/linear-algebra/10-applications|线性代数的应用（详细笔记）]]）。

## 对称矩阵、正定矩阵与谱定理

### 谱定理

实对称矩阵 $A=A^{T}$ 存在 $n$ 个标准正交的特征向量，可以写成

$$
A=Q\Lambda Q^{T}
=\sum_{i=1}^{n}\lambda_i\,\mathbf{q}_i\mathbf{q}_i^{T},
\qquad Q^{T}Q=I
$$

右边就是**谱分解**：任何对称矩阵都是"若干互相垂直的秩一投影"的加权和，权重是特征值。两个关键点：

1. 相异特征值的特征向量正交。证明一行：$\lambda_1\mathbf{x}_1^{T}\mathbf{x}_2=(A\mathbf{x}_1)^{T}\mathbf{x}_2=\mathbf{x}_1^{T}A^{T}\mathbf{x}_2=\mathbf{x}_1^{T}A\mathbf{x}_2=\lambda_2\mathbf{x}_1^{T}\mathbf{x}_2$，故 $(\lambda_1-\lambda_2)\mathbf{x}_1^{T}\mathbf{x}_2=0$。**对称性正是在这一步发挥作用**。
2. 每个 $\mathbf{q}_i\mathbf{q}_i^{T}$ 是投影矩阵，两两正交且和为 $I$：$\sum_i\mathbf{q}_i\mathbf{q}_i^{T}=QQ^{T}=I$。

非对称矩阵没有这些福利：特征值可能复、特征向量可能不正交、可能不可对角化。工程上做特征分解前，第一件事是问："这个矩阵对称（或 Hermitian）吗？"

### 正定矩阵

对称矩阵 $A$ 若对一切 $\mathbf{x}\ne\mathbf{0}$ 有

$$
\mathbf{x}^{T}A\mathbf{x}>0
$$

则称**正定**，记 $A>0$。$\mathbf{x}^{T}A\mathbf{x}$ 可读作"能量"（二次型），它是开口向上的抛物面。

等价判据（编程时按需选用）：所有特征值 $>0$；所有顺序主子式 $>0$；对称分解 $A=LDL^{T}$ 中 $D$ 的对角元全正；$A=R^{T}R$ 且 $R$ 满秩。半正定放松为 $\mathbf{x}^{T}A\mathbf{x}\ge0$（特征值 $\ge0$）。

**几何**：$\mathbf{x}^{T}A\mathbf{x}=1$ 是椭圆（椭球），半轴沿特征向量、长度 $1/\sqrt{\lambda_i}$。特征值越大，该方向越"陡"。这个椭圆还出现在多维高斯分布的等概率面上：协方差矩阵的特征值给出各方向方差，半轴长正比于 $\sqrt{\lambda_i}$。

**正定性是"最小值判别"的工具**：对二次型 $f(\mathbf{x})=\frac12\mathbf{x}^{T}A\mathbf{x}-\mathbf{b}^{T}\mathbf{x}$，梯度为零给出 $A\mathbf{x}=\mathbf{b}$；$A$ 正定保证这是唯一全局最小点——这正是最小二乘法方程能"取到最小"的本质（见 [[mathematics/orthogonality-least-squares|正交性与最小二乘]]）。

## 奇异值分解：所有矩阵的"正交坐标系"

### 从 $A^{T}A$ 推出来

对任意 $m\times n$ 实矩阵 $A$，$A^{T}A$ 对称半正定，因此可正交对角化且特征值非负：

$$
A^{T}A=V\Sigma^{2}V^{T},
\qquad
AA^{T}=U\Sigma^{2}U^{T},
\qquad
A=U\Sigma V^{T}
$$

其中 $\sigma_i=\sqrt{\lambda_i(A^{T}A)}\ge0$，$\mathbf{v}_i$ 是 $A^{T}A$ 的特征向量（右奇异向量），$\mathbf{u}_i=A\mathbf{v}_i/\sigma_i$（左奇异向量，$\sigma_i>0$）。推导两行：

$$
A^{T}A=(U\Sigma V^{T})^{T}(U\Sigma V^{T})
=V\Sigma^{T}\underbrace{U^{T}U}_{I}\Sigma V^{T}
=V\Sigma^{2}V^{T}
$$

**四个子空间的标准正交基**（$r=\operatorname{rank}A$）：

| 子空间 | 由谁提供 | 维数 |
| --- | --- | --- |
| 行空间 $C(A^{T})\subset\mathbb{R}^n$ | $\mathbf{v}_1,\dots,\mathbf{v}_r$ | $r$ |
| 零空间 $N(A)\subset\mathbb{R}^n$ | $\mathbf{v}_{r+1},\dots,\mathbf{v}_n$ | $n-r$ |
| 列空间 $C(A)\subset\mathbb{R}^m$ | $\mathbf{u}_1,\dots,\mathbf{u}_r$ | $r$ |
| 左零空间 $N(A^{T})\subset\mathbb{R}^m$ | $\mathbf{u}_{r+1},\dots,\mathbf{u}_m$ | $m-r$ |

并且配对：$A\mathbf{v}_i=\sigma_i\mathbf{u}_i$（$i\le r$），$A\mathbf{v}_i=\mathbf{0}$（$i>r$）。SVD 一次性给出了四个子空间最漂亮的一组基——这是第三章、四章逐列消元所做不到的。

**手算例子**：$A=\begin{bmatrix}2&2\\-1&1\end{bmatrix}$。$A^{T}A=\begin{bmatrix}5&3\\3&5\end{bmatrix}$，特征值 $8,2$，故 $\sigma_1=2\sqrt2,\sigma_2=\sqrt2$；$\mathbf{v}_1=(1,1)^{T}/\sqrt2$、$\mathbf{v}_2=(1,-1)^{T}/\sqrt2$；$\mathbf{u}_1=A\mathbf{v}_1/\sigma_1=(1,0)^{T}$、$\mathbf{u}_2=(0,-1)^{T}$。于是 $A=U\Sigma V^{T}$（符号由 $A\mathbf{v}_i=\sigma_i\mathbf{u}_i$ 定死，不能随意取正）。

**三个由奇异值定义的量**：

$$
\operatorname{rank}(A)=\#\{\sigma_i>0\},
\qquad
\|A\|_2=\sigma_1,
\qquad
\|A\|_F=\sqrt{\sum_i\sigma_i^{2}},
\qquad
\operatorname{cond}(A)=\frac{\sigma_1}{\sigma_r}
$$

$\|A\|_2=\sigma_1$ 是 $A$ 能把向量拉长的最大倍数；$\operatorname{cond}$ 是"单位球被压成的椭球有多扁"。

### 低秩近似与压缩

把 SVD 按层展开：

$$
A=\sum_{i=1}^{r}\sigma_i\mathbf{u}_i\mathbf{v}_i^{T}
$$

每一项都是秩一矩阵（一"层"图案）。**Eckart–Young 定理**：只保留前 $k$ 层得到的 $A_k$ 是所有秩不超过 $k$ 的矩阵中离 $A$ 最近的，误差精确等于被丢掉的奇异值：

$$
\|A-A_k\|_2=\sigma_{k+1},
\qquad
\|A-A_k\|_F=\sqrt{\sigma_{k+1}^{2}+\cdots+\sigma_r^{2}}
$$

**数值验证**：$A=\begin{bmatrix}3&0&1\\0&2&0\\1&0&3\end{bmatrix}$ 的奇异值为 $(4,2,2)$。保留第一层

$$
A_1=4\mathbf{u}_1\mathbf{v}_1^{T}
=\begin{bmatrix}2&0&2\\0&0&0\\2&0&2\end{bmatrix},
\qquad
\|A-A_1\|_2=\sigma_2=2,
\qquad
\|A-A_1\|_F=\sqrt{8}
$$

可压缩性的算术：存原矩阵要 $mn$ 个数，存秩 $k$ 近似只要 $k$ 个奇异值加 $k(m+n)$ 个数，

$$
\text{压缩比}=\frac{mn}{k(m+n)+k}
$$

$1000\times1000$ 的图像、$k=50$ 时约 10 倍。能否压缩取决于奇异值衰减速度：自然图像前几层就抓住主要能量，白噪声则衰减很慢。

### 伪逆与最小范数解

把非零奇异值取倒数、零保持为零，得 $\Sigma^{+}$，定义

$$
A^{+}=V\Sigma^{+}U^{T},
\qquad
\Sigma^{+}=\operatorname{diag}\left(\frac{1}{\sigma_1},\dots,\frac{1}{\sigma_r},0,\dots,0\right)
$$

对任意矩阵（非方、奇异都可以）都有定义，且 $\hat{\mathbf{x}}=A^{+}\mathbf{b}$ 同时解决最小二乘的三种情形：列满秩时退化为 $(A^{T}A)^{-1}A^{T}\mathbf{b}$；秩亏时给出**范数最小**的解（因为解落在行空间，零空间分量为零）；既无解又秩亏时给出"最小误差 + 最小范数"的唯一解。

### 主成分分析（PCA）

数据矩阵 $X$ 一行一个样本（$n$ 个样本、$d$ 个特征），先**去中心化** $X_c=X-\mathbf{1}\boldsymbol{\mu}^{T}$（必须做，否则第一主方向会被均值带偏）。协方差矩阵

$$
S=\frac{1}{n-1}X_c^{T}X_c
$$

对称半正定，其谱分解 $S=Q\Lambda Q^{T}$ 给出：特征向量 $\mathbf{q}_i$ = 主方向，特征值 $\lambda_i$ = 该方向上的方差，总方差 $=\operatorname{tr}(S)=\sum\lambda_i$。把数据投影到前 $k$ 个主方向即得 $k$ 维表示，解释率为 $\lambda_i/\sum_j\lambda_j$。

**与 SVD 的关系**：$X_c=U\Sigma V^{T}$ 时，$S=V\frac{\Sigma^{2}}{n-1}V^{T}$，所以主方向就是 $X_c$ 的右奇异向量，方差 $=\sigma_i^{2}/(n-1)$，得分 $Z=X_cV=U\Sigma$。工程上**不显式组协方差矩阵**，直接对去中心化数据做 SVD，既避免 $S$ 的条件数平方，也能处理 $n\ll d$ 的高维数据。

**白化**：令 $\mathbf{z}=\Lambda^{-1/2}Q^{T}(\mathbf{x}-\boldsymbol{\mu})$，则 $\operatorname{Cov}(\mathbf{z})=I$——把"椭圆的噪声"掰成"圆的噪声"，这是通信中白化滤波器、MIMO 空间白化的数学动作。

## 随机向量的协方差与多维高斯

对随机向量 $\mathbf{x}$，协方差矩阵 $V=E[(\mathbf{x}-\boldsymbol{\mu})(\mathbf{x}-\boldsymbol{\mu})^{T}]$ 一定对称半正定（$\mathbf{a}^{T}V\mathbf{a}=E[(\mathbf{a}^{T}(\mathbf{x}-\boldsymbol{\mu}))^{2}]\ge0$），因此谱分解、PCA、白化全部可用。线性变换的传播律是工程上最常用的公式：

$$
\mathbf{y}=A\mathbf{x}\ \Longrightarrow\
E[\mathbf{y}]=A\boldsymbol{\mu},
\qquad
\operatorname{Cov}(\mathbf{y})=AVA^{T}
$$

标量形式即 $\operatorname{Var}(\mathbf{a}^{T}\mathbf{x})=\mathbf{a}^{T}V\mathbf{a}$。

$n$ 维高斯分布

$$
p(\mathbf{x})=\frac{1}{(2\pi)^{n/2}(\det V)^{1/2}}
\exp\left[-\frac12(\mathbf{x}-\boldsymbol{\mu})^{T}V^{-1}(\mathbf{x}-\boldsymbol{\mu})\right]
$$

的等概率面是椭球：半轴方向为 $V$ 的特征向量，半轴长正比于 $\sqrt{\lambda_i}$。行列式 $\det V$ 负责体积归一化，$V^{-1}$ 负责"按方差加权"，两者同时出现并不偶然（详见 [[vault-notes/math/linear-algebra/12-linear-algebra-in-probability-statistics|概率统计中的线性代数（详细笔记）]]）。

## 工程落点：MIMO 与卷积对角化

### MIMO 并行子信道

窄带 MIMO 信道 $\mathbf{y}=H\mathbf{x}+\mathbf{n}$，对 $H$ 做 SVD：$H=U\Sigma V^{H}$。发送端预编码 $\mathbf{x}=V\mathbf{s}$，接收端左乘 $U^{H}$：

$$
\tilde{\mathbf{y}}=U^{H}H V\mathbf{s}+U^{H}\mathbf{n}
=\Sigma\mathbf{s}+\tilde{\mathbf{n}}
$$

由于 $U,V$ 是酉矩阵，噪声功率不变，而 $\Sigma$ 是对角矩阵——**一个耦合的多天线信道被拆成 $\operatorname{rank}(H)$ 个互不干扰的标量子信道**，第 $i$ 个子信道增益为 $\sigma_i$。功率分配（注水算法）就在这些子信道上做，容量为

$$
C=\sum_i\log_2\left(1+\frac{\sigma_i^{2}P_i}{N_0}\right)
$$

这正是空间复用的理论基础（见 [[communication/mobile-networks|移动通信网络]]）。

### 卷积 = 循环矩阵 = DFT 对角化

用滤波器 $h$ 对信号做循环卷积，可写成矩阵乘法 $\mathbf{y}=C\mathbf{x}$，$C$ 是**循环矩阵**（第一列是 $h$ 的循环移位）。循环矩阵的特征向量恰好是 DFT 的列（复指数），特征值是 $h$ 的 DFT：

$$
C=\frac{1}{N}F^{H}\operatorname{diag}(H)\,F,
\qquad
H=\operatorname{DFT}(h)
$$

于是"卷积"在频域变成"逐点相乘" $Y=HX$。SVD/特征分解在这里不是巧合：循环矩阵是正规矩阵，它的特征分解就是 DFT。同一思想推广到 Toeplitz 矩阵的渐近对角化，就是 OFDM 用 FFT 实现频域均衡的根据（见 [[signal-processing/dft-and-fft|DFT 与 FFT]]）。

## 代码验证

```python
import numpy as np

# 1) 对称矩阵的谱定理
A = np.array([[2.0, 1.0], [1.0, 2.0]])
w, Q = np.linalg.eigh(A)              # eigh 保证特征向量正交
print("特征值:", w)                    # [1. 3.]
print("Q^T Q = I ?", np.allclose(Q.T @ Q, np.eye(2)))
print("谱分解重构:", np.allclose(Q @ np.diag(w) @ Q.T, A))

# 2) SVD 与低秩近似
B = np.array([[3.0, 0, 1], [0, 2, 0], [1, 0, 3]])
U, s, Vh = np.linalg.svd(B)
print("奇异值:", np.round(s, 6))       # [4. 2. 2.]
B1 = s[0] * np.outer(U[:, 0], Vh[0, :])
print("秩一近似:\n", np.round(B1, 6))
print("谱范数误差:", np.linalg.norm(B - B1, 2))   # 2.0

# 3) PCA：去中心化 + SVD
rng = np.random.default_rng(0)
X = rng.standard_normal((500, 2)) @ np.array([[2.0, 0.8], [0.0, 0.5]]) + [1.0, -2.0]
Xc = X - X.mean(axis=0)
Uc, sc, Vt = np.linalg.svd(Xc, full_matrices=False)
explained = sc**2 / np.sum(sc**2)
print("解释率:", np.round(explained, 4))
print("主方向:", np.round(Vt, 4))

# 4) MIMO 子信道增益
H = rng.standard_normal((4, 4)) + 1j * rng.standard_normal((4, 4))
print("MIMO 奇异值:", np.round(np.linalg.svd(H, compute_uv=False), 3))
```

## 易错点

> [!warning] 六个常见误解
> 1. **"特征值一定存在且为实数"**：实矩阵可能有复特征值（旋转矩阵），只有实对称/Hermitian 才保证实特征值。
> 2. **"矩阵都能对角化"**：需要 $n$ 个线性无关特征向量；重根时几何重数可能不足，此时只有 Jordan 标准形。
> 3. **"相似矩阵只是同一个矩阵换了写法"**：相似 $B=M^{-1}AM$ 保持特征值、迹、行列式、秩，但元素和范数都会变；正交相似才保持长度与条件数。
> 4. **PCA 忘了去中心化**：不减去均值，第一主方向会指向均值方向而不是最大方差方向。
> 5. **代码里先组 $A^{T}A$ 再算特征值**：条件数被平方（$\operatorname{cond}(A^{T}A)=\operatorname{cond}(A)^{2}$），应直接调用 SVD 或 `eigh`。
> 6. **SVD 的 $U,V$ 唯一**：奇异值重复或为零时，相应的奇异向量可以任选一组标准正交基，符号也可翻转；只有配对关系 $A\mathbf{v}_i=\sigma_i\mathbf{u}_i$ 是确定的。

## 前置与相关

前置：[[mathematics/linear-algebra-basics|线性代数基础]]（秩、行列式、可逆性）、[[mathematics/orthogonality-least-squares|正交性与最小二乘]]（投影、法方程）。下一步：[[mathematics/linear-transformations-numerics|线性变换与数值稳定性]]（换基、条件数、迭代特征值算法）。

相关应用：[[signal-processing/random-processes|随机信号、估计与检测]]（协方差、MMSE）、[[communication/digital-modulation-qpsk|数字调制 QPSK]]、[[communication/mobile-networks|移动通信网络]]（MIMO）、[[signal-processing/dft-and-fft|DFT 与 FFT]]、[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]（协方差与谱估计）。

## 来源与延伸阅读

- [[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors|特征值与特征向量（详细笔记）]]：特征方程、迹与行列式、虚特征值、对角化、斐波那契、$A^{k}$、微分/差分方程、对称矩阵、正定矩阵、最小点判别。
- [[vault-notes/math/linear-algebra/07-singular-value-decomposition|奇异值分解（详细笔记）]]：图像压缩、Eckart–Young、四子空间标准正交基、伪逆、PCA、单位球到椭球。
- [[vault-notes/math/linear-algebra/12-linear-algebra-in-probability-statistics|概率统计中的线性代数（详细笔记）]]：协方差矩阵、白化、多维高斯、加权最小二乘。
- [[vault-notes/math/linear-algebra/10-applications|线性代数的应用（详细笔记）]]：马尔可夫矩阵、佩隆–弗罗贝尼乌斯、傅里叶级数的线性代数视角、循环矩阵与 FFT。
