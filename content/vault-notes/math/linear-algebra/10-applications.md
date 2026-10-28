---
title: "线性代数的应用"
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
> 前面九章把线性代数讲完了。这一章是**七个真实场景**——它们证明那些看似抽象的概念（子空间、特征值、正交、有限域）本来就是从工程里长出来的。
>
> - **10.1** 图和网络：**关联矩阵**的四个子空间 = 电路的四条定律；$A^{T}CA$ 就是节点电位方程
> - **10.2** 工程学中的矩阵：微分方程差分成**三对角刚度矩阵** $K$；边界条件决定 $K$ 是否正定
> - **10.3** 马尔可夫、人口与经济：稳态 = $\lambda=1$ 的特征向量；**佩隆–弗罗贝尼乌斯**；Leontief 方程式
> - **10.4** 线性规划：最优解一定在**顶点**；原问题与对偶问题的最优值相等
> - **10.5** 傅里叶级数：函数空间里的"正交基 + 投影"，与 $\mathbb{R}^n$ 逐条对应
> - **10.6** 计算机图形学：**齐次坐标**——加一维，把"平移"这个非线性动作变成线性变换
> - **10.7** 密码学：**模算术** + 矩阵乘法 = Hill 密码；矩阵能不能解密，看 $\det$ 与模数是否互素
>
> 一句话主线：**这一章不讲新定理，只做一件事——把前九章的每个概念，指给你看它在现实里对应着什么。**

> [!note] 记号约定
> - 图标：$n$ 个**节点**（node）、$m$ 条**边**（edge）；$A$ 是 $m\times n$ **关联矩阵**（一行一条边）
> - $K$：刚度矩阵（stiffness matrix）；$f$：外力/注入**电流**；$y$：**电压**/电位；$C$：电导（或柔度）
> - $L=A^{T}A$：图的**拉普拉斯矩阵**（Laplacian）
> - $\mathbb{Z}_p$：模 $p$ 的整数；$c^{T}x$：目标函数；$b^{T}y$：对偶目标

# 10.1 图和网络

图论与线性代数的关系可以用一句话概括：**"图上的电流、电压、流量，统统住在关联矩阵的四个子空间里"**——第 3、4 章那张四子空间图，在这里有了物理名字。

## 关联矩阵

> [!info] Def 1 关联矩阵
> 给一个图（$n$ 个节点、$m$ 条**有向**边），定义 **$m\times n$ 的关联矩阵**（incidence matrix）$A$：**一行对应一条边**，边的起点列为 $-1$、终点列为 $+1$，其余为 $0$。

**例（Strang 的经典图：4 节点 5 边）**：边 ①$1\to2$、②$2\to3$、③$1\to3$、④$1\to4$、⑤$3\to4$：

$$
A=\begin{bmatrix}
-1&1&0&0\\
0&-1&1&0\\
-1&0&1&0\\
-1&0&0&1\\
0&0&-1&1
\end{bmatrix}
$$

> [!tip] 定理 四个子空间的物理意义（★ 本节的灵魂）
> 对**连通**图，秩 $r=n-1$，于是
> | 子空间 | 维数 | 物理含义 |
> | --- | --- | --- |
> | $\mathbf{N}(A)$ | $n-(n-1)=1$ | **所有节点电位同加一个常数**（常数向量 $(1,1,1,1)$）✓ 已验证 |
> | $\mathbf{C}(A^{T})$（行空间） | $n-1=3$ | **沿边的电位差**（电压降） |
> | $\mathbf{C}(A)$（列空间） | $n-1=3$ | 满足**基尔霍夫电流定律**的注入电流 $\mathbf{f}$ |
> | $\mathbf{N}(A^{T})$（左零空间） | $m-n+1=2$ | **环流**（回路电流）✓ |
> 而 $m-n+1$ 就是**独立回路数**——这正是欧拉公式的线性代数版本：
> $$
> n-m+(\text{回路数})=1\quad(\text{连通图})
> $$
> 本例：$4-5+2=1$ ✓

**两个环流向量**（都验证过 $A^{T}\mathbf{c}=\mathbf{0}$）：

$$
\text{三角形 }1\to2\to3\to1:\ \mathbf{c}_1=(1,1,-1,0,0)^{T},\qquad
\text{三角形 }1\to3\to4\to1:\ \mathbf{c}_2=(0,0,-1,1,-1)^{T}
$$

（边①、②顺着走记 $+1$，边③逆着走记 $-1$ ✓）

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 330" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la10-e" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
  </defs>

  <!-- 图 -->
  <g stroke="#4f46e5" stroke-width="2" marker-end="url(#la10-e)">
    <line x1="160" y1="90" x2="290" y2="90"/>
    <line x1="300" y1="102" x2="290" y2="190"/>
    <line x1="160" y1="102" x2="252" y2="168"/>
    <line x1="160" y1="90" x2="160" y2="190"/>
    <line x1="248" y1="196" x2="172" y2="196"/>
  </g>
  <g fill="var(--text-normal,#1f2328)">
    <circle cx="160" cy="90" r="7"/><circle cx="300" cy="90" r="7"/><circle cx="300" cy="200" r="7"/><circle cx="160" cy="200" r="7"/>
  </g>
  <g font-size="12" font-weight="600" fill="var(--text-normal,#1f2328)">
    <text x="146" y="80">节点1</text><text x="308" y="80">节点2</text><text x="308" y="216">节点3</text><text x="140" y="220">节点4</text>
  </g>
  <g font-size="11" fill="#d97706" font-weight="600">
    <text x="216" y="82">①</text><text x="304" y="146">②</text><text x="196" y="126">③</text><text x="140" y="148">④</text><text x="200" y="212">⑤</text>
  </g>
  <text x="230" y="264" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">m = 5 条边（有向），n = 4 个节点，独立回路 2 个</text>

  <!-- 四子空间 -->
  <g>
    <rect x="440" y="46" width="360" height="52" rx="5" fill="#4f46e5" fill-opacity="0.10" stroke="#4f46e5" stroke-opacity="0.5"/>
    <text x="452" y="68" font-size="12" font-weight="600" fill="#4f46e5">N(A)：节点电位同时加常数（维数 1）</text>
    <text x="452" y="88" font-size="11" fill="var(--text-muted,#57606a)">A(1,1,1,1)ᵀ = 0 —— 电位全加一个常数，电压差不变</text>

    <rect x="440" y="106" width="360" height="52" rx="5" fill="#059669" fill-opacity="0.10" stroke="#059669" stroke-opacity="0.5"/>
    <text x="452" y="128" font-size="12" font-weight="600" fill="#059669">C(Aᵀ)：沿边的电位差（维数 3）</text>
    <text x="452" y="148" font-size="11" fill="var(--text-muted,#57606a)">A y = e：节点电位 y → 每条边的电压降 e</text>

    <rect x="440" y="166" width="360" height="52" rx="5" fill="#d97706" fill-opacity="0.10" stroke="#d97706" stroke-opacity="0.5"/>
    <text x="452" y="188" font-size="12" font-weight="600" fill="#d97706">C(A)：满足 KCL 的注入电流（维数 3）</text>
    <text x="452" y="208" font-size="11" fill="var(--text-muted,#57606a)">Aᵀy = f：基尔霍夫电流定律</text>

    <rect x="440" y="226" width="360" height="52" rx="5" fill="#db2777" fill-opacity="0.10" stroke="#db2777" stroke-opacity="0.5"/>
    <text x="452" y="248" font-size="12" font-weight="600" fill="#db2777">N(Aᵀ)：环流（维数 2 = 独立回路数）</text>
    <text x="452" y="268" font-size="11" fill="var(--text-muted,#57606a)">回路电流绕一圈，净注入为零</text>
  </g>

  <text x="420" y="312" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">第 3、4 章那个"四子空间"框架，在电路里就是"电位 / 电压 / 电流 / 环流"四件东西</text>
</svg>

## 电压、电流和A^t Ax = f

把电学的三条定律翻译成矩阵语言：

