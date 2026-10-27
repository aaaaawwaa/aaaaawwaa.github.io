# Quartz v5.0.0 能力与部署可行性调研报告

> 项目：LumenTrace Wiki（Quartz v5.0.0 个人技术 Wiki）
> 调研角色：技术验证员（只读调研 + 报告）
> 调研时间：2026-10-27 19:31 起（Asia/Shanghai）
> 产出路径：`_scratch/research/quartz5-capabilities.md`
> 写入范围声明：本报告是本次任务唯一写入的文件；未修改项目其它任何文件，未执行 npm/npx/git 写操作。

---

## 0. 证据等级与调研方法

### 0.1 证据等级标记

| 标记 | 含义 |
| --- | --- |
| ✅ 已验证 | 直接读了源码/官方文档并确认，给出 文件:行号 |
| ⚠️ 部分验证 | 核心事实已验证，但边界条件或运行时行为未实测 |
| ❓ 未验证 | 基于代码路径或常识的推测，明确标注，需后续实测 |

### 0.2 调研来源（全部只读）

1. **项目内官方文档**：`docs/`（features/、plugins/、cli/、hosting.md、configuration.md、layout.md、advanced/）
2. **已安装插件**：`.quartz/plugins/<name>/`（安装器只保留 `dist/` 构建产物，不含 `src/`；因此插件源码级证据引用 GitHub 上 **lockfile 锁定的 commit**，与本地安装版本一致）
3. **Quartz 核心**：`quartz/`（config loader、build pipeline、path utils、静态资源处理、JSX 渲染）
4. **npm 依赖实现**：`node_modules/@quartz-community/utils/`、`node_modules/flexsearch/`

> **插件安装状态说明（影响证据形式）**：调研开始时 `.quartz/plugins/` 只有 27/42 个插件且安装中断（最后写入 19:31:34，之后无进程）。我按 `quartz.lock.json` 的 commit 从 GitHub 只读拉取缺失插件源码作证据。**19:45 前后 Lead 重跑安装成功（44 个目录、42 插件 + index.ts）**，关键插件 `obsidian-flavored-markdown` / `search` / `og-image` / `remove-draft` 均已落地 `dist/`；本地 `dist/index.js` 已抽查与远端源码一致（例：`.quartz/plugins/obsidian-flavored-markdown/dist/index.js:25815` = `enableInHtmlEmbed: false`）。
>
> **证据路径说明**：安装器（含 Lead 的离线 npm 解包方案）最终只保留 `.quartz/plugins/<name>/dist/`，**没有 `src/`**。因此正文中形如 `.quartz/plugins/<name>/src/xxx.ts:行号` 的引用，**实际对应 GitHub 上 lockfile 锁定 commit 的同名文件**（URL 见各节与 §17），不是本地现存路径；`dist/` 与核心文件（`quartz/...`）的引用则是本地现存的。

### 0.3 版本基线（✅ 已验证）

- `package.json:5` → version `5.0.0`
- `package.json:24-27` → engines: npm >= 10.9.2, node >= 22
- `.node-version` → `v22.16.0`
- `quartz.lock.json` → 42 个社区插件，全部锁定 commit
- 插件安装位置：`.quartz/plugins/`；插件清单：`quartz.config.yaml`

---

## 0.5 关键前置结论：source 必须写 github:quartz-community/xxx

> 这是 Lead 追加问题 1，**直接决定 build 能否成功**，因此放在最前面。

### 结论（✅ 已验证）

**必须用 `github:quartz-community/<name>`，不能用 `@quartz-community/<name>`。**

当前项目 `quartz.config.yaml` 的 plugins 段（第 44–245 行）**已经全部是 `github:quartz-community/...` 形式**（如 `quartz.config.yaml:45`、`:61`、`:81`、`:104`、`:133`），**现状正确、无需修改**。官方文档与 CLI 模板也是同一写法（`docs/plugins/index.md:28-88` 的仓库列、各插件页 "Default options" 段；`quartz/cli/templates/*.yaml` 中 grep `@quartz-community` 命中数为 0）。

### 判断依据（源码逐层）

1. **配置 schema 只声明 4 种形式**：`quartz/plugins/quartz-plugins.schema.json:193-196`
   > 支持 `github:user/repo`、`git+https://`、`https://`，以及本地路径；**没有 npm 包名形式**。
2. **运行时解析器 `parsePluginSource()`**：`quartz/plugins/loader/gitLoader.ts:62-113`
   - 分支顺序：local 路径 → `github:` → `git+` → `https://` → **"Assume it's a plain repo name and try github"**
   - 最后这个兜底分支（`gitLoader.ts:102-110`）对 `@quartz-community/search` 的实际行为：
     拆成 ["@quartz-community", "search"]（长度 2）→ name = "search"，repo = "https://github.com/@quartz-community/search.git"
   - 即 owner 被当作字面量 `@quartz-community` → **clone URL 非法**。
3. **CLI 侧解析器 `parseGitSource()` 更严格**：`quartz/cli/plugin-data.js:125-148` —— 四种形式都不匹配时直接 `throw new Error("Cannot parse plugin source: ...")`。
   所以 `npx quartz plugin add / restore / resolve` 传 `@quartz-community/x` 会**直接抛错**。
4. **插件名提取 `extractPluginName()`**：`quartz/plugins/loader/config-loader.ts:52-69` —— 非 github:/非 git URL/非本地路径时**原样返回 source**（第 68 行），于是插件目录名会变成 `@quartz-community/search`（含斜杠、路径层级错误），而不是 `.quartz/plugins/search`。
5. **安装/加载路径依赖解析出的 name**：`config-loader.ts:382-384` → `getPluginEntryPoint(gitSpec.name)` → `.quartz/plugins/<name>/dist/...`（`gitLoader.ts:266-279`）。

### 为什么容易混淆

`@quartz-community/xxx` 是**插件仓库自己的 npm 包名**（见 `.quartz/plugins/obsidian-flavored-markdown/package.json` 的 name 字段），在安装器里只用于 **peerDependencies 同仓符号链接**（`quartz/cli/plugin-git-handlers.js:52-79` 的 `linkPeerPlugins()` / `findPluginByPackageName()`），**不是** `quartz.config.yaml` 的 source 语法。

### 风险

- ❓ 若误写成 `@quartz-community/x`：本地已安装时可能"看似能加载"（name 恰好解析成 x，且 `installPlugin` 见目录已存在会跳过 clone，`gitLoader.ts:182-193`），但**换机器/CI 首次安装必然失败**——"本地能跑、CI 挂"最难排查。

---

## 1. 能力支持矩阵

