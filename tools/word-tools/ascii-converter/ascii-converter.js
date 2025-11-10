// Traducciones específicas de ASCII Converter
const toolTranslations = {
    es: {
        'tool-title': 'Conversor ASCII',
        'tool-description': 'Convierte entre texto, códigos ASCII, binario y crea arte ASCII estilo terminal.',
        'tab-ascii-codes': 'Códigos ASCII',
        'tab-binary': 'Binario',
        'tab-ascii-art': 'Arte ASCII',
        'label-text-to-ascii': 'Texto → Códigos ASCII',
        'label-ascii-to-text': 'Códigos ASCII → Texto',
        'label-text-to-binary': 'Texto → Binario',
        'label-binary-to-text': 'Binario → Texto',
        'label-text': 'Texto',
        'label-font': 'Fuente',
        'label-result': 'Resultado',
        'placeholder-text': 'Escribe tu texto aquí...',
        'placeholder-ascii': 'Escribe los códigos ASCII separados por espacios (ej: 72 101 108 108 111)...',
        'placeholder-binary': 'Escribe el binario separado por espacios (ej: 01001000 01100101 01101100 01101100 01101111)...',
        'placeholder-ascii-art': 'Escribe el texto para convertir a ASCII art...',
        'btn-text-to-ascii': 'Convertir Texto → ASCII',
        'btn-ascii-to-text': 'Convertir ASCII → Texto',
        'btn-text-to-binary': 'Convertir Texto → Binario',
        'btn-binary-to-text': 'Convertir Binario → Texto',
        'btn-generate-art': 'Generar ASCII Art',
        'btn-copy': 'Copiar',
        'btn-clear': 'Limpiar',
        'hint-monospace': '💡 Para que se vea correcto al pegar, usa un editor con fuente monospace (VS Code, Notepad, Terminal, etc.)',
        'alert-no-text': 'Por favor, ingresa algún texto',
        'alert-no-ascii': 'Por favor, ingresa códigos ASCII',
        'alert-invalid-ascii': 'No se encontraron códigos ASCII válidos',
        'alert-ascii-error': 'Error al convertir los códigos ASCII: ',
        'alert-no-binary': 'Por favor, ingresa código binario',
        'alert-invalid-binary': 'No se pudo convertir el binario. Asegúrate de que sea válido.',
        'alert-binary-error': 'Error al convertir el binario: ',
        'alert-library-error': 'Error: La librería de ASCII art no está cargada. Por favor, recarga la página.',
        'alert-generating': 'Generando ASCII art...',
        'alert-no-art': 'No hay ASCII art para copiar. Genera uno primero.',
        'alert-copy-error': 'Error al copiar: ',
        'alert-copied': '¡Copiado!',
        'simple-mode': '(Modo simple - fuente no disponible)'
    },
    en: {
        'tool-title': 'ASCII Converter',
        'tool-description': 'Convert between text, ASCII codes, binary and create terminal-style ASCII art.',
        'tab-ascii-codes': 'ASCII Codes',
        'tab-binary': 'Binary',
        'tab-ascii-art': 'ASCII Art',
        'label-text-to-ascii': 'Text → ASCII Codes',
        'label-ascii-to-text': 'ASCII Codes → Text',
        'label-text-to-binary': 'Text → Binary',
        'label-binary-to-text': 'Binary → Text',
        'label-text': 'Text',
        'label-font': 'Font',
        'label-result': 'Result',
        'placeholder-text': 'Type your text here...',
        'placeholder-ascii': 'Enter ASCII codes separated by spaces (e.g.: 72 101 108 108 111)...',
        'placeholder-binary': 'Enter binary separated by spaces (e.g.: 01001000 01100101 01101100 01101100 01101111)...',
        'placeholder-ascii-art': 'Enter text to convert to ASCII art...',
        'btn-text-to-ascii': 'Convert Text → ASCII',
        'btn-ascii-to-text': 'Convert ASCII → Text',
        'btn-text-to-binary': 'Convert Text → Binary',
        'btn-binary-to-text': 'Convert Binary → Text',
        'btn-generate-art': 'Generate ASCII Art',
        'btn-copy': 'Copy',
        'btn-clear': 'Clear',
        'hint-monospace': '💡 To display correctly when pasting, use an editor with monospace font (VS Code, Notepad, Terminal, etc.)',
        'alert-no-text': 'Please enter some text',
        'alert-no-ascii': 'Please enter ASCII codes',
        'alert-invalid-ascii': 'No valid ASCII codes found',
        'alert-ascii-error': 'Error converting ASCII codes: ',
        'alert-no-binary': 'Please enter binary code',
        'alert-invalid-binary': 'Could not convert binary. Make sure it is valid.',
        'alert-binary-error': 'Error converting binary: ',
        'alert-library-error': 'Error: ASCII art library is not loaded. Please reload the page.',
        'alert-generating': 'Generating ASCII art...',
        'alert-no-art': 'No ASCII art to copy. Generate one first.',
        'alert-copy-error': 'Error copying: ',
        'alert-copied': 'Copied!',
        'simple-mode': '(Simple mode - font not available)'
    }
};

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    initLanguageAndTheme();
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });

    // ASCII Codes Conversion
    const textToAsciiInput = document.getElementById('text-to-ascii-input');
    const asciiToTextInput = document.getElementById('ascii-to-text-input');
    const convertTextToAsciiBtn = document.getElementById('convert-text-to-ascii');
    const convertAsciiToTextBtn = document.getElementById('convert-ascii-to-text');
    const clearAsciiBtn = document.getElementById('clear-ascii');

    // Text to ASCII Codes
    convertTextToAsciiBtn.addEventListener('click', () => {
        const text = textToAsciiInput.value;
        if (!text) {
            alert(toolTranslations[currentLanguage]['alert-no-text']);
            return;
        }

        const asciiCodes = Array.from(text)
            .map(char => char.charCodeAt(0))
            .join(' ');

        asciiToTextInput.value = asciiCodes;
    });

    // ASCII Codes to Text
    convertAsciiToTextBtn.addEventListener('click', () => {
        const asciiString = asciiToTextInput.value.trim();
        if (!asciiString) {
            alert(toolTranslations[currentLanguage]['alert-no-ascii']);
            return;
        }

        try {
            const asciiCodes = asciiString.split(/\s+/)
                .map(code => parseInt(code.trim(), 10))
                .filter(code => !isNaN(code) && code >= 0 && code <= 255);

            if (asciiCodes.length === 0) {
                alert(toolTranslations[currentLanguage]['alert-invalid-ascii']);
                return;
            }

            const text = asciiCodes
                .map(code => String.fromCharCode(code))
                .join('');

            textToAsciiInput.value = text;
        } catch (error) {
            alert(toolTranslations[currentLanguage]['alert-ascii-error'] + error.message);
        }
    });

    // Clear ASCII
    clearAsciiBtn.addEventListener('click', () => {
        textToAsciiInput.value = '';
        asciiToTextInput.value = '';
    });

    // Binary Conversion
    const textToBinaryInput = document.getElementById('text-to-binary-input');
    const binaryToTextInput = document.getElementById('binary-to-text-input');
    const convertTextToBinaryBtn = document.getElementById('convert-text-to-binary');
    const convertBinaryToTextBtn = document.getElementById('convert-binary-to-text');
    const clearBinaryBtn = document.getElementById('clear-binary');

    // Text to Binary
    convertTextToBinaryBtn.addEventListener('click', () => {
        const text = textToBinaryInput.value;
        if (!text) {
            alert(toolTranslations[currentLanguage]['alert-no-text']);
            return;
        }

        const binary = Array.from(text)
            .map(char => {
                const binaryChar = char.charCodeAt(0).toString(2);
                // Pad to 8 bits
                return '0'.repeat(8 - binaryChar.length) + binaryChar;
            })
            .join(' ');

        binaryToTextInput.value = binary;
    });

    // Binary to Text
    convertBinaryToTextBtn.addEventListener('click', () => {
        const binaryString = binaryToTextInput.value.trim();
        if (!binaryString) {
            alert(toolTranslations[currentLanguage]['alert-no-binary']);
            return;
        }

        try {
            // Split by spaces or groups of 8 bits
            const binaryGroups = binaryString.split(/\s+/);
            const text = binaryGroups
                .map(binary => {
                    // Remove any non-binary characters
                    const cleanBinary = binary.replace(/[^01]/g, '');
                    if (cleanBinary.length === 0) return '';
                    
                    // Convert to decimal and then to character
                    const decimal = parseInt(cleanBinary, 2);
                    if (isNaN(decimal) || decimal < 0 || decimal > 255) {
                        return '';
                    }
                    return String.fromCharCode(decimal);
                })
                .filter(char => char !== '')
                .join('');

            if (text.length === 0) {
                alert(toolTranslations[currentLanguage]['alert-invalid-binary']);
                return;
            }

            textToBinaryInput.value = text;
        } catch (error) {
            alert(toolTranslations[currentLanguage]['alert-binary-error'] + error.message);
        }
    });

    // Clear Binary
    clearBinaryBtn.addEventListener('click', () => {
        textToBinaryInput.value = '';
        binaryToTextInput.value = '';
    });

    // ASCII Art
    const asciiArtText = document.getElementById('ascii-art-text');
    const asciiArtFont = document.getElementById('ascii-art-font');
    const asciiArtOutput = document.getElementById('ascii-art-output');
    const generateAsciiArtBtn = document.getElementById('generate-ascii-art');
    const copyAsciiArtBtn = document.getElementById('copy-ascii-art');
    const clearAsciiArtBtn = document.getElementById('clear-ascii-art');

    // Generate ASCII Art
    generateAsciiArtBtn.addEventListener('click', () => {
        const text = asciiArtText.value.trim();
        if (!text) {
            alert(toolTranslations[currentLanguage]['alert-no-text']);
            return;
        }

        const font = asciiArtFont.value;

        // Check if figlet is loaded
        if (typeof figlet === 'undefined') {
            alert(toolTranslations[currentLanguage]['alert-library-error']);
            return;
        }

        // Show loading state
        asciiArtOutput.textContent = toolTranslations[currentLanguage]['alert-generating'];
        generateAsciiArtBtn.disabled = true;

        // Use a CORS proxy or direct font loading
        // Try to use figlet with preloaded fonts or fetch with CORS proxy
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const fontPath = 'https://cdn.jsdelivr.net/npm/figlet@1.7.0/fonts/';
        
        // Map font names to actual font file names
        const fontMap = {
            'Standard': 'Standard',
            '3D-ASCII': '3D-ASCII',
            '3x5': '3x5',
            '5lineoblique': '5lineoblique',
            'Banner': 'Banner',
            'Big': 'Big',
            'Block': 'Block',
            'Bubble': 'Bubble',
            'Digital': 'Digital',
            'Doom': 'Doom',
            'Epic': 'Epic',
            'Graffiti': 'Graffiti',
            'Isometric1': 'Isometric1',
            'Larry 3D': 'Larry 3D',
            'Slant': 'Slant',
            'Small': 'Small',
            'Speed': 'Speed',
            'Star Wars': 'Star Wars',
            'Stop': 'Stop',
            'Sub-Zero': 'Sub-Zero'
        };
        
        const actualFont = fontMap[font] || 'Standard';
        const fontUrl = fontPath + actualFont + '.flf';
        
        // Try to load font using fetch with CORS proxy
        fetch(corsProxy + encodeURIComponent(fontUrl))
            .then(response => {
                if (!response.ok) throw new Error('Failed to load font');
                return response.text();
            })
            .then(fontData => {
                // Parse and load the font
                figlet.parseFont(actualFont, fontData);
                generateAsciiArt(actualFont);
            })
            .catch(err => {
                console.error('Error cargando fuente:', err);
                // Fallback: try to use Standard font or generate simple ASCII
                if (actualFont !== 'Standard') {
                    // Try Standard font
                    fetch(corsProxy + encodeURIComponent(fontPath + 'Standard.flf'))
                        .then(response => response.text())
                        .then(fontData => {
                            figlet.parseFont('Standard', fontData);
                            generateAsciiArt('Standard');
                        })
                        .catch(err2 => {
                            console.error('Error cargando fuente Standard:', err2);
                            // Last resort: simple ASCII art
                            generateSimpleAsciiArt();
                        });
                } else {
                    generateSimpleAsciiArt();
                }
            });

        function generateAsciiArt(useFont) {
            try {
                figlet.text(text, {
                    font: useFont,
                    horizontalLayout: 'default',
                    verticalLayout: 'default'
                }, function(err, data) {
                    generateAsciiArtBtn.disabled = false;
                    if (err) {
                        console.error('Error generando ASCII art:', err);
                        generateSimpleAsciiArt();
                        return;
                    }
                    if (data) {
                        // Normalize the ASCII art text to ensure proper formatting
                        // Remove any carriage returns, normalize line endings
                        let normalizedData = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                        
                        // Remove trailing newlines but keep the structure
                        normalizedData = normalizedData.replace(/\n+$/, '');
                        
                        // Ensure consistent spacing - replace any tabs with spaces
                        normalizedData = normalizedData.replace(/\t/g, '    ');
                        
                        // Store the normalized text
                        asciiArtOutput.textContent = normalizedData;
                    } else {
                        asciiArtOutput.textContent = '';
                    }
                });
            } catch (error) {
                generateAsciiArtBtn.disabled = false;
                generateSimpleAsciiArt();
            }
        }
        
        function generateSimpleAsciiArt() {
            // Simple fallback ASCII art generator
            generateAsciiArtBtn.disabled = false;
            const lines = [];
            const chars = text.toUpperCase().split('');
            
            // Simple block letters
            const blockLetters = {
                'A': [' ███ ', '█   █', '█████', '█   █', '█   █'],
                'B': ['████ ', '█   █', '████ ', '█   █', '████ '],
                'C': [' ███ ', '█   █', '█    ', '█   █', ' ███ '],
                'D': ['████ ', '█   █', '█   █', '█   █', '████ '],
                'E': ['█████', '█    ', '████ ', '█    ', '█████'],
                'F': ['█████', '█    ', '████ ', '█    ', '█    '],
                'G': [' ███ ', '█    ', '█  ██', '█   █', ' ███ '],
                'H': ['█   █', '█   █', '█████', '█   █', '█   █'],
                'I': ['█████', '  █  ', '  █  ', '  █  ', '█████'],
                'J': ['█████', '    █', '    █', '█   █', ' ███ '],
                'K': ['█   █', '█  █ ', '███  ', '█  █ ', '█   █'],
                'L': ['█    ', '█    ', '█    ', '█    ', '█████'],
                'M': ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
                'N': ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
                'O': [' ███ ', '█   █', '█   █', '█   █', ' ███ '],
                'P': ['████ ', '█   █', '████ ', '█    ', '█    '],
                'Q': [' ███ ', '█   █', '█   █', '█  ██', ' ████'],
                'R': ['████ ', '█   █', '████ ', '█  █ ', '█   █'],
                'S': [' ███ ', '█    ', ' ███ ', '    █', ' ███ '],
                'T': ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
                'U': ['█   █', '█   █', '█   █', '█   █', ' ███ '],
                'V': ['█   █', '█   █', '█   █', ' █ █ ', '  █  '],
                'W': ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
                'X': ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
                'Y': ['█   █', '█   █', ' █ █ ', '  █  ', '  █  '],
                'Z': ['█████', '   █ ', '  █  ', ' █   ', '█████'],
                ' ': ['     ', '     ', '     ', '     ', '     '],
                '0': [' ███ ', '█  ██', '█ █ █', '██  █', ' ███ '],
                '1': ['  █  ', ' ██  ', '  █  ', '  █  ', '█████'],
                '2': [' ███ ', '    █', ' ███ ', '█    ', '█████'],
                '3': [' ███ ', '    █', ' ███ ', '    █', ' ███ '],
                '4': ['█   █', '█   █', '█████', '    █', '    █'],
                '5': ['█████', '█    ', '████ ', '    █', '████ '],
                '6': [' ███ ', '█    ', '████ ', '█   █', ' ███ '],
                '7': ['█████', '    █', '   █ ', '  █  ', ' █   '],
                '8': [' ███ ', '█   █', ' ███ ', '█   █', ' ███ '],
                '9': [' ███ ', '█   █', ' ████', '    █', ' ███ ']
            };
            
            for (let row = 0; row < 5; row++) {
                let line = '';
                for (const char of chars) {
                    const letter = blockLetters[char] || blockLetters[' '];
                    line += letter[row] + ' ';
                }
                lines.push(line);
            }
            
            asciiArtOutput.textContent = lines.join('\n') + '\n\n' + toolTranslations[currentLanguage]['simple-mode'];
        }
    });

    // Copy ASCII Art
    copyAsciiArtBtn.addEventListener('click', () => {
        const text = asciiArtOutput.textContent;
        if (!text || text.trim() === '') {
            alert(toolTranslations[currentLanguage]['alert-no-art']);
            return;
        }

        // Get the raw text content and normalize it
        // Use innerText for better text extraction from <pre> element
        let textToCopy = asciiArtOutput.innerText || asciiArtOutput.textContent;
        
        // Normalize line endings - ensure Unix-style line endings
        textToCopy = textToCopy.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // Remove any trailing whitespace from each line but preserve leading spaces
        const lines = textToCopy.split('\n');
        const normalizedLines = lines.map(line => {
            // Remove trailing spaces but keep leading spaces (important for ASCII art alignment)
            return line.replace(/[ \t]+$/, '');
        });
        textToCopy = normalizedLines.join('\n');
        
        // Remove trailing newlines
        textToCopy = textToCopy.replace(/\n+$/, '');
        
        // Replace tabs with spaces to ensure consistent width
        textToCopy = textToCopy.replace(/\t/g, '    ');
        
        // Create a temporary textarea with monospace font to ensure proper copying
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '12px';
        textarea.style.whiteSpace = 'pre';
        textarea.style.letterSpacing = '0';
        textarea.style.wordSpacing = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (successful) {
                // Visual feedback
                const originalText = copyAsciiArtBtn.textContent;
                copyAsciiArtBtn.textContent = toolTranslations[currentLanguage]['alert-copied'];
                copyAsciiArtBtn.style.background = 'var(--accent-primary)';
                copyAsciiArtBtn.style.color = 'white';
                
                setTimeout(() => {
                    copyAsciiArtBtn.textContent = originalText;
                    copyAsciiArtBtn.style.background = '';
                    copyAsciiArtBtn.style.color = '';
                }, 2000);
            } else {
                // Fallback to clipboard API
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = copyAsciiArtBtn.textContent;
                    copyAsciiArtBtn.textContent = toolTranslations[currentLanguage]['alert-copied'];
                    copyAsciiArtBtn.style.background = 'var(--accent-primary)';
                    copyAsciiArtBtn.style.color = 'white';
                    
                    setTimeout(() => {
                        copyAsciiArtBtn.textContent = originalText;
                        copyAsciiArtBtn.style.background = '';
                        copyAsciiArtBtn.style.color = '';
                    }, 2000);
                }).catch(err => {
                    alert(toolTranslations[currentLanguage]['alert-copy-error'] + err.message);
                });
            }
        } catch (err) {
            document.body.removeChild(textarea);
            // Fallback to clipboard API
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyAsciiArtBtn.textContent;
                copyAsciiArtBtn.textContent = toolTranslations[currentLanguage]['alert-copied'];
                copyAsciiArtBtn.style.background = 'var(--accent-primary)';
                copyAsciiArtBtn.style.color = 'white';
                
                setTimeout(() => {
                    copyAsciiArtBtn.textContent = originalText;
                    copyAsciiArtBtn.style.background = '';
                    copyAsciiArtBtn.style.color = '';
                }, 2000);
            }).catch(err2 => {
                alert('Error al copiar: ' + err2.message);
            });
        }
    });

    // Clear ASCII Art
    clearAsciiArtBtn.addEventListener('click', () => {
        asciiArtText.value = 'Hello';
        asciiArtFont.value = 'Standard';
        asciiArtOutput.textContent = '';
    });

    // Auto-generate on Enter key for ASCII Art
    asciiArtText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateAsciiArtBtn.click();
        }
    });
});