| 物理定律 | 矩阵形式 | 说明 |
| --- | --- | --- |
| **欧姆定律** | $\mathbf{e}=C^{-1}\mathbf{y}$ | 电压降 = 电流 ÷ 电导（$C$ 是对角电导矩阵） |
| **电位与电压差** | $\mathbf{e}=A\mathbf{x}$ | 节点电位 $\mathbf{x}$ → 沿边的电压降 |
| **基尔霍夫电流定律**（KCL） | $A^{T}\mathbf{y}=\mathbf{f}$ | 每条边的电流在节点处"进出平衡"，等于外部注入 $\mathbf{f}$ |

三个式子串起来（$\mathbf{y}=C\mathbf{e}=CA\mathbf{x}$ 代入 KCL）：

$$
\boxed{\ A^{T}CA\,\mathbf{x}=\mathbf{f}\ }
$$

> [!tip] 定理 节点电位方程
> 已知外部注入电流 $\mathbf{f}$，求各节点电位 $\mathbf{x}$，只需解
> $$
> A^{T}CA\,\mathbf{x}=\mathbf{f}
> $$
> - $A^{T}CA$ 是 **$n\times n$ 对称正定**矩阵（在有接地节点的意义上）；
> - 若不加接地条件，常数向量在它的零空间里（$\mathbf{N}(A)$ 那一维），矩阵**奇异**——这就是"电位需要一个参考点"的代数表述 ✓

**最简单的特例**：所有电导为 1（$C=I$）时，$A^{T}A$ 就是下一小节的拉普拉斯矩阵 ✓

## 网络和A^T CA

> [!info] Def 2 拉普拉斯矩阵
> $$
> L=A^{T}A\qquad(n\times n)
> $$
> - **对角元** $L_{ii}=$ 节点 $i$ 的**度数**（连了几条边）；
> - **非对角元** $L_{ij}=-1$（$i,j$ 相邻）或 $0$（不相邻）；
> - **每行之和为零**（正负相消）✓
> 加权版本 $A^{T}CA$ 把 $-1$ 换成电导 $c$ ✓

**本例验证**（4 节点 5 边）：

$$
L=A^{T}A=\begin{bmatrix}3&-1&-1&-1\\-1&2&-1&0\\-1&-1&3&-1\\-1&0&-1&2\end{bmatrix},\qquad
\text{行和}=(0,0,0,0)\ \checkmark,\qquad
\text{特征值}=(0,\ 2,\ 4,\ 4)
$$

**零空间里的常数向量** ⇒ 特征值 $0$；**连通分量数 = 零特征值的个数** ✓（本例连通，故只有一个零特征值）

加权版（取 $C=\operatorname{diag}(1,2,3,4,5)$）：

$$
A^{T}CA=\begin{bmatrix}8&-1&-3&-4\\-1&3&-2&0\\-3&-2&10&-5\\-4&0&-5&9\end{bmatrix},\qquad \text{对称 ✓，特征值}=(0,\ 3.75,\ 11.48,\ 14.77)
$$

**一眼可见的规律**：对角元 $=$ 该节点所有边的电导之和；非对角元 $=-$（两节点间电导）✓ 这正是**基尔霍夫电流定律**逐点写出后的样子。

> [!note] 通信方向：图论线性代数在通信里到处都是
> - **网络与路由**：通信网络的邻接矩阵、拉普拉斯矩阵；**连通性** = 零特征值的重数；**割集**（割断哪些边能分开网络）与拉普拉斯矩阵的次小特征值（**代数连通度**）直接相关；
> - **谱聚类 / 分簇**：对 $L$ 或归一化拉普拉斯做特征分解，用小特征值的特征向量把节点分组——**这是网络分簇、社团发现的数学内核**；
> - **分布式一致性**（consensus）：多个节点通过"邻居平均"达成一致，收敛速度由 $L$ 的谱（$\lambda_2$）决定——正是第 6 章"特征值决定收敛速度"；
> - **PageRank 与马尔可夫链**：随机游走矩阵 $P=D^{-1}A_{\text{邻接}}$ 的稳态（下一节）✓
> - **图信号处理 / 网络编码 / 传感器网络定位**：全部建立在"关联矩阵 + 拉普拉斯"之上。

# 10.2 工程学中的矩阵

同一个三对角矩阵，会以**弹簧、导体、热传导、静电场、梁**的身份反复出现——这是本章最"震撼"的一节。

## 从微分方程到矩阵方程

一维平衡问题的标准形式：

$$
-\frac{\mathrm{d}}{\mathrm{d}x}\left(c(x)\frac{\mathrm{d}u}{\mathrm{d}x}\right)=f(x),\qquad 0<x<L
$$

| 物理场景 | $u$ | $c(x)$ | $f$ |
| --- | --- | --- | --- |
| **弹性杆** | 位移 | 弹性系数 | 分布载荷 |
| **热传导** | 温度 | 导热系数 | 热源 |
| **扩散** | 浓度 | 扩散系数 | 源项 |
| **静电场** | 电位 | 介电常数 | 电荷密度 |
| **传输线** | 电压 | $1/$（分布电感电容） | 分布驱动 |

**离散化（有限差分/有限元）后，同一个矩阵就会出现一次。**

## 用差分代替导数

把 $[0,L]$ 分成网格（间距 $h$），用二阶差分近似二阶导数：

$$
-c\,\frac{u_{i+1}-2u_i+u_{i-1}}{h^{2}}=f_i
\qquad\Longrightarrow\qquad
Ku=\mathbf{f},\qquad K=\frac{c}{h^{2}}\begin{bmatrix}
2&-1&&\\
-1&2&-1&\\
&\ddots&\ddots&\ddots\\
&&-1&2
\end{bmatrix}
$$

这个 $K$ 就是**刚度矩阵**（stiffness matrix）：**对称、三对角、对角占优** ⇒ 大概率正定 ✓（它正是第 6 章那个"$\det D_n=n+1$"的矩阵，也是 10.1 拉普拉斯矩阵的一维版本）

## 固定端、自由端和变系数c(x)

**边界条件决定矩阵的"角"**（这是本节的核心技巧）：

| 边界条件 | 对角首/末元 | 矩阵 |
| --- | --- | --- |
| 两端**固定**（$u=0$） | $2,\ 2$ | $K=\operatorname{tridiag}(2,-1)$ ✓ 正定 |
| 一端**自由**（$\mathrm{d}u/\mathrm{d}x=0$） | 末元改为 $1$ | 首末不等，仍正定 |
| 两端**自由** | 首末都改为 $1$ | **奇异**（见下两节） |
| **变系数** $c(x)$ | 各元随 $x$ 变 | 仍对称三对角，但从"常数"变成"随位置变" |

变系数的做法很朴素：把每段的 $c_i$ 放到对应位置，于是矩阵"每行的对角元 = 相邻两段系数之和"✓——这已经是有限元方法的雏形。

## 两端自由边值条件

**两端自由**时，$K$ 的角被改成 $1$：

$$
K_{\text{自由}}=\begin{bmatrix}1&-1&0\\-1&2&-1\\0&-1&1\end{bmatrix}
$$

> [!warning] 它一定奇异
> 因为**常数向量在零空间里**：$K_{\text{自由}}(1,1,1)^{T}=\mathbf{0}$ ✓（已验证：$\det K_{\text{自由}}=0$，特征值 $(0,1,3)$）
> 物理含义一目了然：**两端自由意味着"整体平移"不需要能量**——把整根杆挪一个常数，内部弹簧不拉伸，受力不变。所以 $K$ 不可能满秩。
> 数学含义：$K\mathbf{u}=\mathbf{f}$ 有解当且仅当 $\mathbf{f}\perp$ 零空间（即 $\sum f_i=0$，"外力平衡"），且解差一个常数（"位移只有相对值有意义"）✓ 这正好是第 3、4 章的**有解条件 + 全解结构**。

## 一列弹簧与质点

把 $n$ 个质点用弹簧串起来（两端固定）：

```
固定 ●──弹簧──●──弹簧──●──弹簧──● 固定
      u₁      u₂      u₃      u₄
```

每个质点的受力平衡给出三对角方程组 $K\mathbf{u}=\mathbf{f}$，其中 $K$ 就是上面的 $\operatorname{tridiag}(2,-1)$。

**特征值 = 固有频率的平方**（第 6 章 + 第 7 章）：

