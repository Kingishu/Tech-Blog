const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// 配置项
const config = {
    sourceDir: './md-articles',          // MD文档目录
    outputDir: './article',              // 文章输出目录
    templatePath: './article-template.html', // 文章模板
    articlesDataPath: './script.js',     // 文章数据文件
    catalogIcon: '📄',                   // 新文章默认图标
    defaultCategory: '前端开发',           // 默认分类
    defaultSection: '技术文章'            // 默认分区
};

// MD元数据解析器
function parseMarkdownMetadata(content) {
    const metadata = {
        title: '',
        category: config.defaultCategory,
        section: config.defaultSection,
        date: new Date().toISOString().split('T')[0],
        gradient: 'gradient-5',
        description: '',
        excerpt: '',
        author: 'Kingishu',
        readTime: '5分钟'
    };

  // 解析YAML前置元数据
    const yamlMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (yamlMatch) {
        const yamlContent = yamlMatch[1];
        const markdownContent = yamlMatch[2];

        // 解析YAML
        const normalizedYaml = yamlContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        normalizedYaml.split('\n').forEach((line) => {
            const match = line.match(/^(\w+):\s*(.*)$/);
            if (match) {
                const key = match[1];
                let value = match[2].trim();

                // 处理带引号的值
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }

                metadata[key] = value;
            }
        });

        // 使用描述作为摘要，如果没有描述则自动生成
        if (metadata.description) {
            metadata.excerpt = metadata.description;
        } else {
            const firstParagraph = markdownContent.split('\n\n')[0].replace(/[#*`\[\]]/g, '');
            metadata.excerpt = metadata.excerpt || firstParagraph.substring(0, 100) + '...';
        }

        // 计算阅读时间
        const wordCount = markdownContent.split(/\s+/).length;
        metadata.readTime = Math.ceil(wordCount / 200) + '分钟';

        return { metadata, content: markdownContent };
    }

    // 如果没有YAML头，尝试从标题提取
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
        metadata.title = titleMatch[1];

        // 移除标题行
        const contentWithoutTitle = content.replace(/^#\s+.+$/m, '').trim();

        // 如果有描述字段，使用描述，否则自动生成
        if (metadata.description) {
            metadata.excerpt = metadata.description;
        } else {
            const firstParagraph = contentWithoutTitle.split('\n\n')[0].replace(/[#*`\[\]]/g, '');
            metadata.excerpt = firstParagraph.substring(0, 100) + '...';
        }

        return { metadata, content: contentWithoutTitle };
    }

    return { metadata, content };
}

// 生成文章HTML
function generateArticleHTML(metadata, markdownContent) {
    // 配置marked选项
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        headerPrefix: 'heading-'
    });

    // 转换MD为HTML
    let htmlContent = marked(markdownContent);

    // 手动为标题添加ID属性（确保TOC能正常工作）
    htmlContent = htmlContent.replace(/<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/g, (match, level, text) => {
        const id = text.trim()
            .toLowerCase()
            .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return `<h${level} id="heading-${id}">${text}</h${level}>`;
    });

    // 生成目录
    const toc = generateTOC(htmlContent);

    // 生成文章文件名
    const fileName = metadata.title.toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return {
        fileName,
        html: `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title} - Tech Blog</title>
    <link rel="stylesheet" href="../styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
    <style>
        /* Article specific styles */
        .article-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 100px 0 80px;
            position: relative;
            overflow: hidden;
        }

        .article-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="50" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.1;
        }

        .article-title {
            font-size: 3rem;
            font-weight: 700;
            color: white;
            margin-bottom: 1rem;
            position: relative;
            z-index: 1;
        }

        .article-meta {
            display: flex;
            gap: 2rem;
            align-items: center;
            color: rgba(255, 255, 255, 0.8);
            font-size: 1.1rem;
            position: relative;
            z-index: 1;
        }

        .article-meta span {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .article-content {
            padding: 80px 0;
            background: #0A0A0A;
        }

        .article-layout {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 3rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .article-body {
            font-size: 1.1rem;
            line-height: 1.8;
        }

        .article-sidebar {
            position: sticky;
            top: 120px;
            height: fit-content;
        }

        .article-body h1, .article-body h2, .article-body h3, .article-body h4, .article-body h5, .article-body h6 {
            font-weight: 600;
            margin: 2rem 0 1rem;
            color: var(--text-primary);
        }

        .article-body h1 {
            font-size: 2.5rem;
            background: var(--gradient-1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .article-body h2 {
            font-size: 2rem;
            background: var(--gradient-1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .article-body h3 {
            font-size: 1.5rem;
        }

        .article-body p {
            margin-bottom: 1.5rem;
            color: var(--text-secondary);
            font-size: 1.15rem;
            line-height: 1.7;
            letter-spacing: 0.01em;
        }

        .article-body ul, .article-body ol {
            margin: 1rem 0 1.5rem 2rem;
            color: var(--text-secondary);
            font-size: 1.1rem;
            line-height: 1.6;
        }

        .article-body li {
            margin-bottom: 0.5rem;
        }

        .article-body blockquote {
            border-left: 4px solid var(--primary-color);
            padding-left: 2rem;
            margin: 2rem 0;
            color: var(--text-secondary);
            font-style: italic;
            background: rgba(0, 122, 255, 0.15);
            padding: 1.5rem;
            border-radius: 0 var(--border-radius) var(--border-radius) 0;
            font-size: 1.1rem;
            line-height: 1.6;
        }

        .article-body pre {
            background: #1a1a1a;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 1.5rem;
            margin: 2rem 0;
            overflow-x: auto;
            position: relative;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .article-body code {
            background: rgba(0, 122, 255, 0.2);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 0.9em;
            color: #E0E0FF;
            font-weight: 500;
        }

        .article-body pre code {
            background: none;
            padding: 0;
            color: inherit;
        }

        .article-body img {
            max-width: 100%;
            height: auto;
            border-radius: var(--border-radius);
            margin: 1.5rem 0;
        }

        .article-body a {
            color: var(--primary-color);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: var(--transition);
        }

        .article-body a:hover {
            border-bottom-color: var(--primary-color);
        }

        .toc {
            background: #1a1a1a;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 1.5rem;
            margin: 0;
        }

        .toc h3 {
            margin: 0 0 1rem 0;
            color: var(--text-primary);
            font-size: 1.2rem;
            font-weight: 600;
        }

        .toc ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .toc li {
            margin-bottom: 0.5rem;
        }

        .toc a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: var(--transition);
            display: block;
            padding: 0.35rem 0;
            font-size: 0.95rem;
            line-height: 1.4;
        }

        .toc a:hover {
            color: var(--primary-color);
            transform: translateX(5px);
        }

        .toc a.active {
            color: var(--primary-color);
            font-weight: 600;
            border-left: 3px solid var(--primary-color);
            padding-left: 1rem;
        }

        @media (max-width: 768px) {
            .article-title {
                font-size: 2rem;
            }

            .article-meta {
                flex-direction: column;
                gap: 1rem;
                align-items: flex-start;
            }

            .article-body {
                font-size: 1rem;
            }

            .article-body h1 {
                font-size: 2rem;
            }

            .article-body h2 {
                font-size: 1.5rem;
            }

            .article-body h3 {
                font-size: 1.2rem;
            }

            .article-layout {
                grid-template-columns: 1fr;
            }

            .article-sidebar {
                position: static;
                order: -1;
            }

            .toc {
                margin: 1rem 0;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <a href="../index.html" class="logo">
                    <span class="logo-icon">◈</span>
                    <span class="logo-text">Tech Blog</span>
                </a>
                <ul class="nav-menu">
                    <li class="nav-item"><a href="../index.html" class="nav-link">首页</a></li>
                    <li class="nav-item"><a href="../index.html#articles" class="nav-link">文章</a></li>
                    <li class="nav-item"><a href="../index.html#about" class="nav-link">关于</a></li>
                    <li class="nav-item"><a href="../index.html#contact" class="nav-link">联系</a></li>
                </ul>
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    </header>

    <article>
        <div class="article-header">
            <div class="container">
                  <h1 class="article-title">${metadata.title}</h1>
                <div class="article-meta">
                    <span>📅 ${metadata.date}</span>
                    <span>🏷️ ${metadata.category}-${metadata.section}</span>
                    <span>⏱️ 阅读时间：${metadata.readTime}</span>
                    ${metadata.author ? `<span>👤 ${metadata.author}</span>` : ''}
                </div>
            </div>
        </div>

        <div class="article-content">
            <div class="container">
                <div class="article-layout">
                    <div class="article-body">
                        ${htmlContent}
                    </div>

                    ${toc ? `
                    <div class="article-sidebar">
                        <div class="toc">
                            <h3>目录</h3>
                            ${toc}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    </article>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Tech Blog</h3>
                    <p>分享技术，传播知识</p>
                </div>
                <div class="footer-section">
                    <h4>快速链接</h4>
                    <ul class="footer-links">
                        <li><a href="../index.html">首页</a></li>
                        <li><a href="../index.html#articles">文章</a></li>
                        <li><a href="../index.html#about">关于</a></li>
                        <li><a href="../index.html#contact">联系</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>技术栈</h4>
                    <ul class="footer-links">
                        <li><a href="#">JavaScript</a></li>
                        <li><a href="#">React</a></li>
                        <li><a href="#">Node.js</a></li>
                        <li><a href="#">TypeScript</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Tech Blog. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-java.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-csharp.min.js"></script>
    <script src="../script.js"></script>

    <script>
        // 目录高亮和滚动效果
        document.addEventListener('DOMContentLoaded', function() {
            const tocLinks = document.querySelectorAll('.toc a');
            const sections = [];

            // 收集所有章节
            tocLinks.forEach(link => {
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    sections.push({
                        id: targetId,
                        element: targetSection,
                        link: link
                    });
                }
            });

            // 滚动时高亮当前章节
            function highlightActiveSection() {
                const scrollPosition = window.scrollY + 150;

                sections.forEach(section => {
                    const sectionTop = section.element.offsetTop;
                    const sectionBottom = sectionTop + section.element.offsetHeight;

                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        tocLinks.forEach(link => link.classList.remove('active'));
                        section.link.classList.add('active');
                    }
                });
            }

            // 平滑滚动到章节
            tocLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);

                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 100;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // 监听滚动事件
            if (sections.length > 0) {
                window.addEventListener('scroll', highlightActiveSection);
                highlightActiveSection();
            }
        });
    </script>
