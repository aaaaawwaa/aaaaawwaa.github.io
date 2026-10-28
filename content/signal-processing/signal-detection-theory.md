---
title: 信号检测理论
description: 从二元假设检验、似然比与 Neyman–Pearson 准则出发，推导匹配滤波与 BPSK 检测，用 ROC 与 AUC 描述性能，并落到 M 元调制与接收机同步误差。
tags:
  - signal-processing
  - detection-theory
  - communication
---

估计回答“参数是多少”，检测回答“信号在不在、是哪一个”。雷达要判断回波是否存在，通信接收机要判断刚才发的是哪个符号，二者本质相同：观测服从两个（或多个）条件分布之一，判决规则把观测空间切成几块。本文从二元假设检验出发，推出似然比与 Neyman–Pearson 准则，再用匹配滤波把理论落到 BPSK 接收机，最后用 ROC 与 M 元检测收尾。前置是 [[signal-processing/statistical-estimation-filtering|统计估计与最优滤波]] 与 [[signal-processing/random-signals-through-systems|随机信号通过线性系统]]。

## 假设检验：从估计到判决

二元检测问题由三部分组成：假设、观测模型与判决规则。

$$
H_0:\ \mathbf{x}\sim f(\mathbf{x}\mid H_0),\qquad H_1:\ \mathbf{x}\sim f(\mathbf{x}\mid H_1)
$$

$H_0$ 通常表示“只有噪声”，$H_1$ 表示“信号加噪声”。判决规则 $\delta(\mathbf{x})\in\{H_0,H_1\}$ 等价于把观测空间分成判决区域 $\mathcal{R}_0$ 与 $\mathcal{R}_1$，设计检测器就是选择 $\mathcal{R}_1$。

两类错误的分布不能靠“小心”消除，只能权衡：

| 真实情况 \ 判决 | 判 $H_0$ | 判 $H_1$ |
| --- | --- | --- |
| $H_0$ 为真 | $1-P_{fa}$ | $P_{fa}$（虚警） |
| $H_1$ 为真 | $P_m$（漏检） | $P_d$（检测） |

$$
P_{fa}=\int_{\mathcal{R}_1}f(\mathbf{x}\mid H_0)\,\mathrm{d}\mathbf{x},\qquad
P_d=\int_{\mathcal{R}_1}f(\mathbf{x}\mid H_1)\,\mathrm{d}\mathbf{x},\qquad
P_m=1-P_d
$$

把 $\mathcal{R}_1$ 扩大，$P_d$ 与 $P_{fa}$ 同时上升；缩小则同时下降。样本量固定时二者此消彼长，这正是 ROC 曲线要描述的权衡。

**Bayes 判决。** 给两类错误分配代价 $C_{ij}$ 与先验 $\pi_j=P(H_j)$，平均风险最小等价于似然比门限比较：

$$
\Lambda(\mathbf{x})=\frac{f(\mathbf{x}\mid H_1)}{f(\mathbf{x}\mid H_0)}\underset{H_0}{\overset{H_1}{\gtrless}}\eta,\qquad
\eta=\frac{\pi_0(C_{10}-C_{00})}{\pi_1(C_{01}-C_{11})}
$$

等先验、均匀代价时 $\eta=1$，退化为最大似然判决（比较两个条件密度谁大）。门限 $\eta$ 大则判决保守（虚警少、漏检多），小则激进。

> [!example] 高斯均值检测
> $H_0:x\sim\mathcal{N}(0,\sigma^2)$，$H_1:x\sim\mathcal{N}(\mu,\sigma^2)$，$\mu>0$。似然比 $\Lambda(x)=\exp(\mu x/\sigma^2-\mu^2/2\sigma^2)$ 随 $x$ 单调递增，判决等价于
> $$
> x\underset{H_0}{\overset{H_1}{\gtrless}}\gamma,\qquad \gamma=\frac{\sigma^2}{\mu}\ln\eta+\frac{\mu}{2}
> $$
> 两类错误为 $P_{fa}=Q(\gamma/\sigma)$、$P_d=Q((\gamma-\mu)/\sigma)$。等先验、均匀代价时 $\gamma=\mu/2$，平均错误概率 $P_e=Q(\mu/2\sigma)$：$\mu/\sigma=4$ 时 $P_e=Q(2)\approx0.023$；要降到 $10^{-6}$ 量级需 $\mu/\sigma\approx9.5$。

> [!warning] “判 $H_1$”不是“证明 $H_1$”
> 判决只是基于有限观测的选择，总有犯错概率。报告结果必须同时给出 $P_{fa}$ 与 $P_d$（或等价的门限与样本量），只说“检测到了”没有意义。

