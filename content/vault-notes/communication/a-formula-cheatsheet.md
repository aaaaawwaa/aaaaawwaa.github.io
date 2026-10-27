---
title: "通信原理公式速查表"
aliases:
- 通信原理公式表
- 公式速查表
tags:
- 通信原理
- 公式速查
- 考前冲刺
type: resource
subjects:
- 通信原理
domains:
- 学习资源
status: learning
prerequisites: []
related: []
---

# 🧮 通信原理（第七版）全书公式速查表

> [!abstract] 📌 使用说明
> 本表按 13 章顺序汇总**考试必用公式**，所有公式已与原书页面逐条核对。
> 用法：考前 30 分钟通读一遍；做题时先在本表定位公式，再回忆其适用条件（**适用条件往往就是题目的考点**）。
> 详细推导与背景见各章笔记，入口 [[vault-notes/communication/00-guide]]。

---

## 1. 绪论

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| $I=\log_2\dfrac{1}{P(x)}$ (b) | 消息信息量 | 概率越小信息量越大；$P=1$ 时 $I=0$ |
| $I=\log_2 M$ (b) | $M$ 进制等概波形之一 | $M=2^k$ 时 $I=k$ |
| $H=-\sum\limits_{i=1}^{M}P(x_i)\log_2 P(x_i)$ | 信源熵（b/符号） | **等概时取最大** $H_{max}=\log_2 M$ |
| $R_b=R_B\log_2 M$ | 信息速率 ↔ 码元速率 | 仅二进制时 $R_b=R_B$ 数值相等 |
| $\eta=\dfrac{R_B}{B}$，$\eta_b=\dfrac{R_b}{B}$ | 频带利用率 (Baud/Hz、b/(s·Hz)) | 两式分母同为带宽 |
| $P_e=\dfrac{\text{错码元数}}{\text{总码元数}}$，$P_b$ | 误码率 / 误信率 | 二进制中 $P_b=P_e$ |

---

## 2. 确知信号

| 公式 | 含义 |
| --- | --- |
| $E=\int_{-\infty}^{\infty}s^2(t)dt$，$P=\lim\limits_{T\to\infty}\frac{1}{T}\int_{-T/2}^{T/2}s^2(t)dt$ | 能量信号 / 功率信号判据 |
| $E=\int_{-\infty}^{\infty}\vert S(f)\vert ^2df$ | **帕塞瓦尔定理**（时域能量=频域能量） |
| $G(f)=\vert S(f)\vert ^2$ | 能量谱密度 (J/Hz) |
| $P(f)=\lim\limits_{T\to\infty}\frac{1}{T}\vert S_T(f)\vert ^2$ | 功率谱密度 (W/Hz) |
| $R(\tau)=\int s(t)s(t+\tau)dt$，$R(0)=E$ 或 $P$ | 自相关（$\tau=0$ 取最大） |
| **$R(\tau)\leftrightarrow P(f)$** | **维纳-辛钦定理** |

---

## 3. 随机过程

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| $f(x)=\dfrac{1}{\sqrt{2\pi}\sigma}\exp\left[-\dfrac{(x-a)^2}{2\sigma^2}\right]$ | 高斯（正态）密度 | — |
| $f(a_\xi)=\dfrac{a_\xi}{\sigma_n^2}\exp\left[-\dfrac{a_\xi^2}{2\sigma_n^2}\right]$ | **瑞利**（窄带噪声包络，无信号） | 只噪声、无信号时用 |
| $f(\rho)=\dfrac{\rho}{\sigma_n^2}I_0\!\left(\dfrac{A\rho}{\sigma_n^2}\right)\exp\left[-\dfrac{\rho^2+A^2}{2\sigma_n^2}\right]$ | **莱斯**（正弦+窄带噪声） | 大信噪比→高斯；$A\to0$→瑞利 |
| $f(\varphi)=\dfrac{1}{2\pi}$ | 窄带噪声相位均匀分布 | 与包络统计独立 |
| $P_o(\omega)=\vert H(\omega)\vert ^2P_i(\omega)$ | 平稳过程过线性系统 | 所有"白噪声过滤波器"题的核心 |
| $P_n(f)=\dfrac{n_0}{2}$，$R(\tau)=\dfrac{n_0}{2}\delta(\tau)$ | 白噪声功率谱/自相关 | 双边谱 $n_0/2$、单边谱 $n_0$ |
| $\sigma_n^2=n_0B$ | 带限（窄带）噪声功率 | $B$ 为**带通滤波器带宽** |
| $Q(x)=\frac{1}{2}\mathrm{erfc}\!\left(\frac{x}{\sqrt2}\right)$ | $Q$ 与 $\mathrm{erfc}$ 换算 | 误码率公式两种写法要能互转 |

---

