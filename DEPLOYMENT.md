# DEPLOYMENT.md · LumenTrace Wiki 部署与运维手册

> 目标：把 `content/` 的 Markdown 构建成静态站点并通过 HTTPS 对外访问。
> 站点是**纯静态**产物（`public/`），不需要服务器、数据库或后端运行时。

---

## 0. 前置条件

| 项目 | 要求 | 当前环境 |
| --- | --- | --- |
| Node.js | ≥ 22（`.node-version` = v22.16.0） | v24.14.1 ✅ |
| npm | ≥ 10.9.2 | 11.16.0 ✅ |
| Git | 任意较新版本 | 2.54.0 ✅ |
| 网络 | 能访问 GitHub 与 npm（CI 环境均可） | 本地受限，已提供离线方案 ✅ |

本地验证三连（每次部署前必做）：

```bash
npm install
npm run plugins:install    # 或 npm run plugins:offline
npm run verify             # 构建 + 自检，必须 0 FAIL
```

---

## 1. 部署平台选型

| 方案 | 免费额度 | 构建时长限制 | 子路径? | 推荐度 |
| --- | --- | --- | --- | --- |
| **Cloudflare Pages** | 500 次构建/月、无限带宽 | **20 分钟** | 根路径 ✅ | ⭐ 首选 |
| GitHub Pages（Actions） | 2000 分钟/月（私有仓） | 6 小时 | 项目站是子路径 ⚠️ | 备选 |
| 本地构建 + `wrangler pages deploy` | 同上 | 不限（本地） | 根路径 ✅ | 构建超时的备选 |

> ⚠️ **子路径部署会破坏搜索**：Quartz 5.0.0 的 search 插件把索引地址硬编码为
> `/static/contentIndex.json`、结果链接为 `"/" + slug`。部署在 `https://<user>.github.io/<repo>/`
> 这类子路径下时搜索不可用（构建期不会报错）。因此：
> **优先 Cloudflare Pages 根路径**；GitHub Pages 请绑定自定义域名或使用 `<user>.github.io` 用户站。

`baseUrl` 必须与最终访问地址一致（影响 RSS / sitemap / OG 卡片）：

```yaml
# quartz.config.yaml
configuration:
  baseUrl: lumentrace-wiki.pages.dev   # 不要带 https:// 与末尾斜杠
```

---

## 2. 方案 A：Cloudflare Pages（推荐）

### 2.1 一次性准备

1. 在 GitHub 新建**空仓库**（不要初始化 README / .gitignore）：
   建议命名 `LumenTrace-Wiki`，可见性按需选择（公开或私有均可；
   注意：**仓库私有 ≠ 内容受保护**，站点内容是公开的，见 README 第 5 节）。
2. 本地接入远端：

```bash
git remote -v                       # 应只有 upstream（指向 jackyzha0/quartz）
git remote add origin https://github.com/<你的用户名>/LumenTrace-Wiki.git
git push -u origin main
```

3. 打开 Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**，
   选择该仓库。

### 2.2 构建配置（照抄）

| 配置项 | 值 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm ci && npx quartz plugin install && npx quartz build` |
| Build output directory | `public` |
| 环境变量 | `NODE_VERSION=22`（也可由仓库内 `.node-version` 自动识别） |

保存后 Cloudflare 会自动构建并给出 `https://<project>.pages.dev` 地址。

### 2.3 ⚠️ 构建时长风险（务必先验证一次）

`npx quartz plugin install` 需要克隆 **42 个插件仓库**并逐个 `npm install && npm run build`。
在 CI 上预计 8–18 分钟，而 Cloudflare Pages 免费版**单次构建上限 20 分钟**。
首次部署后请检查构建日志耗时：

- **< 15 分钟**：方案 A 长期可用。
- **频繁超时或接近上限**：改用下面任一方式
  - 删掉 `quartz.config.yaml` 中真正用不到的插件条目（然后本地 `npx quartz plugin prune` 更新 lockfile）；
  - 改用方案 B（本地构建 + 直传，构建时间 ≈ 30 秒）。

### 2.4 缓存优化（可选）

在 Cloudflare Pages 设置 → Build → Build cache 不适用于本方案；
真正有效的是减少插件数量或改用方案 B。

---

## 3. 方案 B：本地构建 + Wrangler 直传

适合：CI 构建超时、或希望"本地确认无误才发布"。

```bash
# 1) 本地构建
npm run verify

# 2) 安装 Wrangler（一次性）
npm i -g wrangler
wrangler login                      # 浏览器授权 Cloudflare 账号

# 3) 直传（首次会创建项目）
wrangler pages deploy public --project-name lumentrace-wiki
```

优点：构建只用本机 30 秒，产物经过 `npm run audit` 校验后才上传；缺点：需要在本机保存 Cloudflare 授权。

> 此方式涉及 Cloudflare 账号授权，**执行前需要站点所有者确认**。

---

## 4. 方案 C：GitHub Pages

在仓库中新建 `.github/workflows/deploy.yml`（内容见下），并在仓库 Settings → Pages → Source 选择
**GitHub Actions**。

