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
            window.location.href = 'guides.html';
        }
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
});
