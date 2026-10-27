---
title: "自适应滤波LMS"
tags:
- 随机信号处理
- 09-进阶统计信号处理
- 自适应滤波
- LMS
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

# 自适应滤波：LMS

> [!abstract] 这一节在讲什么
> 维纳滤波器要求已知输入自相关矩阵 $\mathbf R$ 与互相关向量 $\mathbf p$，实际系统里这两样都不知道，而且还可能随时间变。
> LMS 用"一次样本的瞬时梯度"代替真实梯度，每来一个样本就把权向量修正一点，运算量只有 $O(N)$。
> 用途：系统辨识、回声消除、信道均衡、自适应干扰对消，也是理解 RLS 的参照物。

## 一、从维纳解到自适应

维纳解是

$$
\mathbf w_{\text{opt}}=\mathbf R^{-1}\mathbf p,\qquad
\mathbf R=E[\mathbf x\mathbf x^H],\quad \mathbf p=E[\mathbf x d^*]
$$

若 $\mathbf R,\mathbf p$ 已知，最速下降法沿代价函数负梯度走：

$$
\mathbf w[n+1]=\mathbf w[n]-\mu\nabla J(\mathbf w[n])
=\mathbf w[n]+2\mu\left(\mathbf p-\mathbf R\mathbf w[n]\right)
$$

问题是 $\mathbf R$ 与 $\mathbf p$ 必须用数据估计，且信道一变就要重估。自适应滤波的做法是：不显式估计它们，而是把当前样本的 $\mathbf x[n]\mathbf x^H[n]$ 和 $\mathbf x[n]d^*[n]$ 直接代入梯度。

> [!tip] 直觉
> 把误差曲面想成一个碗，最速下降是"每次朝碗底走一步"。维纳解要求你知道碗的准确形状；LMS 则是每走一步都用脚下这一点的坡度近似，所以路径是抖的，但长期仍往碗底走。

## 二、LMS 更新式

> [!info] 定义
> **LMS**（least mean squares）滤波器在每个样本上做三件事：算误差、沿"误差乘输入"的方向修正权向量、进入下一个样本。

$$
e[n]=d[n]-\mathbf w^T[n]\mathbf x[n]
$$

$$
\mathbf w[n+1]=\mathbf w[n]+\mu e[n]\mathbf x[n]
$$

| 符号 | 含义 | 维度 |
| --- | --- | --- |
| $\mathbf x[n]$ | 输入抽头向量 | $N\times1$ |
| $\mathbf w[n]$ | 当前权向量 | $N\times1$ |
| $d[n]$ | 期望响应（参考信号） | 标量 |
| $e[n]$ | 先验误差 | 标量 |
| $\mu$ | 步长 | 正实数 |

复信号情形把内积写成 $\mathbf w^H\mathbf x$，更新式改为 $\mathbf w[n+1]=\mathbf w[n]+\mu e[n]\mathbf x^*[n]$。上面的推导中梯度带因子 2，实际实现把它吸收进 $\mu$，所以更新式里没有 2。

> [!warning] 最容易写错的两处
> 一是误差的符号：$e=d-\mathbf w^T\mathbf x$，若写成 $\mathbf w^T\mathbf x-d$，更新方向就反了，系统会发散。二是复信号的共轭：漏掉 $\mathbf x^*$ 会让相位不收敛。

## 三、步长、收敛与失调

把误差写成权误差的形式，可以对 $\mathbf R$ 做特征分解，得到 $N$ 个解耦的一阶环路，第 $i$ 个模式的极点约是 $1-2\mu\lambda_i$。由此得到三条实用结论：

- **收敛条件**：$0<\mu<2/\lambda_{\max}$，$\lambda_{\max}$ 是 $\mathbf R$ 的最大特征值。
- **收敛速度**：第 $i$ 个模式的时间常数 $\tau_i\approx1/(2\mu\lambda_i)$，最慢的模式由 $\lambda_{\min}$ 决定。
- **稳态失调**：小步长下 $M\approx\dfrac{\mu\operatorname{tr}(\mathbf R)}{2}$，白输入时 $\operatorname{tr}(\mathbf R)=N\sigma_x^2$，即 $M\approx\mu N\sigma_x^2/2$。

特征值散布 $\chi=\lambda_{\max}/\lambda_{\min}$ 越大，各模式收敛速度差得越远，整体收敛越慢。这也是 LMS 在强相关输入（如语音、信道输出）上表现吃力的根本原因。

> [!warning] 步长不是"越大越快"
> $\mu$ 超过 $2/\lambda_{\max}$ 直接发散；接近上限时失调急剧变大。固定 $\mu$ 还意味着输入功率翻倍就等效于步长翻倍，所以工程上要么按输入功率归一化，要么改用 NLMS。

## 四、NLMS 与典型应用

NLMS 用当前输入能量归一化步长：

$$
\mathbf w[n+1]=\mathbf w[n]+\frac{\tilde\mu}{\lVert\mathbf x[n]\rVert^2+\delta}e[n]\mathbf x[n]
$$

其中 $0<\tilde\mu<2$，$\delta$ 是很小的正数，防止输入全零时除零。归一化后收敛速度对输入功率不敏感，是实际系统里更常用的形式。

| 应用 | 参考信号 $d[n]$ | 输入 $\mathbf x[n]$ | 自适应滤波器扮演 |
| --- | --- | --- | --- |
| 系统辨识 | 未知系统输出（含测量噪声） | 同一激励信号 | 未知系统的模型 |
| 回声消除 | 麦克风收到的近端加回声 | 远端参考信号 | 扬声器到麦克风的回声路径 |
| 信道均衡 | 训练序列或判决反馈 | 接收样点 | 信道逆滤波器 |
| 干扰对消 | 主天线（信号加干扰） | 辅助天线（主要是干扰） | 干扰从辅天线到主天线的路径 |

> [!warning] 工程易错
> 回声消除若不做双讲检测，近端说话时滤波器会把近端语音也当成回声消掉；系统辨识要求输入持续激励，否则只有被激励到的方向能收敛，其余参数停在初值。

> [!example] 回声消除的收敛量级
> 抽样率 16 kHz、回声路径 256 抽头时，LMS 每样本约 512 次乘法；步长取 $\mu=0.01$ 时收敛要数千个样本，对应数百毫秒。房间冲激响应一变就要重新收敛，所以实际系统常用 NLMS 加快初收敛，并把步长调到"能跟上房间变化"而不是"收敛最快"。

## 关联

- 上一节：[[vault-notes/random-signals/09-parametric-spectral-estimation]]
- 下一节：[[vault-notes/random-signals/09-adaptive-filter-rls]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/dsp/07-fir-filter-design]]、[[vault-notes/dsp/05-filter-structures]]、[[vault-notes/fpga/ad9361/iq-signals]]
