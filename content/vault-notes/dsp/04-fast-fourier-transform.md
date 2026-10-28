---
title: "快速傅里叶变换(FFT)"
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
> 第 3 章的 DFT 是"能算"的，但**直接算太慢**：$N$ 点需要 $N^2$ 次复数乘。本章把它降到 $N\log_2N$：
> - **4.1 引言**：FFT 不是一种新的变换，而是 DFT 的**快速算法**；它的出现让实时频谱分析、OFDM、雷达、图像处理成为可能。
> - **4.2 直接计算 DFT 的运算量及减少运算量的基本途径**：先数清楚"慢在哪"，再利用 $W_N$ 的周期性与半周期反转，把大问题拆成小问题。
> - **4.3 按时间抽取（DIT）的基-2 FFT**：按 $n$ 的奇偶把序列一分为二，递归下去，得到蝶形运算与位倒序输入。
> - **4.4 按频率抽取（DIF）的基-2 FFT**：按 $k$ 的奇偶把输出一分为二，蝶形在前、位倒序在后。
> - **4.5 快速傅里叶反变换（IFFT）**：用"共轭 + FFT + 共轭 + 除以 $N$"直接复用 FFT 程序。
> - **4.6 线性卷积与线性相关的 FFT 算法**：补零后用 FFT 算线性卷积；长序列用重叠相加/重叠保留。
>
> 一句话主线：**FFT 的全部魔法只有一条——把 $N$ 点 DFT 拆成两个 $N/2$ 点 DFT，而"拆"的依据是 $W_N^{k+N/2}=-W_N^k$；递归 $\log_2N$ 次后，$N^2$ 变成 $N\log_2N$。**

> [!note] 记号约定
> - $N=2^L$：基-2 FFT 的点数；$L=\log_2N$ 为级数
> - $W_N=e^{-j2\pi/N}$：旋转因子；$W_N^{k+N/2}=-W_N^k$
> - $x_1(r)=x(2r)$：偶序号子序列；$x_2(r)=x(2r+1)$：奇序号子序列
> - **蝶形**（butterfly）：一次复数乘 + 两次复数加的运算单元
> - **位倒序**（bit-reversal）：把下标写成 $L$ 位二进制后左右翻转
> - 复数乘 = 4 次实数乘 + 2 次实数加；复数加 = 2 次实数加（本节运算量按复数运算计）

# 1. 引言

DFT 的定义是

$$
X(k)=\sum_{n=0}^{N-1}x(n)W_N^{nk},\qquad k=0,1,\dots,N-1
$$

直接计算时：

- 每个 $X(k)$ 需要 $N$ 次复数乘、$N-1$ 次复数加
- 全部 $N$ 个 $X(k)$ 需要 $N^2$ 次复数乘、$N(N-1)$ 次复数加
- 所以直接 DFT 的复杂度是 $O(N^2)$

| $N$ | 直接 DFT 复数乘 | FFT 复数乘（$N/2\log_2N$） | 加速比 |
| --- | --- | --- | --- |
| 64 | 4096 | 192 | 21× |
| 256 | 65536 | 1024 | 64× |
| 1024 | 1,048,576 | 5120 | 205× |
| 4096 | 16,777,216 | 24,576 | 683× |

> [!info] Def 1 快速傅里叶变换
> **快速傅里叶变换**（fast Fourier transform，简称 FFT）是一类**计算 DFT 的快速算法**的总称，不是新的变换。最常用的是 1965 年 Cooley–Tukey 提出的基-2 算法，它把 $N$ 点 DFT 的复杂度从 $O(N^2)$ 降到 $O(N\log_2N)$。

> [!note] FFT 的历史小注
> 高斯在 1805 年就手算过类似的分治算法，但未发表；1965 年 Cooley 与 Tukey 为计算核试验数据重新发现，并随计算机普及而成为数字信号处理的基石。今天几乎所有"频谱"相关的工程——OFDM、5G、雷达、MRI、音频——底层都在调用 FFT。

