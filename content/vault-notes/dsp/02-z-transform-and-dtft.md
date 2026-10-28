---
title: "Z变换与离散时间傅里叶变换(DTFT)"
tags:
- 数学
- 数字信号处理
type: course
subjects:
- 数字信号处理
domains:
- 信号与系统
status: learning
aliases: []
prerequisites: []
related: []
---

> [!abstract] 本章在讲什么
> 第 1 章把离散世界的三样东西造齐了（序列、卷积、差分方程），但都是**时域**的：卷积要一条条算，稳定性要看 $\sum\lvert h(n)\rvert$ 收不收敛，又慢又抽象。本章给它们换一套坐标系：
> - **2.1 序列的 z 变换**：把序列变成一个复变量 $z$ 的函数 $X(z)=\sum x(n)z^{-n}$。**卷积瞬间变成乘法**，差分方程变成有理函数。代价是：只要 $X(z)$ 就要带上**收敛域**，否则同一个 $X(z)$ 对应无穷多个序列。
> - **2.2 s 平面与 z 平面的映射关系**：$z=e^{sT}$。这一节回答"为什么连续系统的稳定性判据（左半平面）到了离散系统就变成单位圆"，也顺便把第 1 章的"频谱周期延拓"再解释一遍。
> - **2.3 离散时间傅里叶变换（DTFT）**：把 $z$ 限制在单位圆上，就是序列的频谱。它是"离散序列 ↔ 连续频谱"的正变换，也是第 3 章 DFT 的直接祖先。
> - **2.4 离散 LSI 系统的频域表征**：把系统的三种语言（$h(n)$、差分方程、$H(z)$）全部装进"复指数是特征函数"这一句话里，并给出工程师最常用的**零极点矢量法**。
>
> 一句话主线：**z 变换把"卷积"翻译成"乘法"、把"稳定性"翻译成"极点在不在单位圆内"；DTFT 是它在单位圆上的截面；系统频域表征是这一切在 LSI 系统上的落地。**

> [!note] 记号约定
> - $z$ 是**复变量**，$z=re^{j\omega}$，$r=\lvert z\rvert$。$z$ 变换记作 $X(z)=\mathcal{Z}[x(n)]$
> - **凡写出 $X(z)$ 必须同时给出收敛域（ROC）**，本题库中写作"$\lvert z\rvert>\lvert a\rvert$"等；这是本章最重要的纪律
> - $X(e^{j\omega})$ 专指**单位圆上**的取值（DTFT），$H(e^{j\omega})$ 专指系统的**频率响应**
> - $z^{-1}$ 有两个身份：代数上它是"除以 $z$"，结构上是**延迟一拍**（第 5 章的结构图就用它当积木）
> - 连续域用 Laplace 变量 $s=\sigma+j\Omega$，离散域用 $z$；两者由 $z=e^{sT}$ 联系
> - 极点用"×"、零点用"○"标注在 z 平面上

# 1. 序列的z变换

## 为什么需要 z 变换：从 DTFT 的收敛条件说起

序列的傅里叶变换（DTFT）要求 $\sum\lvert x(n)\rvert<\infty$。可工程里最常见的两类信号都不满足：

| 信号 | 问题 |
| --- | --- |
| $x(n)=u(n)$ | $\sum\lvert x(n)\rvert=\infty$，DTFT 不收敛（只能带冲激勉强写） |
| $x(n)=a^nu(n),\ \lvert a\rvert>1$ | 发散得更彻底，DTFT 根本不存在 |

**解法很朴素**：给它乘一个**衰减因子** $r^{-n}$，把发散的级数"压"成收敛的：

$$
\sum_{n=-\infty}^{\infty}\big\lvert x(n)\,r^{-n}\big\rvert<\infty\quad\text{对某些 }r\text{ 成立}
$$

把 $r^{-n}$ 与 DTFT 的 $e^{-j\omega n}$ 合并，就得到一个以**复数** $z=re^{j\omega}$ 为自变量的函数：

$$
r^{-n}e^{-j\omega n}=\big(re^{j\omega}\big)^{-n}=z^{-n}
$$

这就是 z 变换。**它不是新发明的技巧，而是"给 DTFT 加一个可调的衰减旋钮"**——旋钮转对了级数就收敛，转错了就发散，所以"哪些 $z$ 能收敛"（收敛域）成了这个变换不可分割的一部分。

## 双边 z 变换的定义

> [!info] Def 1 双边 z 变换
> 序列 $x(n)$ 的**双边 z 变换**（bilateral z-transform）定义为
> $$
> X(z)=\mathcal{Z}[x(n)]=\sum_{n=-\infty}^{\infty}x(n)\,z^{-n}
> $$
> 其中 $z$ 为复变量。使该级数收敛的 $z$ 的集合称为**收敛域**（region of convergence，简称 **ROC**），记作 $R_x$。
>
> 逆变换（由 $X(z)$ 与 ROC 还原 $x(n)$）为围线积分：
> $$
> x(n)=\frac{1}{2\pi j}\oint_{C}X(z)\,z^{\,n-1}\,dz
> $$
> $C$ 是 ROC 内一条逆时针绕原点的闭合曲线。

> [!warning] 为什么 $X(z)$ 单独不够用 —— 本章第一纪律
> 同一个 $X(z)$ 可以对应**不同的序列**：
> $$
> x_1(n)=a^nu(n)\ \Longrightarrow\ X_1(z)=\frac{1}{1-az^{-1}},\ \lvert z\rvert>\lvert a\rvert
> $$
> $$
> x_2(n)=-a^nu(-n-1)\ \Longrightarrow\ X_2(z)=\frac{1}{1-az^{-1}},\ \lvert z\rvert<\lvert a\rvert
> $$
> **函数表达式完全相同，序列完全不同**（一个是右边序列、一个是左边序列）。所以：
> $$
> \text{序列}\ \Longleftrightarrow\ \big(X(z),\ \text{ROC}\big)\ \text{这一对}
> $$
> 做题时给出 $X(z)$ 而不给 ROC，等于没给答案；反过来"求反变换"的题，**先看 ROC 再动笔**。

## 单边 z 变换

> [!info] Def 2 单边 z 变换
> $$
> X_1(z)=\mathcal{Z}_1[x(n)]=\sum_{n=0}^{\infty}x(n)\,z^{-n}
> $$
> 它只"看见" $n\ge0$ 的部分，因此**天然用于"给定初始条件求系统响应"的差分方程问题**（第 1 章 3 节的差分解法在这里变得非常机械）。

单边变换的移位性质与双边不同（**这是它唯一需要注意的地方**）：

$$
x(n-m)\ \longleftrightarrow\ z^{-m}X_1(z)+\sum_{k=1}^{m}x(-k)\,z^{-(m-k)}
$$

特别地：

$$
x(n-1)\ \longleftrightarrow\ z^{-1}X_1(z)+x(-1)\qquad x(n+1)\ \longleftrightarrow\ zX_1(z)-z\,x(0)
$$

> [!tip] 单边 z 变换解差分方程的三步法
> 1. 对差分方程两边取单边 z 变换（移位项会自动带出 $y(-1),y(-2),\dots$）；
> 2. 解代数方程得 $Y_1(z)$——它天然已经**把零输入响应与零状态响应合成在一起**；
> 3. 反变换。用部分分式时按"极点相对单位圆的位置"（单边变换的收敛域必是某圆外区域）统一取右边序列。
>
> 与第 1 章的"齐次解 + 特解"相比，**这里不用猜特解形式、不用联立方程组，全部是代数运算**——这就是换坐标系的收益。

## 收敛域决定一切

> [!info] Def 3 收敛域及其性质
> ROC 是使 $\sum\lvert x(n)r^{-n}\rvert<\infty$ 成立的 $r=\lvert z\rvert$ 的集合。它必有以下四条性质：
> 1. **ROC 是以原点为中心的环形区域**（由 $\lvert z\rvert$ 单变量决定）；
> 2. **ROC 内不含任何极点**（极点上 $X(z)$ 无界）；
> 3. ROC 的边界由**经过极点的圆**界定（或 $0$、$\infty$）；
> 4. **若 ROC 包含单位圆，则序列绝对可和**（此时 DTFT 存在，见 2.3 节）。

四类序列的 ROC 形状（**务必形成肌肉记忆**）：

| 序列类型          | 定义域                | ROC                                                       |
| ------------- | ------------------ | --------------------------------------------------------- |
| **有限长序列**     | $n_1\le n\le n_2$  | $0<\lvert z\rvert<\infty$（可能挖去 $z=0$ 或 $z=\infty$）        |
| **右边序列**（因果）  | $n\ge n_1$         | $\lvert z\rvert>R_{x-}$（圆的**外部**）；$n_1\ge0$ 时含 $z=\infty$ |
| **左边序列**（反因果） | $n\le n_2$         | $\lvert z\rvert<R_{x+}$（圆的**内部**）；$n_2\le0$ 时含 $z=0$      |
| **双边序列**      | $-\infty<n<\infty$ | $R_{x-}<\lvert z\rvert<R_{x+}$（**圆环**）                    |

![[vault-notes/assets/02-z-transform-and-dtft/fig-01.png]]

> [!tip] 一图记住 ROC 的方向
> **"右边序列 → 圆外；左边序列 → 圆内；双边 → 环"**。
> 原因很直接：$n\to+\infty$ 的项由 $z^{-n}$ 负责压（$z$ 越大越收敛）；$n\to-\infty$ 的项由 $z^{-n}$ 负责压（$z$ 越小越收敛）。**"哪边无限，就往哪边要收敛域"**。
>
> 由此得到两条实用推论：
> - **因果序列**（$n<0$ 全为 0）⟺ ROC 是**最外层极点之外的圆外区域，且含 $z=\infty$**；
> - **稳定序列**（绝对可和）⟺ **ROC 含单位圆**。两者合起来就是"**因果且稳定 ⟺ 全部极点在单位圆内**"——第 4 节会用这条判据收尾。

## 反 z 变换

三种方法，按题目形状选：

| 方法 | 做法 | 适用 |
| --- | --- | --- |
| **留数法（围线积分）** | $x(n)=\sum\limits_{C\ \text{内各极点}}\mathrm{Res}\big[X(z)z^{\,n-1}\big]$ | 通用；极点多但 $X(z)$ 简单时最快 |
| **部分分式法** | 拆成一阶／二阶项，查表反变换 | **有理函数 + 要闭式解**，考试首选 |
| **幂级数法（长除法）** | 把 $X(z)$ 展成 $\sum x(n)z^{-n}$，读系数 | 只要前几项数值；也用于验证 |

> [!info] 部分分式法的适用条件
> **核心思路**：把有理的 $X(z)$ 拆成若干标准变换对之和（逐项求系数），再按 ROC 决定每一项取右边还是左边，最后相加。
> 当 $X(z)=\dfrac{B(z)}{A(z)}$ 是**有理函数**（$B(z)$、$A(z)$ 为 $z$ 的多项式）时可用。
> **前提**：必须知道 **ROC**。仅凭代数式不能唯一确定 $x(n)$——同一个有理式在不同 ROC 下对应不同的时域序列。

> [!tip] 部分分式法的关键动作：先清负幂，再除以 $z$
> 若 $X(z)$ 含 $z^{-1},z^{-2},\dots$，先分子分母同乘 $z^{m}$ 化成**正幂**多项式，后续的因式分解、长除法、遮盖法都更方便。
> 因为变换对里分子常带一个 $z$（如 $\frac{z}{z-a}\leftrightarrow a^{n}u(n)$），建议：
> 1. 先算 $\dfrac{X(z)}{z}$（把 $z$ 除出来），对它做部分分式；
> 2. 再乘回 $z$，每项都恰是表 2-1 中的标准形（表 2-1 见后文"常用 z 变换对"）；
> 3. **各项取"右边"还是"左边"，由该极点相对 ROC 的位置决定**——极点模值**小于** ROC 边界的取右边，**大于**的取左边。
>
> 除以 $z$ 后若分母多出 $z=0$ 极点，乘回 $z$ 时会留下一个**常数项**，对应 $\delta(n)$——它不是笔误（见下面第二个例子）。

