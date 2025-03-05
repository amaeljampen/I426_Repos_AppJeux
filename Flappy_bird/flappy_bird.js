var cvs = document.getElementById("flappyBird");
var ctx = cvs.getContext("2d");

// load images

var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();
var enemy = new Image();

bird.src = "Flappy_bird/textures/bird.png";
bg.src = "Flappy_bird/textures/bg.png";
fg.src = "Flappy_bird/textures/fg.png";
pipeNorth.src = "Flappy_bird/textures/pipeNorth.png";
pipeSouth.src = "Flappy_bird/textures/pipeSouth.png";
enemy.src = "Flappy_bird/textures/enemy.png"


// variables

var gap = 120;
var constant;

var bX = 10;
var bY = 150;

var gravity = 1.5;

var score = 0;

var eX = 40;
var eY = 40;

// on key down

document.addEventListener("keydown",moveUp);

function moveUp(){
    bY -= 25;
}

// pipe coordinates

var pipe = [];

pipe[0] = {
    x : cvs.width,
    y : 0,
    hasEnemy: Math.random() < 0.25
};

// draw images

function draw(){
    
    ctx.drawImage(bg,0,0);
    
    
    for(var i = 0; i < pipe.length; i++){
        constant = pipeNorth.height+gap;
        ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
        ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);

        // Draw enemy on the lower pipe
        if (pipe[i].hasEnemy) {
            var enemyX = pipe[i].x + (pipeNorth.width / 2) - (eX / 2);
            var enemyY = pipe[i].y + constant - eY;
            ctx.drawImage(enemy, enemyX, enemyY, eX, eY);
        }
        // detect collision with enemy
        if (bX + bird.width >= enemyX && bX <= enemyX + eX && bY + bird.height >= enemyY && bY <= enemyY + eY) {
            location.reload(); // reload the page
        }
        
            pipe[i].x--;

        if( pipe[i].x == 125 ){
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
            });
        }

        // detect collision

        if (bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant) || bY + bird.height >= cvs.height - fg.height || (bX + bird.width >= enemyX && bX <= enemyX + eX && bY + bird.height >= enemyY && bY <= enemyY + eY)){
            location.reload(); // reload the page
        }

        if(pipe[i].x == 5){
            score++;
        }
        
        
    }

    ctx.drawImage(fg,0,cvs.height - fg.height);
    
    ctx.drawImage(bird,bX,bY);
    
    bY += gravity;
    
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : "+score,10,cvs.height-20);
    
    requestAnimationFrame(draw);
    
}

draw();
























