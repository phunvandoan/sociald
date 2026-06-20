import axios from "axios";

export const createPost = async (
  newPost,
  userPostData,
  sendDataToChildFromParent,
) => {
  try {
    const res = await axios.post("http://localhost:8800/api/posts", newPost);
    userPostData = [res.data, ...userPostData];
    localStorage.setItem("userPost", JSON.stringify(userPostData));
    sendDataToChildFromParent(userPostData);
    console.log(userPostData);
  } catch (error) {
    console.log(error);
  }
};
