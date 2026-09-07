# 个人 GitHub Page 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. 按用户 Superpowers 规则：在当前工作区直接改文件，不要建 worktree，不要 git commit。

**Goal:** 落地一页英文暗色简历站，视觉接近 tristazero.github.io，内容来自 `content.json`。

**Architecture:** 纯静态文件。展示规则（日期、空链接、姓名缩写、主题值）放在 `profile.mjs`，用 Node 内置测试验证；`script.js` 负责 `fetch`、渲染 DOM、主题切换。无构建、无 npm 依赖。

**Tech Stack:** HTML、CSS、ES modules、Node.js 内置 `node:test`（仅测纯函数）。

## Global Constraints

- 正文英文；产品名 `生活Plus` 保留中文
- 默认暗色背景 `#0b0b0d`，强调色 `#ef6d6d`，浅色用 `html[data-theme="light"]` + `localStorage`
- `links` 空字符串不渲染；GitHub / Email / X 初版为空
- 日期：`YYYY-MM` → `May 2019`；两端皆空 → `Dates TBA`；只缺一端 → 该侧 `TBA`；`present` → `Present`
- 头像失败：姓名前两词首字母，姓名空则 `TZ`
- 不引入打包器、框架、npm 包
- 不提交 git

**文件：**

- 创建：`profile.mjs` — 纯展示函数
- 创建：`tests/profile.test.mjs` — Node 内置测试
- 创建：`content.json` — 缺省履历
- 创建：`assets/avatar.svg` — 占位头像
- 创建：`index.html` — 单页骨架
- 创建：`styles.css` — 主题与版式
- 创建：`script.js` — 加载与渲染

---

### Task 1: 展示规则纯函数

**Files:**
- Create: `profile.mjs`
- Test: `tests/profile.test.mjs`

**Interfaces:**
- Consumes: 无
- Produces:
  - `initialsFromName(name: string): string`
  - `formatMonth(value: string): string`
  - `formatDateRange(start: string, end: string): string`
  - `visibleLinks(links: object): Array<{key, label, href}>`
  - `normalizeTheme(value: string): "light" | "dark"`

- [ ] **Step 1: 写失败测试**

创建 `tests/profile.test.mjs`：

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialsFromName,
  formatMonth,
  formatDateRange,
  visibleLinks,
  normalizeTheme,
} from "../profile.mjs";

test("initialsFromName uses first two words", () => {
  assert.equal(initialsFromName("Terry Zhang"), "TZ");
});

test("initialsFromName falls back to TZ when empty", () => {
  assert.equal(initialsFromName(""), "TZ");
  assert.equal(initialsFromName("   "), "TZ");
});

test("formatMonth formats YYYY-MM and present", () => {
  assert.equal(formatMonth("2019-05"), "May 2019");
  assert.equal(formatMonth("present"), "Present");
});

test("formatDateRange covers empty and partial dates", () => {
  assert.equal(formatDateRange("", ""), "Dates TBA");
  assert.equal(formatDateRange("2019-05", "present"), "May 2019 – Present");
  assert.equal(formatDateRange("", "2008-11"), "TBA – November 2008");
  assert.equal(formatDateRange("2019-05", ""), "May 2019 – TBA");
});

test("visibleLinks drops empty strings and labels email", () => {
  const links = visibleLinks({
    linkedin: "https://www.linkedin.com/in/taigoo",
    github: "",
    email: "terry@example.com",
    x: "",
  });
  assert.deepEqual(links, [
    { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/taigoo" },
    { key: "email", label: "Email", href: "mailto:terry@example.com" },
  ]);
});

test("normalizeTheme rejects unknown values", () => {
  assert.equal(normalizeTheme("light"), "light");
  assert.equal(normalizeTheme("dark"), "dark");
  assert.equal(normalizeTheme("nope"), "dark");
});
```

- [ ] **Step 2: 跑测试，确认因模块不存在而失败**

Run: `node --test tests/profile.test.mjs`  
Expected: FAIL，找不到 `../profile.mjs`

- [ ] **Step 3: 写最小实现 `profile.mjs`**

```js
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const LINK_ORDER = ["linkedin", "github", "x", "email"];
const LINK_LABELS = {
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "Twitter / X",
  email: "Email",
};

export function initialsFromName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "TZ";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function formatMonth(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.toLowerCase() === "present") return "Present";
  const match = /^(\d{4})-(\d{2})$/.exec(raw);
  if (!match) return raw;
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return raw;
  return `${month} ${match[1]}`;
}

