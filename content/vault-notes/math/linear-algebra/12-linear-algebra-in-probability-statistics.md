---
title: "概率统计中的线性代数"
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
> 概率论和线性代数是通信的两条腿——信号是随机的，而处理是线性的。这一章展示它们如何咬合：
>
> - **1. 均值、方差与概率**：期望是**线性泛函**；方差 = 围绕均值的二阶矩（**最小二乘的祖宗**）；正态分布与**中心极限定理**（高斯噪声从哪来）
> - **2. 协方差矩阵与联合概率**：$V=E[(\mathbf{x}-\boldsymbol\mu)(\mathbf{x}-\boldsymbol\mu)^{T}]$ 是**对称半正定**矩阵；线性变换下的传播律 $AV A^{T}$；特征分解 = **主轴**（PCA 的老家）
> - **3. 多维高斯与加权最小二乘**：多维高斯的密度里同时出现 $\det V$ 与 $V^{-1}$；等概率面是**椭球**；**加权最小二乘** $A^{T}WA\hat{\mathbf{x}}=A^{T}W\mathbf{b}$ 与 **Gauss–Markov** 最优性
>
> 一句话主线：**概率论给出"信号长什么样"，线性代数给出"怎么处理它"；两者交汇处就是"协方差矩阵"和"加权最小二乘"——通信里最常用的两块砖。**

> [!note] 记号约定
> - $E[X]$：**期望**（均值）；$\operatorname{Var}(X)$：**方差**；$\sigma$：标准差
> - $p(x)$：**概率密度**（pdf）；$P(k)$：离散概率
> - $\mathbf{x}$：随机向量；$\boldsymbol\mu=E[\mathbf{x}]$：均值向量；$V=\operatorname{Cov}(\mathbf{x})$：**协方差矩阵**
> - $W$：加权矩阵（先验/精度）；$A^{T}WA$：**加权正规方程**的矩阵
> - 沿用前面：$\mathbf{C}(A)$、$\lambda$、$\sigma_i$、$\operatorname{cond}(A)$

# 1. 均值，方差与概率

> [!info] Def 1 期望（均值）
> **期望**（expectation，也叫均值 mean）：
> 离散情形：$E[X]=\sum_i p_ix_i$（$p_i$ 是取 $x_i$ 的概率）；连续情形：$E[X]=\int x\,p(x)\,\mathrm{d}x$。
> **最重要的性质是它"线性"**：
> $$
> E[cX+dY]=c\,E[X]+d\,E[Y]\qquad\text{（永远成立，不要求独立！）}
> $$

> [!tip] 换个说法：期望是一个"线性泛函"
> 把随机变量看成向量空间里的元素，那么
> $$
> E:\ \{\text{随机变量}\}\ \longrightarrow\ \mathbb{R}\quad\text{是一个线性映射}
> $$
> ——这正是第 8 章的"线性变换"（只不过陪域是一维）。所以"期望可以逐项算、可以和系数交换"这些操作，**不是巧合，而是线性的定义** ✓
> 与之对照：方差**不是**线性的（见下），协方差是**双线性**的（对两个变量分别线性）✓

## 方差（围绕均值）

> [!info] Def 2 方差
> **方差**（variance）：
> $$
> \operatorname{Var}(X)=E\bigl[(X-\mu)^{2}\bigr]=E[X^{2}]-\mu^{2},\qquad \sigma=\sqrt{\operatorname{Var}(X)}
> $$
> 读法：**"到均值的平均平方距离"**——它就是"围绕中心散得有多开"。

两条常用性质：

$$
\operatorname{Var}(cX)=c^{2}\operatorname{Var}(X)\quad(\text{系数要平方}),\qquad
\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y)+2\operatorname{Cov}(X,Y)
$$

（第二条说明：**只有不相关时方差才相加**——这正是第 2 节协方差的用处。）

> [!note] 通信方向：方差就是功率
> 对**零均值**信号（通信信号几乎总是零均值），
> $$
> E[X^{2}]=\operatorname{Var}(X)=\text{平均功率}
> $$
> 于是：**信噪比 = 信号方差 / 噪声方差**（SNR $=\sigma_s^{2}/\sigma_n^{2}$），而"噪声功率"这个词在数学上就是"噪声的方差" ✓ 这也解释了为什么通信里的高斯白噪声模型只用一个参数 $\sigma^{2}$（或 $N_0$）就能刻划：**它的均值为 0、方差就是功率**。

## 连续性概率分布

> [!info] Def 3 概率密度
> **概率密度**（probability density，简称 pdf）：
> $p(x)\ge0$ 且 $\displaystyle\int_{-\infty}^{\infty}p(x)\,\mathrm{d}x=1$；区间概率为 $\displaystyle P(a\le X\le b)=\int_a^{b}p(x)\,\mathrm{d}x$。

**例（均匀分布 $U[0,1]$，uniform distribution）**：$p(x)=1\ (0\le x\le1)$

$$
E[X]=\int_0^{1}x\,\mathrm{d}x=\frac12,\qquad
\operatorname{Var}(X)=\int_0^{1}\Bigl(x-\frac12\Bigr)^{2}\mathrm{d}x=\frac1{12}\approx0.0833\ \checkmark
$$

（数值积分验证：$E=0.500$、$\operatorname{Var}=0.08333$ ✓）

**通信里的两个老朋友**：**量化误差**常建模为 $U[-q/2,q/2]$（方差 $q^{2}/12$——**这个 $1/12$ 就来自上面**）；**相位均匀分布**建模未同步的载波相位 ✓

