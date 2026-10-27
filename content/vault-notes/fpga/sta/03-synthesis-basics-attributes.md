---
title: "综合基础与综合属性"
type: course
subjects:
- FPGA
- 数字系统设计
domains:
- 硬件实现
- 工具与仿真
tags:
- FPGA
- 综合
- XST
- 约束
status: learning
aliases:
- XST 综合属性
- 综合属性与专用参数
prerequisites:
- "[[vault-notes/fpga/sta/01-design-implementation-flow]]"
- "[[vault-notes/fpga/vivado/base/07-synthesis-netlist]]"
related:
- "[[vault-notes/fpga/sta/04-timing-analysis-setup-hold]]"
- "[[vault-notes/fpga/sta/02-device-structure-clock-resources]]"
created: 2026-10-27
---

# 03 · 综合基础与综合属性

> [!abstract] 这一篇在讲什么
> 对应课件《4 FPGA综合与时序收敛》第 4–14 页（**XST / ISE 时代**的综合设置段）。核心问题：综合器在把 RTL 变成网表时，有哪些"旋钮"会影响最终电路的**速度（时序）**与**面积（资源）**，以及哪些旋钮其实是在替时序分析"划范围"。
> 学完应能：说出综合目标与综合强度的区别、认出 5 个综合端时序约束属性、解释寄存器配平 / Slice 打包 / IOB 打包为什么能提高频率。

## 一、综合在流程中的位置

```
RTL（Verilog） ──[综合 Synthesis]──► 门级/LUT 网表 ──[实现 Implementation]──► 布局布线后的电路
                     ↑                                        ↑
                综合属性（本篇）                        物理约束 / 时序约束（后续笔记）
```

综合属性只影响"综合器怎么优化"，**不改变 RTL 的功能语义**。课件这一段的全部内容可以归为三类：

| 类别 | 页码 | 作用 |
| --- | --- | --- |
| 综合目标与强度 | 4–5 | 决定优化方向（面积/速度）与努力程度 |
| 综合端时序约束 | 6–9 | 告诉综合器时序目标与路径范围 |
| Xilinx 专用参数 | 10–14 | 具体的结构优化开关（扇出、复制、配平、打包） |

## 二、综合目标与综合强度

| 属性 | 取值 | 课件原文要点 | 时序含义 |
| --- | --- | --- | --- |
| 综合目标<br>Optimization Goal | **Area / Speed**（默认 **Speed**） | 确定综合时的全局优化目标是面积还是速度；多数情况下速度更重要，故默认 Speed | 选 Area 会牺牲路径延迟换资源；选 Speed 会并行展开逻辑、多用资源 |
| 综合强度<br>Optimization Effort | **Normal / High** | 指定 XST 综合工作的程度；速度或面积要求不高可选 Normal，否则 High | 强度越高，工具迭代优化越多，但**不保证**结果一定更好 |

> [!warning] 课件原话（值得记住）
> "设计者不要寄希望于 XST 的综合效果，并不是选择 High 就一定得到好的综合结果，真正重要的是设计者要保证设计的质量。"
> 含义：**RTL 结构决定时序上限**，综合选项只能微调。想靠调 Effort 把一条 20 级组合逻辑的路径救回来是不现实的——该做的是流水线切分或状态机重构。

## 三、综合端的时序约束：全局优化目标

课件第 6 页列出 5 个"全局优化目标"属性（**注意是 XST/UCF 术语，不是 Vivado XDC**）：

| 属性 | 含义 | 作用对象 |
| --- | --- | --- |
| `ALLCLOCKNETS` | 所有时钟节点约束 | 全部时钟网络 |
| `OFFSET_IN_BEFORE` | 输入偏移约束（数据在时钟沿前多久准备好） | 输入 PAD → 第一级寄存器 |
| `OFFSET_OUT_AFTER` | 输出偏移约束（数据在时钟沿后多久稳定） | 末级寄存器 → 输出 PAD |
| `MAXIMUM_DELAY` | 网线最大延迟约束 | 指定网线 |
| `INPAD_TO_OUTPAD` | 输入到输出约束 | 纯组合的输入 PAD → 输出 PAD 路径 |

