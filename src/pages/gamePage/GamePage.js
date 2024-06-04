import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Wrapper from "../../components/wrapper/Wrapper";
import ClicktheCircle from "../../components/game/game_ClickTheCircle/ClicktheCircle";
import SnakeGame from "../../components/game/snakeGame/SnakeGame";
import TicTacToe from "../../components/game/ticTacToe/TicTacToe";
import MemoryGame from "../../components/game/memoryGame/MemoryGame";
import RockPaperScissors from "../../components/game/rockPaperScissors/RockPaperScissors";
import WhackAMole from "../../components/game/Whack-a-Mole/WhackAMole";
import Game2048 from "../../components/game/2048/Game2048";
import Minesweeper from "../../components/game/minesweeper/Minesweeper";
import FlappyBird from "../../components/game/FlappyBird/FlappyBird";
import Tetris from "../../components/game/Tetris/Tetris";
import GameLists from "../../components/game/_gameLists/GameLists";
import { Button } from "@mui/material";
import "./gamePage.css";
import axios, { all } from "axios";
import { AuthContext } from "../../context/AuthContext";

function GamePage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAndHide, setShowAndHide] = useState(true);
  const [showInputCreateGame, setShowInputCreateGame] = useState(false);
  const [allGame, setAllGame] = useState([]);
  const { user: currentUser } = useContext(AuthContext);
  const idGame = useRef();
  const nameGame = useRef();
  const target = useRef();
  const handle = useRef();

  const handleCancel = useCallback(() => {
    setSelectedGame(null);
  }, []);

  useEffect(() => {
    const getAllGame = async () => {
      try {
        const res = await axios.get(
          `https://backenddofscocial-1.onrender.com/api/games/allGame`
        );
        setAllGame(res.data.reverse());
      } catch (err) {
        console.log(err);
      }
    };
    getAllGame();
  }, []);

  const handleCreateGame = async () => {
    const newGame = {
      idGame: idGame.current.value,
      nameGame: nameGame.current.value,
      target: target.current.value,
      handle: handle.current.value,
    };
    try {
      const res = await axios.post(
        `https://backenddofscocial-1.onrender.com/api/games`,
        newGame
      );
      setAllGame([res.data, ...allGame]);
    } catch (err) {
      console.log(err);
    }
    setShowInputCreateGame(false);
  };

  const handleDeleteGame = useCallback(
    async (idGame) => {
      try {
        await axios.delete(
          `https://backenddofscocial-1.onrender.com/api/games/${idGame}`,
          {
            data: {
              isAdmin: currentUser.isAdmin,
            },
          }
        );
        setAllGame(allGame.filter((game) => game._id !== idGame));
      } catch (err) {
        console.log(err);
      }
    },
    [allGame, currentUser]
  );

  const handleUpdateGame = useCallback(
    async (id_Game) => {
      if (showInputCreateGame) {
        const newGame = {
          isAdmin: currentUser.isAdmin,
        };
        if (idGame.current.value !== "") newGame.idGame = idGame.current.value;
        if (nameGame.current.value !== "")
          newGame.nameGame = nameGame.current.value;
        if (target.current.value !== "") newGame.target = target.current.value;
        if (handle.current.value !== "") newGame.handle = handle.current.value;
        try {
          await axios.put(
            `https://backenddofscocial-1.onrender.com/api/games/${id_Game}`,
            newGame
          );
          setAllGame(
            allGame.map((game) => {
              if (game._id === id_Game) {
                if (newGame.idGame) game.idGame = newGame.idGame;
                if (newGame.nameGame) game.nameGame = newGame.nameGame;
                if (newGame.target) game.target = newGame.target;
                if (newGame.handle) game.handle = newGame.handle;
              }
              return game;
            })
          );
        } catch (err) {
          console.log(err);
        }
      } else {
        alert("bạn vẫn chưa mở hộp thoại để sửa mà");
      }
    },
    [allGame, currentUser, showInputCreateGame]
  );

  return (
    <Wrapper sologan={"funny game"}>
      <Button
        style={{ display: "flex", margin: "0 auto" }}
        onClick={() => setShowInputCreateGame(!showInputCreateGame)}
      >
        create or update Game
      </Button>
      {showInputCreateGame && (
        <div className="InputListCreateOrUpdateGame">
          <input type="text" placeholder="write id game" ref={idGame} />
          <input type="text" placeholder="write name game " ref={nameGame} />
          <textarea
            type="text"
            placeholder="write target game  "
            ref={target}
          />
          <textarea type="text" placeholder="write handle game " ref={handle} />
          <Button onClick={handleCreateGame}>Submit</Button>
        </div>
      )}
      {!selectedGame ? (
        <ul className="listGame">
          {(showAndHide ? allGame.slice(0, 5) : allGame).map((g) => (
            <li className="ItemListGame" key={allGame.idGame}>
              <GameLists
                game={g}
                onHandle={setSelectedGame}
                onDelete={() => handleDeleteGame(g._id)}
                onUpdate={() => handleUpdateGame(g._id)}
              ></GameLists>
            </li>
          ))}
          <Button onClick={() => setShowAndHide(!showAndHide)}>
            {showAndHide ? "show" : "hide"}
          </Button>
        </ul>
      ) : (
        <>
          {selectedGame === "ClickTheCircle" && <ClicktheCircle />}
          {selectedGame === "SnakeGame" && <SnakeGame />}
          {selectedGame === "TicTacToe" && <TicTacToe />}
          {selectedGame === "MemoryGame" && <MemoryGame />}
          {selectedGame === "RockPaperScissors" && <RockPaperScissors />}
          {selectedGame === "WhackAMole" && <WhackAMole />}
          {selectedGame === "2048" && <Game2048 />}
          {selectedGame === "Minesweeper" && <Minesweeper />}
          {selectedGame === "FlappyBird" && <FlappyBird />}
          {selectedGame === "Tetris" && <Tetris />}
          <Button
            className="IconCancle"
            onClick={handleCancel}
            style={{ position: "absolute", top: "140px", right: "50px" }}
          >
            Cancel
          </Button>
        </>
      )}
    </Wrapper>
  );
}

export default GamePage;
