// styles/menu/menu-combined.js

let mobileMenuActive = false;

function cleanupMobileMenu() {
  if (mobileMenuActive) {
    document.querySelectorAll('.mobile-menu-overlay').forEach(el => el.remove());
    const btn = document.querySelector('.menu-toggle');
    if (btn) btn.classList.remove('open');
    document.body.style.overflow = '';
    mobileMenuActive = false;
  }
}

function createMobileMenu(linksHtml) {
  cleanupMobileMenu();

  const mobileBtn = document.querySelector('.menu-toggle');
  if (!mobileBtn) return;

  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  overlay.innerHTML = `<ul class="mobile-nav">${linksHtml}</ul>`;
  document.body.appendChild(overlay);

  const toggle = () => {
    overlay.classList.toggle('active');
    mobileBtn.classList.toggle('open');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  };

  mobileBtn.onclick = toggle;

  overlay.querySelectorAll('a').forEach(a => {
    a.onclick = () => {
      cleanupMobileMenu();
    };
  });

  mobileMenuActive = true;
}

// Определяем тип страницы
const isHomePage = window.location.pathname.endsWith('/index.html') || 
                   window.location.pathname === '/saut/' || 
                   window.location.pathname === '/saut';

let linksHtml = isHomePage ? `
  <li class="menu-group-title">Основное</li>
  <li><a href="index.html">ГЛАВНАЯ</a></li>
  <li><a href="pages/warp-info/warp-info.html">ЦЕНЫ ВАРПА</a></li>
  <li><a href="pages/services/services.html">УСЛУГИ</a></li>
  <li><a href="pages/about-saut/about-saut.html">О САЙТЕ</a></li>
  <li><a href="pages/about-server/about-server.html">О СЕРВЕРЕ</a></li>
  <li><a href="pages/creators/creators.html">СОЗДАТЕЛИ</a></li>
  
  <li class="menu-group-title">Гайды</li>
  <li><a href="pages/guids-magic/guids-magic.html">МАГИЯ</a></li>
  <li><a href="pages/guids-tech/guids-tech.html">ТЕХНОЛОГИИ</a></li>
  <li><a href="pages/guids-ae2/guids-ae2.html">АВТОМАТИЗАЦИЯ</a></li>
  <li><a href="pages/guids-forestry/guids-forestry.html">ПЧЕЛОВОДСТВО</a></li>
  <li><a href="pages/guids-dimension/guids-dimension.html">ИЗМЕРЕНИЕ ДРАКОНОВ</a></li>
  <li><a href="pages/guids-galacticraft/guids-galacticraft.html">GALACTICRAFT</a></li>
` : `
  <li class="menu-group-title">Основное</li>
  <li><a href="../../index.html">ГЛАВНАЯ</a></li>
  <li><a href="../warp-info/warp-info.html">ЦЕНЫ ВАРПА</a></li>
  <li><a href="../services/services.html">УСЛУГИ</a></li>
  <li><a href="../about-saut/about-saut.html">О САЙТЕ</a></li>
  <li><a href="../about-server/about-server.html">О СЕРВЕРЕ</a></li>
  <li><a href="../creators/creators.html">СОЗДАТЕЛИ</a></li>
  
  <li class="menu-group-title">Гайды</li>
  <li><a href="../guids-magic/guids-magic.html">МАГИЯ</a></li>
  <li><a href="../guids-tech/guids-tech.html">ТЕХНОЛОГИИ</a></li>
  <li><a href="../guids-ae2/guids-ae2.html">АВТОМАТИЗАЦИЯ</a></li>
  <li><a href="../guids-forestry/guids-forestry.html">ПЧЕЛОВОДСТВО</a></li>
  <li><a href="../guids-dimension/guids-dimension.html">ИЗМЕРЕНИЕ ДРАКОНОВ</a></li>
  <li><a href="../guids-galacticraft/guids-galacticraft.html">GALACTICRAFT</a></li>
`;

function initMenu() {
  if (window.innerWidth <= 1199) {
    createMobileMenu(linksHtml);
  } else {
    cleanupMobileMenu();
  }
}

// Основной запуск
function run() {
  // Удаляем всё при любом показе страницы (включая "Назад")
  cleanupMobileMenu();
  // Сбрасываем состояние
  mobileMenuActive = false;
  // Инициализируем заново
  initMenu();
}

// Запуск при полной загрузке
document.addEventListener('DOMContentLoaded', run);

// Запуск при каждом показе страницы (включая history.back)
window.addEventListener('pageshow', run);

// Обработка изменения размера
window.addEventListener('resize', () => {
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(initMenu, 150);
});
