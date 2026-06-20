const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// IMAGE
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "social-app/images",
    resource_type: "image",
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/image", uploadImage.array("file"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json("No files uploaded");
    }

    const result = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// VIDEO
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "social-app/videos",
    resource_type: "video",
  },
});

const uploadVideo = multer({ storage: videoStorage });

router.post("/video", uploadVideo.array("file"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json("No files uploaded");
    }

    const result = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// AUDIO
const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "social-app/audios",
    resource_type: "video",
  },
});

const uploadAudio = multer({ storage: audioStorage });

router.post("/audio", uploadAudio.array("file"), async (req, res) => {
  try {
    const result = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// DELETE
router.delete("/:publicId", async (req, res) => {
  try {
    await cloudinary.uploader.destroy(decodeURIComponent(req.params.publicId), {
      resource_type: "auto",
    });

    res.status(200).json("Deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
