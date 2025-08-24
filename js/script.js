
document.addEventListener('DOMContentLoaded', () => {
  // Оптимизация загрузки всех изображений на странице
  function optimizeImages() {
    // Получаем все изображения на странице
    const images = document.querySelectorAll('img:not([loading])');
    
    // Настраиваем IntersectionObserver для ленивой загрузки
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Устанавливаем атрибуты для оптимизации
          if (!img.hasAttribute('loading')) {
            img.loading = 'lazy';
          }
          if (!img.hasAttribute('decoding')) {
            img.decoding = 'async';
          }
          
          // Отключаем наблюдение после оптимизации
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    
    // Наблюдаем за всеми изображениями
    images.forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Вызываем функцию оптимизации изображений
  optimizeImages();
    const nav = document.querySelector('.nav');
    if (window.innerWidth <= 768 && nav) {
        nav.style.display = 'none';
    }

    const hero = document.querySelector('.hero');
    
    if (hero) {
        function updateHero() {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;
            
            const progress = Math.min(scrollY / heroHeight, 1);
            hero.style.opacity = 1 - progress;
        }

        hero.style.transition = 'opacity 0.3s ease-out';
        updateHero();

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateHero);
        });
    }

    function scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Функция для закрытия мобильного меню и сброса бургера
    function closeMobileMenu() {
        const nav = document.querySelector('.nav');
        const burger = document.querySelector('.mobile-menu-btn');
        
        if (nav && nav.classList.contains('open')) {
            nav.classList.remove('open');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            
            // Небольшая задержка перед скрытием элемента для плавности анимации
            setTimeout(() => {
                if (window.innerWidth <= 768) {
                    nav.style.display = 'none';
                }
            }, 700);
        }
    }

    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            
            scrollToSection(sectionId);
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            closeMobileMenu();
        });
    });

    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    const burger = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav');

    if (burger && navMenu) {
        burger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (navMenu.classList.contains('open')) {
                // Закрываем меню
                navMenu.classList.remove('open');
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                
                setTimeout(() => {
                    if (window.innerWidth <= 768) {
                        navMenu.style.display = 'none';
                    }
                }, 700);
            } else {
                // Открываем меню
                navMenu.style.display = 'flex';
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                
                // Небольшая задержка для применения анимации
                setTimeout(() => {
                    navMenu.classList.add('open');
                }, 10);
            }
        });

        // Закрытие меню по клику на ссылку внутри него
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => closeMobileMenu());
        });

        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('open') && 
                !navMenu.contains(e.target) && 
                !burger.contains(e.target)) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });

        // Close menu on resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
                // Возвращаем navbar в исходное состояние для десктопа
                navMenu.style.display = '';
                navMenu.classList.remove('open');
                burger.classList.remove('active');
            } else if (!navMenu.classList.contains('open')) {
                // Если на мобилке меню закрыто, убедимся, что оно скрыто правильно
                navMenu.style.display = 'none';
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

    // JS-защита от выделения текста только для элементов с классом .no-select
    document.addEventListener('selectstart', function(e) {
        if (e.target.closest('.no-select')) {
            e.preventDefault();
        }
    });

    // Аккордеон
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const isActive = accordionItem.classList.contains('active');
        
        // Закрываем все остальные элементы
        document.querySelectorAll('.accordion-item').forEach(item => {
          if (item !== accordionItem) {
            item.classList.remove('active');
          }
        });
        
        // Переключаем текущий элемент
        accordionItem.classList.toggle('active');
      });
    });

    // Форма Telegram с оптимизацией запросов и кэширования
    const telegramForm = document.getElementById('telegramForm');
    if (telegramForm) {
      // Валидация номера телефона
      const phoneInput = telegramForm.querySelector('input[name="phone"]');
      const phoneError = telegramForm.querySelector('.phone-error');
      
      // Кэшируем результаты валидации для предотвращения повторных вычислений
      const validationCache = new Map();
      
      if (phoneInput && phoneError) {
        // Функция для форматирования номера телефона с мемоизацией
        const formatPhoneNumberCache = new Map();
        function formatPhoneNumber(value) {
          // Проверяем кэш перед вычислением
          if (formatPhoneNumberCache.has(value)) {
            return formatPhoneNumberCache.get(value);
          }
          
          let numbers = value.replace(/\D/g, '');
          if (numbers.startsWith('8') && numbers.length === 11) {
            numbers = '7' + numbers.substring(1);
          }
          if (numbers.startsWith('7') && numbers.length === 11) {
            numbers = '+' + numbers;
          }
          // Форматируем номер в виде +7(999)123-45-67
          let formatted;
          if (numbers.startsWith('+7')) {
            formatted = '+7';
            if (numbers.length > 2) {
              formatted += '(' + numbers.substring(2, 5);
            }
            if (numbers.length > 5) {
              formatted += ')' + numbers.substring(5, 8);
            }
            if (numbers.length > 8) {
              formatted += '-' + numbers.substring(8, 10);
            }
            if (numbers.length > 10) {
              formatted += '-' + numbers.substring(10, 12);
            }
          } else if (numbers.startsWith('7')) {
            formatted = '+7';
            if (numbers.length > 1) {
              formatted += '(' + numbers.substring(1, 4);
            }
            if (numbers.length > 4) {
              formatted += ')' + numbers.substring(4, 7);
            }
            if (numbers.length > 7) {
              formatted += '-' + numbers.substring(7, 9);
            }
            if (numbers.length > 9) {
              formatted += '-' + numbers.substring(9, 11);
            }
          } else {
            formatted = numbers;
          }
          
          // Сохраняем результат в кэше
          formatPhoneNumberCache.set(value, formatted);
          // Ограничиваем размер кэша
          if (formatPhoneNumberCache.size > 100) {
            const firstKey = formatPhoneNumberCache.keys().next().value;
            formatPhoneNumberCache.delete(firstKey);
          }
          
          return formatted;
        }
        
        // Функция для валидации номера с кэшированием
        function validatePhone(value) {
          // Проверяем кэш перед вычислением
          if (validationCache.has(value)) {
            return validationCache.get(value);
          }
          
          // Убираем все кроме цифр для проверки
          const numbers = value.replace(/\D/g, '');
          
          // Проверяем длину и формат
          let isValid = false;
          if (numbers.length === 11 && (numbers.startsWith('7') || numbers.startsWith('8'))) {
            isValid = true;
          } else if (numbers.length === 10 && numbers.startsWith('9')) {
            isValid = true;
          }
          
          // Сохраняем результат в кэше
          validationCache.set(value, isValid);
          // Ограничиваем размер кэша
          if (validationCache.size > 100) {
            const firstKey = validationCache.keys().next().value;
            validationCache.delete(firstKey);
          }
          
          return isValid;
        }
        
        // Оптимизированный обработчик ввода с debounce
        let inputTimer;
        phoneInput.addEventListener('input', function(e) {
          clearTimeout(inputTimer);
          
          inputTimer = setTimeout(() => {
            let value = e.target.value;
            
            // Форматируем номер
            const formatted = formatPhoneNumber(value);
            e.target.value = formatted;
            
            // Валидируем
            const isValid = validatePhone(formatted);
            
            if (isValid) {
              phoneError.style.display = 'none';
              phoneInput.style.borderColor = '#27ae60';
              phoneInput.style.boxShadow = '0 0 0 2px rgba(39, 174, 96, 0.2)';
            } else {
              phoneInput.style.borderColor = '#e74c3c';
              phoneInput.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
            }
          }, 100); // Небольшая задержка для оптимизации производительности
        });
        
        // Обработчик потери фокуса
        phoneInput.addEventListener('blur', function() {
          const value = this.value;
          const isValid = validatePhone(value);
          
          if (!isValid && value.length > 0) {
            phoneError.style.display = 'block';
            phoneInput.style.borderColor = '#e74c3c';
            phoneInput.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
          }
        });
        
        // Обработчик получения фокуса
        phoneInput.addEventListener('focus', function() {
          phoneError.style.display = 'none';
          this.style.borderColor = '';
          this.style.boxShadow = '';
        });
      }

      // Предотвращение множественных отправок
      let isSubmitting = false;
      telegramForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Предотвращаем повторную отправку
        if (isSubmitting) return;
        isSubmitting = true;
        
        // Проверяем валидность номера перед отправкой
        const phoneValue = phoneInput.value;
        const isPhoneValid = validatePhone(phoneValue);
        
        if (!isPhoneValid) {
          phoneError.style.display = 'block';
          phoneInput.style.borderColor = '#e74c3c';
          phoneInput.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
          phoneInput.focus();
          isSubmitting = false;
          return;
        }
        
        // Ваши данные (Внимание: хранить токен и chatId на фронте небезопасно!)
        const botToken = '8068709438:AAFcvRxBQS48WTcdWTX8yJ3yhMZDMpmqXNY';
        const chatId = '1924942515'; // Узнать через @getmyid_bot
        
        // Кэшируем данные формы для предотвращения повторного сбора при ошибках
        const formData = new FormData(this);
        const formDataCache = {};
        for (const [key, value] of formData.entries()) {
          formDataCache[key] = value;
        }
        
        // Формируем сообщение
        const text = `📌 Новая заявка:\n\n👤 Имя: ${formDataCache.name}\n📞 Телефон: ${formDataCache.phone}\n🔧 Услуга: ${formDataCache.service}\n📝 Комментарий: ${formDataCache.comment || '—'}`;
        
        // Отправляем в Telegram с оптимизацией запроса
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Таймаут 10 секунд
        
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache' // Предотвращаем кэширование запроса
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
          }),
          signal: controller.signal
        })
        .then(() => {
          clearTimeout(timeoutId);
          // Показываем сообщение об успехе
          document.getElementById('telegramForm').style.display = 'none';
          document.getElementById('formSuccess').style.display = 'block';
          
          // Очищаем форму
          this.reset();
          
          // Очищаем кэш валидации
          validationCache.clear();
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          console.error('Ошибка отправки:', error);
          alert('Ошибка отправки. Позвоните нам напрямую.');
        })
        .finally(() => {
          isSubmitting = false;
        });
      });
    }

    // Hero backdrop с оптимизацией производительности
    const backdrop = document.querySelector('.hero__backdrop');
    if (backdrop) {
      const gradientDesktop = 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)';
      const gradientMobile  = 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)';
      let lastWidth = window.innerWidth;
      let resizeTimer;

      function updateBackground() {
        const isMobile = window.innerWidth <= 768;
        const bgUrl = isMobile ? backdrop.getAttribute('data-mobile-bg') : backdrop.getAttribute('data-desktop-bg');
        const gradient = isMobile ? gradientMobile : gradientDesktop;

        // Если фон уже такой же, ничего не делаем
        if (backdrop.style.backgroundImage.includes(bgUrl)) return;

        // Используем кэшированные изображения, если они уже загружены браузером
        const img = new Image();
        
        // Добавляем атрибут loading="lazy" для ленивой загрузки
        img.loading = 'lazy';
        img.decoding = 'async'; // Добавляем асинхронное декодирование
        img.fetchPriority = 'high'; // Высокий приоритет для фоновых изображений
        img.src = bgUrl;
        
        // Если изображение уже в кэше, оно загрузится мгновенно
        if (img.complete) {
          backdrop.style.backgroundImage = `${gradient}, url('${bgUrl}')`;
          backdrop.classList.add('loaded');
        } else {
          img.onload = function() {
            backdrop.style.backgroundImage = `${gradient}, url('${bgUrl}')`;
            backdrop.classList.add('loaded');
          };
        }
      }

      // Инициализация при загрузке с использованием IntersectionObserver для ленивой загрузки
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          updateBackground();
          observer.disconnect();
        }
      }, { rootMargin: '300px', threshold: 0.1 }); // Увеличиваем отступ и добавляем порог видимости
      
      observer.observe(backdrop);

      // Оптимизированный обработчик изменения размера окна с debounce
      window.addEventListener('resize', function() {
        // Проверяем, действительно ли изменилась ширина (чтобы избежать срабатывания на изменение высоты)
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          
          // Используем debounce для предотвращения множественных вызовов
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(updateBackground, 150);
        }
      });
    }

    // Фотогалерея с оптимизацией производительности
    const gallerySlider = document.querySelector('.gallery-track');
    const galleryDots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.querySelector('.gallery-nav--prev');
    const nextBtn = document.querySelector('.gallery-nav--next');
    
    if (gallerySlider && galleryDots.length > 0) {
      let currentSlide = 0;
      const totalSlides = galleryDots.length;
      let autoSlideInterval;
      let isVisible = false;
      
      // Оптимизированная функция перехода к слайду с использованием requestAnimationFrame
      function goToSlide(slideIndex) {
        if (slideIndex < 0) slideIndex = totalSlides - 1;
        if (slideIndex >= totalSlides) slideIndex = 0;
        
        currentSlide = slideIndex;
        
        // Используем requestAnimationFrame для плавной анимации
        requestAnimationFrame(() => {
          const translateX = -currentSlide * 100;
          gallerySlider.style.transform = `translateX(${translateX}%)`;
          
          // Обновляем активную точку
          galleryDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
          });
          
          // Предзагрузка следующего изображения для плавного перехода
          const nextIndex = (currentSlide + 1) % totalSlides;
          const nextSlide = gallerySlider.children[nextIndex];
          if (nextSlide) {
            const nextImg = nextSlide.querySelector('img');
            if (nextImg && !nextImg.dataset.loaded) {
              nextImg.dataset.loaded = 'true';
            }
          }
        });
      }
      
      // Оптимизированные обработчики для кнопок с предотвращением множественных кликов
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          clearInterval(autoSlideInterval);
          goToSlide(currentSlide - 1);
          resetAutoSlide();
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          clearInterval(autoSlideInterval);
          goToSlide(currentSlide + 1);
          resetAutoSlide();
        });
      }
      
      // Обработчики для точек с предотвращением множественных кликов
      galleryDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          if (currentSlide !== index) {
            clearInterval(autoSlideInterval);
            goToSlide(index);
            resetAutoSlide();
          }
        });
      });
      
      // Функция для сброса автопрокрутки
      function resetAutoSlide() {
        if (!isVisible) return;
        
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
          goToSlide(currentSlide + 1);
        }, 5000);
      }
      
      // Используем Intersection Observer для определения видимости галереи
      // и запуска автопрокрутки только когда галерея видна
      const galleryContainer = document.querySelector('.gallery-container');
      if (galleryContainer) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            
            if (isVisible) {
              resetAutoSlide();
              // Предзагрузка всех изображений при появлении в области видимости
              Array.from(gallerySlider.children).forEach((slide, index) => {
                const img = slide.querySelector('img');
                if (img && !img.dataset.loaded) {
                  img.dataset.loaded = 'true';
                }
              });
            } else {
              clearInterval(autoSlideInterval);
            }
          });
        }, { threshold: 0.25 });
        
        observer.observe(galleryContainer);
        
        // Останавливаем автопрокрутку при взаимодействии пользователя
        galleryContainer.addEventListener('mouseenter', () => {
          clearInterval(autoSlideInterval);
        });
        
        galleryContainer.addEventListener('mouseleave', () => {
          if (isVisible) {
            resetAutoSlide();
          }
        });
      }

      // Оптимизированный свайп на мобильных устройствах с пассивными слушателями
      let startX = 0;
      let endX = 0;
      let isSwiping = false;
      
      gallerySlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        clearInterval(autoSlideInterval);
      }, { passive: true });
      
      gallerySlider.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        // Предотвращаем прокрутку страницы при свайпе галереи
        e.preventDefault();
      }, { passive: false });
      
      gallerySlider.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Минимальное расстояние для свайпа
          if (diff > 0) {
            goToSlide(currentSlide + 1); // Свайп влево
          } else {
            goToSlide(currentSlide - 1); // Свайп вправо
          }
        }
        
        isSwiping = false;
        resetAutoSlide();
      }, { passive: true });

      // Инициализация первого слайда
      goToSlide(0);
    }
  }
});
