"use client";
import dynamic from "next/dynamic";

const ViewAndDeleteClient= dynamic(
  () => import("../../../components/merchant/ViewAndDeleteClient"),
  { ssr: false }
);

export default function Page() {
  return <ViewAndDeleteClient/>;
}