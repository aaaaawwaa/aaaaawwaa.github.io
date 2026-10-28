---
title: 随机信号公式速查与易错点
description: 随机信号处理的一页式公式表：概率与随机变量、分布、随机过程、功率谱、估计、滤波、检测与通信，附易混淆概念对照与错因清单。
tags:
  - signal-processing
  - random-processes
  - reference
---

这是一张“考前与工程现场”用的压缩表：每个公式都尽量给出**成立条件**，不替代推导。完整推导见各主题文章与 [[vault-notes/random-signals/99-formula-cheatsheet|源笔记公式速查]]。

**全书约定**：双边功率谱；$\omega$ 为 rad/s，$f$ 为 Hz，$\omega=2\pi f$；$j=\sqrt{-1}$；$N_0$ 为**单边**噪声谱密度，双边为 $N_0/2$；复过程自相关按 $E[X(t+\tau)X^*(t)]$ 定义。

## 符号与单双边约定

| 量 | 记号 | 单位 | 说明 |
| --- | --- | --- | --- |
| 双边 PSD | $S_X(\omega)$ | 功率/(rad/s) | 默认口径，负频率也画 |
| 双边 PSD（按 $f$） | $S_X(f)$ | 功率/Hz | $S_X(f)=S_X(2\pi f)/(2\pi)$ |
| 单边 PSD（实过程） | $S_X^+(f)=2S_X(f)$ | 功率/Hz | 只画 $f\ge0$，总功率积分不乘 2 |
| 白噪声双边谱 | $N_0/2$ | 功率/Hz | 单边谱为 $N_0$ |
| 平均功率 | $R_X(0)$ | 功率 | 双边积分 $\frac{1}{2\pi}\int S_X\mathrm{d}\omega$ |
| 匹配滤波峰值 SNR | $2E/N_0$ | — | 只在 $N_0$ 为单边谱时成立 |

> [!warning] 最常见的 3 dB 来源
> 单边/双边混用、把 $N_0$ 当双边谱、把 $E_b/N_0$ 当 SNR。写答案前先声明口径。

## 概率与随机变量

| 公式 | 条件与说明 |
| --- | --- |
| $P(A\mid B)=P(AB)/P(B)$ | $P(B)>0$ |
| $P(B)=\sum_iP(B\mid A_i)P(A_i)$ | $\lbrace A_i\rbrace$ 为完备事件组 |
| $P(A_i\mid B)=\dfrac{P(B\mid A_i)P(A_i)}{\sum_jP(B\mid A_j)P(A_j)}$ | 先验 × 似然 ÷ 证据 |
| $E[g(X)]=\int g(x)f_X(x)\,\mathrm{d}x$ | 无需先求 $g(X)$ 的分布 |
| $E[XY]=E[X]E[Y]+\mathrm{Cov}(X,Y)$ | 独立或不相关时交叉项为零 |
| $\mathrm{Var}(X)=E[X^2]-(E[X])^2$ | 避免先算中心矩 |
| $\mathrm{Cov}(X,Y)=E[XY]-E[X]E[Y]$ | 双线性 |
| $\rho_{XY}=\dfrac{\mathrm{Cov}(X,Y)}{\sigma_X\sigma_Y}\in[-1,1]$ | 只测线性相关 |
| $E[X]=E\big[E[X\mid Y]\big]$ | 全期望公式 |
| $\mathrm{Var}(X)=E[\mathrm{Var}(X\mid Y)]+\mathrm{Var}(E[X\mid Y])$ | 组内 + 组间 |

**独立与不相关**：独立 $\Rightarrow$ 不相关；不相关 $\nRightarrow$ 独立（反例 $Y=X^2$、$X\sim U(-1,1)$）；联合高斯时二者等价。

## 常见分布

