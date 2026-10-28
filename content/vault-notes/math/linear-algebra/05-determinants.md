---
title: "行列式"
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
> 前四章各干一件事：**解方程**（第 2 章）、**描述解的结构**（第 3 章）、**找最近似的解**（第 4 章）。但有一个数从头到尾没算过——**行列式**。它是线性代数里唯一一个"把 $n\times n$ 矩阵压成一个数"的函数，而这个数度量的是**体积被放大了几倍**。
>
> - **5.1** 行列式：Strang 的讲法是"**性质优先**"——三条基本性质把行列式**唯一确定**，其余七条全是推论；消元顺势给出了最快的算法
> - **5.2** 排列与代数余子式：主元公式（$\det=\pm$ 主元之积，$O(n^3)$）→ 排列公式（$n!$ 项，用来**证明**）→ 代数余子式（沿零最多的行/列展开）
> - **5.3** 克拉默法则、逆矩阵与体积：两个"显式公式" + 三个几何身份（**面积、叉积、体积**）
>
> 一句话主线：**行列式不是"背公式算出来的"，而是"被性质逼出来的"——它测的是矩阵对体积的缩放倍数，符号则说明方向有没有被翻转。**

> [!note] 记号约定
> - $\det A$ 也写作 $|A|$；**行列式只对方阵有定义**（$A$ 为 $n\times n$）
> - $M_{ij}$：**余子式**（minor，删掉第 $i$ 行第 $j$ 列后的行列式）；$C_{ij}=(-1)^{i+j}M_{ij}$：**代数余子式**（cofactor）
> - $\sigma$：$1,\dots,n$ 的一个**排列**（permutation）；$(-1)^{\sigma}$ 是它的符号；$n!$ 个排列全体记作 $S_n$
> - $\mathbf{u},\mathbf{v},\mathbf{w}$：三维向量；$\times$ 是叉积，$\cdot$ 是点积
> - 沿用前面：$r=\operatorname{rank}(A)$、$\mathbf{C}(A)$、$\mathbf{N}(A)$

# 5.1 行列式

前面三章解决"解方程"的三件大事，却从未真正算过一个数。这一章的主角是一个**函数**：

$$
\det:\ \{n\times n\ \text{矩阵}\}\ \longrightarrow\ \mathbb{R}
$$

它把整个矩阵浓缩成一个数——这个数叫**行列式**（determinant）。奇怪的是，Strang 讲它不是从"公式"开始的——**是从"性质"开始的**。

## 行列式的性质

> [!info] Def 1 行列式的三条基本性质
> 记这个数为 $\det$，它被下面三条**唯一确定**：
> 1. **单位矩阵**：$\det I=1$；
> 2. **换行变号**：交换任意两行，行列式**变号**；
> 3. **对每一行分别线性**：
>    (a) 某一行乘以 $t$，则行列式乘以 $t$；
>    (b) 若某一行是**两个向量之和**，则行列式可拆成两个行列式之和（其余各行不动）：
>    $$
>    \det\begin{bmatrix}\leftarrow\ \mathbf{r}_i+\mathbf{r}_i'\ \rightarrow\\\vdots\end{bmatrix}=\det\begin{bmatrix}\leftarrow\ \mathbf{r}_i\ \rightarrow\\\vdots\end{bmatrix}+\det\begin{bmatrix}\leftarrow\ \mathbf{r}_i'\ \rightarrow\\\vdots\end{bmatrix}
>    $$
>
> 措辞要盯紧：性质 3 是"**对每一行分别**线性"，**不是**对整个矩阵线性——$\det(A+B)\ne\det A+\det B$（本节末有反例）。

**为什么"三条就够"？** 因为任何矩阵都可以只用这三种动作化到单位矩阵（消元 + 归一化 + 换行），每一步对 $\det$ 的影响都已知：换行翻号、某行乘 $t$ 则整体乘 $t$、某行加另一行的倍数则不变。走完全程，$\det$ 的值就被逼到唯一一个数。**如果两个函数都满足这三条，它们在任何矩阵上都相等**——这就是"三条基本性质 ≥ 一切公式"的原因。

由这三条出发，其余性质全都是**推论**：

> [!tip] 性质 4–10：全是推论
> | 序号 | 性质 | 一句话理由 |
> | --- | --- | --- |
> | 4 | 两行相同 ⇒ $\det=0$ | 把这两行换一下：变号又不变，只能是 $0$ |
> | 5 | **一行减去另一行的倍数 ⇒ $\det$ 不变** | 这就是"消元"！由 3b 拆项、再由 4 归零 |
> | 6 | 有一行全零 ⇒ $\det=0$ | 该行乘 $0$ 还是它自己，故 $\det=0\cdot\det$ |
> | 7 | 三角矩阵（triangular matrix）⇒ $\det=$ **对角元之积** | 消元到对角形，只剩主对角线（3a 用 $n$ 次） |
> | 8 | **奇异 $\iff\det=0$** | 消元必出现零主元（第 2 章） |
> | 9 | $\det(AB)=\det A\cdot\det B$ | 见 5.2 排列公式，或用消元证 |
> | 10 | $\det(A^T)=\det A$ | 行列互换不改变值 ⇒ **行的一切性质对列同样成立** |

性质 5 的推导只有一行（值得记住这个"拆 + 归零"的手法）：

$$
\det\begin{bmatrix}\mathbf{r}_1\\\mathbf{r}_2+t\mathbf{r}_1\end{bmatrix}
=\det\begin{bmatrix}\mathbf{r}_1\\\mathbf{r}_2\end{bmatrix}+t\underbrace{\det\begin{bmatrix}\mathbf{r}_1\\\mathbf{r}_1\end{bmatrix}}_{=0\ (\text{性质 4})}
=\det\begin{bmatrix}\mathbf{r}_1\\\mathbf{r}_2\end{bmatrix}
$$

> [!tip] 两条立刻要用到的推论
> - **$\det(cA)=c^n\det A$**（每一行各贡献一个 $c$，一共 $n$ 行）——注意指数是 $n$，不是 $1$；
> - **$\det(A^{-1})=1/\det A$**（在 $\det(AB)=\det A\det B$ 里取 $B=A^{-1}$，利用 $\det I=1$）。

