---
title: "参数估计"
tags:
- 数学
- 数理统计
- 参数估计
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
> 第 7 章有了样本与抽样分布，本章正式做"**用样本推断总体参数**"：
> - **1. 点估计**：用一个数估计未知参数——矩估计（用样本矩替换总体矩）与极大似然估计（让观测数据最可能发生）。
> - **2. 估计量的评价标准**：无偏性、有效性、相合性；均方误差 = 方差 + 偏差²。
> - **3. 区间估计**：不只给一个数，而是给一个"有把握覆盖真值"的区间；枢轴量法是通用套路。
> - **4. 例题**：矩估计、MLE、置信区间、样本量。
>
> 一句话主线：**点估计给"最像的值"，区间估计给"误差范围"；矩估计靠替换，MLE 靠最大化似然，区间估计靠抽样分布反推——三者都建立在第 7 章的 $\bar X$、$S^2$、$\chi^2$、$t$、$F$ 之上。**

> [!note] 记号约定
> - $\theta$：未知参数（可以是向量）；$\hat\theta$：估计量（随机变量）；$\hat\theta(x_1,\dots,x_n)$：估计值
> - $L(\theta)$：似然函数；$\ell(\theta)=\ln L(\theta)$：对数似然
> - $\hat\theta_{\mathrm{MM}}$：矩估计；$\hat\theta_{\mathrm{MLE}}$：极大似然估计
> - $1-\alpha$：置信水平（置信度）；$[\hat\theta_L,\hat\theta_U]$：置信区间
> - $z_{\alpha/2}$、$t_{\alpha/2}(n-1)$、$\chi^2_{\alpha/2}(n-1)$：上侧分位数
> - 无偏：$E(\hat\theta)=\theta$；有效：方差更小；相合：$\hat\theta\xrightarrow{P}\theta$

# 1. 点估计

> [!info] Def 1 点估计
> 设总体 $X$ 的分布含未知参数 $\theta$，$X_1,\dots,X_n$ 是样本。若用统计量 $\hat\theta=\hat\theta(X_1,\dots,X_n)$ 估计 $\theta$，则称 $\hat\theta$ 为 $\theta$ 的**点估计量**（point estimator），其观测值 $\hat\theta(x_1,\dots,x_n)$ 为**估计值**。

点估计的两个经典方法：矩估计与极大似然估计。

## 矩估计法

**思想**：用样本矩替换总体矩。

- 一阶矩：$E(X)\approx\bar X$
- 二阶矩：$E(X^2)\approx\frac1n\sum X_i^2$

**步骤**：

1. 写出总体矩 $E(X),E(X^2),\dots$（含未知参数）
2. 令它们等于样本矩
3. 解方程组得到 $\hat\theta$

> [!example] 矩估计：正态总体
> $X\sim N(\mu,\sigma^2)$，$\mu,\sigma^2$ 未知。
> $$E(X)=\mu,\qquad E(X^2)=\mu^2+\sigma^2$$
> 令
> $$\mu=\bar X,\qquad \mu^2+\sigma^2=\frac1n\sum X_i^2$$
> 解得
> $$\hat\mu=\bar X,\qquad \hat\sigma^2=\frac1n\sum(X_i-\bar X)^2$$
> 注意：矩估计的方差是除以 $n$，**不是无偏的**（除以 $n-1$ 才无偏）。

> [!example] 矩估计：均匀分布
> $X\sim U(0,\theta)$，$E(X)=\theta/2$。令 $\theta/2=\bar X$，得 $\hat\theta_{\mathrm{MM}}=2\bar X$。
> 这个估计量是无偏的：$E(2\bar X)=2\cdot\theta/2=\theta$。

## 极大似然估计

> [!info] Def 2 似然函数
> 设总体 $X$ 的密度（或分布律）为 $f(x;\theta)$，$x_1,\dots,x_n$ 是样本观测值。称
> $$L(\theta)=\prod_{i=1}^n f(x_i;\theta)$$
> 为**似然函数**（likelihood function）。它表示"参数取 $\theta$ 时，观察到这组数据的概率/密度"。

> [!info] Def 3 极大似然估计
> 若 $\hat\theta$ 使似然函数最大：
> $$\hat\theta_{\mathrm{MLE}}=\arg\max_{\theta}L(\theta)$$
> 则称 $\hat\theta_{\mathrm{MLE}}$ 为 $\theta$ 的**极大似然估计**（maximum likelihood estimate，简称 MLE）。

