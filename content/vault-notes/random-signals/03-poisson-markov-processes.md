---
title: "泊松过程与马尔可夫过程"
tags:
- 随机信号处理
- 03-随机过程基础
- 泊松过程
- 马尔可夫过程
type: concept
subjects:
- 随机信号处理
- 随机过程
domains:
- 随机信号
- 统计信号处理
status: learning
aliases: []
prerequisites: []
related: []
---

# 泊松过程与马尔可夫过程

> [!abstract] 这一节在讲什么
> 通信中的“到达”与“状态跳变”需要另一类随机过程：前者数的是事件发生了多少次，后者描述系统在状态之间如何转移。本节给出泊松过程的计数定义、指数到达间隔与叠加/稀疏性质，以及马尔可夫性、C-K 方程和生灭过程。
> 核心用途是把呼叫到达、分组到达、HARQ 进程与信道状态建模成可计算的随机模型，并用排队论把到达率、服务率与延迟、队长联系起来。

## 一、泊松过程：计数与到达

> [!info] 定义 1 齐次泊松过程
> 计数过程 $\lbrace N(t),t\ge0\rbrace$ 若满足
> 1. $N(0)=0$，且增量独立；
> 2. 增量平稳：$N(t+h)-N(t)$ 的分布只与 $h$ 有关；
> 3. 在短时间 $h$ 内最多到达一个事件：
> $$
> P\big(N(t+h)-N(t)=1\big)=\lambda h+o(h),\qquad P\big(\ge2\big)=o(h)
> $$
>
> 则称为强度为 $\lambda$ 的**泊松过程**。

由定义可推出计数分布

$$
P\big(N(t)=k\big)=\frac{(\lambda t)^k}{k!}e^{-\lambda t},\qquad k=0,1,2,\dots
$$

因此 $E[N(t)]=\lambda t$，$\mathrm{Var}[N(t)]=\lambda t$；自协方差为 $C_N(s,t)=\lambda\min(s,t)$，$R_N(s,t)=\lambda\min(s,t)+\lambda^2st$。

> [!warning] 泊松过程本身不是 WSS
> $N(t)$ 的均值 $\lambda t$ 随 $t$ 增长，方差也增长，所以 $N(t)$ 不是宽平稳过程。具有平稳性的是它的**增量** $N(t+h)-N(t)$。分析时不要把“增量平稳”误写成“过程平稳”。

## 二、到达间隔与等待时间

> [!info] 定义 2 到达间隔
> 令 $T_k$ 为第 $k-1$ 个与第 $k$ 个事件之间的时间间隔，则 $T_k$ 独立同分布，且
> $$
> f_T(t)=\lambda e^{-\lambda t},\quad t\ge0;\qquad E[T]=\frac{1}{\lambda},\quad \mathrm{Var}(T)=\frac{1}{\lambda^2}
> $$

指数分布具有**无记忆性**：$P(T>s+t\mid T>s)=P(T>t)=e^{-\lambda t}$。这意味着“已经等了多久”不影响还要等多久，是泊松过程“完全随机到达”的数学体现。

第 $n$ 个到达时刻 $S_n=T_1+\cdots+T_n$ 服从伽马分布：

$$
f_{S_n}(t)=\frac{\lambda(\lambda t)^{n-1}}{(n-1)!}e^{-\lambda t},\qquad E[S_n]=\frac{n}{\lambda}
$$

| 性质 | 结论 | 工程含义 |
| --- | --- | --- |
| 叠加 | 独立泊松流强度相加 | 多用户业务汇聚后仍近似泊松 |
| 稀疏 | 每个事件以概率 $p$ 保留，强度为 $\lambda p$ | 抽样、分类、丢包建模 |
| 无记忆 | 剩余等待时间仍服从指数分布 | 排队分析可用马尔可夫链 |
| 离散对应 | 伯努利过程，间隔服从几何分布 | 时隙化系统 |

> [!example] 数值例子
> 设分组到达率 $\lambda=100$ 个/秒。平均到达间隔为 $10\ \mathrm{ms}$；间隔超过 $30\ \mathrm{ms}$ 的概率为 $e^{-3}\approx0.0498$；在 $10\ \mathrm{ms}$ 内恰好到达 $2$ 个分组的概率为 $e^{-1}/2!\approx0.184$。

## 三、马尔可夫性与 C-K 方程

