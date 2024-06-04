import { Mail, Person } from "@mui/icons-material";
import "./topbar.scss";
import { Link } from "react-router-dom";

function Topbar({ menuOpen, setMenuOpen }) {
  return (
    <div className={"topbar " + (menuOpen && "active")}>
      <div className="wrapper">
        <div className="left">
          <Link to="/" className="logo">
            Social_D&T
          </Link>
          <div className="itemContainer">
            <Person className="icon" />
            <span>++123 456 789</span>
          </div>
          <div className="itemContainer">
            <Mail className="icon" />
            <span>codecuadoan@gmail.com</span>
          </div>
        </div>
        <div className="right">
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="line1"></span>
            <span className="line2"></span>
            <span className="line3"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
