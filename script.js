const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("statusText");
const turnBadge = document.getElementById("turnBadge");

const xScoreElement = document.getElementById("xScore");
const oScoreElement = document.getElementById("oScore");

const xCard = document.getElementById("xCard");
const oCard = document.getElementById("oCard");

const roundTitle = document.getElementById("roundTitle");
const newRoundButton = document.getElementById("newRound");
const resetGameButton = document.getElementById("resetGame");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let xScore = 0;
let oScore = 0;
let roundNumber = 1;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function updateTurnDisplay() {
    turnBadge.textContent = currentPlayer + "'S TURN";

    xCard.classList.toggle("active", currentPlayer === "X");
    oCard.classList.toggle("active", currentPlayer === "O");
}

function handleCellClick(event) {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    if (!gameActive || board[index] !== "") {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.setAttribute("aria-label", `Position ${index + 1}, ${currentPlayer}`);

    checkResult();
}

function checkResult() {
    let winningCombination = null;

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            winningCombination = combination;
            break;
        }
    }

    if (winningCombination) {
        finishGame(winningCombination);
        return;
    }

    if (board.every(cell => cell !== "")) {
        gameActive = false;
        statusText.textContent = "It's a draw! Great match!";
        turnBadge.textContent = "DRAW";
        xCard.classList.remove("active");
        oCard.classList.remove("active");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusText.textContent =
        currentPlayer === "X"
            ? "Player One, it's your turn!"
            : "Player Two, it's your turn!";

    updateTurnDisplay();
}

function finishGame(winningCombination) {
    gameActive = false;

    winningCombination.forEach(index => {
        cells[index].classList.add("winner");
    });

    if (currentPlayer === "X") {
        xScore++;
        xScoreElement.textContent = xScore;
        statusText.textContent = "🎉 Player One (X) wins!";
    } else {
        oScore++;
        oScoreElement.textContent = oScore;
        statusText.textContent = "🎉 Player Two (O) wins!";
    }

    turnBadge.textContent = currentPlayer + " WINS!";
    xCard.classList.toggle("active", currentPlayer === "X");
    oCard.classList.toggle("active", currentPlayer === "O");
}

function startNewRound() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    roundNumber++;
    roundTitle.textContent = "Round " + String(roundNumber).padStart(2, "0");

    cells.forEach((cell, index) => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner");
        cell.setAttribute("aria-label", `Position ${index + 1}, empty`);
    });

    statusText.textContent = "Player One, it's your turn!";
    updateTurnDisplay();
}

function resetScores() {
    xScore = 0;
    oScore = 0;
    roundNumber = 1;

    xScoreElement.textContent = "0";
    oScoreElement.textContent = "0";

    startNewRound();

    roundTitle.textContent = "Round 01";
    statusText.textContent = "Scores reset! Player One starts.";
}

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

newRoundButton.addEventListener("click", startNewRound);
resetGameButton.addEventListener("click", resetScores);

updateTurnDisplay();