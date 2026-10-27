---
title: "随机信号处理知识地图"
type: map
subjects:
  - 随机信号处理
  - 概率论与数理统计
  - 通信原理
domains:
  - 随机过程
  - 统计信号处理
status: learning
aliases:
  - 随机信号 MOC
  - 随机信号处理跨库地图
prerequisites:
  - "[[vault-notes/math/probability/03-random-variables-distributions]]"
  - "[[vault-notes/math/probability/05-numerical-characteristics]]"
  - "[[vault-notes/dsp/01-discrete-time-systems]]"
related:
  - "[[vault-notes/random-signals/00-knowledge-map]]"
  - "[[vault-notes/maps/digital-communication-map]]"
  - "[[vault-notes/maps/linear-systems-filtering-map]]"
---

# 🎲 随机信号处理知识地图

> [!abstract] 核心问题
> 当信号和噪声只能用概率分布描述时，我们如何描述它、预测它、从含噪观测中估计它、在假设之间做判决？
> 一句话主线：**随机变量描述“一个时刻的不确定”，随机过程描述“随时间演化的不确定”，相关函数/功率谱描述二阶统计，LTI 系统给出输入输出关系，估计与检测给出最优决策。**

> [!info] 逐节导读
> 本页是**跨库视角**；01–11 模块的逐节入口、学习路线和符号约定见 [[vault-notes/random-signals/00-knowledge-map]]（随机信号处理子库）。

## 一、前置知识

| 前置 | 为什么需要 | 入口 |
| --- | --- | --- |
| 概率公理与条件概率 | 定义随机变量、条件分布、贝叶斯 | [[vault-notes/random-signals/01-probability-basics]]、[[vault-notes/random-signals/01-conditional-probability-bayes]] |
| 随机变量与分布 | 高斯/瑞利/莱斯/卡方是噪声与衰落的模型 | [[vault-notes/random-signals/01-random-variables-distributions]]、[[vault-notes/math/probability/03-random-variables-distributions]] |
| 期望/方差/协方差 | 均值、功率、相关、协方差矩阵 | [[vault-notes/random-signals/02-expectation-variance]]、[[vault-notes/random-signals/02-covariance-correlation]] |
| 线性代数 | 协方差矩阵、投影、LMMSE | [[vault-notes/math/linear-algebra/01-vector-introduction]]、[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]] |
| 信号与系统 | 卷积、LTI、频响 | [[vault-notes/dsp/01-discrete-time-systems]] |

## 二、概念链

```mermaid
flowchart LR
  RV[随机变量] --> RP[随机过程]
  RP --> STAT[均值/自相关]
  STAT --> PSD[功率谱密度]
  RP --> LTI[通过 LTI 系统]
  PSD --> LTI
  LTI --> EST[估计/滤波]
  EST --> DET[检测]
  DET --> COMM[通信应用]
```

## 三、三座桥

| 桥 | 公式 | 连接什么 | 入口 |
| --- | --- | --- | --- |
| 维纳-辛钦 | $S_X(\omega)=\int R_X(\tau)e^{-j\omega\tau}d\tau$ | 相关函数 ↔ 功率谱 | [[vault-notes/random-signals/05-wiener-khinchin]] |
| LTI 功率谱 | $S_Y(\omega)=\lvert H(\omega)\rvert^2S_X(\omega)$ | 输入谱 → 输出谱 | [[vault-notes/random-signals/06-input-output-psd-relation]] |
| 匹配滤波/MMSE | $\mathrm{SNR}_{MF}=2E/N_0$；$\hat{X}_{MMSE}=E[X\mid Y]$ | 波形/观测 → 最优判决/估计 | [[vault-notes/random-signals/08-matched-filter-detection]]、[[vault-notes/random-signals/07-mmse-lmmse]] |

## 四、模块地图

