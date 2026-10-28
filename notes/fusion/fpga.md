# FPGA / Verilog / 数字电路 · 融合台账

- 学科批次：fpga-verilog（45 篇源笔记）
- 目标目录：content/digital-systems/
- 已交付文章：verilog-basics.md、verilog-sequential-logic.md（重写）、fsm-design.md（重写）、fpga-architecture-and-eda.md、vivado-design-flow.md、timing-analysis-and-constraints.md、fpga-interfaces-and-ad9361.md
- 索引页人工部分已更新（topic-index 标记块未动）
- 说明：状态按 notes/fusion/SPEC.md 口径；「正文完成」指笔记中决定结论的解释、推导、例题、图、代码已进入目标文章对应章节，而非仅列链接。

| 源笔记 | 核心概念 | 目标文章 | 目标章节 | 动作 | 状态 |
| --- | --- | --- | --- | --- | --- |
| vault-notes/fpga/00-guide.md | FPGA 子库知识地图、学习顺序、与 DSP/通信/MATLAB 的接口 | content/digital-systems/fpga-architecture-and-eda.md | 「前置与相关」「来源与延伸阅读」；其余 6 篇复用其学习路线 | 重排为四条主线的学习路径；保留跨库接口表 | 正文完成 |
| vault-notes/fpga/basics/01-eda-technology-overview.md | EDA 三阶段（CAD/CAE/EDA）、设计流程、top-down/bottom-up、IP 核软固硬核、功能仿真 vs 时序仿真 vs STA | content/digital-systems/fpga-architecture-and-eda.md | 「EDA 流程总览」「三种验证不要混」「IP 核复用」 | 压缩为流程主线，保留三阶段与三类验证对照表 | 正文完成 |
| vault-notes/fpga/basics/02-fpga-cpld-overview.md | PLD 分类（SPLD/CPLD/FPGA）、PROM/PLA/PAL/GAL、乘积项 vs 查找表 | content/digital-systems/fpga-architecture-and-eda.md | 「从 PLD 到 FPGA：两种实现机理」 | 补 LUT=真值表 RAM 的原理与四类资源对应 | 正文完成 |
| vault-notes/fpga/verilog/combinational/01-multiplexer.md | 二选一 MUX 的 RTL、testbench、XDC、传播延迟与毛刺 | content/digital-systems/verilog-basics.md | 「模块、端口与两种赋值方式」 | 保留 MUX 代码与图；补 testbench 与 Tpd 说明 | 正文完成 |
| vault-notes/fpga/verilog/combinational/02-3-to-8-decoder.md | 3-8 译码器 one-hot 输出、竞争冒险 | content/digital-systems/verilog-basics.md | 「3-8 译码器」 | if-else 链改写为 case 版本并保留 default；补冒险说明 | 正文完成 |
| vault-notes/fpga/verilog/combinational/03-half-adder.md | 半加器 sum/cout 逻辑、不能直接级联 | content/digital-systems/verilog-basics.md | 「半加器与全加器」 | 保留 assign 代码与真值表 | 正文完成 |
| vault-notes/fpga/verilog/combinational/04-full-adder.md | 两个半加器 + 或门构成全加器、层次化例化、延迟累加 | content/digital-systems/verilog-basics.md | 「半加器与全加器」「4 位行波进位加法器」 | 保留级联代码；补进位链与流水线动机 | 正文完成 |
| vault-notes/fpga/verilog/combinational/05-avoiding-latches.md | Latch 推断原因、三种消除方法、综合报告检查 | content/digital-systems/verilog-basics.md | 「Latch 是怎么被推断出来的」「易错点清单」 | 保留错误/正确代码与图；补为什么危险 | 正文完成 |
| vault-notes/fpga/verilog/sequential/01-registers.md | 异步复位寄存器、采样时刻、晚一拍、建立保持 | content/digital-systems/verilog-sequential-logic.md | 「寄存器：采样时刻与输出延迟」 | 保留 RTL 与图；补 Tclk/Tco/边沿/极性四要素 | 正文完成 |
| vault-notes/fpga/verilog/sequential/02-blocking-vs-nonblocking-assignment.md | 阻塞与非阻塞执行语义、两级寄存器合并问题 | content/digital-systems/verilog-basics.md | 「阻塞赋值与非阻塞赋值：执行语义」；时序篇仅引用 | 保留对照代码与波形图；补事件队列解释与采样表 | 正文完成 |
| vault-notes/fpga/verilog/sequential/03-counters.md | 参数化计数器、使能保持、计满归零 | content/digital-systems/verilog-sequential-logic.md | 「计数器与单周期使能（tick）」 | 保留计数器代码与图；补 tick 发生器文字说明 | 正文完成 |
| vault-notes/fpga/verilog/sequential/04-clock-divider-even.md | 偶分频 DIV/2 翻转、50% 占空比条件 | content/digital-systems/verilog-sequential-logic.md | 「偶数分频：50% 占空比是怎么来的」 | 保留代码；补占空比推导与门控时钟建议 | 正文完成 |
| vault-notes/fpga/verilog/sequential/05-clock-divider-odd.md | 双沿奇分频、两路相或得 50% 占空比 | content/digital-systems/verilog-sequential-logic.md | 「奇数分频：为什么必须用两个时钟沿」 | 保留代码；补 DIV=5 的 2.5 周期推导与多沿设计风险 | 正文完成 |
| vault-notes/fpga/verilog/sequential/06-key-debounce.md | 计数器延时消抖、20 ms 判据、key_flag 单周期 | content/digital-systems/verilog-sequential-logic.md | 「按键消抖：把 20 ms 的抖动挡在门外」 | 保留 RTL 与图；补 CNT_MAX 计算与状态机版对照指引 | 正文完成 |
| vault-notes/fpga/verilog/sequential/07-key-debounce-fsm.md | 四状态消抖状态机、抖动回退、单周期脉冲 | content/digital-systems/fsm-design.md | 「例题二：用状态机做按键消抖」「两种实现取舍表」 | 保留完整状态机代码与图；补与计数器版对比 | 正文完成 |
| vault-notes/fpga/verilog/sequential/08-running-led.md | 定时器 + 循环移位流水灯、位拼接方向 | content/digital-systems/verilog-sequential-logic.md | 「流水灯：定时器 + 循环移位」 | 保留代码与图；补方向互换与位宽说明 | 正文完成 |
| vault-notes/fpga/verilog/sequential/09-breathing-led.md | 三级计时器、PWM 占空比、人眼闪烁频率、分辨率折中 | content/digital-systems/verilog-sequential-logic.md | 「呼吸灯：PWM 的周期、分辨率与更新率」 | 代码压缩为 PWM 核心 + 计时器说明；保留参数关系与图 | 正文完成 |
| vault-notes/fpga/verilog/sequential/10-finite-state-machines.md | 三段式状态机、定时器使能、next_state 输出 | content/digital-systems/fsm-design.md | 「三段式写法」「状态机与其他时序逻辑的组合」 | 保留 sequence/LED 两例；补 Moore/Mealy 时序差别 | 正文完成 |
| vault-notes/fpga/architecture/uart-rs232.md | UART 帧格式、RS-232 电平、波特率误差、半位复检/中点采样、16x 过采样、亚稳态与打两拍、收发状态机 | content/digital-systems/fpga-interfaces-and-ad9361.md | 「UART/RS232：协议层与电气层要分开」各小节 | 融合为帧格式→位时间→分频误差→接收采样→CDC 注意；保留 3 张图 | 正文完成 |
| vault-notes/fpga/architecture/fifo-ip-core.md | 同步/异步 FIFO、FWFT 与标准读延迟、位宽深度换算、状态标志、跨时钟域 | content/digital-systems/fpga-interfaces-and-ad9361.md | 「FIFO IP 核：跨时钟域与速率匹配」 | 压缩配置表；保留跨时钟域/位宽适配图与例化要点 | 正文完成 |
| vault-notes/fpga/architecture/pll-ip-core.md | 仅有标题、无正文 | content/digital-systems/fpga-interfaces-and-ad9361.md | 「PLL/MMCM：时钟从哪来」 | 排除（源笔记为空）：按 sta/02 与 Vivado 流程补足通用调用要点并注明来源缺口 | 排除 |
| vault-notes/fpga/vivado/readme.md | BASE 库学习顺序、最小实验项目、官方资料、首轮不学清单 | content/digital-systems/vivado-design-flow.md | 「为什么需要一个最小闭环」「来源与延伸阅读」 | 把 20 小时清单重排为十步主线与通过标准 | 正文完成 |
| vault-notes/fpga/vivado/flow-navigator-guide.md | Flow Navigator 七个分组标题 | content/digital-systems/vivado-design-flow.md | 「Project Mode 与 Flow Navigator」 | 部分融合（目录式摘录）：与 base 十章合并成功能表 | 部分融合 |
| vault-notes/fpga/vivado/base/01-design-flow-project-mode.md | Project Mode、Flow Navigator 全貌、Design Runs/Messages/Tcl Console | content/digital-systems/vivado-design-flow.md | 「Project Mode 与 Flow Navigator」 | 扩展为分组功能表与产物/检查点 | 正文完成 |
| vault-notes/fpga/vivado/base/02-target-device-source-top.md | Design/Simulation/Constraints 三类文件、Top 与 Board/Part | content/digital-systems/vivado-design-flow.md | 「第一步：工程、器件与顶层」 | 保留三类文件与 Top 区分；补选 Part 的封装/速度等级要求 | 正文完成 |
| vault-notes/fpga/vivado/base/03-rtl-hardware-thinking.md | module/port、wire/reg、组合与时序、时钟周期与 HALF_PERIOD 推导 | content/digital-systems/vivado-design-flow.md | 「第一步」中的 led_blink 示例与推导问题 | 补等价 RTL 与 0.5 s 计数推导 | 正文完成 |
| vault-notes/fpga/vivado/base/04-rtl-analysis-elaboration.md | Elaboration 与 Synthesized 区别、Schematic/Hierarchy、Messages | content/digital-systems/vivado-design-flow.md | 「第二步：RTL Analysis / Elaboration」 | 保留界面截图与'展开成功≠功能正确'结论 | 正文完成 |
| vault-notes/fpga/vivado/base/05-behavioral-simulation.md | DUT/TB、行为仿真、PASS/$fatal、仿真参数与硬件参数混淆 | content/digital-systems/vivado-design-flow.md | 「第三步：Behavioral Simulation」 | 保留截图与出题式通过标准；补 TB 结构说明 | 正文完成 |
| vault-notes/fpga/vivado/base/06-xdc-pins-clocks.md | create_clock、PACKAGE_PIN、IOSTANDARD、get_ports、DRC | content/digital-systems/vivado-design-flow.md | 「第四步：XDC：引脚、电平与时钟」 | 整理为 Tcl 示例与四条核对清单 | 正文完成 |
| vault-notes/fpga/vivado/base/07-synthesis-netlist.md | 综合网表、LUT/FF/BRAM/DSP 资源、Utilization | content/digital-systems/vivado-design-flow.md | 「第五步：Synthesis（综合）」 | 保留截图；补'综合不等于实现'的边界 | 正文完成 |
| vault-notes/fpga/vivado/base/08-implementation-place-route.md | Placement/Routing、Device 视图、实现比综合慢的原因 | content/digital-systems/vivado-design-flow.md | 「第六步：Implementation（布局布线）」 | 保留截图；补'成功但违例'现象 | 正文完成 |
| vault-notes/fpga/vivado/base/09-reports-timing-verdict.md | Design Runs、Messages、WNS/TNS/WHS、Unconstrained Paths、DRC | content/digital-systems/vivado-design-flow.md | 「第七步：Reports 与时序判定」 | 扩展三层判断（完成/正确/达标）与练习方法 | 正文完成 |
| vault-notes/fpga/vivado/base/10-bitstream-hardware-manager.md | 比特流生成、Hardware Manager、Auto Connect/Program、无板卡时如何记录 | content/digital-systems/vivado-design-flow.md | 「第八步：Bitstream 与 Hardware Manager」「十步流程速查」 | 保留截图；补'不声称上板成功'的表述约束 | 正文完成 |
| vault-notes/fpga/sta/00-guide.md | 课程来源、知识地图、九张时序图清单、勘误汇总 | content/digital-systems/timing-analysis-and-constraints.md | 「为什么需要约束」「来源与延伸阅读」 | 提取主线与图清单；理论图统一标注为 WaveDrom 示意 | 正文完成 |
| vault-notes/fpga/sta/01-design-implementation-flow.md | 三层抽象（Behavioral/Structural/Physical）、两个仿真检查点、SPICE 反相器与 tpHL/tpLH、ASIC/FPGA 对照 | content/digital-systems/fpga-architecture-and-eda.md | 「三层抽象与 ASIC/FPGA 的差异」 | 保留 tp 定义与一阶估算；补 PMOS/NMOS 宽度比解释 | 正文完成 |
| vault-notes/fpga/sta/02-device-structure-clock-resources.md | HP/HR/HD Bank、FGG484 分布、CMT=MMCM+PLL、f_VCO 公式、45° 相位抽头、locked | content/digital-systems/fpga-architecture-and-eda.md | 「I/O Bank 与时钟资源分布」「CMT」「locked 与复位释放」 | 保留器件结构文字图、MMCM/PLL 对照表与例题/图 | 正文完成 |
| vault-notes/fpga/sta/03-synthesis-basics-attributes.md | 优化目标/强度、5 个全局时序属性、四类路径、7 个 Xilinx 专用参数 | content/digital-systems/timing-analysis-and-constraints.md | 「综合属性如何影响时序」 | 压缩为一段+r路径归属；保留'RTL 结构决定上限'的结论 | 正文完成 |
| vault-notes/fpga/sta/04-timing-analysis-setup-hold.md | 时序路径起点/终点、四类路径、tsu/thold/tco、发起/捕获沿、周期方程、fmax 例题、slack、报告 worst/best | content/digital-systems/timing-analysis-and-constraints.md | 「时序路径模型」「建立/保持与两个检查」「周期约束」「读时序报告」 | 保留主推公式、符号陷阱与 66.67 MHz 例题；3 图取 2 | 正文完成 |
| vault-notes/fpga/sta/05-timing-constraints-period-offset.md | PERIOD 覆盖范围、松紧取舍、反相时钟半周期、OFFSET 只用于 PAD、BEFORE/AFTER、输入到达/输出稳定例题、UCF↔XDC | content/digital-systems/timing-analysis-and-constraints.md | 「周期约束」「偏移约束」「100 MHz 内部预算」 | 保留 12/8 与 13/7 例题与等价写法；补 1 ns 预算推演 | 正文完成 |
| vault-notes/fpga/sta/06-timing-exceptions-priority.md | 伪路径不可敏化、多周期预定标计数器、逐引脚偏移、六级优先级 | content/digital-systems/timing-analysis-and-constraints.md | 「时序例外：把不该赶的路径摘出来」 | 保留 MUX 互锁例、setup/hold 成对设置与优先级表 | 正文完成 |
| vault-notes/fpga/sta/07-timing-analysis-cheatsheet.md | 公式表、命令对照、四类路径归属、报告清单、自检十问 | content/digital-systems/timing-analysis-and-constraints.md | 「读时序报告」「自检」段落与各公式 | 合并进正文，不单列重复表格 | 正文完成 |
| vault-notes/fpga/ad9361/ad9361-architecture.md | 零中频收发链、RF PLL/BBPLL、抽取/插值公式、FDD/TDD、校准、增益与调试路径 | content/digital-systems/fpga-interfaces-and-ad9361.md | 「AD9361：从射频到 IQ 的完整信号链」各小节 | 融合信号链、采样率关系、三组频率概念、调试顺序 | 正文完成 |
| vault-notes/fpga/ad9361/ad9361-digital-interface.md | SPI 控制面 vs 并行数据面、P0/P1/FRAME/DATA_CLK、CMOS/LVDS、SDR/DDR、吞吐率、解包分层、测试模式 | content/digital-systems/fpga-interfaces-and-ad9361.md | 「数字接口：控制面与数据面」 | 压缩信号表为段落；保留四维度、1.47 Gbit/s 例与 FPGA 分层 | 正文完成 |
| vault-notes/fpga/ad9361/iq-signals.md | 正交基、解析信号、正负频率、星座图、脉冲成形、EVM/IRR、IQ 失衡模型 | content/digital-systems/fpga-interfaces-and-ad9361.md | 「IQ 信号、镜像与调制失真」 | 保留 x=I+jQ、单边带相消结论、失衡模型与失真形态图；公式细节留在详细笔记 | 正文完成 |
| vault-notes/fpga/ad9361/iq-signals-lab-matlab-rtl.md | 黄金模型、接口契约表、PRBS7、SCALE=256 星座表、xsim 三步、逐点比对、生产参数验证 | content/digital-systems/fpga-interfaces-and-ad9361.md | 「用黄金模型验证数字调制链路」 | 保留契约表核心行、PRBS 校验方法、验收证据链；明确本站未执行仿真 | 正文完成 |

