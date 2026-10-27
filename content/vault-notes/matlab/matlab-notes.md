---
title: "Matlab"
created: 2026-09-23
date: 2026-09-23
author: Obsidian Note Bot
aliases:
- Matlab基础
- MATLAB语法速查
tags:
- MATLAB
- 仿真工具
- 信号处理
type: resource
subjects:
- Matlab
domains:
- 工具与仿真
status: learning
prerequisites: []
related: []
---


# 🔧 MATLAB 基础函数与语法

> [!abstract] 📌 使用说明
> 本笔记覆盖 MATLAB 日常仿真所需的**核心语法 + 高频函数**，并偏重通信/信号处理场景（信号生成、FFT、滤波、噪声）。
> 与 [[vault-notes/communication/a-formula-cheatsheet]] 配合使用：公式表中看到的 $R(\tau)$、$P(f)$、误码率等，都可以直接在 MATLAB 中数值验证。
> MATLAB 的核心思想：**一切皆矩阵**，标量是 $1\times1$ 矩阵，标量运算就是矩阵运算的特例。

---

## 1. 基础语法规则

| 语法 | 作用 | 示例 |
| --- | --- | --- |
| `;` 结尾 | 执行但**不显示**结果 | `a = 1+2;` |
| 无分号 | 执行并显示结果 | `a = 1+2` |
| `%` | 单行注释 | `% 这是注释` |
| `%%` | 分节注释（可分块运行） | `%% 第一节` |
| `...` | 续行符 | `y = 1 + 2 + ...`<br>`    3;` |
| `'` | 转置（复数取共轭） | `A'`，注意 `. '` 只转置不共轭 |
| `clc` | 清空命令行窗口 | — |
| `clear` | 清空工作区变量 | `clear all` |
| `who` / `whos` | 列出变量（whos 更详细） | — |
| `help xxx` | 查看函数帮助 | `help plot` |

> [!warning] 变量命名
> - 以**字母**开头，只能含字母、数字、下划线，**区分大小写**（`A` 和 `a` 是两个变量）。
> - 不要用 `i`、`j`、`pi`、`eps`、`Inf`、`NaN` 等内置常量做变量名——覆盖后复数运算会出错。
> - `NaN`（非数值）、`Inf`（无穷）：`1/0 = Inf`，`0/0 = NaN`。

---

## 2. 矩阵与向量

### 2.1 创建

```matlab
a = [1 2 3; 4 5 6];        % 2行3列，分号换行、空格/逗号分列
row = [1, 2, 3];            % 行向量
col = [1; 2; 3];            % 列向量
t = 0:0.01:1;               % 冒号法：0到1步长0.01（常用作时间轴）
t = linspace(0, 1, 100);    % 从0到1等分100个点（含端点）
z = zeros(1, 100);          % 全0行向量
o = ones(2, 3);             % 全1矩阵
e = eye(3);                 % 3阶单位阵
r = rand(1, 1000);          % [0,1)均匀分布随机数
n = randn(1, 1000);         % 标准正态 N(0,1) 随机数（生成高斯噪声用）
```

### 2.2 索引与切片

```matlab
A = magic(4);        % 4阶魔方阵
A(2, 3)              % 第2行第3列（下标从1开始，不是0！）
A(1, :)              % 第1行全部
A(:, 2)              % 第2列全部
A(1:2, 2:3)          % 子矩阵
A(end, end)          % end 表示最后一个下标
idx = find(A > 10);  % 返回满足条件的线性索引
```

> [!warning] 下标从 1 开始
> MATLAB 下标从 **1** 开始（C 语言从 0 开始），写循环时是 `for k = 1:N`，FFT 结果 `X(1)` 对应**直流分量**。

### 2.3 尺寸相关函数

| 函数                          | 含义                   |
| --------------------------- | -------------------- |
| `length(x)`                 | 最大维度长度（常用于取向量长度）     |
| `size(A)`                   | 返回 `[行数, 列数]`        |
| `numel(A)`                  | 元素总个数                |
| `reshape(A, 2, 6)`          | 重排为 $2\times6$（按列填充） |
| `sum(A)` / `sum(A, 2)`      | 按列求和 / 按行求和          |
| `max(A)` / `max(A, [], 2)`  | 每列最大 / 每行最大          |
| `cumsum(x)`                 | 累加和（积分的离散近似）         |
| `diff(x)`                   | 相邻差分（导数的离散近似）        |
| `dot(a, b)` / `cross(a, b)` | 点积 / 叉积              |
| `[a, b]` / `[a; b]`         | 水平拼接 / 垂直拼接          |
| `repmat(A, 2, 1)`           | 平铺复制矩阵               |

