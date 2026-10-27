---
title: "BPSK-QAM误码率"
tags:
- 随机信号处理
- 10-通信系统应用
- 误码率
- 数字调制
type: concept
subjects:
- 随机信号处理
- 通信原理
domains:
- 通信系统
- 随机信号
status: learning
aliases: []
prerequisites: []
related: []
---

# BPSK/QAM 误码率

> [!abstract] 这一节在讲什么
> 误码率就是"噪声把判决变量推过门限"的概率；在 AWGN 下，所有线性调制都可以化成一个高斯尾概率 $Q(\cdot)$。
> 核心结论：BPSK 与 QPSK 的比特误码率都是 $Q(\sqrt{2E_b/N_0})$，M-QAM 用最近邻近似并配合格雷映射，$16$-QAM 比 BPSK 多约 4 dB。
> 用途：给定误码率指标反推所需 $E_b/N_0$，比较调制方式的功率效率，以及核对仿真曲线。

## 一、Q 函数与错误概率

> [!info] 定义
> **Q 函数**是标准高斯变量超过 $x$ 的概率：

$$
Q(x)=\int_x^{\infty}\frac{1}{\sqrt{2\pi}}e^{-t^2/2}\,\mathrm dt
$$

$Q(x)$ 满足 $Q(0)=0.5$、$Q(-x)=1-Q(x)$，并与补误差函数的关系为 $Q(x)=\frac12\operatorname{erfc}(x/\sqrt2)$。

| $x$ | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| $Q(x)$ | $1.59\times10^{-1}$ | $2.28\times10^{-2}$ | $1.35\times10^{-3}$ | $3.17\times10^{-5}$ | $2.87\times10^{-7}$ |

大 $x$ 时可用 $Q(x)\approx\dfrac{1}{x\sqrt{2\pi}}e^{-x^2/2}$ 快速估算。工程上更常用它的反函数：给定目标误码率，反推出需要的 $x$。

> [!tip] 算误码率的三步
> 先写出判决变量在"发 0"和"发 1"下的均值与方差，再画出两个条件密度，最后把错误区域的面积写成 $Q$。这一步做对了，后面的公式都只是代入。

## 二、BPSK 与 QPSK

BPSK 的相干接收机在符号末端得到

$$
z=\pm E_b+n,\qquad n\sim N\left(0,\frac{N_0E_b}{2}\right)
$$

等概时门限取 0，错误只发生在"发 $+E_b$ 却判成负"或反之，于是

$$
P_b=Q\left(\frac{E_b}{\sqrt{N_0E_b/2}}\right)=Q\left(\sqrt{\frac{2E_b}{N_0}}\right)
$$

QPSK 可以看成两路正交的 BPSK，每符号携带 2 bit，$E_s=2E_b$。它的符号错误率约为 $P_s\approx2Q(\sqrt{E_s/N_0})$，采用格雷映射后一个符号错误主要对应一个比特错误，所以 $P_b\approx P_s/2=Q(\sqrt{2E_b/N_0})$，与 BPSK 完全相同。

| 调制 | 每符号比特 | 符号能量 | 比特误码率（AWGN） |
| --- | --- | --- | --- |
| BPSK | 1 | $E_s=E_b$ | $Q(\sqrt{2E_b/N_0})$ |
| QPSK | 2 | $E_s=2E_b$ | $Q(\sqrt{2E_b/N_0})$ |
| 16-QAM | 4 | $E_s=4E_b$ | $\frac34Q(\sqrt{4E_b/(5N_0)})$ |

> [!warning] QPSK 与 BPSK 的"相同"是有条件的
> 相同的是"相同 $E_b/N_0$ 下的比特误码率"，不是"相同 SNR 下"。QPSK 在同样比特率下只占一半带宽，若带宽固定、噪声功率固定，它的 $E_b/N_0$ 会比 BPSK 低 3 dB，误码率反而更差。

## 三、M-QAM 与格雷映射