$$
K\,\text{的特征值}=2-2\cos\frac{k\pi}{n+1},\qquad k=1,\dots,n
$$

**$n=4$ 时实测**：$0.382,\ 1.382,\ 2.618,\ 3.618$ ✓ 与公式完全吻合 ✓

**特征向量的物理意义**：**振型**（振动模态）——最低频的那一个（$\lambda=0.382$）是整个链"整体摆"的最慢模态；特征向量已经正交（$K$ 对称）⇒ 各模态互不干扰 ✓ 这就是"用特征向量当基"（第 8 章）的物理原型。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 300" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la10-m" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-normal,#1f2328)"/>
    </marker>
  </defs>

  <!-- 墙 -->
  <line x1="60" y1="108" x2="60" y2="192" stroke="var(--text-normal,#1f2328)" stroke-width="4"/>
  <line x1="560" y1="108" x2="560" y2="192" stroke="var(--text-normal,#1f2328)" stroke-width="4"/>
  <text x="52" y="104" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">固定</text>
  <text x="568" y="104" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">固定</text>

  <!-- 弹簧 -->
  <g fill="none" stroke="#d97706" stroke-width="1.6">
    <path d="M60,150 L70,150 L80,138 L95,162 L110,138 L125,162 L140,138 L150,150 L160,150"/>
    <path d="M160,150 L170,150 L180,138 L195,162 L210,138 L225,162 L240,138 L250,150 L260,150"/>
    <path d="M260,150 L270,150 L280,138 L295,162 L310,138 L325,162 L340,138 L350,150 L360,150"/>
    <path d="M360,150 L370,150 L380,138 L395,162 L410,138 L425,162 L440,138 L450,150 L460,150"/>
    <path d="M460,150 L470,150 L480,138 L495,162 L510,138 L525,162 L540,138 L550,150 L560,150"/>
  </g>

  <!-- 质点 -->
  <g fill="#4f46e5">
    <circle cx="160" cy="150" r="9"/><circle cx="260" cy="150" r="9"/>
    <circle cx="360" cy="150" r="9"/><circle cx="460" cy="150" r="9"/>
  </g>
  <g font-size="12" font-weight="600" fill="#4f46e5" text-anchor="middle">
    <text x="160" y="180">u₁</text><text x="260" y="180">u₂</text><text x="360" y="180">u₃</text><text x="460" y="180">u₄</text>
  </g>
  <text x="310" y="216" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">4 个质点 + 5 根弹簧（两端固定）⇒ 4 个未知位移</text>
  <text x="310" y="238" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">每个质点的受力平衡给出一行方程</text>

  <!-- 刚度矩阵 -->
  <text x="710" y="52" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">刚度矩阵 K</text>
  <path d="M622 62 L614 62 L614 238 L622 238" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <path d="M798 62 L806 62 L806 238 L798 238" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.6"/>
  <g font-size="13.5" text-anchor="middle">
    <text x="650" y="94" font-weight="700" fill="#2563eb">2</text><text x="690" y="94" font-weight="700" fill="#d97706">−1</text><text x="730" y="94" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text><text x="770" y="94" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text>
    <text x="650" y="134" font-weight="700" fill="#d97706">−1</text><text x="690" y="134" font-weight="700" fill="#2563eb">2</text><text x="730" y="134" font-weight="700" fill="#d97706">−1</text><text x="770" y="134" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text>
    <text x="650" y="174" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text><text x="690" y="174" font-weight="700" fill="#d97706">−1</text><text x="730" y="174" font-weight="700" fill="#2563eb">2</text><text x="770" y="174" font-weight="700" fill="#d97706">−1</text>
    <text x="650" y="214" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text><text x="690" y="214" fill="var(--text-faint,#8b949e)" opacity="0.5">0</text><text x="730" y="214" font-weight="700" fill="#d97706">−1</text><text x="770" y="214" font-weight="700" fill="#2563eb">2</text>
  </g>

  <text x="420" y="272" text-anchor="middle" font-size="11.5" fill="var(--text-normal,#1f2328)">K 对称、三对角、对角占优 ⇒ 正定；特征值 = 2 − 2cos(kπ/5) = 0.382, 1.382, 2.618, 3.618</text>
  <text x="420" y="292" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">特征值 = 固有频率的平方；特征向量 = 振型（各阶模态互不干扰，因为它们正交）</text>
</svg>

## 固定-自由端

一端固定、一端自由（$n=2$）：

$$
K=\begin{bmatrix}2&-1\\-1&1\end{bmatrix},\qquad \det K=1>0\ \checkmark\ \text{正定},\qquad
\lambda=\frac{3\pm\sqrt5}{2}=0.382,\ 2.618
$$

**为什么右端是 $1$ 而不是 $2$**：右端自由意味着"最后一个质点只受左边一根弹簧拉"，所以对角元少一个 $1$ ✓
**它仍然正定**：因为一端固定，整体平移被禁止（自由度没被"浪费"）✓

## 两个自由端：K为奇异矩阵

**两端都自由**时，$K$ 奇异（前面已算：$\det=0$，$\lambda=(0,1,3)$）✓

结论对照表：

| 边界 | $K$ 的零空间 | 矩阵 | 方程组 |
| --- | --- | --- | --- |
| 固定-固定 | 无 | 正定 | 唯一解 |
| 固定-自由 | 无 | 正定 | 唯一解 |
| **自由-自由** | 常数向量 | **奇异** | 平移下不定 + 需力平衡 |

> [!tip] 一条通用经验
> **"有没有被固定住"决定 $K$ 的秩。** 物理系统的"刚体运动"（整体平移、旋转）一定对应 $K$ 的零空间；工程上把这种现象叫作 **"机构运动 / 奇异"**。而在数学上，它就是第 4 章那句"奇异 ⟺ 有非零零空间"。

## 弹簧圈

如果弹簧首尾相接成环（**周期边界**），矩阵变成**循环矩阵**（circulant）：

$$
K_{\text{环}}=\begin{bmatrix}1&-1&0&\cdots&-1\\-1&2&-1&&\\&\ddots&\ddots&\ddots&\\-1&&&-1&1\end{bmatrix}
\quad\text{（$n=3$ 时为 }\begin{bmatrix}2&-1&-1\\-1&2&-1\\-1&-1&2\end{bmatrix}\text{）}
$$

- **仍然奇异**（常数向量仍在零空间：整体绕圈平移）✓（$n=3$ 实测 $\det=0$，$\lambda=(0,3,3)$ ✓）
- **特征值可以用单位根表达**：$2-2\cos\frac{2\pi k}{n}$ ✓（$n=3$ 时 $0,3,3$ ✓）
- ★ **它的特征向量就是傅里叶基**（第 9 章！）：周期边界的差分算子被离散傅里叶变换对角化 ⇒ 平衡方程 $Ku=f$ 在频域里退化成逐点相除（**这就是"周期三对角系统可以用 FFT 求解"的原理**）。

> [!note] 通信方向：同一个三对角矩阵换了三次身份
> | 工程场景 | $K$ 的角色 | 怎么用 |
> | --- | --- | --- |
> | 传输线/分布参数网络 | 差分算子 | 求沿线电压分布（差分方程） |
> | 数字滤波器 | 差分算子（FIR/IIR 的系数） | 频率响应 = 特征函数上的特征值（第 8 章） |
> | 信道均衡（三对角/带状信道） | 带状线性系统 | 用带状求解 $O(n)$ 或 FFT $O(n\log n)$ |
> | 阵列/传感器网络 | 图上拉普拉斯 | 谱聚类、一致性协议 |
> 一条工程经验：**"对称正定三对角"是数值线性代数里最舒服的对象**（第 11 章会讲带状矩阵为何便宜）。

# 10.3 马尔可夫矩阵、人口和经济

## 马尔可夫矩阵

> [!info] Def 3 马尔可夫矩阵
> 元素**非负**、且**每列之和为 1** 的方阵。它的每一列是一个概率分布，$A^k$ 描述 $k$ 步转移。
> $$
> A=\begin{bmatrix}0.8&0.3\\0.2&0.7\end{bmatrix}:\quad \text{列和}=1,\ 1\ \checkmark
> $$

