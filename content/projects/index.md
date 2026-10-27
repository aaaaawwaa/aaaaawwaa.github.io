---
title: 项目实战
description: 可复现的电子信息工程项目记录，包含系统结构、关键代码、验证步骤与常见问题排查。
tags:
  - projects
  - index
---

## 学习范围

本分类记录做完的、可复现的工程项目。每个项目都尽量写清楚：目标与验收标准、系统结构、关键代码、验证方法与踩过的坑。判断一个项目记录是否合格，标准是"另一个人照着做能重现结果"。

目前收录基于 FPGA 的 UART 回环测试。这类项目虽然简单，却把数字系统设计的主要环节都串了起来：分频与节拍生成、发送/接收状态机、跨时钟域的串口桥接、以及用 PC 侧脚本做自动化验证。后续会补充 SPI、I2C、VGA 时序与简单调制器实现。

## 本分类文章

- [[projects/uart-loopback-project|UART 回环项目]]：UART 帧格式、波特率误差、发送模块 Verilog 实现与 PC 侧验证脚本。

## 跨学科关联

- [[digital-systems/fsm-design|有限状态机设计]]：UART 接收模块的核心是一个按位推进的状态机。
- [[digital-systems/verilog-sequential-logic|Verilog 时序逻辑]]：波特率计数器与异步复位同步释放直接影响通信是否稳定。
- [[programming/python-numpy-dsp|Python NumPy 与 DSP]]：PC 侧用 Python 完成自动化收发与误码统计，效率远高于手动点串口助手。

> [!note] 记录项目的三个习惯
> 1. 先写验收标准，再写实现；
> 2. 保留能复现问题的测试向量；
> 3. 把"为什么这样做"写下来，而不只是"做了什么"。

## 相关阅读

- [[projects/uart-loopback-project|UART 回环项目]]
- [[digital-systems/fsm-design|有限状态机设计]]
- [[maps/learning-path|推荐学习路径]]
