---
title: "随机过程"
tags:
- 通信
- 通信原理
- 随机过程
type: course
subjects:
- 通信原理
domains:
- 通信与信息
status: learning
aliases: []
prerequisites: []
related: []
---

> [!abstract] 本章在讲什么
> 本章为全书提供**噪声与随机信号的数学模型**，3.1–3.7 层层递进：
> - **3.1 随机过程的基本概念**：随机过程怎么描述？分布函数与数字特征（均值、方差、自相关）各是什么？
> - **3.2 平稳随机过程**：严平稳与宽平稳差在哪？各态历经为什么能用时间平均代替统计平均？自相关函数有哪些性质？
> - **3.3 高斯随机过程**：高斯过程为什么特殊？$Q$ 函数、$\mathrm{erf}$、$\mathrm{erfc}$ 怎么换算？
> - **3.4 平稳随机过程通过线性系统**：输出功率谱为什么等于输入功率谱乘 $|H(\omega)|^2$？
> - **3.5 窄带随机过程**：同相/正交分量服从什么分布？包络与相位为什么是瑞利 + 均匀？
> - **3.6 正弦波加窄带高斯噪声**：合成包络为什么服从莱斯分布？大/小信噪比时如何退化？
> - **3.7 高斯白噪声和带限白噪声**：$n_0/2$ 与 $n_0$ 怎么区分？$\sigma_n^2=n_0B$ 从哪来？
>
> 一句话主线：**通信中的噪声是随机过程；平稳性让统计特性与时间起点无关，各态历经让它可由一次观测估计，窄带高斯模型则把噪声拆成同相/正交两路，最终给出瑞利、莱斯、高斯三个判决量分布——它们是第 7–9 章所有误码率推导的统计基础。**

> [!note] 记号约定
> - 随机过程记 $\xi(t)$；一次试验得到的**样本函数**记 $x(t)$
> - 均值 $a(t)=E[\xi(t)]$；方差 $\sigma^2(t)=D[\xi(t)]$；自相关 $R(t_1,t_2)=E[\xi(t_1)\xi(t_2)]$
> - 平稳过程的自相关只与时间差有关，记 $R(\tau)$；功率谱密度记 $P_\xi(\omega)$
> - 白噪声**双边**谱密度为 $n_0/2$（W/Hz），**单边**谱密度为 $n_0$；带通滤波器带宽为 $B$ 时噪声功率 $\sigma_n^2=n_0B$
> - $Q(x)$、$\mathrm{erf}(x)$、$\mathrm{erfc}(x)$ 均为标准正态分布的尾部/误差函数；$I_0(x)$ 为第一类零阶修正贝塞尔函数
> - $\omega_c$：载波角频率；$\omega_0=2\pi/T_0$：周期信号基频

# 3.1 随机过程的基本概念

> [!info] Def 1 随机过程
> **随机过程**（stochastic process）$\xi(t)$ 是随时间变化的随机变量族：在任一时刻 $t_i$，$\xi(t_i)$ 是一个随机变量；对一次试验（一个样本函数）而言，它又是一个确定的时间函数。

## 分布函数与概率密度

- 一维**分布函数**（distribution function）：$F_1(x_1,t_1)=P[\xi(t_1)\le x_1]$
- $n$ 维分布函数：完整描述随机过程的统计特性
- 相应的 $n$ 维**概率密度函数**（probability density function，简称 PDF）通过对分布函数求偏导得到

## 数字特征

| 数字特征 | 定义 | 物理意义 |
| --- | --- | --- |
| **均值** $a(t)$ | $E[\xi(t)]=\int x f_1(x,t)\,dx$ | 统计平均（集合平均），波动中心 |
| **方差** $\sigma^2(t)$ | $D[\xi(t)]=E[(\xi(t)-a(t))^2]$ | 偏离均值的程度 |
| **自相关函数** $R(t_1,t_2)$ | $E[\xi(t_1)\xi(t_2)]$ | 自身关联程度 |
| **协方差** $B(t_1,t_2)$ | $R(t_1,t_2)-a(t_1)a(t_2)$ | 去除均值后的相关 |

