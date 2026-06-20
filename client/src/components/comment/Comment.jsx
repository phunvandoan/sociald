import { format } from "timeago.js";
import "./comment.css";
import { memo, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Delete, Update } from "@mui/icons-material";
import { getUser } from "../../apiCall";
import axios from "axios";
import { MoreVert, Report } from "@mui/icons-material";
import { Dropdown } from "react-bootstrap";

function Comment({ comment, onDelete, onUpdate }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("Spam");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const REPORT_REASONS = [
    "Spam",
    "Nội dung phản cảm",
    "Quấy rối / Bắt nạt",
    "Thông tin sai sự thật",
    "Ngôn từ thù ghét",
    "Khác",
  ];

  useEffect(() => {
    getUser(comment?.userId, setUser);
  }, [comment]);

  const handleSubmitReport = async () => {
    if (!currentUser?._id || !comment?._id || reportSubmitting) return;

    setReportSubmitting(true);

    try {
      await axios.post("http://localhost:8800/api/reports", {
        reporterId: currentUser._id,
        targetId: comment._id,
        reason: reportReason,
        type: "comment",
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

  return (
    <div className="comment" key={comment?._id}>
      <div className="commentTop">
        <img className="commentImg" src={user?.avatar} alt="" />
        <div className="commentTextbox">
          <b className="commentName">{user?.username}</b> <br />
          <div className="commentText">{comment?.text}</div>
        </div>
        <div className="commentTime">{format(comment?.createdAt)}</div>
        {user._id !== currentUser._id && !currentUser.isAdmin && (
          <button
            className="buttonReportComment"
            onClick={() => setShowReportForm(true)}
            title="Báo cáo bình luận"
          >
            <Report fontSize="small" />
          </button>
        )}
      </div>
      {(user._id === currentUser._id || currentUser.isAdmin) && (
        <div className="wrapperSettingComment">
          <button className="buttonSettingComment" onClick={onDelete}>
            <Delete />
            <span className="settingComment">xóa</span>
          </button>
          <button className="buttonSettingComment" onClick={onUpdate}>
            <Update />
            <span className="settingComment">cập nhật</span>
          </button>
        </div>
      )}
      {showReportForm && (
        <div className="reportModal" onClick={() => setShowReportForm(false)}>
          <div className="reportContent" onClick={(e) => e.stopPropagation()}>
            <h3>Báo cáo bình luận</h3>

            <select
              className="reportSelect"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              {REPORT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>

            <div className="reportActions">
              <button
                className="reportCancelBtn"
                onClick={() => setShowReportForm(false)}
              >
                Hủy
              </button>

              <button
                className="reportSubmitBtn"
                onClick={handleSubmitReport}
                disabled={reportSubmitting}
              >
                {reportSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Comment);
