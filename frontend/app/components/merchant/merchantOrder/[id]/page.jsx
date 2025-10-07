'use client';
import { useState, useEffect } from "react";
import Header from "../../HeaderMerchant";
export default function merchantOrder() {
  const merchant = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  let x=0;
  for(let i=0;i<products.length;i++){
    x =x+ products[i].productId.new_price * products[i].quantity;
  }
  console.log(x);
  let y=(x/10)/2;
  useEffect(() => {
    if (!merchant || !merchant.id) {
      return;
    }
    fetch(`http://localhost:3000/api/merchant-orders/merchant/${merchant.id}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => conaole.error("ErRoR", error));
  }, []);
  return (
    <div className="w-full">
      <Header />
      <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto ml-[10%] mr-[10%] rounded-lg bg-gray-100">
        {products.map((product) => (
          <div key={product._id} className="bg-neutral-100 h-[100%] rounded-md shadow-md shadow-gray-500 hover:shadow-lg transition-all hover:cursor-pointer pb-3">
            <img className="w-[100%] h-[180px] m-[2px]" src={product.productId.image} alt="Sorry" />
            <div className="text-right" dir="rtl">
              <h1>عدد القطع المطلوبة: {product.quantity}</h1>
              <h1>اسم المشتري :{product.buyerId.name}</h1>
              <h1>أجمالي السعر: {product.productId.new_price * product.quantity}</h1>
              <h1>حالة الطلب: {product.status}</h1>
            </div>
            <hr />
          </div>
        ))}
      </div>
      <p dir="rtl" className="text-right mr-[10%] mt-[30px] font-bold ">أجمالي المبيعات: ${x}</p>
      <p dir="rtl" className="text-right mr-[10%] mt-[30px] font-bold ">نسبة الموقع: ${y}</p>
    </div>
  )
}