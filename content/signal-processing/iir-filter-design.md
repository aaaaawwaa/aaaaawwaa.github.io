---
title: IIR 数字滤波器设计
description: 从模拟原型到数字映射：巴特沃斯、切比雪夫、椭圆原型，脉冲响应不变法与双线性变换，频率预畸变、数字高通/带通/带阻的设计路线与 MATLAB 完整流程。
tags:
  - signal-processing
  - digital-filter
  - iir
---

## 为什么 IIR 设计要"绕道"模拟域

IIR 滤波器的最大优势是**用较低的阶数获得较陡的幅频选择性**：反馈让一个极点能顶 FIR 的一长串抽头。代价是设计变难——直接对数字域的系数提指标、解方程，会碰到稳定性约束（极点必须落在单位圆内）和相位非线性的双重麻烦。

模拟滤波器则积累了一整套闭式公式：巴特沃斯、切比雪夫、椭圆的幅频特性有明确表达式，给定通带、阻带指标能直接算出阶数和截止频率。于是 IIR 设计的标准路线是：**先把数字指标换算成模拟指标，设计模拟滤波器 $H_a(s)$，再用一个 $s\to z$ 的映射把它搬到数字域**。

这条路线是否成立，取决于映射 $s\to z$ 是否"讲道理"。下面先定义指标，再讨论两种经典映射与模拟原型，最后给出频率变换与 MATLAB 流程。

## 设计指标：把要求写成公式

一个低通滤波器的典型指标如表所示。数字频率 $\omega$ 以采样率归一化，$\omega=2\pi f/f_s$，有效范围是 $0\le\omega\le\pi$。

| 指标 | 含义 | 典型值 |
| --- | --- | --- |
| 通带边沿 $\omega_p$ | 通带右边缘，衰减不超过 $\alpha_p$ | $0.2\pi$ |
| 阻带边沿 $\omega_s$ | 阻带左边缘，衰减至少 $\alpha_s$ | $0.4\pi$ |
| 通带最大衰减 $\alpha_p$ | 通带内允许的最大衰减（dB） | 1 dB |
| 阻带最小衰减 $\alpha_s$ | 阻带内要求的最小衰减（dB） | 40 dB |
| 过渡带宽度 | $\Delta\omega=\omega_s-\omega_p$ | 越窄，阶数越高 |

衰减用幅频特性定义：

$$
\alpha_p=-20\log_{10}\left|H(e^{j\omega_p})\right|,\qquad
\alpha_s=-20\log_{10}\left|H(e^{j\omega_s})\right|
$$

注意 $\alpha$ 是正值，$\lvert H\rvert$ 越小衰减越大。工程上说"阻带 40 dB"指的是阻带内 $\lvert H\rvert\le 10^{-2}$。

过渡带越窄、阻带要求越高，所需阶数越大。巴特沃斯的幅频渐近线是每十倍频程 $20N$ dB（每倍频程约 $6N$ dB），斜率直接决定"多陡的过渡带需要多少阶"。

> [!warning] 数字指标的频率归一化
> 数字滤波器只关心 $0\le\omega\le\pi$（对应 $0\le f\le f_s/2$）。给出 Hz 指标时必须先除以 $f_s$ 再换算，否则设计出的滤波器截止频率会整体偏掉。MATLAB 的 `buttord`/`butter` 默认按 Nyquist 频率归一化，这是最常见的错误来源。

## 映射必须满足的条件

从 $H_a(s)$ 到 $H(z)$，代换 $s\to z$ 不能随便选，至少要满足四条：

1. **虚轴映射到单位圆**：$s=j\Omega$ 对应 $z=e^{j\omega}$，频率轴对频率轴，滤波器的频率选择特性才有意义；
2. **左半平面映射到单位圆内**：稳定的模拟滤波器映射后仍然稳定；
3. **因果性保持**：$H_a(s)$ 因果，则 $H(z)$ 也因果；
4. **频率响应形状尽量保持**：通带、阻带的相对关系（哪种频率通过、哪种频率被抑制）不变。

两条经典映射都满足前三条，区别在第四条与混叠：

| 方法 | 映射 | 频率关系 | 混叠 | 适用滤波器 |
| --- | --- | --- | --- | --- |
| 脉冲响应不变法 | $z=e^{sT}$ | $\omega=\Omega T$（线性） | 有 | 低通、带通 |
| 双线性变换法 | $s=\dfrac{2}{T}\dfrac{1-z^{-1}}{1+z^{-1}}$ | $\Omega=\dfrac{2}{T}\tan\dfrac{\omega}{2}$（非线性） | 无 | 低通、高通、带通、带阻 |

