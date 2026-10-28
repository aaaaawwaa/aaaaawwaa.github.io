---
title: "傅里叶变换"
tags:
- 数学
- 积分变换
- 傅里叶变换
type: course
subjects:
- 复变函数与场论
domains:
- 数学基础
status: learning
aliases: []
prerequisites: []
related: []
---

> [!abstract] 本章在讲什么
> 本章把信号从时域搬到频域，是通信、信号处理、场论的共同语言：
> - **1. 傅里叶级数**：周期信号分解为复指数（或正弦/余弦）的叠加；狄利克雷条件。
> - **2. 傅里叶变换**：非周期信号的频谱；定义、存在条件、基本性质。
> - **3. δ 函数**：冲激函数及其傅里叶变换；把周期/非周期统一起来。
> - **4. 傅里叶变换的应用**：频谱分析、卷积定理、帕塞瓦尔定理、抽样定理。
> - **5. 例题**：矩形脉冲、指数信号、高斯信号、卷积。
>
> 一句话主线：**傅里叶级数把周期信号拆成离散频率的复指数；傅里叶变换把非周期信号拆成连续频率的复指数；δ 函数是两者的桥梁——它让"周期"与"非周期"在同一套公式里统一。**

> [!note] 记号约定
> - $T$：周期；$\omega_0=2\pi/T$：基频；$f_0=1/T$
> - 复傅里叶级数：$f(t)=\sum_{n=-\infty}^{\infty}c_ne^{in\omega_0t}$
> - 傅里叶变换：$F(\omega)=\mathcal{F}[f(t)]=\int_{-\infty}^{\infty}f(t)e^{-i\omega t}dt$
> - 逆变换：$f(t)=\mathcal{F}^{-1}[F(\omega)]=\frac{1}{2\pi}\int_{-\infty}^{\infty}F(\omega)e^{i\omega t}d\omega$
> - $\delta(t)$：狄拉克 δ 函数；$\operatorname{sinc}(x)=\sin x/x$
> - 卷积：$(f*g)(t)=\int_{-\infty}^{\infty}f(\tau)g(t-\tau)d\tau$

# 1. 傅里叶级数

## 三角形式

设 $f(t)$ 以 $T$ 为周期，在 $[-T/2,T/2]$ 上满足狄利克雷条件（连续或只有有限个第一类间断点、只有有限个极值点），则

$$
f(t)=\frac{a_0}{2}+\sum_{n=1}^{\infty}\left(a_n\cos n\omega_0t+b_n\sin n\omega_0t\right)
$$

$$
a_n=\frac{2}{T}\int_{-T/2}^{T/2}f(t)\cos n\omega_0t\,dt,\qquad b_n=\frac{2}{T}\int_{-T/2}^{T/2}f(t)\sin n\omega_0t\,dt
$$

在间断点处，级数收敛到左右极限的平均值。

## 复指数形式

> [!info] Def 1 复傅里叶级数
> $$
> f(t)=\sum_{n=-\infty}^{\infty}c_ne^{in\omega_0t},\qquad c_n=\frac{1}{T}\int_{-T/2}^{T/2}f(t)e^{-in\omega_0t}\,\mathrm{d}t
> $$
> 称为 $f$ 的**复傅里叶级数**（complex Fourier series）。

**两种形式的关系**：

$$
c_0=\frac{a_0}{2},\qquad c_n=\frac{a_n-ib_n}{2}\ (n>0),\qquad c_{-n}=\frac{a_n+ib_n}{2}
$$

> [!tip] 复指数形式的优点
> 1. 公式统一：正负频率一起处理，不用分 sin/cos。
> 2. 微分/积分性质简单：$e^{in\omega_0t}$ 求导只乘 $in\omega_0$。
> 3. 与傅里叶变换、拉普拉斯变换、z 变换的公式形式一致。
> 4. 负频率不是"物理上负"，而是复指数共轭配对的结果：$c_{-n}e^{-in\omega_0t}$ 与 $c_ne^{in\omega_0t}$ 合成实正弦。

