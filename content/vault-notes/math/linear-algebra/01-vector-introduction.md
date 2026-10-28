---
title: "向量引论"
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
> Strang 用**三个问题**把线性代数铺开，1.1–1.3 就是这三块地基：
> - **1.1** 两个向量的所有组合 $c\mathbf{v}+d\mathbf{w}$ 长什么样？→ 直线、平面、整个空间
> - **1.2** 怎样衡量两个向量的"长短"与"方向差异"？→ 点积与夹角
> - **1.3** 把这一切打包成矩阵：$A\mathbf{x}=\mathbf{b}$ 就是"**b 是不是 A 的列向量的线性组合**"
>
> 一句话主线：**线性代数的全部内容，都是在研究"线性组合"能造出什么。**

> [!note] 记号约定
> - 向量用黑体小写 $\mathbf{v},\mathbf{w}$（手写/纯文本写作 v、w）
> - 向量默认为**列向量**，$\mathbf{v}=(v_1,v_2)$ 与 $\begin{bmatrix}v_1\\v_2\end{bmatrix}$ 是同一个东西
> - $\mathbf{v}\cdot\mathbf{w}$ 是**点积**（一个数），$\|\mathbf{v}\|$ 是**长度**（一个数），$c\mathbf{v}$ 是**数乘**（一个向量）

# 1.1 向量与线性组合

## 两种基本运算

线性代数的全部运算都由两个"原子操作"长出：

| 运算 | 写法 | 几何含义 |
| --- | --- | --- |
| **向量加法** | $\mathbf{v}+\mathbf{w}$ | 平移：把 w 的尾巴接到 v 的头上，"**平行四边形对角线**" |
| **向量数乘** | $c\mathbf{v}$ | 伸缩：$c>0$ 同向拉长，$c<0$ 反向，$c=0$ 缩成原点 |

其余一切（点积、矩阵乘、行列式……）都是这两个操作的组合与推广。

## 向量的三种表示

同一支向量有三种看法，**切换视角是线代最重要的思维习惯**：

| 表示 | 样子 | 适合干什么 |
| --- | --- | --- |
| **列向量**（代数） | $\mathbf{v}=\begin{bmatrix}1\\1\end{bmatrix}$ | 计算、代入公式 |
| **从原点出发的箭头**（几何） | 原点 → 终点的一段有向线段 | 看加法、数乘、夹角 |
| **箭头的终点**（点） | 平面上的一个点 $(1,1)$ | 看方程组、看解集图像 |

> [!info] Def 1 线性组合
> 取两个数 $c,d$，用向量加法与数乘造出的
> $$
> c\mathbf{v}+d\mathbf{w}=c\begin{bmatrix}1\\1\end{bmatrix}+d\begin{bmatrix}2\\3\end{bmatrix}=\begin{bmatrix}c+2d\\c+3d\end{bmatrix}
> $$
> 称为 $\mathbf{v}$ 与 $\mathbf{w}$ 的**线性组合**（linear combination）。$c,d$ 可以取任意实数（含负数、0）。

注意：$c\mathbf{v}$ 本身就是**只有一个向量**的特殊线性组合。

> [!tip] 结论：线性组合能填满什么
> - 形如 $c\mathbf{u}$ 的全体线性组合是**一条过原点的直线**
> - 形如 $c\mathbf{u}+d\mathbf{v}$ 的全体线性组合是一个**过原点的平面**（前提：u、v 不同向）
> - 形如 $c\mathbf{u}+d\mathbf{v}+e\mathbf{w}$ 的全体线性组合**整个三维空间**（前提：u、v、w 不共面）

![[vault-notes/assets/01-vector-introduction/fig-01.png]]

> [!warning] 三个容易踩的坑
> 1. **"线性"的来历**：只允许 $c\mathbf{v}$（数乘）和 $\mathbf{v}+\mathbf{w}$（加法），**不允许** $\mathbf{v}^2$、$\mathbf{v}\mathbf{w}$、$\sin\mathbf{v}$ 这类运算。所以"线性组合"就是"只用这两种操作能造出的东西"。
> 2. **为什么所有组合过原点**：系数全取 0 时组合结果是 $\mathbf{0}$，所以**原点永远在集合里**。这也是后面"子空间必须包含零向量"的来源。
> 3. **系数可以取负**：$c,d$ 是整个实数域，不只是 $c,d\ge 0$。若限定非负，得到的是"锥"而不是直线/平面。

