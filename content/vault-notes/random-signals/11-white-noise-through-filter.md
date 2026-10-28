---
title: "白噪声通过滤波器"
tags:
- 随机信号处理
- 11-MATLAB实验
- 白噪声
- 数字滤波
- 噪声带宽
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

# 🎚️ 白噪声通过滤波器

> [!abstract] 这个实验做什么
> 让方差为 $\sigma^2$ 的离散白噪声通过一个 63 阶低通 FIR，验证输出 PSD 满足 $S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega)$，输出功率满足 $P_Y=\sigma^2\sum_n\lvert h[n]\rvert^2$。
> 同时计算等效噪声带宽 $B_n$，并比较理论值、Welch 谱估计与输出方差；预期结论是“输出功率由滤波器能量决定，而不是只看通带宽度”。

## 一、实验目的

- 掌握离散白噪声的方差、双边 PSD 与 $N_0$ 的换算关系。
- 用 `filter` 实现 LTI 滤波，验证输入输出功率谱关系与 Parseval 等式。
- 理解等效噪声带宽 $B_n$ 的定义与工程意义。
- 观察 FIR 阶数、截止频率对输出功率和噪声带宽的影响。

## 二、原理与公式

方差为 $\sigma^2$ 的离散白噪声，其连续等效双边 PSD 在 $\lvert\omega\rvert\le\pi f_s$ 内为常数：

$$
S_X(\omega)=\frac{N_0}{2}=\frac{\sigma^2}{f_s}
$$

这里 $N_0=2\sigma^2/f_s$ 是单边 PSD。白噪声通过冲激响应为 $h[n]$ 的 LTI 系统后，

$$
S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega)
$$

对输出功率，用 Parseval 定理可直接在时域算：

$$
P_Y=\frac{1}{2\pi}\int_{-\pi f_s}^{\pi f_s}S_Y(\omega)\,\mathrm{d}\omega=\sigma^2\sum_{n}\lvert h[n]\rvert^2
$$

单边等效噪声带宽定义为

$$
B_n=\frac{1}{\lvert H(0)\rvert^2}\int_0^{f_s/2}\lvert H(f)\rvert^2\,\mathrm{d}f=\frac{f_s\sum_n\lvert h[n]\rvert^2}{2\lvert H(0)\rvert^2}
$$

于是白噪声输入时 $P_Y=N_0B_n\lvert H(0)\rvert^2$。注意 $B_n$ 不是 3 dB 带宽，它把滤波器的总噪声功率等效成一个矩形通带。

| 设计参数 | 取值 | 说明 |
| --- | --- | --- |
| 采样率 $f_s$ | 8000 Hz | Nyquist 4000 Hz |
| FIR 阶数 | 63 | 64 个抽头 |
| 截止频率 | 1250 Hz | `fir1` 的 -6 dB 点 |
| 窗函数 | Hamming | 阻带约 52 dB |

## 三、MATLAB 代码

```matlab
clear; close all; clc;
rng(23, 'twister');
fs = 8000; N = 2^16; sigma2 = 1;
x = sqrt(sigma2)*randn(N,1);          % 离散白噪声
order = 63; fc = 1250;                % 阶数、截止频率
h = fir1(order, fc/(fs/2), 'low', hamming(order+1));
y = filter(h, 1, x);                  % Y[n] = h * X[n]
P_theory = sigma2*sum(h.^2);          % Parseval
H0 = sum(h);                          % |H(0)|
Bn_theory = fs*sum(h.^2)/(2*H0^2);    % 单边噪声带宽
P_meas = var(y);
[Pyy, f] = pwelch(y, hamming(1024), 512, 1024, fs);
[Hf, fh] = freqz(h, 1, 1024, fs);
Sx = sigma2/fs;                       % 双边 PSD，单位 功率/Hz
Sy_one_sided = 2*abs(Hf).^2*Sx;       % 单边输出 PSD
Sy_one_sided(1) = abs(Hf(1))^2*Sx;    % DC 不翻倍
Bn_num = trapz(fh, abs(Hf).^2)/abs(H0)^2;
figure;
plot(fh, 10*log10(Sy_one_sided), 'k-', 'LineWidth', 1.5); hold on;
plot(f, 10*log10(Pyy), 'b-');
xlabel('f / Hz'); ylabel('S_Y^+(f) / (dB/Hz)');
legend('|H(f)|^2 S_X^+(f)', 'Welch 估计'); grid on; xlim([0 fs/2]);
title('白噪声通过低通 FIR 的输出谱');
fprintf('输出功率：理论 %.4f，仿真 %.4f\n', P_theory, P_meas);
fprintf('噪声带宽：理论 %.1f Hz，数值积分 %.1f Hz\n', Bn_theory, Bn_num);
fprintf('直流增益 H(0)=%.4f，1.5 kHz 处增益=%.1f dB\n', ...
        H0, 20*log10(abs(interp1(fh, abs(Hf), 1500))));
```

> [!note] 工具箱与量纲
> `fir1`、`freqz`、`pwelch`、`hamming` 属于 Signal Processing Toolbox。`pwelch` 对实信号默认输出单边谱；理论式是双边谱，代码中用 $2S_X$ 转成单边后才能直接比。

## 四、结果与理论对照

通带内理论单边 PSD 为 $2\sigma^2/f_s=2.5\times10^{-4}$，即 -36 dB/Hz，Welch 曲线与黑线基本重合；1.25 kHz 附近开始滚降，1.5 kHz 以后进入约 -52 dB 的阻带。阻带内真实 PSD 很小，Welch 估计的相对起伏反而更明显。

| 量 | 理论 | 仿真 | 相对误差 |
| --- | --- | --- | --- |
| 输出功率 $P_Y$ | $\sigma^2\sum h^2\approx0.301$ | `var(y)` $\approx0.30$ | $<2\%$ |
| 噪声带宽 $B_n$ | $\approx1204$ Hz | 数值积分 $\approx1204$ Hz | $<1\%$ |
| 直流增益 $H(0)$ | 1.000 | 1.000 | — |
| 阻带衰减（$f>1.5$ kHz） | — | $\approx52$ dB | — |

若只按截止频率 1250 Hz 估算输出功率，会得到 $1250\times2.5\times10^{-4}\approx0.31$，与真值 0.301 接近只是巧合；换一个滚降更慢的滤波器，两者会明显分开。可靠的做法始终是 $\sigma^2\sum h^2$ 或 $N_0B_n\lvert H(0)\rvert^2$。

## 五、思考题与易错点

- 白噪声的“功率”是方差 $\sigma^2$，不是 PSD；离散白噪声的双边 PSD 是 $\sigma^2/f_s$，两者差一个 $f_s$。
- `fir1(n, ...)` 的 $n$ 是**阶数**，滤波器长度是 $n+1$；`Wn` 要除以 Nyquist 频率 $f_s/2$。
- 输出功率不是 $\sigma^2\lvert H(0)\rvert^2$（那只适用于直流），必须对 $\lvert H(f)\rvert^2$ 积分或用 $\sum h^2$。
- $B_n$ 的分母是 $\lvert H(0)\rvert^2$，积分限是单边 $[0,f_s/2]$；不要与半功率带宽混淆。

## 关联

- **上一节**：[[vault-notes/random-signals/11-psd-estimation-experiment]] ｜ **下一节**：[[vault-notes/random-signals/11-wiener-filtering-experiment]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 系统与实现：[[vault-notes/dsp/01-discrete-time-systems]]、[[vault-notes/dsp/05-filter-structures]]
- 滤波器设计：[[vault-notes/dsp/07-fir-filter-design]]、[[vault-notes/matlab/matlab-notes]]
