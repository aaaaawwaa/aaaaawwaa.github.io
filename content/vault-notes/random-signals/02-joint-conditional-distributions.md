---
title: "联合分布与条件分布"
tags:
- 随机信号处理
- 02-随机变量与随机向量
- 联合分布
- 条件分布
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

# 联合分布与条件分布

> [!abstract] 这一节在讲什么
> 单个随机变量的分布不足以描述两个量之间的关系：必须用联合分布。本节给出联合 CDF/PDF、边缘分布、独立性、条件分布，以及两个最常用的运算：随机变量之和的卷积公式、二维变量替换的雅可比公式。
> 核心结论：边缘分布由联合分布积分得到，但反过来不成立，联合信息在积分中被丢掉了；独立时和的分布等于各自分布的卷积；变量替换时密度要乘雅可比行列式的绝对值。
> 用途：多通道噪声建模、和信号的分布、极坐标下的瑞利包络推导、条件期望与 MMSE 估计。

## 一、联合分布与边缘分布

> [!info] 定义 8.1 联合分布
> 二维随机变量 $(X,Y)$ 的**联合 CDF** 为 $F_{XY}(x,y)=P(X\le x,\ Y\le y)$。
> 若存在非负函数 $f_{XY}$ 使 $F_{XY}(x,y)=\int_{-\infty}^{x}\int_{-\infty}^{y}f_{XY}(u,v)\,\mathrm{d}v\,\mathrm{d}u$，称 $f_{XY}$ 为**联合 PDF**，满足 $\iint f_{XY}(x,y)\,\mathrm{d}x\,\mathrm{d}y=1$。

**边缘分布**由联合分布对另一个变量积分（或求和）得到：

$$f_X(x)=\int_{-\infty}^{\infty}f_{XY}(x,y)\,\mathrm{d}y,\qquad f_Y(y)=\int_{-\infty}^{\infty}f_{XY}(x,y)\,\mathrm{d}x$$

| 对象 | 连续型 | 离散型 |
| --- | --- | --- |
| 联合 | $f_{XY}(x,y)$ | $p_{XY}(x_i,y_j)$ |
| 边缘 | 对另一个变量积分 | 对另一个变量求和 |
| 条件 | $f_{XY}/f_Y$ | $p_{XY}/p_Y$ |
| 独立判据 | $f_{XY}=f_Xf_Y$ | $p_{XY}=p_Xp_Y$ |

> [!warning] 边缘推不出联合
> 不同的联合分布可以有相同的两个边缘分布（Copula 不同）。例如 $(X,Y)$ 在单位正方形上均匀，与"只在两条对角线上均匀"的构造，边缘都是 $U(0,1)$，但联合结构完全不同。
> 所以建模时必须明确联合分布或依赖结构，不能只给两个边缘。

## 二、独立性与条件分布

> [!info] 定义 8.2 条件分布
> 当 $f_Y(y)>0$ 时，给定 $Y=y$ 下 $X$ 的**条件密度**为
> $$f_{X\mid Y}(x\mid y)=\frac{f_{XY}(x,y)}{f_Y(y)}$$
> 条件 CDF 为 $F_{X\mid Y}(x\mid y)=\int_{-\infty}^{x}f_{X\mid Y}(u\mid y)\,\mathrm{d}u$。

独立等价于联合分布可分解：

$$f_{XY}(x,y)=f_X(x)f_Y(y)\quad\Longleftrightarrow\quad F_{XY}(x,y)=F_X(x)F_Y(y)$$

> [!warning] 支撑集必须是矩形
> 判断独立时不能只看密度表达式能否拆成两个函数的乘积，还要看**支撑集**。若 $f_{XY}(x,y)=2$ 在 $0<x<y<1$ 上非零，虽然常数可拆，但支撑集是三角形，$X$ 与 $Y$ 并不独立。
> 正确做法是先写出带指示函数的完整密度，再看支撑集是否为两个区间的笛卡尔积。

