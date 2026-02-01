// === Описания участников (включая Beex) ===
const DESCRIPTIONS = {
    "ghosts34444": "Я устал, я сделал все что смог....",
    "Mrkgrshtraklar": "Девушка с сюрпризом — в глазах искра, в руках фейерверк...",
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

// === Загрузка команды с нескольких серверов ===
async function loadTeam() {
    const loading = document.getElementById('loading');
    const teamGrid = document.getElementById('team-grid');
    const TARGET_LOGINS = ["ghosts34444", "Mrkgrshtraklar", "DoKFoReVe", "Lormunty"];

    try {
        // 🔥 ИСПРАВЛЕНО: убран пробел в конце URL
        const res = await fetch('https://loliland.net/apiv2/team', {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DarkGalaxy/1.0)' }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const data = await res.json();
        if (!data.team) throw new Error('Нет данных о командах');

        const allMembers = new Map();
        for (const [serverKey, members] of Object.entries(data.team)) {
            if (!Array.isArray(members)) continue;
            for (const m of members) {
                if (m.user?.login) {
                    allMembers.set(m.user.login.toLowerCase(), m);
                }
            }
        }

        const users = [];
        for (const login of TARGET_LOGINS) {
            const found = allMembers.get(login.toLowerCase());
            if (found) users.push(found);
        }

        const cards = users.map(m => {
            const user = m.user;
            const login = user.login;
            const role = translateRole(m.role);
            const desc = DESCRIPTIONS[login] || "Участник команды.";

            // 🔥 ИСПРАВЛЕНО: убран пробел после /medium/
            let avatar = 'https://cdn.discordapp.com/embed/avatars/0.png';
            if (user.avatarOrSkin?.id && user.avatarOrSkin.extension) {
                avatar = `https://loliland.ru/apiv2/user/avatar/medium/${user.avatarOrSkin.id}.${user.avatarOrSkin.extension}`;
            }

            const roleGradient = getRoleGradient(role);

            return `
                <div class="member-card">
                    <img class="member-avatar" 
                         src="${avatar}" 
                         alt="${login}"
                         onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    <div class="member-info">
                        <div class "member-name">${login}</div>
                        <span class="member-role" style="background: ${roleGradient};">${role}</span>
                        <div class="member-description">${desc}</div>
                    </div>
                </div>
            `;
        }).join('');

        loading.style.display = 'none';
        teamGrid.innerHTML = cards;

    } catch (err) {
        console.error('Ошибка загрузки команды:', err);
        loading.innerHTML = `<div class="error">⚠️ Не удалось загрузить данные.<br>Попробуйте позже.</div>`;
    }
}

// === Запуск ===
document.addEventListener('DOMContentLoaded', () => {
    loadTeam();
});


