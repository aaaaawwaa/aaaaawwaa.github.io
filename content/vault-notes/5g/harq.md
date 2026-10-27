---
title: "HARQ技术"
created: 2026-03-30
date: 2026-03-30
author: Obsidian Note Bot
tags:
- 5G
- HARQ
- MAC
- PHY
- 可靠性
- 复用与重传
type: concept
subjects:
- 5G
- 通信原理
domains:
- 通信与信息
- 可靠性
status: learning
aliases: []
prerequisites: []
related: []
---


# 🚦 HARQ 技术详解

> [!abstract] 📌 核心导读
> **HARQ 是 5G 里“先快速纠错，再必要时重传”的底层可靠性机制。**
> 它把 **FEC（前向纠错）** 和 **ARQ（自动重传请求）** 结合起来，在物理层附近完成低时延、低开销的可靠传输。本文按照“基本概念 → 5G NR HARQ 进程与 DCI → 下行 HARQ → 上行 HARQ → 基于 CBG 的 HARQ”逐层展开。

---

## 1. HARQ 的基本概念

> [!info] HARQ 是什么
> **HARQ (Hybrid Automatic Repeat reQuest，混合自动重传请求)** = **FEC + ARQ**。
> 它先依靠信道编码尽量纠错；如果仍然解不出来，再由接收端发出反馈请求重传。

### 1.1 为什么叫“Hybrid”

HARQ 的“Hybrid”不是一个额外的新协议，而是指它把两种机制揉在了一起：

| 机制 | 作用 | 在 HARQ 中的角色 |
| :--- | :--- | :--- |
| **FEC** | 通过冗余比特进行前向纠错 | 第一层保险，先尽量把错误直接纠正掉 |
| **ARQ** | 接收端发现错包后请求重传 | 第二层保险，纠正 FEC 无法覆盖的剩余错误 |

### 1.2 HARQ 的核心特点

> [!tip] 一句话抓住本质
> **HARQ 不只是“重传”，而是“带着历史错误一起再解一次”。**

- **软合并 (Soft Combining)**：接收端不会把错误包直接丢掉，而是保留在缓存里，和后续重传版本一起合并解码。
- **增量冗余 (Incremental Redundancy, IR)**：重传时不一定发完全相同的数据，而是发原始编码比特的不同子集，提高再次解码成功率。
- **停止等待 (Stop-and-Wait)**：一个 HARQ 进程在等待反馈时，不会无限制地继续同一包；5G 通过多个并行进程减少资源空转。

### 1.3 HARQ 与 RLC / PDCP 的区别

> [!note] 分层重传的分工
> **HARQ 快，RLC 稳，PDCP 跨网元。**

| 层级 | 反馈速度 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- |
| **HARQ** | 最快 | 物理层附近、低时延链路 | 针对单次传输失败做快速修正 |
| **RLC AM** | 较慢 | 可靠性要求高的逻辑信道 | 面向逻辑信道级别的重传 |
| **PDCP** | 更上层 | 切换、双连接、跨基站场景 | 负责更高层的数据转发与恢复 |

```mermaid
flowchart LR
	A[发送 TB / PDU] --> B[FEC 编码]
	B --> C{CRC 是否通过?}
	C -- 是 --> D[ACK]
	C -- 否 --> E[NACK / 重传请求]
	E --> F[保留软信息]
	F --> G[增量冗余重传]
	G --> H[软合并后重新译码]
```

---

## 2. 5G NR 中的 HARQ 技术

### 2.1 5G HARQ 进程概述

> [!abstract] 5G NR 的 HARQ 进程
> 5G NR 采用 **多进程、异步 HARQ**。同一小区内，MAC 层会维护多个 HARQ process，每个进程一次只处理一个 TB，但可以并行运行多个进程。

- **异步 HARQ**：传输和重传不是固定死的，调度器可以按需安排。
- **进程编号**：调度信息里会明确携带 HARQ process number，终端和基站都要靠它区分不同 TB 的历史状态。
- **最大进程数**：NR 中每个 serving cell 的 HARQ 进程数可配置，常见上限为 **16**；若未显式配置，通常按 8 处理。
- **缓冲策略**：接收端会保留失败包的软比特，等待后续 RV 版本合并。

### 2.2 HARQ 的关键控制字段

