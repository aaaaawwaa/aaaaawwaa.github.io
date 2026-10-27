---
title: "离散傅里叶变换(DFT)"
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
> 第 2 章把序列搬进了 $z$ 域与频域，但 DTFT 的频谱是**连续的**——计算机既存不下、也算不完。本章解决"怎么把频谱变成有限个数"：
> - **3.1 离散傅里叶变换的定义**：在单位圆上对 DTFT 等间隔采样，就得到 $N$ 点 DFT。正变换与反变换都只涉及有限求和，是真正能交给计算机的变换。
> - **3.2 离散傅里叶变换的基本性质**：线性、圆周移位、**圆周卷积**、调制、共轭对称、帕塞瓦尔。核心是"**时域圆周卷积 ↔ 频域相乘**"。
> - **3.3 频率域采样**：DFT 是"频率域采样"的产物。采样点数 $N$ 不够时会发生**时域混叠**；频率采样定理给出"$N\ge M$ 才能无失真恢复"的条件。
> - **3.4 DFT 的应用举例**：频谱分析（分辨率、泄漏、栅栏效应、窗函数）、用 DFT 算线性卷积（补零）、实序列的频谱技巧。
>
> 一句话主线：**DFT 是把 DTFT 在一个周期内等间隔切 $N$ 刀；时域有限长、频域离散这两个"有限"通过周期性绑在一起——时域周期化对应频域离散化，频域采样对应时域周期延拓。**

> [!note] 记号约定
> - $N$：DFT 点数；$W_N=e^{-j2\pi/N}$ 称为**旋转因子**（twiddle factor），满足 $W_N^{nk}=e^{-j2\pi nk/N}$
> - $x(n)$：长度为 $N$ 的有限长序列（$0\le n\le N-1$）；$X(k)$：$N$ 点 DFT（$0\le k\le N-1$）
> - $((n))_N$：$n$ 对 $N$ 取模（圆周移位/周期延拓的记号）；$R_N(n)$：长度 $N$ 的矩形窗
> - $x(n)\circledast h(n)$：$N$ 点**圆周卷积**；$x(n)*h(n)$：线性卷积
> - DFT 默认把 $x(n)$ 看作周期为 $N$ 的周期序列 $\tilde x(n)$ 的主值区，**所有移位与卷积都在圆周上进行**
> - $f_s$：采样频率；$\Delta f=f_s/N$：DFT 频率分辨率（bin 间隔）

# 1. 离散傅里叶变换的定义

## 为什么需要 DFT：DTFT 的三个"连续"

DTFT 的定义是

$$X(e^{j\omega})=\sum_{n=-\infty}^{\infty}x(n)e^{-j\omega n}$$

它有三个让计算机为难的地方：

| 问题 | 后果 |
| --- | --- |
| 求和区间是 $-\infty\sim\infty$ | 无限长序列无法直接算 |
| $\omega$ 是连续变量 | 需要连续取无穷多个频率点 |
| $X(e^{j\omega})$ 一般是复连续函数 | 无法用有限个寄存器存下 |

工程上的解决办法很直接：**只取有限长的一段序列，只在有限个频率点上计算**。这两刀切下去，就得到 DFT。

## 正变换与反变换

> [!info] Def 1 N 点离散傅里叶变换
> 设 $x(n)$ 是长度为 $N$ 的有限长序列（$0\le n\le N-1$），定义其 **$N$ 点离散傅里叶变换**（discrete Fourier transform，简称 DFT）为
> $$X(k)=\sum_{n=0}^{N-1}x(n)W_N^{nk},\qquad k=0,1,\dots,N-1$$
> 其中 $W_N=e^{-j2\pi/N}$。$X(k)$ 也是长度为 $N$ 的有限长序列。

> [!info] Def 2 离散傅里叶反变换
> **离散傅里叶反变换**（inverse discrete Fourier transform，简称 IDFT）为
> $$x(n)=\frac{1}{N}\sum_{k=0}^{N-1}X(k)W_N^{-nk},\qquad n=0,1,\dots,N-1$$

两个式子都是**有限项求和**，这就是 DFT 能被计算机实现、并能用 FFT 加速的根本原因。

> [!tip] $W_N$ 的三条性质（后面所有性质都从它来）
> 1. **周期性**：$W_N^{nk}=W_N^{nk\bmod N}$
> 2. **共轭对称性**：$W_N^{-nk}=(W_N^{nk})^*$
> 3. **半周期反转**：$W_N^{k+N/2}=e^{-j\pi}W_N^k=-W_N^k$（$N$ 为偶数时）
>
> 第 3 条正是 FFT 蝶形运算能"少算一半"的来源（第 4 章）。

## 矩阵形式与正交性

把 $x(n)$ 排成列向量 $\mathbf{x}$，$X(k)$ 排成 $\mathbf{X}$，则

$$\mathbf{X}=\mathbf{W}\mathbf{x},\qquad \mathbf{W}=[W_N^{nk}]_{N\times N}$$

$\mathbf{W}$ 是**范德蒙矩阵**，其列向量两两正交：

$$\sum_{n=0}^{N-1}W_N^{nk}W_N^{-nl}=\begin{cases}N,&k=l\\0,&k\ne l\end{cases}$$

因此 $\mathbf{W}^{-1}=\frac{1}{N}\mathbf{W}^*$，反变换就是"共轭转置再除以 $N$"。DFT 本质上是 $\mathbb{C}^N$ 上的一次**正交变换**（差一个 $\sqrt N$ 归一化因子）——这与线性代数里的正交基、傅里叶级数完全同源。

## DFT 与 DTFT、z 变换、DFS 的关系

