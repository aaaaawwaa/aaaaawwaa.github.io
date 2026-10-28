---
title: "数学期望与方差"
tags:
- 随机信号处理
- 02-随机变量与随机向量
- 数学期望
- 方差
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

# 数学期望与方差

> [!abstract] 这一节在讲什么
> 分布完整但太啰嗦，工程上最常用的两个概括量是"平均在哪里"和"波动有多大"。本节给出期望与方差的定义、运算性质、条件版本，以及全期望公式、全方差公式、切比雪夫不等式与 Jensen 不等式。
> 核心结论：期望是线性算子，加法永远可以拆；方差不是线性的，缩放要平方、相加要加协方差；全方差公式把总波动分解为"组内波动"与"组间波动"。
> 用途：噪声功率、量化误差、估计量的偏差与方差、信噪比，全部由这两个量定义。

## 一、期望的定义与性质

> [!info] 定义 6.1 数学期望
> 离散型 $P(X=x_k)=p_k$：若 $\sum_k\lvert x_k\rvert p_k<\infty$，则 $E[X]=\sum_k x_kp_k$。
> 连续型密度 $f_X(x)$：若 $\int_{-\infty}^{\infty}\lvert x\rvert f_X(x)\,\mathrm{d}x<\infty$，则
> $$
> E[X]=\int_{-\infty}^{\infty}xf_X(x)\,\mathrm{d}x
> $$
> 期望存在要求绝对收敛，柯西分布的期望就不存在。

| 性质 | 表达式 | 条件 |
| --- | --- | --- |
| 常数与齐次 | $E[c]=c$，$E[aX]=aE[X]$ | 无条件 |
| 可加 | $E[X+Y]=E[X]+E[Y]$ | 无条件，不要求独立 |
| 相乘 | $E[XY]=E[X]E[Y]$ | 独立或不相关均可 |
| 函数的期望 | $E[g(X)]=\int g(x)f_X(x)\,\mathrm{d}x$ | 无需先求 $g(X)$ 的分布 |
| 指示变量 | $E[I_A]=P(A)$ | 无条件 |

> [!warning] 可加与可乘的地位不对等
> 期望的加法对任意随机变量成立，乘法却需要独立。一般情况应写成
> $$
> E[XY]=E[X]E[Y]+\mathrm{Cov}(X,Y)
> $$
> 很多"先乘再平均"的推导错误，根源都是默认了独立性却没验证。

> [!tip] 指示变量是最省事的工具
> 把"误码个数"写成 $N=\sum_i I_{A_i}$，则 $E[N]=\sum_iP(A_i)$，完全不需要独立性；若各次试验独立，方差也可逐项相加。

## 二、条件期望与全期望公式

> [!info] 定义 6.2 条件期望
> 在 $Y=y$ 的条件下，$X$ 的条件期望为
> $$
> E[X\mid Y=y]=\int_{-\infty}^{\infty}x\,f_{X\mid Y}(x\mid y)\,\mathrm{d}x
> $$
> 把 $y$ 换成 $Y$，得到随机变量 $E[X\mid Y]$，它是 $Y$ 的函数。

**全期望公式** $E[X]=E\big[E[X\mid Y]\big]$ 的直观是"先分层求平均，再按各层概率加权"。另有两条常用性质：

$$
E\big[g(Y)X\mid Y\big]=g(Y)E[X\mid Y],\qquad E\big[E[X\mid Y,Z]\mid Y\big]=E[X\mid Y]
$$

后一条称为**塔性质**，是卡尔曼滤波"先预测再更新"能够递归进行的依据。

## 三、方差与全方差公式

> [!info] 定义 6.3 方差
> $$
> \mathrm{Var}(X)=E\left[(X-\mu_X)^2\right]=E[X^2]-\mu_X^2
> $$
> $\sigma_X=\sqrt{\mathrm{Var}(X)}$ 为标准差，与 $X$ 同量纲。

