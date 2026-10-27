---
title: "留数及其应用"
tags:
- 数学
- 复变函数
- 留数
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
> 第 4 章的洛朗级数里，系数 $c_{-1}$ 特别重要。本章把它单独提出来，称为**留数**，并用它解决一大类积分：
> - **1. 孤立奇点与留数**：留数的定义、留数定理；极点留数的计算。
> - **2. 留数的计算**：简单极点、$m$ 阶极点、无穷远点。
> - **3. 留数的应用**：有理函数积分、三角函数积分、无穷积分、约当引理、实轴上有奇点的积分。
> - **4. 例题**：各类实积分的标准套路。
>
> 一句话主线：**留数就是洛朗级数的 $c_{-1}$；留数定理说"围道积分 = $2\pi i$ 乘以内部所有留数之和"；于是实积分问题被翻译成"找奇点、算留数"的代数问题。**

> [!note] 记号约定
> - $\operatorname{Res}[f,z_0]$：$f$ 在 $z_0$ 的留数
> - $C$：逆时针简单闭曲线；$C$ 内部有有限个孤立奇点
> - 简单极点：一阶极点；$m$ 阶极点：$(z-z_0)^{-m}$ 型
> - $\operatorname{Res}[f,\infty]$：$f$ 在无穷远点的留数
> - 约当引理（Jordan lemma）：大圆弧上 $|e^{iaz}f(z)|\to0$ 的条件

# 1. 孤立奇点与留数

## 留数的定义

> [!info] Def 1 留数
> 设 $z_0$ 是 $f(z)$ 的孤立奇点，$f$ 在 $0<|z-z_0|<R$ 内的洛朗展开为
> $$f(z)=\sum_{n=-\infty}^{\infty}c_n(z-z_0)^n$$
> 则称 $c_{-1}$ 为 $f$ 在 $z_0$ 的**留数**（residue），记
> $$\operatorname{Res}[f,z_0]=c_{-1}=\frac{1}{2\pi i}\oint_C f(z)\,\mathrm{d}z$$
> 其中 $C$ 是绕 $z_0$ 的任意小逆时针闭曲线。

## 留数定理

> [!info] Def 2 留数定理
> 设 $f(z)$ 在简单闭曲线 $C$ 及其内部除有限个孤立奇点 $z_1,\dots,z_n$ 外解析，则
> $$\oint_C f(z)\,\mathrm{d}z=2\pi i\sum_{k=1}^n\operatorname{Res}[f,z_k]$$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 360" width="100%" style="max-width:620px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <circle cx="300.0" cy="180.0" r="130.0" fill="none" stroke="#2563eb" stroke-width="2.2"/>
  <text x="435.0" y="100.0" text-anchor="start" font-size="14" fill="#2563eb" font-weight="600">C</text>
  <circle cx="250.0" cy="200.0" r="4.0" fill="#dc2626" stroke="#dc2626" stroke-width="1.0"/>
  <text x="258.0" y="196.0" text-anchor="start" font-size="11" fill="#dc2626" font-weight="normal">z₁</text>
  <circle cx="340.0" cy="160.0" r="4.0" fill="#dc2626" stroke="#dc2626" stroke-width="1.0"/>
  <text x="348.0" y="156.0" text-anchor="start" font-size="11" fill="#dc2626" font-weight="normal">z₂</text>
  <circle cx="450.0" cy="240.0" r="4.0" fill="var(--text-muted,#57606a)" stroke="var(--text-muted,#57606a)" stroke-width="1.0"/>
  <text x="458.0" y="236.0" text-anchor="start" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">z₃（外部）</text>
  <text x="300.0" y="330.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">∮_C f dz = 2πi(Res[f,z₁]+Res[f,z₂])；z₃ 不计</text>
</svg>

> [!important] 留数定理的威力
> 它把**围道积分**化为**有限个代数计算**：
> 1. 找出 $C$ 内部的所有奇点
> 2. 逐个算留数
> 3. 相加乘 $2\pi i$
>
> 不需要参数化曲线，不需要算原函数。这是复分析最实用的工具。