**求解步骤**：

1. 写出似然函数 $L(\theta)=\prod f(x_i;\theta)$
2. 取对数 $\ell(\theta)=\ln L(\theta)=\sum\ln f(x_i;\theta)$（把乘积变求和）
3. 求导并令其为 0：$\dfrac{\mathrm{d}\ell}{\mathrm{d}\theta}=0$
4. 解出 $\hat\theta$，并验证是最大值

> [!example] MLE：二项分布
> $X\sim B(1,p)$，样本 $x_1,\dots,x_n\in\{0,1\}$，其中 $k=\sum x_i$ 个 1。
> $$L(p)=p^k(1-p)^{n-k},\qquad \ell(p)=k\ln p+(n-k)\ln(1-p)$$
> $$\frac{\mathrm{d}\ell}{\mathrm{d}p}=\frac{k}{p}-\frac{n-k}{1-p}=0\ \Longrightarrow\ \hat p=\frac{k}{n}=\bar X$$
> 即 MLE 就是样本均值（频率）。

> [!example] MLE：泊松分布
> $X\sim P(\lambda)$，$L(\lambda)=\prod\dfrac{\lambda^{x_i}e^{-\lambda}}{x_i!}$。
> $$\ell(\lambda)=\left(\sum x_i\right)\ln\lambda-n\lambda-\sum\ln(x_i!)$$
> $$\frac{\mathrm{d}\ell}{\mathrm{d}\lambda}=\frac{\sum x_i}{\lambda}-n=0\ \Longrightarrow\ \hat\lambda=\bar X$$

> [!example] MLE：正态分布
> $X\sim N(\mu,\sigma^2)$。
> $$\ell(\mu,\sigma^2)=-\frac n2\ln(2\pi)-\frac n2\ln\sigma^2-\frac{1}{2\sigma^2}\sum(x_i-\mu)^2$$
> 对 $\mu$ 求偏导令 0：$\hat\mu=\bar X$。
> 对 $\sigma^2$ 求偏导令 0：$\hat\sigma^2=\frac1n\sum(x_i-\bar X)^2$。
> 注意：MLE 的方差估计也是除以 $n$，**有偏**（期望为 $\frac{n-1}{n}\sigma^2$）。

> [!example] MLE：均匀分布（非正则情形）
> $X\sim U(0,\theta)$，$L(\theta)=\theta^{-n}$（要求所有 $x_i\le\theta$）。
> $L$ 随 $\theta$ 增大而减小，故 $\theta$ 应取尽可能小，但必须 $\ge\max x_i$。因此
> $$\hat\theta_{\mathrm{MLE}}=\max(X_1,\dots,X_n)=X_{(n)}$$
> 这是"参数边界"情形：不能靠求导，要看约束。$X_{(n)}$ 的期望是 $\frac{n}{n+1}\theta$，**有偏**；乘以 $\frac{n+1}{n}$ 可得无偏估计。

> [!tip] 矩估计 vs MLE
> | 维度 | 矩估计 | 极大似然估计 |
> | --- | --- | --- |
> | 思想 | 样本矩替换总体矩 | 让观测数据最可能发生 |
> | 计算 | 解方程，通常简单 | 求导/数值优化，可能复杂 |
> | 大样本性质 | 相合 | 相合、渐近有效 |
> | 小样本 | 不一定最优 | 通常更优（但可能有偏） |
> | 边界情形 | 可能无解 | 需看约束（如均匀分布） |

# 2. 估计量的评价标准

## 无偏性

> [!info] Def 4 无偏估计
> 若
> $$E(\hat\theta)=\theta$$
> 则称 $\hat\theta$ 为 $\theta$ 的**无偏估计量**（unbiased estimator）。

- $\bar X$ 是 $\mu$ 的无偏估计：$E(\bar X)=\mu$
- $S^2=\frac{1}{n-1}\sum(X_i-\bar X)^2$ 是 $\sigma^2$ 的无偏估计：$E(S^2)=\sigma^2$
- MLE 的 $\hat\sigma^2=\frac1n\sum(X_i-\bar X)^2$ 是**有偏**的：$E(\hat\sigma^2)=\frac{n-1}{n}\sigma^2$

> [!warning] 无偏 ≠ 每个估计值都准
> 无偏只说明"平均而言没有系统偏差"，不代表一次估计就接近真值。一个方差很大的无偏估计，可能还不如一个方差很小的有偏估计。

