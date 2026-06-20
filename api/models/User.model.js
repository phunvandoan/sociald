const mongoose = require("mongoose");

const DEFAULT_IMAGE_USER =
  "https://res.cloudinary.com/dfyildfst/image/upload/v1781866052/social-app/images/xtg0dfib1uy8irv2c72d.jpg";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    avatar: {
      type: String,
      default: DEFAULT_IMAGE_USER,
    },
    coverPicture: {
      type: String,
      default: DEFAULT_IMAGE_USER,
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: String,
      enum: ["Single", "Married", "-"],
    },
    savePosts: {
      type: Array,
      default: [],
    },
    googleId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
