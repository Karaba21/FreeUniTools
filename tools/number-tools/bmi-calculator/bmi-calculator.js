// Estado de la calculadora
let currentUnit = 'metric';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
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
        category = 'Bajo peso';
        categoryClass = 'underweight';
        description = 'Tu BMI indica que estás por debajo del peso normal. Considera consultar con un profesional de la salud para asegurar una nutrición adecuada.';
    } else if (bmi < 25) {
        category = 'Peso normal';
        categoryClass = 'normal';
        description = '¡Excelente! Tu BMI está dentro del rango normal. Mantén un estilo de vida saludable con ejercicio regular y una dieta balanceada.';
    } else if (bmi < 30) {
        category = 'Sobrepeso';
        categoryClass = 'overweight';
        description = 'Tu BMI indica sobrepeso. Considera adoptar hábitos más saludables como ejercicio regular y una dieta equilibrada. Consulta con un profesional de la salud.';
    } else {
        category = 'Obesidad';
        categoryClass = 'obese';
        description = 'Tu BMI indica obesidad. Es recomendable consultar con un profesional de la salud para desarrollar un plan de pérdida de peso seguro y efectivo.';
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

