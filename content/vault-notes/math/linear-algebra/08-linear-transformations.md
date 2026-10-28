---
title: "线性变换"
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
> 前七章的主语一直是"**矩阵**"。这一章换个主语：**变换**。矩阵不是主角，它只是线性变换在某组基下的"**记录**"——换一组基，同一个变换就换一个矩阵。
>
> - **8.1** 线性变换的思想：$T(c\mathbf{v}+d\mathbf{w})=cT(\mathbf{v})+dT(\mathbf{w})$；**线到线、三角形到三角形**；"**基决定一切**"——知道基向量的像，就知道整个变换；核与像（秩-零化度的抽象版）
> - **8.2** 线性变换的矩阵：选定两组基 → 变换变成矩阵；**换基就是相似变换**（$B=M^{-1}AM$，"相似"一词的含义到此才彻底说清）；复合对应矩阵乘法；怎样选一组"最佳基"
> - **8.3** 搜索一组好基：若尔当形（不能对角化时的最接近形式）；**函数空间的基**与**正交基**——正交多项式（勒让德、切比雪夫）是"对幂基做 Gram-Schmidt"的产物
>
> 一句话主线：**矩阵是"变换 + 两组基"的快照；选基的自由度，就是本章的全部内容——选得好，矩阵就简单、稳定、有物理意义。**

> [!note] 记号约定
> - $T$：**线性变换**（linear transformation），也写作算子（operator）；$T:\ V\to W$（定义域 $V$、值域 $W$，维数 $n$、$m$）
> - $\ker(T)=\{\mathbf{v}:T(\mathbf{v})=\mathbf{0}\}$：**核**（kernel）；$\operatorname{im}(T)=\{T(\mathbf{v})\}$：**像**（image，也叫 range）
> - $\mathbf{v}_1,\dots,\mathbf{v}_n$：定义域的基；$\mathbf{w}_1,\dots,\mathbf{w}_m$：值域的基；$M$：换基矩阵（change of basis，坐标变换）
> - $A=TS$/$AB$：变换的**复合**（先 $S$ 后 $T$）；$S$ 或 $T$ 的矩阵记作 $A$、$B$
> - 函数空间：$\langle f,g\rangle=\int f(x)g(x)w(x)\,dx$ 是**内积**（inner product），带权 $w$

# 8.1 线性变换的思想

前面七章的主角一直是矩阵。但矩阵其实是"二手货"：**真正在做事的是一次变换**，矩阵只是它在某组基下的记录。这一章把主次关系摆正。

> [!info] Def 1 线性变换
> 映射 $T:\ V\to W$ 称为**线性变换**（linear transformation），若对任意 $\mathbf{v},\mathbf{w}\in V$ 与任意数 $c,d$：
> $$
> \boxed{\ T(c\mathbf{v}+d\mathbf{w})=c\,T(\mathbf{v})+d\,T(\mathbf{w})\ }
> $$
> 等价的两条（合起来就是上面这条）：
> 1. **可加**：$T(\mathbf{v}+\mathbf{w})=T(\mathbf{v})+T(\mathbf{w})$；
> 2. **齐次**：$T(c\mathbf{v})=c\,T(\mathbf{v})$。
> 这条性质有个工程名字——**叠加原理**（superposition）：**先叠加再变换 = 先变换再叠加**。

两条立等可取的事实：

- **$T(\mathbf{0})=\mathbf{0}$**（取 $c=d=0$）：线性变换一定把原点送到原点。因此"平移" $T(\mathbf{v})=\mathbf{v}+\mathbf{v}_0$ **不是**线性变换（它把原点搬走了）——这是最常见的错误认定。
- **线性变换完全由"基向量去哪"决定**（下面详述）。

## 线到线、三角形到三角形，基决定一切

线性有两层几何含义，第一层是"**形状不变形**"：

| 输入 | 输出 |
| --- | --- |
| 直线（过原点） | 仍是一条直线（可能被压成一个点） |
| 不过原点的直线 | 仍是一条直线（可能退化） |
| 三角形 | 三角形（可能被压扁成一条线段） |
| 平行四边形 | 平行四边形 |
| 中点 | 仍映射到中点（线性变换保持"加权平均"） |

**第二层更重要**——它把"线性"变成"可计算"：

> [!tip] 定理 基决定一切
> 若 $\mathbf{v}=x_1\mathbf{v}_1+\cdots+x_n\mathbf{v}_n$（$x_i$ 是 $\mathbf{v}$ 在基 $\mathbf{v}_1,\dots,\mathbf{v}_n$ 下的坐标），则
> $$
> T(\mathbf{v})=x_1T(\mathbf{v}_1)+x_2T(\mathbf{v}_2)+\cdots+x_nT(\mathbf{v}_n)
> $$
> **只要知道每个基向量被送到哪里，整个变换就被唯一确定**——这就是 8.2"变换有矩阵"的全部依据。
> 换句话说：**线性变换的"全部信息量"就是 $n$ 张照片**（$n$ 个基向量的像）。

> [!info] Def 2 核与像
> - **核**（kernel）$\ker(T)=\{\mathbf{v}:T(\mathbf{v})=\mathbf{0}\}$——被"压成零"的那些向量；
> - **像**（image）$\operatorname{im}(T)=\{T(\mathbf{v}):\mathbf{v}\in V\}$——所有可能的输出。
> 两者都是子空间（核是 $V$ 的子空间、像是 $W$ 的子空间）✓

> [!tip] 定理 秩-零化度定理（第 3 章的抽象版）
> **秩-零化度定理**（rank-nullity theorem）：
> $$
> \dim\ker(T)+\dim\operatorname{im}(T)=\dim V=n
> $$
> 并且：
> - **单射**（injective，一对一）$\iff\ker(T)=\{\mathbf{0}\}$；
> - **满射**（surjective，映满）$\iff\operatorname{im}(T)=W$；
> - **可逆**（双射 bijective）$\iff$ 核只有零向量**且** $\dim V=\dim W$。
> 这就是第 3 章"$r+(n-r)=n$"的一般版本：**核 = 零空间，像 = 列空间**，只不过现在 $V,W$ 可以是函数空间、矩阵空间……

> [!warning] 常见的"伪线性"
> | 映射 | 线性吗 | 原因 |
> | --- | --- | --- |
> | $T(\mathbf{v})=A\mathbf{v}$ | ✓ | 线性变换的样板 |
> | $T(\mathbf{v})=\mathbf{v}+\mathbf{v}_0$（平移） | ✗ | $T(\mathbf{0})=\mathbf{v}_0\ne\mathbf{0}$ |
> | $T(\mathbf{v})=\lVert\mathbf{v}\rVert$（长度） | ✗ | $T(-\mathbf{v})\ne-T(\mathbf{v})$ |
> | $T(\mathbf{v})=\mathbf{v}\cdot\mathbf{v}$ | ✗ | 不满足齐次性 |
> | $T(f)=f^2$ | ✗ | 同上 |
> | $T(f)=\mathrm{d}f/\mathrm{d}x$ | ✓ | 导数满足叠加原理 |
> | $T(f)=\int_0^xf(t)\,dt$ | ✓ | 积分同样满足 |

## 变换的例子（大多是线性的）

