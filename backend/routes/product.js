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

router.get('/debug', async (req, res) => {
  try {
    const dbName = mongoose.connection.name;
    const collectionName = Product.collection.name;
    const raw = await mongoose.connection.db.collection(collectionName).findOne({});
    res.json({
      database: dbName,
      collection: collectionName,
      rawDocument: raw || 'لا يوجد مستندات',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    console.log('🧾 اسم المجموعة المستخدمة:', Product.collection.name);
    const products = await Product.find({});
    console.log("📦 المنتجات المسترجعة:", products);
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
  ? `http://localhost:5000/uploads/${req.file.filename}`
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
const { authenticate } = require("../middleware/authMiddleware"); // تأكد من وجود هذا الميدلوير

router.delete("/:id", authenticate, async (req, res) => {
  console.log("📥 تم الوصول إلى مسار الحذف");
  try {
    const productId = req.params.id;

    // تحقق من صلاحية معرف المنتج
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "معرف المنتج غير صالح" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    // تحقق من وجود معرف التاجر داخل المنتج
    if (!product.merchantId) {
      return res.status(400).json({ error: "المنتج لا يحتوي على معرف التاجر" });
    }

    // تحقق من وجود المستخدم داخل التوكن
    if (!req.user || !req.user._id || !req.user.role) {
  return res.status(401).json({ error: "المستخدم غير مصرح له" });
}

const userId = req.user._id.toString();
const userRole = req.user.role;
const isOwner = product.merchantId.toString() === userId;
const isAdmin = userRole === "admin";
    console.log("📦 المنتج:", product);
    console.log("👤 المستخدم:", req.user);
    console.log("🔍 المنتج.merchantId:", product.merchantId?.toString());
    console.log("🔍 المستخدم._id:", req.user._id?.toString());
    console.log("🔍 الدور:", req.user.role);
// تحقق من صلاحية الحذف
if (!isOwner && !isAdmin) {
  return res.status(403).json({ error: "ليس لديك صلاحية لحذف هذا المنتج" });
}

await Product.deleteOne({ _id: productId });
res.status(200).json({ success: true, message: "✅ تم حذف المنتج بنجاح" });
  } catch (err) {
  console.error("❌ خطأ أثناء الحذف:", err);
  res.status(500).json({ error: "فشل في حذف المنتج" });
}
});


module.exports = router;