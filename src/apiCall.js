import axios from "axios";

// User call api
export const loginCall = async (userCredentail, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(
      "https://backenddofscocial-1.onrender.com/api/auth/login",
      userCredentail
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

export const followUser = async (followed, userId, currentUserId, dispatch) => {
  try {
    if (followed) {
      await axios.put(
        "https://backenddofscocial-1.onrender.com/api/users/" +
          userId +
          "/unfollow",
        { userId: currentUserId }
      );
      dispatch({ type: "UNFOLLOW", payload: userId });
    } else {
      await axios.put(
        "https://backenddofscocial-1.onrender.com/api/users/" +
          userId +
          "/follow",
        {
          userId: currentUserId,
        }
      );
      dispatch({ type: "FOLLOW", payload: userId });
    }
  } catch (err) {
    console.log(err);
  }
};

export const register = async (user, navigate) => {
  try {
    await axios.post(
      "https://backenddofscocial-1.onrender.com/api/auth/register",
      user
    );
    navigate("/login");
  } catch (err) {
    console.log(err);
  }
};

export const getAllUserOther = async (setUserOthers, currentUserId) => {
  try {
    const useOther = await axios.get(
      `https://backenddofscocial-1.onrender.com/api/users/allUser/${currentUserId}`
    );
    setUserOthers(useOther.data);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (userId, setUser) => {
  const res = await axios.get(
    `https://backenddofscocial-1.onrender.com/api/users?userId=${userId}`
  );
  setUser(res.data);
};

export const getfriendList = async (userId, setFriends) => {
  try {
    const friendList = await axios.get(
      "https://backenddofscocial-1.onrender.com/api/users/friends/" + userId
    );
    setFriends(friendList.data);
  } catch (err) {
    console.log(err);
  }
};

export const getUserByName = async (username, setUser) => {
  try {
    const res = await axios.get(
      `https://backenddofscocial-1.onrender.com/api/users?username=${username}`
    );
    setUser(res.data);
  } catch (error) {
    console.log(error);
  }
};

export const updateAvatar = async (
  userId,
  newUser,
  fileName,
  userData,
  setUser,
  data
) => {
  try {
    upload(data);
    await axios.put(
      `https://backenddofscocial-1.onrender.com/api/users/${userId}`,
      newUser
    );
    setUser((prevUser) => ({ ...prevUser, profilePicture: fileName }));
    userData.profilePicture = fileName;
    localStorage.setItem("user", JSON.stringify(userData));
  } catch (err) {
    console.log(err);
  }
};

export const udpateCoverPicture = async (
  userId,
  newUser,
  fileName,
  setUser,
  data
) => {
  try {
    upload(data);
    await axios.put(
      `https://backenddofscocial-1.onrender.com/api/users/${userId}`,
      newUser
    );
    setUser((prevUser) => ({ ...prevUser, coverPicture: fileName }));
  } catch (err) {
    console.log(err);
  }
};

// comment call api
export const getComments = async (postId, setComments) => {
  try {
    const res = await axios.get(
      "https://backenddofscocial-1.onrender.com/api/comments/allComments/" +
        postId
    );
    setComments(res.data);
  } catch (error) {
    console.log(error);
  }
};

export const postNewComment = async (
  newCommentOfCurrentUser,
  comments,
  setComments
) => {
  try {
    const res = await axios.post(
      "https://backenddofscocial-1.onrender.com/api/comments/",
      newCommentOfCurrentUser
    );
    setComments([...comments, res.data]);
  } catch (err) {
    console.log(err);
  }
};

export const deleteComment = async (
  commentId,
  currentUser,
  comments,
  setComments
) => {
  try {
    await axios.delete(
      `https://backenddofscocial-1.onrender.com/api/comments/${commentId}`,
      {
        data: { userId: currentUser._id, isAdmin: currentUser.isAdmin },
      }
    );
    setComments(comments.filter((comment) => comment._id !== commentId));
  } catch (err) {
    console.log(err);
  }
};

export const updateComment = async (
  commentId,
  UpdateText,
  currentUser,
  comments,
  setComments
) => {
  try {
    await axios.put(
      `https://backenddofscocial-1.onrender.com/api/comments/${commentId}`,
      currentUser.isAdmin
        ? {
            isAdmin: currentUser.isAdmin,
            text: UpdateText,
          }
        : {
            userId: currentUser._id,
            text: UpdateText,
          }
    );
    setComments(
      comments.map((comment) => {
        if (comment._id === commentId) {
          return { ...comment, text: UpdateText };
        }
        return comment;
      })
    );
  } catch (err) {
    console.log(err);
  }
};

export const getAllComment = async (postId, setComments) => {
  try {
    const res = await axios.get(
      "https://backenddofscocial-1.onrender.com/api/comments/allComments/" +
        postId
    );
    setComments(res.data);
  } catch (error) {
    console.log(error);
  }
};

// post call api
export const getPost = async (username, userId, setPosts) => {
  const res = username
    ? await axios.get(
        "https://backenddofscocial-1.onrender.com/api/posts/profile/" + username
      )
    : await axios.get(
        "https://backenddofscocial-1.onrender.com/api/posts/timeline/" + userId
      );
  setPosts(res.data.reverse());
};

export const likePost = async (userId, postId) => {
  try {
    await axios.put(
      "https://backenddofscocial-1.onrender.com/api/posts/" + postId + "/like",
      {
        userId: userId,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (postId, userId, isAdmin) => {
  try {
    await axios.delete(
      `https://backenddofscocial-1.onrender.com/api/posts/${postId}`,
      {
        data: { isAdmin: isAdmin, userId: userId },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const updatePost = async (postId, newPost) => {
  try {
    await axios.put(
      `https://backenddofscocial-1.onrender.com/api/posts/${postId}`,
      newPost
    );
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async (
  newPost,
  userPostData,
  sendDataToChildFromParent
) => {
  try {
    const res = await axios.post(
      "https://backenddofscocial-1.onrender.com/api/posts",
      newPost
    );
    userPostData = [res.data, ...userPostData];
    localStorage.setItem("userPost", JSON.stringify(userPostData));
    sendDataToChildFromParent(userPostData);
    console.log(userPostData);
  } catch (error) {
    console.log(error);
  }
};

// upload
export const upload = async (data) => {
  try {
    await axios.post(
      "https://backenddofscocial-1.onrender.com/api/upload",
      data
    );
    console.log("updateSuccess");
  } catch (err) {
    console.log(err);
  }
};

//deletefile
export const deleteFile = async (fileName) => {
  try {
    await axios.delete(
      `https://backenddofscocial-1.onrender.com/api/delete/${fileName}`
    );
  } catch (err) {
    console.log(err);
  }
};