> [!tip] $2\times2$ 公式不是背的，是推的
> 只用性质 3b 把两行逐步拆开（每一步"拆一行"）：
> $$
> \begin{aligned}
> \det\begin{bmatrix}a&b\\c&d\end{bmatrix}
> &=\det\begin{bmatrix}a&0\\c&d\end{bmatrix}+\det\begin{bmatrix}0&b\\c&d\end{bmatrix}\\
> &=a\det\begin{bmatrix}1&0\\c&d\end{bmatrix}+b\det\begin{bmatrix}0&1\\c&d\end{bmatrix}\\
> &=a\Big(d\det\begin{bmatrix}1&0\\0&1\end{bmatrix}+c\underbrace{\det\begin{bmatrix}1&0\\1&0\end{bmatrix}}_{=0}\Big)
>  +b\Big(c\underbrace{\det\begin{bmatrix}0&1\\0&1\end{bmatrix}}_{=0}+d\underbrace{\det\begin{bmatrix}0&1\\1&0\end{bmatrix}}_{=-1}\Big)\\
> &=ad-bc
> \end{aligned}
> $$
> 中间那些为零的项，都是"两行相同"（性质 4）；最后一个 $\det\begin{bmatrix}0&1\\1&0\end{bmatrix}=-1$ 来自"换行变号"（性质 2）。**$ad-bc$ 是被性质逼出来的，不是天上掉的。**

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 300" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la5-r" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la5-rr" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#dc2626"/>
    </marker>
  </defs>

  <!-- ① 原形 -->
  <text x="114" y="60" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">① 原形</text>
  <polygon points="75,210 127,184 153,132 101,158" fill="#4f46e5" fill-opacity="0.16" stroke="#4f46e5" stroke-opacity="0.8"/>
  <line x1="75" y1="210" x2="127" y2="184" stroke="#4f46e5" stroke-width="2" marker-end="url(#la5-r)"/>
  <line x1="75" y1="210" x2="101" y2="158" stroke="#4f46e5" stroke-width="2" marker-end="url(#la5-r)"/>
  <text x="132" y="196" font-size="11.5" font-weight="600" fill="#4f46e5">r₁</text>
  <text x="88" y="152" font-size="11.5" font-weight="600" fill="#4f46e5">r₂</text>
  <text x="114" y="250" text-anchor="middle" font-size="12" font-weight="600" fill="#059669">det = 3</text>

  <!-- ② 交换两行 -->
  <text x="324" y="60" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">② 交换两行</text>
  <polygon points="285,210 311,158 363,132 337,184" fill="#dc2626" fill-opacity="0.14" stroke="#dc2626" stroke-opacity="0.8"/>
  <line x1="285" y1="210" x2="311" y2="158" stroke="#dc2626" stroke-width="2" marker-end="url(#la5-rr)"/>
  <line x1="285" y1="210" x2="337" y2="184" stroke="#dc2626" stroke-width="2" marker-end="url(#la5-rr)"/>
  <text x="290" y="152" font-size="11.5" font-weight="600" fill="#dc2626">r₂</text>
  <text x="343" y="196" font-size="11.5" font-weight="600" fill="#dc2626">r₁</text>
  <text x="324" y="250" text-anchor="middle" font-size="12" font-weight="600" fill="#dc2626">det = −3（方向翻转）</text>

  <!-- ③ 剪切 -->
  <text x="547" y="60" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">③ 一行加另一行的倍数</text>
  <polygon points="495,210 573,132 599,80 521,158" fill="#4f46e5" fill-opacity="0.16" stroke="#4f46e5" stroke-opacity="0.8"/>
  <line x1="495" y1="210" x2="573" y2="132" stroke="#4f46e5" stroke-width="2" marker-end="url(#la5-r)"/>
  <line x1="495" y1="210" x2="521" y2="158" stroke="#4f46e5" stroke-width="2" marker-end="url(#la5-r)"/>
  <text x="521" y="152" font-size="11.5" font-weight="600" fill="#4f46e5">r₂</text>
  <text x="547" y="250" text-anchor="middle" font-size="12" font-weight="600" fill="#059669">det = 3（剪切：面积不变）</text>

  <!-- ④ 乘 2 -->
  <text x="755" y="60" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">④ 一行乘 2</text>
  <polygon points="690,210 794,158 820,106 716,158" fill="#4f46e5" fill-opacity="0.16" stroke="#4f46e5" stroke-opacity="0.8"/>
  <line x1="690" y1="210" x2="794" y2="158" stroke="#4f46e5" stroke-width="2" marker-end="url(#la5-r)"/>
  <line x1="690" y1="210" x2="716" y2="158" stroke="#4f46e5" stroke-width="2" marker-end="url(#la5-r)"/>
  <text x="755" y="250" text-anchor="middle" font-size="12" font-weight="600" fill="#059669">det = 6（面积 ×2）</text>

  <text x="420" y="286" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">把两行看成平行四边形的两条边：|det| 是面积，符号是"定向"（②翻面 ⇒ 变号；③剪切 ⇒ 不变）</text>
</svg>

**例子：用消元算行列式**。第 2 章那个 $A$（$A=LU$ 的主角）：

$$
A=\begin{bmatrix}2&1&1\\4&-6&0\\-2&7&2\end{bmatrix}
=L\,U=\begin{bmatrix}1&0&0\\2&1&0\\-1&-1&1\end{bmatrix}\begin{bmatrix}2&1&1\\0&-8&-2\\0&0&1\end{bmatrix}
$$

因为 $\det L=1$（下三角、对角全 1）且消元过程中没有换行：

$$
\det A=\det L\cdot\det U=\prod(\text{主元})=2\times(-8)\times 1=-16
$$

**例子：奇异矩阵**。第 3 章那个 $A=\begin{bmatrix}1&1&2\\2&1&3\\3&1&4\end{bmatrix}$（$r=2$）消元后出现零主元，所以

$$
\det\begin{bmatrix}1&1&2\\2&1&3\\3&1&4\end{bmatrix}=0
$$

**$r<n$ 与 $\det=0$ 是同一件事**：性质 8 把第 3 章的"秩"和本章的"行列式"焊在了一起。

> [!warning] 三个高频误算
> 1. **$\det(A+B)\ne\det A+\det B$**。反例只要两行：
>    $$
>    A=\begin{bmatrix}1&0\\0&0\end{bmatrix},\ B=\begin{bmatrix}0&0\\0&1\end{bmatrix}\quad\Rightarrow\quad \det A=\det B=0,\ \text{但}\ \det(A+B)=\det I=1
>    $$
> 2. **$\det(cA)=c^n\det A\ne c\det A$**。取 $A=\begin{bmatrix}1&2\\3&4\end{bmatrix}$：$\det A=-2$，而 $\det(2A)=4\times(-2)=-8\ne2\times(-2)$。
> 3. **$\det(AB)=\det(BA)$ 总成立**（虽然 $AB\ne BA$）。所以判别式里 $AB$ 与 $BA$ 的 $\det$ 可以放心互换——第 6 章算特征值时会用到。

> [!tip] 行列式的四张面孔
> | 面孔 | 语言 | 用途 |
> | --- | --- | --- |
> | **可乘的函数** | $\det(AB)=\det A\det B$ | 相似变换下的不变量；$\det(A^{-1})=1/\det A$ |
> | **奇异的探测器** | $\det=0\iff$ 不可逆 $\iff$ 列相关 | 判可逆、判独立（"秩"的又一个等价说法） |
> | **体积的缩放** | $\lvert\det\rvert=$ 面积/体积倍数，符号 = 定向 | 5.3 的全部几何内容 |
> | **显式公式的载体** | $A^{-1}=C^T/\det A$、克拉默法则、$\det(A-\lambda I)$ | 5.3 与第 6 章（特征值的定义式） |

# 5.2 排列与代数余子式

## 主元公式

