---
title: "自相关与自协方差"
tags:
- 随机信号处理
- 04-随机信号的时域分析
- 自相关
- 自协方差
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

# 自相关与自协方差

> [!abstract] 这一节在讲什么
> 自相关函数回答“同一个随机信号在相隔 $\tau$ 的两个时刻有多像”，自协方差则先去掉均值再回答同一问题。对宽平稳过程，两者都只依赖时间差，是把随机波形压缩成一条确定曲线的核心工具。
> 本节给出它们的定义、性质、相关时间与白噪声/正弦/AR(1) 三个标准例子，并说明何时必须去均值：看总功率用自相关，看起伏结构用自协方差。

## 一、宽平稳下的定义

> [!info] 定义 1 自相关与自协方差
> 对宽平稳过程 $X(t)$，定义
> $$
> R_X(\tau)=E\big[X(t+\tau)X^*(t)\big]
> $$
> $$
> C_X(\tau)=E\big[(X(t+\tau)-\mu_X)(X(t)-\mu_X)^*\big]=R_X(\tau)-\lvert\mu_X\rvert^2
> $$
> 分别称为**自相关函数**与**自协方差函数**。离散情形为
> $$
> R_X[m]=E\big[X[n+m]X^*[n]\big],\qquad C_X[m]=R_X[m]-\lvert\mu_X\rvert^2
> $$

本库采用 $X(t+\tau)$ 在前、$X(t)$ 在后的约定，因此对复过程有 $R_X(-\tau)=R_X^*(\tau)$。若换成相反约定，相关函数变成共轭反转，实过程不受影响，复过程的所有相位结论都要跟着改。

> [!warning] 三个符号不能混
> $R_X(\tau)$ 是含直流的二阶矩；$C_X(\tau)$ 是去均值后的二阶中心矩；$\sigma_X^2=C_X(0)$ 是方差。只有当 $\mu_X=0$ 时才有 $R_X(\tau)=C_X(\tau)$。

## 二、性质清单

> [!info] 定义 2 自相关函数的性质
> 1. **共轭对称**：$R_X(-\tau)=R_X^*(\tau)$；实过程为偶函数。
> 2. **原点为功率**：$R_X(0)=E[\lvert X(t)\rvert^2]\ge0$，且为实数。
> 3. **原点最大**：$\lvert R_X(\tau)\rvert\le R_X(0)$。
> 4. **非负定**：对任意 $\tau_i$ 与复数 $a_i$，$\sum_i\sum_j a_ia_j^*R_X(\tau_i-\tau_j)\ge0$。
> 5. **连续性与谱**：若 $R_X$ 在 $0$ 处连续，则处处连续；其傅里叶变换 $S_X(\omega)\ge0$。

自协方差具有完全相同的四条性质，只需把 $R_X(0)$ 换成 $C_X(0)=\sigma_X^2$。归一化自相关定义为

$$
\rho_X(\tau)=\frac{C_X(\tau)}{C_X(0)},\qquad \rho_X(0)=1,\quad \lvert\rho_X(\tau)\rvert\le1
$$

它无量纲，适合比较不同量级信号的相关结构。

| 性质 | 自相关 $R_X(\tau)$ | 自协方差 $C_X(\tau)$ | 直观含义 |
| --- | --- | --- | --- |
| 原点值 | $E[\lvert X\rvert^2]$ | $\sigma_X^2$ | 总功率 / 起伏功率 |
| 无穷远处（相关衰减时） | 趋于 $\lvert\mu_X\rvert^2$ | 趋于 $0$ | 长时去相关 |
| 偶对称（实） | 是 | 是 | 正负延迟相同 |
| 峰值位置 | $\tau=0$ | $\tau=0$ | 自身最相似 |
| 傅里叶变换 | $S_X(\omega)\ge0$ | $S_X(\omega)-2\pi\lvert\mu_X\rvert^2\delta(\omega)$ | 谱非负 |

## 三、相关时间

