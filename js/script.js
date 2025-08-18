document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');

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

// Анимация счетчиков
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('[data-counter]');
  
  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.counter);
      const duration = 2000;
      const startTime = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const value = Math.floor(progress * target);
        
        counter.textContent = value === target ? `${value}+` : value;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      
      requestAnimationFrame(updateCounter);
    });
  };
  
  // Запуск анимации при попадании в viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    observer.observe(heroStats);
  }
});

document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    header.parentElement.classList.toggle('active');
  });
});

document.getElementById('telegramForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Ваши данные
  const botToken = 'ВАШ_ТОКЕН_БОТА';
  const chatId = 'ВАШ_CHAT_ID'; // Узнать через @getmyid_bot
  
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

document.addEventListener('DOMContentLoaded', function() {
  const backdrop = document.querySelector('.hero__backdrop');
  if (!backdrop) return;

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
});

document.addEventListener('DOMContentLoaded', () => {
  const images = [
    'img/services/buy.webp',
    'img/services/mortgage.webp',
    'img/services/invest.webp'
  ];

  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
});