| 分布 | 均值 | 方差 | 典型来源 |
| --- | --- | --- | --- |
| 均匀 $U(a,b)$ | $(a+b)/2$ | $(b-a)^2/12$ | 量化误差、随机相位 |
| 指数 $\mathrm{Exp}(\lambda)$ | $1/\lambda$ | $1/\lambda^2$ | 泊松到达间隔、衰落功率 |
| 高斯 $N(\mu,\sigma^2)$ | $\mu$ | $\sigma^2$ | 热噪声、AWGN |
| 瑞利 $\mathrm{Rayleigh}(\sigma)$ | $\sigma\sqrt{\pi/2}$ | $(2-\pi/2)\sigma^2$ | 无直射径包络 |
| 卡方 $\chi^2(n)$ | $n$ | $2n$ | $n$ 个标准高斯平方和 |
| 学生 $t(\nu)$ | $0$（$\nu>1$） | $\nu/(\nu-2)$（$\nu>2$） | 小样本均值 |

瑞利的 $\sigma$ 是两路高斯分量的标准差，不是包络标准差；莱斯因子 $K=\nu^2/(2\sigma^2)$ 是直射功率与散射功率之比。

## 高斯向量与条件高斯

设 $\mathbf{X}\sim N(\boldsymbol{\mu},\mathbf{\Sigma})$，$\mathbf{Y}=\mathbf{A}\mathbf{X}+\mathbf{b}$：

$$
\mathbf{Y}\sim N\big(\mathbf{A}\boldsymbol{\mu}+\mathbf{b},\ \mathbf{A}\mathbf{\Sigma}\mathbf{A}^T\big)
$$

分块 $\mathbf{X}=[\mathbf{X}_1;\mathbf{X}_2]$，给定 $\mathbf{X}_2=\mathbf{x}_2$：

$$
E[\mathbf{X}_1\mid\mathbf{X}_2]=\boldsymbol{\mu}_1+\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{x}_2-\boldsymbol{\mu}_2)
$$

$$
\mathrm{Cov}(\mathbf{X}_1\mid\mathbf{X}_2)=\mathbf{\Sigma}_{11}-\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\ \preceq\ \mathbf{\Sigma}_{11}
$$

- 条件均值是观测的**仿射函数**，斜率即 LMMSE 系数；条件协方差与观测值无关（卡尔曼增益可离线算）。
- 高斯下“不相关 = 独立”；“边缘高斯”推不出“联合高斯”。
- 复随机变量方差为 $E[\lvert Z-\mu\rvert^2]$，proper 复高斯满足 $E[(Z-\mu)^2]=0$；$I,Q\sim N(0,\sigma^2)$ 时 $E[\lvert Z\rvert^2]=2\sigma^2$。

## 随机过程与相关函数

| 公式 | 条件与说明 |
| --- | --- |
| $\mu_X(t)=E[X(t)]$ | 集合平均，$t$ 的确定函数 |
| $R_X(t_1,t_2)=E[X(t_1)X^*(t_2)]$ | 非平稳时依赖两个绝对时刻 |
| $C_X(t_1,t_2)=R_X-\mu_X(t_1)\mu_X^*(t_2)$ | 去均值 |
| $R_X(\tau)=E[X(t+\tau)X^*(t)]$ | 宽平稳（WSS）定义 |
| $R_X(0)=E[\lvert X(t)\rvert^2]$ | 平均功率 |
| $R_X(-\tau)=R_X^*(\tau)$ | 共轭对称；实过程为偶函数 |
| $\lvert R_X(\tau)\rvert\le R_X(0)$ | 柯西–施瓦茨；非负定的推论 |
| $R_X(\tau)=\frac{N_0}{2}\delta(\tau)$ | 连续白噪声 |
| $R_X[m]=\sigma^2\delta[m]$ | 离散白噪声 |
| $R_X[m]=\frac{\sigma_w^2}{1-a^2}a^{\lvert m\rvert}$ | AR(1) 输出 |
| $\tau_c=\int_0^\infty\lvert\rho_X(\tau)\rvert\,\mathrm{d}\tau$ | 相关时间（积分尺度） |

