// Configuración de idiomas
const translations = {
    es: {
        'hero-title': 'Herramientas Gratis Online',
        'hero-subtitle': 'Convierte, edita y transforma tus archivos con nuestras herramientas gratuitas',
        'image-tools-title': 'Image Tools',
        'text-tools-title': 'Text Tools',
        'number-tools-title': 'Number Tools',
        'language-btn': 'ES',
        'theme-btn-light': 'Claro',
        'theme-btn-dark': 'Oscuro'
    },
    en: {
        'hero-title': 'Free Online Tools',
        'hero-subtitle': 'Convert, edit and transform your files with our free tools',
        'image-tools-title': 'Image Tools',
        'text-tools-title': 'Text Tools',
        'number-tools-title': 'Number Tools',
        'language-btn': 'EN',
        'theme-btn-light': 'Light',
        'theme-btn-dark': 'Dark'
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
    
    // Aplicar tema inicial
    applyTheme();
    
    // Aplicar idioma inicial
    applyLanguage();
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

// Manejar scroll suave para los enlaces del navbar
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

