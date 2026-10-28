---
title: 5G 与 6G 移动通信：从网络架构到空口过程
description: 从 4G 到 5G 演进出发，串起 5GC/NG-RAN 架构、L2 协议、NR 帧结构、小区搜索、随机接入、HARQ 与测量切换，最后看 6G 展望。
tags:
  - communication
  - mobile-networks
  - 5g
  - nr
  - 6g
---

## 5G 要解决什么问题

4G 把移动互联网做到了"人人可上网"，但业务形态的变化提出了三类互相矛盾的需求：增强移动宽带（eMBB）要大带宽，超可靠低时延（uRLLC）要毫秒级时延与极高可靠性，海量机器通信（mMTC）要每平方公里百万级连接。ITU 把这套愿景命名为 **IMT-2020**（5G 的正式名称，正如 3G 是 IMT-2000、4G 是 IMT-Advanced），并承诺建网初期"随时随地 100 Mbps"的体验速率；6G 对应 **IMT-2030**。

三大场景意味着空口不能只有一种参数：大带宽要宽载波与高阶调制，低时延要更短时隙与快速重传，海量连接要灵活调度与节能——灵活子载波间隔、大规模天线、服务化核心网正是为同一套系统同时支撑三类业务而设计。

## 从 NSA 到 SA：5G 的两种建网路线

**NSA（非独立组网）** 沿用 4G 的 EPC 核心网，5G 基站（en-gNB）作为辅节点依附 4G 基站（eNB）工作，属于 R15 标准。最典型的 **Option 3x** 中，eNB 作为主节点负责全部 RRC 信令并通过 S1 连接 EPC，en-gNB 作为辅节点只承载高速用户面数据、经 **X2 接口**与 eNB 交互；终端用 **EN-DC** 同时连接 4G 与 5G，**MCG**（主小区组）是控制面锚点，**SCG**（辅小区组）是数据管道。Option 3x 的含义是"用户面在 5G 侧分流"：下行数据从 EPC 直送 5G 基站再分给终端，覆盖不好时经 X2 回落到 4G。**SA（独立组网，Option 2）** 由 5GC 完整承载业务，是切片、低时延与云原生能力真正落地的前提。

## 网络架构：5GC 与 NG-RAN

### 5GC：服务化架构与 C/U 分离

5GC 的两个核心设计思想是 **SBA**（服务化架构，NF 以服务方式互联、独立部署与弹性扩容）与 **C/U 分离**（控制面集中管理会话与策略，用户面专注高速转发，便于边缘部署）。

| 网元 | 全称 | 职责 |
| --- | --- | --- |
| AMF | Access and Mobility Management Function | 接入、注册、移动性管理、用户认证 |
| SMF | Session Management Function | 会话管理、PDU 会话建立、选择 UPF |
| UPF | User Plane Function | 用户面转发（N3/N9/N6） |
| UDM | Unified Data Management | 用户数据与签约信息管理 |
| AUSF | Authentication Server Function | 鉴权服务 |
| PCF | Policy Control Function | 策略与 QoS 控制 |
| NRF | Network Repository Function | NF 注册与发现 |
| NSSF | Network Slice Selection Function | 网络切片选择 |

接口上，**N1** 是 UE 与 AMF 之间的 NAS 信令，**N2** 是 gNB 与 AMF 之间的控制面（NG-AP over SCTP/IP），**N3** 是 gNB 与 UPF 之间的用户面（GTP-U/UDP/IP），**N4** 是 SMF 与 UPF 之间的会话与转发控制（PFCP/UDP/IP），**N9** 是 UPF 之间的转发，**N6** 是 UPF 到数据网络的出口。

### NG-RAN：CU/DU/AAU 三级拆分

5G 基站（gNB）通常拆成三类功能实体：

- **CU**（Centralized Unit）：集中处理控制面与高层协议，偏非实时；
- **DU**（Distributed Unit）：处理实时性强的调度与接入处理；
- **AAU**（Active Antenna Unit）：射频与天线阵列。

拆分的目的是把实时与非实时功能分开，便于集中部署与边缘演进。关键接口：**Uu**（空口）、**NG**（gNB–5GC，分 NG-C/NG-U）、**Xn**（gNB 间切换与协同）、**F1**（CU–DU）、**E1**（CU 内控制/用户分离）。

### 承载网：前传、中传、回传

