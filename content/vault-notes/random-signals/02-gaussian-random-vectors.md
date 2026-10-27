---
title: "高斯随机变量与高斯向量"
tags:
- 随机信号处理
- 02-随机变量与随机向量
- 高斯分布
- 协方差矩阵
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

# 高斯随机变量与高斯向量

> [!abstract] 这一节在讲什么
> 高斯分布是随机信号处理中出现频率最高的分布：热噪声、大量独立分量之和、线性变换后的误差，最终都落到它身上。本节给出一维与多维高斯的密度、协方差结构、线性变换与条件高斯公式，并说明复高斯与 IQ 噪声的关系。
> 核心结论：高斯向量经线性变换仍是高斯，均值按 $\mathbf{A}\boldsymbol{\mu}+\mathbf{b}$ 变、协方差按 $\mathbf{A}\mathbf{\Sigma}\mathbf{A}^{T}$ 变；条件高斯仍是高斯，其均值是观测的线性函数，协方差是 Schur 补；对联合高斯，不相关等价于独立。这些结论直接服务于 AWGN 信道建模、MMSE 与卡尔曼滤波、匹配接收与噪声白化。

## 一、一维高斯

> [!info] 定义 9.1 一维高斯分布
> $X\sim N(\mu,\sigma^2)$ 的密度为
> $$f_X(x)=\frac{1}{\sqrt{2\pi}\sigma}\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right),\qquad -\infty<x<\infty$$
> 标准正态记为 $\Phi(x)$，尾概率记为 $Q(x)=1-\Phi(x)$。

| 性质 | 内容 |
| --- | --- |
| 参数含义 | $\mu$ 是均值，$\sigma^2$ 是方差，二者独立决定分布 |
| 对称性 | 密度关于 $x=\mu$ 对称，偏度为 0 |
| $3\sigma$ 规则 | $P(\lvert X-\mu\rvert\le3\sigma)\approx0.9973$ |
| 尾概率 | $P(X>x)=Q\!\left(\frac{x-\mu}{\sigma}\right)$ |
| 线性变换 | $aX+b\sim N(a\mu+b,a^2\sigma^2)$ |

> [!warning] 高斯密度不能直接积分成闭式
> $\Phi(x)$ 没有初等原函数，工程上一律查表或用 $Q$ 函数。常用上界 $Q(x)\le\frac{1}{2}e^{-x^2/2}$（$x\ge0$）只用于数量级估计，不能用于误码率的精确比较。
> 另外 $Q(0)=0.5$，$Q(-x)=1-Q(x)$，这两个恒等式在推导对称判决门限时经常用到。

## 二、多维高斯

> [!info] 定义 9.2 高斯随机向量
> 若 $\mathbf{X}\in\mathbb{R}^{n}$ 的密度为
> $$f_{\mathbf{X}}(\mathbf{x})=\frac{1}{(2\pi)^{n/2}\lvert\mathbf{\Sigma}\rvert^{1/2}}\exp\left(-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^{T}\mathbf{\Sigma}^{-1}(\mathbf{x}-\boldsymbol{\mu})\right)$$
> 称 $\mathbf{X}\sim N(\boldsymbol{\mu},\mathbf{\Sigma})$，其中 $\mathbf{\Sigma}$ 为对称正定协方差矩阵。

密度只通过二次型 $(\mathbf{x}-\boldsymbol{\mu})^{T}\mathbf{\Sigma}^{-1}(\mathbf{x}-\boldsymbol{\mu})$ 依赖 $\mathbf{x}$，因此等概率面是以 $\boldsymbol{\mu}$ 为中心的椭球，主轴沿 $\mathbf{\Sigma}$ 的特征向量，半轴长与 $\sqrt{\lambda_i}$ 成正比。

| 描述方式 | 表达式 | 用途 |
| --- | --- | --- |
| 密度 | 上式 | 推导似然函数 |
| 特征函数 | $\exp\left(j\mathbf{t}^{T}\boldsymbol{\mu}-\frac{1}{2}\mathbf{t}^{T}\mathbf{\Sigma}\mathbf{t}\right)$ | 处理奇异协方差、证明卷积封闭性 |
| 白化形式 | $\mathbf{Z}=\mathbf{\Sigma}^{-1/2}(\mathbf{X}-\boldsymbol{\mu})\sim N(\mathbf{0},\mathbf{I})$ | 仿真、数值稳定计算 |

