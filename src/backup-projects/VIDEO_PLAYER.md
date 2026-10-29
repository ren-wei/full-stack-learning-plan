# 备选项目：视频播放器

> 定位：视频点播方向的玩具项目，重点练习 HLS 转码、播放器控制、续播和播放鉴权，而不是做一个完整的视频平台。
>
> 建议周期：1-1.5 周（上传与转码 4-5 天，自定义播放器 3-4 天，安全与收尾 2-3 天）
>
> 前置能力：Spring Boot、Vue 3、PostgreSQL，了解文件上传、HTTP Range 和基本 FFmpeg 命令。
>
> 首版简化：对象存储继续使用 Docker Compose 里的 MinIO，不接阿里云 OSS 和 CDN；先跑通上传、HLS 转码、播放和续播。

## 项目目标

- 能解释 MP4 与 HLS 的区别，以及 master playlist、variant playlist 和分片之间的关系
- 能用 FFmpeg 异步转码出多码率 HLS，并处理任务失败、重试和临时文件清理
- 能实现自定义播放器：播放暂停、进度、音量、倍速、清晰度、全屏、字幕和快捷键
- 能保存并恢复观看进度，处理播放结束、网络错误和播放凭证过期
- 能证明未授权用户无法直接获取播放清单或分片

## 在本套作品中的位置

视频模块作为整套作品的可选第五模块，用于工作室的作品展示、课程回放或客户预览。它复用后台模板的登录、RBAC、菜单和审计，源视频、封面和字幕文件复用文件模块的 `fileId`。

视频模块只保存视频元数据、转码产物和观看进度，不重复实现对象存储。公开观看页建议使用 `/watch/{videoId}`；如果需要对外分享，可以复用公共短链模块生成 `/v/{code}`。

视频转码比较吃 CPU 和磁盘，建议在四个核心业务模块跑通后再加，不要让视频模块阻塞作品集主线。

## 技术栈

| 层次 | 选型 | 说明 |
| --- | --- | --- |
| 后端 | Spring Boot 3、MyBatis-Plus | 复用后台模板的权限和异常处理 |
| 转码 | FFmpeg | 通过 `ProcessBuilder` 调用，不拼接 shell 字符串 |
| 存储 | MinIO | 源视频、HLS 产物、封面和字幕 |
| 数据库 | PostgreSQL 16 | 视频、码率、任务、播放进度 |
| 前端 | Vue 3、Element Plus、hls.js | 原生 `<video>` 加自定义控制层 |
| 测试 | JUnit 5、Testcontainers、Playwright（可选） | 转码、鉴权和播放器关键路径 |

## 功能范围

### MVP（必须完成）

- 后台创建视频元数据：标题、简介、封面、源文件
- 异步转码为 360p 和 720p HLS，生成 master playlist
- 后台查看转码状态、失败原因和重试
- 视频列表、详情、封面和时长展示
- 公开或登录观看页，支持播放、暂停、拖动、音量、倍速和全屏
- 多码率时支持清晰度切换
- 每 5-10 秒保存观看进度，重新进入时恢复播放
- 播放地址使用短期播放凭证，过期后不能继续访问
- 统一处理加载中、缓冲、网络错误、格式不支持和解码失败

### 进阶（选做）

- 自适应码率（ABR）
- 1080p、4K 或自定义码率
- 字幕、多语言字幕和字幕样式
- 缩略图预览、进度条雪碧图和章节
- 画中画、键盘快捷键和无障碍优化
- 播放列表、下一集、观看历史和收藏
- 播放事件分析和缓冲率统计
- CDN、防盗链、水印和并发限流
- 视频封面自动截帧和横竖屏适配

### 明确不做

- 直播推流、WebRTC 和视频会议
- DRM、付费订阅和版权保护系统
- 推荐算法和完整 YouTube 类平台
- 在线剪辑和转码 SaaS

## 里程碑

| 阶段 | 交付物 | 验收方式 |
| --- | --- | --- |
| M1 视频元数据 | 上传源文件、创建视频、直接播放 MP4 | 能在页面播放原始 MP4 |
| M2 HLS 转码 | FFmpeg 转码 360p/720p、master playlist | HLS 在 Chrome 和 Safari 都能播放 |
| M3 自定义播放器 | 控制栏、倍速、清晰度、全屏和错误状态 | 桌面和移动端操作可用 |
| M4 鉴权与续播 | 播放凭证、进度保存、恢复播放 | 过期凭证被拒绝，刷新后能续播 |
| M5 工程质量 | 转码重试、清理、测试、README | 失败任务可重试，临时文件不泄漏 |

## 数据模型

