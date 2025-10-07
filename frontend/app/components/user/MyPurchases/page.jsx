"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../../Header";

export default function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user?.id) {
    alert("❌ يجب تسجيل الدخول لعرض المشتريات");
    setLoading(false);
    return;
  }

  fetch(`/api/purchases?userId=${user.id}`)
    .then(async (res) => {
        const text = await res.text();
        console.log("📦 استجابة الخادم:", text);
        console.log("📦 حالة الاستجابة:", res.status);
        throw new Error("حدث خطأ أثناء جلب البيانات");
      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        let errorInfo;
        if (contentType && contentType.includes("application/json")) {
          errorInfo = await res.json();
        } else {
          errorInfo = await res.text();
        }

        const error = new Error("حدث خطأ أثناء جلب البيانات");
        error.status = res.status;
        error.info = errorInfo;
        throw error;
      }

      if (contentType && contentType.includes("application/json")) {
        return res.json();
      } else {
        throw new Error("الاستجابة ليست بصيغة JSON");
      }
    })
    .then((data) => {
      if (!data.purchases || data.purchases.length === 0) {
        throw new Error("لا يوجد طلبات للعرض");
      }
      setPurchases(data.purchases);
      setLoading(false);
    })
    .catch((err) => {
      console.error("❌ خطأ في جلب المشتريات:", err);
      setLoading(false);
    });
}, []);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6 mt-[-10px]">
        <h1 className="text-3xl font-bold text-center mb-8">📦 مشترياتي</h1>

        {loading ? (
          <p className="text-center text-gray-500">جاري تحميل المشتريات...</p>
        ) : purchases.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد مشتريات حتى الآن</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <div key={purchase._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 relative">
                  <Image
                    src={purchase.productId?.image || "/default.jpg"}
                    alt={purchase.productId?.name || "منتج"}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {purchase.productId?.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    السعر: {purchase.total}$ ({purchase.quantity} قطعة)
                  </p>
                  <p className="text-sm text-gray-500">
                    الحالة: {purchase.status}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    تم الشراء بتاريخ: {new Date(purchase.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}