```yaml
name: Deploy Quartz site to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0          # 让 created-modified-date 能读到 git 时间
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx quartz plugin install
      - run: npx quartz build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

要点：

- GitHub Actions 单任务上限 6 小时，插件构建不构成瓶颈（比 Cloudflare 更宽松）。
- 若使用**项目站**（`https://<user>.github.io/<repo>/`）：`baseUrl` 要写成
  `<user>.github.io/<repo>`，并且**搜索会失效**（见第 1 节说明）。
- 建议绑定自定义域名后使用（根路径），或直接把 GitHub Pages 作为备灾方案。

---

## 5. 首次上线检查清单

- [ ] `npm run verify` 本地通过（0 FAIL、0 断链）
- [ ] `quartz.config.yaml` 的 `baseUrl` 已改为真实域名
- [ ] 仓库中**没有任何** `private/`、`_drafts/`、密钥、账号信息（见 AGENTS.md 的安全检查命令）
- [ ] 构建日志中插件安装全部成功（`✓ Regenerated plugin index with 44 plugins` 之类）
- [ ] 访问首页、任一文章页、搜索、知识图谱、暗色模式
- [ ] 用手机（或 DevTools 移动视图）检查首页与文章页无横向滚动
- [ ] `/sitemap.xml`、`/index.xml`（RSS）可访问
- [ ] 确认站点可通过 HTTPS 访问

---

## 6. 日常更新流程

```bash
# 1) 在 Obsidian 里正常写笔记（原始 Vault 保持不变）
# 2) 把授权公开的笔记同步到 content/（Phase 3 起用 scripts/sync-public.mjs，
#    当前阶段：手工复制到对应分类目录，文件名小写 kebab-case）
# 3) 本地验证
npm run verify
# 4) 提交并推送（触发自动构建）
git add -A
git commit -m "content: 新增 XXX 笔记"
git push
```

> 建议：内容改动与配置/样式改动用不同 commit，便于单独回滚。

---

## 7. 回滚

| 场景 | 操作 |
| --- | --- |
| 只是内容写错 | `git revert <commit> && git push`，等 CI 重新构建 |
| 配置/样式改坏 | 同上；本地可先 `git checkout <good-commit> -- quartz.config.yaml quartz/styles/custom.scss` 验证 |
| 插件升级后异常 | `git checkout <good-commit> -- quartz.lock.json`，再 `npx quartz plugin restore` |
| Cloudflare 侧回滚 | Pages → 项目 → Deployments → 选中上一次成功部署 → **Rollback to this deployment** |
| 插件目录被污染 | `rm -rf .quartz` 后重新 `npm run plugins:install` 或 `npm run plugins:offline` |

---

## 8. 自定义域名

1. Cloudflare Pages → 项目 → **Custom domains** → Set up a domain。
2. 按提示在 DNS 服务商添加 `CNAME` 指向 `<project>.pages.dev`。
3. **同步修改 `quartz.config.yaml` 的 `baseUrl`**，否则 RSS / sitemap 内的绝对链接仍是旧域名。
4. 重新部署后访问 `/sitemap.xml` 检查域名是否已更新。

---

## 9. 故障排查

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 构建报 `Could not resolve "../../.quartz/plugins"` | 插件未安装（缺 `.quartz/plugins/index.ts`） | `npm run plugins:install` 或 `npm run plugins:offline` |
| 插件安装卡住 / TLS 报错 | 直连 GitHub 不稳定 | 用 `npm run plugins:offline`（本地）；CI 不受影响 |
| 页面在本地正常、线上 404 | 内容文件名含大写（Windows 不区分大小写） | 全部改为小写 kebab-case，见 README 3.1 |
| 搜索无结果 | 未部署在根路径（子路径部署） | 改用根路径 / 自定义域名 |
| 知识图谱空白 | `static/contentIndex.json` 未生成 | 确认 `content-index` 插件启用且构建日志无过滤错误 |
| Mermaid 图空白但无报错 | 浏览器加载不到 cdnjs 的 mermaid 运行时 | 换网络；或将 mermaid 运行时自托管到 `quartz/static/`（后续计划） |
| 公式样式错乱 | KaTeX CSS（jsdelivr）加载失败 | 同上，属外部 CDN 依赖 |
| 中文标题 OG 卡片缺字 | OG 图字体缺少 CJK 字形 | 当前实测正常；如换成纯拉丁字体主题需重测 |
| 构建很慢 | OG 图为每页生成社交卡片 | 关闭 `og-image` 插件或减少页面数 |

---

## 10. 外部运行时依赖（部署后仍会影响访问者）

| 能力 | 依赖 | 失败表现 |
| --- | --- | --- |
| Mermaid 图 | `cdnjs.cloudflare.com` 的 mermaid 11.4.0 | 图空白（无报错） |
| LaTeX 样式 | `cdn.jsdelivr.net` 的 katex css | 公式排版错乱 |
| 字体 | Google Fonts（`fontOrigin: googleFonts`） | 回退到系统字体（已在 custom.scss 配好中文字体栈） |

如需完全自包含（离线可用），后续可：`theme.fontOrigin: local` + 将 mermaid / katex 静态资源放入
`quartz/static/` 并覆盖插件注入的 CDN 地址（属 Phase 2 可选项，需改插件层，谨慎）。
