// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');

            // Animate skill bars when in view
            if (entry.target.classList.contains('skill-item')) {
                const skillBar = entry.target.querySelector('.skill-progress');
                if (skillBar && !skillBar.classList.contains('animated')) {
                    const skillLevel = skillBar.getAttribute('data-skill');
                    skillBar.style.width = '0%';
                    skillBar.classList.add('animated');
                    setTimeout(() => {
                        skillBar.style.width = skillLevel + '%';
                    }, 200);
                }
            }
        }
    });
}, observerOptions);

// 生成文章目录 - 支持三级目录结构
function generateArticlesCatalog() {
    const catalogContent = document.querySelector('.catalog-content');
    if (!catalogContent) return;

    catalogContent.innerHTML = '';

    // 从articlesDatabase动态生成目录结构
    const catalogStructure = buildCatalogStructure(articlesDatabase);

    catalogStructure.forEach((category, categoryIndex) => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'catalog-category';
        categoryElement.innerHTML = `
            <div class="category-header" onclick="toggleCategory(${categoryIndex})">
                <span class="category-icon">${category.icon}</span>
                <span class="category-name">${category.category}</span>
                <span class="category-count">${getCategoryArticleCount(category)}</span>
            </div>
        `;

        const sectionsContainer = document.createElement('div');
        sectionsContainer.className = 'category-sections';
        sectionsContainer.id = `category-${categoryIndex}`;

        category.sections.forEach((section, sectionIndex) => {
            const sectionElement = document.createElement('div');
            sectionElement.className = 'catalog-section';

            const sectionTitle = document.createElement('div');
            sectionTitle.className = 'catalog-section-title';
            sectionTitle.innerHTML = `
                <span class="section-toggle-icon">▼</span>
                <span class="section-text">${section.title}</span>
                <span class="section-count">${section.articles.length}</span>
            `;
            sectionTitle.style.cursor = 'pointer';
            sectionTitle.onclick = (e) => toggleSection(categoryIndex, sectionIndex);

            sectionElement.appendChild(sectionTitle);

            // 直接创建文章列表
            const articlesList = document.createElement('div');
            articlesList.className = 'catalog-articles';
            articlesList.id = `category-${categoryIndex}-section-${sectionIndex}-articles`;

            section.articles.forEach((article, articleIndex) => {
                const articleLink = document.createElement('a');
                articleLink.className = 'catalog-article';
                articleLink.href = article.link || '#';
                articleLink.innerHTML = `
                    <span class="article-indicator"></span>
                    <span class="article-title">${article.title}</span>
                `;
                articleLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    highlightActiveArticle(articleLink);

                    // 跳转到文章页面
                    if (article.link) {
                        window.open(article.link, '_blank');
                    } else {
                        // 如果没有链接，滚动到对应的文章卡片
                        const articleCard = document.querySelector(`[data-article-title="${article.title}"]`);
                        if (articleCard) {
                            articleCard.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                            // 添加高亮效果
                            articleCard.style.boxShadow = '0 0 20px rgba(0, 122, 255, 0.5)';
                            setTimeout(() => {
                                articleCard.style.boxShadow = '';
                            }, 2000);
                        }
                    }
                });
                articlesList.appendChild(articleLink);
            });

            sectionElement.appendChild(articlesList);
            sectionsContainer.appendChild(sectionElement);
        });

        categoryElement.appendChild(sectionsContainer);
        catalogContent.appendChild(categoryElement);
    });
}

// 构建目录结构 - 支持二级目录：category-section
function buildCatalogStructure(articles) {
    const catalog = {};
    const categoryIcons = {
        'Unity开发': '🎮',
        '前端开发': '🌐',
        '测试内容': '🧪',
        '游戏开发': '🎯',
        '技术文章': '💻',
        '算法与数据结构': '🧮',
        '新技术分类': '🔬',
        '默认': '📝'
    };

    articles.forEach(article => {
        const category = article.category || '默认';
        const section = article.section || '默认分区';

        if (!catalog[category]) {
            catalog[category] = {
                category: category,
                icon: categoryIcons[category] || categoryIcons['默认'],
                sections: {}
            };
        }

        if (!catalog[category].sections[section]) {
            catalog[category].sections[section] = {
                title: section,
                articles: []
            };
        }

        catalog[category].sections[section].articles.push(article);
    });

    // 转换为数组格式
    return Object.values(catalog).map(category => ({
        category: category.category,
        icon: category.icon,
        sections: Object.values(category.sections)
    }));
}


