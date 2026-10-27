---
title: "5G物理层信道与信号"
created: '2026-08-14'
date: '2026-03-27'
author: Obsidian Note Bot
tags:
- 5G
- 物理层
- 信道
- 信号
- DCI
type: concept
subjects:
- 5G
domains:
- 通信与信息
- 物理层
status: learning
aliases: []
prerequisites: []
related: []
---


# 📡 5G物理层信道与信号解析

> [!abstract] 📌 核心导读
> 本文系统梳理了5G物理层（PHY）中的重要通道和标识集合，包括**下行/上行物理信道**的作用与最大调制方式、**DCI格式（下行控制信息）**分类，以及四大类**物理参考信号**的核心场景。理解它们是掌握空口协议的关键！

---

## 🔀 1. 上下行物理传输过程概述

> [!tip] ⚙️ 核心处理流
> 无论是基站（gNB）发往下行，还是终端（UE）发往上行，物理层的核心任务都是：
> **MAC层传输块** ➔ **CRC添加** ➔ **LDPC编码(并分段)** ➔ **速率匹配** ➔ **加扰/调制** ➔ **资源映射** ➔ **生成OFDM(或SC-FDMA)符号** ➔ **射频天线发送**。
>
> *(注：上行传输为了降低峰均比 PAPR，在调制之后会多出一步可选的 **变换预编码 (DFT扩展)**，产生 SC-FDMA 波形。)*

---

## 🛣️ 2. 主要物理信道解析

物理信道是承载底层信息（包括业务数据、控制信息、系统广播等）的车道。

### 2.1 下行物理信道 (gNB ➔ UE)

| 信道简称 | 全称 | 承载内容 | 最大调制方式 | 📝 核心说明 |
| :--- | :--- | :--- | :--- | :--- |
| **==PDSCH==** | 物理下行共享信道 | 用户数据、寻呼、系统信息 | **256-QAM / 1024-QAM** | 速率最高的下行信道；基础最大256QAM，Rel-16起支持1024QAM（需网络配置） |
| **==PDCCH==** | 物理下行控制信道 | 下行控制信息（DCI） | **QPSK** | 控制信息要求极高可靠性，**只使用QPSK**，不追求高阶调制。 |
| **==PBCH==** | 物理广播信道 | 主信息块（MIB） | **QPSK** | 需全小区覆盖，与 SS/PBCH Block (SSB) 强绑定。 |

### 2.2 上行物理信道 (UE ➔ gNB)

| 信道简称 | 全称 | 承载内容 | 最大调制方式 | 📝 核心说明 |
| :--- | :--- | :--- | :--- | :--- |
| **==PUSCH==** | 物理上行共享信道 | 用户数据(也可Piggyback带UCI) | **64-QAM / 256-QAM** | 基础最大64-QAM，高能力终端经授权支持 256-QAM。 |
| **==PUCCH==** | 物理上行控制信道 | 上行控制信息（UCI: 如HARQ/SR/CSI） | **QPSK** | 控制信息求稳，Format 0~4 均基于QPSK（部分简易格式用BPSK等）。 |
| **==PRACH==** | 物理随机接入信道 | 随机接入前导码 (Msg1/MsgA) | **无调制(波形序列)** | 传输Zadoff-Chu序列前导码，不走传统星座图调制。 |

### 2.3 各类信道常见 format / 结构形式

> [!note] 先分清两件事
> 不是所有信道都像 PUCCH 那样直接叫“Format 0/1/2/3/4”。
> **有些信道的“格式”是 3GPP 明确命名的物理格式，有些则主要体现为 DCI 格式、映射类型、Preamble Format 或 SSB 配置。**

| 信道 / 信号 | 常见 format 或结构名 | 说明 |
| :--- | :--- | :--- |
| **PDCCH** | **DCI Format 0_0 / 0_1 / 0_2 / 1_0 / 1_1 / 1_2 / 2_0 / 2_1 / 2_2 / 2_3** | PDCCH 本身承载 DCI，因此它最典型的“格式”就是 DCI 格式。 |
| **PUCCH** | **Format 0 / 1 / 2 / 3 / 4** | 最标准、最常被考的 format 之一；不同 format 对应不同 UCI 比特数、符号数和资源占用。 |
| **PRACH** | **Preamble Format 0 / 1 / 2 / 3 / A1 / A2 / A3 / B1 / B2 / B3 / B4 / C0 / C2** | 随机接入前导格式，按长序列 / 短序列和 FR1 / FR2 进行区分。 |
| **PDSCH** | **Mapping Type A / B**、Time-domain allocation row、MCS Table | PDSCH 不以“Format 0/1”命名，更多是看映射类型、时域资源分配和 MCS。 |
| **PUSCH** | **Mapping Type A / B**、Transform Precoding、DMRS 配置 | PUSCH 同样不是固定 format 命名，更关注 DCI 授权、映射、预编码和 UCI 复用。 |
| **PBCH** | **SSB / SS-PBCH Block** | PBCH 通常与 SSB 作为一个整体出现，不单独叫“Format”。 |

