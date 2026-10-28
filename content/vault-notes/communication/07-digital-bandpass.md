---
title: "数字带通传输系统"
tags:
- 通信
- 通信原理
- 数字调制
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
> 本章讲数字调制的"四大基本款"与多进制扩展，7.1–7.5 依次展开：
> - **7.1 二进制数字调制原理**：2ASK/2FSK/2PSK/2DPSK 的表达式、波形、产生/解调框图与带宽。
> - **7.2 二进制数字调制的抗噪声性能**：误码率公式表（相干 erfc 型 / 非相干指数型）怎么记？
> - **7.3 二进制数字调制系统的性能比较**：误码率、带宽、信道敏感性、设备复杂度四个维度。
> - **7.4 多进制数字调制原理**：MASK/MFSK/MPSK/MDPSK 如何用带宽换速率？
> - **7.5 多进制调制的抗噪声性能**：$M$ 增大时各制式的误码率怎么变？
>
> 一句话主线：**数字调制就是"用基带信号去控制载波的振幅、频率或相位"；二进制四兄弟的差别在受控参量与解调方式，误码率统一写成 $r=a^2/(2\sigma_n^2)$ 的函数，多进制则用"每码元多 bit"换频带利用率、同时付出噪声容限的代价。**

> [!note] 记号约定
> - $f_B=1/T_B$：码元速率对应的频率；$R_B$：码元速率；$R_b$：信息速率
> - $r=\dfrac{a^2}{2\sigma_n^2}$：解调器输入信噪比（$a$ 为接收载波幅度，$\sigma_n^2=n_0B$）
> - $a_n$：绝对码；$b_n$：差分码（相对码）；$\Delta\varphi$：相邻码元相位差
> - $M$：进制数；$R_b=R_B\log_2 M$
> - $\rho$：两信号波形相关系数（本章用于对照第 9 章）
> - 2ASK 又称 OOK（on-off keying，通断键控）

# 7.1 二进制数字调制原理

## 二进制振幅键控 2ASK（OOK）

> [!info] Def 1 振幅键控
> **振幅键控**（amplitude-shift keying，简称 ASK）用载波振幅的通断/变化表示数字信息。二进制振幅键控（2ASK）又称**通断键控**（on-off keying，简称 OOK）。

**原理**：载波振幅随"0/1"通断。

$$
e_{2ASK}(t)=s(t)\cos\omega_c t,\qquad s(t)=\sum_n a_n g(t-nT_B),\ a_n=0/1
$$

（即单极性基带 × 载波。）

- **产生**：模拟相乘法 / 键控法（开关）
- **解调**：非相干（包络检波）/ 相干
- **带宽**（矩形 NRZ 主瓣）：$B_{2ASK}=2f_B$

## 二进制频移键控 2FSK

> [!info] Def 2 频移键控
> **频移键控**（frequency-shift keying，简称 FSK）用两个不同频率的载波分别表示 0/1。

**原理**：两个不同频率 $f_1/f_2$ 分别表示 0/1。

$$
e_{2FSK}(t)=\begin{cases}A\cos\omega_1 t&\text{发"1"}\\A\cos\omega_2 t&\text{发"0"}\end{cases}
$$

- **产生**：键控法（两个独立振荡器切换）/ 调频法
- **解调**：非相干（双支路包络 + 比较）/ 相干 / 过零检测 / 差分检波
- **带宽**：$B_{2FSK}\approx|f_2-f_1|+2f_B$（两主瓣叠加）

## 二进制相移键控 2PSK（绝对相移）

> [!info] Def 3 相移键控
> **相移键控**（phase-shift keying，简称 PSK）用载波的**绝对相位**表示数字信息；二进制相移键控（2PSK）用相位 $0$ 与 $\pi$ 分别表示 0/1。

**原理**：用载波**绝对相位** $0/\pi$ 表示 0/1。

$$
e_{2PSK}(t)=s(t)\cos\omega_c t,\quad s(t)\text{ 为双极性 }(+1/-1)
$$

（即**双极性**基带 × 载波——与 2ASK 唯一区别是基带极性！）

- **产生**：模拟相乘 / 键控（$180^\circ$ 移相器）
- **解调**：**只能相干解调**（乘相干载波 → LPF → 抽样判决）
- **带宽**：$B_{2PSK}=2f_B$（与 2ASK 相同）

