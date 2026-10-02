import type { Metadata } from "next";
import CartPageClient from "@/components/CartPageClient";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your Port Petals shopping cart.",
};

export default function CartPage() {
  return <CartPageClient />;
}
