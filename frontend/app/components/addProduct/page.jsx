"use client";
import dynamic from "next/dynamic";

const AddProductForm = dynamic(
  () => import("../../../components/merchant/AddProductFrom"),
  { ssr: false }
);

export default function Page() {
  return <AddProductForm />;
}