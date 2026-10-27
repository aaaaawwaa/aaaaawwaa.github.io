---
title: "拉普拉斯变换"
tags:
- 数学
- 积分变换
- 拉普拉斯变换
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
> 傅里叶变换要求绝对可积，很多工程信号（阶跃、增长指数）不满足。拉普拉斯变换用"乘衰减因子"解决这个问题，并把微分方程变成代数方程：
> - **1. 拉普拉斯变换的定义**：$F(s)=\int_0^\infty f(t)e^{-st}dt$；复频率 $s=\sigma+i\omega$；收敛域（ROC）。
> - **2. 拉普拉斯变换的性质**：时移、频移、微分、积分、卷积、初值/终值定理。
> - **3. 拉普拉斯逆变换**：部分分式、留数法、布罗姆维奇围道。
> - **4. 拉普拉斯变换的应用**：解微分方程、电路分析、系统函数与稳定性。
> - **5. 例题**：常用变换、逆变换、解 ODE。
>
> 一句话主线：**拉普拉斯变换 = 傅里叶变换 × 衰减因子 $e^{-\sigma t}$；它把 $t$ 域的微分/积分变成 $s$ 域的乘/除，把卷积变成乘法，把初值自动纳入方程——是线性系统与电路分析的万能工具。**

> [!note] 记号约定
> - $s=\sigma+i\omega$：复频率；$F(s)=\mathcal{L}[f(t)]$
> - 单边拉氏变换：$\int_{0^-}^{\infty}$；双边：$\int_{-\infty}^{\infty}$
> - ROC：收敛域（$s$ 平面上使积分收敛的区域）
> - $u(t)$：单位阶跃；$\delta(t)$：单位冲激
> - 系统函数 $H(s)=Y(s)/X(s)$（零状态）
> - 初值 $f(0^+)$；终值 $f(\infty)$

# 1. 拉普拉斯变换的定义

## 从傅里叶变换到拉普拉斯变换

傅里叶变换要求 $\int|f(t)|dt<\infty$。对 $f(t)=u(t)$、$e^{at}u(t)$（$a>0$）等信号，这个条件不满足。

**解决办法**：先乘衰减因子 $e^{-\sigma t}$（$\sigma$ 足够大），再做傅里叶变换：

$$\mathcal{F}[f(t)e^{-\sigma t}]=\int_{-\infty}^{\infty}f(t)e^{-\sigma t}e^{-i\omega t}\,\mathrm{d}t=\int_{-\infty}^{\infty}f(t)e^{-(\sigma+i\omega)t}\,\mathrm{d}t$$

令 $s=\sigma+i\omega$，就得到拉普拉斯变换。

> [!info] Def 1 拉普拉斯变换
> 设 $f(t)$ 在 $t\ge0$ 上有定义，若积分
> $$F(s)=\int_{0^-}^{\infty}f(t)e^{-st}\,\mathrm{d}t$$
> 在某个 $s$ 值下收敛，则称 $F(s)$ 为 $f(t)$ 的**拉普拉斯变换**（Laplace transform），记 $F(s)=\mathcal{L}[f(t)]$。
> 双边拉氏变换定义为 $\int_{-\infty}^{\infty}f(t)e^{-st}dt$。

> [!important] 单边 vs 双边
> - **单边**：从 $0^-$ 开始，天然适合"因果信号"和"初值问题"；微分方程求解默认用它。
> - **双边**：从 $-\infty$ 开始，适合"非因果信号"和"系统函数"的全局分析。
> 本书默认单边，除非特别说明。

## 收敛域

> [!info] Def 2 收敛域
> 使 $\int_0^\infty|f(t)|e^{-\sigma t}dt<\infty$ 的 $\sigma=\operatorname{Re}s$ 的集合，称为拉普拉斯变换的**收敛域**（region of convergence，简称 ROC）。

对单边变换，ROC 通常是**右半平面** $\operatorname{Re}s>\sigma_0$（$\sigma_0$ 为收敛横坐标）。例如：

