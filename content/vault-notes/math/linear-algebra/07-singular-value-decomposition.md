---
title: "奇异值分解"
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
> 第 6 章的特征值分解只对"方阵 + 可对角化"的矩阵成立。本章的分解**对任何形状的矩阵都存在，而且数值上极其稳定**——它是线性代数的"终极武器"。
>
> - **7.1** 图像处理：图像就是矩阵；SVD 把矩阵拆成**一叠秩一图层**，保留前几层就是压缩，而误差正好等于**下一个奇异值**
> - **7.2** 基与矩阵：$A=U\Sigma V^{T}$ 从哪来（$A^TA$ 的特征分解）；**SVD 同时给四个子空间各配一组标准正交基**——第 4 章那张图终于配齐了；伪逆 $A^{+}$ 与最小二乘的正解
> - **7.3** 主成分分析：PCA 就是"**去中心化数据矩阵的 SVD**"——找方差最大的方向，用来降维、去相关、抽特征
> - **7.4** 几何背景：$A$ 把**单位球变成椭球**，半轴长 = 奇异值、半轴方向 = 左奇异向量；条件数 = 椭球的扁度
>
> 一句话主线：**SVD 是"任何矩阵都能用的特征分解"——它把矩阵读成"旋转 → 沿坐标轴拉伸 → 再旋转"，拉伸倍数就是奇异值。**

> [!note] 记号约定
> - $A$：$m\times n$ 矩阵（**本章不再要求方阵**，这是 SVD 最大的好处）
> - $U$：$m\times m$ 正交矩阵；$V$：$n\times n$ 正交矩阵；$\Sigma$：$m\times n$ 对角矩阵
> - $\sigma_i$：**奇异值**，按 $\sigma_1\ge\sigma_2\ge\cdots\ge\sigma_r>0$ 排列，其余全为 $0$；$r=\operatorname{rank}(A)$
> - $\mathbf{u}_i$（$U$ 的列）= **左奇异向量**（left singular vector）；$\mathbf{v}_i$（$V$ 的列）= **右奇异向量**（right singular vector）
> - $A^{+}$：伪逆；$\|A\|_2$：谱范数（最大拉伸）；$\|A\|_F$：Frobenius 范数
> - 7.3 里 $X$：数据矩阵（每行一个样本）；$S$：协方差矩阵

# 7.1 基于线性代数的图像处理

先看一个"看得见"的用途，再回头讲原理。

## 图像就是一个矩阵

一张灰度图不过是**一堆像素值排成的矩形阵列**——每格 0（黑）到 255（白），于是它天然就是一个矩阵 $A$（$m\times n$ = 图的高度 × 宽度）。彩色图则是三个矩阵（红、绿、蓝各一个）。

一旦把图像当矩阵，矩阵的一切分解术都能用在它身上。而 SVD 给出的分解特别合心意：

$$
A=\sigma_1\mathbf{u}_1\mathbf{v}_1^{T}+\sigma_2\mathbf{u}_2\mathbf{v}_2^{T}+\cdots+\sigma_r\mathbf{u}_r\mathbf{v}_r^{T}
\qquad(\sigma_1\ge\sigma_2\ge\cdots>0)
$$

> [!info] Def 1 奇异值分解
> 任何 $m\times n$ 矩阵都能写成
> $$\boxed{\ A=U\Sigma V^{T}\ }$$
> 其中 $U$（$m\times m$）、$V$（$n\times n$）都是**正交矩阵**（$U^{T}U=I$、$V^{T}V=I$），$\Sigma$ 是 $m\times n$ 的**对角**矩阵，对角元 $\sigma_1\ge\sigma_2\ge\cdots\ge\sigma_r>0$，其余为 $0$。
> 这就是**奇异值分解**（singular value decomposition，简称 **SVD**）——它和第 6 章的 $A=S\Lambda S^{-1}$ 是"同一种思想的两个版本"，但适用面宽得多：**不需要方阵，也不需要可对角化**。

> [!tip] 把 SVD 读成"一叠图层"
> 展开 $U\Sigma V^{T}$ 就等于把矩阵拆成**若干秩一矩阵之和**：
> $$A=\sum_{i=1}^{r}\underbrace{\sigma_i\mathbf{u}_i\mathbf{v}_i^{T}}_{\text{第 }i\text{ 层（秩一）}}$$
> 每一层 $\mathbf{u}_i\mathbf{v}_i^{T}$ 是"**一列图案 × 一行图案**"：$\mathbf{u}_i$ 描述纵向的明暗轮廓、$\mathbf{v}_i$ 描述横向的明暗轮廓，而 $\sigma_i$ 说明这一层"有多强"。
> - $\sigma_1$ 那一层是图像的**主体明暗**（大面积轮廓）；
> - 后面的层逐级承载更细的结构与纹理；
> - 最后那些极小的 $\sigma$ 里装的其实多半是**噪声**。

**最小的例子**：秩一的"图像" $A=\begin{bmatrix}1&2\\3&6\end{bmatrix}$——两列成比例，一列图案就够：

$$
\sigma_1=\|A\|_F=\sqrt{1+4+9+36}=\sqrt{50}=5\sqrt2,\qquad
A=\sigma_1\mathbf{u}_1\mathbf{v}_1^{T},\quad \mathbf{u}_1=\frac{1}{\sqrt{10}}\begin{bmatrix}1\\3\end{bmatrix},\ \mathbf{v}_1=\frac{1}{\sqrt5}\begin{bmatrix}1\\2\end{bmatrix}
$$

一层讲完整个矩阵，$\sigma_2=0$ ✓（可验算 $\sigma_1\mathbf{u}_1\mathbf{v}_1^{T}=\frac{5\sqrt2}{\sqrt{50}}\begin{bmatrix}1&2\\3&6\end{bmatrix}=A$ ✓）

## 秩一图层：SVD 是一叠图案的和

| 成分 | 数学身份 | 图像上的角色 |
| --- | --- | --- |
| $\sigma_1,\sigma_2,\dots$ | 奇异值（单一叠层的重要性） | 从"主体"到"细节"再到"噪声" |
| $\mathbf{u}_i$ | $U$ 的列（左奇异向量） | 第 $i$ 层的**纵向**轮廓 |
| $\mathbf{v}_i$ | $V$ 的列（右奇异向量） | 第 $i$ 层的**横向**轮廓 |
| $\mathbf{u}_i\mathbf{v}_i^{T}$ | 秩一矩阵（第 $i$ 层） | 一张"图案" |
| $r$ | 非零奇异值个数 = 秩 | 图像真正的"自由度" |

> [!tip] 秩 = 非零奇异值的个数
> $$\operatorname{rank}(A)=r=\#\{\sigma_i>0\}$$
> 而且**数值上判秩比行列式可靠得多**：第 5 章警告过"$n$ 阶矩阵算 $\det$ 在数值上不可靠"，工程上判"数值秩"普遍用"数一数有多少个 $\sigma_i$ 大于容差"。（$\lvert\det A\rvert=\sigma_1\sigma_2\cdots\sigma_n$ 对方阵成立——第 5 章"体积缩放"在这里被拆成"每个方向各拉伸 $\sigma_i$ 倍"。）

## 低秩近似 = 压缩（误差就是下一个奇异值）

既然 $\sigma$ 是从大到小排的，那么"只保留前 $k$ 层"就自然成了压缩方案。奇妙的是，这样做的误差有**精确的公式**：

> [!tip] 定理 最佳低秩逼近（Eckart–Young）
> 设 $A_k=\sum_{i=1}^{k}\sigma_i\mathbf{u}_i\mathbf{v}_i^{T}$（只留前 $k$ 层），则 $A_k$ 是**所有秩不超过 $k$ 的矩阵中离 $A$ 最近的那个**，且误差就是被丢掉的那些奇异值：
> $$\text{谱范数误差}\quad\|A-A_k\|_2=\sigma_{k+1},\qquad
> \text{Frobenius 误差}\quad\|A-A_k\|_F=\sqrt{\sigma_{k+1}^2+\cdots+\sigma_r^2}$$
> **这句话的份量**：**低秩近似**（low-rank approximation）不是"碰巧好用"的启发式，而是**数学上最优**的——没有任何秩 $k$ 矩阵能比它更接近 $A$。