# 1.2 长度与点积

## 向量的点积

> [!info] Def 2 点积（内积）
> 向量 $\mathbf{v}=(v_1,v_2)$ 与 $\mathbf{w}=(w_1,w_2)$ 的**点积**（dot product，也叫内积 inner product）记为 $\mathbf{v}\cdot\mathbf{w}$，其定义**是一个数**：
> $$
> \mathbf{v}\cdot\mathbf{w}=v_1w_1+v_2w_2
> $$
> $n$ 维时逐项相乘再相加：$\mathbf{v}\cdot\mathbf{w}=\sum_{i=1}^{n}v_iw_i$。

点积的性质（$c$ 是任意实数）：

| 性质 | 表达式 |
| --- | --- |
| 交换律 | $\mathbf{v}\cdot\mathbf{w}=\mathbf{w}\cdot\mathbf{v}$ |
| 分配律 | $\mathbf{u}\cdot(\mathbf{v}+\mathbf{w})=\mathbf{u}\cdot\mathbf{v}+\mathbf{u}\cdot\mathbf{w}$ |
| 数乘可提出 | $(c\mathbf{v})\cdot\mathbf{w}=c(\mathbf{v}\cdot\mathbf{w})$ |
| 自点积非负 | $\mathbf{v}\cdot\mathbf{v}\ge 0$，且 $=0$ **当且仅当** $\mathbf{v}=\mathbf{0}$ |

> [!tip] 点积的几何意思
> $$
> \mathbf{v}\cdot\mathbf{w}=\|\mathbf{v}\|\,\|\mathbf{w}\|\cos\theta
> $$
> 它衡量的是两个向量**方向的一致程度**：同向为正、垂直为零、反向为负。**长度与角度都被它一个数打包了**，这是点积最重要的地位——后面所有"正交""投影""最小二乘""相关解调"都从这里出发。
>
> **垂直判据**：$\mathbf{v}\cdot\mathbf{w}=0\iff$ 两向量**正交**（orthogonal，垂直）。垂直时夹角余弦为 0，与长度无关。

## 向量的长度

> [!info] Def 3 长度（模）
> $n$ 维向量 $\mathbf{v}$ 的**长度**（length，也叫模 norm）$\|\mathbf{v}\|$ 等于 $\mathbf{v}\cdot\mathbf{v}$ 的算术平方根：
> $$
> \|\mathbf{v}\|=\sqrt{\mathbf{v}\cdot\mathbf{v}}=\left(v_1^2+v_2^2+\cdots+v_n^2\right)^{1/2}
> $$

- 二维、三维就是**勾股定理**：$\|(3,4)\|=\sqrt{9+16}=5$，$\|(1,2,2)\|=\sqrt{1+4+4}=3$
- 零向量的长度为 0；其余向量长度恒为正（这就是点积性质中"自点积非负"的直接后果）

> [!info] Def 4 单位向量
> 若向量 $\mathbf{u}$ 的长度为 1，即 $\mathbf{u}\cdot\mathbf{u}=1$，则称 $\mathbf{u}$ 为**单位向量**（unit vector）。

把任意非零向量**单位化**，得到与它同向的单位向量（习惯写成 $\mathbf{u}$ 或戴帽子 $\hat{\mathbf{v}}$）：

$$
\mathbf{u}=\frac{\mathbf{v}}{\|\mathbf{v}\|},\qquad \left\|\frac{\mathbf{v}}{\|\mathbf{v}\|}\right\|=1
$$

> [!example] 单位化
> $\mathbf{v}=(3,4)$，$\|\mathbf{v}\|=5$，则 $\mathbf{u}=\left(\tfrac35,\tfrac45\right)$。

**为什么偏爱单位向量？** 因为它只保留"方向"这一个信息。做投影、构造正交基时，去掉长度这个"多余因子"，公式会干净很多（后面 Gram–Schmidt 正交化的每一步都要单位化）。

