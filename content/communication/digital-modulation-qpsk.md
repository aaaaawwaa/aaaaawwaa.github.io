---
title: 数字调制：从 2ASK 到 QPSK、QAM 与 OFDM
description: 二进制与多进制数字调制（ASK/FSK/PSK/DPSK、QPSK、QAM、MSK、OFDM）的表达式、带宽、误码率与最佳接收，给出公式的适用条件。
tags:
  - communication
  - digital-modulation
  - qpsk
  - qam
  - ofdm
---

## 为什么需要带通调制

数字基带信号（[[communication/digital-baseband-transmission|数字基带传输]]）的频谱集中在零频，无法用天线有效辐射，也不能多路共享空间。**数字调制**（digital modulation）用基带信号控制载波的振幅、频率或相位，把频谱搬到高频，使天线尺寸可行并支持频分复用。

分析数字调制有两条主线：**波形与带宽**（已调信号带宽由基带主瓣决定，二进制矩形基带为 $2f_B$，$f_B=1/T_B$）与**误码率**（给定噪声模型与解调方式下的判决错误概率）。两者共同决定"用什么调制"，本质是在频带利用率、功率效率与实现复杂度之间取舍。

```mermaid
flowchart LR
    B["比特流"] --> MAP["符号映射"]
    MAP --> SH["脉冲成形"]
    SH --> MIX["乘载波 cos/sin"]
    MIX --> CH["信道 + AWGN"]
    CH --> MF["匹配滤波 / 相关"]
    MF --> SAM["抽样判决"]
    SAM --> OUT["恢复比特"]
```

## 二进制调制的四个基本款

二进制调制每码元携带 1 bit，$R_b=R_B$。四种方式分别控制载波的振幅、频率、绝对相位与相对相位：

| 方式 | 表达式 | 受控参量 | 带宽 | 解调 |
| --- | --- | --- | --- | --- |
| 2ASK（OOK） | $s(t)\cos\omega_ct$，$s(t)$ 取 0/1 | 振幅通断 | $2f_B$ | 包络检波或相干 |
| 2FSK | 发 1 用 $\omega_1$、发 0 用 $\omega_2$ | 频率 | $\left\lvert f_2-f_1\right\rvert+2f_B$ | 双支路包络比较、相干、过零检测 |
| 2PSK | $s(t)\cos\omega_ct$，$s(t)$ 取 $\pm1$ | 绝对相位 $0/\pi$ | $2f_B$ | 只能相干 |
| 2DPSK | 相邻码元相位差 $\Delta\varphi\in\{0,\pi\}$ | 相对相位 | $2f_B$ | 差分相干，或相干 + 码反变换 |

**2ASK 与 2PSK 只差基带极性**：2ASK 是单极性基带乘载波，2PSK 是双极性基带乘载波。这一区别带来两个后果：2PSK 没有载波分量、功率效率更高；2PSK 的判决是"正负对称"的，抗噪性能更好（见误码率一节）。

**倒 π 现象**：2PSK 相干解调需要与发端同频同相的本地载波，而平方环等恢复电路只能确定到"相差 $180^\circ$ 的两个可能之一"。本地载波一旦翻转 $180^\circ$，输出全部比特取反。工程上改用 2DPSK：发端把绝对码 $a_n$ 做差分编码

$$
b_n=a_n\oplus b_{n-1}\ (\bmod 2)
$$

再对 $b_n$ 做 2PSK；收端相干解调得到 $b_n$ 后做码反变换 $a_n=b_n\oplus b_{n-1}$。因为信息由**相位差**承载，本地载波整体翻转不影响相邻相位差，倒 π 被彻底消除。代价是差分译码使一个错误影响两个码元，误码率略高于 2PSK。载波恢复的具体电路见 [[communication/synchronization|同步原理]]。

## 误码率：公式表与使用条件

设接收端解调器输入信噪比为

$$
r=\frac{a^2}{2\sigma_n^2}
$$

其中 $a$ 为接收载波幅度、$\sigma_n^2=n_0B$ 为带通滤波器输出的噪声功率。等概发送、最佳门限判决时，二进制调制的误码率为：

