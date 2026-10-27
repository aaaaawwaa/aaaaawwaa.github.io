---
title: "信噪比与噪声带宽"
tags:
- 随机信号处理
- 10-通信系统应用
- 信噪比
- 噪声带宽
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

# 信噪比与噪声带宽

> [!abstract] 这一节在讲什么
> SNR 是信号功率与噪声功率之比，但"噪声功率"取决于用多宽的带宽去收它，所以 SNR 必须和带宽一起说。
> 核心结论：噪声等效带宽 $B_n$ 把实际滤波器折成同噪声功率的矩形滤波器；噪声系数 $F$ 描述系统自己加了多少噪声；链路预算就是把这些量全部换成 dB 后相加。
> 用途：算接收机灵敏度、分配各级增益、把仪器测到的 SNR 换成 $E_b/N_0$。

## 一、SNR 与 dB

$$
\mathrm{SNR}=\frac{P_s}{P_n},\qquad
\mathrm{SNR_{dB}}=10\log_{10}\mathrm{SNR}
$$

功率比用 $10\log_{10}$，幅度比用 $20\log_{10}$。因为 $P\propto A^2$，所以幅度翻倍是 6 dB，功率翻倍是 3 dB；记住 $+3$ dB 是功率乘 2、$+10$ dB 是乘 10、$+20$ dB 是乘 100。

| 功率比 | dB | 等效幅度比 |
| --- | --- | --- |
| 2 | 3.0 | 1.41 |
| 10 | 10.0 | 3.16 |
| 100 | 20.0 | 10 |

> [!warning] SNR 必须带带宽
> "SNR = 20 dB"本身不完整：换一个接收带宽，噪声功率就变，SNR 也变。工程上要么注明噪声带宽，要么直接给功率谱密度 $N_0$。

## 二、噪声等效带宽

> [!info] 定义
> **噪声等效带宽** $B_n$ 是让矩形滤波器与实际滤波器输出相同白噪声功率的宽度。

$$
P_{n,\text{out}}=\frac{1}{2\pi}\int_{-\infty}^{\infty}\frac{N_0}{2}\lvert H(\omega)\rvert^2\,\mathrm d\omega
=N_0\lvert H(0)\rvert^2B_n
$$

把上式对 $B_n$ 反解，就得到定义式（带通时把 $H(0)$ 换成中心峰值增益）：

$$
B_n=\frac{1}{2\pi\lvert H(0)\rvert^2}\int_0^{\infty}\lvert H(\omega)\rvert^2\,\mathrm d\omega
=\frac{1}{\lvert H(0)\rvert^2}\int_0^{\infty}\lvert H(f)\rvert^2\,\mathrm df
$$

| 滤波器类型 | 噪声带宽 $B_n$ | 与 3 dB 带宽之比 |
| --- | --- | --- |
| 理想矩形 | $B$ | 1.00 |
| 一阶 RC | $\frac{\pi}{2}f_c$ | 1.57 |
| 二阶巴特沃斯 | $1.11f_c$ | 1.11 |

> [!warning] 用 3 dB 带宽代替 $B_n$ 会低估噪声
> 一阶 RC 的 $B_n$ 比 $f_c$ 大 57%，折合 1.96 dB 的噪声功率；窄带带通滤波器的差异也不可忽略。算灵敏度时用 $B_n$，不要用 catalog 上的 3 dB 带宽。

## 三、噪声系数与级联

噪声系数定义为输入 SNR 与输出 SNR 之比：

$$
F=\frac{\mathrm{SNR_{in}}}{\mathrm{SNR_{out}}}\ge1,\qquad
\mathrm{NF}=10\log_{10}F
$$

它等价于"系统把噪声温度抬高了多少"：$F=1+T_e/T_0$，$T_0=290$ K。无源衰减器的 $F$ 就等于它的损耗（线性值），所以一个 3 dB 衰减器 NF 就是 3 dB。

多级级联时用 Friis 公式：

$$
F=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1G_2}+\cdots
$$

> [!tip] 第一级决定成败
> 后级的噪声贡献被前级增益除掉。接收机前端放一个高增益、低噪声的 LNA，后面几级的 NF 就被压得很小；反过来，若第一级是滤波器或电缆，它的损耗会原封不动地加到总 NF 上。

## 四、链路预算与衔接

把发射功率、天线增益、路径损耗、接收增益全部写成 dB，相加得到接收功率；噪声功率由热噪声密度、带宽和 NF 相加得到：

$$
N_{\text{dBm}}=-174+10\log_{10}B+\mathrm{NF},\qquad
\mathrm{SNR_{dB}}=P_{rx,\text{dBm}}-N_{\text{dBm}},\qquad
\left.\frac{E_b}{N_0}\right|_{\text{dB}}=\mathrm{SNR_{dB}}+10\log_{10}\frac{B}{R_b}
$$

| 项目 | 符号 | 数值 | 说明 |
| --- | --- | --- | --- |
| 发射功率 | $P_{tx}$ | $+20$ dBm | 基站/终端输出 |
| 天线增益（收发合计） | $G_{tx}+G_{rx}$ | $+10$ dB | 10 dBi 定向加 0 dBi 全向 |
| 路径损耗 | $L_p$ | $-120$ dB | 含自由空间与附加损耗 |
| 接收功率 | $P_{rx}$ | $-90$ dBm | 三项相加 |
| 热噪声加带宽 | $-174+10\log_{10}B$ | $-101$ dBm | $B=20$ MHz |
| 噪声系数 | NF | $+5$ dB | 接收机 |
| 噪声功率 | $N$ | $-96$ dBm | 两项相加 |
| 信噪比 | SNR | $6$ dB | $P_{rx}-N$ |
| 每比特信噪比 | $E_b/N_0$ | $9$ dB | $R_b=10$ Mb/s |

> [!example] 从 SNR 到 $E_b/N_0$
> 上表中 $B=20$ MHz、$R_b=10$ Mb/s，所以 $B/R_b=2$，$E_b/N_0$ 比 SNR 高 3 dB。若把速率提高到 20 Mb/s，带宽不变，$E_b/N_0$ 就回到 6 dB：同样的射频条件，速率翻倍会让每比特能量减半。$B_n$ 的推导见 [[vault-notes/random-signals/06-filtering-noise-power]]，[[vault-notes/communication/04-channel]] 的香农公式则给出容量上限。

## 关联

- 上一节：[[vault-notes/random-signals/10-bpsk-qam-ber]]
- 下一节：[[vault-notes/random-signals/10-receiver-detection]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/random-signals/06-filtering-noise-power]]、[[vault-notes/communication/04-channel]]、[[vault-notes/5g/phy/04-physical-channels-signals]]
