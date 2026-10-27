---
title: "ROC曲线"
tags:
- 随机信号处理
- 08-信号检测理论
- ROC
- 性能评估
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

# ROC曲线

> [!abstract] 这一节在讲什么
> 门限一变，虚警率和检测概率同时变化，单看某一组 $(P_{fa},P_d)$ 无法评价检测器整体性能。ROC 曲线把门限扫一遍，画出 $P_d$ 随 $P_{fa}$ 变化的完整轨迹。本节给出 ROC 的定义与性质、AUC 的含义、高斯偏移下的解析表达式，以及如何按工程需求选工作点。

## 一、定义与构造

> [!info] 定义 ROC 曲线
> 对每个门限 $\gamma$，计算 $P_{fa}(\gamma)$ 与 $P_d(\gamma)$，把点 $(P_{fa}(\gamma),P_d(\gamma))$ 画在平面上，得到的参数曲线称为**接收机工作特性**（receiver operating characteristic，ROC）。

构造步骤很机械：取一族判决规则（通常是 LRT 的不同门限）；对每个门限算两个概率；连线。曲线的横轴是虚警率，纵轴是检测概率，越靠近左上角越好。

| 门限 | 判决倾向 | $P_{fa}$ | $P_d$ | ROC 上的位置 |
| --- | --- | --- | --- | --- |
| 很低 | 几乎总判 $H_1$ | 接近 1 | 接近 1 | 右上角 |
| 居中 | 权衡 | 中等 | 中等 | 曲线中段 |
| 很高 | 几乎总判 $H_0$ | 接近 0 | 接近 0 | 左下角 |

> [!tip] 为什么横轴不是门限
> 门限的数值依赖统计量的尺度，换一个单调变换就变了；而 $P_{fa}$ 与 $P_d$ 都是概率，无量纲、可跨系统比较。ROC 用两个概率坐标，把“判决有多保守”标准化了。

## 二、ROC 的基本性质

对连续分布与似然比检验，ROC 有以下性质：

- 经过 $(0,0)$ 与 $(1,1)$：门限趋于无穷时全判 $H_0$，趋于零时全判 $H_1$。
- 单调不减：放宽门限会使 $P_{fa}$ 与 $P_d$ 同时不减。
- 曲线斜率等于门限处的似然比：$\mathrm{d}P_d/\mathrm{d}P_{fa}=\Lambda$。
- 对统计量的任何严格单调变换不变。
- 若似然比具有单调似然比性质，ROC 是凹的。

斜率性质很实用：在 ROC 上任一点，切线斜率就是该工作点对应的似然比门限。Bayes 准则要求斜率等于先验/代价比，因此 Bayes 工作点就是斜率为 $\eta$ 的切点。

> [!warning] ROC 不是检测器的“固有属性”
> 它依赖噪声分布、信号形式、样本数以及是否已知参数。换了 SNR 或信道模型，ROC 就变了。把某条 ROC 当成设备永远的性能曲线，是实验报告中常见的错误。

## 三、AUC：曲线下的面积

> [!info] 定义 AUC
> ROC 曲线下的面积 $\mathrm{AUC}=\int_0^1P_d\,dP_{fa}$ 称为**曲线下面积**（area under curve）。

AUC 有一个漂亮的概率解释：随机取一个 $H_1$ 下的观测和一个独立的 $H_0$ 下的观测，前者被判为“更像 $H_1$”的概率就是 AUC。AUC 越接近 1，两个分布越容易分开；AUC 等于 0.5 表示检测器与抛硬币无异；小于 0.5 说明判决方向反了。

AUC 把整条曲线压成一个数，便于比较不同检测器，但它忽略了工作点。两个检测器的 ROC 可能相交：一个在低虚警区更好，另一个在高虚警区更好，此时单看 AUC 会掩盖差异。工程选型应先确定工作区域，再比较该区域的曲线。

## 四、高斯偏移例子

设 $H_0:x\sim\mathcal{N}(0,\sigma^2)$，$H_1:x\sim\mathcal{N}(\mu,\sigma^2)$，判决门限为 $\gamma$。令 $d=\mu/\sigma$，则

$$P_{fa}=Q\left(\frac{\gamma}{\sigma}\right),\qquad P_d=Q\left(\frac{\gamma-\mu}{\sigma}\right)$$

消去 $\gamma$ 得 ROC 的解析式：

$$P_d=Q\left(Q^{-1}(P_{fa})-d\right)$$

$d$ 称为偏移信噪比或可分性指数，$d$ 越大曲线越靠左上。取 $d=2$：

| $P_{fa}$ | $Q^{-1}(P_{fa})$ | $P_d$ |
| --- | --- | --- |
| $10^{-4}$ | 3.719 | 0.043 |
| $10^{-3}$ | 3.090 | 0.138 |
| $10^{-2}$ | 2.326 | 0.372 |
| $0.1$ | 1.282 | 0.764 |
| $0.2$ | 0.842 | 0.877 |
| $0.5$ | 0 | 0.977 |

该例的 AUC 为 $\Phi(d/\sqrt{2})=\Phi(1.414)\approx0.921$。注意 AUC 很高不代表低虚警区好用：$P_{fa}=10^{-4}$ 时 $P_d$ 只有 0.043。

> [!example] 工作点怎么选
> 雷达要压低虚警，通常固定在 $P_{fa}=10^{-6}$ 附近，再看 $P_d$ 是否达标；通信接收机按目标误码率选点，等价于在对称的二元假设下固定 $P_d$ 或 $P_{fa}$；医疗筛查则相反，宁可虚警高一些也要保证高灵敏度。三种需求对应 ROC 上三个不同区域，没有“通用最优点”。

## 五、与 NP 准则的关系

Neyman-Pearson 准则在 ROC 上的操作是：画一条竖线 $P_{fa}=\alpha$，取它与 ROC 的交点，该点的 $P_d$ 就是约束下的最大值。因此 NP 工作点一定是 ROC 与给定虚警水平线的交点，且位于曲线的上支。

Bayes 准则则在 ROC 上找斜率为 $\eta=\pi_0(C_{10}-C_{00})/[\pi_1(C_{01}-C_{11})]$ 的切点。$\eta$ 越大，切点越靠左下（保守）；$\eta$ 越小，切点越靠右上（激进）。

> [!warning] 比较检测器的正确姿势
> 若一条 ROC 完全位于另一条上方，前者一致更优；若两条曲线相交，必须声明工作区域再比较。用单一 AUC 或单一工作点下结论，都可能选出不适合当前系统的检测器。

## 关联

- 上一节：[[vault-notes/random-signals/08-neyman-pearson]]
- 下一节：[[vault-notes/random-signals/08-matched-filter-detection]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/math/probability/09-hypothesis-testing]]、[[vault-notes/communication/07-digital-bandpass]]、[[vault-notes/5g/harq]]
