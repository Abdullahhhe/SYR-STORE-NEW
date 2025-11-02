const jwt = require("jsonwebtoken");

// التحقق من التوكن
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "توكن غير موجود أو غير صالح" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: decoded.id, // أو decoded._id حسب التوكن
      role: decoded.role,
    };
    console.log("✅ التوكن مفكوك:", req.user);
    next(); // ✅ تأكد أن هذا السطر موجود
  } catch (err) {
    console.error("❌ خطأ في التوكن:", err.message);
    res.status(403).json({ message: "توكن غير صالح" });
  }
};

// التحقق من صلاحية الدور
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "🚫 الوصول مرفوض" });
    }
    next();
  };
};