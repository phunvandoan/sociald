const router = require("express").Router();
const Report = require("../models/report.model");
const UserModel = require("../models/User.model");

router.post("/", async (req, res) => {
  try {
    const { reporterId, targetId, reason, type } = req.body;

    if (!reporterId || !targetId || !reason || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const report = new Report({
      reporterId,
      targetId,
      reason,
      type,
    });

    const savedReport = await report.save();

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: savedReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admin can access reports",
      });
    }

    const reports = await Report.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/:reportId/content", async (req, res) => {
  try {
    const { adminId } = req.body;

    const admin = await User.findById(adminId);

    if (!admin || !admin.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admin can perform this action",
      });
    }

    const report = await Report.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    switch (report.type) {
      case "comment":
        await Comment.findByIdAndDelete(report.targetId);
        break;

      case "post":
        await Comment.deleteMany({
          postId: report.targetId,
        });

        await User.updateMany(
          {},
          {
            $pull: {
              savePosts: report.targetId,
            },
          },
        );

        await Post.findByIdAndDelete(report.targetId);
        break;

      case "user":
        await User.findByIdAndDelete(report.targetId);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid report type",
        });
    }

    await Report.findByIdAndDelete(report._id);

    res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
