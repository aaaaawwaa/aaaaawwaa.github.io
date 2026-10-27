---
created: '2026-09-28'
aliases:
- IQ实验实战
- 数字调制 Matlab 与 RTL 验证
tags:
- IQ信号
- 数字调制
- Matlab
- RTL
- FPGA
- 验证
title: IQ信号实验实战（Matlab+RTL）
related:
- - - IQ信号
type: lab
subjects:
- FPGA
- 通信原理
- 数字信号处理
domains:
- 实验与仿真
- 射频前端
status: learning
prerequisites: []
---


# IQ信号实验实战（Matlab+RTL）

> [!abstract] 实验目标
> 把 [[vault-notes/fpga/ad9361/iq-signals]] 里的概念变成可运行、可验证的工程：用 **MATLAB 建立黄金参考模型**，用 **Verilog RTL 实现同一个数字调制器**，再用 **逐点精确比对** 证明两者输出的 I/Q 完全相同。核心原则是：**仿真通过不等于正确，只有与黄金模型逐点相等才算通过。**

## 1. 为什么需要黄金参考模型

数字调制只做了一件事：

```text
比特 → 星座点 → 复符号 a_k = I_k + jQ_k → 输出到 DAC / 上变频
```

器件本身不复杂，但它是所有后续环节的基准。如果调制器输出的星座点错了：

- 后面的滤波器、DDC、解调全部建立在错误数据上；
- 频谱上可能"看起来有信号"，EVM 却始终很差；
- Q 符号错了会导致频谱方向反转，但波形依然"像模像样"。

所以验证目标不是"输出看起来对"，而是：

$$
\text{RTL 输出}[n]\ \equiv\ \text{MATLAB 参考}[n],\quad \forall n
$$

**逐点整数相等**，不允许"接近"。

> [!warning] 常见的错误验证方式
> - 只看波形是否为正弦/方波；
> - 只看星座"大致像" QPSK；
> - 只看仿真器打印 PASS，但 PASS 只检查了结构，没比对数值；
> - 用另一套临时脚本（而不是正式参考模型）来产生期望值。

## 2. 验证架构

```text
                 ┌─────────────────────┐
   PRBS7 比特源  │  MATLAB 黄金模型     │ → 期望 I/Q 整数序列
                 └─────────────────────┘            │
                                                    │ 逐点比对
                 ┌─────────────────────┐            │
   同一比特序列  │  RTL: iq_digital_mod │ → 实际 I/Q 整数序列
                 └─────────────────────┘
                          ↑
                     testbench 激励
```

关键点：**两边必须使用完全相同的输入**。RTL 内部自己产生 PRBS7，MATLAB 就必须实现同一个 PRBS7、同一初值、同一抽取顺序；RTL 内部的星座查找表，MATLAB 必须用同样的整数常量。

任何一处"约定不一致"，比对都会失败——这正是这个实验的价值：它强迫你把**接口契约**写清楚。

## 3. 需要冻结的接口契约

在写任何代码之前，先把下面这张表填完。这份契约是实验能否成功的前提。

| 项目 | 约定内容 | 本实验取值 |
| --- | --- | --- |
| 复数符号约定 | $x=I+jQ$ 还是 $I-jQ$ | $I+jQ$ |
| 数据格式 | 有符号补码，位宽 | 有符号 12 位 |
| 幅度缩放 | 星座电平的整数刻度 | $SCALE=256$ |
| 模式编号 | 0~4 与调制方式对应 | 0=BPSK, 1=QPSK, 2=QAM4, 3=QAM16, 4=QAM64 |
| 比特→索引 | MSB 优先还是 LSB 优先 | MSB 优先 |
| PRBS 多项式 | 抽头与阶数 | $x^7+x^6+1$，周期 127 |
| PRBS 初值 | 复位后的种子 | 1 |
| PRBS 输出位 | 取哪一位作为输出 | 最低位 |
| 每符号保持 | 生产值 / 仿真值 | 5000 / 5 |
| 非法模式 | mode=5,6,7 的行为 | 输出固定安全值，不产生 X |

> [!tip] 先写契约，再写代码
> 这张表就是"接口合同"。实际项目里，MATLAB 模型和 RTL 通常由不同人或不同时间写成，最容易出错的地方不是算法，而是**位序、符号、初值、缩放**这四个约定。

### 3.1 星座表（整数常量）

以 $SCALE=256$ 为例，所有星座点都写成整数，两边共用：

