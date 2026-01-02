// styles/menu/menu.js
document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.querySelector('.menu-toggle');
  if (!mobileBtn) return;

  // Создаём оверлей
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  document.body.appendChild(overlay);

  // Создаём мобильное меню
  const mobileNav = document.createElement('ul');
  mobileNav.className = 'mobile-nav';

  // Группы
  const groups = {
    'Основное': [
      { text: 'ГЛАВНАЯ', href: '../../index.html' },
      { text: 'ЦЕНЫ ВАРПА', href: '../../pages/warp-info/warp-info.html' },
      { text: 'УСЛУГИ', href: '../../pages/services/services.html' },
      { text: 'О САЙТЕ', href: '../../pages/about-saut/about-saut.html' },
      { text: 'О СЕРВЕРЕ', href: '../../pages/about-server/about-server.html' },
      { text: 'СОЗДАТЕЛИ', href: '../../pages/creators/creators.html' }
    ],
    'Гайды': [
      { text: 'МАГИЯ', href: '../../pages/guids-magic/guids-magic.html' },
      { text: 'ТЕХНОЛОГИИ', href: '../../pages/guids-tech/guids-tech.html' },
      { text: 'АВТОМАТИЗАЦИЯ', href: '../../pages/guids-ae2/guids-ae2.html' },
      { text: 'ПЧЕЛОВОДСТВО', href: '../../pages/guids-forestry/guids-forestry.html' },
      { text: 'ИЗМЕРЕНИЕ ДРАКОНОВ', href: '../../pages/guids-dimension/guids-dimension.html' },
      { text: 'GALACTICRAFT', href: '../../pages/guids-galacticraft/guids-galacticraft.html' }
    ]
  };

  // Формируем меню
  for (const [groupName, items] of Object.entries(groups)) {
    // Заголовок группы
    const title = document.createElement('li');
    title.className = 'menu-group-title';
    title.textContent = groupName;
    mobileNav.appendChild(title);

    // Ссылки
    items.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;
      a.className = 'nav-link';
      li.appendChild(a);
      mobileNav.appendChild(li);
    });
  }

  overlay.appendChild(mobileNav);

  // Переключение меню
  mobileBtn.addEventListener('click', () => {
    overlay.classList.toggle('active');
    mobileBtn.classList.toggle('open');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  });

  // Закрытие при клике по ссылке
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('active');
      mobileBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
});