课件第 7 页紧接着说明这些约束的**作用范围**（四类路径）：

| 路径类别 | 起点 | 终点 | 典型约束 |
| --- | --- | --- | --- |
| ① 寄存器 → 寄存器 | 触发器时钟端 | 触发器 D 端 | 周期约束 PERIOD |
| ② 输入引脚 → 第一级寄存器 | 输入 PAD | 第一级寄存器 D 端 | 偏移约束 OFFSET IN |
| ③ 末级寄存器 → 输出引脚 | 末级寄存器时钟端 | 输出 PAD | 偏移约束 OFFSET OUT |
| ④ 输入引脚 → 输出引脚（纯组合） | 输入 PAD | 输出 PAD | PAD-TO-PAD |

> [!important] 这四类路径是后面所有时序约束的"坐标系"
> 第 28–39 页的周期约束、偏移约束，以及第 48 页的约束优先级，全部围绕这四类路径展开。先把这张表记牢，后面就不会乱：**PERIOD 只管 ①，OFFSET 只管 ②③，PAD-TO-PAD 只管 ④。**

## 四、两个"约束写入"开关

| 属性 | 取值 | 含义 | 实际影响 |
| --- | --- | --- | --- |
| Generate RTL Schematic | YES / NO | 是否生成 RTL 视图（综合结果的可视化原理图） | 只影响可读性/调试，不影响电路 |
| Write Timing Constrains | YES / NO | 是否把 HDL 源码或 `.xdc` 中指定的时序约束关系写进 Xilinx **NGC 网表** | 影响后续布局布线/时序分析能否看到约束；关掉可能导致约束"丢失" |

> [!note] 拼写勘误
> 课件原文写作 `Write Timing Constrains`，正确拼写是 `Constraints`。按原文照录，此处标注以便检索。

## 五、Xilinx 专用参数选项（综合端结构优化）

课件第 10–14 页共 7 个参数，全部"仅对 FPGA 有效"（除 Add IO Buffers 未特别限定）：

| # | 参数 | 中文 | 作用 | 为什么和时序有关 |
| --- | --- | --- | --- | --- |
| 1 | Add IO Buffers | 添加 I/O 缓冲 | 指定是否在 I/O 上加 IO Buffers | 影响 PAD 到内部逻辑的接口延迟与电平 |
| 2 | Max Fanout | 最大扇出 | 指定信号/网线的最大扇出数 | 扇出越大，负载电容越大、布线延迟越长；限制扇出可换取更短路径 |
| 3 | Register Duplication | 寄存器复制 | 是否允许复制寄存器 | 复制后每个副本驱动更少负载，缩短高扇出网络的延迟 |
| 4 | Equivalent Register Removal | 等效寄存器删除 | 是否删除 RTL 功能相等的寄存器 | 省资源，但可能删掉原本用于"打拍"的寄存器，**改变时序** |
| 5 | Register Balancing | 寄存器配平 | 把较长路径缩短、较短路径加长，使路径平衡，提高工作频率 | 本质是**重定时（retiming）**：移动组合逻辑与寄存器的边界 |
| 6 | Slice Packing | Slice 打包 | 把相关路径的 LUT 尽量布局在同一个 Slice 内 | 缩短 LUT 之间的布线距离 → 减少 `Tnet` |
| 7 | Pack I/O Register into IOBs | IOB 内打包 I/O 寄存器 | 是否用 I/O 内部寄存器作为设计的第一级寄存器 | 把"PAD → 第一级寄存器"从 fabric 移到 IOB，缩短输入路径 |

### 5.1 Register Balancing 的时序含义

```
未配平：FF1 ──[ 逻辑 A（快） ]──[ 逻辑 B（慢） ]──► FF2     关键路径 = A + B
配平后：FF1 ──[ A ]──► 新 FF ──[ B ]──► FF2               关键路径 = max(A, B) 或 A、B 各自更短
```

