---
title: 随机信号处理 MATLAB 实验
description: 六个可运行的 MATLAB 实验：高斯噪声分布、自相关与功率谱估计、白噪声通过滤波器、维纳滤波与 AWGN 误码率，含预期结果与易错点。
tags:
  - signal-processing
  - matlab
  - experiments
---

理论给公式，实验给“公式在有限数据、有限精度下长什么样”。本文给出六个实验：从生成高斯噪声、估计相关函数与功率谱，到让白噪声通过滤波器、设计维纳滤波器、仿真 AWGN 误码率。每个实验都包含目的、关键公式、可运行代码、预期现象与易错点。前置是 [[signal-processing/random-processes|随机过程与随机信号]]、[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]] 与 [[signal-processing/random-signals-through-systems|随机信号通过线性系统]]。

> [!warning] 关于“预期结果”
> 文中的数值表是**理论计算与典型仿真数量级**，用来帮助你判断结果是否合理，**不是在本机实测得到的记录**。实际运行会因 MATLAB 版本、随机种子、窗长与滤波器设计而略有差别。报告实验结果时，请写明你的参数、种子与实际输出。

## 实验一：高斯噪声生成与分布验证

**目的**：验证 `randn` 样本的均值、方差、直方图与 Q-Q 图是否收敛到 $N(\mu,\sigma^2)$，理解“估计量本身也是随机变量”。

**关键公式**：$X=\mu+\sigma Z$，$Z\sim N(0,1)$；样本均值与样本方差满足

$$
E[\bar X]=\mu,\quad \mathrm{Var}(\bar X)=\frac{\sigma^2}{N},\quad
E[S^2]=\sigma^2,\quad \mathrm{Var}(S^2)=\frac{2\sigma^4}{N-1}
$$

Q-Q 图把排序样本 $x_{(i)}$ 与理论分位数 $\mu+\sigma\Phi^{-1}\left(\frac{i-0.5}{N}\right)$ 对比：主体贴近 $y=x$ 说明分布一致，尾部系统性偏离才说明偏度或厚尾。

~~~matlab
rng(2024,'twister');
mu = 2; sigma = 3; N = 1e5;
x = mu + sigma*randn(N,1);
fprintf('mean=%.4f (理论 %.4f), std=%.4f (理论 %.4f)\n', ...
        mean(x), mu, std(x), sigma);