> [!warning] 2PSK 的致命伤：倒 π 现象
> 载波恢复电路（如平方环）恢复的本地载波存在 **$180^\circ$ 相位模糊**（0 或 $\pi$ 不确定）→ 解调输出"0/1 全反"。
> → 工程上**几乎不用 2PSK**，改用 **2DPSK**。

## 二进制差分相移键控 2DPSK

> [!info] Def 4 差分相移键控
> **差分相移键控**（differential phase-shift keying，简称 DPSK）用**相邻码元载波相位的相对变化**（相位差 $\Delta\varphi$）表示信息，从而消除载波相位模糊。

**原理**：用**相邻码元载波相位的相对变化**（相位差 $\Delta\varphi$）表示信息：

$$
\Delta\varphi=\begin{cases}0&\text{发"0"}\\\pi&\text{发"1"}\end{cases}\quad(\text{或相反约定})
$$

**编码（发端）**：绝对码 $a_n$ → 差分码（相对码）$b_n$：$b_n=a_n\oplus b_{n-1}$（模 2），再对 $b_n$ 做 2PSK。

**解调（收端）两种**：

1. **相干解调 + 码反变换**：先 2PSK 相干解调得 $b_n$，再 $a_n=b_n\oplus b_{n-1}$
2. **差分相干（相位比较）解调**：延迟 $T_B$ 相乘 → LPF → 判决（无需恢复载波，设备简单）

> [!important] 抗相位模糊
> 2DPSK 用**相位差**传信息——本地载波整体翻转 $180^\circ$ 不影响相邻相位差 → **消除倒 π**。代价：误码率比 2PSK 略差（噪声"乘"了两次）。

## 二进制调制记忆总表

| 方式 | 受控参量 | 基带极性 | 带宽 | 解调方式 | 主要问题 |
| --- | --- | --- | --- | --- | --- |
| 2ASK | 振幅 | 单极性 | $2f_B$ | 包络/相干 | 功率效率低 |
| 2FSK | 频率 | — | $\vert f_2-f_1\vert +2f_B$ | 包络/相干/过零 | 带宽大 |
| 2PSK | 绝对相位 | 双极性 | $2f_B$ | 仅相干 | **倒 π** |
| 2DPSK | 相对相位 | 双极性 | $2f_B$ | 差分相干/相干+码反变换 | 误码率略高于 2PSK |

# 7.2 二进制数字调制的抗噪声性能

**模型**：信号 + 窄带高斯噪声（$\sigma_n^2=n_0B$，$B$ 为带通滤波器带宽），判决量分布见 [[vault-notes/communication/03-random-processes]]（瑞利/莱斯/高斯）。

记 **$r=\dfrac{a^2}{2\sigma_n^2}$**（解调器输入信噪比，$a$ 为接收载波幅度）。

## 表 7-1 二进制调制误码率公式一览

| 方式 | 相干解调 | 非相干解调 |
| --- | --- | --- |
| **2ASK** | $\dfrac{1}{2}\mathrm{erfc}\!\left(\sqrt{\dfrac{r}{4}}\right)$ | $\dfrac{1}{2}e^{-r/4}$ |
| **2FSK** | $\dfrac{1}{2}\mathrm{erfc}\!\left(\sqrt{\dfrac{r}{2}}\right)$ | $\dfrac{1}{2}e^{-r/2}$ |
| **2PSK** | $\dfrac{1}{2}\mathrm{erfc}\!\left(\sqrt{r}\right)$ | —（无意义） |
| **2DPSK**（相干+码反变换） | $\mathrm{erfc}(\sqrt{r})$ | — |
| **2DPSK**（差分相干） | — | $\dfrac{1}{2}e^{-r}$ |

> [!tip] 记忆规律
> - **相干 = erfc 型，非相干 = e 指数型**
> - 分母/系数规律：ASK 最差（÷4），FSK 居中（÷2），PSK 最好（÷1）；DPSK 差分相干是 **$\frac{1}{2}e^{-r}$**（注意指数不带除数）
> - 2DPSK 相干 ≈ 2×2PSK 误码（近似）

# 7.3 二进制数字调制系统的性能比较

## 误码率（抗噪性能）

$$
P_{e,2PSK}<P_{e,2FSK}<P_{e,2ASK}
$$

- **同一误码率下所需信噪比：2ASK 比 2FSK 高 3 dB，2FSK 比 2PSK 高 3 dB，2ASK 比 2PSK 高 6 dB**
- 同一解调方式下：**相干 < 非相干**（相干总优于非相干，大信噪比时趋同）
- 抗加性高斯白噪声：**相干 2PSK 最佳**

