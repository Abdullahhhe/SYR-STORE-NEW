const mongoose = require("mongoose");
const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "userId و productId مطلوبان" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "userId غير صالح" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    let cart = await Cart.findOne({ userId: userObjectId });

    if (cart) {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }

      await cart.save();
    } else {
      cart = await Cart.create({
        userId: userObjectId,
        items: [{ productId, quantity: 1 }],
      });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("❌ Error in addToCart:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId مطلوب" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "userId غير صالح" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const cart = await Cart.findOne({ userId: userObjectId }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.status(200).json({ cart: { userId, items: [] } });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("❌ Error in getCart:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "userId و productId مطلوبان" });
    }

    const result = await Cart.updateOne(
      { userId },
      { $pull: { items: { "productId": productId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "لم يتم العثور على المنتج في السلة" });
    }

    res.status(200).json({ message: "✅ تم حذف المنتج من السلة" });
  } catch (error) {
    console.error("خطأ في الحذف:", error);
    res.status(500).json({ error: "حدث خطأ أثناء الحذف" });
  }
};

module.exports = { addToCart, getCart, deleteCart };
