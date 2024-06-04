import { useContext, useEffect, useState } from "react";
import "./rightbar.css";
import { AuthContext } from "../../context/AuthContext";
import { getfriendList } from "../../apiCall";
import ProfileRightbar from "./profileRightbar/ProfileRightbar";
import HomeRightbar from "./homeRightbar/HomeRightbar";

export default function Rightbar({ user }) {
  const [friends, setFriends] = useState([]);
  const [friendsOfCurrentUser, setFriendsOfCurrentUser] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    getfriendList(currentUser._id, setFriendsOfCurrentUser);
    if (user) {
      getfriendList(user._id, setFriends);
    }
  }, [currentUser, user]);

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? (
          <ProfileRightbar user={user} friends={friends} />
        ) : (
          <HomeRightbar friendsOfCurrentUser={friendsOfCurrentUser} />
        )}
      </div>
    </div>
  );
}