这里的 $T$ 是采样周期。下面分别讨论两种映射，先看它们都要用到的模拟原型。

## 模拟滤波器原型

### 巴特沃斯滤波器

**巴特沃斯滤波器**（Butterworth filter）的幅平方特性为

$$
\left|H_a(j\Omega)\right|^2=\frac{1}{1+\left(\dfrac{\Omega}{\Omega_c}\right)^{2N}}
$$

它在 $\Omega=0$ 处**最平坦**：前 $2N-1$ 阶导数都为零；在 $\Omega=\Omega_c$ 处衰减 3 dB，所以 $\Omega_c$ 也称 **3 dB 截止频率**。极点均匀分布在 $s$ 平面半径为 $\Omega_c$ 的圆上，取左半平面的 $N$ 个。

- $N$ 越大，过渡带越陡，但相位非线性越严重；
- 通带无波纹，阻带单调下降，幅频曲线"最圆滑"。

**阶数估计**：给定 $\alpha_p,\alpha_s$ 与 $\Omega_p,\Omega_s$，所需最小阶数为

$$
N\ge\frac{\log_{10}\left[\dfrac{10^{\alpha_s/10}-1}{10^{\alpha_p/10}-1}\right]}{2\log_{10}\left(\dfrac{\Omega_s}{\Omega_p}\right)}
$$

取满足条件的最小整数。

> [!example] 巴特沃斯阶数估算
> 设 $f_s=10$ kHz，通带 $f_p=1$ kHz、阻带 $f_{st}=2$ kHz，$\alpha_p=1$ dB、$\alpha_s=40$ dB。先用双线性变换的预畸变把数字边沿换成模拟边沿（取 $T=2$，使 $2/T=1$）：
> $$
> \Omega_p=\tan\frac{0.2\pi}{2}=\tan(0.1\pi)\approx0.3249,\qquad
> \Omega_s=\tan\frac{0.4\pi}{2}=\tan(0.2\pi)\approx0.7265
> $$
> 代入阶数公式：
> $$
> N\ge\frac{\log_{10}\left[\dfrac{10^{4}-1}{10^{0.1}-1}\right]}{2\log_{10}\left(\dfrac{0.7265}{0.3249}\right)}
> \approx\frac{4.587}{2\times0.3495}\approx6.56
> $$
> 取 $N=7$，$\Omega_c$ 取 $0.358\sim0.376$ 之间即可同时满足两侧指标。MATLAB 的 `buttord` 会直接给出阶数与截止频率，不必手算。

### 切比雪夫滤波器

**切比雪夫 I 型滤波器**（Chebyshev type I filter）的幅平方特性为

$$
\left|H_a(j\Omega)\right|^2=\frac{1}{1+\varepsilon^2T_N^2\left(\dfrac{\Omega}{\Omega_p}\right)}
$$

其中 $T_N(x)$ 是 $N$ 阶切比雪夫多项式，$\varepsilon$ 由通带波纹决定：

$$
\varepsilon=\sqrt{10^{\alpha_p/10}-1}
$$

它在通带内**等波纹**、阻带单调下降，相同阶数下过渡带比巴特沃斯更陡，代价是通带内起伏。

**切比雪夫 II 型**（inverse Chebyshev）则相反：通带单调、阻带等波纹，阶数估计与 I 型使用同一公式（只是波纹位置不同）。

### 椭圆滤波器

**椭圆滤波器**（elliptic filter，也称 Cauer filter）在通带和阻带都呈**等波纹**，相同阶数下过渡带最陡。代价是相位非线性最严重，且阻带衰减由传输零点控制，零极点的分布比前几种都复杂。

### 原型对比与选型

| 类型 | 通带 | 阻带 | 过渡带陡度 | 相位线性 | 典型用途 |
| --- | --- | --- | --- | --- | --- |
| 巴特沃斯 | 平坦 | 单调 | 最缓 | 最好 | 通用、指标不苛刻 |
| 切比雪夫 I | 等波纹 | 单调 | 较陡 | 较差 | 常用折中 |
| 切比雪夫 II | 单调 | 等波纹 | 较陡 | 较差 | 阻带要求严格 |
| 椭圆 | 等波纹 | 等波纹 | **最陡** | 最差 | 窄过渡带、低阶优先 |
| 贝塞尔 | 平坦 | 单调 | 最缓 | **最好**（近似线性相位） | 脉冲波形保真 |