// 计算分类下的文章总数 - 支持二级目录
function getCategoryArticleCount(category) {
    let count = 0;
    category.sections.forEach(section => {
        count += section.articles.length;
    });
    return count;
}

// 切换分类展开/收起
function toggleCategory(categoryIndex) {
    const sectionsContainer = document.getElementById(`category-${categoryIndex}`);
    const isHidden = sectionsContainer.style.display === 'none';

    // 切换显示状态
    sectionsContainer.style.display = isHidden ? 'block' : 'none';

    // 添加过渡动画
    if (isHidden) {
        sectionsContainer.style.opacity = '0';
        sectionsContainer.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            sectionsContainer.style.transition = 'all 0.3s ease';
            sectionsContainer.style.opacity = '1';
            sectionsContainer.style.transform = 'translateY(0)';
        }, 10);
    } else {
        sectionsContainer.style.transition = 'all 0.3s ease';
        sectionsContainer.style.opacity = '0';
        sectionsContainer.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            sectionsContainer.style.display = 'none';
        }, 300);
    }
}

// 切换二级目录展开/收起
function toggleSection(categoryIndex, sectionIndex) {
    const articlesList = document.getElementById(`category-${categoryIndex}-section-${sectionIndex}-articles`);
    const sectionElement = document.getElementById(`category-${categoryIndex}`).children[sectionIndex];
    const toggleIcon = sectionElement ? sectionElement.querySelector('.section-toggle-icon') : null;

    if (!articlesList) return;

    const isHidden = articlesList.style.display === 'none';

    // 切换显示状态
    articlesList.style.display = isHidden ? 'flex' : 'none';

    // 切换图标状态
    if (toggleIcon) {
        if (isHidden) {
            toggleIcon.classList.remove('collapsed');
        } else {
            toggleIcon.classList.add('collapsed');
        }
    }

    // 添加过渡动画
    if (isHidden) {
        articlesList.style.opacity = '0';
        articlesList.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            articlesList.style.transition = 'all 0.3s ease';
            articlesList.style.opacity = '1';
            articlesList.style.transform = 'translateY(0)';
        }, 10);
    } else {
        articlesList.style.transition = 'all 0.3s ease';
        articlesList.style.opacity = '0';
        articlesList.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            articlesList.style.display = 'none';
        }, 300);
    }
}

// 高亮激活的文章
function highlightActiveArticle(articleLink) {
    // 移除其他文章的激活状态
    document.querySelectorAll('.catalog-article').forEach(link => {
        link.classList.remove('active');
    });

    // 添加当前文章的激活状态
    articleLink.classList.add('active');
}

// 目录切换功能
function setupCatalogToggle() {
    const catalogToggle = document.querySelector('.catalog-toggle');
    const catalogContent = document.querySelector('.catalog-content');
    const toggleIcon = document.querySelector('.toggle-icon');

    if (!catalogToggle || !catalogContent) return;

    catalogToggle.addEventListener('click', () => {
        const isHidden = catalogContent.style.display === 'none';

        if (isHidden) {
            catalogContent.style.display = 'block';
            toggleIcon.textContent = '◀';
            toggleIcon.style.transform = 'rotate(0deg)';
        } else {
            catalogContent.style.display = 'none';
            toggleIcon.textContent = '▶';
            toggleIcon.style.transform = 'rotate(180deg)';
        }
    });
}

// 初始化文章显示
function initializeArticles() {
    const articlesGrid = document.querySelector('.articles-grid');
    if (!articlesGrid) return;

    // 显示前4个文章
    const initialArticles = articlesDatabase.slice(0, 4);
    initialArticles.forEach(article => {
        const articleCard = createArticleCard(article);
        articlesGrid.appendChild(articleCard);
        observer.observe(articleCard);
    });

    // 生成文章目录
    generateArticlesCatalog();

    // 设置目录切换功能
    setupCatalogToggle();
}

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // 初始化作品展示
    initializeWorks();

    // 初始化文章显示
    initializeArticles();

    // Observe article cards
    document.querySelectorAll('.article-card').forEach(card => {
        observer.observe(card);
    });

    // Observe skill items
    document.querySelectorAll('.skill-item').forEach(item => {
        observer.observe(item);
    });

    // Observe section headers
    document.querySelectorAll('.section-header').forEach(header => {
        observer.observe(header);
    });

    // Observe contact methods
    document.querySelectorAll('.contact-method').forEach(method => {
        observer.observe(method);
    });

    // Observe profile card
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        observer.observe(profileCard);
    }
});


// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Dynamic gradient animation
const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
];

let currentGradientIndex = 0;

function animateGradients() {
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
        heroTitle.style.background = gradients[currentGradientIndex];
        heroTitle.style.webkitBackgroundClip = 'text';
        heroTitle.style.webkitTextFillColor = 'transparent';
        heroTitle.style.backgroundClip = 'text';

        currentGradientIndex = (currentGradientIndex + 1) % gradients.length;
    }
}

// Change gradient every 5 seconds
setInterval(animateGradients, 5000);

// Typing effect for hero subtitle
const heroSubtitle = document.querySelector('.hero-subtitle');
const subtitleText = heroSubtitle.textContent;
heroSubtitle.textContent = '';

let charIndex = 0;
function typeWriter() {
    if (charIndex < subtitleText.length) {
        heroSubtitle.textContent += subtitleText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50);
    }
}

// Start typing effect when page loads
window.addEventListener('load', () => {
    setTimeout(typeWriter, 1000);
});

// 作品数据库配置
const worksDatabase = [
    {
        title: '王国之梦',
        excerpt: '使用Unity引擎开发的2D类杀戮尖塔卡牌游戏',
        category: '游戏开发',
        date: '2024-01-20',
        video: 'https://www.bilibili.com/video/BV1rDMgzqE5v/?spm_id_from=333.1387.homepage.video_card.click',
        cover: 'picture/王国之梦.jpg',
        tech: ['Unity', 'C#', 'PS'],
        description: '这是一个完整的2D卡牌游戏项目，使用Unity引擎开发。游戏包含的地图系统、卡牌对战系统、回合制系统,存储系统,充分展示了Unity游戏开发的全流程。',
        details: '项目包含5个关卡，20种敌人类型，完整的音效系统和UI界面。使用了Unity的PhysX物理引擎和Post-processing Stack来实现高质量的视觉效果。'
    },
    {
        title: '胶囊大作战',
        excerpt: '基于Unity3D的射击小游戏',
        category: '游戏开发',
        date: '2024-01-15',
        video: 'https://www.bilibili.com/video/BV1RQarz6ExB/?spm_id_from=333.1387.homepage.video_card.click',
        cover: 'picture/胶囊大作战.jpg',
        tech: ['Unity', 'C#', 'PS', 'Blender'],
        description: '一个功能完整的2.5D射击游戏,类吸血鬼幸存者玩法,玩家需要在平台内,击毙一定数量的敌人,进入下一关卡,在最后一关无尽模式中,取得更高的分数',
        details: '系统包含种子化地图生成,Fisher-Yates算法实现敌人随机生成,完整的武器系统,基于对象池的子弹,特效,音频管理系统。'
    }
];

