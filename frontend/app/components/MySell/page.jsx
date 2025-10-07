"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../Header";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("❌ يجب تسجيل الدخول لعرض السلة");
      setCartItems([]);
      setLoading(false);
      return;
    }

    if (user.role !== "user") {
      alert("❌ يجب تسجيل الدخول كمستخدم لعرض السلة");
      setCartItems([]);
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/api/cart?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.cart && data.cart.items) {
          setCartItems(data.cart.items);
        } else {
          setCartItems([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ خطأ في جلب السلة:", err);
        setCartItems([]);
        setLoading(false);
      });
  }, []);

  const openQuantityModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowModal(true);
  };

  const handleConfirmPurchase = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await fetch("http://localhost:3000/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct._id,
          quantity,
          buyerId: user.id,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ تم تثبيت الشراء");
        setShowModal(false);
        setCartItems((prev) =>
          prev.filter((item) => item.productId._id !== selectedProduct._id)
        );
      } else {
        alert("❌ فشل في الشراء: " + result.error);
      }
    } catch (error) {
      console.error("❌ خطأ أثناء الشراء:", error);
      alert("حدث خطأ أثناء تثبيت الشراء");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    try {
      const res = await fetch("http://localhost:3000/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId,
        }),
      });
      console.log(res);
      const result = await res.json();
      console.log("result :",result);
      if (res.ok) {
        alert("🗑️ تم حذف المنتج من السلة");
        setCartItems((prev) =>
          prev.filter((item) => item.productId._id !== productId)
        );
      } else {
        alert("❌ فشل في الحذف: " + result.error);
      }
    } catch (error) {
      console.error("❌ خطأ أثناء الحذف:", error);
      alert("حدث خطأ أثناء حذف المنتج من السلة");
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6 mt-[-10px]">
        <h1 className="text-3xl font-bold text-center mb-8">🛒 سلة المشتريات</h1>

        {loading ? (
          <p className="text-center text-gray-500">جاري تحميل السلة...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-center text-gray-500">السلة فارغة</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item) =>
                <div key={item._id}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="h-48 w-full relative pt-[10px]">
                    <img src={item.productId.image} alt="sorry" className="w-[70%] h-[200px] ml-[15%] rounded-2xl"/>
                    </div>
                    <div className="p-4 flex flex-col justify-between h-full">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.productId.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        البائع: {item.productId.seller || "غير معروف"}
                      </p>
                      <p className="text-md text-gray-700 mt-2">
                        السعر: {item.productId.new_price}$
                      </p>
                      <p className="text-sm text-gray-500">
                        الكمية: {item.quantity || 1}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {openQuantityModal(item.productId)}}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          تثبيت الشراء
                        </button>
                        <button
                          onClick={() => {
                          console.log(item.productId);
                          handleRemoveFromCart(item.productId);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          حذف
                        </button>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>RIQU UN</span>
                        <span>SILURY</span>
                        <span>FALTONEE</span>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        )}

        {showModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-80">
              <h3 className="text-lg font-bold mb-2">
                كم قطعة تريد؟ (المتوفر: {selectedProduct.quantity})
              </h3>
              <input
                type="number"
                min={1}
                max={selectedProduct.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border p-2 mb-4"
              />
              <button
                onClick={handleConfirmPurchase}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                تأكيد الشراء
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="mt-2 text-sm text-gray-500 w-full"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}