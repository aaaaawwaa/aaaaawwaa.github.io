# 宽平稳与非平稳对比实验（stationarity lab）

> 依据：`2026-11-04-review/next-steps-plan.md` 第二阶段。目标是用同一时间轴对比「宽平稳」与「非平稳」，并强调均值/方差恒定不足以证明 WSS。

## 模型与约定

- 时间轴：$n=0..N$，默认 $N=80$，可调 10–200；横轴为样本序号，不绑定物理采样率。
- 随机相位正弦：$x_m[n]=A\cos(2\pi f_0 n/N+\theta_m)$，$\theta_m\sim U[0,2\pi)$，$f_0=1.5$ 周期/窗口；理论 $E=0$、$\mathrm{Var}=A^2/2$，与 $n$ 无关。
- 零均值随机游走：$w_m[n]=\sum_{k=1}^{n}\varepsilon_m[k]$，$\varepsilon\sim N(0,\sigma^2)$ i.i.d.，$w_m[0]=0$；理论 $E=0$、$\mathrm{Var}=n\sigma^2$。
- 估计量：集合均值 $\frac1M\sum_m$，集合方差分母 $M-1$；$M=1$ 时方差无定义（界面显示 —）。
- 可复现：两个模型都由 seed 确定性生成；正弦相位与游走增量分别抽样，长序列是短序列前缀（改 $M$ 不换已有样本）；「重新采样」只把 seed 加一。

## 文件

| 文件 | 职责 |
| --- | --- |
| `quartz/static/lab/stationarity/stationarity-math.mjs` | 纯函数：采样、两点模型、集合统计、理论矩、参数校验 |
| `quartz/static/lab/stationarity/stationarity-lab.mjs` | Canvas 绘制、控件语义、主题、BFCache 生命周期 |
| `quartz/static/lab/stationarity/index.html` | 独立页面 `/static/lab/stationarity/` |
| `content/interactive-labs/stationarity-lab.md` | 实验页（模型、控件、观察任务、教学结论） |
| `scripts/stationarity-lab.test.mjs` | 7 项数学/采样测试 |

## 测试与边界

- 语义测试：同种子复现与前缀稳定；游走从 0 开始、按增量累加；$\mathrm{Var}(w[n])\approx n\sigma^2$；正弦矩不随 $n$ 变；$M-1$ 方差；$M=1$ 为 null。
- 退化边界：$A=0$、$\sigma=0$、$n=0$ 的理论方差为 0；非法参数抛 `RangeError`；`MAX_PATHS=500` 仅放宽纯函数（UI 滑块 1–40），统计测试用 400 条路径。
- 有限样本：$M$ 小（默认 8）时游走方差估计的抽样波动很大，这是预期现象；界面在 $n=N$ 处同时给出有限值与理论值。
- 未覆盖：真实浏览器是否命中 BFCache 未确认（生命周期用事件序列测试）；页面 iframe 的固定高度沿用 `.lt-lab-frame`，手机端内容较短时会有留白。

## 维护

1. 改模型或估计量：同步 `stationarity-math.mjs`、测试、实验页公式与控件说明；`npm run test:public` 必须重新通过。
2. 新实验沿用同一结构：`quartz/static/lab/<name>/{index.html,*-math.mjs,*-lab.mjs}` + `content/interactive-labs/<name>.md` + 实验索引条目 + 数学测试。
3. 不在实验页请求私有 Vault 数据；不引入第三方图表库。

## 回退

删除 `quartz/static/lab/stationarity/`、`content/interactive-labs/stationarity-lab.md`、`scripts/stationarity-lab.test.mjs`，并移除实验索引、随机过程 §11 链接与 `package.json` 中该测试。
