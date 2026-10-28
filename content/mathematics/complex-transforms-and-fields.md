---
title: 复变变换与场论
description: 傅里叶级数与傅里叶变换、拉普拉斯变换与 s 域稳定性，再到麦克斯韦方程、亥姆霍兹定理与边值问题。
tags:
  - mathematics
  - complex-analysis
  - fourier
  - laplace
  - fields
---

## 为什么变换与场论放在一起

傅里叶变换本质上是"把函数投影到复指数正交基上"，而正交性来自单位根与复积分；拉普拉斯变换是"乘一个衰减因子再做傅里叶变换"，$s=\sigma+j\omega$ 把收敛性问题变成复平面上的半平面；系统函数 $H(s)$ 的极点位置决定稳定性，极点就是复变函数里的奇点。场论部分则把"解析函数生成调和函数"这条线索用在二维静电场、温度场与势流上。

本文把这两块串起来：先讲傅里叶级数与傅里叶变换（信号处理的语言），再讲拉普拉斯变换（连续系统的语言），最后讲矢量场、麦克斯韦方程与边值问题（电磁场的语言）。复变函数的基础见 [[mathematics/complex-analysis|复变函数基础]]。

## 傅里叶级数

### 三角形式与复指数形式

周期为 $T$、角频率 $\omega_0=2\pi/T$ 的信号，在满足**狄利克雷条件**（一个周期内绝对可积、有限个极值点与间断点）时可展开为

$$
f(t)=\frac{a_0}{2}+\sum_{n=1}^{\infty}\left(a_n\cos n\omega_0t+b_n\sin n\omega_0t\right)
$$

系数由正交性"投影"得到：

$$
a_n=\frac{2}{T}\int_{-T/2}^{T/2}f(t)\cos n\omega_0t\,dt,
\qquad
b_n=\frac{2}{T}\int_{-T/2}^{T/2}f(t)\sin n\omega_0t\,dt
$$

更紧凑的**复指数形式**：

$$
f(t)=\sum_{n=-\infty}^{\infty}c_ne^{in\omega_0t},
\qquad
c_n=\frac{1}{T}\int_{-T/2}^{T/2}f(t)e^{-in\omega_0t}\,dt
$$

两套系数关系：$c_0=a_0/2$，$n>0$ 时 $c_n=(a_n-ib_n)/2$、$c_{-n}=\overline{c_n}$（实信号共轭对称）。**物理意义**：$|c_n|$ 是第 $n$ 次谐波的幅度，$\arg c_n$ 是相位；方波、三角波等周期信号因此可以分解为各次谐波之和。

**例（方波）**：$f(t)$ 在 $(-\pi,\pi)$ 上取 $+1$（$0<t<\pi$）与 $-1$（$-\pi<t<0$），周期 $2\pi$。偶对称使 $b_n=0$，计算得

$$
f(t)=\frac{4}{\pi}\sum_{k=1}^{\infty}\frac{\sin((2k-1)t)}{2k-1}
$$

只含奇次谐波，且幅度按 $1/n$ 衰减。在间断点处级数收敛到左右极限的平均值 0（狄利克雷条件的一部分），这与"吉布斯现象"有关——用有限项截断时，间断点附近会出现约 9% 的过冲。

### 与线性代数的对应

把 $e^{in\omega_0t}$ 看作基向量、$c_n$ 看作坐标，傅里叶级数就是"在函数空间里做正交展开"。与有限维 DFT 的区别只是维数：周期信号用可数无穷维基，离散信号用 $N$ 维基。**Parseval 定理**是"正交变换保能量"：

$$
\frac{1}{T}\int_{T}|f(t)|^{2}dt=\sum_{n=-\infty}^{\infty}|c_n|^{2}
$$

## 傅里叶变换

### 定义与存在条件

对非周期信号，令 $T\to\infty$、$\omega_0\to0$，离散谱变为连续谱：

$$
F(\omega)=\int_{-\infty}^{\infty}f(t)e^{-i\omega t}\,dt,
\qquad
f(t)=\frac{1}{2\pi}\int_{-\infty}^{\infty}F(\omega)e^{i\omega t}\,d\omega
$$

