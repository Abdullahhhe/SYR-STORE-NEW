'use client';
import Header from "./Header";
import { useState, useEffect } from "react";

export default function Popular() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // ✅ تحميل بيانات المستخدم
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                if (!parsed || !parsed.id) return;
                fetch(`${apiUrl}/purchase/user/${parsed.id}`)
                    .then((res) => res.json())
                    .then((data) => setProducts(data))
                    .catch((error) => console.error("❌ خطأ في جلب الطلبات:", error));
            }
        }
    }, []);

    // ✅ جلب الطلبات
    return (
        <div >
            <Header />
            <div className="pt-[10px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto px-[10%] rounded-lg bg-gray-100">
                {products.length === 0 ? (
                    <p className="text-center text-gray-500 col-span-full">لا توجد طلبات حتى الآن</p>
                ) : (
                    products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-neutral-100 rounded-md shadow-md hover:shadow-lg transition-all cursor-pointer pb-3"
                        >
                            <img
                                className="w-full h-[180px] object-cover"
                                src={product.productId.image}
                                alt={product.productId.name}
                            />
                            <div className="text-right px-2" dir="rtl">
                                <h1>عدد القطع المطلوبة: {product.quantity}</h1>
                                <h1>حالة الطلب: {product.status}</h1>
                                <h1>السعر الكلي: ${product.total}</h1>
                                <h1>الملاحظات: {product.description || "لا توجد"}</h1>
                            </div>
                            <hr />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}