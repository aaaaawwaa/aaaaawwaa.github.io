---
title: 数学基础
description: 电子信息工程的数学工具箱，覆盖线性代数、矩阵变换、概率论与随机信号分析的基本概念。
tags:
  - mathematics
  - index
---

## 学习范围

本分类覆盖电子信息工程中最常用的数学工具，分三条主线。第一条是线性代数：向量空间、矩阵运算、特征值与奇异值分解，它解释了 DFT 的正交基结构，也是 MIMO 信道分析的语言。第二条是概率论与随机过程：随机变量、常见分布、期望方差、高斯噪声与相关函数，它们是误码率推导和噪声分析的起点。第三条是与变换相关的复变基础，为后续学习傅里叶变换与 Z 变换做准备。

学习目标是「读懂公式、用对条件、能写成代码」：先掌握矩阵乘法与特征值，再进入概率论，最后回到具体问题中检验。

## 本分类文章

- [[mathematics/linear-algebra-basics|线性代数基础]]：向量、矩阵、特征分解，以及 DFT 矩阵与信道的 SVD 分解。
- [[mathematics/probability-overview|概率论概览]]：随机变量、期望方差、高斯分布与 AWGN 信道模型。

## 跨学科关联

- [[signal-processing/dft-and-fft|DFT 与 FFT]]：DFT 本质上是取一组正交基上的投影，核函数 $e^{-j2\pi kn/N}$ 构成酉矩阵。
- [[communication/digital-modulation-qpsk|数字调制 QPSK]]：星座图是二维实向量空间中的点，误码率由高斯分布与 Q 函数给出。
- [[signal-processing/signals-and-systems-intro|信号与系统导论]]：卷积与频域分析的每一步都依赖线性代数与复数的运算规则。

> [!note] 学数学的优先级
> 对电子信息工程而言，**会用**比**会证**更重要。公式的适用条件（连续还是离散、实信号还是复信号、是否满足绝对可和）必须记清楚，因为条件不满足时结论会失效。

## 相关阅读

- [[mathematics/linear-algebra-basics|线性代数基础]]
- [[mathematics/probability-overview|概率论概览]]
- [[maps/learning-path|推荐学习路径]]

<!-- topic-index:start -->
## 数学工具与课程笔记

### 数学 / 线性代数

- [[vault-notes/math/linear-algebra/01-vector-introduction|向量引论]]
- [[vault-notes/math/linear-algebra/02-solving-linear-systems|线性方程组的求解]]
- [[vault-notes/math/linear-algebra/03-vector-spaces-subspaces|向量空间与子空间]]
- [[vault-notes/math/linear-algebra/04-orthogonality|正交性]]
- [[vault-notes/math/linear-algebra/05-determinants|行列式]]
- [[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors|特征值与特征向量]]
- [[vault-notes/math/linear-algebra/07-singular-value-decomposition|奇异值分解]]
- [[vault-notes/math/linear-algebra/08-linear-transformations|线性变换]]
- [[vault-notes/math/linear-algebra/09-complex-vectors-matrices|复向量和复矩阵]]
- [[vault-notes/math/linear-algebra/10-applications|线性代数的应用]]
- [[vault-notes/math/linear-algebra/11-numerical-linear-algebra|数值线性代数]]
- [[vault-notes/math/linear-algebra/12-linear-algebra-in-probability-statistics|概率统计中的线性代数]]

### 数学 / 概率论与数理统计

- [[vault-notes/math/probability/00-guide|概率论与数理统计知识库总导读]]
- [[vault-notes/math/probability/01-basic-concepts|概率论的基本概念]]
- [[vault-notes/math/probability/02-conditional-probability-independence|条件概率与事件的独立性]]
- [[vault-notes/math/probability/03-random-variables-distributions|随机变量及其分布]]
- [[vault-notes/math/probability/04-multivariate-random-variables|多维随机变量及其分布]]
- [[vault-notes/math/probability/05-numerical-characteristics|随机变量的数字特征]]
- [[vault-notes/math/probability/06-law-of-large-numbers-clt|大数定律与中心极限定理]]
- [[vault-notes/math/probability/07-samples-sampling-distributions|样本及抽样分布]]
- [[vault-notes/math/probability/08-parameter-estimation|参数估计]]
- [[vault-notes/math/probability/09-hypothesis-testing|假设检验]]
- [[vault-notes/math/probability/10-anova-regression|方差分析与回归分析]]
- [[vault-notes/math/probability/appendix-random-variable-functions|附录. 随机变量函数与随机数生成]]

### 数学 / 复变函数与场论

- [[vault-notes/math/complex-analysis/00-guide|复变函数与场论知识库总导读]]
- [[vault-notes/math/complex-analysis/01-complex-numbers-functions|复数与复变函数]]
- [[vault-notes/math/complex-analysis/02-analytic-functions|解析函数]]
- [[vault-notes/math/complex-analysis/03-complex-integration|复变函数的积分]]
- [[vault-notes/math/complex-analysis/04-series-representation|解析函数的级数表示]]
- [[vault-notes/math/complex-analysis/05-residues-applications|留数及其应用]]
- [[vault-notes/math/complex-analysis/06-conformal-mapping|保角映射]]
- [[vault-notes/math/complex-analysis/07-fourier-transform|傅里叶变换]]
- [[vault-notes/math/complex-analysis/08-laplace-transform|拉普拉斯变换]]
- [[vault-notes/math/complex-analysis/09-field-theory-basics|场论基础]]
- [[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value|场论的积分定理与边值问题]]

<!-- topic-index:end -->
