// --- Game State Variables ---
let secretNumber;
let attempts = 0;
let gameStartedTime;
let gameOver = false;

// --- DOM Element References ---
const guessInput = document.getElementById('guessInput');
const submitButton = document.getElementById('submitGuess');
const resultMessage = document.getElementById('resultMessage');
const attemptsCountDisplay = document.getElementById('attemptsCount');
const gameStartDisplay = document.getElementById('gameStart');
const gameEndDisplay = document.getElementById('gameEnd');
const logTableBody = document.querySelector('#logTable tbody');
const resetButton = document.getElementById('resetGame');

// --- Helper Functions ---

/**
 * Generates a random integer between min and max (inclusive).
 * @param {number} min - The minimum number.
 * @param {number} max - The maximum number.
 * @returns {number} The random integer.
 */
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formats a Date object into a readable time string (e.g., 05:30:12 PM).
 * @param {Date} date - The Date object.
 * @returns {string} The formatted time string.
 */
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Formats a Date object into a readable date and time string (e.g., Oct 4, 2025 – 5:30 PM).
 * @param {Date} date - The Date object.
 * @returns {string} The formatted date and time string.
 */
function formatDate(date) {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

/**
 * Adds a new row to the log table.
 * @param {number} attemptNum - The attempt number.
 * @param {number} guessVal - The guessed value.
 * @param {string} resultText - The result (Too High/Too Low/Correct).
 */
function addLogEntry(attemptNum, guessVal, resultText) {
    const now = new Date();
    const row = logTableBody.insertRow(0); // Insert at the top

    // Attempt #
    let cell1 = row.insertCell(0);
    cell1.textContent = `#${attemptNum}`;

    // Guess Value
    let cell2 = row.insertCell(1);
    cell2.textContent = guessVal;

    // Result
    let cell3 = row.insertCell(2);
    cell3.textContent = resultText;
    cell3.style.color = resultText.includes('Correct') ? 'green' : 'red';

    // Timestamp
    let cell4 = row.insertCell(3);
    cell4.textContent = formatTime(now);
}

// --- Main Game Functions ---

/**
 * Initializes the game state.
 */
function initializeGame() {
    secretNumber = generateRandomNumber(1, 50);
    attempts = 0;
    gameOver = false;
    gameStartedTime = new Date(); // Set game start time

    // Update DOM
    resultMessage.textContent = 'Ready to guess!';
    attemptsCountDisplay.textContent = 'Attempts: 0';
    gameStartDisplay.textContent = `Game Started: ${formatDate(gameStartedTime)}`;
    gameEndDisplay.textContent = 'Game Finished: Waiting...';
    guessInput.value = '';
    submitButton.disabled = false;
    guessInput.disabled = false;
    logTableBody.innerHTML = ''; // Clear the log table
    resetButton.style.display = 'none';
    
    console.log(`Secret Number (for debugging): ${secretNumber}`); // Keep this for easy testing
}

/**
 * Handles the user's guess submission.
 */
function checkGuess() {
    if (gameOver) return;

    const guess = parseInt(guessInput.value);

    // 1. Input Validation
    if (isNaN(guess) || guess < 1 || guess > 50) {
        alert('Please enter a valid number between 1 and 50.');
        guessInput.value = '';
        return;
    }

    // Update attempts
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
        
        // Update Game Tracking
        gameEndDisplay.textContent = `Game Finished: ${formatDate(gameEndTime)}`;
        
        // Disable input/button
        submitButton.disabled = true;
        guessInput.disabled = true;
        resetButton.style.display = 'block';

    } else if (guess > secretNumber) {
        // Too High
        resultText = 'Too High ❌';
        resultMessage.textContent = resultText;
    } else {
        // Too Low
        resultText = 'Too Low ❌';
        resultMessage.textContent = resultText;
    }
    
    // 3. Log System (Happens on every attempt)
    addLogEntry(attempts, guess, resultText);
    
    // Clear input for next guess
    guessInput.value = '';
}

// --- Event Listeners ---
submitButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', initializeGame);

// Allow pressing Enter key to submit guess
guessInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

// --- Start the game when the page loads ---
window.onload = initializeGame;