| 性质 | 表达式 | 备注 |
| --- | --- | --- |
| 常数与平移 | $\mathrm{Var}(c)=0$，$\mathrm{Var}(X+c)=\mathrm{Var}(X)$ | 平移不改变波动 |
| 缩放 | $\mathrm{Var}(aX)=a^2\mathrm{Var}(X)$ | 系数要平方 |
| 相加 | $\mathrm{Var}(X+Y)=\mathrm{Var}(X)+\mathrm{Var}(Y)+2\mathrm{Cov}(X,Y)$ | 独立时去掉协方差项 |

**全方差公式**：

$$
\mathrm{Var}(X)=E\big[\mathrm{Var}(X\mid Y)\big]+\mathrm{Var}\big(E[X\mid Y]\big)
$$

右边第一项是"层内波动的平均"，第二项是"层间均值的波动"。若 $Y$ 能解释 $X$ 的全部变化，第二项等于总方差，第一项为 0；若 $Y$ 与 $X$ 无关，则反过来。

> [!warning] 方差相加的常见错误
> $\mathrm{Var}(X-Y)=\mathrm{Var}(X)+\mathrm{Var}(Y)-2\mathrm{Cov}(X,Y)$，不是"方差相减"。
> 对独立同分布变量，$\mathrm{Var}(X-Y)=2\sigma^2$；若 $X,Y$ 完全正相关，差值方差可以是 0。差分测量能抑制共模噪声，靠的就是这一项负协方差。

## 四、矩、切比雪夫与 Jensen

> [!info] 定义 6.4 矩
> $E[X^k]$ 为 $k$ 阶**原点矩**，$E[(X-\mu_X)^k]$ 为 $k$ 阶**中心矩**。二阶中心矩是方差，三阶标准化中心矩为偏度，四阶为峰度。

**切比雪夫不等式**：对任意 $\varepsilon>0$

$$
P\big(\lvert X-\mu_X\rvert\ge\varepsilon\big)\le\frac{\sigma_X^2}{\varepsilon^2}
$$

它不依赖具体分布，只给出保守上界，常用于证明大数定律。若 $g$ 为凸函数，还有 **Jensen 不等式**：

$$
g\big(E[X]\big)\le E\big[g(X)\big]
$$

> [!tip] 三个不等式的分工
> 切比雪夫回答"偏离均值超过 $\varepsilon$ 的概率最多多大"；Jensen 回答"凸变换后均值往哪边偏"；马尔可夫不等式是切比雪夫的前身，只要求非负。
> 注意 $E[1/X]\ge1/E[X]$（$X>0$）就是 Jensen 的应用，计算信噪比倒数时不要写成 $1/E[X]$。

## 五、两个算例

> [!example] 二项分布（离散）
> 设 $X\sim B(n,p)$，把 $X$ 写成 $n$ 个独立指示变量之和 $X=\sum_{i=1}^{n}I_i$，$P(I_i=1)=p$。由 $I_i^2=I_i$ 得 $E[I_i^2]=p$，于是
> $$
> E[X]=np,\qquad \mathrm{Var}(X)=np(1-p)
> $$
> 期望用了可加性，方差用了独立性；两个性质缺一不可。

> [!example] 均匀量化误差（连续）
> 量化步长为 $\Delta$ 时，误差 $E_q$ 在 $[-\Delta/2,\Delta/2]$ 上近似均匀，于是 $\mu_{E_q}=0$、$\sigma_{E_q}^2=\Delta^2/12$。
> 若满量程为 $2A$、位数为 $b$，则 $\Delta=2A/2^{b}$；对幅度为 $A$ 的正弦信号，$\mathrm{SQNR}=6.02b+1.76$ dB，每增加 1 位改善约 6 dB。

## 六、作业题解析

> [!note] 题目来源
> 本节收录课程作业第 1 组（概率论 1–13 题）中与本篇相关的题目，原始截图见 作业截图。解析按“读题 → 判据 → 推导 → 易错点”展开，记号与正文一致。

### 题 10 · 分层均匀分布的条件期望与全期望

