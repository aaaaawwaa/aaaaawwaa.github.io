---
title: "4G至5G演进知识点"
created: '2025-01-01'
aliases:
- 4G至5G演进
- NSA组网架构
- Option 3x
tags:
- 5G/演进
- NSA
- 组网架构
- 核心网
type: concept
subjects:
- 5G
domains:
- 通信与信息
- 演进
status: learning
prerequisites: []
related: []
---

# 4G 至 5G 演进核心知识点

> [!abstract] 📌 核心导读
> **如何平滑地从4G过渡到5G？这是运营商建网的核心命题。**
> 本文梳理了 4G 向 5G 演进过程中的核心方案。重点介绍了 **NSA（非独立组网）** 尤其是在 3GPP R15 标准下的 **Option 3x** 架构，解析了 MCG/SCG 的角色分工，以及控制面与用户面的分离策略。

---

## 一、 NSA 非独立组网概览

> [!info] NSA (Non-Standalone)
> *   **全称**：非独立组网 (Non-Standalone)
> *   **标准版本**：属于 3GPP **R15** 标准
> *   **核心特征**：==不单独建设 5G 核心网（5GC）==。继续沿用 **4G EPC 核心网**，5G 基站（en-gNB）作为辅节点，物理依附于 4G 基站（eNB）工作。

---

## 二、 NSA 核心架构：Option 3x

在通信考试或面试中提及的 NSA，如果没有特别声明，基本默认指代的都是 **Option 3x** 架构。
其他option架构在这里介绍
> Option1 : 传统4G架构
> Option2 : 纯5G架构(SA架构,5G最终目标)
> Option3: 核心网采用EPC,基站采用eNB和gNB,其中eNB为主基站
> Option4: 核心网采用5GC,基站采用eNB和gNB,其中gNB为主基站
> Option5: 5GC+gNB
> Option6(已被排除)
> Option7: 核心网采用5GC,基站采用eNB和gNB,其中,eNB为主基站
> 注: 选项1,2,5均为独立组网,其他均为非独立组网

> [!important] 架构特征：SCG Split Bearer
> **Option 3x 架构的承载类型为 ==SCG Split Bearer==（辅助基站分流承载）。**

### 1. 节点与角色分工

| 节点类型 | 设备名称 | 英文简称 | NSA 中的角色定位 |
| :--- | :--- | :--- | :--- |
| **主节点 (MN)** | 4G 基站 | eNB | 负责所有的 **信令（RRC）**，负责与核心网 EPC 通信并掌控 5G 基站。 |
| **辅节点 (SN)** | 5G 基站 | en-gNB | 只负责承载 **高速用户面数据**，不直接连接 4G 核心网负责控制信令。 |
| **核心网 (CN)** | 4G 核心网 | EPC | 继续提供核心网服务，不引入 5GC。 |

*   **基站间接口**：4G 基站与 5G 基站之间通过 **X2 接口** 进行通信与控制。

### 2. 小区组 (Cell Group) 角色：MCG 与 SCG

NSA 架构本质上是一种双连接技术，即 **EN-DC (E-UTRA NR Dual Connectivity)**，手机同时连接 4G 和 5G 基站：

*   **MCG（主小区组, Master Cell Group）**：由 **4G LTE 小区** 组成。
    *   作为控制面锚点，负责终端的接入、移动性管理（切换）、以及全部信令的收发。
*   **SCG（辅小区组, Secondary Cell Group）**：由 **5G NR 小区** 组成。
    *   纯粹的“数据管道”，只负责高速的上下行数据传输，不负责复杂的信令交互。

---

## 三、 Option 3x 的数据分流机制

NSA Option 3x 最核心的设计在于**控制面与用户面的彻底分离与分流设计**：

### 1. 控制面走 4G（信令面）
**信令流向**：`UE <-> 4G 基站 (eNB) <-> EPC`
在建网初期，为了保证网络的绝对稳定和广覆盖，所有的重要信令（如附着、寻呼、切换）**全程不走 5G 基站**，全部由成熟可靠的 4G 网络代劳。

### 2. 用户面在 5G 侧分流（数据面）
**数据流向**：`EPC <-> 5G 基站 (en-gNB)` -> 分流至手机
这就是 **Option 3x** 的核心含义：**==用户面在 5G 侧分离 / 分流==**。
*   下行数据从核心网 EPC 出发，直接发送给 **5G 基站**。
*   5G 基站将大部分高速数据直接发给终端 UE。
*   如果遇到 5G 覆盖不好，5G 侧（SCG分流点）可以通过 X2 接口将一部分数据分流回 4G 基站，再送给 UE。

---

## 四、5G标准制定

R14(2016): 5G标准研究
R15(2017): 第一版5G标准
R16(2019): 第二版5G标准
R17(2021): 第三版5G标准
R18(2022): 5G-Advance 标准


## Extra 刷题补充

> [!info] 高频补充点
> 这一组内容把 NSA / EN-DC 相关的常考题补齐，方便和 刷题知识点汇总 互相跳转复习。

- **LTE 下行 CA** 常见最多支持 **5 个 CC**，适合和 MCG 侧承载能力一起记忆。
- **EN-DC / NSA** 场景下，**MCG 负责控制面锚点**，**SCG 负责高速数据面**；MCG 进行 NR 邻区测量时常看 **SSB RS**。
- **LTE 侧的 RRCConnectionReconfiguration** 可以携带 **SCG Add** 或 **PSCell Change** 相关配置。
- **SCG FailureInformation NR** 由 UE 上报到 **MCG**，失败后通常按失败流程继续处理，而不是简单重建。
- **X2 IPPM** 指的是 **X2 接口 IP 性能监视**，常关注丢包、时延、抖动等指标。

