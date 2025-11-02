const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Purchase = require("../models/Purchase");
const MerchantOrder = require("../models/MerchantOrder");
const AdminLog = require("../models/AdminLog");

// إنشاء عملية شراء
router.post("/", async (req, res) => {
  const { productId, quantity,description, buyerId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ error: "الكمية غير متوفرة" });
    }

    // تحديث المخزون
    product.quantity -= quantity;
    await product.save();

    // إنشاء سجل للمشتري
    const purchase = await Purchase.create({
      buyerId: new mongoose.Types.ObjectId(buyerId),
      productId: product._id,
      quantity,
      description,
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
      description,
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
      description,
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
const { authenticate } = require("../middleware/authMiddleware");

// ✅ تعديل حالة الطلب بواسطة الأدمن فقط
router.put("/:id", authenticate, async (req, res) => {
  try {
    // تحقق من أن المستخدم أدمن
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "❌ ليس لديك صلاحية لتعديل حالة الطلب" });
    }

    const { status } = req.body;

    const updated = await Purchase.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "❌ الطلب غير موجود" });
    }

    res.status(200).json({ message: "✅ تم تعديل حالة الطلب", updated });
  } catch (error) {
    console.error("❌ خطأ في تعديل الطلب:", error.message);
    res.status(500).json({ error: "فشل في تعديل الطلب" });
  }
});

// ✅ حذف سجل شراء بواسطة الأدمن فقط
router.delete("/:id",authenticate,  async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "❌ الطلب غير موجود أو تم حذفه مسبقًا" });
    }

    res.status(200).json({ message: "✅ تم حذف الطلب بنجاح بواسطة الأدمن", deleted });
  } catch (error) {
    console.error("❌ خطأ في حذف الطلب:", error.message);
    res.status(500).json({ error: "فشل في حذف الطلب" });
  }
});
module.exports = router;
