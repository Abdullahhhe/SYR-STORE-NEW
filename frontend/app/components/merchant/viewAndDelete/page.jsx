"use client";
import { useEffect, useState } from "react";
import Header from "../HeaderMerchant";
import { useRouter } from "next/navigation";
export default function AddAndDelete() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const merchant = JSON.parse(localStorage.getItem("user"));
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    if (!merchant || !merchant.id) {
      return;
    }
    fetch(`${apiUrl}/product/merchant/${merchant.id}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => conaole.error("ErRoR", error));
  }, []);
  const handleDelete = async (productId) => {
    const merchant = JSON.parse(localStorage.getItem("user"));
    console.log(merchant.token);

    try {
      const res = await fetch(`${apiUrl}/product/${productId}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        Authorization:` Bearer ${ merchant.token }`, // ✅ صيغة صحيحة
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
      <p className="mt-[20px] mb-[10px] text-center font-bold text-xl">
        المنتجات الخاصة بي
      </p>
      <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto ml-[10%] mr-[10%] rounded-lg bg-gray-100 text-right" dir="rtl">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white w-[280px] md:w-auto h-[96%] rounded-md shadow-md shadow-gray-500 hover:shadow-lg transition-all hover:cursor-pointer pb-3 mt-[5px] "
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
            السعر :
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
              العدد المتاح :
              <span className="font-bold text-orange-400">
                {product.quantity}
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
