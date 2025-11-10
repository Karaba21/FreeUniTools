// Variables globales
let currentFile = null;
let currentImage = null;

// Traducciones específicas de Metadata Finder
const toolTranslations = {
    es: {
        'tool-title': 'Detector de Metadatos EXIF',
        'tool-description': 'Extrae y visualiza todos los metadatos EXIF de tus imágenes. Descubre información oculta como fecha, ubicación, cámara y más.',
        'upload-text': 'Arrastra y suelta tu imagen aquí',
        'upload-hint': 'o haz clic para seleccionar un archivo',
        'preview-title': 'Vista Previa',
        'label-size': 'Tamaño:',
        'label-dimensions': 'Dimensiones:',
        'label-format-original': 'Formato:',
        'metadata-title': 'Metadatos EXIF',
        'loading-metadata': 'Cargando metadatos...',
        'no-metadata': 'No se encontraron metadatos EXIF en esta imagen.',
        'btn-reset': 'Nueva Imagen',
        'alert-invalid-file': 'Por favor, selecciona un archivo de imagen válido.',
        'alert-invalid-drag': 'Por favor, arrastra un archivo de imagen válido.',
        'error-exif-library': 'Error: La biblioteca EXIF no se cargó correctamente. Por favor, verifica tu conexión a internet.',
        'error-reading-metadata': 'Error al leer los metadatos: ',
        'error-processing': 'Error al procesar la imagen: ',
        'no-metadata-note': 'No se encontraron metadatos EXIF en esta imagen.<br><small>Nota: Algunos servicios como WhatsApp eliminan los metadatos EXIF al enviar imágenes.</small>'
    },
    en: {
        'tool-title': 'EXIF Metadata Detector',
        'tool-description': 'Extract and visualize all EXIF metadata from your images. Discover hidden information like date, location, camera and more.',
        'upload-text': 'Drag and drop your image here',
        'upload-hint': 'or click to select a file',
        'preview-title': 'Preview',
        'label-size': 'Size:',
        'label-dimensions': 'Dimensions:',
        'label-format-original': 'Format:',
        'metadata-title': 'EXIF Metadata',
        'loading-metadata': 'Loading metadata...',
        'no-metadata': 'No EXIF metadata found in this image.',
        'btn-reset': 'New Image',
        'alert-invalid-file': 'Please select a valid image file.',
        'alert-invalid-drag': 'Please drag a valid image file.',
        'error-exif-library': 'Error: EXIF library failed to load correctly. Please check your internet connection.',
        'error-reading-metadata': 'Error reading metadata: ',
        'error-processing': 'Error processing image: ',
        'no-metadata-note': 'No EXIF metadata found in this image.<br><small>Note: Some services like WhatsApp remove EXIF metadata when sending images.</small>'
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

// Configurar controles
function setupControls() {
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', resetTool);
}

// Manejar archivo seleccionado
function handleFile(file) {
    currentFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const image = new Image();
        image.onload = () => {
            currentImage = image;
            displayPreview(file, image);
            extractMetadata(file);
        };
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Mostrar vista previa
function displayPreview(file, image) {
    const previewImg = document.getElementById('preview-image');
    const fileSize = document.getElementById('file-size');
    const imageDimensions = document.getElementById('image-dimensions');
    const imageFormat = document.getElementById('image-format');

    previewImg.src = image.src;
    fileSize.textContent = formatFileSize(file.size);
    imageDimensions.textContent = `${image.width} × ${image.height}`;
    imageFormat.textContent = file.type.split('/')[1].toUpperCase();

    // Mostrar sección de preview
    document.getElementById('preview-section').classList.add('active');
}

// Extraer metadatos EXIF
function extractMetadata(file) {
    const loadingElement = document.getElementById('loading-metadata');
    const metadataGrid = document.getElementById('metadata-grid');
    const noMetadataElement = document.getElementById('no-metadata');

    loadingElement.style.display = 'block';
    metadataGrid.style.display = 'none';
    noMetadataElement.style.display = 'none';

    // Verificar que EXIF esté disponible
    if (typeof EXIF === 'undefined') {
        loadingElement.style.display = 'none';
        noMetadataElement.innerHTML = toolTranslations[currentLanguage]['error-exif-library'];
        noMetadataElement.style.display = 'block';
        console.error('EXIF library not loaded');
        return;
    }

    try {
        EXIF.getData(file, function() {
            loadingElement.style.display = 'none';
            
            try {
                const allMetaData = EXIF.getAllTags(this);
                
                console.log('Metadatos encontrados:', allMetaData);
                
                if (Object.keys(allMetaData).length === 0) {
                    noMetadataElement.innerHTML = toolTranslations[currentLanguage]['no-metadata-note'];
                    noMetadataElement.style.display = 'block';
                    return;
                }

                // Organizar metadatos por categorías
                const metadataGroups = organizeMetadata(allMetaData);
                
                // Mostrar metadatos
                displayMetadata(metadataGroups);
            } catch (error) {
                loadingElement.style.display = 'none';
                noMetadataElement.innerHTML = toolTranslations[currentLanguage]['error-reading-metadata'] + error.message;
                noMetadataElement.style.display = 'block';
                console.error('Error reading metadata:', error);
            }
        });
    } catch (error) {
        loadingElement.style.display = 'none';
        noMetadataElement.innerHTML = toolTranslations[currentLanguage]['error-processing'] + error.message;
        noMetadataElement.style.display = 'block';
        console.error('Error processing file:', error);
    }
}

// Organizar metadatos por categorías
function organizeMetadata(metadata) {
    const groupNames = currentLanguage === 'es' ? {
        'Información de Cámara': {},
        'Configuración de Cámara': {},
        'Información de Imagen': {},
        'GPS y Ubicación': {},
        'Fecha y Hora': {},
        'Otros': {}
    } : {
        'Camera Information': {},
        'Camera Settings': {},
        'Image Information': {},
        'GPS and Location': {},
        'Date and Time': {},
        'Other': {}
    };
    const groups = groupNames;

    // Mapeo de campos EXIF a categorías
    const cameraInfo = [
        'Make', 'Model', 'Software', 'Artist', 'Copyright'
    ];
    
    const cameraSettings = [
        'ExposureTime', 'FNumber', 'ISO', 'FocalLength', 'Flash',
        'WhiteBalance', 'MeteringMode', 'ExposureMode', 'ExposureProgram',
        'ApertureValue', 'ShutterSpeedValue', 'BrightnessValue'
    ];
    
    const imageInfo = [
        'ImageWidth', 'ImageHeight', 'Orientation', 'ColorSpace',
        'XResolution', 'YResolution', 'ResolutionUnit', 'Compression'
    ];
    
    const gpsInfo = [
        'GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSLatitudeRef',
        'GPSLongitudeRef', 'GPSAltitudeRef', 'GPSTimeStamp', 'GPSDateStamp'
    ];
    
    const dateInfo = [
        'DateTime', 'DateTimeOriginal', 'DateTimeDigitized'
    ];

    // Organizar metadatos
    for (const [key, value] of Object.entries(metadata)) {
        let categorized = false;

        const cameraGroup = currentLanguage === 'es' ? 'Información de Cámara' : 'Camera Information';
        const settingsGroup = currentLanguage === 'es' ? 'Configuración de Cámara' : 'Camera Settings';
        const imageGroup = currentLanguage === 'es' ? 'Información de Imagen' : 'Image Information';
        const gpsGroup = currentLanguage === 'es' ? 'GPS y Ubicación' : 'GPS and Location';
        const dateGroup = currentLanguage === 'es' ? 'Fecha y Hora' : 'Date and Time';
        const otherGroup = currentLanguage === 'es' ? 'Otros' : 'Other';
        
        if (cameraInfo.includes(key)) {
            groups[cameraGroup][key] = value;
            categorized = true;
        } else if (cameraSettings.includes(key)) {
            groups[settingsGroup][key] = value;
            categorized = true;
        } else if (imageInfo.includes(key)) {
            groups[imageGroup][key] = value;
            categorized = true;
        } else if (gpsInfo.includes(key)) {
            groups[gpsGroup][key] = value;
            categorized = true;
        } else if (dateInfo.includes(key)) {
            groups[dateGroup][key] = value;
            categorized = true;
        }

        if (!categorized) {
            groups[otherGroup][key] = value;
        }
    }

    // Eliminar grupos vacíos
    for (const key in groups) {
        if (Object.keys(groups[key]).length === 0) {
            delete groups[key];
        }
    }

    return groups;
}

// Mostrar metadatos
function displayMetadata(metadataGroups) {
    const metadataGrid = document.getElementById('metadata-grid');
    metadataGrid.innerHTML = '';
    metadataGrid.style.display = 'grid';

    for (const [groupName, metadata] of Object.entries(metadataGroups)) {
        const groupElement = document.createElement('div');
        groupElement.className = 'metadata-group';

        const groupTitle = document.createElement('div');
        groupTitle.className = 'metadata-group-title';
        groupTitle.textContent = groupName;
        groupElement.appendChild(groupTitle);

        for (const [key, value] of Object.entries(metadata)) {
            const itemElement = document.createElement('div');
            itemElement.className = 'metadata-item';

            const labelElement = document.createElement('div');
            labelElement.className = 'metadata-label';
            labelElement.textContent = formatMetadataLabel(key);
            itemElement.appendChild(labelElement);

            const valueElement = document.createElement('div');
            valueElement.className = 'metadata-value';
            valueElement.textContent = formatMetadataValue(key, value);
            itemElement.appendChild(valueElement);

            groupElement.appendChild(itemElement);
        }

        metadataGrid.appendChild(groupElement);
    }
}

// Formatear etiqueta de metadato
function formatMetadataLabel(key) {
    const labels = {
        'Make': 'Fabricante',
        'Model': 'Modelo',
        'Software': 'Software',
        'Artist': 'Artista',
        'Copyright': 'Copyright',
        'ExposureTime': 'Tiempo de Exposición',
        'FNumber': 'Apertura (f/)',
        'ISO': 'ISO',
        'FocalLength': 'Distancia Focal',
        'Flash': 'Flash',
        'WhiteBalance': 'Balance de Blancos',
        'MeteringMode': 'Modo de Medición',
        'ExposureMode': 'Modo de Exposición',
        'ExposureProgram': 'Programa de Exposición',
        'ApertureValue': 'Valor de Apertura',
        'ShutterSpeedValue': 'Velocidad de Obturación',
        'BrightnessValue': 'Valor de Brillo',
        'ImageWidth': 'Ancho',
        'ImageHeight': 'Alto',
        'Orientation': 'Orientación',
        'ColorSpace': 'Espacio de Color',
        'XResolution': 'Resolución X',
        'YResolution': 'Resolución Y',
        'ResolutionUnit': 'Unidad de Resolución',
        'Compression': 'Compresión',
        'GPSLatitude': 'Latitud',
        'GPSLongitude': 'Longitud',
        'GPSAltitude': 'Altitud',
        'GPSLatitudeRef': 'Referencia Latitud',
        'GPSLongitudeRef': 'Referencia Longitud',
        'GPSAltitudeRef': 'Referencia Altitud',
        'GPSTimeStamp': 'Hora GPS',
        'GPSDateStamp': 'Fecha GPS',
        'DateTime': 'Fecha y Hora',
        'DateTimeOriginal': 'Fecha Original',
        'DateTimeDigitized': 'Fecha Digitalizada'
    };

    return labels[key] || key;
}

// Formatear valor de metadato
function formatMetadataValue(key, value) {
    // Valores especiales
    if (key === 'ExposureTime') {
        if (value < 1) {
            return `1/${Math.round(1 / value)}s`;
        }
        return `${value}s`;
    }

    if (key === 'FNumber') {
        return `f/${value}`;
    }

    if (key === 'FocalLength') {
        return `${value}mm`;
    }

    if (key === 'Flash') {
        const flashValues = {
            0: 'No disparado',
            1: 'Disparado',
            5: 'Disparado, retorno no detectado',
            7: 'Disparado, retorno detectado',
            9: 'Disparado, modo obligatorio',
            13: 'Disparado, modo obligatorio, retorno no detectado',
            15: 'Disparado, modo obligatorio, retorno detectado',
            16: 'No disparado, modo obligatorio',
            24: 'No disparado, modo automático',
            25: 'Disparado, modo automático',
            29: 'Disparado, modo automático, retorno no detectado',
            31: 'Disparado, modo automático, retorno detectado',
            32: 'Sin función flash',
            65: 'Disparado, modo de relleno',
            69: 'Disparado, modo de relleno, retorno no detectado',
            71: 'Disparado, modo de relleno, retorno detectado',
            73: 'Disparado, modo de relleno obligatorio',
            77: 'Disparado, modo de relleno obligatorio, retorno no detectado',
            79: 'Disparado, modo de relleno obligatorio, retorno detectado',
            89: 'Disparado, modo automático, flash desactivado',
            93: 'Disparado, modo automático, flash desactivado, retorno no detectado',
            95: 'Disparado, modo automático, flash desactivado, retorno detectado'
        };
        return flashValues[value] || `Desconocido (${value})`;
    }

    if (key === 'WhiteBalance') {
        return value === 0 ? 'Automático' : 'Manual';
    }

    if (key === 'MeteringMode') {
        const meteringModes = {
            0: 'Desconocido',
            1: 'Promedio',
            2: 'Ponderado central',
            3: 'Punto',
            4: 'Multi-punto',
            5: 'Multi-segmento',
            6: 'Parcial',
            255: 'Otro'
        };
        return meteringModes[value] || `Desconocido (${value})`;
    }

    if (key === 'ExposureMode') {
        const exposureModes = {
            0: 'Automático',
            1: 'Manual',
            2: 'Bracketing automático'
        };
        return exposureModes[value] || `Desconocido (${value})`;
    }

    if (key === 'ExposureProgram') {
        const programs = {
            0: 'No definido',
            1: 'Manual',
            2: 'Normal',
            3: 'Prioridad de apertura',
            4: 'Prioridad de obturación',
            5: 'Modo creativo',
            6: 'Modo acción',
            7: 'Modo retrato',
            8: 'Modo paisaje'
        };
        return programs[value] || `Desconocido (${value})`;
    }

    if (key === 'Orientation') {
        const orientations = {
            1: 'Normal',
            2: 'Espejo horizontal',
            3: 'Rotación 180°',
            4: 'Espejo vertical',
            5: 'Espejo horizontal + Rotación 90° CCW',
            6: 'Rotación 90° CW',
            7: 'Espejo horizontal + Rotación 90° CW',
            8: 'Rotación 90° CCW'
        };
        return orientations[value] || `Desconocido (${value})`;
    }

    if (key === 'ColorSpace') {
        return value === 1 ? 'sRGB' : `Desconocido (${value})`;
    }

    if (key === 'GPSLatitude' || key === 'GPSLongitude') {
        if (Array.isArray(value)) {
            const degrees = value[0] || 0;
            const minutes = value[1] || 0;
            const seconds = value[2] || 0;
            return `${degrees}° ${minutes}' ${seconds.toFixed(2)}"`;
        }
        return value.toString();
    }

    if (key === 'GPSAltitude') {
        return `${value}m`;
    }

    if (key === 'XResolution' || key === 'YResolution') {
        return `${value} dpi`;
    }

    if (key === 'ResolutionUnit') {
        const units = {
            1: 'Sin unidad',
            2: 'Pulgadas',
            3: 'Centímetros'
        };
        return units[value] || `Desconocido (${value})`;
    }

    if (key === 'Compression') {
        const compressions = {
            1: 'Sin compresión',
            6: 'JPEG'
        };
        return compressions[value] || `Desconocido (${value})`;
    }

    // Arrays
    if (Array.isArray(value)) {
        return value.join(', ');
    }

    // Números con decimales
    if (typeof value === 'number') {
        if (Number.isInteger(value)) {
            return value.toString();
        }
        return value.toFixed(2);
    }

    return value.toString();
}

// Resetear herramienta
function resetTool() {
    currentFile = null;
    currentImage = null;

    document.getElementById('file-input').value = '';
    document.getElementById('preview-section').classList.remove('active');
    document.getElementById('metadata-grid').innerHTML = '';
    document.getElementById('loading-metadata').style.display = 'none';
    document.getElementById('no-metadata').style.display = 'none';
}

// Formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

