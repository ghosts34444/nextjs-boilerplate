// ========================================
// 🌟 COMMON.JS (ОСНОВНОЙ САЙТ)
// ========================================

// === КОНФИГУРАЦИЯ ТЕМ ===
const THEMES = [
    { id: '', name: 'Pink', gradient: 'linear-gradient(135deg, #ff9f1c, #d63384)' },
    { id: 'theme-royal-blue', name: 'Royal Blue', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
    { id: 'theme-deep-purple', name: 'Deep Purple', gradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' },
    { id: 'theme-ghost', name: 'Ghost', gradient: 'linear-gradient(135deg, #80deea, #e0f7fa)' },
    { id: 'theme-neutral', name: 'Neutral', gradient: 'linear-gradient(135deg, #9ca3af, #d1d5db)' }
];

// === НАВИГАЦИЯ ===
const NAV_LINKS = [
    { text: 'ГЛАВНАЯ', url: '../index.html' },
    { text: 'ЦЕНЫ ВАРПА', url: 'warp-info.html' },
    { text: 'ГАЙДЫ', url: '../pages/guids/guids.html' },
    { text: 'ИВЕНТЫ', url: '../pages/events/events.html' }
];

// === COOKIES ===
function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

// === ПРИМЕНЕНИЕ ТЕМЫ ===
function applyTheme(themeId) {
    document.body.className = themeId;
    setCookie('site_theme', themeId);
    
    // Обновляем активную тему в UI
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.theme === themeId);
    });
}

// === ГЕНЕРАЦИЯ НАВИГАЦИИ ===
function generateNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // Очищаем меню
    navMenu.innerHTML = '';
    
    // Генерируем ссылки
    NAV_LINKS.forEach((link, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.url;
        a.className = 'nav-link';
        a.textContent = link.text;
        
        const currentPath = window.location.pathname;
        if (currentPath.includes(link.url) || (index === 0 && currentPath.endsWith('/'))) {
            a.classList.add('active');
        }
        
        li.appendChild(a);
        navMenu.appendChild(li);
    });
    
    // Добавляем ВЫПАДАЮЩЕЕ МЕНЮ ТЕМ
    const themesLi = document.createElement('li');
    themesLi.className = 'nav-dropdown';
    themesLi.innerHTML = `
        <a href="#" class="nav-link">ТЕМЫ ▾</a>
        <div class="dropdown-menu">
            ${THEMES.map(t => `
                <button class="dropdown-item" data-theme="${t.id}" onclick="applyTheme('${t.id}'); return false;">
                    <div class="theme-dot" style="background:${t.gradient}"></div>
                    <span>${t.name}</span>
                </button>
            `).join('')}
        </div>
    `;
    navMenu.appendChild(themesLi);
    
    // Устанавливаем активную тему из cookies
    const savedTheme = getCookie('site_theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
}

// === МОБИЛЬНОЕ МЕНЮ ===
let mobileMenuActive = false;

function cleanupMobileMenu() {
    if (mobileMenuActive) {
        document.querySelectorAll('.mobile-menu-overlay').forEach(el => el.remove());
        const btn = document.querySelector('.menu-toggle');
        if (btn) btn.classList.remove('open');
        document.body.style.overflow = '';
        mobileMenuActive = false;
    }
}

function createMobileMenu() {
    cleanupMobileMenu();
    
    const mobileBtn = document.querySelector('.menu-toggle');
    if (!mobileBtn) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    
    let menuHtml = '<ul class="mobile-nav">';
    NAV_LINKS.forEach(link => {
        menuHtml += `<li><a href="${link.url}">${link.text}</a></li>`;
    });
    
    // Добавляем темы в мобильное меню
    menuHtml += `
        <li class="mobile-themes-header">🎨 ТЕМЫ ОФОРМЛЕНИЯ</li>
        ${THEMES.map(t => `
            <li>
                <button class="mobile-theme-btn" onclick="applyTheme('${t.id}'); cleanupMobileMenu();">
                    <div class="theme-dot" style="background:${t.gradient}"></div>
                    <span>${t.name}</span>
                </button>
            </li>
        `).join('')}
    </ul>`;
    
    overlay.innerHTML = menuHtml;
    document.body.appendChild(overlay);
    
    // Открытие/закрытие
    const toggle = () => {
        overlay.classList.toggle('active');
        mobileBtn.classList.toggle('open');
        document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    };
    
    mobileBtn.onclick = toggle;
    
    // Закрытие при клике на ссылку
    overlay.querySelectorAll('a').forEach(a => {
        a.onclick = () => cleanupMobileMenu();
    });
    
    mobileMenuActive = true;
}

// === ИНИЦИАЛИЗАЦИЯ МЕНЮ ===
function initMenu() {
    if (window.innerWidth <= 768) {
        cleanupMobileMenu();
        createMobileMenu();
    } else {
        cleanupMobileMenu();
        generateNavigation();
    }
}

// === ЗВЁЗДЫ (ПАДАЮЩИЕ) ===
function initStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;
    
    // Очищаем если уже есть
    container.innerHTML = '';
    
    const symbols = ['•', '✦', '✧', '★'];
    let starCount = 0;
    const MAX_STARS = 30;
    const TOP_OFFSET = 120;
    
    // Создаём CSS для анимации
    if (!document.getElementById('stars-animation-style')) {
        const style = document.createElement('style');
        style.id = 'stars-animation-style';
        style.textContent = `
            @keyframes fall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.9;
                }
                100% {
                    transform: translateY(${window.innerHeight}px) rotate(720deg);
                    opacity: 0;
                }
            }
            .falling-star {
                position: absolute;
                color: white;
                font-weight: bold;
                pointer-events: none;
                animation: fall linear forwards;
            }
        `;
        document.head.appendChild(style);
    }
    
    function createStar() {
        if (starCount >= MAX_STARS) return;
        
        const star = document.createElement('div');
        star.className = 'falling-star';
        star.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        const safeTop = TOP_OFFSET + Math.random() * (window.innerHeight - TOP_OFFSET);
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = safeTop + 'px';
        
        const size = 0.8 + Math.random() * 0.8;
        star.style.fontSize = size + 'em';
        
        const duration = 6 + Math.random() * 6;
        star.style.animationDuration = duration + 's';
        
        setTimeout(() => {
            if (star.parentNode) {
                star.remove();
                starCount--;
            }
        }, duration * 1000);
        
        container.appendChild(star);
        starCount++;
    }
    
    // Генерация звёзд
    setInterval(createStar, 1000);
    
    // Создаём первые звёзды сразу
    for (let i = 0; i < 10; i++) {
        setTimeout(createStar, i * 200);
    }
}

// === ЗАПУСК ===
function run() {
    initStars();
    initMenu();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
} else {
    run();
}

window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        initMenu();
    }, 150);
});