---
title: "场论基础"
tags:
- 数学
- 场论
- 向量分析
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
> 复变函数研究"复平面上的函数"；场论研究"空间中的函数"——标量场与向量场。本章建立向量微分算子：
> - **1. 标量场与向量场**：场的概念、向量代数、坐标表示。
> - **2. 方向导数与梯度**：标量场变化最快的方向与速率；$\nabla\varphi$。
> - **3. 通量与散度**：向量场"发散"的程度；高斯定理。
> - **4. 环量与旋度**：向量场"旋转"的程度；斯托克斯定理。
> - **5. 例题**：梯度、散度、旋度的计算与恒等式验证。
>
> 一句话主线：**梯度作用在标量场上得到向量场（方向导数）；散度作用在向量场上得到标量场（源强）；旋度作用在向量场上得到向量场（涡旋）；高斯定理把散度变成通量，斯托克斯定理把旋度变成环量。**

> [!note] 记号约定
> - $\varphi(x,y,z)$：标量场；$\mathbf{A}=(A_x,A_y,A_z)$：向量场
> - $\nabla=\left(\frac{\partial}{\partial x},\frac{\partial}{\partial y},\frac{\partial}{\partial z}\right)$：Nabla 算子
> - $\nabla\varphi$：梯度；$\nabla\cdot\mathbf{A}$：散度；$\nabla\times\mathbf{A}$：旋度
> - $\nabla^2=\nabla\cdot\nabla=\frac{\partial^2}{\partial x^2}+\frac{\partial^2}{\partial y^2}+\frac{\partial^2}{\partial z^2}$：拉普拉斯算子
> - $\mathbf{e}_x,\mathbf{e}_y,\mathbf{e}_z$：直角坐标单位向量
> - $S$：曲面；$V$：体积；$C$：曲线；$d\mathbf{S}=\mathbf{n}dS$：有向面元

# 1. 标量场与向量场

## 场的概念

> [!info] Def 1 标量场与向量场
> - 若空间区域 $\Omega$ 内每点 $(x,y,z)$ 对应一个**标量** $\varphi(x,y,z)$，则称 $\varphi$ 为**标量场**（scalar field）。
> - 若每点对应一个**向量** $\mathbf{A}(x,y,z)$，则称 $\mathbf{A}$ 为**向量场**（vector field）。

**例子**：

| 场 | 类型 | 物理意义 |
| --- | --- | --- |
| 温度 $T(x,y,z)$ | 标量场 | 空间温度分布 |
| 电位 $V(x,y,z)$ | 标量场 | 电场势 |
| 电场 $\mathbf{E}$ | 向量场 | 每点的电场强度 |
| 磁场 $\mathbf{B}$ | 向量场 | 每点的磁感应强度 |
| 流速 $\mathbf{v}$ | 向量场 | 流体速度 |

## 向量代数复习

$$
\mathbf{A}\cdot\mathbf{B}=A_xB_x+A_yB_y+A_zB_z
$$

$$
\mathbf{A}\times\mathbf{B}=\begin{vmatrix}\mathbf{e}_x&\mathbf{e}_y&\mathbf{e}_z\\A_x&A_y&A_z\\B_x&B_y&B_z\end{vmatrix}
$$

- 点积：标量；叉积：向量
- $\mathbf{A}\cdot\mathbf{B}=|\mathbf{A}||\mathbf{B}|\cos\theta$；$|\mathbf{A}\times\mathbf{B}|=|\mathbf{A}||\mathbf{B}|\sin\theta$
- 正交：$\mathbf{A}\cdot\mathbf{B}=0$；平行：$\mathbf{A}\times\mathbf{B}=0$

## 场的几何表示