> [!tip] 定理 马尔可夫矩阵的谱性质
> 1. **$\lambda=1$ 一定是特征值**（因为 $A^{T}$ 作用在"全 1 向量"上？—— 更直接：列和为 1 ⇒ $(1,1)^{T}$ 是 $A^{T}$ 的特征向量，故 $1$ 是 $A$ 的特征值）✓
> 2. 所有特征值满足 $\lvert\lambda\rvert\le1$；
> 3. 对应的特征向量可以取成**非负**的 —— 它就是**稳态分布**（stationary distribution）✓
> 4. 若 $A$ 的某个幂为正，则 $\lambda=1$ 是单根，其余 $\lvert\lambda\rvert<1$ ⇒ **$A^{k}$ 收敛到稳态**（每列都是稳态向量）✓

**例**（第 6 章已算）：$A^{20}\approx\begin{bmatrix}0.6&0.6\\0.4&0.4\end{bmatrix}$，稳态 $(0.6,0.4)$ ✓

## 佩隆-弗罗贝尼乌斯定理

> [!tip] 定理 佩隆–弗罗贝尼乌斯（Perron–Frobenius）
> 若 $A$ 是**正矩阵**（所有元素 $>0$），则：
> 1. 存在**唯一**的实特征值 $\lambda_1$ 等于**谱半径**：$\lambda_1=\max_i\lvert\lambda_i\rvert>0$；
> 2. $\lambda_1$ 是**单根**，且其他特征值严格小于它：$\lvert\lambda_i\rvert<\lambda_1$；
> 3. 对应的特征向量**可以取全正**（每个分量 $>0$），且本质上唯一；
> 4. （非负矩阵的弱版本）只要 $A$ 不可约，$\lambda_1$ 仍满足上述性质。

**为什么它重要**：它保证了"**长期行为一定由那个最大的正特征值主宰**"——所以马尔可夫链一定收敛到唯一的稳态，PageRank 一定有唯一解，人口模型一定有稳定的年龄分布 ✓

## 人口增长

把人口按年龄分组，$k$ 年后的分布 $\mathbf{u}_{k+1}=L\mathbf{u}_k$，其中 $L$ 是 **Leslie 矩阵**（Leslie matrix；第一行是各年龄组的生育率，次对角线是存活率）：

$$
L=\begin{bmatrix}
f_1&f_2&f_3\\
s_1&0&0\\
0&s_2&0
\end{bmatrix}
$$

- **$\lambda_1$（谱半径）= 长期年增长率**；
- **对应的正特征向量 = 稳定年龄分布**（各年龄组比例趋于固定）✓
- 若 $\lambda_1<1$ ⇒ 人口衰减；$>1$ ⇒ 增长。——**"人口问题"在数学上就是"求一个非负矩阵的主特征值"** ✓（第 6 章的幂法可以直接算它）

## 经济学中的线性代数：消耗矩阵

**Leontief 投入产出模型**（诺贝尔经济学奖）：生产 $\mathbf{x}$ 需要消耗 $A\mathbf{x}$，还要满足最终需求 $\mathbf{d}$：

$$
\mathbf{x}=A\mathbf{x}+\mathbf{d}\qquad\Longrightarrow\qquad \boxed{\ (I-A)\mathbf{x}=\mathbf{d}\ }
$$

$A$ 叫**消耗矩阵**（每列 = 生产一单位该产品所需的投入），且**每列之和 < 1**（不可能消耗超过产出）。

> [!tip] 定理 解存在且非负
> 若 $A$ 非负且每列和 $<1$（或谱半径 $<1$），则
> $$
> (I-A)^{-1}=I+A+A^{2}+A^{3}+\cdots\ \text{（全非负）}
> $$
> 于是 $\mathbf{x}=(I-A)^{-1}\mathbf{d}$ 存在、唯一、且**全为正**（需求为正 ⇒ 产出为正，符合经济直觉）✓
> 几何级数展开还有经济学解释：$I$ 是"直接满足需求"，$A$ 是"第二轮的中间投入"，$A^{2}$ 是"第三轮"…… **每一轮都在减少**（因为 $A^{k}\to0$）。

**数值例**：$A=\begin{bmatrix}0.2&0.3\\0.4&0.1\end{bmatrix}$（列和 $0.6,0.4<1$ ✓），需求 $\mathbf{d}=(50,30)$：

$$
\mathbf{x}=(I-A)^{-1}\mathbf{d}=(90,\ 73.33)
$$

全正 ✓，且 $(I-A)^{-1}$ 的元素全非负 ✓（已验证）

> [!note] 通信方向：马尔可夫链的三个化身
> - **排队论/网络流量**：数据包在节点间转移，稳态 = 各链路负载分布；
> - **PageRank**：网页跳转矩阵的主特征向量（$\lambda=1$ 的稳态）；
> - **协议状态机/马尔可夫链模型**：稳态概率给出**吞吐率与丢包率**；
> - **自适应算法**：LMS/RLS 的收敛速度由相关矩阵的特征值扩散决定（第 6.5、7.3 节）——与"$\lvert\lambda_2/\lambda_1\rvert$ 决定收敛快慢"是同一个道理 ✓

# 10.4 线性规划

线性规划（linear programming，简写 LP）是"线性代数的彩色版"：目标函数和约束都是线性的，求最优。

## 原问题与对偶问题

> [!info] Def 4 线性规划的原问题与对偶问题
> **原问题**（primal）：
> $$
> \min\ \mathbf{c}^{T}\mathbf{x}\quad\text{s.t.}\quad A\mathbf{x}\ge\mathbf{b},\ \ \mathbf{x}\ge\mathbf{0}
> $$
> **对偶问题**（dual）：
> $$
> \max\ \mathbf{b}^{T}\mathbf{y}\quad\text{s.t.}\quad A^{T}\mathbf{y}\le\mathbf{c},\ \ \mathbf{y}\ge\mathbf{0}
> $$
> 注意两者的关系：**约束矩阵转置、$\mathbf{b}$ 与 $\mathbf{c}$ 互换、min 与 max 互换、不等号反向** ✓

> [!tip] 定理 对偶定理
> - **弱对偶**：任何可行 $\mathbf{x}$、$\mathbf{y}$ 都满足 $\mathbf{b}^{T}\mathbf{y}\le\mathbf{c}^{T}\mathbf{x}$（对偶值永远不超过原问题的值）；
> - **强对偶**：若两者都有可行解，则**最优值相等**：
>   $$
>   \min\mathbf{c}^{T}\mathbf{x}=\max\mathbf{b}^{T}\mathbf{y}
>   $$
> - **互补松弛**（complementary slackness）：最优时，$x_j>0$ 的列必然对偶约束**取等**，反之亦然——"**有剩余的方向不值钱**"。

**已验证的例子**：

$$
\min\ x_1+2x_2\quad\text{s.t.}\quad x_1+x_2\ge3,\ x_1+3x_2\ge6,\ \mathbf{x}\ge\mathbf{0}
$$

| 顶点 | $(1.5,1.5)$ | $(0,3)$ | $(6,0)$ |
| --- | --- | --- | --- |
| 目标值 $x_1+2x_2$ | **4.5** ← 最优 | 6 | 6 |

对偶问题 $\max\ 3y_1+6y_2$ s.t. $y_1+y_2\le1,\ y_1+3y_2\le2$：最优 $\mathbf{y}=(0.5,0.5)$，值 $=3(0.5)+6(0.5)=4.5$ ✓ **与原问题完全相等** ✓

## 单纯形法

> [!tip] 定理 最优解一定在顶点
> 可行域 $A\mathbf{x}\ge\mathbf{b},\ \mathbf{x}\ge\mathbf{0}$ 是一个**凸多面体**（polytope）。线性目标函数在凸多面体上的最小值**一定在某个顶点取得**（因为"往下降的方向"沿边一路走，终点是顶点）✓
> **顶点 = 若干约束取等的交点** = 从 $A$ 中挑 $n$ 行组成的可逆子方阵解出的点——**这就是"线性代数在 LP 里的全部角色：挑方阵、解方程、比较目标值"** ✓

