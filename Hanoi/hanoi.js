let towers = [[], [], []];
let numDiscs = 3;

function renderTowers() {
    for (let i = 0; i < 3; i++) {
        const towerElement = document.getElementById(`tower${i + 1}`);
        towerElement.innerHTML = "";
        towers[i].forEach(disc => {
            const discElement = document.createElement("div");
            discElement.classList.add("disc");
            discElement.setAttribute("data-size", disc);
            towerElement.appendChild(discElement);
        });
    }
}

function initializeGame() {
    towers = [[], [], []];
    for (let i = numDiscs; i >= 1; i--) {
        towers[0].push(i);
    }
    renderTowers();
}

function moveDisc(from, to) {
    if (towers[from].length === 0) {
        alert("No hi ha discos en aquesta torre!");
        return;
    }
    const disc = towers[from][towers[from].length - 1];
    if (towers[to].length > 0 && towers[to][towers[to].length - 1] < disc) {
        alert("No pots moure un disc més gran sobre un més petit!");
        return;
    }
    towers[from].pop();
    towers[to].push(disc);
    renderTowers();
    checkWin();
}

function checkWin() {
    if (towers[2].length === numDiscs) {
        alert("Has guanyat!");
    }
}

function solveHanoi(n, from, to, aux) {
    const moves = [];

    function generateMoves(n, from, to, aux) {
        if (n === 0) return;
        generateMoves(n - 1, from, aux, to);
        moves.push({ from, to });
        generateMoves(n - 1, aux, to, from);
    }

    generateMoves(n, from, to, aux);

    let i = 0;
    function executeMove() {
        if (i < moves.length) {
            const { from, to } = moves[i];
            moveDisc(from, to);
            i++;
            setTimeout(executeMove, 500);
        }
    }

    executeMove();
}

document.getElementById("start").addEventListener("click", () => {
    numDiscs = parseInt(document.getElementById("numDiscs").value);
    if (numDiscs < 1 || numDiscs > 5) {
        alert("Selecciona un número entre 1 i 5!");
        return;
    }
    initializeGame();
});

const buttons = document.querySelectorAll("#controls button");
buttons.forEach((button, index) => {
    const from = Math.floor(index / 2);
    const to = index % 2 === 0 ? (from + 1) % 3 : (from + 2) % 3;

    button.addEventListener("click", () => {
        moveDisc(from, to);
    });
});

document.getElementById("solve").addEventListener("click", () => {
    solveHanoi(numDiscs, 0, 2, 1);
});
