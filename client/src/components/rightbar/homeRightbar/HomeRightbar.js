import { Link } from "react-router-dom";
import Online from "../../online/Online";
import "./homeRightbar.css";

function HomeRightbar({ friendsOfCurrentUser }) {
  return (
    <>
      <Link to="/aboutUs">
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Bạn có muốn tìm hiểu thêm về chúng tôi không?</b>
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.jpg" alt="" />
        <h4 className="rightbarTitle">Bạn bè của bạn</h4>
      </Link>
      <ul className="rightbarFriendList">
        {friendsOfCurrentUser.slice(0, 7).map((u) => (
          <Online key={u._id} user={u} disabledOnline={true} />
        ))}
      </ul>
    </>
  );
}

export default HomeRightbar;
