(function (window) {
  'use strict';

  function getBaseUrl() {
    return window.PortfolioApiConfig.BASE_URL;
  }

  async function parseJson(response) {
    try {
      return await response.json();
    } catch (error) {
      return {};
    }
  }

  async function apiGet(path, params) {
    const url = new URL(`${getBaseUrl()}${path}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
    });

    const body = await parseJson(response);

    if (!response.ok) {
      const error = new Error(body.detail || `Erreur API (${response.status})`);
      error.status = response.status;
      error.body = body;
      throw error;
    }

    return body;
  }

  async function apiPost(path, payload) {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const body = await parseJson(response);

    if (!response.ok) {
      const error = new Error(body.detail || `Erreur API (${response.status})`);
      error.status = response.status;
      error.body = body;
      throw error;
    }

    return body;
  }

  window.PortfolioHttp = {
    apiGet,
    apiPost,
  };
})(window);
