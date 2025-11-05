"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
export default function Navbar() {
  const [merchant, setMerchant] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === "merchant") {
          parsed._id = parsed.id;
          setMerchant(parsed);
        }
      }
    }
  }, []);
  const [isSticky, setIsSticky] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={`text-right w-[100%] top-0 z-50 sticky h-[80px] ${isSticky ? "fixed" : "relative"
        }`}
      dir="rtl"
    >
      <nav className="bg-white border-b shadow-md px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo + Site Name */}
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="hidden lg:block text-xl font-bold text-gray-800  font-sans">
              <span className="text-red-600">صفحة خاصة</span>-بالتاجر
            </span>
          </div>

          {/* Hamburger Button */}
          <div className="lg:hidden ">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 focus:outline-none hover:cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Navbar Links (Large Screens) */}
          <div className="hidden lg:flex gap-3 space-x-6 items-center">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 text-sm"
            >
              أضاف منتج
            </Link>
            <Link
              href={"/components/viewAndDelete"}
              className="text-gray-700 hover:text-blue-600 text-sm"
            >
              عرض المنتجات
            </Link>
            {merchant && merchant.id && (
              <Link
                href={`/components/merchantOrder/${merchant.id}`}
                className="text-gray-700 hover:text-blue-600 text-sm"
              >
                المبيعات
              </Link>
            )}
            <Link
              href="/components/login"
              className="text-blue-600 font-semibold text-sm"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {
          isOpen && (
            <div className="lg:hidden mt-2 space-y-2">
              <Link
                href="/"
                className="block text-gray-700 hover:text-blue-600 text-sm"
              >
                أضاف منتج
              </Link>
              <Link
                href={"/components/viewAndDelete"}
                className="block text-gray-700 hover:text-blue-600 text-sm"
              >
                عرض المنتجات
              </Link>
              {merchant && merchant.id && (
                <Link
                  href={`/components/merchantOrder/${merchant.id}`}
                  className="text-gray-700 hover:text-blue-600 text-sm"
                >
                  المبيعات
                </Link>
              )}
              <Link
                href="/components/login"
                className="block text-blue-600 font-semibold text-sm"
              >
                تسجيل الدخول
              </Link>
            </div>
          )
        }
      </nav >
    </div >
  );
}
