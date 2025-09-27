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

// 生成文章目录
function generateArticlesCatalog() {
    const catalogContent = document.querySelector('.catalog-content');
    if (!catalogContent) return;

    catalogContent.innerHTML = '';

    articlesCatalog.forEach((category, categoryIndex) => {
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
            sectionTitle.className = 'section-title';
            sectionTitle.textContent = section.title;

            const articlesList = document.createElement('div');
            articlesList.className = 'catalog-articles';

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

            sectionElement.appendChild(sectionTitle);
            sectionElement.appendChild(articlesList);
            sectionsContainer.appendChild(sectionElement);
        });

        categoryElement.appendChild(sectionsContainer);
        catalogContent.appendChild(categoryElement);
    });
}

// 计算分类下的文章总数
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
                    },
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
        title: 'Unity对象池技术详解',
        excerpt: '深入解析Unity对象池技术，包括基础实现、通用对象池、对象池管理器和最佳实践。',
        category: 'Unity开发',
        date: '2024-09-27',
        gradient: 'gradient-1',
        link: 'article/unity-object-pooling.html'
    },
    {
        title: 'Unity存储系统设计与实现',
        excerpt: '详细介绍Unity存储系统的架构设计，包括数据结构、JSON序列化、本地存储和云存储集成。',
        category: 'Unity开发',
        date: '2024-09-27',
        gradient: 'gradient-2',
        link: 'article/unity-storage-system.html'
    },
    {
        title: 'Unity射线检测技术详解',
        excerpt: '全面讲解Unity射线检测的原理、方法和应用场景，包括基础检测、特殊形状检测和性能优化。',
        category: 'Unity开发',
        date: '2024-09-27',
        gradient: 'gradient-3',
        link: 'article/unity-raycasting.html'
    },
    {
        title: 'Unity物理引擎深度解析',
        excerpt: '深入探讨Unity物理引擎的核心组件、刚体系统、碰撞体、关节系统和性能优化技术。',
        category: 'Unity开发',
        date: '2024-09-27',
        gradient: 'gradient-4',
        link: 'article/unity-physics-engine.html'
    },
    {
        title: 'JavaScript异步编程详解',
        excerpt: '深入理解Promise、async/await、事件循环等JavaScript异步编程核心概念。',
        category: '前端开发',
        date: '2024-09-25',
        gradient: 'gradient-5',
        link: 'article/javascript-async.html'
    },
    {
        title: '排序算法性能对比',
        excerpt: '对比分析各种排序算法的时间复杂度、空间复杂度和实际应用场景。',
        category: '算法与数据结构',
        date: '2024-09-20',
        gradient: 'gradient-6',
        link: 'article/sorting-algorithms.html'
    },
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

// Function to create article card
function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'article-card';
    card.setAttribute('data-article-title', article.title);
    card.innerHTML = `
        <div class="article-image">
            <div class="article-gradient ${article.gradient}"></div>
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

// Call initialization functions
document.addEventListener('DOMContentLoaded', () => {
    initializeTooltips();
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