> [!info] 定义 3 相关时间
> 相关时间衡量“相隔多久后波形基本不相关”。常见三种定义：
> 1. 积分尺度：$\tau_c=\int_0^{\infty}\lvert\rho_X(\tau)\rvert\,\mathrm{d}\tau$；
> 2. 首次过零：$\tau_c=\min\lbrace\tau>0:\rho_X(\tau)=0\rbrace$；
> 3. $1/e$ 衰减：满足 $\lvert\rho_X(\tau_c)\rvert=e^{-1}$ 的 $\tau_c$。

| 定义 | 适合的信号 | 特点 |
| --- | --- | --- |
| 积分尺度 | 单调衰减的相关函数 | 对缓慢拖尾敏感 |
| 首次过零 | 有振荡的相关函数 | 可能偏小，忽略后续相关 |
| $1/e$ 衰减 | 指数型相关 | 计算简单，常用于 AR(1) |

相关时间给出两个工程尺度：有效独立样本数约为 $N_{\mathrm{eff}}\approx T/(2\tau_c)$；功率谱的主瓣宽度约为 $\Delta\omega\sim1/\tau_c$。相关时间越长，谱越窄，估计谱所需的记录也越长。

## 四、三个典型例子

| 过程 | $R_X$ | $C_X$ | $\rho_X$ | 功率 | 相关时间 |
| --- | --- | --- | --- | --- | --- |
| 白噪声（连续） | $\sigma^2\delta(\tau)$ | $\sigma^2\delta(\tau)$ | 仅在 $0$ 处非零 | $\sigma^2$ | $0$ |
| 随机相位正弦 | $\frac{A^2}{2}\cos\omega_0\tau$ | 同左 | $\cos\omega_0\tau$ | $A^2/2$ | 不衰减 |
| AR(1)（离散） | $\frac{\sigma_w^2}{1-a^2}a^{\lvert m\rvert}$ | 同左 | $a^{\lvert m\rvert}$ | $\frac{\sigma_w^2}{1-a^2}$ | $\frac{1}{1-a}$ 点 |

> [!example] AR(1) 的推导
> 设 $X[n]=aX[n-1]+W[n]$，$\lvert a\rvert<1$，$W[n]$ 为零均值白噪声、方差 $\sigma_w^2$，且与过去值独立。两边乘 $X[n-m]$ 取期望，对 $m\ge1$ 得
> $$
> R_X[m]=aR_X[m-1]\ \Longrightarrow\ R_X[m]=a^mR_X[0]
> $$
> 再由 $R_X[0]=aR_X[1]+\sigma_w^2=a^2R_X[0]+\sigma_w^2$，解得
> $$
> R_X[0]=\frac{\sigma_w^2}{1-a^2}
> $$
> 结合偶对称即得表中结果。$a$ 越接近 $1$，相关时间越长，谱越窄。

> [!tip] 三个例子记住三句话
> 白噪声“只有当下相关”；正弦“永远相关但相位振荡”；AR(1)“指数遗忘”。这三条覆盖了谱平坦、谱为线谱、谱为低通三种典型形态。

## 五、去均值的必要性

> [!example] 直流会掩盖相关结构
> 设 $X(t)=A+N(t)$，$A$ 为常数，$N(t)$ 为零均值 WSS 噪声。则
> $$
> R_X(\tau)=A^2+R_N(\tau),\qquad C_X(\tau)=R_N(\tau)
> $$
> 当 $A$ 很大时，$R_X(\tau)$ 几乎是一条水平线，看不出噪声的相关时间；$C_X(\tau)$ 才能恢复 $R_N(\tau)$ 的形状。若再做归一化，$\rho_X(\tau)=R_N(\tau)/R_N(0)$ 与直流大小无关。

选择哪一个量取决于问题：计算总功率、信噪比中的信号加噪声功率时用 $R_X(0)$；判断噪声白化程度、估计相关时间、做谱估计前的预处理时用 $C_X$。写答案时应注明“已去均值”或“未去均值”，否则同一句“相关系数为 0.8”可能有完全不同的含义。

