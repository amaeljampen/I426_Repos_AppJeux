var board;
var score = 0;
var bestScore = localStorage.getItem("bestScore") || 0; // Récupère le meilleur score stocké
var rows = 4;
var columns = 4;

window.onload = function() {
    document.getElementById("restart").addEventListener("click", restartGame);
    document.getElementById("best-score").innerText = bestScore;
    setGame();
};

function setGame() {
    board = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 1024, 0],
        [0, 0, 0, 0]
    ];

    document.getElementById("board").innerHTML = ""; // Vide la grille
    score = 0;
    document.getElementById("score").innerText = score;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

function restartGame() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
        document.getElementById("best-score").innerText = bestScore;
    }
    
    document.getElementById("board").classList.remove("board-winner");
    setGame();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "tile";

    if (num > 0) {
        tile.innerText = num;
        tile.classList.add("x" + num);

        if (num === 2048) {
            document.getElementById("board").classList.add("board-winner");
        }
    }
}

document.addEventListener('keydown', (e) => {
    let moved = false;

    if (e.code === "ArrowLeft") moved = slideLeft();
    else if (e.code === "ArrowRight") moved = slideRight();
    else if (e.code === "ArrowUp") moved = slideUp();
    else if (e.code === "ArrowDown") moved = slideDown();

    if (moved) {
        setTimeout(setTwo, 200); // Ajoute une tuile après un petit délai
        document.getElementById("score").innerText = score;
        
        if (isGameOver()) {
            setTimeout(() => alert("Game Over!"));
        }
    }
});

function filterZero(row) {
    return row.filter(num => num !== 0);
}

function slide(row) {
    row = filterZero(row);
    
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);
    while (row.length < columns) row.push(0);
    return row;
}

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let oldRow = [...board[r]];
        board[r] = slide(board[r]);
        if (JSON.stringify(oldRow) !== JSON.stringify(board[r])) moved = true;
    }
    if (moved) updateBoard();
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let oldRow = [...board[r]];
        board[r] = slide(board[r].reverse()).reverse();
        if (JSON.stringify(oldRow) !== JSON.stringify(board[r])) moved = true;
    }
    if (moved) updateBoard();
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let oldCol = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let row = slide(oldCol);
        for (let r = 0; r < rows; r++) board[r][c] = row[r];
        if (JSON.stringify(oldCol) !== JSON.stringify(row)) moved = true;
    }
    if (moved) updateBoard();
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let oldCol = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let row = slide(oldCol.reverse()).reverse();
        for (let r = 0; r < rows; r++) board[r][c] = row[r];
        if (JSON.stringify(oldCol) !== JSON.stringify(row)) moved = true;
    }
    if (moved) updateBoard();
    return moved;
}

function updateBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) return;

    let emptyTiles = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                emptyTiles.push({ r, c });
            }
        }
    }

    if (emptyTiles.length > 0) {
        let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[r][c] = 2;
        updateBoard();
    }
}

function hasEmptyTile() {
    return board.some(row => row.includes(0));
}

function isGameOver() {
    if (hasEmptyTile()) return false; // Si une case est vide, pas de Game Over

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) return false; // Vérifie si des cases adjacentes sont égales (horizontale)
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) return false; // Vérifie si des cases adjacentes sont égales (verticale)
        }
    }


    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
        document.getElementById("best-score").innerText = bestScore;
    }
    return true; // Confirme que le jeu est terminé
}

