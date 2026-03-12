// js/glitch.js
/**
 * Efecto Glitch para títulos
 * Versión optimizada con mejor rendimiento
 */
class GlitchEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            intensity: options.intensity || 0.2,
            speed: options.speed || 50,
            iterations: options.iterations || 15,
            ...options
        };
        
        this.originalText = element.innerText;
        this.glitchInterval = null;
        this.isGlitching = false;
    }
    
    start() {
        if (this.isGlitching) return;
        this.isGlitching = true;
        
        let count = 0;
        
        this.glitchInterval = setInterval(() => {
            if (count < this.options.iterations) {
                this.glitch();
                count++;
            } else {
                this.stop();
                this.reset();
            }
        }, this.options.speed);
    }
    
    glitch() {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        let glitchedText = '';
        
        for (let i = 0; i < this.originalText.length; i++) {
            if (Math.random() < this.options.intensity) {
                glitchedText += chars[Math.floor(Math.random() * chars.length)];
            } else {
                glitchedText += this.originalText[i];
            }
        }
        
        this.element.innerText = glitchedText;
    }
    
    stop() {
        if (this.glitchInterval) {
            clearInterval(this.glitchInterval);
            this.glitchInterval = null;
        }
        this.isGlitching = false;
    }
    
    reset() {
        this.element.innerText = this.originalText;
    }
}

// Inicializar efecto glitch cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(element => {
        const glitch = new GlitchEffect(element, {
            intensity: 0.2,
            speed: 50,
            iterations: 15
        });
        
        let timeout;
        
        element.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            glitch.start();
        });
        
        element.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                glitch.stop();
                glitch.reset();
            }, 100);
        });
    });
});