性质 5 已经说明"消元不改变行列式"，所以消元到三角形之后，$\det$ 等于**对角元（主元）之积**——唯一的麻烦是换行会翻号。

> [!tip] 主元公式
> **主元公式**（pivot formula）：若消元过程中做了 $p$ 次**行交换**，则
> $$
> \det A=(-1)^p\,(\text{各主元之积})
> $$
> **推导**：$PA=LU$（第 2 章的分解式），两边取 $\det$：
> $$
> \det P\cdot\det A=\det L\cdot\det U=1\times\prod(\text{主元})
> $$
> 而**置换矩阵**（permutation matrix）$\det P=(-1)^p$，又因为它只能是 $\pm1$，故 $1/\det P=\det P$，于是 $\det A=\det P\cdot\prod(\text{主元})=(-1)^p\prod(\text{主元})$。

**例 1（无换行）**：上面第 2 章的 $A$，主元为 $2,-8,1$，故 $\det A=2\times(-8)\times1=-16$ ✓（与逐项算一致）。

**例 2（有换行）**：

$$
A=\begin{bmatrix}0&2\\3&4\end{bmatrix}
\xrightarrow{\ \text{换行}\ }
\begin{bmatrix}3&4\\0&2\end{bmatrix},\qquad p=1,\ \text{主元 }3,2
$$

$$
\det A=(-1)^1(3\times2)=-6\qquad\text{直接验算：}0\times4-2\times3=-6\ \checkmark
$$

> [!tip] 主元公式才是"工程公式"
> - **代价 $O(n^3)$**，与消元同阶；LAPACK、`numpy.linalg.det` 走的就是这条（内部是 LU 分解）；
> - 副产品：**消元一结束，"有没有解"（第 2 章）与"$\det$ 是否为零"（本章）同时揭晓**；
> - 置换矩阵本身：$\det P=(-1)^p$，即"排列的符号"——下一节的排列公式从这里长出来。

> [!warning] 符号要数全
> 如果为选主元做了**列交换**（列主元法），列交换同样翻号，$p$ 必须把行、列交换一起数。少数的这一次，$\det$ 就整个反号。

## 计算行列式的基础公式

主元公式把"计算"解决了，但"$\det$ 究竟是怎么由 $n^2$ 个元素搭出来的"还没说清。把三项性质一路展开到底，就得到**排列公式**（Strang 称之为 the big formula）。