| 方式 | 相干解调 | 非相干解调 |
| --- | --- | --- |
| 2ASK | $\frac{1}{2}\mathrm{erfc}\left(\sqrt{r/4}\right)$ | $\frac{1}{2}e^{-r/4}$ |
| 2FSK | $\frac{1}{2}\mathrm{erfc}\left(\sqrt{r/2}\right)$ | $\frac{1}{2}e^{-r/2}$ |
| 2PSK | $\frac{1}{2}\mathrm{erfc}\left(\sqrt{r}\right)$ | ——（无物理意义） |
| 2DPSK | $\mathrm{erfc}\left(\sqrt{r}\right)$（相干 + 码反变换） | $\frac{1}{2}e^{-r}$（差分相干） |

记忆规律有三条：**相干是 erfc 型、非相干是指数型**；erfc 的根号内分母依次是 4（ASK）、2（FSK）、1（PSK）；差分相干是 $\frac{1}{2}e^{-r}$（指数不带分母）。三者的误码率排序为

$$
P_{e,2PSK}<P_{e,2FSK}<P_{e,2ASK}
$$

同一误码率下所需信噪比：2PSK 比 2FSK 低 3 dB，2FSK 比 2ASK 低 3 dB，2PSK 比 2ASK 低 6 dB。相干解调总优于非相干解调（大信噪比时两者趋同），代价是需要载波同步。

> [!warning] 公式必须连着条件读
> 这张表的前提是：AWGN 信道、$\sigma_n^2=n_0B$（窄带高斯噪声）、等概发送、最佳判决门限、$r$ 为解调器输入信噪比。若题目给出的是 $E_b/n_0$，需要按噪声带宽定义换算；比较不同调制方式时必须使用同一个自变量，否则会得出错误排序。

## 多进制调制：用状态数换频带利用率

一个码元取 $M$ 个状态即携带 $\log_2M$ 个比特：

$$
R_b=R_B\log_2M,\qquad \eta_b=\log_2M\ \text{b/(s·Hz)}\ (\text{矩形谱})
$$

在**带宽不变**时提高比特率，这就是多进制的价值；代价是相邻信号状态变密、噪声容限下降、误码率上升——又一对"有效性 ↔ 可靠性"矛盾。

- **MASK**：$M$ 个振幅电平。带宽与 2ASK 相同，频带利用率提高 $\log_2M$ 倍；但电平间隔随 $M$ 缩小，抗噪差，实际很少单独使用。
- **MFSK**：$M$ 个频率，恒包络、带宽很宽；$M$ 增大反而使误码率下降（唯一的"越大越好"），适合功率受限、带宽宽松的场景。
- **MPSK**：$M$ 个相位均匀分布在圆周上。最小欧氏距离约为 $2A\sin(\pi/M)$，随 $M$ 增大迅速缩小；$M>8$ 后损失严重，8PSK 已接近实用上限，更高阶改用 QAM。

## QPSK：两种正交载波各带 1 bit

QPSK 是 $M=4$ 的 PSK，每符号 2 bit，$R_s=R_b/2$，在相同比特率下占用带宽只有 BPSK 的一半。用 I/Q 正交调制实现：

$$
s(t)=I(t)\cos\omega_ct-Q(t)\sin\omega_ct,\qquad I,Q\in\left\{\pm\sqrt{E_b}\right\}
$$

两路正交载波互不干扰，相当于两路独立的 BPSK 并行传输，因此误码性能不变、带宽减半。星座点位于四个象限的对角方向，相邻点只差一个比特——这就是**格雷映射**（Gray mapping）：一个符号错误通常只造成一个比特错误，于是

$$
P_b\approx\frac{1}{\log_2M}P_s
$$

AWGN 下 QPSK 的误比特率为

$$
P_b=Q\left(\sqrt{\frac{2E_b}{N_0}}\right)=\frac{1}{2}\mathrm{erfc}\left(\sqrt{\frac{E_b}{N_0}}\right)
$$

与 BPSK 完全相同。例如 $E_b/N_0=9.6\,\text{dB}$ 时 $Q(4.27)\approx10^{-5}$，这是链路预算中常引用的数量级。

