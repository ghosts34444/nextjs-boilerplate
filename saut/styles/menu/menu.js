// styles/menu/menu.js
document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.querySelector('.menu-toggle');
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';

  // Создаём мобильное меню на основе ПК-меню
  const navMenu = document.querySelector('.nav-menu');
  const mobileNav = document.createElement('ul');
  mobileNav.className = 'mobile-nav';

  // Группы
  const groups = {
    'Основное': ['ГЛАВНАЯ', 'ЦЕНЫ ВАРПА', 'УСЛУГИ', 'О САЙТЕ', 'О СЕРВЕРЕ', 'СОЗДАТЕЛИ'],
    'Гайды': ['МАГИЯ', 'ТЕХНОЛОГИИ', 'АВТОМАТИЗАЦИЯ', 'ПЧЕЛОВОДСТВО', 'ИЗМЕРЕНИЕ ДРАКОНОВ', 'GALACTICRAFT']
  };

  // Заголовки групп
  for (const [group, items] of Object.entries(groups)) {
    const title = document.createElement('li');
    title.className = 'menu-group-title';
    title.textContent = group;
    mobileNav.appendChild(title);

    items.forEach(item => {
      const link = navMenu.querySelector(`a[href]:contains('${item}')`);
      if (link) {
        const li = document.createElement('li');
        li.innerHTML = link.outerHTML;
        mobileNav.appendChild(li);
      }
    });
  }

  overlay.appendChild(mobileNav);
  document.body.appendChild(overlay);

  // Переключение кнопки (☰ → ×)
  mobileBtn?.addEventListener('click', () => {
    overlay.classList.toggle('active');
    mobileBtn.classList.toggle('open');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  });

  // Закрытие только по крестику (уже реализовано через toggle)
  // Клик по ссылке — закрыть
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('active');
      mobileBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
});
