---
title: "似然比检验"
tags:
- 随机信号处理
- 08-信号检测理论
- 似然比
- 判决规则
type: concept
subjects:
- 随机信号处理
- 统计信号处理
domains:
- 估计与检测
- 统计信号处理
status: learning
aliases: []
prerequisites: []
related: []
---

# 似然比检验

> [!abstract] 这一节在讲什么
> 似然比检验（LRT）把检测问题统一成“比较两个假设下观测出现的相对可能性”。它不仅是 Bayes 与 Neyman-Pearson 准则的共同判决形式，还能借助对数把独立样本的乘积变成求和。本节给出 LRT 的一般形式、门限的含义、高斯例子，以及充分统计量如何把高维观测压成一维判决量。

## 一、LRT 的定义与形式

> [!info] 定义 似然比检验
> 对简单假设 $H_0:\mathbf{x}\sim f_0(\mathbf{x})$ 与 $H_1:\mathbf{x}\sim f_1(\mathbf{x})$，似然比定义为 $\Lambda(\mathbf{x})=f_1(\mathbf{x})/f_0(\mathbf{x})$。给定门限 $\eta>0$，LRT 的判决规则为
>
> $$\Lambda(\mathbf{x})\underset{H_0}{\overset{H_1}{\gtrless}}\eta$$

$\Lambda$ 越大，观测在 $H_1$ 下出现的相对可能性越高，越倾向判 $H_1$。门限 $\eta$ 不是 LRT 本身的一部分，而由设计准则决定：Bayes 准则用先验与代价算 $\eta$，Neyman-Pearson 准则用 $P_{fa}=\alpha$ 反解 $\eta$。

> [!tip] 似然比的直观含义
> 把 $\Lambda$ 想成“证据强度”：$\Lambda=10$ 表示同样一组数据在 $H_1$ 下出现的可能性是 $H_0$ 下的 10 倍。门限就是“需要多强的证据才愿意改变判决”。

## 二、对数似然比与门限

独立同分布样本的联合密度是乘积，直接算 $\Lambda$ 容易下溢，实际都用对数：

$$\ln\Lambda(\mathbf{x})=\sum_{n=1}^{N}\ln\frac{f_1(x_n)}{f_0(x_n)}$$

判决规则变成

$$\ln\Lambda(\mathbf{x})\underset{H_0}{\overset{H_1}{\gtrless}}\ln\eta$$

对数把“乘积型证据”变成“可累加的分数”，每一新样本只贡献一项，天然适合序贯处理。若某项为正，说明该样本更支持 $H_1$；为负则支持 $H_0$。序贯概率比检验（SPRT）正是让这个累加量在越过上、下门限时提前停止。

> [!warning] 门限不是恒等于 1
> 只有在等先验、均匀代价的 Bayes 准则下才有 $\eta=1$。雷达为了压低虚警会把 $\eta$ 取大；通信中若两种符号等概且误码代价相同，门限才落在似然比 1 附近。把“似然比大于 1 就判有信号”当成普适规则是常见错误。

## 三、高斯例子：N 个样本的均值偏移

设 $H_0$ 下 $x_n\sim\mathcal{N}(0,\sigma^2)$，$H_1$ 下 $x_n\sim\mathcal{N}(\mu,\sigma^2)$，样本独立，$\mu>0$。对数似然比为

$$\ln\Lambda(\mathbf{x})=\sum_{n=1}^{N}\left[-\frac{(x_n-\mu)^2}{2\sigma^2}+\frac{x_n^2}{2\sigma^2}\right]=\frac{\mu}{\sigma^2}\sum_{n=1}^{N}x_n-\frac{N\mu^2}{2\sigma^2}$$

它只通过样本和 $T=\sum x_n$ 依赖于数据，且是 $T$ 的单调增函数。因此 LRT 等价于

$$\bar{x}\underset{H_0}{\overset{H_1}{\gtrless}}\gamma,\qquad \gamma=\frac{\sigma^2}{N\mu}\ln\eta+\frac{\mu}{2}$$

两类错误为