**相位跳变问题**：标准 QPSK 的相邻符号可能让 $I$、$Q$ 同时翻转，产生 $180^\circ$ 相位跳变。信号经过带限滤波后，这种跳变会使包络经过零点，进入非线性功放时产生频谱再生（spectral regrowth），干扰邻道。改进方式：

- **OQPSK**（offset QPSK）：$Q$ 路延迟半个符号周期，$I$、$Q$ 不会同时变化，最大相位跳变降为 $90^\circ$；
- **$\pi/4$-QPSK**：星座点在两组相位上交替取值，同样避开原点附近，被用于 IS-54、TETRA 等系统。

## QAM：振幅与相位联合调制

**正交振幅调制**（QAM）用两路正交载波分别做 ASK，每码元取一对振幅 $(A_m,B_m)$：

$$
s_{QAM}(t)=A_m\cos\omega_ct+B_m\sin\omega_ct
$$

星座是 I–Q 平面上的方形点阵，$M$ 点星座每符号 $\log_2M$ bit，带宽与 MPSK 相同，因此频带利用率为 $\log_2M$ b/(s·Hz)。16QAM vs 16PSK 是经典考点：设两者**最远点半径（最大振幅）**相等为 $A_M$，

- 16QAM 相邻点最小距离 $d_1=\frac{\sqrt{2}}{3}A_M\approx0.471A_M$；
- 16PSK 相邻点距离 $d_2=2A_M\sin\left(\frac{\pi}{16}\right)\approx0.393A_M$。

此时 16QAM 的平均功率只有 16PSK 的 $1/1.8$，即峰均功率比 1.8 倍（2.55 dB）。若改为**平均功率相等**比较，16QAM 的最小距离可再放大 $\sqrt{1.8}$ 倍，合计

$$
20\log_{10}\left(\frac{0.471\times\sqrt{1.8}}{0.393}\right)\approx4.12\ \text{dB}
$$

即平均功率相等时，16QAM 的噪声容限比 16PSK 大约 **4.12 dB**。结论：$M\ge16$ 的高阶调制一律用 QAM 而不是 MPSK，这也是 5G 下行采用 16/64/256-QAM 的原因（[[vault-notes/5g/phy/04-physical-channels-signals|5G 物理信道]]）。

QAM 采用相干解调：两路正交相干载波分别相乘、低通滤波后判决，需要载波同步与定时同步。

## MSK 与 GMSK：恒包络的鲁棒路线

2FSK 有三个缺点：带宽大、开关法产生时相位不连续导致包络起伏、两码元波形不一定正交。**MSK**（minimum-shift keying）针对性改进：调制指数 $h=0.5$、频率间隔 $\Delta f=1/(2T_B)$、相位连续、严格正交且包络恒定；相位在每个码元内线性增减 $\pi/2$，路径是连续折线。

正交性条件决定了最小频率间隔：相干检测时两个正弦码元在 $T_B$ 内正交要求 $\Delta f=1/(2T_B)$；非相干包络检波时要求 $\Delta f=1/T_B$。

**GMSK**（Gaussian MSK）在 MSK 前加高斯低通滤波器对基带脉冲成形（参数 $B_bT_B$），进一步压低带外辐射。$B_bT_B$ 越小，频谱越紧凑但 ISI 越大。GSM 采用 $B_bT_B=0.3$ 的 GMSK：恒包络适合非线性功放，频谱紧凑适合窄信道间隔。这条路线牺牲部分频带利用率，换来对功放非线性和信道衰落的鲁棒性。

## OFDM：用多载波对抗多径

宽带信道存在**频率选择性衰落**（相关带宽 $1/\tau_m$，见 [[communication/communication-signals-and-channel|通信信号与信道]]），单载波高速信号会被深衰落打掉整段频谱。OFDM 的思路是**把高速串行数据拆成 $N$ 路低速并行数据，调制到相互正交的子载波上**：每路子载波带宽变窄（小于相关带宽）→ 平坦衰落；码元时长延长 $N$ 倍 → 抗多径与脉冲噪声。

正交条件是子载波间隔取符号长度的倒数：