> [!warning] 相关时间不是唯一常数
> 同一过程用积分尺度、首次过零和 $1/e$ 定义会得到不同数值。工程报告中必须写明采用哪种定义；比较不同信号时也要用同一定义。

## 六、作业题解析

> [!note] 题目来源
> 本节收录课程作业第 2 组（随机过程 1–5 题）中与本篇相关的题目，原始截图见 作业截图。解析按“读题 → 判据 → 推导 → 易错点”展开，记号与正文一致。

### 题 5 · 指数型自相关加常数项的相关时间

> [!example] 题目
> 已知平稳随机过程的自相关函数 $R_X(\tau)=\sigma_X^2e^{-\alpha\lvert\tau\rvert}+\beta$，其中 $\sigma_X^2,\alpha,\beta$ 都是常数。试求相关时间 $t_0$。

**解**：

**先明确归一化。** §三 的三种定义都建立在归一化相关函数上，而本题含常数项 $\beta$，归一化方式会直接改变答案，因此两种常用归一化都要写出来：
$$
\rho_1(\tau)=\frac{R_X(\tau)}{R_X(0)}=\frac{\sigma_X^2e^{-\alpha\lvert\tau\rvert}+\beta}{\sigma_X^2+\beta},\qquad \rho_2(\tau)=\frac{C_X(\tau)}{C_X(0)}=e^{-\alpha\lvert\tau\rvert}
$$
$\rho_1$ 是总功率归一化，$\rho_2$ 是正文 §二 采用的协方差归一化。若把 $\beta$ 解释为随机直流功率 $\lvert\mu_X\rvert^2$，则 $\sigma_X^2$ 恰为方差，$R_X(0)=\sigma_X^2+\beta$ 为平均功率。$\beta$ 的物理含义是自相关中**不衰减的部分**（随机直流或未抑制的周期分量），它使 $\rho(\tau)$ 在 $\tau\to\infty$ 时不趋于 $0$。

这正是本篇 §五 讲过的现象：常数项相当于随机直流，直接用 $R_X$ 归一化会把“直流平台”也算进相关时间；先把直流去掉（用 $C_X$ 归一化）才能看出噪声本身的衰减速度。因此工程上遇到本题形状的自相关，**默认答案是先去掉 $\beta$ 再算 $t_0=1/\alpha$**，下面的三种定义则用来说明“不这么做会得到什么”。

（1）积分尺度 $\tau_c=\int_0^{\infty}\lvert\rho(\tau)\rvert\,\mathrm{d}\tau$。用 $\rho_1$ 时 $\rho_1(\infty)=\dfrac{\beta}{\sigma_X^2+\beta}\ne0$（$\beta\ne0$），被积函数不趋于零，积分发散：
$$
t_0=\int_0^{\infty}\lvert\rho_1(\tau)\rvert\,\mathrm{d}\tau=+\infty\quad(\beta\ne0),\qquad t_0=\int_0^{\infty}e^{-\alpha\tau}\,\mathrm{d}\tau=\frac1\alpha\quad(\beta=0)
$$
用 $\rho_2$ 时被积函数恒为 $e^{-\alpha\tau}$，与 $\beta$ 无关，恒有 $t_0=1/\alpha$。

（2）首次过零 $\tau_c=\min\lbrace\tau>0:\rho(\tau)=0\rbrace$。$\rho_1(\tau)=0$ 要求 $\sigma_X^2e^{-\alpha\tau}=-\beta$，故仅当 $\beta<0$ 时有解：
$$
t_0=\frac1\alpha\ln\frac{\sigma_X^2}{-\beta}\qquad(-\sigma_X^2<\beta<0)
$$
$\beta\ge0$ 时 $\rho_1(\tau)$ 恒正，不存在过零点，该定义失效。$\rho_2(\tau)=e^{-\alpha\lvert\tau\rvert}>0$ 恒成立，对任何 $\beta$ 都无过零点。这也说明 §三 把首次过零列为“适合振荡型相关函数”的定义是合理的：单调衰减的指数相关本来就没有过零点。

