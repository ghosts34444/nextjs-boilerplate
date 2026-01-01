// scripts/guides-search.js
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.GUIDES_DATA === 'undefined') {
    console.error('GUIDES_DATA не загружена');
    return;
  }

  const searchInput = document.getElementById('guide-search');
  const searchClear = document.getElementById('search-clear');
  const suggestions = document.getElementById('search-suggestions');
  const resultsContainer = document.getElementById('search-results-container');

  if (!searchInput) return;

  // Очистка поиска
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      hideSuggestions();
      hideResults();
    });
  }

  // Поиск
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    
    // Показываем/скрываем кнопку "X"
    if (searchClear) {
      searchClear.style.display = query ? 'block' : 'none';
    }

    if (query.length < 2) {
      hideSuggestions();
      hideResults();
      return;
    }

    let suggestionsList = [];
    let fullResults = [];

    for (const [modKey, mod] of Object.entries(window.GUIDES_DATA)) {
      // Проверка по моду
      const modMatch = mod.aliases.some(a => a.includes(query)) || 
                      mod.title.toLowerCase().includes(query);
      
      if (modMatch) {
        // Добавляем весь мод в полноэкранные результаты
        for (const [secKey, section] of Object.entries(mod.sections || {})) {
          fullResults.push({
            mod: mod.title,
            title: section.title,
            content: section.content,
            link: `${mod.page}#${secKey}`,
            image: section.image
          });
        }
      }

      // Проверка по секциям (для обоих списков)
      for (const [secKey, section] of Object.entries(mod.sections || {})) {
        const sectionMatch = 
          section.title.toLowerCase().includes(query) ||
          section.content.toLowerCase().includes(query);

        if (sectionMatch) {
          // Для выпадающего списка (до 6 элементов)
          if (suggestionsList.length < 6) {
            suggestionsList.push({
              title: `${mod.title}: ${section.title}`,
              link: `${mod.page}#${secKey}`
            });
          }

          // Для полноэкранных результатов
          if (!modMatch) { // избегаем дубликатов
            fullResults.push({
              mod: mod.title,
              title: section.title,
              content: section.content,
              link: `${mod.page}#${secKey}`,
              image: section.image
            });
          }
        }
      }
    }

    // Обновляем интерфейс
    updateSuggestions(suggestionsList);
    updateResults(fullResults, query);
  });

  // Скрытие при клике вне
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && 
        (!suggestions || !suggestions.contains(e.target))) {
      hideSuggestions();
    }
  });

  // Вспомогательные функции
  function updateSuggestions(list) {
    if (!suggestions) return;
    if (list.length === 0) {
      hideSuggestions();
      return;
    }

    suggestions.innerHTML = '';
    list.forEach(item => {
      const div = document.createElement('div');
      div.className = 'search-suggestion';
      div.textContent = item.title;
      div.addEventListener('click', () => {
        window.location.href = item.link;
      });
      suggestions.appendChild(div);
    });
    suggestions.style.display = 'block';
  }

  function updateResults(results, query) {
    if (!resultsContainer) return;
    if (results.length === 0) {
      hideResults();
      return;
    }

    let html = '';
    results.forEach(res => {
      const highlighted = res.title.replace(
        new RegExp(`(${query})`, 'gi'),
        '<mark>$1</mark>'
      );
      html += `
        <div class="search-result">
          <h4><a href="${res.link}">${highlighted}</a> <small>(${res.mod})</small></h4>
          <p>${res.content.substring(0, 150)}...</p>
        </div>
      `;
    });

    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
  }

  function hideSuggestions() {
    if (suggestions) suggestions.style.display = 'none';
  }

  function hideResults() {
    if (resultsContainer) resultsContainer.style.display = 'none';
  }
});

div.addEventListener('click', () => {
  // Если цель — текущая страница
  if (item.link.includes(window.location.pathname)) {
    const hash = item.link.split('#')[1];
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    // Иначе — переход
    window.location.href = item.link;
  }
});