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

  window.PortfolioRenderProjects = {
    renderProjectCard,
    resolveThumbnail,
  };
})(window);
