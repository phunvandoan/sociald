import React, { useState, useEffect } from "react";
import "./whackAMole.css";

const generateMoles = () => Array(9).fill(false);

function WhackAMole() {
  const [moles, setMoles] = useState(generateMoles());
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMoles = generateMoles();
      newMoles[Math.floor(Math.random() * newMoles.length)] = true;
      setMoles(newMoles);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMoleClick = (index) => {
    if (moles[index]) {
      setScore(score + 1);
      const newMoles = [...moles];
      newMoles[index] = false;
      setMoles(newMoles);
    }
  };

  return (
    <div>
      <h2 className="titleGame">Whack-a-Mole</h2>
      <div className="whack-a-mole-board">
        {moles.map((mole, index) => (
          <div
            key={index}
            className={`whack-a-mole ${mole ? "up" : ""}`}
            onClick={() => handleMoleClick(index)}
          ></div>
        ))}
      </div>
      <p className="whack-a-mole-score">Score: {score}</p>
    </div>
  );
}

export default WhackAMole;
