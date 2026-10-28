# 随机信号处理融合台账

源笔记位于 `content/vault-notes/random-signals/`（61 篇公开副本）。本批把 01–11 与 99 各模块的解释、推导、例题、代码融合进 `content/signal-processing/` 下的主题文章。

状态口径按 `notes/fusion/SPEC.md`：**正文完成**指决定结论的解释、适用条件、推导或例题/代码已进入目标文章对应章节，重复定义已合并；**部分融合**指只把该笔记作为反例、导航或前提引用，未单列展开；**待处理**指尚未开始。

## 明细

| 源笔记 | 核心概念 | 目标文章 | 目标章节 | 动作 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 00-course-index | 课程与教材索引、三种读法 | （导航） | random-processes 前置与下一步 | 参考：只用其阅读顺序组织学习路径，未作为正文改写 | 部分融合 |
| 00-knowledge-map | 模块地图、四条学习路线、跨库接口 | （导航） | 各篇前置与下一步 | 提炼：路线图与接口转为文章间的前置/下一步链接 | 部分融合 |
| 00-math-symbols | 符号约定、单双边谱、$\omega/f$ 换算、估计与检测记号 | `content/signal-processing/random-signals-formula-sheet.md`<br>`content/signal-processing/random-processes.md` | 公式速查·符号与单双边约定；random-processes 导语 | 合并：符号表与 $N_0$、$\omega=2\pi f$ 约定并入公式速查，其余文章统一引用 | 正文完成 |
| 01-probability-basics | 样本空间、概率公理、独立性、全概率/贝叶斯、指示变量 | `content/signal-processing/random-processes.md` | 最小必要的概率与随机变量回顾 | 提炼：公理与运算规则压缩为回顾；BSC 例子只保留结论 | 正文完成 |
| 01-conditional-probability-bayes | 条件概率、乘法公式、贝叶斯、MAP/ML 门限 | `content/signal-processing/random-processes.md` | 最小必要的概率与随机变量回顾 | 合并：贝叶斯与 MAP 门限（含 0.424 数值例）并入条件化段落 | 正文完成 |
| 01-random-variables-distributions | CDF/PDF/PMF、七种常见分布、随机变量函数、瑞利/莱斯 | `content/signal-processing/random-processes.md` | 最小必要的概率与随机变量回顾 | 合并：三种描述、分布表与瑞利功率关系；雅可比推导留在源笔记 | 正文完成 |
| 01-fourier-and-lti | 三种傅里叶变换、卷积定理、Parseval、LTI 稳定、随机信号与 LTI | `content/signal-processing/correlation-and-power-spectrum.md`<br>`content/signal-processing/random-signals-through-systems.md` | 功率谱密度与维纳–辛钦定理；频域：$S_Y=|H|^2S_X$ 与互谱 | 提取：卷积定理与 Parseval 结论被两篇引用，未单列推导 | 部分融合 |
| 01-linear-algebra-matrices | Hermitian/谱分解、正定、投影与最小二乘、矩阵求逆引理、Toeplitz | `content/signal-processing/random-processes.md`<br>`content/signal-processing/statistical-estimation-filtering.md` | 条件高斯段；最大似然与最小二乘；MMSE 与 LMMSE | 分散融合：协方差矩阵/条件高斯进 RP，投影、正规方程、矩阵求逆引理进 SE | 正文完成 |
| 02-joint-conditional-distributions | 联合/边缘/条件分布、独立判据、独立和的卷积、二维雅可比、条件期望 | `content/signal-processing/random-processes.md` | 最小必要的概率与随机变量回顾 | 合并：条件期望与全期望/全方差；卷积与雅可比推导保留在源笔记 | 正文完成 |
| 02-expectation-variance | 期望性质、条件期望、全方差、切比雪夫/Jensen、量化误差算例 | `content/signal-processing/random-processes.md` | 最小必要的概率与随机变量回顾 | 合并：期望线性、方差相加、全期望/全方差、$\Delta^2/12$；作业题解析未搬入 | 正文完成 |
| 02-covariance-correlation | 协方差、相关系数、不相关≠独立、协方差矩阵传播、白化 | `content/signal-processing/random-processes.md` | 最小必要的概率与随机变量回顾 | 合并：双线性、$\rho$ 只测线性、$A\Sigma A^H$ 传播；白化留给 SE | 正文完成 |
| 02-gaussian-random-vectors | 一维/多维高斯、线性变换、条件高斯（Schur 补）、复高斯 | `content/signal-processing/random-processes.md` | 最小必要的概率与随机变量回顾 | 提炼：线性变换、条件均值/协方差、边缘高斯≠联合高斯；密度公式未抄录 | 正文完成 |
| 02-complex-random-variables | 复矩、伪方差、圆对称/proper、复高斯、Hermitian 协方差、IQ 不平衡 | `content/signal-processing/random-processes.md` | 最小必要的概率与随机变量回顾 | 合并：复方差口径、proper、$E|Z|^2=2\sigma^2$ 与 3 dB 陷阱 | 正文完成 |
| 03-definition-and-sample-functions | 随机过程定义、两副面孔、有限维分布、三个典型例子 | `content/signal-processing/random-processes.md` | 随机过程的定义：两副面孔 | 重写：两副面孔表、有限维分布与相容性、随机相位正弦/随机游走/白噪声 | 正文完成 |
| 03-mean-and-correlation-functions | 均值/方差/自相关/自协方差、四条性质、平均功率、信号加噪声例 | `content/signal-processing/random-processes.md` | 均值函数、自相关与平均功率 | 合并：定义、共轭对称、非负定、功率分解；信号加噪声例 | 正文完成 |
| 03-strict-vs-wide-sense-stationary | 严平稳、宽平稳、性质、关系、反例、循环平稳过渡 | `content/signal-processing/random-processes.md` | 平稳性：严平稳、宽平稳与循环平稳 | 重写：两定义、六性质、三步检验、宽平稳非严平稳反例 | 正文完成 |
| 03-ergodicity | 集合/时间平均、均值遍历条件、相关遍历、反例、工程判据 | `content/signal-processing/correlation-and-power-spectrum.md` | 各态历经：一条记录能否代表全体 | 新建：$\mathrm{Var}(\bar X_T)$ 公式、充分条件、两个反例、$N_{eff}$ | 正文完成 |
| 03-gaussian-process-white-noise | 高斯过程封闭性、连续/离散白噪声、带限白噪声、噪声功率与 SNR | `content/signal-processing/random-processes.md`<br>`content/signal-processing/correlation-and-power-spectrum.md`<br>`content/signal-processing/random-signals-through-systems.md` | 随机过程的定义；白噪声、带限白噪声与有色噪声；噪声功率与噪声等效带宽 | 合并：高斯过程封闭性进 RP，白噪声谱与带限功率进 CP/TS | 正文完成 |
| 03-cyclostationary-processes | 循环平稳定义、循环频率/循环谱、AM/BPSK 例、与 WSS 区别 | `content/signal-processing/random-processes.md` | 平稳性：严平稳、宽平稳与循环平稳 | 提炼：定义、循环频率来源、随机相位平均掉循环性 | 正文完成 |
| 03-poisson-markov-processes | 泊松计数、指数间隔、马尔可夫链与 C-K、生灭/排队、过滤泊松 | `content/signal-processing/random-processes.md` | 平稳性：严平稳、宽平稳与循环平稳（反例） | 仅引用：作为“增量平稳≠过程平稳”反例；与测量类随机信号主线较远，未单列 | 部分融合 |
| 04-autocorrelation-autocovariance | WSS 自相关/自协方差、性质清单、相关时间、三典型例、去均值 | `content/signal-processing/correlation-and-power-spectrum.md` | 相关函数：相似性、时延与系统辨识 | 重写：性质、相关时间三定义、白噪声/正弦/AR(1) 表与 AR(1) 推导、去均值 | 正文完成 |
| 04-correlation-properties | 共轭对称、非负定与 Bochner、均方连续、周期项谱线、Paley-Wiener | `content/signal-processing/correlation-and-power-spectrum.md` | 相关函数：相似性、时延与系统辨识 | 合并：非负定⇒谱非负、合法自相关反例；Paley-Wiener 只保留一句 | 正文完成 |
| 04-cross-correlation-covariance | 互相关定义/性质、时延估计、系统辨识、相干函数、工程注意 | `content/signal-processing/correlation-and-power-spectrum.md` | 相关函数：相似性、时延与系统辨识；互谱、相干函数与时延估计 | 合并：非偶对称、峰值=时延、$S_{YX}/S_X$、相干函数 | 正文完成 |
| 04-sample-correlation-estimation | 三种归一化、三角窗偏差、方差量级、置信区间、去均值、xcorr | `content/signal-processing/correlation-and-power-spectrum.md` | 相关函数：相似性、时延与系统辨识 | 合并：biased/unbiased/coeff 表、$1/N$ 三角窗、$\pm1.96/\sqrt N$、xcorr 代码 | 正文完成 |
| 05-power-spectral-density | 截断定义、维纳–辛钦、性质/单位/单双边、三个例子 | `content/signal-processing/correlation-and-power-spectrum.md` | 功率谱密度与维纳–辛钦定理 | 重写：截断定义、四条性质、单双边、白噪声/正弦/RC 三例表 | 正文完成 |
| 05-wiener-khinchin | 定理陈述、四步证明、绝对可积/广义函数、离散形式、AR(1) 例 | `content/signal-processing/correlation-and-power-spectrum.md` | 功率谱密度与维纳–辛钦定理 | 重写：四步证明思路、$\delta$ 谱情形、离散形式；完整证明见源笔记 | 正文完成 |
| 05-white-colored-noise-spectra | 连续/离散/带限白噪声、AR(1) 有色噪声、噪声等效带宽 | `content/signal-processing/correlation-and-power-spectrum.md`<br>`content/signal-processing/random-signals-through-systems.md` | 白噪声、带限白噪声与有色噪声；噪声功率与噪声等效带宽 | 合并：四类噪声表、AR(1) 谱、$B_n$ 定义与 RC 比值 | 正文完成 |
| 05-cross-power-spectral-density | 互谱定义/性质、互谱不等式、相干函数、时延、LTI 互谱 | `content/signal-processing/correlation-and-power-spectrum.md` | 互谱、相干函数与时延估计 | 合并：共轭关系、$|S_{XY}|^2\le S_XS_Y$、$\gamma^2$ 公式、GCC-PHAT | 正文完成 |
| 05-psd-numerical-estimation | 周期图、偏差/方差、窗与 Welch、分辨率-方差折中、MATLAB | `content/signal-processing/correlation-and-power-spectrum.md` | 谱估计：周期图与 Welch | 合并：周期图方差、窗表、Welch、补零、MATLAB 代码 | 正文完成 |
| 06-random-process-lti-systems | 输入输出卷积、输出 WSS 四条件、频响、积分器反例、滑动平均 | `content/signal-processing/random-signals-through-systems.md` | 输入输出模型与输出平稳的条件 | 新建：四条件表、稳定 vs 因果、积分器变随机游走、滑动平均 | 正文完成 |
| 06-output-mean-autocorrelation | $\mu_Y=\mu_XH(0)$、$R_Y=R_X*h*h(-\cdot)$、$C_Y$、互相关、RC 例 | `content/signal-processing/random-signals-through-systems.md` | 输出均值、自相关与互相关 | 新建：均值/自相关/互相关公式与推导要点、滑动平均、RC 完整例 | 正文完成 |
| 06-input-output-psd-relation | $S_Y=|H|^2S_X$、$S_{XY}=HS_X$、白噪声输出功率、典型系统表 | `content/signal-processing/random-signals-through-systems.md` | 频域：$S_Y=|H|^2S_X$ 与互谱 | 新建：推导、模平方含义、互谱方向、白噪声表、使用边界 | 正文完成 |
| 06-filtering-noise-power | 输出噪声功率、噪声带宽、SNR 改善、理想低通、匹配滤波峰值 SNR | `content/signal-processing/random-signals-through-systems.md` | 噪声功率与噪声等效带宽；信噪比与“滤波能改善多少” | 新建：$P_n$ 积分、$B_n$、噪声带宽 vs 3dB、SNR 与增益抵消、匹配滤波 $2E/N_0$ | 正文完成 |
| 07-estimator-bias-variance | 偏差/方差/MSE、无偏/有效/一致、Fisher 信息与 CRLB、高斯均值例 | `content/signal-processing/statistical-estimation-filtering.md` | 估计量的三把标尺：偏差、方差与 MSE | 新建：MSE 分解、三性质表、CRLB、高斯均值有效估计、收缩估计反例 | 正文完成 |
| 07-maximum-likelihood-least-squares | MLE/得分方程、最小二乘正规方程、WLS、高斯下等价、直线拟合/时延 | `content/signal-processing/statistical-estimation-filtering.md` | 最大似然与最小二乘 | 新建：MLE 性质、正规方程与投影、WLS、高斯等价、两例、MLE-LS 边界 | 正文完成 |
| 07-mmse-lmmse | 后验均值 MMSE、正交性原理、LMMSE 公式、与 MVUE/BLUE 区别、高斯等价 | `content/signal-processing/statistical-estimation-filtering.md` | MMSE 与 LMMSE：正交性原理 | 新建：后验均值、正交性、LMMSE/MMSE 公式、标量例、四类估计器对比、高斯等价 | 正文完成 |
| 07-wiener-filter | 模型、Wiener–Hopf、因果/非因果、谱分解、FIR 正规方程、RC 例 | `content/signal-processing/statistical-estimation-filtering.md` | 维纳滤波：把 LMMSE 推广到整段波形 | 新建：正交性推导、频域解、因果谱分解、Toeplitz、RC 数值例、与匹配滤波分工 | 正文完成 |
| 07-kalman-filter | 状态空间、预测/更新、增益、Riccati、随机游走例、与维纳关系 | `content/signal-processing/statistical-estimation-filtering.md` | 卡尔曼滤波：非平稳、多变量、在线递推 | 新建：完整递推公式、增益加权解释、Riccati、$P_\infty=0.618$ 例、Joseph 形式与模型失配 | 正文完成 |
| 08-hypothesis-testing | 二元假设、两类错误、Bayes 风险、似然比、判决区域、高斯均值例 | `content/signal-processing/signal-detection-theory.md` | 假设检验：从估计到判决 | 新建：判决区域、错误表、Bayes 门限、似然比、$P_e=Q(d/2)$ | 正文完成 |
| 08-likelihood-ratio-test | LRT 形式、对数似然比、门限含义、N 样本高斯、充分统计量、GLRT | `content/signal-processing/signal-detection-theory.md` | 似然比检验与 Neyman–Pearson 准则 | 新建：LRT/log-LRT、门限不是恒 1、N 样本偏移、充分统计量、GLRT | 正文完成 |
| 08-neyman-pearson | NP 准则、拉格朗日乘子推导、门限反解、与 Bayes 区别、工作点 | `content/signal-processing/signal-detection-theory.md` | 似然比检验与 Neyman–Pearson 准则 | 新建：约束优化推导、$P_{fa}(\lambda)=\alpha$、高斯门限与 $P_d$ 表、UMP 边界 | 正文完成 |
| 08-roc-curve | ROC 定义/构造、性质与斜率、AUC、高斯偏移解析式、工作点 | `content/signal-processing/signal-detection-theory.md` | ROC 曲线：把门限扫一遍 | 新建：ROC 性质、斜率=似然比、AUC 概率解释、$P_d=Q(Q^{-1}-d)$ 表、工作点 | 正文完成 |
| 08-matched-filter-detection | 匹配滤波器定义、$2E/N_0$ 推导、相关接收等价、BPSK 误码、失配损失 | `content/signal-processing/signal-detection-theory.md` | 匹配滤波与相关接收 | 新建：$h=s(T-t)$、信号/噪声输出推导、柯西–施瓦茨最优性、相关接收、BPSK 误码、三条误用 | 正文完成 |
| 09-adaptive-filter-lms | 维纳解、最速下降、LMS、步长/收敛/失调、NLMS、应用 | `content/signal-processing/adaptive-filtering-and-spectral-estimation.md` | 从维纳解到自适应：LMS | 新建：瞬时梯度、更新式、三条收敛结论、NLMS、四类应用表、回声消除量级例 | 正文完成 |
| 09-adaptive-filter-rls | 指数加权代价、正规方程、矩阵求逆引理、增益递推、遗忘因子、对比 | `content/signal-processing/adaptive-filtering-and-spectral-estimation.md` | RLS：每来一个样本就精确重解 | 新建：代价函数、秩一更新、Woodbury、$\mathbf{k}/\mathbf{P}$ 递推、wind-up、对比表 | 正文完成 |
| 09-ar-ma-arma-modeling | AR/MA/ARMA 差分方程与谱、Yule–Walker、稳定性、AR(1) 例、ACF/PACF | `content/signal-processing/adaptive-filtering-and-spectral-estimation.md` | AR/MA/ARMA 建模与参数化谱估计 | 新建：三类模型、$S_X=\sigma^2|B|^2/|A|^2$、Yule–Walker、极点在单位圆、AR(1) 数值 | 正文完成 |
| 09-parametric-spectral-estimation | 周期图天花板、AR 谱（YW/Burg）、MUSIC/ESPRIT、方法对比 | `content/signal-processing/adaptive-filtering-and-spectral-estimation.md` | AR/MA/ARMA 建模与参数化谱估计 | 新建：AR 谱公式、阶数选择、MUSIC 伪谱、超分辨条件、方法对比表 | 正文完成 |
| 10-adc-sampling-quantization-noise | 采样/混叠、量化误差模型、SQNR、过采样、ENOB/dither | `content/signal-processing/random-signals-through-systems.md` | ADC 采样与量化噪声 | 新建：$\Delta^2/12$、$6.02n+1.76$、OSR +3dB、ENOB、12 位动态范围例 | 正文完成 |
| 10-awgn-channel | AWGN 模型、$N_0/2$ 与功率、SNR 与 $E_b/N_0$、与信道笔记对照 | `content/signal-processing/random-signals-through-systems.md` | AWGN 信道、SNR 与 $E_b/N_0$ | 新建：模型、$P_N=N_0B$、采样方差 $N_0f_s/2$、$E_b/N_0$ 换算表、3 dB 陷阱 | 正文完成 |
| 10-snr-noise-bandwidth | SNR/dB、噪声带宽、噪声系数与 Friis、链路预算 | `content/signal-processing/random-signals-through-systems.md` | 信噪比与“滤波能改善多少”；AWGN 信道、SNR 与 $E_b/N_0$ | 合并：dB 换算、$B_n$、NF/Friis、链路预算表与算例 | 正文完成 |
| 10-receiver-detection | 接收机链路、相关接收、BPSK 门限、同步误差、与最佳接收对照 | `content/signal-processing/signal-detection-theory.md` | 接收机链路与同步误差 | 新建：链路图、门限偏移公式、相位/定时/频偏损失、20° 例、对照表 | 正文完成 |
| 10-bpsk-qam-ber | Q 函数、BPSK/QPSK、M-QAM 格雷近似、理论/仿真对照 | `content/signal-processing/signal-detection-theory.md` | M 元检测与误码率 | 合并：Q 函数表、BPSK/QPSK 同 BER、M-QAM 近似、格雷映射、9.6/13.4 dB 对照 | 正文完成 |
| 11-gaussian-noise-distribution | randn 生成、分布验证、Q-Q、标准误、可复现性 | `content/signal-processing/random-signal-experiments.md` | 实验一：高斯噪声生成与分布验证 | 新建：标准误公式、代码、$N$ 对误差表、易错点 | 正文完成 |
| 11-autocorrelation-estimation-experiment | AR(1) 相关估计、biased/unbiased、xcorr、去均值 | `content/signal-processing/random-signal-experiments.md` | 实验二：自相关估计 | 新建：两估计量公式、三角窗偏差、代码、期望对照表 | 正文完成 |
| 11-psd-estimation-experiment | periodogram/pwelch、窗、分辨率-方差、单双边 | `content/signal-processing/random-signal-experiments.md` | 实验三：功率谱估计 | 新建：周期图/Welch 公式、代码、分辨率与方差对照 | 正文完成 |
| 11-white-noise-through-filter | 白噪声通过 FIR、$S_Y=|H|^2S_X$、Parseval、噪声带宽 | `content/signal-processing/random-signal-experiments.md` | 实验四：白噪声通过滤波器 | 新建：离散 PSD 换算、$P_Y=\sigma^2\sum h^2$、$B_n$、代码与对照表 | 正文完成 |
| 11-wiener-filtering-experiment | 因果 FIR Wiener、非因果频域 Wiener、MMSE/SNR 对比 | `content/signal-processing/random-signal-experiments.md` | 实验五：维纳滤波 | 新建：正规方程、MMSE、代码、$M$ 与 SNR 对照表 | 正文完成 |
| 11-awgn-ber-experiment | BPSK 蒙特卡洛、噪声方差、误码数精度、erfc | `content/signal-processing/random-signal-experiments.md` | 实验六：AWGN 信道误码率 | 新建：BER 公式、$\sigma$ 设定、代码、错误数与置信表、易错点 | 正文完成 |
| 99-formula-cheatsheet | 概率/分布/高斯向量/相关/PSD/估计/检测公式表 | `content/signal-processing/random-signals-formula-sheet.md` | 全篇（符号、概率、分布、过程、谱、估计、检测） | 新建：按成立条件重排的一页式公式表，补充符号与单双边约定 | 正文完成 |
| 99-easily-confused-concepts | 16 对易混概念（独立/不相关、平稳/遍历、单双边、MMSE/LMMSE、LMS/RLS 等） | `content/signal-processing/random-signals-formula-sheet.md` | 易混淆概念对照 | 合并：压缩为 16 行对照表，加入“一句话提醒” | 正文完成 |
| 99-mistakes-and-questions | 错题记录模板、当前错题清单、按错因归类、周复盘 | `content/signal-processing/random-signals-formula-sheet.md` | 高频错因清单 | 提炼：错因-表现-对策表；具体错题清单属个人学习记录，未搬入站点 | 部分融合 |