| 功能 | 是否支持 | 实现方式 / 插件 | 额外配置 | 风险 |
| --- | --- | --- | --- | --- |
| Mermaid 图 | ✅ 支持 | 内置在 `obsidian-flavored-markdown`（不是独立插件） | 无需额外配置；围栏为三反引号 + `mermaid`；需保证 OFM 的 order 大于 syntax-highlighting | 运行时从 cdnjs CDN 加载 mermaid 11.4.0；securityLevel loose；SPA 切换需 nav 事件重渲染 |
| LaTeX（KaTeX） | ✅ 支持（默认引擎） | `latex` 插件 + remark-math + rehype-katex | 已配 `renderEngine: katex`（`quartz.config.yaml:81-85`）；块级 `$$` 必须独占行 | KaTeX CSS 走 jsdelivr CDN；mhchem 需 fork 插件 |
| LaTeX（MathJax / Typst） | ✅ 支持（同插件切引擎） | `latex` 插件 `renderEngine: "mathjax" / "typst"` | 改一行配置；typst 依赖 `@myriaddreamin/rehype-typst` 已在核心依赖中 | 换引擎需全站重测；Typst 与 LaTeX 命令不完全兼容 |
| WaveDrom 时序图 | ❌ 无原生支持 | 42 个锁定插件中无 wavedrom | 需预渲染 SVG 走 Assets；或用 Mermaid sequenceDiagram 近似 | 官方文档未给替代方案；直接写 script 标签会原样输出（无 sanitize，SPA 下不执行） |
| Obsidian Canvas（.canvas） | ✅ 支持 | `canvas-page`（pageType，注册 .canvas + 自定义 canvas frame） | 已启用（`quartz.config.yaml:115-116`） | 全屏 frame 绕开三栏布局；大画布前端性能未知 |
| Obsidian Bases（.base） | ✅ 支持 | `bases-page`（pageType，解析 .base 查询并渲染 table/list/cards/map） | 已启用（`quartz.config.yaml:208-211`） | map 视图是占位；表达式引擎为自研子集 |
| 自定义 HTML/JS 页面 | ✅ 支持 | 放 `quartz/static/` → 构建时原样复制到 `public/static/` | 无需配置（Static 是内置 emitter，恒定启用） | 根绝对路径 `/static/...` 在子路径部署下 404 |
| iframe 嵌入 | ⚠️ 可行有坑 | Markdown 里写 iframe 标签，CrawlLinks 会改写相对 src | 建议指向 `/static/...` 或外链 | 无 sandbox 时第三方页可操作父页；子路径部署需相对路径 |
| 全文搜索 | ✅ 支持（客户端索引） | `search` + FlexSearch 0.8.212，索引来自 `/static/contentIndex.json` | 依赖 `content-index`（已启用） | 中文按单字切分（非分词）；结果链接/索引是根绝对路径，子路径部署会坏 |
| 中文文件名/目录 | ✅ 基本可用 | `_sluggify()` 保留非 ASCII 原字符（不音译/不编码） | 无需配置 | URL 含原始中文；sitemap/RSS 用 encodeURI；decodeURI 遇非法 % 可能抛错 |
| Obsidian 双向链接 | ✅ 支持 | `obsidian-flavored-markdown` + `crawl-links` | `markdownLinkResolution: shortest`（已配置） | 断链默认不报错不校验；disableBrokenWikilinks 默认 false |
| 私有内容（白名单发布） | ✅ 支持（有前提） | `explicit-publish`（默认关闭）+ ignorePatterns | 需关 remove-draft、开 explicit-publish | 非 Markdown 附件不受过滤器保护，仍会公开；encrypted-pages 只是客户端加密 |
| Cloudflare Pages 部署 | ✅ 支持 | 静态站；构建命令 npx quartz plugin restore && npx quartz build | 输出 public；Node 22 | 免费版 500 构建/月、20,000 文件、单文件 25 MiB、单次构建 20 分钟超时 |
| GitHub Pages 部署 | ✅ 支持 | 官方 workflow（Actions artifact + deploy-pages） | baseUrl 需带子路径；Pages Source 选 GitHub Actions | 无尾斜杠重定向；搜索在项目子路径下会坏 |
| RSS | ✅ 默认开启 | `content-index` → `/index.xml` | `enableRSS: true`（已配置） | 需 baseUrl 正确，否则 RSS 内 URL 错 |
| Sitemap | ✅ 默认开启 | `content-index` → `/sitemap.xml` | `enableSiteMap: true`（已配置） | 同上 |
| OG 社交预览图 | ✅ 默认开启 | `og-image`（satori + sharp 逐页生成 PNG） | 已启用（`quartz.config.yaml:111-112`） | 主题字体为纯拉丁字体，中文标题很可能缺字；构建耗时增加 |
| 站点性能 | ⚠️ 中小站点够用 | 构建期 workerpool，>128 篇才起 worker | `--concurrency` 可强制指定 | 25 篇时默认 concurrency=1（单线程）；OG 图是主要耗时 |

---

## 2. Mermaid：✅ 支持，由 OFM 插件内置实现

### 结论（✅ 已验证）

- Quartz 5 **原生支持 Mermaid**，但它**不是独立插件**，而是 `obsidian-flavored-markdown`（OFM）的子功能。
- **围栏语法就是标准 `mermaid` 代码块**（三个反引号 + mermaid）。
- **不需要额外配置**：OFM 的 `mermaid` 选项默认 true（`docs/plugins/ObsidianFlavoredMarkdown.md:18`）。
- 唯一的"配置"要求是**插件顺序**：OFM 必须排在 `syntax-highlighting` 之后，否则 Mermaid 代码块会被高亮器吃掉。当前项目 `syntax-highlighting` order 20、OFM order 30（`quartz.config.yaml:53-69`）——**已经正确**。

### 证据

| 事实 | 证据 |
| --- | --- |
| 官方声明由 OFM 提供、可开关 | `docs/features/Mermaid diagrams.md:7`、`:9`、`:16-26` |
| 顺序警告（OFM 要在 SyntaxHighlighting 之后） | `docs/features/Mermaid diagrams.md:11-12` |
| OFM 选项 mermaid 默认 true | `docs/plugins/ObsidianFlavoredMarkdown.md:18` |
| 实现：code.lang 为 mermaid 时加 class mermaid + hasMermaidDiagram | quartz-community/obsidian-flavored-markdown@eda74e7 src/transformer.ts:536-552 |
| 注入前端脚本与样式 | 同上 src/transformer.ts:593-605（externalResources） |
| 前端运行时从 cdnjs 动态 import mermaid 11.4.0 | 同上 src/scripts/mermaid.inline.ts:193-196 |
| 渲染配置 securityLevel: "loose"、跟随明暗主题 | 同上 src/scripts/mermaid.inline.ts:223-238 |
| 在 nav / render 事件上重渲染（SPA 必需） | 同上 src/scripts/mermaid.inline.ts:302-303 |
| 本地安装版本一致（dist 含 OFM 默认项） | `.quartz/plugins/obsidian-flavored-markdown/dist/index.js:25815` |

> 源码 URL（lockfile commit）：https://github.com/quartz-community/obsidian-flavored-markdown/blob/eda74e79eac746445b7d6941f90133bf97483cd7/src/transformer.ts

### 风险

1. ⚠️ **运行时 CDN 依赖**：mermaid 11.4.0 从 cdnjs.cloudflare.com 拉取（mermaid.inline.ts:193-196）。中国大陆访问 cdnjs 时快时慢，最坏情况是**图空白但页面不报错**（仅控制台 error）。→ Phase 2 实测；必要时本地打包 mermaid（需改插件或加 override）。
2. ⚠️ `securityLevel: "loose"`：Mermaid 节点标签里的 HTML 会被执行。只发布自己内容时风险可接受；若将来开放投稿需改 strict。
3. ⚠️ 每页首次渲染才下载 mermaid（1MB+，gzip 前），图多的首屏 LCP 会变差。

---

## 3. LaTeX：✅ 支持，三引擎可选，块级语法有硬约束

### 结论（✅ 已验证）

- **默认引擎 KaTeX**，**构建期（SSR）渲染**成 HTML，不是前端动态渲染。
- 可选引擎：katex / mathjax（SVG 输出）/ typst ——**都是同一个 `latex` 插件的 `renderEngine` 选项，不需要另装插件**。
- 语法：
  - 块级：用 `$$` 包裹，且 **`$$` 必须独占一行**（remark-math 限制）
  - 行内：单个 `$...$`
  - 转义：字面美元符号写 `\$`

### 证据

| 事实 | 证据 |
| --- | --- |
| 默认 KaTeX、构建期渲染 | `docs/features/Latex.md:7` |
| 块级 $$ 语法 | `docs/features/Latex.md:13-21` |
| $$ 必须换行（官方 warning） | `docs/features/Latex.md:53-54` |
| 行内 $ 语法 | `docs/features/Latex.md:58` |
| \$ 转义 | `docs/features/Latex.md:60-69` |
| mhchem 需 fork 插件（非配置项） | `docs/features/Latex.md:71-77` |
| 三引擎 + customMacros | `docs/plugins/Latex.md:14-15` |
| 源码：remarkMath + 三引擎 switch | `.quartz/plugins/latex/src/transformer.ts:1-4`、`:41-68` |
| KaTeX 额外资源（CSS + copy-tex）走 jsdelivr | `.quartz/plugins/latex/src/transformer.ts:69-82` |
| 当前配置 renderEngine: katex，order 80 | `quartz.config.yaml:81-85` |
| Typst 依赖随核心安装 | `package.json:42` |

### 风险

1. ⚠️ **KaTeX CSS 走 jsdelivr CDN**（transformer.ts:73）。CDN 不可达时公式显示成未加样式的 HTML 片段（乱但不空白）。→ 要完全离线可把 katex.min.css 放 `quartz/static/` 并覆盖引用。
2. ✅ 块级 `$$` 换行是硬约束：从 Obsidian 直接复制 `$$x$$` 单行写法会渲染失败（显示为纯文本）。**迁移阶段最容易踩的坑**，建议写脚本扫描 content/。
3. ❓ 若改 `renderEngine: typst`：Typst 只认识数学子集，现有 LaTeX 笔记里的 aligned / text / 矩阵环境可能不兼容，需全量回归。**不建议 Phase 2 切引擎**。