**数值验证**（$A=\begin{bmatrix}3&0&1\\0&2&0\\1&0&3\end{bmatrix}$，$\sigma=(4,2,2)$）：

$$
A_1=4\mathbf{u}_1\mathbf{v}_1^{T}=\begin{bmatrix}2&0&2\\0&0&0\\2&0&2\end{bmatrix},\qquad
\|A-A_1\|_2=\sigma_2=2,\qquad \|A-A_1\|_F=\sqrt{2^2+2^2}=\sqrt8\ \checkmark
$$

**压缩算术**：存原图要 $mn$ 个数；存低秩近似只需 $k$ 个 $\sigma$ 加 $k(m+n)$ 个数（$k$ 列 $U$ + $k$ 行 $V^{T}$）：

$$
\text{压缩比}=\frac{mn}{k(m+n)+k}
\qquad\text{例：}1000\times1000\text{ 的图、}k=50\ \Rightarrow\ \frac{10^6}{50\times2000+50}\approx10\ \text{倍}
$$

> [!tip] $\sigma$ 衰减得有多快，决定能压多少
> 工程判断很简单：**画出 $\sigma_i$ 关于 $i$ 的曲线，看它"掉"得有多快**。掉得快 ⇒ 少量层就够（可压缩）；掉得慢 ⇒ 秩高、不可压缩。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 300" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la7-a1" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>
  <!-- 左：衰减快 -->
  <text x="170" y="42" text-anchor="middle" font-size="13" font-weight="600" fill="#059669">衰减快 ⇒ 可压缩</text>
  <line x1="80" y1="250" x2="300" y2="250" stroke="var(--text-faint,#8b949e)" stroke-width="1.2" marker-end="url(#la7-a1)"/>
  <line x1="100" y1="258" x2="100" y2="60" stroke="var(--text-faint,#8b949e)" stroke-width="1.2" marker-end="url(#la7-a1)"/>
  <rect x="106" y="80" width="22" height="170" fill="#059669" fill-opacity="0.75"/>
  <rect x="136" y="160" width="22" height="90" fill="#059669" fill-opacity="0.6"/>
  <rect x="166" y="204" width="22" height="46" fill="#059669" fill-opacity="0.5"/>
  <rect x="196" y="226" width="22" height="24" fill="#059669" fill-opacity="0.4"/>
  <rect x="226" y="238" width="22" height="12" fill="#059669" fill-opacity="0.3"/>
  <rect x="256" y="244" width="22" height="6" fill="#059669" fill-opacity="0.25"/>
  <text x="117" y="272" font-size="11" fill="var(--text-muted,#57606a)">σ₁</text>
  <text x="267" y="272" font-size="11" fill="var(--text-muted,#57606a)">σ₇</text>
  <text x="170" y="292" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">自然图像 / 低秩过程：前几层就抓住主要能量</text>
  <!-- 右：衰减慢 -->
  <text x="620" y="42" text-anchor="middle" font-size="13" font-weight="600" fill="#dc2626">衰减慢 ⇒ 不可压缩</text>
  <line x1="530" y1="250" x2="750" y2="250" stroke="var(--text-faint,#8b949e)" stroke-width="1.2" marker-end="url(#la7-a1)"/>
  <line x1="550" y1="258" x2="550" y2="60" stroke="var(--text-faint,#8b949e)" stroke-width="1.2" marker-end="url(#la7-a1)"/>
  <rect x="556" y="90" width="22" height="160" fill="#dc2626" fill-opacity="0.55"/>
  <rect x="586" y="96" width="22" height="154" fill="#dc2626" fill-opacity="0.55"/>
  <rect x="616" y="102" width="22" height="148" fill="#dc2626" fill-opacity="0.55"/>
  <rect x="646" y="106" width="22" height="144" fill="#dc2626" fill-opacity="0.55"/>
  <rect x="676" y="112" width="22" height="138" fill="#dc2626" fill-opacity="0.55"/>
  <rect x="706" y="116" width="22" height="134" fill="#dc2626" fill-opacity="0.55"/>
  <text x="620" y="292" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">白噪声 / 满秩随机数据：每层都同等重要，丢谁都损失大</text>
</svg>

**SVD 图像处理的三种典型用法**：

1. **压缩**（image compression）：保留前 $k$ 层，存 $k(m+n)$ 个数（对应 JPEG 之外的另一条思路）；
2. **降噪**：噪声主要体现在**小 $\sigma$ 层**上，直接丢掉后几层就平滑了图像（本质是"只保留主要结构"）；
3. **结构分离**：第一层往往是大面积背景/光照，前几层与后面几层分开，可以做前景背景分离。

> [!note] 通信方向：低秩 = 可压缩 = 可估计
> "低秩"这个性质在工程里到处都是：**用户-电影评分矩阵**（**推荐系统** recommender system：假设"口味只有少数几个维度"）、**信道矩阵**（多径少 ⇒ 秩低）、**阵列接收数据的协方差**（信号源数 ≪ 阵元数 ⇒ 低秩 + 噪声）。这些场景的共同动作都是：**用 SVD 把"信号子空间"与"噪声子空间"分开**（MUSIC 等子空间算法），本质就是"$\sigma$ 大的方向是信号、$\sigma$ 小的方向是噪声"。

# 7.2 奇异值分解的基与矩阵

现在讲 SVD 是怎么来的、它到底给了我们什么。

## 奇异值分解从哪来：A^T A 的特征分解

回忆第 6 章：$A^TA$ 是**对称半正定**的（$\mathbf{x}^TA^TA\mathbf{x}=\|A\mathbf{x}\|^2\ge0$），所以它**一定能正交对角化，且特征值非负**：$A^TA=V\Lambda V^{T}$。把它的特征值开方，就得到了奇异值。

> [!tip] 定理 SVD 与 $A^TA$、$AA^T$ 的关系
> $$A^TA=V\Sigma^2V^{T},\qquad AA^T=U\Sigma^2U^{T}$$
> 也就是说：
> $$\boxed{\ \mathbf{v}_i=A^TA\ \text{的特征向量},\qquad \sigma_i=\sqrt{\lambda_i(A^TA)},\qquad \mathbf{u}_i=\frac{A\mathbf{v}_i}{\sigma_i}\ }$$
> - $A^TA$（$n\times n$）的特征向量给出 $V$（**右**奇异向量，住在 $\mathbb{R}^n$）；
> - $AA^T$（$m\times m$）的特征向量给出 $U$（**左**奇异向量，住在 $\mathbb{R}^m$）；
> - 两者的**非零特征值完全相同**（都是 $\sigma_1^2,\dots,\sigma_r^2$）——这正是第 6 章那条"$AB$ 与 $BA$ 有相同非零特征值"（取 $A\to A^{T}$、$B\to A$）✓

**推导两行**：设 $A=U\Sigma V^{T}$，则

$$
A^TA=(U\Sigma V^{T})^{T}(U\Sigma V^{T})=V\Sigma^{T}\underbrace{U^{T}U}_{=I}\Sigma V^{T}=V\Sigma^{2}V^{T}\ \checkmark
$$

（$\Sigma^{T}\Sigma$ 是 $n\times n$ 对角矩阵，对角元 $\sigma_i^2$；正交性 $U^{T}U=I$ 让中间"擦干净"——这正是**为什么 SVD 用两组正交矩阵**。）

