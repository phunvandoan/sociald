import { Add, Remove } from "@mui/icons-material";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./cardUser.css";

function CardUser({ userOther, currentUser, handleClick }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log(userOther);
  return (
    <Card style={{ width: "13em" }}>
      <Link
        to={`/profile/${userOther?.username}`}
        style={{ textAlign: "center" }}
      >
        <Card.Img
          className="itemFollowUseImg"
          variant="top"
          src={
            userOther?.profilePicture
              ? PF + userOther?.profilePicture
              : PF + `person/noAvatar.png`
          }
        />
      </Link>
      <Card.Body>
        <Card.Title>{userOther?.username}</Card.Title>
        <Card.Text className="text-truncate">
          {userOther?.desc || "im don't like tell about me"}
        </Card.Text>
        <p className="followerOfUser">{userOther?.followers?.length} follow</p>
        {userOther?.username !== currentUser?.username && (
          <Button variant="primary" onClick={() => handleClick(userOther)}>
            {currentUser?.followings.includes(userOther?._id)
              ? "Unfollow"
              : "Follow"}
            {currentUser?.followings.includes(userOther?._id) ? (
              <Remove />
            ) : (
              <Add />
            )}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default CardUser;
