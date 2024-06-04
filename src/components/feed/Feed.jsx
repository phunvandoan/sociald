import { useContext, useEffect, useMemo, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import { AuthContext } from "../../context/AuthContext";
import "./feed.css";
import { getPost } from "../../apiCall";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [dataChild, setDataChild] = useState([]);
  localStorage.setItem("userPost", JSON.stringify(posts));
  let userPostData = JSON.parse(localStorage.getItem("userPost"));

  //dataChildOfFeed
  const [dataChildOfShare, setdataChildOfShare] = useState([]);

  useEffect(() => {
    getPost(username, user._id, setPosts);
  }, [username, user._id]);

  const handleDataFormChild = (data) => {
    setDataChild(data);
  };
  const handleDataFormChildShare = (data) => {
    setdataChildOfShare(data);
  };

  useMemo(() => {
    if (dataChild?.length > 0) setPosts([...dataChild]);
    if (dataChildOfShare?.length > 0) setPosts([...dataChildOfShare]);
  }, [dataChild, dataChildOfShare]);

  useEffect(() => {
    if (!username) {
      localStorage.setItem(
        "postFriend",
        JSON.stringify(posts.filter((p) => p.userId !== user._id))
      );
    }
  }, [posts, username, user]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && (
          <Share sendDataToChildFromParent={handleDataFormChildShare} />
        )}
        {userPostData.map((p) => (
          <Post
            key={p._id}
            post={p}
            sendDataToChildFromParent={handleDataFormChild}
          />
        ))}
      </div>
    </div>
  );
}
