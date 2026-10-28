---
title: "傅里叶变换与线性系统"
tags:
- 随机信号处理
- 01-数学预备知识
- 傅里叶变换
- LTI系统
type: concept
subjects:
- 随机信号处理
- 概率论与数理统计
domains:
- 数学基础
- 随机信号
status: learning
aliases: []
prerequisites: []
related: []
---

# 傅里叶变换与线性系统

> [!abstract] 这一节在讲什么
> 随机信号的频域分析，是把"自相关函数"送进傅里叶变换得到功率谱。要读懂这件事，先要把三种傅里叶变换、卷积定理、Parseval 关系与 LTI 系统的频响连成一张网。
> 核心结论：时域卷积等于频域相乘，因此 LTI 系统对每个频率只是乘一个复数增益；Parseval 说明能量（功率）可以在时域或频域任选一边计算；随机过程不能直接做傅里叶变换，只能用功率谱密度描述其频域分布。
> 用途：滤波器设计、噪声带宽、匹配滤波、谱估计，全部建立在卷积定理与 $S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega)$ 之上。

## 一、三种傅里叶变换

| 变换 | 时域 | 频域 | 正变换 | 频域特性 |
| --- | --- | --- | --- | --- |
| CTFT | 连续、非周期 | 连续、非周期 | $X(\omega)=\int_{-\infty}^{\infty}x(t)e^{-j\omega t}\,\mathrm{d}t$ | 无周期 |
| DTFT | 离散、非周期 | 连续、以 $2\pi$ 为周期 | $X(e^{j\omega})=\sum_{n=-\infty}^{\infty}x[n]e^{-j\omega n}$ | 周期 $2\pi$ |
| DFT | 离散、有限长 $N$ | 离散、有限长 $N$ | $X[k]=\sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N}$ | 周期 $N$，间隔 $2\pi/N$ |

本库统一用角频率 $\omega$（rad/s；离散时单位为 rad/sample），并采用 DFT 正变换不除 $N$、反变换除 $N$ 的约定。三种变换的对应关系是"时域采样导致频域周期延拓，频域采样导致时域周期延拓"。

> [!tip] 对偶关系怎么记
> 时域越"离散"，频域越"周期"；时域越"有限"，频域越"光滑"。
> 连续信号采样后频谱以 $\omega_s=2\pi/T_s$ 为周期重复，这就是奈奎斯特采样定理的频域解释。

> [!warning] DFT 的频率轴不要算错
> 第 $k$ 根谱线对应 $\omega_k=2\pi k/N$，只在 $k=0,\dots,N-1$ 上取值；负频率出现在 $k>N/2$ 的位置，对应 $\omega_k-2\pi$。
> 画图时若直接把 $k$ 当频率，正负频率会挤在一起，双边谱看起来"只有正半轴"。

## 二、变换性质与卷积定理

| 性质 | 时域 | 频域 |
| --- | --- | --- |
| 线性 | $ax_1+bx_2$ | $aX_1+bX_2$ |
| 时移 | $x(t-t_0)$ | $X(\omega)e^{-j\omega t_0}$ |
| 频移 | $x(t)e^{j\omega_0t}$ | $X(\omega-\omega_0)$ |
| 卷积 | $x(t)*h(t)$ | $X(\omega)H(\omega)$ |
| 相乘 | $x(t)h(t)$ | $\frac{1}{2\pi}X(\omega)*H(\omega)$ |
| 共轭 | $x^{*}(t)$ | $X^{*}(-\omega)$ |
| 尺度 | $x(at)$ | $\frac{1}{\lvert a\rvert}X\!\left(\frac{\omega}{a}\right)$ |

**卷积定理**是全部频域分析的枢纽：

$$
y(t)=x(t)*h(t)\quad\Longleftrightarrow\quad Y(\omega)=X(\omega)H(\omega)
$$

离散形式完全平行：$y[n]=x[n]*h[n]\Longleftrightarrow Y(e^{j\omega})=X(e^{j\omega})H(e^{j\omega})$。DFT 中则是循环卷积，要得到线性卷积必须补零到 $N\ge N_1+N_2-1$。

> [!warning] DFT 乘法的陷阱
> 直接对两段长度 $N$ 的序列做 DFT、相乘、再 IDFT，得到的是**循环卷积**，前段会绕回尾部造成混叠。补零到 $2N$ 以上才能与线性卷积一致，这是 OFDM 与快速卷积实现中最常见的错误来源。

## 三、Parseval 与能量、功率

三种变换的 Parseval 关系（能量守恒）分别为

