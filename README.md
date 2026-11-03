# 全栈工程师学习路线

本项目使用 [mdBook](https://rust-lang.github.io/mdBook/) 管理学习路线和各阶段详细计划。

## 阅读文档

- [学习路线总览](src/README.md)
- [章节目录](src/SUMMARY.md)

本地启动：

```bash
mdbook serve --open
```

默认访问地址为 `http://localhost:3000`。

构建静态站点：

```bash
mdbook build
```

构建结果输出到 `book/` 目录。

## 访问统计

站点通过根目录的 `sls-tracking.js` 将页面访问上报到阿里云 SLS WebTracking：

- Project：`visit-stats`
- Logstore：`full-stack-learning-plan`
- Region：`cn-hangzhou`

本地 `localhost` / `127.0.0.1` 访问不会上报。
