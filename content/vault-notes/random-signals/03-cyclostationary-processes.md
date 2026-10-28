---
title: "循环平稳过程"
tags:
- 随机信号处理
- 03-随机过程基础
- 循环平稳
- 调制信号
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

# 循环平稳过程

> [!abstract] 这一节在讲什么
> 通信信号经过调制、编码和周期采样后，统计特性往往随时间**周期变化**，不满足宽平稳，却也不是完全无规律的非平稳。本节把这类过程定义为循环平稳过程，用周期均值、周期自相关与循环频率描述其结构。
> 核心结论是：循环平稳性把“隐藏的周期性”放进循环频率 $\alpha\ne0$ 的循环谱中，可用于载频/符号率估计、调制识别与频谱感知；普通功率谱只保留 $\alpha=0$，会丢掉这部分信息。

## 一、从平稳到循环平稳

> [!info] 定义 1 广义循环平稳
> 若存在周期 $T_0>0$，使得对任意 $t,\tau$，
> $$
> \mu_X(t+T_0)=\mu_X(t),\qquad R_X(t+T_0,t+T_0+\tau)=R_X(t,t+\tau)
> $$
> 则称 $X(t)$ 为**循环平稳**（cyclostationary）过程，$T_0$ 为循环周期。若所有有限维分布都以 $T_0$ 为周期，则称严循环平稳。

循环平稳是**非平稳**的一个特殊子类：统计特性不是常数，而是随 $t$ 周期变化。它介于“完全平稳”和“任意非平稳”之间，正因为周期结构可预测，才能被利用。

> [!tip] 一句话识别
> 看自相关：若 $R_X(t,t+\tau)$ 对每个固定的 $\tau$ 都是 $t$ 的周期函数，而非常数，就是循环平稳。周期来自载波、符号时钟、帧结构或采样时钟。

## 二、周期均值与周期自相关

> [!info] 定义 2 循环自相关
> 对循环平稳过程，把周期自相关展开为傅里叶级数：
> $$
> R_X(t,t+\tau)=\sum_{\alpha}R_X^{\alpha}(\tau)e^{j2\pi\alpha t}
> $$
> 其中 $\alpha=k/T_0$ 称为**循环频率**，系数
> $$
> R_X^{\alpha}(\tau)=\lim_{T\to\infty}\frac{1}{T}\int_{-T/2}^{T/2}R_X(t,t+\tau)e^{-j2\pi\alpha t}\,\mathrm{d}t
> $$
> 称为**循环自相关函数**。$\alpha=0$ 的分量就是时间平均自相关。

均值也可展开：

$$
\mu_X(t)=\sum_{k}\mu_X^{(k)}e^{j2\pi kt/T_0}
$$

若 $\mu_X(t)$ 为常数而 $R_X(t,t+\tau)$ 仍周期变化，则循环平稳性来自二阶统计，而不是均值。

| 量 | 平稳过程 | 循环平稳过程 |
| --- | --- | --- |
| 均值 | 常数 | 周期函数 $\mu_X(t+T_0)=\mu_X(t)$ |
| 自相关 | $R_X(\tau)$ | $R_X(t,t+\tau)$，对 $t$ 周期 |
| 频域描述 | 功率谱 $S_X(\omega)$ | 循环谱 $S_X^{\alpha}(\omega)$ |
| 非零循环频率 | 不存在 | $\alpha=k/T_0$ 处有结构 |
| 典型来源 | 热噪声、平稳干扰 | 调制、编码、采样、帧结构 |

## 三、调制信号为什么循环平稳

> [!example] 例 1 确定载波相位的 AM
> 设 $X(t)=\big[A_0+m(t)\big]\cos(\omega_ct+\varphi)$，$m(t)$ 为零均值 WSS 信号，$\varphi$ 为常数。则
> $$
> R_X(t,t+\tau)=\frac{1}{2}\big[A_0^2+R_m(\tau)\big]\big[\cos\omega_c\tau+\cos(2\omega_ct+\omega_c\tau+2\varphi)\big]
> $$
> 第二项以 $2\omega_c$ 对应的周期 $T_0=\pi/\omega_c$ 随 $t$ 变化，因此过程循环平稳，循环频率为 $\alpha=2f_c$。

> [!warning] 随机载波相位会把循环性“平均掉”
> 若上例中的 $\varphi\sim U[0,2\pi)$ 且与 $m(t)$ 独立，则对 $\varphi$ 取平均后第二项为零，$R_X$ 只剩 $\frac{1}{2}[A_0^2+R_m(\tau)]\cos\omega_c\tau$，过程退化为 WSS。循环平稳分析必须保留相位参考；建模时随手加一个均匀随机相位，可能把要检测的特征抹掉。

