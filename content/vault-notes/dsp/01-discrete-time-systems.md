---
title: "离散时间信号与系统"
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
> 这一章把"离散时间"这门语言的四块地基一次铺齐：
> - **1.1 离散时间信号（序列）**：序列是什么、四种最基本的样子（$\delta(n)$、$u(n)$、$R_N(n)$、$a^n u(n)$）、它与连续信号**最要命的分歧**（$\omega$ 与 $\omega+2\pi$ 是同一个频率），以及序列能做的运算。
> - **1.2 线性移不变系统**：把"线性"与"移不变"两条公理叠加，得到全章的主定理——**任何 LSI 系统都被 $h(n)$ 完全确定，输出就是卷积和**；再补上因果、稳定两条工程判据。
> - **1.3 常系数线性差分方程**：LSI 系统的另一种描述（输入输出递推式）。它与卷积和是同一件事的两副面孔：前者适合"跑程序"，后者适合"看结构"。
> - **1.4 连续时间信号的抽样**：把连续世界接到离散世界的桥。抽样定理 + 频谱周期延拓 + 混叠，这三样是后面所有"用计算机处理连续信号"的合法性来源。
>
> 一句话主线：**离散时间信号是一串带序号的数；系统是对这些数做的运算；LSI 系统的运算就是卷积；从连续到离散的运算是抽样，而抽样的代价是频谱周期延拓。**

> [!note] 记号约定
> - 序列写作 $x(n)$（也写 $\{x(n)\}$ 或 $x_n$），**$n$ 只取整数**。$x(n)$ 里的圆括号表示"整数下标处的取值"，不是连续函数的取值
> - 两个频率字母分工明确：$\Omega$（或 $f$）是**连续（模拟）频率**，单位 rad/s（或 Hz）；$\omega$ 是**离散（数字）频率**，无量纲，以 $2\pi$ 为周期
> - 抽样周期记 $T$，抽样频率 $\Omega_s = 2\pi/T$（或 $f_s = 1/T$）——同一个字母的两种写法，靠单位区分
> - 系统写作 $y(n)=T[x(n)]$；单位冲激（抽样）响应记为 $h(n)$
> - $\delta(n)$ 是**离散**的单位抽样序列（取值只有 0 和 1），$\delta(t)$ 是连续时间单位冲激（广义函数）——**两者绝不可混用**，$h(n)$ 也绝不写 $h(t)$
> - $\mathrm{Sa}(x)\triangleq \dfrac{\sin x}{x}$（抽样函数），$\mathrm{Sa}(0)=1$

# 1. 离散时间信号--序列

## 序列的三种来源与三种写法

**离散时间信号**（discrete-time signal）就是只在离散时刻取值的信号。实践中它主要来自三处：

| 来源 | 例子 |
| --- | --- |
| **连续信号的抽样** | 麦克风 → ADC → 一串 16 bit 整数（第 4 节专门讲） |
| **本身就离散的物理量** | 每天的股价、每公里油耗、每帧图像 |
| **算法内部产生的数据** | 计算机里的任何数组、滤波器的中间结果 |

因为下标 $n$ 只能取整数，**序列不能用连续曲线表示，只能用"茎叶图"（竖线加圆点）**——每一个圆点是一个独立的数据，竖线只是把它们标到时间轴上。这也是离散与连续在图上最直观的区别。

同一个序列有三种等价写法：

| 写法 | 例子 | 适合干什么 |
| --- | --- | --- |
| **公式法** | $x(n)=a^n u(n)$ | 推导、算性质 |
| **图解法（茎叶图）** | 每隔一个 $n$ 画一根竖线 | 看形状、看卷积、看卷积的翻转 |
| **列表／向量法** | $\{x(n)\}=\{\underset{\uparrow}{1},2,3\}$ | 数值计算、写代码（↑ 标出 $n=0$ 的位置） |

> [!info] Def 1 序列
> **序列**（sequence）是定义在整数集上的一条有次序的数值：对每个整数 $n$ 有一个值 $x(n)$。全体记作
> $$\{x(n)\},\qquad -\infty<n<\infty$$
> **一个序列与一条连续曲线无关**：它只是一张"下标 → 数值"的查表。

## 四种最基本的序列

> [!info] Def 2 单位抽样序列
> $$\delta(n)=\begin{cases}1, & n=0\\[2pt] 0, & n\ne 0\end{cases}$$
> 又称**单位冲激序列**（unit impulse sequence）。它只在一个点上非零，与连续时间的 $\delta(t)$ 不同，**取的是有限的整数值 1，不是面积**。

> [!info] Def 3 单位阶跃序列
> $$u(n)=\begin{cases}1, & n\ge 0\\[2pt] 0, & n<0\end{cases}$$
> 又称**单位阶跃序列**（unit step sequence）。它标记了"时间原点"。

> [!info] Def 4 矩形序列
> $$R_N(n)=\begin{cases}1, & 0\le n\le N-1\\[2pt] 0, & \text{其他}\end{cases}$$
> 又称**矩形序列**（rectangular sequence），长度为 $N$。它就是"有限长"的标准样本——**数字滤波器永远只能处理有限长的数据**，所以 $R_N(n)$ 比 $u(n)$ 更贴近工程。

三者之间可以互相表示（这是最常用的三个恒等式）：

$$R_N(n)=u(n)-u(n-N),\qquad \delta(n)=u(n)-u(n-1),\qquad u(n)=\sum_{k=-\infty}^{n}\delta(k)$$

> [!tip] 三种"1"的区别 —— 最容易混的一处
> - $\delta(n)$：**只有 $n=0$ 是 1**（求和为 1）
> - $u(n)$：$n\ge0$ **全是 1**（求和为 $\infty$）
> - $R_N(n)$：**恰好 $N$ 个 1**（求和为 $N$）
>
> 记法：$\delta$ 是"脉冲"，$u$ 是"开关"，$R_N$ 是"窗口"。

> [!info] Def 5 指数序列
> **实指数序列**（real exponential sequence）：
> $$x(n)=a^n u(n),\qquad a\ \text{为实数}$$
> - $|a|>1$：单调增长（$a<0$ 时正负交替增长）
> - $0<a<1$：单调衰减 —— **这正是一阶数字低通滤波器的冲激响应形状**
> - $a=-0.9$：交替衰减 —— 一阶高通滤波器的形状
> - $a=1$：退化为 $u(n)$；$a=-1$：退化为 $(-1)^n u(n)$
>
> **复指数序列**（complex exponential sequence）：
> $$x(n)=e^{(\sigma+j\omega_0)n}=e^{\sigma n}\big(\cos\omega_0 n+j\sin\omega_0 n\big)$$
> 它的实部与虚部分别是包络为 $e^{\sigma n}$ 的两条正弦序列。$\sigma<0$ 时是"衰减振荡"，是数字谐振器、二阶系统的标准响应。

<svg width="100%" viewBox="0 0 545 160" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12">
  <line x1="17" y1="128" x2="110" y2="128" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <line x1="70" y1="66" x2="70" y2="128" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <circle cx="31" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="44" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="57" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <line x1="70" y1="128" x2="70" y2="84.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="70" cy="84.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <circle cx="83" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="96" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <text x="70" y="30" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">δ(n)</text>
  <line x1="148" y1="128" x2="240" y2="128" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <line x1="200" y1="66" x2="200" y2="128" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <circle cx="161" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="174" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="187" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <line x1="200" y1="128" x2="200" y2="84.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="200" cy="84.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="213" y1="128" x2="213" y2="84.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="213" cy="84.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="226" y1="128" x2="226" y2="84.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="226" cy="84.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <text x="200" y="30" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">u(n)</text>
  <line x1="288" y1="128" x2="412" y2="128" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <line x1="340" y1="66" x2="340" y2="128" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <circle cx="314" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="327" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <line x1="340" y1="128" x2="340" y2="84.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="340" cy="84.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="353" y1="128" x2="353" y2="84.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="353" cy="84.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="366" y1="128" x2="366" y2="84.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="366" cy="84.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="379" y1="128" x2="379" y2="84.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="379" cy="84.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="392" y1="128" x2="392" y2="84.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="392" cy="84.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <circle cx="405" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <text x="340" y="30" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">R₅(n)</text>
  <line x1="428" y1="128" x2="545" y2="128" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <line x1="480" y1="66" x2="480" y2="128" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <circle cx="467" cy="128" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <line x1="480" y1="128" x2="480" y2="84.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="480" cy="84.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="493" y1="128" x2="493" y2="97.2" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="493" cy="97.2" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="506" y1="128" x2="506" y2="106.4" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="506" cy="106.4" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="519" y1="128" x2="519" y2="112.9" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="519" cy="112.9" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="532" y1="128" x2="532" y2="117.4" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="532" cy="117.4" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <text x="480" y="30" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">aⁿu(n)　(a = 0.7)</text>
  <text x="110" y="146" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">n</text>
  <text x="240" y="146" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">n</text>
  <text x="412" y="146" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">n</text>
  <text x="528" y="146" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">n</text>
</svg>

> [!warning] 三个常见笔误
> 1. **$a^n$ 与 $a^n u(n)$ 不是同一个东西**。前者在 $n<0$ 时仍有值（$a^{-3}=1/a^3$），后者只在 $n\ge0$ 有值。讨论"衰减""稳定"时几乎总是默认后面挂着 $u(n)$。
> 2. **$x(n)=A\cos(\omega_0 n+\varphi)$ 是"正弦序列"，不是"采样后的正弦"**——除非明确说它来自某个连续信号的抽样，否则 $\omega_0$ 就是一个独立给定的数字频率。
> 3. **$\delta(n)$ 不能写成 $\delta(t)|_{t=n}$**。离散冲激的"面积"没有意义，它的全部意义就是"下标相等时为 1"，见 Def 2 后的三条恒等式。

## 序列的周期性：与连续信号最根本的分歧 ⭐

对连续正弦 $x_a(t)=\cos(\Omega_0 t)$，只要 $\Omega_0\ne0$ 就一定是周期的，周期 $2\pi/\Omega_0$。到了离散域，这条结论**不再成立**。

> [!info] Def 6 周期序列
> 若存在正整数 $N$ 使
> $$x(n)=x(n+N),\qquad \forall n$$
> 则称 $x(n)$ 为**周期序列**（periodic sequence），满足条件的最小 $N$ 称为**基波周期**。

对复指数／正弦序列 $x(n)=e^{j\omega_0 n}$，条件 $e^{j\omega_0(n+N)}=e^{j\omega_0 n}$ 等价于 $e^{j\omega_0 N}=1$，即

$$\omega_0 N=2\pi k\quad(k\ \text{为整数})\qquad\Longleftrightarrow\qquad \frac{2\pi}{\omega_0}=\frac{N}{k}\ \text{为有理数}$$

> [!tip] 判周期三步法（考试必考）
> 1. 写出 $\dfrac{2\pi}{\omega_0}$（若给的是 $A\cos(\omega_0 n)$，直接用它）；
> 2. 化为**最简分数** $\dfrac{N}{k}$；
> 3. **分子 $N$ 就是基波周期**。若 $\dfrac{2\pi}{\omega_0}$ 是无理数，则该序列**非周期**。

| 序列                                    | $\dfrac{2\pi}{\omega_0}$             | 周期      |
| ------------------------------------- | ------------------------------------ | ------- |
| $\cos(0.6\pi n)$                      | $\dfrac{2\pi}{0.6\pi}=\dfrac{10}{3}$ | $N=10$  |
| $\cos\!\left(\dfrac{3\pi}{7}n\right)$ | $\dfrac{14}{3}$                      | $N=14$  |
| $\sin(3n)$                            | $\dfrac{2\pi}{3}$ 无理                 | **非周期** |
| $e^{j\frac{2\pi}{12}n}$               | $12$                                 | $N=12$  |

