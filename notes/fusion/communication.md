# 通信原理 / 数字调制 / 5G 融合台账

本台账记录本学科批次的"源笔记 → 主题文章"融合进度。状态口径按 `notes/fusion/SPEC.md` §0：
**已归类 / 部分融合 / 正文完成 / 待处理 / 排除**。

- 源笔记磁盘实数：**39 篇**（`content/vault-notes/communication/` 16 篇 + `content/vault-notes/digital-modulation/` 1 篇 + `content/vault-notes/5g/` 22 篇）。任务描述写 40 篇，以磁盘为准；若另有 1 篇未同步，需补充同步后再处理。
- 目标目录：`content/communication/`（8 篇主题文章 + index.md 人工正文）。
- 完成日期：2026-10-28。

## 一、目标文章一览

| 文章 | 字节 | 覆盖源笔记 | 状态 |
| --- | --- | --- | --- |
| `communication-signals-and-channel.md` | 15488 | 02、03、04（+01 指标、digital-modulation/01 系统组成） | 正文完成 |
| `analog-modulation-am.md` | 13893 | 05 | 正文完成 |
| `digital-baseband-transmission.md` | 14558 | 06 | 正文完成 |
| `digital-modulation-qpsk.md` | 16383 | 07、08、09 | 正文完成 |
| `source-and-channel-coding.md` | 16364 | 10、11、12 | 正文完成 |
| `synchronization.md` | 10686 | 13 | 正文完成 |
| `mobile-networks.md` | 16363 | 5g/ 22 篇（00-guide 与两篇工程仿真为部分融合） | 正文完成 |
| `communication-formulas.md` | 14893 | a、b、01（+digital-modulation/01） | 正文完成 |
| `index.md` | 5474 | 人工正文重写（索引区块未动） | 正文完成 |

## 二、逐篇台账

### 2.1 通信原理（content/vault-notes/communication/，16 篇）