> [!note] 展开流程（第 3～8 步）与系数求法
> 3. **比较次数**：记 $F(z)=\dfrac{P(z)}{Q(z)}$。$\deg P<\deg Q$ 时直接展开；$\deg P\ge\deg Q$ 时先做多项式长除法
>    $$
>    F(z)=S(z)+\frac{R(z)}{Q(z)},\qquad \deg R<\deg Q
>    $$
>    只对真分式 $R/Q$ 展开，多项式部分乘回 $z$ 后单独写成 $\delta(n)$ 及其移位项。
> 4. **分母因式分解**：$Q(z)=\prod_i (z-p_i)^{r_i}$，并记下每个极点的重数。实系数多项式若有复极点，必成共轭对出现，可先合成二阶项处理。
> 5. **写展开式**：单极点写 $\dfrac{A_i}{z-p_i}$；$r$ 重极点必须**写满**从一次到 $r$ 次的所有项
>    $$
>    \frac{A_1}{z-a}+\frac{A_2}{(z-a)^2}+\cdots+\frac{A_r}{(z-a)^r}
>    $$
>    漏掉任何一阶，通分比较时系数就会全错。
> 6. **求系数**（按极点类型选方法）：
>    - **遮盖法**（简单极点）：$A_i=\lim\limits_{z\to p_i}(z-p_i)F(z)$，即遮住 $(z-p_i)$ 后令 $z=p_i$；
>    - **通分比较系数**：通分后比对同次幂，解线性方程组——通用但最慢；
>    - **重极点导数法**：令 $G(z)=(z-a)^{r}F(z)$，则
>      $$
>      A_{r-k}=\left.\frac{1}{k!}\frac{d^{k}G(z)}{dz^{k}}\right|_{z=a},\qquad k=0,1,\dots,r-1
>      $$
> 7. **乘回 $z$**：$X(z)=zF(z)$，每项变成 $\dfrac{A_i z}{z-p_i}$ 或常数项，可直接对照表 2-1。
> 8. **按 ROC 定左右**：
>
> | 频域表达式 | 时域序列 | ROC |
> | --- | --- | --- |
> | $\dfrac{z}{z-a}$ | $a^{n}u(n)$ | $\lvert z\rvert>\lvert a\rvert$ |
> | $\dfrac{z}{z-a}$ | $-a^{n}u(-n-1)$ | $\lvert z\rvert<\lvert a\rvert$ |
>
> ROC 在最外层极点之外 → 各项全取右边；在最内层极点之内 → 全取左边；夹在相邻两个极点之间 → 两侧分别取右、左，得到**双边序列**。**ROC 不含任何极点**，每一项取左还是取右必须服从题目给定的 ROC，不能只看代数式。

> [!example] 例：同一个 $X(z)$，三种 ROC，三个序列
> $$
> X(z)=\frac{1}{\big(1-0.5z^{-1}\big)\big(1-2z^{-1}\big)}
> $$
> **① 部分分式**（对 $z^{-1}$ 展开，令 $u=z^{-1}$）：
> $$
> \frac{1}{(1-0.5u)(1-2u)}=\frac{A}{1-0.5u}+\frac{B}{1-2u}
> $$
> 通分比较：$A+B=1$、$-2A-0.5B=0$，解得 $A=-\frac13$、$B=\frac43$，即
> $$
> X(z)=\frac{-1/3}{1-0.5z^{-1}}+\frac{4/3}{1-2z^{-1}}
> $$
> **② 极点**：$z=0.5$ 与 $z=2$，把 $z$ 平面分成三段，对应三个不同序列：
>
> | ROC | 极点 $0.5$ | 极点 $2$ | $x(n)$ |
> | --- | --- | --- | --- |
> | $\lvert z\rvert>2$ | 在界内 → 右边 | 在界内 → 右边 | $\left[-\dfrac13(0.5)^{n}+\dfrac43\,2^{\,n}\right]u(n)$ |
> | $\lvert z\rvert<0.5$ | 在界外 → 左边 | 在界外 → 左边 | $\left[\dfrac13(0.5)^{n}-\dfrac43\,2^{\,n}\right]u(-n-1)$ |
> | $0.5<\lvert z\rvert<2$ | 在界内 → 右边 | 在界外 → 左边 | $-\dfrac13(0.5)^{n}u(n)-\dfrac43\,2^{\,n}u(-n-1)$ |
>
> **③ 校验**：只有第三种的 ROC 含单位圆，因此**只有第三种是绝对可和的（稳定的）**——虽然 $X(z)$ 的表达式一字未变。这就是"ROC 决定一切"最生动的例子。

> [!example] 例：含多项式项时，结果里会出现 $\delta(n)$
> 求 $X(z)=\dfrac{2+\frac13z^{-1}+z^{-2}}{1+\frac73z^{-1}-2z^{-2}}$ 的反变换（与上例的区别：分子、分母同为 $z$ 的二次式，属于**假分式**，结果里会多出冲激项）。
> **① 清负幂**（分子分母同乘 $z^{2}$）：
> $$
> X(z)=\frac{2z^{2}+\frac13z+1}{z^{2}+\frac73z-2}=\frac{2z^{2}+\frac13z+1}{\left(z-\frac23\right)(z+3)}
> $$
> **② 除以 $z$**：
> $$
> F(z)=\frac{X(z)}{z}=\frac{2z^{2}+\frac13z+1}{z\left(z-\frac23\right)(z+3)}
> $$
> 分子 2 次、分母 3 次，是真分式，**不需要长除法**。
> **③ 写展开式**（极点 $0,\ \frac23,\ -3$ 全为简单极点）：
> $$
> F(z)=\frac{A}{z}+\frac{B}{z-\frac23}+\frac{C}{z+3}
> $$
> **④ 遮盖法求系数**：
> $$
> A=\left.\frac{2z^{2}+\frac13z+1}{\left(z-\frac23\right)(z+3)}\right|_{z=0}=-\frac12,\qquad B=\left.\frac{2z^{2}+\frac13z+1}{z(z+3)}\right|_{z=\frac23}=\frac{19}{22},\qquad C=\left.\frac{2z^{2}+\frac13z+1}{z\left(z-\frac23\right)}\right|_{z=-3}=\frac{18}{11}
> $$
> **⑤ 乘回 $z$**：
> $$
> X(z)=-\frac12+\frac{19}{22}\cdot\frac{z}{z-\frac23}+\frac{18}{11}\cdot\frac{z}{z+3}
> $$
> 常数项 $-\frac12$ 对应 $-\frac12\delta(n)$——**最容易漏的一项**，它来自 $A/z$ 乘回 $z$。（$\frac{z}{z-a}$ 项在 $n=0$ 也各取 1，所以 $\delta(n)$ 的**总**系数不是 $-\frac12$，见 ⑦ 的校验。）
> **⑥ 按 ROC 写出三种 $x(n)$**：
>
> | ROC | $\dfrac{z}{z-2/3}$ 项 | $\dfrac{z}{z+3}$ 项 | $x(n)$ |
> | --- | --- | --- | --- |
> | $\lvert z\rvert>3$ | 右边 | 右边 | $-\dfrac12\delta(n)+\dfrac{19}{22}\left(\dfrac23\right)^{n}u(n)+\dfrac{18}{11}(-3)^{n}u(n)$ |
> | $\dfrac23<\lvert z\rvert<3$ | 右边 | 左边 | $-\dfrac12\delta(n)+\dfrac{19}{22}\left(\dfrac23\right)^{n}u(n)-\dfrac{18}{11}(-3)^{n}u(-n-1)$ |
> | $\lvert z\rvert<\dfrac23$ | 左边 | 左边 | $-\dfrac12\delta(n)-\dfrac{19}{22}\left(\dfrac23\right)^{n}u(-n-1)-\dfrac{18}{11}(-3)^{n}u(-n-1)$ |
>
> **⑦ 校验**（只在因果情形可做）：$\lvert z\rvert>3$ 时 ROC 含 $z=\infty$，由初值定理 $x(0)=\lim\limits_{z\to\infty}X(z)=2$；而上式 $x(0)=-\frac12+\frac{19}{22}+\frac{18}{11}=2$ ✓（两个 $\frac{z}{z-a}$ 项在 $n=0$ 的取值都是 1）。
>
> 三行的**展开系数完全相同**，只有每一项取右还是取左不同——这是"$X(z)$ 必须带 ROC"的又一次印证。

> [!warning] 用留数法时最容易错的一步
> 被积函数是 $X(z)z^{\,n-1}$ 而**不是** $X(z)$。$n=0$ 时 $z^{-1}$ 会把"原点处的一阶极点"送进来；$n<0$ 时 $z^{n-1}$ 在原点给出高阶极点，一般改用"**圆的内部极点之和 = 圆外部极点之和取负**"的等价写法（这正是单边/双边序列的 $u(n)$ 与 $u(-n-1)$ 之分）。
> **保险做法**：算完用"$\lvert x(n)\rvert$ 在 ROC 下是否可和"和自己的 ROC 判断互相对一遍。

> [!tip] 部分分式法速记与三个易错点
> **流程**：消除负幂 → 先除以 $z$ → 比较次数（必要时长除）→ 分母因式分解 → 写出部分分式（注意重根）→ 求系数 → 乘回 $z$ → 结合 ROC 查表。
>
> **最容易错的三个地方**：
> 1. 忘记先除以 $z$（或忘了先清负幂），导致分式不能直接与表 2-1 对应；
> 2. 遇到重极点只写一个分式，漏掉 $\dfrac{A_2}{(z-a)^{2}},\dots$；
> 3. 只做代数展开，没有按 ROC 把每一项判成右边/左边，或忘了 $z=0$ 极点带来的 $\delta(n)$。

## z 变换的性质

> [!tip] 表 2-2 z 变换的主要性质
> 设 $\mathcal{Z}[x(n)]=X(z),\ R_x$；$\mathcal{Z}[y(n)]=Y(z),\ R_y$。

| 性质 | 序列 | z 变换 | ROC |
| --- | --- | --- | --- |
| **线性** | $ax(n)+by(n)$ | $aX(z)+bY(z)$ | 至少 $R_x\cap R_y$ |
| **移位** | $x(n-m)$ | $z^{-m}X(z)$ | $R_x$（$z=0/\infty$ 可能变） |
| **乘指数（z 域尺度）** | $a^{\,n}x(n)$ | $X(z/a)$ | $\lvert a\rvert R_x$ |
| **翻转** | $x(-n)$ | $X(1/z)$ | $1/R_x$ |
| **共轭** | $x^{*}(n)$ | $X^{*}(z^{*})$ | $R_x$ |
| **乘 $n$（z 域微分）** | $n\,x(n)$ | $-z\dfrac{dX(z)}{dz}$ | $R_x$ |
| **时域卷积** | $x(n)*y(n)$ | $X(z)Y(z)$ | 至少 $R_x\cap R_y$ |
| **序列相乘（复卷积）** | $x(n)y(n)$ | $\dfrac{1}{2\pi j}\oint_{C}X(v)Y\!\left(\dfrac{z}{v}\right)v^{-1}dv$ | 环状 |
| **部分和** | $\displaystyle\sum_{k=-\infty}^{n}x(k)$ | $\dfrac{X(z)}{1-z^{-1}}$ | $R_x\cap(\lvert z\rvert>1)$ |
| **初值（因果）** | $x(0)$ | $\lim_{z\to\infty}X(z)$ | — |
| **终值** | $\lim_{n\to\infty}x(n)$ | $\lim_{z\to1}(1-z^{-1})X(z)$ | 极点全在单位圆内（$z=1$ 允许一阶） |

> [!tip] 三条最常用的性质，各自都对应一个"工程动作"
> 1. **时域卷积定理**（本章最重要的公式）：
>    $$
>    x(n)*h(n)\ \longleftrightarrow\ X(z)H(z)
>    $$
>    **时域里最麻烦的运算，在 z 域里是最简单的乘法。** 整个第 3、4 章（DFT、FFT）的动机都可以用这一条概括：**想办法在有限长序列上重现这个"卷积变乘法"**。
> 2. **乘指数性质** $a^nx(n)\leftrightarrow X(z/a)$：它把"通带中心搬到某处"这件事变成"极零点整幅缩放/旋转"——调制、变频、滤波器频率搬移全靠这条。
> 3. **乘 $n$ 性质** $nx(n)\leftrightarrow -z\frac{dX}{dz}$：一阶系统的"斜坡响应"、差分方程的重复极点都靠它。

> [!warning] 移位性质的 ROC 会变（极易忽略）
> $x(n-m)\leftrightarrow z^{-m}X(z)$：$m>0$ 时**在 $z=0$ 引入了极点**（$z^{-m}$ 本身在 0 处发散），故 ROC **可能失去 $z=0$**；$m<0$ 时则可能失去 $z=\infty$。
> **只在有限长序列的题目里，这个细节才决定答案的正误**（比如 $\delta(n)$ 的 ROC 是全平面，但 $\delta(n-1)$ 的 ROC 是"$z\ne0$"）。

## 常用 z 变换对

> [!tip] 表 2-1 常用序列的 z 变换对（考试必背）
> 右列 ROC 与左列序列是**一一绑定**的，背的时候一起背。

