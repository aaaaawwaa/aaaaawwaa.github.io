# 教学结构优化（2026-11，随机过程试点）设计与实施计划

> 依据：`.codex/artifacts/lumentrace/2026-11-03/lumentrace-optimization-prompt.md`。本轮做 P0、P1 的本地实现与验证，P2 只交付路线图。公开部署另做确认。

## 0. 范围与边界

- 试点文章：`content/signal-processing/random-processes.md`（下称“本文”）。
- 边界：本文只负责「随机过程是什么 → 样本函数与固定时刻随机变量 → 均值/方差/自相关与功率 → 宽平稳判定」。
  各态历经的具体含义、有限记录估计、维纳–辛钦、周期图/Welch 由 `correlation-and-power-spectrum.md` 负责；本文只做预告与链接。
- 不改 `content/vault-notes/`、不改生成索引区块、不改源 Vault；保留全部已发布 URL。
- 不推送、不部署；交付可审阅的本地成果（diff + 验证记录）。

## 1. P0 文章结构（三层可渐进阅读）

| 层 | 读者要拿到的东西 | 章节 |
| --- | --- | --- |
| 基础 | 随机变量 vs 随机过程、样本函数、集合平均、均值方差、二阶相关、WSS 三条件 | 1 随机过程与两副面孔；2 固定时刻的随机变量与集合平均；3 平稳性 |
| 推导 | 随机相位正弦的均值与自相关；相关函数性质；WSS/非平稳反例 | 4 渐进推导；5 相关函数的约定与性质 |
| 扩展 | 条件高斯、复随机变量、循环平稳、MMSE/卡尔曼联系 | 6 深入阅读（带前置条件，链到已有文章） |

每节以“本节解决什么问题”开场；重要公式后给符号、条件、单位。文首给 3–5 条可检查的学习目标；文末给 3 道自检题（`<details>` 折叠判断依据）。

### 1.1 需要审校的表述（详见 `notes/teaching-optimization/math-review.md`）

1. proper（伪协方差为零）与圆对称（分布旋转不变，需零均值）分开；非零均值 proper 复高斯的相位并不均匀。
2. 复高斯向量必须说明是否 proper；一般情形不能省略伪协方差。
3. 均匀随机载波相位去除的是与载波相关的循环频率（如 $2f_c$）；符号定时、脉冲成形等周期结构是否保留要单独说明。
4. 绝对化措辞（“高斯是唯一例外”“全部代数基础”）改为带条件的表述。
5. 统一相关函数约定 $R_X(t_1,t_2)=E[X(t_1)X^*(t_2)]$，区分自相关、自协方差、平均功率、方差。
6. 明确“各态历经”不是维纳–辛钦成立的前提：WK 只需 WSS 的二阶矩；各态历经是“用时间平均估计”的条件。

## 2. P1 渐进推导（随机相位正弦）

模型：$X(t)=A\cos(\omega_0 t+\Theta)$，$\Theta\sim U[0,2\pi)$，$A,\omega_0$ 确定；一条样本路径内相位固定。

- 层 1 直观：为什么平均后只剩 $\tau$ 的函数（相位在路径内固定、跨路径均匀）。
- 层 2 逐步推导：相关函数定义 → 代入 → 积化和差 → 对 $\Theta$ 求期望 → $\cos(2\omega_0t+\omega_0\tau+2\Theta)$ 项在一个周期上积分为零 → 结果。
- 层 3 完整结果：$\mu_X=0$，$R_X(\tau)=\frac{A^2}{2}\cos\omega_0\tau$，并验证 WSS（均值恒定、$R$ 只依赖 $\tau$）。
- 实现：Markdown + Callout + 原生 `<details>` 语义折叠（无 JS 也可展开阅读）；不使用 MathJax；不依赖把公式放进 HTML 再解析。

## 3. P1 实验 A：随机过程与样本函数

模型：$x_m(t)=A\cos(2\pi f_0 t+\theta_m)$，$m=1..M$，$\theta_m$ 每次重采样独立取自 $U[0,2\pi)$，采样后沿时间固定。

