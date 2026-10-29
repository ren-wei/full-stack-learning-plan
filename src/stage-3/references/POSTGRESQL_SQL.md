# 参考：PostgreSQL 与 SQL 基础

> 本文件原为阶段二周计划，现作为阶段三（后端进阶）参考素材保留，对应阶段三第 1 周。本阶段数据库主线统一为 PostgreSQL 16；MySQL 只在文末做常用差异对照，不作为并行学习内容。详细周计划确定后再正式改写。

## 学习目标

把数据从文件搬到数据库。完成后，应能够：

- 安装并启动 PostgreSQL 16，使用 `psql` 或图形客户端连接数据库
- 使用 DDL 创建数据库、数据表和约束
- 使用 DML 完成插入、更新和删除，并取回生成的主键
- 使用 DQL 完成条件、排序、分页、聚合和分组查询
- 完成内连接、左连接和子查询
- 使用事务保证一组操作的完整性
- 为学生信息管理系统设计出合理的表结构

## 学习资料与范围

- 主课程：参考视频待定（PostgreSQL 与 SQL）
- 视频范围：待补充
- 官方文档：[PostgreSQL 16 Documentation](https://www.postgresql.org/docs/16/)

确定课程后，把下面的知识模块映射到具体视频章节。

| 学习模块 | 学习结果 |
| --- | --- |
| PostgreSQL 16 安装、服务启动与 `psql` 连接 | 能够连接并操作数据库 |
| 数据类型、DDL 建库建表与约束 | 能够设计并创建数据表 |
| `insert`、`update`、`delete` 与 `returning` | 能够维护表中的数据并取回结果 |
| `select`、`where`、`order by`、`limit` / `offset` | 能够完成基础查询 |
| 聚合函数、`group by`、`having` | 能够完成统计查询 |
| 多表查询与连接 | 能够查询关联数据 |
| 子查询与常用函数 | 能够完成较复杂的查询 |
| 事务与基础索引 | 能够保证数据一致性并了解索引作用 |

## 需要掌握的知识点

### 数据库与表

- 数据库、模式（schema）、表、行、列的关系；默认模式是 `public`
- 使用 `psql` 连接数据库，以及常用元命令：`\l`、`\c`、`\dt`、`\d+ 表名`、`\dn`、`\du`、`\q`
- 使用命令行连接：`psql -h localhost -p 5432 -U student_app -d student_db`
- 创建数据库和最小权限应用账号，不用 `postgres` 超级用户跑业务程序
- 常用数据类型：`integer`、`bigint`、`text`、`varchar(n)`、`boolean`、`numeric(p,s)`、`date`、`timestamptz`、`jsonb`、`uuid`
- 主键、生成列（identity）、非空、唯一、默认值、外键和 `check` 约束
- 使用 `create table`、`alter table`、`drop table` 管理表结构
- 标识符规则：不加双引号的名称会转成小写；需要保留大小写或使用关键字时用双引号；PostgreSQL 不使用反引号
- 字符串使用单引号；双引号只用于标识符，不能用来包字符串
- 业务时间优先使用 `timestamptz`，只表示日期时使用 `date`；金额和成绩使用 `numeric`，不要用浮点数
- 主键推荐 `bigint generated always as identity`，需要对外暴露的编号再单独生成，不直接暴露自增 ID
- 生产环境按最小权限授权；PostgreSQL 15 起 `public` 模式默认不再允许普通用户建表，需要显式授权

创建数据库和应用账号的最小示例。先以管理员账号连接到 `postgres` 库执行建库和建角色，再切换到新库授权：

```sql
CREATE DATABASE student_db WITH ENCODING 'UTF8' TEMPLATE template0;
CREATE ROLE student_app LOGIN PASSWORD 'change_me';
GRANT CONNECT ON DATABASE student_db TO student_app;

\c student_db
GRANT USAGE, CREATE ON SCHEMA public TO student_app;
```

创建表的最小示例：

```sql
CREATE TABLE student (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_no  varchar(20) NOT NULL UNIQUE,
  name        text NOT NULL,
  class_name  varchar(50),
  birthday    date,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

修改表结构：

```sql
ALTER TABLE student ADD COLUMN phone varchar(20);
ALTER TABLE student ALTER COLUMN class_name SET NOT NULL;
ALTER TABLE student DROP COLUMN phone;
DROP TABLE IF EXISTS student CASCADE;
```

`DROP TABLE ... CASCADE` 会连带删除依赖对象，只能在确认无影响时使用。

### SQL 基础

- `insert` 单行和多行插入，使用 `returning id` 取回生成的主键
- `update` 必须结合 `where` 精准修改，使用 `returning *` 检查修改结果，避免全表更新
- `delete` 结合 `where` 删除，使用 `returning *` 确认删除内容
- `delete` 与 `truncate` 的区别；`truncate` 速度快但会清空整表，执行前必须确认
- `select` 基本结构：字段、表名、条件、排序
- `where` 中的比较、逻辑、范围、模糊和空值判断
- `order by` 多字段排序、升降序和 `nulls first` / `nulls last`
- `limit` / `offset` 分页写法与偏移量计算
- 别名、去重和常用字符串、日期、数值函数
- 空值判断使用 `is null` / `is not null`，不能用 `= null`
- `like` 区分大小写，`ilike` 不区分大小写
- `coalesce` 处理空值，`now()` 获取当前时间，`date_trunc` 按天或按月截断时间

常见写法：

```sql
INSERT INTO student (student_no, name, class_name)
VALUES ('2026001', '张三', '一班')
RETURNING id, created_at;

UPDATE student
SET class_name = '二班'
WHERE student_no = '2026001'
RETURNING id, student_no, class_name;

DELETE FROM student
WHERE student_no = '2026001'
RETURNING id, student_no;

SELECT id, student_no, name, class_name
FROM student
WHERE class_name = '一班'
  AND name ILIKE '%张%'
ORDER BY id DESC
LIMIT 5 OFFSET 0;
```

插入冲突时可以使用 `on conflict`：

```sql
INSERT INTO student (student_no, name)
VALUES ('2026001', '张三')
ON CONFLICT (student_no) DO UPDATE
SET name = EXCLUDED.name;
```

### 统计与多表查询

- `count`、`sum`、`avg`、`max`、`min`；`count(*)` 返回 `bigint`
- `group by` 分组和 `having` 过滤分组结果
- `where` 在分组前过滤行，`having` 在分组后过滤组
- 查询中出现的非聚合字段必须放进 `group by`，PostgreSQL 会严格检查
- 内连接 `join` / `inner join` 与左连接 `left join`
- 一对多关系下统计结果出现重复行的原因，以及 `count(distinct ...)` 的用法
- 子查询：标量子查询、`in` 子查询、`exists` 子查询的基本用法
- 联表查询与多次单表查询的选择依据

```sql
SELECT class_name, count(*) AS student_count
FROM student
GROUP BY class_name
HAVING count(*) > 2
ORDER BY student_count DESC;
```

```sql
SELECT s.student_no, s.name, c.title, sc.score
FROM score sc
JOIN student s ON s.id = sc.student_id
JOIN course c ON c.id = sc.course_id
ORDER BY s.student_no, c.code;
```

### 事务与索引

- 事务的四个特性（原子性、一致性、隔离性、持久性）
- `begin`、`commit`、`rollback`，以及 `savepoint` / `rollback to savepoint`
- 事务在转账、批量导入等场景中的作用
- PostgreSQL 默认隔离级别是 `read committed`；需要时再了解更严格的级别
- 并发修改同一行时使用 `select ... for update` 锁定行，避免丢失更新
- 索引的作用和基本创建方式，默认使用 B-tree
- 主键索引、唯一索引、普通索引和联合索引
- PostgreSQL 的外键列不会自动创建索引，关联查询和级联删除常用的外键列需要手动建索引
- 索引不是越多越好的原因：会占用空间并拖慢写入
- 使用 `explain analyze` 观察执行计划，而不是凭感觉判断索引是否生效

```sql
CREATE INDEX idx_score_student_id ON score (student_id);
CREATE UNIQUE INDEX ux_student_no ON student (student_no);
CREATE INDEX idx_score_course_score ON score (course_id, score DESC);

EXPLAIN ANALYZE
SELECT * FROM score WHERE course_id = 1 ORDER BY score DESC LIMIT 10;
```

## 必做练习

1. **环境准备**：安装并启动 PostgreSQL 16，使用 `psql` 创建 `student_db` 数据库，确认数据库编码为 UTF8，并创建最小权限应用账号。
2. **建表**：创建 `student`、`course`、`score` 三张表，主键使用 identity，为学号、课程编号设置唯一约束，为成绩设置 0-100 的 `check` 约束。
3. **数据初始化**：向三张表插入至少 10 名学生、3 门课程和 20 条成绩记录。
4. **单表查询**：查询全部学生、按年龄排序、只查询前 5 条、查询指定班级的学生。
5. **条件查询**：查询成绩在 60-80 分之间的记录、使用 `ilike` 查询姓名包含“张”的学生、查询班级为空的学生。
6. **更新与删除**：修改指定学号学生的班级，删除一条指定成绩，使用 `returning` 输出变更结果，并说明如何避免误操作全表。
7. **聚合统计**：统计学生总数、每门课程的平均分、最高分和最低分。
8. **分组查询**：按班级统计人数，并只显示人数大于 2 的班级。
9. **多表查询**：查询每名学生的姓名、课程名和成绩，并输出每名学生的总分。
10. **子查询**：查询平均分高于全体平均分的学生，查询没有成绩记录的学生。
11. **分页查询**：按总分降序，每页 5 条，使用 `limit 5 offset 0` 和 `limit 5 offset 5` 输出第 1 页和第 2 页的结果。
12. **事务验证**：使用事务插入一组数据后回滚，验证数据未写入；再提交一次，验证数据已写入；额外用 `savepoint` 回滚其中一部分操作。
13. **索引验证**：为 `score.student_id` 和 `score.course_id` 建索引，使用 `explain analyze` 对比建索引前后的查询计划。

## 综合任务：设计学生信息管理系统数据库

为下一周的 JDBC 改造准备完整的数据库脚本和查询语句。

要求：

- 建库脚本与建表脚本分开；建库脚本只执行一次，建表与初始化脚本能在测试库中重复执行
- 至少包含学生表、课程表、成绩表，并说明表之间的关系
- 每张表都必须有主键，学号、课程编号等业务字段设置唯一约束
- 成绩字段使用合适的数据类型，并限制合理取值范围
- 创建时间使用 `timestamptz`，默认值使用 `now()`
- 明确外键的删除策略（`restrict`、`cascade` 或 `set null`），并说明选择原因
- 提供初始化数据脚本，数据量足以支撑查询、分组和联表练习
- 编写查询脚本，覆盖增删改查、条件查询、排序分页、分组统计和多表连接
- 为常用的关联字段创建索引，并用 `explain analyze` 记录一次执行计划
- 所有 SQL 语句添加注释，说明查询目的
- 记录一次事务回滚实验的过程和结果
- 整理表结构设计说明，逐个字段解释类型选择和约束原因

## 产出

- PostgreSQL 16 环境搭建与连接记录
- 建库建表脚本和初始化数据脚本
- 查询练习脚本及执行结果
- 事务回滚实验记录
- 索引与执行计划验证记录
- 数据库表结构设计说明
- 一份常用 SQL 语句速查笔记

## 完成检查

- [ ] 能够安装、启动并连接 PostgreSQL 16
- [ ] 能够使用合适的类型和约束设计数据表
- [ ] 能够熟练编写增删改查语句，并使用 `returning` 取回结果
- [ ] 能够使用排序、分页和条件查询
- [ ] 能够使用聚合函数和分组完成统计
- [ ] 能够完成多表连接和基础子查询
- [ ] 能够使用事务提交、回滚或回滚到保存点
- [ ] 能够创建基础索引并使用 `explain analyze` 查看执行计划
- [ ] 已完成学生信息管理系统的数据库脚本和表结构说明
- [ ] 能够说出至少 5 个 MySQL 与 PostgreSQL 的常用差异（补充）

## MySQL 补充：只做差异对照

阶段三主线只要求 PostgreSQL 16。MySQL 仍是常见的生产数据库，遇到已有 MySQL 项目时，按下面的差异快速迁移即可，不需要再完整学一遍。

| 场景 | PostgreSQL 16（主线） | MySQL 8（补充） |
| --- | --- | --- |
| JDBC 驱动 | `org.postgresql:postgresql` | `com.mysql:mysql-connector-j` |
| 驱动类 | `org.postgresql.Driver` | `com.mysql.cj.jdbc.Driver` |
| 连接 URL | `jdbc:postgresql://localhost:5432/student_db` | `jdbc:mysql://localhost:3306/student_db` |
| 自增主键 | `bigint generated always as identity` | `bigint auto_increment` |
| 时间字段 | `timestamptz` | `datetime` 或 `timestamp` |
| 布尔字段 | `boolean` | `tinyint(1)` |
| 字符集 | 数据库编码 UTF8 | `utf8mb4` |
| 标识符引用 | 双引号，未加引号会转小写 | 反引号，大小写行为受系统配置影响 |
| 插入冲突 | `on conflict (...) do update` | `on duplicate key update` |
| 空值处理 | `coalesce` | `ifnull` 或 `coalesce` |
| 分页 | `limit 5 offset 10` | `limit 10, 5` |
| 返回生成主键 | `returning id` | `getGeneratedKeys()` |
| 模糊查询大小写 | `like` 区分，`ilike` 不区分 | 默认排序规则下通常不区分 |
| JSON 字段 | `jsonb` | `json` |

迁移已有项目时重点检查：DDL 中的类型与自增写法、反引号、分页参数顺序、`on conflict` 替代写法、布尔值映射，以及插入后返回主键的方式。新项目默认选 PostgreSQL；如果团队已有成熟的 MySQL 运维体系或云服务限制，就继续使用 MySQL。数据库选型看团队熟悉度、生态和运维成本，不需要同时精通两套。