histogram(x, 80, 'Normalization', 'pdf'); hold on;
gridx = linspace(mu-4*sigma, mu+4*sigma, 400);
plot(gridx, exp(-(gridx-mu).^2/(2*sigma^2))/(sigma*sqrt(2*pi)), 'r-');
p = ((1:N).' - 0.5)/N;
qq_manual = sort(x);            % 与 mu+sigma*sqrt(2)*erfinv(2*p-1) 对比
~~~

**预期现象**：均值与标准差落在理论值 $\pm2$ 个标准误内；$N=10^5$ 时均值标准误 $\sigma/\sqrt N\approx0.0095$、标准差标准误约 $0.0067$。直方图与 PDF 基本重合，Q-Q 图两端几十个点略偏离——极端次序统计量方差大，属正常现象。

| $N$ | 均值标准误 | 标准差标准误 | 直方图观感 |
| --- | --- | --- | --- |
| $10^3$ | 0.095 | 0.067 | 明显毛刺 |
| $10^4$ | 0.030 | 0.021 | 轮廓清楚 |
| $10^5$ | 0.0095 | 0.0067 | 较平滑 |
| $10^6$ | 0.0030 | 0.0021 | 尾部仍有个别离群点 |

**易错点**：`std` 默认除以 $N-1$，手写时若除以 $N$ 在小样本下会与理论表对不上；`randn` 只产生 $N(0,1)$，必须做 `mu + sigma*randn`；直方图要加 `'Normalization','pdf'` 才能与 PDF 同尺度；固定 `rng` 只保证可复现，不保证一次估计恰好等于理论值。

## 实验二：自相关估计

**目的**：生成 AR(1) 过程，用 biased/unbiased 两种归一化估计 $R_X[k]$，观察偏差、方差与去均值的影响。

AR(1) 满足 $X[n]=aX[n-1]+W[n]$，$\lvert a\rvert<1$，理论相关函数

$$
R_X[k]=\frac{\sigma_w^2}{1-a^2}a^{\lvert k\rvert}
$$

两种估计量为

$$
\hat R_X^{b}[k]=\frac{1}{N}\sum_{n=0}^{N-1-\lvert k\rvert}x[n+\lvert k\rvert]x[n],\qquad
\hat R_X^{u}[k]=\frac{1}{N-\lvert k\rvert}\sum_{n=0}^{N-1-\lvert k\rvert}x[n+\lvert k\rvert]x[n]
$$

对零均值过程 $E[\hat R_X^{b}[k]]=\left(1-\frac{\lvert k\rvert}{N}\right)R_X[k]$，而 $E[\hat R_X^{u}[k]]=R_X[k]$：biased 有三角窗收缩但更稳定，unbiased 无偏但边缘方差大。

~~~matlab
rng(7,'twister');
a = 0.99; sigma_w = 1; N = 2000; maxlag = 300;
Rb = zeros(2*maxlag+1,1); Ru = Rb;
for r = 1:200
    x = filter(1, [1 -a], sigma_w*randn(N,1)); x = x(501:end);
    Rb = Rb + xcorr(x, maxlag, 'biased');
    Ru = Ru + xcorr(x, maxlag, 'unbiased');
end
Rb = Rb/200; Ru = Ru/200; lags = (-maxlag:maxlag).';
R_theory = sigma_w^2/(1-a^2) * a.^abs(lags);
plot(lags, R_theory, 'k-', lags, Rb, 'b-', lags, Ru, 'r--'); grid on;
~~~

**预期现象**：理论 $R_X[0]=\sigma_w^2/(1-a^2)=50.25$。$\lvert k\rvert<100$ 时两条估计曲线与理论重合；接近 $k=300$ 时 biased 因乘了 $(1500-300)/1500$ 而低约 20%，unbiased 的均值对准理论但单次抖动大得多。

| 滞后 $k$ | 理论 | biased 期望 | unbiased 期望 |
| --- | --- | --- | --- |
| 0 | 50.25 | 50.25 | 50.25 |
| 100 | 18.35 | 17.13 | 18.35 |
| 200 | 6.70 | 5.81 | 6.70 |
| 300 | 2.45 | 1.96 | 2.45 |

均值去除的影响可以用 $R_X[k]+\mu^2$ 精确预测：叠加直流 $\mu=5$ 后 $\hat R(0)$ 从 50.25 抬到 75.25，整条曲线被抬高 $\mu^2$；去均值后回到理论值。

**易错点**：`xcorr` 默认不除 $N$，与理论比较时必须显式指定归一化；biased 的偏差在 $\lvert k\rvert\ll N$ 时约为 $\lvert k\rvert/N$，不可忽略；含直流时先 `x - mean(x)`。

## 实验三：功率谱估计

**目的**：对同一段 AR(1) 数据分别用 `periodogram` 与 `pwelch` 估计功率谱，观察“分辨率与方差”的矛盾。

AR(1) 的离散 PSD 为 $S_X(e^{j\Omega})=\sigma_w^2/\lvert 1-ae^{-j\Omega}\rvert^2$；周期图为

$$
\hat S_X^{per}(f)=\frac{1}{f_sN}\left\lvert\sum_{n=0}^{N-1}x[n]e^{-j2\pi fn/f_s}\right\rvert^2
$$

其分辨率约为 $f_s/N$，每个频点只有约 2 个自由度的平均，相对标准差接近 100%，**不是一致估计**。Welch 把数据分成 $K$ 段、加窗重叠后平均，方差约降为 $1/K$，分辨率降为约 $\mathrm{ENBW}\cdot f_s/L$。

~~~matlab
rng(11,'twister');
fs = 1000; a = 0.9; sigma_w = sqrt(1-a^2); N = 2^14;
x = filter(1, [1 -a], sigma_w*randn(N,1));
f = linspace(0, fs/2, 2001);
Sx_theory = 2*(sigma_w^2./abs(1-a*exp(-1j*2*pi*f/fs)).^2)/fs;   % 单边
[Pper,fper] = periodogram(x, rectwin(N), N, fs);
[Pw,fw] = pwelch(x, hamming(256), 128, 256, fs);
semilogy(f, Sx_theory, 'k-', fper, Pper, 'Color',[.6 .6 .6], fw, Pw, 'b-');
fprintf('积分功率 Welch = %.3f\n', trapz(fw, Pw));
~~~

**预期现象**：周期图包络贴合理论，但谱线呈“草丛”状，单点可在理论值上下一个数量级波动（$N=2^{14}$、$f_s=1000$ Hz 时分辨 $0.061$ Hz）；Welch（$L=256$、50% 重叠、$K\approx127$）曲线平滑，相对标准差约 $9\%$，代价是分辨率约 $5.3$ Hz。两者的积分功率都应接近信号方差 1。

**易错点**：纵轴用 dB 时 PSD 是功率量，用 $10\log_{10}$；理论式若是双边谱，画单边图前乘 2，`pwelch` 默认已是单边，别重复乘；增大 $N$ 只让谱线变密，不降低方差；含直流时先 `detrend` 或去均值。

## 实验四：白噪声通过滤波器

**目的**：验证 $S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega)$ 与 Parseval 关系，计算等效噪声带宽 $B_n$；理解“输出功率由滤波器能量决定，而不只看通带宽度”。

