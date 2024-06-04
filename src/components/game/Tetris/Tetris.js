import React, { useState, useEffect, useCallback } from "react";
import "./tetris.css";

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const SHAPES = [
  [[1, 1, 1, 1]], // I shape
  [
    [1, 1],
    [1, 1],
  ], // O shape
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T shape
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S shape
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z shape
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // L shape
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // J shape
];

const getRandomShape = () => {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const x = Math.floor((COLS - shape[0].length) / 2);
  const y = -shape.length;
  return { shape, x, y };
};

const rotate = (shape) => {
  return shape[0].map((_, index) => shape.map((row) => row[index])).reverse();
};

const Tetris = () => {
  const [board, setBoard] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [current, setCurrent] = useState(getRandomShape());
  const [gameOver, setGameOver] = useState(false);

  const merge = (board, { shape, x, y }) => {
    const newBoard = board.map((row) => row.slice());
    shape.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (cell && y + i >= 0) newBoard[y + i][x + j] = cell;
      })
    );
    return newBoard;
  };

  const isValidMove = (shape, board, x, y) => {
    return shape.every((row, i) =>
      row.every((cell, j) => {
        if (!cell) return true;
        const newX = x + j;
        const newY = y + i;
        return (
          newY >= 0 &&
          newY < ROWS &&
          newX >= 0 &&
          newX < COLS &&
          !board[newY][newX]
        );
      })
    );
  };

  const removeFullRows = (board) => {
    const newBoard = board.filter((row) => row.some((cell) => !cell));
    while (newBoard.length < ROWS) newBoard.unshift(Array(COLS).fill(0));
    return newBoard;
  };

  const move = (dir) => {
    const { shape, x, y } = current;
    const newX = x + dir;
    if (isValidMove(shape, board, newX, y)) {
      setCurrent({ ...current, x: newX });
    }
  };

  const drop = () => {
    const { shape, x, y } = current;
    const newY = y + 1;
    if (isValidMove(shape, board, x, newY)) {
      setCurrent({ ...current, y: newY });
    } else {
      const newBoard = merge(board, current);
      const cleanedBoard = removeFullRows(newBoard);
      if (y < 0) {
        setGameOver(true);
      } else {
        setBoard(cleanedBoard);
        setCurrent(getRandomShape());
      }
    }
  };

  const rotateShape = () => {
    const { shape, x, y } = current;
    const newShape = rotate(shape);
    if (isValidMove(newShape, board, x, y)) {
      setCurrent({ ...current, shape: newShape });
    }
  };

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      drop();
    }, 500);
    return () => clearInterval(interval);
  }, [current, board, gameOver]);

  const handleKeyDown = useCallback(
    (e) => {
      if (gameOver) return;
      switch (e.key) {
        case "ArrowLeft":
          move(-1);
          break;
        case "ArrowRight":
          move(1);
          break;
        case "ArrowUp":
          rotateShape();
          break;
        case "ArrowDown":
          drop();
          break;
        default:
          break;
      }
    },
    [current, board, gameOver]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const resetGame = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setCurrent(getRandomShape());
    setGameOver(false);
  };

  return (
    <div className="tetris-container">
      <h2>Tetris</h2>
      <div
        className="tetris-board"
        style={{
          position: "relative",
          width: COLS * BLOCK_SIZE,
          height: ROWS * BLOCK_SIZE,
        }}
      >
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="tetris-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`tetris-cell ${cell ? "filled" : ""}`}
              ></div>
            ))}
          </div>
        ))}
        {current.shape.map((row, i) =>
          row.map(
            (cell, j) =>
              cell &&
              current.y + i >= 0 && (
                <div
                  key={`${i}-${j}`}
                  className="tetris-cell filled"
                  style={{
                    position: "absolute",
                    top: (current.y + i) * BLOCK_SIZE,
                    left: (current.x + j) * BLOCK_SIZE,
                    width: BLOCK_SIZE,
                    height: BLOCK_SIZE,
                  }}
                ></div>
              )
          )
        )}
      </div>
      {gameOver && (
        <div className="tetris-game-over">
          <p>Game Over</p>
          <button onClick={resetGame}>Reset</button>
        </div>
      )}
    </div>
  );
};

export default Tetris;
