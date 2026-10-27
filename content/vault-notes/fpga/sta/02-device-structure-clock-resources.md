---
title: "FPGA器件结构与时钟资源"
type: course
subjects:
- FPGA
- 数字系统设计
domains:
- 硬件实现
- 器件结构
tags:
- FPGA
- 7系列
- CMT
- MMCM
- PLL
- BUFG
status: learning
aliases:
- CMT 时钟管理单元
- MMCM 与 PLL
prerequisites:
- "[[vault-notes/fpga/sta/01-design-implementation-flow]]"
related:
- "[[vault-notes/fpga/basics/02-fpga-cpld-overview]]"
- "[[vault-notes/fpga/sta/03-synthesis-basics-attributes]]"
- "[[vault-notes/fpga/vivado/base/06-xdc-pins-clocks]]"
created: 2026-10-27
---

# 02 · FPGA 器件结构与时钟资源

> [!abstract] 这一篇在讲什么
> 对应课程导入《0_0课程简介》第 16–20 页。先看 7 系列 FPGA 的 I/O Bank（HP / HR / HD）与 FGG484 封装里"时钟资源怎么排布"，再拆开 CMT（Clock Management Tile）= 1 个 MMCM + 1 个 PLL 的内部结构，最后推导 MMCM/PLL 的**频率与相位关系**。
> 学完应能：看懂器件手册的 bank 分区图、说清 MMCM 与 PLL 的差别、用 $f_{VCO}$ 与分频比算出任意输出时钟、解释 `locked` 信号为什么必须参与复位释放。

## 一、I/O Bank 的三种类型

课件强调：**这些概念是 7 系列之后才有的**。

| Bank 类型 | 全称 | 定位 | 典型用途 |
| --- | --- | --- | --- |
| HP | High Performance | 高性能 | 高速接口、DDR、低压差分信号，电压范围较窄 |
| HR | High Range | 宽电压范围 | 通用 I/O，兼容 3.3 V / 2.5 V / 1.8 V 等 |
| HD | High Density | 高密度 | 大量普通 I/O（多见于 UltraScale 系列） |

> [!important] 两个容易记错的点
> 1. **7 系列 FPGA 只有 HP 与 HR Bank**；HD Bank 属于 UltraScale 系列。
> 2. 一个器件里**不会同时包含 HP / HR / HD 三种 Bank**——具体某型号有哪几种，要看 UG475 的 bank 表，而不是凭系列名推断。

## 二、FGG484 封装与时钟资源分布

课件以 **FGG484 封装（仅 XC7A15T、XC7A35T 等型号）** 为例：所有 HR I/O Bank 和 GTP Quad 在该封装中被完整引出（fully bonded out）。

```
                  ┌──────────────────────────────────────────┐
                  │  XC7A15T / XC7A35T  (FGG484)             │
   Left I/O       │                                          │       Right I/O
   Column Banks   │            GTP Quad 216                  │       Column Banks
   ┌──────────┐   │   ┌──────────────────────────┐           │   ┌──────────┐
   │ Bank 16  │   │   │        HROW              │           │   │ Bank 35  │
   │   HR     │   │   │                          │           │   │   HR     │  PLL11
   ├──────────┤   │   │   ┌──────────────────┐   │           │   ├──────────┤  CMT
   │ Bank 15  │   │   │   │ 16 BUFGs (上半)  │   │           │   │ Bank 34  │  MMCM11
   │   HR     │   │   │   └──────────────────┘   │           │   │   HR     │  PLL10
   ├──────────┤   │   │   Horizontal Center      │           │   └──────────┘  CMT
   │ Bank 14  │   │   │   ┌──────────────────┐   │           │                 MMCM10
   │   HR     │   │   │   │ 16 BUFGs (下半)  │   │           │
   └──────────┘   │   │   └──────────────────┘   │           │
   PLL02/CMT      │   └──────────────────────────┘           │       Bank 50 I/Os
   MMCM02/01/00   │      Clocking Backbone                   │
                  │      CMT Backbone                        │
                  └──────────────────────────────────────────┘
```

结构要点：

- **I/O 按列排布**（Left / Right I/O Column Banks），每侧有若干 Bank；FGG484 上是 Bank 14/15/16（左）与 Bank 34/35（右），均为 HR。
- **CMT 成列放在 I/O 列内侧**：左侧 PLL00/01/02 + MMCM00/01/02，右侧 PLL10/11 + MMCM10/11。CMT backbone 与 clocking backbone 负责把时钟送进全局网络。
- **水平中心（Horizontal Center）** 是全局时钟缓冲的集中区，课件标注两组 "16 BUFGs"，即 BUFG 集中在芯片水平中轴上。
- **GTP Quad** 是高速收发器，位于顶部，只有该封装支持的型号才有。

> [!note] 补充（课件外）
> 这种"CMT 靠边、BUFG 居中、I/O 在外"的版图安排不是随意的：全局时钟网络从中心向四周辐射可以把**时钟偏斜（skew）**压到最小；而 I/O 在最外层是为了缩短引脚到焊盘的走线。理解这一点，才能明白为什么"时钟不该走普通 I/O 布线"。

