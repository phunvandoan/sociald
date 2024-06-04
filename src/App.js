import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import { AuthContext } from "./context/AuthContext";
import OtherUser from "./pages/otherUser/OtherUser";
import FollowUser from "./pages/followUser/FollowUser";
import Notification from "./pages/notification/Notification";
import FeedPage from "./pages/feedPage/FeedPage";
import VideoPage from "./pages/videoPage/VideoPage";
import AboutUs from "./pages/aboutUs/AboutUs";
import SettingsPage from "./pages/settingPage/SettingsPage";
import Reviews from "./pages/reviews/Reviews";
import EventPage from "./pages/event/EventPage";
import GamePage from "./pages/gamePage/GamePage";
import SavePostPage from "./pages/savePost/SavePostPage";
import PlayListPage from "./pages/playListPage/PlayListPage";
import Career from "./pages/careers/Career";
import Map from "./pages/map/Map";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />

        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/messenger"
          element={!user ? <Navigate to="/" /> : <Messenger />}
        />
        <Route
          path="/profile/:username"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/feedPage"
          element={user ? <FeedPage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/otherUser"
          element={user ? <OtherUser /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/followUser"
          element={user ? <FollowUser /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/notification"
          element={user ? <Notification /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/videoPage"
          element={user ? <VideoPage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/aboutUs"
          element={user ? <AboutUs /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/reviews"
          element={user ? <Reviews /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/settingsPage"
          element={user ? <SettingsPage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/eventsPage"
          element={user ? <EventPage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/gamePage"
          element={user ? <GamePage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/savePostPage"
          element={user ? <SavePostPage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/playListPage"
          element={user ? <PlayListPage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/career"
          element={user ? <Career /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/map"
          element={user ? <Map /> : <Navigate to="/login" />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;

/* <Route path="/profile/:username" element={<Profile />} /> */
/* <Route path="/register" element={<Register />} /> */
/* <Route path="/login" element={<Login />} /> */

/* <Route path="/feedPage" element={<FeedPage />}></Route>
        <Route path="/otherUser" element={<OtherUser />}></Route>
        <Route path="/followUser" element={<FollowUser />}></Route>
        <Route path="/notification" element={<Notification />}></Route>
        <Route path="/videoPage" element={<VideoPage />}></Route>
        <Route path="/groupPage" element={<GroupPage />}></Route>
        <Route path="/aboutUs" element={<AboutUs />}></Route> */
