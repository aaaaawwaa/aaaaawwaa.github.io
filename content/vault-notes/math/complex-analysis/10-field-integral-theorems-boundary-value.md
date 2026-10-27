---
title: "场论的积分定理与边值问题"
tags:
- 数学
- 场论
- 边值问题
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
> 第 9 章给出了梯度、散度、旋度；本章把它们组织成场论的两大支柱：
> - **1. 高斯定理与斯托克斯定理**：边界积分与内部微分的互换；麦克斯韦方程的积分形式。
> - **2. 亥姆霍兹定理**：任意向量场 = 无旋部分（梯度）+ 无散部分（旋度）；场的唯一分解。
> - **3. 拉普拉斯方程与泊松方程**：静电场、稳定温度场、无源区域的共同方程；调和函数。
> - **4. 边值问题与分离变量法**：狄利克雷/诺伊曼边界条件；矩形域、圆柱域、球域的分离变量；唯一性定理。
> - **5. 例题**：高斯定理、亥姆霍兹分解、分离变量解边值问题。
>
> 一句话主线：**高斯/斯托克斯把"边界"与"内部"连起来；亥姆霍兹说"任意场都能拆成势场 + 涡旋场"；拉普拉斯/泊松方程是"场的方程"，边界条件决定唯一解——分离变量法是最常用的求解工具。**

> [!note] 记号约定
> - $S$：闭曲面；$V$：包围的体积；$C$：闭曲线；$S_C$：以 $C$ 为边界的曲面
> - $\mathbf{n}$：单位外法向；$\mathrm{d}\mathbf{S}=\mathbf{n}\mathrm{d}S$
> - $\varphi$：标量势；$\mathbf{A}$：向量势
> - $\nabla^2=\frac{\partial^2}{\partial x^2}+\frac{\partial^2}{\partial y^2}+\frac{\partial^2}{\partial z^2}$
> - 狄利克雷边界条件：$\varphi|_{\partial\Omega}=f$；诺伊曼：$\left.\frac{\partial\varphi}{\partial n}\right|_{\partial\Omega}=g$
> - 分离变量：$\varphi=X(x)Y(y)Z(z)$

# 1. 高斯定理与斯托克斯定理

## 高斯定理（散度定理）

> [!info] Def 1 高斯定理
> 设 $\mathbf{A}$ 在闭曲面 $S$ 及其内部有连续偏导，则
> $$\oiint_S\mathbf{A}\cdot\mathrm{d}\mathbf{S}=\iiint_V\nabla\cdot\mathbf{A}\,\mathrm{d}V$$
> 即**边界通量 = 内部散度的体积分**。

**应用**：

- 由电荷密度求电场（高斯定理的电场形式）
- 由流速场求源强
- 把体积分化为面积分（或反之）

> [!important] 麦克斯韦方程的高斯形式
> $$\oiint_S\mathbf{D}\cdot\mathrm{d}\mathbf{S}=Q_{\text{free}}\qquad\Longleftrightarrow\qquad\nabla\cdot\mathbf{D}=\rho$$
> $$\oiint_S\mathbf{B}\cdot\mathrm{d}\mathbf{S}=0\qquad\Longleftrightarrow\qquad\nabla\cdot\mathbf{B}=0$$
> 即"电场有源（电荷）、磁场无源"。

## 斯托克斯定理

> [!info] Def 2 斯托克斯定理
> 设 $S$ 是以闭曲线 $C$ 为边界的有向曲面，$C$ 的方向与 $S$ 的法向成右手螺旋，则
> $$\oint_C\mathbf{A}\cdot\mathrm{d}\mathbf{l}=\iint_S(\nabla\times\mathbf{A})\cdot\mathrm{d}\mathbf{S}$$
> 即**边界环量 = 内部旋度的通量**。

**应用**：

- 由电流密度求磁场（安培环路定理）
- 判断场是否保守（旋度为 0）
- 把线积分化为面积分（或反之）

