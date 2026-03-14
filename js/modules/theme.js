// theme.js - Versión ultra optimizada con mejoras
(function() {
    'use strict';
    
    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        particleCount: 15,
        particleColors: {
            dark: ['#FFD700', '#FFA500', '#FF6B6B', '#FF4500', '#FF8C00'], // Colores cálidos para modo oscuro
            light: ['#4A5568', '#718096', '#2D3748', '#1A202C', '#CBD5E0'] // Colores fríos para modo claro
        },
        animationDuration: 600,
        logoAnimationDuration: 500,
        particleLifetime: 1000,
        messages: {
            dark: ['🌙 Modo oscuro', '🌟 Buenas noches', '✨ Modo nocturno', '🌜 Hora de brillar', '⭐ Estrellas activadas'],
            light: ['☀️ Modo claro', '🌞 Buenos días', '✨ Modo diurno', '🌟 Hora de brillar', '🌈 Colores vibrantes']
        }
    };

    // ===== VARIABLES DE ESTADO =====
    let isChanging = false;
    let particleStylesInjected = false;

    // ===== FUNCIÓN PRINCIPAL =====
    function initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) {
            console.warn('Theme toggle no encontrado');
            return;
        }

        initializeTheme(themeToggle);
        setupEventListeners(themeToggle);
        showWelcomeMessage();
        observeThemeChanges();
    }

    // ===== INICIALIZAR TEMA =====
    function initializeTheme(themeToggle) {
        const htmlElement = document.documentElement;
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        htmlElement.setAttribute('data-theme', initialTheme);
        
        // Notificar cambio inicial
        dispatchThemeEvent(initialTheme);
        updateAriaLabel(themeToggle, initialTheme);
        updateThemeColors(initialTheme);
    }

    // ===== CONFIGURAR EVENT LISTENERS =====
    function setupEventListeners(themeToggle) {
        // Click en el botón
        themeToggle.addEventListener('click', handleThemeToggleClick);
        
        // Preferencia del sistema (opcional - descomentar si se quiere)
        // window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemPreferenceChange);
    }

    // ===== MANEJADOR DEL CLICK =====
    function handleThemeToggleClick(event) {
        if (isChanging) return; // Prevenir múltiples clics
        
        const themeToggle = event.currentTarget;
        const htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        isChanging = true;
        
        // Animaciones
        themeToggle.classList.add('changing');
        animateLogo();
        
        // Crear partículas
        const colors = CONFIG.particleColors[newTheme];
        createColorParticles(event.clientX, event.clientY, colors);
        
        // Cambiar tema
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Actualizar UI
        updateAriaLabel(themeToggle, newTheme);
        updateThemeColors(newTheme);
        dispatchThemeEvent(newTheme);
        showThemeMessage(newTheme);
        
        // Limpiar animaciones
        setTimeout(() => {
            themeToggle.classList.remove('changing');
            isChanging = false;
        }, CONFIG.animationDuration);
    }

    // ===== MANEJAR CAMBIO DE PREFERENCIA DEL SISTEMA =====
    function handleSystemPreferenceChange(e) {
        // Solo si el usuario no ha establecido una preferencia manual
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            const htmlElement = document.documentElement;
            const currentTheme = htmlElement.getAttribute('data-theme');
            
            if (newTheme !== currentTheme) {
                console.log(`%c💡 Sistema sugiere modo ${newTheme}`, 'color: #888; font-size: 11px;');
                // Opcional: mostrar notificación sutil
            }
        }
    }

    // ===== ANIMAR LOGO =====
    function animateLogo() {
        const logo = document.querySelector('.logo');
        if (!logo) return;
        
        // Guardar transición original
        const originalTransition = logo.style.transition;
        
        logo.style.transform = 'scale(0.9) rotate(-2deg)';
        logo.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => { 
            logo.style.transform = 'scale(1) rotate(0)'; 
        }, 200);
        
        setTimeout(() => { 
            logo.style.transition = originalTransition; 
        }, CONFIG.logoAnimationDuration);
    }

    // ===== CREAR PARTÍCULAS DE COLOR =====
    function createColorParticles(x, y, colors) {
        // Validar coordenadas
        if (typeof x !== 'number' || typeof y !== 'number' || x === 0 || y === 0) {
            x = window.innerWidth / 2;
            y = window.innerHeight / 2;
        }
        
        injectParticleStyles();
        
        // Usar requestAnimationFrame para mejor rendimiento
        requestAnimationFrame(() => {
            for (let i = 0; i < CONFIG.particleCount; i++) {
                createParticle(x, y, i, colors);
            }
        });
    }

    function createParticle(x, y, index, colors) {
        const particle = document.createElement('div');
        particle.className = 'theme-particle';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 6 + Math.random() * 10;
        const angle = (index / CONFIG.particleCount) * Math.PI * 2 + (Math.random() * 0.8);
        const velocity = 70 + Math.random() * 150;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;
        const delay = Math.random() * 0.2;
        const blurAmount = Math.random() * 3;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            filter: blur(${blurAmount}px);
            box-shadow: 0 0 20px ${color};
            animation: particleFly 0.9s ease-out forwards;
            animation-delay: ${delay}s;
            --dx: ${dx}px;
            --dy: ${dy}px;
        `;
        
        document.body.appendChild(particle);
        
        // Limpiar partícula después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, CONFIG.particleLifetime);
    }

    // ===== INYECTAR ESTILOS DE PARTÍCULAS =====
    function injectParticleStyles() {
        if (particleStylesInjected) return;
        
        const style = document.createElement('style');
        style.id = 'theme-particle-styles';
        style.textContent = `
            @keyframes particleFly {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                60% {
                    opacity: 0.8;
                }
                100% {
                    transform: translate(var(--dx), var(--dy)) scale(0);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
        particleStylesInjected = true;
    }

    // ===== ACTUALIZAR ARIA LABEL =====
    function updateAriaLabel(button, theme) {
        if (!button) return;
        
        button.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        button.setAttribute('aria-pressed', theme === 'dark' ? 'false' : 'true');
    }

    // ===== ACTUALIZAR COLORES DEL TEMA EN CSS =====
    function updateThemeColors(theme) {
        // Esta función puede ser útil si necesitas actualizar variables CSS adicionales
        const root = document.documentElement;
        
        if (theme === 'dark') {
            // Puedes ajustar variables específicas aquí si es necesario
        } else {
            // Ajustes para modo claro
        }
    }

    // ===== DISPARAR EVENTO DE CAMBIO =====
    function dispatchThemeEvent(theme) {
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme } 
        }));
    }

    // ===== OBSERVAR CAMBIOS DE TEMA (para otros módulos) =====
    function observeThemeChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const newTheme = mutation.target.getAttribute('data-theme');
                    // Notificar a otros módulos si es necesario
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
    }

    // ===== MOSTRAR MENSAJE EN CONSOLA =====
    function showThemeMessage(theme) {
        const messages = theme === 'dark' ? CONFIG.messages.dark : CONFIG.messages.light;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const color = theme === 'dark' ? '#FFD700' : '#4A5568';
        
        console.log(`%c${randomMessage}`, `color: ${color}; font-size: 14px; font-weight: bold; text-shadow: 0 0 5px ${color};`);
    }

    // ===== MENSAJE DE BIENVENIDA =====
    function showWelcomeMessage() {
        const htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-theme');
        const emoji = currentTheme === 'dark' ? '🌙' : '☀️';
        const color = currentTheme === 'dark' ? '#FFD700' : '#4A5568';
        
        console.log('%c✨ Portfolio de Yarol Bello ✨', `color: ${color}; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px ${color};`);
        console.log(`%c${emoji} Tema ${currentTheme === 'dark' ? 'oscuro' : 'claro'} activado`, 'color: #888; font-size: 12px;');
        console.log('%c💡 Haz clic en el sol/luna para cambiar de tema', 'color: #888; font-size: 11px;');
    }

    // ===== EXPONER FUNCIONES ÚTILES GLOBALMENTE (opcional) =====
    window.ThemeManager = {
        getCurrentTheme: () => document.documentElement.getAttribute('data-theme'),
        toggleTheme: () => {
            const toggle = document.getElementById('theme-toggle');
            if (toggle) toggle.click();
        },
        setTheme: (theme) => {
            if (theme === 'dark' || theme === 'light') {
                const htmlElement = document.documentElement;
                htmlElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                dispatchThemeEvent(theme);
            }
        }
    };

    // ===== INICIALIZACIÓN =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

})();