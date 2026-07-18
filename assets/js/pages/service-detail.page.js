document.addEventListener('DOMContentLoaded', async function () {
  const root = document.getElementById('service-detail-root');

  if (!root || !root.hasAttribute('data-api-service-detail')) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const { fetchServiceDetail } = window.PortfolioServicesApi;
  const { renderServiceDetailPage, renderServiceDetailError } = window.PortfolioRenderServiceDetail;

  if (!slug) {
    root.innerHTML = renderServiceDetailError('Aucun service n\'a été sélectionné.');
    return;
  }

  try {
    const response = await fetchServiceDetail(slug);
    const service = response.data;

    if (!service) {
      root.innerHTML = renderServiceDetailError('Ce service n\'existe pas ou n\'est plus disponible.');
      return;
    }

    document.title = `${service.title} — Irwin Portfolio`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && service.short_description) {
      metaDescription.setAttribute('content', service.short_description);
    }

    root.innerHTML = renderServiceDetailPage(service);

    if (window.AOS) {
      window.AOS.refreshHard();
    }
  } catch (error) {
    if (error.status === 404) {
      root.innerHTML = renderServiceDetailError('Ce service n\'existe pas ou n\'est plus disponible.');
      return;
    }

    root.innerHTML = renderServiceDetailError(
      'Impossible de charger ce service pour le moment. Réessayez plus tard.'
    );
  }
});
