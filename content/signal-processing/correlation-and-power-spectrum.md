---
title: 相关函数与功率谱
description: 从各态历经与样本相关函数出发，用维纳–辛钦定理把相关函数与功率谱连起来，并给出周期图、Welch 与相干函数的工程用法。
tags:
  - signal-processing
  - random-processes
  - power-spectral-density
---

统计量定义好了，下一个问题是：只有一条有限长记录时，能不能估计它们？**各态历经**给出“时间平均代替集合平均”的条件，**样本相关函数**给出估计量；**维纳–辛钦定理**再把相关函数与功率谱连成一对傅里叶变换。本文走完这条链路，并说明周期图为什么不是一致估计、Welch 如何用方差换平滑。

## 各态历经：一条记录能否代表全体

集合平均要跨无穷多条样本函数，现实中往往只有一条有限长记录。**时间平均**定义为

$$
\langle x(t)\rangle=\lim_{T\to\infty}\frac{1}{T}\int_{0}^{T}x(t)\,\mathrm{d}t
$$

若它（在均方或几乎必然意义下）等于集合均值 $\mu_X$，称过程**均值各态历经**。有限时长估计量 $\bar X_T=\frac{1}{T}\int_0^TX(t)\,\mathrm{d}t$ 是无偏的，关键看方差：

$$
\mathrm{Var}(\bar X_T)=\frac{2}{T}\int_0^T\left(1-\frac{\tau}{T}\right)C_X(\tau)\,\mathrm{d}\tau
$$

因此 $C_X(\tau)\to0$（$\tau\to\infty$）或更弱的 $\frac{1}{T}\int_0^TC_X(\tau)\,\mathrm{d}\tau\to0$ 是均值遍历的充分条件。直观上：相隔足够远的两段波形几乎不相关，长记录中的有效独立样本数随 $T$ 增长。

两个反例说明这组条件不能乱用：

- **随机常数** $X(t)=A$，$A$ 均值 $m$、方差 $\sigma_A^2$。它严平稳、WSS，但任一条样本的时间平均恒为 $A\ne m$，故不是均值遍历。
- **随机相位正弦** $R_X(\tau)=\frac{A^2}{2}\cos\omega_0\tau$ 不趋于 $0$，但时间平均仍为零（振荡积分抵消），所以它**是**均值遍历的。可见“$R_X$ 不衰减”不能直接判非遍历，充分条件不是必要条件。

**相关函数各态历经**要求对每个 $\tau$ 有 $\langle x(t+\tau)x^*(t)\rangle=R_X(\tau)$，需要四阶矩存在；零均值实高斯过程的一个充分条件是 $\int\lvert R_X(u)\rvert^2\,\mathrm{d}u<\infty$。各态历经是**逐统计量**成立的：均值遍历不保证相关遍历。工程判据是记录长度 $T\gg\tau_c$（相关时间），有效样本数 $N_{\mathrm{eff}}\approx T/(2\tau_c)$ 足够大，且分段估计结果稳定。

## 相关函数：相似性、时延与系统辨识

对宽平稳过程，**自相关**与**自协方差**为

$$
R_X(\tau)=E\big[X(t+\tau)X^*(t)\big],\qquad C_X(\tau)=R_X(\tau)-\lvert\mu_X\rvert^2
$$

三条符号不能混：$R_X(\tau)$ 含直流、$C_X(\tau)$ 去均值、$\sigma_X^2=C_X(0)$。只有 $\mu_X=0$ 时两者相同。

自相关的性质可归纳为一条主线：**非负定**是最本质的约束。由 $E\big[\lvert\sum_i a_iX(t+\tau_i)\rvert^2\big]\ge0$ 得

$$
\sum_{i}\sum_{j}a_ia_j^*R_X(\tau_i-\tau_j)\ge0
$$

它蕴含 $R_X(-\tau)=R_X^*(\tau)$、$\lvert R_X(\tau)\rvert\le R_X(0)$ 与连续（若在 $0$ 处连续则处处连续）。由 Bochner 定理，非负定等价于其傅里叶变换处处非负，这就是功率谱非负的来源。反过来，“偶函数 + 原点最大”不足以判定合法：矩形相关函数 $R(\tau)=1$（$\lvert\tau\rvert\le1$）的谱 $2\sin\omega/\omega$ 会取负值，它不能成为任何过程的自相关。

