# TEST-REPORT.md · 测试报告与后续计划

> 测试时间：2026-10-27（Asia/Shanghai）
> 测试对象：LumenTrace Wiki（Quartz v5.0.0）
> 结论：**站点已部署上线**（GitHub Pages，HTTPS）：<https://aaaaawwaa.github.io/>
> Phase 2–4 的工具链已就绪，真实 Vault 笔记的批量发布仍需人工确认清单。

---

## 1. 测试环境

| 项目 | 实测值 |
| --- | --- |
| 操作系统 | Windows 11 家庭版 中文版（10.0.26200） |
| PowerShell | 7.5.5 |
| Node.js | v24.14.1（Quartz 要求 ≥ 22） |
| npm | 11.16.0（要求 ≥ 10.9.2） |
| Git | 2.54.0.windows.1 |
| 浏览器（自动化验证） | Google Chrome headless（CDP 驱动） |
| 项目路径 | `<项目目录>\LumenTrace-Wiki` |
| 磁盘剩余 | ≈ 33 GB |

---

## 2. Phase 0 环境调查结论

| 检查项 | 结果 |
| --- | --- |
| Node / npm / Git | 均满足 Quartz 5 要求 ✅ |
| npm registry | 已配置 `registry.npmmirror.com`，可用 ✅ |
| GitHub 直连 | `git ls-remote` 可用，但 **`git clone` 间歇性 TLS 中断**（`unexpected eof while reading`）⚠️ |
| 端口 8080 / 3001 | 空闲 ✅ |
| 已有项目 | 目标目录原本不存在，未覆盖任何现有工程 ✅ |
| Obsidian Vault | 与站点仓库**分离**（Vault 自身是独立 git 仓库，站点不写入 Vault）✅ |

---

## 3. Phase 1 验收项与结果

| # | 验收项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 本地启动成功、页面可浏览 | ✅ | `npx quartz build --serve` 输出 `Started a Quartz server listening at http://localhost:8080`；HTTP GET `/` 返回 200 |
| 2 | ≥ 5 篇示例文章可通过导航与知识链接访问 | ✅ | 25 个 Markdown 文件（1 首页 + 8 分类索引 + 13 篇文章 + 3 张 Maps），构建出 **66 个 HTML 页面**（含 tag 页、文件夹页） |
| 3 | 搜索正常工作 | ✅ | CDP 实测：查询「傅里叶」返回结果卡片，命中「傅里叶级数实验」且标题高亮；「DFT」「状态机」「误码率」均可命中 |
| 4 | 数学公式正常 | ✅ | 构建产物含 **151 处 KaTeX 标记**（构建期 SSR，无前端渲染依赖） |
| 5 | 代码块正常 | ✅ | **15 个** `data-rehype-pretty-code-figure` 代码块，python / matlab / verilog / c 四种语言高亮 |
| 6 | 知识图谱正常 | ✅ | `static/contentIndex.json`（65 条）生成；Graph 组件在桌面/移动视图均渲染出节点图 |
| 7 | 中文显示正常 | ✅ | 66/66 页面含中文；桌面 1440px 与移动 390px 截图人工检查无乱码、无横向滚动 |
| 8 | 内部链接与静态资源无失效 | ✅ | 自检脚本扫描 `public/` 全部 HTML：**站内链接 1827 个，断链 0** |
| 9 | 公开构建内容无私人笔记/密钥 | ⚠️ 部分 | 当前 `content/` 全部为新建示例文章，无敏感内容；**自动化敏感信息扫描脚本尚未实现**（Phase 3 交付） |
| 10 | 生产构建成功 | ✅ | `Emitted 142 files to public in 10s`；`npm run audit` 全部 PASS |
| 11 | 明暗主题切换 | ✅ | 头部主题按钮存在并可切换（`darkmode` 插件），亮/暗截图均正常 |
| 12 | 响应式（电脑/平板/移动） | ✅ | 1440px / 390px 截图验证，无横向溢出 |
| 13 | Mermaid 渲染 | ✅ | 14 处 mermaid 容器；实测知识网络图渲染成功（依赖 cdnjs 运行时） |
| 14 | 反向链接 / 目录 | ✅ | 文章页右侧展示「反向链接」「目录」，数据来自内容索引 |
| 15 | 远程部署与 HTTPS | ✅ | 已部署到 GitHub Pages：<https://aaaaawwaa.github.io/>；2026-10-27 21:20 构建成功（build 14m17s + deploy 11s），线上实测见 §3.3 |

