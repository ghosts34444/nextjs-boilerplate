// styles/stars/stars.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('stars-container');
  if (!container) return;

  // Символы для разнообразия
  const symbols = ['•', '✦', '✧', '★', '☆'];
  let starCount = 0;
  const MAX_STARS = 25; // ← оптимально для слабых устройств

  function createStar() {
    if (starCount >= MAX_STARS) return;

    const star = document.createElement('div');
    star.className = 'star';

    // Случайный символ
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    star.textContent = symbol;

    // Позиция
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = '-10px';

    // Размер и цвет
    const size = 0.6 + Math.random() * 0.8;
    star.style.fontSize = size + 'em';
    star.style.opacity = 0.4 + Math.random() * 0.4;
    star.style.color = 'white';

    // Анимация: мерцание ИЛИ падение
    if (Math.random() > 0.7) {
      // Падающая звезда
      star.classList.add('falling');
      const duration = 6 + Math.random() * 8;
      star.style.transition = `transform ${duration}s linear, opacity ${duration/2}s ease`;
      star.style.transform = `translateY(${window.innerHeight * 1.2}px) rotate(${Math.random() * 720}deg)`;
      
      setTimeout(() => {
        star.remove();
        starCount--;
      }, duration * 1000);
    } else {
      // Мерцающая звезда
      star.classList.add('twinkling');
      star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite alternate`;
    }

    container.appendChild(star);
    starCount++;

    // Удаляем мерцающие звёзды через 30 сек
    if (star.classList.contains('twinkling')) {
      setTimeout(() => {
        if (star.parentNode) {
          star.remove();
          starCount--;
        }
      }, 30000);
    }
  }

  // Генерация звёзд
  setInterval(createStar, 1000);

  // Анимации
  const style = document.createElement('style');
  style.textContent = `
    @keyframes twinkle {
      0% { opacity: 0.3; filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5)); }
      100% { opacity: 0.7; filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8)); }
    }
  `;
  document.head.appendChild(style);
});