export function formatDateRange(start, end) {
  const s = String(start || "").trim();
  const e = String(end || "").trim();
  if (!s && !e) return "Dates TBA";
  return `${s ? formatMonth(s) : "TBA"} – ${e ? formatMonth(e) : "TBA"}`;
}

export function visibleLinks(links) {
  const source = links && typeof links === "object" ? links : {};
  return LINK_ORDER.filter((key) => String(source[key] || "").trim()).map((key) => {
    const value = String(source[key]).trim();
    return {
      key,
      label: LINK_LABELS[key],
      href: key === "email" ? `mailto:${value}` : value,
    };
  });
}

export function normalizeTheme(value) {
  return value === "light" ? "light" : "dark";
}
```

- [ ] **Step 4: 再跑测试**

Run: `node --test tests/profile.test.mjs`  
Expected: 全部 PASS

---

### Task 2: 内容与占位资源

**Files:**
- Create: `content.json`
- Create: `assets/avatar.svg`

**Interfaces:**
- Consumes: spec 第 5 节字段契约
- Produces: 浏览器可 `fetch` 的 JSON；`profile.avatar` 指向 `assets/avatar.svg`

- [ ] **Step 1: 写入 spec 中的 `content.json` 全文**（字段与缺省值与 spec 第 5 节一致）
- [ ] **Step 2: 写入圆形珊瑚底、白字 TZ 的 SVG 占位头像**

---

### Task 3: 单页骨架、样式、渲染

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`

**Interfaces:**
- Consumes: `content.json`；`profile.mjs` 的五个导出函数
- Produces: 可预览单页。`#about` 英雄区，`#career` `#education` `#contact` 由 JS 填充；`fetch` 失败时英雄区 HTML 兜底保留，`#career` 显示 `Profile data failed to load.`

- [ ] **Step 1: 写 `index.html`**
  - 语言 `en`，标题 `Terry Zhang — CTO at SUNSHINE H&N`
  - 吸顶导航：姓名 → `#about`；About / Career / Education / Contact；`Toggle dark mode` 按钮
  - `#about` 英雄区兜底：占位头像、H1、职位、bio、`About me` → `#career`、仅 LinkedIn
  - `#career` / `#education` / `#contact` 空容器
  - `<script type="module" src="script.js"></script>`

- [ ] **Step 2: 写 `styles.css`**
  - 暗色变量：`--bg: #0b0b0d`，`--accent: #ef6d6d`，标题近白，次要灰
  - 英雄区淡紫径向光晕、圆头像、桌面两栏 / `max-width: 720px` 单列
  - 履历时间线左侧强调条；卡片圆角
  - `html[data-theme="light"]` 浅色变量
  - 系统无衬线字体栈

- [ ] **Step 3: 写 `script.js`**
  - 启动时 `normalizeTheme(localStorage.theme)` 应用到 `document.documentElement.dataset.theme`
  - 切换按钮写入 `localStorage` 并切换 `data-theme`
  - `fetch("./content.json")`，非法 JSON 或网络失败走 `showLoadError()`
  - 渲染姓名、title、tagline、bio、头像（`error` 时换成缩写）、`visibleLinks` 到英雄区与 Contact
  - 履历 / 教育用 `formatDateRange`；空 highlights / 空 location 不输出

- [ ] **Step 4: 跑纯函数测试，确认未破坏**

Run: `node --test tests/profile.test.mjs`  
Expected: PASS

---

### Task 4: 本地与浏览器验证

**Files:** 无新文件

- [ ] **Step 1: 静态服务器打开**

Run: `python3 -m http.server 4173`（仓库根目录）  
打开 `http://127.0.0.1:4173/`

- [ ] **Step 2: 按 spec 第 7 节逐项检查**
  1. 默认暗色，珊瑚强调色与英雄区光晕
  2. 切换主题后刷新仍保持
  3. 四个锚点滚动
  4. 桌面两栏、375px 单列
  5. LinkedIn 可点；GitHub / Email / X 不出现
  6. Syniverse 两条为 `Dates TBA`
  7. 用脚本临时改 JSON 姓名后请求，确认渲染更新（再改回）
  8. 阻断 `content.json` 时出现兜底与 `Profile data failed to load.`

---

## Spec 覆盖自检

| Spec 要求 | 任务 |
| --- | --- |
| 单页静态、无构建 | Task 3 |
| content.json 数据源 | Task 2 |
| 日期 / 空链接 / 缩写 / 主题回退 | Task 1–3 |
| 暗色视觉与响应式 | Task 3–4 |
| fetch 失败兜底 | Task 3–4 |
| 不发布 GitHub Pages | 全计划不包含远程步骤 |
