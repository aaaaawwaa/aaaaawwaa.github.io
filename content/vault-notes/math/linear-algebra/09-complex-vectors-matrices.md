---
title: "复向量和复矩阵"
tags:
- 数学
- 线性代数
type: course
subjects:
- 线性代数
domains:
- 数学基础
status: learning
aliases: []
prerequisites: []
related: []
---

> [!abstract] 本章在讲什么
> 前八章都在实数里。但通信里的信号几乎都是复的（$e^{j\omega t}$、I/Q、相位），所以这一章把整个线性代数"复化"——好消息是**改动极小**：只需把"转置"升级成"共轭转置"。
>
> - **9.1** 复数：$z=a+bj$、共轭、模；极形式 $re^{j\theta}$；**乘法 = 旋转 + 伸缩**（模相乘、幅角相加）
> - **9.2** 埃尔米特矩阵和酉矩阵：复内积取共轭 ⇒ **埃尔米特**（$A^{H}=A$）的特征值全实、**酉矩阵**（$U^{H}=U^{-1}$）的特征值都在单位圆上——第 6 章"对称 + 正交"的复数版
> - **9.3** 快速傅里叶变换：单位根、傅里叶矩阵 $F$（$F^{H}F=nI$）；**一步分解 + 递归**把 $O(n^2)$ 降到 $O(n\log n)$——通信里最重要的矩阵算法
>
> 一句话主线：**复数不是"多出来的一维"，而是"旋转 + 伸缩"的记号；把它写成矩阵，线性代数的所有结论照搬，只是"转置"要换成"共轭转置"。**

> [!note] 记号约定
> - $j=\sqrt{-1}$（**工程惯例**，因为 $i$ 留给了电流）；数学书里写作 $i$
> - $\bar z$：**共轭**（conjugate）；$\lvert z\rvert$：**模**；$\arg z$：**幅角**（相位）
> - $A^{H}=\bar A^{T}$：**共轭转置**（conjugate transpose），也叫 Hermitian 转置
> - $\langle\mathbf{v},\mathbf{w}\rangle=\mathbf{v}^{H}\mathbf{w}$：**复内积**（**第一个向量取共轭**）
> - $\omega=e^{2\pi j/n}$：$n$ 次**单位根**；$F$：**傅里叶矩阵**
> - 沿用前面：$\mathbf{C}(A)$、$\mathbf{N}(A)$、$\lambda$、$\sigma$、$U$（酉矩阵）

# 9.1 复数

实数不够用不是数学家的洁癖——**"旋转"根本没法用一个实数表示**。复数就是为了把"旋转 + 伸缩"装进一个记号。

> [!info] Def 1 复数
> 复数 $z=a+bj$（$a,b$ 为实数，$j^{2}=-1$）。
> - **实部** $\operatorname{Re}z=a$，**虚部** $\operatorname{Im}z=b$；
> - **共轭**（conjugate）：$\bar z=a-bj$；
> - **模**（modulus）：$\lvert z\rvert=\sqrt{a^{2}+b^{2}}$；
> - 加法和乘法按实数运算法则展开，只需记住 $j^{2}=-1$。

三条随取随用的恒等式：

$$
z\bar z=\lvert z\rvert^{2},\qquad \frac1z=\frac{\bar z}{\lvert z\rvert^{2}}\ (z\ne0),\qquad \operatorname{Re}z=\frac{z+\bar z}{2},\quad \operatorname{Im}z=\frac{z-\bar z}{2j}
$$

**例**：$z=1+j$：$\lvert z\rvert=\sqrt2$、$\bar z=1-j$、$\dfrac1z=\dfrac{1-j}{2}$ ✓

## 复平面

把 $z=a+bj$ 画成平面上的点 $(a,b)$，就得到**复平面**（complex plane）：

- **加法** = 向量加法（平行四边形法则，与 $\mathbb{R}^2$ 完全一样）；
- **共轭** = 关于实轴镜像；
- **模** = 到原点的距离；
- **乘法** = **旋转 + 伸缩**（下面细讲，这是复数最重要的几何意义）。

$n$ 维复向量空间 $\mathbb{C}^n$ 就是把 $\mathbb{R}^n$ 的每个分量换成复数——**所有线性代数结论原样成立**（子空间、基、维数、秩……一个字都不用改），只有"内积"要动手术（9.2）。

## 极形式re^jθ

平面上的点也可以用"距离 + 角度"表示。把两条信息合写成指数，就得到本章最有用的公式。

> [!info] Def 2 极形式与欧拉公式
> $$
> z=re^{j\theta},\qquad r=\lvert z\rvert\ge0,\quad \theta=\arg z
> $$
> 其中**欧拉公式**（Euler's formula）说明了指数与三角函数的关系：
> $$
> e^{j\theta}=\cos\theta+j\sin\theta
> $$
> （把 $e^{j\theta}$、$\cos\theta$、$\sin\theta$ 都按泰勒级数展开，实部虚部分别对齐即得。）

**三个必须记住的特例**：

$$
e^{j0}=1,\qquad e^{j\pi/2}=j,\qquad \boxed{e^{j\pi}=-1}
$$

（最后一个是欧拉恒等式 $e^{j\pi}+1=0$，把 $e,\ j,\ \pi,\ 1,\ 0$ 五个常数串在一起。）