> [!warning] 第二条分歧：$\omega$ 与 $\omega+2\pi$ 是**同一个频率**
> $$e^{j(\omega+2\pi)n}=e^{j\omega n}e^{j2\pi n}=e^{j\omega n}$$
> 于是：
> - 数字频率只有**一个 $2\pi$ 周期**是独立的，通常取 $-\pi<\omega\le\pi$ 或 $0\le\omega\le2\pi$；
> - **最高频是 $\omega=\pi$**（对应 $(-1)^n$，每个样本都换号）；$\omega=0$ 与 $\omega=2\pi$ 都是最低频（直流）；
> - **频率轴是"圆"而不是"直线"**：往 $+\infty$ 走会绕回来。这就是为什么后面抽样会引起**混叠**、为什么滤波器频率响应总画成"关于 $\pi$ 对称"。
>
> 对照：连续频率 $\Omega$ 可以取到任意大，$\Omega$ 与 $\Omega+2\pi/T$ 才是同一件事（相差一个抽样率的整数倍）。

| 对比项 | 连续时间信号 | 离散时间信号 |
| --- | --- | --- |
| 自变量 | $t$ 连续 | $n$ 只取整数 |
| 正弦是否必周期 | **是** | **不一定**（看 $2\pi/\omega_0$ 是否有有理数） |
| 频率范围 | $(-\infty,\infty)$ 无限 | 一个 $2\pi$ 区间（周期重复） |
| 最高频 | 无 | $\omega=\pi$ |
| 频谱 | 一般非周期 | **必**以 $2\pi$ 为周期 |

## 序列的运算

序列的运算全部是"**逐个下标对应着做**"，与矩阵逐元素运算同构：

| 运算 | 定义 | 说明 |
| --- | --- | --- |
| 加法 | $z(n)=x(n)+y(n)$ | 同一下标相加（要求长度对齐） |
| 乘法 | $z(n)=x(n)\cdot y(n)$ | 逐点相乘，又称**加窗**（windowing） |
| 移位 | $y(n)=x(n-m)$ | $m>0$ **右移**（延迟）；$m<0$ 左移（超前） |
| 翻转 | $y(n)=x(-n)$ | 关于 $n=0$ 反褶，卷积图解法要用 |
| 尺度变换 | $y(n)=x(an)$ 与 $y(n)=x(n/a)$ | $a>1$ 抽取（decimation），$a<1$ 插值（interpolation）——**第 8 章专讲，现在只要知道"抽取会降采样率、插值会升采样率"** |
| 累加 | $y(n)=\sum_{m=-\infty}^{n}x(m)$ | 离散积分；其冲激响应是 $u(n)$ |
| 差分 | $\Delta x(n)=x(n)-x(n-1)$ | 后向差分，离散微分 |

<svg width="100%" viewBox="0 0 470 160" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12">
  <line x1="44" y1="130" x2="142" y2="130" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <line x1="80" y1="72" x2="80" y2="130" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <circle cx="54" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="67" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <line x1="80" y1="130" x2="80" y2="100.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="80" cy="100.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="93" y1="130" x2="93" y2="70.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="93" cy="70.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="106" y1="130" x2="106" y2="100.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="106" cy="100.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <circle cx="119" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="132" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <text x="80" y="30" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">x(n)</text>
  <line x1="214" y1="130" x2="338" y2="130" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <line x1="250" y1="72" x2="250" y2="130" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <circle cx="224" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="237" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="250" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="263" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <line x1="276" y1="130" x2="276" y2="100.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="276" cy="100.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="289" y1="130" x2="289" y2="70.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="289" cy="70.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="302" y1="130" x2="302" y2="100.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="302" cy="100.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <circle cx="315" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="328" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <text x="250" y="30" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">x(n−2)</text>
  <line x1="358" y1="130" x2="456" y2="130" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <line x1="420" y1="72" x2="420" y2="130" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <circle cx="368" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="381" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <line x1="394" y1="130" x2="394" y2="100.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="394" cy="100.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="407" y1="130" x2="407" y2="70.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="407" cy="70.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="420" y1="130" x2="420" y2="100.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="420" cy="100.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <circle cx="433" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <circle cx="446" cy="130" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <text x="420" y="30" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">x(−n)</text>
  <text x="146" y="148" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">n</text>
  <text x="342" y="148" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">n</text>
  <text x="460" y="148" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">n</text>
</svg>

> [!tip] 移位与翻转的次序不可交换（易错）
> $x(n-m)$ 与 $x(-n-m)$ 完全不同：
> - $x(n-m)$：把 $x(\cdot)$ **右移 $m$**
> - $x(-n-m)=x(-(n+m))$：先翻转再右移 $m$ 相当于"先右移 $m$ 再翻转"
>
> 做卷积图解时记口诀：**先翻转（$n\to m$ 变 $n-m$），再平移（改变 $n$），最后相乘求和**。

## 序列的能量与平均功率

> [!info] Def 7 能量与平均功率
> $$\text{能量：}\ E=\sum_{n=-\infty}^{\infty}\lvert x(n)\rvert^2\qquad\qquad \text{平均功率：}\ P=\lim_{N\to\infty}\frac{1}{2N+1}\sum_{n=-N}^{N}\lvert x(n)\rvert^2$$
> - $0<E<\infty$ → **能量序列**（energy sequence）
> - $0<P<\infty$（此时 $E\to\infty$）→ **功率序列**（power sequence）

| 序列 | 能量 $E$ | 平均功率 $P$ | 归类 |
| --- | --- | --- | --- |
| $\delta(n)$ | $1$ | $0$ | 能量序列 |
| $R_N(n)$ | $N$ | $0$ | 能量序列 |
| $a^n u(n),\ \lvert a\rvert<1$ | $\dfrac{1}{1-\lvert a\rvert^2}$ | $0$ | 能量序列（衰减振荡） |
| $u(n)$ | $\infty$ | $\dfrac{1}{2}$ | 功率序列 |
| $\cos(\omega_0 n)$ | $\infty$ | $\dfrac{1}{2}$ | 功率序列 |

> [!note] 与通信方向的接口
> 这个分类**必须是"有限长 vs 无限长"，不是"有界 vs 无界"**。通信里更关心的是**功率**：因为信号要在无限的时间里持续发送，能量必然无穷，于是用"功率谱密度"描述它（见 [[vault-notes/communication/02-deterministic-signals]] 的能量谱／功率谱二分）。这一分类在第 2 章决定"能否算 DTFT / 是否要引入冲激谱"：
> - 能量序列（绝对可和）→ DTFT 存在且连续；
> - 功率序列（如 $u(n)$、$\cos\omega_0 n$）→ DTFT 必须**带冲激**才能写出来。
>
> 另外，$\sum\lvert x(n)\rvert^2$ 这个"能量"的物理含义，正是"把序列看成 $N$ 维向量后的欧氏长度平方"——与 [[vault-notes/math/linear-algebra/01-vector-introduction]] 的 $\mathbf{v}\cdot\mathbf{v}$ 是同一个量。

# 2. 线性移不变系统

## 系统的定义与四条分类线

> [!info] Def 8 离散时间系统
> **离散时间系统**（discrete-time system）是一个变换 $T[\cdot]$：把一个输入序列 $x(n)$ 映射成一个输出序列
> $$y(n)=T[x(n)]$$
> **"系统"不是电路，是算法**。同一个差分方程在 DSP 上是几行 C 代码，在 FPGA 上是几个乘法器加寄存器。

一个系统可以从四个维度分类，这四个维度组合出本章后半部分的全部内容：

| 分类维度 | 判据（对任意输入成立） | 本章／后续 |
| --- | --- | --- |
| **线性** | $T[ax_1+bx_2]=aT[x_1]+bT[x_2]$ | 本章 2 节 |
| **移不变** | $T[x(n-n_0)]=y(n-n_0)$ | 本章 2 节 |
| **因果** | 输出不超前于输入 | 本章 7 节 |
| **稳定** | 有界输入 → 有界输出（BIBO） | 本章 7 节 |

另外还有"无记忆／有记忆"（$y(n)$ 是否用到 $x(n-1)$ 等历史值）与"动态／静态"等划分，它们对本课程影响较小。

## 线性

> [!info] Def 9 线性系统
> 若对任意常数 $a,b$ 与任意输入 $x_1,x_2$ 都有
> $$T[a\,x_1(n)+b\,x_2(n)]=a\,T[x_1(n)]+b\,T[x_2(n)]$$
> 则称系统是**线性的**（linear）。它拆成两条：
> - **齐次性（homogeneity）**：$T[ax]=aT[x]$
> - **可加性（additivity）**：$T[x_1+x_2]=T[x_1]+T[x_2]$

**判断方法：把 $y(n)$ 里所有 $x$ 都换成 $a x_1+b x_2$，看能否提出 $a,b$。** 三条经验：

| 系统 | 线性？ | 理由 |
| --- | --- | --- |
| $y(n)=x^2(n)$ | **非线性** | $(ax)^2=a^2x^2\ne a x^2$ |
| $y(n)=x(n)\cos(\omega_0 n)$ | **线性** | 系数 $\cos(\omega_0 n)$ 与 $x$ 无关，可提出 |
| $y(n)=3x(n)+5$ | **非线性** | 常数项 5 破坏了齐次性（且 $x\equiv0$ 时 $y\equiv5\ne0$） |
| $y(n)=\sum_{m=-\infty}^{n}x(m)$ | **线性** | 求和本身是线性运算 |
| $y(n)=\lvert x(n)\rvert$ | **非线性** | 取 $x_1=1$、$x_2=-1$：$\lvert x_1+x_2\rvert=0\ne\lvert x_1\rvert+\lvert x_2\rvert=2$ |

> [!warning] 线性判定的两个陷阱
> 1. **"有 $x$ 就线性"是错的**：$\lvert x(n)\rvert$、$x(n)x(n-1)$、$x^2(n)$ 都是非线性。判据只有一条——**$x$ 只能以"一次幂、无常数项"的形式出现**。
> 2. **"零输入必零输出"**：线性系统必有 $T[0]=0$（把 $a=b=0$ 代进齐次性即得）。所以带常数项的系统一定非线性，但工程上常把它写成"线性部分 + 常量偏置"两层来处理。

线性带来的最大好处是**分解**：任何输入 $x(n)$ 都可以写成一系列基本输入的线性组合，而系统对组合的响应 = 响应的组合。这正是下一小节能得到"卷积"的前提。

## 移不变

> [!info] Def 10 移不变系统
> 若输入延迟 $n_0$ 拍，输出也**恰好延迟同样的 $n_0$ 拍且形状不变**：
> $$T[x(n-n_0)]=y(n-n_0),\qquad \forall n_0$$
> 则称系统是**移不变的**（shift-invariant，又称时不变 time-invariant）。

| 系统 | 移不变？ | 理由 |
| --- | --- | --- |
| $y(n)=x^2(n)$ | **是** | 逐点运算与时序无关 |
| $y(n)=x(n)\cos(\omega_0 n)$ | **否** | 输出乘的载波随时间变，延迟输入并不等于延迟输出（这正是**调制器**） |
| $y(n)=x(-n)$ | **否** | 时间反转不服从"延迟不变" |
| $y(n)=n\,x(n)$ | **否** | 增益随时间线性增长 |
| $y(n)=x(2n)$ | **否** | 抽取器 |

> [!tip] 一句话记住"移不变"
> **系统本身没有"自己的时钟"**。只要输出里出现任何显式的 $n$（$n x(n)$、$\cos(\omega_0 n)x(n)$、$x(2n)$、$x(n^2)$），就不再移不变。

**线性与移不变彼此独立**：上面表格里 $y(n)=x^2(n)$ 是"移不变但非线性"，$y(n)=x(-n)$ 是"线性但非移不变"。只有同时满足两条，才叫 **LSI**（linear shift-invariant，也常称 **LTI**，linear time-invariant）。

