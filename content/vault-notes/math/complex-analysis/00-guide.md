---
title: "复变函数与场论知识库总导读"
tags:
- 数学
- 复变函数
- 场论
- 总导读
type: map
subjects:
- 复变函数与场论
domains:
- 知识管理
status: learning
aliases: []
prerequisites: []
related: []
---

# 📐 复变函数与场论知识库总导读

> [!abstract] 📌 核心导读
> 本文件夹按国内工科《复变函数与场论》的通用大纲整理 **10 章**。
> 全书分三条主线：
> - **复变函数（第 1–6 章）**：复数 → 解析函数 → 复积分 → 级数 → 留数 → 保角映射。核心是"解析"这个强条件带来的整套理论。
> - **积分变换（第 7–8 章）**：傅里叶变换与拉普拉斯变换。把时域问题搬到频域/复频域，是通信与信号处理的数学基础。
> - **场论（第 9–10 章）**：梯度、散度、旋度 → 高斯/斯托克斯定理 → 亥姆霍兹定理 → 拉普拉斯/泊松方程与边值问题。
>
> 一句话主线：**复变函数研究"复平面上的解析函数"，积分变换研究"把信号搬到频域"，场论研究"空间中的向量场"；三者共享同一套工具——柯西积分、留数、格林函数、调和函数。**

---

## 一、全书知识体系全景图

```mermaid
graph TD
    A[复变函数与场论] --> P[复变函数]
    A --> T[积分变换]
    A --> F[场论]

    P --> c1[[1. 复数与复变函数]]
    P --> c2[[2. 解析函数]]
    P --> c3[[3. 复变函数的积分]]
    P --> c4[[4. 解析函数的级数表示]]
    P --> c5[[5. 留数及其应用]]
    P --> c6[[6. 保角映射]]

    T --> c7[[7. 傅里叶变换]]
    T --> c8[[8. 拉普拉斯变换]]

    F --> c9[[9. 场论基础]]
    F --> c10[[10. 场论的积分定理与边值问题]]

    c1 --> c2 --> c3 --> c4 --> c5 --> c6
    c6 --> c7 --> c8
    c8 --> c9 --> c10
    c2 -.调和函数.-> c10
    c6 -.保角映射.-> c10
```

---

## 二、各章导航与核心考点

### 🟢 复变函数（第 1–6 章）

| 章 | 笔记 | 核心考点 |
| --- | --- | --- |
| 1 | [[vault-notes/math/complex-analysis/01-complex-numbers-functions]] | 复数运算、模/辐角、方根、初等函数、多值性 |
| 2 | [[vault-notes/math/complex-analysis/02-analytic-functions]] | 柯西–黎曼方程、解析性、调和函数、共轭调和 |
| 3 | [[vault-notes/math/complex-analysis/03-complex-integration]] | 柯西积分定理、柯西积分公式、高阶导数公式 |
| 4 | [[vault-notes/math/complex-analysis/04-series-representation]] | 幂级数、泰勒级数、洛朗级数、孤立奇点分类 |
| 5 | [[vault-notes/math/complex-analysis/05-residues-applications]] | 留数定理、极点留数、实积分计算、约当引理 |
| 6 | [[vault-notes/math/complex-analysis/06-conformal-mapping]] | 保角性、分式线性映射、交比、儒可夫斯基变换 |

### 🔵 积分变换（第 7–8 章）

| 章 | 笔记 | 核心考点 |
| --- | --- | --- |
| 7 | [[vault-notes/math/complex-analysis/07-fourier-transform]] | 傅里叶级数、傅里叶变换、δ 函数、卷积定理、抽样定理 |
| 8 | [[vault-notes/math/complex-analysis/08-laplace-transform]] | 拉氏变换、ROC、微分/积分性质、逆变换、系统函数 |

### 🟠 场论（第 9–10 章）

