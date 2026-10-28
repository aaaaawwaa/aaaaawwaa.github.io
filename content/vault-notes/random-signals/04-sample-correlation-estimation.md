---
title: "样本相关函数估计"
tags:
- 随机信号处理
- 04-随机信号的时域分析
- 相关函数估计
- 样本估计
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

# 样本相关函数估计

> [!abstract] 这一节在讲什么
> 理论自相关 $R_X[m]$ 是集合平均，实际只能从一条长度 $N$ 的记录中估计。本节给出样本相关函数的三种归一化、偏差与方差的量级、白噪声下的置信区间，以及去均值、去趋势和 MATLAB `xcorr` 的使用细节。
> 核心结论是：$1/N$ 归一化的估计有三角窗偏差但半正定、方差较小；$1/(N-\lvert m\rvert)$ 无偏但大方差；滞后越接近 $N$，有效乘积越少，估计越不可信。

## 一、三种常用估计量

> [!info] 定义 1 样本自相关
> 对实序列 $x[0],\dots,x[N-1]$，滞后 $m$ 的样本自相关定义为
> $$
> \hat R[m]=\frac{1}{N}\sum_{n=0}^{N-\lvert m\rvert-1}x[n+m]x[n],\qquad \lvert m\rvert\le N-1
> $$
> 若分母改为 $N-\lvert m\rvert$，得到无偏版本；复序列把 $x[n]$ 换成 $x^*[n]$。

| 归一化 | 分母 | 期望（WSS） | 优点 | 缺点 |
| --- | --- | --- | --- | --- |
| `biased` | $N$ | $\left(1-\frac{\lvert m\rvert}{N}\right)R[m]$ | 半正定、方差小、谱估计稳定 | 有三角窗偏差 |
| `unbiased` | $N-\lvert m\rvert$ | $R[m]$ | 无偏 | 大方差、可能破坏半正定 |
| `coeff` | 能量归一化 | 近似 $\rho[m]$ | 无量纲、便于比较 | 依赖记录能量 |
| 原始求和 | $1$ | $N R[m]$ 量级 | 计算直接 | 随 $N$ 变化，不能直接比较 |

> [!warning] 无偏不等于更好
> `unbiased` 在 $\lvert m\rvert$ 接近 $N$ 时分母很小，少数几个乘积被放大，方差急剧增大；由此得到的相关序列还可能对应负的功率谱。工程上更常用 `biased` 或 `coeff`，并在解释时说明偏差。

## 二、偏差与方差

对 WSS 过程，`biased` 估计的期望为

$$
E\big[\hat R[m]\big]=\frac{1}{N}\sum_{n=0}^{N-\lvert m\rvert-1}R[m]
=\left(1-\frac{\lvert m\rvert}{N}\right)R[m]
$$

偏差为 $-\frac{\lvert m\rvert}{N}R[m]$，等效于给真实相关函数乘了一个三角窗（Bartlett 窗）。当 $N\gg\lvert m\rvert$ 时偏差可忽略；当 $\lvert m\rvert$ 接近 $N$ 时，估计必然被压向零。

方差没有简单的通用公式。对零均值高斯白噪声：

$$
\mathrm{Var}\big(\hat R[0]\big)\approx\frac{2\sigma^4}{N},\qquad
\mathrm{Var}\big(\hat R[m]\big)\approx\frac{\sigma^4}{N}\quad(m\ne0)
$$

对一般有色过程，协方差近似满足 Bartlett 公式：

$$
\mathrm{Cov}\big(\hat R[m],\hat R[n]\big)\approx\frac{1}{N}\sum_{k}\big[R[k]R[k+m-n]+R[k+m]R[k-n]\big]
$$

相关越强，有效独立样本越少，方差越大。若相关时间为 $\tau_c$（以采样点计），有效样本数约为 $N_{\mathrm{eff}}\approx N/(2\tau_c)$，它决定了估计精度的实际上限。

> [!tip] 一致性
> 固定滞后 $m$、令 $N\to\infty$，若 $R[m]$ 有限且相关衰减，则偏差趋于零、方差趋于零，估计依均方收敛到 $R[m]$。但如果让 $m$ 随 $N$ 成比例增长（例如总取 $m=N/2$），有效乘积数不增，估计不再一致。

