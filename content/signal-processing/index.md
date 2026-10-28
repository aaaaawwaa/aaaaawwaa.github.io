---
title: 信号处理
description: 从离散时间信号与系统出发，经 Z 变换、DTFT、DFT/FFT，到数字滤波器结构、IIR/FIR 设计与多抽样率，再到随机信号与统计信号处理的完整学习路径。
tags:
  - signal-processing
  - index
---

信号处理研究如何用数学工具描述、变换与分析随时间变化的物理量。对电子工程而言，它同时是**通信系统的数学语言**（调制、滤波、检测）和**FPGA 实时实现的算法来源**（FFT、FIR、抽取）。

> [!tip] 一句话抓住重点
> 频域分析的价值在于：很多在时域看起来复杂的运算（卷积、微分、滤波），在频域里只是加法与乘法。

## 学习路径

下面 15 篇文章构成一条从"序列"到"统计信号处理"的路线。每篇都包含定义、适用条件、推导或例题、易错点，并在文末链接到 Obsidian 中的详细笔记。

### 第一阶段：连续与离散的桥

1. [[signal-processing/signals-and-systems-intro|离散时间信号、系统与采样]] —— 序列与数字频率、LTI 系统与卷积、差分方程、抽样定理与混叠、sinc 重建。**这是全部分支的前置**。

### 第二阶段：变换域

2. [[signal-processing/z-transform-and-dtft|Z 变换与 DTFT]] —— 收敛域决定序列、反变换、s-z 映射、系统函数 $H(z)$、零极点与因果稳定性、DTFT 与频率响应。
3. [[signal-processing/dft-and-fft|DFT 与 FFT]] —— 频域采样得到 DFT、圆周卷积与补零条件、分辨率/泄漏/栅栏效应、基 2 蝶形与位倒序、重叠相加/保留。

### 第三阶段：滤波器

4. [[signal-processing/digital-filter-structures|数字滤波器结构]] —— 直接型 I/II、级联、并联、转置、频率采样型、格型；结构选择与有限字长影响。
5. [[signal-processing/iir-filter-design|IIR 滤波器设计]] —— 巴特沃斯/切比雪夫原型、脉冲响应不变法、双线性变换与预畸变、高通/带通变换。
6. [[signal-processing/fir-filter-design|FIR 滤波器设计]] —— 线性相位条件与四种类型、窗函数法、频率采样法、等波纹最优设计、IIR/FIR 对比。
7. [[signal-processing/multirate-dsp|多抽样率数字信号处理]] —— 抽取与插值、诺贝尔恒等式、多相分解、分数倍重采样、滤波器组与 OFDM。

### 第四阶段：随机与统计

8. [[signal-processing/random-processes|随机过程与随机信号]] —— 随机变量回顾、样本函数、平稳性、各态历经、均值与相关函数。
9. [[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]] —— 自/互相关、样本估计、维纳–辛钦、白噪声与有色噪声、互谱与 PSD 估计。
10. [[signal-processing/random-signals-through-systems|随机信号通过线性系统]] —— 输出均值与相关、$S_Y=\lvert H\rvert^2S_X$、噪声带宽、ADC 量化噪声、AWGN 与 SNR。
11. [[signal-processing/statistical-estimation-filtering|统计估计与最优滤波]] —— 偏差方差与 CRLB、最大似然与最小二乘、MMSE/LMMSE、维纳滤波、卡尔曼滤波。
12. [[signal-processing/adaptive-filtering-and-spectral-estimation|自适应滤波与参数化谱估计]] —— LMS/RLS 在线跟踪、AR/MA/ARMA 建模、MUSIC/ESPRIT 超分辨。
13. [[signal-processing/signal-detection-theory|信号检测理论]] —— 似然比、Neyman–Pearson、匹配滤波、ROC、M 元检测与误码率。
14. [[signal-processing/random-signal-experiments|随机信号处理 MATLAB 实验]] —— 六个可运行实验与预期现象。
15. [[signal-processing/random-signals-formula-sheet|随机信号公式速查与易错点]] —— 一页式公式表、易混淆概念与高频错因。

## 与其他学科的连接

- **通信**：[[communication/index|通信原理]] 的调制、最佳接收与噪声性能都建立在本分类之上；5G 的 OFDM 与信道估计直接用到 DFT 与多抽样率。
- **数学**：[[mathematics/linear-algebra-basics|线性代数]] 解释 DFT 是正交变换、滤波器设计中的矩阵方程；[[mathematics/probability-overview|概率论]] 是随机信号的语言；[[mathematics/complex-analysis|复变函数]] 支撑 z 变换与留数反变换。
- **FPGA**：[[digital-systems/index|数字系统]] 里用 Verilog 实现 FIR/FFT 需要理解定点、流水线与吞吐率；MATLAB 原型见 [[programming/matlab-for-dsp|MATLAB 与 DSP 实验]]。
- **交互实验**：[[interactive-labs/fourier-series-lab|傅里叶级数实验]]。

## 学习方法

1. 先读"为什么需要"（每篇开头），再读定义与条件；
2. 每个公式自己推一遍最简单的例子（如 $N=4$ 的 DFT、二阶系统）；
3. 用 MATLAB/Python 复现文中代码，改参数观察现象；
4. 遇到"看起来矛盾"的结论，回到适用条件检查（例如补零 vs 分辨率）。

<!-- topic-index:start -->
## 数字信号处理知识点索引

### 数字信号处理

- [[vault-notes/dsp/01-discrete-time-systems|离散时间信号与系统]]
- [[vault-notes/dsp/02-z-transform-and-dtft|Z变换与离散时间傅里叶变换(DTFT)]]
- [[vault-notes/dsp/03-discrete-fourier-transform|离散傅里叶变换(DFT)]]
- [[vault-notes/dsp/04-fast-fourier-transform|快速傅里叶变换(FFT)]]
- [[vault-notes/dsp/05-filter-structures|数字滤波器的基本结构]]
- [[vault-notes/dsp/06-iir-filter-design|无限长单位冲激响应数字滤波器(IIR)设计方法]]
- [[vault-notes/dsp/07-fir-filter-design|有限长单位冲激响应数字滤波器(FIR)设计方法]]
- [[vault-notes/dsp/08-multirate-sampling|序列的抽取和插值--多抽样率数字信号处理基础]]

<!-- topic-index:end -->
