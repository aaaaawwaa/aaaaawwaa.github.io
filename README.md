# LumenTrace Wiki

> 面向电子信息工程学习的个人技术知识网站：以本地 Obsidian Markdown 为唯一内容源，通过白名单同步发布为静态站点。

- **站点框架**：[Quartz v5.0.0](https://quartz.jzhao.xyz/)（面向 Obsidian 的静态站点生成器）
- **内容格式**：Obsidian Flavored Markdown + LaTeX + Mermaid
- **代码托管**：GitHub　**网站托管**：Cloudflare Pages（备选 GitHub Pages）
- **本地运行**：Node.js ≥ 22、npm ≥ 10.9.2

---

## 1. 目录结构

```text
LumenTrace-Wiki/
├── content/                    # 站点内容（唯一的公开内容来源）
│   ├── index.md                # 首页：八大板块导航卡片
│   ├── mathematics/            # 数学基础
│   ├── signal-processing/      # 信号处理
│   ├── communication/          # 通信原理
│   ├── digital-systems/        # 数字系统（Verilog / FSM / FPGA）
│   ├── programming/            # 编程实践（C / Python / MATLAB）
│   ├── ai-agents/              # AI 工具与 Agent 工作流
│   ├── projects/               # 项目与实验记录
│   ├── interactive-labs/       # 交互式实验
│   └── maps/                   # 跨学科导航：学习路径 / 知识网络
├── quartz/                     # Quartz 核心（上游代码，尽量不改）
│   ├── static/                 # 站点级静态资源 → 构建后位于 /static/**
│   └── styles/custom.scss      # ★ 本站自定义样式（中文排版与视觉设计都改这里）
├── quartz.config.yaml          # ★ 站点配置（标题、主题、插件、布局）
├── quartz.lock.json            # 插件版本锁（固定 commit，保证可复现）
├── quartz.ts                   # 配置加载入口（默认即可，无需改动）
├── scripts/
│   ├── provision-plugins.ts    # 受限网络下的离线插件安装（从 npm 获取预构建插件）
│   └── audit-site.mjs          # 构建产物自检（断链 / 搜索索引 / 富内容统计）
├── docs/                       # Quartz 官方文档（上游附带，供查阅）
├── README.md                   # 本文件
├── AGENTS.md                   # Agent 修改本站的规则
├── DEPLOYMENT.md               # 部署、更新、回滚
└── TEST-REPORT.md              # 测试报告、已知问题、后续计划
```

---

## 2. 快速开始

```bash
# 0. 环境自检（要求 Node >= 22）
node -v && npm -v

# 1. 安装依赖
npm install

# 2. 安装 Quartz 插件（首次需要，约 42 个社区插件）
npm run plugins:install
# 若所在网络无法稳定访问 GitHub，改用离线方案（见下节）

# 3. 本地预览（热更新）→ http://localhost:8080
npm run dev

# 4. 生产构建 + 自动自检
npm run verify
```

### 2.1 受限网络下的插件安装（重要）

Quartz 5 的插件**不在 npm 依赖里**，而是由 `npx quartz plugin install` 从 GitHub 克隆源码、
逐个 `npm install && npm run build`，最后生成 `.quartz/plugins/index.ts`。
在中国大陆直连 GitHub 时这一步经常出现 TLS 中断或长时间卡住。

本项目提供等价离线方案：

```bash
npm run plugins:offline   # = npx tsx scripts/provision-plugins.ts
```

做的事情：

1. 读取 `quartz.config.yaml` 中所有 `github:quartz-community/<name>` 插件；
2. 从 npm 镜像获取同名官方包（`@quartz-community/<name>`，由同一仓库发布，内容为构建好的 `dist/`）；
3. 解包到 `.quartz/plugins/<name>`，并初始化本地 git 仓库，让构建器认为插件已就绪；
4. 调用 Quartz 官方 `regeneratePluginIndex()` 生成插件索引。

> 两种方式的产物等价（同一仓库、同一版本线）。CI 环境（GitHub Actions / Cloudflare）网络正常时仍然建议用
> `npm run plugins:install`，以 `quartz.lock.json` 中锁定的 commit 为准。

---

## 3. 内容组织

| 板块 | 目录 | 说明 |
| --- | --- | --- |
| 数学基础 | `content/mathematics/` | 线性代数、概率论、变换与复变 |
| 信号处理 | `content/signal-processing/` | 信号与系统、卷积、采样、DFT/FFT |
| 通信原理 | `content/communication/` | 模拟调制、数字调制、误码率 |
| 数字系统 | `content/digital-systems/` | Verilog 时序、FSM、FPGA |
| 编程实践 | `content/programming/` | C 指针与内存、Python/NumPy、MATLAB |
| AI 工具 | `content/ai-agents/` | LLM 助手、RAG、Agent 工作流 |
| 项目实战 | `content/projects/` | UART 回环等可复现工程记录 |
| 交互实验 | `content/interactive-labs/` | 可运行脚本与参数化实验 |
| 跨学科导航 | `content/maps/` | 学习路径、知识网络、导航总览 |

### 3.1 文件命名约定（必须遵守）

- 目录名、文件名一律使用**小写英文短横线**：`signal-processing/dft-and-fft.md`
- 原因：Quartz 5 生成链接时会把 slug 转小写，而输出文件名沿用原始大小写。
  如果内容文件名含大写，本地 Windows 预览正常，但部署到 Linux（Cloudflare / GitHub Actions）后**全站链接 404**。
- 页面标题、正文用中文，显示效果不受影响。

### 3.2 Frontmatter 约定

```yaml
---
title: DFT 与 FFT
description: 从 DFT 定义出发理解离散频谱、频率分辨率与频谱泄漏。（用于搜索摘要与社交卡片）
tags:
  - signal-processing
  - dft
---
```

### 3.3 链接约定

- Obsidian 双链：`[[dft-and-fft|DFT 与 FFT]]`、`[[signal-processing/index|信号处理]]`
- 跨目录时写完整路径，避免同名文件歧义（`markdownLinkResolution: shortest`）
- 断链默认**不会报错**，由 `npm run audit` 兜底检查

---

## 4. 站点配置

主配置：`quartz.config.yaml`

| 配置项 | 当前值 | 说明 |
| --- | --- | --- |
| `pageTitle` | LumenTrace Wiki | 站点名 |
| `pageTitleSuffix` | ` · LumenTrace` | 浏览器标签后缀 |
| `baseUrl` | `lumentrace-wiki.pages.dev` | **部署前需改成真实域名**（RSS / sitemap 用） |
| `locale` | `zh-CN` | UI 文案与日期中文化 |
| `enableSPA` / `enablePopovers` | `true` | 页面无刷新切换、链接悬浮预览 |
| `analytics` | `null` | 不引入任何第三方统计 |
| `ignorePatterns` | private / templates / _drafts … | 不参与构建的路径 |

### 4.1 已启用的插件（核心能力）

| 能力 | 插件 |
| --- | --- |
| Obsidian 语法（双链、callout、Mermaid、高亮、注释） | `obsidian-flavored-markdown` |
| LaTeX 公式（构建期 KaTeX SSR） | `latex` |
| 代码高亮 | `syntax-highlighting` |
| 全文搜索（FlexSearch，客户端索引） | `search` + `content-index` |
| 知识图谱 | `graph` |
| 反向链接 | `backlinks` |
| 目录树导航 | `explorer` |
| 文章目录 | `table-of-contents` |
| 明暗主题 | `darkmode` |
| 阅读模式 | `reader-mode` |
| Obsidian Canvas / Bases | `canvas-page` / `bases-page` |
| RSS / sitemap / OG 社交卡片 | `content-index` / `og-image` |
| 草稿过滤 | `remove-draft` |

> 站点内所有界面文案、日期格式由 `locale: zh-CN` 控制；个别上游组件（如属性面板的 "Properties"、
> 面包屑根节点 "Home"）仍是英文，属于 Quartz 5 上游文案，见 TEST-REPORT.md 的已知问题。

### 4.2 视觉设计

样式集中在 `quartz/styles/custom.scss`，原则是**只用 Quartz 内置 CSS 变量与既有类名，不引入额外前端依赖**：

- 中文正文行高 1.78、字距 0.01em；标题层级用左侧细强调线建立章节节奏
- 链接下划线用背景渐变实现，hover 时从左向右展开
- 代码块细边框 + 圆角；表格紧凑化
- 首页把 Markdown 表格渲染成「知识板块卡片网格」
- 移动端压缩留白，站点标题不换行，属性表允许换行

主题色板在 `quartz.config.yaml` 的 `theme.colors`（亮色以 `#1a5fb4` 为主色，暗色以 `#7aa7ff` 为主色）。

---

## 5. 内容安全（公开发布原则）

1. **本地 Obsidian 知识库是原始数据源，网站只发布明确授权的公开内容。**
2. 不要直接把整个 Vault 复制进 `content/`；只同步白名单目录（Phase 3 会提供 `scripts/sync-public.mjs`）。
3. 提交前检查：`private/`、`_drafts/`、密钥、令牌、账号信息不得进入 `content/`。
4. `ignorePatterns` 只作用于 Markdown 构建，**不会自动过滤附件**，附件必须靠白名单挑选。
5. 单向同步：Obsidian → Wiki。不要在网站上手工改内容再回灌 Vault。

---

## 6. 脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地预览（`npx quartz build --serve --port 8080`） |
| `npm run build:site` | 生产构建到 `public/` |
| `npm run audit` | 自检 `public/`：断链、搜索索引、Mermaid/KaTeX/代码块数量、RSS/sitemap |
| `npm run verify` | 构建 + 自检（提交前必跑） |
| `npm run plugins:install` | 从 GitHub 安装插件（官方方式） |
| `npm run plugins:offline` | 从 npm 离线补齐插件（受限网络方式） |
| `npm test` | 上游 TypeScript 测试（Quartz 自带，非本站测试） |

---

## 7. 相关文档

- [DEPLOYMENT.md](./DEPLOYMENT.md)：部署、更新、回滚、故障排查
- [AGENTS.md](./AGENTS.md)：Agent / 协作者修改本站的规则
- [TEST-REPORT.md](./TEST-REPORT.md)：测试证据、已知问题、后续计划
- Quartz 官方文档：<https://quartz.jzhao.xyz/>（仓库内副本见 `docs/`）