> [!tip] 排列公式（大公式）
> $$
> \boxed{\ \det A=\sum_{\sigma\in S_n}(-1)^{\sigma}\,a_{1\sigma(1)}a_{2\sigma(2)}\cdots a_{n\sigma(n)}\ }
> $$
> **排列公式**（permutation formula，Strang 称之为 the big formula）：对**全部 $n!$ 个排列**求和；每一项从**每一行、每一列各取恰好一个**元素相乘。
> 符号 $(-1)^{\sigma}$ 有两种等价算法：
> - **逆序数**（inversion count）：$(-1)^{\sigma}=(-1)^{\#\text{逆序对}}$（"前面的数比后面大"的次数）；
> - **轮换数**（cycle count）：把 $\sigma$ 分解成 $c$ 个轮换（不动点也算一个轮换），则 $(-1)^{\sigma}=(-1)^{\,n-c}$。

**$2\times2$ 只有两项**（$2!=2$）：$\sigma=(1,2)$ 符号 $+$ 给 $ad$；$\sigma=(2,1)$ 符号 $-$ 给 $bc$：

$$
\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc
$$

**$3\times3$ 有六项**（$3!=6$）——正是中学课本的"对角线法则"：

| 排列 $\sigma$ | 取值 | 轮换数 $c$ | 符号 $(-1)^{3-c}$ | 项 |
| --- | --- | --- | --- | --- |
| $(1,2,3)$ | $1\to1,2\to2,3\to3$ | 3 | $+$ | $+a_{11}a_{22}a_{33}$ |
| $(2,3,1)$ | $1\to2,2\to3,3\to1$ | 1 | $+$ | $+a_{12}a_{23}a_{31}$ |
| $(3,1,2)$ | $1\to3,2\to1,3\to2$ | 1 | $+$ | $+a_{13}a_{21}a_{32}$ |
| $(1,3,2)$ | 交换 2、3 | 2 | $-$ | $-a_{11}a_{23}a_{32}$ |
| $(3,2,1)$ | 交换 1、3 | 2 | $-$ | $-a_{13}a_{22}a_{31}$ |
| $(2,1,3)$ | 交换 1、2 | 2 | $-$ | $-a_{12}a_{21}a_{33}$ |

三条"正"项与三条"负"项，画出来就是向左下的三条、向右下的三条。

> [!warning] 对角线法则只在 $n=3$ 成立
> $2\times2$ 两项、$3\times3$ 六项都还能用直线数出来，但 **$4\times4$ 有 $4!=24$ 项**，五条"斜线"根本数不完。任何把"斜线法则"用到四阶以上的人都算错了——**没有 $n$ 维的对角线法则**。

> [!tip] 排列公式是"证明工具"，不是"计算工具"
> | $n$ | $n!$ | 消元 $n^3$ |
> | --- | --- | --- |
> | 3 | 6 | 27 |
> | 5 | 120 | 125 |
> | 10 | 3 628 800 | 1 000 |
> | 20 | $2.4\times10^{18}$ | 8 000 |
> | 25 | $1.6\times10^{25}$ | 15 625 |
> $n=25$ 时两者差了约 $10^{21}$ 倍——这就是"公式漂亮但不能用"的经典案例。
> 它的真正价值在**证明**：
> 1. **$\det(A^T)=\det A$**：把 $\sigma$ 换成它的逆 $\sigma^{-1}$，求和项一一对应；
> 2. **$\det(AB)=\det A\det B$**：把双重求和按排列配对（细节略）；
> 3. **"两行相同 ⇒ $\det=0$"**：交换这两行的下标，各项两两配对、符号相反、完全抵消；
> 4. **"$\det\ne0\iff$ 满秩"的最深解释**：$\det$ 是元素的多项式，它不为零意味着"各项没能全部抵消"——严格证明仍走消元（性质 8）。

## 利用代数余子式计算行列式

排列公式的 $n!$ 项可以"按行分组"，分组后得到**余子式展开**——这是手算小矩阵和推导公式的主力。

> [!info] Def 2 余子式与代数余子式
> 划掉 $A$ 的第 $i$ 行与第 $j$ 列，剩下的 $(n-1)\times(n-1)$ 行列式叫**余子式** $M_{ij}$。带上符号
> $$
> C_{ij}=(-1)^{i+j}M_{ij}
> $$
> 叫**代数余子式**（cofactor）。符号只取决于"位置"，是棋盘的形状：
>
> ```
> +  −  +  −
> −  +  −  +
> +  −  +  −
> −  +  −  +
> ```

> [!tip] 展开定理（拉普拉斯展开）
> **代数余子式展开**（cofactor expansion，也叫 Laplace expansion）：沿**任意一行或任意一列**展开，结果都等于 $\det A$：
> $$
> \det A=\sum_{j=1}^{n}a_{ij}C_{ij}\quad(\text{沿第}\ i\ \text{行})\qquad\qquad \det A=\sum_{i=1}^{n}a_{ij}C_{ij}\quad(\text{沿第}\ j\ \text{列})
> $$
> 另有一条"**错行公式**"，5.3 的求逆就靠它：
> $$
> \sum_{j=1}^{n}a_{kj}C_{ij}=0\qquad(k\ne i)
> $$
> 理由很妙：这个和等于"把第 $i$ 行替换成第 $k$ 行后"的行列式，而那矩阵有两行相同（性质 4）。**"展开式 = det、错行式 = 0"这两条合起来就是 $AC^T=(\det A)I$。**

> [!tip] 手算技巧：挑零最多的行/列
> 零元素直接不出现在求和里。若某行只有一个非零元，$(n-1)$ 阶的活儿只干一次。
> **例 1（沿第一行展开，还是第 2 章那个 $A$）**：
> $$
> \begin{aligned}
> \det A&=2\begin{vmatrix}-6&0\\7&2\end{vmatrix}-1\begin{vmatrix}4&0\\-2&2\end{vmatrix}+1\begin{vmatrix}4&-6\\-2&7\end{vmatrix}\\
> &=2(-12)-1(8)+1(28-12)=-24-8+16=-16\ \checkmark
> \end{aligned}
> $$
> 与主元公式（$2\times(-8)\times1$）**同一个答案**——两条路殊途同归，正是"性质唯一确定 $\det$"的体现。

> [!tip] 例 2：三对角矩阵的递推（$\det D_n=n+1$）
> 定义 $n\times n$ 的**三对角矩阵**（tridiagonal matrix）——"一维离散拉普拉斯"（对角 2、两侧 $-1$）：
> $$
> D_n=\begin{bmatrix}2&-1&\\-1&2&-1\\&\ddots&\ddots&\ddots\\&&-1&2\end{bmatrix}
> $$
> 沿**第一行**展开：$a_{11}=2$ 配的代数余子式正是 $D_{n-1}$；$a_{12}=-1$ 配的 $C_{12}=-M_{12}$，而 $M_{12}$ 沿第一列展开恰好得 $-D_{n-2}$（两次"借一位"的符号恰好抵消），所以这一项是 $-D_{n-2}$：
> $$
> \det D_n=2\det D_{n-1}-\det D_{n-2},\qquad \det D_1=2,\ \det D_2=3
> $$
> 于是序列 $2,3,4,5,\dots$，归纳得
> $$
> \det D_n=n+1\quad(2,3,4,5,6,\dots)
> $$
> 这个矩阵在通信里反复出现（把连续问题离散化），它的行列式"只线性增长"是很值得记住的性质。

> [!tip] 例 3：范德蒙德行列式
> $$
> \det\begin{bmatrix}1&1&1\\x_1&x_2&x_3\\x_1^2&x_2^2&x_3^2\end{bmatrix}=(x_2-x_1)(x_3-x_1)(x_3-x_2),\qquad\text{一般地}\ \ \prod_{i<j}(x_j-x_i)
> $$
> 举例：$x=(1,2,3)$ 时 $\det=1\times2\times1=2$。
> 这就是**范德蒙德行列式**（Vandermonde determinant）。**含义极其重要**：只要各 $x_i$ **互不相同**，这个矩阵就**可逆**。
> 通信里的**阵列流形矩阵**（array manifold matrix；各行对应不同入射方向或不同频率）正是范德蒙德结构，所以"**方向互异 ⇒ 满秩 ⇒ 可分辨**"这条 DOA 估计（MUSIC / ESPRIT）的前提条件，本质就是上面这个乘积不为零（[[vault-notes/5g/phy/04-physical-channels-signals]]）。

> [!tip] 例 4：分块三角
> $$
> \det\begin{bmatrix}A&B\\0&D\end{bmatrix}=\det A\cdot\det D\qquad(A,D\ \text{为方阵})
> $$
> 级联系统、状态空间模型里常见这种结构：整体"体积缩放"= 各级缩放之积。

> [!warning] 余子式展开的代价也是阶乘级
> $n$ 阶展开要算 $n$ 个 $(n-1)$ 阶行列式，递归下去仍是 $O(n!)$。**它的地位是"公式与证明"，不是"算法"**：求逆公式、克拉默法则、特征多项式 $\det(A-\lambda I)$ 都由它长出来——但要真的算数值，还得回 5.2 的主元公式（$O(n^3)$）。
> 把 $C_{ij}$ 排成矩阵 $C$，它的转置 $C^T$ 就是下一个要用的**伴随矩阵**（adjugate matrix）。

# 5.3 克拉默法则、逆矩阵与体积

## 逆矩阵公式

第 2 章用高斯-约当求逆，现在用代数余子式写出**显式公式**。

> [!tip] 逆矩阵的公式
> $$A^{-1}=\frac{C^{T}}{\det A}=\frac{1}{\det A}
> \begin{bmatrix}
> C_{11}&C_{21}&\cdots&C_{n1}\\
> C_{12}&C_{22}&\cdots&C_{n2}\\
> \vdots&\vdots&&\vdots\\
> C_{1n}&C_{2n}&\cdots&C_{nn}
> \end{bmatrix}$$
> **验证一句话**：$AC^{T}=(\det A)I$。
> - 对角线元：$\sum_j a_{ij}C_{ij}=\det A$（**展开定理**）；
> - 非对角元：$\sum_j a_{kj}C_{ij}=0$（**错行公式**，等于两行相同的行列式）。
>
> **$2\times2$ 特例**（第 2 章用过的那条）：
> $$
> \begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}=\frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}
> $$
> 对照代数余子式：$C_{11}=d$、$C_{12}=-c$、$C_{21}=-b$、$C_{22}=a$——**先算 $C$ 再转置**，就是上面那个"交叉换位、副对角变号"的样子。

> [!warning] 这是公式，不是算法
> 它要算 $n^2$ 个 $(n-1)$ 阶行列式，总代价 $O(n!)$；而高斯-约当是 $O(n^3)$（第 2 章的铁律"求解 ≠ 求逆"在这里又出现一次，而且更严重）。
> 公式的用途：**说明 $A^{-1}$ 的元素是 $A$ 的分式的代数结构**、手算 $2\times2$/$3\times3$、以及做符号推导（例如证明"整数矩阵的逆仍是整数矩阵当且仅当 $\det A=\pm1$"）。

## 克拉默法则

把求逆公式代进 $A\mathbf{x}=\mathbf{b}$，就得到**把解写成两个行列式之商**的法则。