> [!info] Def 3 DFT 是 DTFT 的频率采样
> 令 $\omega_k=\dfrac{2\pi k}{N}$，则
> $$X(k)=X(e^{j\omega})\Big|_{\omega=\omega_k}=X(e^{j2\pi k/N}),\qquad k=0,1,\dots,N-1$$
> 即 **$N$ 点 DFT 就是把 DTFT 在一个 $2\pi$ 周期内等间隔采样 $N$ 个点**。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 300" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <line x1="60.0" y1="34.0" x2="60.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="220.0" y1="34.0" x2="220.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="380.0" y1="34.0" x2="380.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="540.0" y1="34.0" x2="540.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="700.0" y1="34.0" x2="700.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="60.0" y1="34.0" x2="700.0" y2="34.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="60.0" y1="83.0" x2="700.0" y2="83.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="60.0" y1="132.0" x2="700.0" y2="132.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="60.0" y1="181.0" x2="700.0" y2="181.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="60.0" y1="230.0" x2="700.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="60.0" y1="230.0" x2="700.0" y2="230.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="60.0" y1="230.0" x2="60.0" y2="34.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <text x="704.0" y="234.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">ω</text>
  <text x="54.0" y="28.0" text-anchor="end" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">|X(e^{jω})|</text>
  <line x1="60.0" y1="230.0" x2="60.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="60.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">0</text>
  <line x1="220.0" y1="230.0" x2="220.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="220.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">π/2</text>
  <line x1="380.0" y1="230.0" x2="380.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="380.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">π</text>
  <line x1="540.0" y1="230.0" x2="540.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="540.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">3π/2</text>
  <line x1="700.0" y1="230.0" x2="700.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="700.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">2π</text>
  <line x1="56.0" y1="34.0" x2="60.0" y2="34.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="53.0" y="38.0" text-anchor="end" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">N</text>
  <line x1="56.0" y1="132.0" x2="60.0" y2="132.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="53.0" y="136.0" text-anchor="end" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">N/2</text>
  <line x1="56.0" y1="230.0" x2="60.0" y2="230.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="53.0" y="234.0" text-anchor="end" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">0</text>
  <polyline points="60.0,34.0 61.3,34.1 62.6,34.3 63.8,34.7 65.1,35.3 66.4,36.0 67.7,36.9 69.0,38.0 70.2,39.2 71.5,40.5 72.8,42.0 74.1,43.7 75.4,45.5 76.6,47.5 77.9,49.5 79.2,51.8 80.5,54.2 81.8,56.7 83.0,59.3 84.3,62.1 85.6,65.0 86.9,68.0 88.2,71.1 89.4,74.3 90.7,77.6 92.0,81.1 93.3,84.6 94.6,88.2 95.8,91.9 97.1,95.7 98.4,99.5 99.7,103.4 101.0,107.4 102.2,111.4 103.5,115.5 104.8,119.7 106.1,123.9 107.4,128.1 108.6,132.3 109.9,136.6 111.2,140.9 112.5,145.2 113.8,149.5 115.0,153.8 116.3,158.1 117.6,162.3 118.9,166.6 120.2,170.8 121.4,175.1 122.7,179.3 124.0,183.4 125.3,187.5 126.6,191.6 127.8,195.6 129.1,199.5 130.4,203.4 131.7,207.2 133.0,210.9 134.2,214.6 135.5,218.2 136.8,221.7 138.1,225.1 139.4,228.4 140.6,228.4 141.9,225.3 143.2,222.3 144.5,219.4 145.8,216.6 147.0,213.9 148.3,211.3 149.6,208.8 150.9,206.5 152.2,204.2 153.4,202.1 154.7,200.1 156.0,198.3 157.3,196.5 158.6,194.9 159.8,193.4 161.1,192.1 162.4,190.8 163.7,189.7 165.0,188.7 166.2,187.8 167.5,187.1 168.8,186.5 170.1,185.9 171.4,185.6 172.6,185.3 173.9,185.1 175.2,185.1 176.5,185.2 177.8,185.3 179.0,185.6 180.3,186.0 181.6,186.5 182.9,187.1 184.2,187.8 185.4,188.5 186.7,189.4 188.0,190.4 189.3,191.4 190.6,192.5 191.8,193.7 193.1,194.9 194.4,196.2 195.7,197.6 197.0,199.1 198.2,200.6 199.5,202.1 200.8,203.7 202.1,205.3 203.4,207.0 204.6,208.7 205.9,210.4 207.2,212.2 208.5,213.9 209.8,215.7 211.0,217.5 212.3,219.3 213.6,221.1 214.9,222.9 216.2,224.7 217.4,226.5 218.7,228.2 220.0,230.0 221.3,228.3 222.6,226.6 223.8,224.9 225.1,223.2 226.4,221.6 227.7,220.1 229.0,218.6 230.2,217.1 231.5,215.6 232.8,214.3 234.1,212.9 235.4,211.7 236.6,210.5 237.9,209.3 239.2,208.2 240.5,207.2 241.8,206.3 243.0,205.4 244.3,204.6 245.6,203.8 246.9,203.1 248.2,202.6 249.4,202.0 250.7,201.6 252.0,201.2 253.3,200.9 254.6,200.7 255.8,200.5 257.1,200.4 258.4,200.4 259.7,200.5 261.0,200.6 262.2,200.9 263.5,201.1 264.8,201.5 266.1,201.9 267.4,202.4 268.6,203.0 269.9,203.6 271.2,204.2 272.5,205.0 273.8,205.8 275.0,206.6 276.3,207.5 277.6,208.5 278.9,209.5 280.2,210.5 281.4,211.6 282.7,212.7 284.0,213.8 285.3,215.0 286.6,216.2 287.8,217.5 289.1,218.7 290.4,220.0 291.7,221.3 293.0,222.7 294.2,224.0 295.5,225.3 296.8,226.7 298.1,228.0 299.4,229.3 300.6,229.3 301.9,228.0 303.2,226.7 304.5,225.4 305.8,224.1 307.0,222.9 308.3,221.6 309.6,220.4 310.9,219.2 312.2,218.1 313.4,217.0 314.7,215.9 316.0,214.9 317.3,213.9 318.6,212.9 319.8,212.0 321.1,211.1 322.4,210.3 323.7,209.6 325.0,208.9 326.2,208.2 327.5,207.6 328.8,207.1 330.1,206.6 331.4,206.2 332.6,205.9 333.9,205.6 335.2,205.3 336.5,205.2 337.8,205.1 339.0,205.0 340.3,205.0 341.6,205.1 342.9,205.2 344.2,205.4 345.4,205.7 346.7,206.0 348.0,206.4 349.3,206.8 350.6,207.3 351.8,207.9 353.1,208.5 354.4,209.1 355.7,209.9 357.0,210.6 358.2,211.4 359.5,212.3 360.8,213.2 362.1,214.1 363.4,215.1 364.6,216.1 365.9,217.1 367.2,218.2 368.5,219.3 369.8,220.4 371.0,221.5 372.3,222.7 373.6,223.9 374.9,225.1 376.2,226.3 377.4,227.5 378.7,228.8 380.0,230.0 381.3,228.8 382.6,227.5 383.8,226.3 385.1,225.1 386.4,223.9 387.7,222.7 389.0,221.5 390.2,220.4 391.5,219.3 392.8,218.2 394.1,217.1 395.4,216.1 396.6,215.1 397.9,214.1 399.2,213.2 400.5,212.3 401.8,211.4 403.0,210.6 404.3,209.9 405.6,209.1 406.9,208.5 408.2,207.9 409.4,207.3 410.7,206.8 412.0,206.4 413.3,206.0 414.6,205.7 415.8,205.4 417.1,205.2 418.4,205.1 419.7,205.0 421.0,205.0 422.2,205.1 423.5,205.2 424.8,205.3 426.1,205.6 427.4,205.9 428.6,206.2 429.9,206.6 431.2,207.1 432.5,207.6 433.8,208.2 435.0,208.9 436.3,209.6 437.6,210.3 438.9,211.1 440.2,212.0 441.4,212.9 442.7,213.9 444.0,214.9 445.3,215.9 446.6,217.0 447.8,218.1 449.1,219.2 450.4,220.4 451.7,221.6 453.0,222.9 454.2,224.1 455.5,225.4 456.8,226.7 458.1,228.0 459.4,229.3 460.6,229.3 461.9,228.0 463.2,226.7 464.5,225.3 465.8,224.0 467.0,222.7 468.3,221.3 469.6,220.0 470.9,218.7 472.2,217.5 473.4,216.2 474.7,215.0 476.0,213.8 477.3,212.7 478.6,211.6 479.8,210.5 481.1,209.5 482.4,208.5 483.7,207.5 485.0,206.6 486.2,205.8 487.5,205.0 488.8,204.2 490.1,203.6 491.4,203.0 492.6,202.4 493.9,201.9 495.2,201.5 496.5,201.1 497.8,200.9 499.0,200.6 500.3,200.5 501.6,200.4 502.9,200.4 504.2,200.5 505.4,200.7 506.7,200.9 508.0,201.2 509.3,201.6 510.6,202.0 511.8,202.6 513.1,203.1 514.4,203.8 515.7,204.6 517.0,205.4 518.2,206.3 519.5,207.2 520.8,208.2 522.1,209.3 523.4,210.5 524.6,211.7 525.9,212.9 527.2,214.3 528.5,215.6 529.8,217.1 531.0,218.6 532.3,220.1 533.6,221.6 534.9,223.2 536.2,224.9 537.4,226.6 538.7,228.3 540.0,230.0 541.3,228.2 542.6,226.5 543.8,224.7 545.1,222.9 546.4,221.1 547.7,219.3 549.0,217.5 550.2,215.7 551.5,213.9 552.8,212.2 554.1,210.4 555.4,208.7 556.6,207.0 557.9,205.3 559.2,203.7 560.5,202.1 561.8,200.6 563.0,199.1 564.3,197.6 565.6,196.2 566.9,194.9 568.2,193.7 569.4,192.5 570.7,191.4 572.0,190.4 573.3,189.4 574.6,188.5 575.8,187.8 577.1,187.1 578.4,186.5 579.7,186.0 581.0,185.6 582.2,185.3 583.5,185.2 584.8,185.1 586.1,185.1 587.4,185.3 588.6,185.6 589.9,185.9 591.2,186.5 592.5,187.1 593.8,187.8 595.0,188.7 596.3,189.7 597.6,190.8 598.9,192.1 600.2,193.4 601.4,194.9 602.7,196.5 604.0,198.3 605.3,200.1 606.6,202.1 607.8,204.2 609.1,206.5 610.4,208.8 611.7,211.3 613.0,213.9 614.2,216.6 615.5,219.4 616.8,222.3 618.1,225.3 619.4,228.4 620.6,228.4 621.9,225.1 623.2,221.7 624.5,218.2 625.8,214.6 627.0,210.9 628.3,207.2 629.6,203.4 630.9,199.5 632.2,195.6 633.4,191.6 634.7,187.5 636.0,183.4 637.3,179.3 638.6,175.1 639.8,170.8 641.1,166.6 642.4,162.3 643.7,158.1 645.0,153.8 646.2,149.5 647.5,145.2 648.8,140.9 650.1,136.6 651.4,132.3 652.6,128.1 653.9,123.9 655.2,119.7 656.5,115.5 657.8,111.4 659.0,107.4 660.3,103.4 661.6,99.5 662.9,95.7 664.2,91.9 665.4,88.2 666.7,84.6 668.0,81.1 669.3,77.6 670.6,74.3 671.8,71.1 673.1,68.0 674.4,65.0 675.7,62.1 677.0,59.3 678.2,56.7 679.5,54.2 680.8,51.8 682.1,49.5 683.4,47.5 684.6,45.5 685.9,43.7 687.2,42.0 688.5,40.5 689.8,39.2 691.0,38.0 692.3,36.9 693.6,36.0 694.9,35.3 696.2,34.7 697.4,34.3 698.7,34.1 700.0,34.0" fill="none" stroke="var(--text-accent,#705dcf)" stroke-width="2.0"/>
  <line x1="60.0" y1="230.0" x2="60.0" y2="34.0" stroke="var(--text-faint,#8b949e)" stroke-width="1.0" stroke-dasharray="3 2"/>
  <circle cx="60.0" cy="34.0" r="3.2" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <line x1="140.0" y1="230.0" x2="140.0" y2="230.0" stroke="var(--text-faint,#8b949e)" stroke-width="1.0" stroke-dasharray="3 2"/>
  <circle cx="140.0" cy="230.0" r="3.2" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <line x1="220.0" y1="230.0" x2="220.0" y2="230.0" stroke="var(--text-faint,#8b949e)" stroke-width="1.0" stroke-dasharray="3 2"/>
  <circle cx="220.0" cy="230.0" r="3.2" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <line x1="300.0" y1="230.0" x2="300.0" y2="230.0" stroke="var(--text-faint,#8b949e)" stroke-width="1.0" stroke-dasharray="3 2"/>
  <circle cx="300.0" cy="230.0" r="3.2" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <line x1="380.0" y1="230.0" x2="380.0" y2="230.0" stroke="var(--text-faint,#8b949e)" stroke-width="1.0" stroke-dasharray="3 2"/>
  <circle cx="380.0" cy="230.0" r="3.2" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <line x1="460.0" y1="230.0" x2="460.0" y2="230.0" stroke="var(--text-faint,#8b949e)" stroke-width="1.0" stroke-dasharray="3 2"/>
  <circle cx="460.0" cy="230.0" r="3.2" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <line x1="540.0" y1="230.0" x2="540.0" y2="230.0" stroke="var(--text-faint,#8b949e)" stroke-width="1.0" stroke-dasharray="3 2"/>
  <circle cx="540.0" cy="230.0" r="3.2" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <line x1="620.0" y1="230.0" x2="620.0" y2="230.0" stroke="var(--text-faint,#8b949e)" stroke-width="1.0" stroke-dasharray="3 2"/>
  <circle cx="620.0" cy="230.0" r="3.2" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <line x1="700.0" y1="230.0" x2="700.0" y2="34.0" stroke="var(--text-faint,#8b949e)" stroke-width="1.0" stroke-dasharray="3 2"/>
  <circle cx="700.0" cy="34.0" r="3.2" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="1.0"/>
  <text x="90.0" y="52.0" text-anchor="start" font-size="12" fill="var(--text-accent,#705dcf)" font-weight="normal">连续曲线：|X(e^{jω})|（DTFT）</text>
  <text x="90.0" y="70.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">圆点：X(k)=X(e^{j2πk/N})（N=8 点 DFT）</text>
  <text x="380.0" y="280.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">DFT 就是对 DTFT 在 N 个等间隔频率上的采样</text>
