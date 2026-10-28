---
title: 数理统计与推断
description: 从样本、抽样分布到参数估计、假设检验、方差分析与回归：如何用有限数据推断总体并给出置信度。
tags:
  - mathematics
  - statistics
  - estimation
  - hypothesis-testing
---

## 为什么仿真数据需要统计推断

一次蒙特卡洛仿真得到 $10^{6}$ 个比特、若干个错误，这是一个**样本**；我们真正关心的是总体误码率。一次滤波器测试得到若干组测量值，我们想判断"新算法是否真的更好"。这些问题都需要从样本推断总体，并且给出**不确定性**（置信区间、p 值），否则"好一点"可能只是随机波动。

本文假设读者已掌握 [[mathematics/probability-overview|概率论概览]] 中的分布、期望、方差与大数定律。顺序是：抽样分布 → 参数估计 → 假设检验 → 方差分析与回归 → 随机数生成与仿真验证。

## 总体、样本与统计量

**总体**是研究对象全体（用随机变量 $X$ 及其分布描述），**个体**是其中一个观测。**简单随机样本** $X_1,\dots,X_n$ 是独立同分布、与总体同分布的随机变量；观测后得到具体数值 $x_1,\dots,x_n$。样本具有**二重性**：在推导中用随机变量看，在计算中用数值看。

**统计量**是样本的函数，且不含未知参数，例如

$$
\bar X=\frac1n\sum_{i=1}^{n}X_i,
\qquad
S^2=\frac{1}{n-1}\sum_{i=1}^{n}(X_i-\bar X)^2
$$

样本均值与样本方差的核心性质：

$$
E(\bar X)=\mu,
\qquad
\operatorname{Var}(\bar X)=\frac{\sigma^2}{n},
\qquad
E(S^2)=\sigma^2
$$

$S^2$ 分母取 $n-1$ 正是为了**无偏**：若分母取 $n$，则 $E(S^2)=\frac{n-1}{n}\sigma^2$，系统性偏小。（证明思路：$\sum(X_i-\bar X)^2=\sum(X_i-\mu)^2-n(\bar X-\mu)^2$，取期望得 $(n-1)\sigma^2$。）

样本均值本身的分布：若总体 $N(\mu,\sigma^2)$，则

$$
\bar X\sim N\left(\mu,\frac{\sigma^2}{n}\right)
$$

样本量每增大 4 倍，均值的标准差减半——这是"多测几次取平均能降噪"的定量版本。

## 抽样分布：三大分布

### 卡方、t、F 的定义

设 $X_1,\dots,X_n$ 独立同分布 $N(0,1)$：

$$
\chi^2=X_1^2+\cdots+X_n^2\sim\chi^2(n),
\qquad
E(\chi^2)=n,\quad D(\chi^2)=2n
$$

设 $X\sim N(0,1)$、$Y\sim\chi^2(n)$ 且独立：

$$
T=\frac{X}{\sqrt{Y/n}}\sim t(n)
$$

$t$ 分布关于 0 对称、比正态厚尾，$n\to\infty$ 时趋于 $N(0,1)$。设 $X\sim\chi^2(n_1)$、$Y\sim\chi^2(n_2)$ 且独立：

$$
F=\frac{X/n_1}{Y/n_2}\sim F(n_1,n_2),
\qquad
\frac{1}{F}\sim F(n_2,n_1)
$$

记忆方法：$\chi^2$ 是**正态平方和**；$t$ 是**正态除以卡方开方**；$F$ 是**两个卡方之比**。

### 正态总体的四条核心结论

设总体 $X\sim N(\mu,\sigma^2)$，样本容量 $n$：

$$
\frac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1),
\qquad
\frac{(n-1)S^2}{\sigma^2}\sim\chi^2(n-1)
$$

且 $\bar X$ 与 $S^2$ **相互独立**；当 $\sigma$ 未知时用 $S$ 替代：

$$
\frac{\bar X-\mu}{S/\sqrt n}\sim t(n-1)
$$

最后一条是区间估计与 $t$ 检验的基石：**总体方差未知时，均值的标准化统计量服从 $t(n-1)$ 而不是正态**。忽略这一点、直接用 $z$ 区间，在小样本时置信度会低于标称值。

### 两个正态总体的抽样分布

