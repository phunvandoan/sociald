import { useEffect, useState } from "react";
import Post from "../../components/ui/post/Post";
import Wrapper from "../../components/wrapper/Wrapper";
import axios from "axios";

function VideoPage() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState();

  useEffect(() => {
    const getAllPost = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/posts/getPost/All",
        );
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllPost();
  }, []);
  const videoPost = posts.filter(
    (p) =>
      p?.urlUploadContent?.some((url) => url?.endsWith("mp4")) ||
      p?.img?.endsWith("mp4"),
  );
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const result = videoPost.filter((post) =>
        post.desc.toLowerCase().includes(value.toLowerCase()),
      );
      setSearchResult(result);
    } else {
      setSearchResult([...videoPost]);
    }
  };
  console.log(videoPost);
  return (
    <Wrapper sologan={"Video page"}>
      <div className="feedPage">
        <input
          placeholder="tìm kiếm bài viết"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          style={{ outline: "none", border: "none", fontSize: "20px" }}
        />
        {(searchResult ? searchResult : videoPost).map((p) => (
          <Post post={p} key={p?._id} />
        ))}
      </div>
    </Wrapper>
  );
}

export default VideoPage;
