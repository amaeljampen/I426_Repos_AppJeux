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
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
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
    tile.classList.value = "tile";
    tile.classList.add("x" + num);
    
    if (num > 0) {
        tile.innerText = num;  // Affiche uniquement les chiffres > 0
    } else {
        tile.innerText = "";  // Supprime l'affichage du "0"
    }
}

document.addEventListener('keydown', (e) => {
    let moved = false;

    if (e.code === "ArrowLeft") moved = slideLeft();
    else if (e.code === "ArrowRight") moved = slideRight();
    else if (e.code === "ArrowUp") moved = slideUp();
    else if (e.code === "ArrowDown") moved = slideDown();

    if (moved) {
        setTimeout(() => {
            setTwo(); // Ajoute une nouvelle tuile
            if (isGameOver()) return; // Vérifie immédiatement si la partie est finie
            document.getElementById("score").innerText = score;
        }, 200);
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
        board[r][c] = Math.random() < 0.9 ? 2 : 4; // 90% de chance d'un "2", 10% d'un "4"
        updateBoard();
    }
}

function hasEmptyTile() {
    return board.some(row => row.includes(0));
}

function isGameOver() {
    if (hasEmptyTile()) return false; // S'il reste des cases vides, ce n'est pas fini.

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) return false; // Vérifie les cases adjacentes horizontalement
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) return false; // Vérifie les cases adjacentes verticalement
        }
    }

    // Mise à jour du meilleur score avant d'afficher le message de Game Over
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
        document.getElementById("best-score").innerText = bestScore;
    }

    // Affichage immédiat du message Game Over
    setTimeout(() => {
        alert("Game Over! Votre score : " + score);
        restartGame();
    }, 300);

    return true; // Indique que le jeu est terminé
}
