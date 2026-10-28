---
title: 统计估计与最优滤波
description: 从偏差、方差与 CRLB 出发，串联最大似然、最小二乘、MMSE/LMMSE、维纳滤波与卡尔曼滤波，理解最优估计的共同几何直觉。
tags:
  - signal-processing
  - estimation
  - wiener-filter
  - kalman-filter
---

前面的文章都在“描述”随机信号；这一篇开始“从含噪观测里提取信息”。问题可以分成三类：估计一个未知参数（偏差、方差、CRLB）、估计一整段随机波形（维纳、卡尔曼）、以及在线跟踪一个缓慢变化的系统（LMS、RLS）。它们共享同一个几何直觉——**正交投影**：最优估计的误差必须与已知数据正交。掌握这条主线，公式就不再需要死记。在线跟踪与谱模型见 [[signal-processing/adaptive-filtering-and-spectral-estimation|自适应滤波与参数化谱估计]]。

## 估计量的三把标尺：偏差、方差与 MSE

设观测 $\mathbf{x}$ 的联合密度为 $f(\mathbf{x};\theta)$，任何不显含 $\theta$ 的统计量 $\hat{\theta}=g(\mathbf{x})$ 都是 $\theta$ 的估计量。误差 $\tilde{\theta}=\hat{\theta}-\theta$ 的均方值可拆成两项：

$$
\mathrm{MSE}(\hat{\theta})=E\big[(\hat{\theta}-\theta)^2\big]
=\mathrm{Var}(\hat{\theta})+\mathrm{bias}^2(\hat{\theta}),\qquad \mathrm{bias}=E[\hat{\theta}]-\theta
$$

打靶的比喻：方差是弹着点的分散，偏差是瞄准镜零点偏移；弹着点再集中，整体偏出靶心成绩仍然不好。**方差小不等于误差小。**

| 性质 | 定义 | 检验方式 | 说明 |
| --- | --- | --- | --- |
| 无偏 | $\mathrm{bias}=0$ 对所有 $\theta$ | 求 $E[\hat{\theta}]$ | 平均对，单次仍可能偏 |
| 一致 | $\hat{\theta}\xrightarrow{P}\theta$ | $\mathrm{MSE}\to0$（充分） | 样本越多越接近真值 |
| 有效 | 无偏且方差达到 CRLB | 与 $1/I(\theta)$ 比较 | 一定是 MVUE，反之不一定 |
| MVUE | 无偏估计中方差最小 | 求无偏类最小方差 | 不要求达到 CRLB |

三个概念不能互相替代：只用第一个样本估计均值是无偏的，但方差不随 $N$ 减小，因而不一致；$\frac{1}{N}\sum(x_n-\bar{x})^2$ 有偏，却是一致估计。

**Fisher 信息与 CRLB。** 对数似然 $\ell(\theta)=\ln f(\mathbf{x};\theta)$，Fisher 信息 $I(\theta)=E[(\partial\ell/\partial\theta)^2]=-E[\partial^2\ell/\partial\theta^2]$ 度量数据对参数变化的敏感度；$N$ 个独立样本有 $I_N=NI_1$。正则条件下任何无偏估计满足

$$
\mathrm{Var}(\hat{\theta})\ge\frac{1}{I(\theta)}
$$

