(function (window) {
  'use strict';

  function initServiceCards(root) {
    if (!root) {
      return;
    }

    root.querySelectorAll('.service-card').forEach((card) => {
      if (card.dataset.bound === 'true') {
        return;
      }

      card.dataset.bound = 'true';

      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
      });

      card.addEventListener('click', (event) => {
        if (!event.target.closest('.service-link')) {
          const link = card.querySelector('.service-link');
          if (link) {
            window.location.href = link.href;
          }
        }
      });
    });
  }

  window.PortfolioServiceCards = {
    init: initServiceCards,
  };
})(window);