本章的核心洞见是：**"向量"不必是箭头，"变换"也不必是矩阵乘向量**。函数、矩阵、序列都是向量（第 3 章），它们之间的线性操作就是线性变换。

| 向量空间 $V$ | 线性变换 $T$ | 说明 |
| --- | --- | --- |
| $\mathbb{R}^n$ | $T(\mathbf{v})=A\mathbf{v}$ | 一切线性变换的样板 |
| $\mathbb{R}^2/\mathbb{R}^3$ | 投影、旋转、反射、剪切 | 第 4、6 章的几何 |
| 多项式空间 $P_n$ | $\mathrm{d}/\mathrm{d}x$（求导） | **核 = 常数，像 = $P_{n-1}$** |
| 多项式空间 $P_n$ | $\int_0^x f$（求积） | 像 = 零常数项的多项式 |
| $P_n$ 或连续函数 | $T(f)=f(a)$（求值） | 线性！所以"求值"可以写成矩阵 |
| 矩阵空间 | $T(A)=A^{T}$（转置） | 4 维空间上的变换（见 8.2） |
| 序列空间 | 移位 $T(w_1,w_2,\dots)=(w_2,w_3,\dots)$ | 差分方程的算子 |
| 函数空间 | 卷积 $T(f)=k*f$ | 通信里最重要的线性变换 |
| 任意 | $T=0$（零变换）、$T=cI$（伸缩） | 平凡的两种 |

> [!tip] 三个"灵魂拷问"
> 1. **求值 $T(f)=f(a)$ 是线性的吗？** 是——$(cf+dg)(a)=cf(a)+dg(a)$ ✓ 它的核是"在 $a$ 处为零的所有函数"，像是整个 $\mathbb{R}$（一维）✓ 秩-零化度：无穷维空间降成一维 ✓
> 2. **转置 $T(A)=A^{T}$ 是线性的吗？** 是——$(cA+dB)^{T}=cA^{T}+dB^{T}$ ✓ 它在 4 维矩阵空间上是一个 4×4 矩阵（8.2 会算）✓
> 3. **导数算子的核是什么？** 常数函数（"求导为零"）✓ 所以求导**不是**单射（不同的函数可以有相同的导数，差一个常数），这直接解释了"不定积分要加 $C$"✓

## 平面的线性变换

$2\times2$ 矩阵是观察线性变换最好的窗口。四种典型几何动作：

| 矩阵 | 变换 | 特征值 | 行列式 |
| --- | --- | --- | --- |
| $\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$ | 旋转 | $e^{\pm i\theta}$ | $1$（面积不变） |
| $\begin{bmatrix}0&1\\1&0\end{bmatrix}$ | 关于 $y=x$ 的反射 | $1,-1$ | $-1$（翻面） |
| 投影矩阵 | 投影（**压扁**） | $1,0$ | $0$（面积归零） |
| $\begin{bmatrix}1&c\\0&1\end{bmatrix}$ | 剪切 | $1,1$ | $1$（面积不变） |

四种动作的三个"刻度"正是前几章的核心量：**行列式 = 面积被放大的倍数**（第 5 章）、**特征值 = 保持方向的那几个方向上的伸缩倍数**（第 6 章）、**奇异值 = 任意方向上的最大/最小伸缩**（第 7 章）。**第 5、6、7 章在"平面变换"这张图里汇合了。**

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 330" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la8-a" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la8-g" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <!-- 原网格（虚线灰） -->
  <g stroke="var(--text-faint,#8b949e)" stroke-width="1" stroke-dasharray="5 4" opacity="0.75">
    <line x1="120" y1="110" x2="120" y2="290"/><line x1="180" y1="110" x2="180" y2="290"/>
    <line x1="240" y1="110" x2="240" y2="290"/><line x1="300" y1="110" x2="300" y2="290"/>
    <line x1="360" y1="110" x2="360" y2="290"/>
    <line x1="120" y1="110" x2="360" y2="110"/><line x1="120" y1="170" x2="360" y2="170"/>
    <line x1="120" y1="230" x2="360" y2="230"/><line x1="120" y1="290" x2="360" y2="290"/>
  </g>

  <!-- 剪切后的网格（彩色实线） -->
  <g stroke="#4f46e5" stroke-width="1.6" stroke-opacity="0.85">
    <line x1="75" y1="290" x2="165" y2="110"/><line x1="135" y1="290" x2="225" y2="110"/>
    <line x1="195" y1="290" x2="285" y2="110"/><line x1="255" y1="290" x2="345" y2="110"/>
    <line x1="315" y1="290" x2="405" y2="110"/>
    <line x1="75" y1="290" x2="315" y2="290"/><line x1="105" y1="230" x2="345" y2="230"/>
    <line x1="135" y1="170" x2="375" y2="170"/><line x1="165" y1="110" x2="405" y2="110"/>
  </g>

  <!-- 基向量与原像 -->
  <line x1="240" y1="200" x2="240" y2="140" stroke="var(--text-faint,#8b949e)" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#la8-g)"/>
  <line x1="240" y1="200" x2="270" y2="140" stroke="#4f46e5" stroke-width="2.6" marker-end="url(#la8-a)"/>
  <line x1="240" y1="200" x2="300" y2="200" stroke="#4f46e5" stroke-width="2.6" marker-end="url(#la8-a)"/>
  <circle cx="240" cy="200" r="3.5" fill="var(--text-normal,#1f2328)"/>

  <text x="214" y="136" font-size="11" fill="var(--text-muted,#57606a)">e₂（原位）</text>
  <text x="276" y="132" font-size="11.5" font-weight="600" fill="#4f46e5">Ae₂ = (0.5, 1)</text>
  <text x="306" y="196" font-size="11.5" font-weight="600" fill="#4f46e5">Ae₁ = (1, 0)</text>

  <text x="500" y="82" font-size="12.5" font-weight="600" fill="#4f46e5">剪切 A = [[1, 0.5], [0, 1]]</text>
  <text x="500" y="112" font-size="11.5" fill="var(--text-muted,#57606a)">竖线整体倾斜，横线保持水平</text>
  <text x="500" y="152" font-size="12" fill="var(--text-normal,#1f2328)">网格线仍是直线、间距仍均匀、原点不动</text>
  <text x="500" y="178" font-size="11.5" fill="var(--text-muted,#57606a)">—— 这就是"线性"的画面</text>
  <text x="500" y="218" font-size="12" fill="var(--text-normal,#1f2328)">A 的两列 = 两个基向量的像</text>
  <text x="500" y="244" font-size="11.5" fill="var(--text-muted,#57606a)">（知道 e₁、e₂ 去哪，整个变换就知道了）</text>
  <text x="500" y="284" font-size="11.5" fill="#059669">det = 1：面积不变（第 5 章）</text>
</svg>

> [!tip] 行列式与特征值在"平面变换"里的分工
> - **$\lvert\det\rvert$ = 面积放大倍数**（第 5 章）——它只回答"整体缩了多少"；
> - **特征值 = 沿特征方向的伸缩倍数**（第 6 章）——只对少数特殊方向成立；
> - **奇异值 = 任意正交方向上的最大/最小伸缩**（第 7 章）——对**所有**矩阵都有定义，且给出"最坏/最好"的伸缩比。
> 三者共同回答同一个问题的三个层次：**这个变换把空间怎么"揉"了。**

