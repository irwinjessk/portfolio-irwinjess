(function (window) {
  'use strict';

  const { escapeHtml, resolveAssetUrl } = window.PortfolioRenderServices;

  function renderFeatures(detail) {
    if (!detail || !Array.isArray(detail.features) || !detail.features.length) {
      return '';
    }

    const title = detail.features_title || 'Ce que je propose';
    const items = detail.features
      .map((feature) => `<li>${escapeHtml(feature)}</li>`)
      .join('');

    return `
      <div class="details-features mt-5">
        <h2>${escapeHtml(title)}</h2>
        <ul>${items}</ul>
      </div>
    `;
  }

  function renderHighlight(detail) {
    if (!detail || !detail.highlight) {
      return '';
    }

    return `
      <div class="details-highlight">
        <p>${escapeHtml(detail.highlight)}</p>
      </div>
    `;
  }

  function renderMainContent(service) {
    const detail = service.detail;

    if (detail && detail.content) {
      return `
        ${detail.content}
        ${renderHighlight(detail)}
        ${renderFeatures(detail)}
      `;
    }

    if (service.short_description) {
      return `<p>${escapeHtml(service.short_description)}</p>`;
    }

    return '<p>Le contenu détaillé de ce service sera bientôt disponible.</p>';
  }

  function renderSidebar(service) {
    const detail = service.detail || {};
    const ctaTitle = detail.cta_title || 'Un projet en tête ?';
    const ctaText =
      detail.cta_text ||
      'Parlez-moi de votre besoin et je vous prépare une proposition adaptée, sans engagement.';

    return `
      <aside class="col-lg-4 details-aside" data-aos="fade-up" data-aos-delay="140">
        <div class="details-side-card">
          <h3>${escapeHtml(ctaTitle)}</h3>
          <p>${escapeHtml(ctaText)}</p>
          <div class="details-side-actions">
            <a href="index.html#contact" class="cta-button">Demander un devis</a>
            <a href="projects.html?service=${encodeURIComponent(service.slug)}" class="cta-button cta-button--secondary">Voir mes réalisations</a>
          </div>
        </div>
      </aside>
    `;
  }

  function renderServiceDetailPage(service) {
    const badge = service.is_featured
      ? '<span class="details-service-badge">Signature</span>'
      : '';
    const imageUrl = resolveAssetUrl(service.image_url);

    return `
      <header class="service-details-top">
        <a href="index.html#myservices" class="service-back-button" aria-label="Retour aux services">
          <i class="fas fa-arrow-left" aria-hidden="true"></i>
        </a>
        <nav class="details-breadcrumb" aria-label="Fil d'Ariane">
          <a href="index.html">Accueil</a>
          <span class="details-breadcrumb-sep">/</span>
          <a href="index.html#myservices">Services</a>
          <span class="details-breadcrumb-sep">/</span>
          <span aria-current="page">${escapeHtml(service.title)}</span>
        </nav>
      </header>

      <div class="details-hero" data-aos="fade-up">
        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(service.title)}">
      </div>

      <div class="details-intro" data-aos="fade-up" data-aos-delay="60">
        <h1 class="details-page-title">${escapeHtml(service.title)}</h1>
        ${badge}
      </div>

      <div class="row service-details-layout">
        <div class="col-lg-8">
          <div class="details-panel details-content" data-aos="fade-up" data-aos-delay="100">
            ${renderMainContent(service)}
          </div>
        </div>
        ${renderSidebar(service)}
      </div>
    `;
  }

  function renderServiceDetailError(message) {
    return `
      <div class="service-detail-error" data-aos="fade-up">
        <h1 class="details-page-title">Service introuvable</h1>
        <p>${escapeHtml(message)}</p>
        <a href="index.html#myservices" class="cta-button">Retour aux services</a>
      </div>
    `;
  }

  window.PortfolioRenderServiceDetail = {
    renderServiceDetailPage,
    renderServiceDetailError,
  };
})(window);