</svg>

同样的关系可以写成 $z$ 变换在单位圆上的采样：

$$X(k)=X(z)\Big|_{z=W_N^{-k}}=X(z)\Big|_{z=e^{j2\pi k/N}}$$

| 变换 | 自变量 | 时域 | 频域 | 计算方式 |
| --- | --- | --- | --- | --- |
| DFS | 离散频率 $k$ | **周期**序列 | **离散**周期谱 | 有限和（一个周期） |
| DTFT | 连续频率 $\omega$ | 非周期序列 | **连续**周期谱 | 无限和/积分 |
| z 变换 | 复变量 $z$ | 非周期序列 | 复平面函数 | 幂级数 |
| **DFT** | **离散** $k$ | **有限长**序列 | **离散**有限谱 | **有限和（可计算）** |

> [!important] 一句话把四者串起来
> **DFT = 在单位圆上等间隔采样的 z 变换 = 对 DTFT 的频率采样 = 周期序列 DFS 的主值区。**
> 时域的"有限长/周期"与频域的"离散/连续"是一对对偶：**时域周期化 ⇒ 频域离散化；频域采样 ⇒ 时域周期延拓**。

## 隐含周期性

DFT 只给出 $0\le n,k\le N-1$ 的主值区，但公式中的 $W_N^{nk}$ 对 $n,k$ 都以 $N$ 为周期。因此 DFT 默认把 $x(n)$ 和 $X(k)$ 都看作**周期为 $N$ 的周期序列**：

