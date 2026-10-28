---
title: 自适应滤波与参数化谱估计
description: 从维纳解出发理解 LMS 与 RLS 的在线递推，再用 AR/MA/ARMA 模型与 MUSIC 把谱估计从"非参数"推进到模型驱动。
tags:
  - signal-processing
  - adaptive-filter
  - spectral-estimation
---

[[signal-processing/statistical-estimation-filtering|上一篇]]的最优滤波器都要求统计量已知：维纳解要 $\mathbf{R}^{-1}\mathbf{p}$，卡尔曼要 $\mathbf{Q}$、$\mathbf{R}$。实际系统里信道在变、噪声在变、统计量根本不知道。**自适应滤波**把“求最优解”改成“沿误差下降方向一步步走”，每来一个样本就修正一次；**参数化谱估计**则反过来，用少量模型参数解释谱的形状，用结构先验换分辨率。

## 从维纳解到自适应：LMS

维纳最优解是

$$
\mathbf{w}_{\text{opt}}=\mathbf{R}^{-1}\mathbf{p},\qquad
\mathbf{R}=E[\mathbf{x}\mathbf{x}^H],\quad \mathbf{p}=E[\mathbf{x}d^*]
$$

若 $\mathbf{R}$、$\mathbf{p}$ 已知，最速下降法沿代价函数的负梯度走：

$$
\mathbf{w}[n+1]=\mathbf{w}[n]+2\mu\big(\mathbf{p}-\mathbf{R}\mathbf{w}[n]\big)
$$

问题在于统计量要用数据估计、信道一变又要重估。**LMS**（least mean squares）干脆不显式估计它们，而是把当前样本的 $\mathbf{x}[n]\mathbf{x}^H[n]$ 与 $\mathbf{x}[n]d^*[n]$ 直接代入梯度：

$$
e[n]=d[n]-\mathbf{w}^T[n]\mathbf{x}[n]
$$

$$
\mathbf{w}[n+1]=\mathbf{w}[n]+\mu e[n]\mathbf{x}[n]
$$

复信号把内积写成 $\mathbf{w}^H\mathbf{x}$，更新式改为 $\mathbf{w}[n+1]=\mathbf{w}[n]+\mu e[n]\mathbf{x}^*[n]$；梯度里的因子 2 被吸收进步长 $\mu$。两个最容易写错的地方：误差必须是 $d-\mathbf{w}^T\mathbf{x}$（写反会发散），复信号不能漏掉共轭。

> [!tip] 直觉
> 把代价函数想成一个碗：最速下降是“每次朝碗底走一步”，但要求你知道碗的准确形状；LMS 每步只用脚下这一点的坡度近似，路径是抖的，长期仍朝碗底走。

对 $\mathbf{R}$ 做特征分解后可得到 $N$ 个解耦的一阶模式，第 $i$ 个极点约 $1-2\mu\lambda_i$，由此得到三条工程结论：

- **收敛条件**：$0<\mu<2/\lambda_{\max}$。
- **收敛速度**：第 $i$ 个模式时间常数 $\tau_i\approx1/(2\mu\lambda_i)$，最慢的由 $\lambda_{\min}$ 决定。
- **稳态失调**：小步长下 $M\approx\mu\operatorname{tr}(\mathbf{R})/2$；白输入时 $\operatorname{tr}(\mathbf{R})=N\sigma_x^2$，即 $M\approx\mu N\sigma_x^2/2$。

特征值散布 $\chi=\lambda_{\max}/\lambda_{\min}$ 越大，各模式收敛速度差得越远；这是 LMS 在强相关输入（语音、信道输出）上表现吃力的根本原因。步长也不是越大越快：超过 $2/\lambda_{\max}$ 直接发散，接近上限时失调急剧变大。

**NLMS** 用当前输入能量归一化步长：

$$
\mathbf{w}[n+1]=\mathbf{w}[n]+\frac{\tilde\mu}{\lVert\mathbf{x}[n]\rVert^2+\delta}e[n]\mathbf{x}[n]
$$

其中 $0<\tilde\mu<2$，$\delta$ 是防止除零的小正数。归一化后收敛速度对输入功率不敏感，是实际系统更常用的形式。

