---
title: "5G核心网(5GC)架构"
aliases:
- 5GC 架构
created: '2026-04-04'
tags:
- 5G
- 5GC
- 核心网
- SBA
- AMF
- SMF
- UPF
- UDM
- AUSF
- PCF
- NRF
- NSSF
author: Obsidian Note Bot
date: '2026-04-04'
type: concept
subjects:
- 5G
domains:
- 通信与信息
- 网络架构
status: learning
prerequisites: []
related: []
---

# 🧠 5G核心网（5GC）架构与关键技术

> [!abstract] 📌 核心导读
> 5GC 是 5G 系统的大脑：负责接入与移动性、会话控制、用户面转发、策略与鉴权、切片与服务发现。
> 阅读本页时，建议与 [[vault-notes/5g/architecture/03-ng-ran-architecture|NG-RAN 架构]] 对照。

> [!tip] 📚 版本线索
> 5GC 架构主线来自 3GPP TS 23.501；接口承载重点是 N2 控制信令、N3/N9 的 GTP-U、N4 的 PFCP。

> [!info] 🧭 版本关系
> 本页是**速览版**；带完整 SBA 结构图与 NFV / CUPS 说明的详版见 [[vault-notes/5g/architecture/02-5gc-architecture|5GC 架构（含结构图）]]。

## 🧭 一、从 NSA 走向 SA

5G 早期常见 NSA（非独立组网），依赖 4G EPC 过渡；而 SA（独立组网）则由 5GC 完整承载 5G 业务。

- NSA 更适合快速商用部署
- SA 是 5G 的目标形态
- SA 使切片、低时延和云原生能力更容易落地

## ⚙️ 二、SBA 与 C/U 分离

5GC 最核心的两个设计思想：

- SBA（Service-Based Architecture，服务化架构）
- C/U 分离（控制面与用户面分离）

### SBA 的特点

- 网络功能以服务方式互联
- NF 之间通过标准化接口交互
- 功能可独立部署、弹性扩展

### C/U 分离的意义

- 控制面集中管理策略、会话和移动性
- 用户面专注高速转发
- 让网络更适合边缘部署和云化扩容

## 🧩 三、核心网络功能

核心网元之间采用**总线型架构**
除UPF为**用户面**外,其他网元均为**控制面**

| NF       | 全称                                          | 中文全称         | 职责                       |
| -------- | ------------------------------------------- | ------------ | ------------------------ |
| **AMF**  | **Access and Mobility Management Function** | **接入和移动性功能** | **接入、注册、移动性管理,用户认证**     |
| **SMF**  | **Session Management Function**             | **会话管理功能**   | **会话管理、PDU 会话建立、选择 UPF** |
| UPF      | User Plane Function                         | 用户面          | 用户面转发、N3/N9 数据转发         |
| **UDM**  | **Unified Data Management**                 | **统一数据管理**   | **用户数据、签约信息管理**          |
| **AUSF** | **Authentication Server Function**          | **认证服务器功能**  | **鉴权服务**                 |
| PCF      | Policy Control Function                     | 策略控制功能       | 策略和 QoS 控制               |
| NRF      | Network Repository Function                 | 网络存储功能       | NF 注册与发现                 |
| NSSF     | Network Slice Selection Function            | 网络切片选择功能     | 网络切片选择                   |

## 🔌 四、接口速查

| 接口     | 典型协议 / 内容             | 用途                       |
| ------ | --------------------- | ------------------------ |
| **N1** | **NAS**               | **UE 与 AMF 之间的非接入层信令**   |
| **N2** | **NG-AP / SCTP / IP** | **gNB 与 AMF 之间的控制面信令**   |
| **N3** | **GTP-U / UDP / IP**  | **gNB 与 UPF 之间的用户面数据**   |
| **N4** | **PFCP / UDP / IP**   | **SMF 与 UPF 之间的会话与转发控制** |
| N9     | GTP-U / UDP / IP      | UPF 与 UPF 之间的用户面转发       |
| N6     | IP                    | UPF 到数据网络的出口             |

## 🔄 五、主要业务流程

### 1. 接入与注册

- UE 先通过 NG-RAN 接入网络
- AMF 负责注册、寻呼和移动性管理
- UDM 和 AUSF 支持用户身份和鉴权流程

### 2. 会话建立

- SMF 建立和管理 PDU 会话
- SMF 选择合适的 UPF
- UPF 负责真正的数据转发

### 3. 策略控制

- PCF 为业务制定策略和 QoS 规则
- 这些策略会影响会话建立和承载选择

### 4. 服务发现

- NRF 负责登记和发现网络功能
- 这是 SBA 能够灵活协作的基础

## 🚀 六、关键能力

### 网络切片

5GC 可以根据业务需求将网络逻辑切分成多个独立切片。

- eMBB 切片：面向大带宽业务
- uRLLC 切片：面向超低时延业务
- mMTC 切片：面向海量连接业务

### MEC

MEC 把业务下沉到更靠近基站的位置。

- 降低时延
- 减少回传负担
- 更适合实时互动、工业控制和本地化计算

### 语音业务

5G 语音通常依赖 IMS、VoNR 或 EPS Fallback 等方案，具体实现取决于网络部署阶段。

## ✅ 七、相关笔记

> [!important] 面试高频问法
> - AMF、SMF、UPF 三者如何分工协作？
> - SBA 为什么比传统网元互联更适合云化？
> - N2/N3/N4/N9 在端到端业务里如何串联？

- [[vault-notes/5g/architecture/03-ng-ran-architecture|NG-RAN 架构]]
- [[vault-notes/5g/protocols/02-transport-layer-tunnels|5G 传输层与隧道协议]]
- [[vault-notes/5g/protocols/01-bearer-l1-l2|5G 无线承载]]
- 总入口：[[vault-notes/5g/00-guide]]｜[[vault-notes/5g/architecture/01-layering-overview]]｜[[vault-notes/5g/protocols/05-transport-network]]