| $x(n)$ | $X(z)$ | ROC |
| --- | --- | --- |
| $\delta(n)$ | $1$ | 全 $z$ 平面 |
| $\delta(n-m)\ (m>0)$ | $z^{-m}$ | $z\ne0$ |
| $u(n)$ | $\dfrac{1}{1-z^{-1}}$ | $\lvert z\rvert>1$ |
| $-u(-n-1)$ | $\dfrac{1}{1-z^{-1}}$ | $\lvert z\rvert<1$ |
| $a^{\,n}u(n)$ | $\dfrac{1}{1-az^{-1}}$ | $\lvert z\rvert>\lvert a\rvert$ |
| $-a^{\,n}u(-n-1)$ | $\dfrac{1}{1-az^{-1}}$ | $\lvert z\rvert<\lvert a\rvert$ |
| $n\,a^{\,n}u(n)$ | $\dfrac{az^{-1}}{(1-az^{-1})^{2}}$ | $\lvert z\rvert>\lvert a\rvert$ |
| $-n\,a^{\,n}u(-n-1)$ | $\dfrac{az^{-1}}{(1-az^{-1})^{2}}$ | $\lvert z\rvert<\lvert a\rvert$ |
| $R_N(n)$ | $\dfrac{1-z^{-N}}{1-z^{-1}}$ | $\lvert z\rvert>0$ |
| $e^{j\omega_0 n}u(n)$ | $\dfrac{1}{1-e^{j\omega_0}z^{-1}}$ | $\lvert z\rvert>1$ |
| $\cos(\omega_0 n)u(n)$ | $\dfrac{1-\cos\omega_0\,z^{-1}}{1-2\cos\omega_0\,z^{-1}+z^{-2}}$ | $\lvert z\rvert>1$ |
| $\sin(\omega_0 n)u(n)$ | $\dfrac{\sin\omega_0\,z^{-1}}{1-2\cos\omega_0\,z^{-1}+z^{-2}}$ | $\lvert z\rvert>1$ |
| $a^{\,n}\cos(\omega_0 n)u(n)$ | $\dfrac{1-a\cos\omega_0\,z^{-1}}{1-2a\cos\omega_0\,z^{-1}+a^{2}z^{-2}}$ | $\lvert z\rvert>\lvert a\rvert$ |
| $a^{\,n}\sin(\omega_0 n)u(n)$ | $\dfrac{a\sin\omega_0\,z^{-1}}{1-2a\cos\omega_0\,z^{-1}+a^{2}z^{-2}}$ | $\lvert z\rvert>\lvert a\rvert$ |

> [!example] 推导样本：为什么 $a^nu(n)$ 是 $\dfrac{1}{1-az^{-1}}$，而 $-a^nu(-n-1)$ 也是？
> **右边序列**（$n\ge0$，等比级数，公比 $az^{-1}$）：
> $$
> X_1(z)=\sum_{n=0}^{\infty}a^{n}z^{-n}=\frac{1}{1-az^{-1}},\qquad \lvert az^{-1}\rvert<1\Rightarrow\lvert z\rvert>\lvert a\rvert
> $$
> **左边序列**（$n\le-1$，令 $m=-n$）：
> $$
> X_2(z)=-\sum_{n=-\infty}^{-1}a^{n}z^{-n}=-\sum_{m=1}^{\infty}a^{-m}z^{m}=-\frac{z/a}{1-z/a}=\frac{1}{1-az^{-1}},\qquad \lvert z\rvert<\lvert a\rvert
> $$
> **表达式完全一样，ROC 一个在内一个在外**——这正是 Def 1 后那条警告的具体实例。

> [!note] 分母多项式与极点：从 $X(z)$ 直读 ROC
> 把 $X(z)$ 写成 $z^{-1}$ 的有理函数 $X(z)=\dfrac{P(z^{-1})}{Q(z^{-1})}$，令 $Q=0$ 解出**极点**，则：
> - 右边序列：ROC $=$ **最大极点模值之外**；
> - 左边序列：ROC $=$ **最小极点模值之内**；
> - 双边序列：ROC $=$ **相邻两个极点模值之间的环**。
>
> 这就是为什么"求 $X(z)$ 的反变换"这类题的第一步永远是**先求极点、画数轴、看 ROC 落在哪一段**。

## MATLAB

```matlab
% 例：X(z) = 1/((1-0.5z^-1)(1-2z^-1))，极点 0.5 与 2
b = 1;  a = [1 -2.5 1];            % a 由 (1-0.5z^-1)(1-2z^-1) 展开而来
[r, p, k] = residuez(b, a);        % 极点为 {0.5, 2}，对应留数 {−1/3, 4/3}（顺序以 p 为准）
zplane(b, a);                      % 画零极点图与单位圆
[hh, tt] = impz(b, a, 5);          % h(n)：impz 默认取因果（右边）那一支，即 ROC |z| > 2

% 校验部分分式：把 r、p 反算回原式
[b2, a2] = residuez(r, p, k);
norm(b - b2) + norm(a - a2)        % ≈ 0

% 数列数的 z 变换（符号验证）
syms z n
X = ztrans(0.5^n, n, z)            % → z/(z - 1/2)
simplify(X - 1/(1 - 0.5*z^-1))     % → 0
```

> [!note] `residuez` 与 `residue` 的区别
> `residue` 做的是 Laplace／一般有理函数的部分分式（按 $s$），`residuez` 专为 $z^{-1}$ 形式设计，**它给出的 $r$ 就是标准变换对里的系数**，可以直接对照表 2-1 写结果。做数字滤波器题请用 `residuez`。

# 2. s平面与z平面的映射关系

## 映射 $z=e^{sT}$ 的来历

第 1 章说过：抽样信号是 $x_a(t)$ 乘冲激串后的结果。现在对它做 Laplace 变换：

$$
\hat{X}_a(s)=\int_{-\infty}^{\infty}\Big[\sum_{n=-\infty}^{\infty}x_a(nT)\,\delta(t-nT)\Big]e^{-st}dt=\sum_{n=-\infty}^{\infty}x_a(nT)\,e^{-snT}
$$

把 $x_a(nT)$ 记作序列 $x(n)$，并令 $z=e^{sT}$：

$$
\hat{X}_a(s)=\sum_{n=-\infty}^{\infty}x(n)\,\big(e^{sT}\big)^{-n}=X(z)\Big\lvert_{z=e^{sT}}
$$

> [!tip] 这一行把三件事一次说清
> 1. **z 变换就是"抽样信号的 Laplace 变换"**：$z=e^{sT}$，别无其它；
> 2. **$T$ 就藏在这个换元里**，所以后面所有"归一化"工作都只是把 $T$ 吸收进 $s\to z$ 的映射；
> 3. **DTFT 是 z 变换在单位圆上的取值**（$s=j\Omega$ 时 $z=e^{j\Omega T}=e^{j\omega}$）——这条在 2.3 节会反复使用。
>
> 因此本章的三节其实是一条链：**Laplace $\xrightarrow{z=e^{sT}}$ z 变换 $\xrightarrow{\lvert z\rvert=1}$ DTFT $\longrightarrow$ 频率响应**。

## 极坐标分解与对应关系

把 $s=\sigma+j\Omega$ 代入：

$$
z=e^{(\sigma+j\Omega)T}=e^{\sigma T}\cdot e^{j\Omega T}\quad\Longrightarrow\quad \lvert z\rvert=e^{\sigma T},\qquad \angle z=\Omega T=\omega
$$

于是**实部 $\sigma$ 管模值，虚部 $\Omega$ 管角度**，一对一地给出下图：

<svg width="100%" viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12">
  <text x="140" y="20" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">s 平面：每 2π/T 一条横带</text>
  <rect x="60" y="86" width="190" height="84" fill="var(--text-accent,#705dcf)" fill-opacity="0.14"/>
  <line x1="60" y1="44" x2="250" y2="44" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="60" y1="86" x2="250" y2="86" stroke="var(--text-accent,#705dcf)" stroke-width="1.2"/>
  <line x1="60" y1="170" x2="250" y2="170" stroke="var(--text-accent,#705dcf)" stroke-width="1.2"/>
  <line x1="60" y1="212" x2="250" y2="212" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="45" y1="128" x2="258" y2="128" stroke="var(--text-muted,#6a737d)" stroke-width="1.2"/>
  <line x1="150" y1="34" x2="150" y2="222" stroke="var(--text-muted,#6a737d)" stroke-width="1.2"/>
  <text x="262" y="132" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">σ</text>
  <text x="150" y="32" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">jΩ</text>
  <text x="54" y="90" text-anchor="end" fill="var(--text-accent,#705dcf)" font-size="10.5">Ω = π/T</text>
  <text x="54" y="174" text-anchor="end" fill="var(--text-accent,#705dcf)" font-size="10.5">Ω = −π/T</text>
  <text x="54" y="40" text-anchor="end" fill="var(--text-muted,#6a737d)" font-size="10.5">3π/T</text>
  <text x="54" y="208" text-anchor="end" fill="var(--text-muted,#6a737d)" font-size="10.5">−3π/T</text>
  <text x="150" y="236" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="11">宽 2π/T 的横带 → 整个 z 平面（多值映射）</text>
  <text x="400" y="20" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">z 平面：z = e^{sT}</text>
  <line x1="320" y1="128" x2="486" y2="128" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="400" y1="48" x2="400" y2="208" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="4 3"/>
  <circle cx="400" cy="128" r="72" fill="none" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="472" cy="128" r="3.5" fill="var(--text-accent,#705dcf)"/>
  <circle cx="328" cy="128" r="3.5" fill="var(--text-accent,#705dcf)"/>
  <circle cx="400" cy="56" r="3.5" fill="var(--text-normal,#1f2328)"/>
  <path d="M 432,128 A 32,32 0 0 0 416,100.3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.1"/>
  <circle cx="436" cy="65.6" r="3.5" fill="var(--text-normal,#1f2328)"/>
  <text x="466" y="114" text-anchor="end" fill="var(--text-muted,#6a737d)" font-size="11">z = 1</text>
  <text x="476" y="146" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="11">Ω = 0</text>
  <text x="322" y="120" text-anchor="end" fill="var(--text-muted,#6a737d)" font-size="11">z = −1</text>
  <text x="322" y="105" text-anchor="end" fill="var(--text-muted,#6a737d)" font-size="11">Ω = ±π/T</text>
  <text x="406" y="52" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="11">Ω = π/2T</text>
  <text x="442" y="70" text-anchor="start" fill="var(--text-normal,#1f2328)" font-size="11">e^{jω}</text>
  <text x="444" y="114" text-anchor="middle" fill="var(--text-normal,#1f2328)" font-size="11">ω</text>
  <text x="366" y="106" text-anchor="middle" fill="var(--text-accent,#705dcf)" font-size="11">|z| &lt; 1</text>
  <text x="366" y="120" text-anchor="middle" fill="var(--text-accent,#705dcf)" font-size="10.5">← σ &lt; 0</text>
  <text x="400" y="222" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="11">|z| > 1 ← σ > 0（不稳定）</text>
  <text x="400" y="236" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="11">虚轴 ↔ 单位圆（jΩ 轴上下无限，圆上绕圈）</text>
</svg>



> [!tip] 六条对应关系（务必背下来）
> | $s$ 平面 | $z$ 平面 | 含义 |
> | --- | --- | --- |
> | 虚轴 $\sigma=0$ | **单位圆** $\lvert z\rvert=1$ | 等幅振荡 vs 纯正弦 |
> | 左半平面 $\sigma<0$ | **单位圆内** $\lvert z\rvert<1$ | 衰减 ⟺ **稳定** |
> | 右半平面 $\sigma>0$ | **单位圆外** $\lvert z\rvert>1$ | 增长 ⟺ **不稳定** |
> | 原点 $s=0$ | $z=1$ | 直流 |
> | $\Omega=0$ | $\angle z=0$ | 直流 |
> | $\Omega=\pm\Omega_s/2=\pm\pi/T$ | $z=-1$ | **折叠频率**（第 1 章的奈奎斯特频率） |
>
> 一句话：**"$s$ 平面的竖直线（等 $\sigma$）→ $z$ 平面的圆；横线（等 $\Omega$）→ $z$ 平面的射线"。**


*（图片未随站点发布：s_plane_z_plane_aliasing_interactive 1.html）*
## 多值性：一条横带映成整个平面

$\angle z=\Omega T$ 只由 $\Omega$ 模 $2\pi/T$ 决定，因此

$$
\Omega\ \text{与}\ \Omega+\frac{2\pi}{T}k=\Omega+k\Omega_s\ \ \Longrightarrow\ \ \text{同一个 }z
$$

**$s$ 平面上一整条宽 $2\pi/T$ 的横带，都被映成同一张 z 平面**；$\Omega$ 从 $-\infty$ 走到 $+\infty$，$z$ 就在单位圆上一圈一圈地绕。

> [!warning] 这个"多值"就是第 1 章混叠的另一种说法
> 抽样后频谱以 $\Omega_s$ 为周期延拓，对应到 z 变换就是"**不同条带的频率落在同一个 $z$ 上**"。所以：
> - 混叠 $=$ **映射不单值**；
> - 抗混叠 $=$ **把信号限制在一条带内**（$f_s\ge2f_h$ 就是"只保留主带"的条件）。
>
> 顺带说明了为什么 z 变换里"频率轴是圆的"：**单位圆是 $s$ 平面上那条无限长的 $j\Omega$ 轴被无穷次缠绕的结果**。

## 稳定性判据的迁移