> [!important] 麦克斯韦方程的斯托克斯形式
> $$\oint_C\mathbf{E}\cdot\mathrm{d}\mathbf{l}=-\frac{\mathrm{d}}{\mathrm{d}t}\iint_S\mathbf{B}\cdot\mathrm{d}\mathbf{S}\qquad\Longleftrightarrow\qquad\nabla\times\mathbf{E}=-\frac{\partial\mathbf{B}}{\partial t}$$
> $$\oint_C\mathbf{H}\cdot\mathrm{d}\mathbf{l}=I+\frac{\mathrm{d}}{\mathrm{d}t}\iint_S\mathbf{D}\cdot\mathrm{d}\mathbf{S}\qquad\Longleftrightarrow\qquad\nabla\times\mathbf{H}=\mathbf{J}+\frac{\partial\mathbf{D}}{\partial t}$$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 340" width="100%" style="max-width:720px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <ellipse cx="190.0" cy="170.0" rx="95" ry="70" fill="#2563eb" fill-opacity="0.12" stroke="#2563eb" stroke-width="1.8"/>
  <text x="190.0" y="40.0" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">(a) 高斯定理：闭曲面 S 包围体积 V</text>
  <line x1="285.0" y1="170.0" x2="310.0" y2="170.0" stroke="#2563eb" stroke-width="1.3" marker-end="url(#ar)"/>
  <line x1="237.5" y1="230.6" x2="250.0" y2="246.2" stroke="#2563eb" stroke-width="1.3" marker-end="url(#ar)"/>
  <line x1="142.5" y1="230.6" x2="130.0" y2="246.2" stroke="#2563eb" stroke-width="1.3" marker-end="url(#ar)"/>
  <line x1="95.0" y1="170.0" x2="70.0" y2="170.0" stroke="#2563eb" stroke-width="1.3" marker-end="url(#ar)"/>
  <line x1="142.5" y1="109.4" x2="130.0" y2="93.8" stroke="#2563eb" stroke-width="1.3" marker-end="url(#ar)"/>
  <line x1="237.5" y1="109.4" x2="250.0" y2="93.8" stroke="#2563eb" stroke-width="1.3" marker-end="url(#ar)"/>
  <text x="190.0" y="174.0" text-anchor="middle" font-size="13" fill="#2563eb" font-weight="normal">V</text>
  <text x="315.0" y="90.0" text-anchor="start" font-size="11" fill="#2563eb" font-weight="normal" font-style="italic">n</text>
  <text x="540.0" y="40.0" text-anchor="middle" font-size="12" fill="var(--text-normal,#1f2328)" font-weight="normal">(b) 斯托克斯定理：曲面 S 以 C 为边界</text>
  <ellipse cx="540.0" cy="170.0" rx="100" ry="55" fill="#7c3aed" fill-opacity="0.12" stroke="#7c3aed" stroke-width="1.8"/>
  <circle cx="540.0" cy="170.0" r="4.0" fill="#7c3aed" stroke="#7c3aed" stroke-width="1.0"/>
  <path d="M 440.0,170.0 A 100 55 0 0 1 640.0,170.0" fill="none" stroke="#dc2626" stroke-width="2.4" marker-end="url(#ar)"/>
  <text x="650.0" y="174.0" text-anchor="start" font-size="12" fill="#dc2626" font-weight="600">C</text>
  <text x="540.0" y="200.0" text-anchor="middle" font-size="13" fill="#7c3aed" font-weight="normal">S</text>
  <text x="360.0" y="325.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">高斯：∮_S A·dS=∭_V ∇·A dV；斯托克斯：∮_C A·dl=∬_S (∇×A)·dS</text>
</svg>

## 两个定理的统一视角

| 定理 | 边界 | 内部 | 微分算子 |
| --- | --- | --- | --- |
| 高斯 | 闭曲面 $S$ | 体积 $V$ | 散度 $\nabla\cdot$ |
| 斯托克斯 | 闭曲线 $C$ | 曲面 $S$ | 旋度 $\nabla\times$ |
| 牛顿–莱布尼茨 | 区间端点 | 区间 | 导数 $d/dx$ |

三者都是"**边界上的积分 = 内部导数的积分**"这一微积分基本定理的高维版本。

# 2. 亥姆霍兹定理

> [!info] Def 3 亥姆霍兹定理
> 在有限区域 $V$ 内，任意向量场 $\mathbf{A}$（满足适当光滑性）都可以唯一分解为
> $$\mathbf{A}=-\nabla\varphi+\nabla\times\mathbf{B}$$
> 其中 $\varphi$ 是标量势（无旋部分），$\mathbf{B}$ 是向量势（无散部分）。
> 若给定 $\nabla\cdot\mathbf{A}$、$\nabla\times\mathbf{A}$ 以及边界条件，则分解唯一。

**物理意义**：

- $-\nabla\varphi$：**无旋部分**（纵场），由散度源产生（如电荷产生的电场）
- $\nabla\times\mathbf{B}$：**无散部分**（横场），由旋度源产生（如电流产生的磁场）