| 应用 | 参考信号 $d[n]$ | 输入 $\mathbf{x}[n]$ | 自适应滤波器扮演 |
| --- | --- | --- | --- |
| 系统辨识 | 未知系统输出 | 同一激励信号 | 未知系统的模型 |
| 回声消除 | 麦克风信号（近端加回声） | 远端参考信号 | 扬声器到麦克风的路径 |
| 信道均衡 | 训练序列或判决反馈 | 接收样点 | 信道逆滤波器 |
| 干扰对消 | 主天线（信号加干扰） | 辅助天线（主要是干扰） | 干扰耦合路径 |

> [!warning] 工程易错
> 回声消除若不做双讲检测，近端说话时滤波器会把近端语音也当回声消掉；系统辨识要求输入**持续激励**，否则只有被激励到的方向能收敛，其余参数停在初值。

> [!example] 回声消除的收敛量级
> 16 kHz 采样、256 抽头回声路径时，LMS 每样本约 512 次乘法；$\mu=0.01$ 时收敛要数千个样本，对应数百毫秒。房间冲激响应一变就要重新收敛，所以实际系统常用 NLMS 加快初收敛，并把步长调到“能跟上房间变化”而不是“收敛最快”。

## RLS：每来一个样本就精确重解

LMS 用瞬时梯度近似，收敛速度被特征值散布拖慢；**RLS**（recursive least squares）换一条路，直接最小化指数加权的平方误差：

$$
J[n]=\sum_{k=0}^{n}\lambda^{n-k}\lvert e[k]\rvert^2,\qquad e[k]=d[k]-\mathbf{w}^T[n]\mathbf{x}[k]
$$

其中 $0<\lambda\le1$ 是遗忘因子，等效窗长约 $1/(1-\lambda)$；$\lambda=1$ 是无限记忆的普通最小二乘，适合平稳环境。令 $\mathbf{\Phi}[n]=\sum\lambda^{n-k}\mathbf{x}[k]\mathbf{x}^T[k]$、$\mathbf{z}[n]=\sum\lambda^{n-k}d[k]\mathbf{x}[k]$，对 $\mathbf{w}$ 求导置零得正规方程 $\mathbf{\Phi}[n]\mathbf{w}[n]=\mathbf{z}[n]$。

$\mathbf{\Phi}$ 与 $\mathbf{z}$ 每个样本只做秩一更新，若每步重新求逆是 $O(N^3)$；矩阵求逆引理给出秩一修正的逆：

$$
(\mathbf{A}+\mathbf{u}\mathbf{v}^T)^{-1}
=\mathbf{A}^{-1}-\frac{\mathbf{A}^{-1}\mathbf{u}\mathbf{v}^T\mathbf{A}^{-1}}{1+\mathbf{v}^T\mathbf{A}^{-1}\mathbf{u}}
$$

取 $\mathbf{A}=\lambda\mathbf{\Phi}[n-1]$、$\mathbf{u}=\mathbf{v}=\mathbf{x}[n]$，得到增益向量与权向量的递推：

$$
\mathbf{k}[n]=\frac{\mathbf{P}[n-1]\mathbf{x}[n]}{\lambda+\mathbf{x}^T[n]\mathbf{P}[n-1]\mathbf{x}[n]}
$$

$$
e[n]=d[n]-\mathbf{w}^T[n-1]\mathbf{x}[n],\qquad
\mathbf{w}[n]=\mathbf{w}[n-1]+\mathbf{k}[n]e[n]
$$

$$
\mathbf{P}[n]=\frac{1}{\lambda}\big(\mathbf{P}[n-1]-\mathbf{k}[n]\mathbf{x}^T[n]\mathbf{P}[n-1]\big)
$$

初始化通常取 $\mathbf{w}[0]=\mathbf{0}$、$\mathbf{P}[0]=\delta^{-1}\mathbf{I}$（$\delta$ 如 $0.01$），表示对初值几乎没有先验约束。RLS 约需 $2N$ 个样本就能接近最优，且速度基本不受特征值散布影响；代价是每样本 $O(N^2)$ 运算与 $O(N^2)$ 存储。

> [!warning] 遗忘因子的两个陷阱
> 一是 $\lambda<1$ 且输入长期无激励时，$\mathbf{P}$ 会指数增长，一旦有激励就出现增益尖峰（wind-up）。二是有限精度下 $\mathbf{P}$ 可能失去对称正定性导致发散，长时运行应做 $\mathbf{P}\leftarrow(\mathbf{P}+\mathbf{P}^T)/2$，或直接采用平方根 RLS/QR 分解。