$$\tilde x(n)=x((n))_N,\qquad \tilde X(k)=X((k))_N$$

这不是额外假设，而是 DFT 定义自带的性质。它直接导致下一节的"圆周移位"和"圆周卷积"——**所有操作都在一个长度为 $N$ 的圆环上进行，移出右端会从左边回来**。

## 几个最简单的 DFT

> [!example] 常用序列的 N 点 DFT
> - $x(n)=\delta(n)$：$X(k)=1$（全频带平坦）
> - $x(n)=\delta(n-n_0)$：$X(k)=W_N^{n_0k}=e^{-j2\pi n_0k/N}$（线性相位）
> - $x(n)=1\ (0\le n\le N-1)$：$X(0)=N$，其余 $X(k)=0$（直流只落在 $k=0$）
> - $x(n)=W_N^{-n_0n}=e^{j2\pi n_0n/N}$：$X(k)=N\delta((k-n_0))_N$（单根谱线）
> - 实余弦 $x(n)=\cos(2\pi n_0n/N)$：$X(k)=\frac{N}{2}[\delta((k-n_0))_N+\delta((k+n_0))_N]$

## MATLAB

```matlab
N = 8; n = 0:N-1;
x = [1 1 1 1 0 0 0 0];        % 矩形窗
X = fft(x);                    % N 点 DFT（列向量）
xr = ifft(X);                  % 反变换，验证 xr 与 x 一致（可能有 1e-16 误差）
k = 0:N-1;
stem(k, abs(X), 'filled');     % 幅度谱
% 与 DTFT 对照：在 0..2π 上密集采样
w = linspace(0, 2*pi, 512);
Xd = zeros(size(w));
for i = 1:length(w)
    Xd(i) = sum(x .* exp(-1j*w(i)*n));
end
plot(w, abs(Xd)); hold on;
stem(2*pi*k/N, abs(X), 'r', 'filled');   % DFT 点正好落在 DTFT 曲线上
```

# 2. 离散傅里叶变换的基本性质

## 线性

$$ax_1(n)+bx_2(n)\ \longleftrightarrow\ aX_1(k)+bX_2(k)$$

前提是三个序列都取**相同的 $N$ 点**；若长度不同，要先补零到同一长度再相加。

## 圆周移位

> [!info] Def 4 圆周移位
> 序列 $x(n)$ 的 **$m$ 点圆周移位**（circular shift）定义为
> $$x((n-m))_N R_N(n)$$
> 即先把序列周期延拓，再右移 $m$ 位，最后取主值区。移出右端的样值会从左边"绕回来"。

$$x((n-m))_N R_N(n)\ \longleftrightarrow\ W_N^{mk}X(k)=e^{-j2\pi mk/N}X(k)$$

- 时域圆周移位 $m$ 位 ↔ 频域乘线性相位 $e^{-j2\pi mk/N}$
- 这与 DTFT 的移位性质形式相同，但**移位是圆周的**，不是线性移位

## 圆周卷积

> [!info] Def 5 圆周卷积
> 两个长度均为 $N$ 的序列的 **$N$ 点圆周卷积**（circular convolution）定义为
> $$y(n)=x(n)\circledast h(n)=\sum_{m=0}^{N-1}x(m)\,h((n-m))_N,\qquad 0\le n\le N-1$$
> 等价地，$y(n)$ 是线性卷积 $x(n)*h(n)$ 以 $N$ 为周期延拓后取主值区。

> [!important] 时域圆周卷积 ↔ 频域相乘（本章主定理）
> $$x(n)\circledast h(n)\ \longleftrightarrow\ X(k)H(k)$$
> 这是 DFT 最重要的性质：**卷积运算在 DFT 域变成逐点乘法**。第 4 章的 FFT 之所以能极大加速卷积，就是因为这条。

**圆周卷积与线性卷积的关系**：

$$y_{\text{circ}}(n)=\sum_{r=-\infty}^{\infty}y_{\text{lin}}(n+rN),\qquad 0\le n\le N-1$$

- 若 $N\ge L_x+L_h-1$，圆周卷积 = 线性卷积（没有"绕回"的混叠）
- 若 $N<L_x+L_h-1$，圆周卷积会把线性卷积的尾部绕回头部，造成**时域混叠**

> [!example] 圆周卷积 vs 线性卷积
> 取 $x(n)=\{1,2,3,4\}$，$h(n)=\{1,1,0,0\}$，$N=4$。
> - 线性卷积：$\{1,3,5,7,4,0,0\}$（长度 7）
> - 4 点圆周卷积：把线性卷积以 4 为周期折叠：
>   $y(0)=1+4=5$，$y(1)=3+0=3$，$y(2)=5+0=5$，$y(3)=7+0=7$
>   即 $\{5,3,5,7\}$。
> - 若补零到 $N=7$，再做 7 点圆周卷积，结果与线性卷积完全一致。

> [!warning] 用 DFT 算线性卷积的铁律
> **必须补零到 $L\ge L_x+L_h-1$**，再做 $L$ 点 DFT/IDFT。否则圆周卷积的"绕回"会污染结果，且这种错误在频域看不出来。