$$
\int_0^{T_s}e^{j2\pi f_it}e^{-j2\pi f_kt}\,dt=0\quad(f_i\ne f_k,\ f_i-f_k=m/T_s)
$$

即 $\Delta f=1/T_s$。子载波频谱相互重叠但在积分区间内严格正交，因此不需要保护带，频带利用率接近理论最优。

工程上 OFDM 用 **IFFT 调制、FFT 解调**实现：$N$ 点 IFFT 一次把 $N$ 个子载波上的 QAM 符号变成时域波形，复杂度从 $O(N^2)$ 降到 $O(N\log N)$，这是 4G/5G/WiFi 全面采用 OFDM 的前提。

**循环前缀**（CP）把每个 OFDM 符号尾部的一段复制到头部：只要 CP 长度不小于最大多径时延扩展 $\tau_{\max}$，多径造成的线性卷积就等效为循环卷积，子载波正交性得以保持，ISI 与载波间干扰（ICI）同时被消除。代价是功率与带宽效率下降 $T_{CP}/(T_s+T_{CP})$。

OFDM 的弱点同样明确：多载波叠加使峰均功率比（PAPR）高，对功放线性度要求高，上行因此改用 SC-FDMA（DFT-s-OFDM）；正交性依赖严格频率同步，故对频偏与相位噪声敏感。各子载波可用不同调制阶数（好子信道 64QAM、差子信道 QPSK），这是自适应调制的基础。

## 最佳接收：相关器与匹配滤波器

前面所有误码率公式都默认了"最佳判决"。**最佳接收**回答的是：如何判决才能使平均误码率最小。接收波形 $r(t)=s_i(t)+n(t)$ 在 $[0,T_B]$ 内按 $N$ 个采样点展开为矢量 $\mathbf{r}$，发送 $s_i$ 条件下的似然函数为

$$
p_n(\mathbf{r}/s_i)=\frac{1}{\left(\sqrt{2\pi}\sigma_n\right)^N}\exp\left[-\frac{1}{2\sigma_n^2}\sum_{k=1}^{N}(r_k-s_{ik})^2\right]
$$

**最大后验准则**（MAP）选取使后验概率最大的信号，它使平均误码率最小；等先验时退化为**最大似然准则**（ML）。在高斯白噪声下，比较似然等价于比较欧氏距离：

$$
\text{判 }s_i\iff\left\|\mathbf{r}-\mathbf{s}_i\right\|^2\ \text{最小}
$$

这就是"高斯信道最佳接收 = 挑离接收矢量最近的发送信号"，星座图点距的几何意义正在于此。

**相关接收机**用两路"乘本机信号 → 积分 → 抽样比较"实现最佳判决。等能量二进制信号的最佳误码率为

$$
P_e=\frac{1}{2}\mathrm{erfc}\left[\sqrt{\frac{E(1-\rho)}{2n_0}}\right]
$$

其中 $\rho=\frac{1}{E}\int_0^{T_B}s_1(t)s_2(t)\,dt$ 为两信号的相关系数。三种典型情形：

| 信号对 | $\rho$ | 误码率 | 说明 |
| --- | --- | --- | --- |
| 2PSK（$s_2=-s_1$） | $-1$ | $\frac{1}{2}\mathrm{erfc}\sqrt{E/n_0}$ | 最佳，超正交 |
| 2FSK（正交） | $0$ | $\frac{1}{2}\mathrm{erfc}\sqrt{E/(2n_0)}$ | 正交折中 |
| 2ASK（信号/零） | $0$（按平均能量） | $\frac{1}{2}\mathrm{erfc}\sqrt{E/(4n_0)}$ | 有一半时间不发信号，最差 |

**匹配滤波器**从另一个角度达到同一最优：在线性滤波器中，使 $t_0$ 时刻输出信噪比最大的滤波器为

$$
H(f)=kS^*(f)e^{-j2\pi ft_0},\qquad h(t)=ks(t_0-t)
$$

其最大输出信噪比只由信号能量决定：

$$
r_{0\max}=\frac{2E}{n_0}
$$