## 似然比检验与 Neyman–Pearson 准则

对简单假设 $H_0:\mathbf{x}\sim f_0$、$H_1:\mathbf{x}\sim f_1$，似然比检验（LRT）统一写成

$$
\Lambda(\mathbf{x})=\frac{f_1(\mathbf{x})}{f_0(\mathbf{x})}\underset{H_0}{\overset{H_1}{\gtrless}}\eta
$$

$\Lambda$ 越大，观测在 $H_1$ 下出现的相对可能性越高。独立样本的联合密度是乘积，实际都用对数，把乘积变成可累加的分数：

$$
\ln\Lambda(\mathbf{x})=\sum_{n=1}^{N}\ln\frac{f_1(x_n)}{f_0(x_n)}
$$

每一新样本只贡献一项，天然适合序贯处理（SPRT 让累加量越过上下门限时提前停止）。

> [!warning] 门限不是恒等于 1
> 只有等先验、均匀代价的 Bayes 准则才有 $\eta=1$。雷达为压低虚警会把 $\eta$ 取大；通信中两符号等概且误码代价相同时，门限才落在似然比 1 附近。把“似然比大于 1 就判有信号”当成普适规则是常见错误。

**N 个样本的高斯偏移。** $H_0:x_n\sim\mathcal{N}(0,\sigma^2)$，$H_1:x_n\sim\mathcal{N}(\mu,\sigma^2)$，独立。对数似然比

$$
\ln\Lambda(\mathbf{x})=\frac{\mu}{\sigma^2}\sum_{n=1}^{N}x_n-\frac{N\mu^2}{2\sigma^2}
$$

只通过样本和 $T=\sum x_n$ 依赖数据，且是 $T$ 的单调增函数。因此 LRT 等价于对样本均值设门限：

$$
\bar{x}\underset{H_0}{\overset{H_1}{\gtrless}}\gamma,\qquad
\gamma=\frac{\sigma^2}{N\mu}\ln\eta+\frac{\mu}{2}
$$

$$
P_{fa}=Q\left(\frac{\gamma\sqrt{N}}{\sigma}\right),\qquad
P_d=Q\left(\frac{(\gamma-\mu)\sqrt{N}}{\sigma}\right)
$$

$N$ 只以 $\sqrt{N}$ 进入，说明检测性能随样本数按“功率”改善：$N$ 翻倍等效信噪比提高 $\sqrt2$ 倍。够用的统计量只有 $T$ 一个——这就是**充分统计量**：它丢掉了与判决无关的细节，却不损失任何关于假设的信息，接收机因此只需保存一个相关值或匹配滤波输出。

**NP 准则。** 很多工程系统给不出先验和代价，却必须把虚警压在上限 $\alpha$ 以内。Neyman–Pearson 准则在 $P_{fa}\le\alpha$ 的约束下最大化 $P_d$。用拉格朗日乘子：

$$
J=P_m+\lambda(P_{fa}-\alpha)
=\lambda(1-\alpha)+\int_{\mathcal{R}_0}\left(f_1-\lambda f_0\right)\mathrm{d}\mathbf{x}
$$

要让 $J$ 最小，应把所有 $f_1<\lambda f_0$ 的点放进 $\mathcal{R}_0$，即最优检验仍是似然比检验，门限 $\lambda$ 由约束取等号确定：$P_{fa}(\lambda)=\alpha$。于是

$$
\Lambda(\mathbf{x})\underset{H_0}{\overset{H_1}{\gtrless}}\lambda,\qquad P_{fa}(\lambda)=\alpha
$$

对高斯型统计量，门限写成 $Q$ 函数的反函数。设 $\mu/\sigma=d$、单样本情形：

$$
\gamma=\sigma Q^{-1}(\alpha),\qquad P_d=Q\left(Q^{-1}(\alpha)-d\right)
$$

| $\alpha$ | $Q^{-1}(\alpha)$ | $P_d$（$d=2$） | $P_d$（$d=3$） |
| --- | --- | --- | --- |
| $10^{-2}$ | 2.326 | 0.372 | 0.750 |
| $10^{-3}$ | 3.090 | 0.138 | 0.464 |
| $10^{-4}$ | 3.719 | 0.043 | 0.236 |

同样的 $\alpha$ 下偏移越大 $P_d$ 越高；同样的 $d$ 下 $\alpha$ 越小门限越高、$P_d$ 越低。二者是 ROC 上的同一条曲线。

