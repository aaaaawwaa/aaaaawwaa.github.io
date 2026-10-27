---
title: "时序分析速查卡"
type: concept
subjects:
- FPGA
- 数字系统设计
domains:
- 时序分析
tags:
- FPGA
- 时序
- 速查
- 公式卡
status: learning
aliases:
- 时序速查卡
- 时序公式表
prerequisites:
- "[[vault-notes/fpga/sta/04-timing-analysis-setup-hold]]"
related:
- "[[vault-notes/fpga/sta/05-timing-constraints-period-offset]]"
- "[[vault-notes/fpga/sta/06-timing-exceptions-priority]]"
created: 2026-10-27
---

# 07 · FPGA 时序分析速查卡

> [!abstract] 用途
> 把 [[vault-notes/fpga/sta/04-timing-analysis-setup-hold]]、[[vault-notes/fpga/sta/05-timing-constraints-period-offset]]、[[vault-notes/fpga/sta/06-timing-exceptions-priority]] 三篇压缩成一页，做题/调工程时直接查。
> 所有公式均来自课件《4 FPGA综合与时序收敛》，符号以课件为准并给出等价写法。

## 一、一张图看懂时序关系

```
                     ┌──────────── 一个时钟周期 T ────────────┐
  发起沿                                                    捕获沿
    │                                                          │
    ├─ Tcko ─► Q 有效 ─► Tlogic ─► Tnet ─► D 端稳定 ─Tsetup─► │
    │                                       ▲                  │
    │                                    数据必须提前 Tsetup 稳定
    │                                                          │
  时钟路径延迟 Tcd1                              时钟路径延迟 Tcd2
    └────────── Tskew = Tcd2 - Tcd1（捕获更晚为正）───────────┘

  建立检查：T + Tskew ≥ Tcko + Tlogic + Tnet + Tsetup
  保持检查：Tcd1 + Tcko(min) + Tlogic(min) ≥ Tcd2 + Thold   ← 与 T 无关！
```

## 二、公式表

| 公式 | 名称 | 什么时候用 |
| --- | --- | --- |
| $T_{period}=T_{cko}+T_{logic}+T_{net}+T_{setup}-T_{clk\_skew}$ | 周期约束（课件 P30 原式） | 写 `create_clock` / PERIOD |
| $T+T_{skew}\ge T_{cko}+T_{logic}+T_{net}+T_{setup}$，$T_{skew}=T_{cd2}-T_{cd1}$ | 周期约束（自洽形式） | 判断 skew 帮 setup 还是害 setup |
| $T\ge t_{c\text{-}q}+t_{plogic}+t_{su}$ | 建立条件（简化） | 粗算最高频率 |
| $t_{ck}\ge t_{pmax}+t_{cmax}+t_{su}$ | 建立条件（课件 P26 符号） | 与上一行等价 |
| $t_{cdreg}+t_{cdlogic}\ge t_{hold}$ / $t_{pmin}+t_{cmin}\ge t_h$ | 保持条件 | 检查 hold 违例 |
| $f_{max}=1/T_{min}$ | 最高频率 | 估算性能上限 |
| $\text{slack}=T_{required}-T_{arrival}$ | 时序裕量 | 读报告；≥0 才满足 |
| $T_{arrival}=T_{cko}+T_{output}+T_{logic}$ | 输入到达时间（P35） | 算 OFFSET IN |
| $T_{arrival}+T_{input}+T_{setup}<T_{period}$ | 输入约束关系 | 算 OFFSET IN |
| $T_{stable}=T_{logic}+T_{input}+T_{setup}$ | 输出稳定时间（P38） | 算 OFFSET OUT |
| $T_{cko}+T_{output}+T_{stable}<T_{period}$ | 输出约束关系 | 算 OFFSET OUT |
| $N\cdot T_{period}\ge \sum \text{延迟}$ | 多周期路径 | N 周期路径的放宽 |

## 三、约束命令对照

| 目的 | UCF（课件） | Vivado XDC |
| --- | --- | --- |
| 周期 | `NET SYS_CLK PERIOD=10ns HIGH 4ns` | `create_clock -period 10.000 -waveform {0 4} [get_ports SYS_CLK]` |
| 输入偏移 | `NET DATA_IN OFFSET=IN 12ns AFTER CLK` | `set_input_delay -clock CLK -max 12.000 [get_ports DATA_IN]` |
| 输出偏移 | `NET DATA_OUT OFFSET=OUT 13ns BEFORE CLK` | `set_output_delay -clock CLK -max 13.000 [get_ports DATA_OUT]` |
| 伪路径 | `False Paths (FROM TO TIG)` | `set_false_path -from ... -to ...` |
| 多周期 | `Multicycle Paths (FROM TO)` | `set_multicycle_path N -setup` + `N-1 -hold` |
| 异步时钟域 | — | `set_clock_groups -asynchronous -group {...}` |
| 生成时钟 | `NET CLK_DIV2 PERIOD=...` | `create_generated_clock -source ... -divide_by 2 ...` |

## 四、四类路径由谁约束

