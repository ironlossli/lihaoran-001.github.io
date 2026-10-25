# 李豪然 · 个人学术主页

以中文为主的个人学术 CV 网站，使用 HTML、CSS 与少量原生 JavaScript，无第三方运行依赖。

- 主页：<https://ironlossli.github.io/lihaoran-001.github.io/>
- 简历：<https://ironlossli.github.io/lihaoran-001.github.io/cv.html>
- 保留的早期博客：<https://ironlossli.github.io/lihaoran-001.github.io/blog/>

## 更新内容

编辑 `content/profile.json`，然后在 Node.js 18 或更高版本中运行：

```sh
npm run build
npm run check
```

`index.html` 和 `cv.html` 是生成后的静态文件，修改数据后需要一并提交。照片位于 `assets/portrait.jpg`；配色、布局和打印样式位于 `assets/style.css`。无需 npm install。

学术成果、作者角色、接收状态、教育经历和获奖记录来自本人提供的简历；论文检索链接明确指向 Google Scholar 搜索，不代表 DOI 或出版社文章链接。硕士阶段的 2027.07 标为预计毕业时间。

## 本地预览

在当前目录启动任意静态 HTTP 服务器，例如：

```sh
python3 -m http.server 4317 --bind 127.0.0.1
```

打开 <http://127.0.0.1:4317/>。简历页的“打印 / 保存为 PDF”使用浏览器打印功能，建议使用 A4 纸张。

## GitHub Pages

仓库使用现有 Pages 设置：`main` 分支的根目录 `/`。发布时将已检查的修改合并至 `main`；Pages 会自动构建。`.nojekyll` 保证静态文件直接发布；所有新页面的资源路径均为相对路径，同时兼容项目 Pages 子路径与根路径。

没有构建工作流，也不需要 token、API key 或服务器。站点没有分析追踪、表单收集或第三方字体请求。

## 旧博客

原有 `2022/`、`archives/`、`tags/`、`css/`、`js/` 和 `fancybox/` 均保留。原首页完整保存在 `blog/original-homepage.html`；`blog/index.html` 仅修正该首页内的资源和链接前缀，以便在新位置查看。旧文章自身的历史 HTML 保持原样。

## 内容来源

首版内容整理自本人提供的《李豪然_AI4Science计算化学实习_简历.pdf》，并由本人确认 UCAS、中文为主。头像直接提取自同一 PDF。公开站点保留学术联系邮箱，不包含原简历手机号；原 PDF 未上传至仓库。
