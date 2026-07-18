(function (window) {
  'use strict';

  const { escapeHtml } = window.PortfolioRenderServices;

  function resolveThumbnail(project) {
    if (project.thumbnail_url) {
      return project.thumbnail_url;
    }
    if (project.youtube_id) {
      return `https://img.youtube.com/vi/${project.youtube_id}/hqdefault.jpg`;
    }
    return '';
  }

  function renderProjectCard(project, index) {
    const serviceSlug = project.service_slug || project.service?.slug || '';
    const serviceTitle = project.service_title || project.service?.title || '';
    const youtubeId = project.youtube_id || '';
    const thumbnail = resolveThumbnail(project);
    const delay = index * 45;

    return `
      <article class="project-card" data-service="${escapeHtml(serviceSlug)}" data-project-id="${escapeHtml(project.id)}" data-aos="fade-up" data-aos-delay="${delay}">
        <div class="project-card-media">
          <div class="youtube-preview" data-youtube-id="${escapeHtml(youtubeId)}" aria-label="Aperçu vidéo ${escapeHtml(project.title)}">
            <img src="${escapeHtml(thumbnail)}" alt="Aperçu ${escapeHtml(project.title)}" class="youtube-thumb" loading="lazy">
          </div>
          <span class="project-video-badge"><i class="fas fa-play"></i></span>
        </div>
        <div class="project-card-body">
          <span class="project-card-tag">${escapeHtml(serviceTitle)}</span>
          <h3 class="project-card-title">${escapeHtml(project.title)}</h3>
          <p class="project-card-text">${escapeHtml(project.description)}</p>
        </div>
      </article>
    `;
  }

  function renderServiceTags(services) {
    const fallback = [
      { title: 'Applications', slug: 'applications' },
      { title: 'Automatisation', slug: 'automation' },
      { title: 'Maintenance', slug: 'maintenance' },
    ];
    const items = services && services.length ? services.slice(0, 4) : fallback;

    return items
      .map(
        (service) =>
          `<span class="projects-empty__tag">${escapeHtml(service.title || service)}</span>`
      )
      .join('');
  }

  function renderListingHighlights() {
    const items = [
      { icon: 'fa-play-circle', text: 'Démos vidéo intégrées' },
      { icon: 'fa-layer-group', text: 'Projets classés par service' },
      { icon: 'fa-bolt', text: 'Cas concrets et résultats' },
    ];

    return items
      .map(
        (item) => `
          <li class="projects-empty__highlight">
            <i class="fas ${item.icon}" aria-hidden="true"></i>
            <span>${item.text}</span>
          </li>
        `
      )
      .join('');
  }

  function renderProjectsEmptyState({
    variant = 'all',
    serviceTitle = '',
    services = [],
    context = 'default',
  } = {}) {
    const isError = variant === 'error';
    const isFeatured = variant === 'featured';
    const isFiltered = variant === 'filtered' || variant === 'listing-filtered';
    const isListing =
      context === 'listing' || variant === 'listing' || variant === 'listing-filtered';

    let icon = 'fa-folder-open';
    let eyebrow = 'Catalogue en préparation';
    let title = 'Portfolio en cours de publication';
    let message =
      'Les réalisations seront bientôt disponibles ici. En attendant, échangeons sur votre projet — je peux vous montrer des exemples concrets.';
    let actionLabel = 'Me contacter';
    let actionAttrs = ' href="index.html#contact"';
    let actionClass = 'projects-empty__action projects-empty__action--primary';
    let secondaryAction = '';
    let highlights = '';
    let tags = '';
    let decor = '';

    if (isListing) {
      decor = `
        <div class="projects-empty__decor" aria-hidden="true">
          <div class="projects-empty__ghost projects-empty__ghost--1"></div>
          <div class="projects-empty__ghost projects-empty__ghost--2"></div>
          <div class="projects-empty__ghost projects-empty__ghost--3"></div>
        </div>
      `;
      if (variant === 'listing') {
        highlights = `<ul class="projects-empty__highlights">${renderListingHighlights()}</ul>`;
      }
      if (variant === 'listing' || isError) {
        secondaryAction = `
          <a href="index.html#home" class="projects-empty__action">Retour à l'accueil</a>
        `;
      }
    }

    if (isFeatured) {
      title = 'Réalisations bientôt en ligne';
      message =
        'Les projets mis en avant arrivent prochainement. Contactez-moi pour découvrir des travaux similaires à votre besoin.';
    } else if (variant === 'listing-filtered' || (isFiltered && isListing)) {
      icon = 'fa-filter';
      eyebrow = 'Filtre actif';
      title = serviceTitle
        ? `Aucun projet « ${serviceTitle} » pour le moment`
        : 'Aucun projet pour ce service';
      message =
        'Je n\'ai pas encore publié de réalisation dans cette catégorie. Changez de filtre ou contactez-moi pour un exemple sur mesure.';
      actionLabel = 'Voir tous les projets';
      actionAttrs = ' href="#" data-projects-reset-filter';
      actionClass = 'projects-empty__action projects-empty__action--primary';
      tags = `<div class="projects-empty__tags">${renderServiceTags(services)}</div>`;
      secondaryAction = `
        <a href="index.html#contact" class="projects-empty__action">Me contacter</a>
      `;
    } else if (variant === 'listing') {
      title = 'Vos prochains projets apparaîtront ici';
      message =
        'Je prépare une galerie de réalisations avec aperçus vidéo, contexte métier et résultats obtenus. En attendant, discutons de votre besoin — je partage des exemples adaptés.';
      tags = `<div class="projects-empty__tags">${renderServiceTags(services)}</div>`;
    } else if (isFiltered) {
      icon = 'fa-filter';
      title = serviceTitle
        ? `Aucun projet « ${serviceTitle} » pour le moment`
        : 'Aucun projet pour ce service';
      message =
        'Je n\'ai pas encore publié de réalisation dans cette catégorie. Explorez les autres filtres ou contactez-moi directement.';
      actionLabel = 'Voir tous les projets';
      actionAttrs = ' href="#" data-projects-reset-filter';
      secondaryAction = `
        <a href="index.html#contact" class="projects-empty__action">Me contacter</a>
      `;
    } else if (isError) {
      icon = 'fa-exclamation-circle';
      eyebrow = 'Erreur de chargement';
      title = 'Chargement indisponible';
      message =
        'Les projets n\'ont pas pu être récupérés pour le moment. Réessayez dans quelques instants.';
      actionLabel = 'Réessayer';
      actionAttrs = ' href="#" data-projects-retry';
      actionClass = 'projects-empty__action';
      secondaryAction = isListing
        ? `
          <a href="index.html#home" class="projects-empty__action">Retour à l'accueil</a>
          <a href="index.html#contact" class="projects-empty__action">Me contacter</a>
        `
        : `
          <a href="index.html#contact" class="projects-empty__action">Me contacter</a>
        `;
    }

    const listingClass = isListing ? ' projects-empty--listing' : '';
    const errorClass = isError ? ' projects-empty--error' : '';
    const eyebrowHtml = isListing
      ? `<span class="projects-empty__eyebrow">${escapeHtml(eyebrow)}</span>`
      : '';

    return `
      <div class="projects-empty${listingClass}${errorClass}" data-aos="fade-up" role="status">
        ${decor}
        <div class="projects-empty__content">
          ${eyebrowHtml}
          <div class="projects-empty__icon" aria-hidden="true">
            <i class="fas ${icon}"></i>
          </div>
          <h3 class="projects-empty__title">${escapeHtml(title)}</h3>
          <p class="projects-empty__text">${message}</p>
          ${highlights}
          ${tags}
          <div class="projects-empty__actions">
            <a${actionAttrs} class="${actionClass}">${actionLabel}</a>
            ${secondaryAction}
          </div>
        </div>
      </div>
    `;
  }

  window.PortfolioRenderProjects = {
    renderProjectCard,
    renderProjectsEmptyState,
    resolveThumbnail,
  };
})(window);
