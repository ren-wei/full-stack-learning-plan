# 第 6 周：Maven、JUnit 与集合进阶

## 本周目标

本周用前 3 天把项目工程化，用后 3 天把集合从“会用”提升到“会选、会组合”。完成后，应能够：

- 说明 Maven 的作用、坐标和标准目录结构，并执行常用生命周期命令
- 使用 JUnit 为核心业务方法编写单元测试
- 使用日志替代散落的 `System.out.println()`
- 把第 5 周的项目迁移为 Maven 工程并打出可运行 jar
- 说明 Map 三种实现的区别，并使用集合嵌套组织多层数据
- 使用 `Comparable` 和 `Comparator` 实现多字段排序
- 使用 `Collections` 工具类和 commons-io 简化代码

## 学习资料与范围

- 主课程：[Java 零基础视频教程（下部）](https://www.bilibili.com/video/BV17F411T7Ao)
- 视频范围：下部 JUnit 与集合进阶章节；Maven 参考视频待定

Maven 确定课程后再补充章节映射，也可以直接参考 Maven 官方文档；日志不在课程范围内，参考所用日志框架文档即可。下部 IO 章节中与第 5 周重复的部分（异常、File、字节流、字符流、缓冲流、序列化）直接跳过，只补递归遍历、打印流和 commons-io。

| 学习模块 | 学习结果 |
| --- | --- |
| Maven 坐标、仓库、依赖与标准目录结构 | 能够为新项目引入第三方依赖 |
| Maven 生命周期、常用命令与打包插件 | 能够编译、测试、打包并独立运行 |
| JUnit 5 注解、断言与测试用例设计 | 能够为业务方法编写可重复执行的测试 |
| 日志级别与文件输出 | 能够用日志记录程序运行信息 |
| Map 体系与常用实现类 | 能够按需求选择合适的 Map 实现 |
| Set 进阶、集合嵌套与集合工具类 | 能够去重、分组并使用 `Collections` |
| `Comparable` 与 `Comparator` | 能够实现单字段和多字段排序 |
| 递归、打印流与 commons-io | 能够用更少的代码完成文件操作 |

本周任务量较大。如果时间不够，把 `TreeMap` 和 `Set` 进阶的练习顺延到第 7 周，但 Maven 和 JUnit 必须当周完成，否则后面的项目改造没有基础。

## 需要掌握的知识点

### Maven

- Maven 解决的问题：依赖管理、统一目录结构、统一构建流程
- `groupId`、`artifactId`、`version` 坐标，本地仓库、中央仓库和镜像
- `pom.xml` 常用标签，依赖的 `compile`、`test`、`provided` 作用范围
- 标准结构 `src/main/java`、`src/main/resources`、`src/test/java`
- `clean`、`compile`、`test`、`package` 的执行顺序和作用
- 打包插件生成可执行 jar，并在项目目录外运行
- 使用属性统一管理版本号，通过 `.gitignore` 排除 `target` 目录

### 单元测试与日志

- 单元测试的价值：改动后快速回归，不再手工重复点菜单
- `@Test`、`@BeforeEach`、`@AfterEach`、`@DisplayName`
- `assertEquals`、`assertTrue`、`assertNull`、`assertThrows` 等断言
- 测试用例设计：正常值、边界值、异常值
- `assertThrows` 验证自定义异常，测试之间保持独立
- 日志级别 `trace`、`debug`、`info`、`warn`、`error`
- SLF4J 加日志实现的基本配置，输出到控制台和文件
- 日志写关键参数，替换大部分调试输出

### 集合进阶

- `HashMap`、`LinkedHashMap`、`TreeMap` 对键顺序的处理差异
- 键对象的 `hashCode()` 与 `equals()` 约定
- `getOrDefault()`、`computeIfAbsent()` 在分组统计中的用法
- `HashSet`、`LinkedHashSet`、`TreeSet` 的特点和适用场景
- 集合嵌套：`Map<String, List<Student>>` 的表达能力和嵌套过深的风险
- `Comparable` 的自然排序与 `Comparator` 的外部排序
- `Comparator.comparing()`、`thenComparing()`、`reversed()` 链式写法
- 比较器提取为常量或工具类，避免重复代码
- `Collections` 的排序、最值、反转和不可变包装
- commons-io 的 `FileUtils`、`IOUtils` 与手写流代码的对比

## 必做任务

1. 创建 Maven 项目，完成 `clean`、`compile`、`package` 并记录输出。
2. 在 `pom.xml` 引入 JUnit 5 和日志依赖，说明每个依赖的作用范围。
3. 把第 5 周项目迁移到标准目录结构，检查类、配置和数据文件位置。
4. 为 `StudentService` 编写单元测试，覆盖正常、边界和异常三类用例。
5. 使用 `assertThrows` 验证 `StudentNotFoundException` 和 `DuplicateStudentIdException`。
6. 在业务层和持久化层接入日志，配置输出到文件。
7. 生成可执行 jar，在项目目录外运行并完成一次完整操作。
8. 使用 Git 新建功能分支完成“日志接入”，合并回主分支。
9. 对比 `HashMap`、`LinkedHashMap`、`TreeMap` 保存同一批学生时的输出顺序。
10. 使用 `Comparator` 链式写法实现总分降序、学号升序排序。
11. 使用 `computeIfAbsent()` 把学生按班级分组为 `Map<String, List<Student>>`。
12. 使用 `Set` 对学生去重，并说明必须重写 `hashCode()` 和 `equals()` 的原因。
13. 使用 `Collections` 完成排序与不可变包装，使用 commons-io 替换手写流代码。

## 本周综合任务：项目工程化与数据层重构

在第 5 周项目基础上完成工程化改造和数据层重构，不新增业务功能。

要求：

- 项目改为标准 Maven 目录结构，`mvn package` 能够成功
- 依赖集中写在 `pom.xml`，不手动下载 jar 包
- 为 `service` 层核心方法补充单元测试，覆盖正常、边界和异常用例
- 使用日志记录启动、数据加载、数据保存和关键业务操作
- 使用 `Map<String, Student>` 学号索引替换遍历查找
- 使用集合嵌套实现按班级分组，输出班级人数和平均分
- 把排序规则提取为 `Comparator` 常量，供多处复用
- 使用 commons-io 和 `Properties` 替换手写的文件读写与配置代码
- 更新 README，补充构建命令、运行命令和测试命令

## 本周产出

- Maven 化后的项目源码、`pom.xml` 和可执行 jar
- JUnit 测试类与测试结果
- 日志配置文件与运行日志
- 集合进阶练习代码与重构后的数据层
- 一份 Maven 常用命令、JUnit 断言和集合选择速查笔记

## 完成检查

- [ ] 能够说明 Maven 坐标、仓库和依赖范围的作用
- [ ] 能够执行生命周期命令并打包独立运行
- [ ] 能够为业务方法编写可重复执行的单元测试
- [ ] 能够使用日志替代调试输出并输出日志文件
- [ ] 能够说明三种 Map 实现和三种 Set 实现的适用场景
- [ ] 能够使用集合嵌套表达多层数据并控制嵌套层数
- [ ] 能够使用 `Comparable` 和 `Comparator` 完成多字段排序
- [ ] 能够使用 `Collections` 和 commons-io 简化代码
- [ ] 已完成项目 Maven 化与数据层重构，单元测试全部通过
