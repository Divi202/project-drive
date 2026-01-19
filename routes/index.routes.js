const express = require("express");
const upload = require("../config/multer.config");
const fileModel = require("../models/files.models");
const authMiddleware = require("../middlewares/auth");
const supabase = require("../config/supabase.config");

const router = express.Router();

router.get("/home", authMiddleware, async (req, res) => {
  const userFiles = await fileModel.find({
    user: req.user.userId,
  });
  res.render("home.ejs", {
    files: userFiles,
  });
});

router.post(
  "/upload-file",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    // res.send(req.file);

    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded.");

    // 2. Generate a unique filename
    const fileName = `${Date.now()}-${file.originalname}`;

    // 3. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("drive") // Ensure this bucket exists in Supabase
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) return res.status(400).send(error.message);

    // Use Supabase file path instead of local path
    const newFile = await fileModel.create({
      path: `drive/${fileName}`,
      originalname: file.originalname,
      user: req.user.userId,
    });
    res.json(newFile);
  },
);

//timestamp: 4:02:49
router.get("/download/:path", authMiddleware, async (req, res) => {
  const loggedInUserId = req.user.userId;
  const path = req.params.path;
  console.log(path);

  const file = await fileModel.findOne({
    user: loggedInUserId,
    path: path,
  });

  if (!file) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
});
module.exports = router;
