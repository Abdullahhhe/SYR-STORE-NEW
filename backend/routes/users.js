const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      number:req.body.number,
      password: hashedPassword,
      role:req.body.role,
    });
    const saveUser = await user.save();
    res.status(201).json(saveUser);
  } catch (err) {
    console.error({ message: err.message });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "توكن مفقود" });

    const decoded = jwt.verify(token, "secret_key"); // استخدم مفتاحك الحقيقي
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    res.status(200).json({ status: 1, data: user });
  } catch (err) {
    res.status(401).json({ message: "توكن غير صالح" });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "البريد غير مسجل" });
    console.log("🎯 الدور المستخرج:", user.role);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "كلمة المرور غير صحيحة" });
    console.log("🧠 بيانات المستخدم قبل إنشاء التوكن:", user);
    const payload = {
      _id: user._id.toString(),
      role: user.role,
    };
    console.log("📦 محتوى التوكن قبل التشفير:", payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    console.log("🔐 تم إنشاء التوكن:", token);
    res.status(200).json({ user, token });
  } catch (err) {
    console.error("❌ خطأ أثناء تسجيل الدخول:", err);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
});

//Get User
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "فشل في جلب البيانات" });
  }
});
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deleteUsers = await User.findByIdAndDelete(req.params.id);
    if (!deleteUsers) {
      return res.status(404).json({ massege: "The User Not Defind" });
    }
    res.status(200).json({ massege: "Down delete is True" });
  } catch (err) {
    res.status(500).json({ massege: err.massege });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "المستخدم غير موجود" });
  res.status(200).json(user);
}catch(err){
  res.status(500).json({ message: err.message });
}
});

module.exports = router;
