// Tech Stack Carousel Logic
class TechCarousel {
    constructor() {
        this.track = document.querySelector('.tech-carousel-track');
        if (!this.track) return;
        
        this.items = document.querySelectorAll('.tech-item');
        this.wrapper = document.querySelector('.tech-carousel-wrapper');
        
        this.init();
    }

    init() {
        // Clone les items pour créer la boucle infinie
        this.cloneItems();
        
        // Ajouter event listeners pour hover pause
        this.addHoverPause();
    }

    cloneItems() {
        const fragment = document.createDocumentFragment();
        
        this.items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true'); // Pour l'accessibilité
            fragment.appendChild(clone);
        });
        
        this.track.appendChild(fragment);
        
        // On clone deux fois pour s'assurer que ça couvre toujours tout l'écran
        // L'animation CSS translate à -33.333% ce qui boucle parfaitement sur les 3 ensembles (1 original + 2 clones)
        const fragment2 = document.createDocumentFragment();
        this.items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            fragment2.appendChild(clone);
        });
        this.track.appendChild(fragment2);
    }

    addHoverPause() {
        const carousel = document.querySelector('.tech-carousel');
        if (!carousel) return;
        
        carousel.addEventListener('mouseenter', () => {
            this.track.style.animationPlayState = 'paused';
        });
        
        carousel.addEventListener('mouseleave', () => {
            this.track.style.animationPlayState = 'running';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TechCarousel();
});
