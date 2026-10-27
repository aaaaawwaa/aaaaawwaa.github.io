---
title: "线性代数与矩阵运算"
tags:
- 随机信号处理
- 01-数学预备知识
- 矩阵
- 特征值
type: concept
subjects:
- 随机信号处理
- 概率论与数理统计
domains:
- 数学基础
- 随机信号
status: learning
aliases: []
prerequisites: []
related: []
---

# 线性代数与矩阵运算

> [!abstract] 这一节在讲什么
> 随机向量的一切二阶统计都可以装进一个协方差矩阵，而处理多天线、多通道、滤波器组时，运算几乎全是矩阵运算。本节把后续真正会用到的部分挑出来：转置与共轭转置、逆与秩、特征分解、正定二次型、投影与最小二乘、矩阵求逆引理，以及 Toeplitz 与 Hermitian 结构。
> 核心结论：Hermitian 矩阵可正交对角化且特征值为实，正定矩阵的二次型是"椭球能量"；最小二乘就是向列空间做正交投影；矩阵求逆引理把"加一个秩一修正"的求逆成本从立方降到平方。
> 用途：协方差矩阵、白化、波束形成、RLS 与卡尔曼滤波的增益更新，都建立在这一页。

## 一、向量、矩阵与基本运算

> [!info] 定义 4.1 内积与范数
> 复向量 $\mathbf{x},\mathbf{y}\in\mathbb{C}^{n}$ 的**内积**定义为 $\langle\mathbf{x},\mathbf{y}\rangle=\mathbf{x}^{H}\mathbf{y}$，满足共轭对称 $\langle\mathbf{x},\mathbf{y}\rangle=\overline{\langle\mathbf{y},\mathbf{x}\rangle}$。
> 诱导的 $2$-范数为 $\lVert\mathbf{x}\rVert_2=\sqrt{\mathbf{x}^{H}\mathbf{x}}$。

| 运算 | 定义或公式 | 常用性质 |
| --- | --- | --- |
| 转置 | $(\mathbf{A}^{T})_{ij}=A_{ji}$ | $(\mathbf{AB})^{T}=\mathbf{B}^{T}\mathbf{A}^{T}$ |
| 共轭转置 | $\mathbf{A}^{H}=(\mathbf{A}^{*})^{T}$ | $(\mathbf{AB})^{H}=\mathbf{B}^{H}\mathbf{A}^{H}$ |
| 逆 | $\mathbf{A}\mathbf{A}^{-1}=\mathbf{I}$ | $(\mathbf{AB})^{-1}=\mathbf{B}^{-1}\mathbf{A}^{-1}$ |
| 迹 | $\mathrm{tr}(\mathbf{A})=\sum_i A_{ii}$ | $\mathrm{tr}(\mathbf{AB})=\mathrm{tr}(\mathbf{BA})$ |
| 秩 | 线性无关的行（列）数 | $\mathrm{rank}(\mathbf{AB})\le\min(\mathrm{rank}\mathbf{A},\mathrm{rank}\mathbf{B})$ |

> [!tip] 实数是复数的特例
> 对实矩阵，$\mathbf{A}^{H}=\mathbf{A}^{T}$，共轭内积退化为点积。写代码时统一用共轭转置（MATLAB 的 `'`，NumPy 的 `.conj().T`），将来换成复基带信号不会出错。

> [!warning] 迹的循环置换只对"形状匹配"成立
> $\mathrm{tr}(\mathbf{ABC})=\mathrm{tr}(\mathbf{CAB})=\mathrm{tr}(\mathbf{BCA})$ 成立，但 $\mathrm{tr}(\mathbf{ABC})=\mathrm{tr}(\mathbf{ACB})$ 一般不成立。在推导 $\mathrm{tr}(\mathbf{A}\mathbf{x}\mathbf{x}^{H})=\mathbf{x}^{H}\mathbf{A}\mathbf{x}$ 这类式子时，靠的正是循环置换把向量移到两端。

