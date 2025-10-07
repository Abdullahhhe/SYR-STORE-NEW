const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");

router.post("/", async (req, res) => {
  const { productId, quantity, buyerId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "المنتج غير موجود" });

    if (product.stock < quantity) {
      return res.status(400).json({ error: "الكمية غير متوفرة" });
    }

    product.stock -= quantity;
    await product.save();

    const purchase = await Purchase.create({
      buyerId,
      productId,
      quantity,
      total: quantity * product.new_price,
      status: "قيد التحضير",
    });

    res.status(201).json({ success: true, purchase });
  } catch (error) {
    console.error("❌ خطأ في إنشاء الشراء:", error.message);
    res.status(500).json({ error: "فشل في تثبيت الشراء" });
  }
});
