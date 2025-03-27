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


const addButton = document.createElement('button');
addButton.textContent = 'Add';
addButton.style.backgroundColor = 'green'; // Set background color to green
addButton.style.color = 'white'; // Set text color to white
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


const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.style.backgroundColor = 'red'; // Set background color to red
deleteButton.style.color = 'white'; // Set text color to white
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

        // Check if it's the last row
        if (currentRow === 4) {
            showLosePopup();
        } else {
            // Enable the next row
            const nextRow = currentRow + 1;
            const nextRowCells = document.querySelectorAll(`.board input[data-row='${nextRow}']`);
            nextRowCells.forEach(cell => cell.disabled = false);
        }
    }
}


function showWinPopup() {
    document.getElementById('winPopup').style.display = 'block';
}
function showLosePopup() {
    const losePopup = document.getElementById('losePopup');
    losePopup.innerHTML = `
        <h2 style="font-size: 3em; background-color: red; padding: 10px; border-radius: 5px;">
            Partie perdu... <br> :( <br> Le mot était: ${targetWord}
        </h2>
        <button onclick="confirmGoHome()" style="padding: 15px 30px; font-size: 1.5em;">Accueil</button>
        <button onclick="confirmRestartGame()" style="padding: 15px 30px; font-size: 1.5em;">Recommencer</button>
        <button onclick="closePopup('losePopup')" style="position: absolute; top: 10px; right: 10px; padding: 5px 10px; font-size: 1em;">X</button>
    `;
    losePopup.style.display = 'block';
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Function to return to the home page
function goHome() {
    window.location.href = '../Accueil/accueil.html';
}


function restartGame() {
    const cells = document.querySelectorAll('.board input');
    for (let cell of cells) {
        cell.value = '';
        cell.disabled = cell.dataset.row !== '0';
        cell.style.backgroundColor = 'white';
    }

    // Reset the colors of the keyboard buttons, except "Add" and "Delete"
    const buttons = document.querySelectorAll('.keyboard button');
    buttons.forEach(button => {
        if (button.textContent !== 'Add' && button.textContent !== 'Delete') {
            button.style.backgroundColor = 'white';
        }
    });
    closePopup('winPopup');
    closePopup('losePopup');
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