> [!important] 场的"身份证"
> 一个向量场由**散度 + 旋度 + 边界条件**唯一确定。这就是为什么麦克斯韦方程用散度和旋度来描述电磁场：
> - $\nabla\cdot\mathbf{E}=\rho/\varepsilon_0$（电场的源）
> - $\nabla\times\mathbf{E}=-\partial\mathbf{B}/\partial t$（电场的旋）
> - $\nabla\cdot\mathbf{B}=0$（磁场无源）
> - $\nabla\times\mathbf{B}=\mu_0\mathbf{J}+\mu_0\varepsilon_0\partial\mathbf{E}/\partial t$（磁场的旋）
>
> 四个方程 + 边界条件 = 电磁场的完整描述。

> [!example] 亥姆霍兹分解的简单例子
> $\mathbf{A}=(x,y,0)$。
> $\nabla\cdot\mathbf{A}=2$，$\nabla\times\mathbf{A}=0$。
> 无旋，故 $\mathbf{A}=\nabla\varphi$。由 $\varphi_x=x$、$\varphi_y=y$，得 $\varphi=\frac12(x^2+y^2)+C$。
> 即 $\mathbf{A}$ 是纯纵场。

# 3. 拉普拉斯方程与泊松方程

## 方程

> [!info] Def 4 拉普拉斯方程
> $$\nabla^2\varphi=0$$
> 称为**拉普拉斯方程**（Laplace equation）。其解称为**调和函数**（harmonic function）。

> [!info] Def 5 泊松方程
> $$\nabla^2\varphi=f$$
> 称为**泊松方程**（Poisson equation）。$f$ 是源项。

**物理来源**：

| 方程 | 场景 |
| --- | --- |
| $\nabla^2V=-\rho/\varepsilon_0$ | 静电场（泊松） |
| $\nabla^2V=0$ | 无电荷区域的静电场（拉普拉斯） |
| $\nabla^2T=0$ | 稳态温度场（无热源） |
| $\nabla^2\psi=0$ | 理想不可压缩流体的势流 |

> [!important] 解析函数与调和函数
> 第 2 章已经证明：若 $f(z)=u+iv$ 解析，则 $u,v$ 都满足 $\nabla^2u=0$、$\nabla^2v=0$。
> 因此**复变函数是二维拉普拉斯方程的"解生成器"**：任取一个解析函数，它的实部和虚部都是调和函数。
> 这也是第 6 章保角映射能用来解二维边值问题的原因。

## 基本解

三维无界空间的格林函数：

$$\nabla^2\left(\frac{1}{r}\right)=-4\pi\delta(\mathbf{r})$$

即点电荷的电位 $V=\frac{1}{4\pi\varepsilon_0}\frac{q}{r}$ 满足泊松方程。

二维：

$$\nabla^2(\ln r)=2\pi\delta(\mathbf{r})$$

## 边界条件

> [!info] Def 6 边值问题
> 拉普拉斯/泊松方程 + 边界条件称为**边值问题**（boundary value problem）。常见三类：
> - **狄利克雷问题**（第一类）：$\varphi|_{\partial\Omega}=f$（给定边界值）
> - **诺伊曼问题**（第二类）：$\left.\frac{\partial\varphi}{\partial n}\right|_{\partial\Omega}=g$（给定法向导数）
> - **混合问题**（第三类）：部分边界给值、部分边界给导数值

> [!important] 唯一性定理
> 狄利克雷问题在区域内的解**唯一**；诺伊曼问题的解在相差一个常数的意义下唯一。
> 因此，只要找到一个满足方程和边界条件的解，它就是唯一的解——不用担心里还有其他解。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 380" width="100%" style="max-width:560px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <rect x="100.0" y="50.0" width="360.0" height="260.0" rx="0" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.8"/>
  <text x="280.0" y="40.0" text-anchor="middle" font-size="13" fill="#dc2626" font-weight="normal">φ = V₀</text>
  <text x="90.0" y="180.0" text-anchor="end" font-size="13" fill="#2563eb" font-weight="normal">φ = 0</text>
  <text x="470.0" y="180.0" text-anchor="start" font-size="13" fill="#2563eb" font-weight="normal">φ = 0</text>
  <text x="280.0" y="332.0" text-anchor="middle" font-size="13" fill="#2563eb" font-weight="normal">φ = 0</text>
  <text x="280.0" y="180.0" text-anchor="middle" font-size="15" fill="var(--text-normal,#1f2328)" font-weight="600">∇²φ = 0</text>
  <path d="M 110.0,258.0 Q 280.0,248.0 450.0,258.0" fill="none" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.9" stroke-dasharray="4 3"/>
  <path d="M 110.0,206.0 Q 280.0,196.0 450.0,206.0" fill="none" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.9" stroke-dasharray="4 3"/>
  <path d="M 110.0,154.0 Q 280.0,144.0 450.0,154.0" fill="none" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.9" stroke-dasharray="4 3"/>
  <path d="M 110.0,102.0 Q 280.0,92.0 450.0,102.0" fill="none" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="0.9" stroke-dasharray="4 3"/>
  <text x="280.0" y="355.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">矩形域狄利克雷问题：边界值决定内部解</text>
