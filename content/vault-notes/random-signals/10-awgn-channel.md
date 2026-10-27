---
title: "AWGN信道"
tags:
- 随机信号处理
- 10-通信系统应用
- 信道模型
- 噪声
type: concept
subjects:
- 随机信号处理
- 通信原理
domains:
- 通信系统
- 随机信号
status: learning
aliases: []
prerequisites: []
related: []
---

# AWGN 信道

> [!abstract] 这一节在讲什么
> AWGN 把通信信道压缩成一句话：接收信号等于发送信号加一个零均值、高斯、白噪声的过程。
> 核心结论：噪声双边谱密度是 $N_0/2$，带宽 $B$ 内的噪声功率是 $N_0B$，信噪比与 $E_b/N_0$ 之间差一个频谱效率因子。
> 用途：所有 BER 公式的默认背景，也是接收机灵敏度、链路预算和仿真噪声生成的起点。

## 一、AWGN 模型

> [!info] 定义
> **AWGN 信道**的输出是发送信号与零均值高斯白噪声之和：

$$
Y(t)=X(t)+N(t)
$$

其中 $N(t)$ 是零均值、宽平稳的高斯过程，与 $X(t)$ 独立，自相关与双边功率谱为

$$
R_N(\tau)=\frac{N_0}{2}\delta(\tau),\qquad S_N(\omega)=\frac{N_0}{2}
$$

"高斯"决定了只需要均值和方差就能描述它；"白"决定了功率谱在所有频率上一样平；两者合起来，任意两个不同时刻的样本互不相关，而高斯性又把不相关升级成独立。

离散化后，若以 $f_s$ 采样，样本 $N[k]$ 是独立同分布的高斯变量，方差为 $N_0f_s/2$。只有 $f_s=1$ 时这个数值才恰好等于 $N_0/2$，这点在仿真里最容易搞混。

> [!tip] 为什么 AWGN 这么好用
> 接收机前端的热噪声由大量独立的微小脉冲叠加而成，中心极限定理把它推向高斯；在感兴趣的频带内，热噪声的谱又足够平。于是"高斯 + 白"既接近物理，又让匹配滤波和误码率推导有闭式解。

> [!warning] AWGN 不是万能信道
> 它不包含多径、衰落、干扰和非线性。把多径信道当 AWGN 会明显低估误码率；把突发干扰当高斯噪声会算错所需的余量。遇到有色噪声时，正确做法是先白化，再套 AWGN 的结论。

## 二、双边 $N_0/2$ 与噪声功率

只取正频率会把功率算成一半，所以工程上必须说清楚单边还是双边。本库约定 $N_0$ 是单边谱密度（W/Hz），双边就是 $N_0/2$。带宽 $B$ 内的噪声功率为

$$
P_N=\frac{1}{2\pi}\int_{-2\pi B}^{2\pi B}\frac{N_0}{2}\,\mathrm d\omega=N_0B
$$

| 量 | 记号 | 数值 | 说明 |
| --- | --- | --- | --- |
| 谱密度（单边/双边） | $N_0$ / $N_0/2$ | W/Hz | 单边只计 $f\ge0$，双边正负各一份 |
| 带内噪声功率 | $N_0B$ | W | $B$ 为接收机噪声带宽 |
| 采样后样本方差 | $N_0f_s/2$ | W | $f_s=2B$ 时等于 $N_0B$ |

> [!warning] 3 dB 冤案
> 若某本书把 $N_0$ 定义成双边谱密度，那么它的噪声功率是 $2N_0B$，所有 SNR 都比本库的写法低 3 dB。对答案前先确认定义，不要只对公式形状。

复基带情形可以记成：一个复样本的噪声方差是 $N_0B$，其中 I、Q 两路各占 $N_0B/2$。这也解释了为什么复基带仿真里常给 I、Q 各加方差 $N_0/2$ 的实噪声。

> [!example] 1 MHz、NF = 5 dB 的噪声功率
> $N_0=-174$ dBm/Hz、$B=1$ MHz、$\mathrm{NF}=5$ dB 时噪声功率为 $-109$ dBm；若 $P_{rx}=-100$ dBm，则 $\mathrm{SNR}=9$ dB，比特率 500 kb/s 时 $E_b/N_0=12$ dB。

## 三、SNR 与 $E_b/N_0$

信噪比是带内信号功率与噪声功率之比：

$$
\mathrm{SNR}=\frac{P_s}{P_N}=\frac{P_s}{N_0B}
$$

每比特能量 $E_b=P_sT_b=P_s/R_b$，代入得

$$
\frac{E_b}{N_0}=\frac{P_s}{N_0R_b}=\mathrm{SNR}\cdot\frac{B}{R_b}
$$

也就是说，$E_b/N_0$ 是"按频谱效率归一化后的 SNR"。同样的带宽和 SNR，速率越高，每比特分到的能量越少。下表按基带等效噪声带宽计。

| 系统 | 带宽 $B$ | 频谱效率 $R_b/B$ | $E_b/N_0$ 与 SNR 的关系 |
| --- | --- | --- | --- |
| BPSK | $R_b$ | 1 | $E_b/N_0=\mathrm{SNR}$ |
| QPSK | $R_b/2$ | 2 | $E_b/N_0=\mathrm{SNR}-3$ dB |
| 16-QAM | $R_b/4$ | 4 | $E_b/N_0=\mathrm{SNR}-6$ dB |

> [!tip] 为什么误码率曲线横轴总用 $E_b/N_0$
> 它把"带宽换功率"的因素剥掉了，不同调制、不同码率可以在同一把尺子上比较。香农极限也写在这把尺子上：可靠传输要求 $E_b/N_0>\ln2\approx-1.59$ dB。

> [!warning] 仪表上的 SNR 不能直接当 $E_b/N_0$
> 频谱仪的 SNR 依赖分辨率带宽 RBW，换一个 RBW 读数就变。换算时必须知道实际信号带宽与比特率，否则会差出十几 dB。

## 四、与《4. 信道》对照

[[vault-notes/communication/04-channel]] 从物理传播讲到信道容量，本笔记只保留它最常用的一层抽象。两者的对应关系如下。

| 维度 | [[vault-notes/communication/04-channel|信道]] | 本笔记的 AWGN |
| --- | --- | --- |
| 噪声来源 | 起伏噪声（热噪声、散粒噪声） | 抽象为零均值高斯白噪声 |
| 频谱 | 关心频带内近似平坦 | 全频带平坦，双边 $N_0/2$ |
| 失真 | 幅频/相频畸变、多径、衰落 | 不考虑，只叠加噪声 |
| 关键参数 | 带宽、相干带宽、时延 | $N_0$、$B$、SNR |
| 典型用途 | 信道容量、香农公式 | BER、灵敏度、链路预算 |

《4. 信道》指出起伏噪声由大量独立微小脉冲叠加，因而近似高斯；又指出在通信频带内它的谱近似平坦，因而近似白。这两条近似合起来就是 AWGN。恒参信道加 AWGN 是最基础的基线模型；随参信道的衰落必须另外建模，不能塞进"高斯白"里。

## 关联

- 上一节：[[vault-notes/random-signals/09-adaptive-filter-rls]]（09 末篇）
- 下一节：[[vault-notes/random-signals/10-adc-sampling-quantization-noise]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/04-channel]]、[[vault-notes/communication/03-random-processes]]、[[vault-notes/communication/09-optimal-reception]]
