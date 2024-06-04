import { useContext, useEffect, useMemo, useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import "./post.css";
import { Cancel, MoreVert } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import UpdatePost from "../settingsPost/updatePost/UpdatePost";
import { Dropdown } from "react-bootstrap";
import CommentsBox from "../commentsBox/CommentsBox";
import {
  getUser,
  likePost,
  getAllComment,
  deletePost,
  deleteFile,
} from "../../apiCall";
import { Button } from "@mui/material";
import axios from "axios";

export default function Post({ post, sendDataToChildFromParent }) {
  const [like, setLike] = useState(post?.likes?.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [dataChild, setDataChild] = useState([]);
  const [dataChildUpdated, setDataChildUpdated] = useState([]);
  let userData = JSON.parse(localStorage.getItem("user"));
  let userPostData = JSON.parse(localStorage.getItem("userPost"));
  const [save, setSave] = useState(userData.savePosts.includes(post._id));
  const [hideComments, setHideComments] = useState(post.visibleComment);
  let showAndHideComments = post.visibleComment;

  useEffect(() => {
    setIsLiked(post?.likes?.includes(currentUser._id));
  }, [currentUser._id, post?.likes]);

  useEffect(() => {
    getUser(post?.userId, setUser);
  }, [post?.userId]);

  const likeHandler = () => {
    likePost(currentUser._id, post?._id);
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    setShowUpdate(true);
  };

  const handleDeletePost = async () => {
    deleteFile(post.img);
    deletePost(post?._id, currentUser._id, currentUser.isAdmin);
    userPostData = userPostData.filter(
      (userPost) => userPost._id !== post?._id
    );
    localStorage.setItem("userPost", JSON.stringify(userPostData));
    sendDataToChildFromParent(userPostData);
  };

  const handleShowComment = () => {
    if (showComments) {
      setShowComments(false);
    } else {
      setShowComments(true);
    }
  };

  useEffect(() => {
    if (post) getAllComment(post?._id, setComments);
  }, [post]);

  const handleDataFormChild = (data) => {
    setDataChild(data);
  };

  const handleDataFormChildUpdated = (dataUpdated) => {
    setDataChildUpdated(dataUpdated);
  };

  const handleSavePost = async () => {
    const postData = {
      postId: post._id,
    };
    try {
      await axios.put(
        `https://backenddofscocial-1.onrender.com/api/users/${currentUser._id}/savePost`,
        postData
      );
      if (save) {
        userData.savePosts = userData.savePosts.filter((p) => p !== post._id);
        console.log(userData.savePosts.filter((p) => p !== post._id));
        setSave(false);
      } else {
        userData.savePosts.push(post._id);
        setSave(true);
      }
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.log(err);
    }
  };

  useMemo(() => {
    if (dataChildUpdated._id === post?._id) {
      if (dataChildUpdated.desc) post.desc = dataChildUpdated.desc;
      if (dataChildUpdated.img) post.img = dataChildUpdated?.img;
      setShowUpdate(false);
    }
  }, [dataChildUpdated, post]);

  const handleShowAndHideComments = async () => {
    const newPost = currentUser.isAdmin
      ? {
          isAdmin: currentUser.isAdmin,
          visibleComment: !showAndHideComments,
        }
      : {
          userId: currentUser.userId,
          visibleComment: !showAndHideComments,
        };
    try {
      await axios.put(
        `https://backenddofscocial-1.onrender.com/api/posts/${post._id}`,
        newPost
      );
      setHideComments(!hideComments);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="post">
      {showUpdate && (
        <UpdatePost
          post={post}
          sendDataToParentUpdate={handleDataFormChildUpdated}
          setShowUpdate={setShowUpdate}
        >
          <Cancel onClick={() => setShowUpdate(false)} />
        </UpdatePost>
      )}
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  userData._id === user._id
                    ? PF + userData.profilePicture
                    : PF + user.profilePicture
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post?.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {currentUser._id !== post?.userId && !currentUser.isAdmin && (
              <Button onClick={handleSavePost}>
                {save ? "unSave" : "Save"}
              </Button>
            )}
            {(currentUser._id === post?.userId || currentUser.isAdmin) && (
              <Dropdown>
                <Dropdown.Toggle variant="light">
                  <MoreVert />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleUpdatePost}>
                    Update Post
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleDeletePost}>
                    Delete Post
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleShowAndHideComments}>
                    {hideComments ? "Hide Comments" : "Show Comments"}
                  </Dropdown.Item>
                  {currentUser._id !== post?.userId && (
                    <Dropdown.Item onClick={handleSavePost}>
                      {save ? "unSave" : "Save"}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {(post?.img?.endsWith("png") ||
            post?.img?.endsWith("jpg") ||
            post?.img?.endsWith("jpeg")) && (
            <img className="postImg" src={PF + post?.img} alt="" />
          )}
          {post?.img?.endsWith("mp4") && (
            <video controls className="postImg" src={PF + post?.img} alt="" />
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            {hideComments && (
              <span className="postCommentText" onClick={handleShowComment}>
                {dataChild.length !== 0
                  ? dataChild.length + " comments"
                  : comments.length + " comments"}
              </span>
            )}
          </div>
        </div>
        {showComments && (
          <CommentsBox post={post} sendDataToParent={handleDataFormChild} />
        )}
      </div>
    </div>
  );
}