</svg>

# 4. 边值问题与分离变量法

## 分离变量法（直角坐标）

设 $\varphi(x,y,z)=X(x)Y(y)Z(z)$，代入 $\nabla^2\varphi=0$：

$$\frac{X''}{X}+\frac{Y''}{Y}+\frac{Z''}{Z}=0$$

三项分别只依赖 $x,y,z$，故每项必为常数：

$$\frac{X''}{X}=-\lambda^2,\qquad \frac{Y''}{Y}=-\mu^2,\qquad \frac{Z''}{Z}=\lambda^2+\mu^2$$

解为三角函数/双曲函数的组合，常数由边界条件确定。

> [!example] 矩形域的狄利克雷问题
> 求 $\nabla^2\varphi=0$ 在矩形 $0<x<a$、$0<y<b$ 内，边界条件：
> $$\varphi(0,y)=\varphi(a,y)=\varphi(x,0)=0,\qquad\varphi(x,b)=V_0$$
> 设 $\varphi=X(x)Y(y)$。由 $x$ 方向边界：
> $$X(0)=X(a)=0\ \Longrightarrow\ X_n(x)=\sin\frac{n\pi x}{a},\qquad \lambda_n=\frac{n\pi}{a}$$
> 由 $y$ 方向：
> $$Y_n(y)=A_n\sinh\frac{n\pi y}{a}+B_n\cosh\frac{n\pi y}{a}$$
> $Y(0)=0$ → $B_n=0$。故
> $$\varphi(x,y)=\sum_{n=1}^{\infty}A_n\sin\frac{n\pi x}{a}\sinh\frac{n\pi y}{a}$$
> 由 $y=b$ 的边界：
> $$V_0=\sum_{n=1}^{\infty}A_n\sinh\frac{n\pi b}{a}\sin\frac{n\pi x}{a}$$
> 用正弦级数展开 $V_0$：
> $$A_n\sinh\frac{n\pi b}{a}=\frac{2}{a}\int_0^aV_0\sin\frac{n\pi x}{a}dx=\frac{2V_0}{n\pi}(1-\cos n\pi)$$
> 故
> $$A_n=\frac{2V_0(1-(-1)^n)}{n\pi\sinh(n\pi b/a)}$$
> 只有奇数 $n$ 非零。最终
> $$\varphi(x,y)=\sum_{n\ \text{odd}}\frac{4V_0}{n\pi\sinh(n\pi b/a)}\sin\frac{n\pi x}{a}\sinh\frac{n\pi y}{a}$$

## 分离变量法（圆柱坐标）

$$\nabla^2\varphi=\frac1r\frac{\partial}{\partial r}\left(r\frac{\partial\varphi}{\partial r}\right)+\frac1{r^2}\frac{\partial^2\varphi}{\partial\theta^2}+\frac{\partial^2\varphi}{\partial z^2}=0$$

设 $\varphi=R(r)\Theta(\theta)Z(z)$，得到贝塞尔方程/三角函数的组合。圆域问题常用 $r^n\cos n\theta$、$r^n\sin n\theta$、$\ln r$、$\theta$。

## 分离变量法（球坐标）

$$\nabla^2\varphi=\frac1{r^2}\frac{\partial}{\partial r}\left(r^2\frac{\partial\varphi}{\partial r}\right)+\frac1{r^2\sin\theta}\frac{\partial}{\partial\theta}\left(\sin\theta\frac{\partial\varphi}{\partial\theta}\right)+\frac1{r^2\sin^2\theta}\frac{\partial^2\varphi}{\partial\phi^2}=0$$

分离后得到**勒让德方程**，解为勒让德多项式 $P_l(\cos\theta)$。球对称问题常用 $1/r$、$r^lP_l(\cos\theta)$、$r^{-(l+1)}P_l(\cos\theta)$。