> [!tip] 克拉默法则
> **克拉默法则**（Cramer's rule）：若 $\det A\ne0$，则 $A\mathbf{x}=\mathbf{b}$ 的**唯一**解为
> $$
> x_1=\frac{\det B_1}{\det A},\qquad x_2=\frac{\det B_2}{\det A},\qquad\dots,\qquad x_n=\frac{\det B_n}{\det A}
> $$
> 其中 $B_j$ 是把 $A$ 的**第 $j$ 列换成 $\mathbf{b}$**、其余列不动得到的矩阵。
> **推导两行**：$\mathbf{x}=A^{-1}\mathbf{b}=\dfrac{C^{T}\mathbf{b}}{\det A}$，取第 $j$ 个分量：
> $$
> x_j=\frac{1}{\det A}\sum_{i=1}^{n}C_{ij}b_i
> $$
> 而按第 $j$ 列展开 $B_j$ 恰好给出这个和——因为 $B_j$ 的第 $j$ 列是 $b_i$，其余列与 $A$ 相同，**代数余子式完全没变**。

> [!tip] 例：用第 1 章那组方程验证
> 第 1、2 章反复出现的方程组
> $$
> 2x+y+z=5,\qquad 4x-6y=-2,\qquad -2x+7y+2z=9
> $$
> 即 $A=\begin{bmatrix}2&1&1\\4&-6&0\\-2&7&2\end{bmatrix}$，$\mathbf{b}=(5,-2,9)$，已知解为 $\mathbf{x}=(1,1,2)$。现在用克拉默法则独立地"再解一次"：
> $$
> \det A=-16,\qquad \det B_1=-16,\quad \det B_2=-16,\quad \det B_3=-32
> $$
> $$
> \Longrightarrow\quad \mathbf{x}=\left(\frac{-16}{-16},\ \frac{-16}{-16},\ \frac{-32}{-16}\right)=(1,1,2)\ \checkmark
> $$
> （$B_1$ 就是"把第 1 列换成 $\mathbf{b}$"的矩阵 $\begin{bmatrix}5&1&1\\-2&-6&0\\9&7&2\end{bmatrix}$，其余同理。）

> [!warning] 工程上绝不用它解方程
> 要算 $n+1$ 个 $n$ 阶行列式，每个还是 $O(n!)$ 级——比消元慢得离谱。它的**真正位置**是：
> - **显式依赖**：$x_j$ 对 $\mathbf{b}$ 的线性依赖被写得明明白白，做符号推导/灵敏度分析时好用；
> - **理论工具**：证明"解是 $\mathbf{b}$ 的线性函数"（这正是 $A^{-1}$ 的存在性内容）；
> - **手算小系统**：$2\times2$ 时它就是 $\dfrac{1}{ad-bc}$ 那套交叉相乘。

## 三角形的面积

行列式的第三个身份是"**体积的伸缩因子**"——这是它最直观的一面，也是"为什么性质 1–3 长那样"的答案。

> [!tip] 面积定理
> - $2\times2$：$|\det A|$ 等于以 $A$ 的**两列为两条边**的**平行四边形**（parallelogram）面积；
> - 三角形 = 平行四边形的一半：
> $$
> \text{三角形面积}=\frac{1}{2}\bigl|\det[\mathbf{u}\ \mathbf{v}]\bigr|
> $$
> 其中 $\mathbf{u},\mathbf{v}$ 是从**同一个顶点**出发的两条边向量；
> - $3\times3$：$|\det A|$ 是以三列为边的**平行六面体**（parallelepiped）体积（下下节）。
> 三点共线 $\iff$ 面积为零 $\iff$ 两向量相关 $\iff \det=0$——**共线判定就是行列式判定**。

**例**：三角形顶点 $(1,1),(3,2),(2,4)$。取顶点 $(1,1)$ 出发的两条边 $\mathbf{u}=(2,1)$、$\mathbf{v}=(1,3)$：

$$
\det\begin{bmatrix}2&1\\1&3\end{bmatrix}=2\times3-1\times1=5
\quad\Longrightarrow\quad
\text{平行四边形面积}=5,\qquad \text{三角形面积}=\frac{5}{2}
$$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 330" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la5-ax" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
    <marker id="la5-u" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la5-v" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
  </defs>

  <!-- 坐标轴 -->
  <line x1="120" y1="270" x2="400" y2="270" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la5-ax)"/>
  <line x1="150" y1="288" x2="150" y2="55" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la5-ax)"/>

  <!-- 平行四边形（面积 = |det|） -->
  <polygon points="190,230 270,190 310,70 230,110" fill="#4f46e5" fill-opacity="0.12"/>
  <line x1="270" y1="190" x2="310" y2="70" stroke="#4f46e5" stroke-width="1.6" stroke-dasharray="6 4"/>
  <line x1="310" y1="70" x2="230" y2="110" stroke="#4f46e5" stroke-width="1.6" stroke-dasharray="6 4"/>

  <!-- 三角形（面积 = 一半） -->
  <polygon points="190,230 270,190 230,110" fill="#059669" fill-opacity="0.28" stroke="#059669" stroke-width="2"/>
  <circle cx="190" cy="230" r="3" fill="var(--text-normal,#1f2328)"/>
  <circle cx="270" cy="190" r="3" fill="var(--text-normal,#1f2328)"/>
  <circle cx="230" cy="110" r="3" fill="var(--text-normal,#1f2328)"/>
  <text x="178" y="247" font-size="11" fill="var(--text-muted,#57606a)">(1,1)</text>
  <text x="278" y="200" font-size="11" fill="var(--text-muted,#57606a)">(3,2)</text>
  <text x="215" y="102" font-size="11" fill="var(--text-muted,#57606a)">(2,4)</text>

  <!-- u、v -->
  <line x1="190" y1="230" x2="266" y2="192" stroke="#4f46e5" stroke-width="2.4" marker-end="url(#la5-u)"/>
  <text x="244" y="222" font-size="12" font-weight="700" fill="#4f46e5">u = (2,1)</text>
  <line x1="190" y1="230" x2="226" y2="116" stroke="#db2777" stroke-width="2.4" marker-end="url(#la5-v)"/>
  <text x="132" y="160" font-size="12" font-weight="700" fill="#db2777">v = (1,3)</text>

  <!-- 说明 -->
  <text x="430" y="110" font-size="12.5" fill="var(--text-normal,#1f2328)">det[u v] = 2·3 − 1·1 = 5</text>
  <text x="430" y="146" font-size="12.5" font-weight="600" fill="#4f46e5">平行四边形面积 = |det| = 5</text>
  <text x="430" y="182" font-size="12.5" font-weight="600" fill="#059669">三角形面积 = ½|det| = 5/2</text>
  <text x="430" y="222" font-size="11.5" fill="var(--text-muted,#57606a)">把三角形沿对角线补成一个平行四边形，</text>
  <text x="430" y="242" font-size="11.5" fill="var(--text-muted,#57606a)">正好是两份 —— 所以三角形占一半。</text>
</svg>

> [!tip] 为什么"面积函数"偏偏就是 det
> 三条基本性质，正是"面积"必须满足的三条：
> 1. 单位正方形面积 $=1$（性质 1）；
> 2. 交换两条边 ⇒ 平行四边形"翻个面"，**定向面积变号**（性质 2）；
> 3. 一条边伸长 $t$ 倍 ⇒ 面积 $\times t$；一条边拆成两段 ⇒ 面积相加（性质 3）。
> **满足这三条的函数只有一个，所以"面积"只能是行列式。** 反过来说：要理解性质 1–3，画一个平行四边形就够了。

