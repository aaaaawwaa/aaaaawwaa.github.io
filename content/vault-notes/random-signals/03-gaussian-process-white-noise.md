---
title: "高斯过程与白噪声"
tags:
- 随机信号处理
- 03-随机过程基础
- 高斯过程
- 白噪声
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

# 高斯过程与白噪声

> [!abstract] 这一节在讲什么
> 高斯过程是一类仅由均值函数和协方差函数就完全确定的随机过程，经过线性系统后仍是高斯过程；白噪声则是功率谱在所有频率上平坦的理想噪声模型，是 AWGN 信道分析的起点。
> 本节给出高斯过程的定义与封闭性、连续与离散白噪声的相关函数和功率谱、带限白噪声的功率计算，并固定双边谱 $N_0/2$ 与单边谱 $N_0$ 的使用约定。

## 一、高斯过程的定义

> [!info] 定义 1 高斯过程
> 若随机过程 $X(t)$ 的任意有限维随机向量 $\big(X(t_1),\dots,X(t_n)\big)$ 都服从联合高斯分布，则称 $X(t)$ 为**高斯过程**。其统计特性完全由均值函数 $\mu_X(t)$ 与协方差函数 $C_X(t_1,t_2)$ 决定。

若协方差矩阵 $\mathbf{C}$ 非奇异，$n$ 维密度为

$$f(\mathbf{x})=\frac{1}{(2\pi)^{n/2}\lvert\mathbf{C}\rvert^{1/2}}
\exp\left[-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^T\mathbf{C}^{-1}(\mathbf{x}-\boldsymbol{\mu})\right]$$

高斯过程的重要封闭性：

| 结论 | 内容 | 用途 |
| --- | --- | --- |
| 线性变换封闭 | $\mathbf{Y}=\mathbf{A}\mathbf{X}+\mathbf{b}$ 仍为高斯向量 | 采样、正交变换、波束成形 |
| 线性系统封闭 | 高斯过程激励 LTI 系统，输出仍为高斯过程 | 接收机前端、滤波器 |
| 不相关即独立 | 联合高斯且不相关 $\Longrightarrow$ 独立 | 简化似然函数与检测器 |
| 平稳等价 | 高斯过程 WSS $\Longleftrightarrow$ 严平稳（二阶矩有限） | 只需检验二阶统计 |
| 条件均值线性 | $E[X(t)\mid \mathbf{Y}]$ 是 $\mathbf{Y}$ 的仿射函数 | 卡尔曼滤波、MMSE 估计 |

> [!tip] 为什么通信里偏爱高斯模型
> 大量独立小扰动叠加后，由中心极限定理趋于高斯；高斯噪声经过线性接收机后仍是高斯，判决量分布可用 $Q$ 函数统一计算；并且二阶统计就足够描述全部统计特性。这三条使 AWGN 模型既好算又常成立。

## 二、连续时间白噪声

> [!info] 定义 2 连续时间白噪声
> 零均值广义平稳过程 $W(t)$ 若满足
> $$
> R_W(\tau)=\frac{N_0}{2}\delta(\tau),\qquad S_W(\omega)=\frac{N_0}{2}\quad(\text{对所有 }\omega)
> $$
> 则称为**白噪声**。$N_0/2$ 是双边功率谱密度，$N_0$ 是相应的单边功率谱密度。

“白”指功率谱在所有频率上一样平，像白光包含全部可见光频率。由 $R_W(0)=\frac{N_0}{2}\delta(0)$ 可见理想白噪声的功率为无穷大，它是数学理想化模型，物理上只能近似存在于有限带宽内。

两个常见误解：

- 白噪声在不同时刻**不相关**，但“不相关”不等于“独立”；只有高斯白噪声才同时独立。
- 白噪声的样本函数并不“白”，它剧烈跳变、不可微，不能按普通函数逐点理解；严格数学处理要借助广义过程。

## 三、离散白噪声与带限白噪声

