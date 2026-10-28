---
title: 5G 与 6G 移动通信
description: 按网络架构、无线接入、物理层信道与测量移动性组织移动通信知识。
tags: [communication, mobile-networks]
---

学习移动通信时，可以先区分核心网负责的接入、会话和业务连接，与无线接入网负责的空口传输和无线资源管理，再沿 UE 的接入过程把协议层与物理信道联系起来。

## 从系统架构走到空口

- **架构与分层**：先掌握网络组成和协议分层，理解控制面与用户面各自传递什么信息。
- **小区搜索与随机接入**：终端需要找到小区、建立同步，再执行随机接入，才能进入后续连接流程。
- **物理信道与信号**：把数据、控制信息和参考信号分别对应到空口资源，关联调制、编码和多载波传输。
- **测量与移动性**：理解测量结果怎样支持小区选择与切换；工程仿真用于把抽象流程放回覆盖和资源配置场景。
- **6G 学习材料**：与已有 5G 架构对照阅读；具体技术结论需结合材料版本与标准状态判断。

前置知识可从 [[communication/index|通信原理]]与 [[signal-processing/dft-and-fft|DFT/FFT]]补充。

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
