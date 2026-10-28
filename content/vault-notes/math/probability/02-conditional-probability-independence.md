---
title: "条件概率与事件的独立性"
tags:
- 数学
- 概率论
- 条件概率
type: course
subjects:
- 概率论与数理统计
domains:
- 数学基础
status: learning
aliases: []
prerequisites: []
related: []
---

> [!abstract] 本章在讲什么
> 本章在第 1 章的概率公理上加"信息"与"独立性"两层结构：
> - **1. 条件概率**：已知 $A$ 发生后，样本空间缩为 $A$，概率重新归一化。
> - **2. 乘法公式**：条件概率的移项，解决"同时发生"的逐步计算。
> - **3. 全概率公式**：按"原因"划分，把复杂事件拆成若干互斥路径。
> - **4. 贝叶斯公式**：由"结果"反推"原因"，先验 → 后验。
> - **5. 事件的独立性**：$P(AB)=P(A)P(B)$；独立 ≠ 互斥。
> - **6. 伯努利概型**：$n$ 重独立重复试验与二项概率公式。
>
> 一句话主线：**条件概率是本章的根：移项得乘法公式，按划分展开得全概率公式，反推原因得贝叶斯公式，与 $A$ 无关的特例就是独立性，独立重复 $n$ 次就是伯努利概型。**

> [!note] 记号约定
> - $P(B\mid A)$：在 $A$ 发生的条件下 $B$ 的条件概率，要求 $P(A)>0$
> - $A_1,\dots,A_n$ 为 $\Omega$ 的一个**划分**（完备事件组）：两两互斥且并为 $\Omega$
> - 先验 $P(A_i)$、似然 $P(B\mid A_i)$、后验 $P(A_i\mid B)$
> - 独立性：$P(AB)=P(A)P(B)$；$n$ 重伯努利试验中 $P(A)=p$ 保持不变
> - $B(n,p)$：二项分布（第 3 章正式引入）

# 1. 条件概率

## 1. 为什么要引入条件概率

同一个事件,在不同信息下概率不同。掷一枚骰子:

- 没有任何信息时,"出现 2 点"的概率是 $\frac{1}{6}$
- 若已知"出现的点数是偶数",则"出现 2 点"的概率变成 $\frac{1}{3}$

信息改变了概率。**条件概率**就是描述"已知某事发生"之后,概率如何变化的工具。

## 2. 定义

> [!info] Def 1 条件概率
> 设 $A,B$ 是两个事件，且 $P(A)>0$，则称
> $$
> P(B\mid A)=\frac{P(AB)}{P(A)}
> $$
> 为**在事件 $A$ 发生的条件下，事件 $B$ 发生的条件概率**（conditional probability）。

**直观理解**:原本的样本空间是 $\Omega$,现在已知 $A$ 一定发生,那么不可能落在 $A$ 之外的样本点——样本空间**缩小**成了 $A$。同时,为了让 $A$ 成为新的"必然事件",分母从 $P(\Omega)=1$ 换成了 $P(A)$,相当于**重新归一化**。

$$
\underbrace{P(B\mid A)}_{\text{在 } A \text{ 内 } B \text{ 占的比例}}=\frac{P(AB)}{P(A)}=\frac{AB \text{ 的面积}}{A \text{ 的面积}}
$$