### 3.1 `npm run audit` 实际输出（节选）

```text
[PASS] 页面数量 > 0 — 66 个 HTML 页面
[PASS] 站内断链为 0 — 0 个断链
[PASS] 内容索引存在（搜索 + 图谱） — static/contentIndex.json
[PASS] 内容索引包含中文 — 索引条目 65 条
[PASS] Mermaid 图已渲染 — 14 处 mermaid 容器
[PASS] LaTeX 公式已渲染 — 151 处 katex 标记
[PASS] 代码块已高亮 — 15 个代码块
[PASS] 中文页面正常 — 66/66 个页面含中文
[PASS] RSS 已生成 — index.xml
[PASS] sitemap 已生成 — sitemap.xml

页面: 66 | 文件: 142 | 站内链接: 1827 | 外链: 726 | 锚点: 324
Mermaid: 14 | KaTeX: 151 | 代码块: 15 | 表格: 30 | Callout: 31
```

### 3.2 构建性能实测

| 指标 | 实测值 |
| --- | --- |
| 解析 25 个 Markdown | 1–2 s |
| 输出 142 个文件（含 66 页 OG 社交卡片） | 10–16 s |
| 产物总大小 | 3.4 MB |
| 构建并发 | 25 篇时有效并发为 1（Quartz 5 默认 `clamp(文件数/128, 1, 4)`） |

---

## 4. 实施过程中遇到的关键问题与解决

| # | 问题 | 根因（已定位到源码） | 解决 |
| --- | --- | --- | --- |
| 1 | `npx quartz plugin install` 长时间卡住，只装到 26/42 | 安装器逐个 `git clone` GitHub 插件仓库；本机直连 GitHub 出现 TLS 中断 | 提供离线方案 `scripts/provision-plugins.ts`：从 npm 获取同源 `@quartz-community/*` 预构建包解包 + 本地 git 初始化 + 调官方 `regeneratePluginIndex()`，44/44 成功 |
| 2 | 首次构建报 `Could not resolve "../../.quartz/plugins"` | 安装中断导致未生成 `.quartz/plugins/index.ts` | 同上，索引由官方函数重新生成 |
| 3 | 链接全部为小写、输出文件名保留大小写 → 线上会 404 | `crawl-links@1.0.0` 内置的新版 utils 会把 slug 转小写，而 Quartz 5.0.0 core 按原始大小写输出文件；**Windows 本地不区分大小写，问题被掩盖** | 把 `content/` 的目录与文件名统一改为小写 kebab-case；改后断链 0 |
| 4 | 首次构建出现 `CNAME` 文件，内容为 `lumentrace-wiki.pages.dev` | `cname` 插件按 `baseUrl` 生成 CNAME，而 Pages 项目站不需要该文件 | 关闭 `cname` 插件（绑定自定义域名时再按需开启） |
| 5 | 首页与文章页 Properties 面板与下方 tag 药丸重复展示 tags | `note-properties` 的 `includedProperties` 含 `tags` | 改为只展示 `description` / `aliases` |
| 6 | 移动端站点标题换行、属性表可能横向溢出 | 上游样式未针对中文长标题优化 | `custom.scss` 增加 `@media (max-width: 800px)` 规则 |

---

## 5. 已知问题与限制

### 5.1 技术限制（Quartz 5.0.0 上游行为）

1. **WaveDrom 无原生渲染**：42 个官方插件中没有 WaveDrom。方案：预渲染 SVG 后当图片插入（与 Obsidian Vault 现有约定一致），或做独立交互页。
2. **搜索的根路径依赖**：search 插件把索引地址与结果链接写成根绝对路径，**子路径部署（GitHub Pages 项目站）搜索会失效**。→ 部署到 Cloudflare Pages 根路径，或绑定自定义域名。
3. **中文搜索是单字索引**（unigram）而非分词：召回率高、精度一般，多字查询为 AND 交集语义；无拼音、无繁简互转。当前 25 篇规模可接受。
4. **附件不受 ignorePatterns 保护**：过滤器只处理 Markdown；`content/` 下的图片/PDF 会无条件发布。→ 靠白名单目录 + 人工检查（Phase 3 补自动化扫描）。
5. **外部 CDN 依赖**：Mermaid 运行时来自 cdnjs、KaTeX 样式来自 jsdelivr、字体来自 Google Fonts。任一不可达时**页面不报错但功能降级**（图空白/公式样式错乱/字体回退）。
6. **部分 UI 文案仍为英文**：属性面板 Properties、面包屑根节点 Home、OG 卡片里的 "3 min read"。属上游文案，未做二次翻译。
7. **首页 OG 卡片标题重复**：`pageTitle` + `pageTitleSuffix` 渲染为 "LumenTrace Wiki · LumenTrace"，仅首页如此，属观感问题。
8. **headless Chrome 截图偶发滚动偏移**：legacy `--screenshot` 模式受布局时序影响；已改用 CDP 截图（先 `window.scrollTo(0,0)`）作为准。