## 二、特征值、Hermitian 与谱分解

> [!info] 定义 4.2 特征分解
> 若 $\mathbf{A}\mathbf{v}=\lambda\mathbf{v}$ 且 $\mathbf{v}\ne\mathbf{0}$，称 $\lambda$ 为**特征值**、$\mathbf{v}$ 为对应的**特征向量**。
> 若 $\mathbf{A}$ 有 $n$ 个线性无关的特征向量，则可分解为 $\mathbf{A}=\mathbf{Q}\mathbf{\Lambda}\mathbf{Q}^{-1}$，其中 $\mathbf{\Lambda}=\mathrm{diag}(\lambda_1,\dots,\lambda_n)$。

**Hermitian 矩阵**（$\mathbf{A}^{H}=\mathbf{A}$）多出三条关键性质：

1. 特征值全为实数；
2. 不同特征值对应的特征向量正交；
3. 可酉对角化：$\mathbf{A}=\mathbf{Q}\mathbf{\Lambda}\mathbf{Q}^{H}$，$\mathbf{Q}^{H}\mathbf{Q}=\mathbf{I}$。

> [!tip] 为什么协方差矩阵一定能对角化
> 协方差矩阵 $\mathbf{C}_X=E\big[(\mathbf{X}-\boldsymbol{\mu})(\mathbf{X}-\boldsymbol{\mu})^{H}\big]$ 是 Hermitian 半正定的，因此总存在一组正交的"主方向"，使各分量互不相关。这就是主成分分析与 Karhunen-Loève 展开的代数基础，[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]] 给出了完整证明。

## 三、正定性与二次型

> [!info] 定义 4.3 正定与半正定
> 对任意 $\mathbf{x}\ne\mathbf{0}$，若 $\mathbf{x}^{H}\mathbf{A}\mathbf{x}>0$，称 $\mathbf{A}$ **正定**，记 $\mathbf{A}\succ\mathbf{0}$；若只要求 $\ge0$，称**半正定**，记 $\mathbf{A}\succeq\mathbf{0}$。

判别方法有四种，做题时按矩阵规模选择：

| 判据 | 内容 | 适用场合 |
| --- | --- | --- |
| 特征值 | 全部 $\lambda_i>0$ | 小矩阵、理论推导 |
| 顺序主子式 | 各阶顺序主子式均大于 0 | 手算 $2\times2$、$3\times3$ |
| Cholesky | 存在 $\mathbf{A}=\mathbf{L}\mathbf{L}^{H}$，$\mathbf{L}$ 对角为正 | 数值计算、仿真生成 |
| 二次型配方 | 化为平方和，系数全正 | 证明题 |

二次型 $\mathbf{x}^{H}\mathbf{A}\mathbf{x}$ 的几何意义是"椭球能量"：等值面 $\mathbf{x}^{H}\mathbf{A}\mathbf{x}=c$ 的主轴方向由特征向量给出，半轴长度为 $\sqrt{c/\lambda_i}$。条件数 $\lambda_{\max}/\lambda_{\min}$ 越大，椭球越扁，数值求逆越不稳定。

> [!warning] 半正定不等于正定
> 协方差矩阵常常只是半正定的：若某个分量是其他分量的线性组合（例如差分信号 $X_1-X_2$），矩阵就奇异，逆不存在。
> 此时白化、卡尔曼增益等公式都要改用伪逆，或先用对角加载 $\mathbf{R}+\epsilon\mathbf{I}$ 正则化。

## 四、投影与最小二乘

> [!info] 定义 4.4 正交投影
> 设 $\mathbf{A}\in\mathbb{C}^{m\times n}$ 列满秩，$\mathrm{Col}(\mathbf{A})$ 为其列空间。向量 $\mathbf{b}$ 在该子空间上的**正交投影**为
> $$\hat{\mathbf{b}}=\mathbf{P}\mathbf{b},\qquad \mathbf{P}=\mathbf{A}(\mathbf{A}^{H}\mathbf{A})^{-1}\mathbf{A}^{H}$$
> $\mathbf{P}$ 满足 $\mathbf{P}^{2}=\mathbf{P}$ 与 $\mathbf{P}^{H}=\mathbf{P}$。

