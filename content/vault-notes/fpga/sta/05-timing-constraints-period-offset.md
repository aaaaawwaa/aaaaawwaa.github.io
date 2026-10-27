---
title: "时序约束-周期约束与偏移约束"
type: course
subjects:
- FPGA
- 数字系统设计
domains:
- 时序分析
- 硬件实现
tags:
- FPGA
- 时序约束
- PERIOD
- OFFSET
- UCF
- XDC
status: learning
aliases:
- 周期约束
- 偏移约束
- OFFSET IN/OUT
prerequisites:
- "[[vault-notes/fpga/sta/04-timing-analysis-setup-hold]]"
related:
- "[[vault-notes/fpga/sta/06-timing-exceptions-priority]]"
- "[[vault-notes/fpga/vivado/base/06-xdc-pins-clocks]]"
- "[[vault-notes/fpga/sta/03-synthesis-basics-attributes]]"
created: 2026-10-27
---

# 05 · 时序约束（一）：周期约束与偏移约束

> [!abstract] 这一篇在讲什么
> 对应课件《4 FPGA综合与时序收敛》第 28–39 页。两类最基础、也是覆盖 90% 场景的约束：
> **周期约束（PERIOD）** 管芯片内部的寄存器→寄存器路径；**偏移约束（OFFSET IN/OUT）** 管芯片边界上"外部时钟与数据"的关系。
> 学完应能：写出周期约束语句并解释 `HIGH` 参数；解释反相时钟为什么只有半周期；由外部器件延迟反推 OFFSET 的取值；说清"偏移约束只能用于 PAD"这条硬规则。

## 一、周期约束（PERIOD）

### 1.1 定义与作用范围

课件第 28–29 页的定义：

> 周期（PERIOD）指**参考网络为时钟的同步元件间的路径**，包括 flip-flop、latch、synchronous RAM 等。
> 周期约束附加在**时钟网线**上，时序分析工具据此检查与有建立/保持时间要求的端口相连的所有路径延迟是否满足要求（**不包括 PAD 到寄存器的路径**）。

| 路径 | 是否被周期约束覆盖 |
| --- | --- |
| 寄存器 → 寄存器（含 latch、同步 RAM） | ✅ 覆盖 |
| 输入 PAD → 第一级寄存器 | ❌ 由 OFFSET IN 负责 |
| 末级寄存器 → 输出 PAD | ❌ 由 OFFSET OUT 负责 |
| 输入 PAD → 输出 PAD（纯组合） | ❌ 由 PAD-TO-PAD 负责 |

> [!important] 为什么周期约束最重要
> 课件原话："周期的概念是 FPGA/ASIC 时序定义的基础概念"，其它约束都建立在它之上，很多时序公式可以由周期公式推导。
> 工程含义：**一个设计只要时钟约束写对了，大部分内部路径的时序就有判断依据了**；没写 `create_clock`，内部路径就是"未约束路径"，STA 不会报违例。

### 1.2 约束的松紧（课件第 29 页的提醒）

| 约束过松 | 约束过紧 |
| --- | --- |
| 工具不优化，性能达不到要求 | 布局布线时间大增，甚至效果相反 |
| 例：100 MHz 的时钟写成 10 MHz | 例：把不可能达到的 500 MHz 写进约束 |

> 正确做法：约束值 = **设计的真实工作频率**（含适当裕量），不是"越紧越好"。

### 1.3 命令写法（UCF 时代）

课件第 31 页：

```tcl
NET SYS_CLK PERIOD=10ns HIGH 4ns;
```

含义：`SYS_CLK` 网络周期 10 ns（100 MHz），高电平持续 4 ns。

> [!warning] 课件自身的一处不一致
> 同一页的"假定"写"CLK 上施加的是**占空比 50%** 的信号"，而 `HIGH 4ns` 在 10 ns 周期下是 40% 占空比。按 50% 应为 `HIGH 5ns`。**按 50% 的假定继续推导**（反相时钟 → 半周期 5 ns），这是课件下一页示例的基础。

Vivado（XDC）的等价写法：

```tcl
create_clock -period 10.000 -waveform {0.000 4.000} [get_ports SYS_CLK]
# -period 10.000 → 100 MHz；-waveform {上升沿 下降沿} 单位 ns，占空比 = 4/10 = 40%
# 50% 占空比则写 -waveform {0.000 5.000}
```