- 原理：把组合逻辑跨过寄存器重新分配，使寄存器之间的最长路径变短。
- 代价：寄存器数量、延迟拍数可能变化（影响功能时序对齐，需重新验证）。
- 对应课件第 26 页的周期公式：`Tperiod = Tcko + Tlogic + Tnet + Tsetup - Tclk_skew`，**配平就是在减小 `Tlogic`**。

### 5.2 Slice Packing 与 IOB 打包的时序含义

- Slice Packing：同一 Slice 内 LUT 之间的布线延迟远小于跨 Slice 布线，因此直接压缩 `Tnet`。
- IOB 打包：IOB 内触发器的时钟到输出 / 建立时间比 fabric 内更优，且省掉 PAD→fabric 的一段布线 → 改善输入侧 `Tinput` 与输出侧 `Tcko + Toutput`。
- 两者都是"用物理位置换时序"，属于**布局层优化**，与后续的 FloorPlanner（第 16 页流程中的"实现技术"）思路一致。

> [!tip] 现代 Vivado 的对应物（补充，非课件内容）
> - Optimization Goal/Effort → `synth_design -directive`（如 `PerformanceOptimized`、`AreaOptimized_high`）
> - Max Fanout → `set_property MAX_FANOUT <n> [get_nets ...]` 或 RTL 属性 `(* max_fanout = n *)`
> - Register Duplication → `(* equivalent_register_removal = "no" *)`、`-flatten_hierarchy` 等
> - Register Balancing → 综合选项 `-retiming`（Vivado 中为 `synth_design -retiming on`）
> - 关键区别：Vivado 的综合属性通过 `synth_design` 选项或 RTL 属性给定，**不是对话框里的勾选项**；但"属性 → 优化方向"的映射关系与 ISE 时代一致。

## 六、这一篇和时序主线的关系

| 本篇概念 | 在时序分析中的位置 | 后续笔记 |
| --- | --- | --- |
| 四类路径 | 时序路径的划分标准 | [[vault-notes/fpga/sta/04-timing-analysis-setup-hold]] |
| 全局优化目标 5 属性 | 综合端的时序目标 | [[vault-notes/fpga/sta/05-timing-constraints-period-offset]] |
| Register Balancing / Slice Packing | 减小 `Tlogic` / `Tnet` | [[vault-notes/fpga/sta/05-timing-constraints-period-offset]] |
| Max Fanout / Register Duplication | 减小负载与布线延迟 | [[vault-notes/fpga/sta/06-timing-exceptions-priority]] |

## 七、源课件对照

| 课件页 | 主题 | 本笔记位置 |
| --- | --- | --- |
| 4 | 综合目标 Optimization Goal | 二 |
| 5 | 综合强度 Optimization Effort | 二 |
| 6 | 全局优化目标（5 个约束属性） | 三 |
| 7 | 约束作用范围（四类路径） | 三 |
| 8 | Generate RTL Schematic | 四 |
| 9 | Write Timing Constrains | 四 |
| 10–11 | Add IO Buffers / Max Fanout / Register Duplication / Equivalent Register Removal | 五 |
| 12 | 寄存器配平 Register Balancing | 5.1 |
| 13 | Slice 打包 Slice Packing | 5.2 |
| 14 | Pack I/O Register into IOBs | 5.2 |

> 源文件：深大《数字系统设计》课件《4 FPGA综合与时序收敛.ppt》第 4–14 页。

## 关联

- 前置：[[vault-notes/fpga/sta/01-design-implementation-flow]]｜[[vault-notes/fpga/vivado/base/07-synthesis-netlist]]
- 下一站：[[vault-notes/fpga/sta/04-timing-analysis-setup-hold]]
- 器件与时钟：[[vault-notes/fpga/sta/02-device-structure-clock-resources]]
- 实现阶段：[[vault-notes/fpga/vivado/base/08-implementation-place-route]]