> [!tip] 选型口诀
> 要平坦选巴特沃斯，要陡选椭圆，要相位选贝塞尔，折中选切比雪夫。所有 IIR 原型的相位都非线性，如果系统对波形失真敏感，最终应改用线性相位 FIR（见 [[signal-processing/fir-filter-design|FIR 数字滤波器设计]]）。

## 脉冲响应不变法

**脉冲响应不变法**（impulse invariance method）让数字滤波器的单位冲激响应等于模拟冲激响应的等间隔采样：

$$
h(n)=T\,h_a(nT)
$$

对应的映射为

$$
z=e^{sT}
$$

若 $H_a(s)$ 有极点 $s_k$，则 $H(z)$ 的极点为 $z_k=e^{s_kT}$。左半平面的极点映射到单位圆内，虚轴映射到单位圆，频率关系是**线性**的：$\omega=\Omega T$，频率刻度保持不变。

把 $H_a(s)$ 展开成部分分式，映射可以直接逐项写出：

$$
H_a(s)=\sum_{k}\frac{A_k}{s-s_k}
\quad\Longrightarrow\quad
H(z)=\sum_{k}\frac{T A_k}{1-e^{s_kT}z^{-1}}
$$

### 混叠是绕不过去的代价

对 $h_a(t)$ 等间隔采样，数字频谱是模拟频谱的周期延拓：

$$
H(e^{j\omega})=\sum_{k=-\infty}^{\infty}H_a\left(j\frac{\omega-2\pi k}{T}\right)
$$

（若采用 $h(n)=h_a(nT)$ 的约定，右边还要多乘 $1/T$；两种写法只差增益常数，不影响混叠结论。）只要 $H_a(j\Omega)$ 在 $\lvert\Omega\rvert>\pi/T$ 处不为零，高频分量就会折回低频，形成**频谱混叠**。

| 滤波器类型 | 混叠影响 | 是否适用 |
| --- | --- | --- |
| 低通 | 阻带衰减大，混叠小 | 适用 |
| 带通 | 高频段衰减足够时混叠小 | 可用 |
| 高通 | 高频增益大，严重混叠 | 不适用 |
| 带阻 | 高、低频都可能混叠 | 慎用 |

> [!example] 一阶低通的脉冲响应不变法
> 模拟滤波器 $H_a(s)=\dfrac{a}{s+a}$，冲激响应 $h_a(t)=ae^{-at}u(t)$。采样后
> $$
> h(n)=Tae^{-anT}u(n)
> $$
> 取 z 变换得
> $$
> H(z)=\frac{Ta}{1-e^{-aT}z^{-1}}
> $$
> 极点从 $s=-a$ 映射到 $z=e^{-aT}$，确实在单位圆内。若 $aT\ll1$，$H(z)\approx\dfrac{aT}{1-(1-aT)z^{-1}}$，低频段与模拟滤波器一致。

> [!warning] 脉冲响应不变法的两个坑
> 1. **混叠不可避免**：低通也要保证阻带衰减足够大或提高采样率，否则高频仍会折回；高通、带阻根本不能用。
> 2. **$T$ 与增益**：$h(n)=Th_a(nT)$ 中的 $T$ 不能省，否则直流增益会差 $1/T$。MATLAB 的 `impinvar` 有自己固定的频率与增益约定，换教材/换版本后要用 `freqz` 核对直流增益（两者的具体换算关系待核验）。

实际设计时，把 $H_a(s)$ 展开成部分分式、逐项映射极点，再用 `freqz` 检查指标与混叠即可。

## 双线性变换法

**双线性变换法**（bilinear transform）用代换

$$
s=\frac{2}{T}\frac{1-z^{-1}}{1+z^{-1}}
\qquad\Longleftrightarrow\qquad
z=\frac{1+(T/2)s}{1-(T/2)s}
$$

把模拟 $H_a(s)$ 映射为数字 $H(z)$。这是一个一一映射：整个左半平面映射到单位圆内，整个虚轴映射到单位圆上，而且只映射一次。

- **没有混叠**：$j\Omega$ 轴被压缩到单位圆上，不会像 $z=e^{sT}$ 那样周期重复；
- **频率刻度被压弯**：这是它的代价，需要预畸变。

### 频率关系与预畸变

把 $s=j\Omega$、$z=e^{j\omega}$ 代入映射式：

$$
j\Omega=\frac{2}{T}\frac{1-e^{-j\omega}}{1+e^{-j\omega}}
=j\frac{2}{T}\tan\frac{\omega}{2}
$$

得到

