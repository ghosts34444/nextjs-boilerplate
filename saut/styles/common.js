if (CSS.supports('backdrop-filter', 'blur(10px)')) {
  document.body.classList.add('supports-backdrop');
} else {
  document.body.classList.add('no-backdrop');
}