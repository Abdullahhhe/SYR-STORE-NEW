import MerchantOrder from "../../../backend/models/MerchantOrder";
import mongoose from "mongoose";

export async function createMerchantOrder({
  merchantId,
  productId,
  buyerId,
  purchaseId,
  quantity,
}) {
  return await MerchantOrder.create({
    merchantId: new mongoose.Types.ObjectId(merchantId),
    productId: new mongoose.Types.ObjectId(productId),
    buyerId: new mongoose.Types.ObjectId(buyerId),
    purchaseId: new mongoose.Types.ObjectId(purchaseId),
    quantity,
    status: "جاهز للتغليف",
    timestamp: new Date(),
  });
}

export async function getOrdersByMerchant(merchantId) {
  return await MerchantOrder.find({ merchantId }).populate("productId buyerId");
}

export async function updateOrderStatus(orderId, status) {
  return await MerchantOrder.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
}
