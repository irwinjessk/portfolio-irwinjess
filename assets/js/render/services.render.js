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

  window.PortfolioRenderServices = {
    escapeHtml,
    resolveAssetUrl,
    renderServiceCard,
  };
})(window);