> [!tip] 一句话记忆
> **PUCCH 看 Format，PDCCH 看 DCI Format，PRACH 看 Preamble Format，PDSCH/PUSCH 看映射和调度参数，PBCH 归在 SSB 里看。**

### 2.4 各类信道格式与业务关系

| 信道 | 常见格式层面的关注点 | 你在工程里主要看什么 |
| :--- | :--- | :--- |
| **PDCCH** | DCI 格式、搜索空间、CORESET | 这条控制链路给谁发调度，发什么资源。 |
| **PUCCH** | Format 0~4、resource set、resource、OCC | 这条上行控制链路怎么装 HARQ / SR / CSI。 |
| **PRACH** | Preamble Format、configuration index、RA occasion | 终端怎么敲门，在哪个时频位置敲门。 |
| **PDSCH** | Mapping Type、VRB/PRB、MCS、DMRS、TCI | 下行数据如何被打包、映射和解调。 |
| **PUSCH** | Transform Precoding、K2、MCS、UCI multiplexing | 上行数据如何调度、是否携带 UCI、如何做功率和资源分配。 |
| **PBCH / SSB** | SSB periodicity、bitmap、beam sweeping | 基站如何做初始同步和波束广播。 |

---

## 🎛️ 3. DCI (下行控制信息) 格式深度剖析

**DCI (Downlink Control Information)** 是基站下发给UE的“调度圣旨”，通过 `PDCCH` 传输。主要分为三大类场景：

> [!info] 💡 DCI 格式命名规律
> `0_x` 系列管 **上行调度(UL)**，`1_x` 系列管 **下行调度(DL)**，`2_x` 系列管 **特殊控制**。

### 3.1 DCI Format 1_x（下行调度：分发下行资源）
- 🟢 **DCI Format 1_0 (公共/Fallback)**
  - 适用所有UE，兼容性最强。用于 **下行公共调度**（如寻呼Paging、系统消息、随机接入RAR），或作为 Fallback(回退)调度使用。
- 🔵 **DCI Format 1_1 (专用业务)**
  - 面向单UE的大数据量下行调度。支持精细资源分配、MIMO配置、高阶调制，是5G **主流下行调度格式**。

### 3.2 DCI Format 0_x（上行调度：分配上行发送资源）
- 🟢 **DCI Format 0_0 (公共/Fallback)**
  - 适用所有UE。用于 **上行公共/后备调度** (如 grant-free 接入或 Msg3重传调度)。
- 🔵 **DCI Format 0_1 (专用业务)**
  - 面向单UE的 **主流上行调度**。支持高级资源分配和上行MIMO。

### 3.3 DCI Format 2_x（特殊管理指令）
此系列均用于极简但重要的公共网络管理。
- 🕒 **Format 2_0**: **时隙格式指示 (SFI)**。动态告知UE当前时隙里哪些符号是UL、哪些是DL、哪些是Flexible。
- 🚧 **Format 2_1**: **PRB占用指示 (Preemption)**。告知当前正在传数据的低优UE：部分RB正被高优特权UE(如URLLC)抢占抢发，请避开/重算。
- 🔋 **Format 2_2**: 发送给 PUCCH/PUSCH 的组 **功率控制(TPC)命令**。
- 📡 **Format 2_3**: 发送给 **SRS (探测参考信号)** 的专属功率控制命令 (Rel-16新增)。

---

## 🔦 4. 物理参考信号 (Reference Signals)

信号(Signal)与信道(Channel)的最大区别是：**信号内不承载高层(MAC/RRC)的实际比特数据**，纯粹用于物理层的测量、同步和解调辅助。

| 信号简称 | 全称 | 核心目标与作用 |
| :--- | :--- | :--- |
| **==PSS / SSS==** | 主/辅同步信号 | **小区初始搜索**，获取物理小区ID (PCI) 以及时频同步。 |
| **==CSI-RS==** | 信道状态信息参考信号 | **下行信道测量**、波束管理、跟踪干扰/信道质量。 |
| **==DM-RS==** | 解调参考信号 | 接收端用来估算信道以 **解调(解码)** 被伴随的物理信道数据。 |
| **==PT-RS==** | 相位跟踪参考信号 | 主要针对毫米波高频段：**补偿致命的相位噪声**。 |
| **==SRS==** | 探测参考信号 | UE发给基站，用于基站对 **上行信道进行探测和测量**。 |

### 4.1 SSB / SS-PBCH Block（同步信号块）

> [!abstract] SSB 是什么
> **SSB (SS/PBCH Block)** 是基站发给终端的“初始见面包”。它把 **PSS + SSS + PBCH + PBCH DMRS** 封装成一个整体，用于小区发现、下行同步、PCI 识别以及初始接入。

