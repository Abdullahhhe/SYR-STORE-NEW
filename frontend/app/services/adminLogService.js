import AdminLog from "@/models/AdminLog";
import mongoose from "mongoose";

export async function createAdminLog({
  action,
  productId,
  quantity,
  buyerId,
  merchantId,
  purchaseId,
  merchantOrderId,
}) {
  return await AdminLog.create({
    action,
    productId: new mongoose.Types.ObjectId(productId),
    quantity,
    buyerId: new mongoose.Types.ObjectId(buyerId),
    merchantId: new mongoose.Types.ObjectId(merchantId),
    purchaseId: new mongoose.Types.ObjectId(purchaseId),
    merchantOrderId: new mongoose.Types.ObjectId(merchantOrderId),
    timestamp: new Date(),
  });
}

export async function getRecentAdminLogs() {
  return await AdminLog.find()
    .sort({ timestamp: -1 })
    .limit(100)
    .populate("productId buyerId merchantId");
}
