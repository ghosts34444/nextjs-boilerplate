// styles/menu/menu.js
document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.getElementById('mobileMenuButton');
  const navMenu = document.getElementById('navMenu');
  const dropdowns = document.querySelectorAll('.dropdown');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  // Мобильное меню
  mobileBtn?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Закрытие при клике вне
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      navMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
      dropdowns.forEach(d => d.classList.remove('open'));
    }
  });

  // Выпадающее меню по клику
  dropdownToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.closest('.dropdown');
      parent.classList.toggle('open');
      dropdowns.forEach(d => {
        if (d !== parent) d.classList.remove('open');
      });
    });
  });

  // Для мобильных: если кликнули по ссылке — закрыть меню
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  });
});