---
title: "卡尔曼滤波"
tags:
- 随机信号处理
- 07-统计估计与最优滤波
- 卡尔曼滤波
- 状态空间
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

# 卡尔曼滤波

> [!abstract] 这一节在讲什么
> 维纳滤波要求信号平稳、谱已知，而且要一次性处理整段数据；卡尔曼滤波把问题改写成状态空间模型，用“预测—更新”两步递推，在每个新观测到来时刷新估计。在线性高斯假设下，它是逐时刻的 MMSE 估计，协方差递推由 Riccati 方程控制。本节给出完整公式、标量例子，并说明它与维纳滤波的关系。

## 一、状态空间模型

> [!info] 定义 线性高斯状态空间模型
> 状态方程与观测方程分别为 $\mathbf{x}_k=\mathbf{F}\mathbf{x}_{k-1}+\mathbf{B}\mathbf{u}_{k-1}+\mathbf{w}_{k-1}$ 和 $\mathbf{z}_k=\mathbf{H}\mathbf{x}_k+\mathbf{v}_k$，其中 $\mathbf{w}_k\sim\mathcal{N}(\mathbf{0},\mathbf{Q})$ 是过程噪声，$\mathbf{v}_k\sim\mathcal{N}(\mathbf{0},\mathbf{R})$ 是观测噪声，两者相互独立且与初始状态独立。

$\mathbf{F}$ 描述状态如何自行演化，$\mathbf{B}\mathbf{u}$ 是已知控制输入，$\mathbf{H}$ 描述状态如何被观测到。初始状态 $\mathbf{x}_0\sim\mathcal{N}(\hat{\mathbf{x}}_0,\mathbf{P}_0)$。模型的三要素是：状态转移、观测映射、两个噪声协方差。

> [!tip] 为什么用状态空间
> 很多物理过程天然是“隐状态 + 含噪观测”：目标的位置与速度、锁相环的相位与频偏、电池的 SOC。状态空间把高阶动态化成一阶向量递推，既能处理多变量，也能处理非平稳过程。

## 二、预测与更新

卡尔曼滤波每一轮分两步。**预测**用状态方程把上一时刻的后验估计推到当前时刻：

$$
\hat{\mathbf{x}}_{k|k-1}=\mathbf{F}\hat{\mathbf{x}}_{k-1|k-1}+\mathbf{B}\mathbf{u}_{k-1}
$$

$$
\mathbf{P}_{k|k-1}=\mathbf{F}\mathbf{P}_{k-1|k-1}\mathbf{F}^T+\mathbf{Q}
$$

**更新**用当前观测修正预测。先算新息与新息协方差：

$$
\tilde{\mathbf{y}}_k=\mathbf{z}_k-\mathbf{H}\hat{\mathbf{x}}_{k|k-1},\qquad \mathbf{S}_k=\mathbf{H}\mathbf{P}_{k|k-1}\mathbf{H}^T+\mathbf{R}
$$

再算卡尔曼增益、状态更新与协方差更新：

$$
\mathbf{K}_k=\mathbf{P}_{k|k-1}\mathbf{H}^T\mathbf{S}_k^{-1}
$$

$$
\hat{\mathbf{x}}_{k|k}=\hat{\mathbf{x}}_{k|k-1}+\mathbf{K}_k\tilde{\mathbf{y}}_k,\qquad \mathbf{P}_{k|k}=(\mathbf{I}-\mathbf{K}_k\mathbf{H})\mathbf{P}_{k|k-1}
$$

| 步骤 | 输入 | 输出 | 作用 |
| --- | --- | --- | --- |
| 预测 | 上一时刻后验、$\mathbf{F}$、$\mathbf{Q}$ | 先验估计、先验协方差 | 把估计推到当前时刻 |
| 新息 | 当前观测、先验估计 | $\tilde{\mathbf{y}}_k$、$\mathbf{S}_k$ | 衡量观测与预测的差异 |
| 增益 | $\mathbf{P}_{k\vert k-1}$、$\mathbf{H}$、$\mathbf{R}$ | $\mathbf{K}_k$ | 分配“信模型”与“信观测”的权重 |
| 更新 | 先验、$\mathbf{K}_k$、新息 | 后验估计、后验协方差 | 融合观测，降低不确定性 |

## 三、卡尔曼增益与协方差递推

卡尔曼增益的本质是一个加权平均。以 $H=1$ 的一维为例，$P$ 与 $R$ 都是标量，$K=P^-/(P^-+R)$：先验方差 $P^-$ 越大，越相信观测，$K$ 越接近 1；观测噪声 $R$ 越大，越相信模型，$K$ 越接近 0。

