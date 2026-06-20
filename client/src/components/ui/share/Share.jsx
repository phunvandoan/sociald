import { useContext, useRef, useState } from "react";
import { PermMedia, Cancel } from "@mui/icons-material";
import { AuthContext } from "../../../context/AuthContext";
import "./share.css";
import { Link } from "react-router-dom";
import { uploadImage, uploadVideo } from "../../../api/upload.api";
import { createPost } from "../../../api/post.api";

export default function Share({ sendDataToChildFromParent }) {
  const { user } = useContext(AuthContext);

  const desc = useRef();
  const [files, setFiles] = useState([]);
  const [openGallery, setOpenGallery] = useState(false);

  let userPostData = JSON.parse(localStorage.getItem("userPost"));

  const submitHandle = async (e) => {
    e.preventDefault();

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
      urlUploadContent: [],
    };

    if (files.length > 0) {
      const data = new FormData();

      files.forEach((file) => {
        data.append("file", file);
      });

      let res;

      const hasImage = files.some((f) => f.type.includes("image"));
      const hasVideo = files.some((f) => f.type.includes("video"));

      if (hasImage) {
        res = await uploadImage(data);
      } else if (hasVideo) {
        res = await uploadVideo(data);
      }

      if (Array.isArray(res)) {
        newPost.urlUploadContent = res.map((item) => item.url);
      }
    }

    await createPost(newPost, userPostData, sendDataToChildFromParent);

    setFiles([]);
    desc.current.value = "";
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <Link to={`/profile/${user.username}`}>
            <img className="shareProfileImg" src={user?.avatar} alt="" />
          </Link>

          <input
            placeholder={`Bạn đang nghĩ gì ${user.username}?`}
            className="shareInput"
            ref={desc}
          />
        </div>

        <hr className="shareHr" />

        {files.length > 0 && (
          <>
            <div className="shareImgContainer">
              <div className="shareGallery">
                {files.slice(0, 3).map((file, i) => (
                  <div key={i} className="shareGalleryItem">
                    {file.type.includes("image") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        className="shareGalleryMedia"
                        alt=""
                      />
                    ) : (
                      <video
                        controls
                        src={URL.createObjectURL(file)}
                        className="shareGalleryMedia"
                      />
                    )}

                    {i === 2 && files.length > 3 && (
                      <div
                        className="shareMoreOverlay"
                        onClick={() => setOpenGallery(true)}
                      >
                        +{files.length - 3} khác
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Cancel className="shareCancelImg" onClick={() => setFiles([])} />
            </div>
          </>
        )}

        {openGallery && (
          <div className="shareOverlay" onClick={() => setOpenGallery(false)}>
            <div
              className="shareOverlayContent"
              onClick={(e) => e.stopPropagation()}
            >
              {files.map((file, i) => (
                <div key={i} className="shareOverlayItem">
                  {file.type.includes("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      className="shareOverlayMedia"
                      alt=""
                    />
                  ) : (
                    <video
                      controls
                      src={URL.createObjectURL(file)}
                      className="shareOverlayMedia"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <form className="shareBottom" onSubmit={submitHandle}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Ảnh / Video</span>

              <input
                key={files.length}
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpg,.jpeg,.mp4,.avif,.webp"
                multiple
                onChange={(e) =>
                  setFiles((prev) => [...prev, ...Array.from(e.target.files)])
                }
              />
            </label>
          </div>

          <button className="shareButton" type="submit">
            Chia sẻ
          </button>
        </form>
      </div>
    </div>
  );
}
