---
title: Vivado 设计流程
description: 以 Project Mode 为主线串起 Vivado 从工程建立、RTL 分析、行为仿真、XDC 约束、综合、实现、时序报告到比特流下载的完整闭环，并给出每一步的输入输出、通过标准与常见错误。
tags:
  - digital-systems
  - fpga
  - vivado
---

## 为什么需要一个"最小闭环"

第一次用 Vivado 最容易陷入两种极端：要么只会点 Next，不知道每一步在做什么；要么把全部功能都学一遍，却始终没有跑通过一个完整设计。正确策略是先跑通**最小闭环**：一个带复位的 LED 闪烁设计，从 Verilog 到 `.bit`，中间每一步都能回答"输入是什么、输出是什么、怎样算通过、出错先看哪里"。

本文按 Flow Navigator 的顺序组织。文中界面截图来自课程笔记，**不是仿真波形**；代码与约束是等价示例，引脚号必须按实际开发板替换，不能照抄。

## Project Mode 与 Flow Navigator

Vivado 的工程模式（Project Mode）统一管理源码、约束、仿真集以及 synth_1/impl_1 运行。Flow Navigator 不是综合算法，而是工程模式下**启动不同设计任务**的界面。典型顺序：

| Flow Navigator 分组 | 做什么 | 产物/检查点 |
| --- | --- | --- |
| Project Manager | 建立工程、管理 Sources/Constraints/Simulation、查看 Design Runs 与 Messages | 工程结构与运行状态 |
| RTL Analysis | 展开（elaborate）RTL，检查层级、端口、锁存器警告 | Elaborated Design（尚未映射到 LUT/FF） |
| Simulation | 跑行为仿真（功能仿真） | 波形、Testbench 打印 |
| Constraints（XDC） | 时钟、引脚、电平与时序例外 | XDC 文件，DRC 检查 |
| Synthesis | 逻辑综合，生成 LUT/FF 网表 | Synthesized Design、资源报告 |
| Implementation | 布局布线，得到真实延迟 | Implemented Design、时序报告 |
| Program and Debug | 生成比特流并下载 | 比特流文件、Hardware Manager |

不要在一开始混用 Project Mode 与 Non-Project Tcl 流：两种流程的目录结构、约束加载方式和脚本入口都不同，首轮只学工程模式。不同器件、工程类型或版本之间菜单会略有差别。

## 第一步：工程、器件与顶层

三类文件集合必须分清：

- **Design Sources**：参与综合的 RTL（例如 `led_blink.v`）；
- **Simulation Sources**：只用于仿真的 Testbench（如 `tb_led_blink.v`）；
- **Constraints**：XDC 约束文件。

Top Module 是综合的入口，Testbench Top 是仿真的入口，**两者不是同一件事**。选中器件有两种方式：选 Board（开发板配置文件会带引脚与时钟信息）或选 Part（芯片精确型号 + 封装 + 速度等级）。没有 Board 文件时必须按芯片型号选 Part；不能只选"同一系列"，因为封装、速度等级、引脚表都必须与实际器件一致。

一个与课程示例等价的 LED 闪烁设计（100 MHz 时钟，每 0.5 s 翻转一次）：

```verilog
module led_blink #(
    parameter integer CLK_HZ = 100_000_000
)(
    input  wire clk,
    input  wire rst_n,
    output reg  led
);
    // 0.5 s 对应的时钟个数：100 MHz x 0.5 s = 50,000,000
    localparam integer HALF_PERIOD = CLK_HZ / 2;

    reg [31:0] cnt;

    always @(posedge clk or negedge rst_n)
        if (!rst_n) begin
            cnt <= 32'd0;
            led <= 1'b0;
        end else if (cnt == HALF_PERIOD - 1) begin
            cnt <= 32'd0;
            led <= ~led;              // 每 0.5 s 翻转
        end else
            cnt <= cnt + 1'b1;

endmodule
```

