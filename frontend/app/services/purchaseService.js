import Purchase from "../../../backend/models/Purchase";
import Product from "../../../backend/models/Product";
import mongoose from "mongoose";

export async function createPurchase({ buyerId, productId, quantity }) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("المنتج غير موجود");

  if (product.stock < quantity) throw new Error("الكمية غير متوفرة");

  product.stock -= quantity;
  await product.save();

  const purchase = await Purchase.create({
    buyerId: new mongoose.Types.ObjectId(buyerId),
    productId: product._id,
    quantity,
    total: quantity * product.new_price,
    status: "قيد التحضير",
    timestamp: new Date(),
  });

  return purchase;
}

export async function getUserPurchases(userId) {
  await connectDB();
  return await Purchase.find({ buyerId: userId }).populate("productId");
}