$$P_{fa}=Q\left(\frac{\gamma\sqrt{N}}{\sigma}\right),\qquad P_d=Q\left(\frac{(\gamma-\mu)\sqrt{N}}{\sigma}\right)$$

样本数 $N$ 只以 $\sqrt{N}$ 的形式进入，说明检测性能随样本数按“功率”改善：$N$ 翻倍，等效信噪比提高 $\sqrt{2}$ 倍。

> [!example] 给定虚警率反解门限
> 取 $\sigma=1$、$\mu=1$、$N=16$、$P_{fa}=10^{-3}$。由 $Q(\gamma\sqrt{N}/\sigma)=10^{-3}$ 得 $\gamma\sqrt{N}=3.090$，即 $\gamma=0.7725$。于是
>
> $$P_d=Q\left((0.7725-1)\times4\right)=Q(-0.910)\approx0.819$$
>
> 若把 $N$ 增到 25，门限降到 $\gamma=0.618$，$P_d=Q(-1.91)\approx0.972$。同样的虚警率下，检测率显著提高。

## 四、充分统计量

> [!info] 定义 充分统计量
> 若条件分布 $f(\mathbf{x}\mid T(\mathbf{x})=t)$ 与未知参数无关，则称 $T(\mathbf{x})$ 为**充分统计量**。等价地，联合密度可分解为 $f(\mathbf{x};\theta)=g(T(\mathbf{x});\theta)h(\mathbf{x})$。

充分统计量把与判决无关的观测细节全部丢掉，而不损失任何关于假设的信息。LRT 只依赖 $\Lambda$，而 $\Lambda$ 若只通过 $T$ 依赖数据，$T$ 就是充分统计量。高斯均值例子中 $T=\sum x_n$ 是充分统计量，任何一一变换（如 $\bar{x}$）也充分。

> [!tip] 降维的意义
> 接收机不需要保存 $N$ 个采样点，只需一个相关值或匹配滤波输出。充分统计量给出了“到底需要保留多少信息”的理论答案，也是 [[vault-notes/random-signals/08-matched-filter-detection]] 能用单个抽样值完成判决的原因。

## 五、与 NP 准则及复合假设的关系

对简单对简单假设，Neyman-Pearson 引理保证：在给定 $P_{fa}=\alpha$ 的所有检验中，LRT（门限由 $\alpha$ 确定）的 $P_d$ 最大。因此 **LRT 是判决形式，NP 是选门限的准则**；Bayes 准则则用先验和代价选门限。三者不是互斥的方法，而是同一判决结构的不同参数化。

| 准则 | 门限由什么决定 | 最优性 | 典型场景 |
| --- | --- | --- | --- |
| Bayes | 先验 $\pi_j$ 与代价 $C_{ij}$ | 平均风险最小 | 通信符号判决 |
| Neyman-Pearson | 给定 $P_{fa}=\alpha$ | 固定虚警下 $P_d$ 最大 | 雷达、告警 |
| LRT | 任意 $\eta$ | 构成一类可取检验 | 理论分析 |
| GLRT | 用 MLE 替代未知参数 | 无全局最优保证，大样本近似 | 复合假设 |

复合假设下，$H_1$ 中含有未知参数（如未知幅度、相位、时延），一般不存在对所有参数都最优的一致最大功效检验。工程上常用广义似然比检验：

$$\Lambda_G(\mathbf{x})=\frac{\max_{\theta_1}f(\mathbf{x};\theta_1,H_1)}{\max_{\theta_0}f(\mathbf{x};\theta_0,H_0)}$$

把未知参数换成各自的最大似然估计再比较。GLRT 实现简单、渐近有效，但小样本下不保证最优，门限通常要靠仿真或渐近分布确定。

## 关联

- 上一节：[[vault-notes/random-signals/08-hypothesis-testing]]
- 下一节：[[vault-notes/random-signals/08-neyman-pearson]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/09-hypothesis-testing]]、[[vault-notes/math/probability/08-parameter-estimation]]、[[vault-notes/communication/11-error-control-coding]]