> [!tip] 白化让多维问题回到一维
> 用 Cholesky 分解 $\mathbf{\Sigma}=\mathbf{L}\mathbf{L}^{T}$，令 $\mathbf{X}=\boldsymbol{\mu}+\mathbf{L}\mathbf{Z}$，就把相关高斯向量变成独立标准正态向量的线性组合。
> 仿真时先用 `randn` 生成 $\mathbf{Z}$，再乘 $\mathbf{L}$，这是生成任意协方差高斯向量的标准做法。

## 三、线性变换与条件高斯

> [!info] 定理 9.1 线性变换
> 若 $\mathbf{X}\sim N(\boldsymbol{\mu},\mathbf{\Sigma})$，$\mathbf{Y}=\mathbf{A}\mathbf{X}+\mathbf{b}$，则
> $$\mathbf{Y}\sim N\big(\mathbf{A}\boldsymbol{\mu}+\mathbf{b},\ \mathbf{A}\mathbf{\Sigma}\mathbf{A}^{T}\big)$$
> 即使 $\mathbf{A}$ 是降维矩阵、$\mathbf{A}\mathbf{\Sigma}\mathbf{A}^{T}$ 奇异，$\mathbf{Y}$ 仍是高斯的（此时用特征函数定义，密度可能不存在）。

**条件高斯**：把 $\mathbf{X}$ 分块为 $[\mathbf{X}_1;\mathbf{X}_2]$，均值与协方差相应分块，则在 $\mathbf{X}_2=\mathbf{x}_2$ 下

$$E[\mathbf{X}_1\mid\mathbf{X}_2=\mathbf{x}_2]=\boldsymbol{\mu}_1+\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{x}_2-\boldsymbol{\mu}_2)$$

$$\mathrm{Cov}(\mathbf{X}_1\mid\mathbf{X}_2)=\mathbf{\Sigma}_{11}-\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}$$

> [!tip] 条件高斯的三个读法
> 1. 条件均值是 $\mathbf{x}_2$ 的**仿射函数**，斜率 $\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}$ 就是线性 MMSE 的系数；
> 2. 条件协方差与 $\mathbf{x}_2$ 无关，只由联合协方差决定，这是卡尔曼滤波增益可预先计算的关键；
> 3. $\mathbf{\Sigma}_{11}-\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}$ 是 Schur 补，必然半正定，观测越多条件方差越小。

> [!warning] 条件方差不会变大
> 由 Schur 补的半正定性，$\mathbf{\Sigma}_{11}-\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\preceq\mathbf{\Sigma}_{11}$。若算出条件方差比先验还大，一定是分块或转置写错了。
> 这也解释了"观测总是带来信息"：最差情况是观测与待估量无关，此时条件方差等于先验方差。

## 四、高斯向量的性质

| 性质 | 内容 | 备注 |
| --- | --- | --- |
| 不相关即独立 | $\mathrm{Cov}(X_i,X_j)=0\Rightarrow X_i\perp X_j$ | 仅对联合高斯成立 |
| 线性组合封闭 | 任意线性组合仍为高斯 | 包括极限情形 |
| 边缘仍高斯 | 任一分量的边缘分布是高斯的 | 反之不成立 |
| 条件仍高斯 | 给定部分分量，其余仍为高斯 | 条件均值为线性 |
| 和封闭 | 独立高斯之和仍为高斯 | 均值、方差分别相加 |

> [!warning] 边缘高斯推不出联合高斯
> 令 $X\sim N(0,1)$，$S$ 以概率 $1/2$ 取 $\pm1$ 且与 $X$ 独立，$Y=SX$。则 $Y\sim N(0,1)$，$X$ 与 $Y$ 的边缘都是高斯的，但 $(X,Y)$ 的联合分布是两个退化椭圆上的混合，不是二维高斯。
> 所以"每个分量都是高斯"不能作为联合高斯的判据，必须验证任意线性组合都是高斯，或直接给出联合密度。

## 五、复高斯与 IQ 噪声

> [!info] 定义 9.3 复高斯
> 若 $Z=X+jY$ 且 $(X,Y)$ 联合高斯，称 $Z$ 为**复高斯**随机变量。
> 若进一步 $E[(Z-\mu_Z)^2]=0$（零均值时即 $E[Z^2]=0$，等价于 $X,Y$ 独立且方差相等），称 $Z$ 为 **proper** 复高斯（关于均值圆对称），记 $Z\sim\mathcal{CN}(\mu_Z,\sigma_Z^2)$，其密度为
> $$f_Z(z)=\frac{1}{\pi\sigma_Z^2}\exp\left(-\frac{\lvert z-\mu_Z\rvert^2}{\sigma_Z^2}\right)$$