> [!tip] 同一个复数的四种面孔
> | 表示 | 写法 | 擅长 |
> | --- | --- | --- |
> | 直角坐标 | $a+bj$ | 加法、实虚部分离 |
> | 极坐标 | $re^{j\theta}$ | **乘法、除法、幂** |
> | 平面上的点/向量 | $(a,b)$ | 几何直觉 |
> | $2\times2$ 实矩阵 | $\begin{bmatrix}a&-b\\b&a\end{bmatrix}$ | **代数化**：复数等价于"旋转伸缩矩阵" |
> 最后一行值得多看一眼：$a+bj$ 与矩阵 $\begin{bmatrix}a&-b\\b&a\end{bmatrix}$ 的加法、乘法**完全同构**（$j\leftrightarrow\begin{bmatrix}0&-1\\1&0\end{bmatrix}$，而后者正是旋转 $90°$ 的矩阵！）。**"乘 $j$ = 旋转 $90°$"这句话，在矩阵语言里就是第 6 章的那个旋转矩阵。**

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 340" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la9-z" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la9-c" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-muted,#57606a)"/>
    </marker>
    <marker id="la9-ax" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <!-- 左：复平面 -->
  <text x="200" y="44" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">复平面：z = 1 + j</text>
  <line x1="110" y1="190" x2="325" y2="190" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la9-ax)"/>
  <line x1="200" y1="290" x2="200" y2="72" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la9-ax)"/>
  <text x="330" y="194" font-size="11" fill="var(--text-faint,#8b949e)">实轴</text>
  <text x="204" y="70" font-size="11" fill="var(--text-faint,#8b949e)">虚轴</text>
  <line x1="200" y1="190" x2="200" y2="130" stroke="var(--text-faint,#8b949e)" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="200" y1="130" x2="260" y2="130" stroke="var(--text-faint,#8b949e)" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="200" y1="190" x2="260" y2="130" stroke="#4f46e5" stroke-width="2.4" marker-end="url(#la9-z)"/>
  <line x1="200" y1="190" x2="260" y2="250" stroke="var(--text-muted,#57606a)" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#la9-c)"/>
  <path d="M240,190 A40 40 0 0 0 228.3,161.7" fill="none" stroke="#d97706" stroke-width="1.4"/>
  <text x="246" y="172" font-size="11.5" font-weight="600" fill="#d97706">θ = π/4</text>
  <text x="268" y="126" font-size="12" font-weight="700" fill="#4f46e5">z = 1 + j</text>
  <text x="268" y="266" font-size="11.5" fill="var(--text-muted,#57606a)">z̄ = 1 − j（共轭 = 镜像）</text>
  <text x="130" y="228" font-size="11.5" font-weight="600" fill="#4f46e5">|z| = √2</text>
  <circle cx="200" cy="190" r="3" fill="var(--text-normal,#1f2328)"/>

  <!-- 右：乘法 = 旋转 + 伸缩 -->
  <text x="620" y="44" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">乘法 = 旋转 + 伸缩</text>
  <line x1="500" y1="190" x2="780" y2="190" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la9-ax)"/>
  <line x1="600" y1="300" x2="600" y2="72" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la9-ax)"/>
  <line x1="600" y1="190" x2="660" y2="160" stroke="#4f46e5" stroke-width="2.4" marker-end="url(#la9-z)"/>
  <line x1="600" y1="190" x2="720" y2="130" stroke="#059669" stroke-width="2.4" marker-end="url(#la9-z)"/>
  <line x1="600" y1="190" x2="570" y2="130" stroke="#db2777" stroke-width="2.4" marker-end="url(#la9-z)"/>
  <path d="M660,160 A75 75 0 0 0 640,145" fill="none" stroke="#db2777" stroke-width="1.3"/>
  <text x="666" y="156" font-size="12" font-weight="700" fill="#4f46e5">z</text>
  <text x="726" y="126" font-size="12" font-weight="700" fill="#059669">2z（模 ×2）</text>
  <text x="536" y="126" font-size="12" font-weight="700" fill="#db2777">jz（转 90°）</text>
  <circle cx="600" cy="190" r="3" fill="var(--text-normal,#1f2328)"/>
  <text x="620" y="238" font-size="11.5" fill="var(--text-muted,#57606a)">乘 2：方向不变、长度 ×2</text>
  <text x="620" y="262" font-size="11.5" fill="var(--text-muted,#57606a)">乘 j：长度不变、方向转 90°</text>
  <text x="620" y="288" font-size="11.5" font-weight="600" fill="#d97706">一般：乘 re^(jθ) = 转 θ、伸 r 倍</text>
</svg>

## 幂与乘积：极形式

极形式把"乘法"这件麻烦事变成两个简单动作。

> [!tip] 定理 模相乘、幅角相加
> $$
> (r_1e^{j\theta_1})(r_2e^{j\theta_2})=r_1r_2\,e^{j(\theta_1+\theta_2)}
> \qquad\qquad
> \frac{r_1e^{j\theta_1}}{r_2e^{j\theta_2}}=\frac{r_1}{r_2}e^{j(\theta_1-\theta_2)}
> $$
> $$
> (re^{j\theta})^{n}=r^{n}e^{jn\theta}\qquad\text{（棣莫弗定理 de Moivre）}
> $$
> 于是 $\lvert z_1z_2\rvert=\lvert z_1\rvert\lvert z_2\rvert$、$\arg(z_1z_2)=\arg z_1+\arg z_2$ ✓（已验证：$z=1+j$、$w=\sqrt3+j$ 时 $\lvert zw\rvert=2\sqrt2$、$\arg(zw)=0.785+0.524=1.309$ ✓）

**例**：$(1+j)^{4}$：

$$
1+j=\sqrt2\,e^{j\pi/4}\ \Longrightarrow\ (1+j)^{4}=(\sqrt2)^{4}e^{j\pi}=4\times(-1)=-4
$$

（逐步验算：$(1+j)^{2}=2j$，$(2j)^{2}=4j^{2}=-4$ ✓）

> [!tip] 三条"旋转"口诀（通信里的日常）
> - 乘 $j$ = **逆时针转 90°**；乘 $-1$ = 转 180°；乘 $e^{j\theta}$ = 转 $\theta$；
> - 乘 $re^{j\theta}$ = **转 $\theta$ 再伸缩 $r$ 倍**——这就是为什么增益和相位可以分开处理；
> - 共轭 $\bar z$ 对应"反转相位"，在频域里就是**取镜像频率**（负频率）。

