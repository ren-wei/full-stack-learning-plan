# 备选项目：订单与库存系统

> 定位：交易与库存方向的玩具项目，重点练习订单生命周期、库存并发、支付幂等和事务边界，而不是做一个完整电商平台。
>
> 建议周期：1.5-2 周（商品与库存 3-4 天，下单支付 4-5 天，并发测试与收尾 3-4 天）
>
> 前置能力：Spring Boot、PostgreSQL、Vue 3，了解事务、条件更新、乐观锁和幂等。

## 项目目标

- 能设计从创建订单、支付、履约到取消的完整状态流转
- 能用条件更新保证并发下单不超卖，并解释为什么“先查库存再更新”不可靠
- 能处理创建订单、支付回调、超时取消和重复请求的幂等
- 能用快照保存商品名称、SKU 名称和成交价格，避免历史订单被商品修改影响
- 能用并发测试证明库存不会变成负数，能用集成测试证明重复回调只生效一次

## 在本套作品中的位置

这是整套作品的交易核心，负责商品、SKU、库存和订单。它复用后台管理模板的登录、RBAC、菜单和审计能力，商品封面可以引用文件模块的 `fileId`，订单完成后可以触发问卷模块发送反馈链接。

订单模块只保存文件 ID、问卷 ID 等外部引用，不直接访问文件表或问卷表。跨模块动作通过服务接口或领域事件完成，避免把多个模块的 Mapper 混在一个事务里。

## 技术栈

| 层次 | 选型 | 说明 |
| --- | --- | --- |
| 后端 | Spring Boot 3、MyBatis-Plus | 复用后台模板的异常处理和权限基础 |
| 数据库 | PostgreSQL 16 | 商品、SKU、库存、订单、支付、流水 |
| 前端 | Vue 3 + Element Plus | 商品管理、库存调整、订单管理、用户下单页 |
| 缓存 | Redis（可选） | 商品详情缓存；库存以数据库为准，不能用缓存替代扣减 |
| 测试 | JUnit 5、Testcontainers | 并发测试和真实 PostgreSQL 集成测试 |

不要为了“像电商”一次性引入消息队列、分库分表和微服务。先把单库事务和库存扣减做对。

## 功能范围

### MVP（必须完成）

- 后台商品管理：商品、SKU、上下架、商品封面
- 后台库存管理：查看可用库存、锁定库存、已售库存，手工调整并记录流水
- 用户商品列表和详情
- 用户直接购买，创建订单并锁定库存
- 模拟支付回调，支付成功后确认库存
- 我的订单、订单详情、取消未支付订单
- 后台订单列表、详情、发货或完成履约
- 超时未支付自动取消并释放库存
- 商品名称、SKU 名称、成交价和收货信息保存快照
- 商品、库存、订单相关权限点和审计日志

### 进阶（选做）

- 购物车和多商品结算
- 优惠券、满减和运费规则
- 多仓库和库存调拨
- 部分退款、整单退款和售后
- 模拟真实支付网关的签名与异步通知
- 低库存预警
- 订单导出和发货单
- 对账任务：订单、支付、库存流水三方核对

### 明确不做

- 真实支付和资金清结算
- 多币种、税费和复杂促销引擎
- 完整 ERP、采购和仓储系统
- 微服务拆分和分布式事务

## 里程碑

| 阶段 | 交付物 | 验收方式 |
| --- | --- | --- |
| M1 商品与库存 | 商品、SKU、库存表和后台页面 | 能调整库存并看到流水 |
| M2 下单锁库存 | 创建订单、订单项、库存锁定 | 库存不足时整单失败，不产生半成品订单 |
| M3 支付与履约 | 模拟支付、订单状态流转、发货 | 重复回调不会重复扣减库存 |
| M4 取消与超时 | 用户取消、定时取消、库存释放 | 取消后库存恢复，重复取消无副作用 |
| M5 并发与收尾 | 并发测试、权限、日志、README | 100 个并发请求抢 10 件库存，结果正确 |

## 数据模型