（3）$1/e$ 衰减，解 $\rho(t_0)=e^{-1}$。用 $\rho_1$：
$$
\frac{\sigma_X^2e^{-\alpha t_0}+\beta}{\sigma_X^2+\beta}=\frac1e\ \Longrightarrow\ e^{-\alpha t_0}=\frac1e-\frac{\beta}{\sigma_X^2}\left(1-\frac1e\right)
$$
解得
$$
t_0=\frac1\alpha\left[1+\ln\frac{\sigma_X^2}{\sigma_X^2+\beta(1-e)}\right]
$$
它有意义要求右端指数式为正，即 $\beta<\dfrac{\sigma_X^2}{e-1}$（且 $\beta>-\sigma_X^2$ 保证 $R_X(0)>0$）；$\beta$ 超过该门限时 $\rho_1$ 的最低值就高于 $1/e$，方程无解。$\beta=0$ 时回代得 $t_0=1/\alpha$，与积分尺度的结果一致。用 $\rho_2$ 时 $e^{-\alpha t_0}=e^{-1}$ 直接给出 $t_0=1/\alpha$。

三种定义的结果汇总如下：

| 定义 | 归一化 $\rho_1=R_X/R_X(0)$ | 归一化 $\rho_2=C_X/C_X(0)$ |
| --- | --- | --- |
| 积分尺度 | $\beta=0$：$1/\alpha$；$\beta\ne0$：$+\infty$（不存在） | $1/\alpha$ |
| 首次过零 | $-\sigma_X^2<\beta<0$：$\dfrac1\alpha\ln\dfrac{\sigma_X^2}{-\beta}$；$\beta\ge0$：不存在 | 不存在（恒正） |
| $1/e$ 衰减 | $\beta<\dfrac{\sigma_X^2}{e-1}$：$\dfrac1\alpha\left[1+\ln\dfrac{\sigma_X^2}{\sigma_X^2+\beta(1-e)}\right]$；否则无解 | $1/\alpha$ |

**答**：若题目默认 $\beta=0$（纯指数相关），或采用协方差归一化 $\rho_X=C_X/C_X(0)=e^{-\alpha\lvert\tau\rvert}$，则三种定义一致给出 $t_0=1/\alpha$。若保留 $\beta$ 并按总功率归一化 $\rho_1=R_X/R_X(0)$，相关时间取决于所选定义：积分尺度为 $+\infty$（$\beta\ne0$）；首次过零只在 $\beta<0$ 时为 $\frac1\alpha\ln(\sigma_X^2/(-\beta))$；$1/e$ 衰减为 $\frac1\alpha\big[1+\ln(\sigma_X^2/(\sigma_X^2+\beta(1-e)))\big]$，且需 $\beta<\sigma_X^2/(e-1)$。所以**含 $\beta$ 时“相关时间”没有唯一答案**，答题必须写明归一化方式与定义。

> [!warning] 易错点
> 1. 直接写 $t_0=1/\alpha$ 而不交代 $\beta$ 的去向，是本题最典型的错误：$1/\alpha$ 只在 $\beta=0$ 或去均值归一化时成立。
> 2. $\beta$ 不是可以忽略的小量。它对应 $\tau\to\infty$ 处不衰减的相关平台，同时破坏积分尺度的收敛性与首次过零的存在性。
> 3. 严格地说 $\beta<0$ 时 $R_X$ 不满足非负定性：功率谱在 $\omega=0$ 处会带一个负的冲激，真实平稳过程不存在这种参数。表中 $\beta<0$ 一格只作形式讨论，用来说明首次过零定义对 $\beta$ 的敏感性。
> 4. 三种定义数值一般不同，与 §五 的警告一致；工程报告中比较不同信号的相关时间时，必须采用同一种归一化与同一种定义。

## 关联

- 上一节：[[vault-notes/random-signals/03-cyclostationary-processes]]（03 模块末篇）
- 下一节：[[vault-notes/random-signals/04-cross-correlation-covariance]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/math/probability/05-numerical-characteristics]]、[[vault-notes/dsp/01-discrete-time-systems]]
