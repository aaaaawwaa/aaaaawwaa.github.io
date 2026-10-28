---
title: MATLAB 与 DSP 仿真
description: MATLAB 基础语法与矩阵运算、常用信号处理函数，以及实验六"数字信号与系统产生软件设计"的完整实现思路。
tags:
  - programming
  - matlab
  - dsp
---

## 为什么 DSP 验证先用 MATLAB

在把算法写进 FPGA 或 DSP 芯片之前，先用 MATLAB 把"信号长什么样、频谱对不对、参数是否满足采样定理"验证一遍，是最省时间的做法。MATLAB 的优势在于：矩阵就是语言本身（一行代码完成一次矩阵乘法）、信号处理工具箱提供现成函数、画图与调试方便。代价是它的下标从 1 开始、默认按列存储、点运算与矩阵运算容易混淆——这些坑必须在写第一个仿真脚本时就搞清楚。

本文分三部分：基础语法与矩阵运算、DSP 常用函数、实验六（线性调频多目标测距）的逐段实现。语法细节的完整笔记见 [[vault-notes/matlab/matlab-notes|MATLAB 基础函数与语法]]，实验代码见 [[vault-notes/matlab/experiment-06-dsp-design|实验六 数字信号与系统产生软件设计与实现]]。与 Python 的对照见 [[programming/python-numpy-dsp|Python NumPy 与 DSP]]。

## 基础语法与矩阵运算

### 矩阵与向量

MATLAB 的一切都是矩阵：标量是 $1\times1$，向量是 $1\times n$ 或 $n\times1$。

```matlab
a = [1 2 3; 4 5 6];        % 2x3，分号换行、空格/逗号分列
row = [1, 2, 3];            % 行向量
col = [1; 2; 3];            % 列向量
t = 0:0.01:1;               % 冒号法：0 到 1 步长 0.01
t = linspace(0, 1, 100);    % 从 0 到 1 等分 100 个点（含端点）
z = zeros(1, 100);          % 全 0
o = ones(2, 3);             % 全 1
e = eye(3);                 % 单位阵
r = rand(1, 1000);          % [0,1) 均匀随机数
n = randn(1, 1000);         % 标准正态随机数（生成高斯噪声用）
```

**索引从 1 开始**（不是 0）：

```matlab
A = magic(4);
A(2, 3)          % 第 2 行第 3 列
A(1, :)          % 第 1 行全部
A(:, 2)          % 第 2 列全部
A(1:2, 2:3)      % 子矩阵
A(end, end)      % end 表示最后一个下标
idx = find(A > 10);   % 返回满足条件的线性索引
```

**逻辑索引**是 MATLAB 最常用的向量化技巧：`x(x>0)` 取出所有正值，`y = x(x>0).^2` 直接平方，不必写循环。`size`、`numel`、`length`、`reshape`、`repmat`、`squeeze` 用于尺寸操作；`sum`、`mean`、`max`、`min`、`std`、`var` 默认沿第一维（列）运算，对矩阵按行求和要写 `sum(X, 2)`。

### 矩阵运算与点运算

这是 MATLAB 最大的易错点：

| 运算 | 矩阵意义 | 逐元素意义 |
| --- | --- | --- |
| `*` / `.*` | 矩阵乘法 | 对应元素相乘 |
| `/` / `./` | 矩阵右除（解方程） | 对应元素相除 |
| `^` / `.^` | 矩阵幂 | 对应元素求幂 |
| `'` / `.'` | 共轭转置 | 普通转置 |

```matlab
t = 0:0.1:1;
s = sin(2*pi*t);       % 向量
y1 = 1./t;             % 逐元素取倒数
y2 = exp(-t).*cos(t);  % 逐元素相乘
% y3 = exp(-t)*cos(t); % 错误：矩阵维度不一致
```

