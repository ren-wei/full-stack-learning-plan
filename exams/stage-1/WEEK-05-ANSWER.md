# 第 5 周能力测试：HTML/CSS 综合还原与调试（参考答案）

> 建议时间：60 分钟。  
> 范围：HTML 页面结构、CSS 基础语法、选择器、继承与层叠、盒模型、Flex/Grid、定位、视觉样式、文字排版、动画、响应式、现代 CSS、代码组织和调试。  
> 题目来源：从 `~/code/docs-draft/src/question-bank/css` 题库中抽取并改编。  
> 评分重点：能否说清概念、写出可运行代码，并能结合页面效果解释实现思路。

## 二、基础语法、选择器与层叠（7 题）

### 1. 为下面的 HTML 写 CSS，让文字变成红色，字号为 16px。

参考答案：

```css
.notice {
  color: red;
  font-size: 16px;
}
```

---

### 2. 分别写出元素选择器、类选择器、ID 选择器和通配符选择器。

参考答案：

```css
p { color: #333; }
.card { padding: 16px; }
#header { height: 60px; }
* { box-sizing: border-box; }
```

---

### 3. 后代选择器和子选择器分别会选中哪些元素？

参考答案：`.card p` 会选中 `.card` 内部所有层级的 `p`，包括直接子段落和嵌套段落；`.card > p` 只选中直接以 `.card` 为父元素的 `p`。

---

### 4. 写出按钮悬停、输入框聚焦和必填星号的样式。

参考答案：

```css
.btn:hover { background: #e6f4ff; }
.name:focus { outline: 2px solid #1677ff; }
.required::before {
  content: "*";
  color: red;
}
```

---

### 5. 下面两条规则同时存在时，最终文字是什么颜色？为什么？

参考答案：最终是红色。`.page .title` 的优先级高于 `.title`，所以即使 `.title` 写在后面，也不会覆盖前面的红色规则。

---

### 6. 哪些常见 CSS 属性会继承？哪些通常不会继承？

参考答案：文字相关属性通常会继承，例如 `color`、`font-family`、`font-size`、`line-height`。盒模型和布局相关属性通常不会继承，例如 `width`、`margin`、`padding`、`border`、`display`。所以父元素适合设置全局文字风格，但每个盒子的尺寸、间距和布局仍要按需要单独设置。

---

### 7. 项目中为什么通常优先使用类选择器，而不是大量使用 ID 选择器或很长的后代选择器？

参考答案：类选择器可复用、语义清楚、优先级适中，后期更容易覆盖和维护。ID 选择器优先级高且一个页面中应保持唯一，不适合作为主要样式选择器。很长的后代选择器依赖 DOM 层级，结构一变就容易失效，也会增加覆盖难度。

---

## 三、盒模型、显示类型与定位（8 题）

### 8. 盒模型从里到外由哪几部分组成？

参考答案：从里到外是 `content`、`padding`、`border`、`margin`。`content` 是内容区域，`padding` 是内容与边框之间的内边距，`border` 是边框，`margin` 是元素与外部元素之间的外边距。

---

### 9. 计算下面元素在默认盒模型下的总宽度。

参考答案：默认是 `content-box`，总宽度为 `200 + 20 * 2 + 2 * 2 = 244px`。

---

### 10. `content-box` 和 `border-box` 的区别是什么？

参考答案：`content-box` 下，`width` 只表示内容宽度，总宽度还要加上左右 `padding` 和 `border`。`border-box` 下，`width` 已经包含内容、`padding` 和 `border`。项目中常全局设置 `border-box`，这样按设计图计算元素尺寸更直观。

---

### 11. 卡片设置了圆角，但里面图片露出直角，如何只改容器修复？

参考答案：

```css
.card {
  border-radius: 8px;
  overflow: hidden;
}
```

`border-radius` 不会自动裁剪子元素，`overflow: hidden` 可以让超出圆角范围的图片被裁掉。

---

### 12. `block`、`inline`、`inline-block` 在换行和宽高设置上有什么区别？

参考答案：`block` 通常独占一行，可以设置宽高；`inline` 与文字在一行内排列，宽高通常不按块元素方式生效；`inline-block` 可以和其他行内内容排在一行，也可以设置宽高。

---

### 13. `display: none` 和 `visibility: hidden` 的区别是什么？