## 保角映射法（二维）

对二维拉普拉斯方程，保角映射 $w=f(z)$ 把复杂区域 $\Omega$ 映成简单区域（如单位圆/上半平面），在简单区域解出后再映回。这是第 6 章保角映射的直接应用。

> [!tip] 三种方法的适用场景
> | 方法 | 适用 |
> | --- | --- |
> | 分离变量（直角） | 矩形域、平行板 |
> | 分离变量（圆柱/球） | 圆/球对称、波导、天线 |
> | 保角映射 | 二维复杂边界（如椭圆、翼型） |
> | 格林函数 | 点源、任意边界（需要积分） |

# 5. 例题

> [!example] 例 1：高斯定理求电场
> 半径 $R$ 的球内均匀电荷密度 $\rho$，求球内外电场。
> 球对称，$\mathbf{E}=E(r)\mathbf{e}_r$。取半径 $r$ 的球面：
> $$\oiint\mathbf{E}\cdot d\mathbf{S}=4\pi r^2E(r)=\frac{Q_{\text{enc}}}{\varepsilon_0}$$
> - $r<R$：$Q_{\text{enc}}=\frac43\pi r^3\rho$，$E=\frac{\rho r}{3\varepsilon_0}$
> - $r>R$：$Q_{\text{enc}}=\frac43\pi R^3\rho=Q$，$E=\frac{Q}{4\pi\varepsilon_0r^2}$

> [!example] 例 2：斯托克斯定理求磁场
> 无限长直导线电流 $I$，求磁场。
> 由对称性 $\mathbf{B}=B(r)\mathbf{e}_\phi$。取半径 $r$ 的圆：
> $$\oint_C\mathbf{B}\cdot d\mathbf{l}=2\pi rB(r)=\mu_0I$$
> $$B(r)=\frac{\mu_0I}{2\pi r}$$
> 这正是安培环路定理。

> [!example] 例 3：一维拉普拉斯方程
> 求 $\varphi''(x)=0$ 在 $0<x<d$，$\varphi(0)=0$、$\varphi(d)=V_0$。
> $$\varphi(x)=Ax+B$$
> 由边界：$B=0$，$A=V_0/d$。
> $$\varphi(x)=\frac{V_0}{d}x$$
> 即平行板电容器内部的线性电位分布，电场 $E=-\varphi'=-V_0/d$（均匀）。

> [!example] 例 4：二维边值问题
> 承第 4 节矩形域例子，若 $a=b=1$、$V_0=1$，求 $\varphi(1/2,1/2)$ 的级数近似。
> $$\varphi=\sum_{n\ \text{odd}}\frac{4}{n\pi\sinh(n\pi)}\sin\frac{n\pi}{2}\sinh\frac{n\pi}{2}$$
> 取前两项（$n=1,3$）：
> - $n=1$：$\frac{4}{\pi\sinh\pi}\sin\frac\pi2\sinh\frac\pi2=\frac{4}{\pi}\approx1.273$
> - $n=3$：$\frac{4}{3\pi\sinh3\pi}\sin\frac{3\pi}{2}\sinh\frac{3\pi}{2}=-\frac{4}{3\pi}\approx-0.424$
> 两项和约 $0.849$，已接近真值（约 0.85）。

> [!example] 例 5：调和函数的极值
> 由最大模原理/极值原理，$\nabla^2\varphi=0$ 在区域内的解不能在内部取到严格最大值或最小值（除非为常数）。
> 因此狄利克雷问题的解由边界值完全控制——这也是唯一性定理的直观解释。

> [!tip] 本章收官
> 第 10 章把场论的两大定理与边值问题串起来：
> 1. **高斯/斯托克斯**（1）：边界积分 ↔ 内部微分；麦克斯韦方程的积分/微分形式。
> 2. **亥姆霍兹定理**（2）：任意场 = 无旋（梯度）+ 无散（旋度）；散度、旋度、边界条件唯一确定场。
> 3. **拉普拉斯/泊松方程**（3）：静电场、稳态温度场的共同方程；调和函数；边界条件与唯一性。
> 4. **分离变量法**（4）：直角/圆柱/球坐标；矩形域、圆域、球域的级数解；保角映射法（二维）。
>
> 一句话：**场论的核心是"方程 + 边界条件"；高斯/斯托克斯把方程写成积分形式，亥姆霍兹保证场的唯一分解，分离变量法给出具体解。至此，复变函数与场论的主线闭环：复分析提供解析工具，场论提供物理舞台。**