> [!example] 方波的傅里叶级数
> 周期 $T=2\pi$、幅值 $\pm1$ 的方波：
> $$
> f(t)=\frac{4}{\pi}\left(\sin t+\frac{\sin3t}{3}+\frac{\sin5t}{5}+\cdots\right)
> $$
> 只含奇次谐波，幅度按 $1/n$ 衰减。这是"吉布斯现象"的经典例子。

# 2. 傅里叶变换

## 定义

> [!info] Def 2 傅里叶变换
> 设 $f(t)$ 在 $(-\infty,\infty)$ 上绝对可积，则
> $$
> F(\omega)=\int_{-\infty}^{\infty}f(t)e^{-i\omega t}\,\mathrm{d}t
> $$
> 称为 $f$ 的**傅里叶变换**（Fourier transform）。

> [!info] Def 3 傅里叶逆变换
> $$
> f(t)=\frac{1}{2\pi}\int_{-\infty}^{\infty}F(\omega)e^{i\omega t}\,\mathrm{d}\omega
> $$
> 称为**傅里叶逆变换**（inverse Fourier transform）。

**存在条件**：$\int_{-\infty}^{\infty}|f(t)|\mathrm{d}t<\infty$（绝对可积）是充分条件，不是必要条件。δ 函数、常数、正弦等通过广义函数意义下的傅里叶变换处理。