$$
\Omega=\frac{2}{T}\tan\frac{\omega}{2}
$$

当 $\omega$ 从 $0$ 变到 $\pi$ 时，$\Omega$ 从 $0$ 变到 $\infty$：低频段近似线性，接近 Nyquist 时被强烈压缩。若直接把数字边沿当作模拟边沿去设计，得到的数字截止频率会偏低。解决办法是**预畸变**（prewarping）：先把数字边沿按同一公式换成模拟边沿，设计完再变换回来：

$$
\Omega_p=\frac{2}{T}\tan\frac{\omega_p}{2},\qquad
\Omega_s=\frac{2}{T}\tan\frac{\omega_s}{2}
$$

这样数字滤波器的通带、阻带边沿才正好落在 $\omega_p,\omega_s$ 上。

### 设计步骤

1. 预畸变，得到 $\Omega_p,\Omega_s$；
2. 选模拟原型，求阶数 $N$ 与截止频率 $\Omega_c$；
3. 写出 $H_a(s)$；
4. 代入 $s=\dfrac{2}{T}\dfrac{1-z^{-1}}{1+z^{-1}}$，整理成 $H(z)$；
5. 用 `freqz` 检查数字频响，必要时调整阶数或指标。

> [!example] 双线性变换的一阶低通
> $H_a(s)=\dfrac{\Omega_c}{s+\Omega_c}$，代入映射式并整理：
> $$
> H(z)=\frac{\Omega_c(1+z^{-1})}{\frac{2}{T}(1-z^{-1})+\Omega_c(1+z^{-1})}
> =\frac{\Omega_cT(1+z^{-1})}{(2+\Omega_cT)+(\Omega_cT-2)z^{-1}}
> $$
> 若取 $\Omega_c=\dfrac{2}{T}\tan\dfrac{\omega_c}{2}$，数字截止频率正好是 $\omega_c$；且 $\left.H(z)\right|_{z=1}=1$，直流增益为 1。

> [!tip] $T$ 怎么取
> 理论上 $T$ 只是频率坐标的缩放，预畸变一致时最终 $H(z)$ 与 $T$ 无关。常取 $T=2$ 使 $2/T=1$；MATLAB 的归一化数字设计等价于这种取法（具体内部实现待核验）。

## 数字高通、带通和带阻

低通原型设计好之后，高通、带通、带阻有两条路线：

| 路线 | 步骤 | 特点 |
| --- | --- | --- |
| 模拟域频率变换 | 低通原型 → 模拟高通/带通/带阻 → 双线性 → 数字 $H(z)$ | 公式成熟，MATLAB 工具链完整 |
| 数字域频率变换 | 数字低通 → 用全通代换得到数字高通/带通/带阻 | 不必重新设计模拟原型，适合已有数字低通 |

模拟频率变换以截止 $\Omega_c=1$ 的归一化低通 $H_{LP}(s)$ 为基准：

| 目标 | 代换 |
| --- | --- |
| 低通（截止 $\Omega_p$） | $s\to\dfrac{s}{\Omega_p}$ |
| 高通（截止 $\Omega_p$） | $s\to\dfrac{\Omega_p}{s}$ |
| 带通（$\Omega_{p1},\Omega_{p2}$） | $s\to\dfrac{s^2+\Omega_0^2}{Bs}$，$\Omega_0=\sqrt{\Omega_{p1}\Omega_{p2}}$，$B=\Omega_{p2}-\Omega_{p1}$ |
| 带阻 | $s\to\dfrac{Bs}{s^2+\Omega_0^2}$ |

以数字高通为例，完整步骤是：数字指标（注意高通 $\omega_p>\omega_s$）→ 预畸变 → 模拟高通指标 → 取倒数转成低通原型指标 → 设计低通原型 → $s\to\Omega_p/s$ 得到模拟高通 → 双线性变换得到数字高通。MATLAB 里 `buttord(wp/pi, ws/pi, ap, as)` 会自动识别高通（因为 $w_p>w_s$），再用 `butter(N, Wn, 'high')` 一步得到。

> [!warning] 高通、带阻不能用脉冲响应不变法
> 高通在 $\Omega\to\infty$ 处增益不为零，采样后整个高频段都会折回低频，混叠严重到无法用。**高通、带阻一律用双线性变换法**；带通虽然理论上可用脉冲响应不变法，但也要确认阻带衰减足够。

## MATLAB 完整示例

下面用同一组指标（$f_s=10$ kHz，通带 1 kHz，阻带 2 kHz，$\alpha_p=1$ dB，$\alpha_s=40$ dB）走一遍最常用的设计路径：