> [!note] 通信方向：复数是"I/Q"的数学形式
> 带通信号用一个复基带信号表示：$s(t)=\operatorname{Re}\{u(t)e^{j\omega_ct}\}$——实部是物理波形，$u(t)$ 里的**幅值 = 包络、幅角 = 相位**，两个实信号（I 与 Q）打包成一个复数。于是：
> - **调制** = 乘一个复指数（旋转星座点）；**相位偏移** = 乘 $e^{j\phi}$；**时延** = 乘 $e^{-j\omega\tau}$（频率越高转得越多，这正是相位的色散行为）；
> - **相干解调** = 乘 $e^{-j\omega_ct}$ 后取实部；**星座图**就是复平面上的点集（QPSK 是四次单位根！✓ 4-QAM 的星座点正是 $1,j,-1,-j$——**与 9.3 的单位根同源**）。

# 9.2 埃尔米特矩阵和酉矩阵

从实到复，只有一件事必须改：内积。

## 复内积

> [!info] Def 3 复内积
> $$
> \langle\mathbf{v},\mathbf{w}\rangle=\mathbf{v}^{H}\mathbf{w}=\bar v_1w_1+\bar v_2w_2+\cdots+\bar v_nw_n
> $$
> 关键在**第一个向量取共轭**。等价地：
> $$
> \mathbf{v}^{H}\mathbf{w}=\overline{\mathbf{w}^{H}\mathbf{v}},\qquad \lVert\mathbf{v}\rVert^{2}=\mathbf{v}^{H}\mathbf{v}=\lvert v_1\rvert^{2}+\cdots+\lvert v_n\rvert^{2}
> $$

**为什么要共轭？** 因为要让**长度是实数**：

$$
\mathbf{v}^{T}\mathbf{v}=\sum v_i^{2}\ \text{可能是复数或零（例如 }v=(1,j)\text{ 时 }1+j^{2}=0\text{）},\qquad
\mathbf{v}^{H}\mathbf{v}=\sum\lvert v_i\rvert^{2}>0\ \text{永远是正实数}\ \checkmark
$$

（验证：$\mathbf{v}=(1+j,\ 2-j)$ 时 $\mathbf{v}^{H}\mathbf{v}=2+5=7$ ✓）

复内积的三条性质：**共轭对称** $\langle\mathbf{v},\mathbf{w}\rangle=\overline{\langle\mathbf{w},\mathbf{v}\rangle}$；**正定** $\langle\mathbf{v},\mathbf{v}\rangle>0$（$\mathbf{v}\ne\mathbf{0}$）；**对第二个变量线性**。正交的定义照旧：$\mathbf{v}^{H}\mathbf{w}=0$ ✓ 勾股定理照旧成立 ✓

## 埃尔米特矩阵

> [!info] Def 4 埃尔米特矩阵
> $$
> A^{H}=A\qquad(\text{即}\ a_{ij}=\bar a_{ji})
> $$
> 称 $A$ 为**埃尔米特矩阵**（Hermitian matrix）。**实对称矩阵是它的特例**（$A^{T}=A$）。

> [!tip] 定理 埃尔米特矩阵的三个保证（第 6 章对称矩阵的复版）
> 1. **对角元必为实数**（$a_{ii}=\bar a_{ii}$）；
> 2. **特征值全为实数**；
> 3. **特征向量互相正交**（在复内积意义下），且可以**酉对角化**：
>    $$
>    A=U\Lambda U^{H}\qquad(\Lambda\ \text{实对角},\ U\ \text{酉矩阵})
>    $$
> ——这就是**谱定理**（spectral theorem）的完整形态，第 6 章只讲了它的实数情形。
> 附带一条：对埃尔米特 $A$，二次型 $\mathbf{x}^{H}A\mathbf{x}$ **一定是实数**（它是能量，不能是复数）。

**例**：$A=\begin{bmatrix}2&1+j\\1-j&3\end{bmatrix}$（对角实、非对角共轭对称 ⇒ 埃尔米特 ✓）

$$
\text{特征值}=1,\ 4\ \text{（实数 ✓）},\qquad \text{特征向量正交 ✓}
$$

**反埃尔米特矩阵**（skew-Hermitian）$A^{H}=-A$：**特征值纯虚**、对角元纯虚 ✓
最简例子：$A=\begin{bmatrix}0&-1\\1&0\end{bmatrix}$（实反对称是它的特例）⇒ $\lambda=\pm j$ ✓（第 6 章那个 $90°$ 旋转）

## 酉矩阵

> [!info] Def 5 酉矩阵
> $$
> U^{H}U=I\qquad\Longleftrightarrow\qquad U^{H}=U^{-1}
> $$
> 称 $U$ 为**酉矩阵**（unitary matrix）。**实正交矩阵是它的特例**（第 4 章）。

> [!tip] 定理 酉矩阵的三条性质
> 1. **列（行）在复内积下标准正交**；
> 2. **保内积、保范数**：$\lVert U\mathbf{x}\rVert=\lVert\mathbf{x}\rVert$、$(U\mathbf{x})^{H}(U\mathbf{y})=\mathbf{x}^{H}\mathbf{y}$ ✓
>    （这就是**能量守恒**：酉变换不改变信号的能量）
> 3. **特征值全在单位圆上**：$\lvert\lambda\rvert=1$ ✓（每个方向都不放大不缩小）；
> 4. 条件数 $=1$ ⇒ **数值上最安全的变换**（第 4 章）。

**已验证的例子**：

