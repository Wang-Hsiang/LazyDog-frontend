"use client";
import { useRouter } from "next/navigation";

export default function CartPage(props) {
  const router = useRouter();
  router.push("/cart/CartList");
  return (
    <>

    </>
  );
}