## 有效性

> [!info] Def 5 有效估计
> 若 $\hat\theta_1,\hat\theta_2$ 都是 $\theta$ 的无偏估计，且
> $$D(\hat\theta_1)<D(\hat\theta_2)$$
> 则称 $\hat\theta_1$ 比 $\hat\theta_2$ **更有效**（more efficient）。

在无偏估计中，方差越小越好。**最小方差无偏估计**（MVUE）是理论上的最优目标。

> [!example] 均值的两个无偏估计
> $X_1,X_2$ 是来自均值 $\mu$ 的样本。
> $$\hat\mu_1=\frac{X_1+X_2}{2},\qquad \hat\mu_2=\frac{1}{3}X_1+\frac{2}{3}X_2$$
> 两者都无偏，但 $D(\hat\mu_1)=\sigma^2/2$，$D(\hat\mu_2)=\frac{5}{9}\sigma^2>\sigma^2/2$，故 $\hat\mu_1$ 更有效。

## 相合性（一致性）

> [!info] Def 6 相合估计
> 若当 $n\to\infty$ 时
> $$\hat\theta_n\xrightarrow{P}\theta$$
> 则称 $\hat\theta_n$ 为 $\theta$ 的**相合估计**（consistent estimator）。

相合性是大样本性质：样本越多，估计越准。矩估计和 MLE 在正则条件下通常都是相合的。

## 均方误差

$$MSE(\hat\theta)=E[(\hat\theta-\theta)^2]=D(\hat\theta)+[E(\hat\theta)-\theta]^2$$

即 **MSE = 方差 + 偏差²**。它同时惩罚"波动大"和"系统偏"，是比无偏性更全面的指标。

# 3. 区间估计

> [!info] Def 7 置信区间
> 设 $\theta$ 是未知参数，若由样本确定的两个统计量 $\hat\theta_L,\hat\theta_U$ 满足
> $$P(\hat\theta_L\le\theta\le\hat\theta_U)=1-\alpha$$
> 则称 $[\hat\theta_L,\hat\theta_U]$ 为 $\theta$ 的**置信水平 $1-\alpha$ 的置信区间**（confidence interval），$1-\alpha$ 为**置信度**。

> [!warning] 置信区间的正确解读
> "$95\%$ 置信区间"**不是**"$\theta$ 有 95% 的概率落在区间里"（$\theta$ 是常数，不是随机变量）。
> 正确解读：**反复抽样很多次，每次构造一个区间，约有 95% 的区间会覆盖真值 $\theta$。**
> 区间本身是随机的（随样本变），$\theta$ 是固定的。

## 枢轴量法

> [!info] Def 8 枢轴量
> 若 $G=G(X_1,\dots,X_n;\theta)$ 的分布**已知且不含未知参数**，则称 $G$ 为**枢轴量**（pivotal quantity）。由
> $$P(g_{1-\alpha/2}\le G\le g_{\alpha/2})=1-\alpha$$
> 反解出 $\theta$ 的范围，即得置信区间。

**通用步骤**：