从 R2016b 起 MATLAB 支持**隐式扩展**（broadcasting）：`[1;2;3] + [10 20]` 得到 $3\times2$ 矩阵。它让"每个样本减均值"可以写成 `X - mean(X)`（按列）或 `X - mean(X,2)`（按行），但要清楚扩展方向，否则会静默算出错误尺寸的结果。

### 流程控制、函数与匿名函数

```matlab
if x > 0
    disp('正');
elseif x == 0
    disp('零');
else
    disp('负');
end

for k = 1:N
    err = err + (rx(k) ~= bits(k));
end

while norm(x - x_old) > 1e-6
    x_old = x;
    x = update(x);
end
```

函数文件要求文件名与函数名一致：

```matlab
function y = qfun(x)
% Q 函数：标准正态分布右尾概率
y = 0.5 * erfc(x / sqrt(2));
end
```

**匿名函数**适合快速定义公式（通信仿真常用）：

```matlab
qfunc  = @(x) 0.5*erfc(x/sqrt(2));
Pe_bpsk = @(EbN0) qfunc(sqrt(2*EbN0));
Pe_bpsk(10)
```

### 绘图与常用换算

```matlab
t = 0:0.001:2;
plot(t, sin(2*pi*5*t), 'b-', 'LineWidth', 1.5);
hold on;
plot(t, 0.5*sin(2*pi*10*t), 'r--');
hold off;
xlabel('时间 t / s'); ylabel('幅度');
title('叠加波形'); legend('5 Hz 分量', '10 Hz 分量');
grid on; axis([0 2 -1.5 1.5]);
```

常用换算：`snr_linear = 10^(snr_dB/10)`；`power_dBm = 10*log10(power_mW)`；幅度与功率的 dB 差 2 倍（$20\log_{10}$ 对幅度、$10\log_{10}$ 对功率）。画频谱一律用 `plot(f, abs(X))` 或 `plot(f, 20*log10(abs(X)))` 并标明横轴单位。

## DSP 常用函数

### 信号生成与噪声

```matlab
fs = 1000; t = (0:999)/fs;
x = 3*cos(2*pi*100*t + pi/4);        % 单频
chirp_sig = chirp(t, 0, 1, 200);      % 线性调频（0 Hz -> 200 Hz）
n = sigma * randn(1, numel(t));       % 高斯白噪声
s = x + n;                            % 加噪
```

通信仿真中还有个高频用法：用 `randi([0 1],1,N)` 生成比特、`2*bits-1` 转双极性、`exp(1j*2*pi*f*t)` 生成复载波。

### FFT 与频谱

```matlab
fs = 1000; N = length(s);
S = fft(s);                       % 双边谱，未归一化
f = (0:N-1) * fs / N;             % 频率轴
plot(f(1:N/2), 2*abs(S(1:N/2))/N);% 单边幅度谱
```

要点：

- `fft` 输出是**双边谱**，正频率幅度要乘以 2（直流与奈奎斯特点除外），并除以 $N$ 才得到物理幅度；
- 对实信号，频谱共轭对称，通常只看 $0\sim f_s/2$；
- 用 `fftshift` 把零频移到中心，频率轴改为 `(-N/2:N/2-1)*fs/N`；
- 频率分辨率 $\Delta f=f_s/N=1/T$，**补零只改变显示点数，不提高物理分辨率**；
- 加窗（`hann`、`hamming`、`blackman`）减小泄漏，但主瓣变宽、幅度要按窗函数相干增益归一化。

### 滤波器与相关函数

```matlab
b = fir1(64, 0.2);                 % 64 阶低通，归一化截止 0.2（Nyquist=1）
y = filter(b, 1, x);               % 滤波（FIR）
[h, w] = freqz(b, 1, 1024, fs);    % 频率响应
[b2, a2] = butter(4, 0.2);         % 4 阶 Butterworth
y2 = filter(b2, a2, x);
r = xcorr(x, y, 'biased');         % 互相关
c = conv(x, h);                    % 卷积
```

