---
title: 宽平稳与非平稳对比实验
description: 在同一时间轴上对比随机相位正弦与零均值随机游走的样本路径、集合均值与方差，看到"均值/方差恒定仍然不足以证明 WSS"。
tags:
  - interactive-labs
  - random-processes
  - stationarity
---

## 实验目标

两个模型放在同一张时间轴上：

- **随机相位正弦**：$x_m[n]=A\cos(2\pi f_0 n/N+\theta_m)$，$\theta_m\sim U[0,2\pi)$；
- **零均值随机游走**：$w_m[n]=\sum_{k=1}^{n}\varepsilon_m[k]$，$\varepsilon\sim N(0,\sigma^2)$，$w_m[0]=0$。

两条曲线看起来都"围绕 0 波动"，但只有一条是宽平稳的。实验要回答：**均值恒定、方差恒定，是否足够判定 WSS？**

## 模型与理论矩

固定 $n$ 时：

$$
\text{正弦：}\ E[x_m[n]]=0,\quad \mathrm{Var}(x_m[n])=\frac{A^2}{2};\qquad \text{游走：}\ E[w_m[n]]=0,\quad \mathrm{Var}(w_m[n])=n\sigma^2
$$

正弦的两个矩都与 $n$ 无关；游走的方差随 $n$ 线性增长——后者已经足以说明它不是宽平稳的。

## 在线交互实验

左侧（窄屏上下）为随机相位正弦，右侧为零均值随机游走；每个模型都画出样本路径（细线）、集合均值（粗线）、集合方差随时间的变化（实线）与理论曲线（虚线）。

<iframe class="lt-lab-frame" src="/static/lab/stationarity/" title="宽平稳与非平稳对比实验" sandbox="allow-scripts allow-same-origin" loading="lazy"></iframe>

<a href="/static/lab/stationarity/" target="_blank" rel="noopener">在新页面打开完整实验</a>

## 控件说明

| 控件 | 范围 | 作用 |
| --- | --- | --- |
| 路径数 $M$ | 1–40，默认 8 | 每个模型的样本路径数，也是集合统计的样本数 |
| 时间点数 $N$ | 10–200，默认 80 | 时间轴 $n=0..N$；游走方差最大到 $N\sigma^2$ |
| 正弦幅度 $A$ | 0–2，默认 1 | 正弦的理论方差 $A^2/2$ |
| 游走步长 $\sigma$ | 0–2，默认 1 | 游走增量的标准差，理论方差 $n\sigma^2$ |
| 随机种子 | 非负整数，默认 2026 | 同一种子结果完全复现；改 $M$ 保留已有样本的前缀 |
| 重新采样 / 重置 | 按钮 | 种子加一 / 恢复默认参数 |

## 观察任务

1. 把 $M$ 从 8 加到 40：两条模型的方差估计波动都变小了吗？**偏差**（与理论值的距离）有没有变化？
2. 把 $N$ 从 80 调到 200：正弦的方差曲线是否仍然水平？游走的方差曲线怎样变化？
3. 把 $\sigma$ 从 1 改到 2：游走方差曲线的斜率变成几倍？正弦的方差是否受影响？
4. 只看均值曲线：两个模型的均值都接近 0，能否据此说两者都平稳？

## 教学结论

**均值和方差恒定不等于宽平稳。** WSS 还要求自相关只依赖时间差 $\tau$：正弦的 $R_X(\tau)=\frac{A^2}{2}\cos\omega_0\tau$ 满足；随机游走的 $R_W[m,n]=\sigma^2\min(m,n)$ 依赖两个绝对时刻，不满足。

这也解释了为什么本实验只画均值与方差：它们是最容易"看起来平稳"的两个量，却不足以做判定。完整判据与反例见 [[signal-processing/random-processes|随机过程与随机信号]] §4 与 §6。

## 与正文的衔接

- 宽平稳三步判据、反例与自相关约定：[[signal-processing/random-processes\|随机过程与随机信号]]；
- 从自相关到功率谱（维纳–辛钦）：[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]；
- 固定时刻分布与样本路径的首个实验：[[interactive-labs/random-processes-lab|随机过程与样本函数实验]]。

## 相关阅读

- [[vault-notes/random-signals/03-strict-vs-wide-sense-stationary|严平稳与宽平稳（详细笔记）]]
- [[vault-notes/random-signals/04-autocorrelation-autocovariance|自相关与自协方差（详细笔记）]]