## 统计

- 源笔记共 **61** 篇：正文完成 **56** 篇，部分融合 **5** 篇，待处理 **0** 篇。
- 目标文章共 **8** 篇（随机过程、相关函数与功率谱、通过系统、估计与滤波、自适应与参数谱、检测、实验、公式速查），正文合计约 **12.5 万字节**（不含 `index.md`；`random-processes.md` 另有脚本生成的 61 条索引区块）。
- 00 模块 3 篇为导航/符号页，仅作为学习路径与符号约定来源；其内容已分别体现在各篇“前置与下一步”和公式速查的符号表中。

## 部分融合与未单列说明

| 源笔记 | 现状 | 原因与去向 |
| --- | --- | --- |
| 00-course-index | 参考 | 课程与教材索引属导航信息，不构成可融合的知识结论；其阅读顺序已转成两篇文章的学习路径与前置链接。 |
| 00-knowledge-map | 参考 | 模块地图与四条路线用于组织文章顺序；跨库接口已转成“前置与下一步”中的实际链接。 |
| 01-fourier-and-lti | 部分融合 | 卷积定理、Parseval、LTI 稳定性作为功率谱与通过系统的前提被引用；三种傅里叶变换与稳定性判据的完整表格式推导留在源笔记与 [[signal-processing/dft-and-fft|DFT 与 FFT]]。 |
| 03-poisson-markov-processes | 部分融合 | 泊松计数/马尔可夫链与本文主线（连续测量信号的二阶统计）关联较弱，只在“增量平稳≠过程平稳”反例中出现；排队与生灭过程的公式未搬入。若后续需要“随机过程的其他类型”，可单开一篇。 |
| 99-mistakes-and-questions | 部分融合 | 错因归类与复习方法已提炼为公式速查的“高频错因清单”；具体错题条目属于个人学习记录，按“不写私有信息”原则未逐条搬入站点。 |