# 8.2 线性变换的矩阵

既然"基决定一切"，那么选定基之后，线性变换就可以被一组数字（矩阵）完全记录下来。

> [!info] Def 3 线性变换的矩阵
> 取定义域的基 $\mathbf{v}_1,\dots,\mathbf{v}_n$ 与值域的基 $\mathbf{w}_1,\dots,\mathbf{w}_m$。变换 $T$ 的**矩阵** $A$ 的第 $j$ 列，就是 $T(\mathbf{v}_j)$ 在 $\mathbf{w}$ 这组基下的坐标：
> $$
> T(\mathbf{v}_j)=a_{1j}\mathbf{w}_1+a_{2j}\mathbf{w}_2+\cdots+a_{mj}\mathbf{w}_m
> $$
> 于是坐标的对应关系是干净的乘法：
> $$
> \mathbf{v}\ \text{的坐标}\ \mathbf{x}\ \longrightarrow\ T(\mathbf{v})\ \text{的坐标}\ \mathbf{y}=A\mathbf{x}
> $$
> 若两组基都取标准基，$A$ 的第 $j$ 列就是 $T(\mathbf{e}_j)$——**"矩阵的列 = 基向量的像"**。

> [!tip] 定理 线性变换 $\iff$ 矩阵
> 给定两组基，**线性变换与矩阵一一对应**：
> - 每个线性变换都能写成（某组基下的）矩阵乘法；
> - 每个矩阵都定义一个线性变换。
> 所以"研究线性变换"与"研究矩阵"是同一件事——**差别只在于：矩阵多带了两组基的"标签"**。

## 基的变换

同一个变换，换一组基记下来，就得到另一个矩阵。把两件事分开说：**坐标怎么换**、**矩阵怎么换**。

> [!tip] 换基公式（坐标与矩阵）
> 设新基 $\mathbf{u}_1,\dots,\mathbf{u}_n$ 在旧基下的坐标排成矩阵 $M$ 的列（$M$ 就是**换基矩阵**）：
> - **坐标**：同一个向量的新旧坐标满足 $\mathbf{x}_{\text{旧}}=M\mathbf{x}_{\text{新}}$，即 $\mathbf{x}_{\text{新}}=M^{-1}\mathbf{x}_{\text{旧}}$；
> - **矩阵**：同一个变换在新基下的矩阵是
>   $$
>   \boxed{\ B=M^{-1}AM\ }
>   $$
> ——**这正是第 6 章的"相似矩阵"！**"相似"这个名词到这里才彻底说清：**它们是同一个变换的两份记录。**

**例（关于 $y=x$ 的反射）**：标准基下 $A=\begin{bmatrix}0&1\\1&0\end{bmatrix}$；取特征向量作新基 $\mathbf{u}_1=\frac{1}{\sqrt2}(1,1)$、$\mathbf{u}_2=\frac{1}{\sqrt2}(1,-1)$，则 $M=\frac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}$（正交矩阵，$M^{-1}=M^{T}$）：

$$
B=M^{-1}AM=\begin{bmatrix}1&0\\0&-1\end{bmatrix}
$$

**同一个变换，在特征向量这组基下变成了对角矩阵** ✓ 检验"相似不变量"：两个矩阵的迹都是 $0$、行列式都是 $-1$、特征值都是 $1,-1$ ✓（第 6 章）

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 320" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la8-v" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-normal,#1f2328)"/>
    </marker>
    <marker id="la8-av" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#059669"/>
    </marker>
    <marker id="la8-ax" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <!-- 左：标准基 -->
  <text x="200" y="44" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">标准基下的记录</text>
  <line x1="115" y1="190" x2="300" y2="190" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la8-ax)"/>
  <line x1="200" y1="290" x2="200" y2="80" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la8-ax)"/>
  <line x1="110" y1="280" x2="290" y2="100" stroke="#db2777" stroke-width="1.4" stroke-dasharray="6 4"/>
  <line x1="200" y1="190" x2="282" y2="162" stroke="var(--text-normal,#1f2328)" stroke-width="2.2" marker-end="url(#la8-v)"/>
  <line x1="200" y1="190" x2="227" y2="107" stroke="#059669" stroke-width="2.2" marker-end="url(#la8-av)"/>
  <text x="288" y="166" font-size="12" font-weight="700" fill="var(--text-normal,#1f2328)">v</text>
  <text x="232" y="100" font-size="12" font-weight="700" fill="#059669">Av</text>
  <text x="180" y="272" font-size="11" fill="#db2777">y = x</text>
  <text x="200" y="306" text-anchor="middle" font-size="11.5" font-weight="600" fill="#4f46e5">A = [[0, 1], [1, 0]]</text>

  <!-- 右：特征向量基 -->
  <text x="610" y="44" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">同一变换，换一组基（特征向量基）</text>
  <line x1="525" y1="280" x2="705" y2="100" stroke="#4f46e5" stroke-width="1.4" stroke-dasharray="6 4"/>
  <line x1="525" y1="100" x2="705" y2="280" stroke="#db2777" stroke-width="1.4" stroke-dasharray="6 4"/>
  <text x="706" y="96" font-size="11.5" font-weight="600" fill="#4f46e5">u₁</text>
  <text x="706" y="290" font-size="11.5" font-weight="600" fill="#db2777">u₂</text>
  <line x1="610" y1="190" x2="692" y2="162" stroke="var(--text-normal,#1f2328)" stroke-width="2.2" marker-end="url(#la8-v)"/>
  <line x1="610" y1="190" x2="637" y2="107" stroke="#059669" stroke-width="2.2" marker-end="url(#la8-av)"/>
  <text x="698" y="168" font-size="12" font-weight="700" fill="var(--text-normal,#1f2328)">v</text>
  <text x="642" y="100" font-size="12" font-weight="700" fill="#059669">Av</text>
  <circle cx="610" cy="190" r="3" fill="var(--text-normal,#1f2328)"/>
  <circle cx="200" cy="190" r="3" fill="var(--text-normal,#1f2328)"/>
  <text x="610" y="306" text-anchor="middle" font-size="11.5" font-weight="600" fill="#4f46e5">Λ = [[1, 0], [0, −1]]</text>

  <text x="420" y="270" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">同一个 v：在 u 坐标下，沿 u₁ 的分量不变、沿 u₂ 的分量变号</text>
  <text x="420" y="292" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">B = M⁻¹AM：两个矩阵相似，迹、行列式、特征值完全相同（第 6 章）</text>
</svg>

> [!warning] 观念转变：矩阵不是变换
> 初学者会把"矩阵"和"变换"当成一个东西，于是觉得"两个不同的矩阵怎么可能相等"。正确的图景是：
> $$
> \text{变换 }T\ \xrightarrow{\ \text{选定两组基}\ }\ \text{矩阵 }A
> $$
> 换基不改变变换，只改变**记录方式**。所以"相似矩阵"不是"两个不同的东西碰巧像"，而是"**同一个东西的两种写法**"——就像同一个向量在不同坐标系里的两组坐标。

## 变换矩阵的构造

