// Traducciones específicas de Word Counter
const toolTranslations = {
    es: {
        'tool-title': 'Contador de Palabras',
        'tool-description': 'Analiza tu texto y obtén estadísticas detalladas sobre palabras, caracteres, oraciones y más.',
        'placeholder-text': 'Escribe o pega tu texto aquí...',
        'stats-title': 'Estadísticas',
        'label-words': 'Palabras',
        'label-chars-no-spaces': 'Caracteres sin espacios',
        'label-chars-with-spaces': 'Caracteres con espacios',
        'label-sentences': 'Oraciones',
        'label-paragraphs': 'Párrafos',
        'label-reading-time': 'Tiempo de lectura',
        'btn-clear': 'Limpiar Texto'
    },
    en: {
        'tool-title': 'Word Counter',
        'tool-description': 'Analyze your text and get detailed statistics about words, characters, sentences and more.',
        'placeholder-text': 'Type or paste your text here...',
        'stats-title': 'Statistics',
        'label-words': 'Words',
        'label-chars-no-spaces': 'Characters without spaces',
        'label-chars-with-spaces': 'Characters with spaces',
        'label-sentences': 'Sentences',
        'label-paragraphs': 'Paragraphs',
        'label-reading-time': 'Reading time',
        'btn-clear': 'Clear Text'
    }
};

// Word Tools - Análisis de texto
document.addEventListener('DOMContentLoaded', function() {
    initLanguageAndTheme();
    
    const textInput = document.getElementById('text-input');
    const wordCount = document.getElementById('word-count');
    const charCountNoSpaces = document.getElementById('char-count-no-spaces');
    const charCountWithSpaces = document.getElementById('char-count-with-spaces');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const readingTime = document.getElementById('reading-time');
    const clearBtn = document.getElementById('clear-btn');

    // Función para analizar el texto
    function analyzeText() {
        const text = textInput.value;
        
        // Contar palabras (separadas por espacios)
        const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
        const wordCountValue = words.length;
        
        // Contar caracteres sin espacios
        const charCountNoSpacesValue = text.replace(/\s/g, '').length;
        
        // Contar caracteres con espacios
        const charCountWithSpacesValue = text.length;
        
        // Contar oraciones (terminadas en . ! ?)
        const sentences = text.trim() === '' ? [] : text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceCountValue = sentences.length;
        
        // Contar párrafos (separados por doble salto de línea o salto de línea seguido de texto)
        const paragraphs = text.trim() === '' ? [] : text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        const paragraphCountValue = paragraphs.length || (text.trim().length > 0 ? 1 : 0);
        
        // Calcular tiempo de lectura (promedio: 200 palabras por minuto)
        const wordsPerMinute = 200;
        const minutes = Math.floor(wordCountValue / wordsPerMinute);
        const seconds = Math.floor((wordCountValue % wordsPerMinute) / (wordsPerMinute / 60));
        const readingTimeValue = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        
        // Actualizar la UI
        wordCount.textContent = wordCountValue;
        charCountNoSpaces.textContent = charCountNoSpacesValue;
        charCountWithSpaces.textContent = charCountWithSpacesValue;
        sentenceCount.textContent = sentenceCountValue;
        paragraphCount.textContent = paragraphCountValue;
        readingTime.textContent = readingTimeValue;
    }

    // Event listener para el input de texto
    textInput.addEventListener('input', analyzeText);
    textInput.addEventListener('paste', function() {
        setTimeout(analyzeText, 10);
    });

    // Event listener para el botón de limpiar
    clearBtn.addEventListener('click', function() {
        textInput.value = '';
        analyzeText();
        textInput.focus();
    });

    // Análisis inicial
    analyzeText();
});

