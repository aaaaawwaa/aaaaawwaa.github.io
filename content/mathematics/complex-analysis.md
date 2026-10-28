---
title: 复变函数基础
description: 复数与解析函数、柯西定理与积分公式、泰勒/洛朗级数、留数围道积分与保角映射：信号与电磁场的共同数学。
tags:
  - mathematics
  - complex-analysis
  - calculus
---

## 为什么电子工程离不开复变函数

正弦稳态电路用相量法，本质是把 $e^{j\omega t}$ 提出来，只留下复数振幅；拉普拉斯变换把微分方程变成 $s$ 域代数方程，$s=\sigma+j\omega$ 就是复变函数里的复变量；傅里叶变换的收敛性、留数法求拉氏逆变换、保角映射解二维静电场边值问题，全部建立在"解析函数"这套理论上。可以说：**复变函数是信号处理与电磁场共同的数学底座**。

本文覆盖复数、解析函数、复积分、级数与留数五部分，重点是**条件**：解析要求在邻域内可导、柯西定理要求单连通且解析、留数定理要求奇点在围道内。变换部分（傅里叶、拉普拉斯、场论）见 [[mathematics/complex-transforms-and-fields|复变变换与场论]]。

## 复数及其几何表示

### 代数形式与复平面

$z=x+iy$（$i^{2}=-1$）。实部 $\operatorname{Re}z=x$、虚部 $\operatorname{Im}z=y$、共轭 $\bar z=x-iy$。复平面上的点或向量与复数一一对应：加法就是向量加法，共轭是关于实轴的镜像，模 $|z|=\sqrt{x^{2}+y^{2}}$ 是到原点的距离。

$$
|z_1-z_2|\ \text{是两点距离},\qquad
|z-z_0|=r\ \text{是以 }z_0\text{ 为心、}r\text{ 为半径的圆}
$$

辐角 $\arg z$ 是多值的（差 $2\pi$ 的整数倍），主值通常取 $(-\pi,\pi]$。

### 极形式与欧拉公式

$$
z=r(\cos\theta+i\sin\theta)=re^{i\theta},
\qquad
e^{i\theta}=\cos\theta+i\sin\theta
$$

乘法变成"模相乘、辐角相加"：$z_1z_2=r_1r_2e^{i(\theta_1+\theta_2)}$。乘 $i$ 等于逆时针转 $90^\circ$；欧拉恒等式 $e^{i\pi}=-1$ 把五个基本常数连在一起。

**棣莫弗公式**与方根：

$$
z^{n}=r^{n}e^{in\theta},
\qquad
w_k=\sqrt[n]{r}\,e^{i(\theta+2k\pi)/n},\quad k=0,1,\dots,n-1
$$

$n$ 次方根有 $n$ 个值，均匀分布在半径为 $\sqrt[n]{r}$ 的圆上。例如 $\sqrt[3]{-8}$：$-8=8e^{i\pi}$，三个根为 $2e^{i\pi/3}=1+\sqrt3i$、$2e^{i\pi}=-2$、$2e^{i5\pi/3}=1-\sqrt3i$。

> [!tip] 单位根与 DFT
> $1$ 的 $n$ 次方根 $w_k=e^{i2k\pi/n}$ 构成正 $n$ 边形顶点，且 $1+w+\cdots+w^{n-1}=0$（$w\ne1$）。这正是 DFT 矩阵行向量正交的根源：不同频率的复指数在一个周期内积分为零。工程中习惯把 $i$ 写成 $j$，于是 $e^{-j2\pi kn/N}$ 就是 DFT 的核。

## 复变函数与初等函数

### 映射与极限

复变函数 $w=f(z)$ 可写成 $f(z)=u(x,y)+iv(x,y)$，即"两个实变量的两个实函数"，但它作为"复平面到复平面的映射"有几何结构。常见映射：$z+a$ 平移；$az$ 旋转加伸缩；$1/z$ 反演加反射；$z^{2}$ 角域张角加倍；$e^{z}$ 把水平带域映成角域。