> [!info] 定义 3 马尔可夫性
> 若对任意 $n$ 与状态 $i_0,\dots,i_{n-1},i,j$，
> $$
> P\big(X_{n+1}=j\mid X_n=i,X_{n-1}=i_{n-1},\dots,X_0=i_0\big)=P\big(X_{n+1}=j\mid X_n=i\big)=p_{ij}
> $$
> 则称 $\lbrace X_n\rbrace$ 为**马尔可夫链**。$p_{ij}$ 组成转移矩阵 $\mathbf{P}$，每行之和为 $1$。

“已知现在，未来与过去条件独立”是马尔可夫性的本质。$n$ 步转移概率矩阵为 $\mathbf{P}^{n}$，其分量满足 **Chapman–Kolmogorov 方程**：

$$
p_{ij}^{(m+n)}=\sum_{k}p_{ik}^{(m)}p_{kj}^{(n)}
$$

写成矩阵就是 $\mathbf{P}^{(m+n)}=\mathbf{P}^{m}\mathbf{P}^{n}$。若存在分布 $\boldsymbol{\pi}$ 满足

$$
\boldsymbol{\pi}=\boldsymbol{\pi}\mathbf{P},\qquad \sum_i\pi_i=1
$$

则 $\boldsymbol{\pi}$ 为平稳分布；不可约、非周期、正常返的有限链必收敛到 $\boldsymbol{\pi}$。连续时间马尔可夫链用转移速率矩阵 $\mathbf{Q}$ 描述，满足 $\mathbf{P}(t)=e^{\mathbf{Q}t}$ 与 $\boldsymbol{\pi}\mathbf{Q}=\mathbf{0}$，对角元 $q_{ii}=-\sum_{j\ne i}q_{ij}$。

## 四、生灭过程、排队与分组到达

> [!info] 定义 4 生灭过程
> 状态 $n$ 只能转移到 $n+1$（出生率 $\lambda_n$）或 $n-1$（死亡率 $\mu_n$）的连续时间马尔可夫链。若 $\lambda_n=\lambda$、$\mu_n=\mu$，就是最简单的 $M/M/1$ 排队模型。

对 $M/M/1$，到达率 $\lambda$、服务率 $\mu$，利用率 $\rho=\lambda/\mu$。当 $\rho<1$ 时系统稳定：

$$
P(N=n)=(1-\rho)\rho^n,\qquad L=\frac{\rho}{1-\rho},\qquad W=\frac{1}{\mu-\lambda},\qquad L=\lambda W
$$

其中 $L$ 为平均队长，$W$ 为平均逗留时间，最后一式是 Little 定律。

| 应用 | 随机模型 | 关键量 |
| --- | --- | --- |
| 呼叫到达 | 泊松过程 | 到达率 $\lambda$、阻塞率 |
| 分组到达 | 泊松/伯努利过程 | 到达间隔、突发度 |
| 队列与缓冲 | $M/M/1$、$M/M/c$ | 队长分布、等待时间 |
| HARQ 进程 | 离散马尔可夫链 | 重传次数、吞吐率 |
| 无线信道状态 | Gilbert–Elliott 两状态链 | 好/坏信道驻留时间 |

> [!warning] 泊松假设的边界
> 真实数据业务在短时间尺度上具有突发性，到达间隔往往不是指数分布，直接用 $M/M/1$ 会低估尾延迟。此时应使用 MMPP、批量到达或重尾分布模型；但大量独立业务汇聚后，聚合流仍常可近似为泊松。

## 五、与随机信号处理的接口

泊松过程不只用于“数个数”。把每个到达时刻 $S_k$ 激励一个波形 $h(t-S_k)$，得到

$$
X(t)=\sum_{k}h(t-S_k)
$$

称为**过滤泊松过程**（散粒噪声模型）。它的均值与功率谱可由 Campbell 定理计算，是光通信雪崩噪声、脉冲干扰和神经脉冲序列的常用模型。马尔可夫链则把“随机信号”从独立样本推广到有记忆的样本，为隐马尔可夫模型、卡尔曼滤波的离散状态版本和马尔可夫信道仿真提供基础。

## 关联

- 上一节：[[vault-notes/random-signals/03-gaussian-process-white-noise]]
- 下一节：[[vault-notes/random-signals/03-cyclostationary-processes]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/04-channel]]、[[vault-notes/5g/harq]]、[[vault-notes/5g/phy/04-physical-channels-signals]]