// 文章目录配置
const articlesCatalog = [
    {
        category: 'Unity开发',
        icon: '🎮',
        sections: [
            {
                title: '核心系统',
                articles: [
                    {
                        title: 'Unity对象池技术详解',
                        excerpt: '深入解析Unity对象池技术，包括基础实现、通用对象池、对象池管理器和最佳实践。',
                        date: '2024-09-27',
                        gradient: 'gradient-1',
                        link: 'article/unity-object-pooling.html'
                    },
                    {
                        title: 'Unity存储系统设计与实现',
                        excerpt: '详细介绍Unity存储系统的架构设计，包括数据结构、JSON序列化、本地存储和云存储集成。',
                        date: '2024-09-27',
                        gradient: 'gradient-2',
                        link: 'article/unity-storage-system.html'
                    }
                ]
            },
            {
                title: '物理与检测',
                articles: [
                    {
                        title: 'Unity射线检测技术详解',
                        excerpt: '全面讲解Unity射线检测的原理、方法和应用场景，包括基础检测、特殊形状检测和性能优化。',
                        date: '2024-09-27',
                        gradient: 'gradient-3',
                        link: 'article/unity-raycasting.html'
                    },
                    {
                        title: 'Unity物理引擎深度解析',
                        excerpt: '深入探讨Unity物理引擎的核心组件、刚体系统、碰撞体、关节系统和性能优化技术。',
                        date: '2024-09-27',
                        gradient: 'gradient-4',
                        link: 'article/unity-physics-engine.html'
                    }
                ]
            }
        ]
    },
    {
        category: '前端开发',
        icon: '🌐',
        sections: [
            {
                title: 'JavaScript入门',
                articles: [
                    {
                        title: 'JavaScript基础语法',
                        excerpt: '由表及里,带你了解js的所有语法内容',
                        date: '2024-09-25',
                        gradient: 'gradient-5',
                        link: 'article/javascript-basic.html'
                    }
                ]
            },
            {
                title: 'JavaScript进阶',
                articles: [
                    {
                        title: 'JavaScript异步编程详解',
                        excerpt: '深入理解Promise、async/await、事件循环等JavaScript异步编程核心概念。',
                        date: '2024-09-25',
                        gradient: 'gradient-5',
                        link: 'article/javascript-async.html'
                    }
                ]
            }
        ]
    },
    {
        category: '算法与数据结构',
        icon: '🧮',
        sections: [
            {
                title: '基础算法',
                articles: [
                    {
                        title: '排序算法性能对比',
                        excerpt: '对比分析各种排序算法的时间复杂度、空间复杂度和实际应用场景。',
                        date: '2024-09-20',
                        gradient: 'gradient-6',
                        link: 'article/sorting-algorithms.html'
                    }
                ]
            }
        ]
    }
];

// 文章数据库配置（扁平化用于卡片显示）
const articlesDatabase = [
    {
        title: 'Git使用教程',
        excerpt: 'FileStream文件流相关操作',
        category: '项目开发',
        section: '版本控制',
        date: '2025-10-05',
        gradient: 'gradient-5',
        link: 'article/git使用教程.html',
        readTime: '10分钟'
    },
    {
        title: 'C#对象的序列化与反序列化',
        excerpt: 'FileStream文件流相关操作',
        category: 'Unity笔记',
        section: '数据持久化',
        date: '2025-10-05',
        gradient: 'gradient-5',
        link: 'article/c-对象的序列化与反序列化.html',
        readTime: '4分钟'
    },
    {
        title: 'FileStream文件流',
        excerpt: 'FileStream文件流相关操作',
        category: 'Unity笔记',
        section: '数据持久化',
        date: '2025-10-05',
        gradient: 'gradient-5',
        link: 'article/filestream文件流.html',
        readTime: '4分钟'
    }
];

// Load more functionality
const loadMoreBtn = document.querySelector('.articles .load-more .btn');
let articleCount = 4; // Initial number of articles
let articlesPerLoad = 2; // Number of articles to load each time
let maxArticles = 15; // Maximum number of articles to show

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
        // Simulate loading more articles
        this.innerHTML = '<span class="loading"></span> 加载中...';
        this.disabled = true;

        setTimeout(() => {
            // Add new articles (in a real app, this would fetch from an API)
            const articlesGrid = document.querySelector('.articles-grid');
            const startIndex = articleCount;
            const endIndex = Math.min(startIndex + articlesPerLoad, articlesDatabase.length);

            // Get articles from database
            const newArticles = articlesDatabase.slice(startIndex, endIndex);

            newArticles.forEach(article => {
                const articleCard = createArticleCard(article);
                articlesGrid.appendChild(articleCard);
                observer.observe(articleCard);
            });

            this.innerHTML = '加载更多文章';
            this.disabled = false;

            articleCount += newArticles.length;

            // Hide button if we have enough articles or no more articles
            if (articleCount >= maxArticles || articleCount >= articlesDatabase.length) {
                this.innerHTML = '没有更多文章了';
                this.disabled = true;
                this.style.opacity = '0.5';
                this.style.cursor = 'not-allowed';
            }
        }, 1000);
    });
}