1. 找一个含 $\theta$ 的统计量，使其分布已知（枢轴量）
2. 用分位数写出概率等式
3. 反解出 $\theta$ 的区间

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" width="100%" style="max-width:760px" font-family="inherit">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted,#57606a)"/></marker></defs>
  <line x1="400.0" y1="40.0" x2="400.0" y2="280.0" stroke="#dc2626" stroke-width="1.6" stroke-dasharray="6 4"/>
  <text x="400.0" y="30.0" text-anchor="middle" font-size="12" fill="#dc2626" font-weight="normal">真值 μ</text>
  <line x1="370.0" y1="55.0" x2="430.0" y2="55.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="370.0" y1="51.0" x2="370.0" y2="59.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="430.0" y1="51.0" x2="430.0" y2="59.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="59.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <line x1="360.0" y1="73.0" x2="450.0" y2="73.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="360.0" y1="69.0" x2="360.0" y2="77.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="450.0" y1="69.0" x2="450.0" y2="77.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="77.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <line x1="372.0" y1="91.0" x2="412.0" y2="91.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="372.0" y1="87.0" x2="372.0" y2="95.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="412.0" y1="87.0" x2="412.0" y2="95.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="95.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <line x1="350.0" y1="109.0" x2="470.0" y2="109.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="350.0" y1="105.0" x2="350.0" y2="113.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="470.0" y1="105.0" x2="470.0" y2="113.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="113.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <line x1="359.0" y1="127.0" x2="429.0" y2="127.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="359.0" y1="123.0" x2="359.0" y2="131.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="429.0" y1="123.0" x2="429.0" y2="131.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="131.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <line x1="358.0" y1="145.0" x2="458.0" y2="145.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="358.0" y1="141.0" x2="358.0" y2="149.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="458.0" y1="141.0" x2="458.0" y2="149.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="149.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <line x1="365.0" y1="163.0" x2="415.0" y2="163.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="365.0" y1="159.0" x2="365.0" y2="167.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="415.0" y1="159.0" x2="415.0" y2="167.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="167.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <line x1="342.0" y1="181.0" x2="482.0" y2="181.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="342.0" y1="177.0" x2="342.0" y2="185.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="482.0" y1="177.0" x2="482.0" y2="185.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="185.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <line x1="355.0" y1="199.0" x2="435.0" y2="199.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="355.0" y1="195.0" x2="355.0" y2="203.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="435.0" y1="195.0" x2="435.0" y2="203.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="203.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <line x1="376.0" y1="217.0" x2="436.0" y2="217.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="376.0" y1="213.0" x2="376.0" y2="221.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="436.0" y1="213.0" x2="436.0" y2="221.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="221.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <line x1="333.0" y1="235.0" x2="443.0" y2="235.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="333.0" y1="231.0" x2="333.0" y2="239.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="443.0" y1="231.0" x2="443.0" y2="239.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="239.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <line x1="364.0" y1="253.0" x2="454.0" y2="253.0" stroke="#059669" stroke-width="2.2"/>
  <line x1="364.0" y1="249.0" x2="364.0" y2="257.0" stroke="#059669" stroke-width="1.2"/>
  <line x1="454.0" y1="249.0" x2="454.0" y2="257.0" stroke="#059669" stroke-width="1.2"/>
  <text x="720.0" y="257.0" text-anchor="start" font-size="10" fill="#059669" font-weight="normal">覆盖</text>
  <text x="380.0" y="305.0" text-anchor="middle" font-size="12" fill="var(--text-muted,#57606a)" font-weight="normal">重复抽样 12 次：约 95% 的区间覆盖真值（绿色），少数不覆盖（红色）</text>
</svg>

## 单正态总体均值的置信区间

### 方差已知：z 区间

枢轴量

$$Z=\frac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)$$

置信区间：

$$\left[\bar X-z_{\alpha/2}\frac{\sigma}{\sqrt n},\ \bar X+z_{\alpha/2}\frac{\sigma}{\sqrt n}\right]$$

### 方差未知：t 区间

枢轴量

$$T=\frac{\bar X-\mu}{S/\sqrt n}\sim t(n-1)$$

置信区间：

$$\left[\bar X-t_{\alpha/2}(n-1)\frac{S}{\sqrt n},\ \bar X+t_{\alpha/2}(n-1)\frac{S}{\sqrt n}\right]$$

> [!example] 均值的 95% 置信区间
> 某测量值 $X\sim N(\mu,\sigma^2)$，抽 $n=16$，$\bar x=10$，$s=2$。求 $\mu$ 的 95% 置信区间。
> $\sigma$ 未知，用 $t(15)$：$t_{0.025}(15)=2.131$。
> $$\left[10-2.131\times\frac{2}{\sqrt{16}},\ 10+2.131\times\frac{2}{\sqrt{16}}\right]=[10-1.066,\ 10+1.066]=[8.934,\ 11.066]$$

## 单正态总体方差的置信区间

枢轴量

$$\chi^2=\frac{(n-1)S^2}{\sigma^2}\sim\chi^2(n-1)$$

置信区间：

$$\left[\frac{(n-1)S^2}{\chi^2_{\alpha/2}(n-1)},\ \frac{(n-1)S^2}{\chi^2_{1-\alpha/2}(n-1)}\right]$$

> [!warning] 方差区间的非对称性
> $\chi^2$ 分布不对称，所以方差置信区间**不是**关于 $S^2$ 对称的。不要把 $\pm$ 的写法套到方差上。

## 两个正态总体的区间估计