## p(x)的均值与方差

$$
E[X]=\int x\,p(x)\,\mathrm{d}x,\qquad
\operatorname{Var}(X)=\int(x-\mu)^{2}p(x)\,\mathrm{d}x
$$

> [!tip] 一条漂亮的连接：**均值 = 最小均方意义下的最优常数**
> 若要用一个常数 $c$ 去"代表"随机变量 $X$（使均方误差最小）：
> $$
> \min_c\ E\bigl[(X-c)^{2}\bigr]\qquad\Longrightarrow\qquad \frac{\mathrm{d}}{\mathrm{d}c}E[(X-c)^{2}]=-2E[X-c]=0\qquad\Longrightarrow\qquad c=E[X]\ \checkmark
> $$
> **"均值是最优的常数逼近"**——这就是第 4 章最小二乘的随机版本：把"用常数拟合常数"换成"用直线/平面拟合数据"，得到的就是最小二乘 ✓
> 更一般地：**给定观测，用均方误差最小化求的估计，就是"条件期望"**——这是通信里一切都从它出发（MMSE 估计）。

## 正态分布：钟形曲线

> [!info] Def 4 正态分布（高斯分布）
> **正态分布**（normal distribution，也叫高斯分布 Gaussian distribution）：
> $$
> p(x)=\frac{1}{\sqrt{2\pi\sigma^{2}}}\ \exp\left(-\frac{(x-\mu)^{2}}{2\sigma^{2}}\right)
> $$
> 记作 $X\sim N(\mu,\sigma^{2})$。**两个参数就说完了一切**：$\mu$ 决定中心，$\sigma$ 决定胖瘦 ✓

**"68–95–99.7" 规则**（数值积分验证）：

| 区间 | 概率 |
| --- | --- |
| $\mu\pm\sigma$ | **0.6827** |
| $\mu\pm2\sigma$ | **0.9545** |
| $\mu\pm3\sigma$ | **0.9973** |

> [!note] 通信方向：为什么噪声是高斯的
> 热噪声 = **极大量独立微小扰动之和** ⇒ 由中心极限定理（下一小节）它就是高斯的。于是有了**AWGN 信道**（加性高斯白噪声）这个几乎一切通信理论的起点：
> - **高斯性**让"最大似然检测 = 最小欧氏距离检测"（因为 $e^{-d^{2}}$ 单调）✓
> - **白**（各样本不相关）让协方差矩阵退化成 $\sigma^{2}I$（第 2 节），数学上极其方便；
> - 通信里"噪声功率谱密度 $N_0/2$"里的 $1/2$ 就是双边谱的记账方式 ✓

## N次抛硬币以及N->∞

抛 $N$ 次均匀硬币，正面次数 $k$ 服从**二项分布**：

$$
P(k)=\frac{\binom{N}{k}}{2^{N}},\qquad E[k]=\frac N2,\qquad \operatorname{Var}(k)=\frac N4
$$

**验证**（数值计算，三种 $N$）：

| $N$ | $E[k]$ | $N/2$ | $\operatorname{Var}(k)$ | $N/4$ |
| --- | --- | --- | --- | --- |
| 10 | 5.000 | 5 | 2.500 | 2.5 |
| 100 | 50.000 | 50 | 25.000 | 25 |
| 1000 | 500.000 | 500 | 250.000 | 250 |

**"越像正态"**的证据（标准化后 $Z=(k-N/2)/\sqrt{N/4}$ 的矩）：

| $N$ | 偏度（→ 0） | 峰度（→ 3） |
| --- | --- | --- |
| 10 | 0.0000 | 2.8000 |
| 100 | 0.0000 | **2.9800** |

