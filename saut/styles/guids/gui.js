// scripts/adaptive-map-loader.js
document.addEventListener('DOMContentLoaded', async () => {
  const IS_MOBILE = window.innerWidth < 768;
  const containers = document.querySelectorAll('.gui-container[data-json]');
  
  if (containers.length === 0) return;

  // Группируем по JSON-файлу
  const jsonGroups = {};
  containers.forEach(container => {
    const jsonPath = container.dataset.json;
    if (!jsonGroups[jsonPath]) {
      jsonGroups[jsonPath] = [];
    }
    jsonGroups[jsonPath].push(container);
  });

  for (const [jsonPath, group] of Object.entries(jsonGroups)) {
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (!Array.isArray(data.images)) {
        throw new Error('Неверная структура JSON: images должен быть массивом');
      }

      // Обрабатываем каждый контейнер
      for (const container of group) {
        const imageId = container.dataset.imageId;
        const imgData = data.images.find(img => img.id === imageId);
        
        if (!imgData) {
          container.innerHTML = `<p style="color:#ff6b9d;">❌ Изображение "${imageId}" не найдено в ${jsonPath}</p>`;
          continue;
        }

        // Создаём обёртку
        const wrapper = document.createElement('div');
        wrapper.className = 'adaptive-gui-wrapper';
        container.appendChild(wrapper);

        // Контейнер для карты
        const mapContainer = document.createElement('div');
        mapContainer.className = 'gui-map-container';
        wrapper.appendChild(mapContainer);

        // Изображение
        const img = document.createElement('img');
        img.src = imgData.src;
        img.className = 'gui-image';
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        img.alt = imgData.title || 'GUI';

        // Map
        const mapName = `map-${imgData.id}`;
        const map = document.createElement('map');
        map.name = mapName;
        map.id = mapName;
        mapContainer.appendChild(img);
        mapContainer.appendChild(map);

        // Оверлей для мобилы
        let overlay = null;
        if (IS_MOBILE) {
          overlay = document.createElement('div');
          overlay.className = 'mobile-overlay';
          mapContainer.appendChild(overlay);
        }

        // Ждём загрузки изображения
        await new Promise((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = () => {
              console.error('❌ Не удалось загрузить изображение:', imgData.src);
              resolve();
            };
          }
        });

        // Устанавливаем usemap ТОЛЬКО после загрузки
        img.useMap = `#${mapName}`;

        // Обработка зон
        if (Array.isArray(imgData.zones)) {
          imgData.zones.forEach(zone => {
            // Проверка обязательных полей
            if (!zone.id || !zone.name || !zone.shape || !zone.coords) {
              console.warn('⚠️ Пропущена неполная зона:', zone);
              return;
            }

            // AREA — работает для наведения (на всех устройствах)
            const area = document.createElement('area');
            area.shape = zone.shape;
            area.coords = Array.isArray(zone.coords) ? zone.coords.join(',') : zone.coords;
            area.dataset.name = zone.name;

            // Подсказка ТОЛЬКО на ПК
            if (!IS_MOBILE) {
              area.addEventListener('mousemove', (e) => {
                let tooltip = wrapper.querySelector('.map-tooltip');
                if (!tooltip) {
                  tooltip = document.createElement('div');
                  tooltip.className = 'map-tooltip';
                  wrapper.appendChild(tooltip);
                }
                tooltip.textContent = zone.name;
                tooltip.style.display = 'block';
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.top = `${e.pageY - 30}px`;
              });

              area.addEventListener('mouseleave', () => {
                const tooltip = wrapper.querySelector('.map-tooltip');
                if (tooltip) tooltip.style.display = 'none';
              });
            }

            map.appendChild(area);

            // Рисуем оверлей ТОЛЬКО на мобиле
            if (IS_MOBILE && overlay) {
              if (zone.shape === 'rect' && zone.coords.length >= 4) {
                const [x1, y1, x2, y2] = zone.coords;
                const div = document.createElement('div');
                div.className = 'mobile-zone-highlight';
                div.style.left = `${x1}px`;
                div.style.top = `${y1}px`;
                div.style.width = `${x2 - x1}px`;
                div.style.height = `${y2 - y1}px`;

                const idLabel = document.createElement('div');
                idLabel.className = 'zone-id-label';
                idLabel.textContent = zone.id;
                div.appendChild(idLabel);

                overlay.appendChild(div);
              }
            }
          });

          // Карточки на мобиле
          if (IS_MOBILE) {
            const cardsDiv = document.createElement('div');
            cardsDiv.className = 'mobile-cards';
            imgData.zones.forEach(zone => {
              if (zone.id && zone.name) {
                const card = document.createElement('div');
                card.className = 'map-mobile-item';
                card.textContent = `${zone.id}. ${zone.name}`;
                cardsDiv.appendChild(card);
              }
            });
            wrapper.appendChild(cardsDiv);
          }
        }
      }

    } catch (error) {
      console.error(`💥 Ошибка при загрузке ${jsonPath}:`, error);
      group.forEach(container => {
        container.innerHTML = `<p style="color:#ff6b9d;">❌ Ошибка: ${error.message || 'неизвестная'}</p>`;
      });
    }
  }
});