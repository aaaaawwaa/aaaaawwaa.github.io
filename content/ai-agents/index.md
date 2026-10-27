---
title: AI 工具
description: 大语言模型、检索增强生成与 Agent 工作流在电子信息工程学习与开发中的实际用法与边界。
tags:
  - ai-agents
  - index
---

## 学习范围

本分类记录 AI 工具在学习与工程中的使用方式，重点不是评测模型强弱，而是接入真实工作流。内容覆盖三个层面：作为编码助手的 LLM（代码补全、重构、解释报错）、基于检索增强生成（RAG）的文档问答（让自己整理的笔记和数据手册可被检索）、以及能拆解任务并调用工具的 Agent。

在电子信息工程语境下，AI 的价值集中在几件事：快速生成仿真脚本、解释数据手册中的寄存器定义、把数学推导翻译成 Verilog 或 C、在调试时提供排查思路。风险也很明确：公式、引脚、时序参数一旦被"编造"，排查成本远高于自己查手册。

## 本分类文章

- [[ai-agents/ai-tools-overview|AI 工具概览]]：三类工具的定位、RAG 与 Agent 的工作机制、使用原则。

## 跨学科关联

- [[programming/python-numpy-dsp|Python NumPy 与 DSP]]：AI 最擅长的任务之一是生成可运行的验证脚本，但结果必须自己复核。
- [[programming/c-pointer-and-memory|C 指针与内存]]：底层代码中的未定义行为，模型往往"看起来正确"却暗藏错误。
- [[maps/learning-path|推荐学习路径]]：建议先建立领域基础，再用 AI 加速实现，而不是反过来。

> [!warning] 验证优先
> 任何由 AI 生成的**公式、寄存器地址、时序参数、器件型号**都必须回原始手册或标准文档核对。把 AI 当作"检索与起草助手"，不要当作"事实来源"。

## 相关阅读

- [[ai-agents/ai-tools-overview|AI 工具概览]]
- [[programming/python-numpy-dsp|Python NumPy 与 DSP]]
- [[maps/knowledge-network|跨学科知识网络]]