### 1.4 反相时钟：为什么可用时间只有半个周期

课件第 31 页的例子：FF1 用 CLK 上升沿触发，同一 CLK 经非门后接到 FF2 的时钟端（下降沿触发）。**PERIOD 约束会自动处理时钟端反相问题：相邻同步元件时钟相位相反时，其间延迟被默认限制为周期的一半。**

![[vault-notes/assets/05-timing-constraints-period-offset/fig-01.svg|1000]]

### 1.5 关键时间节点与说明

| 时间 | 事件 | 说明 |
| --- | --- | --- |
| 2 ns | CLK 上升沿 | FF1 发射数据 |
| 7 ns | CLK 下降沿（= FF2 时钟上升沿） | FF2 捕获数据 |
| 2 → 7 ns | 只有 5 ns | 相当于 10 ns 周期的**半个周期** |

- 数据必须在 5 ns 内完成"FF1 的 $t_{c\text{-}q}$ + 组合逻辑 + 布线 + FF2 的 $t_{setup}$"，而不是 10 ns。
- 用"反相时钟"做设计等于**主动把时序预算砍半**，这就是工程上不建议用双沿/反相时钟做复杂逻辑的原因。
- 若确实需要双沿采样，应显式写两级时钟约束（`create_generated_clock -invert` 或用 `set_multicycle_path` 说明意图），不要依赖工具的隐式推断。

### 1.6 易错点与假设

- **假设**：上一节已明确 50% 占空比；若占空比不是 50%，半周期值随占空比变化，需按实际边沿位置算。
- 常见错误：把 `PERIOD` 约束写到**数据网线**上（应写在时钟网络）。
- 常见错误：内部产生的分频时钟不做 `create_generated_clock`，导致该时钟域路径"未约束"。

## 二、偏移约束（OFFSET）

### 2.1 定义与硬规则

课件第 32–33 页：

> 偏移约束指**数据和时钟之间**的约束，规定了外部时钟和数据输入输出引脚之间的时序关系，**只用于与 PAD 相连的信号，不能用于内部信号**。

| 类型 | 路径 | 方向 |
| --- | --- | --- |
| OFFSET IN | 输入管脚 → 同步元件 | 外部数据进芯片 |
| OFFSET OUT | 同步元件 → 输出管脚 | 芯片数据出外部 |

> [!important] 为什么"不能用于内部信号"
> 偏移约束描述的是"**芯片外部**的世界给的时序边界"（上游器件的 $t_{co}$、板级延迟、下游器件的 $t_{su}$）。内部信号没有"外部世界"，它的时序由周期约束负责。给内部信号写 OFFSET，工具要么忽略、要么报错。

### 2.2 四个方向：BEFORE / AFTER

| 约束 | 定义（课件原文要点） | 含义 |
| --- | --- | --- |
| `OFFSET_IN_BEFORE` | 输入数据比有效时钟沿**提前**多长时间准备好 | 数据在时钟沿前 $t$ 已稳定 → 芯片内部输入侧延迟上限 |
| `OFFSET_IN_AFTER` | 输入数据在有效时钟沿**之后**多长时间到达芯片输入引脚 | 同上，另一种描述方式 |
| `OFFSET_OUT_BEFORE` | 下一级芯片的输入数据应在有效时钟沿**之前**多长时间准备好 | 约束本级输出必须提前稳定（服务下级 $t_{su}$） |
| `OFFSET_OUT_AFTER` | 输出数据在有效时钟沿**之后**多长时间（上限）稳定下来 | 本级输出延迟的上限 |

> 一对 BEFORE/AFTER 描述的是**同一个时刻**，只是参考方向相反：`BEFORE + AFTER = T_period`（见下面两个例题，12+8=20、13+7=20）。

### 2.3 输入侧：数据到达时间

课件第 35 页（跨器件数据交换）：

$$T_{arrival}=T_{cko}+T_{output}+T_{logic}$$

$$T_{arrival}+T_{input}+T_{setup}<T_{period}$$