## 4. WaveDrom 时序图：❌ 无原生支持，需自建方案

### 结论（✅ 已验证）

1. **Quartz 5 没有 WaveDrom 支持**：42 个锁定插件中不存在 wavedrom 相关插件（`quartz.lock.json` 全量清单；`docs/plugins/index.md:26-88` 官方插件表也没有）。
2. **官方文档没有为 WaveDrom 推荐替代方案**（`docs/` 全库 grep wavedrom 零命中）。
3. **Markdown 里的 raw HTML 会被保留，不会被剥离**：
   - OFM 的 `htmlPlugins()` 第一个插件就是 `rehypeRaw`（obsidian-flavored-markdown@eda74e7 src/transformer.ts:557）→ raw HTML 被解析成 hast 元素；
   - 渲染到 JSX 时，script / style 标签被特殊处理为 `dangerouslySetInnerHTML`（`quartz/util/jsx.tsx:20-23`）→ **内容不被转义**；
   - 核心代码中**没有任何 sanitize 步骤**（在 `quartz/` 中 grep sanitize/DOMPurify 无命中）。
4. **iframe 会被处理**：`crawl-links` 会对 img/video/audio/iframe 的 src 做相对路径改写（`.quartz/plugins/crawl-links/src/transformer.ts:137-151`），其它属性不动。
5. **`enableInHtmlEmbed` 是另一回事**：它只控制"**在 raw HTML 块内部是否解析 Obsidian 语法**（wikilink / 高亮 / tag）"，默认 false（`docs/plugins/ObsidianFlavoredMarkdown.md:21`、`docs/features/Obsidian compatibility.md:193-195`、源码 src/transformer.ts:357-380）。它**不决定** HTML 标签是否保留——标签无论如何都保留。

### 三种可行落地方式（按推荐度）

| 方案 | 做法 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **A. 预渲染 SVG（推荐）** | 用 vault 现有 `.agent-tools/render-wavedrom.mjs` 生成 .svg，放 `content/Assets/TimingDiagrams/...`，Markdown 里用 `![[x.svg\|800]]` | 无运行时依赖、可离线、被 Assets 插件正常复制、Obsidian 里也能看 | 静态图不可交互；需维护 json5→svg 流程 |
| **B. Mermaid 近似** | 用 sequenceDiagram / timeline / gantt 画时序 | 原生支持、零成本 | **不能表达时钟波形/总线电平**，只适合协议交互，不适合"时钟沿+数据窗口" |
| **C. 独立交互页 + iframe** | 自包含 HTML（内嵌 wavedrom.js 或已渲染 SVG + 播放器）放 `quartz/static/`，页面里用 iframe 引用 | 可交互、可复用 | 子路径部署需改相对路径；iframe 高度/主题联动需手调；多一层请求 |

### 关于"直接写 script 标签"

- ✅ **首屏可用**：SSR 输出的 HTML 里 script 是真实标签（jsx.tsx:22-23 用 dangerouslySetInnerHTML），浏览器首次加载会执行。
- ⚠️ **SPA 导航后不会执行**：Quartz SPA 用 micromorph 做局部替换（`docs/features/SPA Routing.md:9`），通过 innerHTML/DOM 插入的 script 浏览器不执行；页面只派发 `nav` / `render` 事件（`docs/advanced/architecture.md:48-51`）。→ 直接内联 WaveDrom 脚本在站内跳转后会失效。
- ❓ 未实测：Mermaid 插件本身是"inline script + nav 事件重渲染"实现的（mermaid.inline.ts:302），说明这条路官方认可，但需要自己写挂载逻辑。

### 风险

1. ⚠️ **XSS 面**：内容里的 script 标签无过滤直接输出。只发布自己写的笔记可控；一旦引入多人协作/外部 Markdown，必须加白名单或禁用 raw HTML。
2. ⚠️ 内联 script + SPA = 时灵时不灵，调试成本高 → **建议统一走方案 A 或 C**。

---

## 5. Obsidian Canvas / Bases：✅ 都支持（v5 新增 pageType 机制）

### 5.1 Canvas（.canvas）（✅ 已验证）

- **支持程度**：完整渲染 JSON Canvas 1.0 —— 文本节点（Markdown 渲染）、文件节点（链到站内页、支持 popover）、链接节点、分组节点、边（带标签/箭头/颜色）。
- **工作方式**（`canvas-page` 插件）：
  1. 注册 `fileExtensions: [".canvas"]`（`.quartz/plugins/canvas-page/src/pageType.ts:74`）；
  2. 构建时扫描 `ctx.allFiles` 里所有 .canvas，直接 `JSON.parse`（`pageType.ts:77-90`）；
  3. **slug = 文件路径去掉 .canvas 后缀**（`pageType.ts:92`）→ `docs/Canvas.canvas` 生成 URL `/Canvas`；
  4. 文本节点用 micromark+GFM 渲染（`pageType.ts:16-35`），文件节点把目标页的 `htmlAst` 内联（`pageType.ts:37-65`）；
  5. 使用插件自带 `"canvas"` 全屏 frame + 左侧可收起侧栏（`pageType.ts:111-113`；`docs/plugins/CanvasPage.md:19-36`）。
- **Wikilink 兼容**：`quartz/build.ts:38-54` 为 pageType 注册的扩展名额外生成"去扩展名 slug 别名"，所以 `![[Canvas.canvas]]` 能解析到虚拟页 `Canvas`（`build.ts:117-123`）。
- **配置**：`enableInteraction / initialZoom / minZoom / maxZoom`（`docs/plugins/CanvasPage.md:14-17`）；可用 `layout.byPageType.canvas.template: default` 换回三栏（`docs/plugins/CanvasPage.md:31-36`）。
- 证据：`docs/features/Canvas.md:7,12`、`docs/plugins/CanvasPage.md:7`、`quartz.config.yaml:115-116`、示例 `docs/Canvas.canvas`（8.8KB）。

### 5.2 Bases（.base）（✅ 已验证）

- **支持**：读取 .base 查询定义 → 解析匹配笔记 → 渲染 table / list / cards / map，支持多视图 tab、and/or/not 过滤树、公式、列汇总、属性显示名、单元格内 wikilink 可点。
- 证据：`docs/features/Bases.md:7`、`docs/plugins/BasesPage.md:8`、`:15-24`（功能列表）、`:30-31`（defaultViewType / customViews）、`quartz.config.yaml:208-211`、示例 `docs/Base.base`（3KB）。
- **限制**：map 视图是占位（`BasesPage.md:18`）；自定义视图需 TS override（`BasesPage.md:40-53`）。

### 风险

1. ⚠️ Canvas 用全屏 frame，左栏复用 content 页组件，窄屏是浮层 → 导航体验与正文页不一致。
2. ❓ Canvas 节点/边是纯前端 SVG + 绝对定位，移动端大画布（>50 节点）性能未验证。
3. ⚠️ Bases 表达式引擎是插件自研子集，Obsidian 原生复杂公式/函数可能不兼容；建议只用于简单表格。

---

## 6. 静态资源与自定义页面：`quartz/static/` → `/static/`

### 6.1 quartz/static 的作用（✅ 已验证）

- **位置**：`quartz/static/`（核心目录，非 content）。
- **作用**：存放需要稳定 URL 的站点级静态资源（图标、OG 兜底图、字体、giscus 主题 CSS 等）。
- **构建行为**：内置 `Static` emitter 把 `quartz/static/**` **原样复制**到 `<output>/static/**`：
  - `quartz/plugins/emitters/static.ts:10-19`（`glob("**", staticPath, cfg.configuration.ignorePatterns)` → `joinSegments(argv.output, "static")`）
  - **恒定启用**：`quartz/plugins/loader/config-loader.ts:415-419` 把 ComponentResources / Assets / Static 作为 builtinEmitters 无条件加入。
- **与 Assets 的区别**（`docs/plugins/Static.md:10`）：
  - `quartz/static/` → Static → URL `/static/<相对路径>`
  - `content/` 下的图片/附件 → Assets → URL 为内容相对路径（`quartz/plugins/emitters/assets.ts:22-41`）