| 源笔记 | 核心概念 | 目标文章 | 目标章节 | 动作 | 状态 |
| --- | --- | --- | --- | --- | --- |
| `00-guide.md` | 13 章知识地图、全书主线、章节对照 | `communication-formulas.md`；`index.md` | §跨库接口；§学习范围/建议阅读顺序 | 提炼"发端→信道→收端"主线与章节映射；导航条目仍由索引区块维护 | 部分融合（MOC 无独立推导） |
| `01-introduction.md` | 消息/信息/信号、传输模型、信息量/熵、$R_b=R_B\log_2M$、有效性/可靠性 | `communication-formulas.md`；`communication-signals-and-channel.md` | §数字通信系统的组成、§绪论；§信道容量与香农公式 | 信息量/熵/速率/误码率指标与系统组成入正文 | 正文完成 |
| `02-deterministic-signals.md` | 能量/功率信号、傅里叶级数/变换、能量谱与功率谱、自相关、维纳–辛钦、门函数↔Sa | `communication-signals-and-channel.md` | §确知信号：能量信号与功率信号、§频域描述、§自相关函数与维纳–辛钦定理 | 保留判据、谱定义、维纳–辛钦与"带宽≈1/τ"结论 | 正文完成 |
| `03-random-processes.md` | 严平稳/宽平稳、各态历经、$P_o=|H|^2P_i$、窄带过程、瑞利/莱斯、白噪声 $n_0B$、Q/erfc | `communication-signals-and-channel.md` | §随机过程、§通过线性系统、§白噪声/窄带噪声与三个判决量分布 | 保留 $n_0/2$ 与 $n_0$ 区别、判决量分布表、Q/erfc 换算 | 正文完成 |
| `04-channel.md` | 调制信道/编码信道、恒参与随参失真、相关带宽、噪声分类、香农公式与香农极限 | `communication-signals-and-channel.md` | §信道模型、§信道对信号做了什么、§信道容量与香农公式 | 保留 $d\approx\sqrt{2rh}$、$\Delta f=1/\tau_m$、$1.44S/n_0$、$-1.6$ dB；补充噪声系数与 Friis 作为工程扩展 | 正文完成 |
| `05-analog-modulation.md` | AM/DSB/SSB/VSB 表达式与带宽、调制效率、包络检波条件、解调增益、卡森公式、FM 门限、FDM | `analog-modulation-am.md` | 全篇（§AM、§DSB、§SSB、§VSB、§线性调制抗噪、§FM/PM、§比较、§FDM） | 保留 $\eta\le1/3$、$G_{DSB}=2$、$G_{SSB}=1$、$B_{FM}=2(\Delta f+f_m)$、$G_{FM}\approx3m_f^3$、门限约 10 dB | 正文完成 |
| `06-digital-baseband.md` | 码型与功率谱、AMI/HDB3、ISI、奈奎斯特第一准则、升余弦、误码率、眼图、部分响应、均衡 | `digital-baseband-transmission.md` | 全篇（§波形与频谱、§传输码型、§奈奎斯特、§抗噪声、§眼图、§部分响应、§均衡） | 保留 HDB3 规则与示例、$B=(1+\alpha)R_B/2$、$\eta=2/(1+\alpha)$、双极性/单极性误码率条件 | 正文完成 |
| `07-digital-bandpass.md` | 2ASK/2FSK/2PSK/2DPSK 表达式与带宽、误码率表、性能比较、多进制调制 | `digital-modulation-qpsk.md` | §二进制调制的四个基本款、§误码率公式表、§多进制调制 | 保留倒 π、差分编码、$r=a^2/(2\sigma_n^2)$ 表与 3 dB/6 dB 排序、MASK/MFSK/MPSK | 正文完成 |
| `08-advanced-digital-modulation.md` | QAM、16QAM vs 16PSK（4.12 dB）、MSK/GMSK、OFDM 正交与 CP、PAPR | `digital-modulation-qpsk.md` | §QPSK、§QAM、§MSK 与 GMSK、§OFDM | 保留 16QAM 最小距离推导与 4.12 dB 条件、$h=0.5$、$\Delta f=1/T_s$、$T_{CP}\ge\tau_{\max}$ | 正文完成 |
| `09-optimal-reception.md` | MAP/ML、最小欧氏距离、相关接收机、$P_e$ 与 $\rho$、匹配滤波器、SRRC | `digital-modulation-qpsk.md` | §最佳接收 | 保留 $h(t)=ks(t_0-t)$、$r_{0\max}=2E/n_0$、$P_e=\frac12\mathrm{erfc}\sqrt{E(1-\rho)/(2n_0)}$、$|T|=|R|=|H|^{1/2}$ | 正文完成 |
| `10-source-coding.md` | 抽样定理、均匀/非均匀量化、A 律 13 折线、PCM 8 位码、DPCM/ΔM、TDM/E1、霍夫曼 | `source-and-channel-coding.md` | §抽样、§量化、§PCM、§DPCM 与增量调制、§时分复用、§压缩编码 | 保留 $f_s\ge2f_H$、$\sigma_q^2=\Delta^2/12$、13 折线斜率表、+1270Δ 例题、64 kb/s、ΔM 不过载条件、2048 kb/s | 正文完成 |
| `11-error-control-coding.md` | 差错控制方式、码距三公式、线性分组码 H/G/S、循环码 g(x)、卷积码与维特比、Turbo/LDPC、TCM | `source-and-channel-coding.md` | §信道编码、§线性分组码与汉明码、§循环码、§卷积码与维特比、§现代编码与 5G | 保留三公式、$2^r\ge n+1$、$S=RH^T$、(7,4) 编码例题、ACS 与软判决 2 dB、LDPC/Polar 与 5G | 正文完成 |
| `12-orthogonal-codes-pn-sequences.md` | 正交码、哈达玛/沃尔什、m 序列四条性质、本原多项式、Gold、扩频与处理增益 | `source-and-channel-coding.md` | §正交码、§伪随机序列与扩频 | 保留 $H_nH_n^T=nI$、$p=2^n-1$、双值自相关、$G_p=R_c/R_b$ 与三大优点 | 正文完成 |
| `13-synchronization.md` | 载波同步（平方环/科斯塔斯环）、位同步、帧同步与巴克码、漏/假同步、网同步 | `synchronization.md` | 全篇 | 保留科斯塔斯误差电压 $v_g$、$P_1/P_2$ 公式与 7 位巴克码例题、定时误差折损 $E_b/N_0$ | 正文完成 |
| `a-formula-cheatsheet.md` | 13 章公式速查、Top10 必背、易错标注 | `communication-formulas.md` | 全篇（分章公式表、常用换算、易错点） | 逐章表格化，补适用条件与自洽性检查（如单/双极性 6 dB 的比较基准） | 正文完成 |
| `b-cross-library-links.md` | 与概率论/线代/数字调制/5G/FPGA/MATLAB 的接口、三条复习路线 | `communication-formulas.md` | §跨库接口、§三条复习路线 | 提炼接口表与三条路线，正文双链指向站内文章 | 正文完成 |

### 2.2 数字调制（content/vault-notes/digital-modulation/，1 篇）

