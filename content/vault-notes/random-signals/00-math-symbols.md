---
title: "数学符号约定"
tags:
- 随机信号处理
- 导航
- 符号约定
aliases:
- 符号约定
- 随机信号处理记号
type: map
subjects:
- 随机信号处理
- 知识管理
domains:
- 知识管理
status: learning
prerequisites: []
related: []
---

# 🔤 数学符号约定

> [!abstract] 为什么需要这一页
> 随机信号处理里最容易造成“看懂了但算不对”的，不是公式本身，而是**同一符号在不同书里含义不同**：
> $\omega$ 与 $f$、单边谱与双边谱、$R_X(\tau)$ 与 $r_X(\tau)$、DFT 的 $1/N$ 放在正变换还是反变换。
> 本页固定本子库的记号；后续所有笔记都按这里执行。

## 一、随机变量与随机过程

| 符号 | 含义 | 说明 |
| --- | --- | --- |
| $X,Y,Z$ | 随机变量 | 大写表示随机对象 |
| $x,y,z$ | 取值/实现 | 小写表示一次观测 |
| $\mathbf{X},\mathbf{x}$ | 随机向量 / 向量实现 | 粗体表示向量 |
| $X(t)$ | 连续时间随机过程 | $t\in\mathbb{R}$ |
| $X[n]$ | 离散时间随机序列 | $n\in\mathbb{Z}$ |
| $F_X(x)$ | 累积分布函数（CDF） | $F_X(x)=P(X\le x)$ |
| $f_X(x)$ | 概率密度函数（PDF） | 连续型 |
| $p_X(x_k)$ | 概率质量函数（PMF） | 离散型 |
| $f_{X\mid Y}(x\mid y)$ | 条件密度 | 条件分布 |

## 二、矩与相关函数

| 符号 | 定义 | 备注 |
| --- | --- | --- |
| $\mu_X(t)$ | $E[X(t)]$ | 均值函数 |
| $\sigma_X^2(t)$ | $\mathrm{Var}[X(t)]$ | 方差函数 |
| $R_X(t_1,t_2)$ | $E[X(t_1)X^*(t_2)]$ | 自相关函数 |
| $C_X(t_1,t_2)$ | $\mathrm{Cov}[X(t_1),X(t_2)]$ | 自协方差 |
| $R_{XY}(t_1,t_2)$ | $E[X(t_1)Y^*(t_2)]$ | 互相关 |
| $R_X(\tau)$ | $E[X(t+\tau)X^*(t)]$ | 宽平稳时只与 $\tau$ 有关 |
| $C_X(\tau)$ | $R_X(\tau)-\lvert\mu_X\rvert^2$ | 宽平稳自协方差 |
| $\rho_{XY}$ | $\dfrac{C_{XY}}{\sigma_X\sigma_Y}$ | 相关系数，只测线性相关 |

> [!warning] 约定差异
> 有些书把自相关写成 $E[X(t)X^*(t+\tau)]$，与 $E[X(t+\tau)X^*(t)]$ 互为共轭反转。对实过程两者相同；对复过程要注意 $R_X(-\tau)=R_X^*(\tau)$。

## 三、傅里叶变换与功率谱

本库统一采用**角频率 $\omega$（rad/s）**，连续傅里叶变换对为

$$X(\omega)=\int_{-\infty}^{\infty}x(t)e^{-j\omega t}\,\mathrm{d}t,\qquad
x(t)=\frac{1}{2\pi}\int_{-\infty}^{\infty}X(\omega)e^{j\omega t}\,\mathrm{d}\omega$$

离散时间傅里叶变换（DTFT）为

$$X(e^{j\omega})=\sum_{n=-\infty}^{\infty}x[n]e^{-j\omega n},\qquad
x[n]=\frac{1}{2\pi}\int_{-\pi}^{\pi}X(e^{j\omega})e^{j\omega n}\,\mathrm{d}\omega$$

DFT 采用正变换不除 $N$、反变换除 $N$ 的约定：

$$X[k]=\sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N},\qquad
x[n]=\frac{1}{N}\sum_{k=0}^{N-1}X[k]e^{j2\pi kn/N}$$

> [!warning] $\omega$ 与 $f$ 的换算
> $\omega=2\pi f$。本库默认双边功率谱 $S_X(\omega)$；若用 $S_X(f)$，则
> $$S_X(\omega)\,\mathrm{d}\omega=S_X(f)\,\mathrm{d}f,\qquad S_X(f)=\frac{1}{2\pi}S_X(2\pi f)$$
> 实过程常用**单边谱** $S_X^+(f)=2S_X(f)$（$f\ge0$），此时总功率为 $\int_0^\infty S_X^+(f)\,\mathrm{d}f$。写题时先声明单边还是双边。