**相关时间**衡量“相隔多久后基本不相关”，常见三种定义：积分尺度 $\tau_c=\int_0^\infty\lvert\rho_X(\tau)\rvert\,\mathrm{d}\tau$、首次过零、$1/e$ 衰减；报告中必须写明用哪一种。相关时间给出两个尺度：有效独立样本数 $N_{\mathrm{eff}}\approx T/(2\tau_c)$，谱主瓣宽度约 $1/\tau_c$。

三个标准模型要能脱口而出：

| 过程 | $R_X(\tau)$ 或 $R_X[m]$ | 功率谱 | 相关时间 |
| --- | --- | --- | --- |
| 白噪声 | $\sigma^2\delta(\tau)$ | 常数 | 0 |
| 随机相位正弦 | $\frac{A^2}{2}\cos\omega_0\tau$ | 两根谱线 | 不衰减 |
| AR(1) | $\frac{\sigma_w^2}{1-a^2}a^{\lvert m\rvert}$ | $\frac{\sigma_w^2}{1-2a\cos\omega+a^2}$ | $\sim1/(1-a)$ 点 |

AR(1) 的推导值得记住：$X[n]=aX[n-1]+W[n]$，$W$ 零均值白噪声、方差 $\sigma_w^2$。两边乘 $X[n-m]$ 取期望，$m\ge1$ 时得 $R[m]=aR[m-1]$；再由 $R[0]=aR[1]+\sigma_w^2=a^2R[0]+\sigma_w^2$ 解得 $R[0]=\sigma_w^2/(1-a^2)$。$a$ 越接近 $1$，相关时间越长、谱越窄。

**互相关**看两个信号的相似性：

$$
R_{XY}(\tau)=E\big[X(t+\tau)Y^*(t)\big],\qquad R_{XY}(\tau)=R_{YX}^*(-\tau)
$$

它不再偶对称，峰值可以“搬家”。若 $Y(t)=X(t-D)+N(t)$ 且 $X,N$ 不相关，则 $R_{XY}(\tau)=R_X(\tau-D)$，峰值位置直接给出时延 $D$；若再推导系统辨识，$Y=h*X+N$ 时 $R_{YX}(\tau)=h(\tau)*R_X(\tau)$，频域即 $H(\omega)=S_{YX}(\omega)/S_X(\omega)$。**相干函数**

$$
\gamma_{XY}^2(\omega)=\frac{\lvert S_{XY}(\omega)\rvert^2}{S_X(\omega)S_Y(\omega)}\in[0,1]
$$

表示 $Y$ 中能由 $X$ 线性解释的功率比例，但它只测线性关系，也不说明因果。

**从一条记录估计相关函数**时，三种归一化的差别必须清楚：

| 归一化 | 期望 | 特点 |
| --- | --- | --- |
| $1/N$（biased） | $(1-\lvert m\rvert/N)R[m]$ | 半正定、方差小、谱估计稳定 |
| $1/(N-\lvert m\rvert)$ | $R[m]$ | 无偏，但边界方差大、可能破坏半正定 |
| coeff | 近似 $\rho[m]$ | 无量纲，便于跨信号比较 |

$1/N$ 估计等效于给真实相关函数乘了三角窗（Bartlett 窗），滞后越接近 $N$ 越不可信。零均值高斯白噪声下 $\mathrm{Var}(\hat R[0])\approx2\sigma^4/N$、$\mathrm{Var}(\hat R[m])\approx\sigma^4/N$；归一化样本相关在 $m\ne0$ 时近似 $N(0,1/N)$，故 $95\%$ 置信带约 $\pm1.96/\sqrt{N}$。$N=1024$ 时阈值约 $0.061$，因此白噪声相关图上偶尔超阈值的“尖峰”并不说明存在真实相关（多重比较会制造假峰）。去均值前后差别巨大：$x[n]=10+w[n]$ 未去均值时 $\hat R[m]\approx100$，相关图几乎水平；去均值后才显出 $\hat R[0]\approx1$、$\hat R[m]\approx0$ 的白噪声特征。

~~~matlab
x = x(:) - mean(x);                  % 先去均值（必要时再去趋势）
[R, lags] = xcorr(x, 100, 'coeff');  % 归一化样本自相关，最大滞后 100
stem(lags, R);
~~~

## 功率谱密度与维纳–辛钦定理

