---
title: "自相关估计实验"
tags:
- 随机信号处理
- 11-MATLAB实验
- 自相关估计
- AR1
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

# 📈 自相关估计实验

> [!abstract] 这个实验做什么
> 生成 AR(1) 过程 $X[n]=aX[n-1]+W[n]$，用 `xcorr` 的 biased/unbiased 两种归一化估计 $R_X[k]$，并与理论值 $\sigma_w^2a^{|k|}/(1-a^2)$ 对照。
> 重点观察估计偏差、方差以及均值去除的影响；预期结论是 unbiased 无偏但边缘方差大，biased 有 $(N-|k|)/N$ 的收缩但更稳定。

## 一、实验目的

- 掌握用 `xcorr` 估计自相关，理解 `biased`、`unbiased`、`coeff` 三种归一化的差别。
- 验证 AR(1) 的理论自相关 $R_X[k]=\sigma_w^2a^{|k|}/(1-a^2)$。
- 理解“先去掉均值再估计自相关”的必要性。

## 二、原理与公式

AR(1) 过程满足 $X[n]=aX[n-1]+W[n]$，$W[n]$ 为零均值白噪声，方差 $\sigma_w^2$。当 $|a|<1$ 时过程宽平稳，且

$$
R_X[k]=E[X[n+k]X[n]]=\frac{\sigma_w^2}{1-a^2}a^{|k|},\qquad R_X[0]=\frac{\sigma_w^2}{1-a^2}
$$

两种常用估计量为

$$
\hat R_X^{b}[k]=\frac{1}{N}\sum_{n=0}^{N-1-|k|}x[n+|k|]x[n]
$$

$$
\hat R_X^{u}[k]=\frac{1}{N-|k|}\sum_{n=0}^{N-1-|k|}x[n+|k|]x[n]
$$

对零均值过程，$E[\hat R_X^{b}[k]]=\frac{N-|k|}{N}R_X[k]$，而 $E[\hat R_X^{u}[k]]=R_X[k]$。biased 估计的偏差随 $|k|/N$ 增大；unbiased 在 $|k|\to N$ 时分母趋于零，方差会爆炸。三种归一化中，`biased` 除 $N$、`unbiased` 除 $N-|k|$、`coeff` 除 $\hat R_X[0]$。

若原始数据含均值 $\mu$，则 $\hat R_X[k]\to R_X[k]+\mu^2$，整条曲线被抬高 $\mu^2$；因此估计自相关前应先 `x - mean(x)`。

## 三、MATLAB 代码

```matlab
clear; close all; clc;
rng(7, 'twister');
a = 0.99; sigma_w = 1; N = 2000;
maxlag = 300; Nreal = 200;          % 200 次独立实现取平均
lags = (-maxlag:maxlag).';
Rb = zeros(size(lags)); Ru = Rb;
for r = 1:Nreal
    x = filter(1, [1 -a], sigma_w*randn(N,1));   % AR(1)
    x = x(501:end);                              % 丢掉初始瞬态
    cb = xcorr(x, maxlag, 'biased');
    cu = xcorr(x, maxlag, 'unbiased');
    Rb = Rb + cb(:); Ru = Ru + cu(:);
end
Rb = Rb/Nreal; Ru = Ru/Nreal;
R0 = sigma_w^2/(1-a^2);              % 理论方差
R_theory = R0*a.^abs(lags);

figure;
plot(lags, R_theory, 'k-', 'LineWidth', 2); hold on;
plot(lags, Rb, 'b-', lags, Ru, 'r--'); grid on;
xlabel('滞后 k（采样点）'); ylabel('R_X(k)');
legend('理论', 'biased 平均', 'unbiased 平均'); xlim([-maxlag maxlag]);
for k = [0 100 200 300]
    idx = maxlag + 1 + k;
    fprintf('k=%3d: 理论 %.3f, biased %.3f, unbiased %.3f\n', ...
            k, R0*a^k, Rb(idx), Ru(idx));
end
% 均值去除的影响
x = filter(1, [1 -a], sigma_w*randn(N,1)); x = x(501:end);
x_dc = x + 5;
R_raw = xcorr(x_dc, maxlag, 'biased');
R_ac  = xcorr(x_dc - mean(x_dc), maxlag, 'biased');
fprintf('R(0): 含直流 %.2f, 去均值 %.2f, 理论 %.2f\n', ...
        R_raw(maxlag+1), R_ac(maxlag+1), R0);
```

> [!note] 工具箱与参数
> `xcorr` 属于 Signal Processing Toolbox。取 $a=0.99$ 是为了让相关函数衰减慢，能在 $k=300$ 处仍清楚看到 biased/unbiased 的差别；实际信号很少有如此强的相关性。

## 四、结果与理论对照

图中黑线为理论 $R_X[k]=50.25\times0.99^{|k|}$。两条估计曲线在 $|k|<100$ 内与理论几乎重合；接近 $|k|=300$ 时，biased 曲线因乘了 $(1500-|k|)/1500$ 而略低；unbiased 的平均值仍对准理论，但其单次估计在边缘的抖动远大于 biased。

| $\tau/T_s$ | 理论 $R_X(\tau)$ | biased 期望 | unbiased 期望 | biased 仿真 | unbiased 仿真 |
| --- | --- | --- | --- | --- | --- |
| 0 | 50.25 | 50.25 | 50.25 | 50.2 | 50.2 |
| 100 | 18.35 | 17.13 | 18.35 | 17.1 | 18.3 |
| 200 | 6.70 | 5.81 | 6.70 | 5.8 | 6.7 |
| 300 | 2.45 | 1.96 | 2.45 | 2.0 | 2.5 |

均值去除的效果可以用 $R_X[k]+\mu^2$ 精确预测：

| 处理 | $E[\hat R(0)]$ | $E[\hat R(100)]$（近似） | 现象 |
| --- | --- | --- | --- |
| 含直流 $\mu=5$ | $50.25+25=75.25$ | $18.35+25=43.35$ | 全曲线被抬高 $\mu^2$ |
| 去均值 | 50.25 | 18.35 | 回到理论值 |

## 五、思考题与易错点

- `xcorr` 默认 `'none'`，不除 $N$；做功率谱或与理论 $R_X$ 比较时必须显式指定归一化。
- `coeff` 归一化除以 $\hat R_X[0]$，只改变幅度不改变形状；比较相关强弱时用 `coeff`，比较功率时用 `biased`。
- biased 的偏差在 $|k|\ll N$ 时约为 $|k|/N$，对 $N=1500$、$k=300$ 已达 20%，不能忽略。
- 若信号含直流，先 `x - mean(x)`；否则 $R_X(0)$ 会被抬高 $\mu^2$，看起来“功率变大”。

## 关联

- **上一节**：[[vault-notes/random-signals/11-gaussian-noise-distribution]] ｜ **下一节**：[[vault-notes/random-signals/11-psd-estimation-experiment]]
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 理论：[[vault-notes/communication/03-random-processes]]、[[vault-notes/dsp/01-discrete-time-systems]]
- 工具：[[vault-notes/matlab/matlab-notes]]