条件分布把"联合信息"转成"给定一个变量后另一个变量的分布"。连续情形下 $f_{X\mid Y}(x\mid y)$ 对每个固定的 $y$ 都是合法密度，因此可以对它求期望、求方差，得到 $E[X\mid Y=y]$ 与 $\mathrm{Var}(X\mid Y=y)$。

## 三、两个随机变量之和：卷积

设 $Z=X+Y$，则

$$f_Z(z)=\int_{-\infty}^{\infty}f_{XY}(x,z-x)\,\mathrm{d}x=\int_{-\infty}^{\infty}f_{XY}(z-y,y)\,\mathrm{d}y$$

当 $X,Y$ 独立时，上式退化为**卷积**：

$$f_Z(z)=f_X(z)*f_Y(z)=\int_{-\infty}^{\infty}f_X(x)f_Y(z-x)\,\mathrm{d}x$$

> [!example] 两个独立均匀分布之和
> 设 $X,Y\sim U(0,1)$ 独立，则 $Z=X+Y$ 的密度是三角形的：
> $$f_Z(z)=\begin{cases}z,&0\le z<1\\ 2-z,&1\le z\le2\\ 0,&\text{其他}\end{cases}$$
> 两个矩形脉冲卷积得到三角脉冲，这正是"独立和的分布 = 卷积"的几何版本。

> [!tip] 用特征函数避开卷积
> 独立变量之和的特征函数等于各自特征函数之积：$\varphi_Z(\omega)=\varphi_X(\omega)\varphi_Y(\omega)$。
> 高斯、泊松、卡方等分布族在卷积下封闭，用特征函数或矩母函数验证比直接积分快得多。高斯情形下均值相加、方差相加，这条结论后面会反复使用。

## 四、二维变换与雅可比

> [!info] 定义 8.3 二维变量替换
> 设 $U=g_1(X,Y)$、$V=g_2(X,Y)$ 存在唯一的反变换 $x=h_1(u,v)$、$y=h_2(u,v)$，且偏导连续，则
> $$f_{UV}(u,v)=f_{XY}\big(h_1(u,v),h_2(u,v)\big)\left|\frac{\partial(x,y)}{\partial(u,v)}\right|$$
> 其中 $\dfrac{\partial(x,y)}{\partial(u,v)}$ 为雅可比行列式。

> [!example] 极坐标下的瑞利包络
> 设 $X,Y$ 独立同分布 $N(0,\sigma^2)$，令 $R=\sqrt{X^2+Y^2}$、$\Theta=\operatorname{atan2}(Y,X)$。反变换为 $x=r\cos\theta$、$y=r\sin\theta$，雅可比为 $r$，于是
> $$f_{R\Theta}(r,\theta)=\frac{r}{2\pi\sigma^2}e^{-\frac{r^2}{2\sigma^2}},\qquad r\ge0,\ 0\le\theta<2\pi$$
> 分解得 $f_R(r)=\dfrac{r}{\sigma^2}e^{-\frac{r^2}{2\sigma^2}}$、$f_\Theta(\theta)=\dfrac{1}{2\pi}$，且 $R$ 与 $\Theta$ 独立。
> 这一步是"两路高斯噪声合成瑞利衰落包络"的标准推导，也是 [[vault-notes/communication/04-channel]] 中模型建立的起点。

> [!warning] 雅可比别写成正变换的
> 公式里乘的是**反变换**的雅可比 $\partial(x,y)/\partial(u,v)$，不是 $\partial(u,v)/\partial(x,y)$。两者互为倒数，用错会得到 $f_{UV}$ 与 $f_{XY}$ 的倒数关系，量纲立刻不对。
> 判断办法：检查结果的积分是否为 1；若不等于 1，多半是雅可比方向或绝对值写错。

## 五、条件期望与全期望

条件期望 $E[X\mid Y=y]$ 是 $y$ 的函数，把它中的 $y$ 换回 $Y$，得到随机变量 $E[X\mid Y]$。两条最常用的性质是

