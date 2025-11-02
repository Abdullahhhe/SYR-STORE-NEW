'use client';
import List from "../list/page";
import { getUsers, deleteUsers } from "../../services/userServices";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Merchant() {
    const [users, setUsers] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUsers();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const merchants = users.filter((user) => user.role === "merchant");

    const handleDelete = async (id) => {
        const confirm = window.confirm("هل أنت متأكد من حذف هذا التاجر؟");
        if (!confirm) return;
        try {
            await deleteUsers(id);
            setUsers((prev) => prev.filter((u) => u._id !== id));
            alert("✅ تم حذف التاجر");
        } catch (error) {
            console.error("❌ خطأ أثناء الحذف:", error);
            alert("حدث خطأ أثناء حذف التاجر");
        }
    };

    const handleView = (id) => {
        router.push(`/components/admin/merchant/${ id }`);
    };

    return (
        <div className="flex w-full">
            <List />
            <div className="w-[80%] p-6 bg-gray-50 ml-[30%]">
                <h2 className="text-xl font-bold mb-4">قائمة التجار</h2>
                <table className="w-full border border-gray-300 text-right" dir="rtl">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 border">الاسم</th>
                            <th className="p-2 border">البريد الإلكتروني</th>
                            <th className="p-2 border">رقم الهاتف</th>
                            <th className="p-2 border">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {merchants.map((merchant) => (
                            <tr key={merchant._id} className="hover:bg-gray-100">
                                <td className="p-2 border">{merchant.name}</td>
                                <td className="p-2 border">{merchant.email}</td>
                                <td className="p-2 border">{merchant.phone || "غير متوفر"}</td>
                                <td className="p-2 border space-x-2 space-x-reverse">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleView(merchant._id)}
                                    >
                                        عرض
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleDelete(merchant._id)}
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}