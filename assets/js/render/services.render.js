(function (window) {
  'use strict';

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function resolveAssetUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || url.startsWith('//')) {
      return url;
    }
    if (url.startsWith('./') || url.startsWith('../')) {
      return url;
    }
    if (url.startsWith('/')) {
      return `.${url}`;
    }
    return `./${url.replace(/^\.\//, '')}`;
  }

  function renderServiceCard(service, index) {
    const featuredClass = service.is_featured ? ' service-card--featured' : '';
    const badge = service.is_featured ? '<span class="service-badge">Signature</span>' : '';
    const delay = 120 + index * 60;
    const imageUrl = resolveAssetUrl(service.image_url);
    const detailHref = `service.html?slug=${encodeURIComponent(service.slug)}`;

    return `
      <article class="service-card${featuredClass}" data-service-id="${escapeHtml(service.slug)}" data-aos="fade-up" data-aos-delay="${delay}">
        ${badge}
        <div class="service-image-wrapper">
          <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(service.title)}" class="service-image" loading="lazy">
        </div>
        <div class="service-overlay" aria-hidden="true"></div>
        <div class="service-body">
          <div class="service-content">
            <h3 class="service-title">${escapeHtml(service.title)}</h3>
            <p class="service-description">${escapeHtml(service.short_description)}</p>
          </div>
          <div class="service-footer">
            <a href="${detailHref}" class="service-link" aria-label="Détails ${escapeHtml(service.title)}">
              <span class="service-arrow">↗</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function renderServicesEmptyState({ variant = 'empty' } = {}) {
    const isError = variant === 'error';
    const icon = isError ? 'fa-exclamation-circle' : 'fa-layer-group';
    const title = isError ? 'Chargement indisponible' : 'Catalogue en préparation';
    const message = isError
      ? 'Les services n\'ont pas pu être récupérés pour le moment. Réessayez dans quelques instants.'
      : 'Les fiches détaillées de mes services seront bientôt en ligne. En attendant, décrivez-moi votre besoin — je vous réponds rapidement.';
    const actionLabel = isError ? 'Réessayer' : 'Me contacter';
    const actionHref = isError ? '#' : '#contact';
    const actionAttrs = isError ? ' data-services-retry href="#"' : ` href="${actionHref}"`;
    const actionClass = isError ? 'services-empty__action' : 'services-empty__action services-empty__action--primary';

    return `
      <div class="services-empty${isError ? ' services-empty--error' : ''}" data-aos="fade-up" role="status">
        <div class="services-empty__icon" aria-hidden="true">
          <i class="fas ${icon}"></i>
        </div>
        <h3 class="services-empty__title">${title}</h3>
        <p class="services-empty__text">${message}</p>
        <a${actionAttrs} class="${actionClass}">${actionLabel}</a>
      </div>
    `;
  }

  window.PortfolioRenderServices = {
    escapeHtml,
    resolveAssetUrl,
    renderServiceCard,
    renderServicesEmptyState,
  };
})(window);
