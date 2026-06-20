import { useContext, useEffect, useRef, useState } from "react";
import "./commentsBox.css";
import { AuthContext } from "../../context/AuthContext";
import Comment from "../comment/Comment";
import { deleteComment, getComments, updateComment } from "../../apiCall";
import { postNewCommentApi } from "../../api/comment.api";
import useAppStore from "../../store/useAppStore.store";

function CommentsBox({ post, sendDataToParent }) {
  const [newComment, setNewComent] = useState("");
  const { user: currentUser } = useContext(AuthContext);
  const scrollRef = useRef();
  const textComment = useRef();

  const {
    setComments: setCommentsFromStore,
    setCommentLoading,
    comments: storedComments,
  } = useAppStore();

  const comments = storedComments;
  const setComments = setCommentsFromStore;

  useEffect(() => {
    if (post) {
      getComments(post._id, setComments);
    }
  }, [post, setComments]);

  useEffect(() => {
    sendDataToParent(comments);
  }, [comments, sendDataToParent]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCommentOfCurrentUser = {
      postId: post?._id,
      userId: currentUser?._id,
      text: newComment,
    };

    const commentsRes = await postNewCommentApi(
      newCommentOfCurrentUser,
      setCommentLoading,
    );

    if (commentsRes) {
      setComments([...comments, commentsRes]);
    }

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
            placeholder="viết gì đó..."
            onChange={(e) => setNewComent(e.target.value)}
            onKeyDown={handleKeyEnter}
            value={newComment}
            ref={textComment}
          />

          <button className="commentsSubmitButton" onClick={handleSubmit}>
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentsBox;
