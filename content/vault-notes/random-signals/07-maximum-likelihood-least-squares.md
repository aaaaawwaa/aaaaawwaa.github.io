---
title: "最大似然与最小二乘"
tags:
- 随机信号处理
- 07-统计估计与最优滤波
- 参数估计
- 最小二乘
type: concept
subjects:
- 随机信号处理
- 统计信号处理
domains:
- 估计与检测
- 统计信号处理
status: learning
aliases: []
prerequisites: []
related: []
---

# 最大似然与最小二乘

> [!abstract] 这一节在讲什么
> 最大似然（MLE）从概率模型出发，选择让观测最可能出现的参数；最小二乘（LS）从几何出发，选择让残差平方和最小的参数。两者在独立高斯噪声的线性模型下给出同一个解，但在非高斯或相关噪声下会分道扬镳。本节给出两种方法的求解步骤、线性模型 $\mathbf{y}=\mathbf{H}\theta+\mathbf{w}$ 的正规方程，以及直线拟合与时延估计两个例子。

## 一、最大似然估计

> [!info] 定义 最大似然估计
> 设观测 $\mathbf{x}$ 的联合密度为 $f(\mathbf{x};\theta)$，似然函数 $L(\theta)=f(\mathbf{x};\theta)$。使似然最大的参数值称为最大似然估计：$\hat{\theta}_{ML}=\arg\max_{\theta}\ln f(\mathbf{x};\theta)$。

实际计算通常取对数，把连乘变成求和。若 $f$ 对 $\theta$ 可微且最大值在内部，则 $\hat{\theta}_{ML}$ 满足得分方程

$$\frac{\partial\ell(\theta)}{\partial\theta}=\mathbf{0},\qquad \ell(\theta)=\ln f(\mathbf{x};\theta)$$

还需二阶条件或边界检查确认是最大值。MLE 有三个常用性质：参数变换不变性，即 $g(\hat{\theta}_{ML})$ 是 $g(\theta)$ 的 MLE；正则条件下渐近无偏、渐近有效；样本量足够大时近似服从

$$\sqrt{N}\left(\hat{\theta}_{ML}-\theta\right)\xrightarrow{d}\mathcal{N}\left(\mathbf{0},I_1^{-1}(\theta)\right)$$

其中 $I_1$ 是单样本 Fisher 信息。这把 MLE 与 [[vault-notes/random-signals/07-estimator-bias-variance]] 中的 CRLB 联系起来。

> [!warning] MLE 不等于无偏
> 高斯方差 $\sigma^2$ 的 MLE 是 $\frac{1}{N}\sum(x_n-\bar{x})^2$，期望为 $\frac{N-1}{N}\sigma^2$，有偏；均匀分布 $U(0,\theta)$ 的 MLE 是样本最大值，也有偏。MLE 的优点是渐近有效，不是有限样本无偏。

## 二、最小二乘

> [!info] 定义 最小二乘估计
> 给定观测 $\mathbf{y}\in\mathbb{R}^N$ 与模型 $\mathbf{y}=\mathbf{H}\theta+\mathbf{w}$，最小二乘估计使残差平方和最小：$\hat{\theta}_{LS}=\arg\min_{\theta}\lVert\mathbf{y}-\mathbf{H}\theta\rVert^2$。

若 $\mathbf{H}$ 列满秩，展开目标函数并对 $\theta$ 求梯度，得到正规方程

$$\mathbf{H}^T\mathbf{H}\hat{\theta}_{LS}=\mathbf{H}^T\mathbf{y}\quad\Longrightarrow\quad\hat{\theta}_{LS}=(\mathbf{H}^T\mathbf{H})^{-1}\mathbf{H}^T\mathbf{y}$$

几何上，$\mathbf{H}\hat{\theta}_{LS}$ 是 $\mathbf{y}$ 在 $\mathbf{H}$ 列空间上的正交投影，残差与列空间正交，即 $\mathbf{H}^T(\mathbf{y}-\mathbf{H}\hat{\theta}_{LS})=\mathbf{0}$。这条正交性与 [[vault-notes/math/linear-algebra/04-orthogonality]] 中的投影定理是同一件事。

若各观测噪声方差不相等或相关，应使用加权最小二乘：

$$\hat{\theta}_{WLS}=\arg\min_{\theta}(\mathbf{y}-\mathbf{H}\theta)^T\mathbf{W}(\mathbf{y}-\mathbf{H}\theta)=(\mathbf{H}^T\mathbf{W}\mathbf{H})^{-1}\mathbf{H}^T\mathbf{W}\mathbf{y}$$

