// Tech Stack Carousel Logic
class TechCarousel {
    constructor() {
        this.track = document.querySelector('.tech-carousel-track');
        if (!this.track) return;
        
        this.items = document.querySelectorAll('.tech-item:not([aria-hidden="true"])');
        this.allItems = document.querySelectorAll('.tech-item');
        this.wrapper = document.querySelector('.tech-carousel-wrapper');
        this.carousel = document.querySelector('.tech-carousel');
        this.prevBtn = document.querySelector('.tech-nav-prev');
        this.nextBtn = document.querySelector('.tech-nav-next');
        
        this.itemWidth = 140; // item width + gap
        this.gap = 24;
        this.step = this.itemWidth + this.gap;
        this.originalCount = this.items.length;
        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoScrollPaused = false;
        this.autoScrollResumeTimer = null;
        this.AUTO_RESUME_DELAY = 4000;
        
        this.init();
    }

    init() {
        this.cloneItems();
        this.addHoverPause();
        this.addNavigation();
        this.addKeyboardNav();
        this.addTouchSwipe();
        this.updateButtonState();
    }

    cloneItems() {
        const fragment = document.createDocumentFragment();
        
        this.items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            fragment.appendChild(clone);
        });
        
        this.track.appendChild(fragment);
        
        const fragment2 = document.createDocumentFragment();
        this.items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            fragment2.appendChild(clone);
        });
        this.track.appendChild(fragment2);
    }

addHoverPause() {
        if (!this.wrapper) return;
        
        // Pause on wrapper hover (for buttons visibility + carousel pause)
        this.wrapper.addEventListener('mouseenter', () => {
            this.pauseAutoScroll();
        });
        
        this.wrapper.addEventListener('mouseleave', () => {
            this.scheduleAutoResume();
        });
        
        // Pause on card hover (event delegation on track)
        this.track.addEventListener('mouseenter', (e) => {
            const card = e.target.closest('.tech-card');
            if (card) {
                this.pauseAutoScroll();
            }
        }, true); // capture phase to catch before wrapper
        
        this.track.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.tech-card');
            if (card) {
                this.scheduleAutoResume();
            }
        }, true);
    }
        }, true); // capture phase to catch before wrapper
        
        this.track.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.tech-card');
            if (card) {
                this.scheduleAutoResume();
            }
        }, true);
    }
        }, true); // capture phase to catch before wrapper
        
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

    navigate(direction) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.pauseAutoScroll();
        
        const targetIndex = this.currentIndex + direction;
        
        this.track.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        this.track.style.transform = `translateX(${targetIndex * -this.step}px)`;
        
        this.currentIndex = targetIndex;
        
        setTimeout(() => {
            this.checkBoundsAndReset();
            this.isAnimating = false;
            this.updateButtonState();
            this.scheduleAutoResume();
        }, 500);
    }

    checkBoundsAndReset() {
        const maxIndex = this.originalCount * 2;
        const minIndex = -this.originalCount;
        
        if (this.currentIndex >= maxIndex) {
            this.track.style.transition = 'none';
            this.currentIndex -= this.originalCount;
            this.track.style.transform = `translateX(${this.currentIndex * -this.step}px)`;
        } else if (this.currentIndex <= minIndex) {
            this.track.style.transition = 'none';
            this.currentIndex += this.originalCount;
            this.track.style.transform = `translateX(${this.currentIndex * -this.step}px)`;
        }
        
        // Force reflow
        this.track.offsetHeight;
    }

    updateButtonState() {
        // Buttons always enabled for infinite carousel
        if (this.prevBtn) this.prevBtn.disabled = false;
        if (this.nextBtn) this.nextBtn.disabled = false;
    }

    pauseAutoScroll() {
        this.autoScrollPaused = true;
        if (this.track) {
            this.track.style.animationPlayState = 'paused';
        }
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
        if (this.track) {
            this.track.style.animationPlayState = 'running';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TechCarousel();
});