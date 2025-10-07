"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
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
      className={` w-[100%] top-0 z-50 sticky h-[80px] ${
        isSticky ? "fixed" : "relative"
      }`}
    >
      <nav className="bg-white border-b shadow-md px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo + Site Name */}
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="hidden lg:block text-xl font-bold text-gray-800  font-sans">
              <span className="text-red-600">SYR</span>-Store
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex mx-4">
            <input
              type="text"
              placeholder="ابحث عن منتج.."
              className="md:w-[400px] w-[80%] px-3 py-2 rounded-l-lg bg-gray-100 focus:outline-none focus:ring focus:border-blue-50 text-sm "
            />
            <button className="bg-green-500 text-white  rounded-r-lg transition-all duration-300 pl-3 pr-3 cursor-pointer hover:bg-green-600">Filtter</button>
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
          <div className="hidden lg:flex space-x-6 items-center">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 text-sm"
            >
              الصفحة الرئيسية
            </Link>
            <Link
              href="/components/MySell"
              className="text-gray-700 hover:text-blue-600 text-sm"
            >
              السلة
            </Link>
            <Link
              href="/components/popular"
              className="text-gray-700 hover:text-blue-600 text-sm"
            >
              تتبع الطلبات
            </Link>
            <Link
              href="/components/info"
              className="text-gray-700 hover:text-blue-600 text-sm"
            >
              اتصل بنا
            </Link>
            <Link
              href="/components/login"
              className="text-blue-600 font-semibold text-sm"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-2 space-y-2">
            <Link
              href="/"
              className="block text-gray-700 hover:text-blue-600 text-sm"
            >
              الصفحة الرئيسية
            </Link>
            <Link
              href="/components/MySell"
              className="block text-gray-700 hover:text-blue-600 text-sm"
            >
              السلة
            </Link>
            <Link
              href="/components/popular"
              className="block text-gray-700 hover:text-blue-600 text-sm"
            >
              تتبع الطلبات
            </Link>
            <Link
              href="/components/info"
              className="block text-gray-700 hover:text-blue-600 text-sm"
            >
              اتصل بنا
            </Link>
            <Link
              href="/components/login"
              className="block text-blue-600 font-semibold text-sm"
            >
              تسجيل الدخول
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