---

## 3. 运算符（⚠️ 点运算是最大易错点）

### 3.1 矩阵运算 vs 点（逐元素）运算

| 矩阵运算 | 点（逐元素）运算 |
| --- | --- |
| `*` 矩阵乘 | `.*` 逐元素乘 |
| `/` 右除（乘逆） | `./` 逐元素除 |
| `\` 左除：`A\b` 解 $Ax=b$ | `.\` 逐元素左除 |
| `^` 矩阵幂 | `.^` 逐元素幂 |

```matlab
t = 0:0.1:1;
s = sin(2*pi*t);      % 向量
y1 = 1./t;            % ✓ 逐元素取倒数
y2 = exp(-t).*cos(t); % ✓ 两个向量逐元素相乘
% y3 = exp(-t)*cos(t); % ✗ 报错：内部维度不一致
```

> [!warning] 点乘 `.*` 与矩阵乘 `*`
> 仿真中绝大多数报错来自该用 `.*` 的地方写了 `*`。
> 判断口诀：**参与运算的两个量是"函数对每个采样点求值"就用点运算**（如 $e^{-t}\cos t$）；只有真正的线性代数矩阵乘法（如 $Ax$、$H\cdot P$）才用 `*`。
> 标量与向量相乘两者等价：`2*s` 和 `2.*s` 都对。

### 3.2 关系与逻辑运算

| 运算符 | 含义 |
| --- | --- |
| `==` `~=` | 等于 / 不等于（`~` 是"非"记号） |
| `>` `<` `>=` `<=` | 大小比较 |
| `&&` `\|\|` `~` | 标量逻辑与 / 或 / 非 |
| `& \|` | **逐元素**逻辑与 / 或（用于向量条件） |
| `any(x)` / `all(x)` | 任一 / 全部为真 |

---

## 4. 流程控制

```matlab
% if-elseif-else
if x > 0
    disp('正');
elseif x == 0
    disp('零');
else
    disp('负');
end

% for 循环（蒙特卡洛仿真误码率的标准写法）
N = 1e5;                       % 仿真比特数
err = 0;
for k = 1:N
    b = rand > 0.5;             % 随机产生一个比特
    err = err + (接收比特 ~= 发送比特);
end
Pe = err / N;                   % 误码率 = 错误数/总数

% while 循环
while norm(x - x_old) > 1e-6    % 迭代直到收敛
    x_old = x;
    x = update(x);
end

% switch-case
switch M
    case 2,  mod = 'BPSK';
    case 4,  mod = 'QPSK';
    otherwise, mod = '其他';
end
```

> [!tip] 向量化优先
> MATLAB 中**显式 for 循环很慢**。能用矩阵运算表达的不要写循环：
> ```matlab
> % 慢：for k = 1:N, y(k) = sin(2*pi*k/N); end
> y = sin(2*pi*(1:N)/N);   % ✓ 向量化，快一个数量级
> ```

---

## 5. 函数

### 5.1 函数文件

一个 `.m` 文件中第一个可执行语句是 `function` 即为函数文件，**文件名必须与函数名相同**：

```matlab
% 文件名必须是 qfun.m
function y = qfun(x)
% Q函数：标准正态分布右尾概率
y = 0.5 * erfc(x / sqrt(2));
end
```

多返回值写法：`function [Pe, SNR] = sim_bpsk(N, EbN0_dB)`

### 5.2 匿名函数（快速定义，通信仿真常用）

```matlab
qfunc  = @(x) 0.5*erfc(x/sqrt(2));          % Q函数
Pe_bpsk = @(EbN0) qfunc(sqrt(2*EbN0));      % BPSK误码率理论曲线
Pe_ask  = @(EbN0) qfunc(sqrt(EbN0/2));      % 2ASK相干解调
% 用法：
Pe_bpsk(10)   % 即代入 Eb/N0 = 10
```

> [!note] 理论误码率曲线 = 知识点 + MATLAB
> 通信原理中各调制方式误码率公式（见 [[vault-notes/communication/07-digital-bandpass]]），用匿名函数一行定义后即可画理论曲线，与蒙特卡洛仿真点对比验证。

---

## 6. 数学函数速查

| 类别 | 函数 |
| --- | --- |
| 三角 | `sin` `cos` `tan` `atan` `atan2(y,x)` `acos` |
| 指数对数 | `exp` `log`（自然对数）`log2` `log10` `sqrt` |
| 取整 | `round`（四舍五入）`floor` `ceil` `fix`（向零取整） |
| 复数 | `abs` `angle`（弧度）`real` `imag` `conj` `complex` |
| 阶乘组合 | `factorial` `nchoosek(n,k)`（$C_n^k$） |
| 特殊函数 | `erf` `erfc`（误码率公式核心）`gamma` `besselj(nu,x)`（$J_n$，带通噪声/贝塞尔调频） |
| 统计 | `mean` `var` `std` `median` `cov` |
| 常量 | `pi` `eps`（机器精度）`Inf` `NaN` `i` `j` |

> [!warning] `log` 是自然对数
> MATLAB 中 `log(x)` 是 $\ln x$。算 $\log_2 M$ 要写 `log2(M)`，算 dB 要写 `10*log10(P)`。
> 通信中最常见：`SNR_dB = 10*log10(signal_power/noise_power)`。

---

## 7. 绘图

```matlab
t = 0:0.001:2;
s = sin(2*pi*5*t);