| 模块 | 核心问题 | 关键笔记 |
| --- | --- | --- |
| 01 数学预备 | 概率、矩阵、傅里叶够不够？ | [[vault-notes/random-signals/01-probability-basics]]、[[vault-notes/random-signals/01-linear-algebra-matrices]]、[[vault-notes/random-signals/01-fourier-and-lti]] |
| 02 随机变量/向量 | 如何描述多维随机性？ | [[vault-notes/random-signals/02-expectation-variance]]、[[vault-notes/random-signals/02-covariance-correlation]]、[[vault-notes/random-signals/02-gaussian-random-vectors]]、[[vault-notes/random-signals/02-complex-random-variables]] |
| 03 随机过程 | 如何描述随时间演化的随机性？ | [[vault-notes/random-signals/03-definition-and-sample-functions]]、[[vault-notes/random-signals/03-strict-vs-wide-sense-stationary]]、[[vault-notes/random-signals/03-ergodicity]]、[[vault-notes/random-signals/03-gaussian-process-white-noise]] |
| 04 时域分析 | 相关函数能看出什么？ | [[vault-notes/random-signals/04-autocorrelation-autocovariance]]、[[vault-notes/random-signals/04-cross-correlation-covariance]]、[[vault-notes/random-signals/04-correlation-properties]]、[[vault-notes/random-signals/04-sample-correlation-estimation]] |
| 05 频域分析 | 功率如何随频率分布？ | [[vault-notes/random-signals/05-power-spectral-density]]、[[vault-notes/random-signals/05-wiener-khinchin]]、[[vault-notes/random-signals/05-cross-power-spectral-density]]、[[vault-notes/random-signals/05-psd-numerical-estimation]] |
| 06 通过系统 | 随机信号经过 LTI 怎么变？ | [[vault-notes/random-signals/06-random-process-lti-systems]]、[[vault-notes/random-signals/06-output-mean-autocorrelation]]、[[vault-notes/random-signals/06-input-output-psd-relation]]、[[vault-notes/random-signals/06-filtering-noise-power]] |
| 07 估计/滤波 | 如何从观测中估计参数/信号？ | [[vault-notes/random-signals/07-estimator-bias-variance]]、[[vault-notes/random-signals/07-maximum-likelihood-least-squares]]、[[vault-notes/random-signals/07-mmse-lmmse]]、[[vault-notes/random-signals/07-wiener-filter]]、[[vault-notes/random-signals/07-kalman-filter]] |
| 08 检测 | 如何在假设间判决？ | [[vault-notes/random-signals/08-hypothesis-testing]]、[[vault-notes/random-signals/08-likelihood-ratio-test]]、[[vault-notes/random-signals/08-neyman-pearson]]、[[vault-notes/random-signals/08-roc-curve]]、[[vault-notes/random-signals/08-matched-filter-detection]] |
| 09 进阶 | 非白信号如何建模/自适应？ | [[vault-notes/random-signals/09-ar-ma-arma-modeling]]、[[vault-notes/random-signals/09-parametric-spectral-estimation]]、[[vault-notes/random-signals/09-adaptive-filter-lms]]、[[vault-notes/random-signals/09-adaptive-filter-rls]] |
| 10 通信应用 | 理论如何落地？ | [[vault-notes/random-signals/10-awgn-channel]]、[[vault-notes/random-signals/10-adc-sampling-quantization-noise]]、[[vault-notes/random-signals/10-bpsk-qam-ber]]、[[vault-notes/random-signals/10-snr-noise-bandwidth]]、[[vault-notes/random-signals/10-receiver-detection]] |
| 11 MATLAB | 如何仿真验证？ | [[vault-notes/random-signals/11-gaussian-noise-distribution]]、[[vault-notes/random-signals/11-autocorrelation-estimation-experiment]]、[[vault-notes/random-signals/11-psd-estimation-experiment]]、[[vault-notes/random-signals/11-awgn-ber-experiment]] |

## 五、与已有课程的接口

