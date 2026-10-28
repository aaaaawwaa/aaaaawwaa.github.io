# 数字信号处理（滤波器部分）融合台账

本台账覆盖 `content/vault-notes/dsp/05-filter-structures.md` 至 `content/vault-notes/dsp/08-multirate-sampling.md` 四篇源笔记，目标文章位于 `content/signal-processing/`。状态枚举按 `notes/fusion/SPEC.md`：已归类 / 部分融合 / 正文完成 / 待处理 / 排除。

## 明细

| 源笔记 | 核心概念 | 目标文章 | 目标章节 | 动作 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 05-filter-structures 1 | 三种基本积木（延迟、乘法、加法）、信号流图节点/支路规则、转置定理 | `signal-processing/digital-filter-structures` | 三种基本积木与信号流图的两条规则 | 融合：表格化三种积木，补转置定理与用途 | 正文完成 |
| 05-filter-structures 2.1–2.2 | IIR 直接型 I、直接型 II（典范型）、延迟数与中间变量动态范围 | `signal-processing/digital-filter-structures` | 直接型 I、直接型 II（典范型） | 融合：保留差分方程与二阶例题；更正"互为转置"的错误表述 | 正文完成 |
| 05-filter-structures 2.3–2.5 | 级联型（SOS 因式分解）、并联型（部分分式）、转置型 | `signal-processing/digital-filter-structures` | 级联型、并联型、转置型 | 融合：补真分式条件、缩放与误差隔离；更正经解后的极点性质 | 正文完成 |
| 05-filter-structures 2 节对比 | IIR 各结构延迟、乘法、系数敏感度 | `signal-processing/digital-filter-structures` | IIR 结构对比 | 重写：按每节 2 个延迟更正级联/并联延迟数 | 正文完成 |
| 05-filter-structures 3.1–3.4 | FIR 直接型（横向）、级联型、频率采样型、线性相位型 | `signal-processing/digital-filter-structures` | FIR 滤波器的结构 | 融合：保留 H(z)、频率采样公式与对称合并推导 | 正文完成 |
| 05-filter-structures 3 节对比 | FIR 各结构延迟、乘法、特点 | `signal-processing/digital-filter-structures` | FIR 结构对比 | 重写：频率采样型延迟按约 2N 计 | 正文完成 |
| 05-filter-structures 4 | FIR/IIR 格型、反射系数、Levinson–Durbin、稳定性判据 | `signal-processing/digital-filter-structures` | 格型结构 | 融合：保留格型递推与一阶例题；澄清反射系数判据的适用对象 | 正文完成 |
| 05-filter-structures 5、MATLAB | 有限字长四类效应、结构选择、tf2sos/tf2latc/dfilt/filter | `signal-processing/digital-filter-structures` | 结构选择与有限字长、MATLAB 结构与实现示例 | 融合：补四类效应与选择口诀，代码注明未运行 | 正文完成 |
| 06-iir-filter-design 1 | 设计流程、为什么绕道模拟域 | `signal-processing/iir-filter-design` | 为什么 IIR 设计要"绕道"模拟域 | 融合：保留模拟原型路线的四条理由 | 正文完成 |
| 06-iir-filter-design 2 | 通带/阻带/波纹/衰减指标、dB 定义、映射四条件 | `signal-processing/iir-filter-design` | 设计指标、映射必须满足的条件 | 融合：保留公式与四种适用条件 | 正文完成 |
| 06-iir-filter-design 3 | 巴特沃斯、切比雪夫 I/II、椭圆、贝塞尔、阶数估计、选型 | `signal-processing/iir-filter-design` | 模拟滤波器原型、原型对比与选型 | 融合：保留幅平方公式、阶数公式与 T=2 预畸变数值例题 | 正文完成 |
| 06-iir-filter-design 4 | 脉冲响应不变法：h(n)=T·h_a(nT)、z=e^{sT}、混叠公式、适用条件 | `signal-processing/iir-filter-design` | 脉冲响应不变法、混叠是绕不过去的代价 | 融合：补部分分式映射与一阶例题；统一 1/T 约定 | 正文完成 |
| 06-iir-filter-design 5 | 双线性变换：映射、频率关系推导、预畸变、设计步骤、一阶例题 | `signal-processing/iir-filter-design` | 双线性变换法、频率关系与预畸变 | 融合：保留推导与 H(z) 结果，补 T 的取法 | 正文完成 |
| 06-iir-filter-design 6 | 数字高通/带通/带阻两条路线、模拟频率变换公式、高通设计步骤 | `signal-processing/iir-filter-design` | 数字高通、带通和带阻 | 融合：保留四条变换公式与"高通不能用脉冲响应不变法" | 正文完成 |
| 06-iir-filter-design 7 | MATLAB 函数表、完整巴特沃斯示例、频率单位、检查清单 | `signal-processing/iir-filter-design` | MATLAB 完整示例、设计检查清单 | 融合：给出 buttord/butter 与显式 buttap+lp2lp+bilinear 两条代码；保留单位警告；代码注明未运行 | 正文完成 |
| 07-fir-filter-design 1 | FIR 优缺点、三条设计路线 | `signal-processing/fir-filter-design` | 为什么用 FIR：优缺点与三条设计路线 | 融合：保留优缺点表与三条路线表 | 正文完成 |
| 07-fir-filter-design 2 | 线性相位条件、群延迟、四种类型、幅度函数、零点分布 | `signal-processing/fir-filter-design` | 线性相位：FIR 的核心竞争力 | 融合：保留充要条件、四型表与 I 型幅度推导 | 正文完成 |
| 07-fir-filter-design 3 | 窗函数法：理想 h_d(n)、吉布斯现象、窗参数表、凯泽窗、设计步骤、汉明窗例题 | `signal-processing/fir-filter-design` | 窗函数法：截断理想响应 | 融合：按标准窗表重算例题（N≈33）；注明与原笔记 M≈66 的差异 | 正文完成 |
| 07-fir-filter-design 4 | 频率采样法：H(k)、线性相位约束、过渡点、与窗函数法比较 | `signal-processing/fir-filter-design` | 频率采样法 | 融合：保留约束公式、32 点例题与对比表 | 正文完成 |
| 07-fir-filter-design 5 | Parks–McClellan 等波纹思想、交错定理、加权误差 | `signal-processing/fir-filter-design` | 最优等波纹设计：Parks–McClellan | 融合：补交错定理与 firpm/remez 接口 | 正文完成 |
| 07-fir-filter-design 6 | IIR/FIR 定量对比、选型 | `signal-processing/fir-filter-design` | IIR 与 FIR 的定量对比 | 融合：保留对比表，补同指标 7 阶 vs 33 阶的运算量估算 | 正文完成 |
| 07-fir-filter-design 7 | MATLAB：fir1/fir2/kaiserord/remez/filtfilt、fdatool 思路 | `signal-processing/fir-filter-design` | MATLAB 示例 | 融合：给出四类设计代码、GUI 路径与三个常见错误 | 正文完成 |
| 08-multirate-sampling 1 | 为什么需要多抽样率、应用场景 | `signal-processing/multirate-dsp` | 为什么需要改变采样率 | 融合：场景表与多抽样率系统定义 | 正文完成 |
| 08-multirate-sampling 2 | 抽取定义、频谱展宽与混叠、抗混叠滤波、D=2 例题 | `signal-processing/multirate-dsp` | 抽取：降低采样率 | 融合：保留抽取频谱公式与 1 kHz/7 kHz 例题 | 正文完成 |
| 08-multirate-sampling 3 | 插值定义、频谱压缩与镜像、抗镜像滤波、增益 I、例题 | `signal-processing/multirate-dsp` | 插值：提高采样率 | 融合：保留插零频谱公式与 {1,2,3} 例题 | 正文完成 |
| 08-multirate-sampling 4 | L/M 转换、诺贝尔恒等式、频率归一化陷阱 | `signal-processing/multirate-dsp` | 有理数倍采样率转换、诺贝尔恒等式 | 融合：保留恒等式与 44.1k↔48k 例 | 正文完成 |
| 08-multirate-sampling 5 | 多相分解、多相抽取/插值结构、计算量对比 | `signal-processing/multirate-dsp` | 多相分解与高效实现 | 融合：保留分解公式、ASCII 结构图与 64 阶/8 倍例题 | 正文完成 |
| 08-multirate-sampling 6 | 分数倍重采样、滤波器组、OFDM、软件无线电、CIC、音频图像 | `signal-processing/multirate-dsp` | 多抽样率系统的应用 | 融合：补 QMF/完美重构、DDC/DUC 与 CIC 的定位 | 正文完成 |
| 08-multirate-sampling 7 | MATLAB：decimate/interp/resample/upfirdn/designMultirateFIR/系统对象 | `signal-processing/multirate-dsp` | MATLAB 示例 | 融合：代码与参数说明，注明未运行 | 正文完成 |
| 05–08 各章末 | 知识地图、本章收官、悬念表、通信方向应用、全书骨架 | —— | —— | 排除：导航性总结，无独立知识内容；应用方向已通过正文链接与来源链接保留 | 排除 |
| 05–08 frontmatter | 课程元数据（type/subjects/status/aliases 等） | —— | —— | 排除：YAML 课程元数据，不属于正文知识 | 排除 |