- $f(t)=e^{-at}u(t)$：$F(s)=\frac{1}{s+a}$，ROC：$\operatorname{Re}s>-a$
- $f(t)=u(t)$：$F(s)=\frac1s$，ROC：$\operatorname{Re}s>0$
- $f(t)=e^{at}u(t)$（$a>0$）：$F(s)=\frac{1}{s-a}$，ROC：$\operatorname{Re}s>a$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 360" width="100%" style="max-width:500px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <line x1="70.0" y1="50.0" x2="450.0" y2="50.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="70.0" y1="50.0" x2="70.0" y2="300.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <text x="454.0" y="54.0" text-anchor="start" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">σ</text>
  <text x="64.0" y="294.0" text-anchor="end" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal" font-style="italic">jω</text>
  <rect x="220.0" y="50.0" width="230.0" height="250.0" fill="#2563eb" fill-opacity="0.15"/>
  <line x1="220.0" y1="50.0" x2="220.0" y2="300.0" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="6 3"/>
  <text x="214.0" y="42.0" text-anchor="end" font-size="11" fill="#2563eb" font-weight="normal">σ = σ₀</text>
  <text x="335.0" y="74.0" text-anchor="middle" font-size="12" fill="#2563eb" font-weight="normal">ROC: Re s &gt; σ₀</text>
  <path d="M 212.0,167.0 L 228.0,183.0 M 228.0,167.0 L 212.0,183.0" stroke="#dc2626" stroke-width="2"/>
  <text x="234.0" y="180.0" text-anchor="start" font-size="11" fill="#dc2626" font-weight="normal">s=−a</text>
  <text x="250.0" y="340.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">单边拉氏变换的 ROC 通常是右半平面</text>
</svg>

> [!warning] 同一个 $F(s)$ 可能对应不同的 $f(t)$
> 例如 $\frac{1}{s+a}$：
> - ROC $\operatorname{Re}s>-a$ ↔ $e^{-at}u(t)$（右边信号）
> - ROC $\operatorname{Re}s<-a$ ↔ $-e^{-at}u(-t)$（左边信号）
>
> **写 $F(s)$ 必须同时写 ROC**，否则反变换不唯一。这与 z 变换的 ROC 完全类似。

## 常用变换对

| $f(t)$（$t\ge0$） | $F(s)$ | ROC |
| --- | --- | --- |
| $\delta(t)$ | $1$ | 全平面 |
| $u(t)$ | $\frac1s$ | $\operatorname{Re}s>0$ |
| $t^n$ | $\frac{n!}{s^{n+1}}$ | $\operatorname{Re}s>0$ |
| $e^{at}$ | $\frac{1}{s-a}$ | $\operatorname{Re}s>\operatorname{Re}a$ |
| $\sin\omega_0t$ | $\frac{\omega_0}{s^2+\omega_0^2}$ | $\operatorname{Re}s>0$ |
| $\cos\omega_0t$ | $\frac{s}{s^2+\omega_0^2}$ | $\operatorname{Re}s>0$ |
| $e^{at}\sin\omega_0t$ | $\frac{\omega_0}{(s-a)^2+\omega_0^2}$ | $\operatorname{Re}s>\operatorname{Re}a$ |
| $e^{at}\cos\omega_0t$ | $\frac{s-a}{(s-a)^2+\omega_0^2}$ | $\operatorname{Re}s>\operatorname{Re}a$ |
| $t e^{at}$ | $\frac{1}{(s-a)^2}$ | $\operatorname{Re}s>\operatorname{Re}a$ |

# 2. 拉普拉斯变换的性质

## 线性与时移

$$\mathcal{L}[af(t)+bg(t)]=aF(s)+bG(s)$$

$$\mathcal{L}[f(t-t_0)u(t-t_0)]=e^{-st_0}F(s)$$

注意：时移必须配合 $u(t-t_0)$，否则会引入 $t<0$ 的部分。

## 频移

$$\mathcal{L}[e^{at}f(t)]=F(s-a)$$

## 尺度

$$\mathcal{L}[f(at)]=\frac1aF\left(\frac sa\right),\qquad a>0$$

## 微分