基站到核心网之间由**承载网**连接：**前传**（DU–AAU，CPRI/eCPRI）、**中传**（DU–CU，F1）与**回传**（CU–核心网）。隧道协议上，控制面用 **SCTP**（多宿、多流，适合 N2 稳定传输），用户面用 **GTP-U**（头部轻、转发快），SMF 与 UPF 之间用 **PFCP** 下发转发规则，底层统一跑 **UDP/IP**——SCTP 让信令稳、GTP-U 让数据快、PFCP 让规则管得住。

## 协议栈与承载

空口 L2 由四个子层组成，职责从业务到空口逐层下沉：

| 子层 | 核心职责 |
| --- | --- |
| SDAP | QoS Flow 到 DRB 的映射（5G 新增层） |
| PDCP | 加密与完整性保护、IP 头压缩、切换数据连续性 |
| RLC | 分段与重组、按需重传 |
| MAC | 调度、多路复用、HARQ 控制 |

承载分两类：**SRB** 承载 RRC 与 NAS 控制信令（SRB0~SRB3），**DRB** 承载用户面数据。核心网侧的 **QoS Flow** 是业务粒度，无线侧的 **DRB** 是承载粒度，二者由 SDAP 映射——一个 DRB 可承载多个 QoS Flow，这是 5G 比 4G 更精细的地方。

**PDU 会话**（PDU Session）是 5G 会话的基本单位：一个 PDU 会话可包含多个 QoS Flow，建立时绑定某个网络切片（S-NSSAI）。与 4G 的 **EPS 承载**相比，PDU 会话粒度更细（一会话多流）、数据类型更多（IP、以太网、非结构化）、与切片强绑定。

## NR 物理层：频率、参数集与帧结构

NR 分两个频率范围：**FR1**（410 MHz–7125 MHz，最大带宽 100 MHz，覆盖强、主流商用）与 **FR2**（24250–52600 MHz 毫米波，最大 400 MHz，适合高容量热点）。常见频段：n28（700 MHz）、n41（2.6 GHz）、n78（3.5 GHz C-Band，全球主流）、n79（4.9 GHz）。

NR 用参数 $\mu$ 表示**子载波间隔**（SCS）：

| $\mu$ | 子载波间隔 | 典型场景 |
| --- | --- | --- |
| 0 | 15 kHz | FR1，覆盖优先 |
| 1 | 30 kHz | FR1 主流 |
| 2 | 60 kHz | FR1 高容量或扩展 CP |
| 3 | 120 kHz | FR2 主流 |
| 4 | 240 kHz | FR2 同步信号等 |

$\Delta f=15\times2^{\mu}\ \text{kHz}$。时间结构保持 10 ms 无线帧、5 ms 半帧、1 ms 子帧，时隙长度随 $\mu$ 变化：

$$
T_{slot}=\frac{1}{2^{\mu}}\ \text{ms}
$$

每时隙常规 CP 下 14 个符号（扩展 CP 为 12 个）。$\mu$ 每增大 1，时隙数翻倍、时延减半，但对频率选择性与同步精度要求更高——这就是"灵活参数集"的取舍：**用更短符号换更低时延，代价是更短 CP 与更敏感频偏**。

频域资源以**资源块 RB** 为基本单位：1 个 RB = 12 个子载波，$\mu=0\sim3$ 时最大 275 个 RB（$\mu=4$ 为 138，$\mu=5$ 为 69）。资源栅格的索引有三种：**CRB**（公共资源块，以 Point A 为参考的全载波绝对索引）、**PRB**（BWP 内部的局部索引）、**VRB**（DCI 调度指示的中间层，经映射转换为 PRB 以获得频率分集）。**BWP**（带宽部分）让终端只在部分带宽上工作以省电，每个服务小区最多可配置 4 个下行与 4 个上行 BWP。

## 小区搜索：用 SSB 找到基站

UE 开机后第一件事是找 **SSB**（SS/PBCH Block）。一个 SSB 占 4 个 OFDM 符号、240 个子载波，由三部分组成：

- **PSS**：Zadoff-Chu 短序列，完成符号级定时，给出组内 ID $N_{ID}^{(2)}\in\{0,1,2\}$；
- **SSS**：m 序列，完成帧级定时，给出组 ID $N_{ID}^{(1)}\in\{0,\dots,335\}$；
- **PBCH**：承载 MIB，含系统帧号高位、SSB 偏移、子载波间隔与 SIB1 的 PDCCH 配置。

