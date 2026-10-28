---
title: "白噪声与有色噪声频谱"
tags:
- 随机信号处理
- 05-随机信号的频域分析
- 白噪声
- 有色噪声
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

# 白噪声与有色噪声频谱

> [!abstract] 这一节在讲什么
> 白噪声是"功率谱在所有频率上一样平"的理想模型，有色噪声则是谱形不为常数的噪声。
> 本节给出连续/离散白噪声、带限白噪声、AR(1) 有色噪声的谱与相关函数，并定义噪声等效带宽 $B_n$。
> 这些模型是 [[vault-notes/random-signals/03-gaussian-process-white-noise]] 的频域补充，也是 [[vault-notes/random-signals/06-filtering-noise-power]] 中计算噪声功率的起点。

## 一、连续白噪声与离散白噪声

> [!info] 定义 1 连续时间白噪声
> 若宽平稳过程 $N(t)$ 的自相关为
> $$
> R_N(\tau)=\frac{N_0}{2}\delta(\tau)
> $$
> 则称其为**白噪声**，其双边功率谱为
> $$
> S_N(\omega)=\frac{N_0}{2}\quad(\text{双边}),\qquad S_N^+(f)=N_0\quad(\text{单边})
> $$

"白"是光学借词：所有频率功率相同，像白光包含所有颜色。要点是：

- 不同时刻 $t_1\ne t_2$ 的 $N(t_1)$ 与 $N(t_2)$ 不相关；对零均值高斯白噪声即独立；
- 理想白噪声功率发散，因为带宽无限；物理上不存在，只在被系统限带后才有有限功率；
- 白噪声不一定是高斯的。高斯性约束幅度分布，白性约束二阶谱，两者独立。

> [!info] 定义 2 离散时间白噪声
> 若序列 $N[n]$ 满足
> $$
> R_N[m]=\sigma^2\delta[m],\qquad S_N(e^{j\omega})=\sigma^2,\quad\lvert\omega\rvert\le\pi
> $$
> 则称为离散白噪声。它在 $[-\pi,\pi]$ 上谱平坦，平均功率为 $\sigma^2$。

离散白噪声的"白"只相对于奈奎斯特区间。采样率越高，同样的 $\sigma^2$ 对应越宽的模拟带宽，因此不能把离散的 $\sigma^2$ 直接当成连续谱密度 $N_0/2$。

| 类型 | 自相关 | 功率谱 | 平均功率 |
| --- | --- | --- | --- |
| 连续白噪声 | $\frac{N_0}{2}\delta(\tau)$ | $\frac{N_0}{2}$（双边） | 发散 |
| 带限白噪声 | $N_0B\,\mathrm{sinc}(2B\tau)$ | $\frac{N_0}{2}$（$\lvert f\rvert\le B$） | $N_0B$ |
| 离散白噪声 | $\sigma^2\delta[m]$ | $\sigma^2$（$\lvert\omega\rvert\le\pi$） | $\sigma^2$ |
| AR(1) | $\frac{\sigma_W^2}{1-a^2}a^{\lvert m\rvert}$ | $\frac{\sigma_W^2}{1-2a\cos\omega+a^2}$ | $\frac{\sigma_W^2}{1-a^2}$ |

## 二、带限白噪声

理想白噪声经过理想低通或带通后，变成**带限白噪声**。以基带 $[0,B]$ 为例：

$$
S_N(f)=\frac{N_0}{2}\ (\lvert f\rvert\le B),\qquad R_N(\tau)=N_0B\,\mathrm{sinc}(2B\tau)
$$

其中 $\mathrm{sinc}(x)=\sin(\pi x)/(\pi x)$。相关函数在 $\tau=k/(2B)$ 处过零，说明以奈奎斯特速率采样得到的样本互不相关。

> [!tip] 为什么工程上总说"白噪声功率是 $N_0B$"
> 因为任何真实接收机都有带宽 $B$。理想白噪声通过带宽 $B$ 的滤波器后，功率从发散变成有限的 $N_0B$。$N_0/2$ 是密度，$N_0B$ 是落在带内的功率，两者相差一个带宽因子。

## 三、有色噪声与 AR(1)

> [!info] 定义 3 有色噪声
> 功率谱不是常数的噪声称为**有色噪声**。只要 $S_N(\omega)$ 随频率变化，噪声就是有色的；"有色"只涉及二阶谱形，不涉及幅度分布。