## 单位冲激响应与卷积和（本章主定理）

> [!info] Def 11 单位冲激响应
> 令输入为 $\delta(n)$、系统**初始松弛**（无储能／零初始条件），得到的输出称为系统的**单位冲激响应**（unit impulse response，简称**冲激响应**）：
> $$h(n)\triangleq T[\delta(n)]$$
> **$h(n)$ 是系统的"指纹"**——后面会证明它唯一确定一个 LSI 系统的全部行为。

> [!tip] 主定理：LSI 系统的输出 = 输入与冲激响应的卷积和
> **推导三步（务必会复述）：**
> 1. **把输入拆成冲激的叠加**。由 Def 2 的恒等式，任意序列都可以写成
>    $$x(n)=\sum_{m=-\infty}^{\infty}x(m)\,\delta(n-m)$$
>    （即"$x$ 是一堆加权移位的 $\delta$"）
> 2. **用线性**。线性系统可以逐项搬运：
>    $$y(n)=T\Big[\sum_m x(m)\delta(n-m)\Big]=\sum_m x(m)\,T[\delta(n-m)]$$
> 3. **用移不变**。$T[\delta(n-m)]=h(n-m)$，于是
>    $$y(n)=\sum_{m=-\infty}^{\infty}x(m)\,h(n-m)\triangleq x(n)*h(n)$$
>
> **结论**：只要知道 $h(n)$，任何输入的输出都能算出来，**不需要再知道系统内部长什么样**。这就是"$h(n)$ 是系统指纹"的严格含义。

> [!info] Def 12 卷积和
> 上式定义的运算称为**卷积和**（convolution sum，离散卷积）：
> $$y(n)=x(n)*h(n)=\sum_{m=-\infty}^{\infty}x(m)h(n-m)=\sum_{m=-\infty}^{\infty}h(m)x(n-m)$$
> 后一个等号来自交换律：**被卷积的两个序列可以互换角色**（输入与冲激响应互换，结果不变）。

> [!tip] LSI 系统有三种等价描述 —— 同一件事的三种语言
> 1. **$h(n)$（时域）**：$y(n)=x(n)*h(n)$ —— 判因果／稳定性、理解物理意义
> 2. **$H(z)$（复频域）**：$Y(z)=H(z)X(z)$ —— 看极点位置、做代数运算（第 2 章）
> 3. **差分方程（输入输出递推式）**：$\sum a_ky(n-k)=\sum b_rx(n-r)$ —— 写代码、画结构图（第 3 节／第 5 章）
>
> 三者**互相唯一确定**（在因果稳定的前提下），所以做题时永远可以挑最方便的那一种：**算输出用 ③，看频率特性用 ②，看稳定性／因果性用 ①**。

## 卷积和的四种算法

| 方法 | 做法 | 适用 |
| --- | --- | --- |
| **图解法** | 翻转 → 移位 → 相乘 → 求和（对每个 $n$ 走一遍） | 理解定义、求分段表达式 |
| **解析法** | 直接代公式求闭合形式 | $x,h$ 都是公式（如 $a^nu(n)$）时 |
| **列表法／竖式法** | 两个序列排成两行逐位相乘累加 | **短有限长序列**，考试首选 |
| **变换法** | 用 $z$ 变换或 DFT 变乘法 | 长序列、工程实现（第 3、4 章） |

> [!example] 例：两个矩形序列相卷
> $x(n)=R_4(n)$、$h(n)=R_3(n)$，列表法：
> ```
>         n:   0  1  2  3
>      x(n):   1  1  1  1
>      h(n):   1  1  1
>   ─────────────────────────
>      y(0):   1                       = 1
>      y(1):   1+1                     = 2
>      y(2):   1+1+1                   = 3
>      y(3):      1+1+1                = 3
>      y(4):         1+1               = 2
>      y(5):            1              = 1
> ```
> $$y(n)=\{1,2,3,3,2,1\}\quad(0\le n\le5)$$
> **校验两条铁律**：非零点个数 $=4+3-1=6$ ✓；各点之和 $=12=4\times3$ ✓。

<svg width="100%" viewBox="0 0 520 290" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12">
  <text x="130" y="24" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">x(m)</text>
  <line x1="62" y1="112" x2="200" y2="112" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <line x1="90" y1="78" x2="90" y2="112" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <line x1="90" y1="112" x2="90" y2="86.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="90" cy="86.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="116" y1="112" x2="116" y2="86.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="116" cy="86.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="142" y1="112" x2="142" y2="86.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="142" cy="86.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="168" y1="112" x2="168" y2="86.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="168" cy="86.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <text x="110" y="130" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">m</text>
  <text x="355" y="24" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">h(m)</text>
  <line x1="300" y1="112" x2="412" y2="112" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <line x1="330" y1="78" x2="330" y2="112" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <line x1="330" y1="112" x2="330" y2="86.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="330" cy="86.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="356" y1="112" x2="356" y2="86.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="356" cy="86.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="382" y1="112" x2="382" y2="86.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="382" cy="86.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <text x="352" y="130" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">m</text>
  <text x="130" y="168" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">x(m) 与 h(n−m)（n = 3 时）</text>
  <rect x="103" y="196" width="78" height="54" fill="var(--text-accent,#705dcf)" fill-opacity="0.12"/>
  <line x1="62" y1="250" x2="220" y2="250" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <line x1="90" y1="196" x2="90" y2="250" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <line x1="90" y1="250" x2="90" y2="224.0" stroke="var(--text-faint,#9aa0a6)" stroke-width="1.2"/>
  <circle cx="90" cy="224.0" r="2" fill="var(--text-faint,#9aa0a6)"/>
  <line x1="116" y1="250" x2="116" y2="224.0" stroke="var(--text-faint,#9aa0a6)" stroke-width="1.2"/>
  <circle cx="116" cy="224.0" r="2" fill="var(--text-faint,#9aa0a6)"/>
  <line x1="142" y1="250" x2="142" y2="224.0" stroke="var(--text-faint,#9aa0a6)" stroke-width="1.2"/>
  <circle cx="142" cy="224.0" r="2" fill="var(--text-faint,#9aa0a6)"/>
  <line x1="168" y1="250" x2="168" y2="224.0" stroke="var(--text-faint,#9aa0a6)" stroke-width="1.2"/>
  <circle cx="168" cy="224.0" r="2" fill="var(--text-faint,#9aa0a6)"/>
  <circle cx="90" cy="250" r="2" fill="none" stroke="var(--text-faint,#9aa0a6)" stroke-width="1"/>
  <line x1="116" y1="250" x2="116" y2="224.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="116" cy="224.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="142" y1="250" x2="142" y2="224.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="142" cy="224.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <line x1="168" y1="250" x2="168" y2="224.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.6"/>
  <circle cx="168" cy="224.0" r="2.6" fill="var(--text-accent,#705dcf)"/>
  <text x="110" y="268" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">m</text>
  <text x="140" y="214" text-anchor="middle" fill="var(--text-accent,#705dcf)" font-size="11">重叠区 m = 1…3</text>
  <text x="400" y="168" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">y(n) = x(n) ∗ h(n)</text>
  <line x1="300" y1="250" x2="482" y2="250" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <line x1="330" y1="196" x2="330" y2="250" stroke="var(--text-faint,#9aa0a6)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <line x1="330" y1="250" x2="330" y2="224.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.6"/>
  <circle cx="330" cy="224.0" r="2.6" fill="var(--text-normal,#1f2328)"/>
  <line x1="356" y1="250" x2="356" y2="198.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.6"/>
  <circle cx="356" cy="198.0" r="2.6" fill="var(--text-normal,#1f2328)"/>
  <line x1="382" y1="250" x2="382" y2="172.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.6"/>
  <circle cx="382" cy="172.0" r="2.6" fill="var(--text-normal,#1f2328)"/>
  <line x1="408" y1="250" x2="408" y2="172.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.6"/>
  <circle cx="408" cy="172.0" r="2.6" fill="var(--text-normal,#1f2328)"/>
  <line x1="434" y1="250" x2="434" y2="198.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.6"/>
  <circle cx="434" cy="198.0" r="2.6" fill="var(--text-normal,#1f2328)"/>
  <line x1="460" y1="250" x2="460" y2="224.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.6"/>
  <circle cx="460" cy="224.0" r="2.6" fill="var(--text-normal,#1f2328)"/>
  <text x="352" y="268" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">n</text>
  <text x="482" y="268" text-anchor="end" fill="var(--text-muted,#6a737d)" font-size="11">共 6 个非零点</text>
</svg>

> [!example] 例：两条指数序列相卷
> $x(n)=a^n u(n)$、$h(n)=b^n u(n)$，求 $y(n)=x(n)*h(n)$。
>
> **第一步定求和限**：$x(m)$ 在 $m\ge0$ 非零，$h(n-m)$ 在 $n-m\ge0$ 即 $m\le n$ 非零。两者交叠区间是
> $$0\le m\le n\quad\Longrightarrow\quad y(n)=0\ \ (n<0),\qquad y(n)=\sum_{m=0}^{n}a^m b^{\,n-m}\ (n\ge0)$$
> **第二步求和**（等比数列，公比 $a/b$）：
> $$y(n)=b^n\sum_{m=0}^{n}\Big(\frac{a}{b}\Big)^{m}=\frac{a^{\,n+1}-b^{\,n+1}}{a-b}\qquad(a\ne b)$$
> **第三步处理重根**：$a=b$ 时上式取极限（或直接算 $\sum_{m=0}^n a^m a^{n-m}=(n+1)a^n$），得
> $$y(n)=(n+1)\,a^n u(n)$$
>
> 这个结果会在第 2 章用 $z$ 变换**一行**算出来——那时你会明白：**卷积之所以麻烦，是因为还没换到正确的坐标系去**。

> [!warning] 卷积最容易错的三处
> 1. **求和限写错**。永远先问"$x(m)$ 在哪些 $m$ 非零""$h(n-m)$ 在哪些 $m$ 非零"，取交集。
> 2. **把 $h(n-m)$ 写成 $h(m-n)$**。前者是"翻转后再右移 $n$"，后者是"右移 $n$ 后再翻转"，两者差一个整体翻转，结果完全不同（只有 $h$ 为偶函数时才不显）。
> 3. **长度公式用错**。$x$ 长 $N_1$、$h$ 长 $N_2$（都是有限长因果），则 $y$ 长 $N_1+N_2-1$。**这条公式是"列表法"的收工检查**。

## 卷积的性质

| 性质 | 表达式 | 工程含义 |
| --- | --- | --- |
| 交换律 | $x*h=h*x$ | 输入与系统角色可互换（可用于"匹配滤波"的等价实现） |
| 结合律 | $(x*h_1)*h_2=x*(h_1*h_2)$ | **级联系统的总冲激响应 = 各 $h$ 相卷**（可合并成一个系统） |
| 分配律 | $x*(h_1+h_2)=x*h_1+x*h_2$ | **并联系统可合并**（滤波器组的输出相加） |
| 与 $\delta$ 卷 | $x(n)*\delta(n)=x(n)$ | $\delta$ 是卷积的单位元 |
| 与移位 $\delta$ 卷 | $x(n)*\delta(n-n_0)=x(n-n_0)$ | 卷积可以做**延迟**（相位／时延电路的数学形式） |
| 与 $u$ 卷 | $x(n)*u(n)=\displaystyle\sum_{m=-\infty}^{n}x(m)$ | 卷积可以做**累加**（离散积分器） |
| 因果性保持 | $x,h$ 都因果 → $x*h$ 因果 | 因果系统级联仍因果 |
| 稳定性保持 | $x,h$ 都绝对可和 → $x*h$ 绝对可和 | 稳定系统级联仍稳定 |