（峰度的正态值是 3：$N=100$ 时已经非常接近 ✓）

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 320" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la12-ax" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <!-- 面板1: N=10 -->
  <text x="270" y="42" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">N = 10 次抛硬币（二项分布）</text>
  <line x1="110" y1="240" x2="440" y2="240" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la12-ax)"/>
  <g fill="#4f46e5" fill-opacity="0.55">
    <rect x="120" y="240" width="22" height="0"/><rect x="150" y="236" width="22" height="4"/>
    <rect x="180" y="223" width="22" height="17"/><rect x="210" y="195" width="22" height="45"/>
    <rect x="240" y="162" width="22" height="78"/><rect x="270" y="146" width="22" height="94"/>
    <rect x="300" y="162" width="22" height="78"/><rect x="330" y="195" width="22" height="45"/>
    <rect x="360" y="223" width="22" height="17"/><rect x="390" y="236" width="22" height="4"/>
    <rect x="420" y="240" width="22" height="0"/>
  </g>
  <path d="M105,240 119,239 132,239 146,237 160,233 174,228 188,219 201,206 215,191 229,174 242,159 256,148 270,144 284,148 298,159 311,174 325,191 339,206 352,219 366,228 380,233 394,237 407,239 421,239 435,240" fill="none" stroke="#dc2626" stroke-width="2"/>
  <text x="278" y="136" font-size="11" fill="#dc2626">正态曲线 N(5, 2.5)</text>
  <g font-size="10.5" fill="var(--text-faint,#8b949e)" text-anchor="middle">
    <text x="131" y="256">0</text><text x="271" y="256">5</text><text x="431" y="256">10</text>
  </g>
  <text x="270" y="284" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">柱形还看得见"阶梯"；峰度 2.80（正态是 3）</text>

  <!-- 面板2: N=100 -->
  <text x="670" y="42" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">N = 100 次抛硬币</text>
  <line x1="530" y1="240" x2="820" y2="240" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la12-ax)"/>
  <g fill="#4f46e5" fill-opacity="0.55">
    <rect x="550" y="227" width="10" height="13"/><rect x="562" y="220" width="10" height="20"/>
    <rect x="574" y="212" width="10" height="28"/><rect x="586" y="203" width="10" height="37"/>
    <rect x="598" y="192" width="10" height="48"/><rect x="610" y="180" width="10" height="60"/>
    <rect x="622" y="168" width="10" height="72"/><rect x="634" y="157" width="10" height="83"/>
    <rect x="646" y="149" width="10" height="91"/><rect x="658" y="143" width="10" height="97"/>
    <rect x="670" y="141" width="10" height="99"/><rect x="682" y="143" width="10" height="97"/>
    <rect x="694" y="149" width="10" height="91"/><rect x="706" y="157" width="10" height="83"/>
    <rect x="718" y="168" width="10" height="72"/><rect x="730" y="180" width="10" height="60"/>
    <rect x="742" y="192" width="10" height="48"/><rect x="754" y="203" width="10" height="37"/>
    <rect x="766" y="212" width="10" height="28"/><rect x="778" y="220" width="10" height="20"/>
    <rect x="790" y="227" width="10" height="13"/>
  </g>
  <path d="M532,233 544,229 555,224 566,218 578,209 590,200 601,189 612,177 624,166 636,156 647,148 658,143 670,141 682,143 693,148 704,156 716,166 728,177 739,189 750,200 762,209 774,218 785,224 796,229 808,233" fill="none" stroke="#dc2626" stroke-width="2"/>
  <text x="700" y="130" font-size="11" fill="#dc2626">正态曲线 N(50, 25)</text>
  <g font-size="10.5" fill="var(--text-faint,#8b949e)" text-anchor="middle">
    <text x="555" y="256">40</text><text x="675" y="256">50</text><text x="795" y="256">60</text>
  </g>
  <text x="670" y="284" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">柱形几乎贴合曲线；峰度 2.98 ✓</text>

  <text x="420" y="310" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">中心极限定理：大量独立同分布随机变量之和 → 正态（与每一项原来的分布几乎无关）</text>
</svg>

> [!tip] 定理 中心极限定理
> **中心极限定理**（central limit theorem，简称 CLT）：若 $X_1,X_2,\dots$ 独立同分布，均值 $\mu$、方差 $\sigma^{2}$，则
> $$
> \frac{X_1+X_2+\cdots+X_N-N\mu}{\sigma\sqrt N}\ \xrightarrow{\ N\to\infty\ }\ N(0,1)
> $$
> ——**不管原来的分布是什么**，和都会趋于正态 ✓（抛硬币的例子：$N=100$ 时峰度 2.98、偏度 0，已和正态几乎无法区分）

> [!tip] CLT 的线性代数读法
> "求和"是最简单的线性组合：$S_N=\mathbf{1}^{T}\mathbf{X}$（$\mathbf{1}=(1,\dots,1)^{T}$、$\mathbf{X}=(X_1,\dots,X_N)^{T}$）✓ 于是
> $$
> E[S_N]=\mathbf{1}^{T}\boldsymbol\mu,\qquad \operatorname{Var}(S_N)=\mathbf{1}^{T}V\mathbf{1}
> $$
> ——**"随机向量的线性组合的均值与方差"正是第 2 节要建立的那套公式** ✓ CLT 说的则是：当 $N$ 很大时，这个线性组合的**分布形状**趋于高斯。
> 几何直觉（Poincaré）：高维空间里"角落"几乎不存在，概率质量集中在一层薄球壳上——这就是为什么"和"的分布会稳定到同一个形状 ✓

# 2. 协方差矩阵与联合概率

> [!info] Def 5 协方差与相关系数
> **协方差**（covariance）：
> $$
> \operatorname{Cov}(X,Y)=E\bigl[(X-\mu_X)(Y-\mu_Y)\bigr]=E[XY]-\mu_X\mu_Y
> $$
> $\rho$ 是**相关系数**（correlation coefficient）：
> $$
> \rho=\frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}\in[-1,1]\qquad\text{（标准化后的协方差）}
> $$
> - $\operatorname{Cov}=0$ 称**不相关**；
> - **独立 ⟹ 不相关**（因为 $E[XY]=E[X]E[Y]$），但**反之不成立**（不相关 ≠ 独立，除非是高斯！）✓

> [!info] Def 6 协方差矩阵
> 对随机向量 $\mathbf{x}=(x_1,\dots,x_n)^{T}$：
> $$
> V=\operatorname{Cov}(\mathbf{x})=E\bigl[(\mathbf{x}-\boldsymbol\mu)(\mathbf{x}-\boldsymbol\mu)^{T}\bigr]
> $$
> - 对角元 $V_{ii}=\operatorname{Var}(x_i)$；非对角元 $V_{ij}=\operatorname{Cov}(x_i,x_j)$；
> - **$V$ 一定对称**（$V_{ij}=V_{ji}$）；
> - **$V$ 一定半正定**（positive semidefinite）：对任意 $\mathbf{a}$，
>   $$
>   \mathbf{a}^{T}V\mathbf{a}=E\bigl[(\mathbf{a}^{T}(\mathbf{x}-\boldsymbol\mu))^{2}\bigr]\ge0\ \checkmark
>   $$
> - **$V$ 正定 $\iff$ 各分量之间不存在"完全相关的组合"**（没有 $\mathbf{a}\ne\mathbf{0}$ 使 $\mathbf{a}^{T}\mathbf{x}$ 恒为常数）✓

