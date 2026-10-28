---
title: 随机信号通过线性系统
description: 从卷积模型出发推导输出均值、自相关与功率谱关系 S_Y=|H|²S_X，并计算噪声功率、噪声带宽、SNR、ADC 量化噪声与 AWGN 信道指标。
tags:
  - signal-processing
  - random-processes
  - lti-systems
  - noise
---

滤波器、放大器、ADC 和信道都是“系统”。确定性信号经过系统只需做一次卷积；随机信号则要问：输出的均值、相关函数和功率谱如何由输入与系统决定？本文从最一般的卷积模型出发，依次得到时域与频域的四条核心关系，再把它们用到噪声功率、信噪比、ADC 量化噪声与 AWGN 信道上。前置是 [[signal-processing/random-processes|随机过程与随机信号]] 与 [[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]。

## 输入输出模型与输出平稳的条件

设系统冲激响应为 $h(t)$（离散为 $h[n]$），输入 $X(t)$ 是随机过程，输出按卷积定义：

$$
Y(t)=\int_{-\infty}^{\infty}h(\tau)X(t-\tau)\,\mathrm{d}t=(h*X)(t)
$$

对每个固定 $t$，$Y(t)$ 都是输入样本函数的线性泛函，因此仍是随机变量。积分应按**均方意义**理解：先用有限支撑近似，再取均方极限。

输出是否宽平稳，取决于四个条件：

| 条件 | 作用 | 不满足的后果 |
| --- | --- | --- |
| $h$ 确定且线性时不变 | 可用卷积与频响描述 | 时变系统需 $h(t,\tau)$，频率之间会搬移 |
| $h$ 绝对可积（BIBO 稳定） | 输出二阶矩有限 | 积分器、不稳定系统输出可能发散 |
| 输入 $X$ 宽平稳且二阶矩有限 | 均值、相关不随 $t$ 变 | 非平稳输入使输出非平稳 |
| 零初始状态、输入从 $-\infty$ 作用 | 输出只由输入决定 | 开机暂态造成短时非平稳 |

因果性与稳定性是两件事：因果（$h(t)=0,\ t<0$）只影响能否实时实现，稳定（$\int\lvert h\rvert<\infty$）才保证输出宽平稳。一个因果但不稳定的系统 $h(t)=e^{t}u(t)$ 仍会让输出发散。

> [!example] 积分器把白噪声变成随机游走
> 设 $X(t)$ 为零均值白噪声（双边谱 $N_0/2$），$h(t)=u(t)$，从 $t=0$ 接入，则 $Y(t)=\int_0^tX(s)\,\mathrm{d}s$。虽然有 $E[Y(t)]=0$，但
> $$
> \mathrm{Var}\big(Y(t)\big)=\frac{N_0}{2}t
> $$
> 随 $t$ 增长，$Y(t)$ 不是宽平稳的。原因正是 $h=u(t)$ 不绝对可积，不满足上述条件。

## 输出均值、自相关与互相关

**均值。** 期望可以穿过卷积，因为卷积是线性运算：

$$
\mu_Y=E[Y(t)]=\mu_X\int_{-\infty}^{\infty}h(\tau)\,\mathrm{d}\tau=\mu_XH(0)
$$

$H(0)$ 就是直流增益：低通 $H(0)=1$，均值原样通过；高通 $H(0)=0$，输出均值为零；放大器把均值放大 $K$ 倍。离散系统对应 $H(e^{j0})=H(1)$，不要与奈奎斯特频率处的 $H(e^{j\pi})$ 混淆。

**自相关。** 把两个时刻的卷积展开、期望穿过积分，可得

$$
R_Y(\tau)=R_X(\tau)*h(\tau)*h(-\tau)=R_X(\tau)*g_h(\tau)
$$

其中 $g_h(\tau)=h(\tau)*h(-\tau)$ 是冲激响应的**确定性自相关**，描述系统的“记忆形状”：$g_h$ 越宽，输出相关时间越长。去均值后的自协方差满足同一关系：

$$
C_Y(\tau)=C_X(\tau)*h(\tau)*h(-\tau),\qquad \sigma_Y^2=C_Y(0)=R_Y(0)-\lvert\mu_Y\rvert^2
$$

**互相关。** 输入输出的互相关只要和 $h$ 卷一次：

$$
R_{XY}(\tau)=E\big[X(t)Y(t+\tau)\big]=R_X(\tau)*h(\tau),\qquad R_{YX}(\tau)=R_{XY}(-\tau)
$$

> [!example] 滑动平均：功率降了 $M$ 倍，但输出不再白
> $h[n]=\frac{1}{M}\sum_{k=0}^{M-1}\delta[n-k]$，输入方差 $\sigma^2$ 的离散白噪声，则
> $$
> R_Y[m]=\begin{cases}\dfrac{\sigma^2(M-\lvert m\rvert)}{M^2},&\lvert m\rvert<M\\ 0,&\lvert m\rvert\ge M\end{cases}
> $$
> 输出功率 $\sigma^2/M$，相邻样本相关。同时 $R_{XY}[m]=\sigma^2/M$（$0\le m\le M-1$），形状就是 $h$ 本身——这说明白噪声激励下，输入输出互相关可以直接辨识系统冲激响应。

> [!example] RC 低通 + 白噪声
> $h(t)=\frac{1}{RC}e^{-t/(RC)}u(t)$，$R_X(\tau)=\frac{N_0}{2}\delta(\tau)$。冲激与 $g_h$ 卷积直接取出被积函数：
> $$
> R_Y(\tau)=\frac{N_0}{2}g_h(\tau)=\frac{N_0}{4RC}e^{-\lvert\tau\rvert/(RC)},\qquad R_Y(0)=\frac{N_0}{4RC}
> $$
> 互相关 $R_{XY}(\tau)=\frac{N_0}{2}h(\tau)=\frac{N_0}{2RC}e^{-\tau/(RC)}u(\tau)$ 是单边指数：因果系统的输出只与“过去”的输入相关。

## 频域：$S_Y=\lvert H\rvert^2S_X$ 与互谱

对 $R_Y=R_X*h*h(-\cdot)$ 两边做傅里叶变换，利用 $h(-t)\leftrightarrow H^*(\omega)$ 与卷积定理，立刻得到

$$
S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega),\qquad S_Y(e^{j\omega})=\lvert H(e^{j\omega})\rvert^2S_X(e^{j\omega})
$$