> [!example] 例：用"与 $\delta$ 卷"秒算
> $x(n)=\{2,\underset{\uparrow}{1},3\}$（$n=0$ 处是 1），求 $x(n)*[\delta(n)+\delta(n-1)]$。
> 由分配律与移位性质：$x*\delta(n)=x$，$x*\delta(n-1)=x$ 右移一拍，故
> $$y(n)=\{2,3,4,3\}\quad(n=0,1,2,3)$$
> （逐点校验：$y(0)=2$，$y(1)=1+2=3$，$y(2)=3+1=4$，$y(3)=3$ ✓）

> [!note] 通信方向延伸：卷积就是"信道"
> 一个 LSI 信道（理想线性信道、多径信道）对发射信号的作用**严格就是卷积**：把多径写成 $h(n)=\sum_i \alpha_i\delta(n-\tau_i/T_s)$，则接收信号 $\hat{x}=x*h$ 就是各条路径的加权延迟叠加。整个"均衡"问题于是变成"**找一个 $w(n)$ 使 $w*h\approx\delta(n)$**"——即**解卷积**（deconvolution）。而在接收端做**匹配滤波**（matched filter），其冲激响应取 $h^*(N-1-n)$，本质也是"翻转 + 卷积 + 在 $n=N-1$ 处抽样"，参见 [[vault-notes/communication/09-optimal-reception]] 与 [[vault-notes/communication/06-digital-baseband]]。

## 因果性与稳定性

> [!info] Def 13 因果系统
> **因果系统**（causal system）的输出在任意时刻只依赖当前与过去的输入（不依赖未来）：
> $$y(n_0)\ \text{只由}\ \{x(n),\,n\le n_0\}\ \text{决定}$$
> **对 LSI 系统的判据极其简单：**
> $$h(n)=0,\qquad n<0$$

> [!info] Def 14 稳定系统（BIBO）
> 若任意有界输入（$\lvert x(n)\rvert\le M_x<\infty$）都产生有界输出（$\lvert y(n)\rvert\le M_y<\infty$），则系统**稳定**（stable），这一判据记为 **BIBO**（bounded-input bounded-output）。
> **对 LSI 系统的判据：**
> $$\sum_{n=-\infty}^{\infty}\lvert h(n)\rvert<\infty\qquad\text{（冲激响应绝对可和）}$$

> [!tip] 稳定判据的证明与直读法
> **充分性**：若 $\sum\lvert h(n)\rvert=S<\infty$ 且 $\lvert x(n)\rvert\le M_x$，则
> $$\lvert y(n)\rvert=\Big\lvert\sum_m x(m)h(n-m)\Big\rvert\le M_x\sum_m\lvert h(n-m)\rvert=M_x S<\infty$$
> **必要性**：取 $x(n)=\mathrm{sgn}\,[h(-n)]$（有界！），则 $y(0)=\sum_n\lvert h(n)\rvert$，若绝对可和条件不成立则 $y(0)$ 无界。
>
> **直读法（考试用）**：把 $h(n)$ 的包络看成 $n\to\infty$ 时的趋势——
> - $h(n)$ **有限长** → 必稳定；
> - $h(n)=a^nu(n)$ → 稳定 ⟺ $\lvert a\rvert<1$；
> - $h(n)=u(n)$、$h(n)=n\,u(n)$ → 不稳定；
> - $h(n)=a^{n}u(-n-1)$（左边序列）→ 稳定 ⟺ $\lvert a\rvert>1$（包络随 $n\to-\infty$ 衰减）。

| 系统                                                          | $h(n)$                   | 因果？        | 稳定？                     |
| ----------------------------------------------------------- | ------------------------ | ---------- | ----------------------- |
| 滑动平均 $\displaystyle y(n)=\frac{1}{M}\sum_{k=0}^{M-1}x(n-k)$ | $h(n)=\frac{1}{M}R_M(n)$ | 是          | **是**（有限长）              |
| 累加器 $\displaystyle y(n)=\sum_{m=-\infty}^{n}x(m)$           | $h(n)=u(n)$              | 是          | **否**（$\sum1\to\infty$） |
| 一阶递归 $y(n)=ay(n-1)+x(n)$                                    | $h(n)=a^nu(n)$           | 是          | $\lvert a\rvert<1$ 时是   |
| 反因果 $y(n)=\sum_{m=n}^{\infty}x(m)$                          | $h(n)=u(-n)$             | **否**      | 否                       |
| $y(n)=x(n-N)$                                               | $\delta(n-N)$            | $N\ge0$ 时是 | 是                       |

> [!warning] 因果与稳定是两个独立条件
> "因果但非稳定"（累加器）、"稳定但非因果"（$\lvert a\rvert>1$ 的左边序列）都存在。**但工程上可实现的滤波器必须同时满足因果 + 稳定**——这条约束在第 2 章会翻译成一句极简的话：**$H(z)$ 的极点全在单位圆内，且收敛域含单位圆**。

> [!note] 通信方向延伸：这两条判据的物理身份
> - **因果性 = 可实现性**：在线处理（实时）要求不能用到未来样本。
> - **稳定性 = 不"爆炸"**：一个不稳定的均衡器或 AGC 会在几帧之内把输出顶到饱和，这就是工程上"滤波器自激"的数学定义。
> - 两者在第 6、7 章合起来决定"哪些滤波器设计方法能落地"：**IIR 常用极点位置保证稳定**，**FIR 天生稳定（有限长）且可做成严格线性相位**，这是第 7 章的核心卖点。

## 三个必背的范例系统

| 系统 | 差分方程 | $h(n)$ | 特点 |
| --- | --- | --- | --- |
| **无记忆（纯增益）** | $y(n)=Kx(n)$ | $K\delta(n)$ | 无延迟线，纯乘法 |
| **移动平均（MA／FIR）** | $y(n)=\frac{1}{M}[x(n)+\dots+x(n-M+1)]$ | $\frac{1}{M}R_M(n)$ | 有限长 → 稳定；**低通**、有延迟 |
| **一阶自回归（AR／IIR）** | $y(n)=ay(n-1)+x(n)$ | $a^nu(n)$ | 含反馈；极点 $a$ 决定带宽与稳定性 |
| **一阶差分／加重** | $y(n)=x(n)-bx(n-1)$ | $\delta(n)-b\delta(n-1)$ | 有限长，**高通**（去直流、预加重） |

> [!tip] 关于 $y(n)=ay(n-1)+x(n)$：一个系统看全套
> - **因果**：用到 $y(n-1)$，是因果系统 ✓
> - **稳定**：$\lvert a\rvert<1$ ✓（$a=1$ 时退化为累加器，不稳定）
> - **功能**：$a\to1$ 时是"慢速平均"＝窄带低通；$a\to0$ 时几乎无记忆；$a<0$ 时是**高通**
> - **时延**：极点越靠近单位圆，过渡带越窄，**群延迟越大**（第 2 章 4 节会给出量化形式）
>
> 这个系统只用到一次乘法、一次加法，却是数字低通／积分器中性价比最高的结构之一——在 FPGA 上就是"一个乘法器 + 一个寄存器"。

## MATLAB

```matlab
% ① 卷积：R4 ∗ R3
x = [1 1 1 1];  h = [1 1 1];
y = conv(x, h)            % → 1 2 3 3 2 1
length(y)                 % → 6 = 4 + 3 − 1

% ② 指数序列相卷：与解析式 (a^(n+1) − b^(n+1))/(a − b) 对照
a = 0.5; b = 0.8; n = 0:10;
yn = conv(a.^n, b.^n);
ya = (a.^(n+1) - b.^(n+1)) / (a - b);
max(abs(yn(1:11) - ya))   % 数值误差 ~1e-16，说明解析解正确

% ③ 稳定性：累加器（发散） vs 一阶递归（收敛）
sum(abs(ones(1,1000)))    % h(n)=u(n)  → 1000，随 N 线性增长
sum(abs(0.9.^(0:999)))    % h(n)=0.9ⁿu(n) → 10（|a|<1 绝对可和）
```

> [!note] 关于 `conv` 的一个坑
> MATLAB 的 `conv` **只接受有限长序列**，且默认从 $n=0$ 开始排。若两个序列的起点不在 0（例如 $x$ 从 $n=-2$ 开始），必须自己记录起点偏移：$y$ 的起点 $=n_{x0}+n_{h0}$，长度 $=N_1+N_2-1$。工程代码里这一点非常容易出错。

# 3. 常系数线性差分方程

## 一般形式与"阶"

> [!info] Def 15 常系数线性差分方程
> $$\sum_{k=0}^{N}a_k\,y(n-k)=\sum_{r=0}^{M}b_r\,x(n-r)$$
> 其中 $a_k,b_r$ 是**常数**。习惯上归一化 $a_0=1$，即
> $$y(n)=-\sum_{k=1}^{N}a_k y(n-k)+\sum_{r=0}^{M}b_r x(n-r)$$
> **阶数（order）$=N$**，即输出侧的最大延迟拍数；$M$ 是输入侧的最大延迟。

这个方程为什么重要，看它的三条性质就明白了：

| 性质 | 由谁保证 | 结论 |
| --- | --- | --- |
| **线性** | 只有 $x,y$ 的一次项，系数与它们无关 | 描述的系统线性 ✓ |
| **移不变** | 系数 $a_k,b_r$ **是常数**（不随 $n$ 变） | 描述的系统移不变 ✓ |
| **可实现** | 递推式只用 $n$ 及以前的值 | 因果、可用延迟线实现 ✓ |

> [!warning] "常系数"三个字不能少
> 若系数随 $n$ 变化（如 $y(n)=n\,y(n-1)+x(n)$），系统仍线性但**不再移不变**，本课程全部卷积／$z$ 变换工具当场失效。工程上只有"自适应滤波器"会故意破坏这一点（系数缓慢变化，在每一小段内冻结成常数来近似）。

## 递推解法（数值解）

把 Def 15 的式子改写成"**算 $y(n)$ 的公式**"：

$$y(n)=-\sum_{k=1}^{N}a_k\,y(n-k)+\sum_{r=0}^{M}b_r\,x(n-r)$$

只要已知 $N$ 个初始条件（$y(-1),y(-2),\dots,y(-N)$）和输入 $x(n)$，就能从 $n=0$ 开始一拍一拍算下去。这就是**计算机里的实现方式**（第 5 章的结构图、DSP 上的一条乘累加指令）。

> [!example] 例：递推求 $y(n)$
> 系统 $y(n)-0.5\,y(n-1)=x(n)$，输入 $x(n)=u(n)$，初始条件 $y(-1)=0$。逐点递推：
>
> | $n$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ | $\cdots$ | $\infty$ |
> | --- | --- | --- | --- | --- | --- | --- | --- | --- |
> | $y(n)$ | $0$ | $1$ | $1.5$ | $1.75$ | $1.875$ | $1.9375$ | $\cdots$ | $2$ |
>
> 递推式：$y(0)=0.5\times0+1=1$，$y(1)=0.5\times1+1=1.5$，$y(2)=0.5\times1.5+1=1.75$……
> **猜测并验证通项**：
> $$y(n)=2-0.5^{\,n},\qquad n\ge0$$
> 代回方程：$(2-0.5^n)-0.5(2-0.5^{n-1})=2-0.5^n-1+0.5^n=1=x(n)$ ✓，且 $y(0)=1$ ✓。

递推法的**优点**：适合编程、能得波形；**缺点**：只能得数值，看不出"通项里极点在哪"，稳定性／带宽都读不出来。所以还需要解析解法。

## 经典解法：齐次解 + 特解

**第一步：齐次解**（令输入为 0）：

$$\sum_{k=0}^{N}a_k\,y_h(n-k)=0\quad\Longrightarrow\quad \sum_{k=0}^{N}a_k\,\alpha^{\,N-k}=0\ \ (\text{特征方程})$$

特征方程的根分三种情形：

