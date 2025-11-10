// Variables globales
let currentQRData = null;

// Traducciones específicas de QR Tools
const toolTranslations = {
    es: {
        'tool-title': 'Generador QR',
        'tool-description': 'Genera códigos QR personalizados para URLs, texto, números de teléfono, correos electrónicos y más. Descarga como PNG o SVG.',
        'label-content': 'Contenido del Código QR',
        'placeholder-content': 'Ingresa el texto, URL, correo electrónico, número de teléfono, etc. que quieres convertir en un código QR...',
        'quick-url': 'URL',
        'quick-email': 'Email',
        'quick-phone': 'Teléfono',
        'quick-wifi': 'WiFi',
        'quick-sms': 'SMS',
        'label-size': 'Tamaño del Código',
        'label-error-level': 'Nivel de Corrección de Errores',
        'error-low': 'Bajo (L) - ~7%',
        'error-medium': 'Medio (M) - ~15%',
        'error-high': 'Alto (Q) - ~25%',
        'error-very-high': 'Muy Alto (H) - ~30%',
        'label-code-color': 'Color del Código',
        'label-qr-color': 'Color del Código QR',
        'label-bg-color': 'Color de Fondo',
        'label-bg-color-text': 'Color de Fondo',
        'label-margin': 'Margen',
        'btn-generate': 'Generar Código QR',
        'preview-title': 'Tu Código QR',
        'btn-download-png': 'Descargar PNG',
        'btn-download-svg': 'Descargar SVG',
        'btn-reset': 'Generar Nuevo',
        'alert-empty-content': 'Por favor, ingresa algún contenido para generar el código QR.',
        'alert-library-error': 'La librería QRCode no se ha cargado. Por favor, recarga la página.',
        'alert-generate-error': 'Error al generar el código QR. Por favor, intenta de nuevo.',
        'alert-svg-error': 'Error al generar el SVG. Por favor, intenta de nuevo.'
    },
    en: {
        'tool-title': 'QR Generator',
        'tool-description': 'Generate custom QR codes for URLs, text, phone numbers, emails, and more. Download as PNG or SVG.',
        'label-content': 'QR Code Content',
        'placeholder-content': 'Enter the text, URL, email, phone number, etc. that you want to convert into a QR code...',
        'quick-url': 'URL',
        'quick-email': 'Email',
        'quick-phone': 'Phone',
        'quick-wifi': 'WiFi',
        'quick-sms': 'SMS',
        'label-size': 'Code Size',
        'label-error-level': 'Error Correction Level',
        'error-low': 'Low (L) - ~7%',
        'error-medium': 'Medium (M) - ~15%',
        'error-high': 'High (Q) - ~25%',
        'error-very-high': 'Very High (H) - ~30%',
        'label-code-color': 'Code Color',
        'label-qr-color': 'QR Code Color',
        'label-bg-color': 'Background Color',
        'label-bg-color-text': 'Background Color',
        'label-margin': 'Margin',
        'btn-generate': 'Generate QR Code',
        'preview-title': 'Your QR Code',
        'btn-download-png': 'Download PNG',
        'btn-download-svg': 'Download SVG',
        'btn-reset': 'Generate New',
        'alert-empty-content': 'Please enter some content to generate the QR code.',
        'alert-library-error': 'The QRCode library has not loaded. Please reload the page.',
        'alert-generate-error': 'Error generating the QR code. Please try again.',
        'alert-svg-error': 'Error generating the SVG. Please try again.'
    }
};

// Las funciones de idioma y tema están en tool-base.js

// Función para esperar a que QRCode esté disponible
function waitForQRCode(callback) {
    if (typeof QRCode !== 'undefined') {
        callback();
    } else {
        setTimeout(() => waitForQRCode(callback), 100);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initLanguageAndTheme();
    
    waitForQRCode(() => {
        setupControls();
        setupQuickActions();
    });
});

