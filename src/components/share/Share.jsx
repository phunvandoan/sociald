import { useContext, useRef, useState } from "react";
import {
  PermMedia,
  Room,
  EmojiEmotions,
  Cancel,
  Label,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import "./share.css";
import { createPost, upload } from "../../apiCall";

export default function Share({ sendDataToChildFromParent }) {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  let userData = JSON.parse(localStorage.getItem("user"));
  let userPostData = JSON.parse(localStorage.getItem("userPost"));

  const submitHandle = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      upload(data);
    }
    createPost(newPost, userPostData, sendDataToChildFromParent);
    setFile(null);
    desc.current.value = "";
    alert(
      ":)) =>> year year 😘😘😘 tích cực băng bài nhé !!! \n" +
        ":) Mà đừng xóa bài mới đăng cho đến khi bạn chuyển trang nhé 😆😆😆 \n" +
        ":)) ....à thì vẫn xóa được nhưng mà tôi muốn bạn xem lại bài đăng của mình trước khi nó bị xóa thế thôi 😜😜😜 \n" +
        ":)) nếu muốn xem đã bị xóa chưa thì vào trang profile mà xem á ❤❤❤ "
    );
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={PF + userData.profilePicture}
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.username + " ?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            {(file?.type === "image/png" ||
              file?.type === "image/jpeg" ||
              file?.type === "image/jpeg") && (
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="shareImg"
              />
            )}
            {file?.type === "video/mp4" && (
              <video
                controls
                src={URL.createObjectURL(file)}
                alt=""
                className="shareImg"
              ></video>
            )}

            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form
          className="shareBottom"
          onSubmit={submitHandle}
          encType="multipart/form-data"
        >
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo Or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png, .jpeg, .jpg, .mp4"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <label htmlFor="fileVideo" className="shareOption">
                <Label htmlColor="blue" className="shareIcon" />
                <span className="shareOptionText">Video</span>
              </label>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
