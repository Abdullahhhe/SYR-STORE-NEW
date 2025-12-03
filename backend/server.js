require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const app = express();
const path = require("path");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// الاتصال بقاعدة البيانات
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ Connection error:", err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/dashboard", dashboardRoutes);
app.use("/", authRoutes);
const cleanupCart = require("./utils/cleanupCart");
setInterval(() => {
  cleanupCart();
}, 1000 * 60 * 60);

// هذا للسماح بقراءة x-www-form-urlencoded


// استدعاء الراوتر
const productRoute = require("./routes/product");
app.use("/api/product", productRoute);
const UserRoutes = require("./routes/users");
app.use("/api/users", UserRoutes);
const CartRoutes = require("./routes/cart");
app.use("/api/Cart", CartRoutes);
const merchantOrderRoutes = require("./routes/merchantOrder");
const adminLogRoutes = require("./routes/adminLog");
app.use("/api/merchant-orders", merchantOrderRoutes);
app.use("/api/admin-logs", adminLogRoutes);
const purchaseRoutes = require("./routes/purchase");
app.use("/api/purchase", purchaseRoutes);
const uploadRoutes = require("./routes/upload");
app.use("/api", uploadRoutes);
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ المسار يعمل بنجاح' });
});
const PORT = 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log("MONGODB URI"+ process.env.MONGO_URI);
  console.log(`🚀 Server running on port ${PORT}`);
});