方形 $M$-QAM 的比特误码率常用最近邻近似：

$$
P_b\approx\frac{4}{\log_2M}\left(1-\frac{1}{\sqrt M}\right)
Q\left(\sqrt{\frac{3\log_2M}{M-1}\cdot\frac{E_b}{N_0}}\right)
$$

代入 $M=16$ 得 $P_b\approx\frac34Q(\sqrt{4E_b/(5N_0)})$，代入 $M=64$ 得 $P_b\approx\frac{7}{12}Q(\sqrt{2E_b/(7N_0)})$。

**格雷映射**的作用是让相邻星座点只相差 1 bit。高 SNR 时错误几乎都发生在最近邻，于是"一个符号错误"约等于"一个比特错误"，才有 $P_b\approx P_s/\log_2M$。

| 调制 | $\log_2M$ | 相对 BPSK 的 $E_b/N_0$ 损失（高 SNR） | 频谱效率 |
| --- | --- | --- | --- |
| BPSK | 1 | 0 dB | 1 bit/s/Hz |
| QPSK | 2 | 0 dB | 2 bit/s/Hz |
| 16-QAM | 4 | 约 4.0 dB | 4 bit/s/Hz |
| 64-QAM | 6 | 约 8.5 dB | 6 bit/s/Hz |

> [!warning] 格雷映射不是万能
> 低 SNR 时错误会跳到非相邻点，一个符号错误可能带多个比特错误，$P_b\approx P_s/\log_2M$ 不再成立；衰落信道下星座被旋转压缩，格雷映射的增益也会缩水。

## 四、理论曲线与仿真对照

仿真曲线对不上公式时，按下面的清单逐条排查，绝大多数问题都出在前三项。

- [ ] 横轴是 $E_b/N_0$ 还是 $E_s/N_0$？两者差 $10\log_{10}\log_2M$。
- [ ] 星座平均功率是否归一化为 1？噪声方差是否按 I/Q 两维分别设置？
- [ ] 映射与解映射是否使用同一张格雷表？比特到符号的顺序是否一致？
- [ ] 统计的错误比特数是否够多？少于 100 个错误时曲线会明显抖动。

> [!example] 9.6 dB 与 13.4 dB
> BPSK 要达到 $10^{-5}$ 需要 $E_b/N_0\approx9.6$ dB；16-QAM 用上面的公式反解约 13.4 dB，两者差 3.8 dB，接近渐近的 4 dB。若仿真得到的 16-QAM 曲线只差 2 dB，优先怀疑 $E_s/E_b$ 换算或噪声方差设错。

与 [[vault-notes/communication/07-digital-bandpass]] 的公式对照如下。那里的 $r=a^2/(2\sigma_n^2)$ 在匹配滤波、最佳抽样下就等于 $E_b/N_0$，所以 $\frac12\operatorname{erfc}(\sqrt r)$ 与 $Q(\sqrt{2E_b/N_0})$ 是同一个数。

| 项目 | [[vault-notes/communication/07-digital-bandpass|数字带通传输系统]] | 本笔记 |
| --- | --- | --- |
| 信噪比变量 | $r=a^2/(2\sigma_n^2)$ | $E_b/N_0$ |
| 2PSK 误码率 | $\frac12\operatorname{erfc}(\sqrt r)$ | $Q(\sqrt{2E_b/N_0})$ |
| 多进制 | MPSK/MQAM 的符号错误率 | 每比特误码率与格雷近似 |
| 侧重点 | 调制解调框图、带宽、抗噪声性能 | 统一 $Q$ 函数、仿真校验 |

## 关联

- 上一节：[[vault-notes/random-signals/10-adc-sampling-quantization-noise]]
- 下一节：[[vault-notes/random-signals/10-snr-noise-bandwidth]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/07-digital-bandpass]]、[[vault-notes/communication/08-advanced-digital-modulation]]、[[vault-notes/communication/11-error-control-coding]]、[[vault-notes/5g/phy/04-physical-channels-signals]]
