document.addEventListener('DOMContentLoaded', async function () {
  const grid = document.getElementById('services-grid');
  const paginationEl = document.getElementById('services-pagination');

  if (!grid || !grid.hasAttribute('data-api-home')) {
    return;
  }

  const { fetchServices } = window.PortfolioServicesApi;
  const { renderServiceCard } = window.PortfolioRenderServices;
  const { renderDotPagination } = window.PortfolioPagination;
  const { LIMITS } = window.PortfolioApiConfig;

  let currentPage = 1;

  async function loadServices(page) {
    grid.setAttribute('aria-busy', 'true');

    try {
      const response = await fetchServices({ page, limit: LIMITS.HOME_SERVICES });
      const services = response.data || [];

      if (!services.length) {
        grid.innerHTML = '<p class="services-empty">Aucun service disponible pour le moment.</p>';
        if (paginationEl) {
          paginationEl.innerHTML = '';
          paginationEl.classList.add('is-hidden');
        }
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
      grid.innerHTML = '<p class="services-empty">Impossible de charger les services pour le moment.</p>';
      if (paginationEl) {
        paginationEl.innerHTML = '';
        paginationEl.classList.add('is-hidden');
      }
    } finally {
      grid.removeAttribute('aria-busy');
    }
  }

  await loadServices(currentPage);
});
