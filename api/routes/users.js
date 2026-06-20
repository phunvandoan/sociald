const User = require("../models/User.model");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const Conversation = require("../models/Conversation");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Message = require("../models/Message");
const Review = require("../models/Review");
const Calendar = require("../models/Calendar");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId !== req.params.id && !req.body.isAdmin) {
    return res.status(403).json("You can update only your account!");
  }

  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update user và trả về document mới
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json("User not found");
    }

    const { password, ...userWithoutPassword } = updatedUser._doc;

    return res.status(200).json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findById(req.params.id);
      // Xóa người dùng và cập nhật danh sách followers và followings của các người dùng khác
      await Promise.all([
        User.deleteOne({ _id: req.params.id }),
        User.updateMany(
          {},
          { $pull: { followers: req.params.id } },
          { multi: true },
        ),
        User.updateMany(
          {},
          { $pull: { followings: req.params.id } },
          { multi: true },
        ),
        Review.updateMany(
          {},
          { $pull: { likeReview: req.params.id } },
          { multi: true },
        ),
      ]);
      await Conversation.deleteMany({ members: { $in: [req.params.id] } });
      await Comment.deleteMany({ userId: req.params.id });
      await Post.deleteMany({ userId: req.params.id });
      await Message.deleteMany({ sender: req.params.id });
      await Review.deleteMany({ userId: req.params.id });
      await Calendar.deleteMany({ userId: req.params.id });
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a users
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all user
router.get("/allUser/:id", async (req, res) => {
  try {
    const users = await User.find({});
    const securityUser = users
      .map((user) => {
        if (String(user._id) !== String(req.params.id)) {
          const { password, updatedAt, ...other } = user._doc;
          return other;
        }
        return null;
      })
      .filter((user) => user !== null);
    res.status(200).json(securityUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map(async (friendId) => {
        return await User.findById(friendId);
      }),
    );
    res.status(200).json(friends);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get best friends
router.get("/bestfriends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const bestFriendIds = user.followings.filter((id) =>
      user.followers.includes(id),
    );

    const bestFriends = await Promise.all(
      bestFriendIds.map(async (friendId) => {
        return await User.findById(friendId);
      }),
    );

    res.status(200).json(bestFriends);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

// save post
router.put("/:id/savePost", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user.savePosts.includes(req.body.postId)) {
      await user.updateOne({ $push: { savePosts: req.body.postId } });
      res.status(200).json("the post has been save");
    } else {
      await user.updateOne({ $pull: { savePosts: req.body.postId } });
      res.status(200).json("the post has been unSave");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get savePost
router.get("/:id/getAllSavePost", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const savePosts = await Promise.all(
      user.savePosts.map(async (savePost) => {
        return await Post.findById(savePost);
      }),
    );
    res.status(200).json(savePosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ======================
// REPORT USER
// ======================
router.put("/report/:id", async (req, res) => {
  try {
    const { reporterId, reason } = req.body;

    if (!reporterId || !reason) {
      return res.status(400).json("Thiếu reporterId hoặc reason");
    }

    if (reporterId === req.params.id) {
      return res.status(400).json("Không thể tự báo cáo chính mình");
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    user.reports.push({ reporterId, reason });
    await user.save();

    res.status(200).json("Report submitted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
