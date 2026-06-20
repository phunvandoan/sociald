import { useCallback, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { loginCall } from "../../apiCall";
import SignUpAndIn from "../../components/signUpAndIn/SignUpAndIn";
import { GoogleLogin } from "@react-oauth/google";
import { googleLoginApi } from "../../api/auth.api";
import useAppStore from "../../store/useAppStore.store";

function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, error, dispatch } = useContext(AuthContext);
  const { setUser } = useAppStore();

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch,
      );
    },
    [dispatch],
  );

  const handleSignInWithGoogle = async (credentialResponse) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await googleLoginApi({
        token: credentialResponse.credential,
      });
      const user = res.data;

      setUser(user);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response?.data || err.message,
      });
    }
  };

  return (
    <SignUpAndIn>
      <div></div>
      <form className="loginBox" onSubmit={handleClick} method="POST">
        {error && <Alert variant={"warning"}>email hoặc password sai</Alert>}
        <input
          className="loginInput"
          placeholder="Email"
          type="email"
          required
          ref={email}
        />
        <input
          className="loginInput"
          placeholder="Mật khẩu"
          type="password"
          minLength={6}
          required
          ref={password}
        />
        <button className="loginButton" type="submit" disabled={isFetching}>
          {isFetching ? (
            <CircularProgress color="inherit" size="20px"></CircularProgress>
          ) : (
            "Đăng nhập"
          )}
        </button>
        <Link
          to="/register"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <button className="loginRegisterButton">Tạo tài khoản</button>
        </Link>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const token = credentialResponse.credential;
            handleSignInWithGoogle(credentialResponse);
          }}
        />
      </form>
    </SignUpAndIn>
  );
}

export default Login;
