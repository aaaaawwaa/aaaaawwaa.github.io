---
title: DFT 与 FFT
description: 从 DFT 定义出发理解离散频谱、频率分辨率与频谱泄漏，并给出 MATLAB 与 Python 的 FFT 实现。
tags:
  - signal-processing
  - dft
  - fft
---

## DFT 的定义

有限长序列 $x(n)$，$n=0,1,\dots,N-1$，其离散傅里叶变换定义为

$$ X(k)=\sum_{n=0}^{N-1}x(n)\,e^{-j2\pi kn/N},\quad k=0,1,\dots,N-1 $$

它把 $N$ 个时域样本映射为 $N$ 个频域样本。注意 $X(k)$ 表示频率 $f_k=k f_s/N$ 处的复幅度，包含幅度与相位两部分。

反变换为

$$ x(n)=\frac{1}{N}\sum_{k=0}^{N-1}X(k)\,e^{j2\pi kn/N} $$

Parseval 关系保证能量守恒：$\sum_{n=0}^{N-1}\left|x(n)\right|^2=\frac{1}{N}\sum_{k=0}^{N-1}\left|X(k)\right|^2$。

## 频率分辨率

DFT 的频率间隔为

$$ \Delta f=\frac{f_s}{N} $$

提高分辨率（减小 $\Delta f$）的唯一办法是增加观测时长 $T=N/f_s$，即 $\Delta f=1/T$。**补零**只能在频域做插值，让曲线更平滑，并不能真正分辨更近的两个频率成分。

## 单边幅度谱与归一化

实信号的频谱共轭对称，因此工程上常只画 $0\sim f_s/2$ 的单边谱，并把非直流分量的幅度乘 2：

$$ A(f_k)=\frac{2\left|X(k)\right|}{N} $$

忘记乘 2 或忘记除以 $N$，是初学 FFT 时最常见的幅度错误。

## MATLAB 实现

```matlab
fs = 1000;  N = 1024;
t = (0:N-1) / fs;
x = 0.6*cos(2*pi*50*t) + 0.3*cos(2*pi*120*t) + 0.05*randn(size(t));

X = fft(x) / N;                 % 归一化
f = (0:N-1) * fs / N;
half = 1:N/2;

plot(f(half), 2*abs(X(half)));
xlabel('Frequency (Hz)'); ylabel('|X(f)|');
title('单边幅度谱');
grid on;
```

## Python 实现

```python
import numpy as np

fs, N = 1000.0, 1024
x = (0.6 * np.cos(2 * np.pi * 50 * np.arange(N) / fs)
     + 0.3 * np.cos(2 * np.pi * 120 * np.arange(N) / fs))

X = np.fft.rfft(x)                    # 只计算 0..fs/2
freqs = np.fft.rfftfreq(N, d=1 / fs)
mag = 2 * np.abs(X) / N               # 单边幅度谱

top = np.argsort(mag)[-2:]
print("峰值频率 (Hz):", np.sort(freqs[top]))
```

## 频谱泄漏与窗函数

若截断长度内信号不是整数个周期，矩形窗的旁瓣会让能量扩散到邻近频点，表现为谱峰变宽、出现旁瓣，这就是频谱泄漏。通常的缓解办法是加窗（Hann、Hamming、Blackman），代价是主瓣变宽、频率分辨率下降。

> [!warning] 补零不是万能的
> 补零后的谱线更密，但两条谱线之间的信息并没有增加。判断「两个频率能不能分开」要看主瓣宽度，正确指标是最小可分辨频率间隔约为主瓣宽度 $\approx 2 f_s/N$（加窗后更宽）。

## FFT 的复杂度

FFT 利用旋转因子的对称性与周期性，把一个 $N$ 点 DFT 分解为若干小点数 DFT。基 2（radix-2）算法要求 $N$ 为 2 的整数次幂，复数乘法次数约为

$$ \frac{N}{2}\log_2 N $$

而直接计算 DFT 需要 $N^2$ 次复数乘法。当 $N=1024$ 时，二者相差约 50 倍，这就是 FFT 能实时处理的关键。

## 相关阅读

- [[Signal-Processing/Signals-and-Systems-Intro|信号与系统导论]]
- [[Programming/Python-NumPy-DSP|Python NumPy 与 DSP]]
- [[Interactive-Labs/Fourier-Series-Lab|傅里叶级数实验]]
