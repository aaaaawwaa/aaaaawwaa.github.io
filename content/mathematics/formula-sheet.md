---
title: 数学公式速查
description: 线性代数、概率统计、复变函数、积分变换与场论的常用公式与适用条件，一页速查。
tags:
  - mathematics
  - formula-sheet
  - reference
---

## 怎么用这一页

这是跨主题的"考前/调试前速查"，只列最常用的结论与**成立条件**。每个区块都给出对应主题文章的链接，需要推导时回到正文；需要完整课程推导时看文末的笔记链接。公式中的符号沿用对应主题文章的约定，混用前先确认符号与归一化。

## 线性代数

| 主题 | 公式 | 条件/备注 |
| --- | --- | --- |
| 矩阵乘向量 | $A\mathbf{x}=\sum_k x_k\mathbf{a}_k$ | 列的线性组合 |
| 逆 | $(AB)^{-1}=B^{-1}A^{-1}$ | $A,B$ 可逆 |
| 转置 | $(AB)^{T}=B^{T}A^{T}$ | 顺序反转 |
| 行列式 | $\det(AB)=\det A\det B$，$\det(A^{-1})=1/\det A$ | 方阵 |
| 主元公式 | $\det A=(-1)^p\prod_i u_{ii}$ | $PA=LU$，$p$ 为换行次数 |
| 秩–零化度 | $\dim C(A)=\dim C(A^{T})=r$，$\dim N(A)=n-r$ | $A$ 为 $m\times n$ |
| 可逆判据 | $n$ 个主元 / $\det A\ne0$ / 列无关 / $N(A)=\{0\}$ | $n\times n$ |
| 通解 | $\mathbf{x}=\mathbf{x}_p+\mathbf{x}_n$ | $\mathbf{x}_n\in N(A)$ |
| 投影（直线） | $P=\dfrac{\mathbf{a}\mathbf{a}^{T}}{\mathbf{a}^{T}\mathbf{a}}$ | $\mathbf{a}\ne\mathbf{0}$ |
| 投影（子空间） | $P=A(A^{T}A)^{-1}A^{T}$ | $A$ 列满秩 |
| 法方程 | $A^{T}A\hat{\mathbf{x}}=A^{T}\mathbf{b}$ | 任意 $A$；列满秩时解唯一 |
| QR 最小二乘 | $R\hat{\mathbf{x}}=Q^{T}\mathbf{b}$ | $A=QR$ |
| 特征值 | $\det(A-\lambda I)=0$，$\sum\lambda_i=\operatorname{tr}A$，$\prod\lambda_i=\det A$ | $n$ 个根计重数 |
| 对角化 | $A=S\Lambda S^{-1}$ | $n$ 个线性无关特征向量 |
| 谱定理 | $A=Q\Lambda Q^{T}$ | 实对称 |
| 正定 | $\mathbf{x}^{T}A\mathbf{x}>0\ (\mathbf{x}\ne\mathbf{0})$ | 等价于全部特征值 $>0$ |
| SVD | $A=U\Sigma V^{T}$，$A^{T}A=V\Sigma^{2}V^{T}$ | 任意矩阵 |
| 低秩误差 | $\lVert A-A_k\rVert_2=\sigma_{k+1}$ | Eckart–Young |
| 伪逆 | $A^{+}=V\Sigma^{+}U^{T}$ | 最小范数最小二乘解 |
| 条件数 | $\operatorname{cond}_2(A)=\sigma_1/\sigma_r$，$\operatorname{cond}(A^{T}A)=\operatorname{cond}(A)^{2}$ | $A$ 可逆 |
| 向量范数 | $\lVert \mathbf{x}\rVert_1,\lVert \mathbf{x}\rVert_2,\lVert \mathbf{x}\rVert_\infty$ | $\lVert A\rVert_2=\sigma_1$ |
| 迭代收敛 | $\rho(B)<1$ | $B=M^{-1}N$ |
| FFT 复杂度 | $T(N)=2T(N/2)+O(N)$ | $O(N\log N)$ |

详见 [[mathematics/linear-algebra-basics|线性代数基础]]、[[mathematics/orthogonality-least-squares|正交性与最小二乘]]、[[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]]、[[mathematics/linear-transformations-numerics|线性变换与数值稳定性]]。

