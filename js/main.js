// js/main.js - VERSIÓN FINAL OPTIMIZADA

document.addEventListener('DOMContentLoaded', () => {
    
    // ===== 1. CURSOR PERSONALIZADO MEJORADO =====
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Movimiento inmediato del cursor principal
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });
        
        // Animación suave para el seguidor (requestAnimationFrame para mejor performance)
        function animateFollower() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursorFollower.style.left = cursorX + 'px';
            cursorFollower.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
        
        // Efecto cuando el cursor está sobre elementos interactivos
        const interactiveElements = document.querySelectorAll('a, button, .btn, .social-link, .project-card, .filter-btn, .nav__link');
        
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
        
        // Ocultar cursor cuando sale de la ventana
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        });
    }

    // ===== 2. TEXTO TIPEADO =====
    if (document.querySelector('.typed')) {
        const typed = new Typed('.typed', {
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
            loop: true,
            smartBackspace: true
        });
    }

    // ===== 3. MENÚ MÓVIL =====
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

    // ===== 4. NAVEGACIÓN ACTIVA CON INTERSECTION OBSERVER (más eficiente) =====
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

    // ===== 5. ANIMACIONES CON GSAP =====
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animación de entrada para el hero
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
        
        // Animaciones al hacer scroll
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
        
        // Animación para las barras de habilidades
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

    // ===== 6. FILTRO DE PROYECTOS =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Actualizar botón activo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category.includes(filter)) {
                        if (typeof gsap !== 'undefined') {
                            gsap.to(card, {
                                duration: 0.5,
                                opacity: 1,
                                scale: 1,
                                display: 'block',
                                ease: 'power2.out'
                            });
                        } else {
                            card.style.display = 'block';
                            card.style.opacity = '1';
                        }
                    } else {
                        if (typeof gsap !== 'undefined') {
                            gsap.to(card, {
                                duration: 0.5,
                                opacity: 0,
                                scale: 0.8,
                                display: 'none',
                                ease: 'power2.in'
                            });
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // ===== 7. ANIMACIÓN DEL LOGO CON DOS VERSIONES =====
    const logo = document.querySelector('.logo');
    const logoDark = document.querySelector('.logo__img--dark');
    const logoLight = document.querySelector('.logo__img--light');
    
    if (logo) {
        // Pequeña animación al cargar
        setTimeout(() => {
            logo.style.opacity = '1';
        }, 100);
    }

    // ===== 8. FORMULARIO DE CONTACTO =====
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validar formulario
            if (!validateForm(contactForm)) {
                showNotification('Por favor, completa todos los campos correctamente', 'error');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Mostrar loading
            submitBtn.innerHTML = '<span>ENVIANDO...</span> <div class="loader"></div>';
            submitBtn.disabled = true;
            
            try {
                // Simulación de envío (reemplazar con tu servicio real)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                showNotification('¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');
                contactForm.reset();
                
            } catch (error) {
                showNotification('Error al enviar el mensaje. Intenta de nuevo.', 'error');
                console.error('Error:', error);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ===== FUNCIONES AUXILIARES =====
    
    // Validación de formulario
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff3366';
                isValid = false;
                
                // Agregar efecto de shake
                input.classList.add('shake');
                setTimeout(() => {
                    input.classList.remove('shake');
                }, 500);
            } else {
                input.style.borderColor = '';
            }
            
            // Validar email
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.style.borderColor = '#ff3366';
                    input.classList.add('shake');
                    setTimeout(() => {
                        input.classList.remove('shake');
                    }, 500);
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    // Mostrar notificaciones
    function showNotification(message, type = 'success') {
        // Eliminar notificaciones anteriores
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
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});

// ===== 9. CAMBIO DE TEMA CON ANIMACIÓN DE LOGO MEJORADA =====
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Verificar si hay un tema guardado en localStorage
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);

// Función para cambiar el tema con animación mejorada
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Animación del logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.transform = 'scale(0.9) rotate(-2deg)';
        logo.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            logo.style.transform = 'scale(1) rotate(0)';
        }, 200);
        
        setTimeout(() => {
            logo.style.transition = '';
        }, 500);
    }
    
    // Cambiar el tema
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Animación del body
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Event listener para el botón de tema
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// ===== 10. DETECTAR PREFERENCIA DEL SISTEMA (OPCIONAL) =====
// Si no hay tema guardado, usar la preferencia del sistema
if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
}

// Escuchar cambios en la preferencia del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Solo aplicar si el usuario no ha establecido una preferencia manual
    if (!localStorage.getItem('theme')) {
        htmlElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

// ===== 11. PREVENIR PARPADEO INICIAL =====
// Ocultar el body hasta que el tema esté listo (evita flash de color incorrecto)
document.body.style.visibility = 'visible';

// ===== QUICK NAV ACTIVO (OPCIONAL) =====
const quickNavItems = document.querySelectorAll('.quick-nav__item');

if (quickNavItems.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        quickNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}