下图把本章四个核心概念放在一起对照:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 460" width="100%" style="max-width:820px" font-family="inherit">
  <defs>
    <clipPath id="cp-clip-1" clipPathUnits="userSpaceOnUse">
      <circle cx="170" cy="104" r="58"/>
    </clipPath>
    <clipPath id="cp-clip-2" clipPathUnits="userSpaceOnUse">
      <circle cx="160" cy="332" r="52"/>
    </clipPath>
    <mask id="cp-m-out" maskUnits="userSpaceOnUse" x="0" y="0" width="820" height="460">
      <rect x="40" y="30" width="330" height="148" fill="#ffffff"/>
      <circle cx="170" cy="104" r="58" fill="#000000"/>
    </mask>
  </defs>

  <!-- ==================== (a) 条件概率 ==================== -->
  <g>
    <text x="205" y="18" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">条件概率 P(B | A)</text>
    <rect x="40" y="30" width="330" height="148" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <text x="362" y="46" text-anchor="end" font-size="11" font-style="italic" fill="var(--text-faint,#8b949e)">Ω</text>
    <rect x="40" y="30" width="330" height="148" fill="#94a3b8" fill-opacity="0.22" mask="url(#cp-m-out)"/>
    <text x="78" y="108" text-anchor="middle" font-size="10.5" fill="var(--text-faint,#8b949e)">排除</text>
    <circle cx="170" cy="104" r="58" fill="#6366f1" fill-opacity="0.18"/>
    <circle cx="245" cy="104" r="58" fill="#ec4899" fill-opacity="0.13"/>
    <circle cx="245" cy="104" r="58" fill="#a855f7" fill-opacity="0.60" clip-path="url(#cp-clip-1)"/>
    <circle cx="170" cy="104" r="58" fill="none" stroke="#4f46e5" stroke-width="2.2"/>
    <circle cx="245" cy="104" r="58" fill="none" stroke="#db2777" stroke-width="1.8"/>
    <text x="136" y="108" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
    <text x="280" y="108" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">B</text>
    <text x="205" y="196" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">灰色区被排除,样本空间缩为 A(着色 = AB)</text>
  </g>

  <!-- ==================== (b) 全概率公式 ==================== -->
  <g>
    <text x="615" y="18" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">全概率公式</text>
    <rect x="450" y="30" width="330" height="148" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <text x="772" y="46" text-anchor="end" font-size="11" font-style="italic" fill="var(--text-faint,#8b949e)">Ω</text>
    <rect x="456" y="38" width="79" height="132" fill="#6366f1" fill-opacity="0.10"/>
    <rect x="535" y="38" width="80" height="132" fill="#6366f1" fill-opacity="0.17"/>
    <rect x="615" y="38" width="79" height="132" fill="#6366f1" fill-opacity="0.24"/>
    <rect x="694" y="38" width="80" height="132" fill="#6366f1" fill-opacity="0.13"/>
    <line x1="535" y1="38" x2="535" y2="170" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1"/>
    <line x1="615" y1="38" x2="615" y2="170" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1"/>
    <line x1="694" y1="38" x2="694" y2="170" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1"/>
    <circle cx="640" cy="104" r="50" fill="#a855f7" fill-opacity="0.32" stroke="#db2777" stroke-width="1.8"/>
    <text x="495" y="50" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-muted,#57606a)">A₁</text>
    <text x="575" y="50" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-muted,#57606a)">A₂</text>
    <text x="654" y="50" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-muted,#57606a)">A₃</text>
    <text x="734" y="50" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-muted,#57606a)">A₄</text>
    <text x="640" y="109" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">B</text>
    <text x="615" y="196" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">B 的概率 = 各条路径之和</text>
  </g>

  <!-- ==================== (c) 独立性 ==================== -->
  <g>
    <text x="205" y="246" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">事件的独立性</text>
    <rect x="40" y="258" width="330" height="148" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <text x="362" y="274" text-anchor="end" font-size="11" font-style="italic" fill="var(--text-faint,#8b949e)">Ω</text>
    <circle cx="160" cy="332" r="52" fill="#6366f1" fill-opacity="0.22"/>
    <circle cx="252" cy="332" r="52" fill="#ec4899" fill-opacity="0.20"/>
    <circle cx="252" cy="332" r="52" fill="#a855f7" fill-opacity="0.55" clip-path="url(#cp-clip-2)"/>
    <circle cx="160" cy="332" r="52" fill="none" stroke="#4f46e5" stroke-width="2"/>
    <circle cx="252" cy="332" r="52" fill="none" stroke="#db2777" stroke-width="1.8"/>
    <text x="124" y="336" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
    <text x="288" y="336" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">B</text>
    <text x="205" y="424" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">A 发生与否不改变 B 的概率</text>
  </g>

  <!-- ==================== (d) 独立 vs 互斥 ==================== -->
  <g>
    <text x="615" y="246" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">独立 ≠ 互斥</text>
    <rect x="450" y="258" width="330" height="148" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <line x1="615" y1="272" x2="615" y2="392" stroke="var(--background-modifier-border,#d0d7de)" stroke-width="1" stroke-dasharray="4 4"/>
    <circle cx="512" cy="318" r="28" fill="#6366f1" fill-opacity="0.20" stroke="#4f46e5" stroke-width="1.8"/>
    <circle cx="552" cy="318" r="28" fill="#ec4899" fill-opacity="0.18" stroke="#db2777" stroke-width="1.8"/>
    <text x="500" y="322" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
    <text x="564" y="322" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">B</text>
    <text x="533" y="374" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">独立:可同时发生</text>
    <circle cx="668" cy="318" r="26" fill="#6366f1" fill-opacity="0.20" stroke="#4f46e5" stroke-width="1.8"/>
    <circle cx="724" cy="318" r="26" fill="#ec4899" fill-opacity="0.18" stroke="#db2777" stroke-width="1.8"/>
    <text x="668" y="322" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
    <text x="724" y="322" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-normal,#1f2328)">B</text>
    <text x="696" y="374" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">互斥:不能同时发生</text>
    <text x="615" y="424" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">互斥且概率非零时,一定不独立</text>
  </g>