注意 `filter` 与 `conv` 的区别：`filter` 实现因果差分方程（有状态、适合流式处理），`conv` 是有限长序列的线性卷积（结果长度 $N+M-1$）。`fir1` 的截止频率是归一化到奈奎斯特频率的（1 对应 $f_s/2$），不是 Hz。

### 常用通信/DSP 小函数

- 误差函数：`erfc`、`erf`；Q 函数用 `0.5*erfc(x/sqrt(2))` 自己封装。
- 窗函数：`hann`、`hamming`、`blackman`、`kaiser`。
- 重采样：`resample(x, p, q)`（需要 Signal Processing Toolbox）。
- 功率谱：`pwelch`（Welch 法）、`spectrogram`（时频图）。
- 随机数：`rng(seed)` 固定种子，保证结果可复现；仿真论文/作业应写明种子。

## 实验六：线性调频多目标测距

### 任务与原理

实验六"数字信号与系统产生软件设计"要求用软件生成线性调频（LFM，chirp）信号、模拟多目标回波、加噪与 ADC 量化，再通过 Dechirp（去斜）混频与 FFT 估计目标距离。整体流程：

```text
生成 LFM 发射信号 → 多目标回波叠加 → 加高斯噪声 → ADC 量化
→ 与发射信号共轭混频（Dechirp）→ 加窗 FFT → 峰值检测 → 距离估计
```

**测距原理**：发射信号 $s(t)=e^{j2\pi(f_0t+\frac12Kt^2)}$，其中调频斜率 $K=B/T$。目标距离 $R$ 对应时延 $\tau=2R/c$，回波为 $s(t-\tau)$。与发射信号共轭混频后：

$$
s(t-\tau)\cdot s^{*}(t)
=e^{j2\pi\left(f_0(t-\tau)+\frac12K(t-\tau)^2-f_0t-\frac12Kt^2\right)}
=e^{-j2\pi f_0\tau}\cdot e^{j2\pi K\tau t}\cdot e^{-j\pi K\tau^2}
$$

除常数相位外，得到**单频信号**，拍频 $f_b=K\tau$。于是

$$
R=\frac{c\,\tau}{2}=\frac{c\,f_b}{2K}
$$

距离与拍频成正比——这就是"用 FFT 测频来测距"。多个目标就是多个单频分量之和，FFT 后出现多个峰。

### 参数设计

| 参数 | 取值 | 约束/说明 |
| --- | --- | --- |
| 带宽 $B$ | 20 MHz | 距离分辨率 $\Delta R=c/(2B)=7.5$ m |
| 脉宽 $T$ | 1 ms | 决定最小可分辨距离与能量 |
| 采样率 $f_s$ | 50 MHz | 需满足 $B<f_s/2$，且最大拍频小于 $f_s/2$ |
| 调频斜率 $K$ | $B/T=2\times10^{13}$ Hz/s | 决定"频率—距离"换算系数 |
| 目标距离 | 30、60、120 m | 对应时延 0.2、0.4、0.8 μs |
| 信噪比 | 25 dB | 加性复高斯噪声 |

**采样约束检查**：最大拍频 $f_{b,\max}=K\tau_{\max}=2\times10^{13}\times0.8\times10^{-6}=16$ MHz，小于 $f_s/2=25$ MHz，满足奈奎斯特；同时 chirp 瞬时带宽 20 MHz 也小于 25 MHz。**若目标更远，拍频会超过 $f_s/2$ 而发生混叠，测距结果会折叠**。由 FFT 频率上限 $f_s/2$ 反推最大无模糊距离：

$$
R_{\max}=\frac{c\,f_s/2}{2K}=\frac{c\,f_sT}{4B}
=\frac{3\times10^{8}\times50\times10^{6}\times10^{-3}}{4\times20\times10^{6}}=187.5\ \text{m}
$$

所以实验把有效距离限制在 150 m 以内是合理的。

### 第 1 段：生成 LFM 信号

