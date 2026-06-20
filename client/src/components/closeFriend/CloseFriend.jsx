import { Link } from "react-router-dom";
import "./closeFriend.css";

function CloseFriend({ user }) {
  return (
    <li className="sidebarFriend">
      <Link to={"/profile/" + user.username}>
        <img className="sidebarFriendImg" src={user?.avatar} alt="" />
        <span className="sidebarFriendName">{user.username}</span>
      </Link>
    </li>
  );
}

export default CloseFriend;
