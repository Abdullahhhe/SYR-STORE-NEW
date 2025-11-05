"use client";
import { useState } from "react";
import Image from "next/image";
import Header from "../../components/user/Header";

export default function ProductDetails({ product }) {
  const [isOpen, setIsOpen] = useState(false);

  const confirmAction = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("سجل الدخول أولًا");
      setIsOpen(false);
      return;
    }
    if (user.role !== "user") {
      alert("سجل الدخول أولًا بحساب مستخدم");
      setIsOpen(false);
      return;
    }
    console.log("🧾 إرسال للسلة:", {
      userId: user?.id,
      productId: product?._id,
    });
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id, // ← تأكد أن هذا هو المفتاح الصحيح من قاعدة البيانات
          productId: product._id,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("خطأ في الاستجابة:", errorText);
        alert("❌ حدث خطأ في الخادم");
        return;
      }

      const data = await res.json();

      alert("✅ تم إرسال المنتج إلى سلة المستخدم");
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      alert("❌ حدث خطأ أثناء الإرسال");
    }

    setIsOpen(false);
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-amber-200/50 flex items-center justify-center p-6 mt-[-10px]">
        <div className="max-w-4xl w-full bg-white/40 shadow-lg rounded-xl flex flex-col md:flex-row overflow-hidden">
          {/* صورة المنتج */}
          <div className="md:w-1/2 w-full relative h-64 md:h-auto">
            <img
              src={product.image} // ضع اسم الصورة هنا بعد إضافتها إلى مجلد public
              alt="Product"
              className="rounded-l-xl h-[100%]"
            />
          </div>

          {/* معلومات المنتج */}
          <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Dulevelly/modectdlo tire by door it ane dursty so io udtout lrup
                to caskly-product sourd. Sre soued touse it your cadre all
                entailr's bar's
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">
                {product.new_price}$
              </span>
              <button
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition hover:cursor-pointer"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                ارسال الى السلة
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2">Fught: Fiy, Wellilows</p>

            {isOpen && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <p className="mb-4 text-lg">هل أنت متأكد؟</p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded"
                      onClick={confirmAction}
                    >
                      تأكيد
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
