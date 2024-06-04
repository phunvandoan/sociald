import React, { useState, useEffect } from "react";
import "./memoryGame.css";

const generateCards = () => {
  const icons = ["😀", "😎", "😃", "😆", "😅", "😂", "🤣", "😊"];
  const deck = [...icons, ...icons];
  return deck.sort(() => Math.random() - 0.5);
};

function MemoryGame() {
  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [index1, index2] = flippedCards;
      if (cards[index1] === cards[index2]) {
        setMatchedCards([...matchedCards, index1, index2]);
      }
      setTimeout(() => setFlippedCards([]), 1000);
      setMoves(moves + 1);
    }
  }, [flippedCards]);

  const handleCardClick = (index) => {
    if (
      flippedCards.length < 2 &&
      !flippedCards.includes(index) &&
      !matchedCards.includes(index)
    ) {
      setFlippedCards([...flippedCards, index]);
    }
  };

  const resetGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
  };

  return (
    <div>
      <h2 className="titleGame">Memory Game</h2>
      <div className="memory-game-board">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`memory-card ${
              flippedCards.includes(index) || matchedCards.includes(index)
                ? "flipped"
                : ""
            }`}
            onClick={() => handleCardClick(index)}
          >
            <div className="memory-card-front">?</div>
            <div className="memory-card-back">{card}</div>
          </div>
        ))}
      </div>
      <div className="memory-game-info">
        <p>Moves: {moves}</p>
        <button onClick={resetGame} style={{ marginTop: "20px" }}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default MemoryGame;