| 符号 | 含义 | 单位 |
| --- | --- | --- |
| $S_X(\omega)$ | 双边功率谱密度 | 功率/（rad/s） |
| $S_X(f)$ | 双边功率谱密度 | 功率/Hz |
| $S_X^+(f)$ | 单边功率谱（实过程） | 功率/Hz |
| $R_X(\tau)$ | 自相关函数 | 功率 |
| $R_X(0)$ | 平均功率 | 功率 |
| $N_0/2$ | 双边白噪声 PSD | W/Hz |
| $N_0$ | 单边白噪声 PSD | W/Hz |

## 四、线性系统与矩阵

| 符号 | 含义 |
| --- | --- |
| $h(t),h[n]$ | 冲激响应 |
| $H(\omega),H(e^{j\omega})$ | 频率响应 |
| $H(z)$ | 系统函数 |
| $*$ | 卷积 |
| $\mathbf{A}^{T},\mathbf{A}^{H}$ | 转置 / 共轭转置 |
| $\mathbf{A}^{-1}$ | 逆矩阵 |
| $\lambda_i$ | 特征值 |
| $\mathbf{Q},\mathbf{\Lambda}$ | 特征向量矩阵 / 特征值对角阵 |
| $\mathbf{R}_{XX}$ | 随机向量协方差/相关矩阵 |
| $\mathrm{tr}(\cdot)$ | 迹 |
| $\lVert\cdot\rVert$ | 范数 |

## 五、估计与检测

| 符号 | 含义 | 说明 |
| --- | --- | --- |
| $\hat{\theta}$ | 参数估计量 | 带帽表示估计 |
| $\tilde{\theta}$ | 估计误差 | $\tilde{\theta}=\hat{\theta}-\theta$ |
| $\mathrm{bias}(\hat{\theta})$ | 偏差 | $E[\hat{\theta}]-\theta$ |
| $\mathrm{MSE}(\hat{\theta})$ | 均方误差 | $\mathrm{Var}+\mathrm{bias}^2$ |
| $\mathrm{CRLB}$ | Cramér-Rao 下界 | 无偏估计的方差下界 |
| $H_0,H_1$ | 原假设 / 备择假设 | 检测问题 |
| $P_{fa}$ | 虚警概率 | $P(\text{判 }H_1\mid H_0)$ |
| $P_d$ | 检测概率 | $P(\text{判 }H_1\mid H_1)$ |
| $\Lambda(x)$ | 似然比 | $f(x\mid H_1)/f(x\mid H_0)$ |
| $Q(\cdot)$ | 高斯尾概率 | $Q(x)=\int_x^\infty\frac{1}{\sqrt{2\pi}}e^{-t^2/2}dt$ |

## 六、复数与 IQ

- 复信号统一写作 $x(t)=I(t)+jQ(t)$，$j=\sqrt{-1}$。
- 复随机变量 $Z=X+jY$ 的均值 $\mu_Z=E[Z]$，方差 $\mathrm{Var}(Z)=E[\lvert Z-\mu_Z\rvert^2]$。
- 复高斯向量若**圆对称（proper）**，则伪协方差 $E[(Z-\mu)(Z-\mu)^T]=0$，协方差 $R=E[(Z-\mu)(Z-\mu)^H]$ 足够描述二阶统计。
- 实窄带信号的复包络与 IQ 关系见 [[vault-notes/fpga/ad9361/iq-signals]]。

## 七、书写纪律

1. 写出功率谱必须说明**单边/双边**。
2. 写出随机过程必须说明**连续/离散、实/复**。
3. 写出相关函数必须说明**是否去均值**（自相关还是自协方差）。
4. 写出估计量必须说明**偏差/方差/ MSE** 中的哪一个。
5. 公式里的 $j$ 统一用 $j$，不用 $i$（避免与电流/索引混淆）。

## 关联

- 导航：[[vault-notes/random-signals/00-knowledge-map]]
- 课程：[[vault-notes/random-signals/00-course-index]]
- 概率记号：[[vault-notes/math/probability/03-random-variables-distributions]]、[[vault-notes/math/probability/05-numerical-characteristics]]
- 变换记号：[[vault-notes/math/complex-analysis/07-fourier-transform]]、[[vault-notes/dsp/02-z-transform-and-dtft]]
- 复信号：[[vault-notes/math/complex-analysis/01-complex-numbers-functions]]、[[vault-notes/fpga/ad9361/iq-signals]]
