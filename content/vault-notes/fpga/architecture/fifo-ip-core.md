---
title: "FIFO核"
type: concept
status: learning
subjects:
- FPGA
domains:
- 硬件实现
- 数字系统
tags:
- FPGA
- FIFO
- UART
- IP核
aliases: []
prerequisites: []
related: []
---

# FIFO IP核简介

FIFO(先入先出)，是一种数据缓冲器，用来实现数据先入先出的读写方式

FIFO存储器主要是用于缓存，应用在同步时钟系统和异步时钟系统中，在很多的设计中都会使用；如：多比特数据做跨时钟域处理，前后带宽不同步等都用到了FIFO

![[vault-notes/assets/fifo-ip-core/fig-01.png]]
*注1：如果A模块与B模块采用的是不同的时钟，那么A与B不能直接进行通信，这时候我们可以通过FIFO进行间接通信*

![[vault-notes/assets/fifo-ip-core/fig-02.png]]
*注2：如果A模块与B模块之间采用不同的位宽，那么A与B不能直接进行通信，这时候我们可以通过FIFO进行间接通信*

FIFO可以看作是传输管道，分为**写操作**和**读操作**
写操作 ： 时钟信号，写请求信号，写入数据
读操作 ： 时钟信号，读请求信号

以D1-D10为例
写入顺序： D1,D2,D3,D4,...,D10
读出顺序： D1,D2,D3,D4,...,D10

FIFO 根据读写时钟是否相同，分为同步FIFO(SCFIFO)和异步FIFO(DCFIFO)

# 同步FIFO IP核的调用

1. 寻找IP核名称 ： `FIFO Generator`
![[vault-notes/assets/fifo-ip-core/fig-03.png]]

2. 进行FIFO配置
![[vault-notes/assets/fifo-ip-core/fig-04.png]]

- Basic设置
	1. 可进行FIFO模块的命名，建议按照下面的命名方式：`scfifo_位宽*深度`
	2. 在`interface`中可以选择接口的类型，默认选择`Native`，后两个涉及`AXI`总线相关的内容，后续再进行补充
	3. 在`FIFP Implement`中可以选择部署FIFO的种类，==其中前四种属于同步FIFO，后三种属于异步FIFO==，这里给出列表说明可配置的FIFO分别具有什么功能，对应翻译如下：
		- `Non-symmetric aspect ratios (different read and write data widths)` : **非对称位宽（读写数据宽度不同）**
		- `First-Word Fall-Through` : **首字直通**（通常简称为 **FWFT** 模式）
		- `Uses Built-in FIFO primitives` : **使用内置 FIFO 原语**
		- `ECC support`: **ECC（纠错码）支持**
		- `Dynamic Error Injection`: **动态错误注入**
![[vault-notes/assets/fifo-ip-core/fig-05.png]]
- Native设置
	1. 如果选择块状存储器同步复位的FIFO，且想要使用ECC纠错功能，则需要保证读写位宽一致
	2. ECC功能包括硬件纠错和软件纠错两种,正常我们不需要勾选纠错
	3. `Read Mode`默认保持`Standard FIFO`,==在`stanard FIFO`下，读取会滞后一个时钟周期==，如果选择`First Word Fall Through`,则不会出现之后一个时钟周期的现象,即本截图最下面的`Read Latency`
	4. 读写数据位宽的匹配满足:`读数据位宽`\*`读数据深度` = `写数据位宽` \*`写数据深度`
	5. `Initialization`（初始化）选项包括复位接口`reset pin`,在勾选的情况下，会出现同步复位(`Synchronous Reset`)跟异步复位（`Asynchronous Reset`）两个选项；在勾选异步复位后，会出现`enable safety circuit`,提供输出的异步复位忙标志信号。==正常我们勾选同步复位即可==
	6. 有关输出寄存器`Output Register`,在标准FIFO模式下，勾选这个选项会增加对应的读潜伏期`Read Latency`(1到2个)；但是如果在`First Word Fall Through`这个模式下，则无论有没有勾选这个选项，他的读潜伏期都为0
![[vault-notes/assets/fifo-ip-core/fig-06.png]]
- Status Flag设置
	1. 基本的标志信号有`full`（满标志，表示已经写满）`empty`（空标志，表示已经读完）
	2. 在`Optional Flags`可以手动设置==将近满信号==和==将近空信号==,这两个信号可以在预定配置好的数值下提醒这个FIFO是否将要写满还是读完(默认不选择)
	3. 在`Hankshaking Options`中可以手动设置==写响应信号==(`Writing Acknowledge`)和==读响应信号==(`Read Acknowledge`);以及==溢出信号==(`Overflow`)和==读空信号==(`Underflow Flag`)，可选择在溢出或者读空的时候输出高电平或者低电平，通常我们默认不勾选即可
![[vault-notes/assets/fifo-ip-core/fig-07.png]]
- Data Count设置
	- 数据计数端口配置
		- 如果你的输入输出数据端口的位宽不一致，勾选`Data Count`后会出现分别配置输入输出计数的选项
		- 如果输入输出端口的位宽一致，那么仅勾选`Data Count`即可
![[vault-notes/assets/fifo-ip-core/fig-08.png]]
点击`Generate`生成对应的FIFO IP核即可，无需改变`Synthesis Option`的配置

# FIFO-IP核的调用

## 1. 创建顶层文件，例化FIFO IP模板
![[vault-notes/assets/fifo-ip-core/fig-09.png]]

```verilog
module scfifo
(
	input wire sys_clk,
	input wire sys_rst_n,
	input wire [7:0] d,
	input wire wr_en,
	input wire rd_en,

	output wire [7:0] dout,
	output wire full,
	output wire empty,
	output wire [7:0] data_count
);

scfifo_8x256 scififo_8x256_inst
(
	.clk  (sys_clk),
	.srst (~sys_clk_n),
	.din  (din),
	.wr_en (wr_en),
	.rd_en (rd_en),
	.dout (dout),
	.full (full),
	.empty (empty), 
	.data_count (data_count)
);


```