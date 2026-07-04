// Composant Slider de CV (Formation et Expériences)
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.resume-tab');
    const panes = document.querySelectorAll('.tab-pane-custom');

    // Gestion des onglets
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Retirer l'état actif des onglets
            tabs.forEach(t => {
                t.classList.remove('active');
                t.querySelector('.tab-icon').classList.add('d-none');
            });
            // Activer l'onglet cliqué
            tab.classList.add('active');
            tab.querySelector('.tab-icon').classList.remove('d-none');

            // Afficher le contenu correspondant
            const targetId = 'pane-' + tab.getAttribute('data-tab');
            panes.forEach(pane => {
                if (pane.id === targetId) {
                    pane.classList.remove('d-none');
                    pane.classList.add('active');
                } else {
                    pane.classList.add('d-none');
                    pane.classList.remove('active');
                }
            });
        });
    });

    // Gestion des sliders (Pagination et Clavier)
    const setupSlider = (sliderId, paginationId) => {
        const slider = document.getElementById(sliderId);
        if (!slider) return;
        const track = slider.querySelector('.resume-slide-track');
        const pagination = document.getElementById(paginationId);
        if (!track || !pagination) return;

        const slides = Array.from(slider.querySelectorAll('.resume-slide'));
        const dots = Array.from(pagination.querySelectorAll('.resume-dot'));
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const slideDuration = prefersReducedMotion ? 0 : 820;
        let currentIndex = 0;
        let isSliding = false;
        let animationTimer = null;

        const setSlidingState = (nextState) => {
            slider.classList.toggle('is-sliding', nextState);
            dots.forEach(dot => {
                dot.disabled = nextState;
            });
        };

        const updateActiveState = () => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === currentIndex);
                slide.setAttribute('aria-hidden', i === currentIndex ? 'false' : 'true');
            });

            dots.forEach((dot, i) => {
                const isActive = i === currentIndex;
                dot.classList.toggle('active', isActive);
                if (isActive) {
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.removeAttribute('aria-current');
                }
            });
        };

        const goToSlide = (index) => {
            if (isSliding || index < 0 || index >= slides.length || index === currentIndex) return;
            currentIndex = index;

            window.clearTimeout(animationTimer);
            isSliding = true;
            setSlidingState(isSliding);
            updateActiveState();

            requestAnimationFrame(() => {
                track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;
            });

            animationTimer = window.setTimeout(() => {
                isSliding = false;
                setSlidingState(isSliding);
            }, slideDuration);
        };

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => goToSlide(i));
        });

        // Navigation clavier quand le slider est visible
        document.addEventListener('keydown', (e) => {
            // Vérifier si le panneau parent est actif
            const pane = slider.closest('.tab-pane-custom');
            if (pane && !pane.classList.contains('d-none')) {
                if (e.key === 'ArrowLeft') {
                    goToSlide(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    goToSlide(currentIndex + 1);
                }
            }
        });

        updateActiveState();
    };

    setupSlider('slider-formation', 'pagination-formation');
    setupSlider('slider-experience', 'pagination-experience');
});
