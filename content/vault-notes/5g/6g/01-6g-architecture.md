---
title: "6G架构"
created: '2026-04-13'
tags:
- 5G
- 6G
- 网络架构
type: concept
subjects:
- 5G
- 6G
domains:
- 通信与信息
- 网络架构
status: learning
aliases: []
prerequisites: []
related: []
---

# 🌐 6G 网络架构与产业链

> [!abstract] 本页在讲什么
> 6G 的“五面”架构（控制 / 智能 / 数据 / 安全 / 用户）与产业链上游的材料、器件、芯片与软件。

6G网络架构的5面包括: **控制面,智能面,数据面,安全面,用户面**
6G网络不包括: 毫秒级的时延体验
6G产业链的上游是整个技术体系的地基，主要涵盖**基础材料、核心器件、芯片与软件**三大核心领域，为6G网络的性能突破提供关键支撑
```mermaid
flowchart LR
    A[6G上游行业] --> B1[基础材料]
    A --> B2[核心器件]
    A --> B3[芯片与软件]

    B1 --> C1[光通信材料<br>如：长飞光纤、光库科技]
    B1 --> C2[半导体材料<br>如：三安光电、云南锗业]
    B1 --> C3[高频基材与PCB<br>如：生益科技、本川智能]
    B1 --> C4[高端光刻胶<br>如：南大光电、彤程新材]

    B2 --> C5[天线与射频器件<br>如：通宇通讯、信维通信]
    B2 --> C6[光模块与器件<br>如：中际旭创、光迅科技]
    B2 --> C7[智能超表面RIS<br>如：光启技术、通宇通讯]

    B3 --> C8[基带与AI芯片<br>如：华为海思、中兴微电子]
    B3 --> C9[算法与网络软件<br>如：中兴通讯、创远信科]
```

---

**关联**：[[vault-notes/5g/00-guide]]｜[[vault-notes/5g/fundamentals/03-5g-learning-guide]]｜[[vault-notes/5g/fundamentals/02-5g-history-applications]]

