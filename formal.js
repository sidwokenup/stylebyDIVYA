document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    const items = document.querySelectorAll('.carousel-item');
    const container = document.getElementById('carousel-container');
    const totalItems = items.length;
    let currentIndex = 0;

    // Define the background colors to sync with the carousel items
    const backgroundColors = [
        '#2E2E2E', // Dark Grey
        '#9D7A75', // Brown
        '#97B397', // Green
        '#C5D0D2', // Bluish Grey
        '#E3DCD4'  // Beige
    ];

    function updateCarousel() {
        if (container) {
            // Set the background color of the main container
            container.style.backgroundColor = backgroundColors[currentIndex];
        }

        items.forEach((item, index) => {
            // Clear previous classes
            item.classList.remove('active', 'prev-1', 'next-1', 'prev-2', 'next-2');

            let newClass = '';
            const diff = index - currentIndex;

            if (diff === 0) {
                newClass = 'active';
            } else if (diff === 1 || diff === - (totalItems - 1)) {
                newClass = 'next-1';
            } else if (diff === -1 || diff === totalItems - 1) {
                newClass = 'prev-1';
            } else if (diff === 2 || diff === - (totalItems - 2)) {
                newClass = 'next-2';
            } else if (diff === -2 || diff === totalItems - 2) {
                newClass = 'prev-2';
            }
            
            if (newClass) {
                item.classList.add(newClass);
            }
        });
    }

    if (items.length > 0) {
        // Set an interval to auto-play the carousel
        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }, 3000); // Changes slide every 3 seconds (3000 milliseconds)

        // Initialize the carousel on page load
        updateCarousel();
    }


    // Intersection Observer for About section animations
    const revealItems = document.querySelectorAll('.reveal-item');

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px', // margin around root
        threshold: 0.1 // percentage of target visible to trigger callback
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    revealItems.forEach(item => {
        observer.observe(item);
    });

    // Product page slider
    const sliderImages = document.querySelector('.slider-images');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const thumbnailImgs = document.querySelectorAll('.thumbnail-img');

    if (sliderImages) {
        const sliderImgs = document.querySelectorAll('.slider-img');
        let sliderCurrentIndex = 0;

        function updateSlider() {
            sliderImgs.forEach((img, index) => {
                img.classList.remove('active');
                if (index === sliderCurrentIndex) {
                    img.classList.add('active');
                }
            });
            thumbnailImgs.forEach((img, index) => {
                img.classList.remove('active');
                if (index === sliderCurrentIndex) {
                    img.classList.add('active');
                }
            });
        }

        nextBtn.addEventListener('click', () => {
            sliderCurrentIndex = (sliderCurrentIndex + 1) % sliderImgs.length;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            sliderCurrentIndex = (sliderCurrentIndex - 1 + sliderImgs.length) % sliderImgs.length;
            updateSlider();
        });

        thumbnailImgs.forEach(img => {
            img.addEventListener('click', () => {
                sliderCurrentIndex = parseInt(img.dataset.index);
                updateSlider();
            });
        });

        updateSlider();
    }

    // Collection gallery slider
    const gallery = document.querySelector('.gallery');
    const prev = document.querySelector('.carousel-arrow.prev');
    const next = document.querySelector('.carousel-arrow.next');

    if (gallery && prev && next) {
        const cardWidth = document.querySelector('.design-card').offsetWidth;
        const scrollAmount = cardWidth * 2; // Scroll by two cards

        next.addEventListener('click', () => {
            gallery.scrollBy({ 
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        prev.addEventListener('click', () => {
            gallery.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
    }
});