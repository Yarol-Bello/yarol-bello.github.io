// Scroll horizontal para certificaciones
(function() {
    function initCertificaciones() {
        const certsScroll = document.getElementById('certsScroll');

        if (!certsScroll) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        certsScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            certsScroll.classList.add('dragging');
            startX = e.pageX - certsScroll.offsetLeft;
            scrollLeft = certsScroll.scrollLeft;
        });

        certsScroll.addEventListener('mouseleave', () => {
            isDown = false;
            certsScroll.classList.remove('dragging');
        });

        certsScroll.addEventListener('mouseup', () => {
            isDown = false;
            certsScroll.classList.remove('dragging');
        });

        certsScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - certsScroll.offsetLeft;
            const walk = (x - startX) * 2;
            certsScroll.scrollLeft = scrollLeft - walk;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCertificaciones);
    } else {
        initCertificaciones();
    }
})();