> [!warning] 记得取绝对值
> $\det$ 给出的是**定向（带符号）面积**（signed area）：正号表示"从第一列转到第二列是逆时针"，负号表示顺时针。**实际面积取 $|\det|$**，而符号本身是有用的（它区分左右手系——下一节讲清楚）。

> [!note] 通信方向：多维"体积"在场
> 面积/体积的身份在通信里随处可见：
> - **多维星座**（QAM/Grassmannian）的"体积"决定能量效率；线性变换把星座"拉伸"多少倍，正是 $|\det|$；
> - **线性变换下的概率密度**：若 $\mathbf{x}=A\mathbf{z}$，则 $f_X(\mathbf{x})=\dfrac{f_Z(A^{-1}\mathbf{x})}{|\det A|}$——分母那个 $|\det A|$ 就是"体积缩放"在概率里的化身（随机信号经线性系统后的分布变换、噪声协方差变换都会碰到它）；
> - **格码/格基**（lattice code）：生成矩阵的 $|\det|$ = 格的**基本体积**（fundamental volume），格码增益要用"最小距离 ÷ 体积$^{1/n}$"来衡量，格基约简（LLL）一路都在算行列式。

## 叉积

三维里有一个"专为行列式而生"的运算——**叉积**：它把两个向量变成一个新向量，而这个新向量的分量恰好是三个 $2\times2$ 行列式。

> [!info] Def 3 叉积
> **叉积**（cross product）：对 $\mathbf{u}=(u_1,u_2,u_3)$、$\mathbf{v}=(v_1,v_2,v_3)$，
> $$\mathbf{u}\times\mathbf{v}=
> \begin{vmatrix}\mathbf{i}&\mathbf{j}&\mathbf{k}\\u_1&u_2&u_3\\v_1&v_2&v_3\end{vmatrix}
> =\begin{bmatrix}u_2v_3-u_3v_2\\u_3v_1-u_1v_3\\u_1v_2-u_2v_1\end{bmatrix}$$
> （把第一行当作"符号占位"的 $\mathbf{i},\mathbf{j},\mathbf{k}$，按第一行展开这个 $3\times3$ 行列式，得到的就是上面这个向量。）

它的三条性质全都能用行列式的性质一眼看穿：

> [!tip] 叉积的三条性质
> 1. **垂直于两者**：$\mathbf{u}\cdot(\mathbf{u}\times\mathbf{v})=0$、$\mathbf{v}\cdot(\mathbf{u}\times\mathbf{v})=0$。
>    证明只需"两行相同"：$\mathbf{u}\cdot(\mathbf{u}\times\mathbf{v})$ 展开后是一个 $3\times3$ 行列式，其中**有两行都是 $\mathbf{u}$**，故为零（性质 4）——**"垂直"这件事，被行列式一行证明**。
> 2. **长度 = 平行四边形面积**：$\|\mathbf{u}\times\mathbf{v}\|=\|\mathbf{u}\|\|\mathbf{v}\|\sin\theta$，也就是 $|\det[\mathbf{u}\ \mathbf{v}]|$ 的三维版。
> 3. **反交换**：$\mathbf{v}\times\mathbf{u}=-\mathbf{u}\times\mathbf{v}$（**交换两行变号**，性质 2），特别地 $\mathbf{u}\times\mathbf{u}=\mathbf{0}$。

**例**：$\mathbf{u}=(1,2,3)$、$\mathbf{v}=(4,5,6)$：

$$
\mathbf{u}\times\mathbf{v}=\bigl(2\times6-3\times5,\ \ 3\times4-1\times6,\ \ 1\times5-2\times4\bigr)=(-3,\ 6,\ -3)
$$

验证垂直：$\mathbf{u}\cdot(-3,6,-3)=-3+12-9=0$ ✓，$\mathbf{v}\cdot(-3,6,-3)=-12+30-18=0$ ✓。
长度 $\|\mathbf{u}\times\mathbf{v}\|=\sqrt{9+36+9}=\sqrt{54}=3\sqrt6\approx7.35$，就是这两个向量张成的平行四边形面积。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 330" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la5-cu" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la5-cv" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
    <marker id="la5-cn" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#059669"/>
    </marker>
  </defs>

  <!-- 底平面 -->
  <polygon points="240,240 460,200 380,80 160,120" fill="#4f46e5" fill-opacity="0.10" stroke="#4f46e5" stroke-opacity="0.45" stroke-width="1.2"/>

  <!-- u、v -->
  <line x1="240" y1="240" x2="456" y2="201" stroke="#4f46e5" stroke-width="2.4" marker-end="url(#la5-cu)"/>
  <text x="464" y="208" font-size="12.5" font-weight="700" fill="#4f46e5">u</text>
  <line x1="240" y1="240" x2="164" y2="124" stroke="#db2777" stroke-width="2.4" marker-end="url(#la5-cv)"/>
  <text x="146" y="120" font-size="12.5" font-weight="700" fill="#db2777">v</text>

  <!-- u×v -->
  <line x1="240" y1="240" x2="240" y2="64" stroke="#059669" stroke-width="2.8" marker-end="url(#la5-cn)"/>
  <text x="248" y="58" font-size="13" font-weight="700" fill="#059669">n = u × v</text>
  <!-- 直角标记 -->
  <path d="M240,226 L254,223 L254,237" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="1.2"/>
  <circle cx="240" cy="240" r="3.5" fill="var(--text-normal,#1f2328)"/>

  <!-- 说明 -->
  <text x="500" y="106" font-size="12.5" font-weight="600" fill="#059669">n ⊥ u，n ⊥ v</text>
  <text x="500" y="132" font-size="11.5" fill="var(--text-muted,#57606a)">（两行相同 ⇒ 行列式 = 0）</text>
  <text x="500" y="176" font-size="12.5" fill="var(--text-normal,#1f2328)">‖u × v‖ = ‖u‖‖v‖ sin θ</text>
  <text x="500" y="202" font-size="11.5" fill="var(--text-muted,#57606a)">= 平行四边形的面积</text>
  <text x="500" y="246" font-size="12.5" fill="var(--text-normal,#1f2328)">方向：右手定则（u 转向 v）</text>

  <text x="420" y="312" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">叉积 = "面积向量"：长度给面积，方向垂直于张成的平面</text>
</svg>

> [!warning] 叉积只存在于三维
> 想知道"同时垂直于 $\mathbf{u},\mathbf{v}$ 的向量"，在 $\mathbb{R}^3$ 中恰好只有一条方向（所以只有一个答案，长度还可以取）。在 $\mathbb{R}^2$ 里没有这样的向量（"垂直"是相对平面说的），在 $\mathbb{R}^4$ 里这样的向量有无穷多个（张成一个二维平面）——**"叉积"是三维独有的巧合**。这也是为什么通信里做向量运算时，叉积远不如第 4 章的点积和内积常见。

## 三重积 = 行列式 = 体积

把叉积再点积一次，就得到行列式的**最终几何身份**。

