import "./sidebar.css";
import {
  RssFeed,
  PlayCircleFilledOutlined,
  Group,
  Event,
  Settings,
  Reviews,
  Gamepad,
  BookmarkAdded,
  PlaylistAddCheckCircle,
  BusinessCenter,
  Bookmark,
  HelpOutline,
  WorkOutline,
  School,
  PlaylistAdd,
  Map,
  PersonPinCircle,
} from "@mui/icons-material";
import CloseFriend from "../closeFriend/CloseFriend";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAllUserOther } from "../../apiCall";

export default function Sidebar() {
  const [userOthers, setUserOthers] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    getAllUserOther(setUserOthers, currentUser._id);
  }, [currentUser]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <Link to="/feedPage">
            <li className="sidebarListItem">
              <RssFeed className="sidebarIcon" />
              <span className="sidebarListItemText">Feed</span>
            </li>
          </Link>
          <Link to="/videoPage">
            <li className="sidebarListItem">
              <PlayCircleFilledOutlined className="sidebarIcon" />
              <span className="sidebarListItemText">Videos</span>
            </li>
          </Link>
          <Link to="/playListPage">
            <li className="sidebarListItem">
              <PlaylistAddCheckCircle className="sidebarIcon" />
              <span className="sidebarListItemText">Play List</span>
            </li>
          </Link>
          <Link to="/savePostPage">
            <li className="sidebarListItem">
              <BookmarkAdded className="sidebarIcon" />
              <span className="sidebarListItemText">Save Post</span>
            </li>
          </Link>
          <Link to="/gamePage">
            <li className="sidebarListItem">
              <Gamepad className="sidebarIcon" />
              <span className="sidebarListItemText">Game</span>
            </li>
          </Link>
          <Link to="/eventsPage">
            <li className="sidebarListItem">
              <Event className="sidebarIcon" />
              <span className="sidebarListItemText">Events</span>
            </li>
          </Link>
          <Link to="/career">
            <li className="sidebarListItem">
              <BusinessCenter className="sidebarIcon" />
              <span className="sidebarListItemText">Career</span>
            </li>
          </Link>
          <Link to="/map">
            <li className="sidebarListItem">
              <PersonPinCircle className="sidebarIcon" />
              <span className="sidebarListItemText">Map</span>
            </li>
          </Link>
          <Link to="/reviews">
            <li className="sidebarListItem">
              <Reviews className="sidebarIcon" />
              <span className="sidebarListItemText">Reviews</span>
            </li>
          </Link>
          <Link to="/settingsPage">
            <li className="sidebarListItem">
              <Settings className="sidebarIcon" />
              <span className="sidebarListItemText">Settings</span>
            </li>
          </Link>
        </ul>
        <hr className="sidebarHr" />
        <Link to="/otherUser">
          <div className="sidebarShowAll">Other user</div>
        </Link>
        <ul className="sidebarFriendList">
          {userOthers.slice(0, 8).map((u) => (
            <CloseFriend key={u._id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
}

/* <button className="sidebarButton">Show More</button> */
// icon rating
// HelpOutline
// Bookmark
/* <Link>
  <li className="sidebarListItem">
      <School className="sidebarIcon" />
  <span className="sidebarListItemText">Courses</span>
</li>
</Link> */
