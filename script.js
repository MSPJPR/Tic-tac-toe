const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
];
let currentPlayer = "X"; // Player
let gameOver = false;

function createBoard() {
    boardElement.innerHTML = ""; // Clear the board
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = board[row][col];
            cell.addEventListener("click", makeMove);
            boardElement.appendChild(cell);
        }
    }
    updateStatus();
}

function makeMove(event) {
    if (gameOver) return; // Don't allow moves if game is over
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (board[row][col] === " ") {
        board[row][col] = currentPlayer;
        if (checkWinner(currentPlayer)) {
            statusElement.textContent = `${currentPlayer} wins!`;
            gameOver = true;
        } else if (checkDraw()) {
            statusElement.textContent = "It's a draw!";
            gameOver = true;
        } else {
            currentPlayer = "O"; // AI's turn
            aiMove();
            if (checkWinner("O")) {
                statusElement.textContent = `O wins!`;
                gameOver = true;
            } else if (checkDraw()) {
                statusElement.textContent = "It's a draw!";
                gameOver = true;
            } else {
                currentPlayer = "X"; // Back to player
            }
        }
        createBoard();
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let move;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === " ") {
                board[row][col] = "O"; // AI move
                let score = minimax(board, 0, false);
                board[row][col] = " "; // Undo move
                if (score > bestScore) {
                    bestScore = score;
                    move = { row, col };
                }
            }
        }
    }
    if (move) {
        board[move.row][move.col] = "O"; // Place AI move
    }
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinner("O") ? "O" : checkWinner("X") ? "X" : null;
    if (winner === "O") return 1;
    if (winner === "X") return -1;
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === " ") {
                    board[row][col] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[row][col] = " ";
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === " ") {
                    board[row][col] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[row][col] = " ";
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function checkWinner(player) {
    // Check rows, columns, and diagonals
    for (let i = 0; i < 3; i++) {
        if (
            board[i][0] === player &&
            board[i][1] === player &&
            board[i][2] === player
        )
            return true;
        if (
            board[0][i] === player &&
            board[1][i] === player &&
            board[2][i] === player
        )
            return true;
    }
    if (
        board[0][0] === player &&
        board[1][1] === player &&
        board[2][2] === player
    )
        return true;
    if (
        board[0][2] === player &&
        board[1][1] === player &&
        board[2][0] === player
    )
        return true;
    return false;
}

function checkDraw() {
    return board.flat().every(cell => cell !== " ");
}

function updateStatus() {
    if (gameOver) {
        resetBtn.style.display = "block";
    } else {
        resetBtn.style.display = "none";
    }
}

resetBtn.addEventListener("click", () => {
    board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
    ];
    currentPlayer = "X";
    gameOver = false;
    statusElement.textContent = "";
    createBoard();
});

createBoard();