**三步走**：① 选好两组基；② 逐个算 $T(\mathbf{v}_j)$；③ 把结果写成值域基的组合，系数抄成第 $j$ 列。

**例 1（导数算子，$P_3\to P_3$，基 $1,x,x^2,x^3$）**：

$$
T(1)=0,\qquad T(x)=1,\qquad T(x^2)=2x,\qquad T(x^3)=3x^2
\quad\Longrightarrow\quad
D=\begin{bmatrix}0&1&0&0\\0&0&2&0\\0&0&0&3\\0&0&0&0\end{bmatrix}
$$

读这个矩阵：**上对角线上一列常数 $1,2,3$**（求导把 $x^k$ 降一次幂、系数乘 $k$）✓
核与像一目了然：$\ker D=\operatorname{span}\{1\}$（常数，1 维）、$\operatorname{im}D=P_2$（3 维），$1+3=4$ ✓ 秩-零化度定理成立。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 300" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la8-d" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
  </defs>

  <!-- 矩阵 -->
  <text x="150" y="46" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">D（基 1, x, x², x³）</text>
  <path d="M92 62 L84 62 L84 222 L92 222" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <path d="M208 62 L216 62 L216 222 L208 222" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <g font-size="13.5" text-anchor="middle">
    <text x="118" y="90" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text><text x="150" y="90" font-weight="700" fill="#2563eb">1</text><text x="182" y="90" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text>
    <text x="118" y="130" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text><text x="150" y="130" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text><text x="182" y="130" font-weight="700" fill="#2563eb">2</text>
    <text x="118" y="170" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text><text x="150" y="170" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text><text x="182" y="170" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text>
    <text x="118" y="210" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text><text x="150" y="210" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text><text x="182" y="210" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text>
  </g>
  <text x="150" y="246" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">上三角：求导"降一次幂"</text>

  <!-- 阶梯图 -->
  <text x="520" y="46" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">d/dx 把基向量送到哪</text>
  <g font-size="12.5" text-anchor="middle" fill="var(--text-normal,#1f2328)">
    <rect x="350" y="56" width="70" height="28" rx="4" fill="#4f46e5" fill-opacity="0.12" stroke="#4f46e5" stroke-opacity="0.5"/><text x="385" y="75">1</text>
    <rect x="350" y="106" width="70" height="28" rx="4" fill="#4f46e5" fill-opacity="0.12" stroke="#4f46e5" stroke-opacity="0.5"/><text x="385" y="125">x</text>
    <rect x="350" y="156" width="70" height="28" rx="4" fill="#4f46e5" fill-opacity="0.12" stroke="#4f46e5" stroke-opacity="0.5"/><text x="385" y="175">x²</text>
    <rect x="350" y="206" width="70" height="28" rx="4" fill="#4f46e5" fill-opacity="0.12" stroke="#4f46e5" stroke-opacity="0.5"/><text x="385" y="225">x³</text>
    <rect x="590" y="56" width="70" height="28" rx="4" fill="#d97706" fill-opacity="0.12" stroke="#d97706" stroke-opacity="0.5"/><text x="625" y="75">0</text>
    <rect x="590" y="106" width="70" height="28" rx="4" fill="#d97706" fill-opacity="0.12" stroke="#d97706" stroke-opacity="0.5"/><text x="625" y="125">1</text>
    <rect x="590" y="156" width="70" height="28" rx="4" fill="#d97706" fill-opacity="0.12" stroke="#d97706" stroke-opacity="0.5"/><text x="625" y="175">2x</text>
    <rect x="590" y="206" width="70" height="28" rx="4" fill="#d97706" fill-opacity="0.12" stroke="#d97706" stroke-opacity="0.5"/><text x="625" y="225">3x²</text>
  </g>
  <g stroke="#4f46e5" stroke-width="1.6" marker-end="url(#la8-d)">
    <line x1="424" y1="70" x2="584" y2="70"/>
    <line x1="424" y1="120" x2="584" y2="70"/>
    <line x1="424" y1="170" x2="584" y2="120"/>
    <line x1="424" y1="220" x2="584" y2="170"/>
  </g>
  <text x="504" y="94" text-anchor="middle" font-size="11" fill="#4f46e5">0</text>
  <text x="504" y="142" text-anchor="middle" font-size="11" fill="#4f46e5">1</text>
  <text x="504" y="192" text-anchor="middle" font-size="11" fill="#4f46e5">2x</text>
  <text x="504" y="242" text-anchor="middle" font-size="11" fill="#4f46e5">3x²</text>

  <text x="200" y="278" font-size="11.5" fill="#d97706">核 = 常数（1 维，被压成 0）</text>
  <text x="440" y="278" font-size="11.5" fill="#4f46e5">像 = P₂（3 维）</text>
  <text x="620" y="278" font-size="11.5" font-weight="600" fill="#059669">1 + 3 = 4 ✓</text>
</svg>

**例 2（积分算子）**：$T(f)=\int_0^xf(t)\,\mathrm{d}t$ 在同样的基下：

$$
I(1)=x,\quad I(x)=\frac{x^2}{2},\quad I(x^2)=\frac{x^3}{3}
\quad\Longrightarrow\quad
I=\begin{bmatrix}0&0&0&0\\1&0&0&0\\0&\frac12&0&0\\0&0&\frac13&0\end{bmatrix}
$$

（$x^3$ 被积分成 $\frac{x^4}{4}$，跑出了 $P_3$——所以最后一列全零，这正说明"积分不是 $P_3$ 到自身的双射"。）

$$
DI=\begin{bmatrix}1&0&0&0\\0&1&0&0\\0&0&1&0\\0&0&0&0\end{bmatrix}\ne ID=\begin{bmatrix}0&0&0&0\\0&1&0&0\\0&0&1&0\\0&0&0&1\end{bmatrix}
$$

**先积分再求导 = 恒等（截断最高次）**；**先求导再积分则丢掉了常数**——两个算子不可交换 ✓ 这正是"不定积分要加 $C$"的矩阵版。

**例 3（转置算子，2×2 矩阵空间，基 $E_{11},E_{12},E_{21},E_{22}$）**：$T(A)=A^{T}$ 交换 $E_{12}\leftrightarrow E_{21}$，其余不动：

$$
T=\begin{bmatrix}1&0&0&0\\0&0&1&0\\0&1&0&0\\0&0&0&1\end{bmatrix}
\quad\Longrightarrow\quad
\text{特征值}=1,1,1,-1
$$

读出来：**$+1$ 对应"转置不变"的对称矩阵（3 维），$-1$ 对应反对称矩阵（1 维）**——$3+1=4$ ✓ 任何矩阵都能唯一拆成"对称 + 反对称"两半，正是这个变换的"特征子空间分解"✓（迹 $=2$、行列式 $=-1$ 也都能验算。）

## 矩阵乘积AB对应变换TS

为什么矩阵乘法定义成"行乘列"那副麻烦样子？因为**它就是变换的复合**。