**频谱**：$F(\omega)$ 是复函数，$|F(\omega)|$ 为幅度谱，$\arg F(\omega)$ 为相位谱。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 330" width="100%" style="max-width:720px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <line x1="60.0" y1="50.0" x2="330.0" y2="50.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="60.0" y1="50.0" x2="60.0" y2="250.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <text x="334.0" y="54.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">t</text>
  <text x="54.0" y="244.0" text-anchor="end" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">f(t)</text>
  <rect x="150.0" y="110.0" width="90.0" height="140.0" rx="0" fill="#2563eb33" stroke="#2563eb" stroke-width="1.6"/>
  <text x="195.0" y="100.0" text-anchor="middle" font-size="11" fill="#2563eb" font-weight="normal">1</text>
  <text x="60.0" y="40.0" text-anchor="start" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">(a) 时域：矩形脉冲</text>
  <line x1="420.0" y1="50.0" x2="690.0" y2="50.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="420.0" y1="50.0" x2="420.0" y2="250.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <text x="694.0" y="54.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">ω</text>
  <text x="414.0" y="244.0" text-anchor="end" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">|F(ω)|</text>
  <polyline points="420.0,198.1 420.9,197.2 421.8,196.2 422.7,195.2 423.6,194.2 424.5,193.3 425.4,192.4 426.3,191.5 427.2,190.7 428.1,190.0 429.0,189.4 429.9,188.9 430.8,188.4 431.7,188.0 432.6,187.8 433.5,187.7 434.4,187.6 435.3,187.7 436.2,188.0 437.1,188.3 438.0,188.7 438.9,189.3 439.8,189.9 440.7,190.7 441.6,191.5 442.5,192.5 443.4,193.5 444.3,194.6 445.2,195.7 446.1,196.9 447.0,198.1 447.9,199.4 448.8,200.6 449.7,201.9 450.6,203.1 451.5,204.3 452.4,205.4 453.3,206.5 454.2,207.5 455.1,208.5 456.0,209.3 456.9,210.0 457.8,210.6 458.7,211.1 459.6,211.4 460.5,211.6 461.4,211.7 462.3,211.6 463.2,211.3 464.1,210.9 465.0,210.4 465.9,209.7 466.8,208.9 467.7,207.9 468.6,206.8 469.5,205.6 470.4,204.3 471.3,202.8 472.2,201.3 473.1,199.8 474.0,198.1 474.9,196.5 475.8,194.8 476.7,193.1 477.6,191.5 478.5,189.8 479.4,188.2 480.3,186.7 481.2,185.3 482.1,184.0 483.0,182.8 483.9,181.8 484.8,180.9 485.7,180.2 486.6,179.6 487.5,179.3 488.4,179.1 489.3,179.2 490.2,179.5 491.1,179.9 492.0,180.6 492.9,181.6 493.8,182.7 494.7,184.0 495.6,185.5 496.5,187.3 497.4,189.2 498.3,191.2 499.2,193.4 500.1,195.7 501.0,198.1 501.9,200.7 502.8,203.2 503.7,205.8 504.6,208.4 505.5,211.0 506.4,213.5 507.3,216.0 508.2,218.4 509.1,220.6 510.0,222.7 510.9,224.5 511.8,226.2 512.7,227.6 513.6,228.7 514.5,229.6 515.4,230.1 516.3,230.3 517.2,230.2 518.1,229.7 519.0,228.8 519.9,227.5 520.8,225.8 521.7,223.7 522.6,221.2 523.5,218.4 524.4,215.1 525.3,211.4 526.2,207.3 527.1,202.9 528.0,198.1 528.9,193.0 529.8,187.6 530.7,182.0 531.6,176.0 532.5,169.9 533.4,163.5 534.3,157.0 535.2,150.4 536.1,143.6 537.0,136.9 537.9,130.1 538.8,123.4 539.7,116.7 540.6,110.2 541.5,103.8 542.4,97.7 543.3,91.7 544.2,86.0 545.1,80.7 546.0,75.6 546.9,71.0 547.8,66.7 548.7,62.9 549.6,59.6 550.5,56.7 551.4,54.3 552.3,52.4 553.2,51.1 554.1,50.3 555.0,50.0 555.9,50.3 556.8,51.1 557.7,52.4 558.6,54.3 559.5,56.7 560.4,59.6 561.3,62.9 562.2,66.7 563.1,71.0 564.0,75.6 564.9,80.7 565.8,86.0 566.7,91.7 567.6,97.7 568.5,103.8 569.4,110.2 570.3,116.7 571.2,123.4 572.1,130.1 573.0,136.9 573.9,143.6 574.8,150.4 575.7,157.0 576.6,163.5 577.5,169.9 578.4,176.0 579.3,182.0 580.2,187.6 581.1,193.0 582.0,198.1 582.9,202.9 583.8,207.3 584.7,211.4 585.6,215.1 586.5,218.4 587.4,221.2 588.3,223.7 589.2,225.8 590.1,227.5 591.0,228.8 591.9,229.7 592.8,230.2 593.7,230.3 594.6,230.1 595.5,229.6 596.4,228.7 597.3,227.6 598.2,226.2 599.1,224.5 600.0,222.7 600.9,220.6 601.8,218.4 602.7,216.0 603.6,213.5 604.5,211.0 605.4,208.4 606.3,205.8 607.2,203.2 608.1,200.7 609.0,198.1 609.9,195.7 610.8,193.4 611.7,191.2 612.6,189.2 613.5,187.3 614.4,185.5 615.3,184.0 616.2,182.7 617.1,181.6 618.0,180.6 618.9,179.9 619.8,179.5 620.7,179.2 621.6,179.1 622.5,179.3 623.4,179.6 624.3,180.2 625.2,180.9 626.1,181.8 627.0,182.8 627.9,184.0 628.8,185.3 629.7,186.7 630.6,188.2 631.5,189.8 632.4,191.5 633.3,193.1 634.2,194.8 635.1,196.5 636.0,198.1 636.9,199.8 637.8,201.3 638.7,202.8 639.6,204.3 640.5,205.6 641.4,206.8 642.3,207.9 643.2,208.9 644.1,209.7 645.0,210.4 645.9,210.9 646.8,211.3 647.7,211.6 648.6,211.7 649.5,211.6 650.4,211.4 651.3,211.1 652.2,210.6 653.1,210.0 654.0,209.3 654.9,208.5 655.8,207.5 656.7,206.5 657.6,205.4 658.5,204.3 659.4,203.1 660.3,201.9 661.2,200.6 662.1,199.4 663.0,198.1 663.9,196.9 664.8,195.7 665.7,194.6 666.6,193.5 667.5,192.5 668.4,191.5 669.3,190.7 670.2,189.9 671.1,189.3 672.0,188.7 672.9,188.3 673.8,188.0 674.7,187.7 675.6,187.6 676.5,187.7 677.4,187.8 678.3,188.0 679.2,188.4 680.1,188.9 681.0,189.4 681.9,190.0 682.8,190.7 683.7,191.5 684.6,192.4 685.5,193.3 686.4,194.2 687.3,195.2 688.2,196.2 689.1,197.2 690.0,198.1" fill="none" stroke="var(--text-accent,#705dcf)" stroke-width="2.0"/>
  <text x="555.0" y="40.0" text-anchor="start" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">(b) 频域：sinc 包络</text>
  <text x="360.0" y="315.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">时域越窄，频域主瓣越宽；时宽 × 带宽 ≈ 常数</text>
