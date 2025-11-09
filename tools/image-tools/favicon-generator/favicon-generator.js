// Variables globales
let originalFile = null;
let originalImageData = null;
let generatedFavicons = {};

// Tamaños estándar de favicon
const FAVICON_SIZES = [
    { size: 16, label: '16x16 (Estándar)', default: true },
    { size: 32, label: '32x32 (Alta resolución)', default: true },
    { size: 48, label: '48x48 (Windows)', default: true },
    { size: 64, label: '64x64', default: false },
    { size: 96, label: '96x96', default: false },
    { size: 128, label: '128x128', default: false },
    { size: 180, label: '180x180 (Apple Touch)', default: false },
    { size: 192, label: '192x192 (Android)', default: false },
    { size: 256, label: '256x256', default: false },
    { size: 512, label: '512x512 (PWA)', default: false }
];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupUploadArea();
    setupSizeCheckboxes();
    setupButtons();
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

// Configurar checkboxes de tamaños
function setupSizeCheckboxes() {
    const container = document.getElementById('size-checkboxes');
    
    FAVICON_SIZES.forEach(faviconSize => {
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `size-${faviconSize.size}`;
        checkbox.value = faviconSize.size;
        checkbox.checked = faviconSize.default;
        checkbox.addEventListener('change', () => {
            if (originalImageData) {
                generateFavicons();
            }
        });
        
        const label = document.createElement('label');
        label.htmlFor = `size-${faviconSize.size}`;
        label.textContent = faviconSize.label;
        
        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);
        container.appendChild(checkboxItem);
    });
}

// Configurar botones
function setupButtons() {
    const downloadAllBtn = document.getElementById('download-all-btn');
    const resetBtn = document.getElementById('reset-btn');

    downloadAllBtn.addEventListener('click', downloadAllFavicons);
    resetBtn.addEventListener('click', resetTool);
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
            
            displayOriginalImage();
            showControls();
            generateFavicons();
        };
        image.onerror = () => {
            alert('Error al cargar la imagen. Por favor, intenta con otro archivo.');
        };
        image.src = e.target.result;
    };
    reader.onerror = () => {
        alert('Error al leer el archivo.');
    };
    reader.readAsDataURL(file);
}

// Mostrar imagen original
function displayOriginalImage() {
    const originalImage = document.getElementById('original-image');
    const originalSize = document.getElementById('original-size');
    const originalDimensions = document.getElementById('original-dimensions');
    const originalFormat = document.getElementById('original-format');

    originalImage.src = originalImageData.image.src;
    originalSize.textContent = formatFileSize(originalImageData.size);
    originalDimensions.textContent = `${originalImageData.width} × ${originalImageData.height}px`;
    originalFormat.textContent = originalImageData.type.split('/')[1].toUpperCase();
}

// Mostrar controles
function showControls() {
    document.getElementById('size-options').style.display = 'block';
    document.getElementById('preview-section').classList.add('active');
}

// Generar favicons
function generateFavicons() {
    const faviconsGrid = document.getElementById('favicons-grid');
    faviconsGrid.innerHTML = '';
    generatedFavicons = {};

    const selectedSizes = getSelectedSizes();
    
    if (selectedSizes.length === 0) {
        faviconsGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center; grid-column: 1 / -1;">Selecciona al menos un tamaño de favicon.</p>';
        return;
    }

    selectedSizes.forEach(size => {
        generateFavicon(size);
    });
}

// Obtener tamaños seleccionados
function getSelectedSizes() {
    const selectedSizes = [];
    FAVICON_SIZES.forEach(faviconSize => {
        const checkbox = document.getElementById(`size-${faviconSize.size}`);
        if (checkbox && checkbox.checked) {
            selectedSizes.push(faviconSize.size);
        }
    });
    return selectedSizes.sort((a, b) => a - b);
}

// Generar un favicon específico
function generateFavicon(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Dibujar imagen redimensionada
    ctx.drawImage(originalImageData.image, 0, 0, size, size);

    // Generar PNG
    canvas.toBlob((pngBlob) => {
        if (pngBlob) {
            const pngUrl = URL.createObjectURL(pngBlob);
            generatedFavicons[size] = {
                png: { blob: pngBlob, url: pngUrl },
                size: size
            };
            displayFavicon(size, pngUrl);
        }
    }, 'image/png');

    // Generar ICO (solo para tamaños pequeños)
    if (size <= 256) {
        generateICO(size, canvas);
    }
}