**WSS 三条件**：二阶矩有限、均值为常数、$R_X(t_1,t_2)$ 只依赖 $t_1-t_2$。严平稳 + 二阶矩有限 $\Rightarrow$ WSS，反之不成立（高斯过程例外）。

**各态历经**：$C_X(\tau)\to0$ 或 $\frac{1}{T}\int_0^TC_X\mathrm{d}\tau\to0$ 是均值遍历的充分条件；相关遍历需四阶矩，零均值实高斯下 $\int\lvert R_X\rvert^2\mathrm{d}u<\infty$ 充分。

## 功率谱与 LTI 系统

| 公式 | 条件与说明 |
| --- | --- |
| $S_X(\omega)=\int R_X(\tau)e^{-j\omega\tau}\mathrm{d}\tau$ | 维纳–辛钦，$R_X$ 绝对可积或按广义函数 |
| $R_X(0)=\frac{1}{2\pi}\int S_X(\omega)\mathrm{d}\omega$ | 总功率 |
| $S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega)$ | 输入 WSS + 系统稳定 LTI |
| $S_{XY}(\omega)=H(\omega)S_X(\omega)$ | 互谱，$Y=X*h$ |
| $S_{YX}(\omega)=H^*(\omega)S_X(\omega)$ | 注意前后顺序 |
| $P_Y=\frac{1}{2\pi}\int\lvert H\rvert^2S_X\mathrm{d}\omega$ | 输出平均功率 |
| $B_n=\frac{1}{\lvert H(0)\rvert^2}\int_0^\infty\lvert H(f)\rvert^2\mathrm{d}f$ | 噪声等效带宽，仅白噪声输入 |
| $\gamma_{XY}^2=\frac{\lvert S_{XY}\rvert^2}{S_XS_Y}\in[0,1]$ | 相干函数只测线性关系 |

**周期图**：$\hat S_p(\omega)=\frac{1}{N}\lvert\sum_{n=0}^{N-1}x[n]e^{-j\omega n}\rvert^2$，渐近无偏但方差 $\approx S_X^2$，**非一致估计**。Welch 分段平均把方差降到约 $1/K$，分辨率降到约 $f_s/L$。补零只插值、不提高分辨率。

**白噪声通过系统**：输出功率 $=\sigma^2\sum_n\lvert h[n]\rvert^2=N_0B_n\lvert H(0)\rvert^2$。理想白噪声功率发散，限带后才是 $N_0B$。

## 估计与滤波

| 公式 | 条件与说明 |
| --- | --- |
| $\mathrm{MSE}(\hat\theta)=\mathrm{Var}(\hat\theta)+\mathrm{bias}^2(\hat\theta)$ | 无偏估计的 MSE 等于方差 |
| $\mathrm{Var}(\hat\theta)\ge1/I(\theta)$ | CRLB，正则分布族 |
| $\hat\theta_{ML}=\arg\max_\theta\ln f(\mathbf{x};\theta)$ | 得分方程为零 |
| $\hat\theta_{LS}=(\mathbf{H}^T\mathbf{H})^{-1}\mathbf{H}^T\mathbf{y}$ | 高斯白噪声下等于 MLE |
| $\hat X_{MMSE}=E[X\mid Y]$ | 后验均值；最小 MSE $=E[\mathrm{Var}(X\mid Y)]$ |
| $\hat X_{LMMSE}=\mu_X+\mathbf{C}_{XY}\mathbf{C}_{YY}^{-1}(\mathbf{Y}-\mu_Y)$ | 仿射类最优；高斯时等于 MMSE |
| $R_{XY}(\tau)=h(\tau)*R_X(\tau)$ | Wiener–Hopf（连续） |
| $H(\omega)=\frac{S_{XY}}{S_X}=\frac{S_{ss}}{S_{ss}+S_{ww}}$ | 非因果维纳解（信号与噪声独立） |
| $K_k=P^-H^T(HP^-H^T+R)^{-1}$ | 卡尔曼增益；$P^-=FPF^T+Q$ |
| $\mathbf{w}[n+1]=\mathbf{w}[n]+\mu e[n]\mathbf{x}[n]$ | LMS；$0<\mu<2/\lambda_{\max}$ |
| $\mathbf{k}[n]=\dfrac{\mathbf{P}[n-1]\mathbf{x}[n]}{\lambda+\mathbf{x}^T\mathbf{P}[n-1]\mathbf{x}[n]}$ | RLS 增益；$\lambda$ 为遗忘因子 |
| $\hat S_{AR}(\omega)=\dfrac{\hat\sigma^2}{\lvert 1+\sum\hat a_ke^{-j\omega k}\rvert^2}$ | AR 谱；稳定要求极点在单位圆内 |
| $S_X(\omega)=\sigma^2\dfrac{\lvert B(e^{j\omega})\rvert^2}{\lvert A(e^{j\omega})\rvert^2}$ | ARMA 模型谱 |