$$E[X]=E\big[E[X\mid Y]\big],\qquad \mathrm{Var}(X)=E\big[\mathrm{Var}(X\mid Y)\big]+\mathrm{Var}\big(E[X\mid Y]\big)$$

> [!tip] 条件期望的三个身份
> 1. **预测器**：在所有 $Y$ 的函数中，$E[X\mid Y]$ 最小化均方误差；
> 2. **信息压缩**：它把二维联合分布压成一维函数，同时保留求均值所需的信息；
> 3. **滤波器的原型**：若联合分布是高斯的，$E[X\mid Y]$ 恰好是 $Y$ 的线性函数，这就是线性 MMSE 估计。
>
> 当 $Y$ 是随机过程的一段观测时，"条件期望 = 最优滤波"这一结论直接通向卡尔曼滤波。

## 六、作业题解析

> [!note] 题目来源
> 本节收录课程作业第 1 组（概率论 1–13 题）中与本篇相关的题目，原始截图见 作业截图。解析按“读题 → 判据 → 推导 → 易错点”展开，记号与正文一致。

### 题 6 · 条件密度是联合密度沿条件方向的重整化

> [!example] 题目
> 设有两个随机变量 $X$ 和 $Y$，它们的联合概率密度函数为 $f_{XY}(x,y)$，试证明
> $$f_{X\mid Y}(x\mid y)=\frac{f_{XY}(x,y)}{f_Y(y)}$$
> 提示：先证
> $$F_{X\mid y<Y\le y+\Delta y}(x\mid y<Y\le y+\Delta y)=\frac{\displaystyle\int_{-\infty}^{x}\!\!\int_{y}^{y+\Delta y}f_{XY}(u,v)\,\mathrm{d}v\,\mathrm{d}u}{F_Y(y+\Delta y)-F_Y(y)}$$
> 再对 $x$ 求导得
> $$f_{X\mid y<Y\le y+\Delta y}(x\mid y<Y\le y+\Delta y)=\frac{\displaystyle\int_{y}^{y+\Delta y}f_{XY}(x,v)\,\mathrm{d}v}{F_Y(y+\Delta y)-F_Y(y)}$$
> 最后令 $\Delta y\to0$。

**解**：

条件密度考察的是“$Y=y$”这一零概率事件，不能直接作商，只能先用宽度为 $\Delta y$ 的区间过渡，再取极限。设 $\Delta y>0$，记条件事件 $A=\{y<Y\le y+\Delta y\}$，则

$$P(A)=P(y<Y\le y+\Delta y)=F_Y(y+\Delta y)-F_Y(y)$$

当 $P(A)>0$ 时，$X$ 在 $A$ 下的条件分布函数为

$$F_{X\mid A}(x\mid A)=\frac{P(X\le x,\ y<Y\le y+\Delta y)}{P(y<Y\le y+\Delta y)}=\frac{\displaystyle\int_{-\infty}^{x}\!\!\int_{y}^{y+\Delta y}f_{XY}(u,v)\,\mathrm{d}v\,\mathrm{d}u}{F_Y(y+\Delta y)-F_Y(y)}$$

固定 $\Delta y$，右端只有外层积分上限含 $x$。由微积分基本定理对 $x$ 求导，得条件密度

$$f_{X\mid A}(x\mid A)=\frac{\displaystyle\int_{y}^{y+\Delta y}f_{XY}(x,v)\,\mathrm{d}v}{F_Y(y+\Delta y)-F_Y(y)}$$

分子、分母同除以 $\Delta y$，写成差商：

$$f_{X\mid A}(x\mid A)=\frac{\dfrac{1}{\Delta y}\displaystyle\int_{y}^{y+\Delta y}f_{XY}(x,v)\,\mathrm{d}v}{\dfrac{F_Y(y+\Delta y)-F_Y(y)}{\Delta y}}$$

