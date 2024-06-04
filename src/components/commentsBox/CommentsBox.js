import { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./commentsBox.css";
import { AuthContext } from "../../context/AuthContext";
import Comment from "../comment/Comment";
import {
  deleteComment,
  getComments,
  postNewComment,
  updateComment,
} from "../../apiCall";
function CommentsBox({ post, sendDataToParent }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComent] = useState("");
  const { user: currentUser } = useContext(AuthContext);
  const scrollRef = useRef();
  const textComment = useRef();

  useEffect(() => {
    if (post) getComments(post._id, setComments);
  }, [post]);

  useMemo(() => {
    sendDataToParent(comments);
  }, [comments, sendDataToParent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCommentOfCurrentUser = {
      postId: post._id,
      userId: currentUser._id,
      text: newComment,
    };
    postNewComment(newCommentOfCurrentUser, comments, setComments);
    setNewComent("");
  };

  const handleDelete = async (e, commentId) => {
    e.preventDefault();
    deleteComment(commentId, currentUser, comments, setComments);
  };

  const handleUpdate = async (e, commentId, UpdateText) => {
    e.preventDefault();
    updateComment(commentId, UpdateText, currentUser, comments, setComments);
    setNewComent("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [comments]);

  const handleKeyEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="commentBox">
      <div className="commentBoxWrapper">
        <div className="commentBoxTop">
          <div>
            {comments.map((comment) => (
              <div ref={scrollRef} key={comment._id}>
                <Comment
                  comment={comment}
                  onDelete={(e) => handleDelete(e, comment._id)}
                  onUpdate={(e) =>
                    handleUpdate(e, comment._id, textComment.current.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div className="commentBoxBottom">
          <textarea
            className="commentsMessageInput"
            placeholder="write something..."
            onChange={(e) => setNewComent(e.target.value)}
            onKeyDown={handleKeyEnter}
            value={newComment}
            ref={textComment}
          ></textarea>
          <button className="commentsSubmitButton" onClick={handleSubmit}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentsBox;
