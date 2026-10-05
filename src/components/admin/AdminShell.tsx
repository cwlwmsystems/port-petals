"use client";

import type {
  ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/app/admin/LogoutButton";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Orders",
    href: "/admin/orders",
  },
  {
    label: "Calendar",
    href: "/admin/calendar",
  },
  {
    label: "Customers",
    href: "/admin/customers",
  },
  {
    label: "Marketing",
    href: "/admin/marketing",
  },
  {
    label: "Weddings",
    href: "/admin/weddings",
  },
  {
    label: "Products",
    href: "/admin/products",
  },
];

function isActivePath(
  pathname: string,
  href: string
) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return (
    pathname === href ||
    pathname.startsWith(
      `${href}/`
    )
  );
}

function navClass(
  active: boolean,
  mobile = false
) {
  if (mobile) {
    return active
      ? "flex min-h-11 items-center justify-center rounded-lg bg-white px-2 text-center text-xs font-semibold text-[#153f32] shadow-sm"
      : "flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2 text-center text-xs font-semibold text-[#e1e8e4] transition hover:bg-white/10";
  }

  return active
    ? "inline-flex min-h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-[#153f32] shadow-sm"
    : "inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-[#d7e0dc] transition hover:bg-white/10 hover:text-white";
}

export default function AdminShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname =
    usePathname();

  if (
    pathname ===
      "/admin/login" ||
    pathname.startsWith(
      "/admin/login/"
    )
  ) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f2f4f1] text-[#284239]">
      <header className="border-b border-[#284239]/10 bg-[#153f32] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Brand / account row */}
          <div className="flex min-h-16 items-center justify-between gap-3 sm:min-h-20">
            <Link
              href="/admin"
              className="min-w-0"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f3b0aa] sm:text-[11px]">
                Port Petals
              </p>

              <p className="mt-1 font-serif text-xl font-semibold leading-none text-white sm:text-2xl">
                Admin
              </p>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/"
                className="hidden min-h-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
              >
                View Storefront
              </Link>

              <LogoutButton />
            </div>
          </div>

          {/* Mobile navigation */}
          <nav
            aria-label="Admin navigation"
            className="border-t border-white/10 py-3 sm:hidden"
          >
            <div className="grid grid-cols-4 gap-1.5">
              {navItems.map(
                (item) => {
                  const active =
                    isActivePath(
                      pathname,
                      item.href
                    );

                  return (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                      className={
                        navClass(
                          active,
                          true
                        )
                      }
                    >
                      {item.label}
                    </Link>
                  );
                }
              )}

              <Link
                href="/"
                className="flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2 text-center text-xs font-semibold text-[#e1e8e4] transition hover:bg-white/10"
              >
                Store
              </Link>
            </div>
          </nav>

          {/* Tablet / desktop navigation */}
          <nav
            aria-label="Admin navigation"
            className="hidden border-t border-white/10 sm:block"
          >
            <div className="flex flex-wrap items-center gap-1 py-3">
              {navItems.map(
                (item) => {
                  const active =
                    isActivePath(
                      pathname,
                      item.href
                    );

                  return (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                      className={
                        navClass(
                          active
                        )
                      }
                    >
                      {item.label}
                    </Link>
                  );
                }
              )}
            </div>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