## 向量的夹角

> [!tip] 结论：余弦公式
> 非零向量 $\mathbf{v},\mathbf{w}$ 的夹角 $\theta\ (0\le\theta\le\pi)$ 由下式确定：
> $$
> \cos\theta=\frac{\mathbf{v}\cdot\mathbf{w}}{\|\mathbf{v}\|\,\|\mathbf{w}\|}
> $$
> 分母的 $\|\mathbf{v}\|\|\mathbf{w}\|$ 是**归一化因子**——把点积里的"长度影响"除掉，剩下的纯方向量就是 $\cos\theta$。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 220" width="100%" style="max-width:430px" font-family="inherit">
  <defs>
    <marker id="la2-v" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la2-w" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
  </defs>
  <line x1="70" y1="182" x2="400" y2="182" stroke="var(--text-faint,#8b949e)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <line x1="300" y1="182" x2="300" y2="52" stroke="var(--text-faint,#8b949e)" stroke-width="0.9" stroke-dasharray="3 3"/>
  <line x1="80" y1="182" x2="380" y2="182" stroke="#4f46e5" stroke-width="2.2" marker-end="url(#la2-v)"/>
  <line x1="80" y1="182" x2="308" y2="58" stroke="#db2777" stroke-width="2.2" marker-end="url(#la2-w)"/>
  <path d="M150,182 A70,70 0 0 0 141.5,148.6" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.4"/>
  <path d="M300,172 L290,172 L290,182" fill="none" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <circle cx="80" cy="182" r="2.5" fill="var(--text-muted,#57606a)"/>
  <circle cx="300" cy="182" r="2.5" fill="var(--text-muted,#57606a)"/>
  <text x="158" y="174" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">θ</text>
  <text x="386" y="177" font-size="12.5" font-weight="600" fill="#4f46e5">v</text>
  <text x="316" y="52" font-size="12.5" font-weight="600" fill="#db2777">w</text>
  <text x="300" y="200" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">投影长度 = ‖w‖cos θ</text>
</svg>

**三种极端情形**（看一眼余弦公式就明白了）：

| $\theta$ | $\cos\theta$ | $\mathbf{v}\cdot\mathbf{w}$ | 关系 |
| --- | --- | --- | --- |
| $0$ | $1$ | $+\|\mathbf{v}\|\|\mathbf{w}\|$ | 同向（成倍数） |
| $90°$ | $0$ | $0$ | **正交**（垂直） |
| $180°$ | $-1$ | $-\|\mathbf{v}\|\|\mathbf{w}\|$ | 反向 |

> [!warning] 常见错误
> 1. **点积是一个数，不是向量**——不要和后面 1.3 的矩阵乘向量混了。
> 2. **算夹角前必须保证两个向量都非零**，否则分母为 0，夹角无定义。
> 3. 只有 $\cos\theta$ 的值域在 $[-1,1]$ 内，$\frac{\mathbf{v}\cdot\mathbf{w}}{\|\mathbf{v}\|\|\mathbf{w}\|}$ 才可能是一个真正的余弦——这件事**不是显然的**，它正是下面的**施瓦茨不等式**（Cauchy-Schwarz inequality）。

## 拓展：施瓦茨不等式与三角不等式

### 施瓦茨不等式

$$
|\mathbf{v}\cdot\mathbf{w}|\le\|\mathbf{v}\|\,\|\mathbf{w}\|
$$

**等号成立当且仅当 $\mathbf{v}$ 与 $\mathbf{w}$ 平行**（成倍数关系，含其中一个为零向量）。

它保证了 $\cos\theta=\dfrac{\mathbf{v}\cdot\mathbf{w}}{\|\mathbf{v}\|\|\mathbf{w}\|}$ 落在 $[-1,1]$ 内，因此**夹角才有定义**。

> [!example] 证明（作差法，Strang 的漂亮技巧）
> 对任意实数 $t$，非负量 $\|\mathbf{v}-t\mathbf{w}\|^2\ge 0$ 恒成立。展开：
> $$
> \|\mathbf{v}\|^2-2t(\mathbf{v}\cdot\mathbf{w})+t^2\|\mathbf{w}\|^2\ge 0
> $$
> 这是关于 $t$ 的开口向上抛物线，最小值在 $t=\dfrac{\mathbf{v}\cdot\mathbf{w}}{\|\mathbf{w}\|^2}$ 处取到。代入得
> $$
> \|\mathbf{v}\|^2-\frac{(\mathbf{v}\cdot\mathbf{w})^2}{\|\mathbf{w}\|^2}\ge 0\ \Longrightarrow\ (\mathbf{v}\cdot\mathbf{w})^2\le\|\mathbf{v}\|^2\|\mathbf{w}\|^2
> $$
> 两边开方即得。$\blacksquare$
>
> **另一种证法**：直接由 $\cos\theta$ 的定义 + $|\cos\theta|\le 1$。但那样是循环论证（余弦的存在性依赖于这个不等式），所以这里用代数法更严谨。

### 三角不等式

$$
\|\mathbf{v}+\mathbf{w}\|\le\|\mathbf{v}\|+\|\mathbf{w}\|
$$

**三角不等式**（triangle inequality）的几何语言即"**两边之和大于第三边**"：走 $\mathbf{v}$ 再走 $\mathbf{w}$ 的折线，不比直接走 $\mathbf{v}+\mathbf{w}$ 短。

> [!example] 证明（用施瓦茨不等式）
> $$
> \|\mathbf{v}+\mathbf{w}\|^2=\|\mathbf{v}\|^2+2\,\mathbf{v}\cdot\mathbf{w}+\|\mathbf{w}\|^2\le\|\mathbf{v}\|^2+2\|\mathbf{v}\|\|\mathbf{w}\|+\|\mathbf{w}\|^2=\bigl(\|\mathbf{v}\|+\|\mathbf{w}\|\bigr)^2
> $$
> 中间那步正是把 $\mathbf{v}\cdot\mathbf{w}$ 换成上界 $\|\mathbf{v}\|\|\mathbf{w}\|$。$\blacksquare$

### 由它推出的：几何平均数 ≤ 算术平均数

取 $\mathbf{v}=(a,b)$、$\mathbf{w}=(b,a)$（各分量非负），则

$$
\mathbf{v}\cdot\mathbf{w}=2ab,\qquad \|\mathbf{v}\|=\|\mathbf{w}\|=\sqrt{a^2+b^2}
$$

施瓦茨不等式给出 $2ab\le a^2+b^2$。令 $a=\sqrt{x}$、$b=\sqrt{y}\ (x,y\ge 0)$，即得

$$
\sqrt{xy}\le\frac{x+y}{2}
$$

这就是中学的"**几何平均 ≤ 算术平均**"，是施瓦茨不等式在二维的一个特例。可见这条不等式不是孤立技巧，而是内积空间的普遍性质——**"长度"这一概念在任意维数下必须满足约束，施瓦茨不等式就是那个约束**。

# 1.3 矩阵

从"两个向量的组合"升级到"**任意多个向量的组合**"，工具就是矩阵。

## 线性方程组

方程组与矩阵形式的对应关系：

$$
\begin{cases}
2x_1+x_2=b_1\\
x_1+3x_2=b_2
\end{cases}
\quad\Longleftrightarrow\quad
\underbrace{\begin{bmatrix}2&1\\1&3\end{bmatrix}}_{\mathbf{A}}
\underbrace{\begin{bmatrix}x_1\\x_2\end{bmatrix}}_{\mathbf{x}}
=
\underbrace{\begin{bmatrix}b_1\\b_2\end{bmatrix}}_{\mathbf{b}}
$$

**同一个 $A\mathbf{x}=\mathbf{b}$，有三种读法**，切换视角是解方程组的杀手锏：

| 视角 | 写法 | 几何图像 | 回答什么问题 |
| --- | --- | --- | --- |
| **行图像** | 逐条方程读 | 两条直线（或两个平面）的交点 | 每个方程各自是一张"约束" |
| **列图像** | $x_1\begin{bmatrix}2\\1\end{bmatrix}+x_2\begin{bmatrix}1\\3\end{bmatrix}=\begin{bmatrix}b_1\\b_2\end{bmatrix}$ | 用 A 的**列向量**去组合出 b | **b 在 A 的列向量的所有组合之中吗？** |
| **矩阵形式** | $A\mathbf{x}=\mathbf{b}$ | 输入 $\mathbf{x}$、输出 $\mathbf{b}$ 的一条"线性变换" | 一次性处理全部信息 |

> [!tip] 关键结论（把 1.1 和 1.3 连起来）
> $$
> A\mathbf{x}=x_1\mathbf{a}_1+x_2\mathbf{a}_2+\cdots+x_n\mathbf{a}_n
> $$
> 即 **$A\mathbf{x}$ 就是 A 的列向量以 $x_i$ 为系数的线性组合**。
>
> 于是"解方程组"这件事翻译成人话就是：
> **在 A 的列向量的所有线性组合里，找出能拼出 $\mathbf{b}$ 的那一组系数。**
> 这也预告了第 2 章的核心问题：**什么样的 b 有解？解唯一吗？**

- **行视角**便于手算（消元时一行一行地减）
- **列视角**便于理解（判断解的存在性、唯一性，以及秩、列空间等所有概念）
- 记忆法：矩阵乘向量 = 各行做点积（行视角）= 各列做组合（列视角），**两种算法结果必然一致**

> [!example] 一个具体例子
> $A=\begin{bmatrix}2&1\\1&3\end{bmatrix}$，$\mathbf{x}=\begin{bmatrix}1\\2\end{bmatrix}$：
> - 行视角：$\begin{bmatrix}2\cdot1+1\cdot2\\1\cdot1+3\cdot2\end{bmatrix}=\begin{bmatrix}4\\7\end{bmatrix}$
> - 列视角：$1\begin{bmatrix}2\\1\end{bmatrix}+2\begin{bmatrix}1\\3\end{bmatrix}=\begin{bmatrix}2+2\\1+6\end{bmatrix}=\begin{bmatrix}4\\7\end{bmatrix}$ ✓

## 逆矩阵

> [!info] Def 5 逆矩阵
> 对方阵 $A$，若存在方阵 $A^{-1}$ 使得
> $$
> A^{-1}A=I\quad\text{且}\quad AA^{-1}=I
> $$
> 则称 $A$ **可逆（非奇异）**，$A^{-1}$ 为 $A$ 的**逆矩阵**（inverse matrix）。不存在的称 $A$ **不可逆（奇异，singular）**。

$2\times2$ 的公式（务必背下）：

$$
A=\begin{bmatrix}a&b\\c&d\end{bmatrix},\qquad A^{-1}=\frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}
$$

