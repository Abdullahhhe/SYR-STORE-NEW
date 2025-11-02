import ProductDetails from "../../../components/ProductDetails";

export default async function ProductPage({ params }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/product/${params.id}`, {
    cache: "no-store", // لجلب البيانات في كل مرة
  });
  const product = await res.json();

  return <ProductDetails product={product} />;
}
