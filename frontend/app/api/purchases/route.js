import { NextResponse } from "next/server";

// مثال وهمي للبيانات، لأن الاتصال الحقيقي بـ MongoDB يتم من خلال backend
const mockPurchases = [
  {
    _id: "1",
    buyerId: "123",
    productId: {
      name: "منتج تجريبي",
      price: 100,
    },
  },
  {
    _id: "2",
    buyerId: "123",
    productId: {
      name: "منتج آخر",
      price: 150,
    },
  },
];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    // تصفية البيانات التجريبية حسب userId
    const purchases =mockPurchases.filter(p => p.buyerId === userId);
    return NextResponse.json({ purchases });
  } catch (err) {
    console.log(err);
  }
}

/*import { NextResponse } from "next/server";
import { connectDB } from "@/utils/connectDB";
import Purchase from "@/models/Purchase";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    const purchases = await Purchase.find({ buyerId: userId }).populate(
      "productId"
    );
    return NextResponse.json({ purchases });
  } catch(err) {
    return NextResponse.json(
      { err: "فشل في جلب المشتريات" },
      { status: 500 }
    );
  }
}*/