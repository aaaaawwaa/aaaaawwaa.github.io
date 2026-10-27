---
title: "错题与问题记录"
tags:
- 随机信号处理
- 99-附录
- 错题
aliases:
- 随机信号处理错题本
- 问题记录
type: resource
subjects:
- 随机信号处理
domains:
- 知识管理
status: learning
prerequisites: []
related: []
---

# 📝 错题与问题记录

> [!abstract] 这页怎么用
> 错题本的价值不在“抄题”，而在**定位错因**：是定义不清、条件漏看、公式记错，还是计算失误。
> 每条记录至少写清：模块、题目/场景、错因、正确思路、复习日期。每周回看一次，只重做错因相同的题。

## 一、记录模板

```text
日期：
模块：
题目/场景：
我的做法：
错因（定义/条件/公式/计算/单位）：
正确思路：
一句话提醒：
复习日期：
```

## 二、当前错题清单

| 日期 | 模块 | 题目/场景 | 错因 | 正确思路 | 复习 |
| --- | --- | --- | --- | --- | --- |
| 2026-10-20 | 02 随机变量 | 由 $\mathrm{Cov}(X,Y)=0$ 直接判断 $X,Y$ 独立 | 把“不相关”当成“独立” | 只有联合高斯时才等价；一般情况举反例 $Y=X^2$ | 待复习 |
| 2026-10-20 | 03 随机过程 | 把 WSS 当成严平稳 | 混淆“二阶统计平稳”和“所有分布平移不变” | 严平稳 ⇒ WSS（二阶矩存在时）；WSS ⇏ 严平稳 | 待复习 |
| 2026-10-20 | 05 频域 | 单边谱与双边谱混用，总功率差 2 倍 | 没声明谱的归一化 | 先写清单边/双边，再用 $R_X(0)$ 校验总功率 | 待复习 |
| 2026-10-20 | 07 估计 | 非高斯场景直接用 LMMSE 公式当 MMSE | 把“线性最优”当成“全局最优” | MMSE=条件均值；LMMSE 只在仿射类里最优 | 待复习 |
| 2026-10-20 | 08 检测 | NP 准则中先定阈值再算 $P_{fa}$ | 阈值应由 $P_{fa}=\alpha$ 反解 | 先定 $\alpha$，再由 $P_{fa}(\eta)=\alpha$ 求 $\eta$ | 待复习 |
| 2026-10-20 | 10 通信 | 匹配滤波输出 SNR 写成 $E/N_0$ | 漏掉因子 2 | 白噪声下匹配滤波峰值 SNR $=2E/N_0$ | 待复习 |

## 三、按错因归类

| 错因 | 典型表现 | 对策 |
| --- | --- | --- |
| 定义不清 | 独立/不相关、平稳/各态历经混用 | 回到 [[vault-notes/random-signals/99-easily-confused-concepts]]，每对概念写一个反例 |
| 条件漏看 | 忘了零均值、实/复、单边/双边、白噪声假设 | 做题前先列出 3 个前提 |
| 公式记错 | MSE 写成方差、匹配滤波漏 2、Q 函数系数错 | 用 [[vault-notes/random-signals/99-formula-cheatsheet]] 做“公式默写” |
| 单位/归一化 | PSD 差 $2\pi$、DFT 差 $N$、dB 与线性混用 | 每次用总功率或 Parseval 校验 |
| 计算失误 | 积分限、共轭、矩阵转置 | 写清中间步骤，最后量纲检查 |

## 四、每周复盘清单

- [ ] 本周新增错题是否都写了“错因”？
- [ ] 同一错因是否出现 2 次以上？若是，回到对应笔记重读定义。
- [ ] 是否能用一句话说出正确思路？
- [ ] 是否做了一道同类型的变式题？
- [ ] 是否更新了 [[vault-notes/random-signals/99-easily-confused-concepts]] 或 [[vault-notes/random-signals/99-formula-cheatsheet]]？

## 关联

- 导航：[[vault-notes/random-signals/00-knowledge-map]]｜[[vault-notes/random-signals/00-math-symbols]]
- 速查：[[vault-notes/random-signals/99-formula-cheatsheet]]｜[[vault-notes/random-signals/99-easily-confused-concepts]]
- 重点模块：[[vault-notes/random-signals/07-estimator-bias-variance]]｜[[vault-notes/random-signals/08-hypothesis-testing]]｜[[vault-notes/random-signals/05-power-spectral-density]]｜[[vault-notes/random-signals/10-awgn-channel]]
- 全库总纲：00_全库理论知识点综合与联系
