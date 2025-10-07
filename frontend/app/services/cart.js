import Cart from "@/models/Cart";
import mongoose from "mongoose";
import { connectDB } from "@/utils/connectDB";

// جلب السلة
export async function getCart(userId) {
  await connectDB();
  return await Cart.findOne({ userId }).populate("items.productId");
}

// إضافة منتج
export async function addToCart(userId, productId, quantity = 1) {
  await connectDB();
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId: new mongoose.Types.ObjectId(userId),
      items: [{ productId, quantity }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
  }

  return cart;
}

// حذف منتج
export async function removeFromCart(userId, productId) {
  await connectDB();
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  await cart.save();

  return cart;
}
