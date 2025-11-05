const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function createMerchantOrder({
  merchantId,
  productId,
  buyerId,
  purchaseId,
  quantity,
}) {
  try {
    const res = await fetch(`${ apiUrl }/merchant-orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchantId,
        productId,
        buyerId,
        purchaseId,
        quantity,
      }),
    });

    if (!res.ok) throw new Error("فشل في إنشاء الطلب");
    return await res.json();
  } catch (error) {
    console.error("❌ خطأ في createMerchantOrder:", error);
    return null;
  }
}

export async function getOrdersByMerchant(merchantId) {
  try {
    const res = await fetch(`${ apiUrl }/merchant-orders/by-merchant/${ merchantId }`);
    if (!res.ok) throw new Error("فشل في جلب الطلبات");
    return await res.json();
  } catch (error) {
    console.error("❌ خطأ في getOrdersByMerchant:", error);
    return [];
  }
}

export const getAllMerchantOrders = async () => {
  try {
    const res = await fetch(`${apiUrl}/merchant-orders`);
    if (!res.ok) throw new Error("فشل في جلب الطلبات");
    return await res.json();
  } catch (err) {
    console.error("❌ خطأ في getAllMerchantOrders:", err);
    return [];
  }
};

export async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`${ apiUrl }/merchant-orders/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });

    if (!res.ok) throw new Error("فشل في تحديث الطلب");
    return await res.json();
  } catch (error) {
    console.error("❌ خطأ في updateOrderStatus:", error);
    return null;
  }
}