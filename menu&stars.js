// shared/menu-stars.js

document.addEventListener('DOMContentLoaded', () => {
    // === 1. БОКОВОЕ МЕНЮ ===
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('close-sidebar');

    if (menuBtn && sidebar && closeBtn) {
        // Открыть меню
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            menuBtn.style.display = 'none';
        });

        // Закрыть меню (крестик)
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
            menuBtn.style.display = 'block';
        });

        // Закрыть меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
                menuBtn.style.display = 'block';
            }
        });
    }

    // === 2. ВЫПАДАЮЩЕЕ МЕНЮ "ГАЙДЫ" ===
    const guidesToggle = document.getElementById('guides-toggle');
    const guidesDropdown = document.getElementById('guides-dropdown');
    const dropdownArrow = guidesToggle ? guidesToggle.querySelector('.dropdown-arrow') : null;

    if (guidesToggle && guidesDropdown && dropdownArrow) {
        // Клик по стрелке — только открыть/закрыть
        dropdownArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            guidesDropdown.style.display = guidesDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Клик по кнопке "Гайды" (не по стрелке) — перейти на общую страницу
        guidesToggle.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-arrow')) {
                window.location.href = 'guides.html';
            }
        });

        // Закрыть выпадающее меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!guidesToggle.contains(e.target) && !guidesDropdown.contains(e.target)) {
                guidesDropdown.style.display = 'none';
            }
        });
    }

    // === 3. ПАДАЮЩИЕ ЗВЁЗДЫ ===
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
        const count = 40;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.textContent = '✧'; // Падающая звезда
            const size = Math.random() * 0.6 + 0.4;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;
            const startX = Math.random() * 100;
            star.style.fontSize = `${size}em`;
            star.style.left = `${startX}vw`;
            star.style.top = `-30px`;
            star.style.opacity = Math.random() * 0.3 + 0.5;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `${delay}s`;
            starsContainer.appendChild(star);
        }
    }
});
