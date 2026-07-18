(function (window) {
  'use strict';

  const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  window.PortfolioApiConfig = {
    BASE_URL: isLocal ? 'http://localhost:8000' : 'https://portfolio-api-gytc.onrender.com',
    LIMITS: {
      HOME_SERVICES: 3,
      HOME_PROJECTS: 4,
      PROJECTS_PAGE: 6,
      CONTACT_SERVICES: 50,
      FILTER_SERVICES: 50,
    },
    ENDPOINTS: {
      SERVICES: '/api/services/',
      SERVICE_DETAIL: (slug) => `/api/services/${encodeURIComponent(slug)}/`,
      PROJECTS: '/api/projects/',
      PROJECT_DETAIL: (id) => `/api/projects/${encodeURIComponent(id)}/`,
      CONTACT: '/api/contact/',
    },
  };
})(window);
