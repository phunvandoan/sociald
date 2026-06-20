import Topbar from "../../components/topbar/Topbar";
import "./notification.css";
import ItemNotification from "../../components/itemNotification/ItemNotification";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function Notification() {
  // let userDataPost = JSON.parse(localStorage.getItem("postFriend"));
  const { user: currentUser } = useContext(AuthContext);
  const [userDataPost, setUserDataPost] = useState([]);

  useEffect(() => {
    const userDataPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/posts/timeline/` + currentUser._id,
        );
        setUserDataPost(res.data.reverse());
      } catch (err) {
        console.log(err);
      }
    };
    userDataPost();
  }, [currentUser]);

  return (
    <>
      <Topbar />
      <div className="notificationContainer">
        <div className="notificationWrapper">
          <div className="notificationTitle">My Notification 📢📢📢</div>
          <ul className="listNotification">
            {userDataPost.map((p) => (
              <li className="itemNotification">
                <ItemNotification post={p}></ItemNotification>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Notification;
