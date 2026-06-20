const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json("wrong credentails");
      return;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword) {
      res.status(400).json("wrong credentails");
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

const client = new OAuth2Client(process.env.CLIENT_ID_GG_OAUTH);
// GOOGLE LOGIN
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID_GG_OAUTH,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: name,
        email,
        password: "google-auth",
        avatar: picture,
        googleId: sub,
      });

      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