| 项 | 设计 |
| --- | --- |
| 路径 | $M$ 条，默认 8，范围 1–40；可高亮一条 |
| 游标 | 时刻 $t^\*\in[0,T]$，显示各路径交点 |
| 固定时刻统计 | 经验分布直方图（$M$ 个值）、经验均值、经验方差（分母 $M-1$，标注）、理论均值 0、理论方差 $A^2/2$ |
| 控件 | $M$、$t^\*$、$A$、随机种子；重置/重新采样 |
| 复现 | 同种子同参数结果一致；移动游标与高亮不换样本；改 $M$ 保留前缀；重采样才换实验 |
| 理论分布 | 固定 $t$ 时 $A\cos(2\pi f_0t+\Theta)$ 服从 $[-A,A]$ 上的反正弦分布（$A>0$），不是高斯；$A=0$ 退化 |
| 绘制 | 高 DPI Canvas、轴标/单位/图例、文字摘要；跟随站点手动主题，独立打开回退系统主题 |

文件：`quartz/static/lab/random-processes/{index.html,random-processes-math.mjs,random-processes-lab.mjs}`、`scripts/random-processes-lab.test.mjs`、`content/interactive-labs/random-processes-lab.md`（更新 `content/interactive-labs/index.md`）。

数学测试（确定性）：已知相位输入、统计量公式（分母 $M-1$）、种子复现、相位跨时间固定、重采样语义、$A=0$、$M=1$ 方差的定义、时刻端点、非法参数拒绝。

## 4. P1 阅读导航与视觉

- 右栏顺序：目录（TOC）优先 → 图谱 → 反向链接；图谱/反向链接移到目录之后，可滚动到达。
- 左栏：融合主题入口可达；原始详细笔记默认收纳（Explorer 文件夹默认折叠）。
- 排版：中文长文行高与行宽、公式与表格局部滚动、Callout/步骤块间距、`<details>` 样式、移动端目录可达。
- 实施结果：右栏顺序已生效（toc 10 → graph 30 → backlinks 50）；explorer 显式 `folderDefaultState: "collapsed"`；CSS 只做视觉降级与可读性。
- 限制（已核实）：graph 的 `defaultOptions`（`graph/dist/index.js:341-372`）没有折叠开关，backlinks 只有 `hideWhenEmpty`（`backlinks/dist/index.js:458-460`），且 graph 画布高度被脚本固定为 `Math.max(容器高, 250)`（同文件 317），不能靠压高度降级。语义折叠需本地组件，留 P2。explorer 的默认折叠实际由内联脚本硬编码并读 `localStorage["fileTree"]`（`explorer/dist/index.js:382`），配置项与行为一致但不会覆盖用户手动展开。

## 5. 文件清单与所有权

| 文件 | 负责人 |
| --- | --- |
| `content/signal-processing/random-processes.md` | Lead |
| `content/signal-processing/correlation-and-power-spectrum.md`（小幅衔接） | Lead |
| `content/maps/learning-path.md`（依赖说明） | Lead |
| `notes/fusion/random-signals.md`（台账） | Lead |
| `quartz/static/lab/random-processes/*`、`scripts/random-processes-lab.test.mjs`、`content/interactive-labs/random-processes-lab.md`、`content/interactive-labs/index.md`、`package.json`（测试入口） | 实验组 |
| `quartz.config.yaml`、`quartz/styles/custom.scss` | 导航组 |
| `notes/teaching-optimization/math-review.md` | 审校组 |
| `notes/teaching-optimization-2026-11.md`（本文）、P2 路线图、验证记录 | Lead |

## 6. 验收

- `node --test scripts/random-processes-lab.test.mjs`；`npm run test:public`；`npm run verify`。
- 浏览器：1440/768/390，亮/暗主题；文章公式、`<details>`、实验联动、SPA 往返、控制台无错。
- 截图与检查证据写入 `_scratch/`（不提交）。

## 7. P2 路线图（只规划）