**单纯形法**（simplex method）：从一个顶点出发，沿"让目标值下降的边"走到相邻顶点，直到不能再降。每一步都是一次**换基**（用高斯消元更新解）——**本质上是"在 $A$ 的列里换一组基"**（第 2、3 章）✓

**对偶变量的经济学含义 = 影子价格**（shadow price）：约束 $i$ 放松一个单位，目标值改善多少 ✓ —— 所以对偶不是数学游戏，而是"资源的边际价值"。

## 内点法

单纯形法虽然实用，但最坏情况下是指数复杂度。**内点法**（interior point method，Karmarkar 1984）改走"内部路径"：

- 从可行域**内部**出发，沿一条中心路径逼近最优顶点；
- 每一步解一个**牛顿方程**（用到大矩阵的线性求解——第 2、11 章的消元）；
- 复杂度是**多项式级**的 ✓

> [!tip] 单纯形 vs 内点：两种哲学
> | | 单纯形法 | 内点法 |
> | --- | --- | --- |
> | 路径 | 沿**边界**（顶点间走） | 穿过**内部**（中心路径） |
> | 每步代价 | 一次换基（消元） | 一次牛顿方程求解 |
> | 复杂度 | 实践中极快，最坏指数 | 多项式（理论保证） |
> | 输出 | 精确顶点解（稀疏） | 近似内部解（后来也发展出"顶点化"） |
> **它们都只做一件事：解大规模线性方程组。** 所以这一节和数值线性代数（第 11 章）是连着的。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 330" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la10-ax" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
    <marker id="la10-opt" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#059669"/>
    </marker>
  </defs>

  <line x1="140" y1="270" x2="470" y2="270" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la10-ax)"/>
  <line x1="170" y1="296" x2="170" y2="60" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la10-ax)"/>
  <text x="476" y="274" font-size="11" fill="var(--text-faint,#8b949e)">x₁</text>
  <text x="174" y="56" font-size="11" fill="var(--text-faint,#8b949e)">x₂</text>

  <!-- 约束线 x1+x2=3, x1+3x2=6 （比例：1 单位=40px） -->
  <!-- x1+x2=3: (3,0)-(0,3) -> (290,270)-(170,150) -->
  <line x1="290" y1="270" x2="170" y2="150" stroke="#4f46e5" stroke-width="2"/>
  <!-- x1+3x2=6: (6,0)-(0,2) -> (410,270)-(170,190) -->
  <line x1="410" y1="270" x2="170" y2="190" stroke="#db2777" stroke-width="2"/>
  <!-- 可行域（无界区域） -->
  <polygon points="290,270 410,270 170,190 170,150" fill="#059669" fill-opacity="0.10" stroke="#059669" stroke-width="1.6"/>
  <text x="196" y="150" font-size="11.5" font-weight="600" fill="#4f46e5">x₁+x₂ ≥ 3</text>
  <text x="330" y="238" font-size="11.5" font-weight="600" fill="#db2777">x₁+3x₂ ≥ 6</text>

  <!-- 顶点 -->
  <circle cx="230" cy="230" r="6" fill="#059669"/>
  <circle cx="410" cy="270" r="5" fill="var(--text-muted,#57606a)"/>
  <circle cx="170" cy="190" r="5" fill="var(--text-muted,#57606a)"/>
  <text x="238" y="222" font-size="12" font-weight="700" fill="#059669">(1.5, 1.5)：目标 = 4.5 ★</text>
  <text x="420" y="286" font-size="11" fill="var(--text-muted,#57606a)">(6, 0)：6</text>
  <text x="110" y="184" font-size="11" fill="var(--text-muted,#57606a)">(0, 3)：6</text>

  <!-- 等值线 -->
  <g stroke="#d97706" stroke-width="1.2" stroke-dasharray="6 4">
    <line x1="290" y1="150" x2="170" y2="270"/>
    <line x1="350" y1="150" x2="230" y2="270"/>
  </g>
  <text x="316" y="146" font-size="11" fill="#d97706">等值线 cᵀx = 4.5</text>
  <text x="366" y="166" font-size="11" fill="#d97706">cᵀx = 6</text>

  <text x="560" y="94" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">最优解一定在顶点</text>
  <text x="560" y="122" font-size="11.5" fill="var(--text-muted,#57606a)">目标函数是线性的 ⇒ 等值线是直线</text>
  <text x="560" y="142" font-size="11.5" fill="var(--text-muted,#57606a)">沿直线平移到"最后碰到"的位置</text>
  <text x="560" y="162" font-size="11.5" fill="var(--text-muted,#57606a)">⇒ 必与某个顶点相切</text>
  <text x="560" y="202" font-size="12" fill="#059669">对偶最优 y = (0.5, 0.5)，值同为 4.5</text>
  <text x="560" y="226" font-size="11.5" fill="var(--text-muted,#57606a)">强对偶：原问题最小值 = 对偶最大值</text>
  <text x="560" y="262" font-size="11.5" fill="var(--text-normal,#1f2328)">顶点 = 从 A 中挑 n 行组成的可逆方阵的解</text>

  <text x="420" y="318" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">线性规划的全部线性代数：挑子方阵、解方程、比较目标值、换基</text>
</svg>

> [!note] 通信方向：资源分配的通用语言
> **功率分配**（注水算法的离散版就是 LP/凸优化）、**子载波与比特分配**、**路由与流量的网络优化**、**频谱分配**、**波束成形中的功率约束**——都是"在资源的线性约束下最大化速率（线性目标）"。而**对偶变量 = 影子价格**告诉工程人员"多给一单位功率/带宽能换来多少速率"✓

# 10.5 傅里叶级数：用线性代数研究函数

第 8 章说过"函数也是向量"。这一节把"傅里叶级数"整件事翻译成线性代数的语言——**它不过是一次投影**。

## 傅里叶级数

> [!info] Def 5 傅里叶级数
> 周期为 $2\pi$ 的函数可以展开成三角函数基的线性组合：
> $$
> f(x)=a_0+\sum_{k=1}^{\infty}\bigl(a_k\cos kx+b_k\sin kx\bigr)
> $$
> - 基向量：$\{1,\cos x,\sin x,\cos2x,\sin2x,\dots\}$（**无穷维的基**）；
> - 内积：$\langle f,g\rangle=\displaystyle\int_{-\pi}^{\pi}f(x)g(x)\,\mathrm{d}x$；
> - 这组基**互相正交**：$\int_{-\pi}^{\pi}\cos kx\cos lx\,\mathrm{d}x=0\ (k\ne l)$ ✓

**对称性的用处**（省一半计算）：

| 函数的奇偶性 | 展开里只剩 |
| --- | --- |
| **偶函数** $f(-x)=f(x)$ | 只有 $\cos$ 项 |
| **奇函数** $f(-x)=-f(x)$ | 只有 $\sin$ 项 |

## 傅里叶系数

把"求系数"这件事看作**投影**（第 4 章）：

> [!tip] 定理 傅里叶系数 = 投影坐标
> $$
> a_0=\frac{1}{2\pi}\int_{-\pi}^{\pi}f\,\mathrm{d}x,\qquad
> a_k=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cos kx\,\mathrm{d}x,\qquad
> b_k=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin kx\,\mathrm{d}x
> $$
> 每个系数就是 $f$ 在那个基方向上的**投影**：$c_k=\dfrac{\langle f,\phi_k\rangle}{\langle\phi_k,\phi_k\rangle}$ ✓
> **正交性让"求系数"不需要解方程组**——这是第 4 章"标准正交基"在函数空间的翻版。

**例（方波）**：$f(x)=1\ (0<x<\pi)$，$f(x)=-1\ (-\pi<x<0)$（奇函数 ⇒ 只有 $\sin$）：

$$
b_k=\frac{2}{k\pi}\bigl(1-\cos k\pi\bigr)=\begin{cases}\dfrac{4}{k\pi},&k\ \text{奇}\\[4pt]0,&k\ \text{偶}\end{cases}
$$

$$
f(x)=\frac4\pi\left(\sin x+\frac{\sin 3x}{3}+\frac{\sin 5x}{5}+\cdots\right)
$$

