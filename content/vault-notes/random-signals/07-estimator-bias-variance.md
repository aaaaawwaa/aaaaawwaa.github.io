---
title: "估计量的偏差和方差"
tags:
- 随机信号处理
- 07-统计估计与最优滤波
- 参数估计
- 估计量评价
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

# 估计量的偏差和方差

> [!abstract] 这一节在讲什么
> 面对同一组观测，可以构造无数个估计量，凭直觉选一个并不可靠。本节用偏差、方差和 MSE 三个指标评价估计量，并区分无偏、有效、一致这三种常被混用的性质。Fisher 信息与 CRLB 进一步给出无偏估计的方差下界，为后面比较 MLE、LS、MMSE 提供统一标尺。

## 一、估计量与估计误差

> [!info] 定义 估计量
> 设观测 $\mathbf{x}=(x_1,\dots,x_N)$ 的联合密度为 $f(\mathbf{x};\theta)$，其中 $\theta$ 是未知参数。任何不显含 $\theta$ 的统计量 $\hat{\theta}=g(\mathbf{x})$ 都称为 $\theta$ 的**估计量**；代入具体观测值后得到的数称为**估计值**。

估计误差定义为

$$\tilde{\theta}=\hat{\theta}-\theta$$

这里默认经典统计视角：$\theta$ 是未知常数，随机性完全来自观测 $\mathbf{x}$。在贝叶斯视角下 $\theta$ 本身是随机变量，误差的期望要对 $\theta$ 的先验再取一次，这一点在 [[vault-notes/random-signals/07-mmse-lmmse]] 中会反复用到。

## 二、偏差、方差与 MSE 分解

偏差衡量“平均而言偏了多少”，方差衡量“每次估计有多散”。

> [!info] 定义 偏差、方差与均方误差
> 偏差 $\mathrm{bias}(\hat{\theta})=E[\hat{\theta}]-\theta$，方差 $\mathrm{Var}(\hat{\theta})=E[(\hat{\theta}-E[\hat{\theta}])^2]$，均方误差 $\mathrm{MSE}(\hat{\theta})=E[(\hat{\theta}-\theta)^2]$。

把误差拆成“围绕均值的波动”和“均值到真值的偏移”两部分：

$$\mathrm{MSE}(\hat{\theta})=E\left[(\hat{\theta}-E[\hat{\theta}]+E[\hat{\theta}]-\theta)^2\right]=\mathrm{Var}(\hat{\theta})+\mathrm{bias}^2(\hat{\theta})$$

交叉项为零，因为 $E[\hat{\theta}-E\hat{\theta}]=0$。这条分解是全节的核心：**方差小不等于误差小，偏差大同样会推高 MSE**。

> [!tip] 直觉
> 打靶时，方差是弹着点的分散程度，偏差是瞄准镜的零点偏移。弹着点再集中，若整体偏在靶心外，成绩仍然不好。工程上宁愿要一个方差略大但偏差很小的估计量，也不愿要一个方差极小却系统性偏掉的估计量。

## 三、无偏、有效与一致

| 性质 | 定义 | 怎么检验 | 说明 |
| --- | --- | --- | --- |
| 无偏 | $\mathrm{bias}(\hat{\theta})=0$ 对所有 $\theta$ 成立 | 求 $E[\hat{\theta}]$ | 平均等于真值，单次仍可能偏离 |
| 渐近无偏 | $\lim_{N\to\infty}\mathrm{bias}(\hat{\theta})=0$ | 求极限 | 样本量大时才“平均对” |
| 有效 | 无偏且方差达到 CRLB | 与 $1/I(\theta)$ 比较 | 达到下界的无偏估计 |
| 一致 | $\hat{\theta}\xrightarrow{P}\theta$ | 依概率收敛 | 样本越多越接近真值 |

一致性的一个常用充分条件是 $\mathrm{MSE}(\hat{\theta})\to0$：偏差和方差都趋于零时，由马尔可夫不等式可得依概率收敛。反之不成立，一致估计可以没有有限方差。

还需要区分 **MVUE** 与有效估计：MVUE 只要求在所有无偏估计中方差最小，不要求达到 CRLB；若 CRLB 可达，则 MVUE 就是有效估计。

