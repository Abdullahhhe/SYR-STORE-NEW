const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const MerchantOrder = require("../models/MerchantOrder");

// ✅ التحقق من صلاحية ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 📦 عرض الطلبات الخاصة بتاجر معين
router.get("/merchant/:id", async (req, res) => {
  const merchantId = req.params.id;

  if (!isValidObjectId(merchantId)) {
    return res.status(400).json({ error: "معرف التاجر غير صالح" });
  }

  try {
    const orders = await MerchantOrder.find({ merchantId })
      .populate("productId buyerId");

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ خطأ في جلب طلبات التاجر:", error.message);
    res.status(500).json({ error: "فشل في جلب الطلبات" });
  }
});

// 🚚 تحديث حالة الطلب (مثلاً: تم التغليف، تم الشحن)
router.put("/:id", async (req, res) => {
  const orderId = req.params.id;

  if (!isValidObjectId(orderId)) {
    return res.status(400).json({ error: "معرف الطلب غير صالح" });
  }

  try {
    const updated = await MerchantOrder.findByIdAndUpdate(
      orderId,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ خطأ في تحديث الطلب:", error.message);
    res.status(500).json({ error: "فشل في تحديث الطلب" });
  }
});

module.exports = router;