- **傅里叶矩阵** $F/\sqrt n$ 是酉矩阵 ✓（$F^{H}F=nI$，9.3 的主角）
- $3$ 阶傅里叶矩阵 $F_3/\sqrt3$ 的特征值：$1,-1,j$——**全在单位圆上** ✓
- 实旋转矩阵、置换矩阵都是酉矩阵的特例 ✓

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 320" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la9-ax2" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <!-- 坐标 -->
  <line x1="140" y1="160" x2="520" y2="160" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la9-ax2)"/>
  <line x1="300" y1="290" x2="300" y2="26" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la9-ax2)"/>
  <text x="526" y="164" font-size="11" fill="var(--text-faint,#8b949e)">Re</text>
  <text x="304" y="24" font-size="11" fill="var(--text-faint,#8b949e)">Im</text>
  <circle cx="300" cy="160" r="100" fill="none" stroke="#4f46e5" stroke-width="1.4" stroke-dasharray="6 4"/>
  <text x="404" y="140" font-size="11" fill="#4f46e5">|λ| = 1</text>

  <!-- 埃尔米特：实轴 -->
  <circle cx="350" cy="160" r="5" fill="#059669"/>
  <circle cx="240" cy="160" r="5" fill="#059669"/>
  <circle cx="370" cy="160" r="5" fill="#059669"/>
  <text x="200" y="188" font-size="12" font-weight="600" fill="#059669">埃尔米特：λ 全在实轴上</text>

  <!-- 反埃尔米特：虚轴 -->
  <circle cx="300" cy="80" r="5" fill="#d97706"/>
  <circle cx="300" cy="245" r="5" fill="#d97706"/>
  <text x="308" y="72" font-size="12" font-weight="600" fill="#d97706">反埃尔米特：λ 纯虚</text>

  <!-- 酉：单位圆 -->
  <circle cx="400" cy="160" r="5" fill="#4f46e5"/>
  <circle cx="376.6" cy="95.7" r="5" fill="#4f46e5"/>
  <circle cx="235.7" cy="83.4" r="5" fill="#4f46e5"/>
  <circle cx="223.4" cy="224.3" r="5" fill="#4f46e5"/>
  <text x="410" y="236" font-size="12" font-weight="600" fill="#4f46e5">酉矩阵：λ 都在单位圆上</text>

  <!-- 说明 -->
  <text x="570" y="86" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">特征值住在哪里</text>
  <text x="570" y="118" font-size="12" fill="#059669">埃尔米特 A^H = A ⟹ λ 实</text>
  <text x="570" y="144" font-size="12" fill="#d97706">反埃尔米特 A^H = −A ⟹ λ 纯虚</text>
  <text x="570" y="170" font-size="12" fill="#4f46e5">酉 U^H = U⁻¹ ⟹ |λ| = 1</text>
  <text x="570" y="208" font-size="11.5" fill="var(--text-muted,#57606a)">实对称 / 实反对称 / 实正交</text>
  <text x="570" y="230" font-size="11.5" fill="var(--text-muted,#57606a)">分别是它们的实数特例</text>
  <text x="570" y="268" font-size="11.5" font-weight="600" fill="#4f46e5">共同点：都能酉对角化</text>
  <text x="570" y="292" font-size="11.5" fill="var(--text-muted,#57606a)">A = UΛU^H，U 酉 ⟹ 数值稳定</text>
</svg>

> [!note] 通信方向：$\mathbf{H}^{H}$ 为什么到处都是
> - **协方差矩阵** $R=E[\mathbf{h}\mathbf{h}^{H}]$ 是埃尔米特半正定 ⇒ 特征值非负（各"特征波束"的功率）、特征向量正交（第 6、7 章）✓
> - **MMSE 检测/估计**里出现的 $\mathbf{H}^{H}\mathbf{H}+\sigma^{2}I$ 是埃尔米特正定 ⇒ 必有逆、解唯一（第 6.5 节）✓
> - **酉变换保能量**：DFT（$F/\sqrt n$ 酉）使"时域能量 = 频域能量"——这就是**帕塞瓦尔定理**（Parseval），也是 OFDM 里"换到频域不会白送/白丢功率"的根据 ✓
> - **相位旋转**在数学上就是乘一个酉矩阵（对角酉 = 纯相移），这正是**星座旋转**与**预编码**里"只改相位不改功率"的严格表述 ✓

# 9.3 快速傅里叶变换

傅里叶矩阵把"换基"这件事做到了极致：**它是一组正交基，而且乘法可以用几乎免费的方式算出**。

## 单位根与傅里叶变换

> [!info] Def 6 $n$ 次单位根
> **$n$ 次单位根**（roots of unity）：
> $$
> \omega=e^{2\pi j/n},\qquad \omega^{n}=1
> $$
> 它把单位圆**等分成 $n$ 份**：$1,\omega,\omega^{2},\dots,\omega^{n-1}$ 是方程 $z^{n}=1$ 的全部根。
> 一条反复要用的恒等式：**所有单位根之和为零**
> $$
> 1+\omega+\omega^{2}+\cdots+\omega^{n-1}=0
> $$
> （它们首尾相接正好绕一圈，向量和当然为零。）

