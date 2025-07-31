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
    // Improved element selection
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (hamburger && navLinks) {
        // Toggle menu function - simplified
        const toggleMenu = (force = null) => {
            const isActive = force !== null ? force : !hamburger.classList.contains('active');
            
            hamburger.classList.toggle('active', isActive);
            navLinks.classList.toggle('active', isActive);
            body.style.overflow = isActive ? 'hidden' : 'auto';
        };

        // Hamburger click handler
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Allow external links to work normally
                if (href.startsWith('http')) {
                    return;
                }

                // Handle internal navigation
                e.preventDefault();
                toggleMenu(false);
                
                // Smooth scroll after menu closes
                setTimeout(() => {
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 300);
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

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
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