$$
\frac{(\bar X-\bar Y)-(\mu_1-\mu_2)}
{\sqrt{\sigma_1^2/n_1+\sigma_2^2/n_2}}\sim N(0,1)
\quad(\sigma_1,\sigma_2\text{ 已知})
$$

$$
\frac{S_1^2/\sigma_1^2}{S_2^2/\sigma_2^2}\sim F(n_1-1,n_2-1)
$$

当 $\sigma_1^2=\sigma_2^2$ 时，用合并方差

$$
S_p^2=\frac{(n_1-1)S_1^2+(n_2-1)S_2^2}{n_1+n_2-2},
\qquad
\frac{(\bar X-\bar Y)-(\mu_1-\mu_2)}{S_p\sqrt{1/n_1+1/n_2}}\sim t(n_1+n_2-2)
$$

### 分位数

上侧分位数 $z_\alpha$ 满足 $P(Z>z_\alpha)=\alpha$。常用值：$z_{0.025}=1.96$、$z_{0.05}=1.645$、$z_{0.005}=2.576$。$t$ 分布对称，故 $t_{1-\alpha}(n)=-t_\alpha(n)$；$F$ 有倒数关系 $F_{1-\alpha}(n_1,n_2)=1/F_\alpha(n_2,n_1)$。现代工程直接用软件函数（`norminv`、`tinv`、`chi2inv`、`finv`）而不再查表。

## 参数估计

### 矩估计

用样本矩替换总体矩：令 $E(X)=\bar X$、$E(X^2)=\frac1n\sum X_i^2$，解出未知参数。正态总体得 $\hat\mu=\bar X$、$\hat\sigma^2=\frac1n\sum(X_i-\bar X)^2$（注意矩估计的方差除以 $n$，**有偏**）；均匀分布 $U(0,\theta)$ 得 $\hat\theta=2\bar X$（无偏）。

### 极大似然估计

似然函数 $L(\theta)=\prod_i f(x_i;\theta)$，取对数后求导：

$$
\hat\theta_{\mathrm{MLE}}=\arg\max_\theta L(\theta),
\qquad
\frac{d\ell}{d\theta}=0
$$

常见结果：

- $B(1,p)$：$\hat p=\bar X$；
- $P(\lambda)$：$\hat\lambda=\bar X$；
- $N(\mu,\sigma^2)$：$\hat\mu=\bar X$、$\hat\sigma^2=\frac1n\sum(X_i-\bar X)^2$（有偏，期望为 $\frac{n-1}{n}\sigma^2$）；
- $U(0,\theta)$：不能用求导！似然 $L=\theta^{-n}$ 在约束 $\theta\ge\max x_i$ 下随 $\theta$ 减小而增大，故 $\hat\theta_{\max}=X_{(n)}$，其期望为 $\frac{n}{n+1}\theta$，乘以 $\frac{n+1}{n}$ 才无偏。

> [!warning] 边界情形不能求导
> 当参数出现在积分/求和的上限（支撑集依赖参数）时，"导数为零"的常规方法失效，必须回到定义看约束。均匀分布的 MLE 是典型例子，也是考点。

### 评价标准

- **无偏性**：$E(\hat\theta)=\theta$；
- **有效性**：无偏估计中方差更小者更有效；
- **相合性**：$\hat\theta\xrightarrow{P}\theta$；
- **均方误差**：$\operatorname{MSE}(\hat\theta)=\operatorname{Var}(\hat\theta)+[\text{偏差}]^2$，它允许"有偏但方差小"的估计在 MSE 意义下更优（偏差–方差权衡）。

### 区间估计：枢轴量法

找含待估参数、但分布已知且不含其他未知参数的**枢轴量**，再由分位数反解出区间。置信水平 $1-\alpha$ 的含义是：**重复抽样时约 $100(1-\alpha)\%$ 的区间会覆盖真值**，而不是"真值有 $1-\alpha$ 的概率落在本次区间内"（真值是固定数，区间是随机的）。

**单正态总体均值**：

- $\sigma$ 已知：$\bar X\pm z_{\alpha/2}\frac{\sigma}{\sqrt n}$；
- $\sigma$ 未知：$\bar X\pm t_{\alpha/2}(n-1)\frac{S}{\sqrt n}$。

**单正态总体方差**：

$$
\left[\frac{(n-1)S^2}{\chi^2_{\alpha/2}(n-1)},\
\frac{(n-1)S^2}{\chi^2_{1-\alpha/2}(n-1)}\right]
$$