> [!tip] 定理 复合 = 乘积
> 若 $S$ 的矩阵是 $B$、$T$ 的矩阵是 $A$（同一组基），则复合"先 $S$ 后 $T$"的矩阵是
> $$
> TS\ \longleftrightarrow\ AB
> $$
> **一行说明**：乘积 $AB$ 的第 $j$ 列 $=A\cdot(B\ \text{的第}\ j\ \text{列})=A\cdot(S(\mathbf{v}_j)\ \text{的坐标})=T(S(\mathbf{v}_j))$ 的坐标 ✓
> **注意顺序**：写在左边的先作用在**结果**上——"先穿袜子后穿鞋"对应"先乘 $B$ 再乘 $A$"（第 2 章的穿脱鞋序）。

| 变换语言 | 矩阵语言 |
| --- | --- |
| $T(S(\mathbf{v}))$（先 $S$ 后 $T$） | $AB\mathbf{x}$ |
| 恒等变换 | $I$ |
| $T$ 可逆 | $A$ 可逆，逆变换 $\leftrightarrow A^{-1}$ |
| $T\circ T=T$（投影） | $A^2=A$（幂等，第 4 章） |
| $T^2=0$（移位） | $A^2=0$（幂零，8.3 的若尔当形） |
| 旋转 $90°$ 两次 | $Q^2=\begin{bmatrix}0&-1\\1&0\end{bmatrix}^2=-I$ |
| 不可交换 $TS\ne ST$ | $AB\ne BA$（旋转与投影不能换序） |

> [!tip] 幂零变换：$T^2=0$ 但 $T\ne0$
> **幂零变换**（nilpotent transformation）：最简的例子是 $S(x,y)=(0,x)$，即 $S=\begin{bmatrix}0&0\\1&0\end{bmatrix}$：
> $$
> S^2=0,\qquad \lambda=0,0,\qquad \ker S=\operatorname{span}\{(0,1)\}
> $$
> 它把整个平面"压"到 $y$ 轴，再压一次就什么都没了。**它只有一条特征方向、特征值全为 0、不能对角化**——这就是 8.3"若尔当形"的最简样本 ✓

## 选取最佳基

同一个变换，矩阵可以五花八门。**选基的自由度就是"简化矩阵"的自由度**——这是本章最有工程价值的一句话。

> [!tip] "好基"的四个标准
> | 标准 | 含义 | 对应工具 |
> | --- | --- | --- |
> | **低耦合** | 矩阵尽可能对角（各方向互不干扰） | 特征向量基（第 6 章） |
> | **正交** | 基向量两两垂直、长度 1 ⇒ 条件数 $=1$ | Gram-Schmidt、QR（第 4 章） |
> | **稀疏** | 非零元素少 ⇒ 计算省 | 若尔当形、带状化、FFT |
> | **有物理意义** | 基向量对应真实模式（频率、波束、振型） | 傅里叶基、特征波束 |

**三个层次的答案**（按对象从特殊到一般）：

| 对象 | 最好的基 | 得到的矩阵 |
| --- | --- | --- |
| 可对角化的方阵 | 特征向量基 | $\Lambda$（对角） |
| 不可对角化的方阵 | 广义特征向量基 | $J$（若尔当形，几乎对角） |
| **任意矩阵**（含非方阵） | $V$ 与 $U$ 两组正交基 | $\Sigma$（对角）——**SVD（第 7 章）** |

> [!warning] 基选得不好，好问题会变成坏问题
> 同一个变换在不同基下的矩阵，**条件数可以差好几个数量级**。第 4 章说"$A^TA$ 的条件数是 $A$ 的平方、别用它解最小二乘"；本章给出了根治的办法：**换一组好基**（正交化、SVD），让条件数回到 1。
> 一条工程铁律：**"用哪个基"往往比"用哪个算法"更决定成败。**

# 8.3 搜索一组好基

上一节说了"好基"的标准，这一节具体去找。

## 若尔当形

不能对角化时，退而求其次的答案是**若尔当形**（Jordan form）。

> [!tip] 定理 若尔当标准形
> 任何方阵 $A$ 都相似于一个"近似对角"的矩阵 $J$：
> $$
> J=\begin{bmatrix}\lambda&1&&\\&\lambda&\ddots&\\&&\ddots&1\\&&&\lambda\end{bmatrix}
> \quad\text{或由多个这样的块拼成},\qquad M^{-1}AM=J
> $$
> - 对角线上放特征值，**紧邻的上对角线放 1**（其余为 0）；
> - 可对角化 $\iff$ 所有块都是 $1\times1$；
> - **相似分类的完整答案**：两个矩阵相似 $\iff$ 它们的若尔当形相同（不计块的排列）✓

**算子在这组基下做什么**（一个 $2\times2$ 的块）：

$$
J=\begin{bmatrix}\lambda&1\\0&\lambda\end{bmatrix}:\qquad
J\mathbf{v}_1=\lambda\mathbf{v}_1,\qquad J\mathbf{v}_2=\lambda\mathbf{v}_2+\mathbf{v}_1
$$

即：**沿主特征方向拉伸 $\lambda$ 倍，另一个方向"跟着走"（剪切）**。所以若尔当块 = **"拉伸 + 剪切"**，只有一个特征方向。

**后果出现在幂与指数里**（呼应第 6 章）：

$$
J^k=\begin{bmatrix}\lambda^k&k\lambda^{k-1}\\0&\lambda^k\end{bmatrix},
\qquad
e^{Jt}=e^{\lambda t}\begin{bmatrix}1&t\\0&1\end{bmatrix}
$$

——多项式因子 $k$、$t$ 冒出来了。工程上这就是"**临界阻尼**"响应 $te^{\lambda t}$ 的来源（第 6 章那三种阻尼里的第三种）✓

> [!warning] 若尔当形"存在但不可算"
> 若尔当形**对元素的微小扰动极其敏感**：$\begin{bmatrix}\lambda&\varepsilon\\0&\lambda\end{bmatrix}$ 里的 $\varepsilon$ 从 $0$ 变成 $10^{-15}$，若尔当形就从"一个 $2\times2$ 块"变成"两个 $1\times1$ 块"——**结构突变**。
> 所以数值线性代数**不用若尔当形**，而用**舒尔分解**（Schur decomposition）：任何方阵都**酉相似**（unitary similarity，即取 $Q^{-1}=Q^{H}$ 的相似）于上三角矩阵
> $$
> A=QTQ^{H}\quad(Q\ \text{酉},\ T\ \text{上三角})
> $$
> $T$ 的对角线就是特征值，而且 $Q$ 正交/酉 ⇒ **数值稳定**（条件数不放大，第 4 章的老朋友）。
> 一句话：**数学上用若尔当形，计算上用舒尔形。**

## 函数空间的基

**函数也是向量**（第 3 章），所以函数空间也有"基"，只是基是**无穷多个函数**：

$$
f(x)=c_0\phi_0(x)+c_1\phi_1(x)+c_2\phi_2(x)+\cdots
$$

**三种经典选择**：

| 基 | 形式 | 擅长 |
| --- | --- | --- |
| **幂基** | $1,x,x^2,x^3,\dots$ | **泰勒级数**（Taylor series）；局部展开；**但在区间上病态** |
| **三角函数基** | $1,\cos x,\sin x,\cos2x,\sin2x,\dots$ | **周期函数**（傅里叶级数，Fourier series） |
| **正交多项式**（orthogonal polynomials） | 勒让德、切比雪夫、…… | **有限区间**上的逼近与积分 |