```matlab
fs = 10000; fp = 1000; fst = 2000;   % Hz
Ap = 1; Ast = 40;                     % dB
wp = 2*pi*fp/fs; ws = 2*pi*fst/fs;    % 数字角频率 (rad)

% 路线一：buttord + butter（内部完成预畸变与双线性变换）
[N, Wn] = buttord(wp/pi, ws/pi, Ap, Ast);   % 频率归一化到 Nyquist
[b, a] = butter(N, Wn);                     % 数字低通
[H, w] = freqz(b, a, 2048);   % 画图检查：20*log10(abs(H))

% 路线二：显式模拟原型 + 双线性变换，便于看清每一步
T = 1/fs;
Omegap = (2/T)*tan(wp/2);
Omegas = (2/T)*tan(ws/2);
N2 = ceil(log10((10^(Ast/10)-1)/(10^(Ap/10)-1)) / (2*log10(Omegas/Omegap)));
[z, p, k] = buttap(N2);                 % 归一化模拟低通原型
[bap, aap] = zp2tf(z, p, k);
Omegac = Omegap / (10^(Ap/10)-1)^(1/(2*N2));   % 让通带边沿恰好满足指标
[bs, as] = lp2lp(bap, aap, Omegac);     % 截止频率搬到 Omegac
[b2, a2] = bilinear(bs, as, fs);        % 双线性变换到数字域

% 检查与实现
max(abs(roots(a2)))                     % 极点半径，必须 < 1
[sos, g] = tf2sos(b2, a2);              % 级联型二阶节
```

> [!warning] MATLAB 频率单位
> `buttord`/`butter`/`fir1` 默认把频率归一化到 Nyquist 频率（$\omega/\pi$，范围 0–1）；`bilinear`/`impinvar` 用 `fs` 把模拟频率换算到数字域。若给的是 Hz，先除以 $f_s/2$ 再传给 `buttord`；若给的是 rad，先除以 $\pi$。这两套单位混用，是 IIR 设计最常见的错误。

## 设计检查清单

1. **指标**：用 `freqz` 画 dB 曲线，核对 $\alpha_p,\alpha_s$ 与边沿频率是否真的满足；
2. **稳定性**：`abs(roots(a)) < 1`，数字极点必须全部在单位圆内；
3. **阶数**：阶数过高会带来相位失真与数值问题，可放宽过渡带或换椭圆原型；
4. **结构**：高阶用 `tf2sos` 转级联型，并检查各节缩放；
5. **定点**：量化系数后重新检查极点半径与中间变量范围，必要时提高位宽；
6. **相位**：对波形保真要求高的场合，确认 IIR 的群延迟变化可接受，否则改用 FIR。

## 易错点

- **忘了预畸变**：直接拿数字边沿当模拟边沿，设计出的截止频率偏低。
- **用脉冲响应不变法做高通/带阻**：混叠无法消除，结果不能用。
- **频率单位混用**：把 Hz 直接传给按 Nyquist 归一化的函数，滤波器整体偏频。
- **把衰减写成负 dB**：$\alpha_p,\alpha_s$ 是正值，$\lvert H\rvert$ 的 dB 值才是负的。

## 前置与相关阅读

- [[signal-processing/signals-and-systems-intro|信号与系统导论]]：连续系统、拉普拉斯变换与频率响应的基础。
- [[signal-processing/digital-filter-structures|数字滤波器结构]]：设计出 $H(z)$ 之后，用直接型、级联型或并联型实现。
- [[signal-processing/fir-filter-design|FIR 数字滤波器设计]]：另一条设计路线，可做到严格线性相位。

## 来源与延伸阅读

- [[vault-notes/dsp/06-iir-filter-design|IIR 数字滤波器设计方法（详细笔记）]]：设计流程、指标定义、巴特沃斯/切比雪夫/椭圆原型、两种映射、频率变换与 MATLAB 函数的完整原文。
- [[vault-notes/dsp/05-filter-structures|数字滤波器的基本结构（详细笔记）]]：本篇得到的 $H(z)$ 用该章的结构实现。
- [[vault-notes/dsp/07-fir-filter-design|FIR 数字滤波器设计（详细笔记）]]：IIR 与 FIR 的对比与选型依据。
- 前置知识：[[vault-notes/dsp/02-z-transform-and-dtft|Z 变换与 DTFT]]；工具参考：[[vault-notes/matlab/matlab-notes|MATLAB 学习笔记]]。