plot(t, s, 'b-', 'LineWidth', 1.5);   % 画曲线，蓝色实线
hold on;                               % 保持当前图，可叠加多条曲线
plot(t, 0.5*sin(2*pi*10*t), 'r--');
hold off;

xlabel('时间 t/s'); ylabel('幅度');
title('叠加波形');
legend('5Hz分量', '10Hz分量');
grid on;                               % 显示网格
axis([0 2 -1.5 1.5]);                  % 设定坐标范围 [xmin xmax ymin ymax]
```

### 常用图形函数

| 函数 | 用途 |
| --- | --- |
| `plot` | 连续曲线（模拟波形） |
| `stem` | 火柴杆图（**数字基带码元**首选，如单极性/双极性波形） |
| `subplot(m,n,k)` | 一页 $m\times n$ 幅图，当前画第 $k$ 幅 |
| `semilogy(x,y)` | **y 轴对数坐标**——画误码率曲线必用（$P_e$ 跨好几个数量级） |
| `figure` | 新开一个图窗 |
| `histogram(x, 50)` | 直方图（统计噪声分布、验证高斯） |
| `imagesc(A)` | 矩阵热图（星座图演进、时频分析） |
| `saveas(gcf, 'fig.png')` | 保存图片 |

> [!tip] 误码率曲线标准模板
> ```matlab
> EbN0_dB = 0:10;
> semilogy(EbN0_dB, Pe_bpsk(10.^(EbN0_dB/10)), 'b-o');
> % 10.^() 是把 dB 换算成真值：SNR = 10^(SNR_dB/10)
> grid on; xlabel('E_b/N_0 (dB)'); ylabel('P_e');
> ```

---

## 8. 通信仿真高频函数

### 8.1 信号生成

| 函数 | 说明 | 对应知识点 |
| --- | --- | --- |
| `sin(2*pi*f*t + phi)` | 正弦 | 载波 |
| `sinc(x)` | $\mathrm{sinc}(x)=\sin(\pi x)/(\pi x)$ | [[vault-notes/communication/06-digital-baseband]] 理想低通、抽样函数 |
| `square(2*pi*f*t, duty)` | 方波（duty 为占空比%） | 矩形波、基带码型 |
| `sawtooth(2*pi*f*t)` | 锯齿/三角波 | 扫频 |
| `chirp(t, f0, t1, f1)` | 线性调频 | LFM 雷达信号 |
| `rectpuls(t, w)` | 矩形脉冲 | 数字码元波形 |

### 8.2 频谱分析（FFT）

```matlab
fs = 1000;                    % 采样率
N  = length(s);               % 采样点数
S  = fftshift(fft(s))/N;      % FFT + 直流移中 + 归一化
f  = (-N/2 : N/2-1) * (fs/N); % 对称频率轴
plot(f, abs(S));              % 幅度谱
```

| 函数 | 说明 |
| --- | --- |
| `fft(x, N)` | N 点快速傅里叶变换 |
| `ifft(X)` | 逆变换 |
| `fftshift` | 把 0 频率分量移到频谱中央（画图必配） |
| `pwelch(x)` | 功率谱估计（[[vault-notes/communication/03-random-processes]] 中 $P_n(f)$ 的数值验证） |

### 8.3 滤波与系统

| 函数 | 说明 |
| --- | --- |
| `filter(b, a, x)` | 直接形式滤波：$\sum a_k y(n-k)=\sum b_m x(n-m)$ |
| `conv(x, h)` | 卷积（求输出 $y(t)=x*h$、相关运算） |
| `freqz(b, a, N)` | 数字滤波器频率响应 |
| `butter(n, wn)` | N 阶巴特沃斯滤波器系数 |
| `[y, t] = lsim(sys, u, t)` | 线性系统对输入 u 的响应 |

### 8.4 噪声与信道（需 Communications Toolbox）

| 函数 | 说明 |
| --- | --- |
| `awgn(s, snr)` | 加高斯白噪声（snr 单位 dB） |
| `randn` + 手动缩放 | 不依赖工具箱：`noise = sqrt(N0/2)*randn(size(s))` |
| `pskmod(bits, M, pi/4)` / `pskdemod` | M 进制相位调制/解调 |
| `qammod(bits, M)` / `qamdemod` | QAM 调制/解调 |
| `eyediagram(x, sps)` | 眼图 |
| `scatterplot(x)` | 星座图 |

### 8.5 数值积分与相关（验证公式用）

| 函数 | 说明 | 验证的公式 |
| --- | --- | --- |
| `trapz(t, x.^2)` | 梯形法数值积分 | 信号能量 $E=\int s^2(t)dt$ |
| `integral(f, a, b)` | 高精度积分（f 为匿名函数） | 任意定积分 |
| `xcorr(x, y)` | 互相关；`xcorr(x)` 自相关 | $R(\tau)$、[[vault-notes/communication/02-deterministic-signals]] 维纳-辛钦定理 |
| `mean(s.^2)` | 平均功率 | $P=\frac{1}{T}\int s^2 dt$ |

---

## 9. 实用技巧速记

```matlab
% dB 换算
snr_linear = 10^(snr_dB/10);
power_dBm  = 10*log10(power_mW);

