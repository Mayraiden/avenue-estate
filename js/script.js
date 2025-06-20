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
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
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

    // Удаляем обработчики свайпа и тапа
    // Возвращаем обработчики для стрелок
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }

    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }

    if (slides.length > 0) {
        createDots();
        updateSlidePosition();
        startAutoSlide();
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

    // Мобильное меню (бургер)
    const burger = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    let navCloseTimeout;

    function closeMenu() {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      clearTimeout(navCloseTimeout);
      navCloseTimeout = setTimeout(() => {
        nav.classList.add('nav--hidden');
      }, 750); // чуть больше, чем transition
    }

    function openMenu() {
      nav.classList.remove('nav--hidden');
      nav.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      clearTimeout(navCloseTimeout);
    }

    if (burger && nav) {
      burger.addEventListener('click', function(e) {
        e.stopPropagation();
        if (nav.classList.contains('open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Закрытие по клику вне меню
      document.addEventListener('click', function(e) {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) {
          closeMenu();
        }
      });

      // Закрытие по ESC
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
          closeMenu();
        }
      });

      // Автоматически закрывать меню при ресайзе на десктоп
      window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
          closeMenu();
        }
      });
    }

    // Обработчик для phoneButton: копирование на десктопе, звонок на мобильных, смена текста
    const phoneButton = document.getElementById('phoneButton');
    if (phoneButton) {
      phoneButton.addEventListener('click', function (event) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const phoneNumber = '+79001234567';
        if (isMobile) {
          window.location.href = 'tel:' + phoneNumber;
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          event.preventDefault();
          navigator.clipboard.writeText(phoneNumber).then(() => {
            phoneButton.classList.add('copied');
            setTimeout(() => {
              phoneButton.classList.remove('copied');
            }, 2000);
          }).catch((err) => {
            fallbackCopy(phoneNumber);
          });
        } else {
          fallbackCopy(phoneNumber);
        }

        function fallbackCopy(text) {
          // Fallback через временный input
          const tempInput = document.createElement('input');
          tempInput.value = text;
          document.body.appendChild(tempInput);
          tempInput.select();
          tempInput.setSelectionRange(0, 99999); // для мобильных
          let success = false;
          try {
            success = document.execCommand('copy');
          } catch (err) {
            success = false;
          }
          document.body.removeChild(tempInput);
          phoneButton.classList.add('copied');
          setTimeout(() => {
            phoneButton.classList.remove('copied');
          }, 2000);
          if (!success) {
            alert('Не удалось скопировать номер. Просто скопируйте вручную: ' + text);
          }
        }
      });
    }

    function syncPhoneButtonWidth() {
        const phoneButton = document.querySelector('.footer-phone-right');
        const messengers = document.querySelector('.footer-messengers');
        if (!phoneButton || !messengers) return;
        if (window.innerWidth <= 768) {
            const messengersWidth = messengers.offsetWidth;
            phoneButton.style.width = messengersWidth + 'px';
        } else {
            phoneButton.style.width = '';
        }
    }
    window.addEventListener('resize', syncPhoneButtonWidth);
    syncPhoneButtonWidth();

    // JS-защита от выделения текста (кроме phone-button)
    document.addEventListener('selectstart', function(e) {
        if (!e.target.closest('.phone-button')) {
            e.preventDefault();
        }
    });
});