```matlab
%% 1. Chirp 信号生成
B = 20e6;  T = 1e-3;  fs = 50e6;
f0 = 0;    c = 3e8;   K = B/T;

assert(B < fs/2, '当前零起始频率 Chirp 带宽超过奈奎斯特频率');

N = round(T*fs);
t = (0:N-1)/fs;
s = exp(1j*2*pi*(f0*t + 0.5*K*t.^2));
```

`assert` 是"参数自检"的好习惯：带宽、采样率、目标距离等约束在脚本开头检查，比在几千行后调试错误轻松得多。`round(T*fs)` 保证样本数是整数。

### 第 2 段：多目标回波

```matlab
%% 2. 多目标回波模型
R = [30, 60, 120];
target_amp = [1.0, 0.7, 0.4];
assert(numel(R) == numel(target_amp), '目标距离和幅度数量必须相同');

tau = 2*R/c;                 % 双程时延
tt  = t - tau(:);            % 每个目标一行
S   = target_amp(:).*exp(1j*2*pi*(f0*tt + 0.5*K*tt.^2));
mask = (tt >= 0) & (tt < T); % 回波只在照射时间内有效
S    = S.*mask;
r_clean = sum(S, 1);         % 多目标叠加
```

这段用到了 MATLAB 的矩阵化写法：`tt = t - tau(:)` 利用隐式扩展得到 $3\times N$ 矩阵，每行对应一个目标的延时采样；`mask` 保证时延为负（目标"还没被照到"）或超过脉宽的部分不参与叠加。**先构造矩阵再按行求和**，比三重循环快得多，也更接近硬件里"多径叠加"的物理过程。

### 第 3 段：噪声与 ADC 量化

```matlab
%% 3. 添加噪声与 ADC 量化
SNRdB = 25;
Ps = mean(abs(r_clean).^2);          % 信号平均功率
Pn = Ps/10^(SNRdB/10);               % 噪声平均功率

noise = sqrt(Pn/2)*(randn(1,N) + 1j*randn(1,N));  % 复高斯噪声
r_noisy = r_clean + noise;

nbits = 12;  Q = 2^(nbits-1) - 1;
adc_full_scale = 1.05*max([abs(real(r_noisy)), abs(imag(r_noisy))]);

real_q = round(real(r_noisy)/adc_full_scale*Q);
imag_q = round(imag(r_noisy)/adc_full_scale*Q);
real_q = max(-Q, min(Q, real_q));    % 限幅
imag_q = max(-Q, min(Q, imag_q));
r_quant = (real_q + 1j*imag_q)*adc_full_scale/Q;
```

要点：

- 复高斯噪声的每路实部/虚部方差为 $P_n/2$，所以幅度系数是 $\sqrt{P_n/2}$；两路相加后的总功率才是 $P_n$。只写 `sqrt(Pn)*randn` 会多 3 dB。
- ADC 满量程取 `1.05*max`，留 5% 余量防止削顶；`round` 后必须 `max/min` 限幅，否则溢出会回绕。
- 12 位量化的理论信噪比约 $6.02\times12+1.76\approx74$ dB，远高于 25 dB 的噪声，量化不是主要误差源；如果 SNR 提高到 60 dB 以上，就要认真评估量化与削顶。

### 第 4 段：Dechirp 混频

```matlab
%% 4. Dechirp 混频
x = conj(r_quant).*s;     % 回波共轭 × 发射信号
```

混频得到拍频信号，理想情况下是若干复指数之和。**注意共轭乘的方向**：`conj(回波).*发射` 与 `conj(发射).*回波` 得到的是共轭频率（正负相反），距离轴会翻转。推导时先写清哪一路取共轭，代码里保持同一约定。

### 第 5 段：加窗 FFT 与距离轴

```matlab
%% 5. FFT 频谱分析
Nfft = N;
n = 0:N-1;
w = 0.5 - 0.5*cos(2*pi*n/(N-1));      % Hann 窗
X = fft(x.*w, Nfft);

Nhalf = floor(Nfft/2);
f_axis = (0:Nhalf)*fs/Nfft;           % 正频率轴
P = abs(X(1:Nhalf+1))/sum(w);         % 窗归一化后的幅度
R_axis = c*f_axis/(2*K);              % 频率 -> 距离
```

