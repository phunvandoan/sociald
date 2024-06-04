import { format } from "timeago.js";
import "./comment.css";
import { memo, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Delete, Update } from "@mui/icons-material";
import { getUser } from "../../apiCall";

function Comment({ comment, onDelete, onUpdate }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});

  useEffect(() => {
    getUser(comment.userId, setUser);
  }, [comment]);

  return (
    <div className="comment" key={comment?._id}>
      <div className="commentTop">
        <img
          className="commentImg"
          src={
            user?.profilePicture
              ? PF + user.profilePicture
              : PF + "person/noAvatar.png"
          }
          alt=""
        />
        <div className="commentTextbox">
          <b className="commentName">{user?.username}</b> <br />
          <div className="commentText">{comment?.text}</div>
        </div>
        <div className="commentTime">{format(comment?.createdAt)}</div>
      </div>
      {(user._id === currentUser._id || currentUser.isAdmin) && (
        <div className="wrapperSettingComment">
          <button className="buttonSettingComment" onClick={onDelete}>
            <Delete />
            <span className="settingComment">deleted</span>
          </button>
          <button className="buttonSettingComment" onClick={onUpdate}>
            <Update />
            <span className="settingComment">updated</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(Comment);