> [!warning] 三个概念不能互相替代
> 无偏不蕴含一致：只用第一个样本 $x_1$ 估计均值，它是无偏的，但方差恒为 $\sigma^2$，不会随 $N$ 减小。一致也不蕴含无偏：$\hat{\sigma}^2=\frac{1}{N}\sum(x_n-\bar{x})^2$ 有偏，却是一致估计。有效更严格：它要求无偏估计的方差达到 CRLB，因此有效估计一定是 MVUE，反之不一定。

## 四、Fisher 信息与 CRLB

> [!info] 定义 Fisher 信息
> 对正则分布族 $f(\mathbf{x};\theta)$，记对数似然 $\ell(\theta)=\ln f(\mathbf{x};\theta)$，Fisher 信息定义为 $I(\theta)=E[(\partial\ell/\partial\theta)^2]=-E[\partial^2\ell/\partial\theta^2]$。

Fisher 信息度量数据对参数变化的敏感程度：似然函数在真值附近越陡，一个观测能提供的关于 $\theta$ 的信息越多。对 $N$ 个独立同分布样本，$I_N(\theta)=N I_1(\theta)$，信息随样本数线性累加。

> [!info] 定义 Cramér-Rao 下界
> 在正则条件下，任何无偏估计量满足 $\mathrm{Var}(\hat{\theta})\ge 1/I(\theta)$；等号成立时称 $\hat{\theta}$ 为**有效估计量**。

对有偏估计，方差下界换成

$$\mathrm{Var}(\hat{\theta})\ge\frac{(1+b'(\theta))^2}{I(\theta)},\qquad b(\theta)=E[\hat{\theta}]-\theta$$

> [!warning] CRLB 的使用边界
> CRLB 只对满足正则条件的分布族成立：支撑集不能依赖 $\theta$，对数似然要对 $\theta$ 二阶可导。均匀分布 $U(0,\theta)$ 的支撑集随 $\theta$ 移动，属于非正则情形，此时不能拿形式上的 CRLB 做结论。

## 五、例子：高斯均值的估计

设 $x_n\sim\mathcal{N}(\mu,\sigma^2)$ 独立同分布，$\sigma^2$ 已知，估计 $\mu$。对数似然为

$$\ell(\mu)=-\frac{N}{2}\ln(2\pi\sigma^2)-\frac{1}{2\sigma^2}\sum_{n=1}^N(x_n-\mu)^2$$

得分函数与 Fisher 信息分别为

$$\frac{\partial\ell}{\partial\mu}=\frac{1}{\sigma^2}\sum_{n=1}^N(x_n-\mu),\qquad I(\mu)=\frac{N}{\sigma^2}$$

样本均值 $\hat{\mu}=\bar{x}$ 无偏，方差为 $\sigma^2/N$，恰好等于 $1/I(\mu)$，因此它是有效估计，也是 MVUE。

> [!example] 有偏但 MSE 更小的收缩估计
> 考虑 $\hat{\mu}_c=c\bar{x}$，偏差为 $(c-1)\mu$，方差为 $c^2\sigma^2/N$。于是 $\mathrm{MSE}(\hat{\mu}_c)=c^2\sigma^2/N+(c-1)^2\mu^2$，最优收缩系数为 $c^\ast=\mu^2/(\mu^2+\sigma^2/N)$。取 $\mu=1$、$\sigma=1$、$N=4$，得 $c^\ast=0.8$，MSE 从 $0.25$ 降到 $0.20$。

这个例子说明：无偏是评价维度之一，不是唯一目标。当先验知识可靠或信噪比很低时，有偏的收缩估计、正则化估计往往比无偏估计的 MSE 更小。

## 关联

- 上一节：[[vault-notes/random-signals/06-filtering-noise-power]]（06 模块末篇）
- 下一节：[[vault-notes/random-signals/07-maximum-likelihood-least-squares]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/08-parameter-estimation]]、[[vault-notes/math/probability/05-numerical-characteristics]]、[[vault-notes/math/probability/06-law-of-large-numbers-clt]]
