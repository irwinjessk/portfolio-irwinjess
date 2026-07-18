document.addEventListener('DOMContentLoaded', async function () {
  const grid = document.getElementById('home-projects-grid');

  if (!grid || !grid.hasAttribute('data-api-featured')) {
    return;
  }

  const { fetchFeaturedProjects } = window.PortfolioProjectsApi;
  const { renderProjectCard } = window.PortfolioRenderProjects;
  const { LIMITS } = window.PortfolioApiConfig;

  grid.setAttribute('aria-busy', 'true');

  try {
    const response = await fetchFeaturedProjects(LIMITS.HOME_PROJECTS);
    const projects = response.data || [];

    if (!projects.length) {
      grid.innerHTML = '<p class="projects-empty">Aucun projet mis en avant pour le moment.</p>';
      return;
    }

    grid.innerHTML = projects.map((project, index) => renderProjectCard(project, index)).join('');

    if (window.AOS) {
      window.AOS.refreshHard();
    }

    window.PortfolioProjectsUI.bindCards(grid);
  } catch (error) {
    grid.innerHTML = '<p class="projects-empty">Impossible de charger les projets pour le moment.</p>';
  } finally {
    grid.removeAttribute('aria-busy');
  }
});
