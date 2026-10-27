---
title: LumenTrace Wiki
description: 面向电子信息工程学习者的个人技术 Wiki，系统整理数学基础、信号处理、通信原理、数字系统、编程实践与项目记录。
tags:
  - index
  - overview
---

LumenTrace 是一份围绕电子信息工程构建的个人技术 Wiki。它把课堂笔记、实验记录与项目复盘整理成可检索的结构化知识，并尽量在概念、公式、代码与硬件实现之间建立显式链接。

内容按「概念 → 数学表达 → 实现验证」的主线组织：每一章都尽量回答三个问题——它是什么、它如何被数学描述、它怎样落到代码或电路上。

## 八大知识板块

| 板块 | 内容范围 | 入口 |
| --- | --- | --- |
| 数学基础 | 线性代数、概率论与随机过程、变换与复变基础 | [Mathematics](./Mathematics/index.md) |
| 信号处理 | 信号与系统、卷积、采样定理、DFT 与 FFT | [Signal Processing](./Signal-Processing/index.md) |
| 通信原理 | 模拟调制 AM、数字调制 QPSK、误码率与带宽效率 | [Communication](./Communication/index.md) |
| 数字系统 | Verilog 时序逻辑、FSM 设计、复位与时钟策略 | [Digital Systems](./Digital-Systems/index.md) |
| 编程实践 | C 指针与内存、Python NumPy 与 DSP 脚本 | [Programming](./Programming/index.md) |
| AI 工具 | LLM 编码助手、RAG 检索、Agent 工作流 | [AI Agents](./AI-Agents/index.md) |
| 项目实战 | UART 回环等可复现工程记录 | [Projects](./Projects/index.md) |
| 交互实验 | 可运行脚本与参数化实验 | [Interactive Labs](./Interactive-Labs/index.md) |

## 快速入口

- [[Maps/Learning-Path|推荐学习路径]]：从数学基础到通信系统的四个阶段，说明先学什么、后学什么。
- [[Maps/Knowledge-Network|跨学科知识网络]]：用 Mermaid 图展示各领域文章之间的依赖关系。
- [[Maps/index|导航总览]]：三张 Map 的分工与使用方式。
- 想快速了解具体主题？可以从 [[Signal-Processing/DFT-and-FFT|DFT 与 FFT]] 或 [[Digital-Systems/FSM-Design|有限状态机设计]] 开始。

## 内容来源与发布方式

本 Wiki 的内容来自本地 Obsidian 知识库，通过白名单（whitelist）同步发布：只有列入同步清单的目录和笔记会被复制进站点源目录，私人笔记、草稿与附件不会出现在公开页面中。发布前会执行链接检查与 frontmatter 校验，确保所有双链都能解析。

## 使用建议

> [!tip] 阅读方式
> 左侧 Explorer 按分类浏览；右上角 Graph 查看概念之间的关联；顶部 Search 支持全文检索。遇到 [[Digital-Systems/FSM-Design|FSM]]、[[Signal-Processing/DFT-and-FFT|DFT]] 这类术语时，优先点开对应文章建立上下文。

> [!note] 关于公式与代码
> 所有公式使用 LaTeX 渲染，代码块标注语言以便语法高亮。仿真脚本以 Python、MATLAB 为主，硬件描述语言以 Verilog 为主。
