import React, { useState } from "react";
import "./ticTacToe.css";

const initialBoard = Array(9).fill(null);

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

function TicTacToe() {
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = board.slice();
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const renderSquare = (index) => {
    return (
      <button className="square_TicTacToe" onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setXIsNext(true);
  };

  return (
    <div className="TicTacToe_container">
      <div className="TicTacToe_wrapper">
        <h2>Tic Tac Toe</h2>
        <div className="board_TicTacToe">
          {board.map((_, index) => renderSquare(index))}
        </div>
        <div className="status_TicTacToe">
          {winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? "X" : "O"}`}
        </div>
        <button onClick={resetGame} style={{ marginTop: "20px" }}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default TicTacToe;
