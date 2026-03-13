// Slider 3D para proyectos
(function() {
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
            this.isDragging = false;
            this.startX = 0;
            this.currentX = 0;
            this.dragThreshold = 50;
            
            this.projectsData = [
                {
                    category: 'software database',
                    img: 'sistemaventas.svg',
                    title: 'Sistema de Ventas',
                    location: 'Cevichería Local · Huancayo',
                    description: 'Desarrollo de sistema de registro de ventas para cevichería local. Incluye gestión de productos, clientes y reportes diarios.',
                    tech: ['Java', 'MySQL', 'JDBC', 'Swing'],
                    features: ['Registro de ventas', 'Control de inventario', 'Reportes diarios', 'Gestión de clientes'],
                    github: 'https://github.com/tuusuario/sistema-ventas',
                    demo: 'demo.html?project=ventas'
                },
                {
                    category: 'software database',
                    img: 'sistemainventario.svg',
                    title: 'Sistema de Inventario',
                    location: 'Control de stock · Tiempo real',
                    description: 'Aplicación para gestión de inventario con alertas de stock mínimo y generación de códigos de barras.',
                    tech: ['Python', 'SQLite', 'Tkinter', 'ReportLab'],
                    features: ['Control de stock', 'Alertas automáticas', 'Generación de reportes', 'Códigos de barras'],
                    github: 'https://github.com/tuusuario/sistema-inventario',
                    demo: 'demo.html?project=inventario'
                },
                {
                    category: 'web',
                    img: 'portafolioweb.svg',
                    title: 'Portafolio Web',
                    location: 'Diseño responsivo · 2026',
                    description: 'Desarrollo de portafolio personal con diseño moderno, animaciones y efectos visuales avanzados.',
                    tech: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
                    features: ['Diseño responsivo', 'Animaciones fluidas', 'Modo oscuro/claro', 'Optimizado SEO'],
                    github: 'https://github.com/tuusuario/portafolio',
                    demo: 'demo.html?project=web'
                },
                {
                    category: 'database',
                    img: 'bdbiblioteca.svg',
                    title: 'BD Biblioteca',
                    location: 'Modelo relacional · 3FN',
                    description: 'Diseño completo de base de datos para sistema de biblioteca con procedimientos almacenados y triggers.',
                    tech: ['MySQL', 'Workbench', 'Stored Procedures', 'Triggers'],
                    features: ['Modelo E-R completo', 'Normalización 3FN', 'Consultas complejas', 'Backup automático'],
                    github: 'https://github.com/tuusuario/bd-biblioteca',
                    demo: 'demo.html?project=bd'
                },
                {
                    category: 'web',
                    img: 'appclima.svg',
                    title: 'App del Clima',
                    location: 'API OpenWeatherMap · React',
                    description: 'Aplicación web que muestra el clima actual y pronóstico usando la API de OpenWeatherMap.',
                    tech: ['React', 'API REST', 'CSS3', 'Axios'],
                    features: ['Búsqueda por ciudad', 'Geolocalización', 'Pronóstico 5 días', 'Modo oscuro/claro'],
                    github: 'https://github.com/tuusuario/app-clima',
                    demo: 'demo.html?project=clima'
                },
                {
                    category: 'software',
                    img: 'apirest.svg',
                    title: 'API REST',
                    location: 'Node.js + Express · JWT',
                    description: 'Desarrollo de API RESTful para gestión de usuarios y productos con autenticación JWT.',
                    tech: ['Node.js', 'Express', 'MongoDB', 'JWT'],
                    features: ['CRUD completo', 'Autenticación JWT', 'Middlewares', 'Documentación Swagger'],
                    github: 'https://github.com/tuusuario/api-rest',
                    demo: 'demo.html?project=api'
                },
                {
                    category: 'database',
                    img: 'mysqlavanzada.svg',
                    title: 'BD MySQL Avanzada',
                    location: 'Optimización · 50k+ registros',
                    description: 'Diseño e implementación de base de datos optimizada para sistema de ventas con 50,000+ registros.',
                    tech: ['MySQL', 'Índices', 'Stored Procedures', 'Triggers'],
                    features: ['Optimización de queries', 'Índices compuestos', 'Vistas materializadas', 'Backup automático'],
                    github: 'https://github.com/tuusuario/mysql-avanzado',
                    demo: 'demo.html?project=mysql'
                },
                {
                    category: 'web',
                    img: 'dashboard.svg',
                    title: 'Dashboard Admin',
                    location: 'Analítica · Tiempo real',
                    description: 'Panel de control con gráficos interactivos y datos en tiempo real para análisis de ventas.',
                    tech: ['Vue.js', 'Chart.js', 'Firebase', 'Tailwind'],
                    features: ['Gráficos interactivos', 'Datos en tiempo real', 'Filtros dinámicos', 'Exportar reportes'],
                    github: 'https://github.com/tuusuario/dashboard',
                    demo: 'demo.html?project=dashboard'
                },
                {
                    category: 'software',
                    img: 'apptareas.svg',
                    title: 'App de Tareas',
                    location: 'Java + SQLite · Recordatorios',
                    description: 'Aplicación de escritorio para gestión de tareas con recordatorios y categorías.',
                    tech: ['Java', 'SQLite', 'JavaFX', 'Hibernate'],
                    features: ['CRUD de tareas', 'Categorías personalizadas', 'Recordatorios', 'Búsqueda avanzada'],
                    github: 'https://github.com/tuusuario/app-tareas',
                    demo: 'demo.html?project=tareas'
                },
                {
                    category: 'database',
                    img: 'datawarehouse.svg',
                    title: 'Data Warehouse',
                    location: 'ETL + BI · Power BI',
                    description: 'Diseño e implementación de Data Warehouse para análisis de ventas con procesos ETL.',
                    tech: ['PostgreSQL', 'Pentaho', 'Power BI', 'SQL'],
                    features: ['Modelo estrella', 'Procesos ETL', 'Cubos OLAP', 'Dashboard Power BI'],
                    github: 'https://github.com/tuusuario/data-warehouse',
                    demo: 'demo.html?project=warehouse'
                }
            ];
            
            this.loadProjects();
            this.updateVisibleItems();
            this.createDots();
            this.updateClasses();
            this.addEventListeners();
            this.setupFilters();
            this.setupDragEvents();
            this.startAutoPlay();
            this.setupMobileCards();
        }

        loadProjects() {
            this.slider.innerHTML = '';
            
            this.projectsData.forEach((project, index) => {
                const projectHTML = this.createProjectHTML(project, index);
                this.slider.innerHTML += projectHTML;
            });
            
            this.items = Array.from(document.querySelectorAll('.slider-3d__item'));
        }

        createProjectHTML(project, index) {
            return `
                <div class="slider-3d__item" data-category="${project.category}" data-index="${index}">
                    <div class="project-card-3d">
                        <div class="project-card-3d__inner">
                            <div class="project-card-3d__front">
                                <img src="assets/images/${project.img}" alt="${project.title}" class="project-card-3d__front-img">
                                <div class="project-card-3d__overlay">
                                    <h3>${project.title}</h3>
                                    <p><i class="fas fa-location-dot"></i> <strong>${project.location}</strong></p>
                                    <span class="tap-hint">👆 Toca para ver detalles</span>
                                </div>
                            </div>
                            <div class="project-card-3d__back">
                                <h3 class="project-card-3d__title">${project.title}</h3>
                                <p class="project-card-3d__description">${project.description}</p>
                                <div class="project-card-3d__tech">
                                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                                </div>
                                <div class="project-card-3d__features">
                                    <h4>Características:</h4>
                                    <ul>
                                        ${project.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="project-card-3d__links">
                                    <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link-3d" onclick="event.stopPropagation()"><i class="fab fa-github"></i> Código</a>
                                    <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project-link-3d" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i> Demo</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
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
                if (e.target.closest('a') || e.target.closest('.project-card-3d')) return;
                dragStartTime = Date.now();
                this.startDrag(e);
            });
            
            this.slider.addEventListener('mousemove', (e) => this.drag(e));
            
            this.slider.addEventListener('mouseup', (e) => {
                const dragDuration = Date.now() - dragStartTime;
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

        setupMobileCards() {
            const isMobile = window.innerWidth <= 768;
            const cards = document.querySelectorAll('.project-card-3d');
            
            cards.forEach(card => {
                card.removeEventListener('click', this.handleCardClick);
                
                if (isMobile) {
                    card.addEventListener('click', this.handleCardClick);
                }
            });
        }

        handleCardClick(e) {
            e.stopPropagation();
            
            if (e.target.closest('a')) return;
            
            const card = e.currentTarget;
            const cardInner = card.querySelector('.project-card-3d__inner');
            
            if (!cardInner) return;
            
            document.querySelectorAll('.project-card-3d__inner').forEach(otherCard => {
                if (otherCard !== cardInner) {
                    otherCard.classList.remove('flipped');
                }
            });
            
            cardInner.classList.toggle('flipped');
        }
    }

    function initSlider() {
        new Slider3D();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlider);
    } else {
        initSlider();
    }
})();