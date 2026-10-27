---
title: "常用公式速查"
tags:
- 随机信号处理
- 99-附录
- 公式速查
aliases:
- 随机信号处理公式表
type: resource
subjects:
- 随机信号处理
domains:
- 知识管理
status: learning
prerequisites: []
related: []
---

# 🧮 常用公式速查

> [!abstract] 这页怎么用
> 这是一张“考前/工程现场”用的压缩表：每个公式都给出**成立条件**和**对应笔记**，不替代推导。
> 约定：双边功率谱、$\omega$ 为 rad/s、$j=\sqrt{-1}$；若用单边谱，表中会特别注明。

## 一、概率与随机变量

| 公式 | 说明 | 详见 |
| --- | --- | --- |
| $P(A\mid B)=\dfrac{P(AB)}{P(B)}$ | 条件概率，$P(B)>0$ | [[vault-notes/random-signals/01-conditional-probability-bayes]] |
| $P(B)=\sum_i P(B\mid A_i)P(A_i)$ | 全概率公式，$\{A_i\}$ 为完备事件组 | [[vault-notes/random-signals/01-probability-basics]] |
| $P(A_i\mid B)=\dfrac{P(B\mid A_i)P(A_i)}{\sum_j P(B\mid A_j)P(A_j)}$ | 贝叶斯公式 | [[vault-notes/random-signals/01-conditional-probability-bayes]] |
| $E[g(X)]=\int g(x)f_X(x)\,\mathrm{d}x$ | 函数期望，无需先求 $g(X)$ 的分布 | [[vault-notes/random-signals/02-expectation-variance]] |
| $\mathrm{Var}(X)=E[X^2]-(E[X])^2$ | 方差快捷公式 | [[vault-notes/random-signals/02-expectation-variance]] |
| $\mathrm{Cov}(X,Y)=E[XY]-E[X]E[Y]$ | 协方差 | [[vault-notes/random-signals/02-covariance-correlation]] |
| $\rho_{XY}=\dfrac{\mathrm{Cov}(X,Y)}{\sigma_X\sigma_Y}$ | 相关系数，只测线性相关 | [[vault-notes/random-signals/02-covariance-correlation]] |
| $E[X]=E[E[X\mid Y]]$ | 全期望公式 | [[vault-notes/random-signals/02-expectation-variance]] |
| $\mathrm{Var}(X)=E[\mathrm{Var}(X\mid Y)]+\mathrm{Var}(E[X\mid Y])$ | 全方差公式 | [[vault-notes/random-signals/02-expectation-variance]] |

## 二、常见分布

| 分布 | 均值 | 方差 | 备注 |
| --- | --- | --- | --- |
| 均匀 $U(a,b)$ | $\dfrac{a+b}{2}$ | $\dfrac{(b-a)^2}{12}$ | 区间内等可能 |
| 指数 $\mathrm{Exp}(\lambda)$ | $\dfrac1\lambda$ | $\dfrac1{\lambda^2}$ | 泊松到达间隔 |
| 高斯 $N(\mu,\sigma^2)$ | $\mu$ | $\sigma^2$ | 线性变换仍高斯 |
| 瑞利 $\mathrm{Rayleigh}(\sigma)$ | $\sigma\sqrt{\dfrac{\pi}{2}}$ | $\left(2-\dfrac{\pi}{2}\right)\sigma^2$ | 两路独立高斯包络 |
| 莱斯 $\mathrm{Rician}(K)$ | 无简单闭式 | 无简单闭式 | 直射 + 散射 |
| 卡方 $\chi^2(n)$ | $n$ | $2n$ | $n$ 个独立标准高斯平方和 |
| 学生 $t(\nu)$ | $0$（$\nu>1$） | $\dfrac{\nu}{\nu-2}$（$\nu>2$） | 小样本均值 |

> [!warning] 瑞利/莱斯的参数
> 瑞利的 $\sigma$ 是两路高斯分量的标准差，不是包络的标准差；莱斯的 $K$ 是直射功率与散射功率之比。做题先确认参数定义。

## 三、随机向量与高斯向量