> [!tip] 手算 SVD 的标准流程（$A=\begin{bmatrix}2&2\\-1&1\end{bmatrix}$）
> 1. **算 $A^TA$**：$\begin{bmatrix}2&-1\\2&1\end{bmatrix}\begin{bmatrix}2&2\\-1&1\end{bmatrix}=\begin{bmatrix}5&3\\3&5\end{bmatrix}$；
> 2. **求它的特征值与特征向量**：$(\lambda-8)(\lambda-2)=0$，$\lambda=8,2$ ⇒
>    $$\sigma_1=2\sqrt2,\quad \mathbf{v}_1=\frac{1}{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix};\qquad
>    \sigma_2=\sqrt2,\quad \mathbf{v}_2=\frac{1}{\sqrt2}\begin{bmatrix}1\\-1\end{bmatrix}$$
> 3. **用 $\mathbf{u}_i=A\mathbf{v}_i/\sigma_i$ 求左奇异向量**：
>    $$A\mathbf{v}_1=\frac{1}{\sqrt2}\begin{bmatrix}4\\0\end{bmatrix}=2\sqrt2\begin{bmatrix}1\\0\end{bmatrix}\Rightarrow\mathbf{u}_1=\begin{bmatrix}1\\0\end{bmatrix},\qquad
>    A\mathbf{v}_2=\frac{1}{\sqrt2}\begin{bmatrix}0\\-2\end{bmatrix}=\sqrt2\begin{bmatrix}0\\-1\end{bmatrix}\Rightarrow\mathbf{u}_2=\begin{bmatrix}0\\-1\end{bmatrix}$$
> 4. **拼起来**：
>    $$A=\underbrace{\begin{bmatrix}1&0\\0&-1\end{bmatrix}}_{U}\underbrace{\begin{bmatrix}2\sqrt2&0\\0&\sqrt2\end{bmatrix}}_{\Sigma}
>    \underbrace{\frac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}}_{V^{T}}\ \checkmark$$
> （$AA^T=\begin{bmatrix}8&0\\0&2\end{bmatrix}$ 恰好是对角的，所以 $U$ 直接就是坐标轴——**符号由 $A\mathbf{v}_i=\sigma_i\mathbf{u}_i$ 定死**，$\mathbf{u}_2$ 必须取 $(0,-1)$ 而不是 $(0,1)$ ✓）

> [!warning] 算 SVD 时不要真的去组 $A^TA$
> 手算可以，**代码不行**：第 4 章警告过"$A^TA$ 的条件数是 $A$ 的平方"，而
> $$\operatorname{cond}(A^TA)=\left(\frac{\sigma_1}{\sigma_r}\right)^2=\operatorname{cond}(A)^2$$
> （验算：上例 $\operatorname{cond}(A)=2\sqrt2/\sqrt2=2$，$\operatorname{cond}(A^TA)=4$ ✓；三阶例子 $2.924^2=8.550$ ✓）
> 所以工程上算 SVD 用的是 **Golub–Kahan 双对角化**等直接方法（`numpy.linalg.svd`、MATLAB `svd`），既不组 $A^TA$ 也不组 $AA^T$。

## 四个子空间的标准正交基（第 4 章的完美版）

第 4 章讲"合并子空间的基"时留了一句话：*"同时给四个子空间各配一组标准正交基，就是第 7 章的奇异值分解。"* 现在兑现它。

> [!tip] 定理 SVD 给出四子空间的标准正交基
> 把 $U$、$V$ 按前 $r$ 列切开（$r=\operatorname{rank}A$）：
> | 空间的基 | 由谁提供 | 维数 |
> | --- | --- | --- |
> | 行空间 $\mathbf{C}(A^{T})\subset\mathbb{R}^n$ | $\mathbf{v}_1,\dots,\mathbf{v}_r$ | $r$ |
> | 零空间 $\mathbf{N}(A)\subset\mathbb{R}^n$ | $\mathbf{v}_{r+1},\dots,\mathbf{v}_n$ | $n-r$ |
> | 列空间 $\mathbf{C}(A)\subset\mathbb{R}^m$ | $\mathbf{u}_1,\dots,\mathbf{u}_r$ | $r$ |
> | 左零空间 $\mathbf{N}(A^{T})\subset\mathbb{R}^m$ | $\mathbf{u}_{r+1},\dots,\mathbf{u}_m$ | $m-r$ |
> 而且它们是**配对**的：$A\mathbf{v}_i=\sigma_i\mathbf{u}_i$（$i\le r$），$A\mathbf{v}_i=\mathbf{0}$（$i>r$）✓
> **这就是第 3、4 章那张四子空间图的"完美版本"**：四组基各自标准正交，且行空间与列空间之间的映射是"逐方向乘 $\sigma_i$"。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 340" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la7-A" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la7-Z" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/>
    </marker>
  </defs>

  <text x="175" y="70" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">R^n（输入侧，V 的世界）</text>
  <rect x="50" y="80" width="250" height="180" rx="5" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.4"/>
  <rect x="62" y="92" width="226" height="70" rx="4" fill="#4f46e5" fill-opacity="0.16" stroke="#4f46e5" stroke-opacity="0.55"/>
  <text x="175" y="122" text-anchor="middle" font-size="12" font-weight="600" fill="#4f46e5">行空间：基 v₁, …, v_r</text>
  <text x="175" y="142" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">标准正交</text>
  <rect x="62" y="172" width="226" height="76" rx="4" fill="#d97706" fill-opacity="0.16" stroke="#d97706" stroke-opacity="0.55"/>
  <text x="175" y="204" text-anchor="middle" font-size="12" font-weight="600" fill="#d97706">零空间：基 v_(r+1), …, v_n</text>
  <text x="175" y="224" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">标准正交</text>
  <text x="175" y="170" text-anchor="middle" font-size="10" fill="var(--text-faint,#8b949e)">⊥</text>

  <text x="665" y="70" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-normal,#1f2328)">R^m（输出侧，U 的世界）</text>
  <rect x="540" y="80" width="250" height="180" rx="5" fill="none" stroke="var(--text-muted,#57606a)" stroke-width="1.4"/>
  <rect x="552" y="92" width="226" height="70" rx="4" fill="#4f46e5" fill-opacity="0.16" stroke="#4f46e5" stroke-opacity="0.55"/>
  <text x="665" y="122" text-anchor="middle" font-size="12" font-weight="600" fill="#4f46e5">列空间：基 u₁, …, u_r</text>
  <text x="665" y="142" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">标准正交</text>
  <rect x="552" y="172" width="226" height="76" rx="4" fill="#d97706" fill-opacity="0.16" stroke="#d97706" stroke-opacity="0.55"/>
  <text x="665" y="204" text-anchor="middle" font-size="12" font-weight="600" fill="#d97706">左零空间：基 u_(r+1), …, u_m</text>
  <text x="665" y="224" text-anchor="middle" font-size="10.5" fill="var(--text-muted,#57606a)">标准正交</text>
  <text x="665" y="170" text-anchor="middle" font-size="10" fill="var(--text-faint,#8b949e)">⊥</text>

  <line x1="300" y1="127" x2="530" y2="127" stroke="#4f46e5" stroke-width="2" marker-end="url(#la7-A)"/>
  <text x="415" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#4f46e5">A：vᵢ ↦ σᵢuᵢ</text>
  <text x="415" y="148" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">第 i 个方向各自乘 σᵢ（一一对应）</text>

  <line x1="300" y1="210" x2="530" y2="210" stroke="#d97706" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#la7-Z)"/>
  <text x="415" y="201" text-anchor="middle" font-size="13" font-weight="700" fill="#d97706">A：↦ 0</text>
  <text x="415" y="231" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">零空间的整个方向被压成零（σ = 0）</text>

  <text x="420" y="296" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)">SVD 同时给四个子空间各配一组标准正交基，还给出配对关系 vᵢ ↔ uᵢ</text>
  <text x="420" y="320" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">第 4 章"合并子空间的基"到这算是配齐了——而且这一回是"最漂亮的一组"</text>
</svg>

**回验第 3、4 章手算的四个子空间**（$A=\begin{bmatrix}1&1&2\\2&1&3\\3&1&4\\4&1&5\end{bmatrix}$，$m=4,n=3$）：

$$
\sigma=(9.3441,\ 0.8290,\ 0),\qquad r=2
$$

- $A^TA$ 的特征向量 $\mathbf{v}_3$ 是
  $$\mathbf{v}_3=\frac{1}{\sqrt3}\begin{bmatrix}1\\1\\-1\end{bmatrix}$$
  ——**正是第 3、4 章用消元手算出来的那个零空间基** ✓
