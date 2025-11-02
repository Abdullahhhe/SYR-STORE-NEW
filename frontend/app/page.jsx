'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home(){
    const router=useRouter();
    useEffect(()=>{
        const storeUser=localStorage.getItem("user");
        if(storeUser){
            const user=JSON.parse(storeUser);
            if(user.role==="merchant"){
                router.push("/components/merchant/addProduct");
            }
            else router.push("/components/HomePage")
        }
    })
    return(
        <div className="mt-[-20px] bg-gray-50">
            يتم التحميل
        </div>
    )
}