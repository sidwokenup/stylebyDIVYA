// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.1
});

// Add observer to elements
document.querySelectorAll('.gallery img, .story-section, .contact-section').forEach(el => {
    el.classList.add('hidden');
    observer.observe(el);
});

// Mobile menu functionality
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (hamburger && navLinks) {
        const toggleMenu = (force = null) => {
            const isActive = force !== null ? force : !hamburger.classList.contains('active');
            hamburger.classList.toggle('active', isActive);
            navLinks.classList.toggle('active', isActive);
            body.style.overflow = isActive ? 'hidden' : 'auto';
        };

        // Hamburger click
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Product card navigation
        const productLinks = document.querySelectorAll('.design-card a');
        productLinks.forEach(link => {
            ['click', 'touchend'].forEach(eventType => {
                link.addEventListener(eventType, (e) => {
                    e.stopPropagation();
                    const href = link.getAttribute('href');
                    
                    if (!href) return;

                    // Direct navigation for product pages
                    if (href.endsWith('.html')) {
                        window.location.href = href;
                    }
                });
            });
        });

        // Navigation menu links
        navLinks.querySelectorAll('a').forEach(link => {
            ['click', 'touchend'].forEach(eventType => {
                link.addEventListener(eventType, (e) => {
                    const href = link.getAttribute('href');
                    
                    // Handle external links
                    if (href.startsWith('http')) {
                        toggleMenu(false);
                        return;
                    }

                    // Handle product pages
                    if (href.endsWith('.html')) {
                        e.preventDefault();
                        toggleMenu(false);
                        setTimeout(() => {
                            window.location.href = href;
                        }, 300);
                        return;
                    }

                    // Handle internal navigation
                    e.preventDefault();
                    toggleMenu(false);
                    
                    const targetId = href.replace('#', '');
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                    }
                });
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !hamburger.contains(e.target) && 
                !navLinks.contains(e.target)) {
                toggleMenu(false);
            }
        });
    }
});

// Carousel Navigation
document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    const cardWidth = 300; // Match with CSS flex-basis

    function scrollGallery(direction) {
        const scrollAmount = direction === 'next' ? cardWidth + 32 : -(cardWidth + 32);
        gallery.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    prevBtn?.addEventListener('click', () => scrollGallery('prev'));
    nextBtn?.addEventListener('click', () => scrollGallery('next'));

    // Optional: Hide arrows at scroll limits
    const updateArrowVisibility = () => {
        if (prevBtn && nextBtn) {
            prevBtn.style.opacity = gallery.scrollLeft <= 0 ? '0.5' : '1';
            nextBtn.style.opacity = 
                gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 1 
                    ? '0.5' 
                    : '1';
        }
    };

    gallery?.addEventListener('scroll', updateArrowVisibility);
    window.addEventListener('resize', updateArrowVisibility);
    updateArrowVisibility();
});