- $\mathbf{u}_1,\mathbf{u}_2$ 张成列空间，$\mathbf{u}_3,\mathbf{u}_4$ 张成左零空间；而第 4 章手算的左零空间基 $(1,-2,1,0)$ 与 $\mathbf{u}_1,\mathbf{u}_2$ **正交**、与 $\mathbf{u}_3,\mathbf{u}_4$ 有分量 ✓ 两者张成同一个空间。
- $\sigma_3=0$ 与"$r=2$、第三个主元为零"完全一致 ✓

一句话：**当年"一个一个算"的四子空间基，SVD 一次全给你，而且是标准正交的。**

## A = UΣV^T 的五个公式与特例

| 公式 | 含义 |
| --- | --- |
| $A=U\Sigma V^{T}$ | SVD 本身 |
| $A^{T}=V\Sigma^{T}U^{T}$ | 转置的 SVD（$\sigma$ 不变，$U,V$ 互换） |
| $A^TA=V\Sigma^2V^{T}$ | $V$ 是 $A^TA$ 的特征向量，$\lambda=\sigma^2$ |
| $AA^T=U\Sigma^2U^{T}$ | $U$ 是 $AA^T$ 的特征向量 |
| $A\mathbf{v}_i=\sigma_i\mathbf{u}_i,\quad A^{T}\mathbf{u}_i=\sigma_i\mathbf{v}_i$ | 配对的"输入—输出"关系 |

> [!tip] 三个重要特例
> 1. **对称矩阵**：$A=Q\Lambda Q^{T}$（第 6 章谱定理）就是它的 SVD——此时 $\sigma_i=\lvert\lambda_i\rvert$、$\mathbf{u}_i=\pm\mathbf{v}_i$，两组奇异向量是同一组（差符号）。
>    例：$\begin{bmatrix}5&4\\4&5\end{bmatrix}$ 的 $\sigma=(9,1)$ 正是它的 $\lvert\lambda\rvert=(9,1)$ ✓（第 6 章椭圆的半轴正是奇异值）
> 2. **正定矩阵**：特征值全正 ⇒ $\sigma_i=\lambda_i$、$U=V=Q$ ✓ 所以"正定矩阵的 SVD = 特征分解"。
> 3. **秩一矩阵**：只有一个非零 $\sigma$：$A=\sigma_1\mathbf{u}_1\mathbf{v}_1^{T}$ ✓（7.1 的"一层讲完"）
>
> 另外还要记住：**$SVD$ 的 $U,V$ 不唯一**——当 $\sigma$ 有重复、或 $\sigma=0$（零空间/左零空间里）时，那些方向可以任意选一组标准正交基。

## 秩、条件数与最佳低秩逼近

第 6 章说"对称矩阵的谱决定性态"。对一般矩阵，**奇异值就是它的"谱"**，而且三个常用指标都由 $\sigma$ 直接读出：

> [!info] Def 2 三个由奇异值定义的量
> $$\operatorname{rank}(A)=\#\{\sigma_i>0\},\qquad
> \|A\|_2=\sigma_1\ (\text{谱范数，spectral norm}),\qquad
> \|A\|_F=\sqrt{\sigma_1^2+\cdots+\sigma_r^2}\ (\text{Frobenius 范数})$$
> $$\operatorname{cond}(A)=\frac{\sigma_1}{\sigma_r}\qquad(\text{条件数，方阵可逆时})$$
> $\|A\|_2=\sigma_1$ 的解释：$\sigma_1=\max\limits_{\mathbf{x}\ne\mathbf{0}}\dfrac{\|A\mathbf{x}\|}{\|\mathbf{x}\|}$——**$\sigma_1$ 是 $A$ 能把向量拉长的最大倍数**（几何见 7.4；它也正是第 6 章 Rayleigh 商 $\mathbf{x}^TA^TA\mathbf{x}/\mathbf{x}^T\mathbf{x}$ 的最大值 $\sqrt{\lambda_{\max}(A^TA)}$）。

条件数的意义在第 4 章已经讲过（数值误差放大倍数、决定最小二乘能不能用 $A^TA$、决定迭代收敛速度）。现在它有了几何身份：**$\operatorname{cond}(A)$ 就是"A 把单位球压成的椭球有多扁"**。$\sigma_r\approx0$ 意味着某个方向几乎被压没了——矩阵**接近奇异**，求逆/解方程都会放大误差。

**Eckart–Young 定理**（前面已给）可以改写成更"工程"的一句话：

$$
\text{保留 }k\text{ 项的信息损失}=\sqrt{\sigma_{k+1}^2+\cdots+\sigma_r^2}=\sqrt{\|A\|_F^2-\sum_{i\le k}\sigma_i^2}
$$

## 伪逆与最小二乘（第 4 章的正解）

第 4 章结尾说"秩亏时要用**伪逆**，第 7 章给定义"。现在只剩一行：

> [!info] Def 3 伪逆（Moore–Penrose）
> **伪逆**（pseudoinverse，Moore–Penrose 伪逆）：把 $\Sigma$ 里的**非零**奇异值取倒数、零保持为零，得到 $\Sigma^{+}$，于是
> $$A^{+}=V\Sigma^{+}U^{T},\qquad \Sigma^{+}=\operatorname{diag}\!\left(\frac{1}{\sigma_1},\dots,\frac{1}{\sigma_r},0,\dots,0\right)$$
> $A^{+}$ 对**任何**矩阵都有定义（包括非方阵、奇异矩阵）。

> [!tip] 定理 $A^{+}$ 一次解决最小二乘的所有情形
> $$A\mathbf{x}\approx\mathbf{b}\ \Longrightarrow\ \hat{\mathbf{x}}=A^{+}\mathbf{b}$$
> - **列满秩**（$r=n$）时，$A^{+}=(A^TA)^{-1}A^T$——就是第 4 章的法方程解；
> - **秩亏**（$r<n$）时，法方程有无穷多解，而 $A^{+}\mathbf{b}$ 给出其中**范数最小**的那个（**最小范数解**）——因为它落在行空间 $\mathbf{C}(A^T)$ 里（$\hat{\mathbf{x}}$ 是 $\mathbf{v}_1,\dots,\mathbf{v}_r$ 的组合，零空间分量为零）✓
> - **无解且列相关**（两者同时）时，它也是唯一"最小误差 + 最小范数"的解。
> 用第 4 章的例子验算：$A=\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix}$、$\mathbf{b}=(6,0,0)$ ⇒ $A^{+}\mathbf{b}=(5,-3)$ ✓（与第 4 章手算一致）；
> $A=\begin{bmatrix}1&1\\1&1\\1&1\end{bmatrix}$（秩 1）、$\mathbf{b}=(1,2,3)$ ⇒ $A^{+}\mathbf{b}=(1,1)$ ✓（第 4 章手算的最小范数解）。

> [!tip] 求最小二乘的三种方法（补完第 4 章那张表）
> | 方法 | 做法 | 代价 | 稳定性 | 秩亏时 |
> | --- | --- | --- | --- | --- |
> | 法方程 | 组 $A^TA$，解 $n$ 阶方程 | 便宜 | 差（$\operatorname{cond}^2$） | 不可用（$A^TA$ 奇异） |
> | QR 分解 | $A=QR$，回代 $R\hat{\mathbf{x}}=Q^T\mathbf{b}$ | 中等 | 好 | 需特殊处理 |
> | **SVD / 伪逆** | $\hat{\mathbf{x}}=V\Sigma^{+}U^T\mathbf{b}$ | 最贵 | **最好** | **自动给出最小范数解** |
> 工程选择：常规问题用 QR；**接近奇异或秩亏**时用 SVD（`np.linalg.lstsq`、`pinv` 就是这么做的）。

# 7.3 主成分分析

SVD 在数据分析里最出名的应用叫**主成分分析**（principal component analysis，简称 PCA）——它要回答的问题是：**一堆数据点，最主要的"变化方向"是哪个？**

