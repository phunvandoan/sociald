import { useState, useEffect, useRef } from "react";
import Wrapper from "../../wrapper/Wrapper";
import "./snakeGame.css";

const SNAKE_SPEED = 200;
const CANVAS_SIZE = { width: 500, height: 500 };
const SCALE = 20;
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
    context.fillStyle = "green";
    snake.forEach(({ x, y }) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, 1, 1);
  }, [snake, food]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (DIRECTIONS[e.key]) {
        setDirection(DIRECTIONS[e.key]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake((prev) => {
        const newSnake = [...prev];
        const head = {
          x: newSnake[0].x + direction.x,
          y: newSnake[0].y + direction.y,
        };
        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * (CANVAS_SIZE.width / SCALE)),
            y: Math.floor(Math.random() * (CANVAS_SIZE.height / SCALE)),
          });
        } else {
          newSnake.pop();
        }

        if (
          head.x < 0 ||
          head.x >= CANVAS_SIZE.width / SCALE ||
          head.y < 0 ||
          head.y >= CANVAS_SIZE.height / SCALE ||
          newSnake
            .slice(1)
            .some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          return prev;
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SNAKE_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
  };

  return (
    <div className="App_snakeGame">
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid black",
          marginTop: "20px",
        }}
        width={`${CANVAS_SIZE.width}px`}
        height={`${CANVAS_SIZE.height}px`}
      />
      {gameOver && (
        <div className="game-over_snakeGame">
          <p>Game Over</p>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default SnakeGame;
