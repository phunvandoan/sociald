import { Delete, FiberManualRecord, Update } from "@mui/icons-material";
import { Alert, Button } from "@mui/material";
import { memo, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

function GameLists({ game, onHandle, onDelete, onUpdate }) {
  const [showHandleGame, setShowHandleGame] = useState(false);
  const { user: currentUser } = useContext(AuthContext);
  return (
    <>
      <Alert
        icon={<FiberManualRecord fontSize="inherit" />}
        onClick={() => onHandle(game.idGame)}
      >
        {game.nameGame}
      </Alert>
      <Button
        onClick={() => setShowHandleGame(!showHandleGame)}
        className="buttonHandleGameAndTarget"
      >
        +
      </Button>
      {currentUser.isAdmin && (
        <>
          <Button onClick={onDelete}>
            <Delete />
          </Button>
          <Button onClick={onUpdate}>
            <Update />
          </Button>
        </>
      )}
      {showHandleGame && (
        <>
          <p>{game.target}</p>
          <p>{game.handle}</p>
        </>
      )}
    </>
  );
}

export default memo(GameLists);