### 5.2 尚未实施（按计划后续阶段）

- Obsidian → Wiki 的白名单同步脚本与附件映射（Phase 3）
- 敏感内容自动扫描（密钥正则、白名单比对）（Phase 3）
- 交互式 HTML 实验页（Phase 4）
- 远程仓库创建 / Cloudflare 授权 / 域名解析（Phase 5，需授权）
- `quartz/static/lab/` 与笔记间的 iframe 嵌入验证

---

## 6. 后续实施计划

| 阶段 | 内容 | 验收 |
| --- | --- | --- |
| **Phase 2** | 视觉与功能打磨：移动端细节、暗色模式对比度、首页信息密度、可选自托管 mermaid / KaTeX 以摆脱 CDN、评估 WaveDrom 预渲染流程 | 亮/暗 × 桌面/平板/移动 六套截图与自检全绿 |
| **Phase 3** | `scripts/sync-public.mjs`：按白名单目录从 Vault 复制 Markdown 与引用附件到 `content/`，保留路径映射；生成同步清单；`scripts/check-secrets.mjs` 扫描密钥与私有标记 | 同步 10+ 篇真实笔记后 `npm run verify` 通过；敏感样本被拦截 |
| **Phase 4** | 交互实验：方波傅里叶级数合成器（Canvas + 谐波数滑杆 + 吉布斯现象观察），放 `quartz/static/lab/fourier/`，在 `interactive-labs/fourier-series-lab.md` 内 iframe 嵌入 | 本地 + 预览环境实测可交互、移动端可用 |
| **Phase 5** | Cloudflare Pages 部署、GitHub Actions 备份方案、域名与 HTTPS、链接与公开内容复检 | 线上 HTTPS 可访问、搜索/图谱/公式/代码均正常 |

---

## 7. 复现测试的命令

```bash
cd "<项目目录>\LumenTrace-Wiki"
npm install
npm run plugins:offline     # 或 npm run plugins:install（GitHub 可用时）
npm run verify              # 构建 + 自检
npm run dev                 # http://localhost:8080
```
## 2026-10-27 视觉升级复验

本轮 npm run verify 退出码为 0，66 个 HTML 页面、1825 个站内链接、0 断链。已验证桌面与手机明暗主题、全文搜索和公式排版。详细记录见 notes/dsh-review-and-visual-upgrade.md。本轮未对外部署。
---

## 8. Phase 5 部署记录（2026-10-27 完成）

### 8.1 部署结果

| 项目 | 值 |
| --- | --- |
| 站点地址 | <https://aaaaawwaa.github.io/> |
| 仓库 | `aaaaawwaa/aaaaawwaa.github.io`（公开，main 分支） |
| 托管 | GitHub Pages（Source = GitHub Actions，`build_type=workflow`） |
| 证书 | HTTPS 已启用（`https_enforced: true`） |
| 工作流 | `.github/workflows/deploy.yml`：源码链接检查 → npm ci → 安装插件 → 构建 → 产物自检 → 上传 → 部署 |
| 单次构建耗时 | 成功一次 14 分 17 秒（其中插件安装约 11–12 分钟，站点构建约 1 分钟） |
| 产物 | 142 个文件 / 66 个 HTML 页面 |

### 8.2 线上实测（无头 Chrome，2026-10-27 21:2x）

| 检查 | 实测 |
| --- | --- |
| 首页 HTTP | 200（32.8 KB） |
| 文章页 `/signal-processing/dft-and-fft` | 200（74 KB），KaTeX 渲染 22 处 |
| 搜索索引 `/static/contentIndex.json` | 200（50.2 KB） |
| RSS / sitemap | 200 / 200 |
| 首页正文内链抽样 15 条 | **全部 200**（无大小写 404） |
| 搜索「傅里叶」 | 8 条结果，首条「傅里叶级数实验」 |
| Mermaid（知识网络页） | 渲染出 SVG |
| 移动端 390×844 | 文档宽度 390 = 视口宽度，无横向滚动 |