# 2. 直接计算 DFT 的运算量及减少运算量的基本途径

## 运算量

一次复数乘需要 4 次实数乘 + 2 次实数加；一次复数加需要 2 次实数加。直接 DFT：

$$
N^2\ \text{复数乘},\qquad N(N-1)\ \text{复数加}
$$

当 $N$ 很大时，$N^2$ 是灾难性的。

## 减少运算量的三条途径

### 途径一：利用 $W_N$ 的对称性

$$
W_N^{k+N/2}=e^{-j2\pi(k+N/2)/N}=e^{-j2\pi k/N}\cdot e^{-j\pi}=-W_N^k
$$

这条性质让"半个旋转因子"可以免费得到，是蝶形运算的核心。

### 途径二：利用 $W_N$ 的周期性

$$
W_N^{nk}=W_N^{nk\bmod N}
$$

很多乘积会重复出现，可以预先算好一张表（旋转因子表），避免重复计算。

### 途径三：分治（divide and conquer）

把 $N$ 点 DFT 拆成若干个更小的 DFT，递归计算。拆分方式有两种：

| 拆分方式 | 名称 | 特点 |
| --- | --- | --- |
| 按 $n$ 的奇偶拆 | **按时间抽取**（decimation in time，简称 DIT） | 输入位倒序，输出自然序 |
| 按 $k$ 的奇偶拆 | **按频率抽取**（decimation in frequency，简称 DIF） | 输入自然序，输出位倒序 |

> [!tip] 一句话记住 DIT 与 DIF
> **DIT：先拆输入（时间），蝶形在最后；DIF：先拆输出（频率），蝶形在最前。**
> 两者互为转置，运算量完全相同，只是数据排列顺序不同。

# 3. 按时间抽取（DIT）的基-2 FFT 算法

## 奇偶分解

设 $N=2^L$。把 $x(n)$ 按 $n$ 的奇偶分成两组：

$$
x_1(r)=x(2r),\qquad x_2(r)=x(2r+1),\qquad r=0,1,\dots,\frac{N}{2}-1
$$

则

$$
X(k)=\sum_{r=0}^{N/2-1}x_1(r)W_N^{2rk}+W_N^k\sum_{r=0}^{N/2-1}x_2(r)W_N^{2rk}
$$

利用 $W_N^2=W_{N/2}$：

$$
X(k)=\underbrace{\sum_{r=0}^{N/2-1}x_1(r)W_{N/2}^{rk}}_{X_1(k)}+W_N^k\underbrace{\sum_{r=0}^{N/2-1}x_2(r)W_{N/2}^{rk}}_{X_2(k)}
$$

即

$$
X(k)=X_1(k)+W_N^kX_2(k),\qquad k=0,1,\dots,\frac{N}{2}-1
$$

再由 $W_N^{k+N/2}=-W_N^k$，得到后半段：

$$
X\left(k+\frac{N}{2}\right)=X_1(k)-W_N^kX_2(k),\qquad k=0,1,\dots,\frac{N}{2}-1
$$