## 4. 信道

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| $e_o(t)=k(t)e_i(t)+n(t)$ | 调制信道模型 | 乘性 $k(t)$ 区分恒参/随参 |
| $\Delta f=\dfrac{1}{\tau_m}$ | 随参信道**相关带宽** | $\tau_m$ 为最大多径时延差 |
| $d\approx\sqrt{2rh}$ | 视线传播距离 | $r=6370$ km |
| **$C=B\log_2\!\left(1+\dfrac{S}{N}\right)=B\log_2\!\left(1+\dfrac{S}{n_0B}\right)$** | **香农公式** (b/s) | 与 $R_b$ 的单位区分 |
| $\lim\limits_{B\to\infty}C\approx1.44\dfrac{S}{n_0}$ | 带宽无限时容量上限 | $1.44=\log_2 e$ |
| $\dfrac{E_b}{n_0}\ge\ln2\approx-1.6\text{ dB}$ | **香农极限** | 无误传输的终极标尺 |

---

## 5. 模拟调制系统

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| $s_{AM}(t)=[A_0+m(t)]\cos\omega_ct$ | AM | 需 $A_0\ge\vert m(t)\vert _{max}$；$\eta_{max}=1/3$ |
| $s_{DSB}(t)=m(t)\cos\omega_ct$ | DSB | 效率 100%，需相干解调 |
| $s_{SSB}(t)=\frac{1}{2}m(t)\cos\omega_ct\mp\frac{1}{2}\hat m(t)\sin\omega_ct$ | SSB 相移法 | −USB、+LSB |
| $B_{AM}=B_{DSB}=2f_H$，$B_{SSB}=f_H$ | 线性调制带宽 | VSB 略大于 $f_H$ |
| $G_{DSB}=2$，$G_{SSB}=1$，$G_{AM}\le2/3$ | 解调增益 | **同条件下 DSB/SSB 输出信噪比相同** |
| $m_f=\dfrac{\Delta f}{f_m}=\dfrac{K_fA_m}{\omega_m}$ | 调频指数 | $\Delta f$ 为**最大频偏** |
| **$B_{FM}=2(m_f+1)f_m=2(\Delta f+f_m)$** | **卡森公式** | NBFM：$2f_m$；WBFM：$2\Delta f$ |
| $G_{FM}=3m_f^2(m_f+1)\approx3m_f^3$ | FM 解调增益（大信噪比） | 用带宽换信噪比 |
| $\left(\dfrac{S_i}{N_i}\right)_{th}\approx10\text{ dB}$ | FM 门限 | $m_f$ 越大门限越高 |

---

## 6. 数字基带传输系统

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| $P_s(f)=f_Bp(1-p)\vert G_1-G_2\vert ^2+f_B^2\sum\vert pG_1+(1-p)G_2\vert ^2\delta(f-mf_B)$ | 基带功率谱 | 连续谱定带宽，**离散谱定能否提取时钟** |
| $h(kT_B)=\begin{cases}1,&k=0\\0,&k\ne0\end{cases}$ | 无 ISI **时域条件** | — |
| **$\sum\limits_i H\!\left(\omega+\dfrac{2\pi i}{T_B}\right)=T_B$** | **奈奎斯特第一准则**（频域） | 折叠叠加为常数 |
| $\eta=\dfrac{R_B}{B}=2$ Baud/Hz | 理想低通极限 | 实际不可实现 |
| **$B=(1+\alpha)\dfrac{R_B}{2}$，$\eta=\dfrac{2}{1+\alpha}$** | **升余弦滚降** | $\alpha$：滚降系数 0~1 |
| $P_e=\frac{1}{2}\mathrm{erfc}\!\left(\dfrac{d}{\sqrt2\sigma_n}\right)$ | 双极性基带误码率 | 单极性比它差 **6 dB** |
| $C_k=a_k+a_{k-1}$，$b_k=a_k\oplus b_{k-1}$ | 第 I 类部分响应 + 预编码 | 无预编码会**差错传播** |

---

## 7. 数字带通传输系统 ⭐

