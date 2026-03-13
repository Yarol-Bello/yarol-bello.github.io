// js/modules/formHandler.js - Versión con envío AJAX
(function() {
    function initFormHandler() {
        const contactForm = document.getElementById('contact-form');
        
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // ❌ NO recargar la página
            
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
                showMessage('Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Cambiar botón a "ENVIANDO..."
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>ENVIANDO...</span> <div class="loader"></div>';
            submitBtn.disabled = true;
            
            try {
                // Recoger datos del formulario
                const formData = new FormData(contactForm);
                
                // Enviar a FormSubmit usando fetch (AJAX)
                const response = await fetch('https://formsubmit.co/ajax/yarolbellocoquil@gmail.com', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // ✅ Mostrar mensaje de éxito
                    showSuccessMessage();
                    // Limpiar formulario
                    contactForm.reset();
                } else {
                    throw new Error('Error al enviar');
                }
                
            } catch (error) {
                console.error('Error:', error);
                showMessage('Error al enviar el mensaje. Intenta de nuevo.', 'error');
            } finally {
                // Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Función para mostrar mensaje flotante (como notificación)
    function showMessage(text, type = 'success') {
        // Eliminar mensaje anterior si existe
        const oldMessage = document.querySelector('.form-message');
        if (oldMessage) oldMessage.remove();
        
        const message = document.createElement('div');
        message.className = `form-message form-message--${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--accent)' : '#ff3366'};
            color: ${type === 'success' ? 'var(--bg-primary)' : 'white'};
            border-radius: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
    
    // Función para mostrar mensaje de éxito EN EL MISMO LUGAR del formulario
    function showSuccessMessage() {
        const contactForm = document.getElementById('contact-form');
        const formContainer = contactForm.parentElement;
        
        // Crear mensaje de éxito
        const successHTML = `
            <div class="success-message" style="
                text-align: center;
                padding: 3rem 2rem;
                background: var(--bg-secondary);
                border-radius: 20px;
                border: 2px solid var(--accent);
                animation: fadeIn 0.5s ease;
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                ">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--bg-primary)">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                </div>
                <h3 style="
                    font-size: 1.8rem;
                    font-family: var(--font-display);
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, var(--text-primary), var(--accent));
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                ">¡Mensaje Enviado!</h3>
                <p style="
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                ">Gracias por contactarme. Te responderé pronto.</p>
                <button onclick="resetForm()" class="btn btn--primary" style="margin: 0 auto;">
                    ENVIAR OTRO MENSAJE
                </button>
            </div>
        `;
        
        // Ocultar formulario y mostrar mensaje
        contactForm.style.display = 'none';
        formContainer.insertAdjacentHTML('beforeend', successHTML);
    }
    
    // Función para resetear el formulario (se llama desde el botón)
    window.resetForm = function() {
        const contactForm = document.getElementById('contact-form');
        const formContainer = contactForm.parentElement;
        const successMsg = formContainer.querySelector('.success-message');
        
        if (successMsg) successMsg.remove();
        contactForm.style.display = 'block';
        contactForm.reset();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormHandler);
    } else {
        initFormHandler();
    }
})();