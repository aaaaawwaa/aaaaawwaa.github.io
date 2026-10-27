---
title: "5G无线承载协议(Bearer) (L1+L2)"
aliases:
- 5G Bearer 机制
created: '2026-04-04'
tags:
- 5G
- 无线承载
- SRB
- DRB
- QoS
author: Obsidian Note Bot
date: '2026-04-04'
type: concept
subjects:
- 5G
domains:
- 通信与信息
- 协议栈
status: learning
prerequisites: []
related: []
---

# 📦 5G无线承载（Bearer）机制

> [!abstract] 📌 核心导读
> Bearer 是 5G 无线侧的数据“逻辑车道”：控制面走 SRB，用户面走 DRB。
> 本文重点说明 SRB/DRB 与 QoS Flow、SDAP、PDCP、RLC、MAC 的映射关系。

> [!info] 💡 记忆抓手
> ==QoS Flow 是核心网业务粒度，DRB 是无线侧承载粒度==；二者通过 SDAP 建立映射。

## 🧭 一、什么是无线承载

无线承载可以理解为“逻辑车道”。不同业务不会直接裸奔在空口上，而是通过承载机制进入合适的传输路径。

- 控制消息走 SRB
- 用户数据走 DRB
- QoS 决定业务应该绑定到哪条承载

## 🗂️ 二、承载与标准的关系

| 视角  | 关键对象             | 说明                  |
| --- | ---------------- | ------------------- |
| 核心网 | QoS Flow         | 业务优先级和策略的起点         |
| **接入网** | **DRB**              | **无线侧真正承载数据的通道**        |
| **控制面** | **SRB**              | **承载 RRC / NAS 相关控制信息** |
| 空口层 | PDCP / RLC / MAC | 把承载落到实际传输链路         |

## 🔀 三、SRB 与 DRB

| 承载类型 | 含义                     | 用途               |
| ---- | ---------------------- | ---------------- |
| **SRB**  | **Signaling Radio Bearer** | **承载 RRC、NAS 等控制信令** |
| **DRB**  | **Data Radio Bearer**      | **承载用户面数据**          |

### SRB 的典型划分

- SRB0：初始接入相关的最基础控制承载
- SRB1：RRC 连接建立后常用的控制承载
- SRB2：更偏向承载 NAS 相关控制信息
- SRB3：特定增强场景下的附加控制承载

## 🔄 四、QoS Flow 到 DRB 的映射

5G 的关键变化之一，是把核心网里的 QoS Flow 映射到无线侧 DRB。

- 一个 DRB 可以承载一个或多个 QoS Flow
- 不同 QoS Flow 可以在调度和优先级上做区分
- 这样可以支持语音、视频、工业控制等不同业务类型

## 🧱 五、与协议栈的关系

- QoS Flow 先进入 SDAP
- 再映射到 DRB
- DRB 经过 PDCP、RLC、MAC 进入物理层

## ✅ 六、相关笔记

> [!important] 面试高频问法
> - SRB0/1/2/3 分别在什么阶段常见？
> - 为什么说 QoS Flow 与 DRB 不是一一固定关系？
> - BSR / SR / UL Grant 与 Bearer 调度有什么关系？

- [[vault-notes/5g/protocols/03-data-link-layer-l2|5G 数据链路层协议 (L2)]]
- [[vault-notes/5g/architecture/02-5gc-architecture|5G 核心网 (5GC) 架构]]

---

**关联**：[[vault-notes/5g/00-guide]]｜[[vault-notes/5g/architecture/01-layering-overview]]｜[[vault-notes/5g/protocols/05-transport-network]]