> [!info] Def 2 蝶形运算
> 上面两式构成一个**蝶形运算**（butterfly）：
> $$\begin{aligned}
> X(k)&=X_1(k)+W_N^kX_2(k)\\
> X(k+N/2)&=X_1(k)-W_N^kX_2(k)
> \end{aligned}$$
> 它只需要**一次复数乘**（$W_N^kX_2(k)$）和**两次复数加**，同时算出两个输出。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <text x="40.0" y="100.0" text-anchor="start" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="normal">x(n)</text>
  <text x="40.0" y="210.0" text-anchor="start" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="normal">x(n+N/2)</text>
  <line x1="110.0" y1="95.0" x2="250.0" y2="95.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="110.0" y1="205.0" x2="250.0" y2="205.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="250.0" y1="95.0" x2="250.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="250.0" y1="150.0" x2="420.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="250.0" y1="205.0" x2="250.0" y2="250.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="250.0" y1="250.0" x2="320.0" y2="250.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="320.0" y="232.0" width="70.0" height="36.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="355.0" y="254.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">W_N^k</text>
  <line x1="390.0" y1="250.0" x2="420.0" y2="250.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="420.0" y1="250.0" x2="420.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <circle cx="470.0" cy="150.0" r="11.0" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="462.0" y1="150.0" x2="478.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.0"/>
  <line x1="470.0" y1="142.0" x2="470.0" y2="158.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.0"/>
  <line x1="420.0" y1="150.0" x2="459.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="481.0" y1="150.0" x2="560.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4" marker-end="url(#ar)"/>
  <line x1="470.0" y1="161.0" x2="470.0" y2="210.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="470.0" y1="210.0" x2="560.0" y2="210.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4" marker-end="url(#ar)"/>
  <text x="590.0" y="155.0" text-anchor="start" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">X(k) = x(n) + W_N^k x(n+N/2)</text>
  <text x="590.0" y="215.0" text-anchor="start" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">X(k+N/2) = x(n) − W_N^k x(n+N/2)</text>
  <text x="60.0" y="285.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">蝶形运算（butterfly）：一次复数乘 + 两次复数加，是基-2 FFT 的最小积木</text>
  <text x="462.0" y="205.0" text-anchor="start" font-size="16" fill="#dc2626" font-weight="normal">−</text>
</svg>

> [!important] 蝶形的"省"在哪
> 如果分开算 $X(k)$ 与 $X(k+N/2)$，需要乘两次 $W_N^k$ 和 $W_N^{k+N/2}$；利用 $W_N^{k+N/2}=-W_N^k$，**第二次乘法变成取负号**，乘法次数直接减半。整个 FFT 的加速就来自这里。

## 递归分解与位倒序

对 $X_1(k)$、$X_2(k)$ 继续按奇偶分解，直到每个子 DFT 只有 2 点。整个过程共 $\log_2N$ 级，每级 $N/2$ 个蝶形。

以 $N=8$ 为例，输入的分组顺序为：

$$
x(0),x(4),x(2),x(6),x(1),x(5),x(3),x(7)
$$

这正是下标的 **3 位二进制位倒序**：

| 自然序 | 二进制 | 位倒序 | 倒序后下标 |
| --- | --- | --- | --- |
| 0 | 000 | 000 | 0 |
| 1 | 001 | 100 | 4 |
| 2 | 010 | 010 | 2 |
| 3 | 011 | 110 | 6 |
| 4 | 100 | 001 | 1 |
| 5 | 101 | 101 | 5 |
| 6 | 110 | 011 | 3 |
| 7 | 111 | 111 | 7 |

> [!info] Def 3 位倒序
> **位倒序**（bit-reversal）是把下标用 $L=\log_2N$ 位二进制表示后，左右翻转得到的顺序。DIT 算法要求**输入按位倒序、输出按自然序**。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 330" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <rect x="346.0" y="26.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="380.0" y="43.9" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N = 8</text>
  <rect x="166.0" y="86.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="200.0" y="103.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/2</text>
  <rect x="526.0" y="86.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="560.0" y="103.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/2</text>
  <rect x="76.0" y="146.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="110.0" y="163.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/4</text>
  <rect x="256.0" y="146.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="290.0" y="163.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/4</text>
  <rect x="436.0" y="146.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="470.0" y="163.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/4</text>
  <rect x="616.0" y="146.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="650.0" y="163.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/4</text>
  <rect x="31.0" y="216.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="65.0" y="233.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/8</text>
  <rect x="121.0" y="216.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="155.0" y="233.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/8</text>
  <rect x="211.0" y="216.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="245.0" y="233.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/8</text>
  <rect x="301.0" y="216.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="335.0" y="233.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/8</text>
  <rect x="391.0" y="216.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="425.0" y="233.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/8</text>
  <rect x="481.0" y="216.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="515.0" y="233.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/8</text>
  <rect x="571.0" y="216.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="605.0" y="233.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/8</text>
  <rect x="661.0" y="216.0" width="68.0" height="28.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="695.0" y="233.8" text-anchor="middle" font-size="11" fill="var(--text-normal,#1f2328)">N/8</text>
  <line x1="360.0" y1="54.0" x2="180.0" y2="86.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="400.0" y1="54.0" x2="580.0" y2="86.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="188.0" y1="114.0" x2="110.0" y2="146.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="188.0" y1="114.0" x2="290.0" y2="146.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="548.0" y1="114.0" x2="470.0" y2="146.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="548.0" y1="114.0" x2="650.0" y2="146.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="96.0" y1="174.0" x2="65.0" y2="216.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="124.0" y1="174.0" x2="155.0" y2="216.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="276.0" y1="174.0" x2="245.0" y2="216.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="304.0" y1="174.0" x2="335.0" y2="216.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="456.0" y1="174.0" x2="425.0" y2="216.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="484.0" y1="174.0" x2="515.0" y2="216.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="636.0" y1="174.0" x2="605.0" y2="216.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <line x1="664.0" y1="174.0" x2="695.0" y2="216.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="380.0" y="270.0" text-anchor="middle" font-size="12" fill="var(--text-accent,#705dcf)" font-weight="normal">输入按位倒序排列：x(0), x(4), x(2), x(6), x(1), x(5), x(3), x(7)</text>
  <text x="380.0" y="292.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">每级 N/2 个蝶形，共 log₂N 级 → 复数乘 N/2·log₂N 次</text>
</svg>

## 运算量

每级有 $N/2$ 个蝶形，每个蝶形 1 次复数乘、2 次复数加；共 $\log_2N$ 级：

$$
\text{复数乘}=\frac{N}{2}\log_2N,\qquad \text{复数加}=N\log_2N
$$

相比直接 DFT 的 $N^2$，加速比为

$$
\frac{N^2}{(N/2)\log_2N}=\frac{2N}{\log_2N}
$$

## 原地运算

DIT 的每一级蝶形只依赖上一级的两个节点，且输出可以覆盖输入（**in-place**），因此只需要 $N$ 个复数存储单元（外加旋转因子表）。这是 FFT 能塞进单片机/FPGA 的重要原因。

> [!example] N=8 的第一级
> 输入位倒序后为 $x(0),x(4),x(2),x(6),x(1),x(5),x(3),x(7)$。
> 第一级把相邻两两做 2 点 DFT（旋转因子 $W_2^0=1$）：
> $$
> x(0)\pm x(4),\quad x(2)\pm x(6),\quad x(1)\pm x(5),\quad x(3)\pm x(7)
> $$
> 第二级用 $W_4^0=1$、$W_4^1=-j$；第三级用 $W_8^0,W_8^1,W_8^2,W_8^3$。三级之后得到自然序的 $X(0)\sim X(7)$。

## MATLAB

```matlab
N = 8;
x = randn(1, N);                 % 随便取一个序列
X = fft(x);                      % MATLAB 内部就是 FFT（混合基）
% 手写一个简单的基-2 DIT（递归版，帮助理解）
function X = my_fft(x)
    N = length(x);
    if N == 1
        X = x; return;
    end
    xe = my_fft(x(1:2:end));     % 偶序号
    xo = my_fft(x(2:2:end));     % 奇序号
    W = exp(-2j*pi*(0:N/2-1)/N);
    X = [xe + W.*xo, xe - W.*xo];
end
X2 = my_fft(x);
disp(norm(X - X2));              % 应为 0（或 1e-15 量级）
```

# 4. 按频率抽取（DIF）的基-2 FFT 算法

## 输出奇偶分解

DIF 不拆输入，而是把输入序列分成前后两半，先做蝶形，再把输出按 $k$ 的奇偶拆开。

由 DFT 定义，把 $n$ 分成 $0\sim N/2-1$ 与 $N/2\sim N-1$：

$$
X(k)=\sum_{n=0}^{N/2-1}x(n)W_N^{nk}+\sum_{n=0}^{N/2-1}x\left(n+\frac{N}{2}\right)W_N^{(n+N/2)k}
$$

利用 $W_N^{Nk/2}=(-1)^k$：

$$
X(k)=\sum_{n=0}^{N/2-1}\left[x(n)+(-1)^kx\left(n+\frac{N}{2}\right)\right]W_N^{nk}
$$

- $k$ 为偶数（$k=2r$）：括号内为 $x(n)+x(n+N/2)$
- $k$ 为奇数（$k=2r+1$）：括号内为 $[x(n)-x(n+N/2)]W_N^n$

于是

$$
X(2r)=\mathrm{DFT}_{N/2}\left[x(n)+x\left(n+\frac{N}{2}\right)\right]
$$
$$
X(2r+1)=\mathrm{DFT}_{N/2}\left[\left(x(n)-x\left(n+\frac{N}{2}\right)\right)W_N^n\right]
$$

> [!info] Def 4 按频率抽取
> **按频率抽取**（decimation in frequency，简称 DIF）的基-2 FFT：先对输入前后两半做蝶形（和/差），再分别做 $N/2$ 点 DFT，输出按偶/奇频率分开。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <text x="40.0" y="100.0" text-anchor="start" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="normal">x(n)</text>
  <text x="40.0" y="210.0" text-anchor="start" font-size="13" fill="var(--text-normal,#1f2328)" font-weight="normal">x(n+N/2)</text>
  <line x1="110.0" y1="95.0" x2="250.0" y2="95.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="110.0" y1="205.0" x2="250.0" y2="205.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="250.0" y1="95.0" x2="250.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="250.0" y1="150.0" x2="420.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="250.0" y1="205.0" x2="250.0" y2="250.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="250.0" y1="250.0" x2="320.0" y2="250.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <rect x="320.0" y="232.0" width="70.0" height="36.0" rx="3" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <text x="355.0" y="254.2" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)">W_N^k</text>
  <line x1="390.0" y1="250.0" x2="420.0" y2="250.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="420.0" y1="250.0" x2="420.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <circle cx="470.0" cy="150.0" r="11.0" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="462.0" y1="150.0" x2="478.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.0"/>
  <line x1="470.0" y1="142.0" x2="470.0" y2="158.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.0"/>
  <line x1="420.0" y1="150.0" x2="459.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="481.0" y1="150.0" x2="560.0" y2="150.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4" marker-end="url(#ar)"/>
  <line x1="470.0" y1="161.0" x2="470.0" y2="210.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <line x1="470.0" y1="210.0" x2="560.0" y2="210.0" stroke="var(--text-normal,#1f2328)" stroke-width="1.4" marker-end="url(#ar)"/>
  <text x="590.0" y="155.0" text-anchor="start" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">X(k) = x(n) + W_N^k x(n+N/2)</text>
  <text x="590.0" y="215.0" text-anchor="start" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">X(k+N/2) = x(n) − W_N^k x(n+N/2)</text>
  <text x="60.0" y="285.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">蝶形运算（butterfly）：一次复数乘 + 两次复数加，是基-2 FFT 的最小积木</text>
  <text x="462.0" y="205.0" text-anchor="start" font-size="16" fill="#dc2626" font-weight="normal">−</text>
</svg>

## DIT 与 DIF 的对比

| 维度 | DIT | DIF |
| --- | --- | --- |
| 拆分对象 | 输入 $n$ 的奇偶 | 输出 $k$ 的奇偶 |
| 蝶形位置 | 每级最后 | 每级最前 |
| 输入顺序 | **位倒序** | 自然序 |
| 输出顺序 | 自然序 | **位倒序** |
| 旋转因子 | 先乘后加 | 先加后乘 |
| 运算量 | $N/2\log_2N$ 复数乘 | 相同 |
| 适用 | 输入需要倒序的场合 | 输入自然序更方便（如实时流） |

> [!tip] 记忆
> **DIT = "时间先拆，蝶形收尾"；DIF = "频率先拆，蝶形开头"。** 两者是转置关系，写代码时任选其一。

# 5. 快速傅里叶反变换（IFFT）算法

IDFT 的定义是

$$
x(n)=\frac{1}{N}\sum_{k=0}^{N-1}X(k)W_N^{-nk}
$$

与 DFT 相比，只差**旋转因子取共轭**和**除以 $N$**。因此可以完全复用 FFT 程序：

$$
x(n)=\frac{1}{N}\left[\mathrm{FFT}\big(X^*(k)\big)\right]^*
$$

推导：对 $X^*(k)$ 做 DFT：

$$
\mathrm{DFT}[X^*(k)]=\sum_{k=0}^{N-1}X^*(k)W_N^{nk}=\left[\sum_{k=0}^{N-1}X(k)W_N^{-nk}\right]^*=\big[Nx(n)\big]^*
$$

两边取共轭再除以 $N$，即得 $x(n)$。

> [!info] Def 5 快速傅里叶反变换
> **快速傅里叶反变换**（inverse fast Fourier transform，简称 IFFT）用 FFT 实现 IDFT：
> $$
> x(n)=\frac{1}{N}\big[\mathrm{FFT}(X^*)\big]^*
> $$
> 也可以把 FFT 中的 $W_N$ 全部换成 $W_N^{-1}$，最后乘 $1/N$。

MATLAB 里直接 `ifft(X)`；FPGA 里通常复用同一个 FFT 核，切换旋转因子表并加一个 $1/N$ 缩放。

# 6. 线性卷积与线性相关的 FFT 算法

## 用 FFT 算线性卷积

由第 3 章，补零到 $L\ge L_x+L_h-1$ 后：

$$
y(n)=x(n)*h(n)=\mathrm{IFFT}\big[\mathrm{FFT}_L(x)\cdot\mathrm{FFT}_L(h)\big]
$$

运算量：

| 方法 | 复数乘 |
| --- | --- |
| 直接线性卷积 | $L_xL_h$ |
| FFT 法 | $\frac{3L}{2}\log_2L+O(L)$（两次正变换 + 一次反变换） |

当 $L_x,L_h$ 都很大时，FFT 法明显更快。

> [!example] 长度比较
> $L_x=L_h=1024$：直接卷积约 $1.05\times10^6$ 次复数乘；补零到 $L=2047$（取 2048）后 FFT 法约 $3\times\frac{2048}{2}\times11\approx3.4\times10^4$ 次，快约 30 倍。

## 重叠相加法（overlap-add）

当 $x(n)$ 很长、$h(n)$ 较短时，把 $x(n)$ 切成若干段，每段长度 $L$，与 $h(n)$（长度 $M$）做 $N=L+M-1$ 点 FFT 卷积，再把各段结果**重叠相加**：

1. 把 $x(n)$ 分成不重叠的段 $x_i(n)$，每段长 $L$
2. 每段补零到 $N=L+M-1$，与补零到 $N$ 的 $h(n)$ 做 $N$ 点 FFT 卷积
3. 第 $i$ 段的结果长度为 $N$，其前 $M-1$ 个点与上一段的尾部重叠
4. 把重叠部分相加，拼接输出

> [!info] Def 6 重叠相加法
> **重叠相加法**（overlap-add，简称 OLA）把长序列分段与短滤波器卷积，各段卷积结果的**重叠部分相加**，从而用固定长度的 FFT 完成任意长序列的线性卷积。

## 重叠保留法（overlap-save）

另一种分块方式：

1. 每段输入取 $N$ 点，相邻段**重叠** $M-1$ 点
2. 与 $h(n)$ 做 $N$ 点圆周卷积（$h$ 补零到 $N$）
3. 每段输出的前 $M-1$ 点是被"绕回"污染的，**丢弃**；保留后 $N-M+1$ 点
4. 拼接保留部分

> [!tip] OLA 与 OLS 的选择
> - **重叠相加**：输入不重叠，输出重叠相加；直观，适合块处理。
> - **重叠保留**：输入重叠，输出丢弃前 $M-1$ 点；不需要额外的加法缓冲，实时流处理更常用。

## 线性相关

互相关：

$$
R_{xy}(m)=\sum_{n=-\infty}^{\infty}x(n)y(n-m)
$$

用 FFT 计算：

$$
R_{xy}(m)=\mathrm{IFFT}\big[X(k)Y^*(k)\big]
$$

注意是 $Y^*$ 而不是 $Y$。自相关同理：$R_{xx}(m)=\mathrm{IFFT}[|X(k)|^2]$。

## MATLAB

```matlab
% 线性卷积：补零 + FFT
x = randn(1, 4000); h = fir1(63, 0.3);
L = length(x) + length(h) - 1;
y_fft = ifft(fft(x, L) .* fft(h, L));
y_dir = conv(x, h);
disp(norm(y_fft - y_dir));       % 应接近 0

% 重叠相加（MATLAB 的 fftfilt 内部就是这么做的）
y_ola = fftfilt(h, x);           % 自动分块、重叠相加

% 互相关
r = ifft(fft(x, L) .* conj(fft(h, L)));

% IFFT 的共轭技巧
X = fft(x);
x2 = conj(fft(conj(X))) / length(X);
disp(norm(x - x2));
```

> [!tip] 本章收官
> 本章只做了一件事：**把 DFT 算快**。全部推导可以压缩成三步：
> 1. **数清代价**（4.2）：直接 DFT 是 $O(N^2)$，瓶颈是重复计算 $W_N^{nk}$；
> 2. **利用对称性**（4.3/4.4）：$W_N^{k+N/2}=-W_N^k$ 让一次蝶形同时算出两个输出，乘法减半；
> 3. **分治递归**（4.3/4.4）：把 $N$ 点拆成两个 $N/2$ 点，递归 $\log_2N$ 级，得到 $O(N\log_2N)$。
>
> 第 4.5 节的 IFFT 是"共轭 + FFT + 共轭 + 除以 $N$"，第 4.6 节把 FFT 用在卷积与相关上——这两节是 FFT 在工程里真正的用武之地。下一章转向"给定 $H(z)$，怎么把它画成电路/程序"，即数字滤波器的基本结构。

# 本章知识地图

```
快速傅里叶变换（FFT）
  ├─ 1. 引言
  │     ├── FFT 是 DFT 的快速算法，不是新变换
  │     ├── 直接 DFT：N² 复数乘、N(N−1) 复数加
  │     └── 基-2 FFT：N/2·log₂N 复数乘、N·log₂N 复数加
  │
  ├─ 2. 减少运算量的三条途径
  │     ├── 对称性：W_N^{k+N/2} = −W_N^k
  │     ├── 周期性：W_N^{nk} = W_N^{nk mod N}
  │     └── 分治：按时间拆（DIT）/ 按频率拆（DIF）
  │
  ├─ 3. DIT 基-2 FFT
  │     ├── x₁(r)=x(2r)，x₂(r)=x(2r+1)
  │     ├── X(k)=X₁(k)+W_N^kX₂(k)
  │     ├── X(k+N/2)=X₁(k)−W_N^kX₂(k)
  │     ├── 蝶形：1 次复乘 + 2 次复加
  │     ├── 输入位倒序、输出自然序
  │     └── log₂N 级、每级 N/2 个蝶形
  │
  ├─ 4. DIF 基-2 FFT
  │     ├── 先蝶形（和/差），再 N/2 点 DFT
  │     ├── X(2r)=DFT[x(n)+x(n+N/2)]
  │     ├── X(2r+1)=DFT[(x(n)−x(n+N/2))W_N^n]
  │     └── 输入自然序、输出位倒序（与 DIT 互为转置）
  │
  ├─ 5. IFFT
  │     ├── x(n)=1/N·[FFT(X*)]*
  │     └── 或把 W_N 换成 W_N⁻¹，最后乘 1/N
  │
  └─ 6. 线性卷积与相关
        ├── 补零到 L≥L_x+L_h−1，再做 FFT/IFFT
        ├── 重叠相加 OLA：输入不重叠，输出重叠相加
        ├── 重叠保留 OLS：输入重叠，丢弃前 M−1 点
        └── 互相关：IFFT[X(k)Y*(k)]
```

# 关联

- 上一章：[[vault-notes/dsp/03-discrete-fourier-transform]] —— FFT 是 DFT 的快速算法
- 下一章：[[vault-notes/dsp/05-filter-structures]] —— 从"算频谱"转向"实现系统"
- 全书骨架：[[vault-notes/dsp/01-discrete-time-systems]] → [[vault-notes/dsp/02-z-transform-and-dtft]] → [[vault-notes/dsp/03-discrete-fourier-transform]] → **本章** → [[vault-notes/dsp/05-filter-structures]] → [[vault-notes/dsp/06-iir-filter-design]] → [[vault-notes/dsp/07-fir-filter-design]] → [[vault-notes/dsp/08-multirate-sampling]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 蝶形、旋转因子 | [[vault-notes/dsp/05-filter-structures]] 的信号流图；FPGA 的 FFT 核 |
| 位倒序 | OFDM 的 IFFT 实现；[[vault-notes/dsp/08-multirate-sampling]] 的多相结构 |
| IFFT | [[vault-notes/dsp/07-fir-filter-design]] 的频率采样设计 |
| 线性卷积的 FFT 算法 | [[vault-notes/dsp/05-filter-structures]] 的频域实现；[[vault-notes/communication/06-digital-baseband]] 的频域均衡 |
| 重叠相加/保留 | 实时滤波、软件无线电的长数据流处理 |

**本章留下的三个悬念（第 5 章结清）**：

| 本章的悬念 | 第 5 章的答案 |
| --- | --- |
| 蝶形图很直观，但一个滤波器到底长什么样？ | 用 $z^{-1}$、乘法器、加法器画出**直接型/级联型/并联型**结构 |
| IIR 与 FIR 的结构差别在哪？ | IIR 有反馈（递归），FIR 只有前馈（非递归）；直接型 I/II 的延迟数不同 |
| 结构不同会影响性能吗？ | 会：有限字长下的舍入噪声、溢出、系数敏感度都与结构有关；级联/并联比直接型稳健 |

**通信方向应用**：

- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 5G NR 的 OFDM 调制/解调就是 IFFT/FFT；FFT 的 $N$ 点大小、位倒序、旋转因子表直接决定基带处理的复杂度。
- [[vault-notes/communication/06-digital-baseband]] —— 频域均衡（FDE）用 FFT 把信道卷积变乘法；OFDM 接收机一个抽头就能均衡，全部依赖本章的"卷积 ↔ 乘法"。
- 雷达／[[vault-notes/fpga/ad9361/iq-signals]] —— 脉冲压缩就是匹配滤波 = 相关 = FFT 共轭相乘；雷达的距离像、SAR 成像都靠 FFT。
- [[vault-notes/matlab/matlab-notes]] —— `fft`/`ifft`/`fftfilt`/`xcorr`/`nextpow2` 是本章内容的直接工具。
- [[vault-notes/math/linear-algebra/01-vector-introduction]] —— FFT 是 DFT 矩阵的**快速分解**：把 $\mathbf{W}_N$ 拆成稀疏矩阵的乘积，$\mathbf{W}_N=\mathbf{P}\mathbf{A}_1\cdots\mathbf{A}_L$，其中 $\mathbf{P}$ 是位倒序置换矩阵。

**相关**：[[vault-notes/dsp/03-discrete-fourier-transform]]｜[[vault-notes/dsp/05-filter-structures]]｜[[vault-notes/5g/phy/04-physical-channels-signals]]｜[[vault-notes/matlab/matlab-notes]]
