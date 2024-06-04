import { useEffect, useState } from "react";
import Wrapper from "../../components/wrapper/Wrapper";
import axios from "axios";
import Post from "../../components/post/Post";

function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState();
  useEffect(() => {
    const getAllPost = async () => {
      try {
        const res = await axios.get(
          "https://backenddofscocial-1.onrender.com/api/posts/getPost/All"
        );
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllPost();
  }, []);
  console.log(posts);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const result = posts.filter((post) =>
        post.desc.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResult(result);
    } else {
      setSearchResult([...posts]);
    }
  };

  return (
    <>
      <Wrapper sologan={"my feed page"}>
        <div style={{ margin: "0 120px" }}>
          <input
            placeholder="search post"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            style={{ outline: "none", border: "none", fontSize: "20px" }}
          />
          {(searchResult ? searchResult : posts).map((p) => (
            <Post post={p} key={p?._id} />
          ))}
        </div>
      </Wrapper>
    </>
  );
}

export default FeedPage;
