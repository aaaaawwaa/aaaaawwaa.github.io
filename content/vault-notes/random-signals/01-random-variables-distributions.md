---
title: "随机变量与概率分布"
tags:
- 随机信号处理
- 01-数学预备知识
- 概率分布
- 随机变量函数
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

# 随机变量与概率分布

> [!abstract] 这一节在讲什么
> 随机变量把"事件"翻译成"数"，分布则回答"这个数取各值有多大概率"。本节统一 CDF、PDF、PMF 三种描述，列出通信中最常用的七种分布，并给出求随机变量函数分布的两条路径：分布函数法与雅可比法。
> 核心结论：PDF 的高度不是概率，只有积分才是概率；单调变换下密度按导数绝对值伸缩，非单调时必须按分支求和。
> 用途：噪声幅度、衰落包络、判决统计量的分布，全部从这张分布表出发。

## 一、随机变量与分布函数

> [!info] 定义 2.1 累积分布函数
> 随机变量 $X$ 的**累积分布函数**（CDF）定义为
> $$F_X(x)=P(X\le x),\qquad -\infty<x<\infty$$

CDF 有三条判别性质，也是做题时验证"某个函数能不能当 CDF"的标准：

| 性质 | 内容 | 直观 |
| --- | --- | --- |
| 单调不减 | $x_1<x_2\Rightarrow F_X(x_1)\le F_X(x_2)$ | 累积只会增加 |
| 右连续 | $F_X(x^{+})=F_X(x)$ | 跳跃点对应离散质量 |
| 端点 | $F_X(-\infty)=0,\ F_X(+\infty)=1$ | 总概率为 1 |

> [!tip] CDF 是"万能描述"
> 离散型、连续型、混合型都能用 CDF 统一描述，而 PDF 只对连续型（且绝对连续）存在。做严格推导时先用 CDF，最后再求导得密度，可以避免"除以零"之类的漏洞。

## 二、PMF 与 PDF

> [!info] 定义 2.2 概率质量函数与概率密度函数
> **离散型**：若 $X$ 取值于可数集 $\{x_k\}$，称 $p_X(x_k)=P(X=x_k)$ 为**概率质量函数**（PMF），满足 $p_X(x_k)\ge0$、$\sum_k p_X(x_k)=1$。
> **连续型**：若存在非负函数 $f_X(x)$ 使 $F_X(x)=\int_{-\infty}^{x}f_X(t)\,\mathrm{d}t$，称 $f_X$ 为**概率密度函数**（PDF），满足 $f_X(x)\ge0$、$\int_{-\infty}^{\infty}f_X(x)\,\mathrm{d}x=1$。

由定义立即得到两条最常用的换算：

$$P(a<X\le b)=F_X(b)-F_X(a)=\int_a^b f_X(x)\,\mathrm{d}x,\qquad f_X(x)=\frac{\mathrm{d}F_X(x)}{\mathrm{d}x}$$

> [!warning] 密度可以大于 1
> $f_X(x)$ 是"单位长度上的概率"，量纲是 $1/x$，完全可以大于 1。例如 $X\sim U(0,0.5)$ 时 $f_X(x)=2$。
> 另外，连续型随机变量在单点的概率为 0，所以 $P(a<X\le b)=P(a\le X\le b)$，端点开闭不影响结果。

## 三、常见分布一览