</svg>

## 基本性质

| 性质 | 时域 | 频域 |
| --- | --- | --- |
| 线性 | $af+bg$ | $aF+bG$ |
| 时移 | $f(t-t_0)$ | $e^{-i\omega t_0}F(\omega)$ |
| 频移 | $e^{i\omega_0t}f(t)$ | $F(\omega-\omega_0)$ |
| 尺度 | $f(at)$ | $\frac{1}{\lvert a\rvert}F(\omega/a)$ |
| 微分 | $f'(t)$ | $i\omega F(\omega)$ |
| 积分 | $\int_{-\infty}^{t}f(\tau)d\tau$ | $\frac{F(\omega)}{i\omega}+\pi F(0)\delta(\omega)$ |
| 卷积 | $f*g$ | $F(\omega)G(\omega)$ |
| 相乘 | $f(t)g(t)$ | $\frac{1}{2\pi}F*G$ |
| 共轭 | $\overline{f(t)}$ | $\overline{F(-\omega)}$ |
| 帕塞瓦尔 | $\int\lvert f\rvert^2dt$ | $\frac{1}{2\pi}\int\lvert F\rvert^2d\omega$ |

> [!important] 卷积定理
> $$
> \mathcal{F}[f*g]=F(\omega)G(\omega)
> $$
> 时域卷积 ↔ 频域相乘。这是 LSI 系统分析的核心：**系统输出 = 输入 * 冲激响应**，在频域就是 **$Y=HX$**。

> [!tip] 对偶性
> 傅里叶变换具有对偶性：若 $f(t)\leftrightarrow F(\omega)$，则 $F(t)\leftrightarrow 2\pi f(-\omega)$。
> 例如矩形脉冲 ↔ sinc，sinc ↔ 矩形脉冲；这解释了"时域越窄、频域越宽"。

## 常用变换对

| $f(t)$ | $F(\omega)$ |
| --- | --- |
| $\delta(t)$ | $1$ |
| $1$ | $2\pi\delta(\omega)$ |
| $e^{i\omega_0t}$ | $2\pi\delta(\omega-\omega_0)$ |
| $\cos\omega_0t$ | $\pi[\delta(\omega-\omega_0)+\delta(\omega+\omega_0)]$ |
| $\sin\omega_0t$ | $\frac{\pi}{i}[\delta(\omega-\omega_0)-\delta(\omega+\omega_0)]$ |
| 矩形脉冲 $\operatorname{rect}(t/\tau)$ | $\tau\operatorname{sinc}(\omega\tau/2)$ |
| $e^{-at}u(t)$（$a>0$） | $\frac{1}{a+i\omega}$ |
| $e^{-a\lvert t\rvert}$（$a>0$） | $\frac{2a}{a^2+\omega^2}$ |
| 高斯 $e^{-t^2/(2\sigma^2)}$ | $\sigma\sqrt{2\pi}e^{-\sigma^2\omega^2/2}$ |

