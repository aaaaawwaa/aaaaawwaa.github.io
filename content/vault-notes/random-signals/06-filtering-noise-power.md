---
title: "滤波与噪声功率分析"
tags:
- 随机信号处理
- 06-随机信号通过系统
- 噪声带宽
- 信噪比
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

# 滤波与噪声功率分析

> [!abstract] 这一节在讲什么
> 滤波器对信号和噪声一起作用，输出信噪比取决于两者的谱形与滤波器带宽，而不只取决于滤波器增益。
> 本节用 $P_n=\frac{1}{2\pi}\int\lvert H\rvert^2S_n\,\mathrm{d}\omega$ 计算输出噪声功率，定义噪声等效带宽 $B_n$，比较 $B_n$ 与 3 dB 带宽，并用 RC 低通、理想低通、匹配滤波三个例子说明 SNR 怎么算。
> 这是 [[vault-notes/random-signals/06-input-output-psd-relation]] 在接收机前端分析中的落地。

## 一、输出噪声功率

> [!info] 定义 1 输出噪声功率
> 设滤波器频率响应为 $H(\omega)$，输入噪声功率谱为 $S_n(\omega)$，则输出噪声功率为
> $$
> P_n=\frac{1}{2\pi}\int_{-\infty}^{\infty}\lvert H(\omega)\rvert^2S_n(\omega)\,\mathrm{d}\omega=\int_{-\infty}^{\infty}\lvert H(f)\rvert^2S_n(f)\,\mathrm{d}f
> $$
> 离散形式为 $P_n=\frac{1}{2\pi}\int_{-\pi}^{\pi}\lvert H(e^{j\omega})\rvert^2S_n(e^{j\omega})\,\mathrm{d}\omega$。

这个式子就是"输出功率谱积分"，没有新物理，只是把 [[vault-notes/random-signals/06-input-output-psd-relation]] 的 $S_Y=\lvert H\rvert^2S_X$ 积分。

> [!tip] 信号与噪声分开算
> 线性系统对信号和噪声分别作用，输出总功率是两者之和（假设独立）。所以可以分别算 $P_s$ 与 $P_n$，再求 SNR；不要先叠加波形再算功率，除非要处理信号与噪声的相关项。

## 二、噪声等效带宽

> [!info] 定义 2 噪声等效带宽
> 对基带滤波器（最大增益在 0 Hz），
> $$
> B_n=\frac{1}{\lvert H(0)\rvert^2}\int_0^\infty\lvert H(f)\rvert^2\,\mathrm{d}f
> $$
> 对中心频率 $f_0$ 的带通滤波器，把 $H(0)$ 换成 $H(f_0)$。若输入为单边谱 $N_0$ 的白噪声，则
> $$
> P_n=N_0B_n\lvert H(f_0)\rvert^2
> $$

$B_n$ 的物理意义：用一个高为 $\lvert H(f_0)\rvert^2$、宽为 $B_n$ 的矩形滤波器替代实际滤波器，通过的噪声功率相同。

> [!warning] $B_n$ 不是 3 dB 带宽
> 3 dB 带宽描述幅度下降到 $1/\sqrt{2}$ 的频率范围；噪声带宽描述"能通过多少白噪声功率"。一阶 RC 的 $B_n$ 比 $B_{3\mathrm{dB}}$ 大 57%，窄带高阶滤波器的两者才接近。把 $B_n$ 当成 $B_{3\mathrm{dB}}$ 会低估噪声功率。

| 滤波器 | $B_{3\mathrm{dB}}$ | $B_n$ | 比值 |
| --- | --- | --- | --- |
| 理想低通 | $B$ | $B$ | 1 |
| 一阶 RC | $\frac{1}{2\pi RC}$ | $\frac{1}{4RC}$ | $\frac{\pi}{2}\approx1.571$ |
| 二阶巴特沃斯 | $B_3$ | $1.111B_3$ | 1.111 |
| 高阶巴特沃斯 | $B_3$ | 接近 $B_3$ | $\to 1$ |

> [!example] 例 1 RC 低通的噪声功率
> 取 $R=1\,\mathrm{k}\Omega$、$C=1\,\mu\mathrm{F}$，则 $RC=1\,\mathrm{ms}$，$B_{3\mathrm{dB}}\approx159\,\mathrm{Hz}$，$B_n=250\,\mathrm{Hz}$。若 $N_0=10^{-6}\,\mathrm{V^2/Hz}$，则
> $$
> P_n=N_0B_n=2.5\times10^{-4}\,\mathrm{V^2},\qquad \sqrt{P_n}\approx15.8\,\mathrm{mV_{rms}}
> $$