| 分布 | 密度或质量函数 | 均值 | 方差 | 典型场景 |
| --- | --- | --- | --- | --- |
| 均匀 $U(a,b)$ | $\dfrac{1}{b-a}$ | $\dfrac{a+b}{2}$ | $\dfrac{(b-a)^2}{12}$ | 量化误差、相位均匀 |
| 指数 $\mathrm{Exp}(\lambda)$ | $\lambda e^{-\lambda x},\ x\ge0$ | $\dfrac{1}{\lambda}$ | $\dfrac{1}{\lambda^2}$ | 到达间隔、衰落功率 |
| 高斯 $N(\mu,\sigma^2)$ | $\dfrac{1}{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}$ | $\mu$ | $\sigma^2$ | 热噪声、AWGN |
| 瑞利 $\mathrm{Rayleigh}(\sigma)$ | $\dfrac{x}{\sigma^2}e^{-\frac{x^2}{2\sigma^2}},\ x\ge0$ | $\sigma\sqrt{\dfrac{\pi}{2}}$ | $\left(2-\dfrac{\pi}{2}\right)\sigma^2$ | 无直射径的包络 |
| 莱斯 $\mathrm{Rice}(\nu,\sigma)$ | $\dfrac{x}{\sigma^2}e^{-\frac{x^2+\nu^2}{2\sigma^2}}I_0\!\left(\dfrac{x\nu}{\sigma^2}\right)$ | 无简洁闭式 | 随 $K=\nu^2/(2\sigma^2)$ 减小 | 含直射径的包络 |
| 卡方 $\chi^2(k)$ | $\dfrac{x^{k/2-1}e^{-x/2}}{2^{k/2}\Gamma(k/2)},\ x\ge0$ | $k$ | $2k$ | 高斯平方和、能量检测 |
| 学生 $t(\nu)$ | $\dfrac{\Gamma\!\left(\frac{\nu+1}{2}\right)}{\sqrt{\nu\pi}\,\Gamma\!\left(\frac{\nu}{2}\right)}\left(1+\dfrac{x^2}{\nu}\right)^{-\frac{\nu+1}{2}}$ | $0$（$\nu>1$） | $\dfrac{\nu}{\nu-2}$（$\nu>2$） | 小样本均值、稳健统计 |

> [!tip] 三组必须记住的关系
> 1. 两个独立标准高斯变量的平方和服从 $\chi^2(2)$，而 $\chi^2(2)$ 就是参数为 $1/2$ 的指数分布；
> 2. 瑞利是莱斯在 $\nu=0$（无直射径）时的特例；
> 3. 学生 $t$ 在 $\nu\to\infty$ 时趋于标准高斯，$\nu$ 小则尾部更厚，适合建模含粗差的样本。

## 四、随机变量函数的分布

设 $Y=g(X)$。最稳妥的做法是先写 CDF：

$$F_Y(y)=P(g(X)\le y)=P\big(X\in g^{-1}((-\infty,y])\big)$$

若 $g$ 严格单调、可导且反函数 $x=g^{-1}(y)$ 存在，则对 $y$ 求导得

$$f_Y(y)=f_X\big(g^{-1}(y)\big)\left|\frac{\mathrm{d}}{\mathrm{d}y}g^{-1}(y)\right|$$

若 $\mathbf{Y}=g(\mathbf{X})$ 是向量映射，把导数换成雅可比行列式，密度乘以 $\lvert\det\mathbf{J}\rvert$；二维情形在 [[vault-notes/random-signals/02-joint-conditional-distributions]] 中展开。

> [!warning] 非单调时必须分分支
> 令 $Y=X^2$，$X\sim N(0,1)$。此时 $g$ 在正负半轴各有一支，直接套公式会漏掉一半概率。正确做法是
> $$f_Y(y)=\frac{1}{2\sqrt{y}}\left[f_X(\sqrt{y})+f_X(-\sqrt{y})\right],\qquad y>0$$
> 得到自由度为 1 的卡方分布。判据只有一条：**同一个 $y$ 有几个原像，就要加几项**。

> [!example] 线性变换
> 若 $Y=aX+b$，$a\ne0$，则 $f_Y(y)=\frac{1}{\lvert a\rvert}f_X\!\left(\frac{y-b}{a}\right)$。
> 高斯变量经线性变换仍是高斯，均值变为 $a\mu+b$、方差变为 $a^2\sigma^2$，这条性质是后面"高斯向量线性变换仍高斯"的一维版本。

## 五、通信中的瑞利与莱斯

在窄带多径信道中，接收信号的同相与正交分量可写成大量独立散射分量之和。由中心极限定理，$I$ 与 $Q$ 近似为独立零均值高斯变量，于是包络 $R=\sqrt{I^2+Q^2}$ 服从瑞利分布，相位在 $[0,2\pi)$ 上均匀。