// Generar ICO
function generateICO(size, canvas) {
    // Crear un canvas temporal para el ICO
    const icoCanvas = document.createElement('canvas');
    icoCanvas.width = size;
    icoCanvas.height = size;
    const icoCtx = icoCanvas.getContext('2d');
    icoCtx.drawImage(canvas, 0, 0);

    // Convertir a ICO usando una función auxiliar
    canvasToICO(icoCanvas, size).then(icoBlob => {
        if (icoBlob && generatedFavicons[size]) {
            const icoUrl = URL.createObjectURL(icoBlob);
            generatedFavicons[size].ico = { blob: icoBlob, url: icoUrl };
        }
    });
}

// Convertir canvas a ICO
function canvasToICO(canvas, size) {
    return new Promise((resolve) => {
        // Obtener datos de imagen
        const imageData = canvas.getContext('2d').getImageData(0, 0, size, size);
        const data = imageData.data;
        
        // Crear array buffer para ICO
        const icoSize = 6 + 16 + (size * size * 4) + (size * size / 8); // Header + Directory + BMP data + Mask
        const buffer = new ArrayBuffer(icoSize);
        const view = new DataView(buffer);
        
        // ICO Header
        view.setUint16(0, 0, true); // Reserved
        view.setUint16(2, 1, true); // Type (1 = ICO)
        view.setUint16(4, 1, true); // Number of images
        
        // ICO Directory Entry
        let offset = 6;
        view.setUint8(offset, size === 256 ? 0 : size, true); // Width
        view.setUint8(offset + 1, size === 256 ? 0 : size, true); // Height
        view.setUint8(offset + 2, 0, true); // Color palette
        view.setUint8(offset + 3, 0, true); // Reserved
        view.setUint16(offset + 4, 1, true); // Color planes
        view.setUint16(offset + 6, 32, true); // Bits per pixel
        const bmpDataSize = 40 + (size * size * 4) + (size * size / 8); // BMP header + data + mask
        view.setUint32(offset + 8, bmpDataSize, true); // Image data size
        view.setUint32(offset + 12, 22, true); // Offset to image data
        
        // BMP Header (part of ICO)
        offset = 22;
        view.setUint32(offset, 40, true); // BMP header size
        view.setInt32(offset + 4, size, true); // Width
        view.setInt32(offset + 8, size * 2, true); // Height (image + mask)
        view.setUint16(offset + 12, 1, true); // Color planes
        view.setUint16(offset + 14, 32, true); // Bits per pixel
        view.setUint32(offset + 16, 0, true); // Compression
        view.setUint32(offset + 20, size * size * 4, true); // Image size
        view.setInt32(offset + 24, 0, true); // X pixels per meter
        view.setInt32(offset + 28, 0, true); // Y pixels per meter
        view.setUint32(offset + 32, 0, true); // Colors used
        view.setUint32(offset + 36, 0, true); // Important colors
        
        // Image data (BGRA format, bottom-up)
        offset = 62;
        for (let y = size - 1; y >= 0; y--) {
            for (let x = 0; x < size; x++) {
                const srcIndex = (y * size + x) * 4;
                view.setUint8(offset++, data[srcIndex + 2], true); // B
                view.setUint8(offset++, data[srcIndex + 1], true); // G
                view.setUint8(offset++, data[srcIndex], true); // R
                view.setUint8(offset++, data[srcIndex + 3], true); // A
            }
        }
        
        // Mask (1 bit per pixel, all zeros for no transparency mask)
        const maskSize = (size * size) / 8;
        for (let i = 0; i < maskSize; i++) {
            view.setUint8(offset++, 0, true);
        }
        
        const blob = new Blob([buffer], { type: 'image/x-icon' });
        resolve(blob);
    });
}

