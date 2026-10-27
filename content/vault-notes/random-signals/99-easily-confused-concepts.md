---
title: "易混淆概念"
tags:
- 随机信号处理
- 99-附录
- 易混概念
aliases:
- 易混概念对照
type: resource
subjects:
- 随机信号处理
domains:
- 知识管理
status: learning
prerequisites: []
related: []
---

# ⚠️ 易混淆概念

> [!abstract] 这页怎么用
> 随机信号处理的大多数错误不是“不会算”，而是**把两个相邻概念当成一回事**。
> 下表每行给出：区别、反例/提醒、对应笔记。复习时先遮住“区别”一列，自己说一遍。

## 一、概率与随机变量

| 概念对 | 区别 | 反例/提醒 |
| --- | --- | --- |
| 独立 vs 不相关 | 独立是联合分布可分解；不相关只是协方差为 0 | 不相关 ⇏ 独立；反例：$X\sim U\{-1,0,1\}$，$Y=X^2$，$\mathrm{Cov}(X,Y)=0$ 但显然不独立。高斯情形下二者等价。详见 [[vault-notes/random-signals/02-covariance-correlation]] |
| 概率 vs 似然 | 概率是给定参数看数据；似然是给定数据看参数 | 似然函数不是参数的概率密度，不能对 $\theta$ 积分为 1。详见 [[vault-notes/random-signals/07-maximum-likelihood-least-squares]] |
| PDF vs PMF | 连续型用密度，离散型用概率质量 | 密度值可以大于 1；概率必须 ≤1。详见 [[vault-notes/random-signals/01-random-variables-distributions]] |
| 条件期望 vs 条件概率 | 条件期望是随机变量 $E[X\mid Y]$；条件概率是数 | $E[X\mid Y]$ 仍是 $Y$ 的函数。详见 [[vault-notes/random-signals/01-conditional-probability-bayes]] |

## 二、随机过程与平稳性

| 概念对 | 区别 | 反例/提醒 |
| --- | --- | --- |
| 严平稳 vs 宽平稳 | 严平稳要求所有有限维分布平移不变；宽平稳只要求均值恒定、自相关只与滞后有关 | WSS 不一定是严平稳；高斯过程若 WSS，则也是严平稳。详见 [[vault-notes/random-signals/03-strict-vs-wide-sense-stationary]] |
| 平稳 vs 各态历经 | 平稳是“集合统计不随时间变”；各态历经是“时间平均能代替集合平均” | 平稳不一定各态历经；反例：$X(t)=A$，$A$ 为随机常数。详见 [[vault-notes/random-signals/03-ergodicity]] |
| 自相关 vs 自协方差 | 自相关含均值；自协方差已去均值 | 零均值时二者相同；非零均值时 $C_X(\tau)=R_X(\tau)-\lvert\mu_X\rvert^2$。详见 [[vault-notes/random-signals/04-autocorrelation-autocovariance]] |
| 相关函数 vs 相关系数 | 相关函数是随 $\tau$ 变化的函数；相关系数是归一化到 $[-1,1]$ 的数 | 不要用“相关系数”称呼 $R_X(\tau)$。详见 [[vault-notes/random-signals/04-correlation-properties]] |

## 三、频域与系统

| 概念对 | 区别 | 反例/提醒 |
| --- | --- | --- |
| 单边谱 vs 双边谱 | 双边谱在 $\pm f$ 都有定义；实过程单边谱把负频率功率折到正频率，因子 2 | 混用时总功率会差 2 倍；写题先声明。详见 [[vault-notes/random-signals/05-power-spectral-density]] |
| 能量信号 vs 功率信号 | 能量信号能量有限、平均功率为 0；功率信号能量无限、平均功率有限 | WSS 随机过程通常是功率信号，不能直接做能量谱。详见 [[vault-notes/random-signals/05-power-spectral-density]] |
| 白噪声 vs 高斯噪声 | 白噪声是功率谱平坦（二阶性质）；高斯噪声是幅度服从高斯分布 | 白噪声可以非高斯；高斯噪声可以是有色。白高斯噪声两者都满足。详见 [[vault-notes/random-signals/05-white-colored-noise-spectra]] |
| 相关 vs 卷积 | 相关不翻转（或翻转后共轭）；卷积要翻转 | 对偶信号二者相同，容易误判；相关衡量相似度，卷积描述系统输出。详见 [[vault-notes/random-signals/04-cross-correlation-covariance]] |
| 噪声带宽 vs 3dB 带宽 | 噪声带宽按 $\lvert H\rvert^2$ 积分定义；3dB 带宽是半功率点宽度 | 非理想滤波器两者不相等；噪声功率计算用噪声带宽。详见 [[vault-notes/random-signals/06-filtering-noise-power]] |

