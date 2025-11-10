// Variables globales
let originalFile = null;
let originalImageData = null;
let convertedBlob = null;

// Traducciones específicas de Image Converter
const toolTranslations = {
    es: {
        'tool-title': 'Conversor de Imágenes',
        'tool-description': 'Convierte tus imágenes entre diferentes formatos. Soporta JPEG, PNG, WebP y más formatos populares.',
        'upload-text': 'Arrastra y suelta tu imagen aquí',
        'upload-hint': 'o haz clic para seleccionar un archivo',
        'label-format': 'Formato de salida',
        'format-info-title': 'Información del formato',
        'format-info-text': 'Selecciona un formato para ver información',
        'label-quality': 'Calidad (solo para JPEG y WebP)',
        'preview-original': 'Imagen Original',
        'preview-converted': 'Imagen Convertida',
        'label-size': 'Tamaño:',
        'label-dimensions': 'Dimensiones:',
        'label-format-original': 'Formato:',
        'btn-download': 'Descargar Imagen Convertida',
        'btn-reset': 'Nueva Imagen',
        'alert-invalid-file': 'Por favor, selecciona un archivo de imagen válido.',
        'alert-invalid-drag': 'Por favor, arrastra un archivo de imagen válido.',
        'alert-convert-error': 'Error al convertir la imagen. Por favor, intenta de nuevo.',
        'alert-no-converted': 'No hay imagen convertida para descargar.',
        'format-jpeg-desc': 'Ideal para fotografías y imágenes con muchos colores. Formato con pérdida que ofrece buena compresión. No soporta transparencia.',
        'format-png-desc': 'Formato sin pérdida ideal para imágenes con transparencia, gráficos y capturas de pantalla. Archivos generalmente más grandes que JPEG.',
        'format-webp-desc': 'Formato moderno desarrollado por Google. Ofrece mejor compresión que JPEG y PNG, soporta transparencia y animación. Excelente para web.'
    },
    en: {
        'tool-title': 'Image Converter',
        'tool-description': 'Convert your images between different formats. Supports JPEG, PNG, WebP and more popular formats.',
        'upload-text': 'Drag and drop your image here',
        'upload-hint': 'or click to select a file',
        'label-format': 'Output Format',
        'format-info-title': 'Format Information',
        'format-info-text': 'Select a format to see information',
        'label-quality': 'Quality (JPEG and WebP only)',
        'preview-original': 'Original Image',
        'preview-converted': 'Converted Image',
        'label-size': 'Size:',
        'label-dimensions': 'Dimensions:',
        'label-format-original': 'Format:',
        'btn-download': 'Download Converted Image',
        'btn-reset': 'New Image',
        'alert-invalid-file': 'Please select a valid image file.',
        'alert-invalid-drag': 'Please drag a valid image file.',
        'alert-convert-error': 'Error converting the image. Please try again.',
        'alert-no-converted': 'No converted image to download.',
        'format-jpeg-desc': 'Ideal for photographs and images with many colors. Lossy format that offers good compression. Does not support transparency.',
        'format-png-desc': 'Lossless format ideal for images with transparency, graphics and screenshots. Files are generally larger than JPEG.',
        'format-webp-desc': 'Modern format developed by Google. Offers better compression than JPEG and PNG, supports transparency and animation. Excellent for web.'
    }
};

// Información de formatos (se actualizará según el idioma)
let formatInfo = {};

function updateFormatInfoData() {
    formatInfo = {
        jpeg: {
            title: 'JPEG',
            description: toolTranslations[currentLanguage]['format-jpeg-desc']
        },
        png: {
            title: 'PNG',
            description: toolTranslations[currentLanguage]['format-png-desc']
        },
        webp: {
            title: 'WebP',
            description: toolTranslations[currentLanguage]['format-webp-desc']
        }
    };
}

// Guardar referencia a applyLanguage original
const originalApplyLanguage = applyLanguage;

// Sobrescribir applyLanguage para incluir actualización de formato
applyLanguage = function() {
    originalApplyLanguage();
    if (typeof formatSelect !== 'undefined' && formatSelect) {
        updateFormatInfo(formatSelect.value);
    } else {
        const select = document.getElementById('format-select');
        if (select) {
            updateFormatInfo(select.value);
        }
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initLanguageAndTheme();
    updateFormatInfoData();
    setupUploadArea();
    setupControls();
    const formatSelect = document.getElementById('format-select');
    updateFormatInfo(formatSelect ? formatSelect.value : 'jpeg');
});

// Configurar área de carga
function setupUploadArea() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');

    // Click en el área de carga
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Selección de archivo
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        } else {
            alert(toolTranslations[currentLanguage]['alert-invalid-file']);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        } else {
            alert(toolTranslations[currentLanguage]['alert-invalid-drag']);
        }
    });
}