> [!warning] 只算内部的奇点
> 外部的奇点不计入。若奇点在 $C$ 上，公式不适用（需要"半留数"或挖去小半圆，见第 3 节）。

# 2. 留数的计算

## 简单极点

若 $z_0$ 是**一阶极点**，则

$$\operatorname{Res}[f,z_0]=\lim_{z\to z_0}(z-z_0)f(z)$$

若 $f(z)=\dfrac{P(z)}{Q(z)}$，$P(z_0)\ne0$，$Q(z_0)=0$，$Q'(z_0)\ne0$（简单极点），则

$$\operatorname{Res}[f,z_0]=\frac{P(z_0)}{Q'(z_0)}$$

> [!example] 简单极点
> $f(z)=\dfrac{e^z}{z-1}$，$z_0=1$：
> $$\operatorname{Res}[f,1]=\lim_{z\to1}(z-1)\frac{e^z}{z-1}=e$$

## m 阶极点

若 $z_0$ 是 **$m$ 阶极点**，则

$$\operatorname{Res}[f,z_0]=\frac{1}{(m-1)!}\lim_{z\to z_0}\frac{\mathrm{d}^{m-1}}{\mathrm{d}z^{m-1}}\left[(z-z_0)^mf(z)\right]$$

> [!example] 二阶极点
> $f(z)=\dfrac{e^z}{(z-1)^2}$，$z_0=1$ 是二阶极点：
> $$\operatorname{Res}[f,1]=\frac{1}{1!}\lim_{z\to1}\frac{\mathrm{d}}{\mathrm{d}z}e^z=e$$

## 本性奇点

若 $z_0$ 是本性奇点，没有通用公式，只能**展开洛朗级数取 $c_{-1}$**。

> [!example] 本性奇点
> $f(z)=e^{1/z}$ 在 $z=0$：
> $$e^{1/z}=1+\frac1z+\frac{1}{2!z^2}+\cdots$$
> $c_{-1}=1$，故 $\operatorname{Res}[f,0]=1$。

## 无穷远点的留数

> [!info] Def 3 无穷远点的留数
> 设 $f$ 在 $R<|z|<\infty$ 内解析，定义
> $$\operatorname{Res}[f,\infty]=-\frac{1}{2\pi i}\oint_{|z|=R}f(z)\,\mathrm{d}z$$
> 即 $f$ 在 $\infty$ 处洛朗展开中 $z^{-1}$ 系数的**相反数**。

**留数定理的全局形式**：

$$\sum_{k}\operatorname{Res}[f,z_k]+\operatorname{Res}[f,\infty]=0$$

即**所有有限奇点的留数之和 + 无穷远点的留数 = 0**。当有限奇点很多、而无穷远点容易算时，这条性质很好用。

> [!example] 用无穷远点留数
> $f(z)=\dfrac{1}{z(z-1)}$。有限奇点 $0,1$ 的留数分别为 $-1,1$，和为 0，故 $\operatorname{Res}[f,\infty]=0$。

# 3. 留数的应用

## 三角函数有理式的积分

$$I=\int_0^{2\pi}R(\cos\theta,\sin\theta)\,\mathrm{d}\theta$$

令 $z=e^{i\theta}$，则

$$\cos\theta=\frac{z+z^{-1}}{2},\qquad \sin\theta=\frac{z-z^{-1}}{2i},\qquad \mathrm{d}\theta=\frac{\mathrm{d}z}{iz}$$

积分化为单位圆上的围道积分：

$$I=\oint_{|z|=1}R\left(\frac{z+z^{-1}}{2},\frac{z-z^{-1}}{2i}\right)\frac{\mathrm{d}z}{iz}=2\pi i\sum_{|z_k|<1}\operatorname{Res}$$

> [!example] 三角函数积分
> $$I=\int_0^{2\pi}\frac{\mathrm{d}\theta}{2+\cos\theta}$$
> 令 $z=e^{i\theta}$：
> $$I=\oint_{|z|=1}\frac{1}{2+(z+z^{-1})/2}\frac{\mathrm{d}z}{iz}=\frac{2}{i}\oint_{|z|=1}\frac{\mathrm{d}z}{z^2+4z+1}$$
> 分母零点 $z=-2\pm\sqrt3$，只有 $-2+\sqrt3$ 在单位圆内。
> $$\operatorname{Res}\left[\frac{2}{i}\frac{1}{z^2+4z+1},-2+\sqrt3\right]=\frac{2}{i}\frac{1}{2(-2+\sqrt3)+4}=\frac{1}{i\sqrt3}$$
> $$I=2\pi i\cdot\frac{1}{i\sqrt3}=\frac{2\pi}{\sqrt3}$$

## 有理函数的无穷积分

$$I=\int_{-\infty}^{\infty}\frac{P(x)}{Q(x)}\,\mathrm{d}x$$

**条件**：$Q$ 无实零点，$\deg Q\ge\deg P+2$。

**方法**：取上半平面大围道（实轴 $[-R,R]$ + 上半大圆弧），令 $R\to\infty$。大圆弧上积分趋于 0，故

$$I=2\pi i\sum_{\operatorname{Im}z_k>0}\operatorname{Res}\left[\frac{P(z)}{Q(z)},z_k\right]$$

> [!example] 有理函数积分
> $$I=\int_{-\infty}^{\infty}\frac{\mathrm{d}x}{x^2+1}$$
> 上半平面奇点 $z=i$（简单极点）：
> $$\operatorname{Res}\left[\frac{1}{z^2+1},i\right]=\frac{1}{2i}$$
> $$I=2\pi i\cdot\frac{1}{2i}=\pi$$

## 含 $e^{iax}$ 的积分与约当引理

$$I=\int_{-\infty}^{\infty}\frac{P(x)}{Q(x)}e^{iax}\,\mathrm{d}x,\qquad a>0$$

**约当引理**：若 $|f(z)|\to0$（$|z|\to\infty$，上半平面），则大圆弧上 $\int f(z)e^{iaz}\mathrm{d}z\to0$。于是

$$I=2\pi i\sum_{\operatorname{Im}z_k>0}\operatorname{Res}\left[\frac{P(z)}{Q(z)}e^{iaz},z_k\right]$$

> [!example] 含指数的积分
> $$I=\int_{-\infty}^{\infty}\frac{e^{ix}}{x^2+1}\,\mathrm{d}x$$
> 上半平面奇点 $z=i$：
> $$\operatorname{Res}\left[\frac{e^{iz}}{z^2+1},i\right]=\frac{e^{-1}}{2i}$$
> $$I=2\pi i\cdot\frac{e^{-1}}{2i}=\frac{\pi}{e}$$

## 实轴上有奇点：挖去小半圆

若 $f$ 在实轴上有简单极点 $x_0$，取**挖去小半圆**的围道（上半平面）。小半圆上的积分趋于 $-i\pi\operatorname{Res}[f,x_0]$（逆时针绕行），故

$$\mathrm{PV}\int_{-\infty}^{\infty}f(x)\,\mathrm{d}x=2\pi i\sum_{\text{上半}}\operatorname{Res}+i\pi\sum_{\text{实轴}}\operatorname{Res}$$

其中 PV 表示**柯西主值**。

> [!example] 实轴上有奇点
> $$\mathrm{PV}\int_{-\infty}^{\infty}\frac{\sin x}{x}\,\mathrm{d}x$$
> 被积函数 $\frac{\sin x}{x}$ 在 $x=0$ 可去；但用 $\frac{e^{iz}}{z}$ 时 $z=0$ 是简单极点，留数 1。
> 上半平面无奇点，实轴奇点贡献 $i\pi\cdot1$，故
> $$\mathrm{PV}\int\frac{e^{ix}}{x}\,\mathrm{d}x=i\pi\ \Longrightarrow\ \int_{-\infty}^{\infty}\frac{\sin x}{x}\,\mathrm{d}x=\pi$$

## 应用套路总结

| 积分类型 | 变换/围道 | 公式 |
| --- | --- | --- |
| $\int_0^{2\pi}R(\cos\theta,\sin\theta)d\theta$ | $z=e^{i\theta}$，单位圆 | $2\pi i\sum_{\lvert z\rvert<1}\operatorname{Res}$ |
| $\int_{-\infty}^{\infty}P/Q\,dx$ | 上半大围道 | $2\pi i\sum_{\operatorname{Im}>0}\operatorname{Res}$ |
| $\int P/Q\,e^{iax}dx$ | 上半大围道 + 约当引理 | $2\pi i\sum_{\operatorname{Im}>0}\operatorname{Res}$ |
| 实轴有简单极点 | 挖小半圆 | 主值 + $i\pi\sum_{\text{实轴}}\operatorname{Res}$ |

# 4. 例题

> [!example] 例 1：简单极点留数
> $f(z)=\dfrac{z}{z^2+1}$，求 $z=\pm i$ 的留数。
> $$\operatorname{Res}[f,i]=\lim_{z\to i}(z-i)\frac{z}{(z-i)(z+i)}=\frac{i}{2i}=\frac12$$
> $$\operatorname{Res}[f,-i]=\frac{-i}{-2i}=\frac12$$

> [!example] 例 2：三阶极点
> $f(z)=\dfrac{1}{z(z-1)^3}$，求 $z=1$ 的留数。
> $m=3$：
> $$\operatorname{Res}[f,1]=\frac{1}{2!}\lim_{z\to1}\frac{\mathrm{d}^2}{\mathrm{d}z^2}\left[\frac{1}{z}\right]=\frac12\cdot\frac{2}{1^3}=1$$

> [!example] 例 3：围道积分
> $$\oint_{|z|=2}\frac{z^2}{z^2+1}\,\mathrm{d}z$$
> 奇点 $\pm i$ 都在圆内，均为简单极点。
> $$\operatorname{Res}[f,i]=\frac{i^2}{2i}=\frac{i}{2},\qquad \operatorname{Res}[f,-i]=\frac{(-i)^2}{-2i}=\frac{i}{2}$$
> 和为 $i$，故积分 $=2\pi i\cdot i=-2\pi$。

> [!example] 例 4：有理函数积分
> $$\int_{-\infty}^{\infty}\frac{\mathrm{d}x}{(x^2+1)^2}$$
> 上半平面 $z=i$ 是二阶极点：
> $$f(z)=\frac{1}{(z-i)^2(z+i)^2}$$
> $$\operatorname{Res}[f,i]=\lim_{z\to i}\frac{\mathrm{d}}{\mathrm{d}z}\frac{1}{(z+i)^2}=\frac{-2}{(2i)^3}=\frac{-2}{-8i}=\frac{1}{4i}$$
> $$I=2\pi i\cdot\frac{1}{4i}=\frac{\pi}{2}$$

> [!example] 例 5：含指数的积分
> $$\int_0^{\infty}\frac{\cos ax}{x^2+1}\,\mathrm{d}x,\qquad a>0$$
> 由偶性，$I=\frac12\int_{-\infty}^{\infty}\frac{e^{iax}}{x^2+1}dx$。
> 上半平面奇点 $i$：
> $$\operatorname{Res}\left[\frac{e^{iaz}}{z^2+1},i\right]=\frac{e^{-a}}{2i}$$
> $$I=\frac12\cdot2\pi i\cdot\frac{e^{-a}}{2i}=\frac{\pi}{2}e^{-a}$$

> [!tip] 本章收官
> 第 5 章把洛朗级数的 $c_{-1}$ 变成解决积分的利器：
> 1. **留数**（1）：$c_{-1}$；留数定理：围道积分 = $2\pi i$ 乘内部留数之和。
> 2. **计算**（2）：简单极点、$m$ 阶极点、本性奇点（展开）、无穷远点。
> 3. **应用**（3）：三角函数积分、有理函数积分、含 $e^{iaz}$ 的积分、实轴奇点的主值。
> 4. **套路**（3）：找奇点 → 算留数 → 乘 $2\pi i$。
>
> 一句话：**留数定理把"积分"变成"代数"；它不仅是复分析的核心工具，也是逆 z 变换、逆拉氏变换、场论多极展开的共同基础。下一章研究保角映射——解析函数的几何侧面。**

# 本章知识地图

```
留数及其应用
├─ 1. 孤立奇点与留数
│     ├─ 留数 = 洛朗系数 c₋₁
│     ├─ Res[f,z₀]=1/(2πi)∮f dz
│     ├─ 留数定理：∮_C f dz=2πiΣRes
│     └─ 只算 C 内部的奇点
│
├─ 2. 留数计算
│     ├─ 简单极点：lim(z−z₀)f
│     ├─ 简单极点（P/Q）：P(z₀)/Q'(z₀)
│     ├─ m 阶极点：1/(m−1)!·lim d^{m−1}[(z−z₀)^m f]
│     ├─ 本性奇点：洛朗展开取 c₋₁
│     └─ 无穷远点：−c₋₁；所有留数之和为 0
│
├─ 3. 应用
│     ├─ 三角函数：z=e^{iθ}，单位圆
│     ├─ 有理函数：上半大围道，2πiΣRes
│     ├─ 含 e^{iaz}：约当引理
│     ├─ 实轴奇点：挖小半圆，主值 + iπΣRes
│     └─ 套路：找奇点 → 算留数 → 乘 2πi
│
└─ 4. 例题
      ├─ 极点留数
      ├─ 围道积分
      ├─ 有理函数积分
      └─ 含指数积分
```

# 关联

- 上一章：[[vault-notes/math/complex-analysis/04-series-representation]]
- 下一章：[[vault-notes/math/complex-analysis/06-conformal-mapping]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 留数定理 | [[vault-notes/math/complex-analysis/08-laplace-transform]] 的逆变换；逆 z 变换 |
| 极点留数公式 | [[vault-notes/math/complex-analysis/08-laplace-transform]] 的部分分式展开 |
| 本性奇点 | 皮卡定理；洛朗展开 |
| 约当引理 | 傅里叶变换的围道计算；[[vault-notes/math/complex-analysis/07-fourier-transform]] |
| 多极展开 | [[vault-notes/math/complex-analysis/09-field-theory-basics]] 的电偶极子/多极子 |

**本章留下的两个悬念（第 6 章结清）**：

| 本章的悬念 | 第 6 章的答案 |
| --- | --- |
| 解析函数作为映射有什么几何性质？ | 保角性：解析且导数非零处保持角度 |
| 能不能把复杂区域映射成简单区域？ | 分式线性映射与初等映射；黎曼映射定理 |

**通信方向应用**：

- [[vault-notes/dsp/02-z-transform-and-dtft]] —— 逆 z 变换是围道积分，用留数计算。
- [[vault-notes/math/complex-analysis/08-laplace-transform]] —— 逆拉氏变换用留数/部分分式；极点位置决定系统稳定性。
- [[vault-notes/math/complex-analysis/07-fourier-transform]] —— 含 $e^{i\omega t}$ 的积分用约当引理与留数。
- [[vault-notes/math/complex-analysis/09-field-theory-basics]] —— 多极展开、格林函数的留数表示。
- [[vault-notes/matlab/matlab-notes]] —— `residue` 做部分分式；符号积分验证留数结果。

**相关**：[[vault-notes/math/complex-analysis/04-series-representation]]｜[[vault-notes/math/complex-analysis/06-conformal-mapping]]｜[[vault-notes/math/complex-analysis/08-laplace-transform]]｜[[vault-notes/matlab/matlab-notes]]
