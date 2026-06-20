import React, { useContext, useEffect, useState } from "react";
import Wrapper from "../../components/wrapper/Wrapper";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { AuthContext } from "../../context/AuthContext";
import { uploadImage } from "../../api/upload.api";
import axios from "axios";
import useAppStore from "../../store/useAppStore.store";

function SettingsPage() {
  const { user, setUser } = useAppStore();
  const { dispatch } = useContext(AuthContext);

  // fields (init từ user)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [desc, setDesc] = useState("");
  const [city, setCity] = useState("");
  const [from, setFrom] = useState("");
  const [relationship, setRelationship] = useState("-");

  // files
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // init data từ user
  useEffect(() => {
    if (!user) return;

    setUser(user);

    setUsername(user.username || "");
    setEmail(user.email || "");
    setDesc(user.desc || "");
    setCity(user.city || "");
    setFrom(user.from || "");
    setRelationship(user.relationship || "-");
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    if (!window.confirm("Bạn chắc chắn muốn cập nhật tài khoản?")) return;

    try {
      // CHỈ gửi field có thay đổi
      let updatedUser = {
        userId: user._id,
      };

      // chỉ update nếu user thay đổi
      if (username !== user.username) updatedUser.username = username;
      if (email !== user.email) updatedUser.email = email;
      if (desc !== user.desc) updatedUser.desc = desc;
      if (city !== user.city) updatedUser.city = city;
      if (from !== user.from) updatedUser.from = from;
      if (relationship !== user.relationship)
        updatedUser.relationship = relationship;

      if (password.trim()) {
        updatedUser.password = password;
      }

      // ================= AVATAR UPLOAD =================
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        const res = await uploadImage(formData);
        updatedUser.avatar = res[0].url;
      }

      // ================= COVER UPLOAD =================
      if (coverFile) {
        const formData = new FormData();
        formData.append("file", coverFile);

        const res = await uploadImage(formData);
        updatedUser.coverPicture = res[0].url;
      }

      // ================= UPDATE USER =================
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${user._id}`,
        updatedUser,
      );
      const userRes = res.data;
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: userRes,
      });
      alert("Update thành công!");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Update thất bại");
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response?.data || err.message,
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Bạn chắc muốn xoá tài khoản? 😥")) return;

    try {
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Wrapper sologan="Cài đặt tài khoản của tôi 😉">
      <div style={{ margin: "20px auto", maxWidth: "700px" }}>
        <Form onSubmit={handleUpdate}>
          {/* ================= ACCOUNT ================= */}
          <h4>Tài khoản</h4>

          <Form.Group className="mb-3">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Để trống nếu không thay đổi"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          {/* ================= AVATAR ================= */}
          <h4>Ảnh đại diện</h4>

          <Form.Group className="mb-3">
            <label htmlFor="avatarFile" style={{ cursor: "pointer" }}>
              <img
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : user?.avatar || ""
                }
                alt=""
                width={150}
                height={150}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </label>

            <Form.Control
              id="avatarFile"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
          </Form.Group>

          {/* ================= COVER ================= */}
          <h4>Ảnh bìa</h4>

          <Form.Group className="mb-3">
            <label htmlFor="coverFile" style={{ cursor: "pointer" }}>
              <img
                src={
                  coverFile
                    ? URL.createObjectURL(coverFile)
                    : user?.coverPicture || ""
                }
                alt=""
                width="100%"
                height={200}
                style={{
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </label>

            <Form.Control
              id="coverFile"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setCoverFile(e.target.files[0])}
            />
          </Form.Group>

          {/* ================= ABOUT ================= */}
          <h4>Về</h4>

          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Thành phố</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Từ</Form.Label>
            <Form.Control
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tình trạng quan hệ</Form.Label>
            <Form.Select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
            >
              <option value="-">-</option>
              <option value="Single">Độc thân</option>
              <option value="Married">Đã kết hôn</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary">
            Cập nhật
          </Button>
        </Form>

        <Button
          variant="danger"
          style={{ marginTop: "10px" }}
          onClick={handleDeleteAccount}
        >
          Xóa tài khoản
        </Button>
      </div>
    </Wrapper>
  );
}

export default SettingsPage;