## 未融合 / 排除项

| 源笔记 | 原因 | 处理 |
| --- | --- | --- |
| vault-notes/fpga/architecture/pll-ip-core.md | 源笔记只有 frontmatter 标题，无正文 | 在 fpga-interfaces-and-ad9361.md「PLL/MMCM」按 sta/02 与 Vivado 流程补足通用调用要点，并明确标注来源缺口 |
| vault-notes/fpga/vivado/flow-navigator-guide.md | 目录式摘录（仅七个分组标题） | 与 vivado/base 十章合并为 Flow Navigator 功能表，状态记为部分融合 |

## 风险与说明

1. 所有 WaveDrom 预渲染 SVG（sta、时序逻辑、组合逻辑系列）在正文中均标注为**理论示意图，不是 RTL 仿真波形**；回避了「已仿真验证」的表述。
2. AD9361 与 IQ 实验部分只陈述笔记中的方法、参数与预期现象；未声称执行过 xsim、上板或射频实测。
3. 源笔记中的课件拼写/符号存疑（Write Timing Constrains、data arrived time 负号、HIGH 4ns 与 50% 占空比矛盾、skew 定义）已在正文中说明取舍，未照抄为正确结论。
4. 五篇新建文章的文件名均为小写短横线；frontmatter 用中文 title；块级公式 $$ 独占一行；双链与图片路径按 content 根路径写全。
5. 两篇重写文章保留了原 slug，避免断链；原索引中的两条文章链接仍有效。
6. 本批次未运行 build/verify（由 Lead 统一验证）；仅运行只读的 scripts/check-links-source.mjs。

## 交付文件与大小

| 文件 | 字节数 |
| --- | --- |
| content/digital-systems/verilog-basics.md | 16047 |
| content/digital-systems/verilog-sequential-logic.md | 19534 |
| content/digital-systems/fsm-design.md | 13418 |
| content/digital-systems/fpga-architecture-and-eda.md | 15021 |
| content/digital-systems/vivado-design-flow.md | 14388 |
| content/digital-systems/timing-analysis-and-constraints.md | 16650 |
| content/digital-systems/fpga-interfaces-and-ad9361.md | 17997 |
| content/digital-systems/index.md | 8901 |
| notes/fusion/fpga.md | 见本文件 |

> 长度说明：8–16 KB 的目标以「有效正文」衡量；verilog-sequential-logic.md 与 fpga-interfaces-and-ad9361.md 因需保留完整 RTL、表格与系统链路，文件字节略高于 16 KB，散文部分仍在范围内。
