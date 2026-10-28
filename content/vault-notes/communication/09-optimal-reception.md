---
title: "数字信号的最佳接收"
tags:
- 通信
- 通信原理
- 最佳接收
type: course
subjects:
- 通信原理
domains:
- 通信与信息
status: learning
aliases: []
prerequisites: []
related: []
---

> [!abstract] 本章在讲什么
> 本章回答"什么叫最佳接收"，9.1–9.5 层层推进：
> - **9.1 数字信号的统计表述**：接收波形怎么用 $N$ 维样本描述？似然函数怎么来？
> - **9.2 最佳接收准则**：最小差错概率如何推出最大后验（MAP）与最大似然（ML）？高斯信道下为什么等价于最小欧氏距离？
> - **9.3 确知数字信号的最佳接收机**：相关接收机结构、误码率普适公式、2PSK/2FSK/2ASK 的 $\rho$ 与 $P_e$。
> - **9.4 匹配滤波接收法**：匹配滤波器的 $H(f)$、$h(t)$、最大输出信噪比 $2E/n_0$，以及它与相关器的等价性。
> - **9.5 最佳基带传输系统**：收发滤波器如何分配？平方根升余弦（SRRC）从哪来？
>
> 一句话主线：**最佳接收 = 在噪声中按"最小差错概率"做统计判决；高斯信道把它化简为"最小欧氏距离"，工程上则用相关器或匹配滤波器实现——两者在已知信号检测上完全等价。**

> [!note] 记号约定
> - $r(t)=s_i(t)+n(t)$：接收波形；$n(t)$：高斯白噪声，单边谱密度 $n_0$
> - $\mathbf{r}=(r_1,\dots,r_N)$：$N$ 维接收样本矢量；$p_n(\mathbf{r}/s_i)$：似然函数
> - $P(s_i/\mathbf{r})$：后验概率；$P(s_i)$：先验概率
> - $E$：每码元能量；$\rho$：两信号波形相关系数
> - $r_{0\max}$：匹配滤波器最大输出信噪比
> - $t_0$：匹配滤波器的抽样时刻；$h(t)$：匹配滤波器冲激响应
> - $E_b/n_0$：每比特能量与噪声谱密度之比（全书统一的性能尺度）

# 9.1 数字信号的统计表述

接收波形 $r(t)=s_i(t)+n(t)$（$n(t)$ 高斯白噪声）。在 $[0,T_B]$ 内按 $N$ 个采样点展开：

- $r_k=s_{ik}+n_k$——接收样本是**高斯随机变量**
- 在发送 $s_i$ 条件下 $\mathbf{r}$ 的 $N$ 维联合概率密度（**似然函数**）：

> [!info] Def 1 似然函数
> **似然函数**（likelihood function）是发送 $s_i$ 条件下接收矢量 $\mathbf{r}$ 的联合概率密度：
> $$
> p_n(\mathbf{r}/s_i)=\frac{1}{(\sqrt{2\pi}\sigma_n)^N}\exp\left[-\frac{1}{2\sigma_n^2}\sum_{k=1}^{N}(r_k-s_{ik})^2\right]
> $$

**接收问题的本质**：观测到 $\mathbf{r}$，反推最可能发的是哪个 $s_i$——统计判决问题。

# 9.2 最佳接收准则

## 最小差错概率准则 → 最大后验/最大似然

平均误码率 $P_e=\sum_iP(s_i)\,P(\text{错}/s_i)$。

> [!info] Def 2 最大后验准则
> **最大后验准则**（maximum a posteriori，简称 MAP）选取使**后验概率** $P(s_i/\mathbf{r})$ 最大的 $s_i$；它使平均误码率 $P_e$ 最小。

由贝叶斯公式，**等先验** $P(s_1)=P(s_2)$ 时退化为**最大似然准则**：

> [!info] Def 3 最大似然准则
> **最大似然准则**（maximum likelihood，简称 ML）在等先验条件下选取使**似然函数**最大的 $s_i$：
> $$
> \text{判 }s_1\iff p_n(\mathbf{r}/s_1)>p_n(\mathbf{r}/s_2)
> $$

## 判决的几何意义——最小距离

高斯白噪声下，似然比较化简为**欧氏距离比较**：

$$
\text{判 }s_i\iff\|\mathbf{r}-\mathbf{s}_i\|^2\text{ 最小（最小均方误差）}
$$

> [!tip] 一句话
> **高斯信道最佳接收 = 挑离接收矢量"欧氏距离最近"的发送信号**（等概时）。星座图上点距的意义正在于此（见 [[vault-notes/communication/07-digital-bandpass]] / [[vault-notes/communication/08-advanced-digital-modulation]]）。

# 9.3 确知数字信号的最佳接收机

## 相关接收机结构

> [!info] Def 4 相关接收机
> **相关接收机**（correlation receiver）把接收信号分别与各个可能发送的波形 $s_i(t)$ 相乘并积分，在 $T_B$ 时刻抽样比较，取积分值最大者作为判决输出。

