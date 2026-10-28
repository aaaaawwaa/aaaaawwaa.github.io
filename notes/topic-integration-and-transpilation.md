# 知识主题融合与发布转换

## 两层内容

| 层 | 位置 | 作用 | 维护方式 |
| --- | --- | --- | --- |
| 笔记副本 | `content/vault-notes/`（195 篇 + 60 图） | 可检索、可深入的原始笔记 | `scripts/sync-public.mjs` 从 Vault 单向同步，**不要手改** |
| 主题正文 | `content/signal-processing/`、`communication/`、`mathematics/`、`digital-systems/`、`programming/`、`maps/` | 可学习的学习路径：解释、条件、推导、例题、代码、图表 | 人工编写/融合，台账见 `notes/topic-fusion-ledger.md` |

主题索引区块由 `scripts/build-topic-guides.mjs` 在 `<!-- topic-index:start/end -->` 之间生成，195 篇笔记恰好一个归属；人工正文写在标记之外，不会被脚本覆盖。

## 本轮融合结果（2026-10-28）

- 数字信号处理重整为四阶段 15 篇：信号与系统、Z/DTFT、DFT/FFT、滤波器结构、IIR/FIR 设计、多抽样率，加随机信号的 8 篇（随机过程、相关与功率谱、通过系统、估计滤波、自适应与谱估计、检测、实验、公式速查）。
- 通信原理 8 篇（信号与信道、AM、数字基带、数字带通、编码、同步、5G/6G、公式速查）。
- 数学基础 9 篇（线代 4、概率 2、复变 2、速查）+ MATLAB 1 篇。
- 数字系统 7 篇（Verilog 基础、时序逻辑、FSM、架构与 EDA、Vivado、时序约束、接口与 AD9361）。
- 知识网络与学习路径按真实文章重画，五张学科知识地图接入导航。
- 明细台账：`notes/fusion/dsp.md`、`dsp-filters.md`、`random-signals.md`、`communication.md`、`mathematics.md`、`matlab.md`、`fpga.md`、`maps.md`；总表 `notes/topic-fusion-ledger.md`。

## 内容与自动转换的边界

人工融合负责概念去重、前置知识、推导顺序与交叉引用，不能靠按文件名复制实现。同步器只负责公开副本的格式转换，不回写原始 Vault，也不会覆盖人工编辑过的文件。专题文章放在主题目录，原笔记副本保留为详细推导与来源；旧链接继续有效。

## 已有转换规则

- 显式白名单中的双链与附件映射到站点路径，表格中的转义竖线保留。
- SVG 嵌入转为 Markdown 图片，避免浏览器 object 路径兼容问题。
- 独占一行的 `$$公式$$` 转成分行块公式；多行公式中与内容连写的开闭 `$$` 拆开，引用块前缀保留，围栏代码保持原样。`\text{}` 中的字面百分号补充转义。
- 中文正文标签转义，规避当前 CI 插件的特殊换行解析异常。
- 未发布目标保留可读文字并记录；这不表示缺失的交互 HTML 或 canvas 已完成转换。

## 验证与限制

执行 `npm run test:public` 与 `npm run verify`（后者含主题覆盖检查、公开内容扫描、源链接检查、构建、产物审计与 KaTeX 错误节点检查），再检查浏览器中的正文、图表和公式。构建成功不代表数学结论正确；代码样例保持原语言，发布转换不将 MATLAB/Verilog 自动改成 JavaScript。HTML 实验和 canvas 需要独立适配。

新增或修改来源笔记后：同步预演 → 应用同步 → 更新主题索引 → 构建检查 → 提交并部署。新增主题文章时：按 `notes/fusion/SPEC.md` 写作，并在对应学科台账登记来源与状态。
