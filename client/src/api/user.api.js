import axios from "axios";

export const getUserApi = async (userId, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/users?userId=${userId}`,
    );
    return res.data;
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
};