> [!tip] 三个基在"做什么算子"上的分工
> | 想对角化的算子 | 用什么基 | 结果 |
> | --- | --- | --- |
> | 移位 / 卷积 / 微分（周期情形） | 傅里叶基 $e^{ikx}$ | **对角**，特征值 $ik$（或 $H(\omega)$） |
> | 微分（有限区间） | 正交多项式基 | 稀疏（带状） |
> | 一般的线性变换 | SVD 的两组基 | 对角 $\Sigma$ |
> **傅里叶基把微分变成"乘 $ik$"**：$\dfrac{\mathrm{d}}{\mathrm{d}x}e^{ikx}=ik\,e^{ikx}$——这就是"频域"的全部秘密 ✓ 第 6 章说"$e^{st}$ 是 LTI 系统的特征函数"，本章说清了它为什么是最佳基：**它让微分/卷积算子对角化**。

**用第 4 章的投影来理解"展开"**：给定内积 $\langle f,g\rangle=\int f(x)g(x)w(x)\,\mathrm{d}x$，把 $f$ 投到基函数 $\phi_i$ 上：

$$
f\approx\sum_i c_i\phi_i,\qquad
c_i=\frac{\langle f,\phi_i\rangle}{\langle\phi_i,\phi_i\rangle}\quad(\text{正交基时})
$$

——**正交基的系数可以逐个"点积"算出，不用解任何方程组** ✓ 这就是"正交基好"的根本原因（第 4 章的 $Q^{T}\mathbf{b}$ 在函数空间的版本）。

## 函数空间的正交基

> [!info] Def 4 正交函数系
> 若 $\langle\phi_i,\phi_j\rangle=\int\phi_i(x)\phi_j(x)w(x)\,\mathrm{d}x=0$（$i\ne j$），称 $\{\phi_i\}$ 关于权 $w$ **正交**（orthogonal）；再归一化 $\langle\phi_i,\phi_i\rangle=1$ 就是**标准正交**（orthonormal）。

> [!warning] 幂基不正交，而且病态得可怕
> 在 $[-1,1]$ 上算 $\int_{-1}^{1}x\cdot x^{3}\,\mathrm{d}x=\frac25\ne0$——**幂基之间根本不正交**。更糟的是它的**Gram 矩阵**（Gram matrix，由 $\langle\phi_i,\phi_j\rangle$ 拼成的矩阵）：
> - 在 $[-1,1]$ 上，$4\times4$ 的 Gram 矩阵条件数约 $68$；
> - 在 $[0,1]$ 上它就是**希尔伯特矩阵**（Hilbert matrix）$H_{ij}=\frac{1}{i+j-1}$：
>   $$
>   \operatorname{cond}(H_3)\approx524,\quad \operatorname{cond}(H_5)\approx4.8\times10^{5},\quad \operatorname{cond}(H_8)\approx1.5\times10^{10},\quad \operatorname{cond}(H_{10})\approx1.6\times10^{13}
>   $$
> 「用幂基做高阶逼近」等于在第 4 章说的"条件数平方"上再雪上加霜——**数值上不可行**。
> 出路：**对幂基做 Gram-Schmidt**（第 4 章的正交化！），就得到正交多项式 ✓

> [!tip] 正交基的三大好处（工程版）
> 1. **系数一次算出**：$c_i=\langle f,\phi_i\rangle/\langle\phi_i,\phi_i\rangle$，不用解线性方程组；
> 2. **条件数不爆炸**：Gram 矩阵变成对角（归一化后就是单位阵），误差不放大；
> 3. **误差可读**：丢掉后面几项造成的误差 = 被丢掉系数的平方和（Eckart–Young 的函数版，第 7 章）✓

## 勒让德多项式和切比雪夫多项式

对**幂基 $\{1,x,x^2,\dots\}$ 做 Gram-Schmidt**，在 $[-1,1]$ 上就得到勒让德多项式，带权 $1/\sqrt{1-x^2}$ 就得到切比雪夫多项式。

| | **勒让德**（Legendre）$P_n$ | **切比雪夫**（Chebyshev）$T_n$ |
| --- | --- | --- |
| 权重 $w(x)$ | $1$ | $1/\sqrt{1-x^2}$ |
| 前几个 | $P_0=1$，$P_1=x$，$P_2=\dfrac{3x^2-1}{2}$，$P_3=\dfrac{5x^3-3x}{2}$ | $T_0=1$，$T_1=x$，$T_2=2x^2-1$，$T_3=4x^3-3x$ |
| 正交性 | $\displaystyle\int_{-1}^{1}P_iP_j\,\mathrm{d}x=0\ (i\ne j)$ | $\displaystyle\int_{-1}^{1}\frac{T_iT_j}{\sqrt{1-x^2}}\,\mathrm{d}x=0\ (i\ne j)$ |
| 范数 | $\int_{-1}^{1}P_n^2=\dfrac{2}{2n+1}$ | $\int_{-1}^{1}\dfrac{T_n^2}{\sqrt{1-x^2}}=\dfrac{\pi}{2}\ (n\ge1)$ |
| 招牌性质 | 递推（recurrence）$(n+1)P_{n+1}=(2n+1)xP_n-nP_{n-1}$ | $\boxed{T_n(\cos\theta)=\cos n\theta}$ |
| 典型用途 | 高斯-勒让德数值积分；球谐函数 | **等波纹逼近**；切比雪夫滤波器、天线阵 |