> [!info] 定义 3 离散白噪声
> 若序列 $W[n]$ 满足 $E[W[n]]=0$、$\mathrm{Var}(W[n])=\sigma^2$，且
> $$
> R_W[m]=\sigma^2\delta[m],\qquad S_W(e^{j\omega})=\sigma^2\quad(\lvert\omega\rvert\le\pi)
> $$
> 则称为**离散白噪声**。若各采样独立同分布，则进一步称为独立白噪声。

> [!info] 定义 4 带限白噪声
> 若功率谱在带宽内平坦、带外为零：
> $$
> S_W(\omega)=\begin{cases}\dfrac{N_0}{2},&\lvert\omega\rvert\le2\pi B\\ 0,&\text{其他}\end{cases}
> $$
> 则
> $$
> R_W(\tau)=N_0B\,\mathrm{sinc}(2B\tau),\qquad P_W=N_0B
> $$
> 其中 $\mathrm{sinc}(x)=\sin(\pi x)/(\pi x)$。

| 类型 | 自相关 | 功率谱 | 平均功率 | 采样相关性 |
| --- | --- | --- | --- | --- |
| 连续白噪声 | $\frac{N_0}{2}\delta(\tau)$ | 常数 $N_0/2$ | 无穷 | $\tau\ne0$ 即不相关 |
| 离散白噪声 | $\sigma^2\delta[m]$ | 常数 $\sigma^2$ | $\sigma^2$ | 任意不同时刻不相关 |
| 带限白噪声 | $N_0B\,\mathrm{sinc}(2B\tau)$ | 矩形 | $N_0B$ | 奈奎斯特间隔处不相关 |

带限白噪声在 $\tau=k/(2B)$（$k\ne0$）处相关函数为零，因此以 $2B$ 采样得到的噪声样本互不相关；若为高斯，则彼此独立。这解释了为什么仿真中常用独立高斯序列近似采样噪声。

## 四、噪声功率与信噪比

对带宽为 $B$ 的理想带限白噪声，噪声平均功率为

$$
P_n=N_0B
$$

若信号平均功率为 $P_s$，则信噪比为

$$
\mathrm{SNR}=\frac{P_s}{P_n}=\frac{P_s}{N_0B}
$$

在数字通信中常用每比特能量与噪声谱密度之比：

$$
\frac{E_b}{N_0}=\mathrm{SNR}\cdot\frac{B}{R_b}
$$

其中 $R_b$ 为比特率。注意 $N_0$ 是单边谱密度；双边谱为 $N_0/2$，在单边带宽 $B$ 内的总功率仍为 $N_0B$。

> [!warning] 单边与双边必须一次说清
> 写 $S_W(\omega)=N_0/2$ 表示双边谱；写单边谱时应为 $N_0$。若用双边谱 $N_0/2$，则单边谱为 $N_0$，带宽 $B$ 内的噪声功率为 $N_0B$；$\omega$ 与 $f$ 换算时不要重复乘 $2\pi$。看到“白噪声功率 $N_0B$”时，默认 $N_0$ 是单边谱、$B$ 是单边带宽。

## 五、与窄带高斯噪声的衔接

通信接收机前端通常是中心频率 $f_c$、带宽 $B\ll f_c$ 的带通系统。白噪声通过该带通系统后成为**窄带高斯噪声**，可写成

$$
N(t)=N_c(t)\cos\omega_ct-N_s(t)\sin\omega_ct
$$

其中同相分量 $N_c(t)$ 与正交分量 $N_s(t)$ 是零均值、方差相同的低频高斯过程；包络服从瑞利分布，相位服从均匀分布。窄带高斯噪声加正弦信号的包络则服从莱斯分布，这些结论是误码率推导的基础，详见 [[vault-notes/communication/03-random-processes]]。

> [!example] 数值感受
> 设 $N_0=10^{-20}\ \mathrm{W/Hz}$，$B=20\ \mathrm{MHz}$，则 $P_n=N_0B=2\times10^{-13}\ \mathrm{W}$，即约 $-97\ \mathrm{dBm}$。若要求 $\mathrm{SNR}=10\ \mathrm{dB}$，则信号功率约为 $-87\ \mathrm{dBm}$。

