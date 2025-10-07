const Cart = require("../models/Cart");

const cleanupCart = async () => {
  const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);

  const carts = await Cart.find();

  for (const cart of carts) {
    const filteredItems = cart.items.filter(item => item.addedAt > fiveHoursAgo);

    if (filteredItems.length !== cart.items.length) {
      cart.items = filteredItems;
      cart.updatedAt = new Date();
      await cart.save();
      console.log(`🧹 تم تحديث سلة المستخدم: ${cart.userId}`);
    }
  }
};

module.exports = cleanupCart;