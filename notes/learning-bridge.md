# 学习桥接（Learning Bridge）：概念卡与概念映射

> 依据：`LumenTrace-Learning-Bridge.zip` 开发包（AGENT_PROMPT / examples / demo）。本轮只做随机过程试点，不批量生成、不建第三套笔记库。

## 1. 解决的问题

融合主题文章负责学习主线，`content/vault-notes/**` 是同步而来的完整笔记。读者在融合文章里遇到单个概念不懂时，直接跳详细笔记容易迷路。本机制在**同一页**提供三层深度，并在缺前置时只补一个知识点，随后可用锚点回到原位置。

## 2. 实现方式（无 JS 优先）

- 形式：融合文章里的**概念学习卡**（当前三张：`random-processes` §6.1 自相关、`correlation-and-power-spectrum` 功率谱/维纳–辛钦、`z-transform-and-dtft` §5 DTFT）。默认可见：一句话 + 主线位置 + 直觉；原生 `<details class="lt-steps lt-bridge">` 承载“符号与推导”“深入笔记与后续”“前置补救”。
- 无脚本可读：`<details>` 是原生可展开元素；卡内公式由站点 KaTeX 预渲染，不依赖运行时 JS。
- 深度切换：卡顶三个原生 radio（① 直觉 / ② 推导 / ③ 深入）配合 CSS `:has()` 显隐三个面板；不依赖 JS，SPA 导航天然可用。不支持 `:has()` 的浏览器忽略显隐规则，三个面板同时显示，内容不丢。
- radio 隔离：每组 radio 放在独立 `<form class="lt-depth-form">` 里。原因：Quartz 的同页链接悬浮预览会克隆整篇 article，若所有 radio 共用 `name`，预览里的副本会与正文加入同一 radio 分组并取消正文选中；form owner 隔离后两边互不影响（2026-11-04 review 问题 1）。
- 回归：`scripts/markdown-table-links.test.mjs` 防止表格双链别名竖线未转义（review 问题 4）；实验页在 `pageshow(persisted)` 时重建监听（review 补充风险）。
- 返回原位置：每张子卡末尾有 `[回到自相关卡](#concept-bridge-autocorrelation)`；卡片锚点稳定，配合 `scroll-margin-top` 抵消粘性头部。
- 不做的部分：不引入 JS 状态机、不改 Quartz 核心、不新增页面、不改 `content/vault-notes/**`。

## 3. 单一数据源

`learning-map.json`（仓库根）是唯一权威关系表；Markdown 卡片与它通过**锚点 id** 对齐，不另存第二份 JSON/Markdown 关系表。

| 字段 | 含义 |
| --- | --- |
| `overview` / `bridge` | 试点主题与卡片所在页、卡片锚点 |
| `concepts[].id` | 稳定小写短横线 id（`random-process`、`expectation`、`autocorrelation`） |
| `overviewPage` | 读者学习主线页（融合文章） |
| `sourcePage` | 已发布的完整笔记（`content/**.md` 的 slug） |
| `prerequisites` | 前置 id，必须存在、不得自依赖、整体为 DAG |
| `bridgePage` / `bridgeAnchor` | 概念卡所在页与卡片锚点；不同文章各用各的锚点（缺省回退到全局 `bridge`） |
| `rescueAnchor` | 卡内“前置补救”块的锚点 id（在该概念的卡片页内校验） |
| `relatedLabPage` | 可选，相关交互实验页 |

## 4. 校验与测试

- `npm run map:check` → `scripts/validate-learning-map.mjs`：校验 schema、唯一 id、前置 DAG（环检测）、页面在 `content/` 中存在、卡片/补救锚点在正文中存在。
- `node --test scripts/learning-map.test.mjs`：6 项测试（真实映射通过、合法样例、环、未知前置、缺页面、缺锚点）。
- 接入点：`npm run verify` 与 CI 的 “Check learning map” 步骤；测试并入 `npm run test:public`。

## 5. 维护约定

