import type { Metadata } from "next";
import CheckoutClient from "@/components/CheckoutClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  title: "Checkout",
  description: "Complete your Port Petals order.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
