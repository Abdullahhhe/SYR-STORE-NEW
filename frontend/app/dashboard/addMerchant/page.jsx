'use client';
import { useState } from "react";
import List from "../list/page";
import { addUsers } from "../../services/userServices";

export default function AddMerchant() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const role = "merchant";

  const handleAdd = async () => {
    if (!name || !email || !password) {
      setMessage("❌ جميع الحقول مطلوبة");
      return;
    }

    try {
      const newUser = await addUsers({ name, email, password, number, role });
      setUsers((prev) => [...prev, newUser]);
      setName("");
      setEmail("");
      setPassword("");
      setNumber("");
      setMessage("✅ تم إنشاء حساب التاجر بنجاح");
    } catch (err) {
      console.error("خطأ أثناء إنشاء المستخدم:", err);
      setMessage("❌ فشل في إنشاء الحساب");
    }
  };

  return (
    <div className="flex w-[100%]">
      <List />
      <div className="w-[69%] ml-[30%] p-6 bg-gray-50 text-right">
        <h2 className="text-lg font-bold mb-4">إضافة تاجر جديد</h2>
        <input
          className="border block mt-2 rounded-lg w-[280px] pl-[10px] ml-[30%]"
          placeholder="الاسم"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border block mt-2 rounded-lg w-[280px] pl-[10px] ml-[30%]"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border block mt-2 rounded-lg w-[280px] pl-[10px] ml-[30%]"
          placeholder="كلمة المرور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="border block mt-2 rounded-lg w-[280px] pl-[10px] ml-[30%]"
          placeholder="رقم الهاتف (اختياري)"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-md block mt-4 ml-[41%]"
          onClick={handleAdd}
        >
          إضافة تاجر جديد
        </button>
        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      </div>
    </div>
  );
}