**正交性原理**：最优线性估计的误差与观测正交，$E[(X-\hat X)Y^*]=0$。维纳–Hopf、LMMSE、卡尔曼更新都是它的不同写法。

## 检测与通信

| 公式 | 条件与说明 |
| --- | --- |
| $\Lambda(\mathbf{x})=\dfrac{f(\mathbf{x}\mid H_1)}{f(\mathbf{x}\mid H_0)}\gtrless\eta$ | 似然比检验 |
| $\eta=\dfrac{\pi_0(C_{10}-C_{00})}{\pi_1(C_{01}-C_{11})}$ | Bayes 门限 |
| $P_{fa}=\int_{\mathcal{R}_1}f_0\mathrm{d}\mathbf{x}$，$P_d=\int_{\mathcal{R}_1}f_1\mathrm{d}\mathbf{x}$ | NP 约束 $P_{fa}=\alpha$ 反解门限 |
| $P_d=Q\big(Q^{-1}(P_{fa})-d\big)$ | 高斯偏移 ROC，$d=\mu/\sigma$ |
| $\mathrm{AUC}=\Phi(d/\sqrt2)$ | 高斯偏移情形 |
| $\mathrm{SNR}_{MF}=2E/N_0$ | 匹配滤波峰值 SNR（$N_0$ 单边） |
| $P_b=Q\left(\sqrt{2E_b/N_0}\right)$ | BPSK 与 Gray-QPSK |
| $P_b\approx\frac{4}{k}\left(1-\frac{1}{\sqrt M}\right)Q\left(\sqrt{\frac{3k}{M-1}\frac{E_b}{N_0}}\right)$ | 方形 $M$-QAM，$k=\log_2M$ |
| $\mathrm{SNR}=\frac{E_b}{N_0}\cdot\frac{R_b}{B}$ | 带内 SNR 与 $E_b/N_0$ |
| $P_n=N_0B$ | 带宽 $B$ 内噪声功率 |
| $\sigma_q^2=\Delta^2/12$ | 均匀量化误差，$\Delta=2A/2^n$ |
| $\mathrm{SQNR}\approx6.02n+1.76\ \mathrm{dB}$ | 满量程正弦、理想量化 |
| $\mathrm{SQNR}\approx6.02n+1.76+10\log_{10}\mathrm{OSR}$ | 过采样，白量化噪声 |

## 易混淆概念对照

