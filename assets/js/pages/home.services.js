document.addEventListener('DOMContentLoaded', async function () {
  const grid = document.getElementById('services-grid');
  const paginationEl = document.getElementById('services-pagination');

  if (!grid || !grid.hasAttribute('data-api-home')) {
    return;
  }

  const { fetchServices } = window.PortfolioServicesApi;
  const { renderServiceCard, renderServicesEmptyState } = window.PortfolioRenderServices;
  const { renderDotPagination } = window.PortfolioPagination;
  const { LIMITS } = window.PortfolioApiConfig;

  let currentPage = 1;

  function bindEmptyStateActions() {
    const retryBtn = grid.querySelector('[data-services-retry]');

    if (retryBtn) {
      retryBtn.addEventListener('click', function (event) {
        event.preventDefault();
        loadServices(currentPage);
      });
    }

    if (window.AOS) {
      window.AOS.refreshHard();
    }
  }

  async function loadServices(page) {
    grid.setAttribute('aria-busy', 'true');

    try {
      const response = await fetchServices({ page, limit: LIMITS.HOME_SERVICES });
      const services = response.data || [];

      if (!services.length) {
        grid.innerHTML = renderServicesEmptyState({ variant: 'empty' });
        if (paginationEl) {
          paginationEl.innerHTML = '';
          paginationEl.classList.add('is-hidden');
        }
        bindEmptyStateActions();
        return;
      }

      grid.innerHTML = services.map((service, index) => renderServiceCard(service, index)).join('');

      if (window.AOS) {
        window.AOS.refreshHard();
      }

      window.PortfolioServiceCards.init(grid);

      if (paginationEl && response.pagination) {
        renderDotPagination(paginationEl, response.pagination, (nextPage) => {
          currentPage = nextPage;
          loadServices(nextPage);
        });
      }
    } catch (error) {
      grid.innerHTML = renderServicesEmptyState({ variant: 'error' });
      if (paginationEl) {
        paginationEl.innerHTML = '';
        paginationEl.classList.add('is-hidden');
      }
      bindEmptyStateActions();
    } finally {
      grid.removeAttribute('aria-busy');
    }
  }

  await loadServices(currentPage);
});