// Function to create work card
function createWorkCard(work) {
    const card = document.createElement('div');
    card.className = 'work-card';

    // 生成技术标签HTML
    const techTags = work.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('');

    // 判断是否为B站链接
    const isBilibiliLink = work.video.includes('bilibili.com');

    // 创建可点击的卡片容器
    if (isBilibiliLink) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.open(work.video, '_blank');
        });
    }

    card.innerHTML = `
        <div class="video-container">
            ${isBilibiliLink ?
            `<img class="work-cover" src="${work.cover}" alt="${work.title} 封面" onerror="this.src='https://via.placeholder.com/400x225/333/fff?text=${encodeURIComponent(work.title)}'">` :
            `<video class="work-video" src="${work.video}" preload="metadata" controls></video>`
        }
            ${isBilibiliLink ? '<div class="play-overlay"><span class="play-icon">▶</span></div>' : ''}
        </div>
        <div class="work-content">
            <div class="work-meta">
                <span class="work-date">${work.date}</span>
                <span class="work-category">${work.category}</span>
            </div>
            <h3 class="work-title">${work.title}</h3>

            <!-- 默认显示的摘要 -->
            <div class="work-excerpt-default">
                <p class="work-excerpt">${work.excerpt}</p>
            </div>

            <!-- 悬停时显示的描述 -->
            <div class="work-description-hover">
                <p class="work-description">${work.description || '暂无描述'}</p>
                <p class="work-details">${work.details || '暂无详细信息'}</p>
            </div>

            <div class="work-tech">
                ${techTags}
            </div>
        </div>
    `;

    return card;
}

// 初始化作品展示
function initializeWorks() {
    const worksGrid = document.querySelector('.works-grid');
    if (!worksGrid) return;

    // 显示前4个作品
    const initialWorks = worksDatabase.slice(0, 4);
    initialWorks.forEach(work => {
        const workCard = createWorkCard(work);
        worksGrid.appendChild(workCard);
        observer.observe(workCard);
    });
}

// 作品加载更多功能
const worksLoadMoreBtn = document.querySelector('.works .load-more .btn');
let workCount = 4; // 初始显示的作品数量
let worksPerLoad = 2; // 每次加载的作品数量
let maxWorks = 12; // 最大显示作品数量

if (worksLoadMoreBtn) {
    worksLoadMoreBtn.addEventListener('click', function () {
        this.innerHTML = '<span class="loading"></span> 加载中...';
        this.disabled = true;

        setTimeout(() => {
            const worksGrid = document.querySelector('.works-grid');
            const startIndex = workCount;
            const endIndex = Math.min(startIndex + worksPerLoad, worksDatabase.length);

            const newWorks = worksDatabase.slice(startIndex, endIndex);

            newWorks.forEach(work => {
                const workCard = createWorkCard(work);
                worksGrid.appendChild(workCard);
                observer.observe(workCard);
            });

            this.innerHTML = '加载更多作品';
            this.disabled = false;

            workCount += newWorks.length;

            if (workCount >= maxWorks || workCount >= worksDatabase.length) {
                this.innerHTML = '没有更多作品了';
                this.disabled = true;
                this.style.opacity = '0.5';
                this.style.cursor = 'not-allowed';
            }
        }, 1000);
    });
}

// 生成随机渐变颜色
function generateRandomGradient() {
    const colorSets = [
        // 紫色系
        ['#667eea', '#764ba2', '#9f7aea', '#b794f6'],
        // 粉色系
        ['#f093fb', '#f5576c', '#ff6b9d', '#c44569'],
        // 蓝色系
        ['#4facfe', '#00f2fe', '#74b9ff', '#0984e3'],
        // 绿色系
        ['#43e97b', '#38f9d7', '#00b894', '#00cec9'],
        // 橙色系
        ['#fa709a', '#fee140', '#fdcb6e', '#e17055'],
        // 青色系
        ['#a8edea', '#fed6e3', '#74c0fc', '#339af0'],
        // 红色系
        ['#ff6b6b', '#f06595', '#e64980', '#d6336c'],
        // 黄色系
        ['#ffd93d', '#ff9f40', '#ff6348', '#ff4757'],
        // 深蓝系
        ['#667eea', '#764ba2', '#4c6ef5', '#364fc7'],
        // 紫红系
        ['#f093fb', '#f5576c', '#fa709a', '#ff6b9d']
    ];

    const randomSet = colorSets[Math.floor(Math.random() * colorSets.length)];
    const color1 = randomSet[Math.floor(Math.random() * randomSet.length)];
    const color2 = randomSet[Math.floor(Math.random() * randomSet.length)];

    // 确保两个颜色不相同
    const finalColor2 = color1 === color2 ?
        randomSet.find(c => c !== color1) || randomSet[1] : color2;

    const directions = ['135deg', '45deg', '90deg', '180deg', '270deg', '315deg'];
    const direction = directions[Math.floor(Math.random() * directions.length)];

    return `linear-gradient(${direction}, ${color1} 0%, ${finalColor2} 100%)`;
}