在 IQ 接收机中，基带噪声常写成 $Z=I+jQ$。若 $I,Q$ 独立同分布 $N(0,\sigma^2)$，则 $E[\lvert Z\rvert^2]=2\sigma^2$，即复噪声功率是单支路的两倍。

> [!warning] 复方差的定义
> 复随机变量的方差是 $E[\lvert Z-\mu_Z\rvert^2]$，不是 $E[(Z-\mu_Z)^2]$。后者的期望 $E[Z^2]-\mu_Z^2$ 称为**伪方差**，proper 高斯下它为 0。
> 若把伪方差当成方差，会得到"复高斯方差为 0"的荒谬结论。IQ 幅度或相位不平衡时伪方差不为零，此时 $I,Q$ 相关或方差不等的现象称为**非圆**。

> [!tip] 从 IQ 到复包络
> 实带通信号 $x(t)=I(t)\cos\omega_ct-Q(t)\sin\omega_ct$ 的复包络为 $I(t)+jQ(t)$。用复信号建模可以把两路实运算合成一路复运算，功率、相关函数与 PSD 的公式都保持相同形式，只是内积改用共轭。具体实现见 IQ 信号相关笔记。

## 六、作业题解析

> [!note] 题目来源
> 本节收录课程作业第 1 组（概率论 1–13 题）中与本篇相关的题目，原始截图见 作业截图。解析按“读题 → 判据 → 推导 → 易错点”展开，记号与正文一致。

### 题 12 · 正交变换得到标准高斯向量

> [!example] 题目
> 设随机变量 $X_1,X_2,X_3$ 是相互独立的标准正态分布随机变量，求随机变量
> $$Y_1=\frac{1}{\sqrt{2}}(X_1-X_2),\qquad Y_2=\frac{1}{\sqrt{6}}(X_1+X_2-2X_3),\qquad Y_3=\frac{1}{\sqrt{3}}(X_1+X_2+X_3)$$
> 的联合概率密度函数，以及随机向量 $(Y_1,Y_2,Y_3)^{T}$ 的均值向量和协方差矩阵。

**解**：

把三个式子写成矩阵形式 $\mathbf{Y}=\mathbf{Q}\mathbf{X}$，其中

$$\mathbf{Q}=\begin{bmatrix}\frac{1}{\sqrt{2}}&-\frac{1}{\sqrt{2}}&0\\\frac{1}{\sqrt{6}}&\frac{1}{\sqrt{6}}&-\frac{2}{\sqrt{6}}\\\frac{1}{\sqrt{3}}&\frac{1}{\sqrt{3}}&\frac{1}{\sqrt{3}}\end{bmatrix}$$

先验证 $\mathbf{Q}$ 是正交矩阵。记三行依次为 $\mathbf{q}_1,\mathbf{q}_2,\mathbf{q}_3$。两两内积为

$$\mathbf{q}_1^{T}\mathbf{q}_2=\frac{1}{\sqrt{12}}-\frac{1}{\sqrt{12}}+0=0,\qquad \mathbf{q}_1^{T}\mathbf{q}_3=\frac{1}{\sqrt{6}}-\frac{1}{\sqrt{6}}+0=0$$

$$\mathbf{q}_2^{T}\mathbf{q}_3=\frac{1}{\sqrt{18}}+\frac{1}{\sqrt{18}}-\frac{2}{\sqrt{18}}=0$$

各行范数平方为

$$\lVert\mathbf{q}_1\rVert^{2}=\frac{1}{2}+\frac{1}{2}=1,\qquad \lVert\mathbf{q}_2\rVert^{2}=\frac{1}{6}+\frac{1}{6}+\frac{4}{6}=1,\qquad \lVert\mathbf{q}_3\rVert^{2}=\frac{1}{3}+\frac{1}{3}+\frac{1}{3}=1$$

所以 $\mathbf{Q}\mathbf{Q}^{T}=\mathbf{I}_3$，$\mathbf{Q}$ 为正交矩阵，且 $\lvert\det\mathbf{Q}\rvert=1$。

$\mathbf{X}\sim N(\mathbf{0},\mathbf{I}_3)$，由正文定理 9.1，高斯向量经线性变换仍是高斯向量，均值与协方差分别为

$$\boldsymbol{\mu}_Y=\mathbf{Q}\boldsymbol{\mu}_X=\mathbf{0},\qquad \mathbf{C}_Y=\mathbf{Q}\mathbf{I}_3\mathbf{Q}^{T}=\mathbf{Q}\mathbf{Q}^{T}=\mathbf{I}_3$$

于是 $\mathbf{Y}\sim N(\mathbf{0},\mathbf{I}_3)$，联合密度为

