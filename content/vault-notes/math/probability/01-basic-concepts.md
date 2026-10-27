---
title: "概率论的基本概念"
tags:
- 数学
- 概率论
- 基本概念
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
> 本章把"随机现象"翻译成集合与函数，1–8 节逐层建立概率论的语言：
> - **1. 随机试验**：什么样的试验算"随机试验"？三条判据缺一不可。
> - **2. 样本空间与样本点**：把一次试验的所有可能结果装进集合 $\Omega$。
> - **3. 随机事件**：事件 = 样本空间的子集；"事件发生" = "结果落在子集里"。
> - **4. 事件的关系与运算**：包含、互斥、对立、并、交、差、德摩根律；互斥 vs 对立是高频易错点。
> - **5. 频率与概率**：频率的稳定性是概率的直观来源。
> - **6. 概率的公理化定义**：非负性、规范性、可列可加性三条公理。
> - **7. 概率的基本性质**：由公理推出的加法公式、减法公式、对立公式。
> - **8. 古典概型与几何概型**：数数（排列组合）与算面积（长度/体积）两大计算模型。
>
> 一句话主线：**事件是集合，概率是集合上的函数；三条公理把"频率的稳定性"抽象成可推导的数学对象，古典/几何概型则给出两个可算的具体模型。**

> [!note] 记号约定
> - $\Omega$：样本空间；$\omega$：样本点；$A,B,C$：事件（$\Omega$ 的子集）
> - $\varnothing$：不可能事件；$\Omega$：必然事件；$\bar A$：$A$ 的对立事件
> - $A+B$ / $A\cup B$：和事件；$AB$ / $A\cap B$：积事件；$A-B$：差事件
> - $P(A)$：事件 $A$ 的概率；条件概率 $P(A\mid B)$ 在第 2 章引入
> - 古典概型用排列组合计数；几何概型用长度/面积/体积度量
> - 本书"概率为 0"不等于"不可能"，"概率为 1"不等于"必然"（几何概型）

# 1. 随机试验

> [!info] Def 1 随机试验
> 满足以下三条的试验：

1. **可在相同条件下重复进行**
2. **每次试验的可能结果不止一个,且事先知道所有可能结果**
3. **每次试验前,无法确定哪一个结果会出现**

三个条件缺一不可,注意第 2 条最容易被忽略。

- 抛一枚硬币:满足,是随机试验
- 明天是否下雨:结果不确定,但**不可重复**,严格说不是随机试验(现实中仍用概率建模,属于推广)
- 已知初速度和角度算落点:结果唯一,不是随机试验

**关键点**:随机试验的"随机"指的是**结果对观察者不可预知**,不是"没有原因"。经典力学系统理论上可预测,只要初始条件有微小不确定,结果就不可预知——这正是概率论在工程中好用的原因。


# 2. 样本空间与样本点

> [!info] Def 2 样本空间与样本点
> **样本空间**（sample space）$\Omega$：随机试验 $E$ 的**所有可能结果**组成的集合。
> **样本点**（sample point）$\omega$：$\Omega$ 中的每一个元素，即一次试验的一个可能结果。

举例:

| 试验 | 样本空间 $\Omega$ |
| --- | --- |
| 掷一枚骰子 | $\{1,2,3,4,5,6\}$ |
| 抛两枚硬币 | $\{HH,HT,TH,TT\}$ |
| 记录电话呼叫次数 | $\{0,1,2,3,\dots\}$ |
| 记录某器件寿命 | $\{t \mid t\ge 0\}$ |

**几个必须注意的细节**:

- **样本空间的选取不唯一**,取决于你关心什么。掷骰子若只关心"是否出现 6",可以取 $\Omega=\{出现6,\ 不出现6\}$。选得合适能让后面计算大大简化。
- **必须互斥且完备**:每个样本点对应一种结果,任意两次试验结果不会同时属于两个样本点;所有样本点合起来覆盖一切可能。
- 分为**离散**($\Omega$ 有限或可列)与**连续**($\Omega$ 不可列)两类,这决定了后面用求和还是积分。


# 3. 随机事件

> [!info] Def 3 随机事件
> **随机事件**（random event）是样本空间 $\Omega$ 的**子集** $A$。当且仅当试验结果 $\omega\in A$ 时，称**事件 $A$ 发生**。

这一句是整个概率论的翻译词典:

> **"事件发生" = "试验结果落在对应的子集里"**

三个特殊事件:

- **必然事件**:$\Omega$ 本身。每次试验必发生。
- **不可能事件**:空集 $\varnothing$。永不发生。
- **基本事件**:只含一个样本点的集合 $\{\omega\}$。

注意必然/不可能事件已经**没有随机性**了,但为了运算方便,仍把它们当作事件处理。


# 4. 事件的关系与运算

因为事件就是集合,集合的一切运算都可以搬过来。

**关系**

| 记号 | 名称 | 含义 | 集合语言 |
| --- | --- | --- | --- |
| $A \subset B$ | 包含 | $A$ 发生则 $B$ 必发生 | 子集 |
| $A = B$ | 相等 | 互相包含 | 集合相等 |
| $AB = \varnothing$ | 互斥(互不相容) | 不能同时发生 | 不交 |
| $A\bar A = \varnothing$ 且 $A + \bar A = \Omega$ | 对立 | 必有一个发生 | 互补 |

**运算**

| 记号 | 名称 | 含义 | 集合语言 |
| --- | --- | --- | --- |
| $A + B$ / $A \cup B$ | 和事件 | $A$、$B$ 至少一个发生 | 并集 |
| $AB$ / $A \cap B$ | 积事件 | $A$、$B$ 同时发生 | 交集 |
| $A - B$ | 差事件 | $A$ 发生而 $B$ 不发生 | $A\bar B$ |
| $\bar A$ | 逆事件 | $A$ 不发生 | 补集 |

**运算律**(与集合论完全一致)

- 交换律:$A+B = B+A$,$AB = BA$
- 结合律:$(A+B)+C = A+(B+C)$
- 分配律:$(A+B)C = AC + BC$
- **德摩根律**:$\overline{A+B} = \bar A \bar B$,$\overline{AB} = \bar A + \bar B$

德摩根律值得单独记:"**至少一个发生**"的否定是"**全都不发生**";"**同时发生**"的否定是"**至少一个不发生**"。换一句话就是:**"和"与"积"在对立之下互换**。

**互斥 vs 对立**——最容易考混的一点:

- 互斥:$AB=\varnothing$,只是"不能同时发生"
- 对立:$AB=\varnothing$ **且** $A+B=\Omega$,还要求"必有一个发生"

所以**对立一定互斥,互斥不一定对立**。掷骰子中,"出现 1"与"出现 2"互斥但不对立;而"出现 1"与"不出现 1"既互斥又对立。多个事件也可以两两互斥,但不能多个事件同时对立。

## 文氏图:六种关系的直观对照