## 三、CMT：一个 MMCM + 一个 PLL

课件的定义很干脆：

> **CMT（Clock Management Tile，时钟管理单元）= 一个 MMCM + 一个 PLL。**

```
 BUFG ─┐
 IBUFG ─┤            ┌──────────────┐
 BUFH ──┼──► MUX ───►│  CLKIN1/2    │
 GT ────┤            │              │      ┌──────────┐
 Local ─┘            │   MMCM / PLL │─────►│ BUFG     │
 (不推荐)            │              │      │ BUFH     │
        ┌───────────│  CLKFB       │◄─────┤ (反馈)   │
        │            └──────────────┘      └──────────┘
        └──────────── CLKFB ────────────────────┘
```

- 输入可选：`BUFG`、`IBUFG`、`BUFH`、`GT` 收发器时钟、**本地布线（Local Routing，课件明确标注 not recommended）**。
- `CLKIN1/CLKIN2` 二选一作为参考输入；`CLKFB` 是反馈输入，用于让输出与输入建立确定的相位关系。
- 输出必须经过 **BUFG（全局）或 BUFH（区域）** 才能低偏斜地送到全芯片。

> [!warning] 为什么"本地布线"被标为不推荐
> 从普通逻辑布线取时钟，会引入：
> 1. 大且不可预测的布线延迟 → 时钟偏斜 / 相位关系失控；
> 2. 时钟网络没有专用缓冲，驱动能力弱、边沿变差；
> 3. 静态时序分析只能把它当普通数据路径，约束难写。
> 结论：**时钟源一律走专用时钟引脚 / 时钟网络**（`IBUFG` → `BUFG`/`MMCM`）。

## 四、MMCM 与 PLL 的内部结构

### 4.1 共同骨架

```
CLKIN1/2 ─► [D 分频] ─► PFD ─► CP ─► LF ─► VCO ─┬─► O0..On ─► CLKOUTn
                                                 ├─► M     ─► CLKFBOUT ──► CLKFB
CLKFB ───────────────────────────────────────────┘
                              │
                     Lock Detect / Lock Monitor ─► Lock
```

| 模块 | 作用 |
| --- | --- |
| D（输入分频器） | 把输入频率先降下来，使 PFD 工作在合适频率 |
| PFD（鉴频鉴相器） | 比较参考时钟与反馈时钟的相位差 |
| CP（电荷泵）+ LF（环路滤波器） | 把相位误差变成控制电压，滤除高频抖动 |
| VCO（压控振荡器） | 产生高频振荡，是整个 CMT 的"心跳" |
| O0..On（输出分频器） | 把 VCO 频率分频成各路输出时钟 |
| M（反馈分频器） | 决定反馈路径的分频比，从而决定 VCO 频率 |
| Lock Detect | 环路锁定后拉高 `locked` |

### 4.2 MMCM 与 PLL 的差别

| 特性 | MMCM | PLL |
| --- | --- | --- |
| VCO 相位抽头 | **8 个相位抽头 + 1 个可变相位抽头**（8-phase taps + 1 variable phase tap） | 8 个相位抽头（8-phase taps） |
| 分数分频 | 有（O0..O6、M 均标 Fractional Divide） | 无（仅整数分频） |
| 输出数量 | CLKOUT0–CLKOUT6，其中 CLKOUT0B–CLKOUT3B 为反相输出；另有 CLKFBOUT / CLKFBOUTB | CLKOUT0–CLKOUT5，另有 CLKFBOUT |
| 相位调节精度 | 粗调 45° 一级，且可变抽头可做更细的相位调整 | 粗调 45° 一级 |
| 资源开销 | 更大 | 更小 |

> [!tip] 选型口诀
> 要**分数分频**（输入 50 MHz 想要 33.33 ns 之类非整数比）或要**精细相位移动**（如 DDR 采样点微调）→ 用 MMCM；
> 只需要整数倍频/分频、资源紧张 → 用 PLL。Xilinx 的 Clocking Wizard 会自动判断，但要知道它在用什么。

## 五、时序分析：频率与相位关系

### 5.1 时序图

![[vault-notes/assets/02-device-structure-clock-resources/fig-01.svg|1100]]

### 5.2 频率换算

$$f_{VCO}=f_{CLKIN}\times\frac{M}{D},\qquad f_{CLKOUTk}=\frac{f_{VCO}}{O_k},\qquad f_{CLKFBOUT}=\frac{f_{VCO}}{M}$$

课件例子：$f_{CLKIN}=100$ MHz，$D=1$，$M=10$ → $f_{VCO}=1$ GHz；再取 $O_0=20$ → $f_{CLKOUT0}=50$ MHz。

### 5.3 相位关系

VCO 的 8 个相位抽头把 VCO 周期**均分**成 8 份，因此：

