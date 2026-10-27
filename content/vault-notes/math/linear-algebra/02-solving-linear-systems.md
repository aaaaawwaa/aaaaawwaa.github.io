---
title: "线性方程组的求解"
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
> 第 1 章把 $A\mathbf{x}=\mathbf{b}$ 翻译成了一个问句："**b 是不是 A 各列的组合？**"但光翻译不做题。第 2 章换个更实在的目标：**给定 A 和 b，究竟怎么把 x 算出来？**
>
> 答案是一条贯穿全章的算法链——**消元（elimination）**：
> - **2.1** 先把方程画出来：行图像看"约束"，列图像看"拼合"，两种视角随时切换
> - **2.2** 消元登场：选主元、消下方、再回代——把方程一步步变"简单"
> - **2.3** 用矩阵记录消元：每一步消元都是"左乘一个 E"
> - **2.4** 为了读懂 E 的作用，必须彻底搞清矩阵乘法的四种理解方式
> - **2.5** 消元顺带产出逆矩阵：$[A\mid I]\to[I\mid A^{-1}]$
> - **2.6** 消元的"全程录像"就是分解式 $A=LU$：U 存结果，L 存过程
> - **2.7** 转置与置换：换行（P）、对称（$LDL^T$），补全 $PA=LU$
>
> 一句话主线：**消元是把 A"做简单"（做成三角形）的算法，而 $A=LU$ 是把这个过程记成账本。**

> [!note] 记号约定
> - 消元中第一个"当家的"非零系数叫**主元（pivot）**；被消去元素与主元的比值叫**乘数（multiplier）**，记 $l_{ij}$（Strang 用字母 $l$）
> - $E$：消元矩阵（elementary/elimination matrix）；$U$：上三角（Upper triangular）；$L$：单位下三角（Lower，对角线全 1）；$P$：置换矩阵（Permutation）；$A=LU$ 即 **LU 分解**（LU factorization）
> - **增广矩阵**（augmented matrix）写作 $[\,A\ \ \mathbf{b}\,]$；对角线上第 $i$ 行第 $i$ 列记 $a_{ii}$

# 2.1 向量与线性方程组

## 两个未知数的两个方程：行与列

最小的问题也值得两种画法。看一组最简单但"不平凡"的方程：

$$
\begin{cases}
2x-y=0\\
-x+2y=3
\end{cases}
\quad\Longleftrightarrow\quad
\begin{bmatrix}2&-1\\-1&2\end{bmatrix}\begin{bmatrix}x\\y\end{bmatrix}=\begin{bmatrix}0\\3\end{bmatrix}
$$

> [!tip] 行图像
> **行图像**（row picture）：每个方程是一条**直线**，解是两条直线的**交点**。
>
> 直线一 $2x-y=0$ 过原点；直线二 $-x+2y=3$ 过 $(0,\tfrac32)$。两者恰好交于 $(1,2)$——这就是解。

