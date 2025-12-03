'use client';
import { useState, useEffect } from "react";
import Header from "./HeaderMerchant";

export default function MerchantOrder() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                if (!parsed || !parsed.id) return;
                fetch(`${apiUrl}/merchant-orders/merchant/${parsed.id}`)
                    .then((res) => res.json())
                    .then((data) => setProducts(data))
                    .catch((error) => console.error("❌ خطأ في جلب الطلبات:", error));
            }
        }
    }, []);


    const openShow = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowModel(true);
    };

    const handleUpdate = async () => {
        try {
            await fetch(`${apiUrl}/merchant-orders/${selectedOrder._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            alert("✅ تم تعديل حالة الطلب");
            setShowModel(false);

            // تحديث الحالة محليًا
            setProducts((prev) =>
                prev.map((p) =>
                    p._id === selectedOrder._id ? { ...p, status: newStatus } : p
                )
            );
        } catch (error) {
            console.error("❌ خطأ أثناء التعديل:", error);
            alert("حدث خطأ أثناء تعديل حالة الطلب");
        }
    };
    console.log(products);
    const total = products.reduce(
        (sum, p) => sum + p.productId.new_price * p.quantity
        , 0
    );
    const siteFee = (total / 10) / 2;

    return (
        <div className="w-full">
            <Header />
            <div className="mt-[20px] max-w-7xl mx-auto ml-[10%] mr-[10%] rounded-lg bg-gray-100 p-4 text-center">
                {products.length === 0 ? (
                    <p className="text-gray-600 text-lg font-semibold" dir="rtl">لا يوجد طلبات حالياً</p>
                ) : (
                    <div dir="rtl" className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto ml-[10%] mr-[10%] rounded-lg bg-gray-100 text-right" >
                        {products.map((product) => (
                            <div key={product._id} className="bg-neutral-100 h-[100%] rounded-md shadow-md shadow-gray-500 hover:shadow-lg transition-all hover:cursor-pointer pb-3 " >
                                <img className="w-[100%] h-[180px]" src={product.productId.image} alt="صورة المنتج" />
                                <div className="text-right px-2" dir="rtl">
                                    <h1>عدد القطع المطلوبة: {product.quantity}</h1>
                                    <h1>اسم المشتري: {product.buyerId.name}</h1>
                                    <h1>رقم المشتري: {product.buyerId.number || 'لا يوجد'}</h1>
                                    <h1>أجمالي السعر: {product.productId.new_price * product.quantity}</h1>
                                    <h1>
                                        حالة الطلب: {product.status}
                                        <button
                                            className="bg-green-500 transition-all duration-200 hover:bg-green-700 cursor-pointer ml-2 px-1 py-1 text-white rounded mr-[10px] h-[26px]"
                                            onClick={() => openShow(product)}
                                        >
                                            تعديل
                                        </button>
                                    </h1>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[300px] text-right" dir="rtl">
                        <h2 className="mb-4 font-bold">تعديل حالة الطلب</h2>
                        <select
                            className="border rounded w-full mb-4 p-2"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <option value="تم التغليف">تم التغليف</option>
                            <option value="تم الشحن">تم الشحن</option>
                            <option value="تم التوصيل">تم التوصيل</option>
                        </select>
                        <div className="flex justify-end">
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded"
                                onClick={handleUpdate}
                            >
                                تأكيد التعديل
                            </button>
                            <button
                                className="ml-2 text-red-500"
                                onClick={() => setShowModel(false)}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {products.length > 0 && (
                <div className="text-right mr-[10%] mt-[30px]" dir="rtl">
                    <p className="font-bold">أجمالي المبيعات: ${total}</p>
                    <p className="font-bold">نسبة الموقع: ${siteFee}</p>
                </div>
            )}
        </div>
    );
}