复极限要求 $z\to z_0$ 沿**任意路径**都趋于同一值——比实变量只有左右两侧强得多。因此"沿两条路径极限不同"就足以证明极限不存在。$f=u+iv$ 连续 $\iff$ $u,v$ 连续。

### 初等函数

- **指数**：$e^{z}=e^{x}(\cos y+i\sin y)$，周期 $2\pi i$，值域为 $\mathbb{C}\setminus\{0\}$。
- **对数**：$\operatorname{Ln}z=\ln|z|+i(\arg z+2k\pi)$ 多值；主值 $\ln z$ 取主辐角，在负实轴上有**支割线**，跨过它函数值跳跃 $2\pi i$。
- **幂**：$z^{\alpha}=e^{\alpha\operatorname{Ln}z}$，一般多值（$\alpha$ 为整数时单值）。
- **三角/双曲**：由指数定义，如 $\sin z=\frac{e^{iz}-e^{-iz}}{2i}$；它们在复平面**无界**（例如 $\cos(iy)=\cosh y$ 随 $|y|$ 指数增长），这与实函数的有界性直觉相反。

**例**：$\operatorname{Ln}(-1)=\ln1+i(\pi+2k\pi)=i(2k+1)\pi$；$(-1)^{1/2}=e^{\frac12\operatorname{Ln}(-1)}=e^{i(2k+1)\pi/2}=\pm i$。复数的方根与对数必须"多值地看"，写程序时要显式选择分支。

## 解析函数与 Cauchy–Riemann 方程

### 导数与 C-R 方程

$f$ 在 $z_0$ 可导定义为

$$
f'(z_0)=\lim_{\Delta z\to0}\frac{f(z_0+\Delta z)-f(z_0)}{\Delta z}
$$

极限必须沿任意方向相同。分别沿实轴（$\Delta z=\Delta x$）与虚轴（$\Delta z=i\Delta y$）逼近：

$$
f'=\frac{\partial f}{\partial x}=u_x+iv_x,
\qquad
f'=\frac{1}{i}\frac{\partial f}{\partial y}=-i(u_y+iv_y)=v_y-iu_y
$$

两者相等，比较实部与虚部得到**柯西–黎曼方程**：

$$
u_x=v_y,
\qquad
u_y=-v_x
$$

**定理**：$f=u+iv$ 在 $z_0$ 可导的充要条件是 $u,v$ 在对应点可微，且 C-R 方程成立；此时

$$
f'(z_0)=u_x+iv_x=v_y-iu_y
$$

极坐标形式（$z=re^{i\theta}$）：

$$
u_r=\frac1r v_\theta,
\qquad
v_r=-\frac1r u_\theta,
\qquad
f'(z)=e^{-i\theta}(u_r+iv_r)
$$

**例**：$f(z)=|z|^{2}=x^{2}+y^{2}$。$u=x^{2}+y^{2}$、$v=0$，C-R 要求 $2x=0$ 且 $2y=0$，故只在 $z=0$ 可导，**处处不解析**。而 $e^{z}=e^{x}\cos y+ie^{x}\sin y$ 满足 C-R 处处成立，是整函数，且 $(e^{z})'=e^{z}$。

### 解析函数

若 $f$ 在 $z_0$ 的**某邻域内处处可导**，则称在 $z_0$ 解析；在区域内每点解析则称在区域内解析。全平面解析的函数称为**整函数**（多项式、$e^{z}$、$\sin z$）；不解析的点称为**奇点**。

> [!warning] 可导不等于解析
> $|z|^{2}$ 在 $z=0$ 可导，但不存在邻域使其处处可导，所以不解析。解析是"邻域性质"，这是复分析与实分析最本质的差别之一。

