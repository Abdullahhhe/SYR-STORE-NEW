'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../HeaderMerchant";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/product/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);
  const handleUpdate = async () => {
    const merchant = JSON.parse(localStorage.getItem("user"));
    merchant._id = merchant.id;

    try {
      await fetch(`${apiUrl}/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          merchantId: merchant._id,
        }),
      });
      alert("✅ تم تعديل المنتج");
      router.push("/components/merchant/viewAndDelete");
    } catch (error) {
      console.error("❌ خطأ أثناء التعديل:", error);
      alert("حدث خطأ أثناء تعديل المنتج");
    }
  };

  if (!product) return <p>جاري تحميل المنتج...</p>;

  return (
    <div dir="rtl" className="w-[100%] min-h-screen bg-gray-50 pb-10 text-right">
    <Header />
    <div className="w-[70%] ml-[12%] mr-[12%] rounded-2xl shadow-2xl shadow-gray-100 mt-[50px]">
      <h2 className="text-xl font-bold mb-4">تعديل المنتج</h2>
      <input 
      className="border p-[8px] rounded-md mt-[5px] pr-[5px] block mr-[25%] w-[50%] h-[35px]"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        placeholder="اسم المنتج"
      />
      <input 
      className="border p-[8px] rounded-md mt-[5px] pr-[5px] block mr-[25%] w-[50%] h-[35px]"
        value={product.new_price}
        onChange={(e) => setProduct({ ...product, new_price: e.target.value })}
        placeholder="السعر"
      />
      <input 
      className="border p-[8px] rounded-md mt-[5px] pr-[5px] block mr-[25%] w-[50%] h-[35px]"
        value={product.quantity}
        onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
        placeholder="الكمية المتاحة"
      />
      <input 
      className="border p-[8px] rounded-md mt-[5px] pr-[5px] block mr-[25%] w-[50%] h-[35px]"
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        placeholder="الوصف"
      />
      <input 
      className="border p-[8px] rounded-md mt-[5px] pr-[5px] block mr-[25%] w-[50%] h-[35px]"
        value={product.category}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
        placeholder="التصنيف"
      />
      <input 
      className="border p-[8px] rounded-md mt-[5px] pr-[5px] block mr-[25%] w-[50%] h-[35px]"
        value={product.image}
        onChange={(e) => setProduct({ ...product, image: e.target.value })}
        placeholder="رابط الصورة"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
      >
        حفظ التعديلات
      </button>
      </div>
    </div>
  );
}