- **标量场**：等值面（如等温面、等位面）$\varphi=\text{const}$
- **向量场**：场线（如电场线、流线），每点切线方向与场向量一致

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 330" width="100%" style="max-width:720px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <text x="190.0" y="30.0" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">(a) 径向场 A=(x,y)：有散</text>
  <line x1="114.0" y1="89.0" x2="94.0" y2="69.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="114.0" y1="127.0" x2="94.0" y2="117.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="114.0" y1="165.0" x2="94.0" y2="165.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="114.0" y1="203.0" x2="94.0" y2="213.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="114.0" y1="241.0" x2="94.0" y2="261.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="152.0" y1="89.0" x2="142.0" y2="69.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="152.0" y1="127.0" x2="142.0" y2="117.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="152.0" y1="165.0" x2="142.0" y2="165.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="152.0" y1="203.0" x2="142.0" y2="213.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="152.0" y1="241.0" x2="142.0" y2="261.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="190.0" y1="89.0" x2="190.0" y2="69.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="190.0" y1="127.0" x2="190.0" y2="117.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="190.0" y1="203.0" x2="190.0" y2="213.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="190.0" y1="241.0" x2="190.0" y2="261.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="228.0" y1="89.0" x2="238.0" y2="69.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="228.0" y1="127.0" x2="238.0" y2="117.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="228.0" y1="165.0" x2="238.0" y2="165.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="228.0" y1="203.0" x2="238.0" y2="213.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="228.0" y1="241.0" x2="238.0" y2="261.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="266.0" y1="89.0" x2="286.0" y2="69.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="266.0" y1="127.0" x2="286.0" y2="117.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="266.0" y1="165.0" x2="286.0" y2="165.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="266.0" y1="203.0" x2="286.0" y2="213.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="266.0" y1="241.0" x2="286.0" y2="261.0" stroke="#2563eb" stroke-width="1.2" marker-end="url(#ar)"/>
  <text x="540.0" y="30.0" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">(b) 旋转场 A=(−y,x)：有旋</text>
  <line x1="464.0" y1="89.0" x2="482.0" y2="71.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="464.0" y1="127.0" x2="473.0" y2="109.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="464.0" y1="165.0" x2="464.0" y2="147.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="464.0" y1="203.0" x2="455.0" y2="185.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="464.0" y1="241.0" x2="446.0" y2="223.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="502.0" y1="89.0" x2="520.0" y2="80.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="502.0" y1="127.0" x2="511.0" y2="118.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="502.0" y1="165.0" x2="502.0" y2="156.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="502.0" y1="203.0" x2="493.0" y2="194.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="502.0" y1="241.0" x2="484.0" y2="232.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="540.0" y1="89.0" x2="558.0" y2="89.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="540.0" y1="127.0" x2="549.0" y2="127.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="540.0" y1="203.0" x2="531.0" y2="203.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="540.0" y1="241.0" x2="522.0" y2="241.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="578.0" y1="89.0" x2="596.0" y2="98.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="578.0" y1="127.0" x2="587.0" y2="136.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="578.0" y1="165.0" x2="578.0" y2="174.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="578.0" y1="203.0" x2="569.0" y2="212.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="578.0" y1="241.0" x2="560.0" y2="250.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="616.0" y1="89.0" x2="634.0" y2="107.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="616.0" y1="127.0" x2="625.0" y2="145.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="616.0" y1="165.0" x2="616.0" y2="183.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="616.0" y1="203.0" x2="607.0" y2="221.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <line x1="616.0" y1="241.0" x2="598.0" y2="259.0" stroke="#059669" stroke-width="1.2" marker-end="url(#ar)"/>
  <text x="360.0" y="315.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">散度看'源'，旋度看'涡'；两者都为零的场是'无源无旋'的调和场</text>
</svg>

# 2. 方向导数与梯度

## 方向导数

> [!info] Def 2 方向导数
> 标量场 $\varphi$ 在点 $P$ 沿单位方向 $\mathbf{e}_l$ 的**方向导数**为
> $$
> \frac{\partial\varphi}{\partial l}=\lim_{t\to0}\frac{\varphi(P+t\mathbf{e}_l)-\varphi(P)}{t}
> $$
> 它表示 $\varphi$ 沿该方向的变化率。

**计算公式**：

$$
\frac{\partial\varphi}{\partial l}=\nabla\varphi\cdot\mathbf{e}_l=|\nabla\varphi|\cos\theta
$$

其中 $\theta$ 是 $\nabla\varphi$ 与 $\mathbf{e}_l$ 的夹角。

