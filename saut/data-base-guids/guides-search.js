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
  });

  // Поиск
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    searchClear.style.display = query ? 'block' : 'none';

    if (query.length >= 1) {
      // Скрываем контент
      contentWrapper.style.display = 'none';

      // Ищем по всем гайдам
      let results = [];
      const lowerQuery = query.toLowerCase();

      for (const [modKey, mod] of Object.entries(window.GUIDES_DATA)) {
        // Проверка по моду
        const modMatch = 
          mod.title.toLowerCase().includes(lowerQuery) ||
          mod.aliases.some(alias => alias.includes(lowerQuery));

        // Проверка по секциям
        for (const [secKey, section] of Object.entries(mod.sections || {})) {
          const sectionMatch = 
            section.title.toLowerCase().includes(lowerQuery) ||
            section.content.toLowerCase().includes(lowerQuery);

          if (modMatch || sectionMatch) {
            results.push({
              modTitle: mod.title,
              title: section.title,
              content: section.content,
              link: `${mod.page}#${secKey}`
            });
          }
        }
      }

      // Ограничиваем до 6 результатов
      results = results.slice(0, 6);

      // Показываем результаты
      if (results.length > 0) {
        let html = '<div class="search-results-grid">';
        results.forEach(res => {
          const highlighted = res.title.replace(
            new RegExp(`(${query})`, 'gi'),
            '<mark>$1</mark>'
          );
          html += `
            <div class="search-result">
              <h4>
                <a href="${res.link}" onclick="scrollToSection('${res.link}'); return false;">
                  ${highlighted}
                </a>
                <small>(${res.modTitle})</small>
              </h4>
              <p>${res.content.substring(0, 150)}...</p>
            </div>
          `;
        });
        html += '</div>';
        resultsContainer.innerHTML = html;
        resultsContainer.style.display = 'block';
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

// === ПЛАВНАЯ ПРОКРУТКА С ОТСТУПОМ ===
function scrollToSection(link) {
  // Извлекаем хеш (#section)
  const hashIndex = link.indexOf('#');
  if (hashIndex === -1) {
    window.location.href = link;
    return;
  }

  const pagePath = link.substring(0, hashIndex);
  const hash = link.substring(hashIndex + 1);

  // Если ссылка ведёт на текущую страницу
  const currentPath = window.location.pathname;
  const targetIsCurrentPage = pagePath === '' || 
    pagePath === currentPath || 
    pagePath === '.' + currentPath;

  if (targetIsCurrentPage) {
    // Прокручиваем к якорю на текущей странице
    const element = document.getElementById(hash);
    if (element) {
      const offset = 140; // высота меню + поиск
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      return;
    }
  }

  // Иначе — переходим на другую страницу
  window.location.href = link;
}