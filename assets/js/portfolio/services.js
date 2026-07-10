// Spotlight hover effect + card click behavior for My Services
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Spotlight mouse tracking on cards
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        
        // Click behavior: navigate on card click except on arrow button
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.service-link')) {
                const link = card.querySelector('.service-link');
                if (link) {
                    window.location.href = link.href;
                }
            }
        });
    });
});