// Function to create article card
function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'article-card';
    card.setAttribute('data-article-title', article.title);

    // 生成随机渐变背景
    const randomGradient = generateRandomGradient();

    card.innerHTML = `
        <div class="article-image">
            <div class="article-gradient" style="background: ${randomGradient}"></div>
        </div>
        <div class="article-content">
            <div class="article-meta">
                <span class="article-date">${article.date}</span>
                <span class="article-category">${article.category}</span>
            </div>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${article.excerpt}</p>
            <a href="${article.link || '#'}" class="article-link" target="_blank">阅读更多 →</a>
        </div>
    `;
    return card;
}

// Dark mode toggle (optional feature)
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('light-mode') ? 'false' : 'true');
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'false') {
    document.body.classList.add('light-mode');
}

// Mouse trail effect (subtle)
let mouseTrail = [];
const maxTrailLength = 20;

document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.width = '4px';
    trail.style.height = '4px';
    trail.style.background = 'rgba(0, 122, 255, 0.6)';
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9999';
    trail.style.transition = 'opacity 0.5s ease-out';
    document.body.appendChild(trail);

    mouseTrail.push(trail);

    if (mouseTrail.length > maxTrailLength) {
        const oldTrail = mouseTrail.shift();
        oldTrail.style.opacity = '0';
        setTimeout(() => {
            if (oldTrail.parentNode) {
                oldTrail.parentNode.removeChild(oldTrail);
            }
        }, 500);
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttle to scroll events
window.addEventListener('scroll', throttle(() => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}, 16));

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '0.5rem 1rem';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '0.875rem';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '10000';
            tooltip.style.pointerEvents = 'none';

            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

            document.body.appendChild(tooltip);
            this.setAttribute('data-tooltip-active', 'true');
        });

        element.addEventListener('mouseleave', function () {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
            this.removeAttribute('data-tooltip-active');
        });
    });
}

// ==================== 搜索功能 ====================
// 搜索功能实现
class SearchEngine {
    constructor() {
        this.searchModal = document.getElementById('searchModal');
        this.searchInput = document.getElementById('searchInput');
        this.searchClear = document.getElementById('searchClear');
        this.searchClose = document.getElementById('searchClose');
        this.searchOverlay = document.getElementById('searchOverlay');
        this.searchResults = document.getElementById('searchResults');
        this.searchPlaceholder = document.getElementById('searchPlaceholder');
        this.resultsList = document.getElementById('resultsList');
        this.resultsHeader = document.getElementById('resultsHeader');

        this.searchIndex = this.buildSearchIndex();
        this.initializeSearch();
    }

    // 构建搜索索引
    buildSearchIndex() {
        const searchIndex = [];

        console.log('开始构建搜索索引...');

        // 添加文章到搜索索引
        if (typeof articlesDatabase !== 'undefined') {
            console.log(`添加 ${articlesDatabase.length} 篇文章到搜索索引`);
            articlesDatabase.forEach((article, articleIndex) => {
                searchIndex.push({
                    ...article,
                    searchableText: `${article.title} ${article.excerpt} ${article.category} ${article.section}`.toLowerCase()
                });
            });
        } else {
            console.log('articlesDatabase 未定义');
        }

        // 添加作品到搜索索引
        if (typeof worksDatabase !== 'undefined') {
            console.log(`添加 ${worksDatabase.length} 个作品到搜索索引`);
            worksDatabase.forEach((work, workIndex) => {
                // 安全地处理tags属性
                const tagsText = (work.tags && Array.isArray(work.tags)) ? work.tags.join(' ') : '';
                console.log(`处理作品 ${workIndex}: ${work.title}, tags:`, work.tags);

                searchIndex.push({
                    ...work,
                    searchableText: `${work.title} ${work.description} ${tagsText}`.toLowerCase(),
                    type: 'work'
                });
            });
        } else {
            console.log('worksDatabase 未定义');
        }

        console.log(`搜索索引构建完成，共 ${searchIndex.length} 项`);
        return searchIndex;
    }

