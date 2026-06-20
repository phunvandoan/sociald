import { useContext, useEffect } from "react";
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
import Map from "./pages/map/Map";
import Menu from "./pages/pageResponsive/menu/Menu";
import AdminDashboard from "./pages/admin/dashboard";
import ContentManagement from "./pages/admin/ContentManagement";
import EntertainmentManagement from "./pages/admin/EntertainmentManagement";
import AdminDashboardStats from "./pages/admin/AdminDashboard";
import useAppStore from "./store/useAppStore.store";
import { getUserApi } from "./api/user.api";
import DashboardAdmin from "./pages/admin/AdminDashboard";

function App() {
  const { user } = useContext(AuthContext);
  const { setUser, setUserLoading } = useAppStore();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const fetchedUser = async () => {
        const user = await getUserApi(storedUser?._id, setUserLoading);
        setUser(user);
      };
      fetchedUser();
    }
  }, []);

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
          element={
            user && !user?.isAdmin ? <SettingsPage /> : <Navigate to="/login" />
          }
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
          path="/map"
          element={user ? <Map /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/menuResponsive"
          element={user ? <Menu /> : <Navigate to="/login" />}
        ></Route>
        <Route path="/DashboardAdmin" element={<DashboardAdmin />}></Route>
        <Route
          path="/admin/ContentManagement"
          element={<ContentManagement />}
        ></Route>
        <Route
          path="/admin/EntertainmentManagement"
          element={<EntertainmentManagement />}
        ></Route>
        <Route
          path="/admin/DashboardStats"
          element={<AdminDashboardStats />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