物理小区标识（PCI）由两部分合成，全网共 1008 个（4G 为 504 个）：

$$
N_{ID}^{cell}=3N_{ID}^{(1)}+N_{ID}^{(2)}
$$

小区搜索分三步：**PSS 盲检**（在同步栅格 GSCN 上搜索，得符号定时与 $N_{ID}^{(2)}$）→ **SSS 检测**（得帧定时与 $N_{ID}^{(1)}$，合成 PCI）→ **PBCH 解调**（读 MIB，找到 SIB1 调度位置）。SSB 按 5/10/20/40/80/160 ms 周期发射，一个 burst 内的多个 SSB 在 5 ms 窗口内发完、对应不同波束；Sub-6 GHz 最多 4/8 个 SSB 波束，毫米波可到 64 个。

## 随机接入：从敲门到拿到 C-RNTI

小区搜索只完成下行同步，上行还需要**随机接入**（RACH）：建立上行同步、获取临时标识 C-RNTI、申请上行资源。触发场景包括初始接入、切换、上行失步、无 SR 资源、RRC 重建、请求系统信息等。

随机接入分**竞争型 CBRA**（前导码由 UE 随机选择，可能冲突，用于初始接入）与**非竞争型 CFRA**（前导码由 gNB 专用分配，无冲突，用于切换）。四步流程：

1. **Msg1**：UE 在 PRACH 上发送前导码（64 个 ZC 序列之一），gNB 据此估算传播时延；
2. **Msg2**：gNB 用 PDSCH 回随机接入响应（RAR），含 TA、初始 UL Grant 与临时 C-RNTI；
3. **Msg3**：UE 在 PUSCH 上发 RRCSetupRequest，HARQ 从此步开始生效；
4. **Msg4**：gNB 回竞争解决消息，UE 比对标识成功后临时 C-RNTI 转为正式 C-RNTI。

R16 引入**两步随机接入**：MsgA = 前导码 + PUSCH 负载，MsgB = 竞争解决 + TA + UL Grant，适合小数据包与低时延业务，仅下行 RSRP 超门限时才可选。Msg1 无响应时 UE 按固定步长**功率攀升**重发；TA 让远近不同的 UE 提前发送，使信号到达基站时对齐。

## 波束管理与 HARQ

**波束管理**依赖三类参考信号：SSB（初始接入与波束扫描锚点）、CSI-RS（下行精细测量）、SRS（上行探测）。生命周期为：波束扫描 → 测量判决 → 波束报告 → gNB 波束指示 → 波束失败恢复，扫描按"粗扫到细扫"的漏斗降维。SSB Index 标识小区下的单束，PCI 标识逻辑小区；一个 PCI 可笼罩多个 SSB 波束，也可每波束配独立 PCI。

**HARQ** 是空口可靠性的核心机制，本质是 **FEC + ARQ**：先信道编码纠错，纠不掉再反馈重传。关键是"带着历史错误一起再解一次"——软合并保留失败包的软信息，增量冗余（IR）重传时发送编码比特的不同子集。NR 采用**异步多进程 HARQ**：调度信息携带 process number、NDI、RV（典型顺序 0→2→3→1）与 K0/K1/K2 时序；每小区进程数上限常见为 16（未配置按 8）。

上下行差异要记清：**下行 HARQ 有显式 ACK/NACK 反馈**（通常走 PUCCH，特定条件下可走 PUSCH）；**上行 HARQ 没有独立的显式反馈链路**，UE 是否重传由后续 DCI 是否更新决定。当传输块 TB 很大时，5G 引入 **CBG**（码块组）级 HARQ：TB 拆成多个 CB，CB 再组成 CBG，只重传出错的 CBG，用 CBGTI/CBGFI 指示，大幅节省大 TB 场景的重传开销。分层上，HARQ 最快、RLC AM 较慢但更稳、PDCP 负责跨网元（切换、双连接）的数据恢复。

## 测量、RRC 三态与切换

NR 的 RRC 状态有三个：**RRC_IDLE**（空闲，无上下文，小区选择/重选）、**RRC_INACTIVE**（5G 新增，保留部分上下文，恢复快且省电）、**RRC_CONNECTED**（连接态，业务收发与切换控制）。三态之间通过 RRC Setup / Release with suspend / Resume 转换。

