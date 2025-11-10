// Traducciones específicas de BMI Calculator
const toolTranslations = {
    es: {
        'tool-title': 'Calculadora de IMC',
        'tool-description': 'Calcula tu Índice de Masa Corporal (BMI) para conocer tu estado de salud general.',
        'unit-metric': 'Métrico',
        'unit-imperial': 'Imperial',
        'label-weight': 'Peso',
        'label-height': 'Altura',
        'btn-calculate': 'Calcular BMI',
        'error-weight': 'Por favor ingresa un peso válido',
        'error-height': 'Por favor ingresa una altura válida',
        'scale-title': 'Escala de BMI',
        'category-underweight': 'Bajo peso',
        'category-normal': 'Normal',
        'category-overweight': 'Sobrepeso',
        'category-obese': 'Obesidad',
        'category-normal-weight': 'Peso normal',
        'desc-underweight': 'Tu BMI indica que estás por debajo del peso normal. Considera consultar con un profesional de la salud para asegurar una nutrición adecuada.',
        'desc-normal': '¡Excelente! Tu BMI está dentro del rango normal. Mantén un estilo de vida saludable con ejercicio regular y una dieta balanceada.',
        'desc-overweight': 'Tu BMI indica sobrepeso. Considera adoptar hábitos más saludables como ejercicio regular y una dieta equilibrada. Consulta con un profesional de la salud.',
        'desc-obese': 'Tu BMI indica obesidad. Es recomendable consultar con un profesional de la salud para desarrollar un plan de pérdida de peso seguro y efectivo.'
    },
    en: {
        'tool-title': 'BMI Calculator',
        'tool-description': 'Calculate your Body Mass Index (BMI) to know your general health status.',
        'unit-metric': 'Metric',
        'unit-imperial': 'Imperial',
        'label-weight': 'Weight',
        'label-height': 'Height',
        'btn-calculate': 'Calculate BMI',
        'error-weight': 'Please enter a valid weight',
        'error-height': 'Please enter a valid height',
        'scale-title': 'BMI Scale',
        'category-underweight': 'Underweight',
        'category-normal': 'Normal',
        'category-overweight': 'Overweight',
        'category-obese': 'Obesity',
        'category-normal-weight': 'Normal weight',
        'desc-underweight': 'Your BMI indicates you are below normal weight. Consider consulting with a health professional to ensure adequate nutrition.',
        'desc-normal': 'Excellent! Your BMI is within the normal range. Maintain a healthy lifestyle with regular exercise and a balanced diet.',
        'desc-overweight': 'Your BMI indicates overweight. Consider adopting healthier habits such as regular exercise and a balanced diet. Consult with a health professional.',
        'desc-obese': 'Your BMI indicates obesity. It is recommended to consult with a health professional to develop a safe and effective weight loss plan.'
    }
};

// Estado de la calculadora
let currentUnit = 'metric';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initLanguageAndTheme();
    setupUnitSelector();
    setupCalculateButton();
    setupInputValidation();
});

// Configurar selector de unidades
function setupUnitSelector() {
    const unitOptions = document.querySelectorAll('.unit-option');
    
    unitOptions.forEach(option => {
        option.addEventListener('click', () => {
            const unit = option.getAttribute('data-unit');
            switchUnit(unit);
        });
    });
}

// Cambiar entre unidades métricas e imperiales
function switchUnit(unit) {
    currentUnit = unit;
    
    // Actualizar botones
    document.querySelectorAll('.unit-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-unit="${unit}"]`).classList.add('active');
    
    // Mostrar/ocultar inputs
    const metricInputs = document.getElementById('metric-inputs');
    const imperialInputs = document.getElementById('imperial-inputs');
    
    if (unit === 'metric') {
        metricInputs.style.display = 'block';
        imperialInputs.style.display = 'none';
    } else {
        metricInputs.style.display = 'none';
        imperialInputs.style.display = 'block';
    }
    
    // Limpiar resultados
    hideResult();
    clearErrors();
}

// Configurar botón de calcular
function setupCalculateButton() {
    const calculateBtn = document.getElementById('calculate-bmi');
    
    calculateBtn.addEventListener('click', () => {
        calculateBMI();
    });
    
    // Permitir calcular con Enter
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateBMI();
            }
        });
    });
}

