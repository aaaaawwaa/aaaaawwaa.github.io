---
title: "互相关与互协方差"
tags:
- 随机信号处理
- 04-随机信号的时域分析
- 互相关
- 时延估计
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

# 互相关与互协方差

> [!abstract] 这一节在讲什么
> 自相关看一个信号自身的相似性，互相关看两个信号之间的相似性，因而能回答“$Y$ 是不是 $X$ 延迟后的版本”“系统把 $X$ 变成了什么”。本节定义联合宽平稳下的互相关与互协方差，给出共轭关系、柯西–施瓦茨界，并落到时延估计、系统辨识与相干函数。
> 核心结论是：互相关峰值位置给出时延，互谱比值给出频率响应，相干函数判断线性关系的可信度；但互相关只测线性相关，且对共同噪声非常敏感。

## 一、定义与联合宽平稳

> [!info] 定义 1 互相关与互协方差
> 两个随机过程 $X(t),Y(t)$ 的**互相关函数**定义为
> $$R_{XY}(t_1,t_2)=E\big[X(t_1)Y^*(t_2)\big]$$
> 若两者各自 WSS，且互相关只依赖时间差，
> $$R_{XY}(t,t+\tau)=R_{XY}(\tau)=E\big[X(t+\tau)Y^*(t)\big]$$
> 则称它们**联合宽平稳**。对应的互协方差为
> $$C_{XY}(\tau)=R_{XY}(\tau)-\mu_X\mu_Y^*$$

离散形式为 $R_{XY}[m]=E[X[n+m]Y^*[n]]$。注意下标顺序：$R_{XY}$ 是“$X$ 在前、$Y$ 共轭在后”，交换顺序会得到共轭反转 $R_{YX}(\tau)=E[Y(t+\tau)X^*(t)]=R_{XY}^*(-\tau)$。

> [!warning] 互相关不是偶函数
> 对实过程，$R_{XY}(-\tau)=R_{YX}(\tau)$，一般不等于 $R_{XY}(\tau)$。因此互相关的峰值通常不在 $\tau=0$，这正是它能测时延的原因；不要套用自相关“原点最大”的结论。

## 二、性质与不等式

> [!info] 定义 2 互相关的基本性质
> 1. **共轭关系**：$R_{XY}(\tau)=R_{YX}^*(-\tau)$。
> 2. **柯西–施瓦茨界**：$\lvert R_{XY}(\tau)\rvert^2\le R_X(0)R_Y(0)$。
> 3. **协方差界**：$\lvert C_{XY}(\tau)\rvert^2\le C_X(0)C_Y(0)=\sigma_X^2\sigma_Y^2$。
> 4. **线性运算**：$R_{X+Y,Z}(\tau)=R_{XZ}(\tau)+R_{YZ}(\tau)$。
> 5. **独立情形**：若 $X,Y$ 独立，则 $R_{XY}(\tau)=\mu_X\mu_Y^*$。

归一化互相关定义为 $\rho_{XY}(\tau)=\dfrac{C_{XY}(\tau)}{\sqrt{C_X(0)C_Y(0)}}$，它满足 $\lvert\rho_{XY}(\tau)\rvert\le1$，且与两个信号的量纲、功率无关，适合比较不同场景下的相关强弱。

| 对比项 | 自相关 $R_X(\tau)$ | 互相关 $R_{XY}(\tau)$ |
| --- | --- | --- |
| 对称性 | $R_X(-\tau)=R_X^*(\tau)$ | $R_{XY}(-\tau)=R_{YX}(\tau)$ |
| 原点值 | 平均功率 $R_X(0)$ | 互内积，不是功率 |
| 峰值位置 | 恒在 $\tau=0$ | 可在任意 $\tau$，对应时延 |
| 上界 | $\lvert R_X(\tau)\rvert\le R_X(0)$ | $\lvert R_{XY}(\tau)\rvert^2\le R_X(0)R_Y(0)$ |
| 独立时 | 不适用 | 退化为 $\mu_X\mu_Y^*$ |
| 主要用途 | 相关时间、谱估计 | 时延、系统辨识、相干性 |

> [!tip] 记忆方法
> 自相关是“自己和自己”，所以对称、原点最大；互相关是“我和别人”，所以不对称、峰值可以搬家。峰值搬到哪里，就说明两个信号错开多少最像。

## 三、时延估计

> [!info] 定义 3 时延估计模型
> 设
> $$Y(t)=X(t-D)+N(t)$$
> 其中 $X(t)$ 与 $N(t)$ 零均值、互不相关。则
> $$R_{XY}(\tau)=E\big[X(t+\tau)X^*(t-D)\big]=R_X(\tau-D)$$
> 因此 $\lvert R_{XY}(\tau)\rvert$ 的峰值出现在 $\tau=D$。

