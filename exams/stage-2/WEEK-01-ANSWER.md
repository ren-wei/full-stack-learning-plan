# 第 1 周能力测试：Java 环境、基础语法与数组（参考答案）

> 建议时间：60 分钟。
>
> 范围：JDK 与环境、基本类型与转换、运算符、`Scanner`、分支与循环、方法、数组与二维数组、调试、Java 与 C 的差异。
>
> 使用方式：先独立完成题目，再对照答案；代码题重点看结果和原因，不要求与参考答案逐字一致。

## 二、环境与运行（1-5 题）

### 1. JDK、JRE、JVM 分别是什么？三者是什么关系？

参考答案：JDK 是 Java 开发工具包，包含编译器、运行工具和 JRE；JRE 是 Java 运行环境，包含 JVM 和核心类库；JVM 负责执行 Java 字节码。关系可以记为 JDK 包含 JRE，JRE 包含 JVM。

---

### 2. 写出编译和运行 `Hello.java` 的命令，并说明编译后生成什么文件。

参考答案：

```bash
javac Hello.java
java Hello
```

编译后生成 `Hello.class`。运行命令写类名 `Hello`，不加 `.class` 后缀。

---

### 3. `main` 方法为什么需要 `static`？如果类中没有正确的 `main` 方法，运行时会怎样？

参考答案：JVM 启动时直接通过类调用入口方法，不需要先创建对象，所以 `main` 必须是 `static`。如果没有正确的 `main` 方法，运行时会报找不到主方法，提示类似 `Main method not found`。

---

### 4. 分别举一个编译错误、运行时错误和逻辑错误的例子。

参考答案：

- 编译错误：语句末尾缺少分号，或者变量类型不匹配。
- 运行时错误：执行 `1 / 0`，或者访问数组越界下标。
- 逻辑错误：程序能运行，但平均分公式写错，导致结果不符合预期。

---

### 5. `Student.java` 中包含 `package com.example; public class Student {}`，源文件应放在什么目录？如果文件名写成 `student.java` 会怎样？

参考答案：源文件应放在 `com/example/Student.java`。Java 的公开类名必须与文件名大小写一致，写成 `student.java` 会导致编译错误。包声明也应与目录结构对应。

---

## 三、类型、转换、运算符与输入（6-14 题）

### 6. 写出 Java 的八种基本数据类型。

参考答案：`byte`、`short`、`int`、`long`、`float`、`double`、`char`、`boolean`。

---

### 7. 写出下列字面量的类型：`10`、`10L`、`10.0`、`10.0f`、`'A'`、`"A"`、`true`。

参考答案：

- `10`：`int`
- `10L`：`long`
- `10.0`：`double`
- `10.0f`：`float`
- `'A'`：`char`
- `"A"`：`String`
- `true`：`boolean`

---

### 8. 下面代码输出什么？为什么？

```java
byte b = (byte) 130;
System.out.println(b);
```

参考答案：输出 `-126`。`130` 是 `int` 字面量，强制转换成 `byte` 时只保留低 8 位；`byte` 是有符号类型，最高位为 1 时按补码解释为负数。

---

### 9. 已知 `int a = 7, b = 2;`，分别写出 `a / b`、`a % b`、`-a / b`、`-a % b` 的结果。

参考答案：`3`、`1`、`-3`、`-1`。整数除法向零截断，余数的符号与被除数一致。

---

### 10. 写出下面两行代码的输出结果。

```java
System.out.println(1 + 2 + "3");
System.out.println("1" + 2 + 3);
```

参考答案：第一行输出 `33`，第二行输出 `123`。表达式从左到右计算，遇到字符串后，后续的 `+` 变成字符串拼接。

---

### 11. 下面代码能编译吗？如果不能，如何修改？修改后输出什么？

```java
char c = 'A';
c = c + 1;
System.out.println(c);
```

