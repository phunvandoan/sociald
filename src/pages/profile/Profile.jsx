import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { InsertPhoto, Person } from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  deleteFile,
  getUserByName,
  udpateCoverPicture,
  updateAvatar,
} from "../../apiCall";
import { Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState();
  const username = useParams().username;
  let userData = JSON.parse(localStorage.getItem("user"));
  const [showUpdateInfo, setShowUpdateInfo] = useState(false);
  const descInputRef = useRef();
  const cityInputRef = useRef();
  const fromInputRef = useRef();
  const relationshipInputRef = useRef();

  useEffect(() => {
    getUserByName(username, setUser);
  }, [username]);

  const handleChangeAvatar = async (e) => {
    deleteFile(user.profilePicture);
    const newUser = {
      userId: user?._id,
    };

    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newUser.profilePicture = fileName;
      updateAvatar(user?._id, newUser, fileName, userData, setUser, data);
    }
  };

  const handleChangeCover = async (e) => {
    deleteFile(user.coverPicture);
    const newUser = {
      userId: user?._id,
    };

    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newUser.coverPicture = fileName;
      udpateCoverPicture(user?._id, newUser, fileName, setUser, data);
    }
  };

  const handleUpdateInfo = async () => {
    try {
      const newUserInfo = currentUser?.isAdmin
        ? {
            isAdmin: currentUser?.isAdmin,
          }
        : {
            userId: currentUser?._id,
          };
      if (descInputRef.current.value !== ("" && null))
        newUserInfo.desc = descInputRef.current.value;
      if (cityInputRef.current.value !== ("" && null))
        newUserInfo.city = cityInputRef.current.value;
      if (fromInputRef.current.value !== ("" && null))
        newUserInfo.from = fromInputRef.current.value;
      if (relationshipInputRef.current.value !== ("" && null))
        newUserInfo.relationship = relationshipInputRef.current.value;
      await axios.put(
        `https://backenddofscocial-1.onrender.com/api/users/${currentUser?._id}`,
        newUserInfo
      );
      setUser((prevUser) => ({
        ...prevUser,
        ...newUserInfo,
      }));
      setShowUpdateInfo(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {/* Cover */}
              <Link target="_blank" to={PF + user?.coverPicture}>
                <img
                  className="profileCoverImg"
                  src={
                    user && user?.coverPicture
                      ? PF + user?.coverPicture
                      : `${PF}person/noCover.png`
                  }
                  alt=""
                />
              </Link>
              <label htmlFor="fileCover">
                {userData._id === user?._id && (
                  <div className="changeCoverPicture">
                    <InsertPhoto
                      style={{ fontSize: "4rem" }}
                      className="iconChangeCoverPicture"
                    />
                  </div>
                )}
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="fileCover"
                  accept=".png, .jpeg, .jpg"
                  onChange={handleChangeCover}
                />
              </label>
              {/* Avartar */}
              <Link to={PF + user?.profilePicture} target="_blank">
                <img
                  className="profileUserImg"
                  src={
                    user && user?.profilePicture
                      ? PF + user?.profilePicture
                      : `${PF}person/noAvatar.png`
                  }
                  alt=""
                />
              </Link>
              <label htmlFor="fileAvatar">
                {userData._id === user?._id && (
                  <div className="changeAvatar">
                    <Person
                      className="iconChangeAvatar"
                      style={{ fontSize: "4rem" }}
                    />
                  </div>
                )}
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="fileAvatar"
                  accept=".png, .jpeg, .jpg"
                  onChange={handleChangeAvatar}
                />
              </label>
            </div>
            <div className="profileInfo">
              {user && (
                <div className="profileInfo">
                  <h4 className="profileInfoName">{user.username}</h4>
                  <span className="profileInfoDesc">{user.desc}</span>
                </div>
              )}
            </div>
          </div>
          <h4 className="rightbarTitle">
            <div style={{ textAlign: "center" }}>
              {currentUser?._id === user?._id && (
                <Button
                  variant="contained"
                  onClick={() => setShowUpdateInfo(!showUpdateInfo)}
                >
                  +
                </Button>
              )}
              <br />
              {showUpdateInfo && currentUser?._id === user?._id && (
                <>
                  <input ref={descInputRef} placeholder="Description" /> <br />
                  <input ref={cityInputRef} placeholder="City" /> <br />
                  <input ref={fromInputRef} placeholder="From:" /> <br />
                  <select
                    ref={relationshipInputRef}
                    style={{
                      padding: "15px 30px",
                      border: "none",
                      outline: "none",
                    }}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="-">-</option>
                  </select>
                  {"====> "}
                  <Button variant="contained" onClick={handleUpdateInfo}>
                    Submit
                  </Button>
                </>
              )}
            </div>
          </h4>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