| 场景 | 包络分布 | 关键参数 | 工程含义 |
| --- | --- | --- | --- |
| 无直射径（NLOS） | 瑞利 | $\sigma^2$ 为每支路功率 | 深衰落频繁，需分集 |
| 有直射径（LOS） | 莱斯 | $K=\nu^2/(2\sigma^2)$ | $K$ 大则接近高斯，链路更稳 |
| 直射径极强 | 高斯近似 | $K\to\infty$ | 退化为 AWGN |

> [!tip] 为什么功率服从指数分布
> 瑞利包络的平方 $R^2$ 服从均值为 $2\sigma^2$ 的指数分布，因此瞬时功率的深衰落概率可以直接用 $P(R^2<\gamma)=1-e^{-\gamma/(2\sigma^2)}$ 计算。这也是 [[vault-notes/communication/04-channel]] 中中断概率公式的来源。

## 六、作业题解析

> [!note] 题目来源
> 本节收录课程作业第 1 组（概率论 1–13 题）中与本篇相关的题目，原始截图见 作业截图。解析按“读题 → 判据 → 推导 → 易错点”展开，记号与正文一致。

### 题 4 · 两个骰子点数之和的分布律与分布函数

> [!example] 题目
> 同时投掷两个骰子，求它们的点数之和的分布律和分布函数。

**解**：

设两骰点数分别为 $X_1,X_2$，和 $S=X_1+X_2$。有序结果 $(X_1,X_2)$ 共有 $6\times6=36$ 个且等可能，故 $S$ 取 $2,3,\dots,12$。使 $S=k$ 的有序对数目随 $k$ 先增后减：

$$n(k)=\begin{cases}k-1,&k=2,3,\dots,7\\ 13-k,&k=8,9,\dots,12\end{cases}$$

于是分布律为

$$P(S=k)=\begin{cases}\dfrac{k-1}{36},&k=2,3,\dots,7\\ \dfrac{13-k}{36},&k=8,9,\dots,12\\ 0,&\text{其他}\end{cases}$$

| $k$ | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $P(S=k)$ | $1/36$ | $2/36$ | $3/36$ | $4/36$ | $5/36$ | $6/36$ | $5/36$ | $4/36$ | $3/36$ | $2/36$ | $1/36$ |

分布函数按 $F_S(s)=P(S\le s)$ 逐段累加：$s<2$ 时为 0；$2\le s<7$ 时累加左半支；$7\le s<12$ 时用 1 减去右半支的尾部；$s\ge12$ 时为 1。因 $S$ 只取整数，段内取 $\lfloor s\rfloor$：

$$F_S(s)=\begin{cases}0,&s<2\\ \dfrac{\lfloor s\rfloor(\lfloor s\rfloor-1)}{72},&2\le s<7\\ 1-\dfrac{(12-\lfloor s\rfloor)(13-\lfloor s\rfloor)}{72},&7\le s<12\\ 1,&s\ge12\end{cases}$$

它是右连续的阶梯函数，在每个整数点跳跃 $P(S=k)$，跳高与分布律一一对应。抽查几个点：

$$F_S(2)=\frac{1}{36},\qquad F_S(7)=\frac{1+2+\cdots+6}{36}=\frac{21}{36}=\frac{7}{12},\qquad F_S(11)=\frac{35}{36}$$

**答**：分布律为 $P(S=k)=\dfrac{k-1}{36}$（$k=2,\dots,7$）、$P(S=k)=\dfrac{13-k}{36}$（$k=8,\dots,12$），数值见表；分布函数为上式的阶梯函数，$F_S(7)=\dfrac{7}{12}$、$F_S(12)=1$。

> [!warning] 易错点
> - 把两个骰子视为不可区分、用组合数数结果：样本空间只有用**有序对**才有 36 个等可能结果，否则各和不等可能。
> - 分布函数误写成连续函数：$S$ 是离散型，$F_S$ 是阶梯函数，段内水平、整数点跳跃，不能求导当密度。
> - 分段式漏掉 $s\ge12$ 的独立分支：右侧公式对 $s>12$ 会重新变小，必须在 12 处截断。
> - 表格只列到 11 或漏掉两端：$\sum_k n(k)=36$ 才保证归一化，且分布关于 $k=7$ 对称，可用这两条自查。

