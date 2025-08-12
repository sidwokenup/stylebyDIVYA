document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.carousel-item');
    const container = document.getElementById('carousel-container');
    const totalItems = items.length;
    let currentIndex = 0;

    // Define the background colors to sync with the carousel items
    // These hex codes are sampled from your video
    const backgroundColors = [
        '#2E2E2E', // Dark Grey
        '#9D7A75', // Brown
        '#97B397', // Green
        '#C5D0D2', // Bluish Grey
        '#E3DCD4'  // Beige
    ];

    function updateCarousel() {
        // Set the background color of the main container
        container.style.backgroundColor = backgroundColors[currentIndex];

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

    // Set an interval to auto-play the carousel
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }, 3000); // Changes slide every 3 seconds (3000 milliseconds)

    // Initialize the carousel on page load
    updateCarousel();

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

    // --- Carousel Navigation for Collection Section ---
    const gallery = document.querySelector('.gallery');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn =  document.querySelector('.carousel-arrow.next');

    // Only initialize carousel if all elements are present
    if (gallery && prevBtn && nextBtn) {
        const firstCard = gallery.querySelector('.design-card'); // Changed to .design-card

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
});