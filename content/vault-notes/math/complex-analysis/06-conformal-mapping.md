---
title: "保角映射"
tags:
- 数学
- 复变函数
- 保角映射
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
> 前几章把复变函数当作"数到数"的映射；本章研究它的**几何侧面**：
> - **1. 保角映射的概念**：解析且导数非零的映射保持角度不变；伸缩率与旋转角。
> - **2. 分式线性映射**：$w=\frac{az+b}{cz+d}$；把圆/直线映成圆/直线；交比与三点定映射。
> - **3. 初等映射**：幂、指数、对数、儒可夫斯基变换；把常见区域互相映射。
> - **4. 例题**：上半平面 ↔ 单位圆、带域 ↔ 半平面、儒可夫斯基映射。
>
> 一句话主线：**保角映射是"局部不改变角度"的解析映射；分式线性映射把圆/直线类保持住，是区域映射的主力；初等映射则提供"把角域、带域、圆外区域拉直"的工具。**

> [!note] 记号约定
> - $w=f(z)$：把 $z$ 平面区域 $D$ 映到 $w$ 平面区域 $G$
> - 保角：在 $z_0$ 处解析且 $f'(z_0)\ne0$
> - 伸缩率：$|f'(z_0)|$；旋转角：$\arg f'(z_0)$
> - 分式线性映射（Möbius 变换）：$w=\dfrac{az+b}{cz+d}$，$ad-bc\ne0$
> - 交比：$(z_1,z_2;z_3,z_4)$
> - 儒可夫斯基变换：$w=z+\dfrac1z$

# 1. 保角映射的概念

## 保角性

> [!info] Def 1 保角映射
> 若 $w=f(z)$ 在 $z_0$ 解析且 $f'(z_0)\ne0$，则 $f$ 在 $z_0$ 处**保角**（conformal）：过 $z_0$ 的任意两条曲线，其夹角在映射后**大小和方向都不变**。

**局部行为**：

$$f(z)-f(z_0)\approx f'(z_0)(z-z_0)$$

- 模：$|f(z)-f(z_0)|\approx|f'(z_0)|\,|z-z_0|$ → **伸缩率** $|f'(z_0)|$
- 辐角：$\arg[f(z)-f(z_0)]\approx\arg f'(z_0)+\arg(z-z_0)$ → **旋转角** $\arg f'(z_0)$

即局部看，解析映射就是"**旋转 + 伸缩**"（相似变换），所以角度不变。

> [!important] 保角的条件
> 1. $f$ 在 $z_0$ 解析
> 2. $f'(z_0)\ne0$
>
> 若 $f'(z_0)=0$，角度会发生变化。例如 $w=z^2$ 在 $z=0$ 处把角放大 2 倍（不是保角）。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 330" width="100%" style="max-width:720px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <line x1="60.0" y1="190.0" x2="330.0" y2="190.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <line x1="195.0" y1="40.0" x2="195.0" y2="260.0" stroke="var(--text-muted,#57606a)" stroke-width="1.2"/>
  <polygon points="60.0,190.0 330.0,190.0 330.0,40.0 60.0,40.0" fill="#2563eb" fill-opacity="0.12" stroke="none"/>
  <text x="80.0" y="70.0" text-anchor="start" font-size="12" fill="#2563eb" font-weight="normal">Im z &gt; 0</text>
  <circle cx="195.0" cy="120.0" r="4.0" fill="#dc2626" stroke="#dc2626" stroke-width="1.0"/>
  <text x="203.0" y="116.0" text-anchor="start" font-size="11" fill="#dc2626" font-weight="normal">i</text>
  <text x="195.0" y="300.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">上半平面</text>
  <circle cx="560.0" cy="150.0" r="90.0" fill="none" stroke="var(--text-accent,#705dcf)" stroke-width="1.8"/>
  <line x1="450.0" y1="150.0" x2="670.0" y2="150.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <line x1="560.0" y1="40.0" x2="560.0" y2="260.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <circle cx="560.0" cy="150.0" r="4.0" fill="#dc2626" stroke="#dc2626" stroke-width="1.0"/>
  <text x="568.0" y="144.0" text-anchor="start" font-size="11" fill="#dc2626" font-weight="normal">0</text>
  <text x="560.0" y="300.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">单位圆 |w|&lt;1</text>
  <line x1="345.0" y1="150.0" x2="395.0" y2="150.0" stroke="var(--text-muted,#57606a)" stroke-width="1.6" marker-end="url(#ar)"/>
  <text x="370.0" y="135.0" text-anchor="middle" font-size="12" fill="var(--text-accent,#705dcf)" font-weight="normal">w=(z−i)/(z+i)</text>
  <text x="360.0" y="320.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">分式线性映射：实轴 → 单位圆，上半平面 → 圆内</text>