### 8.3 只在 CI（Linux）暴露、本地（Windows）无法复现的问题

这三个问题是本次部署最大的工程风险，均已修复并留下自动化防护：

| # | 现象 | 根因 | 修复 |
| --- | --- | --- | --- |
| 1 | 构建期 `Failed to install plugin: quartz-fonts · HTTP 401` | 仓库名是 `quartz-community/fonts`，npm 包名才是 `@quartz-community/quartz-fonts`；config 按 npm 名写错仓库 | config 改为 `github:quartz-community/fonts`，脚本加 npm 包名别名 |
| 2 | `Unknown file extension ".ts"` / `defaultDateType was not set` | 两个插件不在 `quartz.lock.json`：CI 只按 lockfile 安装，构建期临时克隆后直接 import 未编译源码；`configuration.defaultDateType` 缺失时本地 npm 预构建版有兜底、源码版没有 | 补齐 lockfile 条目；在 `configuration` 段补 `defaultDateType: modified` |
| 3 | 自检报 150 个断链 | 站点链接生成器在不同插件版本下行为不同：本地版把 slug 转小写，CI 源码版保持原大小写；而内容双链目标仍写 PascalCase | 内容双链统一小写；新增 `scripts/check-links-source.mjs`（源码级、大小写敏感）并接入 `npm run verify` 与 CI |

---

## 9. 批量发布 Obsidian 学习笔记（2026-10-27 第二轮）

### 9.1 发布结果

| 指标 | 实测值 |
| --- | --- |
| 发布笔记 | **195 篇**（`content/vault-notes/`） |
| 发布附件 | **60 个**（34 PNG + 26 SVG），全部被选中笔记显式引用 |
| 源 Vault Markdown 总量 | 353 篇（本次覆盖目标学科 204 篇候选中的 195 篇） |
| 站点页面 | 685 个 HTML（含标签页、文件夹页、OG 卡片） |
| 构建输出 | 1352 个文件 / 65 MB |
| 内容索引 | 594 条（搜索与知识图谱共用） |
| 构建耗时 | 220 个 Markdown：解析 32 s，输出 2 min（Windows 本机） |
| 线上地址 | <https://aaaaawwaa.github.io/> |

学科覆盖：通信原理 16、数字信号处理 8、随机信号处理 61、数字调制 1、5G/6G 22、FPGA 45、线性代数 12、概率论 12、复变函数 11、MATLAB 2、知识地图 5。

### 9.2 构建与检查结果

| 检查 | 结果 |
| --- | --- |
| `npm run test:public` | 16 个测试全部通过 |
| `npm run check:public` | 无敏感项（1 篇笔记的正文标签触发过一次误报排查） |
| `scripts/check-links-source.mjs` | 221 个 Markdown / 2647 条链接 / **0 问题** |
| `scripts/audit-site.mjs` | 断链 **0**；KaTeX 17276；Mermaid 98；代码块 178；表格 658；Callout 1994；RSS/sitemap 正常 |
| 浏览器抽查（本地） | 绪论（81 公式 / 3 Mermaid / 22 callout）、DFT（247 公式）、UART（13 图 / 0 加载失败）、卡尔曼滤波（61 公式）；均无横向溢出 |

### 9.3 本次新增 / 修改的工程能力

| 变更 | 原因 |
| --- | --- |
| `sync-public.mjs` 支持 `unresolvedPolicy: "text"` | 指向未发布笔记/附件的链接需要「保留可读文字」，同时逐条记录，不能静默忽略 |
| `sync-public.mjs` 支持非嵌入的 `[[file.svg]]` 附件链接改写 | 时序分析笔记用表格链接 SVG，原实现只处理嵌入 |
| `sync-public.mjs` 默认标题去掉编号前缀 | 文件名 `1. 绪论.md` 应显示为「绪论」而不是「1. 绪论」 |
| `check-links-source.mjs` 接受附件目标 | 同步后产生大量图片链接，检查器需识别 PNG/SVG |
| `audit-site.mjs` 按浏览器语义钳制越界 `..` | 中文标签链接近似 `../.././../tags/…`，浏览器会在根目录截断，原检查误报断链 |
| `content/vault-notes/index.md` 导航页 | 195 篇笔记需要学科入口，而不是只靠目录树 |

### 9.4 未发布 / 无法转换的内容

