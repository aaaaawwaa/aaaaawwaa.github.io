---
title: "严平稳与宽平稳"
tags:
- 随机信号处理
- 03-随机过程基础
- 平稳性
- 宽平稳
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

# 严平稳与宽平稳

> [!abstract] 这一节在讲什么
> 随机过程的统计特性一般随绝对时间变化，直接分析非常困难。平稳性假设“统计规律不随时间的起点改变”，从而把二元函数 $R_X(t_1,t_2)$ 降为一元函数 $R_X(\tau)$。
> 本节区分两种强度不同的平稳：严平稳约束所有有限维分布，宽平稳只约束均值与自相关。核心结论是严平稳加有限二阶矩可推出宽平稳，反之一般不成立，而高斯过程是两者等价的例外。

## 一、严平稳：分布不随起点改变

> [!info] 定义 1 严平稳
> 若对任意 $n$、任意时刻 $t_1,\dots,t_n$ 与任意时间平移 $\tau$，都有
> $$
> F_X(x_1,\dots,x_n;t_1,\dots,t_n)=F_X(x_1,\dots,x_n;t_1+\tau,\dots,t_n+\tau)
> $$
> 则称 $X(t)$ 为**严平稳**（strictly stationary）过程。

严平稳要求整个有限维分布族对时间平移不变，因此：

- 一维分布与 $t$ 无关，均值（若存在）为常数，方差（若存在）为常数；
- 二维分布只依赖时间差，自相关（若存在）满足 $R_X(t_1,t_2)=R_X(t_1-t_2)$；
- 任意阶矩（若存在）都对时间平移不变。

> [!warning] 严平稳不保证矩存在
> 若每个时刻的边际分布都是柯西分布，过程可以是严平稳的，但均值和方差都不存在，因而无法定义自相关，也就谈不上宽平稳。讨论平稳性时必须先声明二阶矩是否存在。

## 二、宽平稳：只约束一、二阶矩

> [!info] 定义 2 宽平稳
> 若随机过程满足
> 1. 二阶矩有限：$E\big[\lvert X(t)\rvert^2\big]<\infty$；
> 2. 均值函数为常数：$\mu_X(t)=\mu_X$；
> 3. 自相关只与时间差有关：
> $$
> R_X(t_1,t_2)=R_X(t_1-t_2)=E\big[X(t+\tau)X^*(t)\big]=R_X(\tau)
> $$
>
> 则称它为**宽平稳**（wide-sense stationary，WSS）过程，也称广义平稳过程。

宽平稳只要求前两阶矩具有平移不变性，不限制分布形状。工程上“平稳随机信号”通常默认指宽平稳；数学文献中不加限定的“平稳”多指严平稳，阅读时要看上下文。

## 三、宽平稳过程的性质

| 性质 | 表达式 | 说明 |
| --- | --- | --- |
| 均值恒定 | $\mu_X(t)=\mu_X$ | 不随观测时刻漂移 |
| 方差恒定 | $\sigma_X^2=C_X(0)=R_X(0)-\lvert\mu_X\rvert^2$ | 起伏功率不随时间变化 |
| 功率恒定 | $R_X(0)=E[\lvert X(t)\rvert^2]$ | 平均功率，非负实数 |
| 共轭对称 | $R_X(-\tau)=R_X^*(\tau)$ | 实过程为偶函数 |
| 峰值在原点 | $\lvert R_X(\tau)\rvert\le R_X(0)$ | 柯西–施瓦茨不等式 |
| 协方差平移 | $C_X(\tau)=R_X(\tau)-\lvert\mu_X\rvert^2$ | 去均值后的相关 |
| 归一化相关 | $\rho_X(\tau)=C_X(\tau)/C_X(0)$ | $\rho_X(0)=1$，$\lvert\rho_X\rvert\le1$ |

若进一步假设 $R_X(\tau)$ 绝对可积，则功率谱密度 $S_X(\omega)$ 存在且非负，这将在频域分析中由维纳–辛钦定理给出。宽平稳只保证二阶统计不随时间平移变化，并不保证每条样本函数“看起来平稳”。

> [!tip] 检验 WSS 的三步
> 先确认二阶矩有限，再检查均值是否为常数，最后检查 $R_X(t_1,t_2)$ 是否只依赖 $t_1-t_2$。三步中任何一步失败，都不能使用 $R_X(\tau)$ 与 $S_X(\omega)$ 这套工具。

## 四、严平稳与宽平稳的关系

> [!info] 定义 3 两者关系
> - 严平稳且二阶矩有限 $\Longrightarrow$ 宽平稳；
> - 宽平稳 $\nRightarrow$ 严平稳；
> - 对**高斯过程**，宽平稳与严平稳等价（只要二阶矩有限）。

| 对比项 | 严平稳 | 宽平稳 |
| --- | --- | --- |
| 约束对象 | 全部有限维分布 | 均值与自相关 |
| 是否要求二阶矩 | 不要求 | 要求 |
| 检验难度 | 几乎无法完整检验 | 可用样本均值与相关函数检验 |
| 推出关系 | 加有限二阶矩推出 WSS | 一般推不出严平稳 |
| 高斯过程 | 与 WSS 等价 | 与严平稳等价 |

> [!example] 宽平稳但非严平稳
> 设 $X(t)=A\cos\omega_0t+B\sin\omega_0t$，$A,B$ 零均值、不相关、方差均为 $1$；取 $A$ 以等概率取 $\pm1$，$B$ 服从方差为 $1$ 的拉普拉斯分布。则
> $$
> \mu_X(t)=0,\qquad R_X(t,t+\tau)=\cos\omega_0\tau
> $$
> 过程是 WSS 的；但 $t=0$ 时 $X(0)=A$ 只取 $\pm1$，$t=\pi/(2\omega_0)$ 时 $X(t)=B$ 服从拉普拉斯分布，一维分布随 $t$ 改变，故不严平稳。

> [!example] 严平稳且宽平稳
> 随机相位正弦 $X(t)=A\cos(\omega_0t+\Theta)$，$\Theta\sim U[0,2\pi)$：时间平移等价于相位平移，而均匀分布在相位平移下不变，所以严平稳；同时 $\mu_X=0$、$R_X(\tau)=\frac{A^2}{2}\cos\omega_0\tau$，也是 WSS。白高斯噪声、独立同分布序列同样两者兼有。

## 五、失效的情形与循环平稳

随机游走的方差随 $n$ 增长，$R_X(m,n)=\sigma^2\min(m,n)$ 依赖绝对时刻，不是 WSS。频率偏移、定时抖动和突发干扰都会破坏平稳性。

还有一类过程，均值是常数但自相关随时间**周期变化**，例如 $X(t)=A(t)\cos(\omega_c t+\Theta)$。它不满足 WSS，却具有可预测的周期结构，称为**循环平稳过程**，将在 [[vault-notes/random-signals/03-cyclostationary-processes]] 中单独处理。

> [!warning] 不要把“局部看起来平稳”当成平稳
> 观测长度内趋势很慢时，样本看似平稳；一旦记录跨越均值或方差发生变化的区间，相关函数估计就会失真。工程上应先做去趋势与分段平稳性检验，再套用 WSS 结论。

## 关联

- 上一节：[[vault-notes/random-signals/03-mean-and-correlation-functions]]
- 下一节：[[vault-notes/random-signals/03-ergodicity]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/math/probability/05-numerical-characteristics]]、[[vault-notes/communication/04-channel]]
