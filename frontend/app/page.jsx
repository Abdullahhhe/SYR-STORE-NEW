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
                    router.push("/addProduct");
                } else if (user.role === "admin") {
                    router.push("/dashboard");
                } else {
                    router.push("/homepage");
                }
            }
            if(!storeUser) {
                router.push("/homepage");
            }
        }
    }, []);

    return (
        <div className="mt-[-20px] bg-gray-50">
            يتم التحميل...
        </div>
    );
}