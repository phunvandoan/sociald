import "./signUpAndIn.css";
function SignUpAndIn({ children }) {
  console.log("SignUpAndIn");
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SocialD</h3>
          <span className="loginDesc">
            Kết nối với bạn bè và thế giới xung quanh bạn trên SocialD.
          </span>
        </div>
        <div className="loginRight">{children}</div>
      </div>
    </div>
  );
}

export default SignUpAndIn;
