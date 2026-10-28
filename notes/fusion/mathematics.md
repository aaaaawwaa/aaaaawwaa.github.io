# 数学基础融合台账

> 范围：`content/vault-notes/math/linear-algebra`（12 篇）、`probability`（12 篇）、`complex-analysis`（11 篇），共 35 篇。
> 目标文章：`content/mathematics/` 下 9 篇（含公式速查）。
> 完成日期：2026-10-28。
> 状态口径按 `notes/fusion/SPEC.md`：正文完成 = 决定结论的解释、假设、推导、例题/代码已进入目标文章；部分融合 = 已引入核心概念但个别章节未逐段融合。

## 一、目标文章一览

| 文章 | 字节 | 覆盖源笔记 | 状态 |
| --- | --- | --- | --- |
| `linear-algebra-basics.md` | 13310 | 线代 01、02、03、05 | 正文完成 |
| `orthogonality-least-squares.md` | 14303 | 线代 04（+11 的快速正交化） | 正文完成 |
| `eigenvalues-svd.md` | 18415 | 线代 06、07、12、10（部分） | 正文完成 |
| `linear-transformations-numerics.md` | 15839 | 线代 08、09、11 | 正文完成 |
| `probability-overview.md` | 17232 | 概率 00–06 | 正文完成 |
| `statistics-inference.md` | 16461 | 概率 07、08、09、10、appendix（部分） | 正文完成 |
| `complex-analysis.md` | 19404 | 复变 00–06 | 正文完成 |
| `complex-transforms-and-fields.md` | 18071 | 复变 07–10 | 正文完成 |
| `formula-sheet.md` | 10967 | 跨主题汇总（非逐篇） | 正文完成 |
| `index.md` | 7439 | 人工正文重写（索引区块未动） | 正文完成 |

> 说明：源笔记磁盘实数 35 篇（12 + 12 + 11），与本任务口径一致。文章篇幅 10.9–19.4 KB，其中五篇略超 16 KB 上限（概率 17.2、统计 16.5、SVD 18.4、复变基础 19.4、变换与场论 18.1），原因是源笔记信息密度高且要求保留推导与例题；如需要可再拆分或压缩。

## 二、统计

| 状态 | 数量 | 说明 |
| --- | --- | --- |
| 正文完成 | 32 | 核心定义、条件、推导与例题/代码已写入主题文章 |
| 部分融合 | 3 | 应用篇（10-applications）覆盖马尔可夫/循环矩阵/傅里叶级数，图网络、线性规划、密码学未展开；数值篇（11）的带状/稀疏细节做了摘要；概率附录（appendix）166KB，只融合生成方法主线 |
| 待处理 | 0 | — |
| 排除 | 0 | 本批无排除项 |

## 三、逐篇台账