| 概念对 | 区别 | 一句话提醒 |
| --- | --- | --- |
| 独立 vs 不相关 | 联合分布可分解 vs 协方差为零 | 只有联合高斯时等价 |
| 严平稳 vs 宽平稳 | 全部有限维分布 vs 一、二阶矩 | WSS 不必严平稳 |
| 平稳 vs 各态历经 | 统计不随时间变 vs 时间平均可代替集合平均 | 随机常数平稳但不遍历 |
| 自相关 vs 自协方差 | 含均值 vs 去均值 | 零均值时相同 |
| 相关函数 vs 相关系数 | 随 $\tau$ 的函数 vs 归一化到 $[-1,1]$ 的数 | $R_X(\tau)$ 不是相关系数 |
| 单边谱 vs 双边谱 | 负频率功率是否折到正频率 | 差 2 倍，先声明 |
| 白噪声 vs 高斯噪声 | 二阶谱平坦 vs 幅度高斯 | 白可以非高斯，高斯可以有色 |
| 相关 vs 卷积 | 不翻转（或共轭翻转） vs 翻转 | 相关测相似，卷积描述系统 |
| 噪声带宽 vs 3 dB 带宽 | 按 $\lvert H\rvert^2$ 积分 vs 半功率点 | 一阶 RC 差 $\pi/2$ |
| MSE vs 方差 | 含偏差平方 vs 只含波动 | 有偏估计可能 MSE 更小 |
| MMSE vs LMMSE | 任意函数 vs 仿射函数 | 非高斯时不同 |
| 匹配滤波 vs 维纳滤波 | 最大化抽样 SNR vs 最小化波形 MSE | 目标不同，不能互换 |
| 检测 vs 估计 | 离散假设选择 vs 连续参数取值 | 看 $P_{fa}/P_d$ 还是偏差/方差 |
| SNR vs $E_b/N_0$ | 带内功率比 vs 每比特能量比 | 差 $10\log_{10}(B/R_b)$ |
| AR vs MA | 全极点、有反馈 vs 全零点、永远稳定 | 稳定性只看 AR 极点 |
| LMS vs RLS | 随机梯度 $O(N)$ vs 最小二乘递推 $O(N^2)$ | 快与省不可兼得 |

## 高频错因清单

| 错因 | 典型表现 | 对策 |
| --- | --- | --- |
| 定义不清 | 独立/不相关、平稳/遍历混用 | 每对概念写一个反例 |
| 条件漏看 | 忘零均值、实/复、单/双边、白噪声 | 做题前列出三个前提 |
| 公式记错 | MSE 写成方差、匹配滤波漏 2、$Q$ 函数系数错 | 用本页做公式默写 |
| 单位与归一化 | PSD 差 $2\pi$、DFT 差 $N$、dB 与线性混用 | 用总功率或 Parseval 校验 |
| 计算失误 | 积分限、共轭、矩阵转置与乘序 | 写中间步骤，最后量纲检查 |

> [!tip] 复习五问
> 遇到“等于”问条件；遇到“不相关”问是否独立；遇到功率谱问单边/双边；遇到估计量问偏差、方差还是 MSE；遇到检测器问虚警约束。

## 前置与下一步

- **前置**：[[signal-processing/random-processes|随机过程与随机信号]]、[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]、[[mathematics/probability-overview|概率论概览]]。
- **配套**：[[signal-processing/random-signals-through-systems|随机信号通过线性系统]]、[[signal-processing/statistical-estimation-filtering|统计估计与最优滤波]]、[[signal-processing/adaptive-filtering-and-spectral-estimation|自适应滤波与参数化谱估计]]、[[signal-processing/signal-detection-theory|信号检测理论]]、[[signal-processing/random-signal-experiments|MATLAB 实验]]。
- **下一步**：[[communication/index|通信原理]] 与 [[signal-processing/dft-and-fft|DFT 与 FFT]]。

## 来源与延伸阅读

- 公式与易错点：[[vault-notes/random-signals/99-formula-cheatsheet|常用公式速查]]、[[vault-notes/random-signals/99-easily-confused-concepts|易混淆概念]]、[[vault-notes/random-signals/99-mistakes-and-questions|错题与问题记录]]、[[vault-notes/random-signals/00-math-symbols|数学符号约定]]。
- 分模块详细推导见 [[vault-notes/random-signals/00-knowledge-map|知识地图]] 中列出的 01–11 各篇笔记。
