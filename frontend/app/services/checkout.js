// pages/api/checkout.js
import dbConnect from "../../lib/dbConnect";
import Order from "../../models/Order";
import Cart from "../../models/Cart";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const session = await getSession({ req });
    const userId = session?.user?.id;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "السلة فارغة" });
    }

    await Order.create({ userId, items: cart.items, status: "تم التثبيت" });
    await Cart.deleteOne({ userId });

    return res.status(200).json({ message: "تم تثبيت الشراء بنجاح" });
  }

  res.status(405).end();
}