// Configurar controles
function setupControls() {
    const generateBtn = document.getElementById('generate-btn');
    const sizeSlider = document.getElementById('size-slider');
    const sizeValue = document.getElementById('size-value');
    const marginSlider = document.getElementById('margin-slider');
    const marginValue = document.getElementById('margin-value');
    const downloadPngBtn = document.getElementById('download-png-btn');
    const downloadSvgBtn = document.getElementById('download-svg-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Actualizar valor del tamaño
    sizeSlider.addEventListener('input', (e) => {
        sizeValue.textContent = `${e.target.value}px`;
        if (currentQRData) {
            generateQR();
        }
    });

    // Actualizar valor del margen
    marginSlider.addEventListener('input', (e) => {
        marginValue.textContent = e.target.value;
        if (currentQRData) {
            generateQR();
        }
    });

    // Generar QR cuando cambian los colores o nivel de error
    document.getElementById('foreground-color').addEventListener('change', () => {
        if (currentQRData) {
            generateQR();
        }
    });

    document.getElementById('background-color').addEventListener('change', () => {
        if (currentQRData) {
            generateQR();
        }
    });

    document.getElementById('error-level-select').addEventListener('change', () => {
        if (currentQRData) {
            generateQR();
        }
    });

    // Botón generar
    generateBtn.addEventListener('click', () => {
        const content = document.getElementById('qr-content').value.trim();
        if (!content) {
            alert(toolTranslations[currentLanguage]['alert-empty-content']);
            return;
        }
        generateQR();
    });

    // Descargar PNG
    downloadPngBtn.addEventListener('click', () => {
        if (!currentQRData) return;
        downloadQR('png');
    });

    // Descargar SVG
    downloadSvgBtn.addEventListener('click', () => {
        if (!currentQRData) return;
        downloadQR('svg');
    });

    // Reset
    resetBtn.addEventListener('click', () => {
        document.getElementById('qr-content').value = '';
        document.getElementById('preview-section').classList.remove('active');
        currentQRData = null;
    });

    // Generar al presionar Enter en el textarea
    document.getElementById('qr-content').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateQR();
        }
    });
}

// Configurar acciones rápidas
function setupQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    const qrContent = document.getElementById('qr-content');

    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            let placeholder = '';

            switch (action) {
                case 'url':
                    placeholder = 'https://example.com';
                    break;
                case 'email':
                    placeholder = 'mailto:example@email.com';
                    break;
                case 'phone':
                    placeholder = 'tel:+1234567890';
                    break;
                case 'wifi':
                    placeholder = 'WIFI:T:WPA;S:NetworkName;P:Password;;';
                    break;
                case 'sms':
                    placeholder = 'sms:+1234567890?body=Your message here';
                    break;
            }

            if (placeholder) {
                qrContent.value = placeholder;
                qrContent.focus();
            }
        });
    });
}

// Generar código QR
function generateQR() {
    // Verificar que la librería esté cargada
    if (typeof QRCode === 'undefined') {
        alert(toolTranslations[currentLanguage]['alert-library-error']);
        console.error('QRCode library not loaded');
        return;
    }

    const content = document.getElementById('qr-content').value.trim();
    
    if (!content) {
        alert(toolTranslations[currentLanguage]['alert-empty-content']);
        return;
    }

    const size = parseInt(document.getElementById('size-slider').value);
    const errorLevel = document.getElementById('error-level-select').value;
    const foregroundColor = document.getElementById('foreground-color').value;
    const backgroundColor = document.getElementById('background-color').value;
    const margin = parseInt(document.getElementById('margin-slider').value);

    const canvas = document.getElementById('qr-code-canvas');
    const container = document.getElementById('qr-code-container');

    // Limpiar contenedor
    container.innerHTML = '';
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'qr-code-canvas';
    container.appendChild(newCanvas);

    // Opciones para el QR
    const options = {
        width: size,
        margin: margin,
        color: {
            dark: foregroundColor,
            light: backgroundColor
        },
        errorCorrectionLevel: errorLevel
    };

    // Generar QR
    QRCode.toCanvas(newCanvas, content, options, (error) => {
        if (error) {
            console.error('Error generating QR:', error);
            alert(toolTranslations[currentLanguage]['alert-generate-error']);
            return;
        }

        currentQRData = {
            content: content,
            canvas: newCanvas,
            options: options
        };

        // Mostrar sección de preview
        document.getElementById('preview-section').classList.add('active');
        
        // Scroll suave a la preview
        document.getElementById('preview-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    });
}

// Descargar código QR
function downloadQR(format) {
    // Verificar que la librería esté cargada
    if (typeof QRCode === 'undefined') {
        alert(toolTranslations[currentLanguage]['alert-library-error']);
        console.error('QRCode library not loaded');
        return;
    }

    if (!currentQRData) return;

    const content = document.getElementById('qr-content').value.trim();
    const canvas = currentQRData.canvas;

    if (format === 'png') {
        // Descargar como PNG
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-code-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');
    } else if (format === 'svg') {
        // Generar SVG
        const size = parseInt(document.getElementById('size-slider').value);
        const errorLevel = document.getElementById('error-level-select').value;
        const foregroundColor = document.getElementById('foreground-color').value;
        const backgroundColor = document.getElementById('background-color').value;
        const margin = parseInt(document.getElementById('margin-slider').value);

        const options = {
            width: size,
            margin: margin,
            color: {
                dark: foregroundColor,
                light: backgroundColor
            },
            errorCorrectionLevel: errorLevel
        };

        QRCode.toString(content, {
            type: 'svg',
            ...options
        }, (error, string) => {
            if (error) {
                console.error('Error generating SVG:', error);
                alert(toolTranslations[currentLanguage]['alert-svg-error']);
                return;
            }

            const blob = new Blob([string], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-code-${Date.now()}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }
}