- 现有内容：`quartz/static/icon.png`、`og-image.png`、`giscus/`（dark.css / light.css）。

### 6.2 发布独立 HTML/JS 交互页面的确切做法（✅ 路径规则已验证）

1. 在 `quartz/static/` 下建目录，例如：
   `quartz/static/lab/uart-timing/index.html`（可带 app.js、style.css、vendor/wavedrom.js）
2. 构建后自动出现在：
   `public/static/lab/uart-timing/index.html`
3. 站点内可访问 URL（**根路径部署**）：
   `https://<baseUrl>/static/lab/uart-timing/index.html`
   也支持 `https://<baseUrl>/static/lab/uart-timing/`（静态服务器 index 行为）
4. Markdown 里嵌入：
   - iframe：`<iframe src="/static/lab/uart-timing/index.html" width="100%" height="480" loading="lazy"></iframe>`
   - 或普通链接：`[打开交互演示](/static/lab/uart-timing/index.html)`
5. **注意 ignorePatterns 也作用于 static**（static.ts:11）：默认 private / templates / .obsidian 若在 static 下有同名目录会被跳过。

### 6.3 iframe 是否可行（✅ 可行，有 3 个坑）

| 坑 | 说明 | 规避 |
| --- | --- | --- |
| **子路径部署** | `/static/...` 是根绝对路径；GitHub Pages 项目站（/repo/ 前缀）下会 404 | 用相对路径（按当前页深度算）或改用自定义域名 / CF Pages 根路径 |
| **CrawlLinks 改写** | iframe 的 src 会被当资源链接处理，相对路径按当前页重算（crawl-links/src/transformer.ts:137-151） | 写相对路径时按"页面所在目录"推，别写相对 content 根的路径 |
| **安全/体验** | 无 sandbox 时同源页面可访问父窗口；固定高度不自适应 | 加 `sandbox="allow-scripts allow-same-origin"`、`loading="lazy"`；高度用固定值 |

> 交叉验证：OG 图文档明确写了 socialImage 可以是"相对 `quartz/static` 的路径"（`docs/plugins/CustomOgImages.md:72`），说明 quartz/static 就是官方的"稳定资源根"。

---

## 7. 搜索：客户端 FlexSearch，**中文按单字切分**

### 结论（✅ 已验证）

1. **纯客户端索引**：页面加载后 fetch `/static/contentIndex.json` 拉全站索引，在浏览器里建 FlexSearch 索引。
2. **不是服务端搜索**，没有 API、没有后端。
3. **中文可搜，但切词策略是"逐字（unigram）"**，不是分词：
   - 编码器把 CJK 区段（平假名/片假名/汉字/谚文/扩展 B）**每个字符单独作为一个 token**；
   - 拉丁文按空白切词并小写；
   - 索引字段 title / content / tags 都是 `tokenize: "forward"`（前缀匹配）。
4. **多字查询是"交集（AND）"语义**：查询串同样被切成单字，FlexSearch 内部用 intersect 合并各 token 结果 → 查"时序"≈"含'时' 且 含'序'"，**不要求相邻/成词**。

### 证据

| 事实 | 证据 |
| --- | --- |
| 官方：FlexSearch 驱动、50 万词 <10ms | `docs/features/full-text search.md:7` |
| 官方：索引去掉 Markdown 语法 | `docs/features/full-text search.md:23` |
| 官方："properly tokenizes Chinese/Korean/Japanese" | `docs/features/full-text search.md:25` |
| 依赖 ContentIndex | `docs/features/full-text search.md:19` |
| 插件与依赖版本 | `docs/plugins/Search.md:12-25`；`package.json:48`（flexsearch ^0.8.205），实际安装 **0.8.212**（`node_modules/flexsearch/package.json`） |
| 编码器：CJK 单字切分 | quartz-community/search@e9c10e5 src/components/scripts/search.inline.ts:24-66 |
| 索引定义：encode: encoder + 三字段 tokenize forward | 同上 :68-79 |
| 索引来源 /static/contentIndex.json | 同上 :527-531 |
| 多 token 取交集（intersect） | `node_modules/flexsearch/dist/module/index/search.js:205` |
| 索引文件生成（含正文纯文本 content） | `.quartz/plugins/content-index/src/emitter.ts:185-201` |
| 本地已安装 | `.quartz/plugins/search/dist/index.js`（99KB） |

> 源码 URL：https://github.com/quartz-community/search/blob/e9c10e521b95a14a512739b62a4159ab5afd5edf/src/components/scripts/search.inline.ts

### 对中文搜索质量的实际影响（⚠️ 部分验证）

- ✅ **能搜到**：单字索引保证任意中文子串都能命中（召回率高）。
- ⚠️ **精度偏低**：查"时钟"会命中所有同时含"时"和"钟"的页面（可能跨段落、无关联）；短查询（1–2 字）噪声大。
- ⚠️ **无分词 / 无拼音 / 无繁简互转**：搜"触发器"不能利用词边界；搜 shizhong 不会命中"时钟"。
- ✅ **标题权重高于正文**：同时检索 `["title","content"]` 两个字段（search.inline.ts:284-288），官方文档也如此描述（full-text search.md:25 "weighing title matches above content matches"）。
- ❓ 未验证：`tokenize: "forward"` 对单字 CJK 的前缀匹配是否会产生重复命中/排序异常；建议 Phase 2 用 25 篇真实笔记做 10 个中文查询手测。

### ⚠️ 重大风险：搜索的路径是**根绝对路径**

源码三处硬编码根路径：

| 位置 | 代码 | 后果 |
| --- | --- | --- |
| search.inline.ts:90 | `new URL("/" + slug, window.location.origin)` | 搜索结果预览（popover 内容）拉错地址 |
| search.inline.ts:181 | `itemTile.href = "/" + item.slug` | **点击搜索结果跳到站点根，而非 baseUrl 子路径** |
| search.inline.ts:527-531 | `fetch("/static/contentIndex.json")` | 子路径部署时索引 404 → **搜索完全不可用** |

→ **在 GitHub Pages 项目站（https://user.github.io/repo/）上，v5.0.0 的搜索很可能直接坏掉**（除非用自定义域名或 CF Pages 根路径）。这与 `docs/configuration.md:47` 声称的"v5 尽量用相对 URL"相矛盾，属**实现与文档不一致**，需实测确认。

---

## 8. 中文与 Unicode 路径：✅ 能跑，但有 4 个具体隐患

### 结论（✅ 已验证）

- **不音译、不转拼音、不 percent-encode**：`_sluggify()` 只做 5 类替换（空白→`-`、`&`→`-and-`、`%`→`-percent`、删 `?`、删 `#`），**其余字符（含中文、emoji、日文）原样保留**。
- 输出文件名因此包含原始中文（如 `public/数字逻辑/时序逻辑.html`），URL 也含中文（浏览器自动 percent-encode）。
- **sitemap / RSS 是安全的**：生成时用 `encodeURI(slug)`。
- **i18n 有简体中文**：`quartz/i18n/locales/zh-CN.ts` 存在，`locale: zh-CN` 可用（`docs/features/i18n.md:5`）。

### 证据

| 事实 | 证据 |
| --- | --- |
| slug 生成：仅 5 类替换，保留 Unicode | `node_modules/@quartz-community/utils/dist/path.js:45-55`（slugifyFilePath）、`:163-167`（_sluggify） |
| 禁用字符集只有空格/#/?/& | 同上 `:168-170`（_containsForbiddenCharacters） |
| 内部链接转换先 decodeURI | 同上 `:129-140`（transformInternalLink，:130） |
| CrawlLinks 用 WHATWG URL + decodeURIComponent | `.quartz/plugins/crawl-links/src/transformer.ts:112-124`（:120-121 注释"WHATWG URL percent-encodes everything"） |
| sitemap/RSS 用 encodeURI | `.quartz/plugins/content-index/src/emitter.ts:70-79`、`:94-100` |
| 中文 locale 存在 | `quartz/i18n/locales/zh-CN.ts` |

### 4 个隐患