前三个系数：$b_1=\dfrac{4}{\pi}\approx1.2732$、$b_3\approx0.4244$、$b_5\approx0.2546$ ✓（已验证）

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 330" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la10-ax2" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <line x1="140" y1="170" x2="466" y2="170" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la10-ax2)"/>
  <line x1="300" y1="260" x2="300" y2="60" stroke="var(--text-faint,#8b949e)" stroke-width="1" marker-end="url(#la10-ax2)"/>
  <text x="470" y="174" font-size="11" fill="var(--text-faint,#8b949e)">x</text>
  <text x="304" y="56" font-size="11" fill="var(--text-faint,#8b949e)">f</text>
  <text x="196" y="186" font-size="11" fill="var(--text-faint,#8b949e)">−π</text>
  <text x="396" y="186" font-size="11" fill="var(--text-faint,#8b949e)">π</text>

  <!-- 方波 -->
  <path d="M150,230 300,230 300,110 450,110" fill="none" stroke="var(--text-normal,#1f2328)" stroke-width="2.2"/>
  <text x="212" y="248" font-size="11" fill="var(--text-normal,#1f2328)">方波（目标函数）</text>

  <!-- S1 -->
  <path d="M150,170 165,194 180,215 195,232 210,243 225,246 240,243 255,232 270,215 285,194 300,170 315,146 330,125 345,108 360,97 375,94 390,97 405,108 420,125 435,146 450,170" fill="none" stroke="#4f46e5" stroke-width="1.8"/>
  <!-- S5 -->
  <path d="M150,170 158,204 165,229 172,241 180,239 188,231 195,224 202,223 210,228 218,234 225,236 232,234 240,228 248,223 255,224 262,231 270,239 278,241 285,229 292,204 300,170 308,136 315,111 322,99 330,101 338,109 345,116 352,117 360,112 368,106 375,104 382,106 390,112 398,117 405,116 412,109 420,101 428,99 435,111 442,136 450,170" fill="none" stroke="#059669" stroke-width="1.8" stroke-dasharray="7 4"/>

  <text x="520" y="96" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">用级数逼近方波</text>
  <text x="520" y="126" font-size="12" fill="#4f46e5">— S₁ = (4/π) sin x（1 项）</text>
  <text x="520" y="152" font-size="12" fill="#059669">-- S₅（加到 sin5x/5）</text>
  <text x="520" y="182" font-size="11.5" fill="var(--text-muted,#57606a)">项数越多越接近方波；跳变附近</text>
  <text x="520" y="202" font-size="11.5" fill="var(--text-muted,#57606a)">总有约 9% 的过冲（吉布斯现象）</text>
  <text x="520" y="238" font-size="12" fill="var(--text-normal,#1f2328)">b₁ : b₃ : b₅ = 1 : 1/3 : 1/5</text>
  <text x="520" y="262" font-size="11.5" fill="var(--text-muted,#57606a)">系数按 1/k 衰减 —— 方波"不光滑"</text>
  <text x="520" y="288" font-size="11.5" fill="#4f46e5">系数 = f 在各基函数上的投影</text>

  <text x="420" y="318" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">函数空间里的"正交基 + 投影"：与 R^n 里求坐标完全同一件事</text>
</svg>

## 与R^n中的线性代数的比较

> [!tip] 对照表：$\mathbb{R}^{n}$ 与函数空间（★ 本节的核心）
> | $\mathbb{R}^{n}$ | 函数空间 | 备注 |
> | --- | --- | --- |
> | 向量 $\mathbf{v}$ | 函数 $f(x)$ | 都是"可以线性组合的东西" |
> | 点积 $\mathbf{v}^{T}\mathbf{w}=\sum v_iw_i$ | 内积 $\int f g\,\mathrm{d}x$ | **求和 → 积分** |
> | 正交 $\mathbf{v}^{T}\mathbf{w}=0$ | $\int fg=0$ | 定义不变 |
> | 标准正交基 $\mathbf{q}_1,\dots,\mathbf{q}_n$ | $1,\cos kx,\sin kx,\dots$ | 无穷多 |
> | 坐标 $c_k=\mathbf{q}_k^{T}\mathbf{v}$ | 傅里叶系数 $c_k=\frac{\langle f,\phi_k\rangle}{\langle\phi_k,\phi_k\rangle}$ | **都是投影** |
> | 帕塞瓦尔 $\lVert\mathbf{v}\rVert^{2}=\sum c_k^{2}$ | $\frac1\pi\int f^{2}=\sum(a_k^{2}+b_k^{2})$ | **能量守恒**（Parseval's theorem，第 9 章的酉性） |
> | 有限维（$n$ 个基） | 无穷维（可数无穷个基） | 需要谈"收敛"（均方收敛） |
> | 矩阵 $A$ | 线性算子（诸如 $\mathrm{d}/\mathrm{d}x$） | 第 8 章 |
> **结论：傅里叶级数不是"新东西"，它就是 $\mathbb{R}^n$ 那套东西搬到函数空间——只不过"求和"换成了"积分"。**

> [!note] 通信方向：从傅里叶级数到 OFDM
> - 周期信号 → 傅里叶级数（离散的谐波 $k=0,1,2,\dots$）；非周期信号 → 傅里叶变换（连续的 $\omega$）；
> - **OFDM 的子载波** $\{e^{j2\pi kt/T}\}$ 就是"周期 $T$ 的函数空间的一组正交基"（第 9 章的单位根！）——**子载波正交 = 基正交** ✓
> - **功率谱**是能量的分布，**帕塞瓦尔定理**保证"时域能量 = 频域能量"（第 9 章的酉性）✓
> - **滤波与均衡**在频域逐频率处理 = 用特征函数当基（第 8 章）✓

# 10.6 计算机图形学

图形学的每一次"移动/转动/缩放/投影"，都是第 8 章的线性变换；唯一的**例外是平移**，而解决它只需一个技巧。

> [!warning] 平移不是线性变换
> 因为线性变换必须把原点送到原点（第 8 章），而平移 $T(\mathbf{v})=\mathbf{v}+\mathbf{v}_0$ 把原点挪走了 ⇒ **它不能用"乘一个矩阵"表示**。
> 但图形学里平移又特别常用。怎么办？

> [!tip] 技巧：加一维，把平移变线性
> **齐次坐标**（homogeneous coordinates）：给向量**加一个恒为 1 的分量**，于是 $n$ 维的问题变成 $n+1$ 维的**线性**问题：
> $$
> \text{平移}(t_x,t_y):\ \begin{bmatrix}1&0&t_x\\0&1&t_y\\0&0&1\end{bmatrix}
> \begin{bmatrix}x\\y\\1\end{bmatrix}=\begin{bmatrix}x+t_x\\y+t_y\\1\end{bmatrix}\ \checkmark
> $$
> $$
> \text{旋转 }\theta:\ \begin{bmatrix}\cos\theta&-\sin\theta&0\\\sin\theta&\cos\theta&0\\0&0&1\end{bmatrix},\qquad
> \text{缩放}(s_x,s_y):\ \begin{bmatrix}s_x&0&0\\0&s_y&0\\0&0&1\end{bmatrix}
> $$
> **代价**：多一维；**回报**：平移也变成了"乘矩阵"，于是所有变换可以**统一地复合**（矩阵相乘）✓

> [!tip] 复合顺序不能换（第 8 章的非交换性）
> **先平移 $(2,3)$ 再旋转 $90°$**：
> $$
> R\,T=\begin{bmatrix}0&-1&0\\1&0&0\\0&0&1\end{bmatrix}\begin{bmatrix}1&0&2\\0&1&3\\0&0&1\end{bmatrix}
> =\begin{bmatrix}0&-1&-3\\1&0&2\\0&0&1\end{bmatrix}
> $$
> 作用于点 $(1,1)$：先平移得 $(3,4)$，再转 $90°$ 得 $(-4,3)$ ✓ 与矩阵乘法结果一致 ✓
> **先旋转再平移**会得到完全不同的结果——所以图形学里"变换的顺序"是关键参数（渲染管线里叫 **变换栈**）。

**三维与透视**：3D 用 $4\times4$ 齐次矩阵；**透视投影**把远处的物体缩小（除以深度），写成矩阵形式后连"除法"也统一进来了（做完矩阵乘法再除以最后一个分量，即**透视除法**）✓

