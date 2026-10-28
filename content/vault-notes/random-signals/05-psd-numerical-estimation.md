---
title: "功率谱数值估计"
tags:
- 随机信号处理
- 05-随机信号的频域分析
- 谱估计
- 周期图
type: concept
subjects:
- 随机信号处理
- 随机过程
domains:
- 随机信号
- 统计信号处理
status: learning
aliases: []
prerequisites: []
related: []
---

# 功率谱数值估计

> [!abstract] 这一节在讲什么
> 理论上 $S_X(\omega)$ 是自相关函数的傅里叶变换，但实际只有有限长的一段数据，只能得到估计量 $\hat S_X(\omega)$。
> 本节从周期图出发，说明它为什么"渐近无偏但方差不随数据长度下降"，再用窗函数与 Welch 平均把方差压下来。
> 最后给出分辨率与方差的折中关系、MATLAB 中 `periodogram`/`pwelch` 的用法和工程注意事项。

## 一、从定义到估计量

设有 $N$ 个观测样本 $x[0],\dots,x[N-1]$，采样间隔 $T_s$，采样率 $f_s=1/T_s$。最直接的做法是把"截断、取模平方、除以 $N$"搬过来。

> [!info] 定义 1 周期图
> 序列 $x[n]$ 的**周期图**定义为
> $$
> \hat S_p(\omega)=\frac{1}{N}\left\lvert\sum_{n=0}^{N-1}x[n]e^{-j\omega n}\right\rvert^2=\frac{1}{N}\lvert X_N(e^{j\omega})\rvert^2
> $$
> 在 DFT 频点 $\omega_k=2\pi k/N$ 上，
> $$
> \hat S_p[k]=\frac{1}{N}\lvert X[k]\rvert^2,\qquad k=0,1,\dots,N-1
> $$

若 $x[n]$ 是实信号，单边谱要把 $k=1,\dots,N/2-1$ 的谱值乘 2，直流与奈奎斯特频点不乘，才能保持总功率不变。MATLAB 的 `periodogram` 与 `pwelch` 默认对实信号返回单边谱，并已完成这个缩放。

> [!tip] 为什么除以 $N$ 而不是 $N^2$
> $X[k]$ 的幅度随 $N$ 线性增长，$\lvert X[k]\rvert^2$ 随 $N^2$ 增长；除以 $N$ 后，白噪声的周期图均值才与 $N$ 无关，等于真实谱密度。

## 二、周期图的偏差与方差

> [!info] 定义 2 周期图的统计性质
> 对宽平稳过程，周期图的期望为
> $$
> E[\hat S_p(\omega)]=S_X(\omega)*W_B(\omega)
> $$
> 其中 $W_B(\omega)$ 是矩形窗的 Fejér 核。当 $N\to\infty$ 时 $W_B$ 趋于 $\delta$，故周期图**渐近无偏**；但其方差（高斯情形）近似为
> $$
> \mathrm{Var}[\hat S_p(\omega)]\approx S_X^2(\omega)
> $$
> 与 $N$ 无关，因此周期图**不是一致估计**。

对高斯白噪声，$\hat S_p[k]/S_X$ 近似服从 $\chi_2^2/2$ 分布，标准差等于均值，相对标准差约 100%。增加数据长度只会让谱点变密，不会让曲线变光滑。

> [!warning] "多补零"不会提高分辨率
> 补零只是在频域插值，把谱画得更密；真正的分辨率由有效数据长度 $T=NT_s$ 决定，约为 $1/T$。用 $N$ 点数据补到 $4N$ 点，峰看起来更细，但两个靠得很近的频率仍然分不开。

## 三、窗函数与 Welch 平均

给数据乘窗 $w[n]$ 可以压低截断造成的旁瓣泄漏，代价是主瓣变宽。

