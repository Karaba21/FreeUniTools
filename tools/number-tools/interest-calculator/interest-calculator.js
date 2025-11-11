// Traducciones específicas de Interest Calculator
const toolTranslations = {
    es: {
        'tool-title': 'Calculadora de Intereses',
        'tool-description': 'Calcula el valor de las cuotas y la tabla de amortización para tu préstamo.',
        'label-capital': 'Capital Solicitado',
        'label-rate': 'Tasa Efectiva Anual (%)',
        'label-installments': 'Cantidad de cuotas',
        'btn-calculate': 'Calcular',
        'error-capital': 'Por favor ingresa un capital válido',
        'error-rate': 'Por favor ingresa una tasa válida',
        'error-installments': 'Por favor ingresa una cantidad de cuotas válida',
        'label-installment': 'Cuota',
        'label-total': 'Monto total (capital más interés)',
        'table-installment-num': 'Cuota Nro',
        'table-installment-value': 'Valor Cuota',
        'table-interest': 'Intereses',
        'table-amortization': 'Amortización'
    },
    en: {
        'tool-title': 'Interest Calculator',
        'tool-description': 'Calculate the installment value and amortization table for your loan.',
        'label-capital': 'Requested Capital',
        'label-rate': 'Annual Effective Rate (%)',
        'label-installments': 'Number of installments',
        'btn-calculate': 'Calculate',
        'error-capital': 'Please enter a valid capital',
        'error-rate': 'Please enter a valid rate',
        'error-installments': 'Please enter a valid number of installments',
        'label-installment': 'Installment',
        'label-total': 'Total amount (capital plus interest)',
        'table-installment-num': 'Installment No',
        'table-installment-value': 'Installment Value',
        'table-interest': 'Interest',
        'table-amortization': 'Amortization'
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initLanguageAndTheme();
    setupCalculateButton();
    setupInputValidation();
});

// Configurar botón de calcular
function setupCalculateButton() {
    const calculateBtn = document.getElementById('calculate-btn');
    
    calculateBtn.addEventListener('click', () => {
        calculateInstallments();
    });
    
    // Permitir calcular con Enter
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateInstallments();
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

// Calcular cuotas y tabla de amortización
function calculateInstallments() {
    clearErrors();
    
    const capital = parseFloat(document.getElementById('capital').value);
    const annualRate = parseFloat(document.getElementById('rate').value);
    const numInstallments = parseInt(document.getElementById('installments').value);
    
    let isValid = true;
    
    // Validar capital
    if (!capital || capital <= 0) {
        showError('capital-error');
        isValid = false;
    }
    
    // Validar tasa
    if (annualRate === null || annualRate === undefined || annualRate < 0 || annualRate > 100) {
        showError('rate-error');
        isValid = false;
    }
    
    // Validar cantidad de cuotas
    if (!numInstallments || numInstallments <= 0 || !Number.isInteger(numInstallments)) {
        showError('installments-error');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Convertir tasa anual a mensual
    // Tasa efectiva mensual = (1 + tasa anual)^(1/12) - 1
    const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
    
    // Calcular valor de la cuota usando fórmula de amortización francesa
    // Cuota = Capital * (i * (1 + i)^n) / ((1 + i)^n - 1)
    const installmentValue = capital * (monthlyRate * Math.pow(1 + monthlyRate, numInstallments)) / 
                            (Math.pow(1 + monthlyRate, numInstallments) - 1);
    
    // Calcular monto total
    const totalAmount = installmentValue * numInstallments;
    
    // Mostrar resultados
    displayResults(installmentValue, totalAmount, capital, monthlyRate, numInstallments);
}

// Mostrar resultados y tabla de amortización
function displayResults(installmentValue, totalAmount, capital, monthlyRate, numInstallments) {
    const resultSection = document.getElementById('result-section');
    const tableWrapper = document.getElementById('amortization-table-wrapper');
    const installmentValueEl = document.getElementById('installment-value');
    const totalValueEl = document.getElementById('total-value');
    const tableBody = document.getElementById('amortization-table-body');
    
    // Formatear valores con separador de miles y 2 decimales
    installmentValueEl.textContent = formatCurrency(installmentValue);
    totalValueEl.textContent = formatCurrency(totalAmount);
    
    // Generar tabla de amortización
    generateAmortizationTable(capital, monthlyRate, installmentValue, numInstallments, tableBody);
    
    // Mostrar sección de resultados y tabla
    resultSection.classList.add('show');
    tableWrapper.classList.add('show');
    
    // Scroll suave al resultado
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Generar tabla de amortización
function generateAmortizationTable(initialCapital, monthlyRate, installmentValue, numInstallments, tableBody) {
    tableBody.innerHTML = '';
    
    let remainingCapital = initialCapital;
    
    for (let i = 1; i <= numInstallments; i++) {
        const row = document.createElement('tr');
        
        // Calcular intereses de esta cuota
        const interest = remainingCapital * monthlyRate;
        
        // Calcular amortización de esta cuota
        let amortization = installmentValue - interest;
        let finalInstallment = installmentValue;
        
        // En la última cuota, ajustar para que el capital pendiente sea exactamente 0
        if (i === numInstallments) {
            amortization = remainingCapital;
            finalInstallment = interest + amortization;
            remainingCapital = 0;
        } else {
            remainingCapital = remainingCapital - amortization;
        }
        
        // Crear celdas
        const cellNumber = document.createElement('td');
        cellNumber.className = 'table-number';
        cellNumber.textContent = i;
        
        const cellInstallment = document.createElement('td');
        cellInstallment.className = 'table-amount';
        cellInstallment.textContent = formatCurrency(finalInstallment);
        
        const cellInterest = document.createElement('td');
        cellInterest.className = 'table-amount';
        cellInterest.textContent = formatCurrency(interest);
        
        const cellAmortization = document.createElement('td');
        cellAmortization.className = 'table-amount';
        cellAmortization.textContent = formatCurrency(amortization);
        
        row.appendChild(cellNumber);
        row.appendChild(cellInstallment);
        row.appendChild(cellInterest);
        row.appendChild(cellAmortization);
        
        tableBody.appendChild(row);
    }
}

// Formatear moneda
function formatCurrency(value) {
    const locale = currentLanguage === 'es' ? 'es-ES' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
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
    
    if (inputId === 'capital') {
        errorId = 'capital-error';
    } else if (inputId === 'rate') {
        errorId = 'rate-error';
    } else if (inputId === 'installments') {
        errorId = 'installments-error';
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

