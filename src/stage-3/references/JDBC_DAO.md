# 参考：JDBC 与 DAO 分层

> 本文件原为阶段二周计划，现作为阶段三（后端进阶）参考素材保留，对应阶段三第 2 周。数据库主线为 PostgreSQL 16；MySQL 只在文末做常用差异对照。详细周计划确定后再正式改写。

## 学习目标

让 Java 程序真正和数据库交互。完成后，应能够：

- 使用 JDBC 完成数据库连接、执行 SQL 和处理结果集
- 使用 `PreparedStatement` 完成参数化查询，避免 SQL 注入
- 使用配置文件管理数据库连接参数
- 封装 JDBC 工具类，使用连接池管理连接
- 使用 DAO 分层完成实体与数据表的映射
- 使用事务处理一组需要同时成功的操作
- 把文件持久化替换为 PostgreSQL 16 持久化

## 学习资料与范围

- 主课程：参考视频待定（JDBC、连接池与 DAO 分层）
- 视频范围：待补充

确定课程后，把下面的知识模块映射到具体视频章节。

| 学习模块 | 学习结果 |
| --- | --- |
| JDBC 简介与固定步骤 | 能够完成一次数据库访问 |
| `DriverManager` 与 `Connection` | 能够建立和释放数据库连接 |
| `Statement`、`PreparedStatement`、`ResultSet` | 能够执行 SQL 并读取结果 |
| SQL 注入与参数化查询 | 能够编写安全的查询语句 |
| JDBC 事务 | 能够提交和回滚一组操作 |
| 连接池与配置文件 | 能够使用连接池提高性能 |
| 工具类与 DAO 封装 | 能够分层组织数据访问代码 |
| 批量操作与异常处理 | 能够高效写入并统一处理异常 |

## 需要掌握的知识点

### PostgreSQL 连接准备

- 使用第 1 周创建的 `student_db` 和 `student_app` 账号，连接本机 PostgreSQL 16 实例
- 通过 Maven 引入 PostgreSQL 官方 JDBC 驱动，版本以当前稳定版为准：

```xml
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <version>42.7.4</version>
  <scope>runtime</scope>
</dependency>
```

- 驱动类为 `org.postgresql.Driver`，连接 URL 为 `jdbc:postgresql://localhost:5432/student_db`
- 用户名和密码单独传入，不要拼进 URL；生产环境的连接串还要按部署要求配置 SSL、超时和连接数
- PostgreSQL 的连接参数使用 `?sslmode=require&connectTimeout=5` 这类形式；本地练习先使用最简 URL
- 插入后需要生成主键时，优先使用 `returning id`，不要依赖数据库方言的“自增键”接口

`returning` 的基本写法：

```java
String sql = "INSERT INTO student (student_no, name) VALUES (?, ?) RETURNING id";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, studentNo);
    ps.setString(2, name);
    try (ResultSet rs = ps.executeQuery()) {
        rs.next();
        long id = rs.getLong("id");
    }
}
```

注意：执行 `returning` 的语句要调用 `executeQuery()`；调用 `executeUpdate()` 会丢弃返回结果。

### JDBC 基础

- JDBC 的作用：用统一接口访问不同数据库
- 数据库驱动的引入方式（通过 Maven 依赖引入）和版本匹配
- JDBC 固定步骤：加载驱动、获取连接、创建语句对象、执行 SQL、处理结果、释放资源
- 连接 URL、用户名、密码的组成，以及 `sslmode`、`connectTimeout`、`ApplicationName` 等常见参数
- `Statement` 与 `PreparedStatement` 的区别
- `executeQuery()`、`executeUpdate()` 的返回值和适用场景
- `ResultSet` 的遍历方式、列索引与列名的选择，以及 `getInt()`、`getLong()`、`getString()`、`getObject()` 的使用
- `timestamptz` 字段优先用 `getObject("created_at", OffsetDateTime.class)` 读取，写入时使用 `setObject`，不要用会丢时区信息的 `getDate()`
- `count(*)` 返回 `bigint`，Java 侧使用 `getLong()` 读取

### 安全与事务

- SQL 注入的产生原理，以及字符串拼接 SQL 的风险
- 使用 `?` 占位符和 `setXxx()` 传参的完整写法
- 使用 `PreparedStatement` 完成带条件的查询和模糊查询
- `setAutoCommit(false)`、`commit()`、`rollback()` 的配合使用
- 事务中异常回滚、正常提交的完整结构
- 事务范围应放在 `service` 层的原因

### 连接池与工具类

- 直接创建连接的开销和连接池的作用
- 常用连接池（如 Druid、HikariCP）的基本配置
- 把连接参数写入 `properties` 配置文件并通过类加载器读取
- 封装 `JdbcUtils`：获取连接、释放连接、事务相关方法
- 使用 `try-with-resources` 或工具方法保证资源释放
- 面向接口编程：`StudentDao` 接口加 `StudentDaoImpl` 实现

### DAO 分层

- 实体类与数据表字段的映射规则
- 使用 `ResultSet` 组装实体对象
- 把结果集映射逻辑集中到一个方法中，避免重复代码
- 插入后通过 `returning id` 获取生成的主键
- 批量插入、批量删除的实现方式
- DAO 只负责数据访问，不写业务规则
- 数据库异常转换为业务异常的做法