**绝对可积** $\int|f(t)|dt<\infty$ 是存在的**充分条件**，不是必要条件：$\delta(t)$、常数、正弦等要用广义函数（分布）意义下的变换。$F(\omega)$ 是复函数，$|F(\omega)|$ 为幅度谱、$\arg F(\omega)$ 为相位谱。

### 基本性质

| 性质 | 时域 | 频域 |
| --- | --- | --- |
| 线性 | $af+bg$ | $aF+bG$ |
| 时移 | $f(t-t_0)$ | $e^{-i\omega t_0}F(\omega)$ |
| 频移 | $e^{i\omega_0t}f(t)$ | $F(\omega-\omega_0)$ |
| 尺度 | $f(at)$ | $\frac{1}{\vert a\vert }F(\omega/a)$ |
| 微分 | $f'(t)$ | $i\omega F(\omega)$ |
| 卷积 | $f*g$ | $F(\omega)G(\omega)$ |
| 相乘 | $f(t)g(t)$ | $\frac{1}{2\pi}(F*G)(\omega)$ |
| 帕塞瓦尔 | $\int\vert f\vert ^2dt$ | $\frac{1}{2\pi}\int\vert F\vert ^2d\omega$ |

**卷积定理**是 LTI 系统分析的枢纽：时域卷积 $\leftrightarrow$ 频域相乘，于是 $y(t)=h(t)*x(t)$ 变成 $Y(\omega)=H(\omega)X(\omega)$。**对偶性**：若 $f(t)\leftrightarrow F(\omega)$，则 $F(t)\leftrightarrow2\pi f(-\omega)$。例如矩形脉冲的频谱是 sinc，sinc 的频谱是矩形；这解释了"时域越窄、频域越宽"的**时宽–带宽积**下界。

### 常用变换对与 δ 函数

| $f(t)$ | $F(\omega)$ |
| --- | --- |
| $\delta(t)$ | $1$ |
| $1$ | $2\pi\delta(\omega)$ |
| $e^{i\omega_0t}$ | $2\pi\delta(\omega-\omega_0)$ |
| $\cos\omega_0t$ | $\pi[\delta(\omega-\omega_0)+\delta(\omega+\omega_0)]$ |
| 矩形脉冲 $\operatorname{rect}(t/\tau)$ | $\tau\operatorname{sinc}(\omega\tau/2)$ |
| $e^{-at}u(t)$（$a>0$） | $\frac{1}{a+i\omega}$ |
| $e^{-a\vert t\vert }$（$a>0$） | $\frac{2a}{a^{2}+\omega^{2}}$ |
| $e^{-t^{2}/(2\sigma^{2})}$ | $\sigma\sqrt{2\pi}e^{-\sigma^{2}\omega^{2}/2}$ |

**δ 函数**不是普通函数，而是"单位面积冲激"：$\delta(t)=0$（$t\ne0$）、$\int\delta=1$，具有抽样性 $\int f(t)\delta(t-t_0)dt=f(t_0)$、卷积性 $f*\delta=f$、缩放性 $\delta(at)=\delta(t)/|a|$。它的傅里叶变换为 1，说明冲激包含所有频率。周期信号的频谱是冲激串，这正是"离散谱"的严格解释。

### 抽样定理与能量守恒

若 $f(t)$ 的频谱限带于 $[-f_H,f_H]$，以 $f_s>2f_H$ 采样（**奈奎斯特条件**）可由样本无失真恢复：

$$
f(t)=\sum_{n=-\infty}^{\infty}f(nT_s)\operatorname{sinc}\left(\frac{t-nT_s}{T_s}\right),
\qquad T_s=1/f_s
$$

这就是"采样—重建"的数学基础；欠采样会导致频谱混叠，混叠后的频率无法区分（见 [[signal-processing/dft-and-fft|DFT 与 FFT]] 中的离散频域分析）。

## 拉普拉斯变换