需要能回答的问题：时钟周期是多少（100 MHz 对应 10 ns）；计数器计到多少翻转（49,999,999，即每 50,000,000 个周期翻转一次）；为什么输出不是每个时钟都翻转（人眼可观察的闪烁需要毫秒到秒级，必须靠计数器分频）。

## 第二步：RTL Analysis / Elaboration

Elaboration 把 RTL 展开成设计层级与逻辑结构，用来提前发现"模块没找到、Top 不对、端口不匹配、组合逻辑推断锁存器"等结构问题。它**还没有**把逻辑映射成最终的 LUT/FF。可以打开 Schematic 与 Hierarchy 查看模块连接，也可以在 Messages 中筛选 Warning 与 Critical Warning。

![Vivado 的 Elaborated Design 界面截图：RTL 分析阶段可以查看层级与示意图，用于在综合前发现结构问题；这是工具界面截图，不是仿真波形](vault-notes/assets/04-rtl-analysis-elaboration/fig-01.png)

注意：展开成功不代表逻辑功能正确，更不代表后端时序能达标；它只回答"设计结构连得上吗"。

## 第三步：Behavioral Simulation（行为仿真）

仿真阶段的目标是**不依赖开发板验证功能**。DUT（被测设计）是 `led_blink`，Testbench 负责产生时钟与复位、施加激励、自动检查预期结果。仿真关注时间轴（ns）、激励与波形；它无法证明物理布线满足时序，也不能替代板级 I/O 验证。

Testbench 的基本结构：产生时钟（如 `always #5 clk = ~clk;` 对应 100 MHz）、上电复位若干周期、释放复位、等待若干时钟沿后检查 LED 是否翻转，最后用 testbench 的显示任务打印 PASS，或用 fatal 系统任务在失败时立即终止仿真（系统任务在 Verilog 中以美元符号开头）。用"故意改错检查条件"可以验证 Testbench 本身有效——如果改错了仍然打印 PASS，说明测试没有真正执行。

![Vivado 行为仿真界面截图：显示 DUT 层级、波形窗口与仿真控制台；波形来自 Testbench 激励下的 RTL 行为仿真，与门级仿真或板级现象不同](vault-notes/assets/05-behavioral-simulation/fig-01.png)

常见问题：波形时长太短看不到翻转、没有选择仿真 Top、忘记把信号加入波形窗口、仿真参数与硬件参数混淆（例如仿真里把时钟频率改小加速，却忘了上板要恢复真实值）。

## 第四步：XDC：引脚、电平与时钟

XDC 是设计约束，不是 Verilog 逻辑。首轮只需掌握三类命令：

```tcl
# 1) 主时钟约束：100 MHz，周期 10.000 ns
create_clock -period 10.000 [get_ports clk]

# 2) 物理引脚与电平标准（示例：引脚号必须按开发板原理图填写）
set_property PACKAGE_PIN <引脚号> [get_ports clk]
set_property IOSTANDARD LVCMOS33 [get_ports clk]

set_property PACKAGE_PIN <引脚号> [get_ports rst_n]
set_property IOSTANDARD LVCMOS33 [get_ports rst_n]

set_property PACKAGE_PIN <引脚号> [get_ports led]
set_property IOSTANDARD LVCMOS33 [get_ports led]
```

- `create_clock` 的周期必须等于板上晶振的实际频率；100 MHz 写作 10.000 ns。周期写错，后面所有时序报告都失去意义。
- `PACKAGE_PIN` 是物理封装引脚，`IOSTANDARD` 是接口电平；两者都必须来自开发板官方原理图或主约束文件，**绝不能凭示例猜测**。
- `get_ports` 对应顶层端口，不是内部信号；端口改名后约束会失效，注意同步检查。
- 复位按键的有效电平也要核实：代码写低有效，而板卡按键可能上拉、按下为低，二者必须一致。