## 频带宽度（有效性）

$$
B_{2FSK}>B_{2ASK}=B_{2PSK}=2f_B
$$

- 单位带宽速率（有效性）：**2ASK/2PSK 相同且优于 2FSK**

## 对信道特性的敏感性

- **2FSK 最优**：恒包络，非线性信道（随参/衰落/移动信道）适应性好
- 2ASK 包络受衰落影响大；2PSK/2DPSK 相位受振荡器频率稳定度影响

## 设备复杂度

相干 > 非相干（需提取相干载波）；同解调方式下四者差不多。

## 综合结论（工程选择）

| 场景 | 首选 |
| --- | --- |
| 高可靠数据传输（好信道） | 2PSK/2DPSK |
| 随参/衰落信道 | 2FSK |
| 简单遥测、低成本 | 2ASK/OOK |

> [!important] 考研简答题模板
> "比较 2ASK/2FSK/2PSK/2DPSK" → 从 **误码率（PSK 最佳）、频带（FSK 最宽）、对信道敏感性（FSK 最好）、设备复杂度（相干最复杂）** 四个维度作答。

# 7.4 多进制数字调制原理

> [!info] Def 5 多进制调制
> **多进制调制**（M-ary modulation）让一个码元取 $M$ 个可能状态，从而携带 $\log_2M$ 个比特：
> $$
> R_b=R_B\log_2M,\qquad \eta_b=\log_2M\ \text{b/(s·Hz)}\ (\text{矩形谱})
> $$

**核心动机**：在**带宽不变**时，一个码元携带 $\log_2M$ bit → **提高频带利用率（有效性）**；代价：信号状态变密 → **噪声容限减小、误码率上升（可靠性下降）**——又一对有效性/可靠性矛盾（呼应 [[vault-notes/communication/01-introduction]]）。

## 多进制振幅键控 MASK

- $M$ 个电平的基带 × 载波（又称多电平调制/量子幅移键控 APK 基础）
- 带宽与 2ASK 相同（$2f_B$）→ **频带利用率是 2ASK 的 $\log_2M$ 倍**
- 抗噪差（电平间隔小）→ 实际很少单独用，QAM 的振幅维（见 [[vault-notes/communication/08-advanced-digital-modulation]]）

## 多进制频移键控 MFSK

- $M$ 个频率，仍是恒包络、宽带宽
- 宽带宽换取**低误码率**（类 2FSK 思路，但 $M$ 个正交频率间隔 $\frac{1}{2T_B}$… 正交 MFSK 间隔 $\frac{n}{2T_B}$）
- 适合功率受限、带宽宽松场景（如深空、上行控制信道）

## 多进制相移键控 MPSK

**4PSK（QPSK）**：四个相位 $\frac{\pi}{4}$ 间隔（如 $45^\circ/135^\circ/225^\circ/315^\circ$），每码元 2 bit。

- 产生：正交调制法（两路 2PSK 合成）/ 相位选择法
- 解调：相干（两路正交相干载波分别判决）
- 带宽 $2f_B$（码元速率 $R_B=R_b/2$）→ **$\eta_b=2$ b/(s·Hz)（矩形）**，是 2PSK 两倍
- QPSK = 现代 2G/3G/5G 下行调制的基石（扩展阅读 [[vault-notes/5g/phy/04-physical-channels-signals]]）

> [!note] MPSK 的相位模糊
> $M$PSK 载波恢复有 $2\pi/M$ 相位模糊 → 实用同 2DPSK 一样采用**差分编码 MDPSK**（4DPSK/QDPSK），或依靠导频/训练序列消除。

## 多进制差分相移键控 MDPSK

MPSK + 差分编码；用**前后码元相位差** $\Delta\varphi\in\{2\pi i/M\}$ 承载信息。

# 7.5 多进制调制的抗噪声性能（结论）

- **MASK**：误码率随 $M$ 增大急剧上升（判决电平间隔 $2d\propto1/(M-1)$）
- **MFSK**：带宽大换误码率小，$M$ 增大误码率**下降**（唯一"越大越好"）——有效性最差
- **MPSK**：星座点最小欧氏距离 $\approx A\sin(\pi/M)$ 随 $M$ 增大而减小 → 误码率上升；$M>8$ 后距离损失严重，实际 **8PSK 已近上限** → 更高速率改用 QAM（振幅+相位联合）