> [!tip] 三重积定理
> **三重积**（triple product，也叫混合积 scalar triple product）：
> $$
> (\mathbf{u}\times\mathbf{v})\cdot\mathbf{w}=\det\begin{bmatrix}|&|&|\\\mathbf{u}&\mathbf{v}&\mathbf{w}\\|&|&|\end{bmatrix}
> $$
> **几何解释**：$\|\mathbf{u}\times\mathbf{v}\|$ 是**底面积**；$\mathbf{w}$ 在底面法线方向的投影是**高**，即 $\mathbf{w}\cdot\hat{\mathbf{n}}$（$\hat{\mathbf{n}}=(\mathbf{u}\times\mathbf{v})/\|\mathbf{u}\times\mathbf{v}\|$，方向由**右手定则**（right-hand rule）判定）；底乘高 = **平行六面体的体积**。
> **直接推论**：
> $$
> (\mathbf{u}\times\mathbf{v})\cdot\mathbf{w}=0\quad\Longleftrightarrow\quad \mathbf{u},\mathbf{v},\mathbf{w}\ \text{三个向量共面}\quad\Longleftrightarrow\quad \det[\mathbf{u}\ \mathbf{v}\ \mathbf{w}]=0
> $$

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 330" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la5-pu" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la5-pv" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
    <marker id="la5-pw" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/>
    </marker>
  </defs>

  <!-- 底面（u、v 张成） -->
  <polygon points="250,260 450,225 370,125 170,160" fill="#4f46e5" fill-opacity="0.12" stroke="#4f46e5" stroke-opacity="0.5" stroke-width="1.3"/>
  <!-- 顶面 = 底面 + w -->
  <polygon points="360,165 560,130 480,30 280,65" fill="#d97706" fill-opacity="0.12" stroke="#d97706" stroke-opacity="0.55" stroke-width="1.3"/>
  <!-- 侧棱 -->
  <line x1="250" y1="260" x2="360" y2="165" stroke="#d97706" stroke-width="2" marker-end="url(#la5-pw)"/>
  <line x1="450" y1="225" x2="560" y2="130" stroke="#d97706" stroke-width="1.4"/>
  <line x1="170" y1="160" x2="280" y2="65" stroke="#d97706" stroke-width="1.4"/>
  <line x1="370" y1="125" x2="480" y2="30" stroke="var(--text-faint,#8b949e)" stroke-width="1.2" stroke-dasharray="5 4"/>

  <!-- u、v、w -->
  <line x1="250" y1="260" x2="446" y2="226" stroke="#4f46e5" stroke-width="2.4" marker-end="url(#la5-pu)"/>
  <text x="452" y="234" font-size="12.5" font-weight="700" fill="#4f46e5">u</text>
  <line x1="250" y1="260" x2="174" y2="164" stroke="#db2777" stroke-width="2.4" marker-end="url(#la5-pv)"/>
  <text x="152" y="160" font-size="12.5" font-weight="700" fill="#db2777">v</text>
  <text x="286" y="222" font-size="12.5" font-weight="700" fill="#d97706">w</text>

  <circle cx="250" cy="260" r="3.5" fill="var(--text-normal,#1f2328)"/>

  <!-- 说明 -->
  <text x="600" y="104" font-size="12.5" fill="var(--text-normal,#1f2328)">底面积 = ‖u × v‖</text>
  <text x="600" y="144" font-size="12.5" fill="var(--text-normal,#1f2328)">高 = w 在 n̂ 上的投影</text>
  <text x="600" y="184" font-size="12.5" font-weight="600" fill="#059669">体积 = |(u × v) · w|</text>
  <text x="600" y="212" font-size="12.5" font-weight="600" fill="#059669">= |det[u v w]|</text>

  <text x="420" y="308" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">底乘高 = 三重积 = 行列式；符号表示 u、v、w 是右手系还是左手系</text>
</svg>

**例 1（三向量共面）**：$\mathbf{u}=(1,2,3)$、$\mathbf{v}=(4,5,6)$、$\mathbf{w}=(1,1,1)$：

$$
(\mathbf{u}\times\mathbf{v})\cdot\mathbf{w}=(-3,6,-3)\cdot(1,1,1)=-3+6-3=0
$$

体积为零 ⇒ **三向量共面**。确实，可以显式写出来：

$$
(1,1,1)=-\frac{1}{3}(1,2,3)+\frac{1}{3}(4,5,6)
$$

$\mathbf{w}$ 完全落在 $\mathbf{u},\mathbf{v}$ 张成的平面里——所以它与叉积垂直（"高"为零）。

**例 2（真的三维）**：把 $\mathbf{w}$ 换成 $(1,1,0)$：

$$
(\mathbf{u}\times\mathbf{v})\cdot\mathbf{w}=(-3,6,-3)\cdot(1,1,0)=3\quad\Longrightarrow\quad V=|3|=3
$$

> [!tip] 行列式 = $n$ 维体积（推广）
> 本节的所有几何都长在同一棵树上：
> | 维数 | 平行体的"体积" | 公式 |
> | --- | --- | --- |
> | 2 | 平行四边形面积 | $\lvert\det[\mathbf{u}\ \mathbf{v}]\rvert$ |
> | 3 | 平行六面体体积 | $\lvert(\mathbf{u}\times\mathbf{v})\cdot\mathbf{w}\rvert=\lvert\det[\mathbf{u}\ \mathbf{v}\ \mathbf{w}]\rvert$ |
> | $n$ | $n$ 维平行体体积 | $\lvert\det A\rvert$（$A$ 的列是 $n$ 条棱） |
> 而"体积为零"就是**维数塌陷**——正是第 3 章说的"奇异 = 把空间压到更低维"。

> [!note] 通信方向：$\det$ 出现的三个地方
> - **MIMO 容量**：$C=\log_2\det\!\left(I+\frac{\rho}{n}HH^{H}\right)$。行列式直接进入**香农容量**（Shannon capacity）公式：$\det=0$（信道奇异/空间强相关）意味着**空间复用**（spatial multiplexing）**塌陷、容量归零**；而 $\det$ 的可乘性（性质 9）正是第 7 章把 $\det$ 拆成 $\prod(1+\rho\sigma_i^2/n)$ 的依据——SVD 让行列式"露出奇异值"（[[vault-notes/5g/phy/04-physical-channels-signals]]）。
> - **DOA 估计 / 阵列处理**：阵列流形矩阵是**范德蒙德结构**，其行列式 $=\prod_{i<j}(x_j-x_i)$，所以"**来波方向互异 ⇔ 满秩 ⇔ 可分辨**"（本可放一句：这就是 5.2 例 3 的直接应用）。
> - **差分/预处理系统**：`det(A)` 是数值条件数的天然同伴——$\det$ 极小的矩阵"接近奇异"，做信道均衡、求逆、解方程时都要小心（第 7 章 SVD 会给出更可靠的"距离奇异有多远"的指标：最小奇异值）。

