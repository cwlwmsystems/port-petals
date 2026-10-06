"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "Overview",
    href: "/account",
  },
  {
    label: "Orders",
    href: "/account/orders",
  },
  {
    label: "Rewards",
    href: "/account/rewards",
  },
  {
    label: "Wishlist",
    href: "/account/wishlist",
  },
  {
    label: "Referrals",
    href: "/account/referrals",
  },
  {
    label: "Profile",
    href: "/account/profile",
  },
];

function isActive(
  pathname: string,
  href: string
) {
  if (href === "/account") {
    return pathname === "/account";
  }

  return (
    pathname === href ||
    pathname.startsWith(
      `${href}/`
    )
  );
}

export default function AccountNavigation() {
  const pathname =
    usePathname();

  return (
    <nav
      aria-label="Account navigation"
      className="border-y border-[#284239]/10 bg-white/80 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10">
        <div className="-mx-1 overflow-x-auto px-1">
          <div className="flex min-w-max gap-1 py-2.5">
            {items.map(
              (item) => {
                const active =
                  isActive(
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
                    className={[
                      "relative inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e76d61]/40 focus-visible:ring-offset-2",
                      active
                        ? "bg-[#153f32] text-white shadow-sm"
                        : "text-[#536860] hover:bg-[#edf3e7] hover:text-[#153f32]",
                    ].join(
                      " "
                    )}
                  >
                    {item.label}

                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 h-1 w-1 rounded-full bg-[#e76d61]"
                      />
                    )}
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
