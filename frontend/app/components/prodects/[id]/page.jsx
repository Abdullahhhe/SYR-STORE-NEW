import ProductDetails from "../../../components/ProductDetails";

export default async function ProductPage({ params }) {
  const res = await fetch(`http://localhost:3000/api/product/${params.id}`, {
    cache: "no-store", // لجلب البيانات في كل مرة
  });
  const product = await res.json();

  return <ProductDetails product={product} />;
}