方差为 $\sigma^2$ 的离散白噪声，双边 PSD 为 $S_X=\sigma^2/f_s$（对应连续单边谱 $N_0=2\sigma^2/f_s$）。通过 $h[n]$ 后

$$
S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega),\qquad
P_Y=\sigma^2\sum_n\lvert h[n]\rvert^2=N_0B_n\lvert H(0)\rvert^2
$$

$$
B_n=\frac{1}{\lvert H(0)\rvert^2}\int_0^{f_s/2}\lvert H(f)\rvert^2\,\mathrm{d}f
=\frac{f_s\sum_n\lvert h[n]\rvert^2}{2\lvert H(0)\rvert^2}
$$

~~~matlab
rng(23,'twister');
fs = 8000; N = 2^16; sigma2 = 1;
x = sqrt(sigma2)*randn(N,1);
h = fir1(63, 1250/(fs/2), 'low', hamming(64));
y = filter(h, 1, x);
P_theory = sigma2*sum(h.^2);  H0 = sum(h);
Bn = fs*sum(h.^2)/(2*H0^2);
fprintf('P: 理论 %.4f, 仿真 %.4f; Bn=%.1f Hz\n', P_theory, var(y), Bn);
[Pyy,f] = pwelch(y, hamming(1024), 512, 1024, fs);
[Hf,fh] = freqz(h, 1, 1024, fs);
Sy = 2*abs(Hf).^2*sigma2/fs;  Sy(1) = abs(Hf(1))^2*sigma2/fs;
plot(fh, 10*log10(Sy), f, 10*log10(Pyy)); grid on;
~~~

**预期现象**：通带内单边 PSD 约 $2\sigma^2/f_s=2.5\times10^{-4}$（即 $-36$ dB/Hz），Welch 与理论曲线重合；1.25 kHz 附近开始滚降，1.5 kHz 后进入约 $-52$ dB 的阻带。输出功率 $\sigma^2\sum h^2\approx0.301$，噪声带宽约 $1204$ Hz（若按截止频率 1250 Hz 估算会得到 0.31，看似接近只是巧合）。

**易错点**：白噪声的“功率”是方差 $\sigma^2$，不是 PSD；离散白噪声双边 PSD 是 $\sigma^2/f_s$，差一个 $f_s$；`fir1(n,...)` 的 $n$ 是阶数，长度是 $n+1$，`Wn` 要除以奈奎斯特频率；输出功率不是 $\sigma^2\lvert H(0)\rvert^2$（那只适用于直流）。

## 实验五：维纳滤波

**目的**：对“AR(1) 信号 + 白噪声”设计因果 FIR Wiener 与非因果频域 Wiener，比较输出 SNR 与 MMSE，理解因果性代价与抽头数饱和。

信号 $S[n]$ 为单位方差 AR(1)，观测 $X[n]=S[n]+V[n]$，$V\sim N(0,\sigma_v^2)$ 独立。$R_S[k]=a^{\lvert k\rvert}$、$R_X[k]=R_S[k]+\sigma_v^2\delta[k]$。因果 FIR 由正交性原理得正规方程