参考答案：`display: none` 不显示元素，也不保留布局空间；`visibility: hidden` 不显示元素，但通常仍保留原来的布局空间。

---

### 14. 把角标定位到卡片右上角。

参考答案：

```css
.card {
  position: relative;
}

.badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
```

---

### 15. 页面右下角固定“返回顶部”按钮，适合用什么定位？写出核心 CSS。

参考答案：

```css
.back-top {
  position: fixed;
  right: 24px;
  bottom: 44px;
}
```

固定定位通常相对视口定位，适合返回顶部、客服按钮等悬浮控件。

---

## 四、布局、视觉、文字与动效（9 题）

### 16. 用 Flex 让三个按钮水平垂直居中，并保持 `12px` 间距。

参考答案：

```css
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
```

---

### 17. 用 Flex 让标签横向排列，空间不足时换行，间距 `8px`。

参考答案：

```css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

---

### 18. 用 Grid 创建三列等宽卡片网格，间距 `16px`。

参考答案：

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```

---

### 19. Flex 和 Grid 更适合分别解决什么布局问题？

参考答案：Flex 更适合一维布局，例如导航栏、按钮组、左右对齐的 header。Grid 更适合二维布局，例如多列卡片列表、页面骨架、同时控制行和列的区域。

---

### 20. `background-size: cover` 和 `contain` 的区别是什么？

参考答案：`cover` 会让背景图铺满容器，图片比例不变，但可能被裁剪；`contain` 会让整张图片完整显示，图片比例不变，但容器中可能留白。

---

### 21. 写出卡片阴影和标题文字阴影。

参考答案：

```css
.card {
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
}

.title {
  text-shadow: 0 1px 2px rgb(0 0 0 / 20%);
}
```

---

### 22. 写一个多字体回退列表，并说明回退机制。

参考答案：

```css
.text {
  font-family: Arial, "Microsoft YaHei", sans-serif;
}
```

浏览器会按顺序尝试字体。如果用户电脑没有第一个字体，就尝试后面的字体；`sans-serif` 是通用无衬线字体族，用作最后兜底。

---

### 23. 让单行标题超出 `240px` 宽度时显示省略号。

参考答案：

```css
.title {
  width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

---

### 24. 让按钮背景颜色在 `0.2s` 内平滑变化。

参考答案：

```css
.btn {
  background-color: #1677ff;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #0958d9;
}
```

---

## 五、响应式、现代 CSS 与工程习惯（6 题）

### 25. 补全移动页面的 viewport meta。

参考答案：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

### 26. 默认小屏一列，宽度至少 `768px` 时三列，使用移动优先写法。

参考答案：

```css
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

### 27. 用 `aspect-ratio` 和 `object-fit` 做 16:9 封面。

参考答案：

```css
.cover {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

### 28. 用 CSS 自定义属性统一管理主题色和间距。

参考答案：

```css
:root {
  --color-primary: #1677ff;
  --space-md: 16px;
}

.button {
  color: white;
  background: var(--color-primary);
  padding: var(--space-md);
}
```

---

### 29. 分别说明 `calc()`、`min()`、`clamp()` 适合解决什么问题。

参考答案：

```css
.main { width: calc(100% - 240px); }
.card { width: min(100%, 600px); }
.title { font-size: clamp(20px, 4vw, 36px); }
```

`calc()` 适合混合单位计算；`min()` 适合在多个值中取较小值，例如限制最大宽度；`clamp()` 适合把值限制在最小值和最大值之间，例如响应式字号。

---

### 30. 为什么类名 `.error-message` 通常比 `.red-text` 更适合项目维护？

参考答案：`.error-message` 表达的是元素职责，颜色以后从红色改成橙色或其他样式时，类名仍然合理。`.red-text` 表达的是当前外观，样式变化后类名可能变得不准确。

---

## 六、评分建议

### 建议通过

- 能写出基础选择器、盒模型、Flex、Grid、定位和响应式核心代码。
- 能说明继承、层叠、优先级、显示类型和 `box-sizing` 的关键区别。
- 能结合静态官网项目说明版心、通栏、公共样式和资源整理。

### 需要继续追问或补学

- 基础选择器、盒模型计算、Flex/Grid 用法多数答不上来。
- 大量依赖绝对定位完成主体布局，无法解释页面为什么错位。
- 无法根据设计图说明页面区域、间距、颜色、字体和资源整理。
