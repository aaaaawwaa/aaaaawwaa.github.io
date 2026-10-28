# 主题融合台账（总览）

本文件是"来源笔记 → 目标文章/章节 → 融合状态"的总入口。各学科明细在 `notes/fusion/<学科>.md`，规范见 `notes/fusion/SPEC.md`。

状态定义：**已归类**（仅索引）/ **部分融合** / **正文完成** / **待处理** / **排除**。"已发布笔记数"不等于融合进度。

## 进度总览（2026-10-28）

| 学科 | 公开笔记 | 正文完成 | 部分融合 | 排除 | 主题文章 | 明细台账 |
| --- | --- | --- | --- | --- | --- | --- |
| 数字信号处理 | 8 | 8 | 0 | 0 | 7 篇（信号与系统、Z/DTFT、DFT/FFT、结构、IIR、FIR、多抽样率） | [dsp.md](./fusion/dsp.md)、[dsp-filters.md](./fusion/dsp-filters.md) |
| 随机信号处理 | 61 | 56 | 5 | 0 | 8 篇（随机过程、相关与功率谱、通过系统、估计滤波、自适应与谱估计、检测、实验、公式速查） | [random-signals.md](./fusion/random-signals.md) |
| 通信 / 数字调制 / 5G | 39 | 35 | 4 | 0 | 8 篇（信号与信道、AM、基带、带通调制、编码、同步、5G/6G、公式速查） | [communication.md](./fusion/communication.md) |
| 数学基础（线代/概率/复变） | 35 | 32 | 3 | 0 | 9 篇（线代 4、概率 2、复变 2、公式速查） | [mathematics.md](./fusion/mathematics.md) |
| MATLAB | 2 | 2 | 0 | 0 | 1 篇（MATLAB 与 DSP 实验） | [matlab.md](./fusion/matlab.md) |
| FPGA / Verilog / 时序 | 45 | 43 | 1 | 1 | 7 篇（Verilog 基础、时序逻辑、FSM、架构与 EDA、Vivado、时序约束、接口与 AD9361） | [fpga.md](./fusion/fpga.md) |
| 知识地图 | 5 | 0 | 5 | 0 | 2 篇（知识网络、学习路径） | [maps.md](./fusion/maps.md) |
| **合计** | **195** | **176** | **18** | **1** | **42 篇主题文章**（另有 5 篇原有示例/项目页） | —— |

> 统计口径：明细台账按源笔记逐条登记；"部分融合"多为地图/导读/实验入口类笔记（其结构已并入正文，但不逐题搬运）。排除 1 篇为只有 frontmatter 的空笔记。

## 本轮完成的内容（可核验）

- 数字信号处理重整为四阶段 15 篇学习路径（DSP 7 + 随机信号 8），补齐 Z 变换、滤波器结构、IIR/FIR 设计、多抽样率的正文。
- 通信原理从 3 篇示例扩为 8 篇：确知信号与信道、模拟调制、数字基带、数字带通、编码、同步、5G/6G、公式速查。
- 数学基础拆为线代 4 篇、概率 2 篇、复变 2 篇 + 速查；MATLAB 独立成篇。
- 数字系统扩为 7 篇：Verilog 基础、时序逻辑与 FSM 重写、FPGA 架构与 EDA、Vivado 流程、时序分析与约束、接口与 AD9361。
- 知识网络与学习路径按真实文章重画，五张学科地图接入。

## 验证与部署记录（2026-10-28）

| 项 | 结果 |
| --- | --- |
| `npm run topics:build --check` | 195/195 归属，索引不陈旧 |
| `node scripts/check-links-source.mjs` | 253 个 md / 3542 条链接 / 0 问题 |
| `npm run test:public` | 24 项通过 |
| `npm run verify`（本地提交树） | 773 页、0 断链、0 KaTeX 错误节点、108 Mermaid、817 表格、243 代码块、22911 KaTeX 标记 |
| 提交 | `437a482`（docs 记录提交前为 6 个主题提交：b7155e4、1c7084a、66186f3、817c7c7、665f032、437a482） |
| GitHub Actions | 运行 [40659262571](https://github.com/aaaaawwaa/aaaaawwaa.github.io/actions/runs/40659262571)：build 与 deploy 均 success |
| 线上抽查（HTTPS） | 首页文案、`/signal-processing/` 15 篇、Z 变换页 173 处 KaTeX/0 错误节点/6 张表、QPSK 页 127 公式 + Mermaid、时序页 4 图 0 加载失败、contentIndex 682 条含新 slug 均已核对（首页文章数文案在首次部署中误写为 52，已更正为实际 42 篇并重新部署验证） |

### 已知差异（待核验）

- **线上 UI 文案为英文**（Explorer / Graph View / Table of Contents / Backlinks），本地构建为中文。页面正文、标题、目录条目均正常中文。推测原因：CI 用 `npx quartz plugin install` 按 `quartz.lock.json` 的 commit 安装插件（源码构建），与本地 npm 预构建插件包的 i18n 资源版本不同，部分插件的 zh-CN 文案未被打包；本轮未修改部署流水线，未验证该假设。

## 待办

- 其余"部分融合"笔记：在对应主题文章中继续扩写（优先 5G 工程仿真入口、复变场论边值问题、FPGA 的 PLL 笔记）。
- 数值示例目前是手算/代码给出的**预期结果**，未在 CI 中运行参考实现。
- 独立 HTML 实验与 canvas 仍未做通用适配（保持原状，不在本轮范围）。