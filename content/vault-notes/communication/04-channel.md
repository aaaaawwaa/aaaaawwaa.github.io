---
title: "信道"
tags:
- 通信
- 通信原理
- 信道
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
> 本章从工程与数学两个视角看信道，4.1–4.6 依次展开：
> - **4.1 无线信道**：地波、天波、视线传播各适用于什么频段？视线距离怎么算？
> - **4.2 有线信道**：明线、对称电缆、同轴电缆、光纤各自的特点与应用。
> - **4.3 信道的数学模型**：调制信道与编码信道有什么区别？乘性干扰与加性噪声各是什么？
> - **4.4 信道特性对信号传输的影响**：恒参信道的幅频/相频畸变；随参信道的三大效应。
> - **4.5 信道中的噪声**：噪声怎么分类？为什么起伏噪声可用高斯白噪声建模？
> - **4.6 信道容量**：离散信道容量怎么定义？**香农公式**及其三大结论、$-1.6$ dB 香农极限。
>
> 一句话主线：**信道是信号与噪声共处的"舞台"；它的带宽、失真与噪声共同决定通信系统的上限，而香农公式把这个上限写成了一个可计算的数。**

> [!note] 记号约定
> - $e_i(t)$、$e_o(t)$：信道输入、输出信号；$n(t)$：加性噪声
> - $k(t)$：乘性干扰；$H(\omega)$：信道传输函数；$\varphi(\omega)$：相频特性
> - $\tau(\omega)=-\dfrac{d\varphi(\omega)}{d\omega}$：群时延（group delay）
> - $\tau_m$：最大多径时延差；$\Delta f=1/\tau_m$：相关带宽
> - $C$：信道容量（b/s）；$B$：带宽（Hz）；$S$：信号平均功率（W）；$N=n_0B$：噪声功率（W）
> - $n_0$：单边噪声功率谱密度；$\dfrac{n_0}{2}$：双边噪声功率谱密度

# 4.1 无线信道

电磁波传播方式取决于频率：

| 频段 | 传播方式 | 特点与应用 |
| --- | --- | --- |
| VLF/LF（<2 MHz 低频/甚低频） | **地波**（ground wave，沿地面绕射） | 超远程（数百~数千 km），如导航、长波电台 |
| HF（2~30 MHz 高频） | **天波**（sky wave，电离层反射） | 远程通信，多次反射可达 10000 km+；有寂静区 |
| VHF 及以上（>30 MHz） | **视线传播**（line-of-sight propagation，空间波） | 穿透电离层不反射，需架高天线；中继/卫星 |

**视线传播距离**（天线高 $h$、地球半径 $r=6370$ km）：

$$
d\approx\sqrt{2rh}
$$

> [!note] 电离层要点
> 反射高频电磁波的主要是 **F 层**（150~400 km，F₂ 层 250~400 km）；D 层主要起**吸收衰减**作用（白天存在，夜晚消失）。

# 4.2 有线信道

| 信道 | 结构/特点 | 应用 |
| --- | --- | --- |
| **明线**（open wire） | 平行裸线，易受气候影响 | 早期电话 |
| **对称电缆**（symmetrical cable） | 双线对绞，埋地 | 市话用户线 |
| **同轴电缆**（coaxial cable） | 内导体 + 屏蔽层，抗干扰强、带宽大 | CATV、早期骨干网 |
| **光纤**（optical fiber） | 光的全反射，损耗极低、带宽极大、抗电磁干扰 | 现代骨干网首选 |

> 光纤传输的就是光频段的电磁波——**光通信也属于"电信"**范畴。

# 4.3 信道的数学模型

## 调制信道模型（连续）

$$
e_o(t)=f[e_i(t)]+n(t)
$$

- $f[\cdot]$：信道**传输特性**（可能线性/非线性、时变/时不变）
- $n(t)$：**加性噪声**（additive noise，与信号独立叠加）

> [!info] Def 1 调制信道
> **调制信道**（modulation channel）是把信道看作**连续系统**的模型：输入/输出都是模拟信号，用传输特性 $f[\cdot]$ 与加性噪声 $n(t)$ 描述，研究的是**波形失真与噪声**。

**常见调制信道（线性时不变）**：

$$
e_o(t)=k(t)e_i(t)+n(t)
$$

- $k(t)$：**乘性干扰**（multiplicative interference，衰减/时变）
- 乘性干扰是区分**恒参/随参**信道的标志：
  - $k(t)$ 恒定或缓变 → **恒参信道**
  - $k(t)$ 随机快变 → **随参信道**

## 编码信道模型（离散）

> [!info] Def 2 编码信道
> **编码信道**（coding channel）是把信道看作**离散系统**的模型：输入/输出都是数字序列，用**转移概率** $P(y/x)$ 描述，研究的是**误码转移概率**。

> [!important] 模型辨析（选择题高频）
> - **调制信道**：**连续**系统模型，输入/输出都是**模拟信号**（研究波形失真与噪声）
> - **编码信道**：**离散**系统模型，输入/输出都是**数字序列**（研究误码转移概率）
> - 调制信道 + 调制/解调 = 编码信道；编码信道模型用信道**转移概率**描述