| 模式 | I/Q 电平 | 星座点数 | 每符号比特数 |
| --- | --- | ---: | ---: |
| BPSK (0) | $I=\pm256$，$Q=0$ | 2 | 1 |
| QPSK (1) | $I,Q=\pm256$ | 4 | 2 |
| QAM4 (2) | 同 QPSK | 4 | 2 |
| QAM16 (3) | $I,Q\in\{\pm256,\pm768\}$ | 16 | 4 |
| QAM64 (4) | $I,Q\in\{\pm256,\pm768,\pm1280,\pm1792\}$ | 64 | 6 |

说明：

- 最大值 1792，小于 12 位有符号数的上限 2047，不会溢出；
- BPSK 的 $Q$ 必须严格为 $0$，这是最容易检查出错误的一项；
- QAM16/QAM64 采用方形网格，与 [[vault-notes/fpga/ad9361/iq-signals]] 中"星座点数决定比特数"的结论一致。

## 4. MATLAB 黄金模型

### 4.1 星座映射

```matlab
function [I, Q] = digital_mod_ref(mode, n_sym, seed)
% DIGITAL_MOD_REF  生成数字调制的定点 I/Q 参考序列
%   mode  : 0=BPSK 1=QPSK 2=QAM4 3=QAM16 4=QAM64
%   n_sym : 符号个数
%   seed  : PRBS7 初始种子 (1..127)
%   I, Q  : 有符号整数行向量，语义为 int12

SCALE = 256;
if nargin < 3 || isempty(seed), seed = 1; end

switch mode
    case 0                          % BPSK
        table = [ 256+0j; -256+0j ];
    case {1, 2}                     % QPSK / QAM4
        table = [ 256+256j; -256+256j; -256-256j; 256-256j ];
    case 3                          % QAM16
        lev = [-3 -1 1 3] * SCALE;
        table = build_square_qam(lev);
    case 4                          % QAM64
        lev = [-7 -5 -3 -1 1 3 5 7] * SCALE;
        table = build_square_qam(lev);
    otherwise
        error('digital_mod_ref:badMode', 'mode %d unsupported', mode);
end

bits_per_sym = log2(numel(table));
if mod(bits_per_sym, 1) ~= 0
    error('digital_mod_ref:badTable', 'constellation size must be power of 2');
end

bits = prbs7(n_sym * bits_per_sym, seed);
idx  = zeros(1, n_sym);

for k = 1:n_sym
    b = bits((k-1)*bits_per_sym + (1:bits_per_sym));
    % MSB 优先：第一个比特是最高位
    idx(k) = msb_first_to_index(b);
end

sym = table(idx + 1);               % MATLAB 索引从 1 开始
I = int32(real(sym));
Q = int32(imag(sym));
end
```

辅助函数：

```matlab
function table = build_square_qam(lev)
% 行优先展开，保证与 RTL 查找表顺序一致
table = zeros(numel(lev)^2, 1);
n = 0;
for q = lev
    for i = lev
        n = n + 1;
        table(n) = i + 1j*q;
    end
end
end

function idx = msb_first_to_index(b)
% b(1) 为 MSB
n = numel(b);
idx = 0;
for k = 1:n
    idx = idx * 2 + b(k);
end
end
```

### 4.2 PRBS7 比特源

```matlab
function bits = prbs7(n, seed)
% PRBS7: x^7 + x^6 + 1，周期 127，全零为禁止态
if nargin < 2 || isempty(seed), seed = 1; end

state = mod(seed, 128);
if state == 0, state = 1; end       % 全零会锁死，强制退出

bits = zeros(1, n, 'uint8');
for k = 1:n
    bits(k) = uint8(bitand(state, 1));              % 输出最低位
    b7 = bitand(bitshift(state, -6), 1);            % 第 7 位
    b6 = bitand(bitshift(state, -5), 1);            % 第 6 位
    fb = bitxor(b7, b6);
    state = bitand(bitxor(bitshift(state, -1), bitshift(fb, 6)), 127);
end
end
```

> [!warning] PRBS 是最容易两边不一致的部分
> 抽头位置、移位方向、输出位、初值，只要有一样不同，序列就完全不同。建议先单独验证 PRBS：连续产生 127 个状态，必须**互不相同且都不为零**，第 128 个状态回到初值。

### 4.3 自检参考模型

在进入 RTL 比对之前，MATLAB 自己先做一致性检查：

```matlab
% 检查 1：星座点数
% 检查 2：BPSK 的 Q 恒为 0
% 检查 3：数值不超出 12 位有符号范围
% 检查 4：PRBS7 周期为 127
% 检查 5：同种子重启后序列完全重复
```

