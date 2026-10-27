---
title: "5G传输层与隧道协议"
aliases:
- 5G 隧道与承载协议
created: '2026-04-04'
tags:
- 5G
- 传输层
- SCTP
- UDP
- GTP-U
- IP
- PFCP
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

# 🚛 5G传输层与隧道协议

> [!abstract] 📌 核心导读
> 在 5G 工程语境里，传输层重点是“接口承载与隧道协议”，不是应用侧 TCP/UDP 教科书定义。
> 本文聚焦 SCTP、GTP-U、PFCP、UDP/IP 在 N2/N3/N4/N9 的落位。

> [!note] 📚 标准记忆
> RFC 4960 对应 SCTP；3GPP TS 29.281 对应 GTPv1-U；TS 23.501 给出 5GC 接口关系与控制/用户面逻辑。

## 🔐 一、SCTP：N2 控制面承载

SCTP 主要用于 5G 接入网与核心网之间的控制面信令承载，最典型的是 NG-AP。

- 位置：[[vault-notes/5g/architecture/03-ng-ran-architecture|NG-RAN]] 与 [[vault-notes/5g/architecture/02-5gc-architecture|5GC]] 之间
- 场景：N2 接口上的控制信令
- 特点：支持多宿、多流，适合信令稳定传输
- 参考：3GPP NG-AP / N2 相关定义与 RFC 4960

## 📦 二、GTP-U：用户面隧道

GTP-U 是 5G 用户面最重要的隧道协议之一。

- 位置：N3、N9 等用户面接口
- 作用：把业务数据封装后在基站和 UPF 之间转发
- 特点：轻量、适合高速转发
- 规范：3GPP TS 29.281

常见路径：

- N3：gNB 到 UPF
- N9：UPF 到 UPF

## 🧠 三、PFCP：会话与转发控制

PFCP 用于 SMF 和 UPF 之间的控制交互。

- 位置：N4 接口
- 作用：建立、修改、删除用户面转发规则
- 传输方式：PFCP over UDP/IP

## ⚙️ 四、为什么 5G 常用这些协议

| 协议 | 优势 | 适合的原因 |
| --- | --- | --- |
| SCTP | 多流、多宿、可靠传输 | 控制面信令需要稳定、可恢复 |
| GTP-U | 头部轻、转发简单 | 用户面要尽量减少处理开销 |
| PFCP | 控制与转发解耦 | 便于 SMF 精细控制 UPF |
| UDP/IP | 实现简单、时延低 | 适合作为隧道与控制承载底座 |

## 🔌 五、接口对应关系

| 接口 | 传输协议 | 主要作用 |
| --- | --- | --- |
| N2 | SCTP / IP | gNB 与 AMF 之间的控制面信令 |
| N3 | GTP-U / UDP / IP | gNB 与 UPF 之间的用户面数据 |
| N9 | GTP-U / UDP / IP | UPF 与 UPF 之间的用户面转发 |
| N4 | PFCP / UDP / IP | SMF 与 UPF 之间的会话控制 |

## 🔄 六、和其他笔记的关系

- [[vault-notes/5g/protocols/03-data-link-layer-l2|L2 协议栈]] 负责更靠近空口的数据处理
- [[vault-notes/5g/architecture/03-ng-ran-architecture|NG-RAN]] 负责接入网控制与协同
- [[vault-notes/5g/architecture/02-5gc-architecture|5GC]] 负责会话、策略和用户面管理

## ✅ 七、小结

如果把 5G 网络看成一个系统：

- SCTP 负责控制信令走得稳
- GTP-U 负责用户数据走得快
- PFCP 负责转发规则管得住

> [!important] 面试高频问法
> - 为什么 N2 常用 SCTP 而不是 TCP？
> - N3 与 N9 都是 GTP-U，但场景差异是什么？
> - PFCP 如何体现 C/U 分离下的“控转分离”？

---

**关联**：[[vault-notes/5g/00-guide]]｜[[vault-notes/5g/architecture/01-layering-overview]]｜[[vault-notes/5g/protocols/05-transport-network]]｜[[vault-notes/5g/architecture/02-5gc-architecture|5GC 架构]]