// Validación de inputs
function setupInputValidation() {
    const inputs = document.querySelectorAll('.input-field');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearError(input);
        });
    });
}

// Calcular BMI
function calculateBMI() {
    clearErrors();
    
    let weight, height;
    let isValid = true;
    
    if (currentUnit === 'metric') {
        weight = parseFloat(document.getElementById('weight-metric').value);
        height = parseFloat(document.getElementById('height-metric').value);
        
        if (!weight || weight <= 0 || weight > 500) {
            showError('weight-metric-error');
            isValid = false;
        }
        
        if (!height || height <= 0 || height > 250) {
            showError('height-metric-error');
            isValid = false;
        }
        
        // Convertir altura de cm a metros
        if (isValid) {
            height = height / 100;
        }
    } else {
        weight = parseFloat(document.getElementById('weight-imperial').value);
        const feet = parseInt(document.getElementById('height-feet').value);
        const inches = parseInt(document.getElementById('height-inches').value);
        
        if (!weight || weight <= 0 || weight > 1100) {
            showError('weight-imperial-error');
            isValid = false;
        }
        
        if (!feet || feet <= 0 || feet > 8 || inches < 0 || inches > 11) {
            showError('height-imperial-error');
            isValid = false;
        }
        
        // Convertir altura a metros
        if (isValid) {
            height = (feet * 12 + inches) * 0.0254;
            // Convertir peso de lbs a kg
            weight = weight * 0.453592;
        }
    }
    
    if (!isValid) {
        return;
    }
    
    // Calcular BMI: peso (kg) / altura (m)²
    const bmi = weight / (height * height);
    
    // Mostrar resultado
    displayResult(bmi);
}

// Mostrar resultado
function displayResult(bmi) {
    const resultSection = document.getElementById('result-section');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const bmiDescription = document.getElementById('bmi-description');
    
    // Formatear BMI con un decimal
    const formattedBMI = bmi.toFixed(1);
    bmiValue.textContent = formattedBMI;
    
    // Determinar categoría
    let category, categoryClass, description;
    
    if (bmi < 18.5) {
        category = toolTranslations[currentLanguage]['category-underweight'];
        categoryClass = 'underweight';
        description = toolTranslations[currentLanguage]['desc-underweight'];
    } else if (bmi < 25) {
        category = toolTranslations[currentLanguage]['category-normal-weight'];
        categoryClass = 'normal';
        description = toolTranslations[currentLanguage]['desc-normal'];
    } else if (bmi < 30) {
        category = toolTranslations[currentLanguage]['category-overweight'];
        categoryClass = 'overweight';
        description = toolTranslations[currentLanguage]['desc-overweight'];
    } else {
        category = toolTranslations[currentLanguage]['category-obese'];
        categoryClass = 'obese';
        description = toolTranslations[currentLanguage]['desc-obese'];
    }
    
    // Actualizar UI
    bmiCategory.textContent = category;
    bmiCategory.className = `bmi-category ${categoryClass}`;
    bmiDescription.textContent = description;
    
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
}

// Mostrar error
function showError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.add('show');
    }
}

// Limpiar error específico
function clearError(input) {
    const inputId = input.id;
    let errorId;
    
    if (inputId.includes('weight-metric')) {
        errorId = 'weight-metric-error';
    } else if (inputId.includes('height-metric')) {
        errorId = 'height-metric-error';
    } else if (inputId.includes('weight-imperial')) {
        errorId = 'weight-imperial-error';
    } else if (inputId.includes('height-feet') || inputId.includes('height-inches')) {
        errorId = 'height-imperial-error';
    }
    
    if (errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
}

// Limpiar todos los errores
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
    });
}