$$
\int_{-\infty}^{\infty}\lvert x(t)\rvert^2\,\mathrm{d}t=\frac{1}{2\pi}\int_{-\infty}^{\infty}\lvert X(\omega)\rvert^2\,\mathrm{d}\omega
$$

$$
\sum_{n=-\infty}^{\infty}\lvert x[n]\rvert^2=\frac{1}{2\pi}\int_{-\pi}^{\pi}\lvert X(e^{j\omega})\rvert^2\,\mathrm{d}\omega
$$

$$
\sum_{n=0}^{N-1}\lvert x[n]\rvert^2=\frac{1}{N}\sum_{k=0}^{N-1}\lvert X[k]\rvert^2
$$

| 信号类型 | 判据 | 频域描述 | 典型对象 |
| --- | --- | --- | --- |
| 能量信号 | $0<E=\int\lvert x\rvert^2\mathrm{d}t<\infty$ | 能量谱密度 $\lvert X(\omega)\rvert^2$ | 有限长脉冲、码元波形 |
| 功率信号 | 平均功率有限、能量无穷 | 功率谱密度 $S_X(\omega)$ | 周期信号、平稳随机过程 |

> [!tip] 随机过程为什么必须用 PSD
> 平稳随机过程持续无限长，能量无穷，傅里叶变换不存在。但它有有限的平均功率，于是用"截断—取平均—取极限"定义功率谱密度；维纳-辛钦定理进一步把它与自相关函数 $R_X(\tau)$ 构成傅里叶变换对。这就是功率谱密度定义的出发点。

## 四、LTI 系统与稳定性

> [!info] 定义 5.1 LTI 系统
> 连续时间系统若满足叠加性与时不变性，则可由冲激响应 $h(t)$ 完全描述：
> $$
> y(t)=\int_{-\infty}^{\infty}h(\tau)x(t-\tau)\,\mathrm{d}\tau,\qquad H(\omega)=\int_{-\infty}^{\infty}h(t)e^{-j\omega t}\,\mathrm{d}t
> $$
> 离散情形把积分换成求和，$H(e^{j\omega})=\sum_n h[n]e^{-j\omega n}$。

| 判据 | 连续时间 | 离散时间 | 频域等价 |
| --- | --- | --- | --- |
| 因果 | $h(t)=0,\ t<0$ | $h[n]=0,\ n<0$ | $H(s)$ 收敛域在最右极点右侧 |
| BIBO 稳定 | $\int\lvert h(t)\rvert\mathrm{d}t<\infty$ | $\sum_n\lvert h[n]\rvert<\infty$ | 虚轴（单位圆）在收敛域内 |
| 无失真传输 | $H(\omega)=Ke^{-j\omega t_0}$ | 同左 | 幅频平坦、相频线性 |

> [!tip] 频率响应的两个读法
> $\lvert H(\omega)\rvert$ 描述"各频率被放大或衰减多少"，$\angle H(\omega)$ 描述"各频率被延迟多少"。
> 相位非线性会导致不同频率的群时延不同，宽带信号通过后波形展宽，这就是均衡器要补偿的部分。

## 五、从确知信号到随机信号

把确知信号的结论"逐点搬到随机过程"是行不通的，正确做法是对二阶统计量做变换。设 $X(t)$ 为宽平稳过程，通过冲激响应为 $h(t)$ 的 LTI 系统得到 $Y(t)$，则

$$
\mu_Y=\mu_X\int_{-\infty}^{\infty}h(t)\,\mathrm{d}t=\mu_X H(0)
$$

$$
S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega)
$$

$$
P_Y=R_Y(0)=\frac{1}{2\pi}\int_{-\infty}^{\infty}\lvert H(\omega)\rvert^2S_X(\omega)\,\mathrm{d}\omega
$$

> [!warning] 只有"输入平稳 + 系统 LTI"才保证输出平稳
> 若系统是时变的（如采样、调制、自适应滤波），或输入非平稳，则 $S_Y=\lvert H\rvert^2S_X$ 不成立，必须回到时变相关函数 $R_Y(t_1,t_2)$ 重新推导。
> 另外该式只对**双边谱**成立；换成单边谱时系数要相应调整，否则功率会算成两倍。

## 关联

- 上一节：[[vault-notes/random-signals/01-linear-algebra-matrices]]
- 下一节：[[vault-notes/random-signals/02-expectation-variance]]
- 导航与记号：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/complex-analysis/07-fourier-transform]]（CTFT 的严格定义与性质）、[[vault-notes/dsp/02-z-transform-and-dtft]]（DTFT 与收敛域）、[[vault-notes/dsp/03-discrete-fourier-transform]]（DFT 与循环卷积）、[[vault-notes/dsp/01-discrete-time-systems]]（LTI 与时域卷积）