## 调制（频域圆周移位）

$$W_N^{-mn}x(n)=e^{j2\pi mn/N}x(n)\ \longleftrightarrow\ X((k-m))_N$$

时域乘复指数 ↔ 频域圆周移位。这就是"数字混频"在 DFT 域的表述：乘 $e^{j2\pi mn/N}$ 把整段频谱搬移 $m$ 个 bin。

## 共轭对称性

对**实序列** $x(n)$：

$$X(N-k)=X^*(k),\qquad 0\le k\le N-1$$

- 幅度谱偶对称：$|X(N-k)|=|X(k)|$
- 相位谱奇对称：$\arg X(N-k)=-\arg X(k)$
- $X(0)$ 与 $X(N/2)$（$N$ 为偶数时）是实数

这条性质让实序列只需存一半频谱；也是第 4 章"实序列 FFT 用 $N/2$ 点复数 FFT"的依据。

## 帕塞瓦尔定理

$$\sum_{n=0}^{N-1}|x(n)|^2=\frac{1}{N}\sum_{k=0}^{N-1}|X(k)|^2$$

时域能量 = 频域能量（差一个 $1/N$ 的归一化）。这是第 2 章 DTFT 帕塞瓦尔定理的离散有限版本。

## 对偶性

$$X(n)\ \longleftrightarrow\ N\,x((N-k))_N$$

时域与频域在 DFT 中地位对称：**把频谱当序列再做一次 DFT，会得到原序列的翻转（乘 $N$）**。这条性质常用于"用时域方法算频域"或反过来。

## 性质总表

| 性质 | 时域 | 频域 |
| --- | --- | --- |
| 线性 | $ax_1(n)+bx_2(n)$ | $aX_1(k)+bX_2(k)$ |
| 圆周移位 | $x((n-m))_N$ | $W_N^{mk}X(k)$ |
| 圆周卷积 | $x(n)\circledast h(n)$ | $X(k)H(k)$ |
| 调制 | $W_N^{-mn}x(n)$ | $X((k-m))_N$ |
| 共轭 | $x^*(n)$ | $X^*((N-k))_N$ |
| 实序列对称 | $x(n)$ 实 | $X(N-k)=X^*(k)$ |
| 帕塞瓦尔 | $\sum\lvert x(n)\rvert^2$ | $\frac{1}{N}\sum\lvert X(k)\rvert^2$ |
| 对偶 | $X(n)$ | $N x((N-k))_N$ |

# 3. 频率域采样

## 问题的提出

DFT 是"对 DTFT 采样"。反过来问：**只给定 $N$ 个频率采样值 $X(k)$，能不能唯一恢复原序列 $x(n)$？** 这就是频率域采样定理。

> [!info] Def 6 频率域采样
> 在 $[0,2\pi)$ 内以 $\omega_k=2\pi k/N$ 对 $X(e^{j\omega})$ 采样，得到 $N$ 个值 $X(k)$；用 IDFT 得到的序列
> $$x_N(n)=\frac{1}{N}\sum_{k=0}^{N-1}X(k)W_N^{-nk}$$
> 称为 $x(n)$ 的**频率域采样重建**。

## 时域混叠

设原序列 $x(n)$ 的长度为 $M$。可以证明：

$$x_N(n)=\sum_{r=-\infty}^{\infty}x(n+rN),\qquad 0\le n\le N-1$$

即重建序列是原序列以 $N$ 为周期的**周期延拓**的主值区。

| 情况 | 结果 |
| --- | --- |
| $N\ge M$ | 延拓副本不重叠，$x_N(n)=x(n)$，**无失真恢复** |
| $N<M$ | 延拓副本重叠，发生**时域混叠**（time-domain aliasing），无法恢复 |

> [!info] Def 7 频率采样定理
> 若序列 $x(n)$ 的长度为 $M$，则其 DTFT 在 $[0,2\pi)$ 内以 $2\pi/N$ 等间隔采样后，能由这 $N$ 个采样值无失真恢复 $x(n)$ 的充要条件是
> $$N\ge M$$
> 即**频率采样点数不能少于序列长度**。

> [!example] 时域混叠示例
> $x(n)=\{1,2,3,4,5,6\}$（$M=6$），只取 $N=4$ 个频率采样点：
> $$x_N(0)=x(0)+x(4)=1+5=6,\quad x_N(1)=x(1)+x(5)=2+6=8$$
> $$x_N(2)=x(2)=3,\quad x_N(3)=x(3)=4$$
> 重建得到 $\{6,8,3,4\}$，与原序列不同——高频部分"折叠"回了低频。

## 重建公式

当 $N\ge M$ 时，可以用频率采样值重建连续的 DTFT：

$$X(e^{j\omega})=\sum_{k=0}^{N-1}X(k)\,\Phi_k(\omega)$$

其中 $\Phi_k(\omega)$ 是**内插函数**（Dirichlet 核）：

$$\Phi_k(\omega)=\frac{1}{N}\sum_{n=0}^{N-1}e^{-j(\omega-2\pi k/N)n}=e^{-j(\omega-2\pi k/N)(N-1)/2}\frac{\sin[(\omega-2\pi k/N)N/2]}{N\sin[(\omega-2\pi k/N)/2]}$$

它在 $\omega=2\pi k/N$ 处为 1、在其他采样点处为 0。这与第 1 章"用 sinc 内插从样值恢复连续信号"完全对偶：**时域用 sinc 内插，频域用 Dirichlet 核内插**。

> [!tip] 时域与频域的对偶，一张表记住
> | 操作 | 时域 | 频域 |
> | --- | --- | --- |
> | 采样 | 样值 $x(nT)$ | 频谱周期延拓 |
> | 采样间隔 | $T$ | $2\pi/N$ |
> | 无混叠条件 | $f_s\ge2f_H$ | $N\ge M$ |
> | 重建 | sinc 内插 | Dirichlet 核内插 |
> | 混叠表现 | 频谱重叠 | 时域周期延拓重叠 |

# 4. DFT 的应用举例

## 频谱分析：分辨率、泄漏与栅栏效应

### 频率分辨率

$N$ 点 DFT 的第 $k$ 根谱线对应频率

$$f_k=k\frac{f_s}{N},\qquad k=0,1,\dots,N-1$$

相邻谱线间隔（**频率分辨率**）

$$\Delta f=\frac{f_s}{N}=\frac{1}{NT}=\frac{1}{T_0}$$

其中 $T_0=NT$ 是**观测时间**。结论：**分辨率只由观测时间决定，与采样率无关**；想分辨更近的两个频率，只能观察更久，不能靠提高 $f_s$ 或补零。

### 频谱泄漏

