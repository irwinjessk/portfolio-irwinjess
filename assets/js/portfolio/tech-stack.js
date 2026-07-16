// Tech Stack Infinite Carousel Logic
class TechCarousel {
    constructor() {
        this.track = document.querySelector('.tech-carousel-track');
        if (!this.track) return;
        
        this.originalItems = Array.from(document.querySelectorAll('.tech-item'));
        if (this.originalItems.length === 0) return;
        
        this.wrapper = document.querySelector('.tech-carousel-wrapper');
        this.carousel = document.querySelector('.tech-carousel');
        this.prevBtn = document.querySelector('.tech-nav-prev');
        this.nextBtn = document.querySelector('.tech-nav-next');
        
        this.itemWidth = 0;
        this.gap = 24;
        this.step = 0;
        this.originalCount = this.originalItems.length;
        this.currentX = 0;
        this.isAnimating = false;
        this.autoScrollPaused = false;
        this.autoScrollResumeTimer = null;
        this.AUTO_RESUME_DELAY = 4000;
        this.autoScrollSpeed = 0.6;
        this.rafId = null;
        
        this.init();
    }

    init() {
        this.cloneItems();
        this.measureStep();
        this.addHoverPause();
        this.addTouchCards();
        this.addNavigation();
        this.addKeyboardNav();
        this.addTouchSwipe();
        this.addResizeHandler();
        this.updateButtonState();
        this.startAutoScroll();
    }

    measureStep() {
        const firstItem = this.originalItems[0];
        if (!firstItem) return;

        const trackStyles = getComputedStyle(this.track);
        const gap = parseFloat(trackStyles.gap) || 24;
        const width = firstItem.getBoundingClientRect().width;

        this.gap = gap;
        this.itemWidth = width;
        this.step = width + gap;
    }

    addResizeHandler() {
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const previousStep = this.step || 1;
                this.measureStep();
                if (previousStep !== this.step) {
                    this.currentX = (this.currentX / previousStep) * this.step;
                    this.applyTransform(false);
                    this.checkBounds();
                }
            }, 120);
        });
    }

    addTouchCards() {
        this.track.addEventListener('click', (e) => {
            const card = e.target.closest('.tech-card');
            if (!card) return;

            const item = card.closest('.tech-item');
            if (item?.getAttribute('aria-hidden') === 'true') return;

            const cards = this.track.querySelectorAll('.tech-item:not([aria-hidden="true"]) .tech-card');
            const wasActive = card.classList.contains('is-touched');
            cards.forEach((entry) => entry.classList.remove('is-touched'));
            if (!wasActive) {
                card.classList.add('is-touched');
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.tech-carousel-track') || e.target.closest('.tech-nav-btn')) {
                return;
            }
            this.track.querySelectorAll('.tech-card.is-touched').forEach((card) => {
                card.classList.remove('is-touched');
            });
        });
    }

    cloneItems() {
        const fragment1 = document.createDocumentFragment();
        const fragment2 = document.createDocumentFragment();
        
        this.originalItems.forEach(item => {
            const clone1 = item.cloneNode(true);
            clone1.setAttribute('aria-hidden', 'true');
            fragment1.appendChild(clone1);
            
            const clone2 = item.cloneNode(true);
            clone2.setAttribute('aria-hidden', 'true');
            fragment2.appendChild(clone2);
        });
        
        this.track.appendChild(fragment1);
        this.track.appendChild(fragment2);
    }

    addHoverPause() {
        if (!this.wrapper) return;
        
        this.wrapper.addEventListener('mouseenter', () => {
            this.pauseAutoScroll();
        });
        
        this.wrapper.addEventListener('mouseleave', () => {
            this.scheduleAutoResume();
        });
        
        this.track.addEventListener('mouseenter', (e) => {
            const card = e.target.closest('.tech-card');
            if (card) {
                this.pauseAutoScroll();
            }
        }, true);
        
        this.track.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.tech-card');
            if (card) {
                this.scheduleAutoResume();
            }
        }, true);
    }

    addNavigation() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigate(-1));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigate(1));
        }
    }

    addKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (!this.isCarouselFocused()) return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.navigate(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.navigate(1);
            }
        });
    }

    isCarouselFocused() {
        const carousel = document.querySelector('.tech-carousel');
        return carousel && (carousel === document.activeElement || carousel.contains(document.activeElement));
    }

    addTouchSwipe() {
        if (!this.carousel) return;
        
        let startX = 0;
        let startTime = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTime = Date.now();
            this.pauseAutoScroll();
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const deltaX = startX - endX;
            const deltaTime = Date.now() - startTime;
            
            if (Math.abs(deltaX) > 40 && deltaTime < 300) {
                this.navigate(deltaX > 0 ? 1 : -1);
            }
            this.scheduleAutoResume();
        }, { passive: true });
    }

    startAutoScroll() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        
        const tick = () => {
            if (!this.autoScrollPaused) {
                this.currentX -= this.autoScrollSpeed;
                this.applyTransform(false);
                this.checkBounds();
            }
            this.rafId = requestAnimationFrame(tick);
        };
        
        this.rafId = requestAnimationFrame(tick);
    }

    applyTransform(animate = true) {
        if (animate) {
            this.track.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        } else {
            this.track.style.transition = 'none';
        }
        this.track.style.transform = `translateX(${this.currentX}px)`;
    }

    checkBounds() {
        const limit = this.originalCount * this.step;
        const min = -limit * 2;
        const max = 0;
        
        if (this.currentX <= min) {
            this.currentX += limit;
            this.applyTransform(false);
        } else if (this.currentX > max) {
            this.currentX -= limit;
            this.applyTransform(false);
        }
    }

    navigate(direction) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.pauseAutoScroll();
        
        this.currentX += direction * -this.step;
        this.applyTransform(true);
        
        setTimeout(() => {
            this.checkBounds();
            this.isAnimating = false;
            this.updateButtonState();
            this.scheduleAutoResume();
        }, 500);
    }

    updateButtonState() {
        if (this.prevBtn) this.prevBtn.disabled = false;
        if (this.nextBtn) this.nextBtn.disabled = false;
    }

    pauseAutoScroll() {
        this.autoScrollPaused = true;
        this.clearResumeTimer();
    }

    scheduleAutoResume() {
        this.clearResumeTimer();
        this.autoScrollResumeTimer = setTimeout(() => {
            this.resumeAutoScroll();
        }, this.AUTO_RESUME_DELAY);
    }

    clearResumeTimer() {
        if (this.autoScrollResumeTimer) {
            clearTimeout(this.autoScrollResumeTimer);
            this.autoScrollResumeTimer = null;
        }
    }

    resumeAutoScroll() {
        if (!this.autoScrollPaused) return;
        this.autoScrollPaused = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TechCarousel();
});
