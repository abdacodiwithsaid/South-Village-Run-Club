document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('result');
    const buttons = document.querySelectorAll('.button'); // All buttons with class 'button'
    const clearButton = document.getElementById('clear');
    const equalsButton = document.getElementById('equals');
    const darkModeToggleButton = document.getElementById('darkModeToggle'); // Added
    const calculatorElement = document.querySelector('.calculator'); // Added

    let currentInput = '';
    let previousInput = '';
    let operator = null;
    let shouldResetDisplay = false;

    // --- Dark Mode Logic ---
    function enableDarkMode() {
        calculatorElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode-active');
        localStorage.setItem('theme', 'dark');
        darkModeToggleButton.textContent = 'Toggle Light Mode';
    }

    function disableDarkMode() {
        calculatorElement.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode-active');
        localStorage.setItem('theme', 'light');
        darkModeToggleButton.textContent = 'Toggle Dark Mode';
    }

    function toggleDarkMode() {
        if (localStorage.getItem('theme') === 'dark') {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    }

    // Check local storage for theme preference on load
    if (localStorage.getItem('theme') === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode(); // Default to light or saved light preference
    }

    darkModeToggleButton.addEventListener('click', toggleDarkMode);
    // --- End of Dark Mode Logic ---

    function updateDisplay(value) {
        if (value === undefined || value === null || value.toString().trim() === '') {
            display.value = '0';
        } else {
            display.value = value;
        }
    }

    function handleNumberClick(value) {
        if (display.value === 'Error') clearCalculator();
        if (shouldResetDisplay) {
            currentInput = '';
            shouldResetDisplay = false;
        }
        if (value === '.' && currentInput.includes('.')) return;
        currentInput += value;
        updateDisplay(currentInput || '0');
    }

    function handleOperatorClick(op) {
        if (display.value === 'Error') clearCalculator();

        if (currentInput === '' && previousInput !== '') {
            operator = op;
            updateDisplay(previousInput + ' ' + operator);
            return;
        }

        if (currentInput === '') return;

        if (previousInput !== '' && operator) {
            calculate();
            if (display.value !== 'Error') {
                 previousInput = currentInput;
                 currentInput = '';
                 operator = op;
                 shouldResetDisplay = true;
                 updateDisplay(previousInput + ' ' + operator);
            }
        } else {
            previousInput = currentInput;
            currentInput = '';
            operator = op;
            shouldResetDisplay = true;
            updateDisplay(previousInput + ' ' + operator);
        }
    }

    function calculate() {
        if (previousInput === '' || !operator) return;

        if (currentInput === '' && previousInput !== '') {
            currentInput = previousInput;
        }

        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) {
            updateDisplay('Error');
            resetCalculatorStateOnError();
            return;
        }

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    updateDisplay('Error');
                    resetCalculatorStateOnError();
                    return;
                }
                result = prev / current;
                break;
            default:
                updateDisplay('Error');
                resetCalculatorStateOnError();
                return;
        }

        result = Math.round(result * 10000000000) / 10000000000;
        updateDisplay(result.toString());

        currentInput = result.toString();
        previousInput = '';
        operator = null;
        shouldResetDisplay = true;
    }

    function clearCalculator() {
        currentInput = '';
        previousInput = '';
        operator = null;
        shouldResetDisplay = false;
        updateDisplay('0');
    }

    function resetCalculatorStateOnError() {
        previousInput = '';
        operator = null;
        shouldResetDisplay = true;
    }

    function handleBackspace() {
        if (display.value === 'Error') {
            clearCalculator();
            return;
        }
        if (shouldResetDisplay) return;

        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            updateDisplay(currentInput || '0');
        }
    }

    buttons.forEach(button => {
        // Ensure we don't add listeners to the dark mode toggle button here
        // if it also has the class 'button' but should be handled separately.
        // The current query `querySelectorAll('.button')` will include it.
        // It's fine as long as it doesn't have a `data-value` that conflicts.
        // The dark mode button does not have `data-value`.
        if (button.id === 'darkModeToggle') return; // Skip dark mode toggle here

        button.addEventListener('click', () => {
            const value = button.dataset.value;
            const btn = button;

            if (btn.classList.contains('number')) {
                handleNumberClick(value);
            } else if (btn.classList.contains('operator') && value && value !== '=') {
                handleOperatorClick(value);
            }
        });
    });

    clearButton.addEventListener('click', clearCalculator);
    equalsButton.addEventListener('click', calculate);

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        let buttonElement; // To store the corresponding button element for visual feedback

        if (key >= '0' && key <= '9') {
            handleNumberClick(key);
            buttonElement = document.querySelector(`.button[data-value="${key}"]`);
        } else if (key === '.') {
            handleNumberClick(key);
            buttonElement = document.querySelector(`.button[data-value="."]"`);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            handleOperatorClick(key);
            buttonElement = document.querySelector(`.button[data-value="${key}"]`);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculate();
            buttonElement = equalsButton;
        } else if (key === 'Escape') {
            clearCalculator();
            buttonElement = clearButton;
        } else if (key === 'Backspace') {
            handleBackspace();
            // No specific button for backspace, visual feedback might be harder
        }

        if (buttonElement) {
            buttonElement.classList.add('active'); // Use existing CSS active style
            setTimeout(() => buttonElement.classList.remove('active'), 100);
        }
    });

    updateDisplay('0');
});