## 六、作业题解析

> [!note] 题目来源
> 本节收录课程作业第 2 组（随机过程 1–5 题）中与本篇相关的题目，原始截图见 作业截图。解析按“读题 → 判据 → 推导 → 易错点”展开，记号与正文一致。

### 题 2 · 高斯振幅线性组合的一维与二维密度

> [!example] 题目
> 设随机过程 $X(t)=A\cos(\omega_0t)+B\sin(\omega_0t)$，其中 $\omega_0$ 是常数，$A,B$ 是两个高斯随机变量，它们的联合概率密度函数为
> $$
> f_{AB}(a,b)=\frac{1}{\pi\sqrt3\,\sigma^2}\exp\left[-\frac{2}{3\sigma^2}\left(a^2-ab+b^2\right)\right]
> $$
> 试求 $X(t)$ 的一维和二维概率密度函数。（可以不考虑 $\cos(\omega_0t)$ 和 $\sin(\omega_0t)$ 为零的情况。）

**解**：

**第一步，读出 $(A,B)$ 的二阶矩。** 把指数与二元高斯密度的标准型
$$
-\frac{1}{2(1-\rho^2)}\left[\frac{(a-\mu_A)^2}{\sigma_A^2}-\frac{2\rho(a-\mu_A)(b-\mu_B)}{\sigma_A\sigma_B}+\frac{(b-\mu_B)^2}{\sigma_B^2}\right]
$$
逐项对比：无一次项，故 $\mu_A=\mu_B=0$；二次型可写成 $-\frac12\mathbf z^T\boldsymbol\Sigma^{-1}\mathbf z$，其中
$$
\boldsymbol\Sigma=\sigma^2\begin{bmatrix}1&1/2\\ 1/2&1\end{bmatrix},\qquad \lvert\boldsymbol\Sigma\rvert=\frac34\sigma^4,\qquad \boldsymbol\Sigma^{-1}=\frac{4}{3\sigma^2}\begin{bmatrix}1&-1/2\\ -1/2&1\end{bmatrix}
$$
核对归一化：$\dfrac{1}{2\pi\sqrt{\lvert\boldsymbol\Sigma\rvert}}=\dfrac{1}{2\pi\sigma^2\sqrt{3/4}}=\dfrac{1}{\pi\sqrt3\,\sigma^2}$，与题给系数一致。故 $A,B$ 零均值、方差均为 $\sigma^2$、相关系数 $\rho=1/2$。

**第二步，一维密度。** $X(t)$ 是 $(A,B)$ 的线性变换，由 §一 的线性变换封闭性，$X(t)$ 服从一维高斯分布。记 $c=\cos\omega_0t$、$s=\sin\omega_0t$，则
$$
E[X(t)]=0,\qquad \mathrm{Var}\big(X(t)\big)=c^2\sigma^2+s^2\sigma^2+2cs\cdot\frac{\sigma^2}{2}=\sigma^2\left(1+\frac12\sin2\omega_0t\right)
$$
其中用了 $c^2+s^2=1$、$2cs=\sin2\omega_0t$。方差在 $\sigma^2/2$ 与 $3\sigma^2/2$ 之间随 $t$ 摆动且恒正，故
$$
f_X(x;t)=\frac{1}{\sqrt{2\pi\sigma^2\left(1+\frac12\sin2\omega_0t\right)}}\exp\left[-\frac{x^2}{2\sigma^2\left(1+\frac12\sin2\omega_0t\right)}\right]
$$