| 路径 | 约束 | 缺失后果 |
| --- | --- | --- |
| 寄存器 → 寄存器 | PERIOD / `create_clock` | 内部路径"未约束"，不优化不报警 |
| 输入 PAD → 寄存器 | OFFSET IN / `set_input_delay` | 输入侧 setup 可能违例而无提示 |
| 寄存器 → 输出 PAD | OFFSET OUT / `set_output_delay` | 输出到下级采样错误 |
| 输入 PAD → 输出 PAD | PAD-TO-PAD / `set_max_delay` | 纯组合直通路径失控 |
| 跨时钟域 | `set_clock_groups -asynchronous` | 工具按同频比较，报无意义违例 |
| 多周期路径 | `set_multicycle_path` | 过约束，浪费资源/难收敛 |
| 不可敏化路径 | `set_false_path` | 报"假违例"，误导优化方向 |

## 五、读时序报告清单

- [ ] 先确认看的是 **setup** 还是 **hold** 报告
- [ ] operating conditions：setup 看 **worst**，hold 看 **best**
- [ ] path type：setup 看 **max**，hold 看 **min**
- [ ] 时钟频率/周期与设计实际一致
- [ ] 最差路径（WNS）是多少？负值就是违例
- [ ] 有没有 **unconstrained paths**（未约束路径）？——比负 slack 更危险
- [ ] 有没有 **false path 误配**（本不该排除的路径被排除）
- [ ] hold 侧（WHS/THS）是否同时满足

## 六、时序图索引

> 图均以 SVG 存于 `Assets/TimingDiagrams/`，下文给出**文件链接**（点击可打开原图）与所在笔记。所有图都是**理论示意图**，不是 RTL 仿真波形。

| 图文件 | 讲什么 | 所在笔记 |
| --- | --- | --- |
| [[vault-notes/assets/01-design-implementation-flow/fig-01.svg|inverter-propagation-delay]] | 反相器 $t_{pHL}$/$t_{pLH}$ 定义 | [[vault-notes/fpga/sta/01-design-implementation-flow]] |
| [[vault-notes/assets/02-device-structure-clock-resources/fig-01.svg|mmcm-output-phase]] | MMCM 输出频率/相位关系 | [[vault-notes/fpga/sta/02-device-structure-clock-resources]] |
| [[vault-notes/assets/04-timing-analysis-setup-hold/fig-01.svg|setup-hold-window]] | $t_{su}$ / $t_{hold}$ 定义 | [[vault-notes/fpga/sta/04-timing-analysis-setup-hold]] |
| [[vault-notes/assets/04-timing-analysis-setup-hold/fig-02.svg|setup-hold-check]] | 发起沿/捕获沿与 skew | [[vault-notes/fpga/sta/04-timing-analysis-setup-hold]] |
| [[vault-notes/assets/04-timing-analysis-setup-hold/fig-03.svg|reg-to-reg-period]] | 周期约束路径分解 | [[vault-notes/fpga/sta/04-timing-analysis-setup-hold]] |
| [[vault-notes/assets/05-timing-constraints-period-offset/fig-01.svg|inverted-clock-half-period]] | 反相时钟只剩半周期 | [[vault-notes/fpga/sta/05-timing-constraints-period-offset]] |
| [[vault-notes/assets/05-timing-constraints-period-offset/fig-02.svg|input-offset]] | 输入偏移（12ns AFTER / 8ns BEFORE） | [[vault-notes/fpga/sta/05-timing-constraints-period-offset]] |
| [[vault-notes/assets/05-timing-constraints-period-offset/fig-03.svg|output-offset]] | 输出偏移（13ns BEFORE / 7ns AFTER） | [[vault-notes/fpga/sta/05-timing-constraints-period-offset]] |
| [[vault-notes/assets/06-timing-exceptions-priority/fig-01.svg|multicycle-path]] | 预定标计数器多周期路径 | [[vault-notes/fpga/sta/06-timing-exceptions-priority]] |

## 七、自检十问（考前/上板前）

1. 我的时钟写 `create_clock` 了吗？周期值等于板上晶振频率吗？
2. 有没有 `create_generated_clock` 没覆盖的分频/倍频时钟？
3. 输入/输出接口写了 `set_input_delay` / `set_output_delay` 吗？
4. 所有跨时钟域路径都做了异步处理（CDC/FIFO/握手）并加了 `set_clock_groups` 吗？
5. 每条 `set_false_path` / `set_multicycle_path` 都能说清理由吗？
6. 多周期路径的 hold 侧也设置了吗？
7. 综合后/实现后的 WNS、WHS 分别是多少？
8. 有没有 unconstrained paths？
9. 反相/双沿时钟的地方按半周期算过预算吗？
10. 约束值是按真实频率写的，还是拍脑袋写的？

## 关联

- 理论篇：[[vault-notes/fpga/sta/04-timing-analysis-setup-hold]]｜[[vault-notes/fpga/sta/05-timing-constraints-period-offset]]｜[[vault-notes/fpga/sta/06-timing-exceptions-priority]]
- 工具篇：[[vault-notes/fpga/vivado/base/09-reports-timing-verdict]]｜[[vault-notes/fpga/vivado/base/06-xdc-pins-clocks]]
- 导读：[[vault-notes/fpga/sta/00-guide]]
