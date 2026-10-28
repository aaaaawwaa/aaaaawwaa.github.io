---
title: "协方差与相关系数"
tags:
- 随机信号处理
- 02-随机变量与随机向量
- 协方差
- 相关系数
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

# 协方差与相关系数

> [!abstract] 这一节在讲什么
> 方差只描述单个变量的波动，协方差描述两个变量"是否同向波动"。本节给出协方差与相关系数的定义、性质、不相关与独立的区别，并把二维结论推广到协方差矩阵、线性变换传播与白化。
> 核心结论：相关系数只测线性关联，$\rho=0$ 只说明没有线性关系，绝不等于独立；协方差矩阵在 $\mathbf{Y}=\mathbf{A}\mathbf{X}+\mathbf{b}$ 下按 $\mathbf{A}\mathbf{C}_X\mathbf{A}^{H}$ 传播，这是误差分析与阵列处理的基本公式。
> 用途：信噪比合成、分集合并、主成分分析、白化预处理器，都是这一页的变形。

## 一、协方差

> [!info] 定义 7.1 协方差
> 若 $E[X^2]$、$E[Y^2]$ 存在，称
> $$
> \mathrm{Cov}(X,Y)=E\big[(X-\mu_X)(Y-\mu_Y)\big]=E[XY]-\mu_X\mu_Y
> $$
> 为 $X$ 与 $Y$ 的**协方差**。

协方差是**双线性**的，这条性质让大部分计算可以机械化展开：

| 性质 | 表达式 |
| --- | --- |
| 对称 | $\mathrm{Cov}(X,Y)=\mathrm{Cov}(Y,X)$ |
| 自身 | $\mathrm{Cov}(X,X)=\mathrm{Var}(X)$ |
| 线性 | $\mathrm{Cov}(aX+b,cY+d)=ac\,\mathrm{Cov}(X,Y)$ |
| 可加 | $\mathrm{Cov}(X+Y,Z)=\mathrm{Cov}(X,Z)+\mathrm{Cov}(Y,Z)$ |
| 独立 | $X\perp Y\Rightarrow\mathrm{Cov}(X,Y)=0$ |

> [!tip] 协方差的单位是"乘积单位"
> 若 $X$ 是电压、$Y$ 是电流，协方差的单位是瓦特；数值大小会随量纲变化，因此不适合直接比较不同量对之间的关联强弱。相关系数正是为消除量纲而设计的。

## 二、相关系数

> [!info] 定义 7.2 相关系数
> 当 $\sigma_X>0$、$\sigma_Y>0$ 时
> $$
> \rho_{XY}=\frac{\mathrm{Cov}(X,Y)}{\sigma_X\sigma_Y}\in[-1,1]
> $$
> 也称为 Pearson 相关系数。

| 取值 | 含义 | 几何解释 |
| --- | --- | --- |
| $\rho=1$ | 完全正线性相关 | 所有点落在正斜率直线上 |
| $0<\rho<1$ | 正相关，有正向线性趋势 | 点云沿右上方向拉长 |
| $\rho=0$ | 不相关（无线性关联） | 点云无倾斜，但可能有弯曲结构 |
| $-1<\rho<0$ | 负相关 | 点云沿右下方向拉长 |
| $\rho=-1$ | 完全负线性相关 | 所有点落在负斜率直线上 |

> [!warning] $\rho$ 只测线性
> 令 $X\sim U(-1,1)$、$Y=X^2$，则 $\mathrm{Cov}(X,Y)=E[X^3]-E[X]E[X^2]=0$，$\rho=0$，但 $Y$ 完全由 $X$ 决定。
> 所以"相关系数为 0"只能说"没有线性关系"。要检验一般依赖关系，需要看互信息、秩相关或条件分布。

相关系数对平移不变、对缩放只改变符号：$\rho_{aX+b,cY+d}=\operatorname{sign}(ac)\rho_{XY}$。它本质上就是标准化变量 $X/\sigma_X$ 与 $Y/\sigma_Y$ 的内积，因此 $\lvert\rho\rvert\le1$ 不过是柯西-施瓦茨不等式的特例。

## 三、不相关与独立

| 对比项 | 独立 | 不相关 |
| --- | --- | --- |
| 定义 | $f_{XY}(x,y)=f_X(x)f_Y(y)$ | $\mathrm{Cov}(X,Y)=0$ |
| 强度 | 联合分布完全分解 | 只消除二阶线性关联 |
| 推出关系 | 独立 $\Rightarrow$ 不相关 | 不相关 $\nRightarrow$ 独立 |
| 例外 | 联合高斯时二者等价 | 仅对高斯族成立 |
| 检验对象 | 任意阶依赖 | 仅二阶矩 |