1. 新增概念卡：在 `learning-map.json` 加节点（含 `prerequisites`、`rescueAnchor`）→ 在目标文章插入带相同 `id` 的 `<details class="lt-bridge">` → `npm run map:check`。
2. 新增前置补救：只补**一个**知识点（一句话 + 例子 + 必要条件 + 返回锚点），深入内容链到已有公开笔记。
3. 改标题/锚点：同时改 JSON 与正文，避免锚点脱管；不要手改 `content/vault-notes/**`。
4. 公式与统计口径：保留集合平均与时间平均的区分；自相关必须说明共轭、WSS 条件与期望存在性。

## 6. 当前覆盖（本轮推广）

| 概念 | 文章 / 锚点 | 前置 | 深入材料 |
| --- | --- | --- | --- |
| 自相关 | `random-processes` · `concept-bridge-autocorrelation` | 随机过程、数学期望 | 04 自相关笔记、功率谱文章、实验 |
| 功率谱 / 维纳–辛钦 | `correlation-and-power-spectrum` · `concept-bridge-power-spectrum` | 自相关（跨页跳回自相关概念卡） | 05 维纳–辛钦 / PSD / 数值估计笔记 |
| DTFT | `z-transform-and-dtft` · `concept-bridge-dtft` | z 变换与单位圆（同页 §1） | 01 傅里叶与 LTI 笔记、DFT/FFT、多抽样率 |

一致性：每张卡的锚点与 `learning-map.json` 的 `bridgeAnchor` 一致；跨页“救命入口”用绝对路径 + `#锚点`，返回链接用本页锚点，不依赖 JS。

## 7. 下一阶段（未实施）

- 跨页“前置栈”与多步返回：当读者连续打开多个前置卡时，用纯 URL/锚点或轻量脚本维护返回链；当前单步返回（本卡锚点 + 浏览器返回）已够用。
- 若将来引入脚本：必须按 Quartz 5 SPA 生命周期实现（导航后重挂载、卸载清理），且保留无 JS 的 radio/details 兜底。
- 推广到功率谱、DTFT：同一卡片模板 + `learning-map.json` 增加节点；先做映射与锚点，再决定是否统一组件化。
- 若要做语义图谱：在现有映射基础上扩展 `prerequisites` 与跨主题边，仍以本 JSON 为唯一来源。

## 8. 第一阶段验证记录（2026-11-04 review 收尾）

- 预览只读：`.popover-inner .lt-depth-tabs { display: none }`；真实浏览器回归 `npm run check:popover` 覆盖三张卡（正文选中保持、面板显隐不变、预览无切换条）。
- radio 隔离：每张卡独立 `<form class="lt-depth-form">`，预览克隆为独立 form owner；静态测试校验“每组 tabs 都有 form”。
- 键盘：radio 可聚焦，方向键切换（实测 ArrowDown 从 ① 到 ②）；SPA 导航后新卡仍可切换。
- 无 `:has()` 回退：三个面板默认 `open`，显隐规则整体失效时内容完整可读（静态测试校验）。
- 实验 BFCache：`pageshow(persisted)` 重建监听；恢复前设置的 paths/cursor/amplitude/seed/highlight 保留，相位由同一种子确定性重建；`scripts/random-processes-lab-lifecycle.test.mjs` 覆盖“非默认参数 → pagehide/pageshow → 值保留、监听器唯一、控件仍可操作”。真实浏览器是否命中 BFCache 仍未确认（事件序列不等同于浏览器命中）。
- 产物回归：`audit-site.mjs` 增加“依赖表双链已生成链接”“功率谱直觉含 1/(2π)”两项；`npm run test:public` 61 项。

## 9. 回退

- 删除三篇文章里的 `concept-bridge-*` 卡片、`learning-map.json`、`scripts/validate-learning-map.mjs`、`scripts/learning-map.test.mjs` 与 `custom.scss` 第 10 节；从 `package.json` 的 `verify`/`test:public` 移除对应命令与测试，CI 删除 “Check learning map” 步骤。