无记忆编码信道的转移概率：正确转移概率大，错误转移概率小，如二进制对称信道（binary symmetric channel，简称 BSC）：

| $P(y/x)$ | 收 0 | 收 1 |
| --- | --- | --- |
| 发 0 | $P(0/0)$ | $P(1/0)$ |
| 发 1 | $P(0/1)$ | $P(1/1)$ |

# 4.4 信道特性对信号传输的影响

## 恒参信道（有线、卫星、微波中继）

> [!info] Def 3 恒参信道
> **恒参信道**（time-invariant channel）的传输特性 $H(\omega)$ 不随时间（或只缓慢）变化，如有线信道、卫星信道、微波中继信道。

主要产生两类失真：

| 失真 | 原因 | 后果 | 改善 |
| --- | --- | --- | --- |
| **幅度–频率畸变**（amplitude-frequency distortion） | $\vert H(\omega)\vert$ 不平坦 | 波形失真、码间串扰（电话线语音清晰度下降） | 幅度均衡器 |
| **相位–频率畸变**（phase-frequency distortion） | $\tau(\omega)=-\dfrac{d\varphi(\omega)}{d\omega}$ 不恒定（群时延不均） | 相位失真、数字信号码间串扰 | 时延均衡器 |

理想恒参信道条件：$|H(\omega)|=$ 常数、$\varphi(\omega)$ 随 $\omega$ **线性**（即群时延为常数）。

## 随参信道（短波电离层反射、对流层散射）

> [!info] Def 4 随参信道
> **随参信道**（time-variant channel）的传输特性随时间随机快速变化，典型例子是短波电离层反射信道与对流层散射信道。

三大效应（必背）：

1. **瑞利型衰落**（Rayleigh fading）：多径传播 → 合成信号幅度快速起伏，包络服从瑞利分布——与 [[vault-notes/communication/03-random-processes]] 的窄带过程呼应。
2. **频率弥散**（frequency dispersion）：多普勒效应导致时间选择性衰落。
3. **频率选择性衰落**（frequency-selective fading）：多径时延差使某些频率分量衰减；**相关带宽**（coherence bandwidth）$\Delta f=1/\tau_m$，$\tau_m$ 为最大多径时延差。

> [!tip] 对抗频率选择性衰落
> 信号带宽 < 相关带宽，或采用 **OFDM**（见 [[vault-notes/communication/08-advanced-digital-modulation]]，把宽带分裂成多个窄带子载波）、扩频、RAKE 接收等。

# 4.5 信道中的噪声

| 分类维度 | 类别 |
| --- | --- |
| 来源 | 人为噪声（工业、其他电台）/ 自然噪声（雷电、宇宙、大气） |
| 性质 | 脉冲噪声 / 窄带噪声 / **起伏噪声**（最需关注） |

> [!info] Def 5 起伏噪声
> **起伏噪声**（fluctuation noise）包括热噪声、散弹噪声、宇宙噪声等，其瞬时值服从高斯分布、功率谱在很宽频带内均匀——本质都是**高斯白噪声**（见 [[vault-notes/communication/03-random-processes]]），是本书噪声分析的标准模型。

> 带通型接收机把白噪声过滤成**窄带高斯噪声**，噪声功率 $\sigma_n^2=n_0B$。

# 4.6 信道容量

## 离散信道容量（概念辨析）

- $C$：每符号最大平均信息量（b/符号）
- $C_t$：单位时间最大平均信息量（b/s）

$$
C_t=\max_{p(x)}r\,[H(x)-H(x/y)]
$$

（$r$：符号速率；$H(x/y)$：条件熵/疑义度。**对称二进制信道例**：$H(x)=1$，错传概率 $1/128$ 时 $H(x/y)\approx0.065$，$C=0.935$ b/符号。）

## 连续信道容量——香农公式

> [!info] Def 6 信道容量
> **信道容量**（channel capacity）$C$ 是信道在给定条件下能够**无差错传输的最大信息速率**（b/s）。

> [!important] 香农公式（Shannon formula，必背必考）
> 带宽有限、平均功率有限的高斯白噪声连续信道：
>
> $$
> C=B\log_2\!\left(1+\frac{S}{N}\right)=B\log_2\!\left(1+\frac{S}{n_0B}\right)\quad(\text{b/s})
> $$
>
> - $S$：信号平均功率（W）；$N=n_0B$：噪声功率（W）；$B$：带宽（Hz）

**三大结论**（简答题高频）：

1. **$B$ 与 $S/N$ 可互换**：增大 $B$ 可降低所需 $S/N$（扩频通信的理论根据，见 [[vault-notes/communication/12-orthogonal-codes-pn-sequences]]）；反之增大功率可节省带宽。
2. **增大 $S$ 或减小 $n_0$ 都可增大 $C$**；$S\to\infty$ 或 $n_0\to0$ 时 $C\to\infty$。
3. **带宽无限增大，容量有限**：

$$
\lim_{B\to\infty}C=\frac{S}{n_0}\log_2 e\approx1.44\frac{S}{n_0}\quad(\text{b/s})
$$

