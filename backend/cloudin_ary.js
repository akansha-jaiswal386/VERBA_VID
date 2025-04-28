const express = require("express");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// API to upload video and fetch its URL
router.post("/upload-video", upload.single("video"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Upload the video to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: "/VB",
    });

    // Save the video locally as "video.mp4"
    const localVideoPath = path.join(__dirname, "videos", "video.mp4");
    fs.renameSync(filePath, localVideoPath);

    res.status(200).json({
      message: "Video uploaded successfully",
      videoUrl: result.secure_url,
      localPath: "/videos/video.mp4", // Local path for download
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading video", error });
  }
});

// API to fetch video data for preview
router.get("/preview-video", (req, res) => {
  const videoUrl = req.query.videoUrl;
  if (!videoUrl) {
    return res.status(400).json({ message: "Video URL is required" });
  }
  res.status(200).json({ videoUrl });
});

// API to download the video
router.get("/download-video", (req, res) => {
  const localVideoPath = path.join(__dirname, "videos", "video.mp4");

  if (!fs.existsSync(localVideoPath)) {
    return res.status(404).json({ message: "Video not found" });
  }

  res.download(localVideoPath, "video.mp4", (err) => {
    if (err) {
      console.error("Error downloading video:", err);
      res.status(500).json({ message: "Error downloading video" });
    }
  });
});

module.exports = router;