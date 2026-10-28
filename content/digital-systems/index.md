---
title: 数字系统
description: 从组合/时序逻辑与 Verilog 建模语义出发，覆盖 FPGA 器件结构、Vivado 流程、静态时序分析与约束，再到 UART/FIFO/AD9361 等系统接口的学习路径。
tags:
  - digital-systems
  - index
---

## 学习范围

数字系统研究如何用逻辑门、触发器与时钟构建可靠的功能电路。落点是「可综合的 RTL」：代码要能映射成真实触发器与查找表，并在时序约束下稳定工作。

内容分四条主线。第一条是 Verilog 的建模语义：组合逻辑与时序逻辑的区别、`assign` 与 `always`、阻塞/非阻塞赋值、锁存器推断、复位策略。第二条是时序电路与状态机：寄存器、计数器、奇偶分频、按键消抖、PWM 与 Moore/Mealy 三段式状态机。第三条是器件与工具链：LUT/FF/BRAM/DSP48 资源、I/O Bank 与 MMCM/PLL 时钟资源、Vivado 从 RTL 到比特流的完整流程、建立/保持时间与周期/偏移/例外约束。第四条是系统接口：UART 帧格式与中点采样、同步/异步 FIFO、AD9361 零中频收发链与 IQ 信号、MATLAB 黄金模型与 RTL 逐点比对。

学习顺序建议：先读 [[digital-systems/verilog-basics|数字设计与 Verilog 基础]] 建立组合/时序直觉，再写 [[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]] 中的寄存器、计数器与消抖，随后进入 [[digital-systems/fsm-design|有限状态机设计]]；工具侧按 [[digital-systems/fpga-architecture-and-eda|FPGA 结构与 EDA 流程]] → [[digital-systems/vivado-design-flow|Vivado 设计流程]] → [[digital-systems/timing-analysis-and-constraints|静态时序分析与约束]] 的顺序，把「代码能跑」推进到「在指定频率下能稳定跑」；最后用 [[digital-systems/fpga-interfaces-and-ad9361|外设与射频接口]] 把模块组合成完整系统。

## 本分类文章

- [[digital-systems/verilog-basics|数字设计与 Verilog 基础]]：组合/时序逻辑、模块与端口、assign/always、阻塞与非阻塞赋值、MUX/译码器/加法器、Latch 的产生与消除。
- [[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]]：寄存器采样时刻、同步/异步复位、计数器与 tick、奇偶分频（含占空比条件）、按键消抖、流水灯与 PWM 呼吸灯。
- [[digital-systems/fsm-design|有限状态机设计]]：Moore/Mealy 时序差别、状态编码、三段式写法、序列检测器与按键消抖状态机、输出毛刺与常见错误。
- [[digital-systems/fpga-architecture-and-eda|FPGA 结构与 EDA 流程]]：CPLD 乘积项与 FPGA 查找表、I/O Bank、CMT 与 MMCM/PLL 频率相位关系、EDA 三阶段与 ASIC/FPGA 差异。
- [[digital-systems/vivado-design-flow|Vivado 设计流程]]：Project Mode 与 Flow Navigator、Sources/Top、Elaboration、行为仿真、XDC、综合、实现、时序报告与比特流下载。
- [[digital-systems/timing-analysis-and-constraints|静态时序分析与约束]]：四类时序路径、建立/保持方程与 skew、周期约束与偏移约束、伪路径/多周期与优先级、报告判读与 CDC 风险。
- [[digital-systems/fpga-interfaces-and-ad9361|外设与射频接口]]：UART/RS232 帧格式与中点采样、FIFO 缓冲、PLL 调用、AD9361 收发链与数字接口、IQ 失衡与 EVM、黄金模型验证。

## 跨学科关联

- [[signal-processing/signals-and-systems-intro|信号与系统导论]]：离散时间、采样与混叠是理解寄存器采样、UART 过采样与 ADC 接口的前提。
- [[signal-processing/dft-and-fft|DFT 与 FFT]]：FFT 的硬件实现是典型的流水线与运算单元复用问题，DSP48 与 BRAM 的使用率直接决定能否实时。
- [[communication/digital-modulation-qpsk|数字调制 QPSK]]：星座图、I/Q 正交表示与 EVM 与本文的 IQ 信号、AD9361 射频链路一一对应。
- [[projects/uart-loopback-project|UART 回环项目]]：把时序逻辑与状态机组合成可上板验证的完整接口。
- [[programming/c-pointer-and-memory|C 指针与内存]]：寄存器映射与 `volatile` 语义是软硬件交界处必须理解的部分。

> [!tip] 上板前的自检清单
> 复位极性是否正确、时钟域是否只有一条、跨时钟域是否做了同步、组合逻辑是否存在锁存器、输出是否寄存。这五项能挡掉绝大多数初学者的 bug。

## 相关阅读

- [[digital-systems/verilog-basics|数字设计与 Verilog 基础]]
- [[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]]
- [[digital-systems/fsm-design|有限状态机设计]]
- [[digital-systems/fpga-architecture-and-eda|FPGA 结构与 EDA 流程]]
- [[digital-systems/vivado-design-flow|Vivado 设计流程]]
- [[digital-systems/timing-analysis-and-constraints|静态时序分析与约束]]
- [[digital-systems/fpga-interfaces-and-ad9361|外设与射频接口]]
- [[maps/knowledge-network|跨学科知识网络]]

