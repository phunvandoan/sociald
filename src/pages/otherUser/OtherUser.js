import Topbar from "../../components/topbar/Topbar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import CardUser from "../../components/cardUser/CardUser";
import "./otherUser.css";
import { followUser, getAllUserOther } from "../../apiCall";
function OtherUser() {
  const [userOthers, setUserOthers] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);

  useEffect(() => {
    getAllUserOther(setUserOthers, currentUser._id);
  }, [currentUser]);

  const handleClick = async (userOther) => {
    followUser(
      currentUser.followings.includes(userOther?._id),
      userOther._id,
      currentUser._id,
      dispatch
    );
  };

  return (
    <>
      <Topbar></Topbar>
      <p className="sologan">
        <i>Follow more other friends </i>😉😉😉
      </p>
      <div className="otherUser">
        <div className="wrapperOtherUser">
          <ul className="listOtherUser">
            {userOthers.map((userOther) => (
              <li className="itemOtherUser" key={userOther._id}>
                <CardUser
                  userOther={userOther}
                  currentUser={currentUser}
                  handleClick={handleClick}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default OtherUser;
