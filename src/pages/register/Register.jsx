import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./register.css";
import { useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import SignUpAndIn from "../../components/signUpAndIn/SignUpAndIn";
import { register } from "../../apiCall";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      setShowError(true);
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      register(user, navigate);
    }
  };

  return (
    <>
      <SignUpAndIn>
        <form className="registerBox" onSubmit={handleClick}>
          {showError && <Alert variant={"warning"}>Password don't match</Alert>}
          <input
            className="registerInput"
            placeholder="Username"
            type="text"
            required
            ref={username}
          />
          <input
            className="registerInput"
            placeholder="Email"
            type="email"
            required
            ref={email}
          />
          <input
            className="registerInput"
            placeholder="Password"
            type="password"
            required
            ref={password}
            minLength={6}
            onChange={() => setShowError(false)}
          />
          <input
            className="registerInput"
            placeholder="Password Again"
            type="password"
            required
            ref={passwordAgain}
            onChange={() => setShowError(false)}
          />
          <button className="registerButton" type="submit">
            Sign Up
          </button>
          <Link to="/login" style={{ marginLeft: "30%" }}>
            <button className="loginRegisterButton">Log into Account</button>
          </Link>
        </form>
      </SignUpAndIn>
    </>
  );
}
