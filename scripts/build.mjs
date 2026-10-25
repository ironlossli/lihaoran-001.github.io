import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const p = JSON.parse(await readFile(path.join(root, 'content/profile.json'), 'utf8'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tags = values => values.map(value => `<span class="tag">${esc(value)}</span>`).join('');
const authors = value => esc(value).replace(/Haoran Li|Hao-Ran Li/g, name => `<strong>${name}</strong>`);
const scholar = title => `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`;
const arrow = '<span aria-hidden="true">↗</span>';
const description = `${p.name}（${p.nameEn}），${p.institution}有机化学硕士研究生。研究方向包括分子机器学习、等变神经网络、电子结构计算与分子模拟。`;
const head = (title, cv = false) => `<!doctype html>
<html lang="zh-CN"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#f8f7f2"><meta property="og:type" content="profile">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<link rel="icon" type="image/svg+xml" href="./assets/favicon.svg">
<link rel="stylesheet" href="./assets/style.css"><script src="./assets/site.js" defer></script>
${cv ? '' : `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: p.name, alternateName: p.nameEn, url: 'https://ironlossli.github.io/lihaoran-001.github.io/', sameAs: [p.github], affiliation: { '@type': 'EducationalOrganization', name: p.institution }, knowsAbout: ['计算化学', '分子机器学习', '分子模拟'] }).replace(/</g, '\\u003c')}</script>`}
</head>`;
const papers = (compact = false) => p.publications.map((paper, index) => `<article class="publication${index === 0 ? ' featured-publication' : ''}">
  <div class="paper-index">${String(index + 1).padStart(2, '0')}</div>
  <div class="paper-body"><div class="paper-meta"><span class="venue">${esc(paper.venue)}</span><span>${esc(paper.year)}</span>${paper.status ? `<span class="status-badge">${esc(paper.status)}</span>` : ''}<span class="author-role">${esc(paper.role)}</span></div>
  <h3>${esc(paper.title)}</h3><p class="authors">${authors(paper.authors)}</p>
  <p class="paper-description">${esc(paper.description)}</p>
  ${compact ? `<p class="contribution">${esc(paper.contribution)}</p>` : `<details><summary>个人贡献 <span aria-hidden="true">+</span></summary><p>${esc(paper.contribution)}</p></details>`}
  </div>${compact ? '' : `<a class="paper-search" href="${scholar(paper.title)}" target="_blank" rel="noopener noreferrer" aria-label="在 Google Scholar 检索：${esc(paper.title)}">Scholar ${arrow}</a>`}
</article>`).join('');
const education = () => p.education.map(item => `<article class="education-row"><div class="period">${esc(item.period)}</div><div><h3>${esc(item.school)}</h3>${item.detail ? `<p>${esc(item.detail)}</p>` : ''}<p class="education-note">${esc(item.major)} · ${esc(item.degree)}${item.note ? ` <span> / ${esc(item.note)}</span>` : ''}</p></div><span class="degree">${esc(item.degree)}</span></article>`).join('');
const skills = () => p.skills.map(item => `<div class="skill-group"><h3>${esc(item.title)}</h3><div class="tags">${tags(item.items)}</div></div>`).join('');
const awards = () => p.awards.map(item => `<li><span>${esc(item.title)}</span><span>${esc(item.detail)}</span></li>`).join('');
const projects = (compact = false) => p.projects.map((project, index) => `<article class="project-row"><div class="project-side"><span class="project-number">0${index + 1}</span><p class="period">${esc(project.period)}</p><span class="project-type">${esc(project.type)}</span></div><div class="project-content"><h3>${esc(project.title)}</h3>${compact ? '' : `<p class="project-intro">${esc(project.description)}</p>`}<ul>${project.bullets.map(item => `<li>${esc(item)}</li>`).join('')}</ul><div class="tags">${tags(project.tools)}</div></div></article>`).join('');
const sectionTitle = (number, en, title, extra = '') => `<div class="section-heading"><div><span class="eyebrow">${number} / ${en}</span><h2>${title}</h2></div>${extra}</div>`;

