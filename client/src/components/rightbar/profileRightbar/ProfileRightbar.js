import { Add, Remove } from "@mui/icons-material";
import { followUser } from "../../../apiCall";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import "./profileRightbar.css";
import axios from "axios";
import { Button } from "@mui/material";

function ProfileRightbar({ user, friends }) {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const followed = currentUser.followings.includes(user?._id);
  const [conversation, setConversation] = useState([]);

  const handleClick = () => {
    followUser(followed, user._id, currentUser._id, dispatch);
  };

  const handleClickMessage = useCallback(() => {
    const createConversation = async () => {
      try {
        const data = {
          senderId: currentUser._id,
          receiverId: user._id,
        };
        await axios.post(`http://localhost:8800/api/conversations/`, data);
      } catch (err) {
        console.log(err);
      }
    };
    createConversation();
  }, [currentUser, user]);

  useEffect(() => {
    const handleCoversation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/conversations/${currentUser._id}`,
        );
        setConversation(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    handleCoversation();
  }, [currentUser]);

  const hanldeDeleteAcoutOfUser = async () => {
    if (window.confirm("you sure!!!")) {
      try {
        await axios.delete(`http://localhost:8800/api/users/${user._id}`, {
          data: {
            isAdmin: currentUser.isAdmin,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {user.username !== currentUser.username && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {followed ? "Bỏ theo dõi" : "Theo dõi"}
          {followed ? <Remove /> : <Add />}
        </button>
      )}
      {currentUser._id !== user._id &&
        (conversation.some(
          (c) => c.members[0] === user._id || c.members[1] === user._id,
        ) ? (
          <button className="rightbarMessageButton">
            <Link to="/messenger">tin nhắn</Link>
          </button>
        ) : (
          <button
            className="rightbarMessageButton"
            onClick={handleClickMessage}
          >
            <Link to="/messenger">tin nhắn</Link>
          </button>
        ))}
      {currentUser.isAdmin && currentUser._id !== user._id && (
        <Button
          variant="contained"
          color="error"
          style={{ margin: "10px 0" }}
          onClick={hanldeDeleteAcoutOfUser}
        >
          deleteAcount
        </Button>
      )}
      <h4 className="rightbarTitle">Thông tin người dùng</h4>

      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Thành phố:</span>
          <span className="rightbarInfoValue">{user.city}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Từ:</span>
          <span className="rightbarInfoValue">{user.from}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Tình trạng quan hệ:</span>
          <span className="rightbarInfoValue">{user.relationship}</span>
        </div>
      </div>
      <h4 className="rightbarTitle">Người theo dõi</h4>
      <div className="rightbarFollowings">
        {friends.slice(0, 8).map((friend) => (
          <Link
            to={"/profile/" + friend.username}
            style={{ textDecoration: "none" }}
            key={friend._id}
          >
            <div className="rightbarFollowing">
              <img
                src={friend?.avatar}
                alt=""
                className="rightbarFollowingImg"
              />
              <span className="rightbarFollowingName">{friend.username}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default memo(ProfileRightbar);
