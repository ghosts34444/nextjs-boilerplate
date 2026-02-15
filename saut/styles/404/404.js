    // Показываем URL, по которому искали
    const url = new URL(window.location.href);
    const path = url.pathname + url.search;
    document.getElementById('search-query').textContent = path;

    // Кнопка "Назад"
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/saut/index.html'; // или просто '/'
      }
    });