| 公式 | 说明 | 详见 |
| --- | --- | --- |
| $\boldsymbol{\mu}=E[\mathbf{X}]$ | 均值向量 | [[vault-notes/random-signals/02-expectation-variance]] |
| $\mathbf{C}=E[(\mathbf{X}-\boldsymbol{\mu})(\mathbf{X}-\boldsymbol{\mu})^T]$ | 实随机向量协方差矩阵 | [[vault-notes/random-signals/02-covariance-correlation]] |
| $\mathbf{C}_{\mathbf{Y}}=\mathbf{A}\mathbf{C}_{\mathbf{X}}\mathbf{A}^T$ | 线性变换 $\mathbf{Y}=\mathbf{A}\mathbf{X}$ 的协方差 | [[vault-notes/random-signals/02-covariance-correlation]] |
| $f_{\mathbf{X}}(\mathbf{x})=\dfrac{1}{(2\pi)^{n/2}\lvert\mathbf{C}\rvert^{1/2}}e^{-\frac12(\mathbf{x}-\boldsymbol{\mu})^T\mathbf{C}^{-1}(\mathbf{x}-\boldsymbol{\mu})}$ | 实高斯向量密度 | [[vault-notes/random-signals/02-gaussian-random-vectors]] |
| $\mathbf{C}_{\mathbf{X}\mid\mathbf{Y}}=\mathbf{C}_{\mathbf{X}}-\mathbf{C}_{\mathbf{XY}}\mathbf{C}_{\mathbf{Y}}^{-1}\mathbf{C}_{\mathbf{YX}}$ | 条件高斯协方差 | [[vault-notes/random-signals/02-gaussian-random-vectors]] |
| $E[\mathbf{X}\mid\mathbf{Y}]=\boldsymbol{\mu}_{\mathbf{X}}+\mathbf{C}_{\mathbf{XY}}\mathbf{C}_{\mathbf{Y}}^{-1}(\mathbf{Y}-\boldsymbol{\mu}_{\mathbf{Y}})$ | 条件高斯均值（=LMMSE） | [[vault-notes/random-signals/07-mmse-lmmse]] |

## 四、随机过程与相关函数

| 公式 | 说明 | 详见 |
| --- | --- | --- |
| $\mu_X(t)=E[X(t)]$ | 均值函数 | [[vault-notes/random-signals/03-mean-and-correlation-functions]] |
| $R_X(t_1,t_2)=E[X(t_1)X^*(t_2)]$ | 自相关函数 | [[vault-notes/random-signals/04-autocorrelation-autocovariance]] |
| $C_X(t_1,t_2)=R_X(t_1,t_2)-\mu_X(t_1)\mu_X^*(t_2)$ | 自协方差 | [[vault-notes/random-signals/04-autocorrelation-autocovariance]] |
| $R_X(\tau)=E[X(t+\tau)X^*(t)]$ | WSS 自相关 | [[vault-notes/random-signals/03-strict-vs-wide-sense-stationary]] |
| $R_X(0)=E[\lvert X(t)\rvert^2]$ | 平均功率 | [[vault-notes/random-signals/04-autocorrelation-autocovariance]] |
| $R_X(-\tau)=R_X^*(\tau)$ | 共轭对称 | [[vault-notes/random-signals/04-correlation-properties]] |
| $\lvert R_X(\tau)\rvert\le R_X(0)$ | 相关函数上界 | [[vault-notes/random-signals/04-correlation-properties]] |
| $R_X(\tau)=\dfrac{N_0}{2}\delta(\tau)$ | 连续白噪声自相关 | [[vault-notes/random-signals/03-gaussian-process-white-noise]] |
| $R_X[m]=\sigma^2\delta[m]$ | 离散白噪声自相关 | [[vault-notes/random-signals/03-gaussian-process-white-noise]] |

## 五、功率谱与 LTI 系统

| 公式 | 说明 | 详见 |
| --- | --- | --- |
| $S_X(\omega)=\int_{-\infty}^{\infty}R_X(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau$ | 维纳-辛钦（双边） | [[vault-notes/random-signals/05-wiener-khinchin]] |
| $R_X(0)=\dfrac{1}{2\pi}\int_{-\infty}^{\infty}S_X(\omega)\,\mathrm{d}\omega$ | 总功率 | [[vault-notes/random-signals/05-power-spectral-density]] |
| $S_{XY}(\omega)=H(\omega)S_X(\omega)$ | 输入输出互谱 | [[vault-notes/random-signals/06-input-output-psd-relation]] |
| $S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega)$ | 输出自谱 | [[vault-notes/random-signals/06-input-output-psd-relation]] |
| $P_Y=\dfrac{1}{2\pi}\int_{-\infty}^{\infty}\lvert H(\omega)\rvert^2S_X(\omega)\,\mathrm{d}\omega$ | 输出平均功率 | [[vault-notes/random-signals/06-filtering-noise-power]] |
| $B_n=\dfrac{1}{\lvert H(0)\rvert^2}\int_0^\infty\lvert H(f)\rvert^2\,\mathrm{d}f$ | 单边噪声等效带宽 | [[vault-notes/random-signals/06-filtering-noise-power]] |
| $S_X^+(f)=2S_X(2\pi f)$ | 实过程单边谱（$f\ge0$） | [[vault-notes/random-signals/05-power-spectral-density]] |

