---
title: "5GUE接入核心网的全流程"
created: '2026-04-18'
tags:
- 5G
- 物理层
- 空口技术
type: concept
subjects:
- 5G
domains:
- 通信与信息
- 流程
status: learning
aliases: []
prerequisites: []
related: []
---

# 🔄 5G UE 接入核心网的全流程

> [!abstract] 本页在讲什么
> 这张时序图把「小区搜索 → RACH → RRC 建立 → 注册 → PDU 会话建立」串成一条端到端流程，适合和 [[vault-notes/5g/phy/03-random-access-rach]]、[[vault-notes/5g/phy/01-cell-search]] 对照阅读。

> [!tip] 关联
> [[vault-notes/5g/00-guide]]｜[[vault-notes/5g/phy/03-random-access-rach]]｜[[vault-notes/5g/phy/01-cell-search]]｜[[vault-notes/5g/architecture/02-5gc-architecture|5GC 架构]]

```mermaid
sequenceDiagram
    autonumber
    participant UE as 📱 UE (用户设备)
    participant gNB as 📡 gNB (基站)
    participant AMF as 🧠 AMF (核心网控制面)
    participant UPF as 🌐 UPF (核心网用户面)

    Note over UE, gNB: 第一阶段：物理层与链路层接入 (接入网)

    %% RACH 过程
    rect rgb(240, 248, 255)
        Note right of UE: 随机接入 (RACH)<br/>发生在物理层(PHY)与MAC层
        UE->>gNB: Msg1: 发送前导码 (Preamble)
        gNB-->>UE: Msg2: 随机接入响应 (RAR)<br/>(分配上行资源, 时间提前量)
        UE->>gNB: Msg3: 调度传输<br/>(包含 RRCSetupRequest)
        gNB-->>UE: Msg4: 竞争解决 (Contention Resolution)
    end

    %% RRC 建立
    rect rgb(255, 250, 240)
        Note right of UE: RRC 连接建立<br/>发生在 RRC 层 (L3)
        gNB-->>UE: RRCSetup: 建立信令无线承载 (SRB1)
        UE->>gNB: RRCSetupComplete<br/>(包含 NAS: Registration Request)
    end

    Note over UE, AMF: 第二阶段：核心网注册 (控制面)

    %% 核心网交互
    rect rgb(240, 255, 240)
        Note right of gNB: NGAP 传输<br/>gNB 通过 N2 接口转发 NAS 消息
        gNB->>AMF: 初始 UE 消息 (Initial UE Message)
        
        Note over AMF: 鉴权与安全<br/>(AMF <-> AUSF/UDM)
        
        AMF->>gNB: 初始上下文建立请求<br/>(包含安全密钥, PDU会话信息)
        gNB-->>UE: RRC Reconfiguration<br/>(配置 SRB2, DRB, 安全激活)
        UE->>gNB: RRC Reconfiguration Complete
        gNB->>AMF: 初始上下文建立响应
    end

    Note over UE, UPF: 第三阶段：PDU 会话建立 (用户面)

    %% PDU 会话
    rect rgb(255, 240, 245)
        UE->>AMF: NAS: PDU Session Establishment Request<br/>(通过 RRC 透传)
        AMF->>SMF: 创建会话请求 (Nsmf_PDUSession_Create)
        SMF->>UPF: 建立 N4 会话 (配置规则)
        SMF-->>AMF: 会话创建响应
        AMF-->>UE: NAS: PDU Session Establishment Accept
    end

    Note over UE, UPF: ✅ 接入完成，数据流开始传输


```
