'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storeUser = localStorage.getItem("user");
            if (storeUser) {
                const user = JSON.parse(storeUser);
                if (user.role === "merchant") {
                    router.push("components/addProduct");
                } else if (user.role === "admin") {
                    router.push("components/dashboard");
                } else {
                    router.push("components/HomePage");
                }
            }
            if(!storeUser) {
                router.push("components/HomePage");
            }
        }
    }, []);

    return (
        <div className="mt-[-20px] bg-gray-50">
            يتم التحميل...
        </div>
    );
}