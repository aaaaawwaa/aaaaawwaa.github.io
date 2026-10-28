# 知识地图融合台账

源笔记：`content/vault-notes/maps/`（5 篇公开副本）。这几篇本身就是"知识点地图"，价值在于索引与关系，因此按**部分融合**记录：结构已并入 `maps/knowledge-network.md` 的"五张学科知识地图"一节并给出对应主题文章，但地图中的逐个知识点不重复展开（展开后会与主题正文重复）。

| 源笔记 | 核心概念 | 目标文章 | 目标章节 | 动作 | 状态 |
| --- | --- | --- | --- | --- | --- |
| sampling-quantization-map | 抽样、量化、编码的知识点关系 | `maps/knowledge-network` / `signal-processing/signals-and-systems-intro` | 五张学科知识地图 / 第 4 节 | 在知识网络页给出定位与主题入口 | 部分融合 |
| fourier-analysis-map | 连续/离散 × 周期/非周期四种傅里叶工具 | `maps/knowledge-network` / `signal-processing/dft-and-fft` | 五张学科知识地图 | 同上，对应 DFT 专题 | 部分融合 |
| digital-communication-map | 信源→编码→调制→信道→接收机的信号流 | `maps/knowledge-network` / `communication/index` | 五张学科知识地图 | 同上，对应通信原理 | 部分融合 |
| random-signal-processing-map | 概率、随机过程、功率谱、估计与检测主线 | `maps/knowledge-network` / `signal-processing/random-processes` | 五张学科知识地图 | 同上，对应随机信号路径 | 部分融合 |
| linear-systems-filtering-map | 系统函数、零极点、滤波器设计 | `maps/knowledge-network` / `signal-processing/digital-filter-structures` | 五张学科知识地图 | 同上，对应滤波器路径 | 部分融合 |

## 导航更新

- `maps/knowledge-network.md`：依赖图重画（加入 Z 变换、滤波器、随机信号、时序分析、5G 等节点），五条知识链改为与真实主题文章对应，新增"五张学科知识地图"一节。
- `maps/learning-path.md`：从四阶段改为六阶段（数学→信号与系统→滤波器/随机信号→数字系统→通信与 5G→项目），检查点表同步更新。

## 遗留

- 五张地图的逐知识点精读仍以源笔记为准；若要进一步融合，应在对应主题文章中扩写，而不是把地图粘贴成正文。
