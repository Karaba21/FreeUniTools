// Script base para herramientas - Funciones comunes de idioma y tema
// Este archivo proporciona funciones reutilizables para todas las herramientas

// Variables globales (se pueden sobrescribir en cada herramienta)
let currentLanguage = 'es';
let currentTheme = 'light';

// Cargar preferencias
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

// Aplicar tema
function applyTheme() {
    const html = document.documentElement;
    const themeBtn = document.getElementById('theme-btn');
    if (!themeBtn) return;
    
    const btnIcon = themeBtn.querySelector('.btn-icon');
    const btnText = themeBtn.querySelector('.btn-text');
    
    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        if (btnIcon) btnIcon.textContent = '☀️';
        if (btnText) btnText.textContent = currentLanguage === 'es' ? 'Claro' : 'Light';
    } else {
        html.removeAttribute('data-theme');
        if (btnIcon) btnIcon.textContent = '🌙';
        if (btnText) btnText.textContent = currentLanguage === 'es' ? 'Oscuro' : 'Dark';
    }
}

// Aplicar idioma (requiere que se defina toolTranslations en cada herramienta)
function applyLanguage() {
    // Combinar traducciones comunes y específicas
    const allTranslations = {
        ...commonTranslations[currentLanguage],
        ...(typeof toolTranslations !== 'undefined' ? toolTranslations[currentLanguage] : {})
    };
    
    // Actualizar textos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (allTranslations[key]) {
            // Para elementos que pueden contener HTML, usar innerHTML
            // Para otros, usar textContent
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // No actualizar inputs/textarea con data-i18n, solo placeholders
            } else {
                // Preservar elementos hijos importantes (como dropdown-arrow)
                const dropdownArrow = element.querySelector('.dropdown-arrow');
                if (dropdownArrow) {
                    // Preservar la flecha y actualizar solo el texto
                    const arrowHTML = dropdownArrow.outerHTML;
                    element.innerHTML = allTranslations[key] + ' ' + arrowHTML;
                } else {
                    element.innerHTML = allTranslations[key];
                }
            }
        }
    });
    
    // Actualizar placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (allTranslations[key]) {
            element.placeholder = allTranslations[key];
        }
    });
    
    // Actualizar opciones del select
    document.querySelectorAll('option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        if (allTranslations[key]) {
            option.textContent = allTranslations[key];
        }
    });
    
    // Actualizar botón de idioma
    const languageBtn = document.getElementById('language-btn');
    if (languageBtn) {
        const btnText = languageBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = currentLanguage.toUpperCase();
        }
    }
    
    // Actualizar botón de tema
    applyTheme();
}

// Configurar botón de idioma
function setupLanguageButton() {
    const languageBtn = document.getElementById('language-btn');
    if (!languageBtn) return;
    
    languageBtn.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
        applyLanguage();
        localStorage.setItem('language', currentLanguage);
    });
}

// Configurar botón de tema
function setupThemeButton() {
    const themeBtn = document.getElementById('theme-btn');
    if (!themeBtn) return;
    
    themeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme();
        localStorage.setItem('theme', currentTheme);
    });
}

// Configurar menú móvil
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navCategories = document.getElementById('nav-categories');
    
    if (!mobileMenuToggle || !navCategories) {
        return;
    }
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navCategories.classList.toggle('active');
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        const isClickInsideNav = e.target.closest('.navbar');
        const isClickOnToggle = e.target.closest('.mobile-menu-toggle');
        
        if (!isClickInsideNav && navCategories.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            navCategories.classList.remove('active');
        }
    });
    
    // Cerrar menú al hacer scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768 && navCategories.classList.contains('active')) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                mobileMenuToggle.classList.remove('active');
                navCategories.classList.remove('active');
            }, 100);
        }
    });
    
    // Cerrar menú al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mobileMenuToggle.classList.remove('active');
            navCategories.classList.remove('active');
        }
    });
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

// Inicializar sistema de idioma y tema
function initLanguageAndTheme() {
    loadPreferences();
    setupLanguageButton();
    setupThemeButton();
    applyTheme();
    applyLanguage();
    // Configurar menú móvil y dropdowns
    setupMobileMenu();
    setupDropdowns();
}

