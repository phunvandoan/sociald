import { memo, useContext, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Delete, Update } from "@mui/icons-material";
import { getUser } from "../../apiCall";
import "./itemReview.css";
import { Rating } from "@mui/material";
import axios from "axios";

function ItemReview({ review, onDelete, onUpdate }) {
  const { user: currentUser } = useContext(AuthContext);
  const [like, setLike] = useState(review.likeReview.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    getUser(review.userId, setUser);
  }, [review]);

  useEffect(() => {
    setIsLiked(review.likeReview.includes(currentUser._id));
  }, [currentUser, review]);

  const likeHandler = async () => {
    try {
      await axios.put(`http://localhost:8800/api/reviews/${review._id}/like`, {
        userId: currentUser._id,
      });
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <Alert className="itemReview">
      <Link to={`/profile/${user?.username}`}>
        <img
          src={PF + user?.profilePicture}
          alt=""
          className="reviewUserImage"
        />
      </Link>
      <span className="reviewUserName">{user?.username}</span>
      <p className="reviewText">{review.text}</p>
      <br />
      <div className="reviewIconList">
        <Rating className="reviewIconRating" value={review.rating} readOnly />
        <div className="postBottomLeft">
          <img
            className="likeIcon"
            src={`assets/like.png`}
            onClick={likeHandler}
            alt=""
          />
          <img
            className="likeIcon"
            src={`${PF}heart.png`}
            onClick={likeHandler}
            alt=""
          />
          <span className="postLikeCounter">{like} like</span>
        </div>
        {(currentUser?._id === user?._id || currentUser.isAdmin) && (
          <div className="reviewIcon">
            <Delete className="reviewIconItem" onClick={onDelete} />
            <Update className="reviewIconItem" onClick={onUpdate} />
          </div>
        )}
      </div>
      {review.img && (
        <Link to={PF + review.img} target="_blank">
          <img src={PF + review.img} alt="" className="imgReview" />
        </Link>
      )}
    </Alert>
  );
}

export default memo(ItemReview);
