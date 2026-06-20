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
  Quiz,
  Info,
  Dashboard,
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
              <span className="sidebarListItemText">Bảng tin</span>
            </li>
          </Link>
          <Link to="/videoPage">
            <li className="sidebarListItem">
              <PlayCircleFilledOutlined className="sidebarIcon" />
              <span className="sidebarListItemText">Video</span>
            </li>
          </Link>
          <Link to="/playListPage">
            <li className="sidebarListItem">
              <PlaylistAddCheckCircle className="sidebarIcon" />
              <span className="sidebarListItemText">Danh sách phát</span>
            </li>
          </Link>
          <Link to="/savePostPage">
            <li className="sidebarListItem">
              <BookmarkAdded className="sidebarIcon" />
              <span className="sidebarListItemText">Lưu bài viết</span>
            </li>
          </Link>
          <Link to="/gamePage">
            <li className="sidebarListItem">
              <Gamepad className="sidebarIcon" />
              <span className="sidebarListItemText">Trò chơi</span>
            </li>
          </Link>
          <Link to="/eventsPage">
            <li className="sidebarListItem">
              <Event className="sidebarIcon" />
              <span className="sidebarListItemText">Sự kiện</span>
            </li>
          </Link>
          <Link to="/map">
            <li className="sidebarListItem">
              <PersonPinCircle className="sidebarIcon" />
              <span className="sidebarListItemText">Bản đồ</span>
            </li>
          </Link>
          <Link to="/aboutUs">
            <li className="sidebarListItem">
              <Info className="sidebarIcon" />
              <span className="sidebarListItemText">Về chúng tôi</span>
            </li>
          </Link>
          <Link to="/reviews">
            <li className="sidebarListItem">
              <Reviews className="sidebarIcon" />
              <span className="sidebarListItemText">Đánh giá</span>
            </li>
          </Link>
          {!currentUser?.isAdmin && (
            <Link to="/settingsPage">
              <li className="sidebarListItem">
                <Settings className="sidebarIcon" />
                <span className="sidebarListItemText">Cài đặt</span>
              </li>
            </Link>
          )}
          {currentUser?.isAdmin && (
            <Link to="/DashboardAdmin">
              <li className="sidebarListItem">
                <Dashboard className="sidebarIcon" />
                <span className="sidebarListItemText">Bảng điều khiển</span>
              </li>
            </Link>
          )}
        </ul>
        <hr className="sidebarHr" />
        <Link to="/otherUser">
          <div className="sidebarShowAll">Người dùng khác</div>
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
