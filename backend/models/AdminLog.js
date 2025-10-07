const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Purchase" },
  merchantOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MerchantOrder",
  },
  quantity: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.AdminLog || mongoose.model("AdminLog", adminLogSchema);