$$f_{\mathbf{Y}}(\mathbf{y})=\frac{1}{(2\pi)^{3/2}\lvert\mathbf{I}_3\rvert^{1/2}}\exp\left(-\frac{1}{2}\mathbf{y}^{T}\mathbf{I}_3^{-1}\mathbf{y}\right)=\frac{1}{(2\pi)^{3/2}}\exp\left(-\frac{y_1^{2}+y_2^{2}+y_3^{2}}{2}\right)$$

即

$$f_{Y_1Y_2Y_3}(y_1,y_2,y_3)=\frac{1}{(2\pi)^{3/2}}e^{-\frac{y_1^{2}+y_2^{2}+y_3^{2}}{2}}$$

协方差矩阵 $\mathbf{C}_Y=\mathbf{I}_3$ 表明 $\mathrm{Var}(Y_i)=1$、$\mathrm{Cov}(Y_i,Y_j)=0$（$i\neq j$）。$\mathbf{Y}$ 是联合高斯的，而联合高斯下不相关等价于独立，所以 $Y_1,Y_2,Y_3$ 是相互独立的标准正态变量。

用变量替换复核。反变换为 $\mathbf{X}=\mathbf{Q}^{T}\mathbf{Y}$，且 $\lvert\det\mathbf{Q}\rvert=1$，故

$$f_{\mathbf{Y}}(\mathbf{y})=f_{\mathbf{X}}(\mathbf{Q}^{T}\mathbf{y})\lvert\det\mathbf{Q}\rvert^{-1}=\frac{1}{(2\pi)^{3/2}}e^{-\frac{1}{2}\lVert\mathbf{Q}^{T}\mathbf{y}\rVert^{2}}=\frac{1}{(2\pi)^{3/2}}e^{-\frac{\lVert\mathbf{y}\rVert^{2}}{2}}$$

最后一步用到正交性 $\lVert\mathbf{Q}^{T}\mathbf{y}\rVert^{2}=\mathbf{y}^{T}\mathbf{Q}\mathbf{Q}^{T}\mathbf{y}=\lVert\mathbf{y}\rVert^{2}$。正交变换既保长度又保体积，所以密度表达式里不出现额外的雅可比因子。

**答**：$f_{Y_1Y_2Y_3}(y_1,y_2,y_3)=\dfrac{1}{(2\pi)^{3/2}}\exp\left[-\dfrac{y_1^{2}+y_2^{2}+y_3^{2}}{2}\right]$；均值向量 $\boldsymbol{\mu}_Y=(0,0,0)^{T}$；协方差矩阵 $\mathbf{C}_Y=\mathbf{I}_3$。等价地说，$Y_1,Y_2,Y_3$ 相互独立且都服从 $N(0,1)$。

> [!warning] 易错点
> - 只验证“每行范数为 $1$”就下结论：还必须验证三行两两正交，否则 $\mathbf{Q}\mathbf{Q}^{T}\neq\mathbf{I}_3$，协方差矩阵不是单位阵。
> - 协方差传播方向写错：应为 $\mathbf{C}_Y=\mathbf{Q}\mathbf{C}_X\mathbf{Q}^{T}$，右乘 $\mathbf{Q}^{T}$；一般 $\mathbf{C}_X$ 下写成 $\mathbf{Q}^{T}\mathbf{C}_X\mathbf{Q}$ 是错的（本题 $\mathbf{C}_X=\mathbf{I}_3$ 才碰巧同值）。
> - 误把 $\lvert\det\mathbf{Q}\rvert$ 当成非 $1$ 的系数而引入额外缩放：正交变换下 $\lvert\det\mathbf{Q}\rvert=1$，密度表达式不应出现任何额外因子；换成非正交变换 $\mathbf{Y}=\mathbf{A}\mathbf{X}$ 时才要乘 $1/\lvert\det\mathbf{A}\rvert$。
> - 由“每个 $Y_i$ 都是标准正态”不能直接推出联合密度是上式：本题的依据是 $\mathbf{Y}$ 为联合高斯（线性变换保持高斯性），再结合协方差为对角阵才得到独立，正文 §四的反例正是针对这种混淆。

## 关联

- 上一节：[[vault-notes/random-signals/02-joint-conditional-distributions]]
- 下一节：[[vault-notes/random-signals/02-complex-random-variables]]
- 导航与记号：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/04-channel]]（AWGN 与衰落信道建模）、[[vault-notes/communication/09-optimal-reception]]（高斯噪声下的似然函数）、[[vault-notes/communication/03-random-processes]]（高斯过程）、[[vault-notes/math/probability/08-parameter-estimation]]（高斯假设下的 CRLB）