> [!example] 例 2 BPSK 的符号率循环平稳
> 设 $X(t)=A\sum_n a_n p(t-nT_s)\cos(\omega_ct+\varphi)$，$a_n$ 为零均值独立符号，$p(t)$ 为成形脉冲。复包络的自相关以 $T_s$ 为周期，循环频率为 $\alpha=k/T_s$。即使载波相位随机使 $2f_c$ 分量消失，符号率循环平稳仍保留在复包络中，可用于符号速率估计。

常见循环特征可以归纳为：

| 结构 | 典型循环频率 | 可估计的参数 |
| --- | --- | --- |
| 未抑制载波 | $\alpha=2f_c$ | 载波频率 |
| 符号成形 | $\alpha=k/T_s$ | 符号率、成形滚降 |
| 周期前缀 | $\alpha=k/T_u$ | OFDM 有用符号长度 |
| 帧同步头 | $\alpha=k/T_f$ | 帧周期 |
| 采样时钟 | $\alpha=kf_s$ | 采样频偏 |

## 四、循环谱与工程用途

> [!info] 定义 3 循环谱
> 循环自相关的傅里叶变换
> $$
> S_X^{\alpha}(\omega)=\int_{-\infty}^{\infty}R_X^{\alpha}(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau
> $$
> 称为**循环谱**（cyclic spectrum）。当 $\alpha=0$ 时退化为普通功率谱密度 $S_X(\omega)$。

循环谱把一维功率谱扩展成“循环频率–频率”的二维平面：$\alpha=0$ 一行是传统 PSD，$\alpha\ne0$ 的行则显示被调制、编码或采样引入的周期结构。工程上的典型用途包括：

- 盲调制识别：不同调制阶数与成形脉冲在循环谱上呈现不同图案；
- 符号率与载频估计：在低信噪比下比直接看 PSD 更稳健；
- 频谱感知与干扰识别：利用循环特征区分信号与平稳噪声；
- 机械故障诊断：轴承、齿轮的周期冲击同样表现为循环平稳。

> [!warning] 循环平稳不等于“周期信号”
> 周期信号的每条样本都相同且功率谱是离散谱线；循环平稳过程仍有随机性，只是二阶统计周期变化。它的循环谱通常在 $\alpha\ne0$ 处连续分布，而不是一根根冲激。

## 五、与 WSS 的区别与使用边界

循环平稳过程一般不满足 WSS，因此不能直接套用 $R_X(\tau)$、$S_X(\omega)$ 的结论；但若只关心时间平均行为，可先对 $t$ 做周期平均，得到等效的 WSS 二阶统计。分析时要明确：

1. 是否保留了相位/时钟参考；
2. 观测长度是否覆盖多个循环周期；
3. 是否需要 $\alpha\ne0$ 的信息，还是只做普通谱估计；
4. 采样率与循环频率是否满足不发生混叠。

> [!tip] 与前文的联系
> 随机相位正弦在相位均匀随机时是 WSS；一旦相位固定或存在符号时钟，二阶统计就出现周期分量。判断顺序应为：先看均值是否周期，再看自相关是否随 $t$ 周期变化，最后才决定用 WSS 工具还是循环平稳工具。

## 六、作业题解析

> [!note] 题目来源
> 本节收录课程作业第 2 组（随机过程 1–5 题）中与本篇相关的题目，原始截图见 作业截图。解析按“读题 → 判据 → 推导 → 易错点”展开，记号与正文一致。

### 题 4 · 正交载波调制：实信号循环平稳与复信号平稳

> [!example] 题目
> 已知两个随机过程 $X(t)=A(t)\cos(\omega_ct)$，$Y(t)=B(t)\sin(\omega_ct)$，其中 $A(t),B(t)$ 是相互独立的零均值平稳随机过程，且它们的自相关函数相同，$\omega_c$ 是常数。试证明：
> （1）$X(t),Y(t)$ 不是平稳的；
> （2）$Z(t)=X(t)+jY(t)$ 是广义平稳的。
> 注意：复随机过程的自相关函数定义为 $R_Z(t_1,t_2)=E\big[Z(t_1)Z^*(t_2)\big]$。

**解**：

（1）先算 $X(t)$ 的均值与自相关。$A(t)$ 零均值，乘以确定性载波后均值仍为零：
$$
\mu_X(t)=E[A(t)]\cos\omega_ct=0
$$
$$
R_X(t_1,t_2)=E\big[A(t_1)A(t_2)\big]\cos\omega_ct_1\cos\omega_ct_2=R_A(\tau)\cos\omega_ct_1\cos\omega_ct_2,\qquad\tau=t_1-t_2
$$
用积化和差 $2\cos\alpha\cos\beta=\cos(\alpha-\beta)+\cos(\alpha+\beta)$：
$$
R_X(t_1,t_2)=\frac12R_A(\tau)\big[\cos\omega_c\tau+\cos\omega_c(t_1+t_2)\big]
$$
第二项随 $t_1+t_2$ 变化，$R_X$ 不能只写成 $\tau$ 的函数，因此 $X(t)$ 不是宽平稳的。$Y(t)$ 同理，只是正弦乘积差一个符号：
$$
\mu_Y(t)=0,\qquad R_Y(t_1,t_2)=\frac12R_A(\tau)\big[\cos\omega_c\tau-\cos\omega_c(t_1+t_2)\big]
$$
同样含 $t_1+t_2$ 项。又因严平稳且二阶矩有限必蕴含宽平稳，故 $X,Y$ 不是宽平稳即证明它们不平稳。直观证据：令 $t_1=t_2=t$，有
$$
R_X(t,t)=\frac12R_A(0)\big[1+\cos2\omega_ct\big]
$$
功率本身随 $t$ 起伏，这是最直接的非平稳表现。

（2）$Z(t)$ 的均值为
$$
\mu_Z(t)=E[X(t)]+jE[Y(t)]=0
$$
按定义展开自相关，第二个因子要取共轭：
$$
R_Z(t_1,t_2)=E\big[(X(t_1)+jY(t_1))(X(t_2)-jY(t_2))\big]=R_X(t_1,t_2)+R_Y(t_1,t_2)+j\big[E(Y(t_1)X(t_2))-E(X(t_1)Y(t_2))\big]
$$
交叉项因 $A,B$ 相互独立且都零均值而消失：
$$
E\big[Y(t_1)X(t_2)\big]=E\big[B(t_1)A(t_2)\big]\sin\omega_ct_1\cos\omega_ct_2=0,\qquad E\big[X(t_1)Y(t_2)\big]=0
$$
把 $R_X$ 与 $R_Y$ 相加，$\cos\omega_c(t_1+t_2)$ 项恰好抵消：
$$
R_Z(t_1,t_2)=\frac12R_A(\tau)\big[\cos\omega_c(t_1+t_2)+\cos\omega_c(t_1-t_2)\big]+\frac12R_A(\tau)\big[\cos\omega_c(t_1-t_2)-\cos\omega_c(t_1+t_2)\big]=R_A(\tau)\cos\omega_c\tau
$$
于是 $R_Z(t_1,t_2)=R_Z(\tau)$ 只依赖时间差，且 $\mu_Z=0$ 为常数，故 $Z(t)$ 是广义平稳的。

**答**：（1）$R_X$、$R_Y$ 都含有 $\cos\omega_c(t_1+t_2)$ 项，二阶统计随绝对时间变化，$X,Y$ 不平稳；（2）交叉项为零，$R_X+R_Y$ 中 $t_1+t_2$ 项抵消得 $R_Z(\tau)=R_A(\tau)\cos\omega_c\tau$，配合 $\mu_Z=0$，$Z(t)$ 广义平稳，平均功率 $R_Z(0)=R_A(0)$。

> [!tip] 这就是“实信号循环平稳、复包络平稳”
> $X,Y$ 的自相关以 $\pi/\omega_c$ 为周期随 $t$ 变化，循环频率为 $2f_c$，与 §三 例 1 的结构一致；合并成 $Z$ 后，载波的周期结构被复指数吸收，二阶统计退化为 WSS。相干解调保留相位参考时，接收机看到的就是这个平稳的复基带过程，这正是通信系统大量采用复包络建模的原因。

> [!warning] 易错点
> 1. 证明“不平稳”必须指出 $R$ 中哪一项不能化成 $\tau$ 的函数，只说“乘了 $\cos\omega_ct$ 所以不平稳”不构成证明。
> 2. 交叉项为零依赖“独立 + 零均值”两个条件，缺一不可：若 $A,B$ 均值非零，$E(Y(t_1)X(t_2))=E[B]E[A]\sin\omega_ct_1\cos\omega_ct_2\ne0$，$Z$ 一般不再平稳。
> 3. 复过程必须用 $R_Z(t_1,t_2)=E[Z(t_1)Z^*(t_2)]$。若误用 $E[Z(t_1)Z(t_2)]$，得到的是 $R_X-R_Y$ 加交叉项的组合，$t_1=t_2$ 时也不等于平均功率 $E\big[\lvert Z\rvert^2\big]$。

## 关联

- 上一节：[[vault-notes/random-signals/03-poisson-markov-processes]]
- 下一节：[[vault-notes/random-signals/04-autocorrelation-autocovariance]]（04 模块首篇）
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/communication/02-deterministic-signals]]、[[vault-notes/5g/phy/04-physical-channels-signals]]、[[vault-notes/fpga/ad9361/iq-signals]]
