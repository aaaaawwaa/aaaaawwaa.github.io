---
title: "AR-MA-ARMA建模"
tags:
- 随机信号处理
- 09-进阶统计信号处理
- ARMA
- 谱估计
type: concept
subjects:
- 随机信号处理
- 自适应滤波
domains:
- 自适应信号处理
status: learning
aliases: []
prerequisites: []
related: []
---

# AR、MA 与 ARMA 建模

> [!abstract] 这一节在讲什么
> 前面几节把随机信号看成"给定 $R_X(\tau)$ 或 $S_X(\omega)$ 的对象"；这一节反过来，用**少量参数**把谱的形状解释出来。
> 核心结论：AR、MA、ARMA 都是白噪声激励线性系统的输出，写出 $A(z)X[n]=B(z)W[n]$ 后，功率谱就是 $\sigma^2\lvert B\rvert^2/\lvert A\rvert^2$。
> 用途：数据的压缩描述、线性预测、下一节的参数化谱估计，以及自适应滤波中的系统辨识。

## 一、三类模型与差分方程

> [!info] 定义
> 设 $W[n]$ 是零均值、方差为 $\sigma^2$ 的白噪声，$X[n]$ 是它通过线性系统后的输出。按差分方程里"过去的输出"与"过去的输入"谁出现，分成 AR、MA、ARMA 三类。

$$
\begin{aligned}
\text{AR}(p):\quad & X[n]=-\sum_{k=1}^{p}a_kX[n-k]+W[n]\\
\text{MA}(q):\quad & X[n]=W[n]+\sum_{k=1}^{q}b_kW[n-k]\\
\text{ARMA}(p,q):\quad & X[n]=-\sum_{k=1}^{p}a_kX[n-k]+W[n]+\sum_{k=1}^{q}b_kW[n-k]
\end{aligned}
$$

令 $A(z)=1+\sum_{k=1}^{p}a_kz^{-k}$，$B(z)=1+\sum_{k=1}^{q}b_kz^{-k}$，则系统函数与谱分别为

$$
H(z)=\frac{B(z)}{A(z)},\qquad
S_X(\omega)=\sigma^2\frac{\lvert B(e^{j\omega})\rvert^2}{\lvert A(e^{j\omega})\rvert^2}
$$

| 模型 | 独立参数 | $H(z)$ | 极点与零点 | 典型谱形 |
| --- | --- | --- | --- | --- |
| AR($p$) | $a_1,\dots,a_p,\sigma^2$ | $\dfrac{1}{1+\sum a_kz^{-k}}$ | 全极点，除 $z=0$ 外无零点 | 尖峰，适合窄带谱 |
| MA($q$) | $b_1,\dots,b_q,\sigma^2$ | $1+\sum b_kz^{-k}$ | 全零点，永远稳定 | 平缓，适合谱谷 |
| ARMA($p,q$) | $a_k,b_k,\sigma^2$ | $\dfrac{1+\sum b_kz^{-k}}{1+\sum a_kz^{-k}}$ | 既有极点又有零点 | 峰谷兼有，参数最省 |

> [!warning] 符号约定
> 有的书把 AR 写成 $X[n]=\sum a_kX[n-k]+W[n]$，此时 $A(z)=1-\sum a_kz^{-k}$，系数符号与本笔记相反。判断依据是 $H(z)$ 的分母，不要只背差分方程。

## 二、Yule-Walker 方程

AR 模型的自相关满足一组线性方程。把 AR 差分方程两边乘 $X[n-m]$ 再取期望，$m\ge1$ 时激励项与过去的输出不相关，于是

$$
R_X[m]+\sum_{k=1}^{p}a_kR_X[m-k]=0,\qquad m\ge1
$$

$m=0$ 时多出激励功率，得到