| # | 隐患 | 严重度 | 说明 / 规避 |
| --- | --- | --- | --- |
| 1 | `decodeURI(link)` 对**非法 % 序列会抛 URIError**（path.js:130） | ⚠️ 中 | 文件名里的 % 会被 sluggify 成 -percent，但**链接文本**先过 decodeURI。例如笔记里写 `[[100%纯棉]]` 或 `[[a%zz]]` 可能让该页解析失败。→ 避免在 wikilink 目标里用 % |
| 2 | 中文 URL 在部分托管/代理上被二次编码或 404 | ⚠️ 中 | CF Pages / GH Pages 本身 OK（UTF-8 文件名）；但部分 CDN/网关、微信内置浏览器、旧版 Safari 分享链接可能出问题。→ 关键入口页用英文 slug |
| 3 | 搜索结果链接是根绝对路径（见 §7） | 🔴 高 | 与中文无关但会叠加放大：中文 + 子路径 = 搜索全废 |
| 4 | shortest 解析遇同名文件会退化成绝对路径 | ⚠️ 中 | utils/path.js:149-160：只有 basename 唯一才用 shortest；重名时退回 pathToRoot + canonicalSlug。中文笔记重名（多个 时序逻辑.md）会导致链接指向错误层级。→ 全库文件名唯一 |

### 建议（Phase 2 落地）

- **目录与文件名统一用英文/拼音 slug，标题用中文**（显示不受影响）。零成本彻底规避。
- 若必须保留中文文件名：CI 加一步"链接目标 % 检查"，并部署在 CF Pages / 自定义域名（避免子路径）。
- `locale` 改 `zh-CN`，日期/UI 文案中文化。

---

## 9. Obsidian 双向链接：✅ 写法全覆盖，断链默认静默

### 9.1 支持的写法（✅ 已验证）

| 写法 | 结果 |
| --- | --- |
| `[[Page]]` | 普通内部链接 |
| `[[Page\|别名]]` | 链接 + 自定义文本（表格里用反斜杠 + 竖线转义） |
| `[[Page#Heading]]` | 跳转到标题锚点 |
| `[[Page#Heading\|别名]]` | 标题锚点 + 别名 |
| `[[Page#^block-id]]` | 块引用跳转 |
| `![[Page]]` | 整页 transclude（运行时前端拉取 .popover-hint 片段） |
| `![[Page#Heading]]` / `![[Page#^id]]` | 部分 transclude |
| `![[image.png]]` | 图片嵌入 |
| `![[image.png\|alt 100x200]]` | 图片 + alt + 尺寸 |
| `![[video.mp4]]` / `![[audio.mp3]]` / `![[doc.pdf]]` | 视频/音频/PDF（PDF 转成 iframe class="pdf"） |
| `==高亮==` / `%%注释%%` / `#tag` | OFM 解析（注释直接剔除） |
| `obsidian://` 链接 | 加 CSS class + data-obsidian-uri |

证据：`docs/features/Obsidian compatibility.md:19-38`、`:40-68`、`:170-182`、`docs/features/wikilinks.md:13-16`、`:18-24`、OFM src/transformer.ts:232-260（video/audio/pdf/transclude 生成）。

### 9.2 链接解析策略（✅ 已验证）

- 三种策略：absolute（默认）/ relative / shortest（`docs/plugins/CrawlLinks.md:14-17`）。
- **当前项目用 shortest**（`quartz.config.yaml:76`），与 Obsidian 默认行为一致（推荐）。
- shortest 的真实逻辑（`node_modules/@quartz-community/utils/dist/path.js:149-160`）：
  1. 取目标 basename；
  2. 在 ctx.allSlugs 里找 basename 相同的条目；
  3. **唯一命中** → 用相对路径；
  4. **0 个或多个命中** → 退回"根相对 canonical 路径"（可能指错层级）。
- prettyLinks（默认 true）会把链接**显示文本**裁成 basename（crawl-links/src/transformer.ts:128-133）——只改显示，不改 href。
- 附件/图片：img/video/audio/iframe 的 src 统一走 transformLink（crawl-links/src/transformer.ts:137-151）。

### 9.3 断链如何处理（✅ 已验证，重要）

- **默认：静默通过**。crawl-links 只做 URL 变换，**不检查目标是否存在**（通读 transformer.ts 全文无 existence 校验）；data-slug 照写。
- 唯一可选断链处理：OFM 的 `disableBrokenWikilinks: true` → 指向不存在笔记的 wikilink 渲染成 `<a class="internal broken">` 灰显不可点（src/transformer.ts:268-285）。**默认 false**（`docs/plugins/ObsidianFlavoredMarkdown.md:27`）。
- 后果：断链在站点上是普通可点链接 → 跳 404 页；**构建不报错、CI 不失败**。

### 风险

1. ⚠️ **没有断链检测**：从 Obsidian 迁移 25 篇笔记很可能带进断链，且构建期完全静默。→ 建议 Phase 2 加"全站链接校验"脚本（读 contentIndex.json 的 links 字段做差集，成本极低）。
2. ⚠️ shortest + 重名文件 = 静默指错（见 §8 隐患 4）。
3. ❓ transclude（`![[Page]]`）是**运行时 fetch** 目标页再取 .popover-hint 片段；SPA 导航/离线场景行为未实测。

---

## 10. 私有内容机制：4 种手段 + 推荐方案

### 10.1 四种机制对比（✅ 已验证）

| 机制 | 类型 | 行为 | 默认状态 | 证据 |
| --- | --- | --- | --- | --- |
| ignorePatterns | 全局配置（glob） | 构建时**根本不读**匹配的文件/目录（等于不存在） | 已配 private / templates / .obsidian | `docs/features/private pages.md:18-30`、`docs/configuration.md:48`、`quartz/build.ts:107`、`static.ts:11` |
| remove-draft | Filter | 剔除 `draft: true` 的页面，**其余全发** | **已启用**（`quartz.config.yaml:98-99`） | `docs/plugins/RemoveDrafts.md:7` |
| explicit-publish | Filter | **只发** `publish: true`（或 "true"）的页面，其余全剔 | **已关闭**（`quartz.config.yaml:100-101`） | `docs/plugins/ExplicitPublish.md:7`、`.quartz/plugins/explicit-publish/src/filter.ts:5-8` |
| encrypted-pages | Transformer + Filter + Component | 正文用 **AES-256-GCM** 构建期加密，前端 Web Crypto 解密；密码来自 frontmatter | **已启用**（`quartz.config.yaml:229-239`，visibility: icon、iterations: 600000） | `docs/plugins/EncryptedPages.md:8`、`:18-29`、`:37-43`、`:60-65` |
| unlisted-pages | —— | **v5.0.0 不存在此插件**（42 个锁定插件里没有；`docs/` 全库 grep unlisted 零命中） | — | `quartz.lock.json` 全量清单、`docs/plugins/index.md:26-88` |

### 10.2 关键前提：过滤器**不保护非 Markdown 文件**（🔴 高危）

`docs/features/private pages.md:15-16` 原文警告：

> "Regardless of the filter plugin used, **all non-markdown files will be emitted and available publically in the final build.** This includes files such as images, voice recordings, PDFs, etc."

代码印证：Assets emitter 只排除 `**/*.md` + ignorePatterns + pageType 扩展名（`quartz/plugins/emitters/assets.ts:22-28`），然后**无条件复制其余所有文件**（`:43-52`）。
→ 即使 explicit-publish 只放行 3 个 md，**content/ 下所有图片/PDF/录音仍会被发布**。

### 10.3 推荐"白名单发布"方案（针对 LumenTrace Wiki）

**方案（推荐，Phase 4 采用）**：

1. **过滤层（页面）**：关 remove-draft、开 explicit-publish
   - `quartz.config.yaml`：remove-draft.enabled: false、explicit-publish.enabled: true
   - 只有 `publish: true` 的笔记进站；**默认不发布**（新增笔记不会误发）。
2. **目录层（附件 + 私有大目录）**：ignorePatterns 白名单化思路
   - 私有/草稿区整体排除：private、drafts、99-Private
   - 由于 filters 不保护附件，**附件必须靠目录 + ignorePatterns 管住**：仅内部使用的附件放 private/ 下。
3. **敏感页（少数）**：encrypted-pages（frontmatter 加 `password: xxx`）
   - ⚠️ 必须理解边界：**只是客户端加密**，密文 + 页面源码都在公开站点上；官方明确写 "protects against casual browsing but not against determined attackers"（`EncryptedPages.md:65`）。**不能当真正的访问控制**。
