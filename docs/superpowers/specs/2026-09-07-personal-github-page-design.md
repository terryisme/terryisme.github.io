# 个人 GitHub Page 设计（简历站）

日期：2026-09-07  
状态：已实现（本地）  
参考站：[tristazero.github.io](https://tristazero.github.io)  
素材来源：LinkedIn [linkedin.com/in/taigoo](https://www.linkedin.com/in/taigoo) 的公开摘要

## 1. 目标

做一页英文在线简历，视觉尽量接近参考站（暗色、大头像英雄区、珊瑚强调色、时间线履历），内容先用公开职业信息填满，之后只改数据文件即可。

成功标准：

- 本地用静态服务器打开即可浏览，无需构建。
- 桌面与窄屏均可读，默认暗色，可切换浅色。
- 改 `content.json` 并刷新后，姓名、职位、履历、教育、链接随之更新。
- 空链接、空日期、缺头像不会造成空白崩页。
- 之后可原样放到任意 GitHub Pages 仓库根目录上线。

非目标：Blog、Archive、Latest 内容流、联系表单、后端、中英切换、现在就绑定 GitHub 账号或自定义域名。

## 2. 已确认决策

| 项 | 选择 |
| --- | --- |
| 站点类型 | 在线简历 / About，不是内容档案站 |
| 语言 | 英文为主 |
| 视觉 | 尽量接近参考站：暗色、大头像、珊瑚强调色、时间线 |
| 结构 | 单页，导航为页内锚点 |
| 实现 | 纯静态 HTML/CSS + 少量 JS，履历进 `content.json` |
| 发布 | 先本地完成；GitHub 账号与仓库名以后再定 |
| 内容 | 先用公开信息；日期、职责、头像由用户后续改正 |

## 3. 架构

浏览器直接加载静态文件。没有构建步骤、没有服务端逻辑。

```
index.html      唯一页面：导航、英雄区、履历、教育、联系的骨架与锚点
styles.css      暗色/浅色主题、版式、时间线、响应式
script.js       读取 content.json，渲染各区块；处理主题切换
content.json    全部英文文案与履历数据
assets/         头像占位与社交图标
```

数据流：页面加载 → `script.js` `fetch('content.json')` → 填入 DOM。`index.html` 内保留最小兜底文案（姓名、职位、LinkedIn），供 JSON 加载失败时使用。

本地预览必须通过静态服务器（例如 `python3 -m http.server`）。直接用 `file://` 打开会被浏览器拦截 `fetch`。

发布时将仓库根目录作为 GitHub Pages 源。本次不创建远程仓库、不配置 Actions。

## 4. 页面与视觉

### 4.1 导航（吸顶）

- 左侧：`Terry Zhang`（滚回页顶，与 `#about` 相同）
- 右侧锚点：`About` `#about`（英雄区）、`Career` `#career`、`Education` `#education`、`Contact` `#contact`
- 最右：明暗切换按钮
- 不出现 Blog / Archive

### 4.2 英雄区

- 左：圆形头像；文件缺失时用 `profile.name` 前两个词的首字母（Terry Zhang → `TZ`）；姓名为空则用 `TZ`
- 右：姓名、珊瑚红色职位、`tagline` / `bio`、`About me` 按钮（滚到 `#career`）、社交图标
- 社交图标只渲染 `content.json.links` 中非空的项；LinkedIn 必有
- 背景：近黑底 + 淡紫径向光晕（参考站同款气质）

### 4.3 Career

时间线，新到旧。每条展示：职位 · 公司、时间、地点、以及 `highlights` 中的全部条目（不截断）。无职责则只显示职位与公司。

### 4.4 Education

一条或多条：学位、学校、时间（可缺）。

### 4.5 Contact

展示已填写的 LinkedIn / GitHub / Email / X。无表单。

### 4.6 视觉规范

- 默认暗色：背景接近 `#0b0b0d`，强调色珊瑚 `#ef6d6d`，标题白，次要文字灰
- 浅色模式通过 `html[data-theme="light"]` 切换，偏好写入 `localStorage`
- 字体：系统无衬线栈（与 Inter / SF 接近）
- 桌面：英雄区两栏；窄屏：单列，导航可收缩或换行，不遮挡内容
- 卡片圆角、时间线左侧强调条，对齐参考站密度
- 不做 Latest 卡片网格、页脚名言、Archive 分区

## 5. 数据模型

`content.json` 为唯一内容源。字段契约如下。

```json
{
  "profile": {
    "name": "Terry Zhang",
    "title": "CTO @ SUNSHINE H&N",
    "location": "Shanghai, China",
    "tagline": "Building 生活Plus and leading the group's digital transformation.",
    "bio": "CTO at SUNSHINE H&N. Focused on 生活Plus and enterprise digital transformation, with 20+ years across software engineering and technology leadership.",
    "avatar": "assets/avatar.svg"
  },
  "links": {
    "linkedin": "https://www.linkedin.com/in/taigoo",
    "github": "",
    "email": "",
    "x": ""
  },
  "experience": [
    {
      "role": "CTO",
      "company": "SUNSHINE H&N",
      "start": "2019-05",
      "end": "present",
      "location": "Shanghai, China",
      "highlights": [
        "Leading engineering for 生活Plus.",
        "Driving the group's digital transformation."
      ]
    },
    {
      "role": "Managing Director, Xi'an Office",
      "company": "Syniverse",
      "start": "",
      "end": "",
      "location": "Xi'an, China",
      "highlights": []
    },
    {
      "role": "Sr. Technology Manager",
      "company": "Syniverse",
      "start": "",
      "end": "",
      "location": "",
      "highlights": []
    },
    {
      "role": "Sr. Software Engineer",
      "company": "Tangerine Technologies",
      "start": "2005-11",
      "end": "2008-11",
      "location": "Shanghai, China",
      "highlights": [
        "Built Salesforce-style CRM and a marketing affiliate management system."
      ]
    }
  ],
  "education": [
    {
      "degree": "B.S. Computer Science",
      "school": "Taiyuan University of Science and Technology",
      "start": "",
      "end": ""
    }
  ]
}
```

展示规则：

- `links` 中空字符串：不渲染对应图标
- `highlights` 为空数组：不渲染列表
- `start` / `end` 均为空：显示 `Dates TBA`
- 只缺一端：另一端正常格式化，缺的一侧显示 `TBA`（例如 `TBA – 2008` 或 `May 2019 – TBA`）
- `end` 为 `present`：显示 `Present`
- `start` / `end` 使用 `YYYY-MM`，展示为 `May 2019`
- GitHub 初版留空：公开仓库仍是旧教程，不链到不能代表本人的主页
- 产品名 `生活Plus` 保留中文，其余正文为英文

## 6. 缺省与容错

| 情况 | 行为 |
| --- | --- |
| `content.json` 请求失败或 JSON 非法 | 英雄区保留 HTML 兜底（姓名、职位、LinkedIn）；履历区显示 `Profile data failed to load.` |
| 头像文件 404 | 圆形占位，文字为姓名首字母（见 4.2） |
| 某条经历缺地点 | 不显示地点，不留空标签 |
| 未知主题值 | 回退暗色 |

不校验邮箱格式，不捕获除 `fetch` / JSON 解析以外的运行时错误。

## 7. 验证

无自动化测试。实现完成后用静态服务器做手工检查：

1. 默认暗色，强调色与英雄区光晕可见
2. 明暗切换后刷新仍保持所选主题
3. 四个锚点滚动到对应区块
4. 桌面两栏、窄屏（约 375px）单列且导航可用
5. LinkedIn 可打开；GitHub / Email / X 因空值不出现
6. Syniverse 两条经历显示 `Dates TBA`
7. 修改 `content.json` 中姓名或一条职责后刷新，页面更新
8. 临时改坏 JSON 或阻止该文件请求，出现兜底与失败提示，页面不白屏

浏览器验证需走通上述路径，不只截一张图。

## 8. 范围边界

本次包含：上述五个静态文件（加 `assets` 占位）、英文缺省内容、主题切换、响应式单页。

本次不包含：Git 远程与 Pages 配置、自定义域名、博客、中英双语、联系表单、从 LinkedIn 自动同步、真实头像照片（用户之后替换 `assets/avatar.svg` 或改 JSON 路径）。

## 9. 实现备注

工作区 `/Users/terryzhang/Desktop/OneLink/GithubHome` 目前为空，除本 spec 外无既有代码。实现时应直接在该目录落地静态文件，不必引入打包器、框架或 npm 依赖。