| 参数 | 条件 | 枢轴量 | 区间 |
| --- | --- | --- | --- |
| $\mu_1-\mu_2$ | 方差已知 | $Z$ | $(\bar X-\bar Y)\pm z_{\alpha/2}\sqrt{\frac{\sigma_1^2}{n_1}+\frac{\sigma_2^2}{n_2}}$ |
| $\mu_1-\mu_2$ | 方差未知但相等 | $t(n_1+n_2-2)$ | $(\bar X-\bar Y)\pm t_{\alpha/2}S_p\sqrt{\frac1{n_1}+\frac1{n_2}}$ |
| $\sigma_1^2/\sigma_2^2$ | 两总体正态 | $F(n_1-1,n_2-1)$ | $\left[\frac{S_1^2/S_2^2}{F_{\alpha/2}},\ \frac{S_1^2/S_2^2}{F_{1-\alpha/2}}\right]$ |

## 样本量的确定

由均值区间长度 $2z_{\alpha/2}\frac{\sigma}{\sqrt n}$ 可得：给定允许误差 $E$，

$$n=\left(\frac{z_{\alpha/2}\sigma}{E}\right)^2$$

若 $\sigma$ 未知，先用小样本估计或做预试验。

> [!example] 样本量
> 要求 $\mu$ 的 95% 置信区间半宽不超过 $0.5$，已知 $\sigma=2$。
> $$n=\left(\frac{1.96\times2}{0.5}\right)^2=61.5\ \Longrightarrow\ n=62$$

# 4. 例题

> [!example] 例 1：矩估计与 MLE
> 设 $X\sim E(\lambda)$，密度 $f(x)=\lambda e^{-\lambda x}$（$x>0$）。
> **矩估计**：$E(X)=1/\lambda$，令 $1/\lambda=\bar X$，得 $\hat\lambda_{\mathrm{MM}}=1/\bar X$。
> **MLE**：$L(\lambda)=\lambda^n e^{-\lambda\sum x_i}$，$\ell=n\ln\lambda-\lambda\sum x_i$。
> $$\frac{\mathrm{d}\ell}{\mathrm{d}\lambda}=\frac n\lambda-\sum x_i=0\ \Longrightarrow\ \hat\lambda_{\mathrm{MLE}}=\frac{1}{\bar X}$$
> 两者相同。

> [!example] 例 2：无偏性判断
> 设 $X_1,\dots,X_n$ 来自均值 $\mu$ 的总体。
> - $\hat\mu_1=\bar X$：$E(\bar X)=\mu$，无偏
> - $\hat\mu_2=X_1$：$E(X_1)=\mu$，无偏，但 $D(X_1)=\sigma^2>D(\bar X)=\sigma^2/n$，**不如 $\bar X$ 有效**
> - $\hat\mu_3=\frac{1}{n+1}\sum X_i$：$E=\frac{n}{n+1}\mu\ne\mu$，有偏

> [!example] 例 3：方差的置信区间
> 某正态总体抽 $n=10$，$s^2=4$。求 $\sigma^2$ 的 95% 置信区间。
> $\chi^2_{0.025}(9)=19.023$，$\chi^2_{0.975}(9)=2.700$。
> $$\left[\frac{9\times4}{19.023},\ \frac{9\times4}{2.700}\right]=[1.893,\ 13.333]$$
> 区间很宽——因为样本量小，方差估计的不确定性大。

> [!example] 例 4：两均值差的置信区间
> 两正态总体，$n_1=n_2=10$，$\bar x_1=5$、$\bar x_2=4$，$s_1^2=1$、$s_2^2=1.5$，方差未知但相等。求 $\mu_1-\mu_2$ 的 95% 置信区间。
> $$S_p^2=\frac{9\times1+9\times1.5}{18}=1.25,\qquad S_p=1.118$$
> $$t_{0.025}(18)=2.101$$
> $$(5-4)\pm2.101\times1.118\times\sqrt{\frac1{10}+\frac1{10}}=1\pm1.051=[-0.051,\ 2.051]$$
> 区间包含 0，不能断言 $\mu_1>\mu_2$（这与第 9 章的假设检验结论一致）。

> [!tip] 本章收官
> 本章把"用样本估计参数"分成两条路线：
> 1. **点估计**（1）：矩估计（替换）与 MLE（最大化似然）；MLE 通常更优，但边界情形要小心。
> 2. **评价标准**（2）：无偏、有效、相合；MSE = 方差 + 偏差²。
> 3. **区间估计**（3）：枢轴量法是通用套路；均值用 $z$ 或 $t$，方差用 $\chi^2$，两方差比用 $F$。
> 4. **例题**（4）：矩估计/MLE、无偏性、方差区间、两均值差。
>
> 一句话：**点估计给"最像的值"，区间估计给"误差范围"；抽样分布决定区间宽度，置信度决定分位数。下一章用同样的工具做假设检验——先假设参数等于某个值，再看样本是否"太不像"。**