**对称半正定**——第 6 章、第 7 章的一切结论立刻可以搬过来：

> [!tip] 定理 协方差矩阵的谱分解（= PCA 的老家）
> $$
> V=Q\Lambda Q^{T}\qquad(\Lambda=\operatorname{diag}(\lambda_1,\dots,\lambda_n),\ \lambda_i\ge0,\ Q\ \text{正交})
> $$
> - **特征向量 $\mathbf{q}_i$ = 主方向**（各分量"共同变化"的方向）；
> - **特征值 $\lambda_i$ = 该方向上的方差**；
> - **总方差** $=\operatorname{tr}(V)=\sum\lambda_i$（第 6 章的迹定理）✓
> 这正是第 7.3 节的**主成分分析**：把数据投影到 $\mathbf{q}_i$ 上，方差就按 $\lambda_i$ 排序 ✓

**数值例**（二维）：

$$
V=\begin{bmatrix}4&2\\2&3\end{bmatrix}\ \text{（对称 ✓，特征值 }1.438,\ 5.562>0\ \Rightarrow\ \text{正定 ✓）}
$$

主方向是 $V$ 的特征向量（由 $\lambda$ 大小决定哪个方向"散得最开"）✓

**线性变换下的传播律**（★ 工程上叫"误差传播"）：

> [!tip] 定理 线性变换的均值与协方差
> 若 $\mathbf{y}=A\mathbf{x}$（$A$ 是**确定性**矩阵，$\mathbf{x}$ 随机），则
> $$
> E[\mathbf{y}]=A\boldsymbol\mu,\qquad \operatorname{Cov}(\mathbf{y})=A\,V\,A^{T}
> $$
> 一行证明：$E[(A\mathbf{x}-A\boldsymbol\mu)(A\mathbf{x}-A\boldsymbol\mu)^{T}]=A\,E[(\mathbf{x}-\boldsymbol\mu)(\mathbf{x}-\boldsymbol\mu)^{T}]A^{T}$ ✓
> **特例**（最常用）：标量 $y=\mathbf{a}^{T}\mathbf{x}$ 的方差 $=\mathbf{a}^{T}V\mathbf{a}$ ✓
> **实测**：$V=\begin{bmatrix}4&2\\2&3\end{bmatrix}$、$A=\begin{bmatrix}1&0\\1&1\end{bmatrix}$ ⇒ $AVA^{T}=\begin{bmatrix}4&6\\6&11\end{bmatrix}$ ✓

> [!tip] 白化：把"椭圆"掰成"圆"
> **白化**（whitening）：令
> $$
> \mathbf{z}=\Lambda^{-1/2}Q^{T}(\mathbf{x}-\boldsymbol\mu)\qquad\Longrightarrow\qquad \operatorname{Cov}(\mathbf{z})=I
> $$
> （因为 $\Lambda^{-1/2}Q^{T}\,V\,Q\Lambda^{-1/2}=\Lambda^{-1/2}\Lambda\Lambda^{-1/2}=I$ ✓ 实测验证 ✓）
> **意义**：白化后的各分量**方差都是 1、彼此不相关**——"有色噪声"变成了"白噪声"。通信里的**白化滤波器**、MIMO 的**空间白化**、检测器的**预处理**都是这一步 ✓

> [!note] 通信方向：协方差矩阵是"信道的指纹"
> - **接收信号的自相关/协方差矩阵** $R=E[\mathbf{y}\mathbf{y}^{H}]$ 是**埃尔米特半正定**（第 9 章）：其特征值 = 各"特征波束"的功率，特征向量 = 波束方向 ✓
> - **MMSE 检测**：$\hat{\mathbf{x}}=(H^{H}V_n^{-1}H+V_x^{-1})^{-1}H^{H}V_n^{-1}\mathbf{y}$——**到处是协方差矩阵的逆** ✓（下一节详述）
> - **谱感知/DOA**：信号协方差矩阵的特征分解能把"信号子空间"与"噪声子空间"分开（MUSIC，第 7 章）✓
> - **噪声是否"白"**：$V_n=\sigma^{2}I$ ⇒ 白；否则要先白化再检测 ✓

# 3. 多维高斯分布与加权最小二乘法

> [!info] Def 7 多维高斯分布
> **$n$ 维高斯分布**（multivariate Gaussian，也叫多维正态）：
> $$
> p(\mathbf{x})=\frac{1}{(2\pi)^{n/2}\,(\det V)^{1/2}}\ \exp\left(-\frac12(\mathbf{x}-\boldsymbol\mu)^{T}V^{-1}(\mathbf{x}-\boldsymbol\mu)\right)
> $$
> 记作 $\mathbf{x}\sim N(\boldsymbol\mu,V)$。
> **注意密度里同时出现了两样东西**：$\det V$（第 5 章的行列式——它保证积分等于 1，是"体积"的归一化因子）和 $V^{-1}$（第 4 章的逆矩阵）✓
> **验证**：对 $\mu=0$、$V=\begin{bmatrix}1&0.8\\0.8&1\end{bmatrix}$（$\det V=0.36$）做二重数值积分，$\int\int p=0.9999$ ✓

