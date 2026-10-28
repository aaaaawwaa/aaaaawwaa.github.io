# MATLAB 融合台账

> 范围：`content/vault-notes/matlab`（2 篇）。
> 目标文章：`content/programming/matlab-for-dsp.md`。
> 状态口径按 `notes/fusion/SPEC.md`。
> 完成日期：2026-10-28。

## 目标文章

| 文章 | 字节 | 覆盖源笔记 | 状态 |
| --- | --- | --- | --- |
| `programming/matlab-for-dsp.md` | 18638 | matlab-notes、experiment-06-dsp-design | 正文完成 |
| `programming/index.md` | 2792 | 人工正文更新（索引区块未动） | 正文完成 |

## 统计

| 状态 | 数量 | 说明 |
| --- | --- | --- |
| 正文完成 | 2 | 语法主线与实验六完整流程均已融合 |
| 部分融合 | 0 | — |
| 待处理 | 0 | — |
| 排除 | 0 | — |

## 逐篇台账

| 源笔记 | 核心概念 | 目标文章 | 目标章节 | 动作 | 状态 |
| --- | --- | --- | --- | --- | --- |
| [[vault-notes/matlab/matlab-notes|MATLAB 基础函数与语法]] | 基础语法、矩阵/向量、索引、点运算、流程控制、函数与匿名函数、数学函数、绘图、通信仿真高频函数、实用技巧 | [[programming/matlab-for-dsp|MATLAB 与 DSP 仿真]] | 基础语法与矩阵运算；DSP 常用函数 | 保留矩阵创建/索引/点运算对照表、FFT 归一化要点、滤波器函数、dB 换算；补充与 NumPy 的对照 | 正文完成 |
| [[vault-notes/matlab/experiment-06-dsp-design|实验六 数字信号与系统产生软件设计与实现]] | Chirp 生成、多目标回波、噪声与 ADC 量化、Dechirp、FFT、峰值检测、可视化 | [[programming/matlab-for-dsp|MATLAB 与 DSP 仿真]] | 实验六：线性调频多目标测距 | 逐段融合代码与原理，补充参数约束（分辨率/最大距离/奈奎斯特）、误差来源表与调试要点 | 正文完成 |

## 未完成项与说明

- `matlab-for-dsp.md` 共 18638 字节，其中 MATLAB 代码约 6 KB，正文（去代码/公式围栏）约 13 KB，在 8–16 KB 区间内。
- 源笔记中的完整脚本按"段"融合为可读示例，删去了重复的 assert 与画图细节；完整代码仍在源笔记。
- 未实际运行实验六脚本：文中"应看到"的距离由参数计算给出，未声称仿真输出。

## 风险与验证

- 文中 MATLAB 语法以源笔记为准；与 Python 的对照表为工程经验总结，已在表前说明。
- 双链、公式与代码围栏按 `notes/fusion/SPEC.md` 约束书写；未执行构建。
