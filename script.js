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
                if (skillBar) {
                    const width = skillBar.style.width;
                    skillBar.style.width = '0';
                    setTimeout(() => {
                        skillBar.style.width = width;
                    }, 200);
                }
            }
        }
    });
}, observerOptions);

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
        tech: ['Unity', 'C#', 'PS'],
        description: '这是一个完整的2D卡牌游戏项目，使用Unity引擎开发。游戏包含的地图系统、卡牌对战系统、回合制系统,存储系统,充分展示了Unity游戏开发的全流程。',
        details: '项目包含5个关卡，20种敌人类型，完整的音效系统和UI界面。使用了Unity的PhysX物理引擎和Post-processing Stack来实现高质量的视觉效果。'
    },
    {
        title: '胶囊大作战',
        excerpt: '基于Unity3D的射击小游戏',
        category: '游戏开发',
        date: '2024-01-15',
        video: 'video/胶囊大作战项目展示.mp4',
        tech: ['Unity', 'C#', 'PS', 'Blender'],
        description: '一个功能完整的2.5D射击游戏,类吸血鬼幸存者玩法,玩家需要在平台内,击毙一定数量的敌人,进入下一关卡,在最后一关无尽模式中,取得更高的分数',
        details: '系统包含种子化地图生成,Fisher-Yates算法实现敌人随机生成,完整的武器系统,基于对象池的子弹,特效,音频管理系统。'
    },
    {
        title: '移动端APP开发',
        excerpt: '跨平台移动应用，支持iOS和Android双端',
        category: '移动开发',
        date: '2024-01-10',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        tech: ['React Native', 'TypeScript', 'Firebase'],
        description: '使用React Native开发的跨平台移动应用，一次编码多端运行。应用具有流畅的用户体验和原生性能。',
        details: '应用包含社交功能、实时聊天、地图定位等模块。使用了Firebase作为后端服务，支持推送通知和数据同步。'
    },
    {
        title: 'AI机器学习项目',
        excerpt: '基于深度学习的图像识别系统',
        category: '人工智能',
        date: '2024-01-05',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        tech: ['Python', 'TensorFlow', 'OpenCV', 'Docker'],
        description: '使用深度学习技术开发的图像识别系统，能够准确识别多种物体和场景。项目包含数据预处理、模型训练和部署等完整流程。',
        details: '系统准确率达到95%以上，支持实时图像识别和批量处理。使用了卷积神经网络(CNN)和数据增强技术。'
    }
];

// 文章数据库配置
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

    card.innerHTML = `
        <div class="video-container">
            <video class="work-video" src="${work.video}" preload="metadata" controls></video>
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
            <a href="${article.link || '#'}" class="article-link">阅读更多 →</a>
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