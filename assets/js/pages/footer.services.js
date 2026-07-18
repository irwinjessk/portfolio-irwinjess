document.addEventListener('DOMContentLoaded', async function () {
  const list = document.getElementById('footer-services-links');

  if (!list || !list.hasAttribute('data-api-footer-services')) {
    return;
  }

  const { fetchServicesForSelect } = window.PortfolioServicesApi;
  const { renderFooterServiceLinks } = window.PortfolioRenderServices;

  list.setAttribute('aria-busy', 'true');

  try {
    const response = await fetchServicesForSelect();
    list.innerHTML = renderFooterServiceLinks(response.data || []);
  } catch (error) {
    list.innerHTML = renderFooterServiceLinks([]);
  } finally {
    list.removeAttribute('aria-busy');
  }
});
