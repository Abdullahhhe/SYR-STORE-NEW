"use client";
import Link from "next/link";
import Header from "../../../components/user/Header";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function ContactUs() {
    return (
        <div>
        <Header/>
        <div className="min-h-screen bg-gray-50 mt-[-80px] flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold mb-4 text-blue-700">📬 تواصل معنا</h1>

            <p className="text-gray-700 mb-6 max-w-xl">
                مرحبًا بك في SYR Store، منصتك الموثوقة للتسوق الإلكتروني في سوريا. نحن نعمل على
                توفير تجربة شراء سهلة وآمنة، مع منتجات متنوعة من التجار المحليين. إذا كان لديك أي
                استفسار أو اقتراح، يسعدنا تواصلك معنا عبر الوسائل التالية:
            </p>

            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-right">
                <p className="mb-2 text-lg">📞 الهاتف: <span className="font-semibold">+963 965383478</span></p>
                <p className="mb-4 text-lg">📧 البريد الإلكتروني: <span className="font-semibold">syrstore657@gmail.com</span></p>

                <div className="flex justify-center gap-6 mt-4 text-2xl text-blue-600">
                    <Link href="https://www.facebook.com/syrstore" target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="hover:text-blue-800" />
                    </Link>
                    <Link href="https://www.instagram.com/syrstore" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="hover:text-pink-600" />
                    </Link>
                </div>
            </div>
        </div>
        </div>
    );
}