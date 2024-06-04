import { useCallback, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import { loginCall } from "../../apiCall";
import { Alert } from "react-bootstrap";
import { CircularProgress } from "@mui/material";
import SignUpAndIn from "../../components/signUpAndIn/SignUpAndIn";

function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, error, dispatch } = useContext(AuthContext);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      );
    },
    [dispatch]
  );

  return (
    <SignUpAndIn>
      <form className="loginBox" onSubmit={handleClick} method="POST">
        {error && <Alert variant={"warning"}>email or password wrong</Alert>}
        <input
          className="loginInput"
          placeholder="Email"
          type="email"
          required
          ref={email}
        />
        <input
          className="loginInput"
          placeholder="Password"
          type="password"
          minLength={6}
          required
          ref={password}
        />
        <button className="loginButton" type="submit" disabled={isFetching}>
          {isFetching ? (
            <CircularProgress color="inherit" size="20px"></CircularProgress>
          ) : (
            "Log In"
          )}
        </button>
        <span className="loginForgot">Forgot Password?</span>
        <Link to="/register" style={{ marginLeft: "30%" }}>
          <button className="loginRegisterButton">Create a New Account"</button>
        </Link>
      </form>
    </SignUpAndIn>
  );
}

export default Login;