### 从傅里叶变换到 $s$ 域

傅里叶变换要求绝对可积，$u(t)$、$e^{at}u(t)$（$a>0$）等信号不满足。办法是先乘衰减因子 $e^{-\sigma t}$：

$$
\mathcal{F}[f(t)e^{-\sigma t}]
=\int_{-\infty}^{\infty}f(t)e^{-(\sigma+i\omega)t}dt
\;\xrightarrow{\;s=\sigma+i\omega\;}
F(s)=\int_{0^{-}}^{\infty}f(t)e^{-st}dt
$$

这就是**单边拉普拉斯变换**：从 $0^{-}$ 开始，天然适合因果信号与初值问题；双边版本从 $-\infty$ 开始，适合非因果信号与系统函数的全局分析。

**收敛域（ROC）**：使 $\int_0^\infty|f(t)|e^{-\sigma t}dt<\infty$ 的 $\operatorname{Re}s$ 的集合。单边变换的 ROC 通常是右半平面 $\operatorname{Re}s>\sigma_0$。例如 $u(t)\leftrightarrow1/s$（ROC：$\operatorname{Re}s>0$）；$e^{-at}u(t)\leftrightarrow1/(s+a)$（ROC：$\operatorname{Re}s>-a$）；$e^{at}u(t)\leftrightarrow1/(s-a)$（ROC：$\operatorname{Re}s>a$）。

> [!warning] 同一个 $F(s)$ 可对应不同 $f(t)$
> $1/(s+a)$ 在 $\operatorname{Re}s>-a$ 对应 $e^{-at}u(t)$，在 $\operatorname{Re}s<-a$ 对应 $-e^{-at}u(-t)$。**写拉氏变换必须同时写 ROC**，否则反变换不唯一。这与 z 变换的 ROC 完全类似。

### 常用变换对与性质

| $f(t)$（$t\ge0$） | $F(s)$ | ROC |
| --- | --- | --- |
| $\delta(t)$ | $1$ | 全平面 |
| $u(t)$ | $1/s$ | $\operatorname{Re}s>0$ |
| $t^{n}$ | $n!/s^{n+1}$ | $\operatorname{Re}s>0$ |
| $e^{at}$ | $1/(s-a)$ | $\operatorname{Re}s>\operatorname{Re}a$ |
| $\sin\omega_0t$ | $\omega_0/(s^{2}+\omega_0^{2})$ | $\operatorname{Re}s>0$ |
| $\cos\omega_0t$ | $s/(s^{2}+\omega_0^{2})$ | $\operatorname{Re}s>0$ |
| $e^{at}\sin\omega_0t$ | $\omega_0/[(s-a)^{2}+\omega_0^{2}]$ | $\operatorname{Re}s>\operatorname{Re}a$ |
| $e^{at}\cos\omega_0t$ | $(s-a)/[(s-a)^{2}+\omega_0^{2}]$ | $\operatorname{Re}s>\operatorname{Re}a$ |

关键性质：

