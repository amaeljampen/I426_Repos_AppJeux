let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Récupère le high-score depuis le localStorage ou 0 si aucun n'est défini

// Affiche le high-score au début du jeu
document.getElementById('high-score').textContent = `Hi: ${highScore}`;

let lives = 3;
let isJumping = false;
let isInvincible = false; // Empêche la perte de vies immédiate après un coup

const dino = document.getElementById('mario');
const cactus = document.getElementById('goumba');
const gameArea = document.getElementById('game');
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

    const jumpSound = new Audio('saut.mp3');
    jumpSound.play();

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
    const goumbaRect = goumba.getBoundingClientRect(); // Correction : utiliser "goumba" au lieu de "cactus"

    if (!isInvincible &&
        dinoRect.left < goumbaRect.right &&
        dinoRect.right > goumbaRect.left &&
        dinoRect.bottom > goumbaRect.top &&
        dinoRect.top < goumbaRect.bottom
    ) {
        // Mario perd une vie, peu importe s'il saute ou non
        loseLife();
    }
}, 10);




setInterval(updateScore, 10); // Mise à jour du score chaque 10ms (centièmes de seconde)

function updateScore() {
    score++;
    document.getElementById('current-score').textContent = `Score: ${score}`;
}

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

        // Vérification du high-score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore); // Sauvegarde du nouveau high-score
        }

        // Redirection avec score et high-score
        window.location.href = `gameover.html?score=${score}&highScore=${highScore}`;
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