**$n=4$ 时**：$\omega=e^{2\pi j/4}=j$，四个根正是 $1,\ j,\ -1,\ -j$ ✓ ——**恰好是 QPSK 的星座点**！

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 320" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la9-ax3" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <line x1="150" y1="160" x2="470" y2="160" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la9-ax3)"/>
  <line x1="300" y1="296" x2="300" y2="30" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la9-ax3)"/>
  <circle cx="300" cy="160" r="110" fill="none" stroke="#4f46e5" stroke-width="1.3" stroke-dasharray="6 4"/>
  <polygon points="410,160 377.8,82.2 300,50 222.2,82.2 190,160 222.2,237.8 300,270 377.8,237.8" fill="#4f46e5" fill-opacity="0.08" stroke="#4f46e5" stroke-opacity="0.5" stroke-width="1.2"/>
  <g fill="#4f46e5">
    <circle cx="410" cy="160" r="4.5"/><circle cx="377.8" cy="82.2" r="4.5"/><circle cx="300" cy="50" r="4.5"/>
    <circle cx="222.2" cy="82.2" r="4.5"/><circle cx="190" cy="160" r="4.5"/><circle cx="222.2" cy="237.8" r="4.5"/>
    <circle cx="300" cy="270" r="4.5"/><circle cx="377.8" cy="237.8" r="4.5"/>
  </g>
  <text x="418" y="156" font-size="12" font-weight="700" fill="#4f46e5">ω⁰ = 1</text>
  <text x="310" y="44" font-size="12" font-weight="700" fill="#4f46e5">ω² = j</text>
  <text x="150" y="176" font-size="12" font-weight="700" fill="#4f46e5">ω⁴ = −1</text>
  <text x="310" y="288" font-size="12" font-weight="700" fill="#4f46e5">ω⁶ = −j</text>
  <text x="326" y="106" font-size="11" fill="var(--text-muted,#57606a)">ω</text>
  <text x="252" y="106" font-size="11" fill="var(--text-muted,#57606a)">ω³</text>

  <text x="540" y="82" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">n 次单位根把单位圆等分成 n 份</text>
  <text x="540" y="112" font-size="12" fill="var(--text-normal,#1f2328)">ω = e^(2πj/n)，ω^n = 1</text>
  <text x="540" y="152" font-size="12" fill="#059669">1 + ω + ω² + … + ω^(n−1) = 0</text>
  <text x="540" y="176" font-size="11.5" fill="var(--text-muted,#57606a)">（首尾相接绕一圈，向量和为零）</text>
  <text x="540" y="216" font-size="12" fill="var(--text-normal,#1f2328)">n = 4 的四个根 = 1, j, −1, −j</text>
  <text x="540" y="240" font-size="11.5" fill="var(--text-muted,#57606a)">—— 正是 QPSK 的四个星座点</text>
  <text x="540" y="280" font-size="11.5" fill="#4f46e5">傅里叶矩阵的列就由这些根搭成</text>

  <text x="420" y="312" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">单位根是"离散频率"：第 k 个根代表第 k 个谐波，正交性来自"整周期积分为零"</text>
</svg>

> [!info] Def 7 傅里叶矩阵
> **傅里叶矩阵**（Fourier matrix）：
> $$
> F_n=\begin{bmatrix}
> 1&1&1&\cdots&1\\
> 1&\omega&\omega^{2}&\cdots&\omega^{n-1}\\
> 1&\omega^{2}&\omega^{4}&\cdots&\omega^{2(n-1)}\\
> \vdots&\vdots&\vdots&&\vdots\\
> 1&\omega^{n-1}&\omega^{2(n-1)}&\cdots&\omega^{(n-1)^{2}}
> \end{bmatrix},\qquad (F)_{jk}=\omega^{jk}
> $$
> - $F$ 是**对称**的（$\omega^{jk}=\omega^{kj}$）；
> - **列与列正交**：$F^{H}F=nI$ ⇒ $\dfrac{1}{\sqrt n}F$ 是**酉矩阵** ✓（$n=2,4,8$ 均已验证）
> - **离散傅里叶变换**（discrete Fourier transform，简称 DFT）：$\mathbf{y}=F\mathbf{c}$；**逆变换**：$\mathbf{c}=\dfrac1nF^{H}\mathbf{y}$ ✓

**手算例（$n=4$，$\mathbf{c}=(1,2,4,8)$）**：

$$
F\mathbf{c}=\begin{bmatrix}
1&1&1&1\\1&j&-1&-j\\1&-1&1&-1\\1&-j&-1&j\end{bmatrix}\begin{bmatrix}1\\2\\4\\8\end{bmatrix}
=\begin{bmatrix}15\\-3-6j\\-5\\-3+6j\end{bmatrix}
$$

第一项 $15=1+2+4+8$ 是"平均值的信息"（**直流分量**），其余三项是各频率的成分 ✓ 逆变换 $(1/4)F^{H}F\mathbf{c}$ 原样还原 $(1,2,4,8)$ ✓

> [!warning] 约定：工程惯例差一个共轭
> 本书（Strang）用 $\omega=e^{2\pi j/n}$ 作**正变换**。数字信号处理（DSP）与通信工程的惯例相反：正变换用 $\omega=e^{-2\pi j/n}$（相当于把上面的 $F$ 取共轭）。
> 差别只影响"频谱的虚部符号"，**逆变换一律用共轭**（$\frac1nF^{H}$）✓。抄公式前先确认约定，这是通信人最常踩的坑之一。

> [!tip] 为什么傅里叶基是"最好的基"（第 8 章的回访）
> - $F$ 的列就是**互相正交的复指数** ⇒ 系数只需一次内积（不用解方程组）✓
> - 它把**循环移位算子对角化**（第 8 章的移位矩阵，特征值就是单位根！），因此**循环卷积 = 频域逐点相乘** ✓
> - $\lvert\lambda\rvert=1$（酉）⇒ 换基不改变能量 ✓
> 这三条合起来，就是"频域方法"能横扫通信与信号处理的全部理由。

## 快速傅里叶变换的一步

$F$ 乘以一个向量本来要 $n^{2}$ 次复数乘法（$n=1024$ 时要 100 多万次）。**快速傅里叶变换**（fast Fourier transform，简称 **FFT**）的起点是一个几乎免费的观察：

> [!tip] 关键观察：$\omega^{2}$ 是 $\frac n2$ 次单位根
> 设 $\omega_n=e^{2\pi j/n}$，则 $\omega_n^{2}=e^{2\pi j/(n/2)}=\omega_{n/2}$。
> 于是**偶下标与奇下标可以用"半个尺寸"的傅里叶矩阵分别处理**，再用旋转因子合并。

**$n=4$ 的一步分解**（数值已验证 ✓）：

