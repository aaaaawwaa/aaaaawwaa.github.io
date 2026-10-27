---
title: 傅里叶级数实验
description: 用 Python 拟合方波，观察部分和逼近、吉布斯现象与谐波数量对波形失真的影响。
tags:
  - interactive-labs
  - fourier-series
  - python
---

## 实验目标

周期信号可以分解为不同频率正弦波的叠加。本实验用有限项正弦和去逼近一个 50% 占空比的方波，观察三件事：项数增加时误差如何变化、跳变处的过冲是否消失、以及高次谐波带来的波形细节。

## 方波的傅里叶级数

幅度为 $A$、周期为 $T$ 的奇对称方波，其傅里叶级数为

$$
x(t)=\frac{4A}{\pi}\sum_{k=1,3,5,\dots}\frac{1}{k}\sin\left(\frac{2\pi k t}{T}\right)
$$

只有奇次谐波，且幅度按 $1/k$ 衰减。这也是方波听起来"刺耳"的原因：高频分量下降得慢。

## 实验代码

```python
import numpy as np
import matplotlib.pyplot as plt

A, T = 1.0, 1.0
t = np.linspace(0.0, 2 * T, 4000)
ideal = np.where((t % T) < T / 2, A, -A)      # 50% 占空比方波

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(t, ideal, "k--", linewidth=1.0, label="ideal")

for K in (1, 3, 9, 39):
    odd = np.arange(1, K + 1, 2)
    approx = np.zeros_like(t)
    for k in odd:
        approx += (4 * A / (np.pi * k)) * np.sin(2 * np.pi * k * t / T)
    ax.plot(t, approx, label=f"K = {K}")

ax.set_xlabel("t / T")
ax.set_ylabel("x(t)")
ax.set_title("Square wave partial sums")
ax.legend(loc="upper right")
ax.grid(True)
plt.show()
```

## 观察什么

| 项数 K | 现象 |
| --- | --- |
| 1 | 只有基波，波形是纯正弦 |
| 3 | 开始出现平顶与陡边 |
| 9 | 平顶已较平，跳变处出现过冲 |
| 39 | 波形细节改善，但过冲幅度基本不变 |

随着项数增加，均方误差持续下降（能量意义上收敛），但跳变附近的过冲**不会消失**，这就是吉布斯现象（Gibbs phenomenon）。理论上过冲约为跳变幅度的 8.95%，与项数无关，只是过冲区域随 $K$ 增大而变窄。

## 为什么过冲消不掉

傅里叶级数在均方（$L^2$）意义下收敛，这一意义下单个点或单个区间的取值不影响全局误差。方波的跳变是第一类间断点，级数在间断点处收敛到左右极限的平均值，但邻域内必然出现过冲。要彻底消除过冲，需要换用其他基或改用更平滑的过渡（如升余弦），代价是过渡带变宽。

> [!warning] 与频谱泄漏的关系
> 这里的"截断"是在谐波序号上加矩形窗。同一件事发生在频域上：时间上截断信号会引入频谱泄漏。想压低旁瓣就加窗（Hann、Blackman），但主瓣会变宽，分辨率下降。

## 思考题

1. 若把方波改为三角波，谐波幅度按 $1/k^2$ 衰减，逼近会快多少？过冲还会出现吗？
2. 把截断项数从 39 加到 399，峰值过冲变化了多少？过冲的宽度如何变化？
3. 用过零点检测的方式估计逼近波形的周期，项数少时误差从哪来？

## 相关阅读

- [[signal-processing/dft-and-fft|DFT 与 FFT]]
- [[signal-processing/signals-and-systems-intro|信号与系统导论]]
- [[mathematics/linear-algebra-basics|线性代数基础]]
