// Variables globales
let originalFile = null;
let originalImageData = null;
let scaledBlob = null;
let aspectRatio = 1;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
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
            
            // Calcular aspect ratio
            aspectRatio = image.width / image.height;
            
            // Establecer valores iniciales
            const widthInput = document.getElementById('width-input');
            const heightInput = document.getElementById('height-input');
            
            widthInput.value = image.width;
            heightInput.value = image.height;
            
            displayOriginalImage();
            showControls();
            scaleImage();
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
    document.getElementById('scaling-controls').style.display = 'block';
    document.getElementById('preview-section').classList.add('active');
}

// Configurar controles
function setupControls() {
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const maintainAspect = document.getElementById('maintain-aspect');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Inputs de dimensiones
    widthInput.addEventListener('input', (e) => {
        const width = parseInt(e.target.value);
        if (width > 0 && maintainAspect.checked && originalImageData) {
            const newHeight = Math.round(width / aspectRatio);
            heightInput.value = newHeight;
        }
        if (originalImageData) {
            scaleImage();
        }
    });

    heightInput.addEventListener('input', (e) => {
        const height = parseInt(e.target.value);
        if (height > 0 && maintainAspect.checked && originalImageData) {
            const newWidth = Math.round(height * aspectRatio);
            widthInput.value = newWidth;
        }
        if (originalImageData) {
            scaleImage();
        }
    });

    // Checkbox de mantener proporción
    maintainAspect.addEventListener('change', () => {
        if (maintainAspect.checked && originalImageData) {
            const width = parseInt(widthInput.value) || originalImageData.width;
            const newHeight = Math.round(width / aspectRatio);
            heightInput.value = newHeight;
            scaleImage();
        }
    });

    // Botones de preset
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            const [width, height] = preset.split('x').map(Number);
            
            // Remover clase active de todos los botones
            presetButtons.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            btn.classList.add('active');
            
            widthInput.value = width;
            
            if (maintainAspect.checked) {
                // Calcular altura manteniendo proporción
                const newHeight = Math.round(width / aspectRatio);
                heightInput.value = newHeight;
            } else {
                heightInput.value = height;
            }
            
            if (originalImageData) {
                scaleImage();
            }
        });
    });

    // Botón de descarga
    downloadBtn.addEventListener('click', downloadScaledImage);

    // Botón de reset
    resetBtn.addEventListener('click', resetTool);
}

// Escalar imagen
function scaleImage() {
    if (!originalImageData) return;

    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    
    let newWidth = parseInt(widthInput.value);
    let newHeight = parseInt(heightInput.value);

    // Validar dimensiones
    if (!newWidth || newWidth < 1) {
        newWidth = originalImageData.width;
        widthInput.value = newWidth;
    }
    if (!newHeight || newHeight < 1) {
        newHeight = originalImageData.height;
        heightInput.value = newHeight;
    }

    // Limitar dimensiones máximas (opcional, para evitar problemas de memoria)
    const maxDimension = 10000;
    if (newWidth > maxDimension) {
        newWidth = maxDimension;
        widthInput.value = newWidth;
    }
    if (newHeight > maxDimension) {
        newHeight = maxDimension;
        heightInput.value = newHeight;
    }

    // Crear canvas y escalar
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Usar algoritmo de alta calidad para escalado
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Dibujar imagen escalada
    ctx.drawImage(originalImageData.image, 0, 0, newWidth, newHeight);

    // Convertir a blob manteniendo el formato original
    const format = originalImageData.type.split('/')[1].toLowerCase();
    canvas.toBlob((blob) => {
        if (blob) {
            scaledBlob = blob;
            displayScaledImage(blob, newWidth, newHeight);
            updateStats(newWidth, newHeight, blob.size);
        } else {
            alert('Error al escalar la imagen. Por favor, intenta de nuevo.');
        }
    }, originalImageData.type, 0.95);
}

// Mostrar imagen escalada
function displayScaledImage(blob, width, height) {
    const scaledImg = document.getElementById('scaled-image');
    const scaledSize = document.getElementById('scaled-size');
    const scaledDimensions = document.getElementById('scaled-dimensions');
    const scaledFormat = document.getElementById('scaled-format');

    const url = URL.createObjectURL(blob);
    scaledImg.src = url;
    scaledSize.textContent = formatFileSize(blob.size);
    scaledDimensions.textContent = `${width} × ${height}`;
    scaledFormat.textContent = originalImageData.type.split('/')[1].toUpperCase();
}

// Actualizar estadísticas
function updateStats(newWidth, newHeight, scaledSize) {
    const originalWidth = originalImageData.width;
    const originalHeight = originalImageData.height;
    const originalSize = originalImageData.size;
    
    // Calcular escala
    const widthScale = ((newWidth / originalWidth) * 100).toFixed(1);
    const heightScale = ((newHeight / originalHeight) * 100).toFixed(1);
    
    // Mostrar escala promedio si es diferente
    if (widthScale === heightScale) {
        document.getElementById('scale-ratio').textContent = widthScale + '%';
    } else {
        document.getElementById('scale-ratio').textContent = `${widthScale}% × ${heightScale}%`;
    }
    
    // Cambio de tamaño
    const sizeChange = scaledSize - originalSize;
    const sizeChangePercent = ((sizeChange / originalSize) * 100).toFixed(1);
    
    const sizeChangeElement = document.getElementById('size-change');
    if (sizeChange < 0) {
        sizeChangeElement.textContent = sizeChangePercent + '%';
        sizeChangeElement.style.color = 'var(--accent-secondary)';
    } else {
        sizeChangeElement.textContent = '+' + sizeChangePercent + '%';
        sizeChangeElement.style.color = 'var(--accent-primary)';
    }
    
    // Píxeles totales
    const originalPixels = originalWidth * originalHeight;
    const newPixels = newWidth * newHeight;
    const pixelsChange = ((newPixels / originalPixels) * 100).toFixed(1);
    document.getElementById('pixels-change').textContent = pixelsChange + '%';
}

// Descargar imagen escalada
function downloadScaledImage() {
    if (!scaledBlob) {
        alert('No hay imagen escalada para descargar.');
        return;
    }

    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const newWidth = widthInput.value;
    const newHeight = heightInput.value;
    const originalFileName = originalFile.name.split('.')[0];
    const extension = originalFile.name.split('.').pop();
    const url = URL.createObjectURL(scaledBlob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `${originalFileName}_${newWidth}x${newHeight}.${extension}`;
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
    scaledBlob = null;
    aspectRatio = 1;

    document.getElementById('file-input').value = '';
    document.getElementById('scaling-controls').style.display = 'none';
    document.getElementById('preview-section').classList.remove('active');
    document.getElementById('width-input').value = '';
    document.getElementById('height-input').value = '';
    document.getElementById('maintain-aspect').checked = true;
    
    // Remover clase active de todos los botones preset
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