$$
\boxed{\ F_4=\underbrace{\begin{bmatrix}1&0&1&0\\0&1&0&j\\1&0&-1&0\\0&1&0&-j\end{bmatrix}}_{\text{合并（旋转因子 }1,j\text{）}}
\ \underbrace{\begin{bmatrix}F_2&0\\0&F_2\end{bmatrix}}_{\text{两个 2 点 DFT}}\ \underbrace{P}_{\text{偶奇分离}}\ }
$$

三个因子各司其职：

| 因子 | 作用 | 代价 |
| --- | --- | --- |
| $P$ | 把 $(\mathbf{c}_0,\mathbf{c}_1,\mathbf{c}_2,\mathbf{c}_3)$ 排成 $(\mathbf{c}_0,\mathbf{c}_2,\mathbf{c}_1,\mathbf{c}_3)$ | 免费（只是搬位置） |
| $\begin{bmatrix}F_2&0\\0&F_2\end{bmatrix}$ | 对偶部、奇部各做一次 2 点 DFT | $2\times2^{2}=8$ 次乘法 |
| $\begin{bmatrix}I&D\\I&-D\end{bmatrix}$ | 用 $D=\operatorname{diag}(1,\omega,\dots)$ 修正后相加减 | 每行 1 次乘法 |

一般形式：$F_n=\begin{bmatrix}I&D\\I&-D\end{bmatrix}\begin{bmatrix}F_{n/2}&0\\0&F_{n/2}\end{bmatrix}P$，其中 $D=\operatorname{diag}(1,\omega,\omega^{2},\dots,\omega^{n/2-1})$ ✓

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 340" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la9-f" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la9-fp" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <!-- 列标题 -->
  <text x="100" y="34" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--text-normal,#1f2328)">输入 c</text>
  <text x="250" y="34" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--text-normal,#1f2328)">偶奇分离 P</text>
  <text x="420" y="34" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--text-normal,#1f2328)">两个 2 点 DFT</text>
  <text x="620" y="34" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--text-normal,#1f2328)">旋转因子合并</text>

  <!-- 交叉连线 -->
  <g stroke="var(--text-faint,#8b949e)" stroke-width="1.3" marker-end="url(#la9-fp)">
    <line x1="115" y1="66" x2="235" y2="66"/>
    <line x1="115" y1="130" x2="235" y2="194"/>
    <line x1="115" y1="194" x2="235" y2="130"/>
    <line x1="115" y1="258" x2="235" y2="258"/>
  </g>
  <!-- 到 DFT -->
  <g stroke="#4f46e5" stroke-width="1.5" marker-end="url(#la9-f)">
    <line x1="265" y1="66" x2="375" y2="66"/>
    <line x1="265" y1="130" x2="375" y2="130"/>
    <line x1="265" y1="194" x2="375" y2="194"/>
    <line x1="265" y1="258" x2="375" y2="258"/>
  </g>
  <!-- DFT 方框 -->
  <rect x="355" y="46" width="130" height="104" rx="6" fill="#4f46e5" fill-opacity="0.08" stroke="#4f46e5" stroke-opacity="0.5"/>
  <rect x="355" y="174" width="130" height="104" rx="6" fill="#4f46e5" fill-opacity="0.08" stroke="#4f46e5" stroke-opacity="0.5"/>
  <text x="420" y="166" text-anchor="middle" font-size="10.5" fill="#4f46e5">偶部 a₀ = c₀ + c₂，a₁ = c₀ − c₂</text>
  <text x="420" y="294" text-anchor="middle" font-size="10.5" fill="#4f46e5">奇部 b₀ = c₁ + c₃，b₁ = c₁ − c₃</text>

  <!-- 合并连线 -->
  <g stroke="#059669" stroke-width="1.5" marker-end="url(#la9-f)">
    <line x1="490" y1="66" x2="580" y2="66"/>
    <line x1="490" y1="66" x2="580" y2="194"/>
    <line x1="490" y1="130" x2="580" y2="130"/>
    <line x1="490" y1="130" x2="580" y2="258"/>
    <line x1="490" y1="194" x2="580" y2="66"/>
    <line x1="490" y1="194" x2="580" y2="194"/>
    <line x1="490" y1="258" x2="580" y2="130"/>
    <line x1="490" y1="258" x2="580" y2="258"/>
  </g>

  <!-- 数值（c = 1,2,4,8） -->
  <g font-size="11.5" fill="var(--text-normal,#1f2328)">
    <text x="100" y="70" text-anchor="middle">c₀ = 1</text>
    <text x="100" y="134" text-anchor="middle">c₁ = 2</text>
    <text x="100" y="198" text-anchor="middle">c₂ = 4</text>
    <text x="100" y="262" text-anchor="middle">c₃ = 8</text>
    <text x="420" y="70" text-anchor="middle" font-weight="600">a₀ = 5</text>
    <text x="420" y="134" text-anchor="middle" font-weight="600">a₁ = −3</text>
    <text x="420" y="198" text-anchor="middle" font-weight="600">b₀ = 10</text>
    <text x="420" y="262" text-anchor="middle" font-weight="600">b₁ = −6</text>
    <text x="620" y="70" text-anchor="middle" font-weight="700" fill="#059669">y₀ = 15</text>
    <text x="620" y="134" text-anchor="middle" font-weight="700" fill="#059669">y₁ = −3 − 6j</text>
    <text x="620" y="198" text-anchor="middle" font-weight="700" fill="#059669">y₂ = −5</text>
    <text x="620" y="262" text-anchor="middle" font-weight="700" fill="#059669">y₃ = −3 + 6j</text>
  </g>
  <text x="540" y="120" font-size="10" fill="#059669">×1</text>
  <text x="540" y="248" font-size="10" fill="#059669">×j</text>
  <text x="540" y="188" font-size="10" fill="#059669">×(−1)</text>
  <text x="540" y="286" font-size="10" fill="#059669">×(−j)</text>

  <text x="420" y="326" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">c = (1,2,4,8) 的 4 点 FFT：分奇偶 → 两个 2 点 DFT → 用旋转因子合并，结果与直接算 Fc 完全一致</text>
