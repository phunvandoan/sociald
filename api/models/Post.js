const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      default: "",
      max: 500,
    },
    urlUploadContent: {
      type: Array,
      default: [],
    },
    likes: {
      type: Array,
      default: [],
    },
    visibleComment: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", PostSchema);
