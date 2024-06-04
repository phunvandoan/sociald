import Topbar from "../../components/topbar/Topbar";
import "./notification.css";
import ItemNotification from "../../components/itemNotification/ItemNotification";

function Notification() {
  let userDataPost = JSON.parse(localStorage.getItem("postFriend"));

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
