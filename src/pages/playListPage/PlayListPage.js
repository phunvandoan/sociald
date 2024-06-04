import { useContext, useEffect, useRef, useState } from "react";
import Wrapper from "../../components/wrapper/Wrapper";
import ReactPlayer from "react-player/lazy";
import "./playListPage.css";
import { Button } from "@mui/material";
import axios from "axios";
import { Cancel, FileCopySharp } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import SongItem from "../../components/songsItem/SongItem";

function PlayListPage() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [songs, setSongs] = useState([]);
  const [showCreateMusic, setShowCreateMuisc] = useState(false);
  const [file, setFile] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState("normal");
  const { user: currentUser } = useContext(AuthContext);
  const inputSongRef = useRef();
  const inputArtistRef = useRef();

  useEffect(() => {
    const getAllSong = async () => {
      try {
        const res = await axios.get(
          `https://backenddofscocial-1.onrender.com/api/musics/allMusic`
        );
        setSongs(res.data.reverse());
        if (res.data.length > 0) {
          setCurrentSong(res.data[0]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getAllSong();
  }, []);

  // handle
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMusic = {
      title: inputSongRef.current.value,
      artist: inputArtistRef.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newMusic.url = fileName;
      try {
        await axios.post(
          "https://backenddofscocial-1.onrender.com/api/upload",
          data
        );
        console.log("updateSuccess");
      } catch (err) {
        console.log(err);
      }
    }
    try {
      const res = await axios.post(
        `https://backenddofscocial-1.onrender.com/api/musics`,
        newMusic
      );
      setSongs([res.data, ...songs]);
      inputSongRef.current.value = "";
      inputSongRef.current.value = "";
      setShowCreateMuisc(false);
      setFile(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (song) => {
    try {
      await axios.delete(
        `https://backenddofscocial-1.onrender.com/api/delete/${song.url}`
      );
    } catch (err) {
      console.log(err);
    }
    try {
      axios.delete(
        `https://backenddofscocial-1.onrender.com/api/musics/${song._id}`,
        {
          data: {
            isAdmin: currentUser.isAdmin,
          },
        }
      );
      setSongs(songs.filter((r) => r._id !== song._id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (song) => {
    if (showCreateMusic === true) {
      let newMusic = {};
      if (currentUser.isAdmin) {
        newMusic = {
          isAdmin: currentUser.isAdmin,
        };
        if (inputSongRef.current.value !== "")
          newMusic.title = inputSongRef.current.value;
        if (inputArtistRef.current.value !== "")
          newMusic.artist = inputArtistRef.current.value;
      }
      if (file) {
        try {
          await axios.delete(
            `https://backenddofscocial-1.onrender.com/api/delete/${song.url}`
          );
        } catch (err) {
          console.log(err);
        }
        const data = new FormData();
        const fileName = Date.now() + file.name;
        data.append("name", fileName);
        data.append("file", file);
        newMusic.url = fileName;
        try {
          await axios.post(
            "https://backenddofscocial-1.onrender.com/api/upload",
            data
          );
          console.log("updateSuccess");
        } catch (err) {
          console.log(err);
        }
      }
      try {
        axios.put(
          `https://backenddofscocial-1.onrender.com/api/musics/${song._id}`,
          newMusic
        );
        setSongs(
          songs.map((s) => {
            if (s._id === song._id) {
              if (inputSongRef.current.value !== "") s.title = newMusic.title;
              if (inputArtistRef.current.value !== "")
                s.artist = newMusic.artist;
            }
            return s;
          })
        );
        inputSongRef.current.value = "";
        inputSongRef.current.value = "";
        setShowCreateMuisc(false);
        setFile(null);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("bạn vẫn chưa hộp thoại để sửa mà ");
    }
  };

  return (
    <Wrapper sologan={"Play List 📼"}>
      <div className="playlist">
        {/* CREATE SONGS */}
        {currentUser.isAdmin && (
          <button
            className="buttonCreateReview"
            onClick={() => setShowCreateMuisc(!showCreateMusic)}
          >
            Create or Update song
          </button>
        )}
        {showCreateMusic && currentUser.isAdmin && (
          <form
            className="reviewForm"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <input
              type="text"
              className="textReviewForm"
              ref={inputSongRef}
              placeholder="nam song "
            />
            <input
              type="text"
              className="textReviewForm"
              ref={inputArtistRef}
              placeholder="nam singer "
            />
            <label htmlFor="fileReviewForm">
              <FileCopySharp />
              <input
                type="file"
                id="fileReviewForm"
                accept=".mp3"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
            <Button
              className="submitCreateReview"
              type="submit"
              variant="success"
            >
              submit
            </Button>
            {file && (
              <div className="reviewImgContainer">
                {file.type === "audio/mpeg" && (
                  <audio
                    controls
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="fileSong"
                  ></audio>
                )}

                <Cancel
                  className="reviewCancelImg"
                  onClick={() => setFile(null)}
                />
              </div>
            )}
          </form>
        )}

        {/* PLAY LIST  */}
        {currentSong && (
          <ReactPlayer
            className="react-player"
            style={{
              margin: "0 auto",
            }}
            height={"80px"}
            url={PF + currentSong.url}
            playing={isPlaying}
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              if (mode === "repeat") {
                setIsPlaying(true);
              } else if (mode === "random") {
                const randomIndex = Math.floor(Math.random() * songs.length);
                setCurrentSong(songs[randomIndex]);
                setIsPlaying(true);
              } else if (mode === "sequential") {
                const currentIndex = songs.findIndex(
                  (song) => song._id === currentSong._id
                );
                const nextIndex = (currentIndex + 1) % songs.length;
                setCurrentSong(songs[nextIndex]);
                setIsPlaying(true);
              }
            }}
          />
        )}
        <div className="controls">
          <Button
            className={`control-button ${mode === "random" ? "active" : ""}`}
            onClick={() => setMode("random")}
          >
            Random
          </Button>
          <Button
            className={`control-button ${
              mode === "sequential" ? "active" : ""
            }`}
            onClick={() => setMode("sequential")}
          >
            Sequential
          </Button>
          <Button
            className={`control-button ${mode === "repeat" ? "active" : ""}`}
            onClick={() => setMode("repeat")}
          >
            Repeat
          </Button>
        </div>
        <ul className="song-list">
          {songs.map((song) => (
            <li key={song._id}>
              <SongItem
                song={song}
                setCurrentSong={setCurrentSong}
                onUpdate={() => handleUpdate(song)}
                onDelete={() => handleDelete(song)}
              />
            </li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
}

export default PlayListPage;

/* <li key={song._id} onClick={() => setCurrentSong(song)}>
              <Alert
                variant="light"
                style={{ width: "55%", margin: " 20px auto" }}
              >
                {song.title} - {song.artist}
              </Alert>
            </li> */