> [!important] MPSK vs QAM 分界（联系第 8 章）
> 幅度恒定时星座在圆上（MPSK），点间距离受限；**放开振幅约束（QAM 方形星座）点间距离更大** → 高阶（16/64/256）一律 QAM。对比见 [[vault-notes/communication/08-advanced-digital-modulation]]。

> [!tip] 本章收官
> 本章的主线是"**受控参量 → 解调方式 → 误码率 → 带宽**"：2ASK 控振幅（最差）、2FSK 控频率（带宽最大、抗衰落最好）、2PSK 控绝对相位（误码率最好但有倒 π）、2DPSK 控相对相位（消除倒 π）。误码率表按"ASK÷4、FSK÷2、PSK÷1"记忆。多进制用 $M$ 换频带利用率：MASK/MPSK 误码率随 $M$ 上升，MFSK 反而下降但带宽最宽；高阶调制最终走向 QAM。

## 本章知识地图

```
数字带通传输
├─ 二进制调制（7.1）
│  ├─ 2ASK/OOK：单极性基带 × 载波；B=2f_B
│  ├─ 2FSK：两个频率；B=|f₂−f₁|+2f_B
│  ├─ 2PSK：双极性基带 × 载波；B=2f_B；倒 π
│  └─ 2DPSK：b_n=a_n⊕b_{n−1}；差分相干/相干+码反变换
├─ 抗噪声（7.2）
│  ├─ r = a²/(2σ_n²)
│  ├─ 相干：½erfc(√(r/k))，k=4/2/1
│  └─ 非相干：½e^(−r/k)，k=4/2/1；DPSK 差分相干 ½e^(−r)
├─ 性能比较（7.3）
│  ├─ 误码率：2PSK < 2FSK < 2ASK（相邻 3 dB）
│  ├─ 带宽：2FSK > 2ASK = 2PSK
│  ├─ 信道敏感性：2FSK 最好
│  └─ 复杂度：相干 > 非相干
├─ 多进制（7.4）
│  ├─ R_b = R_B log₂M；η_b = log₂M
│  ├─ MASK：带宽同 2ASK，抗噪差
│  ├─ MFSK：宽带宽换低误码率
│  ├─ MPSK：QPSK=2 bit/码元，8PSK 近上限
│  └─ MDPSK：差分编码解相位模糊
└─ 多进制抗噪（7.5）
   ├─ MASK↑ → P_e↑
   ├─ MFSK↑ → P_e↓（带宽最差）
   └─ MPSK↑ → P_e↑ → 高阶改用 QAM
```

## 关联

- 上一章：[[vault-notes/communication/06-digital-baseband]]
- 下一章：[[vault-notes/communication/08-advanced-digital-modulation]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 2ASK/2PSK 的基带 × 载波 | [[vault-notes/communication/06-digital-baseband]] 的基带波形与带宽 |
| 误码率公式表 | [[vault-notes/communication/03-random-processes]] 的瑞利/莱斯/高斯判决量；[[vault-notes/communication/09-optimal-reception]] 的 $E_b/n_0$ 表达 |
| 2DPSK 的差分编码 | [[vault-notes/communication/13-synchronization]] 的载波相位模糊与同步 |
| 多进制 $R_b=R_B\log_2M$ | [[vault-notes/communication/01-introduction]] 的速率换算；[[vault-notes/communication/08-advanced-digital-modulation]] 的 QAM/OFDM |
| QPSK 正交调制 | [[vault-notes/communication/08-advanced-digital-modulation]] 的 QAM 星座；[[vault-notes/5g/phy/04-physical-channels-signals]] |

**通信方向应用**：

- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 5G 下行采用 QPSK/16QAM/64QAM/256QAM 自适应调制，误码率与 $E_b/n_0$ 的关系正是本章公式表的高阶版本。
- [[vault-notes/digital-modulation/01-digital-communication-system]] —— 调制器/解调器框图与本章的 2ASK/2FSK/2PSK 产生、解调结构一一对应。
- [[vault-notes/matlab/matlab-notes]] —— 用 `pskmod`/`fskmod` 与 `berawgn` 可直接复现本章误码率曲线。

**相关**：[[vault-notes/communication/06-digital-baseband]]｜[[vault-notes/communication/08-advanced-digital-modulation]]｜[[vault-notes/communication/09-optimal-reception]]