$$
\mathbf{R}_{XX}\mathbf{h}=\mathbf{r}_{XS},\qquad
[\mathbf{R}_{XX}]_{ij}=R_X[i-j],\quad r_{XS}[j]=R_S[j]
$$

MMSE $=\sigma_S^2-\mathbf{r}_{XS}^T\mathbf{h}$；非因果解为 $H(\omega)=S_S/(S_S+S_V)$，输出 SNR 统一定义为 $\sigma_S^2/\mathrm{MMSE}$。

~~~matlab
rng(31,'twister');
a = 0.9; sigma_w = sqrt(1-a^2); N = 20000;
s = filter(1, [1 -a], sigma_w*randn(N,1)); s = s(501:end); s = s - mean(s); N = numel(s);
sigma_v2 = 0.5; x = s + sqrt(sigma_v2)*randn(N,1);
Rs = @(k) a.^abs(k); Rx = @(k) Rs(k) + sigma_v2*(k==0);
M = 21;
h = toeplitz(Rx(0:M-1)) \ Rs(0:M-1).';
mmse_c = 1 - Rs(0:M-1)*h;  s_c = filter(h, 1, x);
Nfft = 2^nextpow2(2*N); w = 2*pi*(0:Nfft-1).'/Nfft;
Ss = sigma_w^2./abs(1-a*exp(-1j*w)).^2; H = Ss./(Ss+sigma_v2);
s_nc = real(ifft(H.*fft(x,Nfft))); s_nc = s_nc(1:N);
~~~

**预期现象**：输入 SNR $=\sigma_S^2/\sigma_v^2\approx3$ dB。因果 $M=21$ 时 MMSE 约 $0.209$、输出约 $6.8$ dB；非因果 MMSE 约 $0.152$、输出约 $8.2$ dB（因果性代价约 $1.4$ dB）。$M=1$ 只有 $4.8$ dB，$M=5$ 已达 $6.8$ dB——相关按 $0.9^{\lvert k\rvert}$ 衰减，5 点后新抽头几乎不提供信息。噪声越大，滤波相对收益越明显。

| 方案 | 使用观测 | MMSE（理论） | 输出 SNR（理论） |
| --- | --- | --- | --- |
| 不滤波 | — | 0.500 | 3.0 dB |
| 因果 FIR，$M=1$ | $X[n]$ | 0.333 | 4.8 dB |
| 因果 FIR，$M=5$ | 5 点 | 0.210 | 6.8 dB |
| 因果 FIR，$M=21$ | 21 点 | 0.209 | 6.8 dB |
| 非因果 | 整段 | 0.152 | 8.2 dB |

**易错点**：输出 SNR 必须用 $\sigma_S^2/\mathrm{MMSE}$，用 $(1-\mathrm{MMSE})/\mathrm{MMSE}$ 会把因果滤波器的信号失真当成信号功率；$\mathbf{R}_{XX}$ 对角线要加 $\sigma_v^2$；生成单位方差 AR(1) 时创新方差取 $1-a^2$；非因果零相位但需要未来样本，只能离线。

## 实验六：AWGN 信道误码率

**目的**：用蒙特卡洛统计 BPSK 在 AWGN 下的错误比特数，与 $P_b=Q(\sqrt{2E_b/N_0})$ 对照，理解统计精度与错误数的关系。

$E_b=1$ 时噪声标准差 $\sigma=\sqrt{N_0/2}=1/\sqrt{2E_b/N_0}$；误码率估计 $\hat P_b=N_e/N$ 的相对标准差约 $1/\sqrt{N_e}$。想可靠观察 $10^{-6}$ 需要约 $10^8$ 比特，$10^6$ 比特的可靠下限约 $10^{-5}$。

~~~matlab
rng(101,'twister');
EbN0_dB = 0:2:10; Nbits = 1e6;
for k = 1:numel(EbN0_dB)
    EbN0 = 10^(EbN0_dB(k)/10);
    bits = randi([0 1], Nbits, 1);
    tx = 1 - 2*bits;                       % 0->+1, 1->-1
    sigma = sqrt(1/(2*EbN0));              % N0/2 = 1/(2 Eb/N0)
    rx = tx + sigma*randn(Nbits,1);
    ber_sim(k) = mean((rx<0) ~= bits);