# 3. δ 函数

## 定义与性质

> [!info] Def 4 δ 函数
> **狄拉克 δ 函数**（Dirac delta function）是满足
> $$
> \delta(t)=0\ (t\ne0),\qquad \int_{-\infty}^{\infty}\delta(t)\,\mathrm{d}t=1
> $$
> 的广义函数。它不是普通函数，而是"集中在一点、面积为 1"的冲激。

**三条核心性质**：

1. **抽样性**：$\displaystyle\int_{-\infty}^{\infty}f(t)\delta(t-t_0)\,\mathrm{d}t=f(t_0)$
2. **卷积性**：$f(t)*\delta(t-t_0)=f(t-t_0)$
3. **缩放性**：$\delta(at)=\dfrac{1}{|a|}\delta(t)$

**傅里叶变换**：

$$
\mathcal{F}[\delta(t)]=1,\qquad \mathcal{F}[1]=2\pi\delta(\omega)
$$

$$
\mathcal{F}[\delta(t-t_0)]=e^{-i\omega t_0}
$$

> [!warning] δ 函数不是普通函数
> 它没有通常意义下的函数值；严格定义在广义函数（分布）理论中。工程上把它看作"宽度趋于 0、高度趋于无穷、面积保持 1"的脉冲极限。

## δ 函数与周期信号

周期信号可以写成复指数之和：

$$
f(t)=\sum_{n=-\infty}^{\infty}c_ne^{in\omega_0t}\ \longleftrightarrow\ F(\omega)=2\pi\sum_{n=-\infty}^{\infty}c_n\delta(\omega-n\omega_0)
$$

即**周期信号的频谱是离散的冲激串**。这统一了傅里叶级数与傅里叶变换：周期信号是"频谱为冲激串"的非周期信号。

# 4. 傅里叶变换的应用

## 频谱分析

- $|F(\omega)|$：幅度谱；$\arg F(\omega)$：相位谱
- 带宽：频谱显著非零的频率范围
- 时宽-带宽积：$\Delta t\cdot\Delta\omega\ge\frac12$（不确定性原理）

## 卷积与系统分析

LSI 系统：

$$
y(t)=x(t)*h(t)\ \longleftrightarrow\ Y(\omega)=X(\omega)H(\omega)
$$

- $H(\omega)$：频率响应
- 时域卷积 → 频域乘法：滤波器设计、均衡、匹配滤波都基于此

## 抽样定理

若 $f(t)$ 带限（$|F(\omega)|=0$，$|\omega|>\omega_H$），以 $T\le\pi/\omega_H$ 抽样，则可由样值无失真恢复：

$$
f(t)=\sum_{n=-\infty}^{\infty}f(nT)\operatorname{sinc}\left(\frac{t-nT}{T}\right)
$$

抽样后的频谱是原频谱以 $2\pi/T$ 为周期的延拓；不混叠条件 $T\le\pi/\omega_H$（即 $f_s\ge2f_H$）。

## 帕塞瓦尔定理

$$
\int_{-\infty}^{\infty}|f(t)|^2\,\mathrm{d}t=\frac{1}{2\pi}\int_{-\infty}^{\infty}|F(\omega)|^2\,\mathrm{d}\omega
$$

时域能量 = 频域能量。它是"能量守恒"在傅里叶变换下的表述。

## MATLAB

