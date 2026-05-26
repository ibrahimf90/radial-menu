/**
 * pages.js — shared script for all inner pages
 */
(function () {
  // Highlight the page tag to match current file
  const tag = document.querySelector('.page-tag');
  if (tag) {
    tag.style.color = 'var(--accent)';
  }

  // Stagger-animate cards / service-cards / product-cards on load
  const animatable = document.querySelectorAll(
    '.card, .service-card, .stat, .product-card, .contact-item'
  );

  animatable.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .45s ease ${0.1 + i * 0.07}s, transform .45s ease ${0.1 + i * 0.07}s`;
    // Trigger
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
})();
