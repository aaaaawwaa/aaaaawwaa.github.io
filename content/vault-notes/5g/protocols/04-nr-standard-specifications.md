---
title: "5G_NR标准规范"
created: '2025-01-01'
aliases:
- 5G NR 标准规范
- 3GPP 5G Standards
- 5G 物理层基础
- 5G 物理层
tags:
- 5G
- 3GPP
- 物理层
- 频谱
- 帧结构
author: Obsidian Note Bot
date: '2026-04-04'
type: concept
subjects:
- 5G
- 通信原理
domains:
- 通信与信息
- 物理层
status: learning
prerequisites: []
related: []
---

# 📡 5G NR标准与规范

> [!abstract] 📌 核心导读
> 本文聚焦 5G NR 的物理层底座：频谱范围、子载波间隔、帧结构、资源栅格、同步与随机接入。
> 建议与 [[vault-notes/5g/architecture/01-layering-overview|5G 分层总览]] 对照阅读。

> [!tip] ⚙️ 记忆顺序
> 先记 ==FR1/FR2 + numerology==，再记 ==SSB/PRACH/BWP==，最后串接入流程。
## 📚  一、标准范围

- 3GPP TS 38.300: NR / NG-RAN 总体描述，适合先建立网络全景。
- 3GPP TS 23.501: 5GS 系统架构，适合理解 5GC、切片和会话控制。
- 3GPP TS 38.321: MAC 协议规范，适合回看调度与 HARQ 关系。
- 3GPP TS 29.281: GTPv1-U 用户面隧道，适合理解 N3 / N9 传输。
- 3GPP TS 38.331: RRC 协议规范，适合把无线接入过程和控制面串起来。


R15 是 5G NR 的基础版本，R16/R17 进一步增强了低时延、工业互联网、定位、节能和边缘场景能力。

- 3GPP 组织建议5G网络在高铁场景下的下行体验速率应达到50Mbps
- 3GPP R16 NR的双激活协议栈功能使得切换过程的数据传输中断时间下降到了0ms
- 3GPP R16 NR的路测最小化功能的即时模式使用哪种类型的测量来**采集UE测量的下行RSBP** :   **M1**
- 3GPP R16 NR的路测最小化功能的即时模式使用哪种类型的测量来**采集数据的延迟**:   **M6**

## 📶 二、频谱范围

5G NR 主要分为两个频率范围：

| 频段范围 | 频率范围                                       | 特点                 | **支持最大带宽** |
| ---- | ------------------------------------------ | ------------------ | ---------- |
| FR1  | 410 MHz - 7125 MHz**(sub1GHz - sub 6GHz**) | 覆盖能力强，适合广覆盖与主流商用部署 | **100MHz** |
| FR2  | 24250 MHz - 52600 MHz                      | 带宽更大，适合毫米波高容量场景    | **400MHz** |

**常见商用频段示例**：

- n28：703 MHz - 748 MHz，常见于低频广覆盖
- n41：2496 MHz - 2690 MHz，常见于 2.6 GHz 频段
- n78：3300 MHz - 3800 MHz，主流 3.5 GHz 频段
- n79：4400 MHz - 5000 MHz，部分地区的 5G 高频段

中国车联网**直连通信**使用频率为 : **5905-5925MHz**
**运营商频段划分**:
- **中国移动**：
    - **2.6 GHz (n41)**：这是移动的主力频段，覆盖较好。
    - **4.9 GHz (n79)**：属于 C-Band 的高频部分，用于热点区域扩容。
    - **700 MHz (n28)**：与中国广电共建共享，用于广覆盖。
- **中国电信 & 中国联通**：
    - **3.5 GHz (n78)**：这是全球最主流的 C-Band 频段。电信和联通在这个频段上进行了**共建共享**，这使得他们拥有了全球最大规模的 3.5GHz 5G 网络，网速表现通常非常出色。


**5G频谱规划**
**C波段（C-Band）**:主要指**3GHz至6GHz**之间的频率范围，特别是被3GPP定义为n77/n78频段的3.3GHz至4.2GHz部分

## ⏱️ 三、子载波间隔(SCS)与帧结构

5G NR 采用灵活的子载波间隔设计，用参数 $\mu$ 表示不同 numerology。


| $\mu$ | 子载波间隔   | 典型场景                       |
| ----- | ------- | -------------------------- |
| 0     | 15 kHz  | FR1，覆盖优先                   |
| 1     | 30 kHz  | FR1 主流配置                   |
| 2     | 60 kHz  | FR1 或部分高容量场景 (普通CP , 扩展CP) |
| 3     | 120 kHz | FR2 主流配置                   |
| 4     | 240 kHz | FR2 同步信号等场景                |

时间结构上，5G NR 仍然保持 10 ms 无线帧，但 slot 长度会随 $\mu$ 变化而缩短：

- 无线帧：10 ms
- 半帧：5 ms
- 子帧：1 ms
- 时隙长度：$1 / 2^{\mu}$ ms(单子帧包含的时隙个数)
注: 5G NR的时间单位为Tc

