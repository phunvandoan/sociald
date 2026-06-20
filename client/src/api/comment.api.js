import axios from "axios";

export const getCommentsApi = async (postId, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/comments/allComments/${postId}`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const postNewCommentApi = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/comments/`,
      data,
    );
    return res.data;
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
