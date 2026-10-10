# 阶段一验收考试：前端基础诊断卷（参考答案与判读说明）

> 本文件供评分者使用，不建议考试前交给学生。  
> 建议时间：55 分钟（小题 30 分钟，实战题 25 分钟）。  
> 评分要点：小题看结论是否正确，实战题看能否独立写出可运行结果并说明理由。

## 一、小题参考答案

### A. HTML 与语义化

**1.**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
</head>
<body></body>
</html>
```

关键点：`DOCTYPE`、`lang`、`charset`、`viewport` 四项缺一不可。

**2.**

```html
<header>…</header>
<nav>…</nav>
<main>…</main>
<footer>…</footer>
```

**3.** `alt` 是图片无法显示时的替代文字，同时供读屏软件朗读。装饰性图片（纯背景、分隔线）应写 `alt=""`，避免读屏软件读出无意义内容。

**4.** `ul` 的直接子元素只能是 `li`，不能是 `div`。

```html
<ul>
  <li>首页</li>
  <li>课程</li>
</ul>
```

### B. 选择器与盒模型

**5.** ① `.title`；② `.card > h3`。

**6.**

- `content-box`：200 + 10×2 + 2×2 = **224px**（宽度只算内容区）。
- `border-box`：**200px**（内边距和边框包含在 200px 内）。

**7.**

```css
* { box-sizing: border-box; }
body { margin: 0; }
```

**8.** `.box p` 选中 `.box` 内部任意层级的 `p`（后代），适合给一片区域内的所有段落统一排版；`.box > p` 只选直接子元素，适合组件化场景，避免影响嵌套的同类元素。

### C. Flex 与布局

**9.**

```css
display: flex;
align-items: center;
justify-content: space-between;
```

**10.** 两种正确写法都算通过：

```css
.course-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.course-card {
  flex: 1 1 calc(33.333% - 14px);
}
```

```css
.course-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

关键点：宽度必须扣掉 `gap` 的占用，否则一行放不下 3 个。

**11.** `flex: 1` 等价于 `1 1 0%`，元素从 0 开始按比例分配剩余空间；`flex: auto` 等价于 `1 1 auto`，先按内容尺寸占位再分配剩余空间。需要等宽列用 `flex: 1`，需要按内容长短伸缩用 `flex: auto`。

**12.** 适合：角标、覆盖文字、悬浮按钮、以容器为参照的定位。不适合：承担主体布局。示例：

```css
.card { position: relative; }
.card__badge { position: absolute; top: 8px; right: 8px; }
```

**13.**

```css
.list { overflow: auto; }
```

`overflow: hidden` 直接裁掉超出内容、不提供滚动；`overflow: auto` 在需要时才出现滚动条。

### D. 响应式

**14.**

```css
@media (max-width: 768px) {
  .sidebar { display: none; }
}
```

**15.**

```css
@media (min-width: 481px) and (max-width: 900px) {
  .card { flex-basis: calc(50% - 10px); }
}
```

关键点：范围两端都要写，断点不能和题目给的区间自相矛盾（写成 480px 也算通过）。

**16.** ① 是否缺少 `viewport` 声明；② 是否有元素使用了超过容器的固定宽度；③ `width: 100%` 的元素加内边距时是否使用了 `box-sizing: border-box`。用开发者工具逐个选中容器，找出实际宽度超出版心的元素。

### E. JavaScript 数组、字符串与函数

**17.** `[20, 40]`。

**18.**

```js
function sum(numbers) {
  let total = 0;
  for (const n of numbers) total += n;
  return total;
}
```

**19.**

```js
function uniqueById(students) {
  const seen = new Set();
  return students.filter((student) => {
    if (seen.has(student.id)) return false;
    seen.add(student.id);
    return true;
  });
}
```

**20.** `==` 会在比较前做类型转换，`===` 同时比较类型和值。判断字符串相等用 `===`，可以避免 `"1" == 1` 这类意外结果，也避免把数字和字符串当成同一个值。

**21.**

```js
function formatName(name) {
  return name.trim();
}
```

用到 `trim()`；如果还需要去掉中间多余空格，可用 `replace(/\s+/g, ' ')`。

### F. DOM 与事件

**22.**

```js
const list = document.querySelector('#course-list');
const item = document.createElement('li');
item.textContent = '新课程';
list.appendChild(item);
```

**23.**

```js
document.querySelector('#start-btn').addEventListener('click', () => {
  document.querySelector('#title').textContent = '已开始';
});
```

**24.** 推荐事件委托写法：

```js
const list = document.querySelector('.course-list');
list.addEventListener('click', (event) => {
  const card = event.target.closest('.course-card');
  if (!card) return;
  list.querySelectorAll('.course-card.is-active').forEach((el) => el.classList.remove('is-active'));
  card.classList.add('is-active');
});
```

逐个绑定也能通过，但要能说明为什么事件委托更好（新增卡片不用重新绑定）。

### G. 调试与 Git

**25.** 取到的元素是 `null`，通常是选择器写错（id 拼错、元素不存在），或者脚本在元素渲染之前执行。确认方式：先打印该元素看是否为 `null`，再把脚本放到 `body` 末尾或加 `defer`。

**26.**

```bash
git init
git add .
git commit -m "初始化阶段一验收考试"
```

**27.** `.gitignore` 声明不需要纳入版本控制的文件，避免把依赖、系统文件提交到仓库。

```text
node_modules/
.DS_Store
```

---

## 二、实战题参考答案（第 28 题）