解析函数的"刚性"很强：解析 $\Rightarrow$ 无穷次可导；解析 $\Rightarrow$ 邻域内可展开为幂级数；非零解析函数的零点是孤立的；两个解析函数若在有聚点的集合上相等，则处处相等（唯一性定理）。

### 调和函数

若实函数 $u(x,y)$ 有二阶连续偏导且满足**拉普拉斯方程**

$$
\nabla^{2}u=u_{xx}+u_{yy}=0
$$

则称 $u$ 为**调和函数**。若 $u,v$ 满足 C-R 方程，则称 $v$ 是 $u$ 的**共轭调和函数**，此时 $f=u+iv$ 解析。核心定理：

> 解析函数的实部与虚部都是调和函数；反之，单连通区域上的调和函数总可以（相差一个常数）作为某个解析函数的实部。

**证明（正向）**：由 C-R，$u_x=v_y$、$u_y=-v_x$，再求导得 $u_{xx}=v_{yx}$、$u_{yy}=-v_{xy}$；若 $v$ 二阶偏导连续，则 $v_{yx}=v_{xy}$，故 $u_{xx}+u_{yy}=0$。

**由 $u$ 求 $v$（积分法）**：由 $v_y=u_x$ 对 $y$ 积分得 $v=\int u_x\,dy+\phi(x)$，再用 $v_x=-u_y$ 定出 $\phi'(x)$。**例**：$u=x^{2}-y^{2}$，$u_x=2x$、$u_y=-2y$，得 $v=2xy+C$，于是

$$
f(z)=x^{2}-y^{2}+i(2xy+C)=z^{2}+iC
$$

二维静电场、稳态温度场、理想流体的势函数都满足拉普拉斯方程，因此**复变函数是二维边值问题的"解生成器"**（见 [[mathematics/complex-transforms-and-fields|复变变换与场论]]）。

## 复积分与柯西定理

### 复积分的定义

沿曲线 $C$ 的复积分用参数化计算：$z=z(t)$（$a\le t\le b$），则

$$
\int_C f(z)\,dz=\int_a^b f(z(t))\,z'(t)\,dt
$$

也可拆成两个实线积分：

$$
\int_C f\,dz=\int_C(u\,dx-v\,dy)+i\int_C(v\,dx+u\,dy)
$$

基本性质：线性、方向反转变号、路径可加；估值不等式

$$
\left|\int_C f(z)\,dz\right|\le ML,
$$

其中 $M=\max_C|f|$、$L$ 为曲线长度。**例**：沿单位圆上半周从 $1$ 到 $-1$ 积分 $\bar z$。取 $z=e^{i\theta}$（$\theta:0\to\pi$），$\bar z=e^{-i\theta}$、$dz=ie^{i\theta}d\theta$，得 $\int_0^{\pi}i\,d\theta=i\pi$。

### 柯西积分定理

> 若 $f$ 在**单连通区域** $D$ 内解析，$C$ 是 $D$ 内任意简单闭曲线，则 $\oint_C f(z)\,dz=0$。

推论：在单连通解析区域内积分与路径无关，存在原函数，牛顿–莱布尼茨公式成立。多连通区域要"挖洞"：外边界积分等于各内边界积分之和（方向都取逆时针时）。

> [!warning] 条件缺一不可
> 被积函数必须在曲线**及其内部**解析。"单连通"用于排除洞内的奇点；若曲线内有奇点，积分一般不为零，要用柯西积分公式或留数计算。

### 柯西积分公式

设 $f$ 在简单闭曲线 $C$ 及其内部解析，$z_0$ 在 $C$ 内部，则

$$
f(z_0)=\frac{1}{2\pi i}\oint_C\frac{f(z)}{z-z_0}\,dz
$$

含义：**解析函数在内部一点的值完全由边界值决定**。这与实分析形成鲜明对比，也是解析函数"刚性"的又一表现。取 $C$ 为以 $z_0$ 为心的圆，得到**平均值公式**：