    // 初始化搜索功能
    initializeSearch() {
        // 检查所有必要的元素是否存在
        if (!this.searchModal || !this.searchInput || !this.searchClear ||
            !this.searchClose || !this.searchOverlay || !this.searchResults ||
            !this.searchPlaceholder || !this.resultsList || !this.resultsHeader) {
            console.error('搜索功能所需元素未找到');
            return;
        }

        // 搜索按钮点击事件
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.openSearch());
        } else {
            console.error('搜索按钮未找到');
        }

        // 关闭搜索
        this.searchClose.addEventListener('click', () => this.closeSearch());
        this.searchOverlay.addEventListener('click', () => this.closeSearch());

        // 清除搜索
        this.searchClear.addEventListener('click', () => this.clearSearch());

        // 搜索输入事件 - 动态显示/隐藏清除按钮
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);

            // 动态显示/隐藏清除按钮
            if (e.target.value.trim()) {
                this.searchClear.classList.add('visible');
            } else {
                this.searchClear.classList.remove('visible');
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        // 搜索框获得焦点时检查内容
        this.searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim()) {
                this.searchClear.classList.add('visible');
            }
        });

        // 搜索框失去焦点时隐藏清除按钮
        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.searchClear.classList.remove('visible');
            }, 200); // 延迟隐藏，允许点击清除按钮
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K 打开搜索
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }

            // ESC 关闭搜索
            if (e.key === 'Escape' && this.searchModal && this.searchModal.classList.contains('active')) {
                this.closeSearch();
            }
        });
    }

    // 打开搜索界面
    openSearch() {
        this.searchModal.classList.add('active');
        this.searchInput.value = '';
        this.clearSearch();
        setTimeout(() => {
            this.searchInput.focus();
        }, 100);
        document.body.style.overflow = 'hidden';
    }

    // 关闭搜索界面
    closeSearch() {
        this.searchModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 清除搜索
    clearSearch() {
        this.searchInput.value = '';
        this.searchResults.style.display = 'none';
        this.searchPlaceholder.style.display = 'block';
        this.resultsList.innerHTML = '';
    }

    // 执行搜索
    performSearch(query) {
        if (!query.trim()) {
            this.clearSearch();
            return;
        }

        const results = this.search(query);
        this.displayResults(results, query);
    }

    // 搜索算法
    search(query) {
        const searchTerm = query.toLowerCase().trim();
        const results = [];

        this.searchIndex.forEach(item => {
            let score = 0;
            let matchedFields = [];

            // 标题匹配 (权重最高)
            if (item.title && item.title.toLowerCase().includes(searchTerm)) {
                score += 10;
                matchedFields.push('title');
            }

            // 描述/摘要匹配
            if (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm)) {
                score += 5;
                matchedFields.push('excerpt');
            }

            // 分类匹配
            if (item.category && item.category.toLowerCase().includes(searchTerm)) {
                score += 3;
                matchedFields.push('category');
            }

            // 章节/标签匹配
            if (item.section && item.section.toLowerCase().includes(searchTerm)) {
                score += 2;
                matchedFields.push('section');
            }

            // 标签匹配 (安全处理)
            if (item.tags && Array.isArray(item.tags)) {
                item.tags.forEach(tag => {
                    if (typeof tag === 'string' && tag.toLowerCase().includes(searchTerm)) {
                        score += 2;
                        matchedFields.push('tag');
                    }
                });
            }

            // 模糊匹配
            if (score === 0 && item.searchableText && this.fuzzyMatch(item.searchableText, searchTerm)) {
                score += 1;
                matchedFields.push('fuzzy');
            }

            if (score > 0) {
                results.push({
                    ...item,
                    score,
                    matchedFields
                });
            }
        });

        // 按相关性排序
        return results.sort((a, b) => b.score - a.score);
    }

    // 简单的模糊匹配算法
    fuzzyMatch(text, pattern) {
        let patternIndex = 0;
        for (let i = 0; i < text.length && patternIndex < pattern.length; i++) {
            if (text[i] === pattern[patternIndex]) {
                patternIndex++;
            }
        }
        return patternIndex === pattern.length;
    }

    // 显示搜索结果
    displayResults(results, query) {
        this.searchPlaceholder.style.display = 'none';
        this.searchResults.style.display = 'block';

        // 更新结果头部
        this.resultsHeader.innerHTML = `
            <span class="results-count">${results.length} 个结果</span>
            <span class="search-query">"${query}"</span>
        `;

        // 清空之前的結果
        this.resultsList.innerHTML = '';

        if (results.length === 0) {
            this.resultsList.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <p>没有找到相关结果</p>
                    <small>尝试使用不同的关键词</small>
                </div>
            `;
            return;
        }

        // 显示结果
        results.forEach((result, index) => {
            const resultElement = this.createResultElement(result, query);
            this.resultsList.appendChild(resultElement);
        });
    }

    // 创建搜索结果元素
    createResultElement(result, query) {
        const div = document.createElement('div');
        div.className = 'search-result-item';

        const isWork = result.type === 'work';
        const categoryTag = isWork ?
            `<span class="result-tag work-tag">作品</span>` :
            `<span class="result-tag article-tag">文章</span>`;

        // 为作品添加视频提示
        const videoIndicator = isWork ?
            `<span class="video-indicator">🎥 点击观看视频</span>` : '';

        div.innerHTML = `
            <div class="result-content">
                <div class="result-header">
                    ${categoryTag}
                    <h3 class="result-title">${this.highlightText(result.title, query)}</h3>
                    ${videoIndicator}
                </div>
                <p class="result-description">${this.highlightText(result.excerpt || result.description, query)}</p>
                <div class="result-meta">
                    <span class="result-category">${result.category || '技术'}</span>
                    ${result.section ? `<span class="result-section">${result.section}</span>` : ''}
                    ${result.date ? `<span class="result-date">${result.date}</span>` : ''}
                    ${result.readTime ? `<span class="result-read-time">⏱️ ${result.readTime}</span>` : ''}
                </div>
            </div>
        `;

        // 添加点击事件
        div.addEventListener('click', () => {
            if (result.link) {
                // 文章：在同一页面打开
                window.location.href = result.link;
            } else if (result.video) {
                // 作品：打开视频链接（新窗口）
                window.open(result.video, '_blank');
            } else if (result.demoLink) {
                // 作品demo链接
                window.open(result.demoLink, '_blank');
            } else if (result.githubLink) {
                // GitHub链接
                window.open(result.githubLink, '_blank');
            } else {
                console.log('没有找到可用的链接:', result);
            }
        });

        return div;
    }

    // 高亮匹配的文本
    highlightText(text, query) {
        if (!text || !query) return text || '';

        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
}

// Call initialization functions
document.addEventListener('DOMContentLoaded', () => {
    initializeTooltips();

    // 初始化搜索功能 - 简化版本
    console.log('正在初始化搜索功能...');

    // 检查DOM元素
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    console.log('搜索按钮:', searchBtn);
    console.log('搜索模态框:', searchModal);

    // 如果没有搜索模态框，创建一个简单的测试
    if (!searchModal) {
        console.log('创建简单的搜索测试功能');
        if (searchBtn) {
            searchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('搜索按钮被点击了！');

                // 创建简单的搜索模态框
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                `;

                modal.innerHTML = `
                    <div style="background: #2A2A2A; padding: 2rem; border-radius: 20px; max-width: 500px; width: 90%;">
                        <h2 style="color: white; margin-bottom: 1rem;">搜索功能测试</h2>
                        <input type="text" placeholder="输入搜索关键词..." style="width: 100%; padding: 0.8rem; background: #1A1A1A; border: 1px solid #4A4A4C; color: white; border-radius: 8px; margin-bottom: 1rem;">
                        <button onclick="this.closest('div').parentElement.remove()" style="background: #007AFF; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer;">关闭</button>
                    </div>
                `;

                document.body.appendChild(modal);

                // 点击背景关闭
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
            });
        }
    } else {
        // 使用完整的搜索功能
        try {
            const searchEngine = new SearchEngine();
            console.log('搜索功能初始化完成');

            // 全局暴露搜索功能用于调试
            window.testSearch = () => {
                if (searchEngine) {
                    searchEngine.openSearch();
                } else {
                    console.error('搜索引擎未初始化');
                }
            };
        } catch (error) {
            console.error('搜索功能初始化失败:', error);
        }
    }
});

// Console welcome message
console.log(`
🎉 欢迎来到我的技术博客！

🚀 这是一个现代化的技术博客网站
📱 完全响应式设计
🎨 苹果风格的UI界面
⚡ 高性能和流畅的动画效果

📧 如有合作意向，请联系我
🌟 感谢你的访问！

Made with ❤️ and lots of ☕
`);