约束写完后检查顶层端口是否全部覆盖、是否存在冲突，并查看 DRC 报告。这一部分的理论背景（周期约束、偏移约束、时钟偏斜）见 [[digital-systems/timing-analysis-and-constraints|静态时序分析与约束]]。

## 第五步：Synthesis（综合）

Run Synthesis 对 RTL 做优化，并为选定器件生成逻辑网表（LUT/FF/BRAM/DSP 的映射关系已经确定，但还没有物理位置与布线延迟）。综合后可打开 Synthesized Design，查看 Utilization Report 与 Schematic，对照 RTL 里的计数器与触发器，确认没有意外推断（例如锁存器、意料之外的 DSP 或 BRAM 使用）。

![Vivado 综合后的界面截图：可查看综合网表、资源利用率与警告信息；综合成功只代表逻辑可映射到器件资源，不代表实现后时序达标](vault-notes/assets/07-synthesis-netlist/fig-01.png)

要把综合阶段和实现阶段分开看：综合回答"这段逻辑能不能变成器件资源"，实现回答"这些资源放在哪、线怎么走、延迟多少"。综合成功之后才发现时序不收敛，是完全正常的。

## 第六步：Implementation（布局布线）

Implementation 通常包含设计优化、布局（Placement）与布线（Routing），也可能包含可选的物理优化。工具根据器件结构与 XDC 约束放置逻辑、连接走线；**延迟在这一步才变成可评估的实际对象**，这也是实现比综合耗时更久的原因。

![Vivado 实现完成后的界面截图：打开 Implemented Design 可查看器件视图、关键路径与布线结果；实现成功不等于满足所有时序要求](vault-notes/assets/08-implementation-place-route/fig-01.png)

成功后打开 Implemented Design，进入 Device 视图可以观察布局与关键路径；在 Design Runs 窗口确认 impl_1 的状态。实现阶段常见的问题是"成功但违例"：工具完成了布局布线，但时序报告里 WNS 为负。

## 第七步：Reports 与时序判定

"完成""正确""性能满足要求"是三种不同判断，必须分别看：

- **Design Runs**：synth_1 / impl_1 是否完成；
- **Messages**：Warning / Critical Warning 中有没有必须修的问题；
- **Timing Summary**：WNS（最差建立余量）、TNS（负裕量累计）、WHS/THS（保持检查）、Unconstrained Paths（未约束路径）；
- **Utilization**：LUT/FF/BRAM/DSP 使用率；
- **DRC**：设计规则检查，例如引脚冲突、时钟未约束。

WNS ≥ 0、TNS = 0 只是**建立方向**的基础判据，还必须同时确认保持检查与未约束路径。**"实现完成而 WNS < 0，不能宣布设计达标"**；反过来，WNS 非负也不能证明"100% 时序正确"——漏约束的路径、误配的伪路径、hold 违例都可能仍存在。

![Vivado 时序报告界面截图：Timing Summary 给出 WNS/TNS/WHS/THS，并列出未约束路径数量；判读前先确认约束与时钟定义是否正确](vault-notes/assets/09-reports-timing-verdict/fig-01.png)

练习方法：临时把时钟周期从 10 ns 收紧到 1 ns（仅用于观察），重新实现看报告如何变化；确认理解后再恢复真实周期。这类实验能直观看出"约束是工具优化与判定的输入"。

## 第八步：Bitstream 与 Hardware Manager

Generate Bitstream 生成设备配置数据；传统 FPGA 使用 `.bit` 文件。通过 Hardware Manager 连接硬件目标（Auto Connect 或手动指定），选中器件后 Program Device 并选择正确的配置文件。需要真实开发板、供电、USB/JTAG 连接与正确驱动。

成功下载后要做的是**板级验证**：LED 是否按 1 s 周期闪烁、复位按键极性是否符合预期、时钟频率是否与约束一致。没有开发板时，只能记录为"比特流生成通过，硬件验证未完成"，**不能写成"上板成功"**。