> [!tip] 本章收官
> 第 5 章的四节各自回答一个问题：
> 1. **它是谁**（5.1）：三条基本性质**唯一确定**了行列式——换行变号、逐行线性、$\det I=1$；其余七条全是推论；
> 2. **怎么算它**（5.2 主元公式）：$\det A=(-1)^p\prod$主元，$O(n^3)$，与消元同工——**工程正解**；
> 3. **它由什么搭成**（5.2 排列/余子式）：$n!$ 项排列求和（用来**证明**），余子式展开（用来**推导公式**与手算小矩阵）；
> 4. **它有什么用**（5.3）：两个显式公式（$A^{-1}=C^T/\det A$、克拉默法则）+ 三个几何身份（**面积、叉积、体积**）。
>
> 一句话：**行列式就是"体积函数"——性质是它的定义，消元是它的算法，余子式是它通往逆矩阵与特征值的桥。**

## 本章知识地图

```
行列式：一个数 = 体积的缩放倍数
  ├─ 5.1 行列式的性质（定义优先，性质逼出公式）
  │      ├── 三条基本性质：det I = 1 ／ 换行变号 ／ 逐行线性
  │      ├── 推论 4-10：两行相同=0、行加倍数不变（消元）、三角=对角积、
  │      │              奇异<=>det=0、det(AB)=detA·detB、det(A^T)=det(A)
  │      ├── 推论：det(cA) = c^n det A，det(A^-1) = 1/det A
  │      └── 2x2 公式 ad−bc 是"推出来的"，不是背的
  │
  ├─ 5.2 排列与代数余子式
  │      ├── 主元公式：det = (−1)^p × 主元之积（p = 交换次数）→ O(n^3) 工程正解
  │      │      └── 与第 2 章的 PA=LU 对接；det P = ±1
  │      ├── 排列公式：det = Σ_σ (−1)^σ a_{1σ(1)}···a_{nσ(n)}（n! 项）
  │      │      ├── 2x2 两项、3x3 六项（对角线法则只在 n=3 成立）
  │      │      └── 用途：证明 det(A^T)=det(A)、det(AB)、两行相同=0
  │      └── 代数余子式：C_ij = (−1)^{i+j} M_ij
  │             ├── 展开定理（沿任意行/列）= det；错行公式 = 0
  │             ├── 例：三对角 D_n → det = n+1；范德蒙德 = Π(x_j − x_i)
  │             └── 例：分块三角 = detA · detD
  │
  └─ 5.3 克拉默法则、逆矩阵与体积
         ├── 逆矩阵：A^-1 = C^T / det A（AC^T = (detA)I 由展开+错行两式合起来）
         ├── 克拉默法则：x_j = det B_j / det A（B_j = 第 j 列换成 b）
         ├── 面积：|det| = 平行四边形；三角形 = 一半；共线 <=> det = 0
         ├── 叉积：u × v = 3 个 2x2 行列式；n ⊥ u,v；‖u × v‖ = 面积；三维独有
         └── 三重积：(u × v)·w = det[u v w] = 平行六面体体积
                └── 共面 <=> 三重积 = 0 <=> det = 0
```

## 关联

- 上一章：[[vault-notes/math/linear-algebra/04-orthogonality]]
- 下一章：[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]]

**本章与前面章节的接口**（前三章留下的悬念，在这一章有了数目化的答案）：

| 前面的悬念 | 行列式的回答 |
| --- | --- |
| 第 2 章：消元什么时候失败？ | 出现零主元 $\iff\det A=0\iff$ 奇异（性质 8 + 主元公式） |
| 第 2 章：$A=LU$ 有什么用？ | $\det A=\det L\det U=\prod$主元（$\det L=1$），一次分解顺手得到 $\det$ |
| 第 3 章：独立 $\iff$ 满秩 | $\det A\ne0\iff$ 满秩 $\iff$ 列无关；反之 $\det=0$ 说明"方向有冗余" |
| 第 4 章：为什么 $A^TA$ 可逆只要"列无关"？ | 因为 $\det(A^TA)=\det(A^T)\det A=(\det A)^2>0$（性质 9 + 10 一行搞定） |
| 第 4 章：投影矩阵的秩 = 子空间维数 | $\det P=0$（只要 $r<n$）——投影矩阵永远奇异，这不妨碍它有用 |

**通信方向应用**：

- [[vault-notes/communication/09-optimal-reception]] —— 信号空间的**维数与体积**由此定量：$M$ 个信号张成的空间体积与"最小距离"之比决定误码性能；判决区域的划分（垂直平分超平面）用到了"面积/体积"的直觉；而相关接收的判决统计量是把信号投影到基上（第 4 章），本章给出这种"投影-面积"关系的度量。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— **MIMO 容量公式里有裸的 $\det$**：$C=\log_2\det(I+\frac{\rho}{n}HH^H)$；$\det H=0$ 意味着信道矩阵奇异、空间复用层数塌陷；**阵列流形矩阵是范德蒙德矩阵**，其行列式 $\prod(x_j-x_i)\ne0$ 正是"方向可分辨"的充分必要条件（DOA/波束赋形）；信道估计里的 LS 解要用到 $\det(A^TA)=(\det A)^2$ 判断良态与否。
- [[vault-notes/communication/11-error-control-coding]] —— 生成矩阵 $G$（$k\times n$）的 $k$ 阶子式/行列式判断"哪些位置构成信息位"；码空间的维数就是 $G$ 的秩；"$H\mathbf{c}^T=\mathbf{0}$"的校验结构在矩阵层面为秩判定（第 3 章）与行列式判定（本章）提供了两套等价工具；格雷码/汉明码的可译性分析最终落在"秩"上。
- [[vault-notes/communication/12-orthogonal-codes-pn-sequences]] —— 哈达玛矩阵的行列式为 $\pm n^{n/2}$（$n$ 阶时 $|\det|=n^{n/2}$），且正交性使 $\det\ne0$ 恒成立——这就是"正交码族一定可分离"的代数理由；伪随机序列的 Toeplitz/循环结构矩阵也常用行列式判断可逆性。
- [[vault-notes/math/linear-algebra/07-singular-value-decomposition]]（singular value decomposition，简称 SVD） —— SVD 把行列式的"体积缩放"拆到方向层面：$\det A=\prod\sigma_i$（**性质 9 的功劳**），$\det(A^TA)=\prod\sigma_i^2$；$\det=0$ 等价于"有奇异值为 0"，这给出比 $\det$ 更可靠的**近奇异度量**（最小奇异值）；第 7 章的主成分分析（PCA）就是用"保体积"的视角选主方向。
- [[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]] —— **下一章的第一句话就是 $\det(A-\lambda I)=0$**：特征值因此被定义为"让 $A-\lambda I$ 奇异的那几个 $\lambda$"；由 $\det(A-\lambda I)$（**特征多项式**，characteristic polynomial）的展开可立刻读出两个身份：$\det A=\prod\lambda_i$（体积缩放 = 各方向缩放之积）与 $\operatorname{tr}A=\sum\lambda_i$——"行列式与迹"是第 6 章 6.1 的标题，本章为它做了全部铺垫。

**相关**：[[vault-notes/math/linear-algebra/03-vector-spaces-subspaces]]｜[[vault-notes/math/linear-algebra/04-orthogonality]]｜[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]
