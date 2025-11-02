const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quantity: { type: Number, default: 1 },
  total: { type: Number },
  status: { type: String, default: "تم التثبيت" },
  timestamp: { type: Date, default: Date.now },
  description: String
});

module.exports =
  mongoose.models?.Purchase || mongoose.model("Purchase", purchaseSchema);
