---
title: "Neyman-Pearson准则"
tags:
- 随机信号处理
- 08-信号检测理论
- 奈曼-皮尔逊
- 最优检验
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

# Neyman-Pearson准则

> [!abstract] 这一节在讲什么
> 很多工程系统不能给先验概率和错误代价，却必须把虚警率压在一个硬指标以下，例如雷达的 $P_{fa}\le10^{-6}$。Neyman-Pearson（NP）准则正是为这种场景设计的：在 $P_{fa}$ 不超过给定值的约束下，最大化检测概率 $P_d$。本节用拉格朗日乘子推出“似然比 + 门限”的判决结构，并说明门限如何由 $\alpha$ 唯一确定。

## 一、准则的表述

> [!info] 定义 Neyman-Pearson 准则
> 给定虚警概率上限 $\alpha\in(0,1)$，在所有满足 $P_{fa}\le\alpha$ 的检验中，选择使 $P_d$ 最大的检验。这样的检验称为在水平 $\alpha$ 下的**最大功效检验**（most powerful test）。

由于 $P_d=1-P_m$，最大化 $P_d$ 等价于最小化漏检概率 $P_m$。准则不引入先验 $\pi_0,\pi_1$，也不引入代价 $C_{ij}$，只把 $P_{fa}$ 当作硬约束。这与 Bayes 准则的“软权衡”形成鲜明对比。

> [!tip] 为什么工程界偏爱 NP
> 虚警往往意味着误报警、误触发、占用信道或浪费发射功率，系统对它有一个明确的容忍上限；而先验概率和漏检代价很难准确给出。把 $P_{fa}$ 固定为设计指标，再把 $P_d$ 做到最大，是一种可复现、可验收的工程语言。

## 二、拉格朗日乘子推导

把约束优化写成

$$
\max_{\mathcal{R}_1}P_d\quad\text{s.t.}\quad P_{fa}\le\alpha
$$

引入乘子 $\lambda\ge0$，构造

$$
J=P_m+\lambda(P_{fa}-\alpha)
$$

把 $P_m=1-\int_{\mathcal{R}_1}f_1$ 与 $P_{fa}=\int_{\mathcal{R}_1}f_0$ 代入，并利用 $\int_{\mathcal{R}_0}f_1=1-\int_{\mathcal{R}_1}f_1$，得

$$
J=\lambda(1-\alpha)+\int_{\mathcal{R}_0}\left(f_1-\lambda f_0\right)d\mathbf{x}
$$

要让 $J$ 最小，应把被积函数为负的点全部放进 $\mathcal{R}_0$，即

$$
\mathcal{R}_0=\{\mathbf{x}:f_1(\mathbf{x})<\lambda f_0(\mathbf{x})\}\quad\Longleftrightarrow\quad\Lambda(\mathbf{x})<\lambda
$$

于是最优检验仍是似然比检验：

$$
\Lambda(\mathbf{x})\underset{H_0}{\overset{H_1}{\gtrless}}\lambda
$$

乘子 $\lambda$ 就是门限，由约束取等号确定：$P_{fa}(\lambda)=\alpha$。

> [!info] 定义 NP 门限
> 若 $P_{fa}(\lambda)$ 连续且严格单调递减，则存在唯一的 $\lambda$ 使 $P_{fa}(\lambda)=\alpha$。该 $\lambda$ 就是 NP 门限；若 $\Lambda$ 为离散分布，需要在 $\Lambda=\lambda$ 处做随机化才能精确达到 $\alpha$。

## 三、门限选择

门限选择分三步：写出 $P_{fa}$ 关于 $\lambda$ 的表达式；令其等于 $\alpha$；解出 $\lambda$。对高斯型统计量，这一步可以写成 $Q$ 函数的反函数。

