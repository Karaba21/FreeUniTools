// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
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
            alert('Por favor, ingresa algún texto');
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
            alert('Por favor, ingresa códigos ASCII');
            return;
        }

        try {
            const asciiCodes = asciiString.split(/\s+/)
                .map(code => parseInt(code.trim(), 10))
                .filter(code => !isNaN(code) && code >= 0 && code <= 255);

            if (asciiCodes.length === 0) {
                alert('No se encontraron códigos ASCII válidos');
                return;
            }

            const text = asciiCodes
                .map(code => String.fromCharCode(code))
                .join('');

            textToAsciiInput.value = text;
        } catch (error) {
            alert('Error al convertir los códigos ASCII: ' + error.message);
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
            alert('Por favor, ingresa algún texto');
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
            alert('Por favor, ingresa código binario');
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
                alert('No se pudo convertir el binario. Asegúrate de que sea válido.');
                return;
            }

            textToBinaryInput.value = text;
        } catch (error) {
            alert('Error al convertir el binario: ' + error.message);
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
            alert('Por favor, ingresa algún texto');
            return;
        }

        const font = asciiArtFont.value;

        // Check if figlet is loaded
        if (typeof figlet === 'undefined') {
            alert('Error: La librería de ASCII art no está cargada. Por favor, recarga la página.');
            return;
        }

        // Show loading state
        asciiArtOutput.textContent = 'Generando ASCII art...';
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
            
            asciiArtOutput.textContent = lines.join('\n') + '\n\n(Modo simple - fuente no disponible)';
        }
    });

    // Copy ASCII Art
    copyAsciiArtBtn.addEventListener('click', () => {
        const text = asciiArtOutput.textContent;
        if (!text || text.trim() === '') {
            alert('No hay ASCII art para copiar. Genera uno primero.');
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
                copyAsciiArtBtn.textContent = '¡Copiado!';
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
                    copyAsciiArtBtn.textContent = '¡Copiado!';
                    copyAsciiArtBtn.style.background = 'var(--accent-primary)';
                    copyAsciiArtBtn.style.color = 'white';
                    
                    setTimeout(() => {
                        copyAsciiArtBtn.textContent = originalText;
                        copyAsciiArtBtn.style.background = '';
                        copyAsciiArtBtn.style.color = '';
                    }, 2000);
                }).catch(err => {
                    alert('Error al copiar: ' + err.message);
                });
            }
        } catch (err) {
            document.body.removeChild(textarea);
            // Fallback to clipboard API
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyAsciiArtBtn.textContent;
                copyAsciiArtBtn.textContent = '¡Copiado!';
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