> [!tip] 定理 等概率面是椭球（第 6.5 节的椭圆回来了）
> 由 $V=Q\Lambda Q^{T}$，令 $\mathbf{y}=Q^{T}(\mathbf{x}-\boldsymbol\mu)$：
> $$
> (\mathbf{x}-\boldsymbol\mu)^{T}V^{-1}(\mathbf{x}-\boldsymbol\mu)=\frac{y_1^{2}}{\lambda_1}+\frac{y_2^{2}}{\lambda_2}+\cdots+\frac{y_n^{2}}{\lambda_n}
> $$
> 所以 $p(\mathbf{x})=$ 常数的曲面是**椭球**：
> $$
> \text{半轴方向}=\text{特征向量 }\mathbf{q}_i;\qquad \text{半轴长}\propto\sqrt{\lambda_i}
> $$
> **方差大的方向，椭球轴长**——这正是"噪声椭圆"的样子 ✓（第 6.5 节的椭圆、第 7.3 节 PCA 的散点椭圆，都是它）

**数值例**（$\rho=0.8$ 的二维高斯）：$V=\begin{bmatrix}1&0.8\\0.8&1\end{bmatrix}$，特征值 $0.2$ 与 $1.8$，特征向量 $(1,-1)/\sqrt2$ 与 $(1,1)/\sqrt2$ ⇒ **等高线是沿 $(1,1)$ 拉长的倾斜椭圆**（长轴 : 短轴 $=\sqrt{1.8}:\sqrt{0.2}=3:1$）✓

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 320" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la12-ax2" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
    <marker id="la12-maj" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la12-min" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
  </defs>

  <!-- 左：独立 -->
  <text x="200" y="40" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">不相关（V = I）：等高线是圆</text>
  <line x1="80" y1="180" x2="330" y2="180" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la12-ax2)"/>
  <line x1="200" y1="290" x2="200" y2="70" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la12-ax2)"/>
  <circle cx="200" cy="180" r="30" fill="#4f46e5" fill-opacity="0.10" stroke="#4f46e5" stroke-width="1.6"/>
  <circle cx="200" cy="180" r="58" fill="none" stroke="#4f46e5" stroke-opacity="0.6" stroke-width="1.4" stroke-dasharray="5 4"/>
  <circle cx="200" cy="180" r="86" fill="none" stroke="#4f46e5" stroke-opacity="0.35" stroke-width="1.2" stroke-dasharray="4 5"/>
  <circle cx="200" cy="180" r="3" fill="var(--text-normal,#1f2328)"/>
  <text x="200" y="300" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">各方向方差相同 ⇒ 噪声"各向同性"（白）</text>

  <!-- 右：相关 -->
  <text x="620" y="40" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">相关 ρ = 0.8：等高线是倾斜椭圆</text>
  <line x1="500" y1="180" x2="750" y2="180" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la12-ax2)"/>
  <line x1="620" y1="290" x2="620" y2="70" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la12-ax2)"/>
  <ellipse cx="620" cy="180" rx="106" ry="35" transform="rotate(-45 620 180)" fill="#4f46e5" fill-opacity="0.10" stroke="#4f46e5" stroke-width="1.8"/>
  <ellipse cx="620" cy="180" rx="75" ry="25" transform="rotate(-45 620 180)" fill="#4f46e5" fill-opacity="0.10" stroke="#4f46e5" stroke-opacity="0.6" stroke-width="1.4" stroke-dasharray="5 4"/>
  <line x1="620" y1="180" x2="695" y2="105" stroke="#4f46e5" stroke-width="2" marker-end="url(#la12-maj)"/>
  <line x1="620" y1="180" x2="645" y2="205" stroke="#db2777" stroke-width="2" marker-end="url(#la12-min)"/>
  <text x="700" y="100" font-size="11.5" font-weight="600" fill="#4f46e5">长轴 = 大特征值方向</text>
  <text x="650" y="220" font-size="11.5" font-weight="600" fill="#db2777">短轴</text>
  <circle cx="620" cy="180" r="3" fill="var(--text-normal,#1f2328)"/>
  <text x="620" y="300" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">半轴 ∝ √λ；长轴沿 (1,1)（因为两分量同向变化）</text>

  <text x="420" y="316" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">协方差矩阵的谱分解就是等高线的"解剖"：特征向量给方向，特征值给长度</text>
</svg>

> [!tip] 线性变换下的多维高斯（第 5 章的行列式在这里现身）
> 若 $\mathbf{y}=A\mathbf{x}$（可逆 $A$），则 $\mathbf{y}\sim N(A\boldsymbol\mu,\ AVA^{T})$，且**密度按 $1/\lvert\det A\rvert$ 缩放**：
> $$
> p_{\mathbf{y}}(\mathbf{y})=\frac{p_{\mathbf{x}}(A^{-1}\mathbf{y})}{\lvert\det A\rvert}
> $$
> 那个 $1/\lvert\det A\rvert$ 就是第 5 章的"**体积缩放因子**"——线性变换把空间拉伸了 $\lvert\det A\rvert$ 倍，概率密度必须相应地被"摊薄"✓
> **好消息**：高斯在**线性变换下仍然是高斯**（形状不变，只换参数）——这让线性系统 + 高斯噪声的分析变得极其清爽。

## 加权最小二乘法

第 4 章的最小二乘假设"每个观测同等可信"。现实中不同观测的**精度不同**（有的来自高信噪比时刻，有的来自深衰落），于是要**加权**：