% 码元速率/比特速率验证（N 个符号仿真了 T 秒）
Rb = N / T;

% 生成随机 0/1 比特流
bits = randi([0 1], 1, 1000);
bits = (rand(1, 1000) > 0.5);       % 等价写法

% 极性转换：0/1 → -1/+1（双极性基带）
bipolar = 2*bits - 1;

% 采样判决（每 sps 个采样点取一个）
decision = rx(1:sps:end) > 0;

% 误码统计
Pe = mean(decision ~= bits);

% 单位脉冲/单位阶跃
impulse = (t == 0);
step    = (t >= 0);

% 复数载波与星座
s = exp(1j*(2*pi*f*t + phi));       % 1j 是纯虚数单位，比 i/j 安全
```

> [!warning] 高频坑汇总
> 1. 下标从 1 开始；`X(1)` 是 FFT 的直流分量。
> 2. `*` 写成了该用的 `.*`——90% 的维度报错来源。
> 3. `log` 是 $\ln$，算 dB 用 `log10`。
> 4. 复数乘法别覆盖 `i`/`j`，推荐写 `1j`。
> 5. `fft` 后忘记除以 N 归一化，幅度谱量纲不对。
> 6. 向量中 `max(A)` 每列取最大，整体取最大要写 `max(A(:))`。
> 7. 中文输入法下的全角标点（`；` `（）`）会导致语法错误。

---

## 相关笔记

- [[vault-notes/communication/a-formula-cheatsheet]] — 各调制方式误码率公式（可直接翻译成匿名函数画曲线）
- [[vault-notes/communication/02-deterministic-signals]] — 用 `trapz` / `xcorr` 验证能量、自相关
- [[vault-notes/communication/03-random-processes]] — 用 `randn` + 直方图验证高斯/瑞利分布
- [[vault-notes/communication/06-digital-baseband]] — 用 `stem` / `sinc` 画码型与升余弦滚降
- [[vault-notes/communication/07-digital-bandpass]] — BPSK/QPSK 蒙特卡洛误码率仿真的理论基础
- [[vault-notes/digital-modulation/01-digital-communication-system]]
