import React, { useContext, useState } from "react";
import Wrapper from "../../components/wrapper/Wrapper";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function SettingsPage() {
  // State hooks to store user information
  const [username, setUsername] = useState("");
  const { user: currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      window.confirm(
        "bạn có chắc muốn updated tài khoản chứ sau khi update sẽ phải đăng nhập lại"
      )
    ) {
      try {
        const data = {
          userId: currentUser._id,
          username: username,
          email: email,
          password: password,
        };
        await axios.put(
          `https://backenddofscocial-1.onrender.com/api/users/${currentUser._id}`,
          data
        );
        localStorage.clear();
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (window.confirm("bạn có chắc muốn xoá tài khoản chứ 😥😥😥 ")) {
      try {
        await axios.delete(
          `https://backenddofscocial-1.onrender.com/api/users/${currentUser._id}`,
          {
            data: {
              userId: currentUser._id,
            },
          }
        );
        localStorage.clear();
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Wrapper sologan={"setting my acount 😉😉😉"}>
      <div style={{ margin: "0 50px" }}>
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>User name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {!currentUser.isAdmin && (
          <Button
            variant="danger"
            type="Button"
            onClick={handleDeleteAccount}
            style={{ marginTop: "10px" }}
          >
            Delete Accout
          </Button>
        )}
      </div>
    </Wrapper>
  );
}

export default SettingsPage;