</svg>

> [!warning] 一步分解省下的钱（$n=4$ 已可见）
> 直接算 $F_4\mathbf{c}$ 要 $4^{2}=16$ 次乘法；分解后只有 $2\times2^{2}=8$ 次（小 DFT）+ 4 次（旋转因子）$=12$ 次，而**加法几乎不变**。
> $n$ 越大，省得越多——因为"减半"这一步可以**反复做**。

## 利用递归的快速傅里叶变换

一步不够，但**同样的分解可以递归地用在每一半上**，直到只剩 2 点 DFT。

> [!tip] 定理 FFT 的代价是 $O(n\log n)$
> 令 $T(n)$ 为 $n$ 点 FFT 的运算量：
> $$
> T(n)=2\,T\!\left(\frac n2\right)+O(n)\qquad\Longrightarrow\qquad \boxed{\ T(n)=O(n\log n)\ }
> $$
> （两个"半尺寸"问题加上 $O(n)$ 的合并开销；递归 $\log_2n$ 层。）

**乘法数对比**（DFT 是 $n^{2}$，FFT 约为 $\frac n2\log_2n$）：

| $n$ | 直接 DFT | FFT | 加速比 |
| --- | --- | --- | --- |
| 4 | 16 | 4 | 4 倍 |
| 64 | 4 096 | 192 | 21 倍 |
| 1 024 | 1 048 576 | 5 120 | **205 倍** |
| 4 096 | 16 777 216 | 24 576 | **683 倍** |

（这些数字就是"FFT 是 20 世纪最重要算法之一"的注脚：$n=4096$ 时快了近三个数量级，而 4G/5G 的 OFDM 恰恰用 2048/4096 点 FFT ✓）

> [!tip] 分而治之的三个"免费"技巧
> 1. **分奇偶**（$P$）：只是重新排位置，不用乘法；
> 2. **复用**：同一个"半尺寸 DFT"的结果被两个输出共用（蝴蝶的两条臂），所以省一半；
> 3. **旋转因子周期化**：$\omega^{k+n/2}=-\omega^{k}$——正负号而已 ✓
> 这三条合起来就是"**蝴蝶图**"（butterfly，上图那个交叉结构）。

> [!note] 通信方向：FFT 撑起了整个 OFDM
> - **OFDM 的调制就是 IFFT、解调就是 FFT**：把 $N$ 个并行的 QAM 符号（频域）一次变换到时域波形。$N=2048$ 时，直接做要 400 多万次乘法，用 FFT 只要 1 万多次——**这就是 OFDM 在 4G/5G 里可行的直接原因** ✓
> - **子载波正交** = 傅里叶矩阵的列正交（$F^{H}F=nI$）✓ 相邻子载波互不干扰，靠的就是 9.2 的那个复内积为零；
> - **循环前缀**（cyclic prefix）之所以能消除符号间干扰，是因为**循环移位在频域只是乘一个相位**（$F$ 对角化循环移位算子，第 8 章）✓
> - **快速卷积**：时域卷积 = 频域相乘，代价从 $O(n^{2})$ 降到 $O(n\log n)$——用于**匹配滤波、信道均衡、大整数乘法**（Schönhage–Strassen）✓
> - **频谱分析**：任何"看频谱"的功能（频谱仪、SDR、雷达脉冲压缩）背后都是一次 FFT ✓

> [!tip] 本章收官
> 第 9 章把线性代数"复化"了一遍，三条主线：
> 1. **9.1 复数**：$z=re^{j\theta}$；**乘法 = 旋转 + 伸缩**（模相乘、幅角相加）；$e^{j\pi}=-1$；$\mathbb{C}^n$ 里所有实线性代数结论照旧；
> 2. **9.2 埃尔米特与酉**：复内积必须取共轭（否则长度不是正实数）；于是
>    $$
>    A^{H}=A\Rightarrow\lambda\in\mathbb{R};\qquad U^{H}=U^{-1}\Rightarrow\lvert\lambda\rvert=1;\qquad\text{都能酉对角化}\ A=U\Lambda U^{H}
>    $$
>    ——第 6 章"对称 + 正交"的复数版，而且**酉变换保能量**；
> 3. **9.3 FFT**：单位根 ⇒ 傅里叶矩阵（$F^{H}F=nI$，酉）；**分奇偶 + 递归 + 旋转因子** ⇒ $O(n^{2})$ 变 $O(n\log n)$ ⇒ OFDM、频谱分析、快速卷积。
> 一句话：**复数为"旋转"发了身份证，埃尔米特与酉给了它"实特征值/单位圆特征值"的保证，FFT 让它变得几乎免费。**

## 本章知识地图

