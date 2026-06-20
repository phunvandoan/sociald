import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import useAppStore from "../../store/useAppStore.store";
import "./home.css";

function Home() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <div className="homeSidebar">
          <Sidebar />
        </div>
        <Feed />
        <div className="homeRightbar">
          <Rightbar />
        </div>
      </div>
    </>
  );
}

export default Home;