> [!info] Def 8 频谱泄漏
> 当被分析信号的频率不落在 DFT 的格点 $f_k=kf_s/N$ 上时，其能量会向相邻谱线扩散，称为**频谱泄漏**（spectral leakage）。根源是**有限长截断**（相当于乘矩形窗）。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <line x1="60.0" y1="40.0" x2="60.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="135.0" y1="40.0" x2="135.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="210.0" y1="40.0" x2="210.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="285.0" y1="40.0" x2="285.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="360.0" y1="40.0" x2="360.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="60.0" y1="40.0" x2="360.0" y2="40.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="60.0" y1="103.3" x2="360.0" y2="103.3" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="60.0" y1="166.7" x2="360.0" y2="166.7" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="60.0" y1="230.0" x2="360.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="60.0" y1="230.0" x2="360.0" y2="230.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="60.0" y1="230.0" x2="60.0" y2="40.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <text x="364.0" y="234.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">k</text>
  <text x="54.0" y="34.0" text-anchor="end" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">|X(k)|</text>
  <line x1="60.0" y1="230.0" x2="60.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="60.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">0</text>
  <line x1="135.0" y1="230.0" x2="135.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="135.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">8</text>
  <line x1="210.0" y1="230.0" x2="210.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="210.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">16</text>
  <line x1="285.0" y1="230.0" x2="285.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="285.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">24</text>
  <line x1="360.0" y1="230.0" x2="360.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="360.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">32</text>
  <line x1="60.0" y1="230.0" x2="60.0" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="60.0" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="69.7" y1="230.0" x2="69.7" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="69.7" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="79.4" y1="230.0" x2="79.4" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="79.4" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="89.0" y1="230.0" x2="89.0" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="89.0" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="98.7" y1="230.0" x2="98.7" y2="40.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="98.7" cy="40.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="108.4" y1="230.0" x2="108.4" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="108.4" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="118.1" y1="230.0" x2="118.1" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="118.1" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="127.7" y1="230.0" x2="127.7" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="127.7" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="137.4" y1="230.0" x2="137.4" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="137.4" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="147.1" y1="230.0" x2="147.1" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="147.1" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="156.8" y1="230.0" x2="156.8" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="156.8" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="166.5" y1="230.0" x2="166.5" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="166.5" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="176.1" y1="230.0" x2="176.1" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="176.1" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="185.8" y1="230.0" x2="185.8" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="185.8" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="195.5" y1="230.0" x2="195.5" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="195.5" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="205.2" y1="230.0" x2="205.2" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="205.2" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="214.8" y1="230.0" x2="214.8" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="214.8" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="224.5" y1="230.0" x2="224.5" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="224.5" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="234.2" y1="230.0" x2="234.2" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="234.2" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="243.9" y1="230.0" x2="243.9" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="243.9" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="253.5" y1="230.0" x2="253.5" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="253.5" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="263.2" y1="230.0" x2="263.2" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="263.2" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="272.9" y1="230.0" x2="272.9" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="272.9" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="282.6" y1="230.0" x2="282.6" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="282.6" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="292.3" y1="230.0" x2="292.3" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="292.3" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="301.9" y1="230.0" x2="301.9" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="301.9" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="311.6" y1="230.0" x2="311.6" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="311.6" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="321.3" y1="230.0" x2="321.3" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="321.3" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="331.0" y1="230.0" x2="331.0" y2="40.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="331.0" cy="40.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="340.6" y1="230.0" x2="340.6" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="340.6" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="350.3" y1="230.0" x2="350.3" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="350.3" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="360.0" y1="230.0" x2="360.0" y2="230.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="360.0" cy="230.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <text x="210.0" y="32.0" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">(a) 整数个周期：能量集中在 k=4</text>
  <line x1="430.0" y1="40.0" x2="430.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="505.0" y1="40.0" x2="505.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="580.0" y1="40.0" x2="580.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="655.0" y1="40.0" x2="655.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="730.0" y1="40.0" x2="730.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="430.0" y1="40.0" x2="730.0" y2="40.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="430.0" y1="103.3" x2="730.0" y2="103.3" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="430.0" y1="166.7" x2="730.0" y2="166.7" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="430.0" y1="230.0" x2="730.0" y2="230.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.7" stroke-dasharray="2 3"/>
  <line x1="430.0" y1="230.0" x2="730.0" y2="230.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="430.0" y1="230.0" x2="430.0" y2="40.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <text x="734.0" y="234.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">k</text>
  <text x="424.0" y="34.0" text-anchor="end" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">|X(k)|</text>
  <line x1="430.0" y1="230.0" x2="430.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="430.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">0</text>
  <line x1="505.0" y1="230.0" x2="505.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="505.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">8</text>
  <line x1="580.0" y1="230.0" x2="580.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="580.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">16</text>
  <line x1="655.0" y1="230.0" x2="655.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="655.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">24</text>
  <line x1="730.0" y1="230.0" x2="730.0" y2="234.0" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="730.0" y="247.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">32</text>
  <line x1="430.0" y1="230.0" x2="430.0" y2="205.7" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="430.0" cy="205.7" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="439.7" y1="230.0" x2="439.7" y2="203.8" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="439.7" cy="203.8" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="449.4" y1="230.0" x2="449.4" y2="196.5" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="449.4" cy="196.5" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="459.0" y1="230.0" x2="459.0" y2="175.1" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="459.0" cy="175.1" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="468.7" y1="230.0" x2="468.7" y2="40.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="468.7" cy="40.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="478.4" y1="230.0" x2="478.4" y2="101.9" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="478.4" cy="101.9" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="488.1" y1="230.0" x2="488.1" y2="180.7" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="488.1" cy="180.7" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="497.7" y1="230.0" x2="497.7" y2="198.6" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="497.7" cy="198.6" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="507.4" y1="230.0" x2="507.4" y2="206.4" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="507.4" cy="206.4" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="517.1" y1="230.0" x2="517.1" y2="210.7" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="517.1" cy="210.7" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="526.8" y1="230.0" x2="526.8" y2="213.3" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="526.8" cy="213.3" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="536.5" y1="230.0" x2="536.5" y2="215.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="536.5" cy="215.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="546.1" y1="230.0" x2="546.1" y2="216.2" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="546.1" cy="216.2" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="555.8" y1="230.0" x2="555.8" y2="217.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="555.8" cy="217.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="565.5" y1="230.0" x2="565.5" y2="217.5" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="565.5" cy="217.5" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="575.2" y1="230.0" x2="575.2" y2="217.8" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="575.2" cy="217.8" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="584.8" y1="230.0" x2="584.8" y2="217.9" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="584.8" cy="217.9" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="594.5" y1="230.0" x2="594.5" y2="217.8" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="594.5" cy="217.8" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="604.2" y1="230.0" x2="604.2" y2="217.5" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="604.2" cy="217.5" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="613.9" y1="230.0" x2="613.9" y2="217.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="613.9" cy="217.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="623.5" y1="230.0" x2="623.5" y2="216.2" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="623.5" cy="216.2" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="633.2" y1="230.0" x2="633.2" y2="215.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="633.2" cy="215.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="642.9" y1="230.0" x2="642.9" y2="213.3" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="642.9" cy="213.3" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="652.6" y1="230.0" x2="652.6" y2="210.7" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="652.6" cy="210.7" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="662.3" y1="230.0" x2="662.3" y2="206.4" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="662.3" cy="206.4" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="671.9" y1="230.0" x2="671.9" y2="198.6" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="671.9" cy="198.6" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="681.6" y1="230.0" x2="681.6" y2="180.7" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="681.6" cy="180.7" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="691.3" y1="230.0" x2="691.3" y2="101.9" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="691.3" cy="101.9" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="701.0" y1="230.0" x2="701.0" y2="40.0" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="701.0" cy="40.0" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="710.6" y1="230.0" x2="710.6" y2="175.1" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="710.6" cy="175.1" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="720.3" y1="230.0" x2="720.3" y2="196.5" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="720.3" cy="196.5" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <line x1="730.0" y1="230.0" x2="730.0" y2="203.8" stroke="var(--text-accent,#705dcf)" stroke-width="1.4"/>
  <circle cx="730.0" cy="203.8" r="2.0" fill="var(--text-accent,#705dcf)" stroke="var(--text-accent,#705dcf)" stroke-width="0.8"/>
  <text x="580.0" y="32.0" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">(b) 非整数个周期：频谱泄漏</text>
  <text x="380.0" y="300.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">矩形窗的 DFT 主瓣宽度 = 2π/N；频率不落在格点上时，能量向两侧扩散</text>