> [!tip] 定理 加权正规方程
> **加权最小二乘**（weighted least squares）：
> $$\min_{\mathbf{x}}\ (A\mathbf{x}-\mathbf{b})^{T}W(A\mathbf{x}-\mathbf{b})
> \qquad\Longrightarrow\qquad \boxed{\ A^{T}WA\,\hat{\mathbf{x}}=A^{T}W\mathbf{b}\ }$$
> 推导与第 4 章一字不差（只是把内积换成 $W$-内积）：误差要垂直于 $WA$ 的列空间 ✓
> - $W=I$ ⇒ 退化成第 4 章的普通最小二乘 ✓
> - $W$ 对角时，$w_i$ 就是"第 $i$ 个观测的权重/可信度"✓
> - 几何读法：**在 $W$ 定义的"度量"下做投影**——把第 4 章的"垂直"换成"$W$-垂直"✓

**数值例**（三点 $(t,b)=(0,1),(1,2),(2,4)$，第三个观测权重更大）：

| 权重 | $\hat{\mathbf{x}}=(C,D)$ | 拟合值 | 第三个点的残差 |
| --- | --- | --- | --- |
| $w_3=1$（普通 LS） | $(0.8333,\ 1.5000)$ | $0.833,\ 2.333,\ 3.833$ | $0.167$ |
| $w_3=10$ | $(0.8039,\ 1.5882)$ | $0.804,\ 2.392,\ 3.980$ | $0.020$ |
| $w_3=100$ | $(0.8004,\ 1.5988)$ | $0.800,\ 2.399,\ 3.998$ | **$0.002$** |

**规律一眼可见**：权重越大，直线越被"拉向"那个观测——**权重就是"我愿意为它牺牲多少其他点的拟合"** ✓

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 320" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la12-lx" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>
  <line x1="140" y1="250" x2="470" y2="250" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la12-lx)"/>
  <line x1="170" y1="278" x2="170" y2="60" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la12-lx)"/>
  <text x="476" y="254" font-size="11" fill="var(--text-faint,#8b949e)">t</text>
  <text x="174" y="56" font-size="11" fill="var(--text-faint,#8b949e)">b</text>
  <text x="150" y="266" font-size="10.5" fill="var(--text-faint,#8b949e)">0</text>
  <text x="330" y="266" font-size="10.5" fill="var(--text-faint,#8b949e)">1</text>
  <text x="410" y="266" font-size="10.5" fill="var(--text-faint,#8b949e)">2</text>

  <!-- OLS 直线：b = 0.8333 + 1.5t  （t=0→0.833, t=2→3.833） 比例：t: 1单位=120px, b: 1单位=40px -->
  <line x1="170" y1="216.7" x2="410" y2="96.7" stroke="#4f46e5" stroke-width="2.2" stroke-dasharray="7 4"/>
  <!-- WLS(100) 直线：b = 0.8004 + 1.5988t -->
  <line x1="170" y1="218" x2="410" y2="90" stroke="#059669" stroke-width="2.4"/>

  <!-- 数据点 -->
  <circle cx="170" cy="210" r="5" fill="var(--text-normal,#1f2328)"/>
  <circle cx="290" cy="170" r="5" fill="var(--text-normal,#1f2328)"/>
  <circle cx="410" cy="90" r="9" fill="none" stroke="#dc2626" stroke-width="2"/>
  <circle cx="410" cy="90" r="4" fill="#dc2626"/>
  <g font-size="11" fill="var(--text-muted,#57606a)">
    <text x="120" y="206">(0, 1)</text><text x="250" y="166">(1, 2)</text><text x="424" y="80" fill="#dc2626">(2, 4)：权重 100</text>
  </g>

  <text x="520" y="96" font-size="12" font-weight="600" fill="#059669">加权最小二乘（w₃ = 100）</text>
  <text x="520" y="122" font-size="12" font-weight="600" fill="#4f46e5">普通最小二乘（w₃ = 1）</text>
  <text x="520" y="160" font-size="11.5" fill="var(--text-normal,#1f2328)">普通：ŷ = 0.833 + 1.500 t，第三点残差 0.167</text>
  <text x="520" y="186" font-size="11.5" fill="var(--text-normal,#1f2328)">加权：ŷ = 0.800 + 1.599 t，第三点残差 0.002</text>
  <text x="520" y="222" font-size="11.5" fill="var(--text-muted,#57606a)">权重 = "愿意为这个观测牺牲多少其他点"</text>
  <text x="520" y="248" font-size="11.5" fill="var(--text-muted,#57606a)">正规方程 AᵀWA x̂ = AᵀWb（第 4 章的 W-版）</text>

  <text x="420" y="308" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">W = 噪声协方差之逆时，加权最小二乘就是 Gauss–Markov 意义下的最优线性无偏估计</text>
</svg>

> [!tip] 定理 Gauss–Markov：最优权重是"噪声协方差之逆"
> 若观测噪声的协方差为 $V_n$，则取
> $$
> W=V_n^{-1}
> $$
> 时的加权最小二乘给出**最优线性无偏估计**（BLUE，best linear unbiased estimator）——它在所有线性无偏估计里方差最小 ✓
> **直觉**：观测越准（$V_n$ 那一块越小）⇒ $V_n^{-1}$ 那一块的权重越大 ⇒ 越"听它的" ✓ 这就是"精度加权"。

