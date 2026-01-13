// scripts/guides-search.js
document.addEventListener('DOMContentLoaded', () => {
  // Собираем ТОЛЬКО секции с id и h3
  const searchableSections = [];
  document.querySelectorAll('.guide-section[id]').forEach(section => {
    const titleEl = section.querySelector('h3');
    if (titleEl) {
      searchableSections.push({
        id: section.id,
        title: titleEl.textContent.trim()
      });
    }
  });

  let lastActiveSection = null;

  // Сохраняем последнюю активную секцию
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        if (document.getElementById(targetId)) {
          lastActiveSection = targetId;
        }
      }
    });
  });

  const searchInput = document.getElementById('guide-search');
  const searchClear = document.getElementById('search-clear');
  const resultsContainer = document.getElementById('search-results-container');

  if (!searchInput || !resultsContainer) return;

  // Поиск (только по названиям)
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    
    if (searchClear) {
      searchClear.style.display = query ? 'block' : 'none';
    }

    if (query.length >= 1) {
      // Скрываем ВСЕ .guide-mod
      document.querySelectorAll('.guide-mod').forEach(mod => {
        mod.style.display = 'none';
      });

      // Ищем ТОЛЬКО по названиям
      const matches = searchableSections.filter(sec =>
        sec.title.toLowerCase().includes(query.toLowerCase())
      );

      if (matches.length > 0) {
        let html = '';
        matches.forEach(match => {
          const highlightedTitle = match.title.replace(
            new RegExp(`(${query})`, 'gi'),
            '<mark>$1</mark>'
          );
          html += `
            <div class="search-result">
              <h4><a href="#${match.id}" onclick="scrollToSection('${match.id}'); return false;">${highlightedTitle}</a></h4>
            </div>
          `;
        });
        resultsContainer.innerHTML = html;
        resultsContainer.style.display = 'block';
      } else {
        resultsContainer.innerHTML = '<div class="search-result" style="text-align:center;color:#c0c0e0;">Ничего не найдено</div>';
        resultsContainer.style.display = 'block';
      }
    } else {
      // Очистка
      resultsContainer.style.display = 'none';
      document.querySelectorAll('.guide-mod').forEach(mod => {
        mod.style.display = 'block';
      });
    }
  });

  // Крестик
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      resultsContainer.style.display = 'none';
      
      // Показываем всё
      document.querySelectorAll('.guide-mod').forEach(mod => {
        mod.style.display = 'block';
      });
      
      // Возвращаемся к последней секции
      if (lastActiveSection) {
        scrollToSection(lastActiveSection);
      }
    });
  }
});

// Исправленная прокрутка
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (!element) return;

  const offset = 140; // высота шапки
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}