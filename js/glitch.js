// js/glitch.js
class GlitchEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            intensity: options.intensity || 0.3,
            speed: options.speed || 100,
            iterations: options.iterations || 10,
            ...options
        };
        
        this.originalText = element.innerText;
        this.glitchInterval = null;
    }
    
    start() {
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
        clearInterval(this.glitchInterval);
    }
    
    reset() {
        this.element.innerText = this.originalText;
    }
}

// Aplicar efecto glitch a elementos con clase .glitch
document.querySelectorAll('.glitch').forEach(element => {
    const glitch = new GlitchEffect(element, {
        intensity: 0.2,
        speed: 50,
        iterations: 15
    });
    
    element.addEventListener('mouseenter', () => glitch.start());
    element.addEventListener('mouseleave', () => {
        glitch.stop();
        glitch.reset();
    });
});