| 字段 | 作用 | 你可以把它理解成 |
| :--- | :--- | :--- |
| **HARQ process number** | 标识当前属于哪个进程 | “这份包裹是第几号队列” |
| **NDI** (New Data Indicator) | 指示新传输还是重传 | “是不是新包” |
| **RV** (Redundancy Version) | 指示本次发送的冗余版本 | “这次换哪一批冗余比特” |
| **K0 / K1 / K2** | 发送与反馈的时间偏移 | “从调度到发送 / 反馈隔多少个 slot” |
| **DAI** | 反馈码本相关信息 | “这次要回多少个 ACK/NACK” |
| **CBGTI / CBGFI** | CBG 重传控制位 | “哪些 CBG 需要重传 / 是否清空” |

### 2.3 HARQ 的时序关系

> [!warning] 5G NR 和 LTE 的关键差异
> LTE 的下行/上行 HARQ 时序更固定，而 NR 把反馈时序做得更灵活，尤其适合动态 TDD 和 URLLC。

```mermaid
flowchart TD
	A[DCI 调度下发] --> B[数据传输
PDSCH / PUSCH]
	B --> C[CRC 检查]
	C --> D{成功?}
	D -- 是 --> E[ACK]
	D -- 否 --> F[NACK]
	E --> G[释放该 HARQ 进程]
	F --> H[软缓存保留]
	H --> I[按照 RV 重传]
	I --> B
```

### 2.4 DCI 格式

> [!info] DCI 里装的是什么
> **DCI (Downlink Control Information)** 是 HARQ 调度的直接入口。它不仅告诉 UE 何时发 / 收，还会携带 HARQ 所需的过程号、RV、NDI 和反馈相关字段。

| DCI 格式 | 主要方向 | 作用 | 与 HARQ 相关的字段 |
| :--- | :--- | :--- | :--- |
| **0_0** | 上行调度 | 为 PUSCH 分配资源 | HARQ process number、NDI、RV、K2 |
| **0_1** | 上行调度 | 更灵活的上行授权 | HARQ process number、NDI、RV、DAI 等 |
| **1_0** | 下行调度 | 为 PDSCH 分配资源 | HARQ process number、NDI、RV、K1 |
| **1_1** | 下行调度 | 更灵活的下行授权 | HARQ process number、NDI、RV、K1、DAI |
| **1_2 / 0_2** | 增强调度 | 适合更复杂场景和 Release 16 之后能力 | 进程号、反馈和码本相关字段 |

> [!tip] 记忆法
> **0 开头管上行，1 开头管下行；NDI 看新旧，RV 看版本，K1/K2 看时序。**

---

### 2.5 下行 HARQ

> [!abstract] 下行 HARQ 的主链路
> 下行 HARQ 发生在 **gNB 发 PDSCH，UE 回 ACK/NACK** 这条链路上。

1. **gNB 下发 PDSCH**：通过 DCI 告诉 UE 这次调度属于哪个 HARQ process、采用哪个 RV、何时反馈。
2. **UE 译码与 CRC 检查**：UE 解码 PDSCH，并做 CRC 判断。
3. **反馈 ACK / NACK**：
   - 解码成功则发送 **ACK**。
   - 解码失败则发送 **NACK**。
4. **gNB 决定是否重传**：若需要重传，则使用新的 RV 版本再次发送。
5. **UE 软合并**：UE 会把本次接收和此前失败的软信息合并再解码。

> [!note] 常见反馈信道
> 下行 HARQ 的反馈通常走 **PUCCH**，也可以在特定条件下走 **PUSCH**。

**典型 RV 发送顺序：** `0 -> 2 -> 3 -> 1`

**你可以这样理解：**
- `RV0` 先发原始信息最完整的一版。
- 后续重传发不同冗余片段，帮助译码器逐步恢复。

### 2.6 上行 HARQ

> [!abstract] 上行 HARQ 的主链路
> 上行 HARQ 发生在 **UE 发 PUSCH，gNB 判断是否成功** 这条链路上。

1. **gNB 先下发授权**：UE 按 DCI 获得上行发送资源。
2. **UE 发 PUSCH**：携带业务数据上行。
3. **gNB CRC 检查**：基站解码 PUSCH，判断是否成功。
4. **重传由 gNB 决定**：如果失败，gNB 会通过后续调度再次让 UE 发送。
5. **UE 不直接等显式 ACK**：与下行不同，上行没有独立的空气接口 ACK/NACK 反馈信道。