令 $\Delta y\to0$。若 $f_{XY}(x,\cdot)$ 在 $y$ 处连续，则分子由积分中值定理趋于 $f_{XY}(x,y)$；若 $F_Y$ 在 $y$ 处可导且 $f_Y(y)>0$，则分母趋于 $F_Y'(y)=f_Y(y)$。于是

$$f_{X\mid Y}(x\mid y)=\lim_{\Delta y\to0}f_{X\mid A}(x\mid A)=\frac{f_{XY}(x,y)}{f_Y(y)}$$

式子的含义是把联合分布的信息按 $Y$ 的边缘密度重新分摊：对固定的 $y$，$f_{X\mid Y}(\cdot\mid y)$ 是切片 $f_{XY}(\cdot,y)$ 的 $1/f_Y(y)$ 倍，因而积分为 $1$。反过来把 $f_{XY}=f_Xf_{Y\mid X}$ 与上式联立，即得密度形式的 Bayes 公式。

数值自检：取 $y=1.2$、$x=0.8$、$\Delta y=10^{-4}$，分子、分母的差商之比为 $0.40848$，与 $f_{XY}(0.8,1.2)/f_Y(1.2)\approx0.40848$ 一致。

**答**：在 $f_Y(y)>0$ 且 $F_Y$ 在 $y$ 处可导的条件下，$f_{X\mid Y}(x\mid y)=f_{XY}(x,y)/f_Y(y)$。几何上，条件密度就是把联合密度沿条件方向“切一刀”，再用边缘密度重新归一化，使 $\int f_{X\mid Y}(x\mid y)\,\mathrm{d}x=f_Y(y)/f_Y(y)=1$。

> [!warning] 易错点
> - 不能直接写 $P(X\le x\mid Y=y)$：$P(Y=y)=0$，该条件概率没有定义，必须走“区间 → 差商 → 极限”的路径。
> - 对 $x$ 求导时只作用外层积分上限，内层的 $\int_{y}^{y+\Delta y}$ 原样保留，把内层也求导是常见错误。
> - 取极限前先除以 $\Delta y$，直接令 $\Delta y\to0$ 会得到 $0/0$。
> - 条件密度在 $f_Y(y)=0$ 处无定义，但条件期望可只在 $f_Y>0$ 的点上定义，这些点之外的集合概率为 0，不影响结果。

### 题 7 · 由边缘密度判定独立性

> [!example] 题目
> 设随机变量 $X$、$Y$ 的联合概率密度函数为
> $$f_{XY}(x,y)=\begin{cases}0.5(x+y)e^{-(x+y)},&x>0,\ y>0\\0,&\text{其他}\end{cases}$$
> 试问 $X$、$Y$ 是否独立？请说明判断理由。

**解**：

独立的判据只有一条：$f_{XY}(x,y)=f_X(x)f_Y(y)$ 几乎处处成立，因此先求两个边缘密度。固定 $x>0$，对 $y$ 从 $0$ 积到 $\infty$：

$$f_X(x)=\int_{0}^{\infty}0.5(x+y)e^{-(x+y)}\,\mathrm{d}y=0.5e^{-x}\int_{0}^{\infty}(x+y)e^{-y}\,\mathrm{d}y$$

利用 $\int_{0}^{\infty}e^{-y}\,\mathrm{d}y=1$ 与 $\int_{0}^{\infty}ye^{-y}\,\mathrm{d}y=1$，得

$$f_X(x)=0.5(x+1)e^{-x},\qquad x>0$$

联合密度关于 $x$、$y$ 对称，交换记号立得

$$f_Y(y)=0.5(y+1)e^{-y},\qquad y>0$$

两者的乘积为

$$f_X(x)f_Y(y)=0.25(x+1)(y+1)e^{-(x+y)}$$

与联合密度作比值：

$$\frac{f_X(x)f_Y(y)}{f_{XY}(x,y)}=\frac{(x+1)(y+1)}{2(x+y)}$$

