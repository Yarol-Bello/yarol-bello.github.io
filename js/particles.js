// js/particles.js
particlesJS('particles-js', {
    particles: {
        number: {
            value: 60, // Reducido para no distraer tanto
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#00F0FF'
        },
        shape: {
            type: 'circle',
        },
        opacity: {
            value: 0.3, // Más sutil
            random: true,
            anim: {
                enable: true,
                speed: 0.5,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 2, // Más pequeño
            random: true,
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#00F0FF',
            opacity: 0.1, // Más sutil
            width: 1
        },
        move: {
            enable: true,
            speed: 1, // Más lento
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 0.3
                }
            },
            push: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});