// Manejar archivo seleccionado
function handleFile(file) {
    originalFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const image = new Image();
        image.onload = () => {
            originalImageData = {
                file: file,
                image: image,
                width: image.width,
                height: image.height,
                size: file.size,
                type: file.type
            };
            
            // Detectar formato original
            const originalFormat = file.type.split('/')[1].toLowerCase();
            const formatSelect = document.getElementById('format-select');
            
            // Si el formato original está disponible, establecerlo como predeterminado
            // pero permitir cambiar a otros formatos
            if (['jpeg', 'jpg', 'png', 'webp'].includes(originalFormat)) {
                const normalizedFormat = originalFormat === 'jpg' ? 'jpeg' : originalFormat;
                // No establecer automáticamente, dejar que el usuario elija
                // formatSelect.value = normalizedFormat;
            }
            
            // Ajustar calidad inicial según formato seleccionado
            const qualitySlider = document.getElementById('quality-slider');
            const qualityValue = document.getElementById('quality-value');
            
            // Calidad por defecto alta para conversión
            qualitySlider.value = 0.9;
            qualityValue.textContent = '90%';
            
            displayOriginalImage();
            showControls();
            convertImage();
        };
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Mostrar imagen original
function displayOriginalImage() {
    const originalImg = document.getElementById('original-image');
    const originalSize = document.getElementById('original-size');
    const originalDimensions = document.getElementById('original-dimensions');
    const originalFormat = document.getElementById('original-format');

    originalImg.src = originalImageData.image.src;
    originalSize.textContent = formatFileSize(originalImageData.size);
    originalDimensions.textContent = `${originalImageData.width} × ${originalImageData.height}`;
    originalFormat.textContent = originalImageData.type.split('/')[1].toUpperCase();
}

// Mostrar controles
function showControls() {
    document.getElementById('conversion-controls').style.display = 'block';
    document.getElementById('preview-section').classList.add('active');
}

// Configurar controles
function setupControls() {
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const formatSelect = document.getElementById('format-select');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Slider de calidad
    qualitySlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        qualityValue.textContent = Math.round(value * 100) + '%';
        if (originalImageData) {
            convertImage();
        }
    });

    // Selector de formato
    formatSelect.addEventListener('change', (e) => {
        updateFormatInfo(e.target.value);
        // Ajustar visibilidad del slider de calidad
        const qualityGroup = qualitySlider.closest('.control-group');
        if (e.target.value === 'png') {
            qualityGroup.style.opacity = '0.5';
            qualityGroup.style.pointerEvents = 'none';
        } else {
            qualityGroup.style.opacity = '1';
            qualityGroup.style.pointerEvents = 'auto';
        }
        if (originalImageData) {
            convertImage();
        }
    });

    // Botón de descarga
    downloadBtn.addEventListener('click', downloadConvertedImage);

    // Botón de reset
    resetBtn.addEventListener('click', resetTool);
}

// Actualizar información del formato
function updateFormatInfo(format) {
    updateFormatInfoData();
    const info = formatInfo[format];
    if (info) {
        const titleEl = document.getElementById('format-info-title');
        const textEl = document.getElementById('format-info-text');
        if (titleEl) titleEl.textContent = info.title;
        if (textEl) textEl.textContent = info.description;
    }
}

// Convertir imagen
function convertImage() {
    if (!originalImageData) return;

    const formatSelect = document.getElementById('format-select');
    const qualitySlider = document.getElementById('quality-slider');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');

    const format = formatSelect.value;
    const quality = parseFloat(qualitySlider.value);

    progressBar.classList.add('active');
    progressFill.style.width = '0%';

    // Simular progreso
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';
        if (progress >= 90) {
            clearInterval(progressInterval);
        }
    }, 50);

    // Usar setTimeout para permitir que la UI se actualice
    setTimeout(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = originalImageData.width;
        canvas.height = originalImageData.height;

        // Dibujar imagen en el canvas
        ctx.drawImage(originalImageData.image, 0, 0);

        // Para PNG, no usar calidad (no es compatible)
        const options = format === 'png' ? undefined : quality;

        // Convertir a blob según el formato
        canvas.toBlob((blob) => {
            clearInterval(progressInterval);
            progressFill.style.width = '100%';
            
            setTimeout(() => {
                progressBar.classList.remove('active');
                progressFill.style.width = '0%';
            }, 300);

            if (blob) {
                convertedBlob = blob;
                displayConvertedImage(blob, format);
            } else {
                alert(toolTranslations[currentLanguage]['alert-convert-error']);
            }
        }, `image/${format}`, options);
    }, 100);
}

// Mostrar imagen convertida
function displayConvertedImage(blob, format) {
    const convertedImg = document.getElementById('converted-image');
    const convertedSize = document.getElementById('converted-size');
    const convertedDimensions = document.getElementById('converted-dimensions');
    const convertedFormat = document.getElementById('converted-format');

    const url = URL.createObjectURL(blob);
    convertedImg.src = url;
    convertedSize.textContent = formatFileSize(blob.size);
    convertedDimensions.textContent = `${originalImageData.width} × ${originalImageData.height}`;
    convertedFormat.textContent = format.toUpperCase();
}

// Descargar imagen convertida
function downloadConvertedImage() {
    if (!convertedBlob) {
        alert(toolTranslations[currentLanguage]['alert-no-converted']);
        return;
    }

    const formatSelect = document.getElementById('format-select');
    const format = formatSelect.value;
    const originalFileName = originalFile.name.split('.')[0];
    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `${originalFileName}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Limpiar URL después de un tiempo
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
}

// Resetear herramienta
function resetTool() {
    originalFile = null;
    originalImageData = null;
    convertedBlob = null;

    document.getElementById('file-input').value = '';
    document.getElementById('conversion-controls').style.display = 'none';
    document.getElementById('preview-section').classList.remove('active');
    document.getElementById('quality-slider').value = 0.9;
    document.getElementById('quality-value').textContent = '90%';
    document.getElementById('format-select').value = 'jpeg';
    
    // Restablecer visibilidad del slider de calidad
    const qualityGroup = document.getElementById('quality-slider').closest('.control-group');
    qualityGroup.style.opacity = '1';
    qualityGroup.style.pointerEvents = 'auto';
    
    updateFormatInfo('jpeg');
}

// Formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

