const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Purchase = require("../models/Purchase");
const MerchantOrder = require("../models/MerchantOrder");
const AdminLog = require("../models/AdminLog");

// إنشاء عملية شراء
router.post("/", async (req, res) => {
  const { productId, quantity, buyerId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "الكمية غير متوفرة" });
    }

    // تحديث المخزون
    product.stock -= quantity;
    await product.save();

    // إنشاء سجل للمشتري
    const purchase = await Purchase.create({
      buyerId: new mongoose.Types.ObjectId(buyerId),
      productId: product._id,
      quantity,
      total: quantity * product.new_price,
      status: "قيد التحضير",
      timestamp: new Date(),
    });

    // إرسال نسخة للتاجر
    const merchantOrder = await MerchantOrder.create({
      merchantId: product.merchantId,
      productId: product._id,
      quantity,
      buyerId: new mongoose.Types.ObjectId(buyerId),
      purchaseId: purchase._id,
      status: "جاهز للتغليف",
      timestamp: new Date(),
    });

    // إرسال سجل للأدمن
    await AdminLog.create({
      action: "شراء منتج",
      productId: product._id,
      quantity,
      buyerId: new mongoose.Types.ObjectId(buyerId),
      merchantId: product.merchantId,
      purchaseId: purchase._id,
      merchantOrderId: merchantOrder._id,
      timestamp: new Date(),
    });

    res.status(201).json({ success: true, purchase });
  } catch (error) {
    console.error("❌ خطأ في تثبيت الشراء:", error.message);
    res.status(500).json({ error: "فشل في تثبيت الشراء" });
  }
});

// عرض مشتريات مستخدم معين
router.get("/user/:id", async (req, res) => {
  try {
    const purchases = await Purchase.find({ buyerId: req.params.id }).populate(
      "productId"
    );
    res.status(200).json(purchases);
  } catch (error) {
    console.error("❌ خطأ في جلب المشتريات:", error.message);
    res.status(500).json({ error: "فشل في جلب المشتريات" });
  }
});

module.exports = router;
