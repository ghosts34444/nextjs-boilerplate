// === Описания участников ===
const DESCRIPTIONS = {
    "ghosts34444": "Я устал, я сделал все что смог....",
    "Mrkgrshtraklar": "Девушка с сюрпризом — в глазах искра, в руках фейерверк....",
    "DoKFoReVe": "Документация",
    "Lormunty": "Пописал против ветра"
};

// === Перевод ролей ===
function translateRole(roleKey) {
    const map = {
        "junior_moderator": "Младший Модератор",
        "senior_moderator": "Старший Модератор",
        "moderator": "Модератор",
        "junior_admin": "Младший Администратор",
        "admin": "Администратор",
        "senior_admin": "Старший Администратор",
        "chief_admin": "Главный Администратор",
        "curator": "Куратор",
        "helper": "Хелпер",
        "senior_helper": "Старший Хелпер"
    };
    return map[roleKey] || "Участник";
}

// === Цвета ролей ===
const ROLE_GRADIENTS = {
    "Хелпер": "linear-gradient(to bottom, #e3fde9, #a0a0a0)",
    "Старший Хелпер": "linear-gradient(to bottom, #d6ecdc, #70dbc1)",
    "Младший Модератор": "linear-gradient(to bottom, #dcfed1, #6be6ad)",
    "Модератор": "linear-gradient(to bottom, #fafeb0, #9ee87b)",
    "Старший Модератор": "linear-gradient(to bottom, #fcfbb4, #8ad627)",
    "Младший Администратор": "linear-gradient(to bottom, #dcfedb, #44dc81)",
    "Администратор": "linear-gradient(to bottom, #dbfdd7, #1cafc3)",
    "Старший Администратор": "linear-gradient(to bottom, #d9f8fe, #2798cd)",
    "Главный Администратор": "linear-gradient(to bottom, #73f4fe, #0286e1)",
    "Куратор": "linear-gradient(to bottom, #cafcf6, #8c66ff)"
};

function getRoleGradient(role) {
    return ROLE_GRADIENTS[role] || 'linear-gradient(135deg, #7f8c8d, #95a5a6)';
}

// === Глобальные данные ===
let creatorsData = [];
let currentCreatorIndex = 0;

// === Загрузка данных ===
async function loadTeam() {
    const loading = document.getElementById('loading');
    const TARGET_LOGINS = ["ghosts34444", "Mrkgrshtraklar", "DoKFoReVe", "Lormunty"];

    try {
        const res = await fetch('https://loliland.net/apiv2/team', {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DarkGalaxy/1.0)' }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const data = await res.json();
        if (!data.team) throw new Error('Нет данных о командах');

        // Собираем всех участников
        const allMembers = new Map();
        for (const [serverKey, members] of Object.entries(data.team)) {
            if (!Array.isArray(members)) continue;
            for (const m of members) {
                if (m.user?.login) {
                    allMembers.set(m.user.login.toLowerCase(), m);
                }
            }
        }

        // Формируем данные целевых создателей
        creatorsData = TARGET_LOGINS.map(login => {
            const found = allMembers.get(login.toLowerCase());
            if (!found) return null;
            
            const user = found.user;
            const role = translateRole(found.role);
            const desc = DESCRIPTIONS[login] || "Участник команды.";
            
            let avatar = 'https://cdn.discordapp.com/embed/avatars/0.png';
            if (user.avatarOrSkin?.id && user.avatarOrSkin.extension) {
                avatar = `https://loliland.ru/apiv2/user/avatar/medium/${user.avatarOrSkin.id}.${user.avatarOrSkin.extension}`;
            }
            
            return {
                login: login,
                role: role,
                roleGradient: getRoleGradient(role),
                description: desc,
                avatar: avatar
            };
        }).filter(Boolean);

        if (creatorsData.length === 0) {
            throw new Error('Не найдены целевые участники');
        }

        // Создаём интерфейс
        createCreatorsSwitcher();
        renderCreator(currentCreatorIndex);
        
        loading.style.display = 'none';

    } catch (err) {
        console.error('Ошибка загрузки команды:', err);
        loading.innerHTML = `<div class="error">⚠️ ${err.message || 'Не удалось загрузить данные'}</div>`;
        loading.className = 'error';
    }
}

// === Создание переключателя ===
function createCreatorsSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'creators-switcher';
    
    // Стрелка влево
    const prevBtn = document.createElement('div');
    prevBtn.className = 'nav-arrow';
    prevBtn.innerHTML = '←';
    prevBtn.onclick = () => changeCreator(-1);
    prevBtn.id = 'prevCreator';
    
    // Список кнопок
    const list = document.createElement('div');
    list.className = 'creators-list';
    list.id = 'creatorsList';
    
    creatorsData.forEach((creator, index) => {
        const btn = document.createElement('button');
        btn.className = `creator-btn ${index === 0 ? 'active' : ''}`;
        btn.textContent = creator.login;
        btn.dataset.index = index;
        btn.onclick = () => changeCreatorTo(index);
        list.appendChild(btn);
    });
    
    // Стрелка вправо
    const nextBtn = document.createElement('div');
    nextBtn.className = 'nav-arrow';
    nextBtn.innerHTML = '→';
    nextBtn.onclick = () => changeCreator(1);
    nextBtn.id = 'nextCreator';
    
    switcher.appendChild(prevBtn);
    switcher.appendChild(list);
    switcher.appendChild(nextBtn);
    
    // Вставляем после заголовка
    const pageTitle = document.querySelector('.page-title');
    pageTitle.parentNode.insertBefore(switcher, pageTitle.nextSibling);
}

// === Переключение на конкретного создателя ===
function changeCreatorTo(index) {
    if (index < 0 || index >= creatorsData.length) return;
    
    currentCreatorIndex = index;
    renderCreator(index);
    
    // Обновляем активную кнопку
    document.querySelectorAll('.creator-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    // Обновляем состояние стрелок
    updateArrows();
}

// === Переключение на следующего/предыдущего ===
function changeCreator(delta) {
    const newIndex = currentCreatorIndex + delta;
    if (newIndex < 0 || newIndex >= creatorsData.length) return;
    
    changeCreatorTo(newIndex);
}

// === Обновление состояния стрелок ===
function updateArrows() {
    const prevBtn = document.getElementById('prevCreator');
    const nextBtn = document.getElementById('nextCreator');
    
    if (prevBtn) prevBtn.disabled = currentCreatorIndex === 0;
    if (nextBtn) nextBtn.disabled = currentCreatorIndex === creatorsData.length - 1;
}

// === Рендер карточки создателя ===
function renderCreator(index) {
    const creator = creatorsData[index];
    if (!creator) return;
    
    // Создаём контейнер, если его нет
    let container = document.getElementById('creatorContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'creatorContainer';
        container.className = 'creator-fullscreen';
        
        const grid = document.getElementById('team-grid');
        grid.parentNode.insertBefore(container, grid);
    }
    
    // Рендерим содержимое
    container.innerHTML = `
        <div class="creator-avatar-col">
            <img src="${creator.avatar}" class="creator-avatar-bg">
            <div class="creator-avatar-overlay"></div>
            <img src="${creator.avatar}" class="creator-avatar-img">
        </div>
        <div class="creator-info-col">
            <h2 class="creator-name-large">${creator.login}</h2>
            <div class="creator-role-large" style="background: ${creator.roleGradient};">${creator.role}</div>
            <div class="creator-description-large">${creator.description}</div>
        </div>
    `;
}

// === Запуск ===
document.addEventListener('DOMContentLoaded', loadTeam);