# 本章知识地图

```
参数估计
├─ 1. 点估计
│     ├─ 矩估计：样本矩替换总体矩
│     ├─ 极大似然：L(θ)=∏f(x_i;θ)，最大化
│     ├─ 对数似然：ℓ=lnL，求导令 0
│     └─ 边界情形：均匀分布 U(0,θ) → X_(n)
│
├─ 2. 评价标准
│     ├─ 无偏：E(θ̂)=θ
│     ├─ 有效：无偏中方差更小
│     ├─ 相合：θ̂ →P θ
│     └─ MSE = 方差 + 偏差²
│
├─ 3. 区间估计
│     ├─ 置信区间：P(θ̂_L≤θ≤θ̂_U)=1−α
│     ├─ 枢轴量法：分布已知、不含未知参数
│     ├─ 均值（σ 已知）：z 区间
│     ├─ 均值（σ 未知）：t 区间
│     ├─ 方差：χ² 区间
│     ├─ 两均值差：z / t
│     ├─ 两方差比：F
│     └─ 样本量：n=(zσ/E)²
│
└─ 4. 例题
      ├─ 矩估计 vs MLE
      ├─ 无偏性判断
      ├─ 方差置信区间
      └─ 两均值差区间
```

# 关联

- 上一章：[[vault-notes/math/probability/07-samples-sampling-distributions]] —— $\bar X$、$S^2$、$\chi^2$、$t$、$F$ 是本章的工具
- 下一章：[[vault-notes/math/probability/09-hypothesis-testing]] —— 从"估计参数"转向"检验关于参数的假设"

**本章与前后章节的接口**

| 本章概念 | 后续落点 |
| --- | --- |
| 点估计、MLE | [[vault-notes/math/probability/09-hypothesis-testing]] 的检验统计量构造 |
| 无偏、有效、相合 | [[vault-notes/math/probability/06-law-of-large-numbers-clt]] 的相合性；[[vault-notes/math/probability/09-hypothesis-testing]] 的检验功效 |
| 置信区间 | [[vault-notes/math/probability/09-hypothesis-testing]] 的接受域；[[vault-notes/math/probability/10-anova-regression]] 的系数区间 |
| $\chi^2$ 区间 | [[vault-notes/math/probability/09-hypothesis-testing]] 的方差检验、拟合优度 |
| $t$ 区间 | [[vault-notes/math/probability/09-hypothesis-testing]] 的 t 检验 |
| $F$ 区间 | [[vault-notes/math/probability/09-hypothesis-testing]] 的 F 检验；[[vault-notes/math/probability/10-anova-regression]] 的方差分析 |

**本章留下的三个悬念（第 9 章结清）**：

| 本章的悬念 | 第 9 章的答案 |
| --- | --- |
| 有了估计值，怎么判断"参数是否等于某个值"？ | 假设检验：构造检验统计量，看是否落入拒绝域 |
| 置信区间和假设检验是什么关系？ | 置信区间对应"接受域"；区间包含假设值 ⇔ 不拒绝原假设 |
| 怎么控制"误判"的概率？ | 显著性水平 $\alpha$、两类错误、$p$ 值、检验功效 |

**通信方向应用**：

- [[vault-notes/communication/03-random-processes]] —— 噪声方差、信道增益、时延的估计都是参数估计；MLE 是信道估计的核心方法。
- [[vault-notes/communication/04-channel]] —— 信噪比估计、信道容量估计；置信区间给出估计精度。
- [[vault-notes/communication/09-optimal-reception]] —— 最大似然接收机就是"在假设空间里做 MLE"；误码率是估计错误的概率。
- [[vault-notes/5g/phy/04-physical-channels-signals]] —— 信道估计、SNR 估计、定时/频偏估计都是参数估计的工程实现。
- [[vault-notes/matlab/matlab-notes]] —— `mle`/`fitdist`/`normfit`/`tinv`/`chi2inv`/`finv` 是本章的直接工具。

**相关**：[[vault-notes/math/probability/07-samples-sampling-distributions]]｜[[vault-notes/math/probability/09-hypothesis-testing]]｜[[vault-notes/communication/03-random-processes]]｜[[vault-notes/matlab/matlab-notes]]