| 表 | 关键字段 | 说明 |
| --- | --- | --- |
| `video_asset` | `id`、`owner_id`、`title`、`description`、`source_file_id`、`cover_file_id`、`master_playlist_path`、`status`、`duration_ms`、`visibility`、`created_at`、`updated_at` | 视频主表；状态为上传、转码中、可用、失败 |
| `video_rendition` | `id`、`video_id`、`resolution`、`bitrate_kbps`、`playlist_path`、`status`、`created_at` | `(video_id, resolution)` 唯一 |
| `video_subtitle` | `id`、`video_id`、`language`、`label`、`file_id`、`is_default` | 字幕文件复用文件模块 |
| `video_playlist` | `id`、`owner_id`、`title`、`visibility`、`created_at` | 可选播放列表 |
| `video_playlist_item` | `id`、`playlist_id`、`video_id`、`sort_no` | `(playlist_id, video_id)` 唯一 |
| `video_progress` | `id`、`video_id`、`user_id`、`position_ms`、`duration_ms`、`completed`、`updated_at` | `(video_id, user_id)` 唯一 |
| `video_transcode_job` | `id`、`video_id`、`status`、`attempts`、`error_message`、`started_at`、`finished_at` | 同一视频只允许一个活动任务 |
| `video_play_event`（可选） | `id`、`video_id`、`user_id`、`session_id`、`event_type`、`position_ms`、`created_at` | 播放分析，只追加 |

实现要点：

- `video_asset.source_file_id` 和 `cover_file_id` 指向文件模块，不复制文件表
- HLS 产物使用独立前缀，例如 `videos/{videoId}/master.m3u8` 和 `videos/{videoId}/720p/index.m3u8`
- `master_playlist_path` 只在视频状态为 `READY` 时对外生效
- 播放进度使用唯一键 upsert，重复上报不能产生多条记录；PostgreSQL 可用 `ON CONFLICT (video_id, user_id) DO UPDATE`
- 转码任务状态至少包含 `PENDING`、`RUNNING`、`SUCCESS`、`FAILED`
- 同一视频只允许一个 `PENDING` 或 `RUNNING` 任务，可用 PostgreSQL 部分唯一索引 `WHERE status IN ('PENDING', 'RUNNING')` 或条件插入；重复触发直接返回现有任务
- 删除视频先标记不可见，再异步清理 HLS 产物，避免播放中的请求突然 404

## 转码流程

1. 后台创建视频元数据，引用已上传的源文件
2. 触发转码时插入 `PENDING` 任务，接口立即返回
3. 工作线程通过条件更新把任务从 `PENDING` 改为 `RUNNING`
4. 下载源文件到临时目录，调用 FFmpeg 生成 360p 和 720p HLS
5. 上传 master playlist、variant playlist 和分片到 MinIO
6. 更新 `video_rendition` 和 `video_asset` 状态，清理临时文件
7. 失败时记录错误、限制重试次数，并清理不完整产物

720p 转码示例：

```bash
ffmpeg -i input.mp4 \
  -vf "scale=-2:720" \
  -c:v libx264 -preset veryfast -crf 23 \
  -c:a aac -b:a 128k \
  -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "720p/seg_%03d.ts" \
  720p/index.m3u8
```

master playlist 示例：

```text
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
720p/index.m3u8
```

注意：

- 每个码率的关键帧间隔要一致，否则切换清晰度时容易卡顿
- 分片长度建议 4-6 秒，过短会增加请求数，过长会增加起播延迟
- 用参数列表调用 FFmpeg，不要拼接用户输入到 shell 命令
- 限制源文件大小、转码并发数、执行超时和临时目录空间
- 转码任务要幂等，重复触发不能生成多个活动任务

## 播放鉴权

推荐 MVP 使用“短期播放凭证 + 后端 HLS 代理”：

1. 前端请求 `GET /api/videos/{id}/playback`
2. 服务端校验视频可见性和用户权限，返回短期 token
3. 播放地址为 `/api/videos/{id}/hls/{token}/master.m3u8`
4. 后端校验 token、视频 ID 和请求路径，只允许访问该视频的 HLS 前缀
5. relative playlist 中的分片路径自然继承 token 路径，不需要逐个签名
6. token 过期后播放器重新获取凭证，并从当前进度恢复

生产环境可以把代理换成 CDN + 签名 Cookie、Nginx `secure_link` 或对象存储签名 URL。无论哪种方案，都要保证：

- 私有桶不能公开读
- token 有效期短，且绑定视频 ID 和用户或会话
- 不能通过修改路径访问其他视频或对象存储内网地址
- 播放凭证不能出现在普通日志和错误上报中
- 对 HLS 请求做频率限制和防盗链

## 播放器实现

### 基础控制

- 使用原生 `<video>` 承载媒体，hls.js 负责不支持原生 HLS 的浏览器
- 播放、暂停、拖动、音量、静音、倍速、清晰度和全屏
- 键盘操作：空格播放暂停、方向键快进快退、`M` 静音、`F` 全屏
- 移动端隐藏不常用按钮，保证触控区域足够大
- 加载中、缓冲、错误和空状态都要有明确反馈

