// Variables globales
let originalFile = null;
let originalImageData = null;
let convertedBlob = null;

// Información de formatos
const formatInfo = {
    jpeg: {
        title: 'JPEG',
        description: 'Ideal para fotografías y imágenes con muchos colores. Formato con pérdida que ofrece buena compresión. No soporta transparencia.'
    },
    png: {
        title: 'PNG',
        description: 'Formato sin pérdida ideal para imágenes con transparencia, gráficos y capturas de pantalla. Archivos generalmente más grandes que JPEG.'
    },
    webp: {
        title: 'WebP',
        description: 'Formato moderno desarrollado por Google. Ofrece mejor compresión que JPEG y PNG, soporta transparencia y animación. Excelente para web.'
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupUploadArea();
    setupControls();
    updateFormatInfo('jpeg');
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
            alert('Por favor, selecciona un archivo de imagen válido.');
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
            alert('Por favor, arrastra un archivo de imagen válido.');
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
    const info = formatInfo[format];
    if (info) {
        document.getElementById('format-info-title').textContent = info.title;
        document.getElementById('format-info-text').textContent = info.description;
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
                alert('Error al convertir la imagen. Por favor, intenta de nuevo.');
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
        alert('No hay imagen convertida para descargar.');
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