</svg>

| 现象 | 原因 | 改善 |
| --- | --- | --- |
| 泄漏 | 非整周期截断 + 矩形窗旁瓣高 | 用旁瓣低的窗（汉明、布莱克曼、凯泽） |
| 主瓣变宽 | 加窗后主瓣展宽 | 折中：主瓣宽度 ↔ 旁瓣高度 |
| 分辨率下降 | 主瓣宽度 > bin 间隔 | 增加观测时间 $T_0$ |

常用窗的主瓣宽度与旁瓣电平：

| 窗 | 主瓣宽度（bin） | 最高旁瓣（dB） |
| --- | --- | --- |
| 矩形窗 | 2 | −13 |
| 汉宁窗（Hann） | 4 | −31 |
| 汉明窗（Hamming） | 4 | −43 |
| 布莱克曼窗 | 6 | −58 |
| 凯泽窗（$\beta=8.6$） | 可调 | −60 左右 |

### 栅栏效应

> [!info] Def 9 栅栏效应
> **栅栏效应**（picket-fence effect）是指 DFT 只在离散格点上取值，真实谱峰若落在两根谱线之间，只能看到被"栅栏"挡住后的较低值，测得频率和幅度都会有偏差。

- **补零**（zero-padding）可以让谱线变密、谱峰位置看得更准，但**不增加真实分辨率**（真实分辨率仍由 $T_0$ 决定）
- 提高分辨率只能靠**增加观测时间**；补零只是"把栅栏的缝变细"

> [!warning] 三个最容易混的结论
> 1. **补零 ≠ 提高分辨率**：补零只是内插频谱，主瓣宽度（由窗长决定）不变。
> 2. **提高采样率 ≠ 提高分辨率**：$f_s$ 增大只扩大分析带宽，$\Delta f=f_s/N$ 反而可能变差。
> 3. **整周期截断**才能让单频信号只有一根谱线；否则必有泄漏（除非用专门的窗并做校正）。

## 用 DFT 计算线性卷积

步骤：

1. 确定线性卷积长度 $L=L_x+L_h-1$
2. 把 $x(n)$、$h(n)$ 都补零到 $L$ 点
3. 做 $L$ 点 DFT：$X(k)$、$H(k)$
4. 逐点相乘：$Y(k)=X(k)H(k)$
5. 做 $L$ 点 IDFT，得到 $y(n)=x(n)*h(n)$

$$y(n)=\mathrm{IDFT}\big[\mathrm{DFT}_L[x(n)]\cdot\mathrm{DFT}_L[h(n)]\big]$$

> [!example] 补零长度的重要性
> $x(n)$ 长 4、$h(n)$ 长 3，线性卷积长 $4+3-1=6$。
> - 做 4 点圆周卷积：尾部绕回，结果错误
> - 做 6 点圆周卷积：与线性卷积完全相同
> - 做 8 点圆周卷积：后两位补零，前 6 位仍与线性卷积相同（多补零无害）

## 实序列的频谱技巧

实序列的 DFT 有共轭对称性，因此可以用一个 $N$ 点复数 DFT 同时算两个实序列的 DFT：

设 $x_1(n),x_2(n)$ 都是实序列，构造

$$x(n)=x_1(n)+j x_2(n)$$

做 $N$ 点 DFT 得 $X(k)$，则

$$X_1(k)=\frac{X(k)+X^*((N-k))_N}{2},\qquad X_2(k)=\frac{X(k)-X^*((N-k))_N}{2j}$$

这样一次 FFT 算两个实序列，运算量减半。另一种做法是用 $N/2$ 点复数 FFT 算 $N$ 点实序列 DFT（第 4 章）。

## MATLAB

```matlab
fs = 1000; N = 256; t = (0:N-1)/fs;
x = 0.8*sin(2*pi*100*t) + 0.3*sin(2*pi*137*t);   % 137 Hz 不在 bin 上
X = fft(x);
f = (0:N-1)*fs/N;
plot(f(1:N/2), 20*log10(abs(X(1:N/2))/N*2)); grid on;
xlabel('Hz'); ylabel('dB');
% 加窗抑制泄漏
w = hamming(N)';
Xw = fft(x.*w);
hold on; plot(f(1:N/2), 20*log10(abs(Xw(1:N/2))/sum(w)*2), 'r');
% 补零只让谱线变密，不提高分辨率
Xz = fft(x, 4*N);
fz = (0:4*N-1)*fs/(4*N);
figure; plot(fz(1:2*N), abs(Xz(1:2*N)));   % 谱峰更密，但主瓣宽度不变
% 用 DFT 算线性卷积
h = [1 2 3 2 1];
L = length(x) + length(h) - 1;
y = ifft(fft(x, L) .* fft(h, L));
```