### main.js

```js
const courses = [
  { id: 1, name: 'HTML 与 CSS 基础', duration: '12 小时', tags: ['盒模型', 'Flex'] },
  { id: 2, name: 'JavaScript 基础', duration: '16 小时', tags: ['数组', '函数'] },
  { id: 3, name: 'DOM 与事件', duration: '8 小时', tags: ['事件', '调试'] },
  { id: 4, name: '2048 项目实战', duration: '20 小时', tags: ['状态', '测试'] },
];

const list = document.querySelector('#course-list');

function createCard(course) {
  const card = document.createElement('article');
  card.className = 'course-card';
  card.dataset.id = course.id;

  const cover = document.createElement('div');
  cover.className = 'card__cover';

  const body = document.createElement('div');
  body.className = 'card__body';

  const title = document.createElement('h3');
  title.className = 'card__title';
  title.textContent = course.name;

  const meta = document.createElement('p');
  meta.className = 'card__meta';
  meta.textContent = course.duration;

  const tags = document.createElement('ul');
  tags.className = 'tag-list';
  course.tags.forEach((text) => {
    const tag = document.createElement('li');
    tag.className = 'tag';
    tag.textContent = text;
    tags.appendChild(tag);
  });

  body.append(title, meta, tags);
  card.append(cover, body);
  return card;
}

function renderCourses(courses) {
  list.replaceChildren(...courses.map(createCard));
}

function bindCardEvents() {
  list.addEventListener('click', (event) => {
    const card = event.target.closest('.course-card');
    if (!card) return;
    list.querySelectorAll('.course-card.is-active').forEach((el) => el.classList.remove('is-active'));
    card.classList.add('is-active');
  });
}

renderCourses(courses);
bindCardEvents();
```

使用 `innerHTML` 拼字符串同样可以接受，但要能说明拼接用户数据时的转义风险，以及为什么 `textContent` 更安全。

### style.css

```css
* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, -apple-system, "PingFang SC", sans-serif;
  color: #1f2328;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.course-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.course-card {
  flex: 1 1 calc(33.333% - 14px);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.course-card.is-active {
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
}

.card__cover {
  aspect-ratio: 16 / 9;
  background: #dbeafe;
}

.card__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card__title { margin: 0; font-size: 16px; }
.card__meta { margin: 0; color: #6b7280; font-size: 13px; }

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tag {
  padding: 2px 8px;
  border-radius: 999px;
  background: #eef2ff;
  font-size: 12px;
}

@media (max-width: 600px) {
  .course-card { flex-basis: 100%; }
}
```

### 实战题评分说明

| 项目 | 分值 | 通过标准 |
| --- | --- | --- |
| 数据渲染 | 30 | 遍历数组生成卡片，标签数量随数据变化，没有手写 4 个卡片 |
| 布局与视觉 | 25 | 每行 3 张、间距 20px、16:9 色块、边框圆角阴影到位 |
| 响应式 | 15 | ≤600px 单列，无横向滚动，媒体查询写法正确 |
| 交互与状态 | 20 | 点击加 `is-active`，同一时刻只有一张选中，事件不会重复绑定 |
| 可读性 | 10 | 函数职责单一，命名清晰，无重复代码 |

## 三、判读说明

### 建议通过（直接进入阶段二）

- 小题各模块正确率都在 80% 以上。
- 实战题能独立写出可运行结果，卡片布局和点击高亮都实现。
- 能解释 `box-sizing`、`flex-basis` 扣 `gap`、事件委托的理由。

### 需要补练的情形

- 第 6、7、10 题错：尺寸和盒模型没建立起来，补 1 天盒模型与 Flex 练习。
- 第 19、22、24 题错：数组处理和 DOM 操作不熟，补 2 天，用待办事项列表练习。
- 第 16、25 题错：不会排查问题，补 1 天开发者工具排错。
- 实战题写不出可运行结果：补 2-3 天，重做“数据渲染 + 点击高亮”这一组，再复测。
- 多个模块低于 60%：按 5 天“验收 + 重做”方案处理，重做一个完整页面和一个 2048 核心函数。

### 常见错误清单

| 现象 | 原因 |
| --- | --- |
| 一行放不下 3 张卡片 | 卡片宽度没减掉 `gap` 的占用 |
| 移动端布局不生效 | 缺少 `viewport` 声明 |
| 卡片换行后留白异常 | 用了固定像素宽度，没有用 `flex-basis` 或 `grid` |
| 点击多张卡片都保持高亮 | 没有先移除其他卡片的 `is-active` |
| 新增卡片后点击失效 | 用逐个绑定代替事件委托 |
| 报 `Cannot read properties of null` | 选择器写错或脚本执行早于元素渲染 |
| 页面出现横向滚动 | 固定宽度元素超出容器，或 `width: 100%` 加内边距未用 `border-box` |

## 四、考试后自查问题的参考答案

1. **为什么用数据渲染？** 卡片数量由数据决定，加第 5 张卡片只需改数组，不用改 HTML；手写方式要同时改结构和样式，容易漏改。
2. **为什么不用固定像素宽度？** 固定宽度在不同屏幕下要么放不下导致滚动，要么留白过多；`flex-basis` 或 `grid` 由容器宽度决定，天然适配。
3. **改成允许多选怎么改？** 只需去掉“移除其他卡片 `is-active`”那一行，改成 `classList.toggle('is-active')`；如果写了多个重复的绑定逻辑，改动就会散落在多处，这也是事件委托的价值。