> [!important] 二进制调制误码率总表（表 7-1，$r=\dfrac{a^2}{2\sigma_n^2}$）——**必背**
>
> | 方式 | 相干解调 | 非相干解调 |
> | --- | --- | --- |
> | 2ASK | $\frac{1}{2}\mathrm{erfc}\!\left(\sqrt{\frac{r}{4}}\right)$ | $\frac{1}{2}e^{-r/4}$ |
> | 2FSK | $\frac{1}{2}\mathrm{erfc}\!\left(\sqrt{\frac{r}{2}}\right)$ | $\frac{1}{2}e^{-r/2}$ |
> | 2PSK | $\frac{1}{2}\mathrm{erfc}(\sqrt{r})$ | — |
> | 2DPSK（相干+码反变换） | $\mathrm{erfc}(\sqrt{r})$ | — |
> | 2DPSK（差分相干） | — | $\frac{1}{2}e^{-r}$ |

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| $B_{2ASK}=B_{2PSK}=B_{2DPSK}=2f_B$ | 带宽 | 等于基带带宽 2 倍 |
| $B_{2FSK}=\vert f_2-f_1\vert +2f_B$ | 2FSK 带宽 | **最宽** |
| $P_{e,2PSK}<P_{e,2FSK}<P_{e,2ASK}$ | 抗噪排序 | 相邻差 3 dB，2ASK vs 2PSK 差 6 dB |
| $b_n=a_n\oplus b_{n-1}$（模 2） | 2DPSK 差分编码 | 解码 $a_n=b_n\oplus b_{n-1}$ |
| $R_b=R_B\log_2M$ | 多进制换算 | QPSK：$R_B=R_b/2$ |

---

## 8. 新型数字带通调制技术

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| $s_{QAM}(t)=A_m\cos\omega_ct+B_m\sin\omega_ct$ | QAM | 每码元 $\log_2M$ bit |
| $d_{16QAM}=\dfrac{\sqrt2A_M}{3}=0.471A_M$，$d_{16PSK}\approx0.393A_M$ | 星座最小距离 | **平均功率相等时 16QAM 容限大 4.12 dB** |
| $\Delta f=\dfrac{1}{2T_B}$，$h=0.5$ | MSK 频率间隔/调制指数 | 正交 2FSK 非相干需 $1/T_B$ |
| $\Delta\varphi=\pm\dfrac{\pi}{2}$ 每码元线性变化 | MSK 相位路径 | 恒包络、**相位连续**、带宽最小 |
| $\Delta f=\dfrac{1}{T_s}$ | **OFDM 子载波正交间隔** | $T_s$ 为 OFDM 符号长度 |
| $T_{CP}\ge\tau_{max}$ | 循环前缀条件 | 同时消除 ISI 与 ICI |

---

## 9. 数字信号的最佳接收

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| $H(f)=kS^*(f)e^{-j2\pi ft_0}$ | **匹配滤波器传输函数** | 信号频谱的复共轭 |
| **$h(t)=ks(t_0-t)$** | **匹配滤波器冲激响应** | 镜像 + 平移；$t_0\ge T_B$ 才物理可实现 |
| $r_{omax}=\dfrac{2E}{n_0}$ | **最大输出信噪比** | **只与 $E$、$n_0$ 有关**，与波形无关 |
| $P_e=\dfrac{1}{2}\mathrm{erfc}\!\left[\sqrt{\dfrac{E(1-\rho)}{2n_0}}\right]$ | 最佳接收误码率 | $\rho$ 为两波形相关系数 |
| $\rho=-1\to\frac{1}{2}\mathrm{erfc}\sqrt{E/n_0}$；$\rho=0\to\frac{1}{2}\mathrm{erfc}\sqrt{E/2n_0}$ | 2PSK / 2FSK | 2ASK 为 $\frac12\mathrm{erfc}\sqrt{E/4n_0}$ |
| $\vert T(\omega)\vert =\vert R(\omega)\vert =\vert H(\omega)\vert ^{1/2}$ | 最佳基带收发滤波器 | 平方根升余弦 |

---

## 10. 信源编码

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| $f_s\ge2f_H$ | **低通抽样定理** | 恢复滤波器 $f_H\le B\le f_s-f_H$ |
| $f_s\ge2B\left(1+\dfrac{k}{n}\right)$ | 带通抽样定理 | $n=\lfloor f_H/B\rfloor$，$k=f_H/B-n$ |
| $\sigma_q^2=\dfrac{\Delta^2}{12}$ | 均匀量化噪声 | $\Delta$ 为量化间隔 |
| $y=\dfrac{Ax}{1+\ln A}$，$\dfrac{1+\ln Ax}{1+\ln A}$ | **A 律**（$A=87.6$） | 分界点 $x=1/A$ |
| 斜率 16,16,8,4,2,1,½,¼ | **13 折线**各段斜率 | 正负 8 段去重成 13 折 |
| $f_{PCM}=f_s\times n=8000\times8=64$ kb/s | 一路 PCM 电话 | — |
| $B_{PCM}=nf_s$（理想） | PCM 带宽 | 升余弦时 $\times(1+\alpha)$ |
| $\left(\dfrac{S}{N_q}\right)_{dB}\approx6n$ | 量化信噪比 | **每增加 1 位码改善 6 dB** |
| $\left\vert \dfrac{dm(t)}{dt}\right\vert _{max}\le\Delta f_s$ | **ΔM 不过载条件** | 单音：$A\omega_m\le\Delta f_s$ |
| E1：$32\times64=2048$ kb/s | 30 路 + 帧同步 + 信令 | TS0 同步码 0011011 |
| $H\le\bar L<H+1$ | 霍夫曼编码 | 效率 $\eta=H/\bar L$ |

