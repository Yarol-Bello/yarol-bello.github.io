// js/modules/formHandler.js
(function() {
    function initFormHandler() {
        const contactForm = document.getElementById('contact-form');
        
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            // Validar campos
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ff3366';
                    input.classList.add('shake');
                    setTimeout(() => input.classList.remove('shake'), 500);
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                // Mostrar mensaje de error
                const errorMsg = document.createElement('div');
                errorMsg.className = 'notification notification--error';
                errorMsg.textContent = 'Por favor, completa todos los campos';
                document.body.appendChild(errorMsg);
                setTimeout(() => errorMsg.remove(), 3000);
                return;
            }
            
            // Cambiar el botón
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span>ENVIANDO...</span> <div class="loader"></div>';
            submitBtn.disabled = true;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormHandler);
    } else {
        initFormHandler();
    }
})();