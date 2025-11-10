// Variables globales
let originalFile = null;
let originalImageData = null;
let compressedBlob = null;

// Traducciones específicas de Image Compressor
const toolTranslations = {
    es: {
        'tool-title': 'Compresor de Imágenes',
        'tool-description': 'Comprime tus imágenes sin perder calidad. Reduce el tamaño de archivo manteniendo una excelente resolución visual.',
        'upload-text': 'Arrastra y suelta tu imagen aquí',
        'upload-hint': 'o haz clic para seleccionar un archivo',
        'label-quality': 'Calidad de compresión',
        'label-format': 'Formato de salida',
        'preview-original': 'Imagen Original',
        'preview-compressed': 'Imagen Comprimida',
        'label-size': 'Tamaño:',
        'label-dimensions': 'Dimensiones:',
        'label-format-original': 'Formato:',
        'label-reduction': 'Reducción',
        'label-space-saved': 'Espacio Ahorrado',
        'label-compressed': '% Comprimido',
        'btn-download': 'Descargar Imagen Comprimida',
        'btn-reset': 'Nueva Imagen',
        'alert-invalid-file': 'Por favor, selecciona un archivo de imagen válido.',
        'alert-invalid-drag': 'Por favor, arrastra un archivo de imagen válido.',
        'alert-compress-error': 'Error al comprimir la imagen. Por favor, intenta de nuevo.',
        'alert-no-compressed': 'No hay imagen comprimida para descargar.'
    },
    en: {
        'tool-title': 'Image Compressor',
        'tool-description': 'Compress your images without losing quality. Reduce file size while maintaining excellent visual resolution.',
        'upload-text': 'Drag and drop your image here',
        'upload-hint': 'or click to select a file',
        'label-quality': 'Compression Quality',
        'label-format': 'Output Format',
        'preview-original': 'Original Image',
        'preview-compressed': 'Compressed Image',
        'label-size': 'Size:',
        'label-dimensions': 'Dimensions:',
        'label-format-original': 'Format:',
        'label-reduction': 'Reduction',
        'label-space-saved': 'Space Saved',
        'label-compressed': '% Compressed',
        'btn-download': 'Download Compressed Image',
        'btn-reset': 'New Image',
        'alert-invalid-file': 'Please select a valid image file.',
        'alert-invalid-drag': 'Please drag a valid image file.',
        'alert-compress-error': 'Error compressing the image. Please try again.',
        'alert-no-compressed': 'No compressed image to download.'
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initLanguageAndTheme();
    setupUploadArea();
    setupControls();
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
            
            // Detectar y establecer formato por defecto
            const originalFormat = file.type.split('/')[1].toLowerCase();
            const formatSelect = document.getElementById('format-select');
            
            // Establecer formato original por defecto si está disponible
            if (['jpeg', 'jpg', 'png', 'webp'].includes(originalFormat)) {
                formatSelect.value = originalFormat === 'jpg' ? 'jpeg' : originalFormat;
            }
            
            // Ajustar calidad inicial según formato
            const qualitySlider = document.getElementById('quality-slider');
            const qualityValue = document.getElementById('quality-value');
            
            if (originalFormat === 'webp' || originalFormat === 'png') {
                // Para WEBP y PNG, usar calidad más baja por defecto para mejor compresión
                qualitySlider.value = 0.6;
                qualityValue.textContent = '60%';
            } else {
                // Para JPEG, calidad media
                qualitySlider.value = 0.7;
                qualityValue.textContent = '70%';
            }
            
            displayOriginalImage();
            showControls();
            compressImage();
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
    document.getElementById('compression-controls').style.display = 'block';
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
            compressImage();
        }
    });

    // Selector de formato
    formatSelect.addEventListener('change', () => {
        if (originalImageData) {
            compressImage();
        }
    });

    // Botón de descarga
    downloadBtn.addEventListener('click', downloadCompressedImage);

    // Botón de reset
    resetBtn.addEventListener('click', resetTool);
}