## 四、估计与检测

| 概念对 | 区别 | 反例/提醒 |
| --- | --- | --- |
| MSE vs 方差 | $\mathrm{MSE}=\mathrm{Var}+\mathrm{bias}^2$ | 无偏估计的 MSE 才等于方差；有偏估计可能 MSE 更小。详见 [[vault-notes/random-signals/07-estimator-bias-variance]] |
| MMSE vs LMMSE | MMSE 是条件均值，允许非线性；LMMSE 只允许仿射 | 非高斯时二者不同；联合高斯时相等。详见 [[vault-notes/random-signals/07-mmse-lmmse]] |
| 检测 vs 估计 | 检测在离散假设中选一个；估计在连续参数空间取值 | 检测关心 $P_{fa}/P_d$；估计关心偏差/方差/MSE。详见 [[vault-notes/random-signals/08-hypothesis-testing]] |
| 匹配滤波 vs Wiener 滤波 | 匹配滤波最大化已知信号的输出 SNR；Wiener 最小化随机信号的 MSE | 目标不同，不能互相替代。详见 [[vault-notes/random-signals/08-matched-filter-detection]]、[[vault-notes/random-signals/07-wiener-filter]] |
| SNR vs $E_b/N_0$ | SNR 是带内功率比；$E_b/N_0$ 是每比特能量与噪声谱密度之比 | 关系 $\mathrm{SNR}=(E_b/N_0)(R_b/B)$；带宽变了 SNR 变，$E_b/N_0$ 不变。详见 [[vault-notes/random-signals/10-snr-noise-bandwidth]] |

## 五、模型与自适应

| 概念对 | 区别 | 反例/提醒 |
| --- | --- | --- |
| AR vs MA | AR 是全极点、有反馈；MA 是全零点、无反馈 | AR 的稳定性看极点；MA 永远稳定（FIR）。详见 [[vault-notes/random-signals/09-ar-ma-arma-modeling]] |
| LMS vs RLS | LMS 是随机梯度，$O(N)$；RLS 是最小二乘递推，$O(N^2)$ | RLS 收敛快但计算贵；LMS 简单但受特征值扩散影响。详见 [[vault-notes/random-signals/09-adaptive-filter-lms]]、[[vault-notes/random-signals/09-adaptive-filter-rls]] |
| 参数化谱估计 vs 周期图 | 参数化假设模型（AR/MA/ARMA），分辨率可高于傅里叶限；周期图是非参数方法 | 模型失配时参数化谱会“漂亮但错”。详见 [[vault-notes/random-signals/09-parametric-spectral-estimation]] |

## 六、复习方法

1. 每遇到一个“等于”，问自己：**条件是什么？**
2. 每遇到一个“不相关”，问自己：**是线性不相关，还是独立？**
3. 每遇到一个功率谱，问自己：**单边还是双边？**
4. 每遇到一个估计量，问自己：**偏差、方差还是 MSE？**
5. 每遇到一个检测器，问自己：**虚警率约束是什么？**

## 关联

- 导航：[[vault-notes/random-signals/00-knowledge-map]]｜[[vault-notes/random-signals/00-math-symbols]]
- 速查：[[vault-notes/random-signals/99-formula-cheatsheet]]
- 错题：[[vault-notes/random-signals/99-mistakes-and-questions]]
- 全库总纲：00_全库理论知识点综合与联系
