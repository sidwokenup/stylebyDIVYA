document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.carousel-item');
    const container = document.getElementById('carousel-container');
    const totalItems = items.length;
    let currentIndex = 0;

    // Add handler for external links
    document.querySelectorAll('nav a[href^="https"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Ensure the link opens in a new tab
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
            // Add security attributes
            if (!link.hasAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    });

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
});