import { init } from "ityped";
import { useEffect, useRef } from "react";
import "./intro.scss";

function Intro() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const textRef = useRef();

  useEffect(() => {
    init(textRef.current, {
      showCursor: true,
      backDelay: 1500,
      backSpeed: 60,
      strings: ["Developer", "Designer", "Content Creator"],
    });
  }, []);

  return (
    <div id="intro" className="intro">
      <div className="left">
        <div className="imgContainer">
          <img
            src={`https://cdn3.iconfinder.com/data/icons/social-media-2068/64/_d-512.png`}
            alt=""
          />
        </div>
      </div>
      <div className="right">
        <div className="wrapper">
          <h2>Hi There, I'm</h2>
          <h1>CodeCuaDoan</h1>
          <h3>
            MyTeam_
            <span ref={textRef}></span>
          </h3>
        </div>
        <a href="#portfolio">
          <img src={`${PF}imgCareer/down.png`} alt="" />
        </a>
      </div>
    </div>
  );
}

export default Intro;