| 项目 | LMS | RLS |
| --- | --- | --- |
| 每样本复杂度 | $O(N)$ | $O(N^2)$ |
| 收敛速度 | 受特征值散布拖慢 | 约 $2N$ 样本，基本无关 |
| 稳态失调 | 与 $\mu\operatorname{tr}(\mathbf{R})$ 成正比 | $\lambda=1$ 趋零，$\lambda<1$ 由 $1-\lambda$ 决定 |
| 主要参数 | 步长 $\mu$ | 遗忘因子 $\lambda$、$\mathbf{P}[0]$ |
| 数值稳健性 | 好、实现简单 | 较差，需平方根/QR 形式 |
| 适用场景 | 大规模、低功耗、缓变环境 | 快速跟踪、短数据、强相关输入 |

一句话选择：**算力紧、通道慢变选 LMS；跟踪快、数据短、输入相关强选 RLS**；介于两者之间可考虑仿射投影（APA）。

## 自适应滤波：LMS 与 RLS

维纳解 $\mathbf{w}_{\text{opt}}=\mathbf{R}^{-1}\mathbf{p}$ 需要已知 $\mathbf{R}=E[\mathbf{x}\mathbf{x}^H]$、$\mathbf{p}=E[\mathbf{x}d^*]$，实际系统既不知道也可能在变。最速下降法沿负梯度走：

$$
\mathbf{w}[n+1]=\mathbf{w}[n]+2\mu\big(\mathbf{p}-\mathbf{R}\mathbf{w}[n]\big)
$$

**LMS** 用当前样本的瞬时值代替统计量：

$$
e[n]=d[n]-\mathbf{w}^T[n]\mathbf{x}[n],\qquad
\mathbf{w}[n+1]=\mathbf{w}[n]+\mu e[n]\mathbf{x}[n]
$$

复信号改为 $\mathbf{w}^H\mathbf{x}$ 与 $\mathbf{x}^*$。对 $\mathbf{R}$ 做特征分解可得 $N$ 个解耦模式，由此有三条结论：收敛条件 $0<\mu<2/\lambda_{\max}$；第 $i$ 个模式时间常数 $\tau_i\approx1/(2\mu\lambda_i)$，最慢模式由 $\lambda_{\min}$ 决定；稳态失调 $M\approx\mu\operatorname{tr}(\mathbf{R})/2$（白输入时 $\mu N\sigma_x^2/2$）。特征值散布越大收敛越慢，这是 LMS 在强相关输入上吃力的根源。**NLMS** 用输入能量归一化步长：

$$
\mathbf{w}[n+1]=\mathbf{w}[n]+\frac{\tilde\mu}{\lVert\mathbf{x}[n]\rVert^2+\delta}e[n]\mathbf{x}[n]
$$

**RLS** 换一条路：直接最小化指数加权平方误差 $J[n]=\sum_{k=0}^n\lambda^{n-k}\lvert e[k]\rvert^2$，其中遗忘因子 $0<\lambda\le1$，等效窗长约 $1/(1-\lambda)$。正规方程为 $\mathbf{\Phi}[n]\mathbf{w}[n]=\mathbf{z}[n]$，而 $\mathbf{\Phi},\mathbf{z}$ 都是秩一更新，用矩阵求逆引理递推：

$$
\mathbf{k}[n]=\frac{\mathbf{P}[n-1]\mathbf{x}[n]}{\lambda+\mathbf{x}^T[n]\mathbf{P}[n-1]\mathbf{x}[n]}
$$

$$
\mathbf{w}[n]=\mathbf{w}[n-1]+\mathbf{k}[n]e[n],\qquad
\mathbf{P}[n]=\frac{1}{\lambda}\big(\mathbf{P}[n-1]-\mathbf{k}[n]\mathbf{x}^T[n]\mathbf{P}[n-1]\big)
$$

$\mathbf{P}[0]=\delta^{-1}\mathbf{I}$（$\delta$ 取小正数）。RLS 约 $2N$ 个样本就能接近最优，且速度基本不受特征值散布影响；代价是每样本 $O(N^2)$ 运算与较差的数值稳定性（需平方根或 QR 形式）。$\lambda<1$ 且输入长期无激励时 $\mathbf{P}$ 会指数增长，一旦有激励出现增益尖峰（wind-up）。

