(function (window) {
  'use strict';

  const { apiGet } = window.PortfolioHttp;
  const { ENDPOINTS, LIMITS } = window.PortfolioApiConfig;

  function fetchServices({ page = 1, limit = LIMITS.HOME_SERVICES } = {}) {
    return apiGet(ENDPOINTS.SERVICES, { page, limit });
  }

  function fetchServiceDetail(slug) {
    return apiGet(ENDPOINTS.SERVICE_DETAIL(slug));
  }

  function fetchServicesForSelect() {
    return apiGet(ENDPOINTS.SERVICES, { page: 1, limit: LIMITS.CONTACT_SERVICES });
  }

  window.PortfolioServicesApi = {
    fetchServices,
    fetchServiceDetail,
    fetchServicesForSelect,
  };
})(window);