**验证过的数字**（数值积分）：勒让德的 Gram 矩阵是 $\operatorname{diag}\!\left(2,\frac23,\frac25,\frac27\right)$ ✓；切比雪夫是 $\operatorname{diag}\!\left(\pi,\frac\pi2,\frac\pi2,\frac\pi2\right)$ ✓ —— **严格对角，非对角元为零** ✓

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 330" width="100%" style="max-width:840px" font-family="inherit">
  <!-- 左：Legendre -->
  <text x="210" y="42" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">勒让德 P₁, P₂, P₃（权 = 1）</text>
  <line x1="140" y1="170" x2="285" y2="170" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <line x1="210" y1="243" x2="210" y2="110" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <text x="150" y="186" font-size="10.5" fill="var(--text-faint,#8b949e)">−1</text>
  <text x="270" y="186" font-size="10.5" fill="var(--text-faint,#8b949e)">+1</text>
  <path d="M150.0,215.0 L156.0,210.5 L162.0,206.0 L168.0,201.5 L174.0,197.0 L180.0,192.5 L186.0,188.0 L192.0,183.5 L198.0,179.0 L204.0,174.5 L210.0,170.0 L216.0,165.5 L222.0,161.0 L228.0,156.5 L234.0,152.0 L240.0,147.5 L246.0,143.0 L252.0,138.5 L258.0,134.0 L264.0,129.5 L270.0,125.0" fill="none" stroke="#4f46e5" stroke-width="2"/>
  <path d="M150.0,125.0 L156.0,137.8 L162.0,149.3 L168.0,159.4 L174.0,168.2 L180.0,175.6 L186.0,181.7 L192.0,186.4 L198.0,189.8 L204.0,191.8 L210.0,192.5 L216.0,191.8 L222.0,189.8 L228.0,186.4 L234.0,181.7 L240.0,175.6 L246.0,168.2 L252.0,159.4 L258.0,149.3 L264.0,137.8 L270.0,125.0" fill="none" stroke="#db2777" stroke-width="2"/>
  <path d="M150.0,215.0 L156.0,191.3 L162.0,173.6 L168.0,161.3 L174.0,153.8 L180.0,150.3 L186.0,150.2 L192.0,152.8 L198.0,157.4 L204.0,163.4 L210.0,170.0 L216.0,176.6 L222.0,182.6 L228.0,187.2 L234.0,189.8 L240.0,189.7 L246.0,186.2 L252.0,178.7 L258.0,166.4 L264.0,148.7 L270.0,125.0" fill="none" stroke="#d97706" stroke-width="2"/>
  <g font-size="11">
    <text x="300" y="70" fill="#4f46e5">— P₁ = x</text>
    <text x="300" y="92" fill="#db2777">— P₂ = (3x² − 1)/2</text>
    <text x="300" y="114" fill="#d97706">— P₃ = (5x³ − 3x)/2</text>
    <text x="300" y="144" font-size="10.5" fill="var(--text-muted,#57606a)">∫PᵢPⱼ dx = 0 (i≠j)</text>
    <text x="300" y="164" font-size="10.5" fill="var(--text-muted,#57606a)">∫Pₙ² = 2/(2n+1)</text>
    <text x="300" y="192" font-size="10.5" fill="var(--text-muted,#57606a)">用途：Gauss 数值积分、</text>
    <text x="300" y="210" font-size="10.5" fill="var(--text-muted,#57606a)">球谐函数（天线方向图）</text>
  </g>

  <!-- 右：Chebyshev -->
  <text x="620" y="42" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">切比雪夫 T₁, T₂, T₃（权 = 1/√(1−x²)）</text>
  <line x1="550" y1="170" x2="695" y2="170" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <line x1="620" y1="243" x2="620" y2="110" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <text x="560" y="186" font-size="10.5" fill="var(--text-faint,#8b949e)">−1</text>
  <text x="680" y="186" font-size="10.5" fill="var(--text-faint,#8b949e)">+1</text>
  <path d="M560.0,215.0 L566.0,210.5 L572.0,206.0 L578.0,201.5 L584.0,197.0 L590.0,192.5 L596.0,188.0 L602.0,183.5 L608.0,179.0 L614.0,174.5 L620.0,170.0 L626.0,165.5 L632.0,161.0 L638.0,156.5 L644.0,152.0 L650.0,147.5 L656.0,143.0 L662.0,138.5 L668.0,134.0 L674.0,129.5 L680.0,125.0" fill="none" stroke="#4f46e5" stroke-width="2"/>
  <path d="M560.0,125.0 L566.0,142.1 L572.0,157.4 L578.0,170.9 L584.0,182.6 L590.0,192.5 L596.0,200.6 L602.0,206.9 L608.0,211.4 L614.0,214.1 L620.0,215.0 L626.0,214.1 L632.0,211.4 L638.0,206.9 L644.0,200.6 L650.0,192.5 L656.0,182.6 L662.0,170.9 L668.0,157.4 L674.0,142.1 L680.0,125.0" fill="none" stroke="#db2777" stroke-width="2"/>
  <path d="M560.0,215.0 L566.0,179.7 L572.0,154.2 L578.0,137.2 L584.0,127.9 L590.0,125.0 L596.0,127.5 L602.0,134.4 L608.0,144.4 L614.0,156.7 L620.0,170.0 L626.0,183.3 L632.0,195.6 L638.0,205.6 L644.0,212.5 L650.0,215.0 L656.0,212.1 L662.0,202.8 L668.0,185.8 L674.0,160.3 L680.0,125.0" fill="none" stroke="#d97706" stroke-width="2"/>
  <g font-size="11">
    <text x="710" y="70" fill="#4f46e5">— T₁ = x</text>
    <text x="710" y="92" fill="#db2777">— T₂ = 2x² − 1</text>
    <text x="710" y="114" fill="#d97706">— T₃ = 4x³ − 3x</text>
  </g>
  <text x="420" y="286" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">切比雪夫的极值在 [−1,1] 上交替取 ±1（等波纹）—— 这正是 T_n(cos θ) = cos nθ 的直接后果</text>
  <text x="420" y="310" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">它不是"某组基"的特例，而是"对幂基做 Gram-Schmidt"的必然结果（第 4 章）</text>
</svg>

> [!tip] 为什么切比雪夫在逼近里"最优"
> $T_n(\cos\theta)=\cos n\theta$ 意味着：当 $x$ 在 $[-1,1]$ 上走一圈，$T_n(x)$ 在 $[-1,1]$ 内**来回振荡 $n$ 次且恰好触及 $\pm1$**（"等波纹"，equiripple）。
> - 它的最大绝对值在"首项系数为 $2^{n-1}$ 的多项式"里是**最小的**（minimax 定理）⇒ 用切比雪夫节点做插值/逼近，最大误差最小；
> - 工程上这就是**切比雪夫滤波器**（通带或阻带等波纹）的原理，也是**切比雪夫天线阵**（等副瓣电平）的原理 ✓

> [!note] 通信方向：好基的工程清单
> - **傅里叶基**：让"卷积"变成"乘法"（**OFDM 的正交子载波**、频域均衡），让"微分"变成"乘 $j\omega$"；**FFT** 是 $O(n\log n)$ 的快速换基算法——通信里"换基比算法更重要"的最佳例证（[[vault-notes/5g/phy/04-physical-channels-signals]]）；
> - **正交多项式基**：**切比雪夫滤波器**（等波纹）、**切比雪夫阵列加权**（等副瓣，雷达/天线）；**勒让德**用于高斯数值积分、球谐函数（电磁场与方向图建模）；波形设计与信道建模中的多项式逼近；
> - **正交基的一般意义**：正交 = 无干扰。**子载波正交**（OFDM）、**码字正交**（第 12 章的 Walsh/Hadamard）、**波束正交**（MIMO）都是"在函数/向量空间里挑一组正交基"，这正是本章与第 4 章反复强调的那件事；
> - **为什么不用幂基**：希尔伯特矩阵的条件数 $10^{13}$（10 阶）——"用泰勒基做高阶拟合"在数值上等于自杀 ✓

> [!tip] 本章收官
> 第 8 章把整本书的视角"抬高了一层"：
> 1. **8.1** 线性变换（$T(c\mathbf{v}+d\mathbf{w})=cT\mathbf{v}+dT\mathbf{w}$）：**线到线、三角形到三角形**；核与像给出秩-零化度定理；函数的求导、求积、求值、卷积都是线性变换；
> 2. **8.2** 选定两组基 ⇒ 变换变成矩阵（**列 = 基向量的像**）；**换基 = 相似变换 $B=M^{-1}AM$**——"相似"就是"同一个变换的两份记录"；复合 = 矩阵乘法（这就是矩阵乘法的定义理由）；选基决定矩阵的好坏；
> 3. **8.3** 找好基的三个层次：**特征向量基（对角）→ 若尔当形（几乎对角，但数值上改用舒尔三角化）→ SVD（任意矩阵的两组正交基）**；函数空间里则是**幂基（病态）→ 傅里叶基（周期最优）→ 正交多项式（区间最优，由 Gram-Schmidt 得到）**。
>
> 一句话：**选基的自由度，就是线性代数的"旋钮"——把变换放到对的基里，一切都会变简单。**

