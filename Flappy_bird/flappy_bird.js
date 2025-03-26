var cvs = document.getElementById("flappyBird");
var ctx = cvs.getContext("2d");

// load images

var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();
var enemy = new Image();

var enemyObj = {
    exists: false,
    x: 0,
    y: 0
}

var enemies = [];

bird.src = "textures/bird.png";
bg.src = "textures/bg.png";
fg.src = "textures/fg.png";
pipeNorth.src = "textures/pipeNorth.png";
pipeSouth.src = "textures/pipeSouth.png";
enemy.src = "textures/enemy.png";


// variables
var maxVelocity = 1.5;
var velocity = 0;
var jumpStrength = -10; 

var gap = 120;
var constant;

var bX = 10;
var bY = 150;

var gravity = 1.7;

var score = 0;

var eX = 35;
var eY = 35;

// on key down
document.addEventListener("keydown",moveUp);

function shouldSpawnEnemy() {
    chance = Math.random() < 0.5;
    return chance
}

function moveUp(){
    velocity = jumpStrength;
}

// pipe coordinates
var pipe = [];

pipe[0] = {
    x : cvs.width,
    y : -90,
    hasEnemy: shouldSpawnEnemy()
};

function getRandomEnemyY() {
    return Math.floor(Math.random() * (cvs.height - fg.height - 100)) + 50
}

function spawnEnemy() {
    enemyObj.x = ((pipe[0].x + pipeNorth.width) + pipe[1].x) / 2;
    enemyObj.y = Math.floor(Math.random() * (cvs.height - fg.height - 100)) + 50;
    enemyObj.exists = true;
}

// Reset game function
function resetGame() {
    bX = 10; // Reset bird's X coordinate
    bY = 150; // Reset bird's Y coordinate
    score = 0; // Reset score

    pipe = []; // Reset pipes array
    pipe[0] = {
        x: cvs.width,
        y: -90,
        hasEnemy: shouldSpawnEnemy()
    };

    // Reset enemy object independently
    enemyObj.exists = false;
}



// Draw images
function draw(){
    ctx.clearRect(0, 0, cvs.width, cvs.height); // Clear canvas
    
    // Draw background
    ctx.drawImage(bg, 0, 0);
    
    for(var i = 0; i < pipe.length; i++) {
        constant = pipeNorth.height + gap;
        ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
        ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);
        
        
        if (pipe[i]) {
            pipe[i].x--; // Move pipe to the left
        } else {
            console.error("pipe[i] is undefined at index:", i);
        }

        if( pipe[i].x == 125 ){
            pipe.push({
                x : cvs.width,
                y: -Math.floor(Math.random() * (pipeNorth.height / 2)),
                hasEnemy: shouldSpawnEnemy()
            });
        }

        // Detect collision with pipes
        if (
            bX + bird.width >= pipe[i].x &&
            bX <= pipe[i].x + pipeNorth.width &&
            (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant)
        ) {
            resetGame();
        }  

        // Detect collision with ground
        if (bY + bird.height >= cvs.height - fg.height) {
            resetGame();
        }
    
        /*
        if(pipe[i].x == 5){
            score++;
        }
        */
    }


    // if (!enemyObj.exists && pipe.length >= 2 && pipe[1] !== undefined) {
    
    if (pipe.length >= 2) {
        for (var i = 0; i < pipe.length - 1; i++) {
            if (!pipe[i].hasEnemy && !pipe[i + 1].hasEnemy) {
                continue;
            }

            var gapEnemyX = ((pipe[i].x + pipeNorth.width) + pipe[i + 1].x) / 2;
            if (!enemies[i]) {
                var spawnAbove = Math.random() < 0.5; 
                var enemyY;
                
                if (spawnAbove) {
                    enemyY = pipe[i].y + pipeNorth.height - eY - 5;
                    if (enemyY < 0) {
                        enemyY = 0;
                    }
                } else {
                    enemyY = pipe[i].y + constant + 5;
                    if (enemyY + eY > cvs.height - fg.height) {
                        enemyY = pipe[i].y + pipeNorth.height - eY - Math.floor(Math.random() * 5);
                    }
                }
                
                enemies[i] = {
                    x: gapEnemyX,
                    y: enemyY
                };
                console.log("Enemy created at:", enemies[i].x, enemies[i].y);
            } else {
                enemies[i].x = gapEnemyX - 15;
            }
            ctx.drawImage(enemy, enemies[i].x, enemies[i].y, eX, eY);
            if (
                bX + bird.width >= enemies[i].x &&
                bX <= enemies[i].x + eX &&
                bY + bird.height >= enemies[i].y &&
                bY <= enemies[i].y + eY
            ) {
                resetGame();
            }
        }
    }
        
    // Draw foreground
    ctx.drawImage(fg, 0, cvs.height - fg.height);

    // Draw bird
    ctx.drawImage(bird, bX, bY);

    // Apply gravity
    velocity += gravity;
    if (velocity > maxVelocity) {
        velocity = maxVelocity;
    }
    bY += velocity;

    /*
    // Draw score
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : "+score,10,cvs.height-20);
    */
    requestAnimationFrame(draw);
}

draw();
