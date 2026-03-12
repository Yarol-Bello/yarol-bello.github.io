// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    
    // ===== CURSOR PERSONALIZADO =====
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });
        
        function animateFollower() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursorFollower.style.left = cursorX + 'px';
            cursorFollower.style.top = cursorY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
        
        const interactiveElements = document.querySelectorAll('a, button, .btn, .social-link, .filter-btn, .nav__link, .quick-nav__item');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
        
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        });
    }

    // ===== TEXTO TIPEADO =====
    if (document.querySelector('.typed') && typeof Typed !== 'undefined') {
        new Typed('.typed', {
            strings: [
                'Ingeniería de Sistemas',
                'Desarrollo de Software',
                'Bases de Datos',
                'Inteligencia Artificial',
                '5to Ciclo'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true
        });
    }

    // ===== MENÚ MÓVIL =====
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navList.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navList.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // ===== NAVEGACIÓN ACTIVA =====
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));

    // ===== ANIMACIONES GSAP =====
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.from('.hero__content', {
            duration: 1.5,
            y: 100,
            opacity: 0,
            ease: 'power4.out'
        });
        
        gsap.from('.hero__image', {
            duration: 1.5,
            x: 100,
            opacity: 0,
            ease: 'power4.out',
            delay: 0.3
        });
        
        gsap.utils.toArray('.section').forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 1
            });
        });
        
        gsap.utils.toArray('.skill-item__progress').forEach(bar => {
            gsap.from(bar, {
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                width: 0,
                duration: 1.5,
                ease: 'power2.out'
            });
        });
    }

    // ===== FORMULARIO DE CONTACTO =====
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateForm(contactForm)) {
                showNotification('Por favor, completa todos los campos correctamente', 'error');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>ENVIANDO...</span> <div class="loader"></div>';
            submitBtn.disabled = true;
            
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                showNotification('¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');
                contactForm.reset();
            } catch (error) {
                showNotification('Error al enviar el mensaje. Intenta de nuevo.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ===== FUNCIONES AUXILIARES =====
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff3366';
                isValid = false;
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), 500);
            } else {
                input.style.borderColor = '';
            }
            
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.style.borderColor = '#ff3366';
                    input.classList.add('shake');
                    setTimeout(() => input.classList.remove('shake'), 500);
                    isValid = false;
                }
            }
        });
        return isValid;
    }
    
    function showNotification(message, type = 'success') {
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) oldNotification.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__icon">${type === 'success' ? '✓' : '✗'}</div>
            <div class="notification__message">${message}</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ===== QUICK NAV ACTIVO =====
    const quickNavItems = document.querySelectorAll('.quick-nav__item');
    
    if (quickNavItems.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    current = section.getAttribute('id');
                }
            });

            quickNavItems.forEach(item => {
                item.classList.remove('active');
                const href = item.getAttribute('href').replace('#', '');
                if (href === current) {
                    item.classList.add('active');
                }
            });
        });
    }
});

// ===== CAMBIO DE TEMA =====
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: savedTheme } }));

function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.transform = 'scale(0.9) rotate(-2deg)';
        logo.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => { logo.style.transform = 'scale(1) rotate(0)'; }, 200);
        setTimeout(() => { logo.style.transition = ''; }, 500);
    }
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => { document.body.style.transition = ''; }, 300);
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
}