### 题 5 · 高斯分数用 erf 表示五级成绩概率

> [!example] 题目
> 设某次考试的分数 $X$ 近似服从均值为 60、标准差为 5 的高斯分布，即
> $$f(x)=\frac{1}{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}\bigg|_{\mu=60,\ \sigma=5}=\frac{1}{5\sqrt{2\pi}}e^{-\frac{(x-60)^2}{50}}$$
> 请用误差函数 $\operatorname{erf}(x)=\dfrac{2}{\sqrt{\pi}}\int_0^x e^{-t^2}\,\mathrm{d}t$ 表示成绩等级 A（$X\ge85$）、B（$75\le X<85$）、C（$65\le X<75$）、D（$60\le X<65$）、F（$X<60$）的概率。
> 提示：标准正态分布的累积分布函数
> $$\Phi(x)=\int_{-\infty}^{x}\frac{1}{\sqrt{2\pi}}e^{-t^2/2}\,\mathrm{d}t=\frac12+\frac12\operatorname{erf}\!\left(\frac{x}{\sqrt2}\right)$$

**解**：

标准化。令 $Z=\dfrac{X-60}{5}\sim N(0,1)$，则 $P(X\le x)=\Phi\!\left(\dfrac{x-60}{5}\right)$。四个分界点 $60,65,75,85$ 对应的标准分依次为 $0,1,3,5$，所以各等级概率为

$$P(A)=1-\Phi(5),\qquad P(B)=\Phi(5)-\Phi(3),\qquad P(C)=\Phi(3)-\Phi(1)$$

$$P(D)=\Phi(1)-\Phi(0),\qquad P(F)=\Phi(0)$$

把 $\Phi(x)=\frac12+\frac12\operatorname{erf}(x/\sqrt2)$ 逐项代入，相邻项相减时常数 $\frac12$ 抵消：

$$P(A)=\frac12-\frac12\operatorname{erf}\!\left(\frac{5}{\sqrt2}\right)$$

$$P(B)=\frac12\left[\operatorname{erf}\!\left(\frac{5}{\sqrt2}\right)-\operatorname{erf}\!\left(\frac{3}{\sqrt2}\right)\right]$$

$$P(C)=\frac12\left[\operatorname{erf}\!\left(\frac{3}{\sqrt2}\right)-\operatorname{erf}\!\left(\frac{1}{\sqrt2}\right)\right]$$

$$P(D)=\frac12\operatorname{erf}\!\left(\frac{1}{\sqrt2}\right),\qquad P(F)=\frac12+\frac12\operatorname{erf}(0)=\frac12$$

代入数值 $\Phi(5)\approx0.9999997$、$\Phi(3)\approx0.9986501$、$\Phi(1)\approx0.8413447$、$\Phi(0)=0.5$，得

$$P(A)\approx2.87\times10^{-7},\quad P(B)\approx1.35\times10^{-3},\quad P(C)\approx0.1573,\quad P(D)\approx0.3413,\quad P(F)=0.5$$

五级概率之和为 1，归一化自检通过。

**答**：erf 形式见上；数值上 $P(A)\approx2.87\times10^{-7}$、$P(B)\approx1.35\times10^{-3}$、$P(C)\approx0.1573$、$P(D)\approx0.3413$、$P(F)=0.5$。

> [!warning] 易错点
> - 忘记除以标准差：标准分是 $(x-60)/5$，不是 $x-60$，也不是除以方差 25。
> - A 级是右尾，$P(A)=1-\Phi(5)$；写成 $\Phi(5)$ 会得到接近 1 的荒谬结果。
> - 化成 erf 时 $\frac12$ 只保留一次：$P(B)=\frac12[\operatorname{erf}(5/\sqrt2)-\operatorname{erf}(3/\sqrt2)]$，不是在两项上各配一个 $\frac12$。
> - 概率大小与区间宽度不成正比：A 级区间最宽但概率最小，D 级宽度只有 C 级的一半、概率却更大，因为密度在均值附近最高。

### 题 8 · 均匀变量的对数变换：指数与瑞利密度