| 根的情形 | 齐次解形式 |
| --- | --- |
| $N$ 个**互异实根** $\alpha_1,\dots,\alpha_N$ | $y_h(n)=\displaystyle\sum_{i=1}^{N}C_i\,\alpha_i^{\,n}$ |
| **$m$ 重根** $\alpha$ | $y_h(n)=(C_1+C_2 n+\dots+C_m n^{m-1})\,\alpha^{\,n}$ |
| **共轭复根** $\alpha_{1,2}=r e^{\pm j\theta}$ | $y_h(n)=r^{\,n}\big(A\cos\theta n+B\sin\theta n\big)$ |

> [!tip] 齐次解 = 系统的"自由振荡"
> 齐次解里只出现**特征根**，与输入无关——它是系统自身"固有频率"的表现。所以：**特征根在单位圆内 ⟹ 自由振荡衰减 ⟹ 稳定**。这与 Def 14 的 $h(n)$ 绝对可和判据是同一件事。

**第二步：特解**（形状由输入决定，与齐次解同形时需升幂）：

| 输入 $x(n)$ | 特解形式（系数待定） |
| --- | --- |
| 常数 $A$ | $D$（若 1 是特征根，改为 $Dn$） |
| $A\,n^{k}$ | $D_0+D_1n+\dots+D_kn^k$ |
| $A\,a^{\,n}$（$a$ 非特征根） | $D\,a^{\,n}$ |
| $A\cos(\omega_0 n)$ 或 $A\sin(\omega_0 n)$ | $D\cos(\omega_0 n)+E\sin(\omega_0 n)$ |

**第三步：定系数**。$y(n)=y_h(n)+y_p(n)$，用初始条件解出 $C_i$（注意 $N$ 阶方程需 $N$ 个条件）。

> [!example] 例（续上）：用经典法解同一个系统
> $y(n)-0.5y(n-1)=x(n)$，$x(n)=u(n)$（即 $x=1,\ n\ge0$），$y(-1)=0$。
> - **特解**：设 $y_p=D$，则 $D-0.5D=1\Rightarrow D=2$，即 $y_p=2$；
> - **齐次解**：特征方程 $\alpha-0.5=0\Rightarrow \alpha=0.5$，$y_h=C(0.5)^n$；
> - **定系数**：把 $y(-1)=0$ 代入全解 $y(n)=2+C(0.5)^n$，得 $2+2C=0\Rightarrow C=-1$；
> $$y(n)=2-0.5^{\,n},\qquad n\ge0$$
> 与递推法的结果完全一致 ✓。**齐次解 $C\alpha^n$ 是"暂态"，特解 2 是"稳态"**——序列在无穷远处趋于 2，即阶跃输入的稳态仰值。

## 零输入响应与零状态响应

> [!info] Def 16 零输入响应与零状态响应
> 由**线性**可以把全响应拆成互不干扰的两块：
> - **零输入响应**（zero-input response）$y_{zi}(n)$：输入为零、仅由初始储能作用产生的响应。它就是**齐次解**（形状由特征根决定）；
> - **零状态响应**（zero-state response）$y_{zs}(n)$：初始状态为零（初始松弛）、仅由输入作用产生的响应。它**就是 $x(n)*h(n)$**。
> $$y(n)=\underbrace{y_{zi}(n)}_{\text{特征根}\times\text{初始状态}}+\underbrace{y_{zs}(n)}_{\text{输入}*h(n)}$$

> [!example] 例：同一个系统，初始条件非零
> 仍取 $y(n)-0.5y(n-1)=x(n)$、$x(n)=u(n)$，但 $y(-1)=1$。
> - **零输入响应**：令 $x=0$，则 $y_{zi}(n)=C(0.5)^n$，由 $y_{zi}(-1)=y(-1)=1$ 得 $C(0.5)^{-1}=1\Rightarrow C=0.5$，即
>   $$y_{zi}(n)=0.5^{\,n+1},\qquad n\ge-1$$
> - **零状态响应**：初始松弛（$y(-1)=0$），就是上例的结果
>   $$y_{zs}(n)=2-0.5^{\,n},\qquad n\ge0$$
> - **全响应**：
>   $$y(n)=2-0.5^{\,n}+0.5^{\,n+1}=2-0.5^{\,n+1}$$
> 校验：$y(0)=0.5\times1+1=1.5$，而 $2-0.5=1.5$ ✓；$y(1)=0.5\times1.5+1=1.75$，而 $2-0.25=1.75$ ✓。

> [!warning] 三处高频踩坑
> 1. **$h(n)$ 只对应"零状态 + 冲激输入"**。题目给非零初始条件时，输出里**多出来的是 $y_{zi}(n)$**，不能只用卷积算。
> 2. **初始条件的时刻要对齐**。$N$ 阶方程给的是 $y(-1),\dots,y(-N)$（"因果前"的值），而齐次解的形式 $C\alpha^n$ 通常按 $n\ge0$ 书写，代值时要小心指数符号（本例中 $C(0.5)^{-1}$ 就是这一步）。
> 3. **特解"与齐次解同形要升幂"**。若输入是 $a^n$ 而恰好 $a$ 是特征根，特解要写成 $Dn\,a^n$ 而不是 $Da^n$（这正是"共振"）。

## 由差分方程求冲激响应 $h(n)$

方法：**令 $x(n)=\delta(n)$，初始松弛，求解**。对 $M\le N$ 的情形（通常是低通／一般滤波器）：

$$h(n)\ \text{的形状}=\text{特征根的线性组合},\qquad h(n)=0\ \ (n<0)$$

> [!example] 例：$y(n)-0.5y(n-1)=x(n)+x(n-1)$ 的 $h(n)$
> 令 $x=\delta$、$y(-1)=0$，逐点递推 $y(n)=0.5y(n-1)+\delta(n)+\delta(n-1)$：
> $$h(0)=1,\quad h(1)=0.5+1=1.5,\quad h(n)=0.5\,h(n-1)=1.5\times0.5^{\,n-1}\ (n\ge2)$$
> 即
> $$h(n)=\delta(n)+1.5\times0.5^{\,n-1}u(n-1)$$
> **注意 $h(0)=1$ 这个"直接项"**：当 $M\ge1$（分子有 $z^{-1}$）时，$h(n)$ 在开头会多出一段与特征根无关的值。第 2 章用 $z$ 变换（部分分式或长除法）可以把这件事一次算清，比逐点递推稳得多。

> [!note] $h(n)$ 的两种成分 —— 与第 6、7 章的分水岭
> $h(n)$ 里如果**含无限长的指数尾部**（特征根贡献），系统就是 **IIR**（无限长单位冲激响应）——必须用反馈结构，稳定与否取决于极点位置；
> $h(n)$ 若**只有有限个非零点**（如上例把反馈去掉，只剩 $\delta(n)-b\delta(n-1)$），系统就是 **FIR**（有限长单位冲激响应）——天生稳定、结构简单、可做严格线性相位。
> 第 6 章设计 IIR、第 7 章设计 FIR，本质上就是在这两类 $h(n)$ 里挑形状。

## 差分方程与系统结构：递归 vs 非递归

差分方程直接对应四条画结构图的积木：**延迟器** $z^{-1}$、**乘法器**、**加法器**、**分支**。

一阶递归系统 $y(n)=a\,y(n-1)+x(n)$ 的信号流（**输出被"绕回来"参与下一拍计算**）：

```
正向：  x(n) ──▶ 加法器 ──▶ y(n)
反馈：  y(n) ──▶ [z⁻¹]（延迟一拍）──▶ y(n−1) ──▶ ×a ──▶ 加法器
```

一阶差分（非递归）系统 $y(n)=x(n)-b\,x(n-1)$ 的信号流（**没有反馈，只有对输入的前馈延迟**）：

```
正向：  x(n) ──▶ 加法器 ──▶ y(n)
前馈：  x(n) ──▶ [z⁻¹] ──▶ x(n−1) ──▶ ×(−b) ──▶ 加法器
```

| 结构 | 有无反馈 | $h(n)$ 长度 | 归类 | 代表 |
| --- | --- | --- | --- | --- |
| **非递归** | 无 | 有限（$M+1$ 点） | FIR | 移动平均、差分器、FIR 滤波器 |
| **递归** | 有 | 一般无限 | IIR | 累加器、一阶／二阶递归、IIR 滤波器 |

> [!tip] 递归结构的"代价与收益"
> - **收益**：用极少的运算量获得很陡的频率特性（一个极点就能造出低通，一个极点＋一个零点就是陷波器）。第 6 章会看到：达到同样的选择性，IIR 的阶数通常只有 FIR 的 1/5～1/10。
> - **代价**：$z^{-1}$ 在反馈环里意味着**每一拍的舍入误差都被反馈放大并累积**，还会出现"极限环振荡"；定点 DSP 上必须做**饱和＋舍入控制**。这是 IIR 在工程上必须小心的地方。

## MATLAB

```matlab
% 差分方程 y(n) − 0.5y(n−1) = x(n)，x(n) = u(n)
b = 1; a = [1 -0.5];
x = ones(1,20);

y = filter(b, a, x);            % 零状态响应（自动 y(-1)=0）
y_ana = 2 - 0.5.^(0:19);        % 解析解 2 − 0.5ⁿ
max(abs(y - y_ana))             % ≈ 0，两种方法一致

zf  = filtic(b, a, 1);          % 由初始条件 y(-1)=1 生成初始状态
y2  = filter(b, a, x, zf);      % 带初始条件的全响应
y2(1)                           % → 1.5，与手算 y(0)=1.5 一致

[h, n] = impz(b, a, 12);        % 直接抽冲激响应 h(n) = 0.5ⁿu(n)
stem(n, h, 'filled')
all(abs(h - 0.5.^n) < 1e-12)    % true
```

> [!note] `filter` 三个参数之外的第四个：初始状态
> `filter(b,a,x)` 永远算**零状态响应**；要算全响应必须用 `filtic` 造出初始状态向量再传给第四个参数。若用 `filter` 却忘了这件事，得到的结果会**静悄悄地少掉 $y_{zi}(n)$ 那一块**——这是做仿真对不上手算时最常见的第一个原因。

# 4. 连续时间信号的抽样

## 为什么要抽样：数学模型

计算机只能存有限个数，而现实信号是连续时间函数。让二者接通的唯一办法是**抽样**（sampling）：只在等间隔时刻 $t=nT$ 读取信号值。

> [!info] Def 17 理想抽样
> 用**冲激串**（impulse train，又称梳状函数）作为"采样开关"：
> $$p(t)=\sum_{n=-\infty}^{\infty}\delta(t-nT)\qquad(\text{周期 }T\text{，频率 }\Omega_s=\tfrac{2\pi}{T})$$
> **抽样信号**为
> $$\hat{x}_a(t)=x_a(t)\,p(t)=\sum_{n=-\infty}^{\infty}x_a(nT)\,\delta(t-nT)$$
> 它是一条"只在这些时刻有值"的广义函数；在实际 ADC 中，冲激由"采样保持"的窄脉冲近似。