文氏图把**事件当作集合**来画:外框是样本空间 $\Omega$,每个圆圈是一个事件,圆内就是"该事件发生"的那些样本点。下图把六种关系并列摆开——特别注意 (b) 互斥 与 (c) 对立 的差别,以及 (d)(e)(f) 中**着色区域**的不同。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 440" width="100%" style="max-width:820px" font-family="inherit">
  <defs>
    <mask id="pv-m-union" maskUnits="userSpaceOnUse" x="0" y="0" width="820" height="440">
      <circle cx="110" cy="320" r="46" fill="#ffffff"/>
      <circle cx="170" cy="320" r="46" fill="#ffffff"/>
    </mask>
    <clipPath id="pv-c-a5" clipPathUnits="userSpaceOnUse">
      <circle cx="375" cy="320" r="46"/>
    </clipPath>
    <mask id="pv-m-diff" maskUnits="userSpaceOnUse" x="0" y="0" width="820" height="440">
      <circle cx="640" cy="320" r="46" fill="#ffffff"/>
      <circle cx="700" cy="320" r="46" fill="#000000"/>
    </mask>
  </defs>

  <!-- ==================== 第一行 ==================== -->

  <!-- (a) 包含 -->
  <g>
    <text x="140" y="20" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">包含 A ⊂ B</text>
    <rect x="40" y="34" width="200" height="142" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <text x="232" y="50" text-anchor="end" font-size="11" font-style="italic" fill="var(--text-faint,#8b949e)">Ω</text>
    <circle cx="140" cy="105" r="54" fill="#ec4899" fill-opacity="0.16" stroke="#db2777" stroke-width="1.8"/>
    <circle cx="134" cy="111" r="31" fill="#6366f1" fill-opacity="0.32" stroke="#4f46e5" stroke-width="1.8"/>
    <text x="168" y="72" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">B</text>
    <text x="134" y="115" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
    <text x="140" y="198" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">A 发生则 B 必发生</text>
  </g>

  <!-- (b) 互斥 -->
  <g>
    <text x="405" y="20" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">互斥 AB = ∅</text>
    <rect x="305" y="34" width="200" height="142" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <text x="497" y="50" text-anchor="end" font-size="11" font-style="italic" fill="var(--text-faint,#8b949e)">Ω</text>
    <circle cx="362" cy="105" r="42" fill="#6366f1" fill-opacity="0.32" stroke="#4f46e5" stroke-width="1.8"/>
    <circle cx="448" cy="105" r="42" fill="#ec4899" fill-opacity="0.30" stroke="#db2777" stroke-width="1.8"/>
    <text x="362" y="109" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
    <text x="448" y="109" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">B</text>
    <text x="405" y="198" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">不能同时发生,但可以都不发生</text>
  </g>

  <!-- (c) 对立 -->
  <g>
    <text x="670" y="20" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">对立 A + Ā = Ω</text>
    <rect x="570" y="34" width="200" height="142" rx="5" fill="#f59e0b" fill-opacity="0.18" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <text x="762" y="50" text-anchor="end" font-size="11" font-style="italic" fill="var(--text-faint,#8b949e)">Ω</text>
    <circle cx="640" cy="105" r="46" fill="#6366f1" fill-opacity="0.42" stroke="#4f46e5" stroke-width="1.8"/>
    <text x="640" y="109" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
    <text x="728" y="109" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">Ā</text>
    <text x="670" y="198" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">必有一个发生,且只发生一个</text>
  </g>

  <!-- ==================== 第二行 ==================== -->

  <!-- (d) 和事件 -->
  <g>
    <text x="140" y="235" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">和事件 A ∪ B</text>
    <rect x="40" y="249" width="200" height="142" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <text x="232" y="265" text-anchor="end" font-size="11" font-style="italic" fill="var(--text-faint,#8b949e)">Ω</text>
    <rect x="40" y="249" width="200" height="142" fill="#8b5cf6" fill-opacity="0.34" mask="url(#pv-m-union)"/>
    <circle cx="110" cy="320" r="46" fill="none" stroke="#4f46e5" stroke-width="1.8"/>
    <circle cx="170" cy="320" r="46" fill="none" stroke="#db2777" stroke-width="1.8"/>
    <text x="92" y="324" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
    <text x="188" y="324" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">B</text>
    <text x="140" y="413" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">至少一个发生(着色=并集)</text>
  </g>

  <!-- (e) 积事件 -->
  <g>
    <text x="405" y="235" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">积事件 AB</text>
    <rect x="305" y="249" width="200" height="142" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <text x="497" y="265" text-anchor="end" font-size="11" font-style="italic" fill="var(--text-faint,#8b949e)">Ω</text>
    <circle cx="375" cy="320" r="46" fill="none" stroke="#4f46e5" stroke-width="1.8"/>
    <circle cx="435" cy="320" r="46" fill="none" stroke="#db2777" stroke-width="1.8"/>
    <circle cx="435" cy="320" r="46" fill="#a855f7" fill-opacity="0.55" clip-path="url(#pv-c-a5)"/>
    <text x="357" y="324" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
    <text x="453" y="324" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">B</text>
    <text x="405" y="413" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">两个同时发生(着色=交集)</text>
  </g>

  <!-- (f) 差事件 -->
  <g>
    <text x="670" y="235" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--text-normal,#1f2328)">差事件 A − B</text>
    <rect x="570" y="249" width="200" height="142" rx="5" fill="var(--background-secondary,#f6f7f9)" stroke="var(--background-modifier-border,#d0d7de)" stroke-dasharray="5 4"/>
    <text x="762" y="265" text-anchor="end" font-size="11" font-style="italic" fill="var(--text-faint,#8b949e)">Ω</text>
    <rect x="570" y="249" width="200" height="142" fill="#6366f1" fill-opacity="0.42" mask="url(#pv-m-diff)"/>
    <circle cx="640" cy="320" r="46" fill="none" stroke="#4f46e5" stroke-width="1.8"/>
    <circle cx="700" cy="320" r="46" fill="none" stroke="#db2777" stroke-width="1.8"/>
    <text x="622" y="324" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">A</text>
    <text x="718" y="324" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">B</text>
    <text x="670" y="413" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">A 发生而 B 不发生</text>
  </g>
