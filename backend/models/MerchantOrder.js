const mongoose = require("mongoose");

const merchantOrderSchema = new mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Purchase" },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["جاهز للتغليف", "تم التغليف", "تم الشحن", "تم التوصيل"],
    default: "جاهز للتغليف",
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MerchantOrder", merchantOrderSchema);