| 系统类型 | 连续（Laplace，$H(s)$） | 离散（$z$，$H(z)$） |
| --- | --- | --- |
| 稳定 | 极点全在**左半平面** | 极点全在**单位圆内** |
| 临界（振荡／积分） | 极点在虚轴上（单阶） | 极点在单位圆上（单阶） |
| 不稳定 | 有极点在右半平面 | 有极点在单位圆外 |
| 稳定 + 因果 | $\operatorname{Re}(s_p)<0$，ROC 含虚轴 | $\lvert z_p\rvert<1$，ROC 含单位圆 |

> [!tip] 为什么"稳定"要翻译成"极点位置"
> $H(z)$ 的分母因式是 $\prod(1-z_pz^{-1})$，每个极点 $z_p=re^{j\theta}$ 贡献一个模态 $r^{\,n}$（或 $r^n\cos\theta n$）。
> - $r<1$：模态衰减 → 冲激响应绝对可和 → 稳定；
> - $r>1$：模态发散 → 不稳定。
>
> 于是"$\sum\lvert h(n)\rvert<\infty$"这个**分析判据**（第 1 章）升级成了"**看极点模值**"这个**几何判据**（本章）——这是本章最实用的一次升级。

> [!note] 双线性变换：另一种"不必绕圈"的映射（第 6 章预告）
> $z=e^{sT}$ 的缺点是**多值**（会混叠）。工程上设计 IIR 滤波器时常用**双线性变换**（bilinear transform）：
> $$
> s=\frac{2}{T}\cdot\frac{z-1}{z+1}\qquad\Longleftrightarrow\qquad z=\frac{1+\frac{sT}{2}}{1-\frac{sT}{2}}
> $$
> 它把整个 $j\Omega$ 轴**单值**映到单位圆（不混叠），代价是**频率非线性畸变**（$\Omega=\frac{2}{T}\tan\frac{\omega}{2}$，需要"预畸变"校正）。**"不混叠"与"频率线性"不可兼得**，这是第 6 章脉冲响应不变法与双线性变换法之争的数学根源。

# 3. 离散时间傅里叶变换(DTFT)--序列的傅里叶变换

## 定义与存在条件

> [!info] Def 4 离散时间傅里叶变换
> 序列 $x(n)$ 的**离散时间傅里叶变换**（discrete-time Fourier transform，简称 DTFT）为
> $$
> X(e^{j\omega})=\sum_{n=-\infty}^{\infty}x(n)\,e^{-j\omega n}
> $$
> 反变换（**IDTFT**）为
> $$
> x(n)=\frac{1}{2\pi}\int_{-\pi}^{\pi}X(e^{j\omega})\,e^{j\omega n}\,d\omega
> $$
> $\omega$ 是**数字频率**（无量纲），$X(e^{j\omega})$ 是 $\omega$ 的**连续、以 $2\pi$ 为周期**的复函数。

三种"存在条件"对应三类序列（**命题前必须先判断序列属于哪一类**）：

| 条件 | 序列类型 | $X(e^{j\omega})$ 的形态 |
| --- | --- | --- |
| $\sum\lvert x(n)\rvert<\infty$（绝对可和） | 能量序列（且绝对可和） | 连续函数，**一致收敛** |
| $\sum\lvert x(n)\rvert^{2}<\infty$（能量有限） | 能量序列 | 均方收敛（个别点可发散） |
| 周期／常数等功率序列 | 功率序列 | 必须**带冲激**（如 $\cos\omega_0 n$ 的谱是 $\delta$ 谱线） |

> [!tip] 与 z 变换的关系（本章第二个核心公式）
> $$
> X(e^{j\omega})=X(z)\Big\lvert_{z=e^{j\omega}}
> $$
> **DTFT 就是 z 变换在单位圆上的截面。** 由此立刻得到一条判据：
> $$
> \text{单位圆} \subset \text{ROC}\quad\Longleftrightarrow\quad \sum\lvert x(n)\rvert<\infty\quad\Longleftrightarrow\quad \text{DTFT 连续存在}
> $$
> 所以"某序列的 DTFT 是否存在"这类题，等价于"**看它 z 变换的极点在不在单位圆内**"——第 4 节和第 6、7 章会一直用这条。
>
> 反过来，DTFT 也解释了 z 变换的**周期性**：$X(e^{j\omega})=X(e^{j(\omega+2\pi)})$，因为 $z=e^{j\omega}$ 转一圈回到原处。

## 常用 DTFT 对

| $x(n)$ | $X(e^{j\omega})$ | 备注 |
| --- | --- | --- |
| $\delta(n)$ | $1$ | 全频带等幅 |
| $\delta(n-n_0)$ | $e^{-j\omega n_0}$ | 纯线性相位 |
| $1\ (-\infty<n<\infty)$ | $2\pi\displaystyle\sum_{k}\delta(\omega-2\pi k)$ | 直流谱线 |
| $e^{j\omega_0 n}$ | $2\pi\displaystyle\sum_{k}\delta(\omega-\omega_0-2\pi k)$ | 数字频率的谱线 |
| $\cos(\omega_0 n)$ | $\pi\displaystyle\sum_{k}\big[\delta(\omega-\omega_0-2\pi k)+\delta(\omega+\omega_0-2\pi k)\big]$ | 一对谱线 |
| $u(n)$ | $\dfrac{1}{1-e^{-j\omega}}+\pi\displaystyle\sum_{k}\delta(\omega-2\pi k)$ | 通带 + 直流冲激 |
| $R_N(n)$ | $e^{-j\omega\frac{N-1}{2}}\dfrac{\sin(\omega N/2)}{\sin(\omega/2)}$ | **Dirichlet 核**，主瓣宽 $4\pi/N$ |
| $a^{\,n}u(n)\ (\lvert a\rvert<1)$ | $\dfrac{1}{1-ae^{-j\omega}}$ | 一阶低通原型 |
| $a^{\,n}\cos(\omega_0 n)u(n)$ | 由表 2-1 取 $z=e^{j\omega}$ | 二阶谐振峰 |

> [!tip] 为什么 $R_N(n)$ 的谱最值得研究
> $\lvert X\rvert=\left\lvert\frac{\sin(\omega N/2)}{\sin(\omega/2)}\right\rvert$ 是**矩形窗的谱**：主瓣宽 $4\pi/N$（即 $2\pi/N$ 的"半宽"），旁瓣约 $-13$ dB。
> 第 3 章"加窗造成的频谱泄漏"、第 7 章"窗函数法设计 FIR"全都建立在它之上——**矩形窗是最"锋利"也最"脏"的窗**（主瓣最窄、旁瓣最高）。

## DTFT 的性质

| 性质 | 序列 | DTFT |
| --- | --- | --- |
| 线性 | $ax(n)+by(n)$ | $aX(e^{j\omega})+bY(e^{j\omega})$ |
| **时移** | $x(n-n_0)$ | $e^{-j\omega n_0}X(e^{j\omega})$ |
| **频移（调制）** | $e^{j\omega_0 n}x(n)$ | $X\big(e^{j(\omega-\omega_0)}\big)$ |
| 翻转 | $x(-n)$ | $X(e^{-j\omega})$ |
| 共轭 | $x^{*}(n)$ | $X^{*}(e^{-j\omega})$ |
| 乘 $n$ | $n\,x(n)$ | $j\dfrac{dX(e^{j\omega})}{d\omega}$ |
| **时域卷积** | $x(n)*y(n)$ | $X(e^{j\omega})Y(e^{j\omega})$ |
| **频域卷积** | $x(n)\,y(n)$ | $\dfrac{1}{2\pi}\displaystyle\int_{-\pi}^{\pi}X(e^{j\theta})Y(e^{j(\omega-\theta)})d\theta$ |
| 帕塞瓦尔 | $\displaystyle\sum_{n}\lvert x(n)\rvert^{2}$ | $\dfrac{1}{2\pi}\displaystyle\int_{-\pi}^{\pi}\lvert X(e^{j\omega})\rvert^{2}d\omega$ |

> [!tip] 两条"对偶"关系，是全书最漂亮的一处对称
> $$
> \text{时域卷积}\ \longleftrightarrow\ \text{频域相乘}\qquad\qquad \text{时域相乘（加窗）}\ \longleftrightarrow\ \text{频域卷积（平滑／泄漏）}
> $$
> 这条对称在第 3、4 章会反复出现：**DFT 是"时域周期延拓 + 频域采样"的双重对称**，而 FFT 只是它的快速算法。

## 共轭对称性与实序列的频谱

> [!info] Def 5 共轭对称性的基本关系
> 对**任意复序列** $x(n)$，设 $X(e^{j\omega})=\mathrm{DTFT}[x(n)]$，则
> $$
> x^{*}(n)\ \longleftrightarrow\ X^{*}(e^{-j\omega}),\qquad x^{*}(-n)\ \longleftrightarrow\ X^{*}(e^{j\omega})
> $$
> 简写为 $x^{*}(n)\leftrightarrow X^{*}(-\omega)$、$x^{*}(-n)\leftrightarrow X^{*}(\omega)$（记 $X(\omega)\triangleq X(e^{j\omega})$）。
> 两条可以合读为：**时域"共轭" ↔ 频域"共轭 + 翻频"；时域"翻频 + 共轭" ↔ 频域"共轭"**——共轭与翻转在时域、频域之间正好互换。

> [!note] 四个基本动作放在一起看
> | 时域 | 频域 | 说明 |
> | --- | --- | --- |
> | $x(n)$ | $X(e^{j\omega})$ | 原始序列 |
> | $x^{*}(n)$ | $X^{*}(e^{-j\omega})$ | 时域取共轭，频域取共轭并翻频 |
> | $x(-n)$ | $X(e^{-j\omega})$ | 时域翻转，频域翻转 |
> | $x^{*}(-n)$ | $X^{*}(e^{j\omega})$ | 时域共轭并翻转，频域只取共轭 |
>
> **共轭与翻转是两个独立操作**：时域共轭会同时带来频域共轭与翻频，时域翻转只带来频域翻转。

> [!warning] 最容易混的一对
> $x^{*}(n)\leftrightarrow X^{*}(e^{-j\omega})$，而 $x^{*}(-n)\leftrightarrow X^{*}(e^{j\omega})$。
> 两者只差一个时域翻转，频域的负号位置却相反——把 $x^{*}(n)$ 写成 $X^{*}(e^{j\omega})$ 是最常见的错。

> [!note] 由此得到：共轭对称分量与共轭反对称分量
> 任何序列都可唯一分解为
> $$
> x(n)=x_e(n)+x_o(n),\qquad x_e(n)=\frac{1}{2}\big[x(n)+x^{*}(-n)\big],\qquad x_o(n)=\frac{1}{2}\big[x(n)-x^{*}(-n)\big]
> $$
> 其中 $x_e(n)$ 称为**共轭对称分量**（conjugate-symmetric part，$x_e(n)=x_e^{*}(-n)$），$x_o(n)$ 称为**共轭反对称分量**（conjugate-antisymmetric part，$x_o(n)=-x_o^{*}(-n)$）。

对**实序列** $x(n)$（工程中最常见），有 $x^{*}(n)=x(n)$，代入 Def 5 第一条即得

$$
X(e^{j\omega})=X^{*}(e^{-j\omega})\qquad\Longleftrightarrow\qquad X(e^{-j\omega})=X^{*}(e^{j\omega})
$$

两式只是把 $\omega$ 换成 $-\omega$，**完全等价**。令 $X(e^{j\omega})=R(\omega)+jI(\omega)$，就得到实序列频谱的全部对称性：

| 序列 / 量                           | 对称性             | 表达式                                                         |
| -------------------------------- | --------------- | ----------------------------------------------------------- |
| 实序列                              | 频谱共轭对称          | $X(e^{j\omega})=X^{*}(e^{-j\omega})$                        |
| 实部 $R(\omega)$                   | 偶               | $R(-\omega)=R(\omega)$                                      |
| 虚部 $I(\omega)$                   | 奇               | $I(-\omega)=-I(\omega)$                                     |
| 幅度 $\lvert X(e^{j\omega})\rvert$ | 偶               | $\lvert X(e^{-j\omega})\rvert=\lvert X(e^{j\omega})\rvert$  |
| 相位 $\arg X(e^{j\omega})$         | 奇（模 $2\pi$）     | $\arg X(e^{-j\omega})\equiv-\arg X(e^{j\omega})\pmod{2\pi}$ |
| 实偶序列                             | $X$ **实且偶**     | —                                                           |
| 实奇序列                             | $X$ **纯虚且奇**    | —                                                           |
| 虚序列                              | $X$ 共轭反对称       | $X(e^{j\omega})=-X^{*}(e^{-j\omega})$                       |
| 复序列的实部 $\operatorname{Re}x(n)$   | 对应 $X$ 的共轭对称部分  | $X_e(e^{j\omega})$                                          |
| 复序列的虚部 $\times j$：$j\operatorname{Im}x(n)$ | 对应 $X$ 的共轭反对称部分 | $X_o(e^{j\omega})$ |
| $X$ 的实部 $\operatorname{Re}X(e^{j\omega})$ | 对应复序列的共轭对称部分 | $x_e(n)$ |
| $X$ 的虚部 $\times j$：$j\operatorname{Im}X(e^{j\omega})$ | 对应复序列的共轭反对称部分 | $x_o(n)$ |

