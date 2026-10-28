---
title: 通信原理
description: 从信号与噪声的数学语言出发，经模拟调制、数字基带与带通调制、编码与同步，走到 5G/6G 的工程实现。
tags:
  - communication
  - index
---

## 学习范围

通信原理关注如何把信息可靠、高效地通过信道传输。本分类按"信号与噪声的数学语言 → 模拟调制与数字调制 → 编码与同步"的顺序组织，最终落到 5G/6G 的工程实现：

1. **信号、噪声与信道**：确知信号的谱、随机过程的统计模型、信道损伤与香农容量，是所有性能分析的地基。
2. **模拟调制**：AM/DSB/SSB/VSB 与 FM/PM 的频谱搬移、功率效率与解调增益。
3. **数字基带与带通调制**：码型与奈奎斯特准则、眼图与均衡，2ASK/2FSK/2PSK 到 QPSK/QAM/OFDM，以及最佳接收。
4. **编码与同步**：信源编码（抽样、量化、PCM、压缩）、信道编码（分组码、卷积码、LDPC/Polar）、正交码与扩频、四级同步。
5. **工程落地**：5G NR 的网络架构、协议栈、空口过程与 6G 展望。

## 本分类文章

- [[communication/communication-signals-and-channel|通信信号与信道基础]]：能量/功率谱、维纳–辛钦、窄带噪声与瑞利/莱斯分布、信道模型与香农公式。
- [[communication/analog-modulation-am|模拟调制：AM、DSB、SSB 与 FM]]：调制度、频谱结构、功率效率、包络检波、解调增益与卡森公式。
- [[communication/digital-baseband-transmission|数字基带传输]]：码型、AMI/HDB3、奈奎斯特第一准则、升余弦滚降、误码率、眼图与部分响应。
- [[communication/digital-modulation-qpsk|数字调制：从 2ASK 到 QPSK、QAM 与 OFDM]]：误码率总表、QPSK 格雷映射、16QAM 与 16PSK、MSK/GMSK、OFDM、匹配滤波与最佳接收。
- [[communication/source-and-channel-coding|信源与信道编码]]：抽样与量化、A 律 13 折线、PCM/DPCM/ΔM、码距与线性分组码、循环码、卷积码、Turbo/LDPC、正交码与扩频。
- [[communication/synchronization|同步原理]]：平方环/科斯塔斯环、位同步、巴克码帧同步、漏/假同步概率与网同步。
- [[communication/mobile-networks|5G 与 6G 移动通信]]：NSA/SA 演进、5GC/NG-RAN 架构、L2 协议与承载、NR 帧结构、小区搜索、RACH、HARQ、测量切换与 6G 展望。
- [[communication/communication-formulas|通信原理公式与换算速查]]：分章公式表（标注适用条件）、常见换算与跨库知识接口。

## 跨学科关联

- [[mathematics/probability-overview|概率论概览]]：高斯、瑞利、莱斯分布与 Q 函数是误码率推导的基石。
- [[signal-processing/signals-and-systems-intro|信号与系统导论]]：带通信号用复包络与频谱搬移描述，卷积与傅里叶变换是必备工具。
- [[signal-processing/random-processes|随机信号、估计与检测]]：相关函数、功率谱、匹配滤波与检测判决的系统理论。
- [[signal-processing/dft-and-fft|DFT 与 FFT]]：OFDM 的 IFFT/FFT 实现与频谱分辨率。
- [[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]]：调制器的 FPGA 实现需要精确定时序的 DDS、混频与抽取滤波。

> [!note] 三个常见指标
> 任何调制方式都要横向比较三件事：带宽效率（bit/s/Hz）、功率效率（达到给定误码率所需的最低 $E_b/N_0$）以及实现复杂度。三者往往互相制约，不存在全部最优的调制方式。

> [!tip] 建议阅读顺序
> 先读"通信信号与信道基础"建立噪声与容量概念，再按模拟调制 → 数字基带 → 数字带通 → 编码与同步推进；公式速查表适合做题时定位条件，5G/6G 一篇则把这些理论映射到 NR 的工程参数上。

## 相关阅读

- [[communication/communication-formulas|公式速查]]：做题前先查适用条件。
- [[vault-notes/communication/00-guide|通信原理知识库总导读]]：13 章知识地图与章节对照。
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