最常用的模型是一阶自回归 AR(1)：

$$
X[n]=aX[n-1]+W[n],\qquad \lvert a\rvert<1,\quad W[n]\sim\mathrm{WN}(0,\sigma_W^2)
$$

其相关函数与谱为

$$
R_X[m]=\frac{\sigma_W^2}{1-a^2}a^{\lvert m\rvert},\qquad S_X(e^{j\omega})=\frac{\sigma_W^2}{1-2a\cos\omega+a^2}
$$

| 参数 | 谱形 | 相关时间 | 典型场景 |
| --- | --- | --- | --- |
| $a=0$ | 平坦，退化为白噪声 | 0 | 理想白噪声 |
| $0<a<1$ | 低通，峰值在 $\omega=0$ | 随 $a$ 增大 | 慢变干扰、衰落 |
| $-1<a<0$ | 高通，峰值在 $\omega=\pi$ | 随 $\lvert a\rvert$ 增大 | 差分信号、交流耦合 |

> [!example] 例 1 $a=0.9$ 的 AR(1)
> 取 $\sigma_W^2=1$，则 $R_X[0]=1/(1-0.81)\approx 5.26$，谱峰 $S_X(0)=1/(1-0.9)^2=100$，而 $\omega=\pi$ 处只有 $1/(1+0.9)^2\approx 0.277$。能量高度集中在低频。

> [!warning] 白噪声与高斯噪声不是一回事
> "高斯"约束一维/联合分布，"白"约束自相关或谱。高斯白噪声两者兼有；高斯有色噪声是高斯但非白；均匀白噪声是白但非高斯。做题时先看题目给的是分布还是相关函数。

## 四、噪声等效带宽

> [!info] 定义 4 噪声等效带宽
> 设滤波器 $H(\omega)$ 在基带的最大幅度在 $\omega=0$，定义**噪声等效带宽**
> $$
> B_n=\frac{1}{\lvert H(0)\rvert^2}\int_0^\infty\lvert H(f)\rvert^2\,\mathrm{d}f\quad(\text{Hz})
> $$
> 对中心频率 $f_0$ 的带通滤波器，把 $H(0)$ 换成 $H(f_0)$，积分仍取正频率。

它的含义是：一个高度为 $\lvert H(0)\rvert^2$、宽度为 $B_n$ 的理想矩形滤波器，通过单边谱为 $N_0$ 的白噪声时产生与实际滤波器相同的噪声功率。

$$
P_n=N_0B_n\lvert H(0)\rvert^2
$$

> [!example] 例 2 RC 低通的噪声带宽
> $H(f)=\frac{1}{1+j2\pi fRC}$，则
> $$
> \int_0^\infty\lvert H(f)\rvert^2\,\mathrm{d}f=\int_0^\infty\frac{\mathrm{d}f}{1+(2\pi fRC)^2}=\frac{1}{4RC}
> $$
> 所以 $B_n=\frac{1}{4RC}$，而 3 dB 带宽 $B_{3\mathrm{dB}}=\frac{1}{2\pi RC}$，两者之比为 $\pi/2\approx1.571$。

| 滤波器 | $B_{3\mathrm{dB}}$ | $B_n$ | $B_n/B_{3\mathrm{dB}}$ |
| --- | --- | --- | --- |
| 理想低通 | $B$ | $B$ | 1 |
| 一阶 RC | $\frac{1}{2\pi RC}$ | $\frac{1}{4RC}$ | $\frac{\pi}{2}\approx1.571$ |
| 二阶巴特沃斯 | $B_3$ | $1.111B_3$ | 1.111 |

> [!warning] $B_n$ 只对白噪声好用
> 若噪声已经是有色的，$P_n=\int_0^\infty S_N(f)\lvert H(f)\rvert^2\,\mathrm{d}f$ 必须老老实实积分，不能用一个 $B_n$ 乘 $N_0$ 代替。$B_n$ 的定义把噪声谱假设成了常数。

## 关联

- 上一节：[[vault-notes/random-signals/05-cross-power-spectral-density]]
- 下一节：[[vault-notes/random-signals/05-psd-numerical-estimation]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/04-channel]]、[[vault-notes/communication/03-random-processes]]、[[vault-notes/dsp/01-discrete-time-systems]]、[[vault-notes/matlab/matlab-notes]]