## 梯度

> [!info] Def 3 梯度
> 标量场 $\varphi$ 的**梯度**（gradient）为
> $$
> \operatorname{grad}\varphi=\nabla\varphi=\left(\frac{\partial\varphi}{\partial x},\frac{\partial\varphi}{\partial y},\frac{\partial\varphi}{\partial z}\right)
> $$
> 它是一个向量场。

**三条核心性质**：

1. **方向**：$\nabla\varphi$ 指向 $\varphi$ 增长最快的方向
2. **大小**：$|\nabla\varphi|$ 是最大变化率
3. **等值面**：$\nabla\varphi$ 垂直于等值面 $\varphi=\text{const}$

> [!important] 方向导数 = 梯度在方向上的投影
> $$
> \frac{\partial\varphi}{\partial l}=\nabla\varphi\cdot\mathbf{e}_l
> $$
> 当 $\mathbf{e}_l$ 与 $\nabla\varphi$ 同向时取最大值 $|\nabla\varphi|$；垂直时为 0（沿等值面方向）。

> [!example] 梯度计算
> $\varphi=x^2y+yz^3$，求 $\nabla\varphi$ 在 $(1,2,-1)$ 的值。
> $$
> \nabla\varphi=(2xy,\ x^2+z^3,\ 3yz^2)
> $$
> 在 $(1,2,-1)$：
> $$
> \nabla\varphi=(4,\ 1-1,\ 3\cdot2\cdot1)=(4,0,6)
> $$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 300" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <circle cx="130.0" cy="130.0" r="70.0" fill="none" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <text x="130.0" y="50.0" text-anchor="middle" font-size="15" fill="#2563eb" font-weight="600">grad φ</text>
  <text x="130.0" y="260.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">标量场 → 向量</text>
  <circle cx="380.0" cy="130.0" r="70.0" fill="none" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <text x="380.0" y="50.0" text-anchor="middle" font-size="15" fill="#059669" font-weight="600">div A</text>
  <text x="380.0" y="260.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">向量场 → 标量</text>
  <circle cx="630.0" cy="130.0" r="70.0" fill="none" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1.0"/>
  <text x="630.0" y="50.0" text-anchor="middle" font-size="15" fill="#d97706" font-weight="600">curl A</text>
  <text x="630.0" y="260.0" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)" font-weight="normal">向量场 → 向量</text>
  <circle cx="130.0" cy="130.0" r="56.0" fill="none" stroke="#2563eb" stroke-width="0.8" stroke-dasharray="3 3"/>
  <circle cx="130.0" cy="130.0" r="38.0" fill="none" stroke="#2563eb" stroke-width="0.8" stroke-dasharray="3 3"/>
  <circle cx="130.0" cy="130.0" r="20.0" fill="none" stroke="#2563eb" stroke-width="0.8" stroke-dasharray="3 3"/>
  <circle cx="130.0" cy="130.0" r="38.0" fill="none" stroke="#2563eb" stroke-width="0.8" stroke-dasharray="3 3"/>
  <circle cx="130.0" cy="130.0" r="56.0" fill="none" stroke="#2563eb" stroke-width="0.8" stroke-dasharray="3 3"/>
  <line x1="130.0" y1="130.0" x2="175.0" y2="85.0" stroke="#2563eb" stroke-width="2.2" marker-end="url(#ar)"/>
  <text x="178.0" y="80.0" text-anchor="start" font-size="11" fill="#2563eb" font-weight="normal">∇φ</text>
  <line x1="395.0" y1="130.0" x2="435.0" y2="130.0" stroke="#059669" stroke-width="1.4" marker-end="url(#ar)"/>
  <line x1="390.6" y1="140.6" x2="418.9" y2="168.9" stroke="#059669" stroke-width="1.4" marker-end="url(#ar)"/>
  <line x1="380.0" y1="145.0" x2="380.0" y2="185.0" stroke="#059669" stroke-width="1.4" marker-end="url(#ar)"/>
  <line x1="369.4" y1="140.6" x2="341.1" y2="168.9" stroke="#059669" stroke-width="1.4" marker-end="url(#ar)"/>
  <line x1="365.0" y1="130.0" x2="325.0" y2="130.0" stroke="#059669" stroke-width="1.4" marker-end="url(#ar)"/>
  <line x1="369.4" y1="119.4" x2="341.1" y2="91.1" stroke="#059669" stroke-width="1.4" marker-end="url(#ar)"/>
  <line x1="380.0" y1="115.0" x2="380.0" y2="75.0" stroke="#059669" stroke-width="1.4" marker-end="url(#ar)"/>
  <line x1="390.6" y1="119.4" x2="418.9" y2="91.1" stroke="#059669" stroke-width="1.4" marker-end="url(#ar)"/>
  <line x1="675.0" y1="130.0" x2="669.5" y2="151.6" stroke="#d97706" stroke-width="1.6" marker-end="url(#ar)"/>
  <line x1="652.5" y1="169.0" x2="631.1" y2="175.0" stroke="#d97706" stroke-width="1.6" marker-end="url(#ar)"/>
  <line x1="607.5" y1="169.0" x2="591.6" y2="153.4" stroke="#d97706" stroke-width="1.6" marker-end="url(#ar)"/>
  <line x1="585.0" y1="130.0" x2="590.5" y2="108.4" stroke="#d97706" stroke-width="1.6" marker-end="url(#ar)"/>
  <line x1="607.5" y1="91.0" x2="628.9" y2="85.0" stroke="#d97706" stroke-width="1.6" marker-end="url(#ar)"/>
  <line x1="652.5" y1="91.0" x2="668.4" y2="106.6" stroke="#d97706" stroke-width="1.6" marker-end="url(#ar)"/>
  <text x="380.0" y="285.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">梯度、散度、旋度：向量分析的三个基本算子</text>
