// Configuración de idiomas
const translations = {
    es: {
        'hero-title': 'Free Uni Tools',
        'hero-subtitle': 'FreeUniTools nació con un solo objetivo: hacer que las herramientas digitales sean accesibles para todos — estudiantes, freelancers, desarrolladores y creadores. Sin registros. Sin muros de pago. Solo conocimiento y productividad.',
        'image-tools-title': 'Herramientas de Imágenes',
        'text-tools-title': 'Herramientas de Texto',
        'number-tools-title': 'Herramientas de Números',
        'language-btn': 'ES',
        'theme-btn-light': 'Claro',
        'theme-btn-dark': 'Oscuro',
        'popular-tools-title': 'Herramientas Populares',
        'stats-title': 'Creciendo cada día',
        'tools-label': 'Herramientas Disponibles',
        'users-label': 'Usuarios Mensuales',
        'contribute-title': 'Contribuye al Proyecto',
        'contribute-donate': 'Donar con PayPal',
        'footer-description': 'Herramientas gratuitas para hacer tu trabajo más fácil.',
        'footer-tools-title': 'Herramientas',
        'footer-about-title': 'Acerca de',
        'footer-contribute': 'Contribuir',
        'footer-privacy': 'Privacidad',
        'footer-terms': 'Términos',
        'footer-copyright': '© 2025 FreeUniTools. Todos los derechos reservados.',
    },
    en: {
        'hero-title': 'Free Uni Tools',
        'hero-subtitle': 'FreeUniTools was born with one goal: to make digital tools accessible for everyone — students, freelancers, developers, and creators. No sign-ups. No paywalls. Just knowledge and productivity.',
        'image-tools-title': 'Image Tools',
        'text-tools-title': 'Text Tools',
        'number-tools-title': 'Number Tools',
        'language-btn': 'EN',
        'theme-btn-light': 'Light',
        'theme-btn-dark': 'Dark',
        'popular-tools-title': 'Popular Tools',
        'stats-title': 'Counting and growing',
        'tools-label': 'Available Tools',
        'users-label': 'Monthly Users',
        'contribute-title': 'Contribute to the Project',
        'contribute-description': 'Do you have an idea for a new tool or want to improve existing ones? Join our community and help make FreeUniTools even better!',
        'contribute-donate': 'Donate with PayPal',
        'footer-description': 'Free and open source tools to make your work easier.',
        'footer-tools-title': 'Tools',
        'footer-about-title': 'About',
        'footer-contribute': 'Contribute',
        'footer-privacy': 'Privacy',
        'footer-terms': 'Terms',
        'footer-copyright': '© 2025 FreeUniTools. All rights reserved.',
    }
};

// Estado de la aplicación
let currentLanguage = 'es';
let currentTheme = 'light';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar preferencias guardadas
    loadPreferences();
    
    // Configurar botones
    setupLanguageButton();
    setupThemeButton();
    
    // Configurar dropdowns
    setupDropdowns();
    
    // Aplicar tema inicial
    applyTheme();
    
    // Aplicar idioma inicial
    applyLanguage();
    
    // Inicializar contadores
    initCounters();
});

// Cargar preferencias del localStorage
function loadPreferences() {
    const savedLanguage = localStorage.getItem('language');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    
    if (savedTheme) {
        currentTheme = savedTheme;
    }
}

// Guardar preferencias en localStorage
function savePreferences() {
    localStorage.setItem('language', currentLanguage);
    localStorage.setItem('theme', currentTheme);
}

// Configurar botón de idioma
function setupLanguageButton() {
    const languageBtn = document.getElementById('language-btn');
    const btnText = languageBtn.querySelector('.btn-text');
    
    languageBtn.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
        applyLanguage();
        savePreferences();
    });
}

// Configurar botón de tema
function setupThemeButton() {
    const themeBtn = document.getElementById('theme-btn');
    const btnIcon = themeBtn.querySelector('.btn-icon');
    const btnText = themeBtn.querySelector('.btn-text');
    
    themeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme();
        savePreferences();
    });
}

// Aplicar tema
function applyTheme() {
    const html = document.documentElement;
    const themeBtn = document.getElementById('theme-btn');
    const btnIcon = themeBtn.querySelector('.btn-icon');
    const btnText = themeBtn.querySelector('.btn-text');
    
    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        btnIcon.textContent = '☀️';
        btnText.textContent = currentLanguage === 'es' ? 'Claro' : 'Light';
    } else {
        html.removeAttribute('data-theme');
        btnIcon.textContent = '🌙';
        btnText.textContent = currentLanguage === 'es' ? 'Oscuro' : 'Dark';
    }
}

