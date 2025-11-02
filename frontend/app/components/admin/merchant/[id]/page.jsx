'use client';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import List from "../../../../dashboard/list/page";

export default function MerchantDetails() {
    const { id } = useParams();
    const [merchant, setMerchant] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showProducts, setShowProducts] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [loading, setLoading] = useState(true);
    const apiUrl=process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const userRes = await fetch(`${apiUrl}/users/${id}`);
        const userData = await userRes.json();
                setMerchant(userData);

                const prodRes = await fetch(`${apiUrl}/product/merchant/${id}`);
        const prodData = await prodRes.json();
                setProducts(prodData);

                const orderRes = await fetch(`${apiUrl}/merchant-orders/merchant/${id}`);
        const orderData = await orderRes.json();
                setOrders(orderData);
            } catch (err) {
                console.error("❌ خطأ في جلب البيانات:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDeleteProduct = async (productId) => {
        const merchant = JSON.parse(localStorage.getItem("user"));
        console.log(merchant);
        const confirm = window.confirm("هل تريد حذف هذا المنتج؟");
        if (!confirm) return;
        try {
            await fetch(`${apiUrl}/product/${productId}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                    Authorization: `Bearer ${merchant.token }`, // تأكد أن التوكن محفوظ في localStorage
      }, // يمكن حذفه إذا كنت تستخدم JWT فقط
    });

    setProducts((prev) => prev.filter((p) => p._id !== productId));
    alert("✅ تم حذف المنتج");
} catch (err) {
    console.error("❌ خطأ في الحذف:", err);
    alert("حدث خطأ أثناء حذف المنتج");
}
};

const handleEditProduct = (productId) => {
    alert(`🛠 تعديل المنتج: ${ productId }`);
    // يمكنك فتح نموذج تعديل هنا أو التوجيه لصفحة تعديل
};

if (loading) return <p className="p-6">⏳ جاري تحميل بيانات التاجر...</p>;
if (!merchant) return <p className="p-6 text-red-500">❌ لم يتم العثور على التاجر</p>;

return (
    <div className="flex w-[100%]">
    <List/>
    <div className="p-6 max-w-6xl mx-auto text-right ml-[30%]" dir="rtl">
        <h1 className="text-2xl font-bold mb-4">تفاصيل التاجر</h1>
        <div className="bg-gray-100 p-4 rounded mb-6">
            <p><strong>الاسم:</strong> {merchant.name}</p>
            <p><strong>البريد الإلكتروني:</strong> {merchant.email}</p>
            <p><strong>رقم الهاتف:</strong> {merchant.phone || "غير متوفر"}</p>
            <p><strong>الدور:</strong> {merchant.role}</p>
            <p><strong>تاريخ التسجيل:</strong> {new Date(merchant.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex gap-4 mb-6">
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setShowProducts(!showProducts)}
            >
                {showProducts ? "إخفاء المنتجات" : "عرض المنتجات"}
            </button>
            <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => setShowOrders(!showOrders)}
            >
                {showOrders ? "إخفاء الطلبات" : "عرض الطلبات"}
            </button>
        </div>

        {showProducts && (
        <>
                <h2 className="text-xl font-bold mb-2">منتجات التاجر</h2>
                {products.length === 0 ? (
                    <p>لا يوجد منتجات لهذا التاجر.</p>
                ) : (
                    <table className="w-full border border-gray-300 mb-6">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 border">اسم المنتج</th>
                                <th className="p-2 border">السعر</th>
                                <th className="p-2 border">الوصف</th>
                                <th className="p-2 border">الصورة</th>
                                <th className="p-2 border">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((prod) => (<tr key={prod._id} className="hover:bg-gray-50">
                                <td className="p-2 border">{prod.name}</td>
                                <td className="p-2 border">{prod.new_price} $</td>
                                <td className="p-2 border">{prod.description || "بدون وصف"}</td>
                                <td className="p-2 border">
                                    <img src={prod.image} alt="صورة المنتج" className="w-16 h-16 object-cover rounded" />
                                </td>
                                <td className="p-2 border space-x-2 space-x-reverse">
                                    <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleEditProduct(prod._id)}
                                    >
                                        تعديل
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleDeleteProduct(prod._id)}
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </>
        )}

        {showOrders && (
            <>
                <h2 className="text-xl font-bold mb-2">طلبات التاجر</h2>
                {orders.length === 0 ? (
                    <p>لا يوجد طلبات لهذا التاجر.</p>
                ) : (
                    <table className="w-full border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 border">اسم المشتري</th>
                                <th className="p-2 border">اسم المنتج</th>
                                <th className="p-2 border">الكمية</th>
                                <th className="p-2 border">السعر الإجمالي</th>
                                <th className="p-2 border">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{order.buyerId?.name || "غير معروف"}</td>
                                    <td className="p-2 border">{order.productId?.name || "منتج غير موجود"}</td>
                                    <td className="p-2 border">{order.quantity}</td>
                                    <td className="p-2 border">{order.productId?.new_price * order.quantity} $</td>
                                    <td className="p-2 border">{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </>
        )}
    </div>
    </div>
);
}