连接态测量由 gNB 用 RRC 配置四要素：**测量间隙**（何时停下收发测异频）、**报告配置**（周期或事件触发）、**Meas ID**（绑定对象与规则的任务号）、**测量对象**（测哪个频点、用 SSB 还是 CSI-RS）。事件触发的 A 系列门限决定移动性动作：

| 事件 | 触发条件 | 含义 |
| --- | --- | --- |
| A1 | 服务小区 > 门限 | 信号很好，停止异频测量 |
| A2 | 服务小区 < 门限 | 信号变差，开启异频测量 |
| A3 | 邻区 > 服务小区 + 偏移 | 核心切换事件（防乒乓） |
| A4 | 邻区 > 门限 | 备选小区可用于负载均衡 |
| A5 | 服务小区 < 门限且邻区 > 门限 | 最迫切的切换刚需 |
| A6 | 邻区 SCell > 本小区 SCell + 偏移 | 载波聚合辅小区比较 |

异系统事件 **B1**（异系统邻区 > 门限）与 **B2**（本网 < 门限且异网 > 门限）用于 4G/5G 互操作：NSA 下 UE 驻留 4G 锚点后测到 5G 超过 B1 门限即触发辅站添加。切换本质是"测量报告 → 源基站决策 → 目标基站准备 → 终端重配 → 上下文迁移"。

## 端到端接入流程

串起来就是：小区搜索（找 SSB、读 PCI 与 MIB/SIB1）→ 随机接入（Msg1~Msg4，拿 C-RNTI）→ RRC 建立（RRCSetup 与 RRCSetupComplete 携带 NAS）→ 核心网注册（gNB 经 N2 转给 AMF 鉴权，配置 SRB2/DRB）→ PDU 会话建立（AMF 转 SMF，SMF 经 N4 配置 UPF）→ 数据传输。

## 6G 展望

6G 的正式名称是 **IMT-2030**。其架构讨论强调"五面"：**控制面、智能面、数据面、安全面、用户面**，即在传统控制/用户面之外把 AI 与数据能力作为独立面纳入。产业链上游分三类：基础材料（光纤、半导体、高频基材与 PCB、光刻胶）、核心器件（天线与射频、光模块、智能超表面 RIS）、芯片与软件（基带与 AI 芯片、算法与网络软件）。

需要说明：6G 的标准时间表与具体指标仍在演进，本节描述来自课程/竞赛资料，具体结论应结合 3GPP 与 ITU 最新文档核对（待核验）。共性判断是 6G 将继续向"更高频段、更大带宽、更密组网、更强智能"演进，并把安全与智能内生到架构中。

## 工程实践视角：从仿真配置看前传与回传

仿真练习中的配置可当作架构的实例（实际工程以设备手册与设计文件为准）：2G/3G/4G 的 RRU 与天线分离、需天馈跳线，5G 的 AAU 则把 RRU 与天线集成；光模块速率逐代提升（3G 前传约 6G、4G 约 10G、5G 约 25G，回传常用 1.25G/25G）；机房用直流配电柜给 BBU 供电、交流配电柜接市电。理解"逻辑接口"与"物理承载"的对应是读懂 5G 组网的关键。

## 易错点与工程注意

- **NSA 不等于独立组网**：NSA 沿用 EPC、信令锚定 4G；只有 SA 才能完整发挥切片与低时延。
- **PCI 数量**：5G 为 1008 个（336×3），4G 为 504 个，公式 $3N_{ID}^{(1)}+N_{ID}^{(2)}$。
- **SSB 的 4 个符号顺序**是 PSS→PBCH→SSS+PBCH→PBCH，SSB 周期与 SS burst 的 5 ms 窗口不是一回事。
- **上下行 HARQ 不对称**：下行有显式 ACK/NACK，上行靠后续调度隐式判断；Msg3 才开始有 HARQ。
- **A3 是切换主事件**，A1/A2 只是测量开关，A4/A5 用于备选切换。

## 来源与延伸阅读