- **加窗**抑制强目标的频谱泄漏掩盖弱目标；代价是主瓣展宽（Hann 主瓣约为矩形窗的 2 倍），近距离多目标的分辨会变差。幅度除以 `sum(w)` 是补偿窗的相干增益。
- **距离轴**由 $R=c f/(2K)$ 逐点换算，注意 `f_axis` 的单位是 Hz、`R_axis` 是 m。
- 距离分辨率由带宽决定：$\Delta R=c/(2B)=7.5$ m；而 FFT 的频率栅格 $\Delta f=f_s/N=1/T$ 对应距离栅格 $c/(2K T)=c/(2B)$，两者一致——**分辨率由带宽决定，栅格由脉宽决定**（补零只能细化栅格、不能提高分辨率）。

### 第 6 段：峰值检测与距离估计

```matlab
%% 6. 多目标检测
R_max = 150;
valid = (R_axis > 0) & (R_axis <= R_max);

peak_idx = find(P(2:end-1) > P(1:end-2) & ...
                P(2:end-1) >= P(3:end)) + 1;   % 局部极大
threshold = 0.15*max(P(valid));                % 相对门限
peak_idx = peak_idx(valid(peak_idx) & P(peak_idx) >= threshold);

f_est = f_axis(peak_idx);
R_est = c*f_est/(2*K);

fprintf('检测到 %d 个目标\n', numel(R_est));
for k = 1:numel(R_est)
    fprintf('目标%d：频率 %.1f Hz，距离 %.2f m\n', k, f_est(k), R_est(k));
end
```

峰值检测的三个条件：局部极大、落在有效距离范围、超过相对门限。**门限取最大峰的 15%** 是经验值，实际系统要按虚警概率与检测概率设计（参见 [[signal-processing/random-processes|随机信号、估计与检测]]）。弱目标（0.4 幅度）能否被检出，取决于它是否高于旁瓣与噪声；Hann 窗的旁瓣约 $-31$ dB，通常够用。

### 第 7 段：可视化

```matlab
%% 7. 可视化
figure('Name', 'Chirp 多目标测距');

subplot(3,1,1);
Nshow = round(20e-6*fs);
plot(t(1:Nshow)*1e6, real(s(1:Nshow)));
xlabel('时间 / us'); ylabel('实部'); title('Chirp 发射信号'); grid on;

subplot(3,1,2);
idx = 1:50:N;                       % 抽点显示，避免曲线过密
plot(t(idx)*1e3, real(x(idx)));
xlabel('时间 / ms'); ylabel('实部'); title('Dechirp 混频信号'); grid on;

subplot(3,1,3);
plot(R_axis, P, 'LineWidth', 1); hold on;
plot(R_est, P(peak_idx), 'ro', 'MarkerSize', 8);
xlabel('距离 / m'); ylabel('幅度');
title('FFT 距离谱与目标检测'); xlim([0, R_max]); grid on;
```

画图时注意：时域图抽点显示（`1:50:N`），否则 5 万个点画在一起看不清；距离谱用完整点数才能看出峰。

## 结果怎么读、误差从哪来

按设计参数可以算出几个"应该看到"的量（这些是参数推算，不是仿真运行结果）：

- 三个目标应出现在 30、60、120 m 附近，对应拍频 4、8、16 MHz；
- 距离栅格约 7.5 m，所以估计值会在真值附近一个栅格内；
- 距离分辨率 7.5 m，30 m 与 60 m 相隔 4 个栅格，可以分开；若两个目标相距小于 7.5 m，主瓣会重叠成一个峰。

常见误差来源与对策：

