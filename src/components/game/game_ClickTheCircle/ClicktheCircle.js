import { useEffect, useState } from "react";
import Wrapper from "../../wrapper/Wrapper";
import "./game_ClickTheCircle.css";

function ClicktheCircle() {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    moveCircle();
  }, []);

  const getRandomPosition = () => {
    const container = document.getElementById("game-container");
    const circle = document.getElementById("circle");
    const containerRect = container.getBoundingClientRect();
    const circleDiameter = circle.offsetWidth;
    const maxLeft = containerRect.width - circleDiameter;
    const maxTop = containerRect.height - circleDiameter;

    const left = Math.floor(Math.random() * maxLeft);
    const top = Math.floor(Math.random() * maxTop);

    return { left, top };
  };

  const moveCircle = () => {
    const newPosition = getRandomPosition();
    setPosition(newPosition);
  };

  const handleCircleClick = () => {
    setScore(score + 1);
    moveCircle();
  };

  return (
    <div id="game-container" className="game-container">
      <div className="game-wrapper">
        <div
          id="circle"
          className="circle"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          onClick={handleCircleClick}
        ></div>
        <div className="score">Score: {score}</div>
      </div>
    </div>
  );
}

export default ClicktheCircle;