为什么是模平方？因为功率谱是功率的密度，不是幅度：系统对幅度乘 $\lvert H\rvert$，对功率就乘 $\lvert H\rvert^2$，相位在平方后消失。**PSD 只记得系统的幅频特性，不记得相频特性。**

互谱则保留相位：

$$
S_{XY}(\omega)=H(\omega)S_X(\omega),\qquad S_{YX}(\omega)=H^*(\omega)S_X(\omega)
$$

于是“互谱除以自谱”可以估计频响 $\hat H=S_{XY}/S_X$，前提是输出不含独立噪声且相干函数接近 $1$。

| 关系 | 时域 | 频域 | 白噪声输入 |
| --- | --- | --- | --- |
| 输出均值 | $\mu_XH(0)$ | 同左 | $0$ |
| 输出自相关 | $R_X*h*h(-\cdot)$ | $\lvert H\rvert^2S_X$ | $\frac{N_0}{2}g_h$ |
| 输入输出互相关 | $R_X*h$ | $HS_X$ | $\frac{N_0}{2}h$ |
| 输出功率 | $R_Y(0)$ | $\frac{1}{2\pi}\int\lvert H\rvert^2S_X\,\mathrm{d}\omega$ | 见下节 |

> [!warning] 三条使用边界
> 1. 只对**稳定 LTI** 系统成立；时变、非线性、采样与自适应系统破坏了频率之间的独立性，必须回到 $R_Y(t_1,t_2)$。
> 2. 输入输出必须联合宽平稳；开机的暂态段不能用。
> 3. 式子只对双边谱成立；换成单边谱要相应调整系数。

## 噪声功率与噪声等效带宽

输出噪声功率就是输出谱的积分，没有新物理：

$$
P_n=\frac{1}{2\pi}\int_{-\infty}^{\infty}\lvert H(\omega)\rvert^2S_n(\omega)\,\mathrm{d}\omega=\int_{-\infty}^{\infty}\lvert H(f)\rvert^2S_n(f)\,\mathrm{d}f
$$

对单边谱为 $N_0$ 的白噪声输入，$P_n=N_0\int_0^\infty\lvert H(f)\rvert^2\,\mathrm{d}f$。若滤波器基带最大增益在 $0$ Hz，定义**噪声等效带宽**

$$
B_n=\frac{1}{\lvert H(0)\rvert^2}\int_0^\infty\lvert H(f)\rvert^2\,\mathrm{d}f
$$

使一个高 $\lvert H(0)\rvert^2$、宽 $B_n$ 的矩形滤波器产生相同噪声功率：