## 差异与更正

1. **直接型 I 与直接型 II 的关系**：源笔记两处表述（"两者是转置关系""直接型 I 的转置 = 直接型 II 的变体"）不严格。转置保持延迟数不变，而直接型 I 为 M+N、直接型 II 为 max(M,N)，二者不可能互为转置。正文按转置定理更正，并单独加警示框。
2. **级联示例的极点性质**：源笔记称示例二阶节实现"一对共轭极点"，但 1−1.5z⁻¹+0.56z⁻² 的极点解为 0.7、0.8（两个实极点）。正文更正并写明求解依据。
3. **级联/并联的延迟数**：源笔记未明确给数；正文按"每个二阶节 2 个延迟、共约 max(M,N)"计。频率采样型按梳状 N 个 + 谐振器 N 个，约 2N。
4. **脉冲响应不变法的频谱式**：源笔记同时给出 h(n)=T·h_a(nT) 与带 1/T 的混叠式，系数约定前后不一致。正文统一为 h(n)=T·h_a(nT) 下的 ΣH_a(j(ω−2πk)/T)，并注明另一种约定的 1/T 差异。
5. **窗函数估阶公式**：源笔记按"过渡带 =6.6×2π/M"得 M≈66；标准窗表为 Δω≈6.6π/N（N 为长度），得 N≈33、M≈32。正文采用后者，并说明前者是约两倍的保守设计。
6. **fir1 奇数阶报错**：正文不把"直接报错"写成跨版本事实，改为"不同版本报错方式可能不同"，保留"II 型在 Nyquist 处必为零"这一根本原因。

## 未纳入正文的源内容与理由

- 各章"本章知识地图""本章收官""悬念表""全书骨架"：导航性总结，正文已用学习路径与交叉链接承担同样功能。
- 各章"通信方向应用"中的具体条目：保留为文末来源与应用链接（5G 物理信道、数字基带、AD9361 IQ 信号、MATLAB 笔记），未逐条复述原文。
- 源笔记中的内联 SVG 图：站点规则只允许引用已同步的 vault-notes/assets 图片，本批笔记没有对应附件，故未复制 SVG。结构关系改用表格、公式、Mermaid 决策图与 ASCII 结构图表达，未新增图片文件。

## 验证状态

- `node scripts/check-links-source.mjs`（只读）已运行：本批 4 篇目标文章无断链、无大小写不一致问题；全库其余 31 条告警均来自其他学科既有文章，不在本批范围内。
- `npm run verify`/构建未运行，按分工由 Lead 统一执行；4 篇中的 MATLAB 代码均未在本地运行，正文已逐篇注明"示例说明"。
