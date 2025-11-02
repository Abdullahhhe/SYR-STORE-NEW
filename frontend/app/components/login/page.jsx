"use client";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { addUsers } from "../../services/userServices";
import Link from "next/link";

export default function LoginPage() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password}),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
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
      localStorage.setItem("user", JSON.stringify(fullUser));
      const role = data.user.role;
      setIsLoggedIn(true);

      if (role === "user") router.push("/components/HomePage");
      else if (role === "merchant") router.push("/components/merchant/addProduct");
      else router.push("/dashboard/guest");
    } catch (err) {
      console.error("خطأ أثناء تسجيل الدخول:", err);
    }
  };

  const handelAdd = async () => {
    /*try {
      const newUsers = await addUsers({ name, email, password });
      setUsers((prev) => [...prev, newUsers]);
      setName("");
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (err) {
      console.error("خطأ أثناء إنشاء المستخدم:", err);
    }*/
    router.push("/components/register");
    };
    const [showPassword , setShowPassword]=useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("./login");
  };

  return (
    <div>
      <div className="flex justify-center items-center mt-[100px]">
        <div className="bg-gray-50 shadow-xl shadow-gray-700 w-[400px] h-[500px] md:pl-[100px] pt-[100px] pl-[70px] rounded-2xl ">
          {!isLoggedIn && (
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
                type={showPassword ? 'text' :'password'}
                onChange={(e) => setPassword(e.target.value)}
                className=" focus:border-0 w-[100%]"
                placeholder="Password"
              />
              <button type="button" onClick={()=>{setShowPassword(!showPassword)}}>👀</button>
              </div>
              <button
                className="bg-blue-500 text-center text-white transition-all duration-200 hover:bg-blue-600 rounded-md 
                block w-[200px] cursor-pointer mt-[40px]"
                onClick={handleLogin}
              >
                تسجيل الدخول
              </button>
              <button
                className="bg-green-500 text-center text-white transition-all duration-200 hover:bg-green-600 rounded-md 
                block mt-[10px] w-[200px] cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handelAdd();
                }}
              >
                أنشاء حساب
              </button>
              <Link
                className="bg-green-500 text-center text-white transition-all duration-200 hover:bg-green-600 rounded-md 
                block mt-[10px] w-[200px] cursor-pointer"
                href={"/components/HomePage"}
              >
                الدخول كزائر
              </Link>
              <div className="mt-[80px] flex justify-around ml-[-90px]">
                <h1 className="text-gray-700 transition-all duration-300 hover:text-blue-700 cursor-pointer decoration-2 hover:underline">حول الموقع</h1>
                <h1 className="text-gray-700 transition-all duration-300 hover:text-blue-700 cursor-pointer decoration-2 hover:underline">تسجيل</h1>
                <h1 className="text-gray-700 transition-all duration-300 hover:text-blue-700 cursor-pointer decoration-2 hover:underline">شكاوي</h1>
              </div>
            </>
          )}

          {isLoggedIn && (
            <button
              className="bg-red-500 text-center text-white transition-all duration-200 hover:bg-red-600 rounded-md 
                block mt-[10px] w-[200px]  cursor-pointer"
              onClick={handleLogout}
            >
              تسجيل الخروج
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