| 源笔记 | 核心概念 | 目标文章 | 目标章节 | 动作 | 状态 |
| --- | --- | --- | --- | --- | --- |
| `01-digital-communication-system.md` | 数字通信系统组成链、信源编码/信道编码定义、与通信原理章节的映射 | `communication-formulas.md`；`source-and-channel-coding.md` | §数字通信系统的组成；§两条相反方向的编码 | 系统链路图内容与编码分工入正文，保留"去冗余/加冗余"对照 | 正文完成 |

### 2.3 5G / 6G（content/vault-notes/5g/，22 篇）

| 源笔记 | 核心概念 | 目标文章 | 目标章节 | 动作 | 状态 |
| --- | --- | --- | --- | --- | --- |
| `00-guide.md` | 5G 知识地图、四层模块、推荐路线、与通信原理的对照表 | `mobile-networks.md` | 全文组织顺序；§来源与延伸阅读 | 采用其"基础→架构→空口→流程"组织文章；导航条目由索引区块维护 | 部分融合（MOC） |
| `harq.md` | HARQ=FEC+ARQ、软合并/IR、异步多进程、RV、上下行差异、CBG | `mobile-networks.md` | §波束管理与 HARQ | 保留进程号/NDI/RV/K 偏移、上下行反馈差异、CBG 与 CBGTI/CBGFI | 正文完成 |
| `6g/01-6g-architecture.md` | 6G 五面架构、产业链上游 | `mobile-networks.md` | §6G 展望 | 五面与上游三类入正文；厂商名单属产业资料未搬入，指标标注待核验 | 部分融合 |
| `architecture/01-layering-overview.md` | 物理层/L2/网络层/传输层总览、接口关键字 | `mobile-networks.md` | §网络架构：5GC 与 NG-RAN、§协议栈与承载 | 分层顺序与 N2/N3/N4/N9 映射入正文 | 正文完成 |
| `architecture/02-5gc-architecture.md` | SBA、C/U 分离、AMF/SMF/UPF/UDM 等网元、接口表、切片/MEC | `mobile-networks.md` | §5GC：服务化架构与 C/U 分离 | 网元职责表、接口表、切片与 MEC 要点入正文 | 正文完成 |
| `architecture/03-ng-ran-architecture.md` | CU/DU/AAU 拆分、NG/Xn/F1/E1/Uu 接口、移动性 | `mobile-networks.md` | §NG-RAN：CU/DU/AAU 三级拆分 | 三类实体分工与接口表入正文 | 正文完成 |
| `engineering-simulation/01-engineering-simulation.md` | 工程仿真入口与关联清单 | `mobile-networks.md` | §工程实践视角 | 仅作为实验记录入口；无独立正文（入口页） | 部分融合（入口页） |
| `engineering-simulation/02-signal-tower-practice.md` | 信号塔设备/光模块/线缆/机房配置 | `mobile-networks.md` | §工程实践视角 | 提炼"AAU 集成天线、光模块速率代际、配电与机房组织"三条规律；具体题解矩阵属仿真答案，未逐条搬入 | 部分融合 |
| `fundamentals/01-4g-to-5g-evolution.md` | NSA/Option 3x、EN-DC、MCG/SCG、X2、R15–R18 版本 | `mobile-networks.md` | §从 NSA 到 SA | NSA/SA 与 Option 3x 数据分流、EN-DC 角色入正文；版本时间线仅保留 R15/R16 提及 | 部分融合（版本时间线未展开） |
| `fundamentals/02-5g-history-applications.md` | IMT-2020、100 Mbps 体验目标、eMBB 时延口径、6G=IMT-2030 | `mobile-networks.md` | §5G 要解决什么问题、§6G 展望 | 命名、体验速率与三大场景入正文 | 正文完成 |
| `fundamentals/03-5g-learning-guide.md` | 5G 知识树与学习路线 | `mobile-networks.md`；`index.md` | §全文组织；§建议阅读顺序 | 学习顺序映射入 index 提示与文章结构 | 正文完成 |
| `phy/01-cell-search.md` | SSB（PSS/SSS/PBCH）、三步搜索、PCI=3N1+N2、MIB/SIB1、波束数 | `mobile-networks.md` | §小区搜索 | 保留 SSB 结构、三步、PCI 公式与 1008/504 对比、SSB 周期与波束数 | 正文完成 |
| `phy/02-measurements-mobility.md` | RRC 三态、测量四要素、A1–A6、B1/B2、切换 | `mobile-networks.md` | §测量、RRC 三态与切换 | 三态图意、四要素、A/B 事件表与切换流程入正文 | 正文完成 |
| `phy/03-random-access-rach.md` | RACH 触发、CBRA/CFRA、Msg1–Msg4、两步 RA、TA、功率攀升 | `mobile-networks.md` | §随机接入 | 四步流程、两步 RA、ZC 前导码 64 个、TA 与功率攀升入正文 | 正文完成 |
| `phy/04-physical-channels-signals.md` | 上下行物理信道与调制、DCI 格式、参考信号、信道映射 | `mobile-networks.md` | §NR 物理层、§波束管理；`digital-modulation-qpsk.md` §QAM 引用 | 信道/信号功能与 DCI 0_x/1_x/2_x 分类、LDPC/Polar 映射入正文 | 正文完成 |
| `phy/05-air-interface-illustrated.md` | OFDM/SC-FDMA、多址、MCS、调度三步曲（SR/UL Grant/BSR）、波束管理、NTN | `mobile-networks.md` | §波束管理、§NR 物理层、§协议栈与承载 | 波束生命周期、SSB/CSI-RS/SRS 分工、SR→UL Grant→BSR 入正文 | 正文完成 |
| `phy/06-ue-access-core-network-flow.md` | 小区搜索→RACH→RRC→注册→PDU 会话的端到端时序 | `mobile-networks.md` | §端到端接入流程 | 五步链路压缩入正文 | 正文完成 |
| `protocols/01-bearer-l1-l2.md` | SRB/DRB、QoS Flow↔DRB、承载分层 | `mobile-networks.md` | §协议栈与承载 | SRB0–3、DRB、SDAP 映射入正文 | 正文完成 |
| `protocols/02-transport-layer-tunnels.md` | SCTP/GTP-U/PFCP/UDP-IP 与 N2/N3/N4/N9 | `mobile-networks.md` | §承载网：前传、中传、回传 | 协议与接口对应、"稳/快/管"三句概括入正文 | 正文完成 |
| `protocols/03-data-link-layer-l2.md` | SDAP/PDCP/RLC/MAC 四子层职责 | `mobile-networks.md` | §协议栈与承载 | 四子层职责表入正文 | 正文完成 |
| `protocols/04-nr-standard-specifications.md` | FR1/FR2、SCS/numerology、帧结构、RB/BWP、SSB/PRACH | `mobile-networks.md` | §NR 物理层：频率、参数集与帧结构 | 频段/带宽、$T_{slot}=1/2^{\mu}$ ms、RB/BWP、SSB 结构入正文 | 正文完成 |
| `protocols/05-transport-network.md` | 前传/中传/回传、EPS 承载 vs PDU 会话、QoS Flow、切片绑定 | `mobile-networks.md` | §承载网：前传、中传、回传；§协议栈与承载 | 承载网三段与 PDU 会话/EPS 承载对比入正文 | 正文完成 |