**样本量确定**：要求误差限不超过 $E$ 时，

$$
n\ge\left(\frac{z_{\alpha/2}\,\sigma}{E}\right)^2
$$

**例**：某测量噪声标准差估计为 $S=0.3$，希望均值置信区间半宽不超过 $0.05$（95% 置信），则 $n\ge(1.96\times0.3/0.05)^2\approx138.3$，取 $n=139$。如果 $\sigma$ 也未知，实际应改用 $t$ 分位数并迭代确定 $n$。

## 假设检验

### 基本概念

**原假设** $H_0$ 与**备择假设** $H_1$ 互斥且完备，等号通常放在 $H_0$。检验有两类错误：

| 判决 \ 真实 | $H_0$ 真 | $H_0$ 假 |
| --- | --- | --- |
| 不拒绝 $H_0$ | 正确 | 第二类错误（取伪，概率 $\beta$） |
| 拒绝 $H_0$ | 第一类错误（弃真，概率 $\alpha$） | 正确（功效 $1-\beta$） |

$\alpha$ 是显著性水平，也常被称为"犯第一类错误的概率上限"。$\alpha$ 与 $\beta$ 不能同时减小，除非增大样本量或提高效应量。**拒绝 $H_0$ 是"证据足够强"，不拒绝只是"证据不足"**，不能写成"接受 $H_0$ 成立"。

**p 值**：在 $H_0$ 成立的前提下，出现"当前统计量或更极端"结果的概率。$p\le\alpha$ 时拒绝 $H_0$。p 值不是"$H_0$ 为真的概率"，也不衡量效应大小。

### 正态总体的常用检验

- 均值，$\sigma$ 已知：$z=\dfrac{\bar X-\mu_0}{\sigma/\sqrt n}\sim N(0,1)$；
- 均值，$\sigma$ 未知：$t=\dfrac{\bar X-\mu_0}{S/\sqrt n}\sim t(n-1)$；
- 方差：$\chi^2=\dfrac{(n-1)S^2}{\sigma_0^2}\sim\chi^2(n-1)$；
- 两均值差（方差未知但相等）：$t=\dfrac{\bar X-\bar Y}{S_p\sqrt{1/n_1+1/n_2}}\sim t(n_1+n_2-2)$；
- 两方差比：$F=\dfrac{S_1^2}{S_2^2}\sim F(n_1-1,n_2-1)$（在 $\sigma_1=\sigma_2$ 下）。

**双侧检验**的拒绝域形如 $|T|>t_{\alpha/2}$；**单侧检验**把 $\alpha$ 全部放在一侧。检验与置信区间对偶：$1-\alpha$ 置信区间不包含 $\mu_0$ 等价于双侧检验在水平 $\alpha$ 下拒绝 $H_0$。

**拟合优度检验**：把观测频数 $O_i$ 与理论频数 $E_i$ 比较，

$$
\chi^2=\sum_{i=1}^{k}\frac{(O_i-E_i)^2}{E_i}\sim\chi^2(k-1-r)
$$

其中 $r$ 是用样本估计的参数个数；要求每个 $E_i\ge5$，否则合并相邻类别。它回答"样本是否来自某个指定分布"，是检验随机数生成器分布是否正确的基本工具。

## 方差分析（ANOVA）

**单因素方差分析**用于比较 $r$ 个总体的均值是否相同。模型：

$$
X_{ij}=\mu_i+\varepsilon_{ij},
\qquad
\varepsilon_{ij}\sim N(0,\sigma^2)\ \text{独立}
$$

检验 $H_0:\mu_1=\cdots=\mu_r$。平方和分解：

$$
SST=\sum_{i=1}^{r}\sum_{j=1}^{n_i}(X_{ij}-\bar X)^2,
\qquad
SSA=\sum_{i=1}^{r}n_i(\bar X_i-\bar X)^2,
\qquad
SSE=SST-SSA
$$

含义：SST 是总波动，SSA 是"组间差异"（处理效应），SSE 是"组内差异"（随机误差）。自由度分别为 $n-1$、$r-1$、$n-r$。检验统计量

$$
F=\frac{MSA}{MSE}=\frac{SSA/(r-1)}{SSE/(n-r)}\sim F(r-1,n-r)
$$

方差分析表：

