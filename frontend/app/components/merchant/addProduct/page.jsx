'use client';
import { useState } from "react";
import Header from "../HeaderMerchant";

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [color, setColor] = useState([]);
  const [newColor, setNewColor] = useState("");
  const addColor = () => {
    if (newColor.trim() && !color.includes(newColor.trim())) {
      setColor([...color, newColor.trim()]);
      setNewColor("");
    }
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const merchant = JSON.parse(localStorage.getItem("user"));
    merchant._id = merchant.id;

    if (!merchant || merchant.role !== "merchant") {
      alert("❌ يجب تسجيل الدخول كتاجر");
      return;
    }

    if (!imageFile) {
      alert("❌ يجب اختيار صورة للمنتج");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("new_price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("color", color);
    formData.append("merchantId", merchant._id);
    formData.append("image", imageFile); // الصورة تُرسل هنا مباشرة

    try {
      const res = await fetch("http://localhost:3000/api/product", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("✅ المنتج أُضيف:", data);
      alert("✅ تم إرسال المنتج بنجاح");
    } catch (error) {
      console.error("❌ خطأ أثناء الإرسال:", error);
      alert("حدث خطأ أثناء إرسال المنتج");
    }
  };

  return (
    <div dir="rtl" className="p-4 text-right">
      <Header />
      <h2 className="text-xl font-bold mb-4">إضافة منتج جديد</h2>

      <input
        className="border rounded-xl mt-[3px] pr-[5px]"
        placeholder="اسم المنتج"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border rounded-xl mt-[3px] pr-[5px]"
        placeholder="السعر"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        className="border rounded-xl mt-[3px] pr-[5px]"
        placeholder="الكمية المتاحة"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        className="border rounded-xl mt-[3px] pr-[5px]"
        placeholder="الوصف"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="border rounded-xl mt-[3px] pr-[5px]"
        placeholder="الوصف"
        value={newColor}
        onChange={(e) => setNewColor(e.target.value)}
      />
      <butto className="bg-blue-400" onClick={addColor}>Color</butto>
      <input
        className="border rounded-xl mt-[3px] pr-[5px]"
        placeholder="التصنيف"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mt-2"
      />

      {imageFile && (
        <p className="text-green-600 mt-1">✅ تم اختيار الصورة: {imageFile.name}</p>
      )}

      <button
        onClick={() => {
          addColor();
          handleSubmit();
        }}
        className="bg-blue-600 text-white px-4 py-2 mt-2 rounded transition-all duration-200 hover:bg-blue-700"
      >
        إرسال المنتج
      </button>
    </div>
  );
}