| 章 | 笔记 | 核心考点 |
| --- | --- | --- |
| 9 | [[vault-notes/math/complex-analysis/09-field-theory-basics]] | 梯度、散度、旋度、高斯定理、斯托克斯定理、势函数 |
| 10 | [[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] | 亥姆霍兹定理、拉普拉斯/泊松方程、分离变量法 |

---

## 三、全书主线逻辑（一句话串起 10 章）

> [!tip] 🧠 主线记忆
> **复变函数**：复数（第 1 章）→ 解析（第 2 章）→ 积分（第 3 章）→ 级数（第 4 章）→ 留数（第 5 章）→ 保角映射（第 6 章）。
> **积分变换**：傅里叶变换（第 7 章）→ 拉普拉斯变换（第 8 章）。
> **场论**：梯度/散度/旋度（第 9 章）→ 高斯/斯托克斯/亥姆霍兹/边值问题（第 10 章）。
> **连接点**：解析函数的实部/虚部是调和函数，直接连到第 10 章的拉普拉斯方程；保角映射把复杂边界化成简单边界，是解二维边值问题的几何工具；留数是逆 z 变换与逆拉氏变换的计算方法。

---

## 四、与其他知识库的联系

- **通信原理**：[[vault-notes/communication/07-digital-bandpass]]（调制/频谱）、[[vault-notes/communication/03-random-processes]]（功率谱、维纳–辛钦）、[[vault-notes/communication/09-optimal-reception]]（匹配滤波）。
- **数字信号处理**：[[vault-notes/dsp/02-z-transform-and-dtft]]（z 变换、DTFT）、[[vault-notes/dsp/04-fast-fourier-transform]]（DFT/FFT）、[[vault-notes/dsp/06-iir-filter-design]]（双线性变换、稳定性）。
- **线性代数**：[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]]（复特征值、稳定性）、[[vault-notes/math/linear-algebra/11-numerical-linear-algebra]]（数值方法）。
- **概率论与数理统计**：[[vault-notes/math/probability/03-random-variables-distributions]]（复高斯）、[[vault-notes/math/probability/04-multivariate-random-variables]]（二维正态）、[[vault-notes/math/probability/05-numerical-characteristics]]（特征函数）。
- **5G**：[[vault-notes/5g/phy/04-physical-channels-signals]]（OFDM、复基带、信道估计）。
- **Matlab**：[[vault-notes/matlab/matlab-notes]]（`fft`/`laplace`/`residue`/`fourier`/`gradient`/`divergence`/`curl` 等）。

---

## 五、建议的三种打开方式

| 目标 | 路线 |
| --- | --- |
| **系统学复变函数** | 第 1 章 → 第 2 章 → 第 3 章 → 第 4 章 → 第 5 章 → 第 6 章 |
| **系统学场论** | 第 9 章 → 第 10 章（前置：第 2 章的调和函数） |
| **为通信/信号处理打基础** | 第 1–2 章（复数/解析）→ 第 7–8 章（傅里叶/拉氏）→ 第 5 章（留数，用于逆变换） |
| **考前冲刺** | 每章末尾的「本章知识地图」+ 例题；重点看第 2、3、5、7、8、9、10 章 |

> [!tip] 三种打开方式（快捷入口）
> - 想**系统学**：从 [[vault-notes/math/complex-analysis/01-complex-numbers-functions]] 顺着每章末尾的"下一章"逐章推进。
> - 想**查公式**：直接看各章末尾的知识地图；留数/变换对在各章的表格里。
> - 想**做通信**：[[vault-notes/math/complex-analysis/07-fourier-transform]] → [[vault-notes/math/complex-analysis/08-laplace-transform]] → [[vault-notes/math/complex-analysis/05-residues-applications]]（逆变换）。

---

## 六、学习顺序与前置关系

| 章节 | 前置 |
| --- | --- |
| 1 | 无（微积分、复数基础） |
| 2 | 第 1 章 |
| 3 | 第 2 章 |
| 4 | 第 3 章 |
| 5 | 第 4 章 |
| 6 | 第 2 章（解析性） |
| 7 | 第 3 章（围道积分）、第 5 章（留数） |
| 8 | 第 5 章（留数）、第 7 章（傅里叶） |
| 9 | 多元微积分、向量代数 |
| 10 | 第 2 章（调和函数）、第 6 章（保角映射）、第 9 章 |