### 进度与续播

- 每 5-10 秒上报一次进度，暂停、切后台和离开页面时补报
- 服务端校验视频状态和用户身份，位置不能超过视频时长
- 进度超过 30 秒且未完成时提示“继续观看”
- 观看超过 90% 可以标记完成，具体阈值写进 README
- 页面离开时使用 `sendBeacon` 或等价方式补报，不能阻塞卸载
- 重复上报使用 upsert，不能产生重复进度记录

### 资源清理

- 组件卸载时销毁 hls.js 实例、移除事件监听和定时器
- 切换视频时先停止旧实例，再创建新实例
- 不要把播放实例放进全局状态长期持有
- 播放失败时提供重试和重新获取凭证入口
- 避免在播放器内部频繁触发整个页面重新渲染

## 接口草案

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/admin/videos` | 创建视频元数据 |
| `POST` | `/api/admin/videos/{id}/transcode` | 触发转码 |
| `GET` | `/api/admin/videos` | 后台视频列表和状态 |
| `GET` | `/api/videos` | 可观看视频列表 |
| `GET` | `/api/videos/{id}` | 视频详情、码率和字幕 |
| `GET` | `/api/videos/{id}/playback` | 获取播放凭证和播放地址 |
| `GET` | `/api/videos/{id}/hls/{token}/master.m3u8` | HLS 清单代理 |
| `PUT` | `/api/videos/{id}/progress` | 上报观看进度 |
| `GET` | `/api/videos/{id}/progress` | 获取观看进度 |
| `POST` | `/api/admin/videos/{id}/retry` | 重试失败转码 |

播放接口不能接受客户端传入的任意对象路径。后端只根据视频 ID 和数据库中的产物记录生成允许访问的路径。

## 生产级关注点

### 转码与任务

- 转码放在请求线程之外，使用任务表、线程池或队列，限制并发数
- 任务领取使用条件更新，避免多个 worker 同时处理同一个视频
- 设置最大重试次数和超时，失败后保留可读错误信息
- 清理临时文件、失败产物和过期源文件，避免磁盘被占满
- 对转码失败做告警，不能只让用户在页面上看到“加载失败”
- 源文件是用户上传内容，FFmpeg 进程要限制权限和资源

### 播放安全

- 私有桶、短期 token、路径白名单三者缺一不可
- 防止路径穿越，例如 `../`、编码后的斜杠和对象键前缀逃逸
- 设置正确的 Content-Type 和缓存头，HLS 清单不能长期缓存
- MP4 回退方案要支持 Range 请求，HLS 分片按完整对象读取
- 公共观看页要限流，防止批量抓取视频
- 不做 DRM 时要明确说明：短期凭证只能降低盗链风险，不能防止录屏

### 播放体验

- 首帧时间和缓冲次数比“支持多少分辨率”更重要
- 清晰度切换后保持当前播放位置和播放状态
- 网络恢复后自动重试，但不能无限重试
- 视频结束、切集和页面卸载都要正确释放资源
- 字幕使用 WebVTT 时注意跨域和编码
- 自动播放受浏览器策略限制，需要静音或用户手势

### 可观测性与测试

- 记录转码耗时、失败率、任务队列长度、起播时间、缓冲率和播放错误
- 每个播放会话带 trace ID 或 session ID，便于定位 CDN、对象存储和播放器问题
- 至少测试：转码成功、转码失败重试、未授权播放、过期 token、路径穿越、进度 upsert、清晰度切换
- 用真实 FFmpeg 和 MinIO 跑一次集成测试，纯 Mock 无法发现清单和分片路径问题
- 用 Playwright 或手工测试 Chrome、Safari 和移动端浏览器

## 验收标准

- [ ] 上传 MP4 后能异步转码出 360p/720p HLS，并生成 master playlist
- [ ] Chrome 和 Safari 都能播放，清晰度切换后进度不丢失
- [ ] 播放器支持播放暂停、拖动、音量、倍速和全屏
- [ ] 刷新页面后能从上次进度继续播放
- [ ] 未登录或无权观看时拿不到播放凭证
- [ ] 播放 token 过期后被拒绝，播放器能重新获取凭证
- [ ] 不能通过修改路径访问其他视频或对象存储内部对象
- [ ] 转码失败有错误原因和可重试入口
- [ ] 重复触发转码不会产生多个活动任务
- [ ] 组件卸载后没有遗留 hls.js 实例、定时器或事件监听
- [ ] 有 Docker Compose、转码说明、测试和已知问题清单

## 延伸方向

- 自适应码率和多分辨率
- 字幕、章节、缩略图和进度预览
- 播放列表、下一集和观看历史
- CDN、防盗链、水印和并发限制
- 播放分析和质量监控
- DRM 或加密 HLS（了解概念即可，不放进首版）