$$
f(z_0)=\frac{1}{2\pi}\int_0^{2\pi}f(z_0+re^{i\theta})\,d\theta
$$

**高阶导数公式**：

$$
f^{(n)}(z_0)=\frac{n!}{2\pi i}\oint_C\frac{f(z)}{(z-z_0)^{n+1}}\,dz
$$

它说明解析函数自动无穷次可导。三个重要推论：**刘维尔定理**（有界整函数必为常数）、**莫雷拉定理**（连续且闭路积分恒为零 $\Rightarrow$ 解析）、**最大模原理**（非常数解析函数的模在区域内部取不到最大值）。

**例**：$\oint_{|z|=2}\dfrac{e^{z}}{z-1}dz=2\pi i\,e^{1}=2\pi ie$；$\oint_{|z|=1}\dfrac{\cos z}{z^{3}}dz=\dfrac{2\pi i}{2!}f''(0)=-\pi i$；$\oint_{|z|=3}\dfrac{1}{z(z-2)}dz=0$（部分分式后两个奇点贡献相消，见下一节留数）。

## 级数、奇点与留数

### 泰勒级数与洛朗级数

幂级数 $\sum a_n(z-z_0)^{n}$ 的收敛半径

$$
R=\frac{1}{\limsup_{n\to\infty}|a_n|^{1/n}}
$$

在 $|z-z_0|<R$ 内绝对收敛且可逐项求导/积分。**泰勒定理**：$f$ 在 $z_0$ 解析 $\iff$ 可在 $z_0$ 邻域展开为幂级数

$$
f(z)=\sum_{n=0}^{\infty}\frac{f^{(n)}(z_0)}{n!}(z-z_0)^{n}
$$

收敛半径等于"到最近奇点的距离"。例如 $1/(z-1)$ 在 $z=0$ 展开的收敛半径为 1。

**洛朗级数**允许负幂，用于环域 $r<|z-z_0|<R$：

$$
f(z)=\sum_{n=-\infty}^{\infty}c_n(z-z_0)^{n},
\qquad
c_n=\frac{1}{2\pi i}\oint_C\frac{f(\zeta)}{(\zeta-z_0)^{n+1}}d\zeta
$$

负幂部分称为**主要部分**，它编码了奇点信息。同一个函数在不同环域有不同展开。**例**：$f(z)=\dfrac{1}{z(z-1)}$ 在 $z_0=0$：

$$
0<|z|<1:\quad f=-\frac1z\sum_{n=0}^{\infty}z^{n}=-\sum_{n=-1}^{\infty}z^{n}
$$

$$
|z|>1:\quad f=\frac{1}{z^{2}}\cdot\frac{1}{1-1/z}=\sum_{n=2}^{\infty}z^{-n}
$$

### 孤立奇点的分类

| 类型 | 洛朗负幂部分 | 极限行为 | 例子 |
| --- | --- | --- | --- |
| 可去奇点 | 无 | 有限 | $\sin z/z$ 在 $z=0$ |
| $m$ 阶极点 | 有限项，到 $-m$ | $\infty$ | $1/z^{m}$ 在 $z=0$ |
| 本性奇点 | 无穷项 | 不存在 | $e^{1/z}$ 在 $z=0$ |

判定技巧：若 $f=P/Q$、$P(z_0)\ne0$、$Q$ 在 $z_0$ 有 $m$ 阶零点，则 $z_0$ 是 $f$ 的 $m$ 阶极点。例如 $z/(z^{2}+1)^{2}$ 在 $z=\pm i$ 都是二阶极点。

### 留数与留数定理

**留数**定义为洛朗系数 $c_{-1}$：

$$
\operatorname{Res}[f,z_0]=c_{-1}=\frac{1}{2\pi i}\oint_C f(z)\,dz
$$

**留数定理**：若 $f$ 在闭曲线 $C$ 内除有限个孤立奇点外解析，则