</svg>

## 3. 条件概率的三条性质

条件概率**本身就是一个概率**,把 $P(\cdot\mid A)$ 看作定义在 $\Omega$ 上的新函数,它满足概率的全部公理:

1. **非负性**:$P(B\mid A)\ge 0$
2. **规范性**:$P(\Omega\mid A)=1$
3. **可列可加性**:$B_1,B_2,\dots$ 两两互斥时,$P\left(\sum_{i=1}^{\infty}B_i \mid A\right)=\sum_{i=1}^{\infty}P(B_i\mid A)$

因此,第一章里所有关于概率的公式,把 $P(\cdot)$ 换成 $P(\cdot\mid A)$ 后**全部成立**。例如:

$$
P(B\cup C\mid A)=P(B\mid A)+P(C\mid A)-P(BC\mid A)
$$

## 4. 四个必须注意的点

- **$P(B\mid A)$ 中的 $A$ 是"条件",不是"与 $B$ 做运算"**。$P(B\mid A)$ 和 $P(AB)$ 是两个完全不同的量:$P(AB)$ 是"$A$ 和 $B$ 同时发生"的概率,$P(B\mid A)$ 是"在 $A$ 已发生的世界里,$B$ 发生的概率"。
- **$P(B\mid A)$ 与 $P(A\mid B)$ 一般不相等**。前者分母是 $P(A)$,后者是 $P(B)$。这一点正是贝叶斯公式要处理的问题。
- **$P(B\mid A)$ 只在 $P(A)>0$ 时才有定义**。
- **条件概率可以小于、等于或大于无条件概率**。例如 $P(B\mid A)<P(B)$ 说明"$A$ 的发生降低了 $B$ 的可能性"。


# 2. 乘法公式

把条件概率的定义式两边同乘 $P(A)$,就得到**乘法公式**:

$$
P(AB)=P(A)\,P(B\mid A)\qquad (P(A)>0)
$$

对称地也有 $P(AB)=P(B)\,P(A\mid B)$。

**三个事件**(像剥洋葱,一层层剥):

$$
P(ABC)=P(A)\,P(B\mid A)\,P(C\mid AB)
$$

**一般情形**:

$$
P(A_1A_2\cdots A_n)=P(A_1)\,P(A_2\mid A_1)\,P(A_3\mid A_1A_2)\cdots P(A_n\mid A_1A_2\cdots A_{n-1})
$$

**用法**:当"同时发生"很难直接算、但"逐步发生"容易算时,用乘法公式。典型场景是**不放回抽样**。


