let targetWord = ''; // Declare targetWord as a global variable

// Load the list of words from liste_mots.txt
fetch('liste_mots.txt')
    .then(response => response.text())
    .then(data => {
        const words = data.split('\n').map(word => word.trim()).filter(word => word.length === 5);
        initializeGame(words);
    })
    .catch(error => console.error('Error loading word list:', error));

function initializeGame(words) {
    // Select a random word from the list
    targetWord = words[Math.floor(Math.random() * words.length)];
    console.log('Target word:', targetWord);

    // Your existing game initialization code here
    // For example, you can use the targetWord in your game logic
    // ...
}

// Create the 5x5 board
const board = document.getElementById('board');
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        const input = document.createElement('input');
        input.style.width = '80px';
        input.style.height = '80px';
        input.type = 'text';
        input.maxLength = 1; // Limit to one letter
        input.disabled = i !== 0; // Disable all rows except the first one
        input.dataset.row = i; // Add a data attribute to identify the row
        board.appendChild(input);
    }
}

function fillEmptyCell(letter) {
    const cells = document.querySelectorAll('.board input');
    for (let cell of cells) {
        if (cell.value === '' && !cell.disabled) {
            cell.value = letter;
            break;
        }
    }
}

// Create the keyboard
const keyboard = document.getElementById('keyboard');
const key1 = 'qwertzuiop'.split('');
const key2 = 'asdfghjkl'.split('');
const key3 = 'yxcvbnm'.split('');
const alphabet = [...key1, ...key2, ...key3];

alphabet.forEach(letter => {
    const button = document.createElement('button');
    button.textContent = letter;
    button.dataset.letter = letter; // Add data-letter attribute
    button.onclick = function() {
        fillEmptyCell(letter);
    };
    keyboard.appendChild(button);
});

// Add the "Add" button
const addButton = document.createElement('button');
addButton.textContent = 'Add';
addButton.onclick = function() {
    const cells = document.querySelectorAll('.board input');
    let enteredWord = '';
    let currentRow = -1;
    cells.forEach(cell => {
        if (!cell.disabled) {
            enteredWord += cell.value;
            currentRow = parseInt(cell.dataset.row);
        }
    });
    if (enteredWord.length === 5) {
        checkWord(enteredWord, currentRow);
    } else {
        alert('Please enter a 5-letter word.');
    }
};
keyboard.appendChild(addButton);

// Add the "Delete" button
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.onclick = function() {
    const cells = document.querySelectorAll('.board input');
    for (let i = cells.length - 1; i >= 0; i--) {
        if (cells[i].value !== '' && !cells[i].disabled) {
            cells[i].value = '';
            break;
        }
    }
};
keyboard.appendChild(deleteButton);

function checkWord(enteredWord, currentRow) {
    const targetWordArray = targetWord.split('');
    const enteredWordArray = enteredWord.split('');
    const cells = document.querySelectorAll(`.board input[data-row='${currentRow}']`);

    enteredWordArray.forEach((letter, index) => {
        const keyButton = document.querySelector(`.keyboard button[data-letter='${letter}']`);
        if (letter === targetWordArray[index]) {
            cells[index].style.backgroundColor = 'green'; // Correct letter and position
            if (keyButton) keyButton.style.backgroundColor = 'green';
        } else if (targetWordArray.includes(letter)) {
            cells[index].style.backgroundColor = 'orange'; // Correct letter but wrong position
            if (keyButton && keyButton.style.backgroundColor !== 'green') {
                keyButton.style.backgroundColor = 'orange';
            }
        } else {
            cells[index].style.backgroundColor = 'gray'; // Incorrect letter
            if (keyButton && keyButton.style.backgroundColor !== 'green' && keyButton.style.backgroundColor !== 'orange') {
                keyButton.style.backgroundColor = 'gray';
            }
        }
    });

    if (enteredWord === targetWord) {
        showWinPopup();
    } else {
        // Disable the current row
        cells.forEach(cell => cell.disabled = true);

        // Enable the next row
        const nextRow = currentRow + 1;
        if (nextRow < 5) {
            const nextRowCells = document.querySelectorAll(`.board input[data-row='${nextRow}']`);
            nextRowCells.forEach(cell => cell.disabled = false);
        }
    }
}


function showWinPopup() {
    document.getElementById('winPopup').style.display = 'block';
}
function showLosePopup() {
    document.getElementById('losePopup').style.display = 'block';
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Function to return to the home page
function goHome() {
    window.location.href = '../Accueil/accueil.html';
}

// Function to restart the game
function restartGame() {
    const cells = document.querySelectorAll('.board input');
    for (let cell of cells) {
        cell.value = '';
        cell.disabled = cell.dataset.row !== '0'; // Disable all rows except the first one
        cell.style.backgroundColor = 'white'; // Reset the background color
    }
    closePopup('winPopup'); // Close the win popup if open
    closePopup('losePopup'); // Close the lose popup if open
}

function confirmGoHome() {
    if (confirm('Êtes-vous sûr de vouloir retourner à l\'accueil ?')) {
        goHome();
    }
}

function confirmRestartGame() {
    if (confirm('Êtes-vous sûr de vouloir recommencer la partie ?')) {
        restartGame();
    }
}