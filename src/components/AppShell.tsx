"use client";

import type {
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import CartProvider from "@/components/CartProvider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname =
    usePathname();

  const isAdmin =
    pathname === "/admin" ||
    pathname.startsWith(
      "/admin/"
    );

  return (
    <CartProvider>
      {!isAdmin && (
        <SiteHeader />
      )}

      {children}

      {!isAdmin && (
        <SiteFooter />
      )}
    </CartProvider>
  );
}