## 必做练习

1. **第一个 JDBC 程序**：连接 PostgreSQL 16，查询学生表中的全部记录并输出。
2. **模拟登录**：分别使用字符串拼接和 `PreparedStatement` 实现登录验证，并用注入示例对比结果。
3. **参数化查询**：使用 `PreparedStatement` 实现按学号查询、按姓名模糊查询。
4. **新增与删除**：实现新增学生并取回生成的主键，按学号删除并输出受影响行数。
5. **结果集映射**：编写 `mapRow(ResultSet)` 方法，把一行记录转换成 `Student` 对象。
6. **日期处理**：读取并写入 `timestamptz` 字段，使用 `OffsetDateTime` 与 `setObject` / `getObject`，说明为什么不用 `java.sql.Date` 保存带时区时间。
7. **工具类封装**：编写 `JdbcUtils`，从配置文件读取 URL、用户名、密码并返回连接。
8. **连接池**：引入连接池依赖，替换直接创建连接的方式，并对比执行多次查询的耗时。
9. **事务练习**：实现课程成绩的批量导入，出现任何一条错误时全部回滚。
10. **批量操作**：使用 `addBatch()` 和 `executeBatch()` 插入 100 条测试数据并统计耗时。
11. **异常处理**：把 `SQLException` 转换为自定义的 `DataAccessException`，在 `main` 中给出可读提示。
12. **分页查询**：使用 `limit ? offset ?` 完成分页查询，统计总数时使用 `getLong()`。
13. **主键返回**：新增学生后使用 `returning id` 取回主键，对比 MySQL 的 `getGeneratedKeys()` 写法。

## 综合任务：实现数据访问层

把学生信息管理系统的持久化从文件改为 PostgreSQL 16，并保持业务逻辑不变。

要求：

- 使用 Maven 引入 PostgreSQL 驱动和连接池依赖
- 数据库连接参数写入配置文件，不在代码中硬编码用户名和密码
- 定义 `StudentDao` 接口，提供 `insert`、`deleteById`、`update`、`findById`、`findAll`、`findByName`、`countByClass` 等方法
- 使用实现类完成全部方法，查询统一使用 `PreparedStatement`
- 新增学生使用 `insert ... returning id` 并返回生成的主键
- 分页查询使用 `order by ... limit ? offset ?`，总数使用 `count(*)` 和 `getLong()`
- 时间字段使用 `timestamptz`，Java 侧使用 `OffsetDateTime` 读写
- 使用连接池获取连接，所有连接、语句和结果集必须正确释放
- 在 `service` 层实现业务规则，`dao` 层只负责数据访问
- 为需要保证一致性的操作（如批量导入、删除学生及其成绩）添加事务
- 修改 `ui` 层的调用方式，使控制台操作直接读写数据库
- 为 DAO 的关键方法编写单元测试或提供可重复执行的验证脚本
- 更新 README，补充数据库配置、建表脚本和执行顺序说明

## 产出

- JDBC 基础练习代码
- `JdbcUtils` 工具类和数据库配置文件
- `StudentDao` 接口、实现类及测试记录
- 事务和批量操作验证记录
- 改造后的项目源码
- 一份 JDBC 固定步骤、PostgreSQL 连接要点和常见异常速查笔记

## 完成检查

- [ ] 能够独立完成 JDBC 的固定步骤
- [ ] 能够使用 `PreparedStatement` 避免 SQL 注入
- [ ] 能够把结果集正确映射为实体对象
- [ ] 能够使用 `returning id` 获取生成的主键
- [ ] 能够使用连接池管理数据库连接
- [ ] 能够把连接参数写入配置文件读取
- [ ] 能够封装 JDBC 工具类并统一释放资源
- [ ] 能够按 DAO 模式组织数据访问代码
- [ ] 能够使用事务提交或回滚一组数据库操作
- [ ] 已完成数据访问层改造，数据库异常不会导致程序直接崩溃
- [ ] 能够说出 PostgreSQL 与 MySQL 在驱动、分页和返回主键上的差异（补充）

## MySQL 补充：只做差异对照

已有 MySQL 项目需要维护时，替换驱动和下面几处写法即可，不需要重新学一套 JDBC：

| 场景 | PostgreSQL 16（主线） | MySQL 8（补充） |
| --- | --- | --- |
| 驱动依赖 | `org.postgresql:postgresql` | `com.mysql:mysql-connector-j` |
| 驱动类 | `org.postgresql.Driver` | `com.mysql.cj.jdbc.Driver` |
| 连接 URL | `jdbc:postgresql://localhost:5432/student_db` | `jdbc:mysql://localhost:3306/student_db` |
| 插入后取主键 | `insert ... returning id` + `executeQuery()` | `getGeneratedKeys()` |
| 分页 | `limit ? offset ?` | `limit ?, ?` |
| 布尔值 | `boolean` + `getBoolean()` | `tinyint(1)` + `getBoolean()` |

连接池、`PreparedStatement`、事务、DAO 分层和资源释放的写法在两种数据库上基本一致，迁移时重点检查 SQL 方言和类型映射。
