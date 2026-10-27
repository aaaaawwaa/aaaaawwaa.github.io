---
title: "5G无线接入网(NG-RAN)架构"
aliases:
- 5G 无线接入网架构
- NG-RAN 架构
created: '2026-04-04'
author: Obsidian Note Bot
date: '2026-04-04'
tags:
- 5G
- NG-RAN
- 接入网
- CU
- DU
- AAU
- Xn
- F1
- E1
- NG
- Uu
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

# 🗼 5G无线接入网（NG-RAN）架构

> [!abstract] 📌 核心导读
> NG-RAN 是 UE 接入 5G 系统的入口层：下接 NR 空口，上接 5GC，并通过 CU/DU/AAU 分工实现灵活部署与实时处理。

> [!info] 💡 一句话记忆
> NG-RAN 负责“接入 + 协同 + 移动性”，核心是 ==接口清楚、分工清楚、时延边界清楚==。

> [!tip] 📚 标准视角
> 3GPP TS 38.300 给出 NG-RAN 总体框架；空口细节与过程控制可回看 TS 38.331 和物理层相关规范。

> [!info] 🧭 版本关系
> 本页是**速览版**；Xn / F1 / E1 / Uu 接口的逐层拆解见 [[vault-notes/5g/architecture/03-ng-ran-architecture|NG-RAN 架构（OSI 详版）]]。

## 🧩 一、NG-RAN 的基本拆分

5G 基站通常拆成三类功能实体：

- CU：集中处理控制面和部分高层协议
- DU：处理实时性更强的无线接入处理
- AAU：承担射频与天线相关功能

这种拆分的目的，是把高实时和低实时功能分开，方便集中部署、灵活扩展和边缘化演进。

## 🗂️ 二、结构速查

| 实体 | 关注点 | 常见理解 |
| --- | --- | --- |
| CU | 较高层协议、控制协同 | 更像“集中控制中心” |
| DU | 实时接入、调度与转发 | 更像“近空口执行单元” |
| AAU | 射频与天线 | 更像“空口收发前端” |

## 🔌 三、关键接口

| 接口 | 连接关系 | 作用 |
| --- | --- | --- |
| NG | gNB - 5GC | 接入网与核心网之间的主接口，分为控制面 NG-C 和用户面 NG-U |
| Xn | gNB - gNB | 基站之间的信息交互、切换和协同 |
| F1 | CU - DU | 基站内部前传接口，支持 CU/DU 分工 |
| E1 | CU-CP - CU-UP | CU 内部控制面与用户面的进一步分离 |
| Uu | UE - gNB | 空口无线接口 |

## 📖 四、与标准的对应

| 主题 | 你在这里记什么 | 对应大纲位置 |
| --- | --- | --- |
| 总体框架 | NG-RAN 在 5G 体系里的位置 | 3GPP TS 38.300 |
| 基站拆分 | CU / DU / AAU 的分工 | 接入网架构 |
| 接入流程 | Uu、F1、E1、NG、Xn 的关系 | 空口与接口协同 |

## ⚙️ 五、CU / DU / AAU 的作用

- CU 侧偏向非实时控制和协议处理
- DU 侧偏向实时调度和快速响应
- AAU 侧偏向射频收发和天线阵列

## 🔄 六、移动性管理

NG-RAN 负责大量移动性相关工作：

- 小区切换前后的上下文迁移
- 终端在不同小区间的协同切换
- Paging 唤醒与空闲态终端寻呼
- 双连接场景下的主辅小区协作

## 🆚 七、与 4G 架构的区别

- 5G 更强调 CU/DU 拆分
- 5G 更依赖 Xn 做基站间协同
- 5G 更适合和核心网的服务化架构配合

## ✅ 八、相关笔记

> [!important] 面试高频问法
> - 为什么要做 CU/DU 分离？
> - NG、Xn、F1、E1 分别解决什么问题？
> - 切换场景下 NG-RAN 与 5GC 谁负责什么？

- [[vault-notes/5g/protocols/04-nr-standard-specifications|5G NR 标准规范]]
- [[vault-notes/5g/architecture/02-5gc-architecture|5G 核心网 (5GC) 架构]]
- [[vault-notes/5g/protocols/01-bearer-l1-l2|5G 无线承载]]
- 总入口：[[vault-notes/5g/00-guide]]｜[[vault-notes/5g/architecture/01-layering-overview]]｜[[vault-notes/5g/architecture/03-ng-ran-architecture|网络层入口]]