// Comprimir imagen
function compressImage() {
    if (!originalImageData) return;

    const qualitySlider = document.getElementById('quality-slider');
    const formatSelect = document.getElementById('format-select');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');

    const quality = parseFloat(qualitySlider.value);
    const format = formatSelect.value;

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

        // Ajustar calidad según formato para mejor compresión
        let compressionQuality = quality;
        
        // Para WEBP, usar calidad más agresiva
        if (format === 'webp') {
            compressionQuality = Math.max(0.1, quality * 0.9); // Reducir un 10% más
        }
        // Para PNG, si es mayor a 0.9, reducirla
        else if (format === 'png' && quality > 0.9) {
            compressionQuality = 0.9;
        }

        // Convertir a blob según el formato
        canvas.toBlob((blob) => {
            clearInterval(progressInterval);
            progressFill.style.width = '100%';
            
            setTimeout(() => {
                progressBar.classList.remove('active');
                progressFill.style.width = '0%';
            }, 300);

            if (blob) {
                // Si el blob resultante es más grande que el original, intentar con menor calidad
                if (blob.size > originalImageData.size && quality > 0.1) {
                    // Intentar con calidad más baja
                    const lowerQuality = Math.max(0.1, quality - 0.2);
                    canvas.toBlob((smallerBlob) => {
                        if (smallerBlob && smallerBlob.size < originalImageData.size) {
                            compressedBlob = smallerBlob;
                            displayCompressedImage(smallerBlob, format);
                            updateStats(smallerBlob.size);
                        } else {
                            // Si aún es más grande, usar el blob original pero mostrar advertencia
                            compressedBlob = blob;
                            displayCompressedImage(blob, format);
                            updateStats(blob.size);
                        }
                    }, `image/${format}`, lowerQuality);
                } else {
                    compressedBlob = blob;
                    displayCompressedImage(blob, format);
                    updateStats(blob.size);
                }
            } else {
                alert(toolTranslations[currentLanguage]['alert-compress-error']);
            }
        }, `image/${format}`, compressionQuality);
    }, 100);
}

// Mostrar imagen comprimida
function displayCompressedImage(blob, format) {
    const compressedImg = document.getElementById('compressed-image');
    const compressedSize = document.getElementById('compressed-size');
    const compressedDimensions = document.getElementById('compressed-dimensions');
    const compressedFormat = document.getElementById('compressed-format');

    const url = URL.createObjectURL(blob);
    compressedImg.src = url;
    compressedSize.textContent = formatFileSize(blob.size);
    compressedDimensions.textContent = `${originalImageData.width} × ${originalImageData.height}`;
    compressedFormat.textContent = format.toUpperCase();
}

// Actualizar estadísticas
function updateStats(compressedSize) {
    const originalSize = originalImageData.size;
    const sizeSaved = originalSize - compressedSize;
    const compressionRatio = ((sizeSaved / originalSize) * 100).toFixed(1);
    const compressionPercentage = ((compressedSize / originalSize) * 100).toFixed(1);

    // Mostrar valores negativos si la compresión aumentó el tamaño
    const ratioElement = document.getElementById('compression-ratio');
    const savedElement = document.getElementById('size-saved');
    
    if (sizeSaved < 0) {
        ratioElement.textContent = '+' + Math.abs(compressionRatio) + '%';
        ratioElement.style.color = 'var(--accent-secondary)';
        savedElement.textContent = '+' + formatFileSize(Math.abs(sizeSaved));
        savedElement.style.color = 'var(--accent-secondary)';
    } else {
        ratioElement.textContent = compressionRatio + '%';
        ratioElement.style.color = '';
        savedElement.textContent = formatFileSize(sizeSaved);
        savedElement.style.color = '';
    }
    
    document.getElementById('compression-percentage').textContent = compressionPercentage + '%';
}

// Descargar imagen comprimida
function downloadCompressedImage() {
    if (!compressedBlob) {
        alert(toolTranslations[currentLanguage]['alert-no-compressed']);
        return;
    }

    const formatSelect = document.getElementById('format-select');
    const format = formatSelect.value;
    const originalFileName = originalFile.name.split('.')[0];
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `${originalFileName}_compressed.${format}`;
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
    compressedBlob = null;

    document.getElementById('file-input').value = '';
    document.getElementById('compression-controls').style.display = 'none';
    document.getElementById('preview-section').classList.remove('active');
    document.getElementById('quality-slider').value = 0.8;
    document.getElementById('quality-value').textContent = '80%';
    document.getElementById('format-select').value = 'jpeg';
}

// Formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

