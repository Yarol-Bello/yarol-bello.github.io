// Funciones auxiliares reutilizables
const Utils = {
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    showNotification: function(message, type = 'success') {
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
    },

    validateForm: function(form) {
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
                if (!this.validateEmail(input.value)) {
                    input.style.borderColor = '#ff3366';
                    input.classList.add('shake');
                    setTimeout(() => input.classList.remove('shake'), 500);
                    isValid = false;
                }
            }
        });
        
        return isValid;
    },

    debounce: function(func, wait = 100) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
};

window.Utils = Utils;