- [[vault-notes/5g/00-guide|5G 知识库全局导读]]：知识地图与推荐阅读路线；[[vault-notes/5g/fundamentals/01-4g-to-5g-evolution|4G 至 5G 演进]]、[[vault-notes/5g/fundamentals/02-5g-history-applications|5G 历史与应用]]：IMT-2020、NSA Option 3x 与 EN-DC。
- [[vault-notes/5g/architecture/01-layering-overview|分层总览]]、[[vault-notes/5g/architecture/02-5gc-architecture|5GC 架构]]、[[vault-notes/5g/architecture/03-ng-ran-architecture|NG-RAN 架构]]：SBA、C/U 分离、CU/DU/AAU 与接口。
- [[vault-notes/5g/protocols/01-bearer-l1-l2|无线承载]]、[[vault-notes/5g/protocols/02-transport-layer-tunnels|传输层与隧道]]、[[vault-notes/5g/protocols/03-data-link-layer-l2|L2 协议]]、[[vault-notes/5g/protocols/04-nr-standard-specifications|NR 标准规范]]、[[vault-notes/5g/protocols/05-transport-network|承载网与 PDU 会话]]。
- [[vault-notes/5g/phy/01-cell-search|小区搜索]]、[[vault-notes/5g/phy/02-measurements-mobility|测量与移动性]]、[[vault-notes/5g/phy/03-random-access-rach|随机接入]]、[[vault-notes/5g/phy/04-physical-channels-signals|物理信道与信号]]、[[vault-notes/5g/phy/05-air-interface-illustrated|空口图解]]、[[vault-notes/5g/phy/06-ue-access-core-network-flow|UE 接入全流程]]。
- [[vault-notes/5g/harq|HARQ 技术]]、[[vault-notes/5g/6g/01-6g-architecture|6G 架构]]、[[vault-notes/5g/engineering-simulation/02-signal-tower-practice|信号塔工程实践]]。

## 相关阅读

- [[communication/digital-modulation-qpsk|数字调制]]：OFDM、QAM 与自适应调制的理论基础。
- [[communication/communication-signals-and-channel|通信信号与信道]]：香农公式与衰落信道模型。
- [[communication/source-and-channel-coding|信源与信道编码]]：LDPC/Polar 与 HARQ 的分层配合。
- [[communication/synchronization|同步原理]]：PSS/SSS 检测与定时同步的理论出处；[[signal-processing/dft-and-fft|DFT 与 FFT]]：OFDM 的 IFFT/FFT 实现。

<!-- topic-index:start -->
## 移动通信的知识点

### 5G

- [[vault-notes/5g/00-guide|5G知识库全局导读]]
- [[vault-notes/5g/harq|HARQ技术]]

### 5G / fundamentals

- [[vault-notes/5g/fundamentals/01-4g-to-5g-evolution|4G至5G演进知识点]]
- [[vault-notes/5g/fundamentals/02-5g-history-applications|5G历史概览及应用]]
- [[vault-notes/5g/fundamentals/03-5g-learning-guide|5G内容学习指南]]

### 5G / 工程实践

- [[vault-notes/5g/engineering-simulation/01-engineering-simulation|5G工程实践仿真-5G工程实践仿真]]
- [[vault-notes/5g/engineering-simulation/02-signal-tower-practice|5G工程实践仿真-工程实践(信号塔)]]

### 5G / architecture

- [[vault-notes/5g/architecture/01-layering-overview|5G分层总览]]
- [[vault-notes/5g/architecture/02-5gc-architecture|5G核心网(5GC)架构]]
- [[vault-notes/5g/architecture/03-ng-ran-architecture|5G无线接入网(NG-RAN)架构]]

### 5G / protocols

- [[vault-notes/5g/protocols/01-bearer-l1-l2|5G无线承载协议(Bearer) (L1+L2)]]
- [[vault-notes/5g/protocols/02-transport-layer-tunnels|5G传输层与隧道协议]]
- [[vault-notes/5g/protocols/03-data-link-layer-l2|5G数据链路层协议(L2)]]
- [[vault-notes/5g/protocols/04-nr-standard-specifications|5G_NR标准规范]]
- [[vault-notes/5g/protocols/05-transport-network|5G承载网]]

### 5G / 物理层

- [[vault-notes/5g/phy/01-cell-search|5G_NR小区搜索过程]]
- [[vault-notes/5g/phy/02-measurements-mobility|5G核心测量与移动性]]
- [[vault-notes/5g/phy/03-random-access-rach|5G随机接入过程(RACH)]]
- [[vault-notes/5g/phy/04-physical-channels-signals|5G物理层信道与信号]]
- [[vault-notes/5g/phy/05-air-interface-illustrated|5G空口技术图解解析]]
- [[vault-notes/5g/phy/06-ue-access-core-network-flow|5GUE接入核心网的全流程]]

### 5G / 6G

- [[vault-notes/5g/6g/01-6g-architecture|6G架构]]

<!-- topic-index:end -->