4. **真正的私有**：仓库层面 .gitignore（官方警告 `private pages.md:32-33`）——不提交到公开 repo 才是真私有。

**为什么不用 remove-draft 当白名单**：它是"黑名单"语义（默认全发，靠 draft: true 排除）。25 篇里只要一篇忘加 draft 就公开了。**白名单必须用 explicit-publish**。

### 风险

1. 🔴 误以为"开了 explicit-publish 就安全" → 附件泄漏（见 10.2）。
2. 🔴 把 encrypted-pages 当权限系统 → 实际只是"防路人"。
3. ⚠️ encrypted-pages 与 search/RSS/sitemap 的交互：官方说 "plaintext is stripped from search indices and RSS regardless of visibility"（`EncryptedPages.md:63`），但 visibility: icon 时**标题/元数据仍可见**；要完全隐藏需 visibility: hidden（`:37,43`）。❓ 未实测 hidden 时是否真从 contentIndex 消失。

---

## 11. 部署：Cloudflare Pages / GitHub Actions

### 11.1 Cloudflare Pages（✅ 官方文档验证）

| 配置项 | 值 | 证据 |
| --- | --- | --- |
| Production branch | `v5`（本项目按实际分支填，如 main） | `docs/hosting.md:26` |
| Framework preset | `None` | `docs/hosting.md:27` |
| Build command | `npx quartz plugin restore && npx quartz build` | `docs/hosting.md:28` |
| Build output directory | `public` | `docs/hosting.md:29` |
| Node 版本 | **Node 22**（.node-version = v22.16.0；engines node>=22） | `package.json:24-27`、`.node-version` |
| 浅克隆问题 | 依赖 git 时间戳时构建命令前加 `git fetch --unshallow &&` | `docs/hosting.md:35-36` |

**插件安装步骤（关键）**：
- CI 用 `npx quartz plugin restore`（按 lockfile 精确恢复，可降级）——`docs/cli/plugin.md:72-78`。
- 若有人只改 quartz.config.yaml 没更新 lockfile，再加 `npx quartz plugin resolve` 补齐——`docs/hosting.md:15-16`、`docs/cli/plugin.md:123-135`。
- ⚠️ `package.json:22` 的 prebuild 是 `npm run install-plugins`：**用 `npm run build` 会触发插件安装，用 `npx quartz build` 不会**。CI 请显式 plugin restore。

**Cloudflare Pages 免费额度（✅ 官方 limits 页）**——来源 https://developers.cloudflare.com/pages/platform/limits/ ：

| 项目 | Free 额度 |
| --- | --- |
| 并发构建 | 1 个（Pro 5 / Business 20） |
| 构建次数 | **500 次/月**（Pro 5,000 / Business 20,000） |
| 单次构建超时 | **20 分钟** |
| 站点文件数 | **20,000 个**（付费 100,000） |
| 单文件大小 | **25 MiB** |
| 自定义域名 | 100 / 项目 |
| Preview 部署 | 不限 |

> 对 25 篇文档：文件数、构建时长都远低于限额；**唯一要留意的是 500 次/月**（≈16 次/天，正常写作够用，频繁 force-push 需注意）。

### 11.2 GitHub Actions → GitHub Pages（✅ 官方 workflow，可直接用）

`docs/hosting.md:45-93` 给出完整 `.github/workflows/deploy.yml`，要点：

- 触发：push 到分支（文档示例为 v5，按实际分支改）
- 权限：contents: read / pages: write / id-token: write
- concurrency: group: pages
- build job：actions/checkout@v4 + **fetch-depth: 0**（必须，否则 git 时间戳缺失）→ actions/setup-node@v4 node-version: 22 → npm ci → npx quartz plugin restore → npx quartz build → actions/upload-pages-artifact@v3 path: public
- deploy job：actions/deploy-pages@v4
- 仓库 Settings → Pages → Source 选 **GitHub Actions**（`docs/hosting.md:97`）

⚠️ GitHub Pages 特有坑（官方明确）：Quartz 生成 `file.html` 而非 `file/index.html`，**GitHub Pages 不做尾斜杠重定向**，旧链接可能断（`docs/hosting.md:105-106`）。

### 11.3 baseUrl / SPA / 子路径（✅ 已验证）

| 项 | 规则 | 证据 |
| --- | --- | --- |
| baseUrl | **不带协议、不带首尾斜杠**；GitHub Pages 项目站要带子路径（如 user.github.io/repo） | `docs/configuration.md:44-46` |
| 当前值 | `quartz.jzhao.xyz`（**模板默认值，部署前必须改**） | `quartz.config.yaml:10` |
| 相对 URL | v5 声称尽量用相对 URL | `docs/configuration.md:47` |
| SPA | enableSPA: true（当前已开）；原理是 micromorph 局部替换 | `quartz.config.yaml:5`、`docs/features/SPA Routing.md:9`、`docs/configuration.md:28` |
| 本地预览子路径 | `npx quartz build --serve --baseDir /repo` | `docs/cli/build.md:20`、`quartz/cli/args.js:90-94` |

**子路径部署注意事项（🔴 重点）**：

1. baseUrl 必须含子路径，否则 sitemap/RSS/OG 的绝对 URL 全错（content-index 用 `https://<baseUrl>/...`，emitter.ts:73,96）。
2. **但搜索会坏**（见 §7）：`fetch("/static/contentIndex.json")`、`href="/"+slug` 都是根绝对路径。
3. iframe / 自定义页面的 `/static/...` 也会 404。
4. → **强烈建议：Cloudflare Pages + 自定义域名（根路径部署）**，或 GitHub Pages 用 **User Site 仓库（<user>.github.io）** 而非项目站。

### 11.4 其它托管（备选）

- Vercel：需 `vercel.json { "cleanUrls": true }`（`docs/hosting.md:134-142`）。
- Netlify：build 同 CF，publish `public`（`docs/hosting.md:182-189`）。
- 自托管：Nginx/Apache/Caddy 需 `try_files $uri $uri.html $uri/ =404`（`docs/hosting.md:237-296`）。

> 📌 文档小瑕疵：`docs/hosting.md:39` 链接了 `[[ci-cd]]`，但 `docs/` 下**没有 ci-cd.md**（已确认目录清单）。不影响使用。

---

## 12. RSS / sitemap / OG image：默认全开

### 结论（✅ 已验证）

| 能力 | 负责插件 | 输出 | 默认 | 当前状态 |
| --- | --- | --- | --- | --- |
| RSS | content-index | `/index.xml`（可用 rssSlug 改名） | ✅ 开（enableRSS 默认 true） | 已启用（`quartz.config.yaml:104-108`） |
| Sitemap | content-index | `/sitemap.xml` | ✅ 开（enableSiteMap 默认 true） | 已启用 |
| 内容索引 | content-index | `/static/contentIndex.json`（搜索 + 图谱 + backlinks 用） | ✅ 恒定生成 | 已启用 |
| OG 图 | og-image | 每页 og:image（satori 生成 PNG） | 配置项，本项目**已开** | 已启用（`quartz.config.yaml:111-112`） |

证据：
- `docs/features/RSS Feed.md:1`、`:4`（`https://<baseUrl>/index.xml`）
- `docs/plugins/ContentIndex.md:7`、`:16-21`（enableSiteMap / enableRSS / rssLimit / rssFullHtml / rssSlug）
- 源码 `.quartz/plugins/content-index/src/emitter.ts:42-51`（默认值）、`:70-79`（sitemap）、`:82-132`（RSS）、`:185-201`（contentIndex.json）
- `docs/features/social images.md:11`、`docs/plugins/CustomOgImages.md:7`、`:24`（**OG 图需要 baseUrl 正确**）、`:76-78`（优先级：frontmatter > 生成图 > quartz/static/og-image.png）
- `docs/plugins/CustomOgImages.md:84-86`（字体来自 theme.typography，satori 需要字体文件）

### ⚠️ OG 图对中文站点的两个风险

