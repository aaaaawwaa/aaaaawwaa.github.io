---
title: "课程与教材索引"
tags:
- 随机信号处理
- 导航
- 教材
aliases:
- 随机信号处理教材索引
- 参考书
type: map
subjects:
- 随机信号处理
- 知识管理
domains:
- 知识管理
status: learning
prerequisites: []
related: []
---

# 📚 课程与教材索引

> [!abstract] 这页解决什么问题
> 随机信号处理没有唯一教材：概率论、随机过程、统计信号处理、自适应滤波、通信原理各讲一段。
> 本页把常见教材按“本库模块”对齐，告诉你**哪本书补哪一块、读到什么程度就够用**。

## 一、主教材地图

| 教材 | 主要覆盖 | 本库对应 | 建议读法 |
| --- | --- | --- | --- |
| 《概率论与数理统计》（浙大·盛骤） | 概率公理、随机变量、数字特征、大数定律、参数估计、假设检验 | 01、02、07、08 | 重点读随机变量、数字特征、参数估计、假设检验；证明可略读 |
| 《随机过程》（Papoulis & Pillai） | 随机变量、随机过程、平稳性、各态历经、功率谱、高斯过程、马尔可夫链 | 02、03、04、05 | 经典但偏理论；重点看平稳过程、功率谱、高斯过程 |
| 《概率、随机变量与随机过程》（Leon-Garcia） | 概率、随机变量、随机过程、排队与马尔可夫链 | 01、02、03 | 例子多，适合第一遍建立直觉 |
| 《统计信号处理基础》（Kay） | 估计理论、检测理论、CRLB、似然比、ROC | 07、08 | 做估计/检测时的标准参考；重点看 CRLB、LRT、ROC |
| 《自适应滤波器原理》（Haykin） | Wiener、LMS、RLS、ARMA、谱估计 | 07、09 | 工程性强；先看 Wiener/LMS/RLS 三章 |
| 《通信原理》（樊昌信·第七版） | 随机过程、信道、数字调制、最佳接收、同步 | 03、05、10 | 与 [[vault-notes/communication/03-random-processes]]、[[vault-notes/communication/04-channel]]、[[vault-notes/communication/09-optimal-reception]] 对照读 |
| 《数字信号处理》（程佩青 / Oppenheim） | 离散信号、z 变换、DFT/FFT、滤波器、多抽样率 | 05、06、11 | 重点看 DFT/FFT、滤波器结构、谱估计 |
| MATLAB Signal Processing Toolbox 文档 | `randn`、`xcorr`、`pwelch`、`filter`、`berawgn` | 11 | 以函数文档 + 本库实验笔记为主 |

## 二、按模块的阅读顺序

| 模块 | 首选 | 补充 | 备注 |
| --- | --- | --- | --- |
| 01 数学预备 | 盛骤《概率论》前四章 | Leon-Garcia 前五章 | 先把条件概率、贝叶斯、随机变量搞清楚 |
| 02 随机变量/向量 | 盛骤第 2–4 章 | Papoulis 第 4–6 章 | 高斯向量与协方差矩阵要熟练 |
| 03 随机过程基础 | Papoulis 第 9–10 章 | 樊昌信第 3 章 | 平稳、各态历经、白噪声是重点 |
| 04 时域分析 | Papoulis 第 10 章 | 程佩青相关章节 | 自相关/互相关的性质要能默写 |
| 05 频域分析 | Papoulis 第 10 章 | 程佩青 DFT/FFT 章节 | 维纳-辛钦是核心 |
| 06 通过系统 | Papoulis 第 9 章 | 程佩青滤波器章节 | 重点记 $S_Y=\lvert H\rvert^2S_X$ |
| 07 估计/滤波 | Kay 第 1–6 章 | Haykin 第 2–3 章 | CRLB、MMSE、Wiener、Kalman |
| 08 检测理论 | Kay 第 3–6 章 | 樊昌信第 9 章 | LRT、NP、ROC、匹配滤波 |
| 09 进阶 | Haykin 第 4–9 章 | 谱估计相关论文/教材 | ARMA、LMS、RLS、MUSIC |
| 10 通信应用 | 樊昌信第 4、7、9 章 | 5G 物理层笔记 | AWGN、BER、接收机 |
| 11 MATLAB | 本库实验笔记 | MATLAB 官方文档 | 每个实验都要有理论对照 |

## 三、三种读法

### 1. 零基础补课

```
盛骤《概率论》1–4 章
→ 本库 01、02
→ Papoulis 第 9–10 章
→ 本库 03、04、05
```

### 2. 通信/信号处理工程

```
樊昌信第 3–4 章 + 本库 03/05
→ Kay 估计/检测 + 本库 07/08
→ 本库 10 通信应用
→ 本库 11 MATLAB 实验
```

### 3. 算法/自适应方向

```
本库 02/05/06
→ Haykin Wiener/LMS/RLS
→ 本库 09 进阶统计信号处理
→ 本库 11 实验
```

## 四、和已有笔记的对应

- 概率论：[[vault-notes/math/probability/03-random-variables-distributions]]、[[vault-notes/math/probability/04-multivariate-random-variables]]、[[vault-notes/math/probability/05-numerical-characteristics]]、[[vault-notes/math/probability/08-parameter-estimation]]、[[vault-notes/math/probability/09-hypothesis-testing]]
- 随机过程：[[vault-notes/communication/03-random-processes]]
- 信号与系统：[[vault-notes/dsp/01-discrete-time-systems]]、[[vault-notes/dsp/02-z-transform-and-dtft]]、[[vault-notes/dsp/04-fast-fourier-transform]]
- 通信原理：[[vault-notes/communication/04-channel]]、[[vault-notes/communication/07-digital-bandpass]]、[[vault-notes/communication/09-optimal-reception]]
- 线性代数：[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]]、[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]、[[vault-notes/math/linear-algebra/10-applications]]

## 关联

- 导航：[[vault-notes/random-signals/00-knowledge-map]]
- 符号：[[vault-notes/random-signals/00-math-symbols]]
- 速查：[[vault-notes/random-signals/99-formula-cheatsheet]]
- 全库总纲：00_全库理论知识点综合与联系
