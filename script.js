document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('carouselWrapper');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');

    let currentIndex = 0;
    const totalSlides = slides.length;
    const intervalTime = 1500; // 1.5 seconds per swap
    let autoPlayInstance;

    // 1. Initialize Dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // 2. Main Navigation Logic
    function updateCarousel() {
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update Dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoPlay();
    }

    // 3. Auto-Play Logic
    function startAutoPlay() {
        autoPlayInstance = setInterval(nextSlide, intervalTime);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInstance);
        startAutoPlay();
    }

    // 4. Event Listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    // Pause auto-play when mouse enters the carousel
    const container = document.querySelector('.carousel-container');
    container.addEventListener('mouseenter', () => clearInterval(autoPlayInstance));
    container.addEventListener('mouseleave', () => startAutoPlay());

    // Initialize
    startAutoPlay();
});


document.addEventListener('DOMContentLoaded', () => {
    // --- CAROUSEL LOGIC ---
    const wrapper = document.getElementById('carouselWrapper');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');

    if (wrapper) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        const intervalTime = 4000; // Increased to 4s for better readability

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function updateCarousel() {
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });

        nextBtn.addEventListener('click', nextSlide);
        setInterval(nextSlide, intervalTime);
    }
});

// --- MODAL LOGIC (Outside DOMContentLoaded so HTML onclick works) ---
function openPosterModal(imgSrc, captionText) {
    const modal = document.getElementById("posterModal");
    const modalImg = document.getElementById("modalImg");
    const caption = document.getElementById("modalCaption");

    modal.style.display = "block";
    modalImg.src = imgSrc;
    caption.innerHTML = captionText;
    document.body.style.overflow = "hidden"; // Stop background scroll
}

function closePosterModal() {
    document.getElementById("posterModal").style.display = "none";
    document.body.style.overflow = "auto"; // Resume scroll
}

// Close on Esc key
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closePosterModal();
});
