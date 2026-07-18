(function (window) {
  'use strict';

  const modal = document.querySelector('.project-video-modal');
  const modalFrame = document.querySelector('.project-video-frame');
  const modalTitle = document.querySelector('.project-video-title');
  const modalTag = document.querySelector('.project-video-tag');
  const modalText = document.querySelector('.project-video-text');
  const modalCloseControls = document.querySelectorAll('[data-project-modal-close]');
  const modalCloseButton = document.querySelector('.project-video-close');

  let activeCard = null;
  let modalBound = false;

  function openProjectModal(card) {
    if (!modal || !modalFrame || !card) {
      return;
    }

    const ytPreview = card.querySelector('.youtube-preview');
    const title = card.querySelector('.project-card-title');
    const tag = card.querySelector('.project-card-tag');
    const text = card.querySelector('.project-card-text');

    activeCard = card;

    if (modalTitle) modalTitle.textContent = title ? title.textContent : '';
    if (modalTag) modalTag.textContent = tag ? tag.textContent : '';
    if (modalText) modalText.textContent = text ? text.textContent : '';

    modalFrame.innerHTML = '';

    if (ytPreview && ytPreview.dataset.youtubeId) {
      const videoId = ytPreview.dataset.youtubeId;
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0`;
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.setAttribute('allow', 'autoplay; encrypted-media');
      iframe.setAttribute('allowfullscreen', '');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      modalFrame.appendChild(iframe);
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('project-modal-open');

    if (modalCloseButton) {
      modalCloseButton.focus();
    }
  }

  function closeProjectModal() {
    if (!modal || !modalFrame || !modal.classList.contains('is-open')) {
      return;
    }

    const iframe = modalFrame.querySelector('iframe');
    if (iframe) {
      iframe.src = 'about:blank';
    }

    modalFrame.innerHTML = '';
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('project-modal-open');

    if (activeCard) {
      activeCard.focus();
      activeCard = null;
    }
  }

  function bindModalControls() {
    if (modalBound) {
      return;
    }

    modalCloseControls.forEach((control) => {
      control.addEventListener('click', closeProjectModal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeProjectModal();
      }
    });

    modalBound = true;
  }

  function bindCards(root) {
    if (!root) {
      return;
    }

    bindModalControls();

    root.querySelectorAll('.project-card').forEach((card) => {
      if (card.dataset.bound === 'true') {
        return;
      }

      card.dataset.bound = 'true';

      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
      });

      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute(
        'aria-label',
        `Voir la vidéo du projet ${card.querySelector('.project-card-title')?.textContent || ''}`
      );

      card.addEventListener('click', () => openProjectModal(card));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openProjectModal(card);
        }
      });

      requestAnimationFrame(() => {
        card.classList.add('is-visible');
      });
    });
  }

  window.PortfolioProjectsUI = {
    bindCards,
    openProjectModal,
    closeProjectModal,
  };
})(window);