$$
\oint_C f(z)\,dz=2\pi i\sum_{k}\operatorname{Res}[f,z_k]
$$

（$C$ 取逆时针，只算内部奇点。）计算方法：

- 简单极点：$\operatorname{Res}[f,z_0]=\lim_{z\to z_0}(z-z_0)f(z)$；若 $f=P/Q$、$Q(z_0)=0$、$Q'(z_0)\ne0$，则 $\operatorname{Res}=P(z_0)/Q'(z_0)$。
- $m$ 阶极点：

$$
\operatorname{Res}[f,z_0]=\frac{1}{(m-1)!}\lim_{z\to z_0}\frac{d^{m-1}}{dz^{m-1}}\left[(z-z_0)^{m}f(z)\right]
$$

- 本性奇点：展开洛朗级数取 $c_{-1}$。

**例**：$f(z)=\dfrac{z}{z^{2}+1}$ 在 $z=\pm i$ 的留数都是 $1/2$；$f(z)=\dfrac{1}{z(z-1)^{3}}$ 在 $z=1$ 的留数为

$$
\frac{1}{2!}\lim_{z\to1}\frac{d^{2}}{dz^{2}}\left[\frac1z\right]=\frac12\cdot2=1
$$

### 用留数计算实积分

**三角函数有理式**：令 $z=e^{i\theta}$，$d\theta=dz/(iz)$，积分化为单位圆围道：

$$
I=\int_0^{2\pi}R(\cos\theta,\sin\theta)\,d\theta
=2\pi i\sum_{|z_k|<1}\operatorname{Res}
$$

**例**：$\displaystyle I=\int_0^{2\pi}\frac{d\theta}{2+\cos\theta}$。代入 $\cos\theta=(z+z^{-1})/2$，

$$
I=\frac{2}{i}\oint_{|z|=1}\frac{dz}{z^{2}+4z+1}
$$

分母零点 $-2\pm\sqrt3$，只有 $-2+\sqrt3$ 在单位圆内，留数为 $\dfrac{1}{i\sqrt3}$，故 $I=\dfrac{2\pi}{\sqrt3}$。

**有理函数的无穷积分**：若 $Q$ 无实零点且 $\deg Q\ge\deg P+2$，取上半平面大围道，

$$
\int_{-\infty}^{\infty}\frac{P(x)}{Q(x)}dx
=2\pi i\sum_{\operatorname{Im}z_k>0}\operatorname{Res}
$$

**例**：$\int_{-\infty}^{\infty}\frac{dx}{x^{2}+1}=2\pi i\cdot\frac{1}{2i}=\pi$。

**含 $e^{iax}$ 的积分**（$a>0$）：由约当引理，大圆弧贡献趋于零，

$$
\int_{-\infty}^{\infty}\frac{P(x)}{Q(x)}e^{iax}dx
=2\pi i\sum_{\operatorname{Im}z_k>0}\operatorname{Res}
$$

**例**：$\int_{-\infty}^{\infty}\frac{e^{ix}}{x^{2}+1}dx=2\pi i\cdot\frac{e^{-1}}{2i}=\frac{\pi}{e}$。

**实轴上有简单极点**：挖去小半圆，取柯西主值：

$$
\mathrm{PV}\int_{-\infty}^{\infty}f(x)\,dx
=2\pi i\sum_{\text{上半}}\operatorname{Res}+i\pi\sum_{\text{实轴}}\operatorname{Res}
$$

由此得 $\displaystyle\int_{-\infty}^{\infty}\frac{\sin x}{x}dx=\pi$。

> [!tip] 留数法求拉氏逆变换
> 若 $F(s)$ 的极点都在某条竖线左侧，则 $f(t)=\sum_k\operatorname{Res}[F(s)e^{st},s_k]$（$t>0$）。例如 $F(s)=\frac{1}{s^{2}+3s+2}=\frac{1}{s+1}-\frac{1}{s+2}$，极点为 $-1,-2$，反变换为 $e^{-t}-e^{-2t}$。这就是"部分分式法"的复变解释，也是 [[mathematics/complex-transforms-and-fields|复变变换与场论]] 中 s 域分析的依据。

