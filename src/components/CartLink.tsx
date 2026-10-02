"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartLink() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex min-h-10 items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-[#284239] transition hover:text-[#e76d61]"
      aria-label={`Cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
    >
      Cart

      {itemCount > 0 && (
        <span className="ml-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#e76d61] px-1.5 text-[11px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
