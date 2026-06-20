const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/posts");
const commentRouter = require("./routes/comments");
const reviewRouter = require("./routes/reviews");
const calendarRouter = require("./routes/calendars");
const gameRouter = require("./routes/games");
const musicRouter = require("./routes/musics");
const conversationsRoute = require("./routes/conversations");
const uploadsRoute = require("./routes/uploads");
const messagesRoute = require("./routes/messages");
const reportRoute = require("./routes/report.route");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

dotenv.config();
mongoose.connect(process.env.LINK_DB);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
  cors({
    // origin: "https://social-d.vercel.app",
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

//middleware
app.use(express.json()); // post data type json to db
app.use(helmet()); // security request
app.use(morgan("common")); // write log when has request

// routes
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
app.use("/api/uploads", uploadsRoute);
app.use("/api/reports", reportRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