# 3.2 平稳随机过程

## 定义（狭义/严平稳）

> [!info] Def 2 严平稳
> 若随机过程的 $n$ 维分布函数对任意时间平移 $\tau$ 都满足
> $$
> f_n(x_1,\dots,x_n;t_1,\dots,t_n)=f_n(x_1,\dots,x_n;t_1+\tau,\dots,t_n+\tau)
> $$
> 则称其为**严平稳**（strictly stationary）随机过程，即统计特性不随时间平移而变化。

> [!info] Def 3 广义平稳
> **广义平稳**（wide-sense stationary，简称 WSS）只需满足两条：
> 1. 均值与时间无关：$E[\xi(t)]=a$（常数）
> 2. 自相关只与时间**差**有关：$R(t_1,t_1+\tau)=R(\tau)$

> [!note] 严平稳与宽平稳的关系
> 严平稳 $\supset$ 宽平稳；对**高斯过程**，两者等价（宽平稳的高斯过程必严平稳）。

## 各态历经性（遍历性）

> [!info] Def 4 各态历经
> 若一个样本函数的**时间平均**可以替代统计平均，即
> $$
> \overline{a}=\lim_{T\to\infty}\frac{1}{T}\int_{-T/2}^{T/2}x(t)\,dt=E[\xi(t)]=a
> $$
> $$
> \overline{R(\tau)}=\lim_{T\to\infty}\frac{1}{T}\int_{-T/2}^{T/2}x(t)x(t+\tau)\,dt=R(\tau)
> $$
> 则称该平稳过程具有**各态历经性**（ergodicity，也称遍历性）。

> [!tip] 一句话记忆
> **各态历经 = "一条样本走遍所有状态" → 可用一次观测的时间平均代替大量样本的统计平均**。这是工程上测量噪声功率谱的理论依据。

## 平稳过程自相关函数的性质

$$
R(\tau)\leftrightarrow P_\xi(\omega)\quad(\text{维纳-辛钦})
$$

1. $R(0)=E[\xi^2(t)]$ = **总平均功率**（均方值）
2. $R(\tau)=R(-\tau)$，偶函数
3. $|R(\tau)|\le R(0)$，$\tau=0$ 取最大
4. $R(\infty)=a^2$（均值的平方）；$R(0)-R(\infty)=\sigma^2$（**方差 = 交流功率**）

## 平稳过程的功率谱密度

由**维纳–辛钦定理**（Wiener–Khintchine theorem，见 [[vault-notes/communication/02-deterministic-signals]]）：

> [!info] Def 5 功率谱密度
> 平稳随机过程的**功率谱密度**（power spectral density，简称 PSD）与其自相关函数构成傅里叶变换对：
> $$
> P_\xi(\omega)=\int_{-\infty}^{\infty}R(\tau)e^{-j\omega\tau}\,d\tau
> $$
> $$
> R(\tau)=\frac{1}{2\pi}\int_{-\infty}^{\infty}P_\xi(\omega)e^{j\omega\tau}\,d\omega
> $$
> 总平均功率 $=R(0)=\dfrac{1}{2\pi}\displaystyle\int_{-\infty}^{\infty}P_\xi(\omega)\,d\omega$。

# 3.3 高斯随机过程（正态）

## 定义

> [!info] Def 6 高斯随机过程
> 若随机过程的任意 $n$ 维分布都服从**正态分布**，则称其为**高斯随机过程**（Gaussian random process）。
> 一维概率密度为
> $$
> f(x)=\frac{1}{\sqrt{2\pi}\sigma}\exp\left[-\frac{(x-a)^2}{2\sigma^2}\right]
> $$

## 重要性质（考研记住前四条）

