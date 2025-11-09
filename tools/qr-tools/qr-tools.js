// Variables globales
let currentQRData = null;

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
            alert('Please enter some content to generate the QR code.');
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
        alert('The QRCode library has not loaded. Please reload the page.');
        console.error('QRCode library not loaded');
        return;
    }

    const content = document.getElementById('qr-content').value.trim();
    
    if (!content) {
        alert('Please enter some content to generate the QR code.');
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
            alert('Error generating the QR code. Please try again.');
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
        alert('The QRCode library has not loaded. Please reload the page.');
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
                alert('Error generating the SVG. Please try again.');
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