> [!tip] 先验 + 观测 = 贝叶斯/MMSE（卡尔曼滤波的静态形式）
> 若还知道 $\mathbf{x}$ 的**先验** $\mathbf{x}\sim N(\boldsymbol\mu_0,V_0)$，则融合先验与观测后的后验是
> $$
> \hat{\mathbf{x}}=\bigl(V_0^{-1}+A^{T}V_n^{-1}A\bigr)^{-1}\bigl(V_0^{-1}\boldsymbol\mu_0+A^{T}V_n^{-1}\mathbf{b}\bigr)
> $$
> ——**"精度相加、估值按精度加权平均"** ✓ 这条式子递推地做下去，就是**卡尔曼滤波**（Kalman filter，每一步都用上一次的后验当先验）✓
> **数值例**：先验 $N(0,1)$（精度 1.0）；三次观测均值 $1.30$、噪声方差 $0.25$（数据总精度 $3/0.25=12$）⇒
> $$
> \hat x=\frac{0\times1.0+1.30\times12}{1.0+12}=1.200,\qquad \text{后验方差}=\frac{1}{13}=0.0769
> $$
> 数据精度（12）压倒先验（1），所以估计几乎由观测决定（1.20 靠近 1.30）——**精度加权，一目了然** ✓

> [!note] 通信方向：LMMSE 与卡尔曼滤波
> - **LMMSE 信道估计**：$\hat{\mathbf{h}}=(R_h^{-1}+\sigma^{-2}A^{H}A)^{-1}\sigma^{-2}A^{H}\mathbf{y}$——**正是上面的"先验 + 观测"公式**，其中 $R_h$ 是信道的协方差（先验，来自时延扩展/多普勒谱），$\sigma^{2}I$ 是噪声协方差 ✓（[[vault-notes/5g/phy/04-physical-channels-signals]]）
> - **卡尔曼滤波 / 跟踪**：把上面的"静态融合"做成递推，用于时变信道跟踪、时钟同步、目标跟踪；
> - **软判决与似然**：高斯噪声下 $-\ln p\propto$ 欧氏距离（因 $V^{-1}$ 是度量矩阵），于是"最大似然 = 最小加权距离"，这正是格译码/球译码的出发点 ✓
> - **白化 + 匹配滤波**：有色噪声先白化（第 2 节），再在"白"的度量下做匹配滤波 = 加权最小二乘的另一种写法 ✓

> [!tip] 本章收官
> 三节内容合起来是一条链：
> 1. **单变量**（第 1 节）：期望是**线性泛函**；**方差 = 围绕均值的二阶矩**（最小二乘的祖宗）；**中心极限定理**解释了高斯噪声的来源；
> 2. **多变量**（第 2 节）：**协方差矩阵 $V$ 是对称半正定矩阵** ⇒ 特征分解 = 主轴分解；**线性变换的传播律 $AV A^{T}$**；白化 = 把椭圆掰成圆；
> 3. **高斯与估计**（第 3 节）：多维高斯里 $\det V$ 与 $V^{-1}$ 同时出现，等概率面是椭球；**加权最小二乘 $A^{T}WA\hat{\mathbf{x}}=A^{T}W\mathbf{b}$**，最优权重 $W=V_n^{-1}$（Gauss–Markov），加先验就是卡尔曼滤波。
> 一句话：**"随机"并不妨碍"线性"——只要用协方差矩阵描述随机性，前十一章的所有工具（子空间、正交、特征值、SVD、条件数）就原样适用于统计问题。**

## 本章知识地图

```
概率统计中的线性代数：随机性的"线性化"
  ├─ 1. 均值、方差与概率
  │      ├── E[X] 是**线性泛函**：E[cX + dY] = cE[X] + dE[Y]（不需要独立）
  │      ├── 方差 Var(X) = E[(X−μ)²] = E[X²] − μ²；零均值信号的方差 = 功率
  │      │      └── Var(cX) = c²Var(X)；Var(X+Y) = Var X + Var Y + 2Cov
  │      ├── 密度 p(x) ≥ 0、∫p = 1；U[0,1]：E = 1/2、Var = 1/12（量化噪声 q²/12 的来源）
  │      ├── ★ 均值 = 最小均方意义下的最优常数（最小二乘的随机版）
  │      ├── 正态 N(μ,σ²)：68–95–99.7 = 0.6827 / 0.9545 / 0.9973（数值验证）
  │      └── N 次抛硬币：均值 N/2、方差 N/4；峰度 2.80(N=10) → 2.98(N=100) → 3
  │             └── **中心极限定理**：独立同分布之和 → 正态 ⇒ AWGN 的物理依据
  │
  ├─ 2. 协方差矩阵与联合概率
  │      ├── Cov(X,Y) = E[XY] − μ_Xμ_Y；ρ ∈ [−1,1]；独立 ⟹ 不相关（反之不然）
  │      ├── V = E[(x−μ)(x−μ)ᵀ]：**对称 + 半正定**（aᵀVa = E[(aᵀ(x−μ))²] ≥ 0）
  │      ├── 谱分解 V = QΛQᵀ：特征向量 = 主轴、特征值 = 该方向方差、总方差 = tr(V)
  │      │      └── 这就是 PCA（第 7.3 节）
  │      ├── ★ 传播律：y = Ax ⇒ E[y] = Aμ、Cov(y) = AVAᵀ（标量：Var(aᵀx) = aᵀVa）
  │      └── 白化：z = Λ^(−1/2)Qᵀ(x−μ) ⇒ Cov(z) = I（有色噪声 → 白噪声）
  │
  └─ 3. 多维高斯分布与加权最小二乘法
         ├── p(x) = (2π)^(−n/2)(det V)^(−1/2) exp(−½(x−μ)ᵀV⁻¹(x−μ))
         │      └── det V（第 5 章）与 V⁻¹（第 4 章）同时出现；数值积分 = 1 ✓
         ├── 等概率面 = 椭球：半轴沿特征向量、长 ∝ √λ（第 6.5 节的椭圆）
         ├── 线性变换：y = Ax ⇒ N(Aμ, AVAᵀ)，密度除以 |det A|（体积缩放，第 5 章）
         ├── ★ 加权最小二乘：min (Ax−b)ᵀW(Ax−b) ⇒ AᵀWA x̂ = AᵀWb
         │      └── 实测：w₃ = 1 / 10 / 100 ⇒ 第三点残差 0.167 / 0.020 / 0.002
         ├── Gauss–Markov：W = V_n⁻¹ ⇒ 最优线性无偏估计（BLUE）
         └── 先验 + 观测 ⇒ 精度相加、按精度加权 ⇒ 卡尔曼滤波的静态形式
                └── 实测：先验精度 1.0 + 数据精度 12 ⇒ x̂ = 1.20、后验方差 0.077
```

