# AGENTS.md · LumenTrace Wiki 修改规则

本文件面向在本仓库中工作的 AI Agent（以及未来的自己）。目标：**在不破坏上游兼容性、不泄露私有内容的前提下**可持续地演进站点。

---

## 0. 第一原则

1. **先读再改**：修改前先读 `README.md`、`quartz.config.yaml`、相关 `content/` 文章，确认现状。
2. **可验证才算完成**：任何改动后必须跑通 `npm run verify`（构建 + 自检），FAIL 一律不算完成。
3. **不伪造结果**：没有实际执行过的部署、测试不能写进文档；不确定的结论标注"未验证"。
4. **保护原始笔记**：本仓库的 `content/` 是**公开副本**。原始 Obsidian Vault 在别处，禁止删除、覆盖、
   批量重写 Vault 中的笔记。

---

## 1. 允许修改 / 禁止修改

| 区域 | 允许 | 说明 |
| --- | --- | --- |
| `content/` | ✅ | 站点内容，唯一的公开内容来源 |
| `quartz.config.yaml` | ✅ | 站点配置：标题、主题、插件、布局 |
| `quartz/styles/custom.scss` | ✅ | **本站所有视觉定制都写在这里** |
| `quartz/static/` | ✅ | 站点级静态资源（交互实验页、图标、自托管脚本） |
| `scripts/` | ✅ | 自动化脚本 |
| 根目录文档 | ✅ | README / DEPLOYMENT / AGENTS / TEST-REPORT |
| `quartz/` 中的上游代码 | ⚠️ 谨慎 | Quartz 核心与内置组件，改前必须说明理由；优先用配置/样式/插件解决 |
| `.quartz/`、`public/` | 🚫 | 构建产物（已在 .gitignore），不要提交 |
| `node_modules/` | 🚫 | 依赖目录 |
| `_scratch/` | 🚫 | 本地临时目录（已 gitignore），不放正式内容 |

升级 Quartz 时用官方方式：`npx quartz upgrade`（会保留内容与配置）。

---

## 2. 插件管理规则

1. **config 中插件的 `source` 必须是 `github:quartz-community/<name>` 形式**
   （或 `git+https://`、`https://`、本地路径）。
   **不要写 npm 包名 `@quartz-community/<name>`**：解析器会把它当成
   `https://github.com/@quartz-community/<name>.git`，换机器/CI 首次安装必然失败。
   （详细源码依据见 `notes/quartz5-capabilities.md` §0.5）
2. 新增插件：`npx quartz plugin add github:quartz-community/<name>`，
   并在 `quartz.config.yaml` 配置 `layout`（位置 + 优先级）。
3. 移除插件：先从 config 删除条目，再 `npx quartz plugin prune`（会同步 `quartz.lock.json`）。
4. **插件顺序**：Mermaid 由 `obsidian-flavored-markdown` 提供，其 `order` 必须大于
   `syntax-highlighting`（当前 20 → 30，正确）。
5. 受限网络下安装插件用 `npm run plugins:offline`；该脚本只从 config 里存在的
   `github:quartz-community/*` 拉取，新增插件后重跑即可增量补齐。
6. 不要手动编辑 `.quartz/plugins/` 里的任何文件（构建产物，会被覆盖）。
7. 不要修改 `quartz.lock.json` 中的 commit，除非确实要升级插件（升级后必须 `npm run verify`）。

---

## 3. 内容规则

### 3.1 命名（强制）

- 目录名与文件名：**小写英文 + 短横线**，例：`signal-processing/dft-and-fft.md`
- 违反会导致线上全站 404（Quartz 5 链接转小写、输出保留原大小写，见 README 3.1）
- 页面显示用中文 `title`，URL 用英文 slug

### 3.2 Frontmatter

```yaml
---
title: 中文标题
description: 一句话摘要（用于搜索摘要与 OG 卡片）
tags:
  - 分类标签
  - 主题标签
---
```

tags 用小写英文短横线；不要新增未使用的 tag。

### 3.3 链接

- 双链：`[[dft-and-fft|DFT 与 FFT]]`；跨目录写全路径：`[[signal-processing/index|信号处理]]`
- 不要链接不存在的文件；`npm run audit` 会暴露断链
- 同一 Vault 中重名文件会让 `shortest` 解析退化，**全站文件名保持唯一**

### 3.4 富内容