## 去重与合并记录

- **期望/方差**在 01 与 02 两处重复：合并到 `random-processes` 的“最小必要的概率与随机变量回顾”，全期望/全方差只保留一处推导结论。
- **白噪声**在 03、05、06、10 多处出现：定义与谱统一在 `correlation-and-power-spectrum` 的“白噪声、带限白噪声与有色噪声”，功率与带宽口径进 `random-signals-through-systems`，避免三处各写一套。
- **噪声带宽**在 05、06、10 三处重复：合并到 `random-signals-through-systems` 的“噪声功率与噪声等效带宽”，公式速查只保留一条。
- **$2E/N_0$** 在 06、08、10 三处出现：推导放在 `signal-detection-theory` 的“匹配滤波与相关接收”，`random-signals-through-systems` 只引用结论并说明它是峰值 SNR。
- **MMSE/LMMSE/维纳/卡尔曼**同属正交投影：统一在 `statistical-estimation-filtering` 中以“正交性原理”串起来，LMS/RLS 另起一篇。
- **ARMA 与参数化谱估计**从 09 模块合为一节，避免“模型定义”与“谱估计”两处重复。

## 导航与交叉链接

- `content/signal-processing/index.md`：学习路径由 11 篇扩为 15 篇（DSP 7 篇 + 随机信号 8 篇），新增随机信号 7 步路径；只改人工正文，`<!-- topic-index:start/end -->` 未动。
- `content/signal-processing/random-processes.md`：保留由 `build-topic-guides.mjs` 生成的 61 条笔记索引区块（位于文末），人工正文写在其上方。
- 各文章均加“前置与下一步”，按 随机过程 → 相关/谱 → 通过系统 → 估计/滤波 → 自适应/谱模型 → 检测 → 实验 的顺序互链，并回链 `mathematics/probability-overview`、`mathematics/linear-algebra-basics`、`signal-processing/dft-and-fft`、`communication/index`。
- 每篇文末“来源与延伸阅读”列出对应 `[[vault-notes/random-signals/...]]` 详细笔记。