# 3. 全概率公式

## 1. 划分(完备事件组)

> [!info] Def 2 划分
> 设 $A_1,A_2,\dots,A_n$ 是一组事件，若满足以下两条：

1. **两两互斥**:$A_iA_j=\varnothing$,$i\ne j$
2. **并为全集**:$A_1+A_2+\cdots+A_n=\Omega$

则称 $A_1,\dots,A_n$ 为样本空间 $\Omega$ 的一个**划分**(或**完备事件组**)。

直观上,划分就是把 $\Omega$ **切成互不重叠的若干块**,每一块代表一种"原因"或"情形"。上图中 (b) 的四条竖条就是 $\Omega$ 的一个划分。

## 2. 全概率公式

设 $A_1,\dots,A_n$ 为 $\Omega$ 的一个划分,且 $P(A_i)>0$,则对任意事件 $B$:

$$
P(B)=\sum_{i=1}^{n}P(A_i)\,P(B\mid A_i)
$$

**思路**:$B$ 可能由任何一种"原因" $A_i$ 引起。把 $B$ 按 $A_i$ 拆开:

$$
B=B\Omega=B(A_1+A_2+\cdots+A_n)=BA_1+BA_2+\cdots+BA_n
$$

这些 $BA_i$ 两两互斥,于是由有限可加性

$$
P(B)=\sum_{i=1}^{n}P(BA_i)=\sum_{i=1}^{n}P(A_i)P(B\mid A_i)
$$

**口诀**:已知"原因"求"结果",分情况讨论再按概率加权。


# 4. 贝叶斯公式

设 $A_1,\dots,A_n$ 为 $\Omega$ 的一个划分,$P(A_i)>0$,$P(B)>0$,则

$$
P(A_k\mid B)=\frac{P(A_k)P(B\mid A_k)}{\sum_{i=1}^{n}P(A_i)P(B\mid A_i)}=\frac{P(A_k)P(B\mid A_k)}{P(B)}
$$

**与全概率公式的关系**:分母就是全概率公式,分子是第 $k$ 条路径的概率。所以**全概率公式是贝叶斯公式的分母**。

**理解**:$P(A_k)$ 叫**先验概率**——观测之前对"原因 $A_k$"的信念;$P(A_k\mid B)$ 叫**后验概率**——观测到结果 $B$ 之后,对"原因 $A_k$"的信念更新。贝叶斯公式就是"**用证据修正信念**"的数学表述。

> [!note] 三个术语
> - **先验概率** $P(A_k)$:看数据之前
> - **似然** $P(B\mid A_k)$:该原因产生这个结果的概率
> - **后验概率** $P(A_k\mid B)$:看数据之后


# 5. 事件的独立性

## 1. 两个事件独立

> [!info] Def 3 相互独立
> 若
> $$
> P(AB)=P(A)P(B)
> $$
> 则称事件 $A$ 与 $B$ **相互独立**（independent）。

**等价形式**:当 $P(A)>0$ 时,

$$
A,B \text{ 独立} \iff P(B\mid A)=P(B)
$$

即"$A$ 发生与否,完全不改变 $B$ 的概率"——这正是"独立"二字的字面含义。反过来若 $P(B\mid A)\ne P(B)$,说明 $A$ 携带了关于 $B$ 的信息,两者不独立。

**注意**:独立性是**定义**,不是推导出来的。判断两个事件是否独立,要么验证 $P(AB)=P(A)P(B)$,要么从实际背景判断(如"两次独立重复试验")。

## 2. 独立事件的性质

若 $A$ 与 $B$ 独立,则以下三对**也相互独立**:

$$
A \text{ 与 } \bar B,\qquad \bar A \text{ 与 } B,\qquad \bar A \text{ 与 } \bar B
$$

证明 $\bar A$ 与 $B$ 独立:

$$
P(\bar A B)=P(B)-P(AB)=P(B)-P(A)P(B)=P(B)[1-P(A)]=P(B)P(\bar A)
$$