end
ber_theory = 0.5*erfc(sqrt(10.^(EbN0_dB/10)));   % Q(sqrt(2Eb/N0))
semilogy(EbN0_dB, ber_theory, 'k-', EbN0_dB, ber_sim, 'bo'); grid on;
~~~

**预期现象**：0–8 dB 范围内仿真点贴合理论曲线；6 dB 处理论 $2.39\times10^{-3}$，$10^6$ 比特约 2400 个错误，统计起伏约 $2\%$。10 dB 处理论 $3.87\times10^{-6}$，期望错误数只有约 4 个，单次结果可能在 0–10 之间跳动，甚至因 0 个错误在对数坐标上消失。曲线在高 SNR 端近似直线下降，因为 $Q(x)\approx e^{-x^2/2}/(x\sqrt{2\pi})$。

**易错点**：横轴必须是 $E_b/N_0$ 而不是 $E_s/N_0$（QPSK 差 3 dB，16-QAM 差 6 dB）；噪声方差是 $N_0/2=1/(2E_b/N_0)$，写成 $1/(E_b/N_0)$ 就整体差 3 dB；判决门限与映射必须一致（本实验用 `1-2*bits`）；错误数少于 100 时不要据此判断理论有误，应增大 $N$ 或改用置信区间。

## 实验报告检查清单

- 写明随机种子、样本数 $N$、采样率 $f_s$、窗函数与段长、滤波器阶数与截止频率。
- 区分“理论值”“预期仿真值”与“本次实际输出”，不要把三者混写。
- 每张图都标出横纵轴物理量与单位（PSD 是功率/Hz，不是 dB 幅度）。
- 与理论对照时说明用的是单边还是双边谱、$E_b/N_0$ 还是 SNR。
- 对统计量给出误差量级：均值 $\sigma/\sqrt N$、方差 $2\sigma^4/(N-1)$、谱估计相对标准差 $\approx1/\sqrt{K}$、误码率相对标准差 $\approx1/\sqrt{N_e}$。

## 常见错误清单

- 把仿真当作实测，或把一次随机运行的结果当成确定结论。
- 混用单边/双边谱，导致所有功率与 SNR 差 3 dB。
- 自相关估计忘记指定归一化，或不去均值导致 $R(0)$ 抬高 $\mu^2$。
- 用周期图的方差当作“谱的光滑度”，不区分分辨率与方差。
- 滤波器实验按截止频率估算输出功率，而不是用 $\sum h^2$ 或积分。
- 维纳滤波的 $\mathbf{R}_{XX}$ 漏加噪声方差，或用错误的 SNR 定义。
- 误码率仿真中 $E_b/N_0$ 与 $E_s/N_0$ 混用、噪声方差设错、错误数太少。

## 前置与下一步

- **前置**：[[signal-processing/random-processes|随机过程与随机信号]]（均值、相关、白噪声）、[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]（相关估计、周期图、Welch）、[[signal-processing/random-signals-through-systems|随机信号通过线性系统]]（$S_Y=\lvert H\rvert^2S_X$、噪声带宽）、[[signal-processing/statistical-estimation-filtering|统计估计与最优滤波]]（维纳解）、[[signal-processing/signal-detection-theory|信号检测理论]]（$Q$ 函数与误码率）。
- **下一步**：用 [[signal-processing/dft-and-fft|DFT 与 FFT]] 理解谱估计的离散频率轴，并与 [[signal-processing/random-signals-formula-sheet|公式速查]] 对照复习。
- **跨学科**：[[programming/index|MATLAB]] 分类中的基础语法笔记。

## 来源与延伸阅读

- 实验：[[vault-notes/random-signals/11-gaussian-noise-distribution|高斯噪声生成与分布验证]]、[[vault-notes/random-signals/11-autocorrelation-estimation-experiment|自相关估计实验]]、[[vault-notes/random-signals/11-psd-estimation-experiment|功率谱估计实验]]、[[vault-notes/random-signals/11-white-noise-through-filter|白噪声通过滤波器]]、[[vault-notes/random-signals/11-wiener-filtering-experiment|维纳滤波实验]]、[[vault-notes/random-signals/11-awgn-ber-experiment|AWGN 信道误码率实验]]。