## 概率论与数理统计

| 主题 | 公式 | 条件/备注 |
| --- | --- | --- |
| 加法公式 | $P(A\cup B)=P(A)+P(B)-P(AB)$ | 任意事件 |
| 条件概率 | $P(A\mid B)=P(AB)/P(B)$ | $P(B)>0$ |
| 全概率 | $P(A)=\sum_iP(B_i)P(A\mid B_i)$ | $B_i$ 为划分 |
| 贝叶斯 | $P(B_k\mid A)=\dfrac{P(B_k)P(A\mid B_k)}{P(A)}$ | 同上 |
| 独立 | $P(AB)=P(A)P(B)$ | 互斥且非零则必不独立 |
| 期望线性 | $E(aX+bY+c)=aE(X)+bE(Y)+c$ | 不需要独立 |
| 方差 | $\operatorname{Var}(X)=E(X^2)-\mu^2$ | — |
| 和的方差 | $\operatorname{Var}(X\pm Y)=\operatorname{Var}X+\operatorname{Var}Y\pm2\operatorname{Cov}$ | 独立时协方差为 0 |
| 协方差 | $\operatorname{Cov}(X,Y)=E(XY)-E(X)E(Y)$，$\rho\in[-1,1]$ | — |
| 协方差矩阵 | $V=E[(\mathbf{x}-\boldsymbol{\mu})(\mathbf{x}-\boldsymbol{\mu})^{T}]$ | 对称半正定 |
| 传播律 | $\operatorname{Cov}(A\mathbf{x})=AVA^{T}$ | $A$ 确定性 |
| 切比雪夫 | $P(\vert X-\mu\vert \ge\varepsilon)\le\sigma^{2}/\varepsilon^{2}$ | 任意分布 |
| CLT | $\dfrac{\sum X_i-n\mu}{\sqrt n\sigma}\xrightarrow{d}N(0,1)$ | 独立同分布、方差有限 |
| 二项正态近似 | $\Phi\!\left(\dfrac{k+0.5-np}{\sqrt{np(1-p)}}\right)$ | 连续性修正 |
| 样本均值 | $E(\bar X)=\mu$，$\operatorname{Var}(\bar X)=\sigma^{2}/n$ | 简单随机样本 |
| 样本方差 | $S^{2}=\frac{1}{n-1}\sum(X_i-\bar X)^{2}$，$E(S^{2})=\sigma^{2}$ | 分母 $n-1$ |
| 卡方 | $\chi^{2}=X_1^{2}+\cdots+X_n^{2}\sim\chi^{2}(n)$ | $X_i$ 独立 $N(0,1)$ |
| t | $T=\dfrac{X}{\sqrt{Y/n}}\sim t(n)$ | $X\sim N(0,1)\perp Y\sim\chi^{2}(n)$ |
| F | $F=\dfrac{X/n_1}{Y/n_2}\sim F(n_1,n_2)$ | 两个独立卡方之比 |
| 抽样四结论 | $\dfrac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)$；$\dfrac{(n-1)S^{2}}{\sigma^{2}}\sim\chi^{2}(n-1)$；$\bar X\perp S^{2}$；$\dfrac{\bar X-\mu}{S/\sqrt n}\sim t(n-1)$ | 正态总体 |
| z 区间 | $\bar X\pm z_{\alpha/2}\dfrac{\sigma}{\sqrt n}$ | $\sigma$ 已知 |
| t 区间 | $\bar X\pm t_{\alpha/2}(n-1)\dfrac{S}{\sqrt n}$ | $\sigma$ 未知 |
| 方差区间 | $\left[\dfrac{(n-1)S^{2}}{\chi^{2}_{\alpha/2}},\dfrac{(n-1)S^{2}}{\chi^{2}_{1-\alpha/2}}\right]$ | 正态总体 |
| 样本量 | $n\ge\left(\dfrac{z_{\alpha/2}\sigma}{E}\right)^{2}$ | 给定误差限 $E$ |
| 检验统计量 | $z=\dfrac{\bar X-\mu_0}{\sigma/\sqrt n}$，$t=\dfrac{\bar X-\mu_0}{S/\sqrt n}$，$\chi^{2}=\dfrac{(n-1)S^{2}}{\sigma_0^{2}}$ | 对应前提 |
| ANOVA | $SST=SSA+SSE$，$F=\dfrac{SSA/(r-1)}{SSE/(n-r)}$ | 独立、正态、方差齐性 |
| 回归 | $\hat\beta_1=S_{xy}/S_{xx}$，$R^{2}=SSR/S_{yy}$ | 一元线性模型 |

