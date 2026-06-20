import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const DashboardAdmin = () => {
  const { user: currentUser } = useContext(AuthContext);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (currentUser?._id) {
      getReports();
    }
  }, [currentUser]);

  const getReports = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8800/api/reports", {
        params: {
          userId: currentUser._id,
        },
      });

      setReports(res.data.data || []);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 403) {
        alert("Bạn không có quyền truy cập");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchType = typeFilter === "all" || report.type === typeFilter;

      const matchSearch =
        report.reason?.toLowerCase().includes(search.toLowerCase()) ||
        report.targetId?.toLowerCase().includes(search.toLowerCase()) ||
        report.reporterId?.toLowerCase().includes(search.toLowerCase());

      return matchType && matchSearch;
    });
  }, [reports, search, typeFilter]);

  const totalReports = reports.length;

  const userReports = reports.filter((r) => r.type === "user").length;

  const postReports = reports.filter((r) => r.type === "post").length;

  const commentReports = reports.filter((r) => r.type === "comment").length;

  const userPercent = totalReports > 0 ? (userReports / totalReports) * 100 : 0;

  const postPercent = totalReports > 0 ? (postReports / totalReports) * 100 : 0;

  const handleDeleteReport = async (report) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa nội dung vi phạm này?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8800/api/reports/${report._id}/content`,
        {
          data: {
            adminId: currentUser._id,
          },
        },
      );

      setReports((prev) => prev.filter((item) => item._id !== report._id));

      alert("Xóa thành công");
    } catch (err) {
      console.log(err);

      alert(err?.response?.data?.message || "Không thể xóa nội dung");
    }
  };

  return (
    <div className="dash-container">
      <header className="dash-header">
        <div className="header-brand">Admin Dashboard</div>

        <div className="header-user">
          <span>
            Xin chào, <strong>Quản trị viên</strong>
          </span>

          <div className="badge-admin">Admin</div>
        </div>
      </header>

      <div className="dash-layout">
        <aside className="dash-sidebar">
          <div className="sidebar-title">⚡ HỆ THỐNG QUẢN TRỊ</div>

          <ul className="sidebar-links">
            <li
              className={activeTab === "dashboard" ? "active-link" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              📊 Dashboard
            </li>

            <li
              className={activeTab === "reports" ? "active-link" : ""}
              onClick={() => setActiveTab("reports")}
            >
              🛡️ Báo cáo vi phạm
            </li>

            <li className={activeTab === "users" ? "active-link" : ""}>
              <Link to={"/"}>👥 Trang Người Dùng</Link>
            </li>
          </ul>
        </aside>

        <main className="dash-main-content">
          {/* ================= DASHBOARD ================= */}
          {activeTab === "dashboard" && (
            <>
              <div className="dash-page-header">
                <h2>📊 Tổng quan hệ thống báo cáo</h2>

                <p>
                  Thống kê nhanh các báo cáo vi phạm được gửi từ người dùng.
                </p>
              </div>

              <div className="summary-grid">
                <div className="sum-box">
                  <span className="sum-title">Tổng Report</span>

                  <span className="sum-value">{totalReports}</span>
                </div>

                <div className="sum-box">
                  <span className="sum-title">Report User</span>

                  <span className="sum-value">{userReports}</span>
                </div>

                <div className="sum-box">
                  <span className="sum-title">Report Post</span>

                  <span className="sum-value">{postReports}</span>
                </div>

                <div className="sum-box">
                  <span className="sum-title">Report Comment</span>

                  <span className="sum-value">{commentReports}</span>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h3>📈 Tỷ lệ báo cáo trong hệ thống</h3>

                  <div className="circle-chart-wrapper">
                    <div
                      className="circle-pie"
                      style={{
                        background: `conic-gradient(
                        #ef4444 0% ${userPercent}%,
                        #f59e0b ${userPercent}% ${userPercent + postPercent}%,
                        #3b82f6 ${userPercent + postPercent}% 100%
                      )`,
                      }}
                    >
                      <div className="circle-inner-hole-text">
                        <strong>{totalReports}</strong>

                        <span>Reports</span>
                      </div>
                    </div>
                  </div>

                  <div className="chart-legends">
                    <div className="legend-item">
                      <span
                        className="legend-color"
                        style={{
                          backgroundColor: "#ef4444",
                        }}
                      />

                      <span className="legend-label">User ({userReports})</span>
                    </div>

                    <div className="legend-item">
                      <span
                        className="legend-color"
                        style={{
                          backgroundColor: "#f59e0b",
                        }}
                      />

                      <span className="legend-label">Post ({postReports})</span>
                    </div>

                    <div className="legend-item">
                      <span
                        className="legend-color"
                        style={{
                          backgroundColor: "#3b82f6",
                        }}
                      />

                      <span className="legend-label">
                        Comment ({commentReports})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-data-section">
                <h3>📌 Báo cáo gần đây</h3>

                <div className="table-responsive">
                  <table className="mod-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Reason</th>
                        <th>Ngày tạo</th>
                      </tr>
                    </thead>

                    <tbody>
                      {reports.slice(0, 5).map((report) => (
                        <tr key={report._id}>
                          <td>
                            <span className={`type-tag tag-${report.type}`}>
                              {report.type}
                            </span>
                          </td>

                          <td>{report.reason}</td>

                          <td>
                            {new Date(report.createdAt).toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ================= REPORTS ================= */}
          {activeTab === "reports" && (
            <>
              <div className="dash-page-header">
                <h2>🛡️ Danh sách báo cáo vi phạm</h2>

                <p>
                  Quản lý và theo dõi toàn bộ báo cáo User, Post và Comment.
                </p>
              </div>

              <div className="filter-wrapper">
                <input
                  className="search-input"
                  placeholder="Tìm lý do, reporter hoặc target..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  className="filter-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>

                  <option value="user">Người dùng</option>

                  <option value="post">Bài viết</option>

                  <option value="comment">Bình luận</option>
                </select>
              </div>

              <div className="table-responsive">
                <table className="mod-table">
                  <thead>
                    <tr>
                      <th>Người báo cáo</th>

                      <th>ID Mục tiêu</th>

                      <th>Loại</th>

                      <th>Lý do</th>

                      <th>Tạo lúc</th>

                      <th>Hành động</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="no-data">
                          Đang tải...
                        </td>
                      </tr>
                    ) : filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <tr key={report._id}>
                          <td>{report.reporterId}</td>

                          <td>{report.targetId}</td>

                          <td>
                            <span className={`type-tag tag-${report.type}`}>
                              {report.type}
                            </span>
                          </td>

                          <td>{report.reason}</td>

                          <td>
                            {new Date(report.createdAt).toLocaleString("vi-VN")}
                          </td>

                          <td>
                            <button
                              className="btn-delete-report"
                              onClick={() => handleDeleteReport(report)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ================= USERS ================= */}
          {activeTab === "users" && (
            <>
              <div className="dash-page-header">
                <h2>👥 Quản lý người dùng</h2>

                <p>Chức năng đang được phát triển.</p>
              </div>

              <div className="sum-box">
                <span className="sum-title">
                  Module quản lý người dùng sẽ hiển thị tại đây.
                </span>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
