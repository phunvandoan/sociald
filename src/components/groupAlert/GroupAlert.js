import { memo, useContext, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUser } from "../../apiCall";
import { AuthContext } from "../../context/AuthContext";
import { Delete, Update } from "@mui/icons-material";
import "./groupAlert.css";
import axios from "axios";

function GroupAler({ group, onDelete, sendDataFromChildToParent }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState();

  useEffect(() => {
    getUser(group.userId, setUser);
  }, [group]);

  const handleDelte = async () => {
    console.log("handledelte");
    try {
      await axios.delete(
        `https://backenddofscocial-1.onrender.com/api/groupMessages/${group._id}`,
        {
          data: {
            userId: currentUser._id,
          },
        }
      );
      sendDataFromChildToParent();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Alert>
      <Link to="">
        <img src={PF + user?.profilePicture} alt="" className="ImageGroup" />
      </Link>
      <span className="groupText">{group.text}</span>
      {currentUser?._id === user?._id && (
        <div className="groupIcon">
          <Delete className="groupIconItem" onClick={onDelete} />
          <Update className="groupIconItem" />
        </div>
      )}
    </Alert>
  );
}

export default memo(GroupAler);
