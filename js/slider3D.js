// js/slider3d.js
class Slider3D {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.slider = document.getElementById('slider3d');
        if (!this.slider) {
            console.warn('Slider3D: No se encontró el elemento #slider3d');
            return;
        }
        
        this.items = Array.from(document.querySelectorAll('.slider-3d__item'));
        this.prevBtn = document.getElementById('sliderPrev');
        this.nextBtn = document.getElementById('sliderNext');
        this.dotsContainer = document.getElementById('sliderDots');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        this.currentIndex = 0;
        this.activeFilter = 'all';
        this.autoPlayInterval = null;
        this.isFiltering = false;
        this.visibleItems = [];
        
        // Drag variables
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.dragThreshold = 50;
        
        this.updateVisibleItems();
        this.createDots();
        this.updateClasses();
        this.addEventListeners();
        this.setupFilters();
        this.setupDragEvents();
        this.startAutoPlay();
        this.setupMobileCards();
        
        // Escuchar cambios de tamaño
        window.addEventListener('resize', () => this.setupMobileCards());
    }

    setupMobileCards() {
        const isMobile = window.innerWidth <= 768;
        const cards = document.querySelectorAll('.project-card-3d');
        
        cards.forEach(card => {
            // Remover eventos previos
            card.removeEventListener('click', this.handleCardClick);
            
            if (isMobile) {
                // En móvil: clic en la tarjeta para voltear (NO para navegar)
                card.addEventListener('click', this.handleCardClick);
            }
        });
    }

    handleCardClick(e) {
        // Prevenir que el clic se propague al slider
        e.stopPropagation();
        
        // Si el clic fue en un enlace, no hacer flip
        if (e.target.closest('a')) return;
        
        // Encontrar la tarjeta y su inner
        const card = e.currentTarget;
        const cardInner = card.querySelector('.project-card-3d__inner');
        
        if (!cardInner) return;
        
        const isFlipped = cardInner.classList.contains('flipped');
        
        // Cerrar otras tarjetas abiertas
        document.querySelectorAll('.project-card-3d__inner').forEach(otherCard => {
            if (otherCard !== cardInner) {
                otherCard.classList.remove('flipped');
            }
        });
        
        // Abrir/cerrar la actual
        cardInner.classList.toggle('flipped');
    }

    getVisibleItems() {
        if (this.activeFilter === 'all') {
            return this.items;
        }
        return this.items.filter(item => 
            item.dataset.category && item.dataset.category.includes(this.activeFilter)
        );
    }

    updateVisibleItems() {
        this.visibleItems = this.getVisibleItems();
        
        this.items.forEach(item => {
            if (this.visibleItems.includes(item)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        if (this.currentIndex >= this.visibleItems.length) {
            this.currentIndex = 0;
        }
    }

    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        this.visibleItems.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-3d__dot');
            dot.dataset.index = index;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.updateDots();
    }

    updateDots() {
        const dots = document.querySelectorAll('.slider-3d__dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    updateClasses() {
        this.items.forEach(item => {
            item.classList.remove('active', 'prev', 'next', 'hide-left', 'hide-right');
        });

        if (this.visibleItems.length === 0) return;

        this.visibleItems.forEach((item, index) => {
            if (index === this.currentIndex) {
                item.classList.add('active');
            } else if (index === this.getPrevIndex()) {
                item.classList.add('prev');
            } else if (index === this.getNextIndex()) {
                item.classList.add('next');
            } else {
                item.classList.add('hide-left');
            }
        });
    }

    getPrevIndex() {
        return (this.currentIndex - 1 + this.visibleItems.length) % this.visibleItems.length;
    }

    getNextIndex() {
        return (this.currentIndex + 1) % this.visibleItems.length;
    }

    next() {
        if (this.visibleItems.length <= 1) return;
        this.currentIndex = this.getNextIndex();
        this.updateClasses();
        this.updateDots();
    }

    prev() {
        if (this.visibleItems.length <= 1) return;
        this.currentIndex = this.getPrevIndex();
        this.updateClasses();
        this.updateDots();
    }

    goToSlide(index) {
        if (index >= 0 && index < this.visibleItems.length) {
            this.currentIndex = index;
            this.updateClasses();
            this.updateDots();
        }
    }

    setupDragEvents() {
        if (!this.slider) return;
        
        let dragStartTime;
        
        this.slider.addEventListener('mousedown', (e) => {
            // No iniciar drag si se hizo clic en un enlace o en la tarjeta (para no interferir con hover)
            if (e.target.closest('a') || e.target.closest('.project-card-3d')) return;
            dragStartTime = Date.now();
            this.startDrag(e);
        });
        
        this.slider.addEventListener('mousemove', (e) => this.drag(e));
        
        this.slider.addEventListener('mouseup', (e) => {
            const dragDuration = Date.now() - dragStartTime;
            // Solo considerar como drag si duró más de 100ms o se movió lo suficiente
            if (dragDuration > 100 || Math.abs(this.currentX - this.startX) > this.dragThreshold) {
                this.endDrag(e);
            }
            dragStartTime = null;
        });
        
        this.slider.addEventListener('mouseleave', () => this.endDrag());
        
        this.slider.addEventListener('touchstart', (e) => {
            if (e.target.closest('a') || e.target.closest('.project-card-3d')) return;
            this.startDrag(e);
        });
        
        this.slider.addEventListener('touchmove', (e) => this.drag(e));
        this.slider.addEventListener('touchend', (e) => this.endDrag(e));
        
        this.slider.addEventListener('dragstart', (e) => e.preventDefault());
    }

    startDrag(e) {
        if (this.isFiltering) return;
        e.preventDefault();
        
        this.isDragging = true;
        this.stopAutoPlay();
        
        this.startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        this.slider.classList.add('dragging');
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        this.currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const diff = this.currentX - this.startX;
        
        // Feedback visual durante el drag
        const activeItem = this.visibleItems[this.currentIndex];
        if (activeItem) {
            const rotateY = diff * 0.1;
            activeItem.style.transform = `translate3d(${diff}px, 0, 0) rotateY(${rotateY}deg)`;
        }
    }

    endDrag() {
        if (!this.isDragging) return;
        
        const diff = this.currentX - this.startX;
        
        // Resetear transformaciones
        this.visibleItems.forEach(item => {
            item.style.transform = '';
        });
        
        // Cambiar de proyecto si el arrastre fue significativo
        if (Math.abs(diff) > this.dragThreshold) {
            if (diff > 0) {
                this.prev(); // Arrastró a la derecha → proyecto anterior
            } else {
                this.next(); // Arrastró a la izquierda → proyecto siguiente
            }
        }
        
        this.isDragging = false;
        this.slider.classList.remove('dragging');
        this.startAutoPlay();
    }

    setupFilters() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isFiltering) return;
                
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const newFilter = btn.dataset.filter;
                this.applyFilter(newFilter);
            });
        });
    }

    applyFilter(newFilter) {
        this.isFiltering = true;
        this.stopAutoPlay();
        
        this.activeFilter = newFilter;
        this.updateVisibleItems();
        this.currentIndex = 0;
        this.createDots();
        this.updateClasses();
        
        this.isFiltering = false;
        this.startAutoPlay();
    }

    startAutoPlay() {
        this.stopAutoPlay();
        if (this.visibleItems.length > 1) {
            this.autoPlayInterval = setInterval(() => {
                if (!this.isDragging && !this.isFiltering) {
                    this.next();
                }
            }, 5000);
        }
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    addEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.stopAutoPlay();
                this.prev();
                this.startAutoPlay();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.stopAutoPlay();
                this.next();
                this.startAutoPlay();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.stopAutoPlay();
                this.prev();
                this.startAutoPlay();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.stopAutoPlay();
                this.next();
                this.startAutoPlay();
            }
        });

        if (this.slider) {
            this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
}

// Inicialización automática
new Slider3D();