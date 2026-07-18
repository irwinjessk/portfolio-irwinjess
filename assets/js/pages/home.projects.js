document.addEventListener('DOMContentLoaded', async function () {
  const grid = document.getElementById('home-projects-grid');

  if (!grid || !grid.hasAttribute('data-api-featured')) {
    return;
  }

  const { fetchFeaturedProjects } = window.PortfolioProjectsApi;
  const { renderProjectCard, renderProjectsEmptyState } = window.PortfolioRenderProjects;
  const { LIMITS } = window.PortfolioApiConfig;

  function bindEmptyStateActions() {
    const retryBtn = grid.querySelector('[data-projects-retry]');

    if (retryBtn) {
      retryBtn.addEventListener('click', function (event) {
        event.preventDefault();
        loadFeaturedProjects();
      });
    }

    if (window.AOS) {
      window.AOS.refreshHard();
    }
  }

  async function loadFeaturedProjects() {
    grid.setAttribute('aria-busy', 'true');

    try {
      const response = await fetchFeaturedProjects(LIMITS.HOME_PROJECTS);
      const projects = response.data || [];

      if (!projects.length) {
        grid.innerHTML = renderProjectsEmptyState({ variant: 'featured' });
        bindEmptyStateActions();
        return;
      }

      grid.innerHTML = projects.map((project, index) => renderProjectCard(project, index)).join('');

      if (window.AOS) {
        window.AOS.refreshHard();
      }

      window.PortfolioProjectsUI.bindCards(grid);
    } catch (error) {
      grid.innerHTML = renderProjectsEmptyState({ variant: 'error' });
      bindEmptyStateActions();
    } finally {
      grid.removeAttribute('aria-busy');
    }
  }

  await loadFeaturedProjects();
});