## 三、置信区间与显著性

对零均值高斯白噪声，归一化样本相关 $\hat\rho[m]=\hat R[m]/\hat R[0]$ 在 $m\ne0$ 时近似服从 $\hat\rho[m]\sim\mathcal{N}(0,1/N)$。因此近似 $95\%$ 置信区间为 $\pm1.96/\sqrt{N}$，$99\%$ 区间为 $\pm2.58/\sqrt{N}$。若某滞后的估计超出该带，可认为真实相关显著非零。例如 $N=1024$ 时阈值约 $0.061$，$N=4096$ 时约 $0.031$；记录越短，可分辨的相关越弱。

> [!warning] 多重比较会制造“假峰”
> 同时检验 $M$ 个滞后时，即使全是白噪声，也约有 $5\%$ 的滞后会偶然越界。看相关图时应结合整体形态，而不是抓住单个超阈值的尖峰；严格做法是提高阈值或做 Bonferroni 校正。

## 四、去均值、去趋势与预处理

> [!example] 去均值前后的差别
> 设 $x[n]=A+w[n]$，$A=10$，$w[n]$ 是方差为 $1$ 的白噪声，$N=1024$。未去均值时 $\hat R[0]\approx101$，$\hat R[m]\approx100$（$m\ne0$），相关图几乎是一条水平线；去均值后 $\hat R[0]\approx1$，$\hat R[m]\approx0$，白噪声特征才显现。

预处理清单：

- **去均值与去趋势**：除非直流本身是研究对象，否则先减掉样本均值；存在线性或缓慢漂移时，再拟合并减去趋势，避免相关函数出现长平台；
- **分段检验**：把记录分成若干段，分别估计相关函数，检查是否随段变化；
- **边界与补零**：不要对非周期信号做循环相关；补零只起插值作用，不增加信息，也不能提高频率分辨率；
- **异常值**：削波或稳健统计，避免单个脉冲主导整个相关函数。

> [!warning] 预处理顺序有影响
> 应先去除均值/趋势，再做加窗或相关估计。若先加窗再去均值，窗函数会改变有效均值，残留直流仍会污染结果。

## 五、MATLAB `xcorr` 与工程注意事项

```matlab
x = x(:) - mean(x);                 % 去均值
maxlag = 100;
[R, lags] = xcorr(x, maxlag, 'coeff');
stem(lags, R);                      % 归一化样本自相关
```

| 调用 | 归一化 | 适用场景 |
| --- | --- | --- |
| `xcorr(x)` | 无（原始求和） | 只看形状，不比较幅度 |
| `xcorr(x,'biased')` | $1/N$ | 谱估计、需要半正定 |
| `xcorr(x,'unbiased')` | $1/(N-\lvert m\rvert)$ | 理论演示、短滞后 |
| `xcorr(x,'coeff')` | 零滞后归一为 $1$ | 比较不同信号的相关强弱 |
| `xcorr(x,y,maxlag,'coeff')` | 双序列能量归一 | 互相关、时延估计 |

工程注意事项：

1. 滞后范围限制在 $\lvert m\rvert\le N/10$ 左右，边界滞后的估计不可信；
2. 时延换算为 $m/f_s$，采样率必须与序列一致；
3. `coeff` 归一化的峰值给出互相关强度，峰值位置给出时延；
4. 长数据用 FFT 实现相关，复杂度从 $O(N^2)$ 降到 $O(N\log N)$；
5. 估计出的相关函数应与功率谱互检：由 $\hat R[m]$ 做傅里叶变换得到的谱不应出现明显负值，否则说明估计或预处理有问题。

> [!tip] 报告估计结果的最小信息集
> 至少写明：记录长度 $N$、采样率 $f_s$、最大滞后、采用的归一化方式、是否去均值/去趋势。缺任何一项，别人都无法复现或比较你的相关函数。

## 关联

- 上一节：[[vault-notes/random-signals/04-correlation-properties]]
- 下一节：[[vault-notes/random-signals/05-power-spectral-density]]（05 模块首篇）
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/matlab/matlab-notes]]、[[vault-notes/math/probability/06-law-of-large-numbers-clt]]、[[vault-notes/dsp/02-z-transform-and-dtft]]、[[vault-notes/5g/phy/04-physical-channels-signals]]
