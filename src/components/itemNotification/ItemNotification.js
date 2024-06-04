import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { getUser } from "../../apiCall";
import { Link } from "react-router-dom";

function ItemNotification({ post }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});

  useEffect(() => {
    getUser(post.userId, setUser);
  }, [post]);

  console.log(user);

  return (
    <Alert variant={"info"}>
      <Link to={"/profile/" + user.username}>
        <img
          className="imgNotification"
          src={user ? PF + user.profilePicture : PF + "person/noAvatar.png"}
          alt=""
        />
      </Link>
      User {user.username} has been post a new Post !!! I think you should watch
      😉😉😉
    </Alert>
  );
}

export default ItemNotification;
