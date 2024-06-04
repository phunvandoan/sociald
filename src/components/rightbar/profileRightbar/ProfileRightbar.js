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
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

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
        await axios.post(
          `https://backenddofscocial-1.onrender.com/api/conversations/`,
          data
        );
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
          `https://backenddofscocial-1.onrender.com/api/conversations/${currentUser._id}`
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
        await axios.delete(
          `https://backenddofscocial-1.onrender.com/api/users/${user._id}`,
          {
            data: {
              isAdmin: currentUser.isAdmin,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {user.username !== currentUser.username && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <Remove /> : <Add />}
        </button>
      )}
      {currentUser._id !== user._id &&
        (conversation.some(
          (c) => c.members[0] === user._id || c.members[1] === user._id
        ) ? (
          <button className="rightbarMessageButton">
            <Link to="/messenger">message</Link>
          </button>
        ) : (
          <button
            className="rightbarMessageButton"
            onClick={handleClickMessage}
          >
            <Link to="/messenger">message</Link>
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
      <h4 className="rightbarTitle">User information </h4>

      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">City:</span>
          <span className="rightbarInfoValue">{user.city}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">From:</span>
          <span className="rightbarInfoValue">{user.from}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Relationship:</span>
          <span className="rightbarInfoValue">{user.relationship}</span>
        </div>
      </div>
      <h4 className="rightbarTitle">User follower</h4>
      <div className="rightbarFollowings">
        {friends.slice(0, 8).map((friend) => (
          <Link
            to={"/profile/" + friend.username}
            style={{ textDecoration: "none" }}
            key={friend._id}
          >
            <div className="rightbarFollowing">
              <img
                src={
                  friend.profilePicture
                    ? PF + friend.profilePicture
                    : PF + "person/noAvatar.png"
                }
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
