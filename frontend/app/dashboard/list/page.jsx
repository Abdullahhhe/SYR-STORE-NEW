import Link from "next/link";
export default function List(){
    return(
        <div className="w-[30%] h-auto bg-gray-600 pt-[10px] text-white text-center fixed left-0 rounded-b-lg p-10">
            <h1 className="text-2xl font-black mt-[30px] mb-[30px]">Admin</h1>
            <hr className="text-white border"/>
            <br/>
            <ul className="mt-[20px] text-gray-200 text-lg font-bold">
                <li className="mt-[15px]"><Link href={"/dashboard/guest"} className="transition-all duration-200 hover:text-blue-300 hover:underline">Home</Link></li>
                <li className="mt-[15px]"><Link href={"/dashboard/merchant"} className="transition-all duration-200 hover:text-blue-300 hover:underline">Merchant</Link></li>
                <li className="mt-[15px]"><Link href={"/dashboard/addMerchant"} className="transition-all duration-200 hover:text-blue-300 hover:underline">Add Merchant</Link></li>
                <li className="mt-[15px]"><Link href={"/dashboard/users"} className="transition-all duration-200 hover:text-blue-300 hover:underline">Users</Link></li>
                <li className="mt-[15px]"><Link href={"/components/login"} className="transition-all duration-200 hover:text-blue-300 hover:underline">LogOut</Link></li>
            </ul>
        </div>
    )
}