若 $X(t)$ 是白噪声，$R_X(\tau)=\sigma^2\delta(\tau)$，则 $R_{XY}(\tau)=\sigma^2\delta(\tau-D)$，峰值极其尖锐；若 $X(t)$ 是带限或强相关的，峰值被 $R_X$ 的形状展宽，估计精度下降。此时可用广义互相关相位变换（GCC-PHAT）加权：

$$\hat D=\arg\max_{\tau}\int_{-\infty}^{\infty}\frac{S_{XY}(\omega)}{\lvert S_{XY}(\omega)\rvert}e^{j\omega\tau}\,\mathrm{d}\omega$$

它只保留相位信息，对混响与谱色散更稳健。

> [!example] 离散时延
> 设 $X[n]$ 为零均值白噪声、方差 $\sigma^2$，$Y[n]=0.5X[n-3]+N[n]$，$N[n]$ 与 $X$ 不相关、方差 $0.1\sigma^2$。则 $R_{XY}[m]=0.5\sigma^2\delta[m-3]$，峰值在 $m=3$；归一化峰值为 $0.5\sigma^2/\sqrt{\sigma^2(0.25\sigma^2+0.1\sigma^2)}\approx0.845$。峰值小于 $1$ 是噪声与幅度缩放共同造成的。

时延估计的典型场景包括雷达/声呐测距、TDOA 定位、帧同步、麦克风阵列与扩频码捕获。工程上还要处理：采样率不足时用抛物线插值或升采样细化峰值；收发时钟不同步时峰值会随观测时间漂移。

## 四、系统辨识与互谱

> [!info] 定义 4 线性系统辨识
> 设 $Y(t)=h(t)*X(t)+N(t)$，$X$ 与 $N$ 不相关。则
> $$R_{YX}(\tau)=h(\tau)*R_X(\tau)$$
> 频域中
> $$S_{YX}(\omega)=H(\omega)S_X(\omega)\ \Longrightarrow\ H(\omega)=\frac{S_{YX}(\omega)}{S_X(\omega)}$$

这里 $S_{YX}(\omega)=\int R_{YX}(\tau)e^{-j\omega\tau}\mathrm{d}\tau$ 是互谱。若误用 $S_{XY}$，由于 $S_{XY}=S_{YX}^*$，得到的是 $H^*(\omega)$，相位符号会反。

> [!info] 定义 5 相干函数
> $$\gamma_{XY}^2(\omega)=\frac{\lvert S_{XY}(\omega)\rvert^2}{S_X(\omega)S_Y(\omega)},\qquad 0\le\gamma_{XY}^2\le1$$
> 称为**相干函数**（coherence）。它表示 $Y$ 中由 $X$ 线性解释的功率比例。

| 相干值 | 含义 | 可能原因 |
| --- | --- | --- |
| 接近 $1$ | $Y$ 近似是 $X$ 的线性滤波 | 线性系统、噪声小 |
| 明显小于 $1$ | 线性关系弱 | 噪声、非线性、泄漏、时变 |
| 接近 $0$ | 无可测线性关系 | 独立、强非线性、记录不同步 |

> [!warning] 相干低不等于“无关”
> 相干函数只衡量**线性**关系。两个信号可以有确定的非线性依赖（如 $Y=X^2$）而相干接近零；判断一般依赖需要互信息或高阶统计量。

## 五、工程注意事项

1. **共同噪声**：若 $X,Y$ 共用一个干扰源，互相关会在零延迟附近出现虚假峰，时延估计被拉偏。解决方法是先做预白化、差分或使用参考通道。
2. **去均值与去趋势**：直流和慢漂移会在互相关中产生宽平台，压低峰值的可辨识度。
3. **有限记录**：与自相关一样，$1/N$ 归一化会产生 $1-\lvert m\rvert/N$ 的三角窗偏差；比较不同记录长度时应使用 `coeff` 归一化。
4. **非平稳与循环平稳**：长记录上做单一互相关会把时变结构平均掉，应使用短时互相关或循环互相关。
5. **物理解释**：互相关峰值只说明“最像”，不说明因果；因果方向要由实验设计或系统先验判断。

## 关联

- 上一节：[[vault-notes/random-signals/04-autocorrelation-autocovariance]]
- 下一节：[[vault-notes/random-signals/04-correlation-properties]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/02-deterministic-signals]]、[[vault-notes/communication/04-channel]]、[[vault-notes/5g/phy/04-physical-channels-signals]]、[[vault-notes/matlab/matlab-notes]]