> [!warning] 工程上为什么反复讲这条
> 1. **只需算半条频率轴**：实序列的频谱关于 $\omega=0$ 共轭对称，所以 $\omega\in[0,\pi]$ 就够了——所有 `freqz`、`fft` 的实输入都只画一半，就是这条；
> 2. **幅频必偶、相频必奇**：所以滤波器的幅频特性关于 $\pi$ 对称，设计时只需指定 $[0,\pi]$（第 6、7 章的指标表都只给一半）；
> 3. **相位奇对称 ⟹ 相位在 0 与 $\pi$ 处必然为 0 或 $\pi$**：这解释了为什么零相位滤波器不可因果实现（第 7 章线性相位要"延迟 N/2 拍"来换取对称）。

## 帕塞瓦尔定理与能量谱密度

$$
\sum_{n=-\infty}^{\infty}\lvert x(n)\rvert^{2}=\frac{1}{2\pi}\int_{-\pi}^{\pi}\big\lvert X(e^{j\omega})\big\rvert^{2}d\omega
$$

定义**能量谱密度**（energy spectral density）：

$$
S_{xx}(e^{j\omega})=\big\lvert X(e^{j\omega})\big\rvert^{2},\qquad \sum_n\lvert x(n)\rvert^{2}=\frac{1}{2\pi}\int_{-\pi}^{\pi}S_{xx}(e^{j\omega})\,d\omega
$$

> [!note] 与通信方向的接口
> 这条就是 [[vault-notes/communication/02-deterministic-signals]] 里帕塞瓦尔定理的离散版：**"时域能量 = 频域能量"**，且**能量谱密度只由幅频决定、与相位无关**（相位携带的是"形状/时延"信息，不携带能量信息）。多径信道只改变相位时，能量守恒；而均衡器"补相位"不消耗能量，这也是它最容易做数值不稳的原因。
>
> 对随机信号，$\lvert X\rvert^2$ 要换成**功率谱密度**（维纳–辛钦定理的离散版），这一步在第 3 章之后。

## MATLAB

```matlab
% 矩形窗 R_N 的 DTFT 与解析式对照
N = 8;  n = 0:N-1;  x = ones(1, N);
w = linspace(-pi, pi, 1024);
X_num = x * exp(-1j * n' * w);                    % 直接求和
X_ana = exp(-1j*w*(N-1)/2) .* sin(w*N/2) ./ sin(w/2);   % Dirichlet 核
X_ana(abs(sin(w/2)) < 1e-12) = N;                 % ω = 0 处取极限值 N
max(abs(X_num - X_ana))                           % ≈ 1e-13

% 实序列频谱的共轭对称性
x = randn(1, 20);
X = fft(x);
max(abs(X(1:10) - conj(fliplr(X(12:end)))))       % ≈ 0，只需存一半
```

> [!warning] $\omega=0$ 处的极限
> $\dfrac{\sin(\omega N/2)}{\sin(\omega/2)}$ 在 $\omega=0$ 是 $0/0$，其极限为 $N$。写代码时必须单独处理（上例的第三行），否则会得到 `NaN` 并污染整条曲线——这是做频谱图最常见的"曲线突然断掉"的原因。

# 4. 离散线性移不变系统的频域表征

## 复指数序列是 LSI 系统的特征函数

> [!info] Def 6 频率响应
> 令 LSI 系统的输入为复指数 $x(n)=e^{j\omega n}$，则
> $$
> y(n)=\sum_{m=-\infty}^{\infty}h(m)\,e^{j\omega(n-m)}=e^{j\omega n}\underbrace{\sum_{m=-\infty}^{\infty}h(m)e^{-j\omega m}}_{\text{与 }n\text{ 无关}}\triangleq H(e^{j\omega})\,e^{j\omega n}
> $$
> 即**输出仍是同一个复指数，只是被复常数 $H(e^{j\omega})$ 乘了一下**：
> $$
> e^{j\omega n}\ \xrightarrow{\ \text{LSI}\ }\ H(e^{j\omega})\,e^{j\omega n}
> $$
> $H(e^{j\omega})$ 称为系统的**频率响应**（frequency response）。上式说明 $e^{j\omega n}$ 是 LSI 系统的**特征函数**（eigenfunction），$H(e^{j\omega})$ 是对应的**特征值**（eigenvalue）。

> [!tip] 这一句话是整个频域分析的地基，它带来的三条推论
> 1. **正弦进、正弦出，频率不变**：
>    $$
>    A\cos(\omega_0 n+\varphi)\ \longrightarrow\ \lvert H(e^{j\omega_0})\rvert\,A\cos\big(\omega_0 n+\varphi+\arg H(e^{j\omega_0})\big)
>    $$
>    系统对每个频率只做两件事：**改幅度、改相位**。
> 2. **LSI 系统不会产生新频率**（不产生谐波、不产生互调）。反过来说：**只要输出里出现了输入没有的频率，系统必定非线性**——这是判别线性最省事的频域方法（工程里用双音测试看互调分量）。
> 3. **"设计滤波器"= 设计 $H(e^{j\omega})$ 这条曲线**：想要什么形状，就造什么极零点。第 6、7 章做的全部事情就是"给定希望的 $\lvert H\rvert$ 曲线，反求 $H(z)$ 的系数"。

## 系统函数 $H(z)$

> [!info] Def 7 系统函数
> 在**零状态**条件下，输出的 z 变换与输入的 z 变换之比
> $$
> H(z)=\frac{Y(z)}{X(z)}\Big\lvert_{\text{零状态}}\qquad\Longleftrightarrow\qquad \mathcal{Z}[h(n)]=H(z)
> $$
> 称为系统的**系统函数**（system function，也称转移函数）。它就是冲激响应的 z 变换，因此**$h(n)$ 与 $H(z)$（含 ROC）是一一对应的**。

由差分方程直接读出 $H(z)$（**最常用的一个动作**）：对 $\sum\limits_{k=0}^{N}a_ky(n-k)=\sum\limits_{r=0}^{M}b_rx(n-r)$ 两边取 z 变换并用时移性质：

$$
H(z)=\frac{\sum\limits_{r=0}^{M}b_rz^{-r}}{\sum\limits_{k=0}^{N}a_kz^{-k}}=\frac{b_0\prod\limits_{r=1}^{M}\big(1-c_rz^{-1}\big)}{a_0\prod\limits_{k=1}^{N}\big(1-d_kz^{-1}\big)}
$$

- $c_r$：**零点**（zero）；
- $d_k$：**极点**（pole）——它们只需把分母因式分解就能读出；
- 若 $M>N$，$z=0$ 处还会额外多出 $M-N$ 个零点（来自 $z^{-(M-N)}$ 因子），否则会多出极点。

> [!tip] 四种语言，一张表打通
> | 描述方式 | 形式 | 什么时候用它 |
> | --- | --- | --- |
> | 冲激响应 | $h(n)$ | 判断因果／稳定；算卷积 |
> | **系统函数** | $H(z)$（+ROC） | **判稳定、找极点、解差分方程** |
> | **频率响应** | $H(e^{j\omega})$ | **看通带／阻带、画曲线、算群延迟** |
> | 差分方程 | $\sum a_ky(n-k)=\sum b_rx(n-r)$ | 写代码、画结构图、递推 |
>
> 换算关系：$h(n)\xleftrightarrow{\ \mathcal{Z}\ }H(z)\xrightarrow{\ z=e^{j\omega}\ }H(e^{j\omega})$，而差分方程 $\to H(z)$ 是纯代数（系数直接抄）。

## 幅频、相频、群延迟

$$
H(e^{j\omega})=\big\lvert H(e^{j\omega})\big\rvert\,e^{j\varphi(\omega)}
$$

| 量 | 定义 | 工程意义 |
| --- | --- | --- |
| **幅频特性** | $\lvert H(e^{j\omega})\rvert$（常画 $20\log_{10}\lvert H\rvert$，单位 dB） | 通带／阻带、增益、衰减 |
| **相频特性** | $\varphi(\omega)=\arg H(e^{j\omega})$（一般要 `unwrap`） | 相位失真、时延 |
| **群延迟** | $\tau_g(\omega)=-\dfrac{d\varphi(\omega)}{d\omega}$（单位：**样点**） | 窄带信号**包络**的实际延迟 |

> [!info] Def 8 群延迟
> $$
> \tau_g(\omega)=-\frac{d\arg H(e^{j\omega})}{d\omega}
> $$
> 物理含义：**以 $\omega$ 为中心的窄带（包络缓慢变化）信号经过系统后，包络被延迟了 $\tau_g(\omega)$ 个样点**。
> - $\tau_g$ 为**常数** ⟺ 所有频率延迟相同 ⟺ 波形不发生"相位失真"（形状保持）。理想延迟系统 $H(z)=z^{-n_0}$ 的 $\tau_g=n_0$ 就是这样。
> - 群延迟为**负**意味着"包络超前"，物理上只能靠对某一参考的相位定义实现（如全通均衡器在部分频段）。

> [!tip] 相位失真为什么比幅度失真更"要命"
> 通信里判"波形好不好"看的是**眼图**。幅度失真（通带不平坦）会让某些频点衰减，但**群延迟不为常数会让不同频率成分的到达时间不同**，结果是脉冲被"抹开"、码元互相侵入——这就是**码间串扰**（intersymbol interference，简称 **ISI**）。
> 所以第 7 章设计的 FIR 滤波器**首要指标不是"幅频多陡"，而是"能否做到严格线性相位（群延迟恒为常数）"**。

> [!example] 例：一阶系统的群延迟
> 对 $H(z)=\dfrac{1}{1-az^{-1}}$（$a$ 实，$\lvert a\rvert<1$），可算得
> $$
> \tau_g(\omega)=\frac{a\cos\omega-a^{2}}{1-2a\cos\omega+a^{2}}
> $$
> - 直流处：$\tau_g(0)=\dfrac{a}{1-a}$。取 $a=0.9$ 得 $\tau_g(0)=9$ 个样点；
> - 校验：$h(n)=0.9^nu(n)$ 的"重心"（一阶矩）为 $\dfrac{\sum n\,a^n}{\sum a^n}=\dfrac{a/(1-a)^{2}}{1/(1-a)}=\dfrac{a}{1-a}=9$ ✓
>
> **$a\to1$（极点贴近单位圆）时群延迟 $\to\infty$**：窄带滤波器的代价就是"反应慢"。这不是实现问题，是数学上的必然。

## 因果性与稳定性的 z 域判据

| 性质 | 时域判据（第 1 章） | z 域判据（本章） |
| --- | --- | --- |
| **因果** | $h(n)=0,\ n<0$ | ROC 是**最外层极点之外的圆外区域**（且含 $z=\infty$） |
| **稳定** | $\sum\lvert h(n)\rvert<\infty$ | **ROC 包含单位圆** |
| **因果 + 稳定** | 两者同时成立 | **全部极点在单位圆内**，且 ROC 取 $\lvert z\rvert>\max_k\lvert d_k\rvert$ |

极点位置与冲激响应形态的对照（**做题只画极点图就够了**）：

| 极点位置 | $h(n)$ 的模态 | 系统 |
| --- | --- | --- |
| $\lvert d\rvert<1$，实 | $d^{\,n}$ 单调衰减 | 稳定、一阶低通／高通 |
| $\lvert d\rvert<1$，复（$re^{\pm j\theta}$） | $r^{\,n}\cos(\theta n+\phi)$ 衰减振荡 | 稳定、谐振／带通 |
| $\lvert d\rvert=1$ | 等幅（或线性增长，重根） | **临界**：如 $d=1$ 是累加器、$d=-1$ 是 $(-1)^n$ |
| $\lvert d\rvert>1$ | 发散 | 不稳定 |

> [!warning] 三条极易错的细节
> 1. **"极点全在单位圆内"只是"因果 + 稳定"的判据**，单独说"稳定"其实只看 ROC 含不含单位圆。例如 $h(n)=-a^nu(-n-1)$（$\lvert a\rvert>1$）极点在外、非因果，但**它是稳定的**。
> 2. **有极点在单位圆上不是必不稳定**：$H(z)=\frac{1}{1-z^{-1}}$（累加器）极点在 $z=1$，冲激响应 $u(n)$ 有界不发散，但它**不是 BIBO 稳定**（阶跃输入会线性增长）。区分"有界"与"BIBO 稳定"。
> 3. **零点在单位圆上不影响稳定性**，只让幅频在该频率处为 0（陷波）。

## 零极点矢量法（几何求频率响应）

把 $H(e^{j\omega})$ 写成"从各零点／极点指向单位圆工作点的矢量"之比：

$$
H(e^{j\omega})=A\,\frac{\prod_{r}\big(e^{j\omega}-c_r\big)}{\prod_{k}\big(e^{j\omega}-d_k\big)},\qquad A=\frac{b_0}{a_0}\ \text{（含可能的 }z^{-(M-N)}\text{ 因子）}
$$

