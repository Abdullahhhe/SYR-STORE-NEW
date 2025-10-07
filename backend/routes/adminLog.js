const express = require("express");
const router = express.Router();
const AdminLog = require("../models/AdminLog");

// عرض كل السجلات للأدمن
router.get("/", async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .populate("productId buyerId merchantId");
    res.status(200).json(logs);
  } catch (error) {
    console.error("❌ خطأ في جلب السجلات:", error.message);
    res.status(500).json({ error: "فشل في جلب السجلات" });
  }
});

module.exports = router;
