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

  function renderProjectsEmptyState({
    variant = 'all',
    serviceTitle = '',
  } = {}) {
    const isError = variant === 'error';
    const isFeatured = variant === 'featured';
    const isFiltered = variant === 'filtered';

    let icon = 'fa-folder-open';
    let title = 'Portfolio en cours de publication';
    let message =
      'Les réalisations seront bientôt disponibles ici. En attendant, échangeons sur votre projet — je peux vous montrer des exemples concrets.';
    let actionLabel = 'Me contacter';
    let actionHref = 'index.html#contact';
    let actionAttrs = ` href="${actionHref}"`;
    let actionClass = 'projects-empty__action projects-empty__action--primary';
    let secondaryAction = '';

    if (isFeatured) {
      title = 'Réalisations bientôt en ligne';
      message =
        'Les projets mis en avant arrivent prochainement. Contactez-moi pour découvrir des travaux similaires à votre besoin.';
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
      title = 'Chargement indisponible';
      message =
        'Les projets n\'ont pas pu être récupérés pour le moment. Réessayez dans quelques instants.';
      actionLabel = 'Réessayer';
      actionAttrs = ' href="#" data-projects-retry';
      actionClass = 'projects-empty__action';
    }

    return `
      <div class="projects-empty${isError ? ' projects-empty--error' : ''}" data-aos="fade-up" role="status">
        <div class="projects-empty__icon" aria-hidden="true">
          <i class="fas ${icon}"></i>
        </div>
        <h3 class="projects-empty__title">${escapeHtml(title)}</h3>
        <p class="projects-empty__text">${message}</p>
        <div class="projects-empty__actions">
          <a${actionAttrs} class="${actionClass}">${actionLabel}</a>
          ${secondaryAction}
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