> [!note] 通信/工程方向：几何变换不止用于画图
> - **机器人学 / SLAM**：位姿 = 齐次变换矩阵的连乘（旋转 + 平移）；轨迹优化 = 在矩阵群上做优化；
> - **阵列信号处理**：均匀线阵的**方向向量** $\mathbf{a}(\theta)=[1,e^{j\phi},\dots]^{T}$ 其实就是"把相位旋转写成几何"（第 9 章）——**波束成形 = 对着某个方向做复数加权**，与图形学的旋转矩阵是同一类对象；
> - **MIMO 预编码**：用酉矩阵"旋转"发射信号（第 9 章），本质上是几何变换加上了"保能量"的约束 ✓

# 10.7 密码学中的线性代数

密码学用到的线性代数有一个特点：**一切都在"有限"的世界里做**——因为字母表是有限的，而有限的算术世界里"除不尽"是常态。

## 模算术

> [!info] Def 6 模算术
> **模算术**（modular arithmetic）：$a\equiv b\pmod p$ 表示 $a-b$ 能被 $p$ 整除。在 $\{0,1,\dots,p-1\}$ 上可以做加减乘：
> - **加法/乘法**：算完取余即可；
> - **除法**：$a^{-1}$ 存在 $\iff \gcd(a,p)=1$（$a$ 与 $p$ 互素）✓
> - 当 $p$ 是**素数**时，每个非零元都有逆 ⇒ $\mathbb{Z}_p$ 是一个**域**（field），此时它可以像 $\mathbb{R}$ 一样做线性代数！

## 谜式密码机和希尔密码

**谜式密码机**（Enigma）：本质上是**一串置换矩阵**（每按一次键换一个接线），它的破译史说明了一件事：**线性结构 + 已知明文 = 危险**。

**希尔密码**（Hill cipher，1929）：直接**用矩阵乘法加密一组字母**——这是最早的"分组密码"之一：

$$
\mathbf{c}=K\mathbf{p}\pmod{26},\qquad \mathbf{p}=K^{-1}\mathbf{c}\pmod{26}
$$

（把字母数字化：A=0, B=1, …, Z=25；每 $n$ 个字母打包成一个向量。）

## 矩阵的模算术

> [!tip] 定理 矩阵在模 $p$ 下可逆的条件
> $K$ 在模 $p$ 下可逆 $\iff \det K$ 与 $p$ **互素**：
> $$
> \gcd(\det K,\ p)=1
> $$
> 此时 $K^{-1}=\bigl(\det K\bigr)^{-1}\cdot(\text{伴随矩阵})$，全部运算在模 $p$ 下进行 ✓
> **第 5 章的"逆矩阵公式 $A^{-1}=C^{T}/\det A$"在这里原样使用**——只不过"除以 $\det$"要换成"乘以 $\det$ 在模 $p$ 下的逆元"✓

## 使用希尔密码算法加密

**已验证的完整例子**（模 26）：

$$
K=\begin{bmatrix}3&3\\2&5\end{bmatrix},\qquad \det K=9,\qquad \gcd(9,26)=1\ \checkmark\ \text{可逆}
$$

$$
9^{-1}\equiv3\pmod{26}\quad(\text{因为 }9\times3=27\equiv1)\qquad\Longrightarrow\qquad
K^{-1}=3\begin{bmatrix}5&-3\\-2&3\end{bmatrix}=\begin{bmatrix}15&17\\20&9\end{bmatrix}\pmod{26}
$$

| 步骤 | 计算 | 结果 |
| --- | --- | --- |
| 明文 "HI" | $\mathbf{p}=(7,8)^{T}$ | H=7, I=8 |
| 加密 $K\mathbf{p}$ | $(3\cdot7+3\cdot8,\ 2\cdot7+5\cdot8)=(45,54)\bmod26=(19,2)$ | **"TC"** |
| 解密 $K^{-1}\mathbf{c}$ | $(15\cdot19+17\cdot2,\ 20\cdot19+9\cdot2)=(319,398)\bmod26=(7,8)$ | **"HI"** ✓ |

> [!warning] 反例：不可逆的密钥
> $K=\begin{bmatrix}1&2\\2&4\end{bmatrix}$：$\det K=0$ ⇒ 模 $26$ 下不可逆 ⇒ **密文无法唯一还原**（同一个密文对应多个明文）。
> 更隐蔽的陷阱：$\det K=13$ 时 $\gcd(13,26)=13\ne1$ ⇒ 也不可逆！**所以选密钥必须检查 $\gcd(\det K,26)=1$**——这正是第 5 章"可逆 ⟺ 行列式非零"在有限世界里的加强版（**非零还不够，还要与模数互素**）✓

## 有限域和有限维向量空间

> [!tip] $\mathbb{Z}_p$ 上的线性代数
> 当 $p$ 为素数时，$\mathbb{Z}_p$ 满足域的全部公理，成为一个**有限域**（finite field），于是第 1–9 章的线性代数**几乎全部照搬**：
> - $\mathbb{Z}_p^{n}$ 是**有限维向量空间**，只有 $p^{n}$ 个向量；
> - 子空间、基、维数、秩、行列式都有定义（第 3、5 章）；
> - **两个向量正交** = 内积 $\equiv0\pmod p$（第 4 章）✓
>
> **最小的例子**（第 3 章见过的 $\mathbb{F}^{2}$）：$p=2$ 时只有 4 个向量 $\{00,01,10,11\}$，加法是模 2 加法（$1+1=0$）——**这就是二进制世界的全部算术**。

> [!note] 通信方向：有限域线性代数是纠错码的地基
> **本章与差错控制编码的关系，比与密码学的关系更紧密**：
> - **线性分组码**（linear block code）：$(n,k)$ 码的全部码字构成 $\mathbb{F}_2^{n}$ 中的一个 $k$ 维**子空间**（第 3 章）！生成矩阵 $G$ 的 $k$ 行是一组基，校验矩阵 $H$ 的行空间是**对偶码**，"校验通过"就是 $H\mathbf{c}^{T}=\mathbf{0}$ ⇒ **码空间 = $\mathbf{N}(H)$** ✓
> - **纠错能力**：最小距离 $d$（码子空间里最"稀疏"的非零码字）决定能纠几个错；
> - **Reed–Solomon / BCH**：在更大的有限域 $\mathbb{F}_{2^m}$ 上做线性代数（RS 码是 5G 数据信道与 QR 码的核心）；
> - **循环码**：码字是多项式（第 8 章的函数空间），"循环移位不变"本质上是一个**置换矩阵**的作用（本章 10.6/10.7 的脉络在这里汇合）✓
> - **MIMO 与网络编码**：随机线性网络编码 = 在有限域上解线性方程组 ✓
> 一句话：**"有限域上的线性代数"就是数字通信的母语**（[[vault-notes/communication/11-error-control-coding]]）。

> [!tip] 本章收官
> 七个应用，七个"老概念的新衣服"：
> | 应用 | 用到的核心概念 |
> | --- | --- |
> | 10.1 图与网络 | **四子空间**（四子空间 = 电位/电压/电流/环流）＋拉普拉斯矩阵 $A^{T}CA$ |
> | 10.2 工程矩阵 | 差分 ⇒ **三对角刚度矩阵**；边界条件决定**正定/奇异**（＝零空间有没有常数向量） |
> | 10.3 马尔可夫与经济 | **特征值 1 与稳态**；佩隆–弗罗贝尼乌斯；Leontief 的 $(I-A)^{-1}$ |
> | 10.4 线性规划 | **顶点** = 子方阵的解；对偶 = 影子价格 |
> | 10.5 傅里叶级数 | **正交基 + 投影**（函数空间的第 4 章） |
> | 10.6 图形学 | **齐次坐标**：加一维把平移变线性；复合 = 矩阵相乘 |
> | 10.7 密码学 | **模算术** + 矩阵可逆（$\gcd(\det, p)=1$）；有限域线性代数 |
> 一句话：**线性代数之所以"到处都是"，是因为现实世界里"线性叠加"到处都是——而这一章就是把它们指给你看。**

