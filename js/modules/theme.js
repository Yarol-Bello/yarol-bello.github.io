// Cambio de tema
(function() {
    function initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;

        if (!themeToggle) return;

        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        htmlElement.setAttribute('data-theme', initialTheme);
        
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: initialTheme } 
        }));

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            const logo = document.querySelector('.logo');
            if (logo) {
                logo.style.transform = 'scale(0.9) rotate(-2deg)';
                logo.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                setTimeout(() => { logo.style.transform = 'scale(1) rotate(0)'; }, 200);
                setTimeout(() => { logo.style.transition = ''; }, 500);
            }
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            document.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme: newTheme } 
            }));
            
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => { document.body.style.transition = ''; }, 300);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();