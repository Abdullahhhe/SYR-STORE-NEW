'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleVerify = async () => {
        if (!email || !code) {
            setMessage('❌ البريد والرمز مطلوبان');
            return;
        }

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();
            if (!res.ok) {
                setMessage(`❌ ${ data.message }`);
                return;
            }

            setMessage('✅ تم التحقق من الحساب بنجاح');
            setTimeout(() => router.push('/components/login'), 2000); // ينقله إلى صفحة تسجيل الدخول
        } catch (err) {
            setMessage('❌ حدث خطأ أثناء التحقق');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6">التحقق من الحساب</h1>
            <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded w-80 mb-3"
            />
            <input
                type="text"
                placeholder="رمز التحقق"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="border p-2 rounded w-80 mb-3"
            />
            <button
                onClick={handleVerify}
                className="bg-green-600 text-white px-4 py-2 rounded w-80"
            >
                تأكيد التحقق
            </button>
            {message && <p className="mt-4 text-red-600">{message}</p>}
        </div>
    );
}