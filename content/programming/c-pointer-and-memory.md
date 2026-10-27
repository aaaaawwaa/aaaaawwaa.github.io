---
title: C 指针与内存
description: 从指针算术与数组退化讲到栈堆区别、嵌入式寄存器映射与 volatile，附可编译的 C 代码示例。
tags:
  - programming
  - c
  - memory-management
---

## 指针就是一个地址

指针变量存储的是内存地址，类型决定了从这个地址读多少字节以及如何解释。指针算术会自动按元素大小缩放：

$$
\mathrm{addr}(p+i)=\mathrm{addr}(p)+i\cdot\mathrm{sizeof}(T)
$$

这条规则解释了为什么 `int *p; p+1` 跳 4 个字节，而 `char *q; q+1` 只跳 1 个字节。

## 指针与数组

数组名在大多数表达式中退化为首元素地址，因此 `p[i]` 与 `*(p+i)` 完全等价。理解这一点后，函数传数组实际上是传指针，函数内部无法通过 `sizeof` 得到数组长度。

```c
#include <stddef.h>
#include <stdint.h>

void scale(int32_t *buf, size_t n, int32_t k) {
    for (size_t i = 0; i < n; ++i) {
        *(buf + i) *= k;            // 与 buf[i] *= k 完全等价
    }
}

int main(void) {
    int32_t data[4] = {1, 2, 3, 4};
    int32_t *p = data;              // 数组名退化为首元素地址
    scale(p, 4, 2);
    return (p[3] == 8) ? 0 : 1;     // 返回 0 表示符合预期
}
```

## 栈、堆与生命周期

- **栈（stack）**：由编译器自动分配释放，函数返回即失效。局部数组、临时变量都在这里。栈空间通常很小（嵌入式系统可能只有几 KB）。
- **堆（heap）**：由 `malloc`/`free` 手动管理，生命周期由程序员控制，容易泄漏或碎片化。嵌入式项目中通常建议静态分配或使用内存池。

> [!warning] 千万不要返回局部变量的地址
> 函数返回后栈帧被回收，指向局部变量的指针立刻变成悬空指针。这类 bug 往往在编译器优化等级改变后才暴露。

## 嵌入式：把寄存器当地址

MCU 的外设寄存器被映射到固定地址上，标准库里的 `GPIOA->ODR` 本质上就是这个写法。以 STM32F103 的 GPIOA 为例，基地址为 `0x40010800`，`CRL` 位于偏移 `0x00`，`ODR` 位于偏移 `0x0C`：

```c
#include <stdint.h>

#define GPIOA_BASE   0x40010800UL
#define GPIOA_CRL    (*(volatile uint32_t *)(GPIOA_BASE + 0x00))
#define GPIOA_ODR    (*(volatile uint32_t *)(GPIOA_BASE + 0x0C))

void led_init(void) {
    GPIOA_CRL &= ~(0xFUL << 4);     // 清除 PA1 的配置位
    GPIOA_CRL |=  (0x3UL << 4);     // PA1：推挽输出，50 MHz
}

void led_on(void)  { GPIOA_ODR &= ~(1UL << 1); }   // 低电平点亮
void led_off(void) { GPIOA_ODR |=  (1UL << 1); }
```

`volatile` 的作用是告诉编译器"这个值可能在程序之外被改变，每次都必须真正读写内存"，禁止把它缓存在寄存器中。中断服务程序与主循环共享的变量、以及所有外设寄存器，都必须加 `volatile`。

## 四个高频错误

> [!warning] 逐个记住
> 1. **野指针**：指针未初始化就使用；声明时立即置 `NULL` 并检查。
> 2. **越界访问**：数组下标超出范围，C 不做边界检查，栈溢出可能直接跑飞。
> 3. **悬空指针**：`free` 之后继续使用，应立即把指针置 `NULL`。
> 4. **忘记 `volatile`**：中断里修改的标志位被编译器优化掉，表现为"死循环等不到标志"。

## 相关阅读

- [[Programming/Python-NumPy-DSP|Python NumPy 与 DSP]]
- [[Digital-Systems/Verilog-Sequential-Logic|Verilog 时序逻辑]]
- [[Projects/UART-Loopback-Project|UART 回环项目]]