它不恒等于 $1$。例如取 $x=y=2$，有 $f_{XY}(2,2)=2e^{-4}$、$f_X(2)f_Y(2)=2.25e^{-4}$，相差 $12.5\%$，因此 $X$ 与 $Y$ 不独立。

也可用条件密度复核。由正文定义 8.2，

$$f_{X\mid Y}(x\mid y)=\frac{f_{XY}(x,y)}{f_Y(y)}=\frac{(x+y)e^{-x}}{y+1}$$

它依赖 $y$：$f_{X\mid Y}(0.5\mid0.5)\approx0.404$，而 $f_{X\mid Y}(0.5\mid3)\approx0.531$。“给定 $Y$ 后 $X$ 的分布随 $Y$ 变化”，正是不独立的另一种表述。

**答**：$X$ 与 $Y$ **不独立**。$f_X(x)=0.5(x+1)e^{-x}$、$f_Y(y)=0.5(y+1)e^{-y}$，而 $f_Xf_Y\neq f_{XY}$；等价地，$f_{X\mid Y}(x\mid y)$ 依赖 $y$。

> [!warning] 易错点
> - 看到 $e^{-(x+y)}=e^{-x}e^{-y}$ 就判独立：密度里还有不可分离的因子 $(x+y)$，它是和不是积。
> - 比较独立性时忘了带定义域 $x>0$、$y>0$，必须使用完整的分段表达式（参见正文“支撑集必须是矩形”的提醒）。
> - 顺带可算出 $E(X)=E(Y)=1.5$、$E(XY)=2$，协方差为 $-0.25$：二者不仅不独立，还是负相关的；但不能反过来用“不相关”推独立。

### 题 9 · 锥形支撑集上的边缘密度与条件期望

> [!example] 题目
> 设两个随机变量 $X$、$Y$ 的联合概率密度函数为
> $$f_{XY}(x,y)=\begin{cases}\dfrac{1}{2}e^{-y},&y>\lvert x\rvert,\ -\infty<x<\infty\\0,&\text{其他}\end{cases}$$
> 试求边缘概率密度 $f_X(x)$、$f_Y(y)$，期望 $E(X)$、$E(Y)$ 和条件期望 $E(Y\mid X)$。

**解**：

先看支撑集。$y>\lvert x\rvert$ 等价于 $x<y$ 且 $x>-y$，区域是顶点在原点、开口向上的锥形，其中 $y>0$ 恒成立。

（1）固定 $x$，$y$ 的范围是 $\lvert x\rvert<y<\infty$，于是

$$f_X(x)=\int_{\lvert x\rvert}^{\infty}\frac{1}{2}e^{-y}\,\mathrm{d}y=\frac{1}{2}e^{-\lvert x\rvert},\qquad -\infty<x<\infty$$

这是拉普拉斯（双指数）密度，且 $\int_{-\infty}^{\infty}\frac{1}{2}e^{-\lvert x\rvert}\,\mathrm{d}x=1$。

（2）固定 $y>0$，$x$ 的范围是 $-y<x<y$，于是

$$f_Y(y)=\int_{-y}^{y}\frac{1}{2}e^{-y}\,\mathrm{d}x=ye^{-y},\qquad y>0$$

$\int_{0}^{\infty}ye^{-y}\,\mathrm{d}y=1$，归一化成立。

（3）$f_X$ 是偶函数，$xf_X(x)$ 为奇函数，故

$$E(X)=\int_{-\infty}^{\infty}x\cdot\frac{1}{2}e^{-\lvert x\rvert}\,\mathrm{d}x=0$$

（4）$f_Y$ 是 $\Gamma(2)$ 密度，由 $\int_{0}^{\infty}y^{2}e^{-y}\,\mathrm{d}y=2!=2$ 得

$$E(Y)=\int_{0}^{\infty}y\cdot ye^{-y}\,\mathrm{d}y=2$$

（5）先求条件密度。当 $f_X(x)>0$ 时，