<svg width="100%" viewBox="0 0 460 175" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12">
  <line x1="20" y1="132" x2="445" y2="132" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <path d="M 34.0,62.0 L 36.0,58.7 L 38.0,55.5 L 39.9,52.4 L 41.9,49.5 L 43.9,46.7 L 45.9,44.2 L 47.9,42.0 L 49.8,40.0 L 51.8,38.5 L 53.8,37.3 L 55.8,36.5 L 57.8,36.1 L 59.7,36.1 L 61.7,36.5 L 63.7,37.3 L 65.7,38.5 L 67.7,40.0 L 69.6,42.0 L 71.6,44.2 L 73.6,46.7 L 75.6,49.5 L 77.6,52.4 L 79.5,55.5 L 81.5,58.7 L 83.5,62.0 L 85.5,65.3 L 87.5,68.5 L 89.4,71.6 L 91.4,74.5 L 93.4,77.3 L 95.4,79.8 L 97.4,82.0 L 99.3,84.0 L 101.3,85.5 L 103.3,86.7 L 105.3,87.5 L 107.3,87.9 L 109.2,87.9 L 111.2,87.5 L 113.2,86.7 L 115.2,85.5 L 117.2,84.0 L 119.1,82.0 L 121.1,79.8 L 123.1,77.3 L 125.1,74.5 L 127.1,71.6 L 129.0,68.5 L 131.0,65.3 L 133.0,62.0 L 135.0,58.7 L 137.0,55.5 L 138.9,52.4 L 140.9,49.5 L 142.9,46.7 L 144.9,44.2 L 146.9,42.0 L 148.8,40.0 L 150.8,38.5 L 152.8,37.3 L 154.8,36.5 L 156.8,36.1 L 158.7,36.1 L 160.7,36.5 L 162.7,37.3 L 164.7,38.5 L 166.7,40.0 L 168.6,42.0 L 170.6,44.2 L 172.6,46.7 L 174.6,49.5 L 176.6,52.4 L 178.5,55.5 L 180.5,58.7 L 182.5,62.0 L 184.5,65.3 L 186.5,68.5 L 188.4,71.6 L 190.4,74.5 L 192.4,77.3 L 194.4,79.8 L 196.4,82.0 L 198.3,84.0 L 200.3,85.5 L 202.3,86.7 L 204.3,87.5 L 206.3,87.9 L 208.2,87.9 L 210.2,87.5 L 212.2,86.7 L 214.2,85.5 L 216.2,84.0 L 218.1,82.0 L 220.1,79.8 L 222.1,77.3 L 224.1,74.5 L 226.1,71.6 L 228.0,68.5 L 230.0,65.3 L 232.0,62.0 L 234.0,58.7 L 236.0,55.5 L 237.9,52.4 L 239.9,49.5 L 241.9,46.7 L 243.9,44.2 L 245.9,42.0 L 247.8,40.0 L 249.8,38.5 L 251.8,37.3 L 253.8,36.5 L 255.8,36.1 L 257.7,36.1 L 259.7,36.5 L 261.7,37.3 L 263.7,38.5 L 265.7,40.0 L 267.6,42.0 L 269.6,44.2 L 271.6,46.7 L 273.6,49.5 L 275.6,52.4 L 277.5,55.5 L 279.5,58.7 L 281.5,62.0 L 283.5,65.3 L 285.5,68.5 L 287.4,71.6 L 289.4,74.5 L 291.4,77.3 L 293.4,79.8 L 295.4,82.0 L 297.3,84.0 L 299.3,85.5 L 301.3,86.7 L 303.3,87.5 L 305.3,87.9 L 307.2,87.9 L 309.2,87.5 L 311.2,86.7 L 313.2,85.5 L 315.2,84.0 L 317.1,82.0 L 319.1,79.8 L 321.1,77.3 L 323.1,74.5 L 325.1,71.6 L 327.0,68.5 L 329.0,65.3 L 331.0,62.0 L 333.0,58.7 L 335.0,55.5 L 336.9,52.4 L 338.9,49.5 L 340.9,46.7 L 342.9,44.2 L 344.9,42.0 L 346.8,40.0 L 348.8,38.5 L 350.8,37.3 L 352.8,36.5 L 354.8,36.1 L 356.7,36.1 L 358.7,36.5 L 360.7,37.3 L 362.7,38.5 L 364.7,40.0 L 366.6,42.0 L 368.6,44.2 L 370.6,46.7 L 372.6,49.5 L 374.6,52.4 L 376.5,55.5 L 378.5,58.7 L 380.5,62.0 L 382.5,65.3 L 384.5,68.5 L 386.4,71.6 L 388.4,74.5 L 390.4,77.3 L 392.4,79.8 L 394.4,82.0 L 396.3,84.0 L 398.3,85.5 L 400.3,86.7 L 402.3,87.5 L 404.3,87.9 L 406.2,87.9 L 408.2,87.5 L 410.2,86.7 L 412.2,85.5 L 414.2,84.0 L 416.1,82.0 L 418.1,79.8 L 420.1,77.3 L 422.1,74.5 L 424.1,71.6 L 426.0,68.5 L 428.0,65.3 L 430.0,62.0" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.6"/>
  <line x1="43.0" y1="47.9" x2="43.0" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="43.0" cy="47.9" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="66.5" y1="39.1" x2="66.5" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="66.5" cy="39.1" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="90.0" y1="72.4" x2="90.0" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="90.0" cy="72.4" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="113.5" y1="86.6" x2="113.5" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="113.5" cy="86.6" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="137.0" y1="55.5" x2="137.0" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="137.0" cy="55.5" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="160.5" y1="36.4" x2="160.5" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="160.5" cy="36.4" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="184.0" y1="64.5" x2="184.0" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="184.0" cy="64.5" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="207.5" y1="88.0" x2="207.5" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="207.5" cy="88.0" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="231.0" y1="63.6" x2="231.0" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="231.0" cy="63.6" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="254.5" y1="36.3" x2="254.5" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="254.5" cy="36.3" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="278.0" y1="56.3" x2="278.0" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="278.0" cy="56.3" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="301.5" y1="86.8" x2="301.5" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="301.5" cy="86.8" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="325.0" y1="71.7" x2="325.0" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="325.0" cy="71.7" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="348.5" y1="38.7" x2="348.5" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="348.5" cy="38.7" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="372.0" y1="48.6" x2="372.0" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="372.0" cy="48.6" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="395.5" y1="83.2" x2="395.5" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="395.5" cy="83.2" r="3" fill="var(--text-accent,#705dcf)"/>
  <line x1="419.0" y1="78.7" x2="419.0" y2="132" stroke="var(--text-faint,#9aa0a6)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="419.0" cy="78.7" r="3" fill="var(--text-accent,#705dcf)"/>
  <text x="436" y="136" fill="var(--text-muted,#6a737d)">t</text>
  <text x="32" y="32" text-anchor="end" fill="var(--text-muted,#6a737d)">xₐ(t)</text>
  <line x1="113.5" y1="152" x2="137.0" y2="152" stroke="var(--text-accent,#705dcf)" stroke-width="1"/>
  <line x1="113.5" y1="148" x2="113.5" y2="156" stroke="var(--text-accent,#705dcf)" stroke-width="1"/>
  <line x1="137.0" y1="148" x2="137.0" y2="156" stroke="var(--text-accent,#705dcf)" stroke-width="1"/>
  <text x="125.2" y="150" text-anchor="middle" fill="var(--text-accent,#705dcf)">T</text>
  <text x="230.0" y="168" text-anchor="middle" fill="var(--text-muted,#6a737d)">虚线：抽样时刻 nT　　圆点：样值 xₐ(nT)</text>
</svg>

## 抽样信号的频谱：周期延拓

把 $p(t)$ 展开为傅里叶级数（它是周期函数！）：

$$p(t)=\sum_{k=-\infty}^{\infty}P_k e^{jk\Omega_s t},\qquad P_k=\frac{1}{T}\int_{-T/2}^{T/2}\delta(t)e^{-jk\Omega_s t}\,dt=\frac{1}{T}$$

（冲激只在 $t=0$ 处"取样"，积分直接得 1。）于是

$$\hat{x}_a(t)=x_a(t)\cdot\frac{1}{T}\sum_{k=-\infty}^{\infty}e^{jk\Omega_s t}=\frac{1}{T}\sum_{k=-\infty}^{\infty}x_a(t)e^{jk\Omega_s t}$$

两边取傅里叶变换，用频移性质 $x(t)e^{j\Omega_0 t}\leftrightarrow X(j(\Omega-\Omega_0))$，得到**抽样定理的数学核心**：

$$\boxed{\ \hat{X}_a(j\Omega)=\frac{1}{T}\sum_{k=-\infty}^{\infty}X_a\big(j(\Omega-k\Omega_s)\big)\ }$$

![[vault-notes/assets/01-discrete-time-systems/fig-01.png]]

> [!tip] 这句话的完整含义（务必备考级别地记住）
> **时域抽样 ⟺ 频域以 $\Omega_s$ 为周期把原频谱搬移并叠加（幅度乘 $1/T$）。**
> - 搬移不是"额外发生的怪事"，而是"乘以周期冲激串"的必然结果；
> - 只要这些搬移后的副本**互不重叠**，原频谱的形状就被完整保留（只被"复印"了无穷多份）；
> - 一旦**重叠**，信息就真的丢了（见下节）。
>
> 这也解释了第 1 节那条"离散信号频谱必以 $2\pi$ 为周期"的怪性质——**它正是抽样在频域的指纹**。

## 抽样定理与折叠频率

> [!tip] 抽样定理（奈奎斯特–香农，Nyquist–Shannon sampling theorem）
> 设 $x_a(t)$ 是**带限信号**，最高频率为 $\Omega_h$（即 $X_a(j\Omega)=0,\ \lvert\Omega\rvert>\Omega_h$）。若抽样频率满足
> $$\Omega_s\ \ge\ 2\Omega_h\qquad\Longleftrightarrow\qquad f_s\ \ge\ 2f_h$$
> 则 $x_a(t)$ 可以由样值 $\{x_a(nT)\}$ **唯一恢复**。
>
> - $\Omega_s/2$ 称为**折叠频率**（folding frequency）或**奈奎斯特频率**（Nyquist frequency）；
> - 条件 $f_s\ge2f_h$ 也称**奈奎斯特条件**。

| 量 | 模拟域 | 数字域（归一化后） |
| --- | --- | --- |
| 最高频率 | $\Omega_h$ | $\omega_h=\Omega_h T$ |
| 抽样频率 | $\Omega_s=2\pi/T$ | $2\pi$ |
| 折叠频率 | $\Omega_s/2$ | $\pi$ |

> [!warning] 关于等号的争议：临界抽样是有条件的
> $f_s=2f_h$ **并不总能**恢复。若信号在 $\Omega_h$ 处有冲激或谱线（例如 $x_a(t)=\cos(2\pi f_h t)$ 且 $f_s=2f_h$），抽样后所有样值恰好落在同一相位上，得到的是两条**直流序列**——原信号的频率信息彻底消失（如果是正弦，那么将会抵消变成0）。故工程上取
> $$f_s>\ 2f_h\ \text{（留余量）}$$
> 或干脆用 $f_s=(2.5\sim5)f_h$，把过渡带留给抗混叠滤波器。

![[vault-notes/assets/01-discrete-time-systems/fig-02.png]]
## 频谱混叠（aliasing）

> [!info] Def 18 混叠
> 当 $\Omega_s<2\Omega_h$ 时，延拓出来的频谱副本与主谱**重叠**，使得某个频率上的值变成多个频率的叠加。此时抽样信号 $\hat{x}_a(t)$ 对应的"假信号"与原信号不同，且**无法由样值恢复原信号**。这种现象称为**频谱混叠**（aliasing），被折叠进来的那些频率成分称为**假频**（alias）。

<svg width="100%" viewBox="0 0 480 352" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12">
  <text x="70" y="20" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">① 模拟信号频谱 |Xₐ(jΩ)|</text>
  <line x1="60" y1="78" x2="440" y2="78" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <polygon points="150,78 250,34 350,78" fill="var(--text-normal,#1f2328)" fill-opacity="0.1" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <text x="250" y="94" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">0</text>
  <text x="150" y="94" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">−Ω_h</text>
  <text x="350" y="94" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">Ω_h</text>
  <text x="440" y="94" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">Ω</text>
  <text x="70" y="126" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">② Ωₛ &gt; 2Ω_h（如 Ωₛ = 2.4Ω_h）：延拓的谱互不重叠</text>
  <line x1="20" y1="186" x2="470" y2="186" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <polygon points="150,186 250,142 350,186" fill="var(--text-normal,#1f2328)" fill-opacity="0.1" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <polygon points="-90,186 10,142 110,186" fill="var(--text-accent,#705dcf)" fill-opacity="0.12" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <polygon points="390,186 490,142 590,186" fill="var(--text-accent,#705dcf)" fill-opacity="0.12" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <text x="250" y="202" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">0</text>
  <text x="130" y="202" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">−Ωₛ/2</text>
  <text x="370" y="202" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">Ωₛ/2</text>
  <line x1="130" y1="134" x2="130" y2="186" stroke="var(--text-accent,#705dcf)" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="370" y1="134" x2="370" y2="186" stroke="var(--text-accent,#705dcf)" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="250" y="218" text-anchor="middle" fill="var(--text-accent,#705dcf)" font-size="11">重建用理想低通的截止 = Ωₛ/2：主谱完整落于通带内 → 可无失真恢复</text>
  <text x="70" y="248" text-anchor="start" fill="var(--text-muted,#6a737d)" font-size="12">③ Ωₛ &lt; 2Ω_h（如 Ωₛ = 1.5Ω_h）：延拓的谱与主谱重叠 → 混叠</text>
  <rect x="150" y="264" width="50" height="44" fill="var(--text-accent,#705dcf)" fill-opacity="0.28"/>
  <rect x="300" y="264" width="50" height="44" fill="var(--text-accent,#705dcf)" fill-opacity="0.28"/>
  <line x1="20" y1="308" x2="470" y2="308" stroke="var(--text-muted,#6a737d)" stroke-width="1"/>
  <polygon points="150,308 250,264 350,308" fill="var(--text-normal,#1f2328)" fill-opacity="0.1" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <polygon points="0,308 100,264 200,308" fill="var(--text-accent,#705dcf)" fill-opacity="0.12" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <polygon points="300,308 400,264 500,308" fill="var(--text-accent,#705dcf)" fill-opacity="0.12" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <text x="250" y="324" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">0</text>
  <text x="175" y="324" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">Ωₛ/2</text>
  <text x="325" y="324" text-anchor="middle" fill="var(--text-muted,#6a737d)" font-size="12">Ωₛ − Ω_h</text>
  <text x="250" y="340" text-anchor="middle" fill="var(--text-accent,#705dcf)" font-size="11">落在阴影区的谱无法与主谱区分 → 高频被搬到低频，形成假频</text>
</svg>

**量化算法**：样值只能反映"折算到 $[0,f_s/2]$ 范围内的那个频率"。折算规则（记住这一条就够）：

$$f_{\text{表现}}=\Big\lvert\,\big(f+\tfrac{f_s}{2}\big)\bmod f_s-\tfrac{f_s}{2}\,\Big\rvert\qquad\Longleftrightarrow\qquad \text{把 }f\text{ 反复减（加）}f_s\text{ 直到落入}[0,f_s/2]$$

> [!example] 例：$f_s=8$ kHz 时各种输入的表现
> | 输入频率 $f$ | 与 $f_s$ 的关系 | 表现（假频） |
> | --- | --- | --- |
> | $1$ kHz | $<f_s/2$ | $1$ kHz（正常） |
> | $3$ kHz | $<f_s/2$ | $3$ kHz（正常） |
> | $4$ kHz | $=f_s/2$ | $4$ kHz（**临界**，相位信息已丢失） |
> | $5$ kHz | $=f_s-3$ | **$3$ kHz** |
> | $7$ kHz | $=f_s-1$ | **$1$ kHz** |
> | $9$ kHz | $=f_s+1$ | **$1$ kHz** |
> | $12$ kHz | $=f_s+4$ | **$4$ kHz** |
>
> 工程后果：一个 7 kHz 的干扰与一个 1 kHz 的有用信号**在抽样后完全分不开**。

> [!warning] 混叠是"不可逆"的，必须事前预防
> 混叠与量化误差有本质区别：
> - **量化误差**是幅度上的随机误差，可以靠 **增加位数** 改善（每加 1 bit 约改善 6 dB）；
> - **混叠**是频率上的**确定性错误**——误进来的成分与真信号完全纠缠在一起，**无论多少位、多少算力都救不回来**。
>
> 所以唯一的对策是**事前**在 ADC 之前放一个**抗混叠滤波器**（anti-aliasing filter）。这条铁律在通信、音频、雷达里都一样。

> [!tip] 混叠的"另一个视角"：数字频率的圆
> 用 $\omega=\Omega T$ 把模拟频率折算成数字频率，4 节的结论立刻与 1 节对上：
> - $\Omega\in[0,\Omega_s)$ 恰好映射到 $\omega\in[0,2\pi)$；
> - 折叠频率 $\Omega_s/2$ 对应 $\omega=\pi$（最"快"的离散正弦）；
> - 于是"混叠"就是**频率轴绕圈时的重叠**：$\Omega$ 超过 $\Omega_s/2$ 后再往上走，$\omega$ 越过 $\pi$ 并"绕回"低端，与真实低频重合。
>
> **一切混叠问题，都是因为离散频率是一个圆。**


*（图片未随站点发布：aliasing_interactive_demo.html）*
## 由样值恢复原信号

要恢复，就把 $\hat{X}_a(j\Omega)$ 中**主谱之外的所有副本滤掉**——用一个理想低通滤波器：

$$H(j\Omega)=\begin{cases}T,&\lvert\Omega\rvert<\dfrac{\Omega_s}{2}\\[6pt]0,&\lvert\Omega\rvert>\dfrac{\Omega_s}{2}\end{cases}$$

该低通的冲激响应为 $h(t)=\mathrm{Sa}\!\big(\pi t/T\big)=\dfrac{\sin(\pi t/T)}{\pi t/T}$，与冲激串卷积即得**插值公式**：

$$x_a(t)=\sum_{n=-\infty}^{\infty}x_a(nT)\,\frac{\sin\big[\pi(t-nT)/T\big]}{\pi(t-nT)/T}$$

> [!tip] 插值公式的两条要点
> 1. **样点处严格相等**（内插函数在 $t\ne nT$ 时为 0），所以它"过所有样点"；
> 2. **样点之间是被 sinc 波形算出来的**，不是直线连起来的（音频重采样里"硬连"会引入高频失真）。
>
> 工程上理想低通不可实现（非因果、无限长）。实际做法是：**零阶保持（ZOH）近似 + 补偿滤波器**，或**先过采样再降采样**（第 8 章），让模拟滤波器不必那么陡。

## 频率归一化：从 $\Omega$ 到 $\omega$

把抽样间隔"折叠进频率定义"里，令

$$\omega=\Omega T\qquad\Longleftrightarrow\qquad \Omega=\frac{\omega}{T}$$

则 $\Omega_s=2\pi/T$ 对应 $\omega=2\pi$，$\Omega_s/2$ 对应 $\omega=\pi$。**数字域里的一切都只看 $\omega$，与 $T$ 无关。**

$\Omega$ 称为模拟角频率，$\omega$ 称为数字角频率，$T$ 称为采样间隔/周期，因此我们可以拓展以下的公式
$$\omega = 2\pi \frac{f}{f_S} $$
其中$f$为模拟频率，$f_s$为采样频率

| 模拟量                      | 数字量                    | 备注                 |
| ------------------------ | ---------------------- | ------------------ |
| $0$                      | $0$                    | 直流                 |
| $\Omega_s/4$             | $\pi/2$                | $f_s/4$            |
| $\Omega_s/2$ ($f_s / 2$) | $\pi$                  | 奈奎斯特频率，最高频，也称为折叠频率 |
| $\Omega_s$ ($f_s$)       | $2\pi\equiv0$          | 绕回直流。为数字域最高频率      |
| $s=\sigma+j\Omega$       | $z=e^{sT}=e^{j\omega}$ | 第 2 章 2 节的主题       |
|                          |                        |                    |

> [!note] 归一化的工程价值
> 归一化之后，**同一套滤波器系数适用于任何采样率**：先按 $\omega$ 设计（例如"截止在 $0.2\pi$"），再把它用到 8 kHz 或 48 kHz 的系统里，只要确认对应的模拟频率没有越界即可。第 6 章 IIR 设计（脉冲响应不变法、双线性变换法）和第 7 章 FIR 窗函数法，全部建立在这条归一化之上。
> 写代码时对应关系是：`f_hz / (fs/2)` 就是归一化的 $\omega/\pi$（MATLAB 与 scipy 的滤波器设计函数都吃这个 0~1 的比值）。

## 带通信号的抽样

如果信号是**带通**的（能量集中在 $[f_L,f_H]$ 而不是 $[0,f_H]$），抽样定理可以大幅放宽——**只要 $f_s\ge2B$（$B=f_H-f_L$）就可以**，不必满足 $f_s\ge2f_H$。

> [!tip] 带通抽样定理（下频带抽样）
> 记带宽 $B=f_H-f_L$，取最大整数 $N=\lfloor f_H/B\rfloor$、余量 $M=f_H/B-N\in[0,1)$，则可用抽样率
> $$f_s=2B\Big(1+\frac{M}{N}\Big)$$
> 就能无混叠抽样。（当 $M=0$，即 $f_H$ 恰为 $B$ 的整数倍时，$f_s=2B$ 即最低速率。）

> [!example] 例：中频采样
> 带通信号 $f_L=30$ MHz、$f_H=35$ MHz，则 $B=5$ MHz、$f_H/B=7$（整数，$N=7,M=0$），故
> $$f_s=2\times5=10\ \text{MHz}$$
> 而按低通抽样定理需要 $70$ MHz，速度要求降到 **1/7**。
> 这正是**软件无线电（SDR）直接在中频采样**的依据：ADC 用 $f_s=10$ MHz 就能覆盖 30~35 MHz 这一整段，随后在数字域做混频（数字下变频 DDC），把射频链路的模拟器件大幅简化。

> [!warning] 带通抽样的代价
> 抽样率降低后，**混叠的"保护带"非常窄**：$f_s$ 稍微偏离设计值、或信号带宽超出 $B$，频谱副本立刻撞上主谱。所以带通抽样对**抗混叠滤波器的陡峭度要求反而更高**（需要严格带通，而不是低通），工程上往往宁可用"过采样 + 数字抽取"来回避这个苛刻条件。

## 工程实现：从定理到电路

| 环节 | 对应理论 | 工程要点 |
| --- | --- | --- |
| **抗混叠滤波** | 保证 $\lvert X_a\rvert$ 在 $f_s/2$ 之上足够小 | 模拟低通；过渡带 $(f_h\sim f_s/2)$ 要留够；常用高阶有源／开关电容 |
| **采样保持** | 理想冲激串近似 | 保持电容的**孔径效应**（aperture jitter）：孔径抖动 $\Delta t$ 引入的相位误差随 $f$ 线性增长，是高速 ADC 的 SNR 上限 |
| **量化** | 幅度离散（本节未涉及） | $n$ bit 的理想 SNR $\approx 6.02n+1.76$ dB；与混叠不是一回事 |
| **过采样 + 抽取** | 抽样冗余可换精度 | 每 4 倍过采样可换约 1 bit 有效位，同时放宽模拟滤波器（**第 8 章**） |
| **重建（DAC）** | 插值公式的近似 | 零阶保持 + 后置补偿低通；上采样后滤镜像 |

> [!warning] 工程上最常被忽略的一条
> **"信号最高频率"必须按"到达 ADC 之前的实际带宽"算，而不是按"我关心的频率"算。** 例如采样一路 1 kHz 的心电信号，若前级放大器的带宽是 100 kHz（因为要抑制 50 Hz 工频而没做低通），那有效 $f_h$ 就是 100 kHz，$f_s$ 若取 8 kHz 会混叠进大量放大器噪声与射频整流分量。**抗混叠滤波器是 ADC 的一部分，不是"可选配件"。**

## MATLAB

```matlab
% 混叠演示：f_s = 8 kHz，输入 1/3/5/7/9 kHz
fs = 8000;
for f = [1000 3000 5000 7000 9000]
    fa = abs(mod(f + fs/2, fs) - fs/2);      % 折算到 [0, fs/2] 的"表现频率"
    fprintf('输入 %5d Hz  →  表现 %5d Hz\n', f, fa);
end
% 输入  1000 Hz  →  表现  1000 Hz
% 输入  3000 Hz  →  表现  3000 Hz
% 输入  5000 Hz  →  表现  3000 Hz     ← 混叠
% 输入  7000 Hz  →  表现  1000 Hz     ← 混叠
% 输入  9000 Hz  →  表现  1000 Hz     ← 混叠

% 用 FFT 看"抽样后分不开"（第 3、4 章内容，此处预览）
t = (0:799)/fs;                                   % 0.1 s，恰好 100 个 1 kHz 周期
x = sin(2*pi*1000*t) + sin(2*pi*7000*t + pi/3);   % 真信号：1 kHz + 7 kHz
X = abs(fft(x));
[~, k] = max(X(1:400));
fprintf('唯一谱峰位于 %d Hz\n', (k-1)*fs/800);     % → 1000 Hz
% 7 kHz 的样值与 1 kHz 的样值只差一个符号，两者已合成同一根谱线，再也分不开
```

> [!warning] 这个例子里藏着一个容易忽略的坑
> 若把第二项写成 `sin(2*pi*7000*t)`（零初相），它与 `sin(2*pi*1000*t)` 的**样值恰好互为相反数**（$7000 = 8000-1000$，且 $\sin(2\pi\cdot0.875n)=-\sin(2\pi\cdot0.125n)$），两者相加**完全抵消**，FFT 上什么峰都看不到。这不是"分不开"，而是"抵消了"——**混叠既能造成假频，也能造成假零点**。所以上例特意加了 $\pi/3$ 相移来避开这个特殊情形；做完实验务必再换个相位验证一遍结论。

> [!note] 用它验证自己的直觉
> 把上例的 $f_s$ 改成 16 kHz，重跑：7 kHz 会被正确表示（$7<8$），谱上就出现两根峰了。**"提高采样率能不能救"——能在事前救，事后不能救。**

> [!tip] 本章收官
> 第 1 章四节其实是一条链：
> 1. **序列**（1.1）给出"离散世界的最小数据单位"，并第一次暴露离散与连续的差别——**频率是个圆**；
> 2. **LSI 系统**（1.2）用两条公理（线性 + 移不变）推出唯一结论：**系统 = 卷积**，$h(n)$ 是系统的全部；
> 3. **差分方程**（1.3）给出同一系统的另一种写法——**可递推、可实现**，但一时看不出频域特性；
> 4. **抽样**（1.4）把连续世界搬进离散世界，代价是**频谱周期延拓**，条件是**不混叠**。
>
> 一句话：**第 1 章造好了舞台（序列）、演员（LSI + 卷积）、剧本（差分方程），并把连续世界搬了上来（抽样）；接下来第 2 章要给这一切换一套坐标系——$z$ 变换与 DTFT，让"卷积"变成"乘法"，让"稳定性"变成一个几何问题：极点在不在单位圆内。**

# 本章知识地图

```
离散时间信号与系统
  ├─ 1.1 序列
  │     ├── 三种来源：抽样 / 数据 / 算法内部；三种写法：公式 / 茎叶图 / 列表
  │     ├── 四个基本序列 δ(n)、u(n)、R_N(n)、aⁿu(n) 与三个恒等式
  │     │      R_N = u(n) − u(n−N)；δ = u(n) − u(n−1)；u = Σδ
  │     ├── 周期性：2π/ω₀ 为有理数才周期；N = 最简分数的分子
  │     ├── 频率的分歧：ω 与 ω+2π 等价 ⇒ 频谱以 2π 为周期，最高频 ω = π
  │     ├── 运算：加、乘（加窗）、移位、翻转、抽取/插值（→第8章）、累加、差分
  │     └── 能量 E = Σ|x|² / 功率 P：能量序列 vs 功率序列（决定 DTFT 形态）
  │
  ├─ 1.2 线性移不变系统
  │     ├── 四条判据：线性 / 移不变 / 因果 / 稳定（相互独立）
  │     ├── 定义 ⇒ 分解 ⇒ 卷积：x(n)=Σx(m)δ(n−m) ⇒ 线性 ⇒ 移不变 ⇒ y = x ∗ h
  │     ├── 卷积四算：图解 / 解析 / 列表 / 变换
  │     ├── 卷积三律：交换 + 结合（级联合并）+ 分配（并联合并）
  │     ├── 因果 ⟺ h(n)=0 (n<0)；稳定 ⟺ Σ|h(n)| < ∞
  │     └── 三种等价描述：h(n) ↔ H(z) ↔ 差分方程（← 第2章打通）
  │
  ├─ 1.3 常系数线性差分方程
  │     ├── 一般形式 Σaₖy(n−k) = Σbᵣx(n−r)，阶数 N、系数为常数 ⇒ 线性 + 移不变
  │     ├── 递推解：y(n) = Σbᵣx(n−r) − Σaₖy(n−k)（计算机实现方式）
  │     ├── 经典解：齐次解（特征根，自由振荡）+ 特解（输入形状）+ 初始条件定系数
  │     ├── 分解：全响应 = 零输入响应（yzi，齐次解）+ 零状态响应（yzs = x ∗ h）
  │     ├── 冲激响应：x = δ、初始松弛 ⇒ h(n)（注意分子带来的"直接项"）
  │     └── 结构：非递归（FIR，有限长、天生稳定）/ 递归（IIR，反馈换陡度）
  │
  └─ 1.4 连续时间信号的抽样
        ├── 模型：p(t) = Σδ(t−nT)，x̂ₐ = xₐ·p
        ├── 频域：X̂ₐ(jΩ) = (1/T)Σ Xₐ(j(Ω−kΩₛ))  ← 周期延拓（延拓是"必然而非偶然"）
        ├── 抽样定理：Ωₛ ≥ 2Ω_h；折叠频率 Ωₛ/2 = 奈奎斯特频率（工程留 2.5~5 倍余量）
        ├── 混叠：Ωₛ < 2Ω_h ⇒ 假频，f_表现 = |((f+fₛ/2) mod fₛ) − fₛ/2|；不可逆
        ├── 恢复：理想低通 H = T (|Ω|<Ωₛ/2) ⇒ sinc 插值 xₐ(t) = Σxₐ(nT)·Sa(π(t−nT)/T)
        ├── 归一化：ω = ΩT（Ωₛ→2π，Ωₛ/2→π）⇒ 一套系数通吃所有采样率
        ├── 带通抽样：fₛ = 2B(1+M/N) ≥ 2B（SDR 中频采样的依据，代价是保护带窄）
        └── 工程：抗混叠滤波器 + 采样保持 + 量化 + 过采样/抽取（→第8章）
```

# 关联

- 下一章：[[vault-notes/dsp/02-z-transform-and-dtft]] —— 给本章的一切配上"坐标系"
- 全书骨架：[[vault-notes/dsp/02-z-transform-and-dtft]] → [[vault-notes/dsp/03-discrete-fourier-transform]] → [[vault-notes/dsp/04-fast-fourier-transform]] → [[vault-notes/dsp/05-filter-structures]] → [[vault-notes/dsp/06-iir-filter-design]] → [[vault-notes/dsp/07-fir-filter-design]] → [[vault-notes/dsp/08-multirate-sampling]]

**本章留下的三个悬念（第 2 章结清）**：

| 本章的悬念 | 第 2 章的答案 |
| --- | --- |
| 卷积要一条条算，还要求闭合形式，能不能变简单？ | $z$ 变换把 $x*h$ **变成乘法** $X(z)H(z)$，闭合形式一次算出 |
| "$\sum\lvert h(n)\rvert<\infty$"这个稳定性判据太抽象，不好用 | 翻译成 $H(z)$ 的**极点全在单位圆内**，一眼可见 |
| 抽样后"频率是个圆"到底怎么回事？$T$ 去哪了？ | $z=e^{sT}=e^{j\omega}$：**单位圆就是频率轴**，抽样周期 $T$ 藏在 $z$ 的定义里 |

**通信方向应用**：

- [[vault-notes/communication/02-deterministic-signals]] —— 本章 1.4 节的频谱延拓与那里的"频谱密度／功率谱"直接对接：连续信号经抽样后的功率谱就是原功率谱以 $f_s$ 为周期的搬移（工程上这也是"采样时钟杂散"分析的标准手法）。同一条帕塞瓦尔关系在离散域变成第 2 章的 $\sum\lvert x(n)\rvert^2=\frac{1}{2\pi}\int\lvert X(e^{j\omega})\rvert^2 d\omega$。
- [[vault-notes/communication/06-digital-baseband]] —— 本章 1.2 节的卷积在这里成为主戏：**信道 = $h(n)$，接收波形 = 发送成形脉冲 ∗ 信道 ∗ 接收滤波**；"无码间串扰"条件（奈奎斯特第一准则）本质是在设计成形脉冲的**频谱**，用到的正是本章"抽样后频谱周期延拓"这一条——**让延拓的副本互不重叠且总和为常数**。本章"混叠不可逆"的结论则解释了为什么接收端必须"同步采样"，采样相位错了就是自造混叠。
- [[vault-notes/communication/09-optimal-reception]] —— **匹配滤波器就是一次卷积**：$h(n)=s(N-1-n)$（时间翻转 + 移位），输出在 $n=N-1$ 处抽样得到最大信噪比。用本章的语言，"相关"与"卷积"只是"翻转不翻转"的区别；第 2 章会看到匹配滤波在频域就是与 $S^*(e^{j\omega})$ 相乘。
- [[vault-notes/communication/07-digital-bandpass]]／[[vault-notes/communication/08-advanced-digital-modulation]] —— 本章 1.1 节的复指数序列 $e^{j\omega_0 n}$ 是数字下变频（DDC）的本体：把中频采样后的实序列乘以 $e^{-j\omega_{IF}n}$ 即得基带复信号 I+jQ。带通抽样定理（1.4 节）决定这条链路的采样率。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— OFDM 的每个子载波就是一根 $e^{j\omega_k n}$，子载波间隔 $\Delta f = 1/T_{sym}$ 保证它们在离散频率上"错开半格"，正是本章"离散频率是一个 $2\pi$ 的圆、可分辨频率只能到 $\pi$"的直接推论；而"CP 长度 > 信道时延扩展"保护的也正是本章"卷积 = 信道作用"这条模型。
- [[vault-notes/fpga/ad9361/iq-signals]]／[[vault-notes/fpga/ad9361/ad9361-digital-interface]] —— 接收链路上的实数中频采样、数字混频、抽取滤波（CIC/HB）在数学上完全由本章 1.4 节与第 8 章描述；AD9361 内部正是"过采样 ADC + 数字抽取 + 抗混叠"这一套。
- [[vault-notes/math/linear-algebra/01-vector-introduction]] —— 长度为 $N$ 的有限长序列就是 $\mathbb{R}^N$ 中的一个向量：$\sum\lvert x(n)\rvert^2$ 是长度平方、$\sum \lvert h(n)\rvert$ 是 1-范数；卷积对固定 $h$ 是**线性算子**（第 2 章会看到它就是 Toeplitz 矩阵乘法）。线性代数里的"投影／正交"在第 9 章的相关接收机里原样出现。

**相关**：[[vault-notes/dsp/02-z-transform-and-dtft]]｜[[vault-notes/dsp/03-discrete-fourier-transform]]｜[[vault-notes/communication/06-digital-baseband]]｜[[vault-notes/communication/09-optimal-reception]]｜[[vault-notes/matlab/matlab-notes]]