| 准则 | 门限来源 | 最优性 | 典型场景 |
| --- | --- | --- | --- |
| Bayes | 先验与代价 | 平均风险最小 | 通信符号判决 |
| Neyman–Pearson | 解 $P_{fa}=\alpha$ | 固定虚警下 $P_d$ 最大 | 雷达、告警 |
| LRT | 任意 $\eta$ | 构成一类可取检验 | 理论分析 |
| GLRT | 用 MLE 替代未知参数 | 无全局最优，大样本近似 | 复合假设 |

> [!warning] NP 的适用边界
> NP 引理严格成立的前提是“简单对简单”。若 $H_1$ 含未知幅度、相位或到达时间，一般不存在对所有参数值都最优的一致最大功效检验（UMP）。工程上要么对每个参数值画 ROC，要么用广义似然比检验 $\Lambda_G=\max_{\theta_1}f(\mathbf{x};\theta_1,H_1)/\max_{\theta_0}f(\mathbf{x};\theta_0,H_0)$——实现简单、渐近有效，但小样本下不保证最优，门限常靠仿真确定。

## 匹配滤波与相关接收

在加性白高斯噪声中检测已知波形 $s(t)$（$0\le t\le T$），最优线性处理器是**匹配滤波器**：

$$
h(t)=s(T-t),\qquad H(\omega)=S^*(\omega)e^{-j\omega T}
$$

$h$ 是信号的时间反转并平移 $T$（$T$ 大于信号持续时间时才因果）；频域上相位与信号谱共轭抵消，使各频率分量在 $t=T$ 同相叠加。

**输出 SNR 推导。** 输入 $r(t)=s(t)+n(t)$，$n$ 双边谱 $N_0/2$。抽样时刻信号输出

$$
y_s(T)=\int s(t)h(T-t)\,\mathrm{d}t=\int_0^T s^2(t)\,\mathrm{d}t=E
$$

噪声输出功率（用 $S_Y=\lvert H\rvert^2S_N$ 积分，或直接在时域算）

$$
\sigma_n^2=\frac{N_0}{2}\int h^2(t)\,\mathrm{d}t=\frac{N_0}{2}E
$$

于是

$$
\mathrm{SNR}_{out}=\frac{y_s^2(T)}{\sigma_n^2}=\frac{E^2}{N_0E/2}=\frac{2E}{N_0}
$$

最优性来自柯西–施瓦茨：$y_s(T)\le\sqrt{E\int\lvert h\rvert^2\mathrm{d}t}$，等号在 $h\propto s(T-t)$ 时成立。**$2E/N_0$ 与波形形状无关**，只取决于信号能量与噪声谱密度；改变波形只能改善时延分辨、抗干扰等次要指标。

匹配滤波与**相关接收**在抽样时刻完全等价：

$$
y(T)=\int_0^T r(t)s(t)\,\mathrm{d}t
$$

前者是卷积实现，可流式连续输出；后者是内积实现，便于数字化，但要求本地模板严格同步。离散时间下相关接收为 $z=\sum_{n=0}^{N-1}r_ns_n$，匹配滤波系数为 $h_n=s_{N-1-n}$，只差一个索引反转。

**BPSK 检测。** 两个波形 $s_1=+s(t)$、$s_0=-s(t)$，每比特能量 $E_b=E$。相关器输出在 $H_1$ 下 $z\sim\mathcal{N}(E,N_0E/2)$，在 $H_0$ 下 $z\sim\mathcal{N}(-E,N_0E/2)$。这正是一维高斯均值检测，等概时门限取 0：

$$
P_e=Q\left(\frac{E}{\sqrt{N_0E/2}}\right)=Q\left(\sqrt{\frac{2E_b}{N_0}}\right)
$$

与通信原理的 $\frac12\mathrm{erfc}\sqrt{E_b/n_0}$ 一致（$Q(x)=\frac12\mathrm{erfc}(x/\sqrt2)$）。$E_b/N_0=9.6\ \mathrm{dB}$ 时 $\sqrt{2E_b/N_0}\approx4.27$，$P_e\approx10^{-5}$。

> [!warning] 三个常见误用
> 1. 把匹配滤波器直接用于**未知到达时刻**的信号：应使用滤波器组或滑动相关搜索。
> 2. 有色噪声下仍用 $h=s(T-t)$：正确做法是先白化再匹配。
> 3. 把匹配滤波输出当作波形估计：它只保证抽样时刻的 SNR 最大，波形恢复应用维纳滤波。