$$f_{Y\mid X}(y\mid x)=\frac{f_{XY}(x,y)}{f_X(x)}=\frac{0.5e^{-y}}{0.5e^{-\lvert x\rvert}}=e^{-(y-\lvert x\rvert)},\qquad y>\lvert x\rvert$$

即给定 $X=x$ 后 $Y-\lvert x\rvert\sim\mathrm{Exp}(1)$，于是

$$E(Y\mid X=x)=\int_{\lvert x\rvert}^{\infty}y\,e^{-(y-\lvert x\rvert)}\,\mathrm{d}y=\lvert x\rvert+1$$

把 $x$ 换回随机变量 $X$，得 $E(Y\mid X)=\lvert X\rvert+1$。用全期望公式校验：$E\lvert X\rvert=\int_{0}^{\infty}xe^{-x}\,\mathrm{d}x=1$，故 $E[E(Y\mid X)]=E\lvert X\rvert+1=2=E(Y)$，一致。

**答**：$f_X(x)=\dfrac{1}{2}e^{-\lvert x\rvert}$（$-\infty<x<\infty$）；$f_Y(y)=ye^{-y}$（$y>0$），其他为 $0$；$E(X)=0$；$E(Y)=2$；$E(Y\mid X)=\lvert X\rvert+1$，即 $E(Y\mid X=x)=\lvert x\rvert+1$。

> [!warning] 易错点
> - 求 $f_Y(y)$ 时把 $x$ 的积分下限写成 $0$ 或 $-\infty$：必须由 $y>\lvert x\rvert$ 解出 $-y<x<y$，区间长度是 $2y$ 而不是 $y$。
> - 把 $E(Y\mid X)$ 与 $E(Y\mid X=x)$ 混写：前者是随机变量 $\lvert X\rvert+1$，后者是数 $\lvert x\rvert+1$，两者不能互换。
> - 条件密度 $e^{-(y-\lvert x\rvert)}$ 的定义域是 $y>\lvert x\rvert$，漏掉 $\lvert x\rvert$ 会把 $Y$ 误当成标准指数分布。
> - 本题支撑集不是矩形，$X$ 与 $Y$ 显然不独立；不要因为两个边缘密度“看起来正常”就误判。

### 题 13 · Box–Muller 变换与两个独立标准正态

> [!example] 题目
> 设 $U$、$V$ 是区间 $(0,1)$ 上均匀分布的随机变量，它们相互独立。令
> $$X=\sqrt{-2\ln U}\cos(2\pi V),\qquad Y=\sqrt{-2\ln U}\sin(2\pi V)$$
> 试求 $X$、$Y$ 的联合概率密度函数 $f_{XY}(x,y)$ 及边缘概率密度 $f_X(x)$、$f_Y(y)$。

**解**：

这是把一对均匀随机数变成一对独立标准正态随机数的 **Box–Muller 变换**。$(U,V)$ 在单位正方形上均匀，$f_{UV}(u,v)=1$（$0<u<1$，$0<v<1$）。引入极坐标型中间变量

$$R=\sqrt{-2\ln U},\qquad \Theta=2\pi V$$

反变换为 $U=e^{-R^{2}/2}$、$V=\Theta/(2\pi)$；下面用小写 $r>0$、$0<\theta<2\pi$ 表示它们的取值。由正文定义 8.3，从 $(R,\Theta)$ 到 $(U,V)$ 的雅可比为

$$\left|\frac{\partial(u,v)}{\partial(r,\theta)}\right|=r e^{-r^{2}/2}\cdot\frac{1}{2\pi}=\frac{r e^{-r^{2}/2}}{2\pi}$$

第一个因子来自 $\partial u/\partial r=-r e^{-r^{2}/2}$，第二个因子来自 $\partial v/\partial\theta=1/(2\pi)$；因 $u$ 只依赖 $r$、$v$ 只依赖 $\theta$，行列式等于两个对角元之积。于是