```
复数与 FFT：把线性代数"复化"
  ├─ 9.1 复数
  │      ├── z = a + bj；共轭 z̄、模 |z|、1/z = z̄/|z|²；j² = −1（工程用 j）
  │      ├── 复平面：加法 = 向量加法；共轭 = 镜像；模 = 距离
  │      ├── 极形式 z = re^jθ；欧拉公式 e^jθ = cos θ + j sin θ
  │      │      └── e^jπ = −1（欧拉恒等式）；乘 j = 转 90°
  │      ├── 乘法 = 旋转 + 伸缩：模相乘、幅角相加；棣莫弗 (re^jθ)^n = r^n e^jnθ
  │      └── 等价表示：[[a,−b],[b,a]] 实矩阵（与复数乘法同构）
  │
  ├─ 9.2 埃尔米特矩阵和酉矩阵
  │      ├── 复内积 v^H w（**第一个取共轭**）⇒ ‖v‖² = Σ|v_i|² > 0
  │      ├── 埃尔米特 A^H = A：对角实、**λ 全实**、特征向量正交、A = UΛU^H
  │      │      └── 反埃尔米特 A^H = −A ⟹ λ 纯虚（例 ±j）
  │      ├── 酉矩阵 U^H = U⁻¹：列标准正交、保范数（**能量守恒**）、|λ| = 1
  │      │      └── 例：F/√n 酉；实对称/实反对称/实正交是对应特例
  │      └── 通信：协方差 R = E[hh^H]（埃尔米特半正定）；帕塞瓦尔定理
  │
  └─ 9.3 快速傅里叶变换
         ├── 单位根 ω = e^(2πj/n)：ω^n = 1；1 + ω + … + ω^(n−1) = 0
         │      └── n = 4 的四个根 = 1, j, −1, −j（= QPSK 星座）
         ├── 傅里叶矩阵 F_jk = ω^(jk)：对称；F^H F = nI ⇒ F/√n 酉
         │      └── DFT y = Fc；逆变换 c = (1/n)F^H y
         │      └── 手算例 n=4, c=(1,2,4,8) ⇒ Fc = (15, −3−6j, −5, −3+6j)
         ├── FFT 的一步：F_n = [[I,D],[I,−D]] · diag(F_(n/2), F_(n/2)) · P
         │      └── 关键：ω² 是 n/2 次单位根（偶奇可分管）
         └── 递归：T(n) = 2T(n/2) + O(n) ⇒ **O(n log n)**
                ├── n=1024：10^6 → 5×10^3（205 倍）；n=4096：683 倍
                └── 应用：OFDM（IFFT/FFT）、频谱分析、快速卷积、大整数乘法
```

## 关联

- 上一章：[[vault-notes/math/linear-algebra/08-linear-transformations]]
- 下一章：[[vault-notes/math/linear-algebra/10-applications]]

**本章与前面章节的接口**：

| 前面的内容 | 复化之后 |
| --- | --- |
| 第 1 章：点积、长度、夹角 | 复内积取共轭 ⇒ 长度是正实数；正交定义不变 |
| 第 4 章：正交矩阵 $Q^{T}Q=I$ | 酉矩阵 $U^{H}U=I$（实正交是特例）；保范数、条件数 1 全部照旧 |
| 第 4 章：标准正交基、投影 | 复内积下同样成立；$F$ 的列就是 $\mathbb{C}^n$ 的一组标准正交基（差一个 $\sqrt n$） |
| 第 6 章：对称矩阵 $A=Q\Lambda Q^{T}$ | 埃尔米特 $A=U\Lambda U^{H}$；"λ 实、特征向量正交"原样保留 |
| 第 6 章：$90°$ 旋转 $\lambda=\pm i$ | 实反对称/反埃尔米特 ⇒ 纯虚特征值（同一个现象） |
| 第 7 章：SVD $A=U\Sigma V^{H}$ | 复版直接写 $A=U\Sigma V^{H}$（$U,V$ 酉）；$\sigma_i$ 仍是非负实数（因为 $\sigma^{2}=\lambda(A^{H}A)\ge0$）✓ |
| 第 8 章：$e^{ikx}$ 是 $d/dx$ 的特征函数 | 复指数就是傅里叶基；第 8 章"好基"的样板，本章给出它为什么算得快 |
| 第 8 章：移位算子、循环卷积 | $F$ 把循环移位对角化（特征值 = 单位根）⇒ 频域乘法 |

**通信方向应用**：

- [[vault-notes/5g/phy/04-physical-channels-signals]] —— **本章是 5G 物理层的数学底盘**：OFDM 的调制/解调就是 IFFT/FFT（$F$ 的列 = 子载波，$F^{H}F=nI$ = 子载波正交）；**循环前缀**消除符号间干扰靠的是"循环移位在频域只是相位"（第 8 章）；**频域均衡**把卷积信道变成逐子载波相乘；**信道估计**在每个子载波上独立做（因为基正交）；MIMO 里 $H^{H}H$ 是埃尔米特半正定 ⇒ 可用厄米特特征分解做特征波束（第 6、7 章）；**QPSK/QAM 的星座点**就是单位根与 $\mathbb{C}$ 上的格点。
- [[vault-notes/communication/09-optimal-reception]] —— 复基带表示 $s(t)=\operatorname{Re}\{u(t)e^{j\omega_ct}\}$ 把 I/Q 打包成一个复信号；**相关接收**在复内积下就是 $\langle s_i,r\rangle$（第一项取共轭）；**匹配滤波器的输出**在频域是 $\bar S(f)R(f)$；判据"正交 = 内积为零"在复信号里是复内积为零——**信号空间的内积必须按复内积定义**，否则能量可能算成 0（如 $(1,j)$ 的例子）。
- [[vault-notes/communication/12-orthogonal-codes-pn-sequences]] —— 正交码 = 复（或实）向量空间里的一组正交基；Walsh/Hadamard 是"方波版"，傅里叶基是"正弦版"，两者都是酉矩阵的行/列；扩频与多址中"码间正交"就是 $F^{H}F$ 型的正交性；**m 序列**的频谱平坦性也由傅里叶分析给出。
- [[vault-notes/math/linear-algebra/07-singular-value-decomposition]] —— SVD 的复数版写成 $A=U\Sigma V^{H}$（$U,V$ 酉，$\sigma$ 非负实数）；**所有实数结论照搬**，只是把"转置"全部替换为"共轭转置"。MIMO 信道用的正是这个复 SVD。
- [[vault-notes/math/linear-algebra/08-linear-transformations]] —— 傅里叶基是"把移位/卷积算子对角化"的那组基；FFT 是"快速换基"（$O(n\log n)$）的典范——**选对基 + 换得够快 = 工程可行**。

**相关**：[[vault-notes/math/linear-algebra/08-linear-transformations]]｜[[vault-notes/5g/phy/04-physical-channels-signals]]｜[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]
