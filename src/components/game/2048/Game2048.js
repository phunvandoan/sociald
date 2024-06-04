import React, { useState, useEffect } from "react";
import "./game2048.css";

const getEmptyBoard = () => Array(16).fill(0);

const spawnNumber = (board) => {
  const emptyIndices = board
    .map((value, index) => (value === 0 ? index : null))
    .filter((index) => index !== null);
  if (emptyIndices.length > 0) {
    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  }
  return board;
};

const mergeRow = (row) => {
  let newRow = row.filter((num) => num !== 0);
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
    }
  }
  return newRow.filter((num) => num !== 0);
};

const transpose = (board) => {
  const newBoard = getEmptyBoard();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newBoard[i * 4 + j] = board[j * 4 + i];
    }
  }
  return newBoard;
};

const slide = (board) => {
  let newBoard = getEmptyBoard();
  for (let i = 0; i < 4; i++) {
    const row = board.slice(i * 4, i * 4 + 4);
    const newRow = mergeRow(row);
    for (let j = 0; j < newRow.length; j++) {
      newBoard[i * 4 + j] = newRow[j];
    }
  }
  return newBoard;
};

function Game2048() {
  const [board, setBoard] = useState(spawnNumber(spawnNumber(getEmptyBoard())));
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      let newBoard;
      switch (e.key) {
        case "ArrowUp":
          newBoard = transpose(slide(transpose(board)));
          break;
        case "ArrowDown":
          newBoard = transpose(slide(transpose(board)).reverse());
          break;
        case "ArrowLeft":
          newBoard = slide(board);
          break;
        case "ArrowRight":
          newBoard = slide(board.reverse());
          break;
        default:
          return;
      }
      if (newBoard.some((value, index) => value !== board[index])) {
        setBoard(spawnNumber(newBoard));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board]);

  return (
    <div>
      <h2 className="titleGame">2048</h2>
      <div className="game-2048-board">
        {board.map((value, index) => (
          <div
            key={index}
            className={`game-2048-tile ${value ? `tile-${value}` : ""}`}
          >
            {value}
          </div>
        ))}
      </div>
      <p className="game-2048-score">Score: {score}</p>
    </div>
  );
}

export default Game2048;
