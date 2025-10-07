'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  const handleUpdate = async () => {
    const merchant = JSON.parse(localStorage.getItem("user"));
    merchant._id = merchant.id;

    try {
      await fetch(`http://localhost:3000/api/product/${id}`, {
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">تعديل المنتج</h2>
      <input
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        placeholder="اسم المنتج"
      />
      <input
        value={product.new_price}
        onChange={(e) => setProduct({ ...product, new_price: e.target.value })}
        placeholder="السعر"
      />
      <input
        value={product.quantity}
        onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
        placeholder="الكمية المتاحة"
      />
      <input
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        placeholder="الوصف"
      />
      <input
        value={product.category}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
        placeholder="التصنيف"
      />
      <input
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
  );
}