</svg>

## 保角映射与区域映射

若 $f$ 在区域 $D$ 内单叶解析（一一对应）且 $f'\ne0$，则 $f$ 把 $D$ **保角地**映成 $G=f(D)$。此时：

- 边界对应边界（方向保持）
- 区域内部对应内部
- 逆映射 $f^{-1}$ 也解析

**黎曼映射定理**：任何单连通非空真区域（不是整个 $\mathbb{C}$）都可以保角映射成单位圆盘。这是存在性定理；具体映射需要构造。

# 2. 分式线性映射

## 定义与基本性质

> [!info] Def 2 分式线性映射
> $$w=\frac{az+b}{cz+d},\qquad ad-bc\ne0$$
> 称为**分式线性映射**（fractional linear transformation），也称 **Möbius 变换**。

**四条基本性质**：

1. **一一对应**：逆映射仍是分式线性映射
   $$z=\frac{-dw+b}{cw-a}$$
2. **复合封闭**：两个分式线性映射的复合仍是分式线性映射
3. **保圆性**：把**圆或直线**映成**圆或直线**（直线看作过无穷远点的圆）
4. **保交比**：交比在映射下不变

> [!info] Def 3 交比
> 四个点 $z_1,z_2,z_3,z_4$ 的**交比**（cross-ratio）为
> $$(z_1,z_2;z_3,z_4)=\frac{(z_1-z_3)(z_2-z_4)}{(z_1-z_4)(z_2-z_3)}$$
> 分式线性映射保持交比不变：
> $$(w_1,w_2;w_3,w_4)=(z_1,z_2;z_3,z_4)$$

## 三类基本映射

任何分式线性映射都可以分解为三种基本映射的复合：

| 类型 | 形式 | 几何效果 |
| --- | --- | --- |
| 平移 | $w=z+b$ | 平移 |
| 旋转 + 伸缩 | $w=az$ | 旋转 $\arg a$、伸缩 $\lvert a\rvert$ |
| 反演 | $w=1/z$ | 关于单位圆反演 + 关于实轴反射 |

> [!example] 反演映射
> $w=1/z$：$z=re^{i\theta}$ → $w=\frac1r e^{-i\theta}$。
> 单位圆内 ↔ 单位圆外；单位圆上的点不动（模不变，辐角取反）。
> 圆心 $z=0$ 映到 $w=\infty$。

## 三点定映射

分式线性映射由**三对对应点**唯一确定：

$$\frac{w-w_1}{w-w_2}\cdot\frac{w_3-w_2}{w_3-w_1}=\frac{z-z_1}{z-z_2}\cdot\frac{z_3-z_2}{z_3-z_1}$$

> [!example] 上半平面 → 单位圆
> 把上半平面 $\operatorname{Im}z>0$ 映成单位圆 $|w|<1$，且 $z=i$ 映到 $w=0$。
> 取 $z_1=0\mapsto w_1=1$，$z_2=1\mapsto w_2=-1$，$z_3=i\mapsto w_3=0$，可得
> $$w=\frac{z-i}{z+i}$$
> 验证：实轴 $z=x$ 上
> $$|w|=\frac{|x-i|}{|x+i|}=1$$
> 故实轴映成单位圆；上半平面映成单位圆内部。

> [!example] 上半平面 → 上半平面
> $w=\dfrac{z-i}{z+i}$ 的逆映射 $z=i\dfrac{1+w}{1-w}$ 把单位圆映回上半平面。这是第 3 章柯西公式在圆域与半平面之间转换的工具。

# 3. 初等映射

## 幂函数 $w=z^n$

$z=re^{i\theta}$ → $w=r^ne^{in\theta}$。

- 角域 $0<\theta<\pi/n$ → 上半平面（角度放大 $n$ 倍）
- 扇区张角 $\alpha$ → 张角 $n\alpha$
- 在 $z=0$ 处不保角（导数 $nz^{n-1}=0$）

> [!example] 角域 → 半平面
> 把角域 $0<\arg z<\pi/4$ 映成上半平面：取 $w=z^4$。
> $\theta\in(0,\pi/4)$ → $\arg w=4\theta\in(0,\pi)$，即上半平面。

## 指数函数 $w=e^z$

$z=x+iy$ → $w=e^x e^{iy}$。

- 水平带域 $0<y<\pi$ → 上半平面（$w$ 的辐角 $y$）
- 周期 $2\pi i$：带域宽度 $2\pi$ 会绕一圈
- 竖直线 $x=\text{const}$ → 圆 $|w|=e^x$
- 水平线 $y=\text{const}$ → 射线 $\arg w=y$