这五条检查成本很低，但能在写 RTL 之前就排除掉大部分"契约错误"。

## 5. RTL 数字调制器

### 5.1 模块接口

```verilog
`timescale 1ns / 1ps
module iq_digital_mod #(
    parameter integer SYM_TICKS   = 5000,   // 生产值
    parameter integer PRBS_SEED   = 7'd1
)(
    input  wire               clk,
    input  wire               rst_n,
    input  wire [2:0]         mode,          // 0..4 合法
    input  wire               enable,
    output reg  signed [11:0] i_out,
    output reg  signed [11:0] q_out,
    output reg                symbol_valid
);
```

设计约定：

- `i_out`、`q_out` 为**有符号 12 位补码**；
- `symbol_valid` 在切换新符号时给出**单周期脉冲**；
- 每个符号保持 `SYM_TICKS` 个时钟周期；
- `mode` 取 5、6、7 时输出固定安全值，不产生未知态。

### 5.2 结构划分

```text
  PRBS7 比特源
        ↓
  比特 → 符号索引（MSB 优先）
        ↓
  模式选择 / 星座查找表
        ↓
  I/Q 输出寄存器 + 保持计数
        ↓
  symbol_valid 单周期脉冲
```

建议把"符号索引生成"和"星座查找表"拆成两个 always 块或子模块，便于单独验证。

### 5.3 关键实现要点

**位宽与符号扩展**

QAM64 最大电平 1792，查找表内部用 `signed [11:0]`；如果中间做了乘加，必须先扩展位宽再运算。

**星座查找表**

```verilog
// 12'sd256 表示有符号 12 位常量 256
// symbol_index 由 mode 决定位宽：BPSK/QPSK/QAM4 用 2 位，QAM16 用 4 位，QAM64 用 6 位
always @(*) begin
    case (mode)
        3'd0: begin                       // BPSK：2 点，Q 恒为 0
            i_nxt = symbol_index[0] ? -12'sd256 : 12'sd256;
            q_nxt = 12'sd0;
        end
        3'd1, 3'd2: begin                 // QPSK / QAM4：4 点
            case (symbol_index[1:0])
                2'd0: begin i_nxt =  12'sd256; q_nxt =  12'sd256; end
                2'd1: begin i_nxt = -12'sd256; q_nxt =  12'sd256; end
                2'd2: begin i_nxt = -12'sd256; q_nxt = -12'sd256; end
                default: begin i_nxt =  12'sd256; q_nxt = -12'sd256; end
            endcase
        end
        3'd3: begin                       // QAM16：电平 {±256, ±768}
            i_nxt = qam16_level(symbol_index[3:2]);
            q_nxt = qam16_level(symbol_index[1:0]);
        end
        3'd4: begin                       // QAM64：电平 {±256, ±768, ±1280, ±1792}
            i_nxt = qam64_level(symbol_index[5:3]);
            q_nxt = qam64_level(symbol_index[2:0]);
        end
        default: begin                    // mode = 5, 6, 7
            i_nxt = 12'sd0;
            q_nxt = 12'sd0;
        end
    endcase
end

function signed [11:0] qam16_level;
    input [1:0] sel;
    begin
        case (sel)
            2'd0: qam16_level =  12'sd256;
            2'd1: qam16_level =  12'sd768;
            2'd2: qam16_level = -12'sd256;
            default: qam16_level = -12'sd768;
        endcase
    end
endfunction
```

要点是：**查找表中的整数常量必须与 MATLAB 的 `SCALE`、电平取值逐一对应**，并且索引到电平的映射顺序（行优先、MSB 优先）两边要完全一致。

**保持计数**

```text
symbol_valid 拉高的那一拍 → 装载新符号
之后 SYM_TICKS-1 拍          → 保持
计数归零后再次装载
```

**非法模式**

```verilog
default: begin
    i_nxt = 12'sd0;
    q_nxt = 12'sd0;
end
```

不要写成 `12'bx`，也不要让计数器产生未知态。

## 6. Testbench 与自检测试

### 6.1 GOLD 打印格式

testbench 按模式打印前 127 个符号边界，格式固定：

```text
GOLD mode=<0..4> index=<0..126> i=<signed> q=<signed>
```

这个格式是**比对程序的解析契约**，改动前必须同步改比对脚本。

### 6.2 必须覆盖的检查项