记忆法：**主对角线交换、副对角线变号、整体除以行列式**。分母 $ad-bc$ 就是 $2\times2$ 的**行列式**（determinant）$\det A$（第 5 章详谈）。

> [!example] 求逆
> $A=\begin{bmatrix}2&1\\1&3\end{bmatrix}$，$\det A=2\cdot3-1\cdot1=5\ne 0$，故可逆：
> $$
> A^{-1}=\frac15\begin{bmatrix}3&-1\\-1&2\end{bmatrix}
> $$
> 验算：$\frac15\begin{bmatrix}2&1\\1&3\end{bmatrix}\begin{bmatrix}3&-1\\-1&2\end{bmatrix}=\frac15\begin{bmatrix}5&0\\0&5\end{bmatrix}=I$ ✓

**解方程组**：若 $A$ 可逆，则 $A\mathbf{x}=\mathbf{b}$ 两边左乘 $A^{-1}$ 得**唯一解**

$$
\mathbf{x}=A^{-1}\mathbf{b}
$$

注意"左乘"不能写成 $\mathbf{b}A^{-1}$——矩阵乘法不满足交换律。

> [!warning] 逆矩阵的全部秘密：分母不能为 0
> $\det A=ad-bc=0$ 时公式失效，$A$ 一定奇异。此时下列说法**互相等价**，考卷上随时互换使用：