| 表 | 关键字段 | 说明 |
| --- | --- | --- |
| `pms_product` | `id`、`name`、`description`、`status`、`cover_file_id`、`created_at` | 商品主表 |
| `pms_sku` | `id`、`product_id`、`sku_code`、`name`、`price_cent`、`status` | `sku_code` 唯一；金额用整数分 |
| `inv_stock` | `sku_id`、`available_qty`、`locked_qty`、`sold_qty`、`version`、`updated_at` | `sku_id` 主键；库存唯一事实来源 |
| `inv_stock_log` | `id`、`sku_id`、`change_type`、`delta_available`、`delta_locked`、`delta_sold`、`order_id`、`operator_id`、`remark`、`created_at` | 只追加，便于对账 |
| `oms_order` | `id`、`order_no`、`user_id`、`status`、`total_amount_cent`、`receiver_name`、`receiver_phone`、`address`、`idempotency_key`、`version`、`created_at`、`paid_at`、`cancelled_at` | `order_no` 唯一，`(user_id, idempotency_key)` 唯一 |
| `oms_order_item` | `id`、`order_id`、`sku_id`、`product_name_snapshot`、`sku_name_snapshot`、`price_cent_snapshot`、`quantity`、`subtotal_cent` | 下单时保存快照 |
| `oms_payment` | `id`、`payment_no`、`order_id`、`amount_cent`、`status`、`provider`、`provider_txn_id`、`created_at`、`paid_at` | `payment_no` 唯一，`(provider, provider_txn_id)` 唯一 |
| `oms_order_log` | `id`、`order_id`、`from_status`、`to_status`、`operator_id`、`reason`、`created_at` | 状态变化只追加 |

索引建议：

- `oms_order` 建立 `(user_id, status, created_at)` 和 `(status, created_at)`，后者供超时扫描使用
- `oms_order_item` 建立 `(order_id)` 索引
- `inv_stock_log` 建立 `(sku_id, created_at)` 索引
- 所有业务查询都要有分页上限，后台订单列表不能无上限导出到内存

## 订单状态机

| 当前状态 | 动作 | 下一状态 | 说明 |
| --- | --- | --- | --- |
| `PENDING_PAYMENT` | 支付成功 | `PAID` | 确认库存，写入支付记录 |
| `PENDING_PAYMENT` | 用户取消 | `CANCELLED` | 释放锁定库存 |
| `PENDING_PAYMENT` | 超时 | `CANCELLED` | 定时任务扫描，幂等释放 |
| `PAID` | 开始履约或发货 | `FULFILLING` | 记录物流或交付信息 |
| `FULFILLING` | 确认完成 | `COMPLETED` | 可触发售后问卷 |
| `PAID` / `FULFILLING` | 发起退款（选做） | `REFUNDING` → `REFUNDED` | 单独记录退款流水 |
| `CANCELLED` | 收到迟到支付回调 | `PAYMENT_EXCEPTION` | 不能直接把已取消订单改成已支付，进入人工退款 |

非法迁移统一返回 `409 INVALID_ORDER_STATE`。不要用“更新成功”掩盖状态错误。

## 核心流程

### 创建订单

1. 校验用户、SKU 状态、购买数量和收货信息
2. 按 SKU ID 排序，固定加锁顺序，降低多商品订单互相等待造成死锁的概率
3. 在同一个事务中插入订单和订单项，金额全部由服务端根据快照价格计算
4. 对每个 SKU 执行条件扣减，任何一条失败都抛出异常并回滚整单
5. 返回订单号和待支付状态

库存锁定 SQL：

```sql
UPDATE inv_stock
SET available_qty = available_qty - ?,
    locked_qty = locked_qty + ?,
    version = version + 1
WHERE sku_id = ?
  AND available_qty >= ?;
```

受影响行数为 0 表示库存不足。只根据“查询到的库存”判断是不够的，因为两个请求可能同时读到相同的可用数量。

### 支付成功

1. 校验支付回调签名、订单号、金额和支付流水号
2. 条件更新订单：只有 `PENDING_PAYMENT` 才能变成 `PAID`
3. 只有真正完成状态迁移的请求，才把锁定库存转为已售库存
4. 插入支付记录；重复支付回调通过唯一约束和订单状态识别
5. 提交事务后发送通知，不要在事务中调用远程服务

```sql
UPDATE oms_order
SET status = 'PAID', paid_at = ?, version = version + 1
WHERE id = ? AND status = 'PENDING_PAYMENT';
```

```sql
UPDATE inv_stock
SET locked_qty = locked_qty - ?,
    sold_qty = sold_qty + ?,
    version = version + 1
WHERE sku_id = ? AND locked_qty >= ?;
```

如果订单已经被取消但支付回调才到达，不能静默忽略，也不能把库存凭空再扣一次。记录异常支付并进入人工退款流程。

### 取消与超时

- 用户取消：条件更新 `PENDING_PAYMENT → CANCELLED`，成功后释放锁定库存
- 超时取消：定时任务分批扫描超时订单，对每一单重复上面的幂等操作
- 重复取消：已经是 `CANCELLED` 时直接返回当前状态，不重复释放库存
- 释放库存时校验 `locked_qty >= quantity`，避免异常数据把库存减成负数

### 库存调整

- 手工调整必须记录操作者、原因和调整前后数量
- 不允许把可用库存调整成负数
- 盘点和补货使用独立流水类型，不要直接改历史订单
- 所有调整都追加到 `inv_stock_log`，方便对账