```matlab
% 符号傅里叶变换
syms t w
f = exp(-abs(t));
F = fourier(f, t, w);          % 2/(w^2+1)
% 数值 FFT（离散信号）
fs = 1000; N = 1024; t = (0:N-1)/fs;
x = cos(2*pi*100*t) + 0.5*cos(2*pi*200*t);
X = fft(x)/N; f = (0:N-1)*fs/N;
plot(f(1:N/2), 2*abs(X(1:N/2)));
% 卷积
y = conv(x, h, 'same');
```

# 5. 例题

> [!example] 例 1：矩形脉冲
> $f(t)=\operatorname{rect}(t/\tau)$（$|t|<\tau/2$ 时为 1，否则 0）。
> $$
> F(\omega)=\int_{-\tau/2}^{\tau/2}e^{-i\omega t}\,\mathrm{d}t=\tau\frac{\sin(\omega\tau/2)}{\omega\tau/2}=\tau\operatorname{sinc}\left(\frac{\omega\tau}{2}\right)
> $$
> 时域越窄（$\tau$ 小），频域主瓣越宽——时宽-带宽积不变。

> [!example] 例 2：单边指数
> $f(t)=e^{-at}u(t)$，$a>0$。
> $$
> F(\omega)=\int_0^{\infty}e^{-(a+i\omega)t}\,\mathrm{d}t=\frac{1}{a+i\omega}
> $$
> $$
> |F(\omega)|=\frac{1}{\sqrt{a^2+\omega^2}},\qquad \arg F(\omega)=-\arctan\frac{\omega}{a}
> $$

> [!example] 例 3：高斯脉冲
> $f(t)=e^{-t^2/(2\sigma^2)}$。
> $$
> F(\omega)=\sigma\sqrt{2\pi}e^{-\sigma^2\omega^2/2}
> $$
> 高斯函数的傅里叶变换仍是高斯——它是"自傅里叶"函数。时域越窄，频域越宽。

> [!example] 例 4：卷积定理
> 求 $f(t)=e^{-at}u(t)$ 与 $g(t)=e^{-bt}u(t)$ 的卷积（$a,b>0$）。
> $$
> F(\omega)=\frac{1}{a+i\omega},\qquad G(\omega)=\frac{1}{b+i\omega}
> $$
> $$
> F G=\frac{1}{(a+i\omega)(b+i\omega)}=\frac{1}{b-a}\left(\frac{1}{a+i\omega}-\frac{1}{b+i\omega}\right)
> $$
> 逆变换：
> $$
> f*g=\frac{1}{b-a}\left(e^{-at}-e^{-bt}\right)u(t)
> $$

> [!example] 例 5：帕塞瓦尔
> 用帕塞瓦尔求 $\int_{-\infty}^{\infty}\frac{\mathrm{d}\omega}{(a^2+\omega^2)^2}$。
> 取 $f(t)=e^{-a|t|}$，$F(\omega)=\frac{2a}{a^2+\omega^2}$。
> $$
> \int|f|^2dt=\int e^{-2a|t|}dt=\frac1a
> $$
> $$
> \frac{1}{2\pi}\int\frac{4a^2}{(a^2+\omega^2)^2}d\omega=\frac1a
> $$
> 故 $\int\frac{d\omega}{(a^2+\omega^2)^2}=\frac{\pi}{2a^3}$。

> [!tip] 本章收官
> 第 7 章把信号从时域搬到频域：
> 1. **傅里叶级数**（1）：周期信号 = 离散复指数之和；$c_n$ 是频谱。
> 2. **傅里叶变换**（2）：非周期信号 = 连续复指数积分；$F(\omega)$ 是频谱密度。
> 3. **δ 函数**（3）：冲激的傅里叶变换是 1；周期信号的频谱是冲激串。
> 4. **应用**（4）：卷积定理、抽样定理、帕塞瓦尔定理。
>
> 一句话：**傅里叶变换把"卷积"变成"乘法"、把"微分"变成"乘 $i\omega$"、把"能量"变成"频谱能量"；它是通信与信号处理的第一工具。下一章研究它的"带收敛因子"版本——拉普拉斯变换。**