另外,必然事件 $\Omega$ 和不可能事件 $\varnothing$ 与任何事件都独立。

## 3. 多个事件的独立性

**三事件相互独立**,要求下面四个等式**同时成立**:

$$
\begin{cases} P(AB)=P(A)P(B) \\ P(AC)=P(A)P(C) \\ P(BC)=P(B)P(C) \end{cases} \quad\text{(两两独立)}
$$

$$
P(ABC)=P(A)P(B)P(C) \quad\text{(三者独立)}
$$

> [!warning] 两两独立 $\nRightarrow$ 相互独立
> **经典反例**(Feller):一个均匀正四面体,四个面分别涂成:面 1 红、面 2 白、面 3 黑、面 4 红白黑。
> 投掷一次,**观察朝下的那个面**,该面上出现的颜色算作"出现"。定义
> $$
> A=\text{"红出现"},\quad B=\text{"白出现"},\quad C=\text{"黑出现"}
> $$
> 朝下的面在 4 个面中等可能,于是
> - $P(A)=P(B)=P(C)=\frac{2}{4}=\frac{1}{2}$(红色出现在面 1 和面 4 上,余同理)
> - $P(AB)=P(AC)=P(BC)=\frac{1}{4}$(只有面 4 同时含两种颜色)→ **两两独立**
> - 但 $P(ABC)=\frac{1}{4}\ne\frac{1}{8}=P(A)P(B)P(C)$ → **不相互独立**
>
> 直观解释:一旦知道"红出现且白出现",就必定是面 4 朝下,于是"黑出现"成了必然事件——概率从 $\frac12$ 跳到 $1$。三者联合起来互相透露了信息,尽管两两之间没有。

## 4. 独立 vs 互斥

这是最容易被混的一对概念,两者**完全不同**:

| | 独立 | 互斥 |
| --- | --- | --- |
| 定义式 | $P(AB)=P(A)P(B)$ | $AB=\varnothing$ |
| 关系 | 一个发生**不影响**另一个 | 一个发生**排除**另一个 |
| 能否同时发生 | 可以,而且往往就该同时发生 | 绝对不能 |
| 图上表现 | 两圆相交 | 两圆分离 |

**关键结论**:若 $P(A)>0$ 且 $P(B)>0$,则

$$
\text{互斥} \Rightarrow \text{不独立}
$$

因为互斥意味着 $P(AB)=0$,而独立要求 $P(AB)=P(A)P(B)>0$,矛盾。

**一句话记牢**:互斥是"你死我活",独立是"互不相干"。


# 6. 伯努利概型

> [!info] Def 4 n 重伯努利试验
> **$n$ 重伯努利试验**：在相同条件下将同一试验**独立重复** $n$ 次，每次试验只有两个结果 $A$ 与 $\bar A$，且每次 $P(A)=p$ 保持不变。

**二项概率公式**:$n$ 次试验中 $A$ 恰好发生 $k$ 次的概率为

$$
P_n(k)=\binom{n}{k}p^k(1-p)^{n-k},\qquad k=0,1,\dots,n
$$

**推导思路**:指定某 $k$ 次发生、其余 $n-k$ 次不发生,由独立性其概率为 $p^k(1-p)^{n-k}$;而"哪 $k$ 次发生"有 $\binom{n}{k}$ 种选法,各种情况互斥,故相加。

通信中的误码、器件的失效、信号的命中,都是典型的伯努利概型。


# 7. 例题

## 例 1(条件概率)

掷一枚骰子。设 $A=$"出现偶数点",$B=$"出现 2 点"。求 $P(B\mid A)$。

$P(A)=\frac{3}{6}=\frac{1}{2}$,$P(AB)=P(\{2\})=\frac{1}{6}$,故

$$
P(B\mid A)=\frac{1/6}{1/2}=\frac{1}{3}
$$

直观上:已知是偶数,样本空间缩为 $\{2,4,6\}$ 三个点,"是 2"占其中一个。

## 例 2(乘法公式:不放回抽样)

袋中有 5 个白球、3 个黑球,不放回地连取两次。求两次都取到白球的概率。

