---
title: "高斯噪声生成与分布验证"
tags:
- 随机信号处理
- 11-MATLAB实验
- 高斯噪声
- 分布检验
type: lab
subjects:
- 随机信号处理
- Matlab
domains:
- 实验与仿真
status: learning
aliases: []
prerequisites: []
related: []
---

# 🎲 高斯噪声生成与分布验证

> [!abstract] 这个实验做什么
> 用 `randn` 生成 $N$ 个高斯样本，检验样本均值、样本方差、直方图与 Q-Q 图是否收敛到理论分布 $N(\mu,\sigma^2)$。
> 理论对照是大数定律给出的标准误 $\sigma/\sqrt{N}$ 与 $\sigma/\sqrt{2N}$；预期结论是估计误差按 $1/\sqrt{N}$ 缩小，但分布尾部收敛最慢。

## 一、实验目的

- 学会用 `rng` 固定随机种子，使仿真结果可复现、可对比。
- 验证高斯样本的一、二阶矩，理解“估计量本身也是随机变量”。
- 用直方图对照 PDF、用 Q-Q 图检查尾部，区分“形状像”与“分布对”。

## 二、原理与公式

标准高斯变量 $Z\sim N(0,1)$ 的 PDF 为

$$
f_Z(z)=\frac{1}{\sqrt{2\pi}}e^{-z^2/2}
$$

对 $X=\mu+\sigma Z$，有 $X\sim N(\mu,\sigma^2)$，其 PDF 为

$$
f_X(x)=\frac{1}{\sqrt{2\pi}\sigma}\exp\left[-\frac{(x-\mu)^2}{2\sigma^2}\right]
$$

样本均值 $\bar X$ 与样本方差 $S^2$ 满足

$$
E[\bar X]=\mu,\qquad \mathrm{Var}(\bar X)=\frac{\sigma^2}{N},\qquad E[S^2]=\sigma^2,\qquad \mathrm{Var}(S^2)=\frac{2\sigma^4}{N-1}
$$

Q-Q 图把排序后的样本 $x_{(i)}$ 与理论分位数 $\mu+\sigma\Phi^{-1}\left(\frac{i-0.5}{N}\right)$ 对比：点落在 $y=x$ 附近说明分布一致，尾部系统性偏离说明偏度或厚尾。

| 统计量 | 理论值 | 标准误（理论） | $N=10^5$ 时的典型偏差 |
| --- | --- | --- | --- |
| 样本均值 | $\mu=2$ | $\sigma/\sqrt{N}=0.0095$ | $<0.02$ |
| 样本标准差 | $\sigma=3$ | $\sigma/\sqrt{2N}=0.0067$ | $<0.02$ |
| $P(\mu-\sigma<X\le\mu+\sigma)$ | $0.6827$ | $\sqrt{p(1-p)/N}=0.0015$ | $0.683\pm0.003$ |

## 三、MATLAB 代码

```matlab
clear; close all; clc;
rng(2024, 'twister');              % 固定种子，结果可复现

mu = 2; sigma = 3; N = 1e5;
x = mu + sigma*randn(N,1);         % X[n] ~ N(mu, sigma^2)

x_mean = mean(x); x_std = std(x);  % std 默认除以 N-1
fprintf('N=%d: mean=%.4f (理论 %.4f), std=%.4f (理论 %.4f)\n', ...
        N, x_mean, mu, x_std, sigma);

figure;
histogram(x, 80, 'Normalization', 'pdf'); hold on;
gridx = linspace(mu-4*sigma, mu+4*sigma, 400);
pdf_theory = exp(-(gridx-mu).^2/(2*sigma^2))/(sigma*sqrt(2*pi));
plot(gridx, pdf_theory, 'r-', 'LineWidth', 1.5); grid on;
xlabel('x'); ylabel('f_X(x)');
legend('仿真直方图', '理论 PDF'); title(sprintf('N = %d', N));

% Q-Q 图：用 erfinv 构造理论分位数，不依赖统计工具箱
p = ((1:N).' - 0.5)/N;
q_theory = mu + sigma*sqrt(2)*erfinv(2*p - 1);
q_sample = sort(x);
figure;
plot(q_theory, q_sample, '.', 'MarkerSize', 4); hold on; axis equal;
plot(mu + 5*sigma*[-1 1], mu + 5*sigma*[-1 1], 'r--'); grid on;
xlabel('理论分位数'); ylabel('样本分位数'); title('Q-Q 图');

% 样本数对估计的影响
N_list = [1e3 1e4 1e5 1e6];
for k = 1:numel(N_list)
    xk = mu + sigma*randn(N_list(k),1);
    fprintf('N=%7d: 均值误差=%+.4f, 标准差误差=%+.4f\n', ...
            N_list(k), mean(xk)-mu, std(xk)-sigma);
end
```

> [!note] 工具箱
> 上面只用到基础 MATLAB；`qqplot` 属于 Statistics and Machine Learning Toolbox，可用但不是必需。

## 四、结果与理论对照

固定种子后的一次运行中，样本均值与标准差通常落在理论值 $\pm2$ 个标准误内；直方图与红色 PDF 基本重合。Q-Q 图主体段贴近 $y=x$，两端各几十个点略有偏离，这是极端次序统计量方差大的正常现象，不代表样本非高斯。

| $N$ | 均值标准误 $\sigma/\sqrt{N}$ | 标准差标准误 $\approx\sigma/\sqrt{2N}$ | 直方图观感 |
| --- | --- | --- | --- |
| $10^3$ | 0.0949 | 0.0671 | 明显毛刺 |
| $10^4$ | 0.0300 | 0.0212 | 轮廓清楚 |
| $10^5$ | 0.0095 | 0.0067 | 较平滑 |
| $10^6$ | 0.0030 | 0.0021 | 尾部仍有个别离群点 |

标准误按 $1/\sqrt{N}$ 缩小：样本数增大 100 倍，误差只缩小 10 倍；若想把误差再减半，样本数要变为 4 倍。

## 五、思考题与易错点

- `std(x)` 默认除以 $N-1$，是**无偏**样本标准差；手写 `sqrt(mean((x-mean(x)).^2))` 除以 $N$，两者在大 $N$ 下接近，小 $N$ 时不要混用。
- `randn` 产生的是 $N(0,1)$，必须做 `mu + sigma*randn` 才是 $N(\mu,\sigma^2)$；只乘 `sigma` 会漏掉均值。
- 直方图纵轴要用 `'Normalization','pdf'` 才能与 PDF 同尺度；用计数轴对比会得到“高度不匹配”的假象。
- Q-Q 图两端点少、方差大，不能因个别尾部点偏离就判定“非高斯”；固定 `rng` 只保证可复现，不代表一次估计恰好等于理论值。

## 关联

- **上一节**：[[vault-notes/random-signals/10-receiver-detection]]（10 末篇） ｜ **下一节**：[[vault-notes/random-signals/11-autocorrelation-estimation-experiment]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 工具：[[vault-notes/matlab/matlab-notes]]
- 理论：[[vault-notes/communication/03-random-processes]]、00_全库理论知识点综合与联系
