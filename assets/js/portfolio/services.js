// Logique d'animation au scroll pour My Services
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Intersection Observer pour animer les cartes à l'apparition
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajout d'un délai progressif pour le stagger effect
                const delay = entry.target.dataset.delay || 0;
                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    serviceCards.forEach((card, index) => {
        // Appliquer un délai dynamique basé sur l'index (Stagger effect)
        card.dataset.delay = index * 0.15;
        observer.observe(card);
    });

    // Optionnel : Gestion du clic sur toute la carte pour naviguer
    serviceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Si on clique directement sur la flèche, on laisse faire le lien classique (a href)
            // Sinon, on redirige manuellement vers le lien de la carte
            if(!e.target.closest('.service-link')) {
                const link = card.querySelector('.service-link');
                if(link) {
                    window.location.href = link.href;
                }
            }
        });
    });
});
