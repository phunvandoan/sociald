import { useEffect, useState } from "react";
import Wrapper from "../../components/wrapper/Wrapper";
import axios from "axios";
import Post from "../../components/ui/post/Post";
import "./feedpage.css";

function FeedPage() {
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
  console.log(posts);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const result = posts.filter((post) =>
        post.desc.toLowerCase().includes(value.toLowerCase()),
      );
      setSearchResult(result);
    } else {
      setSearchResult([...posts]);
    }
  };

  return (
    <>
      <Wrapper sologan={"my feed page"}>
        <div className="feedPage">
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