## 数据、均值与去中心化

设我们量了 $n$ 个样本、每个样本有 $d$ 个特征，把它们排成**数据矩阵** $X$（$n\times d$，**一行一个样本**）：

$$
X=\begin{bmatrix}\leftarrow\ \mathbf{x}_1^{T}\ \rightarrow\\\vdots\\\leftarrow\ \mathbf{x}_n^{T}\ \rightarrow\end{bmatrix}
$$

第一步——也是**最容易忘记、但最关键**的一步——是**去中心化**（centering）：每个特征各减去自己的均值，让数据中心落在原点。

> [!info] Def 4 去中心化数据
> 记均值 $\bar{\mathbf{x}}=\frac1n\sum_i\mathbf{x}_i$，则中心化后的数据矩阵为
> $$X_c=\begin{bmatrix}(\mathbf{x}_1-\bar{\mathbf{x}})^T\\\vdots\\(\mathbf{x}_n-\bar{\mathbf{x}})^T\end{bmatrix}$$
> 之后所有的方差、协方差都只跟 $X_c$ 有关（**有没有减去均值，直接决定主方向算得对不对**）。

**例（本书全程用这 4 个点）**：$\mathbf{x}=(1,1),(2,3),(3,2),(4,4)$，均值 $\bar{\mathbf{x}}=(2.5,2.5)$：

| 原始点 | 去中心化后 |
| --- | --- |
| $(1,1)$ | $(-1.5,-1.5)$ |
| $(2,3)$ | $(-0.5,+0.5)$ |
| $(3,2)$ | $(+0.5,-0.5)$ |
| $(4,4)$ | $(+1.5,+1.5)$ |

## 协方差矩阵与主方向

> [!info] Def 5 协方差矩阵
> **协方差矩阵**（covariance matrix）：
> $$S=\frac{1}{n-1}X_c^{T}X_c\qquad(d\times d\ \text{对称矩阵})$$
> 对角线 $S_{jj}$ 是第 $j$ 个特征的**方差**，非对角 $S_{jk}$ 是两个特征之间的**协方差**（相关性）。$S$ 对称半正定 ✓

**例**：上面那 4 个点，

$$
X_c=\begin{bmatrix}-1.5&-1.5\\-0.5&0.5\\0.5&-0.5\\1.5&1.5\end{bmatrix},\qquad
X_c^{T}X_c=\begin{bmatrix}5&4\\4&5\end{bmatrix},\qquad
S=\frac13\begin{bmatrix}5&4\\4&5\end{bmatrix}
$$

$S$ 的特征值：$\lambda=3$ 与 $\frac13$（**各方向上的方差**）；特征向量：$(1,1)/\sqrt2$ 与 $(1,-1)/\sqrt2$（**主方向**）。

> [!tip] 定理 PCA 就是"协方差矩阵的特征分解"
> $S$ 是对称矩阵（第 6 章！），所以可以正交对角化：
> $$S=V\frac{\Sigma^2}{n-1}V^{T}$$
> - **主方向**（principal direction）= $S$ 的特征向量 = $X_c$ 的**右奇异向量** $\mathbf{v}_i$；
> - **该方向上的方差** = $S$ 的特征值 = $\dfrac{\sigma_i^2}{n-1}$；
> - **总方差** = $\operatorname{tr}(S)=\sum_i\lambda_i=\sum_i\dfrac{\sigma_i^2}{n-1}$（第 6 章"迹 = 特征值之和"）✓

## 得分、方差解释率与降维

> [!info] Def 6 主成分（得分）、载荷与方差解释率
> - **得分**（score）：把数据投影到主方向上，$\mathbf{z}_i=X_c\mathbf{v}_i$（每个样本在新坐标里的值），合起来就是 $Z=X_cV=U\Sigma$；
> - **载荷**（loading）：主方向本身 $\mathbf{v}_i$（"哪些原始特征组合成这样一条主方向"）；
> - **方差解释率**（explained variance ratio）：$\dfrac{\sigma_i^2}{\sum_j\sigma_j^2}$——第 $i$ 个主成分"讲了多少信息"。

**例（继续那 4 个点）**：$\sigma=(3,1)$，于是

$$
\text{方差}=\frac{\sigma^2}{n-1}=\frac{9}{3}=3\ \text{（沿 }\mathbf{v}_1=(1,1)/\sqrt2\text{）},\qquad
\frac{1}{3}\ \text{（沿 }\mathbf{v}_2=(1,-1)/\sqrt2\text{）}
$$

$$
\text{方差解释率}=\frac{9}{9+1}=90\%,\qquad \frac{1}{10}=10\%
$$

**得分**（$Z=X_cV$）：

| 样本 | 第一主成分得分 | 第二主成分得分 |
| --- | --- | --- |
| $(-1.5,-1.5)$ | $-2.121$ | $0$ |
| $(-0.5,+0.5)$ | $0$ | $-0.707$ |
| $(+0.5,-0.5)$ | $0$ | $+0.707$ |
| $(+1.5,+1.5)$ | $+2.121$ | $0$ |

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 320" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la7-p1" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la7-p2" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
    <marker id="la7-sx" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-faint,#8b949e)"/>
    </marker>
  </defs>

  <!-- 坐标轴 -->
  <line x1="170" y1="270" x2="430" y2="270" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <line x1="225" y1="300" x2="225" y2="30" stroke="var(--text-faint,#8b949e)" stroke-width="1"/>
  <text x="436" y="274" font-size="11" fill="var(--text-faint,#8b949e)">特征 1</text>
  <text x="230" y="32" font-size="11" fill="var(--text-faint,#8b949e)">特征 2</text>

  <!-- 主方向 -->
  <line x1="234" y1="207" x2="382" y2="59" stroke="#4f46e5" stroke-width="2.4" marker-end="url(#la7-p1)"/>
  <line x1="274" y1="113" x2="342" y2="181" stroke="#db2777" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#la7-p2)"/>
  <text x="352" y="70" font-size="12" font-weight="700" fill="#4f46e5">v₁</text>
  <text x="330" y="196" font-size="12" font-weight="700" fill="#db2777">v₂</text>

  <!-- 数据点 -->
  <circle cx="280" cy="215" r="5" fill="#059669"/>
  <circle cx="335" cy="105" r="5" fill="#059669"/>
  <circle cx="390" cy="160" r="5" fill="#059669"/>
  <circle cx="445" cy="50" r="5" fill="#059669"/>
  <!-- 均值 -->
  <circle cx="362" cy="132" r="4" fill="#dc2626"/>
  <path d="M354,132 L370,132 M362,124 L362,140" stroke="#dc2626" stroke-width="1.6"/>

  <text x="180" y="290" font-size="11" fill="var(--text-muted,#57606a)">4 个样本点（绿）：(1,1), (2,3), (3,2), (4,4)</text>
  <text x="180" y="308" font-size="11" fill="#dc2626">红叉：均值 (2.5, 2.5) —— 去中心化就是把它挪到原点</text>

  <!-- 说明 -->
  <text x="490" y="80" font-size="12.5" font-weight="600" fill="#4f46e5">v₁ = (1, 1)/√2：方差 3（90%）</text>
  <text x="490" y="106" font-size="11.5" fill="var(--text-muted,#57606a)">数据"最长"的方向 —— 第一主成分</text>
  <text x="490" y="150" font-size="12.5" font-weight="600" fill="#db2777">v₂ = (1, −1)/√2：方差 1/3（10%）</text>
  <text x="490" y="176" font-size="11.5" fill="var(--text-muted,#57606a)">与 v₁ 正交，残差方向 —— 第二主成分</text>
  <text x="490" y="220" font-size="12" fill="var(--text-normal,#1f2328)">X_cᵀX_c = [[5, 4], [4, 5]]，σ = (3, 1)</text>
  <text x="490" y="248" font-size="11.5" fill="var(--text-muted,#57606a)">主方向 = 协方差矩阵的特征向量 = X_c 的右奇异向量</text>
  <text x="490" y="276" font-size="11.5" fill="var(--text-muted,#57606a)">总方差 = trace(S) = 3 + 1/3 = 10/3（第 6 章：迹 = 特征值之和）</text>
