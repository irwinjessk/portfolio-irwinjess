(function (window) {
  'use strict';

  function renderDotPagination(container, pagination, onPageChange) {
    if (!container || !pagination) {
      return;
    }

    container.innerHTML = '';
    container.classList.toggle('is-hidden', pagination.total_pages <= 1);

    if (pagination.total_pages <= 1) {
      return;
    }

    for (let page = 1; page <= pagination.total_pages; page += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'project-page-dot';
      button.textContent = String(page);
      button.setAttribute('aria-label', `Page ${page}`);

      if (page === pagination.page) {
        button.classList.add('active');
        button.setAttribute('aria-current', 'page');
      }

      button.addEventListener('click', () => onPageChange(page));
      container.appendChild(button);
    }
  }

  window.PortfolioPagination = {
    renderDotPagination,
  };
})(window);
