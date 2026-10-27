---
title: "功率谱密度PSD"
tags:
- 随机信号处理
- 05-随机信号的频域分析
- 功率谱
- 频域分析
type: concept
subjects:
- 随机信号处理
- 随机过程
domains:
- 随机信号
- 统计信号处理
status: learning
aliases: []
prerequisites: []
related: []
---

# 功率谱密度（PSD）

> [!abstract] 这一节在讲什么
> 随机信号的样本函数通常不衰减，能量无限，直接做傅里叶变换没有意义；工程上真正关心的是平均功率在频率上怎么分布。
> 功率谱密度 $S_X(\omega)$ 就是这个分布的密度，它与自相关函数 $R_X(\tau)$ 构成一对傅里叶变换。
> 本节给出 PSD 的两种等价定义、性质、单位与单双边约定，并用白噪声、正弦和 RC 低通三个例子完成从定义到计算的第一步。

## 一、从能量到功率

确定性信号 $x(t)$ 若能量有限，可以用傅里叶变换描述其频谱，能量由帕塞瓦尔定理给出。随机信号不行：每个样本函数一般不衰减，$\int\lvert x(t)\rvert^2\,\mathrm{d}t=\infty$；而且对随机信号做一次傅里叶变换，得到的仍是随机函数，没有统计意义。

可行的办法是"截断、归一化、取期望"：只保留 $\lvert t\rvert\le T$ 的部分，算它的能量，除以 $2T$，再令 $T\to\infty$。

> [!info] 定义 1 功率谱密度的截断定义
> 设 $X(t)$ 为宽平稳过程，$X_T(t)=X(t)$（$\lvert t\rvert\le T$），其余为零，则
> $$S_X(\omega)=\lim_{T\to\infty}\frac{1}{2T}E\left[\left\lvert X_T(\omega)\right\rvert^2\right],\qquad X_T(\omega)=\int_{-T}^{T}X(t)e^{-j\omega t}\,\mathrm{d}t$$
> $S_X(\omega)$ 称为 $X(t)$ 的**自功率谱密度**（auto power spectral density），简称**自谱**。

这个量是"单位频率上的平均功率"，不是幅度谱。它丢掉了全部相位信息，只保留二阶统计中的功率分布。

> [!tip] 直觉
> 把随机信号想成无数条样本函数，每条都做一次截断傅里叶变换，取模平方再平均。单次谱杂乱无章，平均之后留下的稳定形状就是 PSD。

## 二、维纳-辛钦关系

截断定义不便于计算。维纳-辛钦定理把 PSD 与自相关函数直接连起来。

> [!info] 定义 2 自相关函数的傅里叶变换
> 对宽平稳过程 $X(t)$，若 $R_X(\tau)$ 绝对可积或按广义函数理解，则
> $$S_X(\omega)=\int_{-\infty}^{\infty}R_X(\tau)e^{-j\omega\tau}\,\mathrm{d}\tau$$
> 反变换为
> $$R_X(\tau)=\frac{1}{2\pi}\int_{-\infty}^{\infty}S_X(\omega)e^{j\omega\tau}\,\mathrm{d}\omega$$

因此 $R_X(\tau)$ 与 $S_X(\omega)$ 是一对傅里叶变换。令 $\tau=0$ 得总功率：

$$P_X=R_X(0)=\frac{1}{2\pi}\int_{-\infty}^{\infty}S_X(\omega)\,\mathrm{d}\omega=\int_{-\infty}^{\infty}S_X(f)\,\mathrm{d}f$$

离散时间对应为

$$S_X(e^{j\omega})=\sum_{m=-\infty}^{\infty}R_X[m]e^{-j\omega m},\qquad R_X[m]=\frac{1}{2\pi}\int_{-\pi}^{\pi}S_X(e^{j\omega})e^{j\omega m}\,\mathrm{d}\omega$$

其中 $S_X(e^{j\omega})$ 以 $2\pi$ 为周期。定理的证明与适用条件见 [[vault-notes/random-signals/05-wiener-khinchin]]。

## 三、性质、单位与单双边

> [!info] 定义 3 PSD 的四条基本性质
> 对实宽平稳过程 $X(t)$，$S_X(\omega)$ 满足：
> 1. **非负**：$S_X(\omega)\ge 0$；
> 2. **实值**：$S_X(\omega)\in\mathbb{R}$；
> 3. **偶对称**：$S_X(-\omega)=S_X(\omega)$；
> 4. **积分给出总功率**：$R_X(0)=\frac{1}{2\pi}\int S_X(\omega)\,\mathrm{d}\omega$。

复宽平稳过程在 $R_X(\tau)=E[X(t+\tau)X^*(t)]$ 的约定下，$S_X(\omega)$ 仍是实、非负的，但一般不再偶对称；偶对称是实过程才有的性质。