| 误差源 | 表现 | 对策 |
| --- | --- | --- |
| 频谱泄漏 | 强目标旁瓣抬高底噪 | 加窗、提高动态范围 |
| 栅格量化（straddle loss） | 峰不在栅格上，幅度与频率有偏 | 补零、插值（如三点抛物线插值） |
| 拍频混叠 | 远目标折叠到近处 | 检查 $f_{b,\max}<f_s/2$，必要时提高 $f_s$ |
| ADC 削顶 | 大目标产生谐波/互调 | 留足满量程余量或自动增益控制 |
| 多目标相互干扰 | 弱目标被强目标旁瓣淹没 | 窗函数、干扰对消、更高分辨率带宽 |
| 噪声 | 峰值抖动、虚警 | 相干积累、门限设计 |

## MATLAB 与 Python 的对应

| 功能 | MATLAB | NumPy/SciPy |
| --- | --- | --- |
| 矩阵乘法/逐元素 | `*` / `.*` | `@` / `*` |
| FFT | `fft` | `np.fft.fft` |
| 频率轴 | `(0:N-1)*fs/N` | `np.fft.fftfreq(N, 1/fs)` |
| 卷积 | `conv` | `np.convolve` / `scipy.signal.convolve` |
| FIR 设计 | `fir1` | `scipy.signal.firwin` |
| 加窗 | `hann(N)` | `scipy.signal.windows.hann(N)` |
| 生成功率谱 | `pwelch` | `scipy.signal.welch` |

迁移时最容易错的三点：**下标从 1 变 0**、`fft` 的归一化约定、`fir1` 的归一化截止频率（MATLAB 以奈奎斯特为 1，SciPy 的 `firwin` 默认以采样率为 1）。

## 易错点

> [!warning] MATLAB 仿真最常见的坑
> 1. **点运算漏写**：`exp(-t)*cos(t)` 会按矩阵乘法报错或得到错误尺寸；逐元素运算一律用 `.*`、`./`、`.^`。
> 2. **下标从 1 开始**：循环 `for k=1:N` 没有 0 号元素；从 C/Python 迁移时最容易越界或漏掉首元素。
> 3. **复噪声功率算错**：复高斯两路各 `sqrt(Pn/2)`，只写一路会差 3 dB。
> 4. **FFT 幅度未归一化**：`abs(fft(x))` 的峰值约等于 $N/2$ 倍幅度（实信号单边谱），不除以 $N$、不乘 2 会得到"错误增益"。
> 5. **补零当提高分辨率**：补零只细化频率栅格，物理分辨率仍由观测时长/带宽决定。
> 6. **共轭方向不一致**：Dechirp 中回波与发射谁取共轭决定拍频正负，混用会让距离轴镜像。
> 7. **随机结果不可复现**：忘记 `rng(seed)`，同一脚本两次运行结果不同，无法定位问题。

## 前置与相关

前置：[[programming/python-numpy-dsp|Python NumPy 与 DSP]]（向量化与频谱分析的基本概念）、[[signal-processing/dft-and-fft|DFT 与 FFT]]（FFT 的数学原理）、[[mathematics/complex-transforms-and-fields|复变变换与场论]]（复指数、傅里叶变换）。相关：[[signal-processing/random-processes|随机信号、估计与检测]]（噪声、检测与门限）、[[signal-processing/random-signal-experiments|随机信号实验]]（同类实验的组织方式）、[[signal-processing/random-signals-formula-sheet|随机信号处理公式速查]]、[[mathematics/statistics-inference|数理统计与推断]]（仿真结果的置信区间）。

## 来源与延伸阅读

- [[vault-notes/matlab/matlab-notes|MATLAB 基础函数与语法（详细笔记）]]：基础语法、矩阵与向量、点运算、流程控制、函数与匿名函数、数学函数、绘图、通信仿真高频函数、实用技巧。
- [[vault-notes/matlab/experiment-06-dsp-design|实验六 数字信号与系统产生软件设计与实现（详细笔记）]]：Chirp 生成、多目标回波、噪声与 ADC 量化、Dechirp 混频、FFT 频谱、多目标检测、可视化，附完整可运行代码。