1. 🔴 **中文字形缺失**：OG 图用 theme.typography.header/body 的字体（当前 Schibsted Grotesk / Source Sans Pro，**纯拉丁字体**，`quartz.config.yaml:19-22`）。satori 渲染中文标题时大概率**缺字/方块**。→ 需在 `quartz.ts` override 里给 satori 追加中文字体（或换含 CJK 的 Google 字体，如 Noto Sans SC）。**上线前必须实测。**
2. ⚠️ **构建耗时**：25 页 = 25 张 1200×630 PNG（satori + sharp）。推测单张 0.2–1s，总计 +5–25s（❓ 未实测）。本地 watch 会变慢；可 excludeRoot 或临时关闭。

### RSS/sitemap 风险

- ⚠️ baseUrl 忘改 → RSS/sitemap 里全是 https://quartz.jzhao.xyz/...（当前值就是模板默认）。**最容易漏的一步。**
- ⚠️ RSS 默认只含最近 10 条（rssLimit: 10，emitter.ts:45）。

---

## 13. 性能与资源

### 13.1 并发度（✅ 源码已验证，⚠️ 官方文档与源码不一致）

源码真相（`quartz/processors/parse.ts:153-155`）：

    const CHUNK_SIZE = 128
    const concurrency = ctx.argv.concurrency ?? clamp(fps.length / CHUNK_SIZE, 1, 4)

- `clamp(x, 1, 4)`：**默认并发上限是 4**，不是 CPU 核数。
- **只有文件数 > 128 才会 > 1**（25 篇 → 25/128≈0.2 → round 0 → clamp → **1**）。
- 显式传 `--concurrency N` 时以参数为准（`quartz/cli/args.js:115-118`）。
- 并发 > 1 时先用 esbuild 转译 worker 脚本再起 workerpool 线程池（`parse.ts:167-173`）。
- 官方文档 `docs/cli/build.md:23` 写 "Default: CPU core count"，`docs/advanced/architecture.md:25` 写 ">128 pieces of content 才 spawn worker"——**后者与源码一致，前者（build.md）与源码矛盾**。以源码为准。

### 13.2 25 篇文档的构建时间/内存（❓ 未实测，给出推算依据）

| 阶段 | 说明 | 推算 |
| --- | --- | --- |
| esbuild 转译整个 Quartz（每次 build 必做） | `docs/advanced/architecture.md:15-20`；含 SCSS + inline 脚本二次打包 | **2–5s**（冷启动，Windows 偏慢） |
| 解析 25 篇 md | 单线程（concurrency=1） | **< 1s** |
| 渲染 HTML（Preact SSR） | 每页一次 | **1–3s** |
| OG 图生成 | 25 张 satori+sharp | **+5–25s**（最大变量） |
| 写文件 | 25 HTML + 静态资源 | < 1s |
| **合计** | | **约 10–35s**（含 OG）/ **约 5–10s**（关 OG） |

- **内存**：Node + esbuild + sharp + satori 常驻，推算 **300–800 MB**（❓ 未实测）。25 篇时 worker 不启动，不叠加。
- **热重载**：`--serve` 下只有配置/源码改动才重转译，内容改动走增量 partialEmit（`quartz/build.ts:219-376`），通常 **< 2s**。
- ❓ 已知小内存泄漏：配置热重载每次约 350kB（`docs/advanced/architecture.md:20`）。

### 13.3 可优化点

1. 25 篇用不到多线程（默认已是 1），无需改 `--concurrency`。
2. OG 图若不需要：`og-image.enabled: false`，构建时间立省一半以上（❓ 需实测占比）。
3. 字体 cdnCaching: true（当前）→ 运行时从 fonts.googleapis.com 拉（`quartz/components/Head.tsx:43`）；若改 cdnCaching: false，则**构建期**要访问 fonts.googleapis.com 并把字体下载到 `/static/fonts/`（`quartz/plugins/emitters/componentResources.ts:284-304`、`quartz/util/theme.ts:117-141`）。→ **中国大陆网络下构建期下载字体可能失败/超时**；推荐 `fontOrigin: local` + 自备字体，彻底摆脱 Google。

---

## 14. 对 LumenTrace Wiki 的落地建议

### Phase 2（内容上线 + 基础能力）

| 优先级 | 事项 | 具体做法 | 依据 |
| --- | --- | --- | --- |
| P0 | 改 baseUrl | `quartz.config.yaml:10` 改为实际域名（如 lumentrace.pages.dev 或自定义域名），**不带协议/斜杠** | `docs/configuration.md:44-46` |
| P0 | 中文 locale | `locale: zh-CN`（`quartz.config.yaml:9`） | `quartz/i18n/locales/zh-CN.ts` |
| P0 | **验证 OG 图中文** | 构建后打开任意页看 og:image，确认中文标题不是方块；否则加 Noto Sans SC 字体 override | `docs/plugins/CustomOgImages.md:84-86` |
| P0 | **部署方式定稿** | 推荐 **Cloudflare Pages + 自定义域名（根路径）**；若必须 GitHub Pages，用 `<user>.github.io` 用户站，避免项目子路径 | 本报告 §7、§11.3 |
| P1 | 搜索中文实测 | 用 10 个中文查询（"时序""状态机""建立保持"…）手测；精度差则在标题/摘要补关键词 | 本报告 §7 |
| P1 | 链接校验脚本 | 读 `public/static/contentIndex.json` 的 links，与 Object.keys 求差集，输出断链清单；挂 CI | 本报告 §9.3 |
| P1 | Mermaid 可用性验证 | 至少 3 个图（flowchart / sequenceDiagram / stateDiagram）在 **SPA 站内跳转后**仍能渲染（验证 nav 重渲染 + cdnjs 可达） | 本报告 §2 |
| P1 | 块级公式检查 | 扫描 `content/` 里 `$$...$$` 未独占行的写法并修正 | `docs/features/Latex.md:53-54` |
| P2 | 字体自托管 | `fontOrigin: local` + custom.scss 里 `@font-face` 指向 `/static/fonts/`，去掉 Google 依赖 | 本报告 §13.3 |
| P2 | KaTeX CSS 自托管 | 把 katex.min.css 放 `quartz/static/` 并覆盖外部引用（可选，jsdelivr 一般可用） | 本报告 §3 |

### Phase 3 / 4（进阶：时序图 / 交互页 / 白名单发布）

| 需求 | 推荐方案 | 不要做什么 |
| --- | --- | --- |
| **WaveDrom 时序图** | **方案 A（预渲染 SVG）**：沿用 vault 的 `.agent-tools/render-wavedrom.mjs` 生成 .svg，放 `content/Assets/TimingDiagrams/`，Markdown 用 `![[x.svg\|800]]`；批量脚本在 build 前跑一次 | ❌ 不要在 Markdown 里内联 script 画 WaveDrom（SPA 下失效、且无 sanitize）；❌ 不要指望 Mermaid 画时钟波形 |
| **交互式时序/波形页** | 自包含 HTML 放 `quartz/static/lab/<topic>/index.html`（内置已渲染 SVG + 播放控件），页面里用 iframe 引用（loading="lazy"） | ❌ 不要用"根绝对路径 + 子路径部署"的组合 |
| **Canvas 知识地图** | 直接用 `canvas-page`（已启用）；.canvas 放 content/ 对应目录，用 `![[x.canvas]]` 或直接访问 `/x` | ⚠️ 大画布先测移动端性能 |
| **Bases 索引页** | 用 `bases-page` 做"全部笔记 / 按标签 / 按难度"的表格视图；复杂公式先降级为简单过滤 | ⚠️ 别依赖 Obsidian 原生 Bases 全部函数 |
| **白名单发布** | 关 remove-draft、开 explicit-publish + ignorePatterns 管住私有目录与附件 + 敏感页用 encrypted-pages | 🔴 不要以为 explicit-publish 能挡附件；🔴 不要把 encrypted-pages 当权限系统 |
| **中文搜索优化** | 短期：标题写全关键词；中期：给 contentIndex 生成加"标题+摘要"权重（改 content-index 插件或 override）；长期：换支持中文分词的索引 | ⚠️ 25 篇规模先测再决定，别过早复杂化 |

---

## 15. 三大风险点（结论先行）

