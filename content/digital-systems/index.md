---
title: 数字系统
description: 数字逻辑与可综合 RTL 的学习范围，覆盖 Verilog 时序建模、复位策略与有限状态机设计。
tags:
  - digital-systems
  - index
---

## 学习范围

数字系统研究如何用逻辑门、触发器与时钟构建可靠的功能电路。落点是「可综合的 RTL」：代码要能映射成真实触发器与查找表，并在时序约束下稳定工作。

内容分两条主线。第一条是 Verilog 的建模语义：组合逻辑与时序逻辑的区别、`always` 块与阻塞/非阻塞赋值、异步复位与同步释放、建立与保持时间。第二条是有限状态机（FSM）：Moore 与 Mealy 的区别、三段式写法、状态编码与输出寄存化抗毛刺。

学习顺序：先写寄存器与计数器，再写状态机，最后组合成完整接口模块（如 UART、SPI）。每个模块都用仿真波形检查复位后第一个周期与边界条件。

## 本分类文章

- [[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]]：非阻塞赋值、复位策略与建立保持时间。
- [[digital-systems/fsm-design|有限状态机设计]]：Moore/Mealy 对比、三段式写法与状态编码。

## 跨学科关联

- [[signal-processing/dft-and-fft|DFT 与 FFT]]：FFT 的硬件实现是典型的流水线与时序设计问题，运算单元必须按时钟节拍复用。
- [[projects/uart-loopback-project|UART 回环项目]]：把时序逻辑与状态机组合成可上板验证的完整接口。
- [[programming/c-pointer-and-memory|C 指针与内存]]：寄存器映射与 volatile 语义是软硬件交界处必须理解的部分。

> [!tip] 上板前的自检清单
> 复位极性是否正确、时钟域是否只有一条、跨时钟域是否做了同步、组合逻辑是否存在锁存器、输出是否寄存。这五项能挡掉绝大多数初学者的 bug。

## 相关阅读

- [[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]]
- [[digital-systems/fsm-design|有限状态机设计]]
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