</svg>

**降维**：只保留前 $k$ 个主成分，就是把 $n\times d$ 的数据压成 $n\times k$ 的得分矩阵 $Z_k$；想还原就 $X_c\approx Z_kV_k^{T}$，而**还原误差正是被丢掉的奇异值**（Eckart–Young）：

$$
\|X_c-Z_kV_k^{T}\|_F=\sqrt{\sigma_{k+1}^2+\cdots+\sigma_r^2}
$$

例中若只保留第一主成分，误差 $=\sigma_2=1$，也就是"丢掉了 10% 的方差" ✓

**极限情形**：如果数据全部落在一条直线上（如 $\mathbf{x}=(0,1),(1,2),(2,3),(3,4)$），则 $\sigma=(3.162,\ 0)$、方差解释率 $=100\%$——**一个主成分就够了**，PCA 自动"找到那条线" ✓

## 与 SVD 的关系（为什么工程上不直接算协方差）

> [!tip] PCA 的两种算法，本质是同一个
> | 路线 | 步骤 | 数值代价 |
> | --- | --- | --- |
> | **协方差路线**（教科书） | 去中心化 → 组 $S=X_c^{T}X_c/(n-1)$ → 对 $S$ 做特征分解 | $\operatorname{cond}$ 被**平方**（第 4 章警告） |
> | **SVD 路线**（工程） | 去中心化 → 直接对 $X_c$ 做 SVD → $V$ 就是主方向、$\sigma^2/(n-1)$ 就是方差 | 稳定，且秩亏也能算 |
> 因为 $S=\frac{1}{n-1}X_c^{T}X_c=\frac{1}{n-1}V\Sigma^2V^{T}$，"对 $X_c$ 做 SVD"与"对 $S$ 做特征分解"**给出的 $V$ 完全相同**，但前者不组 $A^TA$、条件数不翻倍 ✓
> 这就是为什么 `sklearn.decomposition.PCA` 内部走的是 SVD。

> [!warning] 用 PCA 时的四个坑
> 1. **忘记去中心化**：不减去均值，第一主成分会指向"数据中心离原点多远"而不是"数据怎么变"——这是最常见的错误；
> 2. **量纲不统一时必须先标准化**：身高（cm）与体重（kg）方差量级悬殊，直接做 PCA 会被大方差特征主导。做法：每个特征除以自己的标准差，等价于对**相关系数矩阵**做 PCA；
> 3. **主成分不等于有物理意义的量**：$v_1$ 只是"某个线性组合"，别硬解释；
> 4. **对异常值敏感、且只能是线性的**：方差被极端点主导；非线性结构（如弯曲的流形）要用核 PCA / 自编码器。

> [!note] 通信方向：PCA 的老家在信号处理
> - 在信号处理里它叫 **KL 变换**（Karhunen–Loève transform）或 **HOTELLING 变换**——对信号的相关矩阵做特征分解，得到一组**互不相关**的分量，是**去相关**与**最优降维**的标准工具；
> - **白化**（whitening）：不做降维而做"等方差化"，把椭圆噪声"掰"成圆（第 6 章的椭圆），使后续处理各向同性；
> - **MIMO 特征波束**：信道协方差矩阵的特征分解（[[vault-notes/5g/phy/04-physical-channels-signals]]）——把空间上相关的多天线信道变成若干**互不干扰**的特征子信道，每个子信道的增益就是特征值；
> - **信道估计与干扰抑制**：只保留少数强主成分做降维估计（降低导频开销与噪声），或者反过来用**噪声子空间**（小 $\sigma$ 方向）做干扰/信号源数估计（MUSIC）。

# 7.4 奇异值分解的几何背景

最后把 SVD 画出来——它的几何图像只有一句话：**单位球变椭球**。

## 单位球变成椭球

> [!tip] 定理 SVD 的几何意义
> 矩阵 $A$（$m\times n$）把 $\mathbb{R}^n$ 中的**单位球**（unit sphere）映成 $\mathbb{R}^m$ 中的一个**椭球**（ellipsoid）：
> - **半轴长度** $=\sigma_1,\sigma_2,\dots$（奇异值就是"各方向被拉伸的倍数"）；
> - **半轴方向** $=\mathbf{u}_1,\mathbf{u}_2,\dots$（左奇异向量）；
> - 被映到这些半轴上的输入方向，就是**右奇异向量** $\mathbf{v}_1,\mathbf{v}_2,\dots$
> 一句话：**$\mathbf{v}_1,\dots,\mathbf{v}_n$ 是输入那头的一组正交方向，$A$ 把它们变成输出那头的另一组正交方向 $\mathbf{u}_1,\dots,\mathbf{u}_m$，并在第 $i$ 个方向上拉伸 $\sigma_i$ 倍。**

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 320" width="100%" style="max-width:840px" font-family="inherit">
  <defs>
    <marker id="la7-c1" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
    </marker>
    <marker id="la7-c2" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#db2777"/>
    </marker>
    <marker id="la7-map" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-normal,#1f2328)"/>
    </marker>
  </defs>

  <!-- 左：单位圆 -->
  <text x="200" y="34" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">定义域：单位球（圆）</text>
  <circle cx="200" cy="170" r="70" fill="#4f46e5" fill-opacity="0.08" stroke="#4f46e5" stroke-width="1.6" stroke-dasharray="5 4"/>
  <line x1="200" y1="170" x2="249.5" y2="120.5" stroke="#4f46e5" stroke-width="2.4" marker-end="url(#la7-c1)"/>
  <text x="256" y="116" font-size="12" font-weight="700" fill="#4f46e5">v₁</text>
  <line x1="200" y1="170" x2="249.5" y2="219.5" stroke="#db2777" stroke-width="2.4" marker-end="url(#la7-c2)"/>
  <text x="256" y="232" font-size="12" font-weight="700" fill="#db2777">v₂</text>
  <circle cx="200" cy="170" r="3" fill="var(--text-normal,#1f2328)"/>
  <text x="200" y="272" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">所有长度为 1 的输入向量</text>
  <text x="200" y="292" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">v₁、v₂ 是斜 45° 的两个正交方向</text>

  <!-- 映射箭头 -->
  <line x1="292" y1="170" x2="352" y2="170" stroke="var(--text-normal,#1f2328)" stroke-width="2.4" marker-end="url(#la7-map)"/>
  <text x="322" y="158" text-anchor="middle" font-size="13" font-weight="700" fill="var(--text-normal,#1f2328)">A</text>

  <!-- 右：椭圆 -->
  <text x="590" y="34" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text-normal,#1f2328)">值域：椭球（椭圆）</text>
  <line x1="362" y1="170" x2="758" y2="170" stroke="var(--text-muted,#57606a)" stroke-width="1"/>
  <line x1="560" y1="45" x2="560" y2="295" stroke="var(--text-muted,#57606a)" stroke-width="1"/>
  <ellipse cx="560" cy="170" rx="198" ry="99" fill="#059669" fill-opacity="0.10" stroke="#059669" stroke-width="2"/>
  <!-- 半轴 -->
  <line x1="560" y1="170" x2="750" y2="170" stroke="#4f46e5" stroke-width="2.4" marker-end="url(#la7-c1)"/>
  <text x="700" y="160" font-size="12" font-weight="700" fill="#4f46e5">σ₁u₁</text>
  <line x1="560" y1="170" x2="560" y2="262" stroke="#db2777" stroke-width="2.4" marker-end="url(#la7-c2)"/>
  <text x="570" y="252" font-size="12" font-weight="700" fill="#db2777">σ₂u₂</text>
  <circle cx="560" cy="170" r="3" fill="var(--text-normal,#1f2328)"/>

  <text x="590" y="300" text-anchor="middle" font-size="11" fill="var(--text-muted,#57606a)">半轴长 = σ₁, σ₂；半轴方向 = u₁, u₂</text>
  <text x="420" y="316" text-anchor="middle" font-size="11.5" fill="var(--text-muted,#57606a)">例：A = [[2, 2], [−1, 1]]，σ = (2√2, √2) ≈ (2.83, 1.41)：v 在斜 45°、u 沿坐标轴</text>
