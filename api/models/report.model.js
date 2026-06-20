const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: String,
      required: true,
    },

    targetId: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["post", "user", "comment"],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Report", ReportSchema);
