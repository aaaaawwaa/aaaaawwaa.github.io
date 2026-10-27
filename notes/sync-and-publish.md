# Obsidian 单向同步与 GitHub Pages

## 范围和安全边界

`content/` 是对外发布内容。原 Vault 只读，网页公开后任何人均可访问。`public-notes.json` 是候选清单，逐项指定来源与小写英文目标；不列出的附件不会被同步。当前清单仅为 10 篇学习笔记的试运行，并没有代表整个 Vault 已发布。

本工具不会删除旧文件，阻止覆盖非工具生成或被人工修改的文件。工具跟踪信息保存在 `.quartz/sync-public-state.json`，不要提交或手动编辑。扫描只检测常见凭据与标记，不能识别所有私人信息；发布前还必须人工审阅笔记、图片和构建产物。

## 本地操作

在项目根目录执行：

```powershell
npm run sync:preview
```

检查输出中的 `unresolved`、`secretFindings` 和 `conflicts`。有未解析的关联笔记或图片时，将审阅通过的文件及英文目标逐项加入 `public-notes.json` 的 `files` 或 `assets`；本工具不会猜测或自动发布这些文件。附件只接受明确列出的图片和不含活动内容的 SVG；HTML、PDF 等需要另外审阅与处理。

预演无问题且内容已经审阅时：

```powershell
npm run sync:apply
npm run test:public
npm run verify
```

`sync:apply` 会阻止所有未解析引用、密钥样本或覆盖冲突，并只写入 `content/vault-notes/`。`npm run verify` 先检查 `content/`，再执行 Quartz 构建和站内链接检查。若状态文件丢失，已有文件默认视为冲突；请先备份并人工核对，不要直接覆盖。

## GitHub Pages 根路径

Quartz 当前搜索使用根路径。本项目的用户站点地址是 `https://aaaaawwaa.github.io/`；GitHub 仓库 `aaaaawwaa.github.io` 是公开的，包含站点源代码及其历史，GitHub Actions 构建并发布 `public/`。Obsidian 私有仓库仍独立；不要将未经审阅的笔记或其他私有文件提交到公开的站点仓库。配置 `baseUrl` 时不带 `https://` 和尾斜杠。

仓库 **Settings → Pages** 已设置为 GitHub Actions 发布源。推送到 `main` 后由 `.github/workflows/deploy.yml` 构建，等待部署工作流完成。验证首页、任意文章、搜索、图谱、公式、RSS 和 sitemap；页面真正可访问后才视为部署成功。

本机 `npm run verify` 的通过不代表 GitHub Pages 已上线，外部图谱及数学资源仍依赖相应 CDN。现有站点源 `upstream` 指向 Quartz 上游，不能将本项目推送到该远程。