1. **宽平稳 ⇔ 严平稳**（高斯过程专有）
2. **各态历经**（若平稳）
3. 若 $\xi_1,\dots,\xi_n$ 互相独立，则**不相关 ⇔ 统计独立**；**多个高斯变量的线性组合仍是高斯变量**
4. 高斯过程通过**线性系统**后仍是高斯过程（这是"高斯噪声通过线性系统仍高斯"的依据）
5. $a=0$ 时 $f(x)$ 关于原点对称；$\sigma$ 越小曲线越尖锐

## 常用函数（误码率推导的常客）

$$
Q(x)=\int_x^{\infty}\frac{1}{\sqrt{2\pi}}e^{-t^2/2}\,dt\qquad \mathrm{erf}(x)=\frac{2}{\sqrt{\pi}}\int_0^x e^{-t^2}\,dt
$$

$$
\mathrm{erfc}(x)=1-\mathrm{erf}(x)=\frac{2}{\sqrt{\pi}}\int_x^{\infty}e^{-t^2}\,dt
$$

$$
Q(x)=\frac{1}{2}\mathrm{erfc}\left(\frac{x}{\sqrt{2}}\right)
$$

> [!tip] 记忆
> 第 6/7/9 章所有**相干解调**误码率都以 $\frac{1}{2}\mathrm{erfc}(\sqrt{\cdot})$ 形式出现；**非相干解调**以 $e^{-x}$ 形式出现。

# 3.4 平稳随机过程通过线性系统

输入 $\xi_i(t)$（平稳，均值 $a$，谱 $P_i(\omega)$）→ 线性系统 $H(\omega)$ → 输出 $\xi_o(t)$：

1. **输出仍是平稳过程**（高斯输入则高斯输出）
2. 输出均值：$a_o=a\cdot H(0)$（直流分量乘直流增益）
3. **输出功率谱 = 输入功率谱 × 系统增益平方**：

$$
P_o(\omega)=|H(\omega)|^2P_i(\omega)
$$

4. 输出自相关：$R_o(\tau)=R_i(\tau)*h(\tau)*h(-\tau)$
5. 输出功率：$R_o(0)=\dfrac{1}{2\pi}\displaystyle\int |H(\omega)|^2P_i(\omega)\,d\omega$

> [!tip] 核心公式
> **$P_o(\omega)=|H(\omega)|^2P_i(\omega)$**——所有"白噪声通过带通滤波器"问题的解题钥匙。

# 3.5 窄带随机过程

## 什么是窄带过程

> [!info] Def 7 窄带随机过程
> 若随机过程的谱集中于中心频率 $\omega_c$ 附近，且满足**中心频率远大于带宽**（$\omega_c\gg B$），则称其为**窄带随机过程**（narrowband random process）。
> 标准表达式为
> $$
> \xi(t)=a_\xi(t)\cos[\omega_c t+\varphi_\xi(t)]=\xi_c(t)\cos\omega_c t-\xi_s(t)\sin\omega_c t
> $$
> 其中 $a_\xi(t)$ 为**包络**（慢变化），$\varphi_\xi(t)$ 为**相位**（慢变化），$\xi_c(t)$ 为**同相分量**（in-phase component），$\xi_s(t)$ 为**正交分量**（quadrature component）。

## 零均值平稳高斯窄带过程的统计特性

> [!important] 必背结论（频考）
> 均值为 0、方差为 $\sigma_n^2$ 的平稳高斯窄带过程 $\xi(t)$：
>
> **① 同相分量与正交分量**
> - $\xi_c(t)$、$\xi_s(t)$ 都是**平稳高斯过程**，均值皆为 0
> - **方差都等于 $\sigma_n^2$**（与 $\xi(t)$ 相同）
> - 同一时刻上 $\xi_c$ 与 $\xi_s$ **统计独立**（不相关）
>
> **② 包络与相位**（在任意时刻）
> - 包络 $a_\xi$ 服从**瑞利分布**（Rayleigh distribution）：
>
> $$
> f(a_\xi)=\frac{a_\xi}{\sigma_n^2}\exp\left[-\frac{a_\xi^2}{2\sigma_n^2}\right],\quad a_\xi\ge0
> $$
>
> - 相位 $\varphi_\xi$ 服从**均匀分布**：$f(\varphi_\xi)=\dfrac{1}{2\pi}$，$0\le\varphi_\xi<2\pi$
> - 同一时刻上包络与相位**统计独立**