</svg>

**逐格对照**

| 图 | 关系 | 记号 | 集合含义 | 关键判据 |
| --- | --- | --- | --- | --- |
| (a) | 包含 | $A \subset B$ | $A$ 的每个样本点都在 $B$ 里 | $A$ 发生 $\Rightarrow$ $B$ 发生 |
| (b) | 互斥 | $AB = \varnothing$ | 两圆不交 | 不能同时发生,**但可以都不发生** |
| (c) | 对立 | $A + \bar A = \Omega$ | 两区域拼满 $\Omega$ 且不重叠 | 必有一个发生,且只发生一个 |
| (d) | 和事件 | $A \cup B$ | 两圆的并集 | 至少一个发生 |
| (e) | 积事件 | $AB$ | 两圆的交集(透镜形) | 两个同时发生 |
| (f) | 差事件 | $A - B$ | 圆 $A$ 挖掉 $B$ 后的月牙 | $A$ 发生而 $B$ 不发生 |

**再强调一次 (b) 与 (c) 的区别**:两者画出来都是"分开的两块",但互斥的两块**外面还留着 Ω 的空白**(可能两个都不发生);对立的两块**把 Ω 填满了**,没有第三种可能。

## 用图推公式

对着上图看,后面几节的公式几乎是"看图说话":

- **加法公式** $P(A\cup B)=P(A)+P(B)-P(AB)$:(d) 的着色面积 = (a) 的圆 + (b) 的圆,但交集被数了两遍,所以减掉 (e)。
- **减法公式** $P(A-B)=P(A)-P(AB)$:(f) 的月牙 = 圆 $A$ 挖掉 (e) 的透镜。
- **对立事件公式** $P(\bar A)=1-P(A)$:(c) 中两块面积之和是整个 Ω,即 1。
- **德摩根律** $\overline{A\cup B}=\bar A\bar B$:(d) 的着色区之外,正是"两个圆外面"的公共部分。

> [!tip] 渲染说明
> 上面这张图是**内联 SVG**,直接写在笔记里,阅读视图和实时预览下都能正常显示,文字颜色会自动跟随主题(AnuPpuccin 的浅色/深色模式都适配)。

> [!note] 为什么不用 Mermaid
> Obsidian 1.9+ 内置的 Mermaid v11 虽然支持 `venn-beta`,但它**只能画"若干圆 + 交集"这一种形态**,表达不了包含、互斥、对立和差事件,而且圆的面积会随数值缩放。所以这里用 SVG 画六宫格。若只想要"样本点计数"的简单示意图,Mermaid 写法是:
> ````
> ```mermaid
> venn-beta
>     title A 与 B 的样本点分布
>     "A": 30
>     "B": 25
>     "A ∩ B": 10
> ```
> ````


# 5. 频率与概率

在给出公理化定义之前,先看**频率**。

做 $n$ 次试验,事件 $A$ 发生 $n_A$ 次,称

$$f_n(A) = \frac{n_A}{n}$$

为 $A$ 在这 $n$ 次试验中出现的**频率**。

频率有三条性质:$0\le f_n(A)\le 1$;$f_n(\Omega)=1$;若 $A,B$ 互斥则 $f_n(A+B)=f_n(A)+f_n(B)$。

**稳定性**:大量重复试验中,$f_n(A)$ 会稳定地在某个常数附近摆动。这个稳定值就是**概率** $P(A)$ 的客观基础,即**频率的稳定值**是概率的直观解释(统计定义)。

但"稳定""大量"都不够严谨,所以现代概率论用公理化定义。


# 6. 概率的公理化定义

> [!info] Def 4 概率
> 设 $E$ 的样本空间为 $\Omega$，对每个事件 $A$ 赋予实数 $P(A)$，若满足以下三条公理，则称 $P(A)$ 为事件 $A$ 的**概率**（probability）：

1. **非负性**:$P(A) \ge 0$
2. **规范性**:$P(\Omega) = 1$
3. **可列可加性**:若 $A_1, A_2, \dots$ 两两互斥,则
   $$P\left(\bigcup_{i=1}^{\infty} A_i\right) = \sum_{i=1}^{\infty} P(A_i)$$