## 接口草案

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/admin/products` | 商品分页查询 |
| `POST` | `/api/admin/products` | 创建商品和 SKU |
| `PUT` | `/api/admin/products/{id}` | 编辑商品 |
| `POST` | `/api/admin/stocks/{skuId}/adjust` | 调整库存并记录流水 |
| `GET` | `/api/admin/orders` | 后台订单列表 |
| `POST` | `/api/admin/orders/{id}/ship` | 发货或开始履约 |
| `GET` | `/api/products` | 用户商品列表 |
| `POST` | `/api/orders` | 创建订单，支持 `Idempotency-Key` |
| `POST` | `/api/orders/{id}/pay` | 发起模拟支付 |
| `POST` | `/api/payments/mock-callback` | 模拟支付回调，仅用于练习 |
| `POST` | `/api/orders/{id}/cancel` | 取消未支付订单 |
| `GET` | `/api/orders/mine` | 我的订单 |

请求中只接受 `skuId` 和 `quantity`，价格、总额、用户 ID 必须由服务端计算或从登录态获取。客户端传入的价格一律不可信。

## 生产级关注点

### 库存与并发

- 使用条件更新或行锁，不要用“查询余额 → 在 Java 中判断 → 更新”作为唯一保护
- PostgreSQL 可以用 `UPDATE ... RETURNING` 直接拿到扣减后的库存，但影响行数仍要判断
- 多商品订单按固定顺序扣减库存，避免不同顺序造成死锁
- 明确可用、锁定、已售三种库存的含义，任何时刻都要满足非负约束
- 库存缓存只能用于展示，扣减必须回到数据库；缓存更新放在事务提交之后
- 用 `CountDownLatch`、线程池或压测工具模拟并发，不要只靠人工点击

### 订单与支付幂等

- 创建订单使用 `Idempotency-Key`，同一用户重复提交返回同一订单
- 支付回调使用支付平台流水号唯一约束，重复通知返回成功但不能重复履约
- 状态迁移使用条件更新，只有迁移成功的请求才执行后续副作用
- 校验回调金额与订单金额一致，不能只相信回调里的“成功”字段
- 处理迟到回调、重复回调、乱序回调和金额不一致四种异常
- PostgreSQL 可以用 `INSERT ... ON CONFLICT` 处理幂等写入，但仍要校验订单状态、金额和业务结果

### 事务与一致性

- 同一业务操作涉及的订单、订单项、库存、库存流水、支付记录在同一个本地事务内完成
- 不要在事务中调用远程通知、对象存储或问卷服务；使用 outbox 或提交后事件
- 跨模块只传 ID，不直接更新对方的表
- 对账任务定期检查订单状态、支付记录和库存流水是否一致
- 任何“补偿任务”都必须幂等，并能处理重复执行

### 金额与快照

- 金额统一使用整数分，避免 `double` 和浮点误差
- 订单项保存商品名、SKU 名和成交价快照，历史订单不随商品编辑变化
- 总额由服务端重新计算，并在落库前与明细合计核对
- 限制单次购买数量和订单总金额，防止异常请求

### 权限与安全

- 用户只能查看和取消自己的订单，不能只靠前端隐藏按钮
- 商品、库存、订单、发货使用独立权限码，例如 `product:write`、`stock:adjust`、`order:ship`
- 库存调整、发货、退款等敏感动作写审计日志
- 防 SQL 注入、越权查询、重复提交和参数篡改
- 日志中不要输出完整收货地址、手机号和支付凭证

### 可观测性与测试

- 记录下单成功率、支付成功率、超时取消数、库存不足数和订单状态耗时
- 每个请求带 trace ID，串联订单、支付和库存日志
- 至少测试：库存不足整单回滚、并发不超卖、重复创建、重复支付、超时释放、迟到回调
- 用 Testcontainers `PostgreSQLContainer` 或真实 PostgreSQL 跑集成测试，内存数据库无法验证条件更新和锁行为
- 对账任务发现异常时告警，而不是自动修改历史数据

## 验收标准

- [ ] 100 个并发请求抢 10 件库存，最终只成功 10 单，库存不为负
- [ ] 同一用户用同一个 `Idempotency-Key` 重复下单只产生一条订单
- [ ] 重复支付回调只产生一条支付记录，库存只确认一次
- [ ] 用户取消和超时取消都能释放锁定库存，重复取消不重复释放
- [ ] 订单已取消后收到迟到支付回调会进入异常处理，不会被静默忽略
- [ ] 修改商品价格不会改变历史订单的成交价快照
- [ ] 用户无法查看或取消他人的订单
- [ ] 库存调整有流水、有操作者，并且不能出现负库存
- [ ] 有并发测试、集成测试、启动文档和已知问题清单

## 延伸方向

- 购物车、优惠券和运费计算
- 多仓库库存与调拨
- 退款、售后和对账
- 真实支付沙箱与签名验签
- 低库存预警和自动补货
- 订单状态事件化，拆分通知和报表
