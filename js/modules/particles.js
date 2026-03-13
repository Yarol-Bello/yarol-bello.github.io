// Partículas de fondo
(function() {
    function initParticles() {
        if (typeof particlesJS === 'undefined' || !document.getElementById('particles-js')) return;
        
        const htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
        
        const particleColor = currentTheme === 'dark' ? '#00F0FF' : '#0066FF';
        const lineColor = currentTheme === 'dark' ? '#00F0FF' : '#0044CC';
        const opacity = currentTheme === 'dark' ? 0.2 : 0.3;
        const lineOpacity = currentTheme === 'dark' ? 0.1 : 0.2;
        const size = currentTheme === 'dark' ? 2 : 3;
        
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: particleColor },
                shape: { type: 'circle' },
                opacity: {
                    value: opacity,
                    random: true,
                    anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false }
                },
                size: { value: size, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: lineColor,
                    opacity: lineOpacity,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out'
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' }
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.5 } },
                    push: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }

    function updateParticlesTheme(theme) {
        if (typeof pJSDom !== 'undefined' && pJSDom[0]) {
            const container = document.getElementById('particles-js');
            if (container) {
                container.innerHTML = '';
                pJSDom = [];
            }
            initParticles();
        }
    }

    document.addEventListener('themeChanged', (e) => {
        updateParticlesTheme(e.detail.theme);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }
})();