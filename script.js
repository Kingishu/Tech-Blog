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
        title: 'Unity 3D游戏项目',
        excerpt: '使用Unity引擎开发的3D冒险游戏，包含完整的角色控制和战斗系统。',
        category: '游戏开发',
        date: '2024-01-20',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        tech: ['Unity', 'C#', '3D建模', '动画'],
        description: '这是一个完整的3D冒险游戏项目，使用Unity引擎开发。游戏包含复杂的角色控制系统、实时战斗机制、任务系统和精美的3D场景。项目历时6个月完成，充分展示了Unity游戏开发的全流程。',
        details: '项目包含5个关卡，20种敌人类型，完整的音效系统和UI界面。使用了Unity的PhysX物理引擎和Post-processing Stack来实现高质量的视觉效果。'
    },
    {
        title: 'Web应用管理系统',
        excerpt: '基于React和Node.js的现代化Web应用管理系统',
        category: 'Web开发',
        date: '2024-01-15',
        video: 'video/胶囊大作战项目展示.mp4',
        tech: ['React', 'Node.js', 'MongoDB', 'Express'],
        description: '一个功能完善的Web应用管理系统，支持用户管理、数据分析和实时监控。采用前后端分离架构，具有良好的扩展性和维护性。',
        details: '系统包含用户认证、权限管理、数据可视化、实时通知等功能。使用了JWT进行身份验证，Socket.io实现实时通信。'
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
    },
    {
        title: '区块链DApp项目',
        excerpt: '去中心化应用(DApp)，基于以太坊平台',
        category: '区块链',
        date: '2023-12-28',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        tech: ['Solidity', 'Web3.js', 'React', 'IPFS'],
        description: '基于以太坊区块链的去中心化应用，实现了智能合约和代币经济系统。项目展示了区块链技术的实际应用。',
        details: 'DApp包含钱包连接、智能合约交互、去中心化存储等功能。使用了MetaMask进行用户认证，IPFS存储文件。'
    },
    {
        title: 'VR虚拟现实项目',
        excerpt: '沉浸式VR体验项目，支持多种VR设备',
        category: 'VR/AR',
        date: '2023-12-20',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        tech: ['Unity', 'C#', 'Oculus SDK', 'VRTK'],
        description: '使用Unity开发的VR虚拟现实项目，提供沉浸式的虚拟体验。支持多种VR设备，具有直观的交互方式。',
        details: '项目包含虚拟环境漫游、物体交互、手势识别等功能。优化了性能和用户体验，支持60fps的流畅运行。'
    }
];

// 文章数据库配置
const articlesDatabase = [
    {
        title: 'Web安全最佳实践',
        excerpt: '了解常见的Web安全威胁和防护措施，保护你的应用免受攻击。',
        category: '安全',
        date: '2023-12-10',
        gradient: 'gradient-1',
        link: 'web-security.html'
    },
    {
        title: 'Docker容器化部署',
        excerpt: '学习如何使用Docker进行应用容器化，简化部署和运维流程。',
        category: 'DevOps',
        date: '2023-12-05',
        gradient: 'gradient-2',
        link: 'docker-deployment.html'
    },
    {
        title: 'GraphQL API设计',
        excerpt: '掌握GraphQL的核心概念，设计高效的API接口。',
        category: '后端',
        date: '2023-11-30',
        gradient: 'gradient-3',
        link: 'graphql-api.html'
    },
    {
        title: 'Vue.js 3.0 新特性',
        excerpt: '深入理解Vue.js 3.0的Composition API和其他新特性。',
        category: '前端框架',
        date: '2023-11-25',
        gradient: 'gradient-4',
        link: 'vuejs-3-features.html'
    },
    {
        title: '微服务架构实践',
        excerpt: '了解微服务架构的设计原则和最佳实践。',
        category: '架构设计',
        date: '2023-11-20',
        gradient: 'gradient-5',
        link: 'microservices-architecture.html'
    },
    {
        title: 'Python数据分析',
        excerpt: '使用Python进行数据分析，包括Pandas、NumPy等库的使用。',
        category: '数据科学',
        date: '2023-11-15',
        gradient: 'gradient-6',
        link: 'python-data-analysis.html'
    },
    {
        title: '机器学习入门',
        excerpt: '从零开始学习机器学习的基本概念和算法。',
        category: '人工智能',
        date: '2023-11-10',
        gradient: 'gradient-1',
        link: 'ml-introduction.html'
    },
    {
        title: 'Kubernetes集群管理',
        excerpt: '学习如何管理和部署Kubernetes集群。',
        category: 'DevOps',
        date: '2023-11-05',
        gradient: 'gradient-2',
        link: 'kubernetes-management.html'
    },
    {
        title: '区块链技术解析',
        excerpt: '深入了解区块链的核心技术和应用场景。',
        category: '新兴技术',
        date: '2023-10-30',
        gradient: 'gradient-3',
        link: 'blockchain-technology.html'
    },
    {
        title: '测试网站1',
        excerpt: '测试内容1',
        category: '新兴技术',
        date: '2099-10-30',
        gradient: 'gradient-3',
        link: 'article/text1.html'
    },
    {
        title: '测试网站2',
        excerpt: '测试内容2',
        category: '新兴技术',
        date: '2088-10-30',
        gradient: 'gradient-3',
        link: 'article/text2.html'
    },
    {
        title: '测试网站3',
        excerpt: '测试内容3',
        category: '新兴技术',
        date: '2077-10-30',
        gradient: 'gradient-3',
        link: 'article/text3.html'
    },
    {
        title: '测试网站4',
        excerpt: '测试内容4',
        category: '新兴技术',
        date: '2066-10-30',
        gradient: 'gradient-3',
        link: 'article/text4.html'
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
            <p class="work-excerpt">${work.excerpt}</p>
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