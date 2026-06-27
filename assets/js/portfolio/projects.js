document.addEventListener('DOMContentLoaded', function () {
    const projectsPage = document.querySelector('.projects-page');
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = Array.from(document.querySelectorAll('.project-card'));
    const pagination = document.querySelector('.projects-pagination');
    const emptyState = document.querySelector('.projects-empty');
    const modal = document.querySelector('.project-video-modal');
    const modalPlayer = document.querySelector('.project-video-player');
    const modalTitle = document.querySelector('.project-video-title');
    const modalTag = document.querySelector('.project-video-tag');
    const modalText = document.querySelector('.project-video-text');
    const modalCloseControls = document.querySelectorAll('[data-project-modal-close]');
    const modalCloseButton = document.querySelector('.project-video-close');
    const isProjectsListing = Boolean(projectsPage);
    const pageSize = isProjectsListing ? 6 : projectCards.length;
    let activeService = 'all';
    let currentPage = 1;
    let activeCard = null;

    const getInitialService = () => {
        const params = new URLSearchParams(window.location.search);
        const requestedService = params.get('service');
        const hasButton = requestedService && document.querySelector(`[data-filter="${requestedService}"]`);
        return hasButton ? requestedService : 'all';
    };

    const getFilteredCards = () => {
        if (activeService === 'all') {
            return projectCards;
        }

        return projectCards.filter(card => card.dataset.service === activeService);
    };

    const updateUrl = () => {
        if (!isProjectsListing) {
            return;
        }

        const url = activeService === 'all'
            ? 'projects.html'
            : `projects.html?service=${activeService}`;
        window.history.replaceState({}, '', url);
    };

    const renderPagination = (totalPages) => {
        if (!pagination) {
            return;
        }

        pagination.innerHTML = '';
        pagination.classList.toggle('is-hidden', totalPages <= 1);

        if (totalPages <= 1) {
            return;
        }

        for (let index = 1; index <= totalPages; index += 1) {
            const button = document.createElement('button');
            button.className = 'project-page-dot';
            button.type = 'button';
            button.textContent = index;
            button.setAttribute('aria-label', `Page ${index}`);
            button.classList.toggle('active', index === currentPage);
            if (index === currentPage) {
                button.setAttribute('aria-current', 'page');
            }
            button.addEventListener('click', () => {
                currentPage = index;
                renderProjects();
            });
            pagination.appendChild(button);
        }
    };

    const getVisibleCards = () => projectCards.filter(card => card.style.display !== 'none');

    const playVisiblePreviewVideos = () => {
        if (document.body.classList.contains('project-modal-open')) {
            return;
        }

        getVisibleCards().forEach(card => {
            const video = card.querySelector('video');
            if (video) {
                video.muted = true;
                video.play().catch(() => {});
            }
        });
    };

    const pausePreviewVideos = () => {
        projectCards.forEach(card => {
            const video = card.querySelector('video');
            if (video) {
                video.pause();
            }
        });
    };

    const openProjectModal = (card) => {
        if (!modal || !modalPlayer) {
            return;
        }

        const videoSource = card.querySelector('video source');
        const title = card.querySelector('.project-card-title');
        const tag = card.querySelector('.project-card-tag');
        const text = card.querySelector('.project-card-text');

        activeCard = card;
        pausePreviewVideos();

        modalTitle.textContent = title ? title.textContent : '';
        modalTag.textContent = tag ? tag.textContent : '';
        modalText.textContent = text ? text.textContent : '';
        modalPlayer.innerHTML = '';

        if (videoSource) {
            const source = document.createElement('source');
            source.src = videoSource.src;
            source.type = videoSource.type || 'video/mp4';
            modalPlayer.appendChild(source);
        }

        modalPlayer.load();
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('project-modal-open');
        if (modalCloseButton) {
            modalCloseButton.focus();
        }
        modalPlayer.play().catch(() => {});
    };

    const closeProjectModal = () => {
        if (!modal || !modalPlayer || !modal.classList.contains('is-open')) {
            return;
        }

        modalPlayer.pause();
        modalPlayer.removeAttribute('src');
        modalPlayer.innerHTML = '';
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('project-modal-open');
        playVisiblePreviewVideos();

        if (activeCard) {
            activeCard.focus();
            activeCard = null;
        }
    };

    const renderProjects = () => {
        const filteredCards = getFilteredCards();
        const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
        currentPage = Math.min(currentPage, totalPages);
        const start = (currentPage - 1) * pageSize;
        const visibleCards = filteredCards.slice(start, start + pageSize);

        projectCards.forEach(card => {
            const video = card.querySelector('video');
            card.classList.remove('is-visible');
            card.style.display = visibleCards.includes(card) ? '' : 'none';
            if (!visibleCards.includes(card) && video) {
                video.pause();
            }
        });

        visibleCards.forEach((card, index) => {
            const video = card.querySelector('video');
            card.style.transitionDelay = `${index * 45}ms`;
            requestAnimationFrame(() => {
                card.classList.add('is-visible');
                if (video && !document.body.classList.contains('project-modal-open')) {
                    video.muted = true;
                    video.play().catch(() => {});
                }
            });
        });

        if (emptyState) {
            emptyState.style.display = filteredCards.length ? 'none' : 'block';
        }
        renderPagination(totalPages);
    };

    const setActiveService = (service) => {
        activeService = service;
        currentPage = 1;
        filterButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.filter === activeService);
        });
        updateUrl();
        renderProjects();
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            setActiveService(button.dataset.filter);
        });
    });

    projectCards.forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Voir la vidéo du projet ${card.querySelector('.project-card-title')?.textContent || ''}`);

        card.addEventListener('click', () => {
            openProjectModal(card);
        });

        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProjectModal(card);
            }
        });
    });

    modalCloseControls.forEach(control => {
        control.addEventListener('click', closeProjectModal);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeProjectModal();
        }
    });

    if (projectsPage) {
        projectsPage.classList.add('projects-ready');
    }
    setActiveService(getInitialService());
});