---

## 11. 差错控制编码 ⭐

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| **$d_0\ge e+1$** | 检测 $e$ 个错 | 三公式最易混，按"检 / 纠 / 同时"记 |
| **$d_0\ge2t+1$** | 纠正 $t$ 个错 | — |
| **$d_0\ge e+t+1$** | 同时纠 $t$ 检 $e$（$e>t$） | — |
| $2^r\ge n+1$ | 汉明码条件 | $(7,4)$ 码：$r=3$ |
| $HA^T=0$，$A=MG$ | 监督矩阵/生成矩阵 | $H=[P\vert I_r]$，$G=[I_k\vert Q]$，$P=Q^T$ |
| **$S=RH^T=EH^T$** | **伴随式（校正子）** | $S\ne0$ 时图案指示错位 |
| $A(x)=x^{n-k}M(x)+R(x)$，$R(x)=\left[\dfrac{x^{n-k}M(x)}{g(x)}\right]$ 的余式 | 循环码系统编码 | **$g(x)$ 是 $x^n+1$ 的 $r=n-k$ 次因子** |
| $A(x)=m(x)g(x)$ | 循环码码字 | 全码字 = $g(x)$ 的倍式 |

---

## 12. 正交编码与伪随机序列

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| $H_{2n}=\begin{bmatrix}H_n&H_n\\H_n&-H_n\end{bmatrix}$ | 哈达玛矩阵递推 | 任两行正交 |
| $a_k=\sum\limits_{i=1}^{n}c_ia_{k-i}$（模 2） | m 序列递推方程 | — |
| $f(x)=\sum\limits_{i=0}^{n}c_ix^i$ 为**本原多项式** | m 序列产生条件 | 否则周期不是最大 |
| $p=2^n-1$ | m 序列周期 | 排除全 0 状态 |
| $R(j)=\begin{cases}1,&j=0\\-\frac1p,&j\ne0\end{cases}$ | m 序列**双值自相关** | 扩频/测距的理论根基 |
| $G_p=\dfrac{R_c}{R_b}=\dfrac{B_{SS}}{B_{data}}$ | **处理增益** | 输出信噪比改善 $G_p$ 倍 |

---

## 13. 同步原理

| 公式 | 含义 | ⚠️ 易错 |
| --- | --- | --- |
| $v_g=\frac18m^2(t)\sin2(\varphi-\theta)$ | 科斯塔斯环误差电压 | 同时输出解调信号 $v_r$ |
| $P_1=1-\sum\limits_{i=0}^{m}C_n^ip^i(1-p)^{n-i}$ | **漏同步概率** | $p$ 为码元误码率 |
| $P_2=\dfrac{\sum\limits_{i=0}^{m}C_n^i}{2^n}$ | **假同步概率** | $m$↑ → $P_1$↓、$P_2$↑（两难） |
| $R(j)=\begin{cases}n,&j=0\\0,\pm1,&j\ne0\end{cases}$ | 巴克码局部自相关 | 长度 2,3,4,5,7,11,13 |
| 7 位巴克码 = 1110010 | 帧同步码 | 识别器输出峰值 7 |

---

## 🎯 最该背的 10 个公式（考前最后一眼）

> [!important] Top 10
> 1. **香农公式** $C=B\log_2(1+S/N)$ —— 全书顶点
> 2. **奈奎斯特第一准则** $\sum_iH(\omega+2\pi i/T_B)=T_B$ —— 无码间串扰
> 3. **升余弦** $B=(1+\alpha)R_B/2$，$\eta=2/(1+\alpha)$ —— 计算题主力
> 4. **误码率表 7-1**（ASK÷4、FSK÷2、PSK÷1、DPSK 差分相干 $e^{-r}/2$）
> 5. **匹配滤波器** $h(t)=ks(t_0-t)$、$r_{omax}=2E/n_0$
> 6. **最佳接收误码率** $\frac12\mathrm{erfc}\sqrt{E(1-\rho)/2n_0}$（ρ=−1 / 0 两特例）
> 7. **抽样定理** $f_s\ge2f_H$
> 8. **码距三公式** $d_0\ge e+1$、$\ge2t+1$、$\ge e+t+1$
> 9. **$R_b=R_B\log_2M$** 与 **$n$ 增 1 位 → 6 dB**
> 10. **处理增益** $G_p=R_c/R_b$

---

**相关**：[[vault-notes/communication/00-guide]]｜[[vault-notes/communication/b-cross-library-links]]｜知识图谱 Canvas
