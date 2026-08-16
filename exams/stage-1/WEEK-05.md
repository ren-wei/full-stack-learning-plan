# 第 5 周能力测试：HTML/CSS 综合能力测试

> 可参考资料：MDN 中文文档（https://developer.mozilla.org/zh-CN/）和自己的学习笔记。  
> 禁止使用：AI 工具、搜索引擎

> 建议时间：60 分钟。  
> 范围：HTML 页面结构、CSS 基础语法、选择器、继承与层叠、盒模型、Flex/Grid、定位、视觉样式、文字排版、动画、响应式、现代 CSS、代码组织和调试。  
> 题目特点：共 30 题，既考基础概念，也考能否写出可运行 CSS 并说明实现思路。

## 一、答题要求

- 按顺序作答，能写代码的题尽量写出完整 CSS 或 HTML 片段。
- 概念题回答核心意思即可，不要求背诵定义。
- 如果题目问“为什么”，请结合页面效果或维护性说明。

示例：

```md
1. 问：`box-sizing: border-box` 的作用是什么？
   答：让元素设置的 width/height 包含 padding 和 border，尺寸更容易按设计图计算。
```

---

## 二、基础语法、选择器与层叠（7 题）

### 1. 为下面的 HTML 写 CSS，让文字变成红色，字号为 16px。

```html
<p class="notice">请勿错过本次活动</p>
```

要求：使用类选择器。

答：

```css

```

---

### 2. 分别写出元素选择器、类选择器、ID 选择器和通配符选择器。

```html
<p>段落文字</p>
<div class="card">卡片内容</div>
<header id="header">页头</header>
```

要求：第一行文字为 `#333`，第二行元素内边距为 `16px`，第三行元素高度为 `60px`，所有元素使用 `box-sizing: border-box`。

答：

```css

```

---

### 3. 后代选择器和子选择器分别会选中哪些元素？

```html
<div class="card">
  <p>直接子段落</p>
  <section><p>嵌套段落</p></section>
</div>
```

要求：写出 `.card p` 和 `.card > p` 的区别。

答：

---

### 4. 写出按钮悬停、输入框聚焦和必填星号的样式。

```html
<button class="btn">提交</button>
<input class="name" placeholder="请输入姓名">
<label class="required">邮箱</label>
```

要求：按钮 hover 背景为 `#e6f4ff`；输入框 focus 轮廓为 `2px solid #1677ff`；`.required` 前显示红色 `*`。

答：

```css

```

---

### 5. 下面两条规则同时存在时，最终文字是什么颜色？为什么？

```css
.page .title { color: red; }
.title { color: blue; }
```

```html
<div class="page">
  <h2 class="title">标题</h2>
</div>
```

答：

---

### 6. 哪些常见 CSS 属性会继承？哪些通常不会继承？

要求：至少各举 2 个例子，并说明项目中为什么不能只给父元素写所有样式。

答：

---

### 7. 项目中为什么通常优先使用类选择器，而不是大量使用 ID 选择器或很长的后代选择器？

答：

---

## 三、盒模型、显示类型与定位（8 题）

### 8. 盒模型从里到外由哪几部分组成？

要求：说明 `content`、`padding`、`border`、`margin` 分别是什么。

答：

---

### 9. 计算下面元素在默认盒模型下的总宽度。

```css
.card {
  width: 200px;
  padding: 20px;
  border: 2px solid #ccc;
}
```

要求：写出计算过程。

答：

---

### 10. `content-box` 和 `border-box` 的区别是什么？

要求：说明为什么项目里常写：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

答：

---

### 11. 卡片设置了圆角，但里面图片露出直角，如何只改容器修复？

```html
<div class="card">
  <img src="photo.jpg" alt="照片">
</div>
```

答：

```css

```

---

### 12. `block`、`inline`、`inline-block` 在换行和宽高设置上有什么区别？

答：

---

### 13. `display: none` 和 `visibility: hidden` 的区别是什么？

答：

---

### 14. 把角标定位到卡片右上角。

