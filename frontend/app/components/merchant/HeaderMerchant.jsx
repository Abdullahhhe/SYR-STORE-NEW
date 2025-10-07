import Link from "next/link"
export default function HeaderMerchant(){
  const merchant = JSON.parse(localStorage.getItem("user"));
    return (
      <div dir="rtl" className="md:flex justify-around md:text-right min-w-max text-center mb-[20px]">
        <h1 className="text-2xl font-bold w-full">صفحة خاصة بالتاجر</h1>
        <div className="flex justify-around w-full text-center mt-[20px] md:mt-0">
          <Link className="transition-all duration-300 hover:text-blue-700" href={"/"}>اضافة منتج</Link>
          <Link className="transition-all duration-300 hover:text-blue-700" href={"/components/merchant/viewAndDelete"}>عرض المنتجات</Link>
          <Link className="transition-all duration-300 hover:text-blue-700" href={`/components/merchant/merchantOrder/${merchant.id}`}>المبيعات</Link>
          <Link className="transition-all duration-300 hover:text-blue-700" href={"/components/login"}>تسجيل الخروج</Link>
        </div>
      </div>
    );
}