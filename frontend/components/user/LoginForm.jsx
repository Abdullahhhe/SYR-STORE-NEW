"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // ✅ تحقق آمن من وجود مستخدم في localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setIsLoggedIn(true);
            }
        }
    }, []);

    const handleLogin = async () => {
        try {
            const res = await fetch(`${apiUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const contentType = res.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                const text = await res.text();
                console.error("استجابة غير متوقعة:", text);
                return;
            }

            const data = await res.json();
            console.log("الاستجابة", data);

            if (!data.token || !data.user) {
                console.error("الاستجابة ناقصة:", data);
                return;
            }

            const fullUser = { ...data.user, token: data.token };
            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(fullUser));
            }

            setIsLoggedIn(true);

            // ✅ توجيه حسب الدور
            switch (data.user.role) {
                case "user":
                    router.push("/components/HomePage");
                    break;
                case "merchant":
                    router.push("/components/addProduct");
                    break;
                default:
                    router.push("/dashboard/guest");
            }
        } catch (err) {
            console.error("خطأ أثناء تسجيل الدخول:", err);
        }
    };

    const handleAdd = () => {
        router.push("/components/register");
    };

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        setIsLoggedIn(false);
        router.push("/components/login");
    };

    return (
        <div className="flex justify-center items-center mt-[100px]">
            <div className="bg-gray-50 shadow-xl shadow-gray-700 w-[400px] h-[500px] md:pl-[100px] pt-[100px] pl-[70px] rounded-2xl">
                {!isLoggedIn ? (
                    <>
                        <h1 className="text-2xl mt-[-70px] ml-[38px] text-black font-bold">تسجيل الدخول</h1>

                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-b-2 block mt-[38px] focus:border-0 w-[280px] ml-[-50px]"
                            placeholder="Email"
                        />

                        <div className="w-[280px] border-b-2 focus:border-0 flex justify-between mt-[38px] ml-[-50px]">
                            <input
                                value={password}
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => setPassword(e.target.value)}
                                className="focus:border-0 w-full"
                                placeholder="Password"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>👀</button>
                        </div>

                        <button
                            className="bg-blue-500 text-white rounded-md w-[200px] mt-[40px] transition-all hover:bg-blue-600"
                            onClick={handleLogin}
                        >
                            تسجيل الدخول
                        </button>

                        <button
                            className="bg-green-500 text-white rounded-md w-[200px] mt-[10px] transition-all hover:bg-green-600"
                            onClick={handleAdd}
                        >
                            إنشاء حساب
                        </button>

                        <Link
                            className="bg-green-500 text-white rounded-md w-[200px] mt-[10px] text-center transition-all hover:bg-green-600"
                            href="/components/HomePage"
                        >
                            الدخول كزائر
                        </Link>
                        <div className="mt-[80px] flex justify-around ml-[-90px]">
                            <h1 className="text-gray-700 hover:text-blue-700 cursor-pointer hover:underline">حول الموقع</h1>
                            <h1 className="text-gray-700 hover:text-blue-700 cursor-pointer hover:underline">تسجيل</h1>
                            <h1 className="text-gray-700 hover:text-blue-700 cursor-pointer hover:underline">شكاوي</h1>
                        </div>
                    </>
                ) : (
                    <button
                        className="bg-red-500 text-white rounded-md w-[200px] mt-[10px] transition-all hover:bg-red-600"
                        onClick={handleLogout}
                    >
                        تسجيل الخروج
                    </button>
                )}
            </div>
        </div>
    );
}
