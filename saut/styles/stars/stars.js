// styles/stars/stars.js
(function() {
  const starsContainer = document.getElementById('stars-container');
  if (!starsContainer) return;

  const STAR_COUNT = 40; // количество звёзд

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.textContent = '✧'; // символ звездочки

    // Случайные параметры
    const size = Math.random() * 0.6 + 0.4;      // размер от 0.4 до 1.0em
    const duration = Math.random() * 15 + 10;     // длительность анимации от 10 до 25 сек
    const delay = Math.random() * 10;             // задержка от 0 до 10 сек
    const startX = Math.random() * 100;           // горизонтальная позиция

    // Применяем стили
    star.style.fontSize = `${size}em`;
    star.style.left = `${startX}vw`;
    star.style.top = `-30px`;                     // начинаем сверху
    star.style.opacity = Math.random() * 0.3 + 0.5; // прозрачность от 0.5 до 0.8
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;

    // Добавляем анимацию падения
    star.style.animationName = 'fallStar';
    star.style.animationTimingFunction = 'linear';
    star.style.animationIterationCount = 'infinite';

    starsContainer.appendChild(star);
  }

  // Создаём анимацию падения
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fallStar {
      0% {
        transform: translateY(0) scale(1);
        opacity: 0.8;
      }
      100% {
        transform: translateY(100vh) scale(0.8);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleSheet);

})();