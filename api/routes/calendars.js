const router = require("express").Router();
const Calendar = require("../models/Calendar");
const User = require("../models/User.model");

// create a calendar
router.post("/", async (req, res) => {
  const newCalendar = new Calendar(req.body);
  try {
    const saveCalendar = await newCalendar.save();
    res.status(200).json(saveCalendar);
  } catch (err) {
    res.status(500).json(err);
  }
});

// udpate a calendar
router.put("/:id", async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id);
    if (calendar.userId === req.body.userId) {
      await calendar.updateOne({ $set: req.body });
      res.status(200).json("The caledar has been udpated");
    } else {
      res.status(403).json("you can updated only your calendar");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a calendar
router.delete("/:id", async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id);
    if (calendar.userId === req.body.userId) {
      await calendar.deleteOne();
      res.status(200).json("the calendar has been deleted");
    } else {
      res.status(403).json("you can delete only your calendar");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get allCalendar
router.get("/getAll/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const calendars = await Calendar.find({ userId: user._id });
    res.status(200).json(calendars);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
