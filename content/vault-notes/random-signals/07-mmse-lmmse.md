---
title: "MMSE与LMMSE"
tags:
- 随机信号处理
- 07-统计估计与最优滤波
- 贝叶斯估计
- 线性估计
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

# MMSE与LMMSE

> [!abstract] 这一节在讲什么
> 经典估计把 $\theta$ 当作未知常数，只利用观测的似然；贝叶斯估计把 $\theta$ 当作随机变量，把先验知识也纳入进来。最小均方误差（MMSE）估计就是后验均值，而线性最小均方误差（LMMSE）估计把它限制为观测的仿射函数，只需均值与协方差。本节给出正交性原理、LMMSE 闭式公式，并说明高斯情形下两者为什么重合。

## 一、贝叶斯视角与 MMSE 估计

> [!info] 定义 MMSE 估计
> 在贝叶斯框架下，$\theta$ 具有先验密度 $f(\theta)$，观测 $\mathbf{x}$ 的条件密度为 $f(\mathbf{x}\mid\theta)$。使 $\mathrm{MSE}=E[(\hat{\theta}-\theta)^2]$ 最小的估计量为
>
> $$\hat{\theta}_{MMSE}(\mathbf{x})=E[\theta\mid\mathbf{x}]$$

后验均值是 $\mathbf{x}$ 的函数，因此 MMSE 估计是一个随机变量。把 MSE 对 $\hat{\theta}$ 求导并令其为零，可以得到同样的结论：

$$\frac{\partial}{\partial\hat{\theta}}E\left[(\hat{\theta}-\theta)^2\mid\mathbf{x}\right]=2\left(\hat{\theta}-E[\theta\mid\mathbf{x}]\right)=0$$

对应的最小 MSE 为后验方差的期望：

$$\mathrm{MSE}_{MMSE}=E\left[\mathrm{Var}(\theta\mid\mathbf{x})\right]$$

> [!tip] 直觉
> MMSE 估计是“看完数据后对参数的最佳猜测”，先验把猜测往合理范围拉，观测把猜测往数据拉。若观测噪声极大，后验几乎等于先验，估计就退化为先验均值；若观测极准，后验集中在似然峰值附近。

> [!warning] MMSE 通常是有偏的
> 偏差要对 $\theta$ 与 $\mathbf{x}$ 的联合分布取期望。即使条件均值在每条观测下都“居中”，平均到 $\theta$ 上仍可能系统性偏离，尤其是先验均值不等于真值时。不要把“最小 MSE”与“无偏”混为一谈。

## 二、正交性原理

> [!info] 定义 正交性原理
> 若 $\hat{\theta}$ 是 $\theta$ 在观测张成的线性空间上的投影，则估计误差与观测正交：$E[(\theta-\hat{\theta})\mathbf{x}^T]=\mathbf{0}$，且 $E[\theta-\hat{\theta}]=0$。反之，满足该正交条件的线性估计就是 LMMSE 估计。

这条原理把估计问题变成几何投影问题：把 $\theta$ 投影到由 $1,x_1,\dots,x_N$ 张成的子空间，投影系数就是滤波器系数。它与 [[vault-notes/math/linear-algebra/04-orthogonality]] 中“误差向量垂直于子空间”的结论完全一致，也是 [[vault-notes/random-signals/07-wiener-filter]] 中 Wiener-Hopf 方程的来源。

正交性还给出 MSE 的几何解释：残差平方的期望等于 $\theta$ 的范数平方减去投影的范数平方，所以投影只会减小误差，不会增大误差。

## 三、LMMSE 公式

限制估计量为仿射函数 $\hat{\theta}=\mathbf{a}^T\mathbf{x}+b$，由正交性可解出

$$\hat{\theta}_{LMMSE}=\mu_\theta+\mathbf{C}_{\theta x}\mathbf{C}_{xx}^{-1}\left(\mathbf{x}-\mu_x\right)$$

其中 $\mathbf{C}_{\theta x}=E[(\theta-\mu_\theta)(\mathbf{x}-\mu_x)^T]$，$\mathbf{C}_{xx}$ 是观测协方差矩阵。对应的最小 MSE 为

$$\mathrm{MSE}_{LMMSE}=\mathbf{C}_{\theta\theta}-\mathbf{C}_{\theta x}\mathbf{C}_{xx}^{-1}\mathbf{C}_{x\theta}$$