实际系统还要付出定时误差、载波频偏与多径造成的损失。

## ROC 曲线：把门限扫一遍

单看某一组 $(P_{fa},P_d)$ 无法评价检测器整体性能。把门限 $\gamma$ 从大到小扫一遍，得到参数曲线

$$
\left(P_{fa}(\gamma),\ P_d(\gamma)\right)
$$

称为**接收机工作特性**（ROC）。它经过 $(0,0)$ 与 $(1,1)$：门限无穷大时全判 $H_0$，门限为零时全判 $H_1$。曲线单调不减，越靠左上越好；对连续分布与似然比检验，曲线在任一点的斜率等于该工作点对应的似然比门限，

$$
\frac{\mathrm{d}P_d}{\mathrm{d}P_{fa}}=\Lambda
$$

因此 Bayes 工作点是斜率为 $\eta$ 的切点，NP 工作点是竖线 $P_{fa}=\alpha$ 与曲线的交点。ROC 对统计量的任何严格单调变换不变——这就是为什么横轴用概率而不是门限数值。

**高斯偏移的解析式。** 设 $H_0:x\sim\mathcal{N}(0,\sigma^2)$、$H_1:x\sim\mathcal{N}(\mu,\sigma^2)$，$d=\mu/\sigma$，消去门限得

$$
P_d=Q\left(Q^{-1}(P_{fa})-d\right)
$$

| $P_{fa}$ | $Q^{-1}(P_{fa})$ | $P_d$（$d=2$） |
| --- | --- | --- |
| $10^{-4}$ | 3.719 | 0.043 |
| $10^{-3}$ | 3.090 | 0.138 |
| $10^{-2}$ | 2.326 | 0.372 |
| $0.1$ | 1.282 | 0.764 |
| $0.5$ | 0 | 0.977 |

**AUC。** 曲线下面积 $\mathrm{AUC}=\int_0^1P_d\,\mathrm{d}P_{fa}$ 有一个概率解释：随机取一个 $H_1$ 下的观测与一个独立的 $H_0$ 下的观测，前者被判为更像 $H_1$ 的概率就是 AUC。$d=2$ 时 $\mathrm{AUC}=\Phi(d/\sqrt2)=\Phi(1.414)\approx0.921$。但 AUC 高不代表低虚警区好用：上表中 $P_{fa}=10^{-4}$ 时 $P_d$ 只有 0.043。两个检测器的 ROC 可能相交，单看 AUC 会掩盖差异，工程选型应先确定工作区域。

## M 元检测与误码率

把二元推广到 $M$ 个假设，最大似然判决选择使 $f(\mathbf{x}\mid H_m)$ 最大的 $m$；等能量、等先验时判决区域由最近邻划分决定。对线性调制，AWGN 下判决变量都是高斯，误码率统一写成 $Q(\cdot)$。

QPSK 可看成两路正交的 BPSK，每符号 2 bit、$E_s=2E_b$，符号错误率约 $P_s\approx2Q(\sqrt{E_s/N_0})$；格雷映射下一个符号错误主要对应一个比特错误，故 $P_b\approx P_s/2=Q(\sqrt{2E_b/N_0})$，与 BPSK 相同。方形 $M$-QAM 的最近邻近似为

$$
P_b\approx\frac{4}{\log_2M}\left(1-\frac{1}{\sqrt M}\right)
Q\left(\sqrt{\frac{3\log_2M}{M-1}\cdot\frac{E_b}{N_0}}\right)
$$

带入 $M=16$ 得 $P_b\approx\frac34Q(\sqrt{4E_b/(5N_0)})$，$M=64$ 得 $P_b\approx\frac{7}{12}Q(\sqrt{2E_b/(7N_0)})$。格雷映射让相邻星座点只差 1 bit，高 SNR 时错误几乎都发生在最近邻，才有 $P_b\approx P_s/\log_2M$；低 SNR 时错误跳到非相邻点，这个关系不再成立。

| 调制 | 频谱效率 | 相对 BPSK 的 $E_b/N_0$ 损失（高 SNR） |
| --- | --- | --- |
| BPSK | 1 bit/s/Hz | 0 dB |
| QPSK | 2 bit/s/Hz | 0 dB |
| 16-QAM | 4 bit/s/Hz | 约 4.0 dB |
| 64-QAM | 6 bit/s/Hz | 约 8.5 dB |

