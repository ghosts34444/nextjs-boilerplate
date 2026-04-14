// ========================================
// ⚙️ КОНФИГУРАЦИЯ
// ========================================
const THEMES = [
    { id: '', name: 'Pink', gradient: 'linear-gradient(135deg, #ff9f1c, #d63384)', dot: '#d63384' },
    { id: 'theme-royal-blue', name: 'Royal Blue', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', dot: '#3b82f6' },
    { id: 'theme-deep-purple', name: 'Deep Purple', gradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', dot: '#8b5cf6' },
    { id: 'theme-ghost', name: 'Ghost', gradient: 'linear-gradient(135deg, #80deea, #e0f7fa)', dot: '#e0f7fa' },
    { id: 'theme-neutral', name: 'Neutral', gradient: 'linear-gradient(135deg, #9ca3af, #d1d5db)', dot: '#9ca3af' },
    { id: 'theme-black-amber', name: 'Black Amber', gradient: 'linear-gradient(135deg, #ff5722, #ff9800)', dot: '#ff5722' }
];

// ========================================
// 🍪 COOKIES
// ========================================
function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

// ========================================
// 🎨 ТЕМЫ
// ========================================
function applyTheme(themeId) {
    // Сброс всех классов тем
    document.body.className = '';
    if (themeId) {
        document.body.classList.add(themeId);
    }
    
    setCookie('site_theme', themeId);
    updateThemeUI(themeId);
}

function updateThemeUI(activeTheme) {
    // Обновляем ПК меню
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === activeTheme);
    });
    
    // Обновляем мобильное меню
    document.querySelectorAll('.mobile-theme-card').forEach(card => {
        card.classList.toggle('active', card.dataset.theme === activeTheme);
    });
}

// ========================================
// 🏗️ ГЕНЕРАЦИЯ НАВБАРА
// ========================================
function buildNavbar() {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    
    nav.innerHTML = `
        <a href="index.html" class="logo">
            <span class="logo-gradient">🌌 DarkGalaxy</span>
        </a>
        
        <div class="desktop-nav">
            <ul class="desktop-links">
                <li><a href="index.html">Главная</a></li>
                <li><a href="#">Варп</a></li>
                <li><a href="#">Гайды</a></li>
                <li><a href="#">Ивенты</a></li>
            </ul>
            
            <div class="theme-dropdown">
                <button class="theme-btn">
                    🎨 Темы
                </button>
                <div class="theme-list" id="desktop-theme-list"></div>
            </div>
        </div>
        
        <button class="mobile-toggle" id="mobile-toggle" aria-label="Меню">
            <span></span>
            <span></span>
            <span></span>
        </button>
    `;
    
    document.body.prepend(nav);
    renderDesktopThemes();
}

function renderDesktopThemes() {
    const container = document.getElementById('desktop-theme-list');
    if (!container) return;
    
    THEMES.forEach(theme => {
        const btn = document.createElement('button');
        btn.className = 'theme-option';
        btn.dataset.theme = theme.id;
        btn.innerHTML = `
            <div class="theme-dot" style="background: ${theme.dot}"></div>
            <span>${theme.name}</span>
        `;
        btn.onclick = () => applyTheme(theme.id);
        container.appendChild(btn);
    });
}

// ========================================
// 📱 МОБИЛЬНОЕ МЕНЮ
// ========================================
function buildMobileMenu() {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.id = 'mobile-overlay';
    
    let themesHTML = '';
    THEMES.forEach(theme => {
        themesHTML += `
            <div class="mobile-theme-card" data-theme="${theme.id}">
                <div class="mobile-theme-preview" style="background: ${theme.gradient}"></div>
                <div class="mobile-theme-name">${theme.name}</div>
            </div>
        `;
    });
    
    overlay.innerHTML = `
        <div class="mobile-nav-inner">
            <a href="index.html" class="mobile-link">🏠 Главная</a>
            <a href="#" class="mobile-link">🚀 Варп</a>
            <a href="#" class="mobile-link">📖 Гайды</a>
            <a href="#" class="mobile-link">🎉 Ивенты</a>
            
            <div class="mobile-themes-section">
                <div class="mobile-themes-title">🎨 Темы оформления</div>
                <div class="mobile-theme-grid">
                    ${themesHTML}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    setupMobileMenu();
}

function setupMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const overlay = document.getElementById('mobile-overlay');
    
    if (!toggle || !overlay) return;
    
    // Открытие/закрытие
    toggle.onclick = () => {
        const isOpen = overlay.classList.contains('active');
        overlay.classList.toggle('active');
        toggle.classList.toggle('open');
        document.body.style.overflow = isOpen ? '' : 'hidden';
    };
    
    // Закрытие при клике вне меню (не нужно, т.к. меню на весь экран)
    
    // Выбор темы (с предпросмотром, без закрытия)
    overlay.querySelectorAll('.mobile-theme-card').forEach(card => {
        // Предпросмотр при удержании
        let pressTimer;
        
        const startPreview = () => {
            const themeId = card.dataset.theme;
            applyTheme(themeId);
        };
        
        card.addEventListener('mousedown', () => {
            pressTimer = setTimeout(startPreview, 300);
        });
        
        card.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(startPreview, 300);
            e.preventDefault();
        });
        
        const cancelPreview = () => {
            clearTimeout(pressTimer);
        };
        
        card.addEventListener('mouseup', cancelPreview);
        card.addEventListener('mouseleave', cancelPreview);
        card.addEventListener('touchend', cancelPreview);
        
        // Клик для выбора (без закрытия меню)
        card.onclick = (e) => {
            e.preventDefault();
            applyTheme(card.dataset.theme);
        };
    });
}

// ========================================
// ✨ ЗВЕЗДЫ
// ========================================
function createStars() {
    const container = document.getElementById('stars');
    if (!container) return;
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.color = ['#fff', '#ffd166', '#00b4d8', '#d63384'][Math.floor(Math.random() * 4)];
        star.style.animationDelay = `${Math.random() * 3}s`;
        container.appendChild(star);
    }
}

// ========================================
// 🚀 ИНИЦИАЛИЗАЦИЯ
// ========================================
function init() {
    buildNavbar();
    buildMobileMenu();
    createStars();
    
    // Применяем сохраненную тему
    const savedTheme = getCookie('site_theme');
    applyTheme(savedTheme);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}