| 检查项 | 目的 |
| --- | --- |
| 星座点数 2/4/4/16/64 | 确认各模式的合法点数量 |
| BPSK 的 Q 恒为 0 | 最容易发现 Q 通道错误 |
| 输出在有符号 12 位范围内 | 防止溢出 |
| `symbol_valid` 为单周期脉冲 | 防止一拍多符号 |
| 每个符号保持 `SYM_TICKS` 拍 | 验证保持计数 |
| PRBS7 的 127 个非零状态 | 验证比特源 |
| 重启后序列完全重复 | 验证复位确定性 |
| 非法 mode 5/6/7 | 验证边界行为 |
| 最终打印 `PASS` / 失败退出 | 供自动化流程判断 |

> [!warning] 用 `SYM_TICKS` 做快速结构检查
> 结构检查用很小的 `SYM_TICKS`（例如 5）即可快速跑完。但要清楚：**它只证明计数器语义和查找表逻辑正确，不能证明生产参数下的保持时序。** 生产参数的验证必须单独做一次，见第 8 节。

## 7. 仿真流程

### 7.1 发现工具链

```bash
cli-anything-vivado config show
```

不要假设安装路径。当前已知安装位置为 `D:/Vivado/Vivado/2018.3`。

### 7.2 编译、elaboration、仿真

```bash
VIVADO=D:/Vivado/Vivado/2018.3/bin
"$VIVADO/xvlog.bat" -sv rtl/iq_digital_mod.v tb/iq_digital_mod_tb.v
"$VIVADO/xelab.bat" iq_digital_mod_tb -s iq_digital_mod_sim
"$VIVADO/xsim.bat" iq_digital_mod_sim -runall > sim/iq_digital_mod.sim.log
```

> [!warning] 不要用其他仿真器代替验收
> Icarus 等仿真器只能作为**辅助证据**，不能替代 Vivado 的验收结果。验收必须在 Vivado xsim 上通过。

### 7.3 时间尺度错误

如果 `xelab` 报 `XSIM 43-4099`（某个设计单元缺少时间尺度），逐个检查被编译的 RTL / testbench 单元：

```verilog
`timescale 1ns / 1ps
```

只给缺少该指令的单元补上，不要改动本来已经正确的单元，也不要用 elaboration 选项掩盖问题。

## 8. 生产参数验证

仓库中的 testbench 为了快速跑结构检查，故意把保持计数设得很小。要证明**生产默认值**正确，需要单独做一次长跑：

```text
1. 把 testbench 复制到操作系统临时目录
2. 只替换其中的 SYM_TICKS 为生产值（例如 5000）
3. 用原始 DUT + 复制出来的 testbench 编译
4. 要求打印 PASS
```

**不要修改仓库里的 testbench 去跑这一次性验证。** 否则会把"临时验证手段"固化进仓库，之后没人知道那到底是设计值还是调试值。

## 9. 黄金比对

### 9.1 比对方法

从仿真日志中解析 GOLD 行，与 MATLAB 参考模型输出**逐点精确比较**：

- 必须是有符号整数，逐点相等；
- 必须覆盖全部 5 个模式；
- 每个模式必须恰好 127 条**有序**记录；
- 缺一条、多一条、顺序错乱都算失败。

### 9.2 比对脚本

```matlab
% 伪代码结构：解析日志 → 与参考模型比对 → 断言
log = fileread('sim/iq_digital_mod.sim.log');
rows = parse_gold_lines(log);           % regexp 解析 mode/index/i/q

names = {'BPSK','QPSK','QAM4','QAM16','QAM64'};
for m = 0:4
    actual   = extract_mode(rows, m);           % 按 index 排序
    [I, Q]   = digital_mod_ref(m, 127, 1);
    expected = [I(:), Q(:)];

    assert(size(actual,1) == 127, 'mode %d: record count', m);
    assert(isequal(actual, expected), 'mode %d: value mismatch', m);