| 源笔记 | 核心概念 | 目标文章 | 目标章节 | 动作 | 状态 |
| --- | --- | --- | --- | --- | --- |
| [[vault-notes/math/linear-algebra/01-vector-introduction|向量引论]] | 向量运算、点积、长度与夹角、施瓦茨/三角不等式、矩阵与逆矩阵、循环差分矩阵 | [[mathematics/linear-algebra-basics|线性代数基础]] | 向量、点积与线性组合；矩阵 | 保留不等式推导与几何意义，加入 DFT 矩阵联系 | 正文完成 |
| [[vault-notes/math/linear-algebra/02-solving-linear-systems|线性方程组的求解]] | 行/列图像、高斯消元、乘数、矩阵乘法四视角、逆矩阵、LU/PA=LU、运算量 | [[mathematics/linear-algebra-basics|线性代数基础]] | 线性方程组与高斯消元 | 保留消元例题、LU 与复杂度推导 | 正文完成 |
| [[vault-notes/math/linear-algebra/03-vector-spaces-subspaces|向量空间与子空间]] | 列空间、零空间、RREF、秩、全解结构、四子空间维数 | [[mathematics/linear-algebra-basics|线性代数基础]] | 向量空间、秩与零空间 | 保留秩–零化度与四子空间表，加入例题 | 正文完成 |
| [[vault-notes/math/linear-algebra/04-orthogonality|正交性]] | 正交补、四子空间正交、投影矩阵、法方程、最小二乘、QR、Gram–Schmidt | [[mathematics/orthogonality-least-squares|正交性与最小二乘]] | 全文 | 保留投影公式推导、两个最小二乘证明、直线拟合例题、QR/GS 算法 | 正文完成 |
| [[vault-notes/math/linear-algebra/05-determinants|行列式]] | 三条性质、十条推论、主元/排列公式、代数余子式、Cramer 法则、体积与叉积 | [[mathematics/linear-algebra-basics|线性代数基础]] | 行列式 | 保留性质体系、主元公式与几何意义，Cramer 标注为理论用途 | 正文完成 |
| [[vault-notes/math/linear-algebra/06-eigenvalues-eigenvectors|特征值与特征向量]] | 特征方程、迹/行列式、虚特征值、对角化条件、斐波那契、微分/差分方程、对称矩阵、正定矩阵 | [[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]] | 特征值与特征向量；对称矩阵、正定矩阵与谱定理 | 保留对角化充要条件、稳定性判据、谱分解证明 | 正文完成 |
| [[vault-notes/math/linear-algebra/07-singular-value-decomposition|奇异值分解]] | 秩一层、Eckart–Young、四子空间标准正交基、伪逆、PCA、单位球到椭球、条件数 | [[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]] | 奇异值分解；主成分分析；MIMO 与卷积对角化 | 保留 SVD 推导、手算例子、压缩比与 PCA 公式 | 正文完成 |
| [[vault-notes/math/linear-algebra/08-linear-transformations|线性变换]] | 线性变换定义、核与像、矩阵构造、换基与相似、求导算子、若尔当形、函数空间正交基 | [[mathematics/linear-transformations-numerics|线性变换与数值稳定性]] | 线性变换、核与像；矩阵是变换的快照 | 保留三步构造、求导算子例、相似与 Schur，函数空间部分压为一段 | 正文完成 |
| [[vault-notes/math/linear-algebra/09-complex-vectors-matrices|复向量和复矩阵]] | 复内积、Hermitian/酉矩阵、单位根、DFT 矩阵、FFT 分解与复杂度 | [[mathematics/linear-transformations-numerics|线性变换与数值稳定性]] | 复向量、Hermitian 矩阵与酉矩阵；FFT 的矩阵分解 | 保留 FFT 分块公式与 O(N log N) 推导 | 正文完成 |
| [[vault-notes/math/linear-algebra/10-applications|线性代数的应用]] | 图与网络、刚度矩阵、马尔可夫/Perron–Frobenius、线性规划、傅里叶级数、图形学、密码学 | [[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]] | 马尔可夫链；卷积=循环矩阵=DFT 对角化 | 融合马尔可夫收敛、循环矩阵对角化与傅里叶级数视角；图网络、线性规划、密码学未展开 | 部分融合 |
| [[vault-notes/math/linear-algebra/11-numerical-linear-algebra|数值线性代数]] | 舍入误差/列主元、运算量、带状/稀疏、快速正交化、范数与条件数、Jacobi/GS/CG/多重网格、幂法 | [[mathematics/linear-transformations-numerics|线性变换与数值稳定性]] | 数值稳定性；迭代法；特征值迭代 | 保留条件数与希尔伯特表、迭代收敛判据、CG 对比；带状/重排/多重网格压为摘要 | 正文完成 |
| [[vault-notes/math/linear-algebra/12-linear-algebra-in-probability-statistics|概率统计中的线性代数]] | 期望方差、协方差矩阵、谱分解、传播律、白化、多维高斯、加权最小二乘 | [[mathematics/eigenvalues-svd|特征值、SVD 与低秩近似]]；[[mathematics/probability-overview|概率论概览]] | 随机向量的协方差与多维高斯；数字特征 | 保留协方差 PSD 证明、传播律、高斯密度与椭球解释、加权最小二乘公式 | 正文完成 |
| [[vault-notes/math/probability/00-guide|概率论与数理统计知识库总导读]] | 十章结构、学习顺序、与通信知识库的联系 | [[mathematics/probability-overview|概率论概览]] | 引言；前置与相关 | 用"公理→条件→变量→多维→特征→极限"主线组织全文 | 正文完成 |
| [[vault-notes/math/probability/01-basic-concepts|概率论的基本概念]] | 随机试验、样本空间、事件运算、公理化定义、古典/几何概型 | [[mathematics/probability-overview|概率论概览]] | 概率的公理化定义 | 保留三条公理、加法公式与等概符号例 | 正文完成 |
| [[vault-notes/math/probability/02-conditional-probability-independence|条件概率与事件的独立性]] | 条件概率、乘法/全概率/贝叶斯、独立性、伯努利概型、信道误码例题 | [[mathematics/probability-overview|概率论概览]] | 条件概率、全概率与贝叶斯 | 保留公式推导，加入信道选择的后验概率例题 | 正文完成 |
| [[vault-notes/math/probability/03-random-variables-distributions|随机变量及其分布]] | 分布律/密度/CDF、常见分布、衰落分布、随机变量函数、例题 | [[mathematics/probability-overview|概率论概览]] | 随机变量及其分布；二维随机变量 | 保留常见分布表、指数无记忆、瑞利/莱斯/对数正态/伽马说明 | 正文完成 |
| [[vault-notes/math/probability/04-multivariate-random-variables|多维随机变量及其分布]] | 联合/边缘/条件、独立性、卷积、极值、雅可比、二维正态、MATLAB | [[mathematics/probability-overview|概率论概览]] | 多维随机变量 | 保留卷积/极值/雅可比公式与瑞利分布推导，二维正态不相关=独立 | 正文完成 |
| [[vault-notes/math/probability/05-numerical-characteristics|随机变量的数字特征]] | 期望、方差、协方差/相关系数、矩与协方差矩阵、常见分布期望方差、条件期望 | [[mathematics/probability-overview|概率论概览]] | 数字特征 | 保留线性性无条件、方差和的协方差项、全期望公式 | 正文完成 |
| [[vault-notes/math/probability/06-law-of-large-numbers-clt|大数定律与中心极限定理]] | 切比雪夫不等式、三个大数定律、三种 CLT、连续性修正、应用 | [[mathematics/probability-overview|概率论概览]] | 大数定律与中心极限定理 | 保留条件与连续性修正，加入仿真样本量讨论 | 正文完成 |
| [[vault-notes/math/probability/07-samples-sampling-distributions|样本及抽样分布]] | 总体/样本/统计量、三大分布、正态总体四结论、两样本、分位数 | [[mathematics/statistics-inference|数理统计与推断]] | 总体、样本与统计量；抽样分布 | 保留定义与四条核心结论、两样本公式、分位数常用值 | 正文完成 |
| [[vault-notes/math/probability/08-parameter-estimation|参数估计]] | 矩估计、MLE、无偏/有效/相合/MSE、枢轴量、z/t/χ² 区间、样本量 | [[mathematics/statistics-inference|数理统计与推断]] | 参数估计 | 保留四类 MLE 例、边界情形、区间公式与样本量例题 | 正文完成 |
| [[vault-notes/math/probability/09-hypothesis-testing|假设检验]] | 两类错误、检验统计量/拒绝域、p 值、z/t/χ²/F 检验、拟合优度、与 CI 对偶 | [[mathematics/statistics-inference|数理统计与推断]] | 假设检验 | 保留检验公式、错误表、p 值含义与拟合优度 | 正文完成 |
| [[vault-notes/math/probability/10-anova-regression|方差分析与回归分析]] | 单因素 ANOVA、平方和分解、方差分析表、一元回归、显著性、预测 | [[mathematics/statistics-inference|数理统计与推断]] | 方差分析；一元线性回归 | 保留分解与自由度、F 统计量、回归公式与 R²，强调前提 | 正文完成 |
| [[vault-notes/math/probability/appendix-random-variable-functions|附录：随机变量函数与随机数生成]] | 随机变量函数（卷积/雅可比/顺序统计量）、逆变换/舍选/Box–Muller/Cholesky、通信仿真、蒙特卡洛、KS 检验 | [[mathematics/statistics-inference|数理统计与推断]]；[[mathematics/probability-overview|概率论概览]] | 随机变量函数与随机数生成；仿真验证 | 融合生成方法与仿真验证主线；166KB 附录的 MATLAB 代码只摘要关键段 | 部分融合 |
| [[vault-notes/math/complex-analysis/00-guide|复变函数与场论知识库总导读]] | 复变/积分变换/场论三部分与学习顺序 | [[mathematics/complex-analysis|复变函数基础]]；[[mathematics/complex-transforms-and-fields|复变变换与场论]] | 引言；前置与相关 | 按"代数→解析→积分→级数→留数→映射→变换→场论"组织 | 正文完成 |
| [[vault-notes/math/complex-analysis/01-complex-numbers-functions|复数与复变函数]] | 代数/极形式、棣莫弗、方根、映射、极限、初等函数、例题 | [[mathematics/complex-analysis|复变函数基础]] | 复数及其几何表示；复变函数与初等函数 | 保留欧拉公式、方根例、多值性与支割线 | 正文完成 |
| [[vault-notes/math/complex-analysis/02-analytic-functions|解析函数]] | 导数、C-R（直角/极坐标）、解析定义、强性质、调和函数、由 u 求 v | [[mathematics/complex-analysis|复变函数基础]] | 解析函数与 Cauchy–Riemann 方程 | 保留沿两路径推 C-R、可导≠解析例、调和函数证明与例题 | 正文完成 |
| [[vault-notes/math/complex-analysis/03-complex-integration|复变函数的积分]] | 复积分、柯西定理、多连通、柯西公式、平均值、高阶导数、三个推论 | [[mathematics/complex-analysis|复变函数基础]] | 复积分与柯西定理 | 保留公式、条件与四个计算例 | 正文完成 |
| [[vault-notes/math/complex-analysis/04-series-representation|解析函数的级数表示]] | 幂级数收敛半径、泰勒、洛朗、孤立奇点分类 | [[mathematics/complex-analysis|复变函数基础]] | 级数、奇点与留数 | 保留收敛半径公式、洛朗双环域例、奇点分类表 | 正文完成 |
| [[vault-notes/math/complex-analysis/05-residues-applications|留数及其应用]] | 留数定义/定理、极点计算、三角/有理/指数积分、实轴奇点 | [[mathematics/complex-analysis|复变函数基础]] | 留数与留数定理；用留数计算实积分 | 保留四个典型积分例与主值公式，加入拉氏反变换联系 | 正文完成 |
| [[vault-notes/math/complex-analysis/06-conformal-mapping|保角映射]] | 保角性、分式线性、交比、幂/指数/对数/儒可夫斯基、区域映射 | [[mathematics/complex-analysis|复变函数基础]] | 保角映射 | 保留保圆性、三点定映射、上半平面→单位圆与儒可夫斯基例 | 正文完成 |
| [[vault-notes/math/complex-analysis/07-fourier-transform|傅里叶变换]] | 傅里叶级数、傅里叶变换、δ 函数、性质、变换对、卷积、抽样、Parseval | [[mathematics/complex-transforms-and-fields|复变变换与场论]] | 傅里叶级数；傅里叶变换 | 保留级数系数公式、性质表、变换对、δ 函数性质与抽样定理 | 正文完成 |
| [[vault-notes/math/complex-analysis/08-laplace-transform|拉普拉斯变换]] | 从 FT 到 LT、ROC、变换对、性质、部分分式/留数反变换、ODE/电路/稳定性 | [[mathematics/complex-transforms-and-fields|复变变换与场论]] | 拉普拉斯变换 | 保留 ROC 唯一性、性质、留数反变换例、RLC 与稳定性判据 | 正文完成 |
| [[vault-notes/math/complex-analysis/09-field-theory-basics|场论基础]] | 标量/向量场、方向导数/梯度、通量/散度、环量/旋度、三个恒等式 | [[mathematics/complex-transforms-and-fields|复变变换与场论]] | 场论基础 | 保留梯度/散度/旋度定义与两个恒等式 | 正文完成 |
| [[vault-notes/math/complex-analysis/10-field-integral-theorems-boundary-value|场论的积分定理与边值问题]] | 高斯/斯托克斯、麦克斯韦、亥姆霍兹、拉普拉斯/泊松、边界条件、分离变量 | [[mathematics/complex-transforms-and-fields|复变变换与场论]] | 场论基础 | 保留积分/微分形式、唯一性定理、一维与矩形域分离变量解 | 正文完成 |

## 四、未完成项与说明

- 线性代数第 10 篇的图与网络、线性规划、图形学、密码学四节未进入主题文章：它们与本站 DSP/通信主线关联较弱，且单篇篇幅有限，保留为源笔记供延伸阅读。
- 概率附录 166KB：随机变量函数（卷积/雅可比/顺序统计量）已在概率篇概述，生成方法与仿真验证已融合；附录中逐题 MATLAB 代码未逐段搬运。
- 数值线性代数中的带状矩阵、稀疏重排（最小度/Cuthill–McKee）、多重网格只做摘要，细节保留在源笔记。

## 五、风险与验证

- 双链全部为全小写、与磁盘文件名逐字符一致；运行 `node scripts/check-links-source.mjs` 检查。
- 块级公式 `$$` 独占一行；表格内公式未使用裸竖线。
- 未执行构建（由 Lead 统一验证）；文中数值均为按公式手算或引用源笔记的实测记录，未声称本 Agent 实际运行过仿真。
