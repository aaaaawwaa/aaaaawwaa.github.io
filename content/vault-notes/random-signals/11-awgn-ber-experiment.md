---
title: "AWGN信道误码率实验"
tags:
- 随机信号处理
- 11-MATLAB实验
- AWGN
- 误码率
- BPSK
- 蒙特卡洛
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

# 📡 AWGN信道误码率实验

> [!abstract] 这个实验做什么
> 在 AWGN 信道下仿真 BPSK 的误码率，用蒙特卡洛统计错误比特数，并与理论 $P_b=Q(\sqrt{2E_b/N_0})$ 对比。
> 扫描 $E_b/N_0=0\sim10$ dB，预期结论是仿真点与理论曲线重合；高 SNR 端受错误数限制，$10^6$ 比特在 10 dB 只剩约 4 个错误，统计起伏很大。

## 一、实验目的

- 掌握 BPSK 的蒙特卡洛误码率仿真流程：产生比特、映射、加噪、判决、统计。
- 正确设置噪声方差，理解 $E_b/N_0$、$N_0/2$ 与匹配滤波后 SNR 的关系。
- 用 `erfc` 计算理论 BER，并与 `berawgn` 的结果对照。
- 理解仿真精度与错误数的关系，学会判断“曲线没对上”是理论错还是样本不够。

## 二、原理与公式

BPSK 把比特映射为 $s_0=+1$、$s_1=-1$，每个符号能量 $E_b=1$。AWGN 下接收信号为 $r=s+n$，$n\sim N(0,N_0/2)$。最佳判决门限为 0，误码率为

$$P_b=Q\left(\sqrt{\frac{2E_b}{N_0}}\right)=\frac{1}{2}\mathrm{erfc}\left(\sqrt{\frac{E_b}{N_0}}\right)$$

其中高斯尾概率定义为

$$Q(x)=\frac{1}{\sqrt{2\pi}}\int_x^{\infty}e^{-t^2/2}\,\mathrm{d}t$$

仿真时 $E_b=1$，因此噪声标准差为

$$\sigma=\sqrt{\frac{N_0}{2}}=\frac{1}{\sqrt{2E_b/N_0}}$$

若误码数为 $N_e$、总比特数为 $N$，则 $\hat P_b=N_e/N$，其相对标准差约为 $1/\sqrt{N_e}$。想分辨 $10^{-6}$ 的 BER，至少需要约 100 个错误，即 $N\gtrsim10^8$；本实验用 $10^6$ 比特，可靠下限约 $10^{-5}$。

| $E_b/N_0$ (dB) | 理论 BER | 仿真 BER（$10^6$ 比特） | 误码数（约） |
| --- | --- | --- | --- |
| 0 | $7.86\times10^{-2}$ | $\approx7.9\times10^{-2}$ | 78600 |
| 2 | $3.75\times10^{-2}$ | $\approx3.8\times10^{-2}$ | 37500 |
| 4 | $1.25\times10^{-2}$ | $\approx1.25\times10^{-2}$ | 12500 |
| 6 | $2.39\times10^{-3}$ | $\approx2.4\times10^{-3}$ | 2400 |
| 8 | $1.91\times10^{-4}$ | $\approx1.9\times10^{-4}$ | 190 |
| 10 | $3.87\times10^{-6}$ | $\approx4\times10^{-6}$ | 约 4 |

## 三、MATLAB 代码

```matlab
clear; close all; clc;
rng(101, 'twister');

EbN0_dB = 0:1:10;
Nbits = 1e6;
ber_sim = zeros(size(EbN0_dB));

for k = 1:numel(EbN0_dB)
    EbN0 = 10^(EbN0_dB(k)/10);
    bits = randi([0 1], Nbits, 1);
    tx = 1 - 2*bits;                  % 0->+1, 1->-1, Eb=1
    sigma = sqrt(1/(2*EbN0));         % N0/2 = 1/(2 Eb/N0)
    rx = tx + sigma*randn(Nbits,1);
    ber_sim(k) = mean((rx < 0) ~= bits);
end

ber_theory = 0.5*erfc(sqrt(10.^(EbN0_dB/10)));   % Q(sqrt(2Eb/N0))

figure;
semilogy(EbN0_dB, ber_theory, 'k-', 'LineWidth', 1.5); hold on;
semilogy(EbN0_dB, ber_sim, 'bo');
xlabel('E_b/N_0 / dB'); ylabel('BER'); grid on;
legend('理论 BER', '蒙特卡洛');
title('BPSK 在 AWGN 信道下的误码率');

T = table(EbN0_dB.', ber_theory.', ber_sim.', ...
          'VariableNames', {'EbN0_dB','BER_theory','BER_sim'});
disp(T);
```

> [!note] 工具箱
> 本实验只用基础 MATLAB。`berawgn`（理论曲线）和 `bertool`（GUI）属于 Communications Toolbox，可用它们核对，但不是必需；`berawgn` 对 PSK 的输入就是 $E_b/N_0$，不要误传 SNR。

## 四、结果与理论对照

在 0–8 dB 范围，蓝色仿真点与黑色理论曲线几乎重合；6 dB 处理论为 $2.39\times10^{-3}$，$10^6$ 比特约 2400 个错误，相对标准差约 2%。到 10 dB，理论 BER 为 $3.87\times10^{-6}$，期望错误数只有约 4 个，单次仿真可能得到 0–10 个错误，点会明显上下跳动，甚至因 0 个错误而在 `semilogy` 中消失。

曲线在高 SNR 端近似直线下降，这是因为 $Q(x)\approx e^{-x^2/2}/(x\sqrt{2\pi})$，BER 在半对数坐标上随 $E_b/N_0$ 加速下降。理想相干、Gray 映射的 QPSK 在相同 $E_b/N_0$ 下与 BPSK 有相同 BER（每个符号 2 bit，$E_s=2E_b$）；16-QAM 在相同 $E_b/N_0$ 下要高约 4 dB 才能达到同样 BER，可作为扩展。

## 五、思考题与易错点

- 区分 $E_b/N_0$、$E_s/N_0$ 与 SNR：BPSK 有 $E_s=E_b$；QPSK 有 $E_s=2E_b$，直接用 $E_s/N_0$ 代公式会差 3 dB。
- 噪声方差是 $N_0/2=1/(2E_b/N_0)$（$E_b=1$ 时），不是 $1/(E_b/N_0)$，后者相当于 SNR 差 3 dB。
- BER 是概率，不是单次实验的确定值；$10^6$ 比特在 10 dB 只有约 4 个错误，置信区间很宽，不能据此判断理论有误。
- 判决门限与映射要一致；本实验用 `1-2*bits`，若改成 `2*bits-1`，判决式也要相应取反。
- 画 BER 用 `semilogy`；出现 0 错误时对 0 取对数会丢点，应增大 $N$、用 `NaN` 跳过，或改用置信区间。
- 若要验证 QPSK，记得每个符号生成 2 bit 并做 I/Q 两路独立加噪，不能只把 BPSK 的比特率翻倍。

## 关联

- **上一节**：[[vault-notes/random-signals/11-wiener-filtering-experiment]] ｜ **下一节**：[[vault-notes/random-signals/99-formula-cheatsheet]]（99 首篇）
- 导航：[[vault-notes/random-signals/00-knowledge-map]]、[[vault-notes/random-signals/00-math-symbols]]
- 通信理论：[[vault-notes/communication/04-channel]]、[[vault-notes/communication/09-optimal-reception]]、[[vault-notes/communication/07-digital-bandpass]]
- 随机过程：[[vault-notes/communication/03-random-processes]]