## 本章知识地图

```
线性代数的应用：七个场景，七件"旧概念的新衣服"
  ├─ 10.1 图和网络
  │      ├── 关联矩阵 A（m×n：行=边，列=节点）
  │      ├── 四子空间 = 物理量：N(A) 常数电位｜C(Aᵀ) 电压差
  │      │      C(A) 满足 KCL 的电流｜N(Aᵀ) 环流（m-n+1 = 独立回路数）
  │      ├── A x = e（电位差）、Aᵀy = f（基尔霍夫电流定律）
  │      ├── AᵀCA x = f：节点电位方程（对称正定）
  │      └── 拉普拉斯 L = AᵀA：对角元 = 度数；行和 0；零特征值个数 = 连通分量数
  │
  ├─ 10.2 工程学中的矩阵
  │      ├── -(c u')' = f（弹性/热/扩散/静电/传输线）
  │      ├── 差分 ⇒ 刚度矩阵 K = tridiag(-1, 2, -1)
  │      ├── 边界条件决定 K：固定-固定 / 固定-自由 ⇒ **正定**
  │      │      自由-自由 / 弹簧圈 ⇒ **奇异**（零空间 = 常数 = 整体平移）
  │      ├── 特征值 2 - 2cos(kπ/(n+1)) = 固有频率²；特征向量 = 振型
  │      └── 弹簧圈是循环矩阵 ⇒ 特征向量 = 傅里叶基（可用 FFT 求解）
  │
  ├─ 10.3 马尔可夫、人口与经济
  │      ├── 马尔可夫矩阵：列和 1、非负 ⇒ λ=1 是特征值，稳态 = 对应特征向量
  │      ├── 佩隆-弗罗贝尼乌斯：正矩阵的主特征值唯一、单根、特征向量全正
  │      ├── 人口：Leslie 矩阵，λ₁ = 长期增长率，特征向量 = 稳定年龄分布
  │      └── 经济：Leontief (I-A)x = d；(I-A)⁻¹ = I + A + A² + … 全非负
  │
  ├─ 10.4 线性规划
  │      ├── min cᵀx s.t. Ax ≥ b, x ≥ 0 ↔ 对偶 max bᵀy s.t. Aᵀy ≤ c, y ≥ 0
  │      ├── 弱对偶 bᵀy ≤ cᵀx；强对偶：最优值相等（例：4.5 = 4.5）
  │      ├── 最优解必在顶点（顶点 = A 的可逆子方阵的解）
  │      ├── 单纯形法：沿顶点换基；内点法：内部路径 + 牛顿方程
  │      └── 对偶变量 = 影子价格（资源的边际价值）
  │
  ├─ 10.5 傅里叶级数
  │      ├── f = a₀ + Σ(a_k cos kx + b_k sin kx)；基正交（∫ cos kx cos lx = 0）
  │      ├── 系数 = 投影：a_k = (1/π)∫f cos kx、b_k = (1/π)∫f sin kx
  │      ├── 方波例：b_k = 4/(kπ)（k 奇）⇒ 4/π, 4/3π, 4/5π = 1.273, 0.424, 0.255
  │      └── 与 Rⁿ 对照：求和↔积分、点积↔内积、坐标↔系数、帕塞瓦尔↔能量守恒
  │
  ├─ 10.6 计算机图形学
  │      ├── 平移不是线性变换 ⇒ 齐次坐标（加一个 1，变 n+1 维线性问题）
  │      ├── 平移/旋转/缩放/透视都是 3×3 或 4×4 矩阵
  │      └── 复合 = 矩阵相乘，**顺序不能换**（先平移后旋转 ≠ 先旋转后平移）
  │
  └─ 10.7 密码学中的线性代数
         ├── 模算术：a⁻¹ 存在 ⟺ gcd(a,p)=1；p 为素数时 Z_p 是域
         ├── Hill 密码：c = Kp (mod 26)，p = K⁻¹c
         ├── 可逆条件：gcd(det K, p) = 1（例 K=[[3,3],[2,5]]，det=9，"HI"→"TC"→"HI"）
         ├── 陷阱：det = 13 时虽非零但不可逆（gcd(13,26) ≠ 1）
         └── 有限域 F_p 上的线性代数 ⇒ 纠错码的地基（第 11 章差错控制编码）
```

## 关联

- 上一章：[[vault-notes/math/linear-algebra/09-complex-vectors-matrices]]
- 下一章：[[vault-notes/math/linear-algebra/11-numerical-linear-algebra]]

**本章与前面章节的接口**（本章是对前九章的一次"巡礼"）：

| 前面的概念 | 本章的落点 |
| --- | --- |
| 第 3 章：子空间、基、维数、秩 | 10.1 关联矩阵的四子空间 = 电位的四件物理量；10.7 有限域上的子空间 = 纠错码 |
| 第 3 章：秩-零化度 $r+(n-r)=n$ | 10.1 的 $n-m+1$（独立回路数）= 欧拉公式；10.2 的"边界条件决定秩" |
| 第 4 章：正交基、投影 | 10.5 傅里叶系数 = 投影；正交性使系数无需解方程 |
| 第 5 章：$\det$ 与逆矩阵公式 | 10.7 Hill 密码：$\gcd(\det K,26)=1$ 才可逆；$K^{-1}=C^{T}/\det K$（模运算版） |
| 第 6 章：特征值、稳态、谱半径 | 10.1 拉普拉斯谱（连通性）；10.2 固有频率；10.3 稳态与佩隆-弗罗贝尼乌斯；10.4 无；10.5 无 |
| 第 6.5 节：正定、最小值 | 10.2 刚度矩阵正定 ⟺ 有唯一平衡；10.4 LP 的凸性 |
| 第 7 章：SVD、条件数 | 10.1/10.2 的网络与结构问题里的数值稳定性；10.4 内点法的线性求解 |
| 第 8 章：线性变换、相似、好基 | 10.6 齐次坐标（平移非线性的补齐）；10.5 函数空间的算子 |
| 第 9 章：复数、酉、FFT | 10.2 弹簧圈（周期）⇒ 傅里叶基对角化 ⇒ FFT 求解 |

**通信方向应用**：

- [[vault-notes/communication/11-error-control-coding]] —— **本章 10.7 与这一节的接口最深**：有限域 $\mathbb{F}_2$（或 $\mathbb{F}_{2^m}$）上的线性代数是纠错码的地基——$(n,k)$ 线性分组码是 $k$ 维子空间（第 3 章）、生成矩阵的行是基、校验矩阵 $H\mathbf{c}^{T}=\mathbf{0}$ 就是 $\mathbf{N}(H)$、"最小距离"衡量纠错能力、Reed–Solomon 与 BCH 用扩展域、循环码的本质是"循环移位置换矩阵"（第 8 章）；而**模算术下的矩阵可逆条件 $\gcd(\det,p)=1$** 与"码的检错能力"是同一类思想。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 10.1 的网络模型直接对应通信网的拓扑与流量（路由、割集、谱聚类）；10.4 的线性规划是**功率分配/资源调度**的通用框架（注水算法是它的凸优化版本，"对偶变量 = 影子价格"告诉工程师多一单位功率能换多少速率）；10.5 的傅里叶级数则是 OFDM（子载波正交）与频谱分析的数学原型；10.2 的三对角系统出现在**信道均衡**与**分布式天线/传感器网络**里。
- [[vault-notes/communication/09-optimal-reception]] —— 10.5 的"函数空间 = 向量空间"是信号空间理论的直接来源：**正交基 + 投影**就是相关接收的判据（把接收信号投影到各信号方向上）；10.6 的旋转/酉变换则对应**星座旋转与相位估计**。
- [[vault-notes/math/linear-algebra/10-applications]] —— 本章就是这份骨架的展开。
- [[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]] —— 10.3 的稳态、10.2 的固有频率、10.1 的拉普拉斯谱：**"长期行为/振动模式/网络结构"三件看似无关的事，都是特征值问题**。

**相关**：[[vault-notes/math/linear-algebra/09-complex-vectors-matrices]]｜[[vault-notes/math/linear-algebra/11-numerical-linear-algebra]]｜[[vault-notes/communication/11-error-control-coding]]
