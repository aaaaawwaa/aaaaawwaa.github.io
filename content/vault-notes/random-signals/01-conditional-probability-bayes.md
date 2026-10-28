---
title: "条件概率与贝叶斯公式"
tags:
- 随机信号处理
- 01-数学预备知识
- 条件概率
- 贝叶斯
type: concept
subjects:
- 随机信号处理
- 概率论与数理统计
domains:
- 数学基础
- 随机信号
status: learning
aliases: []
prerequisites: []
related: []
---

# 条件概率与贝叶斯公式

> [!abstract] 这一节在讲什么
> 条件概率回答"已知某件事发生后，另一件事的概率怎么变"。本节从定义与乘法公式出发，推出全概率公式与贝叶斯公式，再把条件化推广到分布与期望，最后用 MAP 与 ML 的差别说明它在检测理论中的位置。
> 核心结论：贝叶斯公式 = 似然 × 先验 ÷ 证据，它把"由因推果"翻转为"由果推因"；先验不等时，MAP 判决门限会被先验拉偏，ML 只看似然。
> 用途：信道均衡、符号判决、疾病诊断、参数估计的贝叶斯解释，都是这一页的直接应用。

## 一、条件概率与乘法公式

> [!info] 定义 3.1 条件概率
> 设 $P(B)>0$，在事件 $B$ 发生的条件下，事件 $A$ 的**条件概率**定义为
> $$
> P(A\mid B)=\frac{P(AB)}{P(B)}
> $$

由定义直接得到**乘法公式**与链式法则：

$$
P(AB)=P(A\mid B)P(B)=P(B\mid A)P(A)
$$

$$
P(A_1A_2\cdots A_n)=P(A_1)P(A_2\mid A_1)\cdots P(A_n\mid A_1\cdots A_{n-1})
$$

> [!warning] $P(A\mid B)$ 与 $P(B\mid A)$ 完全不同
> 二者分母不同，数值可以相差几个数量级。发病率 $0.1\%$、检测灵敏度 $99\%$、虚警率 $1\%$ 时，阳性者真正患病的概率约为
> $$
> P(\text{病}\mid\text{阳})=\frac{0.99\times0.001}{0.99\times0.001+0.01\times0.999}\approx 9\%
> $$
> 把这两个方向混为一谈，就是所谓的"检察官谬误"。工程上对应的是：接收端虚警多，不代表发射端真的发了信号。

## 二、全概率公式

> [!info] 定义 3.2 全概率公式
> 若 $A_1,\dots,A_n$ 构成样本空间的一个划分，且 $P(A_i)>0$，则对任意事件 $B$
> $$
> P(B)=\sum_{i=1}^{n}P(B\mid A_i)P(A_i)
> $$

连续情形有对应版本：若 $Y$ 的密度为 $f_Y(y)$，则 $X$ 的边缘密度可写成

$$
f_X(x)=\int_{-\infty}^{\infty}f_{X\mid Y}(x\mid y)f_Y(y)\,\mathrm{d}y
$$

> [!tip] 直觉：分情况加权
> 全概率公式就是"按原因把样本空间切块，每块内算条件概率，再按块的大小加权求和"。
> 在通信中，发送符号 $X$ 的取值天然构成一个划分，因此接收分布总是写成 $f_Y(y)=\sum_k f_{Y\mid X}(y\mid x_k)P(X=x_k)$。

## 三、贝叶斯公式：先验、似然、后验

> [!info] 定义 3.3 贝叶斯公式
> 在 $P(B)>0$、$P(A_i)>0$ 的条件下
> $$
> P(A_i\mid B)=\frac{P(B\mid A_i)P(A_i)}{\sum_{k=1}^{n}P(B\mid A_k)P(A_k)}
> $$
> 密度形式为
> $$
> f_{X\mid Y}(x\mid y)=\frac{f_{Y\mid X}(y\mid x)f_X(x)}{f_Y(y)}
> $$

四个组成部分的分工必须分清：

| 名称 | 记号 | 谁提供 | 在检测中的角色 |
| --- | --- | --- | --- |
| 先验 | $P(A_i)$ 或 $f_X(x)$ | 信源统计、历史数据 | 判决门限的偏移量 |
| 似然 | $P(B\mid A_i)$ 或 $f_{Y\mid X}(y\mid x)$ | 信道模型、噪声分布 | 匹配滤波器的形状 |
| 证据 | $P(B)$ 或 $f_Y(y)$ | 由全概率公式算出 | 归一化常数，判决时可忽略 |
| 后验 | $P(A_i\mid B)$ 或 $f_{X\mid Y}(x\mid y)$ | 贝叶斯公式 | 直接用于 MAP 判决 |

> [!warning] 分母不能省在"模型比较"里
> 做单个参数的 MAP 估计时，$f_Y(y)$ 与参数无关，可以丢掉；但比较不同**模型**（不同维数、不同先验族）时，证据项就是边际似然，丢掉它会导致模型选择偏向复杂模型。

## 四、条件分布与条件期望

> [!info] 定义 3.4 条件分布与条件期望
> 当 $f_Y(y)>0$ 时，条件密度为 $f_{X\mid Y}(x\mid y)=\dfrac{f_{XY}(x,y)}{f_Y(y)}$。
> **条件期望** $E[X\mid Y=y]$ 是用条件密度算出的均值；把 $y$ 换成随机变量 $Y$，得到随机变量 $E[X\mid Y]$。

条件期望有两条核心性质，后面估计与滤波会反复使用：

$$
E[X]=E\big[E[X\mid Y]\big],\qquad E\big[g(Y)X\mid Y\big]=g(Y)E[X\mid Y]
$$