> [!important] 微分性质（解微分方程的核心）
> $$\mathcal{L}[f'(t)]=sF(s)-f(0^-)$$
> $$\mathcal{L}[f''(t)]=s^2F(s)-sf(0^-)-f'(0^-)$$
> $$\mathcal{L}[f^{(n)}(t)]=s^nF(s)-s^{n-1}f(0^-)-\cdots-f^{(n-1)}(0^-)$$

初值自动进入方程——这是拉氏变换比傅里叶变换更适合"初值问题"的原因。

## 积分

$$\mathcal{L}\left[\int_0^t f(\tau)\,\mathrm{d}\tau\right]=\frac{F(s)}{s}$$

$$\mathcal{L}\left[\frac{f(t)}{t}\right]=\int_s^{\infty}F(\sigma)\,\mathrm{d}\sigma$$

## 卷积

> [!important] 卷积定理
> $$\mathcal{L}[f(t)*g(t)]=F(s)G(s)$$
> $$(f*g)(t)=\int_0^t f(\tau)g(t-\tau)\,\mathrm{d}\tau$$

时域卷积 ↔ $s$ 域相乘。系统零状态响应：

$$Y(s)=H(s)X(s)$$

## 初值定理与终值定理

$$\lim_{t\to0^+}f(t)=\lim_{s\to\infty}sF(s)$$

$$\lim_{t\to\infty}f(t)=\lim_{s\to0}sF(s)$$

> [!warning] 终值定理的条件
> 终值定理要求 $sF(s)$ 在虚轴及右半平面解析（即 $F(s)$ 的极点都在左半平面，最多在 $s=0$ 有一个一阶极点）。若系统不稳定，终值不存在，公式失效。

# 3. 拉普拉斯逆变换

> [!info] Def 3 拉普拉斯逆变换
> $$f(t)=\mathcal{L}^{-1}[F(s)]=\frac{1}{2\pi i}\int_{\sigma-i\infty}^{\sigma+i\infty}F(s)e^{st}\,\mathrm{d}s$$
> 积分沿 ROC 内一条竖直线（布罗姆维奇围道）。

**工程上很少直接用围道积分**，而是用以下两种方法：

## 部分分式法

设 $F(s)=\dfrac{P(s)}{Q(s)}$ 为有理函数，先因式分解 $Q(s)$，再拆成简单分式。

**三种情况**：

1. **单实极点**：$\dfrac{A}{s-s_0}\leftrightarrow Ae^{s_0t}$
2. **共轭复极点**：配成 $\dfrac{s-a}{(s-a)^2+\omega^2}$、$\dfrac{\omega}{(s-a)^2+\omega^2}$，对应 $e^{at}\cos\omega t$、$e^{at}\sin\omega t$
3. **重极点**：$\dfrac{A}{(s-s_0)^m}\leftrightarrow A\dfrac{t^{m-1}}{(m-1)!}e^{s_0t}$

> [!example] 部分分式
> $$F(s)=\frac{1}{(s+1)(s+2)}=\frac{1}{s+1}-\frac{1}{s+2}$$
> $$f(t)=e^{-t}-e^{-2t},\qquad t\ge0$$

## 留数法

$$f(t)=\sum_{\text{所有极点}}\operatorname{Res}\left[F(s)e^{st},s_k\right],\qquad t>0$$

- 简单极点：$\operatorname{Res}=\lim_{s\to s_k}(s-s_k)F(s)e^{st}$
- $m$ 阶极点：$\operatorname{Res}=\frac{1}{(m-1)!}\lim\dfrac{d^{m-1}}{ds^{m-1}}[(s-s_k)^mF(s)e^{st}]$

## MATLAB

```matlab
% 符号拉氏变换/逆变换
syms t s
F = laplace(exp(-2*t)*sin(3*t), t, s);
f = ilaplace(1/(s^2+2*s+5), s, t);
% 部分分式
[b,a] = residue([1], [1 3 2]);   % 1/(s^2+3s+2)
```

# 4. 拉普拉斯变换的应用

## 解线性常系数微分方程

**步骤**：

1. 对方程两边取拉氏变换（用微分性质，初值自动带入）
2. 解出 $Y(s)$
3. 部分分式/留数求逆变换

> [!example] 解一阶 ODE
> $$y'+2y=e^{-t},\qquad y(0)=1$$
> 取拉氏变换：
> $$sY(s)-1+2Y(s)=\frac{1}{s+1}$$
> $$Y(s)=\frac{1}{s+2}\left(1+\frac{1}{s+1}\right)=\frac{s+2}{(s+1)(s+2)}=\frac{1}{s+1}$$
> $$y(t)=e^{-t},\qquad t\ge0$$

> [!example] 解二阶 ODE
> $$y''+3y'+2y=0,\qquad y(0)=1,\ y'(0)=0$$
> $$s^2Y-s-0+3(sY-1)+2Y=0$$
> $$(s^2+3s+2)Y=s+3$$
> $$Y=\frac{s+3}{(s+1)(s+2)}=\frac{2}{s+1}-\frac{1}{s+2}$$
> $$y(t)=2e^{-t}-e^{-2t},\qquad t\ge0$$

## 电路分析

- 电阻：$V(s)=RI(s)$
- 电感：$V(s)=sLI(s)-Li(0^-)$
- 电容：$V(s)=\frac{1}{sC}I(s)+\frac{v(0^-)}{s}$

把电路变成 $s$ 域的代数网络，解出 $I(s)$/ $V(s)$，再逆变换。

## 系统函数与稳定性

> [!info] Def 4 系统函数
> 零状态下
> $$H(s)=\frac{Y(s)}{X(s)}$$
> 称为**系统函数**（系统函数/传递函数）。

- $H(s)$ 的极点决定系统的自然响应
- **稳定** ⇔ $H(s)$ 的所有极点都在左半平面（$\operatorname{Re}s<0$）
- 虚轴上的单极点 → 临界稳定（振荡）；右半平面极点 → 不稳定

> [!tip] 与 z 变换的对应
> 连续系统：$s$ 左半平面 ↔ 稳定；离散系统：$z$ 单位圆内 ↔ 稳定。双线性变换 $s=\frac{2}{T}\frac{1-z^{-1}}{1+z^{-1}}$ 把左半平面映到单位圆内（第 6 章的分式线性映射）。

# 5. 例题

> [!example] 例 1：常用变换
> 求 $\mathcal{L}[t^2e^{-3t}]$。
> $\mathcal{L}[t^2]=\frac{2}{s^3}$，频移 $a=-3$：
> $$\mathcal{L}[t^2e^{-3t}]=\frac{2}{(s+3)^3}$$

> [!example] 例 2：逆变换
> 求 $F(s)=\dfrac{s+3}{s^2+4s+13}$ 的逆变换。
> 配方：$s^2+4s+13=(s+2)^2+3^2$。
> $$F(s)=\frac{(s+2)+1}{(s+2)^2+3^2}=\frac{s+2}{(s+2)^2+9}+\frac13\cdot\frac{3}{(s+2)^2+9}$$
> $$f(t)=e^{-2t}\cos3t+\frac13e^{-2t}\sin3t,\qquad t\ge0$$

> [!example] 例 3：重极点
> 求 $F(s)=\dfrac{1}{s(s+1)^2}$ 的逆变换。
> 部分分式：
> $$F(s)=\frac{1}{s}-\frac{1}{s+1}-\frac{1}{(s+1)^2}$$
> $$f(t)=1-e^{-t}-te^{-t},\qquad t\ge0$$

> [!example] 例 4：初值/终值
> $F(s)=\dfrac{2s+3}{s^2+3s+2}$。求 $f(0^+)$ 与 $f(\infty)$。
> $$f(0^+)=\lim_{s\to\infty}sF(s)=\lim_{s\to\infty}\frac{2s^2+3s}{s^2+3s+2}=2$$
> $$f(\infty)=\lim_{s\to0}sF(s)=\lim_{s\to0}\frac{2s^2+3s}{s^2+3s+2}=0$$
> 极点 $-1,-2$ 都在左半平面，终值存在。

> [!example] 例 5：RLC 电路
> RLC 串联，输入 $u(t)$，$R=2$、$L=1$、$C=1$，零初值。求电容电压。
> $$V_C(s)=\frac{1}{s}\cdot\frac{1}{s^2+2s+1}=\frac{1}{s(s+1)^2}$$
> 同例 3：
> $$v_C(t)=1-e^{-t}-te^{-t},\qquad t\ge0$$

> [!tip] 本章收官
> 第 8 章把傅里叶变换"带收敛因子"推广：
> 1. **定义**（1）：$F(s)=\int_0^\infty f e^{-st}dt$；$s=\sigma+i\omega$；ROC。
> 2. **性质**（2）：微分 → 乘 $s$、积分 → 除 $s$、卷积 → 乘法；初值/终值定理。
> 3. **逆变换**（3）：部分分式、留数法。
> 4. **应用**（4）：解 ODE、电路分析、系统函数与稳定性。
>
> 一句话：**拉氏变换把"微分方程"变成"代数方程"、把"卷积"变成"乘法"、把"稳定性"变成"极点位置"；它是连续时间系统分析的万能工具。下一章转向场论——向量场的微分与积分。**

# 本章知识地图

```
拉普拉斯变换
├─ 1. 定义
│     ├─ F(s)=∫₀^∞f(t)e^{−st}dt
│     ├─ s=σ+iω；ROC：Re s>σ₀
│     ├─ 单边 vs 双边
│     ├─ 常用变换对
│     └─ ROC 必须写
│
├─ 2. 性质
│     ├─ 线性、时移、频移、尺度
│     ├─ 微分：L[f']=sF−f(0)
│     ├─ 积分：L[∫f]=F/s
│     ├─ 卷积：L[f*g]=FG
│     ├─ 初值：f(0+)=lim sF
│     └─ 终值：f(∞)=lim sF
│
├─ 3. 逆变换
│     ├─ 布罗姆维奇围道
│     ├─ 部分分式：单极点/共轭复极点/重极点
│     └─ 留数法
│
├─ 4. 应用
│     ├─ 解线性 ODE
│     ├─ 电路：R/L/C 的 s 域模型
│     ├─ 系统函数 H(s)=Y/X
│     └─ 稳定性：极点全在左半平面
│
└─ 5. 例题
      ├─ 常用变换
      ├─ 逆变换
      ├─ 初值/终值
      └─ RLC 电路
```

# 关联

- 上一章：[[vault-notes/math/complex-analysis/07-fourier-transform]]
- 下一章：[[vault-notes/math/complex-analysis/09-field-theory-basics]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 复频率 $s=\sigma+i\omega$ | [[vault-notes/dsp/02-z-transform-and-dtft]] 的 $z=e^{sT}$ |
| ROC、极点 | [[vault-notes/dsp/06-iir-filter-design]] 的稳定性 |
| 部分分式/留数 | [[vault-notes/math/complex-analysis/05-residues-applications]] 的留数计算 |
| 系统函数 $H(s)$ | [[vault-notes/dsp/05-filter-structures]] 的实现；[[vault-notes/communication/06-digital-baseband]] 的频域响应 |
| 微分性质 | 微分方程求解；[[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] 的拉普拉斯方程 |

**本章留下的三个悬念（第 9 章结清）**：

| 本章的悬念 | 第 9 章的答案 |
| --- | --- |
| 场论里的"梯度、散度、旋度"到底是什么？ | 向量微分算子：梯度作用于标量场，散度/旋度作用于向量场 |
| 为什么保守场可以引入势函数？ | 无旋场（旋度为 0）⇒ 存在标量势 |
| 高斯定理、斯托克斯定理与复积分有什么关系？ | 都是"边界积分 = 内部微分"的统一框架 |

**通信方向应用**：

- [[vault-notes/dsp/02-z-transform-and-dtft]] —— 拉氏变换的离散版本是 z 变换；$z=e^{sT}$。
- [[vault-notes/dsp/06-iir-filter-design]] —— 双线性变换把 $s$ 域原型映到 $z$ 域；稳定性由极点位置判断。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 系统函数、频率响应、稳定性分析。
- [[vault-notes/math/complex-analysis/09-field-theory-basics]] —— 拉普拉斯方程、泊松方程是场论的核心方程。
- [[vault-notes/matlab/matlab-notes]] —— `laplace`/`ilaplace`/`residue`/`tf`/`bode` 是本章的直接工具。

**相关**：[[vault-notes/math/complex-analysis/07-fourier-transform]]｜[[vault-notes/math/complex-analysis/09-field-theory-basics]]｜[[vault-notes/dsp/06-iir-filter-design]]｜[[vault-notes/matlab/matlab-notes]]
