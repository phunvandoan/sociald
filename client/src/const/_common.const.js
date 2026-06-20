const RELATIONSHIP_STATUS = {
  SINGLE: "Single",
  MARRIED: "Married",
  UNKNOWN: "-",
};

export const DEFAULT_USER = {
  username: "",
  email: "",
  password: "",
  avatar: "",
  coverPicture: "",
  followers: [],
  followings: [],
  isAdmin: false,
  desc: "",
  city: "",
  from: "",
  relationship: RELATIONSHIP_STATUS.UNKNOWN,
  savePosts: [],
  googleId: null,
};
