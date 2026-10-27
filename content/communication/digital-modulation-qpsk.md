---
title: 数字调制 QPSK
description: QPSK 的 I/Q 正交表示、星座图与格雷映射、带宽效率与误码率，以及 OQPSK 的相位跳变改进。
tags:
  - communication
  - digital-modulation
  - quadrature-modulation
---

## I/Q 正交表示

任何带通信号都可以用两个正交载波写成

$$
s(t)=I(t)\cos(2\pi f_c t)-Q(t)\sin(2\pi f_c t)
$$

$I(t)$ 称为同相分量（in-phase），$Q(t)$ 称为正交分量（quadrature）。因为 $\cos$ 与 $\sin$ 在同一周期内正交，两路信号可以独立处理、叠加传输而不互相干扰，这就是正交调制能倍增频谱效率的根本原因。

## QPSK 星座与格雷映射

QPSK 把两个比特映射为一个符号，符号相位取四个值：

$$
s_i(t)=\sqrt{\frac{2E_s}{T_s}}\cos\left(2\pi f_c t-(2i-1)\frac{\pi}{4}\right),\quad i=1,2,3,4
$$

在 $I$-$Q$ 平面上，四个星座点位于 $(\pm1,\pm1)/\sqrt{2}$ 方向，幅度相同、相位相隔 $90^\circ$。为降低误码率，采用格雷映射（Gray mapping）：相邻星座点只相差 1 个比特，使一个符号错误平均只造成一个比特错误，于是

$$
P_b\approx\frac{1}{\log_2 M}P_s
$$

## 带宽效率

QPSK 每符号承载 2 个比特，因此符号速率与比特速率的关系为

$$
R_s=\frac{R_b}{2}
$$

在相同的符号速率下，QPSK 的比特率是 BPSK 的两倍；反过来说，在相同比特率下 QPSK 只需要一半带宽，这是它被广泛使用的主要理由。

## 误码率

AWGN 信道下，采用格雷映射的 QPSK 误比特率为

$$
P_b=Q\left(\sqrt{\frac{2E_b}{N_0}}\right)
$$

与 BPSK 形式相同：因为 QPSK 可看作两路正交的 BPSK，两路互不干扰，误码性能不变而带宽减半，这是 QPSK 的经典结论。

## 调制解调结构

```mermaid
graph LR
    B["比特流"] --> S2P["串并转换"]
    S2P --> MAP["格雷映射 I/Q"]
    MAP --> PS["脉冲成形"]
    PS --> UP["上变频至 fc"]
    UP --> CH["信道 + AWGN"]
    CH --> DN["下变频"]
    DN --> MF["匹配滤波"]
    MF --> SAM["采样判决"]
    SAM --> P2S["并串转换"]
    P2S --> O["接收比特"]
```

## 相位跳变与 OQPSK

标准 QPSK 的相邻符号可能在 $I$ 与 $Q$ 两路同时翻转，产生 $180^\circ$ 相位跳变。带限滤波后，这种跳变会让信号包络经过零点，进入非线性功率放大器时产生严重的频谱再生（spectral regrowth）。

OQPSK（offset QPSK）把 $Q$ 路延迟半个符号周期，使 $I$、$Q$ 不会同时变化，最大相位跳变降为 $90^\circ$，包络起伏显著减小。$\pi/4$-QPSK 则让符号在两组相位上交替取值，同样避开了原点附近的过零。

> [!tip] 记忆要点
> QPSK 的「2 bit/符号」来自两根正交载波各携带 1 bit；相位跳变越小，对功放线性度的要求越低，代价是接收机定时复杂度上升。

## 相关阅读

- [[communication/analog-modulation-am|模拟调制 AM]]
- [[mathematics/probability-overview|概率论概览]]
- [[digital-systems/fsm-design|有限状态机设计]]