| 判据 | 非奇异（可逆） | 奇异（不可逆） |
| --- | --- | --- |
| 行列式 | $\det A\ne 0$ | $\det A=0$ |
| 列向量 | 线性无关 | 线性相关（成比例） |
| $A\mathbf{x}=\mathbf{0}$ | 只有零解 $\mathbf{x}=\mathbf{0}$ | 有非零解（零空间含一条直线/一个平面） |
| 秩 | $r=n$（满秩） | $r<n$ |
| $A\mathbf{x}=\mathbf{b}$ | 任意 b 都有**唯一解** | 要么**无解**，要么**无穷多解** |
| 几何 | 变换不"压扁"空间 | 变换把平面压成直线（信息丢失，无法还原） |

**最后一行的直觉最重要**：不可逆 = 这一步操作**丢了信息**，所以回不去。乘积 $ad-bc$ 之所以关键，是因为它等于两个列向量张成的平行四边形**面积**——面积为零即两列共线，空间被压扁。

## 循环差分

前面的差分都是"沿着一条线往前走"，如果**首尾相接形成闭环**，就会出现一件很有意思的事。

**循环差分矩阵**（把 $x=(x_1,x_2,x_3)$ 变成"绕环一圈的三个差"）：

$$
C=\begin{bmatrix}-1&1&0\\0&-1&1\\1&0&-1\end{bmatrix},\qquad
C\mathbf{x}=\begin{bmatrix}x_2-x_1\\x_3-x_2\\x_1-x_3\end{bmatrix}
$$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 250" width="100%" style="max-width:380px" font-family="inherit">
  <defs>
    <marker id="la3-a" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/>
    </marker>
  </defs>
  <line x1="199" y1="68" x2="240" y2="138" stroke="#d97706" stroke-width="1.8" marker-end="url(#la3-a)"/>
  <line x1="231" y1="154" x2="149" y2="154" stroke="#d97706" stroke-width="1.8" marker-end="url(#la3-a)"/>
  <line x1="140" y1="138" x2="181" y2="68" stroke="#d97706" stroke-width="1.8" marker-end="url(#la3-a)"/>
  <circle cx="190" cy="52" r="19" fill="#6366f1" fill-opacity="0.18" stroke="#4f46e5" stroke-width="1.6"/>
  <circle cx="249" cy="154" r="19" fill="#6366f1" fill-opacity="0.18" stroke="#4f46e5" stroke-width="1.6"/>
  <circle cx="131" cy="154" r="19" fill="#6366f1" fill-opacity="0.18" stroke="#4f46e5" stroke-width="1.6"/>
  <text x="190" y="57" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">x₁</text>
  <text x="249" y="159" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">x₂</text>
  <text x="131" y="159" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">x₃</text>
  <text x="246" y="90" text-anchor="middle" font-size="11.5" fill="#b45309">x₂ − x₁</text>
  <text x="190" y="199" text-anchor="middle" font-size="11.5" fill="#b45309">x₃ − x₂</text>
  <text x="134" y="90" text-anchor="middle" font-size="11.5" fill="#b45309">x₁ − x₃</text>
  <text x="190" y="232" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">三个差分相加 ≡ 0：绕环一周必然回到原处</text>