**对应接收场景**：只有噪声、无信号时的接收包络 → 瑞利分布（2ASK 非相干、鉴频器输出的分析基础）。

# 3.6 正弦波加窄带高斯噪声

接收信号模型（信号 + 窄带噪声）：

$$
r(t)=A\cos(\omega_c t+\theta)+n(t)=\rho(t)\cos[\omega_c t+\varphi(t)]
$$

> [!important] 必背结论
> **合成包络 $\rho$ 服从莱斯分布**（Rice distribution，也称广义瑞利分布）：
>
> $$
> f(\rho)=\frac{\rho}{\sigma_n^2}I_0\!\left(\frac{A\rho}{\sigma_n^2}\right)\exp\left[-\frac{\rho^2+A^2}{2\sigma_n^2}\right],\quad \rho\ge0
> $$
>
> - $I_0(x)$：第一类零阶修正贝塞尔函数
> - **大信噪比**（$A\gg\sigma_n$）：莱斯 → **高斯**（中心在 $A$）
> - **小信噪比**（$A\to0$）：莱斯 → **瑞利**

**对应接收场景**：2FSK/2ASK 非相干包络检波时"发 1"支路的判决量分布 → 莱斯分布。

# 3.7 高斯白噪声和带限白噪声

## 白噪声

> [!info] Def 8 白噪声
> **白噪声**（white noise）的功率谱密度在整个频率轴上**均匀**：
> $$
> P_n(f)=\frac{n_0}{2}\quad(\text{W/Hz}),\quad -\infty<f<\infty\quad(\text{双边谱})
> $$
> 单边谱为 $n_0$。

自相关函数：

$$
R(\tau)=\frac{n_0}{2}\delta(\tau)
$$

性质：

- 只有在 $\tau=0$ 才相关，**任意两个不同时刻的取值不相关**（白噪声）
- 平均功率**无穷大**（理想模型，带宽有限的实际系统中必是带限的）
- "白"指谱均匀如白光；**白噪声不一定是高斯的**，但通信中默认研究高斯白噪声

## 带限白噪声

白噪声经过理想低通（截止 $B$）：

$$
P_n(f)=\frac{n_0}{2},\ |f|\le B\qquad R(\tau)=n_0B\,\mathrm{Sa}(2\pi B\tau)
$$

- $\tau=k/(2B)$（$k$ 为非零整数）时取样值**不相关**——奈奎斯特抽样间隔 $1/(2B)$ 的另一层意义

白噪声经过理想带通（中心 $f_c$、带宽 $B$）→ **窄带高斯噪声**（3.5 节模型），这就是接收机带通滤波器输出的标准噪声模型：

$$
n(t)=n_c(t)\cos\omega_c t-n_s(t)\sin\omega_c t
$$

$$
\sigma_n^2=n_0B\quad(\text{噪声功率}=\text{单边谱密度}\times\text{带宽})
$$

> [!warning] 噪声功率计算易错点
> $B$ 为**带通滤波器带宽**（Hz）时，$\sigma_n^2=n_0B$（此处 $n_0$ 为单边谱密度）。注意题给的是双边 $\dfrac{n_0}{2}$ 还是单边 $n_0$。

> [!tip] 本章收官
> 本章把"噪声"从工程直觉变成可计算的数学模型：**平稳性**去掉时间起点，**各态历经**让一次观测可用，**线性系统**给出 $P_o=\lvert H\rvert^2P_i$，**窄带分解**把噪声拆成同相/正交两路，**瑞利/莱斯/高斯**三分布对应"只有噪声 / 信号+噪声 / 大信噪比近似"三种判决场景，**白噪声**给出 $\sigma_n^2=n_0B$ 这一贯穿第 6–9 章的噪声功率公式。

