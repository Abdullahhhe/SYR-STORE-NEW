import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "SYR-Store",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ تم الاتصال بـ MongoDB");
  } catch (error) {
    console.error("❌ فشل الاتصال بـ MongoDB:", error.message);
  }
}