| 本库概念 | 已有笔记 | 接口说明 |
| --- | --- | --- |
| 随机过程 | [[vault-notes/communication/03-random-processes]] | 平稳、各态历经、窄带高斯 |
| 数字特征 | [[vault-notes/math/probability/05-numerical-characteristics]] | 期望、方差、协方差、相关系数 |
| 参数估计/假设检验 | [[vault-notes/math/probability/08-parameter-estimation]]、[[vault-notes/math/probability/09-hypothesis-testing]] | MLE、区间估计、两类错误 |
| 最佳接收 | [[vault-notes/communication/09-optimal-reception]] | 匹配滤波、最大似然、$E_b/N_0$ |
| 信道噪声 | [[vault-notes/communication/04-channel]] | 白噪声、窄带噪声、香农公式 |
| 数字调制 | [[vault-notes/communication/07-digital-bandpass]] | 误码率公式与星座图 |
| 5G | [[vault-notes/5g/phy/04-physical-channels-signals]]、[[vault-notes/5g/harq]] | 信道估计、HARQ、链路自适应 |
| 硬件 | [[vault-notes/fpga/ad9361/iq-signals]]、[[vault-notes/fpga/ad9361/ad9361-architecture]] | 复基带、DDC/DUC、噪声 |
| 仿真 | [[vault-notes/matlab/matlab-notes]] | `randn`、`xcorr`、`pwelch`、BER |

## 六、工程应用

- **AWGN 信道**：噪声建模、SNR、$E_b/N_0$，见 [[vault-notes/random-signals/10-awgn-channel]]。
- **接收机**：匹配滤波/相关接收、判决门限，见 [[vault-notes/random-signals/10-receiver-detection]]。
- **ADC/量化**：量化噪声、SQNR，见 [[vault-notes/random-signals/10-adc-sampling-quantization-noise]]。
- **5G**：信道估计、HARQ、链路自适应，见 [[vault-notes/5g/phy/04-physical-channels-signals]]、[[vault-notes/5g/harq]]。
- **自适应滤波**：回声消除、均衡、系统辨识，见 [[vault-notes/random-signals/09-adaptive-filter-lms]]。

## 七、实验与项目

- [[vault-notes/random-signals/11-gaussian-noise-distribution]]：分布/均值/方差。
- [[vault-notes/random-signals/11-autocorrelation-estimation-experiment]]：有偏/无偏、理论对比。
- [[vault-notes/random-signals/11-psd-estimation-experiment]]：周期图/Welch。
- [[vault-notes/random-signals/11-white-noise-through-filter]]：$S_Y=\lvert H\rvert^2S_X$。
- [[vault-notes/random-signals/11-wiener-filtering-experiment]]、[[vault-notes/random-signals/11-awgn-ber-experiment]]。

## 八、学习顺序

1. 01 概率/矩阵/傅里叶 → 02 随机变量/向量。
2. 03 随机过程 → 04 时域 → 05 频域。
3. 06 通过系统 → 07 估计/滤波。
4. 08 检测 → 10 通信应用。
5. 09 进阶与 11 实验按需穿插。

## 九、尚未学习/待补

- 非高斯噪声、脉冲噪声、重尾分布。
- 循环平稳过程的循环谱估计。
- 非线性滤波（粒子滤波、扩展 Kalman）。
- MIMO 信道估计与检测、大规模天线。
- 定点化/硬件实现中的数值稳定性。

## 关联
- 首页：首页｜总图：电子信息工程知识总图
- 子库逐节：[[vault-notes/random-signals/00-knowledge-map]]｜速查：[[vault-notes/random-signals/99-formula-cheatsheet]]｜易混：[[vault-notes/random-signals/99-easily-confused-concepts]]
- 相关 MOC：[[vault-notes/maps/digital-communication-map]]｜[[vault-notes/maps/linear-systems-filtering-map]]｜[[vault-notes/maps/sampling-quantization-map]]
- 全库总纲：00_全库理论知识点综合与联系
