# LumenTrace Wiki

> 面向电子信息工程学习的个人技术知识网站：以本地 Obsidian Markdown 为唯一内容源，通过白名单同步发布为静态站点。

- **站点框架**：[Quartz v5.0.0](https://quartz.jzhao.xyz/)（面向 Obsidian 的静态站点生成器）
- **内容格式**：Obsidian Flavored Markdown + LaTeX + Mermaid
- **线上地址**：<https://aaaaawwaa.github.io/>（GitHub Pages + GitHub Actions，HTTPS）
- **已发布内容**：195 篇学习笔记 + 60 张图表（`content/vault-notes/`）
- **本地运行**：Node.js ≥ 22、npm ≥ 10.9.2

---

## 1. 目录结构

```text
LumenTrace-Wiki/
├── content/                      # 站点内容（唯一的公开内容来源）
│   ├── index.md                  # 首页：知识板块导航
│   ├── vault-notes/              # ★ 从 Obsidian 同步发布的学习笔记（195 篇，脚本生成勿手改）
│   │   ├── communication/        # 通信原理 16 篇
│   │   ├── dsp/                  # 数字信号处理 8 篇
│   │   ├── random-signals/       # 随机信号处理 61 篇
│   │   ├── digital-modulation/   # 数字调制 1 篇
│   │   ├── 5g/                   # 5G / 6G 22 篇
│   │   ├── fpga/                 # FPGA / Verilog / 时序分析 45 篇
│   │   ├── math/                 # 线性代数 12 · 概率论 12 · 复变 11
│   │   ├── matlab/               # MATLAB 2 篇
│   │   ├── maps/                 # 知识地图 5 篇
│   │   └── assets/               # 同步的 60 张图表（PNG + SVG）
│   ├── mathematics/ ...          # 站内示例分类（早期内容，保留）
│   └── maps/                     # 示例跨学科导航
├── quartz/                       # Quartz 核心（上游代码，尽量不改）
│   ├── static/                   # 站点级静态资源 → /static/**（含交互实验 lab/）
│   └── styles/custom.scss        # ★ 自定义样式（中文排版与视觉设计）
├── quartz.config.yaml            # ★ 站点配置（标题、主题、插件、布局）
├── quartz.lock.json              # 插件版本锁
├── public-notes.json             # ★ 发布白名单：Vault 笔记 → 站点路径映射
├── scripts/
│   ├── sync-public.mjs           # 单向同步器（预览 / 写入）
│   ├── check-public.mjs          # 公开内容扫描（凭据、草稿标记、文件类型）
│   ├── check-links-source.mjs    # 源码级、大小写敏感的链接检查
│   ├── audit-site.mjs            # 构建产物自检（断链 / 索引 / 富内容）
│   ├── provision-plugins.ts      # 受限网络下的离线插件安装
│   └── *.test.mjs                # 同步器、扫描器、交互实验的单元测试
├── notes/                        # 工程笔记（同步发布流程、Quartz 5 能力调研）
├── docs/                         # Quartz 官方文档（上游附带）
├── AGENTS.md                     # Agent / 协作者修改规则
├── DEPLOYMENT.md                 # 部署、更新、回滚
└── TEST-REPORT.md                # 测试报告、已知问题、后续计划
```

---

## 2. 快速开始

```bash
# 0. 环境自检（要求 Node >= 22）
node -v && npm -v

# 1. 安装依赖
npm install

# 2. 安装 Quartz 插件（首次需要，44 个社区插件）
npm run plugins:install
# 若网络无法稳定访问 GitHub，改用离线方案：
npm run plugins:offline

# 3. 本地预览 → http://localhost:8080
npm run dev

# 4. 生产构建 + 自检
npm run verify
```

---

## 3. 内容发布流程（Obsidian → 站点，单向）

1. 在本地 Vault 正常写作，**不要**让脚本修改 Vault；
2. 在 `public-notes.json` 的 `files` 中登记「Vault 相对路径 → 小写英文目标路径」，图片登记到 `assets`；
3. `npm run sync:preview`：只读预演，检查 `unresolved` / `converted` / `secretFindings` / `conflicts`；
4. `npm run sync:apply`：写入 `content/vault-notes/`；
5. `npm run verify`：内容扫描 + 源码级链接检查 + 构建 + 产物自检；
6. 提交并推送，等待 GitHub Actions 部署完成后在线抽查。

详细规则、排除范围与未解析链接策略见 [notes/sync-and-publish.md](./notes/sync-and-publish.md)。

> 站点路径统一小写英文短横线，页面标题保持中文；未收录的关联目标会转成可读文字并记录在预演输出中。

---

## 4. 站点配置与设计

主配置：`quartz.config.yaml`

| 配置项 | 当前值 | 说明 |
| --- | --- | --- |
| `pageTitle` | LumenTrace Wiki | 站点名 |
| `baseUrl` | `aaaaawwaa.github.io` | GitHub Pages 用户站根路径 |
| `locale` | `zh-CN` | UI 文案与日期中文化 |
| `enableSPA` / `enablePopovers` | `true` | 页面无刷新切换、链接悬浮预览 |
| `analytics` | `null` | 不引入第三方统计 |
| `defaultDateType` | `modified` | 文章日期来源 |
| `theme` | 松石绿 / 暖金配色 | 明暗两套色板 |

启用的核心能力：Obsidian 双向链接与 callout、KaTeX 公式（构建期渲染）、Mermaid（OFM 内置）、代码高亮、全文搜索（FlexSearch + contentIndex）、知识图谱、反向链接、目录树、文章目录、明暗主题、阅读模式、Canvas/Bases 页面、RSS/sitemap/OG 卡片。

视觉定制集中在 `quartz/styles/custom.scss`：只使用 Quartz 内置 CSS 变量与既有类名，不引入额外前端依赖。

---

## 5. 内容安全（红线）

1. `content/` 是**公开内容**：Vault 中的私人日记、学习计划、项目进度、账号信息、考试真题与第三方资料不得进入；
2. `ignorePatterns` 只过滤 Markdown，**不保护附件**——图片必须人工挑选后列入 `public-notes.json`；
3. GitHub 仓库公开即内容公开，历史提交同样可见；
4. 发布前必须执行 `npm run check:public`、`npm run verify`，并人工抽查可疑内容；
5. 单向同步：只允许 Vault → `content/`，不要在站点上改内容再回灌 Vault。

---

## 6. 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地预览（8080） |
| `npm run build:site` | 生产构建到 `public/` |
| `npm run verify` | 内容扫描 + 链接检查 + 构建 + 产物自检（提交前必跑） |
| `npm run sync:preview` / `sync:apply` | 同步预演 / 写入 |
| `npm run check:public` | 公开内容敏感项扫描 |
| `npm run audit` | 产物自检（断链、索引、Mermaid/KaTeX/代码块、RSS/sitemap） |
| `npm run test:public` | 同步器与扫描器单元测试 |
| `npm run plugins:install` / `plugins:offline` | 插件安装（在线 / 离线） |

---

## 7. 相关文档

- [DEPLOYMENT.md](./DEPLOYMENT.md)：部署、更新、回滚、故障排查
- [AGENTS.md](./AGENTS.md)：Agent / 协作者修改规则
- [TEST-REPORT.md](./TEST-REPORT.md)：测试证据、已知问题、后续计划
- [notes/sync-and-publish.md](./notes/sync-and-publish.md)：同步发布细则
- [notes/quartz5-capabilities.md](./notes/quartz5-capabilities.md)：Quartz 5 能力调研
- Quartz 官方文档：<https://quartz.jzhao.xyz/>