$$
\hat S_w(\omega)=\frac{1}{N U}\left\lvert\sum_{n=0}^{N-1}w[n]x[n]e^{-j\omega n}\right\rvert^2,\qquad U=\frac{1}{N}\sum_{n=0}^{N-1}w^2[n]
$$

归一化因子 $N U$ 保证白噪声输入时 $E[\hat S_w]=\sigma^2$。

| 窗 | 主瓣零点宽度（bin） | 最高旁瓣（dB） | 适用场景 |
| --- | --- | --- | --- |
| 矩形 | 2 | $-13$ | 瞬态、短数据 |
| Hann | 4 | $-31$ | 通用，常用 |
| Hamming | 4 | $-43$ | 需要更低旁瓣 |
| Blackman | 6 | $-58$ | 强弱分量并存 |

Welch 法把长数据切成 $K$ 段，每段长 $L$，允许重叠，分别加窗求周期图再平均：

$$
\hat S_{\mathrm{Welch}}(\omega)=\frac{1}{K}\sum_{i=1}^{K}\hat S_w^{(i)}(\omega)
$$

方差约降为原来的 $1/K$（段间独立时），分辨率降为约 $f_s/L$。常用 50% 重叠；Hann 窗用 75% 重叠可补偿窗两端的衰减。

> [!example] 例 1 参数选择
> 采样率 $f_s=1000$ Hz，数据总长 $N=10000$。取 $L=500$、50% 重叠，则每段 0.5 s，分辨率约 2 Hz，段数约 $10000/(500\times0.5)=40$，方差约降到 $1/40$。若改取 $L=2000$，分辨率升到 0.5 Hz，但段数只剩约 10，曲线明显更抖。

## 四、分辨率与方差的折中

| 调整 | 频率分辨率 | 方差 | 偏差/泄漏 | 适用 |
| --- | --- | --- | --- | --- |
| 增大段长 $L$ | 变好 | 变差 | 窗旁瓣影响更明显 | 需要分辨邻近谱线 |
| 增大段数 $K$ | 不变 | 变好 | 不变 | 需要平滑曲线 |
| 增大重叠 | 不变 | 略好 | 不变 | 数据不长时 |
| 换低旁瓣窗 | 略差 | 不变 | 泄漏变小 | 强弱分量共存 |

工程上先确定"必须分辨多近的两根谱线"，由此定 $L$；再用剩余数据尽量增加 $K$。

### MATLAB 用法

```matlab
fs = 1000; x = randn(10000,1);
[pxx,f] = pwelch(x, hann(500), 250, 500, fs);   % 单边 PSD，单位 1/Hz
[pxx2,f2] = pwelch(x, hann(500), 250, 500, fs, 'twosided');
[pp,fp] = periodogram(x, hann(numel(x)), [], fs); % 单段周期图
```

- `pwelch` 默认重叠 50%，默认返回单边谱；窗类型建议显式指定；
- `'psd'` 返回功率/Hz，`'power'` 返回功率（单位平方）；
- 用 `trapz(f,pxx)` 检查积分是否等于时域方差（单边谱）；
- 需要置信区间时，用卡方分布按有效段数近似。

> [!warning] 工程注意事项
> - 先去掉直流或做去趋势，否则 0 Hz 附近的泄漏会污染低频；
> - 数据非平稳时不要做长段平均，改用短时傅里叶变换或谱图；
> - 谱线是确定性正弦时，周期图峰值会随窗和频点位置变化，测幅度要用窗修正或幅度谱；
> - 重叠段之间相关，实际方差改善小于 $1/K$，不要按段数直接算置信区间。

## 关联

- 上一节：[[vault-notes/random-signals/05-white-colored-noise-spectra]]
- 下一节：[[vault-notes/random-signals/06-random-process-lti-systems]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/dsp/03-discrete-fourier-transform]]、[[vault-notes/dsp/04-fast-fourier-transform]]、[[vault-notes/matlab/matlab-notes]]、[[vault-notes/dsp/01-discrete-time-systems]]
