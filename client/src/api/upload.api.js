import axios from "axios";

export const uploadImage = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/uploads/image`,
      data,
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const uploadVideo = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/uploads/video`,
      data,
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const uploadAudio = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/uploads/audio`,
      data,
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