</svg>

# 3. 通量与散度

## 通量

> [!info] Def 4 通量
> 向量场 $\mathbf{A}$ 穿过有向曲面 $S$ 的**通量**（flux）为
> $$
> \Phi=\iint_S\mathbf{A}\cdot\mathrm{d}\mathbf{S}=\iint_S\mathbf{A}\cdot\mathbf{n}\,\mathrm{d}S
> $$
> 其中 $\mathbf{n}$ 为曲面单位法向量。

物理意义：通量表示"穿过曲面的场的总量"。例如流速场穿过曲面的通量 = 单位时间通过该面的流体体积。

## 散度

> [!info] Def 5 散度
> 向量场 $\mathbf{A}$ 的**散度**（divergence）为
> $$
> \operatorname{div}\mathbf{A}=\nabla\cdot\mathbf{A}=\frac{\partial A_x}{\partial x}+\frac{\partial A_y}{\partial y}+\frac{\partial A_z}{\partial z}
> $$
> 它是一个标量场。

**物理意义**：散度是"单位体积的通量源强度"。

- $\nabla\cdot\mathbf{A}>0$：该点有源（流出多于流入）
- $\nabla\cdot\mathbf{A}<0$：该点有汇
- $\nabla\cdot\mathbf{A}=0$：无源场（管形场/ solenoid field）

> [!important] 高斯定理（散度定理）
> 设 $S$ 是包围体积 $V$ 的闭曲面，取外法向，则
> $$
> \oiint_S\mathbf{A}\cdot\mathrm{d}\mathbf{S}=\iiint_V\nabla\cdot\mathbf{A}\,\mathrm{d}V
> $$
> **边界上的通量 = 内部散度的体积分。**

> [!example] 散度计算
> $\mathbf{A}=(x^2y,\ yz,\ xz^2)$，求 $\nabla\cdot\mathbf{A}$。
> $$
> \nabla\cdot\mathbf{A}=2xy+z+2xz
> $$

> [!example] 高斯定理验证
> $\mathbf{A}=(x,y,z)$（径向场），$S$ 为半径 $R$ 的球面。
> $\nabla\cdot\mathbf{A}=3$，$\iiint_V3\,dV=3\cdot\frac43\pi R^3=4\pi R^3$。
> 球面上 $\mathbf{A}\cdot\mathbf{n}=R$，$\oiint_S R\,dS=R\cdot4\pi R^2=4\pi R^3$。两者相等 ✓