## 关联

- 上一章：[[vault-notes/math/linear-algebra/11-numerical-linear-algebra]]

**本章与前面章节的接口**（本书最后一章，也是"把线性代数交给概率"的一章）：

| 前面章节 | 在概率统计里的化身 |
| --- | --- |
| 第 1 章：点积、长度 | 期望/方差/协方差都是"加权求和"——内积的连续版 |
| 第 4 章：投影、最小二乘、$A^{T}A$ | 加权最小二乘 $A^{T}WA$；条件期望 = 最小均方估计 |
| 第 5 章：$\det$ = 体积缩放 | 多维高斯密度里的 $(\det V)^{-1/2}$、线性变换的 $1/\lvert\det A\rvert$ |
| 第 6 章：对称矩阵谱定理、迹、正定 | $V$ 对称半正定 ⇒ $V=Q\Lambda Q^{T}$；总方差 = $\operatorname{tr}(V)$；正定 ⟺ 无完全相关组合 |
| 第 6.5 节：椭圆 $ax^{2}+2bxy+cy^{2}=1$ | **高斯等高线就是那个椭圆**（半轴 $\propto\sqrt\lambda$） |
| 第 7.3 节：PCA = 协方差矩阵的特征分解 | 本章第 2 节把它的来龙去脉补齐 |
| 第 8 章：线性变换 | $\mathbf{y}=A\mathbf{x}$ 的均值/协方差传播律；期望是线性泛函 |
| 第 9 章：埃尔米特矩阵、酉矩阵 | 复协方差 $R=E[\mathbf{x}\mathbf{x}^{H}]$ 埃尔米特半正定；特征值 = 各方向功率 |
| 第 10.5 节：函数空间的正交基 | 随机过程的正交展开（KLT）、白噪声的"函数空间"表述 |
| 第 11 章：条件数、数值稳定性 | 协方差矩阵求逆（LMMSE）的条件数决定估计器能否用定点实现 |

**通信方向应用**：

- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 本章是**信道估计与检测的数学底座**：**LMMSE 信道估计**就是"先验（时延/多普勒谱给出的 $R_h$）+ 观测（导频，噪声 $\sigma^{2}I$）"按**精度加权**融合；**MMSE/MMSE-IRC 检测**里到处是噪声协方差矩阵的逆；**空间相关的 MIMO 信道**由协方差矩阵 $R=E[\mathbf{h}\mathbf{h}^{H}]$ 描述，其特征分解给出**特征波束**（第 6、7 章）；**OFDM 的信道**在每个子载波上做加权最小二乘/MMSE（第 9 章的 $F$ 提供正交子载波）；而**噪声白化**（本节第 2 节的白化矩阵）是接收机前端的标准动作。
- [[vault-notes/communication/09-optimal-reception]] —— **AWGN 下"最大似然 = 最小欧氏距离"**这一条，其数学根据就是高斯密度里的 $e^{-d^{2}}$（本章第 3 节）；**相关接收/匹配滤波**是第 4 章的投影在随机信号上的版本；**判决统计量的信噪比** = 信号在特征方向上的能量比噪声方差（本章第 1 节的"方差 = 功率"）；而有色噪声下的最优接收机 = **先白化、再相关** ✓
- [[vault-notes/communication/11-error-control-coding]] —— 译码的**软判决**直接用"高斯噪声下的似然"（本章第 3 节）；**LLR（对数似然比）**在 AWGN 下简化为 $2y/\sigma^{2}$；而**信道译码的迭代置信传播**（第 11 章）本质上是"在噪声统计已知的条件下做统计推断"——**协方差/方差就是它需要的全部统计信息** ✓
- [[vault-notes/communication/12-orthogonal-codes-pn-sequences]] —— 正交码在**白噪声**下的优良性来自"噪声方差在各正交方向均匀分布"；而伪随机序列的**自相关/互相关**就是本章的协方差（只是把期望换成时间平均——**各态历经假设**）✓
- [[vault-notes/math/linear-algebra/07-singular-value-decomposition]] —— PCA/KLT（第 7.3 节）与本章第 2 节的谱分解是同一件事的两个说法；SVD 给出"数据矩阵的主方向"，协方差矩阵的特征分解给出"统计的主方向"，两者通过 $\sigma_i^{2}/(n-1)=\lambda_i$ 直接对应 ✓

**相关**：[[vault-notes/math/linear-algebra/07-singular-value-decomposition]]｜[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]]｜[[vault-notes/5g/phy/04-physical-channels-signals]]