**1个时隙固定14个符号,1个无线帧固定10ms**,其他可能会发生变化,比如时隙数,单个时隙包含的符号数(**循环前缀为12个,常规为14个**)
1个无线帧时隙个数随μ值增大而翻倍

这意味着 $\mu$ 越大，时隙越短，时延越低，但对频率选择性与同步要求也更高。

## 🧱 四、资源栅格与带宽部分

资源格与资源块
1. 资源格
	资源格的结构由资源单元(RE),资源块(RB),OFDM符号
2. 资源单元
	资源格的最小单位
3. 资源块(**RB**)
	5G 物理层最重要的资源单位是 RB（Resource Block，资源块）。
	**RB是物理层的基本单位**
	- 1个RB == 12子载波
	- 最小RB数固定24
	- μ值0~3 最大RB数为275,μ=4时,最大RB数为138,μ=5时,最大RB数为69
	
	**参考资源块,公共资源块(CRB):** 
		**全局绝对索引**，以 **Point A** 为频域参考起点
	    跨越整个载波带宽（Carrier Bandwidth），与 BWP（Bandwidth Part）无关
		编号从 0 开始，到 Ngridsize,μ​−1 结束
	**物理资源块(PRB):**
		**BWP 内部的局部索引**，相对于 BWP 的起始位置
	    实际物理传输使用的资源单位
	**虚拟资源块(VRB):** 
		**调度指示的中间层**，DCI 中指示的资源分配基于 VRB
	    通过映射方案转换为 PRB，实现 **频率分集** 或 **连续分配**

**==数据层**
==1RBG = 2-16RB **(1个资源块组 = 2到16个资源块)**
1 RB = 12 subcarrier **(1个资源块 = 12个子载波)**
1PRB = 12RE **(1个物理资源块 = 12个资源粒子)**

**==数据层与控制层的映射==**
1REG = 1PRB _**物理资源块（PRB）”和“控制资源元素组（REG）”_**

**==控制层==**
1PDCCH = nCCE **(1个物理下行控制信道 = n个控制信道元素)**
1CCE = 6REG  **(1个控制信道元素 = 6个REG bundle)**
1REG = 12RE  **(1个控制资源元素组 = 12个资源粒子)**

- RB 是频域分配的基本单位
- **BWP**（Bandwidth Part，带宽部分）用于让终端只在部分带宽上工作，降低功耗
	- 每个终端最大可以配置**4个专用BWP**
	- UE 在每个服务小区最多可以配置4个下行链路BWP和4个上行链路BWP
	- 如果UE配置辅助上行链路SUL,UE还可以在辅助上行链路配置BWP.
- **SSB**（同步信号块）用于**小区搜索、测量和初始接入**,1个SSB信号有4个OFDM符号
- PRACH（随机接入信道）用于**发起随机接入**
	UE不能在**有效带宽部分传输PUSCH或PUCCH**
## 🗂️ 五、和标准的对应

| 主题 | 你在这里记什么 | 对应大纲位置 |
| --- | --- | --- |
| 整体框架 | NR / NG-RAN 的体系位置 | 3GPP TS 38.300 |
| 频谱与数值化 | FR1 / FR2、子载波间隔、时隙 | 5G NR 基础 |
| 同步与接入 | SSB、PRACH | 5G 接入与初始同步 |

## 🔄 六、同步与接入

NR 的接入流程通常从同步开始，再进入随机接入和 RRC 建链。

- UE 先通过 SSB 完成小区搜索和同步
- 随后通过 PRACH 发起随机接入
- 完成接入后进入 RRC_CONNECTED
- 5G 还引入 RRC_INACTIVE，用于在空闲与连接之间平衡恢复速度与省电

## ✅ 七、小结

物理层决定了 5G 空口的“底座能力”：频谱怎么切、时隙怎么分、资源怎么分、终端怎么同步。

> [!important] 面试高频问法
> - 为什么 5G 需要多 numerology？
> - FR1 与 FR2 的工程取舍是什么？
> - SSB、PRACH、BWP 在接入中分别承担什么角色？

- 想看协议栈分工，接着看 [[vault-notes/5g/protocols/03-data-link-layer-l2|L2 协议栈]]
- 想看接入网结构，接着看 [[vault-notes/5g/architecture/03-ng-ran-architecture|NG-RAN 架构]]

---

**关联**：[[vault-notes/5g/00-guide]]｜[[vault-notes/5g/architecture/01-layering-overview]]｜[[vault-notes/5g/phy/05-air-interface-illustrated]]｜[[vault-notes/5g/phy/04-physical-channels-signals]]｜[[vault-notes/5g/phy/01-cell-search]]｜[[vault-notes/5g/phy/03-random-access-rach]]｜[[vault-notes/communication/07-digital-bandpass]]｜[[vault-notes/communication/08-advanced-digital-modulation]]｜[[vault-notes/communication/13-synchronization]]
