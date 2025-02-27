const dino = document.getElementById('mario');
const cactus = document.getElementById('goumba');
const gameArea = document.getElementById('game');
let isJumping = false;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isJumping) {
        jump();
    }
});

function jump() {
    isJumping = true;
    let position = 0;
    const marioHeight = dino.clientHeight;
    const jumpHeight = marioHeight * 2; // Adjust the multiplier as needed

    // Change Mario's image to the jumping image
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
                    position -= marioHeight * 0.1; // ajuste la vitesse vers le bas du saut
                    dino.style.bottom = position + 'px';
                }
            }, 20);
        } else {
            position += marioHeight * 0.2; // ajuste la vitesse vers le haut du saut
            dino.style.bottom = position + 'px';
        }
    }, 20);
}

setInterval(() => {
    const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
    const cactusRight = parseInt(window.getComputedStyle(cactus).getPropertyValue('right'));

    if (cactusRight > 0 && cactusRight < gameArea.clientWidth * 0.04 && dinoBottom <= gameArea.clientHeight * 0.04) {
        alert('Game Over!');
    }
}, 10);