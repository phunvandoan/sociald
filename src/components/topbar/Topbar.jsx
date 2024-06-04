import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./topbar.css";
import {
  Search,
  Person,
  Chat,
  Notifications,
  Logout,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { getAllUserOther } from "../../apiCall";

export default function Topbar() {
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [users, setUsers] = useState([]);
  let userData = JSON.parse(localStorage.getItem("user"));

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    getAllUserOther(setUsers, currentUser._id);

    if (value) {
      const results = users.filter((user) =>
        user.username.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn thoát tài khoản chứ 😔😔😔? \n thôi đừng thoát nhấn cancel đi 😥😥😥"
      )
    ) {
      localStorage.clear();
      window.location.reload();
    } else {
      alert("year hoo !!! 🤗🤗🤗 ");
    }
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">CodeCuaDoan</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <Tippy
            className="custom-tippy"
            content={
              searchResults.length > 0 ? (
                <div className="searchResults">
                  {searchResults.map((user, index) => (
                    <Link
                      to={`/profile/${user.username}`}
                      key={index}
                      className="searchResultItem"
                      onClick={() => setSearchTerm("")}
                    >
                      <img
                        src={
                          user.profilePicture
                            ? PF + user.profilePicture
                            : PF + "person/noAvatar.png"
                        }
                        alt={user.username}
                        className="searchResultImg"
                      />
                      <span className="searchResultName">{user.username}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <span>Không tìm thấy kết quả</span>
              )
            }
            visible={searchTerm.length > 0}
            interactive={true}
          >
            <input
              placeholder="Search for friend, post or video"
              className="searchInput"
              value={searchTerm}
              onChange={handleSearch}
            />
          </Tippy>
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Link to="/followUser">
              <Person />
              <span className="topbarIconBadge">1</span>
            </Link>
          </div>
          <div className="topbarIconItem">
            <Link
              to="/messenger"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Chat />
            </Link>
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <span className="topbarIconBadge">1</span>
            <Link
              to="/notification"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Notifications />
            </Link>
          </div>
          <div className="topbarIconItem" onClick={handleLogout}>
            <Logout />
          </div>
        </div>
        <Link to={`/profile/${currentUser.username}`}>
          <img
            src={PF + userData.profilePicture}
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
