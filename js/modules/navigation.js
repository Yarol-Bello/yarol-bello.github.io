// navigation.js - VERSIÓN CORREGIDA CON QUICK-NAV FUNCIONAL
(function() {
    'use strict';
    
    function initNavigation() {
        // Elementos del DOM
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav__list');
        const navLinks = document.querySelectorAll('.nav__link');
        const quickNavItems = document.querySelectorAll('.quick-nav__item');
        const sections = document.querySelectorAll('section[id]');
        
        // ===== MENÚ MÓVIL =====
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

        // ===== DETECCIÓN DE SECCIÓN ACTIVA (CORREGIDA) =====
        function updateActiveSection() {
            const scrollPosition = window.scrollY + 150; // Offset para mejor detección
            
            // Encontrar la sección actual
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            // Si no encuentra ninguna sección, usar la primera
            if (currentSection === '' && sections.length > 0) {
                currentSection = sections[0].getAttribute('id');
            }
            
            // Actualizar clases en navLinks
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href').replace('#', '');
                if (href === currentSection) {
                    link.classList.add('active');
                }
            });
            
            // ACTUALIZAR QUICK-NAV (esto es lo que faltaba)
            quickNavItems.forEach(item => {
                item.classList.remove('active');
                const href = item.getAttribute('href').replace('#', '');
                if (href === currentSection) {
                    item.classList.add('active');
                }
            });
        }
        
        // Llamar al inicio y en cada scroll
        updateActiveSection(); // Una vez al cargar
        
        // Usar requestAnimationFrame para optimizar
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Actualizar también en resize (por si cambian las alturas)
        window.addEventListener('resize', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===== QUICK NAV - Comportamiento al hacer scroll (Opción 3) =====
    function initQuickNavBehavior() {
        const quickNav = document.querySelector('.quick-nav--lateral');
        if (!quickNav) return;
        
        // Variables de estado
        let lastScrollTop = 0;
        let ticking = false;
        let isVisible = true;
        
        // Constantes de configuración
        const HIDE_OFFSET = 300; // Punto donde comienza a ocultarse
        const SHOW_OFFSET = 200; // Punto cerca del top donde siempre es visible
        
        // Aplicar estilos iniciales
        quickNav.classList.add('quick-nav--initialized');
        quickNav.classList.add('nav-visible');
        
        function updateNavVisibility() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollingDown = scrollTop > lastScrollTop;
            
            // Determinar visibilidad basado en dirección y posición
            if (scrollTop < SHOW_OFFSET) {
                // Cerca del top - siempre visible
                if (!isVisible) showNav();
            } else if (scrollingDown && scrollTop > HIDE_OFFSET) {
                // Scrolleando hacia ABAJO - ocultar (solo si no está en hover)
                if (isVisible && !quickNav.matches(':hover')) {
                    hideNav();
                }
            } else {
                // Scrolleando hacia ARRIBA - mostrar
                if (!isVisible) showNav();
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }
        
        function showNav() {
            quickNav.classList.remove('nav-hidden');
            quickNav.classList.add('nav-visible');
            isVisible = true;
        }
        
        function hideNav() {
            quickNav.classList.add('nav-hidden');
            quickNav.classList.remove('nav-visible');
            isVisible = false;
        }
        
        // Event listeners optimizados
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateNavVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Mostrar al hacer hover siempre
        quickNav.addEventListener('mouseenter', () => {
            if (!isVisible) showNav();
        });
        
        // Ejecutar una vez al inicio
        updateNavVisibility();
    }

    // ===== INICIALIZACIÓN =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initNavigation();
            initQuickNavBehavior();
        });
    } else {
        initNavigation();
        initQuickNavBehavior();
    }
})();