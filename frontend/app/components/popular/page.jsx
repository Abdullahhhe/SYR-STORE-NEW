'use client';
import Header from "../Header";
import { useState , useEffect } from "react";
export default function Popular(){
    const user = JSON.parse(localStorage.getItem("user"));
    const [products, setProducts] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        if (!user || !user.id) {
          return;
        }
        fetch(`${apiUrl}/purchase/user/${user.id}`)
          .then((res) => res.json())
          .then((data) => setProducts(data))
          .catch((error) => conaole.error("ErRoR", error));
      }, []);
      console.log(products);
    return(
        <div>
           <Header/>
            <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto ml-[10%] mr-[10%] rounded-lg bg-gray-100">
                {products.map((product) => (
                    <div key={product._id} className="bg-neutral-100 h-[100%] rounded-md shadow-md shadow-gray-500 hover:shadow-lg transition-all hover:cursor-pointer pb-3">
                        <img className="w-[100%] h-[180px]" src={product.productId.image} alt="Sorry" />
                        <div className="text-right" dir="rtl">
                            <h1>عدد القطع المطلوبة: {product.quantity}</h1>
                            <h1>حالة الطلب: {product.status}</h1>
                            <h1>السعر الكلي: ${product.total}</h1>
                            <h1>الملاحظات: {product.description}</h1>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    )
}