| 来源 | 平方和 | 自由度 | 均方 | F |
| --- | --- | --- | --- | --- |
| 组间 | SSA | $r-1$ | $MSA=SSA/(r-1)$ | $MSA/MSE$ |
| 组内 | SSE | $n-r$ | $MSE=SSE/(n-r)$ | — |
| 总和 | SST | $n-1$ | — | — |

$F$ 很大说明组间差异相对于随机误差更显著，拒绝"所有组均值相等"。ANOVA 的前提是**独立、正态、方差齐性**；不满足方差齐性时可用 Welch ANOVA，不满足正态时可用非参数检验（Kruskal–Wallis）。

## 一元线性回归

模型

$$
Y=\beta_0+\beta_1x+\varepsilon,
\qquad
\varepsilon\sim N(0,\sigma^2)
$$

最小二乘估计：

$$
\hat\beta_1=\frac{S_{xy}}{S_{xx}},
\qquad
\hat\beta_0=\bar y-\hat\beta_1\bar x,
$$

$$
S_{xx}=\sum(x_i-\bar x)^2,\quad
S_{xy}=\sum(x_i-\bar x)(y_i-\bar y)
$$

平方和分解：

$$
S_{yy}=SSR+SSE,
\qquad
SSR=\hat\beta_1S_{xy},
\qquad
R^2=\frac{SSR}{S_{yy}}
$$

$R^2$ 是"被模型解释的变异比例"，越接近 1 拟合越好，但**高 $R^2$ 不代表因果，也不代表预测一定准**（过拟合时 $R^2$ 会虚高）。

回归系数的显著性检验：

$$
t=\frac{\hat\beta_1}{s/\sqrt{S_{xx}}}\sim t(n-2),
\qquad
s^2=\frac{SSE}{n-2}
$$

拒绝 $\beta_1=0$ 说明 $x$ 与 $y$ 存在显著线性关系。预测分两种：均值响应的置信区间与**个体值**的预测区间，后者更宽（多了一个 $\varepsilon$ 的方差）。外推（$x$ 超出观测范围）风险很大，回归模型没有依据。

## 随机变量函数与随机数生成（附录要点）

仿真的一切随机样本最终都来自均匀随机数。常见生成方法：

- **逆变换法**：$X=F^{-1}(U)$，$U\sim U(0,1)$。指数分布 $X=-\ln(1-U)/\lambda$；瑞利分布 $R=\sigma\sqrt{-2\ln(1-U)}$。
- **舍选法**：找包络 $M g(x)\ge f(x)$，从 $g$ 抽样、以 $f/(Mg)$ 的概率接受；接受率 = 面积比。
- **Box–Muller**：两个独立均匀数生成两个独立标准正态

$$
z_1=\sqrt{-2\ln u_1}\cos(2\pi u_2),
\qquad
z_2=\sqrt{-2\ln u_1}\sin(2\pi u_2)
$$

- **相关高斯（Cholesky）**：协方差 $\Sigma=LL^{T}$，令 $\mathbf{x}=\boldsymbol{\mu}+L\mathbf{z}$，$\mathbf{z}\sim N(\mathbf{0},I)$，则 $\operatorname{Cov}(\mathbf{x})=\Sigma$。
- **蒙特卡洛误码率**：样本量 $N\ge 1/(P_e\varepsilon^2)$（相对误差 $\varepsilon$）；结果应报告置信区间，而不只是一个数。
- **生成质量检验**：KS 统计量 $D=\max|F_{\text{emp}}-F_{\text{theo}}|$，5% 临界值约 $1.36/\sqrt N$；也可用 $\chi^2$ 拟合优度与 Q–Q 图。

## MATLAB 验证

