document.addEventListener('DOMContentLoaded', async function () {
  const pageRoot = document.querySelector('.projects-page[data-api-listing]');
  const grid = document.getElementById('projects-grid');
  const filterRoot = document.getElementById('projects-filter');
  const paginationEl = document.querySelector('.projects-pagination');
  const emptyState = document.querySelector('.projects-empty');

  if (!pageRoot || !grid) {
    return;
  }

  const { fetchProjects } = window.PortfolioProjectsApi;
  const { fetchServices } = window.PortfolioServicesApi;
  const { renderProjectCard } = window.PortfolioRenderProjects;
  const { renderDotPagination } = window.PortfolioPagination;
  const { LIMITS } = window.PortfolioApiConfig;

  let activeService = 'all';
  let currentPage = 1;

  const getInitialService = () => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('service');
    return requested || 'all';
  };

  const updateUrl = () => {
    const url = activeService === 'all'
      ? 'projects.html'
      : `projects.html?service=${encodeURIComponent(activeService)}`;
    window.history.replaceState({}, '', url);
  };

  const renderFilters = (services) => {
    if (!filterRoot) return;

    const buttons = [
      '<button class="project-filter-btn" type="button" data-filter="all" role="tab">Tous</button>',
      ...services.map(
        (service) =>
          `<button class="project-filter-btn" type="button" data-filter="${service.slug}" role="tab">${service.title}</button>`
      ),
    ];

    filterRoot.innerHTML = buttons.join('');

    filterRoot.querySelectorAll('.project-filter-btn').forEach((button) => {
      button.addEventListener('click', () => {
        setActiveService(button.dataset.filter);
      });
    });

    syncFilterState();
  };

  const syncFilterState = () => {
    if (!filterRoot) return;

    filterRoot.querySelectorAll('.project-filter-btn').forEach((button) => {
      const isActive = button.dataset.filter === activeService;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  const setActiveService = (service) => {
    activeService = service;
    currentPage = 1;
    syncFilterState();
    updateUrl();
    loadProjects(currentPage);
  };

  async function loadProjects(page) {
    grid.setAttribute('aria-busy', 'true');

    try {
      const response = await fetchProjects({
        page,
        limit: LIMITS.PROJECTS_PAGE,
        service: activeService,
      });

      const projects = response.data || [];

      if (!projects.length) {
        grid.innerHTML = '';
        if (emptyState) {
          emptyState.style.display = 'block';
        }
      } else {
        grid.innerHTML = projects.map((project, index) => renderProjectCard(project, index)).join('');
        if (emptyState) {
          emptyState.style.display = 'none';
        }
        window.PortfolioProjectsUI.bindCards(grid);
      }

      if (paginationEl && response.pagination) {
        renderDotPagination(paginationEl, response.pagination, (nextPage) => {
          currentPage = nextPage;
          loadProjects(nextPage);
          grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
    } catch (error) {
      grid.innerHTML = '';
      if (emptyState) {
        emptyState.textContent = 'Impossible de charger les projets pour le moment.';
        emptyState.style.display = 'block';
      }
    } finally {
      grid.removeAttribute('aria-busy');
      pageRoot.classList.add('projects-ready');
    }
  }

  try {
    const servicesResponse = await fetchServices({ page: 1, limit: LIMITS.FILTER_SERVICES });
    renderFilters(servicesResponse.data || []);
  } catch (error) {
    renderFilters([]);
  }

  activeService = getInitialService();
  if (
    activeService !== 'all' &&
    filterRoot &&
    !filterRoot.querySelector(`[data-filter="${activeService}"]`)
  ) {
    activeService = 'all';
  }
  syncFilterState();
  await loadProjects(currentPage);
});