$$
P_n=N_0B_n\lvert H(0)\rvert^2
$$

带通滤波器把 $H(0)$ 换成中心峰值增益 $H(f_0)$。**$B_n$ 不是 3 dB 带宽**：3 dB 带宽看幅度下降到 $1/\sqrt2$ 的范围，噪声带宽看“能通过多少白噪声功率”。一阶 RC 的 $B_n=1/(4RC)$，而 $B_{3\mathrm{dB}}=1/(2\pi RC)$，比值 $\pi/2\approx1.571$；二阶巴特沃斯约 $1.111B_3$，高阶才趋近 1。

| 滤波器 | $B_{3\mathrm{dB}}$ | $B_n$ | 比值 |
| --- | --- | --- | --- |
| 理想低通 | $B$ | $B$ | 1 |
| 一阶 RC | $\frac{1}{2\pi RC}$ | $\frac{1}{4RC}$ | $1.571$ |
| 二阶巴特沃斯 | $B_3$ | $1.111B_3$ | $1.111$ |

> [!example] RC 低通的噪声功率
> 取 $R=1\ \mathrm{k\Omega}$、$C=1\ \mathrm{\mu F}$，则 $RC=1\ \mathrm{ms}$，$B_{3\mathrm{dB}}\approx159\ \mathrm{Hz}$，$B_n=250\ \mathrm{Hz}$。若 $N_0=10^{-6}\ \mathrm{V^2/Hz}$，则 $P_n=N_0B_n=2.5\times10^{-4}\ \mathrm{V^2}$，$\sqrt{P_n}\approx15.8\ \mathrm{mV_{rms}}$。

## 信噪比与“滤波能改善多少”

线性系统对信号与噪声分别作用（假设独立），输出信噪比为

$$
\mathrm{SNR}_{\mathrm{out}}=\frac{P_s}{P_n}
$$

若信号是幅度 $A$、频率 $f_0$ 的正弦，噪声是带内单边谱 $N_0$ 的白噪声，则

$$
P_s=\frac{A^2}{2}\lvert H(f_0)\rvert^2,\qquad P_n=N_0B_n\lvert H(f_0)\rvert^2,\qquad
\mathrm{SNR}_{\mathrm{out}}=\frac{A^2}{2N_0B_n}
$$

注意滤波器增益 $H(f_0)$ 被约掉了：对白噪声，增益同时放大信号与噪声，真正决定 SNR 的是**噪声带宽**。由此也能看出滤波改善 SNR 的前提：信号与噪声的谱形必须不同，或滤波器能压低噪声频段而保留信号频段。若两者都是白的且占据同一频带，任何线性滤波器对它们的功率乘同一个 $\lvert H\rvert^2$，SNR 不变。

理想低通的例子最能说明折中：信号带宽 $B_s$，噪声单边谱 $N_0$。滤波器带宽 $B\ge B_s$ 时 $P_s$ 不变、$P_n=N_0B$，把 $B$ 缩到 $B_s$ 可把 SNR 提高 $B/B_s$ 倍；再窄就会削掉信号功率，SNR 反而下降。最优带宽通常略大于信号带宽。

匹配滤波是另一条路线：对已知波形 $s(t)$、能量 $E=\int s^2(t)\,\mathrm{d}t$，在白噪声中取 $h(t)=s(T-t)$，采样时刻的峰值信噪比达到

$$
\mathrm{SNR}_{\max}=\frac{2E}{N_0}
$$

它是所有线性滤波器能达到的最大**峰值** SNR，不追求窄带宽，而是让滤波器与波形匹配。这一条在 [[signal-processing/signal-detection-theory|信号检测理论]] 中会从判决角度重新推导。

## ADC 采样与量化噪声

ADC 的误差来自两个完全不同的环节：**采样**造成混叠，**量化**引入噪声。

**采样。** 若信号最高频率 $f_{\max}$，以 $f_s>2f_{\max}$ 采样可无失真恢复；采样在频域上把频谱以 $f_s$ 为周期复制，副本不重叠才能用理想低通取出原谱。混叠一旦发生，数字滤波器无法补救，所以抗混叠模拟低通必须在 ADC **之前**。过采样可以放宽模拟滤波器的过渡带要求，但不能取消它。

**量化。** 设满量程 $[-A,A]$、位数 $n$，量化台阶

$$
\Delta=\frac{2A}{2^n}
$$