</svg>

> [!tip] 核心观察：绕环一周，差分的和恒为零
> $$
> (x_2-x_1)+(x_3-x_2)+(x_1-x_3)=0
> $$
> 这不是巧合，而是**"回到原处"的代数表达**——和爬山绕一圈净爬升为零是一回事。
>
> 于是 $C$ 的三行**线性相关**（第 1 行 + 第 2 行 + 第 3 行 = 零向量），$\operatorname{rank}C=3-1=2$，$C$ 一定**奇异**。

**$C\mathbf{x}=\mathbf{0}$ 意味着什么？** 所有差分都为零 $\Rightarrow$ $x_1=x_2=x_3$（全是同一个常数）。所以

$$
C\mathbf{x}=\mathbf{0}\ \text{的全部解}=\left\{c\begin{bmatrix}1\\1\\1\end{bmatrix}:c\in\mathbb{R}\right\}
$$

零空间不是单个零向量，而是**一条直线**——这正是奇异矩阵的画像。**"所有点等电位"是唯一能让全部回路电压为零的状态**，对应物理里的基尔霍夫电压定律（KVL）。

> [!example] 对比：把环路切开，矩阵就"满"了
> 去掉最后那个"绕回"的方程，只保留两条差分，得到 $2\times3$ 的**单向差分矩阵**
> $$
> D=\begin{bmatrix}-1&1&0\\0&-1&1\end{bmatrix}
> $$
> 它的两行线性无关，秩为 2，**没有多余约束**。此时只要再补一个初始条件（例如 $x_1=0$），方程就有唯一解。
>
> 这就是差分方程与微分方程都必须配"**初始条件**"的线性代数解释：**未知量个数减秩 = 自由变量的个数**。