</body>
</html>
        `
    };
}

// 生成目录
function generateTOC(htmlContent) {
    const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([^<]+)<\/h[1-6]>/g;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(htmlContent)) !== null) {
        const level = parseInt(match[1]);
        const id = match[2];
        const text = match[3];

        if (level >= 2 && level <= 4) { // 只包含H2-H4
            headings.push({ level, id, text });
        }
    }

    if (headings.length === 0) return '';

    const tocItems = headings.map(heading => {
        const indent = ' '.repeat((heading.level - 2) * 4);
        return `${indent}<li><a href="#${heading.id}">${heading.text}</a></li>`;
    }).join('\n');

    return `<ul>${tocItems}</ul>`;
}

// 安全地解析文章数据库
function safeParseArticlesDatabase(scriptContent) {
    try {
        // 提取articlesDatabase数组内容
        const dbMatch = scriptContent.match(/const articlesDatabase = (\[[\s\S]*?\]);/);
        if (!dbMatch) return [];

        // 由于数据库使用的是JavaScript对象语法，需要转换为JSON
        const dbContent = dbMatch[1]
            .replace(/(\w+):/g, '"$1":')  // 转换属性名
            .replace(/'/g, '"');          // 转换单引号为双引号

        return JSON.parse(dbContent);
    } catch (error) {
        console.error('解析文章数据库失败:', error.message);
        return [];
    }
}

// 检查文章是否已存在并返回索引
function findArticleIndex(title, existingArticles) {
    return existingArticles.findIndex(article =>
        article.title.replace(/\s+/g, ' ') === title.replace(/\s+/g, ' ')
    );
}

// 自动创建目录结构
function createDirectoryStructure(category, section) {
    try {
        const scriptContent = fs.readFileSync(config.articlesDataPath, 'utf8');

        // 解析现有的目录结构 - 使用更精确的正则表达式
        const catalogMatch = scriptContent.match(/const articlesCatalog = (\[[\s\S]*?\]\s*);/);
        if (!catalogMatch) {
            console.error('❌ 未找到文章目录结构');
            return false;
        }

        let catalog = [];
        try {
            // 解析目录结构
            const catalogContent = catalogMatch[1]
                .replace(/(\w+):/g, '"$1":')
                .replace(/'/g, '"');
            catalog = JSON.parse(catalogContent);
        } catch (error) {
            console.error('❌ 解析目录结构失败:', error.message);
            console.error('解析内容:', catalogContent);
            return false;
        }

        // 检查category是否存在
        let categoryIndex = catalog.findIndex(cat => cat.category === category);

        if (categoryIndex === -1) {
            // 创建新的category
            const categoryIcons = {
                'Unity开发': '🎮',
                '前端开发': '🌐',
                '测试内容': '🧪',
                '游戏开发': '🎯',
                '技术文章': '💻',
                '算法与数据结构': '🧮',
                '默认': '📝'
            };

            const newCategory = {
                category: category,
                icon: categoryIcons[category] || categoryIcons['默认'],
                sections: []
            };

            catalog.push(newCategory);
            categoryIndex = catalog.length - 1;
            console.log(`✅ 已创建新分类: ${category}`);
        }

        // 检查section是否存在
        const categoryObj = catalog[categoryIndex];
        let sectionIndex = categoryObj.sections.findIndex(sec => sec.title === section);

        if (sectionIndex === -1) {
            // 创建新的section
            categoryObj.sections.push({
                title: section,
                articles: []
            });
            console.log(`✅ 已创建新分区: ${section} (分类: ${category})`);
        }

        // 生成新的目录内容
        const jsonString = JSON.stringify(catalog, null, 4)
            .replace(/"(\w+)":/g, '$1:')
            .replace(/"/g, "'");
        const newCatalogContent = `const articlesCatalog = ${jsonString};`;

        // 替换原有的目录定义 - 使用更精确的正则表达式
        const catalogPattern = /const articlesCatalog = \[[\s\S]*?\]\s*;/;
        const updatedContent = scriptContent.replace(catalogPattern, newCatalogContent);

        // 写回文件
        fs.writeFileSync(config.articlesDataPath, updatedContent, 'utf8');

        console.log(`📝 新目录结构已写入文件`);
        return true;
    } catch (error) {
        console.error('❌ 创建目录结构失败:', error.message);
        return false;
    }
}

// 更新或添加文章数据
function updateArticlesData(metadata, fileName) {
    const articlePath = `article/${fileName}.html`;

    try {
        const scriptContent = fs.readFileSync(config.articlesDataPath, 'utf8');

        // 解析现有文章数据库
        const existingArticles = safeParseArticlesDatabase(scriptContent);

        // 查找文章是否已存在
        const articleIndex = findArticleIndex(metadata.title, existingArticles);

        // 创建文章对象
        const articleObj = {
            title: metadata.title,
            excerpt: metadata.excerpt,
            category: metadata.category,
            section: metadata.section,
            date: metadata.date,
            gradient: metadata.gradient,
            link: articlePath
        };

        if (articleIndex >= 0) {
            // 更新现有文章
            existingArticles[articleIndex] = articleObj;
            console.log(`✅ 已更新文章数据: ${metadata.title}`);
        } else {
            // 添加新文章
            existingArticles.unshift(articleObj);
            console.log(`✅ 已添加新文章到数据库: ${metadata.title}`);

            // 自动创建目录结构
            const directoryCreated = createDirectoryStructure(metadata.category, metadata.section);
            if (directoryCreated) {
                console.log(`✅ 已自动创建目录结构: ${metadata.category} > ${metadata.section}`);
            }
        }

        // 生成新的数据库内容（保持JavaScript对象格式）
        const jsonString = JSON.stringify(existingArticles, null, 4)
            .replace(/"(\w+)":/g, '$1:')     // 转换属性名为JavaScript格式
            .replace(/"/g, "'");             // 转换双引号为单引号
        const newDbContent = `const articlesDatabase = ${jsonString};`;

        // 替换原有的数据库定义
        const dbPattern = /const articlesDatabase = \[[\s\S]*?\];/;
        const updatedContent = scriptContent.replace(dbPattern, newDbContent);

        // 写回文件
        fs.writeFileSync(config.articlesDataPath, updatedContent, 'utf8');

    } catch (error) {
        console.error('❌ 更新文章数据失败:', error.message);
    }
}


// 处理单个MD文件
function processMarkdownFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { metadata, content: markdownContent } = parseMarkdownMetadata(content);

        if (!metadata.title) {
            console.log(`⚠️  跳过文件，缺少标题: ${filePath}`);
            return;
        }

        console.log(`🔄 处理文章: ${metadata.title}`);

        // 生成HTML文件
        const { fileName, html } = generateArticleHTML(metadata, markdownContent);
        const outputPath = path.join(config.outputDir, `${fileName}.html`);

        // 确保输出目录存在
        if (!fs.existsSync(config.outputDir)) {
            fs.mkdirSync(config.outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, html, 'utf8');
        console.log(`✅ 文章已生成: ${outputPath}`);

        // 更新文章数据
        updateArticlesData(metadata, fileName);

        return { success: true, metadata, fileName };

    } catch (error) {
        console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
        return { success: false, error: error.message };
    }
}

// 清理已删除MD文档对应的文章文件
function cleanupOrphanedArticles(currentMdFiles) {
    try {
        console.log('🧹 开始清理已删除的文章...');

        // 获取当前所有文章HTML文件
        if (!fs.existsSync(config.outputDir)) {
            return;
        }

        const articleFiles = fs.readdirSync(config.outputDir).filter(file => file.endsWith('.html'));

        // 从现有MD文件生成预期的文章文件名
        const expectedFileNames = new Set();
        currentMdFiles.forEach(mdFile => {
            try {
                const content = fs.readFileSync(path.join(config.sourceDir, mdFile), 'utf8');
                const { metadata } = parseMarkdownMetadata(content);
                if (metadata.title) {
                    const fileName = metadata.title.toLowerCase()
                        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                    expectedFileNames.add(`${fileName}.html`);
                }
            } catch (error) {
                console.warn(`⚠️  读取MD文件失败 ${mdFile}:`, error.message);
            }
        });

        // 找出需要删除的文章文件
        const orphanedFiles = articleFiles.filter(articleFile => !expectedFileNames.has(articleFile));

        if (orphanedFiles.length === 0) {
            console.log('✅ 没有需要清理的文章文件');
            return;
        }

        console.log(`🗑️  找到 ${orphanedFiles.length} 个需要清理的文章文件:`);

        // 删除孤立的HTML文件
        orphanedFiles.forEach(articleFile => {
            const filePath = path.join(config.outputDir, articleFile);
            try {
                fs.unlinkSync(filePath);
                console.log(`✅ 已删除文章文件: ${articleFile}`);
            } catch (error) {
                console.error(`❌ 删除文件失败 ${articleFile}:`, error.message);
            }
        });

        // 从数据库中删除对应的文章记录
        cleanupDatabaseOrphanedArticles(expectedFileNames);

    } catch (error) {
        console.error('❌ 清理文章文件失败:', error.message);
    }
}

// 从数据库中清理已删除的文章记录
function cleanupDatabaseOrphanedArticles(expectedFileNames) {
    try {
        const scriptContent = fs.readFileSync(config.articlesDataPath, 'utf8');
        const existingArticles = safeParseArticlesDatabase(scriptContent);

        // 找出需要删除的文章记录
        const articlesToRemove = existingArticles.filter(article => {
            const articleFileName = article.link.split('/').pop();
            return !expectedFileNames.has(articleFileName);
        });

        if (articlesToRemove.length === 0) {
            console.log('✅ 数据库中没有需要清理的文章记录');
            return;
        }

        console.log(`🗑️  从数据库中删除 ${articlesToRemove.length} 个文章记录:`);
        articlesToRemove.forEach(article => {
            console.log(`   - ${article.title}`);
        });

        // 创建新的文章数组（删除不存在的文章）
        const updatedArticles = existingArticles.filter(article => {
            const articleFileName = article.link.split('/').pop();
            return expectedFileNames.has(articleFileName);
        });

        // 生成新的数据库内容
        const jsonString = JSON.stringify(updatedArticles, null, 4)
            .replace(/"(\w+)":/g, '$1:')
            .replace(/"/g, "'");
        const newDbContent = `const articlesDatabase = ${jsonString};`;

        // 替换原有的数据库定义
        const dbPattern = /const articlesDatabase = \[[\s\S]*?\];/;
        const updatedContent = scriptContent.replace(dbPattern, newDbContent);

        // 写回文件
        fs.writeFileSync(config.articlesDataPath, updatedContent, 'utf8');
        console.log('✅ 数据库清理完成');

    } catch (error) {
        console.error('❌ 清理数据库失败:', error.message);
    }
}

// 批量处理MD文件
function processAllMarkdownFiles() {
    console.log('🚀 开始处理MD文档...\n');

    // 确保源目录存在
    if (!fs.existsSync(config.sourceDir)) {
        console.log(`📁 创建MD文档目录: ${config.sourceDir}`);
        fs.mkdirSync(config.sourceDir, { recursive: true });

        // 创建示例MD文件
        const exampleMD = `---