| 组成部分 | 作用 | 说明 |
| :--- | :--- | :--- |
| **PSS** | 主同步 | 帮 UE 先找到帧内粗同步和部分小区信息。 |
| **SSS** | 辅同步 | 与 PSS 配合，帮助 UE 确认 PCI。 |
| **PBCH** | 广播主信息 | 携带 MIB 的核心广播内容。 |
| **PBCH DMRS** | 解调辅助 | 帮 UE 解 PBCH。 |

> [!tip] SSB 的核心用途
> 1. **初始小区搜索**：UE 开机后先找 SSB。
> 2. **获得 PCI 和同步**：通过 PSS/SSS 定位物理小区标识并完成时频同步。
> 3. **波束管理**：一个 SS burst 里通常会发多个 SSB，每个 SSB 对应不同 beam，用于 beam sweeping。

#### SSB 的几个关键特征

- **周期性**：SSB 按固定周期发射，常见为 **5 / 10 / 20 / 40 / 80 / 160 ms**，其中 **20 ms** 很常见。
- **连续数量**：一个 burst 中可包含多个 SSB，FR1 常见最多 **4 或 8**，FR2 可到 **64**。
- **bitmap 配置**：网络通过 `ssb-PositionsInBurst` 指示哪些 SSB 会发、哪些不发。
- **频域位置**：SSB 不一定在载波正中心，位置可配置，便于网络和波束策略灵活部署。

> [!note] 一句话记忆
> **SSB = “PSS 找方向，SSS 找身份，PBCH 发公告，DMRS 帮解调”。**

#### SSB 与波束扫描

```mermaid
flowchart LR
  A[基站发多个 SSB] --> B[每个 SSB 对应不同 beam]
  B --> C[UE 测量各 SSB 强度]
  C --> D[选出最强 SSB]
  D --> E[确定最佳接入波束]
```

> [!important] 波束扫描的意义
> 在 FR2 或大规模天线场景下，SSB 不只是同步信号，还承担 **波束发现与波束选择** 的任务。

> [!important] 📡 DMRS 与 MIMO 的关系
> DMRS天线端口数量取决于被它关联的 `PDSCH` 传输模式：
> - **单用户 SU-MIMO**：最大支持 **12个** 端口。
> - **多用户 MU-MIMO**：最大支持 **24个** 端口。

---

## 🗺️ 5. 三大信道映射关系网 (逻辑 ➔ 传输 ➔ 物理)

> [!note] 🧠 秒懂信道分层
> 1. **系统把信息比作包裹** 📦
> 2. **逻辑信道 (MAC与RLC间)** = 定义 `传输什么信息`（是账单还是情书？）
> 3. **传输信道 (MAC与PHY间)** = 定义 `怎么传`（要走平信、挂号信还是加急空运？）
> 4. **物理信道 (纯PHY层)** = 定义 `实际走哪条路`（卡车公路、高铁航线？）

### 📦 核心下行映射
```text
逻辑信道(MAC以上)       传输信道(MAC-PHY)         物理信道(纯PHY)
广播控制(BCCH)    ──→    BCH             ──→    PBCH      (系统最基础广播)
广播控制(BCCH)    ──→    DL-SCH          ──→    PDSCH     (含其他SIB系统信息)
寻呼控制(PCCH)    ──→    PCH             ──→    PDSCH     (提醒UE接电话)
通用信道(CCCH等)  ──→    DL-SCH          ──→    PDSCH     (一切核心控制与业务数据统包)
```

### 🚀 核心上行映射
```text
逻辑信道(MAC以上)       传输信道(MAC-PHY)         物理信道(纯PHY)
通用信道(CCCH等)  ──→    UL-SCH          ──→    PUSCH     (一切上行响应与业务数据统包)
(无明确逻辑对应)  ──→    RACH            ──→    PRACH     (纯底层敲门砖/前导码)
```

---

## 🧪 6. 刷题补充

> [!info] 高频细节
> 这一段把常见的题目口径补齐，和 刷题知识点汇总 的条目互相对应。

- **PCH 的信息** 需要通过 **PDSCH** 进行传输，这也是为什么寻呼本质上仍然跑在下行共享信道上。
- **PUCCH Format 2** 属于短 PUCCH，常用于 **UCI 比特数 > 2** 的场景；其频域占用参数是 `nrofPRBs`，配置范围通常为 **1~16**。
- **PUCCH / PUSCH 与 UCI** 的关系是：UCI 可以按配置走 PUCCH，也可以复用到 PUSCH；工程上常结合 DCI、UCI 比特数和资源集来选择。
- **SRS SNR** 是上行信号质量的重要指标，常用于和 PMI / Rank 相关的自适应判断。
- **PUCCH spatial relation** 可以参考 **SSB / CSI-RS / SRS**，适合和波束、参考信号一起记。

---

**关联**：[[vault-notes/5g/00-guide]]｜[[vault-notes/5g/phy/05-air-interface-illustrated]]｜[[vault-notes/5g/harq]]｜[[vault-notes/5g/protocols/04-nr-standard-specifications]]