$$f_{R\Theta}(r,\theta)=f_{UV}\!\left(e^{-r^{2}/2},\frac{\theta}{2\pi}\right)\frac{r e^{-r^{2}/2}}{2\pi}=\frac{r e^{-r^{2}/2}}{2\pi},\qquad r>0,\ 0<\theta<2\pi$$

对 $\theta$ 积分即得 $R$ 的瑞利密度 $f_R(r)=r e^{-r^{2}/2}$，且 $\Theta\sim U(0,2\pi)$、$R$ 与 $\Theta$ 独立。

再换到 $(X,Y)$：$x=r\cos\theta$、$y=r\sin\theta$，反变换的雅可比为 $\partial(r,\theta)/\partial(x,y)=1/r$。这个 $1/r$ 不能漏：极坐标的面积元是 $r\,\mathrm{d}r\,\mathrm{d}\theta$，从 $(R,\Theta)$ 换到 $(X,Y)$ 时因子恰好抵消。于是

$$f_{XY}(x,y)=f_{R\Theta}(r,\theta)\cdot\frac{1}{r}=\frac{1}{2\pi}e^{-\frac{r^{2}}{2}}=\frac{1}{2\pi}e^{-\frac{x^{2}+y^{2}}{2}}$$

该密度定义在全平面，且可分解为

$$f_{XY}(x,y)=\left(\frac{1}{\sqrt{2\pi}}e^{-\frac{x^{2}}{2}}\right)\left(\frac{1}{\sqrt{2\pi}}e^{-\frac{y^{2}}{2}}\right)=f_X(x)f_Y(y)$$

所以 $X$ 与 $Y$ 相互独立，边缘密度都是标准正态：

$$f_X(x)=\frac{1}{\sqrt{2\pi}}e^{-\frac{x^{2}}{2}},\qquad f_Y(y)=\frac{1}{\sqrt{2\pi}}e^{-\frac{y^{2}}{2}},\qquad -\infty<x,y<\infty$$

这条变换的工程意义就是把均匀随机数变成高斯随机数，MATLAB 中 `randn` 的原理与实现见 [[vault-notes/math/probability/appendix-random-variable-functions]]。

**答**：$f_{XY}(x,y)=\dfrac{1}{2\pi}e^{-\frac{x^{2}+y^{2}}{2}}$；$f_X(x)=f_Y(y)=\dfrac{1}{\sqrt{2\pi}}e^{-\frac{x^{2}}{2}}$，即 $X$、$Y$ 相互独立且都服从 $N(0,1)$。

> [!warning] 易错点
> - 漏掉 $(U,V)\to(R,\Theta)$ 的雅可比 $r e^{-r^{2}/2}/(2\pi)$：漏掉后 $f_{R\Theta}$ 不是合法密度，$R$ 也不再是瑞利分布。
> - 从 $(R,\Theta)$ 换到 $(X,Y)$ 时要**除以** $r$（等价于乘反变换雅可比 $1/r$），写成乘 $r$ 会多出一个 $r$ 因子，密度积分不再是 $1$。
> - $X$、$Y$ 的独立性由 $f_{XY}$ 可分解直接得到，不能只凭“$R$ 与 $\Theta$ 独立”就断言 $X$ 与 $Y$ 独立。
> - $U$ 是 $(0,1)$ 上的均匀分布，$U\to0$ 时 $-\ln U\to\infty$，所以 $X$ 取遍全实轴，定义域必须写 $-\infty<x<\infty$。
> - 端点 $U=0$、$V=0,1$ 的概率为 $0$，不影响密度；严格写法应先声明“几乎必然”。

## 关联

- 上一节：[[vault-notes/random-signals/02-covariance-correlation]]
- 下一节：[[vault-notes/random-signals/02-gaussian-random-vectors]]
- 导航与记号：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/04-multivariate-random-variables]]（联合分布与边缘分布的教材推导）、[[vault-notes/math/probability/appendix-random-variable-functions]]（变量替换与仿真生成）、[[vault-notes/communication/03-random-processes]]（把二维联合分布推广到任意维）
