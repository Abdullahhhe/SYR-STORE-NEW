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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const userRes = await fetch(`${apiUrl}/users/${id}`);
                const userData = await userRes.json();
                setMerchant(userData);

                const prodRes = await fetch(`${apiUrl}/purchase/user/${id}`);
                const prodData = await prodRes.json();
                setProducts(prodData);
            } catch (err) {
                console.error("❌ خطأ في جلب البيانات:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDeletePurchase = async (purchaseId) => {
        const merchant = JSON.parse(localStorage.getItem("user"));
        const confirm = window.confirm("هل تريد حذف هذا الطلب؟");
        if (!confirm) return;

        try {
            const res = await fetch(`${apiUrl}/purchase/${purchaseId}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ merchant.token }`, // ✅ صيغة صحيحة
      },
        // إذا كنت تعتمد على التوكن فقط للتحقق من الصلاحية، يمكنك حذف body
    });

    if (res.ok) {
        alert("✅ تم حذف الطلب");
        setProducts((prev) => prev.filter((p) => p._id !== purchaseId));
    } else {
        const result = await res.json();
        alert("❌ فشل في الحذف: " + result.error);
    }
} catch (err) {
    console.error("❌ خطأ في الحذف:", err);
    alert("حدث خطأ أثناء حذف الطلب");
}
};
    const [showModel, setShowModel] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const handleUpdate = async () => {
        const admin=JSON.parse(localStorage.getItem("user"));
        console.log(admin);
        console.log(admin.token);
        try {
            await fetch(`${apiUrl}/purchase/${selectedOrder._id}`,{
                method: "PUT",
                headers: { "Content-Type": "application/json",
                    Authorization:`Bearer ${admin.token}`,
                 },
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
    const openShow = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowModel(true);
    };

    if (loading) return <p className="p-6">⏳ جاري تحميل بيانات التاجر...</p>;
    if (!merchant) return <p className="p-6 text-red-500">❌ لم يتم العثور على التاجر</p>;

    return (
        <div className="flex w-[100%]">
            <List />
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
                        {showProducts ? "إخفاء الطلبات" : "عرض الطلبات"}
                    </button>
                </div>

                {showProducts && (
                    <>
                        <h2 className="text-xl font-bold mb-2">منتجات التاجر</h2>
                        {products.length === 0 ? (
                            <p>لا يوجد طلبات لهذا المستخدم.</p>
                        ) : (
                            <table className="w-full border border-gray-300 mb-6">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="p-2 border">اسم المنتج</th>
                                        <th className="p-2 border">السعر</th>
                                        <th className="p-2 border">الوصف</th>
                                        <th className="p-2 border">الصورة</th>
                                        <th className="p-2 border">العدد المطلوب</th>
                                        <th className="p-2 border">حالة الطلب</th>
                                        <th className="p-2 border">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((prod) => (<tr key={prod._id} className="hover:bg-gray-50">
                                        <td className="p-2 border">{prod.productId.name}</td>
                                        <td className="p-2 border">{prod.total} $</td>
                                        <td className="p-2 border">{prod.description || "بدون وصف"}</td>
                                        <td className="p-2 border">
                                            <img src={prod.productId.image} alt="صورة المنتج" className="w-16 h-16 object-cover rounded" />
                                        </td>
                                        <td className="p-2 border">{prod.quantity}</td>
                                        <td className="p-2 border">{prod.status}</td>
                                        <td className="p-2 border space-x-2 space-x-reverse">
                                            <button
                                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                                                onClick={() => openShow(prod)}
                                            >
                                                تعديل
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => handleDeletePurchase(prod._id)}
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
        </div>
    );
}