# 本章知识地图

```
傅里叶变换
├─ 1. 傅里叶级数
│     ├─ 三角形式：a₀/2 + Σ(aₙcos nω₀t+bₙsin nω₀t)
│     ├─ 复指数形式：Σcₙe^{inω₀t}
│     ├─ cₙ=(1/T)∫f e^{−inω₀t}dt
│     └─ 狄利克雷条件；间断点取平均值
│
├─ 2. 傅里叶变换
│     ├─ F(ω)=∫f(t)e^{−iωt}dt
│     ├─ 逆变换：f(t)=1/(2π)∫F e^{iωt}dω
│     ├─ 幅度谱/相位谱
│     └─ 性质：时移/频移/尺度/微分/卷积/帕塞瓦尔
│
├─ 3. δ 函数
│     ├─ δ(t)=0 (t≠0)，∫δ=1
│     ├─ 抽样性、卷积性、缩放性
│     ├─ F[δ]=1，F[1]=2πδ(ω)
│     └─ 周期信号 → 冲激串频谱
│
├─ 4. 应用
│     ├─ 频谱分析、时宽-带宽积
│     ├─ 卷积定理：Y=HX
│     ├─ 抽样定理：f_s≥2f_H
│     └─ 帕塞瓦尔：能量守恒
│
└─ 5. 例题
      ├─ 矩形脉冲
      ├─ 指数/高斯
      ├─ 卷积
      └─ 帕塞瓦尔
```

# 关联

- 上一章：[[vault-notes/math/complex-analysis/06-conformal-mapping]]
- 下一章：[[vault-notes/math/complex-analysis/08-laplace-transform]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 复指数基 | [[vault-notes/math/complex-analysis/08-laplace-transform]] 的复频率 $s=\sigma+i\omega$ |
| 傅里叶变换 | [[vault-notes/dsp/02-z-transform-and-dtft]] 的 DTFT；[[vault-notes/dsp/04-fast-fourier-transform]] 的 DFT |
| 卷积定理 | [[vault-notes/math/complex-analysis/08-laplace-transform]] 的卷积定理；[[vault-notes/communication/06-digital-baseband]] 的系统响应 |
| δ 函数 | 抽样定理；冲激响应 |
| 帕塞瓦尔 | 能量谱；[[vault-notes/communication/03-random-processes]] 的功率谱 |

**本章留下的三个悬念（第 8 章结清）**：

| 本章的悬念 | 第 8 章的答案 |
| --- | --- |
| 傅里叶变换要求绝对可积，很多信号不满足怎么办？ | 乘衰减因子 $e^{-\sigma t}$，得到拉普拉斯变换 |
| 微分方程怎么用变换求解？ | 拉氏变换把微分变成乘法，初值自动进入 |
| 系统稳定性怎么判断？ | 拉氏变换的极点位置（左半平面稳定） |

**通信方向应用**：

- [[vault-notes/dsp/02-z-transform-and-dtft]] —— DTFT 是傅里叶变换的离散时间版本；DFT/FFT 是它的离散频率采样。
- [[vault-notes/communication/06-digital-baseband]] —— 成形滤波、匹配滤波、频域均衡都基于卷积定理。
- [[vault-notes/communication/07-digital-bandpass]] —— 调制是频移；频谱搬移用傅里叶变换描述。
- [[vault-notes/communication/03-random-processes]] —— 功率谱密度是自相关函数的傅里叶变换（维纳-辛钦）。
- [[vault-notes/matlab/matlab-notes]] —— `fft`/`ifft`/`fourier`/`conv` 是本章的直接工具。

**相关**：[[vault-notes/math/complex-analysis/06-conformal-mapping]]｜[[vault-notes/math/complex-analysis/08-laplace-transform]]｜[[vault-notes/dsp/02-z-transform-and-dtft]]｜[[vault-notes/matlab/matlab-notes]]