最小二乘问题 $\min_{\mathbf{x}}\lVert\mathbf{A}\mathbf{x}-\mathbf{b}\rVert_2^2$ 的解由**正规方程**给出：

$$\mathbf{A}^{H}\mathbf{A}\mathbf{x}=\mathbf{A}^{H}\mathbf{b}\quad\Longrightarrow\quad \hat{\mathbf{x}}=(\mathbf{A}^{H}\mathbf{A})^{-1}\mathbf{A}^{H}\mathbf{b}$$

> [!tip] 几何图像
> 残差 $\mathbf{b}-\mathbf{A}\hat{\mathbf{x}}$ 与列空间正交，所以 $\mathbf{A}^{H}(\mathbf{b}-\mathbf{A}\hat{\mathbf{x}})=\mathbf{0}$。
> 观测方程超定时（方程多于未知数），最小二乘就是"在列空间里找离 $\mathbf{b}$ 最近的点"；观测不足时解不唯一，需要最小范数解，此时用伪逆。

## 五、矩阵求逆引理与结构化矩阵

> [!info] 定义 4.5 矩阵求逆引理（Woodbury）
> 若 $\mathbf{A}$ 与 $\mathbf{C}$ 可逆，则
> $$\big(\mathbf{A}+\mathbf{B}\mathbf{C}\mathbf{D}\big)^{-1}=\mathbf{A}^{-1}-\mathbf{A}^{-1}\mathbf{B}\big(\mathbf{C}^{-1}+\mathbf{D}\mathbf{A}^{-1}\mathbf{B}\big)^{-1}\mathbf{D}\mathbf{A}^{-1}$$
> 取 $\mathbf{B}=\mathbf{u}$、$\mathbf{C}=1$、$\mathbf{D}=\mathbf{v}^{H}$ 得 Sherman-Morrison 公式，用于秩一更新。

秩一更新在自适应滤波中极其重要：RLS 每来一个新样本，只需用旧逆矩阵加一个秩一修正，单步复杂度从 $O(n^3)$ 降到 $O(n^2)$。卡尔曼滤波的协方差更新也是同一套路。

| 结构 | 定义 | 出现场景 | 关键性质 |
| --- | --- | --- | --- |
| Hermitian | $\mathbf{A}^{H}=\mathbf{A}$ | 协方差矩阵、Gram 矩阵 | 特征值实、可酉对角化 |
| Toeplitz | $A_{ij}=a_{i-j}$ | 宽平稳过程的相关矩阵、卷积矩阵 | 沿对角线常数，可用快速算法 |
| 循环 | $A_{ij}=a_{(i-j)\bmod n}$ | DFT 矩阵、循环卷积 | 被 DFT 精确对角化 |
| 对角 | 非对角元为 0 | 白噪声协方差 | 求逆即取倒数 |

> [!warning] Toeplitz 不等于循环
> 宽平稳序列的相关矩阵是 Hermitian Toeplitz，但一般**不是**循环的。用 DFT 对角化只是把 Toeplitz 近似成循环矩阵（把左下角元素补到右上角），在样本数大时误差可接受，样本少时会在两端引入偏差。谱估计中"加窗"处理有一部分就是为了缓解这个边界效应。

## 关联

- 上一节：[[vault-notes/random-signals/01-conditional-probability-bayes]]
- 下一节：[[vault-notes/random-signals/01-fourier-and-lti]]
- 导航与记号：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/linear-algebra/01-vector-introduction]]（向量与内积）、[[vault-notes/math/linear-algebra/04-orthogonality]]（投影与最小二乘的几何）、[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]]（谱分解）、[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]（秩亏与伪逆）