| 性质 | 数学表达 | 工程含义 |
| --- | --- | --- |
| 非负 | $S_X(\omega)\ge 0$ | 不会出现"负功率密度" |
| 实值 | $S_X^*(\omega)=S_X(\omega)$ | 单张实谱即可画完 |
| 偶对称 | $S_X(-\omega)=S_X(\omega)$ | 负频率不是新信息 |
| 功率守恒 | $R_X(0)=\frac{1}{2\pi}\int S_X(\omega)\,\mathrm{d}\omega$ | 曲线下面积就是平均功率 |

单位随信号单位走。若 $X(t)$ 的单位是 V，则 $R_X(\tau)$ 是 V²，$S_X(\omega)$ 是 V²/(rad/s)，$S_X(f)$ 是 V²/Hz。

> [!warning] 单边谱必须声明
> 本库默认**双边谱** $S_X(\omega)$，负频率也画。实过程若只画 $f\ge 0$，要改用**单边谱**
> $$S_X^+(f)=2S_X(f),\qquad f\ge 0$$
> 此时总功率为 $\int_0^\infty S_X^+(f)\,\mathrm{d}f$。白噪声的双边密度是 $N_0/2$，单边密度才是 $N_0$；把两者混用是最常见的 3 dB 错误来源。

## 四、三个基本例子

> [!example] 例 1 白噪声
> 若 $R_N(\tau)=\frac{N_0}{2}\delta(\tau)$，则
> $$S_N(\omega)=\frac{N_0}{2}\quad(\text{双边}),\qquad S_N^+(f)=N_0\quad(\text{单边})$$
> 谱是平的，所以叫"白"。理想白噪声的总功率 $R_N(0)=\frac{N_0}{2}\delta(0)$ 发散；实际观测一定经过限带，带内功率为 $N_0B$。

> [!example] 例 2 随机相位正弦
> 设 $X(t)=A\cos(\omega_0 t+\Theta)$，$\Theta\sim U[0,2\pi)$，则
> $$R_X(\tau)=\frac{A^2}{2}\cos\omega_0\tau,\qquad S_X(\omega)=\frac{\pi A^2}{2}\big[\delta(\omega-\omega_0)+\delta(\omega+\omega_0)\big]$$
> 功率 $A^2/2$ 全部集中在两根谱线上。这里的 $\delta$ 是广义函数，冲激的"高度"不是密度，冲激的**权重**才是功率。

> [!example] 例 3 白噪声通过 RC 低通
> 设 $H(\omega)=\frac{1}{1+j\omega RC}$，输入双边谱 $N_0/2$，则
> $$S_Y(\omega)=\frac{N_0}{2}\cdot\frac{1}{1+(\omega RC)^2},\qquad R_Y(\tau)=\frac{N_0}{4RC}e^{-\lvert\tau\rvert/(RC)}$$
> 总功率 $P_Y=R_Y(0)=\frac{N_0}{4RC}$。低通把白谱"压"成了洛伦兹形，相关函数从 $\delta$ 变成了指数衰减。

| 过程 | $R_X(\tau)$ | $S_X(\omega)$（双边） | 平均功率 |
| --- | --- | --- | --- |
| 白噪声 | $\frac{N_0}{2}\delta(\tau)$ | $\frac{N_0}{2}$ | 发散 |
| 随机相位正弦 | $\frac{A^2}{2}\cos\omega_0\tau$ | $\frac{\pi A^2}{2}[\delta(\omega-\omega_0)+\delta(\omega+\omega_0)]$ | $\frac{A^2}{2}$ |
| RC 低通输出 | $\frac{N_0}{4RC}e^{-\lvert\tau\rvert/(RC)}$ | $\frac{N_0/2}{1+(\omega RC)^2}$ | $\frac{N_0}{4RC}$ |

> [!warning] 三个常见误解
> - 把 $S_X(\omega)$ 当成能直接反变换回某个样本函数的"频谱"：反变换得到的是 $R_X(\tau)$，不是 $x(t)$。
> - 看到白噪声谱是常数就以为功率有限：密度有限、带宽无限，功率仍然发散。
> - 在表格或程序中混用单边与双边：双边 $N_0/2$ 对应的单边是 $N_0$，所有"乘以 2"的步骤都要有出处。

## 关联

- 上一节：[[vault-notes/random-signals/04-sample-correlation-estimation]]
- 下一节：[[vault-notes/random-signals/05-wiener-khinchin]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/communication/03-random-processes]]、[[vault-notes/communication/02-deterministic-signals]]、[[vault-notes/math/complex-analysis/07-fourier-transform]]、[[vault-notes/communication/04-channel]]