$$
\mathcal{L}[f'(t)]=sF(s)-f(0^{-}),
\qquad
\mathcal{L}\left[\int_0^{t}f(\tau)d\tau\right]=\frac{F(s)}{s},
$$

$$
\mathcal{L}[f(t-t_0)u(t-t_0)]=e^{-st_0}F(s),
\qquad
\mathcal{L}[f*g]=F(s)G(s).
$$

**初值定理**：$f(0^{+})=\lim_{s\to\infty}sF(s)$；**终值定理**：若 $sF(s)$ 的极点都在左半平面，则 $f(\infty)=\lim_{s\to0}sF(s)$。终值定理的条件不能省：$f(t)=\sin t$ 的 $sF(s)=s/(s^{2}+1)$ 在虚轴有极点，极限不存在，强行代入得 0 是错的。

### 逆变换：部分分式与留数

**部分分式法**（工程常用）：把有理 $F(s)$ 拆成一次/二次因式，逐项查表。**留数法**（复变解释）：若 $F(s)$ 的极点都在某条竖线左侧，则

$$
f(t)=\sum_k\operatorname{Res}\left[F(s)e^{st},s_k\right],\qquad t>0
$$

**例**：$F(s)=\dfrac{1}{s^{2}+3s+2}=\dfrac{1}{(s+1)(s+2)}=\dfrac{1}{s+1}-\dfrac{1}{s+2}$，极点为 $-1,-2$，故

$$
f(t)=e^{-t}-e^{-2t},\qquad t\ge0
$$

部分分式的结果与留数计算一致，只是前者查表、后者用复积分。

### 应用：微分方程、电路与稳定性

**解线性常系数微分方程**：对方程两边取拉氏变换，用微分性质把初值代入，得到 $s$ 域代数方程，解出 $Y(s)$ 再反变换。整个过程把"微分方程 + 初值"变成"代数方程 + 部分分式"。

**电路**：电感 $sL$、电容 $1/(sC)$，初始条件化为附加电源，于是 RLC 电路变成 s 域网络，用分压/分流/节点法求解。以串联 RLC 的电容电压对输入电压的传递函数为例：

$$
H(s)=\frac{1}{LCs^{2}+RCs+1}
=\frac{\omega_n^{2}}{s^{2}+2\zeta\omega_ns+\omega_n^{2}},
\qquad
\omega_n=\frac{1}{\sqrt{LC}},\quad \zeta=\frac{R}{2}\sqrt{\frac{C}{L}}
$$

- $\zeta<1$ 欠阻尼：一对共轭复极点，阶跃响应振荡；
- $\zeta=1$ 临界阻尼；$\zeta>1$ 过阻尼：两个实极点。

**稳定性**：因果 LTI 系统稳定 $\iff$ $H(s)$ 的所有极点位于**左半平面**（$\operatorname{Re}s<0$）。虚轴上的极点对应临界稳定（等幅振荡或常数），右半平面极点对应指数增长。$s=j\omega$ 时 $H(j\omega)$ 就是频率响应；离散系统通过 $z=e^{sT}$ 把左半平面映射到单位圆内，稳定条件变成"极点在单位圆内"。

## 场论基础

### 梯度、散度、旋度

**标量场** $\varphi(x,y,z)$ 的**梯度**

$$
\nabla\varphi=\left(\frac{\partial\varphi}{\partial x},\frac{\partial\varphi}{\partial y},\frac{\partial\varphi}{\partial z}\right)
$$

指向函数增长最快的方向，模为最大方向导数；$\nabla\varphi$ 垂直于等值面。

**向量场** $\mathbf{A}$ 的**散度**与**旋度**：

$$
\nabla\cdot\mathbf{A}=\frac{\partial A_x}{\partial x}+\frac{\partial A_y}{\partial y}+\frac{\partial A_z}{\partial z},
$$

$$
\nabla\times\mathbf{A}=
\left(\frac{\partial A_z}{\partial y}-\frac{\partial A_y}{\partial z},\
\frac{\partial A_x}{\partial z}-\frac{\partial A_z}{\partial x},\
\frac{\partial A_y}{\partial x}-\frac{\partial A_x}{\partial y}\right)
$$

散度描述"源/汇"的强度（通量密度），旋度描述"环流"的强度。两个恒等式：

$$
\nabla\times(\nabla\varphi)=\mathbf{0},
\qquad
\nabla\cdot(\nabla\times\mathbf{A})=0
$$

即"梯度场无旋、旋度场无散"。

### 高斯定理与斯托克斯定理

$$
\oiint_S\mathbf{A}\cdot d\mathbf{S}=\iiint_V\nabla\cdot\mathbf{A}\,dV
\quad(\text{高斯/散度定理}),
$$

$$
\oint_C\mathbf{A}\cdot d\mathbf{l}=\iint_S(\nabla\times\mathbf{A})\cdot d\mathbf{S}
\quad(\text{斯托克斯定理}).
$$

两者与牛顿–莱布尼茨公式同属"边界积分 = 内部导数积分"的统一框架。麦克斯韦方程的积分形式正是它们的直接应用：

$$
\oiint_S\mathbf{D}\cdot d\mathbf{S}=Q_{\text{free}},
\qquad
\oiint_S\mathbf{B}\cdot d\mathbf{S}=0,
$$

$$
\oint_C\mathbf{E}\cdot d\mathbf{l}=-\frac{d}{dt}\iint_S\mathbf{B}\cdot d\mathbf{S},
\qquad
\oint_C\mathbf{H}\cdot d\mathbf{l}=I+\frac{d}{dt}\iint_S\mathbf{D}\cdot d\mathbf{S}.
$$

对应的微分形式为 $\nabla\cdot\mathbf{D}=\rho$、$\nabla\cdot\mathbf{B}=0$、$\nabla\times\mathbf{E}=-\partial\mathbf{B}/\partial t$、$\nabla\times\mathbf{H}=\mathbf{J}+\partial\mathbf{D}/\partial t$。

**亥姆霍兹定理**：满足适当光滑性的向量场可唯一分解为无旋部分与无散部分

$$
\mathbf{A}=-\nabla\varphi+\nabla\times\mathbf{B},
$$

给定散度、旋度与边界条件，场就被唯一确定——这正是麦克斯韦方程"场的身份证"的含义。

### 拉普拉斯方程、泊松方程与边值问题

静电场 $V$ 满足泊松方程 $\nabla^{2}V=-\rho/\varepsilon_0$；无电荷区域退化为拉普拉斯方程 $\nabla^{2}V=0$。三维基本解

$$
\nabla^{2}\left(\frac1r\right)=-4\pi\delta(\mathbf{r}),
$$

对应点电荷电位 $V=\frac{1}{4\pi\varepsilon_0}\frac{q}{r}$；二维基本解 $\nabla^{2}(\ln r)=2\pi\delta(\mathbf{r})$。

**边界条件**三类：狄利克雷（给定边界值）、诺伊曼（给定法向导数）、混合。**唯一性定理**：狄利克雷问题的解唯一，诺伊曼问题在相差常数意义下唯一——所以"找到一个满足方程与边界的解"就足够了。

**分离变量法（直角坐标）**：设 $\varphi=X(x)Y(y)Z(z)$，代入 $\nabla^{2}\varphi=0$ 得

$$
\frac{X''}{X}+\frac{Y''}{Y}+\frac{Z''}{Z}=0,
$$

三项分别只依赖一个变量，故各为常数（如 $X''/X=-\lambda^{2}$、$Y''/Y=-\mu^{2}$、$Z''/Z=\lambda^{2}+\mu^{2}$），解是三角函数/双曲函数的组合，常数由边界条件确定。

**一维例子**：$\varphi''=0$、$\varphi(0)=0$、$\varphi(L)=V_0$，解为 $\varphi=V_0x/L$——线性电位分布。

**二维矩形域例子**：边界 $x=0,a$ 与 $y=0$ 接地，$y=b$ 上电位为 $V_0$。解为

$$
\varphi(x,y)=\sum_{n\ \text{odd}}\frac{4V_0}{n\pi}\,
\frac{\sinh(n\pi y/a)}{\sinh(n\pi b/a)}\,
\sin\frac{n\pi x}{a}.
$$

它满足所有边界条件，由唯一性定理即为唯一解。圆柱坐标分离变量得到贝塞尔方程（$J_n$、$Y_n$），球坐标得到勒让德方程（$P_n$、$Q_n$），它们分别对应圆波导与球面场的模式展开。二维问题还可以用**保角映射法**：把区域映成上半平面，在那里解拉普拉斯方程，再映回原区域（见 [[mathematics/complex-analysis|复变函数基础]]）。

## MATLAB 验证

```matlab
syms t w s
% 1) 符号傅里叶变换：单边指数
F = fourier(exp(-t) * heaviside(t), t, w);   % 1/(1 + j*w) 形式
disp(F);

% 2) 拉氏变换与逆变换
F1 = laplace(exp(-2*t) * sin(3*t), t, s);
f1 = ilaplace(1/(s^2 + 2*s + 5), s, t);
disp(F1); disp(f1);

% 3) 部分分式：1/(s^2+3s+2) = 1/(s+1) - 1/(s+2)
[r, p, k] = residue([1], [1 3 2]);
disp(r); disp(p);

% 4) 数值 FFT（离散信号频谱）
fs = 1000; N = 1024; tt = (0:N-1)/fs;
x = cos(2*pi*100*tt) + 0.5*cos(2*pi*200*tt);
X = fft(x)/N; f = (0:N-1)*fs/N;
plot(f(1:N/2), 2*abs(X(1:N/2)));
xlabel('频率 / Hz'); ylabel('幅度'); grid on;
```

> [!note] 符号与数值的分工
> 符号计算（fourier/laplace/residue）用来核对公式与推导；数值 FFT 用来处理实测或仿真数据。两者的频率轴、归一化与单双边谱约定不同，对比前先统一：MATLAB 的 fft 是双边谱，正频率幅度要乘 2（直流与奈奎斯特点除外），除以 N 才得到物理幅度。

## 易错点

> [!warning] 变换与场论的常见错误
> 1. **忽略傅里叶变换的存在条件**：绝对可积只是充分条件；δ 函数、常数、周期信号要用广义函数处理，不能直接套积分。
> 2. **拉氏变换不写 ROC**：同一个 $F(s)$ 对应不同时间信号，ROC 是定义的一部分。
> 3. **终值定理乱用**：要求 $sF(s)$ 极点全在左半平面；虚轴极点（如 $\sin t$）时终值不存在。
> 4. **把 $s=j\omega$ 当恒等式**：$H(j\omega)$ 是频率响应，只在 ROC 包含虚轴（稳定系统）时有意义；不稳定系统的"频响"不能直接测量。
> 5. **分离变量常数符号搞错**：边界条件决定该方向是三角函数还是双曲函数；写错会导致解在边界上不收敛。
> 6. **忘记唯一性定理**：只要解满足方程与全部边界条件，它就是唯一解；反复凑解没有必要。
> 7. **抽样定理条件**：$f_s>2f_H$ 要求信号严格带限；实际信号总有带外能量，需要抗混叠滤波器。

## 前置与相关

前置：[[mathematics/complex-analysis|复变函数基础]]（解析函数、留数、保角映射）、微积分（多元微积分、级数）。相关：[[signal-processing/signals-and-systems-intro|信号与系统导论]]（LTI、卷积、系统函数）、[[signal-processing/dft-and-fft|DFT 与 FFT]]（离散频域与采样）、[[signal-processing/random-processes|随机信号、估计与检测]]（功率谱、随机信号通过 LTI 系统）、[[communication/analog-modulation-am|模拟调制 AM]]（复包络与频谱搬移）、[[signal-processing/z-transform-and-dtft|z 变换与 DTFT]]（离散域对应）、[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]（随机信号的频域分析）。

## 来源与延伸阅读

- [[vault-notes/math/complex-analysis/07-fourier-transform|傅里叶变换（详细笔记）]]：傅里叶级数（三角/复指数）、傅里叶变换与逆变换、δ 函数、性质表、常用变换对、卷积定理、抽样定理、Parseval、MATLAB 示例。
- [[vault-notes/math/complex-analysis/08-laplace-transform|拉普拉斯变换（详细笔记）]]：从傅里叶到拉普拉斯、ROC、常用变换对、性质、部分分式与留数反变换、微分方程/电路/稳定性应用、初值与终值定理。
- [[vault-notes/math/complex-analysis/09-field-theory-basics|场论基础（详细笔记）]]：标量场/向量场、方向导数与梯度、通量与散度、环量与旋度、三个恒等式、例题。
- [[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value|场论的积分定理与边值问题（详细笔记）]]：高斯/斯托克斯定理、麦克斯韦方程、亥姆霍兹定理、拉普拉斯/泊松方程、边界条件、分离变量法（直角/圆柱/球坐标）、保角映射法、例题。