> [!note] 两个可迁移的结论
> 1. **回路 ⇒ 相关**：任何"环路"上的方程必然有冗余，冗余量 = 独立回路数。电路（KVL/KCL）、网络流、线性分组码的校验矩阵（[[vault-notes/communication/11-error-control-coding]]）都是这个道理。
> 2. **秩 = 独立信息量**：$n$ 个未知量只有 $r$ 条独立约束时，解集里就有 $n-r$ 个自由参数，解集是一条直线/平面/更高维的子空间——这就是第 3 章"零空间维数 = $n-r$"的来源。

## 线性相关与线性无关

> [!info] Def 6 线性无关
> 若 $\ c_1\mathbf{v}_1+c_2\mathbf{v}_2+\cdots+c_k\mathbf{v}_k=\mathbf{0}\ $ **只有唯一的零解** $c_1=c_2=\cdots=c_k=0$，则称这组向量**线性无关**（linearly independent）；
> 若存在**不全为零**的系数使组合为零，则称这组向量**线性相关**（linearly dependent）。

一句话对照：**相关的本质是"有人是多余的"**——至少有一个向量能由其余向量线性组合出来，它在组合中没有提供新方向。

> [!info] Def 7 张成
> 向量组 $\mathbf{v}_1,\dots,\mathbf{v}_k$ 的所有线性组合构成的集合，称为它们的**张成空间**（span），记作 $\operatorname{span}\{\mathbf{v}_1,\dots,\mathbf{v}_k\}$。
> "$\mathbf{b}$ 在张成空间里" ⟺ "$A\mathbf{x}=\mathbf{b}$ 有解"（A 的各列就是这组向量）。

| 对比项 | 线性**无关** | 线性**相关** |
| --- | --- | --- |
| 定义 | 组合为零时**只有**全零解 | 组合为零时可取到**非零**系数 |
| 几何直觉（2 维） | 不在同一条直线上 | 共线 |
| 几何直觉（3 维） | 不共面（三个方向各管一维） | 共面（被压在一个平面里） |
| 谁多余 | 谁都不可替代 | 至少一个可由其余组合出来 |
| 凑成零的方式 | 只有 $0\cdot\mathbf{v}_1+\cdots+0\cdot\mathbf{v}_k$ | 有条"非平凡"路径回到原点 |
| 矩阵语言（方阵） | 列满秩 ⟺ 零空间只有零向量 ⟺ **$A$ 可逆** | 列不满秩 ⟺ 零空间非平凡 ⟺ **$A$ 奇异** |

> [!example] 判断三个具体例子
> - $\begin{bmatrix}1\\1\end{bmatrix},\begin{bmatrix}2\\3\end{bmatrix}$：设 $c_1(1,1)+c_2(2,3)=(0,0)$，解得 $c_1=c_2=0$ → **无关**（不在同一条直线上）
> - $\begin{bmatrix}1\\1\end{bmatrix},\begin{bmatrix}2\\2\end{bmatrix}$：取 $c_1=2,c_2=-1$ 即得零 → **相关**（$2$ 倍关系）
> - $\begin{bmatrix}1\\0\\0\end{bmatrix},\begin{bmatrix}0\\1\\0\end{bmatrix},\begin{bmatrix}1\\1\\0\end{bmatrix}$：第三个 = 前两个之和 → **相关**（全部躺在一个平面里）

