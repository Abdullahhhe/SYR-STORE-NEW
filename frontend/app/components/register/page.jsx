'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // أو "merchant"
    const [message, setMessage] = useState('');
    const [number, setNumber] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleRegister = async () => {
        if (!name || !email || !password || !number) {
            setMessage('❌ جميع الحقول مطلوبة');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email,number, password, role }),
            });

            const data = await res.json();
            if (!res.ok) {
                setMessage(`❌ ${ data.message }`);
                return;
            }

            setMessage('✅ تم التسجيل بنجاح، تحقق من بريدك');
            setTimeout(() => router.push('/verify'), 2000); // ينقله لصفحة التحقق
        } catch (err) {
            setMessage('❌ حدث خطأ أثناء التسجيل');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6">إنشاء حساب جديد</h1>
            <input
                type="text"
                placeholder="الاسم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded w-80 mb-3"
            />
            <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded w-80 mb-3"
            />
            <input
                type="text"
                placeholder="رقم الهاتف"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="border p-2 rounded w-80 mb-3"
            />
            <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded w-80 mb-3"
            />
            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border p-2 rounded w-80 mb-3"
            >
                <option value="user">مستخدم</option>
            </select>
            <button
                onClick={handleRegister}
                className="bg-blue-600 text-white px-4 py-2 rounded w-80"
            >
                إنشاء الحساب
            </button>
            {message && <p className="mt-4 text-red-600">{message}</p>}
        </div>
    );
}