// Aplicar idioma
function applyLanguage() {
    const languageBtn = document.getElementById('language-btn');
    const btnText = languageBtn.querySelector('.btn-text');
    
    // Actualizar textos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Actualizar botón de idioma
    btnText.textContent = currentLanguage.toUpperCase();
    
    // Actualizar botón de tema si es necesario
    const themeBtn = document.getElementById('theme-btn');
    const themeBtnText = themeBtn.querySelector('.btn-text');
    if (currentTheme === 'dark') {
        themeBtnText.textContent = currentLanguage === 'es' ? 'Claro' : 'Light';
    } else {
        themeBtnText.textContent = currentLanguage === 'es' ? 'Oscuro' : 'Dark';
    }
}

// Configurar dropdowns
function setupDropdowns() {
    const dropdownContainers = document.querySelectorAll('.dropdown-container');
    
    dropdownContainers.forEach(container => {
        const navLink = container.querySelector('.nav-link');
        const dropdownMenu = container.querySelector('.dropdown-menu');
        
        // Mantener el dropdown abierto cuando el mouse está sobre el menú (solo desktop)
        if (dropdownMenu) {
            dropdownMenu.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    container.classList.add('hover-active');
                }
            });
            
            dropdownMenu.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    container.classList.remove('hover-active');
                }
            });
        }
        
        // Para móviles: toggle con click
        navLink.addEventListener('click', (e) => {
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // En móviles, siempre toggle
                e.preventDefault();
                e.stopPropagation();
                
                // Cerrar otros dropdowns
                dropdownContainers.forEach(other => {
                    if (other !== container) {
                        other.classList.remove('active');
                    }
                });
                
                // Toggle del dropdown actual
                container.classList.toggle('active');
            } else {
                // En desktop, solo navegar si no hay hover (click directo)
                // El hover maneja el dropdown en desktop
            }
        });
        
        // Manejar clicks en items del dropdown
        const dropdownItems = container.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Scroll suave al destino
                const href = item.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
                
                // Cerrar dropdown después de un pequeño delay para permitir la navegación
                setTimeout(() => {
                    container.classList.remove('active');
                }, 200);
            });
        });
    });
    
    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', (e) => {
        // No cerrar si el click fue en un item del dropdown (el item maneja su propio cierre)
        if (e.target.closest('.dropdown-item')) {
            return;
        }
        
        // Verificar si el click fue dentro de algún dropdown-container
        const clickedInsideDropdown = e.target.closest('.dropdown-container');
        
        // Solo cerrar si el click NO fue dentro de ningún dropdown
        if (!clickedInsideDropdown) {
            dropdownContainers.forEach(container => {
                container.classList.remove('active');
            });
        }
    });
    
    // Cerrar dropdowns al hacer scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            dropdownContainers.forEach(container => {
                container.classList.remove('active');
            });
        }, 100);
    });
}

// Manejar scroll suave para los enlaces del navbar (sin dropdown)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Solo si no está dentro de un dropdown-container
        if (!link.closest('.dropdown-container')) {
            const href = link.getAttribute('href');
            
            // Detectar si el enlace apunta a la página actual
            if (href && !href.startsWith('#')) {
                try {
                    const currentPath = window.location.pathname;
                    const currentFile = currentPath.split('/').pop() || 'index.html';
                    const hrefResolved = new URL(href, window.location.href);
                    const hrefPath = hrefResolved.pathname;
                    const hrefFile = hrefPath.split('/').pop() || 'index.html';
                    
                    // Si el enlace apunta a la página actual (mismo archivo), prevenir navegación
                    if (hrefFile === currentFile || hrefPath === currentPath) {
                        e.preventDefault();
                        return;
                    }
                } catch (error) {
                    // Si hay error al parsear la URL, continuar con el comportamiento normal
                }
            }
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    });
});

// Función para animar contadores
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Formatear número con separadores de miles
        const formatted = Math.floor(current).toLocaleString('es-ES');
        element.textContent = formatted;
    }, 16);
}

// Inicializar contadores
function initCounters() {
    const toolsCountElement = document.getElementById('tools-count');
    const usersCountElement = document.getElementById('users-count');
    
    if (!toolsCountElement || !usersCountElement) {
        return;
    }
    
    // Contar herramientas disponibles
    // Image Tools: 5 herramientas
    // Text Tools: 2 herramientas
    // Number Tools: 3 herramientas
    // QR Generator: 1 herramienta
    const totalTools = 11;
    
    // Número ficticio de usuarios mensuales
    const monthlyUsers = 12500;
    
    // Usar Intersection Observer para animar cuando la sección sea visible
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar contador de herramientas
                if (toolsCountElement.textContent === '0') {
                    animateCounter(toolsCountElement, totalTools, 1500);
                }
                
                // Animar contador de usuarios
                if (usersCountElement.textContent === '0') {
                    animateCounter(usersCountElement, monthlyUsers, 2000);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar la sección de estadísticas
    const statsSection = document.querySelector('.stats-section-wrapper');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

