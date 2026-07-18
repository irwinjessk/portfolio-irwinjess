(function (window) {
  'use strict';

  const { apiPost } = window.PortfolioHttp;
  const { ENDPOINTS } = window.PortfolioApiConfig;

  function submitContact(payload) {
    return apiPost(ENDPOINTS.CONTACT, payload);
  }

  window.PortfolioContactApi = {
    submitContact,
  };
})(window);
