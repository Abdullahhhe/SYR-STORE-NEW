const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (_, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "لم يتم رفع أي صورة" });
    }

    const imageUrl = `https://syr-store-new.onrender.com/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
});

module.exports = router;