## 三、未完成项与原因

| 项目 | 原因 | 后续动作 |
| --- | --- | --- |
| 5G 两篇工程仿真的"机房跳线矩阵 / 具体题解" | 属仿真练习答案，逐条搬入会把练习题解当正文结论，且体量大 | 需要时另建"工程仿真题解"文章，或在实验页维护 |
| 各笔记的"刷题补充"条目（LTE CA 5CC、NB-IoT 不限切换、RACH 周期 10/40/160 ms 等） | 属备考口径与题目判定，未全部作为正文结论 | 可在 formulas 或 mobile-networks 的"参数速查"中汇总，需先核对标准原文 |
| 5G 版本演进时间线（R14–R18） | 与正文主线重复度高，只保留 R15/R16 的机制级引用 | 补充到 mobile-networks §从 NSA 到 SA 或 6G 展望 |
| 通信原理 00-guide / 5G 00-guide 的导航条目 | 索引页由脚本维护，人工正文不宜复制导航 | 保持索引区块自动生成 |

## 四、待核验与风险

1. **待核验**：6G 标准状态、指标与商用时间表（来源为课程/竞赛资料）；噪声系数与 Friis 公式的器件数值；16QAM 与 16PSK 的 4.12 dB 结论依赖"同最大振幅 + 峰均比 1.8"的设定，正文已写明条件。
2. **口径风险**：双极性/单极性"6 dB"结论对应同一电平参数；若按相同平均功率比较则为 3 dB，正文已分别标注条件。
3. **渲染风险**：块级公式均独占一行；mermaid 图仅使用 `flowchart` 语法；未新增图片（通信/5G 源笔记无已同步附件，故未引用 `vault-notes/assets/`）。代码块未放入双链或公式。
4. **未验证项**：本批次未运行构建（`npm run verify`）与浏览器渲染检查，由 Lead 统一验证；仅运行了只读的 `node scripts/check-links-source.mjs`，通信目录 0 断链。
