import { useContext, useEffect, useMemo, useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import "./post.css";
import { Cancel, MoreVert } from "@mui/icons-material";
import { AuthContext } from "../../../context/AuthContext";
import UpdatePost from "../../settingsPost/updatePost/UpdatePost";
import { Dropdown } from "react-bootstrap";
import CommentsBox from "../../commentsBox/CommentsBox";
import { getUser, likePost, getAllComment, deletePost } from "../../../apiCall";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { getCommentsApi } from "../../../api/comment.api";
import useAppStore from "../../../store/useAppStore.store";

const REPORT_REASONS = [
  "Spam",
  "Nội dung phản cảm",
  "Quấy rối / Bắt nạt",
  "Thông tin sai sự thật",
  "Ngôn từ thù ghét",
  "Khác",
];

export default function Post({ post, sendDataToChildFromParent }) {
  const { setComments, comments, commentLoading, setCommentLoading } =
    useAppStore();
  const [like, setLike] = useState(post?.likes?.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("Spam");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const [showUpdate, setShowUpdate] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [dataChild, setDataChild] = useState([]);
  const [dataChildUpdated, setDataChildUpdated] = useState([]);
  const [openGallery, setOpenGallery] = useState(false);

  let userData = JSON.parse(localStorage.getItem("user"));
  let userPostData = JSON.parse(localStorage.getItem("userPost"));

  const [save, setSave] = useState(userData.savePosts.includes(post._id));

  const [hideComments, setHideComments] = useState(post.visibleComment);
  let showAndHideComments = post.visibleComment;

  const mediaUrls = post?.urlUploadContent?.length
    ? post.urlUploadContent
    : post?.img
      ? [post.img]
      : [];

  const getMediaUrl = (url) => (url?.startsWith("http") ? url : PF + url);

  const isVideoUrl = (url) => /\.(mp4|webm|ogg|mov|avi)$/i.test(url);

  const firstMedia = mediaUrls[0];

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
    deletePost(post?._id, currentUser._id, currentUser.isAdmin);

    userPostData = userPostData.filter(
      (userPost) => userPost._id !== post?._id,
    );

    localStorage.setItem("userPost", JSON.stringify(userPostData));
    sendDataToChildFromParent(userPostData);
  };

  const handleShowComment = () => {
    setShowComments((prev) => !prev);
  };

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
        `http://localhost:8800/api/users/${currentUser._id}/savePost`,
        postData,
      );

      if (save) {
        userData.savePosts = userData.savePosts.filter((p) => p !== post._id);
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

      if (dataChildUpdated.urlUploadContent) {
        post.urlUploadContent = dataChildUpdated.urlUploadContent;
      } else if (dataChildUpdated.img) {
        post.img = dataChildUpdated.img;
      }

      setShowUpdate(false);
    }
  }, [dataChildUpdated, post]);

  const handleShowAndHideComments = async () => {
    const newPost = {
      isAdmin: currentUser.isAdmin,
      userId: currentUser._id,
      visibleComment: !showAndHideComments,
    };

    try {
      await axios.put(`http://localhost:8800/api/posts/${post._id}`, newPost);

      setHideComments(!hideComments);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitReport = async () => {
    if (!currentUser?._id || !post?._id || reportSubmitting) return;

    setReportSubmitting(true);

    try {
      await axios.post("http://localhost:8800/api/reports", {
        reporterId: currentUser._id,
        targetId: post._id,
        type: "post",
        reason: reportReason,
      });

      alert("Đã gửi báo cáo thành công!");
      setShowReportForm(false);
    } catch (err) {
      console.log(err);

      alert(err?.response?.data?.message || "Không thể gửi báo cáo.");
    } finally {
      setReportSubmitting(false);
    }
  };

  useEffect(() => {
    if (!post?._id) return;

    const fetchData = async () => {
      const res = await getCommentsApi(post._id, setCommentLoading);

      if (res) setComments(res);
    };

    fetchData();
  }, [post?._id]);

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
              <img className="postProfileImg" src={user?.avatar} alt="" />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post?.createdAt)}</span>
          </div>

          <div className="postTopRight">
            {(currentUser._id === post?.userId || currentUser.isAdmin) && (
              <Dropdown>
                <Dropdown.Toggle variant="light">
                  <MoreVert />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleUpdatePost}>
                    Cập nhật bài viết
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleDeletePost}>
                    Xóa bài viết
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleShowAndHideComments}>
                    {hideComments ? "Ẩn bình luận" : "Hiện bình luận"}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            {currentUser._id !== post?.userId && !currentUser.isAdmin && (
              <Dropdown>
                <Dropdown.Toggle variant="light">
                  <MoreVert />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleSavePost}>
                    {save ? "Bỏ lưu" : "Lưu bài viết"}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setShowReportForm(true)}>
                    Báo cáo vi phạm
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>

        <div className="postCenter">
          <span className="postText">{post?.desc}</span>

          {mediaUrls.length > 0 && (
            <>
              <div className="postGallery" onClick={() => setOpenGallery(true)}>
                {mediaUrls.slice(0, 3).map((url, i) => (
                  <div key={i} className="postGalleryItem">
                    {isVideoUrl(url) ? (
                      <video
                        className="postGalleryMedia"
                        src={getMediaUrl(url)}
                      />
                    ) : (
                      <img
                        className="postGalleryMedia"
                        src={getMediaUrl(url)}
                        alt=""
                      />
                    )}

                    {i === 2 && mediaUrls.length > 3 && (
                      <div className="postMoreOverlay">
                        +{mediaUrls.length - 3} khác
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {openGallery && (
            <div className="postOverlay" onClick={() => setOpenGallery(false)}>
              <div
                className="postOverlayContent"
                onClick={(e) => e.stopPropagation()}
              >
                {mediaUrls.map((url, i) => (
                  <div key={i} className="postOverlayItem">
                    {isVideoUrl(url) ? (
                      <video
                        controls
                        className="postOverlayMedia"
                        src={getMediaUrl(url)}
                      />
                    ) : (
                      <img
                        className="postOverlayMedia"
                        src={getMediaUrl(url)}
                        alt=""
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`/assets/heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} người đã thích</span>
          </div>

          <div className="postBottomRight">
            {hideComments && (
              <span
                style={{ userSelect: "none" }}
                className="postCommentText"
                onClick={handleShowComment}
              >
                {`${comments?.length} bình luận`}
              </span>
            )}
          </div>
        </div>

        {showComments && (
          <CommentsBox post={post} sendDataToParent={handleDataFormChild} />
        )}
      </div>
      {showReportForm && (
        <div className="reportModal">
          <div className="reportContent">
            <h4>Báo cáo bài viết</h4>

            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              {REPORT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setShowReportForm(false)}
              >
                Hủy
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmitReport}
                disabled={reportSubmitting}
              >
                {reportSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
