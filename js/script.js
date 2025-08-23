
document.addEventListener('DOMContentLoaded', () => {
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

    // Форма Telegram
    const telegramForm = document.getElementById('telegramForm');
    if (telegramForm) {
      // Валидация номера телефона
      const phoneInput = telegramForm.querySelector('input[name="phone"]');
      const phoneError = telegramForm.querySelector('.phone-error');
      
      if (phoneInput && phoneError) {
        // Функция для форматирования номера телефона
        function formatPhoneNumber(value) {
          let numbers = value.replace(/\D/g, '');
          if (numbers.startsWith('8') && numbers.length === 11) {
            numbers = '7' + numbers.substring(1);
          }
          if (numbers.startsWith('7') && numbers.length === 11) {
            numbers = '+' + numbers;
          }
          // Форматируем номер в виде +7(999)123-45-67
          if (numbers.startsWith('+7')) {
            let formatted = '+7';
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
            return formatted;
          }
          if (numbers.startsWith('7')) {
            let formatted = '+7';
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
            return formatted;
          }
          return numbers;
        }
        
        // Функция для валидации номера
        function validatePhone(value) {
          // Убираем все кроме цифр для проверки
          const numbers = value.replace(/\D/g, '');
          
          // Проверяем длину и формат
          if (numbers.length === 11 && (numbers.startsWith('7') || numbers.startsWith('8'))) {
            return true;
          }
          if (numbers.length === 10 && numbers.startsWith('9')) {
            return true;
          }
          
          return false;
        }
        
        // Обработчик ввода
        phoneInput.addEventListener('input', function(e) {
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

      telegramForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверяем валидность номера перед отправкой
        const phoneValue = phoneInput.value;
        const isPhoneValid = validatePhone(phoneValue);
        
        if (!isPhoneValid) {
          phoneError.style.display = 'block';
          phoneInput.style.borderColor = '#e74c3c';
          phoneInput.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
          phoneInput.focus();
          return;
        }
        
        // Ваши данные (Внимание: хранить токен и chatId на фронте небезопасно!)
        const botToken = '8068709438:AAFcvRxBQS48WTcdWTX8yJ3yhMZDMpmqXNY';
        const chatId = '1924942515'; // Узнать через @getmyid_bot
        
        // Формируем сообщение
        const formData = new FormData(this);
        const text = `📌 Новая заявка:\n\n👤 Имя: ${formData.get('name')}\n📞 Телефон: ${formData.get('phone')}\n🔧 Услуга: ${formData.get('service')}\n📝 Комментарий: ${formData.get('comment') || '—'}`;
        
        // Отправляем в Telegram
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
          })
        })
        .then(() => {
          // Показываем сообщение об успехе
          document.getElementById('telegramForm').style.display = 'none';
          document.getElementById('formSuccess').style.display = 'block';
          
          // Очищаем форму (опционально)
          this.reset();
        })
        .catch(() => alert('Ошибка отправки. Позвоните нам напрямую.'));
      });
    }

    // Hero backdrop
    const backdrop = document.querySelector('.hero__backdrop');
    if (backdrop) {
      const gradientDesktop = 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)';
      const gradientMobile  = 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)';

      function updateBackground() {
        const isMobile = window.innerWidth <= 768;
        const bgUrl = isMobile ? backdrop.getAttribute('data-mobile-bg') : backdrop.getAttribute('data-desktop-bg');
        const gradient = isMobile ? gradientMobile : gradientDesktop;

        // Если фон уже такой же, ничего не делаем
        if (backdrop.style.backgroundImage.includes(bgUrl)) return;

        const img = new Image();
        img.src = bgUrl;
        img.onload = function() {
          backdrop.style.backgroundImage = `${gradient}, url('${bgUrl}')`;
          backdrop.classList.add('loaded');
        };
      }

      updateBackground();

      window.addEventListener('resize', function() {
        updateBackground();
      });
    }

    // Фотогалерея
    const gallerySlider = document.querySelector('.gallery-track');
    const galleryDots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.querySelector('.gallery-nav--prev');
    const nextBtn = document.querySelector('.gallery-nav--next');
    
    if (gallerySlider && galleryDots.length > 0) {
      let currentSlide = 0;
      const totalSlides = galleryDots.length;
      
      function goToSlide(slideIndex) {
        if (slideIndex < 0) slideIndex = totalSlides - 1;
        if (slideIndex >= totalSlides) slideIndex = 0;
        
        currentSlide = slideIndex;
        const translateX = -currentSlide * 100;
        gallerySlider.style.transform = `translateX(${translateX}%)`;
        
        // Обновляем активную точку
        galleryDots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentSlide);
        });
      }
      
      // Обработчики для кнопок
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          goToSlide(currentSlide - 1);
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          goToSlide(currentSlide + 1);
        });
      }
      
      // Обработчики для точек
      galleryDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          goToSlide(index);
        });
      });
      
      // Автопрокрутка
      let autoSlideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 5000);

      // Останавливаем автопрокрутку при взаимодействии
      const galleryContainer = document.querySelector('.gallery-container');
      if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', () => {
          clearInterval(autoSlideInterval);
        });
        galleryContainer.addEventListener('mouseleave', () => {
          autoSlideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
          }, 5000);
        });
      }

      // Очистка интервала при уходе со страницы
      window.addEventListener('beforeunload', () => {
        clearInterval(autoSlideInterval);
      });

      // Свайп на мобильных устройствах
      let startX = 0;
      let endX = 0;
      gallerySlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      });
      gallerySlider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) { // Минимальное расстояние для свайпа
          if (diff > 0) {
            goToSlide(currentSlide + 1); // Свайп влево
          } else {
            goToSlide(currentSlide - 1); // Свайп вправо
          }
        }
      });

      // Инициализация
      goToSlide(0);
    }
});