> [!note] 推论：香农下限
> 由 $C=B\log_2\left(1+\dfrac{E_b/T_b}{n_0B}\right)$ 令 $B\to\infty$，可得无误传输的极限：
> $$
> \frac{E_b}{n_0}\ge\ln2\approx0.693\quad(-1.6\,\text{dB})
> $$
> 即**每比特能量与噪声谱密度之比存在 $-1.6$ dB 的香农极限**——一切数字通信系统性能的终极标尺。

**香农公式还可写成**（用 $R_b$ 代 $C$ 讨论）：

$$
R_b\le B\log_2\left(1+\frac{S}{N}\right)\quad\Longrightarrow\quad\frac{R_b}{B}\le\log_2\left(1+\frac{S}{N}\right)
$$

**典型计算套路**：

- 已知 $C$、$B$ 求 $S/N$（dB）；
- $C$ 不变，$B$ 扩大 10 倍求新 $S/N$（注意 dB 换算：$S/N$ 数值 $=10^{\text{dB}/10}$）；
- $\eta=R_b/B\le\log_2(1+S/N)$ → 求极限频带利用率。

> [!tip] 本章收官
> 本章把"信道"拆成三件事：**传播媒介**（无线/有线）、**数学模型**（调制信道连续、编码信道离散）、**传输损伤**（恒参的幅频/相频畸变、随参的瑞利/弥散/选择性衰落、加性噪声）。最终用**香农公式**把这些因素收束为一个容量上限：$C=B\log_2(1+S/N)$。它既是第 5 章"带宽换信噪比"的理论依据，也是第 10–12 章编码与扩频的出发点。

## 本章知识地图

```
信道
├─ 无线信道（4.1）
│  ├─ 地波：VLF/LF，沿地面绕射，超远程
│  ├─ 天波：HF，电离层 F 层反射，有寂静区
│  └─ 视线传播：VHF 以上，d ≈ √(2rh)
├─ 有线信道（4.2）
│  └─ 明线 / 对称电缆 / 同轴电缆 / 光纤
├─ 数学模型（4.3）
│  ├─ 调制信道（连续）：e_o = f[e_i] + n
│  │   └─ 线性时不变：e_o = k(t)e_i + n
│  │        ├─ k(t) 恒定/缓变 → 恒参信道
│  │        └─ k(t) 随机快变 → 随参信道
│  └─ 编码信道（离散）：转移概率 P(y/x)，如 BSC
├─ 信道特性影响（4.4）
│  ├─ 恒参：幅频畸变（均衡器）／相频畸变（群时延，时延均衡器）
│  └─ 随参：瑞利衰落／频率弥散／频率选择性衰落（Δf = 1/τ_m）
├─ 噪声（4.5）
│  ├─ 人为 / 自然；脉冲 / 窄带 / 起伏
│  └─ 起伏噪声 = 高斯白噪声 → 窄带高斯，σ_n² = n₀B
└─ 信道容量（4.6）
   ├─ 离散：C_t = max r[H(x) − H(x/y)]
   ├─ 连续：C = B log₂(1 + S/N)
   ├─ 三大结论：B↔S/N 互换；S↑ 或 n₀↓ → C↑；B→∞ 时 C → 1.44 S/n₀
   └─ 香农极限：E_b/n₀ ≥ ln2（−1.6 dB）
```

## 关联

- 上一章：[[vault-notes/communication/03-random-processes]]
- 下一章：[[vault-notes/communication/05-analog-modulation]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 调制信道/编码信道 | [[vault-notes/communication/01-introduction]] 的数字通信模型；[[vault-notes/communication/06-digital-baseband]] 的基带信道 |
| 随参信道瑞利衰落 | [[vault-notes/communication/03-random-processes]] 的瑞利分布；[[vault-notes/communication/08-advanced-digital-modulation]] 的 OFDM 抗多径 |
| 频率选择性衰落、相关带宽 | [[vault-notes/communication/08-advanced-digital-modulation]] 的循环前缀；[[vault-notes/communication/12-orthogonal-codes-pn-sequences]] 的扩频 |
| 香农公式、$-1.6$ dB 极限 | [[vault-notes/communication/05-analog-modulation]] 的带宽换信噪比；[[vault-notes/communication/10-source-coding]] 的压缩极限；[[vault-notes/communication/11-error-control-coding]] 的编码增益 |

**通信方向应用**：

- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 5G 的带宽配置、MCS 与链路自适应就是香农公式的工程实现；毫米波信道建模对应本章的随参信道。
- [[vault-notes/math/probability/03-random-variables-distributions]] —— 瑞利/莱斯衰落的概率密度与本章 4.4 节直接对应。
- [[vault-notes/matlab/matlab-notes]] —— 用 MATLAB 画 $C$–$S/N$ 曲线、验证 $B\to\infty$ 时 $C$ 的极限，是最直观的数值实验。

**相关**：[[vault-notes/communication/03-random-processes]]｜[[vault-notes/communication/05-analog-modulation]]｜[[vault-notes/communication/08-advanced-digital-modulation]]