把更新代回预测，得到只含协方差的 Riccati 递推：

$$
\mathbf{P}_{k+1|k}=\mathbf{F}\mathbf{P}_{k|k}\mathbf{F}^T+\mathbf{Q}
$$

稳态时 $\mathbf{P}_{k+1|k}=\mathbf{P}_{k|k-1}=\mathbf{P}_\infty$，得到离散代数 Riccati 方程。稳态增益 $\mathbf{K}_\infty$ 可以离线算好，在线只做乘加，这就是常说的“稳态卡尔曼”。

> [!warning] 数值实现的两个细节
> 一是 $\mathbf{P}_{k|k}=(\mathbf{I}-\mathbf{K}\mathbf{H})\mathbf{P}_{k|k-1}$ 在浮点运算下可能失去对称性或正定性，工程上常用 Joseph 形式 $\mathbf{P}_{k|k}=(\mathbf{I}-\mathbf{K}\mathbf{H})\mathbf{P}_{k|k-1}(\mathbf{I}-\mathbf{K}\mathbf{H})^T+\mathbf{K}\mathbf{R}\mathbf{K}^T$。二是 $\mathbf{Q}$、$\mathbf{R}$ 不是“越准越好”，它们决定了滤波器带宽：$\mathbf{Q}$ 大则跟踪快但抖动大，$\mathbf{R}$ 大则平滑强但响应慢。

## 四、标量例子：随机游走

> [!example] 随机游走
> 设 $x_k=x_{k-1}+w_k$，$z_k=x_k+v_k$，$w_k\sim\mathcal{N}(0,q)$，$v_k\sim\mathcal{N}(0,r)$，取 $q=r=1$，初始 $P_0=1$。预测与更新退化为

$$
P^-=P_{k-1}+q,\qquad K_k=\frac{P^-}{P^-+r},\qquad P_k=(1-K_k)P^-
$$

稳态协方差满足 $P=(P+q)r/(P+q+r)$，整理得 $P^2+Pq-rq=0$，取正根

$$
P_\infty=\frac{-q+\sqrt{q^2+4rq}}{2}=\frac{\sqrt{5}-1}{2}\approx0.618,\qquad K_\infty\approx0.382
$$

| $k$ | $P_{k\vert k-1}$ | $K_k$ | $P_{k\vert k}$ |
| --- | --- | --- | --- |
| 1 | 2.000 | 0.667 | 0.667 |
| 2 | 1.667 | 0.625 | 0.625 |
| 3 | 1.625 | 0.619 | 0.619 |
| 4 | 1.619 | 0.618 | 0.618 |

协方差从初始的 1 迅速收敛到 0.618，说明滤波器在几步之后就进入稳态。若把 $r$ 增大到 9，稳态增益降到约 0.22，滤波器更平滑、对观测噪声更不敏感，但对真实状态变化的响应也更慢。

## 五、与维纳滤波的关系

| 维度 | 维纳滤波 | 卡尔曼滤波 |
| --- | --- | --- |
| 信号模型 | 宽平稳，已知功率谱 | 状态空间，可非平稳 |
| 数据使用 | 整段或半无限数据 | 逐时刻递推，实时 |
| 多变量 | 矩阵谱分解 | 矩阵递推，天然支持 |
| 时变参数 | 不直接支持 | 支持 $\mathbf{F}_k$、$\mathbf{H}_k$、$\mathbf{Q}_k$、$\mathbf{R}_k$ |
| 稳态解 | 频域最优 | 稳态增益与维纳解一致 |

当状态空间模型平稳且时间趋于无穷时，卡尔曼滤波收敛为维纳滤波；反过来，维纳滤波可以看作卡尔曼滤波的频域稳态版本。卡尔曼的优势在于非平稳、多变量和在线更新，代价是需要知道状态模型，且模型失配时性能会明显下降。

> [!warning] 模型失配比噪声更可怕
> 若真实系统与 $\mathbf{F}$、$\mathbf{H}$ 不符，新息会出现有色偏差，滤波器可能“自信地估错”。工程上要监控新息的白性与协方差，必要时增大 $\mathbf{Q}$ 或改用自适应/鲁棒滤波。非线性系统则需 EKF、UKF 或粒子滤波，它们不再有全局最优性。

## 关联

- 上一节：[[vault-notes/random-signals/07-wiener-filter]]
- 下一节：[[vault-notes/random-signals/08-hypothesis-testing]]（08 模块首篇）
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/communication/04-channel]]、[[vault-notes/matlab/matlab-notes]]
