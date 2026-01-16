// scripts/guides-search.js
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.GUIDES_DATA === 'undefined') {
    console.error('GUIDES_DATA не загружена');
    return;
  }

  const searchInput = document.getElementById('guide-search');
  const searchClear = document.getElementById('search-clear');
  const resultsContainer = document.getElementById('search-results-container');
  const contentWrapper = document.getElementById('content-wrapper');

  if (!searchInput || !resultsContainer || !contentWrapper) return;

  // Очистка поиска
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    resultsContainer.style.display = 'none';
    contentWrapper.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Поиск (только по GUIDES_DATA)
  searchInput.addEventListener('input', (e) => {
    e.preventDefault(); // ← запрещаем прокрутку
    
    const query = searchInput.value.trim();
    searchClear.style.display = query ? 'block' : 'none';

    if (query.length >= 1) {
      // Скрываем контент
      contentWrapper.style.display = 'none';

      // Ищем ТОЛЬКО в глобальной базе
      let results = [];
      const lowerQuery = query.toLowerCase();

      for (const [modKey, mod] of Object.entries(window.GUIDES_DATA)) {
        for (const [secKey, section] of Object.entries(mod.sections || {})) {
          // Проверяем только по названию секции и алиасам мода
          const titleMatch = section.title.toLowerCase().includes(lowerQuery);
          const aliasMatch = mod.aliases.some(alias => alias.includes(lowerQuery));
          
          if (titleMatch || aliasMatch) {
            results.push({
              modTitle: mod.title,
              title: section.title,
              link: `${mod.page}#${secKey}`,
              image: section.image || '' // ← из базы данных
            });
          }
        }
      }

      // Показываем результаты
      if (results.length > 0) {
        let html = '<div class="search-results-grid">';
        results.slice(0, 6).forEach(res => {
          const highlighted = res.title.replace(
            new RegExp(`(${query})`, 'gi'),
            '<mark>$1</mark>'
          );
          // Путь к изображению из базы данных
          const imgPath = res.image || '../../assets/images/placeholder.png';
          html += `
            <div class="search-result">
              <div class="search-result-image">
                <img src="${imgPath}" alt="${res.title}" loading="lazy">
              </div>
              <h4>
                <a href="${res.link}" onclick="scrollToSection('${res.link}'); return false;">
                  ${highlighted}
                </a>
                <small>(${res.modTitle})</small>
              </h4>
            </div>
          `;
        });
        html += '</div>';
        resultsContainer.innerHTML = html;
        resultsContainer.style.display = 'block';
        
        // Прокрутка к результатам
        setTimeout(() => {
          resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        resultsContainer.innerHTML = '<div class="search-result" style="text-align:center;color:#c0c0e0;">Ничего не найдено</div>';
        resultsContainer.style.display = 'block';
      }
    } else {
      // Очистка
      resultsContainer.style.display = 'none';
      contentWrapper.style.display = 'block';
    }
  });
});

// Плавная прокрутка
function scrollToSection(link) {
  // Очищаем поиск
  const searchInput = document.getElementById('guide-search');
  const searchClear = document.getElementById('search-clear');
  const resultsContainer = document.getElementById('search-results-container');
  const contentWrapper = document.getElementById('content-wrapper');
  
  if (searchInput) {
    searchInput.value = '';
    searchClear.style.display = 'none';
    resultsContainer.style.display = 'none';
    contentWrapper.style.display = 'block';
  }

  // Обработка ссылки
  const hashIndex = link.indexOf('#');
  if (hashIndex === -1) {
    window.location.href = link;
    return;
  }

  const pagePath = link.substring(0, hashIndex);
  const hash = link.substring(hashIndex + 1);

  // Текущая страница?
  const currentPath = window.location.pathname;
  let isCurrentPage = false;
  
  if (pagePath === '') {
    isCurrentPage = true;
  } else if (pagePath === currentPath) {
    isCurrentPage = true;
  } else if (pagePath.startsWith('.')) {
    // Преобразуем относительный путь в абсолютный
    try {
      const url = new URL(pagePath, window.location.href);
      isCurrentPage = url.pathname === currentPath;
    } catch (e) {
      isCurrentPage = false;
    }
  }

  if (isCurrentPage) {
    const element = document.getElementById(hash);
    if (element) {
      const offset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      return;
    }
  }

  // Переход на другую страницу
  window.location.href = link;
}