> [!example] 题目
> 已知随机变量 $X$ 在区间 $[0,a]$ 上均匀分布，随机变量 $Y$ 在区间 $[X,a]$ 上均匀分布，试求：
> （1）$E(Y\mid X=x)$，$0<x<a$；
> （2）$E(Y)$。

**解**：

（1）先在“给定 $X=x$”这一层里求条件期望。$Y$ 在 $[x,a]$ 上均匀，条件密度为

$$
f_{Y\mid X}(y\mid x)=\frac{1}{a-x},\qquad x\le y\le a
$$

于是

$$
E(Y\mid X=x)=\int_{x}^{a}\frac{y}{a-x}\,\mathrm{d}y=\frac{1}{a-x}\cdot\frac{a^{2}-x^{2}}{2}=\frac{a+x}{2}
$$

这里 $x$ 只是参数，区间 $[x,a]$ 的中点是 $(x+a)/2$，与“均匀分布的期望等于区间中点”一致。

（2）把 $x$ 换回随机变量 $X$，得到随机变量

$$
E(Y\mid X)=\frac{X+a}{2}
$$

再由全期望公式与 $E(X)=a/2$：

$$
E(Y)=E\big[E(Y\mid X)\big]=E\!\left[\frac{X+a}{2}\right]=\frac{a/2+a}{2}=\frac{3a}{4}
$$

用联合密度复核。$X\sim U(0,a)$ 与条件密度相乘，得（$0<x<a$，$x<y<a$）

$$
f_{XY}(x,y)=f_X(x)f_{Y\mid X}(y\mid x)=\frac{1}{a(a-x)}
$$

先验证归一化：$\int_{0}^{a}\!\!\int_{x}^{a}\frac{1}{a(a-x)}\,\mathrm{d}y\,\mathrm{d}x=\int_{0}^{a}\frac{1}{a}\,\mathrm{d}x=1$。再算期望：

$$
E(Y)=\int_{0}^{a}\!\!\int_{x}^{a}\frac{y}{a(a-x)}\,\mathrm{d}y\,\mathrm{d}x=\int_{0}^{a}\frac{a^{2}-x^{2}}{2a(a-x)}\,\mathrm{d}x=\int_{0}^{a}\frac{a+x}{2a}\,\mathrm{d}x=\frac{3a}{4}
$$

两种途径结果一致。以 $a=1$ 为例，$E(Y)=0.75$，比 $[0,1]$ 的中点 $0.5$ 大：因为 $Y\ge X$，其下界被 $X$ 抬高了。

**答**：（1）$E(Y\mid X=x)=\dfrac{a+x}{2}$（$0<x<a$）；（2）$E(Y)=\dfrac{3a}{4}$。

> [!warning] 易错点
> - 第（2）问只算到 $(X+a)/2$ 就停下，把随机变量当成了数值：那只是条件期望，还要对 $X$ 再取一次期望。
> - 条件密度 $1/(a-x)$ 的积分区间是 $[x,a]$，不要写成 $[0,a]$，否则算出的条件期望不是 $(x+a)/2$。
> - 边界 $x\to a$ 时 $a-x\to0$，条件密度发散，但 $P(X=a)=0$，不影响期望；写条件密度时应声明 $0<x<a$。
> - 若误按独立处理、把联合密度写成 $f_Xf_Y$，会得到错误的密度；本题 $Y$ 的分布依赖 $X$，两者不独立。

### 题 11 · 全期望公式

> [!example] 题目
> 设 $X$、$Y$ 是两个随机变量，试证：
> $$
> E(Y)=E\big[E(Y\mid X)\big]
> $$

**解**：

先看清右边两层期望的含义：内层 $E(Y\mid X)$ 是把 $x$ 换回随机变量后得到的**随机变量**，外层 $E[\cdot]$ 是对 $X$ 的分布取期望。证明只需把两层期望都写成积分，再用 $f_{XY}=f_Xf_{Y\mid X}$ 把两个积分合并。

连续情形：设 $f_X(x)>0$，由条件密度 $f_{Y\mid X}(y\mid x)=f_{XY}(x,y)/f_X(x)$，有

