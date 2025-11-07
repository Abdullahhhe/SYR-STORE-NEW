'use client';
import { useEffect, useState } from "react";
import Header from "./HeaderMerchant";
import { useRouter } from "next/navigation";

export default function ViewAndDeleteClient() {
  const [merchant, setMerchant] = useState(null);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === "merchant") {
          setMerchant(parsed);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!merchant || !merchant.id) return;
    fetch(`${apiUrl}/product/merchant/${merchant.id}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("❌ خطأ في جلب المنتجات:", error));
  }, [merchant]);

  const handleDelete = async (productId) => {
    if (!merchant || !merchant.token) {
      alert("❌ يجب تسجيل الدخول كتاجر");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/product/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization:` Bearer ${merchant.token}`,
        },
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ تم حذف المنتج");
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } else {
        alert("❌ فشل في الحذف: " + result.error);
      }
    } catch (error) {
      console.error("❌ خطأ أثناء الحذف:", error);
      alert("حدث خطأ أثناء حذف المنتج");
    }
  };

  return (
    <div>
      <Header />
      <p className="mt-[20px] text-center font-bold text-xl">
        المنتجات الخاصة بي
      </p>
      <div
        className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto px-[10%] rounded-lg bg-gray-100 text-right"
        dir="rtl"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white w-[280px] md:w-auto rounded-md shadow-md hover:shadow-lg transition-all cursor-pointer pb-3 mt-[5px]"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[180px]"
            />
            <h1 className="text-center text-lg font-bold">{product.name}</h1>
            <p className="text-sm mt-[5px] text-center">
              {product.description}
            </p>
            <p className="mt-[5px]">
              السعر:
              <span className="font-bold text-orange-400">
                {product.new_price}$
              </span>
            </p>
            <p className="mt-[5px]">
              الوصف:
              <span className="font-bold text-orange-400">
                {product.description}
              </span>
            </p>
            <p className="mt-[5px]">
              العدد المتاح:
              <span className="font-bold text-orange-400">
                {product.quantity}
              </span>
            </p>
            <div className="flex justify-around mt-2">
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                حذف
              </button>
              <button
                onClick={() =>
                  router.push(`/components/merchant/edit-product/${product._id}`)
                }
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
              >
                تعديل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}