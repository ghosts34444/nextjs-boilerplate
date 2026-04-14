// ========================================
// МЕНЮ (Автоматическая загрузка)
// ========================================

// Конфигурация меню
const menuConfig = [
    { name: 'Консоль', url: '/console', permission: 'console.view', icon: '' },
    { name: 'Файлы', url: '/admin/files', permission: 'files.view', icon: '' },
    { name: 'Админы', url: '/admin/admin', permission: 'admins.view', icon: '' },
    { name: 'Роли', url: '/admin/roles', permission: 'roles.view', icon: '' },
    { name: 'Цены', url: '/admin/prices', permission: 'prices.view', icon: '' },
    { name: 'Гайды', url: '/admin/guides', permission: 'guides.view', icon: '' },
    { name: 'Ивенты', url: '/admin/events', permission: 'events.view', icon: '' },
];

// 🔥 ЗАГРУЗКА МЕНЮ АВТОМАТИЧЕСКИ
async function loadNavbar() {
    const container = document.getElementById('navbar-container');
    if (!container) {
        console.error('❌ Нет элемента #navbar-container');
        return;
    }
    
    try {
        const response = await fetch('/admin/components/navbar.html');
        if (!response.ok) throw new Error('Не удалось загрузить navbar');
        
        const html = await response.text();
        container.innerHTML = html;
        
        console.log('✅ Navbar загружен');
        
        // После загрузки — инициализируем
        await initNavbar();
        
    } catch (error) {
        console.error('❌ Ошибка загрузки navbar:', error);
    }
}

// Инициализация после загрузки
async function initNavbar() {
    await loadUserProfile();
    
    // Закрытие dropdown при клике вне
    document.addEventListener('click', (e) => {
        const profile = document.querySelector('.navbar-profile');
        if (profile && !profile.contains(e.target)) {
            closeDropdown();
        }
    });
}

// Загрузка профиля
async function loadUserProfile() {
    try {
        const response = await fetch('/api/auth/check', { credentials: 'include' });
        const data = await response.json();
        
        console.log('📡 Auth check response:', data);
        
        if (!data.authenticated) {
            window.location.href = '/auth';
            return;
        }
        
        const user = data.user;
        console.log('👤 User data:', user);
        
        // Обновляем профиль в навбаре
        const profileName = document.getElementById('profile-name');
        const profileRole = document.getElementById('profile-role');
        const profileAvatar = document.getElementById('profile-avatar');
        
        if (profileName) {
            profileName.textContent = user.username;
            console.log('✅ Profile name set:', user.username);
        }
        
        if (profileRole) {
            profileRole.textContent = user.roleDisplay || user.roleName || 'Админ';
            profileRole.style.background = user.roleColor || 'linear-gradient(135deg, #8a6dff, #6d5dff)';
        }
        
        if (profileAvatar) {
            // Пробуем loli_nick, потом username
            const nickname = user.loliNick || user.username;
            console.log('🔍 Looking for avatar with nickname:', nickname);
            
            const avatarUrl = await getLoliAvatar(nickname);
            console.log('🖼️ Avatar URL:', avatarUrl);
            
            profileAvatar.src = avatarUrl;
            profileAvatar.onerror = () => {
                console.error('❌ Failed to load avatar:', avatarUrl);
                profileAvatar.src = '/assets/default-avatar.png';
            };
        }
        
        // Обновляем dropdown
        updateDropdown(user);
        
        // Генерируем навигацию
        generateNavigation(user.permissions || {});
        
    } catch (error) {
        console.error('❌ Ошибка загрузки профиля:', error);
    }
}

// Генерация навигации
function generateNavigation(userPermissions) {
    const nav = document.getElementById('navbar-nav');
    if (!nav) return;
    
    nav.innerHTML = '';
    
    menuConfig.forEach(item => {
        const hasAccess = userPermissions.all || userPermissions[item.permission];
        
        if (hasAccess) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.url;
            a.textContent = `${item.icon} ${item.name}`;
            
            if (window.location.pathname === item.url || 
                (item.url !== '/' && window.location.pathname.startsWith(item.url))) {
                a.classList.add('active');
            }
            
            li.appendChild(a);
            nav.appendChild(li);
        }
    });
}

