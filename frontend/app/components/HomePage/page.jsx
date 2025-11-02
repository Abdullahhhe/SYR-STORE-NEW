'use client';
import { useState , useEffect } from "react";
import {getProduct} from "../../services/productService";
import Link from "next/link";
import Header from "../Header";
import { useFilter } from '../../../context/FilterContext';
export default function HomePage({product}){
const user=JSON.parse(localStorage.getItem("user"));
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log(user);
  const [products,setProducts]=useState([]);
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProduct();
      setProducts(data);
    };
    fetchProduct();
  }, []);
  const { category } = useFilter();
  const filtered = category === 'all'
    ? products
    : products.filter((p) => p.category === category);
    const images=[
        "/assets/SYR-Store/img1.jpg",
        "/assets/SYR-Store/img2.jpg",
        "/assets/SYR-Store/img3.jpg",
        "/assets/SYR-Store/img4.jpg",
        "/assets/SYR-Store/img5.jpg",
        "/assets/SYR-Store/img6.jpg",
        "/assets/SYR-Store/img7.jpg",
        "/assets/SYR-Store/img8.jpg",
        "/assets/SYR-Store/img9.jpg"
    ];
    const [current, setCurrent] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }, []);
    return (
      <div className="bg-gray-100">
      <Header/>
        <div className="mt-[-30px] w-[100%] h-[400px] bg-gray-950">
          <div className="mt-[70px] p-[4%] w-[70%] md:w-[40%] absolute translate-[-50% , -50%] text-white font-bold text-shadow-2xl bg-black/20 rounded-2xl ">
            <h1 className="text-3xl ml-[10px] mb-3">
              <span className="text-red-600 font-bold">SYR</span>-Store
            </h1>
            <h2 className="text-2xl text-center">
              سوق <span className="text-black"> سوريا</span> الألكتروني
            </h2>
            <p className="text-lg font-light text-right">
              مختصين ببيع كل شيء جديد ومستعمل بتجربة مستخدم سلسة وسهلة , قمنا
              بجعل كل شيء قريب منك
            </p>
            <button className="bg-red-600 text-white rounded-xl mt-[30px] text-center w-[40%] text-sm h-[30px] font-light ml-[20%] transition-all duration-200 hover:bg-red-700 cursor-pointer">
              أبدأ الأن
            </button>
          </div>
          <img
            src={images[current]}
            alt="sorry"
            className=" w-[100%] h-full rounded-2xl "
          />
        </div>
        <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto ml-[10%] mr-[10%] rounded-lg bg-gray-100">
          {filtered.map((product) => (
            <div
              key={product._id}
              className="bg-neutral-100 h-[100%] rounded-md shadow-md shadow-gray-500 hover:shadow-lg transition-all hover:cursor-pointer pb-3"
            >
              <img
                src={product.image}
                alt="sorry"
                className="w-[100%] h-[180px]"
              />
              <h1 className="text-center text-lg font-bold">{product.name}</h1>
              <p className="text-sm mt-[5px] text-center">
                {product.description}
              </p>
              <div className="flex justify-around">
                <p className="mt-[5px]">
                  <span className="font-bold text-orange-400">
                    {product.new_price}$
                  </span>
                </p>
                <p className="mt-[5px]">
                التقيم:
                  <span className="font-bold text-orange-400">4.2</span>
                </p>
              </div>
              <div className="flex justify-between mt-[4px] w-[100%]">
                <Link
                  className="bg-blue-500 text-white rounded-sm cursor-pointer transition-all duration-200 hover:bg-blue-700 text-center w-[100%]"
                  href={`/components/prodects/${product._id}`}
                >
                  المنتج
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}