物理可实现要求 $t_0$ 不小于信号结束时刻，通常取 $t_0=T_B$。白噪声下匹配滤波器与相关器对已知信号检测**完全等价**：其输出即信号自相关，在 $t_0$ 时刻达到峰值。匹配滤波器不保持信号波形，只在判决时刻使信噪比最大——这与"带通滤波 + 包络/相干解调"的实际接收机结构不同，但性能一致。

把最佳接收思想用于基带系统，就得到**最佳基带传输系统**：理想信道下收发滤波器各取总特性的平方根

$$
\left|T(\omega)\right|=\left|R(\omega)\right|=\left|H(\omega)\right|^{1/2}
$$

（平方根升余弦 SRRC），既能无 ISI 又能匹配滤波，双极性时 $P_e=\frac{1}{2}\mathrm{erfc}\sqrt{E/n_0}$。这正是现代数字通信（含 5G NR）收发链路的理论出处；相关接收与似然比检验的系统讲解见 [[signal-processing/random-processes|随机信号、估计与检测]]。

## 一张表横向比较

| 体制 | 包络 | 频带利用率 | 抗噪/抗非线性 | 典型应用 |
| --- | --- | --- | --- | --- |
| 2ASK | 起伏 | 低（1 b/s/Hz 量级） | 差 | 低成本遥控、光通信 OOK |
| 2FSK | 恒定 | 低（带宽最大） | 抗衰落好 | 遥测、低速控制信道 |
| 2PSK / 2DPSK | 起伏 | 与 2ASK 相同 | 最好（相干） | 卫星、深空（2PSK + 编码） |
| QPSK / OQPSK | 起伏 | 2 b/s/Hz | 好 | 2G/3G/5G 控制与数据 |
| 16～256QAM | 起伏 | $\log_2M$ | 对噪声/非线性敏感 | 5G 下行、WiFi、ADSL |
| MSK / GMSK | 恒定 | 中 | 功放友好、抗衰落 | GSM、蓝牙 |
| OFDM(+QAM) | PAPR 高 | 极高 | 抗频率选择性衰落 | 4G/5G/WiFi/DVB |

## 易错点与工程注意

- 2ASK 与 2PSK 的区别只在基带极性；2DPSK 的差分编码解决的是**载波相位模糊**，其误码率反而略高于 2PSK。
- 误码率公式的自变量 $r$ 与 $E_b/N_0$ 不是同一个量，换算依赖噪声带宽定义；横向比较必须统一。
- 多进制提高的是**频带利用率**而非抗噪性能；$M$ 越大越需要高 $E_b/N_0$。
- QAM 的格雷映射要求相邻点只差 1 bit，方形 16QAM 需正确安排比特到 I/Q 的映射顺序。
- OFDM 的 CP 只能消除 CP 长度以内的多径；CP 越长抗多径越强，功率与带宽效率越低。

## 来源与延伸阅读

- [[vault-notes/communication/07-digital-bandpass|数字带通传输系统（详细笔记）]]：2ASK/2FSK/2PSK/2DPSK 原理、误码率公式表与多进制调制。
- [[vault-notes/communication/08-advanced-digital-modulation|新型数字带通调制（详细笔记）]]：QAM 星座、16QAM 与 16PSK 比较、MSK/GMSK、OFDM 与循环前缀。
- [[vault-notes/communication/09-optimal-reception|数字信号的最佳接收（详细笔记）]]：MAP/ML 准则、相关接收机、匹配滤波器与最佳基带系统。
- [[vault-notes/digital-modulation/01-digital-communication-system|数字通信系统组成]]：调制解调在完整系统中的位置。

## 相关阅读

- [[communication/digital-baseband-transmission|数字基带传输]]：成形滤波、奈奎斯特准则与均衡。
- [[communication/communication-signals-and-channel|通信信号与信道]]：噪声模型、判决量分布与香农容量。
- [[communication/synchronization|同步原理]]：载波同步与位同步，是相干解调的前提。
- [[communication/mobile-networks|5G 与 6G]]：QAM/OFDM 在 NR 中的工程实现。
- [[signal-processing/random-processes|随机信号、估计与检测]]：匹配滤波与似然比检验的系统理论。