## 六、估计与滤波

| 公式 | 说明 | 详见 |
| --- | --- | --- |
| $\mathrm{bias}(\hat{\theta})=E[\hat{\theta}]-\theta$ | 偏差 | [[vault-notes/random-signals/07-estimator-bias-variance]] |
| $\mathrm{MSE}(\hat{\theta})=\mathrm{Var}(\hat{\theta})+\mathrm{bias}^2(\hat{\theta})$ | 均方误差分解 | [[vault-notes/random-signals/07-estimator-bias-variance]] |
| $\mathrm{Var}(\hat{\theta})\ge\dfrac{1}{I(\theta)}$ | CRLB | [[vault-notes/random-signals/07-estimator-bias-variance]] |
| $\hat{\theta}_{ML}=\arg\max_\theta \ln f(x;\theta)$ | 最大似然 | [[vault-notes/random-signals/07-maximum-likelihood-least-squares]] |
| $\hat{\theta}_{LS}=\arg\min_\theta\lVert\mathbf{y}-\mathbf{H}\theta\rVert^2$ | 最小二乘 | [[vault-notes/random-signals/07-maximum-likelihood-least-squares]] |
| $\hat{X}_{MMSE}=E[X\mid Y]$ | MMSE 估计 | [[vault-notes/random-signals/07-mmse-lmmse]] |
| $\hat{X}_{LMMSE}=\mu_X+\mathbf{C}_{XY}\mathbf{C}_{YY}^{-1}(\mathbf{Y}-\mu_Y)$ | LMMSE | [[vault-notes/random-signals/07-mmse-lmmse]] |
| $R_{XY}(\tau)=h(\tau)*R_X(\tau)$ | Wiener-Hopf（连续） | [[vault-notes/random-signals/07-wiener-filter]] |
| $H(\omega)=\dfrac{S_{XY}(\omega)}{S_X(\omega)}$ | 非因果 Wiener 频域解 | [[vault-notes/random-signals/07-wiener-filter]] |

## 七、检测与通信

| 公式 | 说明 | 详见 |
| --- | --- | --- |
| $\Lambda(x)=\dfrac{f(x\mid H_1)}{f(x\mid H_0)}\gtrless\eta$ | 似然比检验 | [[vault-notes/random-signals/08-likelihood-ratio-test]] |
| $P_{fa}=\int_{\eta}^{\infty}f(\Lambda\mid H_0)\,\mathrm{d}\Lambda$ | 虚警概率 | [[vault-notes/random-signals/08-neyman-pearson]] |
| $P_d=\int_{\eta}^{\infty}f(\Lambda\mid H_1)\,\mathrm{d}\Lambda$ | 检测概率 | [[vault-notes/random-signals/08-neyman-pearson]] |
| $Q(x)=\dfrac{1}{\sqrt{2\pi}}\int_x^\infty e^{-t^2/2}\,\mathrm{d}t$ | 高斯尾概率 | [[vault-notes/random-signals/08-roc-curve]] |
| $\mathrm{SNR}_{MF}=\dfrac{2E}{N_0}$ | 匹配滤波输出峰值 SNR | [[vault-notes/random-signals/08-matched-filter-detection]] |
| $P_b=Q\!\left(\sqrt{\dfrac{2E_b}{N_0}}\right)$ | BPSK/QPSK 相干检测 BER | [[vault-notes/random-signals/10-bpsk-qam-ber]] |
| $P_b\approx\dfrac{4}{k}\left(1-\dfrac{1}{\sqrt M}\right)Q\!\left(\sqrt{\dfrac{3k}{M-1}\dfrac{E_b}{N_0}}\right)$ | Gray 编码方形 $M$-QAM 近似，$k=\log_2M$ | [[vault-notes/random-signals/10-bpsk-qam-ber]] |
| $\mathrm{SNR}=\dfrac{E_b}{N_0}\cdot\dfrac{R_b}{B}$ | 信噪比与 $E_b/N_0$ | [[vault-notes/random-signals/10-snr-noise-bandwidth]] |
| $\mathrm{SQNR}\approx6.02n+1.76\ \mathrm{dB}$ | $n$ 位均匀量化满幅正弦 | [[vault-notes/random-signals/10-adc-sampling-quantization-noise]] |

## 关联

- 导航：[[vault-notes/random-signals/00-knowledge-map]]｜[[vault-notes/random-signals/00-course-index]]｜[[vault-notes/random-signals/00-math-symbols]]
- 易混：[[vault-notes/random-signals/99-easily-confused-concepts]]
- 错题：[[vault-notes/random-signals/99-mistakes-and-questions]]
- 全库总纲：00_全库理论知识点综合与联系