权重矩阵 $\mathbf{W}$ 越接近噪声协方差逆，估计越有效。

## 三、线性模型：高斯噪声下 LS 等于 MLE

设 $\mathbf{y}=\mathbf{H}\theta+\mathbf{w}$，$\mathbf{w}\sim\mathcal{N}(\mathbf{0},\sigma^2\mathbf{I})$，则似然为

$$f(\mathbf{y};\theta)=\frac{1}{(2\pi\sigma^2)^{N/2}}\exp\left[-\frac{1}{2\sigma^2}\lVert\mathbf{y}-\mathbf{H}\theta\rVert^2\right]$$

对数似然为

$$\ell(\theta)=-\frac{N}{2}\ln(2\pi\sigma^2)-\frac{1}{2\sigma^2}\lVert\mathbf{y}-\mathbf{H}\theta\rVert^2$$

第一项与 $\theta$ 无关，最大化 $\ell$ 等价于最小化 $\lVert\mathbf{y}-\mathbf{H}\theta\rVert^2$，所以 $\hat{\theta}_{ML}=\hat{\theta}_{LS}$。若噪声协方差为 $\mathbf{C}$ 而非 $\sigma^2\mathbf{I}$，则 MLE 对应 $\mathbf{W}=\mathbf{C}^{-1}$ 的 WLS。这条等价关系是高斯假设在估计问题中的核心作用。

> [!tip] 为什么高斯噪声如此特殊
> 高斯密度的指数项就是负的平方误差，取对数后似然与残差平方和只差一个常数。换成拉普拉斯噪声，MLE 对应最小绝对误差；换成均匀噪声，MLE 退化为可行域上的约束优化。**噪声分布决定损失函数**，LS 只是高斯情形下的特例。

## 四、例子：直线拟合与时延估计

> [!example] 直线拟合
> 观测 $y_n=a+bn+w_n$，$n=1,\dots,N$，$w_n$ 独立同分布零均值。记 $\bar{n}$、$\bar{y}$ 为样本均值，则正规方程给出
>
> $$\hat{b}=\frac{\sum_{n=1}^N(n-\bar{n})(y_n-\bar{y})}{\sum_{n=1}^N(n-\bar{n})^2},\qquad \hat{a}=\bar{y}-\hat{b}\bar{n}$$
>
> 若 $w_n$ 为高斯噪声，这两式就是 MLE；若噪声只满足零均值、等方差且不相关，它们仍是 BLUE（高斯-马尔可夫定理），但不再保证有效。

> [!example] 时延估计
> 接收信号 $r(t)=s(t-\tau)+w(t)$，$s(t)$ 已知，估计时延 $\tau$。最小二乘准则 $\hat{\tau}_{LS}=\arg\min_{\tau}\int\lvert r(t)-s(t-\tau)\rvert^2\,dt$ 展开后等价于最大化互相关 $\int r(t)s(t-\tau)\,dt$，所以工程上常用相关峰搜索实现。白高斯噪声下它与 MLE 相同；目标函数通常非凸，需要粗搜索再插值细化。估计精度受信号带宽与信噪比共同约束，带宽越大、信噪比越高，时延分辨越细。

## 五、MLE 与 LS 的边界

| 维度 | 最大似然 MLE | 最小二乘 LS |
| --- | --- | --- |
| 需要的信息 | 完整噪声分布 $f(\mathbf{w})$ | 只需模型与二阶矩 |
| 优化目标 | 最大化似然 | 最小化残差平方和 |
| 高斯白噪声 | 与 LS 相同 | 与 MLE 相同 |
| 非高斯噪声 | 通常更有效 | 不再等价，可能明显变差 |
| 相关噪声 | 用 $\mathbf{C}^{-1}$ 加权 | 需 WLS 才有效 |
| 数值难点 | 可能非凸、需初值 | 有闭式解，但矩阵可能病态 |

> [!warning] 三个常见坑
> 一是看到“线性模型”就默认 LS 最优，忽略了噪声分布；二是 $\mathbf{H}^T\mathbf{H}$ 接近奇异时直接求逆，数值上应改用 QR 分解或 SVD；三是把“残差平方和最小”误当成“误差方差最小”，后者还取决于设计矩阵的条件数。

## 关联

- 上一节：[[vault-notes/random-signals/07-estimator-bias-variance]]
- 下一节：[[vault-notes/random-signals/07-mmse-lmmse]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/08-parameter-estimation]]、[[vault-notes/math/linear-algebra/10-applications]]、[[vault-notes/math/linear-algebra/04-orthogonality]]