则称 $P(A)$ 为事件 $A$ 的**概率**,$( \Omega, \mathcal{F}, P )$ 称为**概率空间**。

**为什么这样定义?** 因为它把频率的三条性质抽象出来,只保留必要的部分,从而可以脱离"做试验"来推导一切结论。这就像欧几里得几何的公理——不问你"点是什么",只规定点与点之间满足什么关系。


# 7. 概率的基本性质

这几条都是从上面三条推出来的,必须熟记:

1. $P(\varnothing) = 0$
2. **有限可加性**:$A_1,\dots,A_n$ 两两互斥时,$P\left(\sum_{i=1}^{n}A_i\right) = \sum_{i=1}^{n}P(A_i)$
3. $P(A) = 1 - P(\bar A)$,从而 $0 \le P(A) \le 1$
4. 若 $B \subset A$,则 $P(A-B) = P(A) - P(B)$ 且 $P(B) \le P(A)$
5. $P(A+B) = P(A) + P(B) - P(AB)$

第 4 条有个常见反例警示:$P(B) \le P(A)$ 是 $B\subset A$ 的**必要条件**,不是充分条件——$P(B)$ 小并不说明 $B$ 被 $A$ 包含。


# 8. 古典概型与几何概型

公理化定义太抽象,实际计算靠两类具体模型。

> [!info] Def 5 古典概型
> **古典概型**（等可能概型）满足：

- 样本空间**有限**:$\Omega = \{\omega_1,\dots,\omega_n\}$
- 每个样本点**等可能**:$P(\omega_1) = \dots = P(\omega_n)$

此时

$$P(A) = \frac{A \text{ 包含的样本点数}}{\Omega \text{ 中样本点总数}} = \frac{k}{n}$$

由非负性 + 规范性 + 有限可加性立即推出。计算就变成**数数**,主力工具是排列组合。

> [!info] Def 6 几何概型
> **几何概型**：$\Omega$ 是一个可度量的区域（长度、面积、体积），样本点等可能地落在其中，则

$$P(A) = \frac{A \text{ 的度量}}{\Omega \text{ 的度量}}$$

例如在 $[0,1]$ 上随机取一点,落在 $[0, 0.3]$ 的概率是 $0.3$。

**注意**:几何概型下单个样本点的概率为 0,但并非不可能事件。这说明 **"概率为 0" 不等于 "不可能"**,"概率为 1" 也不等于 "必然"。这是与古典概型最大的区别。


> [!tip] 本章收官
> 第 1 章把整门课的地基铺好：
> 1. **随机试验**（1）给出研究对象；**样本空间**（2）把结果集合化；**事件**（3）就是样本空间的子集。
> 2. **事件的关系与运算**（4）把集合论整套搬过来，德摩根律是"和/积互换"的钥匙。
> 3. **频率**（5）给出概率的直观来源；**公理化定义**（6）用三条公理把它抽象成可推导的对象。
> 4. **基本性质**（7）是从公理推出的全部常用公式；**古典/几何概型**（8）是两个可算的具体模型。
>
> 一句话：**事件是集合，概率是集合上的函数；后面条件概率、独立性、随机变量，都只是在这上面继续加结构。**

# 本章知识地图

```
随机试验 E
   ↓ 所有可能结果
样本空间 Ω ──子集──→ 事件 A
   ↓ 赋一个数
概率 P(A)
   ↓ 满足三条公理
公理化定义 ──推出──→ 加减乘除各公式
   ↓ 具体模型
古典概型(数数) / 几何概型(算面积)
```

理解这条链,第一章就不会散。**事件是集合,概率是集合上的函数**——记住这一句,后面条件概率、独立性、随机变量都只是在这上面加结构。

# 关联

- 上一章:（本章为开篇）
- 下一章:[[vault-notes/math/probability/02-conditional-probability-independence]]

**通信方向应用**：

- [[vault-notes/communication/01-introduction]] —— 信息量 $I=\log_2\frac{1}{P(x)}$ 与信源熵 $H=-\sum P_i\log_2 P_i$，就是"概率的度量"的直接应用：**消息概率越小，信息量越大**
- [[vault-notes/communication/03-random-processes]] —— 概率论是通信噪声分析的数学前置（随机变量 → 随机过程）


