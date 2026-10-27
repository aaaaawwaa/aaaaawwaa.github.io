---
title: "功率谱估计实验"
tags:
- 随机信号处理
- 11-MATLAB实验
- 功率谱估计
- 周期图
- Welch
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

# 📊 功率谱估计实验

> [!abstract] 这个实验做什么
> 对同一段 AR(1) 数据分别用 `periodogram` 与 `pwelch` 估计功率谱，并与理论 $S_X(\omega)$ 对照。
> 重点观察窗函数与分段平均如何用频率分辨率换取方差下降；预期结论是周期图渐近无偏但方差约 100%，Welch 平滑得多但分辨率变粗。

## 一、实验目的

- 掌握周期图与 Welch 法的区别，理解“分辨率”和“方差”是一对矛盾。
- 验证 AR(1) 的理论 PSD，并正确处理单边谱、双边谱与 dB 换算。
- 学会判断谱估计中的偏差（窗主瓣展宽）与随机起伏。

## 二、原理与公式

对采样率 $f_s$ 的离散过程，归一化角频率 $\Omega=2\pi f/f_s$。AR(1) 的离散 PSD 为

$$S_X(e^{j\Omega})=\frac{\sigma_w^2}{\lvert 1-ae^{-j\Omega}\rvert^2}$$

换成以 $\omega=2\pi f$（rad/s）为自变量的双边谱，并写出实过程的单边谱：

$$S_X(\omega)=\frac{1}{f_s}S_X(e^{j\omega/f_s}),\qquad S_X^+(f)=2S_X(2\pi f),\quad f>0$$

周期图是单段数据的模平方谱：

$$\hat S_X^{per}(f)=\frac{1}{f_sN}\left|\sum_{n=0}^{N-1}x[n]e^{-j2\pi fn/f_s}\right|^2$$

它的频率分辨率约为 $f_s/N$，但对每个频点只有约 2 个自由度的平均，相对标准差接近 100%，增加 $N$ 只会让谱线更密，不会让曲线更平滑。Welch 法把数据分成 $K$ 段、加窗、重叠，再平均：

$$\hat S_X^{W}(f)=\frac{1}{K}\sum_{k=1}^{K}\hat S_{X,k}(f)$$

分辨率约为 $\mathrm{ENBW}\cdot f_s/L$，相对标准差约为 $1/\sqrt{K_{\mathrm{eff}}}$。

| 方法 | 数据段 | 频率分辨率 | 相对标准差 | 积分功率 |
| --- | --- | --- | --- | --- |
| 周期图 | 1 段，$N=2^{14}$ | $f_s/N\approx0.061$ Hz | $\approx100\%$ | $\approx1$ |
| Welch | $K\approx127$，$L=256$，50% 重叠 | $1.36f_s/L\approx5.3$ Hz | $\approx9\%$ | $\approx1$ |
| 理论 | — | — | 0 | 1.000 |

## 三、MATLAB 代码

```matlab
clear; close all; clc;
rng(11, 'twister');
fs = 1000; a = 0.9;
sigma_w = sqrt(1-a^2);          % 令 X[n] 的方差为 1
N = 2^14;
x = filter(1, [1 -a], sigma_w*randn(N,1));

% 理论单边 PSD（V^2/Hz）：S_X^+(f) = 2*S_X(e^{j2*pi*f/fs})/fs
f = linspace(0, fs/2, 2001);
Sx_dt = sigma_w^2 ./ abs(1 - a*exp(-1j*2*pi*f/fs)).^2;
Sx_theory = 2*Sx_dt/fs;

[Pper, fper] = periodogram(x, rectwin(N), N, fs);    % 单边周期图
[Pw, fw] = pwelch(x, hamming(256), 128, 256, fs);    % 单边 Welch

figure;
semilogy(f, Sx_theory, 'k-', 'LineWidth', 1.5); hold on;
semilogy(fper, Pper, 'Color', [0.6 0.6 0.6]);
semilogy(fw, Pw, 'b-', 'LineWidth', 1.2);
xlabel('f / Hz'); ylabel('S_X^+(f) / (V^2/Hz)');
legend('理论', '周期图', 'Welch'); grid on; xlim([0 fs/2]);
title('AR(1) 过程的功率谱估计');

K = floor((N - 128)/128);        % 50% 重叠的分段数
fprintf('周期图：Δf≈%.3f Hz，相对标准差≈100%%\n', fs/N);
fprintf('Welch：K=%d，Δf≈%.1f Hz，相对标准差≈%.0f%%\n', ...
        K, 1.36*fs/256, 100/sqrt(K));
fprintf('积分功率：Welch %.3f，理论 1.000\n', trapz(fw, Pw));
```

> [!note] 工具箱与单双边谱
> `periodogram`、`pwelch`、`rectwin`、`hamming` 属于 Signal Processing Toolbox。对实信号它们默认返回**单边** PSD；若要双边谱，加参数 `'twosided'`，并注意此时不再乘 2。

## 四、结果与理论对照

周期图的包络与理论曲线一致，但谱线呈“草丛”状，单个频点可在理论值上下一个数量级波动；Welch 曲线明显平滑，整体贴合理论，代价是 5 Hz 左右的细节被抹平，低 PSD 区域的相对起伏也更显眼。

| 量 | 理论 | 周期图（单次） | Welch |
| --- | --- | --- | --- |
| $S_X^+(50\text{ Hz})$ | $3.9\times10^{-3}$ | $10^{-4}\sim10^{-2}$ | $(3.5\sim4.2)\times10^{-3}$ |
| $\int_0^{f_s/2}S_X^+(f)\,\mathrm{d}f$ | 1.000 | $\approx1.00$ | $\approx1.00$ |
| 频率分辨率 | — | 0.061 Hz | 5.3 Hz |
| 相对标准差 | 0 | $\approx100\%$ | $\approx9\%$ |

这说明周期图是**不一致估计**：$N\to\infty$ 时偏差趋于零，但方差不会趋于零；Welch 用分段平均把方差降到约 $1/K$，代价是分辨率由 $f_s/L$ 决定，而不再由总长度 $N$ 决定。若两条谱线只隔 2 Hz，周期图能分开，Welch 分不开。

## 五、思考题与易错点

- 纵轴用 dB 时，PSD 是功率量，应算 $10\log_{10}$，不是 $20\log_{10}$。
- 理论式若是双边谱，画图前要乘 2 换成单边；`pwelch` 默认已经是单边，别再乘一次。
- 增大 $N$ 只减小周期图的频率间隔，不降低方差；要让曲线平滑必须做分段平均或平滑。
- 窗长 $L$ 越大分辨率越高、方差越大；重叠率提高会增加分段数，但相邻段相关，$K_{\mathrm{eff}}$ 小于名义 $K$。
- 信号含直流时先 `x - mean(x)` 或 `detrend`，否则 0 Hz 附近的大峰通过窗主瓣泄漏，抬高整段低频谱。

## 关联

- **上一节**：[[vault-notes/random-signals/11-autocorrelation-estimation-experiment]] ｜ **下一节**：[[vault-notes/random-signals/11-white-noise-through-filter]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 频域理论：[[vault-notes/dsp/03-discrete-fourier-transform]]、[[vault-notes/dsp/04-fast-fourier-transform]]
- 工具与理论：[[vault-notes/matlab/matlab-notes]]、[[vault-notes/communication/03-random-processes]]