$$\Delta\varphi_{\text{粗}} = \frac{360°}{8}=45°\quad\Rightarrow\quad \Delta t = \frac{45°}{360°}\cdot T_{OUT}=\frac{T_{OUT}}{8}$$

- 50 MHz 输出（$T=20$ ns）：一个抽头 = $20/8 = 2.5$ ns，90° = 2 个抽头 = 5 ns。
- 180° 不需要抽头：直接用反相输出 `CLKOUT0B`。
- 需要非 45° 整数倍的相位（如 22.5°、或 DDR 的细微采样点调整）时，只能靠 MMCM 的**可变相位抽头**。

### 5.4 关键时间节点（对应上图）

| 时间 | 事件 | 说明 |
| --- | --- | --- |
| 0 ns | clk_in 上升沿 | 100 MHz，周期 10 ns |
| 0 ns | CLKOUT0（0°）上升沿 | 环路锁定后与参考保持固定相位 |
| 5 ns | CLKOUT0（90°）上升沿 | 相对 0° 落后 5 ns = 90° |
| 10 ns | CLKOUT0 下降沿 / CLKOUT0B 上升沿 | CLKOUT0B 恒为 0° 的反相 |

### 5.5 易错点与假设

- **假设**：图中假定环路已锁定、忽略输出抖动与时钟树延迟；真实器件里 `CLKOUT` 相对参考存在固定但非零的相位偏移，需以时序报告/仿真为准。
- 常见错误：直接把 $f_{CLKIN}\times M$ 当成输出频率——**必须先分频 $O_k$**。
- 常见错误：忽略 VCO 的频率范围限制。7 系列 MMCM 的 VCO 只能在几百 MHz 到 1 GHz 量级之间工作（典型 -1 速度等级约 600–1200 MHz，不同速度等级不同，以 UG472 为准），$M/D$ 取值必须让 $f_{VCO}$ 落在范围内，否则工具报错或环路失锁。
- 相位是**输出之间**的关系：两个 CLKOUT 都来自同一个 VCO，所以它们的相位差是确定的；但与外部异步时钟之间没有确定相位。

## 六、`locked` 与复位释放

`Lock Detect` 在环路锁定后拉高 `locked`。工程含义：

1. MMCM/PLL 配置生效后需要一段时间锁定（微秒量级），这期间输出时钟不稳定。
2. 若用 MMCM 输出作为系统时钟，**内部复位必须在 `locked` 为高之后才释放**，否则触发器可能在时钟抖动期被采到亚稳态。
3. 典型写法：`assign rst_n_sys = locked & ext_rst_n;`（异步复位、同步释放更稳妥，见 [[vault-notes/fpga/verilog/sequential/01-registers]] 的复位讨论）。

```verilog
// 常见结构：等待 locked 后再释放内部复位（示意，非课件内容）
reg [1:0] rst_sync;
always @(posedge clk_out or negedge locked) begin
    if (!locked) rst_sync <= 2'b00;
    else         rst_sync <= {rst_sync[0], 1'b1};
end
wire rst_n_sys = rst_sync[1];

// MMCM 例化（由 Clocking Wizard 生成，端口名以 IP 为准）
clk_wiz_0 u_clk_wiz (
    .clk_out1 (clk_out),
    .locked   (locked),
    .clk_in1  (clk_in)
);
```

> [!question] 自测
> 如果系统时钟由 MMCM 的 50 MHz 输出提供，但逻辑复位直接接外部按键、不等 `locked`，上电瞬间可能发生什么？为什么"仿真通过"却可能在实际板卡上偶发跑飞？

## 七、源课件对照

| 课件页 | 主题 | 本笔记位置 |
| --- | --- | --- |
| 16 | HP / HR / HD Bank 概念 | 一 |
| 17 | FGG484 封装与 bank / CMT / BUFG 分布 | 二 |
| 18 | CMT = 1 MMCM + 1 PLL，输入输出选择 | 三 |
| 19 | MMCM 模块图（8 相位抽头 + 可变相位抽头、分数分频、Lock） | 四、五 |
| 20 | PLL 模块图（8 相位抽头、CLKOUT0–5） | 四、五 |

> 源文件：深大《数字系统设计》课程简介 `0_0课程简介(1).ppt` 第 16–20 页；器件结构图出自 Xilinx **UG475**（7 Series FPGAs Packaging and Pinout）。

## 关联

- 前置：[[vault-notes/fpga/sta/01-design-implementation-flow]]
- 器件基础：[[vault-notes/fpga/basics/02-fpga-cpld-overview]]（LUT vs 乘积项）
- 下一站：[[vault-notes/fpga/sta/03-synthesis-basics-attributes]]
- 时钟约束写法：[[vault-notes/fpga/vivado/base/06-xdc-pins-clocks]]（`create_clock`）
- 时序与报告：[[vault-notes/fpga/sta/04-timing-analysis-setup-hold]]｜[[vault-notes/fpga/vivado/base/09-reports-timing-verdict]]