## 三、信噪比与滤波改善

> [!info] 定义 3 输出信噪比
> $$
> \mathrm{SNR}_{\mathrm{out}}=\frac{P_s}{P_n}
> $$
> 若信号是幅度 $A$、频率 $f_0$ 的正弦，噪声是带内单边谱 $N_0$ 的白噪声，则
> $$
> P_s=\frac{A^2}{2}\lvert H(f_0)\rvert^2,\qquad P_n=N_0B_n\lvert H(f_0)\rvert^2
> $$
> 于是
> $$
> \mathrm{SNR}_{\mathrm{out}}=\frac{A^2}{2N_0B_n}
> $$

注意 $H(f_0)$ 被约掉了：对白噪声，滤波器增益同时放大信号与噪声，真正决定 SNR 的是**噪声带宽**。

> [!tip] 滤波什么时候能改善 SNR
> 只有当信号与噪声的谱形不同，或者滤波器能压低噪声所占频段而保留信号频段时，SNR 才会改善。若信号与噪声都是白的、且占据同一频带，任何线性滤波器对两者的功率乘同一个 $\lvert H\rvert^2$，SNR 不变。

> [!example] 例 2 RC 低通对正弦加白噪声
> 输入 $s(t)=A\cos(2\pi f_0t)$ 加单边谱 $N_0$ 的白噪声，$f_0\ll1/(2\pi RC)$ 时 $\lvert H(f_0)\rvert\approx1$。输出
> $$
> \mathrm{SNR}_{\mathrm{out}}\approx\frac{A^2}{2N_0B_n}=\frac{A^2}{2N_0\cdot\frac{1}{4RC}}=\frac{2A^2RC}{N_0}
> $$
> 时间常数越大，噪声带宽越窄，SNR 越高；但信号的高频分量也被削弱，宽带信号不能这样换。

## 四、理想低通与匹配滤波

> [!example] 例 3 理想低通
> 信号带宽 $B_s$，噪声单边谱 $N_0$。若滤波器带宽 $B\ge B_s$，则 $P_s$ 不变，$P_n=N_0B$。把 $B$ 缩到 $B_s$ 可使 SNR 提高 $B/B_s$ 倍；再窄就会削掉信号功率，SNR 反而下降。最优带宽通常略大于信号带宽。

> [!example] 例 4 匹配滤波
> 对已知波形 $s(t)$、能量 $E=\int s^2(t)\,\mathrm{d}t$，在白噪声（单边谱 $N_0$）中输入，匹配滤波器
> $$
> h(t)=s(T-t),\qquad H(\omega)=S^*(\omega)e^{-j\omega T}
> $$
> 在 $t=T$ 时刻输出信号功率 $E^2$，噪声功率 $\frac{N_0}{2}E$，峰值信噪比
> $$
> \mathrm{SNR}_{\max}=\frac{2E}{N_0}
> $$
> 这是所有线性滤波器中能达到的最大输出峰值 SNR。匹配滤波不追求"窄带宽"，而是让滤波器与信号波形匹配；它的噪声带宽由信号谱决定，通常不等于 $B_{3\mathrm{dB}}$。

| 场景 | 噪声功率 | 峰值/平均 SNR | 关键量 |
| --- | --- | --- | --- |
| RC 低通 + 正弦 | $N_0/(4RC)$ | $2A^2RC/N_0$ | 时间常数 $RC$ |
| 理想低通 + 带限信号 | $N_0B$ | $P_s/(N_0B)$ | 带宽 $B$ |
| 匹配滤波 + 已知波形 | $\frac{N_0}{2}E$ | $2E/N_0$ | 信号能量 $E$ |

> [!warning] 匹配滤波的 SNR 是峰值 SNR
> $2E/N_0$ 是采样时刻的峰值功率比，不是输出平均功率比。比较不同滤波器时，要说明比的是峰值 SNR、平均 SNR 还是某时刻的瞬时 SNR。

> [!warning] 有色噪声不能只用 $B_n$
> 若噪声谱在通带内不平坦，$P_n=N_0B_n$ 不成立，必须回到积分 $\int S_n(f)\lvert H(f)\rvert^2\,\mathrm{d}f$。预白化滤波器可以把有色噪声变白，但会改变信号波形，需要与匹配滤波联合设计。

## 关联

- 上一节：[[vault-notes/random-signals/06-input-output-psd-relation]]
- 下一节：[[vault-notes/random-signals/07-estimator-bias-variance]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/09-optimal-reception]]、[[vault-notes/communication/04-channel]]、[[vault-notes/dsp/05-filter-structures]]、[[vault-notes/matlab/matlab-notes]]
