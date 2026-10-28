---
title: 数学基础
description: 电子信息工程的数学工具箱：线性代数、概率统计、复变函数与场论，以及常用公式速查。
tags:
  - mathematics
  - index
---

## 学习范围

本分类把电子信息工程最常用的数学工具分成四组。**线性代数**（四篇）从向量、矩阵、消元与行列式讲到正交投影、最小二乘、特征分解、SVD 与数值稳定性，它解释了 DFT 的正交基结构，也是 MIMO 信道与 PCA 的语言。**概率论与数理统计**（两篇）从公理、条件概率与随机变量讲到抽样分布、参数估计、假设检验与回归，是噪声建模、误码率推导与仿真结果分析的起点。**复变函数与场论**（两篇）提供 s 域/z 域、留数、保角映射与静电场边值问题的数学基础。**公式速查**把最常用的结论集中在一页，方便复习与查阅。

学习目标是"读懂公式、用对条件、能写成代码"：先掌握矩阵运算与特征值，再进入概率论，最后用复变与变换工具解决具体问题。每篇文章都保留关键推导与适用条件，并在文末链接到课程笔记的完整推导。

## 本分类文章

- [[mathematics/linear-algebra-basics|线性代数基础]]：向量、矩阵、高斯消元与 LU、向量空间与秩、行列式。
- [[mathematics/orthogonality-least-squares|正交性与最小二乘]]：投影、法方程、QR 分解、Gram–Schmidt 与最小二乘拟合。
- [[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]]：对角化条件、谱定理、SVD、PCA、多维高斯与 MIMO 并行子信道。
- [[mathematics/linear-transformations-numerics|线性变换与数值稳定性]]：换基与相似、Hermitian/酉矩阵、FFT 矩阵分解、条件数与迭代法。
- [[mathematics/probability-overview|概率论概览]]：概率公理、条件概率与贝叶斯、随机变量与分布、数字特征、大数定律与 CLT。
- [[mathematics/statistics-inference|数理统计与推断]]：抽样分布、参数估计、假设检验、方差分析、回归与随机数生成。
- [[mathematics/complex-analysis|复变函数基础]]：复数、解析函数与 C-R 方程、复积分、级数、留数、保角映射。
- [[mathematics/complex-transforms-and-fields|复变变换与场论]]：傅里叶级数/变换、拉普拉斯变换、麦克斯韦方程与边值问题。
- [[mathematics/formula-sheet|数学公式速查]]：线性代数、概率统计、复变与变换的常用公式一页速查。

## 跨学科关联

- [[signal-processing/dft-and-fft|DFT 与 FFT]]：DFT 是正交基上的投影，FFT 的分解来自矩阵分块。
- [[signal-processing/random-processes|随机信号、估计与检测]]：相关函数、功率谱、MMSE 与检测都建立在概率论与线性代数上。
- [[signal-processing/signals-and-systems-intro|信号与系统导论]]：卷积、s 域与频率响应依赖复变函数与拉普拉斯变换。
- [[communication/digital-modulation-qpsk|数字调制 QPSK]]：误码率由高斯分布与 Q 函数给出。
- [[communication/mobile-networks|移动通信网络]]：MIMO 预编码来自信道矩阵的 SVD。
- [[programming/matlab-for-dsp|MATLAB 与 DSP 仿真]]：用 MATLAB 验证公式与算法。

> [!note] 学数学的优先级
> 对电子信息工程而言，**会用**比**会证**更重要。但"会用"包括记住适用条件：连续还是离散、实信号还是复信号、是否满足绝对可和、方差是否有限、矩阵是否满秩。条件不满足时，公式给出的结论会失效。

## 相关阅读

- [[mathematics/linear-algebra-basics|线性代数基础]]
- [[mathematics/orthogonality-least-squares|正交性与最小二乘]]
- [[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]]
- [[mathematics/linear-transformations-numerics|线性变换与数值稳定性]]
- [[mathematics/probability-overview|概率论概览]]
- [[mathematics/statistics-inference|数理统计与推断]]
- [[mathematics/complex-analysis|复变函数基础]]
- [[mathematics/complex-transforms-and-fields|复变变换与场论]]
- [[mathematics/formula-sheet|数学公式速查]]
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
