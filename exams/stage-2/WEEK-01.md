# 第 1 周能力测试：Java 环境、基础语法与数组

> 建议时间：60 分钟。
>
> 范围：JDK 与环境、基本类型与转换、运算符、`Scanner`、分支与循环、方法、数组与二维数组、调试、Java 与 C 的差异。
>
> 题目特点：共 33 题，以短答、代码阅读和找错为主；需要写代码的题写出关键代码即可。
>
> 可参考资料：自己的笔记和 JDK 文档。禁止使用 AI 工具和搜索引擎。

## 一、答题要求

- 按顺序作答，概念题回答核心意思即可，不要求背诵完整定义。
- 代码题优先写出最终输出、报错类型或关键代码。
- 如果问“为什么”，请用一两句话说明原因。
- 不确定的题目写“不确定”，不要编造。

示例：

```md
1. 问：`int` 和 `long` 的主要区别是什么？
   答：`int` 通常占 4 字节，`long` 占 8 字节，`long` 字面量需要加 `L`。
```

---

## 二、环境与运行（1-5 题）

### 1. JDK、JRE、JVM 分别是什么？三者是什么关系？

答：

---

### 2. 写出编译和运行 `Hello.java` 的命令，并说明编译后生成什么文件。

答：

---

### 3. `main` 方法为什么需要 `static`？如果类中没有正确的 `main` 方法，运行时会怎样？

答：

---

### 4. 分别举一个编译错误、运行时错误和逻辑错误的例子。

答：

---

### 5. `Student.java` 中包含 `package com.example; public class Student {}`，源文件应放在什么目录？如果文件名写成 `student.java` 会怎样？

答：

---

## 三、类型、转换、运算符与输入（6-14 题）

### 6. 写出 Java 的八种基本数据类型。

答：

---

### 7. 写出下列字面量的类型：`10`、`10L`、`10.0`、`10.0f`、`'A'`、`"A"`、`true`。

答：

---

### 8. 下面代码输出什么？为什么？

```java
byte b = (byte) 130;
System.out.println(b);
```

答：

---

### 9. 已知 `int a = 7, b = 2;`，分别写出 `a / b`、`a % b`、`-a / b`、`-a % b` 的结果。

答：

---

### 10. 写出下面两行代码的输出结果。

```java
System.out.println(1 + 2 + "3");
System.out.println("1" + 2 + 3);
```

答：

---

### 11. 下面代码能编译吗？如果不能，如何修改？修改后输出什么？

```java
char c = 'A';
c = c + 1;
System.out.println(c);
```

答：

---

### 12. 为什么连续调用 `nextInt()` 和 `nextLine()` 时，`nextLine()` 可能读到空字符串？写出一种修复方式。

答：

---

### 13. 下面代码执行后，`i`、`a`、`b` 的值分别是多少？

```java
int i = 1;
int a = i++;
int b = ++i;
```

答：

---

### 14. 下面两个表达式的值是什么？会不会抛出异常？说明原因。

```java
boolean x = false && (1 / 0 == 0);
boolean y = true || (1 / 0 == 0);
```

答：

---

## 四、分支与循环（15-21 题）

### 15. `if (1) { }` 能编译吗？为什么？把它改成判断整数 `x` 等于 1 的写法。

答：

---

### 16. `switch` 可以接收哪些类型？如果某个 `case` 后没有写 `break` 会发生什么？`default` 什么时候执行？

答：

---

### 17. 下面代码执行后，循环体执行多少次？`sum` 是多少？

```java
int sum = 0;
for (int i = 1; i <= 5; i++) {
    sum += i;
}
System.out.println(sum);
```

答：

---

### 18. `while` 和 `do...while` 的主要区别是什么？

答：

---

### 19. `break` 和 `continue` 分别有什么作用？在嵌套循环中默认影响哪一层？

答：

---

### 20. 使用 `Random` 生成 `[10, 20]` 区间内的整数，写出表达式。

答：

---

### 21. 写出下面代码的输出结果，并说明 `continue` 和 `break` 分别在哪一次循环中生效。

```java
int sum = 0;
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue;
    }
    sum += i;
    if (sum > 10) {
        break;
    }
}
System.out.println(sum);
```

答：

---

## 五、方法与值传递（22-25 题）

### 22. 判断下面两组方法是否构成重载，并说明理由。

```java
int f(int x) { return x; }
double f(int x) { return x; }
```

```java
int g(int x) { return x; }
int g(long x) { return (int) x; }
```

答：

---

### 23. 下面代码输出什么？为什么交换方法没有改变 `main` 中的变量？

```java
static void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

public static void main(String[] args) {
    int x = 1;
    int y = 2;
    swap(x, y);
    System.out.println(x + " " + y);
}
```

答：

---

### 24. 下面代码输出什么？分别解释 `change` 和 `reassign` 对数组的影响。

```java
static void change(int[] arr) {
    arr[0] = 99;
}

static void reassign(int[] arr) {
    arr = new int[]{7};
}

public static void main(String[] args) {
    int[] a = {1, 2};
    change(a);
    reassign(a);
    System.out.println(a[0]);
}
```

答：

---

### 25. 下面方法能编译吗？如果不能，如何修改？

```java
static int max(int a, int b) {
    if (a > b) {
        return a;
    }
}
```

答：

---

## 六、数组与二维数组（26-30 题）

### 26. 写出 `new int[3]`、`new boolean[3]`、`new String[3]` 中各元素的默认值，以及它们的 `length`。

答：

---

### 27. 下面代码会发生什么？数组的合法下标范围是什么？

```java
int[] a = {1, 2, 3};
a[3] = 4;
```

答：

---

### 28. 写出将一维数组原地反转的关键代码，并说明为什么需要临时变量。

答：

---

### 29. 对数组 `{5, 3, 8, 1}` 进行升序冒泡排序，第一轮完整遍历后数组是什么？

答：

---

### 30. 写出下面代码的输出，并说明什么是“不规则二维数组”。

```java
int[][] scores = {{90, 80}, {70, 60, 50}};
System.out.println(scores.length);
System.out.println(scores[1].length);
```

答：

---

## 七、Java 与 C 的差异、调试与找错（31-33 题）

### 31. 写出 Java 与 C 的至少四个差异，涉及布尔类型、字符、字符串、数组或方法传参中的任意方面。

答：

---

### 32. 调试时 `step over` 和 `step into` 有什么区别？如果一个循环算出的 `sum` 不对，你会如何定位？

答：

---

### 33. 下面代码运行时会报什么错？原因是什么？请写出修正后的循环。

```java
int[] arr = new int[3];
for (int i = 1; i <= arr.length; i++) {
    arr[i] = i;
}
```

答：

---
