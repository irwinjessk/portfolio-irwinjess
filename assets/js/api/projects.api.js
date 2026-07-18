(function (window) {
  'use strict';

  const { apiGet } = window.PortfolioHttp;
  const { ENDPOINTS, LIMITS } = window.PortfolioApiConfig;

  function fetchFeaturedProjects(limit = LIMITS.HOME_PROJECTS) {
    return apiGet(ENDPOINTS.PROJECTS, {
      featured: true,
      limit,
      page: 1,
    });
  }

  function fetchProjects({ page = 1, limit = LIMITS.PROJECTS_PAGE, service } = {}) {
    const params = { page, limit };
    if (service && service !== 'all') {
      params.service = service;
    }
    return apiGet(ENDPOINTS.PROJECTS, params);
  }

  function fetchProjectDetail(id) {
    return apiGet(ENDPOINTS.PROJECT_DETAIL(id));
  }

  window.PortfolioProjectsApi = {
    fetchFeaturedProjects,
    fetchProjects,
    fetchProjectDetail,
  };
})(window);