详见 [[mathematics/probability-overview|概率论概览]]、[[mathematics/statistics-inference|数理统计与推断]]。

## 复变函数

| 主题 | 公式 | 条件/备注 |
| --- | --- | --- |
| 欧拉公式 | $e^{i\theta}=\cos\theta+i\sin\theta$ | — |
| 棣莫弗 | $z^{n}=r^{n}e^{in\theta}$ | $z=re^{i\theta}$ |
| 方根 | $w_k=\sqrt[n]{r}e^{i(\theta+2k\pi)/n}$ | $n$ 个值 |
| C-R 方程 | $u_x=v_y$，$u_y=-v_x$ | $u,v$ 可微 |
| 导数 | $f'=u_x+iv_x=v_y-iu_y$ | 解析点 |
| 极坐标 C-R | $u_r=v_\theta/r$，$v_r=-u_\theta/r$ | $z=re^{i\theta}$ |
| 解析 $\Rightarrow$ 调和 | $\nabla^{2}u=\nabla^{2}v=0$ | — |
| 柯西定理 | $\oint_C f\,dz=0$ | 单连通、$f$ 解析 |
| 柯西公式 | $f(z_0)=\dfrac{1}{2\pi i}\oint_C\dfrac{f(z)}{z-z_0}dz$ | $z_0$ 在内部 |
| 高阶导数 | $f^{(n)}(z_0)=\dfrac{n!}{2\pi i}\oint_C\dfrac{f(z)}{(z-z_0)^{n+1}}dz$ | 同上 |
| 泰勒级数 | $f(z)=\sum\dfrac{f^{(n)}(z_0)}{n!}(z-z_0)^{n}$ | $\vert z-z_0\vert <R$ |
| 洛朗级数 | $f(z)=\sum_{n=-\infty}^{\infty}c_n(z-z_0)^{n}$ | 环域 $r<\vert z-z_0\vert <R$ |
| 留数 | $\operatorname{Res}[f,z_0]=c_{-1}$ | — |
| 留数定理 | $\oint_C f\,dz=2\pi i\sum\operatorname{Res}$ | 逆时针、奇点在内部 |
| 简单极点 | $\operatorname{Res}=\lim(z-z_0)f$；$P/Q$ 时为 $P(z_0)/Q'(z_0)$ | 一阶极点 |
| m 阶极点 | $\dfrac{1}{(m-1)!}\lim\dfrac{d^{m-1}}{dz^{m-1}}[(z-z_0)^{m}f]$ | — |
| 三角积分 | $\int_0^{2\pi}R(\cos\theta,\sin\theta)d\theta=2\pi i\sum_{\vert z\vert <1}\operatorname{Res}$ | $z=e^{i\theta}$ |
| 有理积分 | $\int_{-\infty}^{\infty}\dfrac{P}{Q}dx=2\pi i\sum_{\operatorname{Im}>0}\operatorname{Res}$ | $\deg Q\ge\deg P+2$ |
| 保角 | $f'(z_0)\ne0$ | 解析 + 非零导数 |
| 分式线性 | $w=\dfrac{az+b}{cz+d}$ | $ad-bc\ne0$，保圆、保交比 |

详见 [[mathematics/complex-analysis|复变函数基础]]。

## 积分变换与场论