> [!important] 上行 HARQ 的核心差异
> **NR 上行 HARQ 没有单独的显式 ACK/NACK 反馈链路。**
> UE 是否继续发送、是否重传，取决于后续 DCI 和调度授权是否更新。

---

## 3. 基于 CBG 的 HARQ

> [!info] 为什么要有 CBG
> TB 越来越大时，如果只有 TB 级重传，一旦只有少量比特出错，就得整块 TB 重发，浪费频谱资源。于是 5G NR 引入 **CBG (Code Block Group，码块组)**，把 TB 拆成更小的重传粒度。

### 3.1 TB、CB、CBG 的关系

| 层级 | 含义 | 作用 |
| :--- | :--- | :--- |
| **TB** (Transport Block) | 一次调度的运输块 | MAC PDU 所在的大容器 |
| **CB** (Code Block) | 编码后的码块 | 便于信道编码和 CRC 保护 |
| **CBG** (Code Block Group) | 码块组 | 允许只重传有问题的部分 |

> [!tip] 记忆顺序
> **MAC 看到的是 TB，编码层拆成 CB，HARQ 可以进一步按 CBG 局部重传。**

### 3.2 CBG HARQ 的好处

- **降低重传开销**：只重传有问题的码块组，而不是整个 TB。
- **适合大 TB**：TB 越大，CBG 的节省效果越明显。
- **更适合 URLLC / eMBB 共存场景**：既保留可靠性，又不至于占用过多资源。

### 3.3 CBG 相关控制信息

| 字段 | 含义 | 作用 |
| :--- | :--- | :--- |
| **CBGTI** | CBG Transmission Indicator | 指定哪些 CBG 需要发送 / 重传 |
| **CBGFI** | CBG Flush Indicator | 指示对应缓存是否清空 |
| **CBG HARQ-ACK codebook** | CBG 反馈码本 | 用于告诉基站哪些 CBG 成功、哪些失败 |

> [!note] 一个实用判断
> **TB 级 HARQ 关注“整块是否成功”，CBG 级 HARQ 关注“哪一组失败了”。**

### 3.4 TB 与 CBG 的对比

| 对比项 | TB 级 HARQ | CBG 级 HARQ |
| :--- | :--- | :--- |
| 重传粒度 | 整个 TB | 部分 CBG |
| 资源效率 | 一般 | 更高 |
| 控制复杂度 | 较低 | 更高 |
| 适用场景 | 普通业务 | 大 TB、大吞吐、精细化可靠性控制 |

---

## 4. 一张图看懂 HARQ

```mermaid
flowchart LR
	A[DCI 调度] --> B[发送 PDSCH / PUSCH]
	B --> C[UE / gNB 译码]
	C --> D{CRC 成功?}
	D -- 是 --> E[ACK
释放进程]
	D -- 否 --> F[NACK
保留软缓存]
	F --> G[选择 RV 重传]
	G --> H[软合并 / 增量冗余]
	H --> C

	B -. 下行反馈 .-> I[PUCCH / PUSCH]
	B -. 上行重传 .-> J[gNB 继续调度]
```

---

## 5. 复习速记

> [!tip] 四句总结
> - **HARQ = FEC + ARQ**，核心是“先纠错，再重传”。
> - **NR HARQ 是异步多进程**，调度灵活，适合动态 TDD。
> - **下行 HARQ 有 ACK/NACK 反馈，上行 HARQ 主要靠 gNB 决定重传。**
> - **TB 太大时用 CBG，避免整块重传浪费资源。**

---

## 6. 参考资料

1. [ShareTechnote - 5G/NR HARQ](https://www.sharetechnote.com/html/5G/5G_HARQ.html)
2. [Devopedia - 5G NR Hybrid ARQ](https://devopedia.org/5g-nr-hybrid-arq)
3. [3GPP TS 38.212 / 38.214 / 38.321](https://www.3gpp.org/)

---

**关联**：[[vault-notes/5g/00-guide]]｜[[vault-notes/5g/phy/04-physical-channels-signals]]｜[[vault-notes/5g/protocols/03-data-link-layer-l2]]｜[[vault-notes/communication/11-error-control-coding]]
