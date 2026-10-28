---
title: 通信原理
description: 从模拟调制的频谱搬移进入数字调制，理解 AM、QPSK 的数学表达、带宽效率与误码率。
tags:
  - communication
  - index
---

## 学习范围

通信原理关注的是如何把信息可靠、高效地通过信道传输。本分类从调制（modulation）这一核心概念出发：调制的两个基本目的是把基带信号搬移到适合天线辐射与信道传输的频段，以及实现多路信号共享同一信道（频分复用）。

内容分两部分。模拟调制以调幅 AM 为例，讨论数学表达、调制度、频谱结构、带宽与包络检波；数字调制以 QPSK 为例，讨论 I/Q 表示、格雷映射、带宽效率、误码率与相位跳变问题。二者共同的语言都是频谱：调制本质是频谱搬移，噪声分析依赖高斯分布与 Q 函数。

## 本分类文章

- [[communication/analog-modulation-am|模拟调制 AM]]：调幅的数学表达、调制度、双边带频谱与包络检波。
- [[communication/digital-modulation-qpsk|数字调制 QPSK]]：I/Q 正交调制、格雷映射、误码率与 OQPSK 改进。

## 跨学科关联

- [[mathematics/probability-overview|概率论概览]]：AWGN 信道的高斯模型与 Q 函数是误码率推导的两块基石。
- [[signal-processing/signals-and-systems-intro|信号与系统导论]]：带通信号可以用复包络与频谱搬移来描述，卷积与傅里叶变换是必备工具。
- [[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]]：调制器的 FPGA 实现需要精确定时序的 DDS、混频与抽取滤波。

> [!note] 三个常见指标
> 任何调制方式都要横向比较三件事：带宽效率（bit/s/Hz）、功率效率（达到给定误码率所需的最低 $E_b/N_0$）以及实现复杂度。三者往往互相制约，不存在全部最优的调制方式。

## 相关阅读

- [[communication/analog-modulation-am|模拟调制 AM]]
- [[communication/digital-modulation-qpsk|数字调制 QPSK]]
- [[maps/learning-path|推荐学习路径]]

<!-- topic-index:start -->
## 从信道到编码的知识点

### 通信原理

- [[vault-notes/communication/00-guide|通信原理知识库总导读]]
- [[vault-notes/communication/01-introduction|绪论]]
- [[vault-notes/communication/02-deterministic-signals|确知信号]]
- [[vault-notes/communication/03-random-processes|随机过程]]
- [[vault-notes/communication/04-channel|信道]]
- [[vault-notes/communication/05-analog-modulation|模拟调制系统]]
- [[vault-notes/communication/06-digital-baseband|数字基带传输系统]]
- [[vault-notes/communication/07-digital-bandpass|数字带通传输系统]]
- [[vault-notes/communication/08-advanced-digital-modulation|新型数字带通调制技术]]
- [[vault-notes/communication/09-optimal-reception|数字信号的最佳接收]]
- [[vault-notes/communication/10-source-coding|信源编码]]
- [[vault-notes/communication/11-error-control-coding|差错控制编码]]
- [[vault-notes/communication/12-orthogonal-codes-pn-sequences|正交编码与伪随机序列]]
- [[vault-notes/communication/13-synchronization|同步原理]]
- [[vault-notes/communication/a-formula-cheatsheet|通信原理公式速查表]]
- [[vault-notes/communication/b-cross-library-links|跨库知识关联]]

### 数字调制

- [[vault-notes/digital-modulation/01-digital-communication-system|数字通信系统的基本组成部分]]

<!-- topic-index:end -->