## 保角映射

### 定义与几何意义

若 $f$ 在 $z_0$ 解析且 $f'(z_0)\ne0$，则 $f$ 在 $z_0$ 附近**保角**：任意两条曲线在该点的夹角大小与方向都不变，且局部是"旋转 $\arg f'(z_0)$ + 伸缩 $|f'(z_0)|$"的相似变换。$f'(z_0)=0$ 的点不保角（角度可能放大整数倍）。

### 分式线性映射

$$
w=\frac{az+b}{cz+d},
\qquad
ad-bc\ne0
$$

四条性质：一一对应（逆映射仍是分式线性）；复合封闭；**保圆性**（圆或直线映成圆或直线，直线视为过无穷远点的圆）；**保交比**：

$$
(w_1,w_2;w_3,w_4)=(z_1,z_2;z_3,z_4),
\qquad
(z_1,z_2;z_3,z_4)=\frac{(z_1-z_3)(z_2-z_4)}{(z_1-z_4)(z_2-z_3)}
$$

三对对应点唯一确定一个分式线性映射：

$$
\frac{w-w_1}{w-w_2}\cdot\frac{w_3-w_2}{w_3-w_1}
=
\frac{z-z_1}{z-z_2}\cdot\frac{z_3-z_2}{z_3-z_1}
$$

**例（上半平面 → 单位圆）**：$w=\dfrac{z-i}{z+i}$。验证：实轴 $z=x$ 上 $|w|=\dfrac{|x-i|}{|x+i|}=1$，实轴映成单位圆；$z=i$ 映到 $0$，上半平面映到圆内。其逆映射把单位圆映回上半平面。

### 初等映射与用途

- 幂函数 $w=z^{n}$：角域 $0<\arg z<\alpha$ 映成张角 $n\alpha$ 的角域；$w=z^{4}$ 把 $0<\arg z<\pi/4$ 映成上半平面。
- 指数函数 $w=e^{z}$：水平带域 $0<\operatorname{Im}z<\pi$ 映成上半平面；周期 $2\pi i$。
- 对数函数 $w=\ln z$：指数函数的逆，把角域映回水平带域，主值支在负实轴有支割线。
- 儒可夫斯基变换 $w=z+\dfrac1z$：圆 $|z|=r$ 映成椭圆

$$
u=\left(r+\frac1r\right)\cos\theta,
\qquad
v=\left(r-\frac1r\right)\sin\theta
$$

$|z|=2$ 映成椭圆 $\dfrac{u^{2}}{(5/2)^{2}}+\dfrac{v^{2}}{(3/2)^{2}}=1$；过 $\pm1$ 的圆映成翼型，是空气动力学的经典工具。

**用途**：把复杂区域（角域、带域、圆外）映射成上半平面或单位圆，然后在规则区域解拉普拉斯方程，再变换回去——这是二维静电场、热传导、势流问题的标准解法。**黎曼映射定理**保证：任意单连通非全平面区域都能保角映射到单位圆（存在性，构造另说）。

## 代码验证

