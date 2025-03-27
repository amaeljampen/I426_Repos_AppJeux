
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector("table");
    const cells = grid.getElementsByTagName("td");
    const restartButton = document.getElementById("restart");
    const scoreDisplay = document.querySelector("h1");
    let snake = [{ x: 5, y: 5 }];
    let direction = { x: 0, y: -1 };
    let food = { x: Math.floor(Math.random() * 19), y: Math.floor(Math.random() * 19) };
    let score = 0;
    let gameInterval;

    function draw() {
        for (let cell of cells) {
            cell.style.backgroundColor = "";
        }

        snake.forEach(segment => {
            let index = segment.y * 19 + segment.x;
            if (cells[index]) {
                cells[index].style.backgroundColor = "purple";
            }
        });

        let foodIndex = food.y * 19 + food.x;
        if (cells[foodIndex]) {
            cells[foodIndex].style.backgroundColor = "red";
        }
    }

    function move() {
        let newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        if (newHead.x < 0 || newHead.x >= 19 || newHead.y < 0 || newHead.y >= 19 ||
            snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            clearInterval(gameInterval);
            alert("Game Over!");
            return;
        }

        snake.unshift(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
            score++;
            scoreDisplay.innerText = score;
            food = { x: Math.floor(Math.random() * 19), y: Math.floor(Math.random() * 19) };
        } else {
            snake.pop();
        }
        draw();
    }

    function changeDirection(event) {
        switch (event.key) {
            case "ArrowUp":
                if (direction.y === 0) direction = { x: 0, y: -1 };
                break;
            case "ArrowDown":
                if (direction.y === 0) direction = { x: 0, y: 1 };
                break;
            case "ArrowLeft":
                if (direction.x === 0) direction = { x: -1, y: 0 };
                break;
            case "ArrowRight":
                if (direction.x === 0) direction = { x: 1, y: 0 };
                break;
        }
    }

    function startGame() {
        snake = [{ x: 5, y: 5 }];
        direction = { x: 0, y: -1 };
        score = 0;
        scoreDisplay.innerText = score;
        food = { x: Math.floor(Math.random() * 19), y: Math.floor(Math.random() * 19) };
        gameInterval = setInterval(move, 200);
    }

    restartButton.addEventListener("click", startGame);
    document.addEventListener("keydown", changeDirection);

    startGame();
});
