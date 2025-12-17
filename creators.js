   const DESCRIPTIONS = {
        "ghosts34444": "Разработчик сайта и систем автоматизации. Отвечает за техническую поддержку и инфраструктуру проекта.",
        "Xan241": "Куратор цен на варпах. Собирает, проверяет и публикует информацию о стоимости предметов в торговле.",
        "MrkGrshtraklar": "Главный гайдер по моду Galacticraft. Составляет и обновляет гайды для новичков и опытных игроков.",
        "DoKFoReVe": "Активный модератор чата и варпов. Следит за соблюдением правил и помогает игрокам."
    };

    function translateRole(roleKey) {
        const map = {
            "junior_moderator": "Младший Модератор",
            "senior_moderator": "Старший Модератор",
            "moderator": "Модератор",
            "junior_admin": "Младший Администратор",     
            "admin": "Администратор",
            "senior_admin": "Старший Администратор",
            "chief_admin": "Главный Администратор",
            "curator": "Куратор"
        };
        return map[roleKey] || "Участник";
    }

    const ROLE_COLORS = {
        "Старший Модератор": "#e74c3c",
        "Старший Администратор": "#e91e63",
        "Модератор": "#f39c12",
        "Администратор": "#2ecc71",
        "Младший Модератор": "#3498db",
        "Младший Администратор": "#8b5cf6", 
        "Куратор": "#9b59b6"
    };

    function getRoleColor(role) {
        return ROLE_COLORS[role] || '#e74c3c';
    }

    async function loadTeam() {
        const loading = document.getElementById('loading');
        const teamGrid = document.getElementById('team-grid');
        const TARGET_LOGINS = ["ghosts34444", "Xan241", "Mrkgrshtraklar", "DoKFoReVe"];

        try {
            let users = [];

            const res = await fetch('https://loliland.ru/apiv2/team', {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DarkGalaxy/1.0)' }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.team?.dark_galaxy?.length) {
                    const apiMap = new Map();
                    for (const m of data.team.dark_galaxy) {
                        if (m.user?.login) {
                            apiMap.set(m.user.login, m);
                        }
                    }

                    for (const login of TARGET_LOGINS) {
                        if (apiMap.has(login)) {
                            users.push(apiMap.get(login));
                        }
                    }
                }
            }

            const cards = users.map(m => {
                const user = m.user;
                const login = user.login;

                const role = translateRole(m.role);
                const desc = DESCRIPTIONS[login] || "Член команды Dark Galaxy.";

                let avatar = 'https://cdn.discordapp.com/embed/avatars/0.png';
                if (user.avatarOrSkin?.id && user.avatarOrSkin.extension) {
                    avatar = `https://loliland.ru/apiv2/user/avatar/medium/${user.avatarOrSkin.id}.${user.avatarOrSkin.extension}`;
                }

                const roleColor = getRoleColor(role);

                return `
                    <div class="member-card">
                        <img class="member-avatar" src="${avatar}" alt="${login}"
                             onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                        <div class="member-info">
                            <div class="member-name">${login}</div>
                            <span class="member-role" style="background:${roleColor}">${role}</span>
                            <div class="member-description">${desc}</div>
                        </div>
                    </div>
                `;
            }).join('');

            loading.style.display = 'none';
            teamGrid.innerHTML = cards;
            teamGrid.style.display = 'grid';

        } catch (err) {
            loading.textContent = `Ошибка загрузки: ${err.message}`;
        }
    }

    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');

    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        menuBtn.style.display = 'none';
    });

    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('open');
        menuBtn.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
            menuBtn.style.display = 'block';
        }
    });

    const stars = document.getElementById('stars');
    for (let i = 0; i < 40; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.textContent = '✧';
        star.style.fontSize = `${Math.random() * 0.6 + 0.4}em`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `-30px`;
        star.style.opacity = Math.random() * 0.3 + 0.5;
        star.style.animationDuration = `${Math.random() * 15 + 10}s`;
        star.style.animationDelay = `${Math.random() * 10}s`;
        stars.appendChild(star);
    }

    document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('guides-toggle');
    const arrow = toggle.querySelector('.dropdown-arrow');
    const dropdown = document.getElementById('guides-dropdown');

    arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    toggle.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-arrow')) {
            window.location.href = 'guidesbook.html';
        }
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
});

    // ЗАПУСК
    loadTeam();
