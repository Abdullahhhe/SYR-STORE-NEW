const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// إعداد Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Multer للتخزين المؤقت
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "لم يتم رفع أي صورة" });
        }

        // رفع الصورة إلى Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "syr-store", // مجلد داخل حسابك
        });

        // حذف الملف المؤقت
        fs.unlinkSync(req.file.path);

        // إرسال الرابط النهائي  
        console.log("Cloudinary config:", process.env.CLOUD_NAME, process.env.CLOUD_API_KEY);
        res.status(200).json({ imageUrl: result.secure_url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;