| 符号 | 含义 |
| --- | --- |
| $T_{cko}$ | **上游**器件的时钟到输出延迟 |
| $T_{output}$ | 上游器件的输出逻辑/缓冲延迟 |
| $T_{logic}$ | 两级器件之间的中间逻辑/板级延迟 |
| $T_{input}$ | 本器件输入端的组合逻辑 + 网线 + PAD 延迟 |
| $T_{setup}$ | 本器件第一级寄存器的建立时间 |

### 2.4 输入侧例题（课件第 36 页）

已知 $T_{period}=20$ ns，$T_{cko}=1$ ns，$T_{output}=3$ ns，$T_{logic}=8$ ns，求偏移约束。

$$T_{arrival}=1+3+8=12\ \text{ns}$$

```tcl
NET DATA_IN OFFSET=IN 12ns AFTER CLK;    # 数据在时钟沿后 12 ns 到达
NET DATA_IN OFFSET=IN 8ns BEFORE CLK;    # 等价写法：时钟沿前 8 ns 已就绪（20-12=8）
```

![[vault-notes/assets/05-timing-constraints-period-offset/fig-02.svg|1050]]

### 2.5 输出侧：要求的数据稳定时间

课件第 38 页：

$$T_{stable}=T_{logic}+T_{input}+T_{setup}$$

$$T_{cko}+T_{output}+T_{stable}<T_{period}$$

> 只要当前设计输出端的数据比时钟上升沿**提前 $T_{stable}$** 稳定下来，下一级就可以正确采样。
> 注意这里 $T_{input}$、$T_{setup}$ 都是**下一级**器件的参数。

### 2.6 输出侧例题（课件第 39 页）

已知 $T_{period}=20$ ns，$T_{input}=4$ ns，$T_{setup}=1$ ns，$T_{logic}=8$ ns：

$$T_{stable}=8+4+1=13\ \text{ns}$$

```tcl
NET DATA_OUT OFFSET=OUT 13ns BEFORE CLK;  # 输出须在下一时钟沿前 13 ns 稳定
NET DATA_OUT OFFSET=OUT 7ns AFTER CLK;    # 等价写法：时钟沿后 7 ns 稳定（20-13=7）
```

![[vault-notes/assets/05-timing-constraints-period-offset/fig-03.svg|1050]]

### 2.7 关键时间节点与信号变化（两图对照）

| 图 | 时刻 | 事件 |
| --- | --- | --- |
| 输入图 | 2 ns | 时钟上升沿（参考原点） |
| 输入图 | 14 ns | 外部数据到达本器件引脚（2 + 12） |
| 输入图 | 22 ns | 下一个时钟沿；数据只剩 22 − 14 = 8 ns 走完 $T_{input}+T_{setup}$ |
| 输出图 | 2 ns | 时钟上升沿 |
| 输出图 | 5 ns | 本级输出已稳定（$T_{cko}+T_{output}=3$ ns） |
| 输出图 | 9 ns | 要求稳定的**最晚时刻**（22 − 13 = 9），本例有 4 ns 余量 |
| 输出图 | 22 ns | 下一级时钟沿 |

### 2.8 例题推演：100 MHz 系统怎么填约束（课件第 41 页）

课件给出系统框图与两个延迟（Upstream → FPGA **4 ns**，FPGA → Downstream **5 ns**），提问"要让系统跑 100 MHz，Constraints Editor 里填什么值"，**页面未给答案**。这里给出推演（非课件原文）：

1. 100 MHz → $T=10$ ns；
2. 片外两段延迟合计 4 + 5 = 9 ns；
3. 留给 FPGA **内部**寄存器到寄存器的预算 = 10 − 9 = **1 ns**；
4. 因此：输入侧用 `OFFSET IN` 告诉工具"数据在沿后 4 ns 到达引脚"（或 `BEFORE` 10−4 = 6 ns）；输出侧用 `OFFSET OUT` 告诉工具"外部还要 5 ns 才能到下级"（`BEFORE` 10−5 = 5 ns）。
5. 具体数值取决于 4 ns / 5 ns 是否已包含发送端 $t_{co}$ 与接收端 $t_{su}$ —— 题目没写清，实际工程中**必须回到器件手册核对**，不能凭框图猜。

> [!question] 课堂思考
> 为什么"1 ns 内部预算"意味着这个设计很难做？——因为 FPGA 内部一个 LUT 级就要几百 ps，1 ns 只够 1–2 级逻辑，几乎必须做成纯直通/流水线寄存器。

