---
title: 学习笔记库
description: 从 Obsidian 知识库同步发布的电子信息工程学习笔记：通信原理、数字信号处理、随机信号处理、5G、FPGA/Verilog、数学基础与 MATLAB 实验。
tags:
  - vault-notes
  - index
---

本目录收录从本地 Obsidian 知识库**人工筛选后单向同步**的学习笔记（195 篇，含 60 张图表）。原始 Vault 保持只读，这里只是公开发布副本；页面路径统一使用小写英文，正文与标题保持原中文。

> [!info] 收录范围
> 通信原理、数字信号处理、随机信号处理、数字调制、5G、FPGA/Verilog/数字电路、线性代数、概率论与数理统计、复变函数与场论、MATLAB 实验，以及相关的知识地图。
> 个人日记、学习计划、项目进度、账号信息、考试真题、视频与大体积附件不会发布。

## 学科入口

| 学科 | 说明 | 入口 |
| --- | --- | --- |
| 通信原理 | 16 篇：从绪论、信道到同步原理，含公式速查表 | [[vault-notes/communication/00-guide|通信原理总导读]] |
| 数字信号处理 | 8 篇：离散时间系统 → DFT/FFT → 滤波器设计 → 多抽样率 | [[vault-notes/dsp/01-discrete-time-systems|离散时间信号与系统]] |
| 随机信号处理 | 61 篇：概率预备 → 随机过程 → 功率谱 → 最优滤波与检测 → MATLAB 实验 | [[vault-notes/random-signals/00-knowledge-map|知识地图]] |
| 数字调制 | 数字通信系统的基本组成部分 | [[vault-notes/digital-modulation/01-digital-communication-system|数字通信系统]] |
| 5G / 6G | 22 篇：基础框架、核心架构、协议栈、物理层流程 | [[vault-notes/5g/00-guide|5G 知识库导读]] |
| FPGA · Verilog · 数字电路 | 45 篇：Verilog 语法、Vivado 流程、时序分析、AD9361、UART/FIFO/PLL | [[vault-notes/fpga/00-guide|FPGA 知识库导读]] |
| 数学基础 | 线性代数 12 篇、概率论 12 篇、复变函数与场论 11 篇 | [[vault-notes/math/linear-algebra/01-vector-introduction|向量引论]] · [[vault-notes/math/probability/00-guide|概率论导读]] · [[vault-notes/math/complex-analysis/00-guide|复变函数导读]] |
| MATLAB | 工具笔记与实验六：数字信号系统产生软件设计 | [[vault-notes/matlab/matlab-notes|MATLAB 笔记]] |
| 知识地图 | 采样量化、傅里叶分析、数字通信、随机信号、线性系统与滤波 | [[vault-notes/maps/fourier-analysis-map|傅里叶分析知识地图]] |

## 怎么用

- **按学科读**：上面的入口页是各学科的导读，末尾都有关联阅读与双向链接。
- **按问题查**：右上角搜索支持中文全文检索（按单字索引，多字查询取交集）。
- **看关联**：右侧「关系图谱」显示笔记之间的双向链接；文章页底部的「反向链接」列出引用本页的其他笔记。
- **公式与图表**：公式在构建期渲染为 KaTeX；时序图为预渲染 SVG（WaveDrom 理论示意图，**不是 RTL 仿真波形**）。

## 维护说明

- 新增笔记：在 Vault 中照常写，然后按 `notes/sync-and-publish.md` 把文件加入 `public-notes.json` → `npm run sync:preview` → `npm run sync:apply` → `npm run verify` → 提交推送。
- 本目录由同步脚本生成，**不要直接手工编辑**；需要改内容请改 Vault 中的原始笔记后重新同步。
- 未收录的关联目标会在同步时转换为可读文字，并被记录在预演输出的 `converted` 列表中。