随机过程的样本函数一般不衰减，能量无穷，直接做傅里叶变换没有意义；而且对一条样本做变换得到的仍是随机函数。可行的定义是“截断、归一化、取期望”：

$$
S_X(\omega)=\lim_{T\to\infty}\frac{1}{2T}E\left[\left\lvert X_T(\omega)\right\rvert^2\right],\qquad X_T(\omega)=\int_{-T}^{T}X(t)e^{-j\omega t}\,\mathrm{d}t
$$

**维纳–辛钦定理**把这一密度与自相关函数直接连起来：若 $R_X$ 绝对可积，则

$$
S_X(\omega)=\int_{-\infty}^{\infty}R_X(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau,\qquad
R_X(\tau)=\frac{1}{2\pi}\int_{-\infty}^{\infty}S_X(\omega)e^{j\omega\tau}\,\mathrm{d}\omega
$$

证明只需四步：截断信号、算 $E[\lvert X_T(\omega)\rvert^2]$、换元 $\tau=t-s$ 得权重 $(2T-\lvert\tau\rvert)$、除以 $2T$ 并令 $T\to\infty$。中间量 $\frac{1}{2T}\lvert X_T(\omega)\rvert^2$ 正是单次实现的**周期图**，定理同时告诉我们它的期望是真实 PSD 被三角窗平滑后的结果。

绝对可积不是永远成立。含直流、含周期分量时 $R_X$ 不绝对可积，但 PSD 仍存在，只是要按广义函数理解：

$$
R_X(\tau)=\frac{A^2}{2}\cos\omega_0\tau\ \Longleftrightarrow\ S_X(\omega)=\frac{\pi A^2}{2}\big[\delta(\omega-\omega_0)+\delta(\omega+\omega_0)\big]
$$

冲激的高度不是密度，冲激的权重才是功率。离散时间对应为 $S_X(e^{j\omega})=\sum_mR_X[m]e^{-j\omega m}$，以 $2\pi$ 为周期，平均功率为 $R_X[0]=\frac{1}{2\pi}\int_{-\pi}^{\pi}S_X(e^{j\omega})\,\mathrm{d}\omega$。

PSD 的四条性质：非负、实值、实过程偶对称、积分给出平均功率。单位随信号走：$X$ 为 V 时 $S_X(f)$ 为 $\mathrm{V^2/Hz}$。**单边与双边必须一次说清**：本库默认双边 $S_X(\omega)$；实过程若只画 $f\ge0$，单边谱为

$$
S_X^+(f)=2S_X(f),\qquad f\ge 0
$$

白噪声的双边密度是 $N_0/2$，单边才是 $N_0$，混用是最常见的 3 dB 错误来源。

三个基本例子：

| 过程 | 自相关 | 双边谱 | 平均功率 |
| --- | --- | --- | --- |
| 连续白噪声 | $\frac{N_0}{2}\delta(\tau)$ | $\frac{N_0}{2}$ | 发散 |
| 随机相位正弦 | $\frac{A^2}{2}\cos\omega_0\tau$ | 两根冲激 | $A^2/2$ |
| 白噪声经 RC 低通 | $\frac{N_0}{4RC}e^{-\lvert\tau\rvert/(RC)}$ | $\frac{N_0/2}{1+(\omega RC)^2}$ | $\frac{N_0}{4RC}$ |

RC 低通 $H(\omega)=1/(1+j\omega RC)$ 是“白谱变洛伦兹形、$\delta$ 相关变指数相关”的标准范例，下一篇文章会反复用它计算噪声功率。

## 白噪声、带限白噪声与有色噪声

“白”指功率谱在所有频率上一样平，像白光包含全部可见光频率；“高斯”约束幅度分布，两者互相独立——存在高斯有色噪声，也存在均匀分布的白噪声。

| 类型 | 自相关 | 功率谱 | 平均功率 |
| --- | --- | --- | --- |
| 连续白噪声 | $\frac{N_0}{2}\delta(\tau)$ | $\frac{N_0}{2}$（双边） | 发散 |
| 带限白噪声 | $N_0B\,\mathrm{sinc}(2B\tau)$ | $\frac{N_0}{2}$（$\lvert f\rvert\le B$） | $N_0B$ |
| 离散白噪声 | $\sigma^2\delta[m]$ | $\sigma^2$（$\lvert\omega\rvert\le\pi$） | $\sigma^2$ |
| AR(1) 有色噪声 | $\frac{\sigma_W^2}{1-a^2}a^{\lvert m\rvert}$ | $\frac{\sigma_W^2}{1-2a\cos\omega+a^2}$ | $\frac{\sigma_W^2}{1-a^2}$ |

**带限白噪声**是“理想白噪声经过带宽 $B$ 的滤波器”的结果：相关函数为 $R_N(\tau)=N_0B\,\mathrm{sinc}(2B\tau)$，在 $\tau=k/(2B)$ 处过零。这意味着以奈奎斯特速率 $2B$ 采样得到的噪声样本互不相关；若噪声还是高斯的，则样本彼此独立——这正是仿真中“独立高斯序列近似采样噪声”的依据。

**有色噪声**用 AR(1) 建模最方便：$X[n]=aX[n-1]+W[n]$。$a=0$ 退化为白噪声；$0<a<1$ 谱峰在 $\omega=0$，是低通型慢变干扰；$-1<a<0$ 谱峰在 $\omega=\pi$，是差分或交流耦合后的高通型。取 $a=0.9$、$\sigma_W^2=1$ 时，$R_X[0]\approx5.26$，$S_X(0)=100$，而 $S_X(\pi)\approx0.277$，能量高度集中在低频。

## 互谱、相干函数与时延估计

自谱回答“一个信号自己的功率怎么分布”，互谱回答“两个信号在频率上有多相关、相差多少”。设 $X(t),Y(t)$ 联合宽平稳，

$$
S_{XY}(\omega)=\int_{-\infty}^{\infty}R_{XY}(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau,\qquad S_{YX}(\omega)=S_{XY}^*(\omega)
$$

与自谱不同，$S_{XY}$ 一般是**复函数**：模值表示相关强度，辐角表示平均相位差。它满足共轭对称 $S_{XY}(-\omega)=S_{XY}^*(\omega)$（实过程）与**互谱不等式**

$$
\lvert S_{XY}(\omega)\rvert^2\le S_X(\omega)S_Y(\omega)
$$

这是频域版柯西–施瓦茨不等式：把 $S_X,S_{XY},S_Y$ 排成 $2\times2$ 矩阵，它必须半正定。注意 $S_{XY}$ 的实部可以为负，不能像自谱那样逐点解释为“功率”。

**相干函数**把互谱归一化为 $[0,1]$ 内的量：

$$
\gamma_{XY}^2(\omega)=\frac{\lvert S_{XY}(\omega)\rvert^2}{S_X(\omega)S_Y(\omega)}
$$

它表示在频率 $\omega$ 上 $Y$ 中有多少功率可由 $X$ 的线性成分解释。若 $Y=h*X+N$ 且 $N$ 与 $X$ 独立，则

$$
\gamma_{XY}^2(\omega)=\frac{\lvert H(\omega)\rvert^2S_X(\omega)}{\lvert H(\omega)\rvert^2S_X(\omega)+S_N(\omega)}
$$

信噪比越低相干越小；相干接近 $0$ 只说明没有可测的**线性**关系（$Y=X^2$ 这种确定性非线性关系的相干也接近零），更不代表因果——两个信号同时受第三个源驱动同样会高相干。

两个工程用法直接来自相位与比值：

- **纯时延**：$Y(t)=X(t-D)$ 时 $S_{XY}(\omega)=S_X(\omega)e^{-j\omega D}$，相位斜率为 $-\omega D$，故 $\hat D=-\mathrm{d}\angle S_{XY}/\mathrm{d}\omega$；实际中先用 GCC-PHAT 白化再反变换找峰。
- **频响估计**：$Y=h*X$ 时 $S_{YX}(\omega)=H(\omega)S_X(\omega)$，于是 $\hat H=S_{YX}/S_X$；若误用 $S_{XY}$ 会得到 $H^*$，相位符号相反。

## 谱估计：周期图与 Welch

周期图定义为

$$
\hat S_p(\omega)=\frac{1}{N}\left\lvert\sum_{n=0}^{N-1}x[n]e^{-j\omega n}\right\rvert^2
$$

它渐近无偏（期望是真实谱被 Fejér 核平滑），但方差约为 $S_X^2(\omega)$，与 $N$ 无关，因此**不是一致估计**：数据越长只是谱点越密，曲线并不会更光滑。高斯白噪声下 $\hat S_p[k]/S_X$ 近似服从 $\chi_2^2/2$，相对标准差约 100\%。

降低方差要靠平均。Welch 法把数据切成 $K$ 段、每段加窗后求周期图再平均，方差约降为 $1/K$（段间独立时），分辨率降为约 $f_s/L$：

$$
\hat S_{\mathrm{Welch}}(\omega)=\frac{1}{K}\sum_{i=1}^{K}\hat S_w^{(i)}(\omega)
$$

窗函数压低旁瓣、加宽主瓣：矩形窗主瓣宽 2 bin、最高旁瓣 $-13$ dB；Hann 窗 4 bin、$-31$ dB；Hamming 窗 4 bin、$-43$ dB；Blackman 窗 6 bin、$-58$ dB。补零只能插值，不能提高分辨率——真正的分辨率由有效数据长度 $T=NT_s$ 决定，约 $1/T$。工程顺序是先由“必须分辨多近的两条谱线”定段长 $L$，再用剩余数据尽量增加段数 $K$。

~~~matlab
fs = 1000;  x = randn(10000,1);            % 1 s 数据
[pxx, f] = pwelch(x, hann(500), 250, 500, fs);   % 单边 PSD，单位 1/Hz
trapz(f, pxx)                                    % 应约等于时域方差
~~~

> [!warning] 关于 PSD 的四个常见误解
> 1. 把 $S_X(\omega)$ 当成能反变换回某条样本的“频谱”：反变换得到的是 $R_X(\tau)$。
> 2. 看到白噪声谱是常数就以为功率有限：密度有限、带宽无限，功率仍发散；限带后才是 $N_0B$。
> 3. 单边/双边混用：所有“乘以 2”的步骤都必须有出处。
> 4. 用补零冒充分辨率：补零让曲线更密，但无法分开主瓣内的两个频率。

## 常见错误清单

- 混淆 $R_X(\tau)$（含直流）与 $C_X(\tau)$（去均值）；只有 $\mu_X=0$ 时两者相等。
- 不声明单边/双边就写 $S_X$：双边 $N_0/2$ 对应单边 $N_0$，混用差 3 dB。
- 把补零当成分辨率：补零只在频域插值，真正分辨率由有效数据长度 $T=N T_s$ 决定。
- 用单次周期图当作光滑谱：其方差约等于谱值的平方，与 $N$ 无关，必须分段平均。
- 把高相干当成因果关系：相干只测线性相关，不说明因果。
- 相关估计不去均值/去趋势，直流平台会掩盖相关结构；不要用单个超阈值尖峰宣称发现周期。

## 前置与下一步

- **前置**：[[signal-processing/random-processes|随机过程与随机信号]]；[[mathematics/probability-overview|概率论概览]]。
- **下一步**：[[signal-processing/random-signals-through-systems|随机信号通过线性系统]]、[[signal-processing/statistical-estimation-filtering|统计估计与最优滤波]]、[[signal-processing/signal-detection-theory|信号检测理论]]、[[signal-processing/random-signal-experiments|MATLAB 实验]]、[[signal-processing/random-signals-formula-sheet|公式速查]]。
- **相关主题**：[[signal-processing/dft-and-fft|DFT 与 FFT]]（离散频率轴、泄漏与窗函数）。

## 来源与延伸阅读

- 时域相关：[[vault-notes/random-signals/03-ergodicity|各态历经性]]、[[vault-notes/random-signals/04-autocorrelation-autocovariance|自相关与自协方差]]、[[vault-notes/random-signals/04-correlation-properties|相关函数的性质]]、[[vault-notes/random-signals/04-cross-correlation-covariance|互相关与互协方差]]、[[vault-notes/random-signals/04-sample-correlation-estimation|样本相关函数估计]]。
- 频域分析：[[vault-notes/random-signals/05-power-spectral-density|功率谱密度]]、[[vault-notes/random-signals/05-wiener-khinchin|维纳–辛钦定理]]、[[vault-notes/random-signals/05-white-colored-noise-spectra|白噪声与有色噪声频谱]]、[[vault-notes/random-signals/05-cross-power-spectral-density|互功率谱密度]]、[[vault-notes/random-signals/05-psd-numerical-estimation|功率谱数值估计]]。
