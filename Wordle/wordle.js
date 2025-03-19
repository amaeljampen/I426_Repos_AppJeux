
// pour la musique de fond
const audio1 = document.getElementById('audio1');
const audio2 = document.getElementById('audio2');

audio1.addEventListener('ended', () => {
    audio2.play();
});

audio2.addEventListener('ended', () => {
    audio1.play();
});

// Démarrer la lecture du premier fichier audio
audio1.play();
//    const key = 'QWERTZUIOPASDFGHJKLYXCVBNM'.split('');
//    const key = 'qwertzuiopasdfghjklyxcvbnm'.split('');
const key1 = 'qwertzuiop'.split('');
const key2 = 'pasdfghjkl'.split('');
const key3 = 'yxcvbnm'.split('');

// Création dynamique du tableau 5x5
const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');

// Ajouter 5 lignes et 5 colonnes pour le tableau
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        const input = document.createElement('input');
        input.style.width = '80px';
        input.style.height = '80px';
        input.type = 'text';
        input.maxLength = 1; // Limiter à une lettre
        board.appendChild(input);
    }
}

function fillEmptyCell(letter) {
    const cells = document.querySelectorAll('.board input');
    for (let cell of cells) {
        if (cell.value === '') {
            cell.value = letter;
            break;
        }
    }
}

/*
// Ajouter les boutons du clavier
const alphabet = key;
alphabet.forEach(letter => {
    const button = document.createElement('button');
    button.textContent = letter;
    button.onclick = function() {
        // Remplir la première case vide
        fillEmptyCell(letter);
    };
    keyboard.appendChild(button);
});
*/

// Ajouter les boutons du clavier
//const alphabet = key;
const alphabet = [...key1, ...key2, ...key3];
alphabet.forEach(letter => {
    const button = document.createElement('button');
    button.textContent = letter;
    button.onclick = function() {
        // Remplir la première case vide
        fillEmptyCell(letter);
    };
    keyboard.appendChild(button);
});

// Ajouter le bouton "Ajouter"
const addButton = document.createElement('button');
addButton.textContent = '';
addButton.onclick = function() {
    // Logique pour ajouter une lettre
    fillEmptyCell('A'); // Exemple: ajouter la lettre 'A'
};
keyboard.appendChild(addButton);

// Ajouter le bouton "Supprimer"
const deleteButton = document.createElement('button');
deleteButton.textContent = '';
deleteButton.onclick = function() {
    // pour supprimer la dernière lettre
    const cells = document.querySelectorAll('.board input');
    for (let i = cells.length - 1; i >= 0; i--) {
        if (cells[i].value !== '') {
            cells[i].value = '';
            break;
        }
    }
};
keyboard.appendChild(deleteButton);

addButton.style.backgroundColor = 'green';
addButton.style.color = 'white';
keyboard.appendChild(addButton);

deleteButton.style.backgroundColor = 'red';
deleteButton.style.color = 'white';
keyboard.appendChild(deleteButton);

// Fonction pour retourner à l'accueil
function goHome() {
    window.location.href = '../Accueil/accueil.html';
}

// Fonction pour recommencer la partie
function restartGame() {
    const cells = document.querySelectorAll('.board input');
    for (let cell of cells) {
        cell.value = '';
    }
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

// a supprimer plus tard
function showWinPopup() {
    document.getElementById('winPopup').style.display = 'block';
}
function showLosePopup() {
    document.getElementById('losePopup').style.display = 'block';
}
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}