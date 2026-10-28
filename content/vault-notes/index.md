---
title: 学习笔记库
description: 从 Obsidian 知识库同步发布的电子信息工程学习笔记：通信原理、数字信号处理、随机信号处理、5G、FPGA/Verilog、数学基础与 MATLAB 实验。
tags:
  - vault-notes
  - index
---

本目录收录从本地 Obsidian 知识库**人工筛选后单向同步**的学习笔记（195 篇，含 60 张图表）。原始 Vault 保持只读，这里只是公开发布副本；页面路径统一使用小写英文 slug，标题与目录名显示为原中文。

> [!info] 收录范围
> 通信原理、数字信号处理、随机信号处理、数字调制、5G、FPGA/Verilog/数字电路、线性代数、概率论与数理统计、复变函数与场论、MATLAB 实验，以及相关的知识地图。
> 个人日记、学习计划、项目进度、账号信息、考试真题、视频与大体积附件不会发布。

## 学科入口

每个目录名与 Obsidian 中的来源目录一致（`vault-notes/math` 是为网站聚合三科而设的层级）。点击目录进入该学科的全部笔记，点击导读先看学习路线。

| 学科 | 说明 | 目录入口 |
| --- | --- | --- |
| 通信原理 | 16 篇：从绪论、信道到同步原理，含公式速查表 | [[vault-notes/communication/index\|通信原理]] · [[vault-notes/communication/00-guide\|总导读]] |
| 数字信号处理 | 8 篇：离散时间系统 → DFT/FFT → 滤波器设计 → 多抽样率 | [[vault-notes/dsp/index\|数字信号处理]] · [[vault-notes/dsp/01-discrete-time-systems\|入门]] |
| 随机信号处理 | 61 篇：概率预备 → 随机过程 → 功率谱 → 最优滤波与检测 → MATLAB 实验 | [[vault-notes/random-signals/index\|随机信号处理]] · [[vault-notes/random-signals/00-knowledge-map\|知识地图]] |
| 数字调制 | 数字通信系统的基本组成部分 | [[vault-notes/digital-modulation/index\|数字调制]] · [[vault-notes/digital-modulation/01-digital-communication-system\|数字通信系统]] |
| 5G / 6G | 22 篇：基础框架、核心架构、协议栈、物理层流程 | [[vault-notes/5g/index\|5G]] · [[vault-notes/5g/00-guide\|知识库导读]] |
| FPGA · Verilog · 数字电路 | 45 篇：Verilog 语法、Vivado 流程、时序分析、AD9361、UART/FIFO/PLL | [[vault-notes/fpga/index\|FPGA]] · [[vault-notes/fpga/00-guide\|知识库导读]] |
| 数学基础 | 线性代数 12 篇、概率论 12 篇、复变函数与场论 11 篇 | [[vault-notes/math/linear-algebra/index\|线性代数]] · [[vault-notes/math/probability/index\|概率论与数理统计]] · [[vault-notes/math/complex-analysis/index\|复变函数与场论]] |
| MATLAB | 工具笔记与实验六：数字信号系统产生软件设计 | [[vault-notes/matlab/index\|Matlab]] · [[vault-notes/matlab/matlab-notes\|MATLAB 笔记]] |
| 知识地图 | 采样量化、傅里叶分析、数字通信、随机信号、线性系统与滤波 | [[vault-notes/maps/index\|知识地图]] · [[vault-notes/maps/fourier-analysis-map\|傅里叶分析]] |

## 怎么用

- **按学科读**：先进入学科目录页，它给出简短说明与"建议从这里开始"的几篇入口，页面下方是完整的子目录/笔记列表。
- **按问题查**：右上角搜索支持中文全文检索（按单字索引，多字查询取交集），目录页标题也会以中文出现在搜索结果与左侧目录树中。
- **看关联**：右侧「关系图谱」显示笔记之间的双向链接；文章页底部的「反向链接」列出引用本页的其他笔记。
- **公式与图表**：公式在构建期渲染为 KaTeX；时序图为预渲染 SVG（WaveDrom 理论示意图，**不是 RTL 仿真波形**）。

## 目录命名与来源

| 网站目录（URL） | 显示名 | Obsidian 源目录 |
| --- | --- | --- |
| `vault-notes/communication` | 通信原理 | 通信原理 |
| `vault-notes/dsp` | 数字信号处理 | 数字信号处理 |
| `vault-notes/random-signals` | 随机信号处理 | 随机信号处理 |
| `vault-notes/digital-modulation` | 数字调制 | 数字调制 |
| `vault-notes/5g` | 5G | 5G |
| `vault-notes/fpga` | FPGA | FPGA |
| `vault-notes/math` | 数学基础 | 线性代数 / 概率论与数理统计 / 复变函数与场论（聚合） |
| `vault-notes/matlab` | Matlab | Matlab |
| `vault-notes/maps` | 知识地图 | 03-Maps |

> [!note] 关于目录显示名
> URL 与磁盘目录保持英文小写 slug（便于分享与大小写敏感部署），中文显示名由各目录 `index.md` 的 `title` 提供，映射维护在仓库根目录 `folder-titles.json`，可用 `npm run folders:build` 重新生成。

## 维护说明

- 本页（`vault-notes/index.md`）由人工维护；各子目录的 `index.md` 由 `scripts/build-folder-indexes.mjs` 生成，请勿手工编辑。
- 新增笔记：在 Vault 中照常写，然后按 `notes/sync-and-publish.md` 把文件加入 `public-notes.json` → `npm run sync:preview` → `npm run sync:apply` → `npm run folders:build`（新增目录时同时补充 `folder-titles.json`）→ `npm run verify` → 提交推送。
- 未收录的关联目标会在同步时转换为可读文字，并被记录在预演输出的 `converted` 列表中。
