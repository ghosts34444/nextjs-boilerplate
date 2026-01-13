// styles/stars/stars.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('stars-container');
  if (!container) return;

  // Символы для разнообразия
  const symbols = ['•', '✧', '★', '☆'];
  let starCount = 0;
  const MAX_STARS = 25;

  // Добавляем CSS-анимации
  const style = document.createElement('style');
  style.textContent = `
    @keyframes twinkle {
      0% { opacity: 0.3; filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5)); }
      100% { opacity: 0.7; filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8)); }
    }
    @keyframes fall {
      0% {
        transform: translateY(-20px) rotate(0deg);
        opacity: 0.7;
        filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.7));
      }
      100% {
        transform: translateY(${window.innerHeight * 1.2}px) rotate(${Math.random() * 720}deg);
        opacity: 0;
        filter: none;
      }
    }
  `;
  document.head.appendChild(style);

  function createStar() {
    if (starCount >= MAX_STARS) return;

    const star = document.createElement('div');
    star.className = 'star';

    // Случайный символ
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    star.textContent = symbol;

    // Позиция
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = '0';

    // Размер и цвет
    const size = 0.6 + Math.random() * 0.8;
    star.style.fontSize = size + 'em';
    star.style.color = 'white';

    // Тип анимации
    if (Math.random() > 0.7) {
      // Падающая звезда
      const duration = 4 + Math.random() * 4; // 4-8 сек
      star.style.animation = `fall ${duration}s linear forwards`;
      
      // Удаляем после анимации
      setTimeout(() => {
        star.remove();
        starCount--;
      }, duration * 1000);
    } else {
      // Мерцающая звезда
      star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite alternate`;
      
      // Удаляем через 30 сек
      setTimeout(() => {
        if (star.parentNode) {
          star.remove();
          starCount--;
        }
      }, 30000);
    }

    container.appendChild(star);
    starCount++;
  }

  // Генерация звёзд
  setInterval(createStar, 1000);
});