```python
import numpy as np

# 1) 单位根与正交性
N = 8
w = np.exp(2j * np.pi * np.arange(N) / N)
print("单位根和:", np.round(w.sum(), 12))      # ≈ 0
print("DFT 矩阵列正交:", np.allclose(
    np.exp(-2j*np.pi*np.outer(np.arange(N), np.arange(N))/N)
    .conj().T @ np.exp(-2j*np.pi*np.outer(np.arange(N), np.arange(N))/N),
    N*np.eye(N)))

# 2) 用 sympy 验证 C-R 方程与留数
import sympy as sp
x, y = sp.symbols('x y', real=True)
z = sp.symbols('z')
f = sp.exp(z)
u = sp.re(sp.expand(f.subs(z, x + sp.I*y)))
v = sp.im(sp.expand(f.subs(z, x + sp.I*y)))
print("u_x - v_y =", sp.simplify(sp.diff(u, x) - sp.diff(v, y)))  # 0
print("u_y + v_x =", sp.simplify(sp.diff(u, y) + sp.diff(v, x)))  # 0
print("Res[1/(z^2+1), i] =", sp.residue(1/(z**2 + 1), z, sp.I))   # -I/2
print("e^(1/z) 展开:", sp.series(sp.exp(1/z), z, 0, 4))
```

## 易错点

> [!warning] 复变函数的高频错误
> 1. **忽略多值性**：$\operatorname{Ln}z$、$z^{\alpha}$、$\sqrt[n]{z}$ 都是多值的，必须说明取哪一支；跨支割线时函数值会跳变。
> 2. **"可导"当"解析"**：解析要求邻域内处处可导，单点可导不解析（$|z|^{2}$ 在 0 点）。
> 3. **乱用柯西定理**：曲线内部有奇点、区域不是单连通时不能直接得 0。
> 4. **围道方向与符号**：留数定理默认逆时针；顺时针要加负号。奇点"在内部"还是"在边界上"必须画图确认（边界上的奇点不能直接用公式）。
> 5. **保角映射忘记 $f'\ne0$**：$z^{n}$ 在 $z=0$ 不保角；分式线性映射的 $ad-bc\ne0$ 也是必要条件。
> 6. **把"共轭调和"当复共轭**：共轭调和指 C-R 配对（$u+iv$ 解析），不是 $v=\bar u$。

## 前置与相关

前置：微积分（多元偏导、线积分）、[[mathematics/linear-algebra-basics|线性代数基础]]（复数运算、矩阵）。下一步：[[mathematics/complex-transforms-and-fields|复变变换与场论]]（傅里叶变换、拉普拉斯变换、场论与边值问题）。

相关应用：[[signal-processing/signals-and-systems-intro|信号与系统导论]]（s 域与系统函数）、[[signal-processing/dft-and-fft|DFT 与 FFT]]（单位根与正交基）、[[communication/analog-modulation-am|模拟调制 AM]]（复包络与相量）。

## 来源与延伸阅读

- [[vault-notes/math/complex-analysis/00-guide|复变函数与场论知识库总导读]]：全书结构、学习顺序、与其他知识库的联系。
- [[vault-notes/math/complex-analysis/01-complex-numbers-functions|复数与复变函数（详细笔记）]]：复平面、极形式、棣莫弗公式、方根、初等函数、例题。
- [[vault-notes/math/complex-analysis/02-analytic-functions|解析函数（详细笔记）]]：导数、C-R 方程（直角/极坐标）、解析的判定、调和函数、由 $u$ 求 $v$、例题。
- [[vault-notes/math/complex-analysis/03-complex-integration|复变函数的积分（详细笔记）]]：复积分定义与估值、柯西积分定理、多连通推广、柯西公式、平均值公式、高阶导数、刘维尔/莫雷拉/最大模原理。
- [[vault-notes/math/complex-analysis/04-series-representation|解析函数的级数表示（详细笔记）]]：幂级数收敛半径、泰勒级数、洛朗级数、孤立奇点分类、极点判定。
- [[vault-notes/math/complex-analysis/05-residues-applications|留数及其应用（详细笔记）]]：留数与留数定理、简单/高阶极点计算、三角有理式、有理函数、约当引理、实轴奇点、主值积分。
- [[vault-notes/math/complex-analysis/06-conformal-mapping|保角映射（详细笔记）]]：保角性、分式线性映射、交比、三类基本映射、幂/指数/对数/儒可夫斯基变换、区域映射例题。