async function getLoliAvatar(nickname) {
    if (!nickname) {
        console.warn('⚠️ No nickname provided');
        return '/assets/default-avatar.png';
    }
    
    try {
        console.log('🔍 Searching LoliLand for:', nickname);
        
        const searchResponse = await fetch(
            `https://loliland.ru/apiv2/user/search?limit=1&login=${encodeURIComponent(nickname)}`
        );
        
        if (!searchResponse.ok) {
            console.warn('⚠️ LoliLand API error:', searchResponse.status);
            return '/assets/default-avatar.png';
        }
        
        const data = await searchResponse.json();
        console.log('📦 LoliLand API Response:', data);
        
        const user = data.users?.elements?.[0];
        
        if (!user) {
            console.warn('⚠️ User not found on LoliLand');
            return '/assets/default-avatar.png';
        }
        
        // Проверяем есть ли аватарка
        if (user.avatarOrSkin && user.avatarOrSkin.id) {
            const avatarId = user.avatarOrSkin.id;
            const extension = user.avatarOrSkin.extension || 'webp';
            
            // Правильный URL
            const avatarUrl = `https://loliland.ru/apiv2/user/avatar/medium/${avatarId}.${extension}`;
            
            console.log('✅ Avatar found:', avatarUrl);
            return avatarUrl;
        }
        
        console.log('ℹ️ No avatar/skin found');
        return '/assets/default-avatar.png';
        
    } catch (error) {
        console.error('❌ Ошибка получения аватарки:', error);
        return '/assets/default-avatar.png';
    }
}

function updateDropdown(user) {
    console.log('🔄 Updating dropdown for user:', user);
    
    // Обновляем имя в dropdown
    const dropdownName = document.getElementById('dropdown-name');
    if (dropdownName) {
        dropdownName.textContent = user.username;
        console.log('✅ Dropdown name set:', user.username);
    }
    
    // Обновляем аватарку в dropdown
    const dropdownAvatar = document.getElementById('dropdown-avatar');
    if (dropdownAvatar) {
        const nickname = user.loliNick || user.username;
        getLoliAvatar(nickname).then(url => {
            dropdownAvatar.src = url;
            console.log('✅ Dropdown avatar set:', url);
        });
    }
    
    // Обновляем роли
    const dropdownRoles = document.getElementById('dropdown-roles');
    if (dropdownRoles) {
        dropdownRoles.innerHTML = '';
        
        // Роль с LoliLand
        const loliRole = document.createElement('span');
        loliRole.className = 'role-badge role-loli';
        loliRole.textContent = user.loliNick ? `Loli: ${user.loliNick}` : 'Loli: не привязан';
        dropdownRoles.appendChild(loliRole);
        
        // Роль сайта
        const siteRole = document.createElement('span');
        siteRole.className = 'role-badge role-site';
        siteRole.textContent = user.roleDisplay || user.roleName || 'Админ';
        siteRole.style.background = user.roleColor || '';
        dropdownRoles.appendChild(siteRole);
        
        console.log('✅ Dropdown roles updated');
    }
}

// Выход
async function logout() {
    if (!confirm('Выйти из аккаунта?')) return;
    try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        window.location.href = '/auth';
    } catch (error) {
        console.error('❌ Ошибка выхода:', error);
        alert('Ошибка при выходе');
    }
}

// Смена пароля
function openPasswordModal() {
    const modal = document.getElementById('password-modal');
    if (modal) modal.classList.add('active');
    closeDropdown();
}

function closePasswordModal() {
    const modal = document.getElementById('password-modal');
    if (modal) modal.classList.remove('active');
}

async function changePassword() {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!oldPassword || !newPassword) {
        alert('Заполните все поля');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Пароль должен быть не менее 6 символов');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword, newPassword }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('✅ Пароль успешно изменён!');
            closePasswordModal();
            await logout();
        } else {
            alert('❌ ' + (data.error || 'Ошибка при смене пароля'));
        }
    } catch (error) {
        console.error('❌ Ошибка смены пароля:', error);
        alert('Ошибка подключения к серверу');
    }
}

// Toggle dropdown
function toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

function closeDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) dropdown.classList.remove('active');
}

// Экспорт для HTML
window.toggleDropdown = toggleDropdown;
window.closeDropdown = closeDropdown;
window.logout = logout;
window.openPasswordModal = openPasswordModal;
window.closePasswordModal = closePasswordModal;
window.changePassword = changePassword;

// 🚀 Автозагрузка при загрузке страницы
document.addEventListener('DOMContentLoaded', loadNavbar);