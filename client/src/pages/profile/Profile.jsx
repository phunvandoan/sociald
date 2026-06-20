import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { InsertPhoto, Person, Flag } from "@mui/icons-material";
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

const REPORT_REASONS = [
  "Spam hoặc lừa đảo",
  "Ngôn từ thù ghét / quấy rối",
  "Nội dung khiêu dâm, phản cảm",
  "Giả mạo danh tính",
  "Bạo lực, kích động",
  "Khác",
];

export default function Profile() {
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState();
  const username = useParams().username;
  let userData = JSON.parse(localStorage.getItem("user"));
  const [showUpdateInfo, setShowUpdateInfo] = useState(false);
  const descInputRef = useRef();
  const cityInputRef = useRef();
  const fromInputRef = useRef();
  const relationshipInputRef = useRef();

  // ===== Báo cáo vi phạm =====
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetail, setReportDetail] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    getUserByName(username, setUser);
  }, [username]);

  const isOwnProfile = currentUser?.username === username;

  const handleSubmitReport = async () => {
    if (!currentUser?._id || !user?._id || reportSubmitting) return;

    const reason =
      reportReason === "Khác" && reportDetail.trim()
        ? reportDetail.trim()
        : reportReason;

    setReportSubmitting(true);

    try {
      await axios.post("http://localhost:8800/api/reports", {
        reporterId: currentUser._id,
        targetId: user._id,
        reason,
        type: "user",
      });

      alert("Đã gửi báo cáo, cảm ơn bạn đã phản hồi!");

      setShowReportForm(false);
      setReportReason(REPORT_REASONS[0]);
      setReportDetail("");
    } catch (err) {
      console.log(err);

      alert(
        err?.response?.data?.message ||
          "Gửi báo cáo thất bại, vui lòng thử lại sau.",
      );
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <>
      <Topbar />
      <div className="profile">
        <div className="homeSidebar">
          <Sidebar />
        </div>
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {/* Cover */}
              <Link target="_blank" to={user?.coverPicture}>
                <img
                  className="profileCoverImg"
                  src={user?.coverPicture}
                  alt=""
                />
              </Link>
              {/* Avartar */}
              <Link to={user?.avatar} target="_blank">
                <img
                  className="profileUserImg"
                  src={user?.avatar?.split("=")[0]}
                  alt=""
                />
              </Link>
            </div>

            <div className="profileInfo">
              {user && (
                <div className="profileInfo">
                  <h4 className="profileInfoName">{user.username}</h4>
                  <span className="profileInfoDesc">{user.desc}</span>
                </div>
              )}

              {/* Không cho tự báo cáo chính mình */}
              {!isOwnProfile && user && (
                <button
                  className="reportButton"
                  onClick={() => setShowReportForm((prev) => !prev)}
                >
                  <Flag style={{ fontSize: 16 }} />
                  {showReportForm ? "Đóng" : "Báo cáo vi phạm"}
                </button>
              )}
            </div>

            {showReportForm && (
              <div className="reportForm">
                <label className="reportLabel">Lý do báo cáo</label>

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

                {reportReason === "Khác" && (
                  <textarea
                    className="reportDetailInput"
                    placeholder="Mô tả chi tiết vi phạm..."
                    value={reportDetail}
                    onChange={(e) => setReportDetail(e.target.value)}
                  />
                )}

                <div className="reportFormActions">
                  <button
                    className="reportCancelButton"
                    onClick={() => setShowReportForm(false)}
                  >
                    Hủy
                  </button>

                  <button
                    className="reportSubmitButton"
                    onClick={handleSubmitReport}
                    disabled={reportSubmitting}
                  >
                    {reportSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