| 项目 | LMS | RLS |
| --- | --- | --- |
| 每样本复杂度 | $O(N)$ | $O(N^2)$ |
| 收敛速度 | 受特征值散布拖慢 | 约 $2N$ 样本，基本无关 |
| 稳态失调 | $\propto\mu\operatorname{tr}(\mathbf{R})$ | $\lambda=1$ 趋零，$\lambda<1$ 由 $1-\lambda$ 决定 |
| 主要参数 | 步长 $\mu$ | 遗忘因子 $\lambda$、$\mathbf{P}[0]$ |
| 适用 | 大规模、低功耗、缓变 | 快速跟踪、短数据、强相关输入 |

> [!example] 回声消除的量级
> 16 kHz 采样、256 抽头回声路径：LMS 每样本约 512 次乘法，$\mu=0.01$ 时收敛需数千样本（数百毫秒）；房间冲激响应一变就要重新收敛，所以实际常用 NLMS 加快初收敛，并把步长调到“跟得上房间变化”。系统辨识与干扰对消的参考信号选择见 [[vault-notes/random-signals/09-adaptive-filter-lms|LMS 笔记]]。

## AR/MA/ARMA 建模与参数化谱估计

前几节把谱当作“已知的曲线”，这一节用少量参数解释谱的形状。设 $W[n]$ 为零均值、方差 $\sigma^2$ 的白噪声，三类模型为

$$
\text{AR}(p):\ X[n]=-\sum_{k=1}^{p}a_kX[n-k]+W[n]
$$

$$
\text{MA}(q):\ X[n]=W[n]+\sum_{k=1}^{q}b_kW[n-k]
$$

$$
\text{ARMA}(p,q):\ X[n]=-\sum_{k=1}^{p}a_kX[n-k]+W[n]+\sum_{k=1}^{q}b_kW[n-k]
$$

令 $A(z)=1+\sum a_kz^{-k}$、$B(z)=1+\sum b_kz^{-k}$，则 $H(z)=B(z)/A(z)$，

$$
S_X(\omega)=\sigma^2\frac{\lvert B(e^{j\omega})\rvert^2}{\lvert A(e^{j\omega})\rvert^2}
$$

AR 是全极点模型，适合窄带尖峰；MA 是全零点模型，永远稳定，适合谱谷；ARMA 峰谷兼有、参数最省。**稳定性只看极点**：$A(z)$ 的根全部在单位圆内；极点越靠近单位圆，谱峰越窄（品质因数约 $1/(1-r)$），角度决定峰的中心频率。

**Yule–Walker。** AR 差分方程两边乘 $X[n-m]$ 取期望，$m\ge1$ 时激励与过去输出不相关：

$$
R_X[m]+\sum_{k=1}^{p}a_kR_X[m-k]=0,\qquad m\ge1
$$

配上前 $p+1$ 个滞后写成 Toeplitz 方程组，用 Levinson–Durbin 递推 $O(p^2)$ 解出 $a_k$ 与 $\sigma^2$。MA/ARMA 的 Yule–Walker 多出滑动平均项，通常先用高阶 AR 逼近。

> [!example] AR(1)
> $X[n]=aX[n-1]+W[n]$，$\lvert a\rvert<1$：$R_X[m]=\frac{\sigma^2}{1-a^2}a^{\lvert m\rvert}$，$S_X(\omega)=\frac{\sigma^2}{1-2a\cos\omega+a^2}$。$a=0.9$、$\sigma^2=1$ 时 $R_X[0]=5.26$、$S_X(0)=100$、$S_X(\pi)=0.28$，峰谷比约 $25.6$ dB；$a=-0.9$ 时峰搬到 $\omega=\pi$。

**阶数选择。** ACF 拖尾、PACF 在 $p$ 阶截尾是 AR 的典型特征；MA 相反；ARMA 两者都拖尾。先由 ACF/PACF 定候选阶数，再用 $\mathrm{AIC}=N\ln\hat\sigma^2+2k$ 与 $\mathrm{BIC}=N\ln\hat\sigma^2+k\ln N$ 比较；阶数过高会引入伪峰、增大方差。

**参数化谱估计。** 周期图的分辨率被记录长度卡在约 $2\pi/N$，方差又不随 $N$ 下降；Welch 用方差换平滑，但分段变短又丢分辨率。参数化方法先用模型约束谱形：