> [!example] 带域 → 角域
> 带域 $0<\operatorname{Im}z<\pi$ 经 $w=e^z$ 映成上半平面；带域 $0<\operatorname{Im}z<\pi/2$ 映成第一象限。

## 对数函数 $w=\ln z$

指数函数的逆：把角域/上半平面映回带域。主值支：

$$w=\ln z=\ln|z|+i\operatorname{Arg}z,\qquad -\pi<\operatorname{Arg}z<\pi$$

- 上半平面 → 带域 $0<\operatorname{Im}w<\pi$
- 角域 → 水平带域

## 儒可夫斯基变换

> [!info] Def 4 儒可夫斯基变换
> $$w=z+\frac1z$$
> 称为**儒可夫斯基变换**（Joukowski transform）。它把圆 $|z|=r$ 映成椭圆：
> $$u=\left(r+\frac1r\right)\cos\theta,\qquad v=\left(r-\frac1r\right)\sin\theta$$
> 把过 $\pm1$ 的圆映成**翼型**（airfoil），是空气动力学的经典工具。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 330" width="100%" style="max-width:720px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <circle cx="190.0" cy="165.0" r="85.0" fill="none" stroke="#2563eb" stroke-width="1.8"/>
  <line x1="85.0" y1="165.0" x2="295.0" y2="165.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <line x1="190.0" y1="60.0" x2="190.0" y2="270.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <text x="190.0" y="300.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">z 平面：|z|=2</text>
  <ellipse cx="555.0" cy="165.0" rx="137.5" ry="82.5" fill="none" stroke="var(--text-accent,#705dcf)" stroke-width="2"/>
  <line x1="397.5" y1="165.0" x2="712.5" y2="165.0" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <line x1="555.0" y1="62.5" x2="555.0" y2="267.5" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <text x="555.0" y="300.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">w 平面：椭圆 u²/(5/2)²+v²/(3/2)²=1</text>
  <line x1="300.0" y1="165.0" x2="360.0" y2="165.0" stroke="var(--text-muted,#57606a)" stroke-width="1.6" marker-end="url(#ar)"/>
  <text x="330.0" y="150.0" text-anchor="middle" font-size="12" fill="var(--text-accent,#705dcf)" font-weight="normal">w=z+1/z</text>
  <text x="360.0" y="320.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">儒可夫斯基变换把圆映成椭圆；过 ±1 的圆映成翼型</text>
</svg>

**性质**：

- $z=\pm1$ 是支点（导数 $1-1/z^2=0$）
- 单位圆 $|z|=1$ → 线段 $[-2,2]$（退化椭圆）
- 圆 $|z|=r>1$ → 椭圆，长半轴 $r+1/r$、短半轴 $r-1/r$
- 圆外区域 → 椭圆外区域（保角，除去支点）

> [!example] 圆 → 椭圆
> $|z|=2$ 经 $w=z+1/z$：
> $$u=\frac52\cos\theta,\qquad v=\frac32\sin\theta$$
> 即椭圆 $\dfrac{u^2}{(5/2)^2}+\dfrac{v^2}{(3/2)^2}=1$。

## 常用映射速查

| 目标 | 映射 |
| --- | --- |
| 上半平面 → 单位圆 | $w=\dfrac{z-i}{z+i}$ |
| 单位圆 → 上半平面 | $w=i\dfrac{1-z}{1+z}$ |
| 角域 $0<\arg z<\alpha$ → 上半平面 | $w=z^{\pi/\alpha}$ |
| 带域 $0<\operatorname{Im}z<\pi$ → 上半平面 | $w=e^z$ |
| 上半平面 → 带域 | $w=\ln z$ |
| 圆外 → 椭圆外 | $w=z+1/z$ |

# 4. 例题

> [!example] 例 1：判断保角性
> $f(z)=z^2$ 在哪些点保角？
> $f'(z)=2z$，故除 $z=0$ 外处处保角。在 $z=0$ 处角度放大 2 倍。

> [!example] 例 2：分式线性映射
> 把上半平面映成单位圆，并使 $z=i\mapsto w=0$、$z=0\mapsto w=1$。
> 设 $w=e^{i\alpha}\dfrac{z-i}{z+i}$。代入 $z=0$：
> $$1=e^{i\alpha}\frac{-i}{i}=-e^{i\alpha}\ \Longrightarrow\ e^{i\alpha}=-1$$
> 故 $w=-\dfrac{z-i}{z+i}=\dfrac{i-z}{z+i}$。

> [!example] 例 3：带域映射
> 把带域 $0<\operatorname{Im}z<\pi$ 映成单位圆。
> 先用 $e^z$ 映成上半平面，再用 $\dfrac{w-i}{w+i}$ 映成单位圆：
> $$W=\frac{e^z-i}{e^z+i}$$