## 本章知识地图

```
线性变换：矩阵只是"变换 + 两组基"的快照
  ├─ 8.1 线性变换的思想
  │      ├── 定义 T(cv + dw) = cT(v) + dT(w)（叠加原理）；T(0) = 0
  │      ├── 线到线、三角形到三角形；中点→中点
  │      ├── ★ 基决定一切：T(v) = Σ x_i T(v_i)——知道基向量去哪，就知道了全部
  │      ├── 核与像：dim ker + dim im = n（秩-零化度的抽象版）
  │      │      └── 单射 ⟺ ker = {0}；满射 ⟺ im = W；可逆 ⟺ 双射
  │      ├── 例子：矩阵乘、投影、旋转、求导、求积、求值、转置、移位、卷积
  │      └── 平面的四种动作：旋转 / 反射 / 投影 / 剪切
  │             └── det（面积）、λ（保持方向）、σ（最大最小伸缩）在这里汇合
  │
  ├─ 8.2 线性变换的矩阵
  │      ├── 构造三步：选基 → 算 T(v_j) → 系数抄成第 j 列
  │      ├── ★ 换基：坐标 x新 = M⁻¹x旧；矩阵 B = M⁻¹AM（就是"相似"！）
  │      │      └── 同一个变换的两份记录：迹/行列式/特征值都不变
  │      ├── 例：求导 D（上三角，核=常数、像=P₂）；求积 I（DI ≠ ID）
  │      │      转置算子（λ = +1 对称 / −1 反对称）
  │      ├── 复合 = 矩阵乘积（AB）：幂等 A²=A、幂零 A²=0、旋转 Q²=−I；不可交换
  │      └── 选取最佳基：低耦合 / 正交 / 稀疏 / 有物理意义
  │             └── 三层次：特征向量基 → 若尔当形 → SVD
  │
  └─ 8.3 搜索一组好基
         ├── 若尔当形 J（对角 λ + 上对角线 1）；J^k、e^(Jt) 里出现 k、t 因子
         │      └── 数值上改用舒尔分解 A = QTQᴴ（酉 + 上三角，稳定）
         ├── 函数空间的基：幂基（泰勒）/ 三角函数基（傅里叶）/ 正交多项式
         │      └── 展开系数 = 投影（第 4 章）：c_i = ⟨f,φ_i⟩/⟨φ_i,φ_i⟩
         ├── 函数空间的正交基：幂基不正交 + 病态（希尔伯特矩阵 cond 10^13）
         │      └── 正交基三大好处：系数一次算出 / 条件数好 / 误差可读
         └── 勒让德 P_n 与切比雪夫 T_n
                ├── 都 = 对幂基做 Gram-Schmidt（分别带权 1 与 1/√(1−x²)）
                ├── Legendre：Gauss 数值积分、球谐函数
                └── Chebyshev：T_n(cosθ) = cos nθ → 等波纹 → 滤波器 / 天线阵
```

## 关联

- 上一章：[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]
- 下一章：[[vault-notes/math/linear-algebra/09-complex-vectors-matrices]]

**本章与前面章节的接口**（这一章是把前面所有概念"抬高一层"后重新讲一遍）：

| 前面的概念 | 第 8 章的升级版 |
| --- | --- |
| 第 3 章：向量空间、基、维数 | 从 $\mathbb{R}^n$ 推广到**任意**向量空间（函数、矩阵、序列） |
| 第 3 章：$r+(n-r)=n$ | $\dim\ker T+\dim\operatorname{im}T=\dim V$（同一个定理） |
| 第 3 章：零空间/列空间 | 就是 $\ker T$、$\operatorname{im}T$（换了个名字） |
| 第 2 章：矩阵乘法"为什么这样定义" | 因为**它就是变换的复合** |
| 第 4 章：Gram-Schmidt、正交基 | 对幂基做 Gram-Schmidt ⇒ **正交多项式**（8.3） |
| 第 4 章：投影、最小二乘 | 函数空间的投影 = 函数逼近；正交基让系数一次算完 |
| 第 4 章：条件数 | 基选得差 ⇒ 条件数爆炸（希尔伯特矩阵）；**换基就是换条件数** |
| 第 5 章：$\det$ = 面积/体积缩放 | 变换的"体积放大倍数"（8.1 的四格表） |
| 第 6 章：相似矩阵 $B=M^{-1}AM$ | 本章说清它的含义：**同一个变换的两份记录**；8.3 给出若尔当形 |
| 第 6 章：$e^{st}$ 是 LTI 的特征函数 | 傅里叶基让微分/卷积算子**对角化**（8.3） |
| 第 7 章：$A=U\Sigma V^{T}$ | "给一般矩阵找两组好基"——本章选基问题的终极答案 |

**通信方向应用**：

- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 本章是通信里"频域思维"的数学出处：**傅里叶基让卷积算子对角化**（时域卷积 = 频域相乘），于是均衡、滤波、信道估计都能逐子载波独立完成；**OFDM 的子载波正交**就是"选一组正交基"；**FFT** 是 $O(n\log n)$ 的快速换基，工程上"换个基就快一个数量级"的典范；**切比雪夫滤波器/切比雪夫天线阵**直接来自 8.3 的正交多项式；MIMO 的**特征波束**则是"用特征向量当基"（第 6、7 章）。
- [[vault-notes/communication/09-optimal-reception]] —— 信号空间是函数/向量空间，**相关接收 = 投影到信号方向**（第 4 章），而"投影系数一次算出"要求基**正交**（本章 8.3 的结论）；**基的选择**决定接收机的复杂度：正交基 ⇒ 逐维判决，非正交基 ⇒ 要解线性方程组（联合检测）。
- [[vault-notes/math/linear-algebra/10-applications]] —— 本章的"函数空间的基"直接通向应用章的 10.5 傅里叶级数（用线性代数研究函数）；图形学（10.6）里的平移/旋转/缩放/投影全是线性变换的合成；图和网络（10.1）里的拉普拉斯算子本质上就是一个线性变换（$\ker$ 的维数 = 连通分量数）✓
- [[vault-notes/communication/12-orthogonal-codes-pn-sequences]] —— 正交码族 = 函数空间的一组**正交基**（Walsh/Hadamard 是方波版的正交基，傅里叶基是正弦版）；"任意两个码字互不干扰"就是内积为零（本章的正交性）；扩频、多址、信道化都建立在这个"正交基 = 无干扰"的思想上。
- [[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]] —— 第 6 章说"$e^{st}$ 是 LTI 系统的特征函数"，本章给出了它的一般框架：**"用特征向量/特征函数当基"是选基的第一原则**（矩阵对角化、算子对角化都是同一件事）。
- [[vault-notes/math/linear-algebra/04-orthogonality]] —— 本章反复回到第 4 章的两件武器：**正交基让系数可一次算出**、**正交变换不放大误差（条件数 1）**——"为什么正交基是好基"的答案全在那里。

**相关**：[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]｜[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]]｜[[vault-notes/math/linear-algebra/04-orthogonality]]
