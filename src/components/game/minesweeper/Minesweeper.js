import React, { useState } from "react";
import "./minesweeper.css";

const generateBoard = (size, mines) => {
  const board = Array(size)
    .fill(null)
    .map(() => Array(size).fill({ value: 0, revealed: false, flagged: false }));
  let mineCount = 0;
  while (mineCount < mines) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    if (board[row][col].value === 0) {
      board[row][col] = { ...board[row][col], value: "M" };
      mineCount++;
    }
  }
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].value !== "M") {
        let minesAround = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (
              newRow >= 0 &&
              newRow < size &&
              newCol >= 0 &&
              newCol < size &&
              board[newRow][newCol].value === "M"
            ) {
              minesAround++;
            }
          }
        }
        board[row][col] = { ...board[row][col], value: minesAround };
      }
    }
  }
  return board;
};

function Minesweeper() {
  const [board, setBoard] = useState(generateBoard(8, 10));
  const [gameOver, setGameOver] = useState(false);

  const revealCell = (row, col) => {
    if (gameOver || board[row][col].revealed) return;
    if (board[row][col].value === "M") {
      setGameOver(true);
      alert("Game Over!");
      return;
    }
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const reveal = (row, col) => {
      if (
        row < 0 ||
        row >= newBoard.length ||
        col < 0 ||
        col >= newBoard[0].length ||
        newBoard[row][col].revealed
      )
        return;
      newBoard[row][col].revealed = true;
      if (newBoard[row][col].value === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            reveal(row + i, col + j);
          }
        }
      }
    };
    reveal(row, col);
    setBoard(newBoard);
  };

  const toggleFlag = (row, col) => {
    if (gameOver || board[row][col].revealed) return;
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[row][col].flagged = !newBoard[row][col].flagged;
    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(generateBoard(8, 10));
    setGameOver(false);
  };

  return (
    <div>
      <h2 className="titleGame">Minesweeper</h2>
      <div className="minesweeper-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="minesweeper-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`minesweeper-cell ${
                  cell.revealed ? "revealed" : ""
                } ${cell.flagged ? "flagged" : ""}`}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleFlag(rowIndex, colIndex);
                }}
              >
                {cell.revealed
                  ? cell.value === "M"
                    ? "💣"
                    : cell.value
                  : cell.flagged
                  ? "🚩"
                  : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={resetGame}
        style={{ margin: "20px auto", display: "flex" }}
      >
        Reset
      </button>
    </div>
  );
}

export default Minesweeper;