> [!example] 例 4：儒可夫斯基
> 求 $|z|=3$ 在 $w=z+1/z$ 下的像。
> $$u=3+\frac13=\frac{10}{3},\qquad v=3-\frac13=\frac83$$
> 椭圆 $\dfrac{u^2}{(10/3)^2}+\dfrac{v^2}{(8/3)^2}=1$。

> [!tip] 本章收官
> 第 6 章研究解析函数的几何侧面：
> 1. **保角性**（1）：解析 + 导数非零 ⇒ 局部旋转 + 伸缩，角度不变。
> 2. **分式线性映射**（2）：保圆、保交比、三点定映射；上半平面 ↔ 单位圆是核心例子。
> 3. **初等映射**（3）：幂（角域）、指数（带域）、对数（逆）、儒可夫斯基（翼型/椭圆）。
> 4. **区域映射**（3–4）：把复杂区域化成简单区域，是解边值问题的标准手法。
>
> 一句话：**保角映射是"局部相似"的解析映射；分式线性映射保持圆/直线类，初等映射提供拉直角域/带域的工具——它们共同构成"把区域变简单"的几何工具箱。下一章转向积分变换：傅里叶变换。**

# 本章知识地图

```
保角映射
├─ 1. 保角映射的概念
│     ├─ 解析 + f'(z₀)≠0
│     ├─ 局部旋转 + 伸缩
│     ├─ 伸缩率 |f'|，旋转角 arg f'
│     ├─ 保角 ⇒ 角度大小与方向不变
│     └─ 黎曼映射定理
│
├─ 2. 分式线性映射
│     ├─ w=(az+b)/(cz+d)，ad−bc≠0
│     ├─ 一一对应、复合封闭
│     ├─ 保圆性：圆/直线 → 圆/直线
│     ├─ 保交比
│     ├─ 三类基本映射：平移/旋转伸缩/反演
│     └─ 三点定映射
│
├─ 3. 初等映射
│     ├─ 幂 zⁿ：角域张角 ×n
│     ├─ 指数 e^z：带域 → 角域
│     ├─ 对数 ln z：逆映射
│     ├─ 儒可夫斯基 z+1/z：圆 → 椭圆/翼型
│     └─ 常用映射速查表
│
└─ 4. 例题
      ├─ 判断保角性
      ├─ 上半平面 ↔ 单位圆
      ├─ 带域 → 单位圆
      └─ 儒可夫斯基像
```

# 关联

- 上一章：[[vault-notes/math/complex-analysis/05-residues-applications]]
- 下一章：[[vault-notes/math/complex-analysis/07-fourier-transform]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 保角性 | 解析函数的几何刻画；[[vault-notes/math/complex-analysis/02-analytic-functions]] 的 C-R 方程 |
| 分式线性映射 | 边值问题的区域变换；[[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] |
| 交比 | 分式线性映射的唯一性；射影几何 |
| 幂/指数映射 | [[vault-notes/math/complex-analysis/07-fourier-transform]] 的复指数；[[vault-notes/math/complex-analysis/08-laplace-transform]] 的复频率 |
| 儒可夫斯基变换 | 空气动力学；场论的椭圆边界问题 |

**本章留下的两个悬念（第 7 章结清）**：

| 本章的悬念 | 第 7 章的答案 |
| --- | --- |
| 复指数 $e^{i\omega t}$ 为什么是傅里叶分析的基？ | 它是 LSI 系统的特征函数；傅里叶变换把信号分解成复指数 |
| 解析函数与傅里叶变换有什么关系？ | 傅里叶变换的复分析工具（围道积分、留数）用于计算频谱 |

**通信方向应用**：

- [[vault-notes/dsp/02-z-transform-and-dtft]] —— $z=e^{i\omega}$ 是单位圆上的保角参数化；分式线性映射用于滤波器设计（双线性变换）。
- [[vault-notes/dsp/06-iir-filter-design]] —— 双线性变换 $s=\frac{2}{T}\frac{1-z^{-1}}{1+z^{-1}}$ 就是分式线性映射，把 s 左半平面映到单位圆内。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 星座图旋转/缩放（保角映射的局部行为）。
- [[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] —— 保角映射把复杂边界区域化成简单区域，解拉普拉斯方程。
- [[vault-notes/matlab/matlab-notes]] —— 复变函数映射作图；`zplane` 看零极点映射。

**相关**：[[vault-notes/math/complex-analysis/05-residues-applications]]｜[[vault-notes/math/complex-analysis/07-fourier-transform]]｜[[vault-notes/dsp/06-iir-filter-design]]｜[[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]]