于是

$$
\big\lvert H(e^{j\omega})\big\rvert=\lvert A\rvert\,\frac{\prod_r\lvert\vec{q}_r\rvert}{\prod_k\lvert\vec{p}_k\rvert},\qquad \arg H(e^{j\omega})=\arg A+\sum_r\arg\vec{q}_r-\sum_k\arg\vec{p}_k
$$

其中 $\vec{q}_r$ 是"从零点 $c_r$ 指向工作点 $e^{j\omega}$"的矢量，$\vec{p}_k$ 同理。

<svg width="100%" viewBox="0 0 430 245" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12">
  <line x1="70" y1="125" x2="310" y2="125" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="190" y1="10" x2="190" y2="240" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="4 3"/>
  <circle cx="190" cy="125" r="90" fill="none" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <line x1="271" y1="125" x2="235" y2="47.1" stroke="var(--text-accent,#705dcf)" stroke-width="1.2" stroke-dasharray="5 3"/>
  <line x1="145" y1="125" x2="235" y2="47.1" stroke="var(--text-normal,#1f2328)" stroke-width="1.2" stroke-dasharray="5 3"/>
  <circle cx="145" cy="125" r="4.5" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.6"/>
  <line x1="266" y1="120" x2="276" y2="130" stroke="var(--text-accent,#705dcf)" stroke-width="1.8"/>
  <line x1="266" y1="130" x2="276" y2="120" stroke="var(--text-accent,#705dcf)" stroke-width="1.8"/>
  <circle cx="235" cy="47.1" r="3.8" fill="var(--text-normal,#1f2328)"/>
  <text x="139" y="145" text-anchor="end" fill="var(--text-normal,#1f2328)" font-size="11">零点 z = −0.5</text>
  <text x="279" y="145" text-anchor="start" fill="var(--text-accent,#705dcf)" font-size="11">极点 z = 0.9</text>
  <text x="241" y="41.1" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="11">e^{jω}</text>
  <text x="252" y="29" text-anchor="start" fill="var(--text-accent,#705dcf)" font-size="11">|z| = 1</text>
  <text x="215" y="232" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="10.5">|H(e^{jω})| = |A| · Π|零点矢量| ⁄ Π|极点矢量|，相位 = Σ 零点矢量辐角 − Σ 极点矢量辐角</text>
</svg>
*（图片未随站点发布：零极点判断滤波器方法.html）*
> [!tip] 两条"看图说话"的经验法则（考试与工程都好用）
> 1. **工作点走到某个零点附近 → 分子变小 → 幅频凹陷**。零点**恰好落在单位圆上**（$c=e^{j\omega_0}$）则该频率处 $\lvert H\rvert=0$：这就是**陷波器**（notch，用于滤除 50 Hz 工频）。
> 2. **工作点走到某个极点附近 → 分母变小 → 幅频突起**。极点**越靠近单位圆**，峰越尖、谐振越强（$Q$ 越高），同时**群延迟越大**。
>
> 再加一条总纲：**离哪个最近，就最像"被哪个主导"**——低频看直流附近的极零点（$z=1$），高频看 $z=-1$ 附近，带通看单位圆上的角度位置。

## 典型一阶、二阶系统的频率响应

**一阶低通／高通**：$H(z)=\dfrac{1}{1-az^{-1}}$（$\lvert a\rvert<1$），极点在 $z=a$。

$$
\big\lvert H(e^{j0})\big\rvert=\frac{1}{1-a},\qquad \big\lvert H(e^{j\pi})\big\rvert=\frac{1}{1+a}
$$

- $0<a<1$：直流增益最大、$\pi$ 处最小 → **低通**；
- $-1<a<0$：反过来 → **高通**；
- $a\to1$：趋于累加器（低通越来越窄、增益越来越大）；
- $a=0$：$H(z)=1$，全通（无记忆）。

取 $a=0.9$：$\lvert H(j0)\rvert=10$（20 dB）、$\lvert H(j\pi)\rvert=0.526$（$-5.6$ dB），两端相差约 25.6 dB。**一个极点只能做到这么陡**——要更陡就得加极点或加零点。

<svg width="100%" viewBox="0 0 460 196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12">
  <line x1="48" y1="26" x2="48" y2="150" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.8" stroke-dasharray="2 3"/>
  <text x="48" y="164" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">0</text>
  <line x1="137" y1="26" x2="137" y2="150" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.8" stroke-dasharray="2 3"/>
  <text x="137" y="164" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">π/4</text>
  <line x1="226" y1="26" x2="226" y2="150" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.8" stroke-dasharray="2 3"/>
  <text x="226" y="164" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">π/2</text>
  <line x1="315" y1="26" x2="315" y2="150" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.8" stroke-dasharray="2 3"/>
  <text x="315" y="164" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">3π/4</text>
  <line x1="404" y1="26" x2="404" y2="150" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.8" stroke-dasharray="2 3"/>
  <text x="404" y="164" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">π</text>
  <line x1="48" y1="150" x2="404" y2="150" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.8" stroke-dasharray="2 3"/>
  <text x="42" y="154" text-anchor="end" fill="var(--text-muted,#6a737d)" font-size="12">0</text>
  <line x1="48" y1="88" x2="404" y2="88" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.8" stroke-dasharray="2 3"/>
  <text x="42" y="92" text-anchor="end" fill="var(--text-muted,#6a737d)" font-size="12">5</text>
  <line x1="48" y1="26" x2="404" y2="26" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.8" stroke-dasharray="2 3"/>
  <text x="42" y="30" text-anchor="end" fill="var(--text-muted,#6a737d)" font-size="12">10</text>
  <line x1="48" y1="150" x2="416" y2="150" stroke="var(--text-muted,#6a737d)" stroke-width="1.2"/>
  <line x1="48" y1="150" x2="48" y2="20" stroke="var(--text-muted,#6a737d)" stroke-width="1.2"/>
  <text x="420" y="154" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">ω</text>
  <text x="14" y="24" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">|H|</text>
  <path d="M 48.0,26.0 L 51.0,29.7 L 53.9,38.9 L 56.9,50.6 L 59.9,62.0 L 62.8,72.2 L 65.8,80.9 L 68.8,88.1 L 71.7,94.2 L 74.7,99.3 L 77.7,103.6 L 80.6,107.2 L 83.6,110.4 L 86.6,113.2 L 89.5,115.5 L 92.5,117.7 L 95.5,119.5 L 98.4,121.2 L 101.4,122.7 L 104.4,124.0 L 107.3,125.3 L 110.3,126.4 L 113.3,127.4 L 116.2,128.3 L 119.2,129.2 L 122.2,129.9 L 125.1,130.7 L 128.1,131.3 L 131.1,132.0 L 134.0,132.5 L 137.0,133.1 L 140.0,133.6 L 142.9,134.1 L 145.9,134.5 L 148.9,134.9 L 151.8,135.3 L 154.8,135.7 L 157.8,136.1 L 160.7,136.4 L 163.7,136.7 L 166.7,137.0 L 169.6,137.3 L 172.6,137.6 L 175.6,137.8 L 178.5,138.1 L 181.5,138.3 L 184.5,138.5 L 187.4,138.7 L 190.4,138.9 L 193.4,139.1 L 196.3,139.3 L 199.3,139.5 L 202.3,139.7 L 205.2,139.8 L 208.2,140.0 L 211.2,140.1 L 214.1,140.3 L 217.1,140.4 L 220.1,140.5 L 223.0,140.7 L 226.0,140.8 L 229.0,140.9 L 231.9,141.0 L 234.9,141.1 L 237.9,141.2 L 240.8,141.3 L 243.8,141.4 L 246.8,141.5 L 249.7,141.6 L 252.7,141.7 L 255.7,141.8 L 258.6,141.9 L 261.6,141.9 L 264.6,142.0 L 267.5,142.1 L 270.5,142.2 L 273.5,142.2 L 276.4,142.3 L 279.4,142.3 L 282.4,142.4 L 285.3,142.5 L 288.3,142.5 L 291.3,142.6 L 294.2,142.6 L 297.2,142.7 L 300.2,142.7 L 303.1,142.8 L 306.1,142.8 L 309.1,142.9 L 312.0,142.9 L 315.0,142.9 L 318.0,143.0 L 320.9,143.0 L 323.9,143.0 L 326.9,143.1 L 329.8,143.1 L 332.8,143.1 L 335.8,143.2 L 338.7,143.2 L 341.7,143.2 L 344.7,143.2 L 347.6,143.3 L 350.6,143.3 L 353.6,143.3 L 356.5,143.3 L 359.5,143.3 L 362.5,143.4 L 365.4,143.4 L 368.4,143.4 L 371.4,143.4 L 374.3,143.4 L 377.3,143.4 L 380.3,143.4 L 383.2,143.4 L 386.2,143.5 L 389.2,143.5 L 392.1,143.5 L 395.1,143.5 L 398.1,143.5 L 401.0,143.5 L 404.0,143.5" fill="none" stroke="var(--text-accent,#705dcf)" stroke-width="1.8"/>
  <path d="M 48.0,143.5 L 51.0,143.5 L 53.9,143.5 L 56.9,143.5 L 59.9,143.5 L 62.8,143.5 L 65.8,143.5 L 68.8,143.4 L 71.7,143.4 L 74.7,143.4 L 77.7,143.4 L 80.6,143.4 L 83.6,143.4 L 86.6,143.4 L 89.5,143.4 L 92.5,143.3 L 95.5,143.3 L 98.4,143.3 L 101.4,143.3 L 104.4,143.3 L 107.3,143.2 L 110.3,143.2 L 113.3,143.2 L 116.2,143.2 L 119.2,143.1 L 122.2,143.1 L 125.1,143.1 L 128.1,143.0 L 131.1,143.0 L 134.0,143.0 L 137.0,142.9 L 140.0,142.9 L 142.9,142.9 L 145.9,142.8 L 148.9,142.8 L 151.8,142.7 L 154.8,142.7 L 157.8,142.6 L 160.7,142.6 L 163.7,142.5 L 166.7,142.5 L 169.6,142.4 L 172.6,142.3 L 175.6,142.3 L 178.5,142.2 L 181.5,142.2 L 184.5,142.1 L 187.4,142.0 L 190.4,141.9 L 193.4,141.9 L 196.3,141.8 L 199.3,141.7 L 202.3,141.6 L 205.2,141.5 L 208.2,141.4 L 211.2,141.3 L 214.1,141.2 L 217.1,141.1 L 220.1,141.0 L 223.0,140.9 L 226.0,140.8 L 229.0,140.7 L 231.9,140.5 L 234.9,140.4 L 237.9,140.3 L 240.8,140.1 L 243.8,140.0 L 246.8,139.8 L 249.7,139.7 L 252.7,139.5 L 255.7,139.3 L 258.6,139.1 L 261.6,138.9 L 264.6,138.7 L 267.5,138.5 L 270.5,138.3 L 273.5,138.1 L 276.4,137.8 L 279.4,137.6 L 282.4,137.3 L 285.3,137.0 L 288.3,136.7 L 291.3,136.4 L 294.2,136.1 L 297.2,135.7 L 300.2,135.3 L 303.1,134.9 L 306.1,134.5 L 309.1,134.1 L 312.0,133.6 L 315.0,133.1 L 318.0,132.5 L 320.9,132.0 L 323.9,131.3 L 326.9,130.7 L 329.8,129.9 L 332.8,129.2 L 335.8,128.3 L 338.7,127.4 L 341.7,126.4 L 344.7,125.3 L 347.6,124.0 L 350.6,122.7 L 353.6,121.2 L 356.5,119.5 L 359.5,117.7 L 362.5,115.5 L 365.4,113.2 L 368.4,110.4 L 371.4,107.2 L 374.3,103.6 L 377.3,99.3 L 380.3,94.2 L 383.2,88.1 L 386.2,80.9 L 389.2,72.2 L 392.1,62.0 L 395.1,50.6 L 398.1,38.9 L 401.0,29.7 L 404.0,26.0" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.8" stroke-dasharray="6 4"/>
  <line x1="56" y1="180" x2="84" y2="180" stroke="var(--text-accent,#705dcf)" stroke-width="2"/>
  <text x="90" y="184" text-anchor="start" fill="var(--text-accent,#705dcf)" font-size="11.5">a = 0.9（低通）</text>
  <line x1="236" y1="180" x2="264" y2="180" stroke="var(--text-normal,#1f2328)" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="270" y="184" text-anchor="start" fill="var(--text-normal,#1f2328)" font-size="11.5">a = −0.9（高通）</text>
</svg>

**一阶差分（去加重／预加重）**：$H(z)=1-bz^{-1}$，零点在 $z=b$。

- $0<b<1$：零点在正实轴 → 高频相对抬升 → **高通**（$b=1$ 时 $H(z)=1-z^{-1}$，在 $\omega=0$ 完全置零，即"去直流"）；
- 工程上的**预加重 / 去加重**就是这一对：发送端用 $1-bz^{-1}$ 抬高频，接收端用 $1/(1-bz^{-1})$ 压回来，净效果是**把高频的信噪比提上来**（调频广播、语音编码都这么做）。