等号成立称有效估计。有偏时下界改为 $(1+b'(\theta))^2/I(\theta)$。CRLB 有边界：支撑集不能依赖 $\theta$（均匀分布 $U(0,\theta)$ 属非正则），对数似然要二阶可导。

> [!example] 高斯均值
> $x_n\sim\mathcal{N}(\mu,\sigma^2)$ 独立同分布、$\sigma^2$ 已知。得分函数 $\partial\ell/\partial\mu=\sum(x_n-\mu)/\sigma^2$，$I(\mu)=N/\sigma^2$。样本均值无偏、方差 $\sigma^2/N$，刚好等于 $1/I$，所以它是有效估计与 MVUE。若改用收缩估计 $\hat{\mu}_c=c\bar{x}$，取 $c^\ast=\mu^2/(\mu^2+\sigma^2/N)$ 可使 MSE 更小：$\mu=1$、$\sigma=1$、$N=4$ 时 $c^\ast=0.8$，MSE 从 $0.25$ 降到 $0.20$。可见**无偏不是唯一目标**，先验可靠或信噪比低时有偏估计更划算。

## 最大似然与最小二乘

**最大似然**选择让观测最可能出现的参数：

$$
\hat{\theta}_{ML}=\arg\max_\theta \ell(\theta),\qquad \frac{\partial\ell}{\partial\theta}=\mathbf{0}
$$

它满足参数变换不变性，正则条件下渐近无偏、渐近有效，且 $\sqrt{N}(\hat{\theta}_{ML}-\theta)\xrightarrow{d}\mathcal{N}(\mathbf{0},I_1^{-1})$。注意 MLE 不等于无偏：高斯方差与均匀分布 $U(0,\theta)$ 的 MLE 都有偏，它的长处是渐近性质。

**最小二乘**从几何出发，对线性模型 $\mathbf{y}=\mathbf{H}\theta+\mathbf{w}$ 最小化残差平方和，正规方程为

$$
\mathbf{H}^T\mathbf{H}\hat{\theta}_{LS}=\mathbf{H}^T\mathbf{y}\ \Longrightarrow\ \hat{\theta}_{LS}=(\mathbf{H}^T\mathbf{H})^{-1}\mathbf{H}^T\mathbf{y}
$$

几何上 $\mathbf{H}\hat{\theta}_{LS}$ 是 $\mathbf{y}$ 在 $\mathbf{H}$ 列空间上的正交投影，残差与列空间正交。噪声方差不相等或相关时用加权最小二乘：

$$
\hat{\theta}_{WLS}=(\mathbf{H}^T\mathbf{W}\mathbf{H})^{-1}\mathbf{H}^T\mathbf{W}\mathbf{y}
$$

$\mathbf{W}$ 越接近噪声协方差逆，估计越有效；$N\times N$ 维的高斯似然对数正好是 $-\lVert\mathbf{y}-\mathbf{H}\theta\rVert^2/(2\sigma^2)$ 加常数，所以**高斯白噪声下 LS 与 MLE 同解**，噪声协方差为 $\mathbf{C}$ 时 MLE 对应 $\mathbf{W}=\mathbf{C}^{-1}$。换成拉普拉斯噪声，MLE 变成最小绝对误差；换成均匀噪声，退化为约束优化——**噪声分布决定损失函数**。

> [!example] 两个经典用法
> **直线拟合**：$y_n=a+bn+w_n$，其中
>
> $
> \hat{b}=\frac{\sum(n-\bar{n})(y_n-\bar{y})}{\sum(n-\bar{n})^2},\qquad \hat{a}=\bar{y}-\hat{b}\bar{n}
> $
>
> 高斯噪声下即 MLE；只要求零均值、等方差、不相关时它是 BLUE（高斯–马尔可夫定理）。
> **时延估计**：$r(t)=s(t-\tau)+w(t)$，最小化 $\int\lvert r-s(t-\tau)\rvert^2\mathrm{d}t$ 等价于最大化互相关 $\int r(t)s(t-\tau)\mathrm{d}t$，工程上就是相关峰搜索；白高斯噪声下它与 MLE 相同，目标函数非凸，需要粗搜索加插值细化。

## MMSE 与 LMMSE：正交性原理

贝叶斯视角把 $\theta$ 当作随机变量，引入先验。使均方误差最小的估计是**后验均值**：

$$
\hat{\theta}_{MMSE}(\mathbf{x})=E[\theta\mid\mathbf{x}],\qquad \mathrm{MSE}_{MMSE}=E\big[\mathrm{Var}(\theta\mid\mathbf{x})\big]
$$

若把估计限制为观测的仿射函数 $\hat{\theta}=\mathbf{a}^T\mathbf{x}+b$，由**正交性原理**——误差与观测正交 $E[(\theta-\hat{\theta})\mathbf{x}^T]=\mathbf{0}$——解出 LMMSE：

$$
\hat{\theta}_{LMMSE}=\mu_\theta+\mathbf{C}_{\theta x}\mathbf{C}_{xx}^{-1}(\mathbf{x}-\mu_x)
$$

$$
\mathrm{MSE}_{LMMSE}=\mathbf{C}_{\theta\theta}-\mathbf{C}_{\theta x}\mathbf{C}_{xx}^{-1}\mathbf{C}_{x\theta}
$$

标量形式最直观：$\hat{\theta}=\mu_\theta+\rho\frac{\sigma_\theta}{\sigma_x}(x-\mu_x)$，$\mathrm{MSE}=\sigma_\theta^2(1-\rho^2)$。$\rho=0$ 时退回先验均值、MSE 等于先验方差；$|\rho|\to1$ 时几乎直接用观测。**若 $\theta$ 与 $\mathbf{x}$ 联合高斯，条件均值就是仿射函数，MMSE 与 LMMSE 完全重合**——高斯分布由一、二阶矩决定，非线性估计无法再降低 MSE。

> [!example] 标量高斯模型
> $x=\theta+w$，$\theta\sim\mathcal{N}(0,\sigma_\theta^2)$，$w\sim\mathcal{N}(0,\sigma_w^2)$ 独立，则 $\hat{\theta}=\frac{\sigma_\theta^2}{\sigma_\theta^2+\sigma_w^2}x$，$\mathrm{MSE}=\frac{\sigma_\theta^2\sigma_w^2}{\sigma_\theta^2+\sigma_w^2}$。取 $1$ 与 $3$ 时增益 $1/4$、MSE $3/4$；信噪比趋零时退回先验均值，趋大时接近观测本身。

| 估计器 | 函数类 | 需要的信息 | 是否无偏 | 最优范围 |
| --- | --- | --- | --- | --- |
| MMSE | 任意可测函数 | 完整后验 | 通常有偏 | 全局 MSE 最小 |
| LMMSE | 仿射函数 | 均值、协方差 | 通常有偏 | 仿射类内最优 |
| MVUE | 任意函数但无偏 | 完整似然 | 无偏 | 无偏类方差最小 |
| BLUE | 仿射且无偏 | 均值、协方差 | 无偏 | 线性无偏类最优 |

公式使用的边界：$\mathbf{C}_{xx}$ 必须可逆（否则用伪逆或正则化）；只保证仿射类内最优，强非线性下可能远不如 MMSE；均值与协方差未知时用样本估计会引入额外误差。

## 维纳滤波：把 LMMSE 推广到整段波形

**模型。** 观测 $x(t)=s(t)+w(t)$，$s,w$ 联合宽平稳、二阶统计已知，设计 LTI 滤波器 $h(t)$ 使波形均方误差最小：

$$
\sigma_e^2=E\big[(s(t)-\hat{s}(t))^2\big],\qquad \hat{s}(t)=h(t)*x(t)
$$

令 MSE 的变分为零，得到误差与观测正交 $E[(s(t)-\hat{s}(t))x(t-\tau)]=0$，展开即 **Wiener–Hopf 方程**

$$
R_{sx}(\tau)=\int_{-\infty}^{\infty}h(\alpha)R_{xx}(\tau-\alpha)\,\mathrm{d}\alpha
$$

它与 LMMSE 的正交性原理是同一件事，只是把有限维向量换成了连续时间函数。限定因果时方程只在 $\tau\ge0$ 成立，求解要困难得多。

**非因果解。** 两边取傅里叶变换，卷积变乘积：

$$
H(\omega)=\frac{S_{sx}(\omega)}{S_{xx}(\omega)}
$$

信号与噪声独立时 $S_{sx}=S_{ss}$、$S_{xx}=S_{ss}+S_{ww}$，于是

$$
H_W(\omega)=\frac{S_{ss}(\omega)}{S_{ss}(\omega)+S_{ww}(\omega)},\qquad
\sigma_{e,\min}^2=\frac{1}{2\pi}\int\frac{S_{ss}S_{ww}}{S_{ss}+S_{ww}}\,\mathrm{d}\omega
$$

信号强、噪声弱的频段增益接近 1，反之接近 0——维纳滤波就是按频点信噪比分配增益。

**因果与 FIR。** 因果 IIR 解要做谱分解 $S_{xx}(z)=L(z)L(z^{-1})$（$L$ 因果最小相位），再取因果部分：

$$
H(z)=\frac{1}{L(z)}\left[\frac{S_{sx}(z)}{L(z^{-1})}\right]_+
$$

截断为 $M$ 抽头 FIR 时，正交条件变成 Toeplitz 方程组 $\mathbf{R}_{xx}\mathbf{h}=\mathbf{r}_{sx}$，$\mathbf{h}=\mathbf{R}_{xx}^{-1}\mathbf{r}_{sx}$，与 LMMSE 同构；$M$ 越大越逼近 IIR 解，但矩阵条件数可能变差。把非因果解直接截断一般不再最优；若加足够延迟使其因果，可保留性能但引入固定时延。

> [!example] RC 信号加白噪声
> $S_{ss}=S_0/[1+(\omega RC)^2]$，噪声双边谱 $N_0/2$，则
> $$
> H_W(\omega)=\frac{S_0}{S_0+(N_0/2)\left[1+(\omega RC)^2\right]}
> $$
> 取 $S_0=1$、$N_0/2=S_0$ 时直流增益 $1/2$，等效为带宽可调的低通；最小 MSE $\sigma_{e,\min}^2=1/(2\sqrt2\,RC)$。输出 SNR 的改善有限（约 1.5–2.2 dB），因为压噪声的同时也衰减了信号高频分量。

> [!warning] 维纳滤波不最大化 SNR
> 它最小化的是**波形 MSE**。低信噪比时它宁可压窄带宽、牺牲信号高频来换噪声下降，判决时刻的 SNR 未必高于更宽的带通方案。目标是“判决时刻 SNR 最大”时应使用匹配滤波，见 [[signal-processing/signal-detection-theory|信号检测理论]]。

## 卡尔曼滤波：非平稳、多变量、在线递推

维纳滤波要求平稳且一次性处理整段数据；卡尔曼把问题改写成状态空间：

$$
\mathbf{x}_k=\mathbf{F}\mathbf{x}_{k-1}+\mathbf{B}\mathbf{u}_{k-1}+\mathbf{w}_{k-1},\qquad
\mathbf{z}_k=\mathbf{H}\mathbf{x}_k+\mathbf{v}_k
$$

$\mathbf{w}_k\sim\mathcal{N}(\mathbf{0},\mathbf{Q})$ 是过程噪声，$\mathbf{v}_k\sim\mathcal{N}(\mathbf{0},\mathbf{R})$ 是观测噪声，二者独立且与初值独立。每一轮分两步。

**预测**（把上一时刻后验推到当前时刻）：

$$
\hat{\mathbf{x}}_{k|k-1}=\mathbf{F}\hat{\mathbf{x}}_{k-1|k-1}+\mathbf{B}\mathbf{u}_{k-1},\qquad
\mathbf{P}_{k|k-1}=\mathbf{F}\mathbf{P}_{k-1|k-1}\mathbf{F}^T+\mathbf{Q}
$$

**更新**（用当前观测修正预测）：

$$
\tilde{\mathbf{y}}_k=\mathbf{z}_k-\mathbf{H}\hat{\mathbf{x}}_{k|k-1},\qquad
\mathbf{S}_k=\mathbf{H}\mathbf{P}_{k|k-1}\mathbf{H}^T+\mathbf{R}
$$

$$
\mathbf{K}_k=\mathbf{P}_{k|k-1}\mathbf{H}^T\mathbf{S}_k^{-1}
$$

$$
\hat{\mathbf{x}}_{k|k}=\hat{\mathbf{x}}_{k|k-1}+\mathbf{K}_k\tilde{\mathbf{y}}_k,\qquad
\mathbf{P}_{k|k}=(\mathbf{I}-\mathbf{K}_k\mathbf{H})\mathbf{P}_{k|k-1}
$$

卡尔曼增益本质是加权平均：一维 $H=1$ 时 $K=P^-/(P^-+R)$，先验方差越大越信观测，观测噪声越大越信模型。把更新代回预测得到只含协方差的 Riccati 递推；稳态时 $\mathbf{P}$ 收敛，增益可离线算好，就是“稳态卡尔曼”。

> [!example] 随机游走
> $x_k=x_{k-1}+w_k$、$z_k=x_k+v_k$，$q=r=1$、$P_0=1$。预测 $P^-=P_{k-1}+q$，增益 $K=P^-/(P^-+r)$。稳态解满足 $P^2+Pq-rq=0$，取正根 $P_\infty=(\sqrt5-1)/2\approx0.618$、$K_\infty\approx0.382$。协方差几步内就收敛到稳态；把 $r$ 增大到 $9$，增益降到约 $0.22$，更平滑但响应更慢。

> [!warning] 两个实现细节与一个工程风险
> 协方差更新在浮点下可能失去对称正定性，工程上常用 Joseph 形式 $\mathbf{P}=(\mathbf{I}-\mathbf{K}\mathbf{H})\mathbf{P}^-(\mathbf{I}-\mathbf{K}\mathbf{H})^T+\mathbf{K}\mathbf{R}\mathbf{K}^T$。$\mathbf{Q}$、$\mathbf{R}$ 不是“越准越好”：$\mathbf{Q}$ 大跟踪快但抖动大，$\mathbf{R}$ 大平滑强但响应慢。**模型失配比噪声更危险**：$\mathbf{F}$、$\mathbf{H}$ 与真实系统不符时，新息出现有色偏差，滤波器会“自信地估错”，应监控新息的白性与协方差，必要时增大 $\mathbf{Q}$ 或改用自适应/鲁棒滤波。

| 维度 | 维纳滤波 | 卡尔曼滤波 |
| --- | --- | --- |
| 信号模型 | 宽平稳、已知功率谱 | 状态空间，可非平稳 |
| 数据使用 | 整段或半无限 | 逐时刻递推、实时 |
| 多变量 | 矩阵谱分解 | 矩阵递推，天然支持 |
| 时变参数 | 不直接支持 | 支持 $\mathbf{F}_k,\mathbf{H}_k,\mathbf{Q}_k,\mathbf{R}_k$ |
| 稳态 | 频域最优 | 稳态增益与维纳解一致 |

## 常见错误清单

- 把“方差小”当成“估计好”，忽略偏差；或把“最小 MSE”与“无偏”混为一谈。
- 对非正则分布（支撑集依赖参数）套用 CRLB；在 $\mathbf{H}^T\mathbf{H}$ 病态时直接求逆而不用 QR/SVD。
- 看到线性模型就默认 LS 最优，忽略噪声分布；把残差平方和最小误当成误差方差最小。
- 把 MMSE 与 LMMSE 在高斯情形下的重合当成普遍结论；$\mathbf{C}_{xx}$ 奇异时仍直接求逆。
- 把非因果维纳解直接截断当因果解；把维纳滤波当成“SNR 最大化”滤波器。
- 卡尔曼滤波 $\mathbf{Q}$、$\mathbf{R}$ 乱调，或长期用非 Joseph 形式递推导致协方差失去正定性；模型失配时仍相信输出。

## 前置与下一步

- **前置**：[[signal-processing/random-processes|随机过程与随机信号]]（条件期望、高斯向量、协方差矩阵）、[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]、[[mathematics/linear-algebra-basics|线性代数基础]]（投影、特征分解、矩阵求逆引理）。
- **下一步**：[[signal-processing/adaptive-filtering-and-spectral-estimation|自适应滤波与参数化谱估计]]（LMS/RLS 在线跟踪、ARMA 与 MUSIC）、[[signal-processing/signal-detection-theory|信号检测理论]]、[[signal-processing/random-signal-experiments|MATLAB 实验]]、[[signal-processing/random-signals-formula-sheet|公式速查]]。
- **跨学科**：[[communication/index|通信原理]] 中的均衡与最佳接收。

## 来源与延伸阅读

- 估计基础：[[vault-notes/random-signals/07-estimator-bias-variance|估计量的偏差和方差]]、[[vault-notes/random-signals/07-maximum-likelihood-least-squares|最大似然与最小二乘]]、[[vault-notes/random-signals/07-mmse-lmmse|MMSE 与 LMMSE]]。
- 最优滤波：[[vault-notes/random-signals/07-wiener-filter|维纳滤波]]、[[vault-notes/random-signals/07-kalman-filter|卡尔曼滤波]]。