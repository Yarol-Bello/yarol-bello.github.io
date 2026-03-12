// js/slider3d.js
class Slider3D {
    constructor() {
        this.slider = document.getElementById('slider3d');
        if (!this.slider) return;
        
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
        
        this.init();
    }

    init() {
        this.updateVisibleItems();
        this.createDots();
        this.updateClasses();
        this.addEventListeners();
        this.setupFilters();
        this.setupDragEvents();
        this.startAutoPlay();
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
        
        // Mostrar/ocultar items
        this.items.forEach(item => {
            if (this.visibleItems.includes(item)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Ajustar índice
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
        // Remover clases de todos los items
        this.items.forEach(item => {
            item.classList.remove('active', 'prev', 'next', 'hide-left', 'hide-right');
        });

        if (this.visibleItems.length === 0) return;

        // Asignar clases según posición
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

    // ===== DRAG FUNCIONALITY =====
    setupDragEvents() {
        if (!this.slider) return;
        
        this.slider.addEventListener('mousedown', (e) => this.startDrag(e));
        this.slider.addEventListener('mousemove', (e) => this.drag(e));
        this.slider.addEventListener('mouseup', (e) => this.endDrag(e));
        this.slider.addEventListener('mouseleave', () => this.endDrag());
        
        this.slider.addEventListener('touchstart', (e) => this.startDrag(e));
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
        
        const activeItem = this.visibleItems[this.currentIndex];
        if (activeItem) {
            const rotateY = diff * 0.1;
            activeItem.style.transform = `translate3d(${diff}px, 0, 0) rotateY(${rotateY}deg)`;
        }
    }

    endDrag() {
        if (!this.isDragging) return;
        
        const diff = this.currentX - this.startX;
        
        this.visibleItems.forEach(item => {
            item.style.transform = '';
        });
        
        if (Math.abs(diff) > this.dragThreshold) {
            if (diff > 0) {
                this.prev();
            } else {
                this.next();
            }
        }
        
        this.isDragging = false;
        this.slider.classList.remove('dragging');
        this.startAutoPlay();
    }

    // ===== FILTROS =====
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
        
        // Actualizar items visibles
        this.updateVisibleItems();
        
        // Resetear índice
        this.currentIndex = 0;
        
        // Recrear dots y actualizar clases
        this.createDots();
        this.updateClasses();
        
        this.isFiltering = false;
        this.startAutoPlay();
    }

    // ===== AUTO-PLAY =====
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

    // ===== EVENT LISTENERS =====
    addEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.stopAutoPlay();
                this.prev();
                this.startAutoPlay();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
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

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('slider3d')) {
        new Slider3D();
    }
});