**二阶谐振器（带通）**：$H(z)=\dfrac{1}{1-2r\cos\theta\,z^{-1}+r^{2}z^{-2}}$，共轭极点在 $re^{\pm j\theta}$。

- 幅频峰值出现在 $\omega\approx\theta$ 附近（$\theta$ 不靠近 $0$ 或 $\pi$ 时几乎就在 $\theta$）；
- **3 dB 带宽**近似为 $\;2(1-r)$ rad、**品质因数** $Q\approx\dfrac{\theta}{2(1-r)}$；
- $r\to1$ 则峰变尖锐、群延迟变大；$r$ 太接近 1 时定点实现的舍入误差会让它**自激或产生极限环**——这是 FPGA/DSP 上做窄带滤波最常踩的坑。

> [!warning] 关于"峰值位置"的一个常见误解
> 峰值并不严格在 $\omega=\theta$，而是略偏向 $0$ 一侧（因为 $\lvert e^{j\omega}-\text{极点}\rvert$ 最小处附近的几何关系被另一个共轭极点与 $z^{-2}$ 的常数项共同影响）。**对 $\theta$ 靠近 $0$ 或 $\pi$ 的设计，这个偏移会明显到不能用 $\theta$ 近似**。工程上靠数值扫描（`freqz` 找最大值）确认，别手算。

## 全通系统与最小相位系统

> [!info] Def 9 全通系统
> 幅频恒为常数的系统：$\big\lvert H_{ap}(e^{j\omega})\big\rvert=1,\ \forall\omega$。
> 一阶全通的标准形式（极点在 $z=a$、零点在 $z=1/a$，二者互为倒数共轭）：
> $$
> H_{ap}(z)=\frac{z^{-1}-a}{1-az^{-1}},\qquad \lvert a\rvert<1
> $$
> **只改相位、不改幅度**，因此专用于**相位均衡**（把非线性相位"拉平"，或合成 90° 相移网络）。

> [!info] Def 10 最小相位系统
> 所有**零点也都在单位圆内**的系统称为**最小相位系统**（minimum-phase system）。三条等价好处：
> 1. **逆系统也因果稳定**（因为 $1/H(z)$ 的极点 $=$ 原系统的零点，全在圆内）；
> 2. 在**相同的幅频特性**下，它的**能量最集中在 $n=0$ 附近**（群延迟最小）；
> 3. 其相位变化量（相位滞后）最小。
>
> 任何有理系统都可分解为
> $$
> H(z)=H_{\min}(z)\cdot H_{ap}(z)
> $$
> **"幅频"归最小相位部分，"多余相位"归全通部分。** 这就是通信里**信道均衡**的标准做法：把信道 $H_{ch}$ 分解后，用 $1/H_{\min}$（通道补偿）+ 全通（相位拉平）完成均衡。

> [!note] 与第 6、7 章的接口
> - **IIR 设计**（第 6 章）本质上是在"极点—零点地图"上摆位置，并且**永远要把极点放进单位圆内**（本章的稳定判据）；
> - **FIR 设计**（第 7 章）之所以特别受欢迎，是因为它的 $H(z)=\sum_{n=0}^{N-1}h(n)z^{-n}$ 极点全在原点（**永远稳定**），而且只要 $h(n)$ 对称就能做到**严格线性相位**（群延迟恒为 $(N-1)/2$）。本章 4.2 节的三个量（幅频、相频、群延迟）就是这两章的全部设计指标。

## MATLAB

```matlab
% 一阶系统 H(z) = 1/(1 − 0.9 z^-1)
b = 1;  a = [1 -0.9];
[H, w] = freqz(b, a, 512);
mag_dB  = 20*log10(abs(H));
gd      = -gradient(unwrap(angle(H)), w);      % 群延迟（样点）
gd(1)                                          % ≈ 9 = a/(1−a)
mag_dB(1)                                      % ≈ 20 = 20log10(1/(1−a))
zplane(b, a)                                   % 极点 0.9 在单位圆内 → 因果稳定

% 二阶谐振器：极点 re^{±jθ}，r = 0.95，θ = π/4
r = 0.95; th = pi/4;
a2 = [1, -2*r*cos(th), r^2];
[H2, w2] = freqz(1, a2, 2048);
[~, idx] = max(abs(H2));
w2(idx)/pi                                     % 峰值位置 ≈ 0.25 = θ/π
2*(1-r)                                        % 3 dB 带宽 ≈ 0.1 rad
th/(2*(1-r))                                   % Q ≈ 7.85

% 全通：|H| 恒为 1
bap = [-0.5, 1];  aap = [1, -0.5];             % H(z) = (z^-1 − 0.5)/(1 − 0.5 z^-1)
Hap = freqz(bap, aap, 512);
max(abs(abs(Hap) - 1))                         % ≈ 1e-16
```

> [!note] 用 `freqz` 之外的两个习惯
> 1. **画 dB 而不是线性幅度**：人耳、链路预算、滤波器指标表全部用 dB（$20\log_{10}$）；线性幅度图上"0.9 与 1.0 的差别"几乎看不见，在 dB 上却是 0.9 dB。
> 2. **相频必须 `unwrap`**：`angle` 只给主值 $(-\pi,\pi]$，跨过 $\pm\pi$ 会跳变，直接求差分会得到假的群延迟尖峰。**先 `unwrap`，再 `gradient`。**

> [!tip] 本章收官
> 第 2 章的四节是一条"换坐标系"的故事：
> 1. **z 变换**（2.1）：给 DTFT 加一个衰减旋钮 $r^{-n}$，得到 $X(z)=\sum x(n)z^{-n}$；**代价是必须随身携带 ROC**，收益是**卷积变乘法**、差分方程变有理函数。
> 2. **$s\to z$ 映射**（2.2）：$z=e^{sT}$ 揭示 z 变换就是"抽样信号的 Laplace 变换"，于是"左半平面 ↔ 单位圆内"、"虚轴 ↔ 单位圆"、"一条横带 ↔ 整张平面（混叠）"全部对上。
> 3. **DTFT**（2.3）：把 $z$ 限制在单位圆上，$X(e^{j\omega})=X(z)\lvert_{z=e^{j\omega}}$——它是"离散序列的频谱"，连续、以 $2\pi$ 为周期，实序列还有共轭对称。
> 4. **频域表征**（2.4）：复指数是 LSI 的特征函数，于是 $H(e^{j\omega})$ 完整刻画系统；"因果 + 稳定"翻译成"极点全在单位圆内"；零极点矢量法让 $H(e^{j\omega})$ 的形状可以"看图说话"。
>
> 一句话：**第 1 章造出卷积，第 2 章把卷积变成乘法，并顺手把稳定性变成一个几何问题——极点在不在单位圆内。**
>
> 但还有一块空白：$X(e^{j\omega})$ 是**连续**函数，计算机算不了；而计算机需要的是"有限长、离散的频谱"。补上这块空白的就是第 3 章 DFT。

# 5. 回顾判断 LSI 性质的方法总结

> [!abstract] 这一节解决什么问题
> [[vault-notes/dsp/01-discrete-time-systems]] 从"系统"角度、本章从"z 域"角度分别判过线性、移不变、因果、稳定。这里把它们并排：**每条性质只留一个可执行的检验动作**，并给出时域、z 域两套等价判据。做题顺序永远是"先判性质，再选判据"。

## 四个性质互不包含

| 性质 | 定义（对任意输入成立） | 一句话检验 |
| --- | --- | --- |
| **线性** | $T[ax_1+bx_2]=aT[x_1]+bT[x_2]$ | $x$ 只能以"一次幂、无常数项"出现 |
| **移不变** | $T[x(n-n_0)]=y(n-n_0)$ | 系统里没有"自己的时钟"（无显式 $n$） |
| **因果** | $y(n_0)$ 只由 $\{x(n),\,n\le n_0\}$ 决定 | $h(n)=0,\ n<0$ |
| **稳定（BIBO）** | 有界输入 → 有界输出 | $\sum_n\lvert h(n)\rvert<\infty$ |

> [!warning] 最常见的误解
> **"LSI"只等于"线性 + 移不变"**，不包含因果与稳定。四者相互独立：$y(n)=x^2(n)$ 移不变但非线性；$y(n)=x(-n)$ 线性但非移不变；累加器因果但不稳定；$\lvert a\rvert>1$ 的 $h(n)=a^nu(n)$ 不稳定但因果。
> 工程上"可实现"才要求**因果 + 稳定**；LSI 只保证"系统能被 $h(n)$ 与卷积完全描述"。

## 线性：一条判据，两个秒判

$$
T[a\,x_1(n)+b\,x_2(n)]=a\,T[x_1(n)]+b\,T[x_2(n)]
$$

**检验动作**：把输出里的 $x$ 全部换成 $a x_1+b x_2$，看能否把 $a,b$ 提出来。

| 系统 | 结论 | 原因 |
| --- | --- | --- |
| $y(n)=3x(n)+5$ | **非线性** | 常数项破坏齐次性，且 $T[0]=5\ne0$ |
| $y(n)=x^2(n)$、$\lvert x(n)\rvert$ | **非线性** | 平方／绝对值不满足齐次性 |
| $y(n)=x(n)x(n-1)$ | **非线性** | 两个 $x$ 相乘（互调） |
| $y(n)=x(n)\cos(\omega_0 n)$ | **线性** | 系数与 $x$ 无关，可提出 |
| $y(n)=\sum_{m=-\infty}^{n}x(m)$ | **线性** | 求和是线性运算 |

> [!tip] 两个秒判
> 1. **线性系统必有 $T[0]=0$**：表达式带独立常数项（如 $+5$）直接判非线性。
> 2. **$x$ 只能一次幂**：$x^2$、$\lvert x\rvert$、$x\cdot x$、$\sin x$、$\log x$ 全部出局。

## 移不变：只看有没有"显式时间"

$$
T[x(n-n_0)]=y(n-n_0)\qquad\forall n_0
$$

**检验动作**：分别算 $y(n-n_0)$ 与 $T[x(n-n_0)]$，两者相同才是移不变。

| 系统 | 移不变？ | 原因 |
| --- | --- | --- |
| $y(n)=x^2(n)$ | 是 | 逐点运算，与时序无关 |
| $y(n)=x(n)\cos(\omega_0 n)$ | **否** | 载波随时间变（调制器） |
| $y(n)=n\,x(n)$ | **否** | 增益随 $n$ 线性增长 |
| $y(n)=x(-n)$ | **否** | 时间反转 |
| $y(n)=x(2n)$、$x(n/2)$ | **否** | 抽取／插值 |

> [!tip] 一句话
> **输出里凡出现显式的 $n$（$n x(n)$、$\cos(\omega_0 n)x(n)$、$x(2n)$、$x(n^2)$），就不是移不变**；只有 $x(\cdot)$ 的固定延迟组合，才可能是移不变。

## 因果性：时域看 $h(n)$，z 域看 ROC 位置

| 判据 | 形式 | 适用场合 |
| --- | --- | --- |
| 时域（LSI） | $h(n)=0,\quad n<0$ | 已知 $h(n)$ |
| 差分方程 | 只用到 $x(n),x(n-1),\dots$ 与 $y(n-1),\dots$，不用未来值 | 已知方程 |
| z 域（有理 $H$） | ROC 是**最外层极点之外的圆外区域，且含 $z=\infty$** | 已知 $H(z)$ **与 ROC** |
| 结构图 | 没有未来支路（无 $x(n+k)$、$y(n+k)$） | 已知框图 |

> [!warning] 三个容易错的地方
> 1. **只看 $H(z)$ 不能判因果**，必须带 ROC：$a^nu(n)$ 与 $-a^nu(-n-1)$ 的 $H(z)$ 完全相同，一个因果、一个反因果。
> 2. **$z=\infty$ 在不在 ROC 里**是"因果"的 z 域标志；"稳定"看的是单位圆，不要把两者混用。
> 3. 反馈不是"非因果"：$y(n)=ay(n-1)+x(n)$ 有反馈但仍然因果，因为它只用过去。

## 稳定性：绝对可和 ⇔ ROC 含单位圆

| 判据 | 形式 | 适用场合 |
| --- | --- | --- |
| 时域（LSI，充要） | $\displaystyle\sum_{n=-\infty}^{\infty}\lvert h(n)\rvert<\infty$ | 已知 $h(n)$ |
| z 域（充要） | **ROC 包含单位圆** | 已知 ROC |
| 有理 $H$ + 已判因果 | **全部极点满足 $\lvert p_i\rvert<1$** | 已知 $H(z)$ |
| 频域 | $H(e^{j\omega})$ 存在（DTFT 收敛） | 需要频率响应时 |

