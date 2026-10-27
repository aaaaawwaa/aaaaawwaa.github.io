---
title: "实验六 数字信号与系统产生软件设计与实现"
---

# 代码拆分和解析

## 1. Chirp信号的生成

```matlab
%% 1. Chirp信号生成
B = 20e6;  % 带宽为20MHz
T = 1e-3; % 时长为1ms
fs = 50e6; % 采样频率为50MHz，满足奈奎斯特采样定理
f0 = 0; % 起始频率为0

c = 3e8; % 光速
K = B/T; % chirp的斜率

assert(B < fs/2, '当前零起始频率Chirp带宽超过奈奎斯特频率');

N = round(T*fs);  % round()取四舍五入
t = (0:N-1)/fs;

s = exp(1j*2*pi*(f0*t + 0.5*K*t.^2));
```

> [!abstract] 核心定义
> 线性调频信号是一种**频率随时间线性变化**的信号。它的瞬时频率是随时间线性增加的，因此称为“线性调频信号”。
设起始频率为 \(f_0\)，带宽为 \(B\)，信号总时长为 \(T\)，则**瞬时频率**为：
>$$
>f(t) = f_0 + Kt \quad \text{其中} \quad K = \frac{B}{T}
>$$
>即瞬时频率从 \(f_0\) 逐渐增加到 \(f_0 + B\)。

> assert函数的作用 ： **断言某个条件必须成立；如果不成立，就立即报错并停止执行**

- 真实的雷达发射信号是实信号（取实部 `real(s)`），但在数字信号处理和雷达仿真中，通常直接生成并使用复数信号（基带/解析信号），因为它的频谱只有正频率，数学处理（如后面的 FFT 测距）更方便。

## 2. 多目标回波模型

```matlab
%% 2. 多目标回波模型
R = [30,60,120];
target_amp = [1.0,0.7,0.4];

assert(numel(R)==numel(target_amp), '目标距离和幅度数量必须相同');

tau = 2*R/c; % 雷达延时tau

% 每一行对应一个目标
tt = t - tau(:);  %% 计算对应的延时

S = target_amp(:).*exp(1j*2*pi*(f0*tt + 0.5*K*tt.^2));

% 限制每个回波的有效时间
mask = (tt >= 0) & (tt < T);
S = S.*mask;

% 目标回波叠加
r_clean = sum(S,1);
```

限制每个回波的有效时间的目的是
![[vault-notes/assets/experiment-06-dsp-design/fig-01.png]]

如果不使用 `mask`，即使在回波还没有到达的时刻，指数表达式仍然会计算出非零值，这显然不符合物理过程。

## 3. 添加噪声和ADC量化 

```matlab
%% 3. 添加噪声与ADC量化
SNRdB = 25;   % 信噪比为25dB

Ps = mean(abs(r_clean).^2);  % 计算信号的平均功率
Pn = Ps/10^(SNRdB/10);  % 按照信噪比推出噪声的平均功率

noise = sqrt(Pn/2)*(randn(1,N)+1j*randn(1,N)); % 生成复高斯噪声

r_noisy = r_clean + noise; % 叠加噪声

% ADC量化
nbits = 12;  
Q = 2^(nbits-1)-1;

adc_full_scale = 1.05*max([abs(real(r_noisy)),abs(imag(r_noisy))]);

real_q = round(real(r_noisy)/adc_full_scale*Q);
imag_q = round(imag(r_noisy)/adc_full_scale*Q);

% 限幅
real_q = max(-Q,min(Q,real_q));
imag_q = max(-Q,min(Q,imag_q));

% 量化后的复数信号
r_quant = (real_q + 1j*imag_q)*adc_full_scale/Q;
```

区分和理解两个概念
- **采样（Sampling）**：将连续时间信号转换为离散时间信号。
- **量化（Quantization）**：将连续取值的信号幅度映射到有限个离散幅度等级。

量化的具体步骤：
`nbit = 12` 表示12位量化
`Q = 2^(nbits-1)-1` 表示对称有符号量化的端点，要考虑正负幅度，有效编码等级数为-2047 - 2047




## 4. Dechirp混频

```matlab
%% 4. Dechirp混频

% 采用接收信号共轭乘以发射信号
% 理想拍频为正：fb = K*tau
x = conj(r_quant).*s;
```

## 5. FFT频谱分析

```matlab
%% 5. FFT频谱分析
Nfft = N;

% Hann窗
n = 0:N-1;
w = 0.5-0.5*cos(2*pi*n/(N-1));

X = fft(x.*w,Nfft);

% 正频率轴
Nhalf = floor(Nfft/2);
f_axis = (0:Nhalf)*fs/Nfft;

% 频谱幅度
P = abs(X(1:Nhalf+1))/sum(w);

% 距离轴
R_axis = c*f_axis/(2*K);
```

## 6. 多目标检测

```matlab 
%% 6. 多目标检测
R_max = 150;

valid = (R_axis > 0) & (R_axis <= R_max);

% 检测局部极大值
peak_idx = find( ...
    P(2:end-1) > P(1:end-2) & ...
    P(2:end-1) >= P(3:end)) + 1;

% 相对峰值门限
threshold = 0.15*max(P(valid));

% 保留满足范围和幅度条件的峰
peak_idx = peak_idx( ...
    valid(peak_idx) & P(peak_idx) >= threshold);

% 估计目标距离
f_est = f_axis(peak_idx);
R_est = c*f_est/(2*K);

fprintf('检测到 %d 个目标\n',numel(R_est));

for k = 1:numel(R_est)
    fprintf('目标%d：频率 %.1f Hz，距离 %.2f m\n',k,f_est(k),R_est(k));
end

% 与真实距离比较
if numel(R_est) == numel(R)
    distance_error = sort(R_est)-sort(R);

    fprintf('\n距离估计误差：\n');
    disp(distance_error);
end
```

## 7. 可视化

```matlab
%% 7. 可视化
figure('Name','Chirp多目标测距');

% 发射Chirp信号
Nshow = round(20e-6*fs);

subplot(3,1,1);
plot(t(1:Nshow)*1e6,real(s(1:Nshow)));
xlabel('时间 / us');
ylabel('实部');
title('Chirp发射信号');
grid on;

% 混频信号（绘制完整1ms）
subplot(3,1,2);
plot_step = 50;
idx = 1:plot_step:N;

plot(t(idx)*1e3,real(x(idx)));
xlabel('时间 / ms');
ylabel('实部');
title('Dechirp混频信号');
grid on;

% 距离谱
subplot(3,1,3);
plot(R_axis,P,'LineWidth',1);
hold on;

plot(R_est,P(peak_idx),'ro','MarkerSize',8);

xlabel('距离 / m');
ylabel('幅度');
title('FFT距离谱与目标检测');

xlim([0,R_max]);
grid on;
```