> [!tip] 高斯是特殊的
> 对联合高斯变量，不相关与独立等价，因为高斯分布完全由均值与协方差决定。这一条在推导 AWGN 下的最佳接收机时反复使用：只需证明噪声样本两两不相关，就可以断言它们独立。

## 四、协方差矩阵与线性变换

> [!info] 定义 7.3 协方差矩阵
> 随机向量 $\mathbf{X}=[X_1,\dots,X_n]^{T}$ 的协方差矩阵为
> $$
> \mathbf{C}_X=E\big[(\mathbf{X}-\boldsymbol{\mu}_X)(\mathbf{X}-\boldsymbol{\mu}_X)^{H}\big]
> $$
> 对角元是各分量方差，非对角元是协方差；$\mathbf{C}_X$ 为 Hermitian 半正定矩阵。

对线性变换 $\mathbf{Y}=\mathbf{A}\mathbf{X}+\mathbf{b}$，有

$$
\boldsymbol{\mu}_Y=\mathbf{A}\boldsymbol{\mu}_X+\mathbf{b},\qquad \mathbf{C}_Y=\mathbf{A}\mathbf{C}_X\mathbf{A}^{H}
$$

更一般地，$\mathrm{Cov}(\mathbf{A}\mathbf{X},\mathbf{B}\mathbf{Y})=\mathbf{A}\,\mathrm{Cov}(\mathbf{X},\mathbf{Y})\,\mathbf{B}^{H}$。

> [!warning] 变换矩阵乘在哪一侧
> $\mathbf{C}_Y=\mathbf{A}\mathbf{C}_X\mathbf{A}^{H}$ 中，左乘 $\mathbf{A}$、右乘 $\mathbf{A}^{H}$，顺序不能交换。若 $\mathbf{A}$ 不是方阵，$\mathbf{C}_Y$ 的维数随之改变，但仍是半正定的。
> 另外 $\mathrm{Var}(X_1+X_2)=\mathbf{1}^{T}\mathbf{C}_X\mathbf{1}$，展开就是 $\sigma_1^2+\sigma_2^2+2\rho\sigma_1\sigma_2$。

正交变换下协方差矩阵的完整算例见 [[vault-notes/random-signals/02-gaussian-random-vectors#六、作业题解析]] 的题 12。

## 五、白化与二维算例

> [!info] 定义 7.4 白化
> 若线性变换 $\mathbf{W}$ 使 $\mathbf{C}_Y=\mathbf{W}\mathbf{C}_X\mathbf{W}^{H}=\mathbf{I}$，称 $\mathbf{W}$ 为**白化矩阵**。
> 由特征分解 $\mathbf{C}_X=\mathbf{Q}\mathbf{\Lambda}\mathbf{Q}^{H}$，取
> $$
> \mathbf{W}=\mathbf{\Lambda}^{-1/2}\mathbf{Q}^{H}
> $$
> 即可。只把非对角元消掉（$\mathbf{C}_Y$ 为对角阵）称为**去相关**，白化还要求对角元为 1。

> [!example] 二维相关变量的和与差
> 设 $\sigma_1=2$、$\sigma_2=3$、$\rho=0.5$，则 $\mathrm{Cov}(X_1,X_2)=0.5\times2\times3=3$。
> 令 $S=X_1+X_2$、$D=X_1-X_2$，则
> $$
> \mathrm{Var}(S)=4+9+6=19,\qquad \mathrm{Var}(D)=4+9-6=7
> $$
> $$
> \mathrm{Cov}(S,D)=4-9=-5,\qquad \rho_{SD}=\frac{-5}{\sqrt{19\times7}}\approx-0.433
> $$
> 原本正相关的两个变量，其"和"与"差"变成负相关。差分对共模分量不敏感，正是这个负协方差的工程含义。

> [!tip] 白化在接收机中的位置
> 多天线接收时各支路噪声相关，匹配滤波前先做白化，可以把色噪声变成白噪声，从而复用 AWGN 下的最优接收机结构。白化矩阵由噪声协方差矩阵的特征分解得到，与 [[vault-notes/math/linear-algebra/07-singular-value-decomposition]] 中的降维思想一致。

## 关联

- 上一节：[[vault-notes/random-signals/02-expectation-variance]]
- 下一节：[[vault-notes/random-signals/02-joint-conditional-distributions]]
- 导航与记号：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/05-numerical-characteristics]]（协方差与相关系数的教材例题）、[[vault-notes/math/probability/04-multivariate-random-variables]]（多维分布与协方差矩阵）、[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]]（协方差矩阵的谱分解）、[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]（白化与降维）
