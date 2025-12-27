document.addEventListener('DOMContentLoaded', async () => {
  const bgImg = document.getElementById('hero-bg');
  const titleEl = document.getElementById('hero-title');
  const descEl = document.getElementById('hero-desc');
  const wipeBtn = document.getElementById('wipe-button');
  const onlineEl = document.getElementById('online-count');
  const tpsEl = document.getElementById('tps-value');

  try {
    // === 1. Загрузка главной страницы LoliLand ===
    const proxy = 'https://api.allorigins.win/get?url=';
    const mainRes = await fetch(proxy + encodeURIComponent('https://loliland.ru/ru'));
    const mainHtml = await mainRes.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(mainHtml, 'text/html');

    // Фон
    const imgSrc = doc.querySelector('.index-main__background img')?.src?.trim();
    if (imgSrc) bgImg.src = imgSrc;

    // Текст и ссылка из блока вайпа
    const updateBlock = doc.querySelector('.index-main__last-update');
    if (updateBlock) {
      const title = updateBlock.querySelector('.index-main-column__title')?.textContent?.trim() || 'Последний вайп';
      const desc = updateBlock.querySelector('.index-main-column__description')?.textContent?.trim() || '';
      const link = updateBlock.querySelector('a[href]')?.getAttribute('href');

      titleEl.textContent = title;
      descEl.textContent = desc;

      if (link) {
        const fullUrl = link.startsWith('http') ? link : `https://loliland.ru${link}`;
        wipeBtn.href = fullUrl;
      }
    }

    // === 2. Загрузка статистики (онлайн + TPS) ===
    const statsRes = await fetch(proxy + encodeURIComponent('https://loliland.ru/ru/stats'));
    const statsHtml = await statsRes.text();
    const statsDoc = parser.parseFromString(statsHtml, 'text/html');

    // Онлайн
    const onlineMatch = statsDoc.body.textContent?.match(/([\d\thinsp]+)Текущий онлайн/);
    if (onlineMatch) {
      let online = onlineMatch[1].replace(/\s|&thinsp;|thinsp/g, '').trim();
      onlineEl.textContent = online;
    }

    // TPS
    const tpsMatch = statsDoc.body.textContent?.match(/(\d+)\s*TPS/);
    if (tpsMatch) {
      tpsEl.textContent = tpsMatch[1];
    }

  } catch (err) {
    console.error('❌ Ошибка загрузки:', err);
    titleEl.textContent = 'DarkGalaxy';
    descEl.textContent = 'Уникальная сборка на базе LoliLand';
    onlineEl.textContent = '—';
    tpsEl.textContent = '—';
  }
});