# 4. 环量与旋度

## 环量

> [!info] Def 6 环量
> 向量场 $\mathbf{A}$ 沿有向闭曲线 $C$ 的**环量**（circulation）为
> $$
> \Gamma=\oint_C\mathbf{A}\cdot\mathrm{d}\mathbf{l}
> $$

物理意义：环量表示场沿闭曲线的"旋转趋势"。例如流速场沿闭曲线的环量 = 沿该回路的流体旋转强度。

## 旋度

> [!info] Def 7 旋度
> 向量场 $\mathbf{A}$ 的**旋度**（curl）为
> $$
> \operatorname{curl}\mathbf{A}=\nabla\times\mathbf{A}=\begin{vmatrix}\mathbf{e}_x&\mathbf{e}_y&\mathbf{e}_z\\\dfrac{\partial}{\partial x}&\dfrac{\partial}{\partial y}&\dfrac{\partial}{\partial z}\\A_x&A_y&A_z\end{vmatrix}
> $$
> 它是一个向量场。

展开：

$$
\nabla\times\mathbf{A}=\left(\frac{\partial A_z}{\partial y}-\frac{\partial A_y}{\partial z},\ \frac{\partial A_x}{\partial z}-\frac{\partial A_z}{\partial x},\ \frac{\partial A_y}{\partial x}-\frac{\partial A_x}{\partial y}\right)
$$

**物理意义**：旋度是"单位面积的环量"，描述场的局部旋转。

- $\nabla\times\mathbf{A}=0$：无旋场（保守场/irrotational field）
- $\nabla\times\mathbf{A}\ne0$：有旋场

> [!important] 斯托克斯定理
> 设 $S$ 是以闭曲线 $C$ 为边界的有向曲面，$C$ 的方向与 $S$ 的法向成右手螺旋，则
> $$
> \oint_C\mathbf{A}\cdot\mathrm{d}\mathbf{l}=\iint_S(\nabla\times\mathbf{A})\cdot\mathrm{d}\mathbf{S}
> $$
> **边界上的环量 = 内部旋度的通量。**

> [!example] 旋度计算
> $\mathbf{A}=(yz,\ xz,\ xy)$，求 $\nabla\times\mathbf{A}$。
> $$
> \nabla\times\mathbf{A}=\left(\frac{\partial(xy)}{\partial y}-\frac{\partial(xz)}{\partial z},\ \frac{\partial(yz)}{\partial z}-\frac{\partial(xy)}{\partial x},\ \frac{\partial(xz)}{\partial x}-\frac{\partial(yz)}{\partial y}\right)
> $$
> $$
> =(x-x,\ y-y,\ z-z)=(0,0,0)
> $$
> 故 $\mathbf{A}$ 是无旋场；事实上 $\mathbf{A}=\nabla(xyz)$。

## 三个重要恒等式

> [!tip] 必背恒等式
> 1. **梯度场无旋**：$\nabla\times(\nabla\varphi)=0$
> 2. **旋度场无散**：$\nabla\cdot(\nabla\times\mathbf{A})=0$
> 3. **拉普拉斯**：$\nabla\cdot(\nabla\varphi)=\nabla^2\varphi$

**推论**：

- 若 $\nabla\times\mathbf{A}=0$（无旋），则存在标量势 $\varphi$，使 $\mathbf{A}=\nabla\varphi$（保守场）。
- 若 $\nabla\cdot\mathbf{A}=0$（无散），则存在向量势 $\mathbf{B}$，使 $\mathbf{A}=\nabla\times\mathbf{B}$（管形场）。

> [!example] 验证恒等式
> $\varphi=x^2yz$，验证 $\nabla\times(\nabla\varphi)=0$。
> $$
> \nabla\varphi=(2xyz,\ x^2z,\ x^2y)
> $$
> $$
> \nabla\times\nabla\varphi=\left(\frac{\partial(x^2y)}{\partial y}-\frac{\partial(x^2z)}{\partial z},\ \frac{\partial(2xyz)}{\partial z}-\frac{\partial(x^2y)}{\partial x},\ \frac{\partial(x^2z)}{\partial x}-\frac{\partial(2xyz)}{\partial y}\right)
> $$
> $$=(x^2-x^2,\ 2xy-2xy,\ 2xz-2xz)=(0,0,0)$$ ✓