> [!tip] 本章收官
> 本章是"从连续频谱走向可计算变换"的关键一步：
> 1. **DFT 的定义**（3.1）把 DTFT 在 $N$ 个等间隔频率上采样，得到有限、可算的正反变换；
> 2. **基本性质**（3.2）把"时域圆周卷积"翻译成"频域相乘"，这是 FFT 加速卷积的全部理由；
> 3. **频率域采样**（3.3）给出对偶的另一半：频域采样 ⇒ 时域周期延拓，$N\ge M$ 才能无失真；
> 4. **应用**（3.4）把 DFT 落到频谱分析与卷积计算上，并暴露三个工程坑：泄漏、栅栏、补零不提高分辨率。
>
> 一句话：**DFT 是"有限长序列的傅里叶变换"，它的一切性质都建立在"周期为 $N$ 的圆周"上；下一章 FFT 要做的，只是把这 $N$ 点 DFT 从 $O(N^2)$ 算到 $O(N\log N)$。**

# 本章知识地图

```
离散傅里叶变换（DFT）
  ├─ 1. 定义
  │     ├── 动机：DTFT 的三个"连续"→ 有限长 + 有限频率点
  │     ├── 正变换 X(k)=Σx(n)W_N^{nk}，反变换 x(n)=1/N ΣX(k)W_N^{-nk}
  │     ├── 矩阵形式 X=Wx；W 的列正交，W⁻¹=1/N W*
  │     ├── 与 DTFT：X(k)=X(e^{j2πk/N})（频率采样）
  │     ├── 与 z 变换：X(k)=X(z)|_{z=W_N^{-k}}（单位圆采样）
  │     ├── 与 DFS：DFT = 周期序列 DFS 的主值区
  │     └── 隐含周期性：((n))_N、((k))_N
  │
  ├─ 2. 基本性质
  │     ├── 线性
  │     ├── 圆周移位 ↔ 乘 W_N^{mk}
  │     ├── 圆周卷积 ↔ 频域相乘（主定理）
  │     ├── 调制 ↔ 频域圆周移位
  │     ├── 共轭对称：实序列 X(N−k)=X*(k)
  │     ├── 帕塞瓦尔：Σ|x|² = 1/N Σ|X|²
  │     └── 对偶：X(n) ↔ N x((N−k))_N
  │
  ├─ 3. 频率域采样
  │     ├── x_N(n)=Σ x(n+rN)（时域周期延拓）
  │     ├── N≥M：无失真恢复；N<M：时域混叠
  │     ├── 频率采样定理：N ≥ M
  │     └── 内插函数：Dirichlet 核（与时域 sinc 对偶）
  │
  └─ 4. 应用
        ├── 频谱分析：f_k=kf_s/N，Δf=f_s/N=1/T₀
        ├── 泄漏：非整周期截断 + 矩形窗旁瓣
        ├── 栅栏效应：谱峰落在 bin 之间；补零不提高分辨率
        ├── 窗函数：主瓣宽度 ↔ 旁瓣电平的折中
        ├── 线性卷积：补零到 L≥L_x+L_h−1
        └── 实序列技巧：一次复数 FFT 算两个实序列
```

# 关联

- 上一章：[[vault-notes/dsp/02-z-transform-and-dtft]] —— DTFT 是连续频谱，DFT 是它的 N 点采样
- 下一章：[[vault-notes/dsp/04-fast-fourier-transform]] —— 把本章的 $O(N^2)$ 降到 $O(N\log N)$
- 全书骨架：[[vault-notes/dsp/01-discrete-time-systems]] → [[vault-notes/dsp/02-z-transform-and-dtft]] → **本章** → [[vault-notes/dsp/04-fast-fourier-transform]] → [[vault-notes/dsp/05-filter-structures]] → [[vault-notes/dsp/06-iir-filter-design]] → [[vault-notes/dsp/07-fir-filter-design]] → [[vault-notes/dsp/08-multirate-sampling]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| DFT 的 $N$ 点有限和 | [[vault-notes/dsp/04-fast-fourier-transform]] 的 DIT/DIF 分解 |
| 圆周卷积 ↔ 频域相乘 | [[vault-notes/dsp/04-fast-fourier-transform]] 的快速卷积；[[vault-notes/dsp/05-filter-structures]] 的频域实现 |
| 频率采样定理 | [[vault-notes/dsp/07-fir-filter-design]] 的频率采样设计法 |
| 频谱泄漏、窗函数 | [[vault-notes/dsp/07-fir-filter-design]] 的窗函数设计法 |
| 补零与线性卷积 | [[vault-notes/dsp/08-multirate-sampling]] 的多相滤波 |
| DFT 的隐含周期性 | [[vault-notes/dsp/08-multirate-sampling]] 的频谱搬移 |

**本章留下的三个悬念（第 4 章结清）**：

| 本章的悬念 | 第 4 章的答案 |
| --- | --- |
| $N$ 点 DFT 要 $N^2$ 次复数乘，$N=1024$ 时上百万次，太慢 | 利用 $W_N^{k+N/2}=-W_N^k$ 把 $N$ 点拆成两个 $N/2$ 点，递归下去得到 $O(N\log N)$ |
| 圆周卷积要补零到 $L$ 点，但 $L$ 很大时 DFT 仍慢 | FFT 让"补零 + FFT + 相乘 + IFFT"成为最快的卷积算法 |
| 实序列的频谱只一半有用，能否再省一半 | 实序列 FFT 的共轭对称性 + 打包技巧，运算量再减半 |

**通信方向应用**：

- [[vault-notes/5g/phy/04-physical-channels-signals]] —— OFDM 的调制/解调就是 IFFT/FFT：每个子载波上的 QAM 符号排成一个 $N$ 点向量，一次 IFFT 就变成时域 OFDM 符号；子载波间隔 $\Delta f=1/T_s$ 正是 DFT 的 bin 间隔。
- [[vault-notes/communication/06-digital-baseband]] —— 本章"圆周卷积 = 频域相乘"是频域均衡（FDE）与 OFDM 接收机的数学基础：信道卷积在频域变乘法，单抽头就能均衡。
- [[vault-notes/communication/07-digital-bandpass]]／[[vault-notes/communication/08-advanced-digital-modulation]] —— 数字下变频、频谱分析、载波频偏估计都靠 DFT/FFT；本章的泄漏与栅栏效应直接决定频谱仪和接收机的频率估计精度。
- [[vault-notes/matlab/matlab-notes]] —— `fft`/`ifft`/`fftshift`/`hamming`/`periodogram` 是本章内容的直接工具。
- [[vault-notes/math/linear-algebra/01-vector-introduction]] —— DFT 矩阵 $\mathbf{W}$ 的列是 $\mathbb{C}^N$ 的一组正交基，$X=\mathbf{W}x$ 就是"在正交基上的坐标"；帕塞瓦尔就是勾股定理的复数版本。

**相关**：[[vault-notes/dsp/02-z-transform-and-dtft]]｜[[vault-notes/dsp/04-fast-fourier-transform]]｜[[vault-notes/5g/phy/04-physical-channels-signals]]｜[[vault-notes/matlab/matlab-notes]]