> [!warning] 三个高频误区
> 1. **"无关"不是"垂直"**。无关说的是"不共线/不共面"，垂直说的是"点积为零"，是两码事（正交一定无关，无关不一定正交）。
> 2. **零向量是"万能破坏者"**：向量组里只要含零向量，一定相关。同理有重复向量也一定相关。
> 3. **个数不是判据**：3 个二维向量**必**相关（塞不下），2 个三维向量**必**无关（若不成比例）。判据是**独立方向的个数（秩）**，而不是向量个数——向量个数超过维数就一定相关。

## 本章知识地图

```
向量 v, w
  ├─ 两种原子运算：加法 v+w ／ 数乘 cv
  │        └──→ 线性组合 cv+dw  →  直线 / 平面 / 整个空间（1.1）
  │
  ├─ 点积 v·w = Σviwi   ←── 把"长度"与"角度"打包成一个数（1.2）
  │        ├──→ 长度 ‖v‖ = √(v·v)  →  单位向量 v/‖v‖
  │        ├──→ 夹角 cosθ = v·w/(‖v‖‖w‖)  →  垂直 ⟺ v·w = 0
  │        └──→ 施瓦茨不等式  →  三角不等式  →  几何平均 ≤ 算术平均
  │
  └─ 矩阵：多个向量打包（1.3）
           ├──→ Ax = x₁a₁ + x₂a₂ + …  = 列的线性组合  →  方程组有解？
           ├──→ 逆矩阵 A⁻¹（det A ≠ 0）  →  x = A⁻¹b 唯一解
           ├──→ 循环差分 C（回路 ⇒ 行相关 ⇒ 奇异，零空间是直线）
           └──→ 线性无关 / 相关 = "有没有多余的方向"  →  通向第 3 章（基、维数、秩）
```

## 关联

- 上一章：（本章为开篇）
- 下一章：[[vault-notes/math/linear-algebra/02-solving-linear-systems]]

**通信方向应用**：

- [[vault-notes/communication/09-optimal-reception]] —— **相关解调就是点积**：$r\cdot s_i=\sum_k r_k s_{ik}$ 是接收信号与第 $i$ 个信号波形的内积；匹配滤波器取到最大输出信噪比，其"恰好取等"的条件正是**施瓦茨不等式**（信号与噪声相关时取等）。最小欧氏距离判决 = 在信号星座里找 $r$ 最接近的**线性组合**。
- [[vault-notes/communication/02-deterministic-signals]] —— 能量 $E=\int s^2(t)\,dt$ 是 $\|\mathbf{s}\|^2$ 的连续版；互相关函数 $R_{12}(\tau)$ 是 $\mathbf{s}_1\cdot\mathbf{s}_2$ 的"带时移版"，**相关系数 $\rho$ 就是 $\cos\theta$**。
- [[vault-notes/communication/12-orthogonal-codes-pn-sequences]] —— 正交基、沃尔什函数、哈达玛矩阵 $H_nH_n^T=nI$ 全部建立在"**正交 = 点积为零**"之上；m 序列因"移位不相关的两值自相关"而成为扩频的理想载体。循环差分那节的"回路 ⇒ 行相关"也解释了为什么正交码要**严格对齐**才能完全消除多址干扰。
- [[vault-notes/communication/11-error-control-coding]] —— 线性分组码是**模 2 域上的线性代数**：合法码字集合是一个张成空间，监督矩阵 $H$ 的每行是一个约束，冗余度 = 方程组的"多余约束"个数（但与循环差分不同，这里我们要的**正是**冗余）。
- [[vault-notes/communication/07-digital-bandpass]] —— 星座图上每个信号点 = 两个正交基函数 $\cos\omega_c t$、$\sin\omega_c t$ 的**线性组合**，组合系数就是 I、Q 分量。**"调制"在代数上就是"选一组系数"**。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— OFDM 把频域数据映射到相互正交的子载波上，本质是选了一组**正交基**做线性组合；Zadoff-Chu 序列前导码靠理想自相关特性完成定时估计，同属"点积/相关"框架。

**相关**：[[vault-notes/math/linear-algebra/03-vector-spaces-subspaces]]｜[[vault-notes/math/linear-algebra/04-orthogonality]]