> [!example] 题目
> 设随机变量 $X\sim U(0,1)$，试求 $Y=-\ln X$、$Z=2\sqrt{-\ln X}$ 的概率密度函数。

**解**：

先用分布函数法求 $Y$。$X\in(0,1)$ 故 $Y=-\ln X>0$，当 $y\le0$ 时 $F_Y(y)=0$；当 $y>0$ 时，利用 $\ln$ 单调递增与 $P(X\ge a)=1-a$（$0\le a\le1$）：

$$F_Y(y)=P(-\ln X\le y)=P(\ln X\ge-y)=P(X\ge e^{-y})=1-e^{-y}$$

求导得

$$f_Y(y)=\frac{\mathrm{d}}{\mathrm{d}y}\left(1-e^{-y}\right)=e^{-y},\qquad y>0$$

即 $Y\sim\mathrm{Exp}(1)$。

再求 $Z=2\sqrt{-\ln X}=2\sqrt{Y}$。当 $z\le0$ 时 $F_Z(z)=0$；当 $z>0$ 时

$$F_Z(z)=P(2\sqrt{Y}\le z)=P\!\left(Y\le\frac{z^2}{4}\right)=1-e^{-z^2/4}$$

求导得

$$f_Z(z)=\frac{\mathrm{d}}{\mathrm{d}z}\left(1-e^{-z^2/4}\right)=\frac{z}{2}e^{-z^2/4},\qquad z>0$$

对照本节的瑞利密度 $\dfrac{x}{\sigma^2}e^{-\frac{x^2}{2\sigma^2}}$，取 $\sigma^2=2$ 即 $\sigma=\sqrt2$ 得同一表达式，故 $Z\sim\mathrm{Rayleigh}(\sqrt2)$。

用雅可比法复核：$Y=-\ln X$ 严格单调，反函数 $x=e^{-y}$，$\left|\mathrm{d}x/\mathrm{d}y\right|=e^{-y}$，且 $f_X(x)=1$（$0<x<1$），故 $f_Y(y)=e^{-y}$；再由 $y=z^2/4$、$\left|\mathrm{d}y/\mathrm{d}z\right|=z/2$ 得 $f_Z(z)=e^{-z^2/4}\cdot\dfrac{z}{2}$，与分布函数法一致。

这正是 [[vault-notes/math/probability/appendix-random-variable-functions]] 中逆变换法表的两个特例：$- \ln U$ 生成指数随机数，$\sigma\sqrt{-2\ln U}$ 生成瑞利随机数（取 $\sigma=\sqrt2$ 即得 $Z$）。

**答**：$f_Y(y)=e^{-y}$（$y>0$），即 $\mathrm{Exp}(1)$；$f_Z(z)=\dfrac{z}{2}e^{-z^2/4}$（$z>0$），即 $\mathrm{Rayleigh}(\sqrt2)$（尺度参数 $\sigma^2=2$）。

> [!warning] 易错点
> - 支撑集必须写：$y\le0$、$z\le0$ 处密度为 0，漏掉会把积分区间放大到 $(-\infty,\infty)$，归一化立刻失败。
> - 解不等式方向：$-\ln X\le y\Leftrightarrow X\ge e^{-y}$，两端不等号不要搞反；可用 $P(X\le e^{-y})=e^{-y}$ 反向验证。
> - $Z$ 不是指数分布也不是高斯分布：它由 $Y$ 开平方得到，是瑞利分布；自检 $E[Z^2]=4E[Y]=4$，与瑞利 $\sigma^2=2$ 的 $2\sigma^2=4$ 吻合。
> - 雅可比法别漏绝对值。本题变换单调，符号问题不明显；换成 $Y=X^2$ 之类的非单调变换时就会漏掉分支。

## 关联

- 上一节：[[vault-notes/random-signals/01-probability-basics]]
- 下一节：[[vault-notes/random-signals/01-conditional-probability-bayes]]
- 导航与记号：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/03-random-variables-distributions]]（分布函数与常见分布的完整推导）、[[vault-notes/math/probability/appendix-random-variable-functions]]（用均匀随机数生成任意分布）、[[vault-notes/communication/04-channel]]（瑞利/莱斯衰落的物理来源）
