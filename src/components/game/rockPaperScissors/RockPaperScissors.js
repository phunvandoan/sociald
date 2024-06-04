import React, { useState } from "react";
import "./rockPaperScissors.css";

const choices = ["Rock", "Paper", "Scissors"];

const getResult = (userChoice, computerChoice) => {
  if (userChoice === computerChoice) return "It's a Tie!";
  if (
    (userChoice === "Rock" && computerChoice === "Scissors") ||
    (userChoice === "Paper" && computerChoice === "Rock") ||
    (userChoice === "Scissors" && computerChoice === "Paper")
  ) {
    return "You Win!";
  }
  return "You Lose!";
};

function RockPaperScissors() {
  const [userChoice, setUserChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [result, setResult] = useState("");

  const handleChoice = (choice) => {
    const computer = choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(choice);
    setComputerChoice(computer);
    setResult(getResult(choice, computer));
  };

  return (
    <div>
      <h2 className="titleGame">Rock Paper Scissors</h2>
      <div className="choices">
        {choices.map((choice) => (
          <button key={choice} onClick={() => handleChoice(choice)}>
            {choice}
          </button>
        ))}
      </div>
      {userChoice && (
        <div className="result">
          <p>You chose: {userChoice}</p>
          <p>Computer chose: {computerChoice}</p>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default RockPaperScissors;