二进制（$s_1(t)$、$s_2(t)$ 等能量 $E$）最佳接收机：

```mermaid
flowchart LR
    r[r(t)] --> M1["× s1(t) 积分器 ∫0^TB"] --> C1[抽样比较判决]
    r --> M2["× s2(t) 积分器 ∫0^TB"] --> C1
```

> [!important] 结构记忆
> 最佳接收机 = **两路"乘本机信号→积分→抽样比较"**（相关运算接收机）。
> 它与"带通滤波 + 包络/相干解调"的实际接收机（第 7 章）形式不同：**最佳接收机以"相关/匹配"替代了"带通滤波"**——滤波器只需让噪声尽量少而不管信号失真。

## 最佳接收的误码率（普适公式）

$$
P_e=\frac{1}{2}\mathrm{erfc}\!\left[\sqrt{\frac{E(1-\rho)}{2n_0}}\right]
$$

- $E$：每码元能量；$n_0$：单边噪声谱密度
- **$\rho$：两信号波形的相关系数** $\rho=\dfrac{\int_0^{T_B}s_1(t)s_2(t)\,dt}{E}$

**三种典型情形**：

| 信号对 | $\rho$ | 误码率 $P_e$ | 说明 |
| --- | --- | --- | --- |
| 2PSK（$s_2=-s_1$） | **−1** | $\frac{1}{2}\mathrm{erfc}\sqrt{E/n_0}$ | **最佳**（超正交） |
| 2FSK（正交） | **0** | $\frac{1}{2}\mathrm{erfc}\sqrt{E/2n_0}$ | 正交通常工程最佳折中 |
| 2ASK（等概，信号/零） | 0（按平均能量折算） | $\frac{1}{2}\mathrm{erfc}\sqrt{E/4n_0}$ | 有一半时间无信号发送，最差 |

> [!warning] 与第 7 章公式的关系（易混）
> 第 7 章误码率以**信噪比 $r$** 为变量；本章以 **$E/n_0$（比特能量噪声比）** 为变量——后者才是终极尺度（香农极限也是 $E_b/n_0$，见 [[vault-notes/communication/04-channel]]）。
> 在最佳接收（匹配滤波）意义上：2PSK 比 2FSK 好 3 dB、比 2ASK 好 6 dB——与第 7 章结论一致，但这里的数值对**理想滤波**成立，实际接收机受滤波带宽影响略有劣化。

## 随相/起伏信号的最佳接收

- **随相信号**（相位未知均匀分布，如 FSK 非相干）：最佳接收机退化为**正交支路包络平方比较**——误码率 $P_e=\frac{1}{2}e^{-E/(2n_0)}$（即第 7 章非相干公式在最佳意义下的形式）
- **起伏信号**（瑞利衰落信道）：误码率与平均能量有关，衰落信道下性能断崖式下降——引出分集接收思想

# 9.4 匹配滤波接收法

## 问题定义

**线性滤波器在 $t_0$ 时刻输出信噪比最大**——"匹配"于已知信号波形。

输出信噪比（施瓦茨不等式放缩）：

$$
r_{0\max}=\frac{2E}{n_0}
$$

（**只与信号能量 $E$ 和 $n_0$ 有关，与波形细节无关**！）

## 匹配滤波器特性

> [!info] Def 5 匹配滤波器
> **匹配滤波器**（matched filter）是在某一时刻 $t_0$ 使输出信噪比达到最大的线性滤波器：
> $$
> H(f)=k\,S^*(f)e^{-j2\pi ft_0}\quad(\text{频谱的复共轭，延迟 }t_0)
> $$
> $$
> h(t)=k\,s(t_0-t)\quad(\text{信号的镜像再平移 }t_0)
> $$

**物理可实现条件**：$t_0\ge$ 信号结束时刻 $T_B$（否则镜像有未来成分）→ 通常取 $t_0=T_B$。

**性质**：

1. $H(f)$ 与信号频谱**共轭匹配**：信号强处增益大（≠ 频率均匀放大）
2. 输出**最大信噪比 $\frac{2E}{n_0}$**，在 $t=t_0$ 时刻取得
3. 输出信号 = 信号自相关（在 $t_0$ 处达到峰 $kE$）——**匹配滤波器 = 相关器**（白噪声下两者对已知信号检测**完全等价**）
4. 输出噪声平均功率 $\frac{k^2n_0E}{2}$；输出信噪比与 $k$、波形无关

## 匹配滤波器与相关接收机的等价

$$
\int_0^{T_B}r(t)s(t)\,dt\quad\Longleftrightarrow\quad r(t)*h(t)\Big|_{t=T_B}
$$

> [!tip] 考研实战
> 常考：给矩形脉冲 $s(t)$（宽 $T_B$）求匹配滤波器 $h(t)$（矩形镜像）、$t_0$、最大输出信噪比 $2E/n_0$、画输出波形（三角/抛物线状自相关）。
> 匹配滤波器**不保持信号波形**（输出 ≠ 输入的放大复制），只在判决时刻"最像"即可。

# 9.5 最佳基带传输系统