$$
\hat S_{\text{AR}}(\omega)=\frac{\hat\sigma^2}{\left\lvert 1+\sum_{k=1}^{p}\hat a_ke^{-j\omega k}\right\rvert^2}
$$

Yule–Walker 计算量 $O(p^2)$，短数据有偏、纯正弦可能谱分裂；Burg 同时最小化前向与后向预测误差，保证稳定、短数据分辨率更好。阶数经验值约 $N/3\sim N/2$，但更可靠的是用 AIC/BIC 选择。模型失配时 AR 谱只对齐前 $p+1$ 个自相关滞后，谱峰高度对阶数与噪声敏感，不能直接读成信号功率。

子空间方法面对“$K$ 个复正弦加白噪声”：$\mathbf{R}_x=\mathbf{A}\mathbf{R}_s\mathbf{A}^H+\sigma^2\mathbf{I}$，特征分解后大特征值张成信号子空间，其余为噪声子空间 $\mathbf{E}_n$。MUSIC 用伪谱

$$
P_{\text{MUSIC}}(\omega)=\frac{1}{\mathbf{a}^H(\omega)\mathbf{E}_n\mathbf{E}_n^H\mathbf{a}(\omega)}
$$

分母趋零处即频率估计；ESPRIT 用平移不变结构解旋转矩阵，特征值直接给出频率，无需谱搜索。两者的“超分辨”是靠“模型正确 + 高 SNR + 已知阶数”换来的，低于门限会突然失效。

| 方法 | 分辨率 | 一致性 | 先验 | 计算量 | 场景 |
| --- | --- | --- | --- | --- | --- |
| 周期图 | 约 $2\pi/N$ | 方差不随 $N$ 降，非一致 | 无 | $O(N\log N)$ | 快速概览 |
| Welch | 低于周期图 | 方差明显减小 | 段长、窗 | $O(N\log N)$ | 平稳长数据 |
| AR（YW/Burg） | 高于周期图 | 模型正确时方差小 | 阶数 $p$ | $O(p^2)$ | 窄带谱、谱峰定位 |
| MUSIC/ESPRIT | 超分辨 | 依赖快拍数与 SNR | 阶数 $K$、阵型 | 特征分解 | 多正弦、DOA |

## 常见错误清单

- LMS 误差符号写反（应为 $d-\mathbf{w}^T\mathbf{x}$），或复信号漏共轭。
- 步长超过 $2/\lambda_{\max}$ 仍以为只是“更快”；忘记输入功率变化等效于步长变化，不归一化。
- 认为 LMS 收敛速度与输入相关性无关；在强相关输入上仍用固定小步长。
- RLS 遗忘因子 $\lambda<1$ 长期无激励导致 $\mathbf{P}$ 膨胀；不做对称化/平方根形式导致发散。
- 用样本自相关直接解 ARMA 的 Yule–Walker，或对短数据拟合高阶 AR，导致极点在圆外、出现虚假谱峰。
- 把 AR 谱峰高度直接读成信号功率；把 MUSIC 的“超分辨”当成无条件分辨率提升。
- 比较不同谱估计方法时，不看 SNR、数据长度与有效带宽，直接把纵轴峰值相减。

## 前置与下一步

- **前置**：[[signal-processing/statistical-estimation-filtering|统计估计与最优滤波]]（维纳解、正交性原理、卡尔曼）、[[signal-processing/correlation-and-power-spectrum|相关函数与功率谱]]（周期图、Welch）、[[mathematics/linear-algebra-basics|线性代数基础]]（矩阵求逆引理、特征分解）。
- **下一步**：[[signal-processing/signal-detection-theory|信号检测理论]]、[[signal-processing/random-signal-experiments|MATLAB 实验]]（维纳滤波与谱估计）、[[signal-processing/random-signals-formula-sheet|公式速查]]。
- **跨学科**：[[communication/index|通信原理]]（自适应均衡）、[[signal-processing/dft-and-fft|DFT 与 FFT]]（谱估计的离散频率实现）。

## 来源与延伸阅读

- 自适应滤波：[[vault-notes/random-signals/09-adaptive-filter-lms|自适应滤波 LMS]]、[[vault-notes/random-signals/09-adaptive-filter-rls|自适应滤波 RLS]]。
- 谱模型与估计：[[vault-notes/random-signals/09-ar-ma-arma-modeling|AR、MA 与 ARMA 建模]]、[[vault-notes/random-signals/09-parametric-spectral-estimation|参数化谱估计]]。