## 三、UCF 与 Vivado XDC 对照

| 目的 | UCF（课件术语） | Vivado XDC |
| --- | --- | --- |
| 周期约束 | `NET SYS_CLK PERIOD=10ns HIGH 4ns` | `create_clock -period 10.000 -waveform {0.000 4.000} [get_ports SYS_CLK]` |
| 输入偏移 | `NET DATA_IN OFFSET=IN 12ns AFTER CLK` | `set_input_delay -clock [get_clocks CLK] -max 12.000 [get_ports DATA_IN]` |
| 输入偏移（最小） | — | `set_input_delay -clock ... -min ...` |
| 输出偏移 | `NET DATA_OUT OFFSET=OUT 13ns BEFORE CLK` | `set_output_delay -clock [get_clocks CLK] -max 13.000 [get_ports DATA_OUT]` |
| 生成时钟 | `NET CLK_DIV2 PERIOD=...` | `create_generated_clock -source [get_ports CLK] -divide_by 2 [get_pins ...]` |

> [!note] 术语提醒
> 课件是 **ISE/XST 时代**教材：`NET ... PERIOD=` / `OFFSET=` 是 UCF 语法；Vivado 全部改成 Tcl 命令（XDC）。第 45 页出现的 Constraints Editor 也是 ISE 工具界面。
> 学习时**抓原理**（谁约束哪类路径、BEFORE/AFTER 如何换算），语法差异查表即可。

## 四、易错点汇总

| 错误 | 正确做法 |
| --- | --- |
| 把 OFFSET 约束写到内部信号 | 只能用于与 PAD 相连的信号 |
| 只写 `OFFSET IN AFTER` 不写 `BEFORE`，或反之 | 两者等价，写一个即可；但**输入/输出方向要分清** |
| 认为周期约束能覆盖输入/输出路径 | 周期只管寄存器→寄存器；输入/输出必须用 OFFSET |
| 约束值拍脑袋（比实际频率紧很多） | 按真实频率 + 适当裕量；过紧会让布线时间爆炸 |
| 反相时钟仍按整周期算预算 | 按半个周期算，或改为同一沿的设计 |
| 忽略 `HIGH` 参数 | 占空比影响反相/双沿设计的可用时间 |

## 五、源课件对照

| 课件页 | 主题 | 本笔记位置 |
| --- | --- | --- |
| 28 | 周期约束（覆盖/不覆盖的路径） | 1.1 |
| 29 | 周期约束（概念、松紧取舍） | 1.2 |
| 30 | 周期约束的计算（$T_{period}$ 公式） | [[vault-notes/fpga/sta/04-timing-analysis-setup-hold#六、周期约束的计算（核心公式）|04 第六节]] |
| 31 | 周期约束命令 + 反相时钟例 | 1.3、1.4 |
| 32 | 偏移约束（定义、只用于 PAD） | 2.1 |
| 33 | 偏移约束（OFFSET IN/OUT 优化的路径） | 2.1 |
| 34 | OFFSET_IN_BEFORE / OFFSET_IN_AFTER | 2.2 |
| 35 | 输入到达时间公式 | 2.3 |
| 36 | 输入偏移例题（12ns / 8ns） | 2.4 |
| 37 | OFFSET_OUT_BEFORE / OFFSET_OUT_AFTER | 2.2 |
| 38 | 输出稳定时间公式 | 2.5 |
| 39 | 输出偏移例题（13ns / 7ns） | 2.6 |

> 源文件：深大《数字系统设计》课件《4 FPGA综合与时序收敛.ppt》第 28–39 页（第 41 页的 100 MHz 提问在第 2.8 节推演）。

## 关联

- 前置：[[vault-notes/fpga/sta/04-timing-analysis-setup-hold]]
- 下一站：[[vault-notes/fpga/sta/06-timing-exceptions-priority]]
- 时钟定义：[[vault-notes/fpga/vivado/base/06-xdc-pins-clocks]]
- 综合端约束属性：[[vault-notes/fpga/sta/03-synthesis-basics-attributes]]
- 报告判读：[[vault-notes/fpga/vivado/base/09-reports-timing-verdict]]