# 5. 例题

> [!example] 例 1：方向导数
> $\varphi=x^2+y^2+z^2$，求在 $(1,1,1)$ 沿 $\mathbf{e}_l=\frac{1}{\sqrt3}(1,1,1)$ 的方向导数。
> $$
> \nabla\varphi=(2x,2y,2z)\big|_{(1,1,1)}=(2,2,2)
> $$
> $$
> \frac{\partial\varphi}{\partial l}=(2,2,2)\cdot\frac{1}{\sqrt3}(1,1,1)=\frac{6}{\sqrt3}=2\sqrt3
> $$
> 最大方向导数 $|\nabla\varphi|=\sqrt{12}=2\sqrt3$，方向正是 $\frac{1}{\sqrt3}(1,1,1)$。

> [!example] 例 2：散度与高斯定理
> $\mathbf{A}=(x^3,y^3,z^3)$，$S$ 为球面 $x^2+y^2+z^2=R^2$。求通量。
> $$
> \nabla\cdot\mathbf{A}=3(x^2+y^2+z^2)=3r^2
> $$
> $$
> \iiint_V3r^2\,dV=3\int_0^R r^2\cdot4\pi r^2\,dr=\frac{12\pi R^5}{5}
> $$

> [!example] 例 3：旋度与斯托克斯定理
> $\mathbf{A}=(-y,x,0)$（绕 z 轴旋转的场），$C$ 为 $xy$ 平面内半径 $R$ 的圆。求环量。
> $$
> \nabla\times\mathbf{A}=(0,0,2)
> $$
> $$
> \oint_C\mathbf{A}\cdot d\mathbf{l}=\iint_S(0,0,2)\cdot(0,0,1)\,dS=2\pi R^2
> $$
> 直接验证：$d\mathbf{l}=(-R\sin\theta,R\cos\theta,0)d\theta$，$\mathbf{A}=(-R\sin\theta,R\cos\theta,0)$，被积函数 $R^2$，积分 $2\pi R^2$ ✓

> [!example] 例 4：保守场与势函数
> 判断 $\mathbf{A}=(2xy,\ x^2+2yz,\ y^2)$ 是否为保守场；若是，求势函数。
> $$
> \nabla\times\mathbf{A}=\left(\frac{\partial(y^2)}{\partial y}-\frac{\partial(x^2+2yz)}{\partial z},\ \frac{\partial(2xy)}{\partial z}-\frac{\partial(y^2)}{\partial x},\ \frac{\partial(x^2+2yz)}{\partial x}-\frac{\partial(2xy)}{\partial y}\right)
> $$
> $$
> =(2y-2y,\ 0-0,\ 2x-2x)=(0,0,0)
> $$
> 无旋，存在势函数 $\varphi$。由 $\varphi_x=2xy$，$\varphi=x^2y+f(y,z)$；由 $\varphi_y=x^2+2yz$，得 $f_y=2yz$，$f=yz^2+g(z)$；由 $\varphi_z=y^2$，得 $g'(z)=0$。
> $$
> \varphi=x^2y+yz^2+C
> $$

> [!example] 例 5：电磁场的两个方程
> 静电场 $\mathbf{E}=-\nabla V$（无旋），故 $\nabla\times\mathbf{E}=0$。
> 磁场 $\mathbf{B}=\nabla\times\mathbf{A}$（无散），故 $\nabla\cdot\mathbf{B}=0$。
> 这两条正是麦克斯韦方程组中的两个齐次方程，也是"电场有势、磁场无源"的数学表述。