标量情形更直观：

$$\hat{\theta}_{LMMSE}=\mu_\theta+\rho\frac{\sigma_\theta}{\sigma_x}(x-\mu_x),\qquad \mathrm{MSE}_{LMMSE}=\sigma_\theta^2(1-\rho^2)$$

其中 $\rho$ 是 $\theta$ 与 $x$ 的相关系数。$|\rho|$ 越接近 1，线性估计越准；$\rho=0$ 时 LMMSE 直接退回先验均值，MSE 等于先验方差。

> [!warning] 公式使用的三个前提
> 第一，$\mathbf{C}_{xx}$ 必须可逆，观测高度相关时要改用伪逆或正则化；第二，公式只保证在仿射函数类中最优，数据存在强非线性关系时可能远不如 MMSE；第三，均值与协方差必须已知，实际中常用样本估计替代，会引入额外误差。

## 四、与 MVUE、最佳线性估计的区别

| 估计器 | 允许的函数类 | 需要的信息 | 是否无偏 | 最优范围 |
| --- | --- | --- | --- | --- |
| MMSE | 任意可测函数 | 完整后验分布 | 通常有偏 | 全局 MSE 最小 |
| LMMSE | 仿射函数 | 均值、协方差 | 通常有偏 | 仿射类内 MSE 最小 |
| MVUE | 任意函数，但须无偏 | 完整似然 | 无偏 | 无偏类内方差最小 |
| BLUE | 仿射函数，且无偏 | 均值、协方差 | 无偏 | 线性无偏类内方差最小 |

MVUE 的“无偏”约束很强，有时不存在；LMMSE 放弃无偏换取更小的 MSE，在低信噪比或先验可靠时优势明显。BLUE 则是“线性 + 无偏”的折中，高斯-马尔可夫定理保证它在只知一、二阶矩时仍是最优线性无偏估计。

## 五、高斯情形：MMSE 等于 LMMSE

若 $\theta$ 与 $\mathbf{x}$ 联合高斯，则条件分布仍是高斯，条件均值是 $\mathbf{x}$ 的仿射函数：

$$E[\theta\mid\mathbf{x}]=\mu_\theta+\mathbf{C}_{\theta x}\mathbf{C}_{xx}^{-1}(\mathbf{x}-\mu_x)$$

右边正是 LMMSE 公式，因此

$$\hat{\theta}_{MMSE}=\hat{\theta}_{LMMSE}$$

这不是巧合：高斯分布由一、二阶矩完全确定，任何依赖高阶矩的非线性估计都无法再降低 MSE。对非高斯分布，条件均值一般是非线性的，LMMSE 只是它的一阶近似。

> [!example] 标量高斯模型
> 设 $x=\theta+w$，$\theta\sim\mathcal{N}(0,\sigma_\theta^2)$，$w\sim\mathcal{N}(0,\sigma_w^2)$，两者独立。则
>
> $$\hat{\theta}_{LMMSE}=\frac{\sigma_\theta^2}{\sigma_\theta^2+\sigma_w^2}x,\qquad \mathrm{MSE}_{LMMSE}=\frac{\sigma_\theta^2\sigma_w^2}{\sigma_\theta^2+\sigma_w^2}$$
>
> 取 $\sigma_\theta^2=1$、$\sigma_w^2=3$，增益为 $1/4$，MSE 为 $3/4$。信噪比趋于零时增益趋于零，估计退回先验均值；信噪比很高时增益趋于 1，估计近似等于观测。

> [!example] 与 MVUE 对照
> 若把 $\theta$ 看作未知常数，$x=\theta+w$ 的 MVUE 是 $\hat{\theta}=x$，方差为 $\sigma_w^2$。LMMSE 的 MSE 为 $\sigma_\theta^2\sigma_w^2/(\sigma_\theta^2+\sigma_w^2)$，恒小于 $\sigma_w^2$，代价是引入了偏差。先验方差越大，LMMSE 越接近 MVUE；先验方差趋于无穷时两者重合。

## 关联

- 上一节：[[vault-notes/random-signals/07-maximum-likelihood-least-squares]]
- 下一节：[[vault-notes/random-signals/07-wiener-filter]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/08-parameter-estimation]]、[[vault-notes/math/probability/05-numerical-characteristics]]、[[vault-notes/math/linear-algebra/04-orthogonality]]