参考答案：不能编译。`char + int` 的结果类型是 `int`，不能直接赋给 `char`。修改为：

```java
c = (char) (c + 1);
```

输出 `B`。

---

### 12. 为什么连续调用 `nextInt()` 和 `nextLine()` 时，`nextLine()` 可能读到空字符串？写出一种修复方式。

参考答案：`nextInt()` 只读取整数，不消费整数后面的换行符；紧接着调用 `nextLine()` 会先读到这个残留换行，因此返回空字符串。可以在 `nextInt()` 后额外调用一次 `nextLine()` 消费换行，或者统一用 `nextLine()` 读取后再转换成整数。

---

### 13. 下面代码执行后，`i`、`a`、`b` 的值分别是多少？

```java
int i = 1;
int a = i++;
int b = ++i;
```

参考答案：`i = 3`、`a = 1`、`b = 3`。`i++` 先取值为 1 再自增；之后 `++i` 先把 `i` 加到 3，再取值赋给 `b`。

---

### 14. 下面两个表达式的值是什么？会不会抛出异常？说明原因。

```java
boolean x = false && (1 / 0 == 0);
boolean y = true || (1 / 0 == 0);
```

参考答案：`x` 是 `false`，`y` 是 `true`，都不会抛出异常。`&&` 和 `||` 具有短路特性：左边已经能确定结果时，右边不会执行。

---

## 四、分支与循环（15-21 题）

### 15. `if (1) { }` 能编译吗？为什么？把它改成判断整数 `x` 等于 1 的写法。

参考答案：不能编译。Java 的 `if` 条件必须是 `boolean` 类型，不能用 `0` 和 `1` 代替。应写成 `if (x == 1) { }`。

---

### 16. `switch` 可以接收哪些类型？如果某个 `case` 后没有写 `break` 会发生什么？`default` 什么时候执行？

参考答案：`switch` 可用于 `byte`、`short`、`char`、`int`（以及对应的包装类型）、`String` 和枚举，不支持 `long`、`float`、`double`、`boolean`。没有 `break` 会发生 case 穿透，继续执行后面的 case；`default` 在没有 case 匹配时执行。

---

### 17. 下面代码执行后，循环体执行多少次？`sum` 是多少？

```java
int sum = 0;
for (int i = 1; i <= 5; i++) {
    sum += i;
}
System.out.println(sum);
```

参考答案：循环体执行 5 次，`sum` 为 15。

---

### 18. `while` 和 `do...while` 的主要区别是什么？

参考答案：`while` 先判断条件再执行循环体，条件一开始为假时可能一次都不执行；`do...while` 先执行一次循环体，再判断条件，因此至少执行一次。

---

### 19. `break` 和 `continue` 分别有什么作用？在嵌套循环中默认影响哪一层？

参考答案：`break` 结束最近的一层循环或 `switch`；`continue` 跳过当前这一轮循环，继续下一轮。默认只影响它们所在的最内层循环，除非使用带标签的循环。

---

### 20. 使用 `Random` 生成 `[10, 20]` 区间内的整数，写出表达式。

参考答案：

```java
Random random = new Random();
int value = random.nextInt(11) + 10;
```

`nextInt(bound)` 的上界不包含在结果中，所以区间长度是 `20 - 10 + 1 = 11`。

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

参考答案：输出 `16`。偶数轮执行 `continue`；累加到 `1 + 3 + 5 + 7 = 16` 时，`sum > 10`，执行 `break` 结束循环。

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

参考答案：第一组不构成重载，因为参数列表相同，只有返回值不同，编译器无法根据返回值区分调用。第二组构成重载，因为参数类型不同（`int` 和 `long`）。

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

参考答案：输出 `1 2`。Java 基本类型参数是值传递，`swap` 拿到的是 `x` 和 `y` 的副本，交换只影响局部变量，不影响 `main` 中的原变量。

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