title: "欢迎使用MD转文章工具"
category: "前端开发"
section: "技术文章"
author: "Kingishu"
description: "这是一个强大的自动化工具，可以将Markdown文档转换为你的网站文章，支持自动生成HTML、更新数据库和清理无效文章。"
---

# 欢迎使用MD转文章工具

这是一个强大的自动化工具，可以将Markdown文档转换为你的网站文章。

## 功能特点

- 自动解析MD文档元数据
- 生成标准化的HTML文章
- 自动更新文章目录和数据
- 支持代码高亮和目录导航
- 自动更新已修改的文章
- 自动清理已删除的文章

## 使用方法

1. 将MD文件放入 \`md-articles\` 目录
2. 运行此工具
3. 文章将自动生成并添加到网站

## 代码示例

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

> 这是一个引用示例

祝你使用愉快！
`;

        fs.writeFileSync(path.join(config.sourceDir, 'example.md'), exampleMD, 'utf8');
        console.log('✅ 已创建示例MD文件');
    }

    // 读取所有MD文件
    const files = fs.readdirSync(config.sourceDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    if (mdFiles.length === 0) {
        console.log('📝 没有找到MD文件，请将MD文件放入 md-articles 目录');

        // 即使没有MD文件，也要执行清理操作
        cleanupOrphanedArticles([]);
        return;
    }

    console.log(`📄 找到 ${mdFiles.length} 个MD文件:\n`);

    // 处理每个文件
    const results = [];
    mdFiles.forEach(file => {
        const filePath = path.join(config.sourceDir, file);
        console.log(`🔄 处理: ${file}`);
        const result = processMarkdownFile(filePath);
        results.push({ file, ...result });
        console.log('');
    });

    // 清理已删除的文章
    cleanupOrphanedArticles(mdFiles);

    // 输出处理结果
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log('\n📊 处理结果:');
    console.log(`✅ 成功: ${successful.length} 个文件`);
    console.log(`❌ 失败: ${failed.length} 个文件`);

    if (successful.length > 0) {
        console.log('\n📝 成功生成的文章:');
        successful.forEach(result => {
            console.log(`   - ${result.metadata.title} (${result.fileName}.html)`);
        });
    }

    if (failed.length > 0) {
        console.log('\n❌ 处理失败的文章:');
        failed.forEach(result => {
            console.log(`   - ${result.file}: ${result.error}`);
        });
    }

    console.log('\n🎉 处理完成！请刷新网站查看新文章。');
}

// 主函数
function main() {
    console.log('========================================');
    console.log('      MD文档转文章自动化工具');
    console.log('========================================\n');

    processAllMarkdownFiles();
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = {
    processMarkdownFile,
    processAllMarkdownFiles,
    parseMarkdownMetadata,
    generateArticleHTML,
    updateArticlesData
};