设 $A_i=$"第 $i$ 次取到白球"。

$$
P(A_1A_2)=P(A_1)P(A_2\mid A_1)=\frac{5}{8}\times\frac{4}{7}=\frac{5}{14}\approx 0.357
$$

## 例 3(全概率 + 贝叶斯:三条信道的误码)

某系统通过三条信道传输数据,占用比例分别为 $0.5$、$0.3$、$0.2$;三条信道的误码率分别为 $0.01$、$0.02$、$0.05$。记 $A_i=$"数据经第 $i$ 条信道",$B=$"出现误码"。

**(1) 求总误码率 $P(B)$**——全概率公式:

$$
P(B)=0.5\times0.01+0.3\times0.02+0.2\times0.05=0.005+0.006+0.010=0.021
$$

**(2) 已知出现了一个误码,求它来自第 3 条信道的概率**——贝叶斯公式:

$$
P(A_3\mid B)=\frac{P(A_3)P(B\mid A_3)}{P(B)}=\frac{0.2\times0.05}{0.021}=\frac{0.010}{0.021}\approx 0.476
$$

注意:第 3 条信道只承担了 $20\%$ 的流量,却贡献了 $47.6\%$ 的误码——这正是**后验概率把"占比"与"错误率"两重信息合成**的结果。

## 例 4(独立性:系统可靠性)

某系统由三个部件组成,每个部件正常工作的概率均为 $0.9$,且相互独立。求系统正常工作的概率。

**串联**(三者都必须正常):

$$
P=0.9^3=0.729
$$

**并联**(至少一个正常),用对立事件:

$$
P=1-P(\text{全坏})=1-0.1^3=0.999
$$

这个对比说明:**并联冗余**对可靠性的提升远大于单件质量的提升。

## 例 5(伯努利概型)

某链路误码率 $p=0.01$,传输 $100$ 个比特。求恰好出现 $2$ 位误码的概率。

$$
P_{100}(2)=\binom{100}{2}(0.01)^2(0.99)^{98}=4950\times10^{-4}\times0.99^{98}\approx 0.185
$$


> [!tip] 本章收官
> 本章的所有公式都由**条件概率**一条根长出来：
> 1. **条件概率**（1）：样本空间缩为 $A$，分母换成 $P(A)$。
> 2. **乘法公式**（2）：把定义式移项，得到"逐步发生"的计算法。
> 3. **全概率公式**（3）：按划分把 $B$ 拆成互斥路径之和——已知原因求结果。
> 4. **贝叶斯公式**（4）：全概率公式作分母，反推原因——先验变后验。
> 5. **独立性**（5）：$P(B\mid A)=P(B)$ 的特例；独立 ≠ 互斥。
> 6. **伯努利概型**（6）：独立重复 $n$ 次，得到二项概率公式，是第 3 章二项分布的来源。
>
> 一句话：**条件概率是根，乘法/全概率/贝叶斯是它的三种用法，独立性是它的特例。**

# 本章知识地图

```
条件概率 P(B|A) = P(AB)/P(A)
   │
   ├─ 移项 ──→ 乘法公式 P(AB) = P(A)P(B|A)
   │              │
   │              └─ 特例(与 A 无关)──→ 独立性 P(AB) = P(A)P(B)
   │                                        │
   │                                        └─ 应用 ──→ 伯努利概型 / 系统可靠性
   │
   └─ 按划分展开 ──→ 全概率公式 P(B) = Σ P(Aᵢ)P(B|Aᵢ)
                        │
                        └─ 反推原因 ──→ 贝叶斯公式 P(Aₖ|B) = P(Aₖ)P(B|Aₖ)/P(B)
```

**一句话串起来**:条件概率是这一章的根,乘法公式是它的移项,独立性是它的特例,全概率公式是它按划分的展开,贝叶斯公式是它的逆运算。

# 关联

- 上一章:[[vault-notes/math/probability/01-basic-concepts]]
- 下一章:随机变量及其分布