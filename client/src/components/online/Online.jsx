import { Link } from "react-router-dom";
import "./online.css";

export default function Online({ user, disabledOnline = false }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <Link to={"/profile/" + user?.username}>
      <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
          <img className="rightbarProfileImg" src={user?.avatar} alt="" />
          {!disabledOnline && <span className="rightbarOnline"></span>}
        </div>
        <span className="rightbarUsername">{user?.username}</span>
      </li>
    </Link>
  );
}
