/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { connectDB } from "../../utils/connectDB";
import Purchase from "../../../../backend/models/Purchase";

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
}