## 本章知识地图

```
随机过程
├─ 基本概念（3.1）
│  ├─ 分布函数 F₁(x,t)、n 维分布
│  └─ 数字特征：均值 a、方差 σ²、自相关 R(t₁,t₂)、协方差 B
├─ 平稳随机过程（3.2）
│  ├─ 严平稳（n 维分布平移不变）／宽平稳（均值常数 + R 只依赖 τ）
│  ├─ 各态历经：时间平均 = 统计平均
│  ├─ R(τ) 性质：R(0)=总功率、偶函数、|R(τ)|≤R(0)、R(∞)=a²
│  └─ 维纳-辛钦：R(τ) ↔ P_ξ(ω)
├─ 高斯过程（3.3）
│  ├─ 宽平稳 ⇔ 严平稳；线性变换仍高斯
│  ├─ Q(x)、erf、erfc，Q(x)=½erfc(x/√2)
│  └─ 相干解调误码率用 erfc，非相干用 e⁻ˣ
├─ 通过线性系统（3.4）
│  ├─ 输出仍平稳（高斯进高斯出）
│  ├─ a_o = a·H(0)
│  └─ P_o(ω) = |H(ω)|² P_i(ω)
├─ 窄带随机过程（3.5）
│  ├─ ξ(t) = ξ_c cosω_c t − ξ_s sinω_c t
│  ├─ ξ_c、ξ_s：零均值、方差 σ_n²、同一时刻独立
│  └─ 包络瑞利分布／相位均匀分布
├─ 正弦 + 窄带噪声（3.6）
│  ├─ 合成包络 ρ ~ 莱斯分布（含 I₀）
│  ├─ 大信噪比 → 高斯；小信噪比 → 瑞利
│  └─ 非相干包络检波"发 1"支路
└─ 白噪声（3.7）
   ├─ 双边谱 n₀/2，R(τ)=n₀/2·δ(τ)
   ├─ 带限低通：R(τ)=n₀B·Sa(2πBτ)
   └─ 带通 → 窄带高斯，σ_n² = n₀B
```

## 关联

- 上一章：[[vault-notes/communication/02-deterministic-signals]]
- 下一章：[[vault-notes/communication/04-channel]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 维纳–辛钦、$P_o=\lvert H\rvert^2P_i$ | [[vault-notes/communication/02-deterministic-signals]] 的频域工具；[[vault-notes/communication/06-digital-baseband]] 的噪声功率计算 |
| 高斯分布、$Q(x)$、$\mathrm{erfc}$ | [[vault-notes/communication/07-digital-bandpass]] 全部误码率公式；[[vault-notes/communication/09-optimal-reception]] 的最佳接收机性能 |
| 瑞利/莱斯分布 | [[vault-notes/communication/07-digital-bandpass]] 的 2ASK/2FSK 非相干解调；[[vault-notes/communication/05-analog-modulation]] 的包络检波门限效应 |
| $\sigma_n^2=n_0B$ | [[vault-notes/communication/04-channel]] 的噪声功率；[[vault-notes/communication/09-optimal-reception]] 的 $r_{0\max}=2E/n_0$ |

**通信方向应用**：

- [[vault-notes/math/probability/03-random-variables-distributions]] —— 高斯、瑞利、莱斯三种分布的密度函数与数字特征在概率论笔记中有完整推导，可与本章对照阅读。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 5G 接收机的噪声系数、热噪声功率 $N=kTB$ 与本章 $\sigma_n^2=n_0B$ 是同一模型；OFDM 各子载波上的噪声仍是复高斯。
- [[vault-notes/matlab/matlab-notes]] —— 用 `randn` 生成高斯噪声、用直方图验证瑞利/莱斯分布，是最直接的数值实验。

**相关**：[[vault-notes/communication/02-deterministic-signals]]｜[[vault-notes/communication/04-channel]]｜[[vault-notes/communication/07-digital-bandpass]]