1. 实验 B：随机相位正弦 vs 随机游走的 WSS 对比（均值/方差随时间；说明还需相关函数）。
2. 实验 C：AR(1) 自相关与 PSD 联动（稳定范围 $|a|<1$、预热、Hz 与离散频率、PSD 归一化与功率积分）。
3. 本地组件扩展：把 graph/backlinks 包进语义化 `<details>`，处理 SPA 与主题重建。
4. 中文搜索基线：真实查询集测相关性与召回，再决定分词/排序。
5. 字体/Mermaid/KaTeX CDN：先量资源与请求，再评估自托管。

## 8. 实施结果（本地，2026-11-03）

| 项 | 结果 |
| --- | --- |
| 文章 | 重写为 11 节 + 3 层推导 + 3 道自检；学习目标 5 条；错误清单 6 条；依赖表 5 行 |
| 实验 | 纯函数模块 + Canvas UI + 独立页 + 20 项测试；同种子复现、游标不重采样、改 M 保留前缀、重采样换样本；跟随站点手动主题；SPA 清理监听 |
| 导航 | 右栏 目录 → 图谱 → 反向链接；左栏目录默认折叠；TOC 可滚动、当前小节高亮；窄屏 TOC 独占整行 |
| 审校 | `notes/teaching-optimization/math-review.md`：10 个主条目 / 28 子项；主结论无误，按 §5 建议替换 proper/圆对称、复高斯向量、循环平稳（$f_c$ 与 $2f_c$、CP-OFDM $k/T_s$）、高斯条件、\(R,C,P,\sigma^2\) 区分、WK 可变换条件 |
| 台账 | `notes/fusion/random-signals.md` 记录本轮结构修订；来源白名单与摘录未变 |

### 8.1 验证记录

- `npm run test:public`：**48 项通过**（原 28 + 新增 20），0 失败。
- `node scripts/check-links-source.mjs`：281 个 Markdown、3 667 条链接、**0 问题**。
- `npm run verify`：**775 页**、0 站内断链、0 KaTeX 错误、821 表格、2 199 Callout、2 199 KaTeX 标记中的 23 106 个 katex 标记；`Math render check: 775 pages, 0 errors`。
- 浏览器（headless Chrome，本地静态服务 + 正确 `.mjs` MIME）：桌面 1440 / 平板 768 / 手机 390；亮/暗均检查；文章无横向溢出；右栏顺序 toc→graph→backlinks；TOC 20 条锚点全部命中；公式后正文保留（27 个块级公式中 25 个紧邻段落/列表/Callout，其余为连续公式组）；自检答案 Callout 可展开（0→222 px）；无 JS 时推导与结论仍可读；SPA 文章→实验→返回无重复 iframe、0 控制台错误；旧傅里叶实验 iframe 正常（canvas 747×260）；实验 iframe 桌面 1000 / 平板 1240 / 手机 1700，内容高度 924 / 948 / 1667，均不被裁切。
- 按 `math-review.md` §7 复核清单追加 6 处修正：§9“只有联合高斯（复情形还需 proper）”……（其余见文章）：§3.1 复噪声 $N_0$ 口径、$E[Z_1Z_2^*]$ 与 $|\rho|\le1$；§7.2 $\mathbf{Z}_2=\mathbf{Z}_1^*$ 的互伪协方差；§8 自检措辞；实验页“固定时刻边际/集合矩不能证明严平稳或 WSS”与 Glivenko–Cantelli 一致逼近。
- 截图：`_scratch/opt-shots/`（desktop-article-top2、desktop-article-derivation、desktop-article-dark、desktop-lab-embedded、standalone-lab-desktop、tablet-article、mobile-article、mobile-lab-embedded、desktop-home）。
- **未执行**：git 提交、推送、CI、Pages 部署（按提示词“公开发布是单独最后一步”）。

## 9. 回退方式

- 内容：恢复本批 5 个 Markdown 文件与 1 个台账文件的上一版；删除 `content/interactive-labs/random-processes-lab.md`、`quartz/static/lab/random-processes/`、`scripts/random-processes-lab.test.mjs`。
- 配置/样式：`quartz.config.yaml` 的 3 处 priority/options 还原；`quartz/styles/custom.scss` 删除第 160 行之后的追加块。
- 测试入口：从 `package.json` 的 `test:public` 移除新增测试文件。
- 实验页可从文章 `## 11` 与实验索引移除链接后独立保留，不影响其他页面。