**第三步，二维密度。** 记 $c_i=\cos\omega_0t_i$、$s_i=\sin\omega_0t_i$，$i=1,2$。由双线性性
$$
\mathrm{Cov}\big(X(t_1),X(t_2)\big)=\sigma^2(c_1c_2+s_1s_2)+\frac{\sigma^2}{2}(c_1s_2+s_1c_2)
$$
前一项用余弦差角公式、后一项用正弦和角公式：
$$
\mathrm{Cov}\big(X(t_1),X(t_2)\big)=\sigma^2\cos\omega_0(t_1-t_2)+\frac{\sigma^2}{2}\sin\omega_0(t_1+t_2)
$$
记 $v_i=\mathrm{Var}\big(X(t_i)\big)$、$c_{12}=\mathrm{Cov}\big(X(t_1),X(t_2)\big)$。行列式也可由线性变换直接算：写成 $(X(t_1),X(t_2))^T=\mathbf M(A,B)^T$，$\mathbf M=\begin{bmatrix}c_1&s_1\\ c_2&s_2\end{bmatrix}$，$\lvert\mathbf M\rvert=-\sin\omega_0(t_1-t_2)$，故
$$
\lvert\mathbf C\rvert=v_1v_2-c_{12}^2=\lvert\mathbf M\rvert^2\lvert\boldsymbol\Sigma\rvert=\frac34\sigma^4\sin^2\omega_0(t_1-t_2)
$$
它只在 $t_1-t_2=k\pi/\omega_0$ 时为零，正是题目允许忽略的退化情形。二维联合密度为
$$
f_X(x_1,x_2;t_1,t_2)=\frac{1}{2\pi\sqrt{v_1v_2-c_{12}^2}}\exp\left[-\frac{v_2x_1^2-2c_{12}x_1x_2+v_1x_2^2}{2\left(v_1v_2-c_{12}^2\right)}\right]
$$
把 $v_1,v_2,c_{12}$ 的表达式代入，即得最终结果。

**答**：$X(t)$ 是高斯过程。一维分布为 $N\!\left(0,\ \sigma^2\left(1+\frac12\sin2\omega_0t\right)\right)$；二维分布为零均值二元高斯分布，协方差矩阵元素为
$$
\mathrm{Var}\big(X(t_i)\big)=\sigma^2\left(1+\frac12\sin2\omega_0t_i\right),\qquad \mathrm{Cov}\big(X(t_1),X(t_2)\big)=\sigma^2\cos\omega_0(t_1-t_2)+\frac{\sigma^2}{2}\sin\omega_0(t_1+t_2)
$$
密度按上式代入，$\lvert\mathbf C\rvert=\frac34\sigma^4\sin^2\omega_0(t_1-t_2)$。

> [!warning] 易错点
> 1. 题给的 $f_{AB}$ 不是独立同方差的高斯密度（那对应 $\rho=0$）：指数里的 $-ab$ 项给出 $\rho=1/2$。把它当成 $A,B$ 独立，方差与协方差都会算错。
> 2. 二维协方差不能写成 $\sigma^2\cos\omega_0(t_1-t_2)$ 一项：还有 $\frac{\sigma^2}{2}\sin\omega_0(t_1+t_2)$，其中 $t_1+t_2$ 正是过程非平稳的来源。令 $t_1=t_2$ 时它退化为 $\frac{\sigma^2}{2}\sin2\omega_0t$，正好补上方差里的 $\frac12\sin2\omega_0t$。
> 3. 题目说“可以不考虑 $\cos$ 和 $\sin$ 为零”，指的是二维协方差矩阵退化（$t_1-t_2=k\pi/\omega_0$ 时 $\lvert\mathbf C\rvert=0$，密度不存在），不是一维方差为零——一维方差最小为 $\sigma^2/2>0$。
> 4. 每个时刻 $X(t)$ 都服从高斯，且任意有限个时刻联合高斯，所以 $X(t)$ 确为高斯过程；但它不宽平稳（方差随 $t$ 变），不能套用平稳过程只依赖 $\tau$ 的结论，参见 [[vault-notes/random-signals/03-strict-vs-wide-sense-stationary]]。

## 关联

- 上一节：[[vault-notes/random-signals/03-ergodicity]]
- 下一节：[[vault-notes/random-signals/03-poisson-markov-processes]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/communication/04-channel]]、[[vault-notes/matlab/matlab-notes]]、[[vault-notes/5g/phy/04-physical-channels-signals]]
