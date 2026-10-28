---
title: 随机信号、估计与检测
description: 从随机变量到随机过程，用相关函数和功率谱分析噪声，再进入估计、滤波与检测。
tags: [signal-processing, random-processes]
---

随机信号处理把确定的波形换成一族可能的实现。分析对象从某一次取值，转向均值、相关函数与功率谱等统计量；这些统计量随后决定如何估计信号、抑制噪声和作出检测判决。

## 怎样组织这些知识

1. **概率与向量准备**：从随机变量、联合分布、条件概率开始，理解复随机向量和高斯模型。
2. **随机过程与相关**：区分集合统计与时间平均，再研究平稳性、自相关和互相关。
3. **功率谱与线性系统**：用维纳–辛钦关系联系相关函数与功率谱；线性滤波器通过幅频响应改变噪声功率分布。
4. **估计与滤波**：偏差、方差和均方误差给出评价标准，最小二乘、MMSE、维纳与卡尔曼方法对应不同假设。
5. **检测与验证**：通过假设检验、似然比和 ROC 理解漏检与虚警，再用 MATLAB 实验检查理论。

这些内容与 [[mathematics/index|概率论及线性代数]]、[[signal-processing/index|离散系统与频域分析]]、[[communication/index|通信接收与信道噪声]]相连。

<!-- topic-index:start -->
## 随机信号、估计与检测

### 随机信号处理

- [[vault-notes/random-signals/00-course-index|课程与教材索引]]
- [[vault-notes/random-signals/00-math-symbols|数学符号约定]]
- [[vault-notes/random-signals/00-knowledge-map|知识地图]]
- [[vault-notes/random-signals/01-fourier-and-lti|傅里叶变换与线性系统]]
- [[vault-notes/random-signals/01-probability-basics|概率论基础]]
- [[vault-notes/random-signals/01-random-variables-distributions|随机变量与概率分布]]
- [[vault-notes/random-signals/01-conditional-probability-bayes|条件概率与贝叶斯公式]]
- [[vault-notes/random-signals/01-linear-algebra-matrices|线性代数与矩阵运算]]
- [[vault-notes/random-signals/02-complex-random-variables|复随机变量]]
- [[vault-notes/random-signals/02-gaussian-random-vectors|高斯随机变量与高斯向量]]
- [[vault-notes/random-signals/02-joint-conditional-distributions|联合分布与条件分布]]
- [[vault-notes/random-signals/02-expectation-variance|数学期望与方差]]
- [[vault-notes/random-signals/02-covariance-correlation|协方差与相关系数]]
- [[vault-notes/random-signals/03-gaussian-process-white-noise|高斯过程与白噪声]]
- [[vault-notes/random-signals/03-ergodicity|各态历经性]]
- [[vault-notes/random-signals/03-mean-and-correlation-functions|均值函数与相关函数]]
- [[vault-notes/random-signals/03-poisson-markov-processes|泊松过程与马尔可夫过程]]
- [[vault-notes/random-signals/03-definition-and-sample-functions|随机过程的定义与样本函数]]
- [[vault-notes/random-signals/03-cyclostationary-processes|循环平稳过程]]
- [[vault-notes/random-signals/03-strict-vs-wide-sense-stationary|严平稳与宽平稳]]
- [[vault-notes/random-signals/04-cross-correlation-covariance|互相关与互协方差]]
- [[vault-notes/random-signals/04-correlation-properties|相关函数的性质]]
- [[vault-notes/random-signals/04-sample-correlation-estimation|样本相关函数估计]]
- [[vault-notes/random-signals/04-autocorrelation-autocovariance|自相关与自协方差]]
- [[vault-notes/random-signals/05-white-colored-noise-spectra|白噪声与有色噪声频谱]]
- [[vault-notes/random-signals/05-power-spectral-density|功率谱密度PSD]]
- [[vault-notes/random-signals/05-psd-numerical-estimation|功率谱数值估计]]
- [[vault-notes/random-signals/05-cross-power-spectral-density|互功率谱密度]]
- [[vault-notes/random-signals/05-wiener-khinchin|维纳辛钦定理]]
- [[vault-notes/random-signals/06-filtering-noise-power|滤波与噪声功率分析]]
- [[vault-notes/random-signals/06-output-mean-autocorrelation|输出均值与自相关]]
- [[vault-notes/random-signals/06-input-output-psd-relation|输入输出功率谱关系]]
- [[vault-notes/random-signals/06-random-process-lti-systems|随机过程与LTI系统]]
- [[vault-notes/random-signals/07-estimator-bias-variance|估计量的偏差和方差]]
- [[vault-notes/random-signals/07-kalman-filter|卡尔曼滤波]]
- [[vault-notes/random-signals/07-wiener-filter|维纳滤波]]
- [[vault-notes/random-signals/07-maximum-likelihood-least-squares|最大似然与最小二乘]]
- [[vault-notes/random-signals/07-mmse-lmmse|MMSE与LMMSE]]
- [[vault-notes/random-signals/08-hypothesis-testing|假设检验]]
- [[vault-notes/random-signals/08-matched-filter-detection|匹配滤波检测]]
- [[vault-notes/random-signals/08-likelihood-ratio-test|似然比检验]]
- [[vault-notes/random-signals/08-neyman-pearson|Neyman-Pearson准则]]
- [[vault-notes/random-signals/08-roc-curve|ROC曲线]]
- [[vault-notes/random-signals/09-parametric-spectral-estimation|参数化谱估计]]
- [[vault-notes/random-signals/09-adaptive-filter-lms|自适应滤波LMS]]
- [[vault-notes/random-signals/09-adaptive-filter-rls|自适应滤波RLS]]
- [[vault-notes/random-signals/09-ar-ma-arma-modeling|AR-MA-ARMA建模]]
- [[vault-notes/random-signals/10-receiver-detection|接收机检测]]
- [[vault-notes/random-signals/10-snr-noise-bandwidth|信噪比与噪声带宽]]
- [[vault-notes/random-signals/10-adc-sampling-quantization-noise|ADC采样与量化噪声]]
- [[vault-notes/random-signals/10-awgn-channel|AWGN信道]]
- [[vault-notes/random-signals/10-bpsk-qam-ber|BPSK-QAM误码率]]
- [[vault-notes/random-signals/11-white-noise-through-filter|白噪声通过滤波器]]
- [[vault-notes/random-signals/11-gaussian-noise-distribution|高斯噪声生成与分布验证]]
- [[vault-notes/random-signals/11-psd-estimation-experiment|功率谱估计实验]]
- [[vault-notes/random-signals/11-wiener-filtering-experiment|维纳滤波实验]]
- [[vault-notes/random-signals/11-autocorrelation-estimation-experiment|自相关估计实验]]
- [[vault-notes/random-signals/11-awgn-ber-experiment|AWGN信道误码率实验]]
- [[vault-notes/random-signals/99-formula-cheatsheet|常用公式速查]]
- [[vault-notes/random-signals/99-mistakes-and-questions|错题与问题记录]]
- [[vault-notes/random-signals/99-easily-confused-concepts|易混淆概念]]

<!-- topic-index:end -->
