const express = require("express");
const cors = require("cors");
const ImageKit = require("imagekit");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ImageKit setup
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.file.buffer;
  const fileName = req.file.originalname;

  imagekit
    .upload({
      file: file,
      fileName: fileName,
    })
    .then((response) => {
      res.json({ url: response.url });
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Upload failed", details: error });
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