> [!example] 高斯均值检测的 NP 门限
> $H_0:x\sim\mathcal{N}(0,\sigma^2)$，$H_1:x\sim\mathcal{N}(\mu,\sigma^2)$。判决为 $x>\gamma$，且 $P_{fa}=Q(\gamma/\sigma)$。给定 $\alpha$，门限为
>
> $$
> \gamma=\sigma Q^{-1}(\alpha)
> $$
>
> 检测概率为
>
> $$
> P_d=Q\left(Q^{-1}(\alpha)-\frac{\mu}{\sigma}\right)
> $$
>
> 取 $\mu/\sigma=2$、$\alpha=10^{-3}$，则 $Q^{-1}(\alpha)=3.090$，$P_d=Q(1.090)\approx0.138$。若把 $\alpha$ 放宽到 $10^{-2}$，门限降到 $2.326\sigma$，$P_d$ 升到 $Q(0.326)\approx0.372$。

| $\alpha$ | $Q^{-1}(\alpha)$ | $P_d$（$d=2$） | $P_d$（$d=3$） |
| --- | --- | --- | --- |
| $10^{-2}$ | 2.326 | 0.372 | 0.750 |
| $10^{-3}$ | 3.090 | 0.138 | 0.464 |
| $10^{-4}$ | 3.719 | 0.043 | 0.236 |

这张表说明：同样的 $\alpha$ 下，偏移 $d=\mu/\sigma$ 越大，$P_d$ 越高；同样的 $d$ 下，$\alpha$ 越小，门限越高，$P_d$ 越低。二者正是 [[vault-notes/random-signals/08-roc-curve]] 上的同一条曲线。

## 四、与 Bayes 准则的区别

| 维度 | Bayes 准则 | Neyman-Pearson 准则 |
| --- | --- | --- |
| 需要的先验 | $\pi_0,\pi_1$ | 不需要 |
| 需要的代价 | $C_{ij}$ | 不需要 |
| 约束 | 无 | $P_{fa}\le\alpha$ |
| 门限来源 | $\eta=\pi_0(C_{10}-C_{00})/[\pi_1(C_{01}-C_{11})]$ | 解 $P_{fa}(\lambda)=\alpha$ |
| 优化目标 | 平均风险最小 | 固定虚警下 $P_d$ 最大 |
| 结果位置 | ROC 上由斜率确定的一点 | ROC 与竖线 $P_{fa}=\alpha$ 的交点 |

Bayes 准则把先验和代价折成一个门限，NP 准则把虚警约束折成一个门限；两者最终都落到似然比检验，只是门限的来源不同。若先验与代价恰好使 Bayes 门限等于 NP 门限，两种准则给出同一个检验。

> [!warning] NP 准则的适用边界
> NP 引理严格成立的前提是“简单假设对简单假设”。若 $H_1$ 含未知参数（未知幅度、相位、到达时间），一般不存在对所有参数值都最大功效的一致检验（UMP）。此时可退而求其次：对每个参数值画 ROC，或使用广义似然比、Bayes 平均。另一个常见误解是把 NP 当成对所有备择都一致最优；它只保证当前简单备择下的最大功效。

## 五、工程中的工作点

雷达通常先定 $P_{fa}=10^{-6}$ 或更低，再报告对应 $P_d$ 与所需 SNR；通信系统则常先定目标误码率，再反推所需的 $E_b/N_0$。两种说法可以互相换算，但都必须声明“在什么虚警率/什么信道下”。

> [!example] 雷达与通信的两种问法
> 雷达问：“虚警率 $10^{-6}$ 时，检测概率能否达到 0.9？”这直接是 NP 语言。通信问：“误比特率 $10^{-5}$ 时需要多少 $E_b/N_0$？”这等价于在对称二元假设下固定一个工作点。二者都在 ROC 上选点，只是坐标命名不同。

## 关联

- 上一节：[[vault-notes/random-signals/08-likelihood-ratio-test]]
- 下一节：[[vault-notes/random-signals/08-roc-curve]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/09-hypothesis-testing]]、[[vault-notes/communication/04-channel]]、[[vault-notes/5g/phy/04-physical-channels-signals]]
