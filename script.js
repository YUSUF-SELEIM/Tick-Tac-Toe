"use strict";

// that is a factory since we want more than one player
const player = (sign) => {
    this.sign = sign;
    const getSign = () => {
        return sign;
    };
    return { getSign };
};

const gameModule = (function () {
    const gameBoard = {
        board: ["", "", "", "", "", "", "", "", ""],
    };
    function getCell(index) {
        return gameBoard.board[index];
    }
    function updateCell(index, sign) {
        gameBoard.board[index] = sign;
    }
    function resetBoard() {
        gameBoard.board = ["", "", "", "", "", "", "", "", ""];
    }
    return {
        updateCell,
        resetBoard,
        getCell,
    };
})();

const displayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const messenger = document.getElementById("messenger");
    const playAgainButton = document.getElementById("play-again");

    playAgainButton.addEventListener("click", function () {
        window.location.reload();
    });
    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            // call play round
            gameController.playRound(cell.getAttribute("data-index"));
            updateGameBoard();
        });
        const updateGameBoard = () => {
            for (let i = 0; i < cells.length; i++) {
                cells[i].textContent = gameModule.getCell(i);
            }
        };
    });
    function stylingWinningIndices() {
        if (gameController.winingIndices.length !== 0) {
            const winningCells = Array.from(cells).filter((cell) =>
                gameController.winingIndices.includes(parseInt(cell.dataset.index))
            );
            winningCells.forEach((cell) => cell.classList.add("winning-style"));
        }
    }
    return { messenger, stylingWinningIndices };
})();

const gameController = (() => {
    const player1 = player("X");
    const player2 = player("O");
    let round = 1;
    let isGameOver = false;
    let winingIndices = [];

    const playRound = (cellIndex) => {
        if (gameModule.getCell(cellIndex) === "" && !isGameOver) {
            gameModule.updateCell(cellIndex, whoIsPlaying());
            if (checkWinningConditions() === "X") {
                displayController.messenger.textContent = "Player X Won !";
                displayController.stylingWinningIndices();
            } else if (checkWinningConditions() === "O") {
                displayController.messenger.textContent = "Player O Won !";
                displayController.stylingWinningIndices();
            } else if (round === 9) {
                displayController.messenger.textContent = "Draw Game !";
            }
            round++;
        }
    };
    const checkWinningConditions = () => {
        const winningCombinations = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Diagonal from top-left to bottom-right
            [2, 4, 6], // Diagonal from top-right to bottom-left
        ];
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (
                gameModule.getCell(a) !== "" &&
                gameModule.getCell(a) === gameModule.getCell(b) &&
                gameModule.getCell(b) === gameModule.getCell(c)
            ) {
                isGameOver = true;
                winingIndices.push(a, b, c);
                console.log(winingIndices);
                return gameModule.getCell(a); // Return the winning player symbol
            }
        }
        return null; // Return null if there is no winner
    };
    const whoIsPlaying = () => {
        if (round % 2 == 0) {
            displayController.messenger.textContent = "X 's Turn !";
            return player2.getSign();
        } else {
            displayController.messenger.textContent = "O 's Turn !";
            return player1.getSign();
        }
    };
    return {
        playRound,
        winingIndices,
    };
})();
