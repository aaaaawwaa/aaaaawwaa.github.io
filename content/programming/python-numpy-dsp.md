---
title: Python NumPy 与 DSP
description: 用 NumPy 与 SciPy 完成信号生成、FFT 频谱分析、FIR 滤波器设计与幅频响应验证的实用脚本。
tags:
  - programming
  - python
  - numpy
---

## 为什么用向量化写法

离散卷积的定义是

$$
y[n]=\sum_{k=0}^{M-1}h[k]\,x[n-k]
$$

若用 Python 的 for 循环逐点计算，一个 10 万点的信号会慢到无法迭代。NumPy 的数组运算把循环下沉到 C 层，配合 `np.convolve`、`scipy.signal.lfilter` 可以快一到两个数量级。写 DSP 仿真时，优先考虑"能否用数组整体运算"。

## 生成信号与频谱分析

```python
import numpy as np
import matplotlib.pyplot as plt

fs = 8000.0                     # 采样率 8 kHz
T = 0.5                         # 观测时长 0.5 s
t = np.arange(0, T, 1 / fs)
x = np.sin(2 * np.pi * 440 * t) + 0.3 * np.sin(2 * np.pi * 1200 * t)

N = len(x)
X = np.fft.rfft(x) / N * 2      # 单边幅度谱
f = np.fft.rfftfreq(N, d=1 / fs)

plt.plot(f, np.abs(X))
plt.xlabel("Frequency (Hz)"); plt.ylabel("Amplitude")
plt.grid(True); plt.show()
```

注意 $\Delta f=f_s/N$ 是谱线间隔：$f_s=8000$、$N=4000$ 时 $\Delta f=2$ Hz，若两个频率成分间隔小于这个值，在这段时长内就无法分辨。

## 设计 FIR 低通滤波器

```python
import numpy as np
from scipy import signal

fs, fc, ntaps = 8000.0, 1000.0, 63
taps = signal.firwin(ntaps, fc, fs=fs, window="hamming")

# 检查幅频响应：通带与阻带衰减
w, h = signal.freqz(taps, worN=4096, fs=fs)
passband = np.abs(h[w <= 800]).max()
stopband = np.abs(h[w >= 1500]).max()
print(f"通带内最大幅度: {passband:.3f}")
print(f"1.5 kHz 以上最大幅度: {stopband:.4f} ({20*np.log10(stopband+1e-12):.1f} dB)")

# 实际滤波：300 Hz 应保留，3 kHz 应被抑制
n = np.arange(2000)
x = np.sin(2 * np.pi * 300 * n / fs) + 0.5 * np.sin(2 * np.pi * 3000 * n / fs)
y = signal.lfilter(taps, 1.0, x)

spec = 2 * np.abs(np.fft.rfft(y)) / len(y)
freqs = np.fft.rfftfreq(len(y), 1 / fs)
amp = lambda f0: spec[np.argmin(np.abs(freqs - f0))]
print(f"300 Hz 幅度: {amp(300):.3f}  (滤波前 1.000)")
print(f"3 kHz 幅度: {amp(3000):.4f} (滤波前 0.500)")
```

## 幅频响应的读法

滤波器的指标通常写成三组数：通带边缘与纹波、阻带边缘与衰减、过渡带宽度。FIR 的阶数 $M$ 与过渡带宽度成反比，粗略估计（Kaiser 经验公式）为

$$
M\approx\frac{-20\log_{10}\sqrt{\delta_1\delta_2}-13}{14.6\,\Delta f/f_s}
$$

其中 $\delta_1,\delta_2$ 是通带与阻带的容差，$\Delta f$ 是过渡带宽度。设计时先算阶数，再看资源是否允许。

## 数值与类型陷阱

- Python 的 `int` 不会溢出，但 `np.int32` 会；累加器必须显式提升位宽。
- 默认 `float64` 精度远高于实际需求；仿真通过后转定点时要检查量化误差。
- `np.fft.fft` 输出的是完整双边谱，实信号请用 `rfft` 节省一半计算。

> [!tip] 仿真到硬件的过渡
> 先在浮点域验证算法，再按 Q 格式（如 Q1.15）定点化，最后在 [[Digital-Systems/Verilog-Sequential-Logic|Verilog]] 中实现。每一步都用同一组测试向量对比输出，避免"算法对但硬件错"。

## 一条可复用的验证流程

1. 用浮点生成或读取信号，分别画出时域波形与幅度谱，确认现象符合理论预期；
2. 换一组参数（噪声强度、信号频率、滤波器阶数）重跑，检查结论是否稳定；
3. 记录关键指标（通带纹波、阻带衰减、误码率），作为后级定点实现与 RTL 仿真的对照基准。

## 相关阅读

- [[Signal-Processing/DFT-and-FFT|DFT 与 FFT]]
- [[Interactive-Labs/Fourier-Series-Lab|傅里叶级数实验]]
- [[Programming/C-Pointer-and-Memory|C 指针与内存]]