</svg>

**例（$A=\begin{bmatrix}2&2\\-1&1\end{bmatrix}$，$\sigma_1=2\sqrt2\approx2.83$、$\sigma_2=\sqrt2\approx1.41$）**：

- $\mathbf{v}_1=(1,1)/\sqrt2$ 是**右上 45°** 的方向，它被映到 $\sigma_1\mathbf{u}_1=2\sqrt2\,(1,0)$——**正好是椭球的右端点**；
- $\mathbf{v}_2=(1,-1)/\sqrt2$ 是**右下 45°** 的方向，它被映到 $\sigma_2\mathbf{u}_2=\sqrt2\,(0,-1)$——椭球的**下端点**；
- 注意一个"反直觉"的现象：**输入那头的正交方向（斜的）到了输出那头仍是正交方向，但不一定是同一组方向**——$A$ 干的事 = **旋转到 $v$ 坐标 → 沿坐标轴拉伸 → 再旋转到 $u$ 坐标**。

> [!tip] $\sigma_1$ 和 $\sigma_r$ 的两个"极值"身份
> $$\sigma_1=\max_{\|\mathbf{x}\|=1}\|A\mathbf{x}\|\qquad\text{（最大拉伸，谱范数）}$$
> $$\sigma_r=\min_{\|\mathbf{x}\|=1}\|A\mathbf{x}\|\qquad\text{（最小拉伸；方阵可逆时才有正的下界）}$$
> 于是 $\operatorname{cond}(A)=\sigma_1/\sigma_r$ 的几何读法非常直白：**椭球最长半轴与最短半轴之比**。$\sigma_r\to0$ 时椭球被压成"薄片"——某个输入方向几乎没有输出，矩阵**接近奇异**，"求逆"就是在放大这个方向的误差（$1/\sigma_r$ 巨大）✓

## 奇异向量与特征向量的几何对照

两者都是"把矩阵看简单"的工具，但看的是不同的东西：

| | 特征分解 $A=S\Lambda S^{-1}$ | 奇异值分解 $A=U\Sigma V^{T}$ |
| --- | --- | --- |
| 适用对象 | 方阵，且可对角化 | **任意矩阵** |
| 两组方向 | 一组（输入=输出，方向不变） | **两组**（输入 $\mathbf{v}_i$、输出 $\mathbf{u}_i$，一般不重合） |
| 正交性 | 一般不保证 | **一定**（$U,V$ 都是正交矩阵） |
| 数值 | 可能病态、可能不存在 | **极其稳定**，永远存在 |
| 几何 | $A\mathbf{x}=\lambda\mathbf{x}$：方向不变、长度变 $\lambda$ | $A\mathbf{v}_i=\sigma_i\mathbf{u}_i$：方向转了，长度变 $\sigma_i$ |
| 谁是谁的特例 | 对称矩阵时二者合一 | 对称矩阵：$\sigma_i=\lvert\lambda_i\rvert$、$\mathbf{u}_i=\pm\mathbf{v}_i$ |

> [!tip] 为什么 SVD 如此重要：线性代数基本定理的第三部分
> Strang 把线性代数的大局总结成三句话：
> 1. **四个子空间**（第 3 章）：$A$ 把 $\mathbb{R}^n$ 分成行空间 + 零空间，把 $\mathbb{R}^m$ 分成列空间 + 左零空间；
> 2. **正交性**（第 4 章）：行空间 ⊥ 零空间、列空间 ⊥ 左零空间；
> 3. **SVD**（本章）：给这四个子空间**各配一组标准正交基**，并给出配对关系 $A\mathbf{v}_i=\sigma_i\mathbf{u}_i$。
> 前两条是"结构"，第三条是"结构的最佳实现"——所以 SVD 被称为**线性代数的"最终定理"**。

> [!note] 通信方向：为什么 MIMO 离不开 SVD
> 设信道矩阵 $H$（接收天线 × 发射天线），则 $H=U\Sigma V^{H}$ 有非常直接的物理含义：
> $$\mathbf{y}=H\mathbf{x}+\mathbf{n}\quad\Longrightarrow\quad \underbrace{U^{H}\mathbf{y}}_{\tilde{\mathbf{y}}}=\Sigma\underbrace{V^{H}\mathbf{x}}_{\tilde{\mathbf{x}}}+\underbrace{U^{H}\mathbf{n}}_{\tilde{\mathbf{n}}}$$
> - **发射端沿 $\mathbf{v}_i$ 发射、接收端沿 $\mathbf{u}_i$ 接收**，信道就变成了**若干条互不干扰的并行子信道**，第 $i$ 条的信道增益正是 $\sigma_i$；
> - **MIMO 容量**因此可以逐条相加：$C=\sum_i\log_2\!\left(1+\frac{\sigma_i^2\rho}{n}\right)$（第 6 章谱分解的连续版）；
> - **水注算法**（water-filling）：按 $\sigma_i$ 分配发射功率——$\sigma_i$ 大的方向多给功率，真做到了"好信道多分配"，这只有在 SVD 把信道解耦之后才谈得上；
> - **信道条件数** $\sigma_1/\sigma_r$ 刻画信道有多"相关/病态"：$\sigma_r$ 很小意味着某个空间方向几乎送不出去（空间复用塌陷），检测与均衡难度随之上升；
> - **SVD 检测/预编码**（[[vault-notes/5g/phy/04-physical-channels-signals]]）与**子空间类算法**（MUSIC 的噪声子空间）都是"用 SVD 把信道/信号空间拆成正交分量"的直接应用。而**伪逆 $H^{+}$ 给出迫零检测**——第 4 章的最小二乘，在本章得到了工程实现。

> [!tip] 本章收官
> 第 7 章用四节把 SVD 讲成一个完整的故事：
> 1. **7.1 图像**：$A=\sum\sigma_i\mathbf{u}_i\mathbf{v}_i^{T}$ 是一叠秩一图层；保留前 $k$ 层是最优压缩，误差 $=\sigma_{k+1}$；
> 2. **7.2 矩阵**：$A=U\Sigma V^{T}$，其中 $\sigma_i=\sqrt{\lambda_i(A^TA)}$、$\mathbf{u}_i=A\mathbf{v}_i/\sigma_i$；它一次给出**四子空间的标准正交基**（第 4 章的完美版）、伪逆 $A^{+}=V\Sigma^{+}U^{T}$（第 4 章的正解）与条件数 $\sigma_1/\sigma_r$；
> 3. **7.3 数据**：PCA = 去中心化数据的 SVD，主方向 = 右奇异向量，方差 = $\sigma_i^2/(n-1)$，解释率 = $\sigma_i^2/\sum\sigma_j^2$；
> 4. **7.4 几何**：单位球 → 椭球，半轴 $=\sigma_i$、方向 $=\mathbf{u}_i$，条件数 = 椭球扁度。
>
> 一句话：**一切矩阵 = "旋转 + 沿正交感方向独立拉伸 + 旋转"，奇异值就是那几次拉伸的倍数——而这一分解对任何矩阵都成立。**

## 本章知识地图