| 类型 | 写法 | 注意 |
| --- | --- | --- |
| 公式 | 行内 `$...$`；块级 `$$ ... $$` | 块级 `$$` **必须独占一行** |
| Mermaid | ```mermaid 围栏 | 需要浏览器能访问 cdnjs |
| 代码 | ```python / matlab / verilog / c | 语言标注用于高亮 |
| Callout | `> [!note]` / `[!tip]` / `[!warning]` | Obsidian 原生语法 |
| 图片/附件 | 放入 `content/<分类>/assets/` 后 `![](./assets/xxx.png)` | 附件**必须**白名单挑选（见第 4 节） |
| WaveDrom 时序图 | **不支持原生渲染** | 预渲染成 SVG 后当图片插入（与 Vault 约定一致） |
| 交互 HTML 实验 | `quartz/static/lab/<name>/index.html` → `/static/lab/<name>/` | 用 iframe 或普通链接嵌入，加 `sandbox` |

### 3.5 中文与数字排版

中文与英文/数字之间留空格；术语首次出现给出英文原词。

---

## 4. 内容安全（红线）

1. `content/` 中不得出现：私人日记、密钥/令牌/Cookie、账号密码、未公开项目、他人隐私信息。
2. **`ignorePatterns` 只过滤 Markdown，不过滤附件**。图片/PDF/录音一旦放进 `content/` 就会公开。
3. **GitHub 私有仓库不等于内容受保护**：站点是公开的，构建产物可被任何人下载。
4. 发布前检查（在仓库根目录执行）：

```bash
# 4.1 可疑文件名
git ls-files | Select-String -Pattern 'private|_drafts|secret|token|.env|id_rsa|password'
# 4.2 内容中的密钥指纹（示例）
git grep -n -I -E '(api[_-]?key|secret|token|passwd|password)\s*[:=]\s*[A-Za-z0-9/+=]{16,}'
# 4.3 确认 content/ 下没有白名单外的目录
Get-ChildItem content
```

5. 同步原则：**单向 Obsidian → Wiki**。不要在网站上直接改内容再回灌 Vault。
6. 不得为了"省事"把整个 Vault 复制进 `content/`。

---

## 5. 构建与测试

| 命令 | 用途 | 通过标准 |
| --- | --- | --- |
| `npm run dev` | 本地预览 | http://localhost:8080 可访问 |
| `npm run build:site` | 生产构建 | 输出 "Emitted N files to public" |
| `npm run audit` | 产物自检 | 全部 `[PASS]`、断链 0 |
| `npm run verify` | 构建 + 自检 | 0 FAIL |
| `npm run plugins:install` / `plugins:offline` | 插件安装 | 生成 `.quartz/plugins/index.ts` |

自检覆盖：页面数量、站内断链、内容索引（搜索/图谱）、Mermaid、KaTeX、代码块、RSS、sitemap。

**视觉改动的额外验证**：用无头浏览器截图检查桌面（1440px）与移动（390px）宽度，
确认无横向滚动、明暗主题都正常。示例：

```bash
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu ^
  --screenshot=shot.png --window-size=1440,1000 http://localhost:8080/
```

---

## 6. 部署规则

1. 涉及**远程仓库创建、公开仓库推送、平台授权、域名解析**时必须先征求站点所有者确认。
2. 不得在文档中声称未实际执行的部署已完成。
3. 部署后验证清单见 `DEPLOYMENT.md` 第 5 节。
4. 每次改动保持可回滚：内容与配置分开提交，提交信息说明"改了什么/为什么"。

---

## 7. 提交规范

```text
content: 新增 QPSK 误码率推导
config: 启用 tag-list 插件
style: 调整移动端标题字号
fix: 修正 dft-and-fft 中的链接
docs: 补充部署回滚步骤
chore: 升级 Quartz 到 vX.Y.Z
```

提交前：`npm run verify` 通过；不要提交 `public/`、`.quartz/`、`node_modules/`、`_scratch/`。

---

## 8. 常见错误与正确做法

| 错误做法 | 正确做法 |
| --- | --- |
| 在 `quartz.config.yaml` 写 `@quartz-community/explorer` | 写 `github:quartz-community/explorer` |
| 内容文件用 `Signals-and-Systems.md` | 用 `signals-and-systems.md` |
| 直接改 `quartz/` 里的组件做样式 | 优先写 `quartz/styles/custom.scss` |
| 把整个 Vault 复制进 `content/` | 白名单挑目录 + 附件 |
| 把 `public/` 提交进仓库 | 保持 gitignore，部署平台构建 |
| 声称"部署完成"但没有构建日志/访问地址 | 提供实际 URL 与验证证据 |
