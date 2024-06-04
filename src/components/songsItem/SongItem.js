import { Button } from "@mui/material";
import { useContext } from "react";
import { Alert } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

function SongItem({ song, setCurrentSong, onUpdate, onDelete }) {
  const { user: currentUser } = useContext(AuthContext);

  return (
    <>
      <Alert
        onClick={() => setCurrentSong(song)}
        variant="light"
        style={{ width: "55%", margin: " 20px auto" }}
      >
        {song.title} - {song.artist}
      </Alert>
      {currentUser.isAdmin && (
        <>
          <Button onClick={onUpdate}>Update</Button>
          <Button onClick={onDelete}>Delete</Button>
        </>
      )}
    </>
  );
}

export default SongItem;
