let starCount = 0;
const MAX_STARS = 30; // ← было 100+ → теперь 30

function createStar() {
  if (starCount >= MAX_STARS) return;
  
  const container = document.getElementById('stars-container');
  if (!container) return;

  const star = document.createElement('div');
  star.className = 'star';
  star.textContent = '✧';
  star.style.left = Math.random() * 100 + 'vw';
  star.style.top = '-10px';
  star.style.opacity = '0.7';
  star.style.fontSize = (0.6 + Math.random() * 0.5) + 'em';
  star.style.color = 'white';

  container.appendChild(star);
  starCount++;

  // Анимация падения
  const duration = 8 + Math.random() * 10;
  star.style.transition = `transform ${duration}s linear, opacity ${duration/2}s ease`;
  star.style.transform = `translateY(${window.innerHeight * 1.2}px) rotate(${Math.random() * 720}deg)`;

  // Удаляем после анимации
  setTimeout(() => {
    star.remove();
    starCount--;
  }, duration * 1000);
}


// Реже создаём звёзды
setInterval(createStar, 1200); // ← было 600 → теперь 1200 мс