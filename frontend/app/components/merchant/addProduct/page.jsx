'use client';
import { useState } from "react";
import Header from "../HeaderMerchant";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [color, setColor] = useState([]);
  const [newColor, setNewColor] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
      const res = await fetch(`${apiUrl}/product`, {
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
      <h2 className="text-xl font-bold mb-4 mt-[30px]">إضافة منتج جديد</h2>
      <div className="w-[74%] ml-[13%] mr-[13%] rounded-2xl shadow-2xl shadow-gray-100 mt-[50px]">
      <input
        className="border rounded-md mt-[5px] pr-[5px] block mr-[10%] w-[80%] h-[35px]"
        placeholder="اسم المنتج"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border rounded-md mt-[5px] pr-[5px] block mr-[10%] w-[80%] h-[35px]"
        placeholder="السعر"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        className="border rounded-md mt-[5px] pr-[5px] block mr-[10%] w-[80%] h-[35px]"
        placeholder="الكمية المتاحة"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        className="border rounded-md mt-[5px] pr-[5px] block mr-[10%] w-[80%] h-[35px]"
        placeholder="الوصف"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="border rounded-md mt-[5px] pr-[5px] block mr-[10%] w-[80%] h-[35px]"
        placeholder="الالوان المتاحة"
        value={newColor}
        onChange={(e) => setNewColor(e.target.value)}
      />
      <button className="bg-blue-400 mr-[71%] rounded-sm text-white transition-all duration-200 hover:bg-blue-500" onClick={addColor}>Color</button>
      <input
        className="border rounded-md mt-[5px] pr-[5px] block mr-[10%] w-[80%] h-[35px]"
        placeholder="التصنيف"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
          className="border rounded-md mt-[5px] pr-[5px] block mr-[10%] w-[80%] h-[35px]"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {imageFile && (
        <p className="text-green-600 mt-1">✅ تم اختيار الصورة: {imageFile.name}</p>
      )}

      <button
        onClick={() => {
          addColor();
          handleSubmit();
        }}
        className="bg-blue-600 mr-[45%] text-white px-4 py-2 mt-2 rounded transition-all duration-200 hover:bg-blue-700"
      >
        إرسال المنتج
      </button>
      </div>
    </div>
  );
}