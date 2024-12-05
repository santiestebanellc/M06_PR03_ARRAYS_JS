const BOARD_SIZE = 8;
const NUM_MINES = 10;
let board = [];
let revealedCells = 0;
let score = 0;
let gameOver = false;

function createBoard() {
    board = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        const rowArray = [];
        for (let col = 0; col < BOARD_SIZE; col++) {
            rowArray.push({ mine: false, revealed: false, number: 0 });
        }
        board.push(rowArray);
    }

    // Poner minas
    let minesPlaced = 0;
    while (minesPlaced < NUM_MINES) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);

        if (!board[row][col].mine) {
            board[row][col].mine = true;
            minesPlaced++;
        }
    }

    // Calcular numeros de las casillas
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col].mine) continue;

            let count = 0;
            const neighbors = getAdjacentCells(row, col);
            for (let i = 0; i < neighbors.length; i++) {
                const [r, c] = neighbors[i];
                if (board[r][c].mine) count++;
            }
            board[row][col].number = count;
        }
    }

    console.log("Tablero con minas:");
    for (let row = 0; row < BOARD_SIZE; row++) {
        console.log(board[row].map(cell => (cell.mine ? "M" : cell.number)).join(" "));
    }
}

function getAdjacentCells(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    const neighbors = [];
    for (let i = 0; i < directions.length; i++) {
        const [dr, dc] = directions[i];
        const r = row + dr;
        const c = col + dc;

        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
            neighbors.push([r, c]);
        }
    }
    return neighbors;
}

function revealCell(row, col) {
    if (gameOver || board[row][col].revealed) return;

    const cell = board[row][col];
    cell.revealed = true;
    revealedCells++;

    const cellElement = document.querySelector(`#cell-${row}-${col}`);
    cellElement.classList.add("revealed");

    if (cell.mine) {
        cellElement.classList.add("mine");
        cellElement.textContent = "M";
        endGame(false);
    } else if (cell.number > 0) {
        cellElement.classList.add("number");
        cellElement.textContent = cell.number;
        score += cell.number;
        document.getElementById("score").textContent = score;
    } else {
        const neighbors = getAdjacentCells(row, col);
        for (let i = 0; i < neighbors.length; i++) {
            const [r, c] = neighbors[i];
            revealCell(r, c);
        }
    }

    checkWin();
}

function checkWin() {
    if (revealedCells + NUM_MINES === BOARD_SIZE * BOARD_SIZE) {
        endGame(true);
    }
}

function markCell(row, col, event) {
    event.preventDefault();

    if (gameOver || board[row][col].revealed) return;

    const cellElement = document.querySelector(`#cell-${row}-${col}`);
    if (cellElement.classList.contains("marked")) {
        cellElement.classList.remove("marked");
        cellElement.textContent = "";
    } else {
        cellElement.classList.add("marked");
        cellElement.textContent = "⚑";
    }
}

function endGame(won) {
    gameOver = true;
    const message = won ? "Has guanyat!" : "BOOM! Has perdut!";
    setTimeout(() => alert(message), 100);

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = board[row][col];
            if (!cell.revealed) {
                const cellElement = document.querySelector(`#cell-${row}-${col}`);
                cellElement.classList.add("revealed");

                if (cell.mine) {
                    cellElement.classList.add("mine");
                    cellElement.textContent = "M";
                } else if (cell.number > 0) {
                    cellElement.classList.add("number");
                    cellElement.textContent = cell.number;
                }
            }
        }
    }
}

function initializeGame() {
    score = 0;
    revealedCells = 0;
    gameOver = false;
    document.getElementById("score").textContent = score;

    createBoard();

    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cellElement = document.createElement("div");
            cellElement.id = `cell-${row}-${col}`;
            cellElement.classList.add("cell");
            cellElement.addEventListener("click", () => revealCell(row, col));
            cellElement.addEventListener("contextmenu", (event) => markCell(row, col, event));
            boardElement.appendChild(cellElement);
        }
    }
}

document.getElementById("start").addEventListener("click", initializeGame);