# 本章知识地图

```
场论的积分定理与边值问题
├─ 1. 高斯定理与斯托克斯定理
│     ├─ 高斯：∮A·dS=∭∇·A dV
│     ├─ 斯托克斯：∮A·dl=∬(∇×A)·dS
│     ├─ 麦克斯韦方程的积分/微分形式
│     └─ 统一视角：边界积分 = 内部微分
│
├─ 2. 亥姆霍兹定理
│     ├─ A=−∇φ+∇×B
│     ├─ 无旋部分（纵场）+ 无散部分（横场）
│     ├─ 散度 + 旋度 + 边界条件唯一确定场
│     └─ 麦克斯韦方程：场的"身份证"
│
├─ 3. 拉普拉斯/泊松方程
│     ├─ ∇²φ=0 / ∇²φ=f
│     ├─ 调和函数
│     ├─ 解析函数的实部/虚部
│     ├─ 基本解：1/r、ln r
│     └─ 边界条件：狄利克雷/诺伊曼/混合
│
├─ 4. 分离变量法
│     ├─ 直角坐标：X''/X+Y''/Y+Z''/Z=0
│     ├─ 圆柱坐标：贝塞尔方程
│     ├─ 球坐标：勒让德方程
│     ├─ 矩形域级数解
│     └─ 保角映射法（二维）
│
└─ 5. 例题
      ├─ 高斯定理求电场
      ├─ 斯托克斯求磁场
      ├─ 一维拉普拉斯
      └─ 矩形域级数解
```

# 关联

- 上一章：[[vault-notes/math/complex-analysis/09-field-theory-basics]]
- 下一章：（全书结束，回到 [[vault-notes/math/complex-analysis/00-guide]]）
- 全书骨架：[[vault-notes/math/complex-analysis/01-complex-numbers-functions]] → [[vault-notes/math/complex-analysis/02-analytic-functions]] → [[vault-notes/math/complex-analysis/03-complex-integration]] → [[vault-notes/math/complex-analysis/04-series-representation]] → [[vault-notes/math/complex-analysis/05-residues-applications]] → [[vault-notes/math/complex-analysis/06-conformal-mapping]] → [[vault-notes/math/complex-analysis/07-fourier-transform]] → [[vault-notes/math/complex-analysis/08-laplace-transform]] → [[vault-notes/math/complex-analysis/09-field-theory-basics]] → **本章**

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 高斯/斯托克斯 | 麦克斯韦方程、电磁场理论 |
| 亥姆霍兹定理 | 电磁场的唯一性；天线理论 |
| 拉普拉斯方程 | [[vault-notes/math/complex-analysis/02-analytic-functions]] 的调和函数；保角映射解边值问题 |
| 分离变量法 | 波导、天线、热传导、量子力学 |
| 边界条件与唯一性 | 数值方法（有限元/差分）的理论基础 |

**全书回顾：复变函数与场论的五层结构**

| 层 | 内容 | 对应章节 |
| --- | --- | --- |
| 1. 复数与复变函数 | 复数、初等函数、映射 | 第 1 章 |
| 2. 解析函数 | C-R、解析性、调和函数 | 第 2 章 |
| 3. 复积分 | 柯西定理/公式、高阶导数 | 第 3 章 |
| 4. 级数与留数 | 泰勒/洛朗、留数、实积分 | 第 4–5 章 |
| 5. 几何与变换 | 保角映射、傅里叶/拉氏变换 | 第 6–8 章 |
| 6. 场论 | 梯度/散度/旋度、积分定理、边值问题 | 第 9–10 章 |

**通信方向应用**：

- [[vault-notes/communication/04-channel]] —— 电磁波传播、麦克斯韦方程、坡印廷矢量；天线辐射场。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 天线阵列、波束赋形、场方向图；电磁场边值问题。
- [[vault-notes/communication/03-random-processes]] —— 随机场、相关函数；高斯场的协方差。
- [[vault-notes/math/complex-analysis/02-analytic-functions]] —— 二维拉普拉斯方程与保角映射；复势。
- [[vault-notes/matlab/matlab-notes]] —— `gradient`/`divergence`/`curl`/`pdepe`/`pdetool` 是本章的直接工具。

**相关**：[[vault-notes/math/complex-analysis/09-field-theory-basics]]｜[[vault-notes/math/complex-analysis/02-analytic-functions]]｜[[vault-notes/math/complex-analysis/06-conformal-mapping]]｜[[vault-notes/communication/04-channel]]
