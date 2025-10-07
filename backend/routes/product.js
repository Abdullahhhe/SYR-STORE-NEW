const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// إعداد تخزين الصور في مجلد uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get products by merchant ID
router.get("/merchant/:id", async (req, res) => {
  try {
    const products = await Product.find({ merchantId: req.params.id });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/filter",async(req,res)=>{
  const {category}=req.query;
  try{
    const product=await Product.find({category});
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({"message":error})
  }
})
// ✅ Add new product with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, new_price, description, quantity,color, category, merchantId } = req.body;

    if (!name || !new_price || !merchantId) {
  return res.status(400).json({ error: "الاسم والسعر ومعرف التاجر مطلوبون" });
}

const imageUrl = req.file
  ? `http://localhost:3000/uploads/${req.file.filename}`
      : null;

const product = await Product.create({
  name,
  new_price,
  description,
  category,
  quantity,
  color,
  image: imageUrl,
  merchantId: new mongoose.Types.ObjectId(merchantId),
});

res.status(201).json({ success: true, product });
  } catch (error) {
  console.error("❌ خطأ في إضافة المنتج:", error.message);
  res.status(500).json({ error: "فشل في إضافة المنتج" });
}
});

// ✅ Update product
router.put("/:id", async (req, res) => {
  try {
    const { merchantId } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    if (product.merchantId.toString() !== merchantId) {
      return res.status(403).json({ error: "ليس لديك صلاحية لتعديل هذا المنتج" });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ خطأ في التعديل:", error.message);
    res.status(500).json({ error: "فشل في تعديل المنتج" });
  }
});

// ✅ Delete product
router.delete("/:id", async (req, res) => {
  try {
    const { merchantId } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    if (product.merchantId.toString() !== merchantId) {
      return res.status(403).json({ error: "ليس لديك صلاحية لحذف هذا المنتج" });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: "✅ تم حذف المنتج" });
  } catch (error) {
    console.error("❌ خطأ في الحذف:", error.message);
    res.status(500).json({ error: "فشل في حذف المنتج" });
  }
});

module.exports = router;