1. 🔴 **搜索在子路径部署下会整体失效**（根绝对路径 `/static/contentIndex.json`、`href="/"+slug`）——GitHub Pages 项目站是最常见踩坑场景，且**构建期无任何报错**。规避：CF Pages + 自定义域名，或用户站 `<user>.github.io`。
2. 🔴 **白名单发布的附件泄漏**：filters 只保护 .md，content/ 下图片/PDF/录音会**无条件全部发布**；同时 encrypted-pages 只是"防路人"的客户端加密。规避：私有附件必须放进被 ignorePatterns 排除的目录。
3. ⚠️ **外部 CDN 与中文字体依赖**：Mermaid 运行时从 cdnjs 拉取、KaTeX CSS 走 jsdelivr、字体走 Google Fonts、OG 图中文字形可能缺失——四项叠加使"中国大陆访问体验"和"构建稳定性"都有不确定性，且失败多为**静默降级**（图空白/方块字），不报错。规避：Phase 2 逐项实测 + 自托管关键资源。

---

## 16. 待验证清单（建议 Lead 安排实测）

| # | 待验证项 | 验证方法 | 影响 |
| --- | --- | --- | --- |
| 1 | 搜索在子路径部署是否真的坏 | `npx quartz build --serve --baseDir /repo` 后测搜索 | 决定部署形态 |
| 2 | OG 图中文是否缺字 | 构建后看 public/ 下 og 图 / 页面 og:image | 社交分享质量 |
| 3 | Mermaid 在 SPA 跳转后是否重渲染 | 站内跳转到含 mermaid 的页 | Phase 2 图功能 |
| 4 | 25 篇真实构建耗时/内存 | `npx quartz build` 计时 + 任务管理器 | 决定是否关 OG |
| 5 | 块级公式 $$ 单行写法失败率 | 扫描 content/ 并构建 | 公式迁移 |
| 6 | 中文文件名在目标托管上的实际表现 | 部署后点中文 URL、复制分享链接 | 命名规范决策 |
| 7 | encrypted-pages visibility: hidden 是否真从 contentIndex 消失 | 构建后 grep static/contentIndex.json | 私有内容机制 |
| 8 | `![[Page]]` transclude 在 SPA 下行为 | 站内跳转 + 打开含 transclude 的页 | 知识组织方式 |

---

## 17. 证据索引（关键文件清单）

**本地文档**
- `docs/features/Mermaid diagrams.md`、`docs/features/Latex.md`、`docs/features/Obsidian compatibility.md`、`docs/features/wikilinks.md`
- `docs/features/Canvas.md`、`docs/features/Bases.md`、`docs/features/full-text search.md`、`docs/features/private pages.md`
- `docs/features/RSS Feed.md`、`docs/features/social images.md`、`docs/features/SPA Routing.md`、`docs/features/i18n.md`
- `docs/plugins/ObsidianFlavoredMarkdown.md`、`GitHubFlavoredMarkdown.md`、`Latex.md`、`Static.md`、`Search.md`、`CanvasPage.md`、`BasesPage.md`、`CrawlLinks.md`、`ContentIndex.md`、`RemoveDrafts.md`、`ExplicitPublish.md`、`EncryptedPages.md`、`CustomOgImages.md`、`index.md`
- `docs/configuration.md`、`docs/hosting.md`、`docs/cli/build.md`、`docs/cli/plugin.md`、`docs/advanced/architecture.md`、`docs/advanced/paths.md`

**本地核心源码**
- `quartz.config.yaml`、`package.json`、`.node-version`、`quartz.lock.json`
- `quartz/plugins/emitters/static.ts`、`quartz/plugins/emitters/assets.ts`、`quartz/plugins/emitters/componentResources.ts`
- `quartz/plugins/loader/config-loader.ts`、`quartz/plugins/loader/gitLoader.ts`、`quartz/plugins/quartz-plugins.schema.json`
- `quartz/cli/args.js`、`quartz/cli/plugin-data.js`、`quartz/cli/plugin-git-handlers.js`
- `quartz/processors/parse.ts`、`quartz/build.ts`、`quartz/util/ctx.ts`、`quartz/util/jsx.tsx`、`quartz/util/theme.ts`、`quartz/util/path.ts`
- `node_modules/@quartz-community/utils/dist/path.js`、`node_modules/flexsearch/dist/module/index/search.js`

**已安装插件（dist 已落地）**
- `.quartz/plugins/{github-flavored-markdown,latex,crawl-links,content-index,canvas-page,explicit-publish,remove-draft,search,og-image,obsidian-flavored-markdown}/`

**远端源码（lockfile commit，只读）**
- OFM：https://github.com/quartz-community/obsidian-flavored-markdown/blob/eda74e79eac746445b7d6941f90133bf97483cd7/src/transformer.ts
- OFM mermaid 脚本：https://github.com/quartz-community/obsidian-flavored-markdown/blob/eda74e79eac746445b7d6941f90133bf97483cd7/src/scripts/mermaid.inline.ts
- search：https://github.com/quartz-community/search/blob/e9c10e521b95a14a512739b62a4159ab5afd5edf/src/components/scripts/search.inline.ts

**外部**
- Cloudflare Pages 限额：https://developers.cloudflare.com/pages/platform/limits/

---

## 附录 A：文档与源码不一致清单（供 Lead 决策参考）

| # | 文档说法 | 源码事实 | 结论 |
| --- | --- | --- | --- |
| 1 | `docs/cli/build.md:23`：--concurrency 默认 "CPU core count" | `quartz/processors/parse.ts:155`：clamp(files/128, 1, 4) | **以源码为准**：默认 ≤4，且 <128 篇时为 1 |
| 2 | `docs/configuration.md:47`：v5 尽量用相对 URL | search 插件用 /static/contentIndex.json 与 "/"+slug 根绝对路径 | **实现与文档不符**，子路径部署需实测 |
| 3 | `docs/features/full-text search.md:25`：properly tokenizes CJK | 逐字 unigram 切分（非分词） | 文档措辞偏乐观，实际"能搜但精度有限" |
| 4 | `docs/hosting.md:39` 引用 `[[ci-cd]]` | `docs/` 无 ci-cd.md | 文档死链，不影响功能 |

---

## 附录 B：本次调研的操作边界（供审计）

- ✅ 只读：`Get-ChildItem / Get-Content / rg(grep) / read / GitHub raw 拉取`
- ✅ 只写 1 个文件：`_scratch/research/quartz5-capabilities.md`（+ 创建 `_scratch/research/` 目录）
- ❌ 未执行：npm / npx / git 写操作、未修改 content/、未修改 quartz.config.yaml、未修改 quartz/、未修改 .quartz/
- ℹ️ 期间观察到的安装中断已同步给 Lead（19:31 中断 → 19:45 前后恢复并完成 42 插件安装）

---


---

## 附录 C：Lead 实测反馈（2026-10-27，对 §8 结论的重要补充）

以下为 Lead 在真实构建/部署中实测得到的结论，**优先级高于本报告的推断**，已据此修订 §8 的建议：

1. **文件名大小写不一致会导致生产 404（🔴 已验证）**：`crawl-links` 依赖的 utils 会把链接 slug 转**小写**，而 Quartz v5.0.0 core 的 emitter 按**原始大小写**输出文件名 → 生产环境（Linux 大小写敏感）404。
   → 处置：content 的目录与文件名全部改为**小写英文 kebab-case**（如 `signal-processing/dft-and-fft.md`），断链清零。
   → 这也意味着 §8「中文文件名可用」的结论**在部署层要打折**：中文可跑，但**大小写混用 + 子路径 + 中文**三者叠加风险过高，规范化为小写英文是最优解。
2. **插件安装无法直连 GitHub（TLS 中断）**：改用 npm 上同源的 `@quartz-community/*` 包（含 dist）解包到 `.quartz/plugins` 并本地 git init 作为离线方案，脚本 `scripts/provision-plugins.ts`，44/44 成功。
   → 印证 §0.2 的判断：安装器只保留 dist；同时说明「source 必须是 github: 形式」的结论在**离线安装**场景下依然成立（配置语法不变，只是获取方式换成本地解包）。
3. **搜索实测可用**：逐字索引，中文查询命中正常；但结果链接是**根绝对路径**，与 §7 结论一致。
   → 文档中已标注：**只适合 Cloudflare Pages 根路径部署**。

> 因此，§15 的风险 1（子路径搜索失效）与 §8 的建议（文件名规范化）已被实测确认，属于**上线前必须遵守的约束**，而非「待验证项」。

*报告结束。所有 ✅ 结论均可按上述 文件:行号 复核；所有 ❓ 项已列入 §16 待验证清单。*