> [!tip] 本章收官
> 第 9 章建立了向量场的微分学：
> 1. **场**（1）：标量场与向量场；等值面与场线。
> 2. **梯度**（2）：$\nabla\varphi$ 指向增长最快方向；方向导数 = 梯度投影。
> 3. **散度**（3）：$\nabla\cdot\mathbf{A}$ 描述源的强度；高斯定理把通量变体积分。
> 4. **旋度**（4）：$\nabla\times\mathbf{A}$ 描述旋转；斯托克斯定理把环量变面积分。
> 5. **恒等式**（4）：梯度无旋、旋度无散；保守场有势、管形场有向量势。
>
> 一句话：**梯度、散度、旋度是向量分析的"三件套"；高斯定理与斯托克斯定理是"边界 = 内部微分"的两个版本。下一章把它们用于麦克斯韦方程、拉普拉斯方程与边值问题。**

# 本章知识地图

```
场论基础
├─ 1. 标量场与向量场
│     ├─ 标量场 φ(x,y,z)：等值面
│     ├─ 向量场 A(x,y,z)：场线
│     ├─ 向量代数：点积/叉积
│     └─ 物理例子：温度/电位/电场/流速
│
├─ 2. 方向导数与梯度
│     ├─ ∂φ/∂l=∇φ·e_l
│     ├─ ∇φ=(φ_x,φ_y,φ_z)
│     ├─ 方向：增长最快
│     ├─ 大小：最大变化率
│     └─ 垂直等值面
│
├─ 3. 通量与散度
│     ├─ 通量：∬A·dS
│     ├─ 散度：∇·A=A_x,x+A_y,y+A_z,z
│     ├─ 源/汇/无源
│     └─ 高斯定理：∮A·dS=∭∇·A dV
│
├─ 4. 环量与旋度
│     ├─ 环量：∮A·dl
│     ├─ 旋度：∇×A
│     ├─ 无旋场/保守场
│     ├─ 斯托克斯定理：∮A·dl=∬(∇×A)·dS
│     └─ 恒等式：∇×(∇φ)=0，∇·(∇×A)=0
│
└─ 5. 例题
      ├─ 梯度/方向导数
      ├─ 散度/高斯定理
      ├─ 旋度/斯托克斯
      └─ 势函数
```

# 关联

- 上一章：[[vault-notes/math/complex-analysis/08-laplace-transform]]
- 下一章：[[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]]

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 梯度、散度、旋度 | [[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] 的麦克斯韦方程、亥姆霍兹定理 |
| 高斯定理 | [[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] 的泊松方程 |
| 斯托克斯定理 | 电磁感应、安培环路定理 |
| 拉普拉斯算子 | [[vault-notes/math/complex-analysis/02-analytic-functions]] 的调和函数；[[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] 的拉普拉斯方程 |
| 保守场与势函数 | 静电场、重力场；[[vault-notes/math/complex-analysis/02-analytic-functions]] 的实部/虚部 |

**本章留下的三个悬念（第 10 章结清）**：

| 本章的悬念 | 第 10 章的答案 |
| --- | --- |
| 高斯定理和斯托克斯定理怎么用于解边值问题？ | 把麦克斯韦方程化为泊松/拉普拉斯方程 + 边界条件 |
| 任意向量场能否分解成"无旋 + 无散"两部分？ | 亥姆霍兹定理：$\mathbf{A}=-\nabla\varphi+\nabla\times\mathbf{B}$ |
| 拉普拉斯方程怎么解？ | 分离变量法 + 边界条件；保角映射（第 6 章）也可用 |

**通信方向应用**：

- [[vault-notes/communication/03-random-processes]] —— 随机场的相关函数、功率谱；向量随机过程。
- [[vault-notes/communication/04-channel]] —— 电磁波在空间的传播、麦克斯韦方程、坡印廷矢量。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 天线阵列的电磁场、波束赋形的场方向图。
- [[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]] —— 麦克斯韦方程、波动方程、边值问题。
- [[vault-notes/matlab/matlab-notes]] —— 梯度/散度/旋度的数值计算；`gradient`/`divergence`/`curl`。

**相关**：[[vault-notes/math/complex-analysis/08-laplace-transform]]｜[[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value]]｜[[vault-notes/math/complex-analysis/02-analytic-functions]]｜[[vault-notes/matlab/matlab-notes]]
