"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "./Header";

export default function MyPurchases() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        if (typeof window === "undefined") return;

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user?.id) {
            alert("❌ يجب تسجيل الدخول لعرض المشتريات");
            setLoading(false);
            return;
        }

        fetch(`${apiUrl} / purchase / user / ${user.id}`)
            .then(async (res) => {
                const contentType = res.headers.get("content-type");

                if (!res.ok) {
                    let errorInfo;
                    if (contentType && contentType.includes("application/json")) {
                        errorInfo = await res.json();
                    } else {
                        errorInfo = await res.text();
                    }

                    throw new Error("❌ فشل في جلب البيانات: " + errorInfo);
                }

                if (contentType && contentType.includes("application/json")) {
                    return res.json();
                } else {
                    throw new Error("❌ الاستجابة ليست بصيغة JSON");
                }
            })
            .then((data) => {
                if (!data.purchases || data.purchases.length === 0) {
                    setPurchases([]);
                } else {
                    setPurchases(data.purchases);
                }
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
            <div className="bg-gray-100 min-h-screen p-6 mt-[-20px]">
                <h1 className="text-3xl font-bold text-center">📦 مشترياتي</h1>
                {loading ? (
                    <p className="text-center text-gray-500">جاري تحميل المشتريات...</p>
                ) : purchases.length === 0 ? (
                    <p className="text-center text-gray-500">لا توجد مشتريات حتى الآن</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {purchases.map((purchase) => (
                            <div key={purchase._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={purchase.productId?.image || "/default.jpg"}
                                        alt={purchase.productId?.name || "منتج"}
                                        fill
                                        className="object-cover"
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