<!-- topic-index:start -->
## RTL、工具链与时序知识点

### FPGA 基础

- [[vault-notes/fpga/00-guide|FPGA知识库导读]]

### FPGA 基础 / ad9361

- [[vault-notes/fpga/ad9361/ad9361-architecture|AD9361 学习笔记]]
- [[vault-notes/fpga/ad9361/ad9361-digital-interface|AD9361 数字接口]]
- [[vault-notes/fpga/ad9361/iq-signals|IQ信号]]
- [[vault-notes/fpga/ad9361/iq-signals-lab-matlab-rtl|IQ信号实验实战（Matlab+RTL）]]

### FPGA 基础 / architecture

- [[vault-notes/fpga/architecture/uart-rs232|串口-UART(RS232)]]
- [[vault-notes/fpga/architecture/fifo-ip-core|FIFO核]]
- [[vault-notes/fpga/architecture/pll-ip-core|PLL IP核的调用]]

### FPGA 基础 / Verilog / 时序逻辑

- [[vault-notes/fpga/verilog/sequential/01-registers|寄存器]]
- [[vault-notes/fpga/verilog/sequential/02-blocking-vs-nonblocking-assignment|阻塞赋值和非阻塞赋值]]
- [[vault-notes/fpga/verilog/sequential/03-counters|计数器]]
- [[vault-notes/fpga/verilog/sequential/04-clock-divider-even|分频器1- 偶分频]]
- [[vault-notes/fpga/verilog/sequential/05-clock-divider-odd|分频器2 - 奇分频]]
- [[vault-notes/fpga/verilog/sequential/06-key-debounce|按键消抖]]
- [[vault-notes/fpga/verilog/sequential/07-key-debounce-fsm|按键消抖]]
- [[vault-notes/fpga/verilog/sequential/08-running-led|流水灯]]
- [[vault-notes/fpga/verilog/sequential/09-breathing-led|呼吸灯]]
- [[vault-notes/fpga/verilog/sequential/10-finite-state-machines|状态机]]

### FPGA 基础 / Verilog / 组合逻辑

- [[vault-notes/fpga/verilog/combinational/01-multiplexer|简单时序逻辑--多路选择器]]
- [[vault-notes/fpga/verilog/combinational/02-3-to-8-decoder|3-8译码器]]
- [[vault-notes/fpga/verilog/combinational/03-half-adder|半加器]]
- [[vault-notes/fpga/verilog/combinational/04-full-adder|全加器]]
- [[vault-notes/fpga/verilog/combinational/05-avoiding-latches|避免Latch(锁存器)的产生]]

### FPGA 基础 / Vivado 设计流程

- [[vault-notes/fpga/vivado/flow-navigator-guide|Flow Nevigator功能指导]]
- [[vault-notes/fpga/vivado/readme|README]]

### FPGA 基础 / Vivado 设计流程 / 基础流程

- [[vault-notes/fpga/vivado/base/01-design-flow-project-mode|设计主线与Project-Mode]]
- [[vault-notes/fpga/vivado/base/02-target-device-source-top|目标器件-Source-Top]]
- [[vault-notes/fpga/vivado/base/03-rtl-hardware-thinking|RTL-硬件思维]]
- [[vault-notes/fpga/vivado/base/04-rtl-analysis-elaboration|RTL-Analysis-Elaboration]]
- [[vault-notes/fpga/vivado/base/05-behavioral-simulation|Behavioral-Simulation]]
- [[vault-notes/fpga/vivado/base/06-xdc-pins-clocks|XDC-引脚-时钟]]
- [[vault-notes/fpga/vivado/base/07-synthesis-netlist|Synthesis-综合网表]]
- [[vault-notes/fpga/vivado/base/08-implementation-place-route|Implementation-布局布线]]
- [[vault-notes/fpga/vivado/base/09-reports-timing-verdict|Reports-与时序判定]]
- [[vault-notes/fpga/vivado/base/10-bitstream-hardware-manager|Bitstream-Hardware-Manager]]

### FPGA 基础 / 静态时序分析

- [[vault-notes/fpga/sta/00-guide|分析理论导读]]
- [[vault-notes/fpga/sta/01-design-implementation-flow|数字系统设计与实现流程]]
- [[vault-notes/fpga/sta/02-device-structure-clock-resources|FPGA器件结构与时钟资源]]
- [[vault-notes/fpga/sta/03-synthesis-basics-attributes|综合基础与综合属性]]
- [[vault-notes/fpga/sta/04-timing-analysis-setup-hold|时序分析基础-路径模型与建立保持时间]]
- [[vault-notes/fpga/sta/05-timing-constraints-period-offset|时序约束-周期约束与偏移约束]]
- [[vault-notes/fpga/sta/06-timing-exceptions-priority|时序例外约束与约束优先级]]
- [[vault-notes/fpga/sta/07-timing-analysis-cheatsheet|时序分析速查卡]]

### FPGA 基础 / basics

- [[vault-notes/fpga/basics/01-eda-technology-overview|EDA技术概述]]
- [[vault-notes/fpga/basics/02-fpga-cpld-overview|FPGA&CPLD元件概述]]

<!-- topic-index:end -->
