'use client';
import { useState, useEffect } from "react";
import { getProduct } from "../../services/productService";
import { getUsers } from "../../services/userServices";
import { getAllMerchantOrders } from "../../services/merchantOrderService";
import List from "../list/page";

export default function HomeAdmin() {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tm , setTm]=useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    let le= "غير مقبوض";
    function handelChange(){
        setTm(true);
        if(tm===false){
            le=="مقبوض";
        }
    }
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const prodData = await getProduct();
                const userData = await getUsers();
                const orderData = await getAllMerchantOrders();
                setProducts(prodData);
                setUsers(userData);
                setOrders(orderData);
            } catch (err) {
                console.error("❌ خطأ في جلب البيانات:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // تصنيف المستخدمين حسب الدور
    let u = 0, m = 0, a = 0, g = 0;
    users.forEach((user) => {
        if (user.role === "user") u++;
        else if (user.role === "merchant") m++;
        else if (user.role === "admin") a++;
        else g++;
    });

    // حساب المبيعات لكل تاجر
    const merchantSales = {};
    orders.forEach((order) => {
        const merchantId = order.merchantId;
        const price = order.productId?.new_price || 0;
        const total = price * order.quantity;

        if (!merchantSales[merchantId]) merchantSales[merchantId] = 0;
        merchantSales[merchantId] += total;
    });

    // حساب نسبة الموقع 5%
    const merchantProfits = {};
    let totalSales = 0;
    let totalCommission = 0;

    Object.entries(merchantSales).forEach(([id, total]) => {
        const commission = total * 0.05;
        merchantProfits[id] = {
            total,
            commission,
        };
        totalSales += total;
        totalCommission += commission;
    });
    if (loading) return <p className="p-6">⏳ جاري تحميل البيانات...</p>;

    return (
        <div className="flex w-full">
            <List />
            <div className="w-[69%] ml-[30%] p-6 bg-gray-50 text-right" dir="rtl">
                <h1 className="text-2xl font-bold mb-6">لوحة تحكم الأدمن</h1>

                {/* إحصائيات المستخدمين */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard label="عدد المستخدمين" value={u} color="blue" />
                    <StatCard label="عدد التجار" value={m} color="green" />
                    <StatCard label="عدد المسؤولين" value={a} color="purple" />
                    <StatCard label="عدد الزوار" value={g} color="gray" />
                </div>

                {/* مبيعات التجار */}
                <h2 className="text-xl font-bold mb-4">مبيعات التجار</h2>
                <table className="w-full border border-gray-300 mb-6">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 border">اسم التاجر</th>
                            <th className="p-2 border">إجمالي المبيعات</th>
                            <th className="p-2 border">نسبة الموقع (5%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(merchantProfits).map(([id, data]) => {
                            const merchant = users.find((u) => u._id === id);
                            return (
                                <tr key={id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{merchant?.name || "تاجر غير معروف"}</td>
                                    <td className="p-2 border">{data.total.toLocaleString()} $</td>
                                    <td className="p-2 border text-red-600">{data.commission.toLocaleString()} $</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* إجمالي المبيعات */}
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="إجمالي المبيعات الكلية" value={totalSales.toLocaleString() + " $"} color="teal" />
                    <StatCard label="إجمالي نسبة الموقع" value={totalCommission.toLocaleString() + " $"} color="red" />
                </div>
            </div>
        </div>
    );
}
// مكون بطاقة إحصائية
function StatCard({ label, value, color }) {
    const bg = {
        blue: "bg-blue-100 text-blue-800",
        green: "bg-green-100 text-green-800",
        purple: "bg-purple-100 text-purple-800",
        gray: "bg-gray-100 text-gray-800",
        teal: "bg-teal-100 text-teal-800",
        red: "bg-red-100 text-red-800",
    }[color];

    return (
        <div className={`p - 4 rounded shadow ${bg}`}>
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}