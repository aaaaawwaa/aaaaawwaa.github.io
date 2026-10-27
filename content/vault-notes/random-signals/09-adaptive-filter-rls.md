---
title: "自适应滤波RLS"
tags:
- 随机信号处理
- 09-进阶统计信号处理
- 自适应滤波
- RLS
type: concept
subjects:
- 随机信号处理
- 自适应滤波
domains:
- 自适应信号处理
status: learning
aliases: []
prerequisites: []
related: []
---

# 自适应滤波：RLS

> [!abstract] 这一节在讲什么
> LMS 用瞬时梯度近似，收敛速度被输入自相关矩阵的特征值散布拖慢；RLS 换一条路，直接最小化指数加权的平方误差。
> 核心结论：借助矩阵求逆引理递推 $\mathbf P=\mathbf\Phi^{-1}$，每样本 $O(N^2)$ 就能得到精确的最小二乘解，收敛约需 $2N$ 个样本。
> 用途：快速跟踪、短数据、强相关输入；代价是运算量与数值稳定性要求都比 LMS 高。

## 一、指数加权代价函数

> [!info] 定义
> **RLS**（recursive least squares）在每个时刻 $n$ 最小化带遗忘因子的平方误差，其中 $0<\lambda\le1$ 是遗忘因子，越近的数据权重越大。

$$
J[n]=\sum_{k=0}^{n}\lambda^{n-k}\lvert e[k]\rvert^2,\qquad e[k]=d[k]-\mathbf w^T[n]\mathbf x[k]
$$

令 $\mathbf\Phi[n]=\sum_{k=0}^{n}\lambda^{n-k}\mathbf x[k]\mathbf x^T[k]$、$\mathbf z[n]=\sum_{k=0}^{n}\lambda^{n-k}d[k]\mathbf x[k]$，对 $\mathbf w$ 求导置零得到正规方程

$$
\mathbf\Phi[n]\mathbf w[n]=\mathbf z[n]
$$

$\lambda=1$ 时是无限记忆的普通最小二乘，适合平稳环境；$\lambda<1$ 时等效窗长约 $1/(1-\lambda)$，可以跟踪慢变系统。

> [!tip] 直觉
> RLS 不是"走一步看一步"，而是每来一个样本就把整个加权最小二乘问题**精确重解**一次。它之所以能实时，是因为新解可以由旧解加一个秩一修正得到，而不是从头解方程。

## 二、递推公式与矩阵求逆引理

$\mathbf\Phi$ 与 $\mathbf z$ 的更新都是秩一的：

$$
\mathbf\Phi[n]=\lambda\mathbf\Phi[n-1]+\mathbf x[n]\mathbf x^T[n],\qquad
\mathbf z[n]=\lambda\mathbf z[n-1]+d[n]\mathbf x[n]
$$

若每次都求 $\mathbf\Phi^{-1}$，复杂度是 $O(N^3)$。矩阵求逆引理（Woodbury 恒等式）给出秩一修正的逆：

$$
(\mathbf A+\mathbf u\mathbf v^T)^{-1}
=\mathbf A^{-1}-\frac{\mathbf A^{-1}\mathbf u\mathbf v^T\mathbf A^{-1}}{1+\mathbf v^T\mathbf A^{-1}\mathbf u}
$$

取 $\mathbf A=\lambda\mathbf\Phi[n-1]$、$\mathbf u=\mathbf v=\mathbf x[n]$，就得到增益与协方差阵的递推：

$$
\mathbf k[n]=\frac{\mathbf P[n-1]\mathbf x[n]}{\lambda+\mathbf x^T[n]\mathbf P[n-1]\mathbf x[n]}
$$

$$
e[n]=d[n]-\mathbf w^T[n-1]\mathbf x[n],\qquad
\mathbf w[n]=\mathbf w[n-1]+\mathbf k[n]e[n]
$$

$$
\mathbf P[n]=\frac{1}{\lambda}\left(\mathbf P[n-1]-\mathbf k[n]\mathbf x^T[n]\mathbf P[n-1]\right)
$$

$\mathbf k[n]$ 常被称为**增益向量**，它的作用相当于"新样本应该把权向量拉动多少"。初始化通常取 $\mathbf w[0]=\mathbf 0$、$\mathbf P[0]=\delta^{-1}\mathbf I$，$\delta$ 取小正数（如 $0.01$），表示对初值几乎没有先验约束。

> [!warning] 复信号与数值细节
> 复信号要把转置换成共轭转置，$\mathbf k$ 与 $e$ 的共轭关系也要对齐。数值实现中 $\mathbf P$ 理论上对称正定，舍入误差会破坏对称性，工程上每步做 $\mathbf P\leftarrow(\mathbf P+\mathbf P^T)/2$，或直接用平方根 RLS/QR 分解。

## 三、遗忘因子、收敛与复杂度

遗忘因子决定"记多久"：$\lambda=0.98$ 对应约 50 个样本的等效窗，$\lambda=0.999$ 对应约 1000 个样本。$\lambda$ 越小跟踪越快，但稳态噪声（失调）越大；$\lambda$ 越接近 1，稳态越干净，却跟不上突变。

收敛速度方面，RLS 大约需要 $2N$ 个样本就能接近最优解，而且这个速度**基本不受特征值散布影响**，这正是它相对 LMS 的最大优势。代价是每样本 $O(N^2)$ 次乘法与 $O(N^2)$ 的存储。

> [!warning] 遗忘因子的两个陷阱
> 一是 $\lambda<1$ 且输入长期无激励时，$\mathbf P$ 会指数增长，一旦有激励就出现增益尖峰（wind-up）。二是有限精度下 $\mathbf P$ 可能失去正定性，导致发散；长时运行要用平方根形式或定期重置。

## 四、LMS 与 RLS 对比

| 项目 | LMS | RLS |
| --- | --- | --- |
| 每样本复杂度 | $O(N)$ | $O(N^2)$ |
| 收敛速度 | 受特征值散布影响，通常慢 | 约 $2N$ 样本，与特征值散布基本无关 |
| 稳态失调 | 与 $\mu\operatorname{tr}(\mathbf R)$ 成正比 | $\lambda=1$ 时趋于零；$\lambda<1$ 时由 $1-\lambda$ 决定 |
| 主要参数 | 步长 $\mu$ | 遗忘因子 $\lambda$、初始 $\mathbf P[0]$ |
| 数值稳健性 | 好，实现简单 | 较差，需平方根/QR 形式 |
| 适用场景 | 大规模、低功耗、缓变环境 | 快速跟踪、短数据、强相关输入 |

> [!example] 数值感受
> 取 $N=64$、输入特征值比 $100$，LMS 往往要数千个样本才收敛，RLS 约 128 个样本就到位；但 LMS 每样本约 128 次乘法，RLS 约 4096 次。选型时先问"收敛时间是否真的比算力更贵"。

一句话选择：**算力紧、通道慢变选 LMS；跟踪快、数据短、输入相关强选 RLS**。若两者都不满足，还可以考虑仿射投影（APA）这类介于两者之间的方法。

## 关联

- 上一节：[[vault-notes/random-signals/09-adaptive-filter-lms]]
- 下一节：[[vault-notes/random-signals/10-awgn-channel]]（10 首篇）
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/dsp/05-filter-structures]]、00_全库理论知识点综合与联系
