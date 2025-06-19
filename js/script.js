document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const heroSpacer = document.querySelector('.hero-spacer');

    function updateHero() {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        const progress = Math.min(scrollY / heroHeight, 1);
        hero.style.opacity = 1 - progress;
    }

    hero.style.transition = 'opacity 0.3s ease-out';

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateHero);
    });

    updateHero();

    function scrollToSection(sectionId) {
      document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('href').substring(1);
        scrollToSection(sectionId);
      });
    });

    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const carouselDotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let autoSlideInterval;
    let isAnimating = false;
    const slideDuration = 6000; // 6 seconds
    const swipeThreshold = 50; 

    function createDots() {
        if (!carouselDotsContainer) return;
        carouselDotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            dot.dataset.index = index;
            dot.addEventListener('click', () => {
                if (isAnimating) return;
                currentIndex = index;
                updateSlidePosition(true); 
            });
            carouselDotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        if (!carouselDotsContainer) return;
        const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function getCssVariable(variableName) {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    }

    function getGapValue() {
        const trackStyle = window.getComputedStyle(track);
        const gap = parseFloat(trackStyle.gap) || 0;
        return gap;
    }

    function updateSlidePosition(userInteraction = false) {
        if (!track || !slides.length) return;
        
        isAnimating = true; 

        slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });
        
        slides[currentIndex].classList.add('active');
        slides[(currentIndex - 1 + slides.length) % slides.length].classList.add('prev');
        slides[(currentIndex + 1) % slides.length].classList.add('next');
        
        const activeSlide = slides[currentIndex];
        const carousel = document.querySelector('.testimonial-carousel');

        if (!carousel) return;

        const carouselWidth = carousel.offsetWidth;
        const activeSlideWidth = activeSlide.offsetWidth;
        const gap = getGapValue();

        let precedingSlidesWidth = 0;
        for (let i = 0; i < currentIndex; i++) {
            precedingSlidesWidth += slides[i].offsetWidth + gap; 
        }

    
        const translateX = -precedingSlidesWidth + (carouselWidth / 2) - (activeSlideWidth / 2);


        track.style.transform = `translateX(${Math.round(translateX)}px)`;
        
        updateDots();

        const transitionEndHandler = (e) => {
            if (e.propertyName === 'transform') {
                isAnimating = false;
                track.removeEventListener('transitionend', transitionEndHandler);
            }
        };
        track.addEventListener('transitionend', transitionEndHandler);

        if (userInteraction) {
            startAutoSlide(); 
        }
    }

    function nextSlide() {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePosition(true); 
    }

    function prevSlide() {
        if (isAnimating) return;
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlidePosition(true); 
    }

    function startAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        autoSlideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isSwiping = false; 

    if (track) {
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isAnimating = false; 
            isSwiping = false; 
            stopAutoSlide(); 
        }, { passive: false });

        track.addEventListener('touchmove', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;

            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            if (!isSwiping && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) { 
                isSwiping = true;
            }
            
            if (isSwiping) {
                e.preventDefault(); 
            }
        }, { passive: false });

        track.addEventListener('touchend', (e) => {
            const finalDiffX = touchStartX - e.changedTouches[0].screenX;
            const finalDiffY = touchStartY - e.changedTouches[0].screenY;

            if (isSwiping) { 
                if (Math.abs(finalDiffX) > swipeThreshold) {
                    if (finalDiffX > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            } else { 
                if (Math.abs(finalDiffX) <= 10 && Math.abs(finalDiffY) <= 10) {
                    nextSlide(); 
                }
            }

            touchStartX = 0;
            touchEndX = 0;
            touchStartY = 0;
            touchEndY = 0;
            isSwiping = false;
        }, { passive: false });
    }

    if (slides.length > 0) {
        createDots();
        updateSlidePosition();
        startAutoSlide();
    }

    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }

    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlidePosition();
        }, 250);
    });

    // Cleanup
    window.addEventListener('beforeunload', () => {
        stopAutoSlide();
    });
}); 

 function handlePhoneClick(event) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (!isMobile) {
        event.preventDefault();
        const phoneNumber = '+79001234567';
        navigator.clipboard.writeText(phoneNumber).then(() => {
          const button = document.getElementById('phoneButton');
          button.classList.add('copied');
          setTimeout(() => {
            button.classList.remove('copied');
          }, 2000);
        });
      }
    }