```html
<div class="card">
  卡片内容
  <span class="badge">角标</span>
</div>
```

要求：角标距离卡片上边和右边各 `8px`。

答：

```css

```

---

### 15. 页面右下角固定“返回顶部”按钮，适合用什么定位？写出核心 CSS。

要求：按钮距离页面最右侧 `24px`、距离页面最下侧 `44px`。

答：

```css

```

---

## 四、布局、视觉、文字与动效（9 题）

### 16. 用 Flex 让三个按钮水平垂直居中，并保持 `12px` 间距。

```html
<div class="actions">
  <button>取消</button>
  <button>保存</button>
  <button>删除</button>
</div>
```

答：

```css

```

---

### 17. 用 Flex 让标签横向排列，空间不足时换行，间距 `8px`。

```html
<div class="tags">
  <span>HTML</span><span>CSS</span><span>JavaScript</span>
  <span>Vue</span><span>React</span><span>TypeScript</span>
</div>
```

答：

```css

```

---

### 18. 用 Grid 创建三列等宽卡片网格，间距 `16px`。

```html
<div class="gallery">
  <div class="card">卡片 1</div>
  <div class="card">卡片 2</div>
  <div class="card">卡片 3</div>
  <div class="card">卡片 4</div>
  <div class="card">卡片 5</div>
  <div class="card">卡片 6</div>
</div>
```

答：

```css

```

---

### 19. Flex 和 Grid 更适合分别解决什么布局问题？

要求：结合“导航栏横向排列”和“卡片列表多列排列”举例。

答：

---

### 20. `background-size: cover` 和 `contain` 的区别是什么？

要求：说明图片可能被裁剪或留白的情况。

答：

---

### 21. 给卡片和标题增加轻微阴影效果。

```html
<div class="card">卡片</div>
<h2 class="title">标题文字</h2>
```

要求：卡片阴影参数为 `0 4px 12px rgb(0 0 0 / 12%)`；标题文字阴影参数为 `0 1px 2px rgb(0 0 0 / 20%)`。请写出对应 CSS。

答：

```css

```

---

### 22. 写一个多字体回退列表，并说明回退机制。

要求：给 `.text` 使用 `Arial, "Microsoft YaHei", sans-serif`。

答：

```css

```

---

### 23. 让单行标题超出 `240px` 宽度时显示省略号。

```html
<h2 class="title">这是一段很长很长的课程标题，超过宽度后应该显示省略号</h2>
```

答：

```css

```

---

### 24. 让按钮背景颜色在 `0.2s` 内平滑变化。

要求：默认背景颜色为 `#1677ff`，hover 时背景颜色变为 `#0958d9`。

答：

```css

```

---

## 五、响应式、现代 CSS 与工程习惯（6 题）

### 25. 补全移动页面的 viewport meta。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <!-- 在这里补全 viewport meta -->
  <title>移动页面</title>
</head>
</html>
```

答：

---

### 26. 默认小屏一列，宽度超过 `768px` 时三列，使用移动优先写法。

```html
<div class="cards">
  <div class="card">课程 1</div>
  <div class="card">课程 2</div>
  <div class="card">课程 3</div>
</div>
```

要求：使用 Grid，间距 `16px`。

答：

```css

```

---

### 27. 用 `aspect-ratio` 和 `object-fit` 做 16:9 封面。

```html
<div class="cover">
  <img src="photo.jpg" alt="封面">
</div>
```

要求：封面宽度 `100%`，图片填满容器且不变形。

答：

```css

```

---

### 28. 用 CSS 自定义属性统一管理主题色和间距。

```html
<button class="button">主按钮</button>
```

要求：在 `:root` 中定义变量 `--color-primary: #1677ff` 和 `--space-md: 16px`，按钮使用变量设置 `background` 和 `padding`。

答：

```css

```

---

### 29. 分别说明 `calc()`、`min()`、`clamp()` 适合解决什么问题。

要求：至少写出一个示例代码。

答：

```css

```

---

### 30. 为什么类名 `.error-message` 通常比 `.red-text` 更适合项目维护？

答：

---
