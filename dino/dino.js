const dino = document.getElementById('mario');
const cactus = document.getElementById('goumba');
const gameArea = document.getElementById('game');
let lives = 3;
let isJumping = false;
let isInvincible = false; // Empêche la perte de vies immédiate après un coup

const livesDisplay = document.createElement('div');
livesDisplay.id = 'lives-display';
livesDisplay.style.position = 'absolute';
livesDisplay.style.top = '10px';
livesDisplay.style.left = '10px';
livesDisplay.style.display = 'flex';
gameArea.appendChild(livesDisplay);

updateLivesDisplay();

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isJumping) {
        jump();
    }
});

function jump() {
    isJumping = true;
    let position = 0;
    const marioHeight = dino.clientHeight;
    const jumpHeight = marioHeight * 2; // Ajustez la hauteur du saut

    dino.src = 'texture/mario_saut.png';

    let upInterval = setInterval(() => {
        if (position >= jumpHeight) {
            clearInterval(upInterval);
            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                    dino.src = 'texture/mario_marche.png';
                } else {
                    position -= marioHeight * 0.1;
                    dino.style.bottom = position + 'px';
                }
            }, 20);
        } else {
            position += marioHeight * 0.2;
            dino.style.bottom = position + 'px';
        }
    }, 20);
}

// Vérifie la collision toutes les 10ms
setInterval(() => {
    const dinoRect = dino.getBoundingClientRect();
    const cactusRect = cactus.getBoundingClientRect();

    if (!isInvincible &&
        dinoRect.left < cactusRect.right &&
        dinoRect.right > cactusRect.left &&
        dinoRect.bottom > cactusRect.top &&
        dinoRect.top < cactusRect.bottom
    ) {
        loseLife();
    }
}, 10);

function loseLife() {
    lives--;
    updateLivesDisplay();
    isInvincible = true;

    // Effet de clignotement
    let blinkInterval = setInterval(() => {
        dino.style.visibility = (dino.style.visibility === 'hidden') ? 'visible' : 'hidden';
    }, 100);

    setTimeout(() => {
        clearInterval(blinkInterval);
        dino.style.visibility = 'visible';
        isInvincible = false;
    }, 1000); // Invincibilité temporaire d'1 seconde

    if (lives === 0) {
        alert('Game Over!');
        window.location.href = `gameover.html?score=${document.getElementById('current-score').textContent.split(': ')[1]}`;
    }
}

function updateLivesDisplay() {
    livesDisplay.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('img');
        heart.src = i < lives ? 'texture/coeur_plein.png' : 'texture/coeur_vide.png';
        heart.style.width = '30px';
        heart.style.margin = '5px';
        livesDisplay.appendChild(heart);
    }
}

function goHome() {
    window.location.href = '../Accueil/accueil.html';
}