```
奇异值分解：任何矩阵都能"换到正交坐标系里看"
  ├─ 7.1 基于线性代数的图像处理
  │      ├── 图像 = 矩阵（像素值阵列）；彩色图 = 三个矩阵
  │      ├── A = Σ σ_i u_i v_i^T：一叠秩一"图层"（σ 是层的重要性）
  │      ├── rank = 非零 σ 的个数（判秩比 det 可靠）
  │      ├── Eckart-Young：最佳秩 k 逼近，误差 ‖A-A_k‖_2 = σ_(k+1)
  │      ├── 压缩比 = mn / [k(m+n)+k]（1000×1000、k=50 ⇒ 10 倍）
  │      └── 应用：压缩 / 降噪（丢掉小 σ）/ 低秩=可估计
  │
  ├─ 7.2 奇异值分解的基与矩阵
  │      ├── 来源：A^T A = V Σ² V^T、A A^T = U Σ² U^T
  │      │      └── σ_i = √λ_i(A^T A)；u_i = A v_i / σ_i（先求 V 再求 U）
  │      ├── ★ 四子空间的标准正交基：
  │      │      v_1..v_r → 行空间 ｜ v_(r+1)..v_n → 零空间
  │      │      u_1..u_r → 列空间 ｜ u_(r+1)..u_m → 左零空间
  │      │      配对：A v_i = σ_i u_i（第 4 章那张图的完美版）
  │      ├── 五个公式 + 特例（对称/正定：SVD = 特征分解）
  │      ├── rank = #σ>0；‖A‖_2 = σ_1；‖A‖_F = √Σσ²；cond = σ_1/σ_r
  │      │      └── cond(A^T A) = cond(A)²（第 4 章"别用 A^T A"的原因）
  │      ├── 伪逆 A+ = V Σ+ U^T ⇒ x̂ = A+ b（最小二乘 + 最小范数，第 4 章的正解）
  │      └── 最小二乘三法对照：法方程 / QR / SVD（稳定性递增）
  │
  ├─ 7.3 主成分分析
  │      ├── 数据矩阵 X（一行一样本）→ 去中心化 X_c（必须！）
  │      ├── 协方差 S = X_c^T X_c /(n-1)（对称半正定）
  │      ├── 主方向 = S 的特征向量 = X_c 的右奇异向量 V
  │      ├── 方差 = σ²/(n-1)；解释率 = σ_i²/Σσ²；总方差 = tr(S)
  │      ├── 得分 Z = X_c V = U Σ；降维 = 只留前 k 列（误差 = 丢掉的 σ）
  │      ├── 工程走 SVD 路线（不组 A^T A，条件数不翻倍）
  │      └── 坑：忘记去中心化 / 量纲不统一 / 过度解释 / 对异常值敏感
  │
  └─ 7.4 奇异值分解的几何背景
         ├── 单位球 → 椭球；半轴长 = σ_i，方向 = u_i；被映到轴上的是 v_i
         ├── A 的三步解读：旋到 v → 沿轴拉伸 → 旋到 u
         ├── σ_1 = max‖Ax‖/‖x‖（谱范数）；σ_r = min；cond = 椭球扁度
         ├── 奇异向量 vs 特征向量对照表（两组 vs 一组、永远存在 vs 未必）
         └── 基本定理三部分：四子空间 → 正交 → SVD 配标准正交基
```

## 关联

- 上一章：[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]]
- 下一章：[[vault-notes/math/linear-algebra/08-linear-transformations]]

**本章与前面章节的接口**（前面几章留下的"伏笔"在这一章全部收网）：

| 前面的伏笔 | 第 7 章的兑现 |
| --- | --- |
| 第 3 章：四子空间维数 $r,n-r,r,m-r$ | SVD 给出四组**标准正交基**，维数一目了然（7.2） |
| 第 4 章：合并子空间的基"最漂亮的一组在第 7 章" | $U,V$ 的前 $r$ 列/后 $n-r$ 列正是那两组基（7.2） |
| 第 4 章：$\operatorname{cond}(A^TA)=\operatorname{cond}(A)^2$ | 因为 $\operatorname{cond}(A)=\sigma_1/\sigma_r$，平方后成立（7.2） |
| 第 4 章：秩亏时的"最小范数解 / 伪逆见第 7 章" | $A^{+}=V\Sigma^{+}U^{T}$，$\hat{\mathbf{x}}=A^{+}\mathbf{b}$（7.2） |
| 第 4 章：最小二乘三法表（法方程/QR/SVD） | 补齐 SVD 一路：最贵、最稳、秩亏自动最小范数（7.2） |
| 第 5 章：$\lvert\det A\rvert$ = 体积缩放 | $\lvert\det A\rvert=\sigma_1\sigma_2\cdots\sigma_n$：各方向拉伸之积（7.1） |
| 第 5 章：判秩不能靠 $\det$ | 数值秩 = 数 $\sigma_i>$ 容差的个数（7.1） |
| 第 6 章：$A^TA$ 的特征值、$\lambda\ge0$ | $\sigma_i=\sqrt{\lambda_i(A^TA)}$；$A^TA$ 与 $AA^T$ 共享非零特征值（正是第 6 章 AB/BA 定理）（7.2） |
| 第 6 章：对称矩阵 $A=Q\Lambda Q^{T}$ | SVD 是它的推广；对称/正定矩阵的 SVD **就是**特征分解（7.2） |
| 第 6 章：PCA 预告、协方差矩阵对称 | 7.3 完整兑现：主方向 = 协方差矩阵的特征向量 |
| 第 6 章：条件数决定收敛与数值风险 | 条件数的几何 = 椭球扁度 = $\sigma_1/\sigma_r$（7.4） |

**通信方向应用**：

- [[vault-notes/5g/phy/04-physical-channels-signals]] —— **MIMO 的核心工具就是 SVD**：$H=U\Sigma V^{H}$ 把相关的 MIMO 信道**解耦成若干条并行子信道**（增益 $\sigma_i$），于是容量可以逐条相加 $C=\sum_i\log_2(1+\sigma_i^2\rho/n)$；**水注算法**按 $\sigma_i$ 分配功率；**迫零检测**就是伪逆 $H^{+}$（第 4 章的最小二乘）；**条件数 $\sigma_1/\sigma_r$** 衡量信道的空间相关程度与"接近奇异"的程度；大规模天线的**特征波束**、信道估计的降维（保留强主成分）、干扰抑制（把权向量压到小奇异值方向）都建立在这一章之上。
- [[vault-notes/communication/09-optimal-reception]] —— 信号空间需要一组**正交基**（Gram-Schmidt，第 4 章）——而 SVD 给出的是"最优"的那一组：相关矩阵的特征分解（KLT）把接收信号变成**互不相关**的分量，使各维可以独立处理（这正是"信号空间维数 = 独立信号数"的定量版本）；判决统计量是投影，而投影系数在 SVD 坐标下就是 $U^{H}\mathbf{y}$（7.4 的 $\tilde{\mathbf{y}}$）。
- [[vault-notes/math/linear-algebra/10-applications]] —— 本章的应用清单几乎就是那片"应用章"的预告：**图像压缩与降维**（7.1、7.3）、**推荐系统的低秩矩阵补全**（matrix completion；核心假设是用户-评分矩阵低秩）、**数据降维与可视化**、**谱聚类**（拉普拉斯矩阵的特征分解）、以及工程里的**降噪与模型降阶**（保留主导奇异值的"平衡截断”，balanced truncation）
- [[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]] —— 两章合起来是"矩阵谱理论"的完整版：特征分解管"方阵 + 不变方向"，SVD 管"任意矩阵 + 两组正交方向"；对称正定矩阵处两者合一。**工程上"求稳健的谱分解"通常直接上 SVD**，因为它永远存在、数值稳定、且秩亏情形也有定义。
- [[vault-notes/math/linear-algebra/04-orthogonality]] —— 本章的每个公式都由第 4 章的两件武器撑起来：**正交矩阵不改变长度/条件数**（所以 $U,V$ 是"安全的坐标变换"）、**投影与最小二乘**（伪逆就是"投影 + 解方程"的一般形态）。
- [[vault-notes/math/linear-algebra/03-vector-spaces-subspaces]] —— 四个子空间在 SVD 里获得了**显式构造**：$V$ 的前 $r$ 列张成行空间、$U$ 的前 $r$ 列张成列空间；"$A$ 在行空间上是一一映射、把零空间压成零"这句第 4 章的话，现在就是 $A(\sum c_i\mathbf{v}_i)=\sum c_i\sigma_i\mathbf{u}_i$ ✓

**相关**：[[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors]]｜[[vault-notes/math/linear-algebra/04-orthogonality]]｜[[vault-notes/math/linear-algebra/10-applications]]
