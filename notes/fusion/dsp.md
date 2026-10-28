# 数字信号处理融合台账

源笔记位于 `content/vault-notes/dsp/`（8 篇公开副本）。"正文完成"指决定结论的解释、条件、推导、例题、代码已进入主题文章对应章节。

## 明细

| 源笔记 | 核心概念 | 目标文章 | 目标章节 | 动作 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 01-discrete-time-systems | 序列、数字频率、周期判定、LTI 与卷积、因果稳定、差分方程、抽样定理与混叠、sinc 重建 | `signal-processing/signals-and-systems-intro` | 全篇（1–7 节） | 重写：补入数字频率圆弧、卷积推导三步、因果稳定证明、差分方程三解、混叠不可逆与带通抽样 | 正文完成 |
| 02-z-transform-and-dtft | z 变换与 ROC、反变换、性质、s-z 映射、DTFT、H(z)、零极点、因果稳定判据、全通/最小相位 | `signal-processing/z-transform-and-dtft` | 全篇（1–10 节） | 新建：ROC 四条性质与四类序列表、部分分式三 ROC 例题、s-z 多值性、零极点矢量法、全通/最小相位 | 正文完成 |
| 03-discrete-fourier-transform | DFT 定义/矩阵、性质、圆周卷积、频域采样、频谱分析、用 DFT 算线性卷积 | `signal-processing/dft-and-fft` | 1–5 节 | 重写：DTFT 三个连续→两刀切、正交矩阵、圆周/线性卷积补零例题、频率采样定理、分辨率/泄漏/栅栏/单边归一化 | 正文完成 |
| 04-fast-fourier-transform | 运算量、旋转因子性质、DIT 蝶形、位倒序、DIF 对比、IFFT、重叠相加/保留 | `signal-processing/dft-and-fft` | 6–7 节 | 重写：蝶形推导与运算量、位倒序表、DIT/DIF 对比表、IFFT 复用公式、OLA/OLS 对比 | 正文完成 |
| 05-filter-structures | 信号流图积木、IIR 直接 I/II/级联/并联/转置、FIR 各结构、格型 | `signal-processing/digital-filter-structures` | 全篇 | 新建（见 [dsp-filters.md](./dsp-filters.md)） | 正文完成 |
| 06-iir-filter-design | 模拟原型、脉冲响应不变、双线性变换、频率变换、MATLAB 流程 | `signal-processing/iir-filter-design` | 全篇 | 新建（见 [dsp-filters.md](./dsp-filters.md)） | 正文完成 |
| 07-fir-filter-design | 线性相位四类、窗函数、频率采样、等波纹、IIR/FIR 对比 | `signal-processing/fir-filter-design` | 全篇 | 新建（见 [dsp-filters.md](./dsp-filters.md)） | 正文完成 |
| 08-multirate-sampling | 抽取/插值、频域关系、诺贝尔恒等式、多相、分数倍重采样、滤波器组 | `signal-processing/multirate-dsp` | 全篇 | 新建（见 [dsp-filters.md](./dsp-filters.md)） | 正文完成 |

## 导航更新

- `content/signal-processing/index.md` 的学习路径改为 11 篇四阶段（信号与系统 → 变换域 → 滤波器 → 随机与统计），并补了与其他学科的连接。
- 已发布笔记副本仍保留，作为"深入阅读"入口；主题正文不再只是链接清单。

## 遗留

- DFT 与滤波器设计的数值例子目前以 MATLAB/Python 代码给出，未在 CI 中实际运行；文中"运行后应看到"属**预期结果**，不是实测记录。
- 频域设计（频率采样法）与自动等波纹设计的更完整数值对照仍可补充，不阻塞发布。

## 对源笔记的技术更正（由滤波器批次核对）

- 05-filter-structures：原笔记"直接型 I 与 II 互为转置"不严格——两者延迟单元数不同（$M+N$ 与 $\max(M,N)$），正文按转置定理表述；级联示例的"共轭极点"实为实极点 0.7、0.8，已更正。
- 06-iir-filter-design：脉冲响应不变法频谱式与 $h(n)=Th_a(nT)$ 的 $1/T$ 约定前后不一致，正文统一并注明两种约定。
- 07-fir-filter-design：窗函数估阶原笔记按 $6.6\times2\pi/M$ 得到约 66，标准表按 $6.6\pi/N$ 得到 $N\approx33$，正文采用标准式并说明前者约为两倍保守设计。