```matlab
rng(42);                         % 固定种子，结果可复现
N = 1e5;

% 1) 逆变换法：指数与瑞利
u = rand(1, N);
x = -log(1 - u) / 2;             % E(lambda=2)
r = 1.5 * sqrt(-2 * log(rand(1, N)));   % Rayleigh(sigma=1.5)

% 2) Box-Muller 与相关高斯
u1 = rand(1, N); u2 = rand(1, N);
z1 = sqrt(-2 * log(u1)) .* cos(2 * pi * u2);
rho = 0.8; Sigma = [1 rho; rho 1];
L = chol(Sigma, 'lower');
Xc = L * randn(2, N);            % 两路相关标准高斯
fprintf('样本相关: %.3f (理论 %.1f)\n', Xc(1,:) * Xc(2,:)' / N, rho);

% 3) 单样本 t 区间与 t 检验（假设数据）
data = 0.1 + 0.2 * randn(1, 30);
[~, ~, ci, stats] = ttest(data, 0.1);   % H0: mu = 0.1
fprintf('均值 %.3f, t=%.2f, p=%.3f, CI=[%.3f, %.3f]\n', ...
    mean(data), stats.tstat, stats.p, ci(1), ci(2));

% 4) 单因素方差分析（假设数据：三组）
g = [ones(1,10), 2*ones(1,10), 3*ones(1,10)];
y = [randn(1,10), 1 + randn(1,10), 2 + randn(1,10)];
[p, tbl] = anova1(y, g, 'off');
fprintf('ANOVA p = %.4f\n', p);
disp(tbl);

% 5) 一元线性回归（假设数据）
xx = (1:20)'; yy = 2 + 0.5 * xx + 0.3 * randn(20, 1);
mdl = fitlm(xx, yy);
disp(mdl.Coefficients);
fprintf('R^2 = %.4f\n', mdl.Rsquared.Ordinary);
```

> [!note] 这些结果的含义
> 这些函数输出的是"数据与 $H_0$ 的相容程度"：p 值小并不说明效应大，还要看置信区间与效应量。方差分析只回答"至少有一组均值不同"，具体哪两组不同需要事后多重比较（如 Tukey HSD）。回归的 $R^2$ 与系数 p 值都要结合残差诊断看。

## 易错点

> [!warning] 统计推断的常见误用
> 1. **把置信区间解释成"真值有 95% 概率在里面"**：真值是固定的，随机的是区间；正确说法是"重复抽样下约 95% 的区间覆盖真值"。
> 2. **把 p 值当效应大小**：样本量极大时，微小差异也能显著；要同时报告置信区间与效应量。
> 3. **"不拒绝 $H_0$"写成"证明 $H_0$"**：可能只是样本量不足、功效低。
> 4. **忽略前提**：$t$ 检验假设正态（小样本时重要）、方差齐性（两样本 $t$）；不满足时要换方法或做变换。
> 5. **多重比较不校正**：同时做 20 次 5% 检验，至少一次假阳性的概率约 64%；要用 Bonferroni 或 FDR。
> 6. **把相关当因果、把 $R^2$ 当预测能力**：回归诊断（残差图、异常点、外推）不能省。
> 7. **误码率仿真只报点估计**：没有置信区间的 BER 曲线无法判断改进是否显著。

## 前置与相关

前置：[[mathematics/probability-overview|概率论概览]]（分布、期望、方差、大数定律与中心极限定理）。相关：[[signal-processing/random-processes|随机信号、估计与检测]]（估计量、检测与 ROC）、[[signal-processing/statistical-estimation-filtering|统计估计与滤波]]（MMSE、维纳与卡尔曼）、[[signal-processing/random-signal-experiments|随机信号实验]]（仿真与结果检验）、[[programming/matlab-for-dsp|MATLAB 与 DSP 仿真]]、[[mathematics/formula-sheet|数学公式速查]]。

## 来源与延伸阅读

- [[vault-notes/math/probability/07-samples-sampling-distributions|样本及抽样分布（详细笔记）]]：总体与样本、统计量、三大分布、正态总体四条结论、两样本、分位数。
- [[vault-notes/math/probability/08-parameter-estimation|参数估计（详细笔记）]]：矩估计、极大似然（二项/泊松/正态/均匀）、无偏/有效/相合/MSE、枢轴量与各类置信区间、样本量。
- [[vault-notes/math/probability/09-hypothesis-testing|假设检验（详细笔记）]]：两类错误、检验统计量与拒绝域、p 值、$z/t/\chi^2/F$ 检验、拟合优度、与置信区间的关系。
- [[vault-notes/math/probability/10-anova-regression|方差分析与回归分析（详细笔记）]]：单因素 ANOVA 模型、平方和分解、方差分析表、一元线性回归、显著性检验、预测。
- [[vault-notes/math/probability/appendix-random-variable-functions|附录：随机变量函数与随机数生成（详细笔记）]]：卷积与雅可比、逆变换/舍选/Box–Muller/Cholesky、通信仿真应用、蒙特卡洛误码率、KS 检验与完整 MATLAB 代码。