> [!tip] 列图像
> **列图像**（column picture）：把同一件事改写成"**两列拼出 b**"：
> $$x\begin{bmatrix}2\\-1\end{bmatrix}+y\begin{bmatrix}-1\\2\end{bmatrix}=\begin{bmatrix}0\\3\end{bmatrix}$$
> 所谓"解方程"，就是找**组合系数** $x=1$、$y=2$：
> $$1\begin{bmatrix}2\\-1\end{bmatrix}+2\begin{bmatrix}-1\\2\end{bmatrix}=\begin{bmatrix}2\\-1\end{bmatrix}+\begin{bmatrix}-2\\4\end{bmatrix}=\begin{bmatrix}0\\3\end{bmatrix}\ \checkmark$$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 300" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la2-ax" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
    <marker id="la2-b" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la2-p" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
    <marker id="la2-g" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#059669"/>
    </marker>
  </defs>

  <!-- ================= 左：行图像 ================= -->
  <text x="165" y="26" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">行图像：两条直线的交点</text>
  <rect x="30" y="40" width="270" height="212" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
  <line x1="48" y1="200" x2="292" y2="200" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la2-ax)"/>
  <line x1="165" y1="250" x2="165" y2="56" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la2-ax)"/>
  <line x1="140" y1="250" x2="220" y2="90" stroke="#4f46e5" stroke-width="1.8"/>
  <line x1="65" y1="212.5" x2="265" y2="112.5" stroke="#db2777" stroke-width="1.8"/>
  <circle cx="190" cy="150" r="3.5" fill="var(--text-normal,#1f2328)"/>
  <text x="228" y="86" font-size="12.5" font-weight="600" fill="#4f46e5">2x−y=0</text>
  <text x="238" y="122" font-size="12.5" font-weight="600" fill="#db2777">−x+2y=3</text>
  <text x="200" y="145" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">(1,2)</text>

  <!-- ================= 右：列图像 ================= -->
  <text x="570" y="26" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">列图像：两列的拼合 x·v₁ + y·v₂ = b</text>
  <rect x="330" y="40" width="480" height="212" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
  <line x1="350" y1="200" x2="792" y2="200" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la2-ax)"/>
  <line x1="480" y1="250" x2="480" y2="56" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la2-ax)"/>
  <!-- 虚线平行四边形 -->
  <line x1="480" y1="200" x2="424" y2="88" stroke="var(--text-faint,#8b949e)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <line x1="424" y1="88" x2="480" y2="116" stroke="var(--text-faint,#8b949e)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <line x1="536" y1="228" x2="480" y2="116" stroke="#db2777" stroke-width="1.6" stroke-dasharray="4 3" marker-end="url(#la2-p)"/>
  <!-- 实箭头 -->
  <line x1="480" y1="200" x2="531" y2="225" stroke="#4f46e5" stroke-width="2" marker-end="url(#la2-b)"/>
  <line x1="480" y1="200" x2="457" y2="149" stroke="#db2777" stroke-width="2" marker-end="url(#la2-p)"/>
  <circle cx="480" cy="116" r="3.8" fill="#059669"/>
  <text x="544" y="236" font-size="12.5" font-weight="600" fill="#4f46e5">v₁=(2,−1)</text>
  <text x="428" y="146" font-size="12.5" font-weight="600" fill="#db2777">v₂=(−1,2)</text>
  <text x="412" y="84" font-size="12" fill="#db2777">2v₂</text>
  <text x="496" y="108" font-size="12.5" font-weight="600" fill="#059669">b=(0,3)</text>
  <text x="570" y="246" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">1·v₁ + 2·v₂ = b —— 解 (x, y) = (1, 2)</text>
</svg>

> [!warning] 两种图像的分工（3b1b 也反复强调）
> 1. **行图像**回答"每个方程各自约束了什么"——适合手算、适合理解"约束"。
> 2. **列图像**回答"哪些组合能拼出 b"——适合判断**有没有解**、后续的列空间/秩全从这里长出来。
> 3. 高维时行图像会失效（4 个未知数画不出 4 维"超平面"），而**列图像的思维永远不会失效**——这是 Strang 全书的核心方法论。

## 含三个未知数的三个方程

同一个思想升到三维。看 Strang 的经典例子（本章会反复用它）：

$$
\begin{cases}
2u+v+w=5\\
4u-6v=-2\\
-2u+7v+2w=9
\end{cases}
\quad\Longleftrightarrow\quad
\underbrace{\begin{bmatrix}2&1&1\\4&-6&0\\-2&7&2\end{bmatrix}}_{\mathbf{A}}
\underbrace{\begin{bmatrix}u\\v\\w\end{bmatrix}}_{\mathbf{x}}
=
\underbrace{\begin{bmatrix}5\\-2\\9\end{bmatrix}}_{\mathbf{b}}
$$

**验证解 $(u,v,w)=(1,1,2)$**：

$$
2(1)+1+2=5,\qquad 4(1)-6(1)=-2,\qquad -2(1)+7(1)+2(2)=9\ \checkmark
$$

**列图像**：三支列向量在空间里拼合——

$$
1\begin{bmatrix}2\\4\\-2\end{bmatrix}
+1\begin{bmatrix}1\\-6\\7\end{bmatrix}
+2\begin{bmatrix}1\\0\\2\end{bmatrix}
=\begin{bmatrix}5\\-2\\9\end{bmatrix}
$$

**行图像**：每个方程是一个平面；两个平面交出一条直线，第三个平面把它"切成"一个点。三维图难画，但道理与二维完全一样。

> [!tip] 越往上走，越要盯着"组合"
> "三个平面交于一点"等价于"能拼出 b 的组合 **(1,1,2)** 唯一存在"。
> $A\mathbf{x}=\mathbf{b}$ 有解 $\iff$ **b 落在 A 各列的所有组合之中**。这句话将在第 3 章被命名为"列空间"。

## 线性方程组的矩阵形式

一般地，$m$ 个方程、$n$ 个未知数总可以写成

$$
A\mathbf{x}=\mathbf{b},\qquad A\in\mathbb{R}^{m\times n},\ \mathbf{x}\in\mathbb{R}^{n},\ \mathbf{b}\in\mathbb{R}^{m}
$$

形状先对上：**A 的列数 = x 的长度**，**A 的行数 = b 的长度**。这是检查一切公式的第一道关口。

| 情形 | 名称 | 直觉 |
| --- | --- | --- |
| $m=n$（方阵） | 正方形方程组 | 应能唯一求解（若 A 可逆） |
| $m>n$（方程多） | 超定（overdetermined） | 一般无解，只能求"最接近的"（第 4 章最小二乘） |
| $m<n$（未知数多） | 欠定（underdetermined） | 一般有无穷多解，需挑出"最优的" |

## 矩阵的表示符号

| 符号 | 含义 | 例子 |
| --- | --- | --- |
| $A$ | $m\times n$ 系数矩阵 | $\begin{bmatrix}2&1&1\\4&-6&0\\-2&7&2\end{bmatrix}$ |
| $a_{ij}$ | 第 $i$ 行第 $j$ 列的元素 | $a_{21}=4$ |
| $a_{ii}$ | 主对角线元素 | $a_{11}=2,\ a_{33}=2$ |
| $\mathbf{x}$ | 未知数向量（$n$ 维） | $(u,v,w)$ |
| $\mathbf{b}$ | 右端项向量（$m$ 维） | $(5,-2,9)$ |
| $[\,A\ \mathbf{b}\,]$ | 增广矩阵 | $\begin{bmatrix}2&1&1&\mid&5\\4&-6&0&\mid&-2\\-2&7&2&\mid&9\end{bmatrix}$ |

> [!note] 行指标在前、列指标在后
> $a_{ij}$ 是"第 $i$ 行、第 $j$ 列"。以后说"第 3 行"就是 $a_{3*}$（一整行），"第 2 列"就是 $a_{*2}$。

## MATLAB

Strang 的课用 MATLAB，把关键命令先认全（Python/NumPy 对照列在最后一列）：

| 命令 | 作用 | Python 对照 | 备注 |
| --- | --- | --- | --- |
| `A\b` | **解 Ax=b** | `np.linalg.solve(A, b)` | 内部就是消元（LU），首选方式 |
| `inv(A)*b` | 先求逆再乘 | `np.linalg.inv(A) @ b` | 又慢又有误差，**不推荐** |
| `rref([A b])` | 行最简形（RREF） | 无直接对应（SymPy `rref`） | 高斯-若尔当，理论演示用 |
| `lu(A)` | LU 分解 | `scipy.linalg.lu(A)` | 2.6 主题 |
| `A'` | 转置 | `A.T` | 2.7 主题 |
| `rank(A)`、`det(A)` | 秩、行列式 | `np.linalg.matrix_rank`、`det` | 判断可逆 |

> [!tip] 反斜杠 vs 乘逆矩阵
> MATLAB 的 `\` 和 NumPy 的 `solve` 都走"消元分解"路线，速度约是"先求逆再乘"的 3 倍，数值误差也小一个量级。**工程代码里永远不要明文求逆**——这句话本章会两次讲到。

# 2.2 高斯消元法

## 消元在做的事：把三角形造出来

**高斯消元法**（Gaussian elimination，平时简称消元）的思想一句话：**用上面的方程去"清洗"下面的方程**，让系数矩阵逐步变成上三角——上三角意味着"从最后一行开始，未知数一个一个自己跳出来"。

还是用最小例子走一遍（2.1 的 2×2 组）：

$$
\begin{bmatrix}2&-1&\mid&0\\-1&2&\mid&3\end{bmatrix}
$$

- **第 1 步（选主元）**：左上角 $2$ 是第一个**主元**。
- **第 2 步（消下方）**：目标是消掉 $(2,1)$ 处的 $-1$。做法是 **行₂ − 乘数 × 行₁**：

$$
\text{乘数 } l_{21}=\frac{a_{21}}{\text{主元}}=\frac{-1}{2}=-\frac12
$$

$$
\text{行}_2-\left(-\frac12\right)\text{行}_1:\quad
\begin{bmatrix}2&-1&\mid&0\\[2pt]0&\ \ \frac32&\mid&3\end{bmatrix}
$$

- **第 3 步（回代 back substitution）**：最后一行只含一个未知数

$$
\frac32 y=3\ \Rightarrow\ y=2,\qquad 2x-2=0\ \Rightarrow\ x=1
$$

> [!info] Def 1 主元与乘数
> 消元进行到第 $k$ 列时，用来"清洗"下面各行的对角线元素称为**主元**（pivot），必须非零；
> 第 $i$ 行要消去第 $k$ 个未知数时，执行的运算是
> $$\text{行}_i\ \longleftarrow\ \text{行}_i-l_{ik}\,\text{行}_k,\qquad l_{ik}=\frac{a_{ik}^{(k)}}{\text{主元}_k}$$
> 比值 $l_{ik}$ 称为**乘数**（multiplier）。

## 含三个未知数的三个方程

把完整过程在 Strang 例子上走一遍。增广矩阵：

$$
[A\ \mathbf{b}]=\begin{bmatrix}
2&1&1&\mid&5\\
4&-6&0&\mid&-2\\
-2&7&2&\mid&9
\end{bmatrix}
$$

**第一列：用行₁ 消掉行₂、行₃ 的 u**

乘数 $l_{21}=\dfrac{4}{2}=2$，行₂ − 2·行₁；乘数 $l_{31}=\dfrac{-2}{2}=-1$，行₃ + 行₁：

$$
\begin{bmatrix}
2&1&1&\mid&5\\
0&-8&-2&\mid&-12\\
0&8&3&\mid&14
\end{bmatrix}
$$

**第二列：用行₂ 消掉行₃ 的 v**

乘数 $l_{32}=\dfrac{8}{-8}=-1$，行₃ + 行₂：

$$
\begin{bmatrix}
2&1&1&\mid&5\\
0&-8&-2&\mid&-12\\
0&0&1&\mid&2
\end{bmatrix}
$$

**回代**：$w=2$；$-8v-2(2)=-12\Rightarrow v=1$；$2u+1+2=5\Rightarrow u=1$。

> [!tip] 消元是"从全局到局部"
> 行₁ 动所有未知数，行₂ 只动 $v,w$，行₃ 只动 $w$——上三角把"全体耦合"逐步变成"逐个解锁"。回代时顺序刚好相反：**最后一行先解放，倒着重放回去。**

## 消元法的中止

> [!info] Def 2 零主元
> 某一步对角线上出现 0（或非常接近 0 的小数），无法做除数——称**零主元**（zero pivot）情形。消元面临两种命运：

**情形一：临时失效（可以换行救）**

看这个矩阵：

$$
A=\begin{bmatrix}0&2\\3&4\end{bmatrix}
$$

左上角第一个元素是 0，消元无法启动（主元不能为 0）。但**交换前两行**即可：

$$
\begin{bmatrix}3&4\\0&2\end{bmatrix}
$$

交换行只是"把方程换个书写顺序"，**解集完全不变**。所以零主元可以靠**换行**（row exchange）解决（2.7 的置换矩阵就是记录这件事）。

**情形二：永久失效**

如果某列在"对角线及其下方"全部为 0，换行也无济于事，行上必然出现 $0=\text{非零}$ 或 $0=0$：

- **无解**：

$$
\begin{cases}
x-y=1\\
x-y=3
\end{cases}
\xrightarrow{\ \text{行}_2-\text{行}_1\ }0=2\quad\text{矛盾}
$$

  行图像是一对平行直线；列图像中两列 $(1,1)$、$(-1,-1)$ 只能拼出"对角线"上的点，而 $\mathbf{b}=(1,3)$ 不在其上。

- **无穷多解**：

$$
\begin{cases}
x-y=1\\
2x-2y=2
\end{cases}
\xrightarrow{\ \text{行}_2-2\text{行}_1\ }0=0\quad\text{恒真}
$$

  第二行是第一行的重复（同一张约束说两遍）。消元后只剩一个主元，$y$ 可以任取；解集是一条直线 $(x,y)=(1+t,\ t)$。

> [!warning] 三个高频误区
> 1. **"主元是 0"不等于"无解"**——先试换行！只有"整列（对角线以下）全 0"才真的走投无路。
> 2. **消元不会改变解集**：行减行、行交换都是"对方程组做等价变形"——这是消元合法性的全部依据。
> 3. **乘数可正可负可分数**：$l_{31}=-1$ 时"行₃ + 行₁"，符号很容易抄错，公式 $l=a_{ik}/\text{主元}$ 永远对。

> [!tip] 三种结局总表
> | 消元后的样子 | 结局 | 解集几何 |
> | --- | --- | --- |
> | $n$ 个非零主元 | 唯一解 | 直线相交于一点 / 平面交于一点 |
> | 出现 $0=$ 非零 | 无解 | 平行、无公共点 |
> | 出现 $0=0$（主元不足 $n$） | 无穷多解 | 交于直线/平面（自由变量登场） |

# 2.3 利用矩阵进行消元

## 一次消元步骤的矩阵形式

2.2 做的"行₂ − 2·行₁"可以写成一次**矩阵乘法**——左乘一个**消元矩阵** $E_{21}$：

$$
E_{21}=\begin{bmatrix}1&0&0\\-2&1&0\\0&0&1\end{bmatrix}
$$

> [!info] 构造法：单位矩阵改一个位置
> 想让"行₂ − l·行₁"发生，就把**单位矩阵**（identity matrix）$I$ 的第 $(2,1)$ 元素由 $0$ 改成 $-l$。
> 记忆要点：**E 里的符号与乘数相反**——乘数 $l_{21}=2$，E 里写 $-2$。

验证 $E_{21}A$（用"行组合"视角看）：$E_{21}$ 的第 2 行是 $(-2,1,0)$，它拉出来的是"$-2$ 倍 A 的行₁ $+$ $1$ 倍 A 的行₂"：

$$
E_{21}A=\begin{bmatrix}2&1&1\\-2(2,1,1)+1(4,-6,0)\\ \text{行}_3\end{bmatrix}
=\begin{bmatrix}2&1&1\\0&-8&-2\\-2&7&2\end{bmatrix}\ \checkmark
$$

继续造另外两个：

$$
E_{31}=\begin{bmatrix}1&0&0\\0&1&0\\\ \ 1&0&1\end{bmatrix}\ (\text{行}_3+\text{行}_1),\qquad
E_{32}=\begin{bmatrix}1&0&0\\0&1&0\\0&\ \ 1&1\end{bmatrix}\ (\text{行}_3+\text{行}_2)
$$

三步连做，消元就是"一串 E 左乘"：

$$
\boxed{\,E_{32}E_{31}E_{21}\,A=U\,},\qquad
U=\begin{bmatrix}2&1&1\\0&-8&-2\\0&0&1\end{bmatrix}
$$

> [!tip] 为什么从右往左读
> $E_{32}E_{31}E_{21}A$ 中**最靠近 A 的 $E_{21}$ 最先作用**——矩阵乘法的顺序观：先做右边的动作。这和"穿脱鞋序"是同一条法则（2.5 会看到它的逆序版本）。

## 矩阵乘法

上面用到的一般规则现在明确写出来。$m\times p$ 的 $E$ 乘 $p\times n$ 的 $A$，得到 $m\times n$ 的 $EA$：

$$
(EA)_{ij}=\sum_{k=1}^{p}E_{ik}A_{kj}
$$

**"左乘 = 行组合"**：$EA$ 的第 $i$ 行，等于用 $E$ 的第 $i$ 行作系数，去组合 $A$ 的所有行：

$$
(EA)_{\text{行 }i}=\sum_{k}E_{ik}\cdot(A\text{ 的行 }k)
$$

这正是消元矩阵"搬运行"的原理：$E_{21}$ 的第 2 行 $(-2,1,0)$ 说"拉 $-2$ 倍行₁ 加 1 倍行₂"。

> [!warning] 别把顺序弄反
> $EA$ 是"**E 行组合 A 的行**"；而 $AE$ 是"**A 的列组合 E 的列**"（右乘 = 列组合，2.4 详述）。
> 消元用**左乘**，因为消元动的是行。

## 增广矩阵

把 $\mathbf{b}$ 拼在 $A$ 右边，消元时"一路带着走"：

$$
[A\ \mathbf{b}]\ \xrightarrow{\ E_{21}\ }\ \begin{bmatrix}2&1&1&\mid&5\\0&-8&-2&\mid&-12\\-2&7&2&\mid&9\end{bmatrix}
\ \xrightarrow{\ E_{31}\ }\ \cdots\ \xrightarrow{\ E_{32}\ }\
\begin{bmatrix}2&1&1&\mid&5\\0&-8&-2&\mid&-12\\0&0&1&\mid&2\end{bmatrix}
$$

为什么 $\mathbf{b}$ 必须跟着变？因为**方程两边同时做同样的事**，等式才保持成立。行变换对增广矩阵是"整体操作"——这也预告了 2.5：如果把 $I$ 拼在 $A$ 右边一起消元，得到的就是 $A^{-1}$。

# 2.4 矩阵运算的规则

消元逼着我们回答：$EA$ 到底怎么算？Strang 给出矩阵乘法的**四种理解**——它们算出的结果完全相同，但"思维方式"适用于不同场合，是全书最重要的工具之一。

先备一个例子，四种方法各走一遍：

$$
A=\begin{bmatrix}1&2\\3&4\end{bmatrix},\qquad
B=\begin{bmatrix}1&2\\4&5\end{bmatrix}\qquad\Rightarrow\qquad
AB=\begin{bmatrix}9&12\\19&26\end{bmatrix}
$$

## 第一种方法：逐项计算（行点乘列）

$$
(AB)_{ij}=(\text{A 的第 }i\text{ 行})\cdot(\text{B 的第 }j\text{ 列})=\sum_k a_{ik}b_{kj}
$$

例如 $(AB)_{11}=[1\ \ 2]\begin{bmatrix}1\\4\end{bmatrix}=1\cdot1+2\cdot4=9$。

- 适合：**编程实现**、手工验算单个元素
- 记忆："**行骑列**"（row meets column）

## 第二种与第三种方法：左乘各列和各行左乘

**第二种（列视角）**：把 $B$ 拆成两列，$AB$ 的结果就是两列：

$$
AB=A\begin{bmatrix}\big|&\big|\\ \mathbf{b}_1&\mathbf{b}_2\\ \big|&\big|\end{bmatrix}
=\begin{bmatrix}\big|&\big|\\ A\mathbf{b}_1&A\mathbf{b}_2\\ \big|&\big|\end{bmatrix}
$$

$AB$ 的第 $j$ 列 $=$ **A 各列以 B 第 $j$ 列为系数的组合**。验证第 1 列：

$$
A\begin{bmatrix}1\\4\end{bmatrix}=1\begin{bmatrix}1\\3\end{bmatrix}+4\begin{bmatrix}2\\4\end{bmatrix}=\begin{bmatrix}9\\19\end{bmatrix}\ \checkmark
$$

**第三种（行视角）**：$AB$ 的第 $i$ 行 $=$ **B 各行以 A 第 $i$ 行为系数的组合**。验证第 1 行：

$$
[1\ \ 2]\begin{bmatrix}1&2\\4&5\end{bmatrix}=1[1\ \ 2]+2[4\ \ 5]=[9\ \ 12]\ \checkmark
$$

> [!tip] 四种方法就是四种"读法"，用的时候挑最顺手的
> - 想理解 $A\mathbf{x}$：用**列视角**（x 是列组合的系数）
> - 想理解 $EA$（消元）：用**行视角**（E 的行组合 A 的行）
> - 想理解 $B^{-1}A^{-1}$、矩阵分解：用**列 × 行**（第四种）

## 第四种方法：列左乘行

$$
AB=\sum_{k=1}^{n}(\text{A 的第 }k\text{ 列})\,(\text{B 的第 }k\text{ 行})
$$

每一步"列 × 行"得到一个**所有行都成比例的矩阵**（秩 1 矩阵）。对例子：

$$
AB=\underbrace{\begin{bmatrix}1\\3\end{bmatrix}[1\ \ 2]}_{k=1}
+\underbrace{\begin{bmatrix}2\\4\end{bmatrix}[4\ \ 5]}_{k=2}
=\begin{bmatrix}1&2\\3&6\end{bmatrix}+\begin{bmatrix}8&10\\16&20\end{bmatrix}
=\begin{bmatrix}9&12\\19&26\end{bmatrix}\ \checkmark
$$

> [!tip] 第四种方法的地位
> 它是"矩阵 = 秩 1 块之和"的源头，后面第 3 章（秩）、第 7 章（SVD）全靠它。看见 $A\mathbf{x}=\sum x_k\mathbf{a}_k$ 与它的区别：那个是**列的组合**（系数是数），这个是**列乘行的拼块**（拼块是矩阵）。

**乘法规则小结**：

| 法则 | 状态 | 说明 |
| --- | --- | --- |
| 结合律 $(AB)C=A(BC)$ | ✅ 成立 | 消元的"三步连做"就依赖它 |
| 分配律 $A(B+C)=AB+AC$ | ✅ 成立 | |
| 交换律 $AB=BA$ | ❌ **一般不成立** | 例子：$BA=\begin{bmatrix}7&10\\19&28\end{bmatrix}\neq AB$ |
| $A^2$ 的意义 | 只有方阵 | $AA$ 表示"变换做两次" |

## 分块矩阵及其乘法运算

把矩阵切成**块**（block），也就是**分块矩阵**（block matrix）——它的乘法规则与"数的乘法"完全一样，只要**形状匹配、顺序不换**：

$$
\begin{bmatrix}A_{11}&A_{12}\\A_{21}&A_{22}\end{bmatrix}
\begin{bmatrix}B_{11}&B_{12}\\B_{21}&B_{22}\end{bmatrix}
=
\begin{bmatrix}
A_{11}B_{11}+A_{12}B_{21} & A_{11}B_{12}+A_{12}B_{22}\\
A_{21}B_{11}+A_{22}B_{21} & A_{21}B_{12}+A_{22}B_{22}
\end{bmatrix}
$$

> [!info] 分块乘法的用处
> 1. **组装消元矩阵**：$E_{21}=\begin{bmatrix}1&0\\-l&1\end{bmatrix}$ 天生就是 $2\times2$ 分块，$E$ 矩阵"只在行块里动刀"。
> 2. **LU 的分块算法**：大矩阵切成小块并行计算（第 1 章循环差分那种"绕环"结构也常按块处理）。
> 3. **理论推导**：把大问题折成小问题——后面 Schur 补、块对角化都从这里出发。

# 2.5 逆矩阵

## 逆矩阵的定义与直觉

> [!info] Def 3 逆矩阵
> 对方阵 $A$，若存在方阵 $A^{-1}$ 使
> $$A^{-1}A=I\quad\text{且}\quad AA^{-1}=I$$
> 则称 $A$ **可逆（非奇异）**，$A^{-1}$ 为**逆矩阵**（inverse matrix）。

**直觉**：$A^{-1}$ 是"撤销 $A$ 的操作"。消元矩阵是最好的例子：

$$
E_{21}=\begin{bmatrix}1&0&0\\-2&1&0\\0&0&1\end{bmatrix}
\quad\Longrightarrow\quad
E_{21}^{-1}=\begin{bmatrix}1&0&0\\2&1&0\\0&0&1\end{bmatrix}
$$

"行₂ − 2·行₁"的逆操作就是"行₂ + 2·行₁"——**逆矩阵把乘数原样留着，只把符号翻回来**。这个小观察在 2.6 的 $A=LU$ 里立大功。

## 通过高斯-约尔当消元法计算 $A^{-1}$

求 $A^{-1}$ 的意义：$AA^{-1}=I$ 意味着 **$A^{-1}$ 的每一列都是一个方程组的解**——"$A\times(\text{第}j\text{列})=e_j$"。$n$ 个方程组共享同一个 $A$，干脆把 $I$ 拼到右边，**消元一步到位**：

$$
[\,A\mid I\,]\ \xrightarrow{\text{整体消元}}\ [\,I\mid A^{-1}\,]
$$

看例子 $A=\begin{bmatrix}2&1\\8&7\end{bmatrix}$（它后面在 2.6 也是主角）：

$$
\begin{bmatrix}2&1&\mid&1&0\\[2pt]8&7&\mid&0&1\end{bmatrix}
\xrightarrow{\text{行}_2-4\text{行}_1}
\begin{bmatrix}2&1&\mid&1&0\\[2pt]0&3&\mid&-4&1\end{bmatrix}
$$

继续向上消（高斯-约尔当比普通消元多做"向上消"这一步）。行₁ − (1/3)·行₂：

$$
\begin{bmatrix}2&0&\mid&\ \ 7/3&-1/3\\[2pt]0&3&\mid&-4&\ \ 1\end{bmatrix}
\xrightarrow{\ \text{各行}\div\text{主元}\ }
\begin{bmatrix}1&0&\mid&\ \ 7/6&-1/6\\[2pt]0&1&\mid&-4/3&\ \ 1/3\end{bmatrix}
$$

读出答案：

$$
A^{-1}=\frac16\begin{bmatrix}7&-1\\-8&2\end{bmatrix}
$$

> [!tip] 为什么 [A|I] 能一次算出全部列
> 行变换 = 左乘 E。对 $[A\mid I]$ 做一串行变换，等价于整体左乘同一个 $E$：
> $$E\,[\,A\mid I\,]=[\,EA\mid EI\,]=[\,EA\mid E\,]$$
> 当 $EA=I$ 时，右边恰好是 $E=A^{-1}$——不是巧合，是**必然**。

**顺带记住特殊形状**：

- 对角阵：逆 = 逐个元素取倒数（前提是对角线无 0）
- 三角阵：逆仍是同向三角阵（用回代一列一列求）

## 乘积 AB 的逆矩阵

> [!info] Def 4 穿脱鞋序
> $$(AB)^{-1}=B^{-1}A^{-1}$$
> 记忆：先穿鞋、后穿袜 → 脱的时候**先脱袜、后脱鞋**（顺序颠倒）。

数字验证。取 $A=\begin{bmatrix}2&1\\1&1\end{bmatrix}$、$B=\begin{bmatrix}1&0\\3&2\end{bmatrix}$：

$$
AB=\begin{bmatrix}5&2\\4&2\end{bmatrix},\qquad
(AB)^{-1}=\frac{1}{10-8}\begin{bmatrix}2&-2\\-4&5\end{bmatrix}=\begin{bmatrix}1&-1\\-2&5/2\end{bmatrix}
$$

而 $B^{-1}A^{-1}$（$A^{-1}=\begin{bmatrix}1&-1\\-1&2\end{bmatrix}$，$B^{-1}=\begin{bmatrix}1&0\\-3/2&1/2\end{bmatrix}$）：

$$
B^{-1}A^{-1}=\begin{bmatrix}1&0\\-3/2&1/2\end{bmatrix}\begin{bmatrix}1&-1\\-1&2\end{bmatrix}
=\begin{bmatrix}1&-1\\-2&5/2\end{bmatrix}\ \checkmark
$$

## 奇异矩阵与可逆矩阵

看一个"坏"（**奇异**，singular）矩阵：

$$
S=\begin{bmatrix}1&2\\3&6\end{bmatrix}
$$

- **列的角度**：列₂ $=(2,6)=2\times$ 列₁——两列共线，"组合"只能造出一条直线，整个平面拼不出来。
- **消元的判决**：行₂ − 3·行₁ $\Rightarrow$ 第二行变成全 0——只出现 **1 个主元**（不足 2 个）。
- **几何**：$S$ 把平面压扁成一条直线，**信息丢了**——所以"回不去"，逆不存在。

> [!warning] 奇异 = "压扁" = "丢信息"
> 行列式 $\det S=1\cdot6-2\cdot3=0$ 与"消元出现零行"、"两列成比例"、"$S\mathbf{x}=\mathbf{0}$ 有非零解"（取 $\mathbf{x}=(2,-1)$）说的是**同一件事**。第 1 章的柱状图记忆（平行四边形面积 = 0）在这里再次成立。

## 辨别可逆矩阵

八种判据，考试和工程里随时互换使用：

| 判据 | 可逆（非奇异） | 奇异 |
| --- | --- | --- |
| 行列式 | $\det A\neq0$ | $\det A=0$ |
| **主元** | 恰好 $n$ 个（消元顺利完成） | 少于 $n$ 个（出现零行） |
| 列向量 | 线性无关 | 线性相关（成比例/共面） |
| 零空间 | 只有 $\mathbf{x}=\mathbf{0}$ | $A\mathbf{x}=\mathbf{0}$ 有非零解 |
| $A\mathbf{x}=\mathbf{b}$ | 任意 $\mathbf{b}$ 唯一解 | 无解或无穷多解 |
| 秩 | $r=n$ | $r<n$ |
| 几何 | 不压缩维数 | 把空间压到更低维 |
| 逆的检验 | $A^{-1}A=AA^{-1}=I$ | 逆不存在，"伪逆"都救不了（第 7 章） |

# 2.6 消元 = 分解：A=LU

## 说明与例子

2.3 的最后一行式子 $E_{32}E_{31}E_{21}A=U$ 收拾一下：两边左乘三个逆矩阵，

$$
A=\underbrace{E_{21}^{-1}E_{31}^{-1}E_{32}^{-1}}_{\mathbf{L}}\ U
$$

每个 $E^{-1}$ 都只是"符号翻回来的单位矩阵"，它们的乘积会是什么样？直接算 Strang 例子：

$$
E_{21}^{-1}=\begin{bmatrix}1&0&0\\2&1&0\\0&0&1\end{bmatrix},\quad
E_{31}^{-1}=\begin{bmatrix}1&0&0\\0&1&0\\-1&0&1\end{bmatrix},\quad
E_{32}^{-1}=\begin{bmatrix}1&0&0\\0&1&0\\0&-1&1\end{bmatrix}
$$

$$
L=E_{21}^{-1}E_{31}^{-1}E_{32}^{-1}=
\begin{bmatrix}1&0&0\\\ \ 2&1&0\\-1&-1&1\end{bmatrix}
$$

验证 $LU=A$：

$$
\begin{bmatrix}1&0&0\\2&1&0\\-1&-1&1\end{bmatrix}
\begin{bmatrix}2&1&1\\0&-8&-2\\0&0&1\end{bmatrix}
=
\begin{bmatrix}2&1&1\\4&-6&0\\-2&7&2\end{bmatrix}\ \checkmark
$$

> [!tip] L 的秘密：乘数直接"搬家"
> $l_{21}=2$、$l_{31}=-1$、$l_{32}=-1$ 原样躺在 $L$ 的对应位置——**求逆、相乘这两个麻烦全都不见了**。
> 原因：各步的 $E$ 只在一个位置非对角，且消元有固定顺序（先消列 1、再消列 2），互不干扰。
>
> 一句话姿势：**U 存"消元的结果"，L 存"消元的过程"。** 注意到 $A$ 的"下三角部分"（4, -2, 7）全被搬进了 L 与消元的规定动作里，而 U 完好保留了主元与"清洗后的"系数。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 250" width="100%" style="max-width:840px" font-family="inherit">
  <!-- A 矩阵 -->
  <text x="152" y="40" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
  <path d="M94 58 L86 58 L86 164 L94 164" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <path d="M208 58 L216 58 L216 164 L208 164" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <g font-size="14" text-anchor="middle" fill="var(--text-normal,#1f2328)">
    <text x="117" y="82">2</text><text x="151" y="82">1</text><text x="185" y="82">1</text>
    <text x="117" y="116">4</text><text x="151" y="116">−6</text><text x="185" y="116">0</text>
    <text x="117" y="150">−2</text><text x="151" y="150">7</text><text x="185" y="150">2</text>
  </g>
  <!-- = -->
  <text x="237" y="120" text-anchor="middle" font-size="20" fill="var(--text-normal,#1f2328)">=</text>
  <!-- L 矩阵 -->
  <text x="317" y="40" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">L</text>
  <path d="M259 58 L251 58 L251 164 L259 164" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <path d="M373 58 L381 58 L381 164 L373 164" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <g font-size="14" text-anchor="middle">
    <text x="282" y="82" fill="var(--text-muted,#57606a)">1</text><text x="316" y="82" fill="var(--text-faint,#8b949e)" opacity="0.45">0</text><text x="350" y="82" fill="var(--text-faint,#8b949e)" opacity="0.45">0</text>
    <text x="282" y="116" font-weight="700" fill="#d97706">2</text><text x="316" y="116" fill="var(--text-muted,#57606a)">1</text><text x="350" y="116" fill="var(--text-faint,#8b949e)" opacity="0.45">0</text>
    <text x="282" y="150" font-weight="700" fill="#d97706">−1</text><text x="316" y="150" font-weight="700" fill="#d97706">−1</text><text x="350" y="150" fill="var(--text-muted,#57606a)">1</text>
  </g>
  <!-- x -->
  <text x="402" y="120" text-anchor="middle" font-size="18" fill="var(--text-normal,#1f2328)">×</text>
  <!-- U 矩阵 -->
  <text x="482" y="40" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">U</text>
  <path d="M424 58 L416 58 L416 164 L424 164" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <path d="M538 58 L546 58 L546 164 L538 164" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <g font-size="14" text-anchor="middle">
    <text x="447" y="82" font-weight="700" fill="#2563eb">2</text><text x="481" y="82" fill="var(--text-normal,#1f2328)">1</text><text x="515" y="82" fill="var(--text-normal,#1f2328)">1</text>
    <text x="447" y="116" fill="var(--text-faint,#8b949e)" opacity="0.45">0</text><text x="481" y="116" font-weight="700" fill="#2563eb">−8</text><text x="515" y="116" fill="var(--text-normal,#1f2328)">−2</text>
    <text x="447" y="150" fill="var(--text-faint,#8b949e)" opacity="0.45">0</text><text x="481" y="150" fill="var(--text-faint,#8b949e)" opacity="0.45">0</text><text x="515" y="150" font-weight="700" fill="#2563eb">1</text>
  </g>
  <!-- 右侧注释 -->
  <text x="580" y="74" font-size="12.5" font-weight="600" fill="#d97706">L：对角线全为 1</text>
  <text x="580" y="94" font-size="12.5" fill="var(--text-muted,#57606a)">下三角的 2, −1, −1 就是</text>
  <text x="580" y="113" font-size="12.5" fill="var(--text-muted,#57606a)">乘数 l₂₁, l₃₁, l₃₂</text>
  <text x="580" y="145" font-size="12.5" font-weight="600" fill="#2563eb">U：对角线是主元</text>
  <text x="580" y="165" font-size="12.5" fill="var(--text-muted,#57606a)">2, −8, 1；左下全零</text>
  <text x="420" y="215" text-anchor="middle" font-size="12.5" fill="var(--text-muted,#57606a)">消元的每一步都记进 L，消完的结果就是 U：A = L·U</text>
</svg>

## 一个正方形方程组 = 两个三角形方程组

$A=LU$ 一旦到手，解 $A\mathbf{x}=\mathbf{b}$ 变成**两次"顺藤摸瓜"**：

$$
A\mathbf{x}=\mathbf{b}\ \Longleftrightarrow\ L\underbrace{(U\mathbf{x})}_{\mathbf{c}}=\mathbf{b}
\quad\text{先解}\quad L\mathbf{c}=\mathbf{b}\ \text{（前向代入）},\quad\text{再解}\quad U\mathbf{x}=\mathbf{c}\ \text{（回代）}
$$

用小例走完整流程。$A=\begin{bmatrix}2&1\\8&7\end{bmatrix}=LU$，其中 $L=\begin{bmatrix}1&0\\4&1\end{bmatrix}$、$U=\begin{bmatrix}2&1\\0&3\end{bmatrix}$，取 $\mathbf{b}=(1,3)$：

**前向（解得 c）**：$\ c_1=1$；$4c_1+c_2=3\Rightarrow c_2=-1$。

**回代（解得 x）**：$3x_2=-1\Rightarrow x_2=-\tfrac13$；$2x_1-\tfrac13=1\Rightarrow x_1=\tfrac23$。

验证：

$$
A\mathbf{x}=\begin{bmatrix}2&1\\8&7\end{bmatrix}\begin{bmatrix}2/3\\-1/3\end{bmatrix}=\begin{bmatrix}1\\3\end{bmatrix}\ \checkmark
$$

> [!tip] LU 的真正价值：一次分解，多次求解
> 解同一个 $A$、不同的 $\mathbf{b}$（例如 100 组数据）：分解只做一次（$O(n^3)$），此后每组 $\mathbf{b}$ 只要两个三角回代（各 $O(n^2)$）。
> 工程里 A 往往固定（滤波器结构、信道模型、网格），数据一帧一帧地来——**LU 是标准答案**。

## 消元法的计算复杂度

对 $n\times n$ 的稠密矩阵：

| 步骤 | 乘除次数（量级） | $n=100$ 的大致规模 |
| --- | --- | --- |
| 消元（求 LU） | $\approx n^3/3$ | 约 33 万次 |
| 前向代入 $L\mathbf{c}=\mathbf{b}$ | $\approx n^2/2$ | 约 5 千次 |
| 回代 $U\mathbf{x}=\mathbf{c}$ | $\approx n^2/2$ | 约 5 千次 |
| 先求逆再乘 | $\approx 2n^3/3$ | 约 66 万次（且更不稳） |

> [!warning] 工程铁律：求解 ≠ 求逆
> "解 $A\mathbf{x}=\mathbf{b}$"和"求 $A^{-1}$"是两件事。$A^{-1}$ 的用处是**理论符号**（推导公式），不是**计算手段**。
> MATLAB 的 `\`、NumPy 的 `solve`、5G 基带里的均衡器，全都走"分解 + 回代"路线。

# 2.7 转置与置换

## 转置及其法则

> [!info] Def 5 转置
> $(A^T)_{ij}=a_{ji}$：行列互换。上标 $T$ 只表示**转置**（transpose）——别和幂次 $A^2$ 或第 5 章的行列式记号混在一起。

法则（与逆矩阵对照记忆）：

| 法则 | 转置 | 逆（对照） |
| --- | --- | --- |
| 和 | $(A+B)^T=A^T+B^T$ | $(A+B)^{-1}$ 无简单公式 |
| 乘积 | $(AB)^T=B^TA^T$ | $(AB)^{-1}=B^{-1}A^{-1}$ |
| 两次 | $(A^T)^T=A$ | $(A^{-1})^{-1}=A$ |
| 对角元 | 不变 | — |

> [!tip] 乘积的转置和乘积的逆都"倒序"
> $(AB)^T=B^TA^T$ 与 $(AB)^{-1}=B^{-1}A^{-1}$ 是同一哲学：**乘法顺序是信息，倒序 = 拆解**。

## 内积的含义

第 1 章的**点积**现在有了矩阵写法——行向量乘列向量：

$$
\mathbf{v}\cdot\mathbf{w}=\mathbf{v}^T\mathbf{w}
=\begin{bmatrix}v_1&v_2\end{bmatrix}\begin{bmatrix}w_1\\w_2\end{bmatrix}=v_1w_1+v_2w_2
$$

于是"垂直"判据也升级为：

$$
\mathbf{v}\cdot\mathbf{w}=0\ \Longleftrightarrow\ \mathbf{v}^T\mathbf{w}=0
$$

> [!tip] 转置把列向量"掰弯"成行
> $\mathbf{v}^T\mathbf{w}$ 里，$\mathbf{v}^T$ 是行、$\mathbf{w}$ 是列，"行骑列"得到 $1\times1$ 矩阵（一个数）。满秩矩阵版的同类操作 $A^TA$ 将在 2.7 后半与第 4 章反复出现。

## 对称矩阵

> [!info] Def 6 对称矩阵
> **对称矩阵**（symmetric matrix）：$A^T=A$，即 $a_{ij}=a_{ji}$（关于主对角线镜像）。

例子（它是第 1 章差分矩阵的"堂兄弟"，在通信里叫一维拉普拉斯矩阵）：

$$
K=\begin{bmatrix}2&-1&0\\-1&2&-1\\0&-1&2\end{bmatrix}=K^T
$$

对称矩阵的**自由元素只有"上三角 + 对角线"**：

$$
n(n+1)/2\ \text{个}\quad\text{vs 一般矩阵的 } n^2\ \text{个}
$$

> [!tip] 对称性的两个来源
> "结构本身对称"（如距离、协方差、图邻接）→ 存一半省一半；
> "被造出来的对称"（$A^TA$，下一个标题）→ 计算过程自动获得对称性。

## 对称的乘积 $A^TA$、$AA^T$ 与 $LDL^T$

**任意矩阵乘自己转置 = 对称**：

$$
(A^TA)^T=A^T(A^T)^T=A^TA\ \checkmark
$$

这个"自动对称"的 $A^TA$ 是第 4 章最小二乘、通信里协方差矩阵的常客。

**对称矩阵的消元保持对称**——消完后 $U$ 与 $L$ 互为转置（相差一个对角阵 $D$）：

$$
A=L\,D\,L^T,\qquad D=\operatorname{diag}(\text{主元})
$$

验证一个 2×2：$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$，乘数 $l_{21}=\tfrac12$，主元为 $2,\ \tfrac32$：

$$
L=\begin{bmatrix}1&0\\ \tfrac12&1\end{bmatrix},\quad
D=\begin{bmatrix}2&0\\0&\tfrac32\end{bmatrix},\quad
L^T=\begin{bmatrix}1&\tfrac12\\0&1\end{bmatrix}
$$

$$
LDL^T=\begin{bmatrix}1&0\\ \tfrac12&1\end{bmatrix}
\begin{bmatrix}2&0\\0&\tfrac32\end{bmatrix}
\begin{bmatrix}1&\tfrac12\\0&1\end{bmatrix}
=\begin{bmatrix}2&1\\1&2\end{bmatrix}\ \checkmark
$$

> [!tip] $A^TA$ 与 $LDL^T$ 的意义
> 1. 对称消元比一般消元省一半工作（镜像对称，只算一半）。
> 2. 正定对称矩阵还可以让 $D$ 开根号：$A=(L\sqrt D)(L\sqrt D)^T$——这就是 **Cholesky 分解**，数值计算里求对称正定方程组的最快路线（第 6 章展开）。

## 置换矩阵

> [!info] Def 7 置换矩阵
> **置换矩阵**（permutation matrix）：每行、每列**恰好一个 1**、其余全 0 的方阵。

$$
P=\begin{bmatrix}0&1\\1&0\end{bmatrix}
$$

三个必背事实：

1. **左乘 P 交换 A 的行**；**右乘 P 交换 A 的列**（左行右列）。
2. $n\times n$ 的置换矩阵共 $n!$ 个（对换行的所有排法）。
3. **$P^{-1}=P^T$**：换行的逆操作就是换回来，而 $P$ 的转置恰好完成这件事：

$$
PP^T=\begin{bmatrix}0&1\\1&0\end{bmatrix}\begin{bmatrix}0&1\\1&0\end{bmatrix}=\begin{bmatrix}1&0\\0&1\end{bmatrix}=I\ \checkmark
$$

> [!tip] 置换矩阵是"正交矩阵"的先遣队
> $0/1$ 且 $P^TP=I$——第 4 章会把这里的 $P$ 推广到实数的"旋转/反射矩阵"（正交矩阵 $Q$）。

## 结合了换行的分解式 PA = LU

2.2 里"零主元就换行"现在可以记进分解式。看例子：

$$
A=\begin{bmatrix}0&2\\3&4\end{bmatrix}
$$

第一主元是 0，不能直接消。有请置换矩阵：

$$
P=\begin{bmatrix}0&1\\1&0\end{bmatrix},\qquad
PA=\begin{bmatrix}3&4\\0&2\end{bmatrix}=U
$$

（这个例子里 $L=I$——换行后已经上三角。）一般情形写出来就是本章的收官公式：

$$
\boxed{\,PA=LU\,}
$$

- $P$ 记录"换过哪些行"，$P^{-1}=P^T$ 随时把行还原；
- $L$ 仍是单位下三角（乘数不为分数"崩塌"的保证就靠 $P$ 先行）；
- $U$ 是换行后的消元终点。

> [!warning] 一旦换行，PLU 的顺序不能乱
> 正确形式是 $PA=LU$，而**不是** $A=PLU$ 或 $AP=LU$。原因：$P$ 的动作是"对 A 的行"动手（左乘），必须先于消元发生。
> 工程上 MATLAB 的 `[L,U,P]=lu(A)`、SciPy 的 `lu(A)` 返回的正是这个 $P$。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 230" width="100%" style="max-width:840px" font-family="inherit">
  <!-- P 矩阵 -->
  <text x="150" y="46" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">P</text>
  <path d="M100 60 L92 60 L92 156 L100 156" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <path d="M200 60 L208 60 L208 156 L200 156" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <g font-size="15" text-anchor="middle">
    <text x="120" y="92" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text>
    <text x="180" y="92" fill="var(--text-normal,#1f2328)" font-weight="700">1</text>
    <text x="120" y="126" fill="var(--text-normal,#1f2328)" font-weight="700">1</text>
    <text x="180" y="126" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text>
  </g>
  <!-- × -->
  <text x="232" y="116" text-anchor="middle" font-size="17" fill="var(--text-normal,#1f2328)">×</text>
  <!-- A 矩阵 -->
  <text x="300" y="46" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
  <path d="M250 60 L242 60 L242 156 L250 156" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <path d="M350 60 L358 60 L358 156 L350 156" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <g font-size="15" text-anchor="middle">
    <text x="270" y="92" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text>
    <text x="330" y="92" fill="#dc2626" font-weight="700">2</text>
    <text x="270" y="126" fill="#2563eb" font-weight="700">3</text>
    <text x="330" y="126" fill="#2563eb" font-weight="700">4</text>
  </g>
  <!-- = -->
  <text x="382" y="116" text-anchor="middle" font-size="18" fill="var(--text-normal,#1f2328)">=</text>
  <!-- PA 矩阵 -->
  <text x="450" y="46" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">PA</text>
  <path d="M400 60 L392 60 L392 156 L400 156" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <path d="M500 60 L508 60 L508 156 L500 156" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <g font-size="15" text-anchor="middle">
    <text x="420" y="92" fill="#2563eb" font-weight="700">3</text>
    <text x="480" y="92" fill="#2563eb" font-weight="700">4</text>
    <text x="420" y="126" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text>
    <text x="480" y="126" fill="#dc2626" font-weight="700">2</text>
  </g>
  <!-- 右侧文字 -->
  <text x="560" y="80" font-size="12.5" fill="var(--text-muted,#57606a)">A 的第一主元为 0，消元无法启动；</text>
  <text x="560" y="102" font-size="12.5" fill="var(--text-muted,#57606a)">先用 P 换行，主元变成 3 ——</text>
  <text x="560" y="124" font-size="12.5" fill="var(--text-muted,#57606a)">消元就能继续（本例 PA 已上三角）。</text>
  <text x="420" y="196" text-anchor="middle" font-size="12" fill="var(--text-faint,#8b949e)">蓝色：原第 2 行升到第 1 行　·　红色：原第 1 行降到第 2 行　·　P 的逆 = P 的转置</text>
</svg>

> [!tip] 本章的收官总结
> 消元把方程变简单——**先 P 换行、再 E 消下去、最后 L 与 U 记全程**。
> 一个矩阵的故事讲完了：$A\ \xrightarrow{\ \text{换行}\ }\ PA\ \xrightarrow{\ \text{消元}\ }\ LU$。
> 下一章的问题是：**什么样的 b 有解？解集的"大小"怎么量？**——那里会有列空间、零空间、秩，全部是"组合"思想的高维延续。

## 本章知识地图

```
A x = b
  ├─ 两种图像：行（约束/交点）／列（组合/拼 b）              （2.1）
  │
  ├─ 高斯消元：主元 pivot → 乘数 l → 消下方 → 回代            （2.2）
  │      ├── 零主元 → 换行可救（临时失效）
  │      └── 0 = 非零（无解）／0 = 0（无穷多解）              （永久失效）
  │
  ├─ 消元 = 左乘一串 E：E32E31E21 A = U                       （2.3）
  │      └── 增广矩阵 [A | b] 整体做行变换
  │
  ├─ 矩阵乘法四种视角                                          （2.4）
  │      ├── 1 行·列（编程/验算）
  │      ├── 2 列组合（Ax、列空间）
  │      ├── 3 行组合（EA、消元）
  │      └── 4 列×行外积（秩 1 之和，通向 SVD）
  │
  ├─ 逆矩阵：[A|I] → [I|A^-1]； (AB)^-1 = B^-1 A^-1           （2.5）
  │      └── 可逆判据：n 个主元 / det≠0 / 列无关 / 唯一解（互为等价）
  │
  ├─ A = LU：U 存结果、L 存乘数                                （2.6）
  │      ├── 解方程 = 前向（Lc=b）+ 回代（Ux=c）
  │      └── 复杂度：消元 n^3/3 > 回代 n^2 > 求逆（不推荐）
  │
  └─ 转置与置换                                                （2.7）
         ├── (AB)^T = B^T A^T ； x·y = x^T y
         ├── 对称 A = LDL^T（A^T A 自动对称，通向 Cholesky）
         └── 置换 P（P^-1 = P^T，n! 个）→  PA = LU
```

## 关联

- 上一章：[[vault-notes/math/linear-algebra/01-vector-introduction]]
- 下一章：[[vault-notes/math/linear-algebra/03-vector-spaces-subspaces]]

**通信方向应用**：

- [[vault-notes/communication/11-error-control-coding]] —— **线性分组码的编码与译码就是 GF(2) 上的线性方程组**：编码 $\mathbf{c}=\mathbf{m}G$ 是"行的组合"（2.4 第三种视角），译码用校验矩阵验 $\mathbf{H}\mathbf{c}^T=\mathbf{0}$，出错时解方程 $\mathbf{H}\mathbf{e}^T=\mathbf{s}$（解出错误图样）。模 2 世界里消元更省事——**没有分数**，乘法就是与门；把生成矩阵化成系统码形式（$[I\mid P]$）走的就是"高斯消元"（模 2 版）。
- [[vault-notes/communication/09-optimal-reception]] —— 相关接收本身只做"点积"，但一旦信道或信号参数未知，**"估计"立刻变成解方程组**：最小二乘估计 $\hat{\mathbf{h}}$ 由正规方程 $(S^TS)\hat{\mathbf{h}}=S^T\mathbf{r}$ 给出——本章的消元与 LU 就是解它的引擎（第 4 章详细展开"为什么 $S^TS$ 可逆"）。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— MIMO 的输入输出 $\mathbf{y}=H\mathbf{x}+\mathbf{n}$ 是标准 $A\mathbf{x}=\mathbf{b}$ 型问题：迫零检测**直接解方程组**（或用 $H^{-1}$ 的等价操作）；OFDM 信道均衡 $Y_k=H_kX_k$ 是**对角矩阵的逆**——每个子载波一个除法。大规模 MIMO 里工程实现用 QR 分解/Cholesky 而非明示求逆，正是 2.6 那条"工程铁律"的直接体现。
- [[vault-notes/communication/04-channel]] —— 信道均衡器的抽头系数由线性方程组确定：MMSE 均衡解 $(R+\sigma^2 I)\mathbf{w}=\mathbf{p}$，其中 $R$ 对称（2.7 的 $LDL^T$/Cholesky 正好对口）；自适应均衡（LMS）迭代逼近的，正是这些方程的"流式解"。
- [[vault-notes/communication/12-orthogonal-codes-pn-sequences]] —— 正交码的构造可以看成"挑选一组合适的列向量"使方程组永远好解；沃尔什函数/哈达玛矩阵的性质 $\mathbf{H}_n\mathbf{H}_n^T=nI$ 就是"正交矩阵"的 0/1 特例（2.7 置换矩阵的远房亲戚）。

**相关**：[[vault-notes/math/linear-algebra/03-vector-spaces-subspaces]]｜[[vault-notes/math/linear-algebra/04-orthogonality]]
