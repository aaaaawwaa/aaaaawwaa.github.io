---
title: "5G数据链路层协议(L2)"
aliases:
- 5G L2 协议栈
created: '2026-04-04'
tags:
- 5G
- 数据链路层
- L2
- MAC
- RLC
- PDCP
- SDAP
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

# 🔗 5G协议栈与数据链路层（L2）

数字链路层在核心网的下层,负责将


> [!abstract] 📌 核心导读
> L2 是 5G 空口里“把数据真正送出去”的关键层，负责 QoS 映射、加密完整性、分段重组和调度重传。
> 学习重点：==SDAP、PDCP、RLC、MAC 四层分工==。

> [!tip] ⚙️ 先记一个总关系
> 3GPP TS 38.300 给全景，TS 38.321 看 MAC 调度，TS 38.331 看 RRC 过程。先分清层内职责，再串层间关系。

## 🧩 一、L2 的四个子层

| 子层   | 核心职责                          | 关注点        |
| ---- | ----------------------------- | ---------- |
| SDAP | **QoS Flow 到 DRB 的映射(5G新增层)** | 业务优先级与承载绑定 |
| PDCP | **加密**、完整性保护、头压缩              | 安全性与效率     |
| RLC  | **分段、重组**、重传                  | 可靠传输与时延平衡  |
| MAC  | 调度、多路复用、**HARQ 相关控制**         | 空口资源分配     |
|      |                               |            |

```text
L3（核心网 / NAS）
        │
L2（gNB：SDAP → PDCP → RLC → MAC）
        │
L1（物理信道）
        │  无线空口
       UE
```

gNB 部分属于 NG-RAN 无线接入网，属于数据链路层。


## 📍 二、SDAP

**SDAP 是 5G 新增的适配层**，核心作用是把 QoS Flow 与数据无线承载联系起来。

- 让不同业务可以走不同的 QoS 逻辑
- 使核心网定义的 QoS 能够映射到无线侧承载
- 让用户面业务区分更明确

## 🔐 三、PDCP

PDCP 位于更靠上的链路层，偏重安全和效率。

- 对控制面和用户面数据做加密与完整性保护
- 对 IP 包头做压缩，降低空口开销
- 支持切换时的数据连续性处理

## 🧱 四、RLC

RLC 负责链路层的数据组织与可靠性控制。

- 对大包做分段与重组
- 在需要时支持重传
- 兼顾吞吐率和时延

## 🚦 五、MAC

**MAC 更贴近空口调度**。

- 将多个逻辑信道复用到物理信道
- 接收调度结果并按时隙发送数据
- 配合 HARQ 完成快速反馈与重传

MAC 在空口里最像“调度中枢”：它决定谁在什么时刻、占用哪些资源发数据。

## 📚 六、与标准的对应

| 能力 | 相关规范 | 记忆点 |
| --- | --- | --- |
| 总体空口框架 | 3GPP TS 38.300 | 先看全局位置，再看层内细节 |
| MAC 调度与 HARQ 相关过程 | 3GPP TS 38.321 | 空口时隙内的资源安排 |
| 无线接入控制过程 | 3GPP TS 38.331 | RRC 建立、配置、重配与释放 |

## 🔄 七、与上下层的关系

- 上层业务先进入 SDAP/PDCP
- 再经过 RLC/MAC 进入物理层
- 承载与 QoS 映射则由核心网和无线承载共同定义

## ✅ 八、相关笔记

> [!important] 面试高频问法
> - SDAP 与 DRB、QoS Flow 的关系是什么？
> - PDCP 与 RLC 的职责边界怎么区分？
> - MAC 为什么说是“空口调度核心”？

- [[vault-notes/5g/protocols/01-bearer-l1-l2|5G 无线承载]]
- [[vault-notes/5g/protocols/04-nr-standard-specifications|5G NR 标准规范]]
- [[vault-notes/5g/architecture/03-ng-ran-architecture|NG-RAN 架构]]
- 总入口：[[vault-notes/5g/00-guide]]｜[[vault-notes/5g/architecture/01-layering-overview]]｜[[vault-notes/5g/harq]]