参考答案：输出 `99`。`change` 通过引用副本修改了数组对象本身；`reassign` 只是把局部参数 `arr` 指向一个新数组，没有改变 `main` 中的 `a` 引用。

---

### 25. 下面方法能编译吗？如果不能，如何修改？

```java
static int max(int a, int b) {
    if (a > b) {
        return a;
    }
}
```

参考答案：不能编译，因为并非所有执行路径都有返回值。可以修改为：

```java
static int max(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}
```

---

## 六、数组与二维数组（26-30 题）

### 26. 写出 `new int[3]`、`new boolean[3]`、`new String[3]` 中各元素的默认值，以及它们的 `length`。

参考答案：`int` 数组元素默认是 `0`，`boolean` 数组默认是 `false`，`String` 数组默认是 `null`；三个数组的 `length` 都是 3。

---

### 27. 下面代码会发生什么？数组的合法下标范围是什么？

```java
int[] a = {1, 2, 3};
a[3] = 4;
```

参考答案：会抛出 `ArrayIndexOutOfBoundsException`。长度为 3 的数组合法下标是 `0`、`1`、`2`，不包含 3。

---

### 28. 写出将一维数组原地反转的关键代码，并说明为什么需要临时变量。

参考答案：

```java
for (int i = 0; i < arr.length / 2; i++) {
    int temp = arr[i];
    arr[i] = arr[arr.length - 1 - i];
    arr[arr.length - 1 - i] = temp;
}
```

需要临时变量保存一侧的值，否则第一次赋值会覆盖原值，另一侧就无法得到正确数据。

---

### 29. 对数组 `{5, 3, 8, 1}` 进行升序冒泡排序，第一轮完整遍历后数组是什么？

参考答案：`{3, 5, 1, 8}`。第一轮比较会把当前最大值 8 移动到末尾。

---

### 30. 写出下面代码的输出，并说明什么是“不规则二维数组”。

```java
int[][] scores = {{90, 80}, {70, 60, 50}};
System.out.println(scores.length);
System.out.println(scores[1].length);
```

参考答案：输出 `2` 和 `3`。二维数组的每一行可以拥有不同的长度，这种结构称为不规则二维数组；`scores.length` 是行数，`scores[1].length` 是第二行的列数。

---

## 七、Java 与 C 的差异、调试与找错（31-33 题）

### 31. 写出 Java 与 C 的至少四个差异，涉及布尔类型、字符、字符串、数组或方法传参中的任意方面。

参考答案示例：

- Java 的 `boolean` 是独立类型，不能用 `0` 和 `1` 代替。
- Java 的 `char` 是 16 位 Unicode 字符，不是 C 中通常的 8 位字符。
- Java 字符串是 `String` 对象，比较内容应使用 `equals()`，不能用 `==` 判断内容相等。
- Java 数组是对象，使用 `length` 属性获取长度，没有 C 的指针运算和 `sizeof` 写法。
- Java 方法参数一律值传递；对象和数组传递的是引用的副本。

---

### 32. 调试时 `step over` 和 `step into` 有什么区别？如果一个循环算出的 `sum` 不对，你会如何定位？

参考答案：`step over` 执行当前行但不进入被调用方法内部；`step into` 会进入被调用的方法。定位循环问题时，可以在循环内设置断点，观察 `i`、循环条件和 `sum` 的变化，逐步执行并对照预期值，必要时查看调用栈和表达式。

---

### 33. 下面代码运行时会报什么错？原因是什么？请写出修正后的循环。

```java
int[] arr = new int[3];
for (int i = 1; i <= arr.length; i++) {
    arr[i] = i;
}
```

参考答案：会抛出 `ArrayIndexOutOfBoundsException`。数组下标最大是 `arr.length - 1`，当 `i` 等于 3 时越界；而且从 1 开始还跳过了下标 0。修正为：

```java
for (int i = 0; i < arr.length; i++) {
    arr[i] = i;
}
```
