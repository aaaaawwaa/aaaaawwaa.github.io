---
title: "维纳滤波实验"
tags:
- 随机信号处理
- 11-MATLAB实验
- 维纳滤波
- 最优滤波
- MMSE
type: lab
subjects:
- 随机信号处理
- Matlab
domains:
- 实验与仿真
status: learning
aliases: []
prerequisites: []
related: []
---

# 🧹 维纳滤波实验

> [!abstract] 这个实验做什么
> 生成单位方差的 AR(1) 信号并叠加白噪声，分别设计因果 FIR Wiener（解正规方程）与非因果频域 Wiener（$H=S_S/(S_S+S_V)$），比较输出 SNR 与 MMSE。
> 预期结论：输入约 3 dB 时，因果滤波约 6.8 dB、非因果约 8.2 dB；抽头超过约 5 后收益饱和，因果性带来约 1.4 dB 损失。

## 一、实验目的

- 从最小均方误差准则推出因果 FIR Wiener 的正规方程，并用 `toeplitz` 求解。
- 用频域公式实现非因果 Wiener，理解“零相位但需要整段数据”的含义。
- 统一定义输出 SNR，比较滤波前后、不同阶数与不同噪声方差下的性能。

## 二、原理与公式

设 $S[n]$ 为单位方差 AR(1)，观测 $X[n]=S[n]+V[n]$，$V[n]\sim N(0,\sigma_v^2)$ 与信号独立，则

$$R_S[k]=a^{|k|},\qquad R_X[k]=R_S[k]+\sigma_v^2\delta[k]$$

因果 FIR 只用 $X[n],\dots,X[n-M+1]$，最小化 $E[(S[n]-\sum_{k=0}^{M-1}h[k]X[n-k])^2]$。由正交性原理得正规方程

$$\mathbf{R}_{XX}\mathbf{h}=\mathbf{r}_{XS},\qquad [\mathbf{R}_{XX}]_{ij}=R_X[i-j],\quad r_{XS}[j]=R_S[j]$$

其 MMSE 为 $\mathrm{MMSE}=\sigma_S^2-\mathbf{r}_{XS}^T\mathbf{h}$。非因果 Wiener 允许使用全部观测，频域解为

$$H(\omega)=\frac{S_S(\omega)}{S_S(\omega)+S_V(\omega)}$$

对应 MMSE 由 $\frac{1}{2\pi}\int\frac{S_SS_V}{S_S+S_V}\,\mathrm{d}\omega$ 数值积分得到。输出 SNR 统一按“以完整 $S[n]$ 为期望信号”定义：

$$\mathrm{SNR}_{out}=10\log_{10}\frac{\sigma_S^2}{\mathrm{MMSE}}$$

分母是 MMSE 而非 $1-\mathrm{MMSE}$：因果滤波器的输出有失真，误差同时包含噪声残差与信号失真。

## 三、MATLAB 代码

```matlab
clear; close all; clc;
rng(31, 'twister');
a = 0.9; sigma_w = sqrt(1-a^2);      % 信号方差归一化为 1
N = 20000;
s = filter(1, [1 -a], sigma_w*randn(N,1));
s = s(501:end); s = s - mean(s); N = numel(s);
sigma_v2 = 0.5;                      % 输入 SNR ≈ 3 dB
x = s + sqrt(sigma_v2)*randn(N,1);
Rs = @(k) a.^abs(k);                 % R_S[k]
Rx = @(k) Rs(k) + sigma_v2*(k==0);   % R_X[k]
M = 21;
h = toeplitz(Rx(0:M-1)) \ Rs(0:M-1).';   % 因果 FIR Wiener
s_c = filter(h, 1, x);
mmse_c = 1 - Rs(0:M-1)*h;

Nfft = 2^nextpow2(2*N);
w = 2*pi*(0:Nfft-1).'/Nfft;
Ss = sigma_w^2 ./ abs(1 - a*exp(-1j*w)).^2;
H = Ss ./ (Ss + sigma_v2);           % 非因果频域 Wiener
s_nc = real(ifft(H .* fft(x, Nfft))); s_nc = s_nc(1:N);
mmse_nc = mean(Ss .* sigma_v2 ./ (Ss + sigma_v2));   % 1/(2π)∫...

idx = 1001:N-1000;                   % 去掉边缘，公平比较
snr = @(e) 10*log10(var(s(idx))/var(e(idx)));
fprintf('输入 SNR = %.2f dB（理论 %.2f dB）\n', snr(x-s), 10*log10(1/sigma_v2));
fprintf('因果 M=%d：MMSE=%.3f，SNR=%.2f dB（理论 %.2f dB）\n', ...
        M, mmse_c, snr(s_c-s), 10*log10(1/mmse_c));
fprintf('非因果：MMSE=%.3f，SNR=%.2f dB（理论 %.2f dB）\n', ...
        mmse_nc, snr(s_nc-s), 10*log10(1/mmse_nc));

for Mm = [1 5 21]
    hm = toeplitz(Rx(0:Mm-1)) \ Rs(0:Mm-1).';
    fprintf('M=%2d：MMSE=%.3f，SNR=%.2f dB\n', ...
            Mm, 1 - Rs(0:Mm-1)*hm, snr(filter(hm,1,x)-s));
end
```

