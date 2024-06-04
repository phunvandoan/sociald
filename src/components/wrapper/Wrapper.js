import { memo } from "react";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import "./wrapper.css";

function Wrapper({ sologan, children }) {
  return (
    <>
      <Topbar></Topbar>
      <div className="wrapp">
        <div className="wrapperSideBar">
          <Sidebar />
        </div>
        <div className="wrapperContainer">
          <p className="sologan">
            <i>{sologan}</i>
          </p>
          {children}
        </div>
      </div>
    </>
  );
}

export default memo(Wrapper);