$$
E(Y\mid X=x)=\int_{-\infty}^{\infty}y\,f_{Y\mid X}(y\mid x)\,\mathrm{d}y=\frac{1}{f_X(x)}\int_{-\infty}^{\infty}y\,f_{XY}(x,y)\,\mathrm{d}y
$$

再对 $X$ 的分布取期望：

$$
E\big[E(Y\mid X)\big]=\int_{-\infty}^{\infty}\left[\int_{-\infty}^{\infty}y\,f_{Y\mid X}(y\mid x)\,\mathrm{d}y\right]f_X(x)\,\mathrm{d}x
$$

把 $f_{Y\mid X}(y\mid x)f_X(x)=f_{XY}(x,y)$ 代入，并交换积分次序：

$$
E\big[E(Y\mid X)\big]=\int_{-\infty}^{\infty}\!\!\int_{-\infty}^{\infty}y\,f_{XY}(x,y)\,\mathrm{d}y\,\mathrm{d}x=\int_{-\infty}^{\infty}y\left[\int_{-\infty}^{\infty}f_{XY}(x,y)\,\mathrm{d}x\right]\mathrm{d}y
$$

方括号内正是边缘密度 $f_Y(y)$，所以

$$
E\big[E(Y\mid X)\big]=\int_{-\infty}^{\infty}y\,f_Y(y)\,\mathrm{d}y=E(Y)
$$

交换次序的依据是 Fubini–Tonelli 定理：只要 $E\lvert Y\rvert<\infty$，被积函数绝对可积，积分次序可以互换。

离散情形完全平行。设 $P(X=x_i)>0$、$P(Y=y_j\mid X=x_i)=p_{XY}(x_i,y_j)/p_X(x_i)$，则

$$
E\big[E(Y\mid X)\big]=\sum_i p_X(x_i)\sum_j y_j\,P(Y=y_j\mid X=x_i)=\sum_j y_j\sum_i p_{XY}(x_i,y_j)=\sum_j y_jp_Y(y_j)=E(Y)
$$

最后一步用了全概率公式 $p_Y(y_j)=\sum_i p_{XY}(x_i,y_j)$。

**答**：得证。连续与离散情形都有 $E(Y)=E[E(Y\mid X)]$，等价写法是

$$
E(Y)=\int_{-\infty}^{\infty}E(Y\mid X=x)\,f_X(x)\,\mathrm{d}x
$$

直观上就是“按 $X$ 分组，先组内平均，再按各组权重平均”，正是正文 §二全期望公式的直观。它也是条件期望作为预测器的起点：残差 $Y-E[Y\mid X]$ 的条件均值为零，因而与 $X$ 的任何函数正交（特别地，与 $X$ 不相关）。

> [!warning] 易错点
> - 把 $E[E(Y\mid X)]$ 理解成“$E(Y\mid X)$ 再按 $Y$ 的分布平均”：外层必须按 $X$ 的分布加权。
> - 内层写成 $E(Y\mid X=x)$ 后忘了把 $x$ 换回 $X$，得到的不是随机变量，外层期望无从谈起。
> - 交换积分次序不是无条件成立的，需要 $E\lvert Y\rvert<\infty$；答题时补一句 Fubini 条件更严谨。
> - 用条件密度证明时默认了“对每个 $x$ 条件密度存在且 $f_X(x)>0$”；一般情形改用条件期望的定义证明，结论不变。
> - 公式对 $X$、$Y$ 是否独立没有要求，不要额外假设独立。

## 关联

- 上一节：[[vault-notes/random-signals/01-fourier-and-lti]]
- 下一节：[[vault-notes/random-signals/02-covariance-correlation]]
- 导航与记号：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/05-numerical-characteristics]]（期望、方差、协方差的教材推导）、[[vault-notes/math/probability/06-law-of-large-numbers-clt]]（切比雪夫与大数定律）、[[vault-notes/math/probability/08-parameter-estimation]]（偏差、方差与均方误差）
