// --- Game State Variables ---
let secretNumber;
let attempts = 0;
let gameStartedTime;
let gameOver = false;
const NUMBER_OF_MCQ_OPTIONS = 5; // Cards to display at a time

// --- DOM Element References ---
const guessInput = document.getElementById('guessInput');      // Search Bar
const submitButton = document.getElementById('submitGuess');    // Submit Button
const cardsContainer = document.getElementById('guessCards'); // Card Container

const resultMessage = document.getElementById('resultMessage');
const attemptsCountDisplay = document.getElementById('attemptsCount');
const gameStartDisplay = document.getElementById('gameStart');
const gameEndDisplay = document.getElementById('gameEnd');
const logTableBody = document.querySelector('#logTable tbody');
const resetButton = document.getElementById('resetGame');

// --- Helper Functions (Time, Random Number, Logging) ---

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDate(date) {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function addLogEntry(attemptNum, guessVal, resultText) {
    const now = new Date();
    const row = logTableBody.insertRow(0); 

    row.insertCell(0).textContent = `#${attemptNum}`;
    row.insertCell(1).textContent = guessVal;
    
    let resultCell = row.insertCell(2);
    resultCell.textContent = resultText;
    resultCell.style.color = resultText.includes('Correct') ? 'green' : (resultText.includes('High') ? '#cc9900' : 'red');

    row.insertCell(3).textContent = formatTime(now);
}

// --- MCQ Option Generation Function (Same as before) ---

function generateMCQOptions() {
    const options = new Set();
    options.add(secretNumber);

    while (options.size < NUMBER_OF_MCQ_OPTIONS) {
        let randomNum = generateRandomNumber(1, 50);
        options.add(randomNum);
    }

    const shuffledOptions = Array.from(options);
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]]; 
    }
    return shuffledOptions;
}

// --- Card Generation & Update Function ---

function createGuessCards(options) {
    cardsContainer.innerHTML = '';
    options.forEach(num => {
        const card = document.createElement('div');
        card.classList.add('guess-card');
        card.textContent = num;
        card.dataset.value = num;

        // Attach the common checkGuess function, passing the card's value
        card.addEventListener('click', () => {
            if (!gameOver) {
                // Call checkGuess with the number from the card
                checkGuess(parseInt(card.dataset.value));
            }
        });
        cardsContainer.appendChild(card);
    });
}

// --- Main Game Functions ---

/**
 * Initializes the game state and UI elements.
 */
function initializeGame() {
    secretNumber = generateRandomNumber(1, 50);
    attempts = 0;
    gameOver = false;
    gameStartedTime = new Date(); 

    // Reset UI
    resultMessage.textContent = 'Enter your guess or select a card.';
    attemptsCountDisplay.textContent = 'Attempts: 0';
    gameStartDisplay.textContent = `Game Started: ${formatDate(gameStartedTime)}`;
    gameEndDisplay.textContent = 'Game Finished: Waiting...';
    logTableBody.innerHTML = ''; 
    resetButton.style.display = 'none';
    guessInput.value = '';
    guessInput.disabled = false;
    submitButton.disabled = false;

    // Generate and display initial MCQ cards
    const initialOptions = generateMCQOptions();
    createGuessCards(initialOptions);
    
    console.log(`Secret Number (for debugging): ${secretNumber}`);
}

/**
 * Main game logic, handles input validation, comparison, and logging.
 * @param {number|null} guessValue - The number guessed, either from input field or card.
 */
function checkGuess(guessValue = null) {
    if (gameOver) return;

    let guess;

    if (guessValue !== null) {
        // Guess came from a card click
        guess = guessValue;
    } else {
        // Guess came from the search bar/submit button
        guess = parseInt(guessInput.value);
        
        // 1. Input Validation for search bar
        if (isNaN(guess) || guess < 1 || guess > 50) {
            alert('Please enter a valid number between 1 and 50.');
            guessInput.value = '';
            return;
        }
        guessInput.value = ''; // Clear input after valid submission
    }

    attempts++;
    attemptsCountDisplay.textContent = `Attempts: ${attempts}`;
    
    let resultText;
    
    // 2. Game Logic
    if (guess === secretNumber) {
        // Correct Guess
        gameOver = true;
        const gameEndTime = new Date();
        
        resultText = `Correct 🎉`;
        
        resultMessage.textContent = `${resultText} You guessed in ${attempts} tries.`;
        
        // Finalize UI
        gameEndDisplay.textContent = `Game Finished: ${formatDate(gameEndTime)}`;
        guessInput.disabled = true;
        submitButton.disabled = true;
        
        // Highlight correct card (if visible) and disable all cards
        document.querySelectorAll('.guess-card').forEach(card => {
            card.classList.add('disabled');
            if (parseInt(card.dataset.value) === secretNumber) {
                card.style.backgroundColor = 'green';
            } else {
                 card.style.backgroundColor = '#6c757d'; // Dim incorrect options
            }
        });
        resetButton.style.display = 'block';

    } else {
        // Incorrect Guess (Too High/Too Low)
        resultText = guess > secretNumber ? 'Too High ❌' : 'Too Low ❌';
        resultMessage.textContent = resultText;
        
        // Regenerate new MCQ options for the next attempt
        const newOptions = generateMCQOptions();
        createGuessCards(newOptions);
    }
    
    // 3. Log System
    addLogEntry(attempts, guess, resultText);
}

// --- Event Listeners ---
submitButton.addEventListener('click', () => checkGuess(null)); // Button calls checkGuess without a value
resetButton.addEventListener('click', initializeGame);

// Allow pressing Enter key in the search bar to submit guess
guessInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkGuess(null);
    }
});

// --- Start the game when the page loads ---
window.onload = initializeGame;
