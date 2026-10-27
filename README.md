# LumenTrace Wiki

> 面向电子信息工程学习的个人技术知识网站：以本地 Obsidian Markdown 为唯一内容源，通过白名单同步发布为静态站点。

- **站点框架**：[Quartz v5.0.0](https://quartz.jzhao.xyz/)（面向 Obsidian 的静态站点生成器）
- **内容格式**：Obsidian Flavored Markdown + LaTeX + Mermaid
- **代码托管**：GitHub　**网站托管**：Cloudflare Pages（备选 GitHub Pages）
- **线上地址**：<https://aaaaawwaa.github.io/>（GitHub Pages，HTTPS）
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