| 类别 | 数量 | 原因 |
| --- | --- | --- |
| 作业截图索引及其 7 张截图 | 1 篇 + 7 图 | 作业截图属个人学习材料，且含手写/个人痕迹 |
| 5G 大唐杯真题 3 篇、题目总结、面试刷题汇总 | 5 篇 | 第三方考试材料 / 求职私人复习资料 |
| 视频、PDF、TeX 源、WaveDrom JSON5、Canvas、独立 HTML 演示 | 198 个 mp4 等 | 体积大或需单独审阅；HTML 演示可后续按 `quartz/static/lab/` 约定发布 |
| B 站视频截图 `屏幕截图 2026-10-19 202238.png` | 1 图 | 含第三方视频内容与播放器界面 |
| 5G 重复笔记（NG-RAN 3 份、5GC 2 份） | 3 份 | 内容不同但同题，只保留最完整一份并在报告中说明 |
| 缺失引用的图片 | 7 处 | Vault 中找不到对应文件（历史删除），已转为可读文字 |
| 全库总纲、首页、知识总图等内部导航 | 若干引用 | 属内部聚合页面，未列入公开发布范围，引用转为文字 |

预演中 `converted` 共 **93 条**（30 个不同目标），全部记录在同步输出里，没有通过关闭检查来绕过。

---

## 10. 内容融合批次（2026-10-28，笔记 → 主题正文）

### 10.1 结果

| 指标 | 数值 |
| --- | --- |
| 参与融合的公开笔记 | 195 篇（8 个学科方向） |
| 新增/重写的主题文章 | **42 篇**（DSP 7、随机信号 8、通信 8、数学 9、MATLAB 1、数字系统 7、知识地图 2），站点另有 5 篇原有示例/项目页 |
| 台账 | `notes/topic-fusion-ledger.md` + `notes/fusion/*.md`（按源笔记逐条登记） |
| 构建 | 253 个 Markdown → **773 个 HTML 页面**、1528 个文件 |
| 富内容 | KaTeX 标记 22889、Mermaid 108、代码块 243、表格 817、Callout 2161 |
| 搜索索引 | 682 条 |

### 10.2 验证证据

| 检查 | 结果 |
| --- | --- |
| `npm run topics:build --check` | 195/195 归属，索引不陈旧 |
| `node scripts/check-links-source.mjs` | 253 个 md / 3500 条链接 / **0 问题** |
| `npm run test:public` | 16 项通过 |
| `npm run verify` 构建 | 退出码 0 |
| `scripts/audit-site.mjs` | 断链 **0**；索引含中文；Mermaid/KaTeX/代码块/RSS/sitemap 均 PASS |
| `scripts/check-math-render.mjs` | 773 页，**0 个 KaTeX 错误节点** |
| 分类抽查 | 公式、表格、代码块、SVG/PNG 图片、callout 内块公式均需浏览器复验（见 10.3） |

### 10.3 已知风险与限制

- 引用块内的块级公式（`> $$`）依赖现有解析规则，构建期无 KaTeX 错误，但显示效果需浏览器抽查。
- 文中 MATLAB/Python/RTL 代码为示例，CI 不执行；数值结论标注为预期结果，不是实测记录。
- “部分融合”的 18 篇笔记（导航/地图/实验入口/只含 frontmatter 的 PLL 笔记等）已在台账注明原因。
- 4 篇源笔记存在技术口径差异（如“直接型 I/II 互为转置”、窗函数估阶公式、脉冲响应不变法的 1/T 约定），已在正文更正并在台账记录。

### 10.4 部署与线上验证

| 项 | 结果 |
| --- | --- |
| 推送提交 | `437a482`（六个主题提交合并后） |
| Actions 运行 | [40659262571](https://github.com/aaaaawwaa/aaaaawwaa.github.io/actions/runs/40659262571)：build ✓ / deploy ✓ |
| 线上首页 | <https://aaaaawwaa.github.io/> 显示"195 篇已融合为 42 篇" |
| 线上正文抽查 | Z 变换（173 KaTeX、0 错误节点、6 表）、QPSK（127 公式、Mermaid）、时序约束（4 图 0 失败）、特征值/SVD、知识网络 |
| 搜索索引 | `/static/contentIndex.json` 682 条，包含 `signal-processing/z-transform-and-dtft`、`communication/digital-modulation-qpsk`、`mathematics/eigenvalues-svd` |

已知差异：线上插件 UI 文案为英文（本地构建为中文），正文与标题不受影响；推测为 CI 按锁文件源码构建插件时 i18n 资源与本地 npm 预构建包不同，未在本轮验证修复。