end
disp('GOLD comparison PASS');
```

### 9.3 比对时的常见坑

| 坑 | 后果 | 正确做法 |
| --- | --- | --- |
| 使用预览版 / 临时脚本产生期望值 | 期望值本身就错 | 只使用**正式参考模型** |
| 用无符号整数解析 | 负值全部错 | 正则中显式匹配 `-?` |
| 忽略记录顺序 | 漏检顺序错误 | 先按 index 排序再比对 |
| 记录数不校验 | 漏掉丢样本 | 断言恰好 127 条 |
| 路径用 POSIX 写法 | Windows Python/MATLAB 读不到 | 使用工程内路径或原生 Windows 路径 |

## 10. 完整验收证据

一次合格的实验，需要**分别**给出下面每一项证据，不能合并成一句"验证通过"：

1. `xvlog`、`xelab`、`xsim` 三步均无错误；
2. testbench 打印 `PASS`；
3. 黄金比对通过：5 个模式 × 127 个符号，全部逐点相等；
4. 生产参数（长保持计数）副本运行通过；
5. 若工程含脚本化单元测试，全部通过；
6. 本次验证**只改动被验证的调制模块**，未改动顶层、寄存器桥、PS 协议、上位机等无关文件。

> [!tip] 第 6 条为什么重要
> 隔离验证的意义在于：一旦比对失败，可以确定问题就在被验证模块内。如果同时改了其他文件，失败原因就无法定位。

## 11. 常见失败与排查

| 现象 | 最可能原因 | 纠正方法 |
| --- | --- | --- |
| `xvlog: command not found` | 工具未在 PATH | 探明 Vivado 根目录，用显式 `.bat` 路径 |
| `XSIM 43-4099` | 单元缺少时间尺度 | 给缺失单元补 `timescale` 后重跑 |
| 比对脚本报导入错误 | 引用了预览代码 | 改用正式参考模型 |
| 快速 testbench 通过就交付 | 未验证生产参数 | 另跑一次生产参数副本 |
| 负值全部比对失败 | 按无符号解析 | 正则匹配负号 |
| BPSK 的 Q 不为 0 | Q 通道逻辑或模式判断错误 | 单独测 mode=0 |
| 重启后序列不同 | PRBS 复位值未固定 | 固定初值并复位装载 |
| 非法模式出现 X | 查找表缺 default 分支 | 补 `default` 输出安全值 |
| 记录数不是 127 | 丢样本或计数器语义错 | 检查 `symbol_valid` 与保持计数 |
| 其他仿真器通过、Vivado 不通过 | 时序/初值语义差异 | 以 Vivado 结果为准并排查差异 |

## 12. 从 RTL 走向 AD9361 实测

RTL 比对通过后，可以把输出接到真实链路上：

```text
FPGA: iq_digital_mod 输出 I/Q
        ↓
AD9361 数字接口 → 插值/FIR → DAC → 正交上变频
        ↓
射频输出 → 频谱仪 / 衰减器回环
        ↓
接收 → AD9361 → FPGA 采集 → 绘制星座图、计算 EVM
```

此时可以复现 [[vault-notes/fpga/ad9361/iq-signals]] 中列出的失真形态，并逐项定位：

| 实测现象 | 优先检查 |
| --- | --- |
| 星座变成椭圆 | IQ 增益失衡 |
| 星座整体旋转 | 载波相位 / 本振相位 |
| 频谱上下边带位置反了 | Q 符号约定、I/Q 顺序 |
| 中心出现尖峰 | DC 偏置、LO 泄漏 |
| 镜像明显 | IQ 相位/增益/时延失衡 |
| EVM 随幅度变化 | 功放非线性、定点溢出 |

这一步的意义是：把"RTL 逻辑正确"和"射频链路正确"分成两个独立的验证阶段，而不是混在一起排查。

## 13. 实验清单

- [ ] 填完第 3 节的接口契约表；
- [ ] 冻结星座表整数常量（`SCALE` 与各模式电平）；
- [ ] 冻结 PRBS7 抽头、初值、输出位；
- [ ] MATLAB 参考模型通过全部自检（点数、BPSK Q=0、位宽、周期、重启）；
- [ ] RTL 实现查找表、保持计数、`symbol_valid` 单周期脉冲；
- [ ] RTL 对非法模式输出安全值；
- [ ] testbench 覆盖第 6.2 节全部检查项；
- [ ] Vivado 三步流程无错误；
- [ ] 黄金比对 5 × 127 逐点相等；
- [ ] 生产参数副本运行通过；
- [ ] 隔离验证期间未改动无关文件；
- [ ] 整理实测现象与失真形态的对应关系。

## 14. 关键词

`黄金参考模型` · `逐点比对` · `星座表` · `PRBS7` · `SYM_TICKS` · `symbol_valid` · `定点补码` · `MSB 优先` · `xvlog` · `xelab` · `xsim` · `timescale` · `GOLD` · `EVM` · `隔离验证` · `AD9361`

---

**关联**：[[vault-notes/fpga/00-guide]]｜[[vault-notes/fpga/ad9361/iq-signals]]｜[[vault-notes/fpga/ad9361/ad9361-digital-interface]]｜[[vault-notes/matlab/matlab-notes]]｜[[vault-notes/digital-modulation/01-digital-communication-system|数字通信系统组成]]