把最佳接收思想（匹配滤波）应用于第 6 章的基带系统，发收滤波器联合设计：

## 理想信道（$C(\omega)=1$）下的最佳分配

无 ISI + 匹配滤波（输出信噪比最大）同时成立的**收发滤波器幅频条件**：

$$
|T(\omega)|=|R(\omega)|=|H(\omega)|^{1/2}
$$

（$H(\omega)$：无 ISI 的总特性，如升余弦滚降）——**发送滤波器 = 接收滤波器 = 总特性的平方根（平方根升余弦 SRRC）**。

误码率（双极性，最佳系统）：

$$
P_e=\frac{1}{2}\mathrm{erfc}\!\left(\sqrt{\frac{E}{n_0}}\right)
$$

## 非理想信道

$C(\omega)\ne1$ 时需要**信道均衡**配合（接收端迫零/分数抽头均衡），先校正信道再按理想信道方法分配。

> [!note] 工程注解
> "平方根升余弦（SRRC）成形 + 匹配滤波接收"正是现代数字通信（5G NR 等）标准的收发链路设计——[[vault-notes/5g/phy/05-air-interface-illustrated]] 中 shaping filter 的理论出处。

> [!tip] 本章收官
> 本章把"最佳"从一个模糊的工程直觉变成可证明的判决规则：**最小差错概率 → MAP/ML → 最小欧氏距离**；实现上，**相关接收机**与**匹配滤波器**在已知信号检测上完全等价，匹配滤波器的最大输出信噪比 $2E/n_0$ 只由能量决定。由此得到统一的误码率尺度 $E_b/n_0$，并把第 6 章的基带系统升级为"平方根升余弦 + 匹配滤波"的最佳基带系统。

## 本章知识地图

```
最佳接收
├─ 统计表述（9.1）
│  ├─ r(t) = s_i(t) + n(t)
│  ├─ N 维样本 r_k = s_ik + n_k（高斯）
│  └─ 似然函数 p_n(r/s_i)
├─ 最佳准则（9.2）
│  ├─ 最小 P_e ⇔ 最大后验 MAP
│  ├─ 等先验 ⇒ 最大似然 ML
│  └─ 高斯白噪声 ⇒ 最小欧氏距离
├─ 最佳接收机（9.3）
│  ├─ 相关接收机：×s_i → 积分 → 抽样比较
│  ├─ P_e = ½erfc√(E(1−ρ)/(2n₀))
│  ├─ 2PSK：ρ=−1，最佳；2FSK：ρ=0；2ASK：最差
│  └─ 随相信号 → 包络平方比较；起伏信号 → 分集
├─ 匹配滤波（9.4）
│  ├─ H(f)=kS*(f)e^(−j2πft₀)，h(t)=ks(t₀−t)
│  ├─ t₀ ≥ T_B；最大输出信噪比 2E/n₀
│  ├─ 输出 = 信号自相关
│  └─ 与相关接收机等价
└─ 最佳基带（9.5）
   ├─ |T|=|R|=|H|^(1/2)（平方根升余弦 SRRC）
   ├─ 双极性 P_e=½erfc√(E/n₀)
   └─ 非理想信道 → 先均衡再分配
```

## 关联

- 上一章：[[vault-notes/communication/08-advanced-digital-modulation]]
- 下一章：[[vault-notes/communication/10-source-coding]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 最小欧氏距离判决 | [[vault-notes/communication/08-advanced-digital-modulation]] 的星座点距；[[vault-notes/communication/07-digital-bandpass]] 的误码率 |
| 相关接收、匹配滤波 | [[vault-notes/communication/02-deterministic-signals]] 的互相关；[[vault-notes/communication/12-orthogonal-codes-pn-sequences]] 的正交相关 |
| $E_b/n_0$ 尺度 | [[vault-notes/communication/04-channel]] 的香农极限 $-1.6$ dB；[[vault-notes/communication/11-error-control-coding]] 的编码增益 |
| 平方根升余弦 SRRC | [[vault-notes/communication/06-digital-baseband]] 的升余弦滚降；[[vault-notes/5g/phy/05-air-interface-illustrated]] 的 shaping filter |
| 随相/起伏信号 | [[vault-notes/communication/03-random-processes]] 的瑞利/莱斯分布；分集接收 |

**通信方向应用**：

- [[vault-notes/5g/phy/05-air-interface-illustrated]] —— 5G NR 的 SRRC/滤波 OFDM、解调端的匹配滤波与相关检测，都是本章理论的工程实现。
- [[vault-notes/communication/07-digital-bandpass]] —— 本章用 $E_b/n_0$ 重写了第 7 章的误码率，二者在理想滤波下只差一个 3 dB 常数。
- [[vault-notes/matlab/matlab-notes]] —— 用 `xcorr` 实现匹配滤波、画三角自相关输出，是最直观的验证。

**相关**：[[vault-notes/communication/08-advanced-digital-modulation]]｜[[vault-notes/communication/10-source-coding]]｜[[vault-notes/communication/11-error-control-coding]]
