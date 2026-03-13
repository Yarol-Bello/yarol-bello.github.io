// Animaciones con GSAP y Typed.js
(function() {
    function initTyped() {
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
    }

    function initGSAP() {
        if (typeof gsap === 'undefined') return;

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
                    start: 'top 90%'
                },
                width: 0,
                duration: 1.5,
                ease: 'power2.out'
            });
        });
    }

    function initAllAnimations() {
        initTyped();
        initGSAP();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllAnimations);
    } else {
        initAllAnimations();
    }
})();