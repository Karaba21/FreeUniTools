// Word Tools - Análisis de texto
document.addEventListener('DOMContentLoaded', function() {
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