> [!note] 工具箱与频率坐标
> 只用基础 MATLAB；`w` 为归一化角频率（rad/sample），与连续 $\omega$ 差因子 $f_s$；$H$ 与 MMSE 积分中的 $1/f_s$ 和 $\mathrm{d}\omega$ 相消，故可直接用归一化谱计算。

## 四、结果与理论对照

| 方案 | 使用观测 | MMSE 理论 | 输出 SNR 理论 | 仿真输出 SNR |
| --- | --- | --- | --- | --- |
| 不滤波 | — | 0.500 | 3.01 dB | 3.0 dB |
| 因果 FIR，$M=1$ | $X[n]$ | 0.333 | 4.77 dB | 4.8 dB |
| 因果 FIR，$M=5$ | 5 点 | 0.210 | 6.78 dB | 6.8 dB |
| 因果 FIR，$M=21$ | 21 点 | 0.209 | 6.80 dB | 6.8 dB |
| 非因果 | 整段 | 0.152 | 8.17 dB | 8.2 dB |

$M=1$ 只有一个加权系数，输出仅 4.8 dB；$M=5$ 已达 6.8 dB，继续加到 21 几乎不变——AR(1) 的相关按 $0.9^{|k|}$ 衰减，5 点之后新抽头信息很少。非因果比因果高约 1.4 dB，这是使用未来样本换来的。噪声方差也影响增益：$\sigma_v^2=0.1$（输入 10 dB）时非因果输出约 12.1 dB，增益仅 2.1 dB；$\sigma_v^2=1$（输入 0 dB）时输出约 5.6 dB，增益 5.6 dB，噪声越大相对收益越明显。

## 五、思考题与易错点

- 输出 SNR 必须用 $\sigma_S^2/\mathrm{MMSE}$；用 $(1-\mathrm{MMSE})/\mathrm{MMSE}$ 会把因果滤波器的信号失真错算成“信号功率”。
- 非因果 Wiener 零相位但需要未来样本，只能离线；实时系统只能用因果版本或加延迟的因果版本。
- 正规方程的 $\mathbf{R}_{XX}$ 对角线要加 $\sigma_v^2$，漏掉噪声项会得到过度自信、实际发散的解。
- 生成单位方差 AR(1) 时创新方差应取 $\sigma_w^2=1-a^2$，否则输入 SNR 与理论表对不上。
- 噪声方差估计偏大 → 过度平滑、信号失真；偏小 → 抑制不足；实际系统要在线估计 $\sigma_v^2$。

## 关联

- **上一节**：[[vault-notes/random-signals/11-white-noise-through-filter]] ｜ **下一节**：[[vault-notes/random-signals/11-awgn-ber-experiment]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 理论：[[vault-notes/communication/03-random-processes]]、[[vault-notes/communication/09-optimal-reception]]
- 系统与工具：[[vault-notes/dsp/01-discrete-time-systems]]、[[vault-notes/matlab/matlab-notes]]