$$
\begin{bmatrix}
R_X[0] & R_X[-1] & \cdots & R_X[-p]\\
R_X[1] & R_X[0] & \cdots & R_X[1-p]\\
\vdots & \vdots & \ddots & \vdots\\
R_X[p] & R_X[p-1] & \cdots & R_X[0]
\end{bmatrix}
\begin{bmatrix}1\\a_1\\\vdots\\a_p\end{bmatrix}
=\begin{bmatrix}\sigma^2\\0\\\vdots\\0\end{bmatrix}
$$

这就是 **Yule-Walker 方程**：矩阵是 Toeplitz 的，用 Levinson-Durbin 递推可在 $O(p^2)$ 内解出 $a_k$ 与 $\sigma^2$，并顺带得到反射系数。MA 与 ARMA 的 Yule-Walker 方程会多出 $q$ 阶的滑动平均项，通常先用高阶 AR 逼近再换算。

> [!tip] 直觉
> Yule-Walker 本质上是在说"AR 模型的自相关必须满足同一套递推"。用它估计参数，相当于让模型的前 $p+1$ 个自相关值与样本值完全对齐，滞后更远的自相关则交给模型外推。

## 三、稳定性与功率谱

AR 与 ARMA 的稳定性只看分母：$A(z)$ 的根（极点）必须全部在单位圆内。AR(1) 的极点就是 $z=a$，所以 $\lvert a\rvert<1$；MA 没有极点，永远稳定。

> [!info] 定义
> 若 $H(z)$ 的所有极点（即 $A(z)$ 的根）都在单位圆内，则称该模型是**稳定**的（最小相位）。极点越靠近单位圆，谱峰越高越窄，自相关衰减越慢。

极点位置与谱形是一一对应的：极点半径 $r$ 越接近 1，峰越窄（品质因数约为 $1/(1-r)$），极点角度决定峰的中心频率。这也解释了为什么 AR 谱特别适合描述窄带信号。

> [!warning] 估计出来的模型不一定稳定
> 用样本自相关解 Yule-Walker 时，Toeplitz 矩阵正定可以保证稳定；但直接对 ARMA 做最小二乘、或对短数据做高阶拟合，可能把极点推到圆外，谱会出现无穷大的假峰。

## 四、AR(1) 的例子与模型选择

> [!example] AR(1)：$X[n]=aX[n-1]+W[n]$
> 取 $\lvert a\rvert<1$、$\sigma^2=1$，自相关为 $R_X[m]=\sigma^2a^{\lvert m\rvert}/(1-a^2)$，功率谱化简为下式。

$$
S_X(\omega)=\frac{\sigma^2}{1-2a\cos\omega+a^2}
$$

当 $a=0.9$ 时 $R_X[0]=5.26$，$S_X(0)=100$，$S_X(\pi)=0.28$，峰谷比约 25.6 dB：极点贴近单位圆，直流附近出现一个很尖的峰。若 $a=-0.9$，峰就搬到 $\omega=\pi$。

模型选择可以记成一句话：**先看 ACF/PACF 定候选阶数，再用 AIC/BIC 比较，够用就好**。ACF 拖尾、PACF 在 $p$ 阶截尾是 AR 的典型特征；MA 恰好相反；ARMA 两者都拖尾。

| 模型 | 自相关 ACF | 偏自相关 PACF |
| --- | --- | --- |
| AR($p$) | 拖尾（指数或振荡衰减） | $p$ 阶截尾 |
| MA($q$) | $q$ 阶截尾 | 拖尾 |
| ARMA($p,q$) | 拖尾 | 拖尾 |

阶数不是越高越好：阶数过高会引入伪峰、增大方差，并让预测对噪声更敏感。AIC 用 $N\ln\hat\sigma^2+2k$、BIC 用 $N\ln\hat\sigma^2+k\ln N$ 作为惩罚项，$k$ 是自由参数个数。

## 关联

- 上一节：[[vault-notes/random-signals/08-matched-filter-detection]]（08 末篇）
- 下一节：[[vault-notes/random-signals/09-parametric-spectral-estimation]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/dsp/05-filter-structures]]、[[vault-notes/dsp/07-fir-filter-design]]
