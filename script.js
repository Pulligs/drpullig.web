// Dr. Pullig Praxis - JavaScript (Bereinigt & Optimiert)
document.addEventListener('DOMContentLoaded', function() {
    
    // === COOKIE BANNER ===
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    
    // Check if user has already accepted cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.style.display = 'block';
        }, 1000);
    }
    
    // Accept cookies
    if (cookieAccept) {
        cookieAccept.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.animation = 'slideUp 0.3s ease reverse';
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 300);
        });
    }
    
    // === MOBILE MENU ===
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', function() {
            mainNav.classList.toggle('mobile-active');
            mobileToggle.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('mobile-active')) {
                mainNav.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // === SMOOTH SCROLLING ===
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // === FORM HANDLING (FORMSPREE VERSION) ===
const appointmentForm = document.getElementById('appointment-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
        // WICHTIG: Kein e.preventDefault() hier!
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Nur Validierung, aber Formspree darf danach absenden
        if (!data.name || !data.email || !data.doctor) {
            e.preventDefault(); // Nur bei Fehler verhindern
            showNotification('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            e.preventDefault(); // Nur bei Fehler verhindern
            showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
            return;
        }
        
        // Wenn alles OK, zeige kurze Meldung (Formspree leitet dann weiter)
        showNotification('Ihre Anfrage wird gesendet...', 'success');
    });
}

// Success-Message nach Redirect von Formspree
if (window.location.search.includes('success=true')) {
    setTimeout(() => {
        showNotification('Vielen Dank! Ihre Terminanfrage wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.', 'success');
        window.history.replaceState({}, document.title, window.location.pathname);
    }, 500);
}

    // === MODAL FUNCTIONALITY (NUR NOCH KOSTEN-MODAL) ===
    const modals = {
        'cost-info-btn': 'cost-modal'
        // Impressum und Datenschutz sind jetzt separate Seiten
    };

    Object.entries(modals).forEach(([buttonId, modalId]) => {
        const button = document.getElementById(buttonId);
        const modal = document.getElementById(modalId);
        
        if (button && modal) {
            button.addEventListener('click', function() {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                const closeBtn = modal.querySelector('.close');
                if (closeBtn) {
                    closeBtn.focus();
                }
                
                modal.dataset.triggerButton = buttonId;
            });
        }
    });

    // Close modals
    document.querySelectorAll('.modal').forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        const modalCloseBtn = modal.querySelector('.modal-close-btn');
        
        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            
            const triggerButtonId = modal.dataset.triggerButton;
            if (triggerButtonId) {
                const triggerButton = document.getElementById(triggerButtonId);
                if (triggerButton) {
                    triggerButton.focus();
                }
            }
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                    
                    const triggerButtonId = modal.dataset.triggerButton;
                    if (triggerButtonId) {
                        const triggerButton = document.getElementById(triggerButtonId);
                        if (triggerButton) {
                            triggerButton.focus();
                        }
                    }
                }
            });
        }
    });

    // === BACK-TO-TOP BUTTON ===
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        function toggleBackToTopButton() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
        
        let ticking = false;
        function handleScroll() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    toggleBackToTopButton();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        backToTopButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    // === HEADER SCROLL EFFECT ===
    let lastScrollY = 0;
    const header = document.querySelector('.header');
    
    function updateHeaderStyle() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    let headerTicking = false;
    window.addEventListener('scroll', function() {
        if (!headerTicking) {
            requestAnimationFrame(function() {
                updateHeaderStyle();
                headerTicking = false;
            });
            headerTicking = true;
        }
    }, { passive: true });

    // === ANIMATIONS ON SCROLL ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .doctor-card, .info-card, .option');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
        observer.observe(el);
    });

    // === PERFORMANCE OPTIMIZATIONS ===
    
    if (!('loading' in HTMLImageElement.prototype)) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    function preloadCriticalResources() {
        const criticalImages = [
            'logo-dr-pullig.svg',
            'dr-andreas-pullig.jpg',
            'dr-carmen-pullig.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    setTimeout(preloadCriticalResources, 100);

    // === NOTIFICATION SYSTEM ===
    function showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" aria-label="Schließen">&times;</button>
            </div>
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--white);
                    border-radius: var(--border-radius);
                    padding: var(--spacing-md);
                    box-shadow: var(--shadow-lg);
                    z-index: 3000;
                    max-width: 400px;
                    border-left: 4px solid var(--primary-blue);
                    animation: slideInRight 0.3s ease;
                }
                .notification-success {
                    border-left-color: var(--secondary-green);
                }
                .notification-error {
                    border-left-color: #dc3545;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing-sm);
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: var(--medium-gray);
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: var(--transition);
                }
                .notification-close:hover {
                    background: var(--light-gray);
                    color: var(--primary-blue);
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @media (max-width: 768px) {
                    .notification {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                        margin: 0;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        const removeNotification = () => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        };
        
        const timeoutId = setTimeout(removeNotification, 5000);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', function() {
            clearTimeout(timeoutId);
            removeNotification();
        });
        
        closeBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                clearTimeout(timeoutId);
                removeNotification();
            }
        });
    }

    // === ACCESSIBILITY ENHANCEMENTS ===
    
    function addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#hero';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Zum Hauptinhalt springen';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-blue);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10001;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    addSkipLink();

    // === ERROR HANDLING & LOGGING ===
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
    });
    
    // === PERFORMANCE MONITORING ===
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            // LCP not supported
        }
    }

    // === INITIALIZATION COMPLETE ===
    console.log('Dr. Pullig Praxis website initialized successfully');
    
    document.body.classList.add('loaded');
    
    document.dispatchEvent(new CustomEvent('websiteInitialized', {
        detail: { timestamp: Date.now() }
    }));
});