若误差在 $[-\Delta/2,\Delta/2]$ 内均匀分布、与信号独立、样本间不相关（对应“不过载、量化足够细、信号足够忙”三条工程条件），则

$$
\sigma_q^2=\frac{\Delta^2}{12}=\frac{A^2}{3\cdot2^{2n}}
$$

对满量程正弦 $x(t)=A\sin\omega_0t$，信号功率 $A^2/2$，于是

$$
\mathrm{SQNR}=1.5\cdot2^{2n},\qquad \mathrm{SQNR_{dB}}=6.02n+1.76\ \mathrm{dB}
$$

这就是“每增加 1 位改善约 6 dB”的来源；$n=12$ 时约 $74\ \mathrm{dB}$，$n=16$ 时约 $98\ \mathrm{dB}$。模型失效的两种典型情形是**过载**（削顶产生强失真）和**信号与台阶同步**（直流或小周期信号只落在少数码上，误差变成谐波与死区，而非白噪声）。

**过采样。** 定义 $\mathrm{OSR}=f_s/(2B)$。若量化噪声在 $[-f_s/2,f_s/2]$ 近似均匀，带内只占 $1/\mathrm{OSR}$，因此

$$
\mathrm{SQNR_{dB}}\approx6.02n+1.76+10\log_{10}\mathrm{OSR}
$$

采样率每翻一倍多得 3 dB，即“半位”。若在量化前做噪声整形，$L$ 阶 $\Sigma\Delta$ 调制每翻倍可得 $6L+3$ dB（一阶 9 dB），这才让 1 位 ADC 做到 16 位以上的有效精度。

> [!warning] $6.02n+1.76$ 是上限
> 它假设满量程正弦、理想均匀量化、无 dither、无时钟抖动、无前端噪声。实际用 SINAD 衡量，有效位数
> $$
> \mathrm{ENOB}=\frac{\mathrm{SINAD}-1.76}{6.02}
> $$
> 常比标称位数少 1–2 位。例如 12 位 ADC 的理论 SQNR 约 74 dB，输入峰均比 10 dB 的 OFDM 信号要留 10 dB 余量，再扣时钟抖动与前端噪声，ENOB 往往只有 10 位左右。

Dither 是在量化前故意加约 1–2 LSB 的噪声，使量化误差与信号去相关，牺牲少量 SNR 换取消除死区与信号相关谐波；采样后离散噪声样本方差与连续谱密度的换算见下节。

## AWGN 信道、SNR 与 $E_b/N_0$

AWGN 把信道压缩成一句话：接收信号等于发送信号加一个零均值、高斯、白的噪声过程，

$$
Y(t)=X(t)+N(t),\qquad R_N(\tau)=\frac{N_0}{2}\delta(\tau),\qquad S_N(\omega)=\frac{N_0}{2}
$$

“高斯”使均值和方差就足够描述它；“白”使功率谱处处平坦；两者合起来，不同时刻的样本不相关，而高斯性把不相关升级为独立。物理依据是：接收机前端热噪声由大量独立微小脉冲叠加，中心极限定理推向高斯；在感兴趣频带内谱足够平。

**单边与双边。** 本库约定 $N_0$ 是单边谱密度，双边为 $N_0/2$。带宽 $B$ 内的噪声功率为

$$
P_N=\frac{1}{2\pi}\int_{-2\pi B}^{2\pi B}\frac{N_0}{2}\,\mathrm{d}\omega=N_0B
$$

以 $f_s$ 采样后，样本方差为 $N_0f_s/2$；只有 $f_s=2B$ 时才等于 $N_0B$。复基带一个复样本的噪声方差为 $N_0B$，其中 I、Q 各 $N_0B/2$，这解释了仿真里“I、Q 各加方差 $N_0/2$ 的实噪声”的写法。若把 $N_0$ 当成双边谱，所有 SNR 都会比本库写法低 3 dB——对答案前先确认定义。

**SNR 与 $E_b/N_0$。** 带内信噪比 $\mathrm{SNR}=P_s/(N_0B)$；每比特能量 $E_b=P_sT_b=P_s/R_b$，代入得

$$
\frac{E_b}{N_0}=\frac{P_s}{N_0R_b}=\mathrm{SNR}\cdot\frac{B}{R_b}
$$

即 $E_b/N_0$ 是按频谱效率归一化后的 SNR。同样带宽与 SNR 下，速率越高每比特能量越少：BPSK 的 $B=R_b$ 时 $E_b/N_0=\mathrm{SNR}$；QPSK 的 $B=R_b/2$ 时低 3 dB；16-QAM 的 $B=R_b/4$ 时低 6 dB。误码率曲线横轴用 $E_b/N_0$，正是为了剥掉“带宽换功率”的因素。

