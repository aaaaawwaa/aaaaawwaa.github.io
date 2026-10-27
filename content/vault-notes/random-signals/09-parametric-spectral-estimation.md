---
title: "参数化谱估计"
tags:
- 随机信号处理
- 09-进阶统计信号处理
- 谱估计
- 子空间方法
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

# 参数化谱估计

> [!abstract] 这一节在讲什么
> 周期图的频率分辨率被记录长度卡在约 $2\pi/N$，而且方差不随 $N$ 变小，这两点是"非参数"方法的硬限制。
> 参数化方法先用 AR 或正弦加噪声模型约束谱形，再用少量参数换平滑的谱和更高的分辨率；MUSIC/ESPRIT 则把分辨率推到超分辨。
> 用途：短数据、窄带信号、阵列测向，以及判断"谱峰到底是一个还是两个"。

## 一、周期图的天花板

$$
\hat S_{\text{per}}(\omega)=\frac{1}{N}\left\lvert\sum_{n=0}^{N-1}x[n]e^{-j\omega n}\right\rvert^2
$$

周期图有两个绕不过去的问题。其一是**分辨率**：主瓣宽度约为 $2\pi/N$，两个间隔小于它的正弦会被糊成一个峰。其二是**方差**：估计的方差与真谱同量级，增加 $N$ 只会让峰变窄，不会让曲线变平滑。

Welch 法把数据分段、加窗、平均，方差确实降了，但每段变短，分辨率又退回去。这就是非参数方法的偏差-方差两难，也是参数化方法的出发点。

> [!tip] 直觉
> 周期图相当于用一组宽度固定的 sinc 去扫真实谱，数据越短，sinc 主瓣越宽。参数化方法则先假定谱由少数极点生成，相当于给谱加了很强的结构先验，因此短数据也能看出尖峰。

## 二、AR 谱估计

> [!info] 定义
> **AR 谱估计**先用 AR($p$) 拟合数据，得到 $\hat a_k$ 与 $\hat\sigma^2$，再代回模型谱。

$$
\hat S_{\text{AR}}(\omega)=\frac{\hat\sigma^2}{\left\lvert 1+\sum_{k=1}^{p}\hat a_ke^{-j\omega k}\right\rvert^2}
$$

参数估计有两条常用路线。**Yule-Walker** 用样本自相关解 Toeplitz 方程，计算量 $O(p^2)$，短数据有偏，纯正弦时可能出现谱分裂。**Burg** 递推地最小化前向与后向预测误差之和，保证模型稳定，短数据下分辨率通常更好。

阶数选择是 AR 谱的核心：阶数太低，两个峰被强行合成一个；阶数太高，会冒出伪峰、方差变大。窄带信号的经验值是 $p\approx N/3\sim N/2$，更稳妥的做法是用 AIC/BIC 或 MDL 在候选阶数里选。

> [!warning] AR 谱不是"真谱"
> 模型失配时，AR 谱只对齐了前 $p+1$ 个自相关滞后，更远的部分完全由模型外推。谱峰的高度对阶数和噪声很敏感，不能把 AR 谱峰直接读成信号功率。

## 三、MUSIC 与 ESPRIT

子空间方法面对的是"$K$ 个复正弦（或 $K$ 个来波）加白噪声"的数据模型：

$$
\mathbf x[n]=\mathbf A\mathbf s[n]+\mathbf w[n],\qquad
\mathbf R_x=\mathbf A\mathbf R_s\mathbf A^H+\sigma^2\mathbf I
$$

对 $\mathbf R_x$ 做特征分解，$K$ 个大特征值张成信号子空间，其余 $M-K$ 个对应噪声子空间 $\mathbf E_n$。信号导向矢量与噪声子空间正交，于是 MUSIC 用倒数构造伪谱：

$$
P_{\text{MUSIC}}(\omega)=\frac{1}{\mathbf a^H(\omega)\mathbf E_n\mathbf E_n^H\mathbf a(\omega)}
$$

分母趋零处就是频率估计。ESPRIT 走另一条路：均匀线阵的两个子阵满足 $\mathbf A_2=\mathbf A_1\mathbf\Phi$，其中 $\mathbf\Phi=\operatorname{diag}(e^{j\omega_k})$；从信号子空间解出旋转矩阵，特征值直接给出频率，不需要谱搜索。

单通道序列也能用这套思想：把 $x[n]$ 排成 Hankel 数据矩阵，做 SVD 得到信号/噪声子空间，再做伪谱。代价是需要选择嵌入维数，且要求 $K$ 已知或可估。

> [!tip] 为什么叫"超分辨"
> MUSIC 的峰宽由正交性决定，在高 SNR、足够快拍数下可以远窄于 $2\pi/N$。但这份分辨率是用"模型正确 + 高 SNR + 已知阶数"换来的，SNR 低于门限时会突然失效，并不是无条件的分辨率提升。

## 四、分辨率、阶数与方法对比

> [!example] 两个靠得很近的正弦
> 取 $N=32$，两个复正弦位于 $\omega_1=0.20\pi$、$\omega_2=0.24\pi$，间隔 $0.04\pi$ 小于 $2\pi/N\approx0.196$。周期图只给出一个宽包；AR(12) 在 SNR 较高时能分出双峰；MUSIC 取 $K=2$、$\mathrm{SNR}=20$ dB 时可以清晰分辨。可见"分辨率"不是单一数字，而是 SNR、数据长度与模型阶数共同决定的。

| 方法 | 分辨率 | 方差/一致性 | 需要的先验 | 计算量 | 适用场景 |
| --- | --- | --- | --- | --- | --- |
| 周期图 | 约 $2\pi/N$ | 方差不随 $N$ 下降，非一致 | 无 | $O(N\log N)$ | 快速概览、长数据 |
| Welch | 低于周期图 | 方差明显减小 | 段长、重叠、窗 | $O(N\log N)$ | 平稳长数据 |
| AR（YW/Burg） | 高于周期图，短数据尤明显 | 模型正确时方差小，失配则有偏 | 阶数 $p$ | $O(p^2)$ 加谱计算 | 窄带谱、谱峰定位 |
| MUSIC | 超分辨 | 依赖快拍数与 SNR | 阶数 $K$、阵型 | 特征分解 $O(M^3)$ | 多正弦、DOA |
| ESPRIT | 超分辨 | 同上，且对阵列误差敏感 | 平移不变结构 | 特征分解加广义特征值 | 均匀线阵、实时测向 |

> [!warning] 比较方法的纪律
> 同一段数据、同一 SNR、同一有效带宽下比较；参数化方法输出的是模型谱，纵轴不再等于周期图意义上的功率密度，不能把两种曲线的峰值直接相减。

## 关联

- 上一节：[[vault-notes/random-signals/09-ar-ma-arma-modeling]]
- 下一节：[[vault-notes/random-signals/09-adaptive-filter-lms]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 跨库：[[vault-notes/dsp/04-fast-fourier-transform]]、[[vault-notes/dsp/05-filter-structures]]、[[vault-notes/communication/03-random-processes]]、[[vault-notes/5g/phy/04-physical-channels-signals]]