| 主题 | 公式 | 条件/备注 |
| --- | --- | --- |
| 傅里叶级数 | $c_n=\dfrac1T\int_T f(t)e^{-in\omega_0t}dt$ | 狄利克雷条件 |
| 傅里叶变换 | $F(\omega)=\int f(t)e^{-i\omega t}dt$ | 绝对可积是充分条件 |
| 逆变换 | $f(t)=\dfrac{1}{2\pi}\int F(\omega)e^{i\omega t}d\omega$ | — |
| 卷积定理 | $f*g\leftrightarrow F(\omega)G(\omega)$ | — |
| 帕塞瓦尔 | $\int\vert f\vert ^{2}dt=\dfrac{1}{2\pi}\int\vert F\vert ^{2}d\omega$ | 能量守恒 |
| 抽样定理 | $f_s>2f_H$ | 严格带限 |
| 拉氏变换 | $F(s)=\int_{0^{-}}^{\infty}f(t)e^{-st}dt$ | ROC 必须写明 |
| 微分性质 | $\mathcal{L}[f']=sF(s)-f(0^{-})$ | 单边 |
| 卷积性质 | $\mathcal{L}[f*g]=F(s)G(s)$ | — |
| 初值 | $f(0^{+})=\lim_{s\to\infty}sF(s)$ | — |
| 终值 | $f(\infty)=\lim_{s\to0}sF(s)$ | $sF(s)$ 极点全在左半平面 |
| 稳定性 | 极点全在左半平面 | 因果 LTI 系统 |
| 梯度 | $\nabla\varphi=(\varphi_x,\varphi_y,\varphi_z)$ | 指向增长最快方向 |
| 散度/旋度 | $\nabla\cdot\mathbf{A}$，$\nabla\times\mathbf{A}$ | 源强/环流 |
| 高斯定理 | $\oiint_S\mathbf{A}\cdot d\mathbf{S}=\iiint_V\nabla\cdot\mathbf{A}\,dV$ | — |
| 斯托克斯 | $\oint_C\mathbf{A}\cdot d\mathbf{l}=\iint_S(\nabla\times\mathbf{A})\cdot d\mathbf{S}$ | 右手螺旋 |
| 拉普拉斯方程 | $\nabla^{2}\varphi=0$ | 调和函数 |
| 泊松方程 | $\nabla^{2}\varphi=f$ | 有源 |
| 基本解 | $\nabla^{2}(1/r)=-4\pi\delta(\mathbf{r})$ | 三维 |
| 边界条件 | 狄利克雷/诺伊曼/混合 | 唯一性定理 |

详见 [[mathematics/complex-transforms-and-fields|复变变换与场论]]。

## 常用数值

- $z_{0.025}=1.96$，$z_{0.05}=1.645$，$z_{0.005}=2.576$。
- 高斯：$68.27\%$（$\pm\sigma$）、$95.45\%$（$\pm2\sigma$）、$99.73\%$（$\pm3\sigma$）。
- $Q(x)=1-\Phi(x)=\frac12\operatorname{erfc}(x/\sqrt2)$；QPSK 中 $E_s=2E_b$。
- 距离分辨率 $\Delta R=c/(2B)$；最大无模糊距离由拍频上限 $f_s/2$ 决定。
- 双精度约 16 位有效数字；$\operatorname{cond}\approx10^{k}$ 时只剩 $16-k$ 位。

## 来源与延伸阅读

公式的推导与例题见本分类各主题文章；完整课程推导见 [[mathematics/index|数学基础索引]] 中的课程笔记链接。跨学科速查：[[signal-processing/random-signals-formula-sheet|随机信号处理公式速查]]、[[communication/communication-formulas|通信原理公式速查]]。

- [[vault-notes/math/linear-algebra/02-solving-linear-systems|线性方程组的求解]]、[[vault-notes/math/linear-algebra/04-orthogonality|正交性]]、[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors|特征值与特征向量]]、[[vault-notes/math/linear-algebra/07-singular-value-decomposition|奇异值分解]]。
- [[vault-notes/math/probability/05-numerical-characteristics|数字特征]]、[[vault-notes/math/probability/07-samples-sampling-distributions|抽样分布]]、[[vault-notes/math/probability/08-parameter-estimation|参数估计]]、[[vault-notes/math/probability/09-hypothesis-testing|假设检验]]、[[vault-notes/math/probability/10-anova-regression|方差分析与回归]]。
- [[vault-notes/math/complex-analysis/03-complex-integration|复积分]]、[[vault-notes/math/complex-analysis/05-residues-applications|留数]]、[[vault-notes/math/complex-analysis/07-fourier-transform|傅里叶变换]]、[[vault-notes/math/complex-analysis/08-laplace-transform|拉普拉斯变换]]、[[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value|场论积分定理与边值问题]]。
