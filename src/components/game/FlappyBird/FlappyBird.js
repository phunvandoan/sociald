import React, { useState, useEffect } from "react";
import "./flappyBird.css";

function FlappyBird() {
  const [birdY, setBirdY] = useState(250);
  const [pipeX, setPipeX] = useState(500);
  const [pipeHeight, setPipeHeight] = useState(200);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let birdInterval, pipeInterval;
    if (!gameOver) {
      birdInterval = setInterval(() => {
        setBirdY((birdY) => Math.min(birdY + 5, 480));
      }, 50);

      pipeInterval = setInterval(() => {
        setPipeX((pipeX) => {
          if (pipeX < -50) {
            const newHeight = Math.floor(Math.random() * 300) + 100;
            setPipeHeight(newHeight);
            return 500;
          }
          return pipeX - 5;
        });
      }, 50);
    }

    return () => {
      clearInterval(birdInterval);
      clearInterval(pipeInterval);
    };
  }, [gameOver]);

  useEffect(() => {
    const birdTop = birdY;
    const birdBottom = birdY + 20;
    const pipeTopHeight = pipeHeight;
    const pipeBottomHeight = pipeHeight + 100;

    if (
      (pipeX < 70 &&
        pipeX > 0 &&
        (birdTop < pipeTopHeight || birdBottom > pipeBottomHeight)) ||
      birdBottom > 500
    ) {
      setGameOver(true);
    }
  }, [birdY, pipeX, pipeHeight]);

  const handleJump = () => {
    setBirdY((birdY) => Math.max(birdY - 50, 0));
  };

  const handleReset = () => {
    setBirdY(250);
    setPipeX(500);
    setPipeHeight(200);
    setGameOver(false);
  };

  return (
    <div className="flappy-bird-container" onClick={handleJump}>
      <div className="flappy-bird-game">
        <div className="bird" style={{ top: `${birdY}px` }}>
          🐣
        </div>
        <div
          className="pipe"
          style={{ left: `${pipeX}px`, height: `${pipeHeight}px` }}
        ></div>
        <div
          className="pipe"
          style={{
            left: `${pipeX}px`,
            height: `${500 - pipeHeight - 100}px`,
            top: `${pipeHeight + 100}px`,
          }}
        ></div>
      </div>
      {gameOver && (
        <div className="flappy-bird-game-over">
          <p>Game Over</p>
          <button onClick={handleReset}>Reset</button>
        </div>
      )}
    </div>
  );
}

export default FlappyBird;
