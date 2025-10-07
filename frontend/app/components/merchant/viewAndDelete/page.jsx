"use client";
import { useEffect, useState } from "react";
import Header from "../HeaderMerchant";
import { useRouter } from "next/navigation";
export default function AddAndDelete() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const merchant = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!merchant || !merchant.id) {
      return;
    }
    fetch(`http://localhost:3000/api/product/merchant/${merchant.id}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => conaole.error("ErRoR", error));
  }, []);
  const handleDelete = async (productId) => {
    const merchant = JSON.parse(localStorage.getItem("user"));
    merchant._id = merchant.id;

    try {
      const res = await fetch(
        `http://localhost:3000/api/product/${productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merchantId: merchant._id }),
        }
      );

      const result = await res.json();
      if (res.ok) {
        alert("✅ تم حذف المنتج");
        setProducts(products.filter((p) => p._id !== productId));
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
      <p className="mt-[10px] text-center font-bold text-xl">
        المنتجات الخاصة بي
      </p>
      <div className="md:grid grid-cols-4 justify-around mt-[20px] gap-1 text-right" dir="rtl">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white h-[100%] rounded-md shadow-md shadow-gray-500 hover:shadow-lg transition-all hover:cursor-pointer pb-3 md:w-auto mt-[5px] "
          >
            <img
              src={product.image}
              alt="sorry"
              className="w-[100%] h-[180px]"
            />
            <h1 className="text-center text-lg font-bold">{product.name}</h1>
            <p className="text-sm mt-[5px] text-center">
              {product.discreption}
            </p>
            <p className="mt-[5px]">
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
            <button
              onClick={() => {
                handleDelete(product._id);
              }}
              className="bg-red-500 rounded-lg transition-all duration-200 hover:bg-red-600"
            >
              Remove
            </button>
            <button
              onClick={() => router.push(`/components/merchant/edit-product/${product._id}`)}
              className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
            >
              تعديل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
