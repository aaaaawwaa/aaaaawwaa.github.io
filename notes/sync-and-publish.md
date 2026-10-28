# Obsidian 单向同步与 GitHub Pages 发布

本文件记录 `content/vault-notes/` 的发布流程、当前范围与注意事项。

## 当前发布状态（2026-10-27）

| 项 | 值 |
| --- | --- |
| 已发布笔记 | **195 篇**（`content/vault-notes/`） |
| 已发布附件 | **60 个**（34 PNG + 26 SVG，全部被选中笔记显式引用） |
| 站点页面总数 | 685 个 HTML（含标签页、文件夹页、OG 卡片） |
| 线上地址 | <https://aaaaawwaa.github.io/> |
| 清单文件 | `public-notes.json`（version 1，`unresolvedPolicy: "text"`） |
| 同步状态文件 | `.quartz/sync-public-state.json`（本地、已 gitignore，不要提交） |

### 学科覆盖

| 学科 | 篇数 | 目标目录 |
| --- | --- | --- |
| 通信原理 | 16 | `vault-notes/communication/` |
| 数字信号处理 | 8 | `vault-notes/dsp/` |
| 随机信号处理 | 61 | `vault-notes/random-signals/` |
| 数字调制 | 1 | `vault-notes/digital-modulation/` |
| 5G / 6G | 22 | `vault-notes/5g/` |
| FPGA / Verilog / 数字电路 | 45 | `vault-notes/fpga/` |
| 线性代数 | 12 | `vault-notes/math/linear-algebra/` |
| 概率论与数理统计 | 12 | `vault-notes/math/probability/` |
| 复变函数与场论 | 11 | `vault-notes/math/complex-analysis/` |
| MATLAB | 2 | `vault-notes/matlab/` |
| 知识地图 | 5 | `vault-notes/maps/` |

## 范围和安全边界

`content/` 是对外发布内容。原 Vault 只读，网页公开后任何人均可访问。`public-notes.json` 是白名单：逐项指定来源与小写英文目标；**不在清单里的文件不会被同步**。本工具不会删除旧文件，也会阻止覆盖非工具生成或已被人工修改的文件。

扫描只检测常见凭据与标记，不能识别所有私人信息；发布前仍必须人工审阅笔记、图片和构建产物。

### 明确排除（不进清单）

- 私人内容：个人日记、学习计划、项目进度、AI 学习方法目录、`.obsidian`/`.ai-workspace`/Agent 配置；
- 第三方或考试材料：`5G/大唐杯真题练习/`（3 篇）、`5G/物理元件配置/题目总结.md`、`5G/面试与复习/刷题知识点汇总.md`；
- 作业截图索引：`随机信号处理/作业/作业截图.md`（含 7 张作业截图）；
- 大文件与不可控格式：`.mp4`（198 个）、PDF、`.tex`、`.json5`、`.canvas`、独立 HTML 演示（需要另行审阅后按静态实验约定发布）；
- 含第三方画面的截图：`Assets/Attachments/屏幕截图 2026-10-19 202238.png`（B 站视频截图）。

### 未解析链接的处理（`unresolvedPolicy`）

同步工具支持两种策略：

- `error`（默认）：存在任何未解析引用即阻止写入；
- `text`（本项目采用）：把指向**未发布目标**的链接转换为可读文字，并在预演输出的 `converted` 数组中逐条记录，然后允许写入。

本次预演共有 93 条引用被转换（30 个不同目标），主要包括：全库总纲/首页等内部导航、被排除的作业与考试材料、`canvas`/HTML 演示、Vault 中已失效的链接（如 `[[向量]]`）、以及缺失的图片文件。转换只发生在站点副本中，**原始 Vault 不变**。

## 本地操作

在项目根目录执行：

```powershell
npm run sync:preview   # 只读预演：检查 unresolved / converted / secretFindings / conflicts
npm run sync:apply     # 写入 content/vault-notes/（默认阻止密钥与覆盖冲突）
npm run test:public    # 同步器与扫描器的单元测试
npm run verify         # 内容扫描 + 源码级链接检查 + Quartz 构建 + 产物自检
```

新增一篇笔记的标准流程：

1. 在 Vault 中正常写作（不要让工具写入 Vault）；
2. 在 `public-notes.json` 的 `files` 中增加 `{"source": "<Vault 相对路径>", "destination": "vault-notes/<学科>/<小写英文短横线>.md"}`；
3. 若笔记引用了新的图片，在 `assets` 中增加对应条目（只允许 png/jpg/gif/webp/svg，目的路径须在 `vault-notes/assets/` 下）；
4. `npm run sync:preview` 检查输出，确认没有意外的 `converted` 或 `secretFindings`；
5. `npm run sync:apply` → `npm run folders:build`（新目录需同步补 `folder-titles.json`）→ `npm run verify`；
6. 提交并推送，等待 GitHub Actions 部署完成后在线抽查。

> 附件命名建议沿用 `vault-notes/assets/<笔记 slug>/fig-NN.<ext>`，与现有 60 个附件一致。

## 同步器实现要点

- 只处理清单内文件；对 `[[wikilink]]`、`![[embed]]`、`![](path)` 统一改写为站点内小写路径；
- 双链按「完整路径 → 相对路径 → 唯一 basename」三级匹配，重名时要求写全路径；
- 非嵌入的 `[[file.svg]]` 会改写为指向附件的链接；
- 保持原始 frontmatter，缺失 `title` 时用去掉编号前缀的中文文件名补全；
- 写入前校验路径（禁止绝对路径、`..`、隐藏目录、符号链接）与目标冲突；
- SVG 若包含脚本、事件属性、`foreignObject`、外部引用则拒绝发布。

## GitHub Pages 部署

仓库 `aaaaawwaa.github.io` 是用户站，站点部署在根路径 `https://aaaaawwaa.github.io/`；Settings → Pages 的发布源已设为 GitHub Actions。推送到 `main` 后由 `.github/workflows/deploy.yml` 依次执行：内容安全扫描 → 发布防护测试 → 源码级链接检查 → 安装插件 → 构建 → 产物自检 → 上传并部署。

注意：

- 首页与搜索依赖根路径部署（Quartz 5 的搜索索引地址是根绝对路径），不要改成项目子路径；
- 本机 `npm run verify` 通过 **不代表** 线上已更新，必须等 Actions 成功并实际访问；
- 现有 `upstream` 指向 Quartz 上游，**不要**把本项目推送到 `upstream`。