import axios from "axios";

export const googleLoginApi = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/google`,
      data,
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};