> [!tip] 直读 $h(n)$ 的四条
> - $h(n)$ **有限长** → 必稳定；
> - $h(n)=a^nu(n)$ → 稳定 ⟺ $\lvert a\rvert<1$；
> - $h(n)=u(n)$、$h(n)=n\,u(n)$ → 不稳定；
> - $h(n)=a^nu(-n-1)$（左边序列）→ 稳定 ⟺ $\lvert a\rvert>1$（包络向 $n\to-\infty$ 衰减）。

> [!warning] 三个极易错的细节
> 1. **"极点全在单位圆内"只是"因果 + 稳定"的判据**；单独说稳定，只看 ROC 含不含单位圆。反例：$h(n)=-a^nu(-n-1)$（$\lvert a\rvert>1$）极点在外、非因果，但稳定。
> 2. **极点在单位圆上 ≠ 必不稳定**：累加器极点在 $z=1$，$h(n)=u(n)$ 有界，但不是 BIBO 稳定（阶跃输入会线性增长）。要区分"有界"与"BIBO 稳定"。
> 3. **零点在单位圆上不影响稳定性**，只让该频率处幅频为 $0$（陷波）。

## 范例系统：把四条性质一次看全

| 系统 | $h(n)$ | 因果 | 稳定 |
| --- | --- | --- | --- |
| 移动平均 $\frac{1}{M}\sum_{k=0}^{M-1}x(n-k)$ | $\frac{1}{M}R_M(n)$ | 是 | **是**（有限长） |
| 累加器 $\sum_{m=-\infty}^{n}x(m)$ | $u(n)$ | 是 | **否** |
| 一阶递归 $y(n)=ay(n-1)+x(n)$ | $a^nu(n)$ | 是 | $\lvert a\rvert<1$ 时是 |
| 反因果 $\sum_{m=n}^{\infty}x(m)$ | $u(-n)$ | **否** | 否 |
| 纯延迟 $y(n)=x(n-N)$ | $\delta(n-N)$ | $N\ge0$ 时是 | 是 |
| 左边序列 $h(n)=a^nu(-n-1)$ | $a^nu(-n-1)$ | **否** | $\lvert a\rvert>1$ 时是 |

## 综合判据与做题流程

| 性质 | 时域判据 | z 域判据 | 方程／结构判据 |
| --- | --- | --- | --- |
| 线性 | 满足叠加，$T[0]=0$ | — | 无 $x^2$、$\lvert x\rvert$、$x\cdot x$、常数项 |
| 移不变 | $T[x(n-n_0)]=y(n-n_0)$ | 系数不随 $n$ 变 | 无显式 $n$、无抽取／插值／反转 |
| 因果 | $h(n)=0,\ n<0$ | ROC 在最外层极点外且含 $\infty$ | 无未来支路 |
| 稳定 | $\sum\lvert h(n)\rvert<\infty$ | ROC 含单位圆 | 因果时：极点全在圆内 |

> [!tip] 推荐做题顺序
> 1. **先判线性、移不变**，确认能否用 $h(n)$ 与卷积；
> 2. 差分方程 → 写 $H(z)$ → 分母因式分解得极点；
> 3. **先定 ROC**（右边？左边？双边？），再判稳定；
> 4. 反求 $h(n)$，用"绝对可和"与"极点位置"互相校验。

| 已知条件 | 最省事的路径 |
| --- | --- |
| $h(n)$ | 直接看 $h(n)=0\ (n<0)$ 与 $\sum\lvert h(n)\rvert$ |
| 差分方程 | 先写 $H(z)$ 定极点与 ROC，再反求 $h(n)$ 校验 |
| $H(z)$ 表达式 | **必须配 ROC**；ROC 判左右与稳定，极点判 $h(n)$ 形状 |
| 零极点图 | 极点圆内／圆上／圆外 → 衰减／临界／发散；零点只影响凹陷 |
| 结构图 | 看有无反馈、有无未来支路、系数是否随 $n$ 变 |

> [!note] 与第 6、7 章的接口
> - **IIR 设计（第 6 章）**：本质是在极零点地图上摆位置，**永远把极点放进单位圆内**；
> - **FIR 设计（第 7 章）**：$H(z)=\sum_{n=0}^{N-1}h(n)z^{-n}$ 的极点全在原点，**天生稳定**；$h(n)$ 对称还能做到严格线性相位（群延迟恒为 $(N-1)/2$）。

# 本章知识地图

```
z 变换与 DTFT：从卷积到乘法
  ├─ 2.1 序列的 z 变换
  │     ├── 动机：DTFT 的收敛条件太苛刻 ⇒ 乘衰减因子 r^-n ⇒ z = re^{jω}
  │     ├── 双边定义：X(z) = Σ x(n) z^-n；逆变换 = 围线积分 ∮X(z)z^(n-1)dz
  │     ├── 单边 z 变换：x(n−1) ↔ z^-1X₁(z)+x(−1)，专治"带初始条件的差分方程"
  │     ├── ROC：右边→圆外／左边→圆内／双边→环；以原点为中心的环；不含极点
  │     │        因果 ⟺ ROC 是圆外且含 ∞；稳定 ⟺ ROC 含单位圆
  │     ├── 反变换：留数法（∮，注意 z^(n-1)）／部分分式（先除 z）／长除法
  │     ├── 表 2-2：性质（线性／移位／乘指数 aⁿ／翻转／乘 n／卷积／部分和／初值终值）
  │     └── 表 2-1：常用变换对（δ、u、aⁿu(n)、naⁿu(n)、R_N、正余弦、衰减正余弦）
  │
  ├─ 2.2 s 平面与 z 平面的映射
  │     ├── 来历：抽样信号的 Laplace 变换 X̂ₐ(s) = X(z)|_{z=e^{sT}}
  │     ├── 分解：s = σ+jΩ ⇒ |z| = e^{σT}，∠z = ΩT
  │     ├── 六条对应：虚轴↔单位圆／左半↔圆内／右半↔圆外／Ω=0↔z=1／±Ωₛ/2↔z=−1
  │     ├── 多值性：宽 2π/T 的横带 → 整张 z 平面（= 混叠的几何解释）
  │     ├── 稳定性迁移：Re(s_p) < 0 ⟺ |z_p| < 1
  │     └── 对照：双线性变换（单值、不混叠，但频率非线性畸变，第 6 章）
  │
  ├─ 2.3 DTFT
  │     ├── 定义：X(e^{jω}) = Σx(n)e^{-jωn}；反变换 = (1/2π)∫_{-π}^{π}
  │     ├── 存在条件：绝对可和（一致收敛）／能量有限（均方）／功率序列（带冲激）
  │     ├── 与 z 的关系：X(e^{jω}) = X(z)|_{z=e^{jω}}（要求 ROC ⊃ 单位圆）
  │     ├── 常用对：δ／常数／e^{jω₀n}／cos／u(n)／R_N（Dirichlet 核）／aⁿu(n)
  │     ├── 性质：时移／频移／卷积↔相乘／帕塞瓦尔／频域微分
  │     ├── 共轭对称：x*(n) ↔ X*(-ω)、x*(-n) ↔ X*(ω)；实序列幅度偶、相位奇，只需算一半频率轴
  │     └── 能量谱密度 S_xx = |X|²，时域能量 = 频域能量
  │
  └─ 2.4 离散 LSI 系统的频域表征
        ├── 特征函数：e^{jωn} → H(e^{jω})e^{jωn}（正弦进、正弦出；LSI 不生成新频率）
        ├── 系统函数：H(z) = Y(z)/X(z)（零状态）= Z[h(n)]
        │         由差分方程直读：H(z) = Σbᵣz^{-r} / Σaₖz^{-k}
        ├── 三个量：幅频 |H|（dB）／相频 arg H（unwrap）／群延迟 τg = −dφ/dω
        ├── 判据：因果 ⟺ ROC 圆外含 ∞；稳定 ⟺ ROC 含单位圆；因果+稳定 ⟺ 极点全在圆内
        ├── 零极点矢量法：|H| = |A|·Π|零点矢量| / Π|极点矢量|；相位 = 辐角之差
        ├── 典型系统：一阶低通/高通（a 的符号）／一阶差分预加重／二阶谐振器（r、θ）
        └── 全通（|H|=1，做相位均衡）与最小相位（零点也在圆内，逆系统可稳定实现）
             任何 H(z) = H_min(z) · H_ap(z) ⇒ 均衡器的标准分解
```

# 关联

- 上一章：[[vault-notes/dsp/01-discrete-time-systems]]
- 下一章：[[vault-notes/dsp/03-discrete-fourier-transform]]

**本章兑现了第 1 章留下的三个悬念**：

| 第 1 章的悬念 | 第 2 章的答案 |
| --- | --- |
| 卷积能不能不算？ | **能**：$x*h\ \longleftrightarrow\ X(z)H(z)$，时域卷、频域乘（2.1 节） |
| $\sum\lvert h(n)\rvert<\infty$ 太抽象 | 翻译成"**极点在不在单位圆内**"（2.4 节），一眼可见 |
| 抽样后"频率是个圆"、$T$ 去哪了？ | $z=e^{sT}=e^{j\omega}$：**单位圆就是频率轴**，$T$ 藏在映射里（2.2 节） |

**本章新留下的悬念（第 3 章结清）**：

| 本章的悬念 | 第 3 章的答案 |
| --- | --- |
| $X(e^{j\omega})$ 是连续函数，计算机算不了，怎么办？ | **频域采样**：只取 $\omega=2\pi k/N$ 的 $N$ 个点 → DFT |
| DTFT 周期连续，那"周期序列"的频谱长什么样？ | 周期序列 $\leftrightarrow$ **离散谱线**，与 DFT 严格对应 |
| 时域卷积变乘法很爽，那"两个序列相乘"怎么快算？ | 频域卷积定理（循环卷积），第 3 章讲清"什么时候循环卷积 = 线性卷积" |

**通信方向应用**：

- [[vault-notes/communication/02-deterministic-signals]] —— 本章的 DTFT 就是那里"频谱密度"的离散版本：傅里叶变换 $S(\omega)\leftrightarrow s(t)$ 对应 $X(e^{j\omega})\leftrightarrow x(n)$；维纳–辛钦定理（自相关 ↔ 功率谱）在离散域就是"$R_{xx}$ 的 DTFT 是功率谱"；而 $\lvert X\rvert^2$ 只与幅频有关这一点，解释了信道估计为什么要分"幅频估计"与"相位跟踪"两条腿走路。
- [[vault-notes/communication/06-digital-baseband]] —— 信道 $H(z)$ 的多径就是它的零点与极点：**深衰落 $=$ 零点靠到单位圆上**。本章的零极点矢量法在此处直接给出工程直觉："信道在某频率凹陷 $\to$ 均衡器要在同一频率抬起（放一个贴近单位圆的极点）"，而"均衡器不稳定的风险"也正是"极点被放到圆外"。线性相位与群延迟恒定的要求，则是"无 ISI 成形滤波器"的前置条件。
- [[vault-notes/communication/09-optimal-reception]] —— 匹配滤波器在频域写作 $H(e^{j\omega})=S^{*}(e^{j\omega})e^{-j\omega n_0}$：**共轭取反相位、指数项补时延**——正是本章"实序列幅频偶、相频奇"与"线性相位 = 纯延迟"两条结论的直接拼装。
- [[vault-notes/communication/07-digital-bandpass]] —— 数字下变频（DDC）实现的就是"频移性质"：乘 $e^{-j\omega_{IF}n}$ 把通带搬到零频；抽取后必须加低通，正是"抽取会把频谱搬回来（混叠）"的 z 域解释（第 8 章展开）。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— OFDM 的频域均衡之所以只需"每个子载波除一个复数 $H_k$"，是因为在本章框架下**信道对每个子载波只是一个复常数**（$H(e^{j\omega_k})$）；循环前缀把"线性卷积"变成"循环卷积"，从而"时域卷积 = 频域乘法"在有限长 DFT 下仍然成立——这条正是第 3 章的核心结论。
- [[vault-notes/fpga/ad9361/ad9361-digital-interface]]／[[vault-notes/fpga/ad9361/iq-signals]] —— 芯片里的 FIR／HB／CIC 抽取滤波链，指标表上写的通带纹波、阻带衰减、群延迟平坦度，全部是本章 4.2 节那三个量的工程化表述。
- [[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]] —— 复指数 $e^{j\omega n}$ 是 LSI 系统的**特征向量**（特征函数），$H(e^{j\omega})$ 是**特征值**：这是线性代数"$A\mathbf{x}=\lambda\mathbf{x}$"在无穷维（序列空间）上的翻版；而"对角化 = 换一组特征基"在这里的对应就是"**傅里叶变换把卷积算子对角化**"——这也是为什么 FFT 能让一大堆时域算法骤然变快。

**相关**：[[vault-notes/dsp/01-discrete-time-systems]]｜[[vault-notes/dsp/03-discrete-fourier-transform]]｜[[vault-notes/communication/02-deterministic-signals]]｜[[vault-notes/communication/06-digital-baseband]]｜[[vault-notes/math/linear-algebra/09-complex-vectors-matrices]]
