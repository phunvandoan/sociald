import { useContext, useRef, useState } from "react";
import { PermMedia, Cancel } from "@mui/icons-material";
import { AuthContext } from "../../../context/AuthContext";
import "./updatePost.css";
import { deleteFile, updatePost, upload } from "../../../apiCall";

export default function UpdatePost({
  post,
  children,
  setShowUpdate,
  sendDataToParentUpdate,
}) {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  let userPostData = JSON.parse(localStorage.getItem("userPost"));

  const submitHandle = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      deleteFile(post.img);
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      upload(data);
    }
    try {
      await updatePost(post._id, newPost);
      userPostData.map((userPost) => {
        if (userPost._id === post._id) {
          if (newPost.img) userPost.img = newPost.img;
          if (newPost.desc) userPost.desc = newPost.desc;
          sendDataToParentUpdate(userPost);
        }
        localStorage.setItem("userPost", JSON.stringify(userPostData));
        setShowUpdate(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="shareUpdate">
      <div className="shareWrapperUpdate">
        <div className="shareTopUpdate">
          <img
            className="shareProfileImgUpdate"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.username + " ?"}
            className="shareInputUpdate"
            ref={desc}
          />
          {children}
        </div>
        <hr className="shareHrUpdate" />
        {file && (
          <div className="shareImgContainerUpdate">
            {(file.type === "image/png" ||
              file.type === "image/jpeg" ||
              file.type === "image/jpeg") && (
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="shareImg"
              />
            )}
            {file.type === "video/mp4" && (
              <video
                controls
                src={URL.createObjectURL(file)}
                alt=""
                className="shareImg"
              ></video>
            )}
            <Cancel
              className="shareCancelImgUpdate"
              onClick={() => setFile(null)}
            />
          </div>
        )}
        <form
          className="shareBottomUpdate"
          onSubmit={submitHandle}
          encType="multipart/form-data"
        >
          <div className="shareOptionsUpdate">
            <label htmlFor="fileUpdate" className="shareOptionUpdate">
              <PermMedia htmlColor="tomato" className="shareIconUpdate" />
              <span className="shareOptionTextUpdate">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="fileUpdate"
                accept=".png, .jpeg, .jpg, .mp4"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
          <button className="shareButtonUpdate" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