BPSK 达到 $10^{-5}$ 需 $E_b/N_0\approx9.6\ \mathrm{dB}$，16-QAM 反解约 $13.4\ \mathrm{dB}$，相差 $3.8\ \mathrm{dB}$，接近渐近的 $4\ \mathrm{dB}$。仿真曲线对不上公式时，先查横轴是 $E_b/N_0$ 还是 $E_s/N_0$（差 $10\log_{10}\log_2M$）、星座平均功率是否归一、噪声方差是否按 I/Q 两维分别设置、格雷表与比特顺序是否一致，再看错误比特数是否足够（少于 100 个错误时曲线会明显抖动）。

## 接收机链路与同步误差

接收机链路是“前端滤波与下变频 → 匹配滤波/相关 → 抽样判决 → 比特”。前端限制进入后级的噪声带宽，下变频把射频搬到基带，匹配滤波在符号末端给出信噪比最大的判决量，抽样后与门限比较。

**门限偏移。** 等概、等能量、载波相位正确时门限为 0；否则两侧错误不等：

$$
P_b=\frac12\left[Q\left(\frac{E_b-b}{\sigma_n}\right)+Q\left(\frac{E_b+b}{\sigma_n}\right)\right],\qquad
\sigma_n=\sqrt{\frac{N_0E_b}{2}}
$$

先验不等时门限向大概率的假设偏移；AGC 误差或直流偏置也会把门限推歪，误码率对偏置非常敏感。

**同步误差。** 相干检测要求本地载波同频同相。相位误差 $\varphi$ 使信号分量乘 $\cos\varphi$：

$$
P_b(\varphi)=Q\left(\sqrt{\frac{2E_b}{N_0}}\cos\varphi\right)
$$

定时误差让相关器只覆盖部分符号能量；矩形 NRZ 下若偏移 $\varepsilon T$，有效能量约乘 $(1-\varepsilon)^2$。载波频偏则在符号内造成相位旋转，相关输出随 $\mathrm{sinc}$ 型因子下降。

> [!example] 相位误差 20° 的代价
> $\cos20^\circ=0.940$，平方后 $0.883$，折合 $0.54\ \mathrm{dB}$ 损失；BPSK 在 $10^{-5}$ 处所需 $E_b/N_0$ 从约 $9.6\ \mathrm{dB}$ 推到 $10.1\ \mathrm{dB}$。相位误差到 $30^\circ$ 时损失约 $1.25\ \mathrm{dB}$，这就是载波恢复必须做好的原因。

| 误差来源 | 一阶影响 | 工程对策 |
| --- | --- | --- |
| 载波相位 $\varphi$ | 有效 $E_b/N_0$ 乘 $\cos^2\varphi$ | PLL、导频、判决反馈 |
| 定时误差 $\varepsilon$ | 有效能量乘 $(1-\varepsilon)^2$ | 早迟门、Gardner 算法 |
| 载波频偏 $\Delta f$ | 符号内相位旋转、相关输出下降 | AFC、频偏估计 |

## 常见错误清单

- 把“判 $H_1$”当成“证明 $H_1$”，不报告 $P_{fa}$ 与 $P_d$。
- 认为似然比门限恒为 1；忽略先验与代价对门限的偏移。
- 在复合假设下宣称 NP 检验“一致最优”，忽略 UMP 一般不存在的限制。
- 匹配滤波的 $2E/N_0$ 与 $E/N_0$ 混用（单边/双边定义不清），整体差 3 dB。

## 前置与下一步

- **前置**：[[signal-processing/random-signals-through-systems|随机信号通过线性系统]]、[[signal-processing/statistical-estimation-filtering|统计估计与最优滤波]]、[[mathematics/probability-overview|概率论概览]]。
- **下一步**：[[signal-processing/random-signal-experiments|MATLAB 实验]]（AWGN 误码率与蒙特卡洛）、[[signal-processing/random-signals-formula-sheet|公式速查]]。
- **跨学科**：[[communication/digital-modulation-qpsk|数字调制 QPSK]]、[[communication/index|通信原理]]。

## 来源与延伸阅读

- 检测基础：[[vault-notes/random-signals/08-hypothesis-testing|假设检验]]、[[vault-notes/random-signals/08-likelihood-ratio-test|似然比检验]]、[[vault-notes/random-signals/08-neyman-pearson|Neyman–Pearson 准则]]、[[vault-notes/random-signals/08-roc-curve|ROC 曲线]]。
- 匹配滤波与实现：[[vault-notes/random-signals/08-matched-filter-detection|匹配滤波检测]]、[[vault-notes/random-signals/10-receiver-detection|接收机检测]]、[[vault-notes/random-signals/10-bpsk-qam-ber|BPSK/QAM 误码率]]。