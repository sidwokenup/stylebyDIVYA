document.addEventListener("DOMContentLoaded", function () {
    // --- Intersection Observer for scroll animations ---
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Unobserve the element after it has been shown to improve performance
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Add observer to elements that should fade in on scroll
    document.querySelectorAll('.gallery img, .contact-section').forEach(el => {
        el.classList.add('hidden');
        observer.observe(el);
    });

    // --- Intersection Observer for Brand Story Section ---
    const storyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.5 // Trigger when 50% of the element is visible
    });

    const storyContainer = document.querySelector('.story-container');
    if (storyContainer) {
        storyObserver.observe(storyContainer);
    }


    // --- Mobile menu functionality ---
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
        hamburger.addEventListener('click', () => toggleMenu());

        // Navigation menu links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Handle external links (starting with http)
                if (href.startsWith('http')) {
                    return; // Let the default behavior handle external links
                }

                // Handle navigation back to main page sections
                if (href.includes('#')) {
                    e.preventDefault();
                    toggleMenu(false);
                    
                    // If we're on a product page, go back to main page first
                    const path = window.location.pathname;
                    if (path.includes('.html') && !path.endsWith('/index.html') && path !== '/') {
                         window.location.href = 'index.html' + href;
                    } else {
                        const targetId = href.replace('#', '');
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            });
        });

        // Handle browser back button
        window.addEventListener('popstate', function(e) {
            if (navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
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

    // --- Carousel Navigation ---
    const gallery = document.querySelector('.gallery');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn =  document.querySelector('.carousel-arrow.next');

    // Only initialize carousel if all elements are present
    if (gallery && prevBtn && nextBtn) {
        const firstCard = gallery.querySelector('img');

        // Only setup carousel if there are cards to scroll
        if (firstCard) {
            const scrollGallery = (direction) => {
                // Dynamically get card width and gap for robust scrolling
                const galleryStyles = window.getComputedStyle(gallery);
                const cardGap = parseFloat(galleryStyles.gap) || 0;
                const cardWidth = firstCard.offsetWidth;
                
                const scrollAmount = direction === 'next' ? cardWidth + cardGap : -(cardWidth + cardGap);
                gallery.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            };

            prevBtn.addEventListener('click', () => scrollGallery('prev'));
            nextBtn.addEventListener('click', () => scrollGallery('next'));

            // Hide/show arrows at scroll limits and update cursor
            const updateArrowVisibility = () => {
                // Use a small buffer for floating point inaccuracies
                const scrollEnd = gallery.scrollWidth - gallery.clientWidth;
                prevBtn.style.opacity = gallery.scrollLeft < 1 ? '0.5' : '1';
                prevBtn.style.cursor = gallery.scrollLeft < 1 ? 'default' : 'pointer';
                nextBtn.style.opacity = gallery.scrollLeft >= scrollEnd - 1 ? '0.5' : '1';
                nextBtn.style.cursor = gallery.scrollLeft >= scrollEnd - 1 ? 'default' : 'pointer';
            };

            gallery.addEventListener('scroll', updateArrowVisibility);
            window.addEventListener('resize', updateArrowVisibility);
            updateArrowVisibility(); // Initial check on load
        }
    }

    // --- Contact Form Submission ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Error sending message. Please try again later.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An unexpected error occurred. Please try again later.');
            });
        });
    }
});