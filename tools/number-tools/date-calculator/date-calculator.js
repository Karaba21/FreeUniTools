// Traducciones específicas de Date Calculator
const toolTranslations = {
    es: {
        'tool-title': 'Calculador de Fechas',
        'tool-description': 'Calcula cuánto tiempo falta para una fecha futura o cuánto tiempo ha pasado desde una fecha pasada.',
        'label-select-date': 'Selecciona una fecha y hora',
        'error-date': 'Por favor selecciona una fecha válida',
        'label-years': 'Años',
        'label-months': 'Meses',
        'label-days': 'Días',
        'label-hours': 'Horas',
        'label-minutes': 'Minutos',
        'label-seconds': 'Segundos',
        'status-future': '⏳ Tiempo restante',
        'status-past': '⏰ Tiempo transcurrido',
        'date-selected': 'Fecha seleccionada:'
    },
    en: {
        'tool-title': 'Date Calculator',
        'tool-description': 'Calculate how much time is left until a future date or how much time has passed since a past date.',
        'label-select-date': 'Select a date and time',
        'error-date': 'Please select a valid date',
        'label-years': 'Years',
        'label-months': 'Months',
        'label-days': 'Days',
        'label-hours': 'Hours',
        'label-minutes': 'Minutes',
        'label-seconds': 'Seconds',
        'status-future': '⏳ Time remaining',
        'status-past': '⏰ Time elapsed',
        'date-selected': 'Selected date:'
    }
};

// Estado del calculador
let targetDate = null;
let countdownInterval = null;
let isFuture = true;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initLanguageAndTheme();
    setupDateInput();
    
    // Asegurar que los valores iniciales sean 0 y no mostrar resultados
    hideResult();
    resetCountdownValues();
});

// Configurar input de fecha
function setupDateInput() {
    const dateInput = document.getElementById('target-date');
    
    dateInput.addEventListener('change', () => {
        clearErrors();
        calculateDate();
    });
    
    dateInput.addEventListener('input', () => {
        clearErrors();
    });
    
    // Permitir Enter para confirmar la fecha
    dateInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            dateInput.blur(); // Esto activará el evento 'change'
            calculateDate();
        }
    });
}

// Formatear fecha para input datetime-local
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Calcular diferencia de fechas
function calculateDate() {
    const dateInput = document.getElementById('target-date');
    const dateValue = dateInput.value;
    
    if (!dateValue) {
        showError('date-error');
        hideResult();
        return;
    }
    
    // Parsear fecha seleccionada
    targetDate = new Date(dateValue);
    
    if (isNaN(targetDate.getTime())) {
        showError('date-error');
        hideResult();
        return;
    }
    
    // Determinar si es fecha futura o pasada
    const now = new Date();
    isFuture = targetDate > now;
    
    // Mostrar resultado
    displayResult();
    
    // Iniciar contador en tiempo real
    startCountdown();
}

// Iniciar contador en tiempo real
function startCountdown() {
    // Limpiar intervalo anterior si existe
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Actualizar inmediatamente
    updateCountdown();
    
    // Actualizar cada segundo
    countdownInterval = setInterval(() => {
        updateCountdown();
    }, 1000);
}

// Actualizar contador
function updateCountdown() {
    if (!targetDate) {
        return;
    }
    
    const now = new Date();
    const diff = Math.abs(targetDate - now);
    
    // Verificar si la fecha ya pasó (para fechas futuras) o si llegó (para fechas pasadas)
    const currentIsFuture = targetDate > now;
    
    if (isFuture && !currentIsFuture) {
        // La fecha futura ya pasó
        isFuture = false;
        displayResult();
    }
    
    // Calcular diferencias
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Actualizar UI
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// Mostrar resultado
function displayResult() {
    const resultSection = document.getElementById('result-section');
    const resultStatus = document.getElementById('result-status');
    const dateInfo = document.getElementById('date-info');
    
    if (!targetDate) {
        hideResult();
        return;
    }
    
    // Actualizar estado
    if (isFuture) {
        resultStatus.textContent = toolTranslations[currentLanguage]['status-future'];
        resultStatus.className = 'result-status future';
    } else {
        resultStatus.textContent = toolTranslations[currentLanguage]['status-past'];
        resultStatus.className = 'result-status past';
    }
    
    // Formatear fecha objetivo
    const locale = currentLanguage === 'es' ? 'es-ES' : 'en-US';
    const dateOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const formattedDate = targetDate.toLocaleDateString(locale, dateOptions);
    
    dateInfo.innerHTML = `
        <strong>${toolTranslations[currentLanguage]['date-selected']}</strong> ${formattedDate}
    `;
    
    // Mostrar sección de resultados
    resultSection.classList.add('show');
    
    // Scroll suave al resultado
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Ocultar resultado
function hideResult() {
    const resultSection = document.getElementById('result-section');
    resultSection.classList.remove('show');
    
    // Limpiar intervalo
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    // Resetear valores a 0
    resetCountdownValues();
}

// Resetear valores del contador a 0
function resetCountdownValues() {
    document.getElementById('years').textContent = '0';
    document.getElementById('months').textContent = '0';
    document.getElementById('days').textContent = '0';
    document.getElementById('hours').textContent = '0';
    document.getElementById('minutes').textContent = '0';
    document.getElementById('seconds').textContent = '0';
}

// Mostrar error
function showError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.add('show');
    }
}

// Limpiar errores
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
    });
}

// Limpiar al salir de la página
window.addEventListener('beforeunload', () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});