第一条称为**全期望公式**（重期望公式），第二条称为"已知量可提出"。直观上，$E[X\mid Y]$ 是"用 $Y$ 能解释的那部分 $X$"，剩下的 $X-E[X\mid Y]$ 与 $Y$ 不相关。

> [!tip] 条件期望是最优的均方预测
> 在所有 $Y$ 的函数中，$E[X\mid Y]$ 使 $E[(X-g(Y))^2]$ 最小。这条结论把"条件期望"与"MMSE 估计"直接连了起来，是维纳滤波与卡尔曼滤波的共同出发点。

## 五、MAP 与 ML：一个检测例子

> [!info] 定义 3.5 MAP 与 ML
> **最大后验（MAP）**判决选择使后验最大的假设：
> $$
> \hat{H}=\arg\max_{H_i}P(H_i\mid y)=\arg\max_{H_i}f_{Y\mid H_i}(y\mid H_i)P(H_i)
> $$
> **最大似然（ML）**判决只最大化似然：
> $$
> \hat{H}_{\mathrm{ML}}=\arg\max_{H_i}f_{Y\mid H_i}(y\mid H_i)
> $$
> 当各假设先验相等时，MAP 退化为 ML。

| 对比项 | MAP | ML |
| --- | --- | --- |
| 使用先验 | 是 | 否 |
| 等价条件 | 先验等概时与 ML 相同 | — |
| 准则含义 | 最小错误概率 | 最"像"观测的假设 |
| 典型场景 | 信源统计已知 | 先验未知或近似均匀 |

> [!example] 双极性信号的判决门限
> 设 $H_0:X=-1$，$H_1:X=+1$，观测 $Y=X+N$，$N\sim N(0,1)$，先验 $P(H_0)=0.7$、$P(H_1)=0.3$。
> MAP 比较 $0.3f(y\mid H_1)$ 与 $0.7f(y\mid H_0)$，取对数后得到门限（$y>\gamma$ 判 $H_1$，否则判 $H_0$）
> $$
> \gamma=\frac{\sigma^2}{2}\ln\frac{P(H_0)}{P(H_1)}=\frac{1}{2}\ln\frac{0.7}{0.3}\approx0.424
> $$
> 门限从 0 向右移到 $0.424$：因为 $H_0$ 更常见，需要更强的证据才判 $H_1$。
> 若先验相等，门限回到 0，MAP 与 ML 完全一致。这条"先验拉偏门限"的结论在 [[vault-notes/math/probability/09-hypothesis-testing]] 中会以似然比检验的形式再次出现。

## 六、作业题解析

> [!note] 题目来源
> 本节收录课程作业第 1 组（概率论 1–13 题）中与本篇相关的题目，原始截图见 作业截图。解析按“读题 → 判据 → 推导 → 易错点”展开，记号与正文一致。

### 题 3 · 由条件概率求交与并的概率，并判断独立性

> [!example] 题目
> 设事件 $A$ 与 $B$ 的概率 $P(A)=0.3$，$P(B)=0.5$，且 $P(B\mid A)=0.5$。求 $P(AB)$ 和 $P(A\cup B)$，并判断这两个事件是否独立。

**解**：

第一步，用乘法公式由条件概率还原交事件的概率：

$$
P(AB)=P(B\mid A)P(A)=0.5\times0.3=0.15
$$

第二步，用加法公式求并事件，注意减去交集：

$$
P(A\cup B)=P(A)+P(B)-P(AB)=0.3+0.5-0.15=0.65
$$

第三步，判定独立性。题目给出的条件本身已经是判据：

$$
P(B\mid A)=0.5=P(B)
$$

在 $P(A)>0$ 时，$P(B\mid A)=P(B)$ 与 $P(AB)=P(A)P(B)$ 等价，故 $A$ 与 $B$ 相互独立。再用定义验算一次：

$$
P(A)P(B)=0.3\times0.5=0.15=P(AB)
$$

两个判据结论一致。顺便可得 $P(A\mid B)=P(AB)/P(B)=0.15/0.5=0.3=P(A)$，方向反过来同样独立。

**答**：$P(AB)=0.15$；$P(A\cup B)=0.65$；$A$ 与 $B$ 相互独立。

> [!warning] 易错点
> - 用 $P(A\cup B)=P(A)+P(B)=0.8$：加法公式只在互斥时退化，本题 $P(AB)=0.15>0$，两事件可以同时发生，必须减去交集。
> - 把“独立”与“互斥”混为一谈：互斥要求 $AB=\varnothing$，独立要求 $P(AB)=P(A)P(B)$；当 $P(A),P(B)>0$ 时二者不可能同时成立，参见 [[vault-notes/random-signals/01-probability-basics]] 中的警告。
> - 求 $P(AB)$ 时用错方向写成 $P(A\mid B)P(B)$：本题没有给出 $P(A\mid B)$，只能用题给的 $P(B\mid A)P(A)$。
> - 自检：补事件仍应独立，$P(A^{c}B^{c})=1-P(A\cup B)=0.35=P(A^{c})P(B^{c})=0.7\times0.5$，与结论吻合。

## 关联

- 上一节：[[vault-notes/random-signals/01-random-variables-distributions]]
- 下一节：[[vault-notes/random-signals/01-linear-algebra-matrices]]
- 导航与记号：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/02-conditional-probability-independence]]（条件概率的公理化推导）、[[vault-notes/math/probability/09-hypothesis-testing]]（似然比与判决门限）、[[vault-notes/communication/09-optimal-reception]]（MAP/ML 接收机）
