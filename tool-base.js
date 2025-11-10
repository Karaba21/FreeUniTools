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
                let arrowClone = null;
                if (dropdownArrow) {
                    // Clonar la flecha antes de reemplazar el contenido
                    arrowClone = dropdownArrow.cloneNode(true);
                }
                element.innerHTML = allTranslations[key];
                // Restaurar la flecha si existía
                if (arrowClone) {
                    element.appendChild(arrowClone);
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

// Inicializar sistema de idioma y tema
function initLanguageAndTheme() {
    loadPreferences();
    setupLanguageButton();
    setupThemeButton();
    applyTheme();
    applyLanguage();
}