![Vivado Hardware Manager 界面截图：连接目标、选择器件并下载配置文件；这一阶段的问题多与驱动、连接、器件型号和引脚分配有关，而不是 RTL 逻辑](vault-notes/assets/10-bitstream-hardware-manager/fig-01.png)

## 十步流程速查

| 步骤 | 输入 | 输出 | 通过标准 | 常见错误 |
| --- | --- | --- | --- | --- |
| 建工程 | 需求、器件型号 | 工程结构 | Part/Top 正确 | 选错封装或速度等级 |
| 加源码 | RTL、TB | Sources 集合 | 三类文件各就各位 | 把 TB 当综合顶层 |
| RTL 硬件思维 | 代码 | 资源与周期估算 | 能解释计数器与时钟关系 | 忽略位宽与复位极性 |
| Elaboration | RTL | 展开后的层级 | 无缺失模块/端口错误 | 展开成功就以为功能对 |
| 行为仿真 | RTL + TB | 波形与 PASS | 关键用例通过 | 仿真参数与硬件参数混用 |
| XDC | 原理图、晶振频率 | 约束文件 | 时钟/引脚/电平齐全 | 照抄别的板子引脚 |
| 综合 | RTL + XDC | LUT/FF 网表 | 资源合理、无锁存器警告 | 把综合成功当完成 |
| 实现 | 网表 + XDC | 布局布线结果 | impl_1 完成 | 不看时序就下载 |
| 报告 | 实现结果 | 时序/资源/DRC | WNS≥0 且无未约束路径 | 只看 WNS 忽略 hold |
| 比特流 | 实现结果 | `.bit` | 生成无关键错误 | 无板卡却声称"上板成功" |

## 前置与相关

- 前置：[[digital-systems/verilog-basics|数字设计与 Verilog 基础]] 与 [[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]]（能写出带复位的计数器）。
- 器件与流程背景：[[digital-systems/fpga-architecture-and-eda|FPGA 结构与 EDA 流程]]（LUT/FF/BRAM/DSP、CMOS 与 ASIC 流程）。
- 约束与判定理论：[[digital-systems/timing-analysis-and-constraints|静态时序分析与约束]]（周期/偏移约束、例外、WNS 判读）。
- 状态机：[[digital-systems/fsm-design|有限状态机设计]]。
- 系统案例：[[projects/uart-loopback-project|UART 回环项目]] 与 [[digital-systems/fpga-interfaces-and-ad9361|外设与射频接口]]，把本流程用于真实接口设计。

## 来源与延伸阅读

- [[vault-notes/fpga/vivado/readme|Vivado Flow Navigator · 20 小时 BASE 库]]：学习顺序、最小实验项目与官方资料清单。
- [[vault-notes/fpga/vivado/flow-navigator-guide|Flow Navigator 功能指导]]：分组菜单速览。
- [[vault-notes/fpga/vivado/base/01-design-flow-project-mode|01 · 设计主线与 Project Mode]]、[[vault-notes/fpga/vivado/base/02-target-device-source-top|02 · 目标器件、Sources 与 Top]]：工程与器件。
- [[vault-notes/fpga/vivado/base/04-rtl-analysis-elaboration|04 · RTL Analysis]] 与 [[vault-notes/fpga/vivado/base/05-behavioral-simulation|05 · 行为仿真]]：结构检查与功能验证。
- [[vault-notes/fpga/vivado/base/06-xdc-pins-clocks|06 · XDC 引脚与时钟]]：约束写法与板级核对。
- [[vault-notes/fpga/vivado/base/07-synthesis-netlist|07 · 综合]]、[[vault-notes/fpga/vivado/base/08-implementation-place-route|08 · 布局布线]]、[[vault-notes/fpga/vivado/base/09-reports-timing-verdict|09 · 报告与时序判定]]、[[vault-notes/fpga/vivado/base/10-bitstream-hardware-manager|10 · 比特流与硬件管理器]]。
