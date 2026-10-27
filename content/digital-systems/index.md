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
