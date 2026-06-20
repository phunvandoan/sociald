import { useContext, useRef, useState } from "react";
import { PermMedia, Cancel } from "@mui/icons-material";
import { AuthContext } from "../../../context/AuthContext";
import "./updatePost.css";
import { updatePost } from "../../../apiCall";
import { uploadImage, uploadVideo } from "../../../api/upload.api";

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
      const data = new FormData();
      data.append("file", file);
      let res;
      if (file.type.includes("image")) {
        res = await uploadImage(data);
      } else if (file.type.includes("video")) {
        res = await uploadVideo(data);
      }
      if (Array.isArray(res)) {
        newPost.urlUploadContent = res.map((item) => item.url);
      }
    }
    try {
      await updatePost(post._id, newPost);
      userPostData = userPostData.map((userPost) => {
        if (userPost._id === post._id) {
          if (newPost.urlUploadContent)
            userPost.urlUploadContent = newPost.urlUploadContent;
          if (newPost.desc) userPost.desc = newPost.desc;
          sendDataToParentUpdate(userPost);
        }
        return userPost;
      });
      localStorage.setItem("userPost", JSON.stringify(userPostData));
      setShowUpdate(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="shareUpdate">
      <div className="shareWrapperUpdate">
        <div className="shareTopUpdate">
          <img className="shareProfileImgUpdate" src={user?.avatar} alt="" />
          <input
            placeholder={"Bạn đang nghĩ gì " + user.username + " ?"}
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
              <span className="shareOptionTextUpdate">Ảnh hoặc Video</span>
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
            Cập nhật
          </button>
        </form>
      </div>
    </div>
  );
}
