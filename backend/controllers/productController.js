const Product = require("../models/Product");
const mongoose = require("mongoose");

// ✅ جلب جميع المنتجات
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب المنتجات" });
  }
};

// ✅ إنشاء منتج جديد مع صورة
exports.createProduct = async (req, res) => {
  try {
    const { name, new_price, description, category, merchantId } = req.body;

    if (!name || !new_price || !merchantId) {
      return res.status(400).json({ error: "الاسم والسعر ومعرف التاجر مطلوبون" });
    }

    const imageUrl = req.file
      ? `http://localhost:3000/api/uploads/${req.file.filename}`
      : "";

    const product = await Product.create({
      name,
      new_price,
      description,
      category,
      image: imageUrl,
      merchantId: new mongoose.Types.ObjectId(merchantId),
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ خطأ في إنشاء المنتج:", err.message);
    res.status(500).json({ message: "❌ فشل في إنشاء المنتج" });
  }
};

// ✅ تعديل منتج
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { merchantId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    if (product.merchantId.toString() !== merchantId) {
      return res.status(403).json({ error: "ليس لديك صلاحية لتعديل هذا المنتج" });
    }

    const updated = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ خطأ في التعديل:", err.message);
    res.status(500).json({ message: "❌ فشل في تعديل المنتج" });
  }
};

// ✅ حذف منتج
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { merchantId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    if (product.merchantId.toString() !== merchantId) {
      return res.status(403).json({ error: "ليس لديك صلاحية لحذف هذا المنتج" });
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "✅ تم حذف المنتج بنجاح" });
  } catch (err) {
    console.error("❌ خطأ في الحذف:", err.message);
    res.status(500).json({ message: "❌ فشل في حذف المنتج" });
  }
};