**噪声系数与链路预算。** 噪声系数 $F=\mathrm{SNR_{in}}/\mathrm{SNR_{out}}\ge1$，$\mathrm{NF}=10\log_{10}F$；无源衰减器的 $F$ 等于其损耗。多级级联用 Friis 公式

$$
F=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1G_2}+\cdots
$$

后级噪声被前级增益除掉，所以第一级 LNA 决定成败。链路预算把各项换成 dB 后相加：

$$
N_{\mathrm{dBm}}=-174+10\log_{10}B+\mathrm{NF},\qquad
\mathrm{SNR_{dB}}=P_{rx,\mathrm{dBm}}-N_{\mathrm{dBm}},\qquad
\left.\frac{E_b}{N_0}\right|_{\mathrm{dB}}=\mathrm{SNR_{dB}}+10\log_{10}\frac{B}{R_b}
$$

> [!example] 一个完整链路
> $P_{tx}=+20\ \mathrm{dBm}$，收发天线合计 $+10\ \mathrm{dB}$，路径损耗 $-120\ \mathrm{dB}$，得 $P_{rx}=-90\ \mathrm{dBm}$。$B=20\ \mathrm{MHz}$ 时热噪声 $-174+73=-101\ \mathrm{dBm}$，加 $\mathrm{NF}=5\ \mathrm{dB}$ 得 $-96\ \mathrm{dBm}$，故 $\mathrm{SNR}=6\ \mathrm{dB}$。若 $R_b=10\ \mathrm{Mb/s}$，$B/R_b=2$，$E_b/N_0=9\ \mathrm{dB}$；速率翻倍到 $20\ \mathrm{Mb/s}$ 时 $E_b/N_0$ 回到 $6\ \mathrm{dB}$。

> [!warning] 仪表上的 SNR 不能直接用
> 频谱仪的 SNR 依赖分辨率带宽 RBW，换一个 RBW 读数就变。换算成 $E_b/N_0$ 必须知道实际信号带宽与比特率，否则可能差十几 dB。

## 常见错误清单

- 把 $S_Y=\lvert H\rvert^2S_X$ 用在时变/非线性系统，或输出了独立噪声时写成 $S_Y=\lvert H\rvert^2S_X$（应为 $+S_N$）。
- 把 $\lvert H(\omega)\rvert^2$ 写成 $H^2(\omega)$，对复频响丢掉共轭。
- 单边/双边混用，或把 $E_b/N_0$ 与 SNR 直接等同，忽略 $B/R_b$。
- 用过载或与信号同步的量化误差套 $\Delta^2/12$，得到虚假的 SQNR。

## 前置与下一步

- **前置**：[[signal-processing/random-processes|随机过程与随机信号]]、[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]、[[signal-processing/dft-and-fft|DFT 与 FFT]]。
- **下一步**：[[signal-processing/statistical-estimation-filtering|统计估计与最优滤波]]（从含噪观测中估计信号）、[[signal-processing/signal-detection-theory|信号检测理论]]（匹配滤波检测与 ROC）、[[signal-processing/random-signal-experiments|MATLAB 实验]]（白噪声通过滤波器、AWGN 误码率）。
- **跨学科**：[[communication/digital-modulation-qpsk|数字调制 QPSK]]、[[communication/index|通信原理]]、[[mathematics/probability-overview|概率论概览]]。

## 来源与延伸阅读

- 通过系统：[[vault-notes/random-signals/06-random-process-lti-systems|随机过程与 LTI 系统]]、[[vault-notes/random-signals/06-output-mean-autocorrelation|输出均值与自相关]]、[[vault-notes/random-signals/06-input-output-psd-relation|输入输出功率谱关系]]、[[vault-notes/random-signals/06-filtering-noise-power|滤波与噪声功率分析]]。
- 噪声模型与指标：[[vault-notes/random-signals/05-white-colored-noise-spectra|白噪声与有色噪声频谱]]、[[vault-notes/random-signals/03-gaussian-process-white-noise|高斯过程与白噪声]]、[[vault-notes/random-signals/10-awgn-channel|AWGN 信道]]、[[vault-notes/random-signals/10-snr-noise-bandwidth|信噪比与噪声带宽]]、[[vault-notes/random-signals/10-adc-sampling-quantization-noise|ADC 采样与量化噪声]]。