// Mostrar favicon generado
function displayFavicon(size, pngUrl) {
    const faviconsGrid = document.getElementById('favicons-grid');
    
    const faviconItem = document.createElement('div');
    faviconItem.className = 'favicon-item';
    
    const title = document.createElement('div');
    title.className = 'favicon-item-title';
    title.textContent = `${size}×${size}px`;
    
    const previewContainer = document.createElement('div');
    previewContainer.className = 'favicon-preview-container';
    
    const sizeLabel = document.createElement('div');
    sizeLabel.className = 'favicon-size-label';
    sizeLabel.textContent = 'Vista previa';
    
    const display = document.createElement('div');
    display.className = 'favicon-display';
    display.style.width = `${Math.min(size, 128)}px`;
    display.style.height = `${Math.min(size, 128)}px`;
    
    const img = document.createElement('img');
    img.src = pngUrl;
    img.width = Math.min(size, 128);
    img.height = Math.min(size, 128);
    img.alt = `Favicon ${size}x${size}`;
    
    display.appendChild(img);
    previewContainer.appendChild(sizeLabel);
    previewContainer.appendChild(display);
    
    const pngBtn = document.createElement('button');
    pngBtn.className = 'btn-primary';
    pngBtn.textContent = 'Descargar PNG';
    pngBtn.onclick = () => downloadFavicon(size, 'png');
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.width = '100%';
    buttonsContainer.appendChild(pngBtn);
    
    // Agregar botón ICO si está disponible
    if (size <= 256 && generatedFavicons[size]?.ico) {
        const icoBtn = document.createElement('button');
        icoBtn.className = 'btn-secondary';
        icoBtn.textContent = 'Descargar ICO';
        icoBtn.style.marginTop = '0.5rem';
        icoBtn.onclick = () => downloadFavicon(size, 'ico');
        buttonsContainer.appendChild(icoBtn);
    }
    
    faviconItem.appendChild(title);
    faviconItem.appendChild(previewContainer);
    faviconItem.appendChild(buttonsContainer);
    
    faviconsGrid.appendChild(faviconItem);
}

// Descargar favicon individual
function downloadFavicon(size, format) {
    const favicon = generatedFavicons[size];
    if (!favicon) return;
    
    const file = format === 'ico' ? favicon.ico : favicon.png;
    if (!file) return;
    
    const extension = format === 'ico' ? 'ico' : 'png';
    const filename = `favicon-${size}x${size}.${extension}`;
    
    const link = document.createElement('a');
    link.href = file.url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Descargar todos los favicons
function downloadAllFavicons() {
    const selectedSizes = getSelectedSizes();
    
    if (selectedSizes.length === 0) {
        alert('No hay favicons para descargar. Selecciona al menos un tamaño.');
        return;
    }
    
    // Descargar todos los PNGs
    selectedSizes.forEach((size, index) => {
        setTimeout(() => {
            if (generatedFavicons[size]?.png) {
                downloadFavicon(size, 'png');
            }
        }, index * 200); // Espaciar las descargas
    });
    
    // Descargar ICOs disponibles
    setTimeout(() => {
        selectedSizes.forEach((size, index) => {
            if (size <= 256 && generatedFavicons[size]?.ico) {
                setTimeout(() => {
                    downloadFavicon(size, 'ico');
                }, index * 200);
            }
        });
    }, selectedSizes.length * 200);
}

// Resetear herramienta
function resetTool() {
    originalFile = null;
    originalImageData = null;
    generatedFavicons = {};
    
    // Limpiar URLs de objetos
    Object.values(generatedFavicons).forEach(favicon => {
        if (favicon.png?.url) URL.revokeObjectURL(favicon.png.url);
        if (favicon.ico?.url) URL.revokeObjectURL(favicon.ico.url);
    });
    
    document.getElementById('file-input').value = '';
    document.getElementById('size-options').style.display = 'none';
    document.getElementById('preview-section').classList.remove('active');
    document.getElementById('favicons-grid').innerHTML = '';
    
    // Resetear checkboxes a valores por defecto
    FAVICON_SIZES.forEach(faviconSize => {
        const checkbox = document.getElementById(`size-${faviconSize.size}`);
        if (checkbox) {
            checkbox.checked = faviconSize.default;
        }
    });
}

// Formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