## 验证与遗留

- 已跑 `node scripts/check-links-source.mjs`（只读，见汇报）：本批文章的双链目标与磁盘文件名一致。
- 所有块级公式 `$$` 均独占一行；代码围栏均标注语言（matlab）。
- **未执行构建/verify**：按任务约定由 Lead 统一验证；本批未运行 MATLAB，文中仿真数值均为理论预期或源笔记给出的典型量级，已明确标注“预期结果不是实测记录”。
- 随机信号侧 8 篇正文大小：`random-processes` 约 15.9 KB（另有约 5 KB 自动索引区块）、`correlation-and-power-spectrum` 16.0 KB、`random-signals-through-systems` 16.1 KB、`statistical-estimation-filtering` 14.7 KB、`adaptive-filtering-and-spectral-estimation` 15.3 KB、`signal-detection-theory` 16.1 KB、`random-signal-experiments` 15.0 KB、`random-signals-formula-sheet` 12.7 KB。三篇处在 16 KB 上限附近；如需压缩，可优先删减“接收机同步误差”“链路预算”与“白噪声噪声带宽”的工程细节。
- `index.md` 正被 DSP 批次同步编辑（其台账 `notes/fusion/dsp.md` 也记录了索引改动），本批采用“读后立即写”的最小改动，仅替换第四阶段清单与文章总数；若合并时出现覆盖，以“DSP 7 篇 + 随机信号 8 篇、共 15 篇”为准。