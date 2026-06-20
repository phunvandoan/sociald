const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const commentRouter = require("./routes/comments");
const reviewRouter = require("./routes/reviews");
const calendarRouter = require("./routes/calendars");
const gameRouter = require("./routes/games");
const musicRouter = require("./routes/musics");
const conversationsRoute = require("./routes/conversations");
const messagesRoute = require("./routes/messages");
const cors = require("cors");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 
  api_key: 
  api_secret: 
});

dotenv.config();
mongoose.connect(process.env.LINK_DB);

app.use(
  cors({
    // origin: "https://social-d.vercel.app",
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json()); // post data type json to db
app.use(helmet()); // security request
app.use(morgan("common")); // write log when has request

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.delete("/api/delete/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "public/images", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json("Xóa tệp tin thất bại");
    }
    return res.status(200).json("Tệp tin đã được xóa thành công");
  });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/calendars", calendarRouter);
app.use("/api/games", gameRouter);
app.use("/api/musics", musicRouter);
app.use("/api/conversations", conversationsRoute);
app.use("/api/messages", messagesRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
