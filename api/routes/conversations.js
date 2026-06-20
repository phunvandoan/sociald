const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// ======================
// CREATE PRIVATE CHAT
// ======================

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
    isGroup: false,
  });

  try {
    const savedConversation = await newConversation.save();

    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ======================
// CREATE GROUP CHAT
// ======================

router.post("/group", async (req, res) => {
  try {
    const conversation = new Conversation({
      name: req.body.name,
      members: req.body.members,
      admin: req.body.admin,
      isGroup: true,
    });

    const saved = await conversation.save();

    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ======================
// GET GROUP BY ID
// ======================

router.get("/group/:id", async (req, res) => {
  try {
    const group = await Conversation.findById(req.params.id);

    res.status(200).json(group);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ======================
// GET USER CONVERSATIONS
// ======================

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: {
        $in: [req.params.userId],
      },
    });

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ======================
// FIND PRIVATE CHAT
// ======================

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: {
        $all: [req.params.firstUserId, req.params.secondUserId],
      },
      isGroup: false,
    });

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ======================
// DELETE ALL USER CHATS
// ======================

router.delete("/delete/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    await Conversation.deleteMany({
      members: {
        $in: [userId],
      },
    });

    res.status(200).json("Conversations deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

// ======================
// DELETE PRIVATE CHAT
// ======================

router.delete("/delete/:firstUserId/:secondUserId", async (req, res) => {
  try {
    await Conversation.deleteOne({
      members: {
        $all: [req.params.firstUserId, req.params.secondUserId],
      },
      isGroup: false,
    });

    res.status(200).json("Conversation deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

// ======================
// LEAVE GROUP
// ======================
router.put("/group/:id/leave", async (req, res) => {
  try {
    const { userId } = req.body;
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json("Group not found");
    }

    conversation.members = conversation.members.filter((m) => m !== userId);

    if (conversation.admin === userId && conversation.members.length > 0) {
      conversation.admin = conversation.members[0];
    }

    await Message.deleteMany({
      conversationId: conversation._id.toString(),
      sender: userId,
    });

    if (conversation.members.length === 0) {
      await conversation.deleteOne();
      await Message.deleteMany({ conversationId: req.params.id });
      return res.status(200).json("Group deleted (no members left)");
    }

    const updated = await conversation.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});