const index = `${head(`${p.name} ${p.nameEn} · AI4Science & 计算化学`)}
<body><a class="skip-link" href="#main">跳转到正文</a>
<header class="site-header"><div class="header-inner"><a class="brand" href="#top" aria-label="李豪然，返回首页"><span class="brand-symbol">hl<span>.</span></span><span class="brand-name">${esc(p.name)}<span>${esc(p.nameEn)}</span></span></a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" aria-label="展开或收起导航"><span></span><span></span></button>
<nav id="navigation" aria-label="主导航"><a class="section-link" href="#about">关于</a><a class="section-link" href="#publications">学术成果</a><a class="section-link" href="#projects">项目</a><a class="section-link" href="#education">教育经历</a><a class="section-link" href="#contact">联系</a><a class="nav-cv" href="./cv.html">查看简历 ${arrow}</a></nav></div></header>
<main id="main"><section class="hero container" id="top" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow hero-eyebrow"><span class="small-dot"></span> AI FOR SCIENCE · COMPUTATIONAL CHEMISTRY</p><h1 id="hero-title">理解分子。<br>连接<span class="serif-accent">智能与化学。</span></h1><div class="hero-identity"><span class="hero-name">${esc(p.name)}</span><span class="hero-name-en">${esc(p.nameEn)}</span><span class="identity-rule"></span><span>${esc(p.role)}</span></div><p class="hero-institution">${esc(p.institution)} <span>/</span> ${esc(p.institute)}</p><p class="hero-description">在分子几何、机器学习与计算化学的交汇处，<br class="desktop-break">探索从分子表征到性质与机理的理解。</p><div class="hero-actions"><a class="button primary-button" href="#publications">了解我的研究 <span aria-hidden="true">↓</span></a><a class="text-link" href="mailto:${esc(p.email)}">联系我 ${arrow}</a></div></div>
<figure class="portrait-composition"><div class="portrait-grid" aria-hidden="true"></div><div class="portrait-topline"><span>RESEARCH PROFILE</span><span>01 — HL</span></div><div class="portrait-frame"><img src="./assets/portrait.jpg" alt="李豪然的个人照片" width="1024" height="1434" fetchpriority="high"></div><figcaption><span>HAORAN LI</span><span>AI × CHEMISTRY</span></figcaption><span class="portrait-mark" aria-hidden="true">✳</span></figure>
<div class="hero-bottom"><span>分子机器学习 <span class="separator">/</span> 量子化学 <span class="separator">/</span> 分子模拟</span><a href="#about" aria-label="继续阅读关于我">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div></section>

<section class="about-section" id="about"><div class="container">${sectionTitle('01', 'ABOUT & RESEARCH', '关于与研究')}<div class="about-intro"><p>${esc(p.intro)}</p><a class="text-link" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a></div><div class="research-grid">${p.focus.map((item,index) => `<article class="research-item"><div class="research-icon icon-${index}" aria-hidden="true">${index===0 ? '<span></span><span></span><span></span><span></span><span></span>' : index===1 ? '<i></i><i></i><i></i><b></b>' : '<i></i><i></i><i></i><i></i><i></i>'}</div><span class="research-en">${esc(item.en)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="tags">${tags(item.tags)}</div></article>`).join('')}</div></div></section>

<section class="container publications-section" id="publications">${sectionTitle('02', 'SELECTED PUBLICATIONS', '学术成果', '<span class="section-note">从数据表征，到分子机理。</span>')}<div class="publications">${papers()}</div></section>

<section class="container projects-section" id="projects">${sectionTitle('03', 'RESEARCH EXPERIENCE', '项目经历')}<div class="projects">${projects()}</div></section>

<section class="education-section" id="education"><div class="container">${sectionTitle('04', 'EDUCATION', '教育经历')}<div class="education-list">${education()}</div><div class="skills-block"><div class="minor-heading"><h2>方法与工具</h2><span class="eyebrow">METHODS & TOOLKIT</span></div><div class="skills-grid">${skills()}</div></div><div class="awards-block"><div class="minor-heading"><h2>获奖荣誉</h2><span class="eyebrow">HONORS & AWARDS</span></div><ul class="awards-list">${awards()}</ul></div></div></section>

<section class="contact-section" id="contact"><div class="container contact-inner"><div><p class="eyebrow">05 / GET IN TOUCH</p><h2>从一个想法，<br>开启一次交流。</h2><p>欢迎围绕 AI4Science、分子机器学习与计算化学交流。</p></div><div class="contact-links"><a class="contact-email" href="mailto:${esc(p.email)}">${esc(p.email)} ${arrow}</a><a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">GitHub / ironlossli ${arrow}</a><a href="./cv.html">查看完整简历 ${arrow}</a></div></div></section>
</main><footer class="site-footer container"><span>© ${p.updated.slice(0,4)} ${esc(p.name)} · ${esc(p.nameEn)}</span><span>更新于 ${esc(p.updated)} <span class="footer-divider">/</span> <a href="./blog/">早期博客 ${arrow}</a></span><a href="#top">回到顶部 ↑</a></footer></body></html>`;

const cv = `${head(`${p.name} · Curriculum Vitae`, true)}<body class="cv-page"><div class="cv-toolbar"><a class="text-link" href="./index.html">← 返回主页</a><button class="button primary-button" type="button" data-print>打印 / 保存为 PDF <span aria-hidden="true">↗</span></button></div><main class="cv-document"><header class="cv-heading"><div><p class="eyebrow">CURRICULUM VITAE</p><h1>${esc(p.name)} <span>${esc(p.nameEn)}</span></h1><p>AI4Science · 计算化学 · 分子机器学习</p><p>${esc(p.institution)} / ${esc(p.institute)}</p><a href="mailto:${esc(p.email)}">${esc(p.email)}</a><span class="cv-contact-separator"> · </span><a href="${esc(p.github)}">github.com/ironlossli</a></div><img src="./assets/portrait.jpg" alt="李豪然" width="1024" height="1434"></header>
<section class="cv-section"><h2>教育背景</h2>${education()}</section>
<section class="cv-section"><h2>学术成果</h2>${papers(true)}</section>
<section class="cv-section"><h2>项目经历</h2>${projects(true)}</section>
<section class="cv-section"><h2>专业技能</h2><div class="skills-grid">${skills()}</div></section>
<section class="cv-section"><h2>获奖荣誉</h2><ul class="awards-list">${awards()}</ul></section>
<footer class="cv-footer">${esc(p.name)} · Curriculum Vitae <span>${esc(p.updated)}</span></footer></main></body></html>`;

await writeFile(path.join(root, 'index.html'), index);
await writeFile(path.join(root, 'cv.html'), cv);
// Keep the original homepage byte-for-byte and expose a path-corrected blog index.
const original = await readFile(path.join(root, 'blog/original-homepage.html'), 'utf8');
await mkdir(path.join(root, 'blog'), { recursive: true });
await writeFile(path.join(root, 'blog/index.html'), original.replace(/(href|src)="\